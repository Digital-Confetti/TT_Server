export class Bala extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;

        this.setTexture('disparo')
        this.setScale(3, 3);

        this.body.setOffset(0, 0);
        this.body.setSize(14, 7, false);

        this.active = true;

        this.velocidadx = 1300
        this.velocidady = 0;

        this.scene.add.existing(this);

    }


    flipDirection() {
        
        this.flipX = true;
        this.velocidadx = -this.velocidadx;
    }

    update() {
        if (this.active) {
            this.body.velocity.x = this.velocidadx;
            this.body.velocity.y = this.velocidady;
        }

    }

}