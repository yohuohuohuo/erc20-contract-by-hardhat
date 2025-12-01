import "dotenv/config";
import { upgrades } from "hardhat";
import { deploy } from "../libs/deploy";

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

  await deploy("SmartTokenFactory", [smartTokenImplementationAddress]);
}

const smartTokenProxyAddress = "0x71768bB41b33c4558B3Ac0659D2B669ACe830d88";
main(smartTokenProxyAddress).catch((error) => {
  console.error("Deploy error-> \n", error);
  process.exitCode = 1;
});
