class BarcelonaMapScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.BARCELONA_MAP });
    }

    preload() {
        this.load.image('map', 'images/map_image.png');
        this.load.image('plane', 'images/plane.png');
    }

    create() {
        const map = this.add.image(400, 300, 'map');
        const scaleX = this.cameras.main.width / map.width;
        const scaleY = this.cameras.main.height / map.height;
        const scale = Math.min(scaleX, scaleY);
        map.setScale(scale * 0.9);
        map.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Add congratulations text box
        const textBg = this.add.rectangle(400, 80, 750, 80, 0x000000, 0.8);
        const congratsText = this.add.text(400, 80, 
            '¡INCREÍBLE!\nThe Camp Nou awaits as you face Barcelona in the Grand Final!', {
            fontSize: '20px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center',
            padding: { x: 20, y: 10 },
            lineSpacing: 10
        }).setOrigin(0.5);

        const madridX = 390;
        const madridY = 240;
        const barcelonaX = 520;
        const barcelonaY = 220;

        const plane = this.add.sprite(madridX, madridY, 'plane');
        plane.setScale(1.2);

        this.tweens.add({
            targets: plane,
            x: barcelonaX,
            y: barcelonaY,
            duration: 3000,
            ease: 'Power1',
            onUpdate: () => {
                const angle = Math.atan2(barcelonaY - plane.y, barcelonaX - plane.x);
                plane.setRotation(angle);
            },
            onComplete: () => {
                this.tweens.add({
                    targets: plane,
                    scale: { from: 1.2, to: 1.4 },
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
                    this.scene.start(SceneKeys.WELCOME_BARCELONA);
                });
            }
        });
    }
} 