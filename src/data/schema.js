import { SITE } from './site.js';

export const organization = {
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  "name": "Avishkar AI",
  "legalName": "Anjaneyaai Technologies Private Limited",
  "url": `${SITE}/`,
  "logo": `${SITE}/assets/img/icon-512.png`,
  "image": `${SITE}/assets/img/og.jpg`,
  "description": "Avishkar AI builds contact centre intelligence: AI call quality assurance and speech analytics that score 100% of calls.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "email": "arpit@avishkarai.com",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "arpit@avishkarai.com",
    "areaServed": "Worldwide",
    "availableLanguage": ["English"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/anjaneya-ai"
  ],
  "founder": [
    {
      "@type": "Person",
      "name": "Shivang Kumar",
      "sameAs": "https://www.linkedin.com/in/shivng/"
    },
    {
      "@type": "Person",
      "name": "Arpit Sharma",
      "sameAs": "https://www.linkedin.com/in/arpitsharmawriting/"
    }
  ],
  "knowsAbout": [
    "call quality assurance",
    "speech analytics",
    "conversation intelligence",
    "contact centre QA automation",
    "customer churn prediction",
    "agent coaching"
  ]
};

export const website = {
  "@type": "WebSite",
  "@id": `${SITE}/#site`,
  "name": "Avishkar AI",
  "url": `${SITE}/`,
  "publisher": {
    "@id": `${SITE}/#org`
  },
  "inLanguage": "en"
};

const pageNodes = {
  "index": [
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      "url": `${SITE}/`,
      "name": "Avishkar AI",
      "isPartOf": { "@id": `${SITE}/#site` },
      "about": { "@id": `${SITE}/#org` },
      "inLanguage": "en"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do we need to integrate anything first?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Fill in a one-minute form, we email you a secure upload link, and you send a batch of recordings. Integrations come later, once you decide to roll out."
          }
        },
        {
          "@type": "Question",
          "name": "Can we use our existing QA scorecard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Verdicta is configured to match your QA form, with 20+ parameters, fatal and non-fatal scoring, and the weightage you set."
          }
        },
        {
          "@type": "Question",
          "name": "Where does our call data live?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our cloud, your private cloud, or on-premises. Avishkar AI is ISO 27001 certified, and pilot data is used only for your pilot."
          }
        },
        {
          "@type": "Question",
          "name": "Which languages do you support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "English, Spanish, French, German, Portuguese, Arabic and Mandarin, including calls that switch language mid-conversation."
          }
        },
        {
          "@type": "Question",
          "name": "Do we need both products?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Use Verdicta, Veritune, or both on the same calls and the same dashboard."
          }
        },
        {
          "@type": "Question",
          "name": "How is pricing structured?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It depends on your monthly call volume, the products you use and where you deploy. We share a proposal after your pilot."
          }
        }
      ]
    }
  ],
  "verdicta": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${SITE}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Verdicta",
          "item": `${SITE}/verdicta`
        }
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "Verdicta",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Contact centre software",
      "operatingSystem": "Web",
      "url": `${SITE}/verdicta`,
      "description": "AI call quality assurance: applies your QA scorecard to 100% of recorded calls with fatal flags, summaries and heat maps.",
      "publisher": {
        "@id": `${SITE}/#org`
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free pilot on your own recorded calls"
      }
    }
  ],
  "veritune": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${SITE}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Veritune",
          "item": `${SITE}/veritune`
        }
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "Veritune",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Contact centre software",
      "operatingSystem": "Web",
      "url": `${SITE}/veritune`,
      "description": "Customer signal from every call: tone, competitor mentions, churn risk and next best action.",
      "publisher": {
        "@id": `${SITE}/#org`
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free pilot on your own recorded calls"
      }
    }
  ],
  "journey": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${SITE}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Our journey",
          "item": `${SITE}/journey`
        }
      ]
    },
    {
      "@type": "Person",
      "name": "Shivang Kumar",
      "jobTitle": "Co-founder",
      "worksFor": { "@id": `${SITE}/#org` },
      "sameAs": "https://www.linkedin.com/in/shivng/"
    },
    {
      "@type": "Person",
      "name": "Arpit Sharma",
      "jobTitle": "Co-founder",
      "worksFor": { "@id": `${SITE}/#org` },
      "sameAs": "https://www.linkedin.com/in/arpitsharmawriting/"
    }
  ],
  "pilot": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${SITE}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Free pilot",
          "item": `${SITE}/pilot`
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How many calls should we send?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Send a batch that reflects a normal week for your team. We will confirm the right size when we reply to your request."
          }
        },
        {
          "@type": "Question",
          "name": "Do we need to integrate anything?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. A recording upload or CSV is enough to start."
          }
        },
        {
          "@type": "Question",
          "name": "Can you use our QA scorecard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Share your QA form and Verdicta is configured to match it."
          }
        },
        {
          "@type": "Question",
          "name": "What does the pilot cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The pilot is free. Pricing for a rollout depends on call volume, products and deployment, and we share a proposal after your results."
          }
        }
      ]
    }
  ],
  "privacy": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${SITE}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Privacy Policy",
          "item": `${SITE}/privacy`
        }
      ]
    }
  ],
  "terms": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${SITE}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Terms of Service",
          "item": `${SITE}/terms`
        }
      ]
    }
  ],
  "accessibility": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "Accessibility", "item": `${SITE}/accessibility` }
      ]
    }
  ],
  "contact": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
        { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${SITE}/contact` }
      ]
    },
    { "@type": "ContactPage", "name": "Contact Avishkar AI", "url": `${SITE}/contact` }
  ]
};

export function schemaGraph(page) {
  return { '@context': 'https://schema.org', '@graph': [organization, website, ...pageNodes[page]] };
}
