
import { TOKENS, CHAIN_ID } from '../src/config.js';

import {
  assertCeloNetwork,
  getTransactionReceipt,
} from '../src/wallet.js';

import { executePayment } from '../src/executor.js';

// --------------------------------------------------
// FIRST PAYMENT - CHASQUI TECH
// Dry-run by default through executor.js
// --------------------------------------------------

const ALLOWED_TOKENS = ['wARS', 'wBRL'];

function validateArguments(token, recipient, amount) {
  if (!ALLOWED_TOKENS.includes(token)) {
    throw new Error(
      `UNSUPPORTED_TOKEN: ${token}. Use wARS or wBRL.`
    );
  }

  if (!TOKENS[token]) {
    throw new Error('TOKEN_ADDRESS_NOT_CONFIGURED');
  }

  if (
    typeof recipient !== 'string' ||
    !/^0x[a-fA-F0-9]{40}$/.test(recipient)
  ) {
    throw new Error('INVALID_RECIPIENT_ADDRESS');
  }

  if (
    typeof amount !== 'string' ||
    !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(amount) ||
    Number(amount) <= 0 ||
    !Number.isFinite(Number(amount))
  ) {
    throw new Error('INVALID_PAYMENT_AMOUNT');
  }

  return {
    token,
    to: recipient,
    amount,
  };
}

async function main() {
  const [token, recipient, amount] =
    process.argv.slice(2);

  console.log('\n=== CHASQUI TECH ===');
  console.log('FIRST PAYMENT');
  console.log('====================');

  // 1. Validate input.
  const operation = validateArguments(
    token,
    recipient,
    amount
  );

  console.log('\nToken:', operation.token);
  console.log('Contract:', TOKENS[operation.token]);
  console.log('Recipient:', operation.to);
  console.log('Amount:', operation.amount);
  console.log('Network: Celo Mainnet');
  console.log('Chain ID:', CHAIN_ID);

  // 2. Verify network.
  await assertCeloNetwork();

  console.log('\nNetwork verification: OK');

  // 3. Send operation through central executor.
  // The executor decides dry-run or live.
  const result = await executePayment(operation);

  if (!result.success) {
    throw new Error(
      result.error || 'PAYMENT_EXECUTION_FAILED'
    );
  }

  // 4. Dry-run: no blockchain transfer.
  if (result.executed !== true) {
    console.log('\nDRY-RUN SUCCESS');
    console.log('No real transfer was made.');
    console.log('Operation:', result.transaction?.id);

    console.log('\nResult:');
    console.log(JSON.stringify(result, null, 2));

    return;
  }

  // 5. Verify transaction hash.
  if (
    typeof result.hash !== 'string' ||
    !/^0x[a-fA-F0-9]{64}$/.test(result.hash)
  ) {
    throw new Error('INVALID_TRANSACTION_HASH');
  }

  console.log('\nTransaction submitted:', result.hash);

  // 6. Verify on-chain receipt.
  const receipt = await getTransactionReceipt(
    result.hash
  );

  if (!receipt) {
    console.error(
      '\nReceipt not yet available. Do not retry the payment.'
    );

    process.exitCode = 2;
    return;
  }

  if (receipt.status !== 'success') {
    throw new Error('TRANSACTION_NOT_CONFIRMED');
  }

  // 7. Final confirmation.
  console.log('\nPAYMENT CONFIRMED');
  console.log('Transaction:', result.hash);
  console.log('Block:', receipt.blockNumber.toString());
  console.log('Token:', operation.token);
  console.log('Amount:', operation.amount);
  console.log('Recipient:', operation.to);

  console.log('\nCHASQUI TECH: PAYMENT SUCCESSFUL');
}

main().catch(error => {
  console.error('\nFIRST PAYMENT ERROR');
  console.error(error.message);

  process.exitCode = 1;
});
