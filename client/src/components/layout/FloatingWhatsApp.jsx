export function FloatingWhatsApp({ phone }) {
  const number = String(phone ?? '').replace(/\D/g, '');
  if (!number) return null;

  const message = encodeURIComponent(
    'Hello, I would like to learn more about your LinkedIn Content Partnership.',
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      className="group fixed right-4 bottom-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_12px_35px_rgba(18,140,73,0.35)] transition hover:-translate-y-1 hover:bg-[#1ebe5d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald sm:right-6 sm:bottom-6"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with me on WhatsApp"
    >
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded bg-primary px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
      <WhatsAppIcon />
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.04 3A12.9 12.9 0 0 0 5 22.55L3.3 29l6.6-1.73A12.94 12.94 0 1 0 16.04 3Zm0 23.7a10.7 10.7 0 0 1-5.45-1.49l-.39-.23-3.91 1.02 1.04-3.81-.25-.4A10.73 10.73 0 1 1 16.04 26.7Zm5.89-8.02c-.32-.16-1.91-.94-2.21-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.27-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.58-1.6a9.63 9.63 0 0 1-1.79-2.23c-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.15 3.09 1.31 3.3.16.21 2.25 3.44 5.45 4.82.76.33 1.36.52 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.91-.78 2.18-1.54.27-.75.27-1.4.19-1.54-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}
