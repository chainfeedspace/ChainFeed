// =========================================================================
// SISTEMA DE LISTAS DE SEGUIMIENTO - CHAINFEED PERSONALIZADO
// Integrado con tu sistema existente
// =========================================================================

class ChainFeedSeguimiento {
    constructor() {
        this.modal = null;
        this.currentType = null;
        this.currentUsername = null;
        this.currentOffset = 0;
        this.loading = false;
        this.hasMore = true;
        
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
        this.detectStatItems();
        console.log('✅ Sistema ChainFeed de seguimiento inicializado');
    }

    createModal() {
    const modalHTML = `
        <div id="chainFeedModal" class="chainfeed-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999; backdrop-filter: blur(10px);">
            <div class="chainfeed-modal-content" style="background: #1a1a24; border-radius: 20px; width: 90%; max-width: 480px; max-height: 80vh; margin: 5vh auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); overflow: hidden; animation: slideIn 0.3s ease; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div class="chainfeed-modal-header" style="padding: 6px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));">
                    <h3 id="chainFeedModalTitle" style="margin: 0; font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Seguidos</h3>
                    <button class="chainfeed-modal-close" id="closeChainFeedModal" style="background: rgba(255, 255, 255, 0.1); border: none; font-size: 24px; cursor: pointer; padding: 4px; border-radius: 8px; color: #a0a0b8; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">×</button>
                </div>
                <div class="chainfeed-modal-body" id="chainFeedModalBody" style="max-height: 400px; overflow-y: auto; padding: 8px 0; background: #0f0f14;">
                    <div class="chainfeed-loading" style="text-align: center; padding: 40px 24px; color: #a0a0b8;">
                        <div class="chainfeed-spinner" style="width: 40px; height: 40px; border: 4px solid rgba(99, 102, 241, 0.3); border-top: 4px solid #6366f1; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                        <p>Cargando...</p>
                    </div>
                </div>
                <div class="chainfeed-modal-footer" id="chainFeedModalFooter" style="display: none; padding: 16px 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; background: rgba(0, 0, 0, 0.2);">
                    <button class="chainfeed-load-more" id="chainFeedLoadMore" style="background: rgba(99, 102, 241, 0.1); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.3); padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Cargar más</button>
                </div>
            </div>
        </div>

        <style>
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .chainfeed-modal.active {
                display: flex !important;
                align-items: center;
                justify-content: center;
            }
            .chainfeed-user-item {
                display: flex;
                align-items: center;
                padding: 12px 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .chainfeed-user-item:hover {
                background: rgba(99, 102, 241, 0.1);
            }
            .chainfeed-user-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                object-fit: cover;
                margin-right: 16px;
                border: 2px solid rgba(99, 102, 241, 0.3);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
            }
            .chainfeed-user-info {
                flex: 1;
                min-width: 0;
            }
            .chainfeed-user-name {
                font-size: 16px;
                font-weight: 600;
                color: #ffffff;
                margin: 0 0 4px 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .chainfeed-user-username {
                color: #a0a0b8;
                font-size: 14px;
                margin-bottom: 2px;
            }
            .chainfeed-user-date {
                color: #6b7280;
                font-size: 12px;
            }
            .chainfeed-user-actions {
                margin-left: 12px;
            }
            .chainfeed-btn {
                padding: 8px 20px;
                border: none;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 80px;
            }
            .chainfeed-btn-follow {
                background: linear-gradient(135deg, #6366f1, #a855f7);
                color: white;
            }
            .chainfeed-btn-follow:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
            }
            .chainfeed-btn-following {
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
                border: 1px solid rgba(99, 102, 241, 0.3);
            }
            .chainfeed-btn-following:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                border-color: rgba(239, 68, 68, 0.3);
            }
            .chainfeed-self {
                color: #a0a0b8;
                font-size: 14px;
                padding: 8px 12px;
                background: rgba(99, 102, 241, 0.1);
                border-radius: 12px;
            }
            .chainfeed-empty {
                text-align: center;
                padding: 40px 24px;
                color: #a0a0b8;
            }
            .chainfeed-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
                transform: rotate(90deg);
            }
            .chainfeed-load-more:hover {
                background: rgba(99, 102, 241, 0.2);
                transform: translateY(-2px);
            }
            
            /* Scrollbar personalizado */
            .chainfeed-modal-body::-webkit-scrollbar {
                width: 8px;
            }
            .chainfeed-modal-body::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            .chainfeed-modal-body::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #6366f1, #ec4899);
                border-radius: 10px;
            }
            .chainfeed-modal-body::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #a855f7, #ec4899);
            }
            .chainfeed-btn-pending {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.4);
    cursor: not-allowed;
    opacity: 0.8;
}

.chainfeed-btn-pending:hover {
    background: rgba(245, 158, 11, 0.15);
    transform: none;
    box-shadow: none;
}
        </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('chainFeedModal');
}

    bindEvents() {
        // Cerrar modal
        document.getElementById('closeChainFeedModal').addEventListener('click', () => {
            this.closeModal();
        });

        // Cerrar al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Cargar más
        document.getElementById('chainFeedLoadMore').addEventListener('click', () => {
            this.loadMore();
        });
    }

    detectStatItems() {
        // Detectar específicamente los elementos .stat-item con data-seguimiento-tipo
        document.addEventListener('click', (e) => {
            const statItem = e.target.closest('.stat-item[data-seguimiento-tipo]');
            if (statItem) {
                e.preventDefault();
                e.stopPropagation();
                
                const tipo = statItem.getAttribute('data-seguimiento-tipo');
                const username = this.getCurrentUsername();
                
                console.log(`🎯 Detectado clic en: ${tipo}, usuario: ${username}`);
                this.openModal(tipo, username);
                return false;
            }

            // También detectar por IDs específicos (fallback)
            if (e.target.closest('#followersCount, .stat-item:has(#followersCount)')) {
                e.preventDefault();
                e.stopPropagation();
                this.openModal('seguidores', this.getCurrentUsername());
                return false;
            }
            
            if (e.target.closest('#followingCount, .stat-item:has(#followingCount)')) {
                e.preventDefault();
                e.stopPropagation();
                this.openModal('seguidos', this.getCurrentUsername());
                return false;
            }
        });

        console.log('🔍 Detectados elementos stat-item:', document.querySelectorAll('.stat-item').length);
    }

    getCurrentUsername() {
        // Método 1: Desde parámetro URL
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        if (userParam) {
            console.log(`Username desde URL: ${userParam}`);
            return userParam;
        }

        // Método 2: Desde variable global currentUser
        if (window.currentUser && window.currentUser.username) {
            console.log(`Username desde currentUser: ${window.currentUser.username}`);
            return window.currentUser.username;
        }

        // Método 3: Desde localStorage
        const localUser = localStorage.getItem('currentUser');
        if (localUser) {
            try {
                const user = JSON.parse(localUser);
                if (user.username) {
                    console.log(`Username desde localStorage: ${user.username}`);
                    return user.username;
                }
            } catch (e) {
                console.warn('Error parsing localStorage user:', e);
            }
        }

        // Método 4: Desde elementos DOM
        const usernameElements = document.querySelectorAll('[data-username], .profile-username, .user-username, h1, .username');
        for (let element of usernameElements) {
            const username = element.textContent.trim().replace('@', '');
            if (username && username.length > 2 && !username.includes(' ')) {
                console.log(`Username desde DOM: ${username}`);
                return username;
            }
        }

        console.error('❌ No se pudo determinar el username');
        return null;
    }

    async openModal(tipo, username) {
        if (!username) {
            this.showError('No se pudo determinar el usuario del perfil');
            return;
        }

        console.log(`🚀 Abriendo modal: ${tipo} para ${username}`);

        this.currentType = tipo;
        this.currentUsername = username;
        this.currentOffset = 0;
        this.hasMore = true;

        // Configurar título
        const title = tipo === 'seguidos' ? 'Usuarios que sigue' : 'Seguidores';
        document.getElementById('chainFeedModalTitle').textContent = title;

        // Mostrar modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Cargar datos
        await this.loadData(true);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    async loadData(isInitial = false) {
        if (this.loading) return;
        
        this.loading = true;
        const modalBody = document.getElementById('chainFeedModalBody');
        const footer = document.getElementById('chainFeedModalFooter');

        if (isInitial) {
            modalBody.innerHTML = `
                <div class="chainfeed-loading" style="text-align: center; padding: 40px 24px; color: #666;">
                    <div class="chainfeed-spinner" style="width: 40px; height: 40px; border: 4px solid #f0f0f0; border-top: 4px solid #1da1f2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                    <p>Cargando...</p>
                </div>
            `;
            footer.style.display = 'none';
        }

        try {
            console.log(`📡 Cargando ${this.currentType} para ${this.currentUsername}`);

           const response = await fetch('../php/obtener_listas_seguimiento.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.currentUsername,
                    tipo: this.currentType,
                    limite: 20,
                    offset: this.currentOffset
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📊 Respuesta del servidor:', data);

            if (data.success) {
                this.renderUsers(data.data, isInitial);
                this.hasMore = data.data.tiene_mas;
                this.currentOffset += data.data.usuarios.length;

                // Mostrar/ocultar botón "Cargar más"
                if (this.hasMore && data.data.usuarios.length > 0) {
                    footer.style.display = 'block';
                } else {
                    footer.style.display = 'none';
                }
            } else {
                this.showError(data.message || 'Error al cargar los datos');
            }
        } catch (error) {
            console.error('❌ Error cargando datos:', error);
            this.showError('Error de conexión. Verifica que el archivo obtener_listas_seguimiento.php existe.');
        } finally {
            this.loading = false;
        }
    }

    async loadMore() {
        if (!this.hasMore || this.loading) return;
        await this.loadData(false);
    }

    renderUsers(data, isInitial) {
        const modalBody = document.getElementById('chainFeedModalBody');
        
        if (isInitial) {
            if (data.usuarios.length === 0) {
                modalBody.innerHTML = `
                    <div class="chainfeed-empty">
                        <p>No hay ${this.currentType} para mostrar</p>
                    </div>
                `;
                return;
            }
            modalBody.innerHTML = '';
        }

        data.usuarios.forEach(user => {
            const userElement = this.createUserElement(user);
            modalBody.appendChild(userElement);
        });
    }

    createUserElement(user) {
        const userDiv = document.createElement('div');
        userDiv.className = 'chainfeed-user-item';
        
        const followButton = this.createFollowButton(user);
        
        userDiv.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.display_name}" class="chainfeed-user-avatar"
                 onerror="this.src='/assets/images/default-avatar.png'">
            <div class="chainfeed-user-info">
                <div class="chainfeed-user-name">${user.display_name}</div>
                <div class="chainfeed-user-username">@${user.username}</div>
                <div class="chainfeed-user-date">${this.formatDate(user.fecha_seguimiento)}</div>
            </div>
            <div class="chainfeed-user-actions">
                ${followButton}
            </div>
        `;

        // Click para ir al perfil
userDiv.addEventListener('click', (e) => {
    if (!e.target.closest('.chainfeed-user-actions')) {
        // Forzar origen absoluto para evitar problemas con /perfil/username
        window.location.href = `${window.location.origin}/perfil?user=${user.username}`;
    }
});

        return userDiv;
    }

createFollowButton(user) {
    if (user.es_usuario_actual) {
        return '<span class="chainfeed-self">Tú</span>';
    }

    // ✅ PRIORIDAD 1: Verificar solicitud pendiente PRIMERO
    if (user.solicitud_pendiente === true) {
        return `
            <button class="chainfeed-btn chainfeed-btn-pending" 
                    disabled
                    data-user-id="${user.id}"
                    title="Solicitud de seguimiento pendiente">
                ⏳ Pendiente
            </button>
        `;
    }

    // ✅ PRIORIDAD 2: Verificar si está siguiendo
    const isFollowing = user.siguiendo === true;
    const buttonClass = isFollowing ? 'chainfeed-btn-following' : 'chainfeed-btn-follow';
    const buttonText = isFollowing ? 'Siguiendo' : 'Seguir';
    
    return `
        <button class="chainfeed-btn ${buttonClass}" 
                onclick="chainFeedSeguimiento.toggleFollow('${user.username}', ${user.id}, this)"
                data-user-id="${user.id}">
            ${buttonText}
        </button>
    `;
}

  async toggleFollow(username, userId, button) {
    if (button.disabled) return;
    
    const isFollowing = button.classList.contains('chainfeed-btn-following');
    const isPending = button.classList.contains('chainfeed-btn-pending');
    const originalText = button.textContent;
    
    button.disabled = true;
    button.textContent = '...';

    try {
        const response = await fetch('../php/manejar_seguimiento.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_username: username,
                action: (isFollowing || isPending) ? 'unfollow' : 'follow'
            })
        });

        const data = await response.json();

        if (data.success) {
            // ✅ NUEVO: Manejar estado pending
            if (data.status === 'pending') {
                button.className = 'chainfeed-btn chainfeed-btn-pending';
                button.textContent = 'Solicitud Enviada ⏳';
                button.disabled = true;
                
                if (window.showNotification) {
                    window.showNotification('⏳ Solicitud de seguimiento enviada');
                }
            }
            // Siguiendo activamente
            else if (data.now_following) {
                button.className = 'chainfeed-btn chainfeed-btn-following';
                button.textContent = 'Siguiendo';
                button.disabled = false;
                
                if (window.showNotification) {
                    window.showNotification(`✅ Ahora sigues a @${username}`);
                }
            }
            // No siguiendo
            else {
                button.className = 'chainfeed-btn chainfeed-btn-follow';
                button.textContent = 'Seguir';
                button.disabled = false;
                
                // Mensaje según acción
                if (data.action_performed === 'cancel_request') {
                    if (window.showNotification) {
                        window.showNotification('❌ Solicitud cancelada');
                    }
                } else {
                    if (window.showNotification) {
                        window.showNotification(`❌ Dejaste de seguir a @${username}`);
                    }
                }
            }

            // Actualizar contadores
            this.updateCounters(data.updated_counts);
        } else {
            throw new Error(data.message || 'Error al procesar seguimiento');
        }
    } catch (error) {
        console.error('Error en seguimiento:', error);
        button.textContent = originalText;
        button.disabled = false;
        
        if (window.showNotification) {
            window.showNotification('❌ Error al procesar la acción');
        }
    }
}

    updateCounters(counts) {
        // Actualizar contadores en la página principal
        const followersElement = document.getElementById('followersCount');
        const followingElement = document.getElementById('followingCount');
        
        if (followersElement && counts.seguidores !== undefined) {
            followersElement.textContent = counts.seguidores;
        }
        
        if (followingElement && counts.siguiendo !== undefined) {
            followingElement.textContent = counts.siguiendo;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
        if (diffDays < 365) return `Hace ${Math.ceil(diffDays / 30)} meses`;
        return `Hace ${Math.ceil(diffDays / 365)} años`;
    }

    showError(message) {
    const modalBody = document.getElementById('chainFeedModalBody');
    modalBody.innerHTML = `
        <div class="chainfeed-empty">
            <p style="color: #ef4444; margin-bottom: 16px;">${message}</p>
            <button onclick="chainFeedSeguimiento.closeModal()" 
                    style="background: linear-gradient(135deg, #6366f1, #a855f7); color: white; border: none; padding: 10px 20px; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
                Cerrar
            </button>
        </div>
    `;
}

}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.chainFeedSeguimiento = new ChainFeedSeguimiento();
});

// Función de debug
window.debugChainFeed = function() {
    const cf = window.chainFeedSeguimiento;
    if (!cf) {
        console.log('❌ Sistema no inicializado');
        return;
    }
    
    console.log('🔍 DEBUG CHAINFEED SEGUIMIENTO:');
    console.log('- Usuario actual:', cf.getCurrentUsername());
    console.log('- Elementos .stat-item:', document.querySelectorAll('.stat-item').length);
    console.log('- Modal presente:', !!document.getElementById('chainFeedModal'));
    
    return {
        username: cf.getCurrentUsername(),
        statItems: document.querySelectorAll('.stat-item').length,
        modalReady: !!document.getElementById('chainFeedModal')
    };
};