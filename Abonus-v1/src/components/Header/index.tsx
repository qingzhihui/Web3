import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Dropdown, Menu, Space, MenuProps } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Promes from "../Promes";
import { ethers } from "ethers";
import "./index.scss";

import { Distr_ADDRESS, Distr_ABI } from "../../Contract/DistrContract";
declare const window: Window & { ethereum: any };

const ches = {
  key: "1",
  name: "LP持币数据",
};

function Header(props: any) {
  const [network, setNetwork] = useState(ches);
  const [address, setAddress] = useState("");
  const [oreTime, setoreTime] = useState({
    gontime: "",
    oreTime: 1,
  });
  const [isTimese, setisTimese] = useState(false);
  let history = useHistory();
  const Buseir: any = [
    {
      key: "1",
      label: <div className="wereiku">LP持币数据</div>,
    },
    {
      key: "2",
      label: <div className="wereiku">合约持币数据</div>,
    },
  ];
  const TimeShow = (gontime: string, oreTime: number, boolen: boolean) => {
    setoreTime({ gontime: gontime, oreTime: oreTime });
    if (boolen === true) {
      setisTimese(true);
    } else {
      setisTimese(true);
      setTimeout(() => {
        setisTimese(false);
      }, 2000);
    }
  };
  const onClick: MenuProps["onClick"] = ({ key }) => {
    Buseir.map((item: any) => {
      if (item.key === key) {
        setNetwork({
          key: key,
          name: item.label.props.children,
        });
        localStorage.setItem("Network", key);
      }
      if (key === "1") {
        history.push("/Home");
      } else {
        history.push("/Demo");
      }
    });
  };
  const menu = <Menu onClick={onClick} items={Buseir} />;
  const LoshowDe = () => {
    setAddress("");
    window.localStorage.clear();
  };
  const MetamShow = async () => {
    const provider = window.ethereum;
    const chainId = await provider.request({ method: "eth_chainId" });
    const binanceTestChainId = "0x38";
    if (chainId === binanceTestChainId) {
      Metaddr();
    } else {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: binanceTestChainId }],
        });
        console.log("You have succefully switched to Rinkeby Test network");
        Metaddr();
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x38",
                  chainName: "Binance Smart Chain",
                  nativeCurrency: {
                    name: "Binance Coin",
                    symbol: "BNB",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://bscscan.com"],
                  rpcUrls: ["https://bsc-dataseed3.binance.org"],
                },
              ],
              // params: [
              //   {
              //     chainId: "0x61",
              //     chainName: "Binance Smart Chain Testnet",
              //     nativeCurrency: {
              //       name: "Binance Test Coin",
              //       symbol: "tBNB",
              //       decimals: 18,
              //     },
              //     blockExplorerUrls: ["https://testnet.bscscan.com"],
              //     rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
              //   },
              // ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.log("Failed to switch to the network");
      }
    }
  };
  const Metaddr = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      const DistrContract = new ethers.Contract(
        Distr_ADDRESS,
        Distr_ABI,
        signer
      );
      const owner = await DistrContract.owner();
      if (addr === owner) {
        setAddress(addr);
        localStorage.setItem("Puing", addr);
      } else {
        TimeShow(`暂无访问权限.`, 3, false);
      }
    } else {
      console.log("Please install metamask.");
    }
  };
  useEffect(() => {
    const addr = localStorage.getItem("Puing");
    if (addr !== null && addr !== undefined) {
      setAddress(addr);
      if ((network as any).key === "1") {
        history.push("/Home");
      } else {
        history.push("/Demo");
      }
    }
  }, [address, oreTime, isTimese]);
  useEffect(() => {
    (window as any).ethereum.on(
      "accountsChanged",
      async function (accounts: any) {
        localStorage.setItem("Puing", accounts[0]);
        setAddress(accounts[0]);
      }
    );
  }, [address]);
  return (
    <div className="header">
      <div className="header_proin">
        <div className="header_nroe">
          <div className="header_message">
            <div className="hader_gojha">
              <div>
                <Dropdown overlay={menu}>
                  <Button onClick={(e) => e.preventDefault()}>
                    <Space>
                      <div className="slueipoi">
                        {(network as any).key === "1" ? (
                          <div className="werei">{(network as any).name}</div>
                        ) : (
                          <div className="werei">{(network as any).name}</div>
                        )}
                      </div>
                      <CaretDownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </div>
            <div className="hader_logen">
              {address !== "" ? (
                <div className="Realsibu">
                  <div className="noelue">
                    <span>
                      {address.substring(0, 4) +
                        "..." +
                        address.substring(38, 42)}
                    </span>
                  </div>
                  <div>
                    <div
                      className="bsuein"
                      onClick={() => {
                        LoshowDe();
                      }}
                    >
                      断开
                    </div>
                  </div>
                </div>
              ) : (
                <button onClick={() => MetamShow()}>连接钱包</button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isTimese ? (
        <Promes
          oreTime={(oreTime as any).oreTime}
          gontime={(oreTime as any).gontime}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Header;
