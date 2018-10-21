﻿function MainMenu() {
    this.background = null;
    this.castle = null;
    this.music = null;
    /* Main Menu looks like this:
    |     Shape Clear   |
    |       [Play!]     |
    |       [Help ]     |
    |[*]            v0.5|
    */
    this.title = null;
    this.btnPlay = null;
    this.lblPlay = null;
    this.btnHelp = null;
    this.lblHelp = null;
    this.lblVersion = null;
    this.ball1 = this.ball2 = null; // Ball to test animation
}

MainMenu.prototype.create = function () {
    this.game.version = 'v0.6.0';
    this.background = this.add.image(0, 0, 'background');
    this.castle = this.add.image(this.game.width/2, this.game.height * 0.705, 'castle');
    this.castle.anchor.set(0.5, 0.72);
    this.music = this.add.sound('music');
    this.music.loop = true;
    this.music.play();
    this.ball1 = new Ball(this.game, /*speed: */5);
    this.add.existing(this.ball1);
    this.ball2 = new Ball(this.game, /*speed: */5, [this.ball1]);
    this.add.existing(this.ball2);
    this.ball3 = new Ball(this.game, /*speed: */5, [this.ball1, this.ball2]);
    this.add.existing(this.ball3);
    game.input.addMoveCallback(this.move, this);
    this.title = this.add.text(-1000, -1000, 'Shape Clear');
    this.title.anchor.set(0.5, 0.5);
    this.title.inputEnabled = true;
    this.title.events.onInputUp.add(function () {
        var xp = localStorage.ShapeClear_xp || 0;
        var times = localStorage.ShapeClear_played || 0;
        var lv = 1;
        var req;
        while (lv < 50 && xp > (req = Math.floor(prank(lv+1, 40)) * 10)) {
            lv++;
        }
        alertBox(
          "Copyright (c) 2016~2018 Yi-Feng Chen(陳羿豐)\n" +
          "Licensed under MIT license\n" +
          "This game uses Phaser game engine\n" +
          "Lv. " + lv + " xp: " + xp + "/" + req + "\n" +
          "You played " + times + " times"
        );
        Debug.createSpecial ^= 1;
    }, this);
    this.btnPlay = this.add.button(-1000, -1000, 'ui', this.playGame, this, 'buttonHover', 'button', 'buttonPressed', 'button');
    this.btnPlay.anchor.set(0.5, 0.5);
    this.btnPlay.tint = 0xffff00;
    this.lblPlay = this.add.text(-1000, -1000, 'Play!');
    this.lblPlay.anchor.set(0.5, 0.5);
    this.btnHelp = this.add.button(-1000, -1000, 'ui', this.playGame, this, 'buttonHover', 'button', 'buttonPressed', 'button');
    this.btnHelp.anchor.set(0.5, 0.5);
    this.btnHelp.tint = 0xffff00;
    this.lblHelp = this.add.text(-1000, -1000, 'Board with holes');
    this.lblHelp.anchor.set(0.5, 0.5);
    this.lblVersion = this.add.text(-1000, -1000, this.game.version);
    this.lblVersion.anchor.set(1, 1);
    this.game.bounceTime = 0;
};

MainMenu.prototype.paused = function () {
    console.log("paused");
    this.music.pause();
};

MainMenu.prototype.resumed = function () {
    console.log("resumed");
    this.music.resume();
}

MainMenu.prototype.update = function () {
    var gw = this.game.width, gh = this.game.height, dim = Math.min(gw, gh);
    this.background.width = gw;
    this.background.height = gh;
    var castleScale = Math.min(gh * 0.9, gw) / 800;
    this.castle.scale.set(castleScale, castleScale);
    this.castle.position.set(gw / 2, gh * 0.705);
    this.title.fontSize = dim / 10;
    this.lblPlay.fontSize = dim / 18;
    this.lblHelp.fontSize = dim / 25;
    this.lblVersion.fontSize = dim / 25;
    if (gw > gh) {
        this.title.position.set(gw / 2, gh * 0.2);
        this.btnPlay.position.set(gw / 2, gh * 0.5);
        this.btnHelp.position.set(gw / 2, gh * 0.7);
    }
    else {
        this.title.position.set(gw / 2, gh * 0.5 - gw * 0.3);
        this.btnPlay.position.set(gw / 2, gh * 0.5);
        this.btnHelp.position.set(gw / 2, gh * 0.5 + gw * 0.2);
    }
    this.lblPlay.position.copyFrom(this.btnPlay.position);
    this.lblPlay.y += window.devicePixelRatio || 1;
    this.btnPlay.scale.setTo(dim / 360);
    this.lblHelp.position.copyFrom(this.btnHelp.position);
    this.lblHelp.y += window.devicePixelRatio || 1;
    this.btnHelp.scale.setTo(dim / 360);
    this.lblVersion.position.set(gw, gh);
    this.lblVersion.text = this.game.version + '.' + this.game.bounceTime;
};

MainMenu.prototype.move = function(pointer, x, y){
    if (pointer.isDown) {
        this.ball1.pointTo(x, y);
        this.ball2.pointTo(x, y);
        this.ball3.pointTo(x, y);
    }
};

MainMenu.prototype.playGame = function (btn) {
    if (/Pressed/.test(btn.frameName)) {
        if (btn === this.btnPlay) {
            Debug.testDiagonalFall = false;
            this.state.start("GameScreen");
        }
        else if (btn === this.btnHelp) {
          this.state.start("GameScreen");
            Debug.testDiagonalFall = true;
            this.state.start("GameScreen");
        }
    }
};

MainMenu.prototype.shutdown = function () {
    this.music.destroy();
    this.music = null;
};
