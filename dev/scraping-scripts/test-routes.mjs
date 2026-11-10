import http from 'http';
import { spawn } from 'child_process';

const routes = [
  '/',
  '/de',
  '/es',
  '/fr',
  '/templates/mavric-estate',
  '/templates/aurelle-estates',
  '/templates/onyx-atelier',
  '/templates/vellum-edition',
  '/templates/halden-edition',
  '/templates/grain-form',
  '/templates/slowgrain',
  '/de/templates/mavric-estate',
  '/es/templates/aurelle-estates',
  '/fr/templates/onyx-atelier',
  '/robots.txt',
  '/sitemap.xml'
];

async function run() {
  console.log("Starting vite preview on port 4173...");
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: 'C:/Users/Dell/sparkstudio-web',
    shell: true
  });

  server.stdout.on('data', (d) => process.stdout.write(d));
  server.stderr.on('data', (d) => process.stderr.write(d));

  // Wait 2.5s for server to start
  await new Promise((r) => setTimeout(r, 2500));

  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    const url = `http://localhost:4173${route}`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      if (res.status === 200 && text.length > 50) {
        console.log(`[PASS] ${route} -> Status: 200, Length: ${text.length}`);
        passed++;
      } else {
        console.error(`[FAIL] ${route} -> Status: ${res.status}`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERR] ${route} -> ${e.message}`);
      failed++;
    }
  }

  console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
  server.kill();
  process.exit(failed > 0 ? 1 : 0);
}

run();
