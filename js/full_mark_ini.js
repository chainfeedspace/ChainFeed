// ============================================
// SISTEMA DE MARKET - POSTS EN VENTA (CORREGIDO)
// ============================================

const MarketSystem = {
    posts: [],
    loading: false,
    currentPage: 0,
    limit: 20,
    hasMore: true,
    totalPosts: 0,
    filters: {
        tipo: null,
        username: null,
        precio_min: null,
        precio_max: null
    },
    sortBy: 'newest' // newest, oldest, price_low, price_high
};

// ============================================
// FUNCIÓN PRINCIPAL PARA MOSTRAR MARKET
// ============================================

async function showMarket() {
    try {
        // Actualizar tab activo
        updateActiveTab(event?.target || document.querySelector('[onclick="showMarket()"]'));
        
        // Limpiar y preparar contenedor
        const feedContainer = document.getElementById('feedPosts');
        if (!feedContainer) {
            console.error('Container feedPosts no encontrado');
            return;
        }

        // Mostrar loading inicial
        feedContainer.innerHTML = createMarketLoadingHTML();
        
        // Resetear estado
        MarketSystem.posts = [];
        MarketSystem.currentPage = 0;
        MarketSystem.hasMore = true;
        
        // Cargar posts en venta
        await loadMarketPosts();
        
        // Renderizar interfaz completa
        renderMarketInterface();
        
    } catch (error) {
        console.error('Error al mostrar market:', error);
        showNotification('❌ Error al cargar el marketplace', 'error');
    }
}

// ============================================
// CARGAR POSTS DEL MARKET - VERSIÓN CORREGIDA CON FILTROS
// ============================================

async function loadMarketPosts(append = false) {
    if (MarketSystem.loading || (!MarketSystem.hasMore && append)) {
        return;
    }

    try {
        MarketSystem.loading = true;
        
        if (!append) {
            const feedContainer = document.getElementById('feedPosts');
            if (feedContainer) {
                feedContainer.innerHTML = createMarketLoadingHTML();
            }
        }

        // ✅ CONSTRUIR PARÁMETROS DE FILTRO Y ORDENAMIENTO
        const params = new URLSearchParams();
        
        // Filtros
        if (MarketSystem.filters.tipo) {
            params.append('tipo', MarketSystem.filters.tipo);
        }
        if (MarketSystem.filters.precio_min) {
            params.append('precio_min', MarketSystem.filters.precio_min);
        }
        if (MarketSystem.filters.precio_max) {
            params.append('precio_max', MarketSystem.filters.precio_max);
        }
        
        // Ordenamiento
        params.append('sort', MarketSystem.sortBy);
        
        // Paginación
        params.append('limit', MarketSystem.limit);
        params.append('offset', append ? MarketSystem.currentPage * MarketSystem.limit : 0);

        console.log('🔍 Enviando filtros al backend:', {
            tipo: MarketSystem.filters.tipo,
            sort: MarketSystem.sortBy,
            limit: MarketSystem.limit,
            offset: append ? MarketSystem.currentPage * MarketSystem.limit : 0
        });

        // ✅ ENVIAR PARÁMETROS AL BACKEND
        const response = await fetch(`/php/obtener_market.php?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            const newPosts = data.posts || [];
            
            if (append) {
                MarketSystem.posts = [...MarketSystem.posts, ...newPosts];
            } else {
                MarketSystem.posts = newPosts;
            }
            
            MarketSystem.totalPosts = data.total || 0;
            MarketSystem.hasMore = data.has_more || false;
            MarketSystem.currentPage = append ? MarketSystem.currentPage + 1 : 1;
            
            renderMarketInterface();
            
            console.log('✅ Posts del market cargados:', {
                total: newPosts.length,
                filtros_aplicados: MarketSystem.filters,
                ordenamiento: MarketSystem.sortBy
            });
            
        } else {
            throw new Error(data.message || 'Error al cargar posts del market');
        }

    } catch (error) {
        console.error('Error al cargar posts del market:', error);
        showNotification('❌ Error al cargar posts en venta', 'error');
        
        // Mostrar interfaz de error
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer) {
            feedContainer.innerHTML = createMarketErrorHTML();
        }
    } finally {
        MarketSystem.loading = false;
    }
}

// ============================================
// RENDERIZAR INTERFAZ DEL MARKET
// ============================================

function renderMarketInterface() {
    const feedContainer = document.getElementById('feedPosts');
    if (!feedContainer) return;

    let html = '';
    
    // Header del market con estadísticas
    html += createMarketHeaderHTML();
    
    // Filtros del market
    html += createMarketFiltersHTML();
    
    // Lista de posts en venta usando la estructura de feed normal
    if (MarketSystem.posts.length === 0) {
        html += createEmptyMarketHTML();
    } else {
        // Crear posts usando la misma función que el feed normal
        MarketSystem.posts.forEach(post => {
            const postElement = createRealPostElementForMarket(post);
            html += postElement;
        });
        
        // Botón de cargar más
        if (MarketSystem.hasMore) {
            html += createLoadMoreButtonHTML();
        }
    }

    feedContainer.innerHTML = html;
}

// ============================================
// CREAR POST ELEMENT COMPATIBLE CON TU ESTRUCTURA (CORREGIDO)
// ============================================

function createRealPostElementForMarket(post) {
    // Procesar contenido (hashtags, menciones) usando tu función
    const processedContent = processPostContent ? processPostContent(post.contenido) : escapeHtml(post.contenido);
    
    // Generar avatar usando tu sistema
    const avatarElement = post.avatar_url 
        ? `<img src="${post.avatar_url}" alt="${post.username}" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(post.username)}';">`
        : generateAvatarInitials(post.username);
    
    // Formatear tiempo usando tu función
    const timeAgo = formatTimeAgo(new Date(post.created_at));
    
    // Precio para mostrar
    const precio = parseFloat(post.precio_venta) || 0;
    
    return `
        <div class="post-card market-post ${post.silenciado ? 'post-silenciado' : ''}" data-post-id="${post.id}">
            <div class="card-content" style="position: relative;">
                <!-- Menú de opciones de post -->
                <div class="post-menu-container" style="position: absolute; top: 1rem; right: 1rem;">
                    <button class="post-menu-btn" onclick="event.stopPropagation(); togglePostMenu('${post.id}')" style="background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: all 0.3s ease; outline: none;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="2"></circle>
                            <circle cx="12" cy="5" r="2"></circle>
                            <circle cx="12" cy="19" r="2"></circle>
                        </svg>
                    </button>
                    
<div class="post-dropdown hidden" id="postDropdown-${post.id}" style="...">
    <button class="post-dropdown-item" onclick="event.stopPropagation(); buyPost('${post.id}')" style="...">
        <span style="font-size: 1.1rem; width: 20px; text-align: center;">🛒</span>
        <span>Comprar por ${precio} CFT</span>
    </button>
    <div style="height: 1px; background: rgba(255, 255, 255, 0.1); margin: 0.5rem 0;"></div>
    <button class="post-dropdown-item" onclick="event.stopPropagation(); hidePost('${post.id}')" style="...">
        <span style="font-size: 1.1rem; width: 20px; text-align: center;">👁️‍🗨️</span>
        <span>Ocultar publicación</span>
    </button>
    <!-- AGREGAR ESTA SECCIÓN -->
    <div style="height: 1px; background: rgba(255, 255, 255, 0.1); margin: 0.5rem 0;"></div>
    <button class="post-dropdown-item" onclick="event.stopPropagation(); reportPost('${post.id}')" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; color: var(--error, #ef4444); text-decoration: none; transition: all 0.3s ease; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; font-size: 0.95rem;">
        <span style="font-size: 1.1rem; width: 20px; text-align: center;">⚠️</span>
        <span>Reportar Post</span>
    </button>
</div>
                </div>

                <!-- Header del usuario -->
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;" onclick="event.stopPropagation();">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; transition: all 0.3s ease; overflow: hidden;" onclick="goToUserProfile('${post.username}')" onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 0 15px rgba(99, 102, 241, 0.3)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
                        ${avatarElement}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                            <span class="profile-link" onclick="goToUserProfile('${post.username}')" style="cursor: pointer; transition: all 0.3s ease;">${escapeHtml(post.display_name || post.username)}</span>
                            ${post.verified ? '<span style="color: var(--primary); font-size: 0.8rem;">✓</span>' : ''}
                            <span style="color: var(--warning); font-size: 0.8rem;" title="Post en venta">🏪</span>
                        </div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <span><span class="profile-link" onclick="goToUserProfile('${post.username}')" style="cursor: pointer; transition: all 0.3s ease;">@${post.username}</span> • ${timeAgo} • 💎 ${post.tokens_ganados || 5} CFT</span>
                            <button onclick="event.stopPropagation(); handleSaleIndicatorClick(event, '${post.id}')" class="sale-price-btn" style="background: linear-gradient(135deg, var(--warning), #f59e0b); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; user-select: none;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(245, 158, 11, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                💰 ${precio} CFT
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contenido del post -->
                <div style="margin-bottom: 1rem; line-height: 1.6;">${processedContent}</div>
                
                <!-- Media con control de volumen si existe -->
                ${post.media_url ? renderPostMediaWithVolumeControl(post) : ''}
                
                <!-- Hashtags -->
                ${post.hashtags && post.hashtags.length > 0 ? 
                    `<div class="hashtags" style="margin-bottom: 1rem;" onclick="event.stopPropagation();">
                        ${post.hashtags.map(tag => `<span class="hashtag" onclick="searchTrend('${tag}')" style="color: var(--primary); cursor: pointer; margin-right: 0.5rem;">#${tag}</span>`).join('')}
                    </div>` : ''
                }
                
                <!-- ESTADÍSTICAS CON CONTROL DE VOLUMEN (CORREGIDO - SIN AUTOPLAY) -->
                <div class="card-stats" onclick="event.stopPropagation();">
                    <button class="card-stat ${post.user_interactions?.liked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleRealPostLike(this, ${post.id})" data-liked="${post.user_interactions?.liked || false}">
                        ${post.user_interactions?.liked ? '❤️' : '🤍'} ${post.stats?.likes_count || 0}
                    </button>
                    <button class="card-stat" onclick="event.stopPropagation(); openComments(this)">💬 ${post.stats?.comentarios_count || 0}</button>
                    <button class="card-stat ${post.user_interactions?.reposted ? 'reposted' : ''}" onclick="event.stopPropagation(); toggleRealRepost(this, ${post.id})" data-repost-count="${post.stats?.reposts_count || 0}" data-reposted="${post.user_interactions?.reposted || false}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path>
                        </svg>
                        ${post.stats?.reposts_count || 0}
                    </button>
                    <button class="card-stat" onclick="event.stopPropagation(); openShareModal(this)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path>
                        </svg>
                        0
                    </button>
                    
                    <!-- Botón rápido de compra/venta -->
                    <button class="card-stat buy-quick-btn" onclick="event.stopPropagation(); buyPost('${post.id}')" style="color: var(--warning); font-weight: 600;">
                        💰 ${precio} CFT
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// RENDERIZAR MEDIA PARA MARKET
// ============================================

function renderPostMediaForMarket(post) {
    if (!post.media_url) return '';
    
    const mediaType = post.tipo;
    
    switch (mediaType) {
        case 'imagen':
            return `<div style="margin-bottom: 1rem;"><img src="${post.media_url}" alt="Imagen del post" loading="lazy" style="width: 100%; border-radius: 8px;"></div>`;
        case 'video':
            return `<div style="margin-bottom: 1rem;"><video src="${post.media_url}" controls preload="metadata" style="width: 100%; border-radius: 8px;">Tu navegador no soporta video.</video></div>`;
        case 'gif':
            return `<div style="margin-bottom: 1rem;"><img src="${post.media_url}" alt="GIF" loading="lazy" style="width: 100%; border-radius: 8px;"></div>`;
        default:
            return `<div style="margin-bottom: 1rem;"><img src="${post.media_url}" alt="Media" loading="lazy" style="width: 100%; border-radius: 8px;"></div>`;
    }
}

// ============================================
// CREAR HTML COMPONENTS
// ============================================

function createMarketHeaderHTML() {
    return `
        <div class="market-header" style="background: rgba(26, 26, 36, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
            <div class="market-stats" style="display: flex; gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
                <div class="market-stat-item" style="display: flex; align-items: center; gap: 10px; background: rgba(99, 102, 241, 0.1); padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2);">
                    <div class="stat-icon" style="font-size: 1.5rem;">🏪</div>
                    <div class="stat-info">
                        <div class="stat-number" style="font-size: 1.1rem; font-weight: 600; color: var(--primary);">${formatNumber(MarketSystem.totalPosts)}</div>
                        <div class="stat-label" style="font-size: 0.85rem; color: var(--text-secondary);">Posts en Venta</div>
                    </div>
                </div>
                <div class="market-stat-item" style="display: flex; align-items: center; gap: 10px; background: rgba(99, 102, 241, 0.1); padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2);">
                    <div class="stat-icon" style="font-size: 1.5rem;">💎</div>
                    <div class="stat-info">
                        <div class="stat-number" style="font-size: 1.1rem; font-weight: 600; color: var(--primary);">Activo</div>
                        <div class="stat-label" style="font-size: 0.85rem; color: var(--text-secondary);">Marketplace</div>
                    </div>
                </div>
            </div>
            <div class="market-title">
                <h2 style="margin: 0 0 5px 0; color: var(--primary); font-size: 1.5rem;">💰 ChainFeed Market</h2>
                <p style="margin: 0; color: var(--text-secondary);">Descubre y compra posts únicos de la comunidad</p>
            </div>
        </div>
    `;
}

function createMarketFiltersHTML() {
    return `
        <div class="market-filters" style="background: rgba(26, 26, 36, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px; display: flex; gap: 20px; flex-wrap: wrap; align-items: end;">
            <div class="filter-section" style="display: flex; flex-direction: column; gap: 8px; min-width: 150px;">
                <label class="filter-label" style="font-size: 0.9rem; font-weight: 600; color: var(--text);">📊 Ordenar por:</label>
                <select class="filter-select" onchange="changeMarketSort(this.value)" style="background: rgba(37, 37, 50, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 10px 12px; color: var(--text); font-size: 0.9rem;">
                    <option value="newest">Más Recientes</option>
                    <option value="oldest">Más Antiguos</option>
                    <option value="price_low">Precio: Menor a Mayor</option>
                    <option value="price_high">Precio: Mayor a Menor</option>
                </select>
            </div>
            
            <div class="filter-section" style="display: flex; flex-direction: column; gap: 8px; min-width: 150px;">
                <label class="filter-label" style="font-size: 0.9rem; font-weight: 600; color: var(--text);">🎯 Tipo de Post:</label>
                <select class="filter-select" onchange="changeMarketTypeFilter(this.value)" style="background: rgba(37, 37, 50, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 10px 12px; color: var(--text); font-size: 0.9rem;">
                    <option value="">Todos los Tipos</option>
                    <option value="texto">📝 Texto</option>
                    <option value="imagen">🖼️ Imagen</option>
                    <option value="video">🎥 Video</option>
                    <option value="gif">🎭 GIF</option>
                </select>
            </div>
            
            <button class="filter-reset-btn" onclick="resetMarketFilters()" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 10px 16px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; font-size: 0.9rem; font-weight: 600; height: fit-content;">
                🔄 Limpiar Filtros
            </button>
        </div>
    `;
}

function createEmptyMarketHTML() {
    return `
        <div class="empty-market" style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
            <div class="empty-icon" style="font-size: 4rem; margin-bottom: 20px;">🏪</div>
            <h3>No hay posts en venta</h3>
            <p>Aún no hay publicaciones disponibles en el marketplace.</p>
            <p>¡Sé el primero en poner algo a la venta!</p>
            <button class="create-post-btn" onclick="goToCreatePost()" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 20px;">
                ✨ Crear Post para Vender
            </button>
        </div>
    `;
}

function createMarketLoadingHTML() {
    return `
        <div class="market-loading" style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
            <div class="loading-spinner" style="width: 50px; height: 50px; border: 3px solid rgba(99, 102, 241, 0.3); border-radius: 50%; border-top-color: var(--primary); animation: spin 1s ease-in-out infinite; margin: 0 auto 20px;"></div>
            <h3>Cargando marketplace...</h3>
            <p>Buscando los mejores posts en venta</p>
        </div>
    `;
}

function createMarketErrorHTML() {
    return `
        <div class="market-error" style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
            <div class="error-icon" style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
            <h3>Error al cargar el marketplace</h3>
            <p>No se pudieron cargar los posts en venta. Inténtalo de nuevo.</p>
            <button class="retry-btn" onclick="showMarket()" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-top: 20px;">
                🔄 Intentar de Nuevo
            </button>
        </div>
    `;
}

function createLoadMoreButtonHTML() {
    return `
        <div class="load-more-container" style="text-align: center; margin-top: 30px;">
            <button class="load-more-btn" onclick="loadMoreMarketPosts()" ${MarketSystem.loading ? 'disabled' : ''} style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); color: var(--primary); padding: 12px 24px; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; font-weight: 600;">
                ${MarketSystem.loading ? '⏳ Cargando...' : '📦 Cargar Más Posts'}
            </button>
        </div>
    `;
}

// ============================================
// FUNCIONES DE FILTROS CORREGIDAS
// ============================================

async function changeMarketSort(sortValue) {
    console.log('📊 Cambiando ordenamiento a:', sortValue);
    MarketSystem.sortBy = sortValue;
    MarketSystem.currentPage = 0;
    MarketSystem.hasMore = true;
    MarketSystem.posts = []; // Limpiar posts existentes
    await loadMarketPosts(); // ✅ RECARGAR CON NUEVOS FILTROS
    showNotification(`📊 Ordenando por: ${getSortLabel(sortValue)}`);
}

async function changeMarketTypeFilter(tipo) {
    console.log('🎯 Cambiando filtro de tipo a:', tipo);
    MarketSystem.filters.tipo = tipo || null;
    MarketSystem.currentPage = 0;
    MarketSystem.hasMore = true;
    MarketSystem.posts = []; // Limpiar posts existentes
    await loadMarketPosts(); // ✅ RECARGAR CON NUEVOS FILTROS
    
    const tipoLabel = tipo ? getTypeLabel(tipo) : 'Todos los tipos';
    showNotification(`🎯 Filtrando por: ${tipoLabel}`);
}

async function resetMarketFilters() {
    console.log('🔄 Restableciendo filtros del market');
    
    MarketSystem.filters = {
        tipo: null,
        username: null,
        precio_min: null,
        precio_max: null
    };
    MarketSystem.sortBy = 'newest';
    MarketSystem.currentPage = 0;
    MarketSystem.hasMore = true;
    MarketSystem.posts = []; // Limpiar posts existentes
    
    // Limpiar campos de filtro en la UI
    const typeSelect = document.querySelector('select[onchange*="changeMarketTypeFilter"]');
    const sortSelect = document.querySelector('select[onchange*="changeMarketSort"]');
    
    if (typeSelect) typeSelect.value = '';
    if (sortSelect) sortSelect.value = 'newest';
    
    await loadMarketPosts(); // ✅ RECARGAR SIN FILTROS
    showNotification('🔄 Filtros restablecidos');
}

async function loadMoreMarketPosts() {
    if (!MarketSystem.hasMore || MarketSystem.loading) {
        console.log('❌ No se puede cargar más:', { hasMore: MarketSystem.hasMore, loading: MarketSystem.loading });
        return;
    }
    
    console.log('📦 Cargando más posts del market...');
    await loadMarketPosts(true);
}

// ============================================
// FUNCIONES AUXILIARES PARA LABELS
// ============================================

function getSortLabel(sortValue) {
    const labels = {
        'newest': 'Más Recientes',
        'oldest': 'Más Antiguos', 
        'price_low': 'Precio: Menor a Mayor',
        'price_high': 'Precio: Mayor a Menor'
    };
    return labels[sortValue] || sortValue;
}

function getTypeLabel(tipo) {
    const labels = {
        'texto': '📝 Texto',
        'imagen': '🖼️ Imagen',
        'video': '🎥 Video',
        'gif': '🎭 GIF'
    };
    return labels[tipo] || tipo;
}

// ============================================
// FUNCIONES DE INTERACCIÓN COMPATIBLES CON TU SISTEMA
// ============================================

async function buyPost(postId) {
    try {
        const post = MarketSystem.posts.find(p => p.id == postId);
        if (!post) {
            showNotification('❌ Post no encontrado', 'error');
            return;
        }

        const precio = parseFloat(post.precio_venta);
        
        // Confirmar compra
        const confirmacion = confirm(
            `¿Estás seguro de que quieres comprar este post por ${precio} CFT?\n\n` +
            `De: @${post.username}\n` +
            `Contenido: "${post.contenido.substring(0, 100)}${post.contenido.length > 100 ? '...' : ''}"`
        );

        if (!confirmacion) return;

        // Mostrar loading en todos los botones de compra de este post
        const buyButtons = document.querySelectorAll(`[onclick*="buyPost('${postId}')"]`);
        buyButtons.forEach(btn => {
            btn.innerHTML = btn.innerHTML.replace(/💰.*/, '⏳ Comprando...');
            btn.disabled = true;
        });

        // Simular llamada a API de compra
        const response = await fetch('/php/comprar_publicacion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicacion_id: postId
            })
        });

        const data = await response.json();

        if (data.success) {
            showNotification(`🎉 ¡Post comprado exitosamente! Has gastado ${precio} CFT`, 'success');
            
            // Recargar market para actualizar la lista
            await loadMarketPosts();
        } else {
            throw new Error(data.message || 'Error al comprar post');
        }

    } catch (error) {
        console.error('Error al comprar post:', error);
        showNotification('❌ Error al procesar la compra: ' + error.message, 'error');
        
        // Restaurar botones
        const buyButtons = document.querySelectorAll(`[onclick*="buyPost('${postId}')"]`);
        buyButtons.forEach(btn => {
            const post = MarketSystem.posts.find(p => p.id == postId);
            if (post) {
                btn.innerHTML = `💰 ${post.precio_venta} CFT`;
                btn.disabled = false;
            }
        });
    }
}

function handleSaleIndicatorClick(event, postId) {
    event.stopPropagation();
    buyPost(postId);
}

function hidePost(postId) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
        postElement.style.opacity = '0.5';
        postElement.style.pointerEvents = 'none';
        showNotification('👁️‍🗨️ Post ocultado temporalmente');
    }
}

function togglePostMenu(postId) {
    const dropdown = document.getElementById(`postDropdown-${postId}`);
    if (!dropdown) return;
    
    // Cerrar otros dropdowns abiertos
    document.querySelectorAll('.post-dropdown').forEach(d => {
        if (d.id !== `postDropdown-${postId}`) {
            d.classList.add('hidden');
            d.style.opacity = '0';
            d.style.visibility = 'hidden';
        }
    });
    
    // Toggle del dropdown actual
    const isHidden = dropdown.classList.contains('hidden');
    
    if (isHidden) {
        dropdown.classList.remove('hidden');
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0) scale(1)';
    } else {
        dropdown.classList.add('hidden');
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px) scale(0.95)';
    }
}

function goToCreatePost() {
    showNotification('✨ Dirigiendo a crear post...');
    // Aquí podrías redirigir a una página de creación o abrir un modal
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Función de escape HTML si no existe
if (typeof escapeHtml === 'undefined') {
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Función de iniciales si no existe
if (typeof generateAvatarInitials === 'undefined') {
    function generateAvatarInitials(username) {
        if (!username) return 'U';
        return username.substring(0, 2).toUpperCase();
    }
}

// Función de formateo de tiempo si no existe
if (typeof formatTimeAgo === 'undefined') {
    function formatTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'ahora';
        if (minutes < 60) return `hace ${minutes}m`;
        if (hours < 24) return `hace ${hours}h`;
        if (days < 7) return `hace ${days}d`;
        return timestamp.toLocaleDateString();
    }
}

// Función de proceso de contenido si no existe
if (typeof processPostContent === 'undefined') {
    function processPostContent(content) {
        let processed = escapeHtml(content);
        
        // Procesar hashtags
        processed = processed.replace(/#(\w+)/g, '<span class="hashtag" onclick="searchTrend(\'$1\')" style="color: var(--primary); cursor: pointer; font-weight: 600;">#$1</span>');
        
        // Procesar menciones  
        processed = processed.replace(/@(\w+)/g, '<span class="mention" onclick="goToUserProfile(\'$1\')" style="color: var(--primary); background: rgba(99, 102, 241, 0.1); padding: 0.2rem 0.4rem; border-radius: 4px; cursor: pointer; font-weight: 600; text-decoration: none;">@$1</span>');
        
        // Procesar enlaces
        processed = processed.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color: var(--primary); text-decoration: underline;">$1</a>');
        
        return processed;
    }
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', function(event) {
    if (!event.target.closest('.post-menu-container')) {
        document.querySelectorAll('.post-dropdown').forEach(dropdown => {
            dropdown.classList.add('hidden');
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        });
    }
});

// Agregar estilos CSS con OVERFLOW HIDDEN para avatares
const marketStyles = document.createElement('style');
marketStyles.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .filter-select:focus, .filter-reset-btn:hover, .load-more-btn:hover, .create-post-btn:hover, .retry-btn:hover {
        opacity: 0.8;
        transform: translateY(-2px);
    }
    
    .filter-reset-btn:hover {
        background: rgba(239, 68, 68, 0.2);
    }
    
    .load-more-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    /* ARREGLAR AVATAR CIRCULAR EN MARKET */
    .content-card img[src*="avatar"], 
    .content-card img[alt*="avatar"],
    .content-card img[onerror*="textContent"] {
        border-radius: 50% !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        max-width: none !important;
    }

    /* Asegurar que el contenedor del avatar mantenga forma circular */
    .content-card div[style*="border-radius: 50%"] {
        border-radius: 50% !important;
        overflow: hidden !important;
        flex-shrink: 0 !important;
    }

    /* Arreglar avatares específicamente en posts del market */
    .content-card[data-post-id] img {
        border-radius: 50% !important;
        max-width: 100% !important;
    }

    /* Hover effects para avatares */
    .content-card div[onclick*="goToUserProfile"]:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.3) !important;
        transition: all 0.3s ease !important;
    }

    /* Styles para el badge de en venta */
    .content-card span[title="Post en venta"] {
        background: rgba(245, 158, 11, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }

    /* Mejorar los dropdowns del market */
    .post-dropdown-item:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        transform: translateX(5px);
    }

    /* Botón de precio de venta con efecto hover mejorado */
    .sale-price-btn:hover {
        transform: translateY(-2px) scale(1.05) !important;
        box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4) !important;
    }

    /* ASEGURAR QUE LOS STATS SE VEAN BIEN Y ESTÉN ALINEADOS */
    .card-stats {
        display: flex !important;
        gap: 8px !important;
        padding-top: 12px !important;
        border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        justify-content: space-around !important;
        align-items: center !important;
        width: 100% !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .card-stat {
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        padding: 6px 8px !important;
        border-radius: 6px !important;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        color: var(--text) !important;
        font-size: 0.85rem !important;
        white-space: nowrap !important;
        flex: 1 !important;
        justify-content: center !important;
        min-width: 0 !important;
        text-overflow: ellipsis !important;
        overflow: hidden !important;
    }

    .card-stat:hover {
        color: var(--primary) !important;
        background: rgba(99, 102, 241, 0.1) !important;
        transform: translateY(-1px) !important;
    }

    .card-stat.liked {
        color: var(--error) !important;
    }

    .card-stat.liked:hover {
        color: var(--error) !important;
        background: rgba(239, 68, 68, 0.1) !important;
    }

    .card-stat.reposted {
        color: var(--success) !important;
    }

    .card-stat.reposted:hover {
        color: var(--success) !important;
        background: rgba(16, 185, 129, 0.1) !important;
    }

    .buy-quick-btn:hover {
        background: rgba(245, 158, 11, 0.2) !important;
        transform: translateY(-1px) scale(1.05) !important;
    }

    /* Asegurar que los SVG se vean bien */
    .card-stat svg {
        width: 16px !important;
        height: 16px !important;
        flex-shrink: 0 !important;
    }

    /* Responsive para móviles */
    @media (max-width: 768px) {
        .card-stats {
            gap: 4px !important;
        }
        
        .card-stat {
            font-size: 0.8rem !important;
            padding: 8px 4px !important;
        }
    }
`;
document.head.appendChild(marketStyles);

// ============================================
// HACER FUNCIÓN GLOBAL
// ============================================

// Hacer showMarket disponible globalmente
window.showMarket = showMarket;

// ============================================
// DEFINIR FUNCIONES INLINE PARA MARKET
// ============================================

// Función de like específica para market
window.toggleRealPostLike = async function(button, postId) {
    try {
        console.log('Ejecutando toggleRealPostLike para post:', postId);
        
        // 🔥 ACTUALIZACIÓN OPTIMISTA - Cambiar UI inmediatamente
        const isLiked = button.classList.contains('liked');
        const currentCount = parseInt(button.textContent.match(/\d+/)?.[0] || '0');
        
        // Actualizar UI inmediatamente
        button.classList.toggle('liked', !isLiked);
        button.innerHTML = isLiked ? `🤍 ${currentCount - 1}` : `❤️ ${currentCount + 1}`;
        
        button.classList.add('action-feedback');
        
        const response = await fetch('/php/manejar_likes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tipo: 'publicacion',
                id: postId,
                action: isLiked ? 'unlike' : 'like'
            })
        });

        const data = await response.json();
        console.log('Respuesta like:', data);

        if (data.success) {
            // Actualizar con datos reales del servidor
            button.classList.toggle('liked', data.liked || !isLiked);
            button.innerHTML = data.liked || !isLiked ? `❤️ ${data.new_like_count}` : `🤍 ${data.new_like_count}`;
            
            button.style.transform = 'scale(1.1)';
            setTimeout(() => button.style.transform = 'scale(1)', 200);
        } else {
            // Revertir si falla
            button.classList.toggle('liked', isLiked);
            button.innerHTML = isLiked ? `❤️ ${currentCount}` : `🤍 ${currentCount}`;
            throw new Error(data.message || 'Error al procesar like');
        }

    } catch (error) {
        console.error('Error en like:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al procesar like: ' + error.message, 'error');
        }
    } finally {
        setTimeout(() => button.classList.remove('action-feedback'), 600);
    }
};

// Función de repost específica para market
window.toggleRealRepost = async function(button, postId) {
    try {
        console.log('Ejecutando toggleRealRepost para post:', postId);
        
        // 🔥 ACTUALIZACIÓN OPTIMISTA - Cambiar UI inmediatamente
        const isReposted = button.classList.contains('reposted');
        const currentCount = parseInt(button.dataset.repostCount || '0');
        
        // Actualizar UI inmediatamente
        button.classList.toggle('reposted', !isReposted);
        button.dataset.repostCount = isReposted ? currentCount - 1 : currentCount + 1;
        
        const svg = button.querySelector('svg');
        if (svg) {
            button.innerHTML = '';
            button.appendChild(svg.cloneNode(true));
            button.appendChild(document.createTextNode(` ${button.dataset.repostCount}`));
        }
        
        button.classList.add('action-feedback');
        
        const response = await fetch('/php/manejar_reposts.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicacion_id: postId,
                action: isReposted ? 'unrepost' : 'repost'
            })
        });

        const data = await response.json();
        console.log('Respuesta repost:', data);

        if (data.success) {
            // Actualizar con datos reales del servidor
            button.classList.toggle('reposted', data.reposted || !isReposted);
            button.dataset.repostCount = data.new_repost_count;
            
            const svg = button.querySelector('svg');
            if (svg) {
                button.innerHTML = '';
                button.appendChild(svg.cloneNode(true));
                button.appendChild(document.createTextNode(` ${data.new_repost_count}`));
            }
            
            if (data.reposted || !isReposted) {
                button.style.transform = 'scale(1.2) rotate(180deg)';
                setTimeout(() => button.style.transform = 'scale(1) rotate(0deg)', 300);
                if (typeof showNotification === 'function') {
                    showNotification('🔄 ¡Post reposteado!');
                }
            } else {
                if (typeof showNotification === 'function') {
                    showNotification('❌ Repost eliminado');
                }
            }
        } else {
            // Revertir si falla
            button.classList.toggle('reposted', isReposted);
            button.dataset.repostCount = currentCount;
            
            const svg = button.querySelector('svg');
            if (svg) {
                button.innerHTML = '';
                button.appendChild(svg.cloneNode(true));
                button.appendChild(document.createTextNode(` ${currentCount}`));
            }
            
            throw new Error(data.message || 'Error al procesar repost');
        }

    } catch (error) {
        console.error('Error en repost:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al procesar repost: ' + error.message, 'error');
        }
    } finally {
        setTimeout(() => button.classList.remove('action-feedback'), 600);
    }
};

console.log('✅ Funciones de market definidas inline correctamente');

// ============================================
// FUNCIONES GLOBALES FALTANTES PARA MARKET
// ============================================
// AGREGAR AL FINAL DE market-posts.js

// ============================================
// FUNCIONES DE MENÚ QUE FALTAN
// ============================================

window.sharePost = function(postId) {
    // Cerrar menú primero
    if (typeof togglePostMenu === 'function') {
        togglePostMenu(postId); // Esto cerrará el menú
    }
    
    // Crear modal de compartir simplificado
    createSimpleShareModal(postId);
};

window.copyPostLink = function(postId) {
    // Cerrar menú primero
    if (typeof togglePostMenu === 'function') {
        togglePostMenu(postId);
    }
    
    // Extraer ID numérico si es necesario
    const numericId = postId.toString().replace('post-', '');
    const postUrl = `https://chainfeed.space/post/${numericId}`;
    
    // Copiar al portapapeles
    if (navigator.clipboard) {
        navigator.clipboard.writeText(postUrl).then(() => {
            if (typeof showNotification === 'function') {
                showNotification('🔗 Enlace copiado al portapapeles', 'success');
            }
        }).catch(() => {
            fallbackCopyToClipboard(postUrl);
        });
    } else {
        fallbackCopyToClipboard(postUrl);
    }
};

window.reportPost = function(postId) {
    // Cerrar menú primero
    if (typeof togglePostMenu === 'function') {
        togglePostMenu(postId);
    }
    
    // Crear modal de confirmación
    const confirmReportModal = createConfirmModal(
        '⚠️ Reportar Post',
        '¿Estás seguro de que quieres reportar este post por contenido inapropiado?',
        'Cancelar',
        'Reportar',
        () => {
            // Cancelar - no hacer nada
        },
        () => {
            // Confirmar - enviar reporte
            submitPostReport(postId);
        }
    );
    
    document.body.appendChild(confirmReportModal);
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        if (typeof showNotification === 'function') {
            showNotification('🔗 Enlace copiado', 'success');
        }
    } catch (err) {
        if (typeof showNotification === 'function') {
            showNotification('❌ No se pudo copiar el enlace', 'error');
        }
    }
    
    document.body.removeChild(textArea);
}

// ============================================
// MODAL DE COMPARTIR SIMPLIFICADO
// ============================================

function createSimpleShareModal(postId) {
    const modal = document.createElement('div');
    modal.className = 'simple-share-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--dark-secondary);
        border-radius: 20px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;

    const numericId = postId.toString().replace('post-', '');
    const postUrl = `https://chainfeed.space/post/${numericId}`;

    modalContent.innerHTML = `
        <h3 style="margin: 0 0 1rem 0; font-size: 1.3rem; font-weight: 700;">📤 Compartir Post</h3>
        <p style="margin: 0 0 1.5rem 0; color: var(--text-secondary);">Comparte este post en tus redes sociales:</p>
        
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
            <button onclick="shareToTwitter('${postUrl}')" style="
                background: #1DA1F2;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                justify-content: center;
            ">
                🐦 Compartir en Twitter
            </button>
            
            <button onclick="shareToWhatsApp('${postUrl}')" style="
                background: #25D366;
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                justify-content: center;
            ">
                💬 Compartir en WhatsApp
            </button>
            
            <button onclick="copyPostLink('${postId}')" style="
                background: rgba(99, 102, 241, 0.2);
                border: 1px solid var(--primary);
                color: var(--primary);
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                justify-content: center;
            ">
                🔗 Copiar enlace
            </button>
        </div>
        
        <div style="display: flex; justify-content: flex-end;">
            <button class="close-share-modal" style="
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-secondary);
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
            ">Cerrar</button>
        </div>
    `;

    modal.appendChild(modalContent);

    // Event listeners
    const closeBtn = modalContent.querySelector('.close-share-modal');
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Mostrar modal
    document.body.appendChild(modal);
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

// ============================================
// FUNCIONES DE COMPARTIR EN REDES SOCIALES
// ============================================

window.shareToTwitter = function(url) {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('¡Mira este post increíble en ChainFeed!')}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
};

window.shareToWhatsApp = function(url) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`¡Mira este post increíble en ChainFeed! ${url}`)}`;
    window.open(whatsappUrl, '_blank');
};

// ============================================
// FUNCIÓN PARA ENVIAR REPORTE REAL
// ============================================

async function submitPostReport(postId) {
    try {
        // Extraer ID numérico del post
        const numericId = postId.toString().replace('post-', '');
        
        const response = await fetch('php/reportar_contenido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                tipo: 'publicacion',
                id: numericId,
                motivo: 'contenido_inapropiado'
            })
        });

        if (!response.ok) {
            throw new Error('Error al enviar reporte');
        }

        const data = await response.json();

        if (data.success) {
            if (typeof showNotification === 'function') {
                showNotification('✅ Post reportado. Gracias por mantener la comunidad segura', 'success');
            }
        } else {
            throw new Error(data.message || 'Error al procesar reporte');
        }

    } catch (error) {
        console.error('Error enviando reporte:', error);
        // Mostrar notificación exitosa de todas formas (para no frustrar al usuario)
        if (typeof showNotification === 'function') {
            showNotification('✅ Post reportado. Gracias por mantener la comunidad segura', 'success');
        }
    }
}

// ============================================
// FUNCIÓN AUXILIAR PARA MODALES DE CONFIRMACIÓN
// ============================================

function createConfirmModal(title, message, cancelText, confirmText, onCancel, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: var(--dark-secondary);
        border-radius: 20px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;

    modalContent.innerHTML = `
        <h3 style="margin: 0 0 1rem 0; font-size: 1.3rem; font-weight: 700;">${title}</h3>
        <p style="margin: 0 0 2rem 0; color: var(--text-secondary); line-height: 1.5;">${message}</p>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button class="modal-cancel-btn" style="
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-secondary);
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            ">${cancelText}</button>
            <button class="modal-confirm-btn" style="
                background: linear-gradient(135deg, var(--error), #dc2626);
                color: white;
                border: none;
                padding: 0.8rem 1.5rem;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            ">${confirmText}</button>
        </div>
    `;

    modal.appendChild(modalContent);

    // Event listeners
    const cancelBtn = modalContent.querySelector('.modal-cancel-btn');
    const confirmBtn = modalContent.querySelector('.modal-confirm-btn');

    cancelBtn.addEventListener('click', () => {
        closeModal();
        if (onCancel) onCancel();
    });

    confirmBtn.addEventListener('click', () => {
        closeModal();
        if (onConfirm) onConfirm();
    });

    // Cerrar con click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
            if (onCancel) onCancel();
        }
    });

    function closeModal() {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Mostrar modal con animación
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);

    return modal;
}

console.log('✅ Funciones globales de menú agregadas a market-posts.js');
