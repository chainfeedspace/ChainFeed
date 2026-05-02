// ============================================
// SISTEMA DE SHARES OPTIMIZADO Y LIMPIO
// ============================================

// 1. CORRECCIÓN AUTOMÁTICA DE CONTADORES
async function fixAllShareCounters() {
    const posts = document.querySelectorAll('.post-card, .content-card');
    
    for (const post of posts) {
        const postId = (post.dataset.postId || post.id).replace('post-', '').replace('card-', '');
        
        if (postId && !isNaN(postId)) {
            try {
                const response = await fetch(`/php/api_chat.php?accion=obtener_estadisticas_publicacion&publicacion_id=${postId}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.publicacion && data.publicacion.stats) {
                        const shareCount = data.publicacion.stats.shares_count || 0;
                        const shareButtons = post.querySelectorAll('button[onclick*="openShareModal"]');
                        shareButtons.forEach(btn => updateButtonText(btn, shareCount));
                    }
                }
            } catch (error) {
                console.error(`Error en post ${postId}:`, error);
            }
        }
    }
}

// 2. ACTUALIZAR TEXTO DEL BOTÓN SIN EFECTOS VISUALES
function updateButtonText(button, count) {
    const svg = button.querySelector('svg');
    const formattedCount = formatCount(count);
    
    if (svg) {
        button.innerHTML = svg.outerHTML + '\n                ' + formattedCount;
    } else {
        button.textContent = formattedCount;
    }
    
    button.dataset.shareCount = count;
}

// 3. FORMATEAR NÚMEROS
function formatCount(count) {
    if (!count || count === 0) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1).replace('.0', '') + 'K';
    return (count / 1000000).toFixed(1).replace('.0', '') + 'M';
}

// 4. INTERCEPTAR CREACIÓN DE POSTS
function patchPostCreation() {
    if (typeof window.createPostElement === 'function') {
        const originalCreate = window.createPostElement;
        
        window.createPostElement = function(data) {
            if (data.stats && typeof data.stats.shares_count !== 'undefined') {
                data.shares = data.stats.shares_count;
            } else if (typeof data.shares_count !== 'undefined') {
                data.shares = data.shares_count;
            } else if (!data.shares) {
                data.shares = 0;
            }
            
            return originalCreate.call(this, data);
        };
    }
}

// 5. MEJORAR submitShare
if (typeof window.submitShare === 'function') {
    const originalSubmitShare = window.submitShare;
    
    window.submitShare = async function() {
        try {
            await originalSubmitShare.call(this);
            
            if (ShareSystem.currentPost && ShareSystem.currentPost.id) {
                setTimeout(() => {
                    fixShareCounterForPost(ShareSystem.currentPost.id);
                }, 500);
            }
        } catch (error) {
            console.error('Error en submitShare:', error);
            throw error;
        }
    };
}

// 6. ACTUALIZAR CONTADOR INDIVIDUAL SIN EFECTOS
async function fixShareCounterForPost(postId) {
    try {
        const response = await fetch(`/php/api_chat.php?accion=obtener_estadisticas_publicacion&publicacion_id=${postId}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.publicacion && data.publicacion.stats) {
                const shareCount = data.publicacion.stats.shares_count || 0;
                
                const postSelectors = [
                    `[data-post-id="${postId}"]`,
                    `[data-post-id="post-${postId}"]`,
                    `#post-${postId}`
                ];
                
                let postElement = null;
                for (const selector of postSelectors) {
                    postElement = document.querySelector(selector);
                    if (postElement) break;
                }
                
                if (postElement) {
                    const shareButtons = postElement.querySelectorAll('button[onclick*="openShareModal"]');
                    shareButtons.forEach(btn => updateButtonText(btn, shareCount));
                    return true;
                }
            }
        }
    } catch (error) {
        console.error(`Error actualizando post ${postId}:`, error);
    }
    return false;
}

// 7. OBSERVADOR PARA NUEVOS POSTS
function setupPostObserver() {
    const feedContainer = document.querySelector('.feed-posts, #feedPosts');
    if (!feedContainer) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && (node.classList.contains('post-card') || node.classList.contains('content-card'))) {
                    const postId = (node.dataset.postId || node.id).replace('post-', '').replace('card-', '');
                    if (postId && !isNaN(postId)) {
                        setTimeout(() => {
                            fixShareCounterForPost(postId);
                        }, 100);
                    }
                }
            });
        });
    });
    
    observer.observe(feedContainer, {
        childList: true,
        subtree: true
    });
}

// 8. HACER FUNCIONES GLOBALES
window.fixAllShareCounters = fixAllShareCounters;
window.fixShareCounterForPost = fixShareCounterForPost;

// 9. INICIALIZACIÓN SIN LOGS NI EFECTOS
document.addEventListener('DOMContentLoaded', function() {
    patchPostCreation();
    setupPostObserver();
    
    // Corregir contadores existentes silenciosamente
    setTimeout(() => {
        fixAllShareCounters();
    }, 2000);
});

// 10. SI YA ESTÁ CARGADO
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        patchPostCreation();
        setupPostObserver();
        fixAllShareCounters();
    }, 500);
}