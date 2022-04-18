// 设置索赔条件。
import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x8De1996d6CDeF1f571A15A26799Fc7576181Ec44");

(async () => {
  try {
    //我们定义了索赔条件，这是一个对象数组，因为
    //如果我们愿意，我们可以在不同的时间开始多个阶段
    const claimConditions = [
      {
        //人们什么时候可以开始申请NFT（现在）
        startTime: new Date(),
        //可以申请的NFT的最大数量。
        maxQuantity: 50_000,
        //我们NFT的价格（免费）
        price: 0,
        //人们在一次交易中可以索赔的NFT金额
        quantityLimitPerTransaction: 1,
        //我们将事务之间的等待设置为MaxUint256，这意味着
        //人们只能申请一次。
        waitInSeconds: MaxUint256,
      },
    ];

    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
