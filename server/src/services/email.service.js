const { Resend } = require('resend');
const jwt = require('jsonwebtoken');
const sanitizeHtml = require('sanitize-html');

const BRAND = {
  cream: '#f7f3ea',
  emerald: '#0b5d4b',
  ink: '#17221f',
  muted: '#5f6d68',
  gold: '#c7a86d',
};

function escapeHtml(value = '') {
  return sanitizeHtml(String(value), { allowedTags: [], allowedAttributes: {} })
    .replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    })[character]);
}

function paragraphs(value = '') {
  return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

function emailLayout({ eyebrow, title, intro, body, action }) {
  const actionMarkup = action?.url
    ? `<p style="margin:28px 0 4px"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:${BRAND.emerald};color:#ffffff;text-decoration:none;font-weight:700;padding:13px 20px">${escapeHtml(action.label)}</a></p>`
    : '';

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:${BRAND.cream};font-family:Arial,sans-serif;color:${BRAND.ink}">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.cream};padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-top:4px solid ${BRAND.emerald}">
          <tr><td style="padding:34px 34px 12px">
            <p style="margin:0 0 12px;color:${BRAND.emerald};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${escapeHtml(eyebrow)}</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:30px;line-height:1.2;color:${BRAND.ink}">${escapeHtml(title)}</h1>
            <p style="margin:18px 0 0;color:${BRAND.muted};font-size:16px;line-height:1.7">${intro}</p>
          </td></tr>
          <tr><td style="padding:12px 34px 34px;font-size:15px;line-height:1.7;color:${BRAND.ink}">
            ${body}${actionMarkup}
          </td></tr>
          <tr><td style="border-top:1px solid #e6e1d8;padding:20px 34px;color:${BRAND.muted};font-size:12px;line-height:1.6">
            Grace Nyambura · LinkedIn Content &amp; Personal Brand Partner
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function detailRows(items) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:8px;border-collapse:collapse">${items
    .filter(([, value]) => value)
    .map(([label, value]) => `<tr>
      <td style="width:145px;border-bottom:1px solid #ece8df;padding:10px 12px 10px 0;color:${BRAND.muted};font-size:13px;vertical-align:top">${escapeHtml(label)}</td>
      <td style="border-bottom:1px solid #ece8df;padding:10px 0;font-weight:600;vertical-align:top">${paragraphs(value)}</td>
    </tr>`).join('')}</table>`;
}

function getAdminUrl(path) {
  const origin = process.env.CLIENT_ORIGIN?.split(',')[0]?.trim()?.replace(/\/$/, '');
  return origin ? `${origin}${path}` : '';
}

function getPublicUrl(path) {
  const origin = process.env.CLIENT_ORIGIN?.split(',')[0]?.trim()?.replace(/\/$/, '');
  return origin ? `${origin}${path}` : '';
}

function createUnsubscribeUrl(subscriber) {
  const secret = process.env.UNSUBSCRIBE_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('Unsubscribe token secret is not configured');
  const token = jwt.sign(
    { sub: subscriber.id, email: subscriber.email, purpose: 'unsubscribe' },
    secret,
    { expiresIn: '365d' },
  );
  return getPublicUrl(`/unsubscribe?token=${encodeURIComponent(token)}`);
}

async function getEmailClient() {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    throw new Error('Resend is not configured');
  }

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
    || process.env.RESEND_REPLY_TO;
  if (!adminEmail) throw new Error('Admin notification recipient is not configured');

  return {
    adminEmail,
    resend: new Resend(process.env.RESEND_API_KEY),
  };
}

async function deliver(resend, message, label) {
  const result = await resend.emails.send(message);
  if (result.error) throw new Error(result.error.message || `${label} email failed`);
}

async function sendEnquiryEmails(enquiry) {
  const { adminEmail, resend } = await getEmailClient();
  const adminBody = detailRows([
    ['Name', enquiry.fullName],
    ['Email', enquiry.email],
    ['Phone', enquiry.phone],
    ['Company', enquiry.company],
    ['Role', enquiry.professionalRole],
    ['Challenge', enquiry.primaryChallenge],
    ['Preferred contact', enquiry.preferredContactMethod],
    ['Project', enquiry.projectDescription],
  ]);

  await deliver(resend, {
    from: process.env.RESEND_FROM,
    to: adminEmail,
    replyTo: enquiry.email,
    subject: `New website enquiry from ${enquiry.fullName}`,
    html: emailLayout({
      eyebrow: 'New website enquiry',
      title: `${enquiry.fullName} would like to talk`,
      intro: 'A new enquiry has been submitted through the website.',
      body: adminBody,
      action: { label: 'Review in dashboard', url: getAdminUrl('/admin/enquiries') },
    }),
  }, 'Admin notification');

  await deliver(resend, {
    from: process.env.RESEND_FROM,
    to: enquiry.email,
    replyTo: adminEmail,
    subject: 'Thank you for getting in touch',
    html: emailLayout({
      eyebrow: 'Enquiry received',
      title: `Thank you, ${enquiry.fullName}`,
      intro: 'I have received your message successfully.',
      body: '<p style="margin:8px 0 0">Thank you for sharing a little about your business and what you want to achieve on LinkedIn. I will review your enquiry and get back to you soon using your preferred contact method.</p><p style="margin:22px 0 0">Warmly,<br><strong>Grace Nyambura</strong></p>',
    }),
  }, 'Confirmation');
}

async function sendPartnershipEmails(application) {
  const { adminEmail, resend } = await getEmailClient();
  const adminBody = detailRows([
    ['Name', application.fullName],
    ['Email', application.email],
    ['Phone', application.phone],
    ['Company', application.company],
    ['Role', application.professionalRole],
    ['LinkedIn', application.linkedInUrl],
    ['Primary goal', application.primaryGoal],
    ['Posting rhythm', application.currentPostingRhythm],
    ['Desired start', application.desiredStart],
    ['Additional context', application.additionalContext],
  ]);

  await deliver(resend, {
    from: process.env.RESEND_FROM,
    to: adminEmail,
    replyTo: application.email,
    subject: `New LinkedIn Partnership application from ${application.fullName}`,
    html: emailLayout({
      eyebrow: 'New partnership application',
      title: `${application.fullName} has applied`,
      intro: 'A new LinkedIn Content Partnership application is ready for review.',
      body: adminBody,
      action: {
        label: 'Review application',
        url: getAdminUrl('/admin/partnership-applications'),
      },
    }),
  }, 'Admin notification');

  await deliver(resend, {
    from: process.env.RESEND_FROM,
    to: application.email,
    replyTo: adminEmail,
    subject: 'Your LinkedIn Partnership application has been received',
    html: emailLayout({
      eyebrow: 'Application received',
      title: `Thank you, ${application.fullName}`,
      intro: 'I have received your LinkedIn Content Partnership application.',
      body: '<p style="margin:8px 0 0">I will review your goals, current content rhythm, and preferred start date, then contact you soon to discuss fit and the next step.</p><p style="margin:22px 0 0">Warmly,<br><strong>Grace Nyambura</strong></p>',
    }),
  }, 'Confirmation');
}

async function sendSubscriberEmails(subscriber) {
  const { adminEmail, resend } = await getEmailClient();
  const unsubscribeUrl = createUnsubscribeUrl(subscriber);

  await deliver(resend, {
    from: process.env.RESEND_FROM,
    to: adminEmail,
    replyTo: subscriber.email,
    subject: `New mailing-list subscriber: ${subscriber.name}`,
    html: emailLayout({
      eyebrow: 'New mailing-list subscriber',
      title: `${subscriber.name} joined the list`,
      intro: 'A new reader subscribed through the website.',
      body: detailRows([
        ['Name', subscriber.name],
        ['Email', subscriber.email],
        ['Source', subscriber.source],
      ]),
      action: { label: 'View mailing list', url: getAdminUrl('/admin/subscribers') },
    }),
  }, 'Admin notification');

  await deliver(resend, {
    from: process.env.RESEND_FROM,
    to: subscriber.email,
    replyTo: adminEmail,
    subject: 'Welcome to my mailing list',
    html: emailLayout({
      eyebrow: 'Subscription confirmed',
      title: `Welcome, ${subscriber.name}`,
      intro: 'You are now subscribed to my mailing list.',
      body: `<p style="margin:8px 0 0">You will receive thoughtful ideas on LinkedIn visibility, founder authority, and building a personal brand that supports your work.</p><p style="margin:22px 0 0">Warmly,<br><strong>Grace Nyambura</strong></p><p style="margin:30px 0 0;color:${BRAND.muted};font-size:12px">No longer want these emails? <a href="${escapeHtml(unsubscribeUrl)}" style="color:${BRAND.emerald}">Unsubscribe here</a>.</p>`,
    }),
  }, 'Subscriber confirmation');
}

module.exports = { sendEnquiryEmails, sendPartnershipEmails, sendSubscriberEmails };
