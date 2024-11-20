

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");

let animationId;
let isPaused = false;
let lives = 3;
let score = 0;
const player = { x: canvas.width / 2 - 25, y: canvas.height - 100, width: 50, height: 50, speed: 5 };
const asteroids = [];
const powerUps = [];
const coins = [];
const keys = {};

// Tornar o canvas responsivo
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 100;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Carregar imagens
const rocketImg = new Image();
rocketImg.src = "./images/rocket.png";

const heartImg = new Image();
heartImg.src = "./images/heart.png";

const asteroidImg = new Image();
asteroidImg.src = "./images/asteroid.png";

const coinGif = new Image();
coinGif.src = "./images/coin.gif";

// Eventos do teclado
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Criar asteroides de tamanhos variados
function createAsteroid() {
  const size = Math.random() * 50 + 30; // Tamanho entre 30 e 80px
  asteroids.push({
    x: Math.random() * canvas.width,
    y: -size,
    width: size,
    height: size,
    speed: Math.random() * 2 + 1,
  });
}

// Criar power-ups
function createPowerUp() {
  powerUps.push({
    x: Math.random() * canvas.width,
    y: -50,
    width: 50,
    height: 50,
    speed: 1,
  });
}

// Criar moedas
function createCoin() {
  coins.push({
    x: Math.random() * canvas.width,
    y: -50,
    width: 70,
    height: 70,
    speed: 2,
  });
}

// Movimentar jogador
function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width)
    player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y + player.height < canvas.height)
    player.y += player.speed;
}

// Atualizar elementos do jogo
function updateAsteroids() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.y += asteroid.speed;

    if (
      player.x < asteroid.x + asteroid.width &&
      player.x + player.width > asteroid.x &&
      player.y < asteroid.y + asteroid.height &&
      player.y + player.height > asteroid.y
    ) {
      lives--;
      asteroids.splice(i, 1);
    } else if (asteroid.y > canvas.height) {
      asteroids.splice(i, 1);
    }
  }
}

function updatePowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    powerUp.y += powerUp.speed;

    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      lives++;
      powerUps.splice(i, 1);
    } else if (powerUp.y > canvas.height) {
      powerUps.splice(i, 1);
    }
  }
}

function updateCoins() {
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];
    coin.y += coin.speed;

    if (
      player.x < coin.x + coin.width &&
      player.x + player.width > coin.x &&
      player.y < coin.y + coin.height &&
      player.y + player.height > coin.y
    ) {
      score += 10;
      coins.splice(i, 1);
    } else if (coin.y > canvas.height) {
      coins.splice(i, 1);
    }
  }
}

// Desenhar elementos
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(rocketImg, player.x, player.y, player.width, player.height);

  for (const asteroid of asteroids) {
    ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  }

  for (const powerUp of powerUps) {
    ctx.drawImage(heartImg, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  }

  for (const coin of coins) {
    ctx.drawImage(coinGif, coin.x, coin.y, coin.width, coin.height);
  }

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Vidas: ${lives}`, 10, 30);
  ctx.fillText(`Pontuação: ${score}`, 10, 60);
}

// Funções do menu
function startGame() {
  menu.style.display = "none";
  animationId = requestAnimationFrame(loop);
}

function pauseGame() {
  isPaused = true;
  cancelAnimationFrame(animationId);
}

function resumeGame() {
  isPaused = false;
  animationId = requestAnimationFrame(loop);
}

function restartGame() {
  lives = 3;
  score = 0;
  asteroids.length = 0;
  powerUps.length = 0;
  coins.length = 0;
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 100;
  startGame();
}

// Loop principal
function loop() {
  if (lives > 0 && !isPaused) {
    movePlayer();
    updateAsteroids();
    updatePowerUps();
    updateCoins();
    draw();
    animationId = requestAnimationFrame(loop);
  } else if (lives <= 0) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Fim de Jogo", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Botões do menu
startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
resumeButton.addEventListener("click", resumeGame);
restartButton.addEventListener("click", restartGame);

// Criar elementos regularmente
setInterval(createAsteroid, 1000);
setInterval(createPowerUp, 10000);
setInterval(createCoin, 3000);
