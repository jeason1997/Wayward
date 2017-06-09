/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

/**
 * All our player action functions go here.
 * @constructor
 */
function Actions() {
    /**
     * Attack a monster with the selected weapon.
     * @param weaponId {int}
     * @param attackType {string}
     */
    this.attack = function (weaponId, attackType) {
        var monsterDead = false;
        var monster;
        var rightHand = false;
        var noDamage = false;
        var weapon;
        var ammo;
        var range = 0;
        var mobCheck = false;
        var attackSkill = 'tactics';
        var offsets = {};

        //Just a normal melee attack, try with right hand first, left hand called at end of attack
        if (!weaponId && weaponId !== 0) {
            rightHand = true;
            var $rightHand = $('#righthand');
            if ($rightHand.find('li').attr('data-itemid')) {
                weaponId = parseInt($rightHand.find('li').attr('data-itemid'), 10);
                attackType = 'melee';
            } else {
                //Attack with bare hands.
                attackType = 'hand-to-hand';
            }
        }

        switch (attackType) {
            case 'hand-to-hand':
                weapon = {
                    name: Messages.fist,
                    attack: 0,
                    damageType: ['blunt']
                };
                monster = tile[player.x + player.direction.x][player.y + player.direction.y].monster;
                break;
            case 'melee':
                weapon = getItemFromId(weaponId, true, false);
                monster = tile[player.x + player.direction.x][player.y + player.direction.y].monster;
                break;
            case 'shoot':
            case 'sling':
            case 'fire':
                var ammoId;
                if (attackType === "shoot") {
                    ammoId = player.isItemInInventory('arrow');
                    attackSkill = 'archery';
                } else {
                    //Slings and pistol
                    ammoId = player.isItemInInventory('bullet');
                    attackSkill = 'throwing';
                    //TODO: New Firearms skill eventually
                    //Let's just set it as a shoot type after - everything is the same.
                    attackType = "shoot";
                }

                if (ammoId) {
                    ammo = getItemFromId(ammoId.itemId, true, ammoId.containerId);
                    weapon = getItemFromId(weaponId, true, false);
                    range = rangeFinder(weapon.ranged.range, player.skills.archery.percent);
                    mobCheck = checkForMobInRange(range);

                    //Always damage the bow on fire
                    damageItem(weaponId);

                    if (mobCheck.found) {
                        monster = mobCheck.id;
                    } else {
                        weapon = null;
                        player.skillGain(attackSkill, 0.1, false);
                        if (mobCheck.obstacle) {
                            ui.message("fireAmmoObstacle", 'bad', [ammo.name]);
                        } else {
                            ui.message("fireAmmo", 'normal', [ammo.name]);
                        }
                        offsets = getLocationOffsets(mobCheck.x, mobCheck.y);
                        createParticles(tiletypes[tile[mobCheck.x][mobCheck.y].type].particles[0], tiletypes[tile[mobCheck.x][mobCheck.y].type].particles[1], tiletypes[tile[mobCheck.x][mobCheck.y].type].particles[2], tile[mobCheck.x][mobCheck.y].type, offsets.x, offsets.y, 3);
                    }

                    ammo.mindur--;
                    if (ammo.mindur >= 0) {
                        //See if the ammo sinks.
                        if (tiletypes[tile[mobCheck.x][mobCheck.y].type].water) {
                            removeItem(ammoId, 'INV', false);
                            audio.queueSfx('water');
                        } else {
                            placeItem({
                                type: ammo.type,
                                x: mobCheck.x,
                                y: mobCheck.y,
                                decay: ammo.decay,
                                quality: ammo.quality,
                                mindur: ammo.mindur,
                                maxdur: ammo.maxdur,
                                props: ammo.props
                            }, 'TILE', false);
                        }
                    } else {
                        ui.message("brokenAmmo", "miss", [ammo.name]);
                    }
                    removeItem(ammoId.itemId, 'INV', ammoId.containerId);
                    audio.queueSfx('bow');

                } else {
                    ui.message('noAmmo', 'normal');
                    return;
                }
                break;
            case 'throwItem':
                attackSkill = 'throwing';
                weapon = getItemFromId(weaponId, false, false);
                //Don't allow throwing really heavy items without the proper strength
                if (weapon.weight * 3 >= player.strength) {
                    ui.message('notEnoughStrength', 'normal');
                    return;
                }
                //Make range based on weight of item
                var throwingRange = Math.floor(4 / weapon.weight);
                if (throwingRange > 5) {
                    throwingRange = 5;
                }
                range = rangeFinder(throwingRange, player.skills.throwing.percent);
                mobCheck = checkForMobInRange(range);

                if (mobCheck.found) {
                    monster = mobCheck.id;
                } else {
                    if (mobCheck.obstacle) {
                        ui.message("throwObstacle", 'bad', [weapon.name]);
                    } else {
                        ui.message("throwItem", 'normal', [weapon.name]);
                    }
                    player.skillGain(attackSkill, 0.1, false);
                    offsets = getLocationOffsets(mobCheck.x, mobCheck.y);
                    createParticles(tiletypes[tile[mobCheck.x][mobCheck.y].type].particles[0], tiletypes[tile[mobCheck.x][mobCheck.y].type].particles[1], tiletypes[tile[mobCheck.x][mobCheck.y].type].particles[2], tile[mobCheck.x][mobCheck.y].type, offsets.x, offsets.y, 3);
                }

                weapon.mindur--;
                if (weapon.mindur >= 0) {
                    if (tiletypes[tile[mobCheck.x][mobCheck.y].type].water) {
                        audio.queueSfx('water');
                    } else {
                        placeItem({
                            type: weapon.type,
                            x: mobCheck.x,
                            y: mobCheck.y,
                            decay: weapon.decay,
                            quality: weapon.quality,
                            mindur: weapon.mindur,
                            maxdur: weapon.maxdur,
                            props: weapon.props,
                            container: weapon.container
                        }, 'TILE', false);
                    }
                } else {
                    ui.message("brokenImpact", 'bad', [weapon.name]);
                    if (weapon.container && weapon.container.length > 0) {
                        for (var itemInContainer = 0; itemInContainer < weapon.container.length; itemInContainer++) {
                            //initially just drop the items in a pile.
                            var containerItem = weapon.container[itemInContainer];
                            if (containerItem) {
                                placeItem({
                                    type: containerItem.type,
                                    x: mobCheck.x + Utilities.randomFromInterval(-1, 1),
                                    y: mobCheck.y + Utilities.randomFromInterval(-1, 1),
                                    decay: containerItem.decay,
                                    quality: containerItem.quality,
                                    mindur: containerItem.mindur,
                                    maxdur: containerItem.maxdur,
                                    props: containerItem.props,
                                    container: containerItem.container
                                }, 'TILE', false);
                            }
                        }
                    }
                }
                removeItem(weaponId, 'INV', false);
                audio.queueSfx('throw');
                addMilestone("thrower");

                //Close the container if it was thrown and open
                if (game.containerOpened.id === weaponId) {
                    closeContainer();
                }

                if (!monster) {
                    weapon = null;
                }
                break;
        }
        if (weapon) {
            var weaponName = '';
            if (typeof ammo === 'undefined') {
                weaponName = weapon.name;
            } else {
                weaponName = ammo.name;
            }
            var monsterType = game.monsters[monster].type;
            var hitChance = Math.floor(Math.random() * 99 + 1);
            if (player.skills[attackSkill].percent >= (hitChance - 50)) {
                var baseDefense = npcs[monsterType].defense.base;
                //Aberrants have a base defense of times 2
                if (game.monsters[monster].aberrant) {
                    baseDefense = baseDefense * 2;
                }
                var resists = npcs[monsterType].defense.resist;
                var resist = 0;
                var vulnerabilities = npcs[monsterType].defense.vulnerable;
                var vulnerable = 0;
                var damageTypes = '';
                if (typeof ammo === 'undefined') {
                    if (weapon.damageType) {
                        damageTypes = weapon.damageType;
                    } else {
                        //Default to blunt for throwing
                        damageTypes = ['blunt'];
                    }
                } else {
                    damageTypes = ammo.damageType;
                }

                for (var dType = 0; dType < damageTypes.length; dType++) {
                    for (var res = 0; res < resists.length; res++) {
                        if (damageTypes[dType] === resists[res][0]) {
                            var resistValue = resists[res][1];
                            switch (resistValue) {
                                case 99:
                                    //Immune
                                    ui.message("immuneMonster", "bad", [weaponName, npcs[monsterType].name]);
                                    noDamage = true;
                                    break;
                                case 100:
                                    //Regenerates
                                    ui.message("healMonster", "bad", [npcs[monsterType].name, weaponName]);
                                    noDamage = true;
                                    healMonster(monster, 'damageTypeRegen');
                                    break;
                                default:
                                    resist += resistValue;
                                    break;
                            }
                        }
                    }
                    for (var vulnerability = 0; vulnerability < vulnerabilities.length; vulnerability++) {
                        if (damageTypes[dType] === vulnerabilities[vulnerability][0]) {
                            vulnerable += vulnerabilities[vulnerability][1];
                        }
                    }
                }

                var weaponAttack;
                switch (attackType) {
                    case 'shoot':
                        weaponAttack = weapon.ranged.attack + ammo.attack;
                        break;
                    case 'throwItem':
                        if (weapon.attack) {
                            weaponAttack = weapon.attack;
                        } else if (weapon.ranged && weapon.ranged.attack) {
                            weaponAttack = weapon.ranged.attack;
                        } else {
                            //Default to a damage based on the weight
                            weaponAttack = Math.floor(weapon.weight / 4);
                            if (weaponAttack <= 0) {
                                weaponAttack = 1;
                            }
                        }
                        break;
                    default:
                        weaponAttack = weapon.attack;
                        break;
                }
                var attackValue = weaponAttack + player.attack + vulnerable;
                var attackOutcome = attackValue - (baseDefense + resist);
                var effectiveness;
                if (vulnerable) {
                    effectiveness = Messages.effective;
                }
                if (resist) {
                    effectiveness = Messages.ineffective;
                }
                if (vulnerable && resist) {
                    effectiveness = Messages.effectiveIneffective;
                }
                if (!vulnerable && !resist) {
                    effectiveness = "";
                }
                if (attackOutcome <= 0) {
                    attackOutcome = 0;
                    var chance = Math.floor(Math.random() * 99 + 1);
                    //10% to cause 1 damage
                    if (chance <= 10) {
                        attackOutcome = 1;
                        noDamage = false;
                    } else {
                        ui.message("noDamage", "bad", [npcs[monsterType].name, weaponName, effectiveness]);
                    }
                }
                audio.queueSfx('hit');
                if (!noDamage && attackOutcome > 0) {
                    ui.message("weaponDamagedMonster", "attack", [npcs[monsterType].name, attackOutcome, weaponName, effectiveness]);
                    var offset = getLocationOffsets(game.monsters[monster].x, game.monsters[monster].y);

                    if (attackType === "throwItem" || attackType === "shoot") {
                        ui.textAbove("-" + attackOutcome, 225, 255, 0, 'target', offset.x, offset.y);
                    } else {
                        ui.textAbove("-" + attackOutcome, 225, 255, 0, 'target');
                    }

                    //Slime splitting
                    if (game.monsters[monster].type === "slime") {
                        if (Math.floor(Math.random() * 8 + 1) === 1) {
                            var monsterX = Math.floor(Math.random() + game.monsters[monster].x - Math.random());
                            var monsterY = Math.floor(Math.random() + game.monsters[monster].y - Math.random());
                            if (spawnMonster("slime", monsterX, monsterY)) {
                                ui.message("slimeSplit", 'bad', [npcs[game.monsters[monster].type].name]);
                            }
                        }
                    }

                    monsterDead = damageMonster(monster, attackOutcome, offset.x, offset.y, false, false);

                    //check for weapon damage.
                    if (attackType !== 'hand-to-hand' && attackType !== "shoot" && attackType !== "throwItem") {
                        damageItem(weaponId);
                    } else {
                        //damage the players hands.
                        if (attackType === 'hand-to-hand') {
                            var hurtChance = Math.floor(Math.random() * 99 + 1);
                            if (player.skills.tactics.percent <= (hurtChance - 75)) {
                                ui.message("hurtHands", "bad", [npcs[monsterType].name]);
                                ui.textAbove("-1", 255, 0, 0);
                                audio.queueSfx('hurt');
                                player.health -= 1;
                            }
                        }
                    }
                    player.skillGain(attackSkill, false, false);
                }
            } else {
                audio.queueSfx('miss');
                ui.message("missedMonster", "miss", [npcs[monsterType].name, weaponName]);
                //Fail gain
                player.skillGain(attackSkill, 0.1, false);
            }
        }

        if (attackType === "shoot" || attackType === "throwItem") {
            if (monster && !monsterDead) {
                game.checkForHiddenMob(game.monsters[monster].x, game.monsters[monster].y);
            }
            passTurn(true);
        }

        var staminaChance = Math.floor(Math.random() * 99 + 1);
        if (player.skills.tactics.percent <= staminaChance) {
            player.stamina -= 1;
        }

        //Try to attack with our left hand now
        if (rightHand && !monsterDead) {
            var $leftHand = $('#lefthand');
            if ($leftHand.find('li').attr('data-itemid')) {
                player.actions.attack(parseInt($leftHand.find('li').attr('data-itemid'), 10), 'melee');
            } else {
                player.actions.attack(0, 'hand-to-hand');
            }
        }

    };
    this.shoot = function (weaponId) {
        this.attack(weaponId, 'shoot');
    };
    this.sling = function (weaponId) {
        this.attack(weaponId, 'sling');
    };
    this.fire = function (weaponId) {
        var blackpowder = player.isItemInInventory('blackpowder');
        if (!blackpowder) {
            ui.message("noBlackPowder", 'bad');
            return;
        }
        removeItem(blackpowder.itemId, 'INV', blackpowder.containerId);
        this.attack(weaponId, 'fire');
    };
    this.throwItem = function (weaponId) {
        this.attack(weaponId, 'throwItem');
    };

    this.pickupEnvItem = function (locationX, locationY) {
        if (tile[locationX][locationY].envItemList) {
            var envItemList = tile[locationX][locationY].envItemList;
            var envListLength = envItemList.length;
            var envItemId = envItemList[envListLength - 1];

            if (!game.isValidPickUp(envItemId)) {
                return;
            }

            //Don't let them try to pick-up corpses
            if (environmentals[envItems[envItemId].type].carve) {
                ui.message("carvingNeeded", 'normal');
            } else {
                var chance = Math.floor(Math.random() * 9 + 1);
                if (chance <= 1) {
                    //HP reduction on pick-up without tool
                    ui.message("hurtGathering", "bad");
                    ui.textAbove("-1", 255, 0, 0);
                    audio.queueSfx('hurt');
                    player.health -= 1;
                    if (ui.options.hints && !player.hintseen.useatool) {
                        ui.hintDisplay("useatool");
                    }
                }
                gatherEnvItems(envItemId);
            }
        }
    };

    /**
     * Carve the corpse on the ground in front of you.
     * @param invId {int}
     */
    this.carve = function (invId) {
        //Check for monsters
        if (tile[player.x + player.direction.x][player.y + player.direction.y].monster) {
            ui.message("inWayCarving", 'normal');
            game.checkForHiddenMob(player.x + player.direction.x, player.y + player.direction.y);
            return;
        }

        //Are there any environmental items there?
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            var itemLocation = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length - 1;
            var envItemId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[itemLocation];

            if (!game.isValidPickUp(envItemId)) {
                return;
            }

            //Only allow carving for corpses
            if (environmentals[envItems[envItemId].type].carve) {
                if (environmentals[envItems[envItemId].type].blood) {
                    createParticles(environmentals[envItems[envItemId].type].blood[0], environmentals[envItems[envItemId].type].blood[1], environmentals[envItems[envItemId].type].blood[2]);
                } else {
                    createParticles(210, 5, 5);
                    placeEnvItem({type: "blood", x: envItems[envItemId].x, y: envItems[envItemId].y, quality: ''});
                }
                ui.message("carveCorpse", 'normal');
                if (envItems[envItemId].type === "pirateghost_corpse") {
                    addMilestone("reaperofsouls");
                }
            }

            //Don't damage tool on blood removal
            if (envItems[envItemId].type === "blood") {
                ui.message("removeBlood", 'normal');
                createParticles(210, 5, 5);
            } else {
                damageItem(invId);
            }

            gatherEnvItems(envItemId);
            return;
        }

        ui.message("nothingToCarve", 'normal');
    };
    /**
     * Decode a treasure map.
     * @param invId {int}
     */
    this.decode = function (invId) {
        if (player.invItems[invId].props[0] === 0 && player.invItems[invId].props[1] === 0) {
            ui.message("noMap", "bad");
        } else {
            var chance = Math.floor(Math.random() * 99 + 1);
            //Minimum of 35% chance
            if (player.skills.cartography.percent >= (chance - 35)) {
                player.skillGain("cartography", false, false);
                makeMiniMap(player.invItems[invId].props[0], player.invItems[invId].props[1], true);
                if (player.skills.cartography.percent >= 50) {
                    ui.message("decodeMapFull", 'normal');
                } else {
                    ui.message("decodeMapPartial", 'normal');
                }
                //Give them a message how close they are.
                if (player.x + 16 >= player.invItems[invId].props[0] && player.y + 16 >= player.invItems[invId].props[1] && player.x - 16 <= player.invItems[invId].props[0] && player.y - 16 <= player.invItems[invId].props[1]) {
                    ui.message("treasureExact", 'normal');
                } else if (player.x + 50 >= player.invItems[invId].props[0] && player.y + 50 >= player.invItems[invId].props[1] && player.x - 50 <= player.invItems[invId].props[0] && player.y - 50 <= player.invItems[invId].props[1]) {
                    ui.message("treasureWalking", 'normal');
                } else if (player.x + 125 >= player.invItems[invId].props[0] && player.y + 125 >= player.invItems[invId].props[1] && player.x - 125 <= player.invItems[invId].props[0] && player.y - 125 <= player.invItems[invId].props[1]) {
                    ui.message("treasureFar", 'normal');
                } else {
                    ui.message("treasureNoWhereNear", 'normal');
                }
                damageItem(invId);
            } else {
                player.skillGain("cartography", 0.1, false);
                ui.message("cantDecipher", "bad");
            }
        }
        game.updateMiniMap = false;
        passTurn(true);
        return true;
    };
    /**
     * Attempts to gather a treasure and spawns the guardians.
     * @param invClass {string}
     * @param invId {int}
     */
    this.gatherTreasure = function (invId, invClass) {

        var skillType;
        if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].water) {
            skillType = "fishing";
        } else {
            skillType = "mining";
        }
        var playerSkill = Math.floor(player.skills[skillType].percent / 10) + 1;

        var treasureFound = false;
        var maps = false;

        //Loop through our treasure maps to see if we are near one.
        var playerItemsKey = Object.keys(player.invItems);
        for (var item = 0; item < playerItemsKey.length; item++) {
            if (player.invItems[playerItemsKey[item]]) {
                if (player.invItems[playerItemsKey[item]].type == "tatteredmap") {
                    maps = true;
                    var propX = player.invItems[playerItemsKey[item]].props[0];
                    var propY = player.invItems[playerItemsKey[item]].props[1];

                    //Increase the range one tile out per every 10 mining/fishing skill.
                    if (player.x + playerSkill >= propX && player.y + playerSkill >= propY && player.x - playerSkill <= propX && player.y - playerSkill <= propY) {

                        //Location blocked
                        if (!tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].passable && !tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].water || tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
                            ui.message("treasureBlocked", "bad");
                            return false;
                        }

                        //Fishing net needed
                        if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].water && invClass !== "fishingnet") {
                            ui.message("treasureNet", "bad");
                            return false;
                        }

                        //Shovel needed
                        if (!tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].water && invClass === "fishingnet") {
                            ui.message("treasureShovel", "bad");
                            return false;
                        }

                        treasureFound = true;

                        placeEnvItem({
                            type: "woodenchest_locked",
                            x: player.x + player.direction.x,
                            y: player.y + player.direction.y
                        });
                        addMilestone("treasurehunter");
                        //5 monsters!
                        var monsterCount = 0;
                        for (var i = 0; i <= 5; i++) {
                            var monsterX = Math.floor(Math.random() * 12 + player.x - Math.random() * 12);
                            var monsterY = Math.floor(Math.random() * 12 + player.y - Math.random() * 12);
                            if (tiletypes[tile[monsterX][monsterY].type].passable) {
                                if (spawnMonster("guardians", monsterX, monsterY)) {
                                    monsterCount++;
                                }
                            } else if (tiletypes[tile[monsterX][monsterY].type].water) {
                                if (spawnMonster("shark", monsterX, monsterY)) {
                                    monsterCount++;
                                }
                            }
                        }
                        audio.queueSfx("rockhit");
                        player.skillGain(skillType, false, false);
                        removeItem(playerItemsKey[item], 'INV', false);
                        damageItem(invId);
                        passTurn(true);
                        ui.message("treasureDig", 'normal');
                        if (monsterCount >= 1) {
                            ui.message("guardians", 'normal');
                        }

                        break;
                    }
                }
            }
        }

        if (!maps) {
            ui.message("noMaps", 'normal');
        } else if (!treasureFound) {
            ui.message("noTreasureRange", 'normal');
        }
    };
    /**
     * Dig at the location directly in front of you.
     * @param invId {int}
     */
    this.dig = function (invId) {

        var tileType = tile[player.x + player.direction.x][player.y + player.direction.y].type;
        var skipDig = false;

        if (tile[player.x + player.direction.x][player.y + player.direction.y].monster || tile[player.x + player.direction.x][player.y + player.direction.y].tileitems) {
            ui.message("inWayDigging", 'normal');
            game.checkForHiddenMob(player.x + player.direction.x, player.y + player.direction.y);
            return;
        }

        //Are there any environmental items there?
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            var envListLength = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length;
            var envItemId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[envListLength - 1];

            if (!game.isValidPickUp(envItemId)) {
                return;
            }

            //Don't let them try to dig corpses
            if (environmentals[envItems[envItemId].type].carve) {
                ui.message("inWayDiggingCorpse", 'normal');
                return;
            } else {
                if (envItems[envItemId].type === "blood") {
                    ui.message("removeBlood", 'normal');
                    createParticles(210, 5, 5);
                } else {
                    createParticles(tiletypes[tileType].particles[0], tiletypes[tileType].particles[1], tiletypes[tileType].particles[2]);
                    damageItem(invId);
                }
                gatherEnvItems(envItemId);
                return;
            }
        }

        if (!tiletypes[tileType].particles || tiletypes[tileType].water || !tiletypes[tileType].passable && !tiletypes[tileType].door) {
            ui.message("cannotDig", 'normal');
            return;
        }

        createParticles(tiletypes[tileType].particles[0], tiletypes[tileType].particles[1], tiletypes[tileType].particles[2]);

        //Re-open cave entrances/exits
        var worldOffset;
        if (player.x <= game.mapSize) {
            worldOffset = game.mapSize;
        } else {
            worldOffset = -game.mapSize;
        }
        if (tile[player.x + player.direction.x][player.y + player.direction.y].type !== "exit" && tile[player.x + player.direction.x + worldOffset][player.y + player.direction.y].type === "exit") {
            //Always remake the exit/entrance if it was filled in from one end
            changeTile({type: "exit"}, player.x + player.direction.x, player.y + player.direction.y, false);
            skipDig = true;
        }

        var staminaChance = Math.floor(Math.random() * 99 + 1);
        if (player.skills.mining.percent <= staminaChance) {
            player.stamina -= 1;
        }
        var chance = Math.floor(Math.random() * 99 + 1);
        //Minimum of 25% chance
        if (player.skills.mining.percent >= (chance - 25) && !skipDig) {
            var itemChance = Math.floor(Math.random() * 99 + 1);
            var newTileType;
            var getItem = false;

            for (var resourceType = 0; resourceType < resource[tileType].length; resourceType++) {
                if (resource[tileType][resourceType]) {

                    if (itemChance <= resource[tileType][resourceType][1]) {
                        var tileChance = Math.floor(Math.random() * 99 + 1);
                        if (resource[tileType][resourceType][2]) {
                            if (!resource[tileType][resourceType][3] || tileChance <= resource[tileType][resourceType][3]) {
                                newTileType = resource[tileType][resourceType][2];
                                if (tiletypes[tileType].shallowWater && tiletypes[tileType].freshWater) {
                                    newTileType = "freshwater";
                                } else if (tiletypes[tileType].shallowWater) {
                                    newTileType = "water";
                                } else {
                                    var tileCoordinates = [
                                        [player.x + player.direction.x + 1, player.y + player.direction.y],
                                        [player.x + player.direction.x - 1, player.y + player.direction.y],
                                        [player.x + player.direction.x, player.y + player.direction.y + 1],
                                        [player.x + player.direction.x, player.y + player.direction.y - 1],
                                        [player.x + player.direction.x + 1, player.y + player.direction.y - 1],
                                        [player.x + player.direction.x - 1, player.y + player.direction.y + 1],
                                        [player.x + player.direction.x + 1, player.y + player.direction.y + 1],
                                        [player.x + player.direction.x - 1, player.y + player.direction.y - 1]
                                    ];
                                    for (var i2 = 0; i2 < tileCoordinates.length; i2++) {
                                        var waterTileType = tile[tileCoordinates[i2][0]][tileCoordinates[i2][1]].type;
                                        if (tiletypes[waterTileType].water || tiletypes[waterTileType].shallowWater) {
                                            //Check that we have at least 5 water tiles
                                            game.fillCount = 0;
                                            game.fillTile = [];
                                            game.checkWaterFill(tileCoordinates[i2][0], tileCoordinates[i2][1], 50);
                                            if (game.fillCount >= 5) {
                                                //If there's less than 50 connected tiles, make it harder the less water there is
                                                var waterChance = 50;
                                                if (game.fillCount < 50) {
                                                    waterChance = Math.floor(Math.random() * 50 + game.fillCount);
                                                }
                                                if (waterChance >= 50) {
                                                    if (tiletypes[waterTileType].freshWater) {
                                                        newTileType = "freshshallowwater";
                                                    } else {
                                                        newTileType = "shallowwater";
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        player.skillGain("mining", false, false);
                        var item = {
                            type: resource[tileType][resourceType][0],
                            quality: 'Random'
                        };

                        if (tileData[player.x + player.direction.x] && tileData[player.x + player.direction.x][player.y + player.direction.y] && tileData[player.x + player.direction.x][player.y + player.direction.y].length > 1) {
                            var tileItem;
                            if (tiletypes[tileData[player.x + player.direction.x][player.y + player.direction.y][0].type].regathered) {
                                item.type = resource[tileData[player.x + player.direction.x][player.y + player.direction.y][0].type][0][0];
                            }
                            tileItem = tileData[player.x + player.direction.x][player.y + player.direction.y][0];
                            if (tileItem.mindur) {
                                item.mindur = tileItem.mindur - 1;
                                item.maxdur = tileItem.maxdur;
                            }
                            if (tileItem.quality) {
                                item.quality = tileItem.quality;
                            }
                        }

                        itemGet(item, false);
                        getItem = true;
                        damageItem(invId);
                        var cave = makeCaveEntrance();
                        if (cave) {
                            newTileType = cave;
                        }
                        break;
                    }
                }
            }
            //Let's replace it with whatever is underneath it in the stack
            if (getItem && tileData[player.x + player.direction.x] && tileData[player.x + player.direction.x][player.y + player.direction.y] && tileData[player.x + player.direction.x][player.y + player.direction.y].length > 1) {
                tileData[player.x + player.direction.x][player.y + player.direction.y].shift();
                newTileType = tileData[player.x + player.direction.x][player.y + player.direction.y][0].type;
            }
            changeTile({type: newTileType}, player.x + player.direction.x, player.y + player.direction.y, false);
        }

        audio.queueSfx('pickup');
        passTurn(true);
    };
    /**
     * Eat the selected item. Also called from "drink" action with bypass.
     * @param invClass {string}
     * @param invId {int}
     * @param bypass {boolean}
     */
    this.eat = function (invId, invClass, bypass) {
        var skillUse = 0;
        if (items[invClass].skilluse) {
            skillUse = Math.floor(player.skills[items[invClass].skilluse].percent / 10);
            skillUse = Math.floor(Math.random() * skillUse / 2);
            player.skillGain(items[invClass].skilluse, false, false);
        }
        var useType = items[invClass].use[0];
        var effect1 = items[invClass].onUse[useType][0];
        var effect2 = items[invClass].onUse[useType][1];
        var effect3 = items[invClass].onUse[useType][2];
        var effect4 = items[invClass].onUse[useType][3];
        if (effect1 > 0) {
            effect1 += skillUse;
        }
        if (effect2 > 0) {
            effect2 += skillUse;
        }
        if (effect3 > 0) {
            effect3 += skillUse;
        }
        if (effect4 > 0) {
            effect4 += skillUse;
        }
        edible(effect1, effect2, effect3, effect4);
        if (items[invClass].returnOnUse && !bypass) {
            itemGet({
                type: items[invClass].returnOnUse,
                decay: player.invItems[invId].decay,
                quality: player.invItems[invId].quality,
                mindur: player.invItems[invId].mindur,
                maxdur: player.invItems[invId].maxdur,
                props: player.invItems[invId].props
            }, "silent");
            damageItem(player.invItems.length - 1);
        }
        if (items[invClass].onUse.heal) {
            ui.message('itemUse', 'normal', [items[invClass].name]);
            if (player.status.bleeding) {
                player.status.bleeding = false;
                placeEnvItem({type: "blood", x: player.x, y: player.y, quality: ''});
                ui.message('curedBleeding', 'normal');
            }
        } else if (items[invClass].onUse.cure) {
            if (invClass === "medicinalwaterwaterskin" || invClass === "medicinalwaterglassbottle") {
                ui.message('drank', 'normal', [items[invClass].name]);
            } else {
                ui.message('itemUse', 'normal', [items[invClass].name]);
            }
            if (player.status.poisoned) {
                player.status.poisoned = false;
                ui.message('curedPoison', 'normal');
            } else if (player.status.burning) {
                player.status.burning = false;
                ui.message('curedBurning', 'normal');
            }
        } else {
            var type = "";
            if (items[invClass].onUse.drink) {
                type = "drank";
            } else {
                type = "ate";
            }
            if (bypass) {
                ui.message(type, 'normal', [tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].name]);
            } else {
                ui.message(type, 'normal', [items[invClass].name]);
            }
        }
        if (!bypass) {
            removeItem(invId, 'INV', false);
        }
        passTurn(true);
    };
    /**
     * Fill a waterskin with water or snow.
     * @param invClass {string}
     * @param invId {int}
     */
    this.drink = function (invId, invClass) {
        this.eat(invId, invClass, false);
    };
    this.cure = function (invId, invClass) {
        this.eat(invId, invClass, false);
    };
    this.heal = function (invId, invClass) {
        this.eat(invId, invClass, false);
    };
    this.fillWater = function (invId, invClass) {
        var item = {
            decay: player.invItems[invId].decay,
            mindur: player.invItems[invId].mindur,
            maxdur: player.invItems[invId].maxdur,
            quality: player.invItems[invId].quality
        };
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            for (var envItem = 0; envItem < tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length; envItem++) {
                var envId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[envItem];
                //Is the still ready for filling?
                if (environmentals[envItems[envId].type].waterSource) {
                    if (envItems[envId].decay === -2) {
                        createParticles(12, 128, 247);
                        if (invClass === 'waterskin') {
                            item.type = 'desalinatedwaterwaterskin';
                        } else {
                            item.type = 'desalinatedwaterglassbottle';
                        }
                        itemGet(item, false);
                        envItems[envId].decay = -1;
                        removeItem(invId, 'INV', false);
                        passTurn(true);
                        return;
                    } else if (environmentals[envItems[envId].type].decay === envItems[envId].decay) {
                        ui.message("noWaterStill", 'normal');
                        return;
                    } else {
                        if (envItems[envId].type === "stonewaterstill_unlit") {
                            ui.message("requiresFireStill", 'normal');
                            return;
                        } else {
                            ui.message("notEnoughWaterStill", 'normal');
                            return;
                        }
                    }
                } else if (envItems[envId].type === "stonewaterstill_lit") {
                    ui.message("fireWaitStill", 'normal');
                    return;
                }
            }
        } else if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].water || tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].shallowWater || tile[player.x + player.direction.x][player.y + player.direction.y].type === "snow") {
            ui.message("waterFill", 'normal', [items[invClass].name]);
            createParticles(12, 128, 247);
            if (tile[player.x + player.direction.x][player.y + player.direction.y].type === "snow" || tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].freshWater) {
                if (invClass === 'waterskin') {
                    item.type = 'unpurifiedfreshwaterwaterskin';
                } else {
                    item.type = 'unpurifiedfreshwaterglassbottle';
                }
                //Remove snow and fresh water
                changeTile({type: "dirt"}, player.x + player.direction.x, player.y + player.direction.y, false);
            } else {
                if (invClass === 'waterskin') {
                    item.type = 'seawaterwaterskin';
                } else {
                    item.type = 'seawaterglassbottle';
                }
            }
            itemGet(item, false);
            removeItem(invId, 'INV', false);
            passTurn(true);
            return;
        }
        ui.message("noWaterToFill", 'normal', [items[invClass].name]);
    };
    /**
     * Fishing!!!
     * @param invId {int}
     */
    this.fishing = function (invId) {
        var mId = false;
        var range = 0;
        var fishingEquipment = getItemFromId(invId, false, false);
        var mobCheck = false;
        var chance = Math.floor(Math.random() * 99 + 1);
        var fishingSkill = player.skills.fishing.percent;
        var castDone = false;
        var other = false;

        if (fishingEquipment) {
            range = rangeFinder(fishingEquipment.ranged.range, fishingSkill);
            ui.message("castLineFish", 'normal', [range]);
            mobCheck = checkForMobInRange(range);
            if (mobCheck.found) {
                mId = mobCheck.id;
                if (game.monsters[mId].ai !== "fish") {
                    ui.message("cantFish", 'normal', [npcs[game.monsters[mId].type].name]);
                    castDone = true;
                }
            } else {
                if (mobCheck.obstacle) {
                    ui.message("inWayFish", 'bad');
                    castDone = true;
                } else {
                    if (mobCheck.water) {
                        if (fishingSkill >= (chance)) {
                            ui.message("shadowInWaterFish", 'normal');
                            spawnMonster("water", mobCheck.x, mobCheck.y, true);
                            player.skillGain("fishing", 0.1, false);
                            other = true;
                        } else {
                            if (fishingSkill >= (chance - 20)) {
                                ui.message("seaweedFish", 'normal');
                                itemGet({type: 'seaweed', quality: 'Random'}, false);
                                player.skillGain("fishing", 0.1, false);
                                other = true;
                            }
                        }
                    } else {
                        ui.message("noWaterFish", 'normal');
                    }
                    if (!other) {
                        ui.message("noFish", 'normal');
                    }
                    castDone = true;
                }
            }

            var offset = getLocationOffsets(mobCheck.x, mobCheck.y);
            var realTile = tile[mobCheck.x][mobCheck.y].type;
            createParticles(tiletypes[realTile].particles[0], tiletypes[realTile].particles[1], tiletypes[realTile].particles[2], realTile, offset.x, offset.y, 3);

            if (castDone) {

                damageItem(invId);
                audio.queueSfx('water');
                passTurn(true);
                return;
            }
        }

        //Success case
        if (mId) {
            switch (true) {
                case (fishingSkill >= (chance - 50)):
                    itemGet({type: npcs[game.monsters[mId].type].loot[0], quality: 'Random'}, false);
                    ui.message("catchFish", 'normal');
                    deleteMonsters(mId);
                    player.skillGain("fishing", false, false);
                    break;
                default:
                    ui.message("failFish", "bad");
                    player.skillGain("fishing", 0.1, false);
                    break;
            }
        }
        damageItem(invId);
        audio.queueSfx('water');
        passTurn(true);
    };
    /**
     * Gathering function used for lumberjacking and mining
     */
    this.gather = function () {
        var skillBonus;
        var skillChance;
        var staminaChance = Math.floor(Math.random() * 99 + 1);
        var type = tile[player.x + player.direction.x][player.y + player.direction.y].type;

        if (tiletypes[type].skill) {
            skillChance = tiletypes[type].skill;
            skillBonus = player.skills[skillChance].percent;
        } else {
            //Set in default chance for things that don't have gathering skills associated with them like Stone Walls
            skillBonus = 25;
        }

        game.delay = 20;
        if (skillBonus <= staminaChance) {
            player.stamina -= 1;
        }

        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            var list = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList;
            if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].flammable && list.length > 0) {
                if (envItems[list[list.length - 1]].type === 'fire') {
                    ui.message("fireNoGathering", "bad");
                    return;
                }
            }
        }

        //Use attack damage from equipment as bonus
        var toolLoop = 1;
        if (player.attackFromEquip > 0) {
            toolLoop = Math.floor(player.attackFromEquip / 4);
        }

        //Meatier sounds for equipped tools
        var gatherType = tiletypes[type].skill;
        if (player.attackFromEquip > 0) {
            audio.queueSfx(tiletypes[type].sound);
        } else {
            audio.queueSfx('pickup');
        }

        //Use weapon damage types as bonus or negative
        var rightHand = parseInt($('#righthand').find('li').attr('data-itemid'), 10);
        if (rightHand) {
            rightHand = items[player.invItems[rightHand].type].damageType;
        } else {
            rightHand = false;
        }
        var leftHand = parseInt($('#lefthand').find('li').attr('data-itemid'), 10);
        if (leftHand) {
            leftHand = items[player.invItems[leftHand].type].damageType;
        } else {
            leftHand = false;
        }
        var weapons = [leftHand, rightHand];
        for (var weapon = 0; weapon <= 1; weapon++) {
            if (weapons[weapon]) {
                for (var damageTypes = 0; damageTypes < weapons[weapon].length; damageTypes++) {
                    if (weapons[weapon][damageTypes]) {

                        //Blunt helps mining, slashing helps lumberjacking
                        if (gatherType === "mining") {
                            if (weapons[weapon][damageTypes] === "Blunt") {
                                toolLoop += 2;
                            }
                        } else {
                            if (weapons[weapon][damageTypes] === "Slashing") {
                                toolLoop += 2;
                            }
                        }
                    }
                }
            }
        }

        //Make sure they always have at least 1 loop
        if (toolLoop <= 0) {
            toolLoop = 1;
        }

        var breakTile = false;
        var damagedTool = false;
        //Loop through gathering based on tool's attack values
        for (var t = 0; t < toolLoop; t++) {
            //If the tile was broken, don't loop through many resources
            if (breakTile) {
                break;
            }
            //25% chance min to get chance of item
            var chance = Math.floor(Math.random() * 99 + 1);
            if (skillBonus >= (chance - 25)) {
                //Grab the tile resources first if there is any, skip the rest


                if (tile[player.x + player.direction.x][player.y + player.direction.y].tileitems) {
                    var tileItemKey = Object.keys(tile[player.x + player.direction.x][player.y + player.direction.y].tileitems);
                    var item = tileItemKey.length - 1;
                    itemGet({
                        type: tileItems[tileItemKey[item]].type,
                        quality: tileItems[tileItemKey[item]].quality,
                        mindur: tileItems[tileItemKey[item]].mindur,
                        maxdur: tileItems[tileItemKey[item]].maxdur
                    }, false);
                    game.delay += 10;
                    removeItem(tileItemKey[item], 'TILE', false);
                }

                var itemChance = 0;
                for (var resourceItem = 0; resourceItem < resource[type].length; resourceItem++) {
                    if (resource[type][resourceItem]) {
                        if (breakTile) {
                            break;
                        }
                        itemChance = Math.floor(Math.random() * 99 + 1);
                        if (itemChance <= resource[type][resourceItem][1]) {
                            if (skillChance) {
                                player.skillGain(skillChance, false, false);
                            }
                            var gatherItem = {
                                type: resource[type][resourceItem][0],
                                quality: 'Random'
                            };
                            if (type.toString() === resource[type][resourceItem][0].toString()) {
                                var tileItem;
                                if (tileData[player.x + player.direction.x] && tileData[player.x + player.direction.x][player.y + player.direction.y] && tileData[player.x + player.direction.x][player.y + player.direction.y].length > 1) {
                                    tileItem = tileData[player.x + player.direction.x][player.y + player.direction.y][0];
                                    if (tileItem.mindur) {
                                        gatherItem.mindur = tileItem.mindur - 1;
                                        gatherItem.maxdur = tileItem.maxdur;
                                    }
                                    if (tileItem.quality) {
                                        gatherItem.quality = tileItem.quality;
                                    }
                                }
                            }

                            //Drop on gather option switch
                            if (ui.options.dropOnGather) {
                                gatherItem.x = player.x;
                                gatherItem.y = player.y;
                                placeItem(gatherItem, 'TILE', false);
                            } else {
                                itemGet(gatherItem, false);
                            }

                            game.delay += 10;
                            if (player.attackFromEquip > 0) {
                                //Only damage your tool once
                                if (!damagedTool) {
                                    damageHeld();
                                    damagedTool = true;
                                }
                            } else if (chance <= 20) {
                                //HP reduction on gather without tool
                                ui.message("hurtGathering", "bad");
                                ui.textAbove("-1", 255, 0, 0);
                                audio.queueSfx('hurt');
                                player.health -= 1;
                                if (ui.options.hints && !player.hintseen.useatool) {
                                    ui.hintDisplay("useatool");
                                }
                            }
                            addMilestone("gatherer");

                            if (tiletypes[type].strength) {
                                tileData[player.x + player.direction.x] = tileData[player.x + player.direction.x] || {};
                                tileData[player.x + player.direction.x][player.y + player.direction.y] = tileData[player.x + player.direction.x][player.y + player.direction.y] || [];
                                if (tileData[player.x + player.direction.x][player.y + player.direction.y].length > 0) {
                                    if (tileData[player.x + player.direction.x][player.y + player.direction.y][0].strength >= 0) {
                                        tileData[player.x + player.direction.x][player.y + player.direction.y][0].strength--;
                                    } else {
                                        tileData[player.x + player.direction.x][player.y + player.direction.y][0].strength = tiletypes[type].strength - 1;
                                    }
                                } else {
                                    changeTile({
                                        type: type,
                                        strength: tiletypes[type].strength - 1
                                    }, player.x + player.direction.x, player.y + player.direction.y, false);
                                }
                                if (tileData[player.x + player.direction.x][player.y + player.direction.y][0].strength <= 0) {
                                    var leftover;
                                    if (type === "rock" || type === "sandstone" || type === "highrock") {
                                        //Did we make a cave entrance?
                                        leftover = makeCaveEntrance();
                                    }
                                    if (!leftover) {
                                        if (tileData[player.x + player.direction.x] && tileData[player.x + player.direction.x][player.y + player.direction.y] && tileData[player.x + player.direction.x][player.y + player.direction.y].length > 1) {
                                            tileData[player.x + player.direction.x][player.y + player.direction.y].shift();
                                            leftover = tileData[player.x + player.direction.x][player.y + player.direction.y][0].type;

                                        } else {
                                            leftover = tiletypes[type].leftOver;
                                        }
                                    }
                                    changeTile({type: leftover}, player.x + player.direction.x, player.y + player.direction.y, false);
                                    breakTile = true;
                                }
                            }
                        }
                    }
                }
            } else {
                //Don't give them more chances to get an item just from tool alone
                break;
            }
        }
        createParticles(tiletypes[type].particles[0], tiletypes[type].particles[1], tiletypes[type].particles[2]);
        player.checkWeight();
        passTurn(true);
    };
    /**
     * Light an item like a torch.
     * @param invClass {string}
     * @param invId {int}
     */
    this.lightItem = function (invId, invClass) {
        var reqEnv = false;
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            for (var envItem = 0; envItem < tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length; envItem++) {
                var envItemId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[envItem];
                if (environmentals[envItems[envItemId].type].fire) {
                    reqEnv = true;
                    break;
                }
            }
        }
        if (!reqEnv) {
            ui.message("requiresFacingFire", 'normal');
            return;
        }
        var decay;
        //Make sure to take the decay value if it was previously lit/unlit
        if (player.invItems[invId].decay === -1) {
            decay = items[items[invClass].lit].decayable[0];
        } else {
            decay = player.invItems[invId].decay;
        }
        var item = player.invItems[invId];
        item.type = items[invClass].lit;
        item.decay = decay;
        itemGet(item, false);
        removeItem(invId, 'INV', false);
        audio.queueSfx('throw');
    };
    /**
     * Use a lockpick to open locked items.
     * @param invId {int}
     */
    this.lockpick = function (invId) {
        var reqEnv = false;
        var envId = 0;
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            for (var envItem = 0; envItem < tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length; envItem++) {
                var envItemId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[envItem];
                if (environmentals[envItems[envItemId].type].locked) {
                    reqEnv = true;
                    envId = envItemId;
                    break;
                }
            }
        }
        if (!reqEnv) {
            ui.message("noLockpick", 'normal');
            return;
        }
        var chance = Math.floor(Math.random() * 99 + 1);
        //Minimum of 20% chance
        if (player.skills.lockpicking.percent >= (chance - 20)) {
            ui.message("lockpick", 'normal');
            player.skillGain("lockpicking", false, false);
            envItems[envId].type = "woodenchest_unlocked";
            var lootItem = "";
            var lootGroupStack = ["high", "low", "treasure", "high", "low", "treasure"];
            var treasures = Math.floor(Math.random() * 3 + 3);
            for (var i = 0; i <= treasures; i++) {
                lootItem = lootgroup[lootGroupStack[i]][Math.floor(Math.random() * lootgroup[lootGroupStack[i]].length)];
                var durability = getDurability(lootItem, "Random", 200, false, 'INV');
                placeItem({
                    type: lootItem,
                    maxdur: durability.maxDur,
                    mindur: durability.maxDur,
                    quality: durability.quality,
                    props: durability.props
                }, 'ENV', envId);
            }
            addMilestone("locksmith");
            this.openContainer(envId, "ENV", false);
        } else {
            player.skillGain("lockpicking", 0.1, false);
            ui.message("lockpickFail", "bad");
        }
        damageItem(invId);
        audio.queueSfx("throw");
        passTurn(true);
    };
    /**
     * When using a spyglass this will show a minimap of the area in the direction your looking.
     * @param invId
     */
    this.look = function (invId) {
        if (player.x <= game.mapSize) {

            var lookX;
            var lookY;
            if (player.direction.x === 1) {
                lookX = player.x + 38;
                lookY = player.y;
            } else if (player.direction.x === -1) {
                lookX = player.x - 38;
                lookY = player.y;
            } else if (player.direction.y === 1) {
                lookX = player.x;
                lookY = player.y + 38;
            } else if (player.direction.y === -1) {
                lookX = player.x;
                lookY = player.y - 38;
            }

            makeMiniMap(lookX, lookY);
            ui.message("spyglass", 'normal');
            damageItem(invId);
            game.updateMiniMap = false;
            passTurn(true);
        } else {
            ui.message("spyglassUnderground", 'normal');
        }
    };
    /**
     * Starting fires!
     * @param invClass {string}
     * @param invId {int}
     */
    this.startFire = function (invId, invClass) {
        var fireType = "fire";
        var realTile = tile[player.x + player.direction.x][player.y + player.direction.y].type;
        var itemId = 0;
        var minDur = 0;
        var maxDur = 0;

        if (invClass === "lens" && player.x > game.mapSize) {
            ui.message("noSun", 'normal');
            return;
        }

        if (invClass === "lens" && player.light >= 0.25) {
            ui.message("sunNotBrightEnough", 'normal');
            return;
        }

        //Check for fire starting materials
        var kindling;
        var tinder;
        var fuel;

        //If it's not a torch
        if (!items[invClass].equip) {
            kindling = player.isItemInInventory('kindling');
            tinder = player.isItemInInventory('tinder');
            if (!kindling) {
                ui.message("noKindling", 'bad');
                return;
            }
            if (!tinder) {
                ui.message("noTinder", 'bad');
                return;
            }
        }

        //We don't need fuel if it's being started on flammable
        if (!tiletypes[realTile].flammable) {
            fuel = player.isItemInInventory('fuellike');
            if (!fuel) {
                ui.message("noFuellike", 'bad');
                return;
            }
        }

        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            for (var envItem = 0; envItem < tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length; envItem++) {
                var envId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[envItem];
                //Campfire, furnace, kiln, etc. lighting
                if (environmentals[envItems[envId].type].lit) {
                    //Water still
                    if (envItems[envId].type === "stonewaterstill_unlit") {
                        if (envItems[envId].decay !== 1) {
                            ui.message("noWaterPurifyStill", 'normal');
                            return;
                        }
                    }
                    itemId = envId;
                    fireType = environmentals[envItems[envId].type].lit;
                    if (envItems[envId].mindur) {
                        minDur = envItems[envId].mindur;
                        maxDur = envItems[envId].maxdur;
                    }
                } else {
                    ui.message("cannotStartFire", 'normal');
                    return;
                }
            }
        }

        if (tiletypes[realTile].flammable || fireType !== "fire" || tiletypes[realTile].passable && !tiletypes[realTile].water && !tiletypes[realTile].shallowWater) {
            var chance = Math.floor(Math.random() * 99 + 1);
            //Minimum of 25% chance
            if (player.skills.camping.percent >= (chance - 25)) {
                // TODO: Deal with environmentals like fire and other things that really can't have durability or quality.
                placeEnvItem({
                    type: fireType,
                    x: player.x + player.direction.x,
                    y: player.y + player.direction.y,
                    mindur: minDur,
                    maxdur: maxDur,
                    quality: ''
                });
                ui.message("startFire", 'normal');
                player.skillGain("camping", false, false);
                if (kindling) {
                    removeItem(kindling.itemId, 'INV', kindling.containerId);
                }
                if (tinder) {
                    removeItem(tinder.itemId, 'INV', tinder.containerId);
                }
                if (fuel) {
                    removeItem(fuel.itemId, 'INV', fuel.containerId);
                }
                if (fireType !== "fire" && environmentals[envItems[itemId].type].lit) {
                    removeItem(itemId, 'ENV', false);
                }
            } else {
                if (kindling) {
                    damageItem(kindling.itemId, kindling.containerId);
                }
                if (tinder) {
                    damageItem(tinder.itemId, tinder.containerId);
                }
                if (fuel) {
                    damageItem(fuel.itemId, fuel.containerId);
                }
                player.skillGain("camping", 0.1, false);
                ui.message("startFireFail", "bad");
            }
            damageItem(invId);
            createParticles(210, 125, 20);
            audio.queueSfx('throw');
        } else {
            ui.message("cannotStartFire", 'normal');
            return;
        }

        passTurn(true);
    };
    /**
     * Open a bottle found on the beach.
     * @param invId {int}
     */
    this.openBottle = function (invId) {
        var randomChance = Math.floor(Math.random() * 4);
        var itemType = "";
        switch (randomChance) {
            case 1:
                itemType = "tatteredmap";
                break;
            case 2:
                itemType = "oldinstructionalscroll";
                break;
            case 3:
                itemType = "refinedsand";
                break;
        }
        if (itemType) {
            itemGet({type: itemType, quality: 'Random'}, false);
            ui.message("bottleOpen", 'normal', [items[itemType].name]);
        } else {
            //25% to get nothing
            audio.queueSfx("fail");
            ui.message("bottleMush", "bad");
        }
        itemGet({type: "glassbottle", quality: player.invItems[invId].quality}, "silent");
        removeItem(invId, 'INV', false);
        passTurn(true);
    };
    /**
     * Open the container - can either be a envitem (wooden chest), or chest/bag in player inventory (player.invItem).
     * @param id {int}
     * @param type {string}
     * @param silent {boolean}
     */
    this.openContainer = function (id, type, silent) {
        ui.$containerWindow.dialog("close");
        ui.$container.find('li').remove();
        game.containerOpened.containerType = type;
        game.containerOpened.id = id;
        var contItems = "";
        var quality = "";
        var cont = [];
        var containerName = '';
        if (player.invItems[id] && game.containerOpened.containerType === "INV") {
            cont = player.invItems[id].container;
            containerName = items[player.invItems[id].type].name;
        } else {
            cont = envItems[id].container;
            containerName = environmentals[envItems[id].type].name;
        }
        if (cont && cont.length > 0) {
            for (var containerId = 0; containerId < cont.length; containerId++) {
                if (cont[containerId] !== undefined && cont[containerId] !== null) {
                    if (cont[containerId].quality) {
                        quality = " " + cont[containerId].quality.toLowerCase();
                    } else {
                        quality = "";
                    }
                    var group = "";
                    if (items[cont[containerId].type].group) {
                        var groupKey = Object.keys(items[cont[containerId].type].group);
                        for (var itemGroup = 0; itemGroup < groupKey.length; itemGroup++) {
                            group += " " + items[cont[containerId].type].group[itemGroup];
                        }
                    }
                    //Is the item low durability? Add the damaged CSS class
                    var damaged = "";
                    if (cont[containerId].mindur <= 2) {
                        damaged = " damaged";
                    }
                    contItems += '<li data-item="' + cont[containerId].type + '" data-itemid="' + containerId + '" class="tooltip item ' + cont[containerId].type + group + quality + damaged + '"></li>';
                }
            }
        }
        ui.$container.html(contItems);
        ui.$containerWindow.dialog("open");
        ui.message("youOpenThe", 'normal', [containerName]);
        ui.$containerWindow.parent('div').find('.ui-dialog-title').html(Messages.container + ' (' + containerName + ')');

        //Don't play sound or use delay when dropping items in
        if (!silent) {
            audio.queueSfx('pickup');
            game.delay += 40;
        }
    };
    /**
     * Place a tile like a wall or a door at the location directly in front of the character.
     * @param invClass {string}
     * @param invId {int}
     */
    this.placeTile = function (invId, invClass) {

        var tileType = items[invClass].onUse.placeTile;

        if (player.invItems[invId].mindur > 0) {
            if (tiletypes[tile[player.x][player.y].type].water) {
                ui.message("cannotPlaceFromHere", 'normal');
                return;
            }

            var dirX = player.x + player.direction.x;
            var dirY = player.y + player.direction.y;

            if (tile[dirX][dirY].monster || tile[dirX][dirY].tileitems) {
                ui.message("inWayOfPlacing", 'normal');
                game.checkForHiddenMob(player.x + player.direction.x, player.y + player.direction.y);
                return;
            }

            //Allow placing tiles over fire (then extinguish it)
            var fire = null;
            if (tile[dirX][dirY].envItemList) {
                for (var envId = 0; envId < tile[dirX][dirY].envItemList.length; envId++) {
                    var fireItem = tile[dirX][dirY].envItemList[envId];
                    if (envItems[fireItem].type === "fire") {
                        fire = fireItem;
                    }
                }
                if (fire === null) {
                    ui.message("inWayOfPlacing", 'normal');
                    return;
                }
                else {
                    removeItem(fire, 'ENV', false);
                }
            }

            if (tiletypes[tile[dirX][dirY].type].passable || tiletypes[tile[dirX][dirY].type].water) {
                //Special case for water - make sure there is attaching land
                if (tiletypes[tile[dirX][dirY].type].water) {
                    var coordinates = [
                        [dirX + 1, dirY],
                        [dirX - 1, dirY],
                        [dirX, dirY - 1],
                        [dirX, dirY + 1],
                        [dirX - 1, dirY - 1],
                        [dirX + 1, dirY - 1],
                        [dirX - 1, dirY + 1],
                        [dirX + 1, dirY + 1]
                    ];

                    var adjacentTiles = 0;

                    for (var i = 0; i < coordinates.length; i++) {
                        if (!tiletypes[tile[coordinates[i][0]][coordinates[i][1]].type].water) {
                            adjacentTiles++;
                        }
                    }

                    if (adjacentTiles < 3) {
                        ui.message("landNeeded", 'normal');
                        return;
                    }
                }

                var newTile = {
                    type: tileType
                };
                if (tiletypes[tileType].strength) {
                    newTile.strength = tiletypes[tileType].strength;
                }
                if (tiletypes[tileType].durability) {
                    if (player.invItems[invId].mindur) {
                        newTile.mindur = player.invItems[invId].mindur;
                        newTile.maxdur = player.invItems[invId].maxdur;
                    }
                }
                if (player.invItems[invId].quality) {
                    newTile.quality = player.invItems[invId].quality;
                } else {
                    newTile.quality = "Random";
                }
                changeTile(newTile, dirX, dirY, true);
                audio.queueSfx('pickup');
                if (tiletypes[tileType].particles) {
                    createParticles(tiletypes[tileType].particles[0], tiletypes[tileType].particles[1], tiletypes[tileType].particles[2]);
                }
                removeItem(invId, 'INV', false);
                passTurn(true);
            } else {
                ui.message("cannotPlace", 'normal');
            }
        } else {
            ui.message("tooDamaged", 'normal', [items[player.invItems[invId].type].name, Messages.place]);
        }
    };
    /**
     * Use the raft to cross water without swimming
     * @param invId {int}
     */
    this.raft = function (invId) {
        if (game.raft) {
            ui.message("raftStop", 'normal');
            game.raft = false;
            return;
        }

        if (!tiletypes[tile[player.x][player.y].type].water) {
            ui.message("raftTravel", 'normal');
            return;
        }

        ui.message("raft", 'normal');
        game.raft = invId;
        passTurn(true);
    };
    /**
     * Read a scroll to see if you gain any new craftables.
     * @param invId {int}
     */
    this.read = function (invId) {
        if (!discoverItem("scroll", '')) {
            ui.message("masterOfCrafts", "bad");
        }
        removeItem(invId, 'INV', false);
    };
    /**
     * Glue is used to reinforce items (give slight maxDur bonuses)
     * @param invId
     * @param invClass {string}
     * @param containerId {int}
     * @param bypassId {int}
     */
    this.reinforce = function (invId, invClass, containerId, bypassId) {
        var reinforce = false;
        var item;
        if (bypassId) {
            item = player.invItems[bypassId];
        } else {
            var checkedTile = tile[player.x + player.direction.x][player.y + player.direction.y];
            var tileItemsKey = Object.keys(checkedTile.tileitems);
            var tileId = tileItemsKey.length - 1;
            item = tileItems[tileItemsKey[tileId]];
        }
        if (items[item.type].durability) {
            var chance = Math.floor(Math.random() * 99 + 1);
            //Try to get skill it's made from
            var itemSkill = "tinkering";
            if (items[item.type].recipe && items[item.type].recipe.skill) {
                itemSkill = items[item.type].recipe.skill;
            }
            //Minimum of 20% chance
            if (player.skills[itemSkill].percent >= (chance - 20)) {
                var increase = Math.floor(Math.random() * 5 + 5);
                item.maxdur += increase;
                player.skillGain(itemSkill, false, false);
                item.mindur += Math.floor(increase / 2);
                if (item.mindur > item.maxdur) {
                    item.mindur = item.maxdur;
                }
                ui.message("reinforce", 'normal');
                audio.queueSfx("craft");
                removeItem(invId, 'INV', containerId);
                passTurn(true);
                reinforce = true;
            } else {
                player.skillGain(itemSkill, 0.1, false);
                ui.message("failReinforce", "bad");
                damageItem(invId, containerId);
                audio.queueSfx("fail");
                passTurn(true);
                reinforce = true;
            }
        } else {
            ui.message("cannotReinforce", 'normal');
            reinforce = true;
        }
        if (!reinforce) {
            ui.message("noItemReinforce", 'normal');
        }
    };
    /**
     * Repair the item in front of you, or through the "repair" item menu action using bypassId.
     * @param invId {int}
     * @param invClass {string}
     * @param containerId {int}
     * @param bypassId {int}
     */
    this.repair = function (invId, invClass, containerId, bypassId) {
        var repairable = false;
        var checkedTile = tile[player.x + player.direction.x][player.y + player.direction.y];
        if (checkedTile.tileitems || bypassId) {
            var item;
            if (bypassId) {
                item = player.invItems[bypassId];
            } else {
                var tileItemsKey = Object.keys(checkedTile.tileitems);
                var tileId = tileItemsKey.length - 1;
                item = tileItems[tileItemsKey[tileId]];
            }
            if (items[item.type].durability) {
                if (item.mindur !== item.maxdur) {
                    var chance = Math.floor(Math.random() * 99 + 1);
                    //Try to get skill it's made from
                    var itemSkill = "tinkering";
                    if (items[item.type].recipe && items[item.type].recipe.skill) {
                        itemSkill = items[item.type].recipe.skill;
                    }
                    //Minimum of 20% chance
                    if (player.skills[itemSkill].percent >= (chance - 20)) {
                        //Reduce durability based on 1/3 of max dur - min dur
                        var maxReduction = Math.floor((item.maxdur - item.mindur) / 3);
                        if (maxReduction <= 0) {
                            maxReduction = 1;
                        }
                        item.maxdur -= maxReduction;
                        if (item.maxdur <= 1) {
                            audio.queueSfx("fail");
                            if (bypassId) {
                                removeItem(bypassId, 'INV', false);
                            } else {
                                removeItem(tileItemsKey[tileId], 'TILE', false);
                            }
                            ui.message("breakRepair", "bad");
                            damageItem(invId, containerId);
                            passTurn(true);
                            return;
                        }
                        player.skillGain(itemSkill, false, false);
                        item.mindur = item.maxdur;
                        ui.message("repair", 'normal');
                        audio.queueSfx("craft");
                        damageItem(invId, containerId);
                        passTurn(true);
                        repairable = true;
                    } else {
                        player.skillGain(itemSkill, 0.1, false);
                        ui.message("failRepair", "bad");
                        audio.queueSfx("fail");
                        damageItem(invId, containerId);
                        passTurn(true);
                        repairable = true;
                    }
                } else {
                    ui.message("fullyRepair", 'normal');
                    repairable = true;
                }
            } else {
                ui.message("cannotRepair", 'normal');
                repairable = true;
            }
        }
        if (!repairable) {
            ui.message("noItemRepair", 'normal');
        }
    };
    /**
     * Sleep is better than rest.
     * @param invId
     * @param invClass
     */
    this.sleep = function (invId, invClass) {
        this.rest(invId, invClass, "sleep");
    };
    /**
     * Rest is good for you.
     * @param invId
     * @param invClass
     * @param type
     */
    this.rest = function (invId, invClass, type) {

        //Default action is to rest (sleep also available).
        if (!type) {
            type = "rest";
        }

        if (tiletypes[tile[player.x][player.y].type].water) {
            //We need to capitalize the passed type string in this case.
            ui.message("cannot" + type.charAt(0).toUpperCase() + type.slice(1), 'normal');
            return;
        }

        //Full stamina on rest
        if (type === "rest" && player.stamina === player.dexterity) {
            ui.message("staminaFull", 'normal');
            return;
        }

        var cycles = Math.ceil(player.skills.camping.percent * 25);
        if (cycles < 50) {
            cycles = 50;
        } else if (cycles > 500) {
            cycles = 500;
        }
        if (type === "sleep") {
            if (player.light >= 0.75 || player.x > game.mapSize) {
                cycles += 250;
            }
        }
//        var rested = 0;
        //Increase regeneration, decrease hunger while sleeping
        game.staminaTimer = 0;
        game.healthTimer = 0;
        game.hungerTimer = 0;
        game.thirstTimer = 0;
        //Pass everything we need to use in the cycler
        game.loadingData = {
            startHealth: player.health,
            defaultStaminaRegen: game.staminaRegen,
            defaultHealthRegen: game.healthRegen,
            defaultHungerRegen: game.hungerRegen,
            defaultThirstRegen: game.thirstRegen,
            invId: invId,
            type: type,
            rested: 0
        };
        ui.message(type + "Begin", 'normal');

        var fireBonus = 1;
        //Give a bonus for facing a fire while sleeping
        if (type === "sleep") {
            if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
                for (var envItem = 0; envItem < tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length; envItem++) {
                    var envId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[envItem];
                    if (environmentals[envItems[envId].type].fire) {
                        fireBonus = 2;
                        cycles = cycles * 2;
                        ui.message("restWarm", 'normal');
                        break;
                    }
                }
            }
        }

        //Reduce the regenerative effects if not resting with an item (Actions menu)
        var itemBonus = 0;
        if (!invId) {
            itemBonus = 1;
        }

        game.staminaRegen = 2 / fireBonus + itemBonus;
        game.healthRegen = 40 / fireBonus + itemBonus;
        if (type === "sleep") {
            game.hungerRegen = 300;
            game.thirstRegen = 240;
        }
        audio.queueSfx('pickup');

        game.fadeFromBlack = 1;
        game.loadingCycles = cycles;
        $('#loading').show();

        //Start the resting cycle
        restCycle();

    };
    /**
     * Used with the sundial to tell the current time of day.
     */
    this.tellTime = function (invId) {

        //Time descriptions
        if (player.light >= 0 && player.light <= 0.4) {
            ui.message("timeMidDay", 'normal');
        } else if (player.lightSwitch === 0 && player.light >= 0.4 && player.light <= 0.5) {
            ui.message("timeSunSetting", 'normal');
        } else if (player.lightSwitch === 0 && player.light >= 0.5 && player.light <= 0.6) {
            ui.message("timeDusk", 'normal');
        } else if (player.light >= 0.6) {
            ui.message("timeNight", 'normal');
        } else if (player.lightSwitch === 1 && player.light >= 0.4 && player.light <= 0.5) {
            ui.message("timeSunRising", 'normal');
        } else if (player.lightSwitch === 1 && player.light >= 0.5 && player.light <= 0.6) {
            ui.message("timeDawn", 'normal');
        }

        //Quarters
        if (player.lightSwitch === 0 && player.light <= 0.25) {
            ui.message("dayThird", 'normal');
        } else if (player.lightSwitch === 0 && player.light <= 0.5) {
            ui.message("dayFourth", 'normal');
        } else if (player.lightSwitch === 1 && player.light <= 0.5) {
            ui.message("dayFirst", 'normal');
        } else if (player.lightSwitch === 1 && player.light <= 0.25) {
            ui.message("daySecond", 'normal');
        } else if (player.lightSwitch === 0 && player.light <= 0.75) {
            ui.message("nightFirst", 'normal');
        } else if (player.lightSwitch === 0 && player.light <= 1) {
            ui.message("nightSecond", 'normal');
        } else if (player.lightSwitch === 1 && player.light <= 1) {
            ui.message("nightThird", 'normal');
        } else if (player.lightSwitch === 1 && player.light <= 0.75) {
            ui.message("nightFourth", 'normal');
        }

        damageItem(invId);
        passTurn(true);
    };
    /**
     * Attempt to transmogrify an item into a legendary item
     * @param invId {int}
     * @param invClass {string}
     * @param containerId {int}
     * @param bypassId {int}
     */
    this.transmogrify = function (invId, invClass, containerId, bypassId) {
        var transmogrify = false;
        var item;
        if (bypassId) {
            item = player.invItems[bypassId];
        } else {
            var checkedTile = tile[player.x + player.direction.x][player.y + player.direction.y];
            var tileItemsKey = Object.keys(checkedTile.tileitems);
            var tileId = tileItemsKey.length - 1;
            item = tileItems[tileItemsKey[tileId]];
        }
        if (items[item.type].equip) {
            var chance = Math.floor(Math.random() * 99 + 1);
            //Try to get skill it's made from
            var itemSkill = "tinkering";
            if (items[item.type].recipe && items[item.type].recipe.skill) {
                itemSkill = items[item.type].recipe.skill;
            }
            //25% chance to transmogrify + skill bonus
            if (chance >= 75 - (player.skills[itemSkill].percent / 4)) {
                player.skillGain(itemSkill, false, false);
                item.mindur = item.maxdur;
                ui.message("transmogrify", 'normal');
                var legendary = getDurability(item.type, "legendary", false, false, 'INV');
                item.quality = "legendary";
                item.mindur = legendary.maxDur;
                item.maxdur = legendary.maxDur;
                item.props = legendary.props;
                audio.queueSfx("craft");
                removeItem(invId, 'INV', containerId);
                passTurn(true);
                transmogrify = true;
            } else {
                player.skillGain(itemSkill, 0.1, false);
                ui.message("failTransmogrify", "bad");
                damageItem(invId, containerId);
                audio.queueSfx("fail");
                passTurn(true);
                transmogrify = true;
            }
        } else {
            ui.message("cannotTransmogrify", 'normal');
            transmogrify = true;
        }
        if (!transmogrify) {
            ui.message("noItemTransmogrify", 'normal');
        }
    };
    this.travel = function (invId, invClass) {
        this.sailHome(invId, invClass, true);
    };
    /**
     * Sail home with all your treasure!
     * Travel action also piggy-backs off this function with travel param.
     * @param invId {int}
     * @param travel {boolean}
     */
    this.sailHome = function (invId, invClass, travel) {
        if (tile[player.x][player.y].type !== "deepwater" && tile[player.x][player.y].type !== "water" && tile[player.x][player.y].type !== "shallowwater") {
            ui.message("waterTravel", 'normal');
            return;
        }
        if (player.x > game.mapSize) {
            ui.message("cannotTravel", 'normal');
            return;
        }

        if (confirm(Messages.travelAway)) {
            if (travel) {
                damageItem(invId);
                death("TRAVEL");
            } else {
                //Count treasures
                var treasures = player.isItemInInventory('treasure', true);
                if (treasures >= 5) {
                    damageItem(invId);
                    //YOU ARE WINNER!
                    death("WIN");
                } else {
                    ui.message("noTreasure", 'normal');
                }
            }
        }
    };
    /**
     * Planting a plant
     * @param invClass {string}
     * @param invId {int}
     */
    this.plant = function (invId, invClass) {
        if (player.invItems[invId].mindur > 0) {
            //Gardening 101!
            if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList || tile[player.x + player.direction.x][player.y + player.direction.y].tileitems || player.x >= game.mapSize && !environmentals[items[invClass].onUse.plant].cavegrow || tile[player.x + player.direction.x][player.y + player.direction.y].monster) {
                ui.message('cannotPlant', 'normal', [items[invClass].name]);
                game.checkForHiddenMob(player.x + player.direction.x, player.y + player.direction.y);
                return;
            }
            var realTile = tile[player.x + player.direction.x][player.y + player.direction.y].type;
            var plantListLength = environmentals[items[invClass].onUse.plant].allowedtiles.length;
            for (var tilable = 0; tilable < plantListLength; tilable++) {
                if (realTile === environmentals[items[invClass].onUse.plant].allowedtiles[tilable]) {
                    var chance = Math.floor(Math.random() * 99 + 1);
                    //Minimum of 50% chance
                    if (player.skills[environmentals[items[invClass].onUse.plant].skill].percent >= (chance - 50)) {
                        placeEnvItem({
                            type: items[invClass].onUse.plant,
                            x: player.x + player.direction.x,
                            y: player.y + player.direction.y,
                            mindur: player.invItems[invId].mindur,
                            maxdur: player.invItems[invId].maxdur,
                            quality: player.invItems[invId].quality
                        });
                        ui.message("plantItem", 'normal', [items[invClass].name]);
                        player.skillGain(environmentals[items[invClass].onUse.plant].skill, false, false);
                        removeItem(invId, 'INV', false);
                        audio.queueSfx('pickup');
                        addMilestone("gardener");
                    } else {
                        player.skillGain(environmentals[items[invClass].onUse.plant].skill, 0.1, false);
                        damageItem(invId);
                        audio.queueSfx('trample');
                        ui.message('failPlant', "bad", [items[invClass].name]);
                    }
                    passTurn(true);
                    return;
                }
            }
            ui.message('cannotPlant', 'normal', [items[invClass].name]);
        } else {
            ui.message("tooDamaged", 'normal', [items[invClass].name, Messages.plant]);
        }

    };
    /**
     * Preserve food items to increase decay
     * @param invId
     * @param invClass {string}
     * @param containerId {int}
     * @param bypassId {int}
     */
    this.preserve = function (invId, invClass, containerId, bypassId) {
        var preserve = false;
        var item;
        if (bypassId) {
            item = player.invItems[bypassId];
        } else {
            var checkedTile = tile[player.x + player.direction.x][player.y + player.direction.y];
            var tileItemsKey = Object.keys(checkedTile.tileitems);
            var tileId = tileItemsKey.length - 1;
            item = tileItems[tileItemsKey[tileId]];
        }
        if (item.decay > items[item.type].decayable[0] * 2) {
            ui.message("alreadyPreserve", 'normal');
            return;
        }
        if (items[item.type].decayable && items[item.type].use.indexOf('eat') > -1 && items[item.type].use.indexOf('preserve') === -1) {
            var chance = Math.floor(Math.random() * 99 + 1);
            //Try to get skill it's made from
            var itemSkill = "cooking";
            if (items[item.type].recipe && items[item.type].recipe.skill) {
                itemSkill = items[item.type].recipe.skill;
            }
            //Minimum of 20% chance
            if (player.skills[itemSkill].percent >= (chance - 20)) {
                item.decay = items[item.type].decayable[0] * 2 + Math.floor(Math.random() * 500 - 250);
                player.skillGain(itemSkill, false, false);
                ui.message("preserve", 'normal');
                audio.queueSfx("craft");
                removeItem(invId, 'INV', containerId);
                passTurn(true);
                preserve = true;
            } else {
                player.skillGain(itemSkill, 0.1, false);
                ui.message("failPreserve", "bad");
                damageItem(invId, containerId);
                audio.queueSfx("fail");
                passTurn(true);
                preserve = true;
            }
        } else {
            ui.message("cannotPreserve", 'normal');
            preserve = true;
        }
        if (!preserve) {
            ui.message("noItemPreserve", 'normal');
        }
    };
    /**
     * Stoke a fire, add some fire strength to an envItem
     * @param invClass {string}
     * @param invId {int}
     */
    this.stokeFire = function (invId, invClass) {
        //Fire fuel
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            var combustListLength = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length;
            for (var combustibleEnvItem = 0; combustibleEnvItem < combustListLength; combustibleEnvItem++) {
                var combustibleItem = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[combustibleEnvItem];
                if (environmentals[envItems[combustibleItem].type].fire) {
                    if (envItems[combustibleItem].x === player.x + player.direction.x && envItems[combustibleItem].y === player.y + player.direction.y) {
                        removeItem(invId, 'INV', false);
                        audio.queueSfx('throw');
                        ui.message("stokeFire", 'normal');
                        envItems[combustibleItem].decay += items[invClass].onUse.stokeFire;
                        getEnvItemStatus("fire", combustibleItem, envItems[combustibleItem].type);
                        if (environmentals[envItems[combustibleItem].type].spread) {
                            envItems[combustibleItem].spread += items[invClass].onUse.stokeFire;
                        }
                        player.skillGain("camping", false, false);
                        passTurn(true);
                        return;
                    }
                }
            }
        }
        ui.message("noStokeFire", 'normal', [items[invClass].name]);
    };
    /**
     * Garden a plant, add some fertility to it
     * @param invClass {string}
     * @param invId {int}
     */
    this.garden = function (invId, invClass) {
        //Gardening
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            var gardenListLength = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length;
            for (var gardenEnvItem = 0; gardenEnvItem < gardenListLength; gardenEnvItem++) {
                var gardeningItem = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[gardenEnvItem];
                if (environmentals[envItems[gardeningItem].type].garden) {
                    if (envItems[gardeningItem].x === player.x + player.direction.x && envItems[gardeningItem].y === player.y + player.direction.y) {
                        if (environmentals[envItems[gardeningItem].type].spread) {
                            envItems[gardeningItem].spread += items[invClass].onUse.garden;
                        } else {
                            ui.message("noGardenEffect", 'normal');
                            return;
                        }
                        ui.message("garden", 'normal');
                        removeItem(invId, 'INV', false);
                        audio.queueSfx('throw');
                        getEnvItemStatus("garden", gardeningItem, envItems[gardeningItem].type);
                        player.skillGain("botany", false, false);
                        passTurn(true);
                        return;
                    }
                }
            }
        }
        ui.message("noGarden", 'normal', [items[invClass].name]);
    };
    /**
     * Build an item, affix it to the ground as an envItem
     * @param invClass {string}
     * @param invId {int}
     */
    this.build = function (invId, invClass) {
        if (player.invItems[invId].mindur > 0) {
            var facingTile = tile[player.x + player.direction.x][player.y + player.direction.y];
            if (!facingTile.tileitems) {
                if (facingTile.envItemList || facingTile.type === "exit" || !tiletypes[facingTile.type].passable || facingTile.monster) {
                    ui.message('cannotPlaceThis', 'normal', [items[invClass].name]);
                    game.checkForHiddenMob(player.x + player.direction.x, player.y + player.direction.y);
                    return;
                }
                placeEnvItem({
                    type: items[invClass].onUse.build,
                    x: player.x + player.direction.x,
                    y: player.y + player.direction.y,
                    mindur: player.invItems[invId].mindur,
                    maxdur: player.invItems[invId].maxdur,
                    quality: player.invItems[invId].quality
                });
                ui.message("buildItem", 'normal', [items[invClass].name]);
                removeItem(invId, 'INV', false);
                audio.queueSfx('throw');
                passTurn(true);
                return;
            }
            ui.message("noBuild", 'normal', [items[invClass].name]);
        } else {
            ui.message("tooDamaged", 'normal', [items[invClass].name, Messages.build]);
        }
    };
    /**
     * Pour some contained liquid out
     * @param invClass {string}
     * @param invId {int}
     */
    this.pour = function (invId, invClass) {
        ui.message("pourWater", 'normal');
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            var pourListLength = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length;
            for (var waterEnvItem = 0; waterEnvItem < pourListLength; waterEnvItem++) {
                var waterItem = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[waterEnvItem];
                if (envItems[waterItem].x === player.x + player.direction.x && envItems[waterItem].y === player.y + player.direction.y) {
                    if (environmentals[envItems[waterItem].type].waterSource) {
                        if (envItems[waterItem].decay === -1) {
                            if (invClass !== "seawaterglassbottle" && invClass !== "seawaterwaterskin") {
                                ui.message('freshWaterStill', 'normal');
                                return;
                            }
                            if (envItems[waterItem].type === "stonewaterstill_unlit") {
                                envItems[waterItem].decay = 1;
                            } else {
                                envItems[waterItem].decay = 20;
                            }
                            ui.message("pourWaterStill", 'normal');
                        } else {
                            ui.message('waterInStill', 'normal');
                            return;
                        }
                        //Revert fire sources
                    } else if (environmentals[envItems[waterItem].type].fire) {
                        ui.message("pourExtinguish", 'normal');
                        if (environmentals[envItems[waterItem].type].revert) {
                            if (envItems[waterItem].type === "stonewaterstill_lit") {
                                placeEnvItem({
                                    type: environmentals[envItems[waterItem].type].revert,
                                    x: envItems[waterItem].x,
                                    y: envItems[waterItem].y,
                                    spread: -1,
                                    decay: -1,
                                    mindur: envItems[waterItem].mindur,
                                    maxdur: envItems[waterItem].maxdur,
                                    quality: envItems[waterItem].quality
                                });
                            } else {
                                placeEnvItem({
                                    type: environmentals[envItems[waterItem].type].revert,
                                    x: envItems[waterItem].x,
                                    y: envItems[waterItem].y,
                                    mindur: envItems[waterItem].mindur,
                                    maxdur: envItems[waterItem].maxdur,
                                    quality: envItems[waterItem].quality
                                });
                            }
                        }
                        removeItem(waterItem, 'ENV', false);
                        //Add fertility to garden items on watering
                    } else if (environmentals[envItems[waterItem].type].garden) {
                        if (environmentals[envItems[waterItem].type].spread) {
                            envItems[waterItem].spread++;
                        } else {
                            ui.message("noWaterEffect", 'normal');
                            return;
                        }
                        ui.message("pourFertility", 'normal');
                        getEnvItemStatus("garden", waterItem, envItems[waterItem].type);
                        player.skillGain("botany", false, false);
                    }
                }
            }
        }
        //Finally pour the water!
        createParticles(tiletypes.water.particles[0], tiletypes.water.particles[1], tiletypes.water.particles[2]);
        audio.queueSfx('water');
        var item = player.invItems[invId];
        if (items[invClass].returnOnUse) {
            item.type = items[invClass].returnOnUse;
            itemGet(item, 'silent');
            damageItem(player.invItems.length - 1);
        }
        removeItem(invId, 'INV', false);
        game.checkForHiddenMob(player.x + player.direction.x, player.y + player.direction.y);
        passTurn(true);
    };

    /**
     * Inspect a location and describe the tile, monsters, items, and anything else that resides on it
     * @param tileX {int}
     * @param tileY {int}
     */
    this.inspect = function (tileX, tileY) {
        ui.message("youSeeTile", 'normal', [tiletypes[tile[tileX][tileY].type].name]);
        if (tile[tileX][tileY].monster) {
            var monsterId = tile[tileX][tileY].monster;
            if (game.monsters[monsterId].aberrant) {
                ui.message('youSeeAberrantMonster', 'bad', [npcs[game.monsters[monsterId].type].name])
            } else {
                ui.message("youSeeMonster", 'normal', [npcs[game.monsters[monsterId].type].name]);
            }
            var monsterPercent = Math.floor(game.monsters[monsterId].hp / game.monsters[monsterId].maxhp * 100);
            if (player.skills.anatomy.percent <= 25) {
                if (monsterPercent >= 50) {
                    ui.message("creatureHealthy", 'normal', false);
                } else {
                    ui.message("creatureUnhealthy", 'normal', false);
                }
            } else if (player.skills.anatomy.percent <= 50) {
                if (monsterPercent >= 66) {
                    ui.message("creatureUnimpaired", 'normal', false);
                } else if (monsterPercent >= 33) {
                    ui.message("creatureHurt", 'normal', false);
                } else {
                    ui.message("creatureVeryInjured", 'normal', false);
                }
            } else if (player.skills.anatomy.percent <= 75) {
                if (monsterPercent >= 75) {
                    ui.message("creatureUndamaged", 'normal', false);
                } else if (monsterPercent >= 50) {
                    ui.message("creatureBarelyHurt", 'normal', false);
                } else if (monsterPercent >= 25) {
                    ui.message("creatureInjured", 'normal', false);
                } else {
                    ui.message("creatureDamaged", 'normal', false);
                }
            } else {
                ui.message("creatureHealth", 'normal', [monsterPercent]);
            }
        }
        var allItems = "";
        if (tile[tileX][tileY].tileitems) {
            var tileKeys = Object.keys(tile[tileX][tileY].tileitems);
            for (var tileId = 0; tileId < tileKeys.length; tileId++) {
                allItems += items[tileItems[tileKeys[tileId]].type].name + ", ";
            }
        }
        //Tell them about all the items there
        if (allItems) {
            allItems = allItems.slice(0, -2);
            ui.message("youSeeItems", 'normal', [allItems]);
        }
        if (tile[tileX][tileY].envItemList) {
            var envListLength = tile[tileX][tileY].envItemList.length;
            for (var envItem = 0; envItem < envListLength; envItem++) {
                var envItemId = tile[tileX][tileY].envItemList[envItem];
                ui.message("youSeeContainer", 'normal', [environmentals[envItems[envItemId].type].name]);
                //Container items
                if (envItems[envItemId].container) {
                    if (envItems[envItemId].container.length > 0) {
                        var containerOutputString = "";
                        envItems[envItemId].container = envItems[envItemId].container.filter(nullFilter);
                        var containerLength = envItems[envItemId].container.length;
                        for (var containerItemId = 0; containerItemId < containerLength; containerItemId++) {
                            if (envItems[envItemId].container !== undefined && envItems[envItemId].container !== null) {
                                containerOutputString += items[envItems[envItemId].container[containerItemId].type].name + ", ";
                            }
                        }
                        containerOutputString = containerOutputString.slice(0, -2);
                        ui.message("containerItems", 'normal', [containerOutputString]);
                    }
                }
                if (environmentals[envItems[envItemId].type].fire) {
                    getEnvItemStatus("fire", envItemId, envItems[envItemId].type);
                } else if (environmentals[envItems[envItemId].type].garden) {
                    getEnvItemStatus("garden", envItemId, envItems[envItemId].type);
                } else if (environmentals[envItems[envItemId].type].waterSource) {
                    if (envItems[envItemId].decay > 0) {
                        ui.message("thereIsBadWater", 'normal', false);
                    }
                    if (envItems[envItemId].decay === -2) {
                        ui.message("thereIsGoodWater", 'normal', false);
                    }
                }
            }
        }
    }
}
