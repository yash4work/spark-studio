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
    if (window.LemonSqueezy && typeof window.LemonSqueezy.Setup === 'function' && !window.__ls_setup_done) {
      window.__ls_setup_done = true;
      window.LemonSqueezy.Setup({
        eventHandler: (event) => {
          if (event && event.event === 'Checkout.Success' && typeof window.gtag === 'function') {
            window.gtag('event', 'purchase', {
              transaction_id: event.data?.order?.identifier || event.data?.order?.id,
              value: (event.data?.order?.total || 0) / 100,
              currency: event.data?.order?.currency || 'USD'
            });
          }
        }
      });
    }
  } catch (err) {
    console.warn('LemonSqueezy init error:', err);
  }
}

if (typeof window !== 'undefined' && !window.__ls_ready_listener) {
  window.__ls_ready_listener = true;
  window.addEventListener('lemonSqueezyReady', () => {
    initLemonSqueezy();
  });
}

export function handleLemonCheckout(e, checkoutUrl) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'begin_checkout', {
        checkout_url: checkoutUrl
      });
    } catch {}
  }

  initLemonSqueezy();

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
