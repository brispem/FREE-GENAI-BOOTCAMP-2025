class NewspaperScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.NEWSPAPER });
    }

    preload() {
        this.load.image('newspaper', 'images/newspaper_announcement.png');
    }

    create() {
        // Display the newspaper with proper scaling
        const newspaper = this.add.image(400, 300, 'newspaper');
        
        // Scale image to fit while maintaining aspect ratio
        const scaleX = this.cameras.main.width / newspaper.width;
        const scaleY = this.cameras.main.height / newspaper.height;
        const scale = Math.min(scaleX, scaleY);
        newspaper.setScale(scale * 0.9);
        
        // Center the image
        newspaper.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Add player name from localStorage
        const playerName = localStorage.getItem('playerName');
        
        // Add player name text in the highlighted underlined space
        const nameText = this.add.text(250, 180, playerName, {  // Moved left to 250, down to 180
            fontSize: '48px',                                    // Increased from 28px to 48px
            fontFamily: 'monospace',
            color: '#000000',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Add blinking "Press Space" text
        const pressSpace = this.add.text(400, 550, 'PRESS SPACE BAR TO BEGIN YOUR JOURNEY', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ffffff'
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
            this.scene.start(SceneKeys.CHANGING_ROOM);
        });
    }
} 