const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

let player, obstacles = [], powerUps = [], score = 0, lives = 3, gameSpeed = 5, gameLoop, keys = {};

class Player {
    constructor() {
        this.width = 50;
        this.height = 100;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        if (keys.ArrowLeft && this.x > 0) this.x -= 5;
        if (keys.ArrowRight && this.x < canvas.width - this.width) this.x += 5;
    }
}

class Obstacle {
    constructor() {
        this.width = 50;
        this.height = 100;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += gameSpeed;
        if (this.y > canvas.height) {
            obstacles.splice(obstacles.indexOf(this), 1);
            score += 10;
        }
    }
}

class PowerUp {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += gameSpeed;
        if (this.y > canvas.height) {
            powerUps.splice(powerUps.indexOf(this), 1);
        }
    }
}

function spawnObstacle() {
    if (Math.random() < 0.02) { // 2% chance each frame
        obstacles.push(new Obstacle());
    }
}

function spawnPowerUp() {
    if (Math.random() < 0.01) { // 1% chance each frame
        powerUps.push(new PowerUp());
    }
}

function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();
    player.move();

    obstacles.forEach(obstacle => {
        obstacle.update();
        obstacle.draw();
        if (checkCollision(player, obstacle)) {
            lives--;
            obstacles.splice(obstacles.indexOf(obstacle), 1);
            if (lives <= 0) gameOver();
        }
    });

    powerUps.forEach(powerUp => {
        powerUp.update();
        powerUp.draw();
        if (checkCollision(player, powerUp)) {
            score += 50;
            powerUps.splice(powerUps.indexOf(powerUp), 1);
        }
    });

    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;

    spawnObstacle();
    spawnPowerUp();
}

function gameOver() {
    clearInterval(gameLoop);
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'block';
}

function startGame() {
    player = new Player();
    score = 0;
    lives = 3;
    obstacles = [];
    powerUps = [];
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'none';
    gameLoop = setInterval(update, 1000/60); // 60 FPS
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);
