import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DEMO_POLICY, DEMO_OPERATIONS } from '../src/demo.js';
import { evaluatePayment, simulatedResponse, resolveParty, KNOWN_CODES } from '../src/operation.js';
import handler from '../api/pay.js';

const ev = (request, spentTodayCents = 0n) =>
  evaluatePayment({ policy: DEMO_POLICY, operations: DEMO_OPERATIONS, request, spentTodayCents });

test('pago válido a una parte confirmada: ensayo, sin enviar', () => {
  const r = ev({ operation: 'OP-DEMO-1', to: 'transportista', amount: '1500,00' });
  assert.deepEqual(r, { status: 'dry-run', amountText: 'ARS 1.500,00', to: 'transportista', operation: 'OP-DEMO-1' });
});

test('tope por pago y presupuesto diario', () => {
  assert.equal(ev({ operation: 'OP-DEMO-1', to: 'exportador', amount: '6000' }).code, 'OVER_PER_PAYMENT_CAP');
  assert.equal(ev({ operation: 'OP-DEMO-1', to: 'exportador', amount: '2000' }, 1900000n).code, 'OVER_DAILY_BUDGET');
});

test('solo se paga a partes confirmadas de la operación', () => {
  assert.equal(ev({ operation: 'OP-DEMO-2', to: 'transportista', amount: '100' }).code, 'RECIPIENT_NOT_ALLOWED');
  assert.equal(ev({ operation: 'OP-DEMO-2', to: 'exportador', amount: '100' }).status, 'dry-run');
});

test('roles desconocidos o maliciosos se rechazan', () => {
  for (const to of ['banco', '__proto__', 'constructor', '', 5, undefined, null, '0x1111111111111111111111111111111111111111']) {
    assert.equal(ev({ operation: 'OP-DEMO-1', to, amount: '100' }).code, 'RECIPIENT_NOT_ALLOWED', String(to));
  }
  assert.equal(resolveParty(DEMO_OPERATIONS['OP-DEMO-1'], 'toString').ok, false);
});

test('operaciones desconocidas se rechazan', () => {
  for (const operation of ['OP-NO-EXISTE', '__proto__', 'constructor', undefined, 7]) {
    assert.equal(ev({ operation, to: 'exportador', amount: '100' }).code, 'OPERATION_NOT_FOUND', String(operation));
  }
});

test('montos ambiguos, imprecisos, negativos y cero', () => {
  assert.equal(ev({ operation: 'OP-DEMO-1', to: 'exportador', amount: '1.500' }).code, 'AMOUNT_AMBIGUOUS');
  assert.equal(ev({ operation: 'OP-DEMO-1', to: 'exportador', amount: '1,234' }).code, 'AMOUNT_TOO_PRECISE');
  assert.equal(ev({ operation: 'OP-DEMO-1', to: 'exportador', amount: '-5' }).code, 'AMOUNT_INVALID');
  assert.equal(ev({ operation: 'OP-DEMO-1', to: 'exportador', amount: '0' }).code, 'AMOUNT_NOT_POSITIVE');
});

test('respuestas simuladas: siempre marcadas y con los códigos del contrato', () => {
  assert.equal(simulatedResponse('sent').simulated, true);
  assert.match(simulatedResponse('sent').hash, /^0x0{64}$/);
  assert.equal(simulatedResponse('failed').code, 'SEND_FAILED');
  assert.equal(simulatedResponse('blocked').status, 'blocked');
  for (const c of KNOWN_CODES) assert.deepEqual(simulatedResponse(c), { status: 'rejected', simulated: true, code: c });
  assert.equal(simulatedResponse('cualquier-cosa').code, 'UNKNOWN_SIMULATION');
});

test('el endpoint de ensayo no puede enviar dinero: no importa billetera, claves ni red', () => {
  const src = readFileSync(new URL('../api/pay.js', import.meta.url), 'utf8');
  const ops = readFileSync(new URL('../src/operation.js', import.meta.url), 'utf8');
  const demo = readFileSync(new URL('../src/demo.js', import.meta.url), 'utf8');
  for (const text of [src, ops, demo]) {
    assert.doesNotMatch(text, /wallet|viem|executor|PRIVATE_KEY|process\.env|fetch\(/i);
  }
});

function call(method, { body, query } = {}) {
  const out = { headers: {} };
  const res = {
    setHeader: (k, v) => { out.headers[k] = v; },
    status: (c) => { out.status = c; return res; },
    json: (b) => { out.body = b; return res; },
    end: () => res,
  };
  handler({ method, body, query }, res);
  return out;
}

test('handler: POST, GET, OPTIONS, cuerpo inválido y simulate', () => {
  const ok = call('POST', { body: { operation: 'OP-DEMO-1', to: 'importador', amount: '800' } });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.status, 'dry-run');
  assert.equal(ok.headers['Access-Control-Allow-Origin'], '*');
  assert.equal(call('GET').status, 405);
  assert.equal(call('OPTIONS').status, 204);
  assert.equal(call('POST', { body: '{no es json' }).status, 400);
  assert.equal(call('POST', { body: JSON.stringify({ operation: 'OP-DEMO-1', to: 'importador', amount: '800' }) }).body.status, 'dry-run');
  assert.equal(call('POST', { body: {}, query: { simulate: 'sent' } }).body.simulated, true);
  assert.equal(call('POST', { body: {}, query: { simulate: 'OVER_DAILY_BUDGET' } }).body.code, 'OVER_DAILY_BUDGET');
});
