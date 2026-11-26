// Responsive image helpers for template screenshots in /public/templates/.
//
// Every template image has these sizes (all WebP):
//   name-192.webp  name-384.webp  name-768.webp  name-1280.webp  name.webp (full size)
// The browser picks the smallest one that is sharp enough for the screen.

const LOCAL_TEMPLATE_IMAGE = /^\/templates\/[a-z0-9-]+\.(png|webp|jpe?g)$/;

/** True for local template images that have the resized versions above. */
export function hasSizes(url) {
  return typeof url === 'string' && LOCAL_TEMPLATE_IMAGE.test(url);
}

/** '/templates/x.png' -> '/templates/x.webp' (smaller file, same picture). */
export function toWebp(url) {
  return hasSizes(url) ? url.replace(/\.(png|jpe?g)$/, '.webp') : url;
}

/** srcset string for a local template image, or undefined for remote/other images. */
export function templateSrcSet(url) {
  if (!hasSizes(url)) return undefined;
  const base = url.replace(/\.(png|webp|jpe?g)$/, '');
  return `${base}-384.webp 384w, ${base}-768.webp 768w, ${base}-1280.webp 1280w`;
}

/** Default src: the 768px version (good for most cards). */
export function templateSrc(url) {
  if (!hasSizes(url)) return url;
  return url.replace(/\.(png|webp|jpe?g)$/, '-768.webp');
}
