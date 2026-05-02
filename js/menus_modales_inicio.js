// ============================================
// SISTEMA DE MENÚS MODALES PARA POSTS EN INICIO
// menus_modales_inicio.js - VERSIÓN COMPLETA Y CORREGIDA
// ============================================

(function() {
    'use strict';

    console.log('🎨 Cargando sistema de modales para posts en inicio...');

    // ============================================
    // CONFIGURACIÓN Y ESTADO
    // ============================================

    const MenuModalesInicio = {
        activeModal: null,
        originalFunctions: {},
        initialized: false
    };

    // ============================================
    // VERIFICAR ESTADO ACTUAL DEL POST
    // ============================================

   function obtenerEstadoActualPost(postId) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (!postElement) return null;
    
    // ✅ PRIORIZAR data-attribute (más confiable)
    const dataPrivate = postElement.getAttribute('data-is-private') === 'true';
    const privacyBadge = postElement.querySelector('.post-privacy-badge');
    
    // Si tiene data-attribute, usarlo; sino usar badge
    const esPrivada = dataPrivate || (privacyBadge !== null);
    
    // ✅ DETECTAR VENTA: Buscar .sale-indicator O .sale-price-btn O verificar en MarketSystem
    let enVenta = false;
    
    // Método 1: Buscar indicadores visuales en el HTML
    const saleIndicator = postElement.querySelector('.sale-indicator');
    const salePriceBtn = postElement.querySelector('.sale-price-btn');
    
    if (saleIndicator || salePriceBtn) {
        enVenta = true;
    }
    
    // Método 2: Verificar en MarketSystem.posts (para posts del Market)
    if (!enVenta && window.MarketSystem?.posts) {
        const numericId = postId.toString().replace('post-', '');
        const marketPost = MarketSystem.posts.find(p => String(p.id) === String(numericId));
        if (marketPost) {
            enVenta = marketPost.en_venta === 1 || marketPost.en_venta === true;
        }
    }
    
    // Método 3: Verificar en FeedState.posts (para posts del feed principal)
    if (!enVenta && window.FeedState?.posts) {
        const numericId = postId.toString().replace('post-', '');
        const feedPost = FeedState.posts.find(p => String(p.id) === String(numericId));
        if (feedPost) {
            enVenta = feedPost.en_venta === 1 || feedPost.en_venta === true;
        }
    }
    
    console.log('🔍 Detección de privacidad y venta:', {
        postId,
        dataPrivate,
        hasBadge: !!privacyBadge,
        resultado_privada: esPrivada,
        saleIndicator: !!saleIndicator,
        salePriceBtn: !!salePriceBtn,
        resultado_venta: enVenta
    });
    
    return {
        esPrivada: esPrivada,
        enVenta: enVenta,
        promocionado: postElement.querySelector('.promoted-badge-inline') !== null
    };
}

    // ============================================
    // FUNCIÓN PRINCIPAL: ABRIR MODAL DE POST
    // ============================================

    function abrirModalOpcionesPost(postId) {
        console.log('📱 Abriendo modal para post:', postId);
        
        // Cerrar cualquier modal activo
        cerrarModalActivo();

        // Obtener elemento del post
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);

        if (!postElement) {
            console.error('❌ Post no encontrado:', postId);
            return;
        }

        // ✅ USAR HELPER PARA OBTENER ESTADO ACTUAL
        const estadoActual = obtenerEstadoActualPost(postId);
        if (!estadoActual) {
            console.error('❌ No se pudo obtener estado del post');
            return;
        }

        const isOwner = esUsuarioPropietario(postElement);
        
        console.log('🔍 Estado actual del post:', {
            postId,
            isOwner,
            ...estadoActual
        });

        // Crear modal con estado ACTUALIZADO
        const modal = crearModalOpciones(
            postId, 
            isOwner, 
            estadoActual.enVenta, 
            estadoActual.promocionado, 
            estadoActual.esPrivada
        );
        
        document.body.appendChild(modal);
        MenuModalesInicio.activeModal = modal;

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
    // CREAR MODAL DE OPCIONES
    // ============================================

    function crearModalOpciones(postId, isOwner, isForSale, isPromoted, esPrivada) {
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

        // Contenedor de opciones
        const optionsContainer = document.createElement('div');
        optionsContainer.style.cssText = `
            padding: 8px 0 12px;
        `;

        const opciones = isOwner 
            ? generarOpcionesPropietario(postId, isForSale, isPromoted, esPrivada)
            : generarOpcionesNoPropiertario(postId, isForSale);

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
    // GENERAR OPCIONES PARA PROPIETARIO
    // ============================================

    function generarOpcionesPropietario(postId, isForSale, isPromoted, esPrivada) {
        const opciones = [];

        // PROMOCIONAR
        if (!isPromoted) {
            opciones.push({
                icono: '📢',
                texto: 'Promover contenido',
                color: '#f59e0b',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof promotePostInicio === 'function') {
                        setTimeout(() => promotePostInicio(postId), 100);
                    } else {
                        console.error('❌ promotePostInicio no disponible');
                        if (typeof showNotification === 'function') {
                            showNotification('Sistema de promoción no disponible', 'error');
                        }
                    }
                }
            });
        }

        // CAMBIAR PRIVACIDAD - VERSIÓN CORREGIDA
        opciones.push({
            icono: esPrivada ? '🌍' : '🔒',
            texto: esPrivada ? 'Hacer público' : 'Hacer privado',
            color: '#8b5cf6',
            accion: async () => {
                cerrarModalActivo();
                
                if (typeof togglePostPrivacy === 'function') {
                    // Pasar el estado ACTUAL (invertido de lo que queremos)
                    // Si esPrivada=true → isCurrentlyPublic=false
                    await togglePostPrivacy(postId, !esPrivada);
                                        
                } else {
                    console.error('❌ togglePostPrivacy no disponible');
                    if (typeof showNotification === 'function') {
                        showNotification('Sistema de privacidad no disponible', 'error');
                    }
                }
            }
        });

        // PONER EN VENTA / CANCELAR VENTA
        opciones.push({
            icono: isForSale ? '❌' : '💰',
            texto: isForSale ? 'Cancelar Venta' : 'Poner en Venta',
            color: '#f59e0b',
            accion: () => {
                cerrarModalActivo();
                if (isForSale && typeof cancelSale === 'function') {
                    cancelSale(postId);
                } else if (!isForSale && typeof sellPost === 'function') {
                    sellPost(postId);
                } else {
                    console.error('❌ Funciones de venta no disponibles');
                    if (typeof showNotification === 'function') {
                        showNotification('Sistema de ventas no disponible', 'error');
                    }
                }
            }
        });

        // ELIMINAR
        opciones.push({
            icono: '🗑️',
            texto: 'Eliminar',
            color: '#ef4444',
            accion: () => {
                cerrarModalActivo();
                if (typeof deletePost === 'function') {
                    deletePost(postId);
                } else {
                    console.error('❌ deletePost no disponible');
                    if (typeof showNotification === 'function') {
                        showNotification('Sistema de eliminación no disponible', 'error');
                    }
                }
            }
        });

        return opciones;
    }

    // ============================================
    // GENERAR OPCIONES PARA NO PROPIETARIO
    // ============================================

    function generarOpcionesNoPropiertario(postId, isForSale) {
        const opciones = [];

        // COMPRAR
        if (isForSale) {
            opciones.push({
                icono: '🛒',
                texto: 'Comprar Publicación',
                color: '#10b981',
                accion: () => {
                    cerrarModalActivo();
                    if (typeof buyPost === 'function') {
                        buyPost(postId);
                    } else {
                        console.error('❌ buyPost no disponible');
                        if (typeof showNotification === 'function') {
                            showNotification('Sistema de compra no disponible', 'error');
                        }
                    }
                }
            });
        }

        // OCULTAR
        opciones.push({
            icono: '👁️‍🗨️',
            texto: 'Ocultar',
            color: '#71717a',
            accion: () => {
                cerrarModalActivo();
                if (typeof hidePost === 'function') {
                    hidePost(postId);
                } else {
                    console.error('❌ hidePost no disponible');
                    if (typeof showNotification === 'function') {
                        showNotification('Sistema de ocultación no disponible', 'error');
                    }
                }
            }
        });

// REPORTAR
opciones.push({
    icono: '⚠️',
    texto: 'Reportar',
    color: '#ef4444',
    accion: () => {
        cerrarModalActivo();
        if (typeof reportPost === 'function') {
            reportPost(postId);
        } else {
            console.error('❌ reportPost no disponible');
            if (typeof showNotification === 'function') {
                showNotification('Sistema de reportes no disponible', 'error');
            }
        }
    }
});

        return opciones;
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

    function esUsuarioPropietario(postElement) {
    if (!postElement || !window.CHAINFEED_CONFIG?.currentUser) {
        return false;
    }

    try {
        const currentUsername = window.CHAINFEED_CONFIG.currentUser.username || window.CHAINFEED_CONFIG.currentUser;
        const currentUserId = window.CHAINFEED_CONFIG.currentUser.id;
        
        // MÉTODO 1: Buscar en .post-meta (donde está @username) - PARA FEED PRINCIPAL
        const postMeta = postElement.querySelector('.post-meta');
        if (postMeta) {
            const metaText = postMeta.textContent;
            const usernameMatch = metaText.match(/@(\w+)/);
            if (usernameMatch) {
                const postUsername = usernameMatch[1];
                if (postUsername.toLowerCase() === String(currentUsername).toLowerCase()) {
                    return true;
                }
            }
        }
        
        // MÉTODO 2: Buscar en .profile-link (PARA MARKET Y OTROS CONTEXTOS)
        const profileLinks = postElement.querySelectorAll('.profile-link');
        for (const link of profileLinks) {
            const linkText = link.textContent.trim();
            // Si el link contiene @username
            if (linkText.startsWith('@')) {
                const username = linkText.substring(1); // Quitar el @
                if (username.toLowerCase() === String(currentUsername).toLowerCase()) {
                    console.log('✅ Propietario detectado por profile-link:', username);
                    return true;
                }
            }
        }
        
        // MÉTODO 3: Buscar en data-attributes
        const dataUsername = postElement.getAttribute('data-username');
        const dataUserId = postElement.getAttribute('data-user-id');
        
        if (dataUsername && dataUsername.toLowerCase() === String(currentUsername).toLowerCase()) {
            console.log('✅ Propietario detectado por data-username');
            return true;
        }
        
        if (dataUserId && String(dataUserId) === String(currentUserId)) {
            console.log('✅ Propietario detectado por data-user-id');
            return true;
        }
        
        // MÉTODO 4: Buscar en FeedState.posts (datos de la API) - SOLO FEED PRINCIPAL
        if (window.FeedState?.posts) {
            const postId = postElement.dataset.postId?.replace('post-', '');
            const post = FeedState.posts.find(p => String(p.id) === String(postId));
            
            if (post) {
                return (
                    (post.username && String(post.username).toLowerCase() === String(currentUsername).toLowerCase()) ||
                    (post.usuario_id && String(post.usuario_id) === String(currentUserId))
                );
            }
        }
        
        // MÉTODO 5: Buscar en MarketSystem.posts - PARA MARKET
        if (window.MarketSystem?.posts) {
            const postId = postElement.dataset.postId?.replace('post-', '');
            const post = MarketSystem.posts.find(p => String(p.id) === String(postId));
            
            if (post) {
                const isOwner = (
                    (post.username && String(post.username).toLowerCase() === String(currentUsername).toLowerCase()) ||
                    (post.usuario_id && String(post.usuario_id) === String(currentUserId))
                );
                
                if (isOwner) {
                    console.log('✅ Propietario detectado por MarketSystem.posts');
                }
                
                return isOwner;
            }
        }
        
        return false;
        
    } catch (error) {
        console.error('Error verificando propietario:', error);
        return false;
    }
}

    function cerrarModalActivo() {
        if (!MenuModalesInicio.activeModal) return;

        const modal = MenuModalesInicio.activeModal;
        const content = modal.querySelector('.modal-opciones-content');
        
        if (content) {
            content.style.transform = 'translateY(100%)';
        }
        
        modal.style.opacity = '0';

        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            MenuModalesInicio.activeModal = null;
        }, 250);
    }

    // ============================================
    // LISTENER DE ESC
    // ============================================

    function setupEscapeListener() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && MenuModalesInicio.activeModal) {
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
            if (!MenuModalesInicio.activeModal) return;
            
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
        if (MenuModalesInicio.initialized) {
            console.log('⚠️ Sistema de modales ya inicializado');
            return;
        }

        setupEscapeListener();
        setupScrollListener();
        
        MenuModalesInicio.initialized = true;
        console.log('✅ Sistema de menús modales para posts inicializado correctamente');
    }

    // ============================================
    // EXPORTAR AL SCOPE GLOBAL - CRÍTICO
    // ============================================

    window.MenuModalesInicio = {
        abrir: abrirModalOpcionesPost,
        cerrar: cerrarModalActivo,
        initialized: () => MenuModalesInicio.initialized,
        estado: () => MenuModalesInicio
    };

    // ✅ TAMBIÉN EXPORTAR LA FUNCIÓN DIRECTAMENTE
    window.abrirModalOpcionesPost = abrirModalOpcionesPost;

    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarSistema);
    } else {
        setTimeout(inicializarSistema, 100);
    }

    console.log('✅ menus_modales_inicio.js cargado y exportado');

})();