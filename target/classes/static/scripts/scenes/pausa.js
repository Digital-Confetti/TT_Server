export class Pausa_Scene extends Phaser.Scene{

    constructor() {
        super({ key: 'select_Pausa' });

        this.background;

        this.resume;

        this.pointer;
    }

    preload() {
        console.log('Menu Seleccion pausa');

        //this.scene.launch("game_Scene");

        this.load.image('fondopausa', 'stores/menu/menu_pausa.jpg');
        this.load.image('botonresume', 'stores/menu/button/boton RESUME.png');

        this.load.audio('espada', 'stores/sounds/desenvainar_espada.mp3');
    }
    pausar(){
        this.sound.play('espada');
        this.scene.launch('game_Scene');
        this.scene.pause('select_Pausa');
        
    }
    create() {
        this.background = this.add.image(0, 0, 'fondopausa');
        this.background.setScale(1.4);
        this.background.setOrigin(0);
        this.background.alpha= 0.7;

        this.resume = this.add.image(600, 400, 'botonresume').setInteractive();
        this.resume.setScale(1.5);
        this.resume.alpha = 0.8;
        //this.events.emit ('gameCountDown', ({countDown: 10}));
        this.pausa = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        var that = this;

        this.resume.on('pointerdown', function(pointer){
            that.sound.play('espada');
            that.scene.wake("game_Scene");
            that.scene.remove("select_Pausa");
        })
        
        /*this.input.keyboard.on('keydown', function (event) {
            if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.ENTER && !that.keyENTER) {
                console.log('W Pressed');
                that.pausar();
                //that.resume.alpha = 0;
                //that.background.alpha= 0;
            }            
        });
        */
        
    }

    update() {
        if(this.pausa.isDown){
            console.log('enter')
            this.scene.stop("select_Pausa");
            this.scene.wake("game_Scene")
        }
        this.pointer = this.input.activePointer;
        
        //console.log(this.pointer.x, this.pointer.y);
    }
}