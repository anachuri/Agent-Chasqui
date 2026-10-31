// ERC-8021: el sufijo se agrega en el cliente de la wallet, nunca en el contrato.
const CODE = /^celo_[a-z0-9]{1,27}$/;

export function validateTagCode(code) {
  if (!CODE.test(code ?? '')) throw new Error('TAG_MISSING_OR_INVALID');
  return code;
}

export function appendSuffix(dataHex, suffixHex) {
  if (!suffixHex || suffixHex.length < 4) throw new Error('TAG_MISSING_OR_INVALID');
  return dataHex + suffixHex.replace(/^0x/, '');
}

export function assertTagged(dataHex, suffixHex) {
  const s = (suffixHex ?? '').replace(/^0x/, '').toLowerCase();
  if (!s || !dataHex.toLowerCase().endsWith(s)) throw new Error('TAG_NOT_APPENDED');
}
