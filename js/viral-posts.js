
// ============================================
// FUNCIÓN PRINCIPAL PARA CARGAR POSTS VIRALES
// ============================================
// Estado del feed viral
const ViralFeedState = {
    posts: [],
    currentOffset: 0,
    limit: 20,
    isLoading: false,
    hasMore: true,
    totalPosts: 0,
    currentPeriod: '24h' // ✅ NUEVO: filtro temporal por defecto
};

/**
 * ✅ NUEVA FUNCIÓN: Filtrar posts virales por período
 */
function filterViralsByPeriod(period) {
    console.log(`📅 Cambiando período viral a: ${period}`);
    
    // Actualizar estado
    ViralFeedState.currentPeriod = period;
    ViralFeedState.currentOffset = 0;
    
    // Actualizar botones activos
    document.querySelectorAll('[data-viral-period]').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-viral-period="${period}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Recargar posts con nuevo filtro
    loadViralPosts(false);
}

// Hacer función global
window.filterViralsByPeriod = filterViralsByPeriod;

async function loadViralPosts(append = false) {
    if (ViralFeedState.isLoading) return;
    
    try {
        ViralFeedState.isLoading = true;
        showViralLoadingSpinner();

        const response = await fetch('../php/obtener_feed_virales.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                limit: ViralFeedState.limit,
                offset: append ? ViralFeedState.currentOffset : 0,
                tipo: null,
                periodo: ViralFeedState.currentPeriod // ✅ AGREGAR ESTA LÍNEA
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar posts virales');
        }

        if (!data.success) {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }

        // Actualizar estado
        if (append) {
            ViralFeedState.posts = [...ViralFeedState.posts, ...data.publicaciones];
        } else {
            ViralFeedState.posts = data.publicaciones;
            ViralFeedState.currentOffset = 0;
        }

        ViralFeedState.totalPosts = data.pagination.total;
        ViralFeedState.hasMore = data.pagination.has_more;
        ViralFeedState.currentOffset = data.pagination.next_offset || ViralFeedState.currentOffset;

        // Renderizar
        renderViralPosts(append);

        console.log(`✅ Posts virales cargados (${ViralFeedState.currentPeriod}): ${data.publicaciones.length} posts`);

    } catch (error) {
        console.error('Error cargando posts virales:', error);
        showNotification(`❌ Error: ${error.message}`, 'error');
        showViralErrorState();
    } finally {
        ViralFeedState.isLoading = false;
        hideViralLoadingSpinner();
    }
}

/**
 * Renderizar posts virales en el DOM
 */
function renderViralPosts(append = false) {
    const feedContainer = document.getElementById('feedPosts');
    if (!feedContainer) return;

    if (!append) {
        // Limpiar posts existentes si no es append
        feedContainer.innerHTML = '';
    }

    // Renderizar cada post viral con ranking
    ViralFeedState.posts.forEach((post, index) => {
        // Evitar duplicados en append
        if (append && document.querySelector(`[data-post-id="post-${post.id}"]`)) {
            return;
        }

        const postElement = createViralPostElement(post, index + 1 + (append ? ViralFeedState.currentOffset - ViralFeedState.limit : 0));
        feedContainer.appendChild(postElement);

        // Animación escalonada
        setTimeout(() => {
            postElement.style.animation = 'cardAppear 0.5s ease forwards';
        }, index * 100);
    });

    // Mostrar mensaje si no hay posts virales
    if (ViralFeedState.posts.length === 0) {
        showEmptyViralState();
    }
}

/**
 * Crear elemento DOM para un post viral con ranking
 */
function createViralPostElement(post, ranking) {
    const div = document.createElement('div');
    div.className = 'post-card viral-post';
    div.dataset.postId = `post-${post.id}`;
    div.style.opacity = '0';
    div.style.position = 'relative';
    
    // Agregar clase especial para posts virales
    div.classList.add('viral-ranking-' + (ranking <= 3 ? ranking : 'normal'));
    
    // Agregar clase para controlar visibilidad del volumen
    if (post.silenciado) {
        div.classList.add('post-silenciado');
    }
    
    // ✅ VERIFICAR SI EL POST ESTÁ OCULTO
    const hiddenPosts = JSON.parse(localStorage.getItem('chainfeed_hidden_posts') || '[]');
    if (hiddenPosts.includes(`post-${post.id}`)) {
        div.style.display = 'none';
        return div;
    }
    
    // ✅ VERIFICAR PROPIEDAD DEL POST (igual que en feed de inicio)
    let currentUserId = window.CHAINFEED_CONFIG?.currentUser?.id;
    let currentUsername = window.CHAINFEED_CONFIG?.currentUser?.username;

    if (!currentUserId && !currentUsername) {
        console.warn('⚠️ CHAINFEED_CONFIG no está disponible todavía.');
    }

    const isOwner = (
        (post.usuario_id && currentUserId && 
         (parseInt(post.usuario_id) === parseInt(currentUserId) || 
          String(post.usuario_id) === String(currentUserId))) ||
        (post.username && currentUsername && 
         String(post.username).toLowerCase() === String(currentUsername).toLowerCase())
    );
    
    const isForSale = (parseInt(post.en_venta) === 1) && (parseFloat(post.precio_venta) > 0);
    
    // Procesar contenido (hashtags, menciones)
    const processedContent = processPostContent(post.contenido);
    
    // Generar avatar
    const avatarElement = post.avatar_url 
        ? `<img src="${post.avatar_url}" alt="${post.username}" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(post.username)}';">`
        : generateAvatarInitials(post.username);
    
    // Formatear tiempo
    const timeAgo = formatTimeAgo(new Date(post.created_at));
    
    // Calcular indicador de viralidad
    const totalInteracciones = post.stats.total_interacciones || 0;
    const viralityIcon = getViralityIcon(totalInteracciones);
    
    // ✅ OBTENER CONTADORES REALES
    const likesCount = post.stats.likes_count || 0;
    const commentsCount = post.stats.comentarios_count || 0;
    const repostsCount = post.stats.reposts_count || 0;
    const sharesCount = post.stats.shares_count || 0;
    
    // ✅ OBTENER ESTADOS DE INTERACCIÓN DEL USUARIO
    const userLiked = post.user_interactions.liked || false;
    const userReposted = post.user_interactions.reposted || false;
    
    // ✅ VERIFICAR SI ES POST PROMOCIONADO
    const isPromoted = post.is_promoted || false;
    
    // Generar ID único para el menú
    const postId = `post-${post.id}`;
    
    // ✅ GENERAR OPCIONES DE MENÚ (IGUAL QUE EN FEED DE INICIO)
    let menuOptions = '';
    
    if (isOwner) {
        // Menú para propietario
        
        // ✅ SOLO MOSTRAR "PROMOCIONAR" SI NO ESTÁ PROMOCIONADO
        if (!post.is_promoted) {
            menuOptions = `
                <button class="post-dropdown-item" onclick="promotePostInicio('${postId}')">
                    <span style="font-size: 1.1rem; width: 20px; text-align: center;">📢</span>
                    <span>Promocionar post</span>
                </button>
                <div class="post-dropdown-divider"></div>
            `;
        }
        
        // Resto de opciones del propietario
        const saleButtonIcon = isForSale ? '❌' : '💰';
        const saleButtonText = isForSale ? 'Cancelar venta' : 'Poner en venta';
        const saleButtonAction = isForSale ? `cancelSale('${postId}')` : `sellPost('${postId}')`;
        
        menuOptions += `
            <button class="post-dropdown-item" onclick="togglePostPrivacy('${postId}', ${post.es_publica || false})">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">${post.es_publica ? '🔒' : '🌍'}</span>
                <span>${post.es_publica ? 'Hacer privado' : 'Hacer público'}</span>
            </button>
            <div class="post-dropdown-divider"></div>
            <button class="post-dropdown-item" onclick="deletePost('${postId}')">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">🗑️</span>
                <span>Eliminar publicación</span>
            </button>
            <div class="post-dropdown-divider"></div>
            <button class="post-dropdown-item" onclick="${saleButtonAction}">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">${saleButtonIcon}</span>
                <span>${saleButtonText}</span>
            </button>
        `;
    } else {
        // ✅ MENÚ PARA NO PROPIETARIO (CON OCULTAR)
        menuOptions = `
            <button class="post-dropdown-item" onclick="hidePost('${postId}')">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">👁️‍🗨️</span>
                <span>Ocultar post</span>
            </button>
            <div class="post-dropdown-divider"></div>
            <button class="post-dropdown-item danger" onclick="reportPost('${postId}')">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">⚠️</span>
                <span>Reportar post</span>
            </button>
        `;
    }
    
    // Crear HTML del post viral
    div.innerHTML = `
        <div class="viral-indicator">
            <div class="viral-ranking">#${ranking}</div>
            <div class="viral-fire">${viralityIcon}</div>
            <div class="viral-stats">${totalInteracciones} interacciones</div>
        </div>
<div class="post-header">

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
            
            <div class="post-author-info">
                <div class="post-author">
                    ${escapeHtml(post.display_name)}
                    ${post.verified ? '<span class="verified-badge">✓</span>' : ''}
                </div>
                <div class="post-meta">@${escapeHtml(post.username)} • ${timeAgo} </div>
            </div>
            
            <!-- ✅ CONTENEDOR CON BADGE Y MENÚ JUNTOS -->
            <div class="post-actions-top" style="
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                align-items: center;
                gap: 8px;
                z-index: 100;
            ">
${post.is_promoted ? `
    <div class="promoted-badge-inline" style="
        background: linear-gradient(135deg, #1000ff00, #ffa50000);
        color: #7e7a89;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.6rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 4px;
        border: 1px solid rgb(255 255 255 / 8%);
        box-shadow: 0 1px 5px rgba(99, 102, 241, 0.3) !important;
        white-space: nowrap;
    ">
        📢 Promocionado
    </div>
` : ''}
                
                <div class="post-menu-container">
                    <button class="post-menu-btn" onclick="event.stopPropagation(); togglePostMenu('${postId}')" 
                            title="Más opciones">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="2"/>
                            <circle cx="12" cy="5" r="2"/>
                            <circle cx="12" cy="19" r="2"/>
                        </svg>
                    </button>
                    
                    <div class="post-dropdown hidden" id="postDropdown-${postId}">
                        ${menuOptions}
                    </div>
                </div>
            </div>
        </div>
        <div class="post-content">${processedContent}</div>
        ${post.media_url ? `
            <div class="post-media">
                ${renderPostMediaWithVolumeControl(post)}
            </div>
        ` : ''}
       <div class="post-stats">
    ${likesCount > 0 ? `
        <button class="post-stat-view-likes" 
                onclick="event.stopPropagation(); openLikesModal('publicacion', ${post.id}, event)"
                title="Ver quién dio like">
            Ver
        </button>
    ` : ''}
<button class="post-stat ${userLiked ? 'liked' : ''}" 
            onclick="toggleRealPostLike(this, ${post.id})"
            data-like-count="${likesCount}">
        <svg class="like-icon" width="16" height="16" viewBox="0 0 24 24" fill="${userLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span class="like-count">${likesCount}</span>
    </button>
    <button class="post-stat" 
            onclick="openComments(this)" 
            data-comments-count="${commentsCount}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="comment-count">${commentsCount}</span>
    </button>
    <button class="post-stat ${userReposted ? 'reposted' : ''}" 
            onclick="toggleRealRepost(this, ${post.id})" 
            data-repost-count="${repostsCount}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
        </svg>
        ${repostsCount}
    </button>
    <button class="post-stat" 
            onclick="openShareModal(this)"
            data-share-count="${sharesCount}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
        </svg>
        ${sharesCount}
    </button>
    ${(post.tipo === 'video' && post.silenciado !== true && post.silenciado !== 'true' && !post.silenciado) ? `
        <button class="post-stat volume-control" 
                onclick="togglePostVolume(this, ${post.id})" 
                title="Controlar volumen">
            <svg class="volume-icon volume-on" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <svg class="volume-icon volume-off" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
        </button>
    ` : ''}
</div>
    `;
    
    return div;
}

/**
 * Generar opciones del menú desplegable según el estado del post
 */
function generatePostDropdownOptions(post) {
    // Verificar si el usuario actual es el dueño del post
    const currentUserId = window.currentUserId || null; // Asegúrate de tener esta variable global
    const isOwner = currentUserId && currentUserId === post.usuario_id;
    
    if (!isOwner) {
        // Opciones para usuarios que NO son dueños del post
        return `
            <button class="post-dropdown-item" onclick="reportPost('post-${post.id}')">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">🚩</span>
                <span>Reportar publicación</span>
            </button>
        `;
    }
    
    // Opciones para el dueño del post
    let options = '';
    
    // Opción de privacidad
    if (post.es_publica) {
        options += `
            <button class="post-dropdown-item" onclick="togglePostPrivacy('post-${post.id}', false)">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">🔒</span>
                <span>Hacer privado</span>
            </button>
        `;
    } else {
        options += `
            <button class="post-dropdown-item" onclick="togglePostPrivacy('post-${post.id}', true)">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">🌍</span>
                <span>Hacer público</span>
            </button>
        `;
    }
    
    options += `<div class="post-dropdown-divider"></div>`;
    
    // Opción de eliminar
    options += `
        <button class="post-dropdown-item" onclick="deletePost('post-${post.id}')">
            <span style="font-size: 1.1rem; width: 20px; text-align: center;">🗑️</span>
            <span>Eliminar publicación</span>
        </button>
    `;
    
    // Si está en venta, opción de cancelar venta
    if (post.en_venta) {
        options += `
            <div class="post-dropdown-divider"></div>
            <button class="post-dropdown-item" onclick="cancelSale('post-${post.id}')">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">❌</span>
                <span>Cancelar venta</span>
            </button>
        `;
    }
    
    return options;
}

/**
 * Obtener icono de viralidad según interacciones
 */
function getViralityIcon(interacciones) {
    if (interacciones >= 100) return '🔥🔥🔥';
    if (interacciones >= 50) return '🔥🔥';
    if (interacciones >= 20) return '🔥';
    return '📈';
}

/**
 * Mostrar estadísticas especiales para posts virales
 */
function showViralStats(data) {
    if (data.publicaciones.length === 0) return;
    
    const topPost = data.publicaciones[0];
    const totalPosts = data.pagination.total;

}

/**
 * Configurar scroll infinito para posts virales
 */
function setupViralInfiniteScroll() {
    // Remover observer anterior si existe
    if (window.viralScrollObserver) {
        window.viralScrollObserver.disconnect();
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && ViralFeedState.hasMore && !ViralFeedState.isLoading && currentFeedType === 'virales') {
                loadViralPosts(true); // Cargar más posts virales
            }
        });
    }, {
        rootMargin: '100px'
    });

    // Buscar o crear elemento sentinel
    let sentinel = document.getElementById('viral-feed-sentinel');
    if (!sentinel) {
        sentinel = document.createElement('div');
        sentinel.id = 'viral-feed-sentinel';
        sentinel.style.height = '1px';
    }
    
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer) {
        feedContainer.appendChild(sentinel);
        observer.observe(sentinel);
        window.viralScrollObserver = observer;
    }
}

/**
 * Mostrar estado vacío para posts virales
 */
function showEmptyViralState() {
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer && ViralFeedState.posts.length === 0) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔥</div>
                <h3>No hay posts virales</h3>
                <p>No se encontraron posts con interacciones en el periodo seleccionado</p>
                <button onclick="showPosts()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Ver todos los posts
                </button>
            </div>
        `;
    }
}

/**
 * Mostrar estado de error para posts virales
 */
function showViralErrorState() {
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Error al cargar posts virales</h3>
                <p>No pudimos cargar los posts virales. Intenta recargar.</p>
                <button onclick="loadViralPosts()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Reintentar
                </button>
            </div>
        `;
    }
}

// ============================================
// ACTUALIZAR FUNCIONES DE NAVEGACIÓN
// ============================================

/**
 * Mostrar posts virales - FUNCIÓN ACTUALIZADA
 */
function showVirales() {
    currentFeedType = 'virales';
    updateActiveTab(event.target);
    
    // Desconectar observer del feed normal
    if (window.normalScrollObserver) {
        window.normalScrollObserver.disconnect();
    }
    
    // Cargar posts virales
    loadViralPosts();
}

/**
 * Mostrar posts normales - FUNCIÓN ACTUALIZADA
 */
function showPosts() {
    currentFeedType = 'posts';
    updateActiveTab(event.target);
    
    // Desconectar observer del feed viral
    if (window.viralScrollObserver) {
        window.viralScrollObserver.disconnect();
    }
    
    // Resetear estado viral
    ViralFeedState.isActive = false;
    
    // Cargar posts normales
    loadFeedPosts();
    
}

// ============================================
// ESTILOS CSS PARA POSTS VIRALES
// ============================================

const viralPostsStyles = document.createElement('style');
viralPostsStyles.textContent = `
    /* Estilos para posts virales */
    .viral-post {
        position: relative;
        overflow: visible;
    }
    
    .viral-indicator {
        position: absolute;
        top: -8px;
        right: -8px;
        background: linear-gradient(135deg, #ff6b6b, #feca57);
        color: white;
        padding: 6px 12px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        display: flex;
        align-items: center;
        gap: 6px;
        z-index: 5;
        animation: viralPulse 2s ease-in-out infinite;
    }
    
    @keyframes viralPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .viral-ranking {
        font-weight: 800;
        font-size: 0.8rem;
    }
    
    .viral-fire {
        font-size: 0.9rem;
        animation: fireFlicker 1.5s ease-in-out infinite;
    }
    
    @keyframes fireFlicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    
    .viral-stats {
        font-size: 0.7rem;
        opacity: 0.9;
    }
    
    /* Rankings especiales */
    .viral-ranking-1 {
        border: 2px solid #ffd700;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    }
    
    .viral-ranking-1 .viral-indicator {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #333;
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    }
    
    .viral-ranking-2 {
        border: 2px solid #c0c0c0;
        box-shadow: 0 0 15px rgba(192, 192, 192, 0.3);
    }
    
    .viral-ranking-2 .viral-indicator {
        background: linear-gradient(135deg, #c0c0c0, #e6e6e6);
        color: #333;
    }
    
    .viral-ranking-3 {
        border: 2px solid #cd7f32;
        box-shadow: 0 0 15px rgba(205, 127, 50, 0.3);
    }
    
    .viral-ranking-3 .viral-indicator {
        background: linear-gradient(135deg, #cd7f32, #deb887);
        color: white;
    }
    
    /* Responsive para indicador viral */
    @media (max-width: 768px) {
        .viral-indicator {
            position: static;
            margin-bottom: 10px;
            border-radius: 8px;
            justify-content: center;
        }
        
        .viral-post {
            overflow: visible;
        }
    }

        /* SVG de likes en posts virales */
    .viral-post .post-stat svg.like-icon {
        stroke: #8d81eb;
        fill: none;
        transition: all 0.3s ease;
    }
    
    /* Cuando está liked: relleno rojo */
    .viral-post .post-stat.liked svg.like-icon {
        stroke: var(--error);
        fill: var(--error);
    }
    
    /* Contador violeta */
    .viral-post .post-stat .like-count,
    .viral-post .post-stat .comment-count {
        color: #8d81eb;
        font-weight: 600;
    }
    
    /* SVG de comentarios violeta */
    .viral-post .post-stat svg {
        stroke: #8d81eb;
        transition: all 0.3s ease;
    }
    
    /* Hover */
    .viral-post .post-stat:hover svg {
        stroke: #a89ef5;
        transform: scale(1.1);
    }
    
    /* Animación de like */
    @keyframes heartBeat {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    .viral-post .post-stat.liked svg.like-icon {
        animation: heartBeat 0.3s ease;
    }
    
    /* Botón "Ver" en virales */
    .viral-post .post-stat-view-likes {
        background: rgba(141, 129, 235, 0.15);
        color: #8d81eb;
        border: none;
        padding: 0.5rem 0.rem;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-right: -0.5rem;
    }
    
    .viral-post .post-stat-view-likes:hover {
        background: rgba(141, 129, 235, 0.25);
        transform: scale(1.05);
    }
        
`;

// Insertar los estilos
document.head.appendChild(viralPostsStyles);

// ============================================
// FUNCIONES DE LOADING Y ESTADOS
// ============================================

function showViralLoadingSpinner() {
    let spinner = document.getElementById('viralLoadingSpinner');
    
    if (!spinner) {
        // Crear spinner si no existe
        const feedContainer = document.getElementById('viralPosts') || document.getElementById('feedPosts');
        if (!feedContainer) return;
        
        spinner = document.createElement('div');
        spinner.id = 'viralLoadingSpinner';
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="width: 40px; height: 40px; border: 4px solid rgba(99, 102, 241, 0.3); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Cargando posts virales...</p>
            </div>
        `;
        feedContainer.appendChild(spinner);
    }
    
    spinner.style.display = 'block';
}

function hideViralLoadingSpinner() {
    const spinner = document.getElementById('viralLoadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function showViralErrorState() {
    const feedContainer = document.getElementById('viralPosts') || document.getElementById('feedPosts');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
            <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
            <h3>Error al cargar posts virales</h3>
            <p>No pudimos cargar el contenido viral. Intenta recargar la página.</p>
            <button onclick="loadViralPosts()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                Reintentar
            </button>
        </div>
    `;
}

function showViralEmptyState() {
    const feedContainer = document.getElementById('viralPosts') || document.getElementById('feedPosts');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🔥</div>
            <h3>No hay posts virales en este momento</h3>
            <p>Parece que no hay contenido viral disponible en este período.</p>
            <button onclick="filterViralsByPeriod('30d')" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                Ver últimos 30 días
            </button>
        </div>
    `;
}

// ============================================
// INTEGRACIÓN CON SISTEMA DE MODAL DE LIKES
// ============================================

function updateViralPostLikeButton(postElement, liked, likeCount, postId) {
    const likeButton = postElement.querySelector('.post-stat[data-like-count]');
    if (!likeButton) return;
    
    // ✅ ACTUALIZAR CON SVG
    likeButton.innerHTML = `
        <svg class="like-icon" width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span class="like-count">${likeCount}</span>
    `;
    
    // ✅ GESTIONAR BOTÓN "VER" DINÁMICAMENTE
    const statsContainer = likeButton.closest('.post-stats');
    let viewButton = statsContainer ? statsContainer.querySelector('.view-likes-btn') : null;
    
    if (likeCount > 0) {
        if (!viewButton) {
            // Crear botón "Ver" si no existe
            viewButton = document.createElement('button');
            viewButton.className = 'view-likes-btn';
            viewButton.onclick = (e) => {
                e.stopPropagation();
                openLikesModal('post', postId, e);
            };
            viewButton.title = 'Ver quién dio like';
            viewButton.textContent = 'Ver';
            
            // Insertar ANTES del botón de likes
            if (statsContainer) {
                statsContainer.insertBefore(viewButton, likeButton);
            }
        }
    } else {
        // Eliminar botón "Ver" si ya no hay likes
        if (viewButton) {
            viewButton.remove();
        }
    }
    
    // Actualizar clases y atributo
    likeButton.classList.toggle('liked', liked);
    likeButton.setAttribute('data-like-count', likeCount);
}

// Hacer función global
window.updateViralPostLikeButton = updateViralPostLikeButton;

console.log('✅ Integración con modal de likes para posts virales cargada');

// ============================================
// EXPONER FUNCIONES GLOBALMENTE
// ============================================

// Hacer funciones globales
window.loadViralPosts = loadViralPosts;
window.renderViralPosts = renderViralPosts;
window.filterViralsByPeriod = filterViralsByPeriod;
window.showViralLoadingSpinner = showViralLoadingSpinner;
window.hideViralLoadingSpinner = hideViralLoadingSpinner;
window.showViralErrorState = showViralErrorState;
window.showViralEmptyState = showViralEmptyState;

console.log('✅ Sistema de posts virales cargado correctamente');