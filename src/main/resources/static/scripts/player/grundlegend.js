import { Player } from "./player.js";
import { GL_Proyectile } from "./gl_proyectile.js";

export class GrundLegend extends Player{
    constructor(scene, x, y){
        super(scene, x, y, 'grundlegend');

        this.key = 0;

        this.maxVida = 180;
        this.vida = 180;

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
        this.dash_Timer = scene.time.addEvent({delay:this.dashCoolDown, loop:true});

        this.x_move;
        this.y_move;

        this.charging = false;
        this.proyectile_Size = 0;
        this.proyectiles = [];
        this.shoot_Avaliable = true;
        this.shoot_damage = 10;
        
        this.create_Animations(scene);
        this.play('idle');
    }

    create_Animations(scene)
    {

        var chara = 'grundlegend'
        // Idle
        scene.anims.create({
            key: 'idle',
            frames: [{ key: chara, frame: chara + '_idle.png' }],
            frameRate: -1
        });

        scene.anims.create({
            key: 'dash',
            frames: [{ key: chara, frame: chara + '_dash.png' }],
            frameRate: -1
        });

        scene.anims.create({
            key: 'run',
            frames: [{
                    key: chara,
                    frame: chara + '_Walk0.png'
                },{
                    key: chara,
                    frame: chara + '_Walk1.png'
                },
            ],
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'punch',
            frames: [
                {
                    key: chara,
                    frame: chara + '_Punch0.png'
                },
                {
                    key: chara,
                    frame: chara + '_Punch1.png'
                },
                {
                    key: chara,
                    frame: chara + '_Punch2.png'
                },
            ],
            frameRate: 5,
            repeat: 0
        });

        scene.anims.create({
            key: 'special',
            frames: [
                {
                    key: chara,
                    frame: chara + '_Special0.png'
                },
                {
                    key: chara,
                    frame: chara + '_Special1.png'
                },
                {
                    key: chara,
                    frame: chara + '_Special2.png'
                },
                {
                    key: chara,
                    frame: chara + '_Special3.png'
                },
            ],
            frameRate: 3,
            repeat: 0
        });

        scene.anims.create({
            key: 'size1',
            frames: [{ 
                key: 'grundlegend', 
                frame: 'grundlegend_Proyectil00.png' 
            },{ 
                key: 'grundlegend', 
                frame: 'grundlegend_Proyectil01.png' 
            },
            ],
            frameRate: 15,
            repeat: -1
        });

        scene.anims.create({
            key: 'size2',
            frames: [{ 
                key: 'grundlegend', 
                frame: 'grundlegend_Proyectil10.png' 
            },{ 
                key: 'grundlegend', 
                frame: 'grundlegend_Proyectil11.png' 
            },
            ],
            frameRate: 15,
            repeat: -1
        });

        scene.anims.create({
            key: 'size3',
            frames: [{ 
                key: 'grundlegend', 
                frame: 'grundlegend_Proyectil20.png' 
            },{ 
                key: 'grundlegend', 
                frame: 'grundlegend_Proyectil21.png' 
            },
            ],
            frameRate: 15,
            repeat: -1
        });
    }

    reset_ATA_N(){ this.playerStatus = Player.PlayerStatus.IDDLE;}

    reset_Shoot() { this.shoot_Avaliable = true; }

    reCheck_SpecialAttack()
    {
        if(this.keySA && this.proyectile_Size < 3)
        {
            this.proyectile_Size++;
            this.SpecialAttackTimer = this.scene.time.delayedCall(0.66 * 1000, this.reCheck_SpecialAttack, null, this);
            this.conditional_Color();
        }else{ 
            if (this.proyectile_Size != 0)
            {
                this.shoot();
                this.shoot_Avaliable = false;
                this.shoot_timer = this.scene.time.delayedCall(0.5 * 1000, this.reset_Shoot, null, this);
            }
            this.proyectile_Size = 0;
            this.charging = false;
            this.reset_HITTED();
        }
    }
    shoot()
    {
        var x_pos = this.x;
        if (this.looking_R)
        {
            x_pos += 60;
        } else {
            x_pos -= 60;
        }
        let bala = new GL_Proyectile(this.scene, x_pos, this.y - 50, this.proyectile_Size);
        if (!this.looking_R)
        {
            bala.flipDirection();
        }
        this.colisionador = this.scene.physics.add.collider(this.scene.player, bala, this.hitPlayer, null, this);
        this.colisionador2 = this.scene.physics.add.collider(this.scene.player2, bala, this.hitPlayer, null, this);

        this.proyectiles.push(bala);
          
    }

    hitPlayer(player, bullet)
    {
        let dmg = this.shoot_damage * bullet.p_Size;
        this.scene.sound.play('impacto');
        console.log('player dañado: ' + dmg);
        player.setVida(player.getVida() - dmg);
            player.x_move = 2;
            player.y_move = -250;
            player.looking_R = bullet.x < player.x;
            player.playerStatus = Player.PlayerStatus.HITTED;
        player.lauch_reset_HITTED();
        bullet.destroy();
    }

    conditional_Color()
    {
        switch(this.proyectile_Size)
        {
            case 0:
                break;
            case 1:
                this.setTint(0xB2B2FF);
                break;
            case 2:
                this.setTint(0x4F4FFF);
                break;
            case 3:
                this.setTint(0x0000FF);
                break;
        }
    }
    

    lauch_reset_HITTED() {
        this.reset_HIT = this.scene.time.delayedCall(0.49 * 1000, this.reset_HITTED, null, this);
    }
    reset_HITTED(){ this.playerStatus = Player.PlayerStatus.IDDLE;
        this.setTint(0xFFFFFF);}

    check_SpecialAttack()
    {
        if(this.keySA && this.body.touching.down && !this.charging)
        {
            this.charging = true;
            this.playerStatus = Player.PlayerStatus.ATA_S;
            this.resetTimer = this.scene.time.delayedCall(0.66 * 1000, this.reCheck_SpecialAttack, null, this);
        }
    }

    check_NormalAttack()
    {
        if(this.keyNA)
        {
            this.playerStatus = Player.PlayerStatus.ATA_N;
            this.resetTimer = this.scene.time.delayedCall(0.66 * 1000, this.reset_ATA_N, null, this);
        }
    }

    move_Jump(delta){
        if (this.looking_R && this.keyA){
            this.looking_R = false
        } else if (!this.looking_R && this.keyD){
            this.looking_R = true
        } else if (!this.keyA && !this.keyD)
        {
            if (this.looking_R && this.body.velocity.x != 0){
                this.body.velocity.x -= this.jump_drag * delta;
                if (this.body.velocity.x <= 0){
                    this.body.setVelocityX(0);
            }} else if (!this.looking_R && this.body.velocity.x != 0){
                this.body.velocity.x += this.jump_drag * delta; 
                if (this.body.velocity.x >= 0){   
                    this.body.setVelocityX(0);
            }}
            return;
        }

        if(this.looking_R){
            if (this.body.velocity.x < this.horizontalJumpSpeed) this.body.velocity.x += this.jump_aceleration * delta;
        } else {
            if (this.body.velocity.x > -1 * this.horizontalJumpSpeed) this.body.velocity.x -= this.jump_aceleration * delta;
        }

        
    }

    check_Jump(){
        if (this.playerStatus == Player.PlayerStatus.JUMP_1 || this.playerStatus == Player.PlayerStatus.JUMP_2)
        {
            if (this.body.touching.down){
                this.playerStatus = Player.PlayerStatus.IDDLE;
            }
        }

        if (this.keySPACE && this.body.touching.down)
        {
            this.body.setVelocityY(-430);
            this.playerStatus = Player.PlayerStatus.JUMP_1;
        }
    }

    check_Dash(){
        if (this.dashAllowed && this.keySHIFT){
            this.dashAllowed = false;
            this.playerStatus = Player.PlayerStatus.DASHING;
            this.dash_R = this.looking_R;
        }
    }

    timer_Update(){
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
    logic(delta)
    {
        switch(this.playerStatus)
        {
            case Player.PlayerStatus.IDDLE:
                    if(this.keyA){
                        this.playerStatus = Player.PlayerStatus.MOVING;
                        this.looking_R = false;
                    } else if(this.keyD) {
                        this.playerStatus = Player.PlayerStatus.MOVING;
                        this.looking_R = true;
                    }
                    this.check_Jump();
                    this.check_Dash();
                    this.check_NormalAttack();
                    this.check_SpecialAttack()
                break;
            case Player.PlayerStatus.MOVING:
                    if(this.keyA){
                        this.looking_R = false;
                    } else if(this.keyD){
                        this.looking_R = true;
                    } 
                    if(!this.keyA && !this.keyD){
                        this.playerStatus = Player.PlayerStatus.IDDLE;
                    }
                    this.check_Jump();
                    this.check_Dash();
                    this.check_NormalAttack();
                    this.check_SpecialAttack()
                break;
            case Player.PlayerStatus.DASHING:
                this.dashAllowed = false;
                break;
            case Player.PlayerStatus.JUMP_1:
                if (this.keySPACE && this.body.velocity.y > -200) {
                    this.body.setVelocityY(-430);
                    this.playerStatus = Player.PlayerStatus.JUMP_2;
                }
                if (this.body.touching.down){
                    this.playerStatus = Player.PlayerStatus.IDDLE;
                }
                this.check_Dash();
                this.check_NormalAttack();
                break;
            case Player.PlayerStatus.JUMP_2:
                if (this.body.touching.down){
                    this.playerStatus = Player.PlayerStatus.IDDLE;
                }
                this.check_Dash();
                this.check_NormalAttack();
                break;
            case Player.PlayerStatus.ATA_S:
                if (this.keyA && this.looking_R)
                {
                    this.looking_R = false;
                } else if (this.keyD && !this.looking_R)
                {
                    this.looking_R = true;
                }
                break;
            case Player.PlayerStatus.ATA_N:
                break;
            case Player.PlayerStatus.HITTED:
                break;
        }

    }

    // Actualize  position // Create 
    calculate(delta)
    {
        switch(this.playerStatus)
        {
            case Player.PlayerStatus.IDDLE:
                if (this.looking_R && this.body.velocity.x != 0){
                    this.body.velocity.x -= this.drag * delta;
                    if (this.body.velocity.x <= 0){
                        this.body.setVelocityX(0);
                }} else if (!this.looking_R && this.body.velocity.x != 0){
                    this.body.velocity.x += this.drag * delta; 
                    if (this.body.velocity.x >= 0){   
                        this.body.setVelocityX(0);
                }}
                break;
            case Player.PlayerStatus.MOVING:
                if (this.looking_R && this.keyA){
                    this.looking_R = false
                } else if (!this.looking_R && this.keyD){
                    this.looking_R = true
                }

                if(this.looking_R){
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
                if(this.body.touching.left)
                {
                    this.dash_R = true;
                    this.looking_R = true;
                } else if (this.body.touching.right)
                {
                    this.dash_R = false;
                    this.looking_R = false;
                }

                if (this.dash_R)
                {
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
                this.body.velocity.x = 0;
                break;
            case Player.PlayerStatus.ATA_N:
                break;
            case Player.PlayerStatus.HITTED:
                if (this.moving_R)
                {
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
    animate(delta)
    {
        switch(this.playerStatus)
        {
            case Player.PlayerStatus.IDDLE:
                this.load_animation('idle');
                break;
            case Player.PlayerStatus.MOVING:
                this.load_animation('run');
                break;
            case Player.PlayerStatus.DASHING:
                this.load_animation('dash');
                break;
            case Player.PlayerStatus.JUMP_1:
                break;
            case Player.PlayerStatus.JUMP_2:
                break;
            case Player.PlayerStatus.ATA_S:
                this.load_animation('special');
                break;
            case Player.PlayerStatus.ATA_N:
                this.load_animation('punch');
                break;
            case Player.PlayerStatus.HITTED:
                this.setTint(0xff0000);
                break;
        }

        this.flipX = !this.looking_R;
    }

    load_animation(anima)
    { 
        if (this.playingAnim != anima)
        {
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

    update(delta)
    {
        this.timer_Update();

        // PrevST + Inputs = NewST
        this.logic(delta);

        // Actualize  position // Create 
        this.calculate(delta);

        // Load the animation
        this.animate(delta);

        for (var i = 0; i < this.proyectiles.length; i++)
        {
            this.proyectiles[i].update(delta);
        }

        this.checkRespawn();
        //console.log(this.playerStatus);
    }

/*  #### OLD ####
    update(delta){
        this.playerPhysics(delta);
    }
*/
}