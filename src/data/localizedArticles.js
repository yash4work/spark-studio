export const localizedArticleSlugs = [
  "mobile-speed-framer-portfolio",
  "furniture-product-page-photo-guide"
];

export function articlePath(slug, prefix = '') {
  return `${localizedArticleSlugs.includes(slug) ? prefix : ''}/blog/${slug}`;
}
