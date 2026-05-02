// ============================================
// SISTEMA DE CIERRE DE MODALES AL HACER CLIC FUERA
// ============================================

(function() {
    'use strict';
    
    // Guardar referencias a las funciones originales antes de que otros scripts las sobrescriban
    const originalCloseFunctions = {};
    
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

// Función para cerrar modales manualmente sin depender de funciones externas
function closeModalDirectly(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return false;

    // ✅ CAPTURAR SCROLL ANTES DE LIMPIAR
    const scrollY = document.body.style.top;
    
    // Cerrar el modal directamente
    modal.classList.remove('active');
    
    // ✅ RESTAURAR SCROLL CORRECTAMENTE
    document.body.classList.remove('modal-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // ✅ Restaurar posición del scroll
    if (scrollY) {
        const scrollPosition = parseInt(scrollY || '0') * -1;
        window.scrollTo(0, scrollPosition);
        console.log('✅ Scroll restaurado a:', scrollPosition);
    }
    
    // Limpiar formularios según el tipo de modal
    switch(modalId) {
        case 'commentsModal':
            const commentInput = document.getElementById('commentInput');
            if (commentInput) {
                commentInput.value = '';
                commentInput.style.height = 'auto';
            }
            if (window.CommentsSystem) {
                window.CommentsSystem.currentPost = null;
                window.CommentsSystem.comments = [];
                window.CommentsSystem.activeReplyForm = null;
                if (window.CommentsSystem.visibleReplies) {
                    window.CommentsSystem.visibleReplies.clear();
                }
            }
            break;
            
        case 'shareModal':
            const shareSearch = document.getElementById('shareSearch');
            if (shareSearch) {
                shareSearch.value = '';
            }
            if (window.ShareSystem) {
                window.ShareSystem.currentPost = null;
                if (window.ShareSystem.selectedUsers) {
                    window.ShareSystem.selectedUsers.clear();
                }
            }
            break;
            
        case 'participateModal':
            const participateTextInput = document.getElementById('participateTextInput');
            if (participateTextInput) {
                participateTextInput.value = '';
            }
            break;
            
        case 'submissionsModal':
            const submissionsContent = document.getElementById('submissionsContent');
            if (submissionsContent) {
                submissionsContent.innerHTML = '';
            }
            break;
    }
    
    return true;
}

    // Función principal para configurar el cierre de modales
    function setupModalCloseOnOutsideClick() {
        MODAL_CONFIG.forEach(config => {
            const modal = document.getElementById(config.modalId);
            
            if (!modal) {
                return;
            }

            // Remover event listeners anteriores para evitar duplicados
            const newModal = modal.cloneNode(true);
            modal.parentNode.replaceChild(newModal, modal);

            // Agregar nuevo event listener
            newModal.addEventListener('click', function(event) {
                // Verificar si el modal está activo
                if (!newModal.classList.contains('active')) {
                    return;
                }

                // Buscar el contenedor interno del modal
                const innerContainer = newModal.querySelector(`.${config.containerClass}`);
                
                if (!innerContainer) {
                    return;
                }

                // Verificar si el clic fue fuera del contenedor interno
                if (event.target === newModal) {
                    // El clic fue en el fondo del modal
                    console.log(`Cerrando ${config.modalId} por clic externo`);
                    
                    // Intentar cerrar directamente primero
                    if (!closeModalDirectly(config.modalId)) {
                        // Si no se pudo cerrar directamente, intentar con la función original
                        tryCloseWithOriginalFunction(config);
                    }
                }
            });
        });

        // También manejar los dropdowns del menú de posts
        setupPostMenuOutsideClick();
    }

    // Función para intentar cerrar con la función original
    function tryCloseWithOriginalFunction(config) {
        try {
            // Verificar si existe la función original guardada
            if (originalCloseFunctions[config.closeFunction] && 
                typeof originalCloseFunctions[config.closeFunction] === 'function') {
                originalCloseFunctions[config.closeFunction]();
            } else if (typeof window[config.closeFunction] === 'function') {
                // Solo llamar si no es una función recursiva
                const funcString = window[config.closeFunction].toString();
                if (!funcString.includes(config.closeFunction)) {
                    window[config.closeFunction]();
                } else {
                    // Si parece recursiva, cerrar directamente
                    closeModalDirectly(config.modalId);
                }
            } else {
                // Si no hay función disponible, cerrar directamente
                closeModalDirectly(config.modalId);
            }
        } catch (error) {
            console.warn(`Error con función de cierre, usando cierre directo para ${config.modalId}`);
            closeModalDirectly(config.modalId);
        }
    }

    // Configurar cierre de menús de posts al hacer clic fuera
    function setupPostMenuOutsideClick() {
        // Remover listeners anteriores
        const oldHandler = window._postMenuOutsideClickHandler;
        if (oldHandler) {
            document.removeEventListener('click', oldHandler);
        }

        // Crear nuevo handler
        window._postMenuOutsideClickHandler = function(event) {
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
        };

        document.addEventListener('click', window._postMenuOutsideClickHandler);
    }

    // Función para manejar tecla Escape (complementario)
    function setupEscapeKeyHandler() {
        // Remover handler anterior si existe
        const oldHandler = window._escapeKeyHandler;
        if (oldHandler) {
            document.removeEventListener('keydown', oldHandler);
        }

        window._escapeKeyHandler = function(event) {
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
                    closeModalDirectly(activeModal.modalId);
                }
            }
        };

        document.addEventListener('keydown', window._escapeKeyHandler);
    }

    // Guardar referencias a las funciones originales antes de que se sobrescriban
    function saveOriginalFunctions() {
        MODAL_CONFIG.forEach(config => {
            if (typeof window[config.closeFunction] === 'function') {
                originalCloseFunctions[config.closeFunction] = window[config.closeFunction];
                console.log(`✅ Función original ${config.closeFunction} guardada`);
            }
        });
    }

    // Inicialización cuando el DOM esté listo
    function initialize() {
        // Guardar funciones originales inmediatamente
        saveOriginalFunctions();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    function setup() {
        setupModalCloseOnOutsideClick();
        setupEscapeKeyHandler();
        
        // Re-configurar cuando se agreguen nuevos modales dinámicamente
        observeModalAdditions();
        
        console.log('✅ Sistema de cierre de modales inicializado (versión sin recursión)');
    }

    // Observer para modales agregados dinámicamente
    function observeModalAdditions() {
        // Detener observer anterior si existe
        if (window._modalObserver) {
            window._modalObserver.disconnect();
        }

        window._modalObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Verificar si es un modal o contiene modales
                        MODAL_CONFIG.forEach(config => {
                            if (node.id === config.modalId || (node.querySelector && node.querySelector(`#${config.modalId}`))) {
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
        window._modalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Función pública para cerrar modales programáticamente
    window.closeModalById = function(modalId) {
        return closeModalDirectly(modalId);
    };

    // Función pública para agregar nuevos modales dinámicamente
    window.registerModalForOutsideClick = function(modalId, containerClass, closeFunction) {
        // Verificar si ya existe
        const exists = MODAL_CONFIG.find(c => c.modalId === modalId);
        if (!exists) {
            MODAL_CONFIG.push({
                modalId: modalId,
                containerClass: containerClass,
                closeFunction: closeFunction
            });
            
            // Guardar función original si existe
            if (typeof window[closeFunction] === 'function') {
                originalCloseFunctions[closeFunction] = window[closeFunction];
            }
            
            // Re-configurar para incluir el nuevo modal
            setupModalCloseOnOutsideClick();
            
            console.log(`✅ Modal ${modalId} registrado para cierre externo`);
        }
    };

    // Inicializar
    initialize();

})();