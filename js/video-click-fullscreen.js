/**
 * VIDEO CLICK TO FULLSCREEN - SCRIPT INDEPENDIENTE
 * Archivo: video-click-fullscreen.js
 * 
 * Intercepta clicks en videos para abrir fullscreen viewer
 * Sin modificar código existente
 */

(function() {
    'use strict';
    
    let isInitialized = false;
    let originalClickHandlers = new Map();
    
    /**
     * Configuración del script
     */
    const CONFIG = {
        videoSelector: '.video-container-custom video',
        postCardSelector: '.post-card',
        controlsSelector: '.custom-video-controls',
        buttonSelectors: {
            playPause: '.play-pause-btn',
            volume: '.volume-btn', 
            fullscreen: '.fullscreen-btn'
        },
        debugMode: false
    };
    
    /**
     * Función principal de inicialización
     */
    function initVideoClickToFullscreen() {
        if (isInitialized) {
            log('Ya está inicializado');
            return;
        }
        
        log('Iniciando interceptor de clicks en video...');
        
        // Esperar a que el fullscreen viewer esté disponible
        waitForFullscreenViewer(() => {
            setupVideoClickInterceptor();
            setupControlsClickHandlers();
            isInitialized = true;
            log('Interceptor de video inicializado correctamente');
        });
    }
    
    /**
     * Esperar a que el fullscreen viewer esté disponible
     */
    function waitForFullscreenViewer(callback, attempts = 0) {
        const maxAttempts = 50; // 5 segundos máximo
        
        if (window.fullscreenViewer && typeof window.fullscreenViewer.openViewer === 'function') {
            log('Fullscreen viewer detectado');
            callback();
            return;
        }
        
        if (attempts >= maxAttempts) {
            warn('Fullscreen viewer no encontrado después de 5 segundos. Funcionará sin él.');
            callback();
            return;
        }
        
        setTimeout(() => {
            waitForFullscreenViewer(callback, attempts + 1);
        }, 100);
    }
    
    /**
     * Configurar interceptor principal de clicks en video
     */
    function setupVideoClickInterceptor() {
        // Usar captura para interceptar antes que otros handlers
        document.addEventListener('click', handleVideoClick, true);
        log('Interceptor de clicks configurado');
    }
    
    /**
     * Manejar clicks en videos
     */
    function handleVideoClick(event) {
        const video = event.target.closest(CONFIG.videoSelector);
        if (!video) return;
        
        const videoContainer = video.closest('.video-container-custom');
        const postCard = video.closest(CONFIG.postCardSelector);
        const isControlClick = event.target.closest(CONFIG.controlsSelector);
        
        // Si es click en controles, permitir comportamiento normal
        if (isControlClick) {
            log('Click en controles - permitiendo comportamiento normal');
            return;
        }
        
        // Si es click directo en video, abrir fullscreen
        log('Click en video detectado - abriendo fullscreen');
        
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        if (window.fullscreenViewer && postCard) {
            try {
                window.fullscreenViewer.openViewer(postCard);
                log('Fullscreen viewer abierto');
            } catch (error) {
                error('Error abriendo fullscreen viewer:', error);
                fallbackBehavior(videoContainer);
            }
        } else {
            warn('Fullscreen viewer no disponible - usando fallback');
            fallbackBehavior(videoContainer);
        }
    }
    
    /**
     * Configurar handlers específicos para botones de control
     */
    function setupControlsClickHandlers() {
        // Play/Pause
        document.addEventListener('click', function(event) {
            const btn = event.target.closest(CONFIG.buttonSelectors.playPause);
            if (btn) {
                event.stopPropagation();
                handlePlayPauseClick(btn);
            }
        });
        
        // Volume
        document.addEventListener('click', function(event) {
            const btn = event.target.closest(CONFIG.buttonSelectors.volume);
            if (btn) {
                event.stopPropagation();
                handleVolumeClick(btn);
            }
        });
        
        // Fullscreen - Redireccionar a viewer
        document.addEventListener('click', function(event) {
            const btn = event.target.closest(CONFIG.buttonSelectors.fullscreen);
            if (btn) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                handleFullscreenClick(btn);
            }
        });
        
        log('Handlers de controles configurados');
    }
    
    /**
     * Manejar click en play/pause
     */
    function handlePlayPauseClick(button) {
        const video = button.closest('.video-container-custom').querySelector('video');
        const playIcon = button.querySelector('.play-icon');
        const pauseIcon = button.querySelector('.pause-icon');
        
        if (video.paused) {
            video.play();
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
        } else {
            video.pause();
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
        
        log('Play/pause ejecutado');
    }
    
    /**
     * Manejar click en volumen
     */
    function handleVolumeClick(button) {
        const video = button.closest('.video-container-custom').querySelector('video');
        const volumeOnIcon = button.querySelector('.volume-on');
        const volumeOffIcon = button.querySelector('.volume-off');
        
        video.muted = !video.muted;
        
        if (video.muted) {
            if (volumeOnIcon) volumeOnIcon.style.display = 'none';
            if (volumeOffIcon) volumeOffIcon.style.display = 'block';
        } else {
            if (volumeOnIcon) volumeOnIcon.style.display = 'block';
            if (volumeOffIcon) volumeOffIcon.style.display = 'none';
        }
        
        log('Toggle volumen ejecutado');
    }
    
    /**
     * Manejar click en fullscreen - Redirigir a viewer
     */
    function handleFullscreenClick(button) {
        const postCard = button.closest(CONFIG.postCardSelector);
        
        if (window.fullscreenViewer && postCard) {
            try {
                window.fullscreenViewer.openViewer(postCard);
                log('Fullscreen viewer abierto desde botón');
            } catch (error) {
                error('Error abriendo fullscreen desde botón:', error);
                fallbackFullscreen(button);
            }
        } else {
            warn('Usando fullscreen nativo como fallback');
            fallbackFullscreen(button);
        }
    }
    
    /**
     * Comportamiento fallback si no hay fullscreen viewer
     */
    function fallbackBehavior(videoContainer) {
        if (typeof window.toggleVideoControls === 'function') {
            window.toggleVideoControls(videoContainer);
            log('Usando fallback: mostrar controles');
        } else {
            log('No hay fallback disponible');
        }
    }
    
    /**
     * Fullscreen nativo como fallback
     */
    function fallbackFullscreen(button) {
        const videoContainer = button.closest('.video-container-custom');
        
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
    }
    
    /**
     * Función para re-inicializar después de cargar contenido dinámico
     */
    function reinitialize() {
        log('Re-inicializando handlers...');
        // Como usamos event delegation, no necesitamos hacer nada especial
        // Pero podemos verificar que todo sigue funcionando
        verifyInitialization();
    }
    
    /**
     * Verificar que la inicialización fue exitosa
     */
    function verifyInitialization() {
        const videos = document.querySelectorAll(CONFIG.videoSelector);
        log(`Videos encontrados: ${videos.length}`);
        log(`Fullscreen viewer disponible: ${!!window.fullscreenViewer}`);
        return videos.length > 0;
    }
    
    /**
     * Funciones de debugging y logging
     */
    function log(...args) {
        if (CONFIG.debugMode) {
            console.log('[VideoClickFullscreen]', ...args);
        }
    }
    
    function warn(...args) {
        if (CONFIG.debugMode) {
            console.warn('[VideoClickFullscreen]', ...args);
        }
    }
    
    function error(...args) {
        console.error('[VideoClickFullscreen]', ...args);
    }
    
    /**
     * API pública del script
     */
    window.VideoClickFullscreen = {
        init: initVideoClickToFullscreen,
        reinit: reinitialize,
        verify: verifyInitialization,
        debug: function(enabled) {
            CONFIG.debugMode = enabled;
            log('Debug mode:', enabled ? 'activado' : 'desactivado');
        }
    };
    
    /**
     * Auto-inicialización
     */
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initVideoClickToFullscreen);
        } else {
            // Pequeño delay para asegurar que otros scripts se carguen
            setTimeout(initVideoClickToFullscreen, 100);
        }
    }
    
    // Inicializar automáticamente
    autoInit();
    
    log('Script video-click-fullscreen.js cargado');
    
})();

// Para debugging global (opcional)
// VideoClickFullscreen.debug(true);

/**
 * INSTRUCCIONES DE USO:
 * 
 * 1. Guardar este código como 'video-click-fullscreen.js'
 * 
 * 2. Incluir en tu HTML DESPUÉS de tus scripts existentes:
 *    <script src="path/to/video-click-fullscreen.js"></script>
 * 
 * 3. OPCIONAL - Para debugging:
 *    VideoClickFullscreen.debug(true);
 * 
 * 4. OPCIONAL - Re-inicializar después de cargar contenido dinámico:
 *    VideoClickFullscreen.reinit();
 * 
 * 5. OPCIONAL - Verificar funcionamiento:
 *    VideoClickFullscreen.verify();
 * 
 * El script funciona automáticamente sin modificar tu código existente.
 */