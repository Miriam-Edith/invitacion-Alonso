// ========== 🎮 JUEGO MINECRAFT PARA ALONSO ==========
let canvas, ctx;
let player, gifts, enemies, particles;
let score = 0;
let lives = 3;
let gameRunning = false;
let gameLoop;
let keys = {};
let totalGifts = 8;

// Configuración del juego
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 28;
const GIFT_SIZE = 18;
const ENEMY_SIZE = 22;
const GRAVITY = 0.4;
const JUMP_FORCE = -10;
const MOVE_SPEED = 4;

// Emojis
const PLAYER_EMOJI = '👦';
const GIFT_EMOJI = '🎁';
const ENEMY_EMOJI = '💣';

// Función principal
window.cargarJuego = function() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.log("⏳ Esperando canvas...");
        setTimeout(window.cargarJuego, 100);
        return;
    }
    
    ctx = canvas.getContext('2d');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    
    resetGame();
    
    // 🔴 IMPORTANTE: Eliminar listeners anteriores para evitar duplicados
    document.removeEventListener('keydown', keyDownHandler);
    document.removeEventListener('keyup', keyUpHandler);
    
    // Agregar listeners NUEVOS
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    
    // 🔴 DIBUJAR INMEDIATAMENTE para que se vea algo
    draw();
    
    console.log("🎮 Juego cargado y listo! Usa flechas y espacio");
};

// ========== CONTROLES ==========
function keyDownHandler(e) {
    // Prevenir desplazamiento de la página
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
    }
    
    keys[e.key] = true;
    
    // Saltar
    if ((e.key === 'ArrowUp' || e.key === ' ') && gameRunning) {
        if (!player.isJumping) {
            player.velocityY = JUMP_FORCE;
            player.isJumping = true;
        }
    }
}

function keyUpHandler(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
    }
    
    keys[e.key] = false;
}

// ========== INICIALIZACIÓN ==========
function resetGame() {
    player = {
        x: 100,
        y: GAME_HEIGHT - 100,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        velocityX: 0,
        velocityY: 0,
        isJumping: false
    };
    
    // 8 Regalos
    gifts = [];
    for (let i = 0; i < totalGifts; i++) {
        gifts.push({
            x: 150 + Math.random() * 500,
            y: GAME_HEIGHT - 80,
            width: GIFT_SIZE,
            height: GIFT_SIZE,
            collected: false
        });
    }
    
    // 3 Enemigos
    enemies = [
        { x: 300, y: GAME_HEIGHT - 80, width: ENEMY_SIZE, height: ENEMY_SIZE, speedX: 2 },
        { x: 500, y: GAME_HEIGHT - 80, width: ENEMY_SIZE, height: ENEMY_SIZE, speedX: -2.5 },
        { x: 200, y: GAME_HEIGHT - 80, width: ENEMY_SIZE, height: ENEMY_SIZE, speedX: 3 }
    ];
    
    particles = [];
    score = 0;
    lives = 3;
    
    updateUI();
}

// ========== ACTUALIZACIÓN ==========
function updateGame() {
    if (!gameRunning) return;
    
    // Movimiento horizontal
    if (keys['ArrowLeft'] || keys['a']) {
        player.velocityX = -MOVE_SPEED;
    } else if (keys['ArrowRight'] || keys['d']) {
        player.velocityX = MOVE_SPEED;
    } else {
        player.velocityX *= 0.8;
    }
    
    // Gravedad
    player.velocityY += GRAVITY;
    
    // Actualizar posición
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Límites
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > GAME_WIDTH) player.x = GAME_WIDTH - player.width;
    
    // Suelo
    if (player.y + player.height > GAME_HEIGHT - 50) {
        player.y = GAME_HEIGHT - 50 - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }
    
    // Techo
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }
    
    // Recolectar regalos
    gifts.forEach(gift => {
        if (!gift.collected) {
            if (player.x < gift.x + gift.width &&
                player.x + player.width > gift.x &&
                player.y < gift.y + gift.height &&
                player.y + player.height > gift.y) {
                
                gift.collected = true;
                score++;
                updateUI();
                createParticles(gift.x, gift.y, '#FFD700');
            }
        }
    });
    
    // Enemigos
    enemies.forEach(enemy => {
        enemy.x += enemy.speedX;
        
        if (enemy.x < 0 || enemy.x + enemy.width > GAME_WIDTH) {
            enemy.speedX *= -1;
        }
        
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            
            if (player.velocityY > 0 && player.y + player.height < enemy.y + 15) {
                player.velocityY = JUMP_FORCE / 1.5;
                createParticles(enemy.x, enemy.y, '#00FF00');
            } else {
                lives--;
                updateUI();
                createParticles(player.x, player.y, '#FF0000');
                
                if (lives <= 0) {
                    gameOver(false);
                } else {
                    player.x = 100;
                    player.y = GAME_HEIGHT - 100;
                    player.velocityX = 0;
                    player.velocityY = 0;
                }
            }
        }
    });
    
    // Partículas
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        return p.life > 0;
    });
    
    // Victoria
    if (score >= totalGifts) {
        gameOver(true);
    }
    
    draw();
}

// ========== DIBUJO ==========
function draw() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Cielo
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT - 50);
    
    // Suelo
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(0, GAME_HEIGHT - 50, GAME_WIDTH, 50);
    
    // Pasto
    ctx.fillStyle = '#5a7a3e';
    ctx.fillRect(0, GAME_HEIGHT - 55, GAME_WIDTH, 5);
    
    // Nubes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(100, 80, 120, 30);
    ctx.fillRect(600, 120, 150, 35);
    
    // Regalos
    gifts.forEach(gift => {
        if (!gift.collected) {
            ctx.font = `${GIFT_SIZE + 5}px Arial`;
            ctx.fillText(GIFT_EMOJI, gift.x, gift.y + gift.height);
        }
    });
    
    // Enemigos
    enemies.forEach(enemy => {
        ctx.font = `${ENEMY_SIZE + 5}px Arial`;
        ctx.fillText(ENEMY_EMOJI, enemy.x, enemy.y + enemy.height);
    });
    
    // Partículas
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.globalAlpha = 1;
    });
    
    // Jugador
    ctx.font = `${PLAYER_SIZE + 5}px Arial`;
    ctx.fillText(PLAYER_EMOJI, player.x, player.y + player.height);
}

function createParticles(x, y, color) {
    for (let i = 0; i < 6; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 1,
            color: color
        });
    }
}

function updateUI() {
    const scoreSpan = document.getElementById('game-score');
    if (scoreSpan) {
        scoreSpan.textContent = `${score}/${totalGifts}`;
    }
    
    const livesSpan = document.getElementById('game-lives');
    if (livesSpan) {
        const hearts = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
        livesSpan.innerHTML = hearts;
    }
}

function gameOver(win) {
    gameRunning = false;
    
    if (win) {
        alert('🎉 ¡FELICIDADES! Recolectaste todos los regalos. ¡Ganaste un premio especial en la fiesta!');
    } else {
        alert('💥 ¡Oh no! Te quedaste sin vidas. Intenta de nuevo.');
    }
    
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
}

// Función para iniciar la aventura
window.iniciarAventura = function() {
    if (gameRunning) return;
    
    resetGame();
    gameRunning = true;
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, 1000/60);
};

// Cargar automáticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.cargarJuego, 500);
    });
} else {
    setTimeout(window.cargarJuego, 500);
}