const assert = require('node:assert/strict');
const test = require('node:test');
const { articleSchema } = require('../src/validation/content.validation');

const validArticle = {
  title: 'A useful article title',
  slug: 'a-useful-article-title',
  excerpt: 'A concise article excerpt.',
  content: '<p>Useful article content.</p>',
  coverImage: '',
  category: 'LinkedIn Strategy',
  tags: [],
  author: 'Grace Nyambura',
  status: 'draft',
  featured: false,
  seoTitle: '',
  seoDescription: '',
  canonicalUrl: '',
};

test('article validation accepts documented excerpt and SEO description limits', () => {
  const result = articleSchema.safeParse({
    ...validArticle,
    excerpt: 'x'.repeat(500),
    seoDescription: 'x'.repeat(170),
  });

  assert.equal(result.success, true);
});

test('article validation returns useful messages when character limits are exceeded', () => {
  const result = articleSchema.safeParse({
    ...validArticle,
    excerpt: 'x'.repeat(501),
    seoDescription: 'x'.repeat(171),
  });

  assert.equal(result.success, false);
  assert.deepEqual(
    result.error.issues.map(({ message, path }) => ({ message, path })),
    [
      { message: 'Keep the excerpt at 500 characters or fewer', path: ['excerpt'] },
      { message: 'Keep the SEO description at 170 characters or fewer', path: ['seoDescription'] },
    ],
  );
});

test('article validation accepts an uploaded author image URL', () => {
  const result = articleSchema.safeParse({
    ...validArticle,
    authorImage: 'https://res.cloudinary.com/example/image/upload/author.jpg',
  });

  assert.equal(result.success, true);
  assert.equal(
    result.data.authorImage,
    'https://res.cloudinary.com/example/image/upload/author.jpg',
  );
});
