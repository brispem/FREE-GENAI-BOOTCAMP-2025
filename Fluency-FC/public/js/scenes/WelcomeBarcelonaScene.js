class WelcomeBarcelonaScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.WELCOME_BARCELONA });
        this.currentState = 'info';
    }

    preload() {
        this.load.image('welcome_barcelona', 'images/welcome_barcelona.png');
    }

    create() {
        const welcomeScreen = this.add.image(400, 300, 'welcome_barcelona');
        const scaleX = this.cameras.main.width / welcomeScreen.width;
        const scaleY = this.cameras.main.height / welcomeScreen.height;
        const scale = Math.min(scaleX, scaleY);
        welcomeScreen.setScale(scale * 0.9);
        welcomeScreen.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

        this.createInfoBox();
    }

    createInfoBox() {
        const boxWidth = 500;
        const boxHeight = 200;  // Increased height for more content
        const boxX = 150;
        const boxY = 380;  // Adjusted Y position to fit more text

        const border = this.add.graphics();
        border.lineStyle(2, 0x000000, 1);
        border.strokeRect(boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4);
        border.strokeRect(boxX, boxY, boxWidth, boxHeight);

        const textBox = this.add.graphics();
        textBox.fillStyle(0xFFFFFF, 0.9);
        textBox.fillRect(boxX, boxY, boxWidth, boxHeight);

        const infoText = this.add.text(400, 440, 
            "¡Bienvenido a Barcelona! Ciudad de arte y fútbol.\n\n" +
            "Barcelona es famosa por:\n" +
            "- La Sagrada Familia (obra maestra de Gaudí)\n" +
            "- El Camp Nou (templo del fútbol)\n" +
            "- Las Ramblas (el paseo más famoso)\n" +
            "- El Barrio Gótico (historia medieval)\n\n" +
            "¡Visca el Barça i visca Catalunya!", {
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

        this.tweens.add({
            targets: pressSpace,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

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
                question: "¿En qué año se fundó el FC Barcelona?",
                answers: [
                    { text: "A) 1899", correct: true },
                    { text: "B) 1902", correct: false },
                    { text: "C) 1895", correct: false }
                ]
            },
            {
                question: "¿Quién diseñó la Sagrada Familia?",
                answers: [
                    { text: "A) Pablo Picasso", correct: false },
                    { text: "B) Antoni Gaudí", correct: true },
                    { text: "C) Salvador Dalí", correct: false }
                ]
            },
            {
                question: "¿Cuál es la capacidad del Camp Nou?",
                answers: [
                    { text: "A) 81,365", correct: false },
                    { text: "B) 99,354", correct: true },
                    { text: "C) 75,876", correct: false }
                ]
            }
        ];

        if (questionIndex >= questions.length) {
            this.scene.start(SceneKeys.VS_BARCELONA);
            return;
        }

        const boxWidth = 500;
        const boxHeight = 120;
        const boxX = 150;
        const boxY = 420;

        const border = this.add.graphics();
        border.lineStyle(2, 0x000000, 1);
        border.strokeRect(boxX - 2, boxY - 2, boxWidth + 4, boxHeight + 4);
        border.strokeRect(boxX, boxY, boxWidth, boxHeight);

        const textBox = this.add.graphics();
        textBox.fillStyle(0xFFFFFF, 0.9);
        textBox.fillRect(boxX, boxY, boxWidth, boxHeight);

        const questionText = this.add.text(400, 440, questions[questionIndex].question, {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);

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