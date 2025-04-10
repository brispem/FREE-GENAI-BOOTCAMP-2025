class WelcomeSevillaScene extends Phaser.Scene {
    constructor() {
        super({ key: SceneKeys.WELCOME_SEVILLA });
        this.currentState = 'info'; // Track whether showing info or questions
    }

    preload() {
        this.load.image('welcome_sevilla', 'images/welcome_sevilla.png');
    }

    create() {
        // Display welcome screen with proper scaling
        const welcomeScreen = this.add.image(400, 300, 'welcome_sevilla');
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
            "¡Bienvenido a Sevilla! La joya de Andalucía.\n\n" +
            "Sevilla es conocida por:\n" +
            "- La Giralda (la torre más famosa de España)\n" +
            "- El Alcázar Real (un palacio precioso)\n" +
            "- La Plaza de España (obra maestra arquitectónica)\n" +
            "- El barrio de Santa Cruz (calles estrechas y románticas)\n\n" +
            "Aquí nació el flamenco y las tapas.\n" +
            "¡Vamos Sevilla!", {
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
                question: "¿Qué altura tiene la Giralda?",
                answers: [
                    { text: "A) 98 metros", correct: true },
                    { text: "B) 85 metros", correct: false },
                    { text: "C) 104 metros", correct: false }
                ]
            },
            {
                question: "¿De qué color es la camiseta del Sevilla FC?",
                answers: [
                    { text: "A) Rojo y negro", correct: false },
                    { text: "B) Blanco", correct: true },
                    { text: "C) Azul y blanco", correct: false }
                ]
            },
            {
                question: "¿Cuál es la capacidad del Estadio Ramón Sánchez-Pizjuán?",
                answers: [
                    { text: "A) 65,000", correct: false },
                    { text: "B) 55,000", correct: false },
                    { text: "C) 43,883", correct: true }
                ]
            }
        ];

        if (questionIndex >= questions.length) {
            this.scene.start(SceneKeys.VS_SEVILLA);
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
                // Add cursor indicator
                text.setText('► ' + answer.text);
            });
            text.on('pointerout', () => {
                text.setColor('#000000');
                text.setText(answer.text);
            });
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