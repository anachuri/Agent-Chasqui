
import {
  createPublicClient,
  createWalletClient,
  http,
  encodeFunctionData,
  decodeFunctionResult,
  concat,
  parseEventLogs,
  getAddress,
  isAddress,
} from 'viem';

import { privateKeyToAccount } from 'viem/accounts';
import { celo } from 'viem/chains';

import {
  toDataSuffix,
  fromDataSuffix,
  verifyTx,
} from '@celo/attribution-tags';

import { resolveMode } from '../src/guards.js';

import {
  CHAIN_ID,
  RPC_URL,
} from '../src/config.js';

// --------------------------------------------------
// CHASQUI TECH - ERC-8004 REGISTRATION
// Celo Mainnet
// Dry-run by default
// --------------------------------------------------

const REGISTRY = getAddress(
  '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432'
);

const REGISTRY_ABI = [
  {
    type: 'function',
    name: 'register',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'agentURI', type: 'string' },
    ],
    outputs: [
      { name: 'agentId', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [
      { name: '', type: 'string' },
    ],
  },
  {
    type: 'event',
    name: 'Registered',
    anonymous: false,
    inputs: [
      {
        name: 'agentId',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'agentURI',
        type: 'string',
        indexed: false,
      },
      {
        name: 'owner',
        type: 'address',
        indexed: true,
      },
    ],
  },
];

const TIMEOUT = 120_000;

// --------------------------------------------------
// CLIENTS
// --------------------------------------------------

const publicClient = createPublicClient({
  chain: celo,
  transport: http(RPC_URL),
});

// --------------------------------------------------
// VALIDATE ATTRIBUTION
// --------------------------------------------------

function buildTaggedCalldata(calldata) {
  const code = process.env.CELO_ATTRIBUTION_CODE;

  if (
    !code ||
    !/^[a-z0-9_]{1,32}$/.test(code)
  ) {
    throw new Error('INVALID_CELO_ATTRIBUTION_CODE');
  }

  const suffix = toDataSuffix(code);
  const tagged = concat([calldata, suffix]);

  const decoded = fromDataSuffix(tagged);

  if (!decoded || !decoded.codes.includes(code)) {
    throw new Error('ATTRIBUTION_TAG_VERIFICATION_FAILED');
  }

  return tagged;
}

// --------------------------------------------------
// VALIDATE AGENT URI
// --------------------------------------------------

async function validateAgentURI(uri) {
  if (!uri || typeof uri !== 'string') {
    throw new Error('AGENT_URI_REQUIRED');
  }

  let url;

  try {
    url = new URL(uri);
  } catch {
    throw new Error('INVALID_AGENT_URI');
  }

  if (url.protocol !== 'https:') {
    throw new Error('AGENT_URI_MUST_USE_HTTPS');
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error('AGENT_URI_NOT_ACCESSIBLE');
  }

  const agent = await response.json();

  if (
    agent.type !==
    'https://eips.ethereum.org/EIPS/eip-8004#registration-v1'
  ) {
    throw new Error('INVALID_ERC8004_REGISTRATION_TYPE');
  }

  if (
    typeof agent.name !== 'string' ||
    !agent.name.trim() ||
    typeof agent.description !== 'string' ||
    !agent.description.trim()
  ) {
    throw new Error('INVALID_AGENT_METADATA');
  }

  return agent;
}

// --------------------------------------------------
// NETWORK VALIDATION
// --------------------------------------------------

async function assertNetwork() {
  const chainId = await publicClient.getChainId();

  if (chainId !== CHAIN_ID || chainId !== 42220) {
    throw new Error('WRONG_NETWORK');
  }

  const bytecode = await publicClient.getBytecode({
    address: REGISTRY,
  });

  if (!bytecode || bytecode === '0x') {
    throw new Error('ERC8004_REGISTRY_NOT_DEPLOYED');
  }

  return true;
}

// --------------------------------------------------
// MAIN REGISTRATION
// --------------------------------------------------

async function main() {
  console.log('\n=== CHASQUI TECH ===');
  console.log('ERC-8004 REGISTRATION');
  console.log('======================');

  // 1. Resolve execution mode.
  const mode = resolveMode();

  if (!['dry-run', 'live'].includes(mode)) {
    throw new Error('INVALID_EXECUTION_MODE');
  }

  // 2. Require explicit registration authorization.
  if (
    mode === 'live' &&
    process.env.ALLOW_8004_LIVE !== 'true'
  ) {
    throw new Error('ERC8004_LIVE_NOT_AUTHORIZED');
  }

  // 3. Load public agent metadata.
  const agentURI = process.env.AGENT_URI;

  const agent = await validateAgentURI(agentURI);

  console.log('\nAgent:', agent.name);
  console.log('Agent URI:', agentURI);
  console.log('Network: Celo Mainnet');
  console.log('Chain ID:', CHAIN_ID);
  console.log('Registry:', REGISTRY);
  console.log('Mode:', mode);

  // 4. Verify network and contract.
  await assertNetwork();

  console.log('\nRegistry verification: OK');

  // 5. Prepare registration calldata.
  const calldata = encodeFunctionData({
    abi: REGISTRY_ABI,
    functionName: 'register',
    args: [agentURI],
  });

  // 6. Add ERC-8021 attribution.
  const taggedData = buildTaggedCalldata(calldata);

  console.log('Attribution verification: OK');

  // 7. Resolve wallet address.
  const privateKey = process.env.WALLET_PRIVATE_KEY;

  let account;

  if (privateKey) {
    if (!/^0x[a-fA-F0-9]{64}$/.test(privateKey)) {
      throw new Error('INVALID_PRIVATE_KEY');
    }

    account = privateKeyToAccount(privateKey);
  }

  const walletAddress =
    account?.address ||
    process.env.REGISTRATION_WALLET_ADDRESS;

  if (!walletAddress || !isAddress(walletAddress)) {
    throw new Error('REGISTRATION_WALLET_ADDRESS_REQUIRED');
  }

  const owner = getAddress(walletAddress);

  // 8. Simulate registration.
  const simulation = await publicClient.call({
    account: owner,
    to: REGISTRY,
    data: taggedData,
  });

  if (!simulation.data || simulation.data === '0x') {
    throw new Error('REGISTRATION_SIMULATION_FAILED');
  }

  const predictedAgentId = decodeFunctionResult({
    abi: REGISTRY_ABI,
    functionName: 'register',
    data: simulation.data,
  });

  console.log('\nSimulation successful');
  console.log('Predicted Agent ID:', predictedAgentId.toString());

  // 9. Dry-run ends here.
  if (mode === 'dry-run') {
    console.log('\nDRY-RUN SUCCESS');
    console.log('No transaction was broadcast.');
    console.log('No registration was created.');

    return;
  }

  // 10. Require backend signing wallet.
  if (!account) {
    throw new Error('BACKEND_WALLET_REQUIRED');
  }

  if (account.address !== owner) {
    throw new Error('REGISTRATION_OWNER_MISMATCH');
  }

  // 11. Create wallet client.
  const walletClient = createWalletClient({
    account,
    chain: celo,
    transport: http(RPC_URL),
  });

  // 12. Check native gas balance.
  const nativeBalance = await publicClient.getBalance({
    address: owner,
  });

  if (nativeBalance <= 0n) {
    throw new Error('INSUFFICIENT_CELO_FOR_REGISTRATION');
  }

  // 13. Broadcast registration.
  console.log('\nBroadcasting ERC-8004 registration...');

  const hash = await walletClient.sendTransaction({
    account,
    chain: celo,
    to: REGISTRY,
    data: taggedData,
  });

  console.log('Transaction:', hash);

  // 14. Wait for receipt.
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
    timeout: TIMEOUT,
  });

  if (receipt.status !== 'success') {
    throw new Error('REGISTRATION_TRANSACTION_REVERTED');
  }

  // 15. Parse Registered event.
  const events = parseEventLogs({
    abi: REGISTRY_ABI,
    eventName: 'Registered',
    logs: receipt.logs,
    strict: false,
  });

  const registration = events.find(event =>
    event.args.owner?.toLowerCase() === owner.toLowerCase() &&
    event.args.agentURI === agentURI
  );

  if (!registration) {
    throw new Error('REGISTRATION_EVENT_NOT_FOUND');
  }

  const agentId = registration.args.agentId;

  // 16. Verify registered URI on-chain.
  const registeredURI = await publicClient.readContract({
    address: REGISTRY,
    abi: REGISTRY_ABI,
    functionName: 'tokenURI',
    args: [agentId],
  });

  if (registeredURI !== agentURI) {
    throw new Error('AGENT_URI_VERIFICATION_FAILED');
  }

  // 17. Verify ERC-8021 attribution.
  const attribution = await verifyTx({
    client: publicClient,
    hash,
  });

  if (
    !attribution ||
    !attribution.codes.includes(
      process.env.CELO_ATTRIBUTION_CODE
    )
  ) {
    throw new Error('ONCHAIN_ATTRIBUTION_VERIFICATION_FAILED');
  }

  // 18. Final confirmation.
  console.log('\n================================');
  console.log('ERC-8004 REGISTRATION CONFIRMED');
  console.log('================================');

  console.log('Agent:', agent.name);
  console.log('Agent ID:', agentId.toString());
  console.log('Owner:', owner);
  console.log('Agent URI:', registeredURI);
  console.log('Transaction:', hash);
  console.log('Block:', receipt.blockNumber.toString());
  console.log('Attribution:', attribution.codes.join(', '));

  console.log('\nCHASQUI TECH REGISTRATION SUCCESSFUL');
}

main().catch(error => {
  console.error('\nERC-8004 REGISTRATION ERROR');
  console.error(error.message);

  process.exitCode = 1;
});

