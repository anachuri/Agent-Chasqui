// Operaciones de Chasqui Tech: tres roles (exportador, importador, transportista).
// Solo se puede pagar a una parte que EXISTE en la operación y que ya CONFIRMÓ.
// Lógica pura: no toca red, claves ni billeteras.
import { parseFiatToCents, formatCents, checkPayment } from './guards.js';

export const KNOWN_CODES = Object.freeze([
  'OVER_PER_PAYMENT_CAP', 'OVER_DAILY_BUDGET', 'RECIPIENT_NOT_ALLOWED', 'AMOUNT_AMBIGUOUS',
  'AMOUNT_TOO_PRECISE', 'AMOUNT_NOT_POSITIVE', 'AMOUNT_INVALID', 'BAD_ADDRESS', 'OPERATION_NOT_FOUND',
]);

/** Devuelve {ok, address} o {ok:false, code}. El "to" del pedido es un ROL, nunca una dirección. */
export function resolveParty(operation, role) {
  const parties = operation?.parties;
  if (!parties || typeof role !== 'string' || !Object.hasOwn(parties, role)) {
    return { ok: false, code: 'RECIPIENT_NOT_ALLOWED' };
  }
  const party = parties[role];
  if (!party?.confirmed) return { ok: false, code: 'RECIPIENT_NOT_ALLOWED' };
  return { ok: true, address: party.address };
}

/** La lista de destinatarios permitidos de una operación = sus partes confirmadas. */
export function policyForOperation(policy, operation) {
  const confirmed = Object.values(operation.parties)
    .filter((p) => p.confirmed)
    .map((p) => p.address.toLowerCase());
  return Object.freeze({ ...policy, allowedRecipients: Object.freeze(confirmed) });
}

/** Evalúa un pedido {operation, to, amount} sin enviar nada. */
export function evaluatePayment({ policy, operations, request, spentTodayCents = 0n }) {
  const id = request?.operation;
  if (typeof id !== 'string' || !Object.hasOwn(operations, id)) {
    return { status: 'rejected', code: 'OPERATION_NOT_FOUND' };
  }
  const operation = operations[id];

  let amountCents;
  try { amountCents = parseFiatToCents(request.amount); }
  catch (e) { return { status: 'rejected', code: e.message }; }

  const party = resolveParty(operation, request.to);
  if (!party.ok) return { status: 'rejected', code: party.code };

  const verdict = checkPayment(policyForOperation(policy, operation), spentTodayCents, {
    to: party.address,
    amountCents,
  });
  if (!verdict.ok) return { status: 'rejected', code: verdict.code };

  return { status: 'dry-run', amountText: formatCents(amountCents, policy.currency), to: request.to, operation: id };
}

/** Respuestas fijas para que el frontend pruebe todos los estados. Siempre marcadas como simuladas. */
export function simulatedResponse(sim, request) {
  const amountText = 'ARS 1.500,00';
  if (sim === 'sent') {
    return { status: 'sent', simulated: true, amountText, hash: '0x' + '0'.repeat(64) };
  }
  if (sim === 'failed') return { status: 'failed', simulated: true, code: 'SEND_FAILED' };
  if (sim === 'blocked') return { status: 'blocked', simulated: true, code: 'TAG_NOT_APPENDED' };
  if (sim === 'dry-run') {
    return { status: 'dry-run', simulated: true, amountText, to: request?.to ?? 'transportista' };
  }
  if (KNOWN_CODES.includes(sim)) return { status: 'rejected', simulated: true, code: sim };
  return { status: 'rejected', simulated: true, code: 'UNKNOWN_SIMULATION' };
}
