import "dotenv/config";
import { deploy } from "../libs/deploy";

/**
 * https://docs.openzeppelin.com/upgrades-plugins/hardhat-upgrades
 * https://docs.openzeppelin.com/upgrades-plugins/api-hardhat-upgrades
 */
async function main() {
  const owner = process.env.CONTRACT_OWNER;
  const name = "SmartToken";
  const symbol = "ST001";
  const initMaxTotalSupply = 10000;

  console.log("Deploying contract start", {
    owner,
    name,
    symbol,
    initMaxTotalSupply,
  });

  await deploy("SmartToken", [owner, name, symbol, initMaxTotalSupply]);
}

main().catch((error) => {
  console.error("Deploy error-> \n", error);
  process.exitCode = 1;
});
