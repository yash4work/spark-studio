// Tests for the shared form helpers (email validation + spam guard).
import assert from 'node:assert/strict';
import { isValidEmail, isLikelySpam, MIN_FILL_TIME_MS } from '../src/lib/formGuard.js';

const valid = ['user@example.com', 'user.name+tag@sub.domain.co', 'a@b.io', '  padded@example.com  '];
const invalid = ['', '   ', 'invalid-email', '@no-local.com', 'no-tld@domain', 'user@domain..com',
  '.user@example.com', 'user.@example.com', 'us..er@example.com', 'user@-example.com', 'user@example.c', 'a b@example.com'];

for (const e of valid) assert.equal(isValidEmail(e), true, `should accept "${e}"`);
for (const e of invalid) assert.equal(isValidEmail(e), false, `should reject "${e}"`);
console.log(`[PASS] Email validation (${valid.length} valid, ${invalid.length} invalid cases).`);

const now = 1_000_000;
assert.equal(isLikelySpam({ honeypot: '', startedAt: now - 10_000, now }), false, 'normal person');
assert.equal(isLikelySpam({ honeypot: 'http://spam.example', startedAt: now - 10_000, now }), true, 'honeypot filled');
assert.equal(isLikelySpam({ honeypot: '', startedAt: now - (MIN_FILL_TIME_MS - 1), now }), true, 'too fast');
assert.equal(isLikelySpam({ honeypot: '', startedAt: undefined, now }), false, 'no timestamp -> rely on honeypot only');
console.log('[PASS] Spam guard (honeypot + minimum fill time).');
