import { ethers, upgrades, run } from "hardhat";
import "dotenv/config";

/**
 * https://docs.openzeppelin.com/upgrades-plugins/hardhat-upgrades
 * https://docs.openzeppelin.com/upgrades-plugins/api-hardhat-upgrades
 */
async function main(smartTokenProxyAddress: string) {
  // 获取其 implementation 地址（logic contract）
  const smartTokenImplementationAddress =
    await upgrades.erc1967.getImplementationAddress(smartTokenProxyAddress);

  console.log("Deploying contract start", {
    smartTokenProxyAddress,
    smartTokenImplementationAddress,
  });

  const contract = await ethers.getContractFactory("SmartTokenFactory");

  // first deploy
  const proxy = await upgrades.deployProxy(
    contract,
    [smartTokenImplementationAddress],
    {
      initializer: "initialize",
      kind: "uups",
    },
  );
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

const smartTokenProxyAddress = "0x790A773f14D9df2c70b1BEE464119690CDdC508e";
main(smartTokenProxyAddress).catch((error) => {
  console.error("Deploy error-> \n", error);
  process.exitCode = 1;
});
