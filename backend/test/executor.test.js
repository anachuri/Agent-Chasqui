import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPolicy } from '../src/guards.js';
import { createMemoryStore } from '../src/store.js';
import { pay } from '../src/executor.js';
import { validateTagCode, assertTagged } from '../src/tag.js';

const TO = '0x1111111111111111111111111111111111111111';
const TOKEN = '0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d';
const SUFFIX = '0x8021deadbeef';

function setup(over = {}) {
  const sent = [];
  const deps = {
    policy: loadPolicy({ currency: 'ARS', maxPerPayment: '5', dailyBudget: '8', allowedRecipients: [TO] }),
    store: createMemoryStore(), mode: 'live', token: TOKEN, decimals: 18, suffixHex: SUFFIX,
    buildTransferData: (to, u) => '0xa9059cbb' + u.toString(16).padStart(64, '0'),
    send: async (tx) => { sent.push(tx); return '0xhash'; },
    now: () => new Date('2026-10-18T15:00:00Z'),
    ...over,
  };
  return { sent, deps };
}

test('dry-run: no envía y muestra el calldata con tag', async () => {
  const { sent, deps } = setup({ mode: 'dry-run' });
  const r = await pay(deps, { to: TO, amount: '1' });
  assert.equal(r.status, 'dry-run');
  assert.equal(sent.length, 0);
  assert.ok(r.preview.data.endsWith('8021deadbeef'));
  assert.equal(r.amountText, 'ARS 1,00');
});

test('live: envía una vez, con tag al final, y registra el gasto', async () => {
  const { sent, deps } = setup();
  const r = await pay(deps, { to: TO, amount: '1' });
  assert.equal(r.status, 'sent');
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, TOKEN);
  assert.ok(sent[0].data.endsWith('8021deadbeef'));
  assert.equal(await deps.store.spentToday(deps.now()), 100n);
});

test('sin tag: bloquea y no envía', async () => {
  for (const suffixHex of [undefined, '', '0x']) {
    const { sent, deps } = setup({ suffixHex });
    const r = await pay(deps, { to: TO, amount: '1' });
    assert.equal(r.status, 'blocked');
    assert.equal(sent.length, 0);
  }
});

test('topes: por pago, diario y destinatario; nada se envía de más', async () => {
  const { sent, deps } = setup();
  assert.equal((await pay(deps, { to: TO, amount: '6' })).code, 'OVER_PER_PAYMENT_CAP');
  assert.equal((await pay(deps, { to: '0x2222222222222222222222222222222222222222', amount: '1' })).code, 'RECIPIENT_NOT_ALLOWED');
  assert.equal((await pay(deps, { to: TO, amount: '4' })).status, 'sent');
  assert.equal((await pay(deps, { to: TO, amount: '4' })).status, 'sent');
  assert.equal((await pay(deps, { to: TO, amount: '1' })).code, 'OVER_DAILY_BUDGET');
  assert.equal(sent.length, 2);
});

test('el presupuesto diario se reinicia al día siguiente (UTC-3)', async () => {
  const { deps } = setup();
  await pay(deps, { to: TO, amount: '4' });
  await pay(deps, { to: TO, amount: '4' });
  const next = { ...deps, now: () => new Date('2026-10-19T15:00:00Z') };
  assert.equal((await pay(next, { to: TO, amount: '4' })).status, 'sent');
});

test('monto ambiguo se rechaza antes de tocar nada', async () => {
  const { sent, deps } = setup();
  assert.equal((await pay(deps, { to: TO, amount: '1.500' })).code, 'AMOUNT_AMBIGUOUS');
  assert.equal(sent.length, 0);
});

test('si el envío falla no se registra gasto', async () => {
  const { deps } = setup({ send: async () => { throw new Error('boom'); } });
  const r = await pay(deps, { to: TO, amount: '1' });
  assert.equal(r.status, 'failed');
  assert.equal(await deps.store.spentToday(deps.now()), 0n);
});

test('tag: validación del código y chequeo del sufijo', () => {
  assert.equal(validateTagCode('celo_d77d36f60ddb'), 'celo_d77d36f60ddb');
  for (const bad of [undefined, '', 'celo_', 'CELO_ABC', 'abc_123', 'celo_x y']) {
    assert.throws(() => validateTagCode(bad), { message: 'TAG_MISSING_OR_INVALID' });
  }
  assert.throws(() => assertTagged('0xa9059cbb00', SUFFIX), { message: 'TAG_NOT_APPENDED' });
  assert.doesNotThrow(() => assertTagged('0xa9059cbb008021deadbeef', SUFFIX));
  test('si se envía pero falla el registro local, informa que requiere conciliación', async () => {
  const { sent, deps } = setup({
    store: {
      spentToday: async () => 0n,
      record: async () => {
        throw new Error('disk full');
      },
    },
  });

  const r = await pay(deps, { to: TO, amount: '1' });

  assert.equal(sent.length, 1);
  assert.equal(r.status, 'sent-unrecorded');
  assert.equal(r.hash, '0xhash');
  assert.equal(r.code, 'LOCAL_RECORD_FAILED');
});
});
