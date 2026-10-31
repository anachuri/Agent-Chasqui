// Validación determinística de la agent card (ERC-8004) antes de registrar.
// Según los docs de Celo: se publica el archivo SIN "registrations", se registra,
// y recién después se agrega el agentId al archivo.
const TYPE = 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1';

export function checkAgentCard(card, { wallet, chainId = 42220 } = {}) {
  const problems = [];
  if (!card || typeof card !== 'object') return ['NOT_AN_OBJECT'];
  if (/COMPLETAR|TU_TAG|TU_DIRECCION|xxxxxxxx/i.test(JSON.stringify(card))) problems.push('PLACEHOLDERS_LEFT');
  if (card.type !== TYPE) problems.push('BAD_TYPE');
  if (!card.name || !card.description) problems.push('MISSING_NAME_OR_DESCRIPTION');
  const services = Array.isArray(card.services) ? card.services : [];
  const web = services.find((s) => s?.name === 'web');
  if (!web || !/^https:\/\/[^\s]+$/.test(web.endpoint ?? '')) problems.push('BAD_WEB_ENDPOINT');
  const w = services.find((s) => s?.name === 'agentWallet');
  const expected = `eip155:${chainId}:${wallet ?? ''}`.toLowerCase();
  if (!w || String(w.endpoint ?? '').toLowerCase() !== expected) problems.push('WALLET_MISMATCH');
  const tags = Array.isArray(card['x-attribution']) ? card['x-attribution'] : [];
  if (!tags.length || !tags.every((t) => /^celo_[a-z0-9]{1,27}$/.test(String(t)))) problems.push('BAD_ATTRIBUTION');
  if (card.registrations !== undefined) problems.push('REGISTRATIONS_BEFORE_REGISTER');
  return problems;
}
