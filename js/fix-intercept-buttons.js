/**
 * fix-intercept-buttons.js
 * Intercepta todos los botones de "Conectate" para abrir el modal en lugar de Web Auth
 */

console.log('🔧 Iniciando interceptor de botones...');

// Esperar a que el DOM esté completamente cargado
function interceptAuthButtons() {
    console.log('🎯 Interceptando botones de autenticación...');
    
    // Selectores de todos los botones que deben abrir el modal
    const selectors = [
        '.nav-cta',
        '.btn-hero-primary',
        '.participate-btn'
    ];
    
    selectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        
        buttons.forEach((btn, index) => {
            const btnText = btn.textContent.toLowerCase().trim();
            
            // Solo interceptar botones con texto relacionado a "conectar" o "participar"
            const shouldIntercept = 
                btnText.includes('conectate') ||
                btnText.includes('connect') ||
                btnText.includes('comenzar') ||
                btnText.includes('start') ||
                btnText.includes('participar') ||
                btnText.includes('participate') ||
                btnText.includes('reclama') ||
                btnText.includes('claim');
            
            if (shouldIntercept) {
                console.log(`✅ Interceptando: ${selector}[${index}] - "${btnText}"`);
                
                // REMOVER el onclick anterior
                btn.onclick = null;
                
                // Prevenir que authenticateWithProton() se ejecute
                btn.removeAttribute('onclick');
                
                // AGREGAR nuevo listener que abre el modal
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('🚀 Click interceptado - Abriendo modal de registro...');
                    
                    // Verificar si openAuthModal existe (del archivo registro_inic_mail.js)
                    if (typeof window.openAuthModal === 'function') {
                        window.openAuthModal();
                    } else if (typeof window.openRegistroModal === 'function') {
                        window.openRegistroModal();
                    } else {
                        console.error('❌ No se encontró función para abrir el modal');
                        console.log('📋 Funciones disponibles:', Object.keys(window).filter(k => k.includes('modal') || k.includes('auth')));
                    }
                }, true); // useCapture = true para ejecutar ANTES que otros listeners
                
                // Marcar como interceptado
                btn.setAttribute('data-intercepted', 'true');
            } else {
                console.log(`⏭️ Ignorando: ${selector}[${index}] - "${btnText}"`);
            }
        });
    });
    
    console.log('✅ Interceptor completado');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', interceptAuthButtons);
} else {
    // Si el DOM ya está listo, ejecutar inmediatamente
    interceptAuthButtons();
}

// También ejecutar después de 500ms por si acaso
setTimeout(interceptAuthButtons, 500);

console.log('✨ Interceptor de botones cargado');