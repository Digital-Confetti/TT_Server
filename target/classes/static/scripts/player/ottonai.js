import { Player } from "./player.js";

export class Ottonai extends Player {
    constructor(scene, x, y) {
        super(scene, x, y, 'ottonai');

        this.key = 1;

        this.maxVida = 100;
        this.vida = 100;

        this.body.setBounce(0.1);
        //animacion run
        //this.body.height = 80;
        this.jump_aceleration = 1;
        this.jump_drag = 1;
        //animacion idle
        this.body.height = 84;
        this.body.width = 60;
        this.horizontalJumpSpeed = 1.5 * this.horizontalSpeed;

        this.playingAnim = 'idle';
        this.play(this.playingAnim);

        this.dashCoolDown = 3 * 1000;
        this.dash_Timer = scene.time.addEvent({ delay: this.dashCoolDown, loop: true });

        this.x_move;
        this.y_move;

        this.speed_Bonus = 100;
        this.damage_Bonus = 20;
        this.sumado = false;

        this.create_Animations(scene);
        this.play('otto_idle');
    }

    create_Animations(scene) {

        var route = 'stores/characters/'

        var chara = 'ottonai'
        // Idle
        scene.anims.create({
            key: 'otto_idle',
            frames: [{ key: chara, frame: chara + '_idle.png' }],
            frameRate: -1
        });

        scene.anims.create({
            key: 'otto_dash',
            frames: [{ key: chara, frame: chara + '_dash.png' }],
            frameRate: -1
        });

        scene.anims.create({
            key: 'otto_run',
            frames: [{
                key: chara,
                frame: chara + '_walk0.png'
            }, {
                key: chara,
                frame: chara + '_walk1.png'
            }, {
                key: chara,
                frame: chara + '_walk2.png'
            },
            ],
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'otto_punch',
            frames: [

                {
                    key: chara,
                    frame: chara + '_normalAttack2.png'
                }
            ],
            frameRate: -1,
            repeat: 0
        });
    }

    reset_ATA_N() { this.playerStatus = Player.PlayerStatus.IDDLE; }
    reset_Sumado() { this.sumado = false;
                    this.setTint(0xFFFFFF);
                    }
    reset_ATA_S() { this.playerStatus = Player.PlayerStatus.IDDLE;
        this.horizontalSpeed -= this.speed_Bonus;
        this.attack_damage -= this.damage_Bonus;
        this.setTint(0xFFFF7A);
        this.resetTimerSA = this.scene.time.delayedCall(6 * 1000, this.reset_Sumado, null, this);
    }


    lauch_reset_HITTED() {
        this.reset_HIT = this.scene.time.delayedCall(0.49 * 1000, this.reset_HITTED, null, this);
    }
    reset_HITTED() {
        this.playerStatus = Player.PlayerStatus.IDDLE;
        this.setTint(0xFFFFFF);
    }

    check_NormalAttack() {
        //console.log('Al ATAQUE');
        if (this.keyNA) {
            this.playerStatus = Player.PlayerStatus.ATA_N;
            this.resetTimer = this.scene.time.delayedCall(0.66 * 1000, this.reset_ATA_N, null, this);
        }
    }

    check_SpecialAttack()
    {
        if (this.keySA && !this.sumado)
        {
            this.horizontalSpeed += this.speed_Bonus;
            this.attack_damage += this.attack_damage;
            this.sumado = true;
            this.setTint(0xFF4F4F);
            this.resetTimerSA = this.scene.time.delayedCall(2 * 1000, this.reset_ATA_S, null, this);
        }
    }

    move_Jump(delta) {
        if (this.looking_R && this.keyA) {
            this.looking_R = false
        } else if (!this.looking_R && this.keyD) {
            this.looking_R = true
        } else if (!this.keyA && !this.keyD) {
            if (this.looking_R && this.body.velocity.x != 0) {
                this.body.velocity.x -= this.jump_drag * delta;
                if (this.body.velocity.x <= 0) {
                    this.body.setVelocityX(0);
                }
            } else if (!this.looking_R && this.body.velocity.x != 0) {
                this.body.velocity.x += this.jump_drag * delta;
                if (this.body.velocity.x >= 0) {
                    this.body.setVelocityX(0);
                }
            }
            return;
        }

        if (this.looking_R) {
            if (this.body.velocity.x < this.horizontalJumpSpeed) this.body.velocity.x += this.jump_aceleration * delta;
        } else {
            if (this.body.velocity.x > -1 * this.horizontalJumpSpeed) this.body.velocity.x -= this.jump_aceleration * delta;
        }


    }

    check_Jump() {
        if (this.playerStatus == Player.PlayerStatus.JUMP_1 || this.playerStatus == Player.PlayerStatus.JUMP_2) {
            if (this.body.touching.down) {
                this.playerStatus = Player.PlayerStatus.IDDLE;
            }
        }

        if (this.keySPACE && this.body.touching.down) {
            this.body.setVelocityY(-430);
            this.playerStatus = Player.PlayerStatus.JUMP_1;
        }
    }

    check_Dash() {
        if (this.dashAllowed && this.keySHIFT) {
            this.dashAllowed = false;
            this.playerStatus = Player.PlayerStatus.DASHING;
            this.dash_R = this.looking_R;
        }
    }

    timer_Update() {
        let progress = this.dash_Timer.getProgress();

        this.dash_Timer.paused = this.dashAllowed;

        if (progress >= 0.08 && progress <= 0.97) {
            this.playerStatus = Player.PlayerStatus.MOVING;
            this.dashActivated = false;
            if (Math.abs(this.body.velocity.x) > this.horizontalSpeed) {
                if (this.moving_R) {
                    this.body.velocity.x = 0.95 * this.horizontalSpeed;
                } else {
                    this.body.velocity.x = -0.95 * this.horizontalSpeed;
                }
            }

        } else if (progress >= 0.99) {
            this.dashAllowed = true;
        }
    }

    // PrevST + Inputs = NewST
    logic(delta) {
        switch (this.playerStatus) {
            case Player.PlayerStatus.IDDLE:
                if (this.keyA) {
                    this.playerStatus = Player.PlayerStatus.MOVING;
                    this.looking_R = false;
                } else if (this.keyD) {
                    this.playerStatus = Player.PlayerStatus.MOVING;
                    this.looking_R = true;
                }
                this.check_Jump();
                this.check_Dash();
                this.check_NormalAttack();
                this.check_SpecialAttack();
                break;
            case Player.PlayerStatus.MOVING:
                if (this.keyA) {
                    this.looking_R = false;
                } else if (this.keyD) {
                    this.looking_R = true;
                }
                if (!this.keyA && !this.keyD) {
                    this.playerStatus = Player.PlayerStatus.IDDLE;
                }
                this.check_Jump();
                this.check_Dash();
                this.check_NormalAttack();
                this.check_SpecialAttack();
                break;
            case Player.PlayerStatus.DASHING:
                this.dashAllowed = false;
                break;
            case Player.PlayerStatus.JUMP_1:
                if (this.keySPACE && this.body.velocity.y > -200) {
                    this.body.setVelocityY(-430);
                    this.playerStatus = Player.PlayerStatus.JUMP_2;
                }
                if (this.body.touching.down) {
                    this.playerStatus = Player.PlayerStatus.IDDLE;
                }
                this.check_Dash();
                this.check_NormalAttack();
                this.check_SpecialAttack();
                break;
            case Player.PlayerStatus.JUMP_2:
                if (this.body.touching.down) {
                    this.playerStatus = Player.PlayerStatus.IDDLE;
                }
                this.check_Dash();
                this.check_NormalAttack();
                this.check_SpecialAttack();
                break;
            case Player.PlayerStatus.ATA_S:
                break;
            case Player.PlayerStatus.ATA_N:
                break;
            case Player.PlayerStatus.HITTED:
                break;
        }

    }

    // Actualize  position // Create 
    calculate(delta) {
        switch (this.playerStatus) {
            case Player.PlayerStatus.IDDLE:
                if (this.looking_R && this.body.velocity.x != 0) {
                    this.body.velocity.x -= this.drag * delta;
                    if (this.body.velocity.x <= 0) {
                        this.body.setVelocityX(0);
                    }
                } else if (!this.looking_R && this.body.velocity.x != 0) {
                    this.body.velocity.x += this.drag * delta;
                    if (this.body.velocity.x >= 0) {
                        this.body.setVelocityX(0);
                    }
                }
                break;
            case Player.PlayerStatus.MOVING:
                if (this.looking_R && this.keyA) {
                    this.looking_R = false
                } else if (!this.looking_R && this.keyD) {
                    this.looking_R = true
                }

                if (this.looking_R) {
                    if (this.body.velocity.x < this.horizontalSpeed) this.body.velocity.x += this.aceleration * delta;
                } else {
                    if (this.body.velocity.x > -1 * this.horizontalSpeed) this.body.velocity.x -= this.aceleration * delta;
                }

                if (Math.abs(this.body.velocity.x) > this.horizontalSpeed) {
                    if (this.looking_R) {
                        this.body.velocity.x = 0.95 * this.horizontalSpeed;
                    } else {
                        this.body.velocity.x = -0.95 * this.horizontalSpeed;
                    }
                }
                break;
            case Player.PlayerStatus.DASHING:
                if (this.body.touching.left) {
                    this.dash_R = true;
                    this.looking_R = true;
                } else if (this.body.touching.right) {
                    this.dash_R = false;
                    this.looking_R = false;
                }

                if (this.dash_R) {
                    this.body.velocity.x = this.dashForce;
                } else {
                    this.body.velocity.x = -1 * this.dashForce;
                }
                break;
            case Player.PlayerStatus.JUMP_1:
                this.move_Jump(delta);
                break;
            case Player.PlayerStatus.JUMP_2:
                this.move_Jump(delta);
                break;
            case Player.PlayerStatus.ATA_S:
                break;
            case Player.PlayerStatus.ATA_N:
                break;
            case Player.PlayerStatus.HITTED:
                if (this.moving_R) {
                    console.log('DERECHA');
                    this.body.acceleration.x = this.x_move;
                    this.body.velocity.y = this.y_move;
                    //this.body.acceleration.y = -7;
                } else {
                    console.log('IZQUIERDA');
                    this.body.acceleration.x = -1 * this.x_move;
                    this.body.velocity.y = this.y_move;
                    //this.body.acceleration.y = -7;
                }
                break;
        }
    }

    // Load the animation
    animate(delta) {
        switch (this.playerStatus) {
            case Player.PlayerStatus.IDDLE:
                this.load_animation('otto_idle');
                break;
            case Player.PlayerStatus.MOVING:
                this.load_animation('otto_run');
                break;
            case Player.PlayerStatus.DASHING:
                this.load_animation('otto_dash');
                break;
            case Player.PlayerStatus.JUMP_1:
                break;
            case Player.PlayerStatus.JUMP_2:
                break;
            case Player.PlayerStatus.ATA_S:
                break;
            case Player.PlayerStatus.ATA_N:
                this.load_animation('otto_punch');
                break;
            case Player.PlayerStatus.HITTED:
                this.setTint(0xff0000);
                break;
        }

        this.flipX = !this.looking_R;
    }

    load_animation(anima) {
        if (this.playingAnim != anima) {
            this.playingAnim = anima;
            this.play(this.playingAnim);
        }
    }

    checkRespawn() {
        if ((this.vida <= 0 || this.y > 1500)&&(!this.muerto)) {
            this.muerto = true;

            this.vidas--;
            this.vida = this.maxVida;

            this.body.setCollideWorldBounds(false);
            this.body.allowGravity = false;

            this.x = 3000;
            this.y = 3000;

            this.scene.time.delayedCall(this.respawn_timer, this.respawn, null, this);

        }

    }

    respawn() {

        this.body.setCollideWorldBounds(true);
        this.body.allowGravity = true;

        this.x = this.respawnX;
        this.y = this.respawnY;

        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        this.muerto = false;
    }

    update(delta) {
        this.timer_Update();

        // PrevST + Inputs = NewST
        this.logic(delta);

        // Actualize  position // Create 
        this.calculate(delta);

        // Load the animation
        this.animate(delta);

        this.checkRespawn();
        //console.log(this.playerStatus);
    }

    /*  #### OLD ####
        update(delta){
            this.playerPhysics(delta);
        }
    */
}