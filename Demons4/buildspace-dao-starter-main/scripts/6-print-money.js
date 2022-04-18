import sdk from "./1-initialize-sdk.js";

//这是我们之前打印的ERC-20合同的地址.
const token = sdk.getToken("0xE7bd91DC951FF3ADeA4c09e1b0cCeFeE0aA9f8c8");

(async () => {
  try {
    // 你想设定的最大供应量是多少？1000000是个不错的数字！
    const amount = 1000000;
    // 与部署的ERC-20合同互动，并铸造代币！
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    // P打印出我们现在有多少代币！
    console.log("✅ There now is", totalSupply.displayValue, "$HOKAGE in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();