/**
 * LemonSqueezy Checkout Helper
 * Manages overlay modal setup and fallback navigation
 */

export function initLemonSqueezy() {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.createLemonSqueezy === 'function') {
      window.createLemonSqueezy();
    }
  } catch (err) {
    console.warn('LemonSqueezy init error:', err);
  }
}

export function handleLemonCheckout(e, checkoutUrl) {
  if (typeof window !== 'undefined' && window.LemonSqueezy?.Url?.Open) {
    try {
      e?.preventDefault?.();
      window.LemonSqueezy.Url.Open(checkoutUrl);
      return;
    } catch {
      // Fall through to regular navigation
    }
  }
  // Default behavior will open href directly
}
