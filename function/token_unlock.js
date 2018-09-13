const Web3 = require('web3');
const moment = require('moment');
const airdropInformation = require('./airdrop_information');
const GXCToken = artifacts.require("GXCToken");


module.exports = async () => {
    const { from, list, tokenAddress } = airdropInformation;
    const contract = await GXCToken.at(tokenAddress);
    try {
        const res = await contract.enableTransfer(true);
        console.log(res);
    } catch (error) {
        console.error(error);
    }
}


        