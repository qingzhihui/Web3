import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import SelectCharacter from "./Components/SelectCharacter/SelectCharacter";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";
import "./App.css";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // 只是一个状态变量，我们用来存储用户的公共钱包。别忘了导入useState。
  const [currentAccount, setCurrentAccount] = useState(null);
  // 在“当前帐户”下，设置此新的状态属性
  const [characterNFT, setCharacterNFT] = useState(null);

  // 新增国有资产
  const [isLoading, setIsLoading] = useState(false);

  // 首先创建一个新的操作，我们将在组件加载时运行它
  const checkIfWalletIsConnected = async () => {
    try {
      // 首先确保我们可以进入窗户。以太坊
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        // 我们在这里设置isLoading，因为我们在下一行中使用retur
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        // 检查我们是否有权访问用户的钱包
        const accounts = await ethereum.request({ method: "eth_accounts" });
        // 用户可以有多个授权帐户，如果有，我们抢先一个！
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
    // 在完成所有函数逻辑之后，我们释放状态属性
    setIsLoading(false);
  };

  // 在这里实现你的connectWallet方法
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // 请求访问帐户的奇特方法。
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // 一旦我们授权Metamask，它就会打印出公共广播。
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  // 渲染SelectCharacter 组件。
  // Render Methods
  const renderContent = () => {
    // 如果应用程序当前正在加载，只需渲染LoadingIndicator即可
    if (isLoading) {
      return <LoadingIndicator />;
    }
    // 如果用户尚未连接到您的应用程序 -显示连接到钱包按钮
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      // 如果用户已连接到您的应用并且没有字符 NFT -显示SelectCharacter组件
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
      // 如果用户已连接到您的应用并且确实有一个字符 NFT -显示Arena组件。这Arena是用户可以攻击我们老板的地方！
    } else if (currentAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      );
    }
  };
  // 如果当前的以太坊网络不是 Rinkeby，请提醒用户！
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "4") {
        alert("Please connect to Rinkeby!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 这会在页面加载时运行我们的函数。
  useEffect(() => {
    checkIfWalletIsConnected();
    checkNetwork();
    // 任何时候我们的组件安装，确保立即设置我们的加载状态
    setIsLoading(true);
  }, []);
  // 如果用户已连接到您的应用并且没有字符 NFT，则显示SelectCharacter组件，应用程序加载后立即检查这一点
  useEffect(() => {
    /*
     * 我们将调用的函数与我们的智能合约进行交互
     */
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (characterNFT.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(characterNFT));
      }
      //完成所有的抓取后，将加载状态设置为false
      setIsLoading(false);
    };
    // 我们只想运行这个，如果我们有一个联网的钱包
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
