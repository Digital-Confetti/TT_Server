export class Menu_Scene extends Phaser.Scene {

    constructor() {
        super({ key: 'menu_Scene' });

        this.background;
        this.text;
        this.pointer;
        this.iniciar;
    }
    

    // Here we need to load all the graphics
    preload() {
        console.log('Menu Escena');

        //this.scene.launch("game_Scene");

        this.load.image('fondo', 'stores/menu/pantalla_de_inicio.jpg');
        this.load.audio('tambor', 'stores/sounds/golpe_tambor.mp3');
    }

    // Here we need to create all the Modules
    //^^^---Like player, platform, Pwr_Up..
    create() {

        this.background = this.add.image(0, 0, 'fondo');
        this.background.setScale(1.4);
        this.background.setOrigin(0);

        //this.text = this.add.text(270, 360, 'Pulsa en cualquier lugar para continuar', { color: '#000000', fontSize: '50px', fontFamily: 'Gemunu Libre'});

        var that = this;
        this.input.on('pointerdown', function(pointer){
            console.log('Menu a Game');
            that.sound.play('tambor');
            that.scene.start("play_menu_Scene");
        });
        this.iniciar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    }

    update() {
        if(this.iniciar.isDown){
            console.log('enter')
            this.sound.play('tambor');
            this.scene.start('play_menu_Scene');
        }
        ///ig(iniciar.isDown)
        //console.log(this.pointer.x, this.pointer.y);
    }
}