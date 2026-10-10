import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const template = await readFile(join(root, 'scripts', 'sw-template.js'), 'utf8');
const candidates = [
  join(root, '.vercel', 'output', 'static'),
  join(root, 'dist', 'client'),
  join(root, 'dist'),
];

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}
async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) out.push(...await walk(path));
    else out.push(path);
  }
  return out;
}
function routeFor(file, dir) {
  const rel = relative(dir, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'/index.html'.length);
  if (rel.endsWith('.html')) return '/' + rel.slice(0, -'.html'.length);
  return '/' + rel;
}

for (const dir of candidates) {
  if (!(await exists(dir)) || !(await exists(join(dir, 'index.html')))) continue;
  const files = await walk(dir);
  const hash = createHash('sha256');
  for (const file of files.sort()) {
    if (file.endsWith(`${sep}sw.js`)) continue;
    hash.update(relative(dir, file));
    hash.update(await readFile(file));
  }
  const version = hash.digest('hex').slice(0, 12);
  const precache = new Set(['/', '/verdicta', '/veritune', '/pilot', '/journey', '/privacy', '/terms', '/accessibility', '/contact', '/offline.html']);
  for (const file of files) {
    const rel = relative(dir, file).split(sep).join('/');
    if (rel === '404.html' || rel === 'sw.js') continue;
    if (rel.endsWith('.html')) precache.add(routeFor(file, dir));
    else if (rel.startsWith('_astro/') || rel.startsWith('assets/fonts/') || rel === 'assets/img/logo.svg' || rel === 'favicon.svg' || rel === 'og-image.png' || rel === 'offline.html') precache.add('/' + rel);
  }
  const body = template.replace('__CACHE__', `av-${version}`).replace('__PRECACHE__', JSON.stringify([...precache]));
  await writeFile(join(dir, 'sw.js'), body);
  console.log(`stamped sw.js in ${dir} as av-${version} (${precache.size} urls)`);
}
