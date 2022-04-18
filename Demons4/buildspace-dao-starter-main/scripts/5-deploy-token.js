// 创建和部署我们的代币智能合约！
import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // 部署标准ERC-20合同。
    const tokenAddress = await sdk.deployer.deployToken({
      // 你的代币叫什么名字？例如“以太坊”
      name: "NarutoDAO Governance Token",
      // 你的代币的符号是什么？例如“ETH”
      symbol: "HOKAGE",
      //以防我们想卖掉代币，
      //因为我们没有，我们再次将其设置为AddressZero。
      primary_sale_recipient: AddressZero,
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenAddress
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
