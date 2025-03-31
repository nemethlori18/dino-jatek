const game = document.getElementById("game");
const spaceship = document.getElementById("spaceship");
const joystick = document.getElementById("joystick");
const shootButton = document.getElementById("shoot-button");
const restartButton = document.getElementById("restart-button");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");

let spaceshipX = game.clientWidth / 2 - 15;
let spaceshipY = game.clientHeight - 40;
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
highscoreDisplay.textContent = highscore;

let obstacles = [];
let bullets = [];
let powerups = [];

function updateSpaceshipPosition() {
    spaceship.style.left = `${spaceshipX}px`;
    spaceship.style.top = `${spaceshipY}px`;
}

joystick.addEventListener("touchmove", (event) => {
    let touch = event.touches[0];
    let rect = game.getBoundingClientRect();
    
    spaceshipX = Math.max(0, Math.min(rect.width - 30, touch.clientX - rect.left - 15));
    spaceshipY = Math.max(0, Math.min(rect.height - 30, touch.clientY - rect.top - 15));

    updateSpaceshipPosition();
    event.preventDefault();
});

function spawnObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.textContent = "☄️";
    obstacle.style.left = `${Math.random() * (game.clientWidth - 30)}px`;
    obstacle.style.top = "0px";

    let speed = Math.random() * 3 + 2;
    game.appendChild(obstacle);
    obstacles.push({ element: obstacle, speed: speed });
}

function spawnPowerup() {
    const powerup = document.createElement("div");
    powerup.classList.add("powerup");
    powerup.textContent = "🔅";
    powerup.style.left = `${Math.random() * (game.clientWidth - 30)}px`;
    powerup.style.top = "0px";

    game.appendChild(powerup);
    powerups.push({ element: powerup });
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let newY = parseInt(obstacle.element.style.top) + obstacle.speed;
        obstacle.element.style.top = `${newY}px`;

        if (newY > game.clientHeight) {
            obstacle.element.remove();
            obstacles.splice(index, 1);
        }

        let rect1 = spaceship.getBoundingClientRect();
        let rect2 = obstacle.element.getBoundingClientRect();
        if (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        ) {
            restartGame();
        }
    });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        let newY = parseInt(bullet.element.style.top) - 5;
        bullet.element.style.top = `${newY}px`;

        if (newY < 0) {
            bullet.element.remove();
            bullets.splice(index, 1);
        }

        obstacles.forEach((obstacle, obsIndex) => {
            let rect1 = bullet.element.getBoundingClientRect();
            let rect2 = obstacle.element.getBoundingClientRect();

            if (
                rect1.left < rect2.right &&
                rect1.right > rect2.left &&
                rect1.top < rect2.bottom &&
                rect1.bottom > rect2.top
            ) {
                bullet.element.remove();
                obstacle.element.remove();
                bullets.splice(index, 1);
                obstacles.splice(obsIndex, 1);
                score += 10;
                scoreDisplay.textContent = score;
                if (score > highscore) {
                    highscore = score;
                    localStorage.setItem("highscore", highscore);
                    highscoreDisplay.textContent = highscore;
                }
            }
        });
    });
}

function shootBullet() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = `${spaceshipX + 10}px`;
    bullet.style.top = `${spaceshipY}px`;

    game.appendChild(bullet);
    bullets.push({ element: bullet });
}

shootButton.addEventListener("click", shootBullet);

function restartGame() {
    obstacles.forEach((obs) => obs.element.remove());
    bullets.forEach((bul) => bul.element.remove());
    powerups.forEach((pu) => pu.element.remove());

    obstacles = [];
    bullets = [];
    powerups = [];
    score = 0;
    scoreDisplay.textContent = score;
}

restartButton.addEventListener("click", restartGame);

setInterval(spawnObstacle, 2000);
setInterval(spawnPowerup, 5000);
setInterval(() => {
    moveObstacles();
    moveBullets();
}, 30);