// ============================================
// VALIDACIÓN DE SESIÓN (EJECUTAR PRIMERO)
// ============================================

/**
 * Valida la sesión al cargar la página
 * Si no hay sesión válida, redirige a home
 */
function validateSessionOnLoad() {
    // Hacer llamada SÍNCRONA al backend para verificar sesión
    fetch('/php/verificar_sesion.php', {
        method: 'GET',
        credentials: 'include', // Incluir cookies de sesión
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    })
    .then(response => {
        // ⚠️ Si la respuesta no es OK (4xx, 5xx), también es error
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Sin sesión válida`);
        }
        return response.json();
    })
    .then(data => {
        // ✅ Si el servidor retorna success: false, redirigir
        if (!data.success) {
            console.error('❌ Sesión no válida:', data.error_code);
            console.log('Redirigiendo a home...');
            
            // Limpiar localStorage por si acaso
            localStorage.removeItem('chainfeed_user');
            localStorage.removeItem('chainfeed_session');
            
            // Redirigir a home
            window.location.href = '/inicio';
            return;
        }
        
        // ✅ Sesión válida
        console.log('✅ Sesión válida para:', data.user.username);
        SearchConfig.currentUser = data.user.username;
        SearchConfig.currentUserId = data.user.id;
        
        // Guardar info de usuario en config
        SearchConfig.userData = data.user;
        
        // Inicializar la búsqueda
        performSearch();
    })
    .catch(error => {
        console.error('❌ Error validando sesión:', error);
        console.log('Redirigiendo a home por seguridad...');
        
        // En caso de error de conexión, también redirigir
        window.location.href = '/inicio';
    });
}

// ============================================
// CONFIGURACIÓN Y ESTADO
// ============================================

const SearchConfig = {
    currentUser: null,
    currentUserId: null,
    userData: null,
    realUserData: null,
    resultsPerPage: 12,
    currentPage: 1,
    currentSort: 'mutual',
    searchQuery: '',
    isLoading: false,
    totalResults: 0,
    hasMore: false
};

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

function getCurrentUser() {
    // Usar datos de la sesión validada
    return SearchConfig.currentUser;
}

function generateAvatarInitials(username) {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
}

// ============================================
// FUNCIÓN DE BÚSQUEDA ACTUALIZADA
// ============================================

function performSearch() {
    if (SearchConfig.isLoading) return;
    
    showLoading();
    SearchConfig.currentPage = 1;
    
    const params = new URLSearchParams({
        q: SearchConfig.searchQuery,
        sort: SearchConfig.currentSort,
        page: SearchConfig.currentPage,
        limit: SearchConfig.resultsPerPage
    });
    
    fetch(`/php/search_users.php?${params}`, {
        method: 'GET',
        credentials: 'include', // ✅ Incluir cookies de sesión
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            SearchConfig.totalResults = data.pagination.total;
            SearchConfig.hasMore = data.pagination.has_more;
            SearchConfig.currentUser = data.search_info.current_user;
            
            renderUsers(data.users);
            updateResultsCount(data.users.length, data.pagination.total);
            
            const loadMoreSection = document.getElementById('loadMoreSection');
            if (data.pagination.has_more) {
                loadMoreSection.style.display = 'block';
            } else {
                loadMoreSection.style.display = 'none';
            }
            
        } else {
            // ⚠️ Si error_code es INVALID_SESSION, redirigir
            if (data.error_code === 'INVALID_SESSION' || data.error_code === 'NO_SESSION') {
                console.error('❌ Sesión inválida o expirada:', data.error_code);
                showNotification('⚠️ Tu sesión ha expirado. Redirigiendo...', 'error');
                
                setTimeout(() => {
                    window.location.href = '/inicio';
                }, 2000);
                return;
            }
            
            showNotification(data.message || 'Error al buscar usuarios', 'error');
            renderEmptyState();
        }
    })
    .catch(error => {
        console.error('Error en búsqueda:', error);
        showNotification('Error de conexión al buscar usuarios', 'error');
        renderEmptyState();
    })
    .finally(() => {
        hideLoading();
    });
}

// ============================================
// FUNCIÓN DE SEGUIMIENTO ACTUALIZADA
// ============================================

function toggleFollow(button, userId) {
    if (button.disabled) return;
    
    const userCard = button.closest('.user-card');
    const usernameElement = userCard.querySelector('.user-username');
    const username = usernameElement.textContent.replace('@', '').trim();
    
    const isPending = button.classList.contains('pending');
    const isFollowing = button.classList.contains('following');
    
    let action;
    if (isPending || isFollowing) {
        action = 'unfollow';
    } else {
        action = 'follow';
    }
    
    button.disabled = true;
    const originalText = button.textContent;
    const originalClasses = button.className;
    
    if (action === 'follow') {
        button.textContent = 'Enviando...';
    } else if (isPending) {
        button.textContent = 'Cancelando...';
    } else {
        button.textContent = 'Dejando...';
    }
    
    fetch('/php/manejar_seguimiento_busqueda.php', {
        method: 'POST',
        credentials: 'include', // ✅ Incluir cookies de sesión
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            target_username: username,
            action: action
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            button.classList.remove('following', 'pending');
            
            if (data.status === 'pending') {
                button.classList.add('pending');
                button.textContent = 'Pendiente';
                showNotification(`⏳ Solicitud enviada a @${username}`);
            }
            else if (data.now_following) {
                button.classList.add('following');
                button.textContent = 'Siguiendo';
                showNotification(`✅ Ahora sigues a @${username}`);
                
                if (SearchConfig.currentSort === 'mutual') {
                    setTimeout(() => {
                        userCard.style.animation = 'cardDisappear 0.5s ease';
                        setTimeout(() => {
                            userCard.remove();
                            const currentCount = document.querySelectorAll('.user-card').length;
                            updateResultsCount(currentCount, SearchConfig.totalResults - 1);
                        }, 500);
                    }, 1500);
                }
            }
            else {
                button.classList.remove('following', 'pending');
                button.textContent = 'Seguir';
                
                if (data.action_performed === 'cancel_request') {
                    showNotification(`❌ Solicitud cancelada a @${username}`);
                } else {
                    showNotification(`❌ Has dejado de seguir a @${username}`);
                }
            }
            
            if (data.updated_counts) {
                updateUserStats(userCard, data.updated_counts);
            }
            
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
            
        } else {
            // ⚠️ Validar sesión también aquí
            if (data.error_code === 'INVALID_SESSION' || data.error_code === 'NO_SESSION') {
                console.error('❌ Sesión inválida:', data.error_code);
                showNotification('⚠️ Tu sesión ha expirado', 'error');
                setTimeout(() => {
                    window.location.href = '/inicio';
                }, 2000);
                return;
            }
            
            button.className = originalClasses;
            button.textContent = originalText;
            showNotification(data.message || 'Error al actualizar seguimiento', 'error');
        }
    })
    .catch(error => {
        console.error('Error en seguimiento:', error);
        button.className = originalClasses;
        button.textContent = originalText;
        showNotification('Error de conexión al procesar seguimiento', 'error');
    })
    .finally(() => {
        button.disabled = false;
    });
}

// ============================================
// RENDERIZADO DE USUARIOS
// ============================================

function createUserCardHTML(user, index) {
    const isFollowing = user.is_following;
    const isPending = user.is_pending || false;
    const isOnline = user.is_online;
    const mutualCount = user.mutual_followers_count || 0;
    
    const mutualIndicator = SearchConfig.currentSort === 'mutual' && mutualCount > 0 
        ? `<span class="mutual-indicator" title="${mutualCount} de tus seguidos siguen a este usuario">👥 ${mutualCount}</span>`
        : '';
    
    let buttonClass = '';
    let buttonText = 'Seguir';
    let buttonDisabled = '';
    
    if (isPending) {
        buttonClass = 'pending';
        buttonText = 'Pendiente';
        buttonDisabled = 'disabled';
    } else if (isFollowing) {
        buttonClass = 'following';
        buttonText = 'Siguiendo';
    }
    
    return `
        <div class="user-card" style="animation-delay: ${index * 0.1}s" data-user-id="${user.id}" onclick="goToUserProfile('${user.username}')">
            <div class="user-header">
                <div class="user-avatar">
                    <img src="${user.avatar_url}" alt="${user.display_name}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                    <div style="display:none; width:100%; height:100%; background:linear-gradient(135deg, var(--primary), var(--accent)); border-radius:50%; align-items:center; justify-content:center; font-weight:bold; color:white; font-size:1.2rem;">
                        ${generateAvatarInitials(user.username)}
                    </div>
                    ${isOnline ? '<div class="user-online"></div>' : ''}
                </div>
                <div class="user-info">
                    <div class="user-name">
                        ${highlightText(user.display_name, SearchConfig.searchQuery)}
                        ${user.verified ? '<span class="verified-badge">✓</span>' : ''}
                        ${mutualIndicator}
                    </div>
                    <div class="user-username">${highlightText('@' + user.username, SearchConfig.searchQuery)}</div>
                    <div class="user-stats">
                        <span>${formatNumber(user.followers_count)} seguidores</span>
                        <span>${formatNumber(user.following_count)} siguiendo</span>
                        <span class="cft-indicator">${formatNumber(user.token_balance)} CFT</span>
                    </div>
                </div>
            </div>
            
            <div class="user-bio">
                ${highlightText(user.bio || 'Usuario de ChainFeed explorando Web3 🚀', SearchConfig.searchQuery)}
            </div>
            
            <div class="user-actions" onclick="event.stopPropagation()">
                <button class="follow-btn ${buttonClass}" onclick="toggleFollow(this, ${user.id})" ${buttonDisabled}>
                    ${buttonText}
                </button>
                <div class="secondary-actions">
                    <button class="action-btn" onclick="sendMessage('${user.username}')" title="Enviar mensaje">
                        ✉️
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderUsers(users) {
    const usersGrid = document.getElementById('usersGrid');
    
    if (users.length === 0) {
        renderEmptyState();
        return;
    }
    
    const usersHTML = users.map((user, index) => createUserCardHTML(user, index)).join('');
    usersGrid.innerHTML = usersHTML;
}

function renderEmptyState() {
    const usersGrid = document.getElementById('usersGrid');
    let emptyMessage = '';
    let emptyIcon = '🔍';
    
    if (SearchConfig.currentSort === 'mutual' && !SearchConfig.searchQuery) {
        emptyIcon = '👥';
        emptyMessage = 'No hay sugerencias de seguidos mutuos disponibles. Sigue a más usuarios para obtener mejores recomendaciones.';
    } else if (SearchConfig.searchQuery) {
        emptyMessage = `No hay resultados para "${SearchConfig.searchQuery}". Prueba con términos diferentes o menos específicos.`;
    } else {
        emptyMessage = 'No hay usuarios que coincidan con los filtros seleccionados.';
    }
    
    usersGrid.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">${emptyIcon}</div>
            <h3 class="empty-title">No se encontraron usuarios</h3>
            <p class="empty-description">${emptyMessage}</p>
        </div>
    `;
}

// ============================================
// CARGAR MÁS USUARIOS (PAGINACIÓN)
// ============================================

function loadMoreUsers() {
    if (SearchConfig.isLoading || !SearchConfig.hasMore) return;
    
    SearchConfig.currentPage++;
    SearchConfig.isLoading = true;
    
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Cargando...';
        loadMoreBtn.disabled = true;
    }
    
    const params = new URLSearchParams({
        q: SearchConfig.searchQuery,
        sort: SearchConfig.currentSort,
        page: SearchConfig.currentPage,
        limit: SearchConfig.resultsPerPage
    });
    
    fetch(`/php/search_users.php?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.users.length > 0) {
            const usersGrid = document.getElementById('usersGrid');
            const existingHTML = usersGrid.innerHTML;
            
            const newUsersHTML = data.users.map((user, index) => 
                createUserCardHTML(user, index + (SearchConfig.currentPage - 1) * SearchConfig.resultsPerPage)
            ).join('');
            
            usersGrid.innerHTML = existingHTML + newUsersHTML;
            
            SearchConfig.hasMore = data.pagination.has_more;
            
            const totalShown = SearchConfig.currentPage * SearchConfig.resultsPerPage;
            updateResultsCount(Math.min(totalShown, data.pagination.total), data.pagination.total);
            
            if (!data.pagination.has_more) {
                document.getElementById('loadMoreSection').style.display = 'none';
                showNotification('📝 Has visto todos los usuarios disponibles');
            }
            
        } else {
            showNotification('No hay más usuarios para mostrar', 'info');
            document.getElementById('loadMoreSection').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error cargando más usuarios:', error);
        showNotification('Error al cargar más usuarios', 'error');
        SearchConfig.currentPage--;
    })
    .finally(() => {
        SearchConfig.isLoading = false;
        if (loadMoreBtn) {
            loadMoreBtn.textContent = 'Cargar más usuarios';
            loadMoreBtn.disabled = false;
        }
    });
}

// ============================================
// FUNCIONES DE FILTRADO Y ORDENAMIENTO
// ============================================

function toggleSortDropdown() {
    const btn = document.getElementById('sortDropdownBtn');
    const menu = document.getElementById('sortDropdownMenu');
    
    btn.classList.toggle('active');
    menu.classList.toggle('active');
}

function selectSort(value, text) {
    SearchConfig.currentSort = value;
    
    document.getElementById('currentSortText').textContent = text;
    
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-value="${value}"]`).classList.add('active');
    
    document.getElementById('sortDropdownBtn').classList.remove('active');
    document.getElementById('sortDropdownMenu').classList.remove('active');
    
    performSearch();
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ✅ VALIDAR SESIÓN PRIMERO (antes de todo)
    validateSessionOnLoad();
    
    initializeSearch();
    setupScrollEffects();
    setupSearchInput();
    
    document.addEventListener('keydown', function(e) {
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
});

function initializeSearch() {
    document.getElementById('currentSortText').textContent = 'Seguidos mutuos';
    
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector('[data-value="mutual"]').classList.add('active');
    
    updateResultsCount(0, 0);
}

function setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', function() {
        const value = this.value.trim();
        
        if (value) {
            clearButton.classList.add('visible');
            SearchConfig.searchQuery = value;
            debounceSearch(value);
        } else {
            clearButton.classList.remove('visible');
            SearchConfig.searchQuery = '';
            performSearch();
        }
    });

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

let searchTimeout;
function debounceSearch(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch();
    }, 300);
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function updateUserStats(userCard, updatedCounts) {
    const statsElement = userCard.querySelector('.user-stats');
    if (statsElement && updatedCounts) {
        const cftElement = statsElement.querySelector('.cft-indicator');
        const currentTokens = cftElement ? cftElement.textContent.replace(' CFT', '').trim() : '0';
        
        statsElement.innerHTML = `
            <span>${formatNumber(updatedCounts.followers_count || updatedCounts.seguidores || 0)} seguidores</span>
            <span>${formatNumber(updatedCounts.following_count || updatedCounts.siguiendo || 0)} siguiendo</span>
            <span class="cft-indicator">${currentTokens} CFT</span>
        `;
    }
}

function sendMessage(username) {
    showNotification(`✉️ Abriendo chat con @${username}...`);
    
    const userCard = event.target.closest('.user-card');
    const userId = userCard ? userCard.dataset.userId : null;
    
    if (!userId) {
        showNotification('❌ Error: No se pudo obtener el ID del usuario', 'error');
        return;
    }
    
    setTimeout(() => {
        localStorage.setItem('chainfeed_open_chat', userId);
        window.location.href = '/chat';
    }, 1000);
}

function goToUserProfile(username) {
    window.location.href = `/perfil?user=${username}`;
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    searchInput.value = '';
    clearButton.classList.remove('visible');
    SearchConfig.searchQuery = '';
    SearchConfig.currentPage = 1;
    
    performSearch();
    searchInput.focus();
}

function updateResultsCount(shown, total) {
    const resultsCount = document.getElementById('resultsCount');
    
    if (SearchConfig.currentSort === 'mutual' && !SearchConfig.searchQuery) {
        resultsCount.textContent = `${formatNumber(total)} usuarios sugeridos por tus seguidos`;
    } else {
        resultsCount.textContent = `Mostrando ${shown} de ${formatNumber(total)} usuarios`;
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function highlightText(text, query) {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function showLoading() {
    SearchConfig.isLoading = true;
    const usersGrid = document.getElementById('usersGrid');
    
    const loadingMessage = SearchConfig.currentSort === 'mutual' 
        ? 'Buscando recomendaciones de tus seguidos...'
        : 'Buscando usuarios...';
        
    usersGrid.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <h3>${loadingMessage}</h3>
            <p>Explorando la comunidad ChainFeed</p>
        </div>
    `;
}

function hideLoading() {
    SearchConfig.isLoading = false;
}

function goToHome() {
    window.location.href = '/inicio';
}

function goToProfile() {
    if (SearchConfig.currentUser) {
        window.location.href = `/perfil?user=${SearchConfig.currentUser}`;
    } else {
        showNotification('⚠️ Error al cargar tu perfil');
    }
}

function openMessages() {
    window.location.href = '/chat';
}

function openNotifications() {
    window.location.href = '/notificaciones';
}

function showNotification(message, type = "info") {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: rgba(26, 26, 36, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1rem 1.5rem;
        color: white;
        animation: slideInRight 0.3s ease;
        z-index: 10000;
        max-width: 350px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        ${type === 'error' ? 'border-left: 4px solid #ff6b6b;' : ''}
        ${type === 'success' ? 'border-left: 4px solid #4facfe;' : ''}
    `;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : '✨';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">${icon}</div>
            <div style="font-size: 0.95rem;">${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    const container = event.target.closest('.sort-dropdown-container');
    if (!container) {
        const btn = document.getElementById('sortDropdownBtn');
        const menu = document.getElementById('sortDropdownMenu');
        if (btn && menu) {
            btn.classList.remove('active');
            menu.classList.remove('active');
        }
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes cardDisappear {
        from { transform: translateY(0) scale(1); opacity: 1; }
        to { transform: translateY(-20px) scale(0.95); opacity: 0; }
    }
    
    .mutual-indicator {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        border: 1px solid rgba(16, 185, 129, 0.3);
        margin-left: 0.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .user-card:hover .mutual-indicator {
        background: rgba(16, 185, 129, 0.2);
        transform: scale(1.05);
    }
    
    .follow-btn.pending {
        background: rgba(255, 193, 7, 0.1);
        color: #ffc107;
        border: 2px solid rgba(255, 193, 7, 0.3);
        opacity: 0.7;
        cursor: not-allowed;
        pointer-events: none;
    }
    
    .follow-btn.pending:hover {
        background: rgba(255, 193, 7, 0.1);
        border-color: rgba(255, 193, 7, 0.3);
        transform: none;
    }
`;
document.head.appendChild(style);