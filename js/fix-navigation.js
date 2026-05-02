// ============================================
// CORRECCIÓN DE NAVEGACIÓN Y FILTRADO
// ============================================

/**
 * PROBLEMA IDENTIFICADO:
 * 1. Los chips de filtro no se ocultan al cambiar de sección
 * 2. Las funciones showPosts, showChain, etc. no limpian correctamente el estado
 * 3. Chain intenta cargar como posts en lugar de usar obtener_chain.php
 */

// ============================================
// ESTADO GLOBAL DE NAVEGACIÓN
// ============================================

window.NavigationState = {
    currentSection: 'posts', // 'posts', 'virales', 'chain', 'market'
    currentFilter: 'all' // Para posts: 'all', 'images', 'videos', 'gifs'
};

// ============================================
// FUNCIÓN PARA MOSTRAR/OCULTAR FILTROS
// ============================================

function updateFilterChipsVisibility(section) {
    const filterChips = document.querySelector('.filter-chips-container');
    
    if (!filterChips) {
        console.warn('⚠️ No se encontró .filter-chips-container');
        return;
    }
    
    // Solo mostrar chips en la sección "Posts"
    if (section === 'posts') {
        filterChips.style.display = 'flex';
        console.log('✅ Filtros mostrados para Posts');
    } else {
        filterChips.style.display = 'none';
        console.log('✅ Filtros ocultados para:', section);
    }
}

// ============================================
// FUNCIONES DE NAVEGACIÓN CORREGIDAS
// ============================================

/**
 * Mostrar sección Posts
 */
window.showPosts = async function() {
    try {
        console.log('📄 Cambiando a: Posts');
        
        // Actualizar estado
        window.NavigationState.currentSection = 'posts';
        window.NavigationState.currentFilter = 'all';
        
        // Mostrar filtros
        updateFilterChipsVisibility('posts');
        
        // Resetear filtro activo
        resetFilterChips();
        
        // Limpiar feed
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer) {
            feedContainer.innerHTML = '';
        }
        
        // Cargar posts normales usando la función existente
        if (typeof loadFeedPosts === 'function') {
            await loadFeedPosts(false);
        } else {
            console.error('❌ loadFeedPosts no disponible');
        }
        
        console.log('✅ Posts cargados correctamente');
        
    } catch (error) {
        console.error('❌ Error en showPosts:', error);
        showNotification('Error al cargar posts', 'error');
    }
};

/**
 * Mostrar sección Virales
 */
window.showVirales = async function() {
    try {
        console.log('🔥 Cambiando a: Virales');
        
        // Actualizar estado
        window.NavigationState.currentSection = 'virales';
        
        // Ocultar filtros
        updateFilterChipsVisibility('virales');
        
        // Limpiar feed
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer) {
            feedContainer.innerHTML = '<div class="loading-spinner">Cargando virales...</div>';
        }
        
        // Cargar posts virales
        const response = await fetch('../php/obtener_feed_inicio.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                limit: 20,
                offset: 0,
                tipo: null,
                ordenar_por: 'virales' // ⬅️ KEY: Pedir posts virales
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Error al cargar virales');
        }
        
        // Renderizar usando la función existente
        if (typeof renderFeedPosts === 'function') {
            FeedState.posts = data.publicaciones;
            renderFeedPosts(false);
        }
        
        console.log('✅ Virales cargados:', data.publicaciones.length);
        
    } catch (error) {
        console.error('❌ Error en showVirales:', error);
        showNotification('Error al cargar virales', 'error');
    }
};

/**
 * Mostrar sección Chain - CORREGIDA
 */
window.showChain = async function() {
    try {
        console.log('⛓️ Cambiando a: Chain');
        
        // Actualizar estado
        window.NavigationState.currentSection = 'chain';
        
        // Ocultar filtros
        updateFilterChipsVisibility('chain');
        
        // Limpiar feed
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer) {
            feedContainer.innerHTML = '<div class="loading-spinner">Cargando chains...</div>';
        }
        
        // ✅ USAR ENDPOINT CORRECTO: obtener_chain.php
        const response = await fetch('../php/obtener_chain.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                limit: 20,
                offset: 0
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            throw new Error(`Error HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Error al cargar chains');
        }
        
        console.log('📦 Chains recibidos:', data.chains?.length || 0);
        
        // Renderizar chains
        if (data.chains && data.chains.length > 0) {
            renderChains(data.chains);
        } else {
            feedContainer.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">⛓️</div>
                    <h3>No hay chains disponibles</h3>
                    <p>Los chains son conversaciones conectadas entre usuarios</p>
                </div>
            `;
        }
        
        console.log('✅ Chains cargados correctamente');
        
    } catch (error) {
        console.error('❌ Error en showChain:', error);
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer) {
            feedContainer.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Error al cargar chains</h3>
                    <p>${error.message}</p>
                    <button onclick="showChain()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Reintentar
                    </button>
                </div>
            `;
        }
        showNotification('Error al cargar chains', 'error');
    }
};

/**
 * Renderizar chains en el feed
 */
function renderChains(chains) {
    const feedContainer = document.getElementById('feedPosts');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = '';
    
    chains.forEach((chain, index) => {
        const chainElement = createChainElement(chain);
        feedContainer.appendChild(chainElement);
        
        setTimeout(() => {
            chainElement.style.animation = 'cardAppear 0.5s ease forwards';
        }, index * 100);
    });
}

/**
 * Crear elemento visual para un chain
 */
function createChainElement(chain) {
    const div = document.createElement('div');
    div.className = 'post-card chain-card';
    div.dataset.chainId = `chain-${chain.id}`;
    div.style.opacity = '0';
    
    div.innerHTML = `
        <div class="chain-header">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.5rem;">⛓️</span>
                <h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">Chain #${chain.id}</h3>
            </div>
            <span style="color: var(--text-secondary); font-size: 0.9rem;">
                ${chain.total_participantes} participantes
            </span>
        </div>
        
        <div class="chain-preview" style="margin: 1rem 0;">
            <p style="color: var(--text-secondary); margin: 0;">
                ${escapeHtml(chain.mensaje_inicial?.substring(0, 150) || 'Sin mensaje')}...
            </p>
        </div>
        
        <div class="chain-stats" style="display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
            <span style="color: var(--text-secondary);">
                💬 ${chain.total_mensajes || 0} mensajes
            </span>
            <span style="color: var(--text-secondary);">
                🕐 Actualizado ${formatTimeAgo(new Date(chain.ultimo_mensaje))}
            </span>
        </div>
        
        <button onclick="openChainViewer(${chain.id})" 
                style="width: 100%; margin-top: 1rem; padding: 0.8rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Ver conversación completa
        </button>
    `;
    
    return div;
}

/**
 * Mostrar sección Market
 */
window.showMarket = async function() {
    try {
        console.log('💰 Cambiando a: Market');
        
        // Actualizar estado
        window.NavigationState.currentSection = 'market';
        
        // Ocultar filtros
        updateFilterChipsVisibility('market');
        
        // Limpiar feed
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer) {
            feedContainer.innerHTML = '<div class="loading-spinner">Cargando marketplace...</div>';
        }
        
        // Cargar posts en venta
        const response = await fetch('../php/obtener_feed_inicio.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                limit: 20,
                offset: 0,
                tipo: null,
                solo_en_venta: true // ⬅️ KEY: Solo posts en venta
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Error al cargar market');
        }
        
        // Renderizar
        if (data.publicaciones && data.publicaciones.length > 0) {
            FeedState.posts = data.publicaciones;
            renderFeedPosts(false);
        } else {
            feedContainer.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">💰</div>
                    <h3>No hay posts en venta</h3>
                    <p>Aquí verás posts que los usuarios han puesto a la venta</p>
                </div>
            `;
        }
        
        console.log('✅ Market cargado:', data.publicaciones?.length || 0);
        
    } catch (error) {
        console.error('❌ Error en showMarket:', error);
        showNotification('Error al cargar marketplace', 'error');
    }
};

// ============================================
// RESETEAR FILTROS DE POSTS
// ============================================

function resetFilterChips() {
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.classList.remove('active');
    });
    
    // Activar "Todos" por defecto
    const allChip = document.querySelector('.filter-chip[data-filter="all"]');
    if (allChip) {
        allChip.classList.add('active');
    }
}

// ============================================
// FILTRADO DE POSTS POR TIPO
// ============================================

window.filterPostsByType = async function(type) {
    try {
        console.log('🔍 Filtrando posts por:', type);
        
        // Verificar que estamos en la sección Posts
        if (window.NavigationState.currentSection !== 'posts') {
            console.warn('⚠️ Filtros solo disponibles en sección Posts');
            return;
        }
        
        // Actualizar estado
        window.NavigationState.currentFilter = type;
        
        // Actualizar UI de chips
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.classList.remove('active');
        });
        
        const activeChip = document.querySelector(`.filter-chip[data-filter="${type}"]`);
        if (activeChip) {
            activeChip.classList.add('active');
        }
        
        // Limpiar feed
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer) {
            feedContainer.innerHTML = '<div class="loading-spinner">Filtrando...</div>';
        }
        
        // Determinar tipo para la API
        let tipoAPI = null;
        if (type === 'images') tipoAPI = 'imagen';
        else if (type === 'videos') tipoAPI = 'video';
        else if (type === 'gifs') tipoAPI = 'gif';
        
        // Cargar posts filtrados
        const response = await fetch('../php/obtener_feed_inicio.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                limit: 20,
                offset: 0,
                tipo: tipoAPI
            })
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Error al filtrar posts');
        }
        
        // Renderizar
        FeedState.posts = data.publicaciones;
        renderFeedPosts(false);
        
        console.log('✅ Posts filtrados:', data.publicaciones.length);
        
    } catch (error) {
        console.error('❌ Error filtrando posts:', error);
        showNotification('Error al filtrar posts', 'error');
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================

// Asegurar que los filtros estén visibles al inicio (estamos en Posts)
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando sistema de navegación corregido');
    
    // Establecer estado inicial
    window.NavigationState.currentSection = 'posts';
    updateFilterChipsVisibility('posts');
    
    // Configurar event listeners para chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.dataset.filter;
            if (filter) {
                filterPostsByType(filter);
            }
        });
    });
    
    console.log('✅ Sistema de navegación inicializado');
});

// ============================================
// PLACEHOLDER PARA FUNCIONES FALTANTES
// ============================================

/**
 * Abrir viewer de chain (placeholder)
 */
window.openChainViewer = function(chainId) {
    console.log('🔗 Abriendo chain:', chainId);
    showNotification('Viewer de chains en desarrollo', 'info');
};

console.log('✅ Corrección de navegación y filtrado cargada');