/**
 * ============================================
 * SISTEMA DE LOADING PARA PERFIL - ChainFeed
 * ============================================
 * v5 - Fix para detectar elemento automáticamente
 * Spinner como OVERLAY (no reemplaza contenido)
 */

(function() {
    'use strict';
    
    console.log('🔄 [PERFIL] Inicializando sistema de loading v5...');
    
    const CONFIG = {
        TIMEOUT_SEGURIDAD: 8000,
        DELAY_LIMPIEZA: 100,
        DEBUG: true
    };
    
    const LOADING_CLASS = 'btn-loading-profile';
    const SPINNER_CLASS = 'btn-spinner-profile';
    const OVERLAY_CLASS = 'btn-spinner-overlay';
    
    const activeTimeouts = new Map();
    const processingElements = new WeakSet();
    
    // ============================================
    // CONFIGURACIÓN DE FUNCIONES
    // ============================================
    const FUNCIONES_CONFIG = {
        // Posts: recibe (element, postId)
        togglePostLikeReal: { 
            elementIndex: 0,
            type: 'post'
        },
        // Comentarios: recibe (commentId, isLiked) - SIN element
        toggleCommentLikeReal: { 
            elementIndex: null, // No recibe element
            type: 'comment',
            needsAutoDetect: true
        },
        // Respuestas: recibe (participationId, isLiked) - SIN element  
        toggleParticipationLikeReal: { 
            elementIndex: null, // No recibe element
            type: 'participation',
            needsAutoDetect: true
        }
    };
    
    // ============================================
    // DETECTAR ELEMENTO DEL CALLER
    // ============================================
    function detectElementFromCaller() {
        try {
            // Obtener el stack trace
            const stack = new Error().stack;
            if (!stack) return null;
            
            // Buscar la línea que tiene "onclick"
            const lines = stack.split('\n');
            for (const line of lines) {
                if (line.includes('onclick')) {
                    // Encontramos la llamada desde un onclick
                    // Ahora buscamos el elemento activo
                    const activeElement = document.activeElement;
                    
                    // Si el elemento activo es un botón con onclick de like, es nuestro elemento
                    if (activeElement && activeElement.tagName === 'BUTTON') {
                        const onclick = activeElement.getAttribute('onclick') || '';
                        if (onclick.includes('toggleCommentLikeReal') || 
                            onclick.includes('toggleParticipationLikeReal')) {
                            return activeElement;
                        }
                    }
                    
                    break;
                }
            }
            
            // Fallback: buscar el último botón clickeado usando un listener
            if (window.__lastClickedLikeButton) {
                return window.__lastClickedLikeButton;
            }
            
            return null;
        } catch (error) {
            console.error('Error detectando elemento:', error);
            return null;
        }
    }
    
    // ============================================
    // LISTENER PARA CAPTURAR CLICKS
    // ============================================
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button[onclick*="toggleCommentLikeReal"], button[onclick*="toggleParticipationLikeReal"]');
        if (target) {
            window.__lastClickedLikeButton = target;
            // Limpiar después de 100ms
            setTimeout(() => {
                window.__lastClickedLikeButton = null;
            }, 100);
        }
    }, true); // Captura en fase de captura para ejecutar antes
    
    // ============================================
    // MOSTRAR LOADING (overlay, no reemplaza)
    // ============================================
    function showLoading(element) {
        if (!element) return false;
        if (processingElements.has(element)) return false;
        if (element.classList.contains(LOADING_CLASS)) return false;
        if (element.querySelector(`.${OVERLAY_CLASS}`)) return false;
        
        processingElements.add(element);
        
        // Crear overlay con spinner
        const overlay = document.createElement('div');
        overlay.className = OVERLAY_CLASS;
        overlay.innerHTML = `
            <svg class="${SPINNER_CLASS}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.2"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.5s" repeatCount="indefinite"/>
                </path>
            </svg>
        `;
        
        // Aplicar clase y agregar overlay
        element.classList.add(LOADING_CLASS);
        element.style.position = 'relative';
        element.appendChild(overlay);
        
        // Timeout de seguridad
        const timeoutId = setTimeout(() => {
            removeLoading(element);
        }, CONFIG.TIMEOUT_SEGURIDAD);
        
        activeTimeouts.set(element, timeoutId);
        
        if (CONFIG.DEBUG) console.log('⏳ Loading activado en:', element);
        return true;
    }
    
    // ============================================
    // QUITAR LOADING
    // ============================================
    function removeLoading(element) {
        if (!element) return;
        
        if (activeTimeouts.has(element)) {
            clearTimeout(activeTimeouts.get(element));
            activeTimeouts.delete(element);
        }
        
        // Quitar overlay
        const overlay = element.querySelector(`.${OVERLAY_CLASS}`);
        if (overlay) {
            overlay.remove();
        }
        
        // Limpiar clases y estilos
        element.classList.remove(LOADING_CLASS);
        element.style.position = '';
        
        processingElements.delete(element);
        
        if (CONFIG.DEBUG) console.log('✅ Loading removido de:', element);
    }
    
    // ============================================
    // LIMPIAR TODOS
    // ============================================
    function limpiarTodosLosSpinners() {
        document.querySelectorAll(`.${OVERLAY_CLASS}`).forEach(overlay => {
            const element = overlay.parentElement;
            if (element) removeLoading(element);
        });
        
        document.querySelectorAll(`.${LOADING_CLASS}`).forEach(el => {
            removeLoading(el);
        });
        
        activeTimeouts.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        activeTimeouts.clear();
    }
    
    // ============================================
    // WRAPPER UNIVERSAL PARA FUNCIONES DE LIKE
    // ============================================
    function wrapLikeFunction(funcName, originalFunc, config) {
        return async function(...args) {
            if (CONFIG.DEBUG) {
                console.group(`🔍 ${funcName} llamada`);
                console.log('Args:', args);
            }
            
            let element = null;
            let loadingApplied = false;
            
            // Determinar el elemento
            if (config.needsAutoDetect) {
                // Auto-detectar elemento (comentarios y respuestas)
                element = detectElementFromCaller();
                if (CONFIG.DEBUG) console.log('Elemento auto-detectado:', element);
            } else if (config.elementIndex !== null && args[config.elementIndex]) {
                // Elemento viene en los argumentos (posts)
                element = args[config.elementIndex];
                if (CONFIG.DEBUG) console.log('Elemento de args[' + config.elementIndex + ']:', element);
            }
            
            // Validar que tenemos un elemento válido
            if (element && element.nodeType === 1) {
                // Guardar estado inicial para detectar cambio
                const initialLiked = element.classList.contains('liked') || false;
                const initialCount = element.querySelector('.like-count')?.textContent || '0';
                
                loadingApplied = showLoading(element);
                
                try {
                    const result = await originalFunc.apply(this, args);
                    
                    // Esperar a que el DOM se actualice
                    if (loadingApplied) {
                        await waitForDOMChange(element, initialLiked, initialCount);
                    }
                    
                    // Actualizar botón "Ver" solo para posts
                    if (config.type === 'post') {
                        actualizarBotonVer(element);
                    }
                    
                    if (CONFIG.DEBUG) console.log('✅ Operación completada');
                    
                    return result;
                } catch (error) {
                    console.error(`Error en ${funcName}:`, error);
                    throw error;
                } finally {
                    if (loadingApplied) {
                        removeLoading(element);
                    }
                    if (CONFIG.DEBUG) console.groupEnd();
                }
            } else {
                // No hay elemento válido, ejecutar sin loading
                if (CONFIG.DEBUG) {
                    console.warn('No se pudo obtener elemento válido, ejecutando sin loading');
                    console.groupEnd();
                }
                return await originalFunc.apply(this, args);
            }
        };
    }
    
    // ============================================
    // ESPERAR CAMBIO EN DOM
    // ============================================
    function waitForDOMChange(element, initialLiked, initialCount) {
        return new Promise((resolve) => {
            let checks = 0;
            const maxChecks = 50; // 50 * 20ms = 1 segundo máximo
            
            const checkChange = () => {
                checks++;
                
                const currentLiked = element.classList.contains('liked');
                const currentCount = element.querySelector('.like-count')?.textContent || '0';
                
                // Si cambió el estado o el contador, resolver
                if (currentLiked !== initialLiked || currentCount !== initialCount) {
                    resolve();
                    return;
                }
                
                // Si llegamos al máximo de intentos, resolver de todos modos
                if (checks >= maxChecks) {
                    resolve();
                    return;
                }
                
                // Seguir esperando
                setTimeout(checkChange, 20);
            };
            
            // Empezar a verificar después de un pequeño delay
            setTimeout(checkChange, 20);
        });
    }
    
    // ============================================
    // MANEJAR BOTÓN "VER" (openLikesModal)
    // ============================================
    function actualizarBotonVer(likeButton) {
        if (!likeButton) return;
        
        // Obtener el contenedor de stats
        const statsContainer = likeButton.closest('.card-stats, .post-stats');
        if (!statsContainer) return;
        
        // Obtener el postId del onclick del botón de like
        const onclick = likeButton.getAttribute('onclick') || '';
        const match = onclick.match(/togglePostLikeReal\(this,\s*(\d+)\)/);
        if (!match) return;
        
        const postId = match[1];
        
        // Obtener contador actual
        const likeCount = parseInt(likeButton.querySelector('.like-count')?.textContent || '0');
        
        // Buscar botón "Ver" existente
        let verButton = statsContainer.querySelector(`button[onclick*="openLikesModal('post', ${postId}"]`);
        
        if (likeCount > 0) {
            // Debe existir el botón "Ver"
            if (!verButton) {
                // Crear botón "Ver"
                verButton = document.createElement('button');
                verButton.className = 'post-stat';
                verButton.setAttribute('onclick', `event.stopPropagation(); openLikesModal('post', ${postId}, event);`);
                verButton.setAttribute('title', 'Ver quién dio like');
                verButton.style.cssText = 'color: var(--text-secondary); font-size: 0.9rem;';
                verButton.textContent = 'Ver';
                
                // Insertar antes del botón de like
                statsContainer.insertBefore(verButton, likeButton);
                
                if (CONFIG.DEBUG) console.log('✅ Botón "Ver" creado para post', postId);
            }
        } else {
            // No debe existir el botón "Ver"
            if (verButton) {
                verButton.remove();
                if (CONFIG.DEBUG) console.log('🗑️ Botón "Ver" eliminado para post', postId);
            }
        }
    }
    
    // ============================================
    // APLICAR INTERCEPTORES
    // ============================================
    function aplicarInterceptores() {
        let interceptados = 0;
        
        Object.entries(FUNCIONES_CONFIG).forEach(([funcName, config]) => {
            if (typeof window[funcName] === 'function' && !window[funcName]._likeLoaderIntercepted) {
                const original = window[funcName]._original || window[funcName];
                window[funcName] = wrapLikeFunction(funcName, original, config);
                window[funcName]._likeLoaderIntercepted = true;
                window[funcName]._original = original;
                interceptados++;
            }
        });
        
        if (interceptados > 0) {
            console.log(`✅ [PERFIL] ${interceptados} funciones de like interceptadas`);
        }
    }
    
    // ============================================
    // INTERCEPTAR ERRORES
    // ============================================
    function interceptarNotificaciones() {
        if (typeof window.showNotification === 'function' && !window.showNotification._likeLoaderIntercepted) {
            const original = window.showNotification;
            
            window.showNotification = function(message, type, ...args) {
                if (type === 'error') {
                    setTimeout(limpiarTodosLosSpinners, 100);
                }
                return original.call(this, message, type, ...args);
            };
            
            window.showNotification._likeLoaderIntercepted = true;
        }
    }
    
    // ============================================
    // API GLOBAL
    // ============================================
    window.ProfileLoader = {
        showLoading,
        removeLoading,
        limpiarTodos: limpiarTodosLosSpinners,
        recargarInterceptores: aplicarInterceptores
    };
    
    window.removeButtonLoading = removeLoading;
    window.removeAllButtonLoadings = limpiarTodosLosSpinners;
    window.limpiarSpinners = limpiarTodosLosSpinners;
    
    // ============================================
    // ESTILOS
    // ============================================
    if (!document.getElementById('profile-loader-styles-v5')) {
        const styles = document.createElement('style');
        styles.id = 'profile-loader-styles-v5';
        styles.textContent = `
            .${LOADING_CLASS} {
                pointer-events: none !important;
            }
            
            .${OVERLAY_CLASS} {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--bg-primary, #1a1a2e);
                border-radius: inherit;
                z-index: 10;
            }
            
            .${SPINNER_CLASS} {
                stroke: var(--primary, #6366f1);
            }
            
            .liked .${SPINNER_CLASS} {
                stroke: var(--error, #ef4444);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    function inicializar() {
        aplicarInterceptores();
        interceptarNotificaciones();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
    
    setTimeout(inicializar, 1000);
    setTimeout(inicializar, 3000);
    
    const checkInterval = setInterval(aplicarInterceptores, 2000);
    setTimeout(() => clearInterval(checkInterval), 30000);
    
    console.log('✅ [PERFIL] Sistema de loading v5 inicializado');
    
})();