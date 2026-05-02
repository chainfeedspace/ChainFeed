// ============================================
// SISTEMA DE CIERRE DE MODALES AL HACER CLIC FUERA
// ============================================

(function() {
    'use strict';
    
    // Configuración de modales y sus funciones de cierre
    const MODAL_CONFIG = [
        {
            modalId: 'commentsModal',
            containerClass: 'comments-container',
            closeFunction: 'closeComments'
        },
        {
            modalId: 'shareModal',
            containerClass: 'share-container',
            closeFunction: 'closeShareModal'
        },
        {
            modalId: 'participateModal',
            containerClass: 'participate-container',
            closeFunction: 'closeParticipateModal'
        },
        {
            modalId: 'submissionsModal',
            containerClass: 'submissions-container',
            closeFunction: 'closeSubmissionsModal'
        }
    ];

    // Función principal para configurar el cierre de modales
function setupModalCloseOnOutsideClick() {
    MODAL_CONFIG.forEach(config => {
        const modal = document.getElementById(config.modalId);
        
        if (!modal) {
            console.warn(`Modal ${config.modalId} no encontrado`);
            return;
        }

        // Agregar event listener al modal
        modal.addEventListener('click', function(event) {
            // Verificar si el modal está activo
            if (!modal.classList.contains('active')) {
                return;
            }

                // ✅ NUEVA VERIFICACIÓN: Para commentsModal
    if (config.modalId === 'commentsModal') {
        const commentInteractiveElements = [
            '.comment-action',
            '.comment-submit-btn',
            '.comment-input', 
            '.comment-textarea',
            '.reply-btn',
            '.like-btn'
        ];
        
        for (const selector of commentInteractiveElements) {
            if (event.target.closest(selector)) {
                console.log('Clic en elemento interactivo del modal de comentarios - NO cerrar');
                return;
            }
        }
    }
    
            // ✅ NUEVA VERIFICACIÓN: Para shareModal, también considerar elementos interactivos
            if (config.modalId === 'shareModal') {
                // Elementos que NO deben cerrar el modal de compartir
                const shareInteractiveElements = [
                    '.user-suggestion',
                    '.suggestion-avatar', 
                    '.suggestion-info',
                    '.suggestion-name',
                    '.suggestion-username',
                    '.selection-indicator',
                    '.share-search',
                    '.share-submit-btn',
                    '.share-message-input'
                ];
                
                // Si el clic fue en algún elemento interactivo, no cerrar
                for (const selector of shareInteractiveElements) {
                    if (event.target.closest(selector)) {
                        console.log('Clic en elemento interactivo del modal de compartir - NO cerrar');
                        return;
                    }
                }
            }

            // Buscar el contenedor interno del modal
            const innerContainer = modal.querySelector(`.${config.containerClass}`);
            
            if (!innerContainer) {
                console.warn(`Contenedor interno .${config.containerClass} no encontrado en ${config.modalId}`);
                return;
            }

            // Verificar si el clic fue fuera del contenedor interno
            if (!innerContainer.contains(event.target)) {
                // El clic fue en el fondo del modal
                closeModalByConfig(config);
            }
        });
    });

    // También manejar los dropdowns del menú de posts
    setupPostMenuOutsideClick();
}

    // Función para cerrar un modal según su configuración
    function closeModalByConfig(config) {
        try {
            // Verificar si la función de cierre existe
            if (typeof window[config.closeFunction] === 'function') {
                window[config.closeFunction]();
                console.log(`Modal ${config.modalId} cerrado al hacer clic fuera`);
            } else {
                console.error(`Función ${config.closeFunction} no encontrada`);
            }
        } catch (error) {
            console.error(`Error cerrando modal ${config.modalId}:`, error);
        }
    }

    // Configurar cierre de menús de posts al hacer clic fuera
    function setupPostMenuOutsideClick() {
        document.addEventListener('click', function(event) {
            // Si el clic es en un botón de menú o dentro de un dropdown, no hacer nada
            if (event.target.closest('.post-menu-btn') || 
                event.target.closest('.post-dropdown')) {
                return;
            }

            // Cerrar todos los menús de posts activos
            const activeMenus = document.querySelectorAll('.post-dropdown.active');
            activeMenus.forEach(menu => {
                menu.classList.remove('active');
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px) scale(0.95)';
                
                setTimeout(() => {
                    menu.classList.add('hidden');
                }, 300);
            });

            // Limpiar variable global si existe
            if (window.activePostMenu) {
                window.activePostMenu = null;
            }
        });
    }

    // Función auxiliar para evitar propagación en elementos internos
    function preventModalContentPropagation() {
        // Prevenir que los clics en el contenido cierren el modal
        const modalContents = [
            '.comments-container',
            '.share-container',
            '.participate-container',
            '.submissions-container'
        ];

        modalContents.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.addEventListener('click', function(event) {
                    event.stopPropagation();
                });
            });
        });
    }

    // Función para manejar tecla Escape (complementario)
    function setupEscapeKeyHandler() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' || event.keyCode === 27) {
                // Encontrar el modal activo más reciente (z-index más alto)
                let activeModal = null;
                let highestZIndex = 0;

                MODAL_CONFIG.forEach(config => {
                    const modal = document.getElementById(config.modalId);
                    if (modal && modal.classList.contains('active')) {
                        const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 0;
                        if (zIndex > highestZIndex) {
                            highestZIndex = zIndex;
                            activeModal = config;
                        }
                    }
                });

                // Cerrar el modal activo con mayor z-index
                if (activeModal) {
                    closeModalByConfig(activeModal);
                }
            }
        });
    }

    // Función para detectar clics en elementos con data-dismiss
    function setupDataDismissHandlers() {
        document.addEventListener('click', function(event) {
            const dismissElement = event.target.closest('[data-dismiss="modal"]');
            if (dismissElement) {
                // Encontrar el modal padre
                const modal = dismissElement.closest('.comments-modal, .share-modal, .participate-modal, .submissions-modal');
                if (modal) {
                    const config = MODAL_CONFIG.find(c => c.modalId === modal.id);
                    if (config) {
                        closeModalByConfig(config);
                    }
                }
            }
        });
    }

    // Inicialización cuando el DOM esté listo
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    function setup() {
        setupModalCloseOnOutsideClick();
        setupEscapeKeyHandler();
        setupDataDismissHandlers();
        
        // Re-configurar cuando se agreguen nuevos modales dinámicamente
        observeModalAdditions();
        
        console.log('✅ Sistema de cierre de modales inicializado');
    }

    // Observer para modales agregados dinámicamente
    function observeModalAdditions() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Verificar si es un modal o contiene modales
                        MODAL_CONFIG.forEach(config => {
                            if (node.id === config.modalId || node.querySelector(`#${config.modalId}`)) {
                                // Re-configurar event listeners
                                setTimeout(() => {
                                    setupModalCloseOnOutsideClick();
                                }, 100);
                            }
                        });
                    }
                });
            });
        });

        // Observar cambios en el body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Función pública para agregar nuevos modales dinámicamente
    window.registerModalForOutsideClick = function(modalId, containerClass, closeFunction) {
        MODAL_CONFIG.push({
            modalId: modalId,
            containerClass: containerClass,
            closeFunction: closeFunction
        });
        
        // Re-configurar para incluir el nuevo modal
        setupModalCloseOnOutsideClick();
        
        console.log(`✅ Modal ${modalId} registrado para cierre externo`);
    };

    // Inicializar
    initialize();

})();