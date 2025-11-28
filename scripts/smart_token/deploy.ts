import { ethers, upgrades, run } from "hardhat";
import "dotenv/config";

/**
 * https://docs.openzeppelin.com/upgrades-plugins/hardhat-upgrades
 * https://docs.openzeppelin.com/upgrades-plugins/api-hardhat-upgrades
 */
async function main() {
  const owner = process.env.CONTRACT_OWNER;
  console.log("Deploying contract start", {
    owner,
  });

  const contract = await ethers.getContractFactory("SmartToken");

  // first deploy
  const proxy = await upgrades.deployProxy(contract, [owner], {
    initializer: "initialize",
    kind: "uups",
  });
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    await proxy.getAddress(),
  );

  console.log("Proxy deployed to:", proxyAddress);
  console.log("Implementation deployed to:", implementationAddress);
  console.log(
    "Admin (ProxyAdmin) at:",
    await upgrades.erc1967.getAdminAddress(await proxy.getAddress()),
  );
  console.log(
    `View proxy on Etherscan: https://sepolia.etherscan.io/address/${proxyAddress}`,
  );
  console.log(
    `View implementation on Etherscan: https://sepolia.etherscan.io/address/${implementationAddress}`,
  );
}

main().catch((error) => {
  console.error("Deploy error-> \n", error);
  process.exitCode = 1;
});
