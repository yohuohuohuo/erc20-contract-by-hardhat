import "dotenv/config";
import { ethers, upgrades } from "hardhat";

/**
 * https://docs.openzeppelin.com/upgrades-plugins/hardhat-upgrades
 * https://docs.openzeppelin.com/upgrades-plugins/api-hardhat-upgrades
 */
export async function deploy(contractName: string, args?: unknown[]) {
  const contract = await ethers.getContractFactory(contractName);

  // first deploy
  const proxy = await upgrades.deployProxy(contract, args, {
    initializer: "initialize",
    kind: "uups",
  });
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  const implementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);
  const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);

  console.log("Proxy deployed to:", proxyAddress);
  console.log("Implementation deployed to:", implementationAddress);
  console.log("Admin (ProxyAdmin) at:", adminAddress);
  console.log(
    `View proxy on Etherscan: https://sepolia.etherscan.io/address/${proxyAddress}`,
  );
  console.log(
    `View implementation on Etherscan: https://sepolia.etherscan.io/address/${implementationAddress}`,
  );

  return {
    proxyAddress,
    implementationAddress,
    adminAddress,
  };
}
