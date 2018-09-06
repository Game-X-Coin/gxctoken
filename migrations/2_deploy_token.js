const GXCToken = artifacts.require("GXCToken");

module.exports = function(deployer) {
  console.log('hihi');
  return deployer.deploy(GXCToken);
};
