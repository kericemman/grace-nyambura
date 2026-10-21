import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, ImagePlus, LoaderCircle, Save, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { apiRequest } from '../../lib/api';
import { RichTextEditor } from './components/RichTextEditor';

const baseFields = {
  slug: z.string().min(1, 'Add a slug.').max(180, 'Keep the slug below 180 characters.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens.'),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  seoTitle: z.string().max(70, 'Keep the SEO title below 70 characters.'),
  seoDescription: z.string().max(170, 'Keep the SEO description at 170 characters or fewer.'),
};

const articleSchema = z.object({
  ...baseFields,
  title: z.string().min(3, 'Add a title.').max(180, 'Keep the title below 180 characters.'),
  excerpt: z
    .string()
    .min(10, 'The excerpt needs at least 10 characters.')
    .max(500, 'Keep the excerpt at 500 characters or fewer.'),
  content: z.string().min(8, 'Add the article content.'),
  coverImage: z.union([z.literal(''), z.string().url('Enter a valid image URL.')]),
  category: z.string().min(2, 'Add a category.').max(80, 'Keep the category below 80 characters.'),
  tagsText: z.string(),
  author: z.string().min(2),
  authorImage: z.union([z.literal(''), z.string().url('Enter a valid author image URL.')]),
  canonicalUrl: z.union([z.literal(''), z.string().url('Enter a valid canonical URL.')]),
});

const caseSchema = z.object({
  ...baseFields,
  clientName: z.string(), company: z.string().min(2, 'Add the company.'), industry: z.string().min(2, 'Add the industry.'),
  projectTitle: z.string().min(3, 'Add the project title.'), summary: z.string().min(10, 'Add a summary.'),
  challenge: z.string().min(10, 'Describe the challenge.'), objectives: z.string(), approach: z.string().min(10, 'Describe the approach.'),
  contribution: z.string(), results: z.string(), testimonial: z.string(), metricsText: z.string(), evidenceLinksText: z.string(), galleryText: z.string(),
  clientLogo: z.union([z.literal(''), z.string().url('Enter a valid logo URL.')]),
  coverImage: z.union([z.literal(''), z.string().url('Enter a valid image URL.')]),
  publicationApproved: z.boolean(),
});

const articleDefaults = { title: '', slug: '', excerpt: '', content: '<p></p>', coverImage: '', category: '', tagsText: '', author: 'Grace Nyambura', authorImage: '', status: 'draft', featured: false, seoTitle: '', seoDescription: '', canonicalUrl: '' };
const caseDefaults = { clientName: '', company: '', industry: '', projectTitle: '', slug: '', summary: '', challenge: '<p></p>', objectives: '', approach: '<p></p>', contribution: '', results: '', testimonial: '', metricsText: '', evidenceLinksText: '', galleryText: '', clientLogo: '', coverImage: '', publicationApproved: false, status: 'draft', featured: false, seoTitle: '', seoDescription: '' };

export function ContentEditorPage({ type }) {
  const isArticle = type === 'articles';
  const { id } = useParams();
  const isNew = !id;
  const endpoint = `/admin/${type}`;
  const navigate = useNavigate();
  const form = useForm({ resolver: zodResolver(isArticle ? articleSchema : caseSchema), defaultValues: isArticle ? articleDefaults : caseDefaults });
  const itemQuery = useQuery({ queryKey: [type, id], queryFn: () => apiRequest(`${endpoint}/${id}`), enabled: !isNew });
  const currentStatus = useWatch({ control: form.control, name: 'status' });
  const publicationApproved = useWatch({ control: form.control, name: 'publicationApproved' });

  useEffect(() => {
    if (!isNew && itemQuery.data?.data) {
      const item = itemQuery.data.data;
      form.reset(isArticle ? { ...articleDefaults, ...item, tagsText: item.tags?.join(', ') ?? '' } : {
        ...caseDefaults,
        ...item,
        metricsText: item.metrics?.map((entry) => `${entry.label} | ${entry.value} | ${entry.evidenceUrl ?? ''}`).join('\n') ?? '',
        evidenceLinksText: item.evidenceLinks?.map((entry) => `${entry.label} | ${entry.url}`).join('\n') ?? '',
        galleryText: item.gallery?.join('\n') ?? '',
      });
    }
  }, [form, isArticle, isNew, itemQuery.data]);

  const save = useMutation({
    mutationFn: (values) => {
      const payload = isArticle ? { ...values, tags: values.tagsText.split(',').map((tag) => tag.trim()).filter(Boolean) } : {
        ...values,
        metrics: parseRows(values.metricsText, ([label, value, evidenceUrl = '']) => ({ label, value, evidenceUrl })),
        evidenceLinks: parseRows(values.evidenceLinksText, ([label, url]) => ({ label, url })),
        gallery: values.galleryText.split('\n').map((url) => url.trim()).filter(Boolean),
      };
      delete payload.tagsText;
      delete payload.metricsText;
      delete payload.evidenceLinksText;
      delete payload.galleryText;
      return apiRequest(isNew ? endpoint : `${endpoint}/${id}`, { method: isNew ? 'POST' : 'PUT', body: JSON.stringify(payload) });
    },
    onSuccess: () => navigate(`/admin/${type}`),
    onError: (error) => applyServerErrors(error, form),
  });

  const title = isArticle ? 'article' : 'case study';
  if (!isNew && itemQuery.isLoading) return <main className="grid min-h-[60vh] place-items-center text-muted">Loading editor…</main>;

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <form className="mx-auto max-w-[90rem]" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary" to={`/admin/${type}`}><ArrowLeft size={16} /> Back to {isArticle ? 'articles' : 'case studies'}</Link>
            <h1 className="mt-4 font-display text-xl text-primary md:text-2xl lg:text-3xl">{isNew ? 'Create' : 'Edit'} {title}</h1>
          </div>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold text-white disabled:opacity-60" type="submit" disabled={save.isPending}>
            {save.isPending ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}{save.isPending ? 'Saving…' : `Save ${title}`}
          </button>
        </div>

        {save.error && <div className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{save.error.message}</div>}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_20rem]">
          <div className="grid gap-6">
            <section className="grid gap-6 border border-border bg-white p-5 sm:p-7">
              {isArticle ? <ArticleFields form={form} /> : <CaseStudyFields form={form} />}
            </section>
            <section className="grid gap-6 border border-border bg-white p-5 sm:grid-cols-2 sm:p-7">
              <div className="sm:col-span-2"><h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">Search appearance</h2><p className="mt-2 text-sm text-muted">Optional metadata used by search engines and shared links.</p></div>
              <Field label="SEO title" name="seoTitle" form={form} />
              <Textarea
                label="SEO description"
                name="seoDescription"
                form={form}
                maxLength={170}
                hint="Optional. Aim for 120–160 characters; maximum 170."
              />
              {isArticle && <div className="sm:col-span-2"><Field label="Canonical URL" name="canonicalUrl" form={form} type="url" /></div>}
            </section>
          </div>

          <aside className="self-start border border-border bg-white p-5 xl:sticky xl:top-28">
            <h2 className="font-display text-xl text-primary md:text-2xl lg:text-3xl">Publishing</h2>
            <div className="mt-6 grid gap-5">
              <label className="text-sm font-semibold text-primary">Status<select className="mt-2 min-h-11 w-full border border-border bg-white px-3 font-normal outline-none focus:border-emerald" {...form.register('status')}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              <CheckField label="Feature this content" name="featured" form={form} />
              {!isArticle && <CheckField label="Publication permission confirmed" name="publicationApproved" form={form} />}
              {!isArticle && currentStatus === 'published' && !publicationApproved && <p className="border-l-2 border-champagne bg-ivory px-3 py-2 text-xs leading-5 text-muted">Approval must be confirmed before this case study can be published.</p>}
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}

function ArticleFields({ form }) {
  function generateSlug() {
    const value = form.getValues('title');
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    form.setValue('slug', slug, { shouldValidate: true });
  }

  return (
    <>
      <Field label="Article title" name="title" form={form} />
      <SlugField form={form} onGenerate={generateSlug} />
      <Textarea
        label="Excerpt"
        name="excerpt"
        form={form}
        minLength={10}
        maxLength={500}
        hint="Required: 10–500 characters."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" name="category" form={form} />
        <Field label="Author" name="author" form={form} />
      </div>
      <ImageUpload
        category="article"
        form={form}
        label="Author image"
        name="authorImage"
        square
      />
      <Field
        label="Tags"
        name="tagsText"
        form={form}
        hint="Separate tags with commas."
      />
      <ImageUpload
        category="article"
        form={form}
        label="Cover image"
        name="coverImage"
      />
      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <RichTextEditor
            label="Article content"
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </>
  );
}

function CaseStudyFields({ form }) {
  function generateSlug() {
    const value = form.getValues('projectTitle');
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    form.setValue('slug', slug, { shouldValidate: true });
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Project title" name="projectTitle" form={form} />
        <Field label="Company" name="company" form={form} />
        <Field label="Client name" name="clientName" form={form} />
        <Field label="Industry" name="industry" form={form} />
      </div>
      <SlugField form={form} onGenerate={generateSlug} />
      <Textarea label="Summary" name="summary" form={form} />

      <EditorSectionHeading
        eyebrow="The client story"
        title="Challenge, approach, and results"
      />
      <RichField form={form} label="Challenge" name="challenge" />
      <RichField form={form} label="Approach" name="approach" />
      <RichField form={form} label="Results" name="results" />

      <EditorSectionHeading
        eyebrow="Supporting proof"
        title="Evidence links and images"
      />
      <Textarea
        label="Evidence links"
        name="evidenceLinksText"
        form={form}
        hint="One per line: Label | URL"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <ImageUpload
          category="case-study"
          form={form}
          label="Cover image"
          name="coverImage"
        />
        <ImageUpload
          category="case-study"
          form={form}
          label="Client logo"
          name="clientLogo"
          square
        />
      </div>
      <Textarea
        label="Gallery image URLs"
        name="galleryText"
        form={form}
        hint="One image URL per line."
      />

    </>
  );
}

function RichField({ form, label, name }) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <RichTextEditor
          category="case-study"
          label={label}
          value={field.value}
          onChange={field.onChange}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

function EditorSectionHeading({ eyebrow, title }) {
  return (
    <div className="mt-4 border-t border-border pt-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-xl text-primary md:text-2xl lg:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ImageUpload({ category, form, label, name, square = false }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const image = useWatch({ control: form.control, name });
  const error = form.formState.errors[name];

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const body = new FormData();
      body.append('image', file);
      body.append('category', category);
      body.append('altText', label);
      const result = await apiRequest('/admin/media/editor-image', { method: 'POST', body });
      form.setValue(name, result.data.url, { shouldDirty: true, shouldValidate: true });
    } catch (uploadFailure) {
      setUploadError(uploadFailure.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-primary">{label}</p>
      <div className="mt-2 overflow-hidden border border-border bg-ivory">
        {image ? (
          <img
            className={`w-full object-contain ${square ? 'aspect-square p-6' : 'aspect-[16/9]'}`}
            src={image}
            alt={`Current ${label.toLowerCase()}`}
          />
        ) : (
          <div className={`grid place-items-center text-muted ${square ? 'aspect-square' : 'aspect-[16/7]'}`}>
            <div className="text-center">
              <ImagePlus className="mx-auto" size={28} strokeWidth={1.5} />
              <p className="mt-2 text-sm">No {label.toLowerCase()} selected</p>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 border-t border-border bg-white p-4 sm:flex-row sm:items-center">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-primary px-4 text-sm font-bold text-primary disabled:opacity-60"
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <LoaderCircle className="animate-spin" size={16} /> : <ImagePlus size={16} />}
            {uploading ? 'Uploading…' : image ? 'Replace image' : 'Upload image'}
          </button>
          {image && (
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 px-3 text-sm font-semibold text-red-700"
              type="button"
              onClick={() => form.setValue(name, '', { shouldDirty: true, shouldValidate: true })}
            >
              <Trash2 size={16} /> Remove
            </button>
          )}
          <input
            className="sr-only"
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={uploadImage}
          />
        </div>
      </div>
      {(uploadError || error) && (
        <p className="mt-2 text-sm text-red-700">{uploadError || error.message}</p>
      )}
      <p className="mt-2 text-xs text-muted">JPEG, PNG, WebP, or GIF. Maximum file size: 8 MB.</p>
    </div>
  );
}

function SlugField({ form, onGenerate }) { return <div><label className="text-sm font-semibold text-primary" htmlFor="slug">Slug</label><div className="mt-2 flex"><input className="min-h-11 min-w-0 flex-1 border border-border px-3 outline-none focus:border-emerald" id="slug" {...form.register('slug')} /><button className="border border-l-0 border-border px-3 text-sm font-bold text-primary hover:bg-ivory" type="button" onClick={onGenerate}>Generate</button></div>{form.formState.errors.slug && <p className="mt-2 text-sm text-red-700">{form.formState.errors.slug.message}</p>}</div>; }
function Field({ label, name, form, type = 'text', hint }) { const error = form.formState.errors[name]; return <label className="text-sm font-semibold text-primary">{label}<input className={`mt-2 min-h-11 w-full border px-3 font-normal outline-none focus:border-emerald ${error ? 'border-red-600' : 'border-border'}`} type={type} {...form.register(name)} />{hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}{error && <span className="mt-2 block text-sm font-normal text-red-700">{error.message}</span>}</label>; }
function Textarea({ label, name, form, hint, minLength, maxLength }) {
  const error = form.formState.errors[name];
  const value = useWatch({ control: form.control, name }) ?? '';

  return (
    <label className="text-sm font-semibold text-primary">
      {label}
      <textarea
        className={`mt-2 min-h-28 w-full resize-y border p-3 font-normal outline-none focus:border-emerald ${error ? 'border-red-600' : 'border-border'}`}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        {...form.register(name)}
      />
      {(hint || maxLength) && (
        <span className="mt-1 flex items-start justify-between gap-4 text-xs font-normal text-muted">
          <span>{hint}</span>
          {maxLength && (
            <span className={value.length < (minLength ?? 0) ? 'text-amber-700' : ''}>
              {value.length}/{maxLength}
            </span>
          )}
        </span>
      )}
      {error && <span className="mt-2 block text-sm font-normal text-red-700">{error.message}</span>}
    </label>
  );
}
function CheckField({ label, name, form }) { return <label className="flex items-start gap-3 text-sm text-body"><input className="mt-0.5 h-4 w-4 accent-emerald" type="checkbox" {...form.register(name)} /><span>{label}</span></label>; }

function parseRows(value, mapper) {
  return value.split('\n').map((row) => row.split('|').map((part) => part.trim())).filter((parts) => parts.some(Boolean)).map(mapper);
}

function applyServerErrors(error, form) {
  const fieldMap = { tags: 'tagsText' };
  const fields = [];

  if (error.code === 'SLUG_CONFLICT') {
    form.setError('slug', { type: 'server', message: error.message });
    fields.push('slug');
  }

  if (error.code === 'VALIDATION_ERROR' && Array.isArray(error.details)) {
    error.details.forEach((detail) => {
      const serverField = detail.path?.[0];
      if (!serverField) return;
      const field = fieldMap[serverField] ?? serverField;
      form.setError(field, { type: 'server', message: detail.message });
      fields.push(field);
    });
  }

  if (fields[0]) {
    requestAnimationFrame(() => form.setFocus(fields[0]));
  }
}
