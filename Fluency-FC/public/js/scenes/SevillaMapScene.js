class SevillaMapScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.SEVILLA_MAP });
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

        // Add pixel-style title text with black background
        const titleBg = this.add.rectangle(400, 50, 600, 40, 0x000000);
        
        const titleText = this.add.text(400, 50, 'NEXT DESTINATION: SEVILLA', {
            fontSize: '32px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Create plane sprite - starting from northern Spain
        const startX = 400;    // Center of northern Spain
        const startY = 100;    // Top portion of Spain
        const plane = this.add.sprite(startX, startY, 'plane');
        plane.setScale(1.2);
        plane.setOrigin(0.5, 0.5);
        
        // Adjusted Sevilla coordinates remain the same
        const sevillaX = 220;
        const sevillaY = 400;

        // Create animation timeline
        this.tweens.add({
            targets: plane,
            x: sevillaX,
            y: sevillaY,
            duration: 3000,
            ease: 'Power1',
            onUpdate: () => {
                // Calculate angle for plane rotation
                const angle = Math.atan2(sevillaY - plane.y, sevillaX - plane.x);
                plane.setRotation(angle);
            },
            onComplete: () => {
                // Create pulsing effect when reaching Sevilla
                this.tweens.add({
                    targets: plane,
                    scale: { from: 1.2, to: 1.4 },
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

                // Enable space key
                this.input.keyboard.once('keydown-SPACE', () => {
                    this.scene.start(SceneKeys.WELCOME_SEVILLA);
                });
            }
        });
    }
} 