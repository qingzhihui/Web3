// 获取所有可铸币字符的方法
import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import LoadingIndicator from "../../Components/LoadingIndicator";

/*
 *暂时不要担心SetCharacterNF，我们很快就会讨论它！
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  // 我们将使用的新铸币厂国有资产
  const [mintingCharacter, setMintingCharacter] = useState(false);
  // 快速调用我们的合约
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      /*
       * This is the big difference. Set our gameContract in state.
       */
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);
  // 获取所有字符。
  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint");

        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);

        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    /*
     * 添加一个回调方法，该方法将在收到此事件时触发
     */
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      /*
       * 一旦我们的角色NFT被创造出来，我们就可以从我们的合同中获取元数据
       * 并将其设置为进入竞技场的状态
       */
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getCharacters();

      /*
       * 设置NFT生成的侦听器
       */
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      /*
       *当您的组件卸载时，让；Let’我们一定要清理这个听众
       */
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);
  // 从 UI 中铸造你的角色 NFT。
  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        // 显示我们的装载指示器
        setMintingCharacter(true);
        console.log("Minting character in progress...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
        // 铸造完成后隐藏我们的装载指示器
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
    }
  };

  // 实际渲染角色 UI。
  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={() => mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {/* Only show our loading state if mintingCharacter is true */}
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );
};

export default SelectCharacter;
