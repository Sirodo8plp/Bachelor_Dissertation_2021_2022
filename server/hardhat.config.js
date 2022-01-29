require("@nomiclabs/hardhat-waffle");
const { PRIVATE_KEY, ALCHEMY_HTTP } = require("./alchemy_secrets.json");
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  networks: {
    ropsten: {
      url: ALCHEMY_HTTP,
      accounts: [PRIVATE_KEY]
    },
  },
  solidity: "0.8.4",
};
