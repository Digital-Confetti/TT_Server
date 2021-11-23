export class GL_Proyectile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, proyectile_size) {
        super(scene, x, y, );

        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;

        this.p_Size = proyectile_size;

        let aux = 'size' + proyectile_size;
        this.play(aux);

        this.body.setOffset(0, 0);

        this.body.setSize(14, 7, false);

        this.velocidadx = 600;
        this.velocidadx /= proyectile_size;
        this.velocidady = 0;

        this.scene.add.existing(this);

    }

    animation_Declaration(){

        

    }


    flipDirection() {
        
        this.flipX = true;
        this.velocidadx = -this.velocidadx;
    }

    update(delta) {
        if (this.active) {
            this.body.velocity.x = this.velocidadx;
            this.body.velocity.y = this.velocidady;
        }

    }

}