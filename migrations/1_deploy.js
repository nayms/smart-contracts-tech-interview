const Token = artifacts.require("Token");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Token);
};