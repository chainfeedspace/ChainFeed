// ============================================
// COORDINADOR MAESTRO DE NAVEGACIÓN - VERSIÓN CORREGIDA
// Este archivo REEMPLAZA: unified-tab-system.js Y unified-posts-filter.js
// Nombre: master-navigation.js
// ============================================

(function() {
    'use strict';
    
    console.log('🎯 Iniciando Coordinador Maestro de Navegación v2.0');
    
    // ============================================
    // ESTADO GLOBAL UNIFICADO
    // ============================================
    
    window.AppState = {
        currentFeedType: 'posts', // 'posts', 'virales', 'chain', 'market'
        currentFilter: 'todos', // 'todos', 'seguidos' (solo para posts)
        mainContainer: null,
        isTransitioning: false,
        chainFiltersConnected: false,
        observers: {
            viral: null,
            normal: null
        }
    };
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    
function initialize() {
    console.log('🚀 Inicializando sistema maestro...');
    
    AppState.mainContainer = document.getElementById('feedPosts');
    if (!AppState.mainContainer) {
        console.error('❌ Main container #feedPosts not found');
        return;
    }
    
    setupFilterListeners();
    
    // ✅ VERIFICAR SECCIÓN GUARDADA
    const savedSection = localStorage.getItem('chainfeed_current_section');
    if (savedSection === 'market') {
        updateFiltersVisibility('market');
        // No hacer nada más, inicio.js se encargará
    } else {
        updateFiltersVisibility('posts');
    }
    
    console.log('✅ Sistema maestro inicializado');
}
    
    // ============================================
    // GESTIÓN DE FILTROS (Todos/Seguidos)
    // ============================================
    
    function setupFilterListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const filter = btn.dataset.filter;
                if (filter && AppState.currentFeedType === 'posts') {
                    filterPosts(filter);
                }
            });
        });
        
        console.log('✅ Listeners de filtros configurados');
    }
    
    function filterPosts(filterType) {
        if (AppState.currentFeedType !== 'posts') {
            console.warn('⚠️ Filtros solo disponibles en Posts');
            return;
        }
        
        console.log('🔍 Filtrando posts por:', filterType);
        
        AppState.currentFilter = filterType;
        
        // Actualizar UI de botones
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filterType) {
                btn.classList.add('active');
            }
        });
        
        // Cargar contenido según filtro
        if (filterType === 'todos') {
            if (typeof loadFeedPosts === 'function') {
                loadFeedPosts(false);
            }
} else if (filterType === 'seguidos') {
    if (typeof loadFeedSeguidos === 'function') {
        loadFeedSeguidos(false);
    }
} else if (filterType === 'coleccion') { 
    if (typeof loadFeedColeccion === 'function') {
        loadFeedColeccion(false);
    } else {
        console.warn('⚠️ loadFeedColeccion no disponible');
    }
}
    }
    
// ============================================
// CONTROL DE VISIBILIDAD DE FILTROS - CORREGIDO CON CHAIN
// ============================================

function updateFiltersVisibility(section) {
    const viralesFilters = document.getElementById('viralesFilters');
    const postsFilters = document.getElementById('postsFilters');
    const chainFilters = document.getElementById('chainFilters');
    
    console.log(`🔧 updateFiltersVisibility llamado para: ${section}`);
    
    const feedNav = document.querySelector('.feed-navigation');
    const isNavExpanded = feedNav && (
        feedNav.classList.contains('expanded') || 
        feedNav.classList.contains('expanding')
    );
    
    // ✅ CHAIN se maneja por separado (op_ini_viinichamar lo controla)
    if (isNavExpanded && section !== 'chain') {
        console.log('   ⚠️ Navegación expandida - ocultando filtros (excepto Chain)');
        
        if (viralesFilters) {
            viralesFilters.classList.add('hidden');
            viralesFilters.style.display = 'none';
        }
        if (postsFilters) {
            postsFilters.classList.add('hidden');
            postsFilters.style.display = 'none';
        }
        
        return;
    }
    
    // Ocultar todos
    [viralesFilters, postsFilters, chainFilters].forEach(f => {
        if (f) {
            f.classList.add('hidden');
            f.style.display = 'none';
        }
    });
    
    // Mostrar el correcto
    if (section === 'posts' && postsFilters) {
        postsFilters.classList.remove('hidden');
        postsFilters.style.display = 'flex';
        console.log('   ✅ Filtros de Posts mostrados');
    } else if (section === 'virales' && viralesFilters) {
        viralesFilters.classList.remove('hidden');
        viralesFilters.style.display = 'flex';
        console.log('   ✅ Filtros de Virales mostrados');
    } else if (section === 'chain' && chainFilters) {
        // NO hacer nada aquí - op_ini_viinichamar lo manejará
        console.log('   ⏭️ Chain: filtros manejados por op_ini_viinichamar');
        
        if (!AppState.chainFiltersConnected) {
            setupChainFilterListeners();
            AppState.chainFiltersConnected = true;
        }
    }
}
    // ============================================
    // LIMPIEZA COMPLETA DE CONTENIDO
    // ============================================
    
    function clearAllContent() {
        console.log('🧹 Limpiando todo el contenido...');
        
        // Desconectar observers
        disconnectAllObservers();
        
        // Limpiar contenedor principal
        if (AppState.mainContainer) {
            AppState.mainContainer.innerHTML = '';
            AppState.mainContainer.style.display = 'flex';
            AppState.mainContainer.className = 'feed-posts';
        }
        
        // Remover contenedores específicos
        removeSpecificContainers();
        
        // Resetear estados
        resetGlobalStates();
        
        console.log('✅ Contenido limpiado');
    }
    
    function disconnectAllObservers() {
        if (window.viralScrollObserver) {
            window.viralScrollObserver.disconnect();
            window.viralScrollObserver = null;
        }
        
        if (window.normalScrollObserver) {
            window.normalScrollObserver.disconnect();
            window.normalScrollObserver = null;
        }
        
        if (AppState.observers.viral) {
            AppState.observers.viral.disconnect();
            AppState.observers.viral = null;
        }
        
        if (AppState.observers.normal) {
            AppState.observers.normal.disconnect();
            AppState.observers.normal = null;
        }
    }
    
    function removeSpecificContainers() {
        const selectors = [
            '#chain-events-container',
            '#viral-posts-container',
            '#temp-error-container',
            '.chain-event-card',
            '[id*="chain"]:not(#chainFlashViewer)',
            '[class*="viral-container"]'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    }
    
    function resetGlobalStates() {
        if (typeof ViralFeedState !== 'undefined') {
            ViralFeedState.isActive = false;
            ViralFeedState.currentPage = 1;
            ViralFeedState.isLoading = false;
            ViralFeedState.hasMore = true;
        }
        
        if (typeof chainEventsData !== 'undefined') {
            window.chainEventsData = [];
        }
        
        if (typeof chainPagination !== 'undefined') {
            window.chainPagination = {
                offset: 0,
                limit: 20,
                hasMore: true
            };
        }
    }
    
    // ============================================
    // ACTUALIZAR TAB ACTIVO
    // ============================================
    
    function updateActiveTab(activeButton) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        if (activeButton && activeButton.classList) {
            activeButton.classList.add('active');
        }
        
        console.log(`📑 Tab activo: ${AppState.currentFeedType}`);
    }
    
    // ============================================
    // FUNCIÓN: MOSTRAR POSTS
    // ============================================
    
    window.showPosts = async function() {
            if (AppState.currentFeedType === 'posts') {
        console.log('⏭️ showPosts() SALTADO - ya estamos en posts');
        return;
    }
    
    if (AppState.isTransitioning) return;
        
        try {
            console.log('📄 Navegando a: Posts');
            AppState.isTransitioning = true;
            
            // Limpiar todo
            clearAllContent();
            
            // Actualizar estado
            AppState.currentFeedType = 'posts';
            AppState.currentFilter = 'todos';
            
            // Actualizar tab activo
            const postsTab = Array.from(document.querySelectorAll('.nav-tab')).find(tab => 
                tab.textContent.includes('Posts')
            );
            updateActiveTab(postsTab);
            
            // ✅ MOSTRAR FILTROS DE POSTS
            updateFiltersVisibility('posts');
            
            // Resetear filtro a "Todos"
            const todosBtn = document.querySelector('.filter-btn[data-filter="todos"]');
            if (todosBtn) {
                todosBtn.classList.add('active');
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    if (btn !== todosBtn) btn.classList.remove('active');
                });
            }
            
            // Mostrar loading
            showSectionLoading('posts');
            
            // Cargar posts
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (typeof loadFeedPosts === 'function') {
                await loadFeedPosts(false);
            } else {
                throw new Error('loadFeedPosts no disponible');
            }
            
            console.log('✅ Posts cargados');
            
                    setTimeout(() => {
            const feedNav = document.querySelector('.feed-navigation');
            if (feedNav && feedNav.classList.contains('expanded')) {
                if (window.ExpandableNavSystem?.collapse) {
                    window.ExpandableNavSystem.collapse();
                }
            }
        }, 300);

        } catch (error) {
            console.error('❌ Error en showPosts:', error);
            showNotificationUnified('Error al cargar posts', 'error');
            showErrorState('posts');
        } finally {
            AppState.isTransitioning = false;
        }
    };
    
    // ============================================
    // FUNCIÓN: MOSTRAR VIRALES
    // ============================================
    
window.showVirales = async function() {
        if (AppState.currentFeedType === 'virales') {
        console.log('⏭️ showVirales() SALTADO - ya estamos en virales');
        return;
    }
    
    if (AppState.isTransitioning) return;
    
    try {
        console.log('🔥 Navegando a: Virales');
        AppState.isTransitioning = true;
        
        // Limpiar todo
        clearAllContent();
        
        // Actualizar estado
        AppState.currentFeedType = 'virales';
        
        // Actualizar tab
        const viralesTab = Array.from(document.querySelectorAll('.nav-tab')).find(tab => 
            tab.textContent.includes('Virales')
        );
        updateActiveTab(viralesTab);
        
        // ✅ MOSTRAR FILTROS DE VIRALES
        updateFiltersVisibility('virales');
        
        // ✅ ASEGURAR QUE "24h" ESTÉ ACTIVO (NUEVO)
        setTimeout(() => {
            const viralesFilters = document.getElementById('viralesFilters');
            if (viralesFilters) {
                const btn24h = viralesFilters.querySelector('[data-viral-period="24h"]');
                if (btn24h && !btn24h.classList.contains('active')) {
                    // Remover active de todos
                    viralesFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    // Activar 24h
                    btn24h.classList.add('active');
                    console.log('✅ Filtro "24h" reactivado');
                }
            }
        }, 100);
        
        // Mostrar loading
        showSectionLoading('virales');
        
        // Cargar virales
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (typeof loadViralPosts === 'function') {
            loadViralPosts();
        } else {
            throw new Error('loadViralPosts no disponible');
        }
        
        console.log('✅ Virales cargados');
        
                setTimeout(() => {
            const feedNav = document.querySelector('.feed-navigation');
            if (feedNav && feedNav.classList.contains('expanded')) {
                if (window.ExpandableNavSystem?.collapse) {
                    window.ExpandableNavSystem.collapse();
                }
            }
        }, 300);

    } catch (error) {
        console.error('❌ Error en showVirales:', error);
        showNotificationUnified('Error al cargar virales', 'error');
        showErrorState('virales');
    } finally {
        AppState.isTransitioning = false;
    }
};
    // ============================================
    // FUNCIÓN: MOSTRAR CHAIN - CORREGIDO
    // ============================================
    
window.showChain = async function() {
    if (AppState.currentFeedType === 'chain') {
        console.log('⏭️ showChain() SALTADO - ya estamos en chain');
        return;
    }
    
    if (AppState.isTransitioning) {
        console.warn('⚠️ Ya hay una transición en curso');
        return;
    }
        
    try {
        console.log('⛓️ INICIANDO NAVEGACIÓN A CHAIN');
        AppState.isTransitioning = true;
        
        clearAllContent();
        AppState.currentFeedType = 'chain';
        
        const chainTab = Array.from(document.querySelectorAll('.nav-tab')).find(tab => 
            tab.textContent.includes('Chain')
        );
        updateActiveTab(chainTab);
        
        if (!AppState.mainContainer) {
            throw new Error('Main container no encontrado');
        }
        
        AppState.mainContainer.innerHTML = '';
        AppState.mainContainer.style.display = 'block';
        AppState.mainContainer.className = 'feed-posts';
        
        const chainContainer = document.createElement('div');
        chainContainer.id = 'chain-events-container';
        chainContainer.style.cssText = `
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 1rem;
            min-height: 400px;
            background: transparent;
        `;
        
        AppState.mainContainer.appendChild(chainContainer);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (typeof loadChainContent !== 'function') {
            throw new Error('loadChainContent no está disponible');
        }
        
        loadChainContent();
        
        console.log('⛓️ NAVEGACIÓN A CHAIN COMPLETADA');
        
        // ✅ Colapsar navegación (op_ini_viinichamar se encargará de mostrar filtros)
        setTimeout(() => {
            const feedNav = document.querySelector('.feed-navigation');
            if (feedNav && feedNav.classList.contains('expanded')) {
                if (window.ExpandableNavSystem?.collapse) {
                    window.ExpandableNavSystem.collapse();
                }
            }
        }, 300);

    } catch (error) {
        console.error('❌ ERROR EN showChain:', error);
        showNotificationUnified(`Error al cargar chains: ${error.message}`, 'error');
        showErrorState('chain');
    } finally {
        AppState.isTransitioning = false;
    }
};
    
    // ============================================
    // FUNCIÓN: MOSTRAR MARKET - CORREGIDO
    // ============================================
    
  window.showMarket = async function() {
        if (AppState.currentFeedType === 'market') {
        console.log('⏭️ showMarket() SALTADO - ya estamos en market');
        return;
    }
    
    if (AppState.isTransitioning) return;
    
    try {
        console.log('💰 Navegando a: Market');
        AppState.isTransitioning = true;
        
        // Limpiar todo
        clearAllContent();
        
        // Actualizar estado
        AppState.currentFeedType = 'market';
        
        // Actualizar tab
        const marketTab = Array.from(document.querySelectorAll('.nav-tab')).find(tab => 
            tab.textContent.includes('Market')
        );
        updateActiveTab(marketTab);
        
        // ✅ OCULTAR TODOS LOS FILTROS
        updateFiltersVisibility('market');
        
        // ✅ LLAMAR A loadMarketPosts() EN LUGAR DE MOSTRAR PLACEHOLDER
        if (typeof loadMarketPosts === 'function') {
            await loadMarketPosts(false);
        } else {
            // Fallback: mostrar placeholder si no existe loadMarketPosts
            if (AppState.mainContainer) {
                AppState.mainContainer.innerHTML = `
                    <div style="text-align: center; padding: 4rem 2rem; background: rgba(26, 26, 36, 0.5); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">💰</div>
                        <h2 style="color: var(--primary); margin-bottom: 1rem;">Market ChainFeed</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Esta funcionalidad estará disponible próximamente</p>
                    </div>
                `;
            }
        }

                setTimeout(() => {
            const feedNav = document.querySelector('.feed-navigation');
            if (feedNav && feedNav.classList.contains('expanded')) {
                if (window.ExpandableNavSystem?.collapse) {
                    window.ExpandableNavSystem.collapse();
                }
            }
        }, 300);
        
    } catch (error) {
        console.error('❌ Error en showMarket:', error);
        showNotificationUnified('Error al cargar market', 'error');
    } finally {
        AppState.isTransitioning = false;
    }
};

/**
 * Verificar si estamos en Market sin recargar
 */
window.isCurrentlyInMarket = function() {
    return AppState.currentFeedType === 'market';
};

/**
 * Actualizar solo el contador del header de Market
 */
window.updateMarketHeaderCount = function(newCount) {
    if (!isCurrentlyInMarket()) return;
    
    const statNumber = document.querySelector('.market-header .stat-number');
    if (statNumber) {
        statNumber.textContent = formatNumber(newCount);
        console.log(`✅ Contador Market actualizado: ${newCount}`);
    }
};
    
    // ============================================
    // ESTADOS DE LOADING Y ERROR
    // ============================================
    
    function showSectionLoading(sectionName) {
        if (!AppState.mainContainer) return;
        
        AppState.mainContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; min-height: 50vh;">
                <div style="width: 50px; height: 50px; border: 4px solid rgba(99, 102, 241, 0.3); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 1.5rem; color: var(--text-secondary); font-size: 1rem;">Cargando ${sectionName}...</p>
            </div>
        `;
    }
    
    function showErrorState(sectionName) {
        if (!AppState.mainContainer) return;
        
        const retryFunctions = {
            'posts': 'showPosts()',
            'virales': 'showVirales()',
            'chain': 'showChain()',
            'market': 'showMarket()'
        };
        
        AppState.mainContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Error al cargar ${sectionName}</h3>
                <p>No pudimos cargar el contenido. Intenta nuevamente.</p>
                <button onclick="${retryFunctions[sectionName]}" 
                        style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Reintentar
                </button>
            </div>
        `;
    }
    
    // ============================================
    // NOTIFICACIONES
    // ============================================
    
    function showNotificationUnified(message, type = "info") {
        if (typeof window.showNotification === 'function') {
            return window.showNotification(message, type);
        }
        
        console.log(`${type.toUpperCase()}: ${message}`);
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            background: rgba(26, 26, 36, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            color: white;
            z-index: 10000;
            max-width: 350px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            ${type === 'error' ? 'border-left: 4px solid #ef4444;' : ''}
        `;
        
        const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        notification.textContent = `${icon} ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ============================================
    // ESTILOS
    // ============================================
    
    if (!document.getElementById('master-navigation-styles')) {
        const style = document.createElement('style');
        style.id = 'master-navigation-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .hidden {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // EXPORTAR FUNCIONES AUXILIARES
    // ============================================
    
    window.filterPosts = filterPosts;
    window.updateFiltersVisibility = updateFiltersVisibility;
    
window.MasterNavigation = {
    state: AppState,
    clearAll: clearAllContent,
    updateFilters: updateFiltersVisibility,
    debug: function() {
        console.log('🐛 Estado del Coordinador Maestro:', {
            currentFeedType: AppState.currentFeedType,
            currentFilter: AppState.currentFilter,
            isTransitioning: AppState.isTransitioning,
            mainContainer: !!AppState.mainContainer,
            postsFiltersVisible: !document.getElementById('postsFilters')?.classList.contains('hidden'),
            viralesFiltersVisible: !document.getElementById('viralesFilters')?.classList.contains('hidden'),
            chainFiltersVisible: !document.getElementById('chainFilters')?.classList.contains('hidden') // ✅ AGREGAR
        });
    }
};
    
    // ============================================
    // INICIALIZAR AL CARGAR
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    console.log('✅ Coordinador Maestro de Navegación v2.0 cargado');

// ============================================
// SISTEMA DE FILTROS PARA CHAIN - VERSIÓN COMPLETA
// ============================================

function setupChainFilterListeners() {
    console.log('🔌 Configurando listeners de filtros Chain...');
    
    // Intentar cada 500ms hasta que chainFilters exista
    const maxRetries = 10;
    let retries = 0;
    
    const trySetup = setInterval(() => {
        const chainFilters = document.getElementById('chainFilters');
        
        if (chainFilters) {
            clearInterval(trySetup);
            
            const filterButtons = chainFilters.querySelectorAll('.filter-btn');
            
            if (filterButtons.length === 0) {
                console.warn('⚠️ chainFilters existe pero no tiene botones');
                return;
            }
            
            filterButtons.forEach(btn => {
                // Clonar para remover listeners antiguos
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // Agregar nuevo listener
                newBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    const filterType = newBtn.dataset.filter;
                    console.log(`🎯 Click en filtro Chain: ${filterType}`);
                    
                    // Actualizar botones activos
                    chainFilters.querySelectorAll('.filter-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                    newBtn.classList.add('active');
                    
                    // Aplicar filtro
                    filterChainEvents(filterType);
                });
            });
            
            console.log(`✅ ${filterButtons.length} filtros Chain conectados`);
        } else {
            retries++;
            if (retries >= maxRetries) {
                clearInterval(trySetup);
                console.warn('⚠️ chainFilters no encontrado después de múltiples intentos');
            }
        }
    }, 500);
}

async function filterChainEvents(filterType) {
    console.log(`🔍 Filtrando eventos Chain por: ${filterType}`);
    
    try {
        // Mostrar loading
        if (typeof showSectionLoading === 'function') {
            showSectionLoading('chain');
        }
        
        // Determinar tipo de evento para la API
        let tipoEvento = null;
        
        switch(filterType) {
            case 'encuestas':
                tipoEvento = 'encuesta';
                break;
            case 'campañas':
                // Campañas incluyen: imagen, video, texto
                tipoEvento = 'campaña';
                break;
            case 'audio':
                tipoEvento = 'audio';
                break;
            case 'todos':
            default:
                tipoEvento = null; // null = todos
                break;
        }
        
        console.log(`   📋 Tipo de evento para API: ${tipoEvento || 'todos'}`);
        
        // Verificar que loadChainContent exista
        if (typeof loadChainContent !== 'function') {
            throw new Error('loadChainContent no está disponible');
        }
        
        // Llamar a loadChainContent con el filtro
        await loadChainContent(tipoEvento);
        
        console.log(`✅ Filtro Chain aplicado exitosamente: ${filterType}`);
        
    } catch (error) {
        console.error('❌ Error filtrando eventos Chain:', error);
        
        if (typeof showNotificationUnified === 'function') {
            showNotificationUnified(`Error al filtrar: ${error.message}`, 'error');
        }
        
        if (typeof showErrorState === 'function') {
            showErrorState('chain');
        }
    }
}

// Exponer funciones globalmente
window.setupChainFilterListeners = setupChainFilterListeners;
window.filterChainEvents = filterChainEvents;

console.log('✅ Sistema de filtros Chain cargado');

})();