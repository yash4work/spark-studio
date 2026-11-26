// Keeps <title> and meta descriptions within the lengths Google shows in results.
// Applied centrally in SEOHead, so every page (and every new blog post) follows the rules.

export const BRAND = 'The Spark Studio';
export const MAX_TITLE = 60;
export const SOFT_MAX_TITLE = 70;
export const MAX_DESCRIPTION = 160;

const BRAND_SUFFIX = /\s+[—|–-]\s+The Spark Studio(?: Insights)?\s*$/;
const TRAILING_PARENS = /\s*\([^)]*\)\s*$/;
const WEAK_END = /[\s—–\-:|&,·]+$/; // don't end a title on a dash, colon, "&"...
// ...or on a small joining word (EN/DE/ES/FR)
const WEAK_WORD = /\s+(for|and|or|the|of|to|with|a|an|in|on|at|by|before|after|without|your|für|und|oder|der|die|das|eine|ein|mit|von|vor|nach|ohne|para|y|o|de|del|la|el|los|las|con|en|antes|después|sin|tu|pour|et|ou|le|les|des|du|avec|à|avant|après|sans|sur|votre)$/i;

function cutAtWord(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(' ');
  let out = (lastSpace > 0 ? cut.slice(0, lastSpace) : text.slice(0, max)).replace(WEAK_END, '');
  while (WEAK_WORD.test(out)) out = out.replace(WEAK_WORD, '').replace(WEAK_END, '');
  return out;
}

/**
 * "Long Article Title (2026 In-Depth Review) — The Spark Studio Insights"
 *   -> the longest readable version that fits in 60 characters,
 *      with " — The Spark Studio" added only when there is room.
 */
export function fitTitle(raw) {
  if (!raw) return raw;
  const core = String(raw).replace(BRAND_SUFFIX, '').trim().replace(/\.\s*$/, '');
  const hasBrand = core.includes(BRAND);
  const withBrand = t => (hasBrand ? t : `${t} — ${BRAND}`);

  if (withBrand(core).length <= MAX_TITLE) return withBrand(core);
  if (core.length <= MAX_TITLE) return core;

  const noParens = core.replace(TRAILING_PARENS, '');
  if (withBrand(noParens).length <= MAX_TITLE) return withBrand(noParens);
  if (noParens.length <= MAX_TITLE) return noParens;
  // Slightly long (61-70): keep it whole - a full sentence that Google may end with "…"
  // reads better than one we cut mid-thought ("…before your next").
  if (noParens.length <= SOFT_MAX_TITLE) return noParens;

  return cutAtWord(noParens, MAX_TITLE);
}

/** Ends at a full sentence when possible, otherwise at a word with "…". */
export function fitDescription(raw) {
  if (!raw) return raw;
  const text = String(raw).replace(/\s+/g, ' ').trim();
  if (text.length <= MAX_DESCRIPTION) return text;

  const window = text.slice(0, MAX_DESCRIPTION);
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
  if (sentenceEnd >= 90) return window.slice(0, sentenceEnd + 1);

  return cutAtWord(text, MAX_DESCRIPTION - 1) + '…';
}
