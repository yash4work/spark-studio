import assert from 'node:assert/strict';
import { saveSubscriber, saveInquiry } from '../src/lib/supabase.js';

assert.equal((await saveSubscriber(' ')).success, false);
assert.equal((await saveSubscriber('test@example.invalid')).success, false);
assert.equal((await saveInquiry({ name: 'Test', email: 'test@example.invalid' })).success, false);
console.log('Unavailable storage correctly reports failed delivery.');
