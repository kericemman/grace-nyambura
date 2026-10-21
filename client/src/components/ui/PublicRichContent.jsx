export function PublicRichContent({ html }) {
  return (
    <div
      className="text-base leading-8 text-body [&_a]:text-emerald [&_a]:underline [&_blockquote]:my-7 [&_blockquote]:border-l-2 [&_blockquote]:border-emerald [&_blockquote]:pl-5 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-primary md:[&_h2]:text-2xl lg:[&_h2]:text-3xl [&_iframe]:my-8 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:border-0 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
