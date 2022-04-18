// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

// NFT的继承合同。
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// OpenZeppelin提供的助手功能。
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";
import "./libraries/Base64.sol";

// 我们的合同继承了ERC721，这是标准的NFT合同！
contract MyEpicGame is ERC721 {
    //我们将在结构中保存角色的属性。请随意添加
    //无论你想要什么属性！（例如防御、暴击几率等）。
    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    //tokenId是NFTs的唯一标识符，它只是一个数字

    //0、1、2、3等。
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

    //lil数组帮助我们保存角色的默认数据。
    //这将有助于我们创造新的角色，并需要知道
    //比如他们的惠普、广告等等。
    CharacterAttributes[] defaultCharacters;
    BigBoss public bigBoss;

    // 我们从nft的tokenId=>创建一个映射，该映射表示NFTs属性。
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    //来自地址=>NFTs令牌ID的映射。给了我一条捷径
    //存储NFT的所有者并在以后引用。
    mapping(address => uint256) public nftHolders;

    //在初始化字符时首次创建合同时传递给合同的数据。
    //我们将从run中传递这些值。js。
    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg,
        string memory bossName, // These new variables would be passed in via run.js or deploy.js.
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) ERC721("Heroes", "HERO") {
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDmg[i]
                })
            );

            CharacterAttributes memory c = defaultCharacters[i];

            //安全帽对控制台的使用。log（）最多可以按以下类型的任意顺序使用4个参数：uint、string、bool、address
            console.log(
                "Done initializing %s w/ HP %s, img %s",
                c.name,
                c.hp,
                c.imageURI
            );
        }
        _tokenIds.increment();

        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });

        console.log(
            "Done initializing boss %s w/ HP %s, img %s",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.imageURI
        );
    }

    //用户可以点击此功能，并根据
    //他们派来的角色！
    function mintCharacterNFT(uint256 _characterIndex) external {
        // 获取当前令牌ID（从1开始，因为我们在构造函数中递增）。
        uint256 newItemId = _tokenIds.current();

        // 神奇的功能！将令牌ID分配给呼叫者的钱包地址。
        _safeMint(msg.sender, newItemId);

        //我们映射tokenId=>它们的字符属性。更多关于这方面的信息

        //下面的教训。
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );

        //保持一个简单的方式，看看谁拥有什么NFT。
        nftHolders[msg.sender] = newItemId;

        // 为下一个使用它的人增加tokenId。
        _tokenIds.increment();
    }

    //编译字符串
    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDamage
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackBoss() public {
        // Get the state of the player's NFT.
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[
            nftTokenIdOfPlayer
        ];

        console.log(
            "\nPlayer w/ character %s about to attack. Has %s HP and %s AD",
            player.name,
            player.hp,
            player.attackDamage
        );
        console.log(
            "Boss %s has %s HP and %s AD",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.attackDamage
        );

        // Make sure the player has more than 0 HP.
        require(player.hp > 0, "Error: character must have HP to attack boss.");

        // Make sure the boss has more than 0 HP.
        require(bigBoss.hp > 0, "Error: boss must have HP to attack boss.");

        // Allow player to attack boss.
        if (bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp = bigBoss.hp - player.attackDamage;
        }

        // Allow boss to attack player.
        if (player.hp < bigBoss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - bigBoss.attackDamage;
        }

        // Console for ease.
        console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
        console.log("Boss attacked player. New player hp: %s\n", player.hp);
       emit AttackComplete(bigBoss.hp, player.hp);
    }

    //  检查用户是否有NFT

    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        // Get the tokenId of the user's character NFT
        uint256 userNftTokenId = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return their character.
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        // Else, return an empty character.
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    // 检索所有默认字符。
    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }

    // 找回老板。
    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }
}
