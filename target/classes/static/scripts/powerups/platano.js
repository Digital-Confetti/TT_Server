import { PowerUp } from "./powerup.js";

export class Platano extends PowerUp {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.setTexture('platano')
        this.setScale(1.5, 1.5);

        this.duration = 10 * 1000;

        this.throwed = false;

        this.hit_damage = 40;

        this.throw_force = 200;

        this.body.setOffset(0, 0);
        this.body.setSize(30, 25, false);

        this.drag = 0.5;

        this.platano_player_platano_collider;
        this.platano_player2_platano_collider;

        this.timer;

    }

    collected(player) {
        console.log("platano recogido");

        this.picked = true;
        this.linkedPlayer = player;

        this.timer = this.scene.time.delayedCall(this.duration, this.outTimeTrigger, null, this);

    }

    trigger(delta) {

        if (this.linkedPlayer.getNa() && !this.throwed) {
            this.throwed = true;
            this.body.allowGravity = true;

            if (this.linkedPlayer.looking_R) {
                this.body.velocity.x = this.throw_force;
                this.body.velocity.y = -this.throw_force;
                if (this.flipX) {
                    this.flipX = false;
                }
            } else {
                this.body.velocity.x = -this.throw_force;
                this.body.velocity.y = -this.throw_force;
                if (!this.flipX) {
                    this.flipX = true;
                }
            }



            this.scene.game_player_powerup_collider.active = false;
            this.scene.game_player2_powerup_collider.active = false;

            this.platano_player_platano_collider = this.scene.physics.add.collider(this.scene.player, this, this.hitPlayer, null, this);
            this.platano_player2_platano_collider = this.scene.physics.add.collider(this.scene.player2, this, this.hitPlayer, null, this);
        }

        if (!this.throwed) {

            this.x = this.linkedPlayer.x;
            this.y = this.linkedPlayer.y - 60;
            this.body.allowGravity = false;

            if (this.linkedPlayer.looking_R) {
                if (this.flipX) {
                    this.flipX = false;
                }
            } else {
                if (!this.flipX) {
                    this.flipX = true;
                }
            }

        }
        else if (this.throwed && this.body.touching.down) {

            if (this.body.velocity.x > 0) {
                this.body.velocity.x -= this.drag * delta;
                if (this.body.velocity.x <= 0) {
                    this.body.setVelocityX(0);
                }
            }else if(this.body.velocity.x < 0){
                this.body.velocity.x += this.drag * delta;
                if (this.body.velocity.x >= 0) {
                    this.body.setVelocityX(0);
                }
            }

        }

    }

    outTimeTrigger() {
        console.log('platano destruido');
        this.timer.remove();
        this.scene.physics.world.removeCollider(this.platano_player_platano_collider);
        this.scene.game_player_powerup_collider.active = true;
        this.destroyPowerUp();

    }

    hitPlayer(player) {
        console.log('player dañado');
        this.scene.sound.play('caida');
        player.setVida(player.getVida() - this.hit_damage);

        this.outTimeTrigger();
    }

}