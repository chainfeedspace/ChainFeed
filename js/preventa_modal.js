                /**
 * preventa_modal.js - Sistema de Modal de Preventa CFT con Proton WebSDK
 * Versión: 2.0.0
 * Maneja la compra de tokens CFT con USDT/USDC usando Proton Wallet
 */

// Configuración de Proton
const PROTON_CONFIG = {
    chainId: "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0",
    endpoints: ["https://proton.greymass.com"],
    appName: "chainfeed"
};

// Configuración de contratos de tokens
const TOKEN_CONTRACTS = {
    USDT: {
        contract: 'xtokens',
        symbol: 'XUSDT',
        decimals: 6
    },
    USDC: {
        contract: 'xtokens',
        symbol: 'XUSDC',
        decimals: 6
    }
};

// Configuración de precios
const PRICE_CONFIG = {
    USDT: 1.00,
    USDC: 1.00,
    CFT: 0.01, // Precio fijo
    MIN_PURCHASE: 10,
    MAX_PURCHASE: 100000
};

// Estado del modal y SDK
let modalState = {
    isOpen: false,
    selectedCurrency: 'USDT',
    amount: '',
    cftAmount: 0,
    isProcessing: false
};

let protonSDK = {
    link: null,
    session: null
};

/**
 * Inicializa el sistema de modal de preventa
 */
function initPreventaModal() {
    console.log("💰 Sistema de preventa modal con Proton WebSDK iniciado");
    injectModalHTML();
    setupModalEventListeners();
    setupTokenButtons();
}

/**
 * Inyecta el HTML del modal (igual que antes, sin cambios)
 */
function injectModalHTML() {
    const modalHTML = `
        <div id="preventa-modal" class="preventa-modal-overlay">
            <div class="preventa-modal">
                <button class="preventa-modal-close" onclick="closePreventaModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <div class="preventa-modal-header">
                    <div class="preventa-modal-icon">🚀</div>
                    <h2>Comprar Tokens CFT</h2>
                    <p>Fase 1 - Bonus 20% incluido</p>
                </div>

            <div class="preventa-modal-body">
    <!-- Pestañas de moneda -->
    <div class="currency-tabs">
        <button class="currency-tab active" data-currency="USDT">
            <div class="tab-icon">
                <img src="/icons/usdt.png" alt="USDT" class="tab-icon-img">
            </div>
            <div class="tab-info">
                <span class="tab-name">USDT</span>
                <span class="tab-rate">$10.00</span>
            </div>
        </button>
        <button class="currency-tab" data-currency="USDC">
            <div class="tab-icon">
                <img src="/icons/usdc.png" alt="USDC" class="tab-icon-img">
            </div>
            <div class="tab-info">
                <span class="tab-name">USDC</span>
                <span class="tab-rate">$10.00</span>
            </div>
        </button>
    </div>

                    <!-- Input de monto -->
                    <div class="amount-input-container">
                        <label for="amount-input">Monto a invertir</label>
                        <div class="amount-input-wrapper">
                            <input 
                                type="number" 
                                id="amount-input" 
                                class="amount-input" 
                                placeholder="0.00"
                                min="${PRICE_CONFIG.MIN_PURCHASE}"
                                max="${PRICE_CONFIG.MAX_PURCHASE}"
                                step="0.01"
                            />
                            <span class="input-currency" id="input-currency">USDT</span>
                        </div>
                        <div class="amount-limits">
                            Mínimo: $${PRICE_CONFIG.MIN_PURCHASE} • Máximo: $${PRICE_CONFIG.MAX_PURCHASE.toLocaleString()}
                        </div>
                    </div>

                    <!-- Botones de monto rápido -->
                    <div class="quick-amounts">
                        <button class="quick-amount-btn" data-amount="50">$50</button>
                        <button class="quick-amount-btn" data-amount="100">$100</button>
                        <button class="quick-amount-btn" data-amount="500">$500</button>
                        <button class="quick-amount-btn" data-amount="1000">$1,000</button>
                    </div>

                    <!-- Separador -->
                    <div class="conversion-separator">
                        <div class="separator-line"></div>
                        <div class="separator-icon">⬇️</div>
                        <div class="separator-line"></div>
                    </div>

                    <!-- Resultado de conversión -->
                    <div class="conversion-result">
                        <div class="result-label">Recibirás</div>
                        <div class="result-amount" id="cft-result">0</div>
                        <div class="result-currency">CFT</div>
                        <div class="result-bonus">+ 20% Bonus Fase 1</div>
                    </div>

                    <!-- Información adicional -->
                    <div class="purchase-info">
                        <div class="info-row">
                            <span class="info-label">Precio por CFT:</span>
                            <span class="info-value">$0.01</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Tokens base:</span>
                            <span class="info-value" id="base-tokens">0 CFT</span>
                        </div>
                        <div class="info-row highlight">
                            <span class="info-label">Bonus (20%):</span>
                            <span class="info-value" id="bonus-tokens">0 CFT</span>
                        </div>
                    </div>

                    <!-- Botón de compra -->
                    <button class="purchase-btn" id="purchase-btn" onclick="processPurchase()">
                        <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span id="purchase-btn-text">Comprar Tokens</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    if (!document.getElementById('preventa-modal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    injectModalStyles();
}

/**
 * Inyecta estilos CSS (sin cambios)
 */
function injectModalStyles() {
    if (document.getElementById('preventa-modal-styles')) return;

    const styles = `
         <style id="preventa-modal-styles">
            .preventa-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                padding: 20px;
                box-sizing: border-box;
            }

            .preventa-modal-overlay.show {
                opacity: 1;
                visibility: visible;
            }
/* Estilos para imágenes de iconos en tabs de moneda */
.tab-icon-img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    display: block;
}

/* Ajuste del contenedor para centrar la imagen */
.tab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
}
    /* Para iconos más grandes (40px) */
.tab-icon-img {
    width: 40px;
    height: 40px;
}

/* Para iconos más pequeños (24px) */
.tab-icon-img {
    width: 24px;
    height: 24px;
}
            .preventa-modal {
                background: linear-gradient(135deg, #0f0f14 0%, #1a1a24 100%);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 24px;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6),
                            0 0 100px rgba(99, 102, 241, 0.1);
                max-width: 520px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9) translateY(30px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .preventa-modal-overlay.show .preventa-modal {
                transform: scale(1) translateY(0);
            }

            .preventa-modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.05);
                color: #ffffff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 1;
            }

            .preventa-modal-close:hover {
                background: rgba(239, 68, 68, 0.2);
                transform: rotate(90deg);
            }

            .preventa-modal-header {
                padding: 40px 32px 24px;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .preventa-modal-icon {
                font-size: 48px;
                margin-bottom: 16px;
                animation: float 3s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            .preventa-modal-header h2 {
                font-size: 28px;
                font-weight: 800;
                margin-bottom: 8px;
                background: linear-gradient(135deg, #ffffff, #6366f1);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .preventa-modal-header p {
                font-size: 14px;
                color: #a0a0b8;
            }

            .preventa-modal-body {
                padding: 32px;
            }

            .currency-tabs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 32px;
            }

            .currency-tab {
                background: rgba(255, 255, 255, 0.03);
                border: 2px solid rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .currency-tab:hover {
                background: rgba(99, 102, 241, 0.1);
                border-color: rgba(99, 102, 241, 0.3);
                transform: translateY(-2px);
            }

            .currency-tab.active {
                background: rgba(99, 102, 241, 0.15);
                border-color: #6366f1;
                box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
            }

            .tab-icon {
                font-size: 32px;
            }

            .tab-info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                flex: 1;
            }

            .tab-name {
                font-size: 16px;
                font-weight: 700;
                color: #ffffff;
            }

            .tab-rate {
                font-size: 12px;
                color: #a0a0b8;
            }

            .amount-input-container {
                margin-bottom: 20px;
            }

            .amount-input-container label {
                display: block;
                font-size: 14px;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 12px;
            }

            .amount-input-wrapper {
                position: relative;
            }

            .amount-input {
                width: 100%;
                padding: 10px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                font-size: 24px;
                font-weight: 700;
                color: #ffffff;
                font-family: inherit;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            .amount-input:focus {
                outline: none;
                border-color: #6366f1;
                background: rgba(99, 102, 241, 0.05);
                box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
            }

            .amount-input::placeholder {
                color: rgba(255, 255, 255, 0.3);
            }

            .input-currency {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 16px;
                font-weight: 700;
                color: #6366f1;
                background: rgba(99, 102, 241, 0.1);
                padding: 6px 12px;
                border-radius: 8px;
            }

            .amount-limits {
                font-size: 12px;
                color: #a0a0b8;
                margin-top: 8px;
            }

            .quick-amounts {
                display: flex;
                justify-content: space-around;
                gap: 8px;
                margin-bottom: 32px;
            }

            .quick-amount-btn {
                padding: 12px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                width: 100%;
                color: #ffffff;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .quick-amount-btn:hover {
                background: rgba(99, 102, 241, 0.1);
                border-color: #6366f1;
                transform: translateY(-2px);
            }

            .conversion-separator {
                display: flex;
                align-items: center;
                gap: 16px;
                margin: 32px 0;
            }

            .separator-line {
                flex: 1;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            }

            .separator-icon {
                font-size: 24px;
                animation: bounce 2s ease-in-out infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(8px); }
            }

            .conversion-result {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                border: 2px solid rgba(99, 102, 241, 0.3);
                border-radius: 20px;
                padding: 28px;
                text-align: center;
                margin-bottom: 24px;
                position: relative;
                overflow: hidden;
            }

            .conversion-result::before {
                content: "";
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                animation: shimmer 3s infinite;
            }

            @keyframes shimmer {
                to { left: 100%; }
            }

            .result-label {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #a0a0b8;
                margin-bottom: 12px;
            }

            .result-amount {
                font-size: 48px;
                font-weight: 900;
                background: linear-gradient(135deg, #6366f1, #a855f7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 8px;
                line-height: 1;
            }

            .result-currency {
                font-size: 18px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 12px;
            }

            .result-bonus {
                display: inline-block;
                padding: 6px 16px;
                background: rgba(16, 185, 129, 0.15);
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 100px;
                font-size: 12px;
                font-weight: 600;
                color: #10b981;
            }

            .purchase-info {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 24px;
            }

            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .info-row:last-child {
                border-bottom: none;
            }

            .info-row.highlight {
                background: rgba(16, 185, 129, 0.05);
                padding: 12px;
                border-radius: 8px;
                margin-top: 8px;
                border: none;
            }

            .info-label {
                font-size: 14px;
                color: #a0a0b8;
            }

            .info-value {
                font-size: 14px;
                font-weight: 700;
                color: #ffffff;
            }

            .info-row.highlight .info-value {
                color: #10b981;
            }

            .purchase-btn {
                width: 100%;
                padding: 18px 32px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border: none;
                border-radius: 16px;
                color: #ffffff;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
            }

            .purchase-btn:hover:not(:disabled) {
                transform: translateY(-3px);
                box-shadow: 0 15px 40px rgba(99, 102, 241, 0.4);
            }

            .purchase-btn:active:not(:disabled) {
                transform: translateY(-1px);
            }

            .purchase-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .purchase-btn.processing {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                pointer-events: none;
            }

            .btn-icon {
                transition: transform 0.3s ease;
            }

            .purchase-btn:hover .btn-icon {
                transform: scale(1.1);
            }

            .btn-spinner {
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            @media (max-width: 768px) {
                .preventa-modal {
                    max-width: 100%;
                    border-radius: 20px;
                    max-height: 95vh;
                }

                .preventa-modal-header {
                    padding: 32px 20px 20px;
                }

                .preventa-modal-body {
                    padding: 0 24px 20px;
                }

                .preventa-modal-header h2 {
                    font-size: 24px;
                }

                .result-amount {
                    font-size: 36px;
                }
            }

            .preventa-modal::-webkit-scrollbar {
                width: 8px;
            }

            .preventa-modal::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            .preventa-modal::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.5);
                border-radius: 10px;
            }

            .preventa-modal::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.7);
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
}

/**
 * Configura event listeners
 */
function setupModalEventListeners() {
    const modal = document.getElementById('preventa-modal');
    if (!modal) return;

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePreventaModal();
        }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalState.isOpen) {
            closePreventaModal();
        }
    });

    // Pestañas de moneda
    const tabs = document.querySelectorAll('.currency-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            modalState.selectedCurrency = tab.dataset.currency;
            document.getElementById('input-currency').textContent = modalState.selectedCurrency;
            console.log(`💱 Moneda seleccionada: ${modalState.selectedCurrency}`);
        });
    });

    // Input de monto
    const amountInput = document.getElementById('amount-input');
    amountInput.addEventListener('input', (e) => {
        modalState.amount = e.target.value;
        calculateCFTAmount();
    });

    // Botones de monto rápido
    const quickBtns = document.querySelectorAll('.quick-amount-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            amountInput.value = amount;
            modalState.amount = amount;
            calculateCFTAmount();
        });
    });
}

/**
 * Configura botones de apertura
 */
function setupTokenButtons() {
    const tokenButtons = document.querySelectorAll('.nav-cta, .btn-hero-primary, .btn-hero-secondary');
    
    tokenButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        
        // 🔥 NUEVO: Detectar botón de Whitepaper
        if (buttonText.includes('whitepaper') || buttonText.includes('white paper')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/whitepaper';
            });
            return; // Salir para no agregar el evento de modal
        }
        
        // Botones que abren el modal de preventa
        if (buttonText.includes('comprar') || 
            buttonText.includes('token') ||
            buttonText.includes('preventa') ||
            buttonText.includes('participar')) {
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openPreventaModal();
            });
        }
    });
}

/**
 * Calcula cantidad de CFT
 */
function calculateCFTAmount() {
    const amount = parseFloat(modalState.amount) || 0;
    
    if (amount < PRICE_CONFIG.MIN_PURCHASE) {
        updateResults(0, 0, 0);
        return;
    }

    const baseTokens = amount / PRICE_CONFIG.CFT;
    const bonusTokens = baseTokens * 0.20;
    const totalTokens = baseTokens + bonusTokens;

    modalState.cftAmount = totalTokens;
    
    updateResults(totalTokens, baseTokens, bonusTokens);
}

/**
 * Actualiza resultados en UI
 */
function updateResults(total, base, bonus) {
    const resultElement = document.getElementById('cft-result');
    const baseElement = document.getElementById('base-tokens');
    const bonusElement = document.getElementById('bonus-tokens');

    animateValue(resultElement, parseFloat(resultElement.textContent.replace(/,/g, '')) || 0, total, 500);
    
    baseElement.textContent = `${base.toLocaleString('en-US', { maximumFractionDigits: 2 })} CFT`;
    bonusElement.textContent = `${bonus.toLocaleString('en-US', { maximumFractionDigits: 2 })} CFT`;
}

/**
 * Anima valores numéricos
 */
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutQuad(progress);
        element.textContent = current.toLocaleString('en-US', { maximumFractionDigits: 2 });
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

/**
 * Abre el modal
 */
function openPreventaModal() {
    const modal = document.getElementById('preventa-modal');
    if (!modal) {
        console.error('Modal no encontrado');
        return;
    }

    modalState.isOpen = true;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Limpiar valores
    document.getElementById('amount-input').value = '';
    modalState.amount = '';
    updateResults(0, 0, 0);
    
    console.log('💰 Modal de preventa abierto');
}

/**
 * Cierra el modal
 */
function closePreventaModal() {
    const modal = document.getElementById('preventa-modal');
    if (!modal) return;

    modalState.isOpen = false;
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Limpiar SDK si existe
    if (protonSDK.link && protonSDK.session) {
        try {
            protonSDK.link.removeSession(PROTON_CONFIG.appName, protonSDK.session.auth, PROTON_CONFIG.chainId);
        } catch (e) {
            console.log('Error limpiando sesión:', e);
        }
    }
    
    protonSDK.link = null;
    protonSDK.session = null;
    
    console.log('💰 Modal de preventa cerrado');
}

/**
 * FUNCIÓN PRINCIPAL: Procesa la compra
 */
async function processPurchase() {
    const amount = parseFloat(modalState.amount);
    const purchaseBtn = document.getElementById('purchase-btn');
    
    // Validaciones
    if (!amount || amount < PRICE_CONFIG.MIN_PURCHASE) {
        showModalNotification(`El monto mínimo es $${PRICE_CONFIG.MIN_PURCHASE}`, 'error');
        return;
    }
    
    if (amount > PRICE_CONFIG.MAX_PURCHASE) {
        showModalNotification(`El monto máximo es $${PRICE_CONFIG.MAX_PURCHASE.toLocaleString()}`, 'error');
        return;
    }
    
    try {
        modalState.isProcessing = true;
        
        // Cambiar estado del botón
        purchaseBtn.classList.add('processing');
        purchaseBtn.innerHTML = `
            <div class="btn-spinner"></div>
            <span>Conectando wallet...</span>
        `;
        purchaseBtn.disabled = true;
        
        console.log('🚀 Iniciando proceso de compra:', {
            amount: amount,
            currency: modalState.selectedCurrency,
            cftTotal: modalState.cftAmount
        });
        
        // PASO 1: Conectar con Proton Wallet
        purchaseBtn.innerHTML = `
            <div class="btn-spinner"></div>
            <span>Conectando Proton Wallet...</span>
        `;
        
        await connectProtonWallet();
        
        if (!protonSDK.session || !protonSDK.session.auth) {
            throw new Error('No se pudo conectar con Proton Wallet');
        }
        
        const userWallet = protonSDK.session.auth.actor.toString();
        console.log('✅ Wallet conectada:', userWallet);
        
        // PASO 2: Ejecutar transferencia blockchain
        purchaseBtn.innerHTML = `
            <div class="btn-spinner"></div>
            <span>Esperando confirmación en tu wallet...</span>
        `;
        
        const tokenConfig = TOKEN_CONTRACTS[modalState.selectedCurrency];
        const transactionResult = await executeProtonTransfer(
            userWallet,
            amount,
            tokenConfig
        );
        
        console.log('✅ Transacción blockchain exitosa:', transactionResult.transaction_id);
        
        // PASO 3: Registrar en backend
        purchaseBtn.innerHTML = `
            <div class="btn-spinner"></div>
            <span>Registrando compra...</span>
        `;
        
        const baseTokens = amount / PRICE_CONFIG.CFT;
        const bonusTokens = baseTokens * 0.20;
        const totalTokens = baseTokens + bonusTokens;
        
const backendResult = await registerPurchaseInBackend({
    monto_usd: amount,
    moneda: modalState.selectedCurrency,
    cft_base: baseTokens,
    cft_bonus: bonusTokens,
    cft_total: totalTokens,
    transaction_id: transactionResult.transaction_id,
    wallet_address: userWallet,
    user_id: window.preventaUserData?.user_id || null  // 🔥 AGREGAR ESTA LÍNEA
});
        
        console.log('✅ Compra registrada en backend:', backendResult);
        
        // ÉXITO
        purchaseBtn.classList.remove('processing');
        purchaseBtn.classList.add('success');
        purchaseBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>¡Compra Exitosa!</span>
        `;
        
        showModalNotification(
            `¡Compra exitosa! Recibiste ${totalTokens.toLocaleString('en-US', { maximumFractionDigits: 2 })} CFT`,
            'success'
        );
        
        // Actualizar stats en tiempo real
        console.log('🔄 Actualizando stats de preventa...');
        
        try {
            if (typeof window.refreshPreventaStats === 'function') {
                await window.refreshPreventaStats();
                console.log('✅ Stats del contador actualizadas');
            }
        } catch (refreshError) {
            console.error('⚠️ Error actualizando stats:', refreshError);
        }
        
        // Pequeño delay para mostrar el éxito
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Cerrar modal
        closePreventaModal();
        
setTimeout(() => {
    const userCard = document.querySelector('.stat-card.user-card');
    if (userCard) {
        userCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Efecto visual: resaltar la tarjeta brevemente
        userCard.style.transition = 'all 0.3s ease';
        userCard.style.transform = 'scale(1.05)';
        userCard.style.boxShadow = '0 20px 60px rgba(99, 102, 241, 0.4)';
        
        setTimeout(() => {
            userCard.style.transform = 'scale(1)';
            userCard.style.boxShadow = '';
        }, 1000);
    }
    
    // Recargar después del scroll
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}, 500);
        
    } catch (error) {
        console.error('❌ Error en la compra:', error);
        
        purchaseBtn.classList.remove('processing');
        purchaseBtn.innerHTML = `
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Comprar Tokens</span>
        `;
        purchaseBtn.disabled = false;
        
        let errorMessage = 'Error al procesar la compra. ';
        
        if (error.message.includes('User rejected') || error.message.includes('rejected')) {
            errorMessage += 'Transacción cancelada por el usuario.';
        } else if (error.message.includes('insufficient') || error.message.includes('overdrawn')) {
            errorMessage += `Saldo insuficiente de ${modalState.selectedCurrency} en tu wallet.`;
        } else if (error.message.includes('session')) {
            errorMessage += 'No se pudo conectar con tu wallet. Intenta nuevamente.';
        } else {
            errorMessage += error.message || 'Error desconocido.';
        }
        
        showModalNotification(errorMessage, 'error');
        
    } finally {
        modalState.isProcessing = false;
    }
}

/**
 * Conecta con Proton Wallet y crea sesión PHP
 */
async function connectProtonWallet() {
    try {
        console.log('🔐 Iniciando conexión con Proton Wallet...');
        
        // Verificar que ProtonWebSDK esté disponible
        if (typeof ProtonWebSDK === 'undefined') {
            throw new Error('ProtonWebSDK no está cargado. Recarga la página.');
        }
        
        // Conectar con Proton
        const { link, session } = await ProtonWebSDK({
            linkOptions: {
                endpoints: PROTON_CONFIG.endpoints,
                chainId: PROTON_CONFIG.chainId,
                restoreSession: false
            },
            transportOptions: {
                requestAccount: PROTON_CONFIG.appName
            },
            selectorOptions: {
                appName: "ChainFeed Token Sale",
                appLogo: "https://chainfeed.space/icons/logo96.png",
                customStyleOptions: {
                    modalBackgroundColor: "#0f0f14",
                    logoBackgroundColor: "#6366f1",
                    isLogoRound: true,
                    optionBackgroundColor: "#1a1a24",
                    optionFontColor: "#ffffff",
                    primaryFontColor: "#ffffff",
                    secondaryFontColor: "#a0a0b8",
                    linkColor: "#6366f1"
                }
            }
        });
        
        if (!session || !session.auth) {
            throw new Error('No se pudo obtener sesión de Proton');
        }
        
        // Guardar en estado global
        protonSDK.link = link;
        protonSDK.session = session;
        
        const walletAddress = session.auth.actor.toString();
        console.log('✅ Conectado con Proton:', walletAddress);
        
        // 🔥 CREAR SESIÓN PHP USANDO TU ENDPOINT EXISTENTE 🔥
        console.log('📝 Creando sesión PHP en el servidor...');
        
        const loginResponse = await fetch('https://chainfeed.space/php/procesar_login.php', {
            method: 'POST',
            credentials: 'include', // CRÍTICO: enviar cookies de sesión
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wallet_address: walletAddress
            })
        });
        
        if (!loginResponse.ok) {
            const errorText = await loginResponse.text();
            console.error('Error response:', errorText);
            throw new Error(`Error HTTP ${loginResponse.status} al crear sesión`);
        }
        
        const loginData = await loginResponse.json();
        
        if (!loginData.success) {
            throw new Error(loginData.message || 'Error creando sesión en servidor');
        }
        
        console.log('✅ Sesión PHP creada exitosamente');
        console.log('✅ Session ID:', loginData.session_info?.session_id);
        console.log('✅ Usuario:', loginData.user);
        
        // Opcional: Actualizar UI con datos del usuario
        if (loginData.user) {
            console.log(`👤 Logueado como: ${loginData.user.display_name} (@${loginData.user.username})`);
        }
        
      // Guardar datos del usuario para usarlos después
window.preventaUserData = {
    user_id: loginData.user?.id || null,
    username: loginData.user?.username || null,
    wallet_address: walletAddress
};

console.log('💾 Datos de usuario guardados:', window.preventaUserData);

return session;
        
    } catch (error) {
        console.error('❌ Error en connectProtonWallet:', error);
        throw new Error('No se pudo conectar: ' + error.message);
    }
}

async function executeProtonTransfer(fromWallet, amountUSD, tokenConfig) {
    try {
        console.log('💸 Ejecutando transferencia blockchain:', {
            from: fromWallet,
            to: 'chainfeed',
            amount: amountUSD,
            token: tokenConfig.symbol,
            contract: tokenConfig.contract
        });
        
        // Formatear cantidad según decimales del token
        const formattedAmount = `${amountUSD.toFixed(tokenConfig.decimals)} ${tokenConfig.symbol}`;
        console.log('💰 Cantidad formateada:', formattedAmount);
        
        // Construir transacción
        const actions = [{
            account: tokenConfig.contract,
            name: 'transfer',
            authorization: [{
                actor: fromWallet,
                permission: 'active'
            }],
            data: {
                from: fromWallet,
                to: 'chainfeed',
                quantity: formattedAmount,
                memo: `ChainFeed Token Purchase - Phase 1 with 20% bonus`
            }
        }];
        
        console.log('📤 Enviando transacción a Proton blockchain...');
        
        // Ejecutar transacción
        const result = await protonSDK.session.transact(
            { actions },
            {
                broadcast: true,
                blocksBehind: 3,
                expireSeconds: 30
            }
        );
        
        // 🔥 EXTRACCIÓN ROBUSTA DEL TRANSACTION ID 🔥
        console.log('🔍 === DEBUG: RESULTADO COMPLETO DE TRANSACCIÓN ===');
        console.log('Tipo de resultado:', typeof result);
        console.log('Keys disponibles:', Object.keys(result));
        console.log('Resultado completo:', result);
        
        let txId = null;
        
        // Método 1: Propiedad directa transaction_id
        if (result.transaction_id) {
            txId = result.transaction_id;
            console.log('✅ TX ID encontrado en: result.transaction_id');
        } 
        // Método 2: Propiedad alternativa transactionId
        else if (result.transactionId) {
            txId = result.transactionId;
            console.log('✅ TX ID encontrado en: result.transactionId');
        }
        // Método 3: Dentro de processed.id
        else if (result.processed && result.processed.id) {
            txId = result.processed.id;
            console.log('✅ TX ID encontrado en: result.processed.id');
        }
        // Método 4: Dentro de transaction.id
        else if (result.transaction && result.transaction.id) {
            txId = result.transaction.id;
            console.log('✅ TX ID encontrado en: result.transaction.id');
        }
        // Método 5: Dentro de response
        else if (result.response && result.response.transaction_id) {
            txId = result.response.transaction_id;
            console.log('✅ TX ID encontrado en: result.response.transaction_id');
        }
        // Método 6: Buscar en resolved
        else if (result.resolved && result.resolved.transaction) {
            if (result.resolved.transaction.id) {
                txId = result.resolved.transaction.id;
                console.log('✅ TX ID encontrado en: result.resolved.transaction.id');
            } else if (typeof result.resolved.transaction === 'string') {
                txId = result.resolved.transaction;
                console.log('✅ TX ID encontrado en: result.resolved.transaction (string)');
            }
        }
        // Método 7: Último intento - buscar cualquier string largo que parezca un hash
        else {
            console.warn('⚠️ Buscando TX ID en todas las propiedades...');
            
            const searchForTxId = (obj, path = '') => {
                for (const key in obj) {
                    const newPath = path ? `${path}.${key}` : key;
                    const value = obj[key];
                    
                    // Si es un string largo (más de 50 caracteres), probablemente sea el TX ID
                    if (typeof value === 'string' && value.length > 50 && /^[a-f0-9]+$/i.test(value)) {
                        console.log(`⚠️ Posible TX ID encontrado en: ${newPath} = ${value}`);
                        return value;
                    }
                    
                    // Buscar recursivamente en objetos
                    if (value && typeof value === 'object' && !Array.isArray(value)) {
                        const found = searchForTxId(value, newPath);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            txId = searchForTxId(result);
            
            if (txId) {
                console.log('✅ TX ID encontrado mediante búsqueda recursiva');
            }
        }
        
        console.log('🔍 === FIN DEBUG ===');
        
        // Validar que se obtuvo el TX ID
        if (!txId || typeof txId !== 'string' || txId.length < 10) {
            console.error('❌ ERROR CRÍTICO: NO SE PUDO OBTENER TRANSACTION ID VÁLIDO');
            console.error('TX ID obtenido:', txId);
            console.error('Objeto result completo:', JSON.stringify(result, null, 2));
            
            throw new Error(
                'No se pudo obtener el Transaction ID de la transacción. ' +
                'La transferencia blockchain se completó exitosamente, ' +
                'pero no podemos registrarla en el sistema. ' +
                'Por favor contacta a soporte inmediatamente con esta información: ' +
                'Wallet: ' + fromWallet + ', ' +
                'Monto: ' + amountUSD + ' ' + tokenConfig.symbol + ', ' +
                'Timestamp: ' + new Date().toISOString()
            );
        }
        
        console.log('✅ Transacción blockchain exitosa');
        console.log('🔗 Transaction ID:', txId);
        console.log('📊 Detalles:', {
            from: fromWallet,
            to: 'chainfeed',
            amount: formattedAmount,
            tx_id: txId
        });
        
        return {
            transaction_id: txId,
            processed: result.processed || result,
            raw_result: result
        };
        
    } catch (error) {
        console.error('❌ Error en transferencia blockchain:', error);
        
        // Mensajes de error mejorados y específicos
        if (error.message.includes('User rejected') || 
            error.message.includes('canceled') || 
            error.message.includes('cancelled')) {
            throw new Error('Transacción cancelada por el usuario');
        } 
        else if (error.message.includes('insufficient') || 
                   error.message.includes('overdrawn') ||
                   error.message.includes('balance')) {
            throw new Error(
                `Saldo insuficiente de ${tokenConfig.symbol} en tu wallet. ` +
                `Necesitas al menos $${amountUSD} ${tokenConfig.symbol} disponibles.`
            );
        }
        else if (error.message.includes('ram') || error.message.includes('RAM')) {
            throw new Error(
                'RAM insuficiente en tu cuenta Proton. ' +
                'Necesitas adquirir más RAM para realizar esta transacción. ' +
                'Contacta soporte si necesitas ayuda.'
            );
        }
        else if (error.message.includes('cpu') || error.message.includes('CPU')) {
            throw new Error(
                'CPU insuficiente. Tu cuenta necesita recargar recursos. ' +
                'Espera unos minutos e intenta nuevamente.'
            );
        }
        else if (error.message.includes('net') || error.message.includes('NET')) {
            throw new Error(
                'Ancho de banda (NET) insuficiente. ' +
                'Espera unos minutos para que se recargue e intenta nuevamente.'
            );
        }
        else if (error.message.includes('No se pudo obtener el Transaction ID')) {
            // Re-lanzar el error tal cual si es nuestro error personalizado
            throw error;
        }
        else {
            throw new Error(
                'Error en la transacción blockchain: ' + 
                (error.message || 'Error desconocido. Intenta nuevamente.')
            );
        }
    }
}

/**
 * Registra la compra en el backend
 */
async function registerPurchaseInBackend(purchaseData) {
    try {
        const payload = {
            action: 'confirmar_compra',
            ...purchaseData
        };
        
        const response = await fetch('https://chainfeed.space/php/procesar_preventa.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        // Leer respuesta como texto primero
        const responseText = await response.text();
        
        // 🔥 DEBUG: VER QUÉ ESTÁ DEVOLVIENDO EL SERVIDOR 🔥
        console.log('📊 Status HTTP:', response.status);
        console.log('📄 Respuesta del servidor:', responseText);
        console.log('📦 Headers:', Object.fromEntries(response.headers.entries()));
        // 🔥 FIN DEBUG 🔥
        
        // Intentar parsear como JSON
        let result;
        try {
            result = JSON.parse(responseText);
            console.log('✅ JSON parseado:', result);
        } catch (parseError) {
            console.error('❌ Error parseando respuesta:', parseError);
            console.error('Texto recibido:', responseText);
            throw new Error('Respuesta inválida del servidor');
        }
        
        // Verificar si fue exitosa
        if (!result.success) {
            console.error('❌ Respuesta no exitosa:', result);
            throw new Error(result.error || result.message || 'Error interno del servidor');
        }
        
        return result;
        
    } catch (error) {
        console.error('Error en registerPurchaseInBackend:', error.message);
        throw new Error('Error registrando compra: ' + error.message);
    }
}

/**
 * Muestra notificación
 */
function showModalNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'modal-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 16px 20px;
        background: rgba(26, 26, 36, 0.95);
        border: 1px solid ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
        border-left: 4px solid ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#6366f1'};
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        z-index: 10001;
        color: white;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
    `;
    
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">${icon}</span>
            <span style="line-height: 1.5;">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Exponer funciones globalmente
window.openPreventaModal = openPreventaModal;
window.closePreventaModal = closePreventaModal;
window.processPurchase = processPurchase;
window.modalState = modalState;

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreventaModal);
} else {
    initPreventaModal();
}

console.log('✨ Sistema de preventa con Proton WebSDK cargado correctamente');