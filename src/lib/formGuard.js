// Spam protection + validation helpers shared by the site's forms.
// Plain JS (no JSX) so `npm test` can import it directly in Node.

// Stricter than "something@something.something": no spaces, no leading/trailing
// or doubled dots, and a TLD of at least 2 letters.
const EMAIL_REGEX = /^(?!\.)(?!.*\.\.)[^\s@]+(?<!\.)@(?!-)(?:[a-z0-9-]+\.)+[a-z]{2,}$/i;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email || '').trim());
}

// Bots that fill a form usually do it instantly; people need at least a few seconds.
export const MIN_FILL_TIME_MS = 3000;

/**
 * Returns true when a submission looks automated:
 * - the hidden honeypot field (invisible to people) was filled in, or
 * - the form was submitted faster than a person could type it.
 */
export function isLikelySpam({ honeypot, startedAt, now = Date.now() }) {
  if (String(honeypot || '').trim() !== '') return true;
  if (typeof startedAt === 'number' && now - startedAt < MIN_FILL_TIME_MS) return true;
  return false;
}
