/**
 * ============================================
 * SISTEMA DE PROMOCIÓN DE CONTENIDO - CHAINFEED
 * ============================================
 * Archivo: js/promocionar.js
 * Versión: 1.1 - COMPLETA Y FUNCIONAL
 */

const PromotionSystem = {
    currentContent: null,
    currentUser: null, 
    activePromotions: [],
    userBalance: 0,
    selectedPlan: null,
    plans: {
        daily: {
            name: '1 Día',
            duration: '24 horas',
            price: 500,
            type: 'daily',
            icon: '⚡',
            description: 'Promoción rápida por 1 día',
            badge: 'RÁPIDO'
        },
        tendays: {
            name: '10 Días',
            duration: '10 días completos',
            price: 4500,
            type: '10days',
            icon: '🚀',
            description: 'Promoción extendida',
            badge: 'POPULAR',
            discount: '10% OFF'
        },
        monthly: {
            name: '30 Días',
            duration: '1 mes completo',
            price: 12000,
            type: 'monthly',
            icon: '⭐',
            description: 'Máxima visibilidad',
            discount: '20% OFF'
        }
    },
    isProcessing: false,
    initialized: false
};

/**
 * ============================================
 * INICIALIZACIÓN DEL SISTEMA
 * ============================================
 */
async function initializePromotionSystem() {
    if (PromotionSystem.initialized) {
        console.log('⚠️ Sistema ya inicializado');
        return;
    }
    
    console.log('📢 Inicializando sistema de promoción...');
    
    // PRIMERO: Cargar usuario actual
    await loadCurrentUser();
    
    injectPromotionStyles();
    createPromotionModal();
    setupPromotionEventListeners();
    
    // Cargar promociones activas y agregar badges
    await loadActivePromotions();  // ← AGREGAR ESTA LÍNEA
    
    // Intentar agregar botones inmediatamente
    addPromotionButtons();
    
    // Configurar observer
    setupContentObserver();
    
    // Reintentar cada 2 segundos por 10 segundos
    let attempts = 0;
    const maxAttempts = 5;
    const retryInterval = setInterval(async () => {  // ← hacer async
        attempts++;
        console.log(`🔄 Intento ${attempts} de agregar botones de promoción...`);
        addPromotionButtons();
        
        // Re-aplicar badges en cada intento
        if (PromotionSystem.activePromotions.length > 0) {
            addPromotionBadgesToContent(PromotionSystem.activePromotions);
        }
        
        if (attempts >= maxAttempts) {
            clearInterval(retryInterval);
            console.log('✅ Sistema de promoción completamente inicializado');
        }
    }, 2000);
    
    PromotionSystem.initialized = true;
}

/**
 * ============================================
 * INYECCIÓN DE ESTILOS CSS
 * ============================================
 */
function injectPromotionStyles() {
    if (document.getElementById('promotion-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'promotion-styles';
    style.textContent = `
        /* ============================================
           ESTILOS DEL SISTEMA DE PROMOCIÓN - ACTUALIZADOS
           ============================================ */
        
        /* Opción de promoción en menú dropdown */
        .post-dropdown-item[data-promo-option] {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1.25rem;
            color: #f59e0b !important;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            background: transparent;
            width: 100%;
            text-align: left;
            font-size: 0.95rem;
            font-family: inherit;
        }
        
        .post-dropdown-item[data-promo-option]:hover {
            background: rgba(245, 158, 11, 0.1) !important;
            color: #f59e0b !important;
            transform: translateX(5px);
        }
        
        /* ============================================
           MODAL DE PROMOCIÓN - NUEVA ESTRUCTURA
           ============================================ */
        
        .promo-modal {
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
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .promo-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .promo-modal-content {
    background: linear-gradient(135deg, #1a1a24 0%, #2a1a3a 100%);
    border: 2px solid #FFD700;
    border-radius: 24px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(255, 215, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s 
ease;
        }
        
        .promo-modal.active .promo-modal-content {
            transform: scale(1);
        }
        
        /* Header del modal */
        .promo-header {
            text-align: center;
            margin-bottom: 1rem;
        }
        
        .promo-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    -webkit-background-clip: text;
    background-clip: text;
    color: antiquewhite;
        }
        
        .promo-subtitle {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.95rem;
            margin: 0;
        }
        
        .promo-close-btn {
            position: absolute;
            top: -1rem;
            right: -1rem;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            color: white;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .promo-close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }
        
        /* Display de balance */
        .balance-display {
background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;
        }
        
        .balance-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
        }
        
        .balance-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #FFD700;
        }
        
        /* Grid de planes - UNA COLUMNA */
        .promo-plans-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        /* Tarjeta de plan - HORIZONTAL */
        .promo-plan-card {
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 1rem 1.25rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .promo-plan-card:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 16px rgba(245, 158, 11, 0.2);
            border-color: rgba(245, 158, 11, 0.5);
        }
        
        .promo-plan-card.selected {
            border-color: #f59e0b;
            background: rgba(245, 158, 11, 0.15);
            box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
        }
        
        .promo-plan-badge {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 6px;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        
        .promo-plan-discount {
            position: absolute;
            top: 2.2rem;
            right: 0.5rem;
            background: #10b981;
            color: white;
            padding: 0.15rem 0.4rem;
            border-radius: 4px;
            font-size: 0.6rem;
            font-weight: 600;
        }
        
        .promo-plan-icon {
            font-size: 2rem;
            flex-shrink: 0;
        }
        
        .promo-plan-name {
            font-size: 1.1rem;
            font-weight: 700;
            margin: 0 0 0.25rem 0;
            color: white;
        }
        
        .promo-plan-description {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
            margin: 0;
        }
        
        .promo-plan-price {
font-size: 1.4rem;
    font-weight: 700;
    color: #f59e0b;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding-left: 1rem;
        }
        
        .promo-plan-price-label {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 400;
        }
        
        /* Información de balance después de selección */
        .promo-balance-info {
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .promo-balance-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .promo-balance-row:last-child {
            margin-bottom: 0;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .promo-balance-label {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
        }
        
        .promo-balance-value {
            font-size: 1rem;
            font-weight: 600;
            color: white;
        }
        
        .promo-balance-value.positive {
            color: #10b981;
        }
        
        .promo-balance-value.negative {
            color: #ef4444;
        }
        
        /* Footer del modal */
        .promo-footer {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .promo-cancel-btn {
            padding: 0.75rem 1.25rem;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            border: none;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .promo-cancel-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
        
        .promo-confirm-btn {
            padding: 0.75rem 1.75rem;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .promo-confirm-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(245, 158, 11, 0.5);
        }
        
        .promo-confirm-btn:active {
            transform: translateY(0);
        }
        
        .promo-confirm-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        /* Badge de promoción activa */
        .promo-active-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.2rem 0.6rem;
            background: rgba(99, 102, 241, 0.1);
            color: #b6b7bf;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: 500;
            margin-right: 2rem;
            box-shadow: 0 2px 8px rgb(2 2 8 / 15%);
            animation: promo-badge-appear 0.3s ease;
        }
        
        @keyframes promo-badge-appear {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .promo-modal-content {
        width: 95%;
        padding: 1.5rem;
            }
            
            .promo-footer {
                flex-direction: column;
            }
            
            .promo-cancel-btn,
            .promo-confirm-btn {
                width: 100%;
            }
        }
        
        /* Animaciones */
        @keyframes promo-pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
        
        .promo-processing {
            animation: promo-pulse 1.5s ease-in-out infinite;
        }
        
        /* Scrollbar del modal */
        .promo-modal-content::-webkit-scrollbar {
            width: 6px;
        }
        
        .promo-modal-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .promo-modal-content::-webkit-scrollbar-thumb {
            background: rgba(245, 158, 11, 0.5);
            border-radius: 3px;
        }
        
        .promo-modal-content::-webkit-scrollbar-thumb:hover {
            background: rgba(245, 158, 11, 0.7);
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Estilos de promoción inyectados (nueva estructura)');
}

/**
 * ============================================
 * CARGAR USUARIO ACTUAL
 * ============================================
 */
async function loadCurrentUser() {
    try {
        console.log('👤 Cargando usuario actual...');
        
        // OPCIÓN 1: Verificar en CHAINFEED_CONFIG si existe
        if (window.CHAINFEED_CONFIG?.currentUser?.username) {
            PromotionSystem.currentUser = window.CHAINFEED_CONFIG.currentUser.username;
            console.log(`✅ Usuario cargado desde CHAINFEED_CONFIG: ${PromotionSystem.currentUser}`);
            return true;
        }
        
        // OPCIÓN 2: Verificar en CommentsSystem si existe
        if (window.CommentsSystem?.currentUser?.username) {
            PromotionSystem.currentUser = window.CommentsSystem.currentUser.username;
            console.log(`✅ Usuario cargado desde CommentsSystem: ${PromotionSystem.currentUser}`);
            return true;
        }
        
        // OPCIÓN 3: Llamar al endpoint
        const response = await fetch('/php/verificar_sesion.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success && data.user && data.user.username) {
            PromotionSystem.currentUser = data.user.username;
            console.log(`✅ Usuario actual cargado desde API: ${PromotionSystem.currentUser}`);
            return true;
        } else {
            console.warn('⚠️ No hay sesión activa o usuario no encontrado');
            PromotionSystem.currentUser = null;
            return false;
        }
    } catch (error) {
        console.error('❌ Error cargando usuario actual:', error);
        PromotionSystem.currentUser = null;
        return false;
    }
}

/**
 * ============================================
 * CARGAR PROMOCIONES ACTIVAS
 * ============================================
 */
async function loadActivePromotions() {
    try {
        console.log('🔄 Cargando promociones activas...');
        
        const response = await fetch('/php/obtener_promociones_activas.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ ${data.promociones.length} promociones activas cargadas`);
            
            // Guardar en el sistema
            PromotionSystem.activePromotions = data.promociones;
            
            // Agregar badges al contenido
            addPromotionBadgesToContent(data.promociones);
            
            return data.promociones;
        } else {
            console.warn('⚠️ Error cargando promociones:', data.message);
            PromotionSystem.activePromotions = [];
            return [];
        }
    } catch (error) {
        console.error('❌ Error cargando promociones activas:', error);
        PromotionSystem.activePromotions = [];
        return [];
    }
}

/**
 * ============================================
 * AGREGAR BADGES A CONTENIDO PROMOCIONADO
 * ============================================
 */
function addPromotionBadgesToContent(promociones) {
    if (!promociones || promociones.length === 0) {
        console.log('📭 No hay promociones activas para mostrar');
        return;
    }
    
    console.log(`🔍 Intentando agregar ${promociones.length} badges...`);
    
    let badgesAdded = 0;
    
    promociones.forEach(promo => {
        console.log(`🔍 Procesando promo:`, {
            content_type: promo.content_type,
            content_id: promo.content_id,
            promotion_end: promo.promotion_end
        });
        
        // Buscar el elemento del contenido
        let element = null;
        
        if (promo.content_type === 'post') {
            element = document.querySelector(`[data-post-id="${promo.content_id}"]`);
            console.log(`🔍 Buscando post ${promo.content_id}:`, element ? '✅ Encontrado' : '❌ No encontrado');
        } else if (promo.content_type === 'event') {
            element = document.querySelector(`[data-event-id="${promo.content_id}"]`);
            console.log(`🔍 Buscando event ${promo.content_id}:`, element ? '✅ Encontrado' : '❌ No encontrado');
        }
        
        if (!element) {
            console.warn(`⚠️ Elemento no encontrado para ${promo.content_type} ${promo.content_id}`);
            return;
        }
        
        // Verificar si ya tiene badge
        if (element.querySelector('.promo-active-badge')) {
            console.log(`⚠️ Ya tiene badge: ${promo.content_type} ${promo.content_id}`);
            return;
        }
        
        // Buscar contenedor del header
        let headerContainer = null;
        
        if (promo.content_type === 'event') {
            headerContainer = element.querySelector('.chain-event-header');
            console.log('🔍 Buscando .chain-event-header:', headerContainer ? '✅' : '❌');
        } else {
            const cardContent = element.querySelector('.card-content');
            console.log('🔍 Buscando .card-content:', cardContent ? '✅' : '❌');
            
            if (cardContent) {
                headerContainer = cardContent.querySelector('div[style*="display: flex"]') ||
                                cardContent.querySelector('div:first-child');
                console.log('🔍 Header container encontrado:', headerContainer ? '✅' : '❌');
            }
        }
        
        if (!headerContainer) {
            console.error(`❌ No se encontró headerContainer para ${promo.content_type} ${promo.content_id}`);
            console.log('📝 Estructura del elemento:', element.innerHTML.substring(0, 500));
            return;
        }
        
        // Calcular tiempo restante en tiempo real desde end_date
        let badgeText;
        
        if (promo.promotion_end) {
            const endDate = new Date(promo.promotion_end);
            const now = new Date();
            const diffMs = endDate - now;
            
            if (diffMs <= 0) {
                badgeText = 'Promocionado - Expirando';
          } else {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 24) {
        if (diffHours < 1) {
            badgeText = `Promocionado - ${diffMinutes} min`;
        } else {
            badgeText = `Promocionado - ${diffHours}h`;
        }
    } else {
        // ✅ CORRECCIÓN: No usar ceil directamente
        const diffDays = Math.floor(diffHours / 24);
        badgeText = `Promocionado - ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    }
}
        } else {
            badgeText = `Promocionado - ${promo.dias_restantes || 0} día${promo.dias_restantes !== 1 ? 's' : ''}`;
        }
        
        const badge = document.createElement('div');
        badge.className = 'promo-active-badge';
        badge.innerHTML = `
            <span>🚀</span>
            <span>${badgeText}</span>
        `;
        
        headerContainer.appendChild(badge);
        badgesAdded++;
        
        console.log(`✅ Badge agregado a ${promo.content_type} ${promo.content_id} - ${badgeText}`);
        
        // Desactivar opción del menú
        const promoOption = element.querySelector('[data-promo-option]');
        if (promoOption) {
            promoOption.style.opacity = '0.5';
            promoOption.style.pointerEvents = 'none';
            promoOption.querySelector('span:last-child').textContent = '✓ Ya promocionado';
        }
    });
    
    console.log(`📊 Total badges agregados: ${badgesAdded} de ${promociones.length}`);
}
/**
 * ============================================
 * CREACIÓN DEL MODAL
 * ============================================
 */
function createPromotionModal() {
    if (document.getElementById('promotionModal')) {
        console.log('⚠️ Modal ya existe');
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'promotionModal';
    modal.className = 'promo-modal';
    
    modal.innerHTML = `
        <div class="promo-modal-content">
            <div class="promo-header">
                <h2 class="promo-title">📢 Promover Contenido</h2>
                <p class="promo-subtitle">Aumenta la visibilidad de tu contenido</p>
            </div>
            
            <div class="balance-display">
                <div class="balance-label">Tu balance actual</div>
                <div class="balance-value" id="balanceValue">0 CFT</div>
            </div>
            
            <div class="promo-plans-grid" id="promoPlansGrid">
                <!-- Se llena dinámicamente -->
            </div>
            
            <div class="promo-balance-info" id="promoBalanceInfo" style="display: none;">
                <!-- Se llena dinámicamente -->
            </div>
            
            <div class="promo-footer">
                <button class="promo-cancel-btn" onclick="closePromotionModal()">Cancelar</button>
                <button class="promo-confirm-btn" id="promoConfirmBtn" onclick="confirmPromotion()" disabled>
                    Confirmar Promoción
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closePromotionModal();
        }
    });
    
    console.log('✅ Modal de promoción creado (nueva estructura)');
}

/**
 * ============================================
 * EVENT LISTENERS
 * ============================================
 */
function setupPromotionEventListeners() {
    // Listener para tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('promotionModal');
            if (modal && modal.classList.contains('active')) {
                closePromotionModal();
            }
        }
    });
    
    // Listener para cerrar menús al hacer scroll
    let scrollTimeout;
    window.addEventListener('scroll', function(e) {
        // Usar debounce para no cerrar inmediatamente
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const openMenus = document.querySelectorAll('.post-dropdown.active, [id^="chainEventDropdown"].active');
            if (openMenus.length > 0) {
                console.log('📜 Scroll detectado - cerrando menús abiertos');
                closeAllMenus();
            }
        }, 100);
    }, { passive: true });
    
    // Listener para cerrar menús al hacer clic fuera
    document.addEventListener('click', function(e) {
        const openMenus = document.querySelectorAll('.post-dropdown.active, [id^="chainEventDropdown"].active');
        if (openMenus.length === 0) return;
        
        // Verificar si el clic fue dentro de un menú o botón de menú
        const isMenuClick = e.target.closest('.post-dropdown, [id^="chainEventDropdown"], .post-menu-btn, .chain-event-menu-btn');
        
        if (!isMenuClick) {
            console.log('🖱️ Clic fuera del menú - cerrando menús abiertos');
            closeAllMenus();
        }
    });
    
    console.log('✅ Event listeners configurados');
}

/**
 * ============================================
 * AGREGAR BOTONES DE PROMOCIÓN
 * ============================================
 */
function addPromotionButtons() {
    let buttonsAdded = 0;
    
    // Para posts normales - MÚLTIPLES SELECTORES
    const postSelectors = [
        '.content-card[data-post-id]',
        '[data-post-id]',
        '.post-card'
    ];
    
    postSelectors.forEach(selector => {
        const posts = document.querySelectorAll(selector);
        posts.forEach(post => {
            const postId = post.dataset.postId || post.getAttribute('data-post-id');
            if (postId && !post.querySelector('[data-promo-option]')) {
                if (addPromotionMenuOption(post, 'post', postId)) {
                    buttonsAdded++;
                }
            }
        });
    });
    
    // Para eventos Chain
    const eventSelectors = [
        '.chain-event-card[data-event-id]',
        '[data-event-id]'
    ];
    
    eventSelectors.forEach(selector => {
        const events = document.querySelectorAll(selector);
        events.forEach(event => {
            const eventId = event.dataset.eventId || event.getAttribute('data-event-id');
            if (eventId && !event.querySelector('[data-promo-option]')) {
                if (addPromotionMenuOption(event, 'event', eventId)) {
                    buttonsAdded++;
                }
            }
        });
    });
    
    if (buttonsAdded > 0) {
        console.log(`✅ ${buttonsAdded} botones de promoción agregados`);
    }
}

/**
 * ============================================
 * AGREGAR OPCIÓN AL MENÚ
 * ============================================
 */
function addPromotionMenuOption(element, type, contentId) {
    try {
        // Verificar ownership
        if (!isContentOwner(element)) {
            return false;
        }
        
        // Buscar el menú dropdown
        let dropdown = findDropdownMenu(element, type, contentId);
        
        if (!dropdown) {
            console.warn(`⚠️ No se encontró menú dropdown para ${type} ${contentId}`);
            return false;
        }
        
        // Verificar si ya existe la opción
        if (dropdown.querySelector('[data-promo-option]')) {
            return false;
        }
        
        // Buscar punto de inserción
        const insertionPoint = findInsertionPoint(dropdown);
        if (!insertionPoint) {
            console.warn(`⚠️ No se encontró punto de inserción en ${type} ${contentId}`);
            return false;
        }
        
        // Crear opción de promoción
        const promoOption = createPromotionOption(type, contentId, element);
        
        // Insertar en el menú
        if (insertionPoint.beforeElement) {
            insertionPoint.beforeElement.parentNode.insertBefore(promoOption, insertionPoint.beforeElement);
        } else {
            dropdown.appendChild(promoOption);
        }
        
        // Agregar separador si no existe
        if (insertionPoint.beforeElement && !insertionPoint.hasSeparator) {
            const separator = document.createElement('div');
            separator.className = 'post-dropdown-divider';
            separator.style.cssText = 'height: 1px; background: rgba(255, 255, 255, 0.1); margin: 0.5rem 0;';
            insertionPoint.beforeElement.parentNode.insertBefore(separator, insertionPoint.beforeElement);
        }
        
        console.log(`✅ Opción de promoción agregada a ${type} ${contentId}`);
        return true;
        
    } catch (error) {
        console.error(`❌ Error agregando opción de promoción:`, error);
        return false;
    }
}

/**
 * ============================================
 * BUSCAR MENÚ DROPDOWN
 * ============================================
 */
function findDropdownMenu(element, type, contentId) {
    // Estrategia 1: Selector directo
    let dropdown = element.querySelector('.post-dropdown');
    if (dropdown) return dropdown;
    
    // Estrategia 2: Para eventos Chain con ID específico
    if (type === 'event') {
        dropdown = element.querySelector(`#chainEventDropdown-${contentId}`);
        if (dropdown) return dropdown;
        
        dropdown = document.querySelector(`#chainEventDropdown-${contentId}`);
        if (dropdown) return dropdown;
    }
    
    // Estrategia 3: Para posts con ID específico
    if (type === 'post') {
        dropdown = document.querySelector(`#postDropdown-${contentId}`);
        if (dropdown) return dropdown;
    }
    
    // Estrategia 4: Buscar en contenedor de menú
    const menuContainer = element.querySelector('.post-menu-container');
    if (menuContainer) {
        dropdown = menuContainer.querySelector('.post-dropdown');
        if (dropdown) return dropdown;
    }
    
    // Estrategia 5: Buscar cualquier dropdown
    dropdown = element.querySelector('[class*="dropdown"]');
    if (dropdown) return dropdown;
    
    return null;
}

/**
 * ============================================
 * ENCONTRAR PUNTO DE INSERCIÓN
 * ============================================
 */
function findInsertionPoint(dropdown) {
    // Buscar botón de eliminar
    const deleteSelectors = [
        '[onclick*="deletePost"]',
        '[onclick*="deleteChainEvent"]',
        '[data-action="delete"]',
        '.post-dropdown-item:last-child',
        '.post-dropdown-item.danger'
    ];
    
    for (const selector of deleteSelectors) {
        const deleteButton = dropdown.querySelector(selector);
        if (deleteButton) {
            const prevSibling = deleteButton.previousElementSibling;
            const hasSeparator = prevSibling && 
                                (prevSibling.classList.contains('post-dropdown-divider') || 
                                 prevSibling.classList.contains('post-dropdown-separator') ||
                                 prevSibling.style.height === '1px');
            
            return {
                beforeElement: deleteButton,
                hasSeparator: hasSeparator
            };
        }
    }
    
    // Si no hay botón de eliminar, insertar al final
    return {
        beforeElement: null,
        hasSeparator: false
    };
}

/**
 * ============================================
 * CREAR OPCIÓN DE PROMOCIÓN
 * ============================================
 */
function createPromotionOption(type, contentId, element) {
    const promoOption = document.createElement('button');
    promoOption.className = 'post-dropdown-item';
    promoOption.setAttribute('data-promo-option', 'true');
    promoOption.setAttribute('data-content-type', type);
    promoOption.setAttribute('data-content-id', contentId);
    
    promoOption.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        console.log(`🎯 Click en promoción de ${type} ${contentId}`);
        
        // Cerrar el menú
        closeAllMenus();
        
        // Abrir modal de promoción
        setTimeout(() => {
            openPromotionModal(type, contentId, element);
        }, 100);
    };
    
    promoOption.innerHTML = `
        <span style="font-size: 1.1rem; width: 20px; text-align: center;">📢</span>
        <span>Promover contenido</span>
    `;
    
    return promoOption;
}

/**
 * ============================================
 * CERRAR TODOS LOS MENÚS
 * ============================================
 */
/**
 * ============================================
 * CERRAR TODOS LOS MENÚS
 * ============================================
 */
function closeAllMenus() {
    console.log('🔒 Cerrando todos los menús...');
    
    // Cerrar menús de posts
    const postMenus = document.querySelectorAll('.post-dropdown.active, .post-dropdown[style*="visible"]');
    postMenus.forEach(menu => {
        menu.classList.remove('active');
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-10px) scale(0.95)';
    });
    
    // Cerrar menús de eventos chain
    const eventMenus = document.querySelectorAll('[id^="chainEventDropdown"].active, [id^="chainEventDropdown"][style*="visible"]');
    eventMenus.forEach(menu => {
        menu.classList.remove('active');
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(-10px) scale(0.95)';
    });
    
    // Cerrar cualquier otro dropdown visible
    const allDropdowns = document.querySelectorAll('[class*="dropdown"].active, [class*="dropdown"][style*="visible"]');
    allDropdowns.forEach(menu => {
        menu.classList.remove('active');
        if (menu.style.visibility === 'visible') {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px) scale(0.95)';
        }
    });
    
    // Intentar usar función global si existe
    if (typeof closePostMenu === 'function') {
        closePostMenu();
    }
    
    // Intentar cerrar menús de eventos chain si existe
    if (typeof closeChainEventMenu === 'function') {
        closeChainEventMenu();
    }
    
    console.log('✅ Menús cerrados');
}

/**
 * ============================================
 * VERIFICAR OWNERSHIP
 * ============================================
 */

function isContentOwner(element) {
    try {
        // 🔥 MÉTODO 1: Verificar si tiene botón de eliminar VISIBLE
        const deleteButton = element.querySelector('[onclick*="deletePost"]:not([style*="display: none"])');
        if (deleteButton) {
            console.log(`✅ Botón eliminar visible - ES OWNER`);
            return true;
        }
        
        // 🔥 MÉTODO 2: Verificar si estamos en nuestro perfil
        if (document.body.classList.contains('own-profile')) {
            console.log(`✅ own-profile class detectada - ES OWNER`);
            return true;
        }
        
        // 🔥 MÉTODO 3: Obtener usuario actual y comparar
        const currentUser = PromotionSystem.currentUser || 
                          window.CHAINFEED_CONFIG?.currentUser?.username ||
                          window.CommentsSystem?.currentUser?.username;
        
        if (!currentUser) {
            console.warn('⚠️ No hay usuario actual');
            return false;
        }
        
        console.log(`🔍 Verificando ownership para: ${currentUser}`);
        
        // 🔥 MÉTODO 4: Comparar con URL
        const urlParams = new URLSearchParams(window.location.search);
        const profileUser = urlParams.get('user');
        
        if (profileUser === currentUser) {
            console.log(`✅ Perfil URL match: ${profileUser}`);
            return true;
        }
        
        // 🔥 MÉTODO 5: Verificar variable global
        if (typeof currentProfileUser !== 'undefined' && currentProfileUser === currentUser) {
            console.log(`✅ currentProfileUser match`);
            return true;
        }
        
        if (typeof isOwnProfile !== 'undefined' && isOwnProfile === true) {
            console.log(`✅ isOwnProfile = true`);
            return true;
        }
        
        // 🔥 MÉTODO 6: Buscar username en el elemento
        const userLinks = element.querySelectorAll('[onclick*="goToUserProfile"]');
        for (const link of userLinks) {
            const username = link.textContent.replace('@', '').trim();
            if (username === currentUser) {
                console.log(`✅ Username match en elemento: ${username}`);
                return true;
            }
        }
        
        console.log(`❌ No es owner`);
        return false;
        
    } catch (error) {
        console.error('❌ Error verificando ownership:', error);
        return false;
    }
}

/**
 * ============================================
 * OBSERVER DE CONTENIDO
 * ============================================
 */
function setupContentObserver() {
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches('[data-post-id], [data-event-id]') ||
                            node.querySelector('[data-post-id], [data-event-id]')) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        
        if (shouldCheck) {
            console.log('🔄 Nuevo contenido detectado, agregando botones...');
            setTimeout(() => {
                addPromotionButtons();
                // Re-aplicar badges a promociones activas
                if (PromotionSystem.activePromotions && PromotionSystem.activePromotions.length > 0) {
                    addPromotionBadgesToContent(PromotionSystem.activePromotions);
                }
            }, 500);
        }
    });
    
    const contentArea = document.getElementById('content-area') || document.body;
    observer.observe(contentArea, {
        childList: true,
        subtree: true
    });
    
    console.log('👁️ Observer de contenido activado');
}

/**
 * ============================================
 * ABRIR MODAL DE PROMOCIÓN
 * ============================================
 */
async function openPromotionModal(contentType, contentId, element) {
    try {
        console.log('📢 Abriendo modal de promoción:', contentType, contentId);
        
        // Limpiar ID
        const cleanId = String(contentId).replace('post-', '').replace('card-', '').replace('chain-', '');
        
        // Guardar información del contenido
        PromotionSystem.currentContent = {
            type: contentType,
            id: cleanId,
            element: element
        };
        
        // Cargar balance del usuario
        await loadUserBalanceForPromotion();
        
        // Renderizar información del contenido
        renderContentInfo(element, contentType);
        
        // Renderizar planes
        renderPromotionPlans();
        
        // Mostrar modal
        const modal = document.getElementById('promotionModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
    } catch (error) {
        console.error('Error abriendo modal de promoción:', error);
        showPromotionNotification('❌ Error al abrir modal de promoción', 'error');
    }
}

/**
 * ============================================
 * CERRAR MODAL DE PROMOCIÓN
 * ============================================
 */
function closePromotionModal() {
    const modal = document.getElementById('promotionModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpiar después de la animación
    setTimeout(() => {
        PromotionSystem.currentContent = null;
        PromotionSystem.selectedPlan = null;
        
        // Limpiar selecciones
        const selectedCards = document.querySelectorAll('.promo-plan-card.selected');
        selectedCards.forEach(card => card.classList.remove('selected'));
        
        // Ocultar info de balance
        const balanceInfo = document.getElementById('promoBalanceInfo');
        if (balanceInfo) balanceInfo.style.display = 'none';
        
        // Deshabilitar botón de confirmar
        const confirmBtn = document.getElementById('promoConfirmBtn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Confirmar Promoción';
        }
    }, 300);
}

/**
 * ============================================
 * CARGAR BALANCE DEL USUARIO
 * ============================================
 */
async function loadUserBalanceForPromotion() {
    try {
        const response = await fetch('/php/obtener_balance.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            PromotionSystem.userBalance = parseFloat(data.balance) || 0;
            
            // Actualizar display de balance en el modal
            const balanceElement = document.getElementById('balanceValue');
            if (balanceElement) {
                balanceElement.textContent = `${PromotionSystem.userBalance.toLocaleString()} CFT`;
            }
            
            console.log(`💰 Balance cargado: ${PromotionSystem.userBalance} CFT`);
        } else {
            console.error('Error obteniendo balance:', data.message);
            PromotionSystem.userBalance = 0;
        }
    } catch (error) {
        console.error('Error cargando balance:', error);
        PromotionSystem.userBalance = 0;
    }
}
/**
 * ============================================
 * RENDERIZAR INFORMACIÓN DEL CONTENIDO
 * ============================================
 */
function renderContentInfo(element, type) {
    const container = document.getElementById('promoContentInfo');
    if (!container) return;
    
    let title = 'Contenido';
    let typeLabel = 'Publicación';
    
    try {
        if (type === 'post') {
            const titleElement = element.querySelector('.card-title') || 
                                element.querySelector('div[style*="line-height"]') ||
                                element.querySelector('.card-description');
            title = titleElement ? titleElement.textContent.substring(0, 80) : 'Tu publicación';
            typeLabel = '📝 Publicación';
        } else if (type === 'event') {
            const titleElement = element.querySelector('.chain-event-title');
            title = titleElement ? titleElement.textContent : 'Tu evento Chain';
            typeLabel = '⚡ Evento Chain';
        }
    } catch (error) {
        console.error('Error extrayendo info:', error);
    }
    
    container.innerHTML = `
        <div class="promo-content-title">${title}${title.length >= 80 ? '...' : ''}</div>
        <div class="promo-content-type">${typeLabel}</div>
    `;
}

/**
 * ============================================
 * RENDERIZAR PLANES DE PROMOCIÓN
 * ============================================
 */
function renderPromotionPlans() {
    const container = document.getElementById('promoPlansGrid');
    if (!container) return;
    
    let plansHTML = '';
    
    Object.entries(PromotionSystem.plans).forEach(([key, plan]) => {
        plansHTML += `
            <div class="promo-plan-card" data-plan-key="${key}" onclick="selectPromotionPlan('${key}')">
                ${plan.badge ? `<div class="promo-plan-badge">${plan.badge}</div>` : ''}
                ${plan.discount ? `<div class="promo-plan-discount">${plan.discount}</div>` : ''}
                
                <span class="promo-plan-icon">${plan.icon}</span>
                
                <div class="promo-plan-text">
                    <h3 class="promo-plan-name">${plan.name}</h3>
                    <p class="promo-plan-description">${plan.description}</p>
                </div>
                
                <div class="promo-plan-price">
                    ${plan.price.toLocaleString()} <span class="promo-plan-price-label">CFT</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = plansHTML;
}

/**
 * ============================================
 * SELECCIONAR PLAN DE PROMOCIÓN
 * ============================================
 */
function selectPromotionPlan(planKey) {
    const plan = PromotionSystem.plans[planKey];
    if (!plan) return;
    
    // Marcar plan seleccionado
    const allCards = document.querySelectorAll('.promo-plan-card');
    allCards.forEach(card => card.classList.remove('selected'));
    
    const selectedCard = document.querySelector(`[data-plan-key="${planKey}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Guardar plan seleccionado
    PromotionSystem.selectedPlan = planKey;
    
    // Actualizar información de balance
    updateBalanceInfo(plan.price);
    
    // Habilitar botón de confirmar si hay saldo
    const confirmBtn = document.getElementById('promoConfirmBtn');
    if (confirmBtn) {
        const canAfford = PromotionSystem.userBalance >= plan.price;
        confirmBtn.disabled = !canAfford;
    }
}

/**
 * ============================================
 * ACTUALIZAR INFORMACIÓN DE BALANCE
 * ============================================
 */
function updateBalanceInfo(price) {
    const container = document.getElementById('promoBalanceInfo');
    if (!container) return;
    
    const balanceAfter = PromotionSystem.userBalance - price;
    const canAfford = balanceAfter >= 0;
    
    container.innerHTML = `
        <div class="promo-balance-row">
            <span class="promo-balance-label">Tu balance actual:</span>
            <span class="promo-balance-value">${PromotionSystem.userBalance.toLocaleString()} CFT</span>
        </div>
        <div class="promo-balance-row">
            <span class="promo-balance-label">Costo de promoción:</span>
            <span class="promo-balance-value" style="color: #f59e0b;">-${price.toLocaleString()} CFT</span>
        </div>
        <div class="promo-balance-row">
            <span class="promo-balance-label"><strong>Balance después:</strong></span>
            <span class="promo-balance-value ${canAfford ? 'positive' : 'negative'}">
                ${balanceAfter.toLocaleString()} CFT
            </span>
        </div>
    `;
    
    container.style.display = 'block';
    
    // Actualizar botón de confirmar
    const confirmBtn = document.getElementById('promoConfirmBtn');
    if (confirmBtn) {
        confirmBtn.disabled = !canAfford;
        if (!canAfford) {
            confirmBtn.textContent = 'Saldo Insuficiente';
        } else {
            confirmBtn.textContent = 'Confirmar Promoción';
        }
    }
}

/**
 * ============================================
 * CONFIRMAR PROMOCIÓN
 * ============================================
 */
async function confirmPromotion() {
    if (PromotionSystem.isProcessing) return;
    
    const confirmBtn = document.getElementById('promoConfirmBtn');
    const originalText = confirmBtn ? confirmBtn.textContent : 'Confirmar';
    
    try {
        if (!PromotionSystem.currentContent || !PromotionSystem.selectedPlan) {
            throw new Error('Información de promoción incompleta');
        }
        
        const plan = PromotionSystem.plans[PromotionSystem.selectedPlan];
        
        // Validar balance
        if (PromotionSystem.userBalance < plan.price) {
            throw new Error('Saldo insuficiente para esta promoción');
        }
        
        // Cambiar estado del botón
        if (confirmBtn) {
            confirmBtn.textContent = 'Procesando... ⏳';
            confirmBtn.disabled = true;
            confirmBtn.classList.add('promo-processing');
        }
        
        PromotionSystem.isProcessing = true;
        
        // Llamar al endpoint
        const response = await fetch('https://chainfeed.space/php/promover_contenido.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content_type: PromotionSystem.currentContent.type,
                content_id: PromotionSystem.currentContent.id,
                promotion_type: plan.type
            })
        });
        
        const data = await response.json();
if (data.success) {
    const responseData = data.data || data;
    
    // Actualizar balance local
    PromotionSystem.userBalance = responseData.balance_actual || PromotionSystem.userBalance - plan.price;
    
    // Cerrar modal
    closePromotionModal();
    
    // Mostrar notificación de éxito
    showPromotionNotification(
        `🎉 ¡Contenido promovido exitosamente!\n` +
        `Plan: ${plan.name}\n` +
        `Tokens pagados: ${responseData.tokens_paid || plan.price} CFT\n` +
        `Balance actual: ${responseData.balance_actual || PromotionSystem.userBalance} CFT`,
        'success'
    );
    
// Actualizar contenido dinámicamente
setTimeout(async () => {
    console.log('🔄 Actualizando feed de contenido...');
    
    // 1. Cerrar todos los menús abiertos
    closeAllMenus();
    
    // 2. Recargar lista de promociones activas
    await loadActivePromotions();
    
    // 3. Recargar feed completo
    await reloadContentFeed();
    
    // 4. Actualizar balance en la UI
    updateBalanceDisplay(responseData.balance_actual);
    
    // 5. Asegurar que los menús sigan cerrados después del reload
    setTimeout(() => {
        closeAllMenus();
    }, 1000);
    
    console.log('✅ Actualización completada exitosamente');
}, 500);
    
} else {
    throw new Error(data.message || 'Error al promover contenido');
 }
    } catch (error) {
        console.error('Error en promoción:', error);
        showPromotionNotification('❌ ' + error.message, 'error');
    } finally {
        PromotionSystem.isProcessing = false;
        
        if (confirmBtn) {
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('promo-processing');
        }
    }
}

/**
 * ============================================
 * ACTUALIZAR UI DESPUÉS DE PROMOVER
 * ============================================
 */
function updateContentUIAfterPromotion(data) {
    if (!PromotionSystem.currentContent) return;
    
    const element = PromotionSystem.currentContent.element;
    if (!element) return;
    
    try {
        // Buscar contenedor del header
        let headerContainer = element.querySelector('.chain-event-header');
        if (!headerContainer) {
            const cardContent = element.querySelector('.card-content');
            if (cardContent) {
                headerContainer = cardContent.querySelector('div[style*="display: flex"]') ||
                                cardContent.querySelector('div:first-child');
            }
        }
        
        if (headerContainer) {
            // Remover badge anterior si existe
            const oldBadge = element.querySelector('.promo-active-badge');
            if (oldBadge) oldBadge.remove();
            
// Calcular tiempo restante con más precisión
const endDate = new Date(data.fecha_fin);
const now = new Date();
const timeLeftMs = endDate - now;
const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
const minutesLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

// ✅ CORRECCIÓN: Calcular días sin redondear hacia arriba innecesariamente
let daysLeft;
if (hoursLeft < 24) {
    daysLeft = 1; // Menos de 24h = mostrar "1 día"
} else {
    // Para 24h o más, dividir entre 24 y redondear hacia abajo, luego sumar 1
    daysLeft = Math.floor(hoursLeft / 24);
    // Si hay horas adicionales después de los días completos, sumar 1 día
    if (hoursLeft % 24 > 0) {
        daysLeft += 1;
    }
}

// Determinar texto del badge
let badgeText;
if (hoursLeft < 24) {
    if (hoursLeft < 1) {
        badgeText = `Promocionado - ${minutesLeft} min`;
    } else {
        badgeText = `Promocionado - ${hoursLeft}h`;
    }
} else {
    badgeText = `Promocionado - ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`;
}

// Crear nuevo badge
const badge = document.createElement('div');
badge.className = 'promo-active-badge';
badge.innerHTML = `
    <span>🚀</span>
    <span>${badgeText}</span>
`;
            
            headerContainer.appendChild(badge);
        }
        
        // Desactivar opción del menú
        const promoOption = element.querySelector('[data-promo-option]');
        if (promoOption) {
            promoOption.style.opacity = '0.5';
            promoOption.style.pointerEvents = 'none';
            promoOption.querySelector('span:last-child').textContent = '✓ Ya promocionado';
        }
        
    } catch (error) {
        console.error('Error actualizando UI:', error);
    }
}

/**
 * ============================================
 * MOSTRAR NOTIFICACIÓN
 * ============================================
 */
function showPromotionNotification(message, type = 'info') {
    // Usar sistema existente si está disponible
    if (typeof showNotification === 'function') {
        showNotification(message, type);
        return;
    }
    
    // Crear notificación propia
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
        z-index: 10001;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease;
        ${type === 'error' ? 'border-left: 4px solid #ef4444;' : ''}
        ${type === 'success' ? 'border-left: 4px solid #10b981;' : ''}
    `;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : '📢';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="font-size: 1.5rem;">${icon}</div>
            <div style="font-size: 0.95rem; line-height: 1.4; white-space: pre-line;">${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * ============================================
 * ACTUALIZAR BALANCE EN LA UI
 * ============================================
 */
/**
 * ============================================
 * ACTUALIZAR BALANCE EN LA UI
 * ============================================
 */
function updateBalanceDisplay(newBalance) {
    try {
        console.log(`💰 Actualizando balance en UI: ${newBalance} CFT`);
        
        // 🔥 ACTUALIZAR CONTADOR DE TOKENS EN EL PERFIL
        const nftsCountElement = document.getElementById('nftsCount');
        if (nftsCountElement) {
            // Si existe la función formatNumber, usarla
            const formattedValue = typeof formatNumber === 'function' 
                ? formatNumber(newBalance) 
                : newBalance.toLocaleString('es-AR');
            
            // Si existe la función animateStatistic, usarla
            if (typeof animateStatistic === 'function') {
                animateStatistic('nftsCount', newBalance);
            } else {
                // Animación manual
                nftsCountElement.style.transition = 'all 0.3s ease';
                nftsCountElement.style.transform = 'scale(1.15)';
                nftsCountElement.style.color = '#10b981';
                
                nftsCountElement.textContent = formattedValue;
                
                setTimeout(() => {
                    nftsCountElement.style.transform = 'scale(1)';
                    nftsCountElement.style.color = '';
                }, 300);
            }
            
            console.log(`✅ Contador NFTs actualizado: ${formattedValue}`);
        }
        
        // Buscar otros elementos que muestren el balance
        const balanceSelectors = [
            '[data-balance]',
            '.user-balance',
            '#userBalance',
            '.token-balance',
            '[class*="balance"]',
            '[id*="balance"]'
        ];
        
        let updated = false;
        
        balanceSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const currentText = element.textContent;
                
                // Si contiene "CFT" o números, actualizarlo
                if (currentText.includes('CFT') || /\d+/.test(currentText)) {
                    const formattedBalance = newBalance.toLocaleString('es-AR');
                    
                    // Preservar formato existente
                    if (currentText.includes('CFT')) {
                        element.textContent = `${formattedBalance} CFT`;
                    } else {
                        element.textContent = formattedBalance;
                    }
                    
                    // Efecto visual de actualización
                    element.style.transition = 'all 0.3s ease';
                    element.style.color = '#10b981';
                    
                    setTimeout(() => {
                        element.style.color = '';
                    }, 1500);
                    
                    updated = true;
                }
            });
        });
        
        if (updated) {
            console.log(`✅ Balance actualizado en UI: ${newBalance.toLocaleString('es-AR')} CFT`);
        }
        
        // Actualizar en sistema global si existe
        if (window.updateUserBalance) {
            window.updateUserBalance(newBalance);
        }
        
        // Actualizar localStorage si se usa
        if (localStorage.getItem('userBalance')) {
            localStorage.setItem('userBalance', newBalance);
        }
        
    } catch (error) {
        console.error('Error actualizando balance en UI:', error);
    }
}

/**
 * ============================================
 * RECARGAR FEED DE CONTENIDO
 * ============================================
 */
/**
 * ============================================
 * RECARGAR FEED DE CONTENIDO
 * ============================================
 */
async function reloadContentFeed() {
    try {
        console.log('🔄 Recargando feed de contenido...');
        
        // ✅ Obtener el tab activo ACTUAL
        const activeTab = typeof currentActiveTab !== 'undefined' 
            ? currentActiveTab 
            : (localStorage.getItem('chainfeed_active_tab') || 'posts');
        
        console.log('📋 Tab activo detectado:', activeTab);
        
        // ✅ Solo recargar el contenido del tab ACTIVO
        switch(activeTab) {
            case 'posts':
                console.log('📝 Recargando posts...');
                if (typeof loadPosts === 'function') {
                    await loadPosts();
                }
                break;
                
            case 'chain':
                console.log('⚡ Recargando eventos chain...');
                if (typeof loadChainEvents === 'function') {
                    await loadChainEvents();
                }
                break;
                
            case 'reposts':
                console.log('🔄 Recargando reposts...');
                if (typeof loadReposts === 'function') {
                    await loadReposts();
                }
                break;
                
            case 'collection':
                console.log('🎨 Recargando colección...');
                if (typeof loadCollection === 'function') {
                    await loadCollection();
                }
                break;
                
            default:
                console.log('📝 Tab desconocido, recargando posts por defecto...');
                if (typeof loadPosts === 'function') {
                    await loadPosts();
                }
        }
        
        // ✅ CORRECCIÓN: Usar las funciones correctas que SÍ existen
        console.log('🔄 Re-aplicando badges...');
        
        // Esperar un momento para que el contenido se renderice
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Re-aplicar badges a promociones activas
        if (PromotionSystem.activePromotions && PromotionSystem.activePromotions.length > 0) {
            addPromotionBadgesToContent(PromotionSystem.activePromotions);
        }
        
        console.log('✅ Feed recargado exitosamente');
        
    } catch (error) {
        console.error('❌ Error recargando feed:', error);
    }
}

/**
 * ============================================
 * FUNCIONES GLOBALES Y AUTO-INICIALIZACIÓN
 * ============================================
 */

// Exponer funciones globales
window.PromotionSystem = PromotionSystem;
window.openPromotionModal = openPromotionModal;
window.closePromotionModal = closePromotionModal;
window.selectPromotionPlan = selectPromotionPlan;
window.confirmPromotion = confirmPromotion;
window.addPromotionButtons = addPromotionButtons;
window.reloadContentFeed = reloadContentFeed;  // ← AGREGAR
window.updateBalanceDisplay = updateBalanceDisplay;

/**
 * Auto-inicialización
 */
(function() {
    console.log('🚀 Cargando sistema de promoción...');
    
    async function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                await initializePromotionSystem();
            });
        } else {
            setTimeout(async () => {
                await initializePromotionSystem();
            }, 1000);
        }
    }
    
    init();
})();

console.log('📢 Sistema de promoción de contenido cargado - v1.1 COMPLETA');