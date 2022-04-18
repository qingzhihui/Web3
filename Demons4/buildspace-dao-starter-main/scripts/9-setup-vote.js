// 设置您的金库。
import sdk from "./1-initialize-sdk.js";

// 这是我们的治理合同。
const vote = sdk.getVote("0x399971D68471B6A8aA4c3670b6695e4d07CA2CD1");

// 这是我们的ERC-20合同。
const token = sdk.getToken("0xE7bd91DC951FF3ADeA4c09e1b0cCeFeE0aA9f8c8");

(async () => {
  try {
    // 如果需要，让我们的财政部有权铸造额外的代币。
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    );
    process.exit(1);
  }

  try {
    // 抓住我们钱包的代币余额，记住——我们现在基本上掌握了全部供应！
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    // 抢占我们90%的供应。
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    // 将90%的供应转移到我们的投票合同中。
    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
  } catch (err) {
    console.error("failed to transfer tokens to vote contract", err);
  }
})();