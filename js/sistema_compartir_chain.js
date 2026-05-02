// ============================================
// SISTEMA DE COMPARTIR EVENTOS CHAIN
// ============================================

(function() {
    'use strict';
    
    // Asegurar que ShareSystem existe globalmente
    window.ShareSystem = window.ShareSystem || {
        currentPost: null,
        selectedUsers: new Set(),
        followedUsers: [],
        filteredFollowers: [],
        isLoading: false
    };

    /**
     * Compartir evento Chain
     */
    window.shareChainEvent = function(buttonElement, eventId) {
        try {
            console.log('📤 Compartiendo evento Chain:', eventId);
            
            // Verificar que ShareSystem existe
            if (!window.ShareSystem) {
                console.error('ShareSystem no está definido');
                showNotification('Error del sistema. Recarga la página.', 'error');
                return;
            }
            
            // Buscar el contenedor del evento
            const eventCard = buttonElement.closest('.chain-event-card');
            
            if (!eventCard) {
                console.error('No se encontró el contenedor del evento');
                showNotification('Error: No se encontró el evento', 'error');
                return;
            }
            
            // Configurar ShareSystem para evento Chain
            window.ShareSystem.currentPost = {
                type: 'chain-event',
                id: parseInt(eventId),
                element: eventCard
            };
            
            console.log('✅ ShareSystem configurado para Chain:', window.ShareSystem.currentPost);
            
            // Abrir modal usando la función wrapper
            openChainShareModal(buttonElement);
            
        } catch (error) {
            console.error('Error compartiendo evento Chain:', error);
            showNotification('Error al compartir evento', 'error');
        }
    };

    /**
     * Wrapper para abrir modal de compartir específico para Chain
     */
    async function openChainShareModal(element) {
        try {
            // Verificar que el modal existe
            const modal = document.getElementById('shareModal');
            if (!modal) {
                showNotification('Error: Modal de compartir no encontrado', 'error');
                return;
            }

            // Abrir modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Actualizar título del modal
            const modalTitle = modal.querySelector('.share-title');
            if (modalTitle) {
                modalTitle.textContent = '📤 Compartir Evento Chain';
            }

            // Cargar usuarios seguidos
            await loadFollowedUsersForChain();

            // Focus en buscador
            setTimeout(() => {
                const searchInput = document.getElementById('shareSearch');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
            }, 300);

        } catch (error) {
            console.error('Error al abrir modal de compartir Chain:', error);
            showNotification('Error al abrir modal de compartir', 'error');
        }
    }

  async function loadFollowedUsersForChain() {
    try {
        window.ShareSystem.isLoading = true;
        showLoadingStateShare();

        // Obtener usuario actual de múltiples fuentes posibles
        let currentUsername = null;
        
        // Opción 1: CHAINFEED_CONFIG (usado en perfil.js)
        if (window.CHAINFEED_CONFIG?.currentUser?.username) {
            currentUsername = window.CHAINFEED_CONFIG.currentUser.username;
            console.log('Usuario obtenido de CHAINFEED_CONFIG:', currentUsername);
        }
        // Opción 2: CommentsSystem (backup en perfil.js)
        else if (window.CommentsSystem?.currentUser?.username) {
            currentUsername = window.CommentsSystem.currentUser.username;
            console.log('Usuario obtenido de CommentsSystem:', currentUsername);
        }
        // Opción 3: Verificar sesión directamente (usado en inicio.js)
        else {
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
            throw new Error('No se pudo obtener el usuario actual. Por favor, recarga la página.');
        }

        console.log('Usando username:', currentUsername);

        const response = await fetch('/php/obtener_listas_seguimiento.php', {
            method: 'POST',
            credentials: 'include',
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

        // Guardar usuarios seguidos
        window.ShareSystem.followedUsers = data.data.usuarios;
        window.ShareSystem.filteredFollowers = [...window.ShareSystem.followedUsers];

        renderFollowedUsersForChain();

        console.log(`Usuarios seguidos cargados para Chain: ${window.ShareSystem.followedUsers.length}`);

    } catch (error) {
        console.error('Error cargando usuarios seguidos:', error);
        showNotification(`Error al cargar usuarios: ${error.message}`, 'error');
        showErrorWithRetryForChain(error.message);
    } finally {
        window.ShareSystem.isLoading = false;
    }
}

    /**
     * Renderizar lista de usuarios seguidos
     */
    function renderFollowedUsersForChain() {
        const followersList = document.getElementById('mutualFollowersList');
        if (!followersList) return;
        
        if (window.ShareSystem.filteredFollowers.length === 0) {
            followersList.innerHTML = `
    <div class="empty-followers">
        <div class="empty-followers-icon">👥</div>
        <h3>No tienes seguidos mutuos</h3>
        <p>Los seguidos mutuos son usuarios que tú sigues y que te siguen de vuelta</p>
    </div>
`;
            return;
        }

        let followersHTML = '';

        window.ShareSystem.filteredFollowers.forEach(follower => {
            const isSelected = window.ShareSystem.selectedUsers.has(follower.id);
            const avatarHTML = follower.avatar_url 
                ? `<img src="${follower.avatar_url}" alt="${follower.username}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(follower.username)}';">`
                : generateAvatarInitials(follower.username);
            
            followersHTML += `
                <div class="mutual-follower ${isSelected ? 'selected' : ''}" 
                     onclick="toggleUserSelection(${follower.id})" data-user-id="${follower.id}">
                    <div class="follower-avatar">${avatarHTML}</div>
                    <div class="follower-info">
                        <div class="follower-name">
                            ${escapeHtml(follower.display_name)}
                            ${follower.verified ? '<span class="follower-verified">✓</span>' : ''}
                        </div>
                        <div class="follower-username">@${follower.username}</div>
                    </div>
                    <div class="share-selection ${isSelected ? 'selected' : ''}">
                        ${isSelected ? '✓' : ''}
                    </div>
                </div>
            `;
        });

        followersList.innerHTML = followersHTML;
        updateChainShareButton();
    }

    /**
     * Actualizar botón de compartir para Chain
     */
  function updateChainShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    const selectedCount = window.ShareSystem.selectedUsers.size;
    
    const existingTextArea = document.querySelector('#shareModal .share-message-container');
    const existingButton = document.querySelector('#shareModal .share-submit-btn');
    
    if (selectedCount === 0) {
        // Sin usuarios seleccionados: remover textarea y deshabilitar/ocultar botón
        if (existingTextArea) {
            existingTextArea.remove();
        }
        
        if (existingButton) {
            existingButton.remove();
        }
        
    } else {
        // Con usuarios seleccionados: mostrar textarea y botón
        
        // Agregar textarea si no existe
        if (!existingTextArea) {
            const modal = document.getElementById('shareModal');
            const modalContent = modal.querySelector('.share-content');
            
            if (modalContent) {
                const textAreaHTML = `
                    <div class="share-message-container" style="padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                            Mensaje opcional:
                        </label>
                        <textarea 
                            id="shareMessageText"
                            placeholder="Escribe tu mensaje aquí..." 
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
                                min-height: 80px;
                                max-height: 120px;
                            "
                            maxlength="200"
                        ></textarea>
                        <div style="text-align: right; font-size: 0.8rem; color: #a0a0b8; margin-top: 0.3rem;">
                            <span id="shareMessageCounter">0</span>/200
                        </div>
                    </div>
                `;
                
                modalContent.insertAdjacentHTML('beforeend', textAreaHTML);
                
                const textArea = document.getElementById('shareMessageText');
                const counter = document.getElementById('shareMessageCounter');
                if (textArea && counter) {
                    textArea.addEventListener('input', function() {
                        counter.textContent = this.value.length;
                    });
                    
                    setTimeout(() => textArea.focus(), 100);
                }
            }
        }
        
        // Agregar botón si no existe
        if (!existingButton) {
            const modal = document.getElementById('shareModal');
            const modalContent = modal.querySelector('.share-content');
            
            if (modalContent) {
                const buttonHTML = `
                    <div style="padding: 1rem;">
                        <button class="share-submit-btn" onclick="window.submitChainShare()" style="
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
                             Compartir con ${selectedCount} usuario${selectedCount > 1 ? 's' : ''}
                        </button>
                    </div>
                `;
                
                modalContent.insertAdjacentHTML('beforeend', buttonHTML);
            }
        } else {
            // Actualizar texto del botón existente
            existingButton.textContent = `Compartir con ${selectedCount} usuario${selectedCount > 1 ? 's' : ''}`;
        }
    }
}

    /**
 * Enviar compartir evento Chain
 */
window.submitChainShare = async function() {
    const button = document.getElementById('shareBtn');
    let originalText = 'Compartir';
    
    try {
        if (window.ShareSystem.selectedUsers.size === 0) {
            showNotification('Selecciona al menos un usuario', 'error');
            return;
        }

        if (!window.ShareSystem.currentPost || !window.ShareSystem.currentPost.id) {
            showNotification('Error: No se encontró el evento a compartir', 'error');
            return;
        }

        if (button) {
            originalText = button.textContent;
            button.innerHTML = 'Compartiendo... ⏳';
            button.disabled = true;
        }

        const messageTextArea = document.getElementById('shareMessageText');
        const mensajeOpcional = messageTextArea ? messageTextArea.value.trim() : '';
        const usuariosDestino = Array.from(window.ShareSystem.selectedUsers);

        console.log('Compartiendo evento Chain:', {
            evento_id: window.ShareSystem.currentPost.id,
            usuarios_destino: usuariosDestino,
            mensaje: mensajeOpcional
        });

        // Llamar a la API del chat para compartir el evento Chain
        const response = await fetch('../php/api_chat.php?accion=compartir_evento_chain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                evento_id: window.ShareSystem.currentPost.id,
                usuarios_destino: usuariosDestino,
                mensaje: mensajeOpcional
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al compartir el evento');
        }

        const nombreUsuarios = window.ShareSystem.followedUsers
            .filter(user => window.ShareSystem.selectedUsers.has(user.id))
            .map(user => `@${user.username}`)
            .join(', ');

        const totalEnviados = data.estadisticas?.total_enviados || data.total_enviados || 0;
        const totalFallidos = data.estadisticas?.total_fallidos || data.total_fallidos || 0;

        let mensajeExito = `Evento Chain compartido con ${totalEnviados} usuario${totalEnviados > 1 ? 's' : ''}`;
        
        if (totalEnviados > 0) {
            mensajeExito += `\n👥 Enviado a: ${nombreUsuarios}`;
        }

        if (totalFallidos > 0) {
            mensajeExito += `\n⚠️ ${totalFallidos} usuario${totalFallidos > 1 ? 's' : ''} no pudo${totalFallidos === 1 ? '' : 'ieron'} recibir el mensaje`;
        }

        showNotification(mensajeExito, 'success');

        setTimeout(() => {
            closeShareModal();
        }, 1500);

    } catch (error) {
        console.error('Error al compartir evento Chain:', error);
        
        let errorMessage = 'Error al compartir el evento';
        
        if (error.message.includes('Sesión')) {
            errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        showNotification(errorMessage, 'error');
        
    } finally {
        // CRÍTICO: Siempre restaurar el botón
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }
};

    /**
     * Estados de carga y error
     */
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

    function showErrorWithRetryForChain(errorMessage) {
        const containerList = document.getElementById('mutualFollowersList');
        if (containerList) {
            containerList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Error al cargar usuarios seguidos</h3>
                    <p style="color: var(--error); margin-bottom: 1rem;">${errorMessage}</p>
                    <button onclick="window.shareChainEvent.retryLoad()" style="
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

    // Función para reintentar
    window.shareChainEvent.retryLoad = function() {
        loadFollowedUsersForChain();
    };

    console.log('✅ Sistema de compartir eventos Chain inicializado');

})();