const mongoose = require('mongoose');

async function safeCount(collectionName, filter = {}) {
  const collections = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();
  if (!collections.length) return 0;
  return mongoose.connection.db.collection(collectionName).countDocuments(filter);
}

async function getOverview() {
  const [totalArticles, publishedArticles, draftArticles, publishedCaseStudies, unreviewedCaseStudies, newEnquiries, submittedTestimonials, newPartnershipApplications, activeSubscribers] = await Promise.all([
    safeCount('articles'),
    safeCount('articles', { status: 'published' }),
    safeCount('articles', { status: 'draft' }),
    safeCount('casestudies', { status: 'published', publicationApproved: true }),
    safeCount('casestudies', { publicationApproved: { $ne: true } }),
    safeCount('enquiries', { status: 'new' }),
    safeCount('testimonials', { status: 'submitted' }),
    safeCount('partnershipapplications', { status: 'new' }),
    safeCount('subscribers', { status: 'active' }),
  ]);

  return {
    counts: {
      totalArticles,
      publishedArticles,
      draftArticles,
      publishedCaseStudies,
      unreviewedCaseStudies,
      newEnquiries,
      submittedTestimonials,
      newPartnershipApplications,
      activeSubscribers,
    },
    recentEnquiries: await mongoose.connection.db.collection('enquiries').find({}, { projection: { fullName: 1, company: 1, status: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(5).toArray().catch(() => []),
    recentlyUpdated: [],
  };
}

module.exports = { getOverview };
