// ============================================
// INTERCEPTOR DE CARGA - NO MODIFICAR CÓDIGO EXISTENTE
// ============================================

(function() {
    'use strict';
    
    // Bandera para saber si ya inicializamos
    let contentRevealed = false;
    
    // Función para mostrar el contenido
    function revealContent() {
        if (contentRevealed) return;
        contentRevealed = true;
        
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (mainContent) {
            mainContent.style.opacity = '1';
        }
        
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 300);
        }
        
        console.log('✅ Contenido revelado');
    }
    
    // Función para ocultar el contenido inicialmente
    function hideContentInitially() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContent = document.getElementById('mainContent');
        
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
        
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.3s ease';
        }
        
        console.log('🔒 Contenido ocultado hasta que JS cargue');
    }
    
    // Interceptar la función initializeProfile original
    const originalInitialize = window.initializeProfile;
    
    window.initializeProfile = async function() {
        try {
            console.log('🚀 Interceptor: initializeProfile llamado');
            
            // Llamar a la función original
            if (originalInitialize) {
                await originalInitialize.apply(this, arguments);
            }
            
            // Revelar contenido después de que termine
            revealContent();
            
        } catch (error) {
            console.error('❌ Error en initializeProfile interceptado:', error);
            
            // Mostrar error en loading screen
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                        <div style="color: var(--error); margin-bottom: 1rem;">Error al cargar el perfil</div>
                        <button onclick="location.reload()" style="
                            background: var(--primary);
                            color: white;
                            border: none;
                            padding: 0.8rem 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 1rem;
                        ">Reintentar</button>
                    </div>
                `;
            }
            
            throw error;
        }
    };
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideContentInitially);
    } else {
        hideContentInitially();
    }
    
    // Fallback: si después de 10 segundos no se revela el contenido, forzar revelación
    setTimeout(() => {
        if (!contentRevealed) {
            console.warn('⚠️ Timeout: forzando revelación de contenido');
            revealContent();
        }
    }, 10000);
    
    console.log('✅ Interceptor de carga instalado');
})();