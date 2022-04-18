// 初始化thirdweb
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

// 导入和配置我们的。我们用来安全存储环境变量的env文件
import dotenv from "dotenv";
dotenv.config();

// 一些快速检查，以确保我们的。env正在工作。
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.log("🛑 Alchemy API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    //你的钱包是私钥。始终保持隐私，不要与任何人共享，将其添加到您的应用程序中。env文件，不要将该文件提交给github！
    process.env.PRIVATE_KEY,
    // RPC URL，我们将使用我们的。环境文件。
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("SDK initialized by address:", address)
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})();

// 我们正在导出初始化的ThirdWebSDK，以便在其他脚本中使用它
export default sdk;