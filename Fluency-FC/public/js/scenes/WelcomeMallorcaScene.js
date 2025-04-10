class WelcomeMallorcaScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.WELCOME_MALLORCA });
        this.currentState = 'info';
    }

    preload() {
        this.load.image('welcome_mallorca', 'images/welcome_mallorca.png');
    }

    create() {
        // Display welcome screen with proper scaling
        const welcomeScreen = this.add.image(400, 300, 'welcome_mallorca');
        const scaleX = this.cameras.main.width / welcomeScreen.width;
        const scaleY = this.cameras.main.height / welcomeScreen.height;
        const scale = Math.min(scaleX, scaleY);
        welcomeScreen.setScale(scale * 0.9);
        welcomeScreen.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        // Create retro-style info box
        this.createInfoBox();
    }

    createInfoBox() {
        const boxWidth = 500;
        const boxHeight = 200;  // Increased height for more content
        const boxX = 150;
        const boxY = 380;  // Adjusted Y position to fit more text

        // Create pixelated border effect
        const border = this.add.graphics();
        border.lineStyle(2, 0x000000, 1);
        border.strokeRect(boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4);
        border.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // White background with slight transparency
        const textBox = this.add.graphics();
        textBox.fillStyle(0xFFFFFF, 0.9);
        textBox.fillRect(boxX, boxY, boxWidth, boxHeight);

        const infoText = this.add.text(400, 440, 
            "¡Bienvenido a Mallorca! La perla del Mediterráneo.\n\n" +
            "Esta isla mágica ofrece:\n" +
            "- Calas cristalinas (playas paradisíacas)\n" +
            "- La Catedral de Palma (La Seu)\n" +
            "- La Sierra de Tramuntana (montañas UNESCO)\n" +
            "- Pueblos encantadores como Valldemossa\n\n" +
            "¡Disfruta del sol y la sobrasada!", {
            fontSize: '14px',
            fontFamily: 'Press Start 2P',
            color: '#000000',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        const pressSpace = this.add.text(400, 540, '▼ PRESS SPACE ▼', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#000000'
        }).setOrigin(0.5);

        // Blink effect for press space
        this.tweens.add({
            targets: pressSpace,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Handle space key to show questions
        this.input.keyboard.once('keydown-SPACE', () => {
            textBox.destroy();
            border.destroy();
            infoText.destroy();
            pressSpace.destroy();
            this.showNextQuestion(0);
        });
    }

    showNextQuestion(questionIndex) {
        const questions = [
            {
                question: "¿Cuándo se inauguró el estadio Son Moix?",
                answers: [
                    { text: "A) 1999", correct: true },
                    { text: "B) 1995", correct: false },
                    { text: "C) 2003", correct: false }
                ]
            },
            {
                question: "¿Qué apodo tiene el RCD Mallorca?",
                answers: [
                    { text: "A) Los Piratas", correct: false },
                    { text: "B) Los Bermellones", correct: true },
                    { text: "C) Los Insulares", correct: false }
                ]
            },
            {
                question: "¿En qué año se construyó la Catedral de Palma?",
                answers: [
                    { text: "A) 1601", correct: true },
                    { text: "B) 1587", correct: false },
                    { text: "C) 1623", correct: false }
                ]
            }
        ];

        if (questionIndex >= questions.length) {
            this.scene.start(SceneKeys.VS_MALLORCA);
            return;
        }

        // Create retro-style question box
        const boxWidth = 500;
        const boxHeight = 120;
        const boxX = 150;
        const boxY = 420;

        // Create pixelated border effect
        const border = this.add.graphics();
        border.lineStyle(2, 0x000000, 1);
        border.strokeRect(boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4);
        border.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // White background
        const textBox = this.add.graphics();
        textBox.fillStyle(0xFFFFFF, 0.9);
        textBox.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Question text
        const questionText = this.add.text(400, 440, questions[questionIndex].question, {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

        // Answer options
        const answerTexts = questions[questionIndex].answers.map((answer, index) => {
            const y = 470 + (index * 20);
            const text = this.add.text(400, y, answer.text, {
                fontSize: '12px',
                fontFamily: 'Press Start 2P',
                color: '#000000',
                align: 'center'
            }).setOrigin(0.5);

            text.setInteractive({ useHandCursor: true });
            text.on('pointerover', () => {
                text.setColor('#0000ff');
                text.setText('► ' + answer.text);
            });
            text.on('pointerout', () => {
                text.setColor('#000000');
                text.setText(answer.text);
            });
            text.on('pointerdown', () => {
                text.setColor(answer.correct ? '#00ff00' : '#ff0000');
                answerTexts.forEach(t => t.removeInteractive());

                this.time.delayedCall(1500, () => {
                    textBox.destroy();
                    border.destroy();
                    questionText.destroy();
                    answerTexts.forEach(t => t.destroy());
                    this.showNextQuestion(questionIndex + 1);
                });
            });

            return text;
        });
    }
} 