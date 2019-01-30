
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const LedgerWalletProvider = require('truffle-ledger-provider');
require('dotenv').config();
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    mainnet: {
      provider: () => {
        return new HDWalletProvider([process.env.AIRDROP_SOURCE_PRIV],"https://mainnet.infura.io/v3/4032b099853d4cddb036e5ae005b0500" )
      },
      network_id: 3,

    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider([process.env.AIRDROP_SOURCE_PRIV],"https://rinkeby.infura.io/v3/4032b099853d4cddb036e5ae005b0500" )
      },
      network_id: 3,
   }
 }
};
