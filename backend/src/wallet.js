import { createPublicClient, createWalletClient, http, encodeFunctionData, erc20Abi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celo } from 'viem/chains';
import { CHAIN_ID, RPC_URL, FEE_CURRENCY_ADAPTER } from './config.js';

export async function createWallet(env) {
  const account = privateKeyToAccount(env.AGENT_PRIVATE_KEY);
  const transport = http(RPC_URL);
  const publicClient = createPublicClient({ chain: celo, transport });
  const walletClient = createWalletClient({ account, chain: celo, transport });
  if ((await publicClient.getChainId()) !== CHAIN_ID) throw new Error('WRONG_CHAIN: solo Celo mainnet (42220)');
  return { account, publicClient, walletClient };
}

export const buildTransferData = (to, units) =>
  encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [to, units] });

// Gas en USDC vía fee abstraction (CIP-64): feeCurrency = adaptador.
export const sendWithFeeAbstraction = (walletClient) => ({ to, data }) =>
  walletClient.sendTransaction({ to, data, feeCurrency: FEE_CURRENCY_ADAPTER.USDC });
