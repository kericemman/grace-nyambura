const cloudinaryBase = 'https://res.cloudinary.com/xnyxegiy/image/upload';

export const aboutImages = {
  hero: {
    alt: 'Portrait of me in a navy blue outfit with folded hands',
    src: `${cloudinaryBase}/f_auto,q_auto,c_fill,g_face,w_900,h_1125/v1792224823/Navy_blue_medium_shot_folding_hands.jpg`,
    srcSet: `${cloudinaryBase}/f_auto,q_auto,c_fill,g_face,w_560,h_700/v1792224823/Navy_blue_medium_shot_folding_hands.jpg 560w, ${cloudinaryBase}/f_auto,q_auto,c_fill,g_face,w_900,h_1125/v1792224823/Navy_blue_medium_shot_folding_hands.jpg 900w, ${cloudinaryBase}/f_auto,q_auto,c_fill,g_face,w_1200,h_1500/v1792224823/Navy_blue_medium_shot_folding_hands.jpg 1200w`,
  },
  story: {
    alt: 'Portrait of me seated on a stool in a turquoise outfit',
    src: `${cloudinaryBase}/f_auto,q_auto,c_fill,g_face,w_800,h_1000/v1792224823/Turquiose_on_a_stool.jpg`,
    srcSet: `${cloudinaryBase}/f_auto,q_auto,c_fill,g_face,w_520,h_650/v1792224823/Turquiose_on_a_stool.jpg 520w, ${cloudinaryBase}/f_auto,q_auto,c_fill,g_face,w_800,h_1000/v1792224823/Turquiose_on_a_stool.jpg 800w, ${cloudinaryBase}/f_auto,q_auto,c_fill,g_face,w_1040,h_1300/v1792224823/Turquiose_on_a_stool.jpg 1040w`,
  },
  workshop: {
    alt: 'Me participating in a collaborative writing workshop around a table',
    src: '/images/about/grace-workshop.jpeg',
  },
  community: {
    alt: 'Me attending the La Preciosa Study Abroad event with two women',
    src: '/images/about/grace-study-abroad-event.jpeg',
  },
};

export const milestones = [
  'Diploma in Mass Communication and Journalism',
  'Certified in Social Media Management and Advertising',
  'Upwork Top Rated with a 100% Job Success Score',
  'Five women founders supported with LinkedIn writing',
  'Creator of The Authority Architecture newsletter',
  'A LinkedIn community of more than 4,800 followers',
];

export const writingPrinciples = [
  ['Listen before writing', 'The strongest content begins with careful questions and a clear understanding of the person behind the ideas.'],
  ['Find the useful story', 'Experience becomes valuable content when it is shaped around what the right reader needs to understand.'],
  ['Protect the founder’s voice', 'Strategy should sharpen how you communicate without replacing the personality that makes your perspective credible.'],
];
