// ==========================================
// 🚀 INICIALIZACIÓN AUTOMÁTICA DE IDIOMA
// ==========================================

// 🔄 SISTEMA UNIFICADO DE DETECCIÓN DE IDIOMA
async function detectUserLanguage() {
    console.log('🌐 Detectando idioma del usuario...');
    
    // ORDEN DE PRIORIDAD:
    
    // 1. localStorage (preferencia explícita del usuario)
    const storedLang = localStorage.getItem('preferred_language');
    if (storedLang && ['es', 'en'].includes(storedLang)) {
        console.log('✅ Usando idioma de localStorage:', storedLang);
        return storedLang;
    }
    
    // 2. Verificar sesión en el servidor (para usuarios logueados)
    try {
        const response = await fetch('/php/verificar_sesion.php');
        const data = await response.json();
        
        if (data.success && data.user && data.user.language) {
            console.log('✅ Usando idioma del servidor:', data.user.language);
            localStorage.setItem('preferred_language', data.user.language);
            return data.user.language;
        }
    } catch (error) {
        console.log('ℹ️ No se pudo verificar sesión, continuando...');
    }
    
    // 3. Idioma del navegador
    const browserLang = (navigator.language || navigator.userLanguage).split('-')[0];
    if (browserLang && ['es', 'en'].includes(browserLang)) {
        console.log('✅ Usando idioma del navegador:', browserLang);
        localStorage.setItem('preferred_language', browserLang);
        return browserLang;
    }
    
    // 4. Default
    console.log('✅ Usando idioma por defecto: es');
    localStorage.setItem('preferred_language', 'es');
    return 'es';
}

async function initializeLanguage() {
    const userLang = await detectUserLanguage();
    
    console.log('🌐 Idioma final detectado:', userLang);
    
    // 🆕 Aplicar idioma AL DOCUMENTO INMEDIATAMENTE
    document.documentElement.lang = userLang;
    
    // Sincronizar con servidor si es diferente al guardado
    await syncLanguageWithServer(userLang);
    
    // Aplicar traducciones
    if (typeof window.setLanguage === 'function') {
        window.setLanguage(userLang);
    } else {
        console.warn('⚠️ i18n no disponible aún');
        // Se aplicará cuando i18n esté listo via waitForI18n
    }
    
    // Actualizar botones si existen
    updateLanguageButtons();
}

// 🔄 SINCRONIZAR CON SERVIDOR
async function syncLanguageWithServer(lang) {
    try {
        const response = await fetch('/php/save-language.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: lang, sync: true })
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('✅ Idioma sincronizado con servidor');
        }
    } catch (error) {
        console.log('ℹ️ Idioma no sincronizado (sin sesión)');
    }
}

// ==========================================
// 🎛️ FUNCIONES EXISTENTES MODIFICADAS
// ==========================================

// Esperar a que i18n-auto-translate.js esté cargado
function waitForI18n(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkInterval = setInterval(() => {
        attempts++;
        if (typeof window.setLanguage === 'function') {
            clearInterval(checkInterval);
            console.log('✅ i18n-auto-translate.js cargado');
            callback();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.warn('⚠️ Timeout esperando i18n-auto-translate.js, usando fallback');
            callback();
        }
    }, 100);
}

function changeLanguage(lang) {
    console.log('🌐 Cambiando idioma a:', lang);

    // Guardar en localStorage
    localStorage.setItem('preferred_language', lang);
    
    // 🔥 CRÍTICO: Actualizar HTML lang INMEDIATAMENTE
    document.documentElement.lang = lang;

    // 🔥 CRÍTICO: Actualizar usuario en localStorage
    try {
        const savedUser = localStorage.getItem('chainfeed_user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            userData.language = lang;
            localStorage.setItem('chainfeed_user', JSON.stringify(userData));
            console.log('✅ Usuario actualizado en localStorage con idioma:', lang);
        }
    } catch (e) {
        console.error('❌ Error actualizando usuario:', e);
    }

    // Enviar al backend
    fetch('/php/save-language.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Idioma guardado en BD:', data.language);
        }

        // Aplicar traducción
        if (typeof window.setLanguage === 'function') {
            window.setLanguage(lang);
        } else {
            console.warn('⚠️ i18n no disponible, recargando...');
            window.location.reload();
        }

        updateLanguageButtons();
    })
    .catch(err => {
        console.error('❌ Error:', err);
        updateLanguageButtons();
    });
}

function createLanguageSelector() {
    // 🔥 FIX: Usar SIEMPRE localStorage como fuente de verdad
    const currentLang = localStorage.getItem('preferred_language') || 'es';
    
    console.log('🔧 createLanguageSelector - Idioma detectado:', currentLang);
    
    const container = document.createElement('div');
    container.id = 'language-selector-buttons';
    container.style.cssText = `
        display: flex; 
        gap: 8px; 
        align-items: center;
    `;

    // URLs de banderas SVG (FlagCDN) - USAR SVG PARA MEJOR CALIDAD
    const flagES = 'https://flagcdn.com/es.svg';
    const flagEN = 'https://flagcdn.com/gb.svg';

    // Botón Español
    const btnES = document.createElement('button');
    btnES.className = `lang-btn ${currentLang === 'es' ? 'active' : ''}`;
    btnES.setAttribute('data-lang', 'es');
    btnES.title = 'Español';
    btnES.type = 'button';
    btnES.innerHTML = `<img src="${flagES}" alt="ES" width="36" height="36">`;

    // Botón Inglés
    const btnEN = document.createElement('button');
    btnEN.className = `lang-btn ${currentLang === 'en' ? 'active' : ''}`;
    btnEN.setAttribute('data-lang', 'en');
    btnEN.title = 'English';
    btnEN.type = 'button';
    btnEN.innerHTML = `<img src="${flagEN}" alt="EN" width="36" height="36">`;

// Event listeners para cambio de idioma
btnES.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    changeLanguage('es');  // ← Cambiar a changeLanguage
});

btnEN.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    changeLanguage('en');  // ← Cambiar a changeLanguage
});

    container.appendChild(btnES);
    container.appendChild(btnEN);

    return container;
}

// Actualizar estado de los botones de idioma
function updateLanguageButtons() {
    // 🔥 FIX: Usar SIEMPRE localStorage como fuente de verdad
    const currentLang = (localStorage.getItem('preferred_language') || 'es').toLowerCase();
    const buttons = document.querySelectorAll('.lang-btn');
    
    console.log('🔄 updateLanguageButtons - Idioma actual:', currentLang);
    
    if (!buttons.length) {
        console.log('⚠️ No se encontraron botones de idioma');
        return;
    }

    buttons.forEach(btn => {
        const lang = btn.getAttribute('data-lang').toLowerCase();
        if (lang === currentLang) {
            btn.classList.add('active');
            console.log(`✅ Botón ${lang} marcado como activo`);
        } else {
            btn.classList.remove('active');
        }
    });
}

function insertLanguageSelector() {
    const targetDiv = document.getElementById('language-selector');
    if (targetDiv) {
        targetDiv.appendChild(createLanguageSelector());
        console.log('✅ Selector de idioma insertado');
        
        // 🔥 Actualizar botones múltiples veces para asegurar sincronización
        setTimeout(updateLanguageButtons, 100);
        setTimeout(updateLanguageButtons, 300);
        setTimeout(updateLanguageButtons, 500);
    }
}

// ==========================================
// 🚀 INICIALIZACIÓN PRINCIPAL MODIFICADA
// ==========================================

// Observer para cuando se inserten dinámicamente los botones
const observerLangButtons = new MutationObserver(() => {
    const selector = document.querySelector('#language-selector-buttons');
    if (selector && selector.querySelector('.lang-btn')) {
        updateLanguageButtons();
    }
});

observerLangButtons.observe(document.body, { childList: true, subtree: true });

// INICIALIZACIÓN PRINCIPAL - VERSIÓN CORREGIDA
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        // 1. Inicializar idioma automáticamente
        await initializeLanguage();
        
        // 2. Esperar i18n para insertar selector
        waitForI18n(insertLanguageSelector);
    });
} else {
    // Página ya cargada
    (async () => {
        await initializeLanguage();
        waitForI18n(insertLanguageSelector);
    })();
}

// ==========================================
// 🛟 SISTEMA DE RESPALDO PARA TRADUCCIONES
// ==========================================

function applyFallbackTranslations(lang) {
    const translations = {
        'es': {
            'welcome_title': 'Bienvenido a ChainFeed',
            'welcome_description': 'La mejor plataforma de contenido...',
            'login_button': 'Iniciar Sesión',
            'signup_button': 'Registrarse',
            'profile_button': 'Perfil'
        },
        'en': {
            'welcome_title': 'Welcome to ChainFeed',
            'welcome_description': 'The best content platform...',
            'login_button': 'Login',
            'signup_button': 'Sign Up',
            'profile_button': 'Profile'
        }
    };
    
    const texts = translations[lang] || translations['es'];
    
    // Aplicar traducciones manualmente
    Object.keys(texts).forEach(key => {
        const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
        elements.forEach(el => {
            el.textContent = texts[key];
        });
    });
    
    console.log('🔄 Traducciones de respaldo aplicadas:', lang);
}

// ==========================================
// 🐛 FUNCIÓN DEBUG (OPCIONAL)
// ==========================================

function debugLanguage() {
    console.log('🐛 DEBUG IDIOMA:');
    console.log('📍 localStorage:', localStorage.getItem('preferred_language'));
    console.log('📍 HTML lang:', document.documentElement.lang);
    console.log('📍 Navegador:', navigator.language);
    
    // Verificar sesión
    fetch('/php/verificar_sesion.php')
        .then(r => r.json())
        .then(data => {
            console.log('📍 Servidor:', data.user?.language);
        })
        .catch(() => console.log('📍 Servidor: No disponible'));
}

// ==========================================
// 🔍 FUNCIÓN DE VERIFICACIÓN POST-CAMBIO
// ==========================================

function verifyLanguageSync() {
    const localStorage_lang = localStorage.getItem('preferred_language');
    const html_lang = document.documentElement.lang;
    const user_lang = (() => {
        try {
            const user = JSON.parse(localStorage.getItem('chainfeed_user') || '{}');
            return user.language;
        } catch {
            return null;
        }
    })();
    
    console.log('🔍 Verificación de sincronización:');
    console.table({
        'localStorage': localStorage_lang,
        'HTML lang': html_lang,
        'Usuario localStorage': user_lang
    });
    
    if (localStorage_lang !== html_lang) {
        console.error('❌ DESINCRONIZACIÓN: localStorage y HTML lang no coinciden');
        return false;
    }
    
    if (user_lang && user_lang !== localStorage_lang) {
        console.error('❌ DESINCRONIZACIÓN: Usuario localStorage tiene idioma diferente');
        return false;
    }
    
    console.log('✅ Todo sincronizado correctamente');
    return true;
}

// Hacer la función global para poder usarla desde la consola
window.verifyLanguageSync = verifyLanguageSync;

// Escuchar cambios de idioma para re-traducir inmediatamente
window.addEventListener('languageChanged', function(e) {
    const newLang = e.detail.language;
    console.log('🔄 Evento languageChanged detectado:', newLang);
    
    // Forzar re-traducción inmediata
    if (typeof window.retranslate === 'function') {
        setTimeout(() => {
            window.retranslate();
            console.log('✅ Re-traducción forzada completada');
        }, 100);
    }
});

// Exponer changeLanguage globalmente por compatibilidad
window.changeLanguage = changeLanguage;