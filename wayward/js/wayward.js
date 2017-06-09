/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

game = {
    autoSaveTimer: 0,
    containerOpened: {
        containerType: "",
        id: 0
    },
    delay: 0,
    fadeFromBlack: 0,
    now: 0,
    then: Date.now(),
    interval: 16, //(1000/60 fps) set higher to debug
    delta: 0,
    finishScroll: false,
    graphicSize: 96,
    gridSize: 64,
    halfGridSize: 32,
    halfMapSize: 256,
    healthRegen: 80,
    healthTimer: 0,
    hintIndex: 0,
    hungerRegen: 130,
    hungerTimer: 0,
    leftMouseButtonPressed: false,
    light: [],
    loadingCycles: 0,
    loadingData: {},
    mapSize: 512,
    messageTimer: 125,
    monsters: [],
    monsterSpawnerPool: {},
    monsterSpawnTimer: 0,
    moveAnim: 0,
    saveClear: false,
    scroll: {
        x: 0,
        y: 0
    },
    sounds: [],
    soundTimer: 8,
    start: false,
    startX: 0,
    startY: 0,
    staminaTimer: 0,
    staminaRegen: 5,
    texts: [],
    thirstRegen: 100,
    thirstTimer: 0,
    updateItems: true,
    updateLight: false,
    updateMovement: false,
    updateTiles: false,
    updateAnimation: false,
    updateMiniMap: true,
    version: 3.6,
    walkSoundCounter: 0,
    windowHalfHeight: 0,
    windowHalfWidth: 0,
    windowHeight: 0,
    windowMiddleX: 0,
    windowMiddleY: 0,
    windowWidth: 0,
    dailyChallenge: false,
    release: game.release,
    raft: false,
    /**
     * This will generate the monster spawning pool based on npcs.X.spawnTalent dynamically
     * Will output like game.monsterSpawnerPool.14000 = ["kraken", "zombie",... ];
     */
    generateMonsterSpawnPool: function () {
        var mobList = Object.keys(npcs);
        for (var i = 0, len = mobList.length; i < len; i++) {
            var talentBracket = npcs[mobList[i]].spawnTalent;
            if (talentBracket || talentBracket === 0) {
                //Has the talent bracket been defined?
                if (!game.monsterSpawnerPool[talentBracket]) {
                    game.monsterSpawnerPool[talentBracket] = [];
                }
                //Add the monster to that bracket
                game.monsterSpawnerPool[talentBracket].push(mobList[i]);
            }
        }
    },
    fillCount: 0,
    fillTile: [],
    /**
     * Check the amount of water tiles there is connected to a supplied x/y area
     * @param x num
     * @param y num
     * @param needed num
     * @returns bool
     */
    checkWaterFill: function (x, y, needed) {
        if (game.fillCount >= needed) {
            return true;
        }

        if (tile[x] && tile[x][y] && tiletypes[tile[x][y].type].shallowWater || tiletypes[tile[x][y].type].water) {
            if (game.fillTile[x] && game.fillTile[x][y]) {
                return false;
            }
            game.fillCount++;
            game.fillTile[x] = game.fillTile[x] || {};
            game.fillTile[x][y] = true;
        } else {
            return false;
        }

        game.checkWaterFill(x - 1, y, needed);
        game.checkWaterFill(x, y - 1, needed);
        game.checkWaterFill(x + 1, y, needed);
        game.checkWaterFill(x, y + 1, needed);
    },
    checkForHiddenMob: function (locationX, locationY) {
        if (tile[locationX][locationY].monster) {
            if (game.monsters[tile[locationX][locationY].monster].ai === 'hidden') {
                game.monsters[tile[locationX][locationY].monster].ai = 'hostile';
                ui.message("showHiddenMob", 'normal', [npcs[game.monsters[tile[locationX][locationY].monster].type].name]);
                passTurn(false);
            }
        }
    },
    /**
     * Does the standard checks when attempting to carve/dig or pick-up action
     */
    isValidPickUp: function (envItemId) {
        if (envItems[envItemId].container) {
            isContainerTrulyEmpty(envItemId);
        }
        if ((envItems[envItemId].container && envItems[envItemId].container.length > 0) || environmentals[envItems[envItemId].type].locked) {
            ui.message("cannotPickupWithItems", 'normal', false);
            return false;
        } else if (environmentals[envItems[envItemId].type].blockdig) {
            ui.message("cannotPickupWhenLit", 'normal', false);
            return false;
        } else if (envItems[envItemId].decay === -2 || envItems[envItemId].decay > 0 && environmentals[envItems[envItemId].type].waterSource) {
            ui.message("cannotPickupWhenFull", 'normal', false);
            return false;
        }
        return true;
    }
};

var audio = new WAudio();
var ui = new Ui();
var player = new Player();

var seeds = {
    base: false,
    saved: false
};

/**
 *
 * @param {Array.<{gfx: int, type: string, envItemList:Array.string, monster: int, tileitems: <Object>}>} tile
 *
 */
var tile = [];
var tileData = [];
var particles = [];
var pickups = [];
var envItems = [];
var tileItems = [];

//Canvas set-up
var titleCanvas = document.getElementById('title').getContext('2d');
var overlayCanvas = document.getElementById('overlay').getContext('2d');
var lightCanvas = document.getElementById('light').getContext('2d');
var gameCanvas = document.getElementById('game').getContext('2d');
var mapCanvas = document.getElementById('map').getContext('2d');
var miniMapCanvas = document.getElementById('miniMapCanvas').getContext('2d');

lightCanvas.mozImageSmoothingEnabled = false;
lightCanvas.webkitImageSmoothingEnabled = false;
lightCanvas.msImageSmoothingEnabled = false;
lightCanvas.imageSmoothingEnabled = false;
gameCanvas.mozImageSmoothingEnabled = false;
gameCanvas.webkitImageSmoothingEnabled = false;
gameCanvas.msImageSmoothingEnabled = false;
gameCanvas.imageSmoothingEnabled = false;
overlayCanvas.mozImageSmoothingEnabled = false;
overlayCanvas.webkitImageSmoothingEnabled = false;
overlayCanvas.msImageSmoothingEnabled = false;
overlayCanvas.imageSmoothingEnabled = false;
mapCanvas.mozImageSmoothingEnabled = false;
mapCanvas.webkitImageSmoothingEnabled = false;
mapCanvas.msImageSmoothingEnabled = false;
mapCanvas.imageSmoothingEnabled = false;
miniMapCanvas.mozImageSmoothingEnabled = false;
miniMapCanvas.webkitImageSmoothingEnabled = false;
miniMapCanvas.msImageSmoothingEnabled = false;
miniMapCanvas.imageSmoothingEnabled = false;

//Keyboard movement
ui.$document.bind("keyup", function (e) {
    //Don't trap keyups while in craft filter input
    //this is needed because window only refreshes on
    //keyup events
    if (ui.$craftFilter.is(":focus")) {
        if (e.keyCode == 27) { //if ESC, clear and unfocus
            ui.$craftFilter.val('');
            ui.$craftFilter.keyup();
            ui.$craftFilter.blur();
        } else if (e.keyCode == 13) { // if ENTER, just unfocus
            ui.$craftFilter.blur();
        }
        return true;
    } else if (ui.$invFilter.is(":focus")) {
        if (e.keyCode == 27) { //if ESC, clear and unfocus
            ui.$invFilter.val('');
            ui.$invFilter.keyup();
            ui.$invFilter.blur();
        } else if (e.keyCode == 13) { // if ENTER, just unfocus
            ui.$invFilter.blur();
        }
        return true;
    } else if (ui.$code.is(":focus")) {
        return true;
    }

    if (ui.keyState[68] || ui.keyState[39] ||
        ui.keyState[65] || ui.keyState[37] ||
        ui.keyState[87] || ui.keyState[38] ||
        ui.keyState[83] || ui.keyState[40] ||
        ui.keyState[32] || ui.keyState[49] ||
        ui.keyState[50] || ui.keyState[51] ||
        ui.keyState[52] || ui.keyState[53] ||
        ui.keyState[54] || ui.keyState[55] ||
        ui.keyState[56] || ui.keyState[57] ||
        ui.keyState[48] || ui.keyState[72] ||
        ui.keyState[74] || ui.keyState[75] ||
        ui.keyState[76] || ui.keyState[190] ||
        ui.keyState[27] || ui.keyState[73] ||
        ui.keyState[191] || ui.keyState[88] ||
        ui.keyState[77] || ui.keyState[79] ||
        ui.keyState[18] || ui.keyState[16] ||
        ui.keyState[69] || ui.keyState[67] ||
        ui.keyState[81]) {
        //Spacebar
        if (ui.keyState[32]) {
            if (!game.start) {
                ui.$mainMenu.dialog('open');
            }
        }
        if (ui.keyState[27]) { //esc
            ui.$itemMenu.hide();
            toggleDialog(ui.$mainMenu); //main menu
        }
        //Bounce all other keypresses when dead
        if (player.died) {
            ui.keyState[e.keyCode] = 0;
            return false;
        }
        if (ui.keyState[73]) { //i
            toggleDialog(ui.$inventoryWindow); //inventory
            //Disable filter autofocus
            ui.$invFilter.trigger('blur');
        }
        if (ui.keyState[69]) { //e
            toggleDialog(ui.$equipmentWindow); //equipment
        }
        if (ui.keyState[67]) { //c
            toggleDialog(ui.$craftWindow); //crafts
            //Disable filter autofocus
            ui.$craftFilter.trigger('blur');
        }
        if (ui.keyState[191]) { ///
            if (ui.$hintWindow.dialog("isOpen") !== true) {
                ui.$itemMenu.hide();
                ui.hintDisplay("welcometowayward");  //help
            } else {
                ui.$hintWindow.dialog("close");
            }
        }
        if (ui.keyState[88]) { //x
            toggleDialog(ui.$skillsWindow); //skills
            player.skillGain(false, false, false);
        }
        if (ui.keyState[77]) { //m
            toggleDialog(ui.$messagesWindow); //messages
        }
        if (ui.keyState[79]) { //o
            toggleDialog(ui.$optionsWindow); //options
        }
        if (ui.keyState[81]) { //q
            toggleActionsMenu(); //actions
        }
        e.preventDefault();
    }

    ui.keyState[e.keyCode] = 0;
    return true;
});

ui.$document.bind("keydown", function (e) {
    //Don't trap key presses while in craft filter input
    if (ui.$craftFilter.is(":focus")) {
        return true;
    } else if (ui.$invFilter.is(":focus")) {
        return true;
    } else if (ui.$code.is(":focus")) {
        return true;
    }
    //Don't don't allow key presses if hint modal is opened
    if (ui.$hintWindow.dialog("isOpen") === true) {
        return true;
    }

    // only register a keydown if meta is not pressed
    // this is a workaround for a bug when pressing CMD
    // key combos in OS X under Chrome
    if (e.metaKey) {
        ui.keyState[e.keyCode] = 0;
    } else {
        ui.keyState[e.keyCode] = 1;
    }

    //Disable shift modifier on Firefox
    if (BrowserDetect.browser === "Firefox" && ui.keyState[16]) {
        ui.keyState[16] = 0;
    }

    //Don't capture keys on game menu, unless it's ESC
    if (ui.$mainMenu.dialog("isOpen") === true && !ui.keyState[27]) {
        ui.keyState[e.keyCode] = 0;
    }

    if (ui.keyState[68] || ui.keyState[39] ||
        ui.keyState[65] || ui.keyState[37] ||
        ui.keyState[87] || ui.keyState[38] ||
        ui.keyState[83] || ui.keyState[40] ||
        ui.keyState[32] || ui.keyState[49] ||
        ui.keyState[50] || ui.keyState[51] ||
        ui.keyState[52] || ui.keyState[53] ||
        ui.keyState[54] || ui.keyState[55] ||
        ui.keyState[56] || ui.keyState[57] ||
        ui.keyState[48] || ui.keyState[72] ||
        ui.keyState[74] || ui.keyState[75] ||
        ui.keyState[76] || ui.keyState[190] ||
        ui.keyState[27] || ui.keyState[73] ||
        ui.keyState[191] || ui.keyState[88] ||
        ui.keyState[77] || ui.keyState[79] ||
        ui.keyState[18] || ui.keyState[16] ||
        ui.keyState[69] || ui.keyState[67] ||
        ui.keyState[81]) {
        e.preventDefault();
    }
    return true;
});

//Function for toggling dialogs open/closed
function toggleDialog(dialogMenu) {
    if (dialogMenu.dialog('isOpen')) {
        dialogMenu.dialog('close');
    } else {
        dialogMenu.dialog('open');
    }
}

///HUD buttons/menus
$("#optionsopen, #options-extra").click(function () {
    if (ui.$optionsWindow.dialog("isOpen") !== true) {
        ui.$optionsWindow.dialog("open");
        ui.$mainMenu.dialog("close");
    } else {
        ui.$optionsWindow.dialog("close");
    }
});

$("#menuopen").click(function () {
    ui.$itemMenu.hide();
    toggleDialog(ui.$mainMenu);
});

$("#skillsopen").click(function () {
    if (ui.$skillsWindow.dialog("isOpen") !== true) {
        ui.$skillsWindow.dialog("open");
        player.skillGain(false, false, false);
    } else {
        ui.$skillsWindow.dialog("close");
    }
});

$("#milestonesopen").click(function () {
    if (ui.$milestonesWindow.dialog("isOpen") !== true) {
        ui.$milestonesWindow.dialog("open");
        addMilestone();
    } else {
        ui.$milestonesWindow.dialog("close");
    }
});

$("#helpopen, #help-extra").click(function () {
    ui.$itemMenu.hide();
    ui.$mainMenu.dialog("close");
    ui.hintDisplay("welcometowayward");
});

$("#inventoryopen").click(function () {
    if (ui.$inventoryWindow.dialog("isOpen") !== true) {
        ui.$inventoryWindow.dialog("open");
        //Disable filter autofocus
        ui.$invFilter.trigger('blur');
    } else {
        ui.$inventoryWindow.dialog("close");
    }
});

$("#equipmentopen").click(function () {
    if (ui.$equipmentWindow.dialog("isOpen") !== true) {
        ui.$equipmentWindow.dialog("open");
    } else {
        ui.$equipmentWindow.dialog("close");
    }
});

$("#craftopen").click(function () {
    if (ui.$craftWindow.dialog("isOpen") !== true) {
        ui.$craftWindow.dialog("open");
        //Disable filter autofocus
        ui.$craftFilter.trigger('blur');
    } else {
        ui.$craftWindow.dialog("close");
    }
});

$("#messagesopen").click(function () {
    if (ui.$messagesWindow.dialog("isOpen") !== true) {
        ui.$messageOverlay.empty();
        ui.$messagesWindow.dialog("open");
        ui.$messagesWindow.scrollTop(ui.$messagesWindow[0].scrollHeight);
    } else {
        ui.$messagesWindow.dialog("close");
    }
});

$("#actionsopen").click(function () {
    toggleActionsMenu();
});

/**
 * Toggles the action menu and populates it with all the proper interactions
 */
function toggleActionsMenu() {
    ui.$itemMenu.hide();
    if (ui.$actionsMenu.css('display') === 'none') {
        var xOffset = 0;
        var yOffset = 0;
        if (player.direction.x === 1) {
            xOffset = game.gridSize;
        } else if (player.direction.x === -1) {
            xOffset = -game.gridSize;
        }
        if (player.direction.y === 1) {
            yOffset = game.gridSize;
        } else if (player.direction.y === -1) {
            yOffset = -game.gridSize;
        }
        var buttons = '<button class="inspect">' + Messages.inspect + '</button>';
        //Drinking
        if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].water || tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].shallowWater || tile[player.x + player.direction.x][player.y + player.direction.y].type === "snow") {
            buttons += '<button class="drink">' + Messages.drink + '</button>';
        }
        //Pick-up
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            buttons += '<button class="pickup">' + Messages.pickUp + '</button>';
        }
        //Gather
        if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].gather) {
            buttons += '<button class="gather">' + Messages.gather + '</button>';
        }
        //Rest
        if (tiletypes[tile[player.x][player.y].type].passable) {
            buttons += '<button class="rest">' + Messages.rest + '</button>';
        }
        //Get Door
        if (tile[player.x + player.direction.x][player.y + player.direction.y].type === "woodendoor") {
            buttons += '<button class="pickup-door">' + Messages.pickUp + '</button>';
        }
        ui.$actionsMenu
            .show()
            .html(buttons)
            .css({left: game.windowMiddleX + xOffset, top: game.windowMiddleY + yOffset});
    } else {
        ui.$actionsMenu.hide();
    }
}

//Function used for generating the varying text for each button entry in options dialog
function updateOptionButtonText() {
    if (ui.options.volume) {
        $('#volumeopt').text(Messages.volume100);
    } else {
        $('#volumeopt').text(Messages.volume50);
    }
    if (ui.options.sound) {
        $('#soundopt').text(Messages.soundOn);
    } else {
        $('#soundopt').text(Messages.soundOff);
    }
    if (ui.options.music) {
        $('#musicopt').text(Messages.musicOn);
    } else {
        $('#musicopt').text(Messages.musicOff);
    }
    if (ui.options.autoGather) {
        $('#autogather').text(Messages.autoGatherOn);
    } else {
        $('#autogather').text(Messages.autoGatherOff);
    }
    if (ui.options.autoPickup) {
        $('#autopickup').text(Messages.autoPickupOn);
    } else {
        $('#autopickup').text(Messages.autoPickupOff);
    }
    if (ui.options.hints) {
        $('#hintsopt').text(Messages.disableHints);
    } else {
        $('#hintsopt').text(Messages.enableHints);
    }
    if (ui.options.fontStyle) {
        $('#fontstyle').text(Messages.pixelFont);
    } else {
        $('#fontstyle').text(Messages.alternateFont);
    }
    if (ui.options.gameSize) {
        $('#gamesize').text(Messages.fullGameSize);
    } else {
        $('#gamesize').text(Messages.smallGameSize);
    }
    if (ui.options.windowMode) {
        $('#windowmode').text(Messages.windowedMode);
    } else {
        $('#windowmode').text(Messages.fullscreen);
    }
    if (ui.options.animations) {
        $('#animations').text(Messages.animationsOn);
    } else {
        $('#animations').text(Messages.animationsOff);
    }
    if (ui.options.smoothMovement) {
        $('#smoothmovement').text(Messages.smoothMovementOn);
    } else {
        $('#smoothmovement').text(Messages.smoothMovementOff);
    }
    if (ui.options.dropOnGather) {
        $('#dropongather').text(Messages.dropOnGatherOn);
    } else {
        $('#dropongather').text(Messages.dropOnGatherOff);
    }
}

$('#daily-challenge-mode').click(function () {
    game.dailyChallenge = true;
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
    ui.$mainMenu.dialog('close');
});

$('#saveAndContinue').click(function () {
    if (player.died) {
        return;
    }
    saveGame(true);
    ui.message("savedManually", 'normal', false);
    ui.$mainMenu.dialog('close');
});

$('#saveAndExit').click(function () {
    saveGame(true);
    ui.message("saved", 'normal', false);
    window.close();
    self.close();
    window.open('', '_self', '');
    window.close();
});

$('#endGame').click(function () {
    if (confirm(Messages.suicide)) {
        ui.message("restarted", 'normal', false);
        death();
        ui.$mainMenu.dialog('close');
    }
});

$('#returnToGame').click(function () {
    ui.$mainMenu.dialog('close');
});

$('#reset').click(function () {
    if (confirm(Messages.deleteSave)) {
        if (localStorage) {
            localStorage.clear();
            game.saveClear = true;
            location.reload();
        }
        ui.message("deleteSavedData", 'normal', false);
    }
});

//Options menu
$('#volumeopt').click(function () {
    setOption("volume");
});

$('#soundopt').click(function () {
    setOption("sound");
});

$('#nextsong').click(function () {
    if (ui.options.music && ui.options.sound) {
        audio.changeTrack();
        ui.message("nextSongPlaying", 'normal', false);
    } else {
        ui.message("soundDisabled", "bad", false);
    }
});

$('#musicopt').click(function () {
    setOption("music");
});

$('#fontstyle').click(function () {
    if (ui.options.fontStyle) {
        ui.options.fontStyle = false;
        ui.$body.addClass("fontstyle");
    } else {
        ui.options.fontStyle = true;
        ui.$body.removeClass("fontstyle");
    }
    updateOptionButtonText();
});

$('#gamesize').click(function () {
    if (ui.options.gameSize) {
        ui.options.gameSize = false;
        ui.$canvases.addClass("smallwindow");
        resizeWindow();
    } else {
        ui.options.gameSize = true;
        ui.$canvases.removeClass("smallwindow");
        resizeWindow();
    }
    updateOptionButtonText();
});

$('#windowmode').click(function () {
    if (ui.options.windowMode) {
        ui.options.windowMode = false;
        ui.launchFullScreen();
        resizeWindow();
    } else {
        ui.options.windowMode = true;
        ui.cancelFullscreen();
        resizeWindow();
    }
    updateOptionButtonText();
});

$('#animations').click(function () {
    if (ui.options.animations) {
        ui.options.animations = false;
        overlayCanvas.clearRect(0, 0, overlayCanvas.canvas.width, overlayCanvas.canvas.height);
    } else {
        ui.options.animations = true;
    }
    updateOptionButtonText();
});

$('#smoothmovement').click(function () {
    ui.options.smoothMovement = !ui.options.smoothMovement;
    updateOptionButtonText();
});

$('#autogather').click(function () {
    if (ui.options.autoGather) {
        ui.options.autoGather = false;
        ui.message("gatheringDisabled", 'normal', false);
    } else {
        ui.options.autoGather = true;
        ui.message("gatheringEnabled", 'normal', false);
    }
    updateOptionButtonText();
});

$('#dropongather').click(function () {
    if (ui.options.dropOnGather) {
        ui.options.dropOnGather = false;
        ui.message("dropOnGatherOff", 'normal', false);
    } else {
        ui.options.dropOnGather = true;
        ui.message("dropOnGatherOn", 'normal', false);
    }
    updateOptionButtonText();
});

$('#autopickup').click(function () {
    if (ui.options.autoPickup) {
        ui.options.autoPickup = false;
        ui.message("pickupDisabled", 'normal', false);
    } else {
        ui.options.autoPickup = true;
        ui.message("pickupEnabled", 'normal', false);
    }
    updateOptionButtonText();
});

$('#zoomin').click(function () {
    if (ui.options.zoomLevel < 2) {
        ui.options.zoomLevel = Utilities.roundNumber(ui.options.zoomLevel + 0.1, 2);
        setZoomLevel();
    }
});

$('#zoomout').click(function () {
    if (ui.options.zoomLevel > 0.1) {
        ui.options.zoomLevel = Utilities.roundNumber(ui.options.zoomLevel - 0.1, 2);
        setZoomLevel();
    }
});

$('#hintsopt').click(function () {
    if (ui.options.hints) {
        ui.options.hints = false;
        ui.message("hintsDisabled", 'normal', false);
    } else {
        ui.options.hints = true;
        ui.message("hintsEnabled", 'normal', false);
    }
    updateOptionButtonText();
});

$('#loadmod').change(function (e) {
    if (window.FileReader) {
        var reader = new FileReader();
        var file = e.target.files[0];
        reader.onerror = function (evt) {
            switch (evt.target.error.code) {
                case evt.target.error.NOT_FOUND_ERR:
                    ui.message("fileNotFound", 'bad', false);
                    break;
                case evt.target.error.NOT_READABLE_ERR:
                    ui.message("fileNotReadable", 'bad', false);
                    break;
                case evt.target.error.ABORT_ERR:
                    break;
                default:
                    ui.message("fileError", 'bad', false);
            }
        };
        reader.onload = function (evt) {
            addMilestone("modder");
            ui.message("modLoaded", 'normal', false);
            jQuery.globalEval(evt.target.result);
        };
        reader.readAsText(file);
        $(this).val("");
    } else {
        ui.message("notSupported", 'bad', false);
    }
});

function setDirectionWithMouse(e, directionCheck) {
    var mouseX, mouseY;
    var tileX, tileY;

    if (e.originalEvent.touches) {
        //Mobile/tablet
        mouseX = e.originalEvent.touches[0].clientX;
        mouseY = e.originalEvent.touches[0].clientY;
    } else if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    } else if (e.pageX) {
        //Really Firefox? really?
        mouseX = e.pageX - ui.$light.offset().left;
        mouseY = e.pageY - ui.$light.offset().top;
    }

    //Get tile translation of where you clicked
    tileX = player.x - game.windowHalfWidth + Math.floor(mouseX / game.gridSize);
    tileY = player.y - game.windowHalfHeight + Math.floor(mouseY / game.gridSize);

    var direction = 5;
    if (directionCheck) {
        var difX = tileX - player.x;
        var difY = tileY - player.y;
        var directionSet = false;
        var tally = difX + difY;

        if (tally !== 0) {
            if (difX < difY) {
                /* go left or down*/
                if (difX === 0) {
                    direction = 2; //down
                    directionSet = true;
                }
                if (difY === 0) {
                    direction = 3; //left
                    directionSet = true;
                }
                if ((difX < 0) && (difY < 0)) {
                    direction = 3; //left
                    directionSet = true;
                }
                if ((difX > 0) && (difY > 0)) {
                    direction = 2; //down
                    directionSet = true;
                }
                if (!directionSet) {
                    if (tally < 0) {
                        direction = 3; //left
                    } else {
                        direction = 2; //down
                    }
                }
            }
            if (difX > difY) {
                /* go right or up*/
                if (difX === 0) {
                    direction = 1; //up
                    directionSet = true;
                }
                if (difY === 0) {
                    direction = 4; //right
                    directionSet = true;
                }
                if ((difX < 0) && (difY < 0)) {
                    direction = 1; //up
                    directionSet = true;
                }
                if ((difX > 0) && (difY > 0)) {
                    direction = 4; //right
                    directionSet = true;
                }
                if (!directionSet) {
                    if (tally < 0) {
                        direction = 1; //up
                    } else {
                        direction = 4; //right
                    }
                }
            }
        }

        //If you are clicking on an intersection of the diagonal separation, choose the direction you are facing
        if (direction === 5) {

            var state = false;

            if (difX === difY) {
                state = true;
                if (difX < 0) {
                    if (player.direction.x === -1) {
                        direction = 3; //left
                    } else if (player.direction.y === -1) {
                        direction = 1; //up
                    }
                } else {
                    if (player.direction.x === 1) {
                        direction = 4; //right
                    } else if (player.direction.y === 1) {
                        direction = 2; //down
                    }
                }
            }
            if (!state) {
                if (difX < 0) {
                    if (player.direction.x === -1) {
                        direction = 3; //left
                    } else if (player.direction.y === 1) {
                        direction = 2; //down
                    }
                } else {
                    if (player.direction.x === 1) {
                        direction = 4; //right
                    } else if (player.direction.y === -1) {
                        direction = 1; //up
                    }
                }
            }
        }

        if (tileX === player.x && tileY === player.y) {
            direction = 5;
        }

    }

    return {
        direction: direction,
        tileX: tileX,
        tileY: tileY
    };
}

//Mouse (and tap) movement
ui.$light.on("touchstart mousedown", function (e) {

    //Close tooltips
    ui.$tooltip.hide();
    ui.$itemMenu.hide();

    //Disable filter focus on mouse clicks
    ui.$craftFilter.trigger('blur');
    ui.$invFilter.trigger('blur');
    ui.$code.trigger('blur');
    var mouseResponse;

    if (e.which === 1 || !e.which) {

        if (!game.start) {
            ui.$mainMenu.dialog('open');
        }
        game.leftMouseButtonPressed = true;
        mouseResponse = setDirectionWithMouse(e, true);
        ui.mouseState = mouseResponse.direction;

    } else {
        game.leftMouseButtonPressed = false;
        if (game.start) {
            //Right click looking/inspecting
            mouseResponse = setDirectionWithMouse(e, false);
            //Check LOS
            if (!checkLOS(player.x, player.y, mouseResponse.tileX, mouseResponse.tileY)) {
                ui.message("cannotSee", 'normal', false);
                return;
            }
            player.actions.inspect(mouseResponse.tileX, mouseResponse.tileY);
        }
    }
    e.preventDefault();
}).on('touchend mouseup mouseleave', function () {
    game.leftMouseButtonPressed = false;
    ui.mouseState = 0;
}).on('mousemove', function (e) {
    var mouseResponse;

    if (e.which === 1 && !game.leftMouseButtonPressed) {
        e.which = 0;
    }

    if (e.which === 1) {
        mouseResponse = setDirectionWithMouse(e, true);
        ui.mouseState = mouseResponse.direction;
    }

    e.preventDefault();
});


//Function for un-equipping an item automatically
function unEquipItem($item) {
    var invId = parseInt($item.attr("data-itemid"), 10);
    var invClass = $item.attr("data-item");
    player.invItems[invId].equipped = false;
    ui.$inventory.append($item);
    ui.message("youUnequip", 'normal', [items[invClass].name]);
    audio.queueSfx('pickup');
    player.calculateEquipmentStats();
    if (items[invClass].onequip) {
        lighting();
    }
}

//Use item with context select via data-use
function useItem(thisItem, hotKey, use) {
    if (ui.keyTimer >= game.delay) {
        var invClass = thisItem.attr("data-item");
        var invId = parseInt(thisItem.attr("data-itemid"), 10);

        //Equipment requirement for shooting
        if (use === 'shoot' && !player.invItems[invId].equipped || use === 'sling' && !player.invItems[invId].equipped || use === 'fire' && !player.invItems[invId].equipped) {
            ui.message('equipToShoot', 'bad', false);
            return false;
        }

        if (use === 'openContainer') {
            player.actions.openContainer(invId, 'INV', false);
        } else {
            player.actions[use](invId, invClass);
        }

        //Restock quickslot
        if (hotKey) {
            reQuickSlot(invId, invClass, hotKey - 1);
        }

        game.delay = 20;
        ui.keyTimer = 0;
    }
    return true;
}

//Move to inventory from opened container
function moveToInventoryFromContainer(invId, moveAllItems) {

    var containerId = game.containerOpened.id;
    var cont = envItems[containerId].container;
    var containerType = 'ENV';
    if (game.containerOpened.containerType === "INV") {
        cont = player.invItems[containerId].container;
        containerType = 'INV';
    }
    var item = cont[invId];
    audio.queueSfx("pickup");

    //Shift or alt multiple get
    if (ui.keyState[18] || ui.keyState[16] || moveAllItems) {
        var containerLength = cont.length;
        for (var contItem = 0; contItem < containerLength; contItem++) {
            //Drop all of the same type
            if (cont[contItem] !== undefined && cont[contItem] !== null) {
                if (cont[contItem] && cont[contItem].type === item.type) {
                    itemGet(cont[contItem], 'silent');
                    removeItem(contItem, containerType, containerId);
                }
            }
        }
    } else {
        itemGet(item, 'silent');
        removeItem(invId, containerType, containerId);
    }
    passTurn(true);
}

/**
 * Used to drop items on the ground or into a container
 * @param itemId
 * @param location
 * @param dropAll
 */
function dropItem(itemId, location, dropAll) {
    var itemType = player.invItems[itemId].type;
    var containerId = undefined;
    var fireDrop = false;

    switch (location) {
        case 'INV':
            if (game.containerOpened.containerType === 'INV') {
                containerId = game.containerOpened.id;
                if (items[itemType].container) {
                    ui.message("containerContainer", 'normal', false);
                    return;
                }
            } else {
                return;
            }
            break;
        default:
            //Make sure to stop rafting if dropped
            if (itemId === game.raft) {
                game.raft = false;
                ui.message("raftStop", "normal", false);
            }
            if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].water) { //Destroy stuff in deep water!
                ui.message('waterDrop', 'normal', [items[itemType].name]);
                if (items[itemType].use) {
                    if (items[itemType].use.indexOf('eat') > -1) {
                        var spawnChance = Math.floor(Math.random() * 99 + 1);
                        if (spawnChance <= 7) {
                            if (spawnMonster("water", player.x + player.direction.x, player.y + player.direction.y)) {
                                ui.message('waterStir', 'normal', false);
                            }
                        }
                    }
                }
                audio.queueSfx('water');
                removeItem(itemId, 'INV', false);
                passTurn(true);
                return;
            }
            if (tile[player.x + player.direction.x][player.y + player.direction.y].tileitems) { //Stacks of 12 items become a wall for monsters
                if (Object.keys(tile[player.x + player.direction.x][player.y + player.direction.y].tileitems).length >= 12) {
                    ui.message('noRoom', 'normal', false);
                    return;
                }
            }
            if (tile[player.x + player.direction.x][player.y + player.direction.y].monster) { //Don't drop it on a monster!
                game.checkForHiddenMob(player.x + player.direction.x, player.y + player.direction.y);
                ui.message("inTheWay", 'normal', false);
                return;
            }
            if (!tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].passable) { //Don't stack on impassable tiles
                ui.message('cannotDrop', 'normal', [items[itemType].name]);
                return;
            }
            //Drop/Drop All in Container via item menu, since we don't have to be looking at it
            if (location === "ENV" && game.containerOpened.containerType === "ENV") {
                containerId = game.containerOpened.id;
            } else {
                //Normally dropping, check for chests/containers
                if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
                    var dropSpotListLength = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length;
                    for (var envItem = 0; envItem < dropSpotListLength; envItem++) {
                        var envItemId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[envItem];
                        //Containers
                        if (environmentals[envItems[envItemId].type].container) {
                            location = 'ENV';
                            containerId = envItemId;
                        } else if (envItems[envItemId].type === "fire") {
                            //Drop items into fire for fuel to burning
                            if (tiletypes[tile[player.x + player.direction.x][player.y + player.direction.y].type].passable) {
                                fireDrop = true;
                            }
                        } else if (!environmentals[envItems[envItemId].type].trample) {
                            ui.message('cannotDrop', 'normal', [items[itemType].name]);
                            return;
                        }
                    }
                }
            }
            break;
    }
    if (ui.keyState[18] || ui.keyState[16] || dropAll) {
        var dropAllMessage = 'dropAllGround';
        if (location === 'ENV' || location === 'INV') {
            dropAllMessage = 'dropAllContainer';
        }
        if (fireDrop) {
            dropAllMessage = 'fireDropAll';
        }
        ui.message(dropAllMessage, 'normal', [items[itemType].name]);

        var multiDropInvListLength = player.invItems.length;
        for (var playerItem = 0; playerItem < multiDropInvListLength; playerItem++) {
            if (player.invItems[playerItem] !== undefined && player.invItems[playerItem] !== null) {
                //Drop all of the same type
                if (player.invItems[playerItem].type === itemType) {
                    //Stacks of 12 items become a wall for monsters
                    if (tile[player.x + player.direction.x][player.y + player.direction.y].tileitems) {
                        if (Object.keys(tile[player.x + player.direction.x][player.y + player.direction.y].tileitems).length >= 12) {
                            ui.message('noRoom', 'normal', false);
                            break;
                        }
                    }
                    finishItemDrop(playerItem, location, containerId);
                }
            }
        }
    } else {
        var dropMessage = 'dropItem';
        if (location === 'ENV' || location === 'INV') {
            dropMessage = 'dropContainer';
        }
        if (fireDrop) {
            dropMessage = 'fireDrop';
        }
        // just drop the item.
        ui.message(dropMessage, 'normal', [items[itemType].name]);
        finishItemDrop(itemId, location, containerId);
    }
    if (containerId || containerId === 0) {
        player.actions.openContainer(containerId, location, true);
    }
    audio.queueSfx('pickup');
    if (items[itemType].container && game.containerOpened.containerType === 'INV') {
        closeContainer();
    }
    passTurn(true);

    function finishItemDrop(itemId, location, locationId) {
        var catchingContainer;
        var maxWeight;

        var item = {
            type: player.invItems[itemId].type,
            decay: player.invItems[itemId].decay,
            quality: player.invItems[itemId].quality,
            mindur: player.invItems[itemId].mindur,
            maxdur: player.invItems[itemId].maxdur,
            props: player.invItems[itemId].props,
            container: player.invItems[itemId].container
        };
        //Blow out torches
        if (items[item.type].revert) {
            item.type = items[item.type].revert;
        }

        switch (location) {
            case 'ENV':
                if (locationId || locationId === 0) {
                    catchingContainer = envItems[locationId].container;
                    maxWeight = environmentals[envItems[locationId].type].maxWeight;
                    if (!checkContainerWeight()) {
                        return false;
                    }
                }
                break;
            case 'TILE':
                item.x = player.x + player.direction.x;
                item.y = player.y + player.direction.y;
                break;
            case 'INV':
                if (locationId || locationId === 0) {
                    //Add container prop if it doesn't exist yet
                    if (!player.invItems[locationId].container) {
                        player.invItems[locationId].container = [];
                    }
                    catchingContainer = player.invItems[locationId].container;
                    maxWeight = items[player.invItems[locationId].type].maxWeight;
                    if (!checkContainerWeight()) {
                        return false;
                    }
                }
                break;
        }

        function checkContainerWeight() {
            //Calculate container weight
            var contWeight = 0;
            var containerListLength = catchingContainer.length;
            for (var spot = 0; spot < containerListLength; spot++) {
                if (catchingContainer[spot] !== undefined && catchingContainer[spot] !== null) {
                    contWeight += Utilities.roundNumber(items[catchingContainer[spot].type].weight, 1);
                }
            }
            if (Utilities.roundNumber(contWeight + items[player.invItems[itemId].type].weight, 1) > maxWeight) {
                ui.message("noRoomContainer", 'bad', false);
                return false;
            }
            return true;
        }

        placeItem(item, location, locationId);
        removeItem(itemId, 'INV', false);
        return true;
    }
}

//Close any container that may or may not be open (called on respawn/movement)
function closeContainer() {
    ui.$tooltip.hide();
    ui.$containerWindow.parent('div').find('.ui-dialog-title').html(Messages.container);
    ui.$containerWindow.dialog("close");
    ui.$container.find('li').remove();
    game.containerOpened.containerType = "";
    game.containerOpened.id = -1;
}

//Version (for display if they have an older/newer save) window - doesn't get saved
$('#versionwindow').dialog({
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
            text: Messages.yes,
            click: function () {
                localStorage.clear();
                location.reload();
            }
        },
        {
            text: Messages.no,
            click: function () {
                location.reload();
            }
        }
    ],
    close: function () {
        location.reload();
    }
});

//Rendering animations
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function rendering() {
    requestAnimFrame(rendering);
    //Limit our actual rendering/keypress/delay logic to a fps (60 fps set in game.)
    game.now = Date.now();
    game.delta = game.now - game.then;
    if (game.delta > game.interval) {
        game.then = game.now - (game.delta % game.interval);
        render();
    }
}

//Smart resize with debounce
(function ($, sr) {
    var debounce = function (func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this;

            function delayed() {
                if (!execAsap) {
                    func.apply(obj, arguments);
                }
                timeout = null;
            }

            if (timeout) {
                clearTimeout(timeout);
            } else if (execAsap) {
                func.apply(obj, arguments);
            }
            timeout = setTimeout(delayed, threshold || 100);
        };
    };
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
})(jQuery, 'smartresize');

ui.$window.smartresize(function () {
    resizeWindow();
});

window.onload = function () {
    init();
};

window.onerror = function () { //err, url, line
    ui.message("error", "bad", false);
    if (game.start && ui.options.hints && !player.hintseen.bugs) {
        ui.hintDisplay("bugs");
    }
};

window.onbeforeunload = function () {
    saveGame();
};

//Prevent text selection (on most browsers)
document.onselectstart = function () {
    return false;
};

//Used for dynamic fullscreen game window - Updates all the window vars
function resizeWindow() {

    var windowWidth = ui.$body.width();
    var windowHeight = ui.$body.height();

    titleCanvas.canvas.width = windowWidth;
    titleCanvas.canvas.height = windowHeight;

    //Keep dialogs in window viewport if resized
    $(".ui-dialog-content").each(function () {
        var diaglogPosition = $(this).dialog("option", "position");
        var dialogWidth = $(this).dialog("option", "width");
        var dialogHeight = $(this).dialog("option", "height");
        if (diaglogPosition[0] + dialogWidth > windowWidth) {
            $(this).dialog("option", "position", [windowWidth - dialogWidth, diaglogPosition[1]]);
        }
        if (diaglogPosition[1] + dialogHeight > windowHeight) {
            $(this).dialog("option", "position", [diaglogPosition[0], windowHeight - dialogHeight]);
        }
    });

    if (ui.options.gameSize) {
        game.windowWidth = windowWidth / game.gridSize;
        game.windowHeight = windowHeight / game.gridSize;
    } else {
        game.windowWidth = 816 / game.gridSize;
        game.windowHeight = 816 / game.gridSize;
        windowWidth = 816;
        windowHeight = 816;
    }

    overlayCanvas.canvas.width = windowWidth;
    overlayCanvas.canvas.height = windowHeight;
    gameCanvas.canvas.width = windowWidth;
    gameCanvas.canvas.height = windowHeight;
    lightCanvas.canvas.width = windowWidth;
    lightCanvas.canvas.height = windowHeight;

    game.windowHalfWidth = Math.floor(game.windowWidth / 2);
    game.windowHalfHeight = Math.floor(game.windowHeight / 2);
    game.windowMiddleX = game.windowHalfWidth * game.gridSize - 8;
    game.windowMiddleY = game.windowHalfHeight * game.gridSize - 8;

    if (game.start) {
        passTurn(false);
    }

    renderCoverArt();
}

//Used in array.filter for removing
function nullFilter(element) {
    return element !== null;
}

function saveGame(nullSkip) {
    if (game.dailyChallenge) {
        return;
    }
    seeds.saved = Utilities.pRNG.state;
    if (localStorage) {
        if (!game.saveClear && game.start) {
            //Always save crafted/milestoneCount
            localStorage.setItem('crafted', JSON.stringify(player.crafted));
            localStorage.setItem('milestoneCount', JSON.stringify(player.milestoneCount));
            //Filter out any null/unused references
            if (!nullSkip) {
                player.invItems = player.invItems.filter(nullFilter);
                game.monsters = game.monsters.filter(nullFilter);
                tileItems = tileItems.filter(nullFilter);
                envItems = envItems.filter(nullFilter);
            }
            localStorage.setItem('options', JSON.stringify(ui.options));
            localStorage.setItem('version', JSON.stringify(game.version));
            localStorage.setItem('tileData', JSON.stringify(tileData));
            localStorage.setItem('seeds', JSON.stringify(seeds));
            localStorage.setItem('player', JSON.stringify(player.createPlayerToSave()));
            localStorage.setItem('monsters', JSON.stringify(game.monsters));
            localStorage.setItem('tileitems', JSON.stringify(tileItems));
            localStorage.setItem('envitems', JSON.stringify(envItems));
            ui.message("gameSavedMB", 'normal', [Utilities.roundNumber(decodeURI(encodeURIComponent(JSON.stringify(localStorage))).length / 1048576, 2)]);
        }
    } else {
        ui.message("cannotSave", "bad", false);
    }
}

function setZoomLevel() {
    ui.$canvases.css('-moz-transform', 'scale(' + ui.options.zoomLevel + ')');
    ui.$canvases.css('-o-transform', 'scale(' + ui.options.zoomLevel + ')');
    ui.$canvases.css('-ms-transform', 'scale(' + ui.options.zoomLevel + ')');
    ui.$canvases.css('-webkit-transform', 'scale(' + ui.options.zoomLevel + ')');
    ui.$canvases.css('transform', 'scale(' + ui.options.zoomLevel + ')');
    resizeWindow();
}

function setOption(option) {
    switch (option) {
        case 'music':
            if (ui.options.music) {
                ui.options.music = false;
                audio.stopMusic();
                ui.message("musicMuted", 'normal', false);
            } else {
                ui.options.music = true;
                audio.playMusic();
                ui.message("musicUnmuted", 'normal', false);
            }
            break;
        case 'sound':
            if (ui.options.sound) {
                ui.options.sound = false;
                audio.stopMusic();
                ui.message("soundsMuted", 'normal', false);
            } else {
                ui.options.sound = true;
                audio.playMusic();
                ui.message("soundsUnmuted", 'normal', false);
            }
            break;
        case 'volume':
            if (ui.options.volume) {
                ui.options.volume = false;
                audio.changeVolume();
                ui.message("sounds50", 'normal', false);
            } else {

                ui.options.volume = true;
                audio.changeVolume();
                ui.message("sounds100", 'normal', false);
            }
            break;
        case 'fontstyle':
            if (ui.options.fontStyle) {
                ui.options.fontStyle = false;
                ui.$body.addClass("fontstyle");
            } else {
                ui.options.fontStyle = true;
                ui.$body.removeClass("fontstyle");
            }
            break;
        case 'gamesize':
            if (ui.options.gameSize) {
                ui.options.gameSize = false;
                ui.$canvases.addClass("smallwindow");
                resizeWindow();
            } else {
                ui.options.gameSize = true;
                ui.$canvases.removeClass("smallwindow");
                resizeWindow();
            }
            break;
        case 'zoom':
            setZoomLevel();
            break;

    }
    updateOptionButtonText();
}

//Function for returning certain types of information from a given envItem
function getEnvItemStatus(type, id, envItemType) {
    switch (type) {
        case "fire":
            var decay = envItems[id].decay / environmentals[envItems[id].type].decay;
            if (decay <= 0.3) {
                ui.message("fireExtinguished", 'normal', false);
            } else if (decay <= 0.7) {
                ui.message("fireStruggling", 'normal', false);
            } else if (decay <= 1) {
                ui.message("fireHealthy", 'normal', false);
            } else {
                ui.message("fireRaging", 'normal', false);
            }
            break;
        case "garden":
            if (environmentals[envItemType].spread) {
                if (envItems[id].spread < 1) {
                    ui.message("plantNotFertile", 'normal', false);
                } else if (envItems[id].spread <= 3) {
                    ui.message("plantFertile", 'normal', false);
                } else {
                    ui.message("plantVeryHealthy", 'normal', false);
                }
            }
            break;
    }
}

//Returns a proper midpoint displacement value based on PRNG
function getHeight(z0, z1, d) {
    var fc = d * Utilities.pRNG.nextFloat() - d * 0.5;
    return (z0 + z1) * 0.5 + fc;
}

function mapLoadSpawn(saved, bypassSave) {
    var c, b, d, i, w, h, l, yt, caves = [], templateSpawns = [], envItemChance, envItemChanceWater, monsterChance, itemChance;

    if (saved) {
        Utilities.pRNG.state = saved;
    }
    seeds.base = Utilities.pRNG.state;

    var maxHeight = 250, minHeight = 25, altitude = 25, scale = game.mapSize / (maxHeight - minHeight) + 1;
    game.startX = 0;
    game.startY = 0;

    //Let's set up all the tiles, and make them set to 0 to start (they need values so we can subdivide from them)
    var map = [];
    for (var xCoordinate = 0; xCoordinate <= game.mapSize; xCoordinate++) {
        map[xCoordinate] = [];
        for (var yCoordinate = 0; yCoordinate <= game.mapSize; yCoordinate++) {
            //Give a border so there's always deep water
            if (xCoordinate < 19 || yCoordinate < 19 || xCoordinate > game.mapSize - 19 || yCoordinate > game.mapSize - 19) {
                map[xCoordinate][yCoordinate] = -1;
            } else {
                //Beef up the middle
                if (xCoordinate === game.halfMapSize && yCoordinate === game.halfMapSize) {
                    map[xCoordinate][yCoordinate] = 35;
                } else {
                    map[xCoordinate][yCoordinate] = 0;
                }
            }
        }
    }

    //We need to define the step to the size of the map so that we can generate every 2nd tile, we will use subdivision to find the rest
    var step = game.mapSize;
    var secondStepX, secondStepY, newX, newY;

    while (step > 1) {
        for (var stepX = 0; stepX < game.mapSize; stepX += step) {
            for (var stepY = 0; stepY < game.mapSize; stepY += step) {
                //Subdivide
                secondStepX = stepX + step;
                secondStepY = stepY + step;
                newX = Math.round((stepX + secondStepX) * 0.5);
                newY = Math.round((stepY + secondStepY) * 0.5);
                if (map[stepX][stepY] !== -1 && map[secondStepX][stepY] !== -1) {
                    map[newX][stepY] = getHeight(map[stepX][stepY], map[secondStepX][stepY], secondStepX - stepX);
                }
                if (map[stepX][stepY] !== -1 && map[stepX][secondStepY] !== -1) {
                    map[stepX][newY] = getHeight(map[stepX][stepY], map[stepX][secondStepY], secondStepY - stepY);
                }
                if (map[secondStepX][stepY] !== -1 && map[secondStepX][secondStepY] !== -1) {
                    map[secondStepX][newY] = getHeight(map[secondStepX][stepY], map[secondStepX][secondStepY], secondStepY - stepY);
                }
                if (map[stepX][secondStepY] !== -1 && map[secondStepX][secondStepY] !== -1) {
                    map[newX][secondStepY] = getHeight(map[stepX][secondStepY], map[secondStepX][secondStepY], secondStepX - stepX);
                }
                if (map[stepX][newY] !== -1 && map[secondStepX][newY] !== -1) {
                    map[newX][newY] = getHeight(map[stepX][newY], map[secondStepX][newY], secondStepX - stepX);
                }
            }
        }
        step = Math.round(step * 0.5);
    }

    //Biomes
    var biome = [];
    for (var biomeX = 0; biomeX <= game.mapSize; biomeX++) {
        biome[biomeX] = {};
        for (var biomeY = 0; biomeY <= game.mapSize; biomeY++) {
            if (biomeX === game.halfMapSize && biomeY === game.halfMapSize) {
                biome[biomeX][biomeY] = -1;
            } else {
                biome[biomeX][biomeY] = 0;
            }
        }
    }

    step = game.mapSize;
    while (step > 1) {
        for (var mapX = 0; mapX < game.mapSize; mapX += step) {
            for (var mapY = 0; mapY < game.mapSize; mapY += step) {
                //Subdivide
                secondStepX = mapX + step;
                secondStepY = mapY + step;
                newX = Math.round((mapX + secondStepX) * 0.5);
                newY = Math.round((mapY + secondStepY) * 0.5);
                biome[newX][mapY] = getHeight(biome[mapX][mapY], biome[secondStepX][mapY], secondStepX - mapX);
                biome[mapX][newY] = getHeight(biome[mapX][mapY], biome[mapX][secondStepY], secondStepY - mapY);
                biome[secondStepX][newY] = getHeight(biome[secondStepX][mapY], biome[secondStepX][secondStepY], secondStepY - mapY);
                biome[newX][secondStepY] = getHeight(biome[mapX][secondStepY], biome[secondStepX][secondStepY], secondStepX - mapX);
                biome[newX][newY] = getHeight(biome[mapX][newY], biome[secondStepX][newY], secondStepX - mapX);
            }
        }
        step = Math.round(step * 0.5);
    }

    for (var mapX2 = 0; mapX2 < game.mapSize; mapX2++) {
        tile[mapX2] = tile[mapX2] || {};
        tile[mapX2 + game.mapSize] = tile[mapX2 + game.mapSize] || {};
        for (var mapY2 = 0; mapY2 < game.mapSize; mapY2++) {
            tile[mapX2][mapY2] = tile[mapX2][mapY2] || {};
            tile[mapX2 + game.mapSize][mapY2] = tile[mapX2 + game.mapSize][mapY2] || {};
            c = Math.round((map[mapX2][mapY2]) * scale) + altitude;
            b = Math.round((biome[mapX2][mapY2]) * scale) + altitude;
            d = Math.round((map[mapX2][mapY2]) * 1000) + altitude;
            var e = c + 25;
            if (c < 40) {
                tile[mapX2][mapY2].type = 'deepwater';
            } else if (c < 65) {
                tile[mapX2][mapY2].type = 'water';
            } else if (c < 80) {
                tile[mapX2][mapY2].type = 'shallowwater';
            } else if (c < 100) {
                tile[mapX2][mapY2].type = 'sand';
            } else if (c < 110) {
                tile[mapX2][mapY2].type = 'gravel';
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'sand';
                }
            } else if (c < 130) {
                tile[mapX2][mapY2].type = 'grass';
                if (d % 50 === 0) {
                    tile[mapX2][mapY2].type = 'forest';
                }
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'sand';
                    //rare trees in desert (balance)
                    if (d >= 30000 && d <= 30060) {
                        tile[mapX2][mapY2].type = 'palm';
                        if (d % 8 === 0 || d % 9 === 0) {
                            tile[mapX2][mapY2].type = 'coconutpalm';
                        }
                    } else if (d % 64 === 0) {
                        tile[mapX2][mapY2].type = 'grass';
                    }
                }
                if (b > 240 && b < 250) {
                    tile[mapX2][mapY2].type = 'gravel';
                }
            } else if (c < 160) {
                tile[mapX2][mapY2].type = 'forest';
                if (b < 50 && b > 0) {
                    tile[mapX2][mapY2].type = 'swamp';
                    if (d % 3 === 0 || d % 4 === 0) {
                        tile[mapX2][mapY2].type = 'freshshallowwater';
                    }
                    if (d % 11 === 0 || d % 12 === 0 || d % 13 === 0) {
                        tile[mapX2][mapY2].type = 'vineforest';
                    }
                }
                if (d % 5 === 0 || d % 6 === 0 || d % 7 === 0 || d % 8 === 0) {
                    tile[mapX2][mapY2].type = 'grass';
                } else if (d % 19 === 0 || d % 20 === 0 || d % 21 === 0) {
                    tile[mapX2][mapY2].type = 'bareforest';
                }
                if (d % 256 === 0) {
                    tile[mapX2][mapY2].type = 'berryforest';
                }
                if (d % 257 === 0) {
                    tile[mapX2][mapY2].type = 'fungusforest';
                }
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'sand';
                    if (d % 4 === 0) {
                        tile[mapX2][mapY2].type = 'gravel';
                    } else if (d % 16 === 0) {
                        tile[mapX2][mapY2].type = 'grass';
                    }
                }
                if (b > 240 && b < 250) {
                    tile[mapX2][mapY2].type = 'gravel';
                }
            } else if (c < 165) {
                tile[mapX2][mapY2].type = 'grass';
                if (b < 75 && b > 50) {
                    tile[mapX2][mapY2].type = 'swamp';
                    if (d % 2 === 0) {
                        tile[mapX2][mapY2].type = 'freshshallowwater';
                    } else if (d % 3 === 0) {
                        tile[mapX2][mapY2].type = 'forest';
                    }
                }
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'sand';
                    if (d % 2 === 0) {
                        tile[mapX2][mapY2].type = 'gravel';
                    }
                }
                if (b > 240 && b < 250) {
                    tile[mapX2][mapY2].type = 'gravel';
                }
            } else if (c < 185) {
                tile[mapX2][mapY2].type = 'dirt';
                if (d % 50 === 0) {
                    tile[mapX2][mapY2].type = 'forest';
                } else if (d % 449 === 0) {
                    tile[mapX2][mapY2].type = 'freshshallowwater';
                }
                if (b < 50 && b > 20) {
                    if (d % 2 === 0) {
                        tile[mapX2][mapY2].type = 'freshshallowwater';
                    } else if (d % 3 === 0) {
                        tile[mapX2][mapY2].type = 'grass';
                    } else if (d % 4 === 0) {
                        tile[mapX2][mapY2].type = 'swamp';
                    }
                }
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'gravel';
                    if (d % 449 === 0) {
                        tile[mapX2][mapY2].type = 'freshshallowwater';
                    }
                } else if (b > 210 && b <= 250) {
                    tile[mapX2][mapY2].type = 'dirt';
                }
            } else if (c < 186) {
                tile[mapX2][mapY2].type = 'rock';
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'sandstone';
                    if (d % 257 === 0 || d % 259 === 0) {
                        tile[mapX2][mapY2].type = 'ironsandstone';
                    }
                } else if (b > 220 && b <= 250) {
                    tile[mapX2][mapY2].type = 'gravel';
                } else if (b > 190 && b <= 220) {
                    tile[mapX2][mapY2].type = 'dirt';
                }
            } else if (c < 230) {
                tile[mapX2][mapY2].type = 'rock';
                if (d % 256 === 0) {
                    tile[mapX2][mapY2].type = 'ironrock';
                }
                if (d % 257 === 0) {
                    tile[mapX2][mapY2].type = 'talcrock';
                }
                if (d % 258 === 0) {
                    tile[mapX2][mapY2].type = 'limestonerock';
                }
                if (d % 259 === 0) {
                    tile[mapX2][mapY2].type = 'coalrock';
                }
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'sandstone';
                    if (d % 257 === 0 || d % 259 === 0) {
                        tile[mapX2][mapY2].type = 'ironsandstone';
                    }
                    if (d % 261 === 0) {
                        tile[mapX2][mapY2].type = 'nitersandstone';
                    }
                } else if (b > 240 && b <= 260) {
                    tile[mapX2][mapY2].type = 'gravel';
                    if (d % 3 === 0) {
                        tile[mapX2][mapY2].type = 'dirt';
                    }
                } else if (b > 260 && b <= 300) {
                    tile[mapX2][mapY2].type = 'gravel';
                } else if (b > 190 && b < 241) {
                    tile[mapX2][mapY2].type = 'dirt';
                }
            } else if (c < 250) {
                tile[mapX2][mapY2].type = 'rock';
                if (d % 64 === 0) {
                    tile[mapX2][mapY2].type = 'ironrock';
                }
                if (d % 65 === 0) {
                    tile[mapX2][mapY2].type = 'talcrock';
                }
                if (d % 66 === 0) {
                    tile[mapX2][mapY2].type = 'limestonerock';
                }
                if (d % 67 === 0) {
                    tile[mapX2][mapY2].type = 'coalrock';
                }
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'gravel';
                } else if (b > 240 && b <= 260) {
                    tile[mapX2][mapY2].type = 'gravel';
                    if (d % 3 === 0) {
                        tile[mapX2][mapY2].type = 'dirt';
                    }
                } else if (b > 260 && b <= 300) {
                    tile[mapX2][mapY2].type = 'gravel';
                } else if (b > 190 && b <= 240) {
                    tile[mapX2][mapY2].type = 'dirt';
                }
            } else if (c < 290) {
                tile[mapX2][mapY2].type = 'highrock';
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'gravel';
                } else if (b > 210 && b <= 250) {
                    tile[mapX2][mapY2].type = 'dirt';
                } else if (b > 160 && b <= 210) {
                    tile[mapX2][mapY2].type = 'rock';
                }
            } else {
                tile[mapX2][mapY2].type = 'snow';
                if (d % 8 === 0) {
                    tile[mapX2][mapY2].type = 'rock';
                }
                if (d % 16 === 0) {
                    tile[mapX2][mapY2].type = 'highrock';
                }
                if (b > 250) {
                    tile[mapX2][mapY2].type = 'sandstone';
                    if (d % 257 === 0 || d % 259 === 0) {
                        tile[mapX2][mapY2].type = 'ironsandstone';
                    }
                } else if (b > 230 && b <= 250) {
                    tile[mapX2][mapY2].type = 'gravel';
                } else if (b > 220 && b <= 230) {
                    tile[mapX2][mapY2].type = 'dirt';
                } else if (b > 160 && b <= 220) {
                    tile[mapX2][mapY2].type = 'rock';
                }
            }

            //Caves
            if (e < 110) {
                tile[mapX2 + game.mapSize][mapY2].type = 'darkness';
            } else if (e < 150) {
                tile[mapX2 + game.mapSize][mapY2].type = 'highrock';
            } else if (e < 180) {
                tile[mapX2 + game.mapSize][mapY2].type = 'rock';
                if (d % 128 === 0) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'ironrock';
                }
                if (d % 129 === 0) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'talcrock';
                }
                if (d % 130 === 0) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'limestonerock';
                }
                if (d % 131 === 0) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'coalrock';
                }
            } else if (e > 260) {
                tile[mapX2 + game.mapSize][mapY2].type = 'freshdeepwater';
                if (e < 270) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'gravel';
                } else if (e < 285) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'freshshallowwater';
                } else if (e < 330) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'freshwater';
                    if (d % 10 === 0) {
                        tile[mapX2 + game.mapSize][mapY2].type = 'freshshallowwater';
                    }
                } else if (d % 20 === 0) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'freshwater';
                }
            } else {
                tile[mapX2 + game.mapSize][mapY2].type = 'dirt';
                if (d % 15 === 0) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'rock';
                } else if (d % 25 === 0) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'gravel';
                }
            }

            //Cave pathways
            if (e > 150) {
                if (b > 0 && b < 50) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'rock';
                } else if (b > 100 && b < 130) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'dirt';
                } else if (b > 200 && b < 250) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'freshshallowwater';
                    if (b > 220 && b < 230 && d % 2 === 0) {
                        tile[mapX2 + game.mapSize][mapY2].type = 'freshwater';
                    }
                }
            }

            //Make the edge of the cave terrain water (so you don't see it on minimap)
            if (mapX2 <= 19) {
                tile[mapX2 + game.mapSize][mapY2].type = 'deepwater';
            }

            //Plains
            if (c > 140 && c < 160) {
                if (b > 75 && b < 150) {
                    tile[mapX2][mapY2].type = 'grass';
                    if (d % 16 === 0) {
                        tile[mapX2][mapY2].type = 'dirt';
                    }
                }
            }

            //Mountain Passes
            if (c > 185) {
                if (b > 0 && b < 25) {
                    tile[mapX2][mapY2].type = 'dirt';
                } else if (b > 150 && b < 175) {
                    tile[mapX2][mapY2].type = 'dirt';
                }
            }

            //Spawn point - choose an island with a mountain, near the beach
            if (game.startX === 0 && c > 186) {
                for (var x2 = mapX2; x2 > 1; x2--) {
                    var height = Math.round((map[x2][mapY2]) * scale) + altitude;
                    if (height < 80) {
                        game.startX = x2;
                        game.startY = mapY2;
                        break;
                    }
                }
            }

            //Templates - don't run them again on saved game
            if (!saved || bypassSave) {
                if (b < 250) {
                    //Houses
                    if (d === 32850) {
                        tile[mapX2][mapY2].type = 'house';
                    }
                    //Ponds
                    if (d === 37250 || d === 37500 || d === 37750) {
                        tile[mapX2][mapY2].type = 'pond';
                    }
                }
                //Cave Houses/Ponds
                if (d === 43850 || d === 43851) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'house';
                } else if (d === 45850 || d === 45851) {
                    tile[mapX2 + game.mapSize][mapY2].type = 'cavepond';
                }
                //Clay
                if (d === 21500) {
                    tile[mapX2][mapY2].type = 'beach';
                }
                //Desert Formations
                if (b >= 210) {
                    if (d === 31250 || d === 33250 || d === 34250 || d === 35250) {
                        tile[mapX2][mapY2].type = 'desert';
                    }
                }
                //Boats
                if (c < 10) {
                    if (d === -9000) {
                        tile[mapX2][mapY2].type = 'boat';
                    }
                }

                //Template generation and environments, item and monster spawning
                if (tile[mapX2][mapY2].type === "house" || tile[mapX2][mapY2].type === "desert" || tile[mapX2][mapY2].type === "pond" || tile[mapX2][mapY2].type === "beach" || tile[mapX2][mapY2].type === "boat") {
                    templateSpawns.push([tile[mapX2][mapY2].type, mapX2, mapY2]);
                    //Find cave houses as well
                } else if (tile[mapX2 + game.mapSize][mapY2].type === "house" || tile[mapX2 + game.mapSize][mapY2].type === "cavepond") {
                    templateSpawns.push([tile[mapX2 + game.mapSize][mapY2].type, mapX2 + game.mapSize, mapY2]);
                }

                //Environments, item and monster spawning
                envItemChance = Math.floor(Math.random() * 325 + 1);
                envItemChanceWater = Math.floor(Math.random() * 1300 + 1);
                monsterChance = Math.floor(Math.random() * 500 + 1);
                itemChance = Math.floor(Math.random() * 600 + 1);

                switch (tile[mapX2][mapY2].type) {
                    case "water":
                        if (monsterChance === 1) {
                            spawnMonster("water", mapX2, mapY2, true);
                        }
                        if (envItemChanceWater === 1) {
                            envItemGen(tile[mapX2][mapY2].type, mapX2, mapY2);
                        }
                        break;
                    case "dirt":
                    case "grass":
                    case "swamp":
                        if (monsterChance === 1) {
                            spawnMonster("", mapX2, mapY2, true);
                        }
                        if (itemChance === 1) {
                            itemGen("", mapX2, mapY2);
                        } else if (envItemChance === 1) {
                            envItemGen(tile[mapX2][mapY2].type, mapX2, mapY2);
                        }
                        break;
                    case "forest":
                        if (envItemChance <= 25) {
                            placeEnvItem({type: "sapling_ground", x: mapX2, y: mapY2, quality: 'Random'});
                            changeTile({type: "grass"}, mapX2, mapY2, false);
                        }
                        break;
                    case "gravel":
                    case "snow":
                        if (monsterChance === 1) {
                            spawnMonster("", mapX2, mapY2, true);
                        }
                        if (itemChance === 1) {
                            itemGen("", mapX2, mapY2);
                        }
                        break;
                    case "shallowwater":
                        if (envItemChanceWater === 1) {
                            envItemGen(tile[mapX2][mapY2].type, mapX2, mapY2);
                        }
                        if (itemChance === 1) {
                            itemGen("shallowwater", mapX2, mapY2);
                        }
                        break;
                    case "sand":
                        if (envItemChance === 1 && itemChance !== 1) {
                            envItemGen(tile[mapX2][mapY2].type, mapX2, mapY2);
                        }
                        break;
                    case "house":
                    case "pond":
                        changeTile({type: "dirt"}, mapX2, mapY2, false);
                        break;
                    case "desert":
                        changeTile({type: "sand"}, mapX2, mapY2, false);
                        break;
                    case "beach":
                        changeTile({type: "sand"}, mapX2, mapY2, false);
                        break;
                    case "boat":
                        changeTile({type: "deepwater"}, mapX2, mapY2, false);
                        break;
                }

                //Cave items
                switch (tile[mapX2 + game.mapSize][mapY2].type) {
                    case "dirt":
                        if (monsterChance === 1) {
                            spawnMonster("", mapX2 + game.mapSize, mapY2, true);
                        }
                        if (itemChance <= 3) {
                            itemGen("", mapX2 + game.mapSize, mapY2);
                        }
                        if (envItemChance <= 2 && itemChance > 3) {
                            envItemGen(tile[mapX2 + game.mapSize][mapY2].type, mapX2 + game.mapSize, mapY2);
                        }
                        break;
                    case "cavepond":
                    case "house":
                        changeTile({type: "dirt"}, mapX2 + game.mapSize, mapY2, false);
                        break;
                    case "freshwater":
                    case "freshshallowwater":
                    case "freshdeepwater":
                        if (monsterChance === 1) {
                            spawnMonster("water", mapX2 + game.mapSize, mapY2, true);
                        }
                        break;
                }

                //Cave entrances
                if (tile[mapX2][mapY2].type === "rock" || tile[mapX2][mapY2].type === "sandstone") {
                    if (itemChance <= 10) {
                        caves.push([mapX2, mapY2]);
                    }
                }
            }

            if (d % 4 === 0) {
                tile[mapX2][mapY2].gfx = 2;
                tile[mapX2 + game.mapSize][mapY2].gfx = 2;
            } else if (d % 2 === 0) {
                tile[mapX2][mapY2].gfx = 1;
                tile[mapX2 + game.mapSize][mapY2].gfx = 1;
            } else {
                tile[mapX2][mapY2].gfx = 0;
                tile[mapX2 + game.mapSize][mapY2].gfx = 0;
            }

            //Draw map
            if (tiletypes[tile[mapX2][mapY2].type]) {
                mapCanvas.fillStyle = tiletypes[tile[mapX2][mapY2].type].color;
                mapCanvas.fillRect(mapX2, mapY2, 1, 1);
            }
            if (tiletypes[tile[mapX2 + game.mapSize][mapY2].type]) {
                mapCanvas.fillStyle = tiletypes[tile[mapX2 + game.mapSize][mapY2].type].color;
                mapCanvas.fillRect(mapX2 + game.mapSize, mapY2, 1, 1);
            }

        }
    }

    if (saved && !bypassSave) {

        game.monsters = JSON.parse(localStorage.getItem('monsters'));
        tileItems = JSON.parse(localStorage.getItem('tileitems'));
        envItems = JSON.parse(localStorage.getItem('envitems'));
        tileData = JSON.parse(localStorage.getItem('tileData'));

        //We need to set the pointers on save for monsters/tileItems/envItems
        //Convert all null
        game.monsters = game.monsters.filter(nullFilter);
        tileItems = tileItems.filter(nullFilter);
        envItems = envItems.filter(nullFilter);

        var envItemsLength = envItems.length;
        for (var envItem = 0; envItem < envItemsLength; envItem++) {
            if (envItems[envItem] !== undefined && envItems[envItem] !== null) {
                if (!tile[envItems[envItem].x][envItems[envItem].y].envItemList) {
                    tile[envItems[envItem].x][envItems[envItem].y].envItemList = [];
                }
                tile[envItems[envItem].x][envItems[envItem].y].envItemList.push(envItem);
            }
        }
        var monstersLength = game.monsters.length;
        for (var monster = 0; monster < monstersLength; monster++) {
            if (game.monsters[monster] !== undefined && game.monsters[monster] !== null) {
                tile[game.monsters[monster].x][game.monsters[monster].y].monster = monster;
            }
        }
        var tileItemsLength = tileItems.length;
        for (var tileItem = 0; tileItem < tileItemsLength; tileItem++) {
            if (tileItems[tileItem] !== undefined && tileItems[tileItem] !== null) {
                if (!tile[tileItems[tileItem].x][tileItems[tileItem].y].tileitems) {
                    tile[tileItems[tileItem].x][tileItems[tileItem].y].tileitems = {};
                }
                tile[tileItems[tileItem].x][tileItems[tileItem].y].tileitems[tileItem] = true;
            }
        }
        //Do the saved tile differences
        for (var data = 0; data < tileData.length; data++) {
            if (tileData[data] !== null) {
                var diffKeys = Object.keys(tileData[data]);
                for (var dataDiffs = 0; dataDiffs < diffKeys.length; dataDiffs++) {
                    if (tileData[data][diffKeys[dataDiffs]].length > 0) {
                        if (tileData[data][diffKeys[dataDiffs]][0].type) {
                            tile[data][diffKeys[dataDiffs]].type = tileData[data][diffKeys[dataDiffs]][0].type;
                            tile[data][diffKeys[dataDiffs]].gfx = Math.floor(Math.random() * 3);
                            //Draw map changes
                            mapCanvas.fillStyle = tiletypes[tile[data][diffKeys[dataDiffs]].type].color;
                            mapCanvas.fillRect(parseInt(data, 10), parseInt(diffKeys[dataDiffs], 10), 1, 1);
                        }
                    }
                }
            }
        }

        //Set the state to the last saved seed for Math.random after using .base for map regen
        Utilities.pRNG.state = seeds.saved;

    }

    //Generate the caves and templates after the loop (since we need to check on tiles in multiple directions)

    var templateType, templateX, templateY, i, w, h, d, l, yt;
    for (var templateSpawn = 0; templateSpawn < templateSpawns.length; templateSpawn++) {
        templateType = templateSpawns[templateSpawn][0];
        templateX = templateSpawns[templateSpawn][1];
        templateY = templateSpawns[templateSpawn][2];

        var templatesKeys = Object.keys(templates[templateType]);
        i = templatesKeys[Math.floor(Math.random() * templatesKeys.length)];

        w = templates[templateType][i].w;
        h = templates[templateType][i].h;
        d = templates[templateType][i].degrade;
        l = 0;
        yt = 0;

        //Randomly mirror the template
        if (Math.floor(Math.random() * 2) === 1) {
            templates[templateType][i].template.reverse();
        }

        for (var xt = 0; xt < w * h; xt++) {
            if (templates[templateType][i].template[xt]) {
                //Randomly degrade the template (don't place some tiles)
                if (Math.floor(Math.random() * d + 1) !== 1) {
                    if (!tile[templateX + l][templateY + yt].envItemList && !tile[templateX + l][templateY + yt].tileitems && !tile[templateX + l][templateY + yt].monster) {
                        changeTile({type: templates[templateType][i].template[xt]}, templateX + l, templateY + yt, false);

                        //Generate house items
                        switch (tile[templateX + l][templateY + yt].type) {
                            case "cobblestone":
                            case "sandstonefloor":
                            case "woodenfloor":
                                itemChance = Math.floor(Math.random() * 600 + 1);
                                envItemChance = Math.floor(Math.random() * 325 + 1);
                                monsterChance = Math.floor(Math.random() * 500 + 1);
                                if (itemChance <= 70) {
                                    itemGen("house", templateX + l, templateY + yt);
                                } else if (envItemChance <= 10) {
                                    envItemGen(tile[templateX + l][templateY + yt].type, templateX + l, templateY + yt);
                                } else if (monsterChance <= 30) {
                                    spawnMonster("skeleton", templateX + l, templateY + yt, true);
                                }
                                break;
                        }

                    }
                }
            }
            l++;
            if (w === l) {
                yt++;
                l = 0;
            }
        }

    }

    var caveX, caveY;
    for (var cave = 0; cave < caves.length; cave++) {
        caveX = caves[cave][0];
        caveY = caves[cave][1];
        if (tiletypes[tile[caveX][caveY + 1].type].passable && !tiletypes[tile[caveX][caveY - 1].type].passable && tiletypes[tile[caveX + game.mapSize][caveY + 1].type].passable) {
            changeTile({type: "exit"}, caveX, caveY, false);
            changeTile({type: "exit"}, caveX + game.mapSize, caveY, false);
            generateExit(caveX + game.mapSize, caveY);
        }
    }

}

function startSpawn() {

    //Make sure player was spawned in a preferable location, if not, set random location
    while (game.startX === 0) {
        //A good range
        var tryX = Math.floor(Math.random() * game.mapSize);
        var tryY = Math.floor(Math.random() * game.mapSize);
        if (tiletypes[tile[tryX][tryY].type].passable && tile[tryX][tryY].type !== "shallowwater" && tile[tryX][tryY].type !== "sand") {
            game.startX = tryX;
            game.startY = tryY;
        }
    }

    player.x = game.startX;
    player.y = game.startY;
    game.delay = 20;
    passTurn(false);
}


function play() {

    //Generate our monster spawn pool based on talent
    game.generateMonsterSpawnPool();

    if (localStorage && !game.dailyChallenge) {
        var savedSeeds = localStorage.getItem('seeds');
        if (Utilities.getURLData('seed')) {
            savedSeeds = Utilities.getURLData('seed');
            localStorage.removeItem('monsters');
            localStorage.removeItem('tileitems');
            localStorage.removeItem('envitems');
            mapLoadSpawn(savedSeeds, true);
        } else {
            if (savedSeeds) {
                seeds = JSON.parse(savedSeeds);
                mapLoadSpawn(seeds.base);
            } else {
                mapLoadSpawn();
            }
        }
    } else {
        var date = new Date();
        var daily = 10 * date.getDate() * date.getDate() * date.getFullYear() * (date.getDay() + 1) * (date.getDay() + 1) * date.getFullYear() * (date.getMonth() + 1) * (date.getMonth() + 1);
        mapLoadSpawn(daily, true);
    }

    //Reset variables
    game.staminaTimer = 0;
    game.start = true;
    game.delay = 0;
    game.healthTimer = 0;
    game.hungerTimer = 0;
    game.thirstTimer = 0;
    game.monsterSpawnTimer = 0;

    //Saved game?
    if (localStorage && !game.dailyChallenge) {
        var savedCrafted = localStorage.getItem('crafted');
        if (savedCrafted) {
            player.crafted = JSON.parse(savedCrafted);
        }
        var savedMilestones = localStorage.getItem('milestoneCount');
        if (savedMilestones) {
            player.milestoneCount = JSON.parse(savedMilestones);
        }
    }

    if (localStorage.getItem('player') && !game.dailyChallenge) {
        player.loadPlayerFromSave(JSON.parse(localStorage.getItem('player')));
        ui.message("awakeContinue", "stat", false);
        game.startX = player.x;
        game.startY = player.y;

        var savedItems = "";
        //Remove null entries(
        player.invItems = player.invItems.filter(nullFilter);
        var inventoryLength = player.invItems.length;
        for (var playerItem = 0; playerItem < inventoryLength; playerItem++) {

            if (player.invItems[playerItem] !== undefined && player.invItems[playerItem] !== null) {
                var quality = "";
                if (player.invItems[playerItem].quality) {
                    quality = " " + player.invItems[playerItem].quality.toLowerCase();
                }
                var group = "";
                if (items[player.invItems[playerItem].type].group) {
                    var groupLength = items[player.invItems[playerItem].type].group.length;
                    for (var itemGroup = 0; itemGroup < groupLength; itemGroup++) {
                        group += " " + items[player.invItems[playerItem].type].group[itemGroup];
                    }
                }
                var damaged = "";
                //Is the item low durability? Add the damaged CSS class
                if (player.invItems[playerItem].mindur <= 2) {
                    damaged = " damaged";
                }

                var itemHTML = '<li data-item="' + player.invItems[playerItem].type + '" data-itemid="' + playerItem + '" class="tooltip item ' + player.invItems[playerItem].type + group + quality + damaged + '"></li>';
                if (player.invItems[playerItem].equipped) {
                    //Re-equip items
                    ui.$equipment.find("#" + player.invItems[playerItem].equipped).append(itemHTML);
                } else if (player.invItems[playerItem].quickSlotted) {
                    ui.$quickSlots.find("#" + player.invItems[playerItem].quickSlotted).append(itemHTML);
                } else {
                    savedItems += itemHTML;
                }
            }
        }
        ui.$inventory.append(savedItems);
    } else {

        var milestones = player.milestoneCount;
        var crafted = player.crafted;
        var dialogPositions = player.dialog;

        player = new Player();

        player.milestoneCount = milestones;
        player.crafted = crafted;
        player.dialog = dialogPositions;

        player.dexterity = Math.floor(Math.random() * 10 + 80);
        player.strength = Math.floor(Math.random() * 5 + 45);
        player.starvation = Math.floor(Math.random() * 5 + 15);
        player.dehydration = Math.floor(Math.random() * 5 + 15);
        if (game.dailyChallenge) {
            player.talent = 56000;
            player.monsterSpawner = 50;
            player.stamina = player.dexterity - Math.floor(Math.random() * 20 - 10);
            player.health = player.strength - Math.floor(Math.random() * 10 - 5);
            player.hunger = player.starvation - Math.floor(Math.random() * 4 - 2);
            player.thirst = player.dehydration - Math.floor(Math.random() * 4 - 2);
        } else {
            player.stamina = player.dexterity - Math.floor(Math.random() * 10);
            player.health = player.strength - Math.floor(Math.random() * 5);
            player.hunger = player.starvation - Math.floor(Math.random() * 2);
            player.thirst = player.dehydration - Math.floor(Math.random() * 2);
            player.talent = 0;
            player.monsterSpawner = 150;
        }
        player.direction.x = 0;
        player.direction.y = 1;
        ui.message("awake", "stat", false);

        //Milestones
        var completedMilestones = 0;
        var milestoneKeys = Object.keys(player.milestoneCount);
        for (var milestone = 0; milestone < milestoneKeys.length; milestone++) {
            var chance = Math.floor(Math.random() * 99 + 1);
            //Some milestones can start as hidden or invisible
            if (chance <= 20) {
                player.milestoneCount[milestoneKeys[milestone]].type = "hidden";
            } else if (chance <= 40) {
                player.milestoneCount[milestoneKeys[milestone]].type = "invisible";
            } else {
                player.milestoneCount[milestoneKeys[milestone]].type = "";
            }
            if (player.milestoneCount[milestoneKeys[milestone]].amount === true) {
                completedMilestones++;
            }
        }
        if (completedMilestones >= 1) {
            ui.message("experienceBenefits", "stat", false);
        }

        //Skills
        var skillCount = [];

        var playerSkillsKey = Object.keys(player.skills);
        for (var skill = 0; skill < playerSkillsKey.length; skill++) {
            skillCount.push(playerSkillsKey[skill]);
        }
        var startingSkill = skillCount[Math.floor(skillCount.length * Math.random())];
        player.skills[startingSkill].core = Math.floor(Math.random() * 4 + 8 + completedMilestones);

        //Inventory
        itemGet({type: "leafbedroll", quality: "Random"}, 'silent');
        var inventoryCount = Utilities.randomFromInterval(7, 10 + completedMilestones);
        for (var item = 0; item < inventoryCount - 1; item++) {
            var spawnItems = ["redberries", "mushrooms", "strippedbark", "branch", "thistleseeds", "largerock", "treebark", "string", "twigs", "largerock", "bone", "animalskull", "shale", "plantroots", "sharprock", "grassblades"];
            itemGet({type: spawnItems[Math.floor(Math.random() * spawnItems.length)], quality: "Random"}, 'silent');
        }
        var waterItems = ["unpurifiedfreshwaterglassbottle", "purifiedfreshwaterglassbottle", "desalinatedwaterglassbottle", "unpurifiedfreshwaterwaterskin", "purifiedfreshwaterwaterskin", "desalinatedwaterwaterskin"];
        itemGet({type: waterItems[Math.floor(Math.random() * waterItems.length)], quality: "Random"}, 'silent');
        var toolItems = ["stoneaxe", "woodenspear", "stoneshovel", "mortarandpestle", "bandage", "waterskin", "glassbottle", "fishingrod", "barktorch", "bow", "cordedsling", "smallbag"];
        itemGet({type: toolItems[Math.floor(Math.random() * toolItems.length)], quality: "Random"}, 'silent');

        //Player knows about stills
        if (player.crafted.indexOf("stonewaterstill") < 0) {
            player.crafted.push("stonewaterstill");
        }
        if (player.crafted.indexOf("solarstill") < 0) {
            player.crafted.push("solarstill");
        }
        //Grow some plants out a bit on load
        for (var growRate = 0; growRate < 3; growRate++) {
            dynamicGrow();
        }
    }

    ui.dialogInit();
    addMilestone();
    player.skillGain(false, false, false);
    startSpawn();

    if (game.dailyChallenge) {
        //Spawn some additional badies around spawn
        for (var i = 0; i < 25; i++) {
            var monsterX = 0;
            var monsterY = 0;
            monsterX = Math.floor(Math.random() * 80 + player.x - 40);
            monsterY = Math.floor(Math.random() * 80 + player.y - 40);
            if (tile[monsterX] && tile[monsterX][monsterY] && tiletypes[tile[monsterX][monsterY].type].water) {
                spawnMonster("water", monsterX, monsterY);
            } else if (tile[monsterX] && tile[monsterX][monsterY]) {
                spawnMonster("", monsterX, monsterY);
            }
        }
    }

    titleCanvas.clearRect(0, 0, titleCanvas.canvas.width, titleCanvas.canvas.height);

    //Change main menu context
    if (game.dailyChallenge) {
        ui.$mainMenu.find('#in-game').hide();
        ui.$mainMenu.find('#new-game').show();
    } else {
        ui.$mainMenu.find('#in-game').show();
        ui.$mainMenu.find('#new-game').hide();
    }

    ui.$hud.show();
    ui.$craftFilter.trigger('blur');
    ui.$invFilter.trigger('blur');
    ui.$code.trigger('blur');
    game.fadeFromBlack = 1;
    closeContainer();

    //Load death/win screens
    if (!ui.deathScreen.src || !ui.winScreen.src) {
        ui.deathScreen.src = 'images/death.jpg';
        ui.winScreen.src = 'images/win.jpg';
    }

}

function respawn(type) {

    closeContainer();
    game.monsters = [];
    particles = [];
    pickups = [];
    game.texts = [];
    envItems = [];
    tileItems = [];
    tile = [];
    tileData = [];
    seeds = {
        base: false,
        saved: false
    };

    player.status.bleeding = false;
    player.status.poisoned = false;
    player.status.burning = false;
    player.light = 0;
    player.died = false;
    game.raft = false;
    overlayCanvas.clearRect(0, 0, overlayCanvas.canvas.width, overlayCanvas.canvas.height);

    //Did they win?
    if (type) {
        mapLoadSpawn(false);
        if (type === "WIN") {
            ui.message("endGame", "stat", false);
            //Remove 5 treasures
            var treasure;
            for (var t = 0; t < 5; t++) {
                treasure = player.isItemInInventory('treasure');
                removeItem(treasure.itemId, 'INV', treasure.containerId);
            }
            //Just travelling?
        } else {
            ui.message("travel", "stat", false);
        }

        if (player.monsterSpawner >= 50) {
            player.monsterSpawner -= 10;
        }
        player.hunger = Math.floor(player.hunger / 3);
        player.thirst = Math.floor(player.thirst / 3);
        //Reset treasure maps
        for (var invItem = 0; invItem < player.invItems.length; invItem++) {
            if (player.invItems[invItem] !== undefined && player.invItems[invItem] !== null) {
                if (player.invItems[invItem].props && player.invItems[invItem].quality !== "legendary") {
                    player.invItems[invItem].props[0] = 0;
                    player.invItems[invItem].props[1] = 0;
                }
            }
        }
        startSpawn();
        titleCanvas.clearRect(0, 0, titleCanvas.canvas.width, titleCanvas.canvas.height);
        game.fadeFromBlack = 1;
        makeMiniMap();
        player.respawned = false;
        game.start = true;
        //Change main menu context
        ui.$mainMenu.find('#in-game').show().find('#new-game').hide();
        //Change main menu text
        ui.$mainMenu.find(ui.$continueGame).text(Messages.continueGame);
        ui.$hud.show();
        //Were they dead?
    } else {
        player.talent = 0;
        ui.$messages.empty();
        ui.$skills.empty();
        ui.$milestones.empty();
        player.invItems = [];
        $('.item').remove();
        ui.$quickSlot.find('li').empty();
        ui.$equip.empty();
        play();
    }
}

//Check for old saved game
function saveConversion(bypass) {

    var savedVersion = parseFloat(localStorage.getItem('version'));

    if (savedVersion) {
        if (savedVersion !== game.version || bypass) {
            if (savedVersion === 3.5 || bypass) {
                //Convert item names
                if (localStorage.getItem('player')) {
                    var tempPlayer = localStorage.getItem('player');
                    var regexReplace = new RegExp("magicalessense", "g");
                    tempPlayer = tempPlayer.replace(regexReplace, "magicalessence");
                    localStorage.setItem('player', tempPlayer);
                }
            } else {
                $('#versionwindow').dialog("open");
            }
        }
    }
}

function init() {

    var savedOptions;

    //Saved world
    if (localStorage) {
        if (localStorage.getItem('player')) {
            //If we have a saved game, change main menu text
            $('#main-menu').find(ui.$continueGame).text(Messages.continueGame);
        }
        saveConversion();
        //Force a save conversion if set in URL
        if (Utilities.getURLData('convert-save')) {
            saveConversion(true);
        }
    }

    //Set options
    if (localStorage) {
        savedOptions = localStorage.getItem('options');
        if (savedOptions) {
            ui.options = JSON.parse(savedOptions);
            if (!ui.options.fontStyle) {
                ui.options.fontStyle = !ui.options.fontStyle;
                setOption("fontstyle");
            }
            if (!ui.options.gameSize) {
                ui.options.gameSize = !ui.options.gameSize;
                setOption("gamesize");
            }
            if (!ui.options.music) {
                ui.options.music = !ui.options.music;
                setOption("music");
            }
            if (!ui.options.sound) {
                ui.options.sound = !ui.options.sound;
                setOption("sound");
            }
            if (!ui.options.volume) {
                ui.options.volume = !ui.options.volume;
                setOption("volume");
            }
            if (ui.options.zoomLevel !== 1) {
                setOption("zoom");
            }
            //Just reset window mode as you can't fullScreen on load
            if (!ui.options.windowMode) {
                ui.options.windowMode = !ui.options.windowMode;
            }
            updateOptionButtonText();
        }
    }

    //Dynamically add the item css positions
    var style = '<style type="text/css">';

    var itemsKey = Object.keys(items);
    for (var i = 0; i < itemsKey.length; i++) {

        style += "." + itemsKey[i] + " { background-position: -" + items[itemsKey[i]].id * 32 + "px -" + items[itemsKey[i]].y * 32 + "px; }\n";
    }
    style += "</style>";
    $("head").append(style);

    //You can't save and exit in Firefox, no window.close() supported.
    if (BrowserDetect.browser === "Firefox") {
        ui.$mainMenu.find('#saveAndExit').remove();
        //CSS fix
        $('.second-row').css('bottom', 125);
    }

    //Give IE11 some pointer-event fixes
    if (BrowserDetect.browser === "Explorer") {
        $('.options').css('pointer-events', 'auto');
        ui.$quickSlots.css('pointer-events', 'auto');
    }

    resizeWindow();
    rendering();

    $('#afterload').show();
    $('#loading').hide();
    if (ui.options.music && ui.options.sound) {
        audio.playMusic();
    }
}

//Draws canvas text with a black stroke
function textStroke(font, color, x, y, text) {
    titleCanvas.font = font + 'px pressstart';
    titleCanvas.strokeStyle = 'black';
    titleCanvas.lineWidth = 4;
    titleCanvas.strokeText(text, x, y);
    titleCanvas.fillStyle = color;
    titleCanvas.fillText(text, x, y);
}

//Function for rendering the title image, we may need to call this multiple times due to browser resizing.
function renderCoverArt() {

    var screenWidth = ui.$body.width();
    var screenHeight = ui.$body.height();
    var imageWidth = 1920;
    var imageHeight = 1080;
    var newImageWidth = imageWidth;
    var newImageHeight = imageHeight;
    var widthOffset = 0;

    //Scale proportionally
    if ((newImageWidth > screenWidth) || (screenWidth > newImageWidth)) {
        newImageWidth = screenWidth;
        newImageHeight = (imageHeight / imageWidth) * newImageWidth;
    }
    //Scale/center image if in less than 16:9 ratio
    if (newImageHeight <= screenHeight) {
        newImageHeight = screenHeight;
        newImageWidth = (imageWidth / imageHeight) * newImageHeight;
        widthOffset = -(newImageWidth - screenWidth) / 2;
    }

    if (!game.start && !player.died) {
        titleCanvas.drawImage(ui.cover, 0, 0, imageWidth, imageHeight, widthOffset, 0, newImageWidth, newImageHeight);
        textStroke(16, 'white', 10, screenHeight - 80, Messages.beta + " " + game.release);
        textStroke(16, 'white', 10, screenHeight - 30, Messages.begin);
        textStroke(8, 'white', 10, screenHeight - 10, Messages.copyright);

        //Don't show browser info in offline version
        if (!nodewebkit) {
            //Give them a warning for old browsers
            if (BrowserDetect.browser === "Chrome" && BrowserDetect.version < 33 || BrowserDetect.browser === "Firefox" && BrowserDetect.version < 28 || BrowserDetect.browser === "Explorer" && BrowserDetect.version < 11 || BrowserDetect.browser === "Safari" && BrowserDetect.version < 6 || BrowserDetect.browser === "Opera" && BrowserDetect.version < 20) {
                textStroke(8, 'red', 10, screenHeight - 60, makeString("playAtYourOwnRisk", [BrowserDetect.browser, BrowserDetect.version]));
                textStroke(8, 'red', 10, screenHeight - 60, Messages.unknownBrowser);
            } else {
                textStroke(8, 'limegreen', 10, screenHeight - 60, makeString("browser", [BrowserDetect.browser, BrowserDetect.version]));
            }
        }

    } else if (player.died) {
        //Win or travelling
        if (player.respawned) {
            titleCanvas.drawImage(ui.winScreen, 0, 0, imageWidth, imageHeight, widthOffset, 0, newImageWidth, newImageHeight);
            textStroke(16, 'white', 10, screenHeight - 10, Messages.begin);
            if (player.respawned === "WIN") {
                textStroke(32, 'white', 10, screenHeight - 120, Messages.win);
            }
            //Death
        } else if (player.died) {
            titleCanvas.drawImage(ui.deathScreen, 0, 0, imageWidth, imageHeight, widthOffset, 0, newImageWidth, newImageHeight);
            textStroke(16, 'white', 10, screenHeight - 10, Messages.restart);
            textStroke(32, 'white', 10, screenHeight - 120, Messages.lost);
        }
        textStroke(8, 'white', 10, screenHeight - 40, makeString("talent", [player.talent]));
        textStroke(8, 'white', 10, screenHeight - 60, makeString("turns", [player.turns]));
        var score = Math.round((100 + player.talent / 2) + (1000 + player.talent / 100 + player.turns)) + 100;
        textStroke(8, 'white', 10, screenHeight - 80, makeString("score", [score]));
    }
}

function gatherEnvItems(id) {
    if (environmentals[envItems[id].type].resource) {
        var resources = environmentals[envItems[id].type].resource;
        if (envItems[id].type === "livingmushroom_corpse" && envItems[id].aberrant) {
            resources = ["redmushroom", "redmushroom"];
        }
        for (var resource = 0; resource < resources.length; resource++) {
            //Damage the item on pickup!
            itemGet({
                type: resources[resource],
                mindur: envItems[id].mindur - 1,
                maxdur: envItems[id].maxdur,
                quality: envItems[id].quality
            }, false);
            game.delay += 10;
        }
    } else {
        audio.queueSfx('pickup');
    }
    if (environmentals[envItems[id].type].skill) {
        player.skillGain(environmentals[envItems[id].type].skill, false, false);
    }
    removeItem(id, 'ENV', false);
    passTurn(true);
}


function deleteMonsters(id) {
    delete tile[game.monsters[id].x][game.monsters[id].y].monster;
    delete game.monsters[id];
}

/**
 * Function to check and see if the container has any indexes that are NOT undefined or null.
 * If not it empties the array so we can do things like pickup the container.
 * Note: Only loops the container if it shows a length of greater than 0 and breaks at the first real item.
 *
 * TODO: Maybe add an external containerCount flag to envItems that gets checked instead of the length of the container.
 * This would let us reset without looping through the container. The flag could be incremented or decremented when we
 * add or remove items from the container. Could only be used as a reference for resetting container for retrieval.
 * Since a traversal of the array would fail if undefined indexes were present if we used this new flag in place of
 * length.
 * @param envId
 */
function isContainerTrulyEmpty(envId) {
    if (envItems[envId].container) {
        if (envItems[envId].container.length > 0) {
            var hasContent = false;
            for (var check = 0; check < envItems[envId].container.length; check++) {
                if (envItems[envId].container[check]) {
                    hasContent = true;
                    break;
                }
            }
            if (!hasContent) {
                envItems[envId].container = [];
            }
        }
    }
}

//Yep, "death" is also called on win. Wat?
function death(type) {
    player.died = true;
    game.start = false;
    ui.$hud.hide();

    //Close all opened dialogs
    $(".ui-dialog-content").dialog("close");

    //Change main menu context
    ui.$mainMenu.find('#in-game').hide();
    ui.$mainMenu.find('#new-game').show();

    lightCanvas.clearRect(0, 0, lightCanvas.canvas.width, lightCanvas.canvas.height);

    if (type === "WIN") {
        audio.queueSfx('exceptional');
        player.respawned = "WIN";
    } else if (type === "TRAVEL") {
        player.respawned = "TRAVEL";
    } else {
        if (localStorage && !game.dailyChallenge) {
            localStorage.removeItem('player');
            localStorage.removeItem('monsters');
            localStorage.removeItem('tileitems');
            localStorage.removeItem('envitems');
            localStorage.removeItem('seeds');
            localStorage.removeItem('tileData');
        }
        ui.$mainMenu.find(ui.$continueGame).text(Messages.startGame);
        audio.queueSfx('death');
        ui.message("killed", "bad", false);
        if (ui.options.hints && !player.hintseen.death) {
            ui.hintDisplay("death");
        }
    }
    renderCoverArt();
}

function itemGen(itemType, positionX, positionY) {
    var decay = -1;
    var itemTypes;
    if (itemType === "house") {
        itemTypes = ["stoneshovel", "bone", "woodenspear", "barktorch", "tannedleather", "barktunic", "barkleggings", "barkshield", "lockpick", "oldinstructionalscroll", "tatteredmap", "waterskin"];
    } else if (itemType === "shallowwater") {
        itemTypes = ["log", "branch", "twigs", "log", "branch", "twigs", "rawtrout", "messageinabottle", "seaweed"];
    } else if (positionX > game.mapSize) {
        itemTypes = ["sharprock", "largerock", "stones", "smoothrock", "amber", "fossil", "ironore", "talc", "limestone", "coal", "animalskull", "shale", "bone", "woodenspear", "woodenarrow"];
    } else {
        itemTypes = ["feather", "largerock", "bone", "branch", "twigs", "arrowhead", "stones", "sharprock", "animalskull", "treebark", "shale", "amber", "fossil", "egg"];
    }
    var spawnItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    if (items[spawnItem].decayable) {
        decay = items[spawnItem].decayable[0];
    }
    placeItem({type: spawnItem, x: positionX, y: positionY, decay: decay, durability: "Random"}, 'TILE', false);
}

//TODO: Define all this in environmentals and create a new object to choose from like we did with monsters
function envItemGen(tileType, positionX, positionY, afterMapGen) {
    var envItemTypes;

    //If this is run after the original map gen, let's just grow plants
    if (afterMapGen) {
        if (positionX > game.mapSize) {
            envItemTypes = ["mushrooms_ground", "redmushroom_ground"];
        } else if (tileType === "grass") {
            envItemTypes = ["yellowflowers", "mushrooms_ground", "redmushroom_ground", "bush", "sapling_ground", "tallgrass", "wildonion_ground", "cotton_ground"];
        } else if (tileType === "dirt") {
            envItemTypes = ["grassseeds_ground", "thistle", "bush", "sapling_ground", "tallgrass"];
        } else if (tileType === "sand") {
            envItemTypes = ["brambles", "cactus", "brambles", "pineappleplant"];
        } else if (tileType === "swamp") {
            envItemTypes = ["vines"];
        } else if (tileType === "water" || tileType === "shallowwater") {
            envItemTypes = ["seaweed_ground"];
        }
    } else {
        if (positionX > game.mapSize) {
            envItemTypes = ["rockpatch", "rockpatch", "rockpatch", "rockpatch", "mushrooms_ground", "redmushroom_ground", "redmushroom_ground", "woodenchest_locked"];
        } else if (tileType === "grass") {
            envItemTypes = ["yellowflowers", "rockpatch", "mushrooms_ground", "redmushroom_ground", "bush", "sapling_ground", "tallgrass", "wildonion_ground", "cotton_ground"];
        } else if (tileType === "dirt") {
            envItemTypes = ["grassseeds_ground", "thistle", "bush", "sapling_ground", "rockpatch", "tallgrass"];
        } else if (tileType === "sand") {
            envItemTypes = ["brambles", "cactus", "rockpatch", "brambles", "rockpatch", "pineappleplant"];
        } else if (tileType === "swamp") {
            envItemTypes = ["vines"];
        } else if (tileType === "water" || tileType === "shallowwater") {
            envItemTypes = ["seaweed_ground"];
        } else if (tileType === "cobblestone" || tileType === "sandstonefloor" || tileType === "woodenfloor") {
            envItemTypes = ["campfire_unlit", "campfire_unlit", "woodenchest_locked", "furnace_unlit", "kiln_unlit"];
        }
    }
    if (envItemTypes) {
        placeEnvItem({
            type: envItemTypes[Math.floor(Math.random() * envItemTypes.length)],
            x: positionX,
            y: positionY,
            quality: 'Random'
        });
    }
}

//Check for re-quickslotting items on use/break
function reQuickSlot(invId, invClass, hotkey) {
    if (!player.invItems[invId]) {
        var itemKeys = Object.keys(player.invItems);
        for (var item = 0; item < itemKeys.length; item++) {
            if (!player.invItems[itemKeys[item]].quickSlotted && player.invItems[itemKeys[item]].type === invClass) {
                ui.$quickSlots.find(ui.$quickSlot).eq(hotkey).append(ui.$inventory.find('li[data-itemid="' + itemKeys[item] + '"]'));
                player.invItems[itemKeys[item]].quickSlotted = hotkey + 1;
                break;
            }
        }
    }
}

//Did you step on a fire, or lit on fire from a monster? Same effect.
function getBurned() {
    //How did it get burned? How did it get burned? How did it get burned?
    var fireDamage = Utilities.randomFromInterval(player.strength / 10, player.strength / 5) - (player.defense.base + player.defense.fire);
    if (fireDamage >= 1) {
        ui.textAbove("-" + fireDamage, 255, 0, 0);
        audio.queueSfx('hurt');
        player.health -= fireDamage;
        ui.message("burned", "bad", [fireDamage]);
        if (!player.status.burning) {
            player.status.burning = true;
            if (ui.options.hints && !player.hintseen.burning) {
                ui.hintDisplay("burning");
            }
        }
    } else {
        ui.message("burnedEquipment", 'normal', false);
    }
    damageEquip();
}

//Check under the player for fire, items or cave movement - called from spacebar input or movement
function checkUnderPlayer(underPlayer, noPickup, checkX, checkY) {

    var playerX = 0;
    var playerY = 0;
    if (underPlayer) {
        playerX = player.x;
        playerY = player.y;
    } else {
        playerX = checkX;
        playerY = checkY;
    }

    //Don't step in fire bro!
    if (underPlayer && tile[playerX][playerY].envItemList) {
        for (var envItem = 0; envItem < tile[playerX][playerY].envItemList.length; envItem++) {
            var envItemId = tile[playerX][playerY].envItemList[envItem];
            if (environmentals[envItems[envItemId].type].fire) {
                getBurned();
                //trampling the fires, stupid, but effective.
                if (envItems[envItemId].type === 'fire') {
                    var chance = Math.floor(Math.random() * 99 + 1);
                    createParticles(210, 125, 20);
                    var fireChance = Math.floor(player.skills.camping.percent / 4);

                    //25% chance to reduce fire spread.
                    if ((chance + fireChance) >= 75) {
                        envItems[envItemId].spread -= 5;
                    } else {
                        envItems[envItemId].spread += 5;
                    }
                    if (envItems[envItemId].spread <= -1) {
                        ui.message('trampleFire', 'normal', false);
                        removeItem(envItemId, 'ENV', false);
                    }
                }
                break;
            }
        }
    }

    if (noPickup) {
        return false;
    }

    //Pick-up items, check for auto pick is off - ignore it if spacebar
    if (ui.options.autoPickup && tile[playerX][playerY].tileitems || underPlayer && tile[playerX][playerY].tileitems) {
        var keys = Object.keys(tile[playerX][playerY].tileitems);
        var itemLength = keys.length - 1;
        var itemOnTile = keys[itemLength];
        itemGet({
            type: tileItems[itemOnTile].type,
            decay: tileItems[itemOnTile].decay,
            quality: tileItems[itemOnTile].quality,
            mindur: tileItems[itemOnTile].mindur,
            maxdur: tileItems[itemOnTile].maxdur,
            props: tileItems[itemOnTile].props,
            container: tileItems[itemOnTile].container
        }, false);
        removeItem(itemOnTile, 'TILE', false);
        if (!underPlayer && itemLength >= 3 && ui.options.hints && !player.hintseen.fastpickup) {
            ui.hintDisplay("fastpickup");
        }
    }

    //Entrances and exits
    if (tile[playerX][playerY].type === "exit") {
        if (player.x <= game.mapSize) {
            player.x = playerX + game.mapSize;
            player.y = playerY;
            if (ui.options.hints && !player.hintseen.cavedarkness) {
                ui.hintDisplay("cavedarkness");
            }
        } else {
            player.x = playerX - game.mapSize;
            player.y = playerY;
        }
        //Always remake the exit/entrance if it was filled in from one end
        changeTile({type: "exit"}, player.x, player.y, false);
        particles = [];
        overlayCanvas.clearRect(0, 0, overlayCanvas.canvas.width, overlayCanvas.canvas.height);
        game.delay = 20;
        passTurn(false);
        return false;
    }

    if (underPlayer) {
        passTurn(true);
        game.delay = 10;
    }
    return true;
}

function render() {

    //Delay sound effects
    game.soundTimer--;
    var sound;
    if (audio.soundList.length >= 1 && game.soundTimer <= 0) {
        //Play one of three audio sfx
        var soundChance = Utilities.randomFromInterval(1, 3);
        if (soundChance === 1) {
            soundChance = "";
        }
        sound = audio.soundList.splice(0, 1);
        audio.playSound(sound + soundChance);
        game.soundTimer = 8;
    }

    if (player.died || !game.start || game.loadingCycles >= 1) {
        return false;
    }

    game.finishScroll = false;
    var moved = false;

    ui.keyTimer++;
    if (ui.keyTimer >= game.delay && game.scroll.x === 0 && game.scroll.y === 0) {

        //Facing a direction you are not moving in doesn't cost a turn, also, if you are currently frozen, still allow them to face a direction
        if (ui.keyState[68] || ui.keyState[39] || ui.keyState[76] || ui.mouseState === 4) {
            if (player.direction.x !== 1) {
                player.direction.x = 1;
                player.direction.y = 0;
                passTurn(false);
                ui.keyTimer = game.delay - 12;
                game.finishScroll = true;
            } else {
                if (move(1, 0)) {
                    game.scroll.x = -8;
                    moved = true;
                }
            }
        } else if (ui.keyState[65] || ui.keyState[37] || ui.keyState[72] || ui.mouseState === 3) {
            if (player.direction.x !== -1) {
                player.direction.x = -1;
                player.direction.y = 0;
                passTurn(false);
                ui.keyTimer = game.delay - 12;
                game.finishScroll = true;
            } else {
                if (move(-1, 0)) {
                    game.scroll.x = 8;
                    moved = true;
                }
            }
        } else if (ui.keyState[87] || ui.keyState[38] || ui.keyState[75] || ui.mouseState === 1) {
            if (player.direction.y !== -1) {
                player.direction.x = 0;
                player.direction.y = -1;
                passTurn(false);
                ui.keyTimer = game.delay - 12;
                game.finishScroll = true;
            } else {
                if (move(0, -1)) {
                    game.scroll.y = 8;
                    moved = true;
                }
            }
        } else if (ui.keyState[83] || ui.keyState[40] || ui.keyState[74] || ui.mouseState === 2) {
            if (player.direction.y !== 1) {
                player.direction.x = 0;
                player.direction.y = 1;
                passTurn(false);
                ui.keyTimer = game.delay - 12;
                game.finishScroll = true;
            } else {
                if (move(0, 1)) {
                    game.scroll.y = -8;
                    moved = true;
                }
            }
        } else if (ui.keyState[32] || ui.keyState[190] || ui.mouseState === 5) {
            //Spacebar
            ui.keyTimer = 0;
            checkUnderPlayer(true);
            game.finishScroll = true;
        } else if (ui.keyState[49] || ui.keyState[50] || ui.keyState[51] || ui.keyState[52] || ui.keyState[53] || ui.keyState[54] || ui.keyState[55] || ui.keyState[56] || ui.keyState[57]) {
            //Hotkeys
            var hotkey;
            if (ui.keyState[49]) {
                hotkey = 0;
            } else if (ui.keyState[50]) {
                hotkey = 1;
            } else if (ui.keyState[51]) {
                hotkey = 2;
            } else if (ui.keyState[52]) {
                hotkey = 3;
            } else if (ui.keyState[53]) {
                hotkey = 4;
            } else if (ui.keyState[54]) {
                hotkey = 5;
            } else if (ui.keyState[55]) {
                hotkey = 6;
            } else if (ui.keyState[56]) {
                hotkey = 7;
            } else if (ui.keyState[57]) {
                hotkey = 8;
            }

            var hotkeyItem = ui.$quickSlots.find(ui.$quickSlot).eq(hotkey).find('li');
            if (hotkeyItem.length > 0) {
                var invClass = $(hotkeyItem).attr("data-item");
                var invId = parseInt($(hotkeyItem).attr("data-itemid"), 10);
                if (items[invClass].use) {
                    useItem($(hotkeyItem), hotkey + 1, items[invClass].use[0]);
                } else {
                    //Default to throw if no use command
                    player.actions.attack(invId, 'throwItem');
                    reQuickSlot(invId, invClass, hotkey);
                }
            }
            ui.keyTimer = 0;
            game.delay = 20;
            game.finishScroll = true;
        }
    }

    //Time how fast messages fade based on how many there is
    game.messageTimer--;
    var messageLength = ui.$messageOverlay.find('p').length;
    if (game.messageTimer <= 0 && ui.$messageOverlay.find('p') && messageLength >= 6) {
        ui.$messageOverlay.find('p').eq(0).remove();
        game.messageTimer = 0;
        game.messageTimer += 125 - (messageLength * 10);
    }

    //Always force scroll off on smoothMovement
    if (!ui.options.smoothMovement) {
        game.scroll.x = 0;
        game.scroll.y = 0;
    }

    //Update animation even when not moving for other actions (dropping, using, etc.)
    if (game.updateAnimation && game.scroll.x === 0 && game.scroll.y === 0) {
        game.finishScroll = true;
        game.updateAnimation = false;
    }

    //Rendering stuff be below
    if (game.updateMovement || game.updateLighting || game.updateTiles) {

        if (game.updateLighting) {
            lightCanvas.clearRect(0, 0, lightCanvas.canvas.width, lightCanvas.canvas.height);
        }

        if (game.scroll.x > game.gridSize - 8 || game.scroll.x < -game.gridSize + 8 || game.scroll.y > game.gridSize - 8 || game.scroll.y < -game.gridSize + 8) {
            game.finishScroll = true;
        }

        //Lighting variables
        var lightLevel = player.light;
        //Cave lighting
        if (player.x > game.mapSize) {
            lightLevel = 0.95;
        }

        //Tile variables
        var tileMapY = 0;
        //var tileMapX = 0;

        //Movement variables
        var topTile = 0;
        var leftTile = 0;
        var stackOffset = 0;
        var stack = 0;

        //All
        var worldX = 0;
        var worldY = 0;
        var canSee = true;
        var playerXOffset = 0;
        var playerYOffset = 0;
        if (game.scroll.x > 0 || game.scroll.x < 0 || game.scroll.y > 0 || game.scroll.y < 0) {
            playerXOffset = player.direction.x;
            playerYOffset = player.direction.y;
        }

        //This is the master render loop where we render lighting, tiles and entities (movement)
        //+1 is used because a resolution could be used that shows part of the next tiles
        //z is for tile depth - it's not used for movement/lighting
        for (var z = 0; z <= 8; z++) {
            for (var x = -1; x < game.windowWidth + 1; x++) {
                for (var y = -1; y < game.windowHeight + 1; y++) {

                    //Where in the world are we?
                    worldX = x + player.x - game.windowHalfWidth;
                    worldY = y + player.y - game.windowHalfHeight;

                    //Tiles
                    if (game.updateTiles) {

                        //Define the layers
                        if (tile[worldX] && tile[worldX][worldY]) {
                            var name = tile[worldX][worldY].type;
                            if (tiletypes[name] && z === tiletypes[name].layer) {
                                tileMapY = 0;
                                //For tileMapping walls
                                if (name === "stonewall" && tile[worldX][worldY + 1].type !== "stonewall" || name === "sandstonewall" && tile[worldX][worldY + 1].type !== "sandstonewall" || name === "woodenwall" && tile[worldX][worldY + 1].type !== "woodenwall") {
                                    tileMapY = game.graphicSize;
                                }

                                gameCanvas.drawImage(tiles, tile[worldX][worldY].gfx * game.graphicSize, tiletypes[name].id * game.graphicSize + tileMapY, game.graphicSize, game.graphicSize, (x + playerXOffset) * game.gridSize - 24 + game.scroll.x, (y + playerYOffset) * game.gridSize - 24 + game.scroll.y, game.graphicSize, game.graphicSize);
                            }
                        } else {
                            //Render deep water by default
                            gameCanvas.drawImage(tiles, 0, 3 * game.graphicSize, game.graphicSize, game.graphicSize, (x + playerXOffset) * game.gridSize - 24 + game.scroll.x, (y + playerYOffset) * game.gridSize - 24 + game.scroll.y, game.graphicSize, game.graphicSize);
                        }
                    }

                    //Movement/lighting don't need to loop anymore
                    if (z === 8) {
                        //Check LOS
                        if (game.updateMovement || game.updateLighting) {
                            canSee = checkLOS(player.x, player.y, worldX, worldY);
                        }

                        //Movement
                        if (canSee && game.updateMovement) {
                            topTile = (x + playerXOffset) * game.gridSize - 12 + game.scroll.x;
                            leftTile = (y + playerYOffset) * game.gridSize - 12 + game.scroll.y;
                            stackOffset = 0;
                            stack = 0;
                            if (tile[worldX] && tile[worldX][worldY]) {

                                //Variate piles of items
                                if (tile[worldX][worldY].tileitems) {
                                    var tileItemsKey = Object.keys(tile[worldX][worldY].tileitems);
                                    for (var i = 0; i < tileItemsKey.length; i++) {
                                        stack++;
                                        if (stack > 12) {
                                            stack = 1;
                                        }
                                        if (stack % 3 === 0) {
                                            stackOffset = 16;
                                        } else if (stack % 2 === 0) {
                                            stackOffset = -16;
                                        } else if (stack % 1 === 0) {
                                            stackOffset = 0;
                                        }
                                        gameCanvas.drawImage(itemSetSmall, items[tileItems[tileItemsKey[i]].type].x * game.halfGridSize, items[tileItems[tileItemsKey[i]].type].y * game.halfGridSize + (items[tileItems[tileItemsKey[i]].type].y * 4), game.halfGridSize, game.halfGridSize + 4, topTile + 20 + stackOffset, leftTile + game.gridSize - 24 - (stack * 4), game.halfGridSize, game.halfGridSize + 4);
                                    }
                                }
                                if (tile[worldX][worldY].envItemList) {
                                    for (var envItem = 0; envItem < tile[worldX][worldY].envItemList.length; envItem++) {
                                        var envId = tile[worldX][worldY].envItemList[envItem];
                                        //Fire animations
                                        if (environmentals[envItems[envId].type].fire) {
                                            var envItemAnim = 0;
                                            if (game.finishScroll) {
                                                envItems[envId].anim = Math.floor(Math.random() * 3);
                                            }
                                            if (!envItems[envId].anim) {
                                                envItems[envId].anim = 0;
                                            } else {
                                                envItemAnim = envItems[envId].anim;
                                            }
                                            gameCanvas.drawImage(environments, envItemAnim * game.gridSize, environmentals[envItems[envId].type].id * game.gridSize, game.gridSize, game.gridSize, topTile, leftTile, game.gridSize, game.gridSize);
                                        } else {
                                            var xOffset = envItems[envId].graphic * game.gridSize;
                                            if (envItems[envId].aberrant) {
                                                xOffset = game.gridSize;
                                            }
                                            gameCanvas.drawImage(environments, xOffset, environmentals[envItems[envId].type].id * game.gridSize, game.gridSize, game.gridSize, topTile, leftTile, game.gridSize, game.gridSize);
                                        }
                                    }
                                }
                                if (tile[worldX][worldY].monster) {
                                    var monster = tile[worldX][worldY].monster;
                                    var animMove = 0;

                                    if (game.finishScroll) {
                                        if (!game.monsters[monster].anim) {
                                            game.monsters[monster].anim = true;
                                            animMove = game.gridSize;
                                        } else {
                                            game.monsters[monster].anim = false;
                                        }
                                    }

                                    if (game.monsters[monster].aberrant) {
                                        animMove += game.gridSize * 2;
                                    }
                                    if (game.monsters[monster].ai !== "hidden") {
                                        gameCanvas.drawImage(enemies, animMove, npcs[game.monsters[monster].type].id * game.gridSize, game.gridSize, game.gridSize, topTile, leftTile, game.gridSize, game.gridSize);
                                    }
                                }
                            }
                        }

                        //Player
                        if (game.updateMovement && worldX === player.x && worldY === player.y) {

                            if (game.finishScroll) {
                                if (game.moveAnim === 1) {
                                    game.moveAnim = 0;
                                } else {
                                    game.moveAnim = 1;
                                }
                            }

                            var anim = game.moveAnim;

                            if (tiletypes[tile[player.x][player.y].type].water && !game.raft) {
                                anim += 8;
                            }
                            if (player.direction.x === -1) {
                                anim += 6;
                            } else if (player.direction.y === 1) {
                                anim += 4;
                            } else if (player.direction.y === -1) {
                                anim += 2;
                            }
                            var characterSprite = player.characterSprite;
                            //Rafting
                            if (game.raft) {
                                var raftDirection = 0;
                                if (player.direction.x !== 0) {
                                    raftDirection = game.gridSize;
                                }
                                gameCanvas.drawImage(characterSprite, raftDirection, 4 * game.gridSize, game.gridSize, game.gridSize, game.windowMiddleX, game.windowMiddleY + 24, game.gridSize, game.gridSize);
                            }
                            gameCanvas.drawImage(characterSprite, anim * game.gridSize, 0, game.gridSize, game.gridSize, game.windowMiddleX, game.windowMiddleY, game.gridSize, game.gridSize);
                            if (player.status.poisoned) {
                                gameCanvas.drawImage(characterSprite, anim * game.gridSize, game.gridSize * 2, game.gridSize, game.gridSize, game.windowMiddleX, game.windowMiddleY, game.gridSize, game.gridSize);
                            }
                            if (player.status.burning) {
                                gameCanvas.drawImage(characterSprite, anim * game.gridSize, game.gridSize * 3, game.gridSize, game.gridSize, game.windowMiddleX, game.windowMiddleY, game.gridSize, game.gridSize);
                            }
                            if (player.status.bleeding) {
                                gameCanvas.drawImage(characterSprite, anim * game.gridSize, game.gridSize, game.gridSize, game.gridSize, game.windowMiddleX, game.windowMiddleY, game.gridSize, game.gridSize);
                            }
                        }

                        //Lighting
                        if (game.updateLighting && !player.died) {
                            if (!canSee) {
                                game.light[x][y] = 0.25 + lightLevel;
                            }
                            lightCanvas.fillStyle = 'rgba(0,0,0,' + game.light[x][y] + ')';
                            lightCanvas.fillRect((x + playerXOffset) * game.gridSize - 8 + game.scroll.x, (y + playerYOffset) * game.gridSize - 8 + game.scroll.y, game.gridSize, game.gridSize);
                        }
                    }
                }
            }
        }

        if (game.updateTiles) {
            if (game.scroll.x > 0) {
                game.scroll.x += 8;
            } else if (game.scroll.x < 0) {
                game.scroll.x -= 8;
            } else if (game.scroll.y > 0) {
                game.scroll.y += 8;
            } else if (game.scroll.y < 0) {
                game.scroll.y -= 8;
            }

            //At the end of the transition? Reset the scroll
            if (game.scroll.x > game.gridSize || game.scroll.x < -game.gridSize) {
                game.scroll.x = 0;
            }
            if (game.scroll.y > game.gridSize || game.scroll.y < -game.gridSize) {
                game.scroll.y = 0;
            }
        }

        //Smooth scrolling reset
        if (game.scroll.x === 0 && game.scroll.y === 0) {
            game.updateTiles = false;
            game.updateMovement = false;
            game.updateLighting = false;
        }
    }

    //Cancel all animations if the option is set
    if (!ui.options.animations) {
        game.texts = [];
        particles = [];
        pickups = [];
        game.fadeFromBlack = 0;
        return false;
    }

    //Fade from black animation set?
    if (game.fadeFromBlack > 0) {
        titleCanvas.clearRect(0, 0, titleCanvas.canvas.width, titleCanvas.canvas.height);
        titleCanvas.fillStyle = 'rgba(0,0,0,' + game.fadeFromBlack + ')';
        titleCanvas.fillRect(0, 0, titleCanvas.canvas.width, titleCanvas.canvas.height);
        game.fadeFromBlack -= 0.01;
    }

    //Only run it if we have to
    if (pickups.length >= 1 || particles.length >= 1 || game.texts.length >= 1) {

        //Reset canvas each time to prevent ghosting/large buffer
        overlayCanvas.clearRect(0, 0, overlayCanvas.canvas.width, overlayCanvas.canvas.height);

        var visible = 0;
        var screenX = game.windowWidth * game.gridSize;
        var screenY = game.windowHeight * game.gridSize;

        //Particles animations
        for (var particle = 0; particle < particles.length; particle++) {
            if (game.scroll.x > 0) {
                particles[particle].x += 8;
            } else if (game.scroll.x < 0) {
                particles[particle].x -= 8;
            } else if (game.scroll.y > 0) {
                particles[particle].y += 8;
            } else if (game.scroll.y < 0) {
                particles[particle].y -= 8;
            }

            if (moved && game.finishScroll && !ui.options.smoothMovement) {
                particles[particle].x -= game.gridSize * player.direction.x;
                particles[particle].y -= game.gridSize * player.direction.y;
            }

            if (particles[particle].times < 14) {
                particles[particle].x += particles[particle].xoff;
                particles[particle].y += particles[particle].yoff;
            }
            particles[particle].times++;
            particles[particle].opacity -= 0.02;
            if (particles[particle].opacity >= 0) {
                visible++;
                //Only render it if it's in your view
                if (particles[particle].x > 0 && particles[particle].x < screenX && particles[particle].y > 0 && particles[particle].y < screenY) {
                    overlayCanvas.fillStyle = "rgba(" + particles[particle].r + ", " + particles[particle].g + ", " + particles[particle].b + ", " + particles[particle].opacity + ")";
                    overlayCanvas.fillRect(particles[particle].x, particles[particle].y, particles[particle].size, particles[particle].size);
                }
            }
        }
        if (visible === 0) {
            particles = [];
        }

        //Item animations
        visible = 0;
        for (var pickup = 0; pickup < pickups.length; pickup++) {
            if (pickups[pickup]) {
                if (pickups[pickup].delay > 0) {
                    pickups[pickup].delay--;
                    continue;
                }
                if (pickup >= 1) {
                    if (pickups[pickup].anim <= pickups[pickup - 1].anim + 16) {
                        pickups[pickup].delay = 16;
                        continue;
                    }
                }
                pickups[pickup].anim = pickups[pickup].anim - 2;
                pickups[pickup].opacity = pickups[pickup].opacity - 0.02;
                if (pickups[pickup].opacity >= 0) {
                    visible++;
                    overlayCanvas.globalAlpha = pickups[pickup].opacity;
                    overlayCanvas.drawImage(itemset, items[pickups[pickup].type].x * game.gridSize, items[pickups[pickup].type].y * game.gridSize, game.gridSize, game.gridSize, game.windowMiddleX, pickups[pickup].anim, game.gridSize, game.gridSize);
                    //Reset the global alpha after
                    overlayCanvas.globalAlpha = 1;
                }
            }
        }
        if (visible === 0) {
            pickups = [];
        }

        //Text animations
        visible = 0;

        for (var txt = 0; txt < game.texts.length; txt++) {
            if (game.texts[txt].delay > 0) {
                game.texts[txt].delay--;
                continue;
            }
            if (txt >= 1) {
                if (game.texts[txt].y <= game.texts[txt - 1].y + 8) {
                    game.texts[txt].delay = 8;
                    continue;
                }
            }
            game.texts[txt].y = game.texts[txt].y - 2;
            game.texts[txt].opacity = game.texts[txt].opacity - 0.02;
            if (game.texts[txt].opacity >= 0) {
                visible++;
                overlayCanvas.font = '22px pressstart';
                overlayCanvas.fillStyle = "rgba(" + game.texts[txt].r + ", " + game.texts[txt].g + ", " + game.texts[txt].b + ", " + game.texts[txt].opacity + ")";
                overlayCanvas.fillText(game.texts[txt].msg, game.texts[txt].x - 22, game.texts[txt].y);
            }
        }
        if (visible === 0) {
            game.texts = [];
        }

    }
    return true;
}

/**
 * Final Item validation and placement will be done here!
 * @param item {object}
 * @param location {string}
 * @param locationId {int/boolean}
 */
function placeItem(item, location, locationId) {

    switch (location) {
        case 'ENV':
            if (locationId || locationId === 0) {
                item = validateItem(item);
                envItems[locationId].container.push(item);
            }
            // What to do with actual envItems....since these are not like the rest.
            break;
        case 'TILE':
            item = validateItem(item);
            if (locationId || locationId === 0) {
                tileItems[locationId].container.push(item);
            } else {
                tileItems.push(item);
                if (!tile[item.x][item.y].tileitems) {
                    tile[item.x][item.y].tileitems = {};
                }
                tile[item.x][item.y].tileitems[tileItems.length - 1] = true;
            }
            break;
        case 'INV':
            game.updateItems = true;
            item = validateItem(item);
            if (item.type === "tatteredmap") {
                if (typeof item.props === 'undefined' || item.props.length === 0) {
                    item.props = [];
                    var waterFail = true;
                    var xTry = 0;
                    var yTry = 0;
                    while (waterFail) {
                        xTry = Math.floor(Math.random() * 400 + 50);
                        yTry = Math.floor(Math.random() * 400 + 50);
                        if (tile[xTry][yTry].type !== "deepwater") {
                            item.props = [xTry, yTry];
                            waterFail = false;
                        }
                    }
                }
            }
            if (locationId || locationId === 0) {
                player.invItems[locationId].container.push(item);
            } else {
                player.invItems.push(item);
            }
            break;
    }

    function validateItem(item) {
        var durability = getDurability(item.type, item.quality, 0, item.props, 'INV');

        if (!item.decay) {
            if (items[item.type].decayable) {
                item.decay = items[item.type].decayable[0] + (durability.maxDur * 10);
            } else {
                item.decay = -1;
            }
        }
        if (!item.quality || item.quality !== '' || item.quality === 'Random') {
            item.quality = durability.quality;
            if (durability.props) {
                item.props = durability.props;
            }
        }
        if (!item.mindur && item.mindur !== 0) {
            item.mindur = durability.maxDur;
            item.maxdur = durability.maxDur;
        }
        if (!item.maxdur) {
            item.maxdur = durability.maxDur;
        }
        if (!item.props || item.props === '') {
            delete item.props;
        }
        if (items[item.type].container && !item.container) {
            item.container = [];
        } else if (!items[item.type].container) {
            delete item.container;
        }
        return item;
    }
}

function placeEnvItem(item) {

    var durability = getDurability(item.type, item.quality, 0, false, 'ENV');

    if (!item.spread) {
        if (environmentals[item.type].spread) {
            item.spread = Math.floor(Math.random() * environmentals[item.type].spread + 1);
        }
    } else {
        item.spread = -1;
    }
    if (!(environmentals[item.type].carve || environmentals[item.type].lit || environmentals[item.type].blockmove || environmentals[item.type].waterSource || environmentals[item.type].trap)) {
        item.graphic = Math.floor(Math.random() * 3);
    } else {
        item.graphic = 0;
    }

    if (environmentals[item.type].decay && !item.decay) {
        item.decay = environmentals[item.type].decay;
    } else {
        if (!item.decay) {
            item.decay = -1;
        }
    }

    if (!item.quality || item.quality !== '' || item.quality === 'Random') {
        item.quality = durability.quality;
        if (durability.props) {
            item.props = durability.props;
        }
    }
    if (!item.mindur && item.mindur !== 0) {
        item.mindur = durability.maxDur;
        item.maxdur = durability.maxDur;
    }
    if (!item.maxdur) {
        item.maxdur = durability.maxDur;
    }

    if (environmentals[item.type].container && !item.container) {
        item.container = [];
    }

    envItems.push(item);
    if (!tile[item.x][item.y].envItemList) {
        tile[item.x][item.y].envItemList = [];
    }
    tile[item.x][item.y].envItemList.push(envItems.length - 1);
}

function itemGet(item, msg) {

    placeItem(item, 'INV', false);

    var len = player.invItems.length - 1;
    var quality = '';
    if (item.quality) {
        quality = " " + item.quality.toLowerCase();
    }

    var group = "";
    if (items[item.type].group) {
        var groupKey = Object.keys(items[item.type].group);
        for (var groupItem = 0; groupItem < groupKey.length; groupItem++) {
            if (items[item.type].group[groupKey[groupItem]]) {
                group += " " + items[item.type].group[groupKey[groupItem]];
            }
        }
    }

    //Is the item low durability? Add the damaged CSS class
    var damaged = "";
    if (item.mindur <= 2) {
        damaged = " damaged";
    }

    ui.$inventory.append('<li data-item="' + item.type + '" data-itemid="' + len + '" class="tooltip item ' + item.type + group + quality + damaged + '"></li>');
    ui.filterInventory();

    if (msg !== "silent") {
        pickups.push({type: item.type, anim: game.windowMiddleY, opacity: 1, delay: 0});
        var msgType = "itemPickup";
        if (msg === "craft") {
            msgType = "itemCrafted";
        } else if (msg === "cook") {
            msgType = "itemCooked";
        }
        ui.message(msgType, 'normal', [items[item.type].name]);
        audio.queueSfx('pickup');
    }
}

/**
 * For Damaging and Killing Monsters.
 * @param monsterId
 * @param hitdamage
 * @param offsetx
 * @param offsety
 * @param bypass
 * @param bypass2
 * @returns {boolean}
 */
function damageMonster(monsterId, hitdamage, offsetx, offsety, bypass, bypass2) {
    game.monsters[monsterId].hp = game.monsters[monsterId].hp - hitdamage;
    var monsterType = game.monsters[monsterId].type;
    var monsterX = game.monsters[monsterId].x;
    var monsterY = game.monsters[monsterId].y;
    if (npcs[monsterType].blood) {
        if (!bypass) {
            createParticles(npcs[monsterType].blood[0], npcs[monsterType].blood[1], npcs[monsterType].blood[2], "", offsetx, offsety);
        }
    } else {
        if (!bypass) {
            createParticles(210, 5, 5, "", offsetx, offsety);
        }
        if (Math.floor(Math.random() * 10 + 1) === 1) {
            placeEnvItem({type: "blood", x: monsterX, y: monsterY, quality: ''});
        }
    }
    if (!bypass) {
        audio.queueSfx('monsterhit');
    }
    if (game.monsters[monsterId].hp <= 0) {
        if (!bypass) {
            ui.message("killedMonster", 'normal', [npcs[monsterType].name]);
        }
        if (!bypass2) {
            addMilestone("hunter");
            addMilestone("extincteur");
        }

        //Loot
        if (game.monsters[monsterId].loot) {
            var monsterLoot = game.monsters[monsterId].loot;
            if (game.monsters[monsterId].aberrant && monsterType === "livingmushroom") {
                monsterLoot = ["redmushroom"];
            }
            for (var loot = 0; loot < monsterLoot.length; loot++) {
                placeItem({type: monsterLoot[loot], x: monsterX, y: monsterY, quality: "Random"}, 'TILE', false);
            }
        }
        if (npcs[monsterType].lootgroup) {
            placeItem({
                type: lootgroup[npcs[monsterType].lootgroup][Math.floor(Math.random() * lootgroup[npcs[monsterType].lootgroup].length)],
                x: monsterX,
                y: monsterY,
                quality: 'Random'
            }, 'TILE', false);
        }
        //Aberrants also drop a random item
        if (game.monsters[monsterId].aberrant) {
            addMilestone("abnormalizer");
            var allItems = Object.keys(items);
            var randomItem = Math.floor(Math.random() * allItems.length);
            placeItem({type: allItems[randomItem], x: monsterX, y: monsterY, quality: "Random"}, 'TILE', false);
        }

        if (monsterType !== "trout" && monsterType !== "blindfish") {
            var corpse = {
                type: monsterType + "_corpse",
                x: monsterX,
                y: monsterY,
                quality: ''
            };
            if (game.monsters[monsterId].aberrant) {
                corpse.aberrant = true;
            }
            placeEnvItem(corpse);
        }
        deleteMonsters(monsterId);
        if (monsterType === "jellycube") {
            spawnMonster("slime", monsterX, monsterY);
        }
        return true;
    }
    return false;
}

/**
 * Heal a monster using one of the healing types.
 * @param monsterId
 * @param healType
 */
function healMonster(monsterId, healType) {

    var regenAmount = Math.floor(game.monsters[monsterId].maxhp / 4);
    if (healType) {
        switch (healType) {
            case 'damageTypeRegen':
                var currentHp = game.monsters[monsterId].hp;
                if ((regenAmount + currentHp) <= game.monsters[monsterId].maxhp) {
                    game.monsters[monsterId].hp += regenAmount;
                } else {
                    game.monsters[monsterId].hp = game.monsters[monsterId].maxhp;
                }
                break;
        }
    }
    ui.textAbove("+" + regenAmount, 66, 3, 61, "target");
    createParticles(66, 3, 61, "", 0, 0);
}

/**
 * Returns an inventory item based on a valid id.
 * @param itemId
 * @param mustBeWeapon set to true if the returned item must be a weapon.
 * @param containerId set to int if located in a container in player.invItems
 * @returns {*}
 */
function getItemFromId(itemId, mustBeWeapon, containerId) {
    var itemType = player.invItems[itemId];

    if (containerId) {
        itemType = player.invItems[containerId].container[itemId];
    }

    var item;

    var getItem = true;

    if (mustBeWeapon) {
        getItem = items[itemType.type].attack;
    }

    if (getItem) {
        if (itemType) {
            item = items[itemType.type];
            item.type = itemType.type;
            item.quality = itemType.quality;
            if (itemType.container) {
                item.container = itemType.container;
            }
            if (itemType.decay) {
                item.decay = itemType.decay;
            }
            item.maxdur = itemType.maxdur;
            item.mindur = itemType.mindur;
            if (itemType.props) {
                item.props = itemType.props;
            }
            return item;
        }
    }
    return false;
}

/**
 * Given an x,y coordinate set this returns the gridSize oriented offset from the player position.
 * Used for particles and textAbove calls.
 * @param locationX
 * @param locationY
 * @returns {{x: number, y: number}}
 */
function getLocationOffsets(locationX, locationY) {
    var offsetX = 0, offsetY = 0;
    if (player.direction.x === 1) {
        offsetX = locationX - player.x;
    } else if (player.direction.x === -1) {
        offsetX = player.x - locationX;
        offsetX = -offsetX;
    } else if (player.direction.y === 1) {
        offsetY = locationY - player.y;
    } else if (player.direction.y === -1) {
        offsetY = player.y - locationY;
        offsetY = -offsetY;
    }
    offsetX = offsetX * game.gridSize;
    offsetY = offsetY * game.gridSize;
    return {
        x: offsetX,
        y: offsetY
    };
}

function move(moveX, moveY) {
    game.delay = 0;
    ui.keyTimer = 0;
    //Close containers on movement
    if (game.containerOpened.containerType === 'ENV') {
        closeContainer();
    }
    var monsterCombat = false;
    var staminaChance = 0;

    if (player.stamina > 0) {
        var checkX = moveX + player.x;
        var checkY = moveY + player.y;

        //Out of map edge?
        if (!tile[checkX] || !tile[checkX][checkY] || player.x === game.mapSize) {
            if (player.x === 0) {
                player.x = game.mapSize - 1;
            } else if (player.y === 0) {
                player.y = game.mapSize - 1;
            } else if (player.x === game.mapSize) {
                player.x = 0;
            } else if (player.y === game.mapSize - 1) {
                player.y = 0;
            }
            return false;
        }


        var realTile = tile[checkX][checkY].type;
        if (realTile !== "darkness") {

            //Monster there?
            if (tile[checkX][checkY].monster) {
                //  var monster = tile[checkX][checkY].monster;
                monsterCombat = true;
                game.delay = 35;
                player.actions.attack();
            }

            //Item/resource tile there?
            if (!monsterCombat) {
                //Check under the player for fire, caves, etc.
                if (!checkUnderPlayer(false, false, checkX, checkY)) {
                    //if there's a cave there, don't continue movement
                    return false;
                }

                if (tiletypes[tile[checkX][checkY].type].gather) {
                    if (!ui.options.autoGather) {
                        return false;
                    } else {
                        player.actions.gather();
                        return false;
                    }
                }

                if (tile[checkX][checkY].envItemList) {
                    for (var envId = 0; envId < tile[checkX][checkY].envItemList.length; envId++) {
                        var envItemId = tile[checkX][checkY].envItemList[envId];

                        if (environmentals[envItems[envItemId].type].locked) {
                            ui.message("locked", 'normal', false);
                            game.delay += 10;
                            return false;
                        }
                        if (environmentals[envItems[envItemId].type].container) {
                            player.actions.openContainer(envItemId, "ENV", false);
                            game.delay += 10;
                            return false;
                        }
                        if (environmentals[envItems[envItemId].type].blockmove) {
                            game.delay += 10;
                            return false;
                        }
                        if (environmentals[envItems[envItemId].type].trap) {
                            var trapChance = Math.floor(Math.random() * 99 + 1);
                            //50% min to set off traps
                            if (player.skills.trapping.percent <= (trapChance - 50)) {
                                var trapDamage = Math.floor(Math.random() * 6 + 2) - Math.floor(player.skills.trapping.percent / 20);
                                if (trapDamage >= 1) {
                                    player.skillGain('trapping', 0.1, false);
                                    ui.message("trapInjured", "bad", false);
                                    ui.textAbove("-" + trapDamage, 255, 0, 0);
                                    audio.queueSfx('hurt');
                                    player.health -= trapDamage;
                                    removeItem(envItemId, 'ENV', false);
                                    break;
                                } else {
                                    ui.message("trapNoDamage", 'normal', false);
                                    removeItem(envItemId, 'ENV', false);
                                    break;
                                }
                            } else {
                                ui.message("trapNoActivation", 'normal', false);
                            }
                        }

                        if (environmentals[envItems[envItemId].type].carve && ui.options.hints && !player.hintseen.corpsecarving) {
                            ui.hintDisplay("corpsecarving");
                        }
                        if (!environmentals[envItems[envItemId].type].carve && ui.options.hints && !player.hintseen.environmentalpickup) {
                            ui.hintDisplay("environmentalpickup");
                        }

                        //Check for plants and crush them underfoot 10% of the time.
                        if (checkForTrampling(envItemId, true)) {
                            break;
                        }
                    }
                }

                //default to walk, only check for swim otherwise.
                var walkType = 'walk';
                if (tiletypes[tile[checkX][checkY].type].water || tiletypes[tile[checkX][checkY].type].shallowWater) {
                    walkType = 'swim';
                }
                // moved this out of SFX to reduce sfx to just playing the picked sound.
                if (game.walkSoundCounter === 0) {
                    game.walkSoundCounter++;
                    audio.queueSfx(walkType);
                } else if (game.walkSoundCounter >= 3) {
                    game.walkSoundCounter = 0;
                } else {
                    game.walkSoundCounter++;
                }

                //Swimming
                if (tiletypes[tile[checkX][checkY].type].shallowWater) {
                    createParticles(tiletypes[realTile].particles[0], tiletypes[realTile].particles[1], tiletypes[realTile].particles[2]);
                }
                if (game.raft) {
                    damageItem(game.raft);
                }
                if (tiletypes[tile[checkX][checkY].type].water && !game.raft) {
                    createParticles(tiletypes[realTile].particles[0], tiletypes[realTile].particles[1], tiletypes[realTile].particles[2]);
                    //Not always a chance for gaining
                    if (Math.floor(Math.random() * 6 + 1) === 1) {
                        player.skillGain("swimming", false, false);
                        //Chance to stop burning pain
                        if (player.status.burning) {
                            player.status.burning = false;
                            ui.message("burningPainEnd", 'normal', false);
                        }
                    }
                    var swimBonus = player.skills.swimming.percent;
                    staminaChance = Math.floor(Math.random() * 99 + 1);
                    if (player.skills.swimming.percent <= staminaChance) {
                        player.stamina -= 1;
                    }
                    game.delay = 25 - (swimBonus / 2);
                    if (game.delay <= 5) {
                        game.delay = 5;
                    }
                } else if (!tiletypes[tile[checkX][checkY].type].water) {
                    game.raft = false;
                }

            }
        } else {
            return false;
        }
    } else {
        player.staminaCheck();
        return false;
    }

    player.checkWeight();
    game.delay += 6;

    player.direction.x = moveX;
    player.direction.y = moveY;
    if (!monsterCombat) {
        player.x = moveX + player.x;
        player.y = moveY + player.y;
    } else {
        passTurn(true);
        return false;
    }

    passTurn(true);
    return true;
}

function checkForTrampling(envId, isPlayer, monsterId) {
    var envItem = envItems[envId].type;
    var chance = Math.floor(Math.random() * 99 + 1);
    if (environmentals[envItem].trample) {
        //trampling the growing things.
        var trampleChance = 0;
        if (isPlayer) {
            var skill = environmentals[envItem].skill;
            if (player.skills[skill].percent > 0) {
                trampleChance = Math.floor(player.skills[skill].percent / 20);
            }
        }
        if ((chance + trampleChance) <= 10) {
            //Don't step on plants dude!
            envItems[envId].spread -= 1;
            if (isPlayer) {
                createParticles(101, 68, 35);
                audio.queueSfx('trample');
                ui.message("trampling", "bad", [environmentals[envItem].name]);
            } else if (isMonsterInView(monsterId)) {
                audio.queueSfx('trample');
            }
            if (envItems[envId].spread <= -1) {
                if (isPlayer) {
                    ui.message("trampled", "bad", [environmentals[envItem].name]);
                } else if (isMonsterInView(monsterId)) {
                    ui.message("monsterTrample", "bad", [npcs[game.monsters[monsterId].type].name, environmentals[envItem].name]);
                }
                removeItem(envId, 'ENV', false);
                return true;
            }
        }
    }
    return false;
}

//Damage equipment
function damageEquip() {
    var equipLength = ui.$equipList.find('li').length;
    var randDmg = Math.floor(Math.random() * equipLength);

    ui.$equipList.find('li').eq(randDmg).each(function () {
        var invClass = $(this).attr("data-item");
        var invId = parseInt($(this).attr("data-itemid"), 10);
        //Make sure it exists, but don't damage equipped containers
        if (invClass && invId && !items[invClass].container) {
            damageItem(invId);
            return true;
        }
        return false;
    });
    return false;
}

//Damage just held items
function damageHeld() {

    var heldIndex = 0;
    var heldItem;
    var invClass;
    var heldCount = ui.$held.find('li').length;
    //Return if no equipped items
    if (heldCount <= 0) {
        return;
    } else if (heldCount >= 2) {
        //Two hands equipped? Randomize them
        heldIndex = Math.floor(Math.random() * 2);
        heldItem = ui.$held.find('li').eq(heldIndex);
        invClass = heldItem.attr("data-item");
        //If it's a light source and you have two items equipped, damage the other one
        if (!items[invClass].attack || items[invClass].onequip && items[invClass].onequip[0] === "Light Source") {
            if (heldIndex === 0) {
                heldIndex = 1;
            } else {
                heldIndex = 0;
            }
            //Switching to a shield? Switch it back to the torch
            heldItem = ui.$held.find('li').eq(heldIndex);
            invClass = heldItem.attr("data-item");
            if (!items[invClass].attack) {
                if (heldIndex === 0) {
                    heldIndex = 1;
                } else {
                    heldIndex = 0;
                }
            }
        }
    }

    heldItem = ui.$held.find('li').eq(heldIndex);
    invClass = heldItem.attr("data-item");
    var invId = parseInt(heldItem.attr("data-itemid"), 10);
    if (items[invClass].durability && items[invClass].attack) {
        damageItem(invId);
    }
}

//Damage an item
function damageItem(invId, containerId) {

    var item;
    //Is it in a container or inventory?
    if (containerId) {
        item = player.invItems[containerId].container[invId];
    } else {
        item = player.invItems[invId];
    }

    if (item.mindur <= 0) {
        ui.message("destroyed", "bad", [items[item.type].name]);
        audio.queueSfx('fail');
        removeItem(invId, 'INV', containerId);
        //Make sure to stop rafting if destroyed
        if (invId === game.raft) {
            game.raft = false;
            ui.message("raftStop", "normal", false);
        }
        return;
    }
    item.mindur -= 1;
    if (item.mindur <= 2) {
        //Only warn on repairable things
        if (items[item.type].durability) {
            ui.message("needRepair", "bad", [items[item.type].name]);
            if (ui.options.hints && !player.hintseen.durability) {
                ui.hintDisplay("durability");
            }
        }

        //Show the item damaged, visually in inventory
        if (containerId) {
            ui.$container.find('.item[data-itemid="' + invId + '"]').addClass('damaged');
        } else {
            ui.$inventoryEquip.find('.item[data-itemid="' + invId + '"]').addClass('damaged');
        }
    }

    //Transfer the damage back
    if (containerId) {
        player.invItems[containerId].container[invId] = item;
    } else {
        player.invItems[invId] = item;
    }

}

//Used to genererate and find appropriate cave entrances
function makeCaveEntrance() {
    if (player.x >= game.mapSize) {
        return false;
    }
    var digLoc = {
        x: player.x + player.direction.x,
        y: player.y + player.direction.y
    };
    var checkLoc = {
        x: 0,
        y: 0
    };
    for (checkLoc.x = digLoc.x - 1; checkLoc.x < digLoc.x + 2; checkLoc.x++) {
        for (checkLoc.y = digLoc.y - 1; checkLoc.y < digLoc.y + 2; checkLoc.y++) {
            if (tile[checkLoc.x][checkLoc.y].type === 'exit') {
                return false;
            }
        }
    }

    //1 in 25 chance to make entrace on gather/dig tile change
    if (Math.floor(Math.random() * 35) === 1) {
        if (tiletypes[tile[player.x + player.direction.x + game.mapSize][player.y + player.direction.y + 1].type].passable && !tile[player.x + player.direction.x + game.mapSize][player.y + player.direction.y + 1].envItemList) {
            changeTile({type: "exit"}, player.x + player.direction.x + game.mapSize, player.y + player.direction.y, false);
            generateExit(player.x + player.direction.x + game.mapSize, player.y + player.direction.y);
            game.delay += 50;
            ui.message("caveEntrance", "good", false);
            return "exit";
        }
    }
    return false;
}

//Used for generating rocks around cave exits
function generateExit(x, y) {
    var coords = [
        [x + 1, y],
        [x - 1, y],
        [x, y - 1],
        [x - 1, y - 1],
        [x + 1, y - 1]
    ];
    for (var i = 0; i < coords.length; i++) {
        if (tile[coords[i][0]][coords[i][1]].type !== "exit" && !tile[coords[i][0]][coords[i][1]].envItemList) {
            changeTile({type: "rock"}, coords[i][0], coords[i][1], false);
        }
    }
}


function stats() {

    if (player.health > player.strength) {
        player.health = player.strength;
    }
    if (player.stamina > player.dexterity) {
        player.stamina = player.dexterity;
    }
    if (player.hunger > player.starvation) {
        player.hunger = player.starvation;
    }
    if (player.thirst > player.dehydration) {
        player.thirst = player.dehydration;
    }

    if (player.stamina <= 8 && ui.options.hints && !player.hintseen.staminareplenishment) {
        ui.hintDisplay("staminareplenishment");
    } else if (player.health <= 8 && ui.options.hints && !player.hintseen.healthreplenishment) {
        ui.hintDisplay("healthreplenishment");
    } else if (player.status.bleeding && ui.options.hints && !player.hintseen.bleeding) {
        ui.hintDisplay("bleeding");
    } else if (player.status.poisoned && ui.options.hints && !player.hintseen.poisoned) {
        ui.hintDisplay("poisoned");
    } else if (player.thirst <= 3 && ui.options.hints && !player.hintseen.dehydration) {
        ui.hintDisplay("dehydration");
    }

    var healthStatPercent = Utilities.roundNumber((player.health / player.strength) * 100, 0);
    ui.$health.html("<p>" + makeString("health", [player.health + "/" + player.strength + " (" + healthStatPercent + "%)"]) + "</p>");
    if (healthStatPercent <= 0) {
        healthStatPercent = 0;
    }
    ui.$health.css('width', healthStatPercent + "%");

    var staminaStatPercent = Utilities.roundNumber((player.stamina / player.dexterity) * 100, 0);
    ui.$stamina.html("<p>" + makeString("stamina", [player.stamina + "/" + player.dexterity + " (" + staminaStatPercent + "%)"]) + "</p>");
    if (staminaStatPercent <= 0) {
        staminaStatPercent = 0;
    }
    ui.$stamina.css('width', staminaStatPercent + "%");

    var hungerStatPercent = Utilities.roundNumber((player.hunger / player.starvation) * 100, 0);
    ui.$hunger.html("<p>" + makeString("hunger", [player.hunger + "/" + player.starvation + " (" + hungerStatPercent + "%)"]) + "</p>");
    if (hungerStatPercent <= 0) {
        hungerStatPercent = 0;
    }
    ui.$hunger.css('width', hungerStatPercent + "%");

    var thirstStatPercent = Utilities.roundNumber((player.thirst / player.dehydration) * 100, 0);
    ui.$thirst.html("<p>" + makeString("thirst", [player.thirst + "/" + player.dehydration + " (" + thirstStatPercent + "%)"]) + "</p>");
    if (thirstStatPercent <= 0) {
        thirstStatPercent = 0;
    }
    ui.$thirst.css('width', thirstStatPercent + "%");

    if (!player.died && player.health <= 0) {
        death();
    }

}

//Setting and adding to milestones and granting rewards, also updating the milestones window
function addMilestone(milestone) {
    if (milestone) {
        if (player.milestoneCount[milestone].amount !== true) {
            player.milestoneCount[milestone].amount++;
            if (player.milestoneCount[milestone].amount >= player.milestones[milestone].amount) {
                if (ui.options.hints && !player.hintseen.milestones) {
                    ui.hintDisplay("milestones");
                }
                player.milestoneCount[milestone].amount = true;
                //Add one of each stat and a 5% from a skill defined in milestones skills list.
                player.statGain("stamina", true);
                player.statGain("hunger", true);
                player.statGain("health", true);
                if (player.milestones[milestone].skills) {
                    player.skillGain(player.milestones[milestone].skills[Math.floor(Math.random() * player.milestones[milestone].skills.length)], 5, true);
                }
                ui.message("milestoneEarned", "good", [player.milestones[milestone].name, player.milestones[milestone].description]);
            }
        }
    }

    if (ui.$milestonesWindow.dialog("isOpen") === true) {
        //Update milestones window
        var milestonesOutput = "";
        var milestoneKey = Object.keys(player.milestones);
        for (var milestonesName = 0; milestonesName < milestoneKey.length; milestonesName++) {
            if (player.milestones[milestoneKey[milestonesName]]) {
                var milestoneCount = player.milestoneCount[milestoneKey[milestonesName]].amount;
                milestonesOutput += "<p class='tooltip' data-milestone='" + milestoneKey[milestonesName] + "'>";
                //Invisible milestone display - don't show name
                if (player.milestoneCount[milestoneKey[milestonesName]].type === "invisible" && milestoneCount !== true) {
                    milestonesOutput += "???";
                } else {
                    milestonesOutput += player.milestones[milestoneKey[milestonesName]].name;
                }
                milestonesOutput += ": ";
                //Hidden milestone display - don't show progress (until you hit 100%)
                if (player.milestoneCount[milestoneKey[milestonesName]].type === "hidden" && milestoneCount !== true) {
                    milestonesOutput += "???";
                } else {
                    //If it's true, then it's full
                    if (milestoneCount === true) {
                        milestoneCount = player.milestones[milestoneKey[milestonesName]].amount;
                    }
                    milestonesOutput += milestoneCount + "/" + player.milestones[milestoneKey[milestonesName]].amount;
                }
                milestonesOutput += "</p>";
            }
        }
        ui.$milestones.html(milestonesOutput);
    }
}

//Will calculate the durability of the item based on the quality of the item, and will also convert Random quality items
//bonusQuality is used for treasure chests to increase chance of remarkable/exceptional/legendary
function getDurability(itemType, quality, bonusQuality, itemProps, location) {
    var checkLocation;

    if (!quality) {
        quality = "";
    }
    var properties = {maxDur: 0, quality: quality};

    if (!bonusQuality) {
        bonusQuality = 0;
    }

    switch (location) {
        case 'ENV':
            checkLocation = environmentals;
            break;
        case 'TILE':
            checkLocation = tiletypes;
            break;
        case 'INV':
            checkLocation = items;
            break;
    }

    if (properties.quality === "Random") {
        var chance = Math.floor(Math.random() * (600 - bonusQuality) + 1);
        //0.25% chance - only allow legendary equippable items
        if (chance <= 1 && checkLocation[itemType].equip && location === 'INV') {
            properties.quality = "legendary";
            //2% chance
        } else if (chance <= 8) {
            properties.quality = "exceptional";
            //10% chance
        } else if (chance <= 40) {
            properties.quality = "Remarkable";
        } else {
            properties.quality = "";
        }
    }

    if (checkLocation[itemType].durability) {
        properties.maxDur = Math.floor(checkLocation[itemType].durability) - Math.floor(Math.random() * 3);
    } else {
        //Everything needs at least some durability
        properties.maxDur = 6 - Math.floor(Math.random() * 3);
    }
    if (properties.quality === "Remarkable") {
        properties.maxDur = Math.floor(properties.maxDur * 1.3) + Math.floor(Math.random() * 3) + 6;
    } else if (properties.quality === "exceptional") {
        properties.maxDur = Math.floor(properties.maxDur * 1.6) + Math.floor(Math.random() * 6) + 12;
    } else if (properties.quality === "legendary") {
        properties.maxDur = Math.floor(properties.maxDur * 1.9) + Math.floor(Math.random() * 9) + 24;
    }

    if (properties.quality === "legendary") {
        if (!itemProps || itemProps.length <= 0) {
            var skillCount = [];
            var skillsKey = Object.keys(player.skills);
            for (var skill = 0; skill < skillsKey.length; skill++) {
                if (player.skills[skillsKey[skill]]) {
                    skillCount.push(skillsKey[skill]);
                }
            }
            var startingSkill = skillCount[Math.floor(skillCount.length * Math.random())];
            properties.props = [startingSkill, Math.floor(Math.random() * 3 + 3)];
        }
    }
    return properties;
}

//Finds unique value in first array ONLY, when compared to second array
function findUnique(a, b) {
    var c = [];
    var ta = a.slice().sort();
    var tb = b.slice().sort();
    var x, found = false;
    for (var i = 0; i < ta.length; i++) {
        x = ta.shift();
        for (var j = tb.length - 1; j >= 0 && !found; j--) {
            if (tb[j] === x) {
                tb.splice(j, 1);
                found = true;
            }
        }
        if (!found) {
            c.push(x);
        }
        found = false;
    }
    return c;
}

//Discover another item to craft
function discoverItem(type, value) {

    var recipeCount = [];
    var discovered = [];
    var itemsKey = Object.keys(items);
    if (type === "skill") {
        var chance = Math.floor(Math.random() * 99 + 1);
        if (chance <= 9) {
            for (var craftItem = 0; craftItem < itemsKey.length; craftItem++) {
                if (items[itemsKey[craftItem]]) {
                    if (items[itemsKey[craftItem]].recipe) {
                        if (items[itemsKey[craftItem]].recipe.skill === value) {
                            recipeCount.push(itemsKey[craftItem]);
                        }
                    }
                }
            }
            discovered = findUnique(recipeCount, player.crafted);
        }
    } else if (type === "scroll") {
        for (var craftable = 0; craftable < itemsKey.length; craftable++) {
            if (items[itemsKey[craftable]]) {
                if (items[itemsKey[craftable]].recipe) {
                    recipeCount.push(itemsKey[craftable]);
                }
            }
        }
        discovered = findUnique(recipeCount, player.crafted);
    }
    if (discovered.length >= 1) {
        var randomRecipe = Math.floor(Math.random() * discovered.length);
        player.crafted.push(discovered[randomRecipe]);
        ui.message("recipeLearned", "good", [items[discovered[randomRecipe]].name]);
        audio.queueSfx('exceptional');
        craftTable();
        return true;
    }
    return false;
}

//Function used to return the quality bonuses for crafting with remarkable/exceptional/legendary items
function getCraftQualityBonus(quality, type) {
    var qualityBonus = 0;

    //Give different values for required items
    if (type === "required") {
        switch (quality) {
            case 'Remarkable':
                qualityBonus += 2;
                break;
            case 'exceptional':
                qualityBonus += 6;
                break;
            case 'legendary':
                qualityBonus += 18;
                break;
        }
    } else {
        switch (quality) {
            case 'Remarkable':
                qualityBonus += 7; //5
                break;
            case 'exceptional':
                qualityBonus += 23; //15
                break;
            case 'legendary':
                qualityBonus += 60; //40
                break;
        }
    }
    return qualityBonus;
}

/**
 * Let's craft some items
 * @param craftType
 */
function craftItem(craftType) {
    var consumes = [];
    var requires = [];
    var consumed = [];
    var outputReq = "";
    var iConsume = 0;
    var iRequired = 0;
    var itemDamage = false;
    var secondBreak = false;
    var qualityBonus = 0;
    var playerInvContent = [];
    var itemDurability = {
        durabilityTotal: 0,
        durabilityAveraged: 0,
        originalMinimum: 0,
        originalMaximum: 0
    };
    var failed = false;

    if (ui.options.hints && !player.hintseen.crafting) {
        ui.hintDisplay("crafting");
    }

    if (items[craftType].recipe.requiredenv) {
        var reqEnv = false;
        if (tile[player.x + player.direction.x][player.y + player.direction.y].envItemList) {
            for (var envId = 0; envId < tile[player.x + player.direction.x][player.y + player.direction.y].envItemList.length; envId++) {
                var envItemId = tile[player.x + player.direction.x][player.y + player.direction.y].envItemList[envId];
                if (envItems[envItemId].type === items[craftType].recipe.requiredenv || environmentals[envItems[envItemId].type].fire === true && items[craftType].recipe.requiredenv === "firesource") {
                    reqEnv = true;
                    break;
                }
            }
        }
        if (!reqEnv) {
            ui.message("itemEnvironmentalRequired", "bad", [environmentals[items[craftType].recipe.requiredenv].name]);
            return false;
        }
    }

    if (tiletypes[tile[player.x][player.y].type].water) {
        ui.message("cannotCraft", 'normal', false);
        return false;
    }

    if (items[craftType].recipe) {
        for (var consumable = 0; consumable < items[craftType].recipe.requires.length; consumable++) {
            if (items[craftType].recipe.requires[consumable]) {
                if (items[craftType].recipe.requires[consumable][2] > 0) {
                    iConsume = items[craftType].recipe.requires[consumable];
                    for (var prop1 = 0; prop1 < iConsume[2]; prop1++) {
                        consumes.push(iConsume[0]);
                    }
                } else {
                    //Required items
                    iRequired = items[craftType].recipe.requires[consumable];
                    for (var prop2 = 0; prop2 < iRequired[1]; prop2++) {
                        requires.push(iRequired[0]);
                    }
                }
            }
        }
    }

    //Grab each item in order of inventory/equipment/quickslot
    ui.$inventory.find('li').each(function () {
        var itemId = $(this).data('itemid');
        playerInvContent.push({
            type: player.invItems[itemId].type,
            id: itemId,
            quality: player.invItems[itemId].quality,
            mindur: player.invItems[itemId].mindur,
            maxdur: player.invItems[itemId].maxdur
        });
    });
    ui.$equip.find('li').each(function () {
        var itemId = $(this).data('itemid');
        playerInvContent.push({
            type: player.invItems[itemId].type,
            id: itemId,
            quality: player.invItems[itemId].quality,
            mindur: player.invItems[itemId].mindur,
            maxdur: player.invItems[itemId].maxdur
        });
    });
    ui.$quickSlot.find('li').each(function () {
        var itemId = $(this).data('itemid');
        playerInvContent.push({
            type: player.invItems[itemId].type,
            id: itemId,
            quality: player.invItems[itemId].quality,
            mindur: player.invItems[itemId].mindur,
            maxdur: player.invItems[itemId].maxdur
        });
    });

    // get the index of the item in player.invItems and add it to the consumed list.
    // then remove from consumes so we don't take another of the same away.
    for (var item = 0; item < playerInvContent.length; item++) {
        //Break down required items
        if (!itemDamage) {
            for (var requiredLeft = 0; requiredLeft < requires.length; requiredLeft++) {
                if (requires[requiredLeft] === playerInvContent[item].type) {
                    qualityBonus += getCraftQualityBonus(playerInvContent[item].quality, "required");
                    damageItem(playerInvContent[item].id);
                    itemDamage = true;
                    break;
                }
                //If it's a grouped required item
                if (items[playerInvContent[item].type].group) {
                    for (var groupType = 0; groupType < items[playerInvContent[item].type].group.length; groupType++) {
                        if (items[playerInvContent[item].type].group[groupType]) {
                            if (items[playerInvContent[item].type].group[groupType] === requires[requiredLeft]) {
                                qualityBonus += getCraftQualityBonus(playerInvContent[item].quality, "required");
                                damageItem(playerInvContent[item].id);
                                itemDamage = true;
                                secondBreak = true;
                                break;
                            }
                        }
                    }
                }
                if (secondBreak) {
                    break;
                }
            }
        }
        if (consumes.length < 1) {
            continue;
        }
        secondBreak = false;
        for (var left = consumes.length - 1; left >= 0; left--) {
            if (consumes[left] === playerInvContent[item].type) {
                qualityBonus += getCraftQualityBonus(playerInvContent[item].quality, false);
                consumed.push(playerInvContent[item]);
                consumes.splice(left, 1);
                break;
            }
            //If it's a grouped consumed item
            if (items[playerInvContent[item].type].group) {
                for (var iGroup = 0; iGroup < items[playerInvContent[item].type].group.length; iGroup++) {
                    if (items[playerInvContent[item].type].group[iGroup]) {
                        if (items[playerInvContent[item].type].group[iGroup] === consumes[left]) {
                            qualityBonus += getCraftQualityBonus(playerInvContent[item].quality, false);
                            consumed.push(playerInvContent[item]);
                            consumes.splice(left, 1);
                            secondBreak = true;
                            break;
                        }
                    }
                }
            }
            if (secondBreak) {
                break;
            }

        }
    }

    if (consumes.length < 1) {

        var chance = Math.floor(Math.random() * 99 + 1);
        var skillChance = 0;
        switch (items[craftType].recipe.level) {
            //The recipe's level is subtracted from the chance to successfully crafted the item when weighted against the player's skill level
            case "simple":
                skillChance = 0;
                break;
            case "intermediate":
                skillChance = 10;
                break;
            case "advanced":
                skillChance = 20;
                break;
            case "expert":
                skillChance = 40;
                break;
        }

        audio.queueSfx('craft');
        player.skillGain(items[craftType].recipe.skill, false, false);
        var i = 0;
        for (var req = 0; req < items[craftType].recipe.requires.length; req++) {
            if (items[craftType].recipe.requires[req]) {

                if (i > 0) {
                    outputReq += ", ";
                }
                outputReq += "x" + items[craftType].recipe.requires[req][1] + " " + items[craftType].recipe.requires[req][0];
                i++;
            }
        }

        var craftMsg = "制作";
        if (items[craftType].recipe.skill === "cooking") {
            craftMsg = "烹饪";
        }

        if (player.skills[items[craftType].recipe.skill].percent >= (skillChance + chance - (75 + qualityBonus))) {

            //Give the player a bonus on the decay of items based on skill
            var decayBonus = "";
            if (items[craftType].decayable) {
                decayBonus = items[craftType].decayable[0] + Math.floor(player.skills[items[craftType].recipe.skill].percent * 10) + (qualityBonus * 10);
            }

            //Chance of remarkable/exceptional/legendary - harder check
            var quality = '';

            for (var durabilityCount = 0; durabilityCount < consumed.length; durabilityCount++) {
                if (items[consumed[durabilityCount].type].returnOnUse === 'glassbottle' || items[consumed[durabilityCount].type].returnOnUse === 'waterskin') {
                    itemDurability.originalMinimum = consumed[durabilityCount].mindur;
                    itemDurability.originalMaximum = consumed[durabilityCount].maxdur;
                    break;
                }
                itemDurability.durabilityTotal += Math.round(consumed[durabilityCount].mindur / consumed[durabilityCount].maxdur * 100);
            }
            itemDurability.durabilityAveraged = itemDurability.durabilityTotal / consumed.length;

            if (player.skills[items[craftType].recipe.skill].percent >= (skillChance + chance - qualityBonus)) {
                //Legendary equipment
                if (items[craftType].equip && chance <= 3 + qualityBonus) {
                    quality = "legendary";
                    audio.queueSfx('exceptional');
                } else if (chance <= 20 + qualityBonus) {
                    quality = "exceptional";
                    audio.queueSfx('exceptional');
                } else if (chance <= 50 + qualityBonus) {
                    quality = "Remarkable";
                }
            }
            var durability = getDurability(craftType, quality, false, false, 'INV');
            var maxDur = durability.maxDur;
            var minDur = Math.round(durability.maxDur * (itemDurability.durabilityAveraged / 100));
            if (itemDurability.originalMinimum > 0) {
                minDur = itemDurability.originalMinimum;
                maxDur = itemDurability.originalMaximum;
            }
            if (minDur <= 0) {
                minDur = 1;
            }

            addMilestone("crafter");
            if (items[craftType].recipe.skill === "cooking") {
                addMilestone("chef");
            }
            itemGet({type: craftType, decay: decayBonus, quality: quality, mindur: minDur, maxdur: maxDur}, craftMsg);
            //Reverse loop to not mess up index
            // For each item index in consumed remove that item from the players inventory.

            for (var con = consumed.length - 1; con >= 0; con--) {
                removeItem(consumed[con].id, 'INV', false);
            }

            discoverItem("skill", items[craftType].recipe.skill);

        } else {
            ui.message("craftFail", "bad", [craftMsg, items[craftType].name]);
            audio.queueSfx('fail');
            //Damage consumed items on fail
            for (var con2 = consumed.length - 1; con2 >= 0; con2--) {
                damageItem(consumed[con2].id);
            }
            failed = true;
        }

        var staminaHit = Math.floor(items[craftType].weight);
        if (staminaHit <= 0) {
            staminaHit = 1;
        }
        player.stamina -= staminaHit;
        game.delay += 10;
        passTurn(true);

        return !failed;
    }
}

//Let's build our crafting table (also update weight since we are counting items anyways)
function craftTable() {

    player.weight = 0;
    var output = "";
    var coutput = "";
    var doubled = false;

    var playerInvContent = [];
    for (var playerInvItem = 0; playerInvItem < player.invItems.length; playerInvItem++) {
        if (player.invItems[playerInvItem]) {
            playerInvContent.push({type: player.invItems[playerInvItem].type});
        }
    }
    var itemKey = Object.keys(items);
    for (var itemRecipe = 0; itemRecipe < itemKey.length; itemRecipe++) {
        if (items[itemKey[itemRecipe]]) {
            var requirements = [];
            if (items[itemKey[itemRecipe]].recipe) {
                for (var req = 0; req < items[itemKey[itemRecipe]].recipe.requires.length; req++) {
                    var iRequire = items[itemKey[itemRecipe]].recipe.requires[req];
                    for (var l = 0; l < iRequire[1]; l++) {
                        requirements.push(iRequire[0]);
                    }
                }
                var playerInvContentLength = playerInvContent.length;
                for (var item1 = 0; item1 < playerInvContentLength; item1++) {
                    if (requirements.length < 1) {
                        continue;
                    }
                    var secondBreak = false;
                    for (var left = requirements.length - 1; left >= 0; left--) {
                        if (requirements[left] === playerInvContent[item1].type) {
                            requirements.splice(left, 1);
                            break;
                        }
                        //If it's a grouped required item
                        if (items[playerInvContent[item1].type].group) {
                            for (var groupType = 0; groupType < items[playerInvContent[item1].type].group.length; groupType++) {
                                if (items[playerInvContent[item1].type].group[groupType]) {
                                    if (items[playerInvContent[item1].type].group[groupType] === requirements[left]) {
                                        requirements.splice(left, 1);
                                        secondBreak = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (secondBreak) {
                            break;
                        }
                    }
                }

                doubled = false;
                if (requirements.length < 1) {
                    //Push the item to your crafted list
                    for (var craft = 0; craft < player.crafted.length; craft++) {
                        if (player.crafted[craft]) {
                            if (player.crafted[craft] === itemKey[itemRecipe]) {
                                doubled = true;
                                break;
                            }
                        }
                    }
                    if (!doubled) {
                        player.crafted.push(itemKey[itemRecipe]);
                    }
                    output += '<div data-item="' + itemKey[itemRecipe] + '" class="tooltip item craft ' + itemKey[itemRecipe] + '"></div>';
                } else {
                    for (var c = 0; c < player.crafted.length; c++) {
                        if (player.crafted[c]) {
                            if (player.crafted[c] === itemKey[itemRecipe]) {
                                coutput += '<div data-item="' + itemKey[itemRecipe] + '" class="tooltip item crafted ' + itemKey[itemRecipe] + '"></div>';
                            }
                        }
                    }
                }
            }
        }
    }

    //Let's change the DOM only once
    ui.$craft.html(output + coutput);
    ui.filterCrafts();

    var weightReduction = 0;
    //Calculate the players weight and update the global "weight" value
    for (var item = 0; item < player.invItems.length; item++) {
        if (player.invItems[item]) {
            if (items[player.invItems[item].type].weight) {
                player.weight += Utilities.roundNumber(items[player.invItems[item].type].weight, 1);
                //Check inside bags too!
                if (player.invItems[item].container) {
                    for (var containerItem = 0; containerItem < player.invItems[item].container.length; containerItem++) {
                        if (player.invItems[item].container[containerItem]) {
                            //Add in a bonus weight reduction of 1.25
                            weightReduction = Utilities.roundNumber(items[player.invItems[item].container[containerItem].type].weight * 0.25, 1);
                            player.weight += Utilities.roundNumber(items[player.invItems[item].container[containerItem].type].weight, 1) - weightReduction;
                        }
                    }
                }
            }
        }
    }

    var newWeight = player.strength + 15;
    var carryingWeight = Utilities.roundNumber(player.weight, 1);
    if (carryingWeight >= newWeight) {
        ui.$weight.addClass('bad');
    } else {
        ui.$weight.removeClass('bad');
    }
    ui.$weight.html(carryingWeight + "/" + newWeight);

}

function createParticles(r, g, b, type, offsetX, offsetY, times) {

    var x = game.windowMiddleX + game.halfGridSize;
    var y = game.windowMiddleY + game.halfGridSize;

    if (!offsetX) {
        offsetX = 0;
    }
    if (!offsetY) {
        offsetY = 0;
    }

    if (offsetX === 0 && offsetY === 0) {
        if (!type) {
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

    for (var i = 1; i <= 5; i++) {
        //Let's modify the color a bit for variation
        var colorMod = Math.floor(Math.random() * 50 - 25);
        var red = r + colorMod;
        var green = g + colorMod;
        var blue = b + colorMod;
        //Don't go over hex limits
        if (red >= 255) {
            red = 255;
        }
        if (green >= 255) {
            green = 255;
        }
        if (blue >= 255) {
            blue = 255;
        }
        if (red <= 0) {
            red = 0;
        }
        if (green <= 0) {
            green = 0;
        }
        if (blue <= 0) {
            blue = 0;
        }

        if (!times) {
            times = 1;
        }

        for (var particleTimes = 0; particleTimes < times; particleTimes++) {
            particles.push({
                x: x + offsetX,
                y: y + offsetY,
                times: 1,
                r: red,
                g: green,
                b: blue,
                xoff: Math.floor(8 * Math.random() - 4),
                yoff: Math.floor(8 * Math.random() - 4),
                size: Math.floor(Math.random() * 6 + 2),
                opacity: 1
            });
        }

    }
}

function spawnMonster(monsterType, x, y, bypass, forceAberrant) {
    var aberrantChance = 0;
    //Don't spawn on player/monster - make sure it's a tile
    var blockMove = false;
    if (tile[x][y].envItemList) {
        var item = envItems[tile[x][y].envItemList[tile[x][y].envItemList.length - 1]];
        if (environmentals[item.type] && environmentals[item.type].blockmove) {
            blockMove = true;
        }
        if (environmentals[item.type] && environmentals[item.type].fire && npcs[monsterType].name !== 'A Fire Elemental') {
            //Note: the fire elemental check should be changed to a flag at some point so we can have other monsters that can spawn in fire.
            blockMove = true;
        }
    }

    if (x === player.x && y === player.y || tile[x][y].monster || !tile[x] || !tile[x][y] || blockMove && !bypass) {
        return false;
    }

    var monsterPool = [];

    //Special cases where monster pools aren't dependant on talent alone
    if (monsterType === "guardians") {
        aberrantChance = 15;
        monsterPool = ["slime", "giantspider", "giantrat", "bear", "greywolf", "jellycube", "imp", "fireelemental", "skeleton", "pirateghost", "hobgoblin", "kraken", "harpy"];
    } else if (monsterType === "water") {
        if (x > game.mapSize) {
            monsterPool = ["blindfish", "blindfish", "kraken"];
        } else {
            if (player.talent >= 28000) {
                monsterPool = ["trout", "trout", "trout", "shark", "shark", "kraken"];
            } else {
                monsterPool = ["trout", "trout", "trout", "shark"];
            }
        }
    }

    //Normal spawning
    if (!monsterType) {
        //In caves
        if (x > game.mapSize) {
            aberrantChance = 3;
            monsterPool = ["livingrock", "zombie", "imp", "giantspider", "vampirebat", "rat", "giantrat", "skeleton", "pirateghost", "harpy"];
            //Night time baddies
        } else if (player.light >= 0.8) {
            aberrantChance = 3;
            monsterPool = ["vampirebat", "zombie", "giantspider", "giantrat"];
        } else {
            aberrantChance = 1;
            var bracketTalent = 0;
            //Create a monster spawning pool based on your talent, combine multiple brackets together
            var brackets = Object.keys(game.monsterSpawnerPool);
            for (var i = 0, len = brackets.length; i < len; i++) {
                bracketTalent = parseInt(brackets[i], 10);
                if (player.talent >= bracketTalent) {
                    monsterPool = monsterPool.concat(game.monsterSpawnerPool[brackets[i]]);
                }
            }
        }
    }

    if (monsterPool.length > 0) {
        monsterType = monsterPool[Math.floor(Math.random() * monsterPool.length)];
    }

    //No sharks in caves
    if (monsterType === "shark" && x >= game.mapSize) {
        return false;
    }

    //Is that monster allowed on the tile?
    if (!bypass && !npcs[monsterType].spawnTiles[tile[x][y].type]) {
        return false;
    }

    var monsterHP = Math.floor(Math.random() * (npcs[monsterType].maxhp - npcs[monsterType].minhp) + npcs[monsterType].minhp);

    //Aberrant spawning
    aberrantChance = 100 - aberrantChance;
    if (Math.floor(Math.random() * aberrantChance) === 1 || forceAberrant) {
        var monsterAI = npcs[monsterType].ai;
        if (monsterAI === "neutral" || monsterAI === "scared") {
            monsterAI = "hostile";
        }
        game.monsters.push({
            type: monsterType,
            x: x,
            y: y,
            hp: monsterHP * 2,
            maxhp: monsterHP * 2,
            loot: npcs[monsterType].loot,
            ai: monsterAI,
            anim: false,
            aberrant: true
        });
    } else {
        game.monsters.push({
            type: monsterType,
            x: x,
            y: y,
            hp: monsterHP,
            maxhp: monsterHP,
            loot: npcs[monsterType].loot,
            ai: npcs[monsterType].ai,
            anim: false
        });
    }
    tile[x][y].monster = game.monsters.length - 1;
    return true;

}

function dynamicGrow() {
    var monsterX, monsterY;
    var spreadChance = 0;
    var envItemsLength = envItems.length;
    for (var i = 0; i < envItemsLength; i++) {
        if (envItems[i] !== undefined && envItems[i] !== null) {
            //Can it actually grow?
            if (envItems[i].spread >= 1) {
                if (envItems[i].type === "fire") {
                    spreadChance = Math.floor(Math.random() * 2 + 1);
                    //Destroy items in fire
                    var burnChance = Math.floor(Math.random() * 2 + 1);
                    if (burnChance === 1) {
                        if (tile[envItems[i].x][envItems[i].y].tileitems) {
                            var tileItemsKey = Object.keys(tile[envItems[i].x][envItems[i].y].tileitems);
                            for (var i3 = 0; i3 < tileItemsKey.length; i3++) {
                                if (tile[envItems[i].x][envItems[i].y].tileitems[tileItemsKey[i3]]) {
                                    //Drop their onBurn items, or sometimes ash if they don't have one
                                    if (items[tileItems[tileItemsKey[i3]].type].onBurn) {
                                        placeItem({
                                            type: items[tileItems[tileItemsKey[i3]].type].onBurn,
                                            x: envItems[i].x,
                                            y: envItems[i].y,
                                            quality: 'Random'
                                        }, 'TILE', false);
                                    } else {
                                        var ashChance = Math.floor(Math.random() * 3 + 1);
                                        if (ashChance === 1) {
                                            placeItem({
                                                type: "ashpile",
                                                x: envItems[i].x,
                                                y: envItems[i].y,
                                                quality: 'Random'
                                            }, 'TILE', false);
                                        }
                                    }
                                    removeItem(tileItemsKey[i3], 'TILE', false);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    spreadChance = Math.floor(Math.random() * 60 + 1);
                }
                if (spreadChance === 1) {
                    if (envItems[i].x < game.mapSize && envItems[i].y < game.mapSize || envItems[i].x > game.mapSize && envItems[i].y > game.mapSize || environmentals[envItems[i].type].cavegrow) {
                        var randomX, randomY;
                        if (envItems[i].type === "fire") {
                            randomX = Math.floor(Math.random() * 2) - 1;
                            randomY = Math.floor(Math.random() * 2) - 1;
                        } else {
                            randomX = Math.floor(Math.random() * 6) - 3;
                            randomY = Math.floor(Math.random() * 6) - 3;
                        }
                        //Living mushroom spawns, 5% chance - only active when mushroom is growing/fertile
                        if (envItems[i].type === "mushrooms_ground" || envItems[i].type === "redmushroom_ground") {
                            if (Math.floor(Math.random() * 20 + 1) === 1) {
                                monsterX = Math.floor(3 + envItems[i].x - 1);
                                monsterY = Math.floor(3 + envItems[i].y - 1);
                                spawnMonster("livingmushroom", monsterX, monsterY);
                            }
                        }
                        if (tile[envItems[i].x + randomX] && tile[envItems[i].x + randomX][envItems[i].y + randomY]) {
                            if (environmentals[envItems[i].type].allowedtiles) {
                                var allowedTilesLength = environmentals[envItems[i].type].allowedtiles.length;
                                for (var a = 0; a < allowedTilesLength; a++) {
                                    if (tile[envItems[i].x + randomX][envItems[i].y + randomY].type === environmentals[envItems[i].type].allowedtiles[a] && !tile[envItems[i].x + randomX][envItems[i].y + randomY].envItemList) {
                                        placeEnvItem({
                                            type: envItems[i].type,
                                            x: envItems[i].x + randomX,
                                            y: envItems[i].y + randomY,
                                            spread: Math.max(Math.floor(Math.random() * 10) - 8),
                                            quality: 'Random'
                                        });
                                        envItems[i].spread--;
                                    }
                                }
                            } else if (tiletypes[tile[envItems[i].x + randomX][envItems[i].y + randomY].type].flammable && !tile[envItems[i].x + randomX][envItems[i].y + randomY].envItemList) {
                                placeEnvItem({
                                    type: envItems[i].type,
                                    x: envItems[i].x + randomX,
                                    y: envItems[i].y + randomY,
                                    spread: Math.max(Math.floor(Math.random() * 10) - 8),
                                    quality: 'Random'
                                });
                                envItems[i].spread--;
                            }
                        }
                    }
                }
                //Monster Idol spawning
            } else if (envItems[i].type === "monsteridol") {
                //16.666% chance
                if (Math.floor(Math.random() * 6 + 1) === 1) {
                    monsterX = Math.floor(10 + envItems[i].x - 5);
                    monsterY = Math.floor(10 + envItems[i].y - 5);
                    if (spawnMonster("", monsterX, monsterY)) {
                        if (envItems[i].x + game.windowHalfWidth >= player.x && envItems[i].y + game.windowHalfHeight >= player.y && envItems[i].y - game.windowHalfHeight <= player.y && envItems[i].x - game.windowHalfWidth <= player.x) {
                            ui.message("monsterIdol", 'normal', false);
                        }
                    }
                }
            }
            //Item decaying
            environmentalDecay(i);
        }
    }
}

/**
 * Initial check for containers inside envItems. And then looking for decayables.
 * @param envId
 */
function environmentalDecay(envId) {
    /* decay items in environmental containers */
    if (envItems[envId].container && envItems[envId].container.length > 0) {
        decayItemsInContainer(envId, envItems[envId].container, "ENV");
    }
    //Other decay types
    if (envItems[envId].decay) {
        if (envItems[envId].decay >= 1) {
            if (environmentals[envItems[envId].type].waterSource) {
                //Water stills
                if (envItems[envId].type === "solarstill_set" && player.light <= 0.5) {
                    envItems[envId].decay--;
                    if (envItems[envId].decay <= 0) {
                        envItems[envId].decay = -2;
                    }
                }
            } else {
                envItems[envId].decay--;
            }
        }
        if (envItems[envId].decay === 0 && !environmentals[envItems[envId].type].waterSource) {
            //Always leave burned on fire decay
            if (envItems[envId].type === "fire") {
                //Add some decay to the fire if there's still some combustibles under it
                var decayBonus;
                if (tile[envItems[envId].x][envItems[envId].y].tileitems) {
                    var tileItemKey = Object.keys(tile[envItems[envId].x][envItems[envId].y].tileitems);
                    for (var tileItemId = 0; tileItemId < tileItemKey.length; tileItemId++) {
                        if (tile[envItems[envId].x][envItems[envId].y].tileitems[tileItemKey[tileItemId]]) {
                            //Check for combustibles, but skip charcoal, so the player can collect it before it would turn to ash
                            if (items[tileItems[tileItemKey[tileItemId]].type].onUse && items[tileItems[tileItemKey[tileItemId]].type].onUse.stokeFire && tileItems[tileItemKey[tileItemId]].type !== "charcoal") {
                                decayBonus = 10;
                                break;
                            }
                        }
                    }
                }
                if (decayBonus) {
                    envItems[envId].decay = decayBonus;
                    return;
                }
                changeTile({type: "ash"}, envItems[envId].x, envItems[envId].y, false);
                //Chance of spawning charcoal
                if (Math.floor(Math.random() * 3 + 1) === 1) {
                    placeItem({
                        type: "charcoal",
                        x: envItems[envId].x,
                        y: envItems[envId].y,
                        quality: 'Random'
                    }, 'TILE', false);
                }
            } else if (envItems[envId].type === "sapling_ground") {
                changeTile({type: "forest"}, envItems[envId].x, envItems[envId].y, false);
            } else if (envItems[envId].type === "grassseeds_ground") {
                changeTile({type: "grass"}, envItems[envId].x, envItems[envId].y, false);
            } else if (envItems[envId].type === "stonewaterstill_lit") {
                placeEnvItem({
                    type: "stonewaterstill_unlit",
                    x: envItems[envId].x,
                    y: envItems[envId].y,
                    spread: -1,
                    decay: -2,
                    mindur: envItems[envId].mindur,
                    maxdur: envItems[envId].maxdur,
                    quality: envItems[envId].quality
                });
            }
            //Lit campfire decay
            if (environmentals[envItems[envId].type].revert && envItems[envId].type !== 'stonewaterstill_lit') {
                placeEnvItem({
                    type: environmentals[envItems[envId].type].revert,
                    x: envItems[envId].x,
                    y: envItems[envId].y,
                    mindur: envItems[envId].mindur,
                    maxdur: envItems[envId].maxdur,
                    quality: envItems[envId].quality
                });
            }
            removeItem(envId, 'ENV', false);
        }
    }
}

/**
 * Called to deal with decaying items inside containers.
 * @param containerId
 * @param decayContainer
 * @param decayType
 */
function decayItemsInContainer(containerId, decayContainer, decayType) {
    for (var containerItem = 0; containerItem < decayContainer.length; containerItem++) {
        if (decayContainer[containerItem] !== undefined && decayContainer[containerItem] !== null) {
            if (decayContainer[containerItem].decay > 0) {
                decayContainer[containerItem].decay--;
            }
            if (decayContainer[containerItem].decay === 0) {
                var containerItemType = decayContainer[containerItem].type;
                if (items[containerItemType].decayable && items[containerItemType].decayable[1]) {
                    // Add new item to decayContainer and remove old item.
                    placeItem({type: items[containerItemType].decayable[1]}, decayType, containerId);
                    //Update container dialog if decayed in opened container
                    if (game.containerOpened.id === containerId) {
                        player.actions.openContainer(containerId, 'INV', true);
                    }
                }
                removeItem(containerItem, decayType, containerId);
            }
        }
    }
}

function makeMiniMap(offsetX, offsetY, cartography) {
    //19 centers the view around the player/offset
    var mapX = player.x - 19;
    var mapY = player.y - 19;
    if (offsetX) {
        mapX = offsetX - 19;
    }
    if (offsetY) {
        mapY = offsetY - 19;
    }

    if (mapX <= 0) {
        mapX = 0;
    }
    if (mapY <= 0) {
        mapY = 0;
    }

    miniMapCanvas.drawImage(mapCanvas.canvas, mapX, mapY, 38, 38, 0, 0, 228, 228);

    var color = "#ff0000";

    if (cartography) {
        color = "#00ff00"; //Blue center for treasure
        var chance;
        miniMapCanvas.fillStyle = "#000000";
        for (var x = 0; x < 38; x++) {
            for (var y = 0; y < 38; y++) {
                chance = Math.floor(Math.random() * 99 + 1);
                //The lower your skill, the more black boxes
                if (player.skills.cartography.percent <= (chance - 50)) {
                    miniMapCanvas.fillRect(x * 6, y * 6, 6, 6);
                }
            }
        }
    }

    //Show your character in the middle
    if (!offsetX && !offsetY || cartography) {
        miniMapCanvas.fillStyle = color;
        miniMapCanvas.fillRect(114, 114, 6, 6);
    }

}

function lighting() {
    //Lighting

    var radius = 8;
    game.light = [];
    var tileX, tileY;
    var worldX, worldY;
    var distX, distY;
    var lightLevel = player.light;
    var lightTemp;

    //Cave lighting
    if (player.x > game.mapSize) {
        lightLevel = 0.95;
    }

    //Apply lightbonus if greater than 5
    var fullRadius = 5;
    if (player.lightbonus > fullRadius) {
        fullRadius = player.lightbonus;
    }
    //FullRadius becomes 13
    fullRadius += radius;
    var fireRadius = 0;

    //For all points in the window or 13 tiles outside it in all directions
    //Declare light[x][y].
    //Ceil() is needed to avoid out of bounds indexing later
    for (var x = -fullRadius; x <= Math.ceil(game.windowWidth) + fullRadius; x++) {
        for (var y = -fullRadius; y <= Math.ceil(game.windowHeight) + fullRadius; y++) {
            game.light[x] = game.light[x] || [];
            game.light[x][y] = lightLevel;
        }
    }

    //Represent the corner of the window in absolute coordinates
    var playerX = player.x - game.windowHalfWidth;
    var playerY = player.y - game.windowHalfHeight;

    //Ror all coords in the window plus a buffer of 8 (7?)
    for (var x2 = -radius; x2 < game.windowWidth + radius; x2++) {
        for (var y2 = -radius; y2 < game.windowHeight + radius; y2++) {
            //The absolute coordinate of the point (will be a float)
            worldX = x2 + playerX;
            worldY = y2 + playerY;
            //Check if that tile exist
            if (tile[worldX] && tile[worldX][worldY]) {
                if (tile[worldX][worldY].envItemList) {
                    //For every item in that tile
                    for (var envItem = 0; envItem < tile[worldX][worldY].envItemList.length; envItem++) {
                        var envId = tile[worldX][worldY].envItemList[envItem];
                        //If it is fire item
                        if (envItems[envId] && environmentals[envItems[envId].type].fire) {
                            //Define fire radius as 7, 8 or 9 (flicker)
                            fireRadius = Math.floor(Math.random() * 3 + 7);
                            for (var x3 = -fireRadius; x3 <= fireRadius; x3++) {
                                for (var y3 = -fireRadius; y3 <= fireRadius; y3++) {
                                    if (x3 * x3 + y3 * y3 <= 3 * fireRadius) {
                                        lightTemp = lightLevel / 2.25 + Math.sqrt(x3 * x3 + y3 * y3) / fireRadius;
                                        //The window coordinates of the tile that is being lit
                                        tileX = x2 + x3;
                                        tileY = y2 + y3;
                                        if (lightTemp <= game.light[tileX][tileY]) {
                                            game.light[tileX][tileY] = lightTemp;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //If it is a fire elemental
                if (tile[worldX][worldY].monster) {
                    var monster = tile[worldX][worldY].monster;
                    if (game.monsters[monster] && game.monsters[monster].type === "fireelemental") {
                        //Fire radius is 5 or 6
                        fireRadius = Math.floor(Math.random() * 2 + 5);
                        for (var x4 = -fireRadius; x4 <= fireRadius; x4++) {
                            for (var y4 = -fireRadius; y4 <= fireRadius; y4++) {
                                if (x4 * x4 + y4 * y4 <= 3 * fireRadius) {
                                    lightTemp = lightLevel / 2.25 + Math.sqrt(x4 * x4 + y4 * y4) / fireRadius;
                                    //The window coordinates of the tile that is being lit
                                    tileX = x2 + x4;
                                    tileY = y2 + y4;
                                    if (lightTemp <= game.light[tileX][tileY]) {
                                        game.light[tileX][tileY] = lightTemp;
                                    }
                                }
                            }
                        }
                    }
                }


                //Cave radius
                if (tile[worldX][worldY].type === "exit" && player.x > game.mapSize) {
                    fireRadius = 5;
                    for (var x5 = -fireRadius; x5 <= fireRadius; x5++) {
                        for (var y5 = -fireRadius; y5 <= fireRadius; y5++) {
                            if (x5 * x5 + y5 * y5 <= 3 * fireRadius) {
                                lightTemp = lightLevel / 2.25 + Math.sqrt(x5 * x5 + y5 * y5) / fireRadius;
                                //The window coordinates of the tile that is being lit
                                tileX = x2 + x5;
                                tileY = y2 + y5;
                                if (lightTemp <= game.light[tileX][tileY]) {
                                    game.light[tileX][tileY] = lightTemp + (player.light / 4);
                                }
                            }
                        }
                    }
                }
            }

            //Do you have a light source?
            if (player.lightbonus > 0) {
                distX = x2 - game.windowHalfWidth;
                distY = y2 - game.windowHalfHeight;
                //Used to be 3 * torch radius
                if (distX * distX + distY * distY <= player.lightbonus * player.lightbonus) {
                    lightTemp = lightLevel / 1.75 + Math.sqrt(distX * distX + distY * distY) / player.lightbonus;
                    if (lightTemp <= game.light[x2][y2]) {
                        game.light[x2][y2] = lightTemp;
                    }
                }
            }
        }
    }

    game.updateLighting = true;

}

/**
 *
 * @param monsterId int
 * @returns {boolean}
 */
function isMonsterInView(monsterId) {
    return game.monsters[monsterId].x + game.windowHalfWidth >= player.x && game.monsters[monsterId].y + game.windowHalfHeight >= player.y && game.monsters[monsterId].y - game.windowHalfHeight <= player.y && game.monsters[monsterId].x - game.windowHalfWidth <= player.x;
}

/**
 * Change the current tile
 * @param newTile object
 * @param changeX int
 * @param changeY int
 * @param stackTiles boolean
 */
function changeTile(newTile, changeX, changeY, stackTiles) {
    if (newTile.type) {
        var newTileGFX = Math.floor(Math.random() * 3);

        //Don't alter the tile number for tile switches
        if (tiletypes[tile[changeX][changeY].type] && tiletypes[tile[changeX][changeY].type].noGFXSwitch) {
            newTileGFX = tile[changeX][changeY].gfx;
        }
        tileData[changeX] = tileData[changeX] || {};
        tileData[changeX][changeY] = tileData[changeX][changeY] || [];
        //Save a z-depth stack of tiles
        if (stackTiles) {
            //Kill grass
            if (tile[changeX][changeY].type === "grass") {
                if (tileData[changeX][changeY].length > 0) {
                    tileData[changeX][changeY][0].type = 'dirt';
                } else {
                    tileData[changeX][changeY].push({type: 'dirt'});
                }
            } else {
                if (tileData[changeX][changeY].length <= 0) {
                    tileData[changeX][changeY].push({type: tile[changeX][changeY].type});
                }
            }
            tileData[changeX][changeY].unshift(newTile);
        } else {
            if (tileData[changeX][changeY].length <= 0) {
                tileData[changeX][changeY].push(newTile);
            }
            tileData[changeX][changeY][0].type = newTile.type;
            tileData[changeX][changeY][0].strength = tiletypes[newTile.type].strength;
            if (tiletypes[newTile.type].durability) {
                tileData[changeX][changeY][0].mindur = tiletypes[newTile.type].durability;
                tileData[changeX][changeY][0].maxdur = tiletypes[newTile.type].durability;
            }
        }
        tile[changeX][changeY].gfx = newTileGFX;
        tile[changeX][changeY].type = newTile.type;

        //Draw map changes
        mapCanvas.fillStyle = tiletypes[tile[changeX][changeY].type].color;
        mapCanvas.fillRect(changeX, changeY, 1, 1);
    }
}

/**
 * Check LOS
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 * @returns {boolean}
 */
function checkLOS(x0, y0, x1, y1) {
    var dx = Math.abs(x1 - x0),
        dy = Math.abs(y1 - y0),
        sx = x0 < x1 ? 1 : 0 - 1,
        sy = y0 < y1 ? 1 : 0 - 1,
        err = dx - dy;
    while (true) {
        if (x0 === x1 && y0 === y1) {
            break;
        }
        if (tile[x0] && tile[x0][y0] && tiletypes[tile[x0][y0].type] && tiletypes[tile[x0][y0].type].noLOS) {
            return false;
        }
        var e2 = 2 * err;
        if (e2 > 0 - dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    return true;
}

/**
 * Monster beside you?
 * Note: Had to do some trickery in here to get group attacking timed right
 * @returns {boolean}
 */
function monsterMove() {
    var damageAfterLoop = [];
    var monsterHit = 0;
    var skipCombat = false;
    for (var monster = 0; monster < game.monsters.length; monster++) {
        if (game.monsters[monster]) {
            if (game.monsters[monster].ai !== "fish") {
                //Scare monsters near death - sharks/fish/stationary never scare
                if (game.monsters[monster].hp <= 3 && game.monsters[monster].ai !== "swimming" && game.monsters[monster].ai !== "stationary") {
                    game.monsters[monster].ai = "scared";
                }
                //Scared creatures will try to escape randomly
                skipCombat = (game.monsters[monster].ai === "scared" && Math.floor(Math.random() * 2) === 1);

                if (!skipCombat) {
                    if (game.monsters[monster].x === player.x && game.monsters[monster].y === player.y - 1 || game.monsters[monster].x === player.x && game.monsters[monster].y === player.y + 1 || game.monsters[monster].y === player.y && game.monsters[monster].x === player.x - 1 || game.monsters[monster].y === player.y && game.monsters[monster].x === player.x + 1) {
                        monsterHit = Math.floor(Math.random() * (npcs[game.monsters[monster].type].maxatk - npcs[game.monsters[monster].type].minatk) + npcs[game.monsters[monster].type].minatk);

                        //Aberrants hit 3 times as hard
                        if (game.monsters[monster].aberrant) {
                            monsterHit = monsterHit * 2;
                        }
                        var monsterDamageTypes = npcs[game.monsters[monster].type].damageType;
                        var playerDefense = 0;
                        for (var damageType = 0; damageType < monsterDamageTypes.length; damageType++) {
                            switch (monsterDamageTypes[damageType]) {
                                case 'blunt':
                                    playerDefense += player.defense.blunt;
                                    break;
                                case 'fire':
                                    playerDefense += player.defense.fire;
                                    break;
                                case 'piercing':
                                    playerDefense += player.defense.piercing;
                                    break;
                                case 'slashing':
                                    playerDefense += player.defense.slashing;
                                    break;
                            }
                        }
                        var effectiveness = "";
                        if (playerDefense > 0) {
                            effectiveness = Messages.resistant;
                        } else if (playerDefense < 0) {
                            effectiveness = Messages.vulnerable;
                        }
                        playerDefense += player.defense.base;
                        var skillBonus = Utilities.roundNumber(player.skills.parrying.percent / 10, 0) + playerDefense;
                        skillBonus = Math.floor(Math.random() * skillBonus + (playerDefense / 3));
                        monsterHit = monsterHit - skillBonus;
                        //Hidden monsters show on attack (but don't attack)
                        if (game.monsters[monster].ai === "hidden") {
                            game.monsters[monster].ai = "hostile";
                            continue;
                        }
                        if (monsterHit > 0 || monsterHit <= 0 && Math.floor(Math.random() * 8) === 1) {
                            //Random chance for 1 damage to get through
                            if (monsterHit <= 0) {
                                monsterHit = 1;
                            }
                            var tempText = "-" + monsterHit;
                            ui.textAbove(tempText, 255, 0, 0);
                            createParticles(255, 0, 0, "self");
                            audio.queueSfx('hurt');
                            if (Math.floor(Math.random() * 15 + 1) === 1) {
                                placeEnvItem({type: "blood", x: player.x, y: player.y, quality: ''});
                            }
                            player.skillGain("parrying", false, false);
                            ui.message("monsterHit", "bad", [npcs[game.monsters[monster].type].name, monsterHit, effectiveness]);

                            var chance, anatomyChance;
                            if (npcs[game.monsters[monster].type].canCauseStatus) {
                                for (var statusEffect = 0; statusEffect < npcs[game.monsters[monster].type].canCauseStatus.length; statusEffect++) {
                                    switch (npcs[game.monsters[monster].type].canCauseStatus[statusEffect]) {
                                        case "bleeding":
                                            if (!player.status.bleeding) {
                                                //8% chance to bleed minus anatomy skill (2% chance min)
                                                chance = Math.floor(Math.random() * 99 + 1);
                                                anatomyChance = Math.floor(player.skills.anatomy.percent / 20);
                                                if (chance <= 8 - anatomyChance) {
                                                    ui.message("bleedingStart", "bad", false);
                                                    player.skillGain('anatomy', 0.1, false);
                                                    player.status.bleeding = true;
                                                }
                                            }
                                            break;
                                        case "poison":
                                            if (!player.status.poisoned) {
                                                //8% chance to poison minus anatomy skill (2% chance min)
                                                chance = Math.floor(Math.random() * 99 + 1);
                                                anatomyChance = Math.floor(player.skills.anatomy.percent / 20);
                                                if (chance <= 8 - anatomyChance) {
                                                    ui.message("poisonedStart", "bad", false);
                                                    player.skillGain('anatomy', 0.1, false);
                                                    player.status.poisoned = true;
                                                }
                                            }
                                            break;
                                        case "burning":
                                            //Don't always cause burning
                                            chance = Math.floor(Math.random() * 4 + 1);
                                            if (chance === 1) {
                                                getBurned();
                                            }
                                            break;
                                    }
                                }
                            }
                            player.health -= monsterHit;
                            damageEquip();
                        } else {
                            audio.queueSfx('miss');
                            ui.message("monsterMiss", "miss", [npcs[game.monsters[monster].type].name]);
                        }
                        game.delay += 15;
                        continue;
                    }
                }
            }

            //Monster movement
            if (game.monsters[monster].ai !== "stationary") {

                //Only move within range
                if (game.monsters[monster].x < player.x + game.windowWidth && game.monsters[monster].y < player.y + game.windowHeight && game.monsters[monster].y > player.y - game.windowHeight && game.monsters[monster].x > player.x - game.windowWidth) {

                    //Night time baddies removal - remove out of sight
                    if (player.light < 0.75) {
                        if (!(game.monsters[monster].x + (game.windowHalfWidth + 1) >= player.x && game.monsters[monster].y + (game.windowHalfHeight + 1) >= player.y && game.monsters[monster].y - (game.windowHalfHeight + 1) <= player.y && game.monsters[monster].x - (game.windowHalfWidth + 1) <= player.x)) {
                            if (game.monsters[monster].type === "vampirebat" || game.monsters[monster].type === "zombie") {
                                deleteMonsters(monster);
                                continue;
                            }
                        }
                    }

                    var x = 0;
                    var y = 0;
                    var breakLoop = false;
                    var randomMove = [0, 1, 2, 3];
                    randomMove.sort(function () {
                        return 0.5 - Math.random();
                    });
                    var randomThreshold = Math.floor(Math.random() * 30 + 1);

                    //Monster has chance to get scared randomly
                    if (game.monsters[monster].ai === "hostile" && randomThreshold === 2) {
                        game.monsters[monster].ai = "random";
                    }

                    //Monster has chance to get hostile again
                    if (game.monsters[monster].ai === "random" && randomThreshold >= 3 && randomThreshold <= 12) {
                        game.monsters[monster].ai = "hostile";
                    }

                    for (var i2 = 0; i2 < 4; i2++) {

                        if (breakLoop) {
                            breakLoop = false;
                            break;
                        }

                        switch (randomMove[i2]) {
                            case 0:
                                x = 1;
                                y = 0;
                                break;
                            case 1:
                                x = 0;
                                y = 1;
                                break;
                            case 2:
                                x = -1;
                                y = 0;
                                break;
                            case 3:
                                x = 0;
                                y = -1;
                                break;
                        }

                        //1 in 30 chance for monster to randomly move instead
                        if (game.monsters[monster].ai === "hostile" && randomThreshold !== 1 || game.monsters[monster].ai === "swimming" && randomThreshold !== 1) {
                            //Hostile movement patterns
                            switch (randomMove[i2]) {
                                case 0:
                                    if (game.monsters[monster].x < player.x) {
                                        x = 1;
                                        y = 0;
                                    }
                                    if (game.monsters[monster].x > player.x) {
                                        x = -1;
                                        y = 0;
                                    }
                                    if (game.monsters[monster].y < player.y) {
                                        x = 0;
                                        y = 1;
                                    }
                                    if (game.monsters[monster].y > player.y) {
                                        x = 0;
                                        y = -1;
                                    }
                                    break;
                                case 1:
                                    if (game.monsters[monster].x > player.x) {
                                        x = -1;
                                        y = 0;
                                    }
                                    if (game.monsters[monster].y < player.y) {
                                        x = 0;
                                        y = 1;
                                    }
                                    if (game.monsters[monster].y > player.y) {
                                        x = 0;
                                        y = -1;
                                    }
                                    if (game.monsters[monster].x < player.x) {
                                        x = 1;
                                        y = 0;
                                    }
                                    break;
                                case 2:
                                    if (game.monsters[monster].y < player.y) {
                                        x = 0;
                                        y = 1;
                                    }
                                    if (game.monsters[monster].y > player.y) {
                                        x = 0;
                                        y = -1;
                                    }
                                    if (game.monsters[monster].x < player.x) {
                                        x = 1;
                                        y = 0;
                                    }
                                    if (game.monsters[monster].x > player.x) {
                                        x = -1;
                                        y = 0;
                                    }
                                    break;
                                case 3:
                                    if (game.monsters[monster].y > player.y) {
                                        x = 0;
                                        y = -1;
                                    }
                                    if (game.monsters[monster].x < player.x) {
                                        x = 1;
                                        y = 0;
                                    }
                                    if (game.monsters[monster].x > player.x) {
                                        x = -1;
                                        y = 0;
                                    }
                                    if (game.monsters[monster].y < player.y) {
                                        x = 0;
                                        y = 1;
                                    }
                                    break;
                            }
                        }

                        if (game.monsters[monster].ai === "scared" && randomThreshold !== 1 || game.monsters[monster].ai === "random" || game.monsters[monster].ai === "fish") {
                            //Make them scared only if you get close - this stops them from constantly hiding on shore lines
                            if (game.monsters[monster].x < player.x + 5 && game.monsters[monster].y < player.y + 5 && game.monsters[monster].y > player.y - 5 && game.monsters[monster].x > player.x - 5 || game.monsters[monster].ai === "random") {
                                switch (randomMove[i2]) {
                                    case 0:
                                        if (game.monsters[monster].x < player.x) {
                                            x = -1;
                                            y = 0;
                                        }
                                        if (game.monsters[monster].x > player.x) {
                                            x = 1;
                                            y = 0;
                                        }
                                        if (game.monsters[monster].y < player.y) {
                                            x = 0;
                                            y = -1;
                                        }
                                        if (game.monsters[monster].y > player.y) {
                                            x = 0;
                                            y = 1;
                                        }
                                        break;
                                    case 1:
                                        if (game.monsters[monster].x > player.x) {
                                            x = 1;
                                            y = 0;
                                        }
                                        if (game.monsters[monster].y < player.y) {
                                            x = 0;
                                            y = -1;
                                        }
                                        if (game.monsters[monster].y > player.y) {
                                            x = 0;
                                            y = 1;
                                        }
                                        if (game.monsters[monster].x < player.x) {
                                            x = -1;
                                            y = 0;
                                        }
                                        break;
                                    case 2:
                                        if (game.monsters[monster].y < player.y) {
                                            x = 0;
                                            y = -1;
                                        }
                                        if (game.monsters[monster].y > player.y) {
                                            x = 0;
                                            y = 1;
                                        }
                                        if (game.monsters[monster].x < player.x) {
                                            x = -1;
                                            y = 0;
                                        }
                                        if (game.monsters[monster].x > player.x) {
                                            x = 1;
                                            y = 0;
                                        }
                                        break;
                                    case 3:
                                        if (game.monsters[monster].y > player.y) {
                                            x = 0;
                                            y = 1;
                                        }
                                        if (game.monsters[monster].x < player.x) {
                                            x = -1;
                                            y = 0;
                                        }
                                        if (game.monsters[monster].x > player.x) {
                                            x = 1;
                                            y = 0;
                                        }
                                        if (game.monsters[monster].y < player.y) {
                                            x = 0;
                                            y = -1;
                                        }
                                        break;
                                }
                            }
                        }

                        //Time skitter teleport (through time?)
                        if (game.monsters[monster].type === "timeskitter") {
                            if (Math.floor(Math.random() * 8 + 1) === 1) {
                                x = Math.floor(Math.random() * 6 - 3);
                                y = Math.floor(Math.random() * 6 - 3);
                            }
                            //Fish can sometimes move randomly
                        } else if (game.monsters[monster].ai === "fish") {
                            if (Math.floor(Math.random() * 3 + 1) === 1) {
                                x = Math.floor(Math.random() * 3 - 1);
                                y = Math.floor(Math.random() * 3 - 1);
                            }
                        }

                        //Remove monsters if they try to go off edge of world
                        if (!tile[game.monsters[monster].x + x] || !tile[game.monsters[monster].x + x][game.monsters[monster].y + y]) {
                            deleteMonsters(monster);
                            breakLoop = true;
                            continue;
                        }

                        if (tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].passable && game.monsters[monster].ai !== "swimming" && game.monsters[monster].ai !== "fish" || tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].water && game.monsters[monster].ai === "swimming" || tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].water && game.monsters[monster].ai === "fish" || tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].shallowWater && game.monsters[monster].ai === "fish" || npcs[game.monsters[monster].type].special === "ghost" || tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].passable && npcs[game.monsters[monster].type].special === "landsea" || tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].water && npcs[game.monsters[monster].type].special === "landsea" || npcs[game.monsters[monster].type].special === "hidden" || (npcs[game.monsters[monster].type].special === "flying" && tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].skill === "lumberjacking")) {

                            //Don't step over me, bro! (except for fish)
                            //Don't let them step over each other
                            if (game.monsters[monster].x + x === player.x && game.monsters[monster].y + y === player.y && game.monsters[monster].ai !== "fish" || tile[game.monsters[monster].x + x][game.monsters[monster].y + y].monster) {
                                continue;
                            }

                            //Stacks of 12 items become a wall for monsters
                            if (tile[game.monsters[monster].x + x][game.monsters[monster].y + y].tileitems) {
                                if (Object.keys(tile[game.monsters[monster].x + x][game.monsters[monster].y + y].tileitems).length >= 10) {
                                    continue;
                                }
                            }

                            //Don't let them go into fire, stop movement from blockmove envitems
                            if (tile[game.monsters[monster].x + x][game.monsters[monster].y + y].envItemList) {
                                for (var envItem = 0; envItem < tile[game.monsters[monster].x + x][game.monsters[monster].y + y].envItemList.length; envItem++) {
                                    var envId3 = tile[game.monsters[monster].x + x][game.monsters[monster].y + y].envItemList[envItem];
                                    if (environmentals[envItems[envId3].type].fire || environmentals[envItems[envId3].type].blockmove) {
                                        //Let ghosts and flyers pass them.
                                        if (npcs[game.monsters[monster].type].special !== "ghost" && npcs[game.monsters[monster].type].special !== "flying") {
                                            breakLoop = true;
                                            break;
                                        }
                                    } else if (environmentals[envItems[envId3].type].trap) {
                                        if (npcs[game.monsters[monster].type].special !== "ghost" && npcs[game.monsters[monster].type].special !== "flying") {
                                            var trapChance = Math.floor(Math.random() * 99 + 1);
                                            if (envItems[envId3].type === "snare_set_monster") {
                                                //Monster traps go off less on other monsters
                                                if (75 >= (trapChance - 50)) {
                                                    damageAfterLoop.push([monster, true, envId3]);
                                                    if (isMonsterInView(monster)) {
                                                        audio.queueSfx('monsterhit');
                                                        ui.message("monsterTrapHurt", 'normal', [npcs[game.monsters[monster].type].name]);
                                                    }
                                                }
                                            } else {
                                                if (player.skills.trapping.percent <= (trapChance - 50)) {
                                                    damageAfterLoop.push([monster, false, envId3]);
                                                    if (isMonsterInView(monster)) {
                                                        audio.queueSfx('monsterhit');
                                                        player.skillGain("trapping", false, false);
                                                        addMilestone("trapper");
                                                        ui.message("monsterYourTrapHurt", "attack", [npcs[game.monsters[monster].type].name]);
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        //Check for plants and crush them underfoot 10% of the time.
                                        if (npcs[game.monsters[monster].type].special !== "ghost" && npcs[game.monsters[monster].type].special !== "flying") {
                                            if (checkForTrampling(envId3, false, monster)) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            if (breakLoop) {
                                breakLoop = false;
                                continue;
                            }

                            switch (game.monsters[monster].type) {
                                //Fireelementals can spawn fire (not over water), but can't travel on water
                                case "fireelemental":
                                    if (Math.floor(Math.random() * 40 + 1) === 1) {
                                        var fireX = game.monsters[monster].x + Math.floor(Math.random() * 6 - 3);
                                        var fireY = game.monsters[monster].y + Math.floor(Math.random() * 6 - 3);
                                        if (tiletypes[tile[fireX][fireY].type].flammable) {
                                            placeEnvItem({type: "fire", x: fireX, y: fireY});
                                        }
                                    }
                                    if (tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].water || tiletypes[tile[game.monsters[monster].x + x][game.monsters[monster].y + y].type].shallowWater) {
                                        continue;
                                    }
                                    break;
                                //Boglings spawn swamp
                                case "bogling":
                                    if (Math.floor(Math.random() * 40 + 1) === 1) {
                                        changeTile({type: "swamp"}, game.monsters[monster].x, game.monsters[monster].y, true);
                                    }
                                    break;
                                //Hobgoblins lay traps
                                case "hobgoblin":
                                    if (Math.floor(Math.random() * 200 + 1) === 1) {
                                        var trapX = game.monsters[monster].x + Math.floor(Math.random() * 2 - 1);
                                        var trapY = game.monsters[monster].y + Math.floor(Math.random() * 2 - 1);
                                        if (tiletypes[tile[trapX][trapY].type].passable) {
                                            placeEnvItem({type: "snare_set_monster", x: trapX, y: trapY, quality: ''});
                                        }
                                    }
                                    break;
                                //Chickens and harpies drop feather, chickens drop eggs (very rare)
                                case "chicken":
                                    if (Math.floor(Math.random() * 2000 + 1) === 1) {
                                        placeItem({
                                            type: "egg",
                                            x: game.monsters[monster].x,
                                            y: game.monsters[monster].y,
                                            quality: 'Random'
                                        }, 'TILE', false);
                                    }
                                /* FALL THROUGH */
                                case "harpy":
                                    if (Math.floor(Math.random() * 400 + 1) === 1) {
                                        placeItem({
                                            type: "feather",
                                            x: game.monsters[monster].x,
                                            y: game.monsters[monster].y,
                                            quality: 'Random'
                                        }, 'TILE', false);
                                    }
                                    break;
                            }

                            //50% chance of neutrals to move randomly
                            if (game.monsters[monster].ai === "neutral" && randomThreshold >= 4 || game.monsters[monster].ai === "hostile" || game.monsters[monster].ai === "scared" || game.monsters[monster].ai === "random" || game.monsters[monster].ai === "swimming" || game.monsters[monster].ai === "hidden" || game.monsters[monster].ai === "fish" || game.monsters[monster].ai === "landsea") {
                                if (tile[game.monsters[monster].x][game.monsters[monster].y].monster) {
                                    delete tile[game.monsters[monster].x][game.monsters[monster].y].monster;
                                }
                                game.monsters[monster].x += x;
                                game.monsters[monster].y += y;
                                tile[game.monsters[monster].x][game.monsters[monster].y].monster = monster;
                            }
                            break;
                        }
                    }
                } else {
                    //If the monster is out of range, full health(ish), give it 0.01% to remove (de-spawning)
                    if (game.monsters[monster].hp >= npcs[game.monsters[monster].type].minhp && Math.floor(Math.random() * 10000 + 1) === 1) {
                        deleteMonsters(monster);
                    }
                }
            }
        }
    }
    //Damage monsters after loop (for traps)
    var trapDamage = 0;

    for (var dmgMonster = 0; dmgMonster < damageAfterLoop.length; dmgMonster++) {
        if (damageAfterLoop[dmgMonster]) {
            if (damageAfterLoop[dmgMonster][1] === true) {
                //Is it a monster's trap? Don't factor player skill
                trapDamage = Math.floor(Math.random() * 6 + 3);
            } else {
                trapDamage = Math.floor(Math.random() * 6 + 3) + Math.floor(player.skills.trapping.percent / 10);
            }
            damageMonster(damageAfterLoop[dmgMonster][0], trapDamage, 0, 0, true, false);
            removeItem(damageAfterLoop[dmgMonster][2], 'ENV', false);
        }
    }
    return true;
}

/**
 * Collection of actions to perform on the passing of each player turn.
 * @param move boolean
 */
function passTurn(move) {

    if (move) {
        checkUnderPlayer(true, true);
        player.staminaCheck();
        //Regen and spawning
        game.staminaTimer++;
        game.healthTimer++;
        game.hungerTimer++;
        game.thirstTimer++;
        game.monsterSpawnTimer++;
        player.turns++;
        addMilestone("survivor");
        if (game.staminaTimer >= game.staminaRegen) {
            player.stamina += 1;
            game.staminaTimer = 0;
        }
        //Don't regen health if bleeding/poisoned/burning
        if (!player.status.bleeding && !player.status.poisoned && !player.status.burning && game.healthTimer >= game.healthRegen) {
            player.health += 1;
            game.healthTimer = 0;
        }
        if (game.hungerTimer >= game.hungerRegen) {
            player.hunger -= 1;

            if (player.hunger < 0) {
                player.health += player.hunger;
                player.stamina += player.hunger;
                ui.textAbove(player.hunger, 255, 0, 0);
                ui.textAbove(player.hunger, 0, 234, 11);
                audio.queueSfx('hurt');
                ui.message("starvingStart", "bad", false);
            }

            game.hungerTimer = 0;
        }
        if (game.thirstTimer >= game.thirstRegen) {
            player.thirst -= 1;

            if (player.thirst < 0) {
                player.health += player.thirst;
                player.stamina += player.thirst;
                ui.textAbove(player.thirst, 255, 0, 0);
                ui.textAbove(player.thirst, 0, 234, 11);
                audio.queueSfx('hurt');
                ui.message("dehydrationStart", "bad", false);
            }

            game.thirstTimer = 0;
        }
        //Monster respawning
        if (game.monsterSpawnTimer >= player.monsterSpawner) {
            //Chance of going upper/lower around you
            var monsterX = 0;
            var monsterY = 0;
            if (Math.floor(Math.random() * 2 + 1) === 1) {
                monsterX = Math.floor(Math.random() * 45 + player.x + game.windowHalfWidth + 2);
                monsterY = Math.floor(Math.random() * 45 + player.y + game.windowHalfHeight + 2);
            } else {
                monsterX = Math.floor(Math.random() * -45 + player.x - game.windowHalfWidth + 2);
                monsterY = Math.floor(Math.random() * -45 + player.y - game.windowHalfHeight + 2);
            }
            if (tile[monsterX] && tile[monsterX][monsterY] && tiletypes[tile[monsterX][monsterY].type].water) {
                if (spawnMonster("water", monsterX, monsterY)) {
                    game.monsterSpawnTimer = 0;
                }
            } else if (tile[monsterX] && tile[monsterX][monsterY]) {
                if (spawnMonster("", monsterX, monsterY)) {
                    game.monsterSpawnTimer = 0;
                }
            }
        }

        //Auto save
        game.autoSaveTimer++;
        if (game.autoSaveTimer >= 5000) {
            ui.message("automaticSave", 'normal', false);
            saveGame(true);
            game.autoSaveTimer = 0;
        }

        player.stepCounter++;

        //Day-night cycle, growing
        if (player.stepCounter >= 20) {
            dynamicGrow();
            player.stepCounter = 0;
            if (player.light >= 0.95) {
                player.lightSwitch = 1;
                //Increase spawner every night, but not too much
                if (player.monsterSpawner >= 50) {
                    player.monsterSpawner -= 3;
                }
            } else if (player.light <= 0.002) {
                player.lightSwitch = 0;
            }
            if (player.lightSwitch === 0) {
                //Long nights, days
                if (player.light >= 0.85 || player.light <= 0.1) {
                    player.light += 0.002;
                } else {
                    player.light += 0.01;
                }
            } else {
                //Long nights, days
                if (player.light >= 0.85 || player.light <= 0.1) {
                    player.light -= 0.002;
                } else {
                    player.light -= 0.01;
                }
            }
            if (player.x <= game.mapSize && player.light >= 0.65 && ui.options.hints && !player.hintseen.nightfall) {
                ui.hintDisplay("nightfall");
            }
            if (player.status.bleeding) {
                if (Math.floor(Math.random() * 7) === 1) {
                    player.status.bleeding = false;
                    ui.message("bleedingEnd", 'normal', false);
                } else {
                    var bleedingDamage = Utilities.randomFromInterval(player.strength / 25, player.strength / 10);
                    ui.textAbove("-" + bleedingDamage, 255, 0, 0);
                    player.health -= bleedingDamage;
                    audio.queueSfx('hurt');
                    ui.message("bleedingDamage", "bad", [bleedingDamage]);
                    createParticles(255, 0, 0, "self");
                    if (Math.floor(Math.random() * 2 + 1) === 1) {
                        placeEnvItem({type: "blood", x: player.x, y: player.y, quality: ''});
                    }
                    game.hungerTimer++;
                    game.thirstTimer++;
                    game.staminaTimer--;
                }
            }
            if (player.status.poisoned) {
                if (Math.floor(Math.random() * 7) === 1) {
                    player.status.poisoned = false;
                    ui.message("poisonEnd", 'normal', false);
                } else {
                    var poisonDamage = Utilities.randomFromInterval(player.strength / 25, player.strength / 10);
                    ui.textAbove("-" + poisonDamage, 255, 0, 0);
                    player.health -= poisonDamage;
                    audio.queueSfx('hurt');
                    ui.message("poisonDamage", "bad", [poisonDamage]);
                    game.thirstTimer += 2;
                    game.staminaTimer -= 2;
                }
            }
            if (player.status.burning) {
                if (Math.floor(Math.random() * 14) === 1) {
                    player.status.burning = false;
                    ui.message("burningPainEnd", 'normal', false);
                } else {
                    var burningDamage = Utilities.randomFromInterval(player.strength / 35, player.strength / 20);
                    ui.textAbove("-" + burningDamage, 255, 0, 0);
                    player.health -= burningDamage;
                    audio.queueSfx('hurt');
                    ui.message("burningDamage", "bad", [burningDamage]);
                }
            }
        }

        //Randomized events
        var mRandom;
        var randomTileX = Math.floor(Math.random() * (game.mapSize * 2));
        var randomTileY = Math.floor(Math.random() * game.mapSize);
        if (tile[randomTileX][randomTileY].type === "barepalm") {
            changeTile({type: "palm"}, randomTileX, randomTileY, false);
            console.log('palm tree regrow');
        } else if (tile[randomTileX][randomTileY].type === "bareforest") {
            changeTile({type: "forest"}, randomTileX, randomTileY, false);
            console.log('forest regrow');
        } else if (tile[randomTileX][randomTileY].type === "forest" && tileData[randomTileX] && tileData[randomTileX][randomTileY] && tileData[randomTileX][randomTileY].strength < tiletypes.forest.strength) {
            tileData[randomTileX][randomTileY].strength++;
            console.log('forest strength');
        } else if (tile[randomTileX][randomTileY].type === "palm" && tileData[randomTileX] && tileData[randomTileX][randomTileY] && tileData[randomTileX][randomTileY].strength < tiletypes.palm.strength) {
            tileData[randomTileX][randomTileY].strength++;
            console.log('palm strength');
        } else if (tile[randomTileX][randomTileY].monster) {
            var mId = tile[randomTileX][randomTileY].monster;
            mRandom = Math.floor(Math.random() * 3 + 1);
            if (mRandom === 1 && game.monsters[mId].hp < npcs[game.monsters[mId].type].maxhp) {
                game.monsters[mId].hp++;
                console.log('monster health regen');
            } else if (mRandom === 2) {
                damageMonster(mId, 1, 0, 0, true, true);
                console.log('monster health damage');
            } else if (mRandom === 3) {
                damageMonster(mId, 999, 0, 0, true, true);
                console.log('monster kill');
            }
        } else if (tile[randomTileX][randomTileY].envItemList) {
            var envId = tile[randomTileX][randomTileY].envItemList[0];
            if (environmentals[envItems[envId].type].spread) {
                mRandom = Math.floor(Math.random() * 3 + 1);
                if (mRandom === 1) {
                    removeItem(envId, 'ENV', false);
                    console.log('plant destroyed');
                } else if (mRandom === 2) {
                    envItems[envId].spread++;
                    console.log('plant fertility increased');
                } else if (mRandom === 3 && envItems[envId].spread >= 1) {
                    envItems[envId].spread--;
                    console.log('plant fertility decreased');
                }
            }
        } else if (Math.floor(Math.random() * 1000 + 1) === 1) {
            envItemGen(tile[randomTileX][randomTileY].type, randomTileX, randomTileY, true);
            console.log('plant grown');
        }

        //Item decay
        var inventoryLength = player.invItems.length;
        for (var invItem = 0; invItem < inventoryLength; invItem++) {
            if (player.invItems[invItem] !== undefined && player.invItems[invItem] !== null) {
                if (player.invItems[invItem].container && player.invItems[invItem].container.length > 0) {
                    decayItemsInContainer(invItem, player.invItems[invItem].container, "INV");
                }
                //Only decay the item if it has a decay property defined (so unlit torches don't decay)
                if (items[player.invItems[invItem].type].decayable && player.invItems[invItem].decay > 0) {
                    player.invItems[invItem].decay--;
                } else if (player.invItems[invItem].decay === 0) {
                    if (items[player.invItems[invItem].type].decayable && items[player.invItems[invItem].type].decayable[1]) {
                        itemGet({
                            type: items[player.invItems[invItem].type].decayable[1],
                            quality: player.invItems[invItem].quality
                        }, "silent");
                    }
                    ui.message("itemDecay", 'normal', [items[player.invItems[invItem].type].name]);
                    removeItem(invItem, 'INV', false);
                }
            }
        }

        //Decay items on the ground
        var tileItemsKey = Object.keys(tileItems);
        for (var i2 = 0; i2 < tileItemsKey.length; i2++) {
            if (tileItems[tileItemsKey[i2]]) {
                //Hatch chickens!
                if (tileItems[tileItemsKey[i2]].type === "egg" && Math.floor(Math.random() * 2000 + 1) === 1) {
                    if (spawnMonster("chicken", tileItems[tileItemsKey[i2]].x, tileItems[tileItemsKey[i2]].y)) {
                        removeItem(tileItemsKey[i2], 'TILE', false);
                    }
                    continue;
                }
                //Decay items in containers on ground
                if (tileItems[tileItemsKey[i2]].container && tileItems[tileItemsKey[i2]].container.length > 0) {
                    decayItemsInContainer(tileItemsKey[i2], tileItems[tileItemsKey[i2]].container, "TILE");
                }
                if (items[tileItems[tileItemsKey[i2]].type].decayable && tileItems[tileItemsKey[i2]].decay > 0) {
                    tileItems[tileItemsKey[i2]].decay--;
                } else if (tileItems[tileItemsKey[i2]].decay === 0) {
                    if (items[tileItems[tileItemsKey[i2]].type].decayable) {
                        if (items[tileItems[tileItemsKey[i2]].type].decayable[1]) {
                            placeItem({
                                type: items[tileItems[tileItemsKey[i2]].type].decayable[1],
                                x: tileItems[tileItemsKey[i2]].x,
                                y: tileItems[tileItemsKey[i2]].y,
                                durability: 'Random'
                            }, 'TILE', false);
                        }
                        removeItem(tileItemsKey[i2], 'TILE', false);
                    }
                }
            }
        }

        monsterMove();

    }

    if (move !== "rest") {
        game.updateMovement = true;
    }

    //Update the lighting, tiles, mini map, stats, equipment, craftTable every passTurn
    ui.$actionsMenu.hide();
    stats();
    player.calculateEquipmentStats();
    player.attributes();

    lighting();

    if (game.updateMiniMap) {
        makeMiniMap();
    } else {
        game.updateMiniMap = true;
    }

    game.updateTiles = true;
    game.updateAnimation = true;

    if (game.updateItems) {
        game.updateItems = false;
        craftTable();
    }
}

/**
 * Improve player stats from eating something.
 * @param hp int
 * @param stamina int
 * @param hunger int
 * @param thirst int
 */
function edible(hp, stamina, hunger, thirst) {
    if (hp !== 0) {
        player.health += hp;
        if (hp > 0) {
            ui.textAbove("+" + hp, 255, 0, 0);
            ui.message("gainedHealth", "normal", [hp]);
        } else if (hp < 0) {
            ui.textAbove(hp, 255, 0, 0);
            ui.message("lostHealth", "bad", [-hp]);
            audio.queueSfx('hurt');
            if (ui.options.hints && !player.hintseen.eatingbadthings) {
                ui.hintDisplay("eatingbadthings");
            }
            if (!player.status.poisoned) {
                //20% chance to poison minus anat skill (10% chance min)
                var chance = Math.floor(Math.random() * 99 + 1);
                var anatomyChance = Math.floor(player.skills.anatomy.percent / 10);
                if (chance <= 20 - anatomyChance) {
                    ui.message("poisonedStart", "bad", false);
                    player.skillGain('anatomy', 0.1, false);
                    player.status.poisoned = true;
                }
            }
        }
    }
    if (stamina !== 0) {
        player.stamina += stamina;
        if (stamina > 0) {
            ui.textAbove("+" + stamina, 0, 234, 11);
            ui.message("gainedStamina", "normal", [stamina]);
        } else if (stamina < 0) {
            ui.textAbove(stamina, 0, 234, 11);
            ui.message("lostStamina", "bad", [-stamina]);
        }
    }
    if (hunger !== 0) {
        if (hunger > 0) {
            ui.textAbove("+" + hunger, 178, 0, 255);
            ui.message("lostHunger", "normal", [hunger]);
            //Over-eating
            if (player.hunger >= player.starvation) {
                player.stamina -= 10;
                ui.textAbove("-10", 0, 234, 11);
                ui.message("overEating", "bad", false);
                audio.queueSfx('hurt');
            }
        } else if (hunger < 0) {
            ui.textAbove(hunger, 178, 0, 255);
            ui.message("gainedHunger", "bad", [-hunger]);
        }
        player.hunger += hunger;
        //Reset hunger on eating
        if (player.hunger < 0) {
            player.hunger = 0;
        }
    }
    if (thirst !== 0) {
        if (thirst > 0) {
            ui.textAbove("+" + thirst, 0, 127, 255);
            ui.message("lostThirst", "normal", [thirst]);
            //Over-hydrate
            if (player.thirst >= player.dehydration) {
                player.stamina -= 10;
                ui.textAbove("-10", 0, 234, 11);
                ui.message("overHydrating", "bad", false);
                audio.queueSfx('hurt');
            }
        } else if (thirst < 0) {
            ui.textAbove(thirst, 0, 127, 255);
            ui.message("gainedThirst", "bad", [-thirst]);
        }
        player.thirst += thirst;
        //Reset thirst on drinking
        if (thirst > 0 && player.thirst < 0) {
            player.thirst = 0;
        }
    }
    audio.queueSfx('eating');
    passTurn(false);
}

/**
 * Destroy item and perform required cleanup.
 * @param itemId {int}
 * @param location {string}
 * @param container {int/boolean}
 */
function removeItem(itemId, location, container) {
    switch (location) {
        case 'ENV':
            if (container || container === 0) {
                if (game.containerOpened.id === container) {
                    ui.$container.find('.item[data-itemid="' + itemId + '"]').remove();
                }
                delete envItems[container].container[itemId];
            } else {
                var x = envItems[itemId].x;
                var y = envItems[itemId].y;
                var selectTile = tile[x][y];
                if (selectTile.envItemList.length > 1) {
                    for (var i = selectTile.envItemList.length - 1; i >= 0; i--) {
                        if (selectTile.envItemList[i] === itemId) {
                            selectTile.envItemList.splice(i, 1);
                        }
                    }
                } else {
                    delete selectTile.envItemList;
                }
                delete envItems[itemId];
            }
            break;
        case 'TILE':
            if (container || container === 0) {
                delete tileItems[container].container[itemId];
            } else {
                if (Object.keys(tile[tileItems[itemId].x][tileItems[itemId].y].tileitems).length > 1) {
                    delete tile[tileItems[itemId].x][tileItems[itemId].y].tileitems[itemId];
                } else {
                    delete tile[tileItems[itemId].x][tileItems[itemId].y].tileitems;
                }
                delete tileItems[itemId];
            }
            break;
        case 'INV':
            game.updateItems = true;
            if (container || container === 0) {
                if (game.containerOpened.id === container) {
                    ui.$container.find('.item[data-itemid="' + itemId + '"]').remove();
                }
                delete player.invItems[container].container[itemId];
            } else {
                ui.$inventoryEquip.find('.item[data-itemid="' + itemId + '"]').remove();
                delete player.invItems[itemId];
            }
            break;
    }
}

/**
 * Checks for mob or obstacle inside the weapon range.
 * @param range int
 * @returns {{id: number, x: number, y: number, found: boolean, obstacle: boolean}}
 */
function checkForMobInRange(range) {

    var target = {
        id: 0,
        x: 0,
        y: 0,
        found: false,
        obstacle: false,
        water: false
    };

    var targetX = 0;
    var targetY = 0;
    var playerX = 0;
    var playerY = 0;

    for (var location = 1; location <= range; location++) {
        playerX = player.x;
        playerY = player.y;
        if (player.direction.x === 1) {
            targetX = playerX += location;
            targetY = playerY;
        } else if (player.direction.x === -1) {
            targetX = playerX -= location;
            targetY = playerY;
        } else if (player.direction.y === 1) {
            targetX = playerX;
            targetY = playerY += location;
        } else if (player.direction.y === -1) {
            targetX = playerX;
            targetY = playerY -= location;
        }
        if (!tiletypes[tile[targetX][targetY].type].passable && !tiletypes[tile[targetX][targetY].type].water) {
            target.x = targetX;
            target.y = targetY;
            target.obstacle = true;
            return target;
        }
        if (tile[targetX][targetY].monster) {
            target.id = tile[targetX][targetY].monster;
            target.x = targetX;
            target.y = targetY;
            target.found = true;

            return target;
        }
        target.x = targetX;
        target.y = targetY;
    }
    // water check
    if (tiletypes[tile[targetX][targetY].type].water) {
        target.water = true;
    }
    return target;
}

/**
 * Returns a range value for the weapon being shot based on the weapon range and the players skill with that weapon type.
 * This value then becomes the maximum potential range of the current shot.
 * @param weaponRange int
 * @param playerSkillLevel int
 * @returns {number}
 */
function rangeFinder(weaponRange, playerSkillLevel) {
    if (weaponRange === 0) {
        weaponRange = 1;
    }
    if (playerSkillLevel === 0) {
        playerSkillLevel = 1;
    }
    var skillBonus = Math.ceil(playerSkillLevel / 100 * 6) - 1;
    var skillRange = skillBonus;
    if (skillBonus > weaponRange) {
        skillRange = weaponRange;
    }
    var rangeCheck = Utilities.randomFromInterval(skillRange, weaponRange);
    var total = rangeCheck + skillBonus;
    //If the range is 1, half the potential (this is normally reserved for throwing heavy items)
    if (weaponRange === 1) {
        total = Math.floor(total / 2);
    }
    if (total < 1) {
        total++;
    }
    return total;
}

/**
 * Cycles through resting turns to emulate multi-threading (so game doesn't freeze)
 */
function restCycle() {

    if (game.loadingCycles > 0) {
        game.loadingCycles--;
        game.loadingData.rested++;
        passTurn("rest");
        if (tile[player.x + 1][player.y].monster || tile[player.x - 1][player.y].monster || tile[player.x][player.y + 1].monster || tile[player.x][player.y - 1].monster) {
            game.loadingCycles = -1;
        } else if (game.loadingData.startHealth > player.health) {
            game.loadingCycles = -1;
        } else if (game.loadingData.type === "rest" && player.stamina === player.dexterity) {
            //Stop resting if full stamina
            game.loadingCycles = -1;
        }
    }

    if (game.loadingCycles >= 1) {
        setZeroTimeout(restCycle);
    } else {
        ui.message(game.loadingData.type + "Turns", 'normal', [game.loadingData.rested]);
        if (game.loadingCycles === -1) {
            if (game.loadingData.type === "rest" && player.stamina === player.dexterity) {
                ui.message("staminaFull", "normal", false);
            } else {
                ui.message(game.loadingData.type + "Interrupted", "bad", false);
            }
        } else {
            ui.message("feelRested", 'normal', false);
            player.skillGain("camping", false, false);
        }
        game.staminaRegen = game.loadingData.defaultStaminaRegen;
        game.healthRegen = game.loadingData.defaultHealthRegen;
        game.hungerRegen = game.loadingData.defaultHungerRegen;
        game.thirstRegen = game.loadingData.defaultThirstRegen;
        passTurn(false);
        if (game.loadingData.invId) {
            damageItem(game.loadingData.invId);
        }
        $('#loading').hide();
    }
}
