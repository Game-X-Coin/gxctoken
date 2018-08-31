module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  development: {
    host: 'localhost',
    port: 7545,
    // from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    network_id: '*', // eslint-disable-line camelcase
    gasLimit: 0xfffffffffff,
    gasPrice: 0x01,
  }
};
