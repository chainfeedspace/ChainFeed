// ============================================
// SISTEMA DE FILTROS PARA CHAIN
// ============================================

(function() {
    'use strict';
    
    // Estado del filtro de Chain
    let currentChainFilter = 'todos'; // 'todos', 'encuestas', 'campañas', 'audio'
    
    /**
     * Crear contenedor de filtros para Chain
     */
    function createChainFilters() {
        const existingFilters = document.getElementById('chainFilters');
        if (existingFilters) {
            console.log('⚠️ Filtros de Chain ya existen');
            return;
        }
        
        const chainFilters = document.createElement('div');
        chainFilters.id = 'chainFilters';
        chainFilters.className = 'feed-filters hidden';
        
        chainFilters.innerHTML = `
            <button class="filter-btn active" data-filter="todos" title="Todos los eventos">
                🔗
            </button>
            <button class="filter-btn" data-filter="encuestas" title="Solo encuestas">
                📊
            </button>
            <button class="filter-btn" data-filter="campañas" title="Solo campañas">
                🎯
            </button>
            <button class="filter-btn" data-filter="audio" title="Solo eventos de audio">
                🎵
            </button>
        `;
        
        // Insertar después de la navegación
        const feedNav = document.querySelector('.feed-navigation');
        if (feedNav) {
            feedNav.parentNode.insertBefore(chainFilters, feedNav.nextSibling);
            console.log('✅ Filtros de Chain creados');
        } else {
            console.error('❌ No se encontró .feed-navigation');
            return;
        }
        
        // Configurar event listeners
        setupChainFilterEvents(chainFilters);
    }
    
    /**
     * Configurar eventos de los filtros
     */
    function setupChainFilterEvents(chainFilters) {
        const filterButtons = chainFilters.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const filterType = btn.dataset.filter;
                
                // Actualizar botones activos
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Aplicar filtro
                filterChainEvents(filterType);
            });
        });
        
        console.log('✅ Event listeners de filtros Chain configurados');
    }
    
    /**
     * Filtrar eventos de Chain según tipo
     */
    async function filterChainEvents(filterType) {
        console.log(`🔍 Filtrando eventos Chain: ${filterType}`);
        
        currentChainFilter = filterType;
        
        // Limpiar estado del feed
        if (window.FeedState) {
            window.FeedState.posts = [];
            window.FeedState.currentOffset = 0;
            window.FeedState.hasMore = true;
        }
        
        try {
            // Mostrar spinner
            if (typeof showLoadingSpinner === 'function') {
                showLoadingSpinner();
            }
            
            // Determinar parámetro de tipo para la API
            let tipoEvento = null;
            if (filterType === 'encuestas') tipoEvento = 'encuesta';
            else if (filterType === 'campañas') tipoEvento = 'campaña';
            else if (filterType === 'audio') tipoEvento = 'audio';
            
            // Llamar a la API de Chain
            const response = await fetch('../php/obtener_feed_inicio.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    limit: 20,
                    offset: 0,
                    tipo: 'chain_event', // Solo eventos de Chain
                    subtipo_chain: tipoEvento // Filtro específico
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Error al cargar eventos');
            }
            
            // Actualizar FeedState
            if (window.FeedState) {
                window.FeedState.posts = data.publicaciones;
                window.FeedState.totalPosts = data.pagination.total;
                window.FeedState.hasMore = data.pagination.has_more;
                window.FeedState.currentOffset = data.pagination.next_offset || 0;
            }
            
            // Renderizar posts
            if (typeof renderFeedPosts === 'function') {
                renderFeedPosts(false);
            }
            
            console.log(`✅ ${data.publicaciones.length} eventos cargados`);
            
            // Mostrar mensaje si no hay resultados
            if (data.publicaciones.length === 0) {
                showEmptyChainState(filterType);
            }
            
        } catch (error) {
            console.error('❌ Error filtrando eventos Chain:', error);
            if (typeof showNotification === 'function') {
                showNotification(`Error al cargar eventos: ${error.message}`, 'error');
            }
        } finally {
            if (typeof hideLoadingSpinner === 'function') {
                hideLoadingSpinner();
            }
        }
    }
    
    /**
     * Mostrar estado vacío para Chain
     */
    function showEmptyChainState(filterType) {
        const feedContainer = document.getElementById('feedPosts');
        if (!feedContainer) return;
        
        const filterNames = {
            'todos': 'eventos',
            'encuestas': 'encuestas',
            'campañas': 'campañas',
            'audio': 'eventos de audio'
        };
        
        const filterIcons = {
            'todos': '🔗',
            'encuestas': '📊',
            'campañas': '🎯',
            'audio': '🎵'
        };
        
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary); background: rgba(26, 26, 36, 0.5); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 2rem auto; max-width: 600px;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${filterIcons[filterType]}</div>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">No hay ${filterNames[filterType]}</h3>
                <p style="margin-bottom: 2rem; line-height: 1.6;">
                    No se encontraron ${filterNames[filterType]} en este momento.
                </p>
                <button onclick="window.ChainFilters.resetFilter()" 
                        style="padding: 0.8rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                    Ver todos los eventos
                </button>
            </div>
        `;
    }
    
    /**
     * Mostrar filtros de Chain
     */
    function showChainFilters() {
        const chainFilters = document.getElementById('chainFilters');
        const postsFilters = document.getElementById('postsFilters');
        const viralesFilters = document.getElementById('viralesFilters');
        
        // Ocultar otros filtros
        if (postsFilters) postsFilters.classList.add('hidden');
        if (viralesFilters) viralesFilters.classList.add('hidden');
        
        // Mostrar filtros de Chain
        if (chainFilters) {
            chainFilters.classList.remove('hidden');
            console.log('👁️ Filtros de Chain mostrados');
        }
    }
    
    /**
     * Resetear filtro a "todos"
     */
    function resetChainFilter() {
        const chainFilters = document.getElementById('chainFilters');
        if (!chainFilters) return;
        
        // Activar botón "todos"
        const allButtons = chainFilters.querySelectorAll('.filter-btn');
        allButtons.forEach(btn => {
            if (btn.dataset.filter === 'todos') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Aplicar filtro
        filterChainEvents('todos');
    }
    
    /**
     * Obtener filtro actual
     */
    function getCurrentFilter() {
        return currentChainFilter;
    }
    
    // Inicializar cuando el DOM esté listo
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createChainFilters);
        } else {
            createChainFilters();
        }
    }
    
    // Exponer funciones globalmente
    window.ChainFilters = {
        filter: filterChainEvents,
        show: showChainFilters,
        reset: resetChainFilter,
        getCurrentFilter: getCurrentFilter,
        init: createChainFilters
    };
    
    // Inicializar
    init();
    
    console.log('✅ Sistema de filtros Chain cargado');
    
})();

// ============================================
// INTEGRAR CON SISTEMA DE NAVEGACIÓN
// ============================================

// Modificar la función showChain existente
const originalShowChain = window.showChain;

window.showChain = function() {
    console.log('⛓️ Mostrando sección Chain con filtros');
    
    // Llamar a la función original
    if (originalShowChain) {
        originalShowChain();
    }
    
    // Mostrar filtros de Chain
    if (window.ChainFilters) {
        window.ChainFilters.show();
    }
    
    // Aplicar filtro actual
    const currentFilter = window.ChainFilters?.getCurrentFilter() || 'todos';
    if (window.ChainFilters) {
        window.ChainFilters.filter(currentFilter);
    }
};

console.log('✅ Integración de filtros Chain con navegación lista');