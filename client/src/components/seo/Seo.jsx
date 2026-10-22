import { useEffect } from 'react';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://gracenyambura.com').replace(/\/$/, '');
const DEFAULT_IMAGE = 'https://res.cloudinary.com/xnyxegiy/image/upload/w_1200,h_630,c_fill,g_face,f_auto,q_auto/v1792224823/Linkedin_pp.png';
const BRAND = 'Grace Nyambura';

function upsertMeta(attribute, key, content) {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
}

export function Seo({
  canonicalPath = '/', description, image = DEFAULT_IMAGE, noIndex = false,
  publishedTime, structuredData, title, type = 'website',
}) {
  useEffect(() => {
    const fullTitle = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
    const canonicalUrl = canonicalPath.startsWith('http')
      ? canonicalPath
      : `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

    document.title = fullTitle;
    upsertCanonical(canonicalUrl);
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    upsertMeta('property', 'og:site_name', BRAND);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:alt', title);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    if (publishedTime) upsertMeta('property', 'article:published_time', publishedTime);

    document.head.querySelector('script[data-site-structured-data]')?.remove();
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.siteStructuredData = 'true';
      script.textContent = JSON.stringify(structuredData).replace(/</g, '\\u003c');
      document.head.appendChild(script);
    }

    return () => document.head.querySelector('script[data-site-structured-data]')?.remove();
  }, [canonicalPath, description, image, noIndex, publishedTime, structuredData, title, type]);

  return null;
}

export { DEFAULT_IMAGE, SITE_URL };
