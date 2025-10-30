// Configuration constants
// DO NOT commit sensitive keys to git in production!
// Use environment variables on hosting platform

export const PINATA_CONFIG = {
  // For local development only - replace with env variable in production
  JWT: import.meta.env.VITE_PINATA_JWT || "",
  GATEWAY: "https://gateway.pinata.cloud/ipfs/"
};

export const SUI_CONFIG = {
  NETWORK: "testnet",
  EXPLORER_URL: "https://suiscan.xyz/testnet"
};

