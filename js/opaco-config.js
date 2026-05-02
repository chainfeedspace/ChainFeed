// ============================================
// SISTEMA DE OVERLAY PARA MENÚ DE CONFIGURACIÓN
// ============================================
(function() {
    'use strict';
    
    console.log('🎨 Inicializando sistema de overlay para menú de configuración');
    
    // Crear overlay
    function crearOverlayConfig() {
        let overlay = document.getElementById('configMenuOverlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'configMenuOverlay';
            overlay.className = 'config-menu-overlay';
            
            // ✅ Insertar al principio del body (antes de todo)
            document.body.insertBefore(overlay, document.body.firstChild);
            
            // Cerrar menú al hacer click en overlay
            overlay.addEventListener('click', () => {
                cerrarMenuConfig();
            });
            
            console.log('✅ Overlay de configuración creado');
        }
        
        return overlay;
    }
    
    // Mostrar overlay
    function mostrarOverlayConfig() {
        const overlay = crearOverlayConfig();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        console.log('👁️ Overlay mostrado');
    }
    
    // Ocultar overlay
    function ocultarOverlayConfig() {
        const overlay = document.getElementById('configMenuOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = ''; // Restaurar scroll
        console.log('👁️ Overlay ocultado');
    }
    
    // Cerrar menú
    function cerrarMenuConfig() {
        const dropdown = document.getElementById('configDropdown');
        const btn = document.getElementById('floatingConfigBtn');
        
        if (dropdown) {
            dropdown.classList.remove('active');
        }
        if (btn) {
            btn.classList.remove('menu-open');
        }
        
        ocultarOverlayConfig();
        console.log('❌ Menú de configuración cerrado');
    }
    
    // Exponer funciones globalmente
    window.mostrarOverlayConfig = mostrarOverlayConfig;
    window.ocultarOverlayConfig = ocultarOverlayConfig;
    window.cerrarMenuConfigConOverlay = cerrarMenuConfig;
    
    console.log('✅ Sistema de overlay inicializado correctamente');
    
})();