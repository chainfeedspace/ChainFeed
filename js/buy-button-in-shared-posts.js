/**
 * BOTÓN DE COMPRA EN TARJETAS DE POSTS COMPARTIDOS (CHAT)
 * Agrega botón de compra en el footer de publicaciones compartidas en chat
 * Sin modificar archivos existentes
 */

(function() {
    'use strict';
    
    console.log('🛒 Cargando sistema de compra para tarjetas de chat...');

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================
    const CONFIG = {
        checkInterval: 500,
        maxAttempts: 100,
        selectors: {
            sharedPostCard: '.shared-post-card',
            footer: '.shared-post-footer',
            shareIndicator: '.share-indicator'
        }
    };

    // ==========================================
    // PROCESAR TARJETAS DE POSTS COMPARTIDOS
    // ==========================================
    function processSharedPostCards() {
        const cards = document.querySelectorAll(CONFIG.selectors.sharedPostCard);
        
        cards.forEach(card => {
            // Evitar procesar la misma tarjeta dos veces
            if (card.dataset.buyButtonProcessed === 'true') return;
            
            const postId = card.dataset.postId;
            if (!postId) return;
            
            const footer = card.querySelector(CONFIG.selectors.footer);
            if (!footer) return;
            
            // Marcar como procesada
            card.dataset.buyButtonProcessed = 'true';
            
            // Obtener datos de la publicación del atributo data
            const postType = card.dataset.postType;
            
            // Solo procesar si es tipo 'venta'
            if (postType === 'venta') {
                addBuyButtonToFooter(card, footer, postId);
            }
        });
    }

    // ==========================================
    // AGREGAR BOTÓN DE COMPRA AL FOOTER
    // ==========================================
    async function addBuyButtonToFooter(card, footer, postId) {
        try {
            // Obtener estadísticas de la publicación
            const stats = await fetchPostStats(postId);
            
            if (!stats) return;
            
            // Verificar si está en venta
            const enVenta = stats.en_venta === 1 || stats.en_venta === true;
            const precioVenta = stats.precio_venta;
            const autorId = stats.autor?.id;
            const esPropio = autorId === window.currentUserId;
            
            console.log('📊 Stats de post en chat:', {
                postId,
                enVenta,
                precioVenta,
                esPropio,
                autorId,
                currentUserId: window.currentUserId
            });
            
            // Solo mostrar si cumple condiciones
            if (!enVenta || !precioVenta || esPropio || !window.currentUserId) {
                return;
            }
            
            // Limpiar el footer
            footer.innerHTML = '';
            
            // Crear botón de compra
            const buyButton = document.createElement('button');
            buyButton.className = 'chat-buy-button';
            buyButton.dataset.postId = postId;
            buyButton.dataset.precio = precioVenta;
            buyButton.innerHTML = `
                <span class="buy-icon">💰</span>
                <span class="buy-text">Comprar por $${precioVenta} CFT</span>
            `;
            
            // Event listener
            buyButton.addEventListener('click', (e) => {
                e.stopPropagation();
                handlePurchase(postId, precioVenta, buyButton);
            });
            
            // Agregar al footer
            footer.appendChild(buyButton);
            
            console.log('✅ Botón de compra agregado al post', postId);
            
        } catch (error) {
            console.error('❌ Error agregando botón de compra:', error);
        }
    }

    // ==========================================
    // OBTENER ESTADÍSTICAS DE PUBLICACIÓN
    // ==========================================
    async function fetchPostStats(postId) {
        try {
            const response = await fetch(`/php/api_chat.php?accion=obtener_estadisticas_publicacion&publicacion_id=${postId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.publicacion) {
                return data.publicacion;
            }
            
            return null;
            
        } catch (error) {
            console.error('Error obteniendo stats:', error);
            return null;
        }
    }

    // ==========================================
    // MANEJAR COMPRA
    // ==========================================
    async function handlePurchase(postId, precio, button) {
        // Confirmación
        const confirmacion = confirm(
            `¿Confirmas la compra de esta publicación por $${precio} CFT?\n\n` +
            `Se deducirán ${precio} tokens de tu saldo.`
        );
        
        if (!confirmacion) return;
        
        // Estado de loading
        const originalHTML = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="buy-loading">⏳ Comprando...</span>';
        button.classList.add('loading');
        
        try {
            console.log('💰 Iniciando compra desde chat:', { postId, precio });
            
            const response = await fetch('/php/comprar_publicacion.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ publicacion_id: postId })
            });
            
            const data = await response.json();
            console.log('💰 Respuesta:', data);
            
            if (data.success) {
                // Mostrar éxito
                showSuccessNotification(data);
                
                // Actualizar balance
                if (typeof window.updateUserBalance === 'function' && data.nuevo_balance !== undefined) {
                    window.updateUserBalance(data.nuevo_balance);
                }
                
                // Actualizar botón
                button.innerHTML = '<span style="color: #10b981;">✅ Comprado</span>';
                button.style.background = 'rgba(16, 185, 129, 0.2)';
                button.style.cursor = 'not-allowed';
                
                // Recargar feed si existe
                setTimeout(() => {
                    if (window.location.pathname === '/' && typeof loadPosts === 'function') {
                        loadPosts();
                    }
                }, 2000);
                
            } else {
                throw new Error(data.message || 'Error en la compra');
            }
            
        } catch (error) {
            console.error('❌ Error comprando:', error);
            alert(`Error al realizar la compra: ${error.message}`);
            
            // Restaurar botón
            button.innerHTML = originalHTML;
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    // ==========================================
    // NOTIFICACIÓN DE ÉXITO
    // ==========================================
    function showSuccessNotification(data) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 15px;
            z-index: 999999;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem; text-align: center;">✅</div>
            <div style="font-weight: 700; font-size: 1.2rem; margin-bottom: 0.5rem; text-align: center;">¡Compra Exitosa!</div>
            <div style="font-size: 0.95rem; margin-bottom: 0.3rem;">Pagaste: <strong>$${data.precio_pagado} CFT</strong></div>
            <div style="font-size: 0.95rem;">Nuevo saldo: <strong>$${data.nuevo_balance} CFT</strong></div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // INYECTAR ESTILOS CSS
    // ==========================================
    function injectStyles() {
        if (document.getElementById('chat-buy-button-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'chat-buy-button-styles';
        styles.textContent = `
            .chat-buy-button {
                width: 100%;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                border: none;
                color: white;
                padding: 0.8rem 1.2rem;
                border-radius: 10px;
                font-weight: 700;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
            }

            .chat-buy-button:hover:not(:disabled) {
                background: linear-gradient(135deg, #d97706, #b45309);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(245, 158, 11, 0.5);
            }

            .chat-buy-button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none;
            }

            .chat-buy-button.loading {
                opacity: 0.8;
            }

            .buy-icon {
                font-size: 1.2rem;
            }

            .buy-text {
                font-size: 0.95rem;
            }

            .buy-loading {
                font-size: 0.95rem;
                animation: pulse 1.5s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .chat-buy-button {
                    padding: 0.7rem 1rem;
                    font-size: 0.9rem;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // ==========================================
    // OBSERVAR NUEVAS TARJETAS
    // ==========================================
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    processSharedPostCards();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Observer configurado para detectar nuevas tarjetas');
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    function initialize() {
        // Inyectar estilos
        injectStyles();
        
        // Procesar tarjetas existentes
        processSharedPostCards();
        
        // Observar nuevas tarjetas
        setupObserver();
        
        // Re-procesar periódicamente por seguridad
        setInterval(processSharedPostCards, 2000);
        
        console.log('✅ Sistema de compra en chat inicializado');
    }

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();