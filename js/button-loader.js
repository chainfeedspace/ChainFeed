/**
 * ============================================
 * SISTEMA AUTOMÁTICO DE LOADING UNIVERSAL
 * ============================================
 */
(function() {
    'use strict';
    
    console.log('🔄 Inicializando sistema automático de loading...');
    
    const SELECTORES_A_DETECTAR = [
        '.post-stat', 
        '.card-stat',
        '.comment-like-btn',
        '.reply-like-btn',
        '.repost-btn',
        'button[data-action="like"]',
        'button[data-action="repost"]',
        'button[data-action="comment"]',
        '.comment-action',
        '.fsv-action-btn',
        '.submission-like-btn',  // ✅ AGREGADO - botones de like en participaciones
        '.pmv-action-btn ',
        '.pfsv-like-btn',
        '.pfsv-like-icon',
    ];
    
    const TIMEOUT_SEGURIDAD = 30000;
    const DATA_ATTR = 'data-original-html';
    const PROCESSED_ATTR = 'data-loader-processed';
    
    const SPINNER_HTML = `
        <svg class="btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.2"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.5s" repeatCount="indefinite"/>
            </path>
        </svg>
    `;
    
    const activeTimeouts = new Map();
    
    // ============================================
    // FUNCIÓN PARA QUITAR LOADING
    // ============================================
    function removeLoading(element) {
        if (!element) return;
        
        if (activeTimeouts.has(element)) {
            clearTimeout(activeTimeouts.get(element));
            activeTimeouts.delete(element);
        }
        
        const originalHTML = element.getAttribute(DATA_ATTR);
        const tieneSpinner = element.querySelector('.btn-spinner') !== null;
        
        if (originalHTML && tieneSpinner) {
            element.innerHTML = originalHTML;
            console.log('✅ HTML restaurado');
        }
        
        element.removeAttribute(DATA_ATTR);
        element.classList.remove('btn-loading');
        element.style.pointerEvents = '';
        element.style.cursor = '';
    }
    
    // ============================================
    // LIMPIAR TODOS LOS SPINNERS
    // ============================================
    function limpiarTodosLosSpinners() {
        const conSpinner = document.querySelectorAll('.btn-spinner');
        console.log(`🧹 Encontrados ${conSpinner.length} spinners activos`);
        
        conSpinner.forEach(spinner => {
            const element = spinner.closest('button') || spinner.parentElement;
            if (element) removeLoading(element);
        });
        
        document.querySelectorAll(`[${DATA_ATTR}]`).forEach(el => removeLoading(el));
        document.querySelectorAll('.btn-loading').forEach(el => removeLoading(el));
    }
    
    // ============================================
    // EXPONER FUNCIONES GLOBALES
    // ============================================
    window.removeButtonLoading = function(selectorOrElement) {
        let element = typeof selectorOrElement === 'string' 
            ? document.querySelector(selectorOrElement) 
            : selectorOrElement;
        if (element) removeLoading(element);
    };
    window.removeAllButtonLoadings = limpiarTodosLosSpinners;
    window.limpiarSpinners = limpiarTodosLosSpinners;
    
    // ============================================
    // MANEJAR CLICK CON EVENT DELEGATION
    // ============================================
    document.addEventListener('click', async function(event) {
        // Buscar si el click fue en un elemento que debemos interceptar
        const selector = SELECTORES_A_DETECTAR.join(', ');
        const element = event.target.closest(selector);
        
        if (!element) return;
        
        // Si ya está en loading, bloquear
        if (element.classList.contains('btn-loading') || element.querySelector('.btn-spinner')) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            console.log('⏳ Click bloqueado - elemento en loading');
            return false;
        }
        
        // Obtener el handler original del atributo onclick
        const onclickAttr = element.getAttribute('onclick');
        if (!onclickAttr) return; // Si no tiene onclick, dejar pasar
        
        // Prevenir ejecución del onclick original
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        // Guardar HTML original
        const originalHTML = element.innerHTML;
        element.setAttribute(DATA_ATTR, originalHTML);
        
        // Activar loading
        element.classList.add('btn-loading');
        element.innerHTML = SPINNER_HTML;
        element.style.pointerEvents = 'none';
        element.style.cursor = 'wait';
        
        // Timeout de seguridad
        const timeoutId = setTimeout(() => {
            if (element.querySelector('.btn-spinner')) {
                console.warn('⏰ Timeout - limpiando spinner');
                removeLoading(element);
            }
        }, TIMEOUT_SEGURIDAD);
        
        activeTimeouts.set(element, timeoutId);
        
        try {
            // ⭐ Crear función que ejecute el onclick con 'this' correcto
            // Reemplazar 'this' en el onclick por referencia al elemento
            const modifiedOnclick = onclickAttr.replace(/\bthis\b/g, '__el__');
            const __el__ = element;
            
            // Ejecutar el handler original con el elemento correcto
            const result = await eval(modifiedOnclick);
            
            // Limpiar timeout
            clearTimeout(timeoutId);
            activeTimeouts.delete(element);
            
            // Limpiar estado de loading
            element.classList.remove('btn-loading');
            element.style.pointerEvents = '';
            element.style.cursor = '';
            element.removeAttribute(DATA_ATTR);
            
            // Si todavía tiene spinner (la función no actualizó el HTML), restaurar
            if (element.querySelector('.btn-spinner')) {
                setTimeout(() => {
                    if (element.querySelector('.btn-spinner')) {
                        console.log('🧹 Limpieza post-ejecución');
                        element.innerHTML = originalHTML;
                    }
                }, 300);
            }
            
            return result;
        } catch (error) {
            console.warn('❌ Error capturado:', error.message);
            clearTimeout(timeoutId);
            activeTimeouts.delete(element);
            removeLoading(element);
        }
    }, true); // ⭐ CAPTURE PHASE - se ejecuta antes que otros handlers
    
    // ============================================
    // DETECTAR showNotification PARA ERRORES
    // ============================================
    if (typeof window.showNotification === 'function') {
        const originalShowNotification = window.showNotification;
        window.showNotification = function(message, type, ...args) {
            if (type === 'error' || (typeof message === 'string' && message.toLowerCase().includes('error'))) {
                console.log('🔔 Notificación de error detectada, limpiando spinners...');
                setTimeout(limpiarTodosLosSpinners, 100);
            }
            return originalShowNotification.call(this, message, type, ...args);
        };
        console.log('✅ showNotification interceptado');
    }
    
    // ============================================
    // FIX PARA toggleParticipationLikeReal
    // ============================================
    if (window.toggleParticipationLikeReal) {
        const originalToggle = window.toggleParticipationLikeReal;
        
        window.toggleParticipationLikeReal = async function(participationId) {
            try {
                const clickEvent = window.event || arguments.callee?.caller?.arguments[0];
                const button = clickEvent ? 
                    clickEvent.target.closest('.submission-like-btn') : 
                    document.querySelector(`[onclick*="toggleParticipationLikeReal('${participationId}')"]`);
                
                if (!button) return;
                
                button.classList.add('action-feedback');
                button.disabled = true;
                
                const cleanId = participationId.toString().replace('chain-', '');
                const numericId = parseInt(cleanId);
                
                if (isNaN(numericId) || numericId <= 0) {
                    throw new Error('ID de participación inválido');
                }

                const response = await fetch('/php/manejar_likes_participaciones.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ participacion_id: numericId })
                });

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || 'Error desconocido');
                }

                // ✅ Obtener contenedor de stats
                const statsContainer = button.parentElement;
                
                // ✅ ACTUALIZAR HTML CORRECTAMENTE
                if (data.liked) {
                    button.classList.add('liked');
                    button.style.color = 'var(--error)';
                    button.innerHTML = `❤️ <span class="like-count">${data.new_like_count}</span>`;
                    showNotification('❤️ ¡Like dado! +1 CFT al participante', 'success');
                    
                    button.style.transform = 'scale(1.2)';
                    setTimeout(() => { button.style.transform = 'scale(1)'; }, 200);
                    
                    // ✅ CREAR BOTÓN "VER" SI NO EXISTE Y HAY LIKES
                    if (data.new_like_count > 0 && statsContainer && !statsContainer.querySelector('.post-stat-view-likes')) {
                        const verBtn = document.createElement('button');
                        verBtn.className = 'post-stat-view-likes';
                        verBtn.onclick = (e) => {
                            e.stopPropagation();
                            if (window.openLikesModal) {
                                openLikesModal('participacion', numericId, e);
                            }
                        };
                        verBtn.title = 'Ver quién dio like';
                        verBtn.style.cssText = `
                            border-radius: 8px;
                            font-size: 0.85rem;
                            font-weight: 600;
                            cursor: pointer;
                            padding: 0.8rem 0 0;
                            transition: all 0.2s ease;
                            background: rgba(99, 102, 241, 0.1);
                            color: var(--primary);
                            border: 1px solid rgb(99 102 241 / 0%) !important;
                        `;
                        verBtn.textContent = 'Ver';
                        
                        // Insertar ANTES del botón de like
                        statsContainer.insertBefore(verBtn, button);
                        console.log('✅ Botón "Ver" creado');
                    }
                } else {
                    button.classList.remove('liked');
                    button.style.color = 'var(--text)';
                    button.innerHTML = `🤍 <span class="like-count">${data.new_like_count}</span>`;
                    showNotification('💔 Like removido');
                    
                    // ✅ REMOVER BOTÓN "VER" SI NO HAY LIKES
                    if (data.new_like_count === 0 && statsContainer) {
                        const verBtn = statsContainer.querySelector('.post-stat-view-likes');
                        if (verBtn) {
                            verBtn.remove();
                            console.log('✅ Botón "Ver" eliminado');
                        }
                    }
                }

            } catch (error) {
                console.error('❌ Error en like:', error);
                showNotification('❌ Error: ' + error.message, 'error');
            } finally {
                setTimeout(() => {
                    document.querySelectorAll('.submission-like-btn').forEach(btn => {
                        btn.disabled = false;
                        btn.classList.remove('action-feedback');
                    });
                }, 600);
            }
        };
        
        console.log('✅ toggleParticipationLikeReal patcheado');
    }
    
    // ============================================
    // ESTILOS
    // ============================================
    if (!document.getElementById('btn-loader-styles')) {
        const styles = document.createElement('style');
        styles.id = 'btn-loader-styles';
        styles.textContent = `
            .btn-loading { pointer-events: none !important; cursor: wait !important; }
            .btn-spinner { display: inline-block; vertical-align: middle; stroke: #8d81eb; }
            .liked .btn-spinner { stroke: #ef4444; }
            .reposted .btn-spinner { stroke: #10b981; }
            
            /* Asegurar que los botones sean clickeables */
            .post-stats { pointer-events: auto; }
            .post-stats .post-stat { 
                pointer-events: auto; 
                position: relative; 
                z-index: 10; 
            }
        `;
        document.head.appendChild(styles);
    }
    
    console.log('✅ Button loader activo (event delegation + participation likes fix)');
    
})();