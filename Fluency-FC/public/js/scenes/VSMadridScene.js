class VSMadridScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.VS_MADRID });
    }

    preload() {
        this.load.image('vs_madrid', 'images/vs_madrid.png');
    }

    create() {
        const vsScreen = this.add.image(400, 300, 'vs_madrid');
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
            console.log('Transitioning to Madrid Penalty Scene');
            this.scene.start(SceneKeys.MADRID_PENALTY);
        });
    }
} 