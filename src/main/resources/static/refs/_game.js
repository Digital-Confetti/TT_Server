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
Project C 
Digital Confetti -2021-
    Javier Raja Huertas         (twt: @tuicher, github: tuicher)
    Rodrigo Díaz Pau            
    Miguel Rodríguez de Rojas   (github: Lonflis)
    Héctor Muñoz Gómez          (github: Sh3ry01)
*/ 



    // Creating a Scene
    let gameScene = new Phaser.Scene('Game');

    // Our game's configuration
    let config = {
    type: Phaser.AUTO,  //Phaser will decide how to render our game (WebGL or Canvas)
    width: 1280,         // game width 640
    height: 720,        // game height 360
    scene: gameScene,   // our newly created scene
    // Adding Physics
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 550 },
                debug: false
            }
        }
    };

    // create the game, and pass it the configuration
    let game = new Phaser.Game(config);

    // Player
    var player;
    var horizontalSpeed = 225;
    var verticalSpeed = 10;

    // Platforms
    var platforms;

    // Input Variables
    var keyW;   // ^ Boolean Key Catchers
    var keyS;
    var keyA;
    var keyD;
    var keySPACE;

    
    gameScene.preload = function() {
        // loading the spritesheet on 
        this.load.spritesheet('kennewsprites', 'stores/kennewsprites.png', { frameWidth: 76, frameHeight: 101 });

        this.load.spritesheet('dude', 'stores/dude.png',{ frameWidth: 32, frameHeight: 48 });

        this.load.image('ground' , 'stores/platform.png');
           
        //this.load.spritesheet('kennewsprites', 'src/sprites/kennewsprites.png', 76, 101, 63);
    }
    
    // Function thats add all the sprites to the gameObjects
    gameScene.createGameObjects = function(){
        // Adding Sprite to the player
        player = this.physics.add.sprite(400, 250, 'dude');
            // Setting bounce
            player.setBounce(0.1);
            // Making player collideable by WorldBounds
            player.setCollideWorldBounds(true);
            // Displacing the hitbox
            player.body.setOffset(0, 0);
            // Setting Size of the collider box
            player.body.setSize(32, 48, false);
            

        // Creating Platforms
        platforms = this.physics.add.staticGroup();
        platforms.create(700, 700, 'ground').setScale(4,2).refreshBody();
        platforms.create(600, 375, 'ground').setScale(0.5,1).refreshBody();
        platforms.create(50, 250, 'ground');
        platforms.create(1100, 220, 'ground');
        platforms.create(1180, 580, 'ground').setScale(0.25,1).refreshBody();
        platforms.create(980, 480, 'ground').setScale(0.25,1).refreshBody();
        platforms.create(170, 500,'ground');

        // Add collider
        this.physics.add.collider(player, platforms);
    }

    // Fuctiong thats create the animations
    gameScene.createAnimations = function(){

        // Iddle
        this.anims.create({
            key: 'idle',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        // Right
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Left
        this.anims.create({
            key: 'left',
            frameRate: 8
        });
    }

    gameScene.create = function() {

        // Adding sprites
        this.createGameObjects();

        // Creating animations
        this.createAnimations();

        // Declarating input methods
        this.inputDeclaration();

    }

    gameScene.plyMove =  function()
    {
        // Horizontal movement
        if (keyD && !keyA) {

            player.body.velocity.x = horizontalSpeed;
            player.anims.play('right', true);

            if(player.flipX)
            {
                player.flipX = false;
            }

        } else if (keyA && !keyD) {

            player.body.velocity.x = -1 * horizontalSpeed;
            player.anims.play('right', true);

            if(!player.flipX)
            {
                player.flipX = true;
            }

        } else {

            player.body.velocity.x = 0;
            player.anims.play('idle', true);
        }

        // Vertical movement
            // Jump
        if (keySPACE && player.body.touching.down)
        {
            console.log('Salto');
            player.setVelocityY(-430);
        }

        if (player.body.touching.none)
        {
            console.log('AA');
        }

    }  

    gameScene.update = function(){

        this.plyMove();
    }
    gameScene.inputDeclaration = function()
    {
        // Input event that checks when a key goes down
        this.input.keyboard.on('keydown', function (event) {

            if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.W && !keyW)
            {
                keyW = true;
                console.log('W Pressed');
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.A && !keyA)
            {
                keyA = true;
                console.log('A Pressed');
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.S && !keyS)
            {
                keyS = true;
                console.log('S Pressed');
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.D && !keyD)
            {
                keyD = true;
                console.log('D Pressed');
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.SPACE)
            {
                keySPACE = true;
                console.log('SPACE Pressed');
            }
    
        });

        // Input event that checks when a key goes up
        this.input.keyboard.on('keyup', function (event) {

            if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.W && keyW)
            {
                keyW = false;
                console.log('W Depressed');
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.A && keyA)
            {
                keyA = false;
                console.log('A Depressed');
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.S && keyS)
            {
                keyS = false;
                console.log('S Depressed');
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.D && keyD)
            {
                keyD = false;
                console.log('D Depressed');
            } else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.SPACE)
            {
                keySPACE = false;
                console.log('SPACE Depressed');
            }

        });
        

    }
