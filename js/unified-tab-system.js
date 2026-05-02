// ============================================
// SISTEMA UNIFICADO DE NAVEGACIÓN DE PESTAÑAS
// ============================================

// Estado global de la aplicación
const AppState = {
    currentFeedType: 'posts',
    mainContainer: null,
    observers: {
        viral: null,
        normal: null
    }
};

// Inicializar el sistema al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    AppState.mainContainer = document.getElementById('feedPosts');
    if (!AppState.mainContainer) {
        console.error('Main container #feedPosts not found');
        return;
    }
});

// ============================================
// FUNCIÓN PRINCIPAL: LIMPIAR TODO EL CONTENIDO
// ============================================
function clearAllContent() {
    console.log('🧹 Limpiando todo el contenido...');
    
    // 1. Desconectar TODOS los observers
    disconnectAllObserversUnified();
    
    // 2. Limpiar el contenedor principal completamente
    if (AppState.mainContainer) {
        AppState.mainContainer.innerHTML = '';
        AppState.mainContainer.style.display = 'flex';
        AppState.mainContainer.className = 'feed-posts';
    }
    
    // 3. Remover contenedores específicos si existen
    removeSpecificContainers();
    
    // 4. Resetear estados globales
    resetGlobalStates();
    
    console.log('✅ Contenido limpiado completamente');
}

// ============================================
// DESCONECTAR TODOS LOS OBSERVERS
// ============================================
function disconnectAllObserversUnified() {
    // Observer viral
    if (window.viralScrollObserver) {
        window.viralScrollObserver.disconnect();
        window.viralScrollObserver = null;
    }
    
    // Observer normal
    if (window.normalScrollObserver) {
        window.normalScrollObserver.disconnect();
        window.normalScrollObserver = null;
    }
    
    // Observer en AppState
    if (AppState.observers.viral) {
        AppState.observers.viral.disconnect();
        AppState.observers.viral = null;
    }
    
    if (AppState.observers.normal) {
        AppState.observers.normal.disconnect();
        AppState.observers.normal = null;
    }
    
    console.log('🔌 Todos los observers desconectados');
}

// ============================================
// REMOVER CONTENEDORES ESPECÍFICOS
// ============================================
function removeSpecificContainers() {
    const containersToRemove = [
        '#chain-events-container',
        '#viral-posts-container', 
        '#temp-error-container',
        '.chain-event-card',
        '[id*="chain"]:not(#chainFlashViewer)',
        '[class*="viral-container"]'
    ];
    
    containersToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.remove();
            console.log(`🗑️ Removido: ${selector}`);
        });
    });
}

// ============================================
// RESETEAR ESTADOS GLOBALES
// ============================================
function resetGlobalStates() {
    // Resetear estado viral si existe
    if (typeof ViralFeedState !== 'undefined') {
        ViralFeedState.isActive = false;
        ViralFeedState.currentPage = 1;
        ViralFeedState.isLoading = false;
        ViralFeedState.hasMore = true;
    }
    
    // Resetear estado Chain si existe
    if (typeof chainEventsData !== 'undefined') {
        chainEventsData = [];
    }
    
    if (typeof chainPagination !== 'undefined') {
        chainPagination = {
            offset: 0,
            limit: 20,
            hasMore: true
        };
    }
    
    console.log('🔄 Estados globales reseteados');
}

// ============================================
// FUNCIONES DE NAVEGACIÓN MEJORADAS
// ============================================

function showVirales() {
    console.log('🔥 Mostrando contenido viral...');
    
    // 1. Limpiar TODO antes de mostrar virales
    clearAllContent();
    
    // 2. Actualizar estado
    AppState.currentFeedType = 'virales';
    updateActiveTabUnified(event.target);
    
    // ✅ 3. NUEVO: Mostrar filtros de virales
    const viralesFilters = document.getElementById('viralesFilters');
    const postsFilters = document.getElementById('postsFilters');
    
    if (viralesFilters) viralesFilters.classList.remove('hidden');
    if (postsFilters) postsFilters.classList.add('hidden');
    
    // 4. Cargar contenido viral
    setTimeout(() => {
        if (typeof loadViralPosts === 'function') {
            loadViralPosts();
        } else {
            showNotificationUnified('⚠️ Función loadViralPosts no disponible', 'error');
        }
    }, 100);
}

function showPosts() {
    console.log('📝 Mostrando posts normales...');
    
    // 1. Limpiar TODO antes de mostrar posts
    clearAllContent();
    
    // 2. Actualizar estado
    AppState.currentFeedType = 'posts';
    updateActiveTabUnified(event.target);
    
    // ✅ 3. NUEVO: Mostrar filtros de posts
    const viralesFilters = document.getElementById('viralesFilters');
    const postsFilters = document.getElementById('postsFilters');
    
    if (viralesFilters) viralesFilters.classList.add('hidden');
    if (postsFilters) postsFilters.classList.remove('hidden');
    
    // 4. Cargar contenido normal
    setTimeout(() => {
        if (typeof loadFeedPosts === 'function') {
            loadFeedPosts();
        } else if (typeof inicializarFeed === 'function') {
            inicializarFeed();
        } else {
            showNotificationUnified('⚠️ Función de posts no disponible', 'error');
        }
    }, 100);
}

function showChain() {
    console.log('⛓️ Mostrando eventos Chain...');
    
    // 1. Limpiar TODO antes de mostrar Chain
    clearAllContent();
    
    // 2. Actualizar estado
    AppState.currentFeedType = 'chain';
    updateActiveTabUnified(event.target);
    
    // ✅ 3. NUEVO: Ocultar todos los filtros
    const viralesFilters = document.getElementById('viralesFilters');
    const postsFilters = document.getElementById('postsFilters');
    
    if (viralesFilters) viralesFilters.classList.add('hidden');
    if (postsFilters) postsFilters.classList.add('hidden');
    
    // 4. Verificar main container
    const mainContainer = document.getElementById('feedPosts');
    if (!mainContainer) {
        console.error('❌ Main container #feedPosts not found');
        showNotificationUnified('Error: Contenedor principal no encontrado', 'error');
        return;
    }
    
    // 5. Crear contenedor Chain directamente
    console.log('🔗 Creando contenedor Chain...');
    
    // Limpiar completamente el main container
    mainContainer.innerHTML = '';
    mainContainer.style.display = 'block';
    
    // Crear contenedor Chain
    const chainContainer = document.createElement('div');
    chainContainer.id = 'chain-events-container';
    chainContainer.style.cssText = `
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 1rem;
        min-height: 400px;
        background: transparent;
    `;
    
    // Insertar en main container
    mainContainer.appendChild(chainContainer);
    
    // Verificar que se creó correctamente
    const verifyContainer = document.getElementById('chain-events-container');
    if (!verifyContainer) {
        console.error('❌ Failed to create chain container');
        return;
    }
    
    console.log('✅ Chain container created successfully');
    
    // 6. Cargar contenido Chain
    setTimeout(() => {
        if (typeof loadChainContent === 'function') {
            loadChainContent();
        } else {
            console.error('❌ loadChainContent function not available');
            showNotificationUnified('⚠️ Función loadChainContent no disponible', 'error');
        }
    }, 200);
}

function showMarket() {
    console.log('💰 Mostrando Market...');
    
    // 1. Limpiar TODO
    clearAllContent();
    
    // 2. Actualizar estado
    AppState.currentFeedType = 'market';
    updateActiveTabUnified(event.target);
    
    // ✅ 3. NUEVO: Ocultar todos los filtros
    const viralesFilters = document.getElementById('viralesFilters');
    const postsFilters = document.getElementById('postsFilters');
    
    if (viralesFilters) viralesFilters.classList.add('hidden');
    if (postsFilters) postsFilters.classList.add('hidden');
    
    // 4. Mostrar placeholder
    if (AppState.mainContainer) {
        AppState.mainContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; background: rgba(26, 26, 36, 0.5); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">💰</div>
                <h2 style="color: var(--primary); margin-bottom: 1rem;">Market ChainFeed</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Esta funcionalidad estará disponible próximamente</p>
                <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 1.5rem;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        🚀 Aquí podrás comprar, vender y intercambiar tokens CFT<br>
                        📈 Ver estadísticas de mercado en tiempo real<br>
                        💎 Participar en subastas de NFTs exclusivos
                    </p>
                </div>
            </div>
        `;
    }
    
    showNotificationUnified('💰 Función Market próximamente disponible');
}

// ============================================
// ACTUALIZAR TAB ACTIVO
// ============================================
function updateActiveTabUnified(activeButton) {
    // Remover clase active de todos los tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Agregar clase active al tab clickeado
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    console.log(`📑 Tab activo: ${AppState.currentFeedType}`);
}

// ============================================
// FUNCIÓN DE UTILIDAD: MOSTRAR NOTIFICACIÓN
// ============================================
function showNotificationUnified(message, type = "info") {
    // Si ya existe una función showNotification global, usar esa
    if (typeof window.showNotification === 'function') {
        return window.showNotification(message, type);
    }
    
    // Fallback simple
    console.log(`${type.toUpperCase()}: ${message}`);
    
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
        z-index: 10000;
        max-width: 350px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
        ${type === 'error' ? 'border-left: 4px solid #ef4444;' : ''}
    `;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    notification.textContent = `${icon} ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// EXPONER FUNCIONES AL SCOPE GLOBAL
// ============================================
window.showVirales = showVirales;
window.showPosts = showPosts;
window.showChain = showChain;
window.showMarket = showMarket;

// ============================================
// ESTILOS NECESARIOS
// ============================================
if (!document.getElementById('unified-tab-styles')) {
    const style = document.createElement('style');
    style.id = 'unified-tab-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Sistema unificado de navegación cargado');