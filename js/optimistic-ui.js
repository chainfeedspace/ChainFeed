// ============================================
// OPTIMISTIC UI - ARCHIVO COMPLETO CORREGIDO
// Actualización de likes con validaciones completas
// ============================================

window.toggleRealPostLike = async function(button, postId) {
    try {
        console.log('Ejecutando toggleRealPostLike para post:', postId);
        const isLiked = button.classList.contains('liked');
        
        button.classList.add('action-feedback');
        
        const response = await fetch('/php/manejar_likes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tipo: 'publicacion',
                id: postId,
                action: isLiked ? 'unlike' : 'like'
            })
        });

        const data = await response.json();
        console.log('Respuesta like:', data);

        if (data.success) {
            const newLikeCount = data.new_like_count;
            const liked = data.liked;
            
            // ✅ ACTUALIZAR UI CON SVG
            button.classList.toggle('liked', liked);

            button.innerHTML = `
                <svg class="like-icon" width="16" height="16" viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="like-count">${newLikeCount}</span>
            `;
            
            // ✅ GESTIONAR BOTÓN "VER" CON VALIDACIÓN COMPLETA
            const statsContainer = button.parentElement;
            
            // Verificar que el contenedor existe y es válido
            if (!statsContainer) {
                console.warn('⚠️ No se encontró contenedor de estadísticas para el post:', postId);
                // Continuar sin crear el botón "Ver"
            } else {
                let viewButton = statsContainer.querySelector('.post-stat-view-likes');
                
                if (newLikeCount > 0) {
                    if (!viewButton) {
                        // Crear botón "Ver" si no existe
                        viewButton = document.createElement('button');
                        viewButton.className = 'post-stat-view-likes';
                        viewButton.onclick = (e) => {
                            e.stopPropagation();
                            if (typeof openLikesModal === 'function') {
                                openLikesModal('publicacion', postId, e);
                            }
                        };
                        viewButton.title = 'Ver quién dio like';
                        viewButton.textContent = 'Ver';
                        
                        // ✅ VALIDAR QUE EL BOTÓN DE LIKE EXISTE ANTES DE INSERTAR
                        if (button && button.parentNode === statsContainer) {
                            try {
                                statsContainer.insertBefore(viewButton, button);
                            } catch (err) {
                                console.warn('⚠️ Error al insertar botón Ver:', err);
                                // Intentar agregar al final como alternativa
                                try {
                                    statsContainer.appendChild(viewButton);
                                } catch (err2) {
                                    console.error('❌ No se pudo agregar botón Ver:', err2);
                                }
                            }
                        } else {
                            console.warn('⚠️ El botón de like no es hijo directo del contenedor');
                            // Intentar agregar al final del contenedor
                            try {
                                statsContainer.appendChild(viewButton);
                            } catch (err) {
                                console.error('❌ No se pudo agregar botón Ver al final:', err);
                            }
                        }
                    }
                } else {
                    // Eliminar botón "Ver" si ya no hay likes
                    if (viewButton) {
                        try {
                            viewButton.remove();
                        } catch (err) {
                            console.warn('⚠️ Error al eliminar botón Ver:', err);
                        }
                    }
                }
            }
            
            // Actualizar atributo
            button.setAttribute('data-like-count', newLikeCount);
            
            // Efecto visual
            button.style.transform = 'scale(1.1)';
            setTimeout(() => button.style.transform = 'scale(1)', 200);
            
            // Notificación
            if (data.tokens_affected > 0) {
                if (typeof showNotification === 'function') {
                    showNotification(`❤️ ${liked ? 'Like agregado' : 'Like removido'}! ${data.tokens_affected} CFT`);
                }
            }
        } else {
            throw new Error(data.message || 'Error al procesar like');
        }

    } catch (error) {
        console.error('❌ Error en like:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al procesar like: ' + error.message, 'error');
        }
    } finally {
        setTimeout(() => {
            try {
                button.classList.remove('action-feedback');
            } catch (err) {
                console.warn('⚠️ Error al remover clase action-feedback:', err);
            }
        }, 600);
    }
};

// ============================================
// FUNCIÓN SEGURA: INICIALIZAR BOTONES "VER"
// ============================================

function safeInitializeViewLikesButtons() {
    try {
        // Buscar todos los posts (feed normal y market)
        const allPosts = document.querySelectorAll('.post-card[data-post-id], .market-post[data-post-id], .content-card[data-post-id]');
        
        let initializedCount = 0;
        
        allPosts.forEach(post => {
            try {
                const postId = post.dataset.postId;
                if (!postId) return;
                
                const statsContainer = post.querySelector('.card-stats');
                if (!statsContainer) return;
                
                const likeButton = statsContainer.querySelector('.card-stat[onclick*="toggleRealPostLike"]');
                if (!likeButton) return;
                
                // Obtener cantidad de likes
                const likeCount = parseInt(
                    likeButton.dataset.likeCount || 
                    likeButton.querySelector('.like-count')?.textContent || 
                    '0'
                );
                
                // Verificar si ya existe el botón "Ver"
                let viewButton = statsContainer.querySelector('.post-stat-view-likes');
                
                if (likeCount > 0) {
                    // Crear botón "Ver" si no existe
                    if (!viewButton) {
                        viewButton = document.createElement('button');
                        viewButton.className = 'post-stat-view-likes';
                        viewButton.onclick = (e) => {
                            e.stopPropagation();
                            if (typeof openLikesModal === 'function') {
                                openLikesModal('publicacion', postId, e);
                            }
                        };
                        viewButton.title = 'Ver quién dio like';
                        viewButton.textContent = 'Ver';
                        
                        // Insertar de forma segura
                        try {
                            if (likeButton.parentNode === statsContainer) {
                                statsContainer.insertBefore(viewButton, likeButton);
                                initializedCount++;
                            } else {
                                statsContainer.appendChild(viewButton);
                                initializedCount++;
                            }
                        } catch (err) {
                            console.warn('⚠️ Error al insertar botón Ver en post', postId, err);
                        }
                    }
                } else {
                    // Eliminar botón "Ver" si no hay likes
                    if (viewButton) {
                        try {
                            viewButton.remove();
                        } catch (err) {
                            console.warn('⚠️ Error al eliminar botón Ver en post', postId, err);
                        }
                    }
                }
            } catch (err) {
                console.warn('⚠️ Error procesando post individual:', err);
            }
        });
        
        console.log(`✅ Botones "Ver" inicializados: ${initializedCount} de ${allPosts.length} posts`);
    } catch (error) {
        console.error('❌ Error al inicializar botones Ver:', error);
    }
}

// Hacer función global
window.safeInitializeViewLikesButtons = safeInitializeViewLikesButtons;

// ============================================
// AUTO-INICIALIZACIÓN AL CARGAR
// ============================================

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(safeInitializeViewLikesButtons, 200);
    });
} else {
    // DOM ya está listo
    setTimeout(safeInitializeViewLikesButtons, 200);
}

// Re-inicializar cuando se cargue nuevo contenido dinámico
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        let shouldReinitialize = false;
        
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (
                        node.classList?.contains('post-card') ||
                        node.classList?.contains('market-post') ||
                        node.classList?.contains('content-card')
                    )) {
                        shouldReinitialize = true;
                    }
                });
            }
        });
        
        if (shouldReinitialize) {
            setTimeout(safeInitializeViewLikesButtons, 100);
        }
    });
    
    // Observar el contenedor principal del feed
    setTimeout(() => {
        const feedContainer = document.getElementById('feedPosts') || document.querySelector('.feed-container');
        if (feedContainer) {
            observer.observe(feedContainer, { 
                childList: true, 
                subtree: true 
            });
            console.log('✅ Observer activado para nuevos posts');
        }
    }, 500);
}

console.log('✅ optimistic-ui.js cargado con validaciones completas');