const Dragon = artifacts.require("Dragon");

module.exports = function(deployer) {
  deployer.deploy(Dragon);
};
