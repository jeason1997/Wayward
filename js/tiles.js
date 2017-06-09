/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

//Tiles - 8 layers
var tiles = new Image();
tiles.src = 'images/tiles.png';

var tiletypes = {
    ash: {
        id: 0,
        layer: 6,
        name: "灰",
        color: "#272727",
        passable: true,
        particles: [40, 40, 40]
    },
    cobblestone: {
        id: 1,
        layer: 6,
        name: "鹅卵石",
        color: "#343f44",
        passable: true,
        particles: [50, 65, 65],
        durability: 15
    },
    darkness: {
        id: 2,
        layer: 8,
        name: "黑暗",
        color: "#000000",
        noLOS: true,
        particles: [0, 0, 0]
    },
    deepwater: {
        id: 3,
        layer: 2,
        name: "深深的海水",
        color: "#0a69c9",
        particles: [10, 130, 250],
        water: true
    },
    dirt: {
        id: 4,
        layer: 4,
        name: "尘埃",
        color: "#654423",
        passable: true,
        particles: [120, 80, 45],
        regathered: true
    },
    exit: {
        id: 5,
        layer: 8,
        name: "一个入口",
        color: "#222222",
        passable: true,
        particles: [120, 80, 45]
    },
    forest: {
        id: 6,
        layer: 7,
        name: "树",
        color: "#0e541e",
        particles: [10, 80, 10],
        strength: 7,
        skill: "lumberjacking",
        gather: true,
        noLOS: true,
        flammable: true,
        sound: "foresthit",
        leftOver: "bareforest",
        noGFXSwitch: true
    },
    grass: {
        id: 7,
        layer: 5,
        name: "草",
        color: "#3d610a",
        passable: true,
        particles: [61, 97, 10],
        flammable: true,
        regathered: true
    },
    gravel: {
        id: 8,
        layer: 3,
        name: "砂砾",
        color: "#b38233",
        passable: true,
        particles: [145, 110, 35],
        regathered: true
    },
    highrock: {
        id: 9,
        layer: 7,
        name: "高高的岩石",
        color: "#54524c",
        particles: [140, 140, 120],
        strength: 10,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "rockhit",
        leftOver: "dirt",
        noGFXSwitch: true
    },
    rock: {
        id: 10,
        layer: 7,
        name: "岩石",
        color: "#727064",
        particles: [115, 115, 100],
        strength: 8,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "rockhit",
        leftOver: "dirt",
        noGFXSwitch: true
    },
    sand: {
        id: 11,
        layer: 1,
        name: "沙子",
        color: "#ddcb75",
        passable: true,
        particles: [220, 200, 115],
        regathered: true
    },
    sandstone: {
        id: 12,
        layer: 7,
        name: "砂岩",
        color: "#8b5a1b",
        particles: [140, 90, 25],
        strength: 7,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "sandstonehit",
        leftOver: "gravel",
        noGFXSwitch: true
    },
    shallowwater: {
        id: 13,
        layer: 1,
        name: "浅的海水",
        color: "#61aefe",
        shallowWater: true,
        passable: true,
        particles: [10, 130, 250]
    },
    snow: {
        id: 14,
        layer: 6,
        name: "雪",
        color: "#ffffff",
        passable: true,
        particles: [250, 250, 250]
    },
    stonewall: {
        id: 15,
        layer: 8,
        name: "石墙",
        color: "#161f23",
        strength: 1,
        particles: [50, 65, 65],
        gather: true,
        noLOS: true,
        sound: "rockhit",
        leftOver: "dirt",
        durability: 15
    },
    swamp: {
        id: 17,
        layer: 6,
        name: "沼泽",
        color: "#243721",
        passable: true,
        particles: [5, 20, 0]
    },
    water: {
        id: 18,
        layer: 0,
        name: "海水",
        color: "#0c80f7",
        particles: [10, 130, 250],
        water: true
    },
    clay: {
        id: 19,
        layer: 1,
        name: "黏土",
        color: "#afafaf",
        passable: true,
        particles: [185, 185, 185]
    },
    sandstonewall: {
        id: 20,
        layer: 8,
        name: "砂岩墙",
        color: "#603407",
        strength: 1,
        particles: [155, 100, 30],
        gather: true,
        noLOS: true,
        sound: "sandstonehit",
        leftOver: "gravel",
        durability: 15
    },
    sandstonefloor: {
        id: 22,
        layer: 6,
        name: "砂岩地板",
        color: "#75410c",
        passable: true,
        particles: [140, 90, 25],
        durability: 15
    },
    palm: {
        id: 23,
        layer: 7,
        name: "棕榈树",
        color: "#87b535",
        particles: [70, 135, 50],
        strength: 7,
        skill: "lumberjacking",
        gather: true,
        noLOS: true,
        flammable: true,
        sound: "foresthit",
        leftOver: "barepalm",
        noGFXSwitch: true
    },
    barepalm: {
        id: 24,
        layer: 7,
        name: "裸露的棕榈树",
        color: "#debd92",
        particles: [220, 190, 145],
        strength: 3,
        skill: "lumberjacking",
        gather: true,
        flammable: true,
        sound: "foresthit",
        leftOver: "sand"
    },
    bareforest: {
        id: 25,
        layer: 7,
        name: "裸露的树",
        color: "#7f6516",
        particles: [125, 100, 20],
        strength: 3,
        skill: "lumberjacking",
        gather: true,
        flammable: true,
        sound: "foresthit",
        noGFXSwitch: true,
        leftOver: "dirt"
    },
    woodenwall: {
        id: 26,
        layer: 8,
        name: "木墙",
        color: "#633c0e",
        strength: 1,
        particles: [100, 60, 15],
        gather: true,
        noLOS: true,
        flammable: true,
        sound: "foresthit",
        leftOver: "dirt",
        durability: 15
    },
    woodenfloor: {
        id: 28,
        layer: 6,
        name: "木质地板",
        color: "#814b11",
        passable: true,
        particles: [130, 75, 15],
        flammable: true,
        durability: 15
    },
    woodendoor: {
        id: 29,
        layer: 8,
        name: "木门",
        color: "#633c0e",
        particles: [100, 60, 15],
        passable: false,
        door: true,
        flammable: true,
        durability: 15
    },
    freshdeepwater: {
        id: 30,
        layer: 2,
        name: "深深的淡水",
        color: "#214e80",
        particles: [33, 78, 128],
        water: true,
        freshWater: true
    },
    freshshallowwater: {
        id: 31,
        layer: 1,
        name: "Shallow Fresh Water",
        color: "#2f809d",
        passable: true,
        shallowWater: true,
        particles: [47, 128, 157],
        freshWater: true
    },
    freshwater: {
        id: 32,
        layer: 0,
        name: "淡水",
        color: "#296a92",
        particles: [41, 106, 146],
        water: true,
        freshWater: true
    },
    ironrock: {
        id: 33,
        layer: 7,
        name: "岩石与铁",
        color: "#838070",
        particles: [115, 115, 100],
        strength: 2,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "rockhit",
        leftOver: "rock",
        noGFXSwitch: true
    },
    ironsandstone: {
        id: 34,
        layer: 7,
        name: "砂岩与铁",
        color: "#a56b20",
        particles: [140, 90, 25],
        strength: 2,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "sandstonehit",
        leftOver: "sandstone",
        noGFXSwitch: true
    },
    talcrock: {
        id: 35,
        layer: 7,
        name: "岩石与滑石",
        color: "#838070",
        particles: [115, 115, 100],
        strength: 2,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "rockhit",
        leftOver: "rock",
        noGFXSwitch: true
    },
    limestonerock: {
        id: 36,
        layer: 7,
        name: "岩石与石灰岩",
        color: "#838070",
        particles: [115, 115, 100],
        strength: 2,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "rockhit",
        leftOver: "rock",
        noGFXSwitch: true
    },
    berryforest: {
        id: 37,
        layer: 7,
        name: "树与浆果",
        color: "#126d27",
        particles: [10, 80, 10],
        strength: 2,
        skill: "lumberjacking",
        gather: true,
        noLOS: true,
        flammable: true,
        sound: "foresthit",
        leftOver: "forest",
        noGFXSwitch: true
    },
    fungusforest: {
        id: 38,
        layer: 7,
        name: "树与白木耳",
        color: "#126d27",
        particles: [10, 80, 10],
        strength: 2,
        skill: "lumberjacking",
        gather: true,
        noLOS: true,
        flammable: true,
        sound: "foresthit",
        leftOver: "forest",
        noGFXSwitch: true
    },
    vineforest: {
        id: 39,
        layer: 7,
        name: "树与葡萄",
        color: "#126d27",
        particles: [10, 80, 10],
        strength: 2,
        skill: "lumberjacking",
        gather: true,
        noLOS: true,
        flammable: true,
        sound: "foresthit",
        leftOver: "forest",
        noGFXSwitch: true
    },
    coconutpalm: {
        id: 40,
        layer: 7,
        name: "棕榈树与椰子",
        color: "#a8e044",
        particles: [70, 135, 50],
        strength: 2,
        skill: "lumberjacking",
        gather: true,
        noLOS: true,
        flammable: true,
        sound: "foresthit",
        leftOver: "palm",
        noGFXSwitch: true
    },
    coalrock: {
        id: 41,
        layer: 7,
        name: "岩石与煤",
        color: "#838070",
        particles: [115, 115, 100],
        strength: 2,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "rockhit",
        leftOver: "rock",
        noGFXSwitch: true
    },
    nitersandstone: {
        id: 42,
        layer: 7,
        name: "砂岩与硝石",
        color: "#a56b20",
        particles: [140, 90, 25],
        strength: 2,
        skill: "mining",
        gather: true,
        noLOS: true,
        sound: "sandstonehit",
        leftOver: "sandstone",
        noGFXSwitch: true
    }
};

//Resource definitions
//Item drop, chance, <tile to transform into>, <chance for tile to turn - if not set = 100%>
// Note: For regathered tiles above, make sure their equivalent item is in position [0] in their resource array.
// This is so that we can force a regather of the placed tile.
var resource = {
    forest: [
        ["sapling", 1],
        ["leaves", 8],
        ["twigs", 10],
        ["treebark", 15],
        ["branch", 30]
    ],
    berryforest: [
        ["redberries", 45]
    ],
    fungusforest: [
        ["treefungus", 45]
    ],
    vineforest: [
        ["treevine", 45]
    ],
    bareforest: [
        ["log", 45]
    ],
    palm: [
        ["palmleaf", 8],
        ["treebark", 25]
    ],
    coconutpalm: [
        ["coconut", 45]
    ],
    barepalm: [
        ["log", 45]
    ],
    rock: [
        ["smoothrock", 2],
        ["sharprock", 10],
        ["stones", 20],
        ["largerock", 50]
    ],
    ironrock: [
        ["ironore", 45]
    ],
    talcrock: [
        ["talc", 45]
    ],
    limestonerock: [
        ["limestone", 45]
    ],
    coalrock: [
        ["coal", 45]
    ],
    sandstone: [
        ["shale", 2],
        ["pileofgravel", 15],
        ["stones", 20],
        ["sandstone", 50]
    ],
    ironsandstone: [
        ["ironore", 45]
    ],
    nitersandstone: [
        ["niter", 45]
    ],
    highrock: [
        ["sharprock", 15],
        ["stones", 20],
        ["largerock", 50]
    ],
    stonewall: [
        ["stonewall", 30]
    ],
    woodenwall: [
        ["woodenwall", 30]
    ],
    woodenfloor: [
        ["woodenfloor", 50, "dirt"]
    ],
    woodendoor: [
        ["woodendoor", 50, "dirt"]
    ],
    sandstonewall: [
        ["sandstonewall", 30]
    ],
    dirt: [
        ["soil", 50, "dirt"],
        ["soil", 1, "freshshallowwater"],
        ["earthworm", 5]
    ],
    clay: [
        ["rawclay", 50, "sand", 10]
    ],
    grass: [
        ["grassseeds", 50, "dirt"],
        ["plantroots", 5, "dirt"]
    ],
    sand: [
        ["pileofsand", 50, "clay", 15]
    ],
    gravel: [
        ["pileofgravel", 45, "clay", 10],
        ["pileofgravel", 1, "freshshallowwater"],
        ["stones", 5],
        ["shale", 10]
    ],
    swamp: [
        ["peat", 1, "freshshallowwater"],
        ["plantroots", 5],
        ["treevine", 8],
        ["peat", 45, "dirt", 50]
    ],
    cobblestone: [
        ["cobblestone", 50, "dirt"]
    ],
    sandstonefloor: [
        ["sandstonefloor", 50, "gravel"]
    ],
    snow: [
        ["pileofsnow", 40, "dirt"]
    ],
    ash: [
        ["charcoal", 5, "dirt", 75],
        ["ashpile", 45, "dirt", 50]
    ],
    shallowwater: [
        ["pileofsand", 25, "water", 75]
    ],
    freshshallowwater: [
        ["soil", 25, "freshwater", 75]
    ],
    exit: [
        ["soil", 25, "dirt", 100]
    ]
};

//Templates for map generation
var templates = {
    //Houses
    house: {
        woodenHouse: {
            w: 5,
            h: 4,
            template: ["woodenwall", "woodenwall", "woodenwall", "woodenwall", "woodenwall", "woodenwall", "woodenfloor", "woodenfloor", "woodenfloor", "woodenwall", "woodenwall", "woodenfloor", "woodenfloor", "woodenfloor", "woodenfloor", "woodenwall", "woodenwall", "woodenwall", "woodenwall", "woodenwall"],
            degrade: 25
        },
        largeWoodenHouse: {
            w: 6,
            h: 5,
            template: ["woodenwall", "woodenwall", "woodenwall", "woodenwall", "woodenwall", "woodenwall", "woodenwall", "woodenfloor", "woodenfloor", "woodenfloor", "woodenfloor", "woodenwall", "woodenwall", "woodenfloor", "woodenfloor", "woodenfloor", "woodenfloor", "woodenwall", "woodenwall", "woodenfloor", "woodenfloor", "woodenfloor", "woodenfloor", "woodenwall", "woodenwall", "woodenwall", "woodenfloor", "woodenfloor", "woodenwall", "woodenwall"],
            degrade: 25
        },
        stoneHouse: {
            w: 7,
            h: 4,
            template: ["stonewall", "stonewall", "stonewall", "stonewall", "cobblestone", "cobblestone", "stonewall", "stonewall", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "stonewall", "stonewall", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "stonewall", "stonewall", "stonewall", "stonewall", "stonewall", "stonewall", "stonewall", "stonewall"],
            degrade: 50
        },
        largeStoneHouse: {
            w: 8,
            h: 5,
            template: ["stonewall", "stonewall", "cobblestone", "stonewall", "stonewall", "", "", "", "stonewall", "cobblestone", "cobblestone", "cobblestone", "stonewall", "", "", "", "stonewall", "stonewall", "stonewall", "cobblestone", "stonewall", "stonewall", "stonewall", "stonewall", "stonewall", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "cobblestone", "stonewall", "stonewall", "stonewall", "stonewall", "stonewall", "cobblestone", "stonewall", "stonewall", "stonewall"],
            degrade: 75
        },
        monument: {
            category: "house",
            w: 5,
            h: 3,
            template: ["", "cobblestone", "cobblestone", "cobblestone", "", "cobblestone", "cobblestone", "stonewall", "cobblestone", "cobblestone", "", "cobblestone", "cobblestone", "cobblestone", ""],
            degrade: 100
        }
    },
    //Ponds
    pond: {
        pondWithTrees: {
            w: 8,
            h: 8,
            template: ["", "", "", "forest", "forest", "forest", "", "", "", "forest", "forest", "dirt", "dirt", "forest", "forest", "", "", "forest", "grass", "dirt", "freshshallowwater", "dirt", "forest", "", "forest", "dirt", "freshshallowwater", "freshshallowwater", "freshshallowwater", "freshshallowwater", "dirt", "forest", "forest", "grass", "freshshallowwater", "freshshallowwater", "freshshallowwater", "freshshallowwater", "grass", "forest", "", "forest", "dirt", "freshshallowwater", "freshshallowwater", "dirt", "forest", "", "", "forest", "forest", "dirt", "grass", "forest", "forest", "", "", "", "", "forest", "forest", "", "", "", ""],
            degrade: 10
        },
        pond: {
            w: 5,
            h: 5,
            template: ["", "", "forest", "", "", "", "forest", "freshshallowwater", "forest", "", "forest", "freshshallowwater", "freshshallowwater", "freshshallowwater", "forest", "", "forest", "freshshallowwater", "forest", "", "", "", "forest", "", ""],
            degrade: 30
        }
    },
    //Cave Ponds
    cavepond: {
        largePond: {
            w: 8,
            h: 8,
            template: ["", "", "", "rock", "rock", "rock", "", "", "", "rock", "rock", "dirt", "dirt", "rock", "rock", "", "", "rock", "gravel", "dirt", "freshshallowwater", "dirt", "rock", "", "rock", "dirt", "freshshallowwater", "freshshallowwater", "freshshallowwater", "freshshallowwater", "dirt", "rock", "rock", "gravel", "freshshallowwater", "freshshallowwater", "freshshallowwater", "freshshallowwater", "gravel", "rock", "", "rock", "dirt", "freshshallowwater", "freshshallowwater", "dirt", "rock", "", "", "rock", "rock", "dirt", "gravel", "rock", "rock", "", "", "", "", "rock", "rock", "", "", "", ""],
            degrade: 20
        },
        pond: {
            w: 5,
            h: 5,
            template: ["", "", "rock", "", "", "", "rock", "freshshallowwater", "rock", "", "rock", "freshshallowwater", "freshshallowwater", "freshshallowwater", "rock", "", "rock", "freshshallowwater", "rock", "", "", "", "rock", "", ""],
            degrade: 40
        }
    },
    //Desert
    desert: {
        oasis: {
            w: 8,
            h: 8,
            template: ["", "", "", "palm", "palm", "palm", "", "", "", "palm", "palm", "gravel", "gravel", "palm", "palm", "", "", "palm", "grass", "gravel", "freshshallowwater", "gravel", "palm", "", "palm", "gravel", "freshshallowwater", "freshshallowwater", "freshshallowwater", "freshshallowwater", "gravel", "palm", "palm", "grass", "freshshallowwater", "freshshallowwater", "freshshallowwater", "freshshallowwater", "grass", "palm", "", "palm", "gravel", "freshshallowwater", "freshshallowwater", "gravel", "palm", "", "", "palm", "palm", "gravel", "grass", "palm", "palm", "", "", "", "", "palm", "palm", "", "", "", ""],
            degrade: 45
        },
        pond: {
            w: 7,
            h: 5,
            template: ["", "", "gravel", "gravel", "gravel", "", "", "", "gravel", "grass", "palm", "grass", "gravel", "", "", "gravel", "palm", "freshshallowwater", "palm", "gravel", "", "", "gravel", "grass", "palm", "grass", "gravel", "", "", "", "gravel", "gravel", "gravel", "", ""],
            degrade: 45
        },
        sandstonePond: {
            w: 5,
            h: 5,
            template: ["", "", "freshshallowwater", "", "", "", "freshshallowwater", "sandstone", "freshshallowwater", "", "freshshallowwater", "sandstone", "sandstone", "sandstone", "freshshallowwater", "", "freshshallowwater", "sandstone", "freshshallowwater", "", "", "", "freshshallowwater", "", ""],
            degrade: 45
        },
        sandstoneHouse: {
            w: 5,
            h: 4,
            template: ["sandstonewall", "sandstonewall", "sandstonewall", "sandstonewall", "sandstonewall", "sandstonewall", "sandstonefloor", "sandstonefloor", "sandstonefloor", "sandstonewall", "sandstonewall", "sandstonefloor", "sandstonefloor", "sandstonefloor", "sandstonefloor", "sandstonewall", "sandstonewall", "sandstonewall", "sandstonewall", "sandstonewall"],
            degrade: 35
        }
    },
    //Beach
    beach: {
        largeClay: {
            w: 5,
            h: 5,
            template: ["sand", "sand", "clay", "sand", "sand", "sand", "clay", "clay", "clay", "sand", "clay", "clay", "clay", "clay", "clay", "sand", "clay", "clay", "clay", "sand", "sand", "sand", "clay", "sand", "sand"],
            degrade: 10
        },
        clay: {
            w: 5,
            h: 3,
            template: ["sand", "clay", "clay", "clay", "sand", "clay", "clay", "shallowwater", "clay", "clay", "sand", "clay", "clay", "clay", ""],
            degrade: 25
        }
    },
    //Boats
    boat: {
        raft: {
            w: 2,
            h: 2,
            template: ["woodenfloor", "woodenfloor", "woodenfloor", "woodenfloor"],
            degrade: 100
        },
        smallShip: {
            w: 7,
            h: 5,
            template: ["deepwater", "deepwater", "woodenwall", "woodenwall", "woodenwall", "deepwater", "deepwater", "deepwater", "woodenwall", "woodenfloor", "woodenfloor", "woodenfloor", "woodenwall", "deepwater", "woodenwall", "woodenfloor", "woodenfloor", "woodenfloor", "woodenfloor", "woodenfloor", "woodenwall", "deepwater", "woodenwall", "woodenfloor", "woodenfloor", "woodenfloor", "woodenwall", "deepwater", "deepwater", "deepwater", "woodenwall", "woodenwall", "woodenwall", "deepwater", "deepwater"],
            degrade: 10
        }
    }
};
