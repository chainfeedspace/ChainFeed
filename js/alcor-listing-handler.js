/**
 * Gestor del Listing de CFT en Alcor y CoinGecko (DINÁMICO)
 * Archivo: /js/alcor-listing-handler.js
 * 
 * ⚠️ IMPORTANTE: Requiere listing-config.js cargado primero
 * 
 * Maneja:
 * - Botones dinámicos que cambian cuando llega la fecha
 * - Modales "coming soon" con iconos correctos
 * - Redirecciones automáticas cuando está disponible
 */

if (typeof LISTING_CONFIG === 'undefined') {
    console.error('❌ CRITICAL: listing-config.js no fue cargado');
    throw new Error('LISTING_CONFIG no disponible');
}

class ListingHandler {
    constructor() {
        this.alcorCountdownInterval = null;
        this.init();
    }

    init() {
        console.log('🚀 Inicializando ListingHandler dinámico...');
        this.updateAlcorButton();
        this.interceptExchangeLinks();
        this.startAlcorCountdownCheck();
        
        // Escuchar cambios de estado
        window.addEventListener('listing:alcor:live', () => this.onAlcorLive());
        window.addEventListener('listing:coingecko:live', () => this.onCoingeckoLive());
    }

    isAlcorLive() {
        return LISTING_CONFIG.isAlcorLive();
    }

    isCoingeckoLive() {
        return LISTING_CONFIG.isCoingeckoLive();
    }


updateAlcorButton() {
    const button = document.querySelector('.alcor-alert-btn-primary');
    
    if (!button) {
        console.log('⚠️ Botón .alcor-alert-btn-primary no encontrado');
        return;
    }

    if (this.isAlcorLive()) {
        // 🎉 ALCOR ESTÁ VIVO
        button.disabled = false;
        button.innerHTML = 'Ir a Alcor';
        button.onclick = () => window.open('https://alcor.exchange/', '_blank');
        button.classList.remove('disabled');
        console.log('✅ Botón Alcor HABILITADO');
    } else {
        // ⏳ AÚN NO
        button.disabled = true;
        button.innerHTML = 'Ir a Alcor (Próximamente)';
        button.onclick = null;
        button.classList.add('disabled');
        console.log('⏳ Botón Alcor DESHABILITADO');
    }
}


startAlcorCountdownCheck() {
    // Llamar una sola vez al inicio
    this.updateAlcorButton();
    
    // Escuchar SOLO si el listing cambia (evento)
    window.addEventListener('listing:alcor:live', () => {
        this.updateAlcorButton();
    });
    
    console.log('✅ Botón Alcor monitorizado (sin loop)');
}

    stopAlcorCountdownCheck() {
        if (this.alcorCountdownInterval) {
            clearInterval(this.alcorCountdownInterval);
            this.alcorCountdownInterval = null;
            console.log('🛑 Monitoreo Alcor detenido');
        }
    }

    interceptExchangeLinks() {
        const exchangeLinks = document.querySelectorAll('.exchange-card');
        
        if (exchangeLinks.length === 0) {
            console.log('⚠️ No hay .exchange-card');
            return;
        }
        
        exchangeLinks.forEach(link => {
            const exchangeName = link.textContent.toLowerCase();
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (exchangeName.includes('alcor')) {
                    this.handleAlcorClick();
                } else if (exchangeName.includes('coingecko')) {
                    this.handleCoingeckoClick();
                }
            });
        });

        console.log(`🔗 ${exchangeLinks.length} exchanges interceptados`);
    }

    handleAlcorClick() {
        if (this.isAlcorLive()) {
            window.open('https://alcor.exchange/', '_blank');
        } else {
            this.showAlcorComingSoonModal();
        }
    }

    handleCoingeckoClick() {
        if (this.isCoingeckoLive()) {
            window.open('https://www.coingecko.com/', '_blank');
        } else {
            this.showCoingeckoComingSoonModal();
        }
    }

    /**
     * Modal "Próximamente" para Alcor
     */
    showAlcorComingSoonModal() {
        console.log('⏳ Mostrando Alcor Coming Soon...');
        
        const daysLeft = LISTING_CONFIG.getDaysUntilAlcor();
        const dateStr = new Date(LISTING_CONFIG.ALCOR_DATE).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const modalDiv = document.createElement('div');
        modalDiv.className = 'listing-coming-soon-modal';
        modalDiv.innerHTML = `
            <div class="listing-coming-overlay">
                <div class="listing-coming-content">
                    <button class="listing-close-btn" onclick="this.closest('.listing-coming-soon-modal').remove(); document.body.style.overflow = 'auto';" data-translated="true">×</button>
                    
                    <div class="listing-coming-header">
                        <img src="/logos/alcor.png" alt="Alcor Exchange" class="listing-coming-logo">
                    </div>
                    
                    <div class="listing-coming-body">
                        <h2 class="listing-coming-title">Próximamente en Alcor DEX</h2>
                        
                        <p class="listing-coming-subtitle">CFT se listeará en Alcor</p>
                        
                        <div class="listing-days-left">
                            <span class="listing-days-number">${daysLeft}</span>
                            <span class="listing-days-label">días restantes</span>
                        </div>
                        
                        <p class="listing-coming-message">
                            El listing está confirmado para el <strong>${dateStr}</strong><span>. Sé el primero en intercambiar en Alcor DEX sin comisiones.</span>
                        </p>
                    </div>
                    
                    <div class="listing-coming-actions">
                        <button class="listing-coming-btn-investor" onclick="document.querySelector('.listing-coming-soon-modal').remove(); window.location.hash = '#cta'; document.body.style.overflow = 'auto';" data-translated="true">
                            <img src="/icons/logo192.png" alt="ChainFeed" class="listing-btn-icon">
                            Ronda de Inversores
                        </button>
                        <button class="listing-coming-btn-secondary" onclick="this.closest('.listing-coming-soon-modal').remove(); document.body.style.overflow = 'auto';" data-translated="true">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalDiv);
        document.body.style.overflow = 'hidden';
        
        const overlay = modalDiv.querySelector('.listing-coming-overlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                modalDiv.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }

    /**
     * Modal "Próximamente" para CoinGecko
     */
    showCoingeckoComingSoonModal() {
        console.log('⏳ Mostrando CoinGecko Coming Soon...');
        
        const daysLeft = Math.ceil((LISTING_CONFIG.COINGECKO_DATE - Date.now()) / (1000 * 60 * 60 * 24));
        const dateStr = new Date(LISTING_CONFIG.COINGECKO_DATE).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const modalDiv = document.createElement('div');
        modalDiv.className = 'listing-coming-soon-modal';
        modalDiv.innerHTML = `
            <div class="listing-coming-overlay">
                <div class="listing-coming-content">
                    <button class="listing-close-btn" onclick="this.closest('.listing-coming-soon-modal').remove(); document.body.style.overflow = 'auto';" data-translated="true">×</button>
                    
                    <div class="listing-coming-header">
                        <img src="/logos/coingecko.png" alt="CoinGecko" class="listing-coming-logo">
                    </div>
                    
                    <div class="listing-coming-body">
                        <h2 class="listing-coming-title">Próximamente en CoinGecko</h2>
                        
                        <p class="listing-coming-subtitle">CFT se agregará a CoinGecko</p>
                        
                        <div class="listing-days-left">
                            <span class="listing-days-number">${daysLeft}</span>
                            <span class="listing-days-label">días restantes</span>
                        </div>
                        
                        <p class="listing-coming-message">
                            El listado en CoinGecko está confirmado para el <strong>${dateStr}</strong><span>. Podrás seguir el precio y estadísticas de CFT.</span>
                        </p>
                    </div>
                    
                    <div class="listing-coming-actions">
                        <button class="listing-coming-btn-investor" onclick="document.querySelector('.listing-coming-soon-modal').remove(); window.location.hash = '#cta'; document.body.style.overflow = 'auto';" data-translated="true">
                            <img src="/icons/logo192.png" alt="ChainFeed" class="listing-btn-icon">
                            Ronda de Inversores
                        </button>
                        <button class="listing-coming-btn-secondary" onclick="this.closest('.listing-coming-soon-modal').remove(); document.body.style.overflow = 'auto';" data-translated="true">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalDiv);
        document.body.style.overflow = 'hidden';
        
        const overlay = modalDiv.querySelector('.listing-coming-overlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                modalDiv.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }

    /**
     * Callback cuando Alcor se vuelve VIVO
     */
    onAlcorLive() {
        console.log('🎉 ¡ALCOR ESTÁ VIVO!');
        this.updateAlcorButton();
        
        // Remover modal coming soon si existe
        const modals = document.querySelectorAll('.listing-coming-soon-modal');
        modals.forEach(modal => {
            if (modal.textContent.includes('Alcor')) {
                modal.remove();
                console.log('✅ Modal Alcor coming soon removido');
            }
        });
    }

    /**
     * Callback cuando CoinGecko se vuelve VIVO
     */
    onCoingeckoLive() {
        console.log('🎉 ¡COINGECKO ESTÁ VIVO!');
        
        // Remover modal coming soon si existe
        const modals = document.querySelectorAll('.listing-coming-soon-modal');
        modals.forEach(modal => {
            if (modal.textContent.includes('CoinGecko')) {
                modal.remove();
                console.log('✅ Modal CoinGecko coming soon removido');
            }
        });
    }

    injectStyles() {
        if (document.getElementById('listing-handler-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'listing-handler-styles';
        style.textContent = `
            /* ========== COMING SOON MODAL ========== */
            .listing-coming-soon-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10002;
            }

            .listing-coming-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: listingOverlayIn 0.3s ease;
            }

            @keyframes listingOverlayIn {
                from {
                    opacity: 0;
                    backdrop-filter: blur(0px);
                }
                to {
                    opacity: 1;
                    backdrop-filter: blur(12px);
                }
            }

            .listing-coming-content {
                background: linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(30, 20, 40, 0.95) 100%);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 20px;
                padding: 40px;
                max-width: 420px;
                width: 100%;
                position: relative;
                box-shadow: 0 25px 50px rgba(99, 102, 241, 0.2);
                animation: listingModalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            @keyframes listingModalIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .listing-close-btn {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.4);
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
                line-height: 1;
            }

            .listing-close-btn:hover {
                color: #fff;
            }

            .listing-coming-header {
                text-align: center;
                margin-bottom: 24px;
            }

            .listing-coming-logo {
                width: 80px;
                height: 80px;
                object-fit: contain;
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
                animation: listingBounce 2s infinite;
            }

            @keyframes listingBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            .listing-coming-body {
                margin-bottom: 32px;
            }

            .listing-coming-title {
                font-size: 24px;
                font-weight: 700;
                color: #fff;
                text-align: center;
                margin-bottom: 8px;
                letter-spacing: -0.02em;
            }

            .listing-coming-subtitle {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);
                text-align: center;
                margin-bottom: 20px;
            }

            .listing-days-left {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 20px;
                background: rgba(99, 102, 241, 0.08);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 12px;
                margin-bottom: 20px;
            }

            .listing-days-number {
                font-size: 32px;
                font-weight: 700;
                color: #6366f1;
                font-family: 'Courier New', monospace;
            }

            .listing-days-label {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .listing-coming-message {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);
                text-align: center;
                line-height: 1.6;
            }

            .listing-coming-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .listing-coming-btn-investor {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                height: 44px;
                background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%);
                color: #c4b5fd;
                border: 1px solid rgba(167, 139, 250, 0.4);
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
            }

            .listing-coming-btn-investor:hover {
                background: linear-gradient(135deg, rgba(167, 139, 250, 0.35) 0%, rgba(139, 92, 246, 0.25) 100%);
                border-color: rgba(167, 139, 250, 0.6);
                color: #e9d5ff;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3);
            }

            .listing-btn-icon {
                width: 16px;
                height: 16px;
                object-fit: contain;
            }

            .listing-coming-btn-secondary {
                height: 44px;
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .listing-coming-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.2);
                color: #fff;
            }

            @media (max-width: 600px) {
                .listing-coming-content {
                    padding: 28px 20px;
                    border-radius: 16px;
                }

                .listing-coming-title {
                    font-size: 20px;
                }

                .listing-coming-logo {
                    width: 64px;
                    height: 64px;
                }

                .listing-days-number {
                    font-size: 28px;
                }

                .listing-coming-btn-investor,
                .listing-coming-btn-secondary {
                    height: 40px;
                    font-size: 13px;
                }
            }
        `;

        document.head.appendChild(style);
        console.log('✅ Estilos ListingHandler inyectados');
    }
}

// ========== INICIALIZACIÓN ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const handler = new ListingHandler();
        handler.injectStyles();
        window.listingHandlerInstance = handler;
    });
} else {
    setTimeout(() => {
        const handler = new ListingHandler();
        handler.injectStyles();
        window.listingHandlerInstance = handler;
    }, 500);
}

console.log('✨ ListingHandler DINÁMICO cargado');