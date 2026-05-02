/**
 * THEME FORCE FIX - ChainFeed
 * Fix permanente para elementos problemáticos en modo light
 * Cargar DESPUÉS de temas.js
 */

(function() {
    'use strict';
    
    console.log('🔧 Theme Force Fix cargado');
    
    // Elementos problemáticos
    const PROBLEMATIC_SELECTORS = [
        '.chat-title',
        '.search-input',
        '.item',
        '.item-name',
        '.item-subtitle',
        '.status-pending-received',
        '.chat-timestamp',
        '.token-selector-trigger'
    ];
    
    // ==========================================
    // FUNCIÓN PRINCIPAL DE FIX
    // ==========================================
    function forceFixTheme() {
        const theme = localStorage.getItem('chainfeed_theme');
        if (theme !== 'light') return;
        
        const fixes = {
            '.chat-title': (el) => {
                el.style.setProperty('background', 'linear-gradient(135deg, #7c3aed, #db2777)', 'important');
                el.style.setProperty('-webkit-background-clip', 'text', 'important');
                el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
                el.style.setProperty('background-clip', 'text', 'important');
            },
            '.search-input': (el) => {
                el.style.setProperty('background', 'rgb(211, 214, 239)', 'important');
                el.style.setProperty('background-color', 'rgb(211, 214, 239)', 'important');
            },
            '.item': (el) => {
                el.style.setProperty('background', 'rgb(202, 205, 231)', 'important');
                el.style.setProperty('background-color', 'rgb(202, 205, 231)', 'important');
            },
            '.item-name': (el) => {
                el.style.setProperty('color', '#453f75', 'important');
            },
            '.item-subtitle': (el) => {
                el.style.setProperty('color', '#585874', 'important');
            },
            '.status-pending-received': (el) => {
                el.style.setProperty('background', 'rgb(99 102 241 / 61%)', 'important');
                el.style.setProperty('color', '#f4f4f5', 'important');
            },
            '.chat-timestamp': (el) => {
                el.style.setProperty('color', '#666676', 'important');
            },
            '.token-selector-trigger': (el) => {
                // Guardar estado original
                if (!el.dataset.hoverFixed) {
                    el.dataset.hoverFixed = 'true';
                    el.addEventListener('mouseenter', function() {
                        this.style.setProperty('background', 'rgb(141, 145, 201)', 'important');
                    });
                    el.addEventListener('mouseleave', function() {
                        this.style.removeProperty('background');
                    });
                }
            }
        };
        
        let fixed = 0;
        Object.keys(fixes).forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                fixes[selector](el);
                fixed++;
            });
        });
        
        if (fixed > 0) {
            console.log(`✅ ${fixed} elementos problemáticos forzados`);
        }
    }
    
    // ==========================================
    // APLICAR CSS CON ESPECIFICIDAD EXTREMA
    // ==========================================
    function applyCSSFix() {
        const theme = localStorage.getItem('chainfeed_theme');
        if (theme !== 'light') return;
        
        const extremeStyle = document.createElement('style');
        extremeStyle.id = 'extreme-force-style';
        extremeStyle.innerHTML = `
/* Especificidad máxima para elementos problemáticos */
html body.light-theme .chat-title,
html body[data-theme="light"] .chat-title,
body.light-theme .chat-title {
    background: linear-gradient(135deg, #7c3aed, #db2777) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
}

html body.light-theme .search-input,
html body[data-theme="light"] .search-input {
    background: rgb(211, 214, 239) !important;
    background-color: rgb(211, 214, 239) !important;
}

html body.light-theme .item,
html body[data-theme="light"] .item {
    background: rgb(202, 205, 231) !important;
    background-color: rgb(202, 205, 231) !important;
}

html body.light-theme .item-name,
html body[data-theme="light"] .item-name {
    color: #453f75 !important;
}

html body.light-theme .item-subtitle,
html body[data-theme="light"] .item-subtitle {
    color: #585874 !important;
}

html body.light-theme .status-pending-received,
html body[data-theme="light"] .status-pending-received {
    background: rgb(99 102 241 / 61%) !important;
    color: #f4f4f5 !important;
}

html body.light-theme .chat-timestamp,
html body[data-theme="light"] .chat-timestamp {
    color: #666676 !important;
}

html body.light-theme .token-selector-trigger:hover,
html body[data-theme="light"] .token-selector-trigger:hover {
    background: rgb(141, 145, 201) !important;
}
        `;
        
        // Remover estilo anterior si existe
        const oldStyle = document.getElementById('extreme-force-style');
        if (oldStyle) oldStyle.remove();
        
        document.head.appendChild(extremeStyle);
    }
    
    // ==========================================
    // OBSERVADOR DE NUEVOS ELEMENTOS
    // ==========================================
    function startObserver() {
        const observer = new MutationObserver((mutations) => {
            const theme = localStorage.getItem('chainfeed_theme');
            if (theme !== 'light') return;
            
            let needsFix = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;
                    
                    // Verificar si el nuevo nodo coincide con algún selector problemático
                    PROBLEMATIC_SELECTORS.forEach(selector => {
                        if (node.matches && node.matches(selector)) {
                            needsFix = true;
                        }
                        
                        // También verificar hijos
                        if (node.querySelectorAll) {
                            const children = node.querySelectorAll(selector);
                            if (children.length > 0) {
                                needsFix = true;
                            }
                        }
                    });
                });
            });
            
            if (needsFix) {
                setTimeout(forceFixTheme, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Observador de elementos problemáticos activo');
    }
    
    // ==========================================
    // ESCUCHAR CAMBIOS DE TEMA
    // ==========================================
    window.addEventListener('themeChanged', function(e) {
        if (e.detail.theme === 'light') {
            setTimeout(() => {
                applyCSSFix();
                forceFixTheme();
            }, 100);
        } else {
            // Remover el estilo en modo dark
            const extremeStyle = document.getElementById('extreme-force-style');
            if (extremeStyle) extremeStyle.remove();
        }
    });
    
    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    function init() {
        const theme = localStorage.getItem('chainfeed_theme');
        
        if (theme === 'light') {
            // Aplicar CSS primero
            applyCSSFix();
            
            // Luego forzar inline
            setTimeout(forceFixTheme, 200);
            
            // Y nuevamente después de un delay (por si hay carga dinámica)
            setTimeout(forceFixTheme, 1000);
        }
        
        // Iniciar observador
        startObserver();
    }
    
    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ==========================================
    // API PÚBLICA
    // ==========================================
    window.themeForceFix = {
        apply: forceFixTheme,
        applyCSSFix: applyCSSFix
    };
    
    console.log('✅ Theme Force Fix inicializado');
    console.log('💡 Ejecuta window.themeForceFix.apply() para aplicar manualmente');
    
})();