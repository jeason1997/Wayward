/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

/**
 * Default jQueryUI _moveToTop function replacement for scrollbar focus bug fix via /bugs.jqueryui.com/ticket/9166
 */
$.widget('ui.dialog', $.ui.dialog, {
    _moveToTop: function (event, silent) {

        //Don't try to use _moveToTop on modals or overlays
        if (this.uiDialog.hasClass('ui-modal') || this.uiDialog.hasClass('ui-widget-overlay')) {
            return false;
        }

        var $parent = this.uiDialog.parent();
        var $elementsOnSameLevel = $parent.children();

        var highestZIndex = 0;
        $.each($elementsOnSameLevel, function (index, element) {

            //Don't count the z-index for modals, overlays or tool-tips!
            if ($(element).hasClass('ui-modal') || $(element).hasClass('ui-widget-overlay') || $(element).attr('id') === "tooltip" || $(element).attr('id') === "itemmenu") {
                return;
            }

            var zIndexOfElement = $(element).css('z-index');
            if (zIndexOfElement) {
                var zIndexOfElementAsNumber = parseInt(zIndexOfElement) || 0;
                if (zIndexOfElementAsNumber > highestZIndex) {
                    highestZIndex = zIndexOfElementAsNumber;
                }
            }
        });
        var currentZIndex = this.uiDialog.css('z-index');

        var moved;
        if (currentZIndex >= highestZIndex) {
            moved = false;
        } else {
            this.uiDialog.css('z-index', highestZIndex + 1);
            moved = true;
        }

        if (moved && !silent) {
            this._trigger("focus", event);
        }

        return moved;
    }
});

/**
 * Ui is for managing the interface.
 * @constructor
 */
function Ui() {
    this.containerOpened = {
        type: "",
        id: 0
    };
    this.keyState = [];
    this.cover = new Image();
    this.cover.src = 'images/cover.jpg';
    //Init the variables, but don't load the srcs until play()
    this.deathScreen = new Image();
    this.keyTimer = 0;
    this.mouseState = 0;
    this.options = {
        animations: true,
        autoGather: true,
        autoPickup: true,
        currentGame: 0,
        fontStyle: true,
        gameSize: true,
        hints: true,
        music: true,
        sound: true,
        volume: true,
        windowMode: true,
        smoothMovement: false,
        zoomLevel: 1,
        dropOnGather: false
    };
    this.winScreen = new Image();

    //Cached jQuery Selectors
    this.$actionsMenu = $('#actionsmenu')
        //Hide context menus on mouse leave
        .mouseleave(function () {
            $(this).hide();
        })
        //Click inspect from actions
        .on("mouseup", ".inspect", function () {
            $(this).parent().hide();
            player.actions.inspect(player.x + player.direction.x, player.y + player.direction.y);
        })
        .on("mouseup", ".drink", function () {
            $(this).parent().hide();
            if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].water || tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].shallowWater) {
                if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].freshWater) {
                    player.actions.eat(false, "unpurifiedfreshwaterwaterskin", true);
                    if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].shallowWater) {
                        changeTile({type: "dirt"}, player.x + player.direction.x, player.y + player.direction.y, false);
                    }
                } else {
                    player.actions.eat(false, "seawaterwaterskin", true);
                }
            } else if (tile[player.x + player.direction.x][player.y + player.direction.y].type === "snow") {
                player.actions.eat(false, "pileofsnow", true);
                changeTile({type: "dirt"}, player.x + player.direction.x, player.y + player.direction.y, false);
                game.delay += 10;
            }
            createParticles(12, 128, 247);
        })
        .on("mouseup", ".pickup", function () {
            $(this).parent().hide();
            //Are there any environmental items there?
            player.actions.pickupEnvItem(player.x + player.direction.x, player.y + player.direction.y);
        })
        .on("mouseup", ".gather", function () {
            $(this).parent().hide();
            player.actions.gather();
        })
        .on("mouseup", ".rest", function () {
            $(this).parent().hide();
            player.actions.rest();
        })
        .on("mouseup", ".pickup-door", function () {
            $(this).parent().hide();
            var resourceType = "woodendoor";
            var newTileType = resource[resourceType][0][2];
            var item = {
                type: resource[resourceType][0][0],
                quality: 'Random'
            };
            var tileItem;
            if (tileData[player.x + player.direction.x] && tileData[player.x + player.direction.x][player.y + player.direction.y] && tileData[player.x + player.direction.x][player.y + player.direction.y].length > 1) {
                tileItem = tileData[player.x + player.direction.x][player.y + player.direction.y][0];
                if (tileItem.mindur) {
                    item.mindur = tileItem.mindur - 1;
                    item.maxdur = tileItem.maxdur;
                    item.quality = '';
                }
            }
            itemGet(item, false);
            //Let's replace it with whatever is underneath it in the stack
            if (tileData[player.x + player.direction.x] && tileData[player.x + player.direction.x][player.y + player.direction.y] && tileData[player.x + player.direction.x][player.y + player.direction.y].length > 1) {
                tileData[player.x + player.direction.x][player.y + player.direction.y].shift();
                newTileType = tileData[player.x + player.direction.x][player.y + player.direction.y][0].type;
            }
            changeTile({type: newTileType}, player.x + player.direction.x, player.y + player.direction.y, false);
            audio.queueSfx('pickup');
            passTurn(true);
        });
    this.$attack = $('#attack');
    this.$attackOpen = $('#attack-open')
        //Tooltips for attack hover
        .on('mouseover', function (e) {

            var invClass = "";
            var hands = {
                righthand: {
                    damage: 0,
                    type: Messages.blunt
                },
                lefthand: {
                    damage: 0,
                    type: Messages.blunt
                }
            };
            var handSelectors = ["lefthand", "righthand"];
            var handId = 0;
            for (var h = 0; h < handSelectors.length; h++) {
                handId = $('#' + handSelectors[h]).find('li').attr('data-itemid');
                if (handId) {
                    invClass = player.invItems[parseInt(handId, 10)].type;
                    if (items[invClass].attack) {
                        hands[handSelectors[h]].damage = items[invClass].attack;
                        hands[handSelectors[h]].type = "";
                        for (var iDamage = 0; iDamage < items[invClass].damageType.length; iDamage++) {
                            hands[handSelectors[h]].type += Messages[items[invClass].damageType[iDamage]] + ", ";
                        }
                        hands[handSelectors[h]].type = hands[handSelectors[h]].type.substring(0, hands[handSelectors[h]].type.length - 2);
                    }
                }
            }

            var tacticsAttack = Utilities.roundNumber(player.skills.tactics.percent / 10, 0) + 1;
            var tip = '<ul>';
            tip += '<li>' + Messages.attackTacticsLabel + ' <span class="attack">' + tacticsAttack + '</span></li>';
            tip += '<li>' + Messages.attackBaseLabel + ' <span class="attack">' + player.attackFromEquip + '</span></li>';
            tip += '<li>' + Messages.leftHandLabel + ' <span class="attack">' + hands.lefthand.damage + '</span> (' + hands.lefthand.type + ')</li>';
            tip += '<li>' + Messages.rightHandLabel + ' <span class="attack">' + hands.righthand.damage + '</span> (' + hands.righthand.type + ')</li>';
            tip += '</ul>';
            ui.$tooltip.show().html('<p>' + tip + '</p>');
            ui.placeTooltip(e, false);
        })
        .on("mouseleave", function () {
            ui.$tooltip.hide();
        })
        .on("mousemove", function (e) {
            ui.placeTooltip(e, false);
        });
    this.$canvases = $('#game, #overlay, #title, #light');
    this.$code = $('#code');
    this.$container = $('#container')
        //Get items from a container and add to inventory.
        .on('contextmenu', 'li', function (e) {
            moveToInventoryFromContainer(parseInt($(this).attr("data-itemid"), 10));
            e.preventDefault();
        })
        //Context menu on container (remove from container stuff)
        .on("mouseup", ".tooltip", function (e) {
            if (e.which !== 3) {
                var invClass = $(this).attr("data-item");
                var invId = parseInt($(this).attr("data-itemid"), 10);
                var itemCount = ui.$container.find('.' + invClass).length;
                var menuButtons = '<button class="removefromcontainer">' + Messages.removeFromContainer + '</button>';
                ui.$tooltip.hide();
                if (itemCount > 1) {
                    menuButtons += '<button class="removeallfromcontainer">' + Messages.removeAllFromContainer + '</button>';
                }
                ui.$itemMenu
                    .show()
                    .html(menuButtons)
                    .attr('data-item', invClass)
                    .attr('data-itemid', invId);
                ui.placeTooltip(e, true);
            }
        })
        .on("mouseover", ".tooltip", function (e) {
            var invClass = $(this).attr("data-item");
            var invId = parseInt($(this).attr("data-itemid"), 10);
            var envId = game.containerOpened.id;

            //If the invItems number of the container is higher than envItems count, defaulting cont to envItems[envId] may be out of bounds. Default cont to undefined.
            //Fix submitted by Milo Hoffmann
            var cont;
            if (game.containerOpened.containerType === "INV") {
                cont = player.invItems[envId].container;
            } else {
                cont = envItems[envId].container;
            }

            var tip = ui.itemTip(cont, invId, invClass);
            ui.$tooltip.show().html('<p>' + tip + '</p>');
            ui.placeTooltip(e, false);
        })
        .on("mouseleave", ".tooltip", function () {
            ui.$tooltip.hide();
        })
        .sortable({
            distance: 5,
            scroll: false,
            helper: 'clone',
            appendTo: 'body',
            zIndex: 10000,
            items: 'li',
            connectWith: '#inventory',
            receive: function (event, userInt) {
                var invId = parseInt($(userInt.item).attr("data-itemid"), 10);
                var type = game.containerOpened.containerType;
                $(userInt.sender).sortable('cancel');
                dropItem(invId, type, false);
                audio.queueSfx('pickup');
            }
        });
    //Container window
    this.$containerWindow = $("#containerwindow");
    //Main menu options
    this.$continueGame = $('#continue-game').click(function () {
        game.dailyChallenge = false;
        ui.$loading.show();
        if (!game.start) {
            if (player.respawned) {
                respawn(player.respawned);
            } else if (player.died) {
                respawn();
            } else {
                play();
            }
        } else {
            respawn();
        }
        ui.$loading.hide();
        ui.$mainMenu.dialog('close');
    });
    this.$craft = $('#craft')
        .on("mouseover", ".tooltip", function (e) {
            if (ui.mouseState != "down") {
                var invClass = $(this).attr("data-item");
                var tip = ui.itemTip("", "", invClass);
                ui.$tooltip.show().html('<p>' + tip + '</p>');
                ui.placeTooltip(e, false);
            }
        })
        .on("mouseleave", ".tooltip", function () {
            ui.$inventoryEquip.find('.hover').removeClass('hover');
            ui.$tooltip.hide();
        })
        .on("mouseup", ".craft", function (e) {
            //Add slight delay to each craft
            if (ui.keyTimer >= 20) {
                var craftClass = $(this).attr("data-item");
                if (craftItem(craftClass)) {
                    ui.$inventoryEquip.find('.hover').removeClass('hover');
                    ui.$tooltip.hide();
                    var elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);
                    $(elementMouseIsOver).trigger('mouseover');
                }
                ui.keyTimer = 0;
            }
        })
        .on("mousemove", ".tooltip", function (e) {
            ui.placeTooltip(e, false);
        });
    this.$craftWindow = $('#craftwindow');
    this.$defense = $('#defense');
    this.$defenseOpen = $('#defense-open')
        //Tooltips for defense hover
        .on('mouseover', function (e) {
            var parryingDefense = Utilities.roundNumber(player.skills.parrying.percent / 10, 0);
            var tip = '<ul>';
            tip += '<li>' + Messages.defenseParryLabel + ' <span class="defense">' + parryingDefense + '</span></li>';
            tip += '<li>' + Messages.defenseBaseLabel + ' <span class="defense">' + (player.defense.base - parryingDefense) + '</span></li>';
            tip += '<li>' + Messages.bluntLabel + ' <span class="defense">' + player.defense.blunt + '</span></li>';
            tip += '<li>' + Messages.piercingLabel + ' <span class="defense">' + player.defense.piercing + '</span></li>';
            tip += '<li>' + Messages.slashingLabel + ' <span class="defense">' + player.defense.slashing + '</span></li>';
            tip += '<li>' + Messages.fireLabel + ' <span class="defense">' + player.defense.fire + '</span></li>';
            tip += '</ul>';
            ui.$tooltip.show().html('<p>' + tip + '</p>');
            ui.placeTooltip(e, false);
        })
        .on("mouseleave", function () {
            ui.$tooltip.hide();
        })
        .on("mousemove", function (e) {
            ui.placeTooltip(e, false);
        });
    this.$document = $(document)
        //Prevent right clicking otherwise
        .bind("contextmenu", function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    this.$body = $('body');
    this.$equip = $('.equip')
        //Right click unequip
        .on("contextmenu", "li", function (e) {
            unEquipItem($(this));
            e.preventDefault();
        })
        .sortable({
            distance: 5,
            scroll: false,
            helper: 'clone',
            appendTo: 'body',
            zIndex: 10000,
            items: 'li',
            connectWith: '.sortable',
            receive: function (event, userInt) {
                var slot = $(this).attr("id");
                var invClass = $(userInt.item).attr("data-item");
                if (items[invClass].equip) {
                    var equipItem = items[invClass].equip;
                    if (slot === equipItem || equipItem === "held" && slot === "lefthand" || equipItem === "held" && slot === "righthand") {
                        //Swap out items
                        var list = $(this);
                        if (list.children().length > 1) {
                            //Send already equipped items back to inventory
                            var swappedItem = $('li', list).not($(userInt.item));
                            var swappedItemId = parseInt(swappedItem.attr("data-itemid"), 10);
                            player.invItems[swappedItemId].equipped = false;
                            $(userInt.sender).append(swappedItem);
                        }
                        var invId = parseInt($(userInt.item).attr("data-itemid"), 10);
                        player.invItems[invId].equipped = slot;
                        if (ui.options.hints && !player.hintseen.helditems) {
                            ui.hintDisplay("helditems");
                        }
                        ui.message("equipItem", 'normal', [items[invClass].name]);
                        passTurn(true);
                    } else {
                        ui.message("cantEquipThere", "normal");
                        $(userInt.sender).sortable('cancel');
                    }
                } else {
                    ui.message("cantEquip", 'normal');
                    $(userInt.sender).sortable('cancel');
                }
                audio.queueSfx('pickup');
            },
            remove: function (event, userInt) {
                var invId = parseInt($(userInt.item).attr("data-itemid"), 10);
                var invClass = $(userInt.item).attr("data-item");
                player.invItems[invId].equipped = false;
                player.calculateEquipmentStats();
                if (items[invClass].onequip) {
                    lighting();
                }
                player.attributes();
            }
        });
    this.$equipList = $('#lefthand, #chest, #head, #legs, #feet, #belt, #neck, #hands, #righthand, #back');
    this.$equipment = $('#equipment')
        //Equipment tool-tips
        .on("mouseover", ".equip", function (e) {
            if ($(this).children().length <= 0) {
                ui.$tooltip.show().html('<p>' + $(this).attr("data-name") + '</p>');
                ui.placeTooltip(e, false);
            }
        })
        .on("mouseleave", ".equip", function () {
            ui.$tooltip.hide();
        })
        .on("mousemove", ".equip", function (e) {
            ui.placeTooltip(e, false);
        });
    this.$equipmentWindow = $('#equipmentwindow');
    this.$held = $('#lefthand, #righthand');
    this.$health = $('#health');
    this.$hintWindow = $('#hintswindow')
        //Hints window - doesn't get saved
        .dialog({
            width: 500,
            height: 250,
            autoOpen: false,
            closeOnEscape: false,
            closeText: "",
            modal: true,
            dialogClass: 'ui-modal',
            resizable: false,
            draggable: false,
            buttons: [
                {
                    text: Messages.disableHints,
                    click: function () {
                        ui.options.hints = false;
                        $(this).dialog("close");
                        ui.message("hintsDisabled", 'normal');
                        updateOptionButtonText();
                    }
                },
                {
                    text: Messages.previousHint,
                    click: function () {
                        ui.hintDisplay("prev");
                    }
                },
                {
                    text: Messages.nextHint,
                    click: function () {
                        ui.hintDisplay("next");
                    }
                }
            ]
        });
    this.$hud = $('#hud');
    this.$hunger = $('#hunger');
    this.$inventory = $('#inventory')
        //Place items on ground with right click - DROP IT LIKE IT'S HOT
        .on("contextmenu", "li", function (e) {
            dropItem(parseInt($(this).attr("data-itemid"), 10), 'TILE', false);
            e.preventDefault();
        })
        .sortable({
            distance: 5,
            scroll: false,
            helper: 'clone',
            appendTo: 'body',
            zIndex: 10000,
            connectWith: '.sortable',
            receive: function (event, userInt) {
                if (userInt.sender.context.id === "container") {
                    $(userInt.sender).sortable('cancel');
                    moveToInventoryFromContainer(parseInt($(userInt.item).attr("data-itemid"), 10));
                }
            }
        })
        .on("mousemove", ".tooltip", function (e) {
            ui.placeTooltip(e, false);
        });
    this.$inventoryEquip = $('#inventory, .equip, .quickslot')
        .on("mouseover", ".tooltip", function (e) {
            var invClass = $(this).attr("data-item");
            var invId = parseInt($(this).attr("data-itemid"), 10);
            var tip = ui.itemTip(player.invItems, invId, invClass);
            ui.$tooltip.show().html('<p>' + tip + '</p>');
            ui.placeTooltip(e, false);
        })
        .on("mouseleave", ".tooltip", function () {
            ui.$tooltip.hide();
        })
        //Context menu on inventory
        .on("mouseup", ".tooltip", function (e) {
            if (e.which !== 3) {
                ui.$tooltip.hide();
                var invClass = $(this).attr("data-item");
                var invId = parseInt($(this).attr("data-itemid"), 10);
                var itemCount = ui.$inventoryEquip.find('.' + invClass).length;
                var hotKey = "";
                //If it's a quickslot use, set the quickslot data so we can check if we need to restock
                if ($(this).parent().hasClass('quickslot')) {
                    hotKey = $(this).parent().attr('id');
                }

                var menuButtons = "";
                //Create our menu based on item
                if (items[invClass].use) {
                    for (var i = 0; i < items[invClass].use.length; i++) {
                        menuButtons += '<button class="use" data-use="' + items[invClass].use[i] + '">' + descriptions[items[invClass].use[i]].name + '</button>';
                    }
                }
                //Equip
                if (items[invClass].equip) {
                    if ($(this).parent().hasClass('equip')) {
                        menuButtons += '<button class="unequip">' + Messages.unEquip + '</button>';
                    } else {
                        menuButtons += '<button class="equipto">' + Messages.equipTo + items[invClass].equip + '</button>';
                    }
                }
                //Add to quicklot
                if ($(this).parent().hasClass('quickslot')) {
                    menuButtons += '<button class="removefromquickslot">' + Messages.removeFromQuickslot + '</button>';
                } else {
                    var quickSlotCount = ui.$quickSlot.find('li').length;
                    if (quickSlotCount < 9) {
                        menuButtons += '<button class="addtoquickslot">' + Messages.addToQuickslot + '</button>';
                    }
                }
                //Drop in container
                if (game.containerOpened.id >= 0 && game.containerOpened.containerType) {
                    menuButtons += '<button class="dropinopenedcontainer">' + Messages.dropInOpenedContainer + '</button>';
                    if (itemCount > 1) {
                        menuButtons += '<button class="dropallinopenedcontainer">' + Messages.dropAllInOpenedContainer + '</button>';
                    }
                }
                //Throwing
                menuButtons += '<button class="throw">' + Messages.throw + '</button>';
                //Drop
                if (game.containerOpened.containerType !== "ENV") {
                    menuButtons += '<button class="drop">' + Messages.drop + '</button>';
                    if (itemCount > 1) {
                        menuButtons += '<button class="dropall">' + Messages.dropAll + '</button>';
                    }
                }
                //Nest the isItemInInventory checks inside the ifs for performance
                //Repair
                if (items[invClass].durability && player.invItems[invId].mindur < player.invItems[invId].maxdur) {
                    var repair = player.isItemInInventory("repair", false, invId);
                    if (repair) {
                        menuButtons += '<button class="repair">' + groups.repair.name + ' ' + Messages.with + ' ' + items[repair.type].name + '</button>';
                    }
                }
                //Transmogrify
                if (items[invClass].equip) {
                    var transmogrify = player.isItemInInventory("transmogrify");
                    if (transmogrify) {
                        menuButtons += '<button class="transmogrify">' + groups.transmogrify.name + ' ' + Messages.with + ' ' + items[transmogrify.type].name + '</button>';
                    }
                }
                //Reinforce
                if (items[invClass].durability) {
                    var reinforce = player.isItemInInventory("reinforce");
                    if (reinforce) {
                        menuButtons += '<button class="reinforce">' + groups.reinforce.name + ' ' + Messages.with + ' ' + items[reinforce.type].name + '</button>';
                    }
                }
                //Preserve
                if (items[invClass].decayable && items[invClass].use.indexOf('eat') > -1 && items[invClass].use.indexOf('preserve') === -1) {
                    var preserve = player.isItemInInventory("preserve");
                    if (preserve) {
                        menuButtons += '<button class="preserve">' + groups.preserve.name + ' ' + Messages.with + ' ' + items[preserve.type].name + '</button>';
                    }
                }

                ui.$itemMenu
                    .show()
                    .html(menuButtons)
                    .attr('data-item', invClass)
                    .attr('data-itemid', invId)
                    .attr('data-quickslot', hotKey);
                ui.placeTooltip(e, true);
            }
        });
    this.$inventoryWindow = $('#inventorywindow');
    this.$itemMenu = $('#itemmenu')
        //Hide context menus on mouse leave
        .mouseleave(function () {
            $(this).hide();
        })
        //Click equip from item menu
        .on("mouseup", ".equipto", function () {
            $(this).parent().hide();
            var invClass = $(this).parent().attr("data-item");
            var invId = parseInt($(this).parent().attr("data-itemid"), 10);
            var equipItem = items[invClass].equip.toLowerCase();
            var equipSlot;
            //Is it a held item?
            if (equipItem === "held") {
                //Try left hand first, if not, always replace/use right hand
                equipSlot = ui.$equipment.children('#lefthand');
                equipItem = "lefthand";
                if (equipSlot.children().length >= 1) {
                    equipSlot = ui.$equipment.children('#righthand');
                    equipItem = "righthand";
                }
            } else {
                equipSlot = ui.$equipment.children('#' + equipItem);
            }
            //Already something equipped in there?
            if (equipSlot.children().length >= 1) {
                var swappedItem = equipSlot.find('li');
                var swappedItemId = parseInt(swappedItem.attr("data-itemid"), 10);
                player.invItems[swappedItemId].equipped = false;
                ui.$inventory.append(swappedItem);
            }
            equipSlot.append(ui.$inventoryEquip.find('li[data-itemid="' + invId + '"]'));

            ui.message("equipItem", 'normal', [items[invClass].name]);
            player.invItems[invId].equipped = equipItem;
            if (ui.options.hints && !player.hintseen.helditems) {
                ui.hintDisplay("helditems");
            }
            passTurn(true);
            audio.queueSfx('pickup');

        })
        //Click use from item menu
        .on("mouseup", ".use", function () {
            $(this).parent().hide();
            //Being used from a quickslot?
            var hotKey = parseInt($(this).parent().attr('data-quickslot'), 10);
            useItem($(this).parent(), hotKey, $(this).attr("data-use"));
        })
        //Remove from quickslot
        .on("mouseup", ".removefromquickslot", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            player.invItems[invId].quickSlotted = false;
            ui.$quickSlot.find('li[data-itemid="' + invId + '"]').appendTo(ui.$inventory);
            audio.queueSfx('pickup');
        })
        //Add to empty quickslot
        .on("mouseup", ".addtoquickslot", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            var slot = 0;
            ui.$quickSlot.each(function () {
                slot++;
                if ($(this).children('li').length === 0) {
                    player.invItems[invId].quickSlotted = slot;
                    ui.$inventoryEquip.find('li[data-itemid="' + invId + '"]').appendTo($(this));
                    audio.queueSfx('pickup');
                    return false;
                }
            });
        })
        //Click throw from item menu
        .on("mouseup", ".throw", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            player.actions.attack(invId, 'throwItem');
            //Being used from a quickslot?
            var hotKey = parseInt($(this).parent().attr('data-quickslot'), 10);
            //Restock quickslot
            if (hotKey) {
                var invClass = $(this).parent().attr('data-item');
                reQuickSlot(invId, invClass, hotKey - 1);
            }
        })
        //Click drop from item menu
        .on("mouseup", ".drop", function () {
            $(this).parent().hide();
            dropItem(parseInt($(this).parent().attr("data-itemid"), 10), 'TILE', false);
        })
        //Click drop in opened container from item menu
        .on("mouseup", ".dropinopenedcontainer", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            var type = game.containerOpened.containerType;
            dropItem(invId, type, false);
            audio.queueSfx('pickup');
        })
        //Click drop all in opened container from item menu
        .on("mouseup", ".dropallinopenedcontainer", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            var type = game.containerOpened.containerType;
            dropItem(invId, type, true);
            audio.queueSfx('pickup');
        })
        //Remove from container
        .on("mouseup", ".removefromcontainer", function () {
            $(this).parent().hide();
            moveToInventoryFromContainer(parseInt($(this).parent().attr('data-itemid'), 10));
        })
        //Remove all from container
        .on("mouseup", ".removeallfromcontainer", function () {
            $(this).parent().hide();
            moveToInventoryFromContainer(parseInt($(this).parent().attr('data-itemid'), 10), true);
        })
        //Click drop all from item menu
        .on("mouseup", ".dropall", function () {
            $(this).parent().hide();
            dropItem(parseInt($(this).parent().attr("data-itemid"), 10), 'TILE', true);
        })
        //Click un-equip from the menu
        .on("mouseup", ".unequip", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            var item = ui.$inventoryEquip.find('li[data-itemid="' + invId + '"]');
            unEquipItem(item);
        })
        .on("mouseup", ".repair", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            var repair = player.isItemInInventory("repair", false, invId);
            player.actions.repair(repair.itemId, "", repair.containerId, invId);
        }).on("mouseup", ".transmogrify", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            var transmogrify = player.isItemInInventory("transmogrify");
            player.actions.transmogrify(transmogrify.itemId, "", transmogrify.containerId, invId);
        }).on("mouseup", ".reinforce", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            var reinforce = player.isItemInInventory("reinforce");
            player.actions.reinforce(reinforce.itemId, "", reinforce.containerId, invId);
        }).on("mouseup", ".preserve", function () {
            $(this).parent().hide();
            var invId = parseInt($(this).parent().attr('data-itemid'), 10);
            var preserve = player.isItemInInventory("preserve");
            player.actions.preserve(preserve.itemId, "", preserve.containerId, invId);
        });
    this.$light = $('#light');
    this.$loading = $('#loading');
    this.$mainMenu = $('#main-menu')
        .dialog({
            width: 260,
            height: 'auto',
            minHeight: 0,
            autoResize: true,
            autoOpen: false,
            closeOnEscape: false,
            closeText: "",
            modal: true,
            dialogClass: 'ui-modal',
            resizable: false,
            draggable: false
        });
    this.$messageOverlay = $('#messageoverlay');
    this.$messages = $('#messages');
    this.$messagesWindow = $("#messageswindow");
    this.$milestones = $('#milestones')
        .on('mouseover', '.tooltip', function (e) {
            var milestoneName = $(this).data("milestone");
            if (player.milestoneCount[milestoneName].type === "hidden" && player.milestoneCount[milestoneName].amount !== true) {
                ui.$tooltip.show().html('<p>' + Messages.hiddenMilestone + '</p>');
            } else if (player.milestoneCount[milestoneName].type === "invisible" && player.milestoneCount[milestoneName].amount !== true) {
                ui.$tooltip.show().html('<p>' + Messages.invisibleMilestone + '</p>');
            } else {
                ui.$tooltip.show().html('<p>' + player.milestones[milestoneName].description + '</p>');
            }
            ui.placeTooltip(e, false);
        })
        .on("mouseleave", ".tooltip", function () {
            ui.$tooltip.hide();
        })
        .on("mousemove", ".tooltip", function (e) {
            ui.placeTooltip(e, false);
        });
    this.$milestonesWindow = $('#milestoneswindow');
    this.$optionsWindow = $("#optionswindow");
    this.$quickSlot = $('.quickslot')
        //Right click remove from quickslot
        .on("contextmenu", "li", function (e) {
            var removeItem = $(this);
            var invId = parseInt($(this).attr("data-itemid"), 10);
            player.invItems[invId].quickSlotted = false;
            ui.$inventory.append(removeItem);
            audio.queueSfx('pickup');
            e.preventDefault();
        })
        .sortable({
            distance: 5,
            scroll: false,
            helper: 'clone',
            appendTo: 'body',
            zIndex: 10000,
            items: 'li',
            connectWith: '.sortable',
            receive: function (event, userInt) {
                var list = $(this);
                var slot = $(this).attr("id");
                var invId = parseInt($(userInt.item).attr("data-itemid"), 10);
                if (list.children().length > 2) {
                    //Swap out quick slot item
                    var swappedItem = $('li', list).not($(userInt.item));
                    var swappedItemId = parseInt(swappedItem.attr("data-itemid"), 10);
                    player.invItems[swappedItemId].quickSlotted = false;
                    $(userInt.sender).append(swappedItem);
                }
                player.invItems[invId].quickSlotted = slot;
                audio.queueSfx('pickup');
            },
            remove: function (event, userInt) {
                var invId = parseInt($(userInt.item).attr("data-itemid"), 10);
                player.invItems[invId].quickSlotted = false;
            }
        })
        .on("mousemove", ".tooltip", function (e) {
            ui.placeTooltip(e, false);
        });
    this.$runCode = $('#run-code').click(function () {
        ui.message("runningCode", 'normal');
        $.globalEval(ui.$code.val());
    });
    this.$quickSlots = $('.quickslots');
    this.$skills = $('#skills')
        //Tooltips
        .on('mouseover', '.tooltip', function (e) {
            var skillName = $(this).data("skill");
            ui.$tooltip.show().html('<p>' + player.skillTypes[skillName].description + '</p>');
            ui.placeTooltip(e, false);
        })
        .on("mouseleave", ".tooltip", function () {
            ui.$tooltip.hide();
        })
        .on("mousemove", ".tooltip", function (e) {
            ui.placeTooltip(e, false);
        });
    this.$skillsWindow = $("#skillswindow");
    this.$stamina = $('#stamina');
    this.$status = $('#status');
    this.$talent = $('#talent');
    this.$thirst = $('#thirst');
    this.$tooltip = $('#tooltip');
    this.$weight = $('#weight');
    this.$window = $(window)
        //Remove all keypresses on game unfocus
        .on('blur', function () {
            ui.keyState = [];
            ui.mouseState = 0;
        });

    /**
     * Shows a tooltip or itemmenu at the cursor if there is a tooltip enabled item there.
     * @param e
     * @param type
     */
    this.placeTooltip = function (e, type) {

        var tooltip;
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        var offsetY = 15;
        var offsetX = 15;
        var offsetOnEdge = -15;
        if (type) {
            tooltip = this.$itemMenu;
            offsetY = -15;
            offsetOnEdge = 15;
            offsetX = -(tooltip.outerWidth() / 2);
        } else {
            tooltip = this.$tooltip;
        }

        var distanceToTop = mouseY - $(document).scrollTop();
        var distanceToLeft = mouseX - $(document).scrollLeft();
        var distanceToBottom = this.$body.height() - distanceToTop - tooltip.outerHeight();
        var distanceToRight = this.$body.width() - distanceToLeft - tooltip.outerWidth();

        var top, left;

        switch (true) {
            case (distanceToTop <= 0):
                top = mouseY + offsetY;
                break;
            case (distanceToBottom <= 15):
                top = mouseY - tooltip.outerHeight() + offsetOnEdge;
                break;
            default:
                top = mouseY + offsetY;
                break;
        }
        switch (true) {
            case (distanceToLeft <= 0):
                left = mouseX + offsetX;
                break;
            case (distanceToRight <= 15):
                left = mouseX - tooltip.outerWidth() + offsetOnEdge;
                break;
            default:
                left = mouseX + offsetX;
                break;
        }
        if (left < 0) {
            left = 0;
        }
        tooltip.css({top: top, left: left});
    };
    /**
     * Make a tooltip for an item.
     * @param itemList
     * @param invId
     * @param invClass
     * @returns {string}
     */
    this.itemTip = function (itemList, invId, invClass) {
        var quality = "";
        if (itemList && itemList[invId].quality) {
            quality = " (" + itemList[invId].quality + ")";
            if (itemList[invId].quality === "legendary" && itemList[invId].props) {
                quality += "<br /><strong>(+" + itemList[invId].props[1] + " " + player.skillTypes[itemList[invId].props[0]].name + ")</strong>";
            }
        }
        var tip = items[invClass].name + quality + "<br />";

        //Item uses
        if (items[invClass].use) {
            if (items[invClass].use.length > 1) {
                tip += "<br />" + Messages.uses;
            } else {
                tip += "<br /" + Messages.use;
            }
            for (var iUse = 0; iUse < items[invClass].use.length; iUse++) {
                tip += " " + descriptions[items[invClass].use[iUse]].name + ",";
            }
            tip = tip.substring(0, tip.length - 1);
        }

        if (items[invClass].equip) {
            tip += "<br />" + Messages.equip + " " + Messages[items[invClass].equip];
        }
        if (items[invClass].attack) {
            if (!items[invClass].equip) {
                tip += "<br />" + Messages.rangedDamage + " ";
            }
            tip += " (+" + items[invClass].attack + " ";
            for (var iDamage = 0; iDamage < items[invClass].damageType.length; iDamage++) {
                tip += Messages[items[invClass].damageType[iDamage]] + ", ";
            }
            tip = tip.substring(0, tip.length - 2);
            tip += " " + Messages.attack + ")";
        }

        if (items[invClass].defense) {
            var output = '<ul><li>' + Messages.base + items[invClass].defense.base + '</li>';
            if (items[invClass].defense.resist[0]) {
                output += '<li>' + Messages.resists;
                for (var resist = 0; resist < items[invClass].defense.resist.length; resist++) {
                    output += Messages[items[invClass].defense.resist[resist][0]] + ' (' + items[invClass].defense.resist[resist][1] + '), ';
                }
                output = output.substr(0, output.length - 2);
                output += '</li>';
            }
            if (items[invClass].defense.vulnerable[0]) {
                output += '<li>' + Messages.vulnerabilities;
                for (var vulnerability = 0; vulnerability < items[invClass].defense.vulnerable.length; vulnerability++) {
                    output += Messages[items[invClass].defense.vulnerable[vulnerability][0]] + ' (' + items[invClass].defense.vulnerable[vulnerability][1] + '), ';
                }
                output = output.substr(0, output.length - 2);
                output += '</li>';
            }
            output += '</ul>';
            tip += "<br />" + Messages.defenseLabel + " " + output;
        }
        if (items[invClass].ranged) {
            var attack = "+" + items[invClass].ranged.attack;
            if (items[invClass].ranged.attack === 0) {
                attack = Messages.notAvailable;
            }
            tip += "<br />" + Messages.ranged + " (" + Messages.range + " " + items[invClass].ranged.range + ", " + Messages.rangedAttack + " " + attack + ")";
        }
        if (items[invClass].onequip) {
            tip += "<br />" + Messages.onEquip + " " + items[invClass].onequip[0] + " (+" + items[invClass].onequip[1] + ")";
        }
        if (items[invClass].group) {
            tip += "<br />" + Messages.grouping;
            for (var iGroup = 0; iGroup < items[invClass].group.length; iGroup++) {
                tip += " " + groups[items[invClass].group[iGroup]].name + ",";
            }
            tip = tip.substring(0, tip.length - 1);
        }
        if (items[invClass].weight) {
            tip += "<br />" + Messages.weight + " " + items[invClass].weight;
        }
        if (items[invClass].maxWeight) {
            tip += "<br />" + Messages.maximumWeight + " " + items[invClass].maxWeight + "<br />" + Messages.weightReduction + " -25%";
        }
        if (itemList) {
            tip += "<br />" + Messages.durability + " " + itemList[invId].mindur + "/" + itemList[invId].maxdur;
        }
        if (itemList && items[invClass].decayable) {
            tip += "<br />" + Messages.decay + " " + itemList[invId].decay;
        }
        if (items[invClass].use) {
            for (var i = 0; i < items[invClass].use.length; i++) {
                tip += "<br /><br />" + descriptions[items[invClass].use[i]].name + ": " + descriptions[items[invClass].use[i]].description;
            }
        }

        //For crafting tool-tips
        if (!itemList) {
            var outputReq = "";
            var findItem = "";
            for (var requiredItem = 0; requiredItem < items[invClass].recipe.requires.length; requiredItem++) {
                var foundItem = 0;
                if (items[invClass].recipe.requires[requiredItem]) {
                    var itemType = items[invClass].recipe.requires[requiredItem][0];
                    var itemName = '';
                    if (items[itemType]) {
                        itemName = items[itemType].name;
                    } else {
                        itemName = groups[itemType].name;
                    }
                    var amountRequire = items[invClass].recipe.requires[requiredItem][1];
                    var amountUsed = items[invClass].recipe.requires[requiredItem][2];

                    findItem = this.$inventoryEquip.find('.' + itemType);
                    outputReq += "<br />";

                    //Add hover effect for items that you do have and only show the one it's going to use in the craft, in order of inventory, equip, quickslot
                    if (findItem.length > 0) {
                        this.$inventory.find('.' + itemType).each(function () {
                            foundItem++;
                            if (foundItem <= amountRequire) {
                                $(this).addClass('hover');
                            }
                        });
                        if (foundItem <= amountRequire) {
                            this.$equip.find('.' + itemType).each(function () {
                                foundItem++;
                                if (foundItem <= amountRequire) {
                                    $(this).addClass('hover');
                                }
                            });
                        }
                        if (foundItem <= amountRequire) {
                            this.$quickSlot.find('.' + itemType).each(function () {
                                foundItem++;
                                if (foundItem <= amountRequire) {
                                    $(this).addClass('hover');
                                }
                            });
                        }
                    }

                    //Show tool-tips in red if you don't have enough items.
                    if (findItem.length < amountUsed || amountUsed <= 0 && findItem.length <= 0) {
                        outputReq += '<span class="bad">';
                    }

                    outputReq += "x" + amountRequire + " " + itemName;
                    if (amountUsed > 0) {
                        outputReq += " (x" + amountUsed + " " + Messages.consumed + ")";
                    }

                    if (findItem.length < amountUsed || amountUsed <= 0 && findItem.length <= 0) {
                        outputReq += '</span>';
                    }
                }
            }
            if (items[invClass].recipe.requiredenv) {
                var requiredEnvironmental = environmentals[items[invClass].recipe.requiredenv].name;
                outputReq += "<br /><br />" + Messages.environmentalRequired + " " + requiredEnvironmental;
            }

            tip += "<br /><br />" + Messages.skill + " " + player.skillTypes[items[invClass].recipe.skill].name + "<br />" + Messages.level + " " + Messages[items[invClass].recipe.level] + "<br /><br />" + Messages.requires + " " + outputReq;

        }
        return tip;
    };
    /**
     * Function for displaying hints
     * @param hint
     */
    this.hintDisplay = function (hint) {
        var hintsKey = Object.keys(hints);
        var hintLength = hintsKey.length;

        if (hint === "next") {
            game.hintIndex++;
            if (game.hintIndex >= hintLength) {
                game.hintIndex = 0;
            }
        } else if (hint === "prev") {
            game.hintIndex--;
            if (game.hintIndex <= 1) {
                game.hintIndex = hintLength - 1;
            }
        }
        if (hint === "next" || hint === "prev") {
            var iLoop = 0;
            for (var i = 0; i < hintLength; i++) {
                if (iLoop === game.hintIndex) {
                    hint = hintsKey[i];
                }
                iLoop++;
            }
        } else {
            //If it's not coming from the help dialog, make sure the hint is set as "seen".
            player.hintseen[hint] = true;
        }
        $("#hintswindow").dialog("open").dialog({
            title: hints[hint].name
        });
        $("#hints").html(hints[hint].description);
        //Remove all keypresses
        this.keyState = [];
        this.mouseState = 0;
    };
    /**
     * Fullscreen options
     */
    this.launchFullScreen = function () {
        if (nodewebkit) {
            win.toggleFullscreen();
        } else {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(document.documentElement.ALLOW_KEYBOARD_INPUT);
            }

        }
    };
    /**
     * Cancel fullscreen
     */
    this.cancelFullscreen = function () {
        if (nodewebkit) {
            win.toggleFullscreen();
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    };
    /**
     * Message function used for all on-screen game text via overlay or message dialog
     * @param msg {string}
     * @param messageType {string/boolean}
     * @param variables {*}
     */
    this.message = function (msg, messageType, variables) {
        if (messageType === "" || !messageType) {
            messageType = "normal";
        }
        msg = makeString(msg, variables);
        this.$messages.append("<p class=\"" + messageType + "\">" + msg + "</p>");
        //Check to see if message window is a dialog before checking if it's open (errors can cause messages to load before dialogs are created)
        if (this.$messagesWindow.hasClass('ui-dialog-content') && this.$messagesWindow.dialog("isOpen") !== true) {
            this.$messageOverlay.append("<p class=\"" + messageType + "\">" + msg + "</p>");
        }
        this.$messagesWindow.scrollTop(this.$messagesWindow[0].scrollHeight);
    };
    this.textAbove = function (msg, red, green, blue, type, offsetX, offsetY) {

        var x = game.windowMiddleX + game.halfGridSize;
        var y = game.windowMiddleY + game.halfGridSize;
        if (!offsetX) {
            offsetX = 0;
        }
        if (!offsetY) {
            offsetY = 0;
        }

        if (offsetY === 0 && offsetX === 0) {
            if (type === "target") {
                if (player.direction.x === 1) {
                    x = x + game.gridSize;
                } else if (player.direction.x === -1) {
                    x = x - game.gridSize;
                } else if (player.direction.y === 1) {
                    y = y + game.gridSize;
                } else if (player.direction.y === -1) {
                    y = y - game.gridSize;
                }
            }
        }
        //Add some variation to horizontal position
        x += Math.floor(Math.random() * 16 - 8);
        game.texts.push({msg: msg, x: x + offsetX, y: y + offsetY, r: red, g: green, b: blue, opacity: 1, delay: 0});
    };
    /**
     * Function for initializing the main, savable dialog windows - call these after load.
     */
    this.dialogInit = function () {
        var dialogList = {
            skillswindow: {dialog: ui.$skillsWindow},
            milestoneswindow: {dialog: ui.$milestonesWindow},
            inventorywindow: {
                dialog: ui.$inventoryWindow,
                buttons: [
                    {
                        text: Messages.sort,
                        click: function () {
                            ui.sortInventory(ui.$inventory, "inventory");
                        }
                    }
                ]},
            containerwindow: {
                dialog: ui.$containerWindow,
                buttons: [
                    {
                        text: Messages.grabAll,
                        click: function () {
                            var envId = game.containerOpened.id;
                            var cont = envItems[envId].container;
                            if (game.containerOpened.containerType === "INV") {
                                cont = player.invItems[envId].container;
                            }
                            ui.$container.find('.item').each(function () {
                                var itemId = $(this).data('itemid');
                                itemGet(cont[itemId], 'silent');
                                $(this).remove();
                            });
                            audio.queueSfx('pickup');
                            ui.message('containerBackpack', 'normal');
                            cont = [];
                            if (game.containerOpened.containerType === "INV") {
                                player.invItems[envId].container = [];
                            } else {
                                envItems[envId].container = [];
                            }
                            passTurn(true);
                        }
                    },
                    {
                        text: Messages.sort,
                        click: function () {
                            ui.sortInventory(ui.$container, "container");
                        }
                    }
                ]
            },
            equipmentwindow: {dialog: ui.$equipmentWindow},
            craftwindow: {
                dialog: ui.$craftWindow,
                buttons: [
                    {
                        text: Messages.sort,
                        click: function () {
                            ui.sortCrafts();
                        }
                    }
                ]},
            messageswindow: {
                dialog: ui.$messagesWindow,
                buttons: [
                    {
                        text: Messages.clearMessages,
                        click: function () {
                            $("#messages").empty();
                        }
                    }
                ]},
            optionswindow: {dialog: ui.$optionsWindow}
        };

        var dialogListKey = Object.keys(dialogList);
        for (var dialog = 0; dialog < dialogListKey.length; dialog++) {
            dialogList[dialogListKey[dialog]].dialog.dialog({
                position: [
                    player.dialog[dialogListKey[dialog]].x,
                    player.dialog[dialogListKey[dialog]].y
                ],
                minHeight: 75,
                minWidth: 140,
                width: player.dialog[dialogListKey[dialog]].w,
                height: player.dialog[dialogListKey[dialog]].h,
                autoOpen: player.dialog[dialogListKey[dialog]].open,
                closeOnEscape: false,
                closeText: "",
                buttons: dialogList[dialogListKey[dialog]].buttons,
                close: function () {
                    player.dialog[this.id].open = false;
                    if (this.id === "containerwindow") {
                        closeContainer();
                    }
                },
                open: function () {
                    player.dialog[this.id].open = true;
                    $(this).dialog("option", "position", [player.dialog[this.id].x, player.dialog[this.id].y]);
                },
                dragStop: function () {
                    player.dialog[this.id].x = $(this).parent().offset().left;
                    player.dialog[this.id].y = $(this).parent().offset().top;
                },
                resizeStop: function () {
                    player.dialog[this.id].h = $(this).parent().height();
                    player.dialog[this.id].w = $(this).parent().width();
                    player.dialog[this.id].x = $(this).parent().offset().left;
                    player.dialog[this.id].y = $(this).parent().offset().top;
                },
                create: function () {
                    $(this).parents().on('resize', function (e) {
                        e.stopPropagation();
                    });
                }
            });
        }

        //Attach filters to button panes
        $("#inventorywindow").parent().find('.ui-dialog-buttonpane').append($('#invfilter'));
        $("#craftwindow").parent().find('.ui-dialog-buttonpane').append($('#craftfilter'));
        //Reset listeners
        ui.$invFilter = $('#invfilter').on('keyup', function () {
            ui.filterInventory();
        });
        ui.$craftFilter = $('#craftfilter').on('keyup', function () {
            ui.filterCrafts();
        });

    };
    this.filterInventory = function () {
        var invItems = ui.$inventory.find('li');
        var invItem = "";
        invItems.show();
        $.each(invItems, function () {
            //Make a string out of their name, and group
            if (!$(this).hasClass("ui-sortable-placeholder")) {
                invItem = items[$(this).attr("data-item")].name;
                invItem += items[$(this).attr("data-item")].group;
                if (invItem.toLowerCase().indexOf(ui.$invFilter.val().toLowerCase()) === -1) {
                    $(this).hide();
                }
            }
        });
    };
    this.$invFilter = $("#invfilter")
        //Inventory filter
        .on('keyup', function () {
            ui.filterInventory();
        });
    this.filterCrafts = function () {
        var craftItems = ui.$craft.find('div');
        var craftItem = "";
        craftItems.show();
        $.each(craftItems, function () {
            //Make a string out of their name, group, and skill to search
            craftItem = items[$(this).attr("data-item")].name;
            craftItem += items[$(this).attr("data-item")].group;
            craftItem += items[$(this).attr("data-item")].recipe.skill;
            if (craftItem.toLowerCase().indexOf(ui.$craftFilter.val().toLowerCase()) === -1) {
                $(this).hide();
            }
        });
    };
    this.$craftFilter = $('#craftfilter')
        //Crafting filter
        .on('keyup', function () {
            ui.filterCrafts();
        });
    this.sortCrafts = function () {
        var list = ui.$craft;
        var listDiv = ui.$craft.find('div').get();
        listDiv.sort(function (a, b) {
            var keyA, keyB, groupA, groupB;
            if (player.craftSorted === 0) {
                keyA = $(a).attr("data-item");
                keyB = $(b).attr("data-item");
            } else {
                groupA = items[$(a).attr("data-item")].recipe.skill;
                if (!groupA) {
                    groupA = "z";
                }
                groupB = items[$(b).attr("data-item")].recipe.skill;
                if (!groupB) {
                    groupB = "z";
                }
                keyA = groupA;
                keyB = groupB;
            }
            return (keyA > keyB) ? 1 : -1;
        });
        $.each(listDiv, function (index, row) {
            list.append(row);
        });
        if (player.craftSorted === 0) {
            ui.message("craftsSortedName", 'normal');
            player.craftSorted++;
        } else {
            ui.message("craftsSortedSkill", 'normal');
            player.craftSorted = 0;
        }
    };

    this.sortInventory = function (container, type) {
        var list = container;
        var listDiv = list.find('li').get();
        listDiv.sort(function (a, b) {
            var keyA, keyB, groupA, groupB;
            if (player.sorted === 0) {
                keyA = $(a).attr("data-item");
                keyB = $(b).attr("data-item");
            } else if (player.sorted === 1) {
                groupA = items[$(a).attr("data-item")].group;
                if (!groupA) {
                    groupA = "z";
                }
                groupB = items[$(b).attr("data-item")].group;
                if (!groupB) {
                    groupB = "z";
                }
                keyA = groupA;
                keyB = groupB;
            } else if (player.sorted === 2) {
                keyA = items[$(a).attr("data-item")].weight;
                keyB = items[$(b).attr("data-item")].weight;
            } else {
                keyA = parseInt($(a).attr("data-itemid"), 10);
                keyB = parseInt($(b).attr("data-itemid"), 10);
            }
            if (player.sorted === 4) {
                return keyB - keyA;
            } else if (player.sorted === 3 || player.sorted === 2) {
                return keyA - keyB;
            } else {
                return (keyA > keyB) ? 1 : -1;
            }
        });
        $.each(listDiv, function (index, row) {
            list.append(row);
        });
        if (player.sorted === 0) {
            ui.message("sortName", 'normal', [Messages[type]]);
            player.sorted++;
        } else if (player.sorted === 1) {
            ui.message("sortGroup", 'normal', [Messages[type]]);
            player.sorted++;
        } else if (player.sorted === 2) {
            ui.message("sortWeight", 'normal', [Messages[type]]);
            player.sorted++;
        } else if (player.sorted === 3) {
            ui.message("sortOldest", 'normal', [Messages[type]]);
            player.sorted++;
        } else {
            ui.message("sortNewest", 'normal', [Messages[type]]);
            player.sorted = 0;
        }
    };
}

//Browser detection
//noinspection JSUnresolvedVariable
var BrowserDetect = {
    browser: '',
    version: 0,
    OS: '',

    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            } else {
                if (dataProp) {
                    return data[i].identity;
                }
            }
        }
        return false;
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) {
            return false;
        }
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Trident",
            identity: "Explorer",
            versionSearch: "rv"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        {
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS: [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]
};
BrowserDetect.init();

var hints = {
 welcometowayward: {
        name: "欢迎来到任意岛",
        description: '欢迎来到预发布的任意岛! 任意岛当前处于Beta测试阶段并且很多东西都会随着时间推移而改变. 这些提示窗口将会在游戏中弹出. 如果你需要进一步的帮助, 访问 <a target="_blank" href="/www.unlok.ca/wayward/documentation.html">官方文档</a>.<br /><br />如果你想要始终玩到最新版的任意岛, 请访问 <a target="_blank" href="/www.unlok.ca/forums/">论坛</a>, <a target="_blank" href="/www.unlok.ca/category/wayward/">博客</a> 或 <a target="_blank" href="/www.reddit.com/r/Wayward/">子板</a>.<br /><br />想要帮助任意岛? 宣传我们, 或者访问以下网址: <a target="_blank" href="https://www.facebook.com/waywardgame">Facebook</a>, <a target="_blank" href="/www.indiedb.com/games/wayward">IndieDB</a>, <a target="_blank" href="/steamcommunity.com/sharedfiles/filedetails/?id=151680542">Steam 青睐绿光</a>.'
    },
    controls: {
        name: "控制",
        description: "<strong>移动</strong><br />关于移动, 你可以使用 W,A,S,D, 方向键, VI键 (H,J,K,L), 或者左键单击/轻敲游戏屏幕上你想要移动的方向. 跳过这个回合，或捡起你现在正站在的面前的物品，按空格或左键点击你屏幕画面里的角色.<br /><br /><strong>使用道具</strong><br />使用一个物品，你可以点击它或点击弹出的菜单，把你所想使用的物品拖到快捷栏中，快捷栏有相对应的数字按钮(1.2.3等).<br /><br /><strong>物品使用，掉落和信息</strong><br />一些物品可能有更多使用方法，这些方法会出现在该物品的菜单栏中,你可以右键点击该物品让它自动掉落，不用使用菜单逐一将他们丢掉,如果你正面对一个容器,想要将物品放入里面。您可以使用转移(或alt)+右击(或从菜单中使用“丢弃”)将同一类的多个项目(注:shift +右击在Firefox无法使用,请使用alt).如果你想了解更多信息，可以用鼠标右键点击你也可以右键点击游戏屏里你想了解的东西，不管是物品，怪物还是地点等.<br /><br /><strong>更多信息</strong><br />将鼠标悬停在屏幕上，有时可以获得更多相关的有用信息.  小提示将显示在物品上。悬停在合成物品前，将显示 工艺合成所需要使用的物品 （按库存/设备/快捷顺序排序） .<br /><br /><strong>物品管理</strong><br />Besides dragging and dropping items to your quickslots, you are also able to equip items in this fashion, provided it is an equipment item and fits in that slot. Dragging and dropping is also required to move items your container window and inventory (besides right clicking to drop an item into a container on the ground). Additionally, Right clicking an item in your equipment list, quickslots or container window will move it to your inventory.<br /><br /><strong>Window Shortcuts</strong><br />Esc = Main Menu<br />I = Inventory<br />E = Equipment<br />C = Crafting<br />/ = Help<br />X = Skills<br />M = Messages<br />O = Options<br />Q = Actions"
    },
    corpsecarving: {
        name: "尸体雕刻",
        description: "To harvest potential resources from this corpse, try carving it with a sharp item. You can double click an item to use it."
    },
    environmentalpickup: {
        name: "环境道具/对象",
        description: 'To pick-up or gather from any environmental item/objects, such as plants or items attached to the ground like furnances, campfires, etc you can do one of the following:<br />1. While facing the item, click or press the "Actions" hotkey, and select the "Pick-up" option.<br />2. Use an item with "Digging" such as a shovel.<br />3. Use an item with "Carving" such as a sharp rock. Using your bare hands with no tool (option 1) can sometimes harm you. Using a tool (option 2 and 3) will decrease the durability of the item. Some objects may require a "Carving" tool such as corpses to harvest from.'
    },
    cavedarkness: {
        name: "黑暗洞穴",
        description: "This would be the perfect place for hidden treasure, but first the area requires illumination with fire or a torch."
    },
    nightfall: {
        name: "黄昏",
        description: "Nightfall approaches! Find a safe area to camp out, or prepare yourself for combat!"
    },
    staminareplenishment: {
        name: "耐力补充",
        description: "You are getting exhausted. Sleep or rest using a bedroll or hammock to regenerate stamina. You can also rest by going into the Actions menu and clicking Rest; however, resting with an item will produce better regenerative effects. Rest is different from sleep in that you will only ever rest until your stamina is maxed out. Alternatively, you may hold spacebar or click your character to skip turns."
    },
    healthreplenishment: {
        name: "健康问题",
        description: "You are quite injured, replenish your health with food or healing-type items. Some status effects reduce your ability to regenerate your health including Bleeding and Poisoning. Alternatively, you can also try sleeping or resting to regenerate health."
    },
    bleeding: {
        name: "出血",
        description: "You are bleeding! This status effect is usually the result of a poor Anatomy skill and fighting a tough creature. Make sure to use a healing item to stop the bleeding, such as a Bandage or Tourniquet. Bleeding causes you to starve and dehydrate faster, regenerate stamina slower and not regenerate any health."
    },
    poisoned: {
        name: "中毒",
        description: "You have been poisoned! Poisoning can happen from eating bad things or from some types of creatures. Make sure to use a curing item to cure the poison, such as a Charcoal Bandage or Medicinal Water. Poisoning causes you to dehydrate faster, slow stamina regeneration and not regenerate any health."
    },
    dehydration: {
        name: "脱水",
        description: "You are getting quite dehydrated. There's many ways to get drinkable water, but unfortunately for you, the largest source of water, from the sea is nearly undrinkable in it's raw form. You must desalinate the water through the use of a water still or flask before drinking it without adverse effects. Alternatively, you may seek out a fresh water source, such as from caves, small lakes, oases, swamps or ponds. Fresh water is drinkable in it's raw form without too many bad effects; however, you may still want to boil it for the best health results."
    },
    useatool: {
        name: "使用工具",
        description: "Gathering resources with your hands is difficult and harmful, try equipping or using a tool to eliminate the chance of injury. If you are Mining or Lumberjacking, your weapon(s) attack value will also help gather items faster. Blunt attack weapon will help you gather faster while Mining, while Slashing weapons will help you gather faster while lumberjacking."
    },
    durability: {
        name: "耐久度",
        description: "One of your tools, weapons or armor is close to breaking under overuse. If you can't find or craft an item to repair it, you will have to replace it."
    },
    death: {
        name: "死亡",
        description: "Death is permanent. Although you have died, all of the crafting recipes you have discovered will be ready on your next playthrough."
    },
    weightlimit: {
        name: "最小重量",
        description: "You are overburdened. While carrying more than your maximum weight, you will walk very slowly, and lose stamina quickly. You can drop items from your inventory by right clicking. You can use shift (or alt) + right click to drop multiple items of the same type."
    },
    eatingbadthings: {
        name: "食用腐败的东西",
        description: "Ow! Eating that has hurt you! Not all edible objects should be eaten, at least not without facing the consequences. On the other hand, sometimes it's worth the risk to gain other stats. Eating bad things can sometimes result in poisoning."
    },
    fastpickup: {
        name: "快速提取",
        description: "You have just picked up an item from the ground. Sometimes there are multiple items on a tile. Pressing the spacebar or clicking on your character will gather items underneath you without moving."
    },
    bugs: {
        name: "漏洞!",
        description: 'Did you find an error? Would you kindly let us know about what happened, so that we may seek to stop this from happening to other players? You can do so by editing the <a target="_blank" href="/www.unlok.ca/wiki/wayward/bug-list/">Bug List</a>.'
    },
    helditems: {
        name: "持有道具",
        description: "Your left and right hand equipment slots are interchangeable. You can equip two weapons, two tools, two shields or any combination in between. Be careful of damaging useful equipment such as torches or shields while gathering or attacking. Make sure to always equip another weapon or tool in the other hand if you want to use it to attack or gather over damaging an equipped torch. You attack with both hands in combat, so it's important to equip both your hands if possible."
    },
    milestones: {
        name: "里程碑",
        description: "Milestones are personalized goals and achievements. Each playthrough, you are given an amount to either discover or work towards. Milestones are saved after each playthrough or death. The more you have completed, the more starting skill points you get and the more chance to get better starting items."
    },
    burning: {
        name: "燃烧",
        description: "You have been burned! This lasting burning pain can be caused from stepping in an open flame without protection, or possibly other sources. Using a curing item such as a Charcoal Bandage or Medicinal Water will help soothe the pain. Alternatively, take a swim for a bit to remove the pain. Burning pain will stop you from regenerating health and can last quite awhile if untreated."
    },
    crafting: {
        name: "制作",
        description: "Crafting is simple, but has many rules!<br /><br />When hovering over an item in the crafting dialog, you will see which items will be used in the craft through a highlighted border that will appear around items in your inventory, quickslot or equipment windows (priority is set in that order). You will also notice that you will use the first instance of a required item. Simply drag around the order of items in your inventory to use different items in the craft.<br /><br />Using items in a craft that that have lower durability will effect the crafted item's durability. Items that have zero durability cannot be used in a craft. Additionally, using Remarkable, Exceptional or Legendary items in a craft increases your chances to craft such an item. Decayable items (such as food) also gain decay bonuses from using higher quality items in the craft.<br /><br />You can find new crafting recipes by: gathering the required items in your inventory, by crafting and discovering new recipes, and by finding Old Instructional Scrolls."
    }
};