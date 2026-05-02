/**
 * SISTEMA DE BOTÓN DE SEGUIMIENTO PARA FULLSCREEN VIEWER
 * Maneja el estado de seguimiento en el viewer tipo TikTok/Instagram
 * Soporta perfiles públicos (seguir directo) y privados (solicitud pendiente)
 */

class FollowButtonManager {
    constructor() {
        this.currentPostAuthor = null;
        this.followStates = new Map(); // Cache de estados de seguimiento
        this.isProcessing = false;
    }

detectPostType(postElement) {
    if (!postElement) return 'normal';
    
    // Detectar posts del market
    if (postElement.classList.contains('market-post') || 
        postElement.querySelector('.sale-price-btn') ||
        postElement.innerHTML.includes('Post en venta')) {
        return 'market';
    }
    
    // Detectar posts virales
    if (postElement.classList.contains('viral-post') || 
        postElement.querySelector('.viral-indicator')) {
        return 'viral';
    }
    
    return 'normal';
}

    /**
 * Extraer username real del post original
 */
extractUsernameFromPost(postElement) {
    const postType = this.detectPostType(postElement);
    
    if (postType === 'market') {
        // Extraer username de posts del market
        const usernameElement = postElement.querySelector('.profile-link');
        if (usernameElement) {
            return usernameElement.textContent.replace('@', '').trim();
        }
        
        // Fallback: buscar en metaContainer
        const metaContainer = Array.from(postElement.querySelectorAll('div')).find(div => 
            div.style.color?.includes('--text-secondary') && 
            div.textContent.includes('@')
        );
        
        if (metaContainer) {
            const match = metaContainer.textContent.match(/@(\w+)/);
            if (match) {
                return match[1];
            }
        }
        
    } else {
        // Extraer username de posts normales Y virales (usan la misma estructura)
        const metaElement = postElement.querySelector('.post-meta');
        if (metaElement) {
            const metaText = metaElement.textContent;
            const match = metaText.match(/@(\w+)/);
            if (match) {
                return match[1];
            }
        }

        const authorInfo = postElement.querySelector('.post-author-info');
        if (authorInfo) {
            const metaDiv = authorInfo.querySelector('.post-meta');
            if (metaDiv) {
                const parts = metaDiv.textContent.split('•');
                if (parts.length > 0) {
                    return parts[0].trim().replace('@', '');
                }
            }
        }
    }

    console.error('No se pudo extraer username del post');
    return null;
}

    /**
     * Verificar estado de seguimiento de un usuario
     */
    async checkFollowStatus(username) {
        // Verificar cache primero
        if (this.followStates.has(username)) {
            return this.followStates.get(username);
        }

        try {
            const response = await fetch('php/verificar_seguimiento.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    target_username: username
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Guardar en cache
                const status = {
                    following: data.following,
                    isPending: false, // Por ahora no tenemos esta info en verificar_seguimiento
                    targetUser: data.target_user
                };
                
                this.followStates.set(username, status);
                return status;
            } else {
                throw new Error(data.message || 'Error al verificar seguimiento');
            }

        } catch (error) {
            console.error('Error verificando seguimiento:', error);
            return {
                following: false,
                isPending: false,
                targetUser: null
            };
        }
    }

    /**
     * Crear y mostrar botón de seguir en el viewer
     */
async updateFollowButton(postElement) {
    // Extraer username del post original
    const postUsername = this.extractUsernameFromPost(postElement);
    console.log('🔍 Post detectado como:', this.detectPostType(postElement));

    if (!postUsername) {
        console.error('No se pudo extraer username del post');
        this.hideFollowButton();
        return;
    }

    const currentUsername = window.CHAINFEED_CONFIG?.currentUser?.username;

    console.log('🔍 Comparando usernames:', {
        postUsername: postUsername,
        currentUsername: currentUsername,
        sonIguales: postUsername === currentUsername
    });

    // SIEMPRE ocultar el botón primero
    this.hideFollowButton();

    // No mostrar botón si es el propio usuario
    if (postUsername === currentUsername) {
        console.log('✅ Post propio detectado, botón oculto');
        return;
    }

    this.currentPostAuthor = postUsername;
    console.log('✅ Username extraído correctamente:', postUsername);

    // Verificar estado de seguimiento
    const status = await this.checkFollowStatus(postUsername);

    // Actualizar o crear botón
    this.renderFollowButton(status);
}

    /**
     * Renderizar botón de seguir con estado apropiado
     */
renderFollowButton(status) {
    const viewer = document.getElementById('fullscreen-post-viewer');
    if (!viewer) return;

    const usernameElement = viewer.querySelector('.fsv-username');
    if (!usernameElement) return;

    // IMPORTANTE: Verificar nuevamente que no sea post propio
    const currentUsername = window.CHAINFEED_CONFIG?.currentUser?.username;
    if (this.currentPostAuthor === currentUsername) {
        console.log('⚠️ Intento de renderizar botón en post propio bloqueado');
        this.hideFollowButton();
        return;
    }

    // Buscar si ya existe el botón
    let followBtn = viewer.querySelector('.fsv-follow-btn');

    if (!followBtn) {
        // Crear botón por primera vez
        followBtn = document.createElement('button');
        followBtn.className = 'fsv-follow-btn';
        
        // ✅ AGREGAR position: absolute INMEDIATAMENTE
        followBtn.style.position = 'absolute';
        followBtn.style.right = '2rem';
        
        followBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleFollowClick();
        });
        
        // Insertar en .fsv-user-info (no en username-row)
        const userInfo = viewer.querySelector('.fsv-user-info');
        if (userInfo) {
            userInfo.style.position = 'relative'; // Asegurar que sea el contenedor
            userInfo.appendChild(followBtn);
        }
    }

    // Actualizar estado del botón (SIN recrearlo)
if (status.following) {
    followBtn.textContent = 'Siguiendo';
    followBtn.className = 'fsv-follow-btn following';
    followBtn.dataset.action = 'unfollow';
    followBtn.disabled = false; // ✅ DESBLOQUEAR
    followBtn.style.cursor = 'pointer';
    followBtn.style.opacity = '1';
} else if (status.isPending) {
    followBtn.textContent = 'Pendiente';
    followBtn.className = 'fsv-follow-btn pending';
    followBtn.dataset.action = 'cancel_request';
    followBtn.disabled = true; // ✅ BLOQUEAR botón
    followBtn.style.cursor = 'not-allowed'; // ✅ Cursor de bloqueado
    followBtn.style.opacity = '0.6'; // ✅ Apariencia de bloqueado
} else {
    followBtn.textContent = 'Seguir';
    followBtn.className = 'fsv-follow-btn';
    followBtn.dataset.action = 'follow';
    followBtn.disabled = false; // ✅ DESBLOQUEAR
    followBtn.style.cursor = 'pointer'; // ✅ Cursor normal
    followBtn.style.opacity = '1'; // ✅ Opacidad normal
}

    // Asegurar estilos de posición
    followBtn.style.position = 'absolute';
    followBtn.style.right = '2rem';
    followBtn.style.display = 'inline-flex';
}

    /**
     * Ocultar botón de seguir
     */

hideFollowButton() {
    const viewer = document.getElementById('fullscreen-post-viewer');
    if (!viewer) return;

    const followBtn = viewer.querySelector('.fsv-follow-btn');
    if (followBtn) {
        // DESTRUIR el botón completamente, no solo ocultarlo
        followBtn.remove();
        console.log('🗑️ Botón de seguir eliminado del DOM');
    }
}

    /**
     * Manejar click en botón de seguir
     */
    async handleFollowClick() {
        if (this.isProcessing || !this.currentPostAuthor) return;

        const followBtn = document.querySelector('.fsv-follow-btn');
        if (!followBtn) return;

        const action = followBtn.dataset.action;
        this.isProcessing = true;

        // Feedback visual
        followBtn.classList.add('processing');
        const originalText = followBtn.textContent;

        console.log('🔄 Intentando seguir/dejar de seguir:', this.currentPostAuthor, 'acción:', action);

        try {
            const response = await fetch('php/manejar_seguimiento.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    target_username: this.currentPostAuthor,
                    action: action === 'cancel_request' ? 'unfollow' : action
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error del servidor:', errorText);
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Actualizar cache
                const newStatus = {
                    following: data.now_following || false,
                    isPending: data.status === 'pending',
                    targetUser: data.target_user
                };

                this.followStates.set(this.currentPostAuthor, newStatus);

                // Actualizar botón
                this.renderFollowButton(newStatus);

                // Mostrar notificación
                if (data.status === 'pending') {
                    if (window.showNotification) {
                        showNotification('⏳ Solicitud de seguimiento enviada', 'info');
                    }
                } else if (data.action_performed === 'cancel_request') {
                    if (window.showNotification) {
                        showNotification('❌ Solicitud cancelada', 'info');
                    }
                } else if (data.now_following) {
                    if (window.showNotification) {
                        showNotification(`✅ Ahora sigues a @${this.currentPostAuthor}`, 'success');
                    }
                } else {
                    if (window.showNotification) {
                        showNotification(`👋 Dejaste de seguir a @${this.currentPostAuthor}`, 'info');
                    }
                }

                // Actualizar botón en el post original del feed si existe
                this.updateOriginalPostButton(this.currentPostAuthor, newStatus);

            } else {
                throw new Error(data.message || 'Error al procesar seguimiento');
            }

        } catch (error) {
            console.error('Error al procesar seguimiento:', error);
            if (window.showNotification) {
                showNotification(`❌ ${error.message}`, 'error');
            }
            // Restaurar texto original en caso de error
            followBtn.textContent = originalText;
        } finally {
            this.isProcessing = false;
            followBtn.classList.remove('processing');
        }
    }

    /**
     * Actualizar botón de seguir en el post original del feed
     */
    updateOriginalPostButton(username, newStatus) {
        // Buscar el post en el feed
        const posts = document.querySelectorAll('.post-card');
        
        posts.forEach(post => {
            const metaElement = post.querySelector('.post-meta');
            if (!metaElement) return;

            const metaText = metaElement.textContent;
            const match = metaText.match(/@(\w+)/);
            const postUsername = match ? match[1] : null;
            
            if (postUsername === username) {
                // Invalidar cache para forzar recarga
                console.log(`✅ Estado de seguimiento actualizado para @${username}`);
            }
        });
    }

    /**
     * Limpiar cache de estados
     */
    clearCache() {
        this.followStates.clear();
    }

    /**
     * Invalidar cache de un usuario específico
     */
    invalidateCache(username) {
        this.followStates.delete(username);
    }
}

// Instancia global
window.followButtonManager = new FollowButtonManager();

/**
 * Integración con FullscreenPostViewer
 * Hook en el método updateBottomBar para agregar el botón de seguir
 */
(function() {
    // Esperar a que el viewer esté disponible
    const waitForViewer = setInterval(() => {
        if (window.fullscreenViewer) {
            clearInterval(waitForViewer);
            integrateFollowButton();
        }
    }, 100);

    function integrateFollowButton() {
        const originalUpdateBottomBar = window.fullscreenViewer.updateBottomBar;

        window.fullscreenViewer.updateBottomBar = function() {
            // Llamar al método original
            originalUpdateBottomBar.call(this);

            // Obtener el post actual
            const currentPost = this.posts[this.currentIndex];
            if (currentPost) {
                // Actualizar botón de seguir
                window.followButtonManager.updateFollowButton(currentPost);
            }
        };

        console.log('✅ Sistema de seguimiento integrado con Fullscreen Viewer');
    }
})();

/**
 * Estilos CSS para el botón de seguir
 */
const followButtonStyles = document.createElement('style');
followButtonStyles.textContent = `
    /* Wrapper para username + botón en la misma línea */
    .fsv-username-row {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        flex-wrap: nowrap !important;
    }

    /* Asegurar que el username no se rompa */
    .fsv-username {
        display: inline-block;
        white-space: nowrap;
    }

    /* Botón de seguir en el viewer */
    .fsv-follow-btn {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        padding: 4px 12px;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        border: none;
        border-radius: 16px;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
        white-space: nowrap;
        flex-shrink: 0;
        position: absolute;
        right: 2rem;
    }

    .fsv-follow-btn:hover {
        background: linear-gradient(135deg, #4f46e5, #4338ca);
        transform: scale(1.05);
        box-shadow: 0 3px 10px rgba(99, 102, 241, 0.4);
    }

    .fsv-follow-btn:active {
        transform: scale(0.98);
    }

    /* Estado: Pendiente */
    .fsv-follow-btn.pending {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
    }

    .fsv-follow-btn.pending:hover {
        background: linear-gradient(135deg, #d97706, #b45309);
        box-shadow: 0 3px 10px rgba(245, 158, 11, 0.4);
    }

    /* Estado: Siguiendo */
    .fsv-follow-btn.following {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary, #fff);
        box-shadow: none;
    }

    .fsv-follow-btn.following:hover {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-primary, #fff);
        box-shadow: none;
    }

    /* Animación de procesamiento */
    .fsv-follow-btn.processing {
        opacity: 0.6;
        pointer-events: none;
        position: relative;
    }

    .fsv-follow-btn.processing::after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: fsv-btn-spin 0.6s linear infinite;
    }

    @keyframes fsv-btn-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Responsive - móviles */
    @media (max-width: 768px) {
        .fsv-follow-btn {
            padding: 3px 10px;
            font-size: 0.7rem;
        }
        
        .fsv-username-row {
            gap: 6px !important;
        }
    }

    /* Ajustar .fsv-user-details para mejor layout */
    .fsv-user-details {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
`;

document.head.appendChild(followButtonStyles);

/**
 * Integración con Fullscreen Post Adapter
 */
(function() {
    const waitForAdapter = setInterval(() => {
        if (window.fullscreenPostAdapter && window.fullscreenPostAdapter.originalViewer) {
            clearInterval(waitForAdapter);
            
            // Hook en updateBottomBar del adapter
            const originalAdapterUpdateBottomBar = window.fullscreenPostAdapter.updateAdaptedBottomBar.bind(window.fullscreenPostAdapter);
            
            window.fullscreenPostAdapter.updateAdaptedBottomBar = function(currentPost, postType) {
                // Llamar al método original del adapter
                originalAdapterUpdateBottomBar(currentPost, postType);
                
                // Actualizar botón de seguir
                if (currentPost && window.followButtonManager) {
                    window.followButtonManager.updateFollowButton(currentPost);
                }
            };
            
            console.log('✅ Botón de seguimiento integrado con Fullscreen Adapter');
        }
    }, 100);
    
    // Timeout de seguridad
    setTimeout(() => clearInterval(waitForAdapter), 5000);
})();

console.log('✅ Sistema de botón de seguimiento para Fullscreen Viewer cargado');