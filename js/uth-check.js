// auth-check.js - Sistema de autenticación para ChainFeed

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.redirectUrl = 'https://chainfeed.space/';
        this.loginUrl = 'https://chainfeed.space/login';
        this.sessionEndpoint = 'php/verificar_sesion.php'; // Tu endpoint actual
    }

    /**
     * Obtener usuario actual desde localStorage (caché rápido)
     */
    getCurrentUser() {
        try {
            const savedUser = localStorage.getItem('chainfeed_user');
            const savedSession = localStorage.getItem('chainfeed_session');
            
            if (savedUser && savedSession) {
                const sessionData = JSON.parse(savedSession);
                const sessionAge = Date.now() - sessionData.timestamp;
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
                
                if (sessionAge < maxAge) {
                    const userData = JSON.parse(savedUser);
                    return userData.username;
                } else {
                    // Sesión expirada - limpiar
                    this.clearLocalSession();
                    return null;
                }
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            return null;
        }
    }

    /**
     * Verificar sesión PHP (más confiable)
     */
    async checkPHPSession() {
        try {
            const response = await fetch(this.sessionEndpoint, {
                method: 'GET',
                credentials: 'include' // Importante para cookies de sesión PHP
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.user) {
                // Guardar en localStorage para caché
                this.saveUserToLocalStorage(data.user);
                this.userData = data.user;
                this.currentUser = data.user.username;
                return true;
            } else {
                // Sesión inválida - limpiar caché local
                this.clearLocalSession();
                return false;
            }
            
        } catch (error) {
            console.error('Error verificando sesión PHP:', error);
            return false;
        }
    }

    /**
     * Verificar autenticación (método principal)
     */
    async checkAuth(required = true) {
        // Primero verificar caché local (rápido)
        this.currentUser = this.getCurrentUser();
        
        if (this.currentUser) {
            return true;
        }
        
        // Si no hay caché, verificar sesión PHP
        const phpValid = await this.checkPHPSession();
        
        if (!phpValid && required) {
            this.redirectToLogin();
            return false;
        }
        
        return phpValid;
    }

    /**
     * Verificar autenticación SIN redirección automática
     * Útil para componentes que se adaptan a usuario/convidado
     */
    async checkAuthSilent() {
        this.currentUser = this.getCurrentUser();
        
        if (this.currentUser) {
            return true;
        }
        
        return await this.checkPHPSession();
    }

    /**
     * Obtener datos completos del usuario
     */
    getUserData() {
        if (this.userData) {
            return this.userData;
        }
        
        try {
            const savedUser = localStorage.getItem('chainfeed_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Error obteniendo datos del usuario:', error);
            return null;
        }
    }

    /**
     * Redirigir al login
     */
    redirectToLogin() {
        const currentPath = window.location.pathname + window.location.search;
        const redirectUrl = `${this.loginUrl}?redirect=${encodeURIComponent(currentPath)}`;
        
        this.showNotification('⚠️ Debes iniciar sesión para acceder a esta página', 'error');
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 2000);
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            // Llamar al endpoint de logout PHP
            await fetch('php/logout.php', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiar siempre el frontend
            this.clearLocalSession();
            window.location.href = this.redirectUrl;
        }
    }

    /**
     * Guardar usuario en localStorage
     */
    saveUserToLocalStorage(userData) {
        try {
            localStorage.setItem('chainfeed_user', JSON.stringify(userData));
            localStorage.setItem('chainfeed_session', JSON.stringify({
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error guardando usuario en localStorage:', error);
        }
    }

    /**
     * Limpiar sesión local
     */
    clearLocalSession() {
        localStorage.removeItem('chainfeed_user');
        localStorage.removeItem('chainfeed_session');
        this.currentUser = null;
        this.userData = null;
    }

    /**
     * Mostrar notificación
     */
    showNotification(message, type = "info") {
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
            animation: slideInRight 0.3s ease;
            z-index: 10000;
            max-width: 350px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ${type === 'error' ? 'border-left: 4px solid #ef4444;' : ''}
            ${type === 'success' ? 'border-left: 4px solid #10b981;' : ''}
        `;
        
        const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #ec4899); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">${icon}</div>
                <div style="font-size: 0.95rem;">${message}</div>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /**
     * Verificar si el usuario está bloqueado
     */
    isUserBlocked() {
        const userData = this.getUserData();
        if (!userData) return false;
        
        if (userData.is_blocked && userData.blocked_until) {
            const blockedUntil = new Date(userData.blocked_until);
            return blockedUntil > new Date();
        }
        
        return false;
    }

    /**
     * Obtener idioma del usuario
     */
    getUserLanguage() {
        const userData = this.getUserData();
        return userData?.language || 'es'; // Default español
    }
}

// Instancia global
const authManager = new AuthManager();

// Añadir estilos para las animaciones
if (!document.querySelector('#auth-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'auth-notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}