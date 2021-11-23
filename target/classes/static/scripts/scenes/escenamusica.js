export class Musica_Scene extends Phaser.Scene {

    constructor() {
        super({ key: 'musica_Scene' });

        this.loaded = false;
        this.musica;

    }
    
    preload() {
        console.log('Musica Escena');

        this.load.audio('main_theme', 'stores/music/main_theme.mp3');
    }

    create() {

        this.loaded = false;
        
        this.musica = this.sound.add('main_theme');
        this.musica.setLoop(true);

        //this.events.on("pause", function () {this.pauseMusic});
    }

    pauseMenuMusic(){
        console.log('musica pausada');
        this.musica.pause();
        //this.loaded = false;
    }

    playMenuMusic(){
        console.log('musica reproducida');
        this.musica.play();
    }

    stopMenuMusic(){
        console.log('musica parada');
        this.musica.stop();
        //this.loaded = false;
    }

    update(){
        
        //console.log('musica');
        
        if(!this.loaded){
            this.loaded = true;
            this.playMenuMusic();
        }
        
    }

}