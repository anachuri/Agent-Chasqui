
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  existsSync,
} from 'node:fs';

import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const STORE_PATH = resolve(
  process.env.STORE_PATH || './data/transactions.json'
);

const DAILY_BUDGET = Number(
  process.env.DAILY_BUDGET || 100
);

const ALLOWED_TOKENS = ['wARS', 'wBRL'];

const TERMINAL_STATES = [
  'confirmed',
  'failed',
  'cancelled',
];

function ensureStore() {
  mkdirSync(dirname(STORE_PATH), { recursive: true });

  if (!existsSync(STORE_PATH)) {
    writeFileSync(
      STORE_PATH,
      JSON.stringify({
        version: 1,
        transactions: [],
      }, null, 2),
      { flag: 'wx' }
    );
  }
}

function readStore() {
  ensureStore();

  const data = JSON.parse(
    readFileSync(STORE_PATH, 'utf8')
  );

  if (
    data.version !== 1 ||
    !Array.isArray(data.transactions)
  ) {
    throw new Error('STORE_INVALID');
  }

  return data;
}

function writeStore(data) {
  ensureStore();

  const tempPath = `${STORE_PATH}.tmp`;

  writeFileSync(
    tempPath,
    JSON.stringify(data, null, 2),
    { mode: 0o600 }
  );

  renameSync(tempPath, STORE_PATH);
}

function normalizeAmount(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('INVALID_AMOUNT');
  }

  return value;
}

function normalizeToken(token) {
  if (!ALLOWED_TOKENS.includes(token)) {
    throw new Error('UNSUPPORTED_TOKEN');
  }

  return token;
}

function getDayKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: process.env.STORE_TIMEZONE || 'America/Argentina/Jujuy',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function createOperationId({
  from,
  to,
  token,
  amount,
  reference,
}) {
  if (reference) {
    return String(reference);
  }

  return createHash('sha256')
    .update(JSON.stringify({
      from: String(from || '').toLowerCase(),
      to: String(to || '').toLowerCase(),
      token,
      amount,
    }))
    .digest('hex');
}

function isActive(transaction) {
  return !TERMINAL_STATES.includes(transaction.status);
}

export function getDailySpent(token, date = new Date()) {
  token = normalizeToken(token);

  const day = getDayKey(date);
  const { transactions } = readStore();

  return transactions
    .filter(tx =>
      tx.day === day &&
      tx.token === token &&
      ['confirmed', 'executing'].includes(tx.status)
    )
    .reduce((total, tx) => total + Number(tx.amount), 0);
}

export function getDailyBudgetRemaining(token, date = new Date()) {
  token = normalizeToken(token);

  const spent = getDailySpent(token, date);

  return Math.max(0, DAILY_BUDGET - spent);
}

export function assertDailyBudget(token, amount, date = new Date()) {
  token = normalizeToken(token);
  amount = normalizeAmount(amount);

  const spent = getDailySpent(token, date);

  if (spent + amount > DAILY_BUDGET) {
    throw new Error('DAILY_BUDGET_EXCEEDED');
  }

  return true;
}

export function findTransaction(id) {
  const { transactions } = readStore();

  return transactions.find(tx => tx.id === id) || null;
}

export function findDuplicate({
  from,
  to,
  token,
  amount,
  reference,
}) {
  token = normalizeToken(token);
  amount = normalizeAmount(amount);

  const id = createOperationId({
    from,
    to,
    token,
    amount,
    reference,
  });

  const { transactions } = readStore();

  return transactions.find(tx =>
    tx.id === id || (
      tx.from === String(from || '').toLowerCase() &&
      tx.to === String(to || '').toLowerCase() &&
      tx.token === token &&
      Number(tx.amount) === amount &&
      isActive(tx)
    )
  ) || null;
}

export function createTransaction({
  from,
  to,
  token,
  amount,
  reference,
  metadata = {},
}) {
  token = normalizeToken(token);
  amount = normalizeAmount(amount);

  if (!from || !to) {
    throw new Error('INVALID_ADDRESSES');
  }

  const normalizedFrom = String(from).toLowerCase();
  const normalizedTo = String(to).toLowerCase();

  if (normalizedFrom === normalizedTo) {
    throw new Error('SELF_TRANSFER_NOT_ALLOWED');
  }

  const id = createOperationId({
    from: normalizedFrom,
    to: normalizedTo,
    token,
    amount,
    reference,
  });

  const data = readStore();

  const duplicate = data.transactions.find(tx =>
    tx.id === id || (
      tx.from === normalizedFrom &&
      tx.to === normalizedTo &&
      tx.token === token &&
      Number(tx.amount) === amount &&
      isActive(tx)
    )
  );

  if (duplicate) {
    throw new Error('DUPLICATE_TRANSACTION');
  }

  const day = getDayKey();

  const spent = data.transactions
    .filter(tx =>
      tx.day === day &&
      tx.token === token &&
      ['confirmed', 'executing'].includes(tx.status)
    )
    .reduce((total, tx) => total + Number(tx.amount), 0);

  if (spent + amount > DAILY_BUDGET) {
    throw new Error('DAILY_BUDGET_EXCEEDED');
  }

  const transaction = {
    id,
    from: normalizedFrom,
    to: normalizedTo,
    token,
    amount,
    day,
    status: 'pending',
    txHash: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata,
  };

  data.transactions.push(transaction);
  writeStore(data);

  return transaction;
}

export function updateTransaction(id, updates = {}) {
  const data = readStore();

  const index = data.transactions.findIndex(
    tx => tx.id === id
  );

  if (index === -1) {
    throw new Error('TRANSACTION_NOT_FOUND');
  }

  const current = data.transactions[index];

  const allowedUpdates = [
    'status',
    'txHash',
    'metadata',
  ];

  for (const key of Object.keys(updates)) {
    if (!allowedUpdates.includes(key)) {
      throw new Error(`INVALID_UPDATE_FIELD: ${key}`);
    }
  }

  const allowedTransitions = {
    pending: ['executing', 'failed', 'cancelled'],
    executing: ['confirmed', 'failed'],
    confirmed: [],
    failed: [],
    cancelled: [],
  };

  if (
    updates.status &&
    !allowedTransitions[current.status]?.includes(updates.status)
  ) {
    throw new Error('INVALID_STATUS_TRANSITION');
  }

  if (updates.status === 'confirmed' && !updates.txHash) {
    throw new Error('TX_HASH_REQUIRED');
  }

  if (updates.txHash !== undefined) {
    if (
      typeof updates.txHash !== 'string' ||
      !/^0x[a-fA-F0-9]{64}$/.test(updates.txHash)
    ) {
      throw new Error('INVALID_TX_HASH');
    }
  }

  data.transactions[index] = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeStore(data);

  return data.transactions[index];
}

export function listTransactions({
  status,
  token,
  limit = 100,
} = {}) {
  const data = readStore();

  let transactions = data.transactions;

  if (status) {
    transactions = transactions.filter(
      tx => tx.status === status
    );
  }

  if (token) {
    token = normalizeToken(token);

    transactions = transactions.filter(
      tx => tx.token === token
    );
  }

  const safeLimit = Math.max(
    1,
    Math.min(Number(limit) || 100, 500)
  );

  return transactions.slice(-safeLimit).reverse();
}
