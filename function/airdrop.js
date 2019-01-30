const fs = require('fs');
const Web3 = require('web3');
const moment = require('moment');
const GXCToken = artifacts.require("GXCToken");


module.exports = async () => {
  try {
    console.log('airdrop Start...');
    const tokenAddress = process.env.GXC_TOKEN_CONTRACT;
    const from = process.env.AIRDROP_SOURCE_PUB.toLowerCase();
    const airdropStartId = parseInt(process.env.AIRDROP_START_ID);
    if(!airdropStartId) throw('fromNo is not defined');

    const contract = await GXCToken.at(tokenAddress);

    let airdropResult = [];
    let airdropList = fs.readFileSync('./data/airdrop_list.csv', 'utf8');
    airdropList = airdropList.split('\n');
    let results = [];

    let startFlag = false;
    for(let i=0; i<airdropList.length; i++) {
      const elem = airdropList[i];
      let transactionResult = {};
      const [ id, address, gxcCount ] = elem.split(',').map(e => e.trim());
      if(parseInt(id) === airdropStartId) startFlag = true;
      if(!startFlag) continue;
      
      try {
        console.log(id +" : " + address + "start..." );
        const amount = web3.toWei(gxcCount, 'ether'); // 1 GXC (1e18)
        const res = await contract.transfer(address, amount, 
          {from, gas: 4600000, gasPrice: web3.toWei(process.env.AIRDROP_GAS_PRICE, "gwei")});
        console.log(address, "end...");
        transactionResult = [address, gxcCount, 'success', res.tx, '', new Date().toISOString().slice(0,19)];
        console.log(transactionResult);
        airdropResult.push([address, gxcCount, res.tx]);
      } catch (error) {
        console.error(error);
        transactionResult = [address, gxcCount, 'fail', '', error.message, new Date().toISOString().slice(0,19)];
      }
      fs.appendFileSync('./data/airdrop_result2.csv', transactionResult.join(',') + '\n');
      if(parseInt(process.env.AIRDROP_END_ID) === parseInt(id)) {
        console.log('Reach end of airdrop id: ' + process.env.AIRDROP_END_ID);
        break;
      }

    }
    console.log('complete..');
      // fs.writeFileSync('./airdrop_result.csv', airdropResult.join('\n'));
  } catch (error) {
      console.error(error);
  }
}


        



/*

tests for rinkeby

token contract: 0x49f471b086d928505fb38006b3e06a0c1b151119 
eth0: 
0x3Bef926df471001c94eeFce9054c043ae975079B
2c4160e0f853c0c8f85e07c607c52f675d5f6c0d653e5fbc47949079b16b01d7


*/
