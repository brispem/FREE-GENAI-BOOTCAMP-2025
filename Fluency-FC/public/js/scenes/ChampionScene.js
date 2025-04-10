class ChampionScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.CHAMPION });
    }

    preload() {
        this.load.image('champion', 'images/fluency_champion.png');
    }

    create() {
        const championScreen = this.add.image(400, 300, 'champion');
        const scaleX = this.cameras.main.width / championScreen.width;
        const scaleY = this.cameras.main.height / championScreen.height;
        const scale = Math.min(scaleX, scaleY);
        championScreen.setScale(scale * 0.9);
        championScreen.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Create translucent text box with adjusted width and height
        const boxWidth = 400;
        const boxHeight = 100;
        const boxX = 200;
        const boxY = 380;

        const textBox = this.add.graphics();
        textBox.fillStyle(0x000000, 0.8);
        textBox.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Add border to text box
        const border = this.add.graphics();
        border.lineStyle(2, 0xFFFFFF, 1);
        border.strokeRect(boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4);
        border.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Move congratulations text down to center in box
        const congratsText = this.add.text(400, 425, // Y position adjusted from 410 to 425
            "¡Felicidades, Campeón!\nFrom Sevilla to Barcelona, you've\nmastered Spanish while conquering\nSpain's greatest stadiums!", {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Copyright text at bottom
        const copyrightText = this.add.text(400, 550, '© FREE GENAI BOOTCAMP 2025', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // End game prompt
        const endText = this.add.text(400, 580, 'PRESS SPACE TO END GAME', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Make end text blink
        this.tweens.add({
            targets: endText,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });

        // Handle space key to end game
        this.input.keyboard.once('keydown-SPACE', () => {
            window.location.href = "about:blank";
            window.close();
        });
    }
} 