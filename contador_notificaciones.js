// ============================================
// SISTEMA DE CONTADOR DE NOTIFICACIONES SIN LEER
// ============================================
class NotificationCounter {
    constructor() {
        this.badge = null;
        this.pollingInterval = null;
        this.pollingTime = 15000; // 15 segundos
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.badge = document.getElementById('notificationsBadge');
        
        if (!this.badge) {
            console.warn('Badge de notificaciones no encontrado');
            return;
        }

        // Cargar contador inicial
        this.updateCounter();
        
        // Iniciar polling automático
        this.startPolling();
        
        console.log('✅ Sistema de contador de notificaciones iniciado');
    }

    async updateCounter() {
        try {
            const response = await fetch('/php/contador_notificaciones.php', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                this.updateBadge(data.notificaciones_sin_leer);
            } else {
                console.error('Error en respuesta:', data.message);
            }
            
        } catch (error) {
            console.error('Error actualizando contador de notificaciones:', error);
        }
    }

   updateBadge(count) {
    if (!this.badge) return;

    const notificacionesSinLeer = parseInt(count) || 0;
    
    if (notificacionesSinLeer > 0) {
        this.badge.textContent = notificacionesSinLeer > 99 ? '99+' : notificacionesSinLeer;
        this.badge.style.display = 'flex'; // ← MOSTRAR
        this.badge.classList.remove('empty');
        
        // Animación de actualización
        this.badge.style.animation = 'none';
        setTimeout(() => {
            this.badge.style.animation = 'pulse 2s infinite';
        }, 10);
    } else {
        this.badge.style.display = 'none'; // ← OCULTAR cuando es 0
        this.badge.classList.add('empty');
    }
}

    startPolling() {
        // Limpiar intervalo anterior si existe
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }

        // Actualizar cada X segundos
        this.pollingInterval = setInterval(() => {
            this.updateCounter();
        }, this.pollingTime);
        
        console.log(`🔄 Polling de notificaciones iniciado (cada ${this.pollingTime/1000}s)`);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            console.log('⏸️ Polling de notificaciones detenido');
        }
    }

    // Método para actualizar manualmente (útil después de acciones)
    forceUpdate() {
        this.updateCounter();
    }

    // Resetear contador cuando el usuario ve las notificaciones
    resetCounter() {
        this.updateBadge(0);
    }
}

// Instanciar el contador automáticamente
const notificationCounter = new NotificationCounter();

// Exponer globalmente para uso en otros scripts
window.notificationCounter = notificationCounter;

// Actualizar al cambiar de pestaña (cuando el usuario vuelve)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        notificationCounter.forceUpdate();
    }
});

// Resetear al visitar página de notificaciones
if (window.location.pathname.includes('notificaciones')) {
    // Esperar 2 segundos después de cargar notificaciones
    setTimeout(() => {
        notificationCounter.forceUpdate();
    }, 2000);
}