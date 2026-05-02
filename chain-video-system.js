// ============================================
// SISTEMA DE VIDEO PARA TARJETAS CHAIN - OPTIMIZADO Y CORREGIDO
// ============================================

let currentChainVideo = null;
let activeChainCard = null;
let chainVideoObserver = null;
let chainIntersectionObserver = null;

/**
 * Maneja el clic en tarjetas de eventos Chain (con o sin video)
 */
function handleChainCardClick(event, cardElement) {
    // Verificar si el clic fue en un elemento interactivo
    const clickedElement = event.target;
    const interactiveElements = [
        'button', 'a', 'input', 'select', 'textarea',
        '[role="button"]', '[tabindex]', '.clickable',
        '.btn', '.button', '.link', '.action'
    ];
    
    // Si el clic fue en un elemento interactivo, no procesar
    if (interactiveElements.some(selector => 
        clickedElement.matches?.(selector) || clickedElement.closest?.(selector)
    )) {
        return; // Permitir que el elemento interactivo maneje su clic
    }
    
    // Verificar si se hizo clic directamente en el video
    if (clickedElement.closest('video')) {
        return; // Dejar que el video maneje su propio clic
    }
    
    event.preventDefault();
    
    // Si se hace clic en la misma tarjeta activa, alternar play/pause
    if (activeChainCard === cardElement) {
        const video = cardElement.querySelector('video');
        if (video) {
            // CORREGIDO: Alternar entre play/pause en lugar de solo pausar
            if (video.paused) {
                // Video está pausado, reanudarlo
                playChainCardVideo(video, cardElement);
                console.log('Video reanudado en tarjeta activa');
            } else {
                // Video está reproduciéndose, pausarlo
                pauseChainVideo(video);
                currentChainVideo = null;
                console.log('Video pausado en tarjeta activa');
            }
        }
        return; // Mantener la tarjeta como activa
    }
    
    // Establecer como tarjeta activa
    setActiveChainCard(cardElement);
    
    // Buscar y reproducir video si existe
    const video = cardElement.querySelector('video');
    if (video) {
        playChainCardVideo(video, cardElement);
    }
}

/**
 * Establece una tarjeta como activa y quita el estado de las demás
 */
function setActiveChainCard(newActiveCard) {
    // Quitar estado activo de la tarjeta anterior
    if (activeChainCard && activeChainCard !== newActiveCard) {
        removeActiveChainCardState(activeChainCard);
        
        // Pausar video si la tarjeta anterior tenía video
        const previousVideo = activeChainCard.querySelector('video');
        if (previousVideo) {
            pauseChainVideo(previousVideo);
        }
    }
    
    // Establecer nueva tarjeta activa
    activeChainCard = newActiveCard;
    applyActiveChainCardState(newActiveCard);
}

/**
 * Aplica el estado visual activo a una tarjeta
 */
function applyActiveChainCardState(cardElement) {
    if (!cardElement) return;
    
    cardElement.style.transform = 'scale(1.02)';
    cardElement.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.3)';
    cardElement.style.transition = 'all 0.3s ease';
    cardElement.style.borderColor = 'rgba(99, 102, 241, 0.5)';
    cardElement.dataset.chainActive = 'true';
}

/**
 * Quita el estado visual activo de una tarjeta
 */
function removeActiveChainCardState(cardElement) {
    if (!cardElement) return;
    
    cardElement.style.transform = '';
    cardElement.style.boxShadow = '';
    cardElement.style.borderColor = '';
    cardElement.style.border = '';
    cardElement.style.transition = 'all 0.3s ease';
    delete cardElement.dataset.chainActive;
    
    // Forzar recálculo de estilo
    cardElement.offsetHeight;
}

/**
 * Reproduce el video de la tarjeta Chain
 */
function playChainCardVideo(video, cardElement) {
    try {
        // Pausar video chain activo anterior
        if (currentChainVideo && currentChainVideo !== video) {
            pauseChainVideo(currentChainVideo);
        }
        
        // Configurar el video actual
        currentChainVideo = video;
        
        // Configurar video para reproducción en tarjeta
        video.removeAttribute('controls');
        video.style.pointerEvents = 'auto';
        
        // Reproducir el video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video Chain reproduciendo correctamente');
            }).catch(error => {
                console.log('Error al reproducir video Chain:', error);
                // Mostrar controles si hay error de autoplay
                video.setAttribute('controls', 'controls');
            });
        }
        
    } catch (error) {
        console.error('Error en playChainCardVideo:', error);
        video.setAttribute('controls', 'controls');
    }
}

/**
 * Pausa un video específico con manejo robusto de errores
 */
function pauseChainVideo(video) {
    if (!video) {
        console.warn('pauseChainVideo: video es null o undefined');
        return;
    }
    
    try {
        if (typeof video.pause !== 'function') {
            console.warn('pauseChainVideo: elemento no es un video válido');
            return;
        }
        
        // Pausar solo si está reproduciéndose
        if (!video.paused) {
            video.pause();
            console.log('Video pausado exitosamente');
        }
        
        // Resetear posición si el video tiene duración
        if (video.duration && !isNaN(video.duration)) {
            video.currentTime = 0;
        }
        
        video.removeAttribute('controls');
        
    } catch (error) {
        console.error('Error pausando video:', error);
        try {
            if (video.pause) {
                video.pause();
            }
        } catch (fallbackError) {
            console.error('Error en fallback de pausa:', fallbackError);
        }
    }
}

/**
 * Maneja el clic directo en el video para abrir en pantalla completa
 */
/**
 * Maneja el clic directo en el video para abrir en visualizador principal
 */
function handleChainVideoClick(event, video) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🎬 Click en video Chain detectado');
    
    // PRIORIDAD 1: Usar FullscreenViewer si está disponible (página de inicio)
    if (window.fullscreenViewer) {
        console.log('✅ Usando FullscreenViewer');
        const chainCard = video.closest('.chain-event-card');
        if (chainCard) {
            window.fullscreenViewer.openViewer(chainCard);
            return;
        }
    }
    
    // PRIORIDAD 2: Usar ProfileMediaViewer si está disponible (página de perfil)
    if (window.profileMediaViewer) {
        console.log('✅ Usando ProfileMediaViewer');
        const chainCard = video.closest('.chain-event-card');
        const mediaContainer = video.closest('.card-media');
        if (chainCard && mediaContainer) {
            // Simular click en el contenedor de media para activar el visualizador
            mediaContainer.click();
            return;
        }
    }
    
    // FALLBACK: Si no hay visualizador disponible, usar fullscreen nativo
    console.log('⚠️ Usando fullscreen nativo (fallback)');
    
    // Prevenir ejecuciones duplicadas
    if (video.dataset.chainProcessing === 'true') {
        console.log('Video ya siendo procesado');
        return;
    }
    
    video.dataset.chainProcessing = 'true';
    
    setTimeout(() => {
        openChainVideoFullscreen(video);
        setTimeout(() => {
            delete video.dataset.chainProcessing;
        }, 1000);
    }, 10);
}

/**
 * Abre el video Chain en pantalla completa con controles nativos
 */
function openChainVideoFullscreen(video) {
    console.log('Abriendo video en fullscreen...');
    
    try {
        // VERIFICAR SI EL VIDEO ESTÁ SILENCIADO
        const cardMedia = video.closest('.card-media');
        const isSilenced = cardMedia && cardMedia.dataset.silenciado === 'true';
        
        const isAlreadyFullscreen = !!(
            document.fullscreenElement || 
            document.webkitFullscreenElement || 
            document.mozFullScreenElement || 
            document.msFullscreenElement
        );
        
        if (isAlreadyFullscreen) {
            console.log('Ya en fullscreen');
            return;
        }
        
        let isOurFullscreen = false;
        
        // Handler para salir de fullscreen
        const exitHandler = () => {
            const stillFullscreen = !!(
                document.fullscreenElement || 
                document.webkitFullscreenElement || 
                document.mozFullScreenElement || 
                document.msFullscreenElement
            );
            
            if (!stillFullscreen && isOurFullscreen) {
                console.log('Saliendo de fullscreen');
                isOurFullscreen = false;
                
                // CORREGIDO: Ocultar controles al salir de fullscreen
                video.removeAttribute('controls');
                
                // Pausar video al salir
                if (!video.paused) {
                    video.pause();
                    video.currentTime = 0;
                }
                currentChainVideo = null;
                
                // Limpiar listeners
                document.removeEventListener('fullscreenchange', exitHandler);
                document.removeEventListener('webkitfullscreenchange', exitHandler);
                document.removeEventListener('mozfullscreenchange', exitHandler);
                document.removeEventListener('MSFullscreenChange', exitHandler);
                
                console.log('Limpieza completa - controles ocultos');
            }
        };
        
        // Registrar listeners para salida de fullscreen
        document.addEventListener('fullscreenchange', exitHandler);
        document.addEventListener('webkitfullscreenchange', exitHandler);
        document.addEventListener('mozfullscreenchange', exitHandler);
        document.addEventListener('MSFullscreenChange', exitHandler);
        
        // Solicitar fullscreen
        const requestFS = () => {
            if (video.requestFullscreen) return video.requestFullscreen();
            if (video.webkitRequestFullscreen) return video.webkitRequestFullscreen();
            if (video.mozRequestFullScreen) return video.mozRequestFullScreen();
            if (video.msRequestFullscreen) return video.msRequestFullscreen();
            return Promise.reject('No fullscreen support');
        };
        
        requestFS().then(() => {
            console.log('Fullscreen activado');
            isOurFullscreen = true;
            
            // HABILITAR CONTROLES NATIVOS PERO PERSONALIZAR SEGÚN SILENCIADO
            video.setAttribute('controls', 'controls');
            
            // SI ESTÁ SILENCIADO, QUITAR EL CONTROL DE VOLUMEN
// SI ESTÁ SILENCIADO, ELIMINAR COMPLETAMENTE EL CONTROL DE VOLUMEN
if (isSilenced) {
    // Forzar muted y deshabilitar cambios de volumen
    video.muted = true;
    video.volume = 0;
    
    // Bloquear la propiedad volume
    Object.defineProperty(video, 'volume', {
        get: () => 0,
        set: () => {},
        configurable: false
    });
    
    Object.defineProperty(video, 'muted', {
        get: () => true,
        set: () => {},
        configurable: false
    });
    
    // Esperar a que los controles estén disponibles
    setTimeout(() => {
        // INYECTAR CSS PARA OCULTAR COMPLETAMENTE EL CONTROL DE VOLUMEN
        const styleId = 'chain-video-silenced-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* OCULTAR COMPLETAMENTE EL CONTROL DE VOLUMEN EN VIDEOS SILENCIADOS */
                .card-media[data-silenciado="true"] video[controls]::-webkit-media-controls-volume-slider,
                .card-media[data-silenciado="true"] video[controls]::-webkit-media-controls-mute-button,
                .card-media[data-silenciado="true"] video[controls] .vjs-volume-panel,
                .card-media[data-silenciado="true"] video[controls] .vjs-mute-control,
                .card-media[data-silenciado="true"] video[controls] [aria-label*="volume"],
                .card-media[data-silenciado="true"] video[controls] [aria-label*="Volume"],
                .card-media[data-silenciado="true"] video[controls] [aria-label*="sonido"],
                .card-media[data-silenciado="true"] video[controls] [aria-label*="Sonido"] {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                
                /* AJUSTAR EL ESPACIO DE LOS CONTROLES */
                .card-media[data-silenciado="true"] video[controls]::-webkit-media-controls-panel {
                    justify-content: flex-end !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // ELIMINAR FÍSICAMENTE LOS ELEMENTOS DEL DOM
        const volumeElements = video.parentElement.querySelectorAll(
            '.vjs-volume-panel, .vjs-mute-control, ' +
            '[aria-label*="volume"], [aria-label*="Volume"], ' +
            '[aria-label*="sonido"], [aria-label*="Sonido"]'
        );
        
        volumeElements.forEach(element => {
            element.remove();
        });
        
        // PREVENIR EVENTOS DE VOLUMEN
        video.addEventListener('volumechange', function(e) {
            e.preventDefault();
            e.stopPropagation();
            video.muted = true;
            video.volume = 0;
            return false;
        }, true);
        
        console.log('Control de volumen e icono de bocina completamente eliminados');
        
    }, 300);
}
            
            // Autoplay con delay
            setTimeout(() => {
                if (isOurFullscreen) {
                    video.currentTime = 0;
                    video.play().then(() => {
                        console.log('Autoplay exitoso');
                    }).catch(e => {
                        console.log('Error autoplay:', e);
                    });
                }
            }, 300);
            
        }).catch(error => {
            console.error('Error fullscreen:', error);
            video.setAttribute('controls', 'controls');
        });
        
    } catch (error) {
        console.error('Error general:', error);
        video.setAttribute('controls', 'controls');
    }
}

/**
 * Maneja clics fuera de las tarjetas activas
 */
function handleDocumentClick(event) {
    if (!activeChainCard) return;
    
    // Verificar si el clic fue dentro de la tarjeta activa
    const clickedInsideActiveCard = activeChainCard.contains(event.target);
    
    // Si el clic fue fuera de la tarjeta activa, desactivarla
    if (!clickedInsideActiveCard) {
        const video = activeChainCard.querySelector('video');
        if (video) {
            pauseChainVideo(video);
            currentChainVideo = null;
        }
        
        removeActiveChainCardState(activeChainCard);
        activeChainCard = null;
    }
}

/**
 * Pausa todos los videos Chain activos
 */
function pauseAllChainVideos() {
    const allChainVideos = document.querySelectorAll('.chain-event-card video');
    
    allChainVideos.forEach(video => {
        if (!video.closest(':fullscreen')) {
            pauseChainVideo(video);
        }
    });
    
    // Quitar estado activo de todas las tarjetas
    if (activeChainCard) {
        removeActiveChainCardState(activeChainCard);
        activeChainCard = null;
    }
    
    currentChainVideo = null;
}

/**
 * Crea observer para pausar videos que salen del viewport
 */
function createChainIntersectionObserver() {
    if (chainIntersectionObserver) {
        chainIntersectionObserver.disconnect();
    }
    
    const options = {
        root: null,
        rootMargin: '-10px',
        threshold: 0.5
    };

    chainIntersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            
            if (!video) return;
            
            // Si la tarjeta sale del viewport y el video está reproduciéndose
            if (!entry.isIntersecting && video === currentChainVideo && !video.paused) {
                pauseChainVideo(video);
                
                // Quitar estado activo de la tarjeta
                if (activeChainCard === entry.target) {
                    removeActiveChainCardState(activeChainCard);
                    activeChainCard = null;
                    currentChainVideo = null;
                }
            }
        });
    }, options);
    
    // Observar todas las tarjetas Chain con video
    const chainCardsWithVideo = document.querySelectorAll('.chain-event-card:has(video)');
    chainCardsWithVideo.forEach(card => {
        chainIntersectionObserver.observe(card);
    });
}

/**
 * Adjunta event listeners a las tarjetas Chain
 */
function attachChainVideoListeners() {
    const chainCards = document.querySelectorAll('.chain-event-card');
    
    chainCards.forEach(card => {
        if (!card.dataset.chainListenersAttached) {
            card.dataset.chainListenersAttached = 'true';
            
            // Event listener para clic en la tarjeta (sin capture para no interferir)
            card.addEventListener('click', (event) => {
                handleChainCardClick(event, card);
            });
            
            // Event listeners para video si existe
            const video = card.querySelector('video');
            if (video) {
                // Remover onclick conflictivo si existe
                const existingOnClick = video.getAttribute('onclick');
                if (existingOnClick && existingOnClick.includes('toggleVideoFullscreen')) {
                    console.log('Removiendo onclick conflictivo');
                    video.removeAttribute('onclick');
                }
                
                // Event listener para clic directo en el video
                video.addEventListener('click', (event) => {
                    handleChainVideoClick(event, video);
                });
                
                video.dataset.chainVideoManaged = 'true';
                video.style.pointerEvents = 'auto';
                
                // Observar la tarjeta con intersection observer
                if (chainIntersectionObserver) {
                    chainIntersectionObserver.observe(card);
                }
            }
        }
    });
}

/**
 * Crea un observer para detectar nuevas tarjetas Chain
 */
function createChainVideoObserver() {
    if (chainVideoObserver) {
        chainVideoObserver.disconnect();
    }
    
    chainVideoObserver = new MutationObserver((mutations) => {
        let hasNewChainCards = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList?.contains('chain-event-card') || 
                            node.querySelector?.('.chain-event-card')) {
                            hasNewChainCards = true;
                        }
                    }
                });
            }
        });
        
        if (hasNewChainCards) {
            setTimeout(() => {
                attachChainVideoListeners();
                createChainIntersectionObserver();
            }, 100);
        }
    });
    
    // Observar cambios en el contenedor principal
    const mainContainer = document.querySelector('.main-container, .center-feed, .feed-posts');
    if (mainContainer) {
        chainVideoObserver.observe(mainContainer, {
            childList: true,
            subtree: true
        });
    }
}

/**
 * Inicializa el sistema de video Chain
 */
function initializeChainVideoSystem() {
    console.log('Inicializando sistema de video Chain optimizado...');
    
    // Adjuntar listeners a tarjetas existentes
    attachChainVideoListeners();
    
    // Observer para nuevas tarjetas
    createChainVideoObserver();
    
    // Observer para viewport
    createChainIntersectionObserver();
    
    // Event listener global para clics fuera de tarjetas
    document.addEventListener('click', handleDocumentClick);
    
    // Pausar videos al cambiar de tab
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Tab oculto - pausando videos Chain');
            pauseAllChainVideos();
        }
    });
    
    console.log('Sistema de video Chain optimizado inicializado');
}

/**
 * Funciones de utilidad
 */
function isChainVideoPlaying() {
    return currentChainVideo && !currentChainVideo.paused;
}

function getCurrentChainVideo() {
    return currentChainVideo;
}

function getActiveChainCard() {
    return activeChainCard;
}

/**
 * Función para limpiar el sistema
 */
function resetChainVideoSystem() {
    pauseAllChainVideos();
    
    if (chainVideoObserver) {
        chainVideoObserver.disconnect();
        chainVideoObserver = null;
    }
    
    if (chainIntersectionObserver) {
        chainIntersectionObserver.disconnect();
        chainIntersectionObserver = null;
    }
    
    document.removeEventListener('click', handleDocumentClick);
    
    console.log('Sistema de video Chain reiniciado');
}

// Hacer funciones disponibles globalmente
window.handleChainCardClick = handleChainCardClick;
window.handleChainVideoClick = handleChainVideoClick;
window.openChainVideoFullscreen = openChainVideoFullscreen;
window.pauseAllChainVideos = pauseAllChainVideos;
window.initializeChainVideoSystem = initializeChainVideoSystem;
window.isChainVideoPlaying = isChainVideoPlaying;
window.getCurrentChainVideo = getCurrentChainVideo;
window.getActiveChainCard = getActiveChainCard;
window.resetChainVideoSystem = resetChainVideoSystem;

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChainVideoSystem);
} else {
    initializeChainVideoSystem();
}

console.log('Sistema de video Chain optimizado y corregido cargado');