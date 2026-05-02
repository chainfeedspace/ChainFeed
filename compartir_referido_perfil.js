/**
 * compartir_referido_perfil.js
 * Sistema para compartir código de referido desde el perfil
 * Versión: 2.1.0 - CORREGIDO
 * 🔥 Obtiene datos del usuario automáticamente
 */

const ShareProfileSystem = {
    initialized: false,
    currentUserData: null,
    fetchAttempted: false,

     t(key, fallback = key) {
        if (typeof window.translationSystem?.translate === 'function') {
            const translated = window.translationSystem.translate(key, window.getLanguage());
            return translated !== key ? translated : fallback;
        }
        return fallback;
    },

    /**
     * Inicializa el sistema
     */
    init() {
        if (this.initialized) {
            console.log('⚠️ Sistema de compartir código ya inicializado');
            return;
        }

        console.log('🔗 Inicializando sistema de compartir código de referido...');
        this.initialized = true;

        // Escuchar cambios en los datos del usuario actual
        this.setupListeners();
        
        // 🔥 Obtener datos del usuario inmediatamente
        this.fetchUserData();
        
        console.log('✅ Sistema de compartir código inicializado');
    },

    /**
     * Configura listeners para detectar cambios
     */
    setupListeners() {
        // Listener para cuando se carguen datos del usuario actual
        window.addEventListener('preventaStatsLoaded', (event) => {
            if (event.detail && event.detail.usuario) {
                this.currentUserData = event.detail.usuario;
                console.log('👤 Datos del usuario desde evento:', this.currentUserData);
                this.updateButtonVisibility();
            }
        });

        // 🔥 También escuchar cuando la página termine de cargar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.fetchUserData(), 500);
            });
        } else {
            setTimeout(() => this.fetchUserData(), 500);
        }
    },

    /**
     * 🔥 CORREGIDO: Obtiene datos del usuario desde la sesión
     */
    async fetchUserData() {
        if (this.fetchAttempted) {
            console.log('⏭️ Ya se intentó obtener datos del usuario');
            return;
        }

        this.fetchAttempted = true;

        try {
            console.log('🔄 Obteniendo datos del usuario...');

            const response = await fetch('https://chainfeed.space/php/verificar_sesion.php', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.log('⚠️ No hay sesión activa o error HTTP:', response.status);
                this.hideButton();
                return;
            }

            const data = await response.json();
            console.log('📦 Respuesta del servidor:', data);

            // 🔥 CORRECCIÓN: PRIMERO asignar currentUserData, DESPUÉS obtener código
            if (data.success && data.user) {
                // ✅ PASO 1: Asignar datos del usuario
                this.currentUserData = data.user;
                console.log('✅ Datos del usuario asignados:', this.currentUserData);
                
                // ✅ PASO 2: Obtener código de referido
                await this.obtenerCodigoReferido(data.user.id);
                
            } else {
                console.log('⚠️ Sin datos de usuario válidos');
                this.hideButton();
            }

        } catch (error) {
            console.error('❌ Error obteniendo datos del usuario:', error);
            this.hideButton();
        }
    },

    /**
     * 🔥 CORREGIDO: Obtiene el código de referido del usuario
     */
    async obtenerCodigoReferido(userId) {
        try {
            console.log('🎁 Obteniendo código de referido para usuario:', userId);
            
            const response = await fetch('https://chainfeed.space/php/obtener_codigo_referido.php', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.log('⚠️ No se pudo obtener código de referido, status:', response.status);
                this.hideButton();
                return;
            }

            const data = await response.json();
            console.log('📦 Respuesta código referido:', data);

            if (data.success && data.referral_code) {
                // ✅ CORRECCIÓN: Ahora currentUserData ya existe
                if (!this.currentUserData) {
                    console.error('❌ currentUserData es null, no se puede asignar código');
                    this.hideButton();
                    return;
                }

                // Agregar código de referido y stats a los datos del usuario
                this.currentUserData.referral_code = data.referral_code;
                this.currentUserData.referral_count = data.referral_count || 0;
                this.currentUserData.referral_bonus = data.referral_bonus || 0;
                this.currentUserData.has_used_referral_code = data.has_used_referral_code || false;
                
                console.log('✅ Código de referido agregado:', data.referral_code);
                console.log('📊 Stats de referidos:', {
                    code: data.referral_code,
                    count: this.currentUserData.referral_count,
                    bonus: this.currentUserData.referral_bonus
                });
                
                // ✅ Actualizar visibilidad del botón
                this.updateButtonVisibility();
            } else {
                console.log('⚠️ No hay código de referido disponible en la respuesta');
                this.hideButton();
            }

        } catch (error) {
            console.error('❌ Error obteniendo código de referido:', error);
            this.hideButton();
        }
    },

    /**
     * Actualiza visibilidad del botón de compartir
     * Solo visible si hay sesión activa Y código de referido
     */
    updateButtonVisibility() {
        const shareContainer = document.getElementById('shareProfileContainer');
        
        if (!shareContainer) {
            console.warn('⚠️ No se encontró #shareProfileContainer en el DOM');
            return;
        }

        console.log('🔍 Verificando visibilidad del botón:', {
            tieneUsuario: !!this.currentUserData,
            tieneCodigo: !!this.currentUserData?.referral_code,
            codigo: this.currentUserData?.referral_code
        });

        if (this.currentUserData && this.currentUserData.referral_code) {
            // Hay código - mostrar botón
            shareContainer.style.display = 'inline-block';
            shareContainer.style.opacity = '1';
            shareContainer.style.pointerEvents = 'auto';
            
            console.log('✅ Botón de compartir código VISIBLE');
            console.log('📋 Código a compartir:', this.currentUserData.referral_code);
        } else {
            // No hay código - ocultar botón
            this.hideButton();
            console.log('⚠️ Botón de compartir código OCULTO (sin código o sin usuario)');
        }
    },

    /**
     * Oculta el botón
     */
    hideButton() {
        const shareContainer = document.getElementById('shareProfileContainer');
        if (shareContainer) {
            shareContainer.style.display = 'none';
            shareContainer.style.opacity = '0';
            shareContainer.style.pointerEvents = 'none';
            console.log('🙈 Botón ocultado explícitamente');
        }
    },
/**
 * 🔥 Función principal para compartir el código de referido
 * CORREGIDO: Copia mensaje formateado con código + URL
 */
async shareProfile() {
    console.log('🎁 Compartir código de referido iniciado');
    console.log('📊 Datos actuales:', this.currentUserData);

    // Si no hay datos, intentar obtenerlos una vez más
    if (!this.currentUserData) {
        console.log('🔄 Reintentando obtener datos del usuario...');
        this.fetchAttempted = false;
        await this.fetchUserData();
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!this.currentUserData || !this.currentUserData.referral_code) {
        this.showNotification(this.t('⚠️ Inicia sesión para compartir tu código de referido'), 'warning');
        console.error('❌ Sin código de referido disponible');
        return;
    }

    const code = this.currentUserData.referral_code;

    if (!code || code === '━━━━━' || code.includes('Cargando') || code.length < 5) {
        this.showNotification(this.t('⚠️ Código aún no disponible'), 'warning');
        console.error('❌ Código inválido:', code);
        return;
    }

    console.log('✅ Compartiendo código válido:', code);

    // 🔥 MENSAJE COMPLETO CON CÓDIGO Y URL
    const mensajeCompleto = 
        `🚀 ¡Únete a ChainFeed con mi código de referido!\n\n` +
        `📋 Código: ${code}\n\n` +
        `🎁 Beneficios:\n` +
        `• 15 CFT gratis al registrarte\n` +
        `• Acceso a la red social Web3\n` +
        `• ¡Ambos ganamos tokens!\n\n` +
        `🔗 Regístrate aquí: https://chainfeed.space`;

    // 🔥 COPIAR AL PORTAPAPELES PRIMERO
    try {
        await navigator.clipboard.writeText(mensajeCompleto);
        
        // ✅ Feedback exitoso
        this.showSuccessFeedback();
        this.showNotification(
            this.t('Mensaje copiado al portapapeles') + '\n\n' + 
            this.t('📱 Pégalo en WhatsApp, Telegram o donde quieras compartirlo'),
            'success'
        );
        
        console.log('✅ Mensaje completo copiado:', mensajeCompleto);
        
        // 🔥 OPCIONAL: Intentar abrir Web Share API DESPUÉS (si está disponible)
        if (navigator.share) {
            setTimeout(async () => {
                try {
                    await navigator.share({
                        title: 'ChainFeed - Código de Referido',
                        text: mensajeCompleto
                    });
                    console.log('✅ También compartido vía Web Share API');
                } catch (shareError) {
                    // No hacer nada si falla o cancela, ya copiamos al portapapeles
                    console.log('ℹ️ Web Share cancelado o falló (no hay problema, ya copiamos)');
                }
            }, 500);
        }
        
    } catch (error) {
        console.error('❌ Error al copiar:', error);
        
        // 🔥 FALLBACK MANUAL: Mostrar el mensaje para copiar manualmente
        this.showManualCopyDialog(mensajeCompleto, code);
    }
},

/**
 * 🔥 NUEVA FUNCIÓN: Diálogo para copiar manualmente
 */
showManualCopyDialog(mensaje, code) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 26, 36, 0.98);
        border: 2px solid #6366f1;
        border-radius: 16px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        z-index: 10002;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
    `;

    dialog.innerHTML = `
        <div style="color: white; font-family: 'Inter', sans-serif;">
            <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #6366f1;">
                📋 Tu Código de Referido
            </h3>
            
            <div style="
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid #6366f1;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-word;
            ">${mensaje}</div>
            
            <div style="display: flex; gap: 12px;">
                <button onclick="navigator.clipboard.writeText(\`${mensaje.replace(/`/g, '\\`')}\`).then(() => { this.textContent = '✅ Copiado'; setTimeout(() => this.closest('div').parentElement.parentElement.remove(), 1500); })" 
                    style="
                        flex: 1;
                        padding: 12px;
                        background: #6366f1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    "
                    onmouseover="this.style.background='#4f46e5'"
                    onmouseout="this.style.background='#6366f1'">
                    📋 Copiar Todo
                </button>
                
                <button onclick="this.closest('div').parentElement.parentElement.remove()" 
                    style="
                        padding: 12px 20px;
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.3s;
                    "
                    onmouseover="this.style.background='rgba(255, 255, 255, 0.15)'"
                    onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'">
                    ✖️
                </button>
            </div>
        </div>
    `;

    // Overlay oscuro
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10001;
    `;
    overlay.onclick = () => {
        overlay.remove();
        dialog.remove();
    };

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
},

    /**
     * Fallback: Copiar código al portapapeles
     */
    async fallbackCopyCode(code) {
        try {
await navigator.clipboard.writeText(code);
this.showNotification(this.t('📋 Código copiado al portapapeles') + ': ' + code, 'success');
this.showSuccessFeedback();
            
            console.log('📋 Código copiado al portapapeles:', code);
            
        } catch (error) {
            console.error('❌ Error al copiar al portapapeles:', error);
            
const mensaje = this.t('Tu código de referido:') + '\n\n' + code + '\n\n' + this.t('Cópialo manualmente para compartir');
this.showNotification(mensaje, 'info');
        }
    },

    /**
     * Feedback visual en el botón
     */
    showSuccessFeedback() {
        const btn = document.getElementById('shareProfileBtn');
        
        if (!btn) {
            console.warn('⚠️ Botón #shareProfileBtn no encontrado para feedback');
            return;
        }

        const originalText = btn.innerHTML;
        const originalTransform = btn.style.transform;
        
        btn.innerHTML = '✅';
        btn.style.transform = 'scale(1.2)';
        btn.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.transform = originalTransform;
        }, 2000);
    },

    /**
     * Muestra notificación
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

        // Animación de entrada
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);

        // Animación de salida y limpieza
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }
};

/**
 * Función global para compartir el código
 * Esta es la que se llama desde el botón onclick="shareProfile()"
 */
function shareProfile() {
    console.log('🎯 shareProfile() llamada desde botón');
    ShareProfileSystem.shareProfile();
}

// 🔥 Inicializar inmediatamente si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM cargado, inicializando ShareProfileSystem...');
        ShareProfileSystem.init();
    });
} else {
    console.log('📄 DOM ya listo, inicializando ShareProfileSystem inmediatamente...');
    ShareProfileSystem.init();
}

// Hacer disponible globalmente
window.ShareProfileSystem = ShareProfileSystem;
window.shareProfile = shareProfile;

console.log('✨ Sistema de compartir código de referido cargado y listo');