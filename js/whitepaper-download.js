// ================================================
// SISTEMA DE DESCARGA DE WHITEPAPER COMPATIBLE CON PWA
// Reemplaza las funciones existentes en index.html
// ================================================

/**
 * Abre el modal de selección de idioma
 */
function openWhitepaperModal() {
    const modal = document.getElementById('whitepaper-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
    }
}

/**
 * Cierra el modal de selección de idioma
 */
function closeWhitepaperModal() {
    const modal = document.getElementById('whitepaper-modal');
    if (modal) {
        modal.classList.remove('active');
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
}

/**
 * Verifica si está en modo PWA (standalone)
 */
function isPWAMode() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

/**
 * Descarga el whitepaper en el idioma seleccionado
 * Compatible con navegador web y PWA instalada
 */
async function downloadWhitepaperLang(lang) {
    console.log(`📄 Descargando whitepaper en ${lang}...`);
    
    const files = {
        'es': {
            url: '/docs/chainfeed.pdf',
            filename: 'ChainFeed_Whitepaper_ES.pdf'
        },
        'en': {
            url: '/docs/chainfeed-en.pdf',
            filename: 'ChainFeed_Whitepaper_EN.pdf'
        }
    };
    
    const file = files[lang];
    
    if (!file) {
        console.error('❌ Idioma no válido:', lang);
        return;
    }
    
    try {
        // Método 1: Intentar descarga directa (funciona en web)
        if (!isPWAMode()) {
            console.log('🌐 Modo web - descarga directa');
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(closeWhitepaperModal, 500);
            return;
        }
        
        // Método 2: Fetch + Blob (funciona en PWA)
        console.log('📱 Modo PWA - descarga con fetch');
        
        const response = await fetch(file.url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        // Crear URL temporal del blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Crear link temporal
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file.filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);
        
        console.log('✅ Descarga iniciada correctamente');
        setTimeout(closeWhitepaperModal, 500);
        
    } catch (error) {
        console.error('❌ Error descargando whitepaper:', error);
        
        // Fallback: Abrir en nueva pestaña
        console.log('🔄 Fallback - abriendo en nueva pestaña');
        window.open(file.url, '_blank');
        
        setTimeout(closeWhitepaperModal, 500);
    }
}

/**
 * Función llamada desde el botón "Ver Whitepaper"
 */
function downloadWhitepaper() {
    openWhitepaperModal();
}

// Cerrar modal al hacer click fuera
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('whitepaper-modal');
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'whitepaper-modal') {
                closeWhitepaperModal();
            }
        });
    }
});

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWhitepaperModal();
    }
});

console.log('✨ Sistema de descarga de Whitepaper cargado (compatible PWA)');