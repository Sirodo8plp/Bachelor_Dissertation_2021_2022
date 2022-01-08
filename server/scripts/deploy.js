async function main() {
  const NFTminter = await ethers.getContractFactory("NFTminter");
  console.log("Deploying NFTminter...");
  const minter = await NFTminter.deploy();
  await minter.deployed();
  console.log("NFTminter deployed to:", minter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
