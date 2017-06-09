/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

var enemies = new Image();
enemies.src = 'images/enemies.png';

//Ugly, but fastest and no needed to regenerate objects/arrays
var spawnableTiles = {
    default: {
        ash: true,
        dirt: true,
        grass: true,
        gravel: true,
        sand: true,
        snow: true,
        swamp: true,
        clay: true
    },
    defaultWithWater: {
        ash: true,
        dirt: true,
        grass: true,
        gravel: true,
        sand: true,
        snow: true,
        swamp: true,
        clay: true,
        shallowwater: true,
        freshshallowwater: true
    },
    deepWater: {
        water: true,
        freshwater: true,
        deepwater: true,
        freshdeepwater: true
    },
    water: {
        water: true,
        freshwater: true,
        deepwater: true,
        freshdeepwater: true,
        shallowwater: true,
        freshshallowwater: true
    },
    flying: {
        ash: true,
        dirt: true,
        grass: true,
        gravel: true,
        sand: true,
        shallowwater: true,
        snow: true,
        swamp: true,
        clay: true,
        freshshallowwater: true,
        forest: true,
        palm: true,
        bareforest: true,
        barepalm: true
    },
    ghost: {
        ash: true,
        dirt: true,
        grass: true,
        gravel: true,
        sand: true,
        shallowwater: true,
        snow: true,
        swamp: true,
        clay: true,
        freshshallowwater: true,
        forest: true,
        palm: true,
        bareforest: true,
        barepalm: true,
        rock: true,
        sandstone: true
    }
};

var npcs = {
    slime: {
        id: 7,
        name: "一个史莱姆",
        minhp: 7,
        maxhp: 15,
        minatk: 1,
        maxatk: 3,
        defense: {
            base: 1,
            resist: [
                ['blunt', 2]
            ],
            vulnerable: []
        },
        damageType: ['blunt'],
        ai: "neutral",
        blood: [20, 180, 20],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 0
    },
    jellycube: {
        id: 6,
        name: "一个果冻魔方",
        minhp: 24,
        maxhp: 26,
        minatk: 3,
        maxatk: 7,
        defense: {
            base: 2,
            resist: [
                ['blunt', 8]
            ],
            vulnerable: []
        },
        damageType: ['blunt'],
        ai: "hostile",
        blood: [20, 180, 20],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 32000
    },
    giantspider: {
        id: 2,
        name: "一个巨大蜘蛛",
        minhp: 7,
        maxhp: 15,
        minatk: 1,
        maxatk: 3,
        defense: {
            base: 1,
            resist: [
                ['slashing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        damageType: ['piercing'],
        ai: "hostile",
        canCauseStatus: ["poison"],
        loot: ["spidersilk"],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 0
    },
    bear: {
        id: 0,
        name: "一头熊",
        minhp: 18,
        maxhp: 21,
        minatk: 5,
        maxatk: 13,
        defense: {
            base: 3,
            resist: [
                ['piercing', 3],
                ['blunt', 1]
            ],
            vulnerable: []
        },
        damageType: ['slashing', 'blunt'],
        ai: "hostile",
        special: "landsea",
        canCauseStatus: ["bleeding"],
        spawnTiles: spawnableTiles.defaultWithWater,
        spawnTalent: 8000
    },
    rabbit: {
        id: 4,
        name: "一只野兔",
        minhp: 3,
        maxhp: 6,
        minatk: 1,
        maxatk: 2,
        defense: {
            base: 0,
            resist: [],
            vulnerable: []
        },
        damageType: ['slashing'],
        ai: "scared",
        spawnTiles: spawnableTiles.default,
        spawnTalent: 0
    },
    snake: {
        id: 8,
        name: "一条蛇",
        minhp: 5,
        maxhp: 8,
        minatk: 4,
        maxatk: 9,
        defense: {
            base: 1,
            resist: [
                ['piercing', 1]
            ],
            vulnerable: [
                ['fire', 1]
            ]
        },
        damageType: ['piercing'],
        canCauseStatus: ["poison"],
        ai: "neutral",
        spawnTiles: spawnableTiles.default,
        spawnTalent: 0
    },
    giantrat: {
        id: 1,
        name: "一只大老鼠",
        minhp: 5,
        maxhp: 8,
        minatk: 2,
        maxatk: 5,
        defense: {
            base: 1,
            resist: [
                ['blunt', 1]
            ],
            vulnerable: [
                ['fire', 1]
            ]
        },
        damageType: ['slashing'],
        ai: "hostile",
        canCauseStatus: ["bleeding"],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 0
    },
    rat: {
        id: 5,
        name: "一只小老鼠",
        minhp: 3,
        maxhp: 4,
        minatk: 1,
        maxatk: 2,
        defense: {
            base: 0,
            resist: [],
            vulnerable: []
        },
        damageType: ['slashing'],
        ai: "scared",
        spawnTiles: spawnableTiles.default,
        spawnTalent: 0
    },
    vampirebat: {
        id: 9,
        name: "一只吸血蝙蝠",
        minhp: 6,
        maxhp: 12,
        minatk: 2,
        maxatk: 5,
        defense: {
            base: 2,
            resist: [
                ['piercing', 2]
            ],
            vulnerable: [
                ['fire', 3]
            ]
        },
        damageType: ['piercing'],
        ai: "hostile",
        special: "flying",
        canCauseStatus: ["bleeding"],
        spawnTiles: spawnableTiles.flying
    },
    greywolf: {
        id: 3,
        name: "一只灰太狼",
        minhp: 14,
        maxhp: 22,
        minatk: 7,
        maxatk: 9,
        defense: {
            base: 3,
            resist: [
                ['blunt', 1]
            ],
            vulnerable: []
        },
        damageType: ['slashing', 'blunt'],
        ai: "hostile",
        canCauseStatus: ["bleeding"],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 8000
    },
    imp: {
        id: 11,
        name: "一个小鬼",
        minhp: 28,
        maxhp: 36,
        minatk: 13,
        maxatk: 17,
        defense: {
            base: 4,
            resist: [
                ['fire', 99]
            ],
            vulnerable: []
        },
        damageType: ['slashing'],
        ai: "hostile",
        special: "flying",
        loot: ["redmushroom"],
        lootgroup: "high",
        canCauseStatus: ["bleeding", "burning"],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 32000
    },
    bogling: {
        id: 12,
        name: "一个幽灵",
        minhp: 30,
        maxhp: 33,
        minatk: 7,
        maxatk: 9,
        defense: {
            base: 4,
            resist: [
                ['blunt', 2],
                ['fire', 4]
            ],
            vulnerable: []
        },
        damageType: ['blunt'],
        ai: "hostile",
        loot: ["peat"],
        blood: [20, 180, 20],
        canCauseStatus: ["poison"],
        lootgroup: "low",
        spawnTiles: spawnableTiles.default,
        spawnTalent: 16000
    },
    livingrock: {
        id: 13,
        name: "一块原生岩石",
        minhp: 40,
        maxhp: 55,
        minatk: 4,
        maxatk: 6,
        defense: {
            base: 5,
            resist: [
                ['slashing', 2],
                ['fire', 99]
            ],
            vulnerable: [
                ['blunt', 2]
            ]
        },
        damageType: ['blunt'],
        ai: "stationary",
        loot: ["largerock", "sharprock"],
        blood: [140, 140, 120],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 16000
    },
    shark: {
        id: 14,
        name: "一头鲨鱼",
        minhp: 13,
        maxhp: 18,
        minatk: 5,
        maxatk: 11,
        defense: {
            base: 3,
            resist: [
                ['blunt', 1],
                ['fire', 99]
            ],
            vulnerable: []
        },
        damageType: ['slashing', 'piercing'],
        ai: "swimming",
        canCauseStatus: ["bleeding"],
        spawnTiles: spawnableTiles.deepWater
    },
    zombie: {
        id: 10,
        name: "一只萌萌哒僵尸",
        minhp: 15,
        maxhp: 25,
        minatk: 5,
        maxatk: 14,
        defense: {
            base: 5,
            resist: [
                ['blunt', 1],
                ['piercing', 1]
            ],
            vulnerable: [
                ['fire', 5],
                ['slashing', 1]
            ]
        },
        damageType: ['slashing'],
        ai: "hostile",
        loot: ["bone"],
        lootgroup: "low",
        canCauseStatus: ["poison", "bleeding"],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 16000
    },
    skeleton: {
        id: 15,
        name: "一只骷髅怪",
        minhp: 22,
        maxhp: 32,
        minatk: 9,
        maxatk: 12,
        defense: {
            base: 4,
            resist: [
                ['slashing', 2],
                ['piercing', 2]
            ],
            vulnerable: [
                ['blunt', 2],
                ['fire', 2]
            ]
        },
        damageType: ['blunt', 'piercing'],
        ai: "hostile",
        loot: ["bone"],
        lootgroup: "low",
        blood: [200, 200, 200],
        canCauseStatus: ["bleeding"],
        spawnTiles: spawnableTiles.default
    },
    pirateghost: {
        id: 16,
        name: "一个海盗幽灵（我是要成为海贼王的男人）",
        minhp: 35,
        maxhp: 48,
        minatk: 13,
        maxatk: 15,
        defense: {
            base: 8,
            resist: [],
            vulnerable: [
                ['fire', 4]
            ]
        },
        damageType: ['blunt'],
        ai: "hostile",
        special: "ghost",
        lootgroup: "high",
        blood: [250, 250, 250],
        spawnTiles: spawnableTiles.ghost,
        spawnTalent: 64000
    },
    timeskitter: {
        id: 17,
        name: "A Time Skitter",
        minhp: 19,
        maxhp: 24,
        minatk: 14,
        maxatk: 18,
        defense: {
            base: 8,
            resist: [],
            vulnerable: []
        },
        damageType: ['slashing', 'piercing'],
        ai: "hostile",
        lootgroup: "high",
        canCauseStatus: ["bleeding"],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 64000
    },
    chicken: {
        id: 18,
        name: "一只鸡",
        minhp: 3,
        maxhp: 6,
        minatk: 1,
        maxatk: 3,
        defense: {
            base: 0,
            resist: [],
            vulnerable: []
        },
        damageType: ['slashing'],
        ai: "scared",
        loot: ["feather", "feather"],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 32000
    },
    trapdoorspider: {
        id: 19,
        name: "一只陷阱蜘蛛",
        minhp: 4,
        maxhp: 9,
        minatk: 2,
        maxatk: 3,
        defense: {
            base: 0,
            resist: [
                ['piercing', 1]
            ],
            vulnerable: [
                ['blunt', 1]
            ]
        },
        damageType: ['piercing'],
        ai: "hidden",
        spawnTiles: spawnableTiles.default,
        spawnTalent: 8000
    },
    fireelemental: {
        id: 20,
        name: "一个火元素",
        minhp: 30,
        maxhp: 38,
        minatk: 11,
        maxatk: 19,
        defense: {
            base: 5,
            resist: [
                ['fire', 100]
            ],
            vulnerable: []
        },
        damageType: ['fire', 'blunt'],
        ai: "hostile",
        special: "flying",
        lootgroup: "high",
        loot: ["ashpile"],
        blood: [210, 125, 20],
        canCauseStatus: ["burning"],
        spawnTiles: spawnableTiles.default,
        spawnTalent: 32000
    },
    trout: {
        id: 21,
        name: "一条鲑鱼",
        minhp: 3,
        maxhp: 4,
        minatk: 0,
        maxatk: 1,
        defense: {
            base: 0,
            resist: [
                ['fire', 99],
                ['blunt', 1],
                ['slashing', 1]
            ],
            vulnerable: []
        },
        damageType: ['blunt'],
        ai: "fish",
        loot: ["rawtrout"],
        spawnTiles: spawnableTiles.water
    },
    hobgoblin: {
        id: 22,
        name: "一头妖怪",
        minhp: 29,
        maxhp: 32,
        minatk: 7,
        maxatk: 14,
        defense: {
            base: 3,
            resist: [
                ['blunt', 1]
            ],
            vulnerable: []
        },
        damageType: ['slashing', 'blunt'],
        ai: "hostile",
        lootgroup: "low",
        spawnTiles: spawnableTiles.default,
        spawnTalent: 32000
    },
    livingmushroom: {
        id: 23,
        name: "一个原生蘑菇",
        minhp: 14,
        maxhp: 24,
        minatk: 6,
        maxatk: 10,
        defense: {
            base: 2,
            resist: [
                ['fire', 3]
            ],
            vulnerable: [
                ['slashing', 2]
            ]
        },
        damageType: ['blunt'],
        ai: "hostile",
        loot: ["mushrooms"],
        blood: [145, 115, 100],
        spawnTiles: spawnableTiles.default
    },
    kraken: {
        id: 24,
        name: "一头海怪（可惜是男的）",
        minhp: 40,
        maxhp: 50,
        minatk: 10,
        maxatk: 14,
        defense: {
            base: 3,
            resist: [
                ['slashing', 2]
            ],
            vulnerable: [
                ['fire', 2]
            ]
        },
        damageType: ['blunt'],
        ai: "hostile",
        special: "landsea",
        loot: ["messageinabottle"],
        lootgroup: "low",
        spawnTiles: spawnableTiles.water
    },
    blindfish: {
        id: 21,
        name: "一条盲鱼",
        minhp: 4,
        maxhp: 5,
        minatk: 1,
        maxatk: 2,
        defense: {
            base: 1,
            resist: [
                ['fire', 99],
                ['blunt', 2],
                ['slashing', 2]
            ],
            vulnerable: []
        },
        damageType: ['blunt'],
        ai: "fish",
        loot: ["rawblindfish"],
        spawnTiles: spawnableTiles.water
    },
    harpy: {
        id: 25,
        name: "一头鸟身女妖（约吗？）",
        minhp: 27,
        maxhp: 34,
        minatk: 7,
        maxatk: 14,
        defense: {
            base: 4,
            resist: [
                ['slashing', 2]
            ],
            vulnerable: [
                ['fire', 2]
            ]
        },
        damageType: ['slashing'],
        ai: "hostile",
        special: "flying",
        canCauseStatus: ["bleeding"],
        loot: ["feather", "feather"],
        lootgroup: "low",
        spawnTiles: spawnableTiles.default,
        spawnTalent: 32000
    }
};

/* Reference object */
/*defense = {
 base: 0,
 resist: [
 ['blunt', 0],
 ['fire', 0],
 ['piercing', 0],
 ['slashing', 0]
 ],
 vulnerable: [
 ['blunt', 0],
 ['fire', 0],
 ['piercing', 0],
 ['slashing', 0]
 ]
 };*/
