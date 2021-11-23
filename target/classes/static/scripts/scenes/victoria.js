export class Victoria_Scene extends Phaser.Scene {

    constructor() {
        super({ key: 'Victoria_menu' });

        this.background;

        this.resume;

        this.pointer;

        this.winner_key;

    }

    init(data) {

        // saving the winner character
        this.winner_key = data.index;



    }

    preload() {
        console.log('Menu Seleccion victoria');

        this.load.image('fondopausa', 'stores/menu/victoria.jpg');
        this.load.image('victoria', 'stores/menu/victoria_.png');
        this.load.image('gana_la_amistad', 'stores/menu/gana_la_amistad.png');
        this.load.image('gana_grundlegend', 'stores/menu/grundlegend.png');
        this.load.image('gana_ottonai', 'stores/menu/otonnai.png');
        this.load.image('botonsalir', 'stores/menu/button/boton_salir.png');


        this.load.image('grundlegend_victory', 'stores/characters/GrundLegend/grundLegend_victory.png');
        this.load.image('ottonai_victory', 'stores/characters/Ottonai/ottonai_victory.png');

        this.load.audio('espada', 'stores/sounds/desenvainar_espada.mp3');
    }

    create() {

        this.background = this.add.image(0, 0, 'fondopausa');
        this.background.setScale(1.4);
        this.background.setOrigin(0);
        this.background.alpha = 0.2;

        this.victoria = this.add.image(650, 400, 'victoria').setInteractive();
        this.victoria.setScale(1.4);

        this.salir = this.add.image(60, 30, 'botonsalir').setInteractive();
        this.salir.setScale(0.7);

        if(this.winner_key == 0){
            //gana grundlegend
            this.text = this.add.image(660,350, 'gana_grundlegend');
            this.text.setScale(0.7);

            this.grundLegend = this.add.image(300,500, 'grundlegend_victory');
            this.grundLegend.setScale(2);

        }else if(this.winner_key == 1){
            //gana ottonai
            this.text = this.add.image(660,350, 'gana_ottonai');
            this.text.setScale(0.7);

            this.ottonai = this.add.image(980,500, 'ottonai_victory');
            this.ottonai.setScale(2);
            this.ottonai.flipX = true;

        }else if(this.winner_key == 3){
            //empate
            this.text = this.add.image(660,320, 'gana_la_amistad');
            this.text.setScale(0.7);

            this.grundLegend = this.add.image(300,500, 'grundlegend_victory');
            this.grundLegend.setScale(2);

            this.ottonai = this.add.image(980,500, 'ottonai_victory');
            this.ottonai.setScale(2);
            this.ottonai.flipX = true;
        }

        this.pausa = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        var that = this;

        this.salir.on('pointerdown', function (pointer) {
            that.sound.play('espada');
            that.scene.start("play_menu_Scene");
        })



    }

    update() {
        /*
        if(this.pausa.isDown){
            
            console.log('enter')
            this.scene.stop("select_Pausa");
            this.scene.wake("game_Scene")
            
        }
        */
        this.pointer = this.input.activePointer;

        //console.log(this.pointer.x, this.pointer.y);
    }
}