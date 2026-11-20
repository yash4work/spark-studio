import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import i18n from './i18n';
import { HeadContext } from './components/SEOHead';

export async function render(route, lang) {
  await i18n.changeLanguage(lang);
  const head = {};
  const body = renderToString(<HeadContext.Provider value={head}><StaticRouter location={route}><App /></StaticRouter></HeadContext.Provider>);
  return { head, body };
}
