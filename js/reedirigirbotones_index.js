/**
 * redirigirbotones_index.js - Sistema de Scroll de Botones Específicos
 * Versión: 3.0.0
 * Maneja el scroll al inicio para botones de secciones
 */

(function() {
    'use strict';
    
    console.log('🔗 Módulo de scroll de botones cargado');
    
    /**
     * Inicializa los scrolls cuando el DOM esté listo
     */
    function initScrollButtons() {
        console.log('🚀 Inicializando scroll de botones...');
        
        setTimeout(() => {
            setupSectionButtons();
        }, 100);
    }
    
    /**
     * Configura los botones de las secciones específicas
     */
    function setupSectionButtons() {
        // 1️⃣ BOTÓN "Descubrir Más" - Primera sección
        const firstSection = document.querySelectorAll('.section-large')[0];
        if (firstSection) {
            const discoverBtn = firstSection.querySelector('.btn-hero-primary');
            if (discoverBtn) {
                setupScrollButton(discoverBtn, '🎯 Scroll al inicio...');
                console.log('✅ Botón "Descubrir Más" configurado (Sección 1)');
            }
        }
        
        // 2️⃣ BOTÓN "Explorar Marketplace" - Segunda sección
        const sections = document.querySelectorAll('.section-large');
        if (sections.length > 1) {
            const secondSection = sections[1];
            const marketplaceBtn = secondSection.querySelector('.btn-hero-primary');
            if (marketplaceBtn) {
                setupScrollButton(marketplaceBtn, '🛒 Scroll al inicio...');
                console.log('✅ Botón "Explorar Marketplace" configurado (Sección 2)');
            }
        }
    }
    
    /**
     * Configura un botón para hacer scroll al inicio
     */
    function setupScrollButton(button, logMessage) {
        if (!button) {
            console.warn('⚠️ Botón no encontrado para configurar');
            return;
        }
        
        // Remover event listeners anteriores clonando el nodo
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Agregar event listener para scroll
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log(logMessage);
            
            // Efecto visual
            newButton.style.transform = 'scale(0.95)';
            newButton.style.opacity = '0.7';
            
            // Scroll suave al inicio
            setTimeout(() => {
                window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
                
                // Restaurar estilos
                setTimeout(() => {
                    newButton.style.transform = '';
                    newButton.style.opacity = '';
                }, 300);
            }, 100);
        }, true);
        
        newButton.setAttribute('data-scroll-configured', 'true');
    }
    
    /**
     * Método alternativo: Buscar por texto del botón
     */
    function setupByButtonText() {
        console.log('🔄 Usando método alternativo: búsqueda por texto...');
        
        const allButtons = document.querySelectorAll('.btn-hero-primary');
        
        allButtons.forEach(btn => {
            const text = btn.textContent.trim().toLowerCase();
            
            if (text.includes('descubrir') || text.includes('discover')) {
                setupScrollButton(btn, '🎯 Scroll al inicio (detectado por texto)...');
                console.log('✅ Botón "Descubrir" configurado por texto');
            }
            
            if (text.includes('explorar') || text.includes('marketplace') || text.includes('explore')) {
                setupScrollButton(btn, '🛒 Scroll al inicio (detectado por texto)...');
                console.log('✅ Botón "Marketplace" configurado por texto');
            }
        });
    }
    
    /**
     * Verificar configuración
     */
    function verifySetup() {
        const configuredButtons = document.querySelectorAll('[data-scroll-configured="true"]');
        console.log(`✅ Total de botones configurados: ${configuredButtons.length}`);
        
        if (configuredButtons.length === 0) {
            console.warn('⚠️ No se configuró ningún botón. Intentando método alternativo...');
            setupByButtonText();
        }
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollButtons();
            setTimeout(verifySetup, 500);
        });
    } else {
        initScrollButtons();
        setTimeout(verifySetup, 500);
    }
    
    window.addEventListener('load', () => {
        console.log('📄 Página completamente cargada. Verificando configuración...');
        verifySetup();
    });
    
    console.log('✨ Sistema de scroll de botones listo');
    
})();