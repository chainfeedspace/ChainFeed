/**
 * INTEGRACIÓN COMPLETA DEL SISTEMA DE COMPARTIR CON CHAT
 * Conecta el SimplePostViewer con el sistema de compartir existente en el chat
 */

(function() {
    'use strict';

    console.log('🔗 Inicializando integración del sistema de compartir...');

    // Esperar a que todos los sistemas estén disponibles
    function waitForSystems() {
        const checkInterval = setInterval(() => {
            if (typeof window.simplePostViewer !== 'undefined' && 
                typeof window.ViewerShareSystem !== 'undefined' &&
                document.getElementById('shareModal')) {
                
                clearInterval(checkInterval);
                initializeIntegration();
            }
        }, 100);

        // Timeout después de 10 segundos
        setTimeout(() => {
            clearInterval(checkInterval);
            console.warn('⚠️ Timeout esperando sistemas de compartir');
        }, 10000);
    }

    function initializeIntegration() {
        console.log('✅ Todos los sistemas detectados, iniciando integración...');

        // Configurar usuario actual desde CHAINFEED_CONFIG o CommentsSystem
        if (typeof CHAINFEED_CONFIG !== 'undefined' && CHAINFEED_CONFIG.currentUser) {
            window.currentUser = CHAINFEED_CONFIG.currentUser;
        } else if (typeof CommentsSystem !== 'undefined' && CommentsSystem.currentUser) {
            window.currentUser = CommentsSystem.currentUser.username;
        }

        // Sobrescribir la función global openSharedPostFullscreen
        window.openSharedPostFullscreen = function(postData) {
            console.log('📱 Abriendo publicación compartida en fullscreen:', postData);
            
            if (!postData || !postData.id) {
                console.error('❌ Datos de publicación inválidos:', postData);
                return;
            }

            // Detectar si está silenciada desde el elemento DOM
            const postElement = document.querySelector(`[data-post-id="${postData.id}"]`);
            const estaSilenciada = postElement?.getAttribute('data-silenciado') === 'true';
            
            // Agregar información de silenciado al objeto de datos
            const postDataEnriquecido = {
                ...postData,
                data_silenciado: estaSilenciada,
                'data-silenciado': estaSilenciada ? 'true' : 'false'
            };

            console.log('📊 Post enriquecido con datos de silenciado:', {
                id: postDataEnriquecido.id,
                silenciado: estaSilenciada
            });

            // Usar el SimplePostViewer para abrir el post
            if (window.simplePostViewer) {
                window.simplePostViewer.openViewer(postDataEnriquecido);
            } else {
                console.error('❌ SimplePostViewer no disponible');
            }
        };

        // Agregar estilos adicionales para posts compartidos clickeables
        injectSharedPostStyles();

        // Configurar observer para detectar nuevos posts compartidos
        setupSharedPostsObserver();

        console.log('✅ Integración completa del sistema de compartir finalizada');
    }

    function injectSharedPostStyles() {
        if (document.getElementById('shared-post-integration-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'shared-post-integration-styles';
        styles.textContent = `
            /* Posts compartidos clickeables */
            .shared-post-card.clickable-post {
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .shared-post-card.clickable-post:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
                border-color: rgba(99, 102, 241, 0.5);
            }

            /* Overlay para preview de imágenes/videos */
            .image-preview-container,
            .video-preview-container {
                position: relative;
                cursor: pointer;
            }

            .preview-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                gap: 0.5rem;
            }

            .clickable-post:hover .preview-overlay {
                opacity: 1;
            }

            .preview-icon {
                font-size: 2rem;
            }

            /* Overlay para posts de venta */
            .sale-preview-container {
                position: relative;
            }

            .sale-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
                padding: 1rem;
                border-radius: 0 0 8px 8px;
            }

            .sale-price {
                font-size: 1.2rem;
                font-weight: 700;
                color: #10b981;
                margin-bottom: 0.3rem;
            }

            .sale-action {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.9);
            }

            /* Indicadores de tipo de post */
            .sale-indicator {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .post-indicators {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 0.5rem;
            }

            /* Estados de chat pendiente */
            .chat-status-indicator {
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.85rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .pending-sent-status {
                background: rgba(245, 158, 11, 0.1);
                border: 1px solid rgba(245, 158, 11, 0.3);
                color: #f59e0b;
            }

            .pending-received-status {
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.3);
                color: #6366f1;
            }

            .pending-badge {
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                padding: 0.3rem 0.8rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
            }

            .received-badge {
                background: rgba(99, 102, 241, 0.2);
                color: #6366f1;
                padding: 0.3rem 0.8rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
            }

            /* Info banners en chat */
            .chat-info-banner {
                margin-bottom: 1.5rem;
            }

            .info-banner {
                padding: 1.5rem;
                border-radius: 12px;
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .pending-sent-banner {
                background: rgba(245, 158, 11, 0.1);
                border: 1px solid rgba(245, 158, 11, 0.3);
            }

            .pending-received-banner {
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.3);
            }

            .info-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }

            .info-content {
                flex: 1;
            }

            .info-title {
                font-weight: 700;
                font-size: 1.1rem;
                margin-bottom: 0.5rem;
                color: #ffffff;
            }

            .info-subtitle {
                color: #a0a0b8;
                font-size: 0.95rem;
                line-height: 1.5;
            }

            /* Mejoras para publicaciones silenciadas */
            .shared-post-card.silenciada .preview-overlay {
                background: rgba(239, 68, 68, 0.4);
            }

            .shared-post-card.silenciada:hover {
                border-color: rgba(239, 68, 68, 0.5);
            }
        `;

        document.head.appendChild(styles);
    }

    function setupSharedPostsObserver() {
        // Observer para detectar nuevos posts compartidos en el chat
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Buscar posts compartidos en el nodo agregado
                        const sharedPosts = node.querySelectorAll?.('.shared-post-card') || [];
                        sharedPosts.forEach(enhanceSharedPost);

                        // Si el nodo mismo es un post compartido
                        if (node.classList?.contains('shared-post-card')) {
                            enhanceSharedPost(node);
                        }
                    }
                });
            });
        });

        // Observar el contenedor de mensajes
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            observer.observe(messagesContainer, {
                childList: true,
                subtree: true
            });
        }

        // También procesar posts existentes
        document.querySelectorAll('.shared-post-card').forEach(enhanceSharedPost);
    }

    function enhanceSharedPost(postElement) {
        // Evitar procesar el mismo post múltiples veces
        if (postElement.dataset.enhanced === 'true') return;
        postElement.dataset.enhanced = 'true';

        // Asegurar que tenga la clase clickeable
        if (!postElement.classList.contains('clickable-post')) {
            postElement.classList.add('clickable-post');
        }

        // Verificar que tenga el onclick configurado
        if (!postElement.onclick) {
            console.warn('⚠️ Post compartido sin onclick configurado:', postElement);
        }
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForSystems);
    } else {
        waitForSystems();
    }

    console.log('🔗 Script de integración del sistema de compartir cargado');
})();