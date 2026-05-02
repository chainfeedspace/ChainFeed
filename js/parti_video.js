// ============================================
// SISTEMA DE VIDEO PARA PARTICIPACIONES - COMPLETO E INTEGRADO
// ============================================

// Variables globales para el sistema de participaciones
let currentParticipationVideo = null;
let activeParticipationCard = null;
let participationVideoObserver = null;
let participationIntersectionObserver = null;

/**
 * Inicializa el sistema de videos para participaciones
 * Integra funcionalidades de silenciado, play y selección de tarjeta
 */
function initializeParticipationVideoSystem() {
    console.log('🎥 Inicializando sistema de video para participaciones...');
    
    // Aplicar configuración a videos de participación existentes
    markExistingParticipationVideos();
    
    // Adjuntar listeners a tarjetas existentes
    attachParticipationVideoListeners();
    
    // Crear observers
    createParticipationObserver();
    createParticipationIntersectionObserver();
    
    // Inyectar CSS para videos silenciados
    injectParticipationVideoStyles();
    
    // Event listener global para clics fuera de tarjetas
    document.addEventListener('click', handleParticipationDocumentClick);
    
    // Pausar videos al cambiar de tab
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Tab oculto - pausando videos de participación');
            pauseAllParticipationVideos();
        }
    });
    
    console.log('✅ Sistema de video para participaciones inicializado');
}

/**
 * Inyecta los estilos CSS para ocultar controles de volumen en participaciones
 */
function injectParticipationVideoStyles() {
    const styleId = 'participation-video-global-styles';
    if (document.getElementById(styleId)) {
        return; // Ya se inyectó
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* ESTILOS PARA VIDEOS SILENCIADOS DE PARTICIPACIÓN - ESTRUCTURA REAL */
        .card-media[data-silenciado="true"] video[controls]::-webkit-media-controls-volume-slider,
        .card-media[data-silenciado="true"] video[controls]::-webkit-media-controls-mute-button,
        .card-media[data-silenciado="true"] video[controls] .vjs-volume-panel,
        .card-media[data-silenciado="true"] video[controls] .vjs-mute-control,
        .card-media[data-silenciado="true"] video[controls] [aria-label*="volume"],
        .card-media[data-silenciado="true"] video[controls] [aria-label*="Volume"],
        .card-media[data-silenciado="true"] video[controls] [aria-label*="sonido"],
        .card-media[data-silenciado="true"] video[controls] [aria-label*="Sonido"],
        .card-media[data-silenciado="true"] video[controls] [aria-label*="Mute"],
        .card-media[data-silenciado="true"] video[controls] [aria-label*="mute"],
        .submission-item video[controls]::-webkit-media-controls-volume-slider,
        .submission-item video[controls]::-webkit-media-controls-mute-button,
        .submission-media video[controls]::-webkit-media-controls-volume-slider,
        .submission-media video[controls]::-webkit-media-controls-mute-button,
        video[data-participation-video="true"]::-webkit-media-controls-volume-slider,
        video[data-participation-video="true"]::-webkit-media-controls-mute-button,
        video[data-participation-video="true"] .vjs-volume-panel,
        video[data-participation-video="true"] .vjs-mute-control,
        video[data-participation-video="true"] [aria-label*="volume"],
        video[data-participation-video="true"] [aria-label*="Volume"],
        video[data-participation-video="true"] [aria-label*="sonido"],
        video[data-participation-video="true"] [aria-label*="Sonido"],
        video[data-participation-video="true"] [aria-label*="Mute"],
        video[data-participation-video="true"] [aria-label*="mute"] {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }
        
        /* AJUSTAR ESPACIO EN LOS CONTROLES */
        .card-media[data-silenciado="true"] video[controls]::-webkit-media-controls-panel,
        .submission-item video[controls]::-webkit-media-controls-panel,
        .submission-media video[controls]::-webkit-media-controls-panel,
        video[data-participation-video="true"]::-webkit-media-controls-panel {
            justify-content: flex-end !important;
            padding-right: 10px !important;
        }
        
        /* OCULTAR TAMBIÉN EN FIREFOX */
        .card-media[data-silenciado="true"] video[controls]::-moz-media-controls-volume-slider,
        .submission-item video[controls]::-moz-media-controls-volume-slider,
        .submission-media video[controls]::-moz-media-controls-volume-slider,
        video[data-participation-video="true"]::-moz-media-controls-volume-slider {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    console.log('📝 Estilos CSS para participaciones aplicados');
}

/**
 * Configura videos de participación existentes
 */
function markExistingParticipationVideos() {
    // BUSCAR EN LA ESTRUCTURA REAL: .submission-item > .submission-media > .card-media > .card-video
    const participationVideos = document.querySelectorAll(
        '.submission-item .card-media[data-silenciado="true"] video, ' +
        '.submission-item video, ' + 
        '.submission-media video, ' +
        '.participation-card video, ' + 
        '.participation-item video'
    );
    
    console.log(`🔍 Encontrados ${participationVideos.length} videos de participación`);
    
    participationVideos.forEach((video, index) => {
        console.log(`🎬 Configurando video de participación ${index + 1}:`, video);
        
        // Marcar como video de participación
        video.dataset.participationVideo = 'true';
        
        // Forzar silenciado
        video.muted = true;
        video.volume = 0;
        
        // Bloquear propiedades de volumen de forma inmutable
        try {
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
        } catch (error) {
            console.log('No se pudieron bloquear propiedades (ya bloqueadas):', error.message);
        }
        
        // Prevenir eventos de volumen
        video.addEventListener('volumechange', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.muted = true;
            this.volume = 0;
            return false;
        }, { capture: true, passive: false });
        
        console.log(`✅ Video ${index + 1} configurado como silenciado`);
    });
}

/**
 * Adjunta event listeners a las tarjetas de participación
 */
function attachParticipationVideoListeners() {
    // BUSCAR EN LA ESTRUCTURA REAL DEL HTML
    const participationCards = document.querySelectorAll('.submission-item, .participation-card, .participation-item');
    
    participationCards.forEach(card => {
        if (!card.dataset.participationListenersAttached) {
            card.dataset.participationListenersAttached = 'true';
            
            // Event listener para clic en la tarjeta
            card.addEventListener('click', (event) => {
                handleParticipationCardClick(event, card);
            });
            
            // Event listeners para video si existe (buscar en submission-media también)
            const video = card.querySelector('video') || 
                         card.querySelector('.submission-media video') ||
                         card.querySelector('.card-media video');
            
            if (video) {
                console.log('🎥 Configurando video de participación:', video);
                
                // Marcar como video de participación
                video.dataset.participationVideo = 'true';
                
                // Remover onclick conflictivo si existe
                const existingOnClick = video.getAttribute('onclick');
                if (existingOnClick) {
                    console.log('Removiendo onclick conflictivo en video de participación');
                    video.removeAttribute('onclick');
                }
                
                // Event listener para clic directo en el video
                video.addEventListener('click', (event) => {
                    handleParticipationVideoClick(event, video);
                });
                
                // FORZAR SILENCIADO INMEDIATAMENTE
                video.muted = true;
                video.volume = 0;
                
                // BLOQUEAR PROPIEDADES DE VOLUMEN
                try {
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
                } catch (error) {
                    console.log('Propiedades ya bloqueadas');
                }
                
                video.dataset.participationVideoManaged = 'true';
                video.style.pointerEvents = 'auto';
                
                // Observar la tarjeta con intersection observer
                if (participationIntersectionObserver) {
                    participationIntersectionObserver.observe(card);
                }
            }
        }
    });
}

/**
 * Maneja el clic en tarjetas de participación (con o sin video)
 */
function handleParticipationCardClick(event, cardElement) {
    // Verificar si el clic fue en un elemento interactivo
    const clickedElement = event.target;
    const interactiveElements = [
        'button', 'a', 'input', 'select', 'textarea',
        '[role="button"]', '[tabindex]', '.clickable',
        '.btn', '.button', '.link', '.action',
        '.participation-like-btn', '.participation-menu-btn'
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
    if (activeParticipationCard === cardElement) {
        const video = cardElement.querySelector('video') ||
                     cardElement.querySelector('.submission-media video') ||
                     cardElement.querySelector('.card-media video');
        if (video) {
            if (video.paused) {
                playParticipationVideo(video, cardElement);
                console.log('Video de participación reanudado en tarjeta activa');
            } else {
                pauseParticipationVideo(video);
                currentParticipationVideo = null;
                console.log('Video de participación pausado en tarjeta activa');
            }
        }
        return; // Mantener la tarjeta como activa
    }
    
    // Establecer como tarjeta activa
    setActiveParticipationCard(cardElement);
    
    // Buscar y reproducir video si existe
    const video = cardElement.querySelector('video') ||
                 cardElement.querySelector('.submission-media video') ||
                 cardElement.querySelector('.card-media video');
    if (video) {
        playParticipationVideo(video, cardElement);
    }
}

/**
 * Establece una tarjeta de participación como activa
 */
function setActiveParticipationCard(newActiveCard) {
    // Quitar estado activo de la tarjeta anterior
    if (activeParticipationCard && activeParticipationCard !== newActiveCard) {
        removeActiveParticipationCardState(activeParticipationCard);
        
        // Pausar video si la tarjeta anterior tenía video
        const previousVideo = activeParticipationCard.querySelector('video') ||
                             activeParticipationCard.querySelector('.submission-media video') ||
                             activeParticipationCard.querySelector('.card-media video');
        if (previousVideo) {
            pauseParticipationVideo(previousVideo);
        }
    }
    
    // Establecer nueva tarjeta activa
    activeParticipationCard = newActiveCard;
    applyActiveParticipationCardState(newActiveCard);
}

/**
 * Aplica el estado visual activo a una tarjeta de participación
 */
function applyActiveParticipationCardState(cardElement) {
    if (!cardElement) return;
    
    cardElement.style.transform = 'scale(1.02)';
    cardElement.style.boxShadow = '0 10px 30px rgba(34, 197, 94, 0.3)';
    cardElement.style.transition = 'all 0.3s ease';
    cardElement.style.borderColor = 'rgba(34, 197, 94, 0.5)';
    cardElement.dataset.participationActive = 'true';
}

/**
 * Quita el estado visual activo de una tarjeta de participación
 */
function removeActiveParticipationCardState(cardElement) {
    if (!cardElement) return;
    
    cardElement.style.transform = '';
    cardElement.style.boxShadow = '';
    cardElement.style.borderColor = '';
    cardElement.style.border = '';
    cardElement.style.transition = 'all 0.3s ease';
    delete cardElement.dataset.participationActive;
    
    // Forzar recálculo de estilo
    cardElement.offsetHeight;
}

/**
 * Reproduce el video de la participación
 */
function playParticipationVideo(video, cardElement) {
    try {
        // Pausar video de participación activo anterior
        if (currentParticipationVideo && currentParticipationVideo !== video) {
            pauseParticipationVideo(currentParticipationVideo);
        }
        
        // Configurar el video actual
        currentParticipationVideo = video;
        
        // Configurar video para reproducción en tarjeta
        video.removeAttribute('controls');
        video.style.pointerEvents = 'auto';
        
        // Los videos de participación siempre están silenciados
        video.muted = true;
        video.volume = 0;
        
        // Reproducir el video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video de participación reproduciendo correctamente');
            }).catch(error => {
                console.log('Error al reproducir video de participación:', error);
                // Mostrar controles si hay error de autoplay
                video.setAttribute('controls', 'controls');
            });
        }
        
    } catch (error) {
        console.error('Error en playParticipationVideo:', error);
        video.setAttribute('controls', 'controls');
    }
}

function handleParticipationVideoClick(event, video) {
    event.preventDefault();
    event.stopPropagation();
    
    // NUEVO: Detectar si estamos en el modal de participaciones
    const submissionsModal = document.getElementById('submissionsModal');
    const isInSubmissionsModal = submissionsModal && submissionsModal.classList.contains('active');
    
    if (isInSubmissionsModal) {
        // Si estamos en el modal de participaciones, usar el viewer especial
        console.log('🎯 En modal de participaciones, usando participantesFullscreenViewer');
        
        const submissionItem = video.closest('.submission-item');
        if (submissionItem && window.participantesFullscreenViewer) {
            window.participantesFullscreenViewer.openViewer(submissionItem);
            return; // IMPORTANTE: salir aquí
        }
    }
    
    // Verificar si ya estamos en fullscreen
    const isCurrentlyFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
    );
    
    if (isCurrentlyFullscreen) {
        // Control de play/pause en fullscreen
        if (video.paused) {
            video.play().catch(err => console.log('Error playing:', err));
            console.log('Video de participación reanudado en fullscreen');
        } else {
            video.pause();
            console.log('Video de participación pausado en fullscreen');
        }
        return;
    }
    
    // Usar la función integrada openVideoFullscreen
    const mediaContainer = video.closest('.card-media') || 
                           video.closest('.submission-media') ||
                           video.parentElement;
    
    if (mediaContainer) {
        openVideoFullscreen(mediaContainer, event);
    }
}

/**
 * Maneja clics fuera de las tarjetas de participación activas
 */
function handleParticipationDocumentClick(event) {
    if (!activeParticipationCard) return;
    
    // Verificar si el clic fue dentro de la tarjeta activa
    const clickedInsideActiveCard = activeParticipationCard.contains(event.target);
    
    // Si el clic fue fuera de la tarjeta activa, desactivarla
    if (!clickedInsideActiveCard) {
        const video = activeParticipationCard.querySelector('video') ||
                     activeParticipationCard.querySelector('.submission-media video') ||
                     activeParticipationCard.querySelector('.card-media video');
        if (video) {
            pauseParticipationVideo(video);
            currentParticipationVideo = null;
        }
        
        removeActiveParticipationCardState(activeParticipationCard);
        activeParticipationCard = null;
    }
}

/**
 * Pausa un video de participación específico
 */
function pauseParticipationVideo(video) {
    if (!video || typeof video.pause !== 'function') {
        return;
    }
    
    try {
        if (!video.paused) {
            video.pause();
            video.currentTime = 0;
            console.log('⏸️ Video de participación pausado');
        }
        
        video.removeAttribute('controls');
        
        if (currentParticipationVideo === video) {
            currentParticipationVideo = null;
        }
    } catch (error) {
        console.error('Error pausando video de participación:', error);
    }
}

/**
 * Pausa todos los videos de participación activos
 */
function pauseAllParticipationVideos() {
    const allParticipationVideos = document.querySelectorAll(
        '.submission-item .card-media[data-silenciado="true"] video[data-participation-video="true"], ' +
        '.submission-item video[data-participation-video="true"], ' + 
        '.submission-media video[data-participation-video="true"], ' +
        '.participation-card video[data-participation-video="true"], ' + 
        '.participation-item video[data-participation-video="true"]'
    );
    
    allParticipationVideos.forEach(video => {
        // No pausar si está en fullscreen
        if (!video.closest(':fullscreen')) {
            pauseParticipationVideo(video);
        }
    });
    
    // Quitar estado activo de todas las tarjetas
    if (activeParticipationCard) {
        removeActiveParticipationCardState(activeParticipationCard);
        activeParticipationCard = null;
    }
    
    currentParticipationVideo = null;
    console.log(`⏸️ Pausados ${allParticipationVideos.length} videos de participación`);
}

/**
 * Crea observer para detectar nuevas participaciones
 */
function createParticipationObserver() {
    if (participationVideoObserver) {
        participationVideoObserver.disconnect();
    }
    
    participationVideoObserver = new MutationObserver((mutations) => {
        let hasNewParticipations = false;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Detectar nuevas participaciones
                    if (node.classList?.contains('submission-item') ||
                        node.classList?.contains('submission-media') ||
                        node.classList?.contains('participation-card') ||
                        node.classList?.contains('participation-item') ||
                        node.querySelector?.('.submission-item') ||
                        node.querySelector?.('.submission-media') ||
                        node.querySelector?.('.participation-card') ||
                        node.querySelector?.('.participation-item')) {
                        hasNewParticipations = true;
                        console.log('🆕 Nueva participación detectada');
                    }
                }
            });
        });
        
        if (hasNewParticipations) {
            setTimeout(() => {
                markExistingParticipationVideos();
                attachParticipationVideoListeners();
                createParticipationIntersectionObserver();
            }, 100);
        }
    });
    
    // Observar contenedores donde pueden aparecer participaciones
    const containers = document.querySelectorAll(
        '.submissions-content, .submissions-modal, .participate-modal, ' +
        '.main-container, .center-feed, .feed-posts, ' +
        '.participations-container, .event-participations'
    );
    
    containers.forEach(container => {
        if (container) {
            participationVideoObserver.observe(container, {
                childList: true,
                subtree: true
            });
        }
    });
    
    console.log(`👀 Observer creado para ${containers.length} contenedores`);
}

/**
 * Crea intersection observer para pausar videos que salen del viewport
 */
function createParticipationIntersectionObserver() {
    if (participationIntersectionObserver) {
        participationIntersectionObserver.disconnect();
    }
    
    const options = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.3
    };

    participationIntersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.card-media[data-silenciado="true"] video') ||
                         entry.target.querySelector('video') || 
                         entry.target.querySelector('.submission-media video');
            
            if (!video || video.dataset.participationVideo !== 'true') return;
            
            if (!entry.isIntersecting && !video.paused) {
                console.log('📺 Video de participación salió del viewport, pausando');
                pauseParticipationVideo(video);
                
                // Quitar estado activo de la tarjeta
                if (activeParticipationCard === entry.target) {
                    removeActiveParticipationCardState(activeParticipationCard);
                    activeParticipationCard = null;
                    currentParticipationVideo = null;
                }
            }
        });
    }, options);
    
    // Observar todas las participaciones con video
    const participationCards = document.querySelectorAll(
        '.submission-item:has(.card-media[data-silenciado="true"] video), ' +
        '.submission-item:has(video), ' +
        '.submission-item:has(.submission-media video), ' +
        '.participation-card:has(video), ' +
        '.participation-item:has(video)'
    );
    
    participationCards.forEach(card => {
        participationIntersectionObserver.observe(card);
    });
    
    console.log(`👁️ Observando ${participationCards.length} participaciones con video`);
}

/**
 * EXTENSIÓN DE LA FUNCIÓN openVideoFullscreen EXISTENTE
 * Esta función se integra con la función original para manejar videos silenciados
 */

// Guardar referencia a la función original si existe
const originalOpenVideoFullscreen = window.openVideoFullscreen;

/**
 * Función mejorada que extiende openVideoFullscreen para manejar participaciones silenciadas
 */
function openVideoFullscreen(mediaContainer, event) {
    console.log('🎬 openVideoFullscreen llamada para:', mediaContainer);
    
    if (event) {
        event.stopPropagation();
    }
    
    const video = mediaContainer.querySelector('.card-video') || 
                 mediaContainer.querySelector('video');
    
    if (!video) {
        console.log('❌ No se encontró video en el contenedor');
        return;
    }
    
    // DETECTAR SI ES UN VIDEO DE PARTICIPACIÓN SILENCIADO
    const isParticipationVideo = video.dataset.participationVideo === 'true';
    const isSilenced = mediaContainer.dataset.silenciado === 'true';
    const isParticipationSilenced = isParticipationVideo && isSilenced;
    
    console.log('🔍 Video info:', {
        isParticipation: isParticipationVideo,
        isSilenced: isSilenced,
        isParticipationSilenced: isParticipationSilenced
    });
    
    // Verificar si ya estamos en fullscreen
    const isAlreadyFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
    );
    
    if (isAlreadyFullscreen) {
        // Si ya estamos en fullscreen, toggle play/pause
        if (video.paused) {
            video.play().catch(err => console.log('Error playing:', err));
            console.log('▶️ Video reanudado en fullscreen');
        } else {
            video.pause();
            console.log('⏸️ Video pausado en fullscreen');
        }
        return;
    }
    
    // Prevenir ejecuciones duplicadas
    if (video.dataset.processingFullscreen === 'true') {
        console.log('⚠️ Video ya siendo procesado, ignorando');
        return;
    }
    
    video.dataset.processingFullscreen = 'true';
    
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
            console.log('🚪 Saliendo de fullscreen');
            isOurFullscreen = false;
            
            // Limpiar controles
            video.removeAttribute('controls');
            
            // Pausar y resetear
            if (!video.paused) {
                video.pause();
                video.currentTime = 0;
            }
            
            // Limpiar listeners
            document.removeEventListener('fullscreenchange', exitHandler);
            document.removeEventListener('webkitfullscreenchange', exitHandler);
            document.removeEventListener('mozfullscreenchange', exitHandler);
            document.removeEventListener('MSFullscreenChange', exitHandler);
            
            delete video.dataset.processingFullscreen;
            currentParticipationVideo = null;
            
            console.log('✅ Limpieza de fullscreen completada');
        }
    };
    
    // Registrar listeners
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);
    
    // Función para solicitar fullscreen
    const requestFS = () => {
        if (video.requestFullscreen) return video.requestFullscreen();
        if (video.webkitRequestFullscreen) return video.webkitRequestFullscreen();
        if (video.mozRequestFullScreen) return video.mozRequestFullScreen();
        if (video.msRequestFullscreen) return video.msRequestFullscreen();
        return Promise.reject('No fullscreen support');
    };
    
    // Solicitar fullscreen
    requestFS().then(() => {
        console.log('🖥️ Fullscreen activado');
        isOurFullscreen = true;
        currentParticipationVideo = video;
        
        // Habilitar controles
        video.setAttribute('controls', 'controls');
        
        // APLICAR LÓGICA DE SILENCIADO PARA PARTICIPACIONES
        if (isParticipationSilenced || isParticipationVideo) {
            console.log('🔇 Aplicando configuración de silenciado');
            
            // Forzar silenciado
            video.muted = true;
            video.volume = 0;
            
            // Bloquear propiedades
            try {
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
            } catch (e) {
                console.log('Propiedades ya bloqueadas');
            }
            
            // Eliminar elementos de volumen físicamente
            setTimeout(() => {
                const volumeElements = document.querySelectorAll(
                    '.vjs-volume-panel, .vjs-mute-control, ' +
                    '[aria-label*="volume"], [aria-label*="Volume"], ' +
                    '[aria-label*="sonido"], [aria-label*="Sonido"]'
                );
                
                volumeElements.forEach(element => {
                    if (element.closest('video') === video) {
                        element.remove();
                    }
                });
                
                console.log('🗑️ Elementos de volumen eliminados');
            }, 300);
            
            // Prevenir eventos de volumen
            video.addEventListener('volumechange', function(e) {
                e.preventDefault();
                e.stopPropagation();
                video.muted = true;
                video.volume = 0;
                return false;
            }, true);
        }
        
        // Autoplay
        setTimeout(() => {
            if (isOurFullscreen) {
                video.currentTime = 0;
                video.play().then(() => {
                    console.log('▶️ Autoplay exitoso');
                }).catch(e => {
                    console.log('❌ Error en autoplay:', e);
                });
            }
        }, 300);
        
        // Limpiar flag después de un tiempo
        setTimeout(() => {
            delete video.dataset.processingFullscreen;
        }, 1000);
        
    }).catch(error => {
        console.error('❌ Error al solicitar fullscreen:', error);
        video.setAttribute('controls', 'controls');
        delete video.dataset.processingFullscreen;
    });
}

/**
 * Funciones de utilidad
 */
function isParticipationVideoPlaying() {
    return currentParticipationVideo && !currentParticipationVideo.paused;
}

function getCurrentParticipationVideo() {
    return currentParticipationVideo;
}

function getActiveParticipationCard() {
    return activeParticipationCard;
}

/**
 * Limpia el sistema
 */
function resetParticipationVideoSystem() {
    pauseAllParticipationVideos();
    
    if (participationVideoObserver) {
        participationVideoObserver.disconnect();
        participationVideoObserver = null;
    }
    
    if (participationIntersectionObserver) {
        participationIntersectionObserver.disconnect();
        participationIntersectionObserver = null;
    }
    
    document.removeEventListener('click', handleParticipationDocumentClick);
    
    console.log('🔄 Sistema de video para participaciones reiniciado');
}

// Hacer funciones disponibles globalmente
window.openVideoFullscreen = openVideoFullscreen;
window.handleParticipationCardClick = handleParticipationCardClick;
window.handleParticipationVideoClick = handleParticipationVideoClick;
window.pauseAllParticipationVideos = pauseAllParticipationVideos;
window.initializeParticipationVideoSystem = initializeParticipationVideoSystem;
window.isParticipationVideoPlaying = isParticipationVideoPlaying;
window.getCurrentParticipationVideo = getCurrentParticipationVideo;
window.getActiveParticipationCard = getActiveParticipationCard;
window.resetParticipationVideoSystem = resetParticipationVideoSystem;

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeParticipationVideoSystem);
} else {
    initializeParticipationVideoSystem();
}

console.log('✅ Sistema de video para participaciones (completo e integrado) cargado');