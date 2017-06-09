/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

/**
 * Provides a home for a number of micro functions.
 * @type {{randomFromInterval: Function, roundNumber: Function, getURLData: Function}}
 */
var Utilities = {

    /**
     * Returns a random number between the two provided.
     * @param from
     * @param to
     * @returns {number}
     */
    randomFromInterval: function (from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },
    /**
     * Returns a round Number.
     * @param num
     * @param dec
     * @returns {number}
     */
    roundNumber: function (num, dec) {
        return Math.round(Math.round(num * Math.pow(10, dec + 1)) / Math.pow(10, 1)) / Math.pow(10, dec);
    },
    /**
     * Allows you to search for GET data in the url and returns their values
     * @param query string
     * @param search string
     * @returns string
     */
    getURLData: function (query, search) {
        search = (search) ? search : window.location.search;
        var returnData = new RegExp('&amp;' + query + '=([^&amp;]*)', 'i');
        return (search = search.replace(/^\?/, '&amp;').match(returnData)) ? search = search[1] : search = '';
    },
    /**
     * Pseudo random number generator with seeded values
     * @param seed integer
     * @returns {number}
     */
    pRNG: {
        m: 0x100000000,
        a: 1103515245,
        c: 12345,
        state: new Date().getTime(),
        nextInt: function () {
            this.state = (this.a * this.state + this.c) % this.m;
            return this.state;
        },
        nextFloat: function () {
            return this.nextInt() / (this.m - 1);
        }
    }
};

/**
 * setZeroTimeout implementation in closure via /dbaron.org/mozilla/zero-timeout
 */
(function() {
    var timeouts = [];
    var messageName = "zero-timeout-message";
    
    /**
     * Pass a function to setZeroTimeout to allow for pseudo multi-threading (which is faster than setTimeout since it's locked to 4ms as per spec)
     * @param fn string
     */
    function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, "*");
    }

    /**
     * Handle the postMessage event that we use for the faux-timeout
     * @param event object
     */
    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                var fn = timeouts.shift();
                fn();
            }
        }
    }

    window.addEventListener("message", handleMessage, true);
    window.setZeroTimeout = setZeroTimeout;
})();

/**
 * Convert tileData to the new format!
 * Note: Moved here for safekeeping....just in case we need it for 1.9
 * @returns {Array}
 */
function convertTileData() {
    var newTileData = [];
    var stackItem;
    for (var tileX = 0; tileX < tileData.length; tileX++) {
        if (tileData[tileX] != null) {
            var tileDataKey = Object.keys(tileData[tileX]);
            newTileData[tileX] = {};
            for (var tileY = 0; tileY < tileDataKey.length; tileY++) {
                newTileData[tileX][tileDataKey[tileY]] = [];
                if (tileData[tileX][tileDataKey[tileY]].type) {
                    stackItem = {};
                    stackItem.type = tileData[tileX][tileDataKey[tileY]].type;
                    if (tiletypes[stackItem.type]) {
                        if (tileData[tileX][tileDataKey[tileY]].strength && tileData[tileX][tileDataKey[tileY]].strength != undefined) {
                            stackItem.strength = tileData[tileX][tileDataKey[tileY]].strength;
                        } else if (tiletypes[stackItem.type].strength) {
                            stackItem.strength = tiletypes[stackItem.type].strength;
                        }
                        if (tiletypes[stackItem.type].durability) {
                            stackItem.mindur = tiletypes[stackItem.type].durability;
                            stackItem.maxdur = tiletypes[stackItem.type].durability;
                        }
                        newTileData[tileX][tileDataKey[tileY]].push(stackItem);
                    }
                }
                if (tileData[tileX][tileDataKey[tileY]].stack && tileData[tileX][tileDataKey[tileY]].stack.length > 0) {
                    for (var stack = 0; stack < tileData[tileX][tileDataKey[tileY]].stack.length; stack++) {
                        stackItem = {};
                        stackItem.type = tileData[tileX][tileDataKey[tileY]].stack[stack];
                        if (tiletypes[stackItem.type]) {
                            if (tiletypes[stackItem.type].strength) {
                                stackItem.strength = tiletypes[tileData[tileX][tileDataKey[tileY]].stack[stack]].strength;
                            }
                            if (tiletypes[stackItem.type].durability) {
                                stackItem.mindur = tiletypes[stackItem.type].durability;
                                stackItem.maxdur = tiletypes[stackItem.type].durability;
                            }
                            newTileData[tileX][tileDataKey[tileY]].push(stackItem);
                        }
                    }
                } else {
                    newTileData[tileX][tileDataKey[tileY]][0] = {};
                    newTileData[tileX][tileDataKey[tileY]][0].type = tileData[tileX][tileDataKey[tileY]].type;
                    if (tileData[tileX][tileDataKey[tileY]].strength) {
                        newTileData[tileX][tileDataKey[tileY]][0].strength = tileData[tileX][tileDataKey[tileY]].strength;
                    } else {
                        if (tiletypes[tileData[tileX][tileDataKey[tileY]].type].strength) {
                            newTileData[tileX][tileDataKey[tileY]][0].strength = tiletypes[tileData[tileX][tileDataKey[tileY]].type].strength;
                        }
                    }
                }
            }
        } else {
            newTileData[tileX] = null;
        }
    }
    return newTileData;
}

