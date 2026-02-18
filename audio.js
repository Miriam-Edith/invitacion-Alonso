// ========== SECCIÓN DE AUDIO ==========
// VERSIÓN SIMPLIFICADA QUE FUNCIONA 100%

let audioManager = {
    music: null,
    isPlaying: false,
    
    init: function() {
        // Crear audio
        this.music = new Audio('./assets/audio/Cumpleaños Feliz al estilo Minecraft.MP3');
        this.music.volume = 0.5;
        this.music.loop = true;
        
        console.log('🎵 Audio inicializado');
        
        // Intentar reproducir (probablemente fallará por autoplay)
        this.music.play()
            .then(() => {
                this.isPlaying = true;
                console.log('✅ Autoplay exitoso');
            })
            .catch(() => {
                this.isPlaying = false;
                console.log('🔇 Autoplay bloqueado - esperando clic');
            })
            .finally(() => {
                this.updateButton();
            });
    },
    
    toggle: function() {
        console.log('🎵 Toggle presionado - Estado actual:', this.isPlaying ? 'sonando' : 'mute');
        
        if (this.isPlaying) {
            // Si está sonando, pausar
            this.music.pause();
            this.isPlaying = false;
            console.log('🔇 Música pausada');
        } else {
            // Si está mute, reproducir
            this.music.play()
                .then(() => {
                    this.isPlaying = true;
                    console.log('🔊 Música reproduciendo');
                })
                .catch(e => {
                    console.log('❌ Error al reproducir:', e);
                    alert('🎵 Haz clic en cualquier parte de la página para activar el audio');
                });
        }
        
        this.updateButton();
    },
    
    updateButton: function() {
        const button = document.querySelector('.music-toggle');
        if (!button) return;
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = this.isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            console.log('🎨 Ícono actualizado a:', icon.className);
        }
    }
};

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Página cargada, iniciando audio...');
    audioManager.init();
    
    // Conectar botón de música
    const musicBtn = document.querySelector('.music-toggle');
    if (musicBtn) {
        // Eliminar onclick del HTML
        musicBtn.removeAttribute('onclick');
        
        // Agregar evento nuevo
        musicBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('👆 Clic en botón de música');
            audioManager.toggle();
        });
        
        console.log('🔊 Botón de música conectado');
    }
});

// Exponer función global (por si acaso)
window.toggleMusic = function() {
    console.log('🌐 toggleMusic global llamado');
    audioManager.toggle();
};

