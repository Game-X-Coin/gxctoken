
// import GXCToken from '../build/contracts/GXCToken.json';
// import GXCToken from '../build/contracts/GXCToken.json';

const fs = require('fs');
const Web3 = require('web3');
const moment = require('moment');
const airdropInformation = require('./airdrop_information');
// const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

// const tokenAbi = JSON.parse(fs.readFileSync('./build/contracts/GXCToken.json', 'utf8')).abi;

const GXCToken = artifacts.require("GXCToken");


module.exports = async () => {
    const { from, list, tokenAddress } = airdropInformation;
    const contract = await GXCToken.at(tokenAddress);
    try {
        for(let j=0; j<list.length; j++) {
            const elem = list[j];
            console.log(elem.address, "start...");
            const amount = web3.toWei(elem.amount, 'ether'); // 1 GXC (1e18)
            const res = await contract.transfer(elem.address, amount, {from});
            for(let i =0; i<elem.locks.length; i++) {
                const lock = elem.locks[i];
                console.log(lock);
                const date = moment.parseZone(lock.date).unix();
                console.log(date);
                const res2 = await contract.addTokenLock(elem.address, web3.toWei(lock.amount, 'ether'), date, {from});
                console.log(res2);
            }
            await elem.locks.forEach(async (lock) => {
            });
        }
    } catch (error) {
        console.error(error);
    }
    // contract.transfer('0x3Bef926df471001c94eeFce9054c043ae975079B', amount, { from }, function (err, result) {
    //     console.log(err);
    //     console.log(result);
    // });
}


        



/*

tests for rinkeby

token contract: 0x49f471b086d928505fb38006b3e06a0c1b151119 
eth0: 
0x3Bef926df471001c94eeFce9054c043ae975079B
2c4160e0f853c0c8f85e07c607c52f675d5f6c0d653e5fbc47949079b16b01d7


*/