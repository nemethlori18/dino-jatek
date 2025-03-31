const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const shootButton = document.getElementById("shootButton");

canvas.width = 300;
canvas.height = 400;

let spaceship = { x: 150, y: 350, width: 30, height: 30, speed: 5 };
let obstacles = [];
let powerups = [];
let bullets = [];
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
highscoreElement.innerText = highscore;

function drawSpaceship() {
    ctx.fillStyle = "blue";
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawObstacles() {
    ctx.fillStyle = "black";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

function drawPowerups() {
    ctx.fillStyle = "yellow";
    powerups.forEach(powerup => {
        ctx.fillRect(powerup.x, powerup.y, powerup.size, powerup.size);
    });
}

function drawBullets() {
    ctx.fillStyle = "red";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawObstacles();
    drawPowerups();
    drawBullets();

    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.innerText = score;
        }
        if (checkCollision(spaceship, obstacle)) {
            resetGame();
        }
    });

    powerups.forEach((powerup, index) => {
        powerup.y += powerup.speed;
        if (powerup.y > canvas.height) {
            powerups.splice(index, 1);
        }
        if (checkCollision(spaceship, powerup)) {
            powerups.splice(index, 1);
            spaceship.speed += 2;
            setTimeout(() => spaceship.speed -= 2, 5000);
        }
    });

    bullets.forEach((bullet, bIndex) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(bIndex, 1);

        obstacles.forEach((obstacle, oIndex) => {
            if (checkCollision(bullet, obstacle)) {
                obstacles.splice(oIndex, 1);
                bullets.splice(bIndex, 1);
                score += 5;
                scoreElement.innerText = score;
            }
        });
    });

    requestAnimationFrame(updateGame);
}

function checkCollision(a, b) {
    return (
        a.x < b.x + b.size &&
        a.x + a.width > b.x &&
        a.y < b.y + b.size &&
        a.y + a.height > b.y
    );
}

function spawnObstacle() {
    let size = 30;
    obstacles.push({ x: Math.random() * (canvas.width - size), y: 0, size, speed: Math.random() * 2 + 1 });
}

function spawnPowerup() {
    let size = 20;
    powerups.push({ x: Math.random() * (canvas.width - size), y: 0, size, speed: 1 });
}

function shootBullet() {
    bullets.push({ x: spaceship.x + spaceship.width / 2 - 2, y: spaceship.y, width: 4, height: 10, speed: 5 });
}

function resetGame() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        highscoreElement.innerText = highscore;
    }
    score = 0;
    scoreElement.innerText = score;
    obstacles = [];
    powerups = [];
    bullets = [];
    spaceship.x = 150;
    spaceship.y = 350;
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && spaceship.x > 0) spaceship.x -= spaceship.speed;
    if (event.key === "ArrowRight" && spaceship.x + spaceship.width < canvas.width) spaceship.x += spaceship.speed;
});

shootButton.addEventListener("click", shootBullet);
setInterval(spawnObstacle, 2000);
setInterval(spawnPowerup, 5000);
updateGame();