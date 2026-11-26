export const localizedArticleSlugs = [
  "top-10-framer-templates-for-architects-and-design-studios-2026",
  "mobile-speed-framer-portfolio",
  "furniture-product-page-photo-guide",
  "best-luxury-real-estate-framer-templates-for-brokers"
];

export function articlePath(slug, prefix = '') {
  return `${localizedArticleSlugs.includes(slug) ? prefix : ''}/blog/${slug}`;
}
