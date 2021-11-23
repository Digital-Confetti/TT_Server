import { PowerUp } from "./powerup.js";
import { Bala } from "./bala.js";

export class Pistola extends PowerUp {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.setTexture('pistola')
        this.setScale(1.5, 1.5);

        this.body.setOffset(0, 0);
        this.body.setSize(30, 31, false);

        this.hit_damage = 30;

        this.bullet = [];
        this.max_ammo = 1;
        this.ammo = this.max_ammo;

        this.shoot_cooldown = 0.5 * 1000;
        this.dissapear_cooldown = 10 * 1000;
        this.out_of_ammo_cooldown = 1 * 1000;

        this.able_shoot = true;
        this.dissapeared = false;

        this.fusil_player_bullet_collider = [];
        this.fusil_player2_bullet_collider = [];

        this.timer;

    }

    collected(player) {

        this.picked = true;
        this.body.allowGravity = false;
        this.linkedPlayer = player;

        this.timer = this.scene.time.delayedCall(this.dissapear_cooldown, this.outTimeTrigger, null, this);

    }

    trigger(delta) {

        if(this.linkedPlayer.looking_R){
            this.x = this.linkedPlayer.x + 40;
            this.y = this.linkedPlayer.y-50;
            if(this.flipX){
                this.flipX = false;
            }
        }else{
            this.x = this.linkedPlayer.x - 40;
            this.y = this.linkedPlayer.y-50;
            if(!this.flipX){
                this.flipX = true;
            }
        }

        //console.log(this.linkedPlayer.looking_R);

        if (this.linkedPlayer.getNa() && this.ammo > 0 && this.able_shoot) {
            this.ammo--;
            this.able_shoot = false;

            console.log('disparo realizado');

            this.scene.game_player_powerup_collider.active = false;
            this.scene.game_player2_powerup_collider.active = false;

            
            if(this.linkedPlayer.looking_R){
                this.bala = new Bala(this.scene, this.x + 25, this.y-2);
            }else{
                this.bala = new Bala(this.scene, this.x - 25, this.y-2);
                this.bala.flipDirection();
            }

            this.scene.sound.play('disparo');

            this.colisionador = this.scene.physics.add.collider(this.scene.player, this.bala, this.hitPlayer, null, this);
            this.colisionador2 = this.scene.physics.add.collider(this.scene.player2, this.bala, this.hitPlayer, null, this);

            this.bullet.push(this.bala);
            this.fusil_player_bullet_collider.push(this.colisionador);
            this.fusil_player2_bullet_collider.push(this.colisionador2);

            this.scene.time.delayedCall(this.shoot_cooldown, function () { this.able_shoot = true }, null, this);

        }

        

        for (var i = 0; i < this.bullet.length; i++) {

            if (this.bullet[i].active) {

                this.bullet[i].update();

            }

        }

        if (this.ammo == 0 && !this.dissapeared) {
            this.dissapeared = true;

            this.timer.remove();

            this.scene.time.delayedCall(this.out_of_ammo_cooldown, this.outTimeTrigger, null, this)
        }


    }

    outTimeTrigger() {

        this.dissapeared = true;

        console.log('fusil destruido');

        this.scene.game_player_powerup_collider.active = true;

        for (var i = 0; i < this.bullet.length; i++) {

            if (this.bullet[i].active) {
                this.bullet[i].destroy();
                this.scene.physics.world.removeCollider(this.fusil_player_bullet_collider[i]);
                this.scene.physics.world.removeCollider(this.fusil_player2_bullet_collider[i]);
            }

        }

        this.destroyPowerUp();

    }

    hitPlayer(player, bullet) {
        console.log('player dañado');

        bullet.active = false;
        bullet.destroy();

        this.scene.sound.play('impacto');
        player.setVida(player.getVida() - this.hit_damage);

    }

}