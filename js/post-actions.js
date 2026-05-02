// ============================================
// POST ACTIONS - ACCIONES DE PUBLICACIONES
// post-actions.js - VERSIÓN COMPLETA Y CORREGIDA
// ============================================

const MarketplaceSystem = {
    currentPost: null,
    userBalance: 0
};

// Hacer disponible globalmente
window.MarketplaceSystem = MarketplaceSystem;

console.log('✅ MarketplaceSystem inicializado:', MarketplaceSystem);

/**
 * Cambiar privacidad de una publicación - CON CONFIRMACIÓN
 */
async function togglePostPrivacy(postId, isCurrentlyPublic) {
    try {
        // Cerrar menú si está abierto
        if (typeof closePostMenu === 'function') {
            closePostMenu(postId);
        }
        
        const numericId = postId.replace('post-', '');
        const newPrivacy = !isCurrentlyPublic; // true = público, false = privado
        
        console.log('🔄 Cambiando privacidad:', {
            postId,
            numericId,
            isCurrentlyPublic,
            newPrivacy: newPrivacy ? 'público' : 'privado'
        });
        
        // ✅ MODAL DE CONFIRMACIÓN
        const statusText = newPrivacy ? 'público' : 'privado';
        const icon = newPrivacy ? '🌍' : '🔒';
        const message = newPrivacy 
            ? '¿Hacer esta publicación pública? Todos podrán verla, incluso quienes no te siguen.'
            : '¿Hacer esta publicación privada? Solo tus seguidores podrán verla.';
        
        const modal = createConfirmModal(
            `${icon} Cambiar privacidad`,
            message,
            'Cancelar',
            `Hacer ${statusText}`,
            null, // onCancel
            async () => { // onConfirm
                try {
                    const response = await fetch('php/actualizar_privacidad_post.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            publicacion_id: numericId,
                            es_publica: newPrivacy
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok || !data.success) {
                        throw new Error(data.message || 'Error al cambiar privacidad');
                    }
                    
                    // ✅ ACTUALIZAR DOM INMEDIATAMENTE
                    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
                    if (postCard) {
                        const postHeader = postCard.querySelector('.post-header');
                        
                        if (!newPrivacy) {
                            // Post ahora es PRIVADO - Agregar badge
                            let badge = postCard.querySelector('.post-privacy-badge');
                            if (!badge) {
                                badge = document.createElement('span');
                                badge.className = 'post-privacy-badge';
                                badge.innerHTML = '🔒 Privado';
                                badge.style.cssText = `
                                    background: rgba(139, 92, 246, 0.2);
                                    color: #a78bfa;
                                    padding: 0.25rem 0.5rem;
                                    border-radius: 6px;
                                    font-size: 0.75rem;
                                    font-weight: 600;
                                    margin-left: 0.5rem;
                                    display: inline-block;
                                `;
                                if (postHeader) {
                                    postHeader.appendChild(badge);
                                }
                            }
                            // ✅ MARCAR CON DATA-ATTRIBUTE (más confiable)
                            postCard.setAttribute('data-is-private', 'true');
                            console.log('✅ Badge actualizado: Privado (con badge)');
                        } else {
                            // Post ahora es PÚBLICO - Remover badge
                            const badge = postCard.querySelector('.post-privacy-badge');
                            if (badge) {
                                badge.remove();
                            }
                            // ✅ REMOVER DATA-ATTRIBUTE
                            postCard.removeAttribute('data-is-private');
                            console.log('✅ Badge actualizado: Público (sin badge)');
                        }
                        
                        // Efecto visual
                        postCard.classList.add('action-feedback');
                        setTimeout(() => {
                            postCard.classList.remove('action-feedback');
                        }, 600);
                    }
                    
                    if (typeof showNotification === 'function') {
                        showNotification(
                            newPrivacy ? '🌍 Post ahora es público' : '🔒 Post ahora es privado',
                            'success'
                        );
                    }
                    
                } catch (error) {
                    console.error('Error cambiando privacidad:', error);
                    if (typeof showNotification === 'function') {
                        showNotification(error.message, 'error');
                    }
                }
            },
            { type: 'info' }
        );
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error:', error);
        if (typeof showNotification === 'function') {
            showNotification(error.message, 'error');
        }
    }
}

async function deletePost(postId) {
    try {
        const numericId = postId.replace('post-', '');
        
        // ✅ USAR MODAL ELEGANTE en lugar de confirm()
        const modal = createConfirmModal(
            '🗑️ Eliminar publicación',
            '¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer y perderás todos los tokens asociados.',
            'Cancelar',
            'Eliminar',
            null, // onCancel
            async () => { // onConfirm
                try {
                    console.log('🗑️ Eliminando post:', numericId);
                    
                    const response = await fetch('php/eliminar_publicacion.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            publicacion_id: numericId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok || !data.success) {
                        throw new Error(data.message || 'Error al eliminar publicación');
                    }
                    
                    // Eliminar del DOM con animación
                    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
                    if (postCard) {
                        postCard.style.opacity = '0';
                        postCard.style.transform = 'translateX(-100%)';
                        postCard.style.transition = 'all 0.3s ease';
                        
                        setTimeout(() => {
                            postCard.remove();
                        }, 300);
                    }
                    
                    if (typeof showNotification === 'function') {
                        showNotification('🗑️ Publicación eliminada correctamente', 'success');
                    }
                    
                    setTimeout(() => {
                        if (typeof loadFeedPosts === 'function') {
                            loadFeedPosts();
                        }
                    }, 500);
                    
                } catch (error) {
                    console.error('Error eliminando publicación:', error);
                    if (typeof showNotification === 'function') {
                        showNotification(error.message, 'error');
                    }
                }
            },
            { type: 'danger' }
        );
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error:', error);
        if (typeof showNotification === 'function') {
            showNotification(error.message, 'error');
        }
    }
}

/**
 * Poner publicación en venta
 */
async function sellPost(postId) {
    try {
        // Cerrar menú de opciones si está abierto
        if (typeof closePostMenu === 'function') {
            closePostMenu(postId);
        }
        
        const numericId = postId.toString().replace('post-', '');
        
        // Buscar datos del post
        const postCard = document.querySelector(`[data-post-id="${postId}"]`);
        if (!postCard) {
            showNotification('❌ Publicación no encontrada', 'error');
            return;
        }
        
        // Extraer estadísticas del post
        const likesElement = postCard.querySelector('[onclick*="togglePostLike"]');
        const commentsElement = postCard.querySelector('[onclick*="openComments"]');
        const repostsElement = postCard.querySelector('[onclick*="toggleRepost"]');
        const sharesElement = postCard.querySelector('[onclick*="openShareModal"]');
        
        const likes = likesElement ? parseInt(likesElement.textContent.match(/\d+/)?.[0] || '0') : 0;
        const comments = commentsElement ? parseInt(commentsElement.textContent.match(/\d+/)?.[0] || '0') : 0;
        const reposts = repostsElement ? parseInt(repostsElement.textContent.match(/\d+/)?.[0] || '0') : 0;
        const shares = sharesElement ? parseInt(sharesElement.textContent.match(/\d+/)?.[0] || '0') : 0;
        
        // Guardar datos del post actual en el sistema de marketplace
        if (typeof MarketplaceSystem !== 'undefined') {
            MarketplaceSystem.currentPost = {
                id: numericId,
                element: postCard,
                stats: { likes, comments, reposts, shares }
            };
        }
        
        // Actualizar estadísticas en el modal
        const totalInteractions = likes + comments + reposts + shares;
        const totalCountElement = document.getElementById('totalInteractionsCount');
        if (totalCountElement) {
            totalCountElement.textContent = totalInteractions.toLocaleString();
        }
        
        // Resetear inputs del modal
        const sellPrice = document.getElementById('sellPrice');
        const sellerReceivesAmount = document.getElementById('sellerReceivesAmount');
        const commissionBreakdown = document.getElementById('commissionBreakdown');
        
        if (sellPrice) sellPrice.value = '';
        if (sellerReceivesAmount) {
            sellerReceivesAmount.textContent = '0.00 CFT';
            sellerReceivesAmount.style.color = 'var(--text-secondary)';
        }
        if (commissionBreakdown) {
            commissionBreakdown.textContent = '(0.00 CFT - 5% comisión)';
        }
        
        // Abrir modal
        const modal = document.getElementById('sellModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus en el input de precio
            setTimeout(() => {
                if (sellPrice) {
                    sellPrice.focus();
                }
            }, 300);
        }
        
    } catch (error) {
        console.error('Error abriendo modal de venta:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al abrir modal de venta', 'error');
        }
    }
}

async function cancelSale(postId) {
    try {
        const numericId = postId.replace('post-', '');
        
        // ✅ MODAL ELEGANTE
        const modal = createConfirmModal(
            '❌ Cancelar venta',
            '¿Deseas retirar esta publicación del marketplace? Podrás volver a ponerla en venta cuando quieras.',
            'No',
            'Sí, cancelar venta',
            null,
            async () => {
                try {
                    console.log('❌ Cancelando venta:', numericId);
                    
                    const response = await fetch('php/cancelar_venta.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            publicacion_id: numericId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok || !data.success) {
                        throw new Error(data.message || 'Error al cancelar venta');
                    }
                    
                    // Actualizar UI
                    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
                    if (postCard) {
                        const saleIndicator = postCard.querySelector('.sale-indicator');
                        if (saleIndicator) {
                            saleIndicator.remove();
                        }
                        
                        postCard.classList.add('action-feedback');
                        setTimeout(() => {
                            postCard.classList.remove('action-feedback');
                        }, 600);
                    }
                    
                    if (typeof showNotification === 'function') {
                        showNotification('❌ Venta cancelada', 'success');
                    }
                    
                    setTimeout(() => {
                        if (typeof loadFeedPosts === 'function') {
                            loadFeedPosts();
                        }
                    }, 1000);
                    
                } catch (error) {
                    console.error('Error cancelando venta:', error);
                    if (typeof showNotification === 'function') {
                        showNotification(error.message, 'error');
                    }
                }
            },
            { type: 'warning' }
        );
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error:', error);
        if (typeof showNotification === 'function') {
            showNotification(error.message, 'error');
        }
    }
}

async function buyPost(postId) {
    try {
        const numericId = postId.toString().replace('post-', '');
        
        // ✅ BUSCAR PRECIO EN EL DOM DEL POST
        const postCard = document.querySelector(`[data-post-id="${postId}"], [data-post-id="post-${numericId}"]`);
        let precio = null;
        
        if (postCard) {
            // Buscar en el badge de precio
            const priceBtn = postCard.querySelector('.sale-price-btn, .buy-quick-btn, [onclick*="buyPost"]');
            if (priceBtn) {
                const priceMatch = priceBtn.textContent.match(/[\d.]+/);
                precio = priceMatch ? parseFloat(priceMatch[0]) : null;
            }
        }
        
        // ✅ CREAR MODAL CON INPUT DE CONTRASEÑA
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--dark-secondary);
            border-radius: 20px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; font-size: 1.3rem; font-weight: 700;">🛒 Comprar Publicación</h3>
            <p style="margin: 0 0 1.5rem 0; color: var(--text-secondary); line-height: 1.5;">
                ${precio ? `Precio: <strong style="color: var(--warning);">${precio} CFT</strong>` : 'Confirma la compra de esta publicación.'}
            </p>
            
            <!-- Input de contraseña -->
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                    🔐 Confirma tu contraseña
                </label>
                <div style="position: relative;">
                    <input 
                        type="password" 
                        id="buyPasswordVerify" 
                        placeholder="Ingresa tu contraseña"
                        autocomplete="current-password"
                        style="
                            width: 100%;
                            background: rgba(37, 37, 50, 0.5);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 10px;
                            padding: 0.8rem;
                            padding-right: 3rem;
                            color: var(--text);
                            font-size: 1rem;
                            transition: all 0.3s ease;
                            box-sizing: border-box;
                        "
                        onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 0 10px rgba(99, 102, 241, 0.2)'"
                        onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'; this.style.boxShadow='none'"
                    >
                    <button 
                        type="button" 
                        onclick="togglePasswordVisibility('buyPasswordVerify')" 
                        style="
                            position: absolute;
                            right: 1rem;
                            top: 50%;
                            transform: translateY(-50%);
                            background: transparent;
                            border: none;
                            color: var(--text-secondary);
                            cursor: pointer;
                            padding: 0.5rem;
                            font-size: 1.2rem;
                            transition: color 0.3s ease;
                        "
                        title="Mostrar/ocultar contraseña"
                        onmouseover="this.style.color='var(--primary)'"
                        onmouseout="this.style.color='var(--text-secondary)'">
                        👁️
                    </button>
                </div>
                <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                    Por seguridad, confirma tu contraseña antes de comprar
                </small>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button class="modal-cancel-btn" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                ">Cancelar</button>
                <button class="modal-confirm-btn" style="
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                ">${precio ? `Comprar por ${precio} CFT` : 'Confirmar compra'}</button>
            </div>
        `;

        modal.appendChild(modalContent);

        // Event listeners
        const cancelBtn = modalContent.querySelector('.modal-cancel-btn');
        const confirmBtn = modalContent.querySelector('.modal-confirm-btn');
        const passwordInput = modalContent.querySelector('#buyPasswordVerify');

        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }

        cancelBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Enviar con Enter
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                confirmBtn.click();
            }
        });

        confirmBtn.addEventListener('click', async () => {
            const password = passwordInput.value.trim();
            
            // Validar contraseña
            if (!password) {
                passwordInput.style.borderColor = 'var(--error)';
                setTimeout(() => {
                    passwordInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
                passwordInput.focus();
                if (typeof showNotification === 'function') {
                    showNotification('🔐 Debes ingresar tu contraseña', 'error');
                }
                return;
            }

            // Deshabilitar botón
            const originalText = confirmBtn.innerHTML;
            confirmBtn.innerHTML = '🔐 Verificando... ⏳';
            confirmBtn.disabled = true;
            passwordInput.disabled = true;

            try {
                console.log('🛒 Comprando post:', numericId);
                
                const response = await fetch('/php/comprar_publicacion.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        publicacion_id: numericId,
                        password: password
                    })
                });
                
                const data = await response.json();
                
// MANEJO ESPECÍFICO: Error 403
if (response.status === 403) {
    if (data.error_code === 'NO_PASSWORD') {
        // Usuario de wallet sin contraseña configurada
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 1rem 0;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
                <h3 style="color: #f59e0b; margin: 0 0 0.75rem 0; font-size: 1.2rem;">
                    Necesitás una contraseña
                </h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin: 0 0 1.5rem 0;">
                    Tu cuenta fue creada con una billetera. Para confirmar acciones sensibles, 
                    primero configurá una contraseña en tu perfil.
                </p>
                <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="this.closest('.confirm-modal').remove()" style="
                        background: rgba(255,255,255,0.1);
                        color: var(--text-secondary);
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Cancelar</button>
                    <a href="/editar-perfil" style="
                        background: linear-gradient(135deg, #f59e0b, #d97706);
                        color: #000;
                        padding: 0.8rem 1.5rem;
                        border-radius: 10px;
                        font-weight: 700;
                        text-decoration: none;
                        display: inline-block;
                    ">⚙️ Ir a Editar Perfil</a>
                </div>
            </div>
        `;
        return;
    }

    // Contraseña incorrecta normal
    passwordInput.style.borderColor = 'var(--error)';
    passwordInput.value = '';
    passwordInput.type = 'password';
    setTimeout(() => {
        passwordInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        passwordInput.focus();
    }, 2000);
    if (typeof showNotification === 'function') {
        showNotification('🔐 Contraseña incorrecta', 'error');
    }
    confirmBtn.innerHTML = originalText;
    confirmBtn.disabled = false;
    passwordInput.disabled = false;
    return;
}
                
                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Error al comprar publicación');
                }
                
                // ✅ CERRAR MODAL Y ELIMINAR POST
                closeModal();
                
                if (postCard) {
                    postCard.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    postCard.style.opacity = '0';
                    postCard.style.transform = 'scale(0.9) translateY(-30px)';
                    postCard.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        postCard.remove();
                        console.log('✅ Post eliminado del DOM');
                    }, 500);
                }
                
                if (typeof showNotification === 'function') {
                    showNotification(`✅ ¡Publicación comprada por ${precio || '?'} CFT!`, 'success');
                }
                
            } catch (error) {
                console.error('Error comprando publicación:', error);
                if (typeof showNotification === 'function') {
                    showNotification('❌ ' + error.message, 'error');
                }
                
                // Restaurar botón
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
                passwordInput.disabled = false;
            }
        });

        // Mostrar modal con animación
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
            passwordInput.focus();
        }, 10);
        
    } catch (error) {
        console.error('Error:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ ' + error.message, 'error');
        }
    }
}

/**
 * Ocultar publicación - CON CONFIRMACIÓN
 */
async function hidePost(postId) {
    try {
        const numericId = postId.replace('post-', '');
        
        console.log('👁️‍🗨️ Preparando para ocultar post:', numericId);
        
        // ✅ MODAL DE CONFIRMACIÓN
        const modal = createConfirmModal(
            '👁️‍🗨️ Ocultar publicación',
            '¿Ocultar esta publicación de tu feed? Solo desaparecerá para ti, otros usuarios seguirán viéndola.',
            'Cancelar',
            'Ocultar',
            null, // onCancel
            async () => { // onConfirm
                try {
                    console.log('✅ Usuario confirmó, ocultando post:', numericId);
                    
                    const response = await fetch('php/ocultar_publicacion.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            publicacion_id: numericId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok || !data.success) {
                        throw new Error(data.message || 'Error al ocultar publicación');
                    }
                    
                    // Eliminar del DOM con animación
                    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
                    if (postCard) {
                        postCard.style.opacity = '0';
                        postCard.style.transform = 'scale(0.9)';
                        postCard.style.transition = 'all 0.3s ease';
                        
                        setTimeout(() => {
                            postCard.remove();
                        }, 300);
                    }
                    
                    if (typeof showNotification === 'function') {
                        showNotification('👁️‍🗨️ Publicación ocultada de tu feed', 'success');
                    }
                    
                } catch (error) {
                    console.error('Error ocultando publicación:', error);
                    if (typeof showNotification === 'function') {
                        showNotification(error.message, 'error');
                    }
                }
            },
            { type: 'warning' }
        );
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error:', error);
        if (typeof showNotification === 'function') {
            showNotification(error.message, 'error');
        }
    }
}

/**
 * Reportar publicación
 */
async function reportPost(postId) {
    // Crear y mostrar modal de reporte
    const modal = createReportModal(postId);
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        const content = modal.querySelector('[style*="transform"]');
        if (content) {
            content.style.transform = 'scale(1)';
        }
    }, 10);
}

/**
 * Crear modal de reporte
 */
function createReportModal(postId) {
    const modal = document.createElement('div');
    modal.className = 'report-modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 1rem;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, rgb(26, 26, 36) 0%, rgb(37, 37, 50) 100%);
            border-radius: 20px;
            padding: 2rem;
            max-width: 450px;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: rgba(0, 0, 0, 0.5) 0px 20px 60px;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚨</div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; color: white;">
                    Reportar publicación
                </h3>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                    📝 Tu reporte será revisado por nuestro equipo
                </p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <p style="margin: 0 0 1rem 0; color: var(--text-secondary); font-weight: 600; font-size: 0.95rem;">
                    Selecciona el motivo del reporte:
                </p>
                
                <div class="report-options">
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="contenido_inapropiado" checked style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">⚠️ Contenido inapropiado</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Contenido sexual, violento o perturbador</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="spam" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">📧 Spam</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Contenido repetitivo o irrelevante</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="acoso" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">😡 Acoso o bullying</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Intimidación o hostigamiento</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="contenido_violento" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">🔪 Contenido violento</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Violencia gráfica o amenazas</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="desinformacion" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">❌ Información falsa</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Desinformación o noticias falsas</div>
                        </div>
                    </label>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                <button class="modal-cancel-btn" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    border: none;
                    padding: 0.9rem 1.75rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.95rem;
                ">Cancelar</button>
                <button class="modal-report-btn" style="
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    border: none;
                    padding: 0.9rem 1.75rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.95rem;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                ">🚨 Enviar reporte</button>
            </div>
        </div>
    `;

    // Agregar estilos de hover a las opciones
    const reportOptions = modal.querySelectorAll('.report-option');
    reportOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.style.background = 'rgba(99, 102, 241, 0.1)';
            option.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        });
        option.addEventListener('mouseleave', () => {
            option.style.background = 'rgba(255, 255, 255, 0.03)';
            option.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    });

    // Event listeners
    const cancelBtn = modal.querySelector('.modal-cancel-btn');
    const reportBtn = modal.querySelector('.modal-report-btn');
    const overlay = modal;

    function closeModal() {
        modal.style.opacity = '0';
        const content = modal.querySelector('[style*="transform"]');
        if (content) {
            content.style.transform = 'scale(0.9)';
        }
        setTimeout(() => modal.remove(), 300);
    }

    cancelBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    reportBtn.addEventListener('click', async () => {
        const selectedReason = modal.querySelector('input[name="reportReason"]:checked');
        if (!selectedReason) {
            if (typeof showNotification === 'function') {
                showNotification('⚠️ Por favor selecciona un motivo', 'error');
            }
            return;
        }

        const motivo = selectedReason.value;
        
        // Deshabilitar botón mientras se envía
        reportBtn.disabled = true;
        const originalText = reportBtn.innerHTML;
        reportBtn.innerHTML = '⏳ Enviando...';
        reportBtn.style.opacity = '0.6';

        try {
            const numericId = postId.toString().replace('post-', '');
            
            console.log('⚠️ Reportando post:', { postId: numericId, motivo });
            
            const response = await fetch('/php/reportar_contenido.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    tipo: 'publicacion',
                    id: numericId,
                    motivo: motivo
                })
            });

            console.log('📥 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            console.log('📥 Response data:', data);

            if (data.success) {
                closeModal();
                
                // ✅ CORREGIDO: Mensaje según si se envió email o no
                let mensaje = '✅ Reporte enviado exitosamente';
                
                if (data.email_enviado) {
                    mensaje += '. El equipo de moderación ha sido notificado.';
                } else {
                    mensaje += ', pero no se pudo enviar el email de notificación.';
                    console.warn('⚠️ Email no enviado');
                }
                
                if (typeof showNotification === 'function') {
                    showNotification(mensaje, 'success');
                }
            } else {
                throw new Error(data.message || 'Error al procesar reporte');
            }

        } catch (error) {
            console.error('❌ Error reportando publicación:', error);
            
            // ✅ CORREGIDO: Mostrar error real
            if (typeof showNotification === 'function') {
                showNotification('❌ Error: ' + error.message, 'error');
            }
            
            // Restaurar botón
            reportBtn.disabled = false;
            reportBtn.innerHTML = originalText;
            reportBtn.style.opacity = '1';
        }
    });

    return modal;
}

/**
 * Cerrar menú de post (si existe función legacy)
 */
function closePostMenu(postId) {
    // Cerrar dropdown legacy si existe
    const dropdown = document.getElementById(`postDropdown-${postId}`);
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
    
    // Restaurar z-index del post
    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
    if (postCard) {
        postCard.style.zIndex = '1';
    }
}

// Agregar estilos para el modal de reporte
if (!document.getElementById('report-modal-styles')) {
    const styles = document.createElement('style');
    styles.id = 'report-modal-styles';
    styles.textContent = `
        .report-option input[type="radio"]:checked + div {
            color: var(--primary) !important;
        }
        
        .report-option:has(input:checked) {
            background: rgba(99, 102, 241, 0.15) !important;
            border-color: rgba(99, 102, 241, 0.5) !important;
        }
        
        .modal-cancel-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            transform: translateY(-2px);
        }
        
        .modal-report-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
        }
    `;
    document.head.appendChild(styles);
}

/**
 * Cerrar modal de venta
 */
function closeSellModal() {
    const modal = document.getElementById('sellModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    document.body.style.overflow = '';
    
    setTimeout(() => {
        if (typeof MarketplaceSystem !== 'undefined') {
            MarketplaceSystem.currentPost = null;
        }
        
        // Limpiar inputs
        const sellPrice = document.getElementById('sellPrice');
        const passwordInput = document.getElementById('sellPasswordVerify');
        
        if (sellPrice) {
            sellPrice.value = '';
            sellPrice.style.borderColor = '';
        }
        
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.type = 'password';
            passwordInput.style.borderColor = '';
        }
        
        // Resetear monto a recibir
        const sellerReceivesAmount = document.getElementById('sellerReceivesAmount');
        const commissionBreakdown = document.getElementById('commissionBreakdown');
        if (sellerReceivesAmount) {
            sellerReceivesAmount.textContent = '0.00 CFT';
            sellerReceivesAmount.style.color = 'var(--text-secondary)';
        }
        if (commissionBreakdown) {
            commissionBreakdown.textContent = '(0.00 CFT - 5% comisión)';
        }
    }, 300);
}

/**
 * Actualizar monto que recibirá el vendedor
 */
function updateSellerReceivesAmount() {
    const priceInput = document.getElementById('sellPrice');
    const sellerReceivesElement = document.getElementById('sellerReceivesAmount');
    const breakdownElement = document.getElementById('commissionBreakdown');
    
    if (!priceInput || !sellerReceivesElement || !breakdownElement) return;
    
    const price = parseFloat(priceInput.value) || 0;
    const commission = price * 0.05; // 5% de comisión
    const sellerReceives = price - commission;
    
    // Actualizar monto que recibe
    sellerReceivesElement.textContent = `${sellerReceives.toFixed(2)} CFT`;
    
    // Actualizar desglose
    breakdownElement.textContent = `(${price.toFixed(2)} CFT - 5% comisión)`;
    
    // Cambiar color según si hay precio válido
    if (price > 0) {
        sellerReceivesElement.style.color = 'var(--success)';
    } else {
        sellerReceivesElement.style.color = 'var(--text-secondary)';
    }
}

/**
 * Mostrar/ocultar contraseña
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const button = input.parentElement.querySelector('button[onclick*="togglePasswordVisibility"]');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (button) button.textContent = '🙈';
    } else {
        input.type = 'password';
        if (button) button.textContent = '👁️';
    }
}

/**
 * Confirmar poner en venta
 */
async function confirmSellPost() {
    try {
        const priceInput = document.getElementById('sellPrice');
        const passwordInput = document.getElementById('sellPasswordVerify');
        const price = parseFloat(priceInput.value);
        const password = passwordInput ? passwordInput.value.trim() : '';
        
        // Validar precio
        if (!price || price < 1) {
            priceInput.style.borderColor = 'var(--error)';
            showNotification('❌ El precio debe ser al menos 1 CFT', 'error');
            setTimeout(() => {
                priceInput.style.borderColor = '';
            }, 2000);
            priceInput.focus();
            return;
        }
        
        // Validar contraseña
        if (!password) {
            if (passwordInput) {
                passwordInput.style.borderColor = 'var(--error)';
                setTimeout(() => {
                    passwordInput.style.borderColor = '';
                }, 2000);
                passwordInput.focus();
            }
            showNotification('🔐 Debes ingresar tu contraseña', 'error');
            return;
        }
        
        const confirmBtn = document.querySelector('.sell-confirm-btn');
        if (!confirmBtn) {
            showNotification('❌ Error en la interfaz', 'error');
            return;
        }
        
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '🔐 Verificando... ⏳';
        confirmBtn.disabled = true;
        
        // Obtener el ID del post actual
        let postId;
        if (typeof MarketplaceSystem !== 'undefined' && MarketplaceSystem.currentPost) {
            postId = MarketplaceSystem.currentPost.id;
        } else {
            throw new Error('No se encontró información del post');
        }
        
        // Llamar al endpoint PHP
        const response = await fetch('/php/poner_en_venta.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                publicacion_id: postId,
                precio: price,
                password: password
            })
        });
        
        const data = await response.json();
        console.log('📥 Respuesta del servidor:', data);
        
// MANEJO ESPECÍFICO: Error 403
if (response.status === 403) {
    if (data.error_code === 'NO_PASSWORD') {
        // Usuario de wallet sin contraseña — reemplazar contenido del modal
        const sellModalBody = document.querySelector('#sellModal .sell-modal-body, #sellModal .modal-body, #sellModal > div');
        const noPasswordHTML = `
            <div style="text-align: center; padding: 2rem 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
                <h3 style="color: #f59e0b; margin: 0 0 0.75rem 0; font-size: 1.2rem;">
                    Necesitás una contraseña
                </h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; margin: 0 0 1.5rem 0;">
                    Tu cuenta fue creada con una billetera. Para confirmar acciones sensibles, 
                    primero configurá una contraseña en tu perfil.
                </p>
                <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="closeSellModal()" style="
                        background: rgba(255,255,255,0.1);
                        color: var(--text-secondary);
                        border: none;
                        padding: 0.8rem 1.5rem;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Cancelar</button>
                    <a href="/editar-perfil" style="
                        background: linear-gradient(135deg, #f59e0b, #d97706);
                        color: #000;
                        padding: 0.8rem 1.5rem;
                        border-radius: 10px;
                        font-weight: 700;
                        text-decoration: none;
                        display: inline-block;
                    ">⚙️ Ir a Editar Perfil</a>
                </div>
            </div>
        `;
        if (sellModalBody) {
            sellModalBody.innerHTML = noPasswordHTML;
        } else {
            // Fallback: notificación + redirect
            showNotification('⚙️ Configurá una contraseña en tu perfil primero', 'warning');
            setTimeout(() => { window.location.href = '/editar-perfil'; }, 2500);
        }
        return;
    }

    // Contraseña incorrecta normal
    if (passwordInput) {
        passwordInput.style.borderColor = 'var(--error)';
        passwordInput.value = '';
        passwordInput.type = 'password';
        setTimeout(() => {
            passwordInput.style.borderColor = '';
            passwordInput.focus();
        }, 2000);
    }
    showNotification('🔐 Contraseña incorrecta', 'error');
    return;
}
        
        // Verificar otros errores HTTP
        if (!response.ok) {
            throw new Error(data.message || `Error del servidor (${response.status})`);
        }
        
        if (data.success) {
            // Actualizar UI del post
            const postCard = document.querySelector(`[data-post-id="post-${postId}"]`);
            if (postCard) {
                const postHeader = postCard.querySelector('.post-header');
                
                // Agregar indicador de venta
                let saleIndicator = postCard.querySelector('.sale-indicator');
                if (!saleIndicator) {
                    saleIndicator = document.createElement('span');
                    saleIndicator.className = 'sale-indicator';
                    saleIndicator.innerHTML = `💰 En venta: ${price} CFT`;
                    saleIndicator.style.cssText = `
                        background: rgba(251, 191, 36, 0.2);
                        color: #fbbf24;
                        padding: 0.25rem 0.5rem;
                        border-radius: 6px;
                        font-size: 0.75rem;
                        font-weight: 600;
                        margin-left: 0.5rem;
                        display: inline-block;
                    `;
                    if (postHeader) {
                        postHeader.appendChild(saleIndicator);
                    }
                }
                
                postCard.classList.add('action-feedback');
                setTimeout(() => {
                    postCard.classList.remove('action-feedback');
                }, 600);
            }
            
            closeSellModal();
            showNotification(`💰 ¡Publicación puesta en venta por ${price} CFT!`, 'success');
            
            // Recargar feed si existe la función
            setTimeout(() => {
                if (typeof loadFeedPosts === 'function') {
                    loadFeedPosts();
                }
            }, 1000);
        } else {
            throw new Error(data.message || 'Error al poner en venta');
        }
        
    } catch (error) {
        console.error('❌ Error poniendo en venta:', error);
        showNotification('❌ ' + error.message, 'error');
    } finally {
        // CRÍTICO: Siempre restaurar el botón
        const confirmBtn = document.querySelector('.sell-confirm-btn');
        if (confirmBtn) {
            confirmBtn.innerHTML = '💰 Poner en Venta';
            confirmBtn.disabled = false;
        }
    }
}

// Exportar funciones al scope global
window.togglePostPrivacy = togglePostPrivacy;
window.deletePost = deletePost;
window.sellPost = sellPost;
window.cancelSale = cancelSale;
window.buyPost = buyPost;
window.hidePost = hidePost;
window.reportPost = reportPost;
window.closePostMenu = closePostMenu;
window.closeSellModal = closeSellModal;
window.updateSellerReceivesAmount = updateSellerReceivesAmount;
window.togglePasswordVisibility = togglePasswordVisibility;
window.confirmSellPost = confirmSellPost;

console.log('✅ post-actions.js cargado correctamente');

// Event listeners para el modal de venta
document.addEventListener('DOMContentLoaded', function() {
    const sellModal = document.getElementById('sellModal');
    
    if (sellModal) {
        // Cerrar modal al hacer clic fuera
        sellModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSellModal();
            }
        });
        
        // Cerrar con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sellModal.classList.contains('active')) {
                closeSellModal();
            }
        });
    }
});