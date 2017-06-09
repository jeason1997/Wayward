/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

/**
 * The items.js file will contain item related code as well as the items object.
 */

var itemset = new Image();
itemset.src = 'images/itemset.png';

var itemSetSmall = new Image();
itemSetSmall.src = 'images/itemset_small.png';

/** Remember to up two handed weapons attack bonuses to compensate. Unless we come up with alternative bonuses for two handed weapons. **/

var items = {
    amber: {
        id: 0,
        x: 0,
        y: 0,
        name: "琥珀",
        weight: 0.5
    },
    animalskull: {
        id: 1,
        x: 1,
        y: 0,
        name: "一个动物的头骨",
        weight: 1.5
    },
    arrow: {
        id: 2,
        x: 2,
        y: 0,
        name: "一支箭",
        weight: 0.7,
        group: ["arrow"],
        recipe: {
            requires: [
                ["woodenpole", 1, 1],
                ["feather", 1, 1],
                ["arrowhead", 1, 1],
                ["string", 1, 1]
            ],
            skill: "fletching",
            level: "advanced"
        },
        attack: 2,
        damageType: ['piercing'],
        durability: 15
    },
    arrowhead: {
        id: 3,
        x: 3,
        y: 0,
        name: "一个石头箭头",
        weight: 0.3,
        group: ["sharpeneditem"],
        use: ["carve"],
        recipe: {
            requires: [
                ["sharpenedrock", 2, 1]
            ],
            skill: "stonecrafting",
            level: "simple"
        }
    },
    ashpile: {
        id: 4,
        x: 4,
        y: 0,
        name: "一堆灰烬",
        weight: 0.2,
        recipe: {
            requires: [
                ["mortarandpestle", 1, 0],
                ["charcoal", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    barkleggings: {
        id: 5,
        x: 5,
        y: 0,
        name: "树皮紧身裤",
        weight: 2,
        durability: 20,
        equip: "legs",
        defense: {
            base: 1,
            resist: [
                ['blunt', 1]
            ],
            vulnerable: [
                ['fire', 2],
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["treebark", 4, 4],
                ["string", 2, 2]
            ],
            skill: "woodworking",
            level: "intermediate"
        },
        onBurn: "charcoal"
    },
    barkshield: {
        id: 6,
        x: 6,
        y: 0,
        name: "树皮盾",
        weight: 2,
        durability: 20,
        equip: "held",
        defense: {
            base: 1,
            resist: [
                ['blunt', 1]
            ],
            vulnerable: [
                ['fire', 2],
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["treebark", 4, 4],
                ["string", 2, 2]
            ],
            skill: "woodworking",
            level: "intermediate"
        },
        onBurn: "charcoal"
    },
    barktunic: {
        id: 7,
        x: 7,
        y: 0,
        name: "一件树皮外衣",
        weight: 2,
        durability: 20,
        equip: "chest",
        defense: {
            base: 2,
            resist: [
                ['blunt', 1]
            ],
            vulnerable: [
                ['fire', 2],
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["treebark", 6, 6],
                ["string", 2, 2]
            ],
            skill: "woodworking",
            level: "intermediate"
        },
        onBurn: "charcoal"
    },
    bone: {
        id: 8,
        x: 8,
        y: 0,
        name: "一根骨头",
        weight: 0.5,
        group: ["bonelike"],
        durability: 15,
        equip: "held",
        attack: 2,
        damageType: ['blunt']
    },
    branch: {
        id: 9,
        x: 9,
        y: 0,
        name: "一根树枝",
        weight: 0.5,
        use: ["stokeFire"],
        onUse: {
            stokeFire: 1
        },
        recipe: {
            requires: [
                ["sapling", 1, 1]
            ],
            skill: "woodworking",
            level: "simple"
        },
        group: ["utensil"],
        durability: 5,
        equip: "held",
        attack: 1,
        damageType: ['blunt'],
        onBurn: "charcoal"
    },
    cactusspines: {
        id: 10,
        x: 10,
        y: 0,
        name: "仙人掌的刺",
        weight: 0.2
    },
    charcoal: {
        id: 11,
        x: 11,
        y: 0,
        name: "木炭",
        weight: 1,
        group: ["carbons", "fuellike", "medicinal"],
        use: ["stokeFire"],
        onUse: {
            stokeFire: 4
        }
    },
    cobblestone: {
        id: 12,
        x: 12,
        y: 0,
        name: "鹅卵石地板",
        weight: 5,
        use: ["placeTile"],
        onUse: {
            placeTile: "cobblestone"
        },
        recipe: {
            requires: [
                ["stones", 5, 5]
            ],
            skill: "stonecrafting",
            level: "intermediate"
        },
        durability: 15
    },
    cookedmeat: {
        id: 13,
        x: 13,
        y: 0,
        name: "熟肉",
        weight: 1,
        use: ["eat"],
        onUse: {
            eat: [2, 5, 8, -2]
        },
        decayable: [4750, "rottenmeat"],
        recipe: {
            requires: [
                ["rawmeat", 1, 1],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "intermediate",
            requiredenv: "firesource"
        },
        group: ["meat"]
    },
    earthworm: {
        id: 14,
        x: 14,
        y: 0,
        name: "蚯蚓",
        weight: 0.1,
        use: ["eat"],
        onUse: {
            eat: [0, 2, 1, 0]
        },
        group: ["insect"],
        decayable: [2750]
    },
    feather: {
        id: 15,
        x: 15,
        y: 0,
        name: "一根羽毛",
        weight: 0.1
    },
    fertilesoil: {
        id: 16,
        x: 16,
        y: 0,
        name: "肥沃的土壤",
        weight: 2,
        use: ["garden"],
        onUse: {
            garden: 4
        },
        recipe: {
            requires: [
                ["ashpile", 1, 1],
                ["soil", 1, 1],
                ["peat", 1, 1]
            ],
            skill: "botany",
            level: "intermediate"
        }
    },
    seawaterwaterskin: {
        id: 17,
        x: 17,
        y: 0,
        name: "装满海水的革制水袋",
        weight: 2,
        use: ["drink", "pour"],
        onUse: {
            drink: [0, -15, 1, -2]
        },
        durability: 20,
        group: ["water"],
        returnOnUse: "waterskin"
    },
    fireplough: {
        id: 18,
        x: 18,
        y: 0,
        name: "火犁",
        weight: 3,
        durability: 30,
        use: ["startFire"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["woodenpole", 1, 1],
                ["log", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        onBurn: "charcoal"
    },
    flowerseeds: {
        id: 19,
        x: 19,
        y: 0,
        name: "花种",
        weight: 0.1,
        use: ["plant"],
        onUse: {
            plant: "yellowflowers"
        },
        group: ["medicinal"]
    },
    fossil: {
        id: 20,
        x: 20,
        y: 0,
        name: "一块化石",
        group: ["carbons"],
        weight: 0.8
    },
    goldcoins: {
        id: 21,
        x: 21,
        y: 0,
        name: "金币",
        weight: 2,
        group: ["treasure"]
    },
    goldenchalice: {
        id: 22,
        x: 22,
        y: 0,
        name: "黄金圣杯",
        weight: 3,
        group: ["treasure"]
    },
    goldenring: {
        id: 23,
        x: 23,
        y: 0,
        name: "黄金戒指",
        weight: 1,
        group: ["treasure"]
    },
    goldensword: {
        id: 24,
        x: 24,
        y: 0,
        name: "黄金之剑（Ex咖喱棒！！！）",
        weight: 3,
        durability: 15,
        equip: "held",
        attack: 8,
        damageType: ['piercing', 'slashing'],
        use: ["carve"],
        group: ["sharpeneditem", "treasure"]
    },
    grassseeds: {
        id: 25,
        x: 25,
        y: 0,
        name: "草种",
        weight: 0.1,
        use: ["plant"],
        onUse: {
            plant: "grassseeds_ground"
        }
    },
    ironore: {
        id: 26,
        x: 26,
        y: 0,
        name: "铁矿石",
        weight: 3
    },
    kindling: {
        id: 27,
        x: 27,
        y: 0,
        name: "引火物",
        weight: 0.2,
        use: ["stokeFire"],
        onUse: {
            stokeFire: 2
        },
        recipe: {
            requires: [
                ["twigs", 1, 1],
                ["treebark", 1, 1]
            ],
            skill: "camping",
            level: "simple"
        }
    },
    largerock: {
        id: 28,
        x: 28,
        y: 0,
        name: "大石头",
        weight: 3,
        group: ["rocklike"]
    },
    leafbedroll: {
        id: 29,
        x: 29,
        y: 0,
        name: "叶子铺盖",
        weight: 1.2,
        durability: 25,
        use: ["rest", "sleep"],
        recipe: {
            requires: [
                ["leaves", 10, 10],
                ["ropelike", 2, 2]
            ],
            skill: "camping",
            level: "intermediate"
        }
    },
    leather: {
        id: 30,
        x: 30,
        y: 0,
        name: "皮革睡袋",
        weight: 1.5
    },
    leaves: {
        id: 31,
        x: 31,
        y: 0,
        name: "树叶",
        group: ["compost"],
        use: ["stokeFire"],
        onUse: {
            stokeFire: 1
        },
        weight: 0.1
    },
    limestone: {
        id: 32,
        x: 32,
        y: 0,
        name: "石灰岩",
        weight: 2
    },
    log: {
        id: 33,
        x: 33,
        y: 0,
        name: "原木",
        weight: 5,
        use: ["stokeFire"],
        onUse: {
            stokeFire: 8
        },
        group: ["fuellike"],
        onBurn: "charcoal"
    },
    mortarandpestle: {
        id: 34,
        x: 34,
        y: 0,
        name: "研钵及研杵",
        weight: 2,
        recipe: {
            requires: [
                ["smoothrock", 2, 2]
            ],
            skill: "stonecrafting",
            level: "intermediate"
        },
        durability: 10
    },
    mushrooms: {
        id: 35,
        x: 35,
        y: 0,
        name: "常见的蘑菇",
        weight: 0.2,
        use: ["eat", "plant"],
        skilluse: "mycology",
        onUse: {
            eat: [3, 2, 2, -1],
            plant: "mushrooms_ground"
        },
        decayable: [19000]
    },
    nopal: {
        id: 36,
        x: 36,
        y: 0,
        name: "仙人掌",
        weight: 0.5,
        use: ["eat"],
        skilluse: "botany",
        onUse: {
            eat: [0, 3, 3, 1]
        },
        decayable: [8750, "rottingvegetation"]
    },
    peat: {
        id: 37,
        x: 37,
        y: 0,
        name: "泥煤",
        weight: 1,
        group: ["fuellike", "compost"],
        use: ["stokeFire"],
        onUse: {
            stokeFire: 4
        }
    },
    sandstone: {
        id: 38,
        x: 38,
        y: 0,
        name: "砂岩",
        weight: 2,
        group: ["rocklike"]
    },
    pileofgravel: {
        id: 39,
        x: 39,
        y: 0,
        name: "堆砾石",
        weight: 3,
        use: ["placeTile"],
        onUse: {
            placeTile: "gravel"
        }
    },
    pileofsand: {
        id: 40,
        x: 40,
        y: 0,
        name: "沙洲堆积图",
        weight: 3,
        use: ["placeTile"],
        onUse: {
            placeTile: "sand"
        },
        onBurn: "sharpglass"
    },
    woodenarrow: {
        id: 41,
        x: 41,
        y: 0,
        name: "木箭",
        weight: 0.6,
        group: ["arrow"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["woodenpole", 1, 1],
                ["feather", 1, 1]
            ],
            skill: "fletching",
            level: "intermediate"
        },
        attack: 1,
        damageType: ['piercing'],
        durability: 10
    },
    stoneaxe: {
        id: 42,
        x: 42,
        y: 0,
        name: "石斧",
        weight: 2,
        durability: 50,
        equip: "held",
        attack: 3,
        damageType: ['slashing', "blunt"],
        group: ["sharpeneditem"],
        use: ["carve"],
        recipe: {
            requires: [
                ["sharpenedrock", 2, 2],
                ["polelike", 1, 1],
                ["string", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    bandage: {
        id: 43,
        x: 43,
        y: 0,
        name: "绷带",
        weight: 0.1,
        use: ["heal"],
        skilluse: "anatomy",
        onUse: {
            heal: [12, 0, 0, 0]
        },
        recipe: {
            requires: [
                ["fabriclike", 1, 1]
            ],
            skill: "tailoring",
            level: "intermediate"
        }
    },
    wovenfabric: {
        id: 44,
        x: 44,
        y: 0,
        name: "织物",
        weight: 0.2,
        group: ["fabriclike"],
        recipe: {
            requires: [
                ["string", 6, 6],
                ["needlelike", 1, 0]
            ],
            skill: "tailoring",
            level: "intermediate"
        }
    },
    cactusneedle: {
        id: 45,
        x: 45,
        y: 0,
        name: "仙人掌的针",
        weight: 0.1,
        group: ["needlelike"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["cactusspines", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        },
        durability: 5
    },
    stoneshovel: {
        id: 46,
        x: 46,
        y: 0,
        name: "石铲",
        weight: 2,
        durability: 50,
        equip: "held",
        attack: 2,
        damageType: ['slashing'],
        use: ["dig", "gatherTreasure"],
        recipe: {
            requires: [
                ["sharpenedrock", 1, 1],
                ["polelike", 2, 2],
                ["string", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    woodenspear: {
        id: 47,
        x: 47,
        y: 0,
        name: "木矛",
        weight: 2,
        durability: 10,
        equip: "held",
        attack: 2,
        damageType: ['piercing'],
        group: ["utensil"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["woodenpole", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    suture: {
        id: 48,
        x: 48,
        y: 0,
        name: "缝合线",
        weight: 0.1,
        use: ["heal"],
        skilluse: "anatomy",
        onUse: {
            heal: [8, 0, 0, 0]
        },
        recipe: {
            requires: [
                ["string", 1, 1],
                ["needlelike", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    raft: {
        id: 49,
        x: 49,
        y: 0,
        name: "救生筏",
        weight: 15,
        durability: 500,
        use: ["raft"],
        recipe: {
            requires: [
                ["rope", 2, 2],
                ["log", 3, 3],
                ["boatpaddle", 1, 1]
            ],
            skill: "tinkering",
            level: "advanced"
        },
        onBurn: "charcoal"
    },
    rawmeat: {
        id: 50,
        x: 50,
        y: 0,
        name: "生肉",
        weight: 1,
        use: ["eat"],
        onUse: {
            eat: [-2, 2, 7, -2]
        },
        decayable: [2750, "rottenmeat"],
        onBurn: "cookedmeat",
        group: ["meat"]
    },
    redberries: {
        id: 51,
        x: 51,
        y: 0,
        name: "红浆果",
        weight: 0.1,
        use: ["eat"],
        skilluse: "botany",
        onUse: {
            eat: [1, 1, 2, 0]
        },
        decayable: [14000, "rottingvegetation"]
    },
    redmushroom: {
        id: 52,
        x: 52,
        y: 0,
        name: "斑点红色蘑菇",
        weight: 0.2,
        use: ["eat", "plant"],
        skilluse: "mycology",
        onUse: {
            eat: [-5, 8, 2, -1],
            plant: "redmushroom_ground"
        },
        decayable: [19000]
    },
    rope: {
        id: 53,
        x: 53,
        y: 0,
        name: "绳索",
        weight: 0.8,
        recipe: {
            requires: [
                ["string", 2, 2]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    sapling: {
        id: 54,
        x: 54,
        y: 0,
        name: "树苗",
        weight: 2.5,
        use: ["plant", "stokeFire"],
        onUse: {
            plant: "sapling_ground",
            stokeFire: 3
        },
        onBurn: "charcoal"
    },
    seaweed: {
        id: 55,
        x: 55,
        y: 0,
        name: "海藻",
        weight: 0.2,
        group: ["ropelike"],
        use: ["eat"],
        skilluse: "botany",
        onUse: {
            eat: [0, 1, 1, -1]
        },
        decayable: [19000, "rottingvegetation"]
    },
    sharpglass: {
        id: 56,
        x: 56,
        y: 0,
        name: "锋利的玻璃",
        weight: 0.3,
        use: ["carve"],
        group: ["sharpeneditem"],
        durability: 15,
        recipe: {
            requires: [
                ["pileofsand", 1, 1]
            ],
            skill: "glassblowing",
            level: "simple",
            requiredenv: "firesource"
        }
    },
    sharprock: {
        id: 57,
        x: 57,
        y: 0,
        name: "锋利的岩石",
        weight: 1,
        durability: 10,
        group: ["sharpeneditem", "sharpenedrock"],
        use: ["carve"],
        recipe: {
            requires: [
                ["largerock", 2, 1]
            ],
            skill: "stonecrafting",
            level: "simple"
        }
    },
    skullcap: {
        id: 58,
        x: 58,
        y: 0,
        name: "无沿便帽",
        weight: 1,
        durability: 15,
        equip: "head",
        defense: {
            base: 1,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: []
        },
        recipe: {
            requires: [
                ["rocklike", 1, 0],
                ["animalskull", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    smoothrock: {
        id: 59,
        x: 59,
        y: 0,
        name: "流沙岩石",
        weight: 2,
        group: ["rocklike"],
        recipe: {
            requires: [
                ["sharpenedrock", 1, 1],
                ["largerock", 1, 1]
            ],
            skill: "stonecrafting",
            level: "simple"
        }
    },
    soil: {
        id: 60,
        x: 60,
        y: 0,
        name: "泥土",
        weight: 2,
        use: ["placeTile"],
        onUse: {
            placeTile: "dirt"
        }
    },
    spear: {
        id: 61,
        x: 61,
        y: 0,
        name: "石矛",
        weight: 2,
        durability: 20,
        equip: "held",
        attack: 3,
        damageType: ['piercing'],
        group: ["utensil"],
        recipe: {
            requires: [
                ["woodenpole", 1, 1],
                ["sharpenedrock", 1, 1],
                ["string", 1, 1]
            ],
            skill: "tinkering",
            level: "advanced"
        }
    },
    stones: {
        id: 62,
        x: 62,
        y: 0,
        name: "石头",
        weight: 1,
        recipe: {
            requires: [
                ["rocklike", 2, 1]
            ],
            skill: "stonecrafting",
            level: "simple"
        }
    },
    stonewall: {
        id: 63,
        x: 63,
        y: 0,
        name: "石墙",
        weight: 24,
        use: ["placeTile"],
        onUse: {
            placeTile: "stonewall"
        },
        recipe: {
            requires: [
                ["largerock", 8, 8]
            ],
            skill: "stonecrafting",
            level: "advanced"
        },
        durability: 15
    },
    string: {
        id: 64,
        x: 0,
        y: 1,
        name: "细绳",
        weight: 0.2,
        recipe: {
            requires: [
                ["ropelike", 2, 2]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    strippedbark: {
        id: 65,
        x: 1,
        y: 1,
        name: "剥落的树皮",
        weight: 0.1,
        group: ["ropelike"],
        use: ["stokeFire"],
        onUse: {
            stokeFire: 2
        },
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["branch", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    tannedleather: {
        id: 66,
        x: 2,
        y: 1,
        name: "粗鞣革",
        weight: 1.5,
        recipe: {
            requires: [
                ["tannin", 1, 1],
                ["leather", 1, 1]
            ],
            skill: "leatherworking",
            level: "intermediate"
        }
    },
    tannin: {
        id: 67,
        x: 3,
        y: 1,
        name: "鞣制",
        weight: 0.1,
        recipe: {
            requires: [
                ["mortarandpestle", 1, 0],
                ["treebark", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    thistleseeds: {
        id: 68,
        x: 4,
        y: 1,
        name: "蓟种子",
        weight: 0.1,
        use: ["eat", "plant"],
        skilluse: "botany",
        onUse: {
            eat: [3, 0, 1, 0],
            plant: "thistle"
        },
        group: ["medicinal"]
    },
    treebark: {
        id: 69,
        x: 5,
        y: 1,
        name: "树皮",
        weight: 0.3,
        use: ["stokeFire"],
        onUse: {
            stokeFire: 2
        },
        onBurn: "charcoal"
    },
    treefungus: {
        id: 70,
        x: 6,
        y: 1,
        name: "白木耳",
        weight: 0.2,
        use: ["eat"],
        skilluse: "mycology",
        onUse: {
            eat: [0, 7, 3, -1]
        },
        decayable: [19000]
    },
    treevine: {
        id: 71,
        x: 7,
        y: 1,
        name: "葡萄树",
        weight: 0.8,
        group: ["ropelike"]
    },
    twigs: {
        id: 72,
        x: 8,
        y: 1,
        name: "细树枝",
        weight: 0.2,
        use: ["stokeFire"],
        onUse: {
            stokeFire: 2
        },
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["branch", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        },
        onBurn: "charcoal"
    },
    waterskin: {
        id: 73,
        x: 9,
        y: 1,
        name: "革制水袋",
        weight: 1,
        use: ["fillWater"],
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 1, 1],
                ["string", 2, 2]
            ],
            skill: "leatherworking",
            level: "intermediate"
        },
        durability: 20,
        group: ["container"]
    },
    woodenpole: {
        id: 74,
        x: 10,
        y: 1,
        name: "木杆",
        weight: 0.5,
        group: ["polelike", "utensil"],
        durability: 10,
        equip: "held",
        attack: 2,
        damageType: ['blunt'],
        use: ["lightItem"],
        lit: "poletorch_lit",
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["branch", 1, 1]
            ],
            skill: "woodworking",
            level: "simple"
        },
        onBurn: "charcoal"
    },
    peatbandage: {
        id: 75,
        x: 11,
        y: 1,
        name: "泥炭绷带",
        weight: 0.5,
        use: ["heal"],
        skilluse: "anatomy",
        onUse: {
            heal: [15, 0, 0, 0]
        },
        recipe: {
            requires: [
                ["bandage", 1, 1],
                ["peat", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    bow: {
        id: 76,
        x: 12,
        y: 1,
        name: "弓",
        weight: 1,
        durability: 15,
        use: ["shoot"],
        equip: "held",
        twoHanded: true,
        attack: 1,
        damageType: ['blunt'],
        ranged: {
            range: 4,
            attack: 1
        },
        recipe: {
            requires: [
                ["woodenpole", 1, 1],
                ["string", 1, 1]
            ],
            skill: "fletching",
            level: "intermediate"
        }
    },
    bowdrill: {
        id: 77,
        x: 13,
        y: 1,
        name: "弓钻",
        weight: 5,
        durability: 45,
        use: ["startFire"],
        recipe: {
            requires: [
                ["bow", 1, 1],
                ["handdrill", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        onBurn: "charcoal"
    },
    fishingnet: {
        id: 78,
        x: 14,
        y: 1,
        name: "渔网",
        weight: 2,
        durability: 50,
        ranged: {
            range: 2,
            attack: 0
        },
        use: ["fishing", "gatherTreasure"],
        recipe: {
            requires: [
                ["string", 6, 6],
                ["stones", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    rawtrout: {
        id: 79,
        x: 15,
        y: 1,
        name: "生鲑鱼",
        weight: 1,
        use: ["eat"],
        onUse: {
            eat: [1, 1, 5, -1]
        },
        decayable: [2750, "rottenmeat"],
        onBurn: "cookedtrout",
        group: ["meat"]
    },
    cookedtrout: {
        id: 80,
        x: 16,
        y: 1,
        name: "煮熟的鲑鱼",
        weight: 0.9,
        use: ["eat"],
        onUse: {
            eat: [2, 4, 6, -1]
        },
        decayable: [4750, "rottenmeat"],
        recipe: {
            requires: [
                ["rawtrout", 1, 1],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "simple",
            requiredenv: "firesource"
        },
        group: ["meat"]
    },
    campfire: {
        id: 81,
        x: 17,
        y: 1,
        name: "篝火",
        weight: 17,
        use: ["build"],
        onUse: {
            build: "campfire_unlit"
        },
        recipe: {
            requires: [
                ["rocklike", 5, 5]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        durability: 10
    },
    treevinewhip: {
        id: 82,
        x: 18,
        y: 1,
        name: "葡萄树鞭",
        weight: 0.5,
        durability: 10,
        equip: "held",
        attack: 2,
        damageType: ['slashing'],
        recipe: {
            requires: [
                ["treevine", 2, 2]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    pileofsnow: {
        id: 83,
        x: 19,
        y: 1,
        name: "一堆血",
        use: ["eat", "pour"],
        onUse: {
            eat: [1, 10, 1, 3]
        },
        weight: 0.3,
        decayable: [750]
    },
    barktorch: {
        id: 84,
        x: 20,
        y: 1,
        name: "树皮火炬",
        weight: 1,
        durability: 15,
        attack: 1,
        damageType: ['blunt'],
        equip: "held",
        use: ["lightItem"],
        group: ["torchlike"],
        lit: "barktorch_lit",
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["strippedbark", 5, 5]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        onBurn: "charcoal"
    },
    barktorch_lit: {
        id: 85,
        x: 21,
        y: 1,
        name: "树皮点燃的火炬",
        weight: 1,
        durability: 15,
        equip: "held",
        onequip: ["Light Source", 7],
        attack: 3,
        damageType: ['fire', 'blunt'],
        use: ["startFire"],
        revert: "barktorch",
        decayable: [1000, "ashpile"],
        onBurn: "charcoal"
    },
    handdrill: {
        id: 86,
        x: 22,
        y: 1,
        name: "手钻",
        weight: 0.5,
        durability: 15,
        use: ["startFire"],
        recipe: {
            requires: [
                ["woodenpole", 2, 2]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        onBurn: "charcoal"
    },
    smallbag: {
        id: 87,
        x: 23,
        y: 1,
        name: "小包",
        weight: 0.3,
        container: true,
        maxWeight: 25,
        use: ["openContainer"],
        equip: "belt",
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 1, 1],
                ["string", 1, 1]
            ],
            skill: "leatherworking",
            level: "intermediate"
        }
    },
    shale: {
        id: 88,
        x: 24,
        y: 1,
        name: "页岩",
        weight: 0.8,
        durability: 5,
        group: ["sharpeneditem", "sharpenedrock"],
        use: ["carve"]
    },
    sharpenedbone: {
        id: 89,
        x: 25,
        y: 1,
        name: "磨骨",
        weight: 0.5,
        durability: 5,
        group: ["sharpeneditem", "utensil"],
        use: ["carve"],
        equip: "held",
        attack: 3,
        damageType: ['piercing'],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["bonepole", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    grindstone: {
        id: 90,
        x: 26,
        y: 1,
        name: "磨石",
        weight: 1,
        durability: 5,
        use: ["repair"],
        recipe: {
            requires: [
                ["rocklike", 1, 0],
                ["sandstone", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        group: ["repair"]
    },
    rawfishsteak: {
        id: 91,
        x: 27,
        y: 1,
        name: "生鱼片",
        weight: 1,
        use: ["eat"],
        onUse: {
            eat: [1, 1, 6, -1]
        },
        decayable: [2750, "rottenmeat"],
        onBurn: "cookedfishsteak",
        group: ["meat"]
    },
    cookedfishsteak: {
        id: 92,
        x: 28,
        y: 1,
        name: "煮熟的鱼排",
        weight: 1,
        use: ["eat"],
        onUse: {
            eat: [2, 4, 6, -1]
        },
        decayable: [4750, "rottenmeat"],
        recipe: {
            requires: [
                ["rawfishsteak", 1, 1],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "simple",
            requiredenv: "firesource"
        },
        group: ["meat"]
    },
    desalinatedwaterwaterskin: {
        id: 93,
        x: 29,
        y: 1,
        name: "装满淡水的革制水袋",
        weight: 2,
        use: ["drink", "pour"],
        onUse: {
            drink: [2, 15, 1, 10]
        },
        recipe: {
            requires: [
                ["flask", 1, 0],
                ["seawaterwaterskin", 1, 1]
            ],
            skill: "alchemy",
            level: "simple",
            requiredenv: "campfire_lit"
        },
        durability: 20,
        group: ["water", "potablewaterskin"],
        returnOnUse: "waterskin"
    },
    boatpaddle: {
        id: 94,
        x: 30,
        y: 1,
        name: "木浆",
        weight: 2,
        durability: 15,
        equip: "held",
        attack: 2,
        damageType: ['blunt'],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["treebark", 2, 2],
                ["string", 2, 2]
            ],
            skill: "woodworking",
            level: "intermediate"
        },
        onBurn: "charcoal"
    },
    bullboat: {
        id: 95,
        x: 31,
        y: 1,
        name: "大船",
        weight: 10,
        use: ["travel"],
        recipe: {
            requires: [
                ["woodenpole", 8, 8],
                ["tannedleather", 1, 1],
                ["rope", 2, 2],
                ["boatpaddle", 1, 1]
            ],
            skill: "woodworking",
            level: "advanced"
        },
        onBurn: "charcoal"
    },
    refinedsand: {
        id: 96,
        x: 32,
        y: 1,
        name: "精制沙",
        weight: 2,
        recipe: {
            requires: [
                ["mortarandpestle", 1, 0],
                ["pileofsand", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        },
        onBurn: "sharpglass"
    },
    spyglass: {
        id: 97,
        x: 33,
        y: 1,
        name: "小望远镜",
        weight: 2,
        use: ["look"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["lens", 2, 2],
                ["log", 1, 1],
                ["string", 1, 1]
            ],
            skill: "tinkering",
            level: "advanced"
        },
        durability: 50
    },
    flask: {
        id: 98,
        x: 34,
        y: 1,
        name: "烧瓶",
        weight: 1,
        recipe: {
            requires: [
                ["clayblowpipe", 1, 0],
                ["refinedsand", 2, 2],
                ["limestonepowder", 1, 1]
            ],
            skill: "glassblowing",
            level: "advanced",
            requiredenv: "furnace_lit"
        },
        durability: 15
    },
    rawclay: {
        id: 99,
        x: 35,
        y: 1,
        name: "未加工的粘土",
        weight: 2,
        use: ["placeTile"],
        onUse: {
            placeTile: "clay"
        }
    },
    rawclayblowpipe: {
        id: 100,
        x: 36,
        y: 1,
        name: "生粘土吹管",
        weight: 1,
        recipe: {
            requires: [
                ["polelike", 1, 0],
                ["rawclay", 1, 1]
            ],
            skill: "claythrowing",
            level: "intermediate"
        }
    },
    clayblowpipe: {
        id: 101,
        x: 37,
        y: 1,
        name: "粘土吹管",
        weight: 1,
        recipe: {
            requires: [
                ["rawclayblowpipe", 1, 1]
            ],
            skill: "claythrowing",
            level: "advanced",
            requiredenv: "kiln_lit"
        },
        durability: 15
    },
    leatherbelt: {
        id: 102,
        x: 38,
        y: 1,
        name: "皮带",
        weight: 1,
        durability: 25,
        equip: "belt",
        defense: {
            base: 1,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: [
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 1, 1],
                ["string", 1, 1]
            ],
            skill: "leatherworking",
            level: "intermediate"
        }
    },
    leathertunic: {
        id: 103,
        x: 39,
        y: 1,
        name: "皮革束腰外衣",
        weight: 3,
        durability: 25,
        equip: "chest",
        defense: {
            base: 3,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: [
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 2, 2],
                ["string", 4, 4]
            ],
            skill: "leatherworking",
            level: "advanced"
        }
    },
    leatherboots: {
        id: 104,
        x: 40,
        y: 1,
        name: "皮靴",
        weight: 3,
        durability: 25,
        equip: "feet",
        defense: {
            base: 2,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: [
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 2, 2],
                ["string", 2, 2]
            ],
            skill: "leatherworking",
            level: "advanced"
        }
    },
    leathercap: {
        id: 105,
        x: 41,
        y: 1,
        name: "皮帽",
        weight: 1,
        durability: 25,
        equip: "head",
        defense: {
            base: 1,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: [
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 1, 1],
                ["string", 1, 1]
            ],
            skill: "leatherworking",
            level: "intermediate"
        }
    },
    leathergorget: {
        id: 106,
        x: 42,
        y: 1,
        name: "皮革饰领",
        weight: 1,
        durability: 25,
        equip: "neck",
        defense: {
            base: 1,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: [
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 1, 1],
                ["string", 1, 1]
            ],
            skill: "leatherworking",
            level: "intermediate"
        }
    },
    leatherpants: {
        id: 107,
        x: 43,
        y: 1,
        name: "皮裤",
        weight: 2,
        durability: 25,
        equip: "legs",
        defense: {
            base: 2,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: [
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 2, 2],
                ["string", 4, 4]
            ],
            skill: "leatherworking",
            level: "advanced"
        }
    },
    leathergloves: {
        id: 108,
        x: 44,
        y: 1,
        name: "皮手套",
        weight: 1,
        durability: 25,
        equip: "hands",
        defense: {
            base: 1,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: [
                ['piercing', 1]
            ]
        },
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 2, 2],
                ["string", 3, 3]
            ],
            skill: "leatherworking",
            level: "expert"
        }
    },
    furnace: {
        id: 109,
        x: 45,
        y: 1,
        name: "炉子",
        weight: 24,
        use: ["build"],
        onUse: {
            build: "furnace_unlit"
        },
        recipe: {
            requires: [
                ["rocklike", 8, 8]
            ],
            skill: "stonecrafting",
            level: "advanced"
        },
        durability: 15
    },
    kiln: {
        id: 110,
        x: 46,
        y: 1,
        name: "窑",
        weight: 16,
        use: ["build"],
        onUse: {
            build: "kiln_unlit"
        },
        recipe: {
            requires: [
                ["rocklike", 8, 8]
            ],
            skill: "stonecrafting",
            level: "advanced"
        },
        durability: 10
    },
    irontongs: {
        id: 111,
        x: 47,
        y: 1,
        name: "铁钳",
        weight: 1,
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 1, 1],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        },
        group: ["tongs", "utensil"],
        durability: 50
    },
    talc: {
        id: 112,
        x: 48,
        y: 1,
        name: "Talc",
        weight: 1
    },
    talcumpowder: {
        id: 113,
        x: 49,
        y: 1,
        name: "滑石粉",
        weight: 0.2,
        recipe: {
            requires: [
                ["talc", 1, 1],
                ["mortarandpestle", 1, 0]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    sandcastflask: {
        id: 114,
        x: 50,
        y: 1,
        name: "砂型铸造瓶",
        weight: 8,
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["log", 1, 1],
                ["greensand", 1, 1]
            ],
            skill: "woodworking",
            level: "intermediate"
        },
        durability: 30
    },
    lens: {
        id: 115,
        x: 51,
        y: 1,
        name: "透镜",
        weight: 1,
        durability: 45,
        use: ["startFire"],
        recipe: {
            requires: [
                ["tongs", 1, 0],
                ["refinedsand", 1, 1],
                ["limestonepowder", 1, 1]
            ],
            skill: "glassblowing",
            level: "intermediate",
            requiredenv: "furnace_lit"
        }
    },
    plantroots: {
        id: 116,
        x: 52,
        y: 1,
        name: "植物根",
        weight: 0.3,
        group: ["ropelike", "medicinal"],
        use: ["eat"],
        skilluse: "botany",
        onUse: {
            eat: [1, 2, 1, 0]
        }
    },
    lockpick: {
        id: 117,
        x: 53,
        y: 1,
        name: "撬锁工具",
        weight: 0.1,
        durability: 5,
        use: ["lockpick"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["needlelike", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    boneneedle: {
        id: 118,
        x: 54,
        y: 1,
        name: "骨针",
        weight: 0.1,
        group: ["needlelike"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["sharpenedbone", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        durability: 10
    },
    pineapple: {
        id: 119,
        x: 55,
        y: 1,
        name: "菠萝",
        weight: 1,
        use: ["eat"],
        onUse: {
            eat: [5, 5, 5, 3]
        },
        decayable: [8750, "rottingvegetation"]
    },
    tatteredmap: {
        id: 120,
        x: 56,
        y: 1,
        name: "破烂的地图",
        weight: 0.5,
        durability: 50,
        use: ["decode"]
    },
    coal: {
        id: 121,
        x: 57,
        y: 1,
        name: "煤",
        weight: 1,
        group: ["carbons", "fuellike"],
        use: ["stokeFire"],
        onUse: {
            stokeFire: 4
        }
    },
    wroughtiron: {
        id: 122,
        x: 58,
        y: 1,
        name: "熟铁",
        weight: 2,
        recipe: {
            requires: [
                ["ironore", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "furnace_lit"
        }
    },
    limestonepowder: {
        id: 123,
        x: 59,
        y: 1,
        name: "石灰石粉",
        weight: 0.2,
        recipe: {
            requires: [
                ["limestone", 1, 1],
                ["mortarandpestle", 1, 0]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    ironingot: {
        id: 124,
        x: 60,
        y: 1,
        name: "铁锭",
        weight: 2,
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["carbonpowder", 1, 1],
                ["limestonepowder", 1, 1],
                ["wroughtiron", 1, 1],
                ["sandcastflask", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "furnace_lit"
        }
    },
    backpack: {
        id: 125,
        x: 61,
        y: 1,
        name: "背包",
        weight: 2,
        container: true,
        maxWeight: 50,
        use: ["openContainer"],
        equip: "back",
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 2, 2],
                ["string", 2, 2]
            ],
            skill: "leatherworking",
            level: "advanced"
        }
    },
    rottenmeat: {
        id: 126,
        x: 62,
        y: 1,
        name: "烂肉",
        weight: 0.8,
        group: ["compost"],
        use: ["eat"],
        onUse: {
            eat: [-10, -20, 1, -1]
        },
        decayable: [4750]
    },
    stonehammer: {
        id: 127,
        x: 63,
        y: 1,
        name: "石锤",
        weight: 2,
        durability: 15,
        equip: "held",
        attack: 2,
        damageType: ['blunt'],
        use: ["repair"],
        group: ["hammerlike", "repair"],
        recipe: {
            requires: [
                ["string", 1, 1],
                ["rocklike", 1, 1],
                ["polelike", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    rawchicken: {
        id: 128,
        x: 0,
        y: 2,
        name: "生鸡肉",
        weight: 2,
        use: ["eat"],
        onUse: {
            eat: [-10, -10, 6, -1]
        },
        decayable: [2250, "rottenmeat"],
        onBurn: "cookedchicken",
        group: ["meat"]
    },
    cookedchicken: {
        id: 129,
        x: 1,
        y: 2,
        name: "熟鸡肉",
        weight: 2,
        use: ["eat"],
        onUse: {
            eat: [5, 5, 8, -2]
        },
        decayable: [3250, "rottenmeat"],
        recipe: {
            requires: [
                ["rawchicken", 1, 1],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "advanced",
            requiredenv: "firesource"
        },
        group: ["meat"]
    },
    forgeandanvil: {
        id: 130,
        x: 2,
        y: 2,
        name: "熔炉和铁砧",
        weight: 20,
        use: ["build"],
        onUse: {
            build: "forgeandanvil_unlit"
        },
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["rocklike", 7, 7],
                ["log", 1, 1]
            ],
            skill: "tinkering",
            level: "advanced"
        },
        durability: 15
    },
    woodenchest: {
        id: 131,
        x: 3,
        y: 2,
        name: "木制外衣",
        weight: 10,
        container: true,
        use: ["build"],
        onUse: {
            build: "woodenchest_unlocked"
        },
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["log", 3, 3]
            ],
            skill: "woodworking",
            level: "advanced"
        },
        onBurn: "charcoal",
        durability: 10
    },
    ironsword: {
        id: 132,
        x: 4,
        y: 2,
        name: "铁剑",
        weight: 4,
        durability: 100,
        use: ["carve"],
        group: ["sharpeneditem"],
        equip: "held",
        attack: 6,
        damageType: ['piercing', 'slashing'],
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 2, 2],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "expert",
            requiredenv: "forgeandanvil_lit"
        }
    },
    ironbreastplate: {
        id: 133,
        x: 5,
        y: 2,
        name: "钢铁胸甲",
        weight: 6,
        durability: 100,
        equip: "chest",
        defense: {
            base: 4,
            resist: [
                ['slashing', 1],
                ['blunt', 1],
                ['piercing', 1]
            ],
            vulnerable: []
        },
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 3, 3],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "expert",
            requiredenv: "forgeandanvil_lit"
        }
    },
    ironboots: {
        id: 134,
        x: 6,
        y: 2,
        name: "铁靴",
        weight: 6,
        durability: 100,
        equip: "feet",
        defense: {
            base: 3,
            resist: [
                ['slashing', 1],
                ['blunt', 1],
                ['piercing', 1]
            ],
            vulnerable: []
        },
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 3, 3],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "expert",
            requiredenv: "forgeandanvil_lit"
        }
    },
    ironhelmet: {
        id: 135,
        x: 7,
        y: 2,
        name: "钢盔",
        weight: 4,
        durability: 100,
        equip: "head",
        defense: {
            base: 3,
            resist: [
                ['slashing', 1],
                ['blunt', 1],
                ['piercing', 1]
            ],
            vulnerable: []
        },
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 2, 2],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "expert",
            requiredenv: "forgeandanvil_lit"
        }
    },
    irongorget: {
        id: 136,
        x: 8,
        y: 2,
        name: "钢铁颈甲",
        weight: 3,
        durability: 100,
        equip: "neck",
        defense: {
            base: 2,
            resist: [
                ['slashing', 1],
                ['blunt', 1],
                ['piercing', 1]
            ],
            vulnerable: []
        },
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 2, 2],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    irongreaves: {
        id: 137,
        x: 9,
        y: 2,
        name: "铁渣",
        weight: 5,
        durability: 100,
        equip: "legs",
        defense: {
            base: 4,
            resist: [
                ['slashing', 1],
                ['blunt', 1],
                ['piercing', 1]
            ],
            vulnerable: []
        },
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 3, 3],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "expert",
            requiredenv: "forgeandanvil_lit"
        }
    },
    irongauntlets: {
        id: 138,
        x: 10,
        y: 2,
        name: "钢铁手套",
        weight: 4,
        durability: 100,
        equip: "hands",
        defense: {
            base: 2,
            resist: [
                ['slashing', 1],
                ['blunt', 1],
                ['piercing', 1]
            ],
            vulnerable: []
        },
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 2, 2],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "expert",
            requiredenv: "forgeandanvil_lit"
        }
    },
    ironshield: {
        id: 139,
        x: 11,
        y: 2,
        name: "钢盾",
        weight: 5,
        durability: 100,
        equip: "held",
        defense: {
            base: 3,
            resist: [
                ['slashing', 1],
                ['blunt', 1],
                ['piercing', 1]
            ],
            vulnerable: []
        },
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 3, 3],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "expert",
            requiredenv: "forgeandanvil_lit"
        }
    },
    sandstonewall: {
        id: 140,
        x: 12,
        y: 2,
        name: "沙墙",
        weight: 16,
        use: ["placeTile"],
        onUse: {
            placeTile: "sandstonewall"
        },
        recipe: {
            requires: [
                ["sandstone", 8, 8]
            ],
            skill: "stonecrafting",
            level: "advanced"
        },
        durability: 15
    },
    sandstonefloor: {
        id: 141,
        x: 13,
        y: 2,
        name: "砂岩地板",
        weight: 10,
        use: ["placeTile"],
        onUse: {
            placeTile: "sandstonefloor"
        },
        recipe: {
            requires: [
                ["sandstone", 5, 5]
            ],
            skill: "stonecrafting",
            level: "intermediate"
        },
        durability: 15
    },
    spidersilk: {
        id: 142,
        x: 14,
        y: 2,
        name: "蜘蛛丝",
        weight: 0.1,
        group: ["ropelike"]
    },
    animalfat: {
        id: 143,
        x: 15,
        y: 2,
        name: "动物油",
        weight: 0.8,
        use: ["eat", "stokeFire"],
        onUse: {
            eat: [0, -6, 2, -1],
            stokeFire: 1
        },
        group: ["fuellike"],
        decayable: [4750]
    },
    animalfattorch: {
        id: 144,
        x: 16,
        y: 2,
        name: "动物油火炬",
        weight: 1.5,
        durability: 25,
        equip: "held",
        attack: 1,
        damageType: ['blunt'],
        use: ["lightItem"],
        group: ["torchlike"],
        lit: "animalfattorch_lit",
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["animalfat", 1, 1],
                ["fabriclike", 1, 1]
            ],
            skill: "tinkering",
            level: "advanced"
        },
        onBurn: "charcoal"
    },
    clayflakes: {
        id: 145,
        x: 17,
        y: 2,
        name: "粘土片",
        weight: 0.9,
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["rawclay", 1, 1]
            ],
            skill: "claythrowing",
            level: "simple"
        }
    },
    greensand: {
        id: 146,
        x: 18,
        y: 2,
        name: "湿沙",
        weight: 3,
        recipe: {
            requires: [
                ["clayflakes", 1, 1],
                ["refinedsand", 2, 2]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    oldinstructionalscroll: {
        id: 147,
        x: 19,
        y: 2,
        name: "旧的指引卷轴",
        weight: 0.3,
        use: ["read"]
    },
    slimegelatin: {
        id: 148,
        x: 20,
        y: 2,
        name: "史莱姆凝胶",
        weight: 0.5,
        use: ["eat", "preserve"],
        group: ["preserve"],
        onUse: {
            eat: [-1, -2, 2, -1]
        },
        decayable: [4750]
    },
    glue: {
        id: 149,
        x: 21,
        y: 2,
        name: "胶水",
        weight: 0.4,
        use: ["reinforce"],
        recipe: {
            requires: [
                ["water", 1, 0],
                ["slimegelatin", 1, 1]
            ],
            skill: "alchemy",
            level: "advanced",
            requiredenv: "campfire_lit"
        },
        decayable: [750],
        group: ["reinforce"]
    },
    cookedspider: {
        id: 150,
        x: 22,
        y: 2,
        name: "熟蜘蛛",
        weight: 0.2,
        use: ["eat"],
        onUse: {
            eat: [3, 5, 2, 0]
        },
        recipe: {
            requires: [
                ["deadspider", 1, 1],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "intermediate",
            requiredenv: "firesource"
        },
        group: ["insect"],
        onBurn: "cookedspider",
        decayable: [4750, "rottenmeat"]
    },
    deadspider: {
        id: 151,
        x: 23,
        y: 2,
        name: "死蜘蛛",
        weight: 0.3,
        use: ["eat"],
        onUse: {
            eat: [-1, -2, 2, -1]
        },
        group: ["insect"],
        decayable: [4750, "rottenmeat"]
    },
    ironlockpick: {
        id: 152,
        x: 24,
        y: 2,
        name: "铁质撬锁工具",
        weight: 0.1,
        durability: 40,
        use: ["lockpick"],
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["ironingot", 1, 1],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        }
    },
    rottingvegetation: {
        id: 153,
        x: 25,
        y: 2,
        name: "腐烂的植物",
        group: ["compost"],
        weight: 0.8,
        use: ["eat"],
        onUse: {
            eat: [-10, -15, 1, -1]
        },
        decayable: [4750]
    },
    wildonion: {
        id: 154,
        x: 26,
        y: 2,
        name: "野生圆葱",
        weight: 0.6,
        use: ["eat", "plant"],
        skilluse: "botany",
        onUse: {
            eat: [4, 4, 3, 0],
            plant: "wildonion_ground"
        },
        decayable: [14000, "rottingvegetation"]
    },
    ironhammer: {
        id: 155,
        x: 27,
        y: 2,
        name: "铁锤",
        weight: 2,
        durability: 65,
        attack: 4,
        damageType: ['blunt'],
        equip: "held",
        group: ["hammerlike", "repair"],
        use: ["repair"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["talcumpowder", 1, 1],
                ["ironingot", 1, 1],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    ironspear: {
        id: 156,
        x: 28,
        y: 2,
        name: "铁矛",
        weight: 2,
        durability: 100,
        equip: "held",
        attack: 5,
        damageType: ['piercing'],
        group: ["utensil"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["talcumpowder", 1, 1],
                ["ironingot", 1, 1],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    ironshovel: {
        id: 157,
        x: 29,
        y: 2,
        name: "铁铲",
        weight: 2,
        durability: 200,
        equip: "held",
        attack: 4,
        damageType: ['slashing'],
        use: ["dig", "gatherTreasure"],
        recipe: {
            requires: [
                ["polelike", 2, 2],
                ["talcumpowder", 1, 1],
                ["ironingot", 1, 1],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    irondoubleaxe: {
        id: 158,
        x: 30,
        y: 2,
        name: "铁质双刃斧e",
        weight: 2,
        durability: 200,
        equip: "held",
        twoHanded: true,
        attack: 6,
        damageType: ['slashing'],
        group: ["sharpeneditem"],
        use: ["carve"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["talcumpowder", 1, 1],
                ["ironingot", 2, 2],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    ironpickaxe: {
        id: 159,
        x: 31,
        y: 2,
        name: "铁质丁字斧",
        weight: 2,
        durability: 200,
        equip: "held",
        attack: 6,
        damageType: ['blunt', 'piercing'],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["talcumpowder", 1, 1],
                ["ironingot", 1, 1],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0],
                ["tongs", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    torchstand: {
        id: 160,
        x: 32,
        y: 2,
        name: "放置火炬",
        weight: 5,
        use: ["build"],
        onUse: {
            build: "torchstand_unlit"
        },
        recipe: {
            requires: [
                ["torchlike", 1, 1],
                ["rocklike", 4, 4]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        onBurn: "charcoal",
        durability: 10
    },
    coconut: {
        id: 161,
        x: 33,
        y: 2,
        name: "椰子",
        weight: 1,
        use: ["eat"],
        onUse: {
            eat: [5, 5, 5, 4]
        },
        decayable: [8750, "rottingvegetation"]
    },
    palmleaf: {
        id: 162,
        x: 34,
        y: 2,
        name: "棕榈叶",
        weight: 0.3,
        group: ["ropelike"]
    },
    offal: {
        id: 163,
        x: 35,
        y: 2,
        name: "内脏",
        group: ["compost", "meat"],
        weight: 0.8,
        use: ["eat"],
        onUse: {
            eat: [-2, -6, 3, -1]
        },
        decayable: [750, "rottenmeat"]
    },
    bones: {
        id: 164,
        x: 36,
        y: 2,
        name: "骨骼",
        weight: 1.2,
        group: ["bonelike"]
    },
    poletorch_lit: {
        id: 165,
        x: 37,
        y: 2,
        name: "点燃的火炬",
        weight: 0.5,
        durability: 10,
        equip: "held",
        attack: 2,
        damageType: ['fire', 'blunt'],
        use: ["startFire"],
        revert: "woodenpole",
        onequip: ["Light Source", 6],
        decayable: [250, "ashpile"],
        onBurn: "charcoal"
    },
    cotton: {
        id: 166,
        x: 38,
        y: 2,
        name: "棉花",
        weight: 0.2
    },
    cottonseeds: {
        id: 167,
        x: 39,
        y: 2,
        name: "棉花种子",
        weight: 0.1,
        skilluse: "botany",
        use: ["plant"],
        onUse: {
            plant: "cotton_ground"
        },
        recipe: {
            requires: [
                ["cotton", 1, 1]
            ],
            skill: "tailoring",
            level: "simple"
        }
    },
    cottonfabric: {
        id: 168,
        x: 40,
        y: 2,
        name: "棉布",
        weight: 0.2,
        group: ["fabriclike"],
        recipe: {
            requires: [
                ["cotton", 3, 3]
            ],
            skill: "tailoring",
            level: "intermediate"
        }
    },
    bonepole: {
        id: 169,
        x: 41,
        y: 2,
        name: "骨杆",
        weight: 0.5,
        durability: 10,
        equip: "held",
        attack: 2,
        damageType: ['blunt'],
        group: ["polelike", "utensil"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["bonelike", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    tourniquet: {
        id: 170,
        x: 42,
        y: 2,
        name: "止血带",
        weight: 0.2,
        use: ["heal"],
        skilluse: "anatomy",
        onUse: {
            heal: [2, 0, 0, 0]
        },
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["string", 2, 2]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    wroughtironpickaxe: {
        id: 171,
        x: 43,
        y: 2,
        name: "熟铁丁字斧",
        weight: 2,
        durability: 75,
        equip: "held",
        attack: 5,
        damageType: ['blunt', 'piercing'],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtirondoubleaxe: {
        id: 172,
        x: 44,
        y: 2,
        name: "熟铁双刃斧",
        weight: 2,
        durability: 75,
        equip: "held",
        twoHanded: true,
        attack: 5,
        damageType: ['slashing'],
        group: ["sharpeneditem"],
        use: ["carve"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["wroughtiron", 2, 2],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironshovel: {
        id: 173,
        x: 45,
        y: 2,
        name: "熟铁铁铲",
        weight: 2,
        durability: 75,
        equip: "held",
        attack: 3,
        damageType: ['slashing'],
        use: ["dig", "gatherTreasure"],
        recipe: {
            requires: [
                ["polelike", 2, 2],
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironspear: {
        id: 174,
        x: 46,
        y: 2,
        name: "熟铁长矛",
        weight: 2,
        durability: 35,
        equip: "held",
        attack: 4,
        damageType: ['piercing'],
        group: ["utensil"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironhammer: {
        id: 175,
        x: 47,
        y: 2,
        name: "熟铁铁锤",
        weight: 2,
        durability: 30,
        equip: "held",
        attack: 3,
        damageType: ['blunt'],
        group: ["hammerlike", "repair"],
        use: ["repair"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironlockpick: {
        id: 176,
        x: 48,
        y: 2,
        name: "熟铁撬锁工具",
        weight: 0.1,
        durability: 15,
        use: ["lockpick"],
        recipe: {
            requires: [
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "simple",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironshield: {
        id: 177,
        x: 49,
        y: 2,
        name: "熟铁盾牌",
        weight: 5,
        durability: 35,
        equip: "held",
        defense: {
            base: 2,
            resist: [
                ['slashing', 1],
                ['piercing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        recipe: {
            requires: [
                ["wroughtiron", 3, 3],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtirongauntlets: {
        id: 178,
        x: 50,
        y: 2,
        name: "熟铁手套",
        weight: 4,
        durability: 35,
        equip: "hands",
        defense: {
            base: 1,
            resist: [
                ['slashing', 1],
                ['piercing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        recipe: {
            requires: [
                ["wroughtiron", 2, 2],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtirongreaves: {
        id: 179,
        x: 51,
        y: 2,
        name: "熟铁残渣",
        weight: 5,
        durability: 35,
        equip: "legs",
        defense: {
            base: 3,
            resist: [
                ['slashing', 1],
                ['piercing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        recipe: {
            requires: [
                ["wroughtiron", 3, 3],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtirongorget: {
        id: 180,
        x: 52,
        y: 2,
        name: "熟铁颈甲",
        weight: 3,
        durability: 35,
        equip: "neck",
        defense: {
            base: 1,
            resist: [
                ['slashing', 1],
                ['piercing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        recipe: {
            requires: [
                ["wroughtiron", 2, 2],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironhelmet: {
        id: 181,
        x: 53,
        y: 2,
        name: "熟铁头盔",
        weight: 4,
        durability: 35,
        equip: "head",
        defense: {
            base: 2,
            resist: [
                ['slashing', 1],
                ['piercing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        recipe: {
            requires: [
                ["wroughtiron", 2, 2],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironboots: {
        id: 182,
        x: 54,
        y: 2,
        name: "熟铁长靴",
        weight: 6,
        durability: 35,
        equip: "feet",
        defense: {
            base: 2,
            resist: [
                ['slashing', 1],
                ['piercing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        recipe: {
            requires: [
                ["wroughtiron", 3, 3],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironbreastplate: {
        id: 183,
        x: 55,
        y: 2,
        name: "熟铁胸甲",
        weight: 6,
        durability: 35,
        equip: "chest",
        defense: {
            base: 3,
            resist: [
                ['slashing', 1],
                ['piercing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        recipe: {
            requires: [
                ["wroughtiron", 3, 3],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    wroughtironsword: {
        id: 184,
        x: 56,
        y: 2,
        name: "熟铁长剑",
        weight: 4,
        durability: 35,
        equip: "held",
        attack: 6,
        damageType: ['piercing', 'slashing'],
        group: ["sharpeneditem"],
        use: ["carve"],
        recipe: {
            requires: [
                ["wroughtiron", 2, 2],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "advanced",
            requiredenv: "forgeandanvil_lit"
        }
    },
    woodenwall: {
        id: 185,
        x: 57,
        y: 2,
        name: "木墙",
        weight: 15,
        use: ["placeTile"],
        onUse: {
            placeTile: "woodenwall"
        },
        recipe: {
            requires: [
                ["log", 3, 3],
                ["sharpeneditem", 1, 0]
            ],
            skill: "woodworking",
            level: "intermediate"
        },
        durability: 15
    },
    woodenfloor: {
        id: 186,
        x: 58,
        y: 2,
        name: "木质地板",
        weight: 10,
        use: ["placeTile"],
        onUse: {
            placeTile: "woodenfloor"
        },
        recipe: {
            requires: [
                ["log", 2, 2],
                ["sharpeneditem", 1, 0]
            ],
            skill: "woodworking",
            level: "advanced"
        },
        durability: 15
    },
    woodendoor: {
        id: 187,
        x: 59,
        y: 2,
        name: "木门",
        weight: 15,
        use: ["placeTile"],
        onUse: {
            placeTile: "woodendoor"
        },
        recipe: {
            requires: [
                ["log", 3, 3],
                ["sharpeneditem", 1, 0]
            ],
            skill: "woodworking",
            level: "expert"
        },
        durability: 15
    },
    fishingrod: {
        id: 188,
        x: 60,
        y: 2,
        name: "鱼竿",
        weight: 2,
        durability: 20,
        equip: "held",
        attack: 1,
        damageType: ['slashing'],
        ranged: {
            range: 5,
            attack: 0
        },
        use: ["fishing"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["string", 1, 1],
                ["needlelike", 1, 1],
                ["insect", 1, 1]
            ],
            skill: "tinkering",
            level: "intermediate"
        }
    },
    messageinabottle: {
        id: 189,
        x: 61,
        y: 2,
        name: "唱片",
        weight: 2,
        use: ["openBottle"]
    },
    carbonpowder: {
        id: 190,
        x: 62,
        y: 2,
        name: "碳粉",
        weight: 0.2,
        recipe: {
            requires: [
                ["mortarandpestle", 1, 0],
                ["carbons", 1, 1]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    pileofcompost: {
        id: 191,
        x: 63,
        y: 2,
        name: "堆肥",
        weight: 2,
        use: ["garden"],
        onUse: {
            garden: 4
        },
        recipe: {
            requires: [
                ["compost", 2, 2],
                ["soil", 1, 1]
            ],
            skill: "botany",
            level: "intermediate"
        }
    },
    meltedamber: {
        id: 192,
        x: 0,
        y: 3,
        name: "融化的琥珀",
        weight: 0.4,
        use: ["reinforce"],
        recipe: {
            requires: [
                ["amber", 1, 1]
            ],
            skill: "alchemy",
            level: "simple",
            requiredenv: "firesource"
        },
        decayable: [100, "amber"],
        group: ["reinforce"]
    },
    tinder: {
        id: 193,
        x: 1,
        y: 3,
        name: "火绒",
        weight: 0.2,
        use: ["stokeFire"],
        onUse: {
            stokeFire: 1
        },
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["twigs", 1, 1]
            ],
            skill: "camping",
            level: "simple"
        }
    },
    deadfall: {
        id: 194,
        x: 2,
        y: 3,
        name: "陷阱",
        weight: 5,
        use: ["build"],
        onUse: {
            build: "deadfall_set"
        },
        recipe: {
            requires: [
                ["polelike", 3, 3],
                ["largerock", 1, 1]
            ],
            skill: "trapping",
            level: "simple"
        },
        durability: 5
    },
    snare: {
        id: 195,
        x: 3,
        y: 3,
        name: "圈套",
        weight: 2,
        use: ["build"],
        onUse: {
            build: "snare_set"
        },
        recipe: {
            requires: [
                ["polelike", 2, 2],
                ["string", 1, 1]
            ],
            skill: "trapping",
            level: "simple"
        },
        durability: 5
    },
    medicinalwaterwaterskin: {
        id: 196,
        x: 4,
        y: 3,
        name: "装满药水的革制水袋",
        weight: 2,
        use: ["cure"],
        onUse: {
            cure: [3, 8, 1, 9]
        },
        recipe: {
            requires: [
                ["medicinal", 1, 1],
                ["potablewaterskin", 1, 1]
            ],
            skill: "alchemy",
            level: "intermediate"
        },
        durability: 20,
        returnOnUse: "waterskin"
    },
    charcoalbandage: {
        id: 197,
        x: 5,
        y: 3,
        name: "木炭绷带",
        weight: 0.5,
        use: ["cure"],
        onUse: {
            cure: [14, 0, 0, 0]
        },
        recipe: {
            requires: [
                ["bandage", 1, 1],
                ["charcoal", 1, 1]
            ],
            skill: "tinkering",
            level: "advanced"
        }
    },
    woodentongs: {
        id: 198,
        x: 6,
        y: 3,
        name: "木钳",
        weight: 0.5,
        recipe: {
            requires: [
                ["woodenpole", 1, 1],
                ["string", 1, 1],
                ["sharpeneditem", 1, 0]
            ],
            skill: "tinkering",
            level: "intermediate"
        },
        group: ["tongs", "utensil"],
        durability: 10
    },
    wroughtirontongs: {
        id: 199,
        x: 7,
        y: 3,
        name: "熟铁钳",
        weight: 0.5,
        recipe: {
            requires: [
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "simple",
            requiredenv: "forgeandanvil_lit"
        },
        group: ["tongs", "utensil"],
        durability: 15
    },
    sheetofglass: {
        id: 200,
        x: 8,
        y: 3,
        name: "一片玻璃",
        weight: 3,
        recipe: {
            requires: [
                ["tongs", 1, 0],
                ["refinedsand", 3, 3],
                ["limestonepowder", 1, 1]
            ],
            skill: "glassblowing",
            level: "advanced",
            requiredenv: "furnace_lit"
        }
    },
    solarstill: {
        id: 201,
        x: 9,
        y: 3,
        name: "太阳能蒸馏器",
        weight: 5,
        use: ["build"],
        onUse: {
            build: "solarstill_set"
        },
        recipe: {
            requires: [
                ["sheetofglass", 1, 1],
                ["container", 1, 1]
            ],
            skill: "tinkering",
            level: "advanced"
        },
        durability: 10
    },
    stonewaterstill: {
        id: 202,
        x: 10,
        y: 3,
        name: "石质蒸水器",
        weight: 9,
        use: ["build"],
        onUse: {
            build: "stonewaterstill_unlit"
        },
        recipe: {
            requires: [
                ["rocklike", 3, 3],
                ["sharpeneditem", 1, 0],
                ["string", 1, 1],
                ["polelike", 1, 1],
                ["container", 1, 1]
            ],
            skill: "stonecrafting",
            level: "advanced"
        },
        durability: 15
    },
    sundial: {
        id: 203,
        x: 11,
        y: 3,
        name: "日冕",
        weight: 2,
        use: ["tellTime"],
        recipe: {
            requires: [
                ["smoothrock", 1, 1],
                ["largerock", 1, 1],
                ["sharpenedrock", 1, 1]
            ],
            skill: "stonecrafting",
            level: "intermediate"
        },
        durability: 50
    },
    animalfattorch_lit: {
        id: 204,
        x: 12,
        y: 3,
        name: "一小个动物油点燃的火炬",
        weight: 1.5,
        durability: 25,
        equip: "held",
        attack: 3,
        damageType: ['fire', 'blunt'],
        use: ["startFire"],
        onequip: ["Light Source", 8],
        revert: "animalfattorch",
        decayable: [3500, "ashpile"],
        onBurn: "charcoal"
    },
    sinew: {
        id: 205,
        x: 13,
        y: 3,
        name: "蹄筋",
        weight: 0.4,
        group: ["ropelike"],
        recipe: {
            requires: [
                ["offal", 1, 1],
                ["sharpeneditem", 1, 0]
            ],
            skill: "fletching",
            level: "simple"
        }
    },
    shortbow: {
        id: 206,
        x: 14,
        y: 3,
        name: "短弓",
        weight: 1.2,
        durability: 25,
        use: ["shoot"],
        equip: "held",
        twoHanded: true,
        attack: 2,
        damageType: ['blunt'],
        ranged: {
            range: 4,
            attack: 3
        },
        recipe: {
            requires: [
                ["woodenpole", 1, 1],
                ["sinew", 1, 1]
            ],
            skill: "fletching",
            level: "advanced"
        }
    },
    longbow: {
        id: 207,
        x: 15,
        y: 3,
        name: "长弓",
        weight: 1.8,
        durability: 30,
        use: ["shoot"],
        equip: "held",
        twoHanded: true,
        attack: 2,
        damageType: ['blunt'],
        ranged: {
            range: 8,
            attack: 5
        },
        recipe: {
            requires: [
                ["woodenpole", 1, 1],
                ["sinew", 2, 2],
                ["glue", 1, 1]
            ],
            skill: "fletching",
            level: "advanced"
        }
    },
    compositebow: {
        id: 208,
        x: 16,
        y: 3,
        name: "复合弓",
        weight: 2.2,
        durability: 65,
        use: ["shoot"],
        equip: "held",
        twoHanded: true,
        attack: 3,
        damageType: ['blunt'],
        ranged: {
            range: 5,
            attack: 7
        },
        recipe: {
            requires: [
                ["woodenpole", 2, 2],
                ["sinew", 2, 2],
                ["glue", 1, 1],
                ["water", 1, 0]
            ],
            skill: "fletching",
            level: "expert",
            requiredenv: "campfire_lit"
        }
    },
    purifiedfreshwaterwaterskin: {
        id: 209,
        x: 17,
        y: 3,
        name: "装满纯净水的革制水袋",
        weight: 2,
        use: ["drink", "pour"],
        onUse: {
            drink: [2, 15, 1, 10]
        },
        recipe: {
            requires: [
                ["unpurifiedfreshwaterwaterskin", 1, 1]
            ],
            skill: "alchemy",
            level: "simple",
            requiredenv: "campfire_lit"
        },
        durability: 20,
        group: ["water", "potablewaterskin"],
        returnOnUse: "waterskin"
    },
    unpurifiedfreshwaterwaterskin: {
        id: 210,
        x: 18,
        y: 3,
        name: "装满未净化的淡水",
        weight: 2,
        use: ["drink", "pour"],
        onUse: {
            drink: [-4, 8, 1, 8]
        },
        recipe: {
            requires: [
                ["pileofsnow", 1, 1],
                ["waterskin", 1, 1]
            ],
            skill: "alchemy",
            level: "simple"
        },
        durability: 20,
        group: ["water"],
        returnOnUse: "waterskin"
    },
    glassbottle: {
        id: 211,
        x: 19,
        y: 3,
        name: "玻璃瓶",
        weight: 0.8,
        use: ["fillWater"],
        recipe: {
            requires: [
                ["clayblowpipe", 1, 0],
                ["refinedsand", 2, 2],
                ["limestonepowder", 1, 1],
                ["cork", 1, 1]
            ],
            skill: "glassblowing",
            level: "advanced",
            requiredenv: "furnace_lit"
        },
        durability: 25,
        group: ["container"]
    },
    cork: {
        id: 212,
        x: 20,
        y: 3,
        name: "软木塞",
        weight: 0.2,
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["treebark", 1, 1]
            ],
            skill: "woodworking",
            level: "simple"
        }
    },
    seawaterglassbottle: {
        id: 213,
        x: 21,
        y: 3,
        name: "装满海水的玻璃瓶",
        weight: 2,
        use: ["drink", "pour"],
        onUse: {
            drink: [0, -15, 1, -2]
        },
        durability: 25,
        group: ["water"],
        returnOnUse: "glassbottle"
    },
    desalinatedwaterglassbottle: {
        id: 214,
        x: 22,
        y: 3,
        name: "装满淡水的玻璃瓶",
        weight: 2,
        use: ["drink", "pour"],
        onUse: {
            drink: [2, 15, 1, 10]
        },
        recipe: {
            requires: [
                ["flask", 1, 0],
                ["seawaterglassbottle", 1, 1]
            ],
            skill: "alchemy",
            level: "simple",
            requiredenv: "campfire_lit"
        },
        durability: 25,
        group: ["water", "potablebottle"],
        returnOnUse: "glassbottle"
    },
    medicinalwaterglassbottle: {
        id: 215,
        x: 23,
        y: 3,
        name: "装满药水的玻璃瓶",
        weight: 2,
        use: ["cure"],
        onUse: {
            cure: [3, 8, 1, 9]
        },
        recipe: {
            requires: [
                ["medicinal", 1, 1],
                ["potablebottle", 1, 1]
            ],
            skill: "alchemy",
            level: "intermediate"
        },
        durability: 25,
        returnOnUse: "glassbottle"
    },
    purifiedfreshwaterglassbottle: {
        id: 216,
        x: 24,
        y: 3,
        name: "装满纯净水的玻璃瓶",
        weight: 2,
        use: ["drink", "pour"],
        onUse: {
            drink: [2, 15, 1, 10]
        },
        recipe: {
            requires: [
                ["unpurifiedfreshwaterglassbottle", 1, 1]
            ],
            skill: "alchemy",
            level: "simple",
            requiredenv: "campfire_lit"
        },
        durability: 25,
        group: ["water", "potablebottle"],
        returnOnUse: "glassbottle"
    },
    unpurifiedfreshwaterglassbottle: {
        id: 217,
        x: 25,
        y: 3,
        name: "装满未净化淡水的玻璃瓶",
        weight: 2,
        use: ["drink", "pour"],
        onUse: {
            drink: [-4, 8, 1, 8]
        },
        recipe: {
            requires: [
                ["pileofsnow", 1, 1],
                ["glassbottle", 1, 1]
            ],
            skill: "alchemy",
            level: "simple"
        },
        durability: 25,
        group: ["water"],
        returnOnUse: "glassbottle"
    },
    wroughtironarrow: {
        id: 218,
        x: 26,
        y: 3,
        name: "熟铁箭",
        weight: 0.9,
        group: ["arrow"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["feather", 1, 1],
                ["wroughtironarrowhead", 1, 1],
                ["string", 1, 1]
            ],
            skill: "fletching",
            level: "advanced"
        },
        attack: 3,
        damageType: ['piercing'],
        durability: 20
    },
    ironarrow: {
        id: 219,
        x: 27,
        y: 3,
        name: "铁箭",
        weight: 1,
        group: ["arrow"],
        recipe: {
            requires: [
                ["polelike", 1, 1],
                ["feather", 1, 1],
                ["ironarrowhead", 1, 1],
                ["string", 1, 1]
            ],
            skill: "fletching",
            level: "expert"
        },
        attack: 4,
        damageType: ['piercing'],
        durability: 50
    },
    stonebullet: {
        id: 220,
        x: 28,
        y: 3,
        name: "石弹",
        weight: 0.2,
        group: ["bullet"],
        recipe: {
            requires: [
                ["sharpeneditem", 1, 0],
                ["smoothrock", 1, 1]
            ],
            skill: "stonecrafting",
            level: "intermediate"
        },
        attack: 1,
        damageType: ['blunt'],
        durability: 10
    },
    wroughtironbullet: {
        id: 221,
        x: 29,
        y: 3,
        name: "熟铁子弹",
        weight: 0.3,
        group: ["bullet"],
        recipe: {
            requires: [
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "simple",
            requiredenv: "forgeandanvil_lit"
        },
        attack: 2,
        damageType: ['blunt'],
        durability: 15
    },
    ironbullet: {
        id: 222,
        x: 30,
        y: 3,
        name: "铁子弹",
        weight: 0.4,
        group: ["bullet"],
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        },
        attack: 3,
        damageType: ['blunt'],
        durability: 50
    },
    leatherquiver: {
        id: 223,
        x: 31,
        y: 3,
        name: "皮革箭袋",
        weight: 1.8,
        container: true,
        maxWeight: 25,
        use: ["openContainer"],
        equip: "back",
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 2, 2],
                ["string", 2, 2]
            ],
            skill: "leatherworking",
            level: "intermediate"
        }
    },
    ectoplasm: {
        id: 224,
        x: 32,
        y: 3,
        name: "外胚质层",
        weight: 0,
        decayable: [25]
    },
    magicalessence: {
        id: 225,
        x: 33,
        y: 3,
        name: "神奇的精华",
        weight: 0.3,
        use: ["transmogrify"],
        decayable: [100],
        recipe: {
            requires: [
                ["ashpile", 1, 1],
                ["offal", 1, 1],
                ["ectoplasm", 1, 1]
            ],
            skill: "alchemy",
            level: "expert"
        },
        group: ["transmogrify"]
    },
    woodenfence: {
        id: 226,
        x: 34,
        y: 3,
        name: "木栅栏",
        weight: 12.5,
        use: ["build"],
        onUse: {
            build: "woodenfence"
        },
        recipe: {
            requires: [
                ["log", 3, 3],
                ["sharpeneditem", 1, 0]
            ],
            skill: "woodworking",
            level: "intermediate"
        },
        durability: 10
    },
    monsteridol: {
        id: 227,
        x: 35,
        y: 3,
        name: "怪物偶像",
        weight: 3,
        use: ["build"],
        onUse: {
            build: "monsteridol"
        }
    },
    cordedsling: {
        id: 228,
        x: 36,
        y: 3,
        name: "吊绳",
        weight: 0.5,
        durability: 20,
        use: ["sling"],
        equip: "held",
        twoHanded: true,
        attack: 1,
        damageType: ['blunt'],
        ranged: {
            range: 4,
            attack: 1
        },
        recipe: {
            requires: [
                ["string", 4, 4]
            ],
            skill: "fletching",
            level: "intermediate"
        }
    },
    leathersling: {
        id: 229,
        x: 37,
        y: 3,
        name: "皮革吊绳",
        weight: 0.9,
        durability: 40,
        use: ["sling"],
        equip: "held",
        twoHanded: true,
        attack: 2,
        damageType: ['blunt'],
        ranged: {
            range: 5,
            attack: 2
        },
        recipe: {
            requires: [
                ["needlelike", 1, 0],
                ["tannedleather", 1, 1],
                ["string", 4, 4]
            ],
            skill: "fletching",
            level: "advanced"
        }
    },
    wroughtironarrowhead: {
        id: 230,
        x: 38,
        y: 3,
        name: "熟铁箭头",
        weight: 0.4,
        group: ["sharpeneditem"],
        use: ["carve"],
        recipe: {
            requires: [
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0]
            ],
            skill: "blacksmithing",
            level: "simple",
            requiredenv: "forgeandanvil_lit"
        }
    },
    ironarrowhead: {
        id: 231,
        x: 39,
        y: 3,
        name: "铁箭头",
        weight: 0.5,
        group: ["sharpeneditem"],
        use: ["carve"],
        recipe: {
            requires: [
                ["talcumpowder", 1, 1],
                ["wroughtiron", 1, 1],
                ["hammerlike", 1, 0],
                ["sandcastflask", 1, 0]
            ],
            skill: "blacksmithing",
            level: "intermediate",
            requiredenv: "forgeandanvil_lit"
        }
    },
    hammock: {
        id: 232,
        x: 40,
        y: 3,
        name: "吊床",
        use: ["rest", "sleep"],
        durability: 25,
        weight: 2.2,
        recipe: {
            requires: [
                ["rope", 3, 3],
                ["string", 2, 2]
            ],
            skill: "camping",
            level: "advanced"
        }
    },
    cottonbedroll: {
        id: 233,
        x: 41,
        y: 3,
        name: "棉花铺盖",
        use: ["rest", "sleep"],
        durability: 75,
        weight: 1,
        recipe: {
            requires: [
                ["cottonfabric", 1, 1],
                ["cotton", 4, 4],
                ["needlelike", 1, 0],
                ["string", 1, 1]
            ],
            skill: "tailoring",
            level: "advanced"
        }
    },
    featherbedroll: {
        id: 234,
        x: 42,
        y: 3,
        name: "羽毛铺盖",
        use: ["rest", "sleep"],
        durability: 50,
        weight: 1.2,
        recipe: {
            requires: [
                ["wovenfabric", 1, 1],
                ["feather", 8, 8],
                ["needlelike", 1, 0],
                ["string", 1, 1]
            ],
            skill: "tailoring",
            level: "intermediate"
        }
    },
    rawtaintedmeat: {
        id: 235,
        x: 43,
        y: 3,
        name: "被污染的生肉",
        weight: 0.9,
        use: ["eat"],
        onUse: {
            eat: [-8, 1, 7, -3]
        },
        decayable: [750, "rottenmeat"],
        onBurn: "cookedtaintedmeat",
        group: ["meat"]
    },
    cookedtaintedmeat: {
        id: 236,
        x: 44,
        y: 3,
        name: "煮熟的有毒肉",
        weight: 0.9,
        use: ["eat"],
        onUse: {
            eat: [-4, 2, 8, -2]
        },
        decayable: [1750, "rottenmeat"],
        recipe: {
            requires: [
                ["rawtaintedmeat", 1, 1],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "intermediate",
            requiredenv: "firesource"
        },
        group: ["meat"]
    },
    stoneknife: {
        id: 237,
        x: 45,
        y: 3,
        name: "石匕首",
        weight: 0.7,
        durability: 20,
        equip: "held",
        attack: 1,
        damageType: ['slashing'],
        group: ["sharpeneditem"],
        use: ["carve"],
        recipe: {
            requires: [
                ["sharpenedrock", 2, 2]
            ],
            skill: "stonecrafting",
            level: "simple"
        }
    },
    rawblindfish: {
        id: 238,
        x: 46,
        y: 3,
        name: "生盲鱼",
        weight: 0.8,
        use: ["eat"],
        onUse: {
            eat: [0, 2, 4, -1]
        },
        decayable: [2500, "rottenmeat"],
        onBurn: "cookedblindfish",
        group: ["meat"]
    },
    cookedblindfish: {
        id: 239,
        x: 47,
        y: 3,
        name: "熟盲鱼",
        weight: 0.7,
        use: ["eat"],
        onUse: {
            eat: [1, 5, 5, -1]
        },
        decayable: [4500, "rottenmeat"],
        recipe: {
            requires: [
                ["rawblindfish", 1, 1],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "simple",
            requiredenv: "firesource"
        },
        group: ["meat"]
    },
    pemmican: {
        id: 240,
        x: 48,
        y: 3,
        name: "干肉饼",
        weight: 0.3,
        recipe: {
            requires: [
                ["meat", 2, 2],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "intermediate",
            requiredenv: "firesource"
        }
    },
    preparedpemmican: {
        id: 241,
        x: 49,
        y: 3,
        name: "精制干肉饼",
        weight: 0.6,
        use: ["eat"],
        onUse: {
            eat: [1, 6, 6, -2]
        },
        decayable: [5250, "rottenmeat"],
        recipe: {
            requires: [
                ["pemmican", 1, 1],
                ["animalfat", 1, 1],
                ["utensil", 1, 0]
            ],
            skill: "cooking",
            level: "advanced",
            requiredenv: "firesource"
        }
    },
    sail: {
        id: 242,
        x: 50,
        y: 3,
        name: "帆",
        weight: 0.8,
        recipe: {
            requires: [
                ["fabriclike", 3, 3],
                ["string", 3, 3],
                ["needlelike", 1, 0]
            ],
            skill: "tailoring",
            level: "advanced"
        }
    },
    sailboat: {
        id: 243,
        x: 51,
        y: 3,
        name: "帆船",
        weight: 18,
        use: ["sailHome"],
        recipe: {
            requires: [
                ["sail", 1, 1],
                ["boatpaddle", 1, 1],
                ["rope", 2, 2],
                ["log", 3, 3],
                ["sharpeneditem", 1, 0]
            ],
            skill: "woodworking",
            level: "expert"
        },
        onBurn: "charcoal"
    },
    egg: {
        id: 244,
        x: 52,
        y: 3,
        name: "鸡蛋",
        weight: 0.1,
        use: ["eat"],
        onUse: {
            eat: [-1, 6, 3, 1]
        },
        decayable: [9250]
    },
    boiledegg: {
        id: 245,
        x: 53,
        y: 3,
        name: "水煮蛋",
        weight: 0.1,
        use: ["eat"],
        onUse: {
            eat: [2, 6, 3, 0]
        },
        decayable: [5250],
        recipe: {
            requires: [
                ["egg", 1, 1],
                ["utensil", 1, 0],
                ["water", 1, 0]
            ],
            skill: "cooking",
            level: "intermediate",
            requiredenv: "firesource"
        }
    },
    grassblades: {
        id: 246,
        x: 54,
        y: 3,
        name: "小叶子",
        weight: 0.1,
        group: ["compost", "ropelike"],
        use: ["stokeFire"]
    },
    niter: {
        id: 247,
        x: 55,
        y: 3,
        name: "硝石",
        weight: 0.4
    },
    saltpeter: {
        id: 248,
        x: 56,
        y: 3,
        name: "硝酸钾",
        use: ["preserve"],
        group: ["preserve"],
        weight: 0.3,
        recipe: {
            requires: [
                ["niter", 1, 1],
                ["mortarandpestle", 1, 0]
            ],
            skill: "tinkering",
            level: "simple"
        }
    },
    blackpowder: {
        id: 249,
        x: 57,
        y: 3,
        name: "黑火药",
        weight: 0.3,
        recipe: {
            requires: [
                ["saltpeter", 1, 1],
                ["carbonpowder", 1, 1],
                ["mortarandpestle", 1, 0]
            ],
            skill: "tinkering",
            level: "advanced"
        }
    },
    flintlockpistol: {
        id: 250,
        x: 58,
        y: 3,
        name: "弗林特锁手枪",
        weight: 0.9,
        durability: 40,
        use: ["fire"],
        equip: "held",
        attack: 3,
        damageType: ['blunt'],
        ranged: {
            range: 8,
            attack: 7
        }
    }
};

var groups = {
    sharpeneditem: {
        name: "尖锐的"
    },
    polelike: {
        name: "杆"
    },
    rocklike: {
        name: "石头"
    },
    fuellike: {
        name: "油"
    },
    needlelike: {
        name: "针"
    },
    hammerlike: {
        name: "铁锤"
    },
    torchlike: {
        name: "光源"
    },
    bonelike: {
        name: "骨骼"
    },
    fabriclike: {
        name: "面料"
    },
    ropelike: {
        name: "绳索"
    },
    insect: {
        name: "昆虫"
    },
    carbons: {
        name: "碳"
    },
    compost: {
        name: "堆肥"
    },
    medicinal: {
        name: "药水"
    },
    tongs: {
        name: "钳子"
    },
    water: {
        name: "水"
    },
    potablewaterskin: {
        name: "装满饮用水的革制水袋"
    },
    potablebottle: {
        name: "装满饮用水的玻璃瓶"
    },
    container: {
        name: "容器"
    },
    arrow: {
        name: "箭"
    },
    bullet: {
        name: "子弹"
    },
    sharpenedrock: {
        name: "尖锐的岩石"
    },
    utensil: {
        name: "器皿"
    },
    meat: {
        name: "肉"
    },
    treasure: {
        name: "财宝"
    },
    repair: {
        name: "维修"
    },
    transmogrify: {
        name: "变形"
    },
    reinforce: {
        name: "加强"
    },
    preserve: {
        name: "腌制"
    }
};

var descriptions = {
    rest: {
        name: "休息",
        description: "休息一段时间可以恢复你的健康和耐力，恢复时间基于你的野营技巧等级，当恢复体力达到最大时，将自动停止."
    },
    sleep: {
        name: "睡觉",
        description: "睡上一段时间便可以恢复你的健康和耐力，持续时间将基于你野营技巧等级和所消耗的时间， 对面临火灾和被点燃的目标时将给予额外的影响奖励(包括持续时间) ，当睡觉时，你的饥饿感和口渴程度将会缓慢地增长."
    },
    eat: {
        name: "吃",
        description: "当使用时，消耗食物，减少饥饿，和口渴的程度，也会恢复你的健康和耐力."
    },
    drink: {
        name: "喝",
        description: "当使用时，会消耗饮水，并减少口渴程度，但当你饮用海水或不干净的饮水时将会得到一个负面的状态BUFF."
    },
    carve: {
        name: "切开",
        description: "用于切开动物的尸体或将附在地面上的东西切除."
    },
    dig: {
        name: "挖",
        description: "用于挖掘资源或从地下挖掘物品."
    },
    fishing: {
        name: "投掷",
        description: "找到一条水中的鱼，并尝试投下你的钓线或网可以捕捉到它."
    },
    shoot: {
        name: "射击",
        description: "你可以用这个物品进行射箭."
    },
    placeTile: {
        name: "放下",
        description: "使用这个物品，并将在顶部的砖面向在你面对的方向.这是不同于只是将它落下，它也可以用于灭火."
    },
    sling: {
        name: "吊起",
        description: "你可以把子弹吊在这个物品上."
    },
    raft: {
        name: "漂流",
        description: "用于快速穿越其他岛屿在当前区域的方向."
    },
    startFire: {
        name: "放火",
        description: "用来生火.这不能用于一些非干瓷砖和没有燃料的情况下.可以用于点燃篝火、 炉、 窑等.使用此操作需要消耗你库存中的需要点燃火种、 燃料等类似物品，视情况而定."
    },
    fillWater: {
        name: "收集水",
        description: "用于将水收集到物品中."
    },
    lockpick: {
        name: "撬锁",
        description: "用于打开锁住的箱子."
    },
    repair: {
        name: "维修",
        description: "用于打开锁住的箱子."
    },
    heal: {
        name: "治疗",
        description: "使用消耗物品，用于恢复不同程度的健康."
    },
    travel: {
        name: "旅行",
        description: "用于旅行到新的、 未开发的土地，并留下你当前的周围坏境."
    },
    look: {
        name: "观察",
        description: "用于观看你远离当前面对方向的完整地图，并显示在你的小地图上."
    },
    decode: {
        name: "解码",
        description: "用于尝试来解读地图.解读宝藏位置离你所在方位多远或者在你附近.使用时将可以所面朝的方向的确切地点进行挖宝."
    },
    lightItem: {
        name: "点燃",
        description: "使用物品在火源上，并让它开始着火."
    },
    read: {
        name: "阅读",
        description: "使用消耗物品,阅读可以提供有用的知识."
    },
    reinforce: {
        name: "加强",
        description: "使用消耗物品，可以使损坏的物品得到强化，试图增加其总体最高和最低的耐久性，成功率基于用于该物品的技能等级."
    },
    openContainer: {
        name: "打开容器",
        description: "你可以使用并打开它，或把物品从里面拖出，减少重量和减少奖金同样也适用于里面的物品."
    },
    openBottle: {
        name: "打开",
        description: "使用消耗物品.使用之后会打开它，可能会提供新的和未知的新物品."
    },
    cure: {
        name: "治疗",
        description: "使用消耗物品. 用来治疗中毒或燃烧的痛苦，同时有时会提供其他的健康益处."
    },
    tellTime: {
        name: "报时",
        description: "用于测量白天或晚上的时间."
    },
    transmogrify: {
        name: "变形",
        description: "对于一个可装备的物品使用，注入魔力，并赋予装备神奇的属性."
    },
    stokeFire: {
        name: "引发火灾",
        description: "用于火源，并增加火焰的力量."
    },
    pour: {
        name: "倾倒",
        description: "将它倒在火上可以熄灭火焰， 倒出里面的水，可以过滤水中的杂质,倒在合适的植物上可以增加植物的健康，旺盛的生长，或者只是简单的把里面的水倒出，空出来而已."
    },
    plant: {
        name: "种植",
        description: "试图种植他们，在你面朝的方向. 有些植物可能需要某些特殊的地面类型或条件被种植."
    },
    garden: {
        name: "栽培",
        description: "在种植地区使用，可以提高其肥力.只可在某些植物类型."
    },
    build: {
        name: "建造",
        description: "试图建造或组装你面朝方向的物品."
    },
    gatherTreasure: {
        name: "收集财宝",
        description: "试图将收集解码藏宝图使用附近的宝藏.收集的范围取决于你的采矿技能."
    },
    sailHome: {
        name: "驾舟还家",
        description: "收集足够的宝藏后, 可以返回家园并沉浸于你的财富和名声的荣耀或开始新的冒险!"
    },
    preserve: {
        name: "腌制",
        description: "与食品一起使用，可以延长其寿命及延缓其衰变的速度."
    },
    fire: {
        name: "火",
        description: "使用一个黑色的粉末混合物子弹，你可以使用武器射击."
    }
};

var lootgroup = {
    low: ["stoneaxe", "woodenspear", "barktunic", "barkleggings", "barkshield", "skullcap", "leather", "string", "stoneshovel", "messageinabottle", "tourniquet", "wovenfabric", "smallbag", "bow", "amber", "fossil", "stonehammer", "lockpick", "waterskin", "woodenarrow", "stonebullet", "cordedsling"],
    high: ["goldcoins", "rope", "spyglass", "leatherbelt", "leathercap", "leatherboots", "leathergorget", "leatherpants", "leathertunic", "leathergloves", "spear", "tatteredmap", "oldinstructionalscroll", "barktorch", "cottonfabric", "backpack", "suture", "bandage", "tannedleather", "arrow", "glassbottle"],
    treasure: ["goldensword", "goldenring", "goldenchalice", "animalfattorch", "goldcoins", "wroughtiron", "oldinstructionalscroll", "tatteredmap", "ironore", "limestone", "talc", "ironingot", "wroughtironboots", "wroughtironhelmet", "wroughtirongorget", "wroughtirongauntlets", "wroughtirongreaves", "wroughtironshield", "wroughtironpickaxe", "wroughtirondoubleaxe", "wroughtironshovel", "wroughtironspear", "wroughtironhammer", "wroughtironlockpick", "wroughtirontongs", "wroughtironbreastplate", "wroughtironsword", "wroughtironbullet", "wroughtironarrow", "flintlockpistol"]
};
