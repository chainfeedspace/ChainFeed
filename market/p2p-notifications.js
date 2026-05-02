/**
 * Sistema de notificaciones moderno para P2P Marketplace
 * Intercepta alert/confirm nativos del navegador
 */

// ============================================
// INTERCEPTOR DE ALERT/CONFIRM NATIVOS
// ============================================
(function() {
    // Guardar referencias originales
    window._originalAlert = window.alert;
    window._originalConfirm = window.confirm;
    
    // Reemplazar alert por notificaciones modernas
    window.alert = function(msg) {
        console.warn('⚠️ alert() detectado, redirigiendo a notificación moderna:', msg);
        
        if (window.p2pNotify) {
            window.p2pNotify.error(String(msg));
        } else {
            // Fallback temporal
            setTimeout(() => {
                if (window.p2pNotify) {
                    window.p2pNotify.error(String(msg));
                } else {
                    window._originalAlert(msg);
                }
            }, 100);
        }
    };
    
    // Reemplazar confirm por diálogos modernos
    window.confirm = function(msg) {
        console.warn('⚠️ confirm() detectado, usando diálogo moderno:', msg);
        
        // No podemos hacer async aquí, así que mostramos notificación
        if (window.p2pNotify) {
            window.p2pNotify.warning(String(msg));
        }
        
        // Por defecto retornamos false para evitar acciones no deseadas
        return false;
    };
    
    console.log('✅ Interceptores de alert/confirm activados');
})();


/**
 * Sistema de notificaciones moderno para P2P Marketplace
 */

class P2PNotifications {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('p2p-notifications-container')) {
            this.container = document.createElement('div');
            this.container.id = 'p2p-notifications-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 400px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
    }
    
    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = 'p2p-notification';
        notification.id = 'p2p-notify-float'; 
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const colors = {
            success: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#10b981' },
            error: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#ef4444' },
            warning: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#f59e0b' },
            info: { bg: 'rgba(99, 102, 241, 0.15)', border: '#6366f1', text: '#6366f1' }
        };
        
        const color = colors[type] || colors.info;
        const icon = icons[type] || icons.info;
        
        notification.style.cssText = `
            background: rgba(26, 26, 36, 0.98);
            backdrop-filter: blur(20px);
            border: 1px solid ${color.border};
            border-left: 4px solid ${color.border};
            border-radius: 12px;
            padding: 16px 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            transform: translateX(120%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px; flex-shrink: 0;">${icon}</span>
                <div style="flex: 1; line-height: 1.5;">${message}</div>
                <button class="notification-close" style="
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: all 0.2s;
                ">×</button>
            </div>
            <div class="notification-progress" style="
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: ${color.border};
                width: 100%;
                transform-origin: left;
                animation: progress ${duration}ms linear;
            "></div>
        `;
        
        // Agregar animación de progreso
        const style = document.createElement('style');
        style.textContent = `
            @keyframes progress {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
        `;
        if (!document.getElementById('p2p-notification-styles')) {
            style.id = 'p2p-notification-styles';
            document.head.appendChild(style);
        }
        
        this.container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hover para pausar el cierre automático
        let autoCloseTimeout;
        
        const startAutoClose = () => {
            autoCloseTimeout = setTimeout(() => {
                this.remove(notification);
            }, duration);
        };
        
        const stopAutoClose = () => {
            clearTimeout(autoCloseTimeout);
            const progress = notification.querySelector('.notification-progress');
            if (progress) {
                progress.style.animationPlayState = 'paused';
            }
        };
        
        const resumeAutoClose = () => {
            const progress = notification.querySelector('.notification-progress');
            if (progress) {
                progress.style.animationPlayState = 'running';
            }
            startAutoClose();
        };
        
        notification.addEventListener('mouseenter', stopAutoClose);
        notification.addEventListener('mouseleave', resumeAutoClose);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(autoCloseTimeout);
            this.remove(notification);
        });
        
        // Hover effect en botón cerrar
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            closeBtn.style.color = 'white';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = 'rgba(255, 255, 255, 0.5)';
        });
        
        startAutoClose();
    }
    
    remove(notification) {
        notification.style.transform = 'translateX(120%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }
    
    success(message, duration) {
        this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Instancia global
window.p2pNotify = new P2PNotifications();

// Función de compatibilidad
window.showNotification = function(message, type = 'info') {
    window.p2pNotify.show(message, type);
};

/**
 * Sistema de diálogos de confirmación modernos
 */
class P2PConfirm {
    async show(options = {}) {
        const {
            title = '¿Estás seguro?',
            message = '',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            type = 'warning' // warning, danger, info
        } = options;
        
        return new Promise((resolve) => {
            // Crear overlay
            const overlay = document.createElement('div');
            overlay.className = 'p2p-confirm-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            // Crear modal
            const modal = document.createElement('div');
            modal.className = 'p2p-confirm-modal';
            
            const colors = {
                warning: { icon: '⚠️', color: '#f59e0b' },
                danger: { icon: '🗑️', color: '#ef4444' },
                info: { icon: 'ℹ️', color: '#6366f1' }
            };
            
            const typeConfig = colors[type] || colors.warning;
            
            modal.style.cssText = `
                background: #1a1a24;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2rem;
                max-width: 450px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            
            modal.innerHTML = `
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${typeConfig.icon}</div>
                    <h3 class="titulocancel" style="font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.75rem;">
                        ${title}
                    </h3>
                    ${message ? `
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.95rem; line-height: 1.5;">
                            ${message}
                        </p>
                    ` : ''}
                </div>
                
                <div style="display: flex; gap: 1rem;">
                    <button class="p2p-confirm-cancel" style="
                        flex: 1;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: white;
                        padding: 0.875rem;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-size: 0.95rem;
                    ">${cancelText}</button>
                    
                    <button class="p2p-confirm-ok" style="
                        flex: 1;
                        background: ${typeConfig.color};
                        border: none;
                        color: white;
                        padding: 0.875rem;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-size: 0.95rem;
                    ">${confirmText}</button>
                </div>
            `;
            
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            
            // Animar entrada
            setTimeout(() => {
                overlay.style.opacity = '1';
                modal.style.transform = 'scale(1)';
            }, 10);
            
            // Función para cerrar
            const close = (result) => {
                overlay.style.opacity = '0';
                modal.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    resolve(result);
                }, 300);
            };
            
            // Event listeners
            const cancelBtn = modal.querySelector('.p2p-confirm-cancel');
            const okBtn = modal.querySelector('.p2p-confirm-ok');
            
            cancelBtn.addEventListener('click', () => close(false));
            okBtn.addEventListener('click', () => close(true));
            
            // Cerrar al hacer clic fuera
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    close(false);
                }
            });
            
            // Hover effects
            cancelBtn.addEventListener('mouseenter', () => {
                cancelBtn.style.background = 'rgba(255, 255, 255, 0.15)';
                cancelBtn.style.transform = 'translateY(-2px)';
            });
            
            cancelBtn.addEventListener('mouseleave', () => {
                cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                cancelBtn.style.transform = 'translateY(0)';
            });
            
            okBtn.addEventListener('mouseenter', () => {
                okBtn.style.transform = 'translateY(-2px)';
                okBtn.style.boxShadow = `0 8px 20px ${typeConfig.color}40`;
            });
            
            okBtn.addEventListener('mouseleave', () => {
                okBtn.style.transform = 'translateY(0)';
                okBtn.style.boxShadow = 'none';
            });
        });
    }
}

window.p2pConfirm = new P2PConfirm();

console.log('✅ Sistema de notificaciones P2P cargado');