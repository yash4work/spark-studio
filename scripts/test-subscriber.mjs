import { saveSubscriber } from '../src/lib/supabase.js';

// Setup global window and localStorage mock
let store = {};
global.window = {
  localStorage: {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  }
};
global.localStorage = global.window.localStorage;

async function testSub() {
  console.log('Testing saveSubscriber edge cases...');

  // 1. Normal save
  let res1 = await saveSubscriber('test@example.com', 'expanding_pipeline');
  if (!res1.success) throw new Error('Normal save failed');
  const stored1 = JSON.parse(store['spark_subscribers']);
  if (stored1.length !== 1 || stored1[0].email !== 'test@example.com') throw new Error('Data mismatch in store 1');
  console.log('[PASS] Normal subscription saved to local cache');

  // 2. Duplicate email should not create duplicate entry
  let res2 = await saveSubscriber('  TEST@Example.com ', 'expanding_pipeline');
  if (!res2.success) throw new Error('Duplicate save failed');
  const stored2 = JSON.parse(store['spark_subscribers']);
  if (stored2.length !== 1) throw new Error('Duplicate was inserted!');
  console.log('[PASS] Duplicate subscription deduped safely');

  // 3. Corrupted localStorage data (non-array string)
  store['spark_subscribers'] = 'invalid json {[';
  let res3 = await saveSubscriber('another@domain.com', 'expanding_pipeline');
  if (!res3.success) throw new Error('Corrupted JSON save failed');
  const stored3 = JSON.parse(store['spark_subscribers']);
  if (!Array.isArray(stored3) || stored3[0].email !== 'another@domain.com') throw new Error('Failed to recover from corrupted store');
  console.log('[PASS] Gracefully recovered from corrupted localStorage string');

  // 4. localStorage throwing QuotaExceededError or write failure
  global.window.localStorage.setItem = () => {
    throw new Error('QuotaExceededError');
  };
  let res4 = await saveSubscriber('quota@domain.com', 'expanding_pipeline');
  if (!res4.success) throw new Error('Failed on storage throw');
  console.log('[PASS] Safe error handling when localStorage throws');

  // 5. Window undefined (SSR environment)
  delete global.window;
  let res5 = await saveSubscriber('ssr@domain.com', 'expanding_pipeline');
  if (!res5.success) throw new Error('Failed under SSR');
  console.log('[PASS] Safe operation in SSR environment without window');

  console.log('ALL saveSubscriber TESTS PASSED SUCCESSFULLY!');
}

testSub().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
