import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xE7bd91DC951FF3ADeA4c09e1b0cCeFeE0aA9f8c8");

(async () => {
  try {
    // 记录当前角色
    const allRoles = await token.roles.getAll();

    console.log("👀 Roles that exist right now:", allRoles);

    // 撤销你钱包在ERC-20合同上拥有的所有超能力。
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Roles after revoking ourselves",
      await token.roles.getAll()
    );
    console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");

  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO trasury", error);
  }
})();