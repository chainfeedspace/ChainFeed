// ============================================
// SISTEMA UNIFICADO DE COMPARTIR
// Posts normales + Eventos Chain en un solo lugar
// ============================================

(function() {
    'use strict';
    
    console.log('🚀 Inicializando sistema unificado de compartir...');
    
    // ============================================
    // SHARESYSTEM GLOBAL ÚNICO
    // ============================================
    
    window.ShareSystem = {
        currentPost: null,
        selectedUsers: new Set(),
        followedUsers: [],
        filteredUsers: [],
        isLoading: false
    };
    
    console.log('✅ ShareSystem global creado:', window.ShareSystem);
    
    // ============================================
    // FUNCIÓN PRINCIPAL: ABRIR MODAL DE COMPARTIR
    // ============================================
    
    window.openShareModal = async function(element) {
        try {
            console.log('📤 openShareModal llamado, elemento:', element);
            
            // Detectar tipo de contenido
            const isChainEvent = element?.dataset?.shareType === 'chain-event';
            
            if (isChainEvent) {
                // Evento Chain
                console.log('⚡ Detectado: Evento Chain');
                window.ShareSystem.currentPost = {
                    type: 'chain-event',
                    id: element.dataset.shareId,
                    data: window.currentShareItem
                };
            } else {
                // Post normal
                console.log('📝 Detectado: Post normal');
                
                let postCard = element.closest('.post-card');
                
                if (!postCard) {
                    postCard = element.closest('.card');
                }
                
                if (!postCard) {
                    postCard = element.closest('[data-post-id]');
                }
                
                if (!postCard) {
                    let parent = element.parentElement;
                    while (parent && !parent.classList.contains('post-card')) {
                        parent = parent.parentElement;
                        if (parent === document.body) break;
                    }
                    postCard = parent;
                }
                
                if (!postCard) {
                    console.error('❌ No se encontró contenedor de post');
                    showNotification('Error: No se pudo identificar la publicación', 'error');
                    return;
                }
                
                let postDataId = postCard.dataset.postId;
                
                if (!postDataId) {
                    postDataId = postCard.id;
                }
                
                if (!postDataId) {
                    const postIdElement = postCard.querySelector('[data-post-id]');
                    if (postIdElement) {
                        postDataId = postIdElement.dataset.postId;
                    }
                }
                
                let postId = null;
                if (postDataId) {
                    if (postDataId.startsWith('post-')) {
                        postId = postDataId.replace('post-', '');
                    } else if (postDataId.startsWith('card-')) {
                        postId = postDataId.replace('card-', '');
                    } else {
                        postId = postDataId;
                    }
                }
                
                if (!postId || isNaN(postId)) {
                    console.error('❌ ID de publicación no encontrado o inválido:', {
                        postDataId,
                        postId,
                        postCard
                    });
                    showNotification('Error: No se pudo identificar la publicación', 'error');
                    return;
                }
                
                console.log('✅ Post identificado:', {
                    postDataId,
                    postId: parseInt(postId)
                });
                
                window.ShareSystem.currentPost = {
                    type: 'post',
                    id: parseInt(postId),
                    element: postCard,
                    htmlId: postDataId || `post-${postId}`
                };
            }
            
            console.log('✅ ShareSystem.currentPost configurado:', window.ShareSystem.currentPost);
            
            // Abrir modal
            const modal = document.getElementById('shareModal');
            if (!modal) {
                showNotification('Error: Modal de compartir no encontrado', 'error');
                return;
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Actualizar título del modal
            const modalTitle = modal.querySelector('.share-title');
            if (modalTitle) {
                modalTitle.textContent = isChainEvent ? '📤 Compartir Evento Chain' : '📤 Compartir Post';
            }

            // Limpiar textareas residuales de compartidos anteriores
const shareContent = modal.querySelector('.share-content');
if (shareContent) {
    // Eliminar todos los textareas que puedan existir de posts anteriores
    const oldTextareas = shareContent.querySelectorAll('.share-message-input');
    oldTextareas.forEach(textarea => {
        if (textarea.parentElement) {
            textarea.parentElement.remove();
        }
    });
    
    // Eliminar botones de compartir anteriores
    const oldButtons = shareContent.querySelectorAll('.share-submit-btn');
    oldButtons.forEach(button => {
        if (button.parentElement) {
            button.parentElement.remove();
        }
    });
    
    console.log('🧹 Modal limpiado de elementos residuales');
}
            
            // Cargar usuarios seguidos
            await loadFollowedUsers();
            
            // Focus en buscador
            setTimeout(() => {
                const searchInput = document.getElementById('shareSearch');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
            
        } catch (error) {
            console.error('❌ Error al abrir modal de compartir:', error);
            showNotification('Error al abrir modal de compartir: ' + error.message, 'error');
        }
    };
    
    // ============================================
    // CARGAR USUARIOS SEGUIDOS
    // ============================================
    
    async function loadFollowedUsers() {
        try {
            window.ShareSystem.isLoading = true;
            showLoadingStateShare();
            
            // Obtener usuario actual de múltiples fuentes
            let currentUsername = null;
            
            if (window.CHAINFEED_CONFIG?.currentUser?.username) {
                currentUsername = window.CHAINFEED_CONFIG.currentUser.username;
                console.log('Usuario obtenido de CHAINFEED_CONFIG:', currentUsername);
            } else if (window.CommentsSystem?.currentUser?.username) {
                currentUsername = window.CommentsSystem.currentUser.username;
                console.log('Usuario obtenido de CommentsSystem:', currentUsername);
            } else {
                console.log('Obteniendo usuario desde verificar_sesion.php...');
                const sessionResponse = await fetch('/php/verificar_sesion.php', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (sessionResponse.ok) {
                    const sessionData = await sessionResponse.json();
                    if (sessionData.success && sessionData.user?.username) {
                        currentUsername = sessionData.user.username;
                        console.log('Usuario obtenido de sesión:', currentUsername);
                    }
                }
            }
            
            if (!currentUsername) {
                throw new Error('No se pudo obtener el usuario actual');
            }
            
            console.log('🔍 Cargando usuarios seguidos para:', currentUsername);
            
            const response = await fetch('/php/obtener_listas_seguimiento.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: currentUsername,
                    tipo: 'mutuos',
                    limite: 50,
                    offset: 0
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Error al cargar usuarios seguidos');
            }
            
            // Guardar usuarios seguidos en ShareSystem
            window.ShareSystem.followedUsers = data.data.usuarios;
            window.ShareSystem.filteredUsers = [...window.ShareSystem.followedUsers];
            
            console.log(`✅ Usuarios seguidos cargados: ${window.ShareSystem.followedUsers.length}`);
            
            renderFollowedUsers();
            
        } catch (error) {
            console.error('Error cargando usuarios seguidos:', error);
            showNotification(`Error al cargar usuarios: ${error.message}`, 'error');
            showErrorWithRetry(error.message);
        } finally {
            window.ShareSystem.isLoading = false;
        }
    }
    
    // ============================================
    // RENDERIZAR USUARIOS SEGUIDOS
    // ============================================
    
    function renderFollowedUsers() {
        const containerList = document.getElementById('mutualFollowersList');
        if (!containerList) {
            console.warn('⚠️ No se encontró mutualFollowersList');
            return;
        }
        
        console.log('🎨 Renderizando usuarios:', window.ShareSystem.filteredUsers.length);
        
        if (window.ShareSystem.filteredUsers.length === 0) {
containerList.innerHTML = `
    <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
        <div style="font-size: 2rem; margin-bottom: 1rem;">👥</div>
        <h3>No tienes seguidos mutuos</h3>
        <p>Los seguidos mutuos son usuarios que tú sigues y que te siguen de vuelta</p>
    </div>
`;
            return;
        }
        
        let usersHTML = '';
        
        window.ShareSystem.filteredUsers.forEach(user => {
            const isSelected = window.ShareSystem.selectedUsers.has(user.id);
            const avatarHTML = user.avatar_url 
                ? `<img src="${user.avatar_url}" alt="${user.username}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(user.username)}';">`
                : generateAvatarInitials(user.username);
            
            usersHTML += `
                <div class="user-suggestion ${isSelected ? 'selected' : ''}" 
                     onclick="toggleUserSelection(${user.id})" 
                     data-user-id="${user.id}">
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
        
        // Actualizar botón de compartir
        window.updateShareButton();
        
        console.log('✅ Usuarios renderizados');
    }
    
    // ============================================
    // TOGGLE SELECCIÓN DE USUARIO
    // ============================================
    
    window.toggleUserSelection = function(userId) {
        console.log('👤 Toggle usuario:', userId);
        
        // Toggle en el Set
        if (window.ShareSystem.selectedUsers.has(userId)) {
            window.ShareSystem.selectedUsers.delete(userId);
        } else {
            window.ShareSystem.selectedUsers.add(userId);
        }
        
        console.log('📊 Total seleccionados:', window.ShareSystem.selectedUsers.size);
        console.log('📦 Set de usuarios:', Array.from(window.ShareSystem.selectedUsers));
        
        // Actualizar UI del elemento
        const userElement = document.querySelector(`[data-user-id="${userId}"]`);
        if (userElement) {
            const isSelected = window.ShareSystem.selectedUsers.has(userId);
            userElement.classList.toggle('selected', isSelected);
            
            const indicator = userElement.querySelector('.selection-indicator');
            if (indicator) {
                indicator.classList.toggle('selected', isSelected);
                indicator.textContent = isSelected ? '✓' : '';
            }
        }
        
        // Actualizar botón de compartir
        window.updateShareButton();
    };
    
    // ============================================
    // ACTUALIZAR BOTÓN DE COMPARTIR
    // ============================================
    
    window.updateShareButton = function() {
        const shareContent = document.querySelector('.share-content');
        if (!shareContent) {
            console.error('❌ No se encontró .share-content');
            return;
        }
        
        const selectedCount = window.ShareSystem.selectedUsers.size;
        
        console.log('🔄 updateShareButton - Usuarios seleccionados:', selectedCount);
        console.log('🔍 ShareSystem.currentPost:', window.ShareSystem.currentPost);
        
        const isChainEvent = window.ShareSystem.currentPost?.type === 'chain-event';
        console.log('⚡ Es evento chain:', isChainEvent);
        
        // Remover botón y textarea existentes
        const existingButton = shareContent.querySelector('.share-submit-btn');
        if (existingButton) {
            existingButton.parentElement.remove();
        }
        
        const existingTextArea = shareContent.querySelector('.share-message-input');
        if (existingTextArea) {
            existingTextArea.parentElement.remove();
        }
        
       if (selectedCount === 0) {
    console.log('ℹ️ Sin usuarios seleccionados, no se muestra botón');
    return;
}

// Solo agregar textarea para POSTS NORMALES, NO para eventos chain
if (!isChainEvent) {
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
    
    console.log('✅ Textarea agregado (solo para posts normales)');
    
    // Agregar contador de caracteres
    const textArea = document.getElementById('shareMessageText');
    const counter = document.getElementById('shareMessageCounter');
    if (textArea && counter) {
        textArea.addEventListener('input', function() {
            counter.textContent = this.value.length;
        });
    }
} else {
    console.log('⚡ Evento chain detectado - NO se crea textarea genérico');
}

// Agregar botón de compartir
const buttonHTML = `
            <div style="padding: 1rem;">
                <button class="share-submit-btn" onclick="submitShare()" style="
                    width: 100%;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                ">
                    📤 Compartir con ${selectedCount} usuario${selectedCount > 1 ? 's' : ''}
                </button>
            </div>
        `;
        
        shareContent.insertAdjacentHTML('beforeend', buttonHTML);
        
        console.log('✅ Botón de compartir agregado');
    };
    
    // ============================================
    // CERRAR MODAL
    // ============================================
    
    window.closeShareModal = function() {
        try {
            const modal = document.getElementById('shareModal');
            if (!modal) return;
            
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            console.log('🚪 Cerrando modal...');
            
            setTimeout(() => {
                if (!modal.classList.contains('active')) {
                    console.log('🧹 Limpiando ShareSystem');
                    window.ShareSystem.currentPost = null;
                    window.ShareSystem.selectedUsers.clear();
                    window.ShareSystem.followedUsers = [];
                    window.ShareSystem.filteredUsers = [];
                    
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
                }
            }, 500);
            
        } catch (error) {
            console.error('Error al cerrar modal:', error);
        }
    };
    
    // ============================================
    // FILTRAR USUARIOS POR BÚSQUEDA
    // ============================================
    
    window.filterUsers = function(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            window.ShareSystem.filteredUsers = [...window.ShareSystem.followedUsers];
        } else {
            window.ShareSystem.filteredUsers = window.ShareSystem.followedUsers.filter(user => 
                user.username.toLowerCase().includes(term) ||
                user.display_name.toLowerCase().includes(term)
            );
        }
        
        renderFollowedUsers();
    };
    
    // ============================================
    // ESTADOS DE CARGA Y ERROR
    // ============================================
    
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
    
    function showErrorWithRetry(errorMessage) {
        const containerList = document.getElementById('mutualFollowersList');
        if (containerList) {
            containerList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Error al cargar usuarios seguidos</h3>
                    <p style="color: var(--error); margin-bottom: 1rem;">${errorMessage}</p>
                    <button onclick="window.openShareModal(document.querySelector('.post-card'))" style="
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
    
// ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    
    function generateAvatarInitials(username) {
        if (!username) return 'U';
        return username.substring(0, 2).toUpperCase();
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    function showNotification(message, type = 'info') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    
// ============================================
// INICIALIZACIÓN
// ============================================

function initializeShareSystem() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShareModal();
            }
        });
    }
    
    // ✅ LISTENER DEL BUSCADOR CON DELEGACIÓN DE EVENTOS
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'shareSearch') {
            console.log('🔍 Buscando:', e.target.value);
            window.filterUsers(e.target.value);
        }
    });
    
    // Listener para cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const shareModal = document.getElementById('shareModal');
            if (shareModal && shareModal.classList.contains('active')) {
                closeShareModal();
            }
        }
    });
    
    console.log('✅ Sistema de compartir inicializado');
}
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShareSystem);
    } else {
        initializeShareSystem();
    }
    
    // ============================================
    // ESTILOS CSS
    // ============================================
    
    const shareStyles = document.createElement('style');
    shareStyles.textContent = `
        .user-suggestion.selected {
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid var(--primary);
        }
        
        .selection-indicator {
            width: 24px;
            height: 24px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .selection-indicator.selected {
            background: var(--primary);
            border-color: var(--primary);
            color: white;
        }
        
        .user-suggestion {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .user-suggestion:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(99, 102, 241, 0.2);
        }
        
        .share-submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
        }
        
        .share-submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .share-message-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(shareStyles);
    
    const originalSubmitShare = window.submitShare;

    // Función fallback para actualizar contador si share-counter-realtime.js no está cargado
    async function actualizarContadorManual(postId) {
        try {
            const response = await fetch(`/php/api_chat.php?accion=obtener_estadisticas_publicacion&publicacion_id=${postId}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.publicacion && data.publicacion.stats) {
                    const shareCount = data.publicacion.stats.shares_count || 0;
                    
                    // Buscar el post en el DOM
                    const postSelectors = [
                        `[data-post-id="post-${postId}"]`,
                        `[data-post-id="${postId}"]`,
                        `#post-${postId}`
                    ];
                    
                    let postElement = null;
                    for (const selector of postSelectors) {
                        postElement = document.querySelector(selector);
                        if (postElement) break;
                    }
                    
                    if (postElement) {
                        const shareButton = postElement.querySelector('button[onclick*="openShareModal"]');
                        if (shareButton) {
                            const svg = shareButton.querySelector('svg');
                            if (svg) {
                                shareButton.innerHTML = svg.outerHTML + '\n                ' + shareCount;
                            } else {
                                shareButton.textContent = shareCount;
                            }
                            console.log(`✅ Contador actualizado: ${shareCount} shares`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error actualizando contador manual:', error);
        }
    }
    
    console.log('✅ Sistema de actualización automática de shares integrado');
    
    // ============================================
    // FIX: SOBRESCRIBIR submitShare CON SINCRONIZACIÓN CORRECTA
    // ============================================
    
    // Guardar la función original
    const originalSubmitShareFunc = window.submitShare;
    
    window.submitShare = async function() {
        try {
            console.log('🚀 submitShare con sincronización mejorada');
            
            if (window.ShareSystem.selectedUsers.size === 0) {
                showNotification('Selecciona al menos un usuario', 'error');
                return;
            }
            
            if (!window.ShareSystem.currentPost || !window.ShareSystem.currentPost.id) {
                showNotification('Error: No se encontró el contenido a compartir', 'error');
                return;
            }
            
            const button = document.querySelector('.share-submit-btn');
            const originalText = button?.innerHTML || '';
            
            if (button) {
                button.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"><div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>Compartiendo...</div>';
                button.disabled = true;
            }
            
            const messageTextArea = document.getElementById('shareMessageText');
            const mensajeOpcional = messageTextArea ? messageTextArea.value.trim() : '';
            const usuariosDestino = Array.from(window.ShareSystem.selectedUsers);
            const postId = window.ShareSystem.currentPost.id;
            const isChainEvent = window.ShareSystem.currentPost.type === 'chain-event';
            
            console.log('📤 Compartiendo:', {
                postId,
                usuariosDestino,
                totalUsuarios: usuariosDestino.length
            });
            
            let response;
            
            if (isChainEvent) {
                response = await fetch('php/api_chat.php?accion=compartir_evento_chain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        evento_id: postId,
                        usuarios_destino: usuariosDestino,
                        mensaje: mensajeOpcional
                    })
                });
            } else {
                response = await fetch('php/api_chat.php?accion=compartir_publicacion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        publicacion_id: postId,
                        usuarios_destino: usuariosDestino,
                        mensaje: mensajeOpcional
                    })
                });
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Error al compartir');
            }
            
            console.log('✅ Compartir exitoso, obteniendo contador actualizado...');
            
            // ============================================
            // ✅ OBTENER NUEVO CONTADOR DESDE EL SERVIDOR
            // ============================================
            
            const statsResponse = await fetch(`/php/api_chat.php?accion=obtener_estadisticas_publicacion&publicacion_id=${postId}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                credentials: 'include'
            });
            
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                
                if (statsData.success && statsData.publicacion && statsData.publicacion.stats) {
                    const newShareCount = statsData.publicacion.stats.shares_count || 0;
                    
                    console.log(`✅ Nuevo contador: ${newShareCount} shares`);
                    
                    // ============================================
                    // ACTUALIZAR POST ORIGINAL EN EL FEED
                    // ============================================
                    
                    const postSelectors = [
                        `[data-post-id="post-${postId}"]`,
                        `[data-post-id="${postId}"]`,
                        `#post-${postId}`
                    ];
                    
                    let postElement = null;
                    for (const selector of postSelectors) {
                        postElement = document.querySelector(selector);
                        if (postElement) {
                            console.log(`✅ Post encontrado: ${selector}`);
                            break;
                        }
                    }
                    
                    if (postElement) {
                        const shareButton = postElement.querySelector('button[onclick*="openShareModal"]');
                        if (shareButton) {
                            const svg = shareButton.querySelector('svg');
                            if (svg) {
                                shareButton.innerHTML = svg.outerHTML + '\n                ' + newShareCount;
                            } else {
                                shareButton.textContent = newShareCount;
                            }
                            shareButton.setAttribute('data-share-count', newShareCount);
                            
                            console.log(`✅ Post actualizado: ${newShareCount} shares`);
                        }
                    }
                

// ACTUALIZAR FULLSCREEN VIEWER SI ESTÁ ABIERTO
const viewerContainer = window.fullscreenViewer?.viewerContainer;
const isViewerOpen = viewerContainer && 
                     viewerContainer.classList.contains('active') &&
                     window.getComputedStyle(viewerContainer).display !== 'none';

console.log('🔍 Verificando viewer:', {
    existe: !!viewerContainer,
    tieneActive: viewerContainer?.classList.contains('active'),
    display: viewerContainer ? window.getComputedStyle(viewerContainer).display : 'N/A',
    estaAbierto: isViewerOpen
});

if (isViewerOpen) {
    console.log('🎯 Viewer ESTÁ ABIERTO, actualizando contador...');
    
    const viewerShareBtn = viewerContainer.querySelector('.fsv-share-btn');
    if (viewerShareBtn) {
        console.log('📍 Botón encontrado en viewer');
        console.log('📊 Contador ANTES de actualizar:', viewerShareBtn.querySelector('.fsv-share-count')?.textContent);
        
        // ✅ MÉTODO 1: Actualizar el span interno
        const viewerShareCount = viewerShareBtn.querySelector('.fsv-share-count');
        if (viewerShareCount) {
            console.log('📝 Actualizando span de', viewerShareCount.textContent, 'a', newShareCount);
            viewerShareCount.textContent = newShareCount;
        } else {
            console.warn('⚠️ Span .fsv-share-count NO encontrado');
        }
        
        // ✅ MÉTODO 2: Actualizar data-attribute
        viewerShareBtn.setAttribute('data-share-count', newShareCount);
        
        // ✅ MÉTODO 3: Forzar repaint visual
        viewerShareBtn.style.display = 'none';
        viewerShareBtn.offsetHeight; // Trigger reflow
        viewerShareBtn.style.display = '';
        
        // ✅ MÉTODO 4: Reconstruir HTML del botón (más agresivo)
        const svg = viewerShareBtn.querySelector('svg');
        if (svg) {
            const svgClone = svg.cloneNode(true);
            viewerShareBtn.innerHTML = '';
            viewerShareBtn.appendChild(svgClone);
            
            const newSpan = document.createElement('span');
            newSpan.className = 'fsv-share-count';
            newSpan.textContent = newShareCount;
            viewerShareBtn.appendChild(newSpan);
            
            console.log('🔨 HTML del botón reconstruido completamente');
        }
        
        console.log('📊 Contador DESPUÉS de actualizar:', viewerShareBtn.querySelector('.fsv-share-count')?.textContent);
        console.log('📦 HTML final:', viewerShareBtn.innerHTML);
        
        // Efecto visual de confirmación
        viewerShareBtn.style.transition = 'all 0.3s ease';
        viewerShareBtn.style.transform = 'scale(1.15)';
        viewerShareBtn.style.background = 'rgba(16, 185, 129, 0.3)';
        viewerShareBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
        
        setTimeout(() => {
            viewerShareBtn.style.transform = 'scale(1)';
            viewerShareBtn.style.background = '';
            viewerShareBtn.style.boxShadow = '';
        }, 500);
        
        // ✅ MÉTODO 5: Actualizar también el post dentro del viewer
        const currentViewerPost = window.fullscreenViewer.posts?.[window.fullscreenViewer.currentIndex];
        if (currentViewerPost) {
            console.log('📝 Actualizando post dentro del viewer...');
            const postShareBtn = currentViewerPost.querySelector('[onclick*="openShareModal"]');
            if (postShareBtn) {
                const postSvg = postShareBtn.querySelector('svg');
                if (postSvg) {
                    postShareBtn.innerHTML = postSvg.outerHTML + '\n                ' + newShareCount;
                } else {
                    postShareBtn.textContent = newShareCount;
                }
                postShareBtn.setAttribute('data-share-count', newShareCount);
                console.log('✅ Post dentro del viewer actualizado');
            }
        }
        
        console.log('✅ Viewer actualizado exitosamente:', newShareCount, 'shares');
        
    } else {
        console.error('❌ Botón .fsv-share-btn NO encontrado en el viewer');
        console.log('📦 Estructura del viewerContainer:');
        console.log(viewerContainer.innerHTML.substring(0, 1000));
    }
    
    // ✅ MÉTODO 6: Forzar actualización del adapter
    if (window.fullscreenPostAdapter?.updateAdaptedPostStats) {
        console.log('🔄 Forzando actualización del adapter...');
        setTimeout(() => {
            const currentPost = window.fullscreenViewer.posts?.[window.fullscreenViewer.currentIndex];
            if (currentPost) {
                window.fullscreenPostAdapter.updateAdaptedPostStats(
                    currentPost, 
                    window.fullscreenPostAdapter.detectPostType(currentPost)
                );
                console.log('✅ Adapter actualizado');
            }
        }, 100);
    }
    
} else {
    console.log('ℹ️ Viewer NO está abierto');
    console.log('   - Viewer existe:', !!viewerContainer);
    if (viewerContainer) {
        console.log('   - Tiene clase active:', viewerContainer.classList.contains('active'));
        console.log('   - Display CSS:', window.getComputedStyle(viewerContainer).display);
        console.log('   - Clases:', Array.from(viewerContainer.classList));
    }
}
                    
                } else {
                    console.warn('⚠️ No se pudieron obtener estadísticas actualizadas');
                }
            } else {
                console.error('❌ Error al obtener estadísticas:', statsResponse.status);
            }
            
            // Notificación de éxito
            const nombreUsuarios = window.ShareSystem.followedUsers
                .filter(user => window.ShareSystem.selectedUsers.has(user.id))
                .map(user => `@${user.username}`)
                .join(', ');
            
            const tipoContenido = isChainEvent ? 'Evento' : 'Publicación';
            const totalEnviados = data.estadisticas?.total_enviados || data.total_enviados || 0;
            
            showNotification(`📤 ${tipoContenido} compartid${isChainEvent ? 'o' : 'a'} con ${totalEnviados} usuario${totalEnviados > 1 ? 's' : ''}`, 'success');
            
            setTimeout(() => {
                closeShareModal();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Error al compartir:', error);
            
            let errorMessage = 'Error al compartir';
            if (error.message.includes('Sesión')) {
                errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showNotification(errorMessage, 'error');
            
            const button = document.querySelector('.share-submit-btn');
            if (button) {
                button.innerHTML = `📤 Compartir con ${window.ShareSystem.selectedUsers.size} usuario${window.ShareSystem.selectedUsers.size > 1 ? 's' : ''}`;
                button.disabled = false;
            }
        }
    };
    
    console.log('✅ Sistema de compartir con sincronización de contador mejorado cargado');
    
})();