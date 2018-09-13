// var HDWalletProvider = require("truffle-hdwallet-provider");
const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const LedgerWalletProvider = require('truffle-ledger-provider');
// const web3 = new Web3(provider);
// const accounts = await web3.eth.getAccounts();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    // mainnet: {
    //   provider: new LedgerWalletProvider({
    //     networkId: 1, // mainnet
    //     path: "44'/60'/0'/0", // ledger default derivation path
    //     askConfirm: false,
    //     accountsLength: 1,
    //     accountsOffset: 0,
    //   }, "https://mainnet.infura.io/v3/4032b099853d4cddb036e5ae005b0500"),
    // network_id: 1,
    // gas: 21000
    // },
    rinkeby: {
      /*provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC_RINKEBY, "https://rinkeby.infura.io/v3/4032b099853d4cddb036e5ae005b0500")
      },*/
      provider: () => {
        return new HDWalletProvider(["b14e1b14c8abdca5ba1a395c3321a579aaa4a352c9dbc8a37e7c957908034b8e"],"https://rinkeby.infura.io/v3/4032b099853d4cddb036e5ae005b0500" )
      },
      network_id: 3,
      // gas: 3000000,
      // gasPrice: 21
   },
  //  ropsten1: {

  //     provider: () => {
  //       return new HDWalletProvider(["b14e1b14c8abdca5ba1a395c3321a579aaa4a352c9dbc8a37e7c957908034b8e"],"https://ropsten.infura.io/v3/4032b099853d4cddb036e5ae005b0500" )
  //     },
  //     network_id: 3,
  //     // gas: 3000000,
  //     // gasPrice: 21
  //  },

  //  ropsten: {
  //     provider: new LedgerWalletProvider({
  //         path: "44'/60'/0'/0", // ledger default derivation path
  //         askConfirm: true,
  //         accountsLength: 1,
  //         accountsOffset: 0,
  //       }, "https://ropsten.infura.io/v3/4032b099853d4cddb036e5ae005b0500"),
  //     network_id: 3,
  //     gas: 4600000
  //  }
 }
/*  ropsten: {
    host: 'https://ropsten.infura.io/v3/4032b099853d4cddb036e5ae005b0500',
    api_key: '4032b099853d4cddb036e5ae005b0500',
    api_secret: '7ef29a457d66499f9833453f3f2b1df0',
    public_key: '0xFbd33ae837F4c997E0E91F801a5b5Cee8E150C91',
    private_key: '0074569dc88a3f3769aac60566014e9b4bad46d83a4ab3bdd64a62224aaca88a'
  }*/
};
