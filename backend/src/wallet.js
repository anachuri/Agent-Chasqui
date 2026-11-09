
import {
  createPublicClient,
  createWalletClient,
  http,
  erc20Abi,
  parseUnits,
  formatUnits,
  getAddress,
} from 'viem';

import { privateKeyToAccount } from 'viem/accounts';
import { celo } from 'viem/chains';

import {
  CHAIN_ID,
  RPC_URL,
  TOKENS,
  FEE_CURRENCY_ADAPTER,
} from './config.js';

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const ALLOWED_TOKENS = ['wARS', 'wBRL', 'wMXN'];

const FEE_TOKENS = {
  USDC: {
    address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
    adapter: FEE_CURRENCY_ADAPTER.USDC,
    decimals: 6,
  },
  USDT: {
    address: '0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e',
    adapter: FEE_CURRENCY_ADAPTER.USDT,
    decimals: 6,
  },
};

const TIMEOUT = 120_000;

let publicClient;
let walletClient;
let account;

// --------------------------------------------------
// PUBLIC CLIENT
// --------------------------------------------------

function getPublicClient() {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: celo,
      transport: http(RPC_URL),
    });
  }

  return publicClient;
}

// --------------------------------------------------
// NETWORK VALIDATION
// --------------------------------------------------

export async function assertCeloNetwork() {
  const client = getPublicClient();

  const chainId = await client.getChainId();

  if (chainId !== CHAIN_ID) {
    throw new Error('WRONG_NETWORK');
  }

  return true;
}

// --------------------------------------------------
// WALLET INITIALIZATION
// --------------------------------------------------

export async function getWallet() {
  if (!walletClient) {
    const privateKey = process.env.WALLET_PRIVATE_KEY;

    if (
      !privateKey ||
      !/^0x[a-fA-F0-9]{64}$/.test(privateKey)
    ) {
      throw new Error('WALLET_PRIVATE_KEY_INVALID');
    }

    account = privateKeyToAccount(privateKey);

    walletClient = createWalletClient({
      account,
      chain: celo,
      transport: http(RPC_URL),
    });
  }

  await assertCeloNetwork();

  return walletClient;
}

export async function getWalletAddress() {
  await getWallet();
  return account.address;
}

// --------------------------------------------------
// TOKEN VALIDATION
// --------------------------------------------------

function getTokenAddress(token) {
  if (!ALLOWED_TOKENS.includes(token)) {
    throw new Error('UNSUPPORTED_TOKEN');
  }

  const address = TOKENS[token];

  if (!address) {
    throw new Error('TOKEN_ADDRESS_NOT_CONFIGURED');
  }

  return getAddress(address);
}

// --------------------------------------------------
// TOKEN INFORMATION
// --------------------------------------------------

async function getTokenDecimals(tokenAddress) {
  return getPublicClient().readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
  });
}

// --------------------------------------------------
// TOKEN BALANCE
// --------------------------------------------------

export async function getTokenBalance(token, owner) {
  await assertCeloNetwork();

  const tokenAddress = getTokenAddress(token);
  const walletAddress = owner
    ? getAddress(owner)
    : await getWalletAddress();

  const client = getPublicClient();

  const [balance, decimals] = await Promise.all([
    client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [walletAddress],
    }),

    getTokenDecimals(tokenAddress),
  ]);

  return formatUnits(balance, decimals);
}

// --------------------------------------------------
// FEE ABSTRACTION
// --------------------------------------------------

function getFeeCurrency() {
  const selected = process.env.FEE_CURRENCY;

  if (!selected) {
    return undefined;
  }

  const fee = FEE_TOKENS[selected];

  if (!fee) {
    throw new Error('UNSUPPORTED_FEE_CURRENCY');
  }

  return fee;
}

export async function getFeeBalance() {
  const fee = getFeeCurrency();

  if (!fee) {
    const balance = await getPublicClient().getBalance({
      address: await getWalletAddress(),
    });

    return {
      currency: 'CELO',
      balance: formatUnits(balance, 18),
    };
  }

  const balance = await getPublicClient().readContract({
    address: getAddress(fee.address),
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [await getWalletAddress()],
  });

  return {
    currency: process.env.FEE_CURRENCY,
    balance: formatUnits(balance, fee.decimals),
  };
}

// --------------------------------------------------
// SEND TOKEN
// --------------------------------------------------

export async function sendToken({
  wallet,
  to,
  token,
  amount,
}) {
  // Fail closed: no real transfers unless explicitly enabled.
  if (process.env.CHASQUI_ENABLE_LIVE !== 'true') {
    throw new Error('LIVE_EXECUTION_DISABLED');
  }

  await assertCeloNetwork();

  if (!wallet || !account) {
    throw new Error('WALLET_NOT_INITIALIZED');
  }

  const destination = getAddress(to);
  const tokenAddress = getTokenAddress(token);

  if (destination === account.address) {
    throw new Error('SELF_TRANSFER_NOT_ALLOWED');
  }

  const numericAmount = String(amount);

  if (
    !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(numericAmount) ||
    Number(numericAmount) <= 0
  ) {
    throw new Error('INVALID_AMOUNT');
  }

  const client = getPublicClient();
  const decimals = await getTokenDecimals(tokenAddress);

  const value = parseUnits(numericAmount, decimals);

  // Check asset balance.
  const balance = await client.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account.address],
  });

  if (balance < value) {
    throw new Error('INSUFFICIENT_TOKEN_BALANCE');
  }

  // Check fee currency balance.
  const fee = getFeeCurrency();

  if (fee) {
    const feeBalance = await client.readContract({
      address: getAddress(fee.address),
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account.address],
    });

    if (feeBalance <= 0n) {
      throw new Error('INSUFFICIENT_FEE_TOKEN_BALANCE');
    }
  } else {
    const nativeBalance = await client.getBalance({
      address: account.address,
    });

    if (nativeBalance <= 0n) {
      throw new Error('INSUFFICIENT_CELO_FOR_GAS');
    }
  }

  // Simulate before broadcasting.
  const request = await client.simulateContract({
    account,
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [destination, value],
    ...(fee ? { feeCurrency: fee.adapter } : {}),
  });

  // Broadcast transaction.
  const hash = await wallet.writeContract(request.request);

  return {
    hash,
    from: account.address,
    to: destination,
    token,
    amount: numericAmount,
    chainId: CHAIN_ID,
  };
}

// --------------------------------------------------
// TRANSACTION RECEIPT
// --------------------------------------------------

export async function getTransactionReceipt(hash) {
  if (
    typeof hash !== 'string' ||
    !/^0x[a-fA-F0-9]{64}$/.test(hash)
  ) {
    throw new Error('INVALID_TRANSACTION_HASH');
  }

  await assertCeloNetwork();

  try {
    const receipt = await getPublicClient()
      .waitForTransactionReceipt({
        hash,
        timeout: TIMEOUT,
      });

    return receipt;
  } catch (error) {
    if (error.name === 'WaitForTransactionReceiptTimeoutError') {
      return null;
    }

    throw error;
  }
}

