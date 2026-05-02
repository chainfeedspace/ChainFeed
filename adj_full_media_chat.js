// ================================================
// VISUALIZADOR SIMPLE PARA MEDIOS ADJUNTADOS EN CHAT
// js/adj_full_media_chat.js
// ================================================

class SimpleMediaViewer {
    constructor() {
        this.isVisible = false;
        this.currentMediaUrl = null;
        this.currentMediaType = null;
        this.currentVideo = null;
        
        this.init();
    }

    init() {
        this.createViewerHTML();
        this.bindEvents();
        console.log('📸 SimpleMediaViewer inicializado');
    }

    createViewerHTML() {
        // Verificar si ya existe
        if (document.getElementById('simpleMediaViewer')) return;

        const viewerHTML = `
            <div class="simple-media-viewer" id="simpleMediaViewer">
                <div class="simple-viewer-overlay"></div>
                <div class="simple-viewer-content">
                    <button class="simple-viewer-close" id="simpleViewerClose" aria-label="Salir">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
    </svg>
</button>
                    <div class="simple-viewer-media" id="simpleViewerMedia"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', viewerHTML);
        this.injectStyles();
    }

  injectStyles() {
    if (document.getElementById('simple-media-viewer-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'simple-media-viewer-styles';
    styles.textContent = `
        .simple-media-viewer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .simple-media-viewer.active {
            display: flex;
        }

        .simple-viewer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .simple-viewer-content {
            position: relative;
            z-index: 2;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

.simple-viewer-close {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgb(195 186 215 / 30%);
    border: 2px solid rgba(115, 114, 190, 0.34);
    color: rgb(203 197 217 / 71%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
}

.simple-viewer-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-3px);
}

.simple-viewer-close svg {
    width: 24px;
    height: 24px;
}

        .simple-viewer-media {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .simple-viewer-media img {
            width: 100vw;
            height: 100vh;
            object-fit: contain;
            background: #000000a3;
        }

        .simple-viewer-media video {
            width: 100vw;
            height: 100vh;
            object-fit: contain;
            background: #000000a3;
        }

        /* Controles de video personalizados */
        .simple-video-controls {
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgb(0 0 0 / 18%);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 1rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 4;
            min-width: 300px;
        }

        .simple-media-viewer.active .simple-video-controls {
            opacity: 1;
        }

        .simple-video-controls.visible {
            opacity: 1;
        }

        .video-control-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0.5rem;
        }

        .video-control-btn:hover {
            transform: scale(1.1);
        }

        .progress-container {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            min-width: 200px;
        }

        .progress-bar {
            height: 100%;
            position: relative;
        }

        .progress-filled {
            height: 100%;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border-radius: 3px;
            width: 0%;
            transition: width 0.1s linear;
        }

        .time-display {
            color: white;
            font-size: 0.9rem;
            min-width: 100px;
            text-align: center;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .simple-viewer-close {
                top: 15px;
                left: 15px;
                width: 45px;
                height: 45px;
                font-size: 1.8rem;
            }

            .simple-video-controls {
                bottom: 100px;
                width: 85%;
                min-width: auto;
            }

            .progress-container {
                min-width: 120px;
            }

            .time-display {
                font-size: 0.8rem;
                min-width: 80px;
            }
        }
    `;

    document.head.appendChild(styles);
}

    bindEvents() {
        // Cerrar al hacer clic en el botón X
        document.getElementById('simpleViewerClose')?.addEventListener('click', () => {
            this.close();
        });

        // Cerrar al hacer clic en el overlay
        document.querySelector('.simple-viewer-overlay')?.addEventListener('click', () => {
            this.close();
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.close();
            }
        });

        // Espacio para pausar/reproducir video
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && this.isVisible && this.currentVideo) {
                e.preventDefault();
                this.toggleVideoPlayback();
            }
        });
    }

    open(mediaUrl, mediaType) {
        this.currentMediaUrl = mediaUrl;
        this.currentMediaType = mediaType;
        this.isVisible = true;

        const viewer = document.getElementById('simpleMediaViewer');
        const mediaContainer = document.getElementById('simpleViewerMedia');

        if (!viewer || !mediaContainer) return;

        // Limpiar contenido anterior
        mediaContainer.innerHTML = '';

        // Renderizar según tipo
        if (mediaType === 'imagen') {
            this.renderImage(mediaContainer, mediaUrl);
        } else if (mediaType === 'video') {
            this.renderVideo(mediaContainer, mediaUrl);
        }

        // Mostrar viewer
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    renderImage(container, imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Imagen adjunta';
        img.loading = 'eager';
        
        container.appendChild(img);
    }

    renderVideo(container, videoUrl) {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.controls = false;
        video.autoplay = true;
        video.loop = false;
        video.preload = 'metadata';

        this.currentVideo = video;

        // Crear controles personalizados
        const controls = this.createVideoControls();
        
        container.appendChild(video);
        container.appendChild(controls);

        // Configurar eventos del video
        this.setupVideoEvents(video, controls);
    }

    createVideoControls() {
        const controls = document.createElement('div');
        controls.className = 'simple-video-controls visible';
        controls.innerHTML = `
            <button class="video-control-btn" id="simplePlayPauseBtn">⏸️</button>
            <div class="progress-container" id="simpleProgressContainer">
                <div class="progress-bar">
                    <div class="progress-filled" id="simpleProgressFilled"></div>
                </div>
            </div>
            <div class="time-display" id="simpleTimeDisplay">0:00 / 0:00</div>
            <button class="video-control-btn" id="simpleVolumeBtn">🔊</button>
        `;

        return controls;
    }

    setupVideoEvents(video, controls) {
        const playPauseBtn = controls.querySelector('#simplePlayPauseBtn');
        const progressContainer = controls.querySelector('#simpleProgressContainer');
        const progressFilled = controls.querySelector('#simpleProgressFilled');
        const timeDisplay = controls.querySelector('#simpleTimeDisplay');
        const volumeBtn = controls.querySelector('#simpleVolumeBtn');

        // Play/Pause
        playPauseBtn?.addEventListener('click', () => {
            this.toggleVideoPlayback();
        });

        video.addEventListener('click', () => {
            this.toggleVideoPlayback();
        });

        video.addEventListener('play', () => {
            if (playPauseBtn) playPauseBtn.textContent = '⏸️';
        });

        video.addEventListener('pause', () => {
            if (playPauseBtn) playPauseBtn.textContent = '▶️';
        });

        // Progress bar
        video.addEventListener('timeupdate', () => {
            if (video.duration && progressFilled && timeDisplay) {
                const progress = (video.currentTime / video.duration) * 100;
                progressFilled.style.width = progress + '%';
                
                timeDisplay.textContent = `${this.formatTime(video.currentTime)} / ${this.formatTime(video.duration)}`;
            }
        });

        progressContainer?.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        });

        // Volume
        volumeBtn?.addEventListener('click', () => {
            video.muted = !video.muted;
            if (volumeBtn) volumeBtn.textContent = video.muted ? '🔇' : '🔊';
        });
    }

    toggleVideoPlayback() {
        if (!this.currentVideo) return;

        if (this.currentVideo.paused) {
            this.currentVideo.play();
        } else {
            this.currentVideo.pause();
        }
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    close() {
        const viewer = document.getElementById('simpleMediaViewer');
        if (!viewer) return;

        // Pausar y limpiar video si existe
        if (this.currentVideo) {
            this.currentVideo.pause();
            this.currentVideo = null;
        }

        // Ocultar viewer
        viewer.classList.remove('active');
        document.body.style.overflow = '';

        // Limpiar estado
        this.isVisible = false;
        this.currentMediaUrl = null;
        this.currentMediaType = null;

        // Limpiar contenido después de la animación
        setTimeout(() => {
            const mediaContainer = document.getElementById('simpleViewerMedia');
            if (mediaContainer) {
                mediaContainer.innerHTML = '';
            }
        }, 300);
    }
}

// ================================================
// INICIALIZACIÓN Y EXPOSICIÓN GLOBAL
// ================================================

// Instanciar el visualizador
const simpleMediaViewer = new SimpleMediaViewer();

// Exponer funciones globales para usar desde React
window.openSimpleMediaViewer = function(mediaUrl, mediaType) {
    simpleMediaViewer.open(mediaUrl, mediaType);
};

window.closeSimpleMediaViewer = function() {
    simpleMediaViewer.close();
};

console.log('✅ SimpleMediaViewer cargado y listo');