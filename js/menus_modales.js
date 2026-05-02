// ============================================
// SISTEMA DE MENÚS MODALES MODERNOS
// menus_modales.js
// ============================================

/**
 * Sistema que reemplaza los dropdowns tradicionales por modales elegantes
 * Sin modificar el código existente, solo interceptando las funciones
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURACIÓN Y ESTADO
    // ============================================

    const MenuModalesSystem = {
        activeModal: null,
        originalFunctions: {},
        initialized: false
    };

    // ============================================
    // FUNCIÓN PRINCIPAL: ABRIR MODAL DE OPCIONES DE POST
    // ============================================

    function abrirModalOpcionesPost(postId, isChainEvent = false) {
        // Cerrar cualquier modal activo
        cerrarModalActivo();

        // Obtener elemento del post
        const postElement = isChainEvent 
            ? document.querySelector(`[data-event-id="${postId}"]`)
            : document.querySelector(`[data-post-id="${postId}"]`);

        if (!postElement) {
            console.error('Post no encontrado:', postId);
            return;
        }

        // Determinar si es propietario
        const isOwner = esUsuarioPropietario(postElement, isChainEvent);

        // Crear modal
        const modal = crearModalOpciones(postId, isOwner, isChainEvent);
        document.body.appendChild(modal);

        MenuModalesSystem.activeModal = modal;

        // Animación de entrada
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-opciones-content');
            if (content) {
                content.style.transform = 'translateY(0)';
            }
        });
    }

    // ============================================
    // FUNCIÓN: ABRIR MODAL DE CONFIGURACIÓN
    // ============================================

    function abrirModalConfiguracion() {
        // Cerrar cualquier modal activo
        cerrarModalActivo();

        // Crear modal de configuración
        const modal = crearModalConfiguracion();
        document.body.appendChild(modal);

        MenuModalesSystem.activeModal = modal;

        // Animación de entrada
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-opciones-content');
            if (content) {
                content.style.transform = 'translateY(0)';
            }
        });
    }

    // ============================================
    // CREAR MODAL DE OPCIONES DE POST
    // ============================================

    function crearModalOpciones(postId, isOwner, isChainEvent) {
        const modal = document.createElement('div');
        modal.className = 'modal-opciones-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgb(10 11 16 / 83%);
            backdrop-filter: blur(4px);
            z-index: 10001;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.25s ease;
            padding: 0;
        `;

        const content = document.createElement('div');
        content.className = 'modal-opciones-content';
        content.style.cssText = `
            background: rgba(15, 15, 20, 0.98);
            border-radius: 16px 16px 0 0;
            padding: 0;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        `;

        // Handle drag indicator
        const dragIndicator = document.createElement('div');
        dragIndicator.style.cssText = `
            width: 32px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            margin: 12px auto 8px;
        `;

        // Contenedor de opciones
        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = `
            padding: 8px 0 12px;
        `;

        // Generar opciones según tipo
        const opciones = isChainEvent 
            ? generarOpcionesChainEvent(postId, isOwner)
            : generarOpcionesPost(postId, isOwner);

        opciones.forEach((opcion, index) => {
            const btn = crearBotonOpcion(opcion);
            optionsContainer.appendChild(btn);
            
            if (index < opciones.length - 1) {
                const separator = document.createElement('div');
                separator.style.cssText = `
                    height: 1px;
                    background: rgba(255, 255, 255, 0.06);
                    margin: 0 16px;
                `;
                optionsContainer.appendChild(separator);
            }
        });

        // Ensamblar modal
        content.appendChild(dragIndicator);
        content.appendChild(optionsContainer);
        modal.appendChild(content);

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModalActivo();
            }
        });

        return modal;
    }

    // ============================================
    // CREAR MODAL DE CONFIGURACIÓN
    // ============================================

    function crearModalConfiguracion() {
        const modal = document.createElement('div');
        modal.className = 'modal-opciones-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgb(10 11 16 / 83%);
            backdrop-filter: blur(4px);
            z-index: 10001;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.25s ease;
            padding: 0;
        `;

        const content = document.createElement('div');
        content.className = 'modal-opciones-content';
        content.style.cssText = `
            background: rgba(15, 15, 20, 0.98);
            border-radius: 16px 16px 0 0;
            padding: 0;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        `;

        // Drag indicator
        const dragIndicator = document.createElement('div');
        dragIndicator.style.cssText = `
            width: 32px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            margin: 12px auto 8px;
        `;

        // Opciones de configuración
        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = `padding: 8px 0 12px;`;

        const opcionesConfig = [
            {
                icono: '✏️',
                texto: 'Editar Perfil',
                color: '#3b82f6',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof goToEditProfile === 'function') {
                        goToEditProfile();
                    }
                }
            },
            {
                icono: realUserData?.perfil_privado ? '🔒' : '🔓',
                texto: realUserData?.perfil_privado ? 'Perfil Privado' : 'Perfil Público',
                color: '#8b5cf6',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof togglePrivacyStatus === 'function') {
                        togglePrivacyStatus();
                    }
                }
            },
            {
                icono: '🚪',
                texto: 'Cerrar Sesión',
                color: '#ef4444',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof confirmLogout === 'function') {
                        confirmLogout();
                    }
                }
            }
        ];

        opcionesConfig.forEach((opcion, index) => {
            const btn = crearBotonOpcion(opcion);
            optionsContainer.appendChild(btn);
            
            if (index < opcionesConfig.length - 1) {
                const separator = document.createElement('div');
                separator.style.cssText = `
                    height: 1px;
                    background: rgba(255, 255, 255, 0.06);
                    margin: 0 16px;
                `;
                optionsContainer.appendChild(separator);
            }
        });

        // Ensamblar
        content.appendChild(dragIndicator);
        content.appendChild(optionsContainer);
        modal.appendChild(content);

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModalActivo();
            }
        });

        return modal;
    }

    // ============================================
    // GENERAR OPCIONES DE POST
    // ============================================
function generarOpcionesPost(postId, isOwner) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    
    // 🔥 DETECCIÓN MEJORADA: Buscar AMBOS indicadores
    const saleIndicator = postElement?.querySelector('.sale-indicator');
    const salePriceBtn = postElement?.querySelector('.sale-price-btn');
    const isForSale = (saleIndicator !== null) || (salePriceBtn !== null);
    
    console.log('🔍 DEBUG - Estado de venta:', {
        postId: postId,
        tieneSaleIndicator: saleIndicator !== null,
        tieneSalePriceBtn: salePriceBtn !== null,
        isForSale: isForSale
    });

    if (isOwner) {
        // 🔥 DETECTAR ESTADO ACTUAL DE LA PUBLICACIÓN
        const privacyBadge = postElement?.querySelector('.post-privacy-badge');
        const esPrivada = privacyBadge !== null;
        
        const opciones = [
            {
                icono: '📢',
                texto: 'Promover contenido',
                color: '#f59e0b',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof openPromotionModal === 'function') {
                        setTimeout(() => {
                            openPromotionModal('post', postId, postElement);
                        }, 100);
                    } else {
                        console.error('Sistema de promoción no disponible');
                    }
                }
            },
            {
                icono: esPrivada ? '🌍' : '🔒',
                texto: esPrivada ? 'Hacer público' : 'Hacer privado',
                color: '#8b5cf6',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof togglePostPrivacy === 'function') {
                        const makePrivate = !esPrivada;
                        togglePostPrivacy(postId, makePrivate);
                    }
                }
            },
            {
                // 🔥 TEXTO CORRECTO SEGÚN ESTADO
                icono: isForSale ? '❌' : '💰',
                texto: isForSale ? 'Cancelar Venta' : 'Poner en Venta',
                color: '#f59e0b',
                accion: () => {
                    cerrarModalActivo();
                    if (isForSale && typeof cancelSale === 'function') {
                        cancelSale(postId);
                    } else if (!isForSale && typeof sellPost === 'function') {
                        sellPost(postId);
                    }
                }
            },
            {
                icono: '🗑️',
                texto: 'Eliminar',
                color: '#ef4444',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof deletePost === 'function') {
                        deletePost(postId);
                    }
                }
            }
        ];
        return opciones;
    } else {
        // Usuario NO propietario
        const opciones = [];

        if (isForSale) {
            opciones.push({
                icono: '🛒',
                texto: 'Comprar Publicación',
                color: '#10b981',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof buyPost === 'function') {
                        buyPost(postId);
                    }
                }
            });
        }

        opciones.push({
            icono: '👁️‍🗨️',
            texto: 'Ocultar',
            color: '#71717a',
            accion: () => {
                cerrarModalActivo();
                if (typeof hidePost === 'function') {
                    hidePost(postId);
                }
            }
        });

        opciones.push({
            icono: '⚠️',
            texto: 'Reportar',
            color: '#ef4444',
            accion: () => {
                cerrarModalActivo();
                if (typeof reportPost === 'function') {
                    reportPost(postId);
                }
            }
        });

        return opciones;
    }
}

   // ============================================
// GENERAR OPCIONES DE CHAIN EVENT
// ============================================

function generarOpcionesChainEvent(eventId, isOwner) {
    const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
    
    if (isOwner) {
        // 🔥 DETECTAR ESTADO ACTUAL DEL EVENTO CHAIN
        // Buscar en el HTML del evento si tiene badge de privacidad o algún indicador
        const eventHTML = eventElement?.innerHTML || '';
        
        // Método 1: Buscar en los datos del evento en ChainSystem
        let esPublico = true; // Por defecto asumimos público
        
        if (typeof ChainSystem !== 'undefined' && ChainSystem.events) {
            const evento = ChainSystem.events.find(e => String(e.id) === String(eventId));
            if (evento) {
                esPublico = evento.es_publico === 1 || evento.es_publico === true;
                console.log('🔍 Estado del evento desde ChainSystem:', {
                    eventId: eventId,
                    es_publico: evento.es_publico,
                    esPublico: esPublico
                });
            }
        }
        
        // Método 2: Buscar badge de privacidad en el HTML (fallback)
        if (!ChainSystem || !ChainSystem.events) {
            // Si tiene el texto "🔒 Solo seguidores" es privado
            esPublico = !eventHTML.includes('🔒 Solo seguidores');
            console.log('🔍 Estado del evento desde HTML:', {
                eventId: eventId,
                esPublico: esPublico,
                tieneTextPrivado: eventHTML.includes('🔒 Solo seguidores')
            });
        }
        
        return [
            {
                icono: '📢',
                texto: 'Promover evento',
                color: '#f59e0b',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof openPromotionModal === 'function') {
                        setTimeout(() => {
                            openPromotionModal('event', eventId, eventElement);
                        }, 100);
                    } else {
                        console.error('Sistema de promoción no disponible');
                    }
                }
            },
            {
                // 🔥 MOSTRAR ESTADO CORRECTO
                icono: esPublico ? '🔒' : '🌍',
                texto: esPublico ? 'Hacer privado' : 'Hacer público',
                color: '#8b5cf6',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof toggleEventPrivacy === 'function') {
                        // 🔥 ENVIAR EL ESTADO CORRECTO
                        // currentStatus = lo que ES ahora
                        toggleEventPrivacy(eventId, esPublico);
                    }
                }
            },
            {
                icono: '🗑️',
                texto: 'Eliminar Evento',
                color: '#ef4444',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof deleteChainEvent === 'function') {
                        deleteChainEvent(eventId);
                    }
                }
            }
        ];
    } else {
        return [
            {
                icono: '👁️‍🗨️',
                texto: 'Ocultar',
                color: '#71717a',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof hideChainEvent === 'function') {
                        hideChainEvent(eventId);
                    }
                }
            },
            {
                icono: '⚠️',
                texto: 'Reportar',
                color: '#ef4444',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof reportChainEvent === 'function') {
                        reportChainEvent(eventId);
                    }
                }
            }
        ];
    }
}

    // ============================================
    // CREAR BOTÓN DE OPCIÓN
    // ============================================

    function crearBotonOpcion(opcion) {
        const btn = document.createElement('button');
        btn.style.cssText = `
            width: 100%;
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 14px 16px;
            background: transparent;
            border: none;
            color: rgb(210, 214, 240);
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s ease;
            text-align: left;
        `;

        btn.innerHTML = `
            <span style="font-size: 20px; width: 20px; text-align: center;">${opcion.icono}</span>
            <span style="flex: 1;">${opcion.texto}</span>
        `;

        btn.onmouseenter = () => {
            btn.style.background = 'rgba(255, 255, 255, 0.05)';
        };

        btn.onmouseleave = () => {
            btn.style.background = 'transparent';
        };

        btn.onclick = () => {
            if (opcion.accion) {
                opcion.accion();
            }
        };

        return btn;
    }

    // ============================================
    // UTILIDADES
    // ============================================

function esUsuarioPropietario(postElement, isChainEvent) {
    if (!postElement || !window.CHAINFEED_CONFIG?.currentUser) {
        return false;
    }

    try {
        const currentUsername = window.CHAINFEED_CONFIG.currentUser.username;
        const allUserLinks = postElement.querySelectorAll('[onclick*="goToUserProfile"]');
        
        // Método 1: Buscar el enlace que tiene @ (es el username)
        for (const link of allUserLinks) {
            const text = link.textContent.trim();
            if (text.startsWith('@')) {
                const postUsername = text.replace('@', '').trim();
                return postUsername === currentUsername;
            }
        }
        
        // Método 2: Fallback - comparar username extraído del onclick
        for (const link of allUserLinks) {
            const onclickAttr = link.getAttribute('onclick');
            const usernameMatch = onclickAttr.match(/goToUserProfile\('([^']+)'\)/);
            if (usernameMatch && usernameMatch[1] === currentUsername) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error verificando propiedad:', error);
        return false;
    }
}

    function cerrarModalActivo() {
        if (!MenuModalesSystem.activeModal) return;

        const modal = MenuModalesSystem.activeModal;
        const content = modal.querySelector('.modal-opciones-content');
        
        if (content) {
            content.style.transform = 'translateY(100%)';
        }
        
        modal.style.opacity = '0';

        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            MenuModalesSystem.activeModal = null;
        }, 250);
    }

    // ============================================
    // INTERCEPTAR FUNCIONES ORIGINALES
    // ============================================

    function interceptarFunciones() {
        // Guardar referencias originales
        if (window.togglePostMenu) {
            MenuModalesSystem.originalFunctions.togglePostMenu = window.togglePostMenu;
        }
        if (window.toggleChainEventMenu) {
            MenuModalesSystem.originalFunctions.toggleChainEventMenu = window.toggleChainEventMenu;
        }
        if (window.toggleConfigMenu) {
            MenuModalesSystem.originalFunctions.toggleConfigMenu = window.toggleConfigMenu;
        }

        // Reemplazar con versiones modales
        window.togglePostMenu = function(postId) {
            abrirModalOpcionesPost(postId, false);
        };

        window.toggleChainEventMenu = function(eventId) {
            abrirModalOpcionesPost(eventId, true);
        };

        window.toggleConfigMenu = function() {
            abrirModalConfiguracion();
        };

        console.log('✅ Funciones interceptadas para usar modales');
    }

    // ============================================
    // LISTENER DE ESC
    // ============================================

    function setupEscapeListener() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && MenuModalesSystem.activeModal) {
                cerrarModalActivo();
            }
        });
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    function inicializarSistema() {
        if (MenuModalesSystem.initialized) {
            console.log('⚠️ Sistema de menús modales ya inicializado');
            return;
        }

        interceptarFunciones();
        setupEscapeListener();
        
        MenuModalesSystem.initialized = true;
        console.log('✅ Sistema de menús modales inicializado correctamente');
    }

    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarSistema);
    } else {
        inicializarSistema();
    }

    // Exportar funciones al scope global
    window.MenuModalesSystem = {
        abrir: abrirModalOpcionesPost,
        abrirConfig: abrirModalConfiguracion,
        cerrar: cerrarModalActivo,
        initialized: () => MenuModalesSystem.initialized
    };

})();