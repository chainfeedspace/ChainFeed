// =====================================================
// SISTEMA DE NOTIFICACIONES UI - CHAINFEED
// =====================================================

// ============================================
// VALIDACIÓN DE SESIÓN (EJECUTAR PRIMERO)
// ============================================

/**
 * Valida la sesión al cargar la página
 * Si no hay sesión válida, redirige a home
 */
function validateSessionOnLoad() {
    fetch('/php/verificar_sesion.php', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Sin sesión válida`);
        }
        return response.json();
    })
    .then(data => {
        if (!data.success) {
            console.error('❌ Sesión no válida:', data.error_code);
            
            localStorage.removeItem('chainfeed_user');
            localStorage.removeItem('chainfeed_session');
            
            window.location.href = '/inicio';
            return;
        }
        
        console.log('✅ Sesión válida para:', data.user.username);
        
        window.currentUserData = data.user;
        window.currentUserId = data.user.id;
    })
    .catch(error => {
        console.error('❌ Error validando sesión:', error);
        window.location.href = '/inicio';
    });
}

// Ejecutar validación apenas el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateSessionOnLoad);
} else {
    validateSessionOnLoad();
}

// ====================================================================
// FIN DE VALIDACIÓN DE SESIÓN
// ====================================================================

const NotificacionesUI = {
    
    // Contenedor de toasts
    contenedorToasts: null,
    
    // Inicializar sistema
    init() {
        if (!this.contenedorToasts) {
            this.contenedorToasts = document.createElement('div');
            this.contenedorToasts.id = 'toasts-container';
            this.contenedorToasts.className = 'toasts-container';
            document.body.appendChild(this.contenedorToasts);
        }
    },
    
    // =====================================================
    // TOASTS - Notificaciones rápidas
    // =====================================================
    toast(mensaje, tipo = 'info', duracion = 4000) {
        this.init();
        
        const iconos = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.innerHTML = `
            <span class="toast-icon">${iconos[tipo] || 'ℹ️'}</span>
            <span class="toast-mensaje">${mensaje}</span>
            <button class="toast-cerrar" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.contenedorToasts.appendChild(toast);
        
        // Animación de entrada
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto-cerrar
        if (duracion > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duracion);
        }
        
        return toast;
    },
    
    // Shortcuts para toasts
    exito(mensaje, duracion = 4000) {
        return this.toast(mensaje, 'success', duracion);
    },
    
    error(mensaje, duracion = 5000) {
        return this.toast(mensaje, 'error', duracion);
    },
    
    advertencia(mensaje, duracion = 4500) {
        return this.toast(mensaje, 'warning', duracion);
    },
    
    info(mensaje, duracion = 4000) {
        return this.toast(mensaje, 'info', duracion);
    },
    
    // =====================================================
    // MODAL DE ALERTA - Reemplazo de alert()
    // =====================================================
    alerta(titulo, mensaje, tipo = 'info') {
        return new Promise((resolve) => {
            const iconos = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            const modal = document.createElement('div');
            modal.className = 'notif-modal-overlay';
            modal.innerHTML = `
                <div class="notif-modal notif-modal-${tipo}">
                    <div class="notif-modal-header">
                        <span class="notif-modal-icon">${iconos[tipo] || 'ℹ️'}</span>
                        <h3 class="notif-modal-titulo">${titulo}</h3>
                    </div>
                    <div class="notif-modal-cuerpo">
                        <p>${mensaje.replace(/\n/g, '<br>')}</p>
                    </div>
                    <div class="notif-modal-acciones">
                        <button class="notif-btn notif-btn-primary">Entendido</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Animación de entrada
            setTimeout(() => modal.classList.add('show'), 10);
            
            // Cerrar modal
            const cerrar = () => {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                setTimeout(() => modal.remove(), 300);
                resolve(true);
            };
            
            modal.querySelector('.notif-btn-primary').onclick = cerrar;
            modal.onclick = (e) => {
                if (e.target === modal) cerrar();
            };
            
            // ESC para cerrar
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    cerrar();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    },
    
    // Shortcuts para alertas
    alertaExito(titulo, mensaje) {
        return this.alerta(titulo, mensaje, 'success');
    },
    
    alertaError(titulo, mensaje) {
        return this.alerta(titulo, mensaje, 'error');
    },
    
    alertaAdvertencia(titulo, mensaje) {
        return this.alerta(titulo, mensaje, 'warning');
    },
    
    alertaInfo(titulo, mensaje) {
        return this.alerta(titulo, mensaje, 'info');
    },
    
    // =====================================================
    // MODAL DE CONFIRMACIÓN - Reemplazo de confirm()
    // =====================================================
    confirmar(titulo, mensaje, opciones = {}) {
        return new Promise((resolve) => {
            const {
                tipo = 'warning',
                textoConfirmar = 'Confirmar',
                textoCancelar = 'Cancelar',
                colorConfirmar = null
            } = opciones;
            
            const iconos = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️',
                danger: '🚨'
            };
            
            const modal = document.createElement('div');
            modal.className = 'notif-modal-overlay';
            modal.innerHTML = `
                <div class="notif-modal notif-modal-${tipo}">
                    <div class="notif-modal-header">
                        <span class="notif-modal-icon">${iconos[tipo] || '⚠️'}</span>
                        <h3 class="notif-modal-titulo">${titulo}</h3>
                    </div>
                    <div class="notif-modal-cuerpo">
                        <p>${mensaje.replace(/\n/g, '<br>')}</p>
                    </div>
                    <div class="notif-modal-acciones">
                        <button class="notif-btn notif-btn-secondary">${textoCancelar}</button>
                        <button class="notif-btn notif-btn-primary ${tipo === 'danger' ? 'notif-btn-danger' : ''}" 
                                ${colorConfirmar ? `style="background: ${colorConfirmar}"` : ''}>
                            ${textoConfirmar}
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => modal.classList.add('show'), 10);
            
            const cerrar = (resultado) => {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                setTimeout(() => modal.remove(), 300);
                resolve(resultado);
            };
            
            modal.querySelector('.notif-btn-secondary').onclick = () => cerrar(false);
            modal.querySelector('.notif-btn-primary').onclick = () => cerrar(true);
            
            modal.onclick = (e) => {
                if (e.target === modal) cerrar(false);
            };
            
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    cerrar(false);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    },
    
    // =====================================================
    // MODAL DE INPUT - Reemplazo de prompt()
    // =====================================================
    prompt(titulo, mensaje, opciones = {}) {
        return new Promise((resolve) => {
            const {
                tipo = 'info',
                placeholder = '',
                valorInicial = '',
                textoConfirmar = 'Aceptar',
                textoCancelar = 'Cancelar'
            } = opciones;
            
            const iconos = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            const modal = document.createElement('div');
            modal.className = 'notif-modal-overlay';
            modal.innerHTML = `
                <div class="notif-modal notif-modal-${tipo}">
                    <div class="notif-modal-header">
                        <span class="notif-modal-icon">${iconos[tipo] || 'ℹ️'}</span>
                        <h3 class="notif-modal-titulo">${titulo}</h3>
                    </div>
                    <div class="notif-modal-cuerpo">
                        <p>${mensaje.replace(/\n/g, '<br>')}</p>
                        <input type="text" class="notif-input" placeholder="${placeholder}" value="${valorInicial}">
                    </div>
                    <div class="notif-modal-acciones">
                        <button class="notif-btn notif-btn-secondary">${textoCancelar}</button>
                        <button class="notif-btn notif-btn-primary">${textoConfirmar}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            const input = modal.querySelector('.notif-input');
            setTimeout(() => {
                modal.classList.add('show');
                input.focus();
            }, 10);
            
            const cerrar = (valor) => {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                setTimeout(() => modal.remove(), 300);
                resolve(valor);
            };
            
            modal.querySelector('.notif-btn-secondary').onclick = () => cerrar(null);
            modal.querySelector('.notif-btn-primary').onclick = () => cerrar(input.value);
            
            input.onkeydown = (e) => {
                if (e.key === 'Enter') cerrar(input.value);
            };
            
            modal.onclick = (e) => {
                if (e.target === modal) cerrar(null);
            };
            
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    cerrar(null);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    }
};

// Alias global para uso rápido
window.Notif = NotificacionesUI;

console.log('✅ notificaciones-ui.js cargado con validación de sesión');