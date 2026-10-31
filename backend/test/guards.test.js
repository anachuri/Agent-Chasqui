import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFiatToCents, centsToTokenUnits, formatCents, loadPolicy, checkPayment, resolveMode } from '../src/guards.js';

const A = '0x1111111111111111111111111111111111111111';

test('parseFiatToCents: formatos es-AR y básicos', () => {
  assert.equal(parseFiatToCents('1'), 100n);
  assert.equal(parseFiatToCents('1,50'), 150n);
  assert.equal(parseFiatToCents('1.5'), 150n);
  assert.equal(parseFiatToCents('$ 1.500,50'), 150050n);
  assert.equal(parseFiatToCents('1.500.000'), 150000000n);
  assert.equal(parseFiatToCents(2), 200n);
});

test('parseFiatToCents: rechaza lo ambiguo, negativo o con más de 2 decimales', () => {
  for (const [v, code] of [['1.500', 'AMOUNT_AMBIGUOUS'], ['-5', 'AMOUNT_INVALID'], ['1,234', 'AMOUNT_TOO_PRECISE'],
    ['abc', 'AMOUNT_INVALID'], ['', 'AMOUNT_INVALID'], ['1,500,000', 'AMOUNT_INVALID']]) {
    assert.throws(() => parseFiatToCents(v), { message: code }, v);
  }
});

test('centsToTokenUnits y formatCents', () => {
  assert.equal(centsToTokenUnits(100n, 18), 10n ** 18n);
  assert.equal(centsToTokenUnits(150n, 6), 1_500_000n);
  assert.throws(() => centsToTokenUnits(100n, 1));
  assert.equal(formatCents(150050n, 'ARS'), 'ARS 1.500,50');
});

test('loadPolicy valida y congela', () => {
  const p = loadPolicy({ currency: 'ARS', maxPerPayment: '2', dailyBudget: '5', allowedRecipients: [A] });
  assert.ok(Object.isFrozen(p) && Object.isFrozen(p.allowedRecipients));
  assert.throws(() => loadPolicy({ currency: 'ARS', maxPerPayment: '9', dailyBudget: '5', allowedRecipients: [A] }), { message: 'POLICY_LIMITS' });
  assert.throws(() => loadPolicy({ currency: 'ARS', maxPerPayment: '1', dailyBudget: '5', allowedRecipients: ['0x123'] }), { message: 'POLICY_RECIPIENT' });
});

test('checkPayment aplica cada tope', () => {
  const p = loadPolicy({ currency: 'ARS', maxPerPayment: '2', dailyBudget: '5', allowedRecipients: [A] });
  assert.deepEqual(checkPayment(p, 0n, { to: A, amountCents: 100n }), { ok: true });
  assert.equal(checkPayment(p, 0n, { to: '0x2222222222222222222222222222222222222222', amountCents: 100n }).code, 'RECIPIENT_NOT_ALLOWED');
  assert.equal(checkPayment(p, 0n, { to: 'nope', amountCents: 100n }).code, 'BAD_ADDRESS');
  assert.equal(checkPayment(p, 0n, { to: A, amountCents: 0n }).code, 'AMOUNT_NOT_POSITIVE');
  assert.equal(checkPayment(p, 0n, { to: A, amountCents: 201n }).code, 'OVER_PER_PAYMENT_CAP');
  assert.equal(checkPayment(p, 400n, { to: A, amountCents: 101n }).code, 'OVER_DAILY_BUDGET');
});

test('resolveMode: dry-run salvo las dos variables explícitas', () => {
  assert.equal(resolveMode({}), 'dry-run');
  assert.equal(resolveMode({ AGENT_MODE: 'live' }), 'dry-run');
  assert.equal(resolveMode({ CONFIRM_REAL_PAYMENTS: 'yes-move-real-money' }), 'dry-run');
  assert.equal(resolveMode({ AGENT_MODE: 'live', CONFIRM_REAL_PAYMENTS: 'yes' }), 'dry-run');
  assert.equal(resolveMode({ AGENT_MODE: 'live', CONFIRM_REAL_PAYMENTS: 'yes-move-real-money' }), 'live');
});
