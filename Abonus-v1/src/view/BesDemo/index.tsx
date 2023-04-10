import React, { useEffect, useState } from "react";
import "./index.scss";
import {
  message,
  Table,
  Menu,
  MenuProps,
  Dropdown,
  Button,
  Space,
  Switch,
} from "antd";
import copy from "copy-to-clipboard";
import { PuinDate } from "../../Contract/config";
import { Distr_ADDRESS, Distr_ABI } from "../../Contract/DistrContract";
import { wben_ABI } from "../../Contract/wbenjson";
import { CaretDownOutlined, ExclamationOutlined } from "@ant-design/icons";
import Promes from "../../components/Promes";
import { ethers } from "ethers";
import axios from "axios";
import {
  UserLPdata,
  SunProing,
  morenle,
  columns,
} from "../../Contract/useDate";
import BigNumber from "bignumber.js";

declare const window: Window & { ethereum: any };
const chlid = 56;

function Home(props: any) {
  const [listnu, setListnu] = useState<UserLPdata[]>([]);
  const [nusier, setNusier] = useState(0);
  const [address, setAddress] = useState("");
  const [usLst, setuslst] = useState([]);
  const [LPdata, setLPdata] = useState([]);
  const [input, setInput] = useState("");
  const [appser, setAppser] = useState(true);
  const [lpinput, setLpinput] = useState("");
  const [oreTime, setoreTime] = useState({
    gontime: "",
    oreTime: 1,
  });

  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(morenle);
  const [isTimese, setisTimese] = useState(false);
  const [daibinput, setDaibinput] = useState("");
  const [tingung, setTingung] = useState("");
  const [suoerData, setsuoerData] = useState([]);
  const [pieces, setPieces] = useState("");
  const [SleState, setSleState] = useState(false);
  const [toKenShow, setToKenShow] = useState(false);
  const [yuing, setYuing] = useState("");

  // 筛选
  const [shaixun, setShaixun] = useState("");
  const onClick: MenuProps["onClick"] = ({ key }) => {
    PuinDate.map((item: any) => {
      if (item.key === key) {
        setNetwork({
          key: key,
          name: item.label.props.children,
        });
      }
    });

    if (lpinput === "") {
      TimeShow(`请输入要查询的代币地址.`, 3, false);
    } else {
      if (key === "Max") {
        LPonClick(lpinput, 100000, chlid);
      } else {
        LPonClick(lpinput, Number(key), chlid);
      }
    }
  };
  const filterHasSameArr = (arr1: any, arr2: any) => {
    return arr1.filter((item: any) => {
      if (arr2.indexOf(item) < 0) {
        return item;
      }
    });
  };
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
  const menu = <Menu onClick={onClick} items={PuinDate} />;
  const InputonClick = async () => {
    if (daibinput === "") {
      TimeShow(`请输入分发的代币地址.`, 3, false);
    } else if (input === "") {
      TimeShow(`请输入分发的代币数量.`, 3, false);
    } else if (pieces === "") {
      TimeShow(`请输入分发的代币条数.`, 3, false);
    } else {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const DistrContract = new ethers.Contract(
          Distr_ADDRESS,
          Distr_ABI,
          signer
        );
        const PuniUser: any = [];
        const PunNumer: any = [];
        var chse = 0;
        const piecesData = listnu.slice(0, Number(pieces));
        piecesData.map((item: any) => {
          const pruoubg = Number(item.percentage) * Number(input);
          const value = new BigNumber(pruoubg).times(
            new BigNumber(10).pow(item.contract_decimals)
          );
          const peybug = Math.floor(Number(value.toString()));
          PuniUser.push(item.address);
          PunNumer.push(String(peybug));
          chse += peybug;
        });
        setTimeout(async () => {
          const transferProToken = await DistrContract.transferProToken(
            daibinput,
            PuniUser,
            PunNumer
          );
          const proShowData = filterHasSameArr(listnu, piecesData);
          TimeShow(`分发中...`, 1, true);
          await transferProToken.wait();
          await axios({
            url: "https://fenhong-loading.dapp1.finance/backend/record_wallet",
            method: "POST",
            data: {
              wallet_address: PuniUser,
              token: daibinput,
            },
          });
          setListnu(proShowData);
          setNusier(proShowData.length);
          TimeShow(`分发成功`, 2, false);
          setPieces("");
          setInput("");
        }, 300);
      } catch (error) {
        TimeShow(`分发失败没有权限.`, 3, false);
      }
    }
  };
  const appserClick = async () => {
    if (daibinput === "") {
      TimeShow(`请输入授权的代币地址`, 3, false);
    } else {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const PAIRContract = new ethers.Contract(daibinput, wben_ABI, signer);
        const approve = await PAIRContract.approve(
          Distr_ADDRESS,
          ethers.constants.MaxUint256
        );
        TimeShow(`授权中...`, 1, true);
        await approve.wait();
        setAppser(false);
        TimeShow(`授权成功`, 2, false);
      } catch (error) {
        TimeShow(`授权失败.`, 3, false);
      }
    }
  };
  const success = (luser: any) => {
    message.success(luser, 2);
  };
  const skUerNuer = () => {
    if (copy(String(usLst))) {
      success("复制成功");
    } else {
      success("复制失败");
    }
  };
  const skUerLPdata = () => {
    if (copy(String(LPdata))) {
      success("复制成功");
    } else {
      success("复制失败");
    }
  };
  const LPonClick = async (url: any, bars: any, chaid: any) => {
    setLoading(true);
    var NUmer = 0;
    if (SleState === true) {
      NUmer = 1;
    }
    await axios
      .get(
        `https://fenhong-loading.dapp1.finance/backend/get_items?chain_id=${chaid}&contrat=${url}&amount=${bars}&standard=${0}&is_filter=${NUmer}`
      )
      .then((res) => {
        const CleaderData = SunProing(res.data.data);
        setTimeout(() => {
          setListnu(CleaderData.BuserData);
          setuslst(CleaderData.Uiser);
          setLPdata(CleaderData.LPList);
          setNusier(CleaderData.BuserData.length);
          setLoading(false);
          setsuoerData(res.data.data);
        }, 1000);
      })
      .catch((error) => {
        TimeShow(`查询失败`, 3, false);
        setLoading(false);
      });
  };
  const setShaixunClick = async (shaixun: any) => {
    await axios
      .get(
        `https://fenhong-loading.dapp1.finance/backend//get_items?chain_id=${chlid}&contrat=${lpinput}&amount=${100000}&standard=${shaixun}`
      )
      .then((res) => {
        const data: any = [];
        res.data.data.map(async (item: any, index: any) => {
          data.push({
            key: index,
            address: item.address,
            Lpdata: item.percentage,
            percentage: item.percentage,
            contract_decimals: item.contract_decimals,
          });
        });
        setTimeout(() => {
          setListnu(data);
          setNusier(data.length);
        }, 500);
      });
  };
  const setAddreunser = async () => {
    setLoading(true);
    await axios({
      url: "https://fenhong-loading.dapp1.finance/backend/add_item",
      method: "POST",
      data: {
        chain_id: 97,
        wallet_address: tingung,
        contract_address: "0xe60a39a1d724817feafa9bc614eeb378a95f7a91",
        data_list: suoerData,
      },
    }).then((res) => {
      const data: any = [];
      res.data.data.map(async (item: any, index: any) => {
        data.push({
          key: index,
          address: item.address,
          Lpdata: item.percentage,
        });
      });
      setTimeout(() => {
        setListnu(data);
        setNusier(data.length);
        setLoading(false);
      }, 1000);
    });
  };
  const setDeletereunser = async () => {
    setLoading(true);
    await axios({
      url: "https://fenhong-loading.dapp1.finance/backend/remove_item",
      method: "POST",
      data: {
        wallet_address: tingung,
        data_list: suoerData,
      },
    }).then((res) => {
      const data: any = [];
      res.data.data.map(async (item: any, index: any) => {
        data.push({
          key: index,
          address: item.address,
          Lpdata: item.percentage,
        });
      });
      setTimeout(() => {
        setListnu(data);
        setNusier(data.length);
        setLoading(false);
      }, 1000);
    });
  };
  const NuimsgShow = () => {
    setLoading(true);
    if (tingung === "") {
      TimeShow(`请输入要查询的代币地址`, 3, false);
    } else {
      const priData = listnu.filter((item) => {
        return item.address === tingung;
      });
      if (priData.length === 0) {
        TimeShow(`没有查询到你需要查询的地址，请去添加`, 3, false);
        setLoading(false);
      } else {
        setTimeout(() => {
          setListnu(priData);
          setNusier(priData.length);
          setLoading(false);
        }, 1000);
      }
    }
  };
  const onChange = async (checked: boolean) => {
    if (SleState === true) {
      setSleState(checked);
    } else {
      setSleState(checked);
    }
  };
  const Quantitgroup = (data: any) => {
    const blueList: any = [];
    data.map((item: any) => {
      blueList.push(Number(item.percentage));
    });
    var sum = 0;
    for (var i = 0; i < blueList.length; i++) {
      sum += blueList[i];
    }
    return sum;
  };
  const addSHowonClikc = () => {
    const Plinedate = Quantitgroup(listnu);
    let Namer = Plinedate * Number(input);
    setYuing(String(Namer));
    setToKenShow(true);
  };
  useEffect(() => {}, [yuing]);
  useEffect(() => {}, [listnu]);
  useEffect(() => {
    const addr = localStorage.getItem("Puing");
    if (addr !== null && addr !== undefined) {
      setAddress(addr);
    }
  }, [address, oreTime, isTimese]);
  return (
    <div className="conteronDeom">
      <div className="snueing">
        <div className="psuoisng">
          <div className="psuoisng_lengt">
            <div className="bopsuner">
              <div className="nuisner">
                <input
                  placeholder="请输入要查询的合约持币地址"
                  onChange={(e) => {
                    setLpinput(e.target.value);
                  }}
                  type="text"
                />
                <button
                  onClick={() => {
                    LPonClick(lpinput, 50, chlid);
                  }}
                >
                  查询
                </button>
              </div>
            </div>
            <div className="bopsuner2">
              {address !== "" ? (
                <div className="nuisner">
                  <div className="pruinstinptu">
                    <input
                      className="input1"
                      placeholder="请输入分发代币地址"
                      onChange={(e) => {
                        setDaibinput(e.target.value);
                      }}
                      type="text"
                    />
                    <input
                      className="input2"
                      placeholder="请输入分发条数"
                      onChange={(e) => {
                        setPieces(e.target.value);
                      }}
                      type="text"
                    />
                    <input
                      className="input2"
                      placeholder="请输入分发数量"
                      onChange={(e) => {
                        setInput(e.target.value);
                      }}
                      type="text"
                    />
                  </div>
                  {appser ? (
                    <button
                      onClick={() => {
                        appserClick();
                      }}
                    >
                      授权
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addSHowonClikc();
                      }}
                    >
                      分发
                    </button>
                  )}
                </div>
              ) : (
                <div className="nuisner">
                  <div className="pruinstinptu">
                    <div className="lbuser">
                      <input
                        className="input1"
                        disabled
                        placeholder="请输入分发代币地址"
                        onChange={(e) => {
                          setLpinput(e.target.value);
                        }}
                        type="text"
                      />
                      <input
                        className="input2"
                        placeholder="请输入分发条数"
                        onChange={(e) => {
                          setPieces(e.target.value);
                        }}
                        disabled
                        type="text"
                      />
                      <input
                        className="input2"
                        placeholder="请输入分发数量"
                        onChange={(e) => {
                          setLpinput(e.target.value);
                        }}
                        disabled
                        type="text"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      appserClick();
                    }}
                  >
                    授权
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="psuoisng_regit">
            <div className="nuisner">
              <input
                placeholder="请输入钱包地址"
                onChange={(e) => {
                  setTingung(e.target.value);
                }}
                type="text"
              />
              <div className="nuisner_pros">
                {" "}
                <button
                  onClick={() => {
                    NuimsgShow();
                  }}
                >
                  查询
                </button>
                <button
                  onClick={() => {
                    setAddreunser();
                  }}
                >
                  插入
                </button>
                <button
                  onClick={() => {
                    setDeletereunser();
                  }}
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="buseitile">
          <div className="bopsuner">
            <div>总共查询到 {nusier} 条数据</div>
            <div className="osleoeingt">
              <div className="osleoeingt_tuei">是否开启24小时过滤</div>
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={onChange}
                checked={SleState}
              />
            </div>
            <div className="nuisner">
              <input
                placeholder="请输入要筛选的代币数量"
                onChange={(e) => {
                  setShaixun(e.target.value);
                }}
                type="text"
              />
              <button
                onClick={() => {
                  setShaixunClick(shaixun);
                }}
              >
                筛选
              </button>
            </div>
          </div>
        </div>
        <div className="puinsu">
          <Table
            dataSource={listnu}
            bordered
            loading={loading}
            footer={() => (
              <div className="Niome">
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
                <div className="spusoere">
                  <button
                    onClick={() => {
                      skUerLPdata();
                    }}
                  >
                    一键复制LP
                  </button>
                  <button
                    onClick={() => {
                      skUerNuer();
                    }}
                  >
                    一键复制钱包
                  </button>
                </div>
              </div>
            )}
            columns={columns}
          />
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

      {toKenShow ? (
        <div className="pserExbuse">
          <div className="pserzhes"></div>
          <div className="pserTise2">
            <div className="pserExchange_nro">
              <div className="nriopsr">
                <div className="logding">
                  <div className="xgirm">
                    <ExclamationOutlined className="Luiisnr" />
                  </div>
                </div>
                <div className="Ptimeb">
                  期望发送: {input}枚 预计发送: {yuing}枚 是否确认发送?
                </div>
                <div className="spuduisbData">
                  <button
                    onClick={() => {
                      setToKenShow(false);
                    }}
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      InputonClick();
                    }}
                  >
                    确认
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;
