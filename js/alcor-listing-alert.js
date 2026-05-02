/**
 * Sistema de Aviso de Listing en Alcor y CoinGecko (DINÁMICO)
 * Archivo: /js/alcor-listing-alert.js
 * 
 * ⚠️ IMPORTANTE: Requiere listing-config.js cargado primero
 * 
 * Características dinámicas:
 * - Iconos y contenido cambian según estado de listing
 * - Botones se habilitan cuando el exchange está disponible
 * - Countdown desaparece cuando ya está disponible
 * - Se actualiza en tiempo real
 */

// 🔥 VERIFICAR que LISTING_CONFIG existe
if (typeof LISTING_CONFIG === 'undefined') {
    console.error('❌ CRITICAL: listing-config.js no fue cargado');
    throw new Error('LISTING_CONFIG no disponible - carga listing-config.js primero');
}

if (typeof ALCOR_ALERT === 'undefined') {
    var ALCOR_ALERT = {};
}

Object.assign(ALCOR_ALERT, {
    // USA LISTING_CONFIG centralizado
    get ALCOR_LISTING_DATE() {
        return LISTING_CONFIG.ALCOR_DATE;
    },
    
    get COINGECKO_LISTING_DATE() {
        return LISTING_CONFIG.COINGECKO_DATE;
    },
    
    // Estado del modal
    hasShownThisPageLoad: false,
    countdownInterval: null,
    isActive: false,
    
    /**
     * Verifica si Alcor está vivo
     */
    isAlcorLive() {
        return Date.now() >= this.ALCOR_LISTING_DATE;
    },
    
    /**
     * Verifica si CoinGecko está vivo
     */
    isCoingeckoLive() {
        return Date.now() >= this.COINGECKO_LISTING_DATE;
    },
    
    /**
     * 🟢 FUNCIÓN PARA OBTENER CONTADOR DINÁMICO DE COINGECKO
     */
    getCoingeckoCountdown() {
        if (this.isCoingeckoLive()) {
            return '0 days, 0 hours, 0 minutes';
        }
        
        const distance = this.COINGECKO_LISTING_DATE - Date.now();
        
        if (distance <= 0) {
            return '0 days, 0 hours, 0 minutes';
        }
        
        const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        
        // Detectar idioma
        const lang = document.documentElement.lang || 'en';
        
        if (lang === 'es') {
            const dayLabel = days !== 1 ? 'días' : 'día';
            const hourLabel = hours !== 1 ? 'horas' : 'hora';
            const minLabel = minutes !== 1 ? 'minutos' : 'minuto';
            return `${days} ${dayLabel}, ${hours} ${hourLabel}, ${minutes} ${minLabel}`;
        } else {
            const dayLabel = days !== 1 ? 'days' : 'day';
            const hourLabel = hours !== 1 ? 'hours' : 'hour';
            const minLabel = minutes !== 1 ? 'minutes' : 'minute';
            return `${days} ${dayLabel}, ${hours} ${hourLabel}, ${minutes} ${minLabel}`;
        }
    },
    
    /**
     * Obtiene el HTML del modal con contenido dinámico
     */
    getModalHTML() {
        const alcorLive = this.isAlcorLive();
        const coingeckoLive = this.isCoingeckoLive();
        
        // Si ambos están vivos, mostrar modal especial
        if (alcorLive && coingeckoLive) {
            return this.getModalBothLive();
        }
        
        // Si solo Alcor está vivo
        if (alcorLive) {
            return this.getModalAlcorLive();
        }
        
        // Si solo CoinGecko está vivo
        if (coingeckoLive) {
            return this.getModalCoingeckoLive();
        }
        
        // Si ninguno está vivo, mostrar countdownModal normal
        return this.getModalComingSoon();
    },
    
    /**
     * Modal cuando AMBOS están vivos
     */
    getModalBothLive() {
        return `
            <div id="alcor-alert-overlay" class="alcor-alert-overlay">
                <div class="alcor-alert-modal">
                    <button class="alcor-alert-close" onclick="window.ALCOR_ALERT.closeAlert()">×</button>
                    
                    <div class="alcor-alert-content">
                        <div class="alcor-alert-header alcor-alert-header-both">
                            <img src="/logos/alcor.png" alt="Alcor Exchange" class="alcor-alert-logo-small">
                            <span class="alcor-alert-both-separator">+</span>
                            <img src="/logos/coingecko.png" alt="CoinGecko" class="alcor-alert-logo-small">
                        </div>
                        
                        <div class="alcor-alert-body">
                            <h2 class="alcor-alert-title">¡CFT está disponible en todas partes!</h2>
                            
                            <p class="alcor-alert-subtitle">
                                Intercambia en <strong>Alcor DEX</strong> o sigue el precio en <strong>CoinGecko</strong>
                            </p>
                            
                            <p class="alcor-alert-message">
                                CFT está disponible en los principales mercados. Intercambia sin comisiones en Alcor DEX o sigue el precio en tiempo real en CoinGecko.
                            </p>
                        </div>
                        
                        <div class="alcor-alert-actions">
                            <button class="alcor-alert-btn alcor-alert-btn-primary" onclick="window.open('https://alcor.exchange/', '_blank')" data-no-translate>
                                Ir a Alcor DEX
                            </button>
                            <button class="alcor-alert-btn alcor-alert-btn-primary" onclick="window.open('https://www.coingecko.com/', '_blank')">
                                Ver en CoinGecko
                            </button>
                            <button class="alcor-alert-btn alcor-alert-btn-investor" onclick="window.ALCOR_ALERT.redirectToInvestors()">
                                <img src="/icons/logo192.png" alt="ChainFeed" class="investor-btn-icon">
                                Ronda de Inversores
                            </button>
                            <button class="alcor-alert-btn alcor-alert-btn-secondary" onclick="window.ALCOR_ALERT.closeAlert()">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Modal cuando SOLO Alcor está vivo
     * 🔴 AQUÍ ESTÁ EL FIX: Usa getCoingeckoCountdown() en lugar de fecha fija
     */
    getModalAlcorLive() {
        return `
            <div id="alcor-alert-overlay" class="alcor-alert-overlay">
                <div class="alcor-alert-modal">
                    <button class="alcor-alert-close" onclick="window.ALCOR_ALERT.closeAlert()">×</button>
                    
                    <div class="alcor-alert-content">
                        <div class="alcor-alert-header">
                            <img src="/logos/alcor.png" alt="Alcor Exchange" class="alcor-alert-logo">
                        </div>
                        
                        <div class="alcor-alert-body">
                            <h2 class="alcor-alert-title">¡CFT está disponible en Alcor!</h2>
                            
                            <p class="alcor-alert-subtitle">
                                Ahora puedes intercambiar en <strong>Alcor DEX</strong>
                            </p>
                            
                            <p class="alcor-alert-message">
                                CFT ya está disponible en Alcor DEX. Intercambia sin comisiones de transacción, rápido y seguro.
                            </p>

                            <p class="alcor-alert-next-event">
                                ⏳ CoinGecko disponible en: <strong id="coingecko-next-event-timer">${this.getCoingeckoCountdown()}</strong>
                            </p>
                        </div>
                        
                        <div class="alcor-alert-actions">
                            <button class="alcor-alert-btn alcor-alert-btn-primary" onclick="window.open('https://alcor.exchange/', '_blank')" data-no-translate>
                                Ir a Alcor DEX
                            </button>
                            <button class="alcor-alert-btn alcor-alert-btn-investor" onclick="window.ALCOR_ALERT.redirectToInvestors()">
                                <img src="/icons/logo192.png" alt="ChainFeed" class="investor-btn-icon">
                                Ronda de Inversores
                            </button>
                            <button class="alcor-alert-btn alcor-alert-btn-secondary" onclick="window.ALCOR_ALERT.closeAlert()">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Modal cuando SOLO CoinGecko está vivo
     */
    getModalCoingeckoLive() {
        return `
            <div id="alcor-alert-overlay" class="alcor-alert-overlay">
                <div class="alcor-alert-modal">
                    <button class="alcor-alert-close" onclick="window.ALCOR_ALERT.closeAlert()">×</button>
                    
                    <div class="alcor-alert-content">
                        <div class="alcor-alert-header">
                            <img src="/logos/coingecko.png" alt="CoinGecko" class="alcor-alert-logo">
                        </div>
                        
                        <div class="alcor-alert-body">
                            <h2 class="alcor-alert-title">¡CFT está disponible en CoinGecko!</h2>
                            
                            <p class="alcor-alert-subtitle">
                                Ahora puedes ver el precio en <strong>CoinGecko</strong>
                            </p>
                            
                            <p class="alcor-alert-message">
                                CFT ya está agregado a CoinGecko. Sigue el precio en tiempo real y accede a todas las estadísticas.
                            </p>
                            
                            <p class="alcor-alert-next-event">
                                ✅ Alcor DEX: Ya disponible para intercambiar
                            </p>
                        </div>
                        
                        <div class="alcor-alert-actions">
                            <button class="alcor-alert-btn alcor-alert-btn-primary" onclick="window.open('https://www.coingecko.com/', '_blank')">
                                Ver en CoinGecko
                            </button>
                            <button class="alcor-alert-btn alcor-alert-btn-investor" onclick="window.ALCOR_ALERT.redirectToInvestors()">
                                <img src="/icons/logo192.png" alt="ChainFeed" class="investor-btn-icon">
                                Ronda de Inversores
                            </button>
                            <button class="alcor-alert-btn alcor-alert-btn-secondary" onclick="window.ALCOR_ALERT.closeAlert()">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Modal Coming Soon (ninguno vivo aún)
     */
    getModalComingSoon() {
        return `
            <div id="alcor-alert-overlay" class="alcor-alert-overlay">
                <div class="alcor-alert-modal">
                    <button class="alcor-alert-close" onclick="window.ALCOR_ALERT.closeAlert()">×</button>
                    
                    <div class="alcor-alert-content">
                        <div class="alcor-alert-header alcor-alert-header-both">
                            <img src="/logos/alcor.png" alt="Alcor Exchange" class="alcor-alert-logo-small">
                            <span class="alcor-alert-both-separator">+</span>
                            <img src="/logos/coingecko.png" alt="CoinGecko" class="alcor-alert-logo-small">
                        </div>
                        
                        <div class="alcor-alert-body">
                            <h2 class="alcor-alert-title">¡CFT llega pronto!</h2>
                            
                            <p class="alcor-alert-subtitle">
                                El token CFT será listado en <strong>Alcor DEX</strong> y <strong>CoinGecko</strong>
                            </p>
                            
                            <div class="alcor-alert-countdown-section">
                                <div class="alcor-alert-countdown-item">
                                    <h4 class="alcor-countdown-title">Alcor DEX</h4>
                                    <div class="alcor-alert-countdown">
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="alcor-days">00</span>
                                            <span class="countdown-label">Días</span>
                                        </div>
                                        <span class="countdown-separator">:</span>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="alcor-hours">00</span>
                                            <span class="countdown-label">Horas</span>
                                        </div>
                                        <span class="countdown-separator">:</span>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="alcor-minutes">00</span>
                                            <span class="countdown-label">Minutos</span>
                                        </div>
                                    </div>
                                    <p class="alcor-countdown-date">
                                        ${new Date(this.ALCOR_LISTING_DATE).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                
                                <div class="alcor-alert-countdown-item">
                                    <h4 class="coingecko-countdown-title">CoinGecko</h4>
                                    <div class="coingecko-alert-countdown">
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="coingecko-days">00</span>
                                            <span class="countdown-label">Días</span>
                                        </div>
                                        <span class="countdown-separator">:</span>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="coingecko-hours">00</span>
                                            <span class="countdown-label">Horas</span>
                                        </div>
                                        <span class="countdown-separator">:</span>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="coingecko-minutes">00</span>
                                            <span class="countdown-label">Minutos</span>
                                        </div>
                                    </div>
                                    <p class="coingecko-countdown-date">
                                        ${new Date(this.COINGECKO_LISTING_DATE).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            
                            <p class="alcor-alert-message">
                                Prepárate para intercambiar tus tokens sin comisiones en Alcor DEX y sigue el precio en CoinGecko.
                            </p>
                        </div>
                        
                        <div class="alcor-alert-actions">
                            <button class="alcor-alert-btn alcor-alert-btn-investor" onclick="window.ALCOR_ALERT.redirectToInvestors()">
                                <img src="/icons/logo192.png" alt="ChainFeed" class="investor-btn-icon">
                                Ronda de Inversores Privada
                            </button>
                            <button class="alcor-alert-btn alcor-alert-btn-secondary" onclick="window.ALCOR_ALERT.closeAlert()">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Verifica si ya se mostró en esta sesión
     */
    hasBeenShown() {
        return this.hasShownThisPageLoad;
    },
    
    /**
     * Inicializa el sistema
     */
    init() {
        console.log('🔔 Inicializando Alcor Alert dinámico...');
        
        // Si ambos están vivos, no mostrar modal
        if (this.isAlcorLive() && this.isCoingeckoLive()) {
            console.log('✅ Ambos exchanges están vivos - no mostrar alerta');
            return;
        }
        
        // Si ya se mostró en esta sesión
        if (this.hasBeenShown()) {
            console.log('📌 Alerta ya mostrada en esta sesión');
            return;
        }
        
        this.injectStyles();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.showAlert());
        } else {
            setTimeout(() => this.showAlert(), 500);
        }
        
        // 🔥 Escuchar cambios de estado
        window.addEventListener('listing:alcor:live', () => this.onListingChange());
        window.addEventListener('listing:coingecko:live', () => this.onListingChange());
    },
    
    /**
     * Callback cuando cambia estado de listing
     */
    onListingChange() {
        console.log('🔄 Estado de listing cambió - actualizando modal...');
        if (this.isActive) {
            this.updateModalContent();
        }
    },
    
    /**
     * Actualiza el contenido del modal sin recrearlo
     */
    updateModalContent() {
        const overlay = document.getElementById('alcor-alert-overlay');
        if (!overlay) return;
        
        // Recrear el modal con nuevo contenido
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.getModalHTML();
        const newModal = tempDiv.firstElementChild;
        
        overlay.parentNode.replaceChild(newModal, overlay);
        
        // Reiniciar countdown si es necesario
        if (!this.isAlcorLive() || !this.isCoingeckoLive()) {
            this.startCountdown();
        }
    },
    
    /**
     * Muestra el modal
     */
    showAlert() {
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = this.getModalHTML();
        document.body.appendChild(alertDiv);
        
        this.isActive = true;
        this.hasShownThisPageLoad = true;
        document.body.style.overflow = 'hidden';
        
        // Iniciar countdown
        if (!this.isAlcorLive() || !this.isCoingeckoLive()) {
            this.startCountdown();
        }
        
        const overlay = document.getElementById('alcor-alert-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target.id === 'alcor-alert-overlay') {
                    this.closeAlert();
                }
            });
        }
        
        console.log('✅ Modal dinámico mostrado');
    },
    
    /**
     * Inicia countdown para AMBOS exchanges
     */
    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        const self = this;
        
        setTimeout(() => {
            const updateCountdown = () => {
                if (!self.isActive) {
                    if (self.countdownInterval) {
                        clearInterval(self.countdownInterval);
                    }
                    return;
                }
                
                // Actualizar Alcor
                if (!self.isAlcorLive()) {
                    const alcorDays = document.getElementById('alcor-days');
                    const alcorHours = document.getElementById('alcor-hours');
                    const alcorMinutes = document.getElementById('alcor-minutes');
                    
                    if (alcorDays && alcorHours && alcorMinutes) {
                        const distance = self.ALCOR_LISTING_DATE - Date.now();
                        const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
                        const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                        const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
                        
                        alcorDays.textContent = String(days).padStart(2, '0');
                        alcorHours.textContent = String(hours).padStart(2, '0');
                        alcorMinutes.textContent = String(minutes).padStart(2, '0');
                    }
                }
                
                // Actualizar CoinGecko (COUNTDOWN PRINCIPAL)
                if (!self.isCoingeckoLive()) {
                    const coingeckoDays = document.getElementById('coingecko-days');
                    const coingeckoHours = document.getElementById('coingecko-hours');
                    const coingeckoMinutes = document.getElementById('coingecko-minutes');
                    
                    if (coingeckoDays && coingeckoHours && coingeckoMinutes) {
                        const distance = self.COINGECKO_LISTING_DATE - Date.now();
                        const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
                        const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                        const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
                        
                        coingeckoDays.textContent = String(days).padStart(2, '0');
                        coingeckoHours.textContent = String(hours).padStart(2, '0');
                        coingeckoMinutes.textContent = String(minutes).padStart(2, '0');
                    }
                }
                
                // 🟢 ACTUALIZAR PÁRRAFO DE COINGECKO NEXT EVENT (cuando Alcor está vivo)
                const timerElement = document.getElementById('coingecko-next-event-timer');
                if (timerElement && !self.isCoingeckoLive()) {
                    timerElement.textContent = self.getCoingeckoCountdown();
                }
            };

            updateCountdown();
            if (self.isActive) {
                self.countdownInterval = setInterval(updateCountdown, 1000);
            }
            
        }, 100);
    },
    
    /**
     * Redirige a inversores
     */
    redirectToInvestors() {
        console.log('🚀 Redirigiendo a inversores...');
        this.closeAlert();
        setTimeout(() => {
            const ctaSection = document.getElementById('cta');
            if (ctaSection) {
                ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.location.href = '/#cta';
            }
        }, 300);
    },
    
    /**
     * Cierra el modal
     */
    closeAlert() {
        console.log('🔄 Cerrando modal...');
        
        this.isActive = false;
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        const overlay = document.getElementById('alcor-alert-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.remove();
                }
                document.body.style.overflow = 'auto';
            }, 200);
        }
    },
    
    /**
     * Inyecta estilos CSS
     */
    injectStyles() {
        if (document.getElementById('alcor-alert-dynamic-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'alcor-alert-dynamic-styles';
        style.textContent = `
            /* ========== OVERLAY ========== */
            .alcor-alert-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: alcorOverlayIn 0.3s ease;
            }
            
            @keyframes alcorOverlayIn {
                from {
                    opacity: 0;
                    backdrop-filter: blur(0px);
                }
                to {
                    opacity: 1;
                    backdrop-filter: blur(12px);
                }
            }
            
            /* ========== MODAL ========== */
            .alcor-alert-modal {
                background: linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(30, 20, 40, 0.95) 100%);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                width: 100%;
                position: relative;
                box-shadow: 0 25px 50px rgba(99, 102, 241, 0.2);
                animation: alcorModalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            @keyframes alcorModalIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .alcor-alert-close {
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
                transition: color 0.2s;
                line-height: 1;
            }
            
            .alcor-alert-close:hover {
                color: #fff;
            }
            
            /* ========== HEADER ========== */
            .alcor-alert-header {
                text-align: center;
                margin-bottom: 24px;
            }
            
            .alcor-alert-header-both {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }
            
            .alcor-alert-logo,
            .alcor-alert-logo-small {
                object-fit: contain;
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
                animation: alcorLogoPulse 2s ease-in-out infinite;
            }
            
            .alcor-alert-logo {
                width: 80px;
                height: 80px;
            }
            
            .alcor-alert-logo-small {
                width: 64px;
                height: 64px;
            }
            
            .alcor-alert-both-separator {
                color: rgba(255, 255, 255, 0.3);
                font-size: 24px;
                font-weight: 300;
            }
            
            @keyframes alcorLogoPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            /* ========== BODY ========== */
            .alcor-alert-body {
                margin-bottom: 24px;
            }
            
            .alcor-alert-title {
                font-size: 24px;
                font-weight: 700;
                color: #fff;
                text-align: center;
                margin-bottom: 8px;
                letter-spacing: -0.02em;
            }
            
            .alcor-alert-subtitle {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);
                text-align: center;
                margin-bottom: 20px;
            }
            
            .alcor-alert-message {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.6);
                text-align: center;
                line-height: 1.6;
                margin-bottom: 12px;
            }
            
            .alcor-alert-next-event {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
                text-align: center;
                padding: 8px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
            }
            
            /* ========== COUNTDOWN SECTION ========== */
            .alcor-alert-countdown-section {
                display: flex;
                gap: 16px;
                margin: 20px 0;
                justify-content: space-around;
            }
            
            .alcor-alert-countdown-item {
                text-align: center;
            }
            
            .alcor-countdown-title,
            .coingecko-countdown-title {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin-bottom: 8px;
                color: #a78bfa;
            }
            
            .alcor-countdown-title {
                color: #6366f1;
            }
            
            .coingecko-countdown-title {
                color: #f59e0b;
            }
            
            .alcor-alert-countdown,
            .coingecko-alert-countdown {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 4px;
                padding: 12px;
                background: rgba(99, 102, 241, 0.08);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 10px;
                margin-bottom: 8px;
            }
            
            .coingecko-alert-countdown {
                background: rgba(245, 158, 11, 0.08);
                border-color: rgba(245, 158, 11, 0.2);
            }
            
            .countdown-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
            }
            
            .countdown-number {
                font-size: 16px;
                font-weight: 700;
                color: #6366f1;
                font-family: 'Courier New', monospace;
                letter-spacing: 1px;
            }
            
            .coingecko-alert-countdown .countdown-number {
                color: #f59e0b;
            }
            
            .countdown-label {
                font-size: 9px;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            
            .countdown-separator {
                color: rgba(99, 102, 241, 0.3);
                font-size: 12px;
                font-weight: 700;
                margin: 0 2px;
            }
            
            .alcor-countdown-date,
            .coingecko-countdown-date {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.4);
            }
            
            /* ========== ACTIONS ========== */
            .alcor-alert-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .alcor-alert-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 44px;
                border: none;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                gap: 8px;
            }
            
            .alcor-alert-btn-primary {
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: #fff;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            }
            
            .alcor-alert-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(99, 102, 241, 0.6);
            }
            
            .alcor-alert-btn-investor {
                background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%);
                color: #c4b5fd;
                border: 1px solid rgba(167, 139, 250, 0.4);
            }
            
            .alcor-alert-btn-investor:hover {
                background: linear-gradient(135deg, rgba(167, 139, 250, 0.35) 0%, rgba(139, 92, 246, 0.25) 100%);
                border-color: rgba(167, 139, 250, 0.6);
                color: #e9d5ff;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3);
            }
            
            .investor-btn-icon {
                width: 16px;
                height: 16px;
                object-fit: contain;
            }
            
            .alcor-alert-btn-secondary {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .alcor-alert-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.2);
                color: #fff;
            }
            
            /* ========== RESPONSIVE ========== */
            @media (max-width: 600px) {
                .alcor-alert-modal {
                    padding: 28px 20px;
                    border-radius: 16px;
                }
                
                .alcor-alert-title {
                    font-size: 20px;
                }
                
                .alcor-alert-logo,
                .alcor-alert-logo-small {
                    width: 56px;
                    height: 56px;
                }
                
                .alcor-alert-countdown-section {
                    gap: 12px;
                }
                
                .countdown-number {
                    font-size: 14px;
                }
                
                .alcor-alert-btn {
                    height: 40px;
                    font-size: 13px;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ Estilos dinámicos inyectados');
    }
});

// ========== INICIALIZACIÓN ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (ALCOR_ALERT && typeof ALCOR_ALERT.init === 'function') {
            ALCOR_ALERT.init();
        }
    });
} else {
    if (ALCOR_ALERT && typeof ALCOR_ALERT.init === 'function') {
        setTimeout(() => ALCOR_ALERT.init(), 500);
    }
}

console.log('✨ Sistema Alcor Alert DINÁMICO cargado');