// ============================================
// SISTEMA DE VISUALIZACIÓN DE USUARIOS QUE DIERON LIKE
// Versión corregida con detección mejorada de propietario
// ============================================

const LikesViewerSystem = {
    currentTarget: null,
    usuarios: [],
    isLoading: false
};

/**
 * Abrir modal de usuarios que dieron like
 */
async function openLikesViewerModal(tipo, targetId) {
    try {
        console.log('📊 Abriendo visualizador de likes:', tipo, targetId);
        
        LikesViewerSystem.currentTarget = {
            tipo: tipo,
            id: targetId
        };
        
        const modal = document.getElementById('likesViewerModal');
        if (!modal) {
            console.error('❌ Modal de likes no encontrado');
            return;
        }
        
        // Mostrar modal con loading
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        showLikesLoading();
        
        // Cargar usuarios
        await loadUsersWhoLiked(tipo, targetId);
        
    } catch (error) {
        console.error('❌ Error abriendo modal de likes:', error);
        closeLikesViewerModal();
        showNotification('❌ Error al cargar usuarios que dieron like', 'error');
    }
}

/**
 * Cargar usuarios que dieron like
 */
async function loadUsersWhoLiked(tipo, targetId) {
    try {
        LikesViewerSystem.isLoading = true;
        
        const response = await fetch('/php/obtener_usuarios_likes.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo: tipo,
                id: targetId,
                limit: 50,
                offset: 0
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📥 Datos de likes recibidos:', data);
        
        if (data.success) {
            LikesViewerSystem.usuarios = data.usuarios;
            renderLikesUsers(data);
        } else {
            throw new Error(data.message || 'Error al cargar usuarios');
        }
        
    } catch (error) {
        console.error('❌ Error cargando usuarios:', error);
        showLikesError(error.message);
    } finally {
        LikesViewerSystem.isLoading = false;
    }
}

/**
 * Renderizar lista de usuarios
 */
function renderLikesUsers(data) {
    const container = document.getElementById('likesViewerContent');
    const infoContainer = document.getElementById('likesViewerInfo');
    
    if (!container || !infoContainer) {
        console.error('❌ Contenedores del modal no encontrados');
        return;
    }
    
    // Renderizar información general
    const tipoTexto = data.tipo === 'publicacion' ? 'publicación' : 'comentario';
    infoContainer.innerHTML = `
        <div style="text-align: center; padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700;">
                ${data.total_likes > 0 ? '❤️' : '🤍'} ${data.total_likes} Like${data.total_likes !== 1 ? 's' : ''}
            </h3>
            <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.9rem;">
                Usuarios que dieron like a esta ${tipoTexto}
            </p>
        </div>
    `;
    
    // Renderizar lista de usuarios
    if (data.usuarios.length === 0) {
        container.innerHTML = `
            <div class="empty-likes-viewer">
                <div class="empty-icon">🤍</div>
                <h3>Sin likes aún</h3>
                <p>Sé el primero en dar like a esta ${tipoTexto}</p>
            </div>
        `;
        return;
    }
    
    let usersHTML = '';
    
    data.usuarios.forEach(usuario => {
        const likeTime = formatTimeAgo(new Date(usuario.like_date));
        const avatarHTML = usuario.avatar_url 
            ? `<img src="${usuario.avatar_url}" alt="${usuario.username}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(usuario.username)}';">`
            : generateAvatarInitials(usuario.username);
        
        usersHTML += `
            <div class="likes-viewer-user-item">
                <div class="likes-viewer-user-avatar" onclick="goToUserProfile('${usuario.username}')" style="cursor: pointer;">
                    ${avatarHTML}
                </div>
                <div class="likes-viewer-user-info">
                    <div class="likes-viewer-user-name">
                        <span onclick="goToUserProfile('${usuario.username}')" style="cursor: pointer; font-weight: 600; transition: color 0.3s ease;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color=''">
                            ${escapeHtml(usuario.display_name)}
                        </span>
                        ${usuario.verified ? '<span class="verified-badge-small">✓</span>' : ''}
                    </div>
                    <div class="likes-viewer-user-username">@${usuario.username}</div>
                    <div class="likes-viewer-user-meta">
                        <span class="likes-viewer-tokens">💎 ${parseFloat(usuario.token_balance).toFixed(2)} CFT</span>
                        <span class="likes-viewer-time">• ${likeTime}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = usersHTML;
}

/**
 * Mostrar estado de carga
 */
function showLikesLoading() {
    const infoContainer = document.getElementById('likesViewerInfo');
    const container = document.getElementById('likesViewerContent');
    
    if (infoContainer) {
        infoContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
                <div>Cargando usuarios que dieron like...</div>
            </div>
        `;
    }
    
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * Mostrar error
 */
function showLikesError(message) {
    const infoContainer = document.getElementById('likesViewerInfo');
    const container = document.getElementById('likesViewerContent');
    
    if (infoContainer) {
        infoContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--error);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                <div>Error: ${message}</div>
            </div>
        `;
    }
    
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * Cerrar modal
 */
function closeLikesViewerModal() {
    const modal = document.getElementById('likesViewerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Limpiar después de la animación
    setTimeout(() => {
        const infoContainer = document.getElementById('likesViewerInfo');
        const container = document.getElementById('likesViewerContent');
        
        if (infoContainer) infoContainer.innerHTML = '';
        if (container) container.innerHTML = '';
        
        LikesViewerSystem.currentTarget = null;
        LikesViewerSystem.usuarios = [];
    }, 300);
}

// ============================================
// VERIFICACIÓN MEJORADA DE PROPIETARIO
// ============================================

/**
 * Obtener username del propietario desde el post card
 */
function getPostOwnerUsername(postCard) {
    try {
        // Buscar en diferentes ubicaciones posibles
        
        // 1. Intentar desde data attribute
        const ownerUsername = postCard.dataset.ownerUsername;
        if (ownerUsername) {
            console.log('✅ Username desde data attribute:', ownerUsername);
            return ownerUsername;
        }
        
        // 2. Buscar en el header del post
        const authorLink = postCard.querySelector('[onclick*="goToUserProfile"]');
        if (authorLink) {
            const onclickAttr = authorLink.getAttribute('onclick');
            const match = onclickAttr.match(/goToUserProfile\(['"](.+?)['"]\)/);
            if (match && match[1]) {
                console.log('✅ Username desde onclick:', match[1]);
                return match[1];
            }
        }
        
        // 3. Buscar en el texto @username
        const usernameElement = postCard.querySelector('.post-meta, .card-meta');
        if (usernameElement) {
            const text = usernameElement.textContent;
            const match = text.match(/@(\w+)/);
            if (match && match[1]) {
                console.log('✅ Username desde texto:', match[1]);
                return match[1];
            }
        }
        
        console.warn('⚠️ No se pudo obtener username del propietario');
        return null;
        
    } catch (error) {
        console.error('❌ Error obteniendo username del propietario:', error);
        return null;
    }
}

/**
 * Verificar si el usuario actual es el propietario del post
 */
function isCurrentUserPostOwner(element) {
    try {
        const currentUsername = getCurrentUser();
        if (!currentUsername) {
            console.log('❌ Usuario actual no disponible');
            return false;
        }
        
        const postCard = element.closest('.content-card, .post-card');
        if (!postCard) {
            console.log('❌ Post card no encontrado');
            return false;
        }
        
        const ownerUsername = getPostOwnerUsername(postCard);
        if (!ownerUsername) {
            console.log('❌ Username del propietario no disponible');
            return false;
        }
        
        const isOwner = currentUsername === ownerUsername;
        console.log('🔍 Verificación de propietario:', {
            currentUser: currentUsername,
            postOwner: ownerUsername,
            isOwner: isOwner
        });
        
        return isOwner;
        
    } catch (error) {
        console.error('❌ Error verificando propietario:', error);
        return false;
    }
}

/**
 * Obtener ID del post correctamente
 */
function getPostIdFromElement(element) {
    try {
        const postCard = element.closest('.content-card, .post-card');
        if (!postCard) {
            console.error('❌ Post card no encontrado');
            return null;
        }
        
        const postId = postCard.dataset.postId;
        if (!postId) {
            console.error('❌ Post ID no encontrado en dataset');
            return null;
        }
        
        // Extraer número del ID
        let numericId = null;
        
        if (postId.startsWith('post-')) {
            numericId = parseInt(postId.replace('post-', ''));
        } else if (postId.startsWith('card-')) {
            numericId = parseInt(postId.replace('card-', ''));
        } else {
            numericId = parseInt(postId);
        }
        
        console.log('🔢 Post ID extraído:', numericId);
        return numericId;
        
    } catch (error) {
        console.error('❌ Error obteniendo post ID:', error);
        return null;
    }
}

// ============================================
// INTERCEPTOR PARA toggleRealPostLike
// ============================================

// Guardar la función original
const originalToggleRealPostLike = window.toggleRealPostLike;

/**
 * Nueva versión que intercepta antes de hacer la petición
 */
window.toggleRealPostLike = async function(button, postId) {
    try {
        console.log('🔄 toggleRealPostLike interceptado');
        
        // PRIMERO: Verificar si es el propietario
        const isOwner = isCurrentUserPostOwner(button);
        
        if (isOwner) {
            console.log('👤 Usuario es propietario - abriendo modal de likes');
            
            // Obtener ID del post
            const targetId = postId || getPostIdFromElement(button);
            
            if (!targetId) {
                console.error('❌ No se pudo obtener ID del post');
                showNotification('❌ Error al obtener información del post', 'error');
                return;
            }
            
            // Abrir modal de visualización
            await openLikesViewerModal('publicacion', targetId);
            return; // IMPORTANTE: Detener la ejecución aquí
        }
        
        console.log('👍 Usuario no es propietario - procesando like normal');
        
        // Si no es propietario, ejecutar función original
        if (originalToggleRealPostLike) {
            await originalToggleRealPostLike.call(this, button, postId);
        } else {
            console.error('❌ Función original toggleRealPostLike no disponible');
        }
        
    } catch (error) {
        console.error('❌ Error en toggleRealPostLike wrapper:', error);
        showNotification('❌ Error procesando acción', 'error');
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================

function initializeLikesViewerSystem() {
    console.log('✅ Sistema de visualización de likes inicializado');
    
    // Setup modal close events
    const modal = document.getElementById('likesViewerModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLikesViewerModal();
            }
        });
    }
    
    // Close with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('likesViewerModal');
            if (modal && modal.classList.contains('active')) {
                closeLikesViewerModal();
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLikesViewerSystem);
} else {
    initializeLikesViewerSystem();
}

console.log('✅ Sistema de visualización de usuarios que dieron like cargado');