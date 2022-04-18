require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

module.exports = {
  solidity: "0.8.1",
  networks: {
    rinkeby: {
      url:  process.env.YOUR_ALCHEMY_API_URL,
      accounts: [process.env.YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.YOUR_ALCHEMY_API_URL,
      accounts: [process.env.YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY],
    },
  },
  // 配置的其余部分
  etherscan: {
    //Etherscan的API密钥
    apiKey: "4FHPVY4CFEX2HQDZ7S62BX11EK8CERSSY7"
  }
};


