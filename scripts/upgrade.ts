import "dotenv/config";
import { ethers, upgrades } from "hardhat";

async function waitForImplementationUpdate(
  proxyAddress: string,
  preImplementationAddress: string,
) {
  let newImpl = null;

  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 等 1.5s

    const impl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log(
      "wait for implementationUpdate",
      i,
      `new -> ${impl}`,
      `old -> ${preImplementationAddress}`,
    );

    if (impl !== null && impl !== preImplementationAddress) {
      newImpl = impl;
      break;
    }
  }

  return newImpl;
}

/**
 * https://docs.openzeppelin.com/upgrades-plugins/hardhat-upgrades
 * https://docs.openzeppelin.com/upgrades-plugins/api-hardhat-upgrades
 */
async function main(proxyAddress: string, contractName: string) {
  if (!proxyAddress) {
    console.error("Please pass PROXYADDRESS as parameters");
    process.exit(1);
  }
  console.log("Upgrade contract start");

  const preImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("previous implementation address", preImplementationAddress);

  const contract = await ethers.getContractFactory(contractName);

  const proxy = await upgrades.upgradeProxy(proxyAddress, contract);
  await proxy.waitForDeployment();

  // const implementationAddress = await upgrades.erc1967.getImplementationAddress(
  //   await proxy.getAddress(),
  // );

  const newProxyAddress = await proxy.getAddress();
  console.log("---->", {
    proxyAddress,
    newProxyAddress,
  });

  const implementationAddress = await waitForImplementationUpdate(
    proxyAddress,
    preImplementationAddress,
  );

  console.log("Proxy deployed to:", proxyAddress);
  console.log("Implementation deployed to:", implementationAddress);
  console.log(
    "Admin (ProxyAdmin) at:",
    await upgrades.erc1967.getAdminAddress(newProxyAddress),
  );
  console.log(
    `View proxy on Etherscan: https://sepolia.etherscan.io/address/${proxyAddress}`,
  );
  console.log(
    `View implementation on Etherscan: https://sepolia.etherscan.io/address/${implementationAddress}`,
  );
}

// const proxyAddress = "0x71768bB41b33c4558B3Ac0659D2B669ACe830d88";
// const contractName = "SmartToken";

const proxyAddress = "0x40EbEB8109EaDD14E92086169aAAFE1C0279eA63";
const contractName = "SmartTokenFactory";

main(proxyAddress, contractName).catch((error) => {
  console.error("Deploy error-> \n", error);
  process.exitCode = 1;
});
