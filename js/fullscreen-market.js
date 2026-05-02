/**
 * FULLSCREEN ADAPTER UNIVERSAL
 * Sistema que hace compatible el FullscreenPostViewer con posts normales y posts del market
 * SIN modificar código existente - Actúa como capa intermedia
 * Con soporte completo para sistema de compra/venta
 * ✨ NUEVO: Abrir viewer al tocar texto, imágenes o videos en posts del market
 */

class FullscreenPostAdapter {
    constructor() {
        this.originalViewer = null;
        this.postTypeCache = new Map();
        this.init();
    }

    init() {
        this.waitForOriginalViewer();
    }

    waitForOriginalViewer() {
        const checkViewer = () => {
            if (window.fullscreenViewer) {
                this.originalViewer = window.fullscreenViewer;
                this.patchOriginalViewer();
                this.setupMarketClickInterceptors(); // ✨ NUEVO
                console.log('✅ Fullscreen Adapter Universal - Con click en texto/media para market');
            } else {
                setTimeout(checkViewer, 100);
            }
        };
        checkViewer();
    }

    // ✨ NUEVO: Interceptar clicks en posts del market
    setupMarketClickInterceptors() {
        // Click en texto de posts del market
        document.addEventListener('click', (e) => {
            // Buscar si el elemento clickeado está dentro de un market post
            const marketPost = e.target.closest('.market-post');
            if (!marketPost) return;

            // Verificar si se hizo click en el texto del post
            const textContent = e.target.closest('div[style*="line-height: 1.6"]');
            if (!textContent) return;

            // Excluir clicks en elementos interactivos
            if (e.target.closest('.hashtag') || 
                e.target.closest('.mention') || 
                e.target.closest('a') ||
                e.target.closest('button') ||
                e.target.closest('.post-menu-container')) {
                return;
            }

            // Abrir viewer
            e.preventDefault();
            e.stopPropagation();
            this.originalViewer.openViewer(marketPost);
        }, true);

        // Click en media de posts del market (imágenes/videos)
        document.addEventListener('click', (e) => {
            // Buscar si el elemento clickeado está dentro de un market post
            const marketPost = e.target.closest('.market-post');
            if (!marketPost) return;

            // Verificar si se hizo click en una imagen o video
            const isImage = e.target.tagName === 'IMG' && !e.target.closest('[onclick*="goToUserProfile"]');
            const isVideo = e.target.tagName === 'VIDEO';
            const videoContainer = e.target.closest('.video-container-custom');

            if (!isImage && !isVideo && !videoContainer) return;

            // Excluir clicks en controles de video
            if (e.target.closest('.custom-video-controls') || 
                e.target.closest('button') ||
                e.target.closest('.silenced-indicator') ||
                e.target.closest('.post-menu-container')) {
                return;
            }

            // Abrir viewer
            e.preventDefault();
            e.stopPropagation();
            this.originalViewer.openViewer(marketPost);
        }, true);

        console.log('✅ Interceptores de click para market configurados');
    }

    patchOriginalViewer() {
        const originalCreateMediaOnlyPost = this.originalViewer.createMediaOnlyPost.bind(this.originalViewer);
        const originalUpdateBottomBar = this.originalViewer.updateBottomBar.bind(this.originalViewer);
        const originalUpdatePostStats = this.originalViewer.updatePostStats.bind(this.originalViewer);
        const originalAttachPostActions = this.originalViewer.attachPostActions.bind(this.originalViewer);

        this.originalViewer.createMediaOnlyPost = (postElement) => {
            const postType = this.detectPostType(postElement);
            return this.createAdaptedMediaPost(postElement, postType, originalCreateMediaOnlyPost);
        };

        this.originalViewer.updateBottomBar = () => {
            const currentPost = this.originalViewer.posts[this.originalViewer.currentIndex];
            if (!currentPost) return;
            
            const postType = this.detectPostType(currentPost);
            this.updateAdaptedBottomBar(currentPost, postType);
        };

        this.originalViewer.updatePostStats = (postElement) => {
            const postType = this.detectPostType(postElement);
            this.updateAdaptedPostStats(postElement, postType);
        };

        this.originalViewer.attachPostActions = () => {
            this.attachAdaptedPostActions();
        };

        this.attachAdaptedPostActions();
    }

    detectPostType(postElement) {
        if (!postElement) return 'unknown';
        
        const postId = postElement.dataset?.postId || postElement.id || 'unknown';
        
        if (this.postTypeCache.has(postId)) {
            return this.postTypeCache.get(postId);
        }

        let type = 'normal';

        if (postElement.classList.contains('market-post') || 
            postElement.querySelector('.sale-price-btn') ||
            postElement.innerHTML.includes('Post en venta')) {
            type = 'market';
        }

        this.postTypeCache.set(postId, type);
        return type;
    }

    createAdaptedMediaPost(postElement, postType, originalFunction) {
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'fsv-media-only';
        mediaContainer.style.opacity = '1';
        mediaContainer.style.visibility = 'visible';

        let mediaElement = null;

        if (postType === 'market') {
            mediaElement = this.extractMarketMedia(postElement);
        } else {
            mediaElement = postElement.querySelector('.post-media video, .post-media img');
        }

        if (mediaElement) {
            const clonedMedia = this.cloneMediaElement(mediaElement, postElement);
            if (clonedMedia) {
                mediaContainer.appendChild(clonedMedia);
            }
        } else {
            const textContent = this.extractTextContent(postElement, postType);
            if (textContent) {
                mediaContainer.appendChild(textContent);
            }
        }

        return mediaContainer;
    }

    extractMarketMedia(postElement) {
        let mediaElement = postElement.querySelector('video');
        if (!mediaElement) {
            mediaElement = postElement.querySelector('img:not([alt*="avatar"]):not([onerror*="textContent"])');
        }
        
        return mediaElement;
    }

    cloneMediaElement(originalMedia, postElement) {
        if (!originalMedia) return null;

        if (originalMedia.tagName === 'VIDEO') {
            const video = originalMedia.cloneNode(true);
            video.removeAttribute('controls');
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('loop', '');
            video.className = 'fsv-video';

            const originalVideoInPost = postElement.querySelector('video');
            const isForcedSilent = (originalVideoInPost && originalVideoInPost.hasAttribute('data-silenciado') && 
                                   originalVideoInPost.getAttribute('data-silenciado') === 'true') ||
                                 (postElement.hasAttribute('data-silenciado') && 
                                  postElement.getAttribute('data-silenciado') === 'true');

            if (isForcedSilent) {
                video.muted = true;
                video.setAttribute('data-forced-silent', 'true');
            } else {
                video.muted = this.originalViewer.globalMuted;
                video.setAttribute('data-forced-silent', 'false');
            }

            video.style.opacity = '1';
            video.style.visibility = 'visible';
            video.style.animation = 'none';

            video.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.paused) {
                    video.play();
                    this.originalViewer.hideControls();
                } else {
                    video.pause();
                    this.originalViewer.showControls();
                }
            });

            video.addEventListener('play', () => this.originalViewer.hideControls());
            video.addEventListener('pause', () => this.originalViewer.showControls());

            return video;

        } else if (originalMedia.tagName === 'IMG') {
            const img = originalMedia.cloneNode(true);
            img.className = 'fsv-image';
            img.style.opacity = '1';
            img.style.visibility = 'visible';
            img.style.animation = 'none';
            return img;
        }

        return null;
    }

    extractTextContent(postElement, postType) {
        let contentElement = null;

        if (postType === 'market') {
            const contentDiv = Array.from(postElement.querySelectorAll('div')).find(div => {
                return div.style.marginBottom === '1rem' && 
                       div.style.lineHeight === '1.6' && 
                       div.textContent.trim().length > 0 &&
                       !div.querySelector('img, video, button, svg');
            });
            contentElement = contentDiv;
        } else {
            contentElement = postElement.querySelector('.post-content');
        }

        if (contentElement) {
            const textClone = contentElement.cloneNode(true);
            textClone.className = 'fsv-text-content';
            textClone.style.opacity = '1';
            textClone.style.visibility = 'visible';
            textClone.style.animation = 'none';
            return textClone;
        }

        return null;
    }

    updateAdaptedBottomBar(currentPost, postType) {
        const viewerContainer = this.originalViewer.viewerContainer;
        if (!viewerContainer || !currentPost) return;

        let avatar, username, meta, content;

        if (postType === 'market') {
            ({ avatar, username, meta, content } = this.extractMarketInfo(currentPost));
        } else {
            ({ avatar, username, meta, content } = this.extractNormalInfo(currentPost));
        }

        this.updateViewerElements(viewerContainer, { avatar, username, meta, content });
        
        this.updateAdaptedPostStats(currentPost, postType);
    }

    extractMarketInfo(currentPost) {
    // ============================================
    // AVATAR - BUSCAR DIRECTAMENTE
    // ============================================
    let avatar = currentPost.querySelector('.post-avatar');
    
    // Si no encuentra .post-avatar, buscar por estructura alternativa
    if (!avatar) {
        avatar = currentPost.querySelector('[data-username]');
    }
    
    // Si aún no encuentra, buscar contenedor con img de avatar
    if (!avatar) {
        const avatarImg = currentPost.querySelector('img[alt][onerror*="textContent"]');
        if (avatarImg) {
            avatar = avatarImg.parentElement;
        }
    }

    // ============================================
    // USERNAME
    // ============================================
    const usernameElement = currentPost.querySelector('.profile-link') || 
                           currentPost.querySelector('.post-author') ||
                           currentPost.querySelector('[onclick*="goToUserProfile"]');

    // ============================================
    // META
    // ============================================
    const metaContainer = currentPost.querySelector('.post-meta') ||
                         Array.from(currentPost.querySelectorAll('div')).find(div => 
                             div.textContent.includes('@') && 
                             (div.textContent.includes('•') || div.textContent.includes('CFT'))
                         );

    // ============================================
    // CONTENIDO
    // ============================================
    const contentDiv = currentPost.querySelector('.post-content') ||
                      Array.from(currentPost.querySelectorAll('div')).find(div => 
                          div.style.marginBottom === '1rem' && 
                          div.style.lineHeight === '1.6' &&
                          !div.querySelector('img, video, button, svg, .hashtag')
                      );

    return { 
        avatar: avatar, 
        username: usernameElement, 
        meta: metaContainer, 
        content: contentDiv 
    };
}

    extractNormalInfo(currentPost) {
        return {
            avatar: currentPost.querySelector('.post-avatar'),
            username: currentPost.querySelector('.post-author'),
            meta: currentPost.querySelector('.post-meta'),
            content: currentPost.querySelector('.post-content')
        };
    }

updateViewerElements(viewerContainer, { avatar, username, meta, content }) {
    // ============================================
    // AVATAR - CORREGIDO
    // ============================================
    const avatarContainer = viewerContainer.querySelector('.fsv-avatar');
    if (avatarContainer) {
        // Buscar imagen dentro del avatar original
        const avatarImg = avatar?.querySelector('img');
        
        if (avatarImg && avatarImg.src) {
            // Si hay imagen, usarla directamente
            const avatarUsername = avatar?.dataset?.username || username?.textContent?.replace('@', '').trim() || 'U';
            const initials = avatarUsername.substring(0, 2).toUpperCase();
            
            avatarContainer.innerHTML = `
                <img src="${avatarImg.src}" alt="${avatarUsername}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <span style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%;">${initials}</span>
            `;
        } else if (avatar) {
            // Fallback: copiar contenido o mostrar iniciales
            const avatarUsername = avatar?.dataset?.username || username?.textContent?.replace('@', '').trim() || 'U';
            const initials = avatarUsername.substring(0, 2).toUpperCase();
            
            // Verificar si el avatar tiene contenido de texto (iniciales)
            const avatarText = avatar.textContent?.trim();
            if (avatarText && avatarText.length <= 2) {
                avatarContainer.innerHTML = `
                    <span style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%;">${avatarText}</span>
                `;
            } else {
                avatarContainer.innerHTML = `
                    <span style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%;">${initials}</span>
                `;
            }
        }
    }

    // ============================================
    // USERNAME
    // ============================================
    const usernameContainer = viewerContainer.querySelector('.fsv-username');
    if (username && usernameContainer) {
        usernameContainer.textContent = username.textContent?.trim() || '';
    }

    // ============================================
    // META
    // ============================================
    const metaContainer = viewerContainer.querySelector('.fsv-user-meta');
    if (meta && metaContainer) {
        metaContainer.textContent = meta.textContent?.trim() || '';
    }

    // ============================================
    // CONTENIDO
    // ============================================
    const contentContainer = viewerContainer.querySelector('.fsv-post-content');
    if (content && contentContainer) {
        contentContainer.innerHTML = content.innerHTML || content.textContent || '';
    }
}

    updateAdaptedPostStats(postElement, postType) {
        const viewerContainer = this.originalViewer.viewerContainer;
        if (!viewerContainer) return;

        if (postType === 'market') {
            this.updateMarketStats(postElement, viewerContainer);
        } else {
            this.updateNormalStats(postElement, viewerContainer);
        }

        this.updateBuyButton(postElement, postType, viewerContainer);
    }

    updateMarketStats(postElement, viewerContainer) {
        const likeBtn = postElement.querySelector('.card-stat[onclick*="toggleRealPostLike"]');
        if (likeBtn) {
            const isLiked = likeBtn.classList.contains('liked');
            const countText = likeBtn.textContent.match(/\d+/)?.[0] || '0';
            
            const viewerLikeBtn = viewerContainer.querySelector('.fsv-like-btn');
            if (viewerLikeBtn) {
                const likeIcon = viewerLikeBtn.querySelector('.fsv-like-icon');
                const likeCount = viewerLikeBtn.querySelector('.fsv-like-count');
                
                if (likeIcon) likeIcon.textContent = isLiked ? '❤️' : '🤍';
                if (likeCount) likeCount.textContent = countText;
                viewerLikeBtn.classList.toggle('liked', isLiked);

                const postId = postElement.dataset.postId;
                if (postId) viewerLikeBtn.dataset.postId = postId;
            }
        }

        const commentBtn = postElement.querySelector('.card-stat[onclick*="openComments"]');
        if (commentBtn) {
            const count = commentBtn.textContent.match(/\d+/)?.[0] || '0';
            const commentCount = viewerContainer.querySelector('.fsv-comment-count');
            if (commentCount) commentCount.textContent = count;
        }

        const repostBtn = postElement.querySelector('.card-stat[onclick*="toggleRealRepost"]');
        if (repostBtn) {
            const count = repostBtn.textContent.match(/\d+/)?.[0] || '0';
            const isReposted = repostBtn.classList.contains('reposted');
            
            const viewerRepostBtn = viewerContainer.querySelector('.fsv-repost-btn');
            if (viewerRepostBtn) {
                const repostCount = viewerRepostBtn.querySelector('.fsv-repost-count');
                if (repostCount) repostCount.textContent = count;
                viewerRepostBtn.classList.toggle('reposted', isReposted);

                const postId = postElement.dataset.postId;
                if (postId) viewerRepostBtn.dataset.postId = postId;
            }
        }
    }

updateNormalStats(postElement, viewerContainer) {
    console.log('🔍 updateNormalStats - Post ID:', postElement.dataset.postId);
    
    // ============================================
    // LIKE
    // ============================================
    const likeBtn = postElement.querySelector('.post-stat[onclick*="toggleRealPostLike"]');
    if (likeBtn) {
        const isLiked = likeBtn.classList.contains('liked');
        const likeCountSpan = likeBtn.querySelector('.like-count');
        const count = likeCountSpan ? parseInt(likeCountSpan.textContent) || 0 : 0;
        
        console.log('  ❤️ Like info:', { count, isLiked });
        
        const viewerLikeBtn = viewerContainer.querySelector('.fsv-like-btn');
        if (viewerLikeBtn) {
            const likeIcon = viewerLikeBtn.querySelector('.fsv-like-icon');
            const likeCount = viewerLikeBtn.querySelector('.fsv-like-count');
            
            if (likeIcon) likeIcon.textContent = isLiked ? '❤️' : '🤍';
            if (likeCount) likeCount.textContent = count;
            viewerLikeBtn.classList.toggle('liked', isLiked);

            // ✅ CRÍTICO: ASIGNAR EL POST ID
            const postId = postElement.dataset.postId?.replace('post-', '');
            if (postId) {
                viewerLikeBtn.dataset.postId = postId;
                console.log('  ✅ PostId asignado al viewer:', postId);
            }
        }
    }

    // ============================================
    // COMENTARIOS
    // ============================================
    const commentBtn = postElement.querySelector('[data-comments-count]');
    if (commentBtn) {
        const count = commentBtn.dataset.commentsCount || '0';
        const commentCount = viewerContainer.querySelector('.fsv-comment-count');
        if (commentCount) commentCount.textContent = count;
    }

    // ============================================
    // REPOST
    // ============================================
    const repostBtn = postElement.querySelector('[onclick*="toggleRealRepost"]');
    if (repostBtn) {
        const count = repostBtn.dataset.repostCount || '0';
        const isReposted = repostBtn.classList.contains('reposted');
        
        const viewerRepostBtn = viewerContainer.querySelector('.fsv-repost-btn');
        if (viewerRepostBtn) {
            const repostCount = viewerRepostBtn.querySelector('.fsv-repost-count');
            if (repostCount) repostCount.textContent = count;
            viewerRepostBtn.classList.toggle('reposted', isReposted);

            // ✅ CRÍTICO: ASIGNAR EL POST ID
            const postId = postElement.dataset.postId?.replace('post-', '');
            if (postId) {
                viewerRepostBtn.dataset.postId = postId;
            }
        }
    }

    // ============================================
    // SHARES
    // ============================================
    const shareBtn = postElement.querySelector('[onclick*="openShareModal"]');
    if (shareBtn) {
        // Método 1: data-share-count
        let shareCount = parseInt(shareBtn.getAttribute('data-share-count'));
        
        // Método 2: buscar span
        if (isNaN(shareCount) || shareCount === 0) {
            const shareCountSpan = shareBtn.querySelector('.share-count, .fsv-share-count');
            if (shareCountSpan) {
                shareCount = parseInt(shareCountSpan.textContent.trim()) || 0;
            }
        }
        
        // Método 3: extraer del texto
        if (isNaN(shareCount) || shareCount === 0) {
            const buttonText = shareBtn.textContent || shareBtn.innerText || '';
            const match = buttonText.match(/\d+/);
            shareCount = match ? parseInt(match[0]) : 0;
        }
        
        console.log('  📤 Shares:', shareCount);
        
        const viewerShareBtn = viewerContainer.querySelector('.fsv-share-btn');
        if (viewerShareBtn) {
            const shareCountElement = viewerShareBtn.querySelector('.fsv-share-count');
            if (shareCountElement) {
                shareCountElement.textContent = shareCount;
            }
            viewerShareBtn.dataset.shareCount = shareCount;
        }
    }
    
}

    updateBuyButton(postElement, postType, viewerContainer) {
        const buyBtn = viewerContainer.querySelector('.fsv-buy-btn');
        const buyPrice = buyBtn?.querySelector('.fsv-buy-price');
        
        if (!buyBtn || !buyPrice) return;

        let isForSale = false;
        let salePrice = 0;
        let postUsername = '';

if (postType === 'market') {
    const salePriceBtn = postElement.querySelector('.sale-price-btn');
    const saleIndicator = postElement.querySelector('.sale-indicator');
    
    if (salePriceBtn || saleIndicator) {
        isForSale = true;
        const priceElement = salePriceBtn || saleIndicator;
        const priceText = priceElement?.textContent || priceElement?.innerText || '';
        const priceMatch = priceText.match(/[\d.]+/);
        salePrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
    }
    // ✅ CORREGIDO: Obtener username desde .post-avatar
    const avatarElement = postElement.querySelector('.post-avatar[data-username]');
    postUsername = avatarElement?.dataset?.username?.toLowerCase() || '';
    
} else {
    const saleIndicator = postElement.querySelector('.sale-indicator');
    const salePriceBtn = postElement.querySelector('.sale-price-btn');
    
    if (saleIndicator || salePriceBtn) {
        isForSale = true;
        const priceElement = salePriceBtn || saleIndicator;
        const priceText = priceElement?.textContent || priceElement?.innerText || '';
        const priceMatch = priceText.match(/[\d.]+/);
        salePrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
    }
    // ✅ CORREGIDO: Obtener username desde .post-avatar
    const avatarElement = postElement.querySelector('.post-avatar[data-username]');
    postUsername = avatarElement?.dataset?.username?.toLowerCase() || '';
}

const currentUsername = window.CHAINFEED_CONFIG?.currentUser?.username?.toLowerCase();
const isOwner = currentUsername && postUsername && (postUsername === currentUsername);

if (isForSale && salePrice > 0) {
    const postId = postElement.dataset.postId?.replace('post-', '') || postElement.dataset.postId;
    if (postId) buyBtn.dataset.postId = postId;
    
if (!isOwner) {
    // ✅ NO es owner: Botón activo y clickeable
    buyBtn.style.cssText = 'display: flex !important; background: linear-gradient(135deg, #f59e0b, #d97706) !important; border: 1px solid #f59e0b !important; font-weight: 600; transition: all 0.2s ease; cursor: pointer; opacity: 1 !important; filter: none !important;';
    buyPrice.textContent = `Comprar ${salePrice.toFixed(2)} CFT`;
    buyBtn.disabled = false;
    buyBtn.title = '';
} else {
    // ❌ SÍ es owner: Botón visible pero bloqueado
    buyBtn.style.cssText = 'display: flex !important; background: linear-gradient(135deg, #f59e0b, #d97706) !important; border: 1px solid #f59e0b !important; font-weight: 600; transition: all 0.2s ease; cursor: not-allowed; opacity: 0.6 !important; filter: none !important; pointer-events: none;';
    buyPrice.textContent = `${salePrice.toFixed(2)} CFT`;
    buyBtn.disabled = true;
    buyBtn.title = '';
}

} else {
    // No está en venta: ocultar
    buyBtn.style.display = 'none';
}
    }

    attachAdaptedPostActions() {
        const viewerContainer = this.originalViewer.viewerContainer;
        if (!viewerContainer) return;

        this.removeExistingListeners(viewerContainer);

        const likeBtn = viewerContainer.querySelector('.fsv-like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', async () => {
                await this.handleAdaptedLike();
            });
        }

        const repostBtn = viewerContainer.querySelector('.fsv-repost-btn');
        if (repostBtn) {
            repostBtn.addEventListener('click', async () => {
                await this.handleAdaptedRepost();
            });
        }

        const commentBtn = viewerContainer.querySelector('.fsv-comment-btn');
        if (commentBtn) {
            commentBtn.addEventListener('click', () => {
                this.handleAdaptedComment();
            });
        }

        const shareBtn = viewerContainer.querySelector('.fsv-share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.handleAdaptedShare();
            });
        }

        const buyBtn = viewerContainer.querySelector('.fsv-buy-btn');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                this.handleAdaptedBuy();
            });

         buyBtn.addEventListener('mouseenter', () => {
    if (buyBtn.style.display !== 'none' && !buyBtn.disabled) {
        buyBtn.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
        buyBtn.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
        buyBtn.style.transform = 'scale(1.05)';
    }
});

buyBtn.addEventListener('mouseleave', () => {
    if (buyBtn.style.display !== 'none' && !buyBtn.disabled) {
        buyBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        buyBtn.style.boxShadow = 'none';
        buyBtn.style.transform = 'scale(1)';
    }
});
        }
    }

    removeExistingListeners(container) {
        const buttons = container.querySelectorAll('.fsv-like-btn, .fsv-repost-btn, .fsv-comment-btn, .fsv-share-btn, .fsv-buy-btn');
        buttons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
    }

async handleAdaptedLike() {
    try {
        const currentPost = this.originalViewer.posts[this.originalViewer.currentIndex];
        if (!currentPost) {
            console.error('❌ No hay post actual');
            return;
        }

        const postType = this.detectPostType(currentPost);
        console.log('🎯 Tipo de post detectado:', postType);
        
        let postId, originalLikeBtn;

        if (postType === 'market') {
            // Lógica para posts del market
            postId = currentPost.dataset.postId;
            originalLikeBtn = currentPost.querySelector('.card-stat[onclick*="toggleRealPostLike"]');
            console.log('📦 Post del market - ID:', postId);
        } else {
            // Lógica para posts normales
            const postIdFull = currentPost.dataset.postId; // "post-334"
            postId = postIdFull ? postIdFull.replace('post-', '') : null;
            originalLikeBtn = currentPost.querySelector('.post-stat[onclick*="toggleRealPostLike"]');
            
            console.log('📝 Post normal - ID completo:', postIdFull);
            console.log('📝 Post normal - ID limpio:', postId);
            console.log('📝 Botón encontrado:', !!originalLikeBtn);
        }

        if (!postId) {
            console.error('❌ No se pudo obtener el ID del post');
            console.log('Dataset completo:', currentPost.dataset);
            return;
        }

        if (!originalLikeBtn) {
            console.error('❌ No se encontró el botón de like original');
            console.log('HTML del post:', currentPost.innerHTML.substring(0, 500));
            return;
        }

        // 🔥 ACTUALIZACIÓN OPTIMISTA EN EL VIEWER
        const viewerLikeBtn = this.originalViewer.viewerContainer.querySelector('.fsv-like-btn');
        const likeIcon = viewerLikeBtn?.querySelector('.fsv-like-icon');
        const likeCountElement = viewerLikeBtn?.querySelector('.fsv-like-count');
        
        if (viewerLikeBtn && likeIcon && likeCountElement) {
            const wasLiked = viewerLikeBtn.classList.contains('liked');
            const currentCount = parseInt(likeCountElement.textContent) || 0;
            
            // Actualizar UI del viewer inmediatamente
            viewerLikeBtn.classList.toggle('liked', !wasLiked);
            likeIcon.textContent = wasLiked ? '🤍' : '❤️';
            likeCountElement.textContent = wasLiked ? currentCount - 1 : currentCount + 1;
        }

// Ejecutar la función original
        if (window.toggleRealPostLike) {
            console.log('💓 Ejecutando like para post:', postId);
            
            // ✅ ESPERAR LA RESPUESTA DE LA API
            const response = await window.toggleRealPostLike(originalLikeBtn, parseInt(postId));
            
            // ✅ USAR LOS DATOS DE LA RESPUESTA API DIRECTAMENTE
            if (response && response.success) {
                const newCount = response.new_like_count;
                const isLiked = response.liked;
                
                console.log(`✅ API respondió: ${newCount} likes, liked: ${isLiked}`);
                
                // Actualizar UI del viewer con datos correctos de la API
                if (likeIcon) likeIcon.textContent = isLiked ? '❤️' : '🤍';
                if (likeCountElement) likeCountElement.textContent = newCount;
                if (viewerLikeBtn) {
                    if (isLiked) {
                        viewerLikeBtn.classList.add('liked');
                    } else {
                        viewerLikeBtn.classList.remove('liked');
                    }
                }
                
                console.log('✅ Viewer actualizado con datos de API');
            } else {
                console.warn('⚠️ No se pudo obtener respuesta de la API');
                
                // Fallback: actualizar desde el post original después de un delay
                setTimeout(() => {
                    this.originalViewer.updateBottomBar();
                }, 300);
            }
        }

    } catch (error) {
        console.error('❌ Error en like adaptado:', error);
        
        // 🔥 REVERTIR EN CASO DE ERROR
        const viewerLikeBtn = this.originalViewer.viewerContainer.querySelector('.fsv-like-btn');
        if (viewerLikeBtn) {
            const wasLiked = !viewerLikeBtn.classList.contains('liked');
            const likeIcon = viewerLikeBtn.querySelector('.fsv-like-icon');
            const likeCountElement = viewerLikeBtn.querySelector('.fsv-like-count');
            const currentCount = parseInt(likeCountElement?.textContent || '0');
            
            viewerLikeBtn.classList.toggle('liked', wasLiked);
            if (likeIcon) likeIcon.textContent = wasLiked ? '❤️' : '🤍';
            if (likeCountElement) likeCountElement.textContent = wasLiked ? currentCount + 1 : currentCount - 1;
        }
        
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al procesar like', 'error');
        }
    }
}

async handleAdaptedRepost() {
    try {
        const currentPost = this.originalViewer.posts[this.originalViewer.currentIndex];
        if (!currentPost) return;

        const postType = this.detectPostType(currentPost);
        let postId, originalRepostBtn;

        if (postType === 'market') {
            postId = currentPost.dataset.postId;
            originalRepostBtn = currentPost.querySelector('.card-stat[onclick*="toggleRealRepost"]');
        } else {
            postId = currentPost.dataset.postId?.replace('post-', '');
            const originalPost = document.querySelector(`[data-post-id="post-${postId}"]`);
            originalRepostBtn = originalPost?.querySelector('[data-repost-count]');
        }

        if (!postId || !originalRepostBtn) {
            console.error('No se pudo encontrar post ID o botón original para repost');
            return;
        }

        // 🔥 ACTUALIZACIÓN OPTIMISTA EN EL VIEWER
        const viewerRepostBtn = this.originalViewer.viewerContainer.querySelector('.fsv-repost-btn');
        const repostCountElement = viewerRepostBtn?.querySelector('.fsv-repost-count');
        
        if (viewerRepostBtn && repostCountElement) {
            const wasReposted = viewerRepostBtn.classList.contains('reposted');
            const currentCount = parseInt(repostCountElement.textContent) || 0;
            
            // Actualizar UI del viewer inmediatamente
            viewerRepostBtn.classList.toggle('reposted', !wasReposted);
            repostCountElement.textContent = wasReposted ? currentCount - 1 : currentCount + 1;
        }

        // Ejecutar la función original
        if (window.toggleRealRepost) {
            await window.toggleRealRepost(originalRepostBtn, parseInt(postId));
            
            // Actualizar con datos reales
            setTimeout(() => {
                this.originalViewer.updateBottomBar();
            }, 150);
        }

    } catch (error) {
        console.error('Error en repost adaptado:', error);
        
        // 🔥 REVERTIR EN CASO DE ERROR
        const viewerRepostBtn = this.originalViewer.viewerContainer.querySelector('.fsv-repost-btn');
        if (viewerRepostBtn) {
            const wasReposted = !viewerRepostBtn.classList.contains('reposted');
            const repostCountElement = viewerRepostBtn.querySelector('.fsv-repost-count');
            const currentCount = parseInt(repostCountElement?.textContent || '0');
            
            viewerRepostBtn.classList.toggle('reposted', wasReposted);
            if (repostCountElement) {
                repostCountElement.textContent = wasReposted ? currentCount + 1 : currentCount - 1;
            }
        }
        
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al procesar repost', 'error');
        }
    }
}

handleAdaptedComment() {
    try {
        const currentPost = this.originalViewer.posts[this.originalViewer.currentIndex];
        if (!currentPost) return;

        const postType = this.detectPostType(currentPost);
        let originalCommentBtn;

        if (postType === 'market') {
            originalCommentBtn = currentPost.querySelector('.card-stat[onclick*="openComments"]');
        } else {
            originalCommentBtn = currentPost.querySelector('[data-comments-count]');
        }

        if (originalCommentBtn && window.openComments) {
            console.log('💬 Abriendo comentarios desde viewer');
            window.openComments(originalCommentBtn);
            
            // ✅ OBSERVAR EL MODAL DE COMENTARIOS PARA SINCRONIZAR AL CERRAR
            const commentsModal = document.getElementById('commentsModal');
            if (commentsModal) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'class') {
                            const isActive = commentsModal.classList.contains('active');
                            
                            if (!isActive) {
                                console.log('✅ Modal de comentarios cerrado, sincronizando...');
                                
                                // Esperar un poco y sincronizar múltiples veces
                                [100, 300, 600].forEach(delay => {
                                    setTimeout(() => {
                                        // Actualizar el post original primero
                                        if (originalCommentBtn) {
                                            const newCount = originalCommentBtn.dataset.commentsCount || 
                                                           originalCommentBtn.querySelector('.comment-count')?.textContent || '0';
                                            
                                            console.log(`  📊 Nuevo contador de comentarios: ${newCount}`);
                                            
                                            // Actualizar en el viewer
                                            const viewerCommentCount = this.originalViewer.viewerContainer.querySelector('.fsv-comment-count');
                                            if (viewerCommentCount) {
                                                viewerCommentCount.textContent = newCount;
                                            }
                                        }
                                        
                                        // También llamar al updateBottomBar completo
                                        this.originalViewer.updateBottomBar();
                                    }, delay);
                                });
                                
                                observer.disconnect();
                            }
                        }
                    });
                });
                
                observer.observe(commentsModal, { 
                    attributes: true,
                    attributeFilter: ['class']
                });
            }
        }

    } catch (error) {
        console.error('Error en comentarios adaptado:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al abrir comentarios', 'error');
        }
    }
}

    handleAdaptedShare() {
        try {
            const currentPost = this.originalViewer.posts[this.originalViewer.currentIndex];
            if (!currentPost) return;

            const postType = this.detectPostType(currentPost);
            let originalShareBtn;

            if (postType === 'market') {
                originalShareBtn = currentPost.querySelector('.card-stat[onclick*="openShareModal"]');
            } else {
                originalShareBtn = currentPost.querySelector('[onclick*="openShareModal"]');
            }

            if (originalShareBtn && window.openShareModal) {
                window.openShareModal(originalShareBtn);
            } else if (typeof showNotification === 'function') {
                showNotification('🔗 Función de compartir disponible próximamente');
            }

        } catch (error) {
            console.error('Error en compartir adaptado:', error);
        }
    }

    handleAdaptedBuy() {
        try {
            const currentPost = this.originalViewer.posts[this.originalViewer.currentIndex];
            if (!currentPost) return;

            const buyBtn = this.originalViewer.viewerContainer.querySelector('.fsv-buy-btn');
            const postId = buyBtn?.dataset.postId;

            if (!postId) {
                console.error('No se encontró post ID para compra');
                return;
            }

            if (typeof window.buyPost === 'function') {
                this.originalViewer.purchaseInProgress = true;
                window.buyPost(postId);
                this.originalViewer.hideControls();
                this.setupPurchaseCompleteListener();
            } else {
                console.error('buyPost function not found');
                if (typeof showNotification === 'function') {
                    showNotification('❌ Sistema de compra no disponible', 'error');
                }
            }

        } catch (error) {
            console.error('Error en compra adaptada:', error);
            if (typeof showNotification === 'function') {
                showNotification('❌ Error al procesar compra', 'error');
            }
        }
    }

    setupPurchaseCompleteListener() {
        const successHandler = (e) => {
            if (e.detail?.success || e.type === 'purchaseSuccess' || e.type === 'postPurchased') {
                this.reloadAfterPurchase();
            }
        };
        
        window.addEventListener('purchaseSuccess', successHandler, { once: true });
        window.addEventListener('postPurchased', successHandler, { once: true });
        document.addEventListener('purchaseComplete', successHandler, { once: true });
        
        const notificationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const text = node.textContent?.toLowerCase() || '';
                        if (text.includes('compra exitosa') || 
                            text.includes('comprado con éxito') ||
                            text.includes('purchase successful') ||
                            text.includes('post comprado')) {
                            notificationObserver.disconnect();
                            this.reloadAfterPurchase();
                        }
                    }
                });
            });
        });
        
        notificationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        const checkModalClosed = setInterval(() => {
            const buyModal = document.querySelector('#buyModal, .buy-modal, [class*="buy-modal"], [id*="buy"], [id*="purchase"]');
            
            if (buyModal) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && 
                            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                            
                            const modalHidden = buyModal.style.display === 'none' || 
                                              buyModal.style.visibility === 'hidden' ||
                                              buyModal.style.opacity === '0' ||
                                              !buyModal.classList.contains('active') ||
                                              !buyModal.classList.contains('show') ||
                                              !buyModal.classList.contains('open');
                            
                            if (modalHidden && this.originalViewer.purchaseInProgress) {
                                observer.disconnect();
                                clearInterval(checkModalClosed);
                                notificationObserver.disconnect();
                                this.reloadAfterPurchase();
                            }
                        }
                    });
                });
                
                observer.observe(buyModal, {
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
                
                clearInterval(checkModalClosed);
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(checkModalClosed);
            notificationObserver.disconnect();
            if (this.originalViewer.purchaseInProgress) {
                this.originalViewer.purchaseInProgress = false;
            }
        }, 30000);
    }
    
    reloadAfterPurchase() {
        if (!this.originalViewer.purchaseInProgress) return;
        
        this.originalViewer.purchaseInProgress = false;
        
        setTimeout(() => {
            location.reload();
        }, 500);
    }
}

// Inicialización automática
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.fullscreenPostAdapter = new FullscreenPostAdapter();
    });
} else {
    window.fullscreenPostAdapter = new FullscreenPostAdapter();
}

console.log('✅ Fullscreen Post Adapter Universal - Con click en texto/media para market');