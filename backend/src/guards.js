// Límites 100% determinísticos. El LLM nunca importa ni modifica este módulo:
// solo el ejecutor lo usa, con una política cargada desde policy.json.
const ADDR = /^0x[0-9a-fA-F]{40}$/;

/** "1", "1,50", "1.500,50", "$ 2.000,00" -> centavos (bigint). Rechaza lo ambiguo. */
export function parseFiatToCents(input) {
  if (typeof input !== 'string' && typeof input !== 'number') throw new Error('AMOUNT_INVALID');
  const raw = String(input).trim();
  if (raw.includes('-')) throw new Error('AMOUNT_INVALID');
  const s = raw.replace(/[^\d.,]/g, '');
  if (!/\d/.test(s)) throw new Error('AMOUNT_INVALID');
  const lastDot = s.lastIndexOf('.');
  const lastComma = s.lastIndexOf(',');
  const dots = (s.match(/\./g) ?? []).length;
  const commas = (s.match(/,/g) ?? []).length;
  let dec = null;
  if (lastDot >= 0 && lastComma >= 0) dec = lastDot > lastComma ? '.' : ',';
  else if (lastComma >= 0) {
    if (commas > 1) throw new Error('AMOUNT_INVALID');
    dec = ',';
  } else if (lastDot >= 0 && dots === 1) {
    if (s.length - lastDot - 1 === 3) throw new Error('AMOUNT_AMBIGUOUS'); // "1.500"
    dec = '.';
  }
  let int = s;
  let frac = '';
  if (dec) {
    const i = s.lastIndexOf(dec);
    int = s.slice(0, i);
    frac = s.slice(i + 1);
  }
  int = int.replace(/[.,]/g, '');
  if (frac.length > 2) throw new Error('AMOUNT_TOO_PRECISE');
  return BigInt(int || '0') * 100n + BigInt(frac.padEnd(2, '0') || '0');
}

/** wFIAT está 1:1 con la moneda local: centavos -> unidades del token. */
export function centsToTokenUnits(cents, decimals) {
  if (!Number.isInteger(decimals) || decimals < 2) throw new Error('DECIMALS_INVALID');
  return cents * 10n ** BigInt(decimals - 2);
}

/** Formato es-AR para mostrarle al usuario: ARS 1.500,50 */
export function formatCents(cents, currency) {
  const whole = (cents / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const frac = (cents % 100n).toString().padStart(2, '0');
  return `${currency} ${whole},${frac}`;
}

export function loadPolicy(raw) {
  const maxPerPayment = parseFiatToCents(raw.maxPerPayment);
  const dailyBudget = parseFiatToCents(raw.dailyBudget);
  if (!raw.currency || typeof raw.currency !== 'string') throw new Error('POLICY_CURRENCY');
  if (maxPerPayment <= 0n || dailyBudget < maxPerPayment) throw new Error('POLICY_LIMITS');
  const allowed = (raw.allowedRecipients ?? []).map((a) => {
    if (!ADDR.test(a)) throw new Error('POLICY_RECIPIENT');
    return a.toLowerCase();
  });
  return Object.freeze({
    currency: raw.currency,
    maxPerPayment,
    dailyBudget,
    allowedRecipients: Object.freeze(allowed),
  });
}

export function checkPayment(policy, spentTodayCents, { to, amountCents }) {
  if (!ADDR.test(to ?? '')) return { ok: false, code: 'BAD_ADDRESS' };
  if (!policy.allowedRecipients.includes(to.toLowerCase())) return { ok: false, code: 'RECIPIENT_NOT_ALLOWED' };
  if (amountCents <= 0n) return { ok: false, code: 'AMOUNT_NOT_POSITIVE' };
  if (amountCents > policy.maxPerPayment) return { ok: false, code: 'OVER_PER_PAYMENT_CAP' };
  if (spentTodayCents + amountCents > policy.dailyBudget) return { ok: false, code: 'OVER_DAILY_BUDGET' };
  return { ok: true };
}

/** Dry-run salvo que estén las DOS variables explícitas. */
export function resolveMode(env) {
  return env.AGENT_MODE === 'live' && env.CONFIRM_REAL_PAYMENTS === 'yes-move-real-money' ? 'live' : 'dry-run';
}
