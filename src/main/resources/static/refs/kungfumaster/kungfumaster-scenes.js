class title extends Phaser.Scene {
    constructor(t, e, s) {
        super({
            key: "title"
        })
    }
    preload() {
        this.load.audio("gamestart", ["audio/gamestart.mp3"]), this.load.audio("levelstart", ["audio/levelstart.mp3"]), this.load.image("title", "images/kungfumastertitle.png"), this.load.image("intro", "images/intro.png"), this.load.image("irem", "images/iremtext.png"), this.load.image("punchtarget", "images/punchtarget.png"), this.load.image("kicktarget", "images/kicktarget.png"), this.load.image("highkicktarget", "images/highkicktarget.png"), this.load.image("phaser", "images/phaser3-logo.png"), this.load.spritesheet("thomaswalk", "images/thomaswalk.png", {
            frameWidth: 54,
            frameHeight: 126
        }), this.load.spritesheet("thomaskick", "images/thomaskick.png", {
            frameWidth: 86,
            frameHeight: 124
        }), this.load.spritesheet("thomasjump", "images/thomasjump.png", {
            frameWidth: 34,
            frameHeight: 136
        }), this.load.spritesheet("thomassteps", "images/thomassteps.png", {
            frameWidth: 44,
            frameHeight: 124
        }), this.load.spritesheet("thomassweep", "images/thomassweep.png", {
            frameWidth: 98,
            frameHeight: 84
        }), this.load.spritesheet("thomaspunch", "images/thomaspunch.png", {
            frameWidth: 56,
            frameHeight: 124
        }), this.load.spritesheet("thomaspunchdown", "images/thomaspunchdown.png", {
            frameWidth: 60,
            frameHeight: 98
        }), this.load.spritesheet("thomasdeath", "images/thomasdeath.png", {
            frameWidth: 76,
            frameHeight: 118
        })
    }
    create() {
        this.cursors = this.input.keyboard.createCursorKeys(), this.input.keyboard.on("keydown_Z", this.startGame, this), this.input.keyboard.on("keydown_X", this.startGame, this), this.defineSounds(), this.readyToPlay = !1, this.currentpage = 0, this.timeHandler, this.page1 = this.add.group(), this.createPage1()
    }
    update() {
        this.cursors.space.isDown && this.startGame()
    }
    startGame() {
        this.sounds.playSound("gamestart"), this.time.delayedCall(500, this.gameStarted, [], this)
    }
    gameStarted() {
        this.scene.start("intro")
    }
    createPage1() {
        this.page1.add(this.add.image(300, 100, "title")), this.page1.add(this.add.image(300, 470, "irem")), this.page1.add(this.add.image(48, 484, "phaser")), Utilities.addText(this.page1, "COIN   PLAYER", "#FFFFFF", "#FF0000", 218, 180, this), Utilities.addText(this.page1, "1", "#FFFF00", "#FF0000", 192, 180, this), Utilities.addText(this.page1, "1", "#FFFF00", "#FF0000", 296, 180, this), Utilities.addText(this.page1, "KICK TO START", "#FFFF00", "#FF0000", 208, 208, this), Utilities.addText(this.page1, "CURSOR KEYS TO MOVE", "#FFFFFF", "#FF0000", 164, 380, this), Utilities.addText(this.page1, "KICK    PUNCH", "#FFFFFF", "#FF0000", 220, 410, this), Utilities.addText(this.page1, "Z       X", "#FFFF00", "#FF0000", 192, 410, this), this.player = new Player(this, 0, 0, !0), this.player.body.reset(300, 360), this.player.setStatus(Player.PlayerStatus.ATTRACT1)
    }
    switchPages() {
        switch (this.currentpage++, this.currentpage) {
            case 1:
                this.page1.setVisible(!0)
        }
    }
    defineSounds() {
        this.sounds = SoundManager.getInstance(), this.sounds.addSound("gamestart", this)
    }
}
class intro extends Phaser.Scene {
    constructor(t, e, s) {
        super({
            key: "intro"
        })
    }
    preload() {}
    create() {
        this.add.image(300, 248, "intro"), this.sounds = SoundManager.getInstance(), this.sounds.addSound("levelstart", this), this.sounds.playSound("levelstart"), this.time.delayedCall(6e3, this.startGame, [], this)
    }
    update() {}
    startGame() {
        this.scene.start("main")
    }
}
class main extends Phaser.Scene {
    constructor(t, e, s) {
        super({
            key: "main"
        }), this.rnd = Phaser.Math.RND, this.gameState = main.GameState.INIT, this.debugState = {
            game: !1,
            enemies: !1,
            scores: !1,
            player: !1,
            layer: !1
        }
    }
    static GameState = {
        INIT: 0,
        INTRO: 1,
        PLAYING: 2,
        DEATH: 3,
        LEVELEND: 4,
        LEVELUP: 5,
        GAMEOVER: 6,
        DEATHRESTART: 7,
        INTERMISSION: 8
    };
    preload() {
        this.cursors = this.input.keyboard.createCursorKeys(), this.load.audio("bonus", ["audio/bonus.mp3"]), this.load.audio("gamestart", ["audio/gamestart.mp3"]), this.load.audio("levelend", ["audio/levelend.mp3"]), this.load.audio("levelstart", ["audio/levelstart.mp3"]), this.load.audio("playerpunch", ["audio/playerpunch.mp3"]), this.load.audio("upstep", ["audio/upstep.mp3"]), this.load.audio("walkin", ["audio/walkin.mp3"]), this.load.audio("musicloop", ["audio/musicloop.mp3"]), this.load.audio("bossdeath", ["audio/bossdeath.mp3"]), this.load.audio("gameover", ["audio/gameover.mp3"]), this.load.audio("oof", ["audio/oof.mp3"]), this.load.image("thugstuck", "images/thugstuck.png"), this.load.image("smallguystuck", "images/smallguystuck.png"), this.load.image("oof", "images/oof.png"), this.load.image("blood", "images/blood.png"), this.load.image("knife", "images/knife.png"), this.load.image("thomashighkick", "images/thomashighkick.png"), this.load.image("thomashealthbarbackground", "images/thomashealthbarbackground.png"), this.load.image("thomashealthbar", "images/thomashealthbar.png"), this.load.image("thomashead", "images/thomashead.png"), this.load.image("thomasknockback", "images/thomasknockback.png"), this.load.image("enemyhealthbarbackground", "images/enemyhealthbarbackground.png"), this.load.image("enemyhealthbar", "images/enemyhealthbar.png"), this.load.image("knifemankickhit", "images/knifemankickhit.png"), this.load.image("knifemanpunchhit", "images/knifemankickhit.png"), this.load.image("boss1highswing", "images/boss1highswing.png"), this.load.image("boss1lowswing", "images/boss1lowswing.png"), this.load.image("boss3foot", "images/boss3foot.png"), this.load.image("boss3fist", "images/boss3fist.png"), this.load.image("snakepot", "images/snakepot.png"), this.load.image("dragonball", "images/dragonball.png"), this.load.image("dragonfire", "images/dragonfire.png"), this.load.image("shrapnelball", "images/shrapnelball.png"), this.load.image("shrapnel", "images/shrapnel.png"), this.load.spritesheet("thugdeath", "images/thugdeath.png", {
            frameWidth: 82,
            frameHeight: 106
        }), this.load.spritesheet("smallguydeath", "images/smallguydeath.png", {
            frameWidth: 62,
            frameHeight: 72
        }), this.load.spritesheet("knifemanwalk", "images/knifemanwalk.png", {
            frameWidth: 46,
            frameHeight: 118
        }), this.load.spritesheet("knifemanhighthrow", "images/knifemanhighthrow.png", {
            frameWidth: 54,
            frameHeight: 140
        }), this.load.spritesheet("knifemanlowthrow", "images/knifemanlowthrow.png", {
            frameWidth: 64,
            frameHeight: 116
        }), this.load.spritesheet("knifemandeath", "images/knifemandeath.png", {
            frameWidth: 94,
            frameHeight: 104
        }), this.load.spritesheet("boss1walk", "images/boss1walk.png", {
            frameWidth: 64,
            frameHeight: 128
        }), this.load.spritesheet("boss1high", "images/boss1high.png", {
            frameWidth: 64,
            frameHeight: 154
        }), this.load.spritesheet("boss1low", "images/boss1low.png", {
            frameWidth: 80,
            frameHeight: 112
        }), this.load.spritesheet("boss1death", "images/boss1death.png", {
            frameWidth: 78,
            frameHeight: 132
        }), this.load.spritesheet("boss2walk", "images/boss2walk.png", {
            frameWidth: 60,
            frameHeight: 142
        }), this.load.spritesheet("boss2highthrow", "images/boss2highthrow.png", {
            frameWidth: 60,
            frameHeight: 142
        }), this.load.spritesheet("boss2throw", "images/boss2throw.png", {
            frameWidth: 68,
            frameHeight: 104
        }), this.load.spritesheet("boss2weapon", "images/boss2weapon.png", {
            frameWidth: 26,
            frameHeight: 18
        }), this.load.spritesheet("boss2death", "images/boss2death.png", {
            frameWidth: 94,
            frameHeight: 102
        }), this.load.spritesheet("boss3walk", "images/boss3walk.png", {
            frameWidth: 58,
            frameHeight: 176
        }), this.load.spritesheet("boss3kick", "images/boss3kick.png", {
            frameWidth: 82,
            frameHeight: 160
        }), this.load.spritesheet("boss3punch", "images/boss3punch.png", {
            frameWidth: 54,
            frameHeight: 160
        }), this.load.spritesheet("boss3death", "images/boss3death.png", {
            frameWidth: 114,
            frameHeight: 174
        }), this.load.spritesheet("levelindicator", "images/levelindicator.png", {
            frameWidth: 16,
            frameHeight: 24
        }), this.load.spritesheet("thugwalk", "images/thugwalk.png", {
            frameWidth: 40,
            frameHeight: 126
        }), this.load.spritesheet("smallguy", "images/smallguy.png", {
            frameWidth: 32,
            frameHeight: 86
        }), this.load.spritesheet("potsmash", "images/potsmash.png", {
            frameWidth: 64,
            frameHeight: 32
        }), this.load.spritesheet("potexplode", "images/potexplode.png", {
            frameWidth: 62,
            frameHeight: 62
        }), this.load.spritesheet("snake", "images/snake.png", {
            frameWidth: 40,
            frameHeight: 32
        }), this.load.spritesheet("dragon", "images/dragon.png", {
            frameWidth: 42,
            frameHeight: 128
        }), this.load.image("tiles", "images/background-tiles.png"), this.load.tilemapTiledJSON("level1", "levels/level1.json"), this.load.tilemapTiledJSON("level2", "levels/level2.json"), this.load.tilemapTiledJSON("level3", "levels/level3.json")
    }
    create() {
        this.level = 0, this.lives = 3, this.score = 0, this.hiScore = 0, this.defineSounds(), this.createObjects(), this.createScoreBoard(), this.createTextIntro(), this.addDebugInfo(), this.player = new Player(this, 0, 0, this.debugState.player), this.input.keyboard.on("keydown_Z", this.player.kick, this.player), this.input.keyboard.on("keydown_X", this.player.punch, this.player), this.levelup()
    }
    levelup() {
        this.level++, this.actualLevel = (this.level - 1) % 3 + 1, this.timeLeft = 2e3, this.timeDeduct = .4 + .1 * this.level, this.createLevelMap(), this.cameras.main.setBounds(0, 0, this.levelData.widthInPixels, this.levelData.heightInPixels), this.screenCreep = 0, this.enemyCount = 0, this.boss = null;
        for (let t = 0; t < 5; t++) {
            let e = this.levelIndicators.children.getArray()[t];
            t < this.actualLevel - 1 ? e.setStatus(Level.LevelStatus.PLAYED) : t == this.actualLevel - 1 ? e.setStatus(Level.LevelStatus.CURRENT) : e.setStatus(Level.LevelStatus.UNPLAYED)
        }
        this.actualLevel % 2 == 1 ? (this.screenCreepCalc = Math.min, this.flipped = !0, this.player.activatePlayer(!0, this.levelData.widthInPixels - 200, 416)) : (this.screenCreepCalc = Math.max, this.flipped = !1, this.player.activatePlayer(!1, 200, 416)), this.adjustEnemyHealth(200), this.adjustThomasHealth(200), this.setGameState(main.GameState.INTRO), this.screenCreep = this.cameras.main.scrollX, this.enemyData = [...Constants.enemyData[this.actualLevel - 1]], this.getNextEnemy(), this.children.bringToTop(this.player), this.children.bringToTop(this.player.blood), this.children.bringToTop(this.player.oof), this.children.bringToTop(this.graphics)
    }
    update() {
        switch (this.updateDebugInfo(), this.gameState) {
            case main.GameState.PLAYING:
                this.screenCreep = this.screenCreepCalc(this.screenCreep, this.cameras.main.scrollX), !this.player || this.player.status != Player.PlayerStatus.NORMAL && this.player.status != Player.PlayerStatus.DOWN && this.player.status != Player.PlayerStatus.STUCK || this.player.handleInput(this), this.player && (this.kickCollisionCheck(this.thugs), this.punchCollisionCheck(this.thugs), this.kickCollisionCheck(this.smallguys), this.punchCollisionCheck(this.smallguys), this.kickCollisionCheck(this.snakepots), this.punchCollisionCheck(this.snakepots), this.kickCollisionCheck(this.shrapnel), this.kickCollisionCheck(this.dragons), this.punchCollisionCheck(this.dragons), this.knifeManCollisionCheck(this.rightKnifeman), this.knifeManCollisionCheck(this.leftKnifeman), this.boss && (this.kickCollisionCheck(this.boss), this.punchCollisionCheck(this.boss), this.boss.hitCheck())), this.baddieCheck(), this.timeLeft -= this.timeDeduct, this.updateTime(), this.timeLeft <= 0 && this.player.setStatus(Player.PlayerStatus.DEATH)
        }
    }
    kickCollisionCheck(t) {
        this.physics.overlap(this.player.kickTarget, t, this.player.kickHandler, null, this.player), this.physics.overlap(this.player.highkickTarget, t, this.player.kickHandler, null, this.player)
    }
    punchCollisionCheck(t) {
        this.physics.overlap(this.player.punchTarget, t, this.player.punchHandler, null, this.player)
    }
    knifeManCollisionCheck(t) {
        t.status != Knifeman.KnifemanStatus.DEATH && t.status != Knifeman.KnifemanStatus.INACTIVE && (this.kickCollisionCheck(t), this.punchCollisionCheck(t), t.knife.status == Knife.KnifeStatus.THROWN && this.physics.overlap(this.player, t.knife, t.knife.playerHandler, null, t.knife))
    }
    addDebugInfo() {
        this.debugText = this.add.text(10, 0, "", {
            font: "12px Courier",
            fill: "#00ff00",
            backgroundColor: "#000"
        }), this.debugText.setScrollFactor(0)
    }
    updateDebugInfo() {
        let t = "";
        this.debugState.game && (t += "\nGame: " + Utilities.enumValue(main.GameState, this.gameState), t += "\nLevel: " + this.level, t += "\nActualLevel: " + this.actualLevel, t += "\nLives: " + this.lives), this.debugState.player && this.player && (t += "\nPlayer : X" + this.player.x + "," + this.player.y, t += "\nflipValue : " + this.player.flipValue, t += "\nStatus : " + Utilities.enumValue(Player.PlayerStatus, this.player.status), t += "\nthugInfo : " + (this.player.thugLeft.length + this.player.thugRight.length) + ", drain:" + this.player.thugDrain), this.debugState.layer && (t += "\nLayer: x: " + this.cameras.main.scrollX, t += "\nScreenCreep: " + this.screenCreep), this.debugState.enemies && (this.nextEnemy ? (t += "\nEnemy: x: " + this.nextEnemy.x + ", flip: ", t += (this.nextEnemy.flip ? this.nextEnemy.flip.toString() : "n/a") + ", type: " + Utilities.enumValue(Constants.enemyTypes, this.nextEnemy.type)) : t += "\nEnemy: None"), "" != t && this.debugText.setText(t)
    }
    createLevelMap() {
        this.levelData = this.make.tilemap({
            key: "level" + this.actualLevel
        }), this.tiles = this.levelData.addTilesetImage("Background", "tiles"), this.layer && this.layer.destroy(), this.layer = this.levelData.createStaticLayer("Tile Layer 1", this.tiles), this.children.sendToBack(this.layer)
    }
    createTextIntro() {
        this.textIntroGroup = this.add.group(), this.introText = this.centreText("  1-PLAYER 1-FLOOR  ", 240, this.textIntroGroup), this.centreText("  READY  ", 264)
    }
    createGameOverText() {
        this.textGameOverGroup = this.add.group(), this.centreText("  GAME OVER  ", 240, this.textGameOverGroup)
    }
    centreText(t, e, s) {
        let i = this.add.text(0, e + 2, t, {
            backgroundColor: "#000",
            fontFamily: Constants.defaultFont,
            fontSize: Constants.largerFontSize,
            color: "#f00",
            fontStyle: "bold"
        });
        i.setPosition(300 - i.width / 2 + 2, e + 2), i.setScrollFactor(0), this.textIntroGroup.add(i);
        let a = this.add.text(0, e + 2, t, {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.largerFontSize,
            color: "#ff0",
            fontStyle: "bold"
        });
        return a.setPosition(300 - a.width / 2, e), a.setScrollFactor(0), this.textIntroGroup.add(a), {
            text: i,
            shadow: a
        }
    }
    createScoreBoard() {
        this.scoreGroup = this.add.group();
        let t = this.add.text(4, 0, "1UP-", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#0ff",
            fontStyle: "bold"
        });
        t.setScrollFactor(0), this.scoreGroup.add(t), this.scoreText = this.add.text(72, 0, "000000", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#0ff",
            fontStyle: "bold"
        }), this.scoreText.setScrollFactor(0), this.scoreGroup.add(this.scoreText), t = this.add.text(240, 0, "TOP-", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#f00",
            fontStyle: "bold"
        }), t.setScrollFactor(0), this.scoreGroup.add(t), this.hiScoreText = this.add.text(292, 0, "000000", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#f00",
            fontStyle: "bold"
        }), this.hiScoreText.setScrollFactor(0), this.scoreGroup.add(this.hiScoreText), t = this.add.text(4, 32, "PLAYER", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#ff0",
            fontStyle: "bold"
        }), t.setScrollFactor(0), this.scoreGroup.add(t), t = this.add.text(4, 64, "ENEMY", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#f0f",
            fontStyle: "bold"
        }), t.setScrollFactor(0), this.scoreGroup.add(t), t = this.add.text(452, 0, "2UP-000000", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#0ff",
            fontStyle: "bold"
        }), t.setScrollFactor(0), this.scoreGroup.add(t), t = this.add.text(512, 32, "TIME", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#fff",
            fontStyle: "bold"
        }), t.setScrollFactor(0), this.scoreGroup.add(t), this.timeText = this.add.text(512, 50, "0000", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#fff",
            fontStyle: "bold"
        }), this.timeText.setScrollFactor(0), this.scoreGroup.add(this.timeText), t = this.add.text(312, 32, "1F-2F-3F-4F-5F", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#fff",
            fontStyle: "bold"
        }), t.setScrollFactor(0), this.scoreGroup.add(t);
        let e = this.add.image(200, 40, "thomashealthbarbackground");
        e.setScrollFactor(0), this.scoreGroup.add(e), e = this.add.image(200, 72, "enemyhealthbarbackground"), e.setScrollFactor(0), this.scoreGroup.add(e), this.thomasHealth = this.add.image(200, 40, "thomashealthbar"), this.thomasHealth.setScrollFactor(0), this.scoreGroup.add(this.thomasHealth), this.enemyHealth = this.add.image(200, 72, "enemyhealthbar"), this.enemyHealth.setScrollFactor(0), this.scoreGroup.add(this.enemyHealth), this.levelIndicators = new Levels(this, 5), this.levelIndicators.addLevels();
        for (let t = 0; t < this.lives; t++) this.drawLives(t)
    }
    drawLives(t) {
        let e = this.add.image(16 * t + 560, 84, "thomashead");
        e.setScrollFactor(0), this.livesDisplay.push(e)
    }
    setGameState(t) {
        switch (this.gameState = t, t) {
            case main.GameState.INTRO:
                this.introText.text.setText("  1-PLAYER " + this.actualLevel + "-FLOOR  "), this.introText.shadow.setText("  1-PLAYER " + this.actualLevel + "-FLOOR  "), this.textIntroGroup.setVisible(!0), this.thomasHealth.setCrop();
                break;
            case main.GameState.PLAYING:
                this.textIntroGroup.setVisible(!1), this.stopSound("walkin"), this.playSound("musicloop", {
                    loop: !0
                });
                break;
            case main.GameState.DEATH:
                this.boss && this.boss.stand(), this.stopSound("musicloop"), this.lives--, this.lives > -1 ? this.time.delayedCall(4e3, this.setGameState, [main.GameState.DEATHRESTART], this) : this.time.delayedCall(2e3, this.setGameState, [main.GameState.GAMEOVER], this);
                break;
            case main.GameState.LEVELUP:
                this.bonusPoints();
                break;
            case main.GameState.DEATHRESTART:
                this.rightKnifeman.remove(), this.leftKnifeman.remove(), this.boss && this.boss.remove(), this.livesDisplay[this.lives].destroy(), this.livesDisplay.splice(this.lives, 1), this.level--, this.levelup();
                break;
            case main.GameState.GAMEOVER:
                this.createGameOverText(), this.playSound("gameover"), this.time.delayedCall(4e3, this.exitGame, [], this)
        }
    }
    exitGame() {
        this.scene.start("title")
    }
    bonusPoints() {
        this.timeLeft > 0 ? (this.timeLeft -= 10, this.updateTime(), this.updateScore(10), this.playSound("bonus"), this.time.delayedCall(20, this.bonusPoints, [], this)) : (this.timeLeft = 0, this.updateTime(), this.time.delayedCall(1e3, this.showIntermission, [], this))
    }
    showIntermission() {
        this.setGameState(main.GameState.INTERMISSION);
        const t = this.scene.get("intermission");
        this.scene.switch("intermission"), t.title1Group && t.reset()
    }
    baddieCheck() {
        for (; null != this.nextEnemy && (this.flipped && this.nextEnemy.x >= this.screenCreep || !this.flipped && this.nextEnemy.x <= this.screenCreep);)
            if (this.nextEnemy.type == Constants.enemyTypes.BOSS1) this.createBoss(Boss1, this.nextEnemy);
            else if (this.nextEnemy.type == Constants.enemyTypes.BOSS2) this.createBoss(Boss2, this.nextEnemy);
        else if (this.nextEnemy.type == Constants.enemyTypes.BOSS3) this.createBoss(Boss3, this.nextEnemy);
        else {
            if (this.nextEnemy.flip && this.rightKnifeman.status == Knifeman.KnifemanStatus.INACTIVE || !this.nextEnemy.flip && this.leftKnifeman.status == Knifeman.KnifemanStatus.INACTIVE) switch (this.nextEnemy.type) {
                case Constants.enemyTypes.THUG:
                    this.thugs.addSingleThug(this.nextEnemy);
                    break;
                case Constants.enemyTypes.SMALLGUY:
                    this.smallguys.addSingleSmallGuy(this.nextEnemy);
                    break;
                case Constants.enemyTypes.KNIFEMAN:
                    this.nextEnemy.flip ? this.rightKnifeman.activateKnifeman(this.nextEnemy) : this.leftKnifeman.activateKnifeman(this.nextEnemy);
                    break;
                case Constants.enemyTypes.SNAKE:
                    this.snakepots.addSingleSnakepot(this.nextEnemy);
                    break;
                case Constants.enemyTypes.DRAGON:
                    this.dragons.addSingleDragon(this.nextEnemy);
                    break;
                case Constants.enemyTypes.SHRAPNEL:
                    this.shrapnel.addSingleShrapnelBall(this.nextEnemy)
            }
            this.getNextEnemy()
        }
    }
    createBoss(t) {
        this.boss = new t(this, 0, 0), this.boss.activateBoss(this.nextEnemy), this.nextEnemy = null, this.children.bringToTop(this.player.oof), this.children.bringToTop(this.player.blood)
    }
    getNextEnemy() {
        let t = this.enemyData.splice(0, 1);
        1 == t.length ? this.nextEnemy = t[0] : this.nextEnemy = null
    }
    createObjects() {
        this.thugs = new Thugs(this, 8), this.smallguys = new SmallGuys(this, 8), this.leftKnifeman = new Knifeman(this, -1e3, -1e3), this.rightKnifeman = new Knifeman(this, -1e3, -1e3), this.snakepots = new Snakepots(this, 4), this.dragons = new Dragons(this, 4), this.shrapnel = new ShrapnelBalls(this, 6), this.livesDisplay = []
    }
    adjustThomasHealth(t) {
        this.thomasHealth.setCrop(0, 0, t, 16), t <= 0 && this.setGameState(main.GameState.DEATH)
    }
    adjustEnemyHealth(t) {
        this.enemyHealth.setCrop(0, 0, t, 16), 0 == t && (this.setGameState(main.GameState.LEVELEND), this.player.setStatus(Player.PlayerStatus.LEVELEND))
    }
    updateTime() {
        this.timeLeft <= 0 && (this.timeLeft = 0);
        let t = "0000" + Math.floor(this.timeLeft);
        this.timeText.setText(t.substring(t.length - 4))
    }
    updateScore(t) {
        this.score += t, this.scoreText.setText(this.score.toString().padStart(6, "0")), this.score > this.hiScore && (this.hiScore = this.score, this.hiScoreText.setText(this.hiScore.toString().padStart(6, "0")))
    }
    defineSounds() {
        this.sounds = SoundManager.getInstance(), this.sounds.addSound("bonus", this), this.sounds.addSound("gamestart", this), this.sounds.addSound("levelend", this), this.sounds.addSound("playerpunch", this), this.sounds.addSound("upstep", this), this.sounds.addSound("walkin", this), this.sounds.addSound("musicloop", this), this.sounds.addSound("bossdeath", this), this.sounds.addSound("gameover", this), this.sounds.addSound("oof", this)
    }
    playSound(t, e) {
        this.sounds.playSound(t, e)
    }
    stopSound(t) {
        this.sounds.stopSound(t)
    }
}
class intermission extends Phaser.Scene {
    constructor(t, e, s) {
        super({
            key: "intermission"
        })
    }
    preload() {
        this.load.audio("intermissionlaugh", ["audio/intermissionlaugh.mp3"]), this.load.image("chair", "images/chair.png"), this.load.spritesheet("sylviasitting", "images/sylviasitting.png", {
            frameWidth: 46,
            frameHeight: 96
        })
    }
    create() {
        console.log("intermission.create"), this.sounds = SoundManager.getInstance(), this.sounds.addSound("intermissionlaugh", this), this.add.image(140, 370, "chair"), this.player = new Player(this, 0, 0), this.player.activatePlayer(!0, 450, 402, Player.PlayerStatus.INTERMISSION), this.sylvia = new Sylvia(this, 0, 0), this.sylvia.activateSylvia(152, 360, Sylvia.SylviaStatus.SITTING), this.title1Group = this.add.group(), this.title2Group = this.add.group(), this.sylviaGroup = this.add.group(), this.thomasGroup = this.add.group(), Utilities.addText(this.title1Group, "LET'S TRY NEXT FLOOR", "#FFFFFF", "#000000", 160, 60, this, !0), Utilities.addText(this.title2Group, "BACK TO THE GROUND FLOOR", "#FFFFFF", "#000000", 144, 60, this, !0), this.addSylviaText(), this.addThomasText(), this.reset()
    }
    addSylviaText() {
        Utilities.addText(this.sylviaGroup, "HELP ME,", "#FFFF00", "#FF0000", 132, 140, this), Utilities.addText(this.sylviaGroup, "THOMAS!", "#FFFF00", "#FF0000", 140, 170, this)
    }
    addThomasText() {
        Utilities.addText(this.thomasGroup, "I'M COMING", "#FFFFFF", "#FF0000", 340, 140, this), Utilities.addText(this.thomasGroup, "RIGHT AWAY,", "#FFFFFF", "#FF0000", 340, 170, this), Utilities.addText(this.thomasGroup, "SYLVIA!", "#FFFFFF", "#FF0000", 364, 200, this)
    }
    startNextLevel() {
        let t = this.scene.get("main");
        this.sounds.stopSound("intermissionlaugh"), t.levelup(), this.scene.switch("main")
    }
    reset() {
        let t = this.scene.get("main");
        this.title2Group.setVisible(t.level % 3 == 0), this.title1Group.setVisible(!(t.level % 3 == 0)), this.sylviaGroup.setVisible(!1), this.thomasGroup.setVisible(!1), this.time.delayedCall(1800, this.showGroup, [this.sylviaGroup], this), this.time.delayedCall(3600, this.showGroup, [this.thomasGroup], this), this.time.delayedCall(6200, this.startNextLevel, [], this), this.sounds.playSound("intermissionlaugh", {
            loop: !0
        })
    }
    showGroup(t) {
        t.setVisible(!0)
    }
}