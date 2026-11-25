import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.thesparkstudio.digital';

// Core Priority URLs for Instant Indexing in Google Search Console
export const PRIORITY_INDEXING_URLS = [
  // 1. Missing Template Landing Pages
  `${BASE_URL}/templates/onyx-atelier`,
  `${BASE_URL}/templates/mavric-estate`,
  `${BASE_URL}/templates/slowgrain`,
  `${BASE_URL}/templates/terra`,
  `${BASE_URL}/templates/sasso-architect`,
  `${BASE_URL}/templates/tessovra`,
  `${BASE_URL}/templates/aurelle-estates`,
  `${BASE_URL}/templates/vellum-edition`,
  `${BASE_URL}/templates/halden-edition`,
  `${BASE_URL}/templates/grain-form`,

  // 2. High-Volume Buyer Comparison Articles (Commercial Search Terms)
  `${BASE_URL}/blog/top-10-framer-templates-for-architects-and-design-studios-2026`,
  `${BASE_URL}/blog/best-luxury-real-estate-framer-templates-for-brokers`,

  // 3. In-Depth Teardown Articles
  `${BASE_URL}/blog/onyx-atelier-framer-architecture-template-review`,
  `${BASE_URL}/blog/slowgrain-solum-framer-architecture-template-free-review`,
  `${BASE_URL}/blog/sasso-architect-framer-template-review`,
  `${BASE_URL}/blog/aurelle-estates-framer-architecture-template-review`,
  `${BASE_URL}/blog/vellum-edition-framer-architecture-template-review`,
  `${BASE_URL}/blog/top-framer-templates-for-real-estate-and-architecture-2026`,

  // 4. International Multi-lingual High-Priority URLs (DE, ES, FR)
  `${BASE_URL}/de/blog/best-luxury-real-estate-framer-templates-for-brokers`,
  `${BASE_URL}/es/blog/best-luxury-real-estate-framer-templates-for-brokers`,
  `${BASE_URL}/fr/blog/best-luxury-real-estate-framer-templates-for-brokers`,
  `${BASE_URL}/de/templates/onyx-atelier`,
  `${BASE_URL}/es/templates/onyx-atelier`,
  `${BASE_URL}/fr/templates/onyx-atelier`,
  `${BASE_URL}/de/templates/mavric-estate`,
  `${BASE_URL}/es/templates/mavric-estate`,
  `${BASE_URL}/fr/templates/mavric-estate`
];

async function run() {
  console.log('=====================================================');
  console.log('GOOGLE SEARCH CONSOLE INSTANT INDEXING MANIFEST');
  console.log('=====================================================');
  console.log(`Total URLs Prepared: ${PRIORITY_INDEXING_URLS.length}\n`);

  // Write URL list to file for easy copy-paste into GSC URL Inspection or batch tools
  const outputPath = path.join(projectRoot, 'public', 'indexing-urls.txt');
  fs.writeFileSync(outputPath, PRIORITY_INDEXING_URLS.join('\n'), 'utf8');
  console.log(`Wrote indexing URLs list to: ${outputPath}\n`);

  console.log('Priority Indexing URLs:');
  PRIORITY_INDEXING_URLS.forEach((url, i) => {
    console.log(`${i + 1}. ${url}`);
  });
  console.log('=====================================================');
}

run();
