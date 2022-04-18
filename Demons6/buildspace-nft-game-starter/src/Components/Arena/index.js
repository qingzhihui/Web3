import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import "./Arena.css";
import LoadingIndicator from "../../Components/LoadingIndicator";
/*
 * 我们传递characterNFT元数据，以便在UI中显示一张酷卡
 */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  // 州政府将拘留我们的老板
  const [boss, setBoss] = useState(null);
  // 我们将使用它在攻击期间添加一些奇特的动画
  const [attackState, setAttackState] = useState("");

  // 为国家管理干杯
  const [showToast, setShowToast] = useState(false);

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

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  // 获取合同中的老板
  useEffect(() => {
    // 设置异步函数，从合同中获取boss并设置为状态
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };
    // 此事件触发时的设置逻辑
    const onAttackComplete = (newBossHp, newPlayerHp) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /*
       * 更新玩家和老板Hp
       */
      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      });
    };

    if (gameContract) {
      // 游戏合同准备好了！我们去找老板吧
      fetchBoss();
    }
    // 请确保在移除此组件时清除此事件
    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const txn = await gameContract.attackBoss();
        await txn.wait();
        console.log(txn);
        setAttackState("hit");

        /*
         * 5秒钟后，将吐司状态设置为true，然后设置为false
         */
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("");
    }
  };

  return (
    <div className="arena-container">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}

      {/* Boss */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content  ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
          </div>
          {attackState === "attacking" && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking ⚔️</p>
            </div>
          )}
        </div>
      )}

      {/* Replace your Character UI with this */}
      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
          {/* <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">{renderActivePlayersList()}</div>
        </div> */}
        </div>
      )}
    </div>
  );
};

export default Arena;
