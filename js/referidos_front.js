/**
 * Sistema de Referidos - Frontend Integrado
 * Versión: 3.2.1 - Fix traducción en Web Share API
 */

const ReferidosUI = {
    initialized: false,
    userData: null,
    cardsInjected: false,

    /**
     * 🔥 FUNCIÓN MEJORADA: Usa el sistema de traducción global
     */
    t(text) {
        const lang = window.getLanguage?.() || 'es';
        
        // Si está en español, devolver texto original
        if (lang === 'es') return text;
        
        // Usar el sistema de traducción global si existe
        if (typeof window.translationSystem?.translate === 'function') {
            return window.translationSystem.translate(text, lang);
        }
        
        // Fallback: devolver texto original
        return text;
    },

    init() {
        if (this.initialized) {
            console.log('⚠️ Sistema de referidos ya inicializado');
            return;
        }

        console.log('🎁 Inicializando sistema de referidos...');
        this.initialized = true;
        console.log('✅ Sistema de referidos inicializado (esperando sesión)');
    },

    injectCards(statsGrid) {
        if (!statsGrid) {
            console.error('❌ No se encontró .preventa-stats-grid');
            return;
        }

        if (this.cardsInjected) {
            console.log('⚠️ Cards ya inyectadas');
            return;
        }

        const referralCodeCard = `
            <div class="stat-card referral-code-card" id="referral-code-card">
                <div class="stat-icon">🎁</div>
                <div class="stat-content" style="width: 100%;">
                    <div class="stat-label">Tu código de referido</div>
                    <div class="referral-code-display">
                        <div class="stat-value" id="user-referral-code" style="font-family: 'Courier New', monospace; letter-spacing: 2px;">
                            <span class="loading-shimmer">━━━━━</span>
                        </div>
                        <button class="share-code-btn" id="share-referral-btn" title="Compartir código" disabled>
                            📤
                        </button>
                    </div>
                    <div class="referral-stats-inline">
                        <span>👥 <strong id="referral-count">0</strong> referidos</span>
                        <span>💰 <strong id="referral-bonus">0</strong> CFT</span>
                    </div>
                </div>
            </div>
        `;

        const referralInputCard = `
            <div class="stat-card referral-input-card" id="referral-input-card">
                <div class="stat-icon">⚡</div>
                <div class="stat-content" style="width: 100%;">
                    <div class="stat-label">¿Tienes un código?</div>
                    <div class="referral-input-group">
                        <input 
                            type="text" 
                            id="referral-code-input" 
                            class="referral-code-input"
                            placeholder="CÓDIGO"
                            maxlength="20"
                        />
                        <button class="apply-code-btn" id="apply-referral-btn" title="Aplicar código">
                            ✓
                        </button>
                    </div>
                    <div class="referral-benefit">
                        Ambos reciben <strong>15 CFT</strong>
                    </div>
                </div>
            </div>
        `;

        statsGrid.insertAdjacentHTML('beforeend', referralCodeCard);
        statsGrid.insertAdjacentHTML('beforeend', referralInputCard);

        this.cardsInjected = true;
        this.attachEvents();
        
        console.log('✅ Cards de referidos inyectadas');
    },

    attachEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'share-referral-btn' || e.target.closest('#share-referral-btn')) {
                this.shareReferralCode();
            }
            
            if (e.target.id === 'apply-referral-btn' || e.target.closest('#apply-referral-btn')) {
                this.applyReferralCode();
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.id === 'referral-code-input') {
                e.target.value = e.target.value.toUpperCase();
            }
        });

        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'referral-code-input' && e.key === 'Enter') {
                this.applyReferralCode();
            }
        });

        console.log('✅ Eventos adjuntados');
    },

    updateUI(userData) {
        if (!userData) {
            console.log('⚠️ Sin datos de usuario - no mostrar referidos');
            this.removeCards();
            return;
        }

        this.userData = userData;

        const statsGrid = document.querySelector('.preventa-stats-grid');
        if (!statsGrid) {
            console.error('No se encontró .preventa-stats-grid');
            return;
        }

        if (!this.cardsInjected) {
            console.log('📦 Sesión detectada - inyectando cards de referidos...');
            this.injectCards(statsGrid);
        }

        const codeElement = document.getElementById('user-referral-code');
        if (codeElement && userData.referral_code) {
            codeElement.textContent = userData.referral_code;
            codeElement.classList.remove('loading-shimmer');
            
            const shareBtn = document.getElementById('share-referral-btn');
            if (shareBtn) {
                shareBtn.disabled = false;
            }
        }

        const countElement = document.getElementById('referral-count');
        const bonusElement = document.getElementById('referral-bonus');
        
        if (countElement) {
            countElement.textContent = userData.referral_count || 0;
        }
        
        if (bonusElement) {
            bonusElement.textContent = this.formatNumber(userData.referral_bonus || 0);
        }

        const inputCard = document.getElementById('referral-input-card');
        if (inputCard && userData.has_used_referral_code) {
            inputCard.style.display = 'none';
        }

        console.log('✅ UI de referidos actualizada', userData);
    },

    removeCards() {
        const codeCard = document.getElementById('referral-code-card');
        const inputCard = document.getElementById('referral-input-card');
        
        if (codeCard) {
            codeCard.remove();
            console.log('🗑️ Card de código eliminada');
        }
        
        if (inputCard) {
            inputCard.remove();
            console.log('🗑️ Card de input eliminada');
        }
        
        this.cardsInjected = false;
    },

    /**
     * 🔥 FUNCIÓN CORREGIDA: Traduce el contenido antes de compartir
     */
    async shareReferralCode() {
        const codeElement = document.getElementById('user-referral-code');
        const btn = document.getElementById('share-referral-btn');
        
        if (!codeElement || !btn) return;

        const code = codeElement.textContent.trim();
        
        // Validar código
        if (code === '━━━━━' || !code || code.includes('Cargando')) {
            this.showNotification(this.t('Código aún no disponible'), 'warning');
            return;
        }

        // 🔥 TRADUCIR TEXTOS DINÁMICAMENTE
        const title = this.t('ChainFeed - Código de Referido');
        const message1 = this.t('¡Únete a ChainFeed con mi código de referido y obtén 15 CFT gratis!');
        const message2 = this.t('Código:');
        const message3 = this.t('¡Ambos recibiremos tokens al registrarte!');

        // PASO 1: Copiar SIEMPRE al portapapeles primero
        try {
            await navigator.clipboard.writeText(code);
            console.log('✅ Código copiado al portapapeles:', code);
        } catch (error) {
            console.error('❌ Error copiando al portapapeles:', error);
        }

        // PASO 2: Intentar abrir diálogo nativo de compartir
        if (navigator.share) {
            const shareData = {
                title: title,
                text: `🚀 ${message1}\n\n${message2} ${code}\n\n${message3}`,
                url: 'https://chainfeed.space'
            };

            try {
                await navigator.share(shareData);
                
                // Feedback visual de éxito
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅';
                btn.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.transform = '';
                }, 2000);

                this.showNotification(this.t('Código compartido exitosamente'), 'success');
                console.log('✅ Compartido exitosamente vía Web Share API');
                
            } catch (error) {
                // Usuario canceló el diálogo o error al compartir
                if (error.name === 'AbortError') {
                    console.log('ℹ️ Usuario canceló compartir');
                    this.showNotification(this.t('Código copiado al portapapeles'), 'info');
                } else {
                    console.error('❌ Error al compartir:', error);
                    this.showNotification(this.t('Código copiado al portapapeles'), 'success');
                }
                
                // Feedback visual (ya se copió antes)
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅';
                setTimeout(() => btn.innerHTML = originalText, 2000);
            }
        } else {
            // Navegador no soporta Web Share API
            console.log('ℹ️ Web Share API no soportada, solo copia al portapapeles');
            this.showNotification(this.t('Código copiado al portapapeles'), 'success');
            
            // Feedback visual
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅';
            setTimeout(() => btn.innerHTML = originalText, 2000);
        }
    },

    /**
     * Aplica un código de referido
     */
    async applyReferralCode() {
        const input = document.getElementById('referral-code-input');
        const btn = document.getElementById('apply-referral-btn');
        
        if (!input || !btn) return;

        const code = input.value.trim().toUpperCase();

        if (!code) {
            this.showNotification(this.t('Por favor ingresa un código'), 'warning');
            input.focus();
            return;
        }

        if (code.length < 5) {
            this.showNotification(this.t('El código debe tener al menos 5 caracteres'), 'warning');
            input.focus();
            return;
        }

        // Verificar que no sea su propio código
        if (this.userData && this.userData.referral_code === code) {
            this.showNotification(this.t('No puedes usar tu propio código'), 'error');
            input.value = '';
            return;
        }

        // Deshabilitar botón
        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳';

        try {
            const response = await fetch('https://chainfeed.space/php/aplicar_codigo_referido.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ codigo: code })
            });

            const data = await response.json();

            if (data.success) {
                // Éxito
                const successMsg = this.t('¡Código aplicado exitosamente!') + 
                    `\n\n${this.t('Tú y')} @${data.referidor_username} ${this.t('recibieron')} ${data.tokens_otorgados} CFT ${this.t('cada uno')}.`;
                
                this.showNotification('🎉 ' + successMsg, 'success');

                // Ocultar card permanentemente
                const inputCard = document.getElementById('referral-input-card');
                if (inputCard) {
                    inputCard.style.display = 'none';
                }

                // Recargar stats de preventa
                if (typeof window.refreshPreventaStats === 'function') {
                    await window.refreshPreventaStats();
                }

                // Limpiar input
                input.value = '';

            } else {
                // Error
                this.showNotification('❌ ' + (data.error || this.t('Código inválido')), 'error');
                btn.disabled = false;
                btn.innerHTML = originalText;
            }

        } catch (error) {
            console.error('Error aplicando código:', error);
            this.showNotification(this.t('Error de conexión. Intenta de nuevo.'), 'error');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    },

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'info') {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#6366f1'
        };

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 16px 20px;
            background: rgba(26, 26, 36, 0.95);
            border: 1px solid ${colors[type]};
            border-left: 4px solid ${colors[type]};
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            color: white;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            white-space: pre-line;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <span style="font-size: 20px; flex-shrink: 0;">${icons[type]}</span>
                <span style="line-height: 1.5;">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.style.transform = 'translateX(0)', 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    },

    /**
     * Formatea números con comas
     */
    formatNumber(num) {
        return parseFloat(num).toLocaleString('en-US', { 
            minimumFractionDigits: 0,
            maximumFractionDigits: 2 
        });
    }
};

/**
 * Integración con el sistema de preventa existente
 */
window.addEventListener('preventaStatsLoaded', (event) => {
    console.log('📊 Stats de preventa cargados, actualizando referidos...');
    
    if (event.detail && event.detail.usuario) {
        ReferidosUI.updateUI(event.detail.usuario);
    } else {
        ReferidosUI.updateUI(null);
    }
});

// Inicializar inmediatamente
ReferidosUI.init();

console.log('✨ Sistema de referidos frontend cargado');