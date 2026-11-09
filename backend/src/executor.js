import {
  parseFiatToCents,
  centsToTokenUnits,
  formatCents,
  checkPayment,
} from './guards.js';

import { appendSuffix, assertTagged } from './tag.js';

/**
 * Único camino hacia la red.
 * Orden: parsear -> límites -> calldata -> tag -> dry-run o envío.
 */
export async function pay(deps, intent) {
  const {
    policy,
    store,
    mode,
    token,
    decimals,
    suffixHex,
    buildTransferData,
    send,
    now,
  } = deps;

  let amountCents;

  try {
    amountCents = parseFiatToCents(intent.amount);
  } catch (e) {
    return { status: 'rejected', code: e.message };
  }

  const spent = await store.spentToday(now());

  const verdict = checkPayment(policy, spent, {
    to: intent.to,
    amountCents,
  });

  if (!verdict.ok) {
    return { status: 'rejected', code: verdict.code };
  }

  let data;

  try {
    data = appendSuffix(
      buildTransferData(
        intent.to,
        centsToTokenUnits(amountCents, decimals),
      ),
      suffixHex,
    );

    assertTagged(data, suffixHex);
  } catch (e) {
    return { status: 'blocked', code: e.message };
  }

  const amountText = formatCents(amountCents, policy.currency);

  if (mode !== 'live') {
    return {
      status: 'dry-run',
      amountText,
      to: intent.to,
      preview: { to: token, data },
    };
  }

  let hash;

  // Primera etapa: solicitar el envío.
  try {
    hash = await send({ to: token, data });
  } catch (e) {
    return {
      status: 'failed',
      code: 'SEND_FAILED',
      error: String(e.message ?? e),
    };
  }

  // Segunda etapa: registrar el gasto local.
  try {
    await store.record(now(), amountCents, hash);
  } catch (e) {
    return {
      status: 'sent-unrecorded',
      amountText,
      hash,
      code: 'LOCAL_RECORD_FAILED',
      error: String(e.message ?? e),
    };
  }

  return {
    status: 'sent',
    amountText,
    hash,
  };
}
