/**
 * LemonSqueezy Checkout Helper
 * Manages overlay modal setup and fallback navigation
 */

let checkoutItem;

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
            const order = event.data?.order || event.data;
            const attributes = order?.attributes || order;
            const id = order?.id || attributes?.identifier;
            if (!id || !attributes.currency || !Number.isFinite(attributes.total) || !checkoutItem) return;
            const tax = attributes.tax ?? 0;
            if (!Number.isFinite(tax) || tax < 0 || tax > attributes.total) return;
            const value = (attributes.total - tax) / 100;
            const quantity = attributes.first_order_item?.quantity ?? checkoutItem.quantity ?? 1;
            if (!Number.isInteger(quantity) || quantity < 1) return;
            window.gtag('event', 'purchase', {
              transaction_id: String(id),
              value,
              tax: tax / 100,
              currency: attributes.currency,
              items: [{ ...checkoutItem, price: value / quantity, quantity }]
            });
            checkoutItem = undefined;
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

export function handleLemonCheckout(e, checkoutUrl, item) {
  checkoutItem = item;
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD', value: item.price, items: [item]
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
      window.location.assign(checkoutUrl);
    }
  }
  // Default behavior will open href directly
}
