// ============================================
// SISTEMA DE FILTROS DE POSTS
// Archivo: /js/unified-posts-filter.js
// ============================================

let currentPostFilter = 'seguidos'; // Estado global del filtro activo (CAMBIADO A SEGUIDOS)
    
function filterPosts(filterType) {
    console.log('Cambiando filtro a:', filterType);
    
    // Actualizar estado global
    currentPostFilter = filterType;
    
    // Actualizar botones activos y visibilidad de texto
    const filterButtons = document.querySelectorAll('#postsFilters .filter-btn');
    filterButtons.forEach(btn => {
        const isActive = btn.dataset.filter === filterType;
        
        if (isActive) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Ejecutar lógica según el filtro
    switch(filterType) {
        case 'todos':
            console.log('Mostrando todos los posts');
            if (typeof loadFeedPosts === 'function') {
                loadFeedPosts(false);
            } else {
                console.error('loadFeedPosts no está disponible');
            }
            break;
            
        case 'seguidos':
            console.log('Cargando posts de seguidos');
            if (typeof loadFeedSeguidos === 'function') {
                loadFeedSeguidos(false);
            } else {
                console.error('loadFeedSeguidos no está disponible');
            }
            break;
            
        case 'coleccion':
            console.log('Cargando posts de colección');
            if (typeof loadFeedColeccion === 'function') {
                loadFeedColeccion(false);
            } else {
                console.error('loadFeedColeccion no está disponible');
            }
            break;
            
        default:
            console.warn('Filtro desconocido:', filterType);
            if (typeof loadFeedPosts === 'function') {
                loadFeedPosts(false);
            }
    }
}

/**
 * Cargar feed de usuarios seguidos
 */
async function loadFeedSeguidos(append = false) {
    if (FeedState.isLoading) return;
    
    try {
        FeedState.isLoading = true;
        showLoadingSpinner();

        const response = await fetch('../php/obtener_feed_inicio.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                limit: FeedState.limit,
                offset: append ? FeedState.currentOffset : 0,
                solo_seguidos: true // ✅ PARÁMETRO CLAVE
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar posts de seguidos');
        }

        if (!data.success) {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }

        // Actualizar estado del feed
        if (append) {
            FeedState.posts = [...FeedState.posts, ...data.publicaciones];
        } else {
            FeedState.posts = data.publicaciones;
            FeedState.currentOffset = 0;
        }

        // Actualizar información de paginación
        FeedState.totalPosts = data.pagination.total;
        FeedState.hasMore = data.pagination.has_more;
        FeedState.currentOffset = data.pagination.next_offset || FeedState.currentOffset;

        // Renderizar posts
        renderFeedPosts(append);

        // Configurar scroll infinito
        if (!append) {
            setupInfiniteScroll();
        }

        console.log(`✅ Feed de seguidos cargado: ${data.publicaciones.length} posts`);

        // Mostrar mensaje si no sigue a nadie o no hay posts
        if (FeedState.posts.length === 0 && !append) {
            showEmptyFollowingState();
        }

    } catch (error) {
        console.error('❌ Error cargando feed de seguidos:', error);
        showNotification(`Error al cargar posts de seguidos: ${error.message}`, 'error');
        showErrorState();
    } finally {
        FeedState.isLoading = false;
        hideLoadingSpinner();
    }
}

/**
 * Mostrar estado vacío cuando no hay seguidos
 */
function showEmptyFollowingState() {
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer && FeedState.posts.length === 0) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary); background: rgba(26, 26, 36, 0.5); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 2rem auto; max-width: 600px;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">👥</div>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">No hay posts de tus seguidos</h3>
                <p style="margin-bottom: 2rem; line-height: 1.6;">
                    Los usuarios que sigues aún no han publicado nada, o no tienes usuarios seguidos.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="filterPosts('todos')" 
                            style="padding: 0.8rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                        Ver todos los posts
                    </button>
                    <button onclick="window.location.href='/buscar.html'" 
                            style="padding: 0.8rem 1.5rem; background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                        Buscar usuarios
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Mostrar/ocultar filtros según la sección activa
 */
function togglePostsFilters(show) {
    const filtersContainer = document.getElementById('postsFilters');
    if (!filtersContainer) return;
    
    if (show) {
        filtersContainer.classList.remove('hidden');
        // ✅ Resetear a "Seguidos" al mostrar
        currentPostFilter = 'seguidos';
        const seguidosBtn = filtersContainer.querySelector('[data-filter="seguidos"]');
        if (seguidosBtn && !seguidosBtn.classList.contains('active')) {
            filterPosts('seguidos');
        }
    } else {
        filtersContainer.classList.add('hidden');
    }
}

// ============================================
// INTEGRACIÓN CON SISTEMA DE TABS
// ============================================

(function() {
    // Guardar referencia a la función original si existe
    const originalShowPosts = window.showPosts;
    
    // Sobrescribir showPosts para incluir los filtros
    window.showPosts = function() {
        console.log('Activando sección Posts con filtros');
        
        // Llamar a la función original si existe
        if (originalShowPosts && typeof originalShowPosts === 'function') {
            originalShowPosts();
        }
        
        // Mostrar los filtros de posts
        togglePostsFilters(true);
        
        // ✅ Asegurarse de que "Seguidos" esté activo por defecto
        if (typeof filterPosts === 'function') {
            filterPosts('seguidos');
        }
    };
    
    console.log('Sistema de filtros de Posts integrado');
})();

/**
 * Extender otras funciones de tabs para ocultar filtros
 */
(function() {
    // Guardar referencias a funciones originales
    const originalShowVirales = window.showVirales;
    const originalShowChain = window.showChain;
    const originalShowMarket = window.showMarket;
    
    // Sobrescribir showVirales
    window.showVirales = function() {
        if (originalShowVirales && typeof originalShowVirales === 'function') {
            originalShowVirales();
        }
        togglePostsFilters(false);
    };
    
    // Sobrescribir showChain
    window.showChain = function() {
        if (originalShowChain && typeof originalShowChain === 'function') {
            originalShowChain();
        }
        togglePostsFilters(false);
    };
    
    // Sobrescribir showMarket
    window.showMarket = function() {
        if (originalShowMarket && typeof originalShowMarket === 'function') {
            originalShowMarket();
        }
        togglePostsFilters(false);
    };
    
    console.log('Filtros configurados para ocultarse en otras secciones');
})();

/**
 * Inicializar filtros al cargar la página
 */
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la sección Posts (tab activo por defecto), mostrar filtros
    const activeTab = document.querySelector('.nav-tab.active');
    if (activeTab && activeTab.textContent.includes('Posts')) {
        togglePostsFilters(true);
    } else {
        togglePostsFilters(false);
    }
    
    console.log('Sistema de filtros de Posts inicializado');
});

/**
 * Función auxiliar para verificar si estamos en la sección Posts
 */
function isPostsSectionActive() {
    const activeTab = document.querySelector('.nav-tab.active');
    return activeTab && activeTab.textContent.includes('Posts');
}

// Exportar funciones para uso global
window.filterPosts = filterPosts;
window.loadFeedSeguidos = loadFeedSeguidos;
window.togglePostsFilters = togglePostsFilters;
window.isPostsSectionActive = isPostsSectionActive;

// ✅ Asegurar que loadFeedColeccion esté disponible (se carga desde inicio.js)
window.loadFeedColeccion = window.loadFeedColeccion || function() {
    console.error('❌ loadFeedColeccion no está cargado aún desde inicio.js');
};

console.log('✅ unified-posts-filter.js cargado correctamente con soporte para Colección');