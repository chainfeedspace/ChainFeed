/**
 * ============================================
 * SISTEMA DE BADGES PROMOCIONADOS PARA CHAIN EVENTS
 * Archivo: /js/promocion-inicio-chain.js
 * ============================================
 */

(function() {
    'use strict';
    
    console.log('🚀 Iniciando sistema de badges promocionados para Chain Events...');
    
    /**
     * ============================================
     * INYECTAR ESTILOS CSS
     * ============================================
     */
    function injectPromotionStylesChain() {
        if (document.getElementById('promotion-styles-chain')) {
            console.log('⚠️ Estilos ya inyectados, saltando...');
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'promotion-styles-chain';
        style.textContent = `.chain-promoted-badge {
    background: rgba(99, 102, 241, 0.1);
    color: #b6b7bf;
    border-radius: 20px;
    width: 10rem;
    padding: 0.1rem 0.2rem;
    margin: 0.2rem;
            }
            
            @keyframes chainPromotedPulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: 0 6px 16px rgba(255, 215, 0, 0.6);
                }
            }
            
            /* ============================================
               MENÚ DE TRES PUNTOS MEJORADO
               ============================================ */
            
            .chain-event-card {
                position: relative;
                overflow: visible !important;
            }
            
            .chain-menu-container {
                position: absolute;
                top: 1rem;
                right: 1rem;
                z-index: 100;
            }
            
            .chain-menu-btn {
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
                outline: none;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
            }
            
            .chain-menu-btn:hover {
                background: rgba(0, 0, 0, 0.8);
                transform: scale(1.1);
            }
            
            .chain-dropdown {
                position: fixed;
                background: rgba(26, 26, 36, 0.98);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 0.5rem 0;
                min-width: 220px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                z-index: 999999;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px) scale(0.95);
                transition: all 0.3s ease;
            }
            
            .chain-dropdown:not(.hidden) {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) scale(1) !important;
            }
            
            .chain-dropdown-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.25rem;
                color: var(--text);
                cursor: pointer;
                border: none;
                background: transparent;
                width: 100%;
                text-align: left;
                font-size: 0.95rem;
                font-family: inherit;
                white-space: nowrap;
                transition: all 0.3s ease;
            }
            
            .chain-dropdown-item:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .chain-dropdown-item.disabled {
                opacity: 0.5;
                cursor: default;
            }
            
            .chain-dropdown-item.disabled:hover {
                background: transparent;
            }
            
            .chain-dropdown-item.danger {
                color: var(--error, #ef4444);
            }
            
            .chain-dropdown-item.danger:hover {
                background: rgba(239, 68, 68, 0.1);
            }
            
            /* Separador */
            .chain-dropdown-divider {
                height: 1px;
                background: rgba(255, 255, 255, 0.1);
                margin: 0.5rem 0;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .chain-promoted-badge {
                    font-size: 0.7rem;
                    padding: 0.3rem 0.6rem;
                }
                
                .chain-dropdown {
                    min-width: 200px;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ Estilos de badges Chain inyectados');
    }
    
    /**
     * ============================================
     * AGREGAR BADGE A EVENTOS PROMOCIONADOS
     * ============================================
     */
    function addPromotedBadgeToEvent(eventCard) {
        // Verificar si ya tiene badge
        if (eventCard.querySelector('.chain-promoted-badge')) {
            return;
        }
        
        // Crear badge
        const badge = document.createElement('div');
        badge.className = 'chain-promoted-badge';
        badge.innerHTML = '<span>🚀</span><span>Promocionado</span>';
        
        // Insertar al inicio del card
        eventCard.insertBefore(badge, eventCard.firstChild);
        
        console.log('✅ Badge promocionado agregado a evento');
    }
    
  
    /**
     * ============================================
     * ASEGURAR QUE TODOS LOS EVENTOS TENGAN MENÚ
     * ============================================
     */
    function ensureAllEventsHaveMenu() {
        console.log('🔍 Verificando menús en eventos Chain...');
        
        const eventCards = document.querySelectorAll('.chain-event-card');
        
        eventCards.forEach(card => {
            const hasMenu = card.querySelector('.chain-menu-container');
            
            if (!hasMenu) {
                console.log('⚠️ Evento sin menú detectado, esto no debería pasar');
                // El menú se crea en renderChainEventCard(), si falta es un error del backend
            }
        });
    }
    
    /**
     * ============================================
     * OBSERVER PARA NUEVOS EVENTOS
     * ============================================
     */
    function setupMutationObserver() {
        const container = document.getElementById('chain-events-container');
        
        if (!container) {
            console.log('⚠️ Contenedor de eventos Chain no encontrado');
            return;
        }
        
        const observer = new MutationObserver((mutations) => {
            let hasNewEvents = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('chain-event-card')) {
                            hasNewEvents = true;
                        } else if (node.querySelector && node.querySelector('.chain-event-card')) {
                            hasNewEvents = true;
                        }
                    }
                });
            });
            
            if (hasNewEvents) {
                console.log('🔄 Nuevos eventos detectados, aplicando badges...');
                setTimeout(() => {
                    ensureAllEventsHaveMenu();
                }, 100);
            }
        });
        
        observer.observe(container, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Observer configurado para detectar nuevos eventos');
    }
    
    /**
     * ============================================
     * INICIALIZACIÓN
     * ============================================
     */
    function initialize() {
        console.log('🚀 Inicializando sistema de badges Chain...');
        
        // 1. Inyectar estilos inmediatamente
        injectPromotionStylesChain();
        
        // 2. Intentar aplicar badges si ya hay eventos
        ensureAllEventsHaveMenu();
        
        // 3. Configurar observer
        setupMutationObserver();
        
        console.log('✅ Sistema de badges Chain inicializado');
    }
    
    /**
     * ============================================
     * EJECUTAR AL CARGAR LA PÁGINA
     * ============================================
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    /**
     * ============================================
     * TAMBIÉN EJECUTAR AL CAMBIAR A TAB CHAIN
     * ============================================
     */
    document.addEventListener('click', function(e) {
        const chainTab = e.target.closest('[data-tab="chain"]');
        if (chainTab) {
            console.log('🔄 Tab Chain clickeado, aplicando badges en 500ms...');
            setTimeout(() => {
                ensureAllEventsHaveMenu();
            }, 500);
        }
    });
    
    // También detectar cambios en el contenedor de Chain
    const checkChainContainer = setInterval(() => {
        const container = document.getElementById('chain-events-container');
        if (container) {
            console.log('✅ Contenedor Chain detectado, configurando observer...');
            clearInterval(checkChainContainer);
            setupMutationObserver();
            
            // Aplicar badges inmediatamente
            setTimeout(() => {
                ensureAllEventsHaveMenu();
            }, 1000);
        }
    }, 1000);
    
    // Detener el interval después de 10 segundos
    setTimeout(() => {
        clearInterval(checkChainContainer);
    }, 10000);
    
    /**
     * ============================================
     * EJECUTAR AL CARGAR LA PÁGINA
     * ============================================
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    /**
     * ============================================
     * EXPONER FUNCIONES GLOBALMENTE PARA DEBUGGING
     * ============================================
     */
    window.ChainPromotionSystem = {
        ensureMenus: ensureAllEventsHaveMenu,
        injectStyles: injectPromotionStylesChain
    };
    
    console.log('✅ Sistema de promoción Chain cargado completamente');
    
})();