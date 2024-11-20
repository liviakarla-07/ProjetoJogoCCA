

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");

let animationId;
let isGameRunning = false;
let isPaused = false;
let lives = 3;
let score = 0;
let ammoChance = 0.3;
let ammo = 3;
let canShoot = true;
let asteroidesDestruidos = 0;
let tiros = 0;
const player = { x: canvas.width / 2 - 25, y: canvas.height - 100, width: 50, height: 50, speed: 5 };
const asteroids = [];
const projectiles = [];
const vidas = [];
const ammos = [];
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

const ammoImg = new Image();
ammoImg.src = "./images/ammo.png";

// Eventos do teclado
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Tecla "P" para pausar o jogo
  if (e.key === "p" || e.key === "P") {
    if (!isPaused) {
      menu.style.display = "flex"; // Mostra o menu (ou "flex" dependendo do layout)
      isPaused = true;
    }
    
  }
});

window.addEventListener("keyup", (e) => (keys[e.key] = false));

//Definir precisão
function precisao(){
  if (tiros === 0){
    return 0
  }else{
    return Math.floor((asteroidesDestruidos/tiros)*100)
  }
}

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

//Escolher entre vida e munição
function AmmoOrVida(){
  if(Math.random() < ammoChance){
    createAmmo();
  }else{
    createVida();
  }
}

// Criar vida
function createVida() {
  vidas.push({
    x: Math.random() * canvas.width,
    y: -50,
    width: 30,
    height: 30,
    speed: 1,
  });
}

// Criar munição
function createAmmo() {
  ammos.push({
    x: Math.random() * canvas.width,
    y: -50,
    width: 30,
    height: 30,
    speed: 3,
  });
}

// Atirar projétil
function shoot() {
  if (ammo > 0 && keys["k"] && canShoot) {
    canShoot = false; 
    projectiles.push({ x: player.x + 20, y: player.y - 20, width: 5, height: 50, speed: -10 });
    ammo--;
    tiros++;
    
    setTimeout(() => (canShoot = true), 300);
  } else if (ammo <= 0) {
    ammoChance = 0.7;
  }
  
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
    projectiles.forEach((projectile, indexProj) => {
      if (projectile.x < asteroid.x + asteroid.width &&
       projectile.x + projectile.width > asteroid.x &&
       projectile.y < asteroid.y + asteroid.height &&
       projectile.y + projectile.height > asteroid.y)
       {
         asteroids.splice(i, 1);
         projectiles.splice(indexProj, 1);
         score += 15;
         asteroidesDestruidos++;

       }
   })
  }
}

// Atualizar projéteis
function updateProjectiles() {
  projectiles.forEach((projectile, index) => {
    projectile.y += projectile.speed;
    if (projectile.y > canvas.height) projectiles.splice(index, 1);
    
  });
}

function updateVidas() {
  for (let i = vidas.length - 1; i >= 0; i--) {
    const powerUp = vidas[i];
    powerUp.y += powerUp.speed;

    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      lives++;
      vidas.splice(i, 1);
    } else if (powerUp.y > canvas.height) {
      vidas.splice(i, 1);
    }
  }
}

function updateAmmo() {
  for (let i = ammos.length - 1; i >= 0; i--) {
    const powerUp = ammos[i];
    powerUp.y += powerUp.speed;

    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      let min = 3;
      let max = 8;
      let randInt = Math.floor(Math.random() * (max - min) + min);
      ammo += randInt;
      ammos.splice(i, 1);
    } else if (powerUp.y > canvas.height) {
      ammos.splice(i, 1);
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

  //Projétil
  ctx.fillStyle = "white";
  projectiles.forEach((projectile) =>{
  ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
  });

  for (const asteroid of asteroids) {
    ctx.drawImage(asteroidImg, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  }

  for (const powerUp of vidas) {
    ctx.drawImage(heartImg, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  }

  for (const ammo of ammos) {
    ctx.drawImage(ammoImg, ammo.x, ammo.y, ammo.width, ammo.height)
  }

  for (const coin of coins) {
    ctx.drawImage(coinGif, coin.x, coin.y, coin.width, coin.height);
  }

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Vidas: ${lives}`, 10, 30);
  ctx.fillText(`Pontuação: ${score}`, 10, 60);
  ctx.fillText(`Munição: ${ammo}`, 10, 90);
  ctx.fillText(`Asteróides destruídos: ${asteroidesDestruidos}`, 10, 120);
  ctx.fillText(`Precisão: ${precisao()}%`, 10, 150);
}

function startGame() {
  if (!isGameRunning) {
    isGameRunning = true;
    isPaused = false;
    menu.style.display = "none";
    animationId = requestAnimationFrame(loop); // Inicia o loop do jogo
  }
}



function pauseGame() {
  menu.style.display = "flex";
  isPaused = true;
  cancelAnimationFrame(animationId);
}

function resumeGame() {
  if (isPaused) {
    menu.style.display = "none"; // Esconde o menu
    isPaused = false;
    animationId = requestAnimationFrame(loop); // Retoma o loop do jogo
  }
}

function restartGame() {
  // Reseta variáveis
  lives = 3;
  score = 0;
  ammo = 3;
  canShoot = true;
  asteroidesDestruidos = 0;
  tiros = 0;

  // Reseta listas
  asteroids.length = 0;
  vidas.length = 0;
  ammos.length = 0;
  coins.length = 0;
  projectiles.length = 0;

  // Reseta posição do jogador
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 100;

  // Reinicia o jogo
  isGameRunning = false; // Garante que `startGame()` possa reiniciar o jogo
  startGame();
}


// Loop principal
function loop() {
  if (lives > 0 && !isPaused) {
    movePlayer();
    updateAsteroids();
    updateVidas();
    updateProjectiles();
    updateCoins();
    updateAmmo();
    draw();
    shoot();
    precisao();
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
setInterval(AmmoOrVida, 10000);
setInterval(createCoin, 3000);
