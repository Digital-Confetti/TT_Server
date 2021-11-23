/*
 ,gggggggggggg,                                                      
dP"""88""""""Y8b,                            I8                ,dPYb,
Yb,  88       `8b,                           I8                IP'`Yb
 `"  88        `8b  gg                gg  88888888             I8  8I
     88         Y8  ""                ""     I8                I8  8'
     88         d8  gg     ,gggg,gg   gg     I8      ,gggg,gg  I8 dP 
     88        ,8P  88    dP"  "Y8I   88     I8     dP"  "Y8I  I8dP  
     88       ,8P'  88   i8'    ,8I   88    ,I8,   i8'    ,8I  I8P   
     88______,dP' _,88,_,d8,   ,d8I _,88,_ ,d88b, ,d8,   ,d8b,,d8b,_ 
    888888888P"   8P""Y8P"Y8888P"8888P""Y888P""Y88P"Y8888P"`Y88P'"Y88
______________________________ ,d8I' ________________________________________________________________________                             
____________________________ ,dP'8I ______________________________________ ad88 __________________________ 88                                   
___________________________ ,8"  8I ______________________________________ d8" _____________ ,d ____ ,d __ ""                                  
                            I8   8I                                        88                88      88                                         
                            `8, ,8I     ,adPPYba,  ,adPPYba,  8b,dPPYba, MM88MMM ,adPPYba, MM88MMM MM88MMM 88                                   
                             `Y8P"     a8"     "" a8"     "8a 88P'   `"8a  88   a8P_____88   88      88    88     
                                       8b         8b       d8 88       88  88   8PP"""""""   88      88    88  
                                       "8a,   ,aa "8a,   ,a8" 88       88  88   "8b,   ,aa   88,     88,   88  
                                        `"Ybbd8"'  `"YbbdP"'  88       88  88    `"Ybbd8"'   "Y888   "Y888 88                                                                                                                              
*/
/*
Travellers Tournament
    Digital Confetti -2021-
        Javier Raja Huertas             (github: tuicher)
        Rodrigo Díaz Pau            
        Miguel Rodríguez de Rojas       (github: Lonflis)
        Héctor Muñoz Gómez              (github: Sh3ry01)
*/


import { Game_Scene } from './scripts/scenes/game.js';
import { Menu_Scene } from './scripts/scenes/menu.js';
import { Play_Menu_Scene } from './scripts/scenes/menujugar.js';
import { Play_Select_Scene } from './scripts/scenes/menuseleccion.js';
import { Controles_Scene } from './scripts/scenes/controles.js';
import { Personajes_Scene } from './scripts/scenes/personajes.js';
import { Musica_Scene } from './scripts/scenes/escenamusica.js';
import { Pausa_Scene } from './scripts/scenes/pausa.js';
import { Poweups_Scene } from './scripts/scenes/powerups.js';
import { Victoria_Scene } from './scripts/scenes/victoria.js';


const config = {
    type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
    width: 1280,         // game width 640
    height: 720,        // game height 360
    pixelArt: true,

    // Adding Physics
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 550 },
            debug: false,

                checkCollision: {
                up: true,
                down: false,
                left: true,
                right: true
            }
        }
    },
    audio: {
        disableWebAudio: true
    },

        scene: [Menu_Scene, Musica_Scene, Play_Menu_Scene, Play_Select_Scene, Game_Scene,Controles_Scene,Personajes_Scene,Pausa_Scene,Poweups_Scene,Victoria_Scene]

};

var game = new Phaser.Game(config);
