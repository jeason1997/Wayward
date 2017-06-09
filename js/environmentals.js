/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

var environments = new Image();
environments.src = 'images/environments.png';
var environmentals = {
    mushrooms_ground: {
        id: 11,
        name: "普通的蘑菇",
        spread: 3,
        resource: ["mushrooms"],
        skill: "mycology",
        allowedtiles: ["grass", "dirt"],
        garden: true,
        trample: true,
        cavegrow: true
    },
    redmushroom_ground: {
        id: 14,
        name: "红斑蘑菇",
        spread: 3,
        resource: ["redmushroom"],
        skill: "mycology",
        allowedtiles: ["grass", "dirt"],
        garden: true,
        trample: true,
        cavegrow: true
    },
    yellowflowers: {
        id: 23,
        name: "黄花",
        spread: 4,
        resource: ["flowerseeds"],
        skill: "botany",
        allowedtiles: ["grass", "dirt"],
        garden: true,
        trample: true
    },
    grassseeds_ground: {
        id: 9,
        name: "种植草籽",
        spread: 5,
        decay: 9,
        resource: ["grassseeds"],
        skill: "botany",
        allowedtiles: ["dirt"],
        garden: true
    },
    thistle: {
        id: 20,
        spread: 4,
        name: "蓟",
        resource: ["thistleseeds"],
        skill: "botany",
        allowedtiles: ["grass", "dirt"],
        garden: true,
        trample: true
    },
    vines: {
        id: 22,
        spread: 5,
        name: "葡萄藤",
        resource: ["treevine"],
        skill: "botany",
        allowedtiles: ["swamp"]
    },
    seaweed_ground: {
        id: 17,
        name: "海藻",
        spread: 3,
        resource: ["seaweed"],
        skill: "botany",
        allowedtiles: ["water"]
    },
    blood: {
        id: 1,
        name: "鲜血",
        decay: 4
    },
    sapling_ground: {
        id: 16,
        name: "小树苗",
        resource: ["sapling"],
        skill: "botany",
        allowedtiles: ["grass", "dirt"],
        decay: 275
    },
    brambles: {
        id: 2,
        name: "荆棘",
        resource: ["twigs", "branch", "plantroots"],
        skill: "botany"
    },
    cactus: {
        id: 4,
        name: "仙人掌",
        resource: ["nopal", "cactusspines"],
        skill: "botany"
    },
    bush: {
        id: 3,
        name: "灌木",
        resource: ["redberries", "leaves", "twigs", "plantroots"],
        skill: "botany"
    },
    fire: {
        id: 6,
        name: "火",
        spread: 12,
        blockdig: true,
        decay: 12,
        fire: true
    },
    rockpatch: {
        id: 5,
        name: "岩石",
        resource: ["largerock", "stones"]
    },
    bear_corpse: {
        id: 0,
        name: "一头熊的尸体",
        resource: ["rawmeat", "rawmeat", "leather", "animalfat", "animalskull", "offal", "bones"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    rabbit_corpse: {
        id: 12,
        name: "一个兔子的尸体",
        resource: ["rawmeat", "offal", "bones"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    giantrat_corpse: {
        id: 7,
        name: "一个巨型老鼠的尸体",
        resource: ["rawtaintedmeat", "leather", "animalfat", "offal", "bones"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    greywolf_corpse: {
        id: 10,
        name: "一个灰狼的尸体",
        resource: ["rawmeat", "leather", "animalfat", "offal", "bones"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    vampirebat_corpse: {
        id: 21,
        name: "一个吸血蝙蝠的尸体",
        resource: ["rawmeat"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    snake_corpse: {
        id: 19,
        name: "一个蛇的尸体",
        resource: ["rawmeat"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    slime_corpse: {
        id: 18,
        name: "一个史莱姆的尸体",
        resource: ["slimegelatin"],
        decay: 95,
        carve: true,
        blood: [20, 180, 20]
    },
    jellycube_corpse: {
        id: 15,
        name: "一个巨型史莱姆的尸体",
        resource: ["slimegelatin", "slimegelatin"],
        decay: 95,
        carve: true,
        blood: [20, 180, 20]
    },
    giantspider_corpse: {
        id: 8,
        name: "一个巨型蜘蛛的尸体",
        resource: ["deadspider"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    zombie_corpse: {
        id: 24,
        name: "一个僵尸的尸体",
        resource: ["rottenmeat", "bones"],
        decay: 30,
        carve: true,
        skill: "anatomy"
    },
    imp_corpse: {
        id: 25,
        name: "一个小恶魔的尸体",
        resource: ["rawtaintedmeat", "bones"],
        decay: 50,
        carve: true,
        skill: "anatomy"
    },
    bogling_corpse: {
        id: 28,
        name: "一个令人可怕的尸体",
        resource: ["pileofcompost", "rottingvegetation"],
        decay: 50,
        carve: true,
        blood: [20, 180, 20],
        skill: "botany"
    },
    livingrock_corpse: {
        id: 29,
        name: "一个岩石傀儡的尸体",
        resource: ["talc", "limestone", "ironore"],
        carve: true,
        blood: [140, 140, 120],
        skill: "mining"
    },
    shark_corpse: {
        id: 30,
        name: "一个鲨鱼的尸体",
        resource: ["rawfishsteak", "rawfishsteak", "offal"],
        decay: 30,
        carve: true,
        skill: "anatomy"
    },
    campfire_unlit: {
        id: 26,
        name: "一个熄灭的篝火",
        resource: ["campfire"],
        lit: "campfire_lit"
    },
    campfire_lit: {
        id: 27,
        name: "一个点燃的篝火",
        decay: 60,
        blockdig: true,
        fire: true,
        revert: "campfire_unlit"
    },
    furnace_unlit: {
        id: 31,
        name: "一个熄灭的炉子",
        resource: ["furnace"],
        blockmove: true,
        lit: "furnace_lit"
    },
    furnace_lit: {
        id: 32,
        name: "一个点燃的炉子",
        decay: 75,
        blockdig: true,
        fire: true,
        blockmove: true,
        revert: "furnace_unlit"
    },
    kiln_unlit: {
        id: 33,
        name: "一个熄灭的烧窑",
        resource: ["kiln"],
        blockmove: true,
        lit: "kiln_lit"
    },
    kiln_lit: {
        id: 34,
        name: "一个点燃的烧窑",
        decay: 75,
        blockdig: true,
        fire: true,
        blockmove: true,
        revert: "kiln_unlit"
    },
    rat_corpse: {
        id: 13,
        name: "一个老鼠的尸体",
        resource: ["rawtaintedmeat"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    skeleton_corpse: {
        id: 35,
        name: "一个骸骨尸体",
        resource: ["bone", "bone"],
        carve: true,
        blood: [200, 200, 200],
        skill: "anatomy"
    },
    pirateghost_corpse: {
        id: 36,
        name: "一个海盗幽灵的尸体",
        decay: 5,
        resource: ["ectoplasm"],
        carve: true,
        blood: [250, 250, 250]
    },
    timeskitter_corpse: {
        id: 37,
        name: "一个古老的尸体",
        resource: ["rawmeat", "offal"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    chicken_corpse: {
        id: 38,
        name: "一个鸡的尸体",
        resource: ["feather", "feather", "rawchicken"],
        decay: 55,
        carve: true,
        skill: "anatomy"
    },
    forgeandanvil_unlit: {
        id: 39,
        name: "一个熄灭的锻炉和铁毡",
        resource: ["forgeandanvil"],
        lit: "forgeandanvil_lit",
        blockmove: true
    },
    forgeandanvil_lit: {
        id: 40,
        name: "一个燃烧的锻炉和铁毡",
        decay: 60,
        blockdig: true,
        fire: true,
        blockmove: true,
        revert: "forgeandanvil_unlit"
    },
    woodenchest_unlocked: {
        id: 41,
        name: "一个木箱",
        resource: ["woodenchest"],
        blockmove: true,
        container: true,
        maxWeight: 75
    },
    woodenchest_locked: {
        id: 41,
        name: "一个上锁的木箱",
        blockdig: true,
        blockmove: true,
        container: true,
        locked: true
    },
    tallgrass: {
        id: 42,
        name: "草丛",
        spread: 20,
        resource: ["grassseeds", "grassblades"],
        skill: "botany",
        allowedtiles: ["dirt", "grass"],
        garden: true
    },
    pineappleplant: {
        id: 43,
        name: "一个菠萝",
        resource: ["pineapple"],
        skill: "botany"
    },
    trapdoorspider_corpse: {
        id: 44,
        name: "一个活板门的蜘蛛尸体",
        resource: ["deadspider"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    fireelemental_corpse: {
        id: 45,
        name: "一堆灰烬",
        resource: ["coal", "meltedamber"],
        decay: 20,
        carve: true,
        blood: [210, 125, 20],
        skill: "mining"
    },
    wildonion_ground: {
        id: 46,
        name: "一个野洋葱",
        resource: ["wildonion"],
        skill: "botany",
        allowedtiles: ["grass", "dirt"],
        spread: 2,
        garden: true,
        trample: true
    },
    torchstand_unlit: {
        id: 47,
        name: "熄灭的火炬架",
        resource: ["torchstand"],
        lit: "torchstand_lit"
    },
    torchstand_lit: {
        id: 48,
        name: "燃烧的火炬架",
        decay: 75,
        blockdig: true,
        fire: true,
        revert: "torchstand_unlit"
    },
    cotton_ground: {
        id: 49,
        name: "棉花",
        spread: 3,
        resource: ["cotton"],
        skill: "botany",
        allowedtiles: ["grass", "dirt"],
        garden: true,
        trample: true
    },
    hobgoblin_corpse: {
        id: 50,
        name: "怪物的尸体",
        resource: ["rawmeat", "bones", "offal"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    deadfall_set: {
        id: 51,
        name: "设置一个大型陷阱",
        skill: "trapping",
        resource: ["deadfall"],
        trap: true
    },
    snare_set: {
        id: 52,
        name: "设置一个小型陷阱",
        skill: "trapping",
        resource: ["snare"],
        trap: true
    },
    snare_set_monster: {
        id: 52,
        name: "设置一个小型陷阱",
        resource: ["snare"],
        trap: true
    },
    solarstill_set: {
        id: 53,
        name: "太阳能蒸馏器",
        skill: "alchemy",
        resource: ["solarstill"],
        decay: -1,
        waterSource: true
    },
    stonewaterstill_unlit: {
        id: 54,
        name: "一个熄灭的泵",
        resource: ["stonewaterstill"],
        decay: -1,
        lit: "stonewaterstill_lit",
        waterSource: true
    },
    stonewaterstill_lit: {
        id: 55,
        name: "一个点亮的泵",
        decay: 15,
        blockdig: true,
        fire: true,
        revert: "stonewaterstill_unlit"
    },
    livingmushroom_corpse: {
        id: 56,
        name: "一个活生生的蘑菇的尸体",
        resource: ["mushrooms", "mushrooms"],
        decay: 150,
        carve: true,
        skill: "mycology",
        blood: [145, 115, 100]
    },
    kraken_corpse: {
        id: 57,
        name: "一个海怪的尸体",
        resource: ["rawfishsteak", "rawfishsteak"],
        decay: 30,
        carve: true,
        skill: "anatomy"
    },
    monsteridol: {
        id: 58,
        name: "一个怪物的神像",
        resource: ["monsteridol"],
        blockmove: true
    },
    woodenfence: {
        id: 59,
        name: "木栅栏",
        resource: ["woodenfence"],
        blockmove: true
    },
    harpy_corpse: {
        id: 60,
        name: "一个鹰身女妖的尸体",
        resource: ["rawchicken", "feather", "feather"],
        decay: 95,
        carve: true,
        skill: "anatomy"
    },
    firesource: {
        name: "火源"
    }
};
