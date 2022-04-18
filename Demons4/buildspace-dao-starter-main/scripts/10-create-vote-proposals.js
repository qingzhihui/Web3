import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// 这是我们的治理合同.
const vote = sdk.getVote("0x399971D68471B6A8aA4c3670b6695e4d07CA2CD1");

//这是我们的ERC-20合同。
const token = sdk.getToken("0xE7bd91DC951FF3ADeA4c09e1b0cCeFeE0aA9f8c8");

(async () => {
  try {
    // 创建提案，向财政部铸造42万枚新代币。
    const amount = 420_000;
    const description =
      "Should the DAO mint an additional " +
      amount +
      " tokens into the treasury?";
    const executions = [
      {
        // 我们的代币合同实际执行铸币厂。
        toAddress: token.getAddress(),
        //我们的家乡是埃斯。nativeTokenValue是我们想要的ETH数量
        //发送此提案。在这种情况下，我们将发送0 ETH。
        //我们只是在为国库铸造新的代币。所以，设置为0。
        nativeTokenValue: 0,
        //我们在做薄荷糖！而且，我们正在投票，这是
        //充当我们的财政部。
        //在这种情况下，我们需要使用以太。js转换金额
        //以正确的格式。这是因为它所需要的数量是以魏为单位的。
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    //创建提案，将6900个代币转让给自己，以表彰自己的卓越。
    const amount = 6_900;
    const description =
      "Should the DAO transfer " +
      amount +
      " tokens from the treasury to " +
      process.env.WALLET_ADDRESS +
      " for being awesome?";
    const executions = [
      {
        // 再一次，我们给自己发送了0个ETH。只是发送我们自己的令牌。
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // 我们要从财政部转移到钱包里。
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
