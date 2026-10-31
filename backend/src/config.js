// Direcciones verificadas en docs.celo.org (stablecoin-contracts, fee-abstraction)
// y en el programa de Ripio en HackerOne (misma dirección por CREATE2).
export const CHAIN_ID = 42220; // Celo mainnet
export const RPC_URL = process.env.CELO_RPC_URL ?? 'https://forno.celo.org';

export const TOKENS = Object.freeze({
  wARS: '0x0dc4f92879b7670e5f4e4e6e3c801d229129d90d',
  wBRL: '0xd76f5faf6888e24d9f04bf92a0c8b921fe4390e0',
  wMXN: '0x337e7456b420bd3481e7fa61fa9850343d610d34',
});

// feeCurrency = ADAPTADOR (no el token). USDC/USDT tienen 6 decimales.
export const FEE_CURRENCY_ADAPTER = Object.freeze({
  USDC: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
  USDT: '0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72',
});
