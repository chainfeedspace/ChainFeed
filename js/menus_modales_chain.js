// ============================================
// SISTEMA DE MENÚS MODALES PARA CHAIN EVENTS
// menus_modales_chain.js
// ============================================

/**
 * Sistema de menús bottom-sheet estilo móvil para eventos Chain
 * Reemplaza los dropdowns tradicionales por modales modernos
 */

(function() {
    'use strict';

    console.log('🎨 Cargando sistema de modales para Chain Events...');

    // ============================================
    // CONFIGURACIÓN Y ESTADO
    // ============================================

    const MenuModalesChain = {
        activeModal: null,
        originalFunctions: {},
        initialized: false
    };

    // ============================================
    // FUNCIÓN PRINCIPAL: ABRIR MODAL DE CHAIN EVENT
    // ============================================

    function abrirModalOpcionesChainEvent(eventId) {
        console.log('📱 Abriendo modal para Chain Event:', eventId);
        
        // Cerrar cualquier modal activo
        cerrarModalActivo();

        // Obtener elemento del evento
        const numericId = parseInt(eventId.replace('chain-', ''));
        const eventElement = document.querySelector(`[data-event-id="${numericId}"]`);

        if (!eventElement) {
            console.error('❌ Evento Chain no encontrado:', eventId);
            return;
        }

        // Obtener datos del evento
        const evento = obtenerDatosEvento(numericId);
        
        if (!evento) {
            console.error('❌ No se pudieron obtener datos del evento:', numericId);
            return;
        }

        // Determinar si es propietario
        const isOwner = esUsuarioPropietario(evento);
        const isPromoted = evento.is_promoted === true || evento.is_promoted === 1;
        const isPublic = evento.es_publico === true || evento.es_publico === 1 || evento.es_publico === null;

        console.log('📊 Estado del evento:', { isOwner, isPromoted, isPublic });

        // Crear modal
        const modal = crearModalOpcionesChain(eventId, evento, isOwner, isPromoted, isPublic);
        document.body.appendChild(modal);

        MenuModalesChain.activeModal = modal;

        // Animación de entrada
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-chain-content');
            if (content) {
                content.style.transform = 'translateY(0)';
            }
        });
    }

    // ============================================
    // OBTENER DATOS DEL EVENTO
    // ============================================

    function obtenerDatosEvento(numericId) {
        // Buscar en chainEventsData global
        if (window.chainEventsData && Array.isArray(window.chainEventsData)) {
            const evento = window.chainEventsData.find(e => e.id === numericId);
            if (evento) return evento;
        }

        // Buscar en ChainSystem
        if (window.ChainSystem?.events) {
            const evento = window.ChainSystem.events.find(e => e.id === numericId);
            if (evento) return evento;
        }

        return null;
    }

    // ============================================
    // VERIFICAR SI ES PROPIETARIO
    // ============================================

    function esUsuarioPropietario(evento) {
        if (!evento || !window.CHAINFEED_CONFIG?.currentUser) {
            return false;
        }

        try {
            const currentUsername = window.CHAINFEED_CONFIG.currentUser.username;
            
            // Comparar con evento.creador.username
            if (evento.creador?.username) {
                return String(evento.creador.username).toLowerCase().trim() === 
                       String(currentUsername).toLowerCase().trim();
            }

            return false;
            
        } catch (error) {
            console.error('Error verificando propiedad:', error);
            return false;
        }
    }

    // ============================================
    // CREAR MODAL DE OPCIONES PARA CHAIN
    // ============================================

    function crearModalOpcionesChain(eventId, evento, isOwner, isPromoted, isPublic) {
        const modal = document.createElement('div');
        modal.className = 'modal-chain-overlay';
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
        content.className = 'modal-chain-content';
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

        // Header con información del evento
        const header = crearHeaderEvento(evento);
        
        // Drag indicator
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

        // Generar opciones según si es propietario o no
        const opciones = isOwner 
            ? generarOpcionesPropietarioChain(eventId, isPromoted, isPublic)
            : generarOpcionesNoPropiertarioChain(eventId);

        opciones.forEach((opcion, index) => {
            const btn = crearBotonOpcionChain(opcion);
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
        content.appendChild(header);
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
    // CREAR HEADER CON INFO DEL EVENTO
    // ============================================

    function crearHeaderEvento(evento) {
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 12px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        // Icono del tipo de evento
        const tipoIconos = {
            poll: '📊',
            campaign: '🎯',
            audio: '🎵'
        };
        const icono = tipoIconos[evento.tipo] || '⚡';

        // Estado del evento
        const isActive = evento.estado === 'active';
        const statusIcon = isActive ? '🟢' : '🔴';

        header.innerHTML = `
            <div style="font-size: 28px;">${icono}</div>
            <div style="flex: 1; min-width: 0;">
                <div style="
                    font-weight: 600; 
                    font-size: 14px; 
                    color: rgb(210, 214, 240);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                ">
                    ${escapeHtml(evento.titulo)}
                </div>
                <div style="
                    font-size: 12px; 
                    color: rgb(160, 160, 184);
                    margin-top: 2px;
                ">
                    ${statusIcon} ${isActive ? 'Activo' : 'Finalizado'} • 
                    ${evento.participantes || 0} participantes
                </div>
            </div>
        `;

        return header;
    }

    // ============================================
    // GENERAR OPCIONES PARA PROPIETARIO
    // ============================================

    function generarOpcionesPropietarioChain(eventId, isPromoted, isPublic) {
        const opciones = [];

        // PROMOCIONAR (solo si no está promocionado)
        if (!isPromoted) {
            opciones.push({
                icono: '📢',
                texto: 'Promocionar evento',
                color: '#f59e0b',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof promoteChainEvent === 'function') {
                        setTimeout(() => promoteChainEvent(eventId), 100);
                    } else {
                        console.error('❌ promoteChainEvent no disponible');
                        if (typeof showNotification === 'function') {
                            showNotification('Sistema de promoción no disponible', 'error');
                        }
                    }
                }
            });
        } else {
            opciones.push({
                icono: '✅',
                texto: 'Ya publicitado',
                color: '#71717a',
                disabled: true
            });
        }

// CAMBIAR PRIVACIDAD - VERSIÓN CORREGIDA
opciones.push({
    icono: isPublic ? '🔒' : '🌍',
    texto: isPublic ? 'Hacer privado' : 'Hacer público',
    color: '#8b5cf6',
    accion: async () => {
        // ✅ NO CERRAR TODAVÍA - Esperar confirmación del usuario
        
        if (typeof toggleChainPrivacy === 'function') {
            try {
                // toggleChainPrivacy manejará el cierre del modal internamente
                await toggleChainPrivacy(eventId, isPublic);
            } catch (error) {
                console.error('Error cambiando privacidad de Chain:', error);
                if (typeof showNotification === 'function') {
                    showNotification('Error al cambiar privacidad', 'error');
                }
                // Cerrar modal solo si hubo error
                cerrarModalActivo();
            }
        } else {
            console.error('❌ toggleChainPrivacy no disponible');
            if (typeof showNotification === 'function') {
                showNotification('Sistema de privacidad no disponible', 'error');
            }
            cerrarModalActivo();
        }
    }
});

        // ELIMINAR
        opciones.push({
            icono: '🗑️',
            texto: 'Eliminar evento',
            color: '#ef4444',
            accion: () => {
                cerrarModalActivo();
                if (typeof deleteChainEvent === 'function') {
                    setTimeout(() => deleteChainEvent(eventId), 100);
                }
            }
        });

        return opciones;
    }

    // ============================================
    // GENERAR OPCIONES PARA NO PROPIETARIO
    // ============================================

    function generarOpcionesNoPropiertarioChain(eventId) {
        const opciones = [];

        // OCULTAR
        opciones.push({
            icono: '👁️‍🗨️',
            texto: 'Ocultar evento',
            color: '#71717a',
            accion: () => {
                cerrarModalActivo();
                if (typeof hideChainEvent === 'function') {
                    setTimeout(() => hideChainEvent(eventId), 100);
                }
            }
        });

        // REPORTAR
        opciones.push({
            icono: '⚠️',
            texto: 'Reportar evento',
            color: '#ef4444',
            accion: () => {
                cerrarModalActivo();
                if (typeof reportChainEvent === 'function') {
                    setTimeout(() => reportChainEvent(eventId), 100);
                }
            }
        });

        return opciones;
    }

    // ============================================
    // CREAR BOTÓN DE OPCIÓN
    // ============================================

    function crearBotonOpcionChain(opcion) {
        const btn = document.createElement('button');
        btn.style.cssText = `
            width: 100%;
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 14px 16px;
            background: transparent;
            border: none;
            color: ${opcion.disabled ? 'rgba(160, 160, 184, 0.5)' : 'rgb(210, 214, 240)'};
            font-size: 15px;
            font-weight: 500;
            cursor: ${opcion.disabled ? 'not-allowed' : 'pointer'};
            transition: background 0.15s ease;
            text-align: left;
        `;

        btn.innerHTML = `
            <span style="font-size: 20px; width: 20px; text-align: center;">${opcion.icono}</span>
            <span style="flex: 1;">${opcion.texto}</span>
        `;

        if (!opcion.disabled) {
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
        }

        return btn;
    }

    // ============================================
    // UTILIDADES
    // ============================================

    function cerrarModalActivo() {
        if (!MenuModalesChain.activeModal) return;

        const modal = MenuModalesChain.activeModal;
        const content = modal.querySelector('.modal-chain-content');
        
        if (content) {
            content.style.transform = 'translateY(100%)';
        }
        
        modal.style.opacity = '0';

        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            MenuModalesChain.activeModal = null;
        }, 250);
    }

    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // ============================================
    // INTERCEPTAR toggleChainMenu
    // ============================================

    function interceptarToggleChainMenu() {
        // Guardar función original si existe
        if (window.toggleChainMenu) {
            MenuModalesChain.originalFunctions.toggleChainMenu = window.toggleChainMenu;
            console.log('💾 Función original toggleChainMenu guardada');
        }

        // Reemplazar con versión modal
        window.toggleChainMenu = function(eventId, buttonElement) {
            console.log('🎯 toggleChainMenu interceptado para:', eventId);
            abrirModalOpcionesChainEvent(eventId);
        };

        console.log('✅ toggleChainMenu interceptado');
    }

    // ============================================
    // LISTENER DE ESC
    // ============================================

    function setupEscapeListener() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && MenuModalesChain.activeModal) {
                cerrarModalActivo();
            }
        });
    }

    // ============================================
    // CERRAR AL HACER SCROLL
    // ============================================

    function setupScrollListener() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!MenuModalesChain.activeModal) return;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                cerrarModalActivo();
            }, 100);
        }, { passive: true });
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    function inicializarSistema() {
        if (MenuModalesChain.initialized) {
            console.log('⚠️ Sistema de modales Chain ya inicializado');
            return;
        }

        interceptarToggleChainMenu();
        setupEscapeListener();
        setupScrollListener();
        
        MenuModalesChain.initialized = true;
        console.log('✅ Sistema de menús modales para Chain Events inicializado correctamente');
    }

    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarSistema);
    } else {
        // Si el DOM ya está listo, inicializar con un pequeño delay
        setTimeout(inicializarSistema, 100);
    }

    // Exportar al scope global para debugging
    window.MenuModalesChain = {
        abrir: abrirModalOpcionesChainEvent,
        cerrar: cerrarModalActivo,
        initialized: () => MenuModalesChain.initialized,
        estado: () => MenuModalesChain
    };

    console.log('✅ menus_modales_chain.js cargado');

})();