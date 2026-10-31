import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAgentCard } from '../src/agentcard.js';

const W = '0x1111111111111111111111111111111111111111';
const good = () => ({
  type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
  name: 'Chasqui Tech',
  description: 'Agente de pagos en wBRL y wARS.',
  services: [
    { name: 'web', endpoint: 'https://agente-chasqui-tech.vercel.app' },
    { name: 'agentWallet', endpoint: `eip155:42220:${W}` },
  ],
  supportedTrust: ['reputation'],
  'x-attribution': ['celo_abc123def456'],
});

test('una card completa y sin registrations pasa', () => {
  assert.deepEqual(checkAgentCard(good(), { wallet: W }), []);
});

test('marcadores COMPLETAR bloquean', () => {
  const c = good(); c['x-source'] = 'COMPLETAR: repo';
  assert.ok(checkAgentCard(c, { wallet: W }).includes('PLACEHOLDERS_LEFT'));
});

test('la wallet de la card debe coincidir con la que registra', () => {
  const other = '0x2222222222222222222222222222222222222222';
  assert.ok(checkAgentCard(good(), { wallet: other }).includes('WALLET_MISMATCH'));
  assert.deepEqual(checkAgentCard(good(), { wallet: W.toUpperCase().replace('0X', '0x') }), []);
});

test('web debe ser https', () => {
  const c = good(); c.services[0].endpoint = 'http://agente-chasqui-tech.vercel.app';
  assert.ok(checkAgentCard(c, { wallet: W }).includes('BAD_WEB_ENDPOINT'));
});

test('registrations antes de registrar se rechaza (se agrega después)', () => {
  const c = good(); c.registrations = [{ agentId: 1, agentRegistry: 'x' }];
  assert.ok(checkAgentCard(c, { wallet: W }).includes('REGISTRATIONS_BEFORE_REGISTER'));
});

test('tipo, nombre y descripción obligatorios', () => {
  const c = good(); c.type = 'otro'; delete c.name;
  const p = checkAgentCard(c, { wallet: W });
  assert.ok(p.includes('BAD_TYPE') && p.includes('MISSING_NAME_OR_DESCRIPTION'));
});

test('el tag de atribución debe ser real: un placeholder o vacío se rechaza', () => {
  const c = good(); c['x-attribution'] = ['celo_TU_TAG'];
  const p = checkAgentCard(c, { wallet: W });
  assert.ok(p.includes('PLACEHOLDERS_LEFT'));
  const d = good(); delete d['x-attribution'];
  assert.ok(checkAgentCard(d, { wallet: W }).includes('BAD_ATTRIBUTION'));
  const e = good(); e['x-attribution'] = ['no_es_un_tag'];
  assert.ok(checkAgentCard(e, { wallet: W }).includes('BAD_ATTRIBUTION'));
});
