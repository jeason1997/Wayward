/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

/**
 * Wayward Audio implements Audio, and adds a few functions and checks of our own.
 * @constructor
 */
function WAudio() {
    //Defaults and init
    this.sfx = {};
    this.music = {};
    this.soundList = [];
    this.musicPlaylist = ['shipwrecked', 'darkerworld', 'thefirstspark', 'nomadsheartbeat', 'thewildborn', 'nightowl', 'savage', 'underworld', 'shuddersounds','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
    this.musicTrack = 0;
    this.fileFormat = "mp3";

    /**
     * Test if we can play mp3s, otherwise fallback to ogg
     */
    this.testMP3 = function () {
        var mp3Test = new Audio();
        var canPlayMP3 = (typeof mp3Test.canPlayType === "function" && mp3Test.canPlayType("audio/mpeg") !== "");
        if (!canPlayMP3) {
            this.fileFormat = "ogg";
        }
    };

    /**
     * Play sounds
     * @param sound
     */
    this.playSound = function (sound) {
        //Sound or music off? NO PLAY!
        if (!ui.options.sound) {
            return;
        }
        //Sound not loaded yet? Load it, then play it.
        if (!this.sfx[sound]) {
            this.sfx[sound] = new Audio('sound/' + sound + '.' + this.fileFormat);
            this.sfx[sound].load();
        }
        //Get volume setting
        var volumeOption = 1;
        if (!ui.options.volume) {
            volumeOption = 0.5;
        }
        this.sfx[sound].volume = volumeOption;
        this.sfx[sound].play();
    };

    /**
     * Play music
     */
    this.playMusic = function () {
        //Sound or music off? NO PLAY!
        if (!ui.options.music || !ui.options.sound) {
            return;
        }
        //Music not loaded yet? Load it, then play it.
        if (!this.music[this.musicTrack]) {
            this.music[this.musicTrack] = new Audio('sound/' + this.musicPlaylist[this.musicTrack] + '.' + this.fileFormat);
            this.music[this.musicTrack].load();
        }
        //Get volume setting
        var volumeOption = 0.8;
        if (!ui.options.volume) {
            volumeOption = 0.4;
        }
        //Make sure all past tracks have stopped
        this.stopMusic();
        this.music[this.musicTrack].volume = volumeOption;
        this.music[this.musicTrack].play();
        var that = this;
        this.music[this.musicTrack].addEventListener('ended', function () {
            that.playMusic();
        });
        //Next track
        this.musicTrack++;
        //Reset the playlist once it gets to the end
        if (this.musicTrack >= this.musicPlaylist.length) {
            this.musicTrack = 0;
        }
    };

    /**
     * Switch tracks
     */
    this.changeTrack = function () {
        var lastTrack = this.musicTrack - 1;
        if (lastTrack < 0) {
            lastTrack = this.musicPlaylist.length - 1;
        }
        //Don't allow track switching until last one is loaded to stop multiple plays
        if (this.music[lastTrack].readyState >= 1) {
            this.stopMusic();
            //Reset the playlist once it gets to the end
            if (this.musicTrack >= this.musicPlaylist.length) {
                this.musicTrack = 0;
            }
            this.playMusic();
        }
    };

    /**
     * Stop all current music
     */
    this.stopMusic = function () {
        var lastTrack = this.musicTrack - 1;
        if (lastTrack < 0) {
            lastTrack = this.musicPlaylist.length - 1;
        }

        if (this.music[lastTrack]) {
            //If the audio hasn't even finished loading yet, don't bother pausing/setting time back
            if (this.music[lastTrack].readyState >= 1) {
                this.music[lastTrack].pause();
                this.music[lastTrack].currentTime = 0;
            }
            var that = this;
            this.music[lastTrack].removeEventListener('ended', function () {
                that.playMusic();
            });
        }
    };

    /**
     * Changes volume on all loaded/playing sounds/music
     */
    this.changeVolume = function () {
        //Get volume setting
        var volumeOption = 1;
        if (!ui.options.volume) {
            volumeOption = 0.5;
        }
        var musicKey = Object.keys(this.music);
        for (var music = 0; music < musicKey.length; music++) {
            if (this.music[musicKey[music]]) {
                this.music[musicKey[music]].volume = volumeOption;
            }
        }
        var sfxKey = Object.keys(this.sfx);
        for (var sfx = 0; sfx < sfxKey.length; sfx++) {
            if (this.sfx[sfxKey[sfx]]) {
                this.sfx[sfxKey[sfx]].volume = volumeOption;
            }
        }
    };

    /**
     * Queues a sound effect to play (controlled via renderoverlay)
     * @param soundEffect
     * @returns {boolean}
     */
    this.queueSfx = function (soundEffect) {
        if (ui.options.sound) {
            this.soundList.push(soundEffect);
            return true;
        }
        return false;
    };

    this.testMP3();
}