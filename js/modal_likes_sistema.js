// ============================================
// SISTEMA DE MODAL DE LIKES
// ============================================

/**
 * Abrir modal mostrando usuarios que dieron like
 */
async function openLikesModal(tipo, targetId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    try {
        console.log('📋 Abriendo modal de likes:', { tipo, targetId });
        
        // Crear overlay del modal
        const overlay = document.createElement('div');
        overlay.className = 'likes-modal-overlay';
        overlay.id = 'likesModalOverlay';
        
        overlay.innerHTML = `
            <div class="likes-modal">
                <div class="likes-modal-header">
                    <h3 class="likes-modal-title">
                        ❤️ Likes
                    </h3>
                    <button class="likes-modal-close" onclick="closeLikesModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <div class="likes-modal-body" id="likesModalBody">
                    <div class="likes-modal-loading">
                        <div class="likes-loading-spinner"></div>
                        <p>Cargando usuarios...</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Cerrar con click fuera
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeLikesModal();
            }
        });
        
        // Activar animación
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
        
        // Cargar usuarios
        await loadLikesUsers(tipo, targetId);
        
    } catch (error) {
        console.error('Error abriendo modal de likes:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error al cargar likes', 'error');
        }
        closeLikesModal();
    }
}

/**
 * Cargar usuarios que dieron like
 */
async function loadLikesUsers(tipo, targetId) {
    try {
        // ✅ Convertir 'post' a 'publicacion' y 'comment' a 'comentario'
        const tipoAPI = tipo === 'post' ? 'publicacion' : 
                        tipo === 'comment' ? 'comentario' : tipo;
        
        console.log('📡 Enviando request:', { tipo: tipoAPI, id: targetId });
        
        const response = await fetch('/php/obtener_usuarios_likes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo: tipoAPI,  // ✅ Usar tipo convertido
                id: targetId,
                limit: 50,
                offset: 0
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Respuesta recibida:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Error al cargar usuarios');
        }
        
        renderLikesUsers(data.usuarios, data.total_likes);
        
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        
        const modalBody = document.getElementById('likesModalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="likes-modal-empty">
                    <p style="font-size: 2rem; margin-bottom: 1rem;">⚠️</p>
                    <p>Error al cargar usuarios</p>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                        ${error.message}
                    </p>
                </div>
            `;
        }
    }
}

/**
 * Renderizar lista de usuarios
 */
function renderLikesUsers(usuarios, total) {
    const modalBody = document.getElementById('likesModalBody');
    if (!modalBody) return;
    
    if (!usuarios || usuarios.length === 0) {
        modalBody.innerHTML = `
            <div class="likes-modal-empty">
                <p style="font-size: 2rem; margin-bottom: 1rem;">💔</p>
                <p>Aún no hay likes</p>
            </div>
        `;
        return;
    }
    
    modalBody.innerHTML = '';
    
    usuarios.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'like-user-item';
        userItem.onclick = () => goToUserProfileFromLikes(user.username);
        
        // Generar avatar
        let avatarHTML;
        if (user.avatar_url) {
            avatarHTML = `<img src="${user.avatar_url}" alt="${user.username}" 
                onerror="this.style.display='none'; this.parentNode.innerHTML='${getAvatarInitials(user.username)}';">`;
        } else {
            avatarHTML = getAvatarInitials(user.username);
        }
        
        // Escapar HTML para seguridad
        const displayName = escapeHtml(user.display_name || user.username);
        const username = escapeHtml(user.username);
        
        userItem.innerHTML = `
            <div class="like-user-avatar">${avatarHTML}</div>
            <div class="like-user-info">
                <div class="like-user-name">
                    ${displayName}
                    ${user.verified ? '<span class="like-user-verified">✓</span>' : ''}
                </div>
                <div class="like-user-username">@${username}</div>
            </div>
        `;
        
        modalBody.appendChild(userItem);
    });
    
    // Actualizar título con total
    const modalTitle = document.querySelector('.likes-modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = `❤️ Likes (${total})`;
    }
}

/**
 * Obtener iniciales para avatar
 */
function getAvatarInitials(username) {
    if (!username) return '?';
    const initial = username.charAt(0).toUpperCase();
    return initial;
}

/**
 * Escapar HTML para prevenir XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Cerrar modal de likes
 */
function closeLikesModal() {
    const overlay = document.getElementById('likesModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

/**
 * Ir al perfil de usuario desde modal de likes
 */
function goToUserProfileFromLikes(username) {
    closeLikesModal();
    window.location.href = `/perfil.html?u=${username}`;
}

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const likesModal = document.getElementById('likesModalOverlay');
        if (likesModal && likesModal.classList.contains('active')) {
            closeLikesModal();
        }
    }
});

console.log('✅ Sistema de modal de likes cargado');