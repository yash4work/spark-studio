// One definition of "The Spark Studio" for structured data (JSON-LD).
// Every page refers to the same @id, so Google and AI engines treat it as one brand entity.
// The full details (sameAs, description, email) live on the home page's ProfessionalService node.

export const SITE_URL = 'https://www.thesparkstudio.digital';
export const ORG_ID = `${SITE_URL}/#organization`;
export const ORG_EMAIL = 'hello@thesparkstudio.digital'; // same address shown on the site

/** Short reference used as publisher / seller / brand owner on inner pages. */
export const ORG_REF = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'The Spark Studio',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
  },
};
