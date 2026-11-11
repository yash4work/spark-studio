/**
 * Google Analytics 4 (GA4) & Tracking Helper for Spark Studio
 */

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-FQYVH9WRCQ';

/**
 * Tracks a pageview in Google Analytics for SPA route changes.
 * @param {string} path - URL path (e.g. /templates/mavric-estate or /de)
 * @param {string} [title] - Optional page title
 */
export function trackPageView(path, title) {
  if (typeof window === 'undefined') return;

  const pagePath = path || window.location.pathname + window.location.search;
  const pageTitle = title || document.title;

  if (typeof window.gtag === 'function') {
    const id = GA_MEASUREMENT_ID || window.__GA_MEASUREMENT_ID__;
    if (id) {
      window.gtag('config', id, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    } else {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  }
}

/**
 * Dispatches custom events to Google Analytics
 * @param {string} eventName - e.g. 'begin_checkout', 'generate_lead', 'click_demo'
 * @param {Record<string, any>} [params] - Custom parameters
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
