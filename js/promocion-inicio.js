/**
 * ============================================
 * INYECTAR ESTILOS CSS - VERSIÓN SIMPLIFICADA
 * ============================================
 */
function injectPromotionStylesInicio() {
    if (document.getElementById('promotion-styles-inicio')) return;
    
    const style = document.createElement('style');
    style.id = 'promotion-styles-inicio';
    style.textContent = `
        /* ============================================
           ESTILOS PARA POSTS PROMOCIONADOS - INICIO
           VERSIÓN SIMPLIFICADA (SIN BORDES)
           ============================================ */
        
        /* Badge de promocionado interno */
        .promoted-badge-internal {
            animation: promotedPulseInternal 3s ease-in-out infinite;
        }

        @keyframes promotedPulseInternal {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
            }
            50% {
                transform: scale(1.02);
                box-shadow: 0 3px 12px rgba(255, 215, 0, 0.5);
            }
        }

/* Modal de promoción */
.promo-modal-inicio {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    z-index: 88888;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    overflow-y: auto;
    overscroll-behavior: contain;
}

/* Bloquear scroll del body cuando modal está activo */
body.modal-open {
    overflow: hidden !important;
    height: 100vh !important;
    position: relative !important;
}

        .promo-modal-inicio.active {
            opacity: 1;
            visibility: visible;
        }

        .promo-modal-content-inicio {
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
            transition: transform 0.3s ease;
        }

        .promo-modal-inicio.active .promo-modal-content-inicio {
            transform: scale(1);
        }

        .promo-header-inicio {
            text-align: center;
            margin-bottom: 1rem;
        }

        .promo-title-inicio {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    -webkit-background-clip: text;
    background-clip: text;
    color: antiquewhite;
        }

        .promo-subtitle-inicio {
            color: var(--text-secondary);
            margin-top: 0.5rem;
            font-size: 0.95rem;
        }

        .balance-display-inicio {
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .balance-label-inicio {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 0.3rem;
        }

        .balance-value-inicio {
            font-size: 1.5rem;
            font-weight: 700;
            color: #FFD700;
        }

        .promo-plans-grid-inicio {
            display: grid;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .promo-plan-card-inicio {
background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1rem 1.25rem;
    cursor: pointer;
    transition: all 0.3s 
ease;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 1rem;
        }

        .promo-plan-card-inicio:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
            border-color: rgba(245, 158, 11, 0.5);
        }

        .promo-plan-card-inicio.selected {
            border-color: #FFD700;
            background: rgba(255, 215, 0, 0.15);
            box-shadow: 0 8px 24px rgba(255, 215, 0, 0.3);
        }

        .promo-plan-card-inicio.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .promo-plan-card-inicio.disabled:hover {
            transform: none;
            box-shadow: none;
        }

        .promo-plan-badge-inicio {
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

        .promo-plan-discount-inicio {
            position: absolute;
            top: 3.5rem;
            right: 1rem;
            background: #10b981;
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.65rem;
            font-weight: 600;
        }

        .promo-plan-icon-inicio {
font-size: 2rem;
    flex-shrink: 0;
        }

        .promo-plan-name-inicio {
font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
    color: white;
        }

        .promo-plan-duration-inicio {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
            margin: 0 0 0.5rem 0;
        }

        .promo-plan-description-inicio {
color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
    margin: 0;
        }

        .promo-plan-price-inicio {
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

        .promo-plan-price-label-inicio {
font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
        }

        .promo-balance-info-inicio {
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }

        .promo-balance-row-inicio {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .promo-balance-row-inicio:last-child {
            margin-bottom: 0;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .promo-balance-label-text-inicio {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
        }

        .promo-balance-value-text-inicio {
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
        }

        .promo-balance-value-text-inicio.positive {
            color: #10b981;
        }

        .promo-balance-value-text-inicio.negative {
            color: #ef4444;
        }

        .promo-footer-inicio {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }

        .promo-cancel-btn-inicio {
padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.1);
    color: rgb(218, 218, 205);
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s 
ease;
        }

        .promo-cancel-btn-inicio:hover {
            background: rgba(255, 255, 255, 0.2);
            color: rgb(218, 218, 205);
        }

        .promo-confirm-btn-inicio {
    padding: 0.75rem 1.75rem;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s 
ease;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .promo-confirm-btn-inicio:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(255, 215, 0, 0.5);
        }

        .promo-confirm-btn-inicio:active {
            transform: translateY(0);
        }

        .promo-confirm-btn-inicio:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .promo-info-inicio {
            margin-top: 1.5rem;
            padding: 1rem;
            background: rgba(99, 102, 241, 0.1);
            border-radius: 12px;
            font-size: 0.85rem;
            color: var(--text-secondary);
            line-height: 1.5;
        }

        .promo-info-title-inicio {
            font-weight: 600;
            color: var(--text);
            margin-bottom: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .promo-modal-content-inicio {
                width: 95%;
                padding: 1.5rem;
            }
            
            .promo-footer-inicio {
                flex-direction: column;
            }
            
            .promo-cancel-btn-inicio,
            .promo-confirm-btn-inicio {
                width: 100%;
            }
            
            .promoted-badge-internal {
                font-size: 0.7rem;
                padding: 3px 8px;
            }
        }

        /* Animación de procesamiento */
        @keyframes promo-pulse-inicio {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        .promo-processing-inicio {
            animation: promo-pulse-inicio 1.5s ease-in-out infinite;
        }

        /* Scrollbar del modal */
        .promo-modal-content-inicio::-webkit-scrollbar {
            width: 8px;
        }

        .promo-modal-content-inicio::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }

        .promo-modal-content-inicio::-webkit-scrollbar-thumb {
            background: rgba(255, 215, 0, 0.5);
            border-radius: 4px;
        }

        .promo-modal-content-inicio::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 215, 0, 0.7);
        }
/* ============================================
   FIX PARA DROPDOWN Y BADGE PROMOCIONADO
   ============================================ */

/* Asegurar que el post-card permita desbordamiento del dropdown */
.post-card {
    overflow: visible !important; /* ✅ Permitir que el dropdown se salga */
    position: relative;
    z-index: 1; /* Base z-index */
}

/* Cuando el dropdown está activo, elevar el z-index del post completo */
.post-card:has(.post-dropdown:not(.hidden)) {
    z-index: 1000 !important;
}

/* Menú de tres puntos con z-index MUY alto */
.post-menu-container {
    position: relative;
    z-index: 150;
}

/* Dropdown con z-index súper alto y sin cortes */
.post-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: rgba(26, 26, 36, 0.98);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 0.5rem 0;
    min-width: 200px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    z-index: 99999 !important; /* ✅ Z-index súper alto */
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(0.95);
    transition: all 0.3s ease;
    margin-top: 8px; /* Separación del botón */
}

/* Dropdown visible */
.post-dropdown:not(.hidden) {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) scale(1) !important;
    display: block !important;
}

/* Badge promocionado inline con animación suave */
.promoted-badge-inline {
    animation: promotedPulseInline 3s ease-in-out infinite;
}

@keyframes promotedPulseInline {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    }
    50% {
        transform: scale(1.03);
        box-shadow: 0 3px 12px rgba(255, 215, 0, 0.5);
    }
}

/* Items del dropdown */
.post-dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    color: var(--text);
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

.post-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text);
}

.post-dropdown-item.danger {
    color: var(--error);
}

.post-dropdown-item.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: var(--error);
}

.post-dropdown-item.warning {
    color: var(--warning);
}

.post-dropdown-item.warning:hover {
    background: rgba(245, 158, 11, 0.1);
    color: var(--warning);
}

/* Separador del dropdown */
.post-dropdown-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0.5rem 0;
}

/* Header del post con espacio para los elementos superiores */
.post-header {
    position: relative;
    padding-right: 40px; /* Espacio para el menú */
    min-height: 50px; /* Altura mínima para evitar colapsos */
}

/* Responsive para móviles */
@media (max-width: 768px) {
    .post-dropdown {
        min-width: 180px;
        right: -5px; /* Ajuste para móviles */
    }
    
    .promoted-badge-inline {
        font-size: 0.7rem;
        padding: 3px 8px;
    }
    
    .post-header {
        padding-right: 35px;
    }
}

/* Fix adicional: Asegurar que otros posts no tapen el dropdown */
.feed-posts {
    position: relative;
}

.feed-posts .post-card {
    isolation: isolate; /* Crear contexto de apilamiento */
}
    `;
    
    document.head.appendChild(style);
    console.log('✅ Estilos de promoción inyectados (versión simplificada)');
}

/**
 * ============================================
 * SISTEMA DE PROMOCIÓN - FUNCIONALIDAD COMPLETA
 * ============================================
 */

// Llamar a la inyección de estilos
injectPromotionStylesInicio();

const PromotionSystemInicio = {
    currentContent: null,
    currentUser: null,
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
    isProcessing: false
};

/**
 * Crear modal de promoción
 */
function createPromotionModalInicio() {
    if (document.getElementById('promotionModalInicio')) return;
    
    const modal = document.createElement('div');
    modal.id = 'promotionModalInicio';
    modal.className = 'promo-modal-inicio';
    
    modal.innerHTML = `
        <div class="promo-modal-content-inicio">
            <div class="promo-header-inicio">
                <h2 class="promo-title-inicio">📢 Promover Contenido</h2>
                <p class="promo-subtitle-inicio">Aumenta la visibilidad de tu publicación</p>
            </div>
            
            <div class="balance-display-inicio">
                <div class="balance-label-inicio">Tu balance actual</div>
                <div class="balance-value-inicio" id="balanceValueInicio">0 CFT</div>
            </div>
            
            <div class="promo-plans-grid-inicio" id="promoPlansGridInicio"></div>
            
            <div class="promo-balance-info-inicio" id="promoBalanceInfoInicio" style="display: none;"></div>
            
            <div class="promo-footer-inicio">
                <button class="promo-cancel-btn-inicio" onclick="closePromotionModalInicio()">Cancelar</button>
                <button class="promo-confirm-btn-inicio" id="promoConfirmBtnInicio" onclick="confirmPromotionInicio()" disabled>
                    Confirmar Promoción
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closePromotionModalInicio();
        }
    });
}

/**
 * Abrir modal de promoción
 */
async function openPromotionModalInicio(contentType, contentId, element) {
    try {
        console.log('📢 Abriendo modal promoción:', contentType, contentId);
        
        // Crear modal si no existe
        createPromotionModalInicio();
        
        const cleanId = String(contentId).replace('post-', '').replace('chain-', '');
        
        PromotionSystemInicio.currentContent = {
            type: contentType,
            id: cleanId,
            element: element
        };
        
        // Cargar balance
        await loadUserBalanceInicio();
        
        // Renderizar planes
        renderPromotionPlansInicio();
        
        // Mostrar modal
        const modal = document.getElementById('promotionModalInicio');
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
document.body.style.overflow = 'hidden';
document.body.style.height = '100vh';
document.body.style.position = 'relative';
        }
        
    } catch (error) {
        console.error('Error abriendo modal:', error);
        showNotificationInicio('❌ Error al abrir modal de promoción', 'error');
    }
}

/**
 * Cerrar modal
 */
function closePromotionModalInicio() {
    const modal = document.getElementById('promotionModalInicio');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
document.body.style.overflow = '';
document.body.style.height = '';
document.body.style.position = '';
    
    setTimeout(() => {
        PromotionSystemInicio.currentContent = null;
        PromotionSystemInicio.selectedPlan = null;
        
        const selectedCards = document.querySelectorAll('.promo-plan-card-inicio.selected');
        selectedCards.forEach(card => card.classList.remove('selected'));
        
        const balanceInfo = document.getElementById('promoBalanceInfoInicio');
        if (balanceInfo) balanceInfo.style.display = 'none';
        
        const confirmBtn = document.getElementById('promoConfirmBtnInicio');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Confirmar Promoción';
        }
    }, 300);
}

/**
 * Cargar balance del usuario
 */
async function loadUserBalanceInicio() {
    try {
        const response = await fetch('/php/obtener_balance.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            PromotionSystemInicio.userBalance = parseFloat(data.balance) || 0;
            
            const balanceElement = document.getElementById('balanceValueInicio');
            if (balanceElement) {
                balanceElement.textContent = `${PromotionSystemInicio.userBalance.toLocaleString()} CFT`;
            }
        } else {
            PromotionSystemInicio.userBalance = 0;
        }
    } catch (error) {
        console.error('Error cargando balance:', error);
        PromotionSystemInicio.userBalance = 0;
    }
}

/**
 * Renderizar planes
 */
function renderPromotionPlansInicio() {
    const container = document.getElementById('promoPlansGridInicio');
    if (!container) return;
    
    let plansHTML = '';
    
    Object.entries(PromotionSystemInicio.plans).forEach(([key, plan]) => {
        const canAfford = PromotionSystemInicio.userBalance >= plan.price;
        
        plansHTML += `
            <div class="promo-plan-card-inicio ${!canAfford ? 'disabled' : ''}" 
                 data-plan-key="${key}" 
                 onclick="${canAfford ? `selectPromotionPlanInicio('${key}')` : ''}">
                ${plan.badge ? `<div class="promo-plan-badge-inicio">${plan.badge}</div>` : ''}
                ${plan.discount ? `<div class="promo-plan-discount-inicio">${plan.discount}</div>` : ''}
                
                <span class="promo-plan-icon-inicio">${plan.icon}</span>

                <div class="promo-plan_text-ini">
                <h3 class="promo-plan-name-inicio">${plan.name}</h3>
                <p class="promo-plan-description-inicio">${plan.description}</p>
                </div>

                <div class="promo-plan-price-inicio">
                    ${plan.price.toLocaleString()} <span class="promo-plan-price-label-inicio">CFT</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = plansHTML;
}

/**
 * Seleccionar plan
 */
function selectPromotionPlanInicio(planKey) {
    const plan = PromotionSystemInicio.plans[planKey];
    if (!plan) return;
    
    const allCards = document.querySelectorAll('.promo-plan-card-inicio');
    allCards.forEach(card => card.classList.remove('selected'));
    
    const selectedCard = document.querySelector(`[data-plan-key="${planKey}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    PromotionSystemInicio.selectedPlan = planKey;
    
    updateBalanceInfoInicio(plan.price);
    
    const confirmBtn = document.getElementById('promoConfirmBtnInicio');
    if (confirmBtn) {
        const canAfford = PromotionSystemInicio.userBalance >= plan.price;
        confirmBtn.disabled = !canAfford;
        confirmBtn.textContent = canAfford ? 'Confirmar Promoción' : 'Saldo Insuficiente';
    }
}

/**
 * Actualizar info de balance
 */
function updateBalanceInfoInicio(price) {
    const container = document.getElementById('promoBalanceInfoInicio');
    if (!container) return;
    
    const balanceAfter = PromotionSystemInicio.userBalance - price;
    const canAfford = balanceAfter >= 0;
    
    container.innerHTML = `
        <div class="promo-balance-row-inicio">
            <span class="promo-balance-label-text-inicio">Tu balance actual:</span>
            <span class="promo-balance-value-text-inicio">${PromotionSystemInicio.userBalance.toLocaleString()} CFT</span>
        </div>
        <div class="promo-balance-row-inicio">
            <span class="promo-balance-label-text-inicio">Costo de promoción:</span>
            <span class="promo-balance-value-text-inicio" style="color: #f59e0b;">-${price.toLocaleString()} CFT</span>
        </div>
        <div class="promo-balance-row-inicio">
            <span class="promo-balance-label-text-inicio"><strong>Balance después:</strong></span>
            <span class="promo-balance-value-text-inicio ${canAfford ? 'positive' : 'negative'}">
                ${balanceAfter.toLocaleString()} CFT
            </span>
        </div>
    `;
    
    container.style.display = 'block';
}

/**
 * Confirmar promoción
 */
/**
 * Confirmar promoción
 */
async function confirmPromotionInicio() {
    if (PromotionSystemInicio.isProcessing) return;
    
    const confirmBtn = document.getElementById('promoConfirmBtnInicio');
    const originalText = confirmBtn ? confirmBtn.textContent : 'Confirmar';
    
    try {
        if (!PromotionSystemInicio.currentContent || !PromotionSystemInicio.selectedPlan) {
            throw new Error('Información de promoción incompleta');
        }
        
        const plan = PromotionSystemInicio.plans[PromotionSystemInicio.selectedPlan];
        
        if (PromotionSystemInicio.userBalance < plan.price) {
            throw new Error('Saldo insuficiente para esta promoción');
        }
        
        if (confirmBtn) {
            confirmBtn.textContent = 'Procesando... ⏳';
            confirmBtn.disabled = true;
            confirmBtn.classList.add('promo-processing-inicio');
        }
        
        PromotionSystemInicio.isProcessing = true;
        
        const response = await fetch('/php/promover_contenido.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content_type: PromotionSystemInicio.currentContent.type === 'publicacion' ? 'post' : PromotionSystemInicio.currentContent.type,
                content_id: PromotionSystemInicio.currentContent.id,
                promotion_type: plan.type
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const responseData = data.data || data;
            
            PromotionSystemInicio.userBalance = responseData.balance_actual || PromotionSystemInicio.userBalance - plan.price;
            
            closePromotionModalInicio();
            
            showNotificationInicio(
                `🎉 ¡Contenido promovido exitosamente!\nPlan: ${plan.name}\nBalance actual: ${PromotionSystemInicio.userBalance.toLocaleString()} CFT`,
                'success'
            );
            
            // ✅ Recargar contenido de forma inteligente
            setTimeout(() => {
                reloadPromotedContent();
            }, 500);
            
        } else {
            throw new Error(data.message || 'Error al promover contenido');
        }
    } catch (error) {
        console.error('Error en promoción:', error);
        showNotificationInicio('❌ ' + error.message, 'error');
    } finally {
        PromotionSystemInicio.isProcessing = false;
        
        if (confirmBtn) {
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('promo-processing-inicio');
        }
    }
}

/**
 * ✅ NUEVA FUNCIÓN: Recargar contenido promocionado de forma segura
 */
function reloadPromotedContent() {
    const contentType = PromotionSystemInicio.currentContent?.type;
    
    console.log('🔄 Recargando contenido promocionado...', contentType);
    
    // Si es un post, recargar solo el feed
    if (contentType === 'post' || contentType === 'publicacion') {
        if (typeof loadFeedPosts === 'function') {
            try {
                console.log('📰 Recargando feed de posts...');
                loadFeedPosts();
            } catch (error) {
                console.log('⚠️ Error al recargar feed:', error.message);
            }
        }
    }
    // Si es un evento, recargar solo eventos
    else if (contentType === 'event') {
        // Solo intentar recargar si existe el contenedor de eventos
        const chainContainer = document.querySelector('.chain-container, #chainEventsContainer, [data-chain-events]');
        
        if (chainContainer && typeof loadChainEvents === 'function') {
            try {
                console.log('🔗 Recargando eventos chain...');
                loadChainEvents();
            } catch (error) {
                console.log('⚠️ Error al recargar eventos:', error.message);
            }
        } else {
            console.log('ℹ️ Contenedor de eventos no encontrado, omitiendo recarga');
        }
    }
    // Fallback: intentar recargar solo lo que está disponible
    else {
        console.log('🔄 Tipo de contenido desconocido, recargando lo disponible...');
        
        if (typeof loadFeedPosts === 'function') {
            try {
                loadFeedPosts();
            } catch (error) {
                console.log('⚠️ No se pudo recargar feed');
            }
        }
    }
}

/**
 * Mostrar notificación
 */
function showNotificationInicio(message, type = 'info') {
    if (typeof showNotification === 'function') {
        showNotification(message, type);
        return;
    }
    
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
        ${type === 'error' ? 'border-left: 4px solid #ef4444;' : ''}
        ${type === 'success' ? 'border-left: 4px solid #10b981;' : ''}
    `;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : '📢';
    notification.innerHTML = `<div style="font-size: 0.95rem; white-space: pre-line;">${icon} ${message}</div>`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

// Exponer funciones globalmente
window.PromotionSystemInicio = PromotionSystemInicio;
window.openPromotionModalInicio = openPromotionModalInicio;
window.closePromotionModalInicio = closePromotionModalInicio;
window.selectPromotionPlanInicio = selectPromotionPlanInicio;
window.confirmPromotionInicio = confirmPromotionInicio;

// También exponer con nombres estándar para compatibilidad
window.openPromotionModal = openPromotionModalInicio;
window.closePromotionModal = closePromotionModalInicio;

console.log('✅ Sistema de promoción completo cargado (versión inicio)');