require('./utils/dotEnv');
// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      protocol: process.env.DEV_ETHEREUM_PROTOCOL || 'http',
      host: process.env.DEV_ETHEREUM_HOST || '127.0.0.1',
      port: process.env.DEV_ETHEREUM_PORT || '7745',
      gas: process.env.DEV_GAS || '6000000',
      gasPrice: process.env.DEV_GAS_PRICE || '5e9',
      networkId: process.env.DEV_NETWORK_ID || '5778',
      websockets: true,
    },
  },
};
