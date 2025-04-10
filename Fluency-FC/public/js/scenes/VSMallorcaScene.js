class VSMallorcaScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.VS_MALLORCA });
    }

    preload() {
        this.load.image('vs_mallorca', 'images/vs_mallorca.png');
    }

    create() {
        // Display VS screen with proper scaling
        const vsScreen = this.add.image(400, 300, 'vs_mallorca');
        
        // Scale image to fit while maintaining aspect ratio
        const scaleX = this.cameras.main.width / vsScreen.width;
        const scaleY = this.cameras.main.height / vsScreen.height;
        const scale = Math.min(scaleX, scaleY);
        vsScreen.setScale(scale * 0.9);
        
        // Center the image
        vsScreen.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Add press space text
        const pressSpace = this.add.text(400, 550, 'PRESS SPACE TO BEGIN MATCH', {
            fontSize: '24px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Make it blink
        this.tweens.add({
            targets: pressSpace,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        // Handle space key to transition to penalty scene
        this.input.keyboard.once('keydown-SPACE', () => {
            console.log('Transitioning from VS scene to:', SceneKeys.MALLORCA_PENALTY);
            this.scene.start(SceneKeys.MALLORCA_PENALTY);
        });
    }
} 