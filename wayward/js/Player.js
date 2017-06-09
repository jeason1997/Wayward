/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

/**
 * Make us a player!
 * @constructor
 */
function Player() {

    this.actions = new Actions();
    this.attack = 0;
    this.attackFromEquip = 0;
    this.characterSprite = new Image();
    this.characterSprite.src = 'images/character.png';
    this.crafted = [];
    this.craftSorted = 0;
    this.defense = {
        base: 0,
        resist: {
            blunt: 0,
            piercing: 0,
            fire: 0,
            slashing: 0
        },
        vulnerable: {
            blunt: 0,
            piercing: 0,
            fire: 0,
            slashing: 0
        }
    };
    this.dehydration = 0;
    this.dexterity = 0;
    //Default savable dialog window locations and sizes
    this.dialog = {
        craftwindow: {
            x: ui.$window.width() - 220,
            y: 170,
            w: 210,
            h: 190,
            open: false
        },
        equipmentwindow: {
            x: ui.$window.width() - 425,
            y: 170,
            w: 200,
            h: 190,
            open: false
        },
        inventorywindow: {
            x: ui.$window.width() - 425,
            y: 10,
            w: 415,
            h: 155,
            open: false
        },
        containerwindow: {
            x: ui.$window.width() - 650,
            y: 10,
            w: 215,
            h: 355,
            open: false
        },
        messageswindow: {
            x: 10,
            y: 10,
            w: 415,
            h: 200,
            open: false
        },
        milestoneswindow: {
            x: 220,
            y: ui.$window.height() - 325,
            w: 200,
            h: 200,
            open: false
        },
        optionswindow: {
            x: ui.$window.width() / 2 - 250,
            y: ui.$window.height() / 2 - 100,
            w: 500,
            h: 220,
            open: false
        },
        skillswindow: {
            x: 10,
            y: ui.$window.height() - 325,
            w: 200,
            h: 200,
            open: false
        }
    };
    this.died = false;
    this.direction = {
        x: 0,
        y: 0
    };
    this.health = 0;
    //Save whether or not hints have been seen or not
    this.hintseen = {
        bleeding: false,
        bugs: false,
        burning: false,
        cavedarkness: false,
        corpsecarving: false,
        crafting: false,
        death: false,
        dehydration: false,
        durability: false,
        eatingbadthings: false,
        environmentalpickup: false,
        fastpickup: false,
        healthreplenishment: false,
        helditems: false,
        milestones: false,
        nightfall: false,
        poisoned: false,
        secondaryuses: false,
        staminareplenishment: false,
        useatool: false,
        weightlimit: false,
        welcometowayward: false
    };
    this.hunger = 0;
    this.invItems = [];
    this.light = 0;
    this.lightBonus = 0;
    this.lightSwitch = 0;
    //Milestones
    this.milestones = {
        abnormalizer: {
            name: "反常",
            description: "Killed 25 aberrant creatures.",
            amount: 25,
            skills: ["tactics", "parrying", "trapping", "archery"]
        },
        chef: {
            name: "厨师",
            description: "Cooked 25 food items.",
            amount: 25,
            skills: ["cooking"]
        },
        crafter: {
            name: "工匠",
            description: "Crafted 250 items.",
            amount: 250,
            skills: ["tinkering", "fletching", "woodworking", "blacksmithing", "stonecrafting", "tailoring", "leatherworking", "claythrowing", "glassblowing", "cooking"]
        },
        extincteur: {
            name: "灭火器",
            description: "Killed 1000 creatures.",
            amount: 1000,
            skills: ["tactics", "parrying", "trapping", "archery"]
        },
        gardener: {
            name: "园丁",
            description: "Planted 50 plants or mushrooms.",
            amount: 50,
            skills: ["botany", "mycology"]
        },
        gatherer: {
            name: "采集者",
            description: "Gathered 1000 times.",
            amount: 1000,
            skills: ["mining", "lumberjacking", "fishing"]
        },
        hunter: {
            name: "猎人",
            description: "Killed 100 creatures.",
            amount: 100,
            skills: ["tactics", "parrying", "trapping", "archery"]
        },
        modder: {
            name: "Mod制作者",
            description: "Loaded 10 modifications.",
            amount: 10
        },
        locksmith: {
            name: "锁匠",
            description: "Lockpicked 10 locks.",
            amount: 10,
            skills: ["lockpicking"]
        },
        reaperofsouls: {
            name: "灵魂修复",
            description: "Killed 50 ghosts and harvested their corpses.",
            amount: 50
        },
        survivor: {
            name: "幸存者",
            description: "Survived for 10000 turns.",
            amount: 10000,
            skills: ["swimming", "camping", "anatomy"]
        },
        thrower: {
            name: "投掷者",
            description: "Thrown 500 items.",
            amount: 500,
            skills: ["throwing"]
        },
        trapper: {
            name: "看门工",
            description: "Injured 10 creatures with traps.",
            amount: 10,
            skills: ["trapping"]
        },
        treasurehunter: {
            name: "宝藏猎人",
            description: "Dug or fished up 10 treasure chests.",
            amount: 10,
            skills: ["cartography", "mining", "fishing"]
        }
    };
    this.milestoneCount = {
        abnormalizer: {
            amount: 0,
            type: ""
        },
        chef: {
            amount: 0,
            type: ""
        },
        crafter: {
            amount: 0,
            type: ""
        },
        extincteur: {
            amount: 0,
            type: ""
        },
        gardener: {
            amount: 0,
            type: ""
        },
        gatherer: {
            amount: 0,
            type: ""
        },
        hunter: {
            amount: 0,
            type: ""
        },
        locksmith: {
            amount: 0,
            type: ""
        },
        modder: {
            amount: 0,
            type: ""
        },
        reaperofsouls: {
            amount: 0,
            type: ""
        },
        survivor: {
            amount: 0,
            type: ""
        },
        thrower: {
            amount: 0,
            type: ""
        },
        trapper: {
            amount: 0,
            type: ""
        },
        treasurehunter: {
            amount: 0,
            type: ""
        }
    };
    this.monsterSpawner = 160;
    this.respawned = false;
    this.skills = {
        alchemy: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        anatomy: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        archery: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        blacksmithing: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        botany: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        camping: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        cartography: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        claythrowing: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        cooking: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        fishing: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        fletching: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        glassblowing: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        leatherworking: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        lockpicking: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        lumberjacking: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        mining: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        mycology: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        parrying: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        stonecrafting: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        swimming: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        tactics: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        tailoring: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        throwing: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        tinkering: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        trapping: {
            percent: 0,
            bonus: 0,
            core: 0
        },
        woodworking: {
            percent: 0,
            bonus: 0,
            core: 0
        }
    };
    this.skillTypes = {
        alchemy: {
            name: "炼金",
            attribute: "hunger",
            description: "使用的化学混合物品影响制作成品的成功率和质量."
        },
        anatomy: {
            name: "解剖",
            attribute: "hunger",
            description: "提高动物健康的精度 (通过右键点击).<br />减少出血的机会.<br />提高健康药剂的效果."
        },
        archery: {
            name: "箭术",
            attribute: "health",
            description: "当使用弓和箭时增加攻击损害、 精度和最大值范围."
        },
        blacksmithing: {
            name: "锻造",
            attribute: "health",
            description: "锻造时使用的金属质量决定了锻造品的成功率，修理和品质."
        },
        botany: {
            name: "植物学",
            attribute: "hunger",
            description: "提高种植植物的几率.<br />提高吃植物型消耗品时带来的有效性.<br />当你不小心践踏到植物时，减少踩到植物的几率."
        },
        camping: {
            name: "露营",
            attribute: "stamina",
            description: "当你在睡袋中休息时，提高每回合在睡袋中的睡眠质量.<br />增加生火的几率."
        },
        cartography: {
            name: "绘图",
            attribute: "stamina",
            description: "增加成功读取破解地图的几率.<br />减少阅读破旧地图时的模糊."
        },
        claythrowing: {
            name: "史莱姆投掷者",
            attribute: "stamina",
            description: "制陶时使用的陶土质量决定了制造品的成功率和品质."
        },
        cooking: {
            name: "烹饪",
            attribute: "hunger",
            description: "减少煮熟的食物产生的影响."
        },
        fishing: {
            name: "钓鱼",
            attribute: "stamina",
            description: "增加成功抓到鱼的几率. 当使用钓竿时，增加使用的最大范围.<br />增加你可以搜集宝藏的范围."
        },
        fletching: {
            name: "造箭 & 弓箭制作",
            attribute: "stamina",
            description: "箭，弓和吊索的技能等级影响他们的质量和维修成功率."
        },
        glassblowing: {
            name: "烧制玻璃",
            attribute: "stamina",
            description: "当烧制玻璃时使用的材料质量，影响玻璃成品的质量和成功率."
        },
        leatherworking: {
            name: "制革",
            attribute: "health",
            description: "制作皮革时使用的材料质量，影响制革成品的质量，维修和成功率."
        },
        lockpicking: {
            name: "撬锁",
            attribute: "stamina",
            description: "增加成功打开箱子的几率."
        },
        lumberjacking: {
            name: "伐木",
            attribute: "health",
            description: "增加砍伐树木获得资源的几率.<br />降低砍伐树木时所消耗的耐力."
        },
        mining: {
            name: "采矿",
            attribute: "health",
            description: "增加的采矿时获得资源的几率.<br />降低采矿时所消耗的耐力.<br />增加你搜集宝藏的范围."
        },
        mycology: {
            name: "真菌学",
            attribute: "hunger",
            description: "增加种植蘑菇的机会.<br />增加吃蘑菇型消耗品时的有效性.<br />当你不小心践踏到蘑菇时，减少踩到蘑菇的几率."
        },
        parrying: {
            name: "盾防",
            attribute: "health",
            description: "增加你基地的防御值.<br />增加你在战斗时减少伤害的几率."
        },
        stonecrafting: {
            name: "石艺",
            attribute: "health",
            description: "当制作石头制品时，你所使用的石头质量将决定你石头制品的质量，维修和成功率."
        },
        swimming: {
            name: "游泳",
            attribute: "stamina",
            description: "增加在水里的移动速度.<br />降低在水里移动时消耗的耐力的几率."
        },
        tactics: {
            name: "战术",
            attribute: "health",
            description: "增加你的基础攻击值.<br />增加在战斗时击中敌人的几率.<br />降低在战斗时消耗耐力的几率."
        },
        tailoring: {
            name: "裁缝",
            attribute: "stamina",
            description: "制作布制品时使用的材料质量，决定你制作成品的质量，维修和成功率."
        },
        throwing: {
            name: "投掷",
            attribute: "stamina",
            description: "增加投掷时的攻击力，准确性和最大的攻击范围."
        },
        tinkering: {
            name: "铸补",
            attribute: "stamina",
            description: "制作的方法和制作的材料影响其修复质量，项目的成功率."
        },
        trapping: {
            name: "诱捕",
            attribute: "stamina",
            description: "增加捕捉生物的成功率和伤害.<br />减少设置陷阱的几率和陷阱对你造成的伤害."
        },
        woodworking: {
            name: "木工",
            attribute: "health",
            description: "制作木工制品时使用的材料质量，决定你制作成品的质量，维修和成功率."
        }
    };
    this.sorted = 0;
    this.stamina = 0;
    this.starvation = 0;
    this.status = {
        bleeding: false,
        burning: false,
        poisoned: false
    };
    this.stepCounter = 0;
    this.strength = 0;
    this.talent = 0;
    this.thirst = 0;
    this.turns = 0;
    this.weight = 0;
    this.x = 0;
    this.y = 0;

    /**
     * Check for active attributes.
     */
    this.attributes = function () {
        this.attack = Utilities.roundNumber(this.skills.tactics.percent / 10, 0) + 1;
        ui.$attack.html(this.attack + this.attackFromEquip);
        ui.$defense.html(this.defense.base);
        ui.$talent.html(this.talent);

        var statusOutput = "";
        if (this.status.bleeding) {
            statusOutput += Messages.bleeding;
        }
        if (this.status.poisoned) {
            statusOutput += Messages.poisoned;
        }
        if (this.status.burning) {
            statusOutput += Messages.burningPain;
        }
        if (this.health < this.strength / 10) {
            statusOutput += Messages.nearDeath;
        }
        if (this.stamina < this.dexterity / 10) {
            statusOutput += Messages.exhausted;
        }
        if (this.hunger < this.starvation / 10) {
            statusOutput += Messages.starving;
        }
        if (this.thirst < this.dehydration / 10) {
            statusOutput += Messages.dehydrated;
        }
        if (!statusOutput) {
            statusOutput = Messages.healthy;
            ui.$status.removeClass('bad');
        } else {
            ui.$status.addClass('bad');
        }
        statusOutput = statusOutput.substring(0, statusOutput.length - 2);
        ui.$status.html(statusOutput);
    };
    /**
     * Check the players inventory for the first instance of an item with the given group type or item type and return its id.
     * Can be run with count set as true to return an int of counted items instead of stopping on a single match.
     * Can be run with the ignore paramter to ignore a certain item id.
     * @param groupType
     * @param count
     * @param ignore
     * @returns {boolean|object}
     */
    this.isItemInInventory = function (groupType, count, ignore) {
        var hasItem = false;
        var itemCount = 0;
        for (var playerItem = 0; playerItem < this.invItems.length; playerItem++) {
            if (this.invItems[playerItem] !== undefined && this.invItems[playerItem].type && playerItem !== ignore) {
                var itemType = this.invItems[playerItem].type;
                //In container in inventory?
                if (items[itemType].container) {
                    var cont = this.invItems[playerItem].container;
                    if (cont) {
                        var containerLength = cont.length;
                        for (var contItem = 0; contItem < containerLength; contItem++) {
                            if (cont[contItem]) {
                                //Type match
                                if (cont[contItem].type === groupType) {
                                    hasItem = true;
                                    itemCount++;
                                    break;
                                }
                                //Group match
                                if (items[cont[contItem].type].group) {
                                    for (var itemGroup = 0; itemGroup < items[cont[contItem].type].group.length; itemGroup++) {
                                        if (items[cont[contItem].type].group[itemGroup] === groupType) {
                                            hasItem = true;
                                            itemCount++;
                                            break;
                                        }
                                    }
                                }
                                if (hasItem && !count) {
                                    break;
                                }
                            }
                        }
                    }
                    if (hasItem && !count) {
                        return {
                            itemId: contItem,
                            containerId: playerItem,
                            type: cont[contItem].type
                        };
                    }
                }
                //In inventory?
                //Type match
                if (itemType === groupType) {
                    hasItem = true;
                    itemCount++;
                } else if (items[itemType].group) {
                    //Group match
                    for (itemGroup = 0; itemGroup < items[itemType].group.length; itemGroup++) {
                        if (items[itemType].group[itemGroup] === groupType) {
                            hasItem = true;
                            itemCount++;
                            break;
                        }
                    }
                }
                if (hasItem && !count) {
                    return {
                        itemId: playerItem,
                        containerId: false,
                        type: itemType
                    };
                }
            }
        }
        //If we are in item counting mode, return an int
        if (count) {
            return itemCount;
        }
        return false;
    };
    /**
     * Improve a skill, also has a chance to improve a base stat.
     * @param skillType {string|boolean}
     * @param mod {number|boolean}
     * @param bypass {boolean}
     */
    this.skillGain = function (skillType, mod, bypass) {

        //Chance of raising skill is equal of the amount of skill you do have, inverted
        var skillChance = Math.floor(Math.random() * 100 + 1);
        //Can't go over 100% skill (natively)
        if (skillType && this.skills[skillType].percent <= skillChance && this.skills[skillType].percent < 100 || bypass) {

            if (!mod) {
                if (this.skills[skillType].percent < 5 && this.talent < 4000) {
                    mod = 1;
                } else if (this.skills[skillType].percent < 10 && this.talent < 8000) {
                    mod = 0.5;
                } else if (this.skills[skillType].percent < 20 && this.talent < 16000) {
                    mod = 0.4;
                } else if (this.skills[skillType].percent < 40 && this.talent < 32000) {
                    mod = 0.3;
                } else if (this.skills[skillType].percent < 80 && this.talent < 64000) {
                    mod = 0.2;
                } else {
                    mod = 0.1;
                }
            }

            //Double skill gain on daily challenge
            if (game.dailyChallenge) {
                mod = mod * 2;
            }

            this.skills[skillType].core = Utilities.roundNumber(this.skills[skillType].core + mod, 2);
            //Never raise over 100 in skill
            if (this.skills[skillType].core > 100) {
                this.skills[skillType].core = 100;
            }
            this.skills[skillType].percent = this.skills[skillType].core + this.skills[skillType].bonus;

            this.talent = this.talent + (mod * 100);
            this.attributes();

            ui.message("skillGain", "skill", [this.skillTypes[skillType].name, this.skills[skillType].percent]);
        }

        if (ui.$skillsWindow.dialog("isOpen") === true) {
            var skillOutput = "";
            var skillsKey = Object.keys(this.skills);
            for (var skillName = 0; skillName < skillsKey.length; skillName++) {
                if (this.skills[skillsKey[skillName]].core > 0 || this.skills[skillsKey[skillName]].bonus > 0) {
                    this.skills[skillsKey[skillName]].percent = this.skills[skillsKey[skillName]].core + this.skills[skillsKey[skillName]].bonus;
                    skillOutput += "<p class='tooltip' data-skill='" + skillsKey[skillName] + "'>" + this.skillTypes[skillsKey[skillName]].name + ": " + this.skills[skillsKey[skillName]].percent + "%</p>";
                }
            }
            ui.$skills.html(skillOutput);
        }

        if (skillType) {
            //Chance of stat gain - even if no skill gain (or are maxed out)
            this.statGain(this.skillTypes[skillType].attribute, false);
        }
    };
    /**
     * Check the players stamina and affect health if low.
     */
    this.staminaCheck = function () {
        if (this.stamina <= 0) {
            ui.message("exhaustion", "bad");
            ui.textAbove("-1", 255, 0, 0);
            audio.queueSfx('hurt');
            this.health -= 1;
            this.stamina = 1;
        }
    };
    /**
     * Check the players weight and slow them down and reduce stamina if over burdened
     */
    this.checkWeight = function () {
        if (player.weight > player.strength + 15) {
            ui.message("overburdened", "bad");
            player.stamina -= Math.round((player.weight - player.strength) / 2);
            game.delay = 20;
            if (ui.options.hints && !player.hintseen.weightlimit) {
                ui.hintDisplay("weightlimit");
            }
        }
    };
    /**
     * Improve one of the core player stats.
     * @param stat
     * @param bypass
     */
    this.statGain = function (stat, bypass) {
        switch (stat) {
            case "stamina":
                if (Math.floor(Math.random() * (30 + this.dexterity) + 1) === 1 || bypass) {
                    this.dexterity++;
                    ui.message("dexterityGain", "stat");
                } else {
                    return;
                }
                break;
            case "hunger":
                if (Math.floor(Math.random() * (100 + this.starvation) + 1) === 1 || bypass) {
                    this.starvation++;
                    this.dehydration++;
                    ui.message("metabolismGain", "stat");
                } else {
                    return;
                }
                break;
            case "health":
                if (Math.floor(Math.random() * (60 + this.strength) + 1) === 1 || bypass) {
                    this.strength++;
                    ui.message("strengthGain", "stat");
                } else {
                    return;
                }
                break;
        }
        this.talent = this.talent + 500;
        audio.queueSfx('exceptional');
        ui.textAbove("+1", 255, 153, 0);
    };
    /**
     * Load the player properties back into the player from the saved player.
     * @param playerToLoad
     */
    this.loadPlayerFromSave = function (playerToLoad) {
        player.attack = playerToLoad.attack;
        player.attackFromEquip = playerToLoad.attackFromEquip;
        player.crafted = playerToLoad.crafted;
        player.dexterity = playerToLoad.dexterity;
        player.defense = playerToLoad.defense;
        player.dialog = playerToLoad.dialog;
        player.died = playerToLoad.died;
        player.health = playerToLoad.health;
        player.hunger = playerToLoad.hunger;
        player.thirst = playerToLoad.thirst;
        player.monsterSpawner = playerToLoad.monsterSpawner;
        player.lightSwitch = playerToLoad.lightSwitch;
        player.milestoneCount = playerToLoad.milestoneCount;
        player.hintseen = playerToLoad.hintseen;
        player.invItems = playerToLoad.invItems;
        player.light = playerToLoad.light;
        player.respawned = playerToLoad.respawned;
        player.skills = playerToLoad.skills;
        player.sorted = playerToLoad.sorted;
        player.status = playerToLoad.status;
        player.craftSorted = playerToLoad.craftSorted;
        player.stamina = playerToLoad.stamina;
        player.starvation = playerToLoad.starvation;
        player.dehydration = playerToLoad.dehydration;
        player.stepCounter = playerToLoad.stepCounter;
        player.strength = playerToLoad.strength;
        player.talent = playerToLoad.talent;
        player.turns = playerToLoad.turns;
        player.weight = playerToLoad.weight;
        player.lightBonus = playerToLoad.lightBonus;
        player.direction = playerToLoad.direction;
        player.x = playerToLoad.x;
        player.y = playerToLoad.y;
    };
    /**
     * Creates an object containing all the player properties we need to save to localStorage and returns it for saving.
     * @returns {object}
     */
    this.createPlayerToSave = function () {
        return {
            attack: player.attack,
            attackFromEquip: player.attackFromEquip,
            crafted: player.crafted,
            dexterity: player.dexterity,
            defense: player.defense,
            dialog: player.dialog,
            died: player.died,
            health: player.health,
            hunger: player.hunger,
            thirst: player.thirst,
            monsterSpawner: player.monsterSpawner,
            lightSwitch: player.lightSwitch,
            milestoneCount: player.milestoneCount,
            hintseen: player.hintseen,
            invItems: player.invItems,
            light: player.light,
            respawned: player.respawned,
            skills: player.skills,
            sorted: player.sorted,
            status: player.status,
            craftSorted: player.craftSorted,
            stamina: player.stamina,
            starvation: player.starvation,
            dehydration: player.dehydration,
            stepCounter: player.stepCounter,
            strength: player.strength,
            talent: player.talent,
            turns: player.turns,
            weight: player.weight,
            lightBonus: player.lightBonus,
            direction: player.direction,
            x: player.x,
            y: player.y
        };
    };
    this.calculateEquipmentStats = function () {

        var playerSkillsKey = Object.keys(this.skills);
        for (var skill = 0; skill < playerSkillsKey.length; skill++) {
            this.skills[playerSkillsKey[skill]].bonus = 0;
        }

        this.attackFromEquip = 0;
        this.lightbonus = 0;

        this.defense = {
            base: Utilities.roundNumber(this.skills.parrying.percent / 10, 0),
            blunt: 0,
            piercing: 0,
            fire: 0,
            slashing: 0,
            resist: {
                blunt: 0,
                piercing: 0,
                fire: 0,
                slashing: 0
            },
            vulnerable: {
                blunt: 0,
                piercing: 0,
                fire: 0,
                slashing: 0
            }
        };

        var inventoryCount = this.invItems.length;
        for (var item = 0; item < inventoryCount; item++) {
            if (this.invItems[item] !== undefined && this.invItems[item] !== null) {
                var itemType = this.invItems[item].type;
                if (this.invItems[item].equipped) {
                    if (items[itemType].defense) {
                        this.defense.base += items[itemType].defense.base;
                        var resistCount = items[itemType].defense.resist.length;
                        if (resistCount > 0) {
                            for (var resist = 0; resist < resistCount; resist++) {
                                switch (items[itemType].defense.resist[resist][0]) {
                                    case 'slashing':
                                        this.defense.resist.slashing += items[itemType].defense.resist[resist][1];
                                        break;
                                    case 'blunt':
                                        this.defense.resist.blunt += items[itemType].defense.resist[resist][1];
                                        break;
                                    case 'piercing':
                                        this.defense.resist.piercing += items[itemType].defense.resist[resist][1];
                                        break;
                                    case 'fire':
                                        this.defense.resist.fire += items[itemType].defense.resist[resist][1];
                                        break;
                                }
                            }
                        }
                        var vulnerabilityCount = items[itemType].defense.vulnerable.length;
                        if (vulnerabilityCount > 0) {
                            for (var vulnerability = 0; vulnerability < vulnerabilityCount; vulnerability++) {
                                switch (items[itemType].defense.vulnerable[vulnerability][0]) {
                                    case 'slashing':
                                        this.defense.vulnerable.slashing += items[itemType].defense.vulnerable[vulnerability][1];
                                        break;
                                    case 'blunt':
                                        this.defense.vulnerable.blunt += items[itemType].defense.vulnerable[vulnerability][1];
                                        break;
                                    case 'piercing':
                                        this.defense.vulnerable.piercing += items[itemType].defense.vulnerable[vulnerability][1];
                                        break;
                                    case 'fire':
                                        this.defense.vulnerable.fire += items[itemType].defense.vulnerable[vulnerability][1];
                                        break;
                                }
                            }
                        }
                    }
                    if (items[itemType].attack) {
                        this.attackFromEquip += items[itemType].attack;
                    }
                    if (items[itemType].onequip) {
                        this.lightbonus += items[itemType].onequip[1];
                    }
                    if (this.invItems[item].props) {
                        if (this.invItems[item].props[0]) {
                            this.skills[this.invItems[item].props[0]].bonus += this.invItems[item].props[1];
                        }
                    }
                }
            }
        }
        this.defense.blunt = this.defense.resist.blunt - this.defense.vulnerable.blunt;
        this.defense.fire = this.defense.resist.fire - this.defense.vulnerable.fire;
        this.defense.piercing = this.defense.resist.piercing - this.defense.vulnerable.piercing;
        this.defense.slashing = this.defense.resist.slashing - this.defense.vulnerable.slashing;

        this.skillGain(false, false, false);
    };
}

