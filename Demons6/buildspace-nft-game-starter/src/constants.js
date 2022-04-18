const CONTRACT_ADDRESS = '0x5905CD7CE19272210fF00ef6408886d38E64E4Ff';

// 添加此方法，并确保在底部导出它！
const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      attackDamage: characterData.attackDamage.toNumber(),
    };
  };

export { CONTRACT_ADDRESS,transformCharacterData };