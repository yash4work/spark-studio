export const localizedArticleSlugs = [
  "mobile-speed-framer-portfolio",
  "furniture-product-page-photo-guide",
  "best-luxury-real-estate-framer-templates-for-brokers"
];

export function articlePath(slug, prefix = '') {
  return `${localizedArticleSlugs.includes(slug) ? prefix : ''}/blog/${slug}`;
}
