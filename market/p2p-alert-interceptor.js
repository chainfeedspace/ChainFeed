/**
 * Interceptor de alert/confirm nativos del navegador
 * Redirige a sistema moderno de notificaciones
 */

(function() {
    'use strict';
    
    console.log('🚀 Inicializando interceptor de alert/confirm...');
    
    // Guardar referencias originales
    const _originalAlert = window.alert;
    const _originalConfirm = window.confirm;
    
    // Contador para debug
    let alertCount = 0;
    let confirmCount = 0;
    
    /**
     * Interceptar window.alert()
     */
    window.alert = function(message) {
        alertCount++;
        console.warn(`🚨 alert() #${alertCount} interceptado:`, message);
        console.trace('Llamado desde:');
        
        // Esperar a que p2pNotify esté disponible
        const showModernNotification = () => {
            if (window.p2pNotify) {
                window.p2pNotify.error(String(message), 5000);
            } else {
                console.error('❌ p2pNotify no disponible, usando alert original');
                _originalAlert.call(window, message);
            }
        };
        
        // Si p2pNotify ya existe, usarlo inmediatamente
        if (window.p2pNotify) {
            showModernNotification();
        } else {
            // Si no, esperar un poco
            setTimeout(showModernNotification, 100);
        }
    };
    
    /**
     * Interceptar window.confirm()
     */
    window.confirm = function(message) {
        confirmCount++;
        console.warn(`🚨 confirm() #${confirmCount} interceptado:`, message);
        console.trace('Llamado desde:');
        
        // Mostrar como notificación de advertencia
        if (window.p2pNotify) {
            window.p2pNotify.warning(String(message), 6000);
        } else {
            console.error('❌ p2pNotify no disponible');
        }
        
        // Por seguridad, siempre retornar false
        // Si realmente necesitas confirm, usa window.p2pConfirm.show()
        console.warn('⚠️ confirm() retorna false por defecto. Usa p2pConfirm.show() para diálogos reales.');
        return false;
    };
    
    // Exponer función para restaurar originales (por si acaso)
    window.restoreNativeDialogs = function() {
        window.alert = _originalAlert;
        window.confirm = _originalConfirm;
        console.log('✅ alert/confirm nativos restaurados');
    };
    
    console.log('✅ Interceptor de alert/confirm activado');
    console.log('💡 Para restaurar: window.restoreNativeDialogs()');
    
})();