class MallorcaMapScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.MALLORCA_MAP });
    }

    preload() {
        this.load.image('map', 'images/map_image.png');
        this.load.image('plane', 'images/plane.png');
    }

    create() {
        // Display the map with proper scaling
        const map = this.add.image(400, 300, 'map');
        
        // Scale map to fit while maintaining aspect ratio
        const scaleX = this.cameras.main.width / map.width;
        const scaleY = this.cameras.main.height / map.height;
        const scale = Math.min(scaleX, scaleY);
        map.setScale(scale * 0.9);
        
        // Center the map
        map.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Add congratulations text box at the top
        const textBg = this.add.rectangle(400, 80, 750, 80, 0x000000, 0.8);
        
        const congratsText = this.add.text(400, 80, 
            'CONGRATULATIONS!\nYour penalty success takes you to Mallorca in the next round!', {
            fontSize: '20px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center',
            padding: { x: 20, y: 10 },
            lineSpacing: 10
        }).setOrigin(0.5);

        // Coordinates for Sevilla and Mallorca on the map
        const sevillaX = 220;
        const sevillaY = 400;
        const mallorcaX = 580; // Adjusted slightly left from 600
        const mallorcaY = 270; // Adjusted slightly down from 250

        // Create plane sprite starting at Sevilla
        const plane = this.add.sprite(sevillaX, sevillaY, 'plane');
        plane.setScale(1.2);
        plane.setOrigin(0.5, 0.5);

        // Create takeoff effect
        this.tweens.add({
            targets: plane,
            scale: 1.4,
            y: sevillaY - 30,
            duration: 1000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                // Flight to Mallorca
                this.tweens.add({
                    targets: plane,
                    x: mallorcaX,
                    y: mallorcaY,
                    duration: 3000,
                    ease: 'Power1',
                    onUpdate: () => {
                        // Calculate angle for plane rotation
                        const angle = Phaser.Math.Angle.Between(
                            plane.x, plane.y,
                            mallorcaX, mallorcaY
                        );
                        // Rotate plane to face direction of travel
                        plane.setRotation(angle);
                    },
                    onComplete: () => {
                        // Landing effect
                        this.tweens.add({
                            targets: plane,
                            scale: { from: 1.4, to: 1.2 },
                            duration: 600,
                            yoyo: true,
                            repeat: -1
                        });

                        // Show press space text
                        const pressSpace = this.add.text(400, 550, 'PRESS SPACE TO CONTINUE', {
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

                        // Enable space key to proceed to Mallorca scenes
                        this.input.keyboard.once('keydown-SPACE', () => {
                            this.scene.start(SceneKeys.WELCOME_MALLORCA);
                        });
                    }
                });
            }
        });
    }
} 