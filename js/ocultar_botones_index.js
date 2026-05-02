/**
 * Sistema de alternancia entre selector de idioma y botón CTA en navbar
 * Comportamiento: Después de 1 segundo de scroll, cambia de selector a botón
 * Es reversible: al volver al top, vuelve a aparecer el selector
 */

(function() {
    'use strict';

    // Prevenir múltiples instancias
    if (window.__navbarToggleInitialized) {
        console.warn('⚠️ Sistema de alternancia navbar ya inicializado, evitando duplicado');
        return;
    }
    window.__navbarToggleInitialized = true;

    // Elementos del DOM
    let languageSelector = null;
    let navCta = null;
    
    // Estado
    let scrollTimer = null;
    let isAtTop = true;
    let isTransitioning = false;

    /**
     * Verifica si el usuario está en el top de la página
     */
    function checkIfAtTop() {
        return window.scrollY < 100;
    }

    /**
     * Muestra el selector de idioma con animación
     */
    function showLanguageSelector() {
        if (!languageSelector || !navCta || isTransitioning) return;
        
        isTransitioning = true;
        console.log('🌐 Mostrando selector de idioma');

        // Ocultar botón CTA
        navCta.style.transform = 'translateX(20px)';
        navCta.style.opacity = '0';
        navCta.style.pointerEvents = 'none';
        
        setTimeout(() => {
            navCta.style.display = 'none';
            
            // Mostrar selector de idioma
            languageSelector.style.display = 'flex';
            languageSelector.style.pointerEvents = 'auto';
            
            setTimeout(() => {
                languageSelector.style.transform = 'translateX(0)';
                languageSelector.style.opacity = '1';
                isTransitioning = false;
            }, 10);
        }, 300);
    }

    /**
     * Muestra el botón CTA con animación
     */
    function showNavCta() {
        if (!languageSelector || !navCta || isTransitioning) return;
        
        isTransitioning = true;
        console.log('🔘 Mostrando botón CTA');

        // Ocultar selector de idioma
        languageSelector.style.transform = 'translateX(-20px)';
        languageSelector.style.opacity = '0';
        languageSelector.style.pointerEvents = 'none';
        
        setTimeout(() => {
            languageSelector.style.display = 'none';
            
            // Mostrar botón CTA
            navCta.style.display = 'block';
            navCta.style.pointerEvents = 'auto';
            
            setTimeout(() => {
                navCta.style.transform = 'translateX(0)';
                navCta.style.opacity = '1';
                isTransitioning = false;
            }, 10);
        }, 300);
    }

    /**
     * Maneja el evento de scroll
     */
    function handleScroll() {
        if (isTransitioning) return;
        
        const currentlyAtTop = checkIfAtTop();

        // Si volvió al top y antes no estaba
        if (currentlyAtTop && !isAtTop) {
            console.log('⬆️ Usuario volvió al top');
            isAtTop = true;
            
            // Cancelar timer si existe
            if (scrollTimer) {
                clearTimeout(scrollTimer);
                scrollTimer = null;
            }
            
            // Mostrar selector inmediatamente
            showLanguageSelector();
            
        } 
        // Si hizo scroll fuera del top
        else if (!currentlyAtTop && isAtTop) {
            console.log('⬇️ Usuario hizo scroll hacia abajo');
            isAtTop = false;
            
            // Cancelar timer anterior si existe
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            
            // Iniciar timer de 1 segundo
            scrollTimer = setTimeout(() => {
                if (!checkIfAtTop()) {
                    console.log('⏱️ Timer completado - cambiando a botón CTA');
                    showNavCta();
                }
            }, 1000);
        }
    }

    /**
     * Inicializa el sistema
     */
    function init() {
        // Buscar elementos
        languageSelector = document.getElementById('language-selector');
        navCta = document.querySelector('.nav-cta');

        if (!languageSelector || !navCta) {
            console.warn('⚠️ No se encontraron los elementos, reintentando en 100ms...');
            setTimeout(init, 100);
            return;
        }

        console.log('✅ ocultar_botones_index.js - Elementos encontrados');

        // Verificar estado inicial de scroll
        const startAtTop = checkIfAtTop();

        // Configurar estilos iniciales
        if (startAtTop) {
            console.log('📍 Iniciando en el top - mostrando selector');
            
            languageSelector.style.cssText = `
                transition: transform 0.4s ease, opacity 0.4s ease;
                transform: translateX(0);
                opacity: 1;
                display: flex !important;
                pointer-events: auto;
            `;

            navCta.style.cssText = `
                transition: transform 0.4s ease, opacity 0.4s ease;
                transform: translateX(20px);
                opacity: 0;
                display: none !important;
                pointer-events: none;
            `;
        } else {
            console.log('📍 Iniciando scrolleado - mostrando botón CTA');
            isAtTop = false;
            
            languageSelector.style.cssText = `
                transition: transform 0.4s ease, opacity 0.4s ease;
                transform: translateX(-20px);
                opacity: 0;
                display: none !important;
                pointer-events: none;
            `;

            navCta.style.cssText = `
                transition: transform 0.4s ease, opacity 0.4s ease;
                transform: translateX(0);
                opacity: 1;
                display: block !important;
                pointer-events: auto;
            `;
        }

        // Agregar listener de scroll con throttle
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        console.log('✅ ocultar_botones_index.js - Sistema inicializado correctamente');
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();