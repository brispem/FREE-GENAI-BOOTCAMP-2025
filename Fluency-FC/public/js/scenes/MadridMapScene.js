class MadridMapScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.MADRID_MAP });
    }

    preload() {
        this.load.image('map', 'images/map_image.png');
        this.load.image('plane', 'images/plane.png');
    }

    create() {
        // Display the map with proper scaling
        const map = this.add.image(400, 300, 'map');
        const scaleX = this.cameras.main.width / map.width;
        const scaleY = this.cameras.main.height / map.height;
        const scale = Math.min(scaleX, scaleY);
        map.setScale(scale * 0.9);
        map.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Add congratulations text box
        const textBg = this.add.rectangle(400, 80, 750, 80, 0x000000, 0.8);
        const congratsText = this.add.text(400, 80, 
            'CONGRATULATIONS!\nYour penalty success takes you to Madrid for a crucial Semi-Final tie!', {
            fontSize: '20px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center',
            padding: { x: 20, y: 10 },
            lineSpacing: 10
        }).setOrigin(0.5);

        // Fine-tuned coordinates for exact positioning
        const mallorcaX = 580;
        const mallorcaY = 270;
        const madridX = 365; // Moved left to match red dot
        const madridY = 240; // Keeping same Y coordinate

        // Create plane sprite starting at Mallorca
        const plane = this.add.sprite(mallorcaX, mallorcaY, 'plane');
        plane.setScale(1.2);
        plane.setOrigin(0.5, 0.5);

        // Takeoff and flight animation
        this.tweens.add({
            targets: plane,
            scale: 1.4,
            y: mallorcaY - 30,
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: plane,
                    x: madridX,
                    y: madridY,
                    duration: 3000,
                    ease: 'Power1',
                    onUpdate: () => {
                        // Calculate angle for plane rotation
                        const dx = madridX - plane.x;
                        const dy = madridY - plane.y;
                        const angle = Math.atan2(dy, dx);
                        // Add PI to keep plane right-side up
                        plane.setRotation(angle + Math.PI);
                    },
                    onComplete: () => {
                        // Reset rotation when landed
                        plane.setRotation(0);
                        
                        // Landing effect
                        this.tweens.add({
                            targets: plane,
                            scale: { from: 1.4, to: 1.2 },
                            duration: 600,
                            yoyo: true,
                            repeat: -1
                        });

                        const pressSpace = this.add.text(400, 550, 'PRESS SPACE TO CONTINUE', {
                            fontSize: '24px',
                            fontFamily: 'Press Start 2P',
                            color: '#ffffff'
                        }).setOrigin(0.5);

                        this.tweens.add({
                            targets: pressSpace,
                            alpha: 0,
                            duration: 500,
                            ease: 'Power2',
                            yoyo: true,
                            repeat: -1
                        });

                        this.input.keyboard.once('keydown-SPACE', () => {
                            this.scene.start(SceneKeys.WELCOME_MADRID);
                        });
                    }
                });
            }
        });
    }
} 