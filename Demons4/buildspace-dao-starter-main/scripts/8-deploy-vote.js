// 部署治理合约（ 建库+治理）
import sdk from "./1-initialize-sdk.js";
(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // /给你的治理合同起个名字。
      name: "My amazing DAO",

      // 这是我们的治理令牌，我们的ERC-20合同的位置！
      voting_token_address: "0xE7bd91DC951FF3ADeA4c09e1b0cCeFeE0aA9f8c8",

      //这些参数以块的数量指定。
      //假设阻塞时间约为13.14秒（对于以太坊）
      //提案提出后，成员何时可以开始投票？
      //目前，我们将其设置为立即。
      voting_delay_in_blocks: 0,

      //提案创建时，成员需要投票多长时间？
      //我们将其设置为1天=6570个街区ks
      voting_period_in_blocks: 6570,

      //需要投票支持的总供应量的最低百分比
      //在提案期限结束后，提案有效。
      voting_quorum_fraction: 0,

      //用户创建提案所需的最小令牌数是多少？
      //我将其设置为0。这意味着不需要任何令牌就可以允许用户访问
      //创建一个提议。
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Successfully deployed vote contract, address:",
      voteContractAddress
    );
  } catch (err) {
    console.error("Failed to deploy vote contract", err);
  }
})();
