/**
 * INTEGRACIÓN DE SISTEMA DE COMPARTIR PARA SIMPLE POST VIEWER
 * Extiende SimplePostViewer con funcionalidad completa de compartir vía chat
 */

// Namespace para evitar conflictos
window.ViewerShareSystem = {
    selectedUsers: new Set(),
    followedUsers: [],
    filteredUsers: [],
    isLoading: false,
    currentViewerPost: null
};

// Función helper para mostrar notificaciones
// Función helper para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Verificar si hay una función DIFERENTE en window (no esta misma)
    if (typeof window.showGlobalNotification === 'function') {
        window.showGlobalNotification(message, type);
        return;
    }
    
    // Crear notificación visual simple
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 999999;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Log en consola
    if (type === 'error') {
        console.error('❌', message);
    } else if (type === 'success') {
        console.log('✅', message);
    } else {
        console.log('ℹ️', message);
    }
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Extender el método openShareModal del SimplePostViewer
(function() {
    // Esperar a que SimplePostViewer esté disponible
    function waitForViewer() {
        if (typeof window.simplePostViewer !== 'undefined') {
            console.log('✅ SimplePostViewer encontrado, extendiendo funcionalidad...');
            extendSimplePostViewer();
        } else {
            setTimeout(waitForViewer, 100);
        }
    }

    function extendSimplePostViewer() {
        const viewer = window.simplePostViewer;
        
        // Sobrescribir el método openShareModal
        viewer.openShareModal = async function() {
            console.log('📤 Abriendo modal de compartir desde viewer');
            
            if (!this.currentStats && !this.currentPost) {
                showNotification('Error: No hay publicación cargada', 'error');
                return;
            }

            // Guardar referencia al post actual
            ViewerShareSystem.currentViewerPost = {
                id: this.currentStats?.id || this.currentPost?.id,
                stats: this.currentStats,
                data: this.currentPost
            };

            if (!ViewerShareSystem.currentViewerPost.id) {
                showNotification('Error: No se pudo identificar la publicación', 'error');
                return;
            }

            const modal = document.getElementById('shareModal');
            if (!modal) {
                showNotification('Error: Modal de compartir no encontrado', 'error');
                return;
            }

            modal.classList.add('active');
            // No cambiar overflow del body porque ya está bloqueado por el viewer
            
            // Cargar usuarios seguidos
            await loadFollowedUsersForViewer();

            setTimeout(() => {
                const searchInput = document.getElementById('shareSearch');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);

            this.restartHideTimer();
        };

        console.log('✅ SimplePostViewer extendido con sistema de compartir');
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForViewer);
    } else {
        waitForViewer();
    }
})();

// ============================================
// FUNCIONES DE COMPARTIR ESPECÍFICAS PARA VIEWER
// ============================================

async function loadFollowedUsersForViewer() {
    try {
        ViewerShareSystem.isLoading = true;
        showLoadingStateShare();

        // CORREGIDO: Obtener el username correctamente
        let currentUsername = null;
        
        // Intentar diferentes fuentes
        if (typeof CHAINFEED_CONFIG !== 'undefined' && CHAINFEED_CONFIG?.currentUser) {
            currentUsername = typeof CHAINFEED_CONFIG.currentUser === 'string' 
                ? CHAINFEED_CONFIG.currentUser 
                : CHAINFEED_CONFIG.currentUser.username;
        }
        
        if (!currentUsername && typeof CommentsSystem !== 'undefined') {
            currentUsername = CommentsSystem?.currentUser?.username;
        }
        
        if (!currentUsername && window.currentUser) {
            currentUsername = typeof window.currentUser === 'string'
                ? window.currentUser
                : window.currentUser.username;
        }
        
        if (!currentUsername && window.simplePostViewer?.currentStats?.autor?.username) {
            currentUsername = window.simplePostViewer.currentStats.autor.username;
        }

        // Validar que sea un string válido
        if (!currentUsername || typeof currentUsername !== 'string') {
            console.error('❌ Username inválido:', currentUsername);
            throw new Error('No se pudo obtener el usuario actual. Asegúrate de estar autenticado.');
        }

        console.log('🔍 Cargando usuarios seguidos para:', currentUsername);

        const response = await fetch('php/obtener_listas_seguimiento.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: currentUsername,
                tipo: 'seguidos',
                limite: 50,
                offset: 0
            })
        });

        const responseText = await response.text();
        console.log('📄 Respuesta del servidor:', responseText.substring(0, 200));

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('❌ Error parseando JSON:', responseText);
            throw new Error('Respuesta inválida del servidor');
        }

        if (!data.success) {
            throw new Error(data.message || 'Error al cargar usuarios seguidos');
        }

        ViewerShareSystem.followedUsers = data.data?.usuarios || [];
        ViewerShareSystem.filteredUsers = [...ViewerShareSystem.followedUsers];

        renderFollowedUsersForViewer();

        console.log(`✅ ${ViewerShareSystem.followedUsers.length} usuarios seguidos cargados`);

    } catch (error) {
        console.error('❌ Error cargando usuarios seguidos:', error);
        showErrorWithRetryViewer(error.message);
    } finally {
        ViewerShareSystem.isLoading = false;
    }
}

function renderFollowedUsersForViewer() {
    const containerList = document.getElementById('mutualFollowersList');
    if (!containerList) return;

    if (ViewerShareSystem.filteredUsers.length === 0) {
        containerList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">👥</div>
                <h3>No sigues a ningún usuario</h3>
                <p>Sigue a otros usuarios para poder compartir posts con ellos</p>
            </div>
        `;
        return;
    }

    let usersHTML = '';

    ViewerShareSystem.filteredUsers.forEach(user => {
        const isSelected = ViewerShareSystem.selectedUsers.has(user.id);
        const avatarHTML = user.avatar_url 
            ? `<img src="${user.avatar_url}" alt="${user.username}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(user.username)}';">`
            : generateAvatarInitials(user.username);

        usersHTML += `
            <div class="user-suggestion ${isSelected ? 'selected' : ''}" onclick="toggleUserSelectionViewer(${user.id})" data-user-id="${user.id}">
                <div class="suggestion-avatar">${avatarHTML}</div>
                <div class="suggestion-info">
                    <div class="suggestion-name">
                        ${escapeHtml(user.display_name)}
                        ${user.verified ? '<span class="verified-badge">✓</span>' : ''}
                    </div>
                    <div class="suggestion-username">@${escapeHtml(user.username)}</div>
                </div>
                <div class="selection-indicator ${isSelected ? 'selected' : ''}">
                    ${isSelected ? '✓' : ''}
                </div>
            </div>
        `;
    });

    containerList.innerHTML = usersHTML;
    updateShareButtonViewer();
}

function toggleUserSelectionViewer(userId) {
    if (ViewerShareSystem.selectedUsers.has(userId)) {
        ViewerShareSystem.selectedUsers.delete(userId);
    } else {
        ViewerShareSystem.selectedUsers.add(userId);
    }
    
    renderFollowedUsersForViewer();
}

function updateShareButtonViewer() {
    const shareContent = document.querySelector('.share-content');
    if (!shareContent) return;

    // Remover botón y textarea existentes
    const existingButton = shareContent.querySelector('.share-submit-btn');
    if (existingButton) {
        existingButton.parentElement.remove();
    }

    const existingTextArea = shareContent.querySelector('.share-message-input');
    if (existingTextArea) {
        existingTextArea.parentElement.remove();
    }

    if (ViewerShareSystem.selectedUsers.size > 0) {
        // Agregar textarea para mensaje opcional
        const textAreaHTML = `
            <div style="padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <textarea 
                    id="shareMessageText"
                    class="share-message-input" 
                    placeholder="Agregar mensaje (opcional)..." 
                    style="
                        width: 100%;
                        background: rgba(37, 37, 50, 0.5);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 8px;
                        padding: 0.8rem;
                        color: white;
                        font-family: inherit;
                        font-size: 0.9rem;
                        resize: vertical;
                        min-height: 60px;
                        max-height: 120px;
                    "
                    maxlength="200"
                ></textarea>
                <div style="text-align: right; font-size: 0.8rem; color: #a0a0b8; margin-top: 0.3rem;">
                    <span id="shareMessageCounter">0</span>/200
                </div>
            </div>
        `;
        shareContent.insertAdjacentHTML('beforeend', textAreaHTML);
        
        // Agregar contador de caracteres
        const textArea = document.getElementById('shareMessageText');
        const counter = document.getElementById('shareMessageCounter');
        if (textArea && counter) {
            textArea.addEventListener('input', function() {
                counter.textContent = this.value.length;
            });
        }

        // Agregar botón de compartir
        const buttonHTML = `
            <div style="padding: 1rem;">
                <button class="share-submit-btn" onclick="submitShareFromViewer()" style="
                    width: 100%;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    📤 Compartir con ${ViewerShareSystem.selectedUsers.size} usuario${ViewerShareSystem.selectedUsers.size > 1 ? 's' : ''}
                </button>
            </div>
        `;
        shareContent.insertAdjacentHTML('beforeend', buttonHTML);
    }
}

async function submitShareFromViewer() {
    try {
        if (ViewerShareSystem.selectedUsers.size === 0) {
            showNotification('Selecciona al menos un usuario', 'error');
            return;
        }

        if (!ViewerShareSystem.currentViewerPost || !ViewerShareSystem.currentViewerPost.id) {
            showNotification('Error: No se encontró la publicación a compartir', 'error');
            return;
        }

        const button = document.querySelector('.share-submit-btn');
        const originalText = button.innerHTML;
        
        if (button) {
            button.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"><div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>Compartiendo...</div>';
            button.disabled = true;
        }

        const messageTextArea = document.getElementById('shareMessageText');
        const mensajeOpcional = messageTextArea ? messageTextArea.value.trim() : '';
        const usuariosDestino = Array.from(ViewerShareSystem.selectedUsers);
        const publicacionId = ViewerShareSystem.currentViewerPost.id;

        const response = await fetch('/php/api_chat.php?accion=compartir_publicacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                publicacion_id: publicacionId,
                usuarios_destino: usuariosDestino,
                mensaje: mensajeOpcional
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al compartir la publicación');
        }

        const nombreUsuarios = ViewerShareSystem.followedUsers
            .filter(user => ViewerShareSystem.selectedUsers.has(user.id))
            .map(user => `@${user.username}`)
            .join(', ');

        let mensajeExito = `Publicación compartida exitosamente con ${data.total_enviados} usuario${data.total_enviados > 1 ? 's' : ''}`;
        
        if (data.total_enviados > 0) {
            mensajeExito += `\n${nombreUsuarios}`;
        }

        if (data.total_fallidos > 0) {
            mensajeExito += `\n${data.total_fallidos} usuario${data.total_fallidos > 1 ? 's' : ''} no pudo${data.total_fallidos === 1 ? '' : 'ieron'} recibir el mensaje`;
        }

        showNotification(mensajeExito, 'success');

        // ============================================
        // INTEGRACIÓN CON SISTEMA DE CONTADORES
        // ============================================
        
        // 1. Actualizar contador en el viewer si existe
        if (window.simplePostViewer && window.simplePostViewer.updateShareCount) {
            window.simplePostViewer.updateShareCount(data.total_shares_publicacion || 0);
        }

        // 2. Actualizar contador en el feed si el post está visible
        setTimeout(() => {
            if (typeof window.fixShareCounterForPost === 'function') {
                window.fixShareCounterForPost(publicacionId);
            }
        }, 300);

        // 3. Cerrar modal
        setTimeout(() => {
            closeShareModalViewer();
        }, 1500);

    } catch (error) {
        console.error('Error al compartir publicación:', error);
        
        let errorMessage = 'Error al compartir la publicación';
        
        if (error.message.includes('Sesión')) {
            errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (error.message.includes('Usuario')) {
            errorMessage = 'Error: Algunos usuarios no pudieron recibir la publicación.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        showNotification(errorMessage, 'error');
        
        const button = document.querySelector('.share-submit-btn');
        if (button) {
            button.innerHTML = `Compartir con ${ViewerShareSystem.selectedUsers.size} usuario${ViewerShareSystem.selectedUsers.size > 1 ? 's' : ''}`;
            button.disabled = false;
        }
    }
}

function filterUsersViewer(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
        ViewerShareSystem.filteredUsers = [...ViewerShareSystem.followedUsers];
    } else {
        ViewerShareSystem.filteredUsers = ViewerShareSystem.followedUsers.filter(user => 
            user.username.toLowerCase().includes(term) ||
            user.display_name.toLowerCase().includes(term)
        );
    }
    
    renderFollowedUsersForViewer();
}

function closeShareModalViewer() {
    try {
        const modal = document.getElementById('shareModal');
        if (!modal) return;

        modal.classList.remove('active');
        // No restaurar overflow del body porque el viewer lo maneja
        
        // Limpiar estado
        setTimeout(() => {
            ViewerShareSystem.currentViewerPost = null;
            ViewerShareSystem.selectedUsers.clear();
            ViewerShareSystem.followedUsers = [];
            ViewerShareSystem.filteredUsers = [];
            
            // Limpiar contenido del modal
            const shareContent = document.querySelector('.share-content');
            if (shareContent) {
                const textAreaContainer = shareContent.querySelector('.share-message-input');
                if (textAreaContainer) {
                    textAreaContainer.parentElement.remove();
                }
                const button = shareContent.querySelector('.share-submit-btn');
                if (button) {
                    button.parentElement.remove();
                }
            }
        }, 300);

    } catch (error) {
        console.error('Error al cerrar modal de compartir:', error);
    }
}

// Estados de carga y error
function showLoadingStateShare() {
    const containerList = document.getElementById('mutualFollowersList');
    if (containerList) {
        containerList.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="width: 40px; height: 40px; border: 4px solid rgba(99, 102, 241, 0.3); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Cargando usuarios que sigues...</p>
            </div>
        `;
    }
}

function showErrorWithRetryViewer(errorMessage) {
    const containerList = document.getElementById('mutualFollowersList');
    if (containerList) {
        containerList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                <h3>Error al cargar usuarios seguidos</h3>
                <p style="color: var(--error); margin-bottom: 1rem;">${errorMessage}</p>
                <button onclick="retryLoadFollowedUsersViewer()" style="
                    padding: 0.8rem 1.5rem;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Reintentar</button>
            </div>
        `;
    }
}

function retryLoadFollowedUsersViewer() {
    loadFollowedUsersForViewer();
}

// Configurar buscador
function setupShareSearchViewer() {
    const searchInput = document.getElementById('shareSearch');
    if (searchInput) {
        // Remover listeners anteriores
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        
        // Agregar nuevo listener
        newSearchInput.addEventListener('input', function(e) {
            filterUsersViewer(e.target.value);
        });
    }
}

// Funciones auxiliares
function generateAvatarInitials(name) {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0][0] + (words[0][1] || '')).toUpperCase();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Configurar event listeners para el modal
function initializeViewerShareSystem() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        // Cerrar con click fuera
        shareModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShareModalViewer();
            }
        });
    }

    // Configurar buscador
    setupShareSearchViewer();

    // Listener para cerrar con ESC (solo si el viewer está activo)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const shareModal = document.getElementById('shareModal');
            const viewer = document.getElementById('simple-post-viewer');
            
            if (shareModal && shareModal.classList.contains('active') && 
                viewer && viewer.classList.contains('active')) {
                closeShareModalViewer();
            }
        }
    });

    console.log('✅ Sistema de compartir para viewer inicializado');
}

// Estilos adicionales
const viewerShareStyles = document.createElement('style');
viewerShareStyles.textContent = `
  /* ============================================
   ESTILOS COMPLETOS PARA MODAL DE COMPARTIR
   Reemplazar en viewerShareStyles.textContent
   ============================================ */

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100px);
    }
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ============================================
   MODAL CONTAINER
   ============================================ */
#shareModal.active {
    display: flex !important;
}

#shareModal .share-container {
    width: 90%;
    max-width: 480px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
}

/* ============================================
   HEADER DEL MODAL
   ============================================ */
#shareModal .share-header {
    padding: 0.5rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

#shareModal .share-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

#shareModal .close-share {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    color: #a0a0b8;
    font-size: 1.2rem;
}

#shareModal .close-share::before {
    content: '✕';
}

#shareModal .close-share:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    transform: rotate(90deg);
}

/* ============================================
   CONTENIDO DEL MODAL
   ============================================ */
#shareModal .share-content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

/* ============================================
   BUSCADOR
   ============================================ */
#shareModal .share-search {
    width: 78%;
    margin: 1rem;
    padding: 0.9rem 1rem 0.9rem 2.8rem;
    background: rgba(37, 37, 50, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #ffffff;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

#shareModal .share-search:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
    background: rgba(37, 37, 50, 0.8);
}

#shareModal .share-search::placeholder {
    color: #6b7280;
}

/* ============================================
   LISTA DE USUARIOS
   ============================================ */
#shareModal .mutual-followers-list,
#shareModal #mutualFollowersList {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

/* Scrollbar personalizado */
#shareModal .mutual-followers-list::-webkit-scrollbar,
#shareModal #mutualFollowersList::-webkit-scrollbar,
#shareModal .share-content::-webkit-scrollbar {
    width: 6px;
}

#shareModal .mutual-followers-list::-webkit-scrollbar-track,
#shareModal #mutualFollowersList::-webkit-scrollbar-track,
#shareModal .share-content::-webkit-scrollbar-track {
    background: rgba(37, 37, 50, 0.3);
    border-radius: 3px;
}

#shareModal .mutual-followers-list::-webkit-scrollbar-thumb,
#shareModal #mutualFollowersList::-webkit-scrollbar-thumb,
#shareModal .share-content::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #6366f1, #ec4899);
    border-radius: 3px;
}

#shareModal .mutual-followers-list::-webkit-scrollbar-thumb:hover,
#shareModal #mutualFollowersList::-webkit-scrollbar-thumb:hover,
#shareModal .share-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #8b5cf6, #f472b6);
}

/* ============================================
   ITEM DE USUARIO
   ============================================ */
.user-suggestion {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.8rem 1rem;
    background: rgba(37, 37, 50, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.user-suggestion:hover {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(99, 102, 241, 0.15);
}

.user-suggestion.selected {
    background: rgba(99, 102, 241, 0.2);
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

/* ============================================
   AVATAR DEL USUARIO
   ============================================ */
.suggestion-avatar {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    overflow: hidden;
    flex-shrink: 0;
}

.suggestion-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

/* ============================================
   INFO DEL USUARIO
   ============================================ */
.suggestion-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.suggestion-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.suggestion-name .verified-badge {
    color: #6366f1;
    font-size: 0.85rem;
    flex-shrink: 0;
}

.suggestion-username {
    font-size: 0.85rem;
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ============================================
   INDICADOR DE SELECCIÓN
   ============================================ */
.selection-indicator {
    width: 26px;
    height: 26px;
    min-width: 26px;
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: transparent;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.selection-indicator.selected {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-color: #6366f1;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
}

/* ============================================
   TEXTAREA DE MENSAJE
   ============================================ */
.share-message-input {
    width: 100% !important;
    box-sizing: border-box !important;
    background: rgba(37, 37, 50, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 10px !important;
    padding: 0.9rem !important;
    color: #ffffff !important;
    font-family: inherit !important;
    font-size: 0.9rem !important;
    resize: vertical !important;
    min-height: 70px !important;
    max-height: 120px !important;
    transition: all 0.3s ease !important;
}

.share-message-input:focus {
    outline: none !important;
    border-color: #6366f1 !important;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.25) !important;
    background: rgba(37, 37, 50, 0.8) !important;
}

.share-message-input::placeholder {
    color: #6b7280 !important;
}

/* ============================================
   BOTÓN DE COMPARTIR
   ============================================ */
.share-submit-btn {
    width: 100% !important;
    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
    color: white !important;
    border: none !important;
    padding: 1rem 2rem !important;
    border-radius: 12px !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.5rem !important;
}

.share-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4) !important;
    background: linear-gradient(135deg, #5558e3, #7c3aed) !important;
}

.share-submit-btn:active:not(:disabled) {
    transform: translateY(0) !important;
}

.share-submit-btn:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
    transform: none !important;
}

/* ============================================
   ESTADOS VACÍOS Y CARGA
   ============================================ */
#shareModal .empty-followers,
#mutualFollowersList > div[style*="text-align: center"] {
    text-align: center;
    padding: 2.5rem 1.5rem;
    color: #9ca3af;
}

#mutualFollowersList > div[style*="text-align: center"] h3 {
    color: #ffffff;
    font-size: 1.1rem;
    margin: 0.5rem 0;
}

#mutualFollowersList > div[style*="text-align: center"] p {
    color: #9ca3af;
    font-size: 0.9rem;
    margin: 0;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 480px) {
    #shareModal .share-container {
        width: 95%;
        max-height: 90vh;
        margin: 0.5rem;
    }
    
    #shareModal .share-header {
        padding: 1rem;
    }
    
    #shareModal .share-title {
        font-size: 1.1rem;
    }
    
    #shareModal .share-search {
        margin: 0.75rem;
        width: calc(100% - 1.5rem);
        padding: 0.8rem 1rem;
        font-size: 0.9rem;
    }
    
    .user-suggestion {
        padding: 0.7rem 0.8rem;
        gap: 0.7rem;
    }
    
    .suggestion-avatar {
        width: 42px;
        height: 42px;
        min-width: 42px;
        font-size: 1rem;
    }
    
    .suggestion-name {
        font-size: 0.9rem;
    }
    
    .suggestion-username {
        font-size: 0.8rem;
    }
    
    .selection-indicator {
        width: 24px;
        height: 24px;
        min-width: 24px;
    }
    
    .share-submit-btn {
        padding: 0.9rem 1.5rem !important;
        font-size: 0.95rem !important;
    }
}
`;
document.head.appendChild(viewerShareStyles);

// Inicializar cuando el documento esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeViewerShareSystem);
} else {
    initializeViewerShareSystem();
}

// ============================================
// EXTENSIÓN: Actualizar contador de shares en el viewer
// ============================================
(function() {
    function addUpdateMethod() {
        if (typeof window.simplePostViewer !== 'undefined') {
            window.simplePostViewer.updateShareCount = function(newCount) {
                const shareButton = document.querySelector('#simple-post-viewer .fsv-share-btn, #simple-post-viewer button[data-action="share"]');
                
                if (shareButton) {
                    const countSpan = shareButton.querySelector('.fsv-share-count');
                    
                    if (countSpan) {
                        const formattedCount = newCount < 1000 ? newCount.toString() : 
                                              newCount < 1000000 ? (newCount / 1000).toFixed(1).replace('.0', '') + 'K' :
                                              (newCount / 1000000).toFixed(1).replace('.0', '') + 'M';
                        
                        countSpan.textContent = formattedCount;
                        shareButton.dataset.shareCount = newCount;
                    }
                }
                
                if (this.currentStats) {
                    if (!this.currentStats.stats) {
                        this.currentStats.stats = {};
                    }
                    this.currentStats.stats.shares_count = newCount;
                    this.currentStats.shares_count = newCount;
                }
            };
            
            return true;
        }
        return false;
    }

    if (!addUpdateMethod()) {
        const interval = setInterval(() => {
            if (addUpdateMethod()) {
                clearInterval(interval);
            }
        }, 100);
        
        setTimeout(() => clearInterval(interval), 5000);
    }
})();

// ============================================
// Hook para cargar contador al abrir el viewer
// ============================================
(function() {
    function hookViewerOpen() {
        if (typeof window.simplePostViewer !== 'undefined') {
            const originalOpen = window.simplePostViewer.openViewer || window.simplePostViewer.open;
            
            if (originalOpen) {
                window.simplePostViewer.openViewer = window.simplePostViewer.open = async function(postData) {
                    const result = originalOpen.call(this, postData);
                    
                    if (postData && postData.id) {
                        setTimeout(async () => {
                            try {
                                const response = await fetch(`/php/api_chat.php?accion=obtener_estadisticas_publicacion&publicacion_id=${postData.id}`, {
                                    method: 'GET',
                                    credentials: 'include'
                                });
                                
                                if (response.ok) {
                                    const data = await response.json();
                                    if (data.success && data.publicacion?.stats) {
                                        this.updateShareCount(data.publicacion.stats.shares_count || 0);
                                    }
                                }
                            } catch (error) {
                                console.error('Error cargando estadísticas:', error);
                            }
                        }, 300);
                    }
                    
                    return result;
                };
                return true;
            }
        }
        return false;
    }

    if (!hookViewerOpen()) {
        const interval = setInterval(() => {
            if (hookViewerOpen()) {
                clearInterval(interval);
            }
        }, 100);
        
        setTimeout(() => clearInterval(interval), 5000);
    }
})();

// Hacer funciones globales
window.closeShareModalViewer = closeShareModalViewer;
window.toggleUserSelectionViewer = toggleUserSelectionViewer;
window.submitShareFromViewer = submitShareFromViewer;
window.retryLoadFollowedUsersViewer = retryLoadFollowedUsersViewer;
window.closeShareModal = closeShareModalViewer;

console.log('✅ Sistema de compartir para SimplePostViewer cargado completamente');