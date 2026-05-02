/**
 * CONTROL DE ACCESO - VERSIÓN MEJORADA CON DISEÑO PROFESIONAL
 * Solo permite usuarios con ID 1, 2, 3, 4, 5
 * Diseño coherente con el estilo de ChainFeed
 */

// Configuración
const ALLOWED_IDS = [60, 61, 62, 63, 64, 65, 81];

// Log inicial
console.log('🔒 CONTROL DE ACCESO v7.0 CARGADO');
console.log('📍 URL actual:', window.location.href);
console.log('📁 Pathname:', window.location.pathname);
console.log('🔑 IDs permitidos:', ALLOWED_IDS);

/**
 * Verificar si estamos en página que NO requiere verificación
 */
function isAuthenticationPage() {
    const path = window.location.pathname.toLowerCase();
    
    const exemptPaths = ['/acceso-restringido', '/login', '/register'];
    
    console.log('📄 Verificando páginas de autenticación...');
    console.log('📄 Path actual:', path);
    
    for (let exemptPath of exemptPaths) {
        if (path.includes(exemptPath)) {
            console.log('✅ Página de AUTENTICACIÓN:', exemptPath);
            return true;
        }
    }
    
    const userData = localStorage.getItem('chainfeed_user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const userId = parseInt(user.id);
            
            if (ALLOWED_IDS.includes(userId)) {
                console.log('✅ USUARIO AUTORIZADO - Permitiendo acceso a:', path);
                return true;
            }
        } catch (error) {
            console.log('❌ Error parseando usuario:', error);
        }
    }
    
    if (path === '/' || path === '') {
        if (userData) {
            console.log('🏠 Página principal CON usuario logueado - REQUIERE verificación');
            return false;
        } else {
            console.log('🏠 Página principal SIN usuario - NO requiere verificación');
            return true;
        }
    }
    
    console.log('❌ Página REQUIERE verificación');
    return false;
}

/**
 * Diagnóstico completo del usuario
 */
function fullDiagnostic() {
    console.log('\n=== DIAGNÓSTICO COMPLETO ===');
    
    const userData = localStorage.getItem('chainfeed_user');
    console.log('📱 chainfeed_user:', userData);
    
    if (!userData) {
        console.log('❌ NO HAY DATOS DE USUARIO');
        return 'NO_USER_DATA';
    }

    let user;
    try {
        user = JSON.parse(userData);
        console.log('👤 Usuario parseado completo:', user);
    } catch (error) {
        console.log('❌ ERROR PARSEANDO:', error);
        return 'PARSE_ERROR';
    }
    
    const userId = parseInt(user.id);
    console.log('🆔 ID extraído:', userId, '(tipo:', typeof userId, ')');
    
    if (isNaN(userId)) {
        console.log('❌ ID INVÁLIDO');
        return 'INVALID_ID';
    }
    
    const isAllowed = ALLOWED_IDS.includes(userId);
    console.log('🔑 ¿ID permitido?:', isAllowed);
    
    if (isAllowed) {
        console.log('✅ USUARIO AUTORIZADO');
        return 'AUTHORIZED';
    } else {
        console.log('🚫 USUARIO NO AUTORIZADO');
        return { status: 'UNAUTHORIZED', userId: userId };
    }
}

/**
 * ✨ Mostrar overlay moderno profesional siguiendo el estilo de ChainFeed
 */
function showModernAccessOverlay() {
    console.log('🎨 Creando overlay moderno estilo ChainFeed');
    
    // Crear estilos
    const styles = document.createElement('style');
    styles.textContent = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes logoGlow {
            0%, 100% { filter: brightness(1) drop-shadow(0 0 10px rgba(99, 102, 241, 0.5)); }
            50% { filter: brightness(1.3) drop-shadow(0 0 20px rgba(99, 102, 241, 0.8)); }
        }
    `;
    document.head.appendChild(styles);
    
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'chainfeed-access-overlay';
    overlay.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: #0f0f14 !important;
        z-index: 999999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        opacity: 0 !important;
        transition: opacity 0.5s ease !important;
    `;
    
    overlay.innerHTML = `
        <!-- Fondo animado -->
        <div style="
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #c471f5 75%, #667eea 100%);
            background-size: 400% 400%;
            animation: gradientShift 20s ease infinite;
            opacity: 0.05;
        "></div>
        
        <!-- Contenedor principal -->
        <div style="
            background: rgba(26, 26, 36, 0.5);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            padding: 60px 50px;
            max-width: 650px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            text-align: center;
            animation: fadeInUp 0.6s ease;
        ">
            <!-- Logo -->
            <div style="
                font-size: 5rem;
                margin-bottom: 30px;
                animation: float 3s ease-in-out infinite;
                filter: drop-shadow(0 10px 30px rgba(99, 102, 241, 0.4));
            ">⚡</div>
            
            <!-- Título -->
            <h1 style="
                font-size: 2.8rem;
                font-weight: 800;
                margin: 0 0 20px 0;
                background: linear-gradient(135deg, #6366f1, #ec4899);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: logoGlow 3s ease-in-out infinite;
            ">ChainFeed</h1>
            
            <!-- Subtítulo -->
            <h2 style="
                font-size: 1.8rem;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.9);
                margin: 0 0 15px 0;
            ">Próximamente Disponible</h2>
            
            <!-- Mensaje -->
            <p style="
                font-size: 1.15rem;
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.7;
                margin: 0 0 40px 0;
                max-width: 500px;
                margin-left: auto;
                margin-right: auto;
            ">
                Estamos trabajando arduamente para ofrecerte<br>
                la mejor experiencia en redes sociales descentralizadas.
            </p>
            
            <!-- Features badges -->
            <div style="
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-bottom: 40px;
                flex-wrap: wrap;
            ">
                <div style="
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                ">
                    <span style="font-size: 1.1rem;">✨</span>
                    <span>Nueva interfaz</span>
                </div>
                <div style="
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                ">
                    <span style="font-size: 1.1rem;">⚡</span>
                    <span>Más rápido</span>
                </div>
                <div style="
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                ">
                    <span style="font-size: 1.1rem;">🔒</span>
                    <span>Más seguro</span>
                </div>
            </div>
            
            <!-- Progress indicator -->
            <div style="
                background: rgba(37, 37, 50, 0.5);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px 30px;
                display: inline-flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 30px;
            ">
                <div style="
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(99, 102, 241, 0.3);
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <span style="
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 600;
                ">Redirigiendo en <span id="countdown" style="color: #6366f1;">5</span> segundos...</span>
            </div>
            
            <!-- Footer -->
            <div style="
                margin-top: 30px;
                padding-top: 30px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.5);
            ">
                <p style="margin: 0;">ChainFeed © 2025 - El futuro de las redes sociales</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Fade in
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Countdown
    let seconds = 5;
    const countdownElement = overlay.querySelector('#countdown');
    
    const countdownInterval = setInterval(() => {
        seconds--;
        if (countdownElement) {
            countdownElement.textContent = seconds;
        }
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
    
    // Redirigir después de 5 segundos
    setTimeout(() => {
        console.log('🔄 Redirigiendo a página principal');
        window.location.replace('https://chainfeed.space');
    }, 5000);
}

/**
 * Bloquear usuario o redirigir
 */
function blockUser(userId, reason = 'UNAUTHORIZED') {
    console.log('🚨 EJECUTANDO BLOQUEO/REDIRECCIÓN');
    console.log('🚫 Razón:', reason);
    console.log('🚫 Usuario ID:', userId);
    
    // Limpiar sesión si es usuario no autorizado
    if (reason === 'UNAUTHORIZED') {
        localStorage.removeItem('chainfeed_user');
        localStorage.removeItem('chainfeed_session');
    }
    
    // Mostrar overlay moderno (mismo para todos los casos)
    showModernAccessOverlay();
}

/**
 * Función principal de verificación
 */
function executeAccessControl() {
    console.log('\n🔥 === EJECUTANDO CONTROL DE ACCESO === 🔥');
    
    if (isAuthenticationPage()) {
        console.log('🏠 SALTANDO verificación - página de autenticación');
        return;
    }
    
    console.log('🔍 PROCEDIENDO con verificación...');
    
    const result = fullDiagnostic();
    
    console.log('📊 RESULTADO:', result);
    
    if (typeof result === 'object' && result.status === 'UNAUTHORIZED') {
        console.log('🚨 USUARIO NO AUTORIZADO');
        blockUser(result.userId, 'UNAUTHORIZED');
    } else if (result === 'NO_USER_DATA') {
        console.log('🔐 Usuario NO LOGUEADO');
        blockUser(null, 'NO_USER_DATA');
    } else if (result === 'AUTHORIZED') {
        console.log('✅ Usuario autorizado - permitiendo acceso');
    } else {
        console.log('⚠️ Resultado inesperado:', result);
        blockUser(null, 'UNEXPECTED');
    }
}

// ============================================
// EJECUCIÓN PRINCIPAL
// ============================================

console.log('\n🚀 INICIANDO CONTROL DE ACCESO...');

executeAccessControl();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('\n📄 DOM LISTO - Reejecutando...');
        executeAccessControl();
    });
}

setTimeout(() => {
    console.log('\n⏰ TIMEOUT 500ms - Reejecutando...');
    executeAccessControl();
}, 500);

setInterval(() => {
    console.log('\n🔄 VERIFICACIÓN PERIÓDICA...');
    executeAccessControl();
}, 10000);

window.addEventListener('focus', () => {
    console.log('\n👁️ VENTANA ENFOCADA - Verificando...');
    executeAccessControl();
});

// ============================================
// FUNCIONES GLOBALES PARA DEBUG
// ============================================

window.testAccess = function() {
    console.log('\n🧪 TEST MANUAL EJECUTADO');
    executeAccessControl();
};

window.forceBlock = function(testId = 999) {
    console.log('\n🧪 FORZANDO BLOQUEO CON ID:', testId);
    blockUser(testId);
};

window.checkUser = function() {
    console.log('\n👤 INFORMACIÓN DEL USUARIO:');
    const userData = localStorage.getItem('chainfeed_user');
    if (userData) {
        const user = JSON.parse(userData);
        console.log('ID:', user.id);
        console.log('Username:', user.username);
        console.log('¿Permitido?:', ALLOWED_IDS.includes(parseInt(user.id)));
    } else {
        console.log('No hay usuario');
    }
};

console.log('\n✅ CONTROL DE ACCESO v7.0 INICIALIZADO');
console.log('🔧 Comandos de debug:');
console.log('   window.testAccess() - Ejecutar verificación manual');
console.log('   window.forceBlock() - Forzar bloqueo para testing');
console.log('   window.checkUser() - Ver info del usuario actual');