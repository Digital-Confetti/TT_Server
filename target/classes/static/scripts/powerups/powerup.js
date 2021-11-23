//import { Player } from "/scripts/player/player.js";

export class PowerUp extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y){
        super(scene, x, y);

        this.linkedPlayer;

        this.picked = false;

        this.scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);

        this.scene.add.existing(this);

    }

    collected(){
        console.log('objeto recogido');
    }

    trigger(delta){
        console.log('objeto activado');
    }

    destroyPowerUp(){
        this.scene.activePowerUp = null;
        this.scene.power_up_spawned = false;
        this.destroy();
    }

}