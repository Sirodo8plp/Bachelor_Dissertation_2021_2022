const NFTMinter = artifacts.require("./NFTminter.sol");

module.exports = function (deployer) {
  deployer.deploy(NFTMinter);
};
