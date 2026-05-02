/* ============================================ */
/* SISTEMA DE NAVEGACIÓN EXPANDIBLE - FIX CHAIN FILTERS */
/* Versión: 1.0.3 - FIX TIMING CHAIN FILTERS */
/* ============================================ */

(function() {
    'use strict';
    
    // Variables globales del sistema
    let isExpanded = false;
    let collapseTimer = null;
    const COLLAPSE_DELAY = 5000; // 5 segundos
    
    // Inyectar CSS corregido
    function injectFixedCSS() {
        const styleFix = document.createElement('style');
        styleFix.textContent = `
            /* ✅ CSS CORREGIDO - REMOVER BLOQUEOS */
            .nav-tab {
                pointer-events: auto !important;
                opacity: 1 !important;
                width: auto !important;
                padding: 5px 7px !important;;
                margin: 0px !important;
                transform: translateX(0px) scale(1) !important;
                display: flex !important;
            }
            
            .feed-navigation:not(.expanded) .nav-tab:not(.active) {
                display: none !important;
            }
            
            .feed-navigation.expanded .nav-tab {
                display: flex !important;
            }
            
            /* Mantener animaciones pero sin bloquear */
            .feed-navigation.expanding .nav-tab:nth-child(1) { transition-delay: 0s !important; }
            .feed-navigation.expanding .nav-tab:nth-child(2) { transition-delay: 0.08s !important; }
            .feed-navigation.expanding .nav-tab:nth-child(3) { transition-delay: 0.16s !important; }
            .feed-navigation.expanding .nav-tab:nth-child(4) { transition-delay: 0.24s !important; }
            
            .feed-navigation.collapsing .nav-tab:nth-child(4):not(.active) { transition-delay: 0s !important; }
            .feed-navigation.collapsing .nav-tab:nth-child(3):not(.active) { transition-delay: 0.08s !important; }
            .feed-navigation.collapsing .nav-tab:nth-child(2):not(.active) { transition-delay: 0.16s !important; }
            .feed-navigation.collapsing .nav-tab:nth-child(1):not(.active) { transition-delay: 0.24s !important; }
        `;
        document.head.appendChild(styleFix);
        console.log('✅ CSS corregido inyectado');
    }
    
    // Inicialización cuando el DOM esté listo
    function initExpandableNav() {
        const feedNav = document.querySelector('.feed-navigation');
        if (!feedNav) {
            console.warn('⚠️ No se encontró .feed-navigation');
            return;
        }
        
        console.log('✅ Sistema de navegación expandible inicializado');
        
        // Inyectar CSS corregido primero
        injectFixedCSS();
        
        // Configurar eventos en todos los tabs
        setupTabEvents(feedNav);
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', handleOutsideClick);
        
        // Configurar eventos de mouse
        setupMouseEvents(feedNav);
    }
    
    // Configurar eventos de tabs de forma segura
    function setupTabEvents(feedNav) {
        const tabs = feedNav.querySelectorAll('.nav-tab');
        
        // Remover event listeners existentes para evitar conflictos
        tabs.forEach(tab => {
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
        });
        
        // Agregar nuestro event listener unificado
        const newTabs = feedNav.querySelectorAll('.nav-tab');
        newTabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });
        
        console.log(`🎯 ${newTabs.length} tabs configurados con event listeners unificados`);
    }
    
window.handleTabClick = function(event) {
    event.stopPropagation();
    event.preventDefault();
    
    const clickedTab = event.currentTarget;
    const feedNav = clickedTab.closest('.feed-navigation');
    const isActiveTab = clickedTab.classList.contains('active');
    const tabText = clickedTab.textContent.trim();
    const isChainTab = tabText.includes('Chain');
    
    console.log('🎯 handleTabClick ejecutado:', {
        tab: tabText,
        activo: isActiveTab,
        expandido: isExpanded,
        isChain: isChainTab
    });
    
    if (isActiveTab) {
        // ═══════════════════════════════════════════════════
        // CASO 1: Click en tab ACTIVO (toggle expandir/colapsar)
        // ═══════════════════════════════════════════════════
        if (isExpanded) {
            // Sub-caso A: Navegación está expandida → Colapsar y mostrar filtros
            console.log('📁 Colapsando navegación expandida...');
            collapseNavImmediate(feedNav);
            
            // ✅ CHAIN: Esperar MUCHO MÁS para evitar conflictos
            const filterDelay = isChainTab ? 600 : 0;
            
            setTimeout(() => {
                console.log(`🔧 [COLAPSAR] Mostrando filtros después de ${filterDelay}ms delay`);
                showFiltersForActiveTab(clickedTab);
            }, filterDelay);
        } else {
            // Sub-caso B: Navegación está colapsada → Expandir y ocultar filtros
            console.log('📂 Expandiendo navegación (filtros se ocultarán)...');
            hideAllFilters();
            expandNav(feedNav);
        }
    } else {
        // ═══════════════════════════════════════════════════
        // CASO 2: Click en tab DIFERENTE (cambiar sección)
        // ═══════════════════════════════════════════════════
        console.log('🔄 Cambiando a tab diferente...');
        
        // 1️⃣ Colapsar navegación INSTANTÁNEAMENTE (si estaba expandida)
        if (isExpanded) {
            collapseNavImmediate(feedNav);
        }
        
        // 2️⃣ Cambiar tab activo
        changeActiveTab(clickedTab);
        
        // 3️⃣ ✅ CHAIN: Esperar MUCHO MÁS para evitar conflictos
        const filterDelay = isChainTab ? 600 : 0;
        
        setTimeout(() => {
            console.log(`🔧 [CAMBIO TAB] Mostrando filtros después de ${filterDelay}ms delay`);
            showFiltersForActiveTab(clickedTab);
        }, filterDelay);
        
        // 4️⃣ Ejecutar función del sistema
        setTimeout(() => {
            executeTabFunction(clickedTab);
        }, 50);
    }
};

function collapseNavImmediate(feedNav) {
    console.log('⚡ Colapsando navegación INSTANTÁNEAMENTE...');
    
    // Limpiar timer
    clearTimeout(collapseTimer);
    
    // Remover todas las clases de animación
    feedNav.classList.remove('expanded', 'expanding', 'collapsing');
    
    // Actualizar estado
    isExpanded = false;
    
    console.log('✅ Navegación colapsada (sin animación)');
}

    
    // Ejecutar función correspondiente al tab
    function executeTabFunction(tab) {
        const tabText = tab.textContent.trim();
        
        // Detectar función basada en palabras clave (soporta múltiples idiomas)
        let functionName;
        if (tabText.includes('Viral')) {
            functionName = 'showVirales';
        } else if (tabText.includes('Posts')) {
            functionName = 'showPosts';
        } else if (tabText.includes('Chain')) {
            functionName = 'showChain';
        } else if (tabText.includes('Market')) {
            functionName = 'showMarket';
        }
        if (functionName && typeof window[functionName] === 'function') {
            console.log(`🔗 Ejecutando: ${functionName}()`);
            window[functionName]();
        } else {
            console.warn(`⚠️ Función ${functionName} no disponible`);
        }
    }
    
  // Expandir navegación
function expandNav(feedNav) {
    if (isExpanded) return;
    
    console.log('📂 Expandiendo navegación...');
    
    // Limpiar timer anterior
    clearTimeout(collapseTimer);
    
    // ✅ ASEGURAR QUE FILTROS ESTÉN OCULTOS
    hideAllFilters();
    
    // ✅ FORZAR OCULTACIÓN ESPECÍFICA DE CHAIN FILTERS
    const chainFilters = document.getElementById('chainFilters');
    if (chainFilters) {
        chainFilters.style.display = 'none';
        chainFilters.style.visibility = 'hidden';
        chainFilters.style.opacity = '0';
    }
    
    // Agregar clase de expansión
    feedNav.classList.add('expanding');
    feedNav.classList.add('expanded');
    feedNav.classList.remove('collapsing');
    
    isExpanded = true;
    
    // Quitar clase de animación después de completar
    setTimeout(() => {
        feedNav.classList.remove('expanding');
    }, 500);
    
    // Configurar timer para colapsar automáticamente
    collapseTimer = setTimeout(() => {
        collapseNav(feedNav);
    }, COLLAPSE_DELAY);
    
    console.log('✨ Navegación expandida - se colapsará en 5 segundos');
}

    // Colapsar navegación
    function collapseNav(feedNav) {
        if (!isExpanded) return;
        
        console.log('📁 Colapsando navegación...');
        
        // Limpiar timer
        clearTimeout(collapseTimer);
        
        // Agregar clase de colapso
        feedNav.classList.add('collapsing');
        feedNav.classList.remove('expanded');
        feedNav.classList.remove('expanding');
        
        // Esperar a que termine la animación
        setTimeout(() => {
            feedNav.classList.remove('collapsing');
            isExpanded = false;
            
            // Mostrar filtros del tab activo al colapsar (con delay)
            setTimeout(() => {
                const activeTab = feedNav.querySelector('.nav-tab.active');
                if (activeTab) {
                    showFiltersForActiveTab(activeTab);
                }
            }, 100);
            
            console.log('✅ Navegación colapsada');
        }, 500);
    }
    
    // Ocultar todos los filtros
    function hideAllFilters() {
        const postsFilters = document.getElementById('postsFilters');
        const viralesFilters = document.getElementById('viralesFilters');
        const chainFilters = document.getElementById('chainFilters');
        
        if (postsFilters) {
            postsFilters.classList.add('hidden');
            postsFilters.style.display = 'none';
        }
        if (viralesFilters) {
            viralesFilters.classList.add('hidden');
            viralesFilters.style.display = 'none';
        }
        if (chainFilters) {
            chainFilters.classList.add('hidden');
            chainFilters.style.display = 'none';
        }
        
        console.log('🙈 Todos los filtros ocultados');
    }

function showFiltersForActiveTab(tab) {
    const tabText = tab.textContent.trim();
    const postsFilters = document.getElementById('postsFilters');
    const viralesFilters = document.getElementById('viralesFilters');
    const chainFilters = document.getElementById('chainFilters');
    
    console.log(`🔍 showFiltersForActiveTab llamado para: ${tabText}`);
    
    // ✅ OCULTAR TODOS PRIMERO
    if (postsFilters) {
        postsFilters.classList.add('hidden');
        postsFilters.style.display = 'none';
    }
    if (viralesFilters) {
        viralesFilters.classList.add('hidden');
        viralesFilters.style.display = 'none';
    }
    if (chainFilters) {
        chainFilters.classList.add('hidden');
        chainFilters.style.display = 'none';
    }
    
    // ✅ PEQUEÑO DELAY ANTES DE MOSTRAR
    setTimeout(() => {
        if (tabText.includes('Posts') && postsFilters) {
            postsFilters.classList.remove('hidden');
            postsFilters.style.display = 'flex';
            console.log('👁️ Filtros de Posts mostrados');
        } else if (tabText.includes('Viral') && viralesFilters) {
            viralesFilters.classList.remove('hidden');
            viralesFilters.style.display = 'flex';
            console.log('👁️ Filtros de Virales mostrados');
        } else if (tabText.includes('Chain') && chainFilters) {
            chainFilters.classList.remove('hidden');
            chainFilters.style.display = 'flex';
            chainFilters.style.visibility = 'visible';
            chainFilters.style.opacity = '1';
            console.log('👁️ Filtros de Chain mostrados (FORZADO)');
        }
    }, 50);
}

    // Cambiar tab activo
    function changeActiveTab(newTab) {
        const feedNav = newTab.closest('.feed-navigation');
        const allTabs = feedNav.querySelectorAll('.nav-tab');
        
        // Remover active de todos
        allTabs.forEach(tab => tab.classList.remove('active'));
        
        // Agregar active al nuevo
        newTab.classList.add('active');
        
        console.log(`🔄 Tab cambiado a: ${newTab.textContent.trim()}`);
    }
    
    // Manejar clic fuera
    function handleOutsideClick(event) {
        const feedNav = document.querySelector('.feed-navigation');
        if (!feedNav || !isExpanded) return;
        
        // Si el clic fue fuera de la navegación
        if (!feedNav.contains(event.target)) {
            collapseNav(feedNav);
        }
    }
    
    // Configurar eventos de mouse
    function setupMouseEvents(feedNav) {
        // Reiniciar timer al mover el mouse sobre la navegación
        feedNav.addEventListener('mouseenter', () => {
            if (!isExpanded) return;
            
            clearTimeout(collapseTimer);
            collapseTimer = setTimeout(() => {
                collapseNav(feedNav);
            }, COLLAPSE_DELAY);
        });
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initExpandableNav();
        });
    } else {
        initExpandableNav();
    }
    
    // Exponer funciones globales para debugging
    window.ExpandableNavSystem = {
        expand: function() {
            const feedNav = document.querySelector('.feed-navigation');
            if (feedNav) expandNav(feedNav);
        },
        collapse: function() {
            const feedNav = document.querySelector('.feed-navigation');
            if (feedNav) collapseNav(feedNav);
        },
        isExpanded: function() {
            return isExpanded;
        },
        hideFilters: hideAllFilters,
        debug: function() {
            console.log('🐛 DEBUG ExpandableNavSystem:', {
                isExpanded: isExpanded,
                feedNav: document.querySelector('.feed-navigation')?.className,
                tabs: document.querySelectorAll('.nav-tab').length,
                postsFiltersVisible: document.getElementById('postsFilters')?.style.display !== 'none',
                viralesFiltersVisible: document.getElementById('viralesFilters')?.style.display !== 'none',
                chainFiltersVisible: document.getElementById('chainFilters')?.style.display !== 'none'
            });
        }
    };
    
    console.log('🚀 Sistema de navegación expandible v1.0.3 (FIX CHAIN) cargado');
    
})();