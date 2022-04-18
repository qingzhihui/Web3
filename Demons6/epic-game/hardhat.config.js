require('@nomiclabs/hardhat-waffle');
require('dotenv').config();


module.exports = {
  solidity: '0.8.1',
  networks: {
    rinkeby: {
      url:  process.env.ALCHEMY_API_URL,
      accounts: [process.env.YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY],
    },
  },
};