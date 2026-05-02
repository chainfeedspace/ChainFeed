// ============================================
// SISTEMA UNIVERSAL DE MENÚS DE 3 PUNTOS
// ============================================

(function() {
    'use strict';

    let currentOpenMenu = null;

    /**
     * Toggle del menú - VERSIÓN CON ELEMENTO
     * IMPORTANTE: Ahora recibe el elemento button que se clickeó
     */
    window.togglePostMenu = function(postId, buttonElement) {
        // Si no se pasó buttonElement, intentar obtenerlo del event
        if (!buttonElement) {
            buttonElement = event?.currentTarget || event?.target;
        }
        toggleUniversalMenu(postId, 'post', buttonElement);
    };

    window.toggleChainMenu = function(eventId, buttonElement) {
        if (!buttonElement) {
            buttonElement = event?.currentTarget || event?.target;
        }
        toggleUniversalMenu(eventId, 'chain', buttonElement);
    };

    window.toggleMarketMenu = function(postId, buttonElement) {
        if (!buttonElement) {
            buttonElement = event?.currentTarget || event?.target;
        }
        toggleUniversalMenu(postId, 'market', buttonElement);
    };

    /**
     * Función universal - USA EL BOTÓN CLICKEADO COMO REFERENCIA
     */
    function toggleUniversalMenu(contentId, type, buttonElement) {
        console.log(`🔧 Toggle menu: ${type}-${contentId}`);

        if (!buttonElement) {
            console.error('❌ No se recibió el elemento del botón');
            return;
        }

        // ✅ BUSCAR EL DROPDOWN MÁS CERCANO AL BOTÓN CLICKEADO
        const container = buttonElement.closest('.post-menu-container, .chain-menu-container, .post-actions-top');
        
        if (!container) {
            console.error('❌ No se encontró contenedor de menú');
            return;
        }

        const targetDropdown = container.querySelector('.post-dropdown, .chain-dropdown');

        if (!targetDropdown) {
            console.error('❌ No se encontró dropdown en el contenedor');
            return;
        }

        // Si este menú ya está abierto, cerrarlo
        if (currentOpenMenu === targetDropdown) {
            closeMenu(targetDropdown);
            currentOpenMenu = null;
            return;
        }

        // Cerrar cualquier otro menú abierto
        if (currentOpenMenu) {
            closeMenu(currentOpenMenu);
        }

        // Abrir el nuevo menú
        openMenu(targetDropdown);
        currentOpenMenu = targetDropdown;

        console.log(`✅ Menú abierto: ${type}-${contentId}`);
    }

    /**
     * Abrir menú con estilos inline
     */
    function openMenu(dropdown) {
        dropdown.classList.remove('hidden');
        
        dropdown.style.cssText = `
            position: absolute !important;
            top: 45px !important;
            right: 0 !important;
            background: rgba(26, 26, 36, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            border-radius: 12px !important;
            padding: 0.5rem 0 !important;
            min-width: 220px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6) !important;
            z-index: 999999 !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) scale(1) !important;
            transition: all 0.3s ease !important;
        `;
    }

    /**
     * Cerrar menú
     */
    function closeMenu(dropdown) {
        dropdown.style.cssText = `
            opacity: 0 !important;
            visibility: hidden !important;
            transform: translateY(-10px) scale(0.95) !important;
            transition: all 0.3s ease !important;
        `;
        
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 300);
    }

    /**
     * Cerrar todos los menús
     */
    function closeAllMenus() {
        document.querySelectorAll('.post-dropdown, .chain-dropdown').forEach(dropdown => {
            closeMenu(dropdown);
        });
        currentOpenMenu = null;
    }

    // ============================================
    // EVENT LISTENERS GLOBALES
    // ============================================

    document.addEventListener('click', function(event) {
        if (event.target.closest('.post-menu-btn, .chain-menu-btn')) {
            return;
        }

        if (event.target.closest('.post-dropdown, .chain-dropdown')) {
            return;
        }

        if (currentOpenMenu) {
            closeAllMenus();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && currentOpenMenu) {
            closeAllMenus();
        }
    });

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!currentOpenMenu) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            closeAllMenus();
        }, 150);
    }, true);

    console.log('✅ Sistema universal de menús inicializado');

})();