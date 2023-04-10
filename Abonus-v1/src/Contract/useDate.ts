import Web3 from "web3";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
declare const window: Window & { ethereum: any };

export interface UserLPdata {
  key: number;
  address: string;
  Lpdata: any;
  percentage:any;
  contract_decimals:any
}
export interface UserAddress {
  address: string;
}

export const columns = [
  {
    title: "钱包地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "LP占比",
    dataIndex: "Lpdata",
    key: "Lpdata",
  },
];
export const morenle = {
  key: "50",
  name: "50条",
};

const SunProing = (data: any) => {
  const BuserData: UserLPdata[] = [];
  const Uiser: any = [];
  const LPList: any = [];
  data.map(async (item: any, index: any) => {
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    var code = web3.eth.getCode(item.address);
    const chesw = await code.then();
    if (chesw === "0x") {
      const Proportion = Number(item.balance) / Number(item.total_supply);
      Uiser.push(item.address);
      LPList.push(Proportion);
      BuserData.push({
        key: index,
        address: item.address,
        Lpdata: Proportion,
        percentage:item.percentage,
        contract_decimals:item.contract_decimals
      });
    }
  });
  return {
    BuserData,
    Uiser,
    LPList,
  };
};



export { SunProing };
