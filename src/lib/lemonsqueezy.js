/**
 * LemonSqueezy Checkout Helper
 * Manages overlay modal setup and fallback navigation.
 *
 * lemon.js is no longer loaded on every page. It is fetched:
 *  - when someone clicks a Buy button (handleLemonCheckout), or
 *  - ahead of time on template pages / when hovering a Buy button (preloadLemonSqueezy).
 */

const LEMON_SRC = 'https://assets.lemonsqueezy.com/lemon.js';
let checkoutItem;
let loadPromise = null;

export function loadLemonSqueezy() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.LemonSqueezy) return Promise.resolve(true);
  if (!loadPromise) {
    loadPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = LEMON_SRC;
      script.async = true;
      script.onload = () => { initLemonSqueezy(); resolve(Boolean(window.LemonSqueezy)); };
      script.onerror = () => { loadPromise = null; resolve(false); };
      document.head.appendChild(script);
    });
  }
  return loadPromise;
}

// Warm-up: fetch lemon.js when the browser is idle (template pages) or on Buy-button hover.
export function preloadLemonSqueezy() {
  if (typeof window === 'undefined' || window.LemonSqueezy || loadPromise) return;
  if ('requestIdleCallback' in window) window.requestIdleCallback(() => loadLemonSqueezy(), { timeout: 5000 });
  else window.setTimeout(loadLemonSqueezy, 2000);
}

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

  if (typeof window === 'undefined') return;
  initLemonSqueezy();

  const openOverlay = () => {
    try {
      window.LemonSqueezy.Url.Open(checkoutUrl);
    } catch {
      window.location.assign(checkoutUrl);
    }
  };

  // Already loaded: open the overlay straight away.
  if (window.LemonSqueezy?.Url?.Open) {
    e?.preventDefault?.();
    openOverlay();
    return;
  }

  // Not loaded yet: fetch lemon.js, then open the overlay.
  // If it fails or takes over 4s, go to the checkout page instead.
  e?.preventDefault?.();
  let done = false;
  const fallback = window.setTimeout(() => { if (!done) { done = true; window.location.assign(checkoutUrl); } }, 4000);
  loadLemonSqueezy().then((ok) => {
    if (done) return;
    done = true;
    window.clearTimeout(fallback);
    if (ok && window.LemonSqueezy?.Url?.Open) openOverlay();
    else window.location.assign(checkoutUrl);
  });
}
