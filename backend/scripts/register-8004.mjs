// Registra la identidad ERC-8004 del agente en Celo mainnet. Dry-run por defecto.
// Uso: npm run register   (con AGENT_URI en .env = URL pública de agent.json)
import { parseEventLogs, encodeFunctionData } from 'viem';
import { toDataSuffix } from '@celo/attribution-tags';
import { resolveMode } from '../src/guards.js';
import { validateTagCode, appendSuffix, assertTagged } from '../src/tag.js';
import { checkAgentCard } from '../src/agentcard.js';
import { FEE_CURRENCY_ADAPTER } from '../src/config.js';
import { createWallet } from '../src/wallet.js';

// Dirección y ABI según docs.celo.org/build/agents/8004
const IDENTITY_REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';
const abi = [
  { type: 'function', name: 'register', stateMutability: 'nonpayable',
    inputs: [{ name: 'agentURI', type: 'string' }], outputs: [{ name: 'agentId', type: 'uint256' }] },
  { type: 'event', name: 'Registered',
    inputs: [{ name: 'agentId', type: 'uint256', indexed: true }, { name: 'agentURI', type: 'string' },
             { name: 'owner', type: 'address', indexed: true }] },
];

const mode = resolveMode(process.env);
const uri = process.env.AGENT_URI;
if (!uri || !/^https:\/\//.test(uri)) throw new Error('AGENT_URI debe ser la URL https pública de agent.json');

const suffixHex = toDataSuffix(validateTagCode(process.env.CELO_ATTRIBUTION_TAG));
const { account, publicClient, walletClient } = await createWallet(process.env);

// 1) La agent card tiene que estar publicada y completa
const res = await fetch(uri);
if (!res.ok) throw new Error(`No se pudo abrir ${uri} (HTTP ${res.status}). Publicá public/agent.json primero.`);
const card = await res.json();
const problems = checkAgentCard(card, { wallet: account.address });
if (problems.length) throw new Error(`agent.json no está listo: ${problems.join(', ')}`);

// 2) Calldata con tag al final (obligatorio)
const data = appendSuffix(encodeFunctionData({ abi, functionName: 'register', args: [uri] }), suffixHex);
assertTagged(data, suffixHex);

// 3) Simulación: si el contrato rechazaría la llamada, falla acá y no gasta gas
await publicClient.simulateContract({ account, address: IDENTITY_REGISTRY, abi, functionName: 'register', args: [uri] });

console.log({ mode, owner: account.address, agentURI: uri, tagEnElFinal: data.slice(-24) });
if (mode !== 'live') {
  console.log('DRY-RUN: no se envió nada. Para registrar de verdad, poné AGENT_MODE=live y CONFIRM_REAL_PAYMENTS=yes-move-real-money en .env');
  process.exit(0);
}

// 4) Envío real, gas en USDC (fee abstraction)
const hash = await walletClient.sendTransaction({ to: IDENTITY_REGISTRY, data, feeCurrency: FEE_CURRENCY_ADAPTER.USDC });
console.log('Enviada:', hash);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
const [registered] = parseEventLogs({ abi, eventName: 'Registered', logs: receipt.logs });
console.log('Registrado. agentId =', registered?.args.agentId?.toString());

const tx = await publicClient.getTransaction({ hash });
const ok = tx.input.toLowerCase().endsWith(suffixHex.replace(/^0x/, '').toLowerCase());
console.log(ok ? 'TAG verificado on-chain' : 'ALERTA: el tag NO quedó en el calldata');
if (registered) console.log(`Ver: https://8004scan.io/agents/celo/${registered.args.agentId}`);
if (!ok) process.exit(1);
