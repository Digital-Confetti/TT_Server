import { Player } from "./player.js";

export class PunchingBag extends Player{
    constructor(scene, x, y){
        super(scene, x, y, 'PB');

        this.body.setSize(33, 64, false);

        this.hited = false;
        this.moving_R = true;
        this.drag = 0.5;
    }

    renove(delta)
    {
        //this.body.setVelocityX(0);
        if (!this.hited)
        {
            if (this.body.velocity.x > 0){
                this.body.velocity.x -= this.drag * delta;
                if (this.body.velocity.x <= 0) this.body.velocity.x = 0;
            }  else if(this.body.velocity.x < 0){
                this.body.velocity.x += this.drag * delta;
                if (this.body.velocity.x >= 0) this.body.velocity.x = 0;
            }
        } if (this.hited)
        {
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
        }
    }
    resetHitted()
    {
        this.hited = false;
        this.play('PB_idle');
    }

    getHitted(direction, x, y)
    {
        this.hited = true;
        this.x_move = x;
        this.y_move = y;

        this.flipX = !direction;

        this.play('PB_punch');
        if (direction)
        {
            this.moving_R = true;
        } else {
            this.moving_R = false;
        }

        this.resetTimer = this.scene.time.delayedCall(0.5 * 1000, this.resetHitted, null, this);
    }
}