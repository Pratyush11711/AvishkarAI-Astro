import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { RESEND_API_KEY, MAIL_FROM, MAIL_TO, SHEET_WEBHOOK_URL, SHEET_SECRET } from 'astro:env/server';

export const prerender = false;

type Fields = Record<string, string | string[] | boolean>;
type FormType = 'pilot' | 'question';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX_ARRAY = 10;
const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

/* label + key, in the order they appear in the email */
const PILOT_ROWS: [string, string][] = [
  ['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Role', 'role'], ['Company', 'company'],
  ['Industry', 'industry'], ['Agents on the floor', 'agents'], ['Call minutes per month', 'callMinutes'],
  ['Languages', 'languages'], ['Product', 'product'], ['What matters most', 'priorities'],
  ['Has a QA scorecard', 'hasScorecard'], ['Sharing method', 'sharingMethod'], ['Deployment', 'deployment'],
  ['Start timeline', 'startTimeline'], ['Consent', 'consent'],
];
const QUESTION_ROWS: [string, string][] = [
  ['Name', 'name'], ['Email', 'email'], ['Company', 'company'], ['Topic', 'topic'],
  ['Question', 'question'], ['Consent', 'consent'],
];

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const esc = (v: unknown) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
function list(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => str(x, 200)).filter(Boolean).slice(0, MAX_ARRAY);
}

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  return false;
}

function clean(formType: FormType, b: Record<string, unknown>): { fields?: Fields; error?: string } {
  if (formType === 'pilot') {
    const f: Fields = {
      name: str(b.name, 100), email: str(b.email, 200), phone: str(b.phone, 200), role: str(b.role, 200),
      company: str(b.company, 150), industry: str(b.industry, 200), agents: str(b.agents, 200),
      callMinutes: str(b.callMinutes, 200), languages: list(b.languages), product: str(b.product, 200),
      priorities: list(b.priorities), hasScorecard: str(b.hasScorecard, 200), sharingMethod: str(b.sharingMethod, 200),
      deployment: str(b.deployment, 200), startTimeline: str(b.startTimeline, 200), consent: b.consent === true,
    };
    if (!f.name) return { error: 'Name is required.' };
    if (!EMAIL_RE.test(f.email as string)) return { error: 'A valid email is required.' };
    if (!f.company) return { error: 'Company is required.' };
    if (f.consent !== true) return { error: 'Consent is required.' };
    return { fields: f };
  }
  const f: Fields = {
    name: str(b.name, 100), email: str(b.email, 200), company: str(b.company, 150),
    topic: str(b.topic, 200), question: str(b.question, 2000), consent: b.consent === true,
  };
  if (!f.name) return { error: 'Name is required.' };
  if (!EMAIL_RE.test(f.email as string)) return { error: 'A valid email is required.' };
  if (!f.question) return { error: 'Question is required.' };
  if (f.consent !== true) return { error: 'Consent is required.' };
  return { fields: f };
}

function show(v: string | string[] | boolean | undefined): string {
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  return v || '';
}

function buildEmail(formType: FormType, f: Fields) {
  const rows = formType === 'pilot' ? PILOT_ROWS : QUESTION_ROWS;
  const when = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' }) + ' IST';
  const title = formType === 'pilot' ? 'New pilot request' : 'New question';
  const subject =
    formType === 'pilot'
      ? `New pilot request: ${f.company} (${f.name})`
      : `New question (${f.topic || 'General'}) from ${f.name}`;
  const trs = rows
    .map(([label, key]) => `<tr><td style="padding:10px 14px;border:1px solid #e6e4df;background:#f7f6f3;font-weight:600;width:200px;vertical-align:top">${esc(label)}</td><td style="padding:10px 14px;border:1px solid #e6e4df;vertical-align:top;white-space:pre-wrap">${esc(show(f[key]) || '-')}</td></tr>`)
    .join('');
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0c0c0d;max-width:640px;margin:0 auto"><h2 style="margin:0 0 4px">${esc(title)}</h2><p style="margin:0 0 18px;color:#5f5b55;font-size:13px">Received ${esc(when)}</p><table style="border-collapse:collapse;width:100%;font-size:14px">${trs}</table></div>`;
  const text = `${title}\nReceived ${when}\n\n` + rows.map(([label, key]) => `${label}: ${show(f[key]) || '-'}`).join('\n');
  return { subject, html, text };
}

async function sendMail(formType: FormType, f: Fields) {
  const to = (MAIL_TO || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!RESEND_API_KEY || !MAIL_FROM || !to.length) throw new Error('Resend is not configured (RESEND_API_KEY, MAIL_FROM, MAIL_TO).');
  const resend = new Resend(RESEND_API_KEY);
  const { subject, html, text } = buildEmail(formType, f);
  const { data, error } = await resend.emails.send({ from: MAIL_FROM, to, replyTo: f.email as string, subject, html, text });
  if (error) throw new Error(`${error.name || 'ResendError'}: ${error.message}`);
  return data;
}

async function saveSheet(formType: FormType, f: Fields) {
  if (!SHEET_WEBHOOK_URL) throw new Error('Sheet webhook is not configured (SHEET_WEBHOOK_URL).');
  const res = await fetch(SHEET_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: SHEET_SECRET, formType, ...f }),
    redirect: 'follow',
    /* Apps Script web apps can take 10s+ on a cold start, so give it room. */
    signal: AbortSignal.timeout(25000),
  });
  const raw = await res.text();
  let out: { ok?: boolean; error?: string } | null = null;
  try { out = JSON.parse(raw); } catch { /* not JSON */ }
  if (!res.ok || !out || out.ok !== true) {
    throw new Error(`Sheet webhook failed (HTTP ${res.status}): ${out?.error || raw.slice(0, 200)}`);
  }
  return out;
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('bad body');
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: 'Invalid request.' });
  }

  const formType = body.formType;
  if (formType !== 'pilot' && formType !== 'question') return json(400, { ok: false, error: 'Unknown form type.' });

  if (typeof body.company_website === 'string' && body.company_website.trim() !== '') return json(200, { ok: true });

  /* Rate limit is switched off for now. To re-enable, uncomment these two lines:
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return json(429, { ok: false, error: 'Too many requests. Please try again in a few minutes.' });
  */

  const { fields, error } = clean(formType, body);
  if (!fields) return json(400, { ok: false, error });

  const [mail, sheet] = await Promise.allSettled([sendMail(formType, fields), saveSheet(formType, fields)]);
  if (mail.status === 'rejected') console.error(`[contact:${formType}] email failed:`, mail.reason);
  if (sheet.status === 'rejected') console.error(`[contact:${formType}] sheet failed:`, sheet.reason);

  if (mail.status === 'rejected' && sheet.status === 'rejected') {
    return json(500, { ok: false, error: 'We could not send your request. Please try again.' });
  }
  return json(200, { ok: true });
};
