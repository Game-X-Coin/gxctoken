const GXCToken = artifacts.require("GXCToken");

module.exports = function(deployer) {
  return deployer.deploy(GXCToken);
};
