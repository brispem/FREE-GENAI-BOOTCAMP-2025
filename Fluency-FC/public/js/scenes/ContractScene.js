class ContractScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.CONTRACT });
    }

    create() {
        // Show contract screen with proper scaling
        const contractScreen = this.add.image(400, 300, 'contract_screen');
        
        // Scale image to fit the 800x600 window while maintaining aspect ratio
        const scaleX = 800 / contractScreen.width;
        const scaleY = 600 / contractScreen.height;
        const scale = Math.min(scaleX, scaleY);
        contractScreen.setScale(scale);

        // Add press space text
        const pressSpace = this.add.text(400, 550, 'PRESS SPACE TO CONTINUE', {
            fontSize: '24px',
            fontFamily: 'monospace',
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

        // Handle space key to move to newspaper scene
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(SceneKeys.NEWSPAPER);
        });
    }
} 