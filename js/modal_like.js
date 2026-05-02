// ============================================
// SISTEMA DE MODAL DE LIKES
// ============================================

const likesModalStyles = document.createElement('style');
likesModalStyles.textContent = `
    /* Botón "Ver" al lado de likes */
    .post-stat-view-likes {
        background: rgba(99, 102, 241, 0.1);
        color: #8d81eb !important;
        border: none;
        padding: 0.3rem 0.6rem;
        border-radius: 8px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-left: -0.5rem;
    }
    
    .post-stat-view-likes:hover {
        background: rgba(99, 102, 241, 0.2);
        transform: scale(1.05);
    }
    
    /* Modal de usuarios que dieron like */
    .likes-modal-overlay {
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
        transition: opacity 0.3s ease;
    }
    
    .likes-modal-overlay.active {
        opacity: 1;
        z-index: 9999999;
    }
    
    .likes-modal {
        background: var(--dark-secondary, #1a1a2e);
        border-radius: 20px;
        width: 90%;
        max-width: 550px;
        max-height: 80vh;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .likes-modal-overlay.active .likes-modal {
        transform: scale(1);
    }
    
    .likes-modal-header {
        padding: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .likes-modal-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .likes-modal-close {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: var(--text-secondary, #9ca3af);
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .likes-modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
    }
    
    .likes-modal-body {
        padding: 0.5rem;
        overflow-y: auto;
        flex: 1;
    }
    
    .likes-modal-loading {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--text-secondary, #9ca3af);
    }
    
    .likes-modal-empty {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--text-secondary, #9ca3af);
    }
    
    /* Usuario en lista de likes */
    .like-user-item {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        gap: 1rem;
    }
    
    .like-user-item:hover {
        background: rgba(99, 102, 241, 0.1);
    }
    
    .like-user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #8b5cf6));
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.1rem;
        color: white;
        flex-shrink: 0;
        overflow: hidden;
    }
    
    .like-user-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .like-user-info {
        flex: 1;
        min-width: 0;
    }
    
    .like-user-name {
        font-weight: 600;
        color: var(--text-primary, #fff);
        display: flex;
        align-items: center;
        gap: 0.3rem;
        margin-bottom: 0.2rem;
    }
    
    .like-user-username {
        font-size: 0.9rem;
        color: var(--text-secondary, #9ca3af);
    }
    
    .like-user-verified {
        color: var(--primary, #6366f1);
        font-size: 0.9rem;
    }
    
    /* Tokens en lista de likes */
    .like-user-tokens {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.4rem 0.8rem;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
        border-radius: 20px;
        border: 1px solid rgba(99, 102, 241, 0.3);
        flex-shrink: 0;
    }
    
    .token-icon {
        font-size: 1rem;
    }
    
    .token-amount {
        font-weight: 700;
        color: var(--primary, #6366f1);
        font-size: 0.9rem;
    }
    
    .token-label {
        font-size: 0.75rem;
        color: var(--text-secondary, #9ca3af);
        font-weight: 600;
    }
    
    .like-user-item:hover .like-user-tokens {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
        border-color: rgba(99, 102, 241, 0.5);
    }
    
    /* Scrollbar personalizada */
    .likes-modal-body::-webkit-scrollbar {
        width: 8px;
    }
    
    .likes-modal-body::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
    
    .likes-modal-body::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.3);
        border-radius: 10px;
    }
    
    .likes-modal-body::-webkit-scrollbar-thumb:hover {
        background: rgba(99, 102, 241, 0.5);
    }
    
    /* Animación de carga */
    .likes-loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(99, 102, 241, 0.3);
        border-top: 4px solid var(--primary, #6366f1);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(likesModalStyles);

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
        showNotification('Error al cargar likes', 'error');
        closeLikesModal();
    }
}

/**
 * Cargar usuarios que dieron like
 */
async function loadLikesUsers(tipo, targetId) {
    try {
        // ✅ Mapear tipos correctamente
const tipoMap = {
    'post': 'publicacion',
    'comment': 'comentario',
    'reply': 'comentario',
    'publicacion': 'publicacion',
    'comentario': 'comentario',
    'participacion': 'participacion'
};
        
        const tipoAPI = tipoMap[tipo] || tipo;
        
        console.log('📡 Cargando likes:', { 
            tipoOriginal: tipo, 
            tipoAPI: tipoAPI, 
            targetId: targetId 
        });
        
        // ✅ FIX: Usar ruta absoluta desde la raíz
        const response = await fetch('/php/obtener_usuarios_likes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo: tipoAPI,
                id: parseInt(targetId),
                limit: 50,
                offset: 0
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error del servidor:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.message || `Error HTTP ${response.status}`);
            } catch (e) {
                throw new Error(`Error HTTP ${response.status}: ${errorText}`);
            }
        }
        
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Error al cargar usuarios');
        }
        
        renderLikesUsers(data.usuarios, data.total_likes);
        
    } catch (error) {
        console.error('❌ Error completo:', error);
        
        const modalBody = document.getElementById('likesModalBody');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="likes-modal-empty">
                    <p style="font-size: 2rem; margin-bottom: 1rem;">⚠️</p>
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">Error al cargar usuarios</p>
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
        const avatarHTML = user.avatar_url 
            ? `<img src="${user.avatar_url}" alt="${user.username}" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(user.username)}';">`
            : generateAvatarInitials(user.username);
        
        userItem.innerHTML = `
            <div class="like-user-avatar">${avatarHTML}</div>
            <div class="like-user-info">
                <div class="like-user-name">
                    ${escapeHtml(user.display_name || user.username)}
                    ${user.verified ? '<span class="like-user-verified">✓</span>' : ''}
                </div>
                <div class="like-user-username">@${escapeHtml(user.username)}</div>
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
    
    // Usar tu función existente de navegación
    if (typeof goToUserProfile === 'function') {
        goToUserProfile(username);
    } else {
        window.location.href = `/perfil.html?u=${username}`;
    }
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