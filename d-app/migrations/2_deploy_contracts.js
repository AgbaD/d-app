const Token = artifacts.require("Token");
const BelSwap = artifacts.require("BelSwap");

module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed();

  // Deploy Exchange
  await deployer.deploy(BelSwap, token.address);
  const belSwap = await BelSwap.deployed();

  // Transfer all tokens to BelSwap
  await token.transfer(belSwap.address, '1000000000000000000000000');
};
