require("@nomiclabs/hardhat-waffle");
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org/",
      accounts: [
        "097f260ed491219488e2ab35eb0d066d1ac33092e91fe9a2558b06c2d7cd2565",
      ],
    },
  },
  solidity: "0.8.4",
};
