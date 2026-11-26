import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { i18nReady } from './i18n';
import './index.css';
import App from './App.jsx';

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
const root = document.getElementById('root');
// Wait for this page's language file so the first render matches the pre-rendered HTML.
i18nReady.finally(() => {
  if (root.dataset.rendered === location.pathname) hydrateRoot(root, app);
  else createRoot(root).render(app);
});
