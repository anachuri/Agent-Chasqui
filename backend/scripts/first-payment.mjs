// Paso 1: mover 1 wARS con el tag ERC-8021. Dry-run por defecto.
// Uso: npm run dry-run -- 0xDESTINATARIO 1
import { readFileSync } from 'node:fs';
import { erc20Abi } from 'viem';
import { toDataSuffix } from '@celo/attribution-tags';
import { TOKENS } from '../src/config.js';
import { loadPolicy, resolveMode } from '../src/guards.js';
import { validateTagCode } from '../src/tag.js';
import { createFileStore } from '../src/store.js';
import { pay } from '../src/executor.js';
import { createWallet, buildTransferData, sendWithFeeAbstraction } from '../src/wallet.js';

const policy = loadPolicy(JSON.parse(readFileSync(new URL('../policy.json', import.meta.url), 'utf8')));
const mode = resolveMode(process.env);
const suffixHex = toDataSuffix(validateTagCode(process.env.CELO_ATTRIBUTION_TAG));
const { account, publicClient, walletClient } = await createWallet(process.env);
const token = TOKENS.wARS;

const decimals = await publicClient.readContract({ address: token, abi: erc20Abi, functionName: 'decimals' });
const balance = await publicClient.readContract({ address: token, abi: erc20Abi, functionName: 'balanceOf', args: [account.address] });
console.log({ mode, wallet: account.address, decimals, balance: balance.toString() });

const result = await pay(
  { policy, store: createFileStore('.state/spent.json'), mode, token, decimals, suffixHex,
    buildTransferData, send: sendWithFeeAbstraction(walletClient), now: () => new Date() },
  { to: process.argv[2], amount: process.argv[3] ?? '1' },
);
console.log(result);

if (result.status === 'sent') {
  await publicClient.waitForTransactionReceipt({ hash: result.hash });
  const tx = await publicClient.getTransaction({ hash: result.hash });
  const ok = tx.input.toLowerCase().endsWith(suffixHex.replace(/^0x/, '').toLowerCase());
  console.log(ok ? 'TAG verificado on-chain' : 'ALERTA: el tag NO quedó en el calldata');
  if (!ok) process.exit(1);
}
