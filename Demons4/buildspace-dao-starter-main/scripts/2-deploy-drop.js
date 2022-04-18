// 为 Rinkeby 创建 + 部署 ERC-1155 合约
import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // 藏品的名字，比如加密朋克
      name: "NarutoDAO Membership",
      // 对该系列的描述。
      description: "A DAO for fans of Naruto.",
      // 我们的NFT上将保留的图像！有趣的部分：）。
      image: readFileSync("scripts/assets/naruto.png"),
      //我们需要在合同中输入接收NFT销售收入的人的地址。
      //我们计划不向投递者收费，所以我们将传入0x0地址
      //如果你想收费，你可以将其设置为自己的钱包地址。
      primary_sale_recipient: AddressZero,
    });

    //这个初始化返回我们合同的地址
    //我们使用它来初始化ThirdWebSDK上的合同
    const editionDrop = sdk.getEditionDrop(editionDropAddress);

    // 有了这个，我们可以得到我们合同的元数据
    const metadata = await editionDrop.metadata.get();

    console.log(
      "✅ Successfully deployed editionDrop contract, address:",
      editionDropAddress
    );
    console.log("✅ editionDrop metadata:", metadata);
  } catch (error) {
    console.log("failed to deploy editionDrop contract", error);
  }
})();
