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
    
    setTimeout(() => {
    initializeMarketViewLikesButtons();
    if (typeof window.actualizarAnillosFlashesEnPosts === 'function') {
        window.actualizarAnillosFlashesEnPosts();
    }
}, 100);

// ✅ AGREGAR ESTA LÍNEA ADICIONAL (igual que en posts)
setTimeout(() => {
    if (typeof window.actualizarAnillosFlashesEnPosts === 'function') {
        window.actualizarAnillosFlashesEnPosts();
    }
}, 200);
}

// ============================================
// CREAR POST ELEMENT COMPATIBLE - VERSIÓN CORREGIDA
// ============================================

function createRealPostElementForMarket(post) {
    // Procesar contenido
    const processedContent = processPostContent ? processPostContent(post.contenido) : escapeHtml(post.contenido);
    
    // Generar avatar
    const avatarElement = post.avatar_url 
        ? `<img src="${post.avatar_url}" alt="${post.username}" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(post.username)}';">`
        : generateAvatarInitials(post.username);
    
    // Formatear tiempo
    // Formatear tiempo
const timeAgo = post.tiempo_relativo || formatTimeAgo(new Date(post.created_at));
    
    // Precio
    const precio = parseFloat(post.precio_venta) || 0;
    
    // Verificación de promoción
    const isPromoted = post.is_promoted === true || post.is_promoted === 1;
    
    // ✅ RENDERIZAR MEDIA CORRECTAMENTE
    let mediaHTML = '';
    if (post.media_url && post.media_url.trim() !== '') {
        const mediaType = post.tipo;
        
        switch (mediaType) {
            case 'imagen':
                mediaHTML = `
                    <div class="post-media" style="margin-bottom: 1rem;">
                        <img src="${post.media_url}" alt="Imagen del post" loading="lazy" style="width: 100%; max-width: 100%; object-fit: cover; display: block;">
                    </div>
                `;
                break;
case 'video':
    mediaHTML = renderPostMediaForMarket(post);
    break;
            case 'gif':
                mediaHTML = `
                    <div class="post-media" style="margin-bottom: 1rem;">
                        <img src="${post.media_url}" alt="GIF" loading="lazy" style="width: 100%; max-width: 100%; object-fit: cover; display: block;">
                    </div>
                `;
                break;
            default:
                mediaHTML = `
                    <div class="post-media" style="margin-bottom: 1rem;">
                        <img src="${post.media_url}" alt="Media" loading="lazy" style="width: 100%; max-width: 100%; object-fit: cover; display: block;">
                    </div>
                `;
        }
    }
    
    return `
        <div class="post-card market-post ${post.silenciado ? 'post-silenciado' : ''}" data-post-id="${post.id}">
            <div class="card-content" style="position: relative;">
                
<div class="post-actions-top" style="position: absolute; right: 0rem; display: flex; align-items: center; gap: 8px; z-index: 100;">
    ${isPromoted ? `
        <div class="promoted-badge-inline" style="background: linear-gradient(135deg, #1000ff00, #ffa50000); color: #7e7a89; padding: 4px 10px; border-radius: 20px; font-size: 0.6rem; font-weight: 700; display: flex; align-items: center; gap: 4px; border: 1px solid rgb(255 255 255 / 8%); box-shadow: 0 1px 5px rgba(99, 102, 241, 0.3) !important; white-space: nowrap;">
            📢 Promocionado
        </div>
    ` : ''}
    
    <button class="post-menu-btn" 
            onclick="event.stopPropagation(); abrirModalOpcionesPost('${post.id}')" 
            title="Más opciones" 
            style="background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: all 0.3s ease; outline: none;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="2"></circle>
            <circle cx="12" cy="5" r="2"></circle>
            <circle cx="12" cy="19" r="2"></circle>
        </svg>
    </button>
</div>

<div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding-left: 0.7rem;" onclick="event.stopPropagation();">

<!-- ✅ WRAPPER CON ANILLO DE FLASH - CLICKEABLE AL PERFIL -->
<div class="post-avatar-wrapper" 
     onclick="event.stopPropagation(); goToUserProfile('${post.username}')" 
     style="cursor: pointer;"
     title="Ver perfil de @${post.username}">
    <div class="post-avatar ${post.flash_info?.flash_status || 'no-flash'}" 
         data-flash-info='${JSON.stringify(post.flash_info || {})}' 
         data-username="${post.username}">
        ${avatarElement}
    </div>
</div>

                    <div style="flex: 1;">
                        <div style="font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                            <span class="profile-link post-author" onclick="goToUserProfile('${post.username}')" style="cursor: pointer; transition: all 0.3s ease;">${escapeHtml(post.display_name || post.username)}</span>
                            ${post.verified ? '<span style="color: var(--primary); font-size: 0.8rem;">✓</span>' : ''}
                        </div>
                        <div class="post-meta" style="color: var(--text-secondary); font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <span class="profile-link post-author" onclick="goToUserProfile('${post.username}')" style="cursor: pointer; transition: all 0.3s ease;">@${post.username}</span> • ${timeAgo} </span>
                            <button onclick="event.stopPropagation(); handleSaleIndicatorClick(event, '${post.id}')" class="sale-price-btn" style="background: linear-gradient(135deg, var(--warning), #f59e0b); color: white; border: none; padding: 0.3rem 0.4rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; user-select: none;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(245, 158, 11, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                💰 ${precio} CFT
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contenido del post -->
                <div class="post-content" style="margin-bottom: 1rem; line-height: 1.6; padding-left: 0.7rem;">${processedContent}</div>
                
                <!-- ✅ MEDIA RENDERIZADA CORRECTAMENTE -->
                ${mediaHTML}
                
                <!-- Hashtags -->
                ${post.hashtags && post.hashtags.length > 0 ? 
                    `<div class="hashtags" style="margin-bottom: 1rem;" onclick="event.stopPropagation();">
                        ${post.hashtags.map(tag => `<span class="hashtag" onclick="searchTrend('${tag}')" style="color: var(--primary); cursor: pointer; margin-right: 0.5rem;">#${tag}</span>`).join('')}
                    </div>` : ''
                }
                
<!-- Estadísticas -->
<div class="card-stats" onclick="event.stopPropagation();">
    ${(post.stats?.likes_count || 0) > 0 ? `
        <button class="post-stat-view-likes" 
                onclick="event.stopPropagation(); openLikesModal('publicacion', ${post.id}, event)"
                title="Ver quién dio like">
            Ver
        </button>
    ` : ''}
<button class="card-stat ${post.user_interactions?.liked ? 'liked' : ''}" 
        onclick="event.stopPropagation(); toggleRealPostLike(this, ${post.id})" 
        data-like-count="${post.stats?.likes_count || 0}"
        data-liked="${post.user_interactions?.liked || false}">
    <svg class="like-icon" width="16" height="16" viewBox="0 0 24 24" fill="${post.user_interactions?.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span class="like-count">${post.stats?.likes_count || 0}</span>
</button>
                    <button class="card-stat" onclick="event.stopPropagation(); openComments(this)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span class="comment-count">${post.stats?.comentarios_count || 0}</span>
</button>
                    <button class="card-stat ${post.user_interactions?.reposted ? 'reposted' : ''}" onclick="event.stopPropagation(); toggleRealRepost(this, ${post.id})" data-repost-count="${post.stats?.reposts_count || 0}" data-reposted="${post.user_interactions?.reposted || false}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path>
                        </svg>
                        ${post.stats?.reposts_count || 0}
                    </button>
                   <button class="card-stat" onclick="event.stopPropagation(); openShareModal(this)" data-share-count="${post.stats?.shares_count || 0}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path>
                        </svg>
                        <span class="share-count">${post.stats?.shares_count || 0}</span>
                    </button>
                    
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
            return `<div style="margin-bottom: 1rem;"><img src="${post.media_url}" alt="Imagen del post" loading="lazy" style="width: 100%; max-width: 100%; object-fit: cover; display: block;"></div>`;
            
        case 'video':
            // ✅ DETECCIÓN ROBUSTA DE SILENCIADO (compatible con tinyint(1))
            const isSilenced = post.silenciado === true || 
                              post.silenciado === 1 || 
                              post.silenciado === '1' ||
                              String(post.silenciado) === 'true';
            
            const videoAttributes = isSilenced ? 'muted' : '';
            
            return `
                <div class="post-media" style="margin-bottom: 1rem;">
                    <div class="video-container-custom ${isSilenced ? 'silenced' : 'with-sound'}">
                        <video 
                            src="${post.media_url}" 
                            ${videoAttributes}
                            preload="metadata"
                            data-post-id="${post.id}"
                            data-silenciado="${isSilenced}"
                        >
                            Tu navegador no soporta video.
                        </video>
                        <div class="custom-video-controls">
                            <button class="play-pause-btn" onclick="toggleVideoPlay(this)">
                                <svg class="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                <svg class="pause-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                </svg>
                            </button>
                            <div class="progress-container" onclick="seekVideo(event, this)">
                                <div class="progress-bar">
                                    <div class="progress-filled"></div>
                                </div>
                            </div>
                            ${!isSilenced ? `
                                <button class="volume-btn" onclick="toggleVideoVolume(this)">
                                    <svg class="volume-on" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                                    </svg>
                                    <svg class="volume-off" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                    </svg>
                                </button>
                            ` : ''}
                            <button class="fullscreen-btn" onclick="toggleVideoFullscreen(this)">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                </svg>
                            </button>
                        </div>
                        ${isSilenced ? '<div class="silenced-indicator">🔇</div>' : ''}
                    </div>
                </div>
            `;
            
        case 'gif':
            return `<div style="margin-bottom: 1rem;"><img src="${post.media_url}" alt="GIF" loading="lazy" style="width: 100%; max-width: 100%; object-fit: cover; display: block;"></div>`;
            
        default:
            return `<div style="margin-bottom: 1rem;"><img src="${post.media_url}" alt="Media" loading="lazy" style="width: 100%; max-width: 100%; object-fit: cover; display: block;"></div>`;
    }
}

// ============================================
// CREAR HTML COMPONENTS
// ============================================

function createMarketHeaderHTML() {
    return `
        <div class="market-header" style="background: rgba(26, 26, 36, 0.5); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 20px; margin-bottom: 20px;">
            <div class="market-stats" style="gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
                <div class="market-stat-item" style="display: flex; align-items: center; gap: 10px; background: rgba(99, 102, 241, 0.1); padding: 4px 16px; border-radius: 20px; border: 1px solid rgba(99, 102, 241, 0.2);">
                    <div class="stat-icon" style="font-size: 1.5rem;">🏪</div>
                    <div class="stat-info" style="
    display: flex;
    align-items: center;
    gap: 0.5rem;
">
                        <div class="stat-number" style="font-size: 1.1rem; font-weight: 600; color: var(--primary);">${formatNumber(MarketSystem.totalPosts)}</div>
                        <div class="stat-label" style="font-size: 0.85rem; color: var(--text-secondary);">Posts en Venta</div>
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
        <div class="market-filters-modern" style="
            background: rgba(26, 26, 36, 0.5);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        ">
<div style="display: flex; justify-content: space-between; align-items: center;">
    <h3 style="margin: 0;font-size: 1.1rem; font-weight: 700; color: #c6c9e5bf; display: flex; align-items: center;gap: 8px;">
        <span style="font-size: 1.3rem;">🎛️</span>
        Filtros y Ordenamiento
    </h3>
    
    <!-- ✅ BOTONES DEL LADO DERECHO -->
    <div style="display: flex; align-items: center; gap: 8px;">
        ${hasActiveFilters() ? `
            <button onclick="resetMarketFilters()" class="reset-filters-btn" style="
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15));
                border: 1px solid rgba(239, 68, 68, 0.4);
                color: #ef4444;
                padding: 8px 16px;
                border-radius: 12px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.3)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(239, 68, 68, 0.2)'">
                <span>🔄</span>
                <span>Limpiar</span>
            </button>
        ` : ''}
        
        <!-- ✅ BOTÓN TOGGLE (SIEMPRE VISIBLE) -->
        <button onclick="toggleMarketFilters()" 
                id="marketFiltersToggle" 
                class="market-filters-toggle"
                title="Mostrar/Ocultar filtros"
                style="
                    background: rgba(99, 102, 241, 0.15);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    color: var(--primary);
                    padding: 8px 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(99, 102, 241, 0.2)'">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s ease; transform: rotate(0deg);">
    <polyline points="6 9 12 15 18 9"></polyline>
</svg>
        </button>
    </div>
</div>

            <!-- Grid de filtros -->
<div class="filters-grid" style="
    display: none;
    gap: 1rem;
    margin: 1rem 0;
">
                <!-- Filtro de Ordenamiento -->
                <div class="filter-card" onclick="openSortModal()" style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 20px; padding: 0.8rem; cursor: pointer; width: 10rem; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; transform: translateY(0px); box-shadow: none;"
                onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(99, 102, 241, 0.5)'; this.style.boxShadow='0 8px 24px rgba(99, 102, 241, 0.15)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(99, 102, 241, 0.25)'; this.style.boxShadow='none'">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 0.9rem; color: #d1d5e5">📊 Ordenar</span>
                        <span style="
                            font-size: 1.3rem;
                            color: rgba(255, 255, 255, 0.4);
                            transition: transform 0.3s ease;
                        ">›</span>
                    </div>
                    <div id="current-sort-label" style="font-size: 0.75rem; color: var(--text-secondary);">
                        ${getSortLabel(MarketSystem.sortBy)}
                    </div>
                </div>

                <!-- Filtro de Tipo -->
                <div class="filter-card" onclick="openTypeFilterModal()" style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 20px; padding: 0.8rem; cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; transform: translateY(0px); box-shadow: none; width: 10rem;"
                onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(245, 158, 11, 0.5)'; this.style.boxShadow='0 8px 24px rgba(245, 158, 11, 0.15)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(245, 158, 11, 0.25)'; this.style.boxShadow='none'">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 0.9rem; color: #d1d5e5">🎯 Tipo de Post</span>
                        <span style="
                            font-size: 1.3rem;
                            color: rgba(255, 255, 255, 0.4);
                            transition: transform 0.3s ease;
                        ">›</span>
                    </div>
                    <div id="current-type-label" style="font-size: 0.75rem; color: var(--text-secondary);">
                        ${MarketSystem.filters.tipo ? getTypeLabel(MarketSystem.filters.tipo) : 'Todos los tipos'}
                    </div>
                </div>

                <!-- Filtro de Precio -->
                <div class="filter-card" onclick="openPriceFilterModal()" style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 20px; padding: 0.8rem; cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; transform: translateY(0px); box-shadow: none; width: 10rem;"
                onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='rgba(16, 185, 129, 0.5)'; this.style.boxShadow='0 8px 24px rgba(16, 185, 129, 0.15)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(16, 185, 129, 0.25)'; this.style.boxShadow='none'">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 0.9rem; color: #d1d5e5">💰 Rango de Precio</span>
                        <span style="
                            font-size: 1.3rem;
                            color: rgba(255, 255, 255, 0.4);
                            transition: transform 0.3s ease;
                        ">›</span>
                    </div>
                    <div id="current-price-label" style="font-size: 0.75rem; color: var(--text-secondary);">
                        ${getPriceRangeLabel()}
                    </div>
                </div>
            </div>

            <!-- Filtros activos (chips) -->
<div id="active-filters-chips" style="
    display: none;
    gap: 8px;
    flex-wrap: wrap;
    min-height: 32px;
">
                ${generateActiveFiltersChips()}
            </div>
        </div>
    `;
}

// ============================================
// VERIFICAR SI HAY FILTROS ACTIVOS
// ============================================

function hasActiveFilters() {
    return MarketSystem.filters.tipo !== null || 
           MarketSystem.filters.precio_min !== null || 
           MarketSystem.filters.precio_max !== null ||
           MarketSystem.sortBy !== 'newest';
}

// ============================================
// FUNCIONES AUXILIARES PARA LABELS DE FILTROS
// ============================================

function getPriceRangeLabel() {
    const min = MarketSystem.filters.precio_min;
    const max = MarketSystem.filters.precio_max;
    
    if (!min && !max) return 'Cualquier precio';
    if (min && max) return `${min} - ${max} CFT`;
    if (min) return `Desde ${min} CFT`;
    if (max) return `Hasta ${max} CFT`;
}

function generateActiveFiltersChips() {
    const chips = [];
    
    // Chip de tipo
    if (MarketSystem.filters.tipo) {
        chips.push(`
            <div class="filter-chip" style="
                background: rgba(245, 158, 11, 0.15);
                border: 1px solid rgba(245, 158, 11, 0.3);
                color: #f59e0b;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            "
            onclick="removeTypeFilter()"
            onmouseover="this.style.background='rgba(245, 158, 11, 0.25)'"
            onmouseout="this.style.background='rgba(245, 158, 11, 0.15)'">
                <span>${getTypeLabel(MarketSystem.filters.tipo)}</span>
                <span style="font-size: 0.9rem;">✕</span>
            </div>
        `);
    }
    
    // Chip de precio
    if (MarketSystem.filters.precio_min || MarketSystem.filters.precio_max) {
        chips.push(`
            <div class="filter-chip" style="
                background: rgba(16, 185, 129, 0.15);
                border: 1px solid rgba(16, 185, 129, 0.3);
                color: #10b981;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            "
            onclick="removePriceFilter()"
            onmouseover="this.style.background='rgba(16, 185, 129, 0.25)'"
            onmouseout="this.style.background='rgba(16, 185, 129, 0.15)'">
                <span>${getPriceRangeLabel()}</span>
                <span style="font-size: 0.9rem;">✕</span>
            </div>
        `);
    }
    
    return chips.length > 0 ? chips.join('') : '<span style="color: var(--text-secondary); font-size: 0.85rem;">Sin filtros activos</span>';
}

async function removeTypeFilter() {
    MarketSystem.filters.tipo = null;
    await loadMarketPosts();
    showNotification('🎯 Filtro de tipo eliminado');
}

async function removePriceFilter() {
    MarketSystem.filters.precio_min = null;
    MarketSystem.filters.precio_max = null;
    await loadMarketPosts();
    showNotification('💰 Filtro de precio eliminado');
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
        'video': '🎥 Video'
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
        
        const confirmModal = createConfirmModal(
            '💰 Comprar Publicación',
            `¿Confirmas la compra de esta publicación?\n\nDe: @${post.username}\nPrecio: ${precio} CFT\n\nLos tokens se transferirán automáticamente al vendedor.`,
            'Cancelar',
            `Comprar por ${precio} CFT`,
            () => {
                // Cancelar - no hacer nada
            },
            async () => {
                try {
                    const buyButtons = document.querySelectorAll(`[onclick*="buyPost('${postId}')"]`);
                    buyButtons.forEach(btn => {
                        btn.innerHTML = btn.innerHTML.replace(/💰.*/, '⏳ Comprando...');
                        btn.disabled = true;
                    });

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
                        
                        // Buscar el post en el DOM
                        let postCard = document.querySelector(`[data-post-id="${postId}"]`);
                        if (!postCard) {
                            postCard = document.querySelector(`[data-post-id="post-${postId}"]`);
                        }
                        
                        if (postCard) {
                            // Animación de salida suave
                            postCard.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                            postCard.style.opacity = '0';
                            postCard.style.transform = 'scale(0.9) translateY(-30px)';
                            postCard.style.pointerEvents = 'none';
                            
                            setTimeout(() => {
                                postCard.remove();
                                
                                // Actualizar contador interno
                                MarketSystem.totalPosts = Math.max(0, MarketSystem.totalPosts - 1);
                                
                                // Actualizar array de posts
                                const numericPostId = postId.toString().replace('post-', '');
                                MarketSystem.posts = MarketSystem.posts.filter(p => 
                                    p.id != postId && p.id != numericPostId
                                );
                                
                                // Actualizar header visual
                                const statNumber = document.querySelector('.market-header .stat-number');
                                if (statNumber) {
                                    statNumber.textContent = formatNumber(MarketSystem.totalPosts);
                                }
                                
                                // Si no quedan posts visibles, mostrar mensaje vacío
                                const feedContainer = document.getElementById('feedPosts');
                                if (feedContainer) {
                                    const remainingPosts = feedContainer.querySelectorAll('.post-card[data-post-id], .market-post[data-post-id]');
                                    
                                    if (remainingPosts.length === 0) {
                                        const marketHeader = feedContainer.querySelector('.market-header');
                                        const marketFilters = feedContainer.querySelector('.market-filters-modern');
                                        
                                        feedContainer.innerHTML = '';
                                        if (marketHeader) feedContainer.appendChild(marketHeader);
                                        if (marketFilters) feedContainer.appendChild(marketFilters);
                                        
                                        const emptyDiv = document.createElement('div');
                                        emptyDiv.innerHTML = createEmptyMarketHTML();
                                        feedContainer.appendChild(emptyDiv.firstElementChild);
                                    }
                                }
                            }, 500);
                        }
                    } else {
                        throw new Error(data.message || 'Error al comprar');
                    }
                    
                } catch (error) {
                    console.error('Error al comprar post:', error);
                    showNotification('❌ Error al procesar la compra: ' + error.message, 'error');
                    
                    const buyButtons = document.querySelectorAll(`[onclick*="buyPost('${postId}')"]`);
                    buyButtons.forEach(btn => {
                        btn.innerHTML = `💰 ${precio} CFT`;
                        btn.disabled = false;
                    });
                }
            }
        );

        document.body.appendChild(confirmModal);

    } catch (error) {
        console.error('Error al comprar post:', error);
        showNotification('❌ Error al procesar la compra: ' + error.message, 'error');
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
            color: #8d81eb !important;
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

    /* ============================================
   ESTILOS PARA FILTROS MODERNOS
   ============================================ */

/* Animación de hover para tarjetas de filtro */
.filter-card:hover span:last-child {
    transform: translateX(4px) !important;
}

/* Inputs con efectos modernos */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    opacity: 1;
}

input[type="number"] {
    -moz-appearance: textfield;
}

/* Botones de filtro con animación */
.filter-option {
    position: relative;
}

.filter-option::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
    pointer-events: none;
}

.filter-option:hover::before {
    opacity: 1;
}

.filter-option.active {
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2) !important;
}

/* Chips de filtros activos */
.filter-chip {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Modal overlay con blur */
.filter-modal-overlay {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Responsive para filtros */
@media (max-width: 768px) {
    .filters-grid {
        grid-template-columns: 1fr !important;
    }
    
    .filter-modal-content {
        padding: 24px !important;
        max-width: 95% !important;
    }
    
    .market-filters-modern {
        padding: 16px !important;
    }
}

/* Mejora visual del botón reset */
.reset-filters-btn:active {
    transform: translateY(-1px) scale(0.98) !important;
}

/* Efecto de foco en inputs de precio */
input[type="number"]:focus {
    border-color: var(--warning) !important;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.3) !important;
}

/* Animación del checkmark en opciones activas */
.filter-option.active span:last-child {
    animation: checkPop 0.3s ease-out;
}

@keyframes checkPop {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
    
`;
document.head.appendChild(marketStyles);

// ============================================
// DEFINIR FUNCIONES INLINE PARA MARKET
// ============================================

window.toggleRealPostLike = async function(button, postId) {
    try {
        console.log('Ejecutando toggleRealPostLike para post:', postId);
        const isLiked = button.classList.contains('liked');
        
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
            const newLikeCount = data.new_like_count;
            const liked = data.liked;
            
// ✅ ACTUALIZAR UI CON SVG
button.classList.toggle('liked', liked);

button.innerHTML = `
    <svg class="like-icon" width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span class="like-count">${newLikeCount}</span>
`;
            
            // ✅ GESTIONAR BOTÓN "VER" DINÁMICAMENTE
            const statsContainer = button.parentElement;
            let viewButton = statsContainer?.querySelector('.post-stat-view-likes');
            
            if (newLikeCount > 0) {
                if (!viewButton) {
                    // Crear botón "Ver" si no existe
                    viewButton = document.createElement('button');
                    viewButton.className = 'post-stat-view-likes';
                    viewButton.onclick = (e) => {
                        e.stopPropagation();
                        openLikesModal('publicacion', postId, e);
                    };
                    viewButton.title = 'Ver quién dio like';
                    viewButton.textContent = 'Ver';
                    
                    // Insertar ANTES del botón de likes
                    statsContainer.insertBefore(viewButton, button);
                }
            } else {
                // Eliminar botón "Ver" si ya no hay likes
                if (viewButton) {
                    viewButton.remove();
                }
            }
            
            // Actualizar atributo
            button.setAttribute('data-like-count', newLikeCount);
            
            // Efecto visual
            button.style.transform = 'scale(1.1)';
            setTimeout(() => button.style.transform = 'scale(1)', 200);
            
            // Notificación
            if (data.tokens_affected > 0) {
                if (typeof showNotification === 'function') {
                    showNotification(`❤️ ${liked ? 'Like agregado' : 'Like removido'}! ${data.tokens_affected} CFT`);
                }
            }
        } else {
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

window.toggleRealRepost = async function(button, postId) {
    try {
        console.log('Ejecutando toggleRealRepost para post:', postId);
        const isReposted = button.classList.contains('reposted');
        
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
            // ✅ EVITAR QUE BUTTON-LOADER RESTAURE HTML VIEJO
            button.setAttribute('data-skip-restore', 'true');
            button.removeAttribute('data-original-html');
            button.classList.remove('btn-loading');
            
            if (isReposted) {
                button.classList.remove('reposted');
                showNotification('❌ Repost eliminado');
            } else {
                button.classList.add('reposted');
                button.style.transform = 'scale(1.2) rotate(180deg)';
                setTimeout(() => button.style.transform = 'scale(1) rotate(0deg)', 300);
                showNotification('🔄 ¡Post reposteado!');
            }
            
            button.dataset.repostCount = data.new_repost_count;
            
            // ✅ ACTUALIZAR HTML CON SVG NUEVO
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                </svg>
                ${data.new_repost_count}
            `;
            
        } else {
            throw new Error(data.message || 'Error al procesar repost');
        }

    } catch (error) {
        console.error('Error en repost:', error);
        showNotification('❌ Error al procesar repost: ' + error.message, 'error');
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
                background: linear-gradient(135deg, #10b981, #059669);
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

// ============================================
// MODALES DE FILTROS MODERNOS
// ============================================

window.openSortModal = function() {
    const modal = createFilterModal(
        '📊 Ordenar Posts',
        'Selecciona cómo quieres ordenar los posts del marketplace',
        [
            { value: 'newest', label: 'Más Recientes', icon: '🆕', current: MarketSystem.sortBy === 'newest' },
            { value: 'oldest', label: 'Más Antiguos', icon: '📅', current: MarketSystem.sortBy === 'oldest' },
            { value: 'price_low', label: 'Precio: Menor a Mayor', icon: '💵', current: MarketSystem.sortBy === 'price_low' },
            { value: 'price_high', label: 'Precio: Mayor a Menor', icon: '💰', current: MarketSystem.sortBy === 'price_high' }
        ],
        (selectedValue) => changeMarketSort(selectedValue)
    );
    
    document.body.appendChild(modal);
};

window.openTypeFilterModal = function() {
    const modal = createFilterModal(
        '🎯 Tipo de Post',
        'Filtra los posts por su tipo de contenido',
        [
            { value: '', label: 'Todos los Tipos', icon: '🌐', current: !MarketSystem.filters.tipo },
            { value: 'texto', label: 'Texto', icon: '📝', current: MarketSystem.filters.tipo === 'texto' },
            { value: 'imagen', label: 'Imagen', icon: '🖼️', current: MarketSystem.filters.tipo === 'imagen' },
            { value: 'video', label: 'Video', icon: '🎥', current: MarketSystem.filters.tipo === 'video' }
        ],
        (selectedValue) => changeMarketTypeFilter(selectedValue)
    );
    
    document.body.appendChild(modal);
};

window.openPriceFilterModal = function() {
    const modalHTML = `
        <div class="filter-modal-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        ">
            <div class="filter-modal-content" style="
                background: linear-gradient(135deg, rgba(26, 26, 36, 0.98), rgba(37, 37, 50, 0.98));
                border-radius: 24px;
                padding: 32px;
                max-width: 450px;
                width: 90%;
                border: 1px solid rgba(99, 102, 241, 0.2);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transform: scale(0.9) translateY(20px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            ">
                <!-- Header -->
                <div style="margin-bottom: 24px;">
                    <h3 style="
                        margin: 0 0 8px 0;
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: var(--text);
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    ">
                        <span style="font-size: 1.8rem;">💰</span>
                        Rango de Precio
                    </h3>
                    <p style="
                        margin: 0;
                        color: var(--text-secondary);
                        font-size: 0.9rem;
                        line-height: 1.5;
                    ">
                        Define el rango de precios para filtrar los posts
                    </p>
                </div>

                <!-- Inputs de precio -->
                <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px;">
                    <div class="price-input-group">
                        <label style="
                            display: block;
                            font-size: 0.85rem;
                            font-weight: 600;
                            color: var(--text);
                            margin-bottom: 8px;
                        ">Precio Mínimo (CFT)</label>
                        <input 
                            type="number" 
                            id="precio-min-input"
                            placeholder="Ej: 10"
                            value="${MarketSystem.filters.precio_min || ''}"
                            min="0"
                            style="
                                width: 100%;
                                background: rgba(37, 37, 50, 0.6);
                                border: 1px solid rgba(99, 102, 241, 0.3);
                                border-radius: 12px;
                                padding: 14px 16px;
                                color: var(--text);
                                font-size: 1rem;
                                transition: all 0.3s ease;
                                outline: none;
                                box-sizing: border-box;
                            "
                            onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 0 3px rgba(99, 102, 241, 0.1)'"
                            onblur="this.style.borderColor='rgba(99, 102, 241, 0.3)'; this.style.boxShadow='none'"
                        >
                    </div>

                    <div class="price-input-group">
                        <label style="
                            display: block;
                            font-size: 0.85rem;
                            font-weight: 600;
                            color: var(--text);
                            margin-bottom: 8px;
                        ">Precio Máximo (CFT)</label>
                        <input 
                            type="number" 
                            id="precio-max-input"
                            placeholder="Ej: 1000"
                            value="${MarketSystem.filters.precio_max || ''}"
                            min="0"
                            style="
                                width: 100%;
                                background: rgba(37, 37, 50, 0.6);
                                border: 1px solid rgba(99, 102, 241, 0.3);
                                border-radius: 12px;
                                padding: 14px 16px;
                                color: var(--text);
                                font-size: 1rem;
                                transition: all 0.3s ease;
                                outline: none;
                                box-sizing: border-box;
                            "
                            onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 0 3px rgba(99, 102, 241, 0.1)'"
                            onblur="this.style.borderColor='rgba(99, 102, 241, 0.3)'; this.style.boxShadow='none'"
                        >
                    </div>
                </div>

                <!-- Botones -->
                <div style="display: flex; gap: 12px;">
                    <button class="modal-cancel-btn" style="
                        flex: 1;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: var(--text-secondary);
                        padding: 14px;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 0.95rem;
                    "
                    onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.transform='translateY(0)'">
                        Cancelar
                    </button>
                    <button class="modal-apply-btn" style="
                        flex: 1;
                        background: linear-gradient(135deg, var(--primary), var(--secondary));
                        border: none;
                        color: white;
                        padding: 14px;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 0.95rem;
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(99, 102, 241, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.3)'">
                        Aplicar Filtro
                    </button>
                </div>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    const modal = modalContainer.firstElementChild;

    // Event listeners
    const cancelBtn = modal.querySelector('.modal-cancel-btn');
    const applyBtn = modal.querySelector('.modal-apply-btn');
    const overlay = modal;

    cancelBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(modal);
    });

    applyBtn.addEventListener('click', async () => {
        const minInput = modal.querySelector('#precio-min-input');
        const maxInput = modal.querySelector('#precio-max-input');
        
        const min = minInput.value ? parseFloat(minInput.value) : null;
        const max = maxInput.value ? parseFloat(maxInput.value) : null;

        if (min !== null && max !== null && min > max) {
            showNotification('❌ El precio mínimo no puede ser mayor al máximo', 'error');
            return;
        }

        MarketSystem.filters.precio_min = min;
        MarketSystem.filters.precio_max = max;
        MarketSystem.currentPage = 0;
        MarketSystem.hasMore = true;
        MarketSystem.posts = [];
        
        closeModal(modal);
        
        // Actualizar label en la UI
        const priceLabel = document.getElementById('current-price-label');
        if (priceLabel) {
            priceLabel.textContent = getPriceRangeLabel();
        }
        
        // Actualizar chips de filtros activos
        const chipsContainer = document.getElementById('active-filters-chips');
        if (chipsContainer) {
            chipsContainer.innerHTML = generateActiveFiltersChips();
        }
        
        await loadMarketPosts();
        showNotification(`💰 Filtro de precio aplicado: ${getPriceRangeLabel()}`, 'success');
    });

    function closeModal(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.filter-modal-content').style.transform = 'scale(0.9) translateY(20px)';
        setTimeout(() => modal.remove(), 300);
    }

    document.body.appendChild(modal);
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.filter-modal-content').style.transform = 'scale(1) translateY(0)';
    }, 10);
};

// Función auxiliar para crear modales de opciones
function createFilterModal(title, description, options, onSelect) {
    const modalHTML = `
        <div class="filter-modal-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        ">
            <div class="filter-modal-content" style="
                background: linear-gradient(135deg, rgba(26, 26, 36, 0.98), rgba(37, 37, 50, 0.98));
                border-radius: 24px;
                padding: 32px;
                max-width: 450px;
                width: 90%;
                border: 1px solid rgba(99, 102, 241, 0.2);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transform: scale(0.9) translateY(20px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            ">
                <!-- Header -->
                <div style="margin-bottom: 24px;">
                    <h3 style="
                        margin: 0 0 8px 0;
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: var(--text);
                    ">${title}</h3>
                    <p style="
                        margin: 0;
                        color: var(--text-secondary);
                        font-size: 0.9rem;
                        line-height: 1.5;
                    ">${description}</p>
                </div>

                <!-- Opciones -->
                <div class="filter-options" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
                    ${options.map(option => `
                        <button class="filter-option ${option.current ? 'active' : ''}" data-value="${option.value}" style="
                            background: ${option.current ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))' : 'rgba(37, 37, 50, 0.4)'};
                            border: 1px solid ${option.current ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
                            color: var(--text);
                            padding: 16px 20px;
                            border-radius: 12px;
                            cursor: pointer;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            text-align: left;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            font-weight: ${option.current ? '600' : '500'};
                            position: relative;
                            overflow: hidden;
                        "
                        onmouseover="
                            this.style.transform='translateX(4px)';
                            this.style.background='${option.current ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))' : 'rgba(37, 37, 50, 0.6)'}';
                            this.style.borderColor='${option.current ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.2)'}';
                        "
                        onmouseout="
                            this.style.transform='translateX(0)';
                            this.style.background='${option.current ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))' : 'rgba(37, 37, 50, 0.4)'}';
                            this.style.borderColor='${option.current ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)'}';
                        ">
                            <span style="font-size: 1.5rem;">${option.icon}</span>
                            <span style="flex: 1;">${option.label}</span>
                            ${option.current ? '<span style="color: var(--primary); font-size: 1.2rem;">✓</span>' : ''}
                        </button>
                    `).join('')}
                </div>

                <!-- Botón Cancelar -->
                <button class="modal-cancel-btn" style="
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    padding: 14px;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                "
                onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(-2px)'"
                onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.transform='translateY(0)'">
                    Cancelar
                </button>
            </div>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    const modal = modalContainer.firstElementChild;

    // Event listeners
    const cancelBtn = modal.querySelector('.modal-cancel-btn');
    const optionButtons = modal.querySelectorAll('.filter-option');
    const overlay = modal;

    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            closeModal(modal);
            onSelect(value);
        });
    });

    cancelBtn.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(modal);
    });

    function closeModal(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.filter-modal-content').style.transform = 'scale(0.9) translateY(20px)';
        setTimeout(() => modal.remove(), 300);
    }

    document.body.appendChild(modal);
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.filter-modal-content').style.transform = 'scale(1) translateY(0)';
    }, 10);

    return modal;
}

/**
 * Inicializar botones "Ver" en todos los posts de market
 */
function initializeMarketViewLikesButtons() {
    const allCards = document.querySelectorAll('.post-card[data-post-id]');
    
    allCards.forEach(card => {
        const postId = card.dataset.postId;
        if (!postId) return;
        
        const cardStats = card.querySelector('.card-stats');
        const likeButton = cardStats?.querySelector('.card-stat[onclick*="toggleRealPostLike"]');
        
        if (!cardStats || !likeButton) return;
        
        // Obtener cantidad de likes del atributo data
        const likeCount = parseInt(likeButton.dataset.likeCount || likeButton.querySelector('.like-count')?.textContent || '0');
        
        // Verificar si ya existe el botón "Ver"
        let viewButton = cardStats.querySelector('.post-stat-view-likes');
        
        if (likeCount > 0) {
            // Si hay likes y NO existe el botón, crearlo
            if (!viewButton) {
                viewButton = document.createElement('button');
                viewButton.className = 'post-stat-view-likes';
                viewButton.onclick = (e) => {
                    e.stopPropagation();
                    openLikesModal('publicacion', postId, e);
                };
                viewButton.title = 'Ver quién dio like';
                viewButton.textContent = 'Ver';
                
                // Insertar ANTES del botón de likes
                cardStats.insertBefore(viewButton, likeButton);
            }
        } else {
            // Si NO hay likes, eliminar el botón si existe
            if (viewButton) {
                viewButton.remove();
            }
        }
    });
    
    console.log('✅ Botones "Ver" de Market inicializados');
}

// ============================================
// TOGGLE DE VISIBILIDAD DE FILTROS DEL MARKET
// ============================================

/**
 * Mostrar/Ocultar filtros del market
 */
window.toggleMarketFilters = function() {
    const filtersGrid = document.querySelector('.market-filters-modern .filters-grid');
    const activeChips = document.getElementById('active-filters-chips');
    const toggleBtn = document.getElementById('marketFiltersToggle');
    const toggleIcon = toggleBtn?.querySelector('svg');
    
    if (!filtersGrid || !activeChips || !toggleBtn) {
        console.warn('⚠️ Elementos de filtros no encontrados');
        return;
    }
    
    // Verificar estado actual
    const isHidden = filtersGrid.style.display === 'none';
    
    if (isHidden) {
        // MOSTRAR
        filtersGrid.style.display = 'flex';
        activeChips.style.display = 'flex';
        
        // Animar entrada
        filtersGrid.style.animation = 'slideDown 0.3s ease';
        activeChips.style.animation = 'slideDown 0.3s ease';
        
        // Rotar flecha hacia arriba
        if (toggleIcon) {
            toggleIcon.style.transform = 'rotate(180deg)';
        }
        
        // Guardar estado
        localStorage.setItem('marketFiltersVisible', 'true');
        
        console.log('✅ Filtros mostrados');
        
    } else {
        // OCULTAR
        filtersGrid.style.display = 'none';
        activeChips.style.display = 'none';
        
        // Rotar flecha hacia abajo
        if (toggleIcon) {
            toggleIcon.style.transform = 'rotate(0deg)';
        }
        
        // Guardar estado
        localStorage.setItem('marketFiltersVisible', 'false');
        
        console.log('✅ Filtros ocultados');
    }
};

/**
 * Restaurar estado de filtros al cargar market
 */
function restoreMarketFiltersState() {
    const savedState = localStorage.getItem('marketFiltersVisible');
    
    // Si el usuario había ocultado los filtros, mantenerlos ocultos
    if (savedState === null || savedState === 'false') { 
        const filtersGrid = document.querySelector('.market-filters-modern .filters-grid');
        const activeChips = document.getElementById('active-filters-chips');
        const toggleIcon = document.querySelector('#marketFiltersToggle svg');
        
        if (filtersGrid) filtersGrid.style.display = 'none';
        if (activeChips) activeChips.style.display = 'none';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
        
        console.log('📌 Estado de filtros restaurado: ocultos');
    } else {
        console.log('📌 Estado de filtros restaurado: visibles');
    }
}

// ============================================
// EJECUTAR AL CARGAR MARKET
// ============================================

// Interceptar la función showMarket para restaurar estado
const originalShowMarket = window.showMarket;
if (originalShowMarket) {
    window.showMarket = function() {
        originalShowMarket.apply(this, arguments);
        setTimeout(restoreMarketFiltersState, 300);
    };
}

// También ejecutar al cargar la página si ya estamos en market
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer && feedContainer.querySelector('.market-header')) {
            restoreMarketFiltersState();
        }
    }, 500);
});

console.log('✅ Sistema de toggle de filtros de market cargado');

// Hacer función global
window.initializeMarketViewLikesButtons = initializeMarketViewLikesButtons;