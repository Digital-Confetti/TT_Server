Number.prototype.in = function(t) {
    return t.indexOf(this.valueOf()) > -1
}, Number.prototype.between = function(t, s) {
    return this.valueOf() >= t && this.valueOf() <= s
};
class Utilities {
    static coinToss = function() {
        return 1 == Phaser.Math.RND.integerInRange(0, 1)
    };
    static random = function(t) {
        return Phaser.Math.RND.integerInRange(0, t)
    };
    static enumValue(t, s) {
        return Object.keys(t)[s]
    }
    static getParameterByName(t) {
        t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var s = new RegExp("[\\?&]" + t + "=([^&#]*)").exec(location.search);
        return null === s ? "" : decodeURIComponent(s[1].replace(/\+/g, " "))
    }
    static addText(t, s, e, a, i, h, n, r) {
        let l = n.add.text(i + 2, h + 2, s, {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.largerFontSize,
            color: a,
            fontStyle: "bold"
        });
        t.add(l);
        let o = n.add.text(i, h, s, {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.largerFontSize,
            color: e,
            fontStyle: "bold"
        });
        t.add(o), r && (l.setPosition(300 - l.width / 2 + 2, h + 2), o.setPosition(300 - o.width / 2, h))
    }
}
class SoundManager {
    instance = null;
    soundList = [];
    static getInstance() {
        return null == this.instance && (this.instance = new SoundManager), this.instance
    }
    addSound(t, s) {
        this.soundList[t] = s.sound.add(t)
    }
    playSound(t, s) {
        this.soundList[t] && (s ? this.soundList[t].play(s) : this.soundList[t].play())
    }
    stopSound(t) {
        this.soundList[t] && this.soundList[t].stop()
    }
}
class BaseSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(t, s, e, a) {
        super(t, s, e, a), this.internalId = Utilities.random(99999), this.scene = t, t.add.existing(this)
    }
    activateBaseSprite(t, s) {
        this.setVisible(!0), this.setActive(!0)
    }
    remove(t, s) {
        this.status = s, this.setActive(!1), this.setVisible(!1), this.x = t, this.y = t
    }
}
class Player extends BaseSprite {
    constructor(t, s, e, a) {
        super(t, s, e, "thomaswalk"), this.debug = a, t.physics.add.existing(this), this.createAnimations(), this.status = Player.PlayerStatus.INACTIVE, this.punchTarget = new PunchTarget(t, -500, -500, a), this.kickTarget = new KickTarget(t, -500, -500, a), this.highkickTarget = new HighkickTarget(t, -500, -500, a), this.oof = new Oof(t, -500, -500), this.blood = new Blood(t, -500, -500), this.setStartProps()
    }
    setStartProps() {
        this.resetBodySize(), this.currentMovement = -1, this.flipValue = -1, this.punchleft = !0, this.isDown = !1, this.setOrigin(.5, 1), this.thugLeft = [], this.thugRight = [], this.thugDrain = 0, this.health = 0, this.jumpDirection = 0, this.highkickAllowed = !1, this.highkickFired = !1, this.animation = null, this.slideCount = -1, this.scene.children.bringToTop(this.oof), this.scene.children.bringToTop(this.blood), this.scoreText = this.scene.add.text(-100, -100, "", {
            fontFamily: Constants.defaultFont,
            fontSize: Constants.defaultFontSize,
            color: "#ff0",
            fontStyle: "bold"
        }), this.scoreText.setOrigin(.5, 1.5)
    }
    static PlayerStatus = {
        INACTIVE: 0,
        INTRO: 1,
        NORMAL: 2,
        KICK: 3,
        PUNCH: 4,
        DOWN: 5,
        SWEEP: 6,
        PUNCHDOWN: 7,
        JUMP: 8,
        HIGHKICK: 9,
        STUCK: 10,
        DEATH: 11,
        DEATHRESUME: 12,
        STEPS: 13,
        LEVELEND: 14,
        LEVELUP: 15,
        ATTRACT1: 16,
        INTERMISSION: 17,
        BOSS3HIT: 18
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status != Player.PlayerStatus.STUCK && (this.thugLeft.length > 0 && this.removeThugs(this.thugLeft), this.thugRight.length > 0 && this.removeThugs(this.thugRight)), this.status) {
            case Player.PlayerStatus.INTRO:
                this.x += this.flipValue, (this.flipValue < 0 && this.x <= this.scene.levelData.widthInPixels - 300 || this.flipValue > 0 && this.x >= 260) && (this.stand("walk"), this.scene.setGameState(main.GameState.PLAYING));
                break;
            case Player.PlayerStatus.STEPS:
                this.x += this.flipValue, this.y -= 1.4, this.y <= 284 && (this.setCrop(0, 284 - this.y, 44, 124), this.y <= 128 && this.setStatus(Player.PlayerStatus.LEVELUP));
                break;
            case Player.PlayerStatus.STUCK:
                this.deductHealth(.5, !0);
                break;
            case Player.PlayerStatus.JUMP:
                (this.jumpDirection < 0 && !this.leftPathBlocked() || this.jumpDirection > 0 && !this.rightPathBlocked()) && (this.x += 2 * this.jumpDirection);
                break;
            case Player.PlayerStatus.DEATH:
                this.x += this.flipValue < 0 ? .6 : -.6, this.y += 2, this.y > 600 && this.setStatus(Player.PlayerStatus.DEATHRESUME);
                break;
            case Player.PlayerStatus.LEVELEND:
                this.x += this.flipValue, (this.flipValue > 0 && this.x >= 3316 || this.flipValue < 0 && this.x <= 268) && (this.y -= 8, this.setStatus(Player.PlayerStatus.STEPS));
                break;
            case Player.PlayerStatus.BOSS3HIT:
                this.x += 10, this.slideCount--, this.slideCount < 0 && this.stand()
        }
    }
    stopAnimation() {
        null !== this.animation && (this.anims.stop(this.animation), this.animation = null)
    }
    playAnimation(t) {
        this.play(t), this.animation = t
    }
    deductHealth(t, s) {
        this.scene.gameState == main.GameState.PLAYING && (this.health -= t, s || this.scene.playSound("oof"), this.scene.adjustThomasHealth(Math.max(0, this.health)), this.health <= 0 && (this.health = 0, this.setStatus(Player.PlayerStatus.DEATH)))
    }
    setStatus(t) {
        switch (this.status = t, this.status) {
            case Player.PlayerStatus.STUCK:
                this.stand(!0, t);
                break;
            case Player.PlayerStatus.INTRO:
                this.setVisible(!0), this.setActive(!0), this.playAnimation("walk"), this.scene.playSound("walkin", {
                    loop: !0
                });
                break;
            case Player.PlayerStatus.KICK:
                this.playAnimation("kick"), this.scene.time.delayedCall(Constants.kickDelay, this.stand, ["kick", Player.PlayerStatus.KICK], this), this.kickTarget.activateKickTarget(this.x + 20 * this.flipValue, this.y - 100);
                break;
            case Player.PlayerStatus.SWEEP:
                this.playAnimation("sweep"), this.scene.time.delayedCall(Constants.kickDelay, this.stopDown, ["sweep", Player.PlayerStatus.SWEEP], this), this.kickTarget.activateKickTarget(this.x + 30 * this.flipValue, this.y - 10);
                break;
            case Player.PlayerStatus.PUNCH:
                this.punchleft ? (this.playAnimation("punchleft"), this.scene.time.delayedCall(Constants.kickDelay, this.stand, ["punchleft", Player.PlayerStatus.PUNCH], this)) : (this.playAnimation("punchright"), this.scene.time.delayedCall(Constants.kickDelay, this.stand, ["punchright", Player.PlayerStatus.PUNCH], this)), this.punchTarget.activatePunchTarget(this.x + 28 * this.flipValue, this.y - 100), this.punchleft = !this.punchleft;
                break;
            case Player.PlayerStatus.DOWN:
                this.setBodySize(32, 80, !0), this.setTexture("thomaspunchdown"), this.setFrame(0);
                break;
            case Player.PlayerStatus.PUNCHDOWN:
                this.punchleft ? (this.playAnimation("punchleftdown"), this.scene.time.delayedCall(Constants.kickDelay, this.stopDown, ["punchleftdown", Player.PlayerStatus.PUNCHDOWN], this)) : (this.playAnimation("punchrightdown"), this.scene.time.delayedCall(Constants.kickDelay, this.stopDown, ["punchrightdown", Player.PlayerStatus.PUNCHDOWN], this)), this.punchTarget.activatePunchTarget(this.x + 20 * this.flipValue, this.y - 72), this.punchleft = !this.punchleft;
                break;
            case Player.PlayerStatus.STEPS:
                this.scene.stopSound("musicloop"), this.scene.playSound("upstep", {
                    loop: !0
                }), this.playAnimation("steps");
                break;
            case Player.PlayerStatus.LEVELEND:
                this.playAnimation("walk");
                break;
            case Player.PlayerStatus.LEVELUP:
                this.scene.stopSound("upstep"), this.stopAnimation(), this.setCrop(), this.setVisible(!1), this.setActive(!1), this.scene.setGameState(main.GameState.LEVELUP);
                break;
            case Player.PlayerStatus.JUMP:
                this.playAnimation("jump"), this.setBodySize(32, 80, !1), this.scene.time.delayedCall(375, this.jumpPlayer, [], this), this.scene.time.delayedCall(750, this.jumpEnd, [], this), this.scene.time.delayedCall(875, this.stand, [], this);
                break;
            case Player.PlayerStatus.DEATH:
                this.cameraSet(!1), this.scene.playSound("bossdeath"), this.playAnimation("death");
                break;
            case Player.PlayerStatus.ATTRACT1:
                this.attractSteps = [...Constants.attract1], this.nextAttract();
                break;
            case Player.PlayerStatus.INTERMISSION:
                this.playAnimation("walk");
                break;
            case Player.PlayerStatus.BOSS3HIT:
                this.stopAnimation(), this.setTexture("thomasknockback"), this.setFrame(0), this.slideCount = 20
        }
    }
    nextAttract() {
        let t = this.attractSteps.splice(0, 1);
        1 == t.length ? (this.flipX = t[0].flip, this.setStatus(t[0].status), this.scene.time.delayedCall(.6 * t[0].delay, this.nextAttract, [], this)) : this.setStatus(Player.PlayerStatus.ATTRACT1)
    }
    jumpPlayer() {
        this.y = 384, this.highkickAllowed && this.highkickFired && (this.stopAnimation("jump"), this.setTexture("thomashighkick"), this.scene.playSound("gamestart"), this.highkickTarget.activateHighkickTarget(this.x + 20 * this.flipValue, this.y - 80)), this.highkickAllowed = !1
    }
    jumpEnd() {
        this.y = 416, this.highkickFired && (this.play("jump", !1, 7), this.animation = "jump")
    }
    cameraSet(t) {
        t ? this.scene.cameras.main.startFollow(this, !0, 1, 1, -40, 0) : this.scene.cameras.main.stopFollow()
    }
    resetBodySize() {
        this.setBodySize(32, 126, !0)
    }
    activatePlayer(t, s, e, a) {
        this.body.reset(s, e), t ? (this.flipValue = -1, this.flipX = !0) : (this.flipValue = 1, this.flipX = !1), a ? this.setStatus(a) : (this.cameraSet(!0), this.setStatus(Player.PlayerStatus.INTRO)), this.health = 200
    }
    kick() {
        switch (this.status) {
            case Player.PlayerStatus.NORMAL:
                this.setStatus(Player.PlayerStatus.KICK), this.scene.playSound("playerpunch");
                break;
            case Player.PlayerStatus.DOWN:
                this.setStatus(Player.PlayerStatus.SWEEP), this.scene.playSound("playerpunch");
                break;
            case Player.PlayerStatus.JUMP:
                this.highkickAllowed && (this.highkickFired = !0)
        }
    }
    kickHandler(t, s) {
        this.isDown ? this.oof.activateOof(this.x + 60 * this.flipValue, this.y - 10) : this.oof.activateOof(this.x + 50 * this.flipValue, this.y - 100), this.kickTarget.remove(), this.highkickTarget.remove();
        let e = s.hit(this, !0);
        e > 0 && this.showScore(e, this.oof.x, this.oof.y - 20)
    }
    punchHandler(t, s) {
        this.isDown ? this.oof.activateOof(this.x + 30 * this.flipValue, this.y - 70) : this.oof.activateOof(this.x + 30 * this.flipValue, this.y - 100), this.punchTarget.remove();
        let e = s.hit(this, !1);
        e > 0 && this.showScore(e, this.oof.x, this.oof.y - 20)
    }
    stopDown(t, s) {
        this.status == s && (t && this.stopAnimation(), this.setStatus(Player.PlayerStatus.DOWN))
    }
    punch() {
        switch (this.status) {
            case Player.PlayerStatus.NORMAL:
                this.setStatus(Player.PlayerStatus.PUNCH), this.scene.playSound("playerpunch");
                break;
            case Player.PlayerStatus.DOWN:
                this.setStatus(Player.PlayerStatus.PUNCHDOWN), this.scene.playSound("playerpunch")
        }
    }
    stand(t, s) {
        this.status == Player.PlayerStatus.DEATH || null != s && this.status != s || (this.currentMovement = 0, t && this.stopAnimation(), this.resetBodySize(), this.setTexture("thomaswalk"), this.setFrame(0), s != Player.PlayerStatus.STUCK && this.setStatus(Player.PlayerStatus.NORMAL))
    }
    stuckEnemy(t) {
        t.flipX ? this.thugRight.push(t) : this.thugLeft.push(t), this.thugDrain += 10, this.status != Player.PlayerStatus.STUCK && this.setStatus(Player.PlayerStatus.STUCK)
    }
    removeThugs(t) {
        if (t.length > 0) {
            for (var s = t.length - 1; s >= 0; s--) "THUG" == t[s].tag ? t[s].setStatus(Thug.ThugStatus.DEATH) : t[s].setStatus(SmallGuy.SmallGuyStatus.DEATH);
            t.splice(0, t.length)
        }
    }
    handleInput(t) {
        let s = !1;
        this.status == Player.PlayerStatus.STUCK ? (t.cursors.left.isDown && (-1 != this.currentMovement && (this.flipX = !0, this.flipValue = -1, this.thugDrain--), this.currentMovement = -1), t.cursors.right.isDown && (1 != this.currentMovement && (this.flipX = !1, this.flipValue = 1, this.thugDrain--), this.currentMovement = 1), this.thugDrain < 0 && (this.thugDrain = 0, this.setStatus(Player.PlayerStatus.NORMAL), this.stand())) : t.cursors.down.isDown ? (this.isDown || (this.setStatus(Player.PlayerStatus.DOWN), this.isDown = !0), t.cursors.left.isDown && -1 != this.currentMovement && (this.flipX = !0, this.flipValue = -1, s = !0), t.cursors.right.isDown && 1 != this.currentMovement && (this.flipX = !1, this.flipValue = 1, s = !0)) : (this.isDown = !1, t.cursors.up.isDown && this.status == Player.PlayerStatus.NORMAL ? (t.cursors.left.isDown ? this.jumpDirection = -1 : t.cursors.right.isDown ? this.jumpDirection = 1 : (this.highkickAllowed = !0, this.highkickFired = !1, this.jumpDirection = 0), this.setStatus(Player.PlayerStatus.JUMP)) : (t.cursors.left.isDown && (this.flipX = !0, this.flipValue = -1, this.leftPathBlocked() ? (this.stand(), this.currentMovement = 0) : (this.status == Player.PlayerStatus.NORMAL && (-1 != this.currentMovement && this.playAnimation("walk"), this.x -= 3), this.currentMovement = -1), s = !0), t.cursors.right.isDown && (this.flipX = !1, this.flipValue = 1, this.rightPathBlocked() || ((this.status == Player.PlayerStatus.JUMP || this.status == Player.PlayerStatus.NORMAL) && this.x < 3510 && (this.status == Player.PlayerStatus.NORMAL && 1 != this.currentMovement && this.playAnimation("walk"), this.x += 3), this.currentMovement = 1), s = !0), s || t.cursors.up.isDown || this.stand("walk")))
    }
    leftPathBlocked() {
        return this.x <= 40 || !(!this.scene.flipped || !this.scene.boss) && this.scene.boss.x + 30 >= this.x
    }
    rightPathBlocked() {
        return this.x >= this.scene.levelData.widthInPixels - 120 || !(this.scene.flipped || !this.scene.boss) && this.scene.boss.x - 30 <= this.x
    }
    showScore(t, s, e) {
        this.scoreText.x = s, this.scoreText.y = e, this.scoreText.setText(t), this.scene.time.delayedCall(200, this.hideScore, [], this), this.scene.updateScore(t)
    }
    hideScore() {
        this.scoreText.x = -100, this.scoreText.y = -100
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "walk",
            frames: this.scene.game.anims.generateFrameNames("thomaswalk", {
                frames: [1, 2, 3, 4]
            }),
            frameRate: 8,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "kick",
            frames: this.scene.game.anims.generateFrameNames("thomaskick", {
                frames: [0, 1, 0]
            }),
            frameRate: 12,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "punchleft",
            frames: this.scene.game.anims.generateFrameNames("thomaspunch", {
                frames: [1, 0, 1]
            }),
            frameRate: 12,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "punchright",
            frames: this.scene.game.anims.generateFrameNames("thomaspunch", {
                frames: [1, 2, 1]
            }),
            frameRate: 12,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "punchleftdown",
            frames: this.scene.game.anims.generateFrameNames("thomaspunchdown", {
                frames: [2, 1, 2]
            }),
            frameRate: 12,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "punchrightdown",
            frames: this.scene.game.anims.generateFrameNames("thomaspunchdown", {
                frames: [2, 3, 2]
            }),
            frameRate: 12,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "sweep",
            frames: this.scene.game.anims.generateFrameNames("thomassweep", {
                frames: [0, 1, 0]
            }),
            frameRate: 12,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "steps",
            frames: this.scene.game.anims.generateFrameNames("thomassteps", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 4,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "jump",
            frames: this.scene.game.anims.generateFrameNames("thomasjump", {
                frames: [0, 1, 2, 2, 2, 2, 2, 3]
            }),
            frameRate: 8
        }), this.scene.game.anims.create({
            key: "death",
            frames: this.scene.game.anims.generateFrameNames("thomasdeath", {
                frames: [0, 1]
            }),
            frameRate: 4
        })
    }
}
class Sylvia extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "sylviasitting"), this.createAnimations(), this.status = Sylvia.SylviaStatus.INACTIVE
    }
    static SylviaStatus = {
        INACTIVE: 0,
        NORMAL: 1,
        SITTING: 2
    };
    preUpdate(t, s) {
        super.preUpdate(t, s)
    }
    activateSylvia(t, s, e) {
        this.x = t, this.y = s, this.setVisible(!0), this.setActive(!0), this.setStatus(e)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Sylvia.SylviaStatus.SITTING:
                this.play("sylviasitting")
        }
    }
    remove() {
        this.setActive(!1), this.setVisible(!1), this.status = Sylvia.SylviaStatus.INACTIVE, this.x = -500, this.y = -500
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "sylviasitting",
            frames: this.scene.game.anims.generateFrameNames("sylviasitting", {
                start: 0,
                end: 1
            }),
            frameRate: 2,
            repeat: -1
        })
    }
}
class Constants {
    static lastscore = 0;
    static highscore = 0;
    static defaultFont = "Courier";
    static defaultFontSize = 22;
    static largerFontSize = 24;
    static kickDelay = 125;
    static boss2WeaponSpeed = -3;
    static enemyTypes = {
        THUG: 0,
        KNIFEMAN: 1,
        SMALLGUY: 2,
        SNAKE: 3,
        SHRAPNEL: 4,
        DRAGON: 5,
        BOSS1: 6,
        BOSS2: 7,
        BOSS3: 8
    };
    static enemyData = [
        [{
            x: 2800,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2700,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 60
        }, {
            x: 2600,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2520,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 2520,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2420,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 2420,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2300,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 2300,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2180,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 2180,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2060,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 2060,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1900,
            flip: !1,
            type: Constants.enemyTypes.KNIFEMAN,
            xOffset: 0
        }, {
            x: 1700,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 1700,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 1700,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1500,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 1500,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1300,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1260,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1220,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1060,
            flip: !1,
            type: Constants.enemyTypes.KNIFEMAN,
            xOffset: 0
        }, {
            x: 920,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 920,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 800,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 720,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 720,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 560,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 560,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 400,
            flip: !1,
            type: Constants.enemyTypes.BOSS1,
            xOffset: 0
        }],
        [{
            x: 80,
            xOffset: -80,
            type: Constants.enemyTypes.SNAKE
        }, {
            x: 240,
            xOffset: 80,
            type: Constants.enemyTypes.DRAGON
        }, {
            x: 360,
            xOffset: -80,
            type: Constants.enemyTypes.SHRAPNEL
        }, {
            x: 480,
            xOffset: -160,
            type: Constants.enemyTypes.SNAKE
        }, {
            x: 600,
            xOffset: 160,
            type: Constants.enemyTypes.DRAGON
        }, {
            x: 640,
            xOffset: -80,
            type: Constants.enemyTypes.SNAKE
        }, {
            x: 720,
            xOffset: 80,
            type: Constants.enemyTypes.SHRAPNEL
        }, {
            x: 800,
            xOffset: -80,
            type: Constants.enemyTypes.SNAKE
        }, {
            x: 880,
            xOffset: 80,
            type: Constants.enemyTypes.SHRAPNEL
        }, {
            x: 960,
            xOffset: 80,
            type: Constants.enemyTypes.SHRAPNEL
        }, {
            x: 1040,
            xOffset: 80,
            type: Constants.enemyTypes.SNAKE
        }, {
            x: 1120,
            xOffset: -20,
            type: Constants.enemyTypes.SHRAPNEL
        }, {
            x: 1160,
            xOffset: -160,
            type: Constants.enemyTypes.DRAGON
        }, {
            x: 1240,
            xOffset: 160,
            type: Constants.enemyTypes.SNAKE
        }, {
            x: 1300,
            xOffset: -80,
            type: Constants.enemyTypes.DRAGON
        }, {
            x: 1500,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1500,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1800,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1800,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 2e3,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2e3,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 2200,
            flip: !1,
            type: Constants.enemyTypes.SMALLGUY,
            xOffset: 0
        }, {
            x: 2200,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 2400,
            flip: !1,
            type: Constants.enemyTypes.SMALLGUY,
            xOffset: 0
        }, {
            x: 2400,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 2600,
            flip: !0,
            type: Constants.enemyTypes.BOSS2,
            xOffset: 0
        }],
        [{
            x: 2800,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2700,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 60
        }, {
            x: 2600,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2520,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 2520,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2420,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 2420,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2300,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 2300,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2180,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 2180,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 2060,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 2060,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1900,
            flip: !1,
            type: Constants.enemyTypes.KNIFEMAN,
            xOffset: 0
        }, {
            x: 1700,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 80
        }, {
            x: 1700,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 1700,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1500,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 1500,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1300,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1260,
            flip: !1,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1220,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 1060,
            flip: !1,
            type: Constants.enemyTypes.KNIFEMAN,
            xOffset: 0
        }, {
            x: 920,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 920,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 800,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 720,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 720,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 560,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 40
        }, {
            x: 560,
            flip: !0,
            type: Constants.enemyTypes.THUG,
            xOffset: 0
        }, {
            x: 400,
            flip: !1,
            type: Constants.enemyTypes.BOSS3,
            xOffset: 0
        }]
    ];
    static attract1 = [{
        delay: 400,
        flip: !1,
        status: Player.PlayerStatus.KICK
    }, {
        delay: 600,
        flip: !1,
        status: Player.PlayerStatus.PUNCH
    }, {
        delay: 400,
        flip: !0,
        status: Player.PlayerStatus.KICK
    }, {
        delay: 600,
        flip: !0,
        status: Player.PlayerStatus.DOWN
    }, {
        delay: 500,
        flip: !0,
        status: Player.PlayerStatus.SWEEP
    }, {
        delay: 600,
        flip: !0,
        status: Player.PlayerStatus.PUNCH
    }, {
        delay: 500,
        flip: !1,
        status: Player.PlayerStatus.SWEEP
    }, {
        delay: 600,
        flip: !1,
        status: Player.PlayerStatus.DOWN
    }, {
        delay: 600,
        flip: !1,
        status: Player.PlayerStatus.PUNCHDOWN
    }, {
        delay: 600,
        flip: !0,
        status: Player.PlayerStatus.PUNCHDOWN
    }]
}
class Thug extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "thugwalk"), this.createAnimations(), t.physics.add.existing(this), this.tag = "THUG", this.status = Thug.ThugStatus.INACTIVE, this.flipValue = .5, this.setOrigin(.5, 1), this.setBodySize(32, 126, !1)
    }
    static ThugStatus = {
        INACTIVE: 0,
        NORMAL: 1,
        ATTACK: 2,
        STUCK: 3,
        DEATH: 4
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case Thug.ThugStatus.NORMAL:
                this.flipX ? this.x <= this.scene.player.x + 200 && this.setStatus(Thug.ThugStatus.ATTACK) : this.x >= this.scene.player.x - 200 && this.setStatus(Thug.ThugStatus.ATTACK), this.x += this.flipValue;
                break;
            case Thug.ThugStatus.ATTACK:
                this.flipX ? this.x <= this.scene.player.x + 30 * (this.scene.player.thugRight.length + 1) && this.setStatus(Thug.ThugStatus.STUCK) : this.x >= this.scene.player.x - 24 * (this.scene.player.thugLeft.length + 1) && this.setStatus(Thug.ThugStatus.STUCK), this.x += this.flipValue;
                break;
            case Thug.ThugStatus.DEATH:
                this.x += this.flipValue < 0 ? .6 : -.6, this.y += 2, this.y > 600 && this.remove()
        }
    }
    activateThug(t) {
        this.flipX = t.flip, t.flip ? (this.flipValue = -2.4, this.body.reset(t.x + 640 + t.xOffset, 416)) : (this.flipValue = 1.6, this.body.reset(t.x - t.xOffset, 416)), this.setVisible(!0), this.setActive(!0), this.setStatus(Thug.ThugStatus.NORMAL)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Thug.ThugStatus.NORMAL:
                this.play("thugwalk");
                break;
            case Thug.ThugStatus.ATTACK:
                this.play("thugattack");
                break;
            case Thug.ThugStatus.STUCK:
                this.anims.stop("thugattack"), this.setTexture("thugstuck"), this.scene.player.stuckEnemy(this);
                break;
            case Thug.ThugStatus.DEATH:
                this.play("thugdeath")
        }
    }
    hit(t, s) {
        return this.scene.player.thugRight + this.scene.player.thugLeft == 0 ? (this.setStatus(Thug.ThugStatus.DEATH), s ? 100 : 200) : 0
    }
    remove() {
        super.remove(-1e3, Thug.ThugStatus.INACTIVE)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "thugwalk",
            frames: this.scene.game.anims.generateFrameNames("thugwalk", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 4,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "thugattack",
            frames: this.scene.game.anims.generateFrameNames("thugwalk", {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 4,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "thugdeath",
            frames: this.scene.game.anims.generateFrameNames("thugdeath", {
                frames: [0, 1]
            }),
            frameRate: 4
        })
    }
}
class Thugs extends Phaser.Physics.Arcade.Group {
    constructor(t, s) {
        super(t.physics.world, t), this.enableBody = !0, this.physicsBodyType = Phaser.Physics.ARCADE, this.thugCount = s, this.createMultiple({
            frameQuantity: s,
            key: "thug",
            active: !1,
            visible: !1,
            classType: Thug,
            setXY: {
                x: -1e3,
                y: -1e3
            }
        })
    }
    addSingleThug(t) {
        let s = this.getFirstDead(!1);
        s ? s.activateThug(t) : console.log("No spare Thug found")
    }
    removeAll() {
        this.children.each((function(t, s) {
            t.remove()
        }))
    }
}
class SmallGuy extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "smallguy"), this.createAnimations(), t.physics.add.existing(this), this.tag = "SMALLGUY", this.status = SmallGuy.SmallGuyStatus.INACTIVE, this.flipValue = .5, this.setOrigin(.5, 1)
    }
    static SmallGuyStatus = {
        INACTIVE: 0,
        NORMAL: 1,
        STUCK: 2,
        DEATH: 3
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case SmallGuy.SmallGuyStatus.NORMAL:
                this.x += this.flipValue, this.flipX ? this.x <= this.scene.player.x + 30 * (this.scene.player.thugRight.length + 1) && this.setStatus(SmallGuy.SmallGuyStatus.STUCK) : this.x >= this.scene.player.x - 24 * (this.scene.player.thugLeft.length + 1) && this.setStatus(SmallGuy.SmallGuyStatus.STUCK);
                break;
            case SmallGuy.SmallGuyStatus.DEATH:
                this.x += this.flipValue < 0 ? .6 : -.6, this.y += 2, this.y > 600 && this.remove()
        }
    }
    activateSmallGuy(t) {
        this.flipX = t.flip, t.flip ? (this.flipValue = -2.4, this.body.reset(t.x + 640 + t.xOffset, 416)) : (this.flipValue = 1.6, this.body.reset(t.x - t.xOffset, 416)), this.setVisible(!0), this.setActive(!0), this.setStatus(SmallGuy.SmallGuyStatus.NORMAL)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case SmallGuy.SmallGuyStatus.NORMAL:
                this.play("smallguy");
                break;
            case SmallGuy.SmallGuyStatus.STUCK:
                this.anims.stop("smallguy"), this.setTexture("smallguystuck"), this.scene.player.stuckEnemy(this);
                break;
            case SmallGuy.SmallGuyStatus.DEATH:
                this.play("smallguydeath")
        }
    }
    hit(t, s) {
        return this.setStatus(SmallGuy.SmallGuyStatus.DEATH), s ? 100 : 200
    }
    remove() {
        super.remove(-1e3, SmallGuy.SmallGuyStatus.INACTIVE)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "smallguy",
            frames: this.scene.game.anims.generateFrameNames("smallguy", {
                frames: [0, 1, 2, 1]
            }),
            frameRate: 4,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "smallguydeath",
            frames: this.scene.game.anims.generateFrameNames("smallguydeath", {
                frames: [0, 1]
            }),
            frameRate: 4
        })
    }
}
class SmallGuys extends Phaser.Physics.Arcade.Group {
    constructor(t, s) {
        super(t.physics.world, t), this.enableBody = !0, this.physicsBodyType = Phaser.Physics.ARCADE, this.smallGuyCount = s, this.createMultiple({
            frameQuantity: s,
            key: "smallGuy",
            active: !1,
            visible: !1,
            classType: SmallGuy,
            setXY: {
                x: -1e3,
                y: -1e3
            }
        })
    }
    addSingleSmallGuy(t) {
        let s = this.getFirstDead(!1);
        s ? s.activateSmallGuy(t) : console.log("No spare SmallGuy found")
    }
    removeAll() {
        this.children.each((function(t, s) {
            t.remove()
        }))
    }
}
class Knifeman extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "knifemanwalk"), this.createAnimations(), t.physics.add.existing(this), this.tag = "KNIFEMAN", this.status = Knifeman.KnifemanStatus.INACTIVE, this.flipValue = .5, this.setOrigin(.5, 1), this.hitCount = 2, this.knife = new Knife(t, -500, -500), this.timeHandler
    }
    static KnifemanStatus = {
        INACTIVE: 0,
        NORMAL: 1,
        STOP: 2,
        THROWLOW: 3,
        THROWHIGH: 4,
        KICKHIT: 5,
        PUNCHHIT: 6,
        DEATH: 7
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case Knifeman.KnifemanStatus.NORMAL:
                this.flipX ? this.x <= this.scene.player.x + 160 && this.setStatus(Knifeman.KnifemanStatus.STOP) : this.x >= this.scene.player.x - 160 && this.setStatus(Knifeman.KnifemanStatus.STOP), this.x += this.flipValue;
                break;
            case Knifeman.KnifemanStatus.DEATH:
                this.x += this.flipValue < 0 ? .6 : -.6, this.y += 2, this.y > 600 && this.remove();
                break;
            case Knifeman.KnifemanStatus.STOP:
                this.knife.status == Knife.KnifeStatus.INACTIVE && 0 == this.scene.rnd.integerInRange(0, 40) && (Utilities.coinToss() ? (this.play("knifemanlowthrow"), this.knife.activateKnife(this.x + 36 * this.flipValue, this.y - 50, this.flipX), this.timeHandler = this.scene.time.delayedCall(400, this.stand, ["knifemanlowthrow"], this)) : (this.play("knifemanhighthrow"), this.knife.activateKnife(this.x + 36 * this.flipValue, this.y - 100, this.flipX), this.timeHandler = this.scene.time.delayedCall(400, this.stand, ["knifemanhighthrow"], this)))
        }
    }
    activateKnifeman(t) {
        this.flipX = t.flip, this.hitCount = 2, t.flip ? (this.flipValue = -1.4, this.body.reset(t.x + 640, 416)) : (this.flipValue = .6, this.body.reset(t.x, 416)), this.setVisible(!0), this.setActive(!0), this.setStatus(Knifeman.KnifemanStatus.NORMAL)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Knifeman.KnifemanStatus.NORMAL:
                this.play("knifemanwalk");
                break;
            case Knifeman.KnifemanStatus.DEATH:
                this.timeHandler && this.timeHandler.destroy(), this.play("knifemandeath")
        }
    }
    hit(t, s) {
        return t.status == Player.PlayerStatus.JUMP ? this.hitCount = 0 : this.hitCount--, 0 == this.hitCount ? (this.setStatus(Knifeman.KnifemanStatus.DEATH), s ? 1e3 : 500) : 0
    }
    stand(t) {
        t && this.anims.stop(t), this.setTexture("knifemanwalk"), this.setFrame(1), this.setStatus(Knifeman.KnifemanStatus.NORMAL)
    }
    remove() {
        super.remove(-1e3, Knifeman.KnifemanStatus.INACTIVE)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "knifemanwalk",
            frames: this.scene.game.anims.generateFrameNames("knifemanwalk", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 4,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "knifemandeath",
            frames: this.scene.game.anims.generateFrameNames("knifemandeath", {
                frames: [0, 1]
            }),
            frameRate: 4
        }), this.scene.game.anims.create({
            key: "knifemanhighthrow",
            frames: this.scene.game.anims.generateFrameNames("knifemanhighthrow", {
                frames: [0, 1, 2]
            }),
            frameRate: 6
        }), this.scene.game.anims.create({
            key: "knifemanlowthrow",
            frames: this.scene.game.anims.generateFrameNames("knifemanlowthrow", {
                frames: [0, 1, 2]
            }),
            frameRate: 6
        })
    }
}
class Boss1 extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "boss1walk"), t.physics.add.existing(this), this.status = Boss1.Boss1Status.INACTIVE, this.setOrigin(.5, 1), this.health = 200, this.hitAlready = !1, this.boss1HighSwing = new Boss1HighSwing(t, -500, -500), this.boss1LowSwing = new Boss1LowSwing(t, -500, -500), this.setBodySize(48, 120, !0), this.createAnimations()
    }
    static Boss1Status = {
        INACTIVE: 0,
        NORMAL: 1,
        STOP: 2,
        HIGHSWING: 3,
        LOWSWING: 4,
        DEATH: 5
    };
    preUpdate(t, s) {
        if (super.preUpdate(t, s), this.scene.gameState == main.GameState.PLAYING || this.scene.gameState == main.GameState.LEVELEND) switch (this.status) {
            case Boss1.Boss1Status.NORMAL:
                this.x >= this.scene.player.x - 100 && this.setStatus(Boss1.Boss1Status.STOP), this.x += .2;
                break;
            case Boss1.Boss1Status.STOP:
                this.x >= this.scene.player.x - 70 && 0 == Utilities.random(10) ? Utilities.coinToss() ? this.setStatus(Boss1.Boss1Status.HIGHSWING) : this.setStatus(Boss1.Boss1Status.LOWSWING) : this.x <= this.scene.player.x - 100 && this.setStatus(Boss1.Boss1Status.NORMAL);
                break;
            case Boss1.Boss1Status.DEATH:
                this.x += this.flipValue < 0 ? .6 : -.6, this.y += 2, this.y > 600 && this.remove()
        }
    }
    activateBoss(t) {
        this.body.reset(t.x, 416), this.hitCount = 10, this.setVisible(!0), this.setActive(!0), this.setStatus(Boss1.Boss1Status.NORMAL)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Boss1.Boss1Status.NORMAL:
                this.play("boss1walk");
                break;
            case Boss1.Boss1Status.HIGHSWING:
                this.play("boss1high"), this.timeHandler = this.scene.time.delayedCall(500, this.addStick, ["boss1high"], this);
                break;
            case Boss1.Boss1Status.LOWSWING:
                this.play("boss1low"), this.timeHandler = this.scene.time.delayedCall(500, this.addStick, ["boss1low"], this);
                break;
            case Boss1.Boss1Status.DEATH:
                this.timeHandler.destroy(), this.scene.playSound("bossdeath"), this.play("boss1death")
        }
    }
    addStick(t) {
        "boss1high" == t ? this.boss1HighSwing.activateStick(this.x + 60, this.y - 100) : this.boss1LowSwing.activateStick(this.x + 68, this.y - 43), this.timeHandler = this.scene.time.delayedCall(150, this.stopStickHit, [t], this)
    }
    stopStickHit(t) {
        this.hitAlready = !0, this.timeHandler = this.scene.time.delayedCall(250, this.stand, [t], this)
    }
    stand(t) {
        t && this.anims.stop(t), this.hitAlready = !1, this.setTexture("boss1walk"), this.setFrame(1), this.setStatus(Boss1.Boss1Status.STOP)
    }
    remove() {
        super.remove(-500, Boss1.Boss1Status.INACTIVE)
    }
    hit(t, s) {
        return this.hitCount--, this.health -= 20, this.x -= 5, this.scene.adjustEnemyHealth(this.health), 0 == this.hitCount ? (this.setStatus(Boss1.Boss1Status.DEATH), 5e3) : 0
    }
    hitCheck() {
        this.hitAlready || (this.boss1HighSwing.status == Boss1HighSwing.Boss1HighSwingStatus.NORMAL ? this.scene.physics.overlap(this.boss1HighSwing, this.scene.player, this.hitHandler, null, this) : this.boss1LowSwing.status == Boss1LowSwing.Boss1LowSwingStatus.NORMAL && this.scene.physics.overlap(this.boss1LowSwing, this.scene.player, this.hitHandler, null, this))
    }
    hitHandler(t, s) {
        this.hitAlready = !0, s.blood.activateBlood(t.x, t.y), s.deductHealth(80)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "boss1walk",
            frames: this.scene.game.anims.generateFrameNames("boss1walk", {
                frames: [0, 1, 2, 1]
            }),
            frameRate: 4,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "boss1high",
            frames: this.scene.game.anims.generateFrameNames("boss1high", {
                frames: [0, 1, 2, 2]
            }),
            frameRate: 4
        }), this.scene.game.anims.create({
            key: "boss1low",
            frames: this.scene.game.anims.generateFrameNames("boss1low", {
                frames: [0, 1, 2, 2]
            }),
            frameRate: 4
        }), this.scene.game.anims.create({
            key: "boss1death",
            frames: this.scene.game.anims.generateFrameNames("boss1death", {
                frames: [0, 1]
            }),
            frameRate: 4
        })
    }
}
class Boss2 extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "boss2walk"), t.physics.add.existing(this), this.status = Boss2.Boss2Status.INACTIVE, this.setOrigin(.5, 1), this.flipX = !0, this.health = 200, this.hitAlready = !1, this.createAnimations(), this.boss2Weapon = new Boss2Weapon(t, -500, -500, this)
    }
    static Boss2Status = {
        INACTIVE: 0,
        NORMAL: 1,
        STOP: 2,
        HIGHTHROW: 3,
        LOWTHROW: 4,
        DEATH: 5
    };
    preUpdate(t, s) {
        if (super.preUpdate(t, s), this.scene.gameState == main.GameState.PLAYING || this.scene.gameState == main.GameState.LEVELEND) switch (this.status) {
            case Boss2.Boss2Status.NORMAL:
                this.x <= this.scene.player.x + 200 && this.setStatus(Boss2.Boss2Status.STOP), this.x -= .5;
                break;
            case Boss2.Boss2Status.STOP:
                this.x <= this.scene.player.x + 200 && this.boss2Weapon.status == Boss2Weapon.Boss2WeaponStatus.INACTIVE && 0 == Utilities.random(10) ? this.setStatus(Boss2.Boss2Status.LOWTHROW) : this.x >= this.scene.player.x + 300 && this.setStatus(Boss2.Boss2Status.NORMAL);
                break;
            case Boss2.Boss2Status.DEATH:
                this.x += this.flipValue < 0 ? .6 : -.6, this.y += 2, this.y > 600 && this.remove()
        }
    }
    activateBoss(t) {
        this.body.reset(t.x + 640 + t.xOffset, 416), this.hitCount = 10, this.setVisible(!0), this.setActive(!0), this.setStatus(Boss2.Boss2Status.NORMAL)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Boss2.Boss2Status.NORMAL:
                this.play("boss2walk");
                break;
            case Boss2.Boss2Status.HIGHTHROW:
                this.play("boss2high"), this.timeHandler = this.scene.time.delayedCall(300, this.throwBlade, [!0], this);
                break;
            case Boss2.Boss2Status.LOWTHROW:
                this.play("boss2low"), this.timeHandler = this.scene.time.delayedCall(300, this.throwBlade, [!1], this);
                break;
            case Boss2.Boss2Status.DEATH:
                this.timeHandler.destroy(), this.scene.playSound("bossdeath"), this.play("boss2death")
        }
    }
    throwBlade(t) {
        this.boss2Weapon.activateBoss2Weapon(this.x - 40, this.y - (t ? 90 : 40)), this.stand()
    }
    stand(t) {
        t && this.anims.stop(t), this.hitAlready = !1, this.setTexture("boss2walk"), this.setFrame(1), this.setStatus(Boss2.Boss2Status.STOP)
    }
    remove() {
        super.remove(-500, Boss2.Boss2Status.INACTIVE)
    }
    hit(t, s) {
        return this.hitCount--, this.health -= 20, this.x += 5, this.scene.adjustEnemyHealth(this.health), this.hitCount <= 0 ? (this.setStatus(Boss2.Boss2Status.DEATH), 5e3) : 0
    }
    hitCheck() {
        this.boss2Weapon.hitCheck()
    }
    hitHandler(t, s) {
        this.hitAlready = !0, s.blood.activateBlood(t.x, t.y), s.deductHealth(80)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "boss2walk",
            frames: this.scene.game.anims.generateFrameNames("boss2walk", {
                frames: [0, 1, 2, 1]
            }),
            frameRate: 4,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "boss2high",
            frames: this.scene.game.anims.generateFrameNames("boss2highthrow", {
                frames: [0, 1]
            }),
            frameRate: 6
        }), this.scene.game.anims.create({
            key: "boss2low",
            frames: this.scene.game.anims.generateFrameNames("boss2throw", {
                frames: [0, 1]
            }),
            frameRate: 6
        }), this.scene.game.anims.create({
            key: "boss2death",
            frames: this.scene.game.anims.generateFrameNames("boss2death", {
                frames: [0, 1]
            }),
            frameRate: 4
        })
    }
}
class Boss3 extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "boss3walk"), t.physics.add.existing(this), this.status = Boss3.Boss3Status.INACTIVE, this.setOrigin(.5, 1), this.health = 200, this.hitAlready = !1, this.boss3kick = new Boss3kick(t, -500, -500), this.boss3punch = new Boss3punch(t, -500, -500), this.setBodySize(48, 120, !0), this.createAnimations()
    }
    static Boss3Status = {
        INACTIVE: 0,
        NORMAL: 1,
        STOP: 2,
        KICK: 3,
        PUNCH: 4,
        DEATH: 5
    };
    preUpdate(t, s) {
        if (super.preUpdate(t, s), this.scene.gameState == main.GameState.PLAYING || this.scene.gameState == main.GameState.LEVELEND) switch (this.status) {
            case Boss3.Boss3Status.NORMAL:
                this.x >= this.scene.player.x - 100 && this.setStatus(Boss3.Boss3Status.STOP), this.x += .2;
                break;
            case Boss3.Boss3Status.STOP:
                this.x >= this.scene.player.x - 70 && 0 == Utilities.random(10) ? Utilities.coinToss() ? this.setStatus(Boss3.Boss3Status.KICK) : this.setStatus(Boss3.Boss3Status.PUNCH) : this.x <= this.scene.player.x - 100 && this.setStatus(Boss3.Boss3Status.NORMAL);
                break;
            case Boss3.Boss3Status.DEATH:
                this.x += this.flipValue < 0 ? .6 : -.6, this.y += 3, this.y > 800 && this.remove()
        }
    }
    activateBoss(t) {
        this.body.reset(t.x, 416), this.hitCount = 10, this.setVisible(!0), this.setActive(!0), this.setStatus(Boss3.Boss3Status.NORMAL)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Boss3.Boss3Status.NORMAL:
                this.play("boss3walk");
                break;
            case Boss3.Boss3Status.KICK:
                this.play("boss3kick"), this.timeHandler = this.scene.time.delayedCall(250, this.addAttack, ["boss3kick"], this);
                break;
            case Boss3.Boss3Status.PUNCH:
                this.play("boss3punch"), this.timeHandler = this.scene.time.delayedCall(250, this.addAttack, ["boss3punch"], this);
                break;
            case Boss3.Boss3Status.DEATH:
                this.timeHandler.destroy(), this.scene.playSound("bossdeath"), this.play("boss3death")
        }
    }
    addAttack(t) {
        "boss3kick" == t ? this.boss3kick.activateKick(this.x + 60, this.y - 76) : this.boss3punch.activatePunch(this.x + 44, this.y - 112), this.timeHandler = this.scene.time.delayedCall(800, this.stand, [], this)
    }
    stand(t) {
        t && this.anims.stop(t), this.hitAlready = !1, this.setTexture("boss3walk"), this.setFrame(1), this.setStatus(Boss3.Boss3Status.STOP)
    }
    remove() {
        super.remove(-500, Boss3.Boss3Status.INACTIVE)
    }
    hit(t, s) {
        return this.hitCount--, this.health -= 20, this.x -= 5, this.scene.adjustEnemyHealth(this.health), 0 == this.hitCount ? (this.setStatus(Boss3.Boss3Status.DEATH), 5e3) : 0
    }
    hitCheck() {
        this.hitAlready || (this.boss3kick.status == Boss3kick.Boss3kickStatus.NORMAL && this.scene.physics.overlap(this.boss3kick, this.scene.player, this.hitHandler, null, this), this.boss3punch.status == Boss3punch.Boss3punchStatus.NORMAL && this.scene.physics.overlap(this.boss3punch, this.scene.player, this.hitHandler, null, this))
    }
    hitHandler(t, s) {
        this.hitAlready = !0, s.blood.activateBlood(t.x, t.y), s.deductHealth(80), s.setStatus(Player.PlayerStatus.BOSS3HIT)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "boss3walk",
            frames: this.scene.game.anims.generateFrameNames("boss3walk", {
                frames: [0, 1, 2, 1]
            }),
            frameRate: 4,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "boss3kick",
            frames: this.scene.game.anims.generateFrameNames("boss3kick", {
                frames: [0, 1, 1, 1]
            }),
            frameRate: 4
        }), this.scene.game.anims.create({
            key: "boss3punch",
            frames: this.scene.game.anims.generateFrameNames("boss3punch", {
                frames: [0, 1, 1, 1]
            }),
            frameRate: 4
        }), this.scene.game.anims.create({
            key: "boss3death",
            frames: this.scene.game.anims.generateFrameNames("boss3death", {
                frames: [0, 1]
            }),
            frameRate: 4
        })
    }
}
class Boss2Weapon extends BaseSprite {
    constructor(t, s, e, a) {
        super(t, s, e, "boss2weapon"), t.physics.add.existing(this), this.createAnimations(), this.status = Boss2Weapon.Boss2WeaponStatus.INACTIVE, this.direction = Constants.boss2WeaponSpeed, this.distance = 0, this.hitAlready = !1, this.boss = a
    }
    static Boss2WeaponStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case Boss2Weapon.Boss2WeaponStatus.NORMAL:
                this.x += this.direction, this.hitCheck(), this.distance > 80 ? (this.hitAlready = !1, this.distance = 0, this.direction = -Constants.boss2WeaponSpeed) : this.distance++, this.direction == -Constants.boss2WeaponSpeed && this.scene.physics.overlap(this, this.boss, this.remove, null, this)
        }
    }
    hitCheck() {
        this.hitAlready || this.status != Boss2Weapon.Boss2WeaponStatus.NORMAL || this.scene.physics.overlap(this, this.scene.player, this.hitHandler, null, this)
    }
    hitHandler(t, s) {
        let e = !1;
        e = this.y < 350 ? !(this.scene.player.status == Player.PlayerStatus.SWEEP || this.scene.player.status == Player.PlayerStatus.DOWN || this.scene.player.status == Player.PlayerStatus.PUNCHDOWN) : !(this.scene.player.status == Player.PlayerStatus.JUMP || this.scene.player.status == Player.PlayerStatus.HIGHKICK), e && (this.hitAlready = !0, s.blood.activateBlood(t.x, t.y), s.deductHealth(50))
    }
    activateBoss2Weapon(t, s) {
        this.body.reset(t, s), this.setStatus(Boss2Weapon.Boss2WeaponStatus.NORMAL), this.setVisible(!0), this.setActive(!0)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Boss2Weapon.Boss2WeaponStatus.NORMAL:
                this.direction = Constants.boss2WeaponSpeed, this.distance = 0, this.hitAlready = !1, this.play("boss2weapon")
        }
    }
    remove() {
        super.remove(-500, Boss2Weapon.Boss2WeaponStatus.INACTIVE)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "boss2weapon",
            frames: this.scene.game.anims.generateFrameNames("boss2weapon", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7]
            }),
            frameRate: 32,
            repeat: -1
        })
    }
}
class Boss3kick extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "boss3foot"), t.physics.add.existing(this), this.status = Boss3kick.Boss3kickStatus.INACTIVE
    }
    static Boss3kickStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activateKick(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = Boss3kick.Boss3kickStatus.NORMAL, this.scene.time.delayedCall(800, this.removeKick, [], this)
    }
    removeKick() {
        this.setVisible(!1), this.setActive(!1), this.x = -500, this.y = -500, this.status = Boss3kick.Boss3kickStatus.INACTIVE
    }
}
class Boss3punch extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "boss3fist"), t.physics.add.existing(this), this.status = Boss3punch.Boss3punchStatus.INACTIVE
    }
    static Boss3punchStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activatePunch(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = Boss3punch.Boss3punchStatus.NORMAL, this.scene.time.delayedCall(800, this.removePunch, [], this)
    }
    removePunch() {
        this.setVisible(!1), this.setActive(!1), this.x = -500, this.y = -500, this.status = Boss3punch.Boss3punchStatus.INACTIVE
    }
}
class Knife extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "knife"), t.physics.add.existing(this), this.status = Knife.KnifeStatus.INACTIVE
    }
    static KnifeStatus = {
        INACTIVE: 0,
        NORMAL: 1,
        THROWN: 2
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case Knife.KnifeStatus.THROWN:
                this.flipX ? this.x -= 4 : this.x += 4, this.scene.cameras.main.worldView.contains(this.x, this.y) || this.remove()
        }
    }
    activateKnife(t, s, e) {
        this.status = Knife.KnifeStatus.NORMAL, this.flipX = e, this.scene.time.delayedCall(200, this.throwKnife, [t, s], this)
    }
    throwKnife(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.setStatus(Knife.KnifeStatus.THROWN)
    }
    setStatus(t) {
        this.status = t
    }
    remove() {
        this.setActive(!1), this.setVisible(!1), this.scene.time.delayedCall(1e3, this.setStatus, [Knife.KnifeStatus.INACTIVE], this), this.x = -500, this.y = -500
    }
    playerHandler(t, s) {
        this.scene.player.blood.activateBlood(this.x + (this.flipX ? -18 : 18), this.y), this.remove(), this.scene.player.deductHealth(80)
    }
}
class PunchTarget extends BaseSprite {
    constructor(t, s, e, a) {
        super(t, s, e, "punchtarget"), t.physics.add.existing(this), this.status = PunchTarget.PunchTargetStatus.INACTIVE
    }
    static PunchTargetStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activatePunchTarget(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = PunchTarget.PunchTargetStatus.NORMAL, this.scene.time.delayedCall(250, this.remove, [], this)
    }
    remove() {
        super.remove(-500, PunchTarget.PunchTargetStatus.INACTIVE)
    }
}
class KickTarget extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "kicktarget"), t.physics.add.existing(this), this.status = KickTarget.KickTargetStatus.INACTIVE
    }
    static KickTargetStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activateKickTarget(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = KickTarget.KickTargetStatus.NORMAL, this.scene.time.delayedCall(250, this.remove, [], this)
    }
    remove() {
        super.remove(-500, KickTarget.KickTargetStatus.INACTIVE)
    }
}
class HighkickTarget extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "highkicktarget"), t.physics.add.existing(this), this.status = HighkickTarget.HighkickTargetStatus.INACTIVE
    }
    static HighkickTargetStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activateHighkickTarget(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = HighkickTarget.HighkickTargetStatus.NORMAL, this.scene.time.delayedCall(250, this.remove, [], this)
    }
    remove() {
        super.remove(-500, HighkickTarget.HighkickTargetStatus.INACTIVE)
    }
}
class Boss1HighSwing extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "boss1highswing"), t.physics.add.existing(this), this.status = Boss1HighSwing.Boss1HighSwingStatus.INACTIVE
    }
    static Boss1HighSwingStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activateStick(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = Boss1HighSwing.Boss1HighSwingStatus.NORMAL, this.scene.time.delayedCall(166, this.removeStick, [], this)
    }
    removeStick() {
        this.setVisible(!1), this.setActive(!1), this.x = -500, this.y = -500, this.status = Boss1HighSwing.Boss1HighSwingStatus.INACTIVE
    }
}
class Boss1LowSwing extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "boss1lowswing"), t.physics.add.existing(this), this.status = Boss1LowSwing.Boss1LowSwingStatus.INACTIVE
    }
    static Boss1LowSwingStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activateStick(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = Boss1LowSwing.Boss1LowSwingStatus.NORMAL, this.scene.time.delayedCall(166, this.removeStick, [], this)
    }
    removeStick() {
        this.setVisible(!1), this.setActive(!1), this.x = -500, this.y = -500, this.status = Boss1LowSwing.Boss1LowSwingStatus.INACTIVE
    }
}
class Oof extends Phaser.Physics.Arcade.Sprite {
    constructor(t, s, e, a) {
        super(t, s, e, "oof"), this.internalId = Utilities.random(99999), this.scene = t, t.add.existing(this), t.physics.add.existing(this), this.status = Oof.OofStatus.INACTIVE, a ? this.setFrame(1) : this.setFrame(0)
    }
    static OofStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activateOof(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = Oof.OofStatus.NORMAL, this.scene.time.delayedCall(200, this.removeOof, [], this)
    }
    removeOof() {
        this.setVisible(!1), this.setActive(!1), this.x = -500, this.y = -500, this.status = Oof.OofStatus.INACTIVE
    }
}
class Blood extends Phaser.Physics.Arcade.Sprite {
    constructor(t, s, e, a) {
        super(t, s, e, "blood"), this.internalId = Utilities.random(99999), this.scene = t, t.add.existing(this), t.physics.add.existing(this), this.status = Blood.BloodStatus.INACTIVE, a ? this.setFrame(1) : this.setFrame(0)
    }
    static BloodStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    activateBlood(t, s) {
        this.body.reset(t, s), this.setVisible(!0), this.setActive(!0), this.status = Blood.BloodStatus.NORMAL, this.scene.time.delayedCall(200, this.removeBlood, [], this)
    }
    removeBlood() {
        this.setVisible(!1), this.setActive(!1), this.x = -500, this.y = -500, this.status = Blood.BloodStatus.INACTIVE
    }
}
class Level extends Phaser.Physics.Arcade.Sprite {
    constructor(t, s, e) {
        super(t, s, e, "levelindicator"), this.internalId = this.scene.rnd.integerInRange(0, 99999), this.scene = t, this.createAnimations(), t.add.existing(this), this.status = Level.LevelStatus.UNPLAYED
    }
    static LevelStatus = {
        UNPLAYED: 0,
        PLAYED: 1,
        CURRENT: 2
    };
    activateLevel(t, s) {
        this.status = Level.LevelStatus.UNPLAYED, this.x = t, this.y = s, this.setVisible(!0), this.setActive(!0), this.setScrollFactor(0)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Level.LevelStatus.PLAYED:
                this.anims.stop("activelevel"), this.setFrame(1);
                break;
            case Level.LevelStatus.CURRENT:
                this.play("activelevel");
                break;
            case Level.LevelStatus.UNPLAYED:
                this.anims.stop("activelevel"), this.setFrame(0)
        }
    }
    remove() {
        this.setActive(!1), this.setVisible(!1), this.status = Level.LevelStatus.UNPLAYED, this.x = -500, this.y = -500
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "activelevel",
            frames: this.scene.game.anims.generateFrameNames("levelindicator", {
                frames: [0, 1]
            }),
            frameRate: 2,
            repeat: -1
        })
    }
}
class Levels extends Phaser.Physics.Arcade.Group {
    constructor(t, s) {
        super(t.physics.world, t), this.levelCount = s, this.createMultiple({
            frameQuantity: s,
            key: "level",
            active: !1,
            visible: !1,
            classType: Level,
            setXY: {
                x: -500,
                y: -500
            }
        })
    }
    addSingleLevel(t, s) {
        let e = this.getFirstDead(!1);
        e ? e.activateLevel(t, s) : console.log("No spare Level found")
    }
    addLevels() {
        for (let t = 0; t < this.levelCount; t++) this.addSingleLevel(40 * t + 324, 68)
    }
    removeAll() {
        this.children.each((function(t, s) {
            t.remove()
        }))
    }
}
class Snakepot extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "snakepot"), t.physics.add.existing(this), this.createAnimations(), this.status = Snakepot.SnakepotStatus.INACTIVE, this.setOrigin(.5, 1), this.snake = new Snake(t, -1e3, -1e3)
    }
    static SnakepotStatus = {
        INACTIVE: 0,
        NORMAL: 1,
        SMASHED: 2,
        EXPLODE: 3
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case Snakepot.SnakepotStatus.NORMAL:
                this.y += 2, this.y >= 416 ? this.setStatus(Snakepot.SnakepotStatus.SMASHED) : !this.hitPlayer && this.y < 350 && this.scene.physics.overlap(this.scene.player, this, this.playerHandler, null, this)
        }
    }
    playerHandler(t, s) {
        this.setStatus(Snakepot.SnakepotStatus.EXPLODE), this.scene.player.blood.activateBlood(this.x, this.y - 20), this.hitPlayer = !0, this.scene.player.deductHealth(80), this.scene.time.delayedCall(350, this.remove, [], this)
    }
    activateSnakepot(t) {
        this.body.reset(t.x + t.xOffset + 300, 200), this.setStatus(Snakepot.SnakepotStatus.NORMAL), this.setVisible(!0), this.setActive(!0)
    }
    setStatus(t, s) {
        switch (this.status = t, t) {
            case Snakepot.SnakepotStatus.NORMAL:
                this.hitPlayer = !1, this.setTexture("snakepot");
                break;
            case Snakepot.SnakepotStatus.SMASHED:
                this.play("potsmash"), this.scene.time.delayedCall(350, this.activateSnake, [], this);
                break;
            case Snakepot.SnakepotStatus.EXPLODE:
                this.play("potexplode"), this.scene.time.delayedCall(350, this.remove, [], this)
        }
    }
    hit(t, s) {
        return this.status == Snakepot.SnakepotStatus.NORMAL ? (this.setStatus(Snakepot.SnakepotStatus.EXPLODE), 200) : 0
    }
    activateSnake() {
        this.snake.activateSnake(this.x, this.y), this.remove()
    }
    remove() {
        this.anims.stop("potsmash"), super.remove(-1e3, Snakepot.SnakepotStatus.INACTIVE)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "potsmash",
            frames: this.scene.game.anims.generateFrameNames("potsmash", {
                frames: [0, 1, 2]
            }),
            frameRate: 8,
            repeat: -1
        }), this.scene.game.anims.create({
            key: "potexplode",
            frames: this.scene.game.anims.generateFrameNames("potexplode", {
                frames: [0, 1, 2]
            }),
            frameRate: 8,
            repeat: -1
        })
    }
}
class Snakepots extends Phaser.Physics.Arcade.Group {
    constructor(t, s) {
        super(t.physics.world, t), this.enableBody = !0, this.physicsBodyType = Phaser.Physics.ARCADE, this.snakepotCount = s, this.createMultiple({
            frameQuantity: s,
            key: "snakepot",
            active: !1,
            visible: !1,
            classType: Snakepot,
            setXY: {
                x: -1e3,
                y: -1e3
            }
        })
    }
    addSingleSnakepot(t) {
        let s = this.getFirstDead(!1);
        s ? s.activateSnakepot(t) : console.log("No spare Snakepot found")
    }
    addSnakepots() {
        for (let t = 0; t < this.snakepotCount; t++) addSingleSnakepot()
    }
    removeAll() {
        this.children.each((function(t, s) {
            t.remove()
        }))
    }
}
class Snake extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "snake"), t.physics.add.existing(this), this.createAnimations(), this.status = Snake.SnakeStatus.INACTIVE, this.hitPlayer = !1, this.setOrigin(.5, 1)
    }
    static SnakeStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case Snake.SnakeStatus.NORMAL:
                this.flipX ? this.x -= 3 : this.x += 3, this.hitPlayer || this.scene.physics.overlap(this.scene.player, this, this.playerHandler, null, this), this.scene.cameras.main.worldView.contains(this.x, this.y) || this.remove()
        }
    }
    playerHandler(t, s) {
        this.scene.player.status != Player.PlayerStatus.JUMP && (this.scene.player.blood.activateBlood(this.x + (this.flipX ? -30 : 30), this.y - 20), this.hitPlayer = !0, this.scene.player.deductHealth(80))
    }
    activateSnake(t, s) {
        this.body.reset(t, s), this.flipX = this.x >= this.scene.player.x, this.hitPlayer = !1, this.setStatus(Snake.SnakeStatus.NORMAL), this.setVisible(!0), this.setActive(!0)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Snake.SnakeStatus.NORMAL:
                this.play("snake")
        }
    }
    remove() {
        super.remove(-1e3, Snake.SnakeStatus.INACTIVE)
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "snake",
            frames: this.scene.game.anims.generateFrameNames("snake", {
                frames: [0, 1]
            }),
            frameRate: 4,
            repeat: -1
        })
    }
}
class Dragon extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "dragon"), t.physics.add.existing(this), this.createAnimations(), this.setOrigin(.5, 1), this.status = Dragon.DragonStatus.INACTIVE, this.dragonFire = new DragonFire(t, -1500, -1500)
    }
    static DragonStatus = {
        INACTIVE: 0,
        FALLING: 1,
        SMOKE: 2,
        FIRE: 3,
        EXPLODE: 4
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case Dragon.DragonStatus.FALLING:
                this.y += 2, 416 == this.y ? this.setStatus(Dragon.DragonStatus.SMOKE) : !this.hitPlayer && this.y < 350 && this.scene.physics.overlap(this.scene.player, this, this.playerHandler, null, this)
        }
        this.scene.cameras.main.worldView.contains(this.x, this.y) || this.remove()
    }
    playerHandler(t, s) {
        this.scene.player.blood.activateBlood(this.x, this.y - 20), this.hitPlayer = !0, this.scene.player.deductHealth(80), this.scene.time.delayedCall(200, this.remove, [], this)
    }
    activateDragon(t) {
        this.body.reset(t.x + t.xOffset + 300, 200), this.setStatus(Dragon.DragonStatus.FALLING), this.setVisible(!0), this.setActive(!0)
    }
    hit(t, s) {
        return this.status == Dragon.DragonStatus.FALLING ? (this.setStatus(Dragon.DragonStatus.EXPLODE), 1e3) : 0
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Dragon.DragonStatus.FALLING:
                this.anims.stop("dragon"), this.anims.stop("potexplode"), this.setTexture("dragonball");
                break;
            case Dragon.DragonStatus.SMOKE:
                this.flipX = this.x >= this.scene.player.x, this.play("dragon"), this.scene.time.delayedCall(1200, this.setStatus, [Dragon.DragonStatus.FIRE], this);
                break;
            case Dragon.DragonStatus.FIRE:
                this.anims.stop("dragon"), this.dragonFire.activateDragonFire(this.x + (this.flipX ? -60 : 60), this.y - 80, this.flipX);
                break;
            case Dragon.DragonStatus.EXPLODE:
                this.play("potexplode"), this.scene.time.delayedCall(350, this.remove, [], this)
        }
    }
    remove() {
        super.remove(-1500, Dragon.DragonStatus.INACTIVE), this.dragonFire.remove()
    }
    createAnimations() {
        this.scene.game.anims.create({
            key: "dragon",
            frames: this.scene.game.anims.generateFrameNames("dragon", {
                frames: [0, 1, 2, 3, 4]
            }),
            frameRate: 4
        })
    }
}
class Dragons extends Phaser.Physics.Arcade.Group {
    constructor(t, s) {
        super(t.physics.world, t), this.enableBody = !0, this.physicsBodyType = Phaser.Physics.ARCADE, this.dragonCount = s, this.createMultiple({
            frameQuantity: s,
            key: "dragon",
            active: !1,
            visible: !1,
            classType: Dragon,
            setXY: {
                x: -1500,
                y: -1500
            }
        })
    }
    addSingleDragon(t) {
        let s = this.getFirstDead(!1);
        s ? s.activateDragon(t) : console.log("No spare Dragon found")
    }
    removeAll() {
        this.children.each((function(t, s) {
            t.remove()
        }))
    }
}
class DragonFire extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "dragonfire"), t.physics.add.existing(this), this.setOrigin(.5, 1), this.status = DragonFire.DragonFireStatus.INACTIVE, this.hitPlayer = !1
    }
    static DragonFireStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case DragonFire.DragonFireStatus.NORMAL:
                this.hitPlayer || this.scene.physics.overlap(this.scene.player, this, this.playerHandler, null, this)
        }
    }
    activateDragonFire(t, s, e) {
        this.xPos = t, this.yPos = s, this.flipX = e, this.body.reset(t, s), this.setStatus(DragonFire.DragonFireStatus.NORMAL), this.setVisible(!0), this.setActive(!0)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case DragonFire.DragonFireStatus.NORMAL:
                this.scene.time.delayedCall(600, this.toggleFire, [], this)
        }
    }
    playerHandler(t, s) {
        this.scene.player.status != Player.PlayerStatus.SWEEP && this.scene.player.status != Player.PlayerStatus.DOWN && (this.scene.player.blood.activateBlood(this.x + (this.flipX ? -30 : 30), this.y - 20), this.hitPlayer = !0, this.scene.player.deductHealth(80))
    }
    toggleFire() {
        this.status == DragonFire.DragonFireStatus.NORMAL && (-1500 == this.x ? (this.x = this.xPos, this.y = this.yPos) : (this.hitPlayer = !1, this.x = -1500, this.y = -1500), this.scene.time.delayedCall(600, this.toggleFire, [], this))
    }
    remove() {
        super.remove(-1500, DragonFire.DragonFireStatus.INACTIVE)
    }
}
class Shrapnel extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "shrapnel"), t.physics.add.existing(this), this.status = Shrapnel.ShrapnelStatus.INACTIVE, this.xAdjust = s, this.yAdjust = e, this.angle = Utilities.random(359)
    }
    static ShrapnelStatus = {
        INACTIVE: 0,
        NORMAL: 1
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case Shrapnel.ShrapnelStatus.NORMAL:
                this.x += this.xAdjust, this.y += this.yAdjust, this.hitPlayer || this.scene.physics.overlap(this.scene.player, this, this.playerHandler, null, this), this.scene.cameras.main.worldView.contains(this.x, this.y) || this.remove()
        }
    }
    playerHandler(t, s) {
        this.scene.player.blood.activateBlood(this.x, this.y), this.hitPlayer = !0, this.scene.player.deductHealth(80)
    }
    activateShrapnel(t, s) {
        this.body.reset(t, s), this.status = Shrapnel.ShrapnelStatus.NORMAL, this.setVisible(!0), this.setActive(!0)
    }
    setStatus(t) {
        switch (this.status = t, t) {
            case Shrapnel.ShrapnelStatus.NORMAL:
        }
    }
    remove() {
        super.remove(-500, Shrapnel.ShrapnelStatus.INACTIVE)
    }
}
class ShrapnelBall extends BaseSprite {
    constructor(t, s, e) {
        super(t, s, e, "shrapnelball"), t.physics.add.existing(this), this.explodeTimer = null, this.setOrigin(.5, .5), this.status = ShrapnelBall.ShrapnelBallStatus.INACTIVE, this.shrapnel = [new Shrapnel(t, -10, 2), new Shrapnel(t, -5, 5), new Shrapnel(t, 5, 5), new Shrapnel(t, 10, 2)]
    }
    static ShrapnelBallStatus = {
        INACTIVE: 0,
        FALLING: 1,
        SPINNING: 2,
        EXPLODE: 3
    };
    preUpdate(t, s) {
        switch (super.preUpdate(t, s), this.status) {
            case ShrapnelBall.ShrapnelBallStatus.FALLING:
                this.y++, this.y >= 280 && this.setStatus(ShrapnelBall.ShrapnelBallStatus.SPINNING);
                break;
            case ShrapnelBall.ShrapnelBallStatus.SPINNING:
                this.angle += 2;
                break;
            case ShrapnelBall.ShrapnelBallStatus.EXPLODE:
        }
    }
    activateShrapnel() {
        for (let t = 0; t < this.shrapnel.length; t++) this.shrapnel[t].activateShrapnel(this.x, this.y)
    }
    activateShrapnelBall(t) {
        this.body.reset(t.x + t.xOffset + 300, 200), this.setStatus(ShrapnelBall.ShrapnelBallStatus.FALLING), this.setVisible(!0), this.setActive(!0)
    }
    setStatus(t, s) {
        switch (this.status = t, t) {
            case ShrapnelBall.ShrapnelBallStatus.FALLING:
                this.angle = 0, this.anims.stop("potexplode"), this.setTexture("shrapnelball");
                break;
            case ShrapnelBall.ShrapnelBallStatus.SPINNING: {
                const t = 500 * Utilities.random(5) + 3e3;
                this.explodeTimer = this.scene.time.delayedCall(t, this.setStatus, [ShrapnelBall.ShrapnelBallStatus.EXPLODE], this)
            }
            break;
        case ShrapnelBall.ShrapnelBallStatus.EXPLODE:
            this.play("potexplode"), s || this.activateShrapnel(), this.explodeTimer = null, this.scene.time.delayedCall(200, this.remove, [], this)
        }
    }
    remove() {
        super.remove(-1500, ShrapnelBall.ShrapnelBallStatus.INACTIVE)
    }
    hit(t, s) {
        return this.status == ShrapnelBall.ShrapnelBallStatus.SPINNING ? (this.setStatus(ShrapnelBall.ShrapnelBallStatus.EXPLODE, !0), 1e3) : 0
    }
}
class ShrapnelBalls extends Phaser.Physics.Arcade.Group {
    constructor(t, s) {
        super(t.physics.world, t), this.enableBody = !0, this.physicsBodyType = Phaser.Physics.ARCADE, this.shrapnelballCount = s, this.createMultiple({
            frameQuantity: s,
            key: "shrapnelball",
            active: !1,
            visible: !1,
            classType: ShrapnelBall,
            setXY: {
                x: -1500,
                y: -1500
            }
        })
    }
    addSingleShrapnelBall(t) {
        let s = this.getFirstDead(!1);
        s ? s.activateShrapnelBall(t) : console.log("No spare ShrapnelBall found")
    }
    addShrapnelBalls() {
        for (let t = 0; t < this.shrapnelballCount; t++) addSingleShrapnelBall()
    }
    removeAll() {
        this.children.each((function(t, s) {
            t.remove()
        }))
    }
}