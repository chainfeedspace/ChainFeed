// ============================================
// SOLUCIÓN ULTRA-RÁPIDA: Contadores instantáneos
// ============================================

(function() {
    'use strict';
    
    console.log('⚡ Sistema de contadores instantáneos activado');
    
    let ultimoTab = null;
    let observadorActivo = null;
    
    /**
     * Actualización ultra-rápida de contadores
     */
    function actualizarContadoresInstantaneos() {
        // Forzar reflow para que el DOM esté actualizado
        document.body.offsetHeight;
        
        const posts = document.querySelectorAll('.content-card[data-post-id], .post-card[data-post-id]');
        
        // Usar requestAnimationFrame para sincronizar con el render
        requestAnimationFrame(() => {
            posts.forEach(post => {
                const flashInfoElement = post.querySelector('[data-flash-info]');
                if (!flashInfoElement) return;
                
                try {
                    const flashInfo = JSON.parse(flashInfoElement.dataset.flashInfo);
                    const username = flashInfoElement.dataset.username;
                    const avatar = post.querySelector('.post-avatar');
                    
                    if (avatar && flashInfo && window.aplicarContadorFlash) {
                        // Aplicar sin animaciones para velocidad
                        window.aplicarContadorFlash(avatar, flashInfo, username);
                    }
                } catch (error) {
                    // Silencioso para no afectar UX
                }
            });
        });
    }
    
    /**
     * Detectar cambio de tab con máxima precisión
     */
    function detectarCambioTab() {
        const tabs = document.querySelectorAll('.content-tab');
        
        tabs.forEach(tab => {
            // Observar cambios en la clase 'active'
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'class') {
                        
                        const esActivo = tab.classList.contains('active');
                        const tabActual = tab.textContent.trim();
                        
                        if (esActivo && tabActual !== ultimoTab) {
                            ultimoTab = tabActual;
                            
                            // Ejecutar INMEDIATAMENTE
                            setTimeout(() => {
                                actualizarContadoresInstantaneos();
                                
                                // Y de nuevo por si hay animaciones
                                setTimeout(actualizarContadoresInstantaneos, 100);
                            }, 0);
                        }
                    }
                });
            });
            
            observer.observe(tab, { attributes: true });
        });
    }
    
    /**
     * Observador de contenido para tabs anidados
     */
    function observarContenidoTabs() {
        if (observadorActivo) {
            observadorActivo.disconnect();
        }
        
        observadorActivo = new MutationObserver((mutations) => {
            let debeActualizar = false;
            
            mutations.forEach(mutation => {
                // Detectar nuevos posts
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches && (
                            node.matches('.content-card[data-post-id]') ||
                            node.matches('.post-card[data-post-id]') ||
                            node.querySelector('.content-card[data-post-id]') ||
                            node.querySelector('.post-card[data-post-id]')
                        )) {
                            debeActualizar = true;
                        }
                    }
                });
                
                // Detectar cambios en data-flash-info (cuando se actualiza el JSON)
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'data-flash-info') {
                    debeActualizar = true;
                }
            });
            
            if (debeActualizar) {
                // Ejecutar en el próximo frame para sincronizar
                requestAnimationFrame(actualizarContadoresInstantaneos);
            }
        });
        
        const contentArea = document.getElementById('content-area');
        if (contentArea) {
            observadorActivo.observe(contentArea, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['data-flash-info']
            });
        }
    }
    
    /**
     * Pre-cargar datos para velocidad máxima
     */
    function precargarDatosFlashes() {
        // Si hay datos en el DOM, usarlos inmediatamente
        const posts = document.querySelectorAll('.content-card[data-post-id], .post-card[data-post-id]');
        
        posts.forEach(post => {
            const flashInfoElement = post.querySelector('[data-flash-info]');
            if (flashInfoElement && flashInfoElement.dataset.flashInfo) {
                try {
                    // Forzar parseo para validar datos
                    JSON.parse(flashInfoElement.dataset.flashInfo);
                } catch (e) {
                    console.warn('Datos de flash corruptos:', flashInfoElement.dataset.flashInfo);
                }
            }
        });
    }
    
    /**
     * Inicialización
     */
    function inicializarSistemaRapido() {
        console.log('🚀 Inicializando sistema ultra-rápido...');
        
        // 1. Detectar cambios de tab
        detectarCambioTab();
        
        // 2. Observar contenido
        observarContenidoTabs();
        
        // 3. Precargar datos
        precargarDatosFlashes();
        
        // 4. Actualización inicial inmediata
        requestAnimationFrame(() => {
            actualizarContadoresInstantaneos();
            
            // Y otra vez por si acaso
            setTimeout(actualizarContadoresInstantaneos, 50);
        });
        
        console.log('✅ Sistema ultra-rápido activado');
    }
    
    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarSistemaRapido);
    } else {
        inicializarSistemaRapido();
    }
    
    // También al cambiar de pestaña del navegador
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            actualizarContadoresInstantaneos();
        }
    });
    
})();

// ============================================
// BONUS: Optimización extra para tabs anidados
// ============================================

// Si usas un sistema de tabs personalizado, intercepta el cambio
document.addEventListener('tabChanged', (e) => {
    console.log('🔄 Tab personalizado cambiado:', e.detail);
    
    // Forzar actualización inmediata
    requestAnimationFrame(() => {
        if (window.actualizarContadoresInstantaneos) {
            window.actualizarContadoresInstantaneos();
        }
    });
});