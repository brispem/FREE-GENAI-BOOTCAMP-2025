class ChangingRoomScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.CHANGING_ROOM });
    }

    preload() {
        this.load.image('changing_room', 'images/changing_room.png');
    }

    create() {
        // Display the changing room with proper scaling
        const changingRoom = this.add.image(400, 300, 'changing_room');
        
        // Scale image to fit while maintaining aspect ratio
        const scaleX = this.cameras.main.width / changingRoom.width;
        const scaleY = this.cameras.main.height / changingRoom.height;
        const scale = Math.min(scaleX, scaleY);
        changingRoom.setScale(scale * 0.9);
        
        // Center the image
        changingRoom.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Get player name
        const playerName = localStorage.getItem('playerName');

        // Create semi-transparent gray box at bottom (contained within image)
        const textBox = this.add.graphics();
        textBox.fillStyle(0xCCCCCC, 0.7);  // Light gray with 70% opacity
        textBox.fillRect(200, 450, 400, 100);  // Reduced width from 600 to 400

        // Add thin black border lines at top and bottom of the box
        const border = this.add.graphics();
        border.lineStyle(2, 0x000000, 0.8);
        border.beginPath();
        border.moveTo(200, 450);  // Adjusted x from 100 to 200
        border.lineTo(600, 450);  // Adjusted x from 700 to 600
        border.moveTo(200, 550);  // Adjusted x from 100 to 200
        border.lineTo(600, 550);  // Adjusted x from 700 to 600
        border.strokePath();

        // Add welcome text - contained within the box width
        const welcomeText = this.add.text(400, 470, `Welcome to the team, ${playerName}!`, {
            fontSize: '16px',  // Reduced from 20px
            fontFamily: 'Press Start 2P',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 360 }  // Reduced from 560
        }).setOrigin(0.5);

        // Add mission text - contained and properly wrapped
        const missionText = this.add.text(400, 500, 
            "Your first challenge awaits in Sevilla. Master Spanish phrases to boost your chances in the upcoming penalty shootout!", {
            fontSize: '12px',  // Reduced from 14px
            fontFamily: 'Press Start 2P',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 360 }  // Reduced from 560
        }).setOrigin(0.5);

        // Add blinking "Press Space" text at bottom of box
        const pressSpace = this.add.text(400, 535, '▼ PRESS SPACE TO HEAD TO SEVILLA ▼', {
            fontSize: '10px',  // Reduced from 12px
            fontFamily: 'Press Start 2P',
            color: '#000000'
        }).setOrigin(0.5);

        // Create blinking effect
        this.tweens.add({
            targets: pressSpace,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        // Handle space key press to advance to next scene
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SceneKeys.SEVILLA_MAP);
        });
    }
} 