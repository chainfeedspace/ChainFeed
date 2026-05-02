/**
 * Sistema de Redirección a Perfiles de Usuario - ChainFeed (VERSIÓN CORREGIDA)
 * Maneja clics en avatares y nombres de usuario para redirigir al perfil correspondiente
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURACIÓN
    // ============================================
    
    const CONFIG = {
        baseProfileUrl: 'https://chainfeed.space/perfil?user=',
        // Selectores de elementos clickeables para redirección
        clickableSelectors: [
            '.post-avatar',
            '.post-author',
            '.comment-avatar', 
            '.comment-author',
            '.suggestion-avatar',
            '.suggestion-name',
            '.submission-avatar',
            '.submission-username',
            '.mutual-follower-avatar',
            '.mutual-follower-name'
        ],
        // ✅ ELEMENTOS Y CONTENEDORES QUE NUNCA DEBEN REDIRIGIR
        excludeSelectors: [
            // Botones generales
            'button',
            '.btn',
            '.nav-btn',
            '.post-btn',
            '.comment-submit-btn',
            '.follow-btn',
            '.reply-btn',
            '.post-menu-btn',
            '.post-dropdown',
            '.comment-action',
            '.participate-media-btn',
            '.participate-audio-btn',
            '.participate-submit-btn',
            '.participate-cancel-btn',
            '.close-participate',
            '.close-submissions',
            '.share-send-btn',
            
            // Modales completos
            '.participate-modal',
            '.submissions-modal',
            '.share-modal',
            '.comments-modal',
            
            // Controles de creador
            '[data-controles-creador]',
            
            // Inputs y formularios
            'input',
            'textarea',
            'select',
            'form'
        ],
        // ✅ CONTENEDORES DONDE NUNCA SE DEBE ACTIVAR LA REDIRECCIÓN
        excludeContainers: [
            '#participateModal',
            '#submissionsModal',
            '#shareModal',
            '#commentsModal',
            '.participate-container',
            '.submissions-container',
            '.share-container',
            '.comments-container'
        ]
    };

    // ============================================
    // FUNCIONES PRINCIPALES
    // ============================================

    /**
     * Extraer nombre de usuario de un elemento
     */
    function extractUsername(element) {
        // Método 1: Atributo data-username (PRIORITARIO)
        let username = element.dataset.username;
        if (username && isValidUsername(username)) return username.trim();

        // Método 2: Buscar en elementos relacionados
        const container = element.closest('.post-card, .comment-item, .user-suggestion, .submission-item, .mutual-follower-item');
        if (container) {
            // Sub-método 2a: Buscar en data attributes
            username = container.dataset.username || 
                      container.dataset.author ||
                      container.querySelector('[data-username]')?.dataset.username;
            if (username && isValidUsername(username)) return username.trim();

            // Sub-método 2b: Extraer de .post-meta que contiene "@username"
            const postMeta = container.querySelector('.post-meta');
            if (postMeta) {
                const metaText = postMeta.textContent;
                const usernameMatch = metaText.match(/@([a-zA-Z0-9_.-]+)(?:\s|•|$)/);
                if (usernameMatch && usernameMatch[1] && isValidUsername(usernameMatch[1])) {
                    return usernameMatch[1].trim();
                }
            }

            // Sub-método 2c: Buscar en elementos de texto
            const authorElement = container.querySelector('.post-author, .comment-author, .suggestion-name, .submission-username, .mutual-follower-name');
            if (authorElement) {
                username = authorElement.textContent.trim().replace('@', '').replace('✓', '').trim();
                if (username && isValidUsername(username) && !isDisplayName(username)) {
                    return username;
                }
            }
        }

        // Método 3: Buscar en elementos hermanos
        const parent = element.parentElement;
        if (parent) {
            const usernameElement = parent.querySelector('[data-username]');
            if (usernameElement && usernameElement.dataset.username) {
                username = usernameElement.dataset.username.trim();
                if (isValidUsername(username)) return username;
            }

            const siblingMeta = parent.querySelector('.post-meta');
            if (siblingMeta) {
                const metaText = siblingMeta.textContent;
                const usernameMatch = metaText.match(/@([a-zA-Z0-9_.-]+)(?:\s|•|$)/);
                if (usernameMatch && usernameMatch[1] && isValidUsername(usernameMatch[1])) {
                    return usernameMatch[1].trim();
                }
            }
        }

        return null;
    }

    /**
     * Verificar si es un username válido
     */
    function isValidUsername(username) {
        if (!username || typeof username !== 'string') return false;
        
        username = username.trim();
        
        const invalidTexts = [
            'tu', 'tú', 'usuario', 'user', 'perfil', 'profile',
            'comentar', 'responder', 'seguir', 'follow', 'enviar',
            'publicar', 'post', 'like', 'repost', 'compartir',
            'hace', 'min', 'hora', 'día', 'semana', 'mes',
            'cft', 'tokens', 'verified', 'verificado'
        ];
        
        if (invalidTexts.includes(username.toLowerCase())) return false;
        if (username.length < 2 || username.length > 30) return false;
        if (/^[0-9\s\-_\.]+$/.test(username)) return false;
        
        return true;
    }

    /**
     * Verificar si el texto es un display name
     */
    function isDisplayName(text) {
        if (!text) return true;
        
        const displayNamePatterns = [
            /^[A-Z][a-z\s]+$/,
            /\s/,
            /[áéíóúüñ]/i,
            /^.{30,}$/
        ];
        
        return displayNamePatterns.some(pattern => pattern.test(text));
    }

    /**
     * Redirigir al perfil del usuario
     */
    function redirectToProfile(username) {
        if (!isValidUsername(username)) {
            return false;
        }

        try {
            const cleanUsername = username.toLowerCase()
                .replace(/[^a-z0-9._-]/g, '')
                .replace(/^[._-]+|[._-]+$/g, '');

            if (!cleanUsername) {
                return false;
            }

            const profileUrl = CONFIG.baseProfileUrl + encodeURIComponent(cleanUsername);
            
            showRedirectNotification(cleanUsername);
            
            setTimeout(() => {
                window.location.href = profileUrl;
            }, 300);

            return true;

        } catch (error) {
            console.error('Error al redirigir al perfil:', error);
            return false;
        }
    }

    /**
     * Manejar clic en elemento - VERSIÓN MEJORADA
     */
    function handleUserClick(event) {
        const element = event.target;
        
        // ✅ VERIFICACIÓN 1: Ignorar clics dentro de modales
        for (const containerSelector of CONFIG.excludeContainers) {
            if (element.closest(containerSelector)) {
                return; // Salir silenciosamente sin log
            }
        }
        
        // ✅ VERIFICACIÓN 2: Ignorar elementos excluidos (botones, inputs, etc.)
        for (const excludeSelector of CONFIG.excludeSelectors) {
            if (element.matches(excludeSelector) || element.closest(excludeSelector)) {
                return; // Salir silenciosamente
            }
        }
        
        // ✅ VERIFICACIÓN 3: Ignorar elementos con onclick attribute
        if (element.hasAttribute('onclick') || element.closest('[onclick]')) {
            return;
        }

        // ✅ VERIFICACIÓN 4: Verificar si es un elemento clickeable para redirección
        let isClickable = false;
        for (const selector of CONFIG.clickableSelectors) {
            if (element.matches(selector) || element.closest(selector)) {
                isClickable = true;
                break;
            }
        }

        if (!isClickable) {
            return; // No es clickeable, salir silenciosamente
        }

        // Extraer username
        const username = extractUsername(element);
        
        if (username && isValidUsername(username)) {
            event.preventDefault();
            event.stopPropagation();
            
            // Agregar efecto visual
            addClickEffect(element);
            
            // Redirigir al perfil
            redirectToProfile(username);
        }
    }

    /**
     * Agregar efecto visual al hacer clic
     */
    function addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);
    }

    /**
     * Mostrar notificación de redirección
     */
    function showRedirectNotification(username) {
        const notification = createNotification(`Abriendo perfil de @${username}...`, 'info');
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 2000);
    }

    /**
     * Crear elemento de notificación
     */
    function createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        
        const bgColor = type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(26, 26, 36, 0.95)';
        const borderColor = type === 'error' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            background: ${bgColor};
            backdrop-filter: blur(10px);
            border: 1px solid ${borderColor};
            border-radius: 12px;
            padding: 1rem 1.5rem;
            color: #acacc1;
            z-index: 10000;
            max-width: 350px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        notification.textContent = message;
        return notification;
    }

    /**
     * Agregar estilos CSS necesarios
     */
    function addStyles() {
        if (document.getElementById('redirect-user-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'redirect-user-styles';
        style.textContent = `
            .post-avatar, .comment-avatar, .suggestion-avatar, .submission-avatar,
            .mutual-follower-avatar {
                cursor: pointer !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            }
            
            .post-avatar:hover, .comment-avatar:hover, .suggestion-avatar:hover,
            .submission-avatar:hover, .mutual-follower-avatar:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 0 15px rgba(99, 102, 241, 0.4) !important;
            }
            
            .post-author, .comment-author, .suggestion-name, .submission-username,
            .mutual-follower-name {
                cursor: pointer !important;
                transition: color 0.2s ease !important;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Inicializar el sistema de redirección
     */
    function initialize() {
        addStyles();
        document.addEventListener('click', handleUserClick, true);
    }

    /**
     * Función pública para redirigir programáticamente
     */
    window.redirectToUserProfile = function(username) {
        if (username && isValidUsername(username)) {
            redirectToProfile(username);
            return true;
        }
        return false;
    };

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();