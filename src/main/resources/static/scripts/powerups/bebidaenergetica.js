import { PowerUp } from "./powerup.js";

export class BebidaEnergetica extends PowerUp{
    constructor(scene, x, y){
        super(scene, x, y);

        this.setTexture('bebidaenergetica')
        this.setScale(1.5,1.5);

        this.alpha = 1;

        //velocity boost 50%
        this.baseVelocity;
        this.baseAceleration;
        this.bonusVelocity = 2;
        this.bonusAceleration = 1;

        this.duration = 5 * 1000;

        this.body.setOffset(0, 0);
        this.body.setSize(30, 32, false);

    }

    collected(player){
        console.log("bebida energetica consumida");

        this.picked = true;
        this.linkedPlayer = player;

        this.baseVelocity = this.linkedPlayer.getVelocidad();
        //this.baseAceleration = this.linkedPlayer.getAceleration();

        this.scene.sound.play('beber');

        this.linkedPlayer.setVelocidad(this.linkedPlayer.getVelocidad() * this.bonusVelocity);
        //this.linkedPlayer.setAceleration(this.linkedPlayer.getAceleration() + this.linkedPlayer.getAceleration() * this.bonusAceleration);

        //provisional object dissapear
        this.scene.physics.world.disableBody(this.body);
        this.alpha = 0;

        this.scene.time.delayedCall(this.duration, this.outTimeTrigger, null, this);

    }

    outTimeTrigger(){
        console.log('se acabo el tiempo');

        this.linkedPlayer.setVelocidad( this.baseVelocity);
        //this.linkedPlayer.setAceleration( this.baseAceleration);

        this.destroyPowerUp();
    }
}