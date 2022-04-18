import sdk from "./1-initialize-sdk.js";

//这是我们ERC-1155会员NFT合同的地址。
const editionDrop = sdk.getEditionDrop("0x8De1996d6CDeF1f571A15A26799Fc7576181Ec44");

// 这是我们ERC-20代币合同的地址。
const token = sdk.getToken("0xE7bd91DC951FF3ADeA4c09e1b0cCeFeE0aA9f8c8");

(async () => {
  try {
    //抓取我们NFT会员的所有地址，
    //其令牌ID为0。
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!"
      );
      process.exit(0);
    }

    //循环遍历地址数组。
    const airdropTargets = walletAddresses.map((address) => {
      // 在1000到10000之间随机选择一个.
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

      //设定目标。
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };

      return airdropTarget;
    });

    //给我们所有空投目标打电话。
    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log(
      "✅ Successfully airdropped tokens to all the holders of the NFT!"
    );
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();
