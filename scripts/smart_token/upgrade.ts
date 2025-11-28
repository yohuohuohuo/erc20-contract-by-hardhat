import { ethers, upgrades, run } from "hardhat";
import "dotenv/config";

/**
 * https://docs.openzeppelin.com/upgrades-plugins/hardhat-upgrades
 * https://docs.openzeppelin.com/upgrades-plugins/api-hardhat-upgrades
 */
async function main(proxyAddress: string) {
  if (!proxyAddress) {
    console.error("Please pass PROXYADDRESS as parameters");
    process.exit(1);
  }
  console.log("Upgrade contract start");

  const contract = await ethers.getContractFactory("SmartToken");

  const proxy = await upgrades.upgradeProxy(proxyAddress, contract);
  await proxy.waitForDeployment();

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

const proxyAddress = "0x790A773f14D9df2c70b1BEE464119690CDdC508e";
main(proxyAddress).catch((error) => {
  console.error("Deploy error-> \n", error);
  process.exitCode = 1;
});
