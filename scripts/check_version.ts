import { ethers, upgrades } from "hardhat";
import "dotenv/config";

async function main() {
  const proxyAddress = "0x790A773f14D9df2c70b1BEE464119690CDdC508e";
  if (!proxyAddress) {
    console.error(
      "Usage: npx hardhat run scripts/check_version.ts --network sepolia <proxyAddress> (or set PROXY_ADDRESS in .env)",
    );
    process.exit(1);
  }

  console.log("Proxy:", proxyAddress);

  // 获取实现地址（ERC1967）
  const impl = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Implementation (from ERC1967):", impl);

  // 获取合约实例并调用 version()
  const proxyToken = await ethers.getContractAt("SmartToken", proxyAddress);
  const implToken = await ethers.getContractAt("SmartToken", impl);

  try {
    const vProxy = await proxyToken.version();
    console.log("version() via proxy:", vProxy);
  } catch (e: any) {
    console.error("Call version() on proxy failed:", e.message || e);
  }

  try {
    const vImpl = await implToken.version();
    console.log("version() on implementation contract:", vImpl);
  } catch (e: any) {
    console.error("Call version() on implementation failed:", e.message || e);
  }

  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
