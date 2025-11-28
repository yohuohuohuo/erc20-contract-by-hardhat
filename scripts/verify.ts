import "dotenv/config";
import { run } from "hardhat";

/**
 * 手动验证合约脚本
 * 使用方法: npx hardhat run scripts/verify.ts --network sepolia
 * 需要在命令行传入地址或在这里硬编码
 */
async function main(proxyAddress: string, implementationAddress: string) {
  // 从环境变量或直接指定代理和实现地址

  if (!proxyAddress || !implementationAddress) {
    console.error(
      "Please pass PROXY_ADDRESS and IMPLEMENTATIONADDRESS as parameters",
    );
    process.exit(1);
  }

  console.log("Starting verification...");
  console.log("Proxy Address:", proxyAddress);
  console.log("Implementation Address:", implementationAddress);

  // 验证实现合约
  console.log("\n1. Verifying implementation contract...");
  try {
    await run("verify:verify", {
      address: implementationAddress,
      constructorArguments: [],
    });
    console.log("✓ Implementation verified successfully!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✓ Implementation already verified!");
    } else {
      console.error("✗ Implementation verification failed:", error.message);
    }
  }

  // 验证代理合约并关联实现合约
  console.log("\n2. Verifying proxy contract...");
  try {
    await run("verify:verify", {
      address: proxyAddress,
      constructorArguments: [],
      // 关键：告诉 Etherscan 这是一个代理，并指向实现合约
      implementation: implementationAddress,
    });
    console.log("✓ Proxy verified successfully!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✓ Proxy already verified!");
      console.log(
        "⚠ Proxy already verified but may need manual linking on Etherscan.",
      );
      console.log(
        "Please visit: https://sepolia.etherscan.io/proxyContractChecker?a=" +
          proxyAddress,
      );
      console.log(
        "And manually verify the proxy or use the 'Is this a proxy?' feature.",
      );
    } else {
      console.error("✗ Proxy verification failed:", error.message);
      console.log("\nManual verification steps:");
      console.log(
        "1. Go to: https://sepolia.etherscan.io/address/" + proxyAddress,
      );
      console.log("2. Click 'More' → 'Is this a proxy?'");
      console.log(
        "3. Select UUPS proxy and enter implementation: " +
          implementationAddress,
      );
    }
  }

  console.log("\n✓ Verification process completed!");
  console.log(
    `View proxy on Etherscan: https://sepolia.etherscan.io/address/${proxyAddress}`,
  );
  console.log(
    `View implementation on Etherscan: https://sepolia.etherscan.io/address/${implementationAddress}`,
  );
}

const proxyAddress = "0x790A773f14D9df2c70b1BEE464119690CDdC508e";
const implementationAddress = "0x504A274C5665b22cEe00C78276B20167F4BDf0eB";
main(proxyAddress, implementationAddress).catch((error) => {
  console.error("Verification error:", error);
  process.exitCode = 1;
});
