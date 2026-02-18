// ========== SECCIÓN DE AUDIO ==========

let audioManager = {
    music: null,
    isPlaying: false,
    audioUnlocked: false,
    autoPlayAttempted: false,
    
    init: function() {
        // Crear instancia de audio
        this.music = new Audio('assets/audio/Cumpleaños Feliz al estilo Minecraft.mp3');
        this.music.volume = 0.5;
        this.music.loop = true;
        
        console.log('🎵 Audio inicializado (una sola instancia)');
        
        // REPRODUCIR AUTOMÁTICAMENTE (SOLO UNA VEZ)
        this.attemptAutoPlay();
        
        // Configurar desbloqueo por si falla
        this.setupUnlock();
    },
    
    // reproducir automáticamente (solo una vez)
    attemptAutoPlay: function() {
        if (this.autoPlayAttempted) return;
        this.autoPlayAttempted = true;
        
        console.log('🎵 Intentando reproducción automática...');
        
        this.music.play()
            .then(() => {
                // Éxito: la música está sonando
                this.isPlaying = true;
                this.audioUnlocked = true;
                this.updateButton();
                console.log('✅ Reproducción automática exitosa');
            })
            .catch(e => {
                // Falló: el navegador bloqueó el autoplay
                console.log('⚠️ Autoplay bloqueado por el navegador');
                console.log('🔊 Esperando clic para desbloquear...');
                this.isPlaying = false;
                this.updateButton();
            });
    },
    
    setupUnlock: function() {
        // Desbloquear con el primer clic en cualquier parte
        const unlockOnce = () => {
            if (this.audioUnlocked) {
                document.removeEventListener('click', unlockOnce);
                return;
            }
            
            console.log('🔓 Desbloqueando audio con clic...');
            
            // Si ya está sonando, no hacer nada
            if (this.isPlaying) {
                this.audioUnlocked = true;
                document.removeEventListener('click', unlockOnce);
                return;
            }
            
            // Reproducir la MISMA instancia
            this.music.play()
                .then(() => {
                    this.isPlaying = true;
                    this.audioUnlocked = true;
                    this.updateButton();
                    console.log('✅ Audio desbloqueado y reproduciendo');
                })
                .catch(e => {
                    console.log('❌ Error al desbloquear:', e);
                });
            
            document.removeEventListener('click', unlockOnce);
        };
        
        document.addEventListener('click', unlockOnce, { once: true });
    },
    
    play: function() {
        // Si ya está sonando, NO reproducir otra vez
        if (this.isPlaying) {
            console.log('▶️ La música ya está sonando');
            return;
        }
        
        // Si no está desbloqueado, esperar
        if (!this.audioUnlocked) {
            console.log('⏳ Audio no desbloqueado aún');
            return;
        }
        
        console.log('▶️ Reproduciendo música...');
        
        this.music.play()
            .then(() => {
                this.isPlaying = true;
                this.updateButton();
            })
            .catch(e => {
                console.log('❌ Error al reproducir:', e);
            });
    },
    
    pause: function() {
        if (!this.isPlaying) {
            console.log('⏸️ La música ya está pausada');
            return;
        }
        
        console.log('⏸️ Pausando música...');
        this.music.pause();
        this.isPlaying = false;
        this.updateButton();
    },
    
    toggle: function() {
        console.log('🔄 Toggle música - Estado actual:', this.isPlaying ? 'sonando' : 'pausada');
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },
    
    updateButton: function() {
        const button = document.querySelector('.music-toggle');
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
    }
};

// Inicializar cuando cargue la página (SOLO UNA VEZ)
document.addEventListener('DOMContentLoaded', function() {
    // Evitar múltiples inicializaciones
    if (window.audioManagerInitialized) return;
    window.audioManagerInitialized = true;
    
    audioManager.init();
    
    // Conectar botón de música
    const musicBtn = document.querySelector('.music-toggle');
    if (musicBtn) {
        // Eliminar cualquier onclick previo
        musicBtn.removeAttribute('onclick');
        
        // Agregar evento único
        musicBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            audioManager.toggle();
        });
    }
    
    console.log('🎮 Control de audio listo');
});

// Exponer función global para compatibilidad
window.toggleMusic = function() {
    audioManager.toggle();
};
