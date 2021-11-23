export class Play_Menu_Scene extends Phaser.Scene {

    static MenuStatus = {
        OFFLINE: 0,
        ONLINE: 1,
        CONTROLES: 2,
        CONFI: 3,
        PERSONAJES: 4,
        SALIR: 5
    };


    constructor() {
        super({ key: 'play_menu_Scene' });

        this.background;
        this.boton1;
        this.text1;
        this.boton2;
        this.text2;

        this.salir;

        this.controles;
        this.configuracion;
        this.personajes;

        this.pointer;
    }

    // Here we need to load all the graphics
    preload() {
        console.log('Menu Jugar Escena');

        //this.scene.launch("game_Scene");

        this.load.image('fondo_inicio', 'stores/menu/seleccion_menu.jpg');
        //BOTON ROJO
        this.load.image('botonrojo1', 'stores/menu/button/boton_rojo_sinpulsar.png');
        this.load.image('botonrojo2', 'stores/menu/button/boton_rojo.png');
        //BOTON AZUL
        this.load.image('botonazul1', 'stores/menu/button/boton_azul.png');
        this.load.image('botonazul2', 'stores/menu/button/boton_azul_pulsado.png');
        //BOTON SALIR
        this.load.image('botonsalir', 'stores/menu/button/boton_salir.png');
        this.load.image('botonsalir2', 'stores/menu/button/boton_salir_pulsado.png');
        //BOTON CONFIGURACION 
        this.load.image('botonconfiguracion', 'stores/menu/button/boton_configuracion.png');
        this.load.image('botonconfiguracion2', 'stores/menu/button/boton_configuracion_pulsado.png');

        //BOTTON PERSONAJES 
        this.load.image('botonpersonajes', 'stores/menu/button/boton_personajes.png');
        this.load.image('botonpersonajes2', 'stores/menu/button/boton_personajes_pulsado.png');

        //BOTTON CONTROLES
        this.load.image('botoncontroles', 'stores/menu/button/boton_controles.png');
        this.load.image('botoncontroles2', 'stores/menu/button/boton_controles_pulsado.png');
        //BOTTON POWERUPS
        this.load.image('botonpoweups', 'stores/menu/button/boton_powerups.png');
        this.load.image('botonpoweups2', 'stores/menu/button/boton_powerups_luz.png');
        //AUDIO
        this.load.audio('tambor', 'stores/sounds/golpe_tambor.mp3');
        this.load.audio('espada', 'stores/sounds/desenvainar_espada.mp3');

        //this.scene.launch("musica_Scene");
        

    }
    //MOVIMIENTO A--W
    Moveup() { 
        if (this.boton1_luz.alpha == 1) {
            console.log('rojo')
            this.salir_luz.alpha = 1;
            this.boton1_luz.alpha = 0;
            this.menu_boton = 1;
            console.log(this.menu_boton);
        } else if (this.salir_luz.alpha == 1) {
            console.log('salir izquierda')
            this.powerups_luz.alpha = 1;
            this.salir_luz.alpha = 0;
            this.menu_boton = 6;
            console.log(this.menu_boton);
        } else if (this.powerups_luz.alpha == 1) {
            this.powerups_luz.alpha = 0;
            console.log(' s')
            this.personajes_luz.alpha = 1;
            this.menu_boton = 2;
            console.log(this.menu_boton);
            
        } else if (this.personajes_luz.alpha == 1) {
            console.log(' s')
            this.personajes_luz.alpha = 0;
            this.configuracion_luz.alpha = 1;
            this.menu_boton = 4;
            console.log(this.menu_boton);
        } else if (this.configuracion_luz.alpha == 1) {
            console.log(' r')
            this.configuracion_luz.alpha = 0;
            this.controles_luz.alpha = 1;
            this.menu_boton = 4;
            console.log(this.menu_boton);
        } else if (this.controles_luz.alpha == 1) {
            console.log(' j')
            this.boton2_luz.alpha = 1;
            this.controles_luz.alpha = 0;
            this.menu_boton = 0;
            console.log(this.menu_boton);
        } else if (this.boton2_luz.alpha == 1) {
            console.log(' g')
            this.boton2_luz.alpha = 0;
            this.boton1_luz.alpha = 1;
            this.menu_boton = 5;
            console.log(this.menu_boton);
        }
    }
    //MOVIMIENTO S-D
    Movedown() { 
        if (this.boton1_luz.alpha == 1) {
            console.log('aagado2')
            this.boton2_luz.alpha = 1;
            this.boton1_luz.alpha = 0;
            this.menu_boton = 0;
            console.log(this.menu_boton);
        } else if (this.boton2_luz.alpha == 1) {
            console.log(' g2')
            this.boton2_luz.alpha = 0;
            this.controles_luz.alpha = 1;
            this.menu_boton = 4;
            console.log(this.menu_boton);
        } else if (this.controles_luz.alpha == 1) {
            console.log(' j2')
            this.configuracion_luz.alpha = 1;
            this.controles_luz.alpha = 0;
            this.menu_boton = 4;
            console.log(this.menu_boton);
        } else if (this.configuracion_luz.alpha == 1) {
            console.log(' r2')
            this.configuracion_luz.alpha = 0;
            this.personajes_luz.alpha = 1;
            this.menu_boton = 2;
            console.log(this.menu_boton);
        } else if (this.personajes_luz.alpha == 1) {
            console.log(' s2')
            this.personajes_luz.alpha = 0;
            this.powerups_luz.alpha = 1;
            this.menu_boton = 6;
            console.log(this.menu_boton);
        }else if (this.powerups_luz.alpha == 1) {
            this.powerups_luz.alpha = 0;
            console.log(' s')
            this.personajes_luz.alpha = 0;
            this.salir_luz.alpha = 1;
            this.menu_boton = 1;
            console.log(this.menu_boton);        
        } else if (this.salir_luz.alpha == 1) {
            console.log('salir izquierda2')
            this.boton1_luz.alpha = 1;
            this.salir_luz.alpha = 0;
            this.menu_boton = 0;
            console.log(this.menu_boton);
        }


    }
    // Here we need to create all the Modules
    //^^^---Like player, platform, Pwr_Up..
    create() {

        this.scene.launch("musica_Scene");

        var that = this;
        this.input.keyboard.on('keydown', function (event) {
            if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.W && !that.keyW) {
                console.log('W Pressed');
                that.Moveup();
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.A && !that.keyA) {
                console.log('A Pressed');
                that.Moveup();
            }
            else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.D && !that.keyD) {
                that.Movedown();
                console.log('A Pressed');
            }
            else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.S && !that.keyS) {
                that.Movedown();
                console.log('A Pressed');
            }
        });

        this.TeclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.TeclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        //this.TeclaW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.TeclaS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.iniciar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.menu_boton = 0;
        console.log(this);
        this.background = this.add.image(0, 0, 'fondo_inicio');
        this.background.setScale(1.4);
        this.background.setOrigin(0);

        this.boton1 = this.add.image(570, 335, 'botonrojo1').setInteractive();
        this.boton1.setScale(1.5);
        this.boton1.setAngle(30);
        this.boton1_luz = this.add.image(570, 335, 'botonrojo2').setInteractive();
        this.boton1_luz.setScale(1.55);
        this.boton1_luz.alpha = 1;
        this.boton1_luz.setAngle(30);
        //this.text1 = this.add.text(560, 300, 'Jugar Offline', { color: '#000000', fontSize: '28px', fontFamily: 'Gemunu Libre'});

        this.boton2 = this.add.image(750, 430, 'botonazul1').setInteractive();
        this.boton2.setScale(1.54);
        this.boton2.setAngle(30);
        this.boton2_luz = this.add.image(735, 430, 'botonazul2').setInteractive();
        this.boton2_luz.setScale(1.6);
        this.boton2_luz.alpha = 0;
        this.boton2_luz.setAngle(30);
        //this.text2 = this.add.text(460, 270, 'Jugar Online', { color: '#000000', fontSize: '28px', fontFamily: 'Gemunu Libre'});

        this.salir = this.add.image(100, 50, 'botonsalir').setInteractive();
        this.salir.setScale(1);
        this.salir_luz = this.add.image(100, 50, 'botonsalir2').setInteractive();
        this.salir_luz.setScale(1);
        this.salir_luz.alpha = 0;


        this.controles = this.add.image(1150, 150, 'botoncontroles').setInteractive();
        this.controles.setScale(1);
        this.controles_luz = this.add.image(1150, 150, 'botoncontroles2').setInteractive();
        this.controles_luz.setScale(1);
        this.controles_luz.alpha = 0;

        this.configuracion = this.add.image(1150, 270, 'botonconfiguracion').setInteractive();
        this.configuracion.setScale(1);
        this.configuracion_luz = this.add.image(1150, 270, 'botonconfiguracion2').setInteractive();
        this.configuracion_luz.setScale(1);
        this.configuracion_luz.alpha = 0;

        this.personajes = this.add.image(1150, 390, 'botonpersonajes').setInteractive();
        this.personajes.setScale(1);
        this.personajes_luz = this.add.image(1150, 390, 'botonpersonajes2').setInteractive();
        this.personajes_luz.setScale(1);
        this.personajes_luz.alpha = 0;


        this.powerups = this.add.image(1150, 520, 'botonpoweups').setInteractive();
        this.powerups.setScale(1);
        this.powerups_luz = this.add.image(1150, 520, 'botonpoweups2').setInteractive();
        this.powerups_luz.setScale(1);
        this.powerups_luz.alpha = 0;
        //this.salir = this.add.text(50,50,'Salir', { color: '#000000', fontSize: '40px', fontFamily: 'Gemunu Libre'});
        //this.salir.setInteractive();

        var that = this;
        this.boton1_luz.on('pointerdown', function (pointer) {
            console.log('Boton rojo pulsado');
            that.sound.play('tambor');
            that.scene.start("select_menu_Scene");
        });

        this.boton2_luz.on('pointerdown', function (pointer) {
            console.log('Boton azul pulsado');
            that.sound.play('tambor');
            that.scene.start("select_menu_Scene");
        });

        this.salir_luz.on('pointerdown', function (pointer) {
            console.log('Boton salir pulsado');
            that.sound.play('espada');
            that.scene.start("menu_Scene");
        });

        this.controles_luz.on('pointerdown', function (pointer) {
            console.log('Boton salir pulsado');
            that.sound.play('tambor');
            that.scene.start("select_menu_controles");
        });//SELECT_MENU_CONTROLES
        this.configuracion_luz.on('pointerdown', function (pointer) {
            console.log('Boton salir pulsado');
            that.sound.play('tambor');
            that.scene.start("select_menu_controles");
        });
        this.personajes_luz.on('pointerdown', function (pointer) {
            console.log('Boton salir pulsado');
            that.sound.play('tambor');
            that.scene.start("select_menu_personajes");
        });
        this.powerups_luz.on('pointerdown', function (pointer) {
            console.log('Boton salir pulsado');
            that.sound.play('tambor');
            that.scene.start("select_menu_powerups");
        });

    }

    update() {
        var that = this;

        this.boton1.on('pointerover', function (pointer) {
            console.log(that.boton1_luz);
            that.boton1_luz.alpha = 1;
            that.boton2_luz.alpha = 0;
            that.salir_luz.alpha = 0;
            that.configuracion_luz.alpha = 0;
            that.controles_luz.alpha = 0;
            that.personajes_luz.alpha = 0;
            that.powerups_luz.alpha = 0;
        });
        this.boton2.on('pointerover', function (pointer) {
            console.log(that.boton1_luz);
            that.boton1_luz.alpha = 0;
            that.boton2_luz.alpha = 1;
            that.salir_luz.alpha = 0;
            that.configuracion_luz.alpha = 0;
            that.controles_luz.alpha = 0;
            that.personajes_luz.alpha = 0;
            that.powerups_luz.alpha = 0;
        });
        this.salir.on('pointerover', function (pointer) {
            console.log(that.boton1_luz);
            that.boton1_luz.alpha = 0;
            that.boton2_luz.alpha = 0;
            that.salir_luz.alpha = 1;
            that.configuracion_luz.alpha = 0;
            that.controles_luz.alpha = 0;
            that.personajes_luz.alpha = 0;
            that.powerups_luz.alpha = 0;
        });
        this.configuracion.on('pointerover', function (pointer) {
            console.log(that.boton1_luz);
            that.boton1_luz.alpha = 0;
            that.boton2_luz.alpha = 0;
            that.salir_luz.alpha = 0;
            that.configuracion_luz.alpha = 1;
            that.controles_luz.alpha = 0;
            that.personajes_luz.alpha = 0;
            that.powerups_luz.alpha = 0;
        });
        this.controles.on('pointerover', function (pointer) {
            console.log(that.boton1_luz);
            that.boton1_luz.alpha = 0;
            that.boton2_luz.alpha = 0;
            that.salir_luz.alpha = 0;
            that.configuracion_luz.alpha = 0;
            that.controles_luz.alpha = 1;
            that.personajes_luz.alpha = 0;
            that.powerups_luz.alpha = 0;
        });
        this.personajes.on('pointerover', function (pointer) {
            console.log(that.boton1_luz);
            that.boton1_luz.alpha = 0;
            that.boton2_luz.alpha = 0;
            that.salir_luz.alpha = 0;
            that.configuracion_luz.alpha = 0;
            that.controles_luz.alpha = 0;
            that.personajes_luz.alpha = 1;
            that.powerups_luz.alpha = 0;
        });
        this.powerups.on('pointerover', function (pointer) {
            console.log(that.boton1_luz);
            that.boton1_luz.alpha = 0;
            that.boton2_luz.alpha = 0;
            that.salir_luz.alpha = 0;
            that.configuracion_luz.alpha = 0;
            that.controles_luz.alpha = 0;
            that.personajes_luz.alpha = 0;
            that.powerups_luz.alpha = 1;
        });
        if (this.iniciar.isDown) {
            switch (this.menu_boton) {
                case 0: //elecion offline
                    console.log('enter')
                    this.sound.play('tambor');
                    this.scene.start("select_menu_Scene");
                    break;
                case 1: // salir
                    this.sound.play('espada');
                    this.scene.start("menu_Scene");
                    break;
                case 2: //personajes
                    this.sound.play('tambor');
                    this.scene.start("select_menu_personajes");
                    break;
                case 3: //menu configuracion
                    this.sound.play('tambor');
                    this.scene.start("select_menu_controles");
                    break;
                case 4: //controles
                    this.sound.play('tambor');
                    this.scene.start("select_menu_controles");
                    break;
                case 5: //menu online
                    this.sound.play('tambor');
                    this.scene.start("select_menu_Scene");
                    break;
                case 6: //menu powerups
                    this.sound.play('tambor');
                    this.scene.start("select_menu_powerups");
                    break;
            }
        }
        this.pointer = this.input.activePointer;

    }
}