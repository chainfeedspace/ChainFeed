// ============================================
// SISTEMA DE CONTADOR DE MENSAJES SIN LEER
// ============================================
class MessageCounter {
    constructor() {
        this.badge = null;
        this.pollingInterval = null;
        this.pollingTime = 10000; // 10 segundos
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // ✅ CRÍTICO: Asegurarse de que sea el badge de MENSAJES
        this.badge = document.getElementById('messagesBadge');
        
        if (!this.badge) {
            console.error('❌ Badge de mensajes (#messagesBadge) no encontrado');
            return;
        }

        console.log('✅ Badge encontrado:', {
            id: this.badge.id,
            clases: this.badge.className
        });

        // Cargar contador inicial
        this.updateCounter();
        
        // Iniciar polling automático
        this.startPolling();
        
        console.log('✅ Sistema de contador de mensajes iniciado');
    }

    async updateCounter() {
        try {
            const response = await fetch('/php/contador_mensajes.php', {
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
                this.updateBadge(data.mensajes_sin_leer);
                
                console.log('📨 Contador actualizado:', {
                    mensajes: data.mensajes_sin_leer,
                    timestamp: data.timestamp
                });
            } else {
                console.error('Error en respuesta:', data.message);
                this.updateBadge(0);
            }
        } catch (error) {
            console.error('❌ Error actualizando contador de mensajes:', error);
            this.updateBadge(0);
        }
    }

    updateBadge(count) {
        if (!this.badge) {
            console.error('❌ Badge no inicializado');
            return;
        }

        const mensajesSinLeer = parseInt(count) || 0;

        console.log('🔔 Actualizando badge de mensajes:', {
            count: mensajesSinLeer,
            badge_id: this.badge.id
        });

        if (mensajesSinLeer > 0) {
            // ✅ MOSTRAR badge
            this.badge.textContent = mensajesSinLeer > 99 ? '99+' : mensajesSinLeer;
            this.badge.style.display = 'flex';
            this.badge.style.opacity = '1';
            this.badge.style.visibility = 'visible';
            this.badge.classList.remove('empty');

            // Animación de actualización
            this.badge.style.animation = 'none';
            setTimeout(() => {
                this.badge.style.animation = 'pulse 2s infinite';
            }, 10);

            console.log('✅ Badge de MENSAJES mostrado:', mensajesSinLeer);
        } else {
            // ✅ OCULTAR badge
            this.badge.style.display = 'none';
            this.badge.style.opacity = '0';
            this.badge.style.visibility = 'hidden';
            this.badge.classList.add('empty');
            this.badge.style.animation = 'none';

            console.log('✅ Badge de MENSAJES oculto');
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

        console.log(`🔄 Polling de mensajes iniciado (cada ${this.pollingTime / 1000}s)`);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            console.log('⏸️ Polling de mensajes detenido');
        }
    }

    // Método para actualizar manualmente (útil después de acciones)
    forceUpdate() {
        console.log('🔄 Forzando actualización de mensajes...');
        this.updateCounter();
    }
}

// ✅ Instanciar automáticamente
let messageCounter = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        messageCounter = new MessageCounter();
        window.messageCounter = messageCounter;
        console.log('✅ messageCounter instanciado después de DOMContentLoaded');
    });
} else {
    messageCounter = new MessageCounter();
    window.messageCounter = messageCounter;
    console.log('✅ messageCounter instanciado inmediatamente');
}

// Actualizar al cambiar de pestaña (cuando el usuario vuelve)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && messageCounter) {
        console.log('👁️ Usuario volvió a la pestaña, actualizando mensajes...');
        messageCounter.forceUpdate();
    }
});

console.log('✅ contador_mensaje.js cargado');