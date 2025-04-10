class VSBarcelonaScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.VS_BARCELONA });
    }

    preload() {
        this.load.image('vs_barcelona', 'images/vs_barcelona.png');
    }

    create() {
        const vsScreen = this.add.image(400, 300, 'vs_barcelona');
        const scaleX = this.cameras.main.width / vsScreen.width;
        const scaleY = this.cameras.main.height / vsScreen.height;
        const scale = Math.min(scaleX, scaleY);
        vsScreen.setScale(scale * 0.9);
        vsScreen.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        const pressSpace = this.add.text(400, 550, 'PRESS SPACE TO BEGIN MATCH', {
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
            this.scene.start(SceneKeys.BARCELONA_PENALTY);
        });
    }
} 