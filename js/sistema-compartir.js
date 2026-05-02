// ============================================
// SISTEMA DE COMPARTIR INTEGRADO CON CHAT
// ============================================

// Usar el ShareSystem existente y agregar propiedades necesarias
if (typeof ShareSystem !== 'undefined') {
    console.log('✅ ShareSystem ya existe, extendiendo...');
    // NO sobrescribir, solo agregar propiedades faltantes
    ShareSystem.followedUsers = ShareSystem.followedUsers || [];
    ShareSystem.filteredUsers = ShareSystem.filteredUsers || [];
    ShareSystem.isLoading = ShareSystem.isLoading || false;
} else {
    console.log('🆕 Creando nuevo ShareSystem');
    // Si no existe, crear uno nuevo
    window.ShareSystem = {
        currentPost: null,
        selectedUsers: new Set(),
        followedUsers: [],
        filteredUsers: [],
        isLoading: false
    };
}

console.log('📦 ShareSystem inicializado:', window.ShareSystem);

// Sobrescribir la función openShareModal para soportar múltiples tipos de elementos
window.openShareModal = async function(element) {
    try {
        console.log('🔍 openShareModal llamado, elemento:', element);
        
        // ============================================
        // DETECTAR TIPO DE CONTENIDO A COMPARTIR
        // ============================================
        
        // CASO 1: Es un evento Chain (tiene dataset.shareType)
        const isChainEvent = element?.dataset?.shareType === 'chain-event';
        
        if (isChainEvent) {
            console.log('📦 Detectado: Evento Chain');
            ShareSystem.currentPost = {
                type: 'chain-event',
                id: element.dataset.shareId,
                data: window.currentShareItem
            };
        } 
        // CASO 2: Es un POST NORMAL
        else {
            console.log('📝 Detectado: Post normal');
            
            // Buscar el contenedor del post con múltiples estrategias
            let postCard = element.closest('.post-card');
            
            if (!postCard) {
                postCard = element.closest('.card');
            }
            
            if (!postCard) {
                postCard = element.closest('[data-post-id]');
            }
            
            if (!postCard) {
                // Último intento: buscar el post-card padre navegando por el DOM
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

            // Extraer el ID del post
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

            // Limpiar el ID (remover prefijos como "post-" o "card-")
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

            // Validar que el ID sea válido
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

            ShareSystem.currentPost = {
                type: 'post',
                id: parseInt(postId),
                element: postCard,
                htmlId: postDataId || `post-${postId}`
            };
        }

        // ============================================
        // ABRIR MODAL DE COMPARTIR
        // ============================================
        
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

        // Mostrar/ocultar sección de WhatsApp (solo para Chain)
        const whatsappSection = document.getElementById('whatsappShareSection');
        if (whatsappSection) {
            whatsappSection.style.display = isChainEvent ? 'block' : 'none';
        }

        console.log('✅ ShareSystem configurado:', ShareSystem.currentPost);

        await loadFollowedUsers();

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

// Función auxiliar para detectar automáticamente el contenedor y ID del post
function detectPostInfo(element) {
    const selectors = [
        { container: '.post-card', idAttr: 'data-post-id' },
        { container: '.card', idAttr: 'data-post-id' },
        { container: '.post', idAttr: 'data-post-id' },
        { container: '[data-post-id]', idAttr: 'data-post-id' }
    ];

    for (const selector of selectors) {
        const container = element.closest(selector.container);
        if (container) {
            const postId = container.getAttribute(selector.idAttr) || container.id;
            if (postId) {
                return { container, postId };
            }
        }
    }

    return null;
}

// Cargar usuarios que sigue el usuario actual
async function loadFollowedUsers() {
    try {
        ShareSystem.isLoading = true;
        showLoadingStateShare();

        // Obtener el username del usuario actual
        const currentUsername = CHAINFEED_CONFIG.currentUser || CommentsSystem.currentUser?.username;

        if (!currentUsername) {
            throw new Error('No se pudo obtener el usuario actual');
        }

        const response = await fetch('php/obtener_listas_seguimiento.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: currentUsername,
                tipo: 'seguidos', // Obtener usuarios que sigue
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

        // Guardar usuarios seguidos
        ShareSystem.followedUsers = data.data.usuarios;
        ShareSystem.filteredUsers = [...ShareSystem.followedUsers];

        renderFollowedUsers();

        console.log(`Usuarios seguidos cargados: ${ShareSystem.followedUsers.length}`);

    } catch (error) {
        console.error('Error cargando usuarios seguidos:', error);
        showNotification(`Error al cargar usuarios: ${error.message}`, 'error');
        showErrorWithRetry(error.message);
    } finally {
        ShareSystem.isLoading = false;
    }
}

function renderFollowedUsers() {
    const containerList = document.getElementById('mutualFollowersList');
    if (!containerList) return;

    if (ShareSystem.filteredUsers.length === 0) {
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

    ShareSystem.filteredUsers.forEach(user => {
        const isSelected = ShareSystem.selectedUsers.has(user.id);
        const avatarHTML = user.avatar_url 
            ? `<img src="${user.avatar_url}" alt="${user.username}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(user.username)}';">`
            : generateAvatarInitials(user.username);

        usersHTML += `
            <div class="user-suggestion ${isSelected ? 'selected' : ''}" onclick="toggleUserSelection(${user.id})" data-user-id="${user.id}">
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

    // ✅ CRÍTICO: Mostrar botón de compartir si hay usuarios seleccionados
    updateShareButton();
    
    console.log('✅ renderFollowedUsers completado, usuarios renderizados:', ShareSystem.filteredUsers.length);
}

// Actualizar botón de compartir
function updateShareButton() {
    const shareContent = document.querySelector('.share-content');
    if (!shareContent) {
        console.error('❌ No se encontró .share-content');
        return;
    }

    console.log('🔄 updateShareButton llamado, usuarios seleccionados:', ShareSystem.selectedUsers.size);

    // Remover botón existente si existe
    const existingButton = shareContent.querySelector('.share-submit-btn');
    if (existingButton) {
        existingButton.parentElement.remove();
    }

    // Agregar texto opcional si hay usuarios seleccionados
    if (ShareSystem.selectedUsers.size > 0) {
        const existingTextArea = shareContent.querySelector('.share-message-input');
        if (!existingTextArea) {
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
            
            console.log('✅ Textarea agregado');
            
            // Agregar contador de caracteres
            const textArea = document.getElementById('shareMessageText');
            const counter = document.getElementById('shareMessageCounter');
            if (textArea && counter) {
                textArea.addEventListener('input', function() {
                    counter.textContent = this.value.length;
                });
            }
        }

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
                    font-size: 1rem;
                ">
                     Compartir con ${ShareSystem.selectedUsers.size} usuario${ShareSystem.selectedUsers.size > 1 ? 's' : ''}
                </button>
            </div>
        `;
        shareContent.insertAdjacentHTML('beforeend', buttonHTML);
        
        console.log('✅ Botón de compartir agregado');
    } else {
        // Remover textarea si no hay usuarios seleccionados
        const existingTextArea = shareContent.querySelector('.share-message-input');
        if (existingTextArea) {
            existingTextArea.parentElement.remove();
        }
        
        console.log('ℹ️ Sin usuarios seleccionados, botón no agregado');
    }
}

// ============================================
// FUNCIÓN INTEGRADA CON SISTEMA DE CHAT
// ============================================
async function submitShare() {
    try {
        if (ShareSystem.selectedUsers.size === 0) {
            showNotification('Selecciona al menos un usuario', 'error');
            return;
        }

        if (!ShareSystem.currentPost || !ShareSystem.currentPost.id) {
            showNotification('Error: No se encontró el contenido a compartir', 'error');
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
        const usuariosDestino = Array.from(ShareSystem.selectedUsers);

        // Detectar si es evento Chain o publicación normal
        const isChainEvent = ShareSystem.currentPost.type === 'chain-event';

        console.log('Compartiendo:', {
            tipo: isChainEvent ? 'evento chain' : 'publicación',
            id: ShareSystem.currentPost.id,
            usuarios_destino: usuariosDestino,
            mensaje: mensajeOpcional
        });

        let response;

        if (isChainEvent) {
            // Compartir evento Chain
            response = await fetch('php/api_chat.php?accion=compartir_evento_chain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    evento_id: ShareSystem.currentPost.id,
                    usuarios_destino: usuariosDestino,
                    mensaje: mensajeOpcional
                })
            });
        } else {
            // Compartir publicación normal
            response = await fetch('php/api_chat.php?accion=compartir_publicacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    publicacion_id: ShareSystem.currentPost.id,
                    usuarios_destino: usuariosDestino,
                    mensaje: mensajeOpcional
                })
            });
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al compartir');
        }

        const nombreUsuarios = ShareSystem.followedUsers
            .filter(user => ShareSystem.selectedUsers.has(user.id))
            .map(user => `@${user.username}`)
            .join(', ');

        const tipoContenido = isChainEvent ? 'Evento' : 'Publicación';
        let mensajeExito = `📤 ${tipoContenido} compartid${isChainEvent ? 'o' : 'a'} exitosamente con ${data.estadisticas?.total_enviados || data.total_enviados} usuario${(data.estadisticas?.total_enviados || data.total_enviados) > 1 ? 's' : ''}`;
        
        const totalEnviados = data.estadisticas?.total_enviados || data.total_enviados;
        const totalFallidos = data.estadisticas?.total_fallidos || data.total_fallidos || 0;
        
        if (totalEnviados > 0) {
            mensajeExito += `\n👥 Enviado a: ${nombreUsuarios}`;
        }

        if (totalFallidos > 0) {
            mensajeExito += `\n⚠️ ${totalFallidos} usuario${totalFallidos > 1 ? 's' : ''} no pudo${totalFallidos === 1 ? '' : 'ieron'} recibir el mensaje`;
        }

        showNotification(mensajeExito, 'success');
        
        console.log('Resultado del compartir:', data);

        setTimeout(() => {
            closeShareModal();
        }, 1500);

    } catch (error) {
        console.error('Error al compartir:', error);
        
        let errorMessage = 'Error al compartir';
        
        if (error.message.includes('Sesión')) {
            errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        showNotification(errorMessage, 'error');
        
        const button = document.querySelector('.share-submit-btn');
        if (button) {
            button.innerHTML = `Compartir con ${ShareSystem.selectedUsers.size} usuario${ShareSystem.selectedUsers.size > 1 ? 's' : ''}`;
            button.disabled = false;
        }
    }
}

// Filtrar usuarios por búsqueda
function filterUsers(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
        ShareSystem.filteredUsers = [...ShareSystem.followedUsers];
    } else {
        ShareSystem.filteredUsers = ShareSystem.followedUsers.filter(user => 
            user.username.toLowerCase().includes(term) ||
            user.display_name.toLowerCase().includes(term)
        );
    }
    
    renderFollowedUsers();
}

// ============================================
// CONFIGURAR BUSCADOR CON DEBUG
// ============================================

function setupShareSearch() {
    const searchInput = document.getElementById('shareSearch');
    if (searchInput) {
        console.log('✅ Input de búsqueda encontrado');
        
        // Remover listeners antiguos
        const newInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newInput, searchInput);
        
        // Agregar listener nuevo
        newInput.addEventListener('input', function(e) {
            const term = e.target.value;
            console.log('🔍 Buscando:', term);
            window.filterUsers(term);
        });
        
        console.log('✅ Listener de búsqueda conectado');
    } else {
        console.warn('⚠️ Input shareSearch no encontrado');
    }
}

// Llamar cuando se abre el modal
setupShareSearch();

// Cerrar modal de compartir
function closeShareModal() {
    try {
        const modal = document.getElementById('shareModal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        console.log('🚪 Cerrando modal, ShareSystem actual:', {
            currentPost: ShareSystem.currentPost,
            selectedUsers: ShareSystem.selectedUsers.size
        });
        
        // ⚠️ NO limpiar inmediatamente - esperar a que la animación termine
        setTimeout(() => {
            // Solo limpiar si el modal realmente está cerrado
            if (!modal.classList.contains('active')) {
                console.log('🧹 Limpiando ShareSystem después de cerrar modal');
                ShareSystem.currentPost = null;
                ShareSystem.selectedUsers.clear();
                ShareSystem.followedUsers = [];
                ShareSystem.filteredUsers = [];
                
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
            }
        }, 500); // Esperar más tiempo

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

function showEmptyShareState() {
    const containerList = document.getElementById('mutualFollowersList');
    if (containerList) {
        containerList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                <h3>Error al cargar usuarios</h3>
                <p>No pudimos cargar la lista de usuarios que sigues</p>
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
                <button onclick="retryLoadFollowedUsers()" style="
                    padding: 0.8rem 1.5rem;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-right: 0.5rem;
                ">Reintentar</button>
                <button onclick="showManualDebug()" style="
                    padding: 0.8rem 1.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">Ver debug</button>
            </div>
        `;
    }
}

// Función para reintentar carga
function retryLoadFollowedUsers() {
    loadFollowedUsers();
}

// Función para mostrar información de debug
function showManualDebug() {
    const containerList = document.getElementById('mutualFollowersList');
    if (containerList) {
        const currentUsername = CHAINFEED_CONFIG.currentUser || CommentsSystem.currentUser?.username || 'NO_ENCONTRADO';
        
        containerList.innerHTML = `
            <div style="text-align: left; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 8px; font-family: monospace; font-size: 0.9rem;">
                <h4>Información de Debug:</h4>
                <p><strong>Usuario actual:</strong> ${currentUsername}</p>
                <p><strong>CHAINFEED_CONFIG.currentUser:</strong> ${CHAINFEED_CONFIG.currentUser || 'undefined'}</p>
                <p><strong>CommentsSystem.currentUser:</strong> ${JSON.stringify(CommentsSystem.currentUser || 'undefined')}</p>
                <p><strong>URL a probar:</strong> php/obtener_listas_seguimiento.php</p>
                <p><strong>Post actual:</strong> ${JSON.stringify(ShareSystem.currentPost || 'ninguno')}</p>
                <p><strong>API Chat URL:</strong> /php/api_chat.php?accion=compartir_publicacion</p>
                <hr style="margin: 1rem 0; border: 1px solid rgba(255,255,255,0.2);">
                <button onclick="testAPI()" style="padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">Probar API</button>
                <button onclick="testChatAPI()" style="padding: 0.5rem 1rem; background: var(--secondary); color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">Probar API Chat</button>
                <button onclick="closeShareModal()" style="padding: 0.5rem 1rem; background: var(--error); color: white; border: none; border-radius: 4px; cursor: pointer;">Cerrar</button>
            </div>
        `;
    }
}

// Función para probar API de chat
async function testChatAPI() {
    try {
        if (!ShareSystem.currentPost?.id) {
            alert('Error: No hay publicación seleccionada para probar');
            return;
        }

        console.log('Probando API de chat...');
        
        // Probar con un usuario ficticio
        const response = await fetch('php/api_chat.php?accion=compartir_publicacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                publicacion_id: ShareSystem.currentPost.id,
                usuarios_destino: [], // Array vacío para probar validación
                mensaje: 'Test desde debug'
            })
        });

        console.log('Response status:', response.status);
        
        const data = await response.text();
        console.log('Response text:', data);
        
        if (response.ok) {
            try {
                const jsonData = JSON.parse(data);
                console.log('JSON parsed:', jsonData);
                alert(`API de Chat funcionó!\nMensaje: ${jsonData.message}`);
            } catch (parseError) {
                alert('API de Chat respondió pero no es JSON válido. Ver consola.');
                console.error('Error parsing JSON:', parseError);
            }
        } else {
            alert(`Error ${response.status}: ${data}`);
        }
        
    } catch (error) {
        console.error('Error en test API Chat:', error);
        alert(`Error de conexión: ${error.message}`);
    }
}

// Función para probar API original
async function testAPI() {
    try {
        const currentUsername = CHAINFEED_CONFIG.currentUser || CommentsSystem.currentUser?.username;
        
        if (!currentUsername) {
            alert('Error: No se pudo obtener el username del usuario actual');
            return;
        }

        console.log('Probando API con usuario:', currentUsername);
        
        const response = await fetch('php/obtener_listas_seguimiento.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: currentUsername,
                tipo: 'seguidos',
                limite: 10,
                offset: 0
            })
        });

        console.log('Response status:', response.status);
        
        const data = await response.text();
        console.log('Response text:', data);
        
        if (response.ok) {
            try {
                const jsonData = JSON.parse(data);
                console.log('JSON parsed:', jsonData);
                alert(`API funcionó!\nUsuarios encontrados: ${jsonData.data?.usuarios?.length || 0}`);
                
                if (jsonData.success && jsonData.data?.usuarios?.length > 0) {
                    // Si la API funciona, recargar usuarios
                    retryLoadFollowedUsers();
                }
            } catch (parseError) {
                alert('API respondió pero no es JSON válido. Ver consola.');
                console.error('Error parsing JSON:', parseError);
            }
        } else {
            alert(`Error ${response.status}: ${data}`);
        }
        
    } catch (error) {
        console.error('Error en test API:', error);
        alert(`Error de conexión: ${error.message}`);
    }
}

// Función para configurar los event listeners automáticamente
function setupShareEventListeners() {
    // Selectores para elementos que pueden abrir el modal de compartir
    const shareSelectors = [
        '.post-stat[onclick*="openShareModal"]',
        '.card-stat[onclick*="openShareModal"]',
        '[onclick*="openShareModal"]'
    ];

    shareSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            // Asegurar que tiene el event listener
            element.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openShareModal(this);
            });
        });
    });

    // También configurar para elementos que se agreguen dinámicamente
    document.addEventListener('click', function(e) {
        const element = e.target.closest('.post-stat, .card-stat');
        if (element && element.getAttribute('onclick')?.includes('openShareModal')) {
            e.preventDefault();
            e.stopPropagation();
            openShareModal(element);
        }
    });
}

// Inicializar sistema de compartir
function initializeShareSystem() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeShareModal();
            }
        });
    }

    // Configurar buscador
    setupShareSearch();

    // Configurar event listeners para elementos de compartir
    setupShareEventListeners();

    // Listener para cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const shareModal = document.getElementById('shareModal');
            if (shareModal && shareModal.classList.contains('active')) {
                closeShareModal();
            }
        }
    });
}

// Estilos adicionales para el sistema de compartir
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
    
    /* Asegurar que tanto post-stat como card-stat tengan cursor pointer */
    .post-stat, .card-stat {
        cursor: pointer;
    }
    
    /* Animación de spin para loading */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(shareStyles);

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeShareSystem();
});

// También inicializar si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShareSystem);
} else {
    initializeShareSystem();
}

// Hacer funciones globales
window.closeShareModal = closeShareModal;
window.submitShare = submitShare;
window.retryLoadFollowedUsers = retryLoadFollowedUsers;
window.showManualDebug = showManualDebug;
window.testAPI = testAPI;
window.testChatAPI = testChatAPI;
window.updateShareButton = updateShareButton;

// ============================================
// DEBUG: Detectar modificaciones a ShareSystem
// ============================================
let lastCurrentPost = ShareSystem.currentPost;
let lastSelectedCount = ShareSystem.selectedUsers.size;

setInterval(() => {
    if (ShareSystem.currentPost !== lastCurrentPost) {
        console.warn('⚠️ ShareSystem.currentPost cambió:', {
            anterior: lastCurrentPost,
            nuevo: ShareSystem.currentPost
        });
        console.trace('Stack trace:');
        lastCurrentPost = ShareSystem.currentPost;
    }
    
    if (ShareSystem.selectedUsers.size !== lastSelectedCount) {
        console.warn('⚠️ ShareSystem.selectedUsers cambió:', {
            anterior: lastSelectedCount,
            nuevo: ShareSystem.selectedUsers.size
        });
        console.trace('Stack trace:');
        lastSelectedCount = ShareSystem.selectedUsers.size;
    }
}, 100);

console.log('🔍 Debug de ShareSystem activado');



console.log('✅ Sistema de compartir integrado con chat cargado completamente');