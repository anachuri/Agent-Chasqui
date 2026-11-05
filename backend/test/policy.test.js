import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DEMO_POLICY } from '../src/demo.js';
import handler from '../api/policy.js';

function call(method) {
  const out = { headers: {} };
  const res = {
    setHeader: (k, v) => { out.headers[k] = v; },
    status: (c) => { out.status = c; return res; },
    json: (b) => { out.body = b; return res; },
    end: () => res,
  };
  handler({ method, query: {} }, res);
  return out;
}

test('la UI puede leer los límites vigentes de la demo', () => {
  const r = call('GET');
  assert.equal(r.status, 200);
  assert.equal(r.body.currency, DEMO_POLICY.currency);
  assert.equal(r.body.maxPerPaymentCents, DEMO_POLICY.maxPerPayment.toString());
  assert.equal(r.body.dailyBudgetCents, DEMO_POLICY.dailyBudget.toString());
  assert.equal(r.body.mode, 'dry-run');
  assert.equal(r.headers['Access-Control-Allow-Origin'], '*');
});

test('solo responde GET y OPTIONS', () => {
  assert.equal(call('OPTIONS').status, 204);
  assert.equal(call('POST').status, 405);
});

test('el endpoint de política no importa billetera, claves ni red', () => {
  const src = readFileSync(new URL('../api/policy.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /wallet|viem|executor|PRIVATE_KEY|process\.env|fetch\(/i);
});
