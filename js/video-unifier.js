/**
 * Unificador de comportamiento de videos
 * Aplica configuración consistente a todos los videos de la página
 */
class VideoUnifier {
    constructor(options = {}) {
        this.config = {
            autoMute: true,
            autoLoop: true,
            playsinline: true,
            preload: 'metadata',
            observeNewVideos: true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        // Configurar videos existentes
        this.configureExistingVideos();
        
        // Asegurar badges de silenciado
        this.ensureSilencedBadges();
        
        // Observar nuevos videos si está habilitado
        if (this.config.observeNewVideos) {
            this.observeNewVideos();
        }
        
        // Agregar estilos CSS si no existen
        this.addStyles();
    }
    
    configureExistingVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => this.configureVideo(video));
    }
    
    configureVideo(video) {
        // Determinar contexto basado en clases padre
        const context = this.getVideoContext(video);
        
        // Aplicar configuración base
        this.applyBaseConfig(video);
        
        // Aplicar configuración específica del contexto
        this.applyContextConfig(video, context);
        
        // Agregar event listeners
        this.addEventListeners(video, context);
        
        console.log(`Video configurado - Contexto: ${context}`, video);
    }
    
    getVideoContext(video) {
        const parent = video.closest('.content-card, .post-card, .card-media, .post-media');
        
        if (!parent) return 'default';
        
        if (parent.classList.contains('content-card') || parent.classList.contains('card-media')) {
            return 'card';
        }
        
        if (parent.classList.contains('post-card') || parent.classList.contains('post-media')) {
            return 'inicio';
        }
        
        return 'default';
    }
    
    applyBaseConfig(video) {
        // Configuración base para todos los videos
        video.setAttribute('preload', this.config.preload);
        video.setAttribute('playsinline', '');
        
        if (this.config.autoMute) {
            video.muted = true;
            video.setAttribute('muted', '');
        }
        
        if (this.config.autoLoop) {
            video.loop = true;
            video.setAttribute('loop', '');
        }
    }
    
    applyContextConfig(video, context) {
        switch (context) {
            case 'card':
                // Videos en cards: solo control de fullscreen, autoplay al hover
                video.setAttribute('controls', '');
                video.classList.add('card-video');
                if (!video.classList.contains('loaded')) {
                    video.classList.add('loaded');
                }
                break;
                
            case 'inicio': // CORREGIDO: era 'home', ahora es 'inicio'
                // Videos en inicio: con controles, sin autoplay
                video.setAttribute('controls', '');
                video.classList.add('post-video');
                if (!video.classList.contains('loaded')) {
                    video.classList.add('loaded');
                }
                break;
                
            default:
                // Configuración por defecto
                video.setAttribute('controls', '');
                break;
        }
    }
    
    addEventListeners(video, context) {
        // Remover listeners existentes para evitar duplicados
        video.removeEventListener('loadstart', this.handleLoadStart);
        video.removeEventListener('loadeddata', this.handleLoaded);
        video.removeEventListener('canplay', this.handleReady);
        video.removeEventListener('error', this.handleError);
        
        // Agregar nuevos listeners
        video.addEventListener('loadstart', (e) => this.handleLoadStart(e, context));
        video.addEventListener('loadeddata', (e) => this.handleLoaded(e, context));
        video.addEventListener('canplay', (e) => this.handleReady(e, context));
        video.addEventListener('error', (e) => this.handleError(e, context));
        
        // Listeners específicos por contexto
        if (context === 'card') {
            this.addCardVideoListeners(video);
        }
    }
    
    addCardVideoListeners(video) {
        const cardContent = video.closest('.card-content, .content-card');
        
        if (cardContent) {
            // Hover para reproducir/pausar en cards
            cardContent.addEventListener('mouseenter', () => {
                if (video.paused) {
                    video.play().catch(() => {
                        // Silenciar errores de autoplay
                    });
                }
            });
            
            cardContent.addEventListener('mouseleave', () => {
                if (!video.paused) {
                    video.pause();
                }
            });
            
            // Click para toggle play/pause
            cardContent.addEventListener('click', (e) => {
                // Solo si el click no es en otros elementos
                if (e.target === cardContent || e.target.closest('video')) {
                    e.stopPropagation();
                    video.paused ? video.play() : video.pause();
                }
            });
        }
    }
    
    handleLoadStart(event, context) {
        const video = event.target;
        console.log(`Video load start - Contexto: ${context}`, video);
        
        // Llamar función global si existe
        if (typeof handleVideoLoadStart === 'function') {
            const postId = this.getPostId(video);
            if (postId) handleVideoLoadStart(postId);
        }
    }
    
    handleLoaded(event, context) {
        const video = event.target;
        console.log(`Video loaded - Contexto: ${context}`, video);
        
        // Llamar función global si existe
        if (typeof handleVideoLoaded === 'function') {
            const postId = this.getPostId(video);
            if (postId) handleVideoLoaded(postId);
        }
    }
    
    handleReady(event, context) {
        const video = event.target;
        console.log(`Video ready - Contexto: ${context}`, video);
        
        // Llamar función global si existe
        if (typeof handleVideoReady === 'function') {
            const postId = this.getPostId(video);
            if (postId) handleVideoReady(postId);
        }
    }
    
    handleError(event, context) {
        const video = event.target;
        console.error(`Video error - Contexto: ${context}`, video);
        
        // Llamar función global si existe
        if (typeof handleVideoError === 'function') {
            const postId = this.getPostId(video);
            if (postId) handleVideoError(postId);
        }
    }
    
    getPostId(video) {
        const postElement = video.closest('[data-post-id], [data-video-id]');
        return postElement ? 
               (postElement.dataset.postId || postElement.dataset.videoId) : 
               null;
    }
    
    observeNewVideos() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Buscar videos en el nodo agregado
                        const videos = node.tagName === 'VIDEO' ? 
                                      [node] : 
                                      node.querySelectorAll('video');
                        
                        videos.forEach(video => this.configureVideo(video));
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('Observer de videos iniciado');
    }
    
    addStyles() {
        if (document.getElementById('video-unifier-styles')) return;
        
        const styles = `
            <style id="video-unifier-styles">
                .card-video, .post-video {
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                
                .card-video {
                    cursor: pointer;
                }
                
                .card-video:hover {
                    transform: scale(1.02);
                }
                
                /* Ocultar controles específicos en videos de tarjetas, mantener solo fullscreen */
                .card-video::-webkit-media-controls-panel {
                    background-color: transparent;
                }
                
                .card-video::-webkit-media-controls-play-button,
                .card-video::-webkit-media-controls-current-time-display,
                .card-video::-webkit-media-controls-time-remaining-display,
                .card-video::-webkit-media-controls-timeline,
                .card-video::-webkit-media-controls-volume-slider,
                .card-video::-webkit-media-controls-mute-button,
                .card-video::-webkit-media-controls-seek-back-button,
                .card-video::-webkit-media-controls-seek-forward-button {
                    display: none !important;
                }
                
                /* Mantener solo el botón de fullscreen visible */
                .card-video::-webkit-media-controls-fullscreen-button {
                    display: block !important;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: rgba(0, 0, 0, 0.7);
                    border-radius: 4px;
                    padding: 5px;
                }
                
                /* Para Firefox */
                .card-video::-moz-media-controls {
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .card-video:hover::-moz-media-controls {
                    opacity: 1;
                }
                
                .card-video::-moz-media-controls > *:not([class*="fullscreen"]) {
                    display: none !important;
                }
                
                .post-video {
                    outline: none;
                }
                
                .video-loading {
                    opacity: 0.7;
                    filter: blur(1px);
                }
                
                .video-loaded {
                    opacity: 1;
                    filter: none;
                }
                
                .video-error {
                    background: #333;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Método público para reconfigurar un video específico
    reconfigureVideo(video) {
        if (video && video.tagName === 'VIDEO') {
            this.configureVideo(video);
        }
    }
    
    // Método público para reconfigurar todos los videos
    reconfigureAllVideos() {
        this.configureExistingVideos();
    }
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.videoUnifier = new VideoUnifier({
        autoMute: true,
        autoLoop: true,
        playsinline: true,
        preload: 'metadata',
        observeNewVideos: true
    });
});

// Inicializar inmediatamente si el DOM ya está listo
if (document.readyState === 'loading') {
    // DOM aún cargando, esperar DOMContentLoaded
} else {
    // DOM ya está listo
    window.videoUnifier = new VideoUnifier({
        autoMute: true,
        autoLoop: true,
        playsinline: true,
        preload: 'metadata',
        observeNewVideos: true
    });
}