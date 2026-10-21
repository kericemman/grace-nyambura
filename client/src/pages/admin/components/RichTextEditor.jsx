import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, ImagePlus, Italic, Link as LinkIcon, List, ListOrdered, LoaderCircle, Quote, Youtube as YoutubeIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { apiRequest } from '../../../lib/api';

const tools = [
  ['Bold', Bold, (editor) => editor.chain().focus().toggleBold().run(), (editor) => editor.isActive('bold')],
  ['Italic', Italic, (editor) => editor.chain().focus().toggleItalic().run(), (editor) => editor.isActive('italic')],
  ['Heading', Heading2, (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(), (editor) => editor.isActive('heading', { level: 2 })],
  ['Bullet list', List, (editor) => editor.chain().focus().toggleBulletList().run(), (editor) => editor.isActive('bulletList')],
  ['Numbered list', ListOrdered, (editor) => editor.chain().focus().toggleOrderedList().run(), (editor) => editor.isActive('orderedList')],
  ['Quote', Quote, (editor) => editor.chain().focus().toggleBlockquote().run(), (editor) => editor.isActive('blockquote')],
];

export function RichTextEditor({ label, value, onChange, error, category = 'article' }) {
  const imageInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      Image.configure({ allowBase64: false, HTMLAttributes: { class: 'editor-image' } }),
      Youtube.configure({ controls: true, nocookie: true, modestBranding: true, HTMLAttributes: { class: 'editor-youtube' } }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-64 px-4 py-4 text-base leading-7 text-body outline-none [&_h2]:mt-7 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-primary [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-emerald [&_blockquote]:pl-4 [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_iframe]:my-5 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full',
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  function setLink() {
    const previous = editor.getAttributes('link').href;
    const url = window.prompt('Enter the link URL', previous ?? 'https://');
    if (url === null) return;
    if (!url) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !editor) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);
      const result = await apiRequest('/admin/media/editor-image', { method: 'POST', body: formData });
      const alt = window.prompt('Describe this image for accessibility', file.name.replace(/\.[^.]+$/, '')) ?? '';
      editor.chain().focus().setImage({ src: result.data.url, alt, title: alt }).run();
    } catch (uploadFailure) {
      setUploadError(uploadFailure.message);
    } finally {
      setUploading(false);
    }
  }

  function addYoutubeVideo() {
    if (!editor) return;
    const url = window.prompt('Paste a YouTube video URL');
    if (!url) return;
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      setUploadError('Enter a valid YouTube URL.');
      return;
    }
    setUploadError('');
    editor.commands.setYoutubeVideo({ src: url, width: 720, height: 405 });
  }

  return (
    <div>
      <p className="text-sm font-semibold text-primary">{label}</p>
      <div className={`mt-2 overflow-hidden border bg-white ${error ? 'border-red-600' : 'border-border focus-within:border-emerald'}`}>
        <div className="flex flex-wrap gap-1 border-b border-border bg-ivory p-2">
          {tools.map(([name, Icon, action, active]) => (
            <button className={`grid h-9 w-9 place-items-center transition ${editor && active(editor) ? 'bg-primary text-white' : 'text-muted hover:bg-white hover:text-primary'}`} key={name} type="button" title={name} aria-label={name} onClick={() => editor && action(editor)}>
              <Icon size={17} aria-hidden="true" />
            </button>
          ))}
          <button className={`grid h-9 w-9 place-items-center transition ${editor?.isActive('link') ? 'bg-primary text-white' : 'text-muted hover:bg-white hover:text-primary'}`} type="button" title="Link" aria-label="Add link" onClick={setLink}>
            <LinkIcon size={17} aria-hidden="true" />
          </button>
          <button className="grid h-9 w-9 place-items-center text-muted transition hover:bg-white hover:text-primary disabled:opacity-50" type="button" title="Upload image" aria-label="Upload image" disabled={uploading} onClick={() => imageInput.current?.click()}>
            {uploading ? <LoaderCircle className="animate-spin" size={17} aria-hidden="true" /> : <ImagePlus size={17} aria-hidden="true" />}
          </button>
          <button className="grid h-9 w-9 place-items-center text-muted transition hover:bg-white hover:text-primary" type="button" title="Embed YouTube video" aria-label="Embed YouTube video" onClick={addYoutubeVideo}>
            <YoutubeIcon size={18} aria-hidden="true" />
          </button>
          <input className="sr-only" ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadImage} />
        </div>
        <EditorContent editor={editor} />
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {uploadError && <p className="mt-2 text-sm text-red-700" role="alert">{uploadError}</p>}
    </div>
  );
}
