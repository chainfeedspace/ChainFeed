/**
 * SCROLL_PERFIL.JS
 * Sistema de navegación vertical tipo Reels/TikTok para ProfileMediaViewer
 * Optimizado para desktop (scroll) y móvil (swipe)
 */

console.log('📜 Cargando scroll_perfil.js...');

// ============================================
// FUNCIONES DE MEJORA
// ============================================

// ============================================
// INTEGRACIÓN CON PROFILEMEDIAVIEWER
// ============================================

// Esperar a que ProfileMediaViewer esté disponible
function initializeScrollSystem() {
    console.log('🔍 Buscando ProfileMediaViewer...');
    
    // Verificar si la instancia global ya existe
    if (window.profileMediaViewer) {
        console.log('✅ Instancia encontrada, mejorando navegación...');
        enhanceViewer(window.profileMediaViewer);
    } else {
        // Esperar a que se cree
        console.log('⏳ Esperando creación de ProfileMediaViewer...');
        
        // Interceptar la creación
        Object.defineProperty(window, 'profileMediaViewer', {
            set: function(value) {
                console.log('✅ ProfileMediaViewer detectado, mejorando...');
                this._profileMediaViewer = value;
                enhanceViewer(value);
            },
            get: function() {
                return this._profileMediaViewer;
            },
            configurable: true
        });
    }
}

// Mejorar el viewer existente
function enhanceViewer(viewer) {
    if (viewer._scrollEnhanced) {
        console.log('⚠️ Ya está mejorado');
        return;
    }
    
    console.log('🎬 Mejorando ProfileMediaViewer con navegación optimizada...');
    console.log('📊 Estado actual del viewer:', {
        isActive: viewer.isActive,
        availablePosts: viewer.availablePosts?.length || 0,
        currentIndex: viewer.currentPostIndex
    });
    
    // Marcar como mejorado
    viewer._scrollEnhanced = true;
    
    // CRÍTICO: Guardar referencia al método original
    const originalNavigateToPost = viewer.navigateToPost;
    
    // Sobrescribir el método navigateToPost
    viewer.navigateToPost = function(direction) {
        console.log(`🎯 SCROLL DETECTADO - Navegando: ${direction}`);
        console.log('📍 Posición actual:', this.currentPostIndex, '/', this.availablePosts.length);
        
        // 1. Ocultar controles INMEDIATAMENTE (antes de navegar)
        console.log('🙈 Ocultando controles antes de navegar...');
        this.hideControls();
        
        // 2. Llamar al método original con el contexto correcto
        originalNavigateToPost.call(this, direction);
        
        // 3. Asegurar que los controles permanezcan ocultos después
        setTimeout(() => {
            console.log('🔒 Verificando que controles estén ocultos...');
            this.hideControls();
        }, 100);
    };
    
    // Mejorar hideControls para ser más agresivo
    const originalHideControls = viewer.hideControls;
    viewer.hideControls = function() {
        console.log('🙈 Ejecutando hideControls mejorado...');
        
        // Llamar al original
        if (originalHideControls) {
            originalHideControls.call(this);
        }
        
        // Forzar ocultamiento
        this.controlsVisible = false;
        
        const closeBtn = this.viewerElement.querySelector('.pmv-close-btn');
        const soundBtn = this.viewerElement.querySelector('.pmv-sound-btn');
        const infoBar = this.viewerElement.querySelector('.pmv-info-bar');
        const silencedBadge = this.viewerElement.querySelector('.pmv-silenced-badge');
        
        if (closeBtn) {
            closeBtn.classList.remove('visible');
            closeBtn.style.opacity = '0';
            closeBtn.style.visibility = 'hidden';
        }
        if (soundBtn) {
            soundBtn.classList.remove('visible');
            soundBtn.style.opacity = '0';
            soundBtn.style.visibility = 'hidden';
        }
        if (infoBar) {
            infoBar.classList.remove('visible');
            infoBar.style.transform = 'translateY(100%)';
        }
        if (silencedBadge) {
            silencedBadge.classList.remove('visible');
            silencedBadge.style.opacity = '0';
            silencedBadge.style.visibility = 'hidden';
        }
        
        // Limpiar cualquier timeout de auto-hide
        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
            this.hideControlsTimeout = null;
        }
        
        console.log('✅ Controles forzados a ocultar');
    };
    
    // Agregar transiciones visuales
    addVisualTransitions(viewer);
    
    // Agregar indicador de posición
    addPositionIndicator(viewer);
    
    // Agregar navegación por teclado mejorada
    addKeyboardNavigation(viewer);
    
    console.log('✅ ProfileMediaViewer mejorado exitosamente');
    console.log('🎮 Prueba hacer scroll ahora y deberías ver mensajes en consola');
}

// Agregar transiciones visuales suaves
function addVisualTransitions(viewer) {
    const originalLoadMedia = viewer.loadMedia.bind(viewer);
    
    viewer.loadMedia = function() {
        const mediaContainer = this.viewerElement.querySelector('.pmv-media-container');
        
        if (mediaContainer) {
            // Fade out rápido
            mediaContainer.style.transition = 'opacity 0.15s ease';
            mediaContainer.style.opacity = '0';
            
            setTimeout(() => {
                // Cargar nuevo contenido
                originalLoadMedia();
                
                // Fade in
                setTimeout(() => {
                    mediaContainer.style.opacity = '1';
                }, 50);
            }, 150);
        } else {
            originalLoadMedia();
        }
    };
}

// Agregar indicador visual de posición
function addPositionIndicator(viewer) {
    const originalOpen = viewer.open.bind(viewer);
    
    viewer.open = function(postElement, showControls = true) {
        originalOpen(postElement, showControls);
        
        // Crear indicador si no existe
        if (!this.viewerElement.querySelector('.pmv-position-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'pmv-position-indicator';
            this.viewerElement.appendChild(indicator);
        }
        
        // Actualizar indicador
        updatePositionIndicator(this);
    };
    
    // También actualizar en cada navegación
    const originalNavigate = viewer.navigateToPost.bind(viewer);
    viewer.navigateToPost = function(direction) {
        originalNavigate(direction);
        setTimeout(() => updatePositionIndicator(this), 100);
    };
}

function updatePositionIndicator(viewer) {
    const indicator = viewer.viewerElement.querySelector('.pmv-position-indicator');
    if (!indicator || viewer.availablePosts.length <= 1) return;
    
    const total = Math.min(viewer.availablePosts.length, 10); // Max 10 dots
    const current = viewer.currentPostIndex;
    
    let dotsHTML = '';
    for (let i = 0; i < total; i++) {
        const isActive = i === Math.floor(current * total / viewer.availablePosts.length);
        dotsHTML += `<div class="position-dot ${isActive ? 'active' : ''}"></div>`;
    }
    
    indicator.innerHTML = dotsHTML;
}

// Agregar navegación por teclado
function addKeyboardNavigation(viewer) {
    document.addEventListener('keydown', (e) => {
        if (!viewer.isActive) return;
        
        // Ignorar si está escribiendo
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                viewer.navigateToPost('next');
                break;
                
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                viewer.navigateToPost('prev');
                break;
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScrollSystem);
} else {
    initializeScrollSystem();
}

// También reintentar después de un momento por si acaso
setTimeout(initializeScrollSystem, 500);
setTimeout(initializeScrollSystem, 1000);

// ============================================
// ESTILOS ADICIONALES
// ============================================

const scrollStyles = document.createElement('style');
scrollStyles.textContent = `
    /* Indicador visual de posición */
    .pmv-position-indicator {
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 15;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .pmv-container.active .pmv-position-indicator {
        opacity: 1;
    }
    
    .position-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
    }
    
    .position-dot.active {
        width: 8px;
        height: 8px;
        background: white;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    
    /* Optimización de transiciones */
    .pmv-media-container {
        will-change: opacity, transform;
    }
    
    /* Prevenir selección de texto durante navegación */
    .pmv-container * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    
    /* Mejorar rendimiento en móvil */
    @media (max-width: 768px) {
        .pmv-media-container {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
    }
`;

document.head.appendChild(scrollStyles);

console.log('✅ scroll_perfil.js cargado - Navegación vertical tipo Reels activa');