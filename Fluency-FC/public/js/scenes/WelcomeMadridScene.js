class WelcomeMadridScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.WELCOME_MADRID });
        this.currentState = 'info';
    }

    preload() {
        this.load.image('welcome_madrid', 'images/welcome_madrid.png');
    }

    create() {
        const welcomeScreen = this.add.image(400, 300, 'welcome_madrid');
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
            "¡Bienvenido a Madrid! La capital de España.\n\n" +
            "Madrid es famosa por:\n" +
            "- El Museo del Prado (uno de los mejores museos del mundo)\n" +
            "- La Plaza Mayor (el corazón histórico de la ciudad)\n" +
            "- El Parque del Retiro (el pulmón verde de Madrid)\n" +
            "- La mejor vida nocturna de España\n\n" +
            "Y por supuesto, el Real Madrid y el Santiago Bernabéu.\n" +
            "¡Hala Madrid!", {
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
                question: "¿En qué año se fundó el Real Madrid?",
                answers: [
                    { text: "A) 1902", correct: true },
                    { text: "B) 1899", correct: false },
                    { text: "C) 1908", correct: false }
                ]
            },
            {
                question: "¿Cuántas Copas de Europa ha ganado el Real Madrid?",
                answers: [
                    { text: "A) 12", correct: false },
                    { text: "B) 15", correct: true },
                    { text: "C) 13", correct: false }
                ]
            },
            {
                question: "¿Cuál es la capacidad del Santiago Bernabéu?",
                answers: [
                    { text: "A) 85,000", correct: false },
                    { text: "B) 81,044", correct: true },
                    { text: "C) 79,000", correct: false }
                ]
            }
        ];

        if (questionIndex >= questions.length) {
            console.log('All questions answered, transitioning to Madrid Penalty Scene');
            this.scene.start(SceneKeys.VS_MADRID);
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
            
            // Hover effects
            text.on('pointerover', () => {
                text.setColor('#0000ff');
                text.setText('► ' + answer.text);
            });
            
            text.on('pointerout', () => {
                text.setColor('#000000');
                text.setText(answer.text);
            });
            
            // Click handler
            text.on('pointerdown', () => {
                // Show answer result
                text.setColor(answer.correct ? '#00ff00' : '#ff0000');
                
                // Disable all answers
                answerTexts.forEach(t => t.removeInteractive());

                // Wait and show next question
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