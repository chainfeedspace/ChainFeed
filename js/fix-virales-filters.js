// ============================================
// FIX FILTROS - VERSIÓN SIMPLE Y ROBUSTA
// Archivo: fix-virales-filters.js
// Ubicar AL FINAL de todos los scripts
// ============================================

(function() {
    'use strict';
    
    console.log('🔧 [FIX FILTROS] Cargando...');
    
    function aplicarFiltros() {
        const activeTab = document.querySelector('.nav-tab.active');
        if (!activeTab) return;
        
        const tabText = activeTab.textContent.toLowerCase();
        const feedNav = document.querySelector('.feed-navigation');
        const isExpanded = feedNav && (
            feedNav.classList.contains('expanded') || 
            feedNav.classList.contains('expanding')
        );
        
        if (isExpanded) return;
        
        const vf = document.getElementById('viralesFilters');
        const pf = document.getElementById('postsFilters');
        const cf = document.getElementById('chainFilters');
        
        // Ocultar todos
        [vf, pf, cf].forEach(f => {
            if (f) {
                f.classList.add('hidden');
                f.style.display = 'none';
            }
        });
        
        // Mostrar el correcto
        if (tabText.includes('viral') && vf) {
            vf.classList.remove('hidden');
            vf.style.cssText = 'display: flex !important;';
        } else if (tabText.includes('post') && pf) {
            pf.classList.remove('hidden');
            pf.style.cssText = 'display: flex !important;';
        } else if (tabText.includes('chain') && cf) {
            cf.classList.remove('hidden');
            cf.style.cssText = 'display: flex !important;';
        }
    }
    
    // Ejecutar cada vez que cambie un tab o la navegación
    function iniciar() {
        console.log('🔧 [FIX FILTROS] Iniciando observadores...');
        
        // Observar cambios en tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Aplicar después de que todo termine
                setTimeout(aplicarFiltros, 500);
            });
        });
        
        // Observar cambios en la navegación
        const feedNav = document.querySelector('.feed-navigation');
        if (feedNav) {
            const observer = new MutationObserver(() => {
                const isExpanded = feedNav.classList.contains('expanded');
                if (!isExpanded) {
                    setTimeout(aplicarFiltros, 500);
                }
            });
            observer.observe(feedNav, { attributes: true, attributeFilter: ['class'] });
        }
        
        console.log('✅ [FIX FILTROS] Listo');
    }
    
    // Iniciar cuando todo esté listo
    if (document.readyState === 'complete') {
        setTimeout(iniciar, 200);
    } else {
        window.addEventListener('load', () => setTimeout(iniciar, 200));
    }
    
})();