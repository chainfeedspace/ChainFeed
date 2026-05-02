// ============================================
// CARGAR SESIÓN AL INICIAR
// ============================================

(async function() {
    try {
        const response = await fetch('php/verificar_sesion.php');
        const data = await response.json();
        
        if (data.success && data.user) {
            window.CHAINFEED_CONFIG = {
                currentUser: {
                    id: data.user.id,
                    username: data.user.username,
                    display_name: data.user.display_name,
                    avatar_url: data.user.avatar_url,
                    wallet_address: data.user.wallet_address,
                    verified: data.user.verified,
                    token_balance: data.user.token_balance
                }
            };
            
            console.log('✅ Sesión cargada:', window.CHAINFEED_CONFIG.currentUser);
        } else {
            console.error('❌ No hay sesión activa');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error cargando sesión:', error);
    }
})();


// ============================================
// SISTEMA DE CARGA DE POSTS REALES DESDE BD
// ============================================

// ✅ EXPORTAR GLOBALMENTE
window.FeedState = {
    posts: [],
    currentOffset: 0,
    limit: 20,
    isLoading: false,
    hasMore: true,
    totalPosts: 0
};

// ✅ ALIAS LOCAL (mantener compatibilidad)
const FeedState = window.FeedState;

// ============================================
// FUNCIONES DE CARGA DE POSTS
// ============================================

async function cleanExpiredPromotions() {
    try {
        const response = await fetch('/php/limpiar_promociones_expiradas.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({})  // ⬅️ ESTO FALTABA
        });
        
        if (!response.ok) {
            console.warn('⚠️ Error en limpieza de promociones');
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            if (data.promociones_finalizadas > 0) {
                console.log(`🧹 ${data.promociones_finalizadas} promociones expiradas limpiadas`);  // ⬅️ También corregí esto (tenía ` mal)
            }
        }
    } catch (error) {
        console.error('Error limpiando promociones:', error);
    }
}

/**
 * Cargar posts del feed principal desde la BD
 */
async function loadFeedPosts(append = false) {

        if (!append) {
        await cleanExpiredPromotions();
    }
    
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
                tipo: null // Todos los tipos de posts
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar posts');
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

        console.log(`✅ Feed cargado: ${data.publicaciones.length} posts`);

    } catch (error) {
        console.error('Error cargando feed:', error);
        showNotification(`❌ Error al cargar posts: ${error.message}`, 'error');
        showErrorState();
    } finally {
        FeedState.isLoading = false;
        hideLoadingSpinner();
    }
}
/**
 * Cargar posts solo de usuarios seguidos
 */
async function loadFeedSeguidos(append = false) {
    // Limpiar promociones expiradas solo en la primera carga
    if (!append) {
        await cleanExpiredPromotions();
    }
    
    if (FeedState.isLoading) return;
    
    try {
        FeedState.isLoading = true;
        showLoadingSpinner();

        console.log('📡 Cargando feed de seguidos...');

        const response = await fetch('../php/obtener_feed_inicio.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                limit: FeedState.limit,
                offset: append ? FeedState.currentOffset : 0,
                tipo: null,
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

        // Si no hay posts, mostrar mensaje personalizado
        if (data.publicaciones.length === 0 && !append) {
            showEmptySeguidosState();
        }

    } catch (error) {
        console.error('❌ Error cargando feed de seguidos:', error);
        showNotification(`Error al cargar posts de seguidos: ${error.message}`, 'error');
        showErrorSeguidosState();
    } finally {
        FeedState.isLoading = false;
        hideLoadingSpinner();
    }
}

async function loadFeedColeccion(append = false) {
    // Limpiar promociones expiradas solo en la primera carga
    if (!append) {
        await cleanExpiredPromotions();
    }
    
    if (FeedState.isLoading) return;
    
    try {
        FeedState.isLoading = true;
        
        // ✅ LIMPIAR EL DOM INMEDIATAMENTE
        const feedContainer = document.getElementById('feedPosts');
        if (feedContainer && !append) {
            feedContainer.innerHTML = '';
        }
        
        showLoadingSpinner();

        console.log('📡 Cargando colecciones de todos los usuarios...');

        // ✅ NUEVO ENDPOINT
        const response = await fetch('../php/coleccion_inicio.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                limit: FeedState.limit,
                offset: append ? FeedState.currentOffset : 0,
                tipo: null // Opcional: filtro por tipo de contenido
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cargar colecciones');
        }

        if (!data.success) {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }

        // Actualizar estado del feed
        if (append) {
            FeedState.posts = [...FeedState.posts, ...data.posts];
        } else {
            FeedState.posts = data.posts;
            FeedState.currentOffset = 0;
        }

        // Actualizar información de paginación
        FeedState.totalPosts = data.total;
        FeedState.hasMore = data.has_more;
        FeedState.currentOffset = data.pagination.next_offset || FeedState.currentOffset;

        // Renderizar posts
        renderFeedPosts(append);

        // Configurar scroll infinito
        if (!append) {
            setupInfiniteScroll();
        }

        console.log(`✅ Colecciones cargadas: ${data.posts.length} posts de ${data.total} totales`);

        // Si no hay posts, mostrar mensaje personalizado
        if (data.posts.length === 0 && !append) {
            showEmptyColeccionState();
        }

    } catch (error) {
        console.error('❌ Error cargando colecciones:', error);
        showNotification(`Error al cargar colecciones: ${error.message}`, 'error');
        showErrorColeccionState();
    } finally {
        FeedState.isLoading = false;
        hideLoadingSpinner();
    }
}

/**
 * Mostrar estado vacío para feed de colección
 */
function showEmptyColeccionState() {
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer && FeedState.posts.length === 0) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary); background: rgba(26, 26, 36, 0.5); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 2rem auto; max-width: 600px;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎨</div>
                <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">Tu colección está vacía</h3>
                <p style="margin-bottom: 2rem; line-height: 1.6;">
                    Aún no has comprado ningún post. Explora el Market para adquirir contenido exclusivo.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="showMarket()" 
                            style="padding: 0.8rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                        Ir al Market
                    </button>
                    <button onclick="filterPosts('todos')" 
                            style="padding: 0.8rem 1.5rem; background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                        Ver todos los posts
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Mostrar estado de error para feed de colección
 */
function showErrorColeccionState() {
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary); background: rgba(26, 26, 36, 0.5); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 2rem auto; max-width: 600px;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Error al cargar colección</h3>
                <p style="margin-bottom: 2rem;">No pudimos cargar tu colección. Intenta nuevamente.</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="loadFeedColeccion(false)" 
                            style="padding: 0.8rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                        Reintentar
                    </button>
                    <button onclick="filterPosts('todos')" 
                            style="padding: 0.8rem 1.5rem; background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Ver todos los posts
                    </button>
                </div>
            </div>
        `;
    }
}

// ✅ EXPORTAR FUNCIÓN GLOBALMENTE
window.loadFeedColeccion = loadFeedColeccion;

console.log('✅ Sistema de feed de colección cargado correctamente');

/**
 * Mostrar estado vacío para feed de seguidos
 */
function showEmptySeguidosState() {
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
                    <button onclick="window.location.href='/busqueda'" 
                            style="padding: 0.8rem 1.5rem; background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                        Buscar usuarios
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Mostrar estado de error para feed de seguidos
 */
function showErrorSeguidosState() {
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary); background: rgba(26, 26, 36, 0.5); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); margin: 2rem auto; max-width: 600px;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Error al cargar posts de seguidos</h3>
                <p style="margin-bottom: 2rem;">No pudimos cargar el feed. Intenta nuevamente.</p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="loadFeedSeguidos(false)" 
                            style="padding: 0.8rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                        Reintentar
                    </button>
                    <button onclick="filterPosts('todos')" 
                            style="padding: 0.8rem 1.5rem; background: rgba(99, 102, 241, 0.1); color: var(--primary); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Ver todos los posts
                    </button>
                </div>
            </div>
        `;
    }
}

// ✅ EXPORTAR FUNCIÓN GLOBALMENTE
window.loadFeedSeguidos = loadFeedSeguidos;

console.log('✅ Sistema de feed de seguidos cargado correctamente');
/**
 * Renderizar posts en el DOM
 */
function renderFeedPosts(append = false) {
    const feedContainer = document.getElementById('feedPosts');
    if (!feedContainer) return;

    if (!append) {
        feedContainer.innerHTML = '';
    }

    FeedState.posts.forEach((post, index) => {
        if (append && document.querySelector(`[data-post-id="post-${post.id}"]`)) {
            return;
        }

        const postElement = createRealPostElement(post);
        feedContainer.appendChild(postElement);

        setTimeout(() => {
            postElement.style.animation = 'cardAppear 0.5s ease forwards';
        }, index * 100);
    });

    setTimeout(() => {
        initializeViewLikesButtons();
    }, 100);

    if (FeedState.posts.length === 0) {
        showEmptyFeedState();
    }

    // ✅ AGREGAR ESTA LÍNEA AL FINAL
    setTimeout(() => {
        if (typeof window.actualizarAnillosFlashesEnPosts === 'function') {
            window.actualizarAnillosFlashesEnPosts();
        }
    }, 200);
}

/**
 * Generar contador de flashes para el avatar
 */
function generateFlashCounter(flashInfo) {
    if (!flashInfo || !flashInfo.flash_status || flashInfo.flash_status === 'no-flash') {
        return '';
    }
    
    const totalUnseen = (flashInfo.permanentes_sin_ver || 0) + (flashInfo.normales_sin_ver || 0);
    
    if (totalUnseen === 0) {
        return '';
    }
    
    return `
        <div class="post-flash-counter">
            ${totalUnseen}
        </div>
    `;
}

/**
 * Crear elemento DOM para un post real - VERSIÓN CON BADGE AL LADO DEL MENÚ
 */
function createRealPostElement(post) {
    const div = document.createElement('div');
    div.className = 'post-card';
    
div.dataset.postId = `post-${post.id}`;
div.style.opacity = '0';
div.style.position = 'relative';

// ✅ AGREGAR DATA-ATTRIBUTE DE PRIVACIDAD
if (post.es_publica === false || post.es_publica === 0) {
    div.setAttribute('data-is-private', 'true');
}
    
    // Agregar clase para controlar visibilidad del volumen
    if (post.silenciado) {
        div.classList.add('post-silenciado');
    }
    
    // Verificar si el post está oculto
    const hiddenPosts = JSON.parse(localStorage.getItem('chainfeed_hidden_posts') || '[]');
    if (hiddenPosts.includes(`post-${post.id}`)) {
        div.style.display = 'none';
        return div;
    }
    
    // Verificar propiedad del post
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
    
   // Formatear tiempo - PRIORIZAR BACKEND
const timeAgo = (() => {
    try {
        // ✅ PRIORIDAD 1: Usar el tiempo que PHP ya calculó
        if (post.tiempo_relativo) {
            return post.tiempo_relativo;
        }
        
        // ✅ PRIORIDAD 2: Usar formatTimeAgo de JavaScript
        if (typeof window.formatTimeAgo === 'function') {
            return window.formatTimeAgo(new Date(post.created_at));
        }
        
        // ✅ PRIORIDAD 3: Fallback básico
        console.warn('⚠️ formatTimeAgo no disponible, usando fallback');
        const date = new Date(post.created_at);
        const now = new Date();
        const diff = now - date;
        
        // Manejar fechas futuras
        if (diff < 0) {
            console.warn('⚠️ Post con fecha futura:', post.created_at);
            return 'Ahora';
        }
        
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' });
        
    } catch (error) {
        console.error('❌ Error formateando tiempo:', error);
        return 'Ahora';
    }
})();
    
    // Generar ID único para el menú
    const postId = `post-${post.id}`;
    
    // ✅ GENERAR OPCIONES DE MENÚ (SIN CANCELAR PROMOCIÓN)
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
<button class="post-dropdown-item" onclick="togglePostPrivacy('${postId}', ${!post.es_publica})">
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
        // Menú para NO propietario
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
    
div.innerHTML = `
    ${post.is_repost && post.repost_info ? `
        <div class="repost-header" style="
            padding: 0.5rem 1rem;
            color: var(--success);
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            background: transparent;
            margin-bottom: 1rem;
        ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            <span onclick="goToUserProfile('${post.repost_info.username}')" style="cursor: pointer; font-weight: 600;">
                @${escapeHtml(post.repost_info.username)}
            </span>
            <span>reposteó • ${post.repost_info.tiempo_relativo}</span>
        </div>
    ` : ''}
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
        ${(post.es_publica === false || post.es_publica === 0) ? `
            <span class="post-privacy-badge" style="
                background: rgba(139, 92, 246, 0.2);
                color: #a78bfa;
                padding: 0.25rem 0.5rem;
                border-radius: 6px;
                font-size: 0.75rem;
                font-weight: 600;
                margin-left: 0.5rem;
                display: inline-block;
            ">🔒</span>
        ` : ''}
    </div>
    <div class="post-meta">
    @${escapeHtml(post.username)} • ${timeAgo}
${post.vendedor_original_id && parseInt(post.vendedor_original_id) !== parseInt(post.usuario_id) ? `
    <span class="collection-badge" 
          onclick="event.stopPropagation(); openTransactionsModal(${post.id});" 
          title="Ver historial de transacciones"
          style="
        background: rgba(251, 191, 36, 0.2);
        color: #fbbf24;
        padding: 0.2rem 0.5rem;
        border-radius: 6px;
        font-size: 0.7rem;
        font-weight: 700;
        margin-left: 0.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
    " 
    onmouseover="this.style.background='rgba(251, 191, 36, 0.35)'; this.style.transform='scale(1.05)';" 
    onmouseout="this.style.background='rgba(251, 191, 36, 0.2)'; this.style.transform='scale(1)';">
        🎨
    </span>
` : ''}
</div>

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
                <button class="post-menu-btn" onclick="event.stopPropagation(); togglePostMenu('${postId}', this)" 
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
    ${post.stats.likes_count > 0 ? `
        <button class="post-stat-view-likes" onclick="openLikesModal('publicacion', ${post.id}, event)" title="Ver quién dio like">
            Ver
        </button>
    ` : ''}
<button class="post-stat ${post.user_interactions.liked ? 'liked' : ''}" onclick="toggleRealPostLike(this, ${post.id})">
    <svg class="like-icon" width="16" height="16" viewBox="0 0 24 24" fill="${post.user_interactions.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span class="like-count">${post.stats.likes_count}</span>
</button>
<button class="post-stat" onclick="openComments(this)" data-comments-count="${post.stats.comentarios_count}">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span class="comment-count">${post.stats.comentarios_count}</span>
</button>
            <button class="post-stat ${post.user_interactions.reposted ? 'reposted' : ''}" onclick="toggleRealRepost(this, ${post.id})" data-repost-count="${post.stats.reposts_count}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                </svg>
                ${post.stats.reposts_count}
            </button>
            <button class="post-stat" onclick="openShareModal(this)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                </svg>
                ${post.stats.shares_count || 0}
            </button>
            ${(post.tipo === 'video' && post.silenciado !== true && post.silenciado !== 'true' && !post.silenciado) ? `
                <button class="post-stat volume-control" onclick="togglePostVolume(this, ${post.id})" title="Controlar volumen">
                    <svg class="volume-icon volume-on" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: none;>
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
 * Renderizar media del post con control de volumen mejorado
 */
function renderPostMediaWithVolumeControl(post) {
    if (!post.media_url) return '';
    
    const mediaType = post.tipo;
    
    switch (mediaType) {
        case 'imagen':
            return `<img src="${post.media_url}" alt="Imagen del post" loading="lazy">`;
            
        case 'video':
            // TODOS los videos ahora usan controles personalizados
            const isSilenced = post.silenciado;
            const videoAttributes = isSilenced ? 'muted' : '';
            
            return `
                <div class="video-container-custom ${isSilenced ? 'silenced' : 'with-sound'}">
                    <video 
                        src="${post.media_url}" 
                        ${videoAttributes}
                        preload="metadata"
                        data-post-id="${post.id}"
                        data-silenciado="${post.silenciado}"
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
            `;
            
        case 'gif':
            return `<img src="${post.media_url}" alt="GIF" loading="lazy">`;
            
        default:
            return `<img src="${post.media_url}" alt="Media" loading="lazy">`;
    }
}
/**
 * Toggle del volumen para posts de video
 */
function togglePostVolume(buttonElement, postId) {
    try {
        // Encontrar el video asociado
        const postElement = buttonElement.closest('.post-card');
        const videoElement = postElement.querySelector('video');
        
        if (!videoElement) {
            console.warn('No se encontró elemento de video para el post', postId);
            return;
        }

        // Toggle mute/unmute
        videoElement.muted = !videoElement.muted;
        
        // Actualizar íconos
        const volumeOnIcon = buttonElement.querySelector('.volume-on');
        const volumeOffIcon = buttonElement.querySelector('.volume-off');
        
        if (videoElement.muted) {
            volumeOnIcon.style.display = 'none';
            volumeOffIcon.style.display = 'block';
            buttonElement.title = 'Activar sonido';
        } else {
            volumeOnIcon.style.display = 'block';
            volumeOffIcon.style.display = 'none';
            buttonElement.title = 'Silenciar';
        }

        // Efecto visual
        buttonElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            buttonElement.style.transform = 'scale(1)';
        }, 150);

        console.log(`Video ${postId} ${videoElement.muted ? 'silenciado' : 'con sonido'}`);

    } catch (error) {
        console.error('Error al controlar volumen:', error);
        showNotification('Error al controlar el volumen', 'error');
    }
}

function toggleVideoPlay(buttonElement) {
    const videoContainer = buttonElement.closest('.video-container-custom');
    const video = videoContainer.querySelector('video');
    const playIcon = buttonElement.querySelector('.play-icon');
    const pauseIcon = buttonElement.querySelector('.pause-icon');
    
    if (video.paused) {
        video.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        video.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
    
    // Resetear auto-hide
    resetAutoHide(videoContainer);
}

function seekVideo(event, progressContainer) {
    const videoContainer = progressContainer.closest('.video-container-custom');
    const video = videoContainer.querySelector('video');
    const rect = progressContainer.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
    
    // Resetear auto-hide
    resetAutoHide(videoContainer);
}

function toggleVideoVolume(buttonElement) {
    const videoContainer = buttonElement.closest('.video-container-custom');
    const video = videoContainer.querySelector('video');
    const volumeOnIcon = buttonElement.querySelector('.volume-on');
    const volumeOffIcon = buttonElement.querySelector('.volume-off');
    
    video.muted = !video.muted;
    
    if (video.muted) {
        volumeOnIcon.style.display = 'none';
        volumeOffIcon.style.display = 'block';
        buttonElement.title = 'Activar sonido';
    } else {
        volumeOnIcon.style.display = 'block';
        volumeOffIcon.style.display = 'none';
        buttonElement.title = 'Silenciar';
    }
    
    buttonElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        buttonElement.style.transform = 'scale(1)';
    }, 150);
    
    // Resetear auto-hide
    resetAutoHide(videoContainer);
}

function toggleVideoFullscreen(buttonElement) {
    const videoContainer = buttonElement.closest('.video-container-custom');
    
    if (!document.fullscreenElement) {
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}
/**
 * Manejar eventos de fullscreen para videos silenciados
 */
function handleFullscreenChange() {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    
    if (fullscreenElement && fullscreenElement.classList.contains('video-container-custom')) {
        // Estamos en fullscreen con un video personalizado
        fullscreenElement.classList.add('fullscreen-active');
        
        // Inicializar barra de progreso
        initializeProgressBar(fullscreenElement);
    } else {
        // Salimos de fullscreen
        const videoContainers = document.querySelectorAll('.video-container-custom');
        videoContainers.forEach(container => {
            container.classList.remove('fullscreen-active');
        });
    }
}

/**
 * Inicializar y actualizar barra de progreso
 */
function initializeProgressBar(videoContainer) {
    const video = videoContainer.querySelector('video');
    const progressFilled = videoContainer.querySelector('.progress-filled');
    
    if (!video || !progressFilled) return;
    
    // Actualizar progreso durante la reproducción
    const updateProgress = () => {
        if (video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = progress + '%';
        }
    };
    
    // Event listeners para actualizar el progreso
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);
    
    // Limpiar listeners cuando salga de fullscreen
    const cleanupListeners = () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('loadedmetadata', updateProgress);
        document.removeEventListener('fullscreenchange', cleanupListeners);
        document.removeEventListener('webkitfullscreenchange', cleanupListeners);
        document.removeEventListener('msfullscreenchange', cleanupListeners);
    };
    
    document.addEventListener('fullscreenchange', cleanupListeners);
    document.addEventListener('webkitfullscreenchange', cleanupListeners);
    document.addEventListener('msfullscreenchange', cleanupListeners);
}
// Event listeners para cambios de fullscreen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

/**
 * Manejar clicks en el video para mostrar/ocultar controles
 */
/**
 * Manejar clicks en el video para mostrar/ocultar controles - VERSIÓN CORREGIDA
 */
function setupVideoControlsToggle() {
    // Event delegation para manejar clicks
    document.addEventListener('click', function(e) {
        const videoContainer = e.target.closest('.video-container-custom');
        if (!videoContainer) return;
        
        // Si se hizo click en un botón de control, permitir que funcione normalmente
        if (e.target.closest('.custom-video-controls')) {
            // NO prevenir ni detener - dejar que el evento del botón funcione
            return;
        }
        
        // Si se hizo click en el video o contenedor, toggle controles
        toggleVideoControls(videoContainer);
    });
}
/**
 * Toggle de controles de video
 */
/**
 * Toggle de controles de video - VERSIÓN SIMPLIFICADA
 */
function toggleVideoControls(videoContainer) {
    const hasControls = videoContainer.classList.contains('controls-visible');
    
    // Limpiar timeout existente
    if (videoContainer.hideTimeout) {
        clearTimeout(videoContainer.hideTimeout);
        videoContainer.hideTimeout = null;
    }
    
    // Ocultar controles de otros videos
    document.querySelectorAll('.video-container-custom.controls-visible').forEach(container => {
        if (container !== videoContainer) {
            if (container.hideTimeout) {
                clearTimeout(container.hideTimeout);
            }
            container.classList.remove('controls-visible');
        }
    });
    
    // Toggle de este video
    if (hasControls) {
        videoContainer.classList.remove('controls-visible');
    } else {
        videoContainer.classList.add('controls-visible');
        autoHideVideoControls(videoContainer);
    }
}

/**
 * Auto-ocultar controles después de inactividad
 */
function autoHideVideoControls(videoContainer) {
    if (videoContainer.hideTimeout) {
        clearTimeout(videoContainer.hideTimeout);
    }
    
    videoContainer.hideTimeout = setTimeout(() => {
        videoContainer.classList.remove('controls-visible');
    }, 4000);
}

/**
 * Resetear el auto-hide cuando se interactúa con los controles
 */
function resetAutoHide(videoContainer) {
    if (videoContainer.hideTimeout) {
        clearTimeout(videoContainer.hideTimeout);
    }
    if (videoContainer.classList.contains('controls-visible')) {
        autoHideVideoControls(videoContainer);
    }
}

window.addEventListener('beforeunload', function() {
    document.querySelectorAll('.video-container-custom').forEach(container => {
        if (container.hideTimeout) {
            clearTimeout(container.hideTimeout);
            container.hideTimeout = null;
        }
        container.classList.remove('controls-visible');
    });
});
// Inicializar el sistema de toggle de controles
setupVideoControlsToggle();
// ============================================
// ESTILOS CSS PARA EL CONTROL DE VOLUMEN
// ============================================

// Agregar estilos CSS adicionales
const volumeControlStyles = document.createElement('style');
volumeControlStyles.textContent = `
    /* Ocultar controles de volumen en posts silenciados */
    .post-silenciado .volume-control {
        display: none !important;
    }
    
    /* Estilos para el botón de volumen */
    .volume-control {
        position: relative;
        transition: all 0.2s ease;
    }
    
    .volume-control:hover {
        color: var(--primary);
        transform: scale(1.05);
    }
    
    .volume-control.muted {
        color: var(--danger, #ef4444);
    }
    
    /* Animaciones de íconos de volumen */
    .volume-icon {
        transition: all 0.2s ease;
    }
    
    /* Indicador visual para videos silenciados */
    .post-silenciado .post-media video {
        position: relative;
    }
    
    .post-silenciado .post-media video::after {
        content: "🔇";
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 14px;
        pointer-events: none;
    }
    
    /* Tooltip mejorado para control de volumen */
    .volume-control[title]:hover::before {
        content: attr(title);
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
    }
`;
// Agregar al volumeControlStyles.textContent existente:
const customVideoControlsCSS = `
    /* Contenedor para todos los videos personalizados */
    .video-container-custom {
        position: relative;
        display: inline-block;
        width: 100%;
        cursor: pointer;
    }
    
    .video-container-custom video {
        width: 100%;
         height: auto;
    max-width: 100%;
    height: 67vh;
    object-fit: cover;
    display: block;
    }
    
    /* Controles personalizados - OCULTOS POR DEFECTO */
    .custom-video-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        padding: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        transform: translateY(10px);
    }
    
    /* MOSTRAR controles cuando se active la clase */
    .video-container-custom.controls-visible .custom-video-controls {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .play-pause-btn, .fullscreen-btn, .volume-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .play-pause-btn:hover, .fullscreen-btn:hover, .volume-btn:hover {
        background: rgba(255,255,255,0.3);
        transform: scale(1.05);
    }
    
    .progress-container {
        flex: 1;
        height: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    
    .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,0.3);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .progress-filled {
        height: 100%;
        background: var(--primary, #6366f1);
        width: 0%;
        transition: width 0.1s ease;
    }
    
    /* Indicador de silenciado - SIEMPRE VISIBLE */
    .silenced-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 14px;
        pointer-events: none;
    }
    
    /* Estilos para fullscreen */
    .video-container-custom.fullscreen-active {
        width: 100vw !important;
        height: 100vh !important;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .video-container-custom.fullscreen-active video {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
    }
    
    /* Controles en fullscreen */
    .video-container-custom.fullscreen-active .custom-video-controls {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
    }
    
    .video-container-custom.fullscreen-active .play-pause-btn,
    .video-container-custom.fullscreen-active .fullscreen-btn,
    .video-container-custom.fullscreen-active .volume-btn {
        padding: 12px;
        background: rgba(255,255,255,0.15);
    }
    
    .video-container-custom.fullscreen-active .play-pause-btn svg,
    .video-container-custom.fullscreen-active .fullscreen-btn svg,
    .video-container-custom.fullscreen-active .volume-btn svg {
        width: 24px;
        height: 24px;
    }
    
    .video-container-custom.fullscreen-active .progress-bar {
        height: 6px;
    }
    
    /* Indicador de silenciado en fullscreen */
    .video-container-custom.fullscreen-active .silenced-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        font-size: 18px;
        padding: 8px 12px;
    }
    
    /* En fullscreen, los controles se muestran/ocultan igual */
    .video-container-custom.fullscreen-active .custom-video-controls {
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.3s ease;
    }
    
    .video-container-custom.fullscreen-active.controls-visible .custom-video-controls {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
`;
// Agrega esto al final del customVideoControlsCSS existente:
const fullscreenVideoCSS = `
    /* Estilos para fullscreen */
    .video-container-silenced.fullscreen-active {
        width: 100vw !important;
        height: 100vh !important;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .video-container-silenced.fullscreen-active video {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
    }
    
    /* Controles en fullscreen - más grandes y visibles */
    .video-container-silenced.fullscreen-active .custom-video-controls {
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
    }
    
    .video-container-silenced.fullscreen-active .play-pause-btn,
    .video-container-silenced.fullscreen-active .fullscreen-btn {
        padding: 12px;
        background: rgba(255,255,255,0.15);
    }
    
    .video-container-silenced.fullscreen-active .play-pause-btn svg,
    .video-container-silenced.fullscreen-active .fullscreen-btn svg {
        width: 24px;
        height: 24px;
    }
    
    .video-container-silenced.fullscreen-active .progress-bar {
        height: 6px;
    }
    
    /* Indicador de silenciado en fullscreen */
    .video-container-silenced.fullscreen-active .silenced-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        font-size: 18px;
        padding: 8px 12px;
    }
    
    /* Cambiar icono de fullscreen cuando está activo */
    .video-container-silenced.fullscreen-active .fullscreen-btn svg {
        transform: rotate(45deg);
    }
    
    /* Auto-ocultar controles en fullscreen después de inactividad */
    .video-container-silenced.fullscreen-active.controls-hidden .custom-video-controls {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .video-container-silenced.fullscreen-active.controls-hidden .silenced-indicator {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    /* Mostrar controles al mover el mouse */
    .video-container-silenced.fullscreen-active:hover .custom-video-controls,
    .video-container-silenced.fullscreen-active:hover .silenced-indicator {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
`;

// Agregar los estilos de fullscreen
volumeControlStyles.textContent += customVideoControlsCSS + fullscreenVideoCSS;

volumeControlStyles.textContent += customVideoControlsCSS;
// Insertar los estilos al head
document.head.appendChild(volumeControlStyles);

// ============================================
// ACTUALIZAR ESTILOS EXISTENTES
// ============================================

// Actualizar los estilos existentes para incluir los nuevos
const existingFeedStyles = document.querySelector('style');
if (existingFeedStyles) {
    existingFeedStyles.textContent += volumeControlStyles.textContent;
} else {
    document.head.appendChild(volumeControlStyles);
}

/**
 * Renderizar media del post
 */
function renderPostMedia(post) {
    if (!post.media_url) return '';
    
    const mediaType = post.tipo;
    
    switch (mediaType) {
        case 'imagen':
            return `<img src="${post.media_url}" alt="Imagen del post" loading="lazy">`;
        case 'video':
            return `<video src="${post.media_url}" controls preload="metadata">Tu navegador no soporta video.</video>`;
        case 'gif':
            return `<img src="${post.media_url}" alt="GIF" loading="lazy">`;
        default:
            return `<img src="${post.media_url}" alt="Media" loading="lazy">`;
    }
}

/**
 * Procesar contenido del post (hashtags, menciones, enlaces)
 */
function processPostContent(content) {
    let processed = escapeHtml(content);
    
    // Procesar hashtags
    processed = processed.replace(/#(\w+)/g, '<span class="hashtag" onclick="searchTrend(\'$1\')">#$1</span>');
    
    // Procesar menciones
    processed = processed.replace(/@(\w+)/g, '<span class="mention" onclick="goToUserProfile(\'$1\')">@$1</span>');
    
    // Procesar enlaces (básico)
    processed = processed.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    
    return processed;
}

// CORRECCIÓN PARA LIKES DE POSTS 
// ============================================

async function toggleRealPostLike(element, postId) {
    try {
        element.classList.add('action-feedback');
        
        const isCurrentlyLiked = element.classList.contains('liked');
        const action = isCurrentlyLiked ? 'unlike' : 'like';
        
        console.log('Enviando like de post:', {
            tipo: 'publicacion',
            id: postId,
            action: action
        });

        const response = await fetch('php/manejar_likes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                tipo: 'publicacion',
                id: postId,
                action: action
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            
            if (response.status === 400) {
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.message === "No puedes dar like a tu propia publicación") {
                        showNotification('No puedes dar like a tu propia publicación', 'error');
                        return;
                    } else if (errorData.message === "Ya has dado like a esta publicación") {
                        showNotification('Ya le diste like a esta publicación', 'error');
                        return;
                    } else {
                        showNotification(errorData.message || 'Error al procesar like', 'error');
                        return;
                    }
                } catch (parseError) {
                    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
                }
            } else {
                throw new Error(`Error HTTP ${response.status}: ${errorText}`);
            }
        }

        const data = await response.json();
        console.log('Respuesta exitosa:', data);

        if (!data.success) {
            throw new Error(data.message || 'Error al procesar like');
        }

// ✅ ACTUALIZAR UI CON SVG
const isLiked = data.liked;
const newCount = data.new_like_count;

// ✅ Actualizar clase liked SOLO para el botón
element.classList.toggle('liked', isLiked);

// ✅ Actualizar HTML con SVG
element.innerHTML = `
    <svg class="like-icon" width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span class="like-count">${newCount}</span>
`;

// ✅ CRÍTICO: Actualizar FeedState para que el viewer pueda leerlo
const postCard = element.closest('.post-card');
if (postCard && window.FeedState?.posts) {
    const postIdFull = postCard.dataset.postId;
    const postId = postIdFull ? parseInt(postIdFull.replace('post-', '')) : null;
    
    if (postId) {
        const postInState = window.FeedState.posts.find(p => p.id === postId);
        if (postInState) {
            postInState.stats.likes_count = newCount;
            postInState.user_interactions.liked = isLiked;
            console.log(`✅ FeedState actualizado: Post ${postId} ahora tiene ${newCount} likes`);
        }
    }
}
        
        // ✅ ACTUALIZAR O AGREGAR BOTÓN "VER" SI HAY LIKES
        const postStatsContainer = element.closest('.post-stats');
        let viewButton = postStatsContainer.querySelector('.post-stat-view-likes');
        
        if (newCount > 0) {
            if (!viewButton) {
                viewButton = document.createElement('button');
                viewButton.className = 'post-stat-view-likes';
                viewButton.onclick = (e) => openLikesModal('publicacion', postId, e);
                viewButton.title = 'Ver quién dio like';
                viewButton.textContent = 'Ver';
                postStatsContainer.insertBefore(viewButton, element);
            }
        } else {
            if (viewButton) {
                viewButton.remove();
            }
        }
        
        // Actualizar estado local si existe
        if (window.FeedState && window.FeedState.posts) {
            const post = FeedState.posts.find(p => p.id === postId);
            if (post) {
                post.user_interactions.liked = isLiked;
                post.stats.likes_count = newCount;
            }
        }
        
        // Efecto visual
        if (isLiked) {
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
            
            if (data.tokens_affected > 0) {
                showNotification(`❤️ Like agregado! El autor ganó ${data.tokens_affected} CFT`);
            }
        } else {
            showNotification(`💔 Like removido`);
        }

    } catch (error) {
        console.error('Error al dar like:', error);
        showNotification(`Error al procesar like: ${error.message}`, 'error');
    } finally {
        setTimeout(() => {
            element.classList.remove('action-feedback');
        }, 600);
    }
}

/**
 * Toggle repost en post real - VERSIÓN CORREGIDA
 */
async function toggleRealRepost(element, postId) {
    try {
        element.classList.add('action-feedback');
        
        // Determinar acción según estado actual
        const isCurrentlyReposted = element.classList.contains('reposted');
        const action = isCurrentlyReposted ? 'unrepost' : 'repost';
        
        console.log('Enviando repost:', {
            publicacion_id: postId,
            action: action
        });

        // Usar tu API de reposts
        const response = await fetch('php/manejar_reposts.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                publicacion_id: postId,
                action: action
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            
            // Manejar errores 400 específicos
            if (response.status === 400) {
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.message === "No puedes repostear tu propia publicación") {
                        showNotification('No puedes repostear tu propia publicación', 'error');
                        return;
                    } else if (errorData.message === "Ya has reposteado esta publicación") {
                        showNotification('Ya has reposteado esta publicación', 'error');
                        return;
                    } else if (errorData.message === "No has reposteado esta publicación") {
                        showNotification('No has reposteado esta publicación', 'error');
                        return;
                    } else {
                        showNotification(errorData.message || 'Error al procesar repost', 'error');
                        return;
                    }
                } catch (parseError) {
                    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
                }
            } else {
                throw new Error(`Error HTTP ${response.status}: ${errorText}`);
            }
        }

        const data = await response.json();
        console.log('Respuesta exitosa:', data);

        if (!data.success) {
            throw new Error(data.message || 'Error al procesar repost');
        }

        // Actualizar UI usando los nombres correctos de tu API
        const isReposted = data.reposted;
        const newCount = data.new_repost_count;
        
        element.classList.toggle('reposted', isReposted);
        element.dataset.repostCount = newCount;
        
        // Actualizar contenido del botón (mantener el SVG)
        const svg = element.querySelector('svg');
        element.innerHTML = '';
        if (svg) element.appendChild(svg);
        element.appendChild(document.createTextNode(` ${newCount}`));
        
        // Actualizar estado local si existe
        if (window.FeedState && window.FeedState.posts) {
            const post = FeedState.posts.find(p => p.id === postId);
            if (post) {
                post.user_interactions.reposted = isReposted;
                post.stats.reposts_count = newCount;
            }
        }
        
        // Efecto visual y notificaciones
        if (isReposted) {
            element.style.transform = 'scale(1.2) rotate(180deg)';
            setTimeout(() => {
                element.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
            
            // Mostrar notificación con tokens
            if (data.tokens_affected > 0) {
                showNotification(`🔄 ¡Post reposteado! El autor ganó ${data.tokens_affected} CFT`);
            } else {
                showNotification('🔄 ¡Post reposteado!');
            }
        } else {
            showNotification('❌ Repost eliminado');
        }

    } catch (error) {
        console.error('Error al hacer repost:', error);
        showNotification(`Error al procesar repost: ${error.message}`, 'error');
    } finally {
        setTimeout(() => {
            element.classList.remove('action-feedback');
        }, 600);
    }
}

console.log('✅ Corrección de reposts cargada');


// ============================================
// SCROLL INFINITO
// ============================================

/**
 * Configurar scroll infinito
 */
function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && FeedState.hasMore && !FeedState.isLoading) {
                loadFeedPosts(true); // Cargar más posts
            }
        });
    }, {
        rootMargin: '100px' // Cargar antes de llegar al final
    });

    // Crear elemento sentinel al final del feed
    const sentinel = document.createElement('div');
    sentinel.id = 'feed-sentinel';
    sentinel.style.height = '1px';
    
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer) {
        feedContainer.appendChild(sentinel);
        observer.observe(sentinel);
    }
}

// ============================================
// ESTADOS DE CARGA Y ERROR
// ============================================

function showLoadingSpinner() {
    let spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="width: 40px; height: 40px; border: 4px solid rgba(99, 102, 241, 0.3); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Cargando posts...</p>
            </div>
        `;
        document.getElementById('feedPosts').appendChild(spinner);
    }
    spinner.style.display = 'block';
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function showEmptyFeedState() {
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer && FeedState.posts.length === 0) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
                <h3>Tu feed está vacío</h3>
                <p>¡Sigue a más usuarios para ver sus posts aquí!</p>
                <button onclick="goToSearch()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Buscar usuarios
                </button>
            </div>
        `;
    }
}

function showErrorState() {
    const feedContainer = document.getElementById('feedPosts');
    if (feedContainer) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Error al cargar posts</h3>
                <p>No pudimos cargar tu feed. Intenta recargar la página.</p>
                <button onclick="loadFeedPosts()" style="margin-top: 1rem; padding: 0.8rem 2rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Reintentar
                </button>
            </div>
        `;
    }
}

// ============================================
// MODIFICAR INICIALIZACIÓN
// ============================================

// Modificar la función initializeApp existente
const originalInitializeApp = window.initializeApp;

// Modificar esta parte (alrededor de la línea donde dice setTimeout(() => { loadFeedSeguidos(); }, 500);)

window.initializeApp = function() {
    if (originalInitializeApp) {
        originalInitializeApp();
    }
    
    setTimeout(() => {
        // ✅ NO cargar feed si ya estamos en otra sección
        if (!window.AppState || window.AppState.currentFeedType === 'posts') {
            loadFeedSeguidos();
        } else {
            console.log('⏭️ Saltando carga de feed - ya hay contenido activo:', window.AppState.currentFeedType);
        }
    }, 500);
};

// Agregar estilos para animaciones
const feedStyles = document.createElement('style');
feedStyles.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .hashtag {
        color: var(--primary);
        cursor: pointer;
        font-weight: 600;
    }
    
    .hashtag:hover {
        text-decoration: underline;
    }
    
    .mention {
        color: var(--primary);
        background: rgba(99, 102, 241, 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        text-decoration: none;
    }
    
    .mention:hover {
        background: rgba(99, 102, 241, 0.2);
        text-decoration: underline;
    }
    
    .post-content a {
        color: var(--primary);
        text-decoration: underline;
    }
    
    .post-content a:hover {
        color: var(--accent);
    }
`;
document.head.appendChild(feedStyles);

// ============================================
// SISTEMA DE MENÚ DE TRES PUNTOS PARA POSTS
// ============================================

let activePostMenu = null;

function togglePostMenu(postId) {
    const dropdown = document.getElementById(`postDropdown-${postId}`);
    
    // Si este menú ya está activo, cerrarlo
    if (activePostMenu === postId) {
        closePostMenu(postId);
        return;
    }
    
    // Cerrar cualquier menú abierto
    closeAllPostMenus();
    
    // Abrir el nuevo menú
    if (dropdown) {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('active');
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0) scale(1)';
        
        activePostMenu = postId;
        
        // Agregar listener para cerrar al hacer clic fuera
        setTimeout(() => {
            document.addEventListener('click', closeMenuOnOutsideClick);
        }, 10);
    }
}

function closePostMenu(postId) {
    const dropdown = document.getElementById(`postDropdown-${postId}`);
    
    if (dropdown) {
        dropdown.classList.remove('active');
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 300);
    }
    
    if (activePostMenu === postId) {
        activePostMenu = null;
    }
    
    // Remover el listener de clic fuera
    document.removeEventListener('click', closeMenuOnOutsideClick);
}

function closeAllPostMenus() {
    // Si hay un menú activo, cerrarlo
    if (activePostMenu) {
        closePostMenu(activePostMenu);
    }
    
    // Por seguridad, cerrar cualquier menú que esté abierto
    const allActiveDropdowns = document.querySelectorAll('.post-dropdown.active');
    allActiveDropdowns.forEach(dropdown => {
        const postId = dropdown.id.replace('postDropdown-', '');
        closePostMenu(postId);
    });
}

function closeMenuOnOutsideClick(event) {
    const clickedElement = event.target;
    
    // Verificar si el clic fue dentro de un menú o botón de menú
    const isInsideMenu = clickedElement.closest('.post-dropdown') || 
                        clickedElement.closest('.post-menu-btn');
    
    if (!isInsideMenu) {
        closeAllPostMenus();
    }
}

// ============================================
// FUNCIONES DE ACCIONES DEL MENÚ
// ============================================

/**
 * Ocultar publicación - CON CONFIRMACIÓN
 */
function hidePost(postId) {
    try {
        closePostMenu(postId);
        
        // ✅ MODAL DE CONFIRMACIÓN
        const modal = createConfirmModal(
            '👁️‍🗨️ Ocultar publicación',
            '¿Ocultar esta publicación de tu feed? Solo desaparecerá para ti, otros usuarios seguirán viéndola.',
            'Cancelar',
            'Ocultar',
            null, // onCancel
            () => { // onConfirm
                // Encontrar y ocultar la tarjeta del post con animación
                const postCard = document.querySelector(`[data-post-id="${postId}"]`);
                if (postCard) {
                    postCard.classList.add('action-feedback');
                    
                    setTimeout(() => {
                        postCard.style.transform = 'scale(0.8)';
                        postCard.style.opacity = '0';
                        
                        setTimeout(() => {
                            postCard.style.display = 'none';
                        }, 300);
                    }, 100);
                }
                
                // Guardar en localStorage para recordar posts ocultos
                const hiddenPosts = JSON.parse(localStorage.getItem('chainfeed_hidden_posts') || '[]');
                if (!hiddenPosts.includes(postId)) {
                    hiddenPosts.push(postId);
                    localStorage.setItem('chainfeed_hidden_posts', JSON.stringify(hiddenPosts));
                }
                
                showNotification('👁️‍🗨️ Post ocultado de tu feed', 'success');
            }
        );
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error ocultando post:', error);
        showNotification('❌ Error al ocultar post', 'error');
    }
}

function reportPost(postId) {
    closePostMenu(postId);
    
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
            // Confirmar - simular reporte
            showNotification('✅ Post reportado. Gracias por mantener la comunidad segura', 'success');
        }
    );
    
    document.body.appendChild(confirmReportModal);
}

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
        showNotification('🔗 Enlace copiado', 'success');
    } catch (err) {
        showNotification('❌ No se pudo copiar el enlace', 'error');
    }
    
    document.body.removeChild(textArea);
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

  // Agregar estilos para el menú
const menuDropdownStyles = document.createElement('style');
menuDropdownStyles.textContent = `
    .post-dropdown-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 0.5rem 0;
    }
    
    .post-dropdown-item.danger {
        color: var(--error, #ef4444);
    }
    
    .post-dropdown-item.danger:hover {
        background: rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(menuDropdownStyles);

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

// ============================================
// CERRAR MENÚS CON ESC
// ============================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const commentsModal = document.getElementById('commentsModal');
        const shareModal = document.getElementById('shareModal');
        
        if (commentsModal && commentsModal.classList.contains('active')) {
            closeComments();
        } else if (shareModal && shareModal.classList.contains('active')) {
            closeShareModal();
        } else if (activePostMenu) {
            closePostMenu(activePostMenu);
        }
    }
});

// ============================================
// AUTO-ABRIR VIEWER O COMENTARIOS DESDE NOTIFICACIONES
// ============================================

// ============================================
// AUTO-ABRIR VIEWER O COMENTARIOS DESDE NOTIFICACIONES
// ============================================

function checkAndOpenViewerFromHash() {
    // Primero verificar localStorage (prioridad)
    const postIdFromStorage = localStorage.getItem('openPostOnLoad');
    
    if (postIdFromStorage) {
        console.log('Detectado post desde localStorage:', postIdFromStorage);
        localStorage.removeItem('openPostOnLoad');
        
        // Esperar a que el feed termine de cargar
        waitForFeedToLoad(() => {
            openViewerForPost(postIdFromStorage);
        });
        return;
    }
    
    // Si no hay localStorage, verificar hash
    const hash = window.location.hash;
    
    if (hash.startsWith('#viewer-post-')) {
        const postId = hash.replace('#viewer-post-', '');
        waitForFeedToLoad(() => {
            openViewerForPost(postId);
        });
    }
    else if (hash.startsWith('#comments-post-')) {
        const postId = hash.replace('#comments-post-', '');
        waitForFeedToLoad(() => {
            openCommentsForPost(postId);
        });
    }
}

function waitForFeedToLoad(callback) {
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos máximo esperando que cargue el feed
    
    const checkFeedLoaded = setInterval(() => {
        attempts++;
        
        // Verificar si ya hay posts cargados
        const feedHasPosts = document.querySelectorAll('.post-card').length > 0;
        // Verificar si el feed ya no está cargando
        const feedNotLoading = !FeedState.isLoading;
        
        if (feedHasPosts || feedNotLoading) {
            clearInterval(checkFeedLoaded);
            console.log('✅ Feed cargado, ejecutando callback');
            callback();
        }
        
        if (attempts >= maxAttempts) {
            clearInterval(checkFeedLoaded);
            console.log('⚠️ Timeout esperando feed, ejecutando callback de todas formas');
            callback();
        }
    }, 100);
}

function openViewerForPost(postId) {
    console.log('🔍 Buscando post con ID:', postId);
    
    // Ver todos los IDs de posts disponibles
    const availablePosts = Array.from(document.querySelectorAll('.post-card')).map(p => {
        const id = p.dataset.postId;
        console.log('Post disponible:', id);
        return id;
    });
    
    console.log('📝 Total posts cargados:', availablePosts.length);
    console.log('📝 Post buscado:', `post-${postId}`);
    
    let attempts = 0;
    const maxAttempts = 50;
    
    const waitForPost = setInterval(() => {
        attempts++;
        
        const postElement = document.querySelector(`[data-post-id="post-${postId}"]`);
        
        if (postElement && window.fullscreenViewer) {
            clearInterval(waitForPost);
            console.log('✅ Post encontrado, abriendo viewer');
            
            setTimeout(() => {
                window.fullscreenViewer.openViewer(postElement);
                
                if (window.location.hash.includes('viewer-post-')) {
                    history.replaceState(null, null, '/inicio');
                }
            }, 200);
        }
        
        if (attempts >= maxAttempts) {
            clearInterval(waitForPost);
            console.error('❌ Post NO encontrado:', `post-${postId}`);
            console.error('Posts disponibles:', availablePosts);
            showNotification('Esta publicación no está en tu feed. Puede que no sigas a este usuario.', 'error');
        }
    }, 100);
}

function openCommentsForPost(postId) {
    console.log('Intentando abrir comentarios para post:', postId);
    
    let attempts = 0;
    const maxAttempts = 100;
    
    const waitForPost = setInterval(() => {
        attempts++;
        
        const postElement = document.querySelector(`[data-post-id="post-${postId}"]`);
        
        if (postElement) {
            clearInterval(waitForPost);
            
            const commentButton = postElement.querySelector('[data-comments-count]');
            
            if (commentButton && window.openComments) {
                console.log('✅ Abriendo modal de comentarios');
                
                setTimeout(() => {
                    window.openComments(commentButton);
                    
                    // Limpiar URL si venía de hash
                    if (window.location.hash.includes('comments-post-')) {
                        history.replaceState(null, null, '/inicio');
                    }
                }, 200);
            } else {
                console.error('❌ No se encontró la función openComments');
                showNotification('Error al abrir comentarios', 'error');
            }
        }
        
        if (attempts >= maxAttempts) {
            clearInterval(waitForPost);
            console.error('⏱️ Timeout: Post no encontrado');
            showNotification('No se pudo encontrar la publicación', 'error');
        }
    }, 100);
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndOpenViewerFromHash);
} else {
    checkAndOpenViewerFromHash();
}

// También ejecutar después de cargar el feed
const originalLoadFeed = window.loadFeedPosts;
if (originalLoadFeed) {
    window.loadFeedPosts = async function(...args) {
        await originalLoadFeed.apply(this, args);
        setTimeout(checkAndOpenViewerFromHash, 500);
    };
}

console.log('✅ Auto-open viewer y comentarios desde notificaciones configurado');

// ============================================
// DEBUG: Verificar sistema de compartir
// ============================================
console.log('🔍 Verificando sistema de compartir...');

setTimeout(() => {
    const firstPost = document.querySelector('.post-card');
    if (firstPost) {
        console.log('✅ Post encontrado:', {
            postId: firstPost.dataset.postId,
            hasShareButton: !!firstPost.querySelector('[onclick*="openShareModal"]')
        });
    }
    
    console.log('✅ ShareSystem disponible:', !!window.ShareSystem);
    console.log('✅ openShareModal disponible:', !!window.openShareModal);
}, 2000);

/**
 * Función para promocionar post desde el menú
 */
// ============================================
// INTEGRACIÓN SISTEMA DE PROMOCIÓN - INICIO
// ============================================

/**
 * Función conectora para promocionar posts desde el menú
 */
async function promotePostInicio(postId) {
    try {
        console.log('📢 Iniciando promoción para post:', postId);
        
        // Cerrar menú
        closePostMenu(postId);
        
        // Limpiar ID
        const cleanId = String(postId).replace('post-', '');
        
        // Buscar elemento del post
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        
        // Verificar que el sistema de promoción esté disponible
        if (typeof openPromotionModalInicio === 'function') {
            await openPromotionModalInicio('publicacion', cleanId, postElement);
        } else {
            console.error('❌ Sistema de promoción no cargado');
            showNotification('Error: Sistema de promoción no disponible', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error al abrir promoción:', error);
        showNotification('❌ Error al abrir modal de promoción', 'error');
    }
}

/**
 * Inicializar botones "Ver" en todos los posts cargados
 */
function initializeViewLikesButtons() {
    // Buscar todos los posts en el feed
    const allPosts = document.querySelectorAll('.post-card');
    
    allPosts.forEach(postCard => {
        const postId = postCard.dataset.postId;
        if (!postId) return;
        
        const cleanId = postId.replace('post-', '');
        const postStatsContainer = postCard.querySelector('.post-stats');
        const likeButton = postStatsContainer?.querySelector('.post-stat[onclick*="toggleRealPostLike"]');
        
        if (!postStatsContainer || !likeButton) return;
        
        // Obtener cantidad de likes del botón
        const likeCountSpan = likeButton.querySelector('.like-count');
        const likeCount = parseInt(likeCountSpan?.textContent || '0');
        
        // Verificar si ya existe el botón "Ver"
        let viewButton = postStatsContainer.querySelector('.post-stat-view-likes');
        
        if (likeCount > 0) {
            // Si hay likes y NO existe el botón, crearlo
            if (!viewButton) {
                viewButton = document.createElement('button');
                viewButton.className = 'post-stat-view-likes';
                viewButton.onclick = (e) => openLikesModal('publicacion', cleanId, e);
                viewButton.title = 'Ver quién dio like';
                viewButton.textContent = 'Ver';
                
                // Insertar ANTES del botón de likes
                postStatsContainer.insertBefore(viewButton, likeButton);
            }
        } else {
            // Si NO hay likes, eliminar el botón si existe
            if (viewButton) {
                viewButton.remove();
            }
        }
    });
    
    console.log('✅ Botones "Ver" inicializados');
}

// ============================================
// 🔍 DEBUG COMPLETO DE SISTEMA DE FLASHES EN POSTS
// ============================================

(function() {
    console.log('🔍 ============================================');
    console.log('🔍 INICIANDO DEBUG DE FLASHES EN POSTS');
    console.log('🔍 ============================================');

    // ✅ VERIFICAR QUE EXISTEN LAS FUNCIONES DEL SCRIPT INLINE
    console.log('✅ window.aplicarAnilloFlash existe:', typeof window.aplicarAnilloFlash === 'function');
    console.log('✅ window.actualizarAnillosFlashesEnPosts existe:', typeof window.actualizarAnillosFlashesEnPosts === 'function');

    // ✅ INTERCEPTAR RESPUESTA DE LA API
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (args[0] && args[0].includes('obtener_feed_inicio.php')) {
            console.log('🌐 Interceptando llamada a obtener_feed_inicio.php');
            
            return originalFetch.apply(this, args).then(response => {
                return response.clone().json().then(data => {
                    console.log('📦 ============================================');
                    console.log('📦 RESPUESTA COMPLETA DE API:');
                    console.log('📦 ============================================');
                    console.log('   Success:', data.success);
                    console.log('   Total publicaciones:', data.publicaciones?.length);
                    
                    if (data.publicaciones && data.publicaciones.length > 0) {
                        console.log('\n📊 PRIMER POST - ANÁLISIS DETALLADO:');
                        const firstPost = data.publicaciones[0];
                        console.log('   ID:', firstPost.id);
                        console.log('   Username:', firstPost.username);
                        console.log('   ✅ Tiene flash_info:', !!firstPost.flash_info);
                        
                        if (firstPost.flash_info) {
                            console.log('   📊 Flash Info:');
                            console.log('      - total_flashes:', firstPost.flash_info.total_flashes);
                            console.log('      - permanentes_sin_ver:', firstPost.flash_info.permanentes_sin_ver);
                            console.log('      - normales_sin_ver:', firstPost.flash_info.normales_sin_ver);
                            console.log('      - vigentes:', firstPost.flash_info.vigentes);
                            console.log('      - flash_status:', firstPost.flash_info.flash_status);
                        } else {
                            console.error('   ❌ NO TIENE flash_info');
                        }
                        
                        console.log('\n📊 TODOS LOS POSTS CON FLASHES:');
                        data.publicaciones.forEach((post, idx) => {
                            if (post.flash_info && post.flash_info.total_flashes > 0) {
                                console.log(`   ${idx + 1}. @${post.username}: ${post.flash_info.total_flashes} flashes (${post.flash_info.flash_status})`);
                            }
                        });
                    } else {
                        console.error('   ❌ NO HAY PUBLICACIONES EN LA RESPUESTA');
                    }
                    
                    console.log('📦 ============================================\n');
                    
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }).catch(err => {
                    console.error('❌ Error parseando respuesta JSON:', err);
                    return response;
                });
            });
        }
        return originalFetch.apply(this, args);
    };

    // ✅ VERIFICAR POSTS RENDERIZADOS
    setTimeout(() => {
        console.log('\n🎨 ============================================');
        console.log('🎨 ANÁLISIS DE POSTS RENDERIZADOS EN EL DOM');
        console.log('🎨 ============================================');
        
        const posts = document.querySelectorAll('.post-card');
        console.log(`📊 Total posts en DOM: ${posts.length}`);

        if (posts.length === 0) {
            console.error('❌ NO HAY POSTS CARGADOS EN EL DOM');
            return;
        }

        posts.forEach((post, index) => {
            console.log(`\n📝 POST ${index + 1}/${posts.length}:`);
            console.log('   ID:', post.dataset.postId);

            const avatar = post.querySelector('.post-avatar');
            const avatarWrapper = post.querySelector('.post-avatar-wrapper');
            
            console.log('   ✅ Tiene .post-avatar-wrapper:', !!avatarWrapper);
            console.log('   ✅ Tiene .post-avatar:', !!avatar);

            if (avatar) {
                console.log('   📊 Clases del avatar:', avatar.className);
                console.log('   📊 data-flash-info:', avatar.dataset.flashInfo);
                console.log('   📊 data-username:', avatar.dataset.username);

                if (avatar.dataset.flashInfo) {
                    try {
                        const flashInfo = JSON.parse(avatar.dataset.flashInfo);
                        console.log('   ✅ Flash info parseado:');
                        console.log('      - total_flashes:', flashInfo.total_flashes);
                        console.log('      - flash_status:', flashInfo.flash_status);
                        console.log('      - permanentes_sin_ver:', flashInfo.permanentes_sin_ver);
                        console.log('      - normales_sin_ver:', flashInfo.normales_sin_ver);
                        
                        // Verificar si tiene la clase correcta
                        const hasCorrectClass = avatar.classList.contains(flashInfo.flash_status);
                        console.log('   ✅ Tiene clase correcta:', hasCorrectClass);
                        
                        if (!hasCorrectClass) {
                            console.error('   ❌ FALTA CLASE:', flashInfo.flash_status);
                        }
                    } catch (e) {
                        console.error('   ❌ Error parseando flash_info:', e);
                    }
                } else {
                    console.warn('   ⚠️ NO tiene data-flash-info');
                }

                // Verificar contador
                const counter = avatarWrapper?.querySelector('.post-flash-counter');
                if (counter) {
                    console.log('   ✅ Contador visible:', counter.textContent);
                    console.log('   📊 Clases del contador:', counter.className);
                } else {
                    console.log('   ⚠️ No tiene contador');
                }
            } else {
                console.error('   ❌ NO TIENE AVATAR');
            }
        });
        
        console.log('\n🎨 ============================================');
        console.log('🎨 FIN ANÁLISIS DE POSTS');
        console.log('🎨 ============================================\n');
        
        // ✅ INTENTAR APLICAR ANILLOS MANUALMENTE
        if (typeof window.actualizarAnillosFlashesEnPosts === 'function') {
            console.log('🔧 Ejecutando actualizarAnillosFlashesEnPosts()...');
            window.actualizarAnillosFlashesEnPosts();
        } else {
            console.error('❌ window.actualizarAnillosFlashesEnPosts NO EXISTE');
        }
        
    }, 3000);

    console.log('✅ Sistema de debug de flashes inicializado');
})();

console.log('✅ Integración de promoción lista para inicio');

// ============================================
// EXPORTAR FUNCIONES GLOBALMENTE
// ============================================

// Asegurar que openTransactionsModal esté disponible globalmente
if (typeof window.openTransactionsModal !== 'function') {
    console.warn('⚠️ openTransactionsModal no está disponible globalmente');
}

console.log('✅ Sistema de badges de colección con transacciones configurado');

// Estilos para badge de colección clickeable
const collectionBadgeStyles = document.createElement('style');
collectionBadgeStyles.textContent = `
    .collection-badge {
        position: relative;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
    
    .collection-badge:hover::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% + 8px);
        height: calc(100% + 8px);
        background: rgba(251, 191, 36, 0.1);
        border-radius: 8px;
        z-index: -1;
        animation: pulseGlow 1.5s ease-in-out infinite;
    }
    
    @keyframes pulseGlow {
        0%, 100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
    }
    
    .collection-badge:active {
        transform: scale(0.95) !important;
    }
`;
document.head.appendChild(collectionBadgeStyles);