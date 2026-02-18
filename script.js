// ✅ FECHA CORRECTA - 10 DE MARZO 2026
const COUNTDOWN_DATE = new Date('March 10, 2026 15:00:00').getTime();
let easterClicks = 0;
const EGG_CLICKS_NEEDED = 8;
// EVITAR QUE ENTER RECARGUE LA PÁGINA
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        console.log("✅ Enter prevenido - No se recarga la página");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Ocultar loader
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1500);

    // Iniciar contador
    startCountdown();
});

// ✅ CONTADOR REGRESIVO
function startCountdown() {
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = COUNTDOWN_DATE - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '🎉';
            document.getElementById('hours').textContent = '🎮';
            document.getElementById('minutes').textContent = '✨';
            document.getElementById('seconds').textContent = '🎂';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ✅ EASTER EGG DE 8 CLICS (CORREGIDO)
function checkEasterEgg(element) {
    easterClicks++;
    
    // Actualizar contador visual
    const counter = element.querySelector('.click-counter');
    if (counter) {
       counter.textContent = easterClicks;  // Solo muestra 1,2,3... en lugar de "1/8"
    }
    
    // Efectos visuales
    element.style.transform = 'scale(0.9)';
    element.style.backgroundColor = ['#FF5555', '#FFD700', '#00A2FF', '#7CBA3D'][easterClicks % 4];
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
    
    // ¡DESBLOQUEAR SECRETO!
    if (easterClicks >= EGG_CLICKS_NEEDED) {
        // Mostrar modal
        const modal = document.getElementById('secretModal');
        if (modal) {
            modal.style.display = 'block';
        } else {
            alert('🎉 ¡FELICIDADES! Has desbloqueado el modo creativo');
            // Activar modo secreto
            document.body.classList.add('secret-unlocked');
            
            // Disparar confetti
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
             //Si no existe el modal, crearlo dinámicamente
            createSecretModal();
        }
        
        //resetear contador y efectos
        easterClicks = 0;
        if (counter) {
            counter.textContent = '0';
        }
        element.style.backgroundColor = '#33e0ff';
    }
}

// Función para crear el modal si no existe
function createSecretModal() {
    if (document.getElementById('secretModal')) return;
    
    const modalHTML = `
        <div id="secretModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <div style="font-size: 48px; margin: 5px 0;">💎👑✨</div>
                <h2>¡SECRETO DESBLOQUEADO! </h2>
                
                <!-- ✅ IMAGEN CON TAMAÑO CONTROLADO -->
                <img src="assets/images/secret-reward.jpg" 
                     alt="Premio secreto" 
                     class="secret-reward-img"
                     onerror="this.style.display='none'">
            
                <p>
                    <strong style="color: #FFD700;">Alonso dice:</strong><br>
                    "¡Eres un detective increíble!<br>
                    Muestra esto en mi fiesta por un premio especial."
                </p>
                <div style="background: linear-gradient(145deg, #FFD700, #FFA500); 
                            color: black; 
                            padding: 15px; 
                            border-radius: 10px; 
                            margin: 15px 0;
                            border: 3px solid white;
                            font-weight: bold;">
                    🎁 ¡PREMIO SECRETO! 🎁
                </div>
                <button onclick="closeModal()" class="minecraft-btn">
                    🎮 CERRAR
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showSecretModal() {
    const modal = document.getElementById('secretModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        createSecretModal();
        setTimeout(() => {
            document.getElementById('secretModal').style.display = 'block';
        }, 50);
    }
}

function closeModal() {
    const modal = document.getElementById('secretModal');
    if (modal) {
        modal.style.display = 'none';
        easterClicks = 0;
        const counter = document.querySelector('.click-counter');
        if (counter) counter.textContent = '0';
        const block = document.querySelector('.easter-block');
        if (block) block.style.backgroundColor = '#33e0ff';
    }
}

// También agregar evento para cerrar con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Cerrar modal haciendo clic fuera del contenido
document.addEventListener('click', function(e) {
    const modal = document.getElementById('secretModal');
    if (modal && modal.style.display === 'block' && e.target === modal) {
        closeModal();
    }
});

// ✅ MÚSICA
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const icon = document.querySelector('.music-toggle i');
    
    if (music.paused) {
        music.play().catch(error => {
            console.log("Click en la página para reproducir música");
            // Si falla, agregar evento de click al body
            document.body.addEventListener('click', function playOnClick() {
                music.play();
                document.body.removeEventListener('click', playOnClick);
            }, { once: true });
        });
        icon.className = 'fas fa-volume-up'; //icono del volumen activo
        console.log("🎵 Musica reproducida");
    } else {
        // si esta sonando, pausarla
        music.pause();
        icon.className = 'fas fa-volume-mute'; //icono de mute
        console.log("🔇Música silenciada");
    }
}

// ✅ CARGA DE SECCIONES (con mapa estático)
function loadSection(section) {
    const contentDiv = document.getElementById('content-section');
    contentDiv.style.opacity = '0';
    
    setTimeout(() => {
        switch(section) {
           case 'historia':
    contentDiv.innerHTML = `
        <div class="section historia-section">
            <button class="back-btn" onclick="closeSection()">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
            <h2 style="text-align: center; margin-bottom: 25px;">📖 La Historia de Alonso</h2>
           
            <!-- 🔴 CONTENEDOR DEL VIDEO - MÁS CUADRADO Y CENTRADO -->
            <div style="display: flex; justify-content: center; margin: 20px 0;">
                <div class="video-wrapper" style="
                    width: 200px;
                    height: 200px;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 15px 30px rgb(53, 212, 230);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 6px solid #5a7a3e;
                    position: relative;" 
                    onclick="expandVideo(this)">

                    <video id="historiaVideo" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    ">
                        <source src="assets/videos/video alonso.mp4" type="video/mp4">
                        Tu navegador no soporta video.
                    </video>
                    
                    <!-- 🔴 Ícono de play superpuesto -->
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgb(53, 212, 230);
                        width: 70px;
                        height: 70px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 4px solid white;
                        pointer-events: none;
                    ">
                        <i class="fas fa-play"
                         style="font-size: 35px;
                         color: white;
                         margin-left: 5px;">
                         </i>
                    </div>
                </div>
            </div>
            
            <!-- 🔴 TEXTO INSTRUCTIVO -->
            <p style="text-align: center; margin: 10px 0 30px; font-size: 14px; color: #aaa;">
                <i class="fas fa-hand-pointer"></i> Haz clic en el video para expandirlo
            </p>
            
            <!-- 🔴 GALERÍA DE TARJETAS QUE GIRAN -->
            <h3 style="text-align: center; margin: 40px 0 20px; color: #FFD700; font-size: 20px;">
                ✨ Haz clic en las cartas para ver a Alonso ✨
            </h3>
            
            <div class="photo-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 25px;
                margin-top: 20px;
                perspective: 1000px;
            ">
                <!-- Tarjeta Nivel 1 (720x1280) -->
<div class="flip-card" onclick="this.classList.toggle('flipped')">
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <div style="font-size: 60px; margin-bottom: 5px;">🌱</div>
            <h4 style="font-size: 18px; margin-bottom: 10px;">Nivel 1</h4>
            <p style="font-size: 14px; opacity: 0.8;">El Inicio</p>
            <p style="font-size: 11px; margin-top: 15px;">Haz clic para ver</p>
        </div>
        <div class="flip-card-back">
            <img src="assets/images/Alonso-1.jpg" 
                 alt="Alonso Nivel 1" 
                 style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center 20%; /* Foto vertical, mostrar parte superior */
                 " 
                 onerror="this.src='https://via.placeholder.com/300x400?text=👶+Alonso+Nivel+1'">
        </div>
    </div>
</div>

<!-- Tarjeta Nivel 4 (1080x1440) -->
<div class="flip-card" onclick="this.classList.toggle('flipped')">
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <div style="font-size: 60px; margin-bottom: 5px;">⚔️</div>
            <h4 style="font-size: 18px; margin-bottom: 10px;">Nivel 4</h4>
            <p style="font-size: 14px; opacity: 0.8;">El Explorador</p>
            <p style="font-size: 11px; margin-top: 15px;">Haz clic para ver</p>
        </div>
        <div class="flip-card-back">
            <img src="assets/images/Alonso-4.jpg" 
                 alt="Alonso Nivel 4" 
                 style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center 5%; 
                 " 
                 onerror="this.src='https://via.placeholder.com/300x400?text=⚔️+Alonso+Nivel+4'">
        </div>
    </div>
</div>

<!-- Tarjeta Nivel 8 (2448x3264) -->
<div class="flip-card" onclick="this.classList.toggle('flipped')">
    <div class="flip-card-inner">
        <div class="flip-card-front">
            <div style="font-size: 60px; margin-bottom: 5px;">👑</div>
            <h4 style="font-size: 18px; margin-bottom: 10px;">Nivel 8</h4>
            <p style="font-size: 14px; opacity: 0.8;">El Héroe</p>
            <p style="font-size: 11px; margin-top: 15px;">Haz clic para ver</p>
        </div>
        <div class="flip-card-back">
            <img src="assets/images/Alonso-8.jpg" 
                 alt="Alonso Nivel 8" 
                 style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center 25%;
                 " 
                 onerror="this.src='https://via.placeholder.com/300x400?text=👑+Alonso+Nivel+8'">
        </div>
    </div>
</div>
    `;
    break;
                
           case 'mapa':
    contentDiv.innerHTML = `
        <div class="section mapa-section">
            <button class="back-btn" onclick="closeSection()">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
            <h2>🗺️ Mapa de la Misión</h2>
            
            <!-- MAPA EMBED DE GOOGLE -->
            <div style="
                width: 100%; 
                height: 450px;
                margin: 25px 0;
                border: 8px solid #5a7a3e; 
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgb(53, 212, 230);
                position: relative;
            ">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3739.526619311471!2d-99.99614592498641!3d20.402398981094805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d30ca1caab82c3%3A0x4963c76f797d33da!2sPrimaria%20Jaime%20Torres%20Bodet!5e0!3m2!1ses-419!2smx!4v1771007733877!5m2!1ses-419!2smx" 
                    width="100%"
                    height="100%"
                    style="border:0; display: block;"
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
            
            <div class="rsvp-form">
                <h3>✅ Confirma tu Misión</h3>
                
                <!-- Formulario -->
                <div style="margin-bottom: 20px;">
                    <input type="text" id="nombre-aventurero" placeholder="Nombre del Aventurero" style="width: 100%; padding: 15px; margin-bottom: 15px; border: 4px solid #444; border-radius: 10px; background: #2a2a2a; color: white; font-family: 'Press Start 2P', monospace;">
                    
                    <input type="email" id="email-aventurero" placeholder="Email (para el mapa)" style="width: 100%; padding: 15px; margin-bottom: 15px; border: 4px solid #444; border-radius: 10px; background: #2a2a2a; color: white; font-family: 'Press Start 2P', monospace;">
                    
                    <input type="number" id="personas-aventurero" placeholder="¿Cuántos vienen?" min="1" max="10" style="width: 100%; padding: 15px; margin-bottom: 15px; border: 4px solid #444; border-radius: 10px; background: #2a2a2a; color: white; font-family: 'Press Start 2P', monospace;">
                    
                    <textarea id="mensaje-aventurero" placeholder="Mensaje para Alonso..." rows="3" style="width: 100%; padding: 15px; margin-bottom: 20px; border: 4px solid #444; border-radius: 10px; background: #2a2a2a; color: white; font-family: 'Press Start 2P', monospace;"></textarea>
                </div>
                
                <!-- 🔴 BOTONES DUALES -->
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <button onclick="enviarWhatsApp()" class="minecraft-btn" style="flex: 1; background: linear-gradient(to bottom, #25D366, #128C7E); min-width: 200px;">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    
                    <button onclick="enviarEmail()" class="minecraft-btn" style="flex: 1; background: linear-gradient(to bottom, #7c7c7c, #4a4a4a); min-width: 200px;">
                        <i class="fas fa-envelope"></i> Email
                    </button>
                </div>
            </div>
        </div>
    `;
    break;
                
   case 'juego':
    contentDiv.innerHTML = `
        <div class="section juego-section">
            <button class="back-btn" onclick="closeSection()">
                <i class="fas fa-arrow-left"></i> Volver
            </button>
            <h2 style="font-size: 24px; margin-bottom: 20px; text-align: center;">🎮 Supera el Reto</h2>
            
            <!-- 🔴 CONTENEDOR DEL JUEGO - IGUAL QUE LA IMAGEN -->
            <div class="game-container" style="
                max-width: 800px;
                margin: 0 auto;
            ">
                <!-- Canvas del juego -->
                <div style="
                    background: linear-gradient(to bottom, #87CEEB, #5a7a3e);
                    border: 8px solid #5a7a3e;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    margin-bottom: 25px;
                ">
                    <canvas id="gameCanvas" width="800" height="400" style="display: block; width: 100%; height: auto;"></canvas>
                </div>
                
                <!-- 🔴 PANEL DE CONTROLES - EXACTAMENTE COMO LA IMAGEN -->
                <div style="
                    background: rgba(0, 0, 0, 0.85);
                    padding: 25px;
                    border-radius: 15px;
                    border: 4px solid #5a7a3e;
                    text-align: center;
                ">
                    <p style="
                        font-size: 16px;
                        margin-bottom: 10px;
                        color: white;
                        text-shadow: 2px 2px 0 #000;
                        font-family: 'Press Start 2P', monospace;
                    ">
                        ⬆️⬇️⬅️➡️ Muévete por el mundo
                    </p>
                    
                    <p style="
                        font-size: 16px;
                        margin-bottom: 20px;
                        color: #FFD700;
                        text-shadow: 2px 2px 0 #000;
                        font-family: 'Press Start 2P', monospace;
                    ">
                        🎁 Recoge 8 regalos - 💣 Esquiva los creepers
                    </p>
                    
                    <!-- Contadores de juego -->
<div style="
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 25px;
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
">
    <div style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 15px; border: 2px solid #FFD700;">
        <span style="font-size: 24px;">🎁</span>
        <span id="game-score">0/8</span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 15px; border: 2px solid #FF5555;">
        <span style="font-size: 24px;">❤️</span>
        <span id="game-lives">❤️❤️❤️</span>
    </div>
</div>
                    
                    <!-- Botón Comenzar Aventura -->
                    <button onclick="window.iniciarAventura()" class="minecraft-btn" style="
                        background: linear-gradient(to bottom, #7c7c7c, #4a4a4a);
                        border: 4px solid #2a2a2a;
                        color: white;
                        padding: 15px 40px;
                        font-size: 18px;
                        cursor: pointer;
                        border-radius: 10px;
                        font-weight: bold;
                        box-shadow: 0 8px 0 #1a1a1a;
                        font-family: 'Press Start 2P', monospace;
                        width: auto;
                        min-width: 280px;
                        margin-top: 5px;
                    ">
                        ⚔️ Comenzar Aventura
                    </button>
                </div>
            </div>
        </div>
    `;

    // Cargar CSS del juego
const gameCSS = document.createElement('link');
gameCSS.rel = 'stylesheet';
gameCSS.href = 'game/game.css?' + Date.now();
document.head.appendChild(gameCSS);
    
    // Cargar el juego después de que exista el canvas
    setTimeout(() => {
        // Verificar si ya existe el script del juego
        if (!document.querySelector('script[src*="game.js"]')) {  //  USA * PARA BUSCAR PARCIAL
            const script = document.createElement('script');
            script.src = 'game/game.js?' + new Date().getTime(); // Evitar caché
            script.onload = () => {
                console.log("🎮 Juego cargado!");
                if (typeof window.iniciarJuego === 'function') {
                    window.iniciarJuego();
                }
            };
            document.body.appendChild(script);
        } else if (typeof window.iniciarJuego === 'function') {
            window.iniciarJuego();
        }
    }, 300);
    break;
        }
        
        contentDiv.style.opacity = '1';
        contentDiv.scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// ✅ FORMULARIO SIN BACKEND
function confirmRSVP(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.name.value;
    const guests = form.guests.value;
    
    // Mostrar mensaje de confirmación
    alert(`🎉 ¡Misión aceptada, ${name}!\n\nTe esperamos con ${guests} acompañante${guests > 1 ? 's' : ''}.\n¡Nos vemos el 10 de Marzo!`);
    
    // Resetear formulario
    form.reset();
    
    // Opcional: guardar en localStorage
    const rsvpData = {
        name: name,
        guests: guests,
        date: new Date().toISOString()
    };
    localStorage.setItem('rsvp_' + Date.now(), JSON.stringify(rsvpData));
    
    return false;
}

function closeSection() {
    const contentDiv = document.getElementById('content-section');
    contentDiv.style.opacity = '0';
    setTimeout(() => {
        contentDiv.innerHTML = '';
        document.querySelector('.main-menu').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// ✅ JUEGO (placeholder)
function startGame() {
    alert('🎮 ¡Modo aventura activado! (Próximamente)');
}

// 🔴 FUNCIÓN PARA EXPANDIR EL VIDEO - CON REPRODUCCIÓN ASEGURADA
function expandVideo(element) {
    const video = element.querySelector('video');
    const playIcon = element.querySelector('.play-icon-container');
    const isExpanded = element.classList.contains('expanded');
    
    if (!isExpanded) {
        // Guardar posición original
        const rect = element.getBoundingClientRect();
        
        // Ocultar ícono de play
        if (playIcon) playIcon.style.display = 'none';
        
        // Expandir video
        element.style.width = '600px';
        element.style.height = '450px';
        element.style.position = 'fixed';
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.zIndex = '10001';
        element.classList.add('expanded');
        
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.id = 'video-overlay';
      //overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
      //overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '10000';
        overlay.style.cursor = 'pointer';
        
        overlay.onclick = function() {
            // Restaurar video
            element.style.width = '200px';
            element.style.height = '200px';
            element.style.position = 'relative';
            element.style.top = 'auto';
            element.style.left = 'auto';
            element.style.transform = 'none';
            element.style.zIndex = '1';
            element.classList.remove('expanded');
            
            // Mostrar ícono de play
            if (playIcon) playIcon.style.display = 'flex';
            
            // Pausar video
            video.pause();
            
            // Quitar overlay
            document.body.removeChild(overlay);
        };
        
        document.body.appendChild(overlay);
        
        // 🔴 REPRODUCIR CON EL MISMO CLIC (EL NAVEGADOR LO PERMITE)
        video.play()
            .then(() => {
                console.log("🎥 Video reproduciendo");
            })
            .catch(e => {
                console.log("Error al reproducir:", e);
                // Si falla, mostrar mensaje
                alert("Haz clic en el video para reproducir");
            });
        
    } else {
        // Si ya está expandido, contraer
        element.style.width = '200px';
        element.style.height = '200px';
        element.style.position = 'relative';
        element.style.top = 'auto';
        element.style.left = 'auto';
        element.style.transform = 'none';
        element.style.zIndex = '1';
        element.classList.remove('expanded');
        
        // Mostrar ícono de play
        if (playIcon) playIcon.style.display = 'flex';
        
        // Quitar overlay
        const overlay = document.getElementById('video-overlay');
        if (overlay) document.body.removeChild(overlay);
        
        // Pausar video
        video.pause();
    }
}

// 🔴 FUNCIÓN PARA ENVIAR POR WHATSAPP
function enviarWhatsApp(event) {
    if (event) event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('whatsapp-nombre')?.value || document.getElementById('nombre-aventurero')?.value;
    const email = document.getElementById('whatsapp-email')?.value || document.getElementById('email-aventurero')?.value;
    const personas = document.getElementById('whatsapp-personas')?.value || document.getElementById('personas-aventurero')?.value;
    const mensaje = document.getElementById('whatsapp-mensaje')?.value || document.getElementById('mensaje-aventurero')?.value;
    
    // Validar campos requeridos
    if (!nombre || !personas) {
        alert('❌ Por favor completa tu nombre y número de personas');
        return false;
    }
    
    // 🔴 CAMBIA ESTE NÚMERO POR EL TUYO (incluye código de país)
    // Ejemplo: 521234567890 (México)
    const numeroWhatsApp = '527122433697'; // ← CÁMBIALO
    
    // Crear mensaje
    const textoMensaje = `🎮 *¡Misión aceptada!* 🎮%0A%0A👤 *Aventurero:* ${nombre}%0A📧 *Email:* ${email || 'No proporcionado'}%0A👥 *Acompañantes:* ${personas}%0A💬 *Mensaje:* ${mensaje || 'Sin mensaje'}%0A%0A🎉 ¡Nos vemos el 10 de Marzo!`;
    
    // Abrir WhatsApp
    const url = `https://wa.me/${numeroWhatsApp}?text=${textoMensaje}`;
    window.open(url, '_blank');
    
    // Guardar en localStorage
    const rsvpData = {
        nombre: nombre,
        email: email,
        personas: personas,
        mensaje: mensaje,
        fecha: new Date().toISOString(),
        metodo: 'whatsapp'
    };
    localStorage.setItem('rsvp_' + Date.now(), JSON.stringify(rsvpData));
    
    return false;
}

// 🔴 FUNCIÓN PARA ENVIAR POR EMAIL (opcional)
function enviarEmail(event) {
    if (event) event.preventDefault();
    
    const nombre = document.getElementById('nombre-aventurero')?.value;
    const email = document.getElementById('email-aventurero')?.value;
    const personas = document.getElementById('personas-aventurero')?.value;
    const mensaje = document.getElementById('mensaje-aventurero')?.value;
    
    if (!nombre || !personas) {
        alert('❌ Por favor completa tu nombre y número de personas');
        return false;
    }
    
    // Crear mailto
    const asunto = `🎮 Misión aceptada - ${nombre}`;
    const cuerpo = `🎮 ¡Misión aceptada! 🎮%0A%0A👤 Aventurero: ${nombre}%0A📧 Email: ${email || 'No proporcionado'}%0A👥 Acompañantes: ${personas}%0A💬 Mensaje: ${mensaje || 'Sin mensaje'}%0A%0A🎉 ¡Nos vemos el 10 de Marzo!`;
    
    // 🔴 CAMBIA ESTE EMAIL
    const emailDestino = 'Diabliya06@gmail.com'; // ← CÁMBIALO
    
    window.location.href = `mailto:${emailDestino}?subject=${asunto}&body=${cuerpo}`;
    
    // Guardar en localStorage
    const rsvpData = {
        nombre: nombre,
        email: email,
        personas: personas,
        mensaje: mensaje,
        fecha: new Date().toISOString(),
        metodo: 'email'
    };
    localStorage.setItem('rsvp_' + Date.now(), JSON.stringify(rsvpData));
    
    return false;

}
