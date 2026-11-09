
const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function parseFiatToCents(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error('INVALID_AMOUNT');
  }

  const raw = String(value).trim();

  // Acepta 1500, 1500.50 o 1500,50.
  // No acepta separadores de miles ambiguos.
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(raw)) {
    throw new Error('INVALID_AMOUNT_FORMAT');
  }

  const normalized = raw.replace(',', '.');
  const [whole, fraction = ''] = normalized.split('.');
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));

  if (cents <= 0n) throw new Error('AMOUNT_MUST_BE_POSITIVE');

  return cents;
}

export function centsToTokenUnits(cents, decimals) {
  if (typeof cents !== 'bigint' || cents <= 0n) {
    throw new Error('INVALID_CENTS');
  }

  if (!Number.isInteger(decimals) || decimals < 2 || decimals > 36) {
    throw new Error('INVALID_TOKEN_DECIMALS');
  }

  return cents * (10n ** BigInt(decimals - 2));
}

export function formatCents(cents, currency = 'ARS') {
  if (typeof cents !== 'bigint' || cents < 0n) {
    throw new Error('INVALID_CENTS');
  }

  const whole = cents / 100n;
  const fraction = String(cents % 100n).padStart(2, '0');

  return `${currency} ${whole},${fraction}`;
}

export function loadPolicy(policy) {
  if (!policy || typeof policy !== 'object') {
    throw new Error('INVALID_POLICY');
  }

  const currency = policy.currency;
  if (!['ARS', 'BRL'].includes(currency)) {
    throw new Error('UNSUPPORTED_CURRENCY');
  }

  const maxPerPayment = parseFiatToCents(String(policy.maxPerPayment));
  const dailyBudget = parseFiatToCents(String(policy.dailyBudget));

  if (maxPerPayment > dailyBudget) {
    throw new Error('PAYMENT_LIMIT_EXCEEDS_DAILY_BUDGET');
  }

  if (!Array.isArray(policy.allowedRecipients) ||
      policy.allowedRecipients.length === 0) {
    throw new Error('RECIPIENTS_REQUIRED');
  }

  const recipients = policy.allowedRecipients.map(address => {
    if (typeof address !== 'string' || !ADDRESS_RE.test(address)) {
      throw new Error('INVALID_RECIPIENT_ADDRESS');
    }

    if (/^0x0{40}$/i.test(address)) {
      throw new Error('ZERO_ADDRESS_NOT_ALLOWED');
    }

    return address.toLowerCase();
  });

  return Object.freeze({
    currency,
    maxPerPayment,
    dailyBudget,
    allowedRecipients: Object.freeze([...new Set(recipients)])
  });
}

export function checkPayment(policy, spentTodayCents, payment) {
  if (typeof spentTodayCents !== 'bigint' || spentTodayCents < 0n) {
    return { ok: false, code: 'INVALID_DAILY_SPENDING' };
  }

  if (!payment || typeof payment.to !== 'string' ||
      !ADDRESS_RE.test(payment.to) ||
      /^0x0{40}$/i.test(payment.to)) {
    return { ok: false, code: 'INVALID_RECIPIENT' };
  }

  if (!policy.allowedRecipients.includes(payment.to.toLowerCase())) {
    return { ok: false, code: 'RECIPIENT_NOT_ALLOWED' };
  }

  if (typeof payment.amountCents !== 'bigint' ||
      payment.amountCents <= 0n) {
    return { ok: false, code: 'INVALID_AMOUNT' };
  }

  if (payment.amountCents > policy.maxPerPayment) {
    return { ok: false, code: 'PAYMENT_LIMIT_EXCEEDED' };
  }

  if (spentTodayCents + payment.amountCents > policy.dailyBudget) {
    return { ok: false, code: 'DAILY_BUDGET_EXCEEDED' };
  }

  return { ok: true };
}

export function resolveMode(env = process.env) {
  const liveRequested =
    env.AGENT_MODE === 'live' &&
    env.CONFIRM_REAL_PAYMENTS === 'yes-move-real-money';

  return liveRequested ? 'live' : 'dry-run';
}

