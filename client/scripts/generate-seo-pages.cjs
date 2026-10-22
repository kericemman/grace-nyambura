const fs = require('node:fs');
const path = require('node:path');

const dist = path.resolve(__dirname, '../dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const siteUrl = 'https://gracenyambura.com';
const pages = {
  about: ['About Me | Grace Nyambura', 'Learn about my journalism background and thoughtful approach to helping founders turn their expertise into clear, credible LinkedIn content.'],
  insights: ['LinkedIn and Personal Brand Insights | Grace Nyambura', 'Read practical perspectives on founder visibility, LinkedIn content, storytelling, authority, and communicating expertise clearly.'],
  'client-stories': ['Client Stories | Grace Nyambura', 'Explore approved client stories showing how I approach founder positioning, LinkedIn content, and personal brand communication.'],
  contact: ['Contact Me | Grace Nyambura', 'Tell me about your LinkedIn content goals, current visibility challenges, and the support you need.'],
  'linkedin-partnership': ['LinkedIn Content Partnership | Grace Nyambura', 'Apply for an ongoing LinkedIn content partnership built around your voice, expertise, positioning, and business goals.'],
  'privacy-policy': ['Privacy Policy | Grace Nyambura', 'Read how I collect, use, store, and protect information submitted through this website.'],
  terms: ['Terms of Service | Grace Nyambura', 'Read the terms governing use of this website, its forms, content, and professional service enquiries.'],
};

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function render(route, title, description) {
  const url = `${siteUrl}/${route}`;
  return template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/, `$1${escapeAttribute(description)}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*("\s*\/?>)/, `$1${url}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/?>)/, `$1${escapeAttribute(title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?>)/, `$1${escapeAttribute(description)}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*("\s*\/?>)/, `$1${url}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*("\s*\/?>)/, `$1${escapeAttribute(title)}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*("\s*\/?>)/, `$1${escapeAttribute(description)}$2`);
}

for (const [route, [title, description]] of Object.entries(pages)) {
  const directory = path.join(dist, route);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), render(route, title, description));
}
