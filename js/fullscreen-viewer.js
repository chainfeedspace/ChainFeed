/**
 * FULLSCREEN VIEWER - Navegación tipo Instagram/TikTok
 * Con barra inferior deslizante para información del post
 * Control de sonido global para videos sin data-silenciado="true"
 * Timer de controles reiniciable con interacciones
 * Sistema de compra/venta integrado con recarga automática
 * ✨ NUEVO: Abrir viewer al tocar texto, imágenes o videos
 */

class FullscreenPostViewer {
    constructor() {
        this.isActive = false;
        this.currentIndex = 0;
        this.posts = [];
        this.viewerContainer = null;
        this.startY = 0;
        this.isDragging = false;
        this.threshold = 50;
        this.hideButtonTimeout = null;
        this.currentPostData = null;
        this.isNavigating = false;
        this.globalMuted = false;
        this.purchaseInProgress = false;

        this.init();
    }

    init() {
        this.createViewerHTML();
        this.attachEventListeners();
        this.interceptFullscreenButtons();
    }

    createViewerHTML() {
        const viewer = document.createElement('div');
        viewer.id = 'fullscreen-post-viewer';
        viewer.className = 'fsv-container';
        viewer.innerHTML = `
            <div class="fsv-wrapper">
                <div class="fsv-posts-container">
                    <!-- Los posts se cargarán dinámicamente aquí -->
                </div>
                
                <!-- Controles de navegación lateral (desktop) -->
                <div class="fsv-navigation">
                    <button class="fsv-nav-btn fsv-prev" aria-label="Post anterior">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                        </svg>
                    </button>
                    <button class="fsv-nav-btn fsv-next" aria-label="Siguiente post">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Botón de salir (flecha hacia atrás) -->
                <button class="fsv-close-btn" aria-label="Salir">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>
                
                <!-- Botón de control de sonido -->
                <button class="fsv-sound-btn" aria-label="Controlar sonido" style="display: none;">
                    <svg class="fsv-sound-on" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    <svg class="fsv-sound-off" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                </button>
                
                <!-- Barra inferior deslizante con información del post -->
                <div class="fsv-bottom-bar">
                    <div class="fsv-bar-handle"></div>
                    <div class="fsv-bar-content">
                        <div class="fsv-user-info">
                            <div class="fsv-avatar"></div>
                            <div class="fsv-user-details">
                                <div class="fsv-username"></div>
                                <div class="fsv-user-meta"></div>
                            </div>
                        </div>
                        <div class="fsv-post-content"></div>
                        <div class="fsv-post-actions">
                            <button class="fsv-action-btn fsv-like-btn" data-action="like">
                                <span class="fsv-like-icon">🤍</span>
                                <span class="fsv-like-count">0</span>
                            </button>
                            <button class="fsv-action-btn fsv-comment-btn" data-action="comment">
                                <span>💬</span>
                                <span class="fsv-comment-count">0</span>
                            </button>
                            <button class="fsv-action-btn fsv-repost-btn" data-action="repost">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                                </svg>
                                <span class="fsv-repost-count">0</span>
                            </button>
                            <button class="fsv-action-btn fsv-share-btn" data-action="share">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                                </svg>
                                <span class="fsv-share-count">0</span>
                            </button>
                            <button class="fsv-action-btn fsv-buy-btn" data-action="buy" style="display: none; background: linear-gradient(135deg, #f59e0b, #d97706); border-color: #f59e0b; font-weight: 600; transition: all 0.2s ease;">
                                <span>💰</span>
                                <span class="fsv-buy-price">0 CFT</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(viewer);
        this.viewerContainer = viewer;
    }

    interceptFullscreenButtons() {
        // Botón fullscreen original
        document.addEventListener('click', (e) => {
            const fullscreenBtn = e.target.closest('.fullscreen-btn');
            if (fullscreenBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const postCard = fullscreenBtn.closest('.post-card');
                if (postCard) {
                    this.openViewer(postCard);
                }
            }
        }, true);

        // ✨ NUEVO: Click en texto del post
        document.addEventListener('click', (e) => {
            const postContent = e.target.closest('.post-content');
            if (!postContent) return;
            
            // Excluir clicks en elementos interactivos dentro del contenido
            if (e.target.closest('.hashtag') || 
                e.target.closest('.mention') || 
                e.target.closest('a')) {
                return;
            }
            
            const postCard = postContent.closest('.post-card');
            if (postCard) {
                e.preventDefault();
                e.stopPropagation();
                this.openViewer(postCard);
            }
        }, true);

        // ✨ NUEVO: Click en media (imagen/video)
        document.addEventListener('click', (e) => {
            const postMedia = e.target.closest('.post-media');
            if (!postMedia) return;
            
            // Excluir clicks en controles de video
            if (e.target.closest('.custom-video-controls') || 
                e.target.closest('button') ||
                e.target.closest('.silenced-indicator')) {
                return;
            }
            
            const postCard = postMedia.closest('.post-card');
            if (postCard) {
                e.preventDefault();
                e.stopPropagation();
                this.openViewer(postCard);
            }
        }, true);
    }

    openViewer(triggerPostElement) {
        this.posts = Array.from(document.querySelectorAll('.post-card'));
        
        if (this.posts.length === 0) {
            console.error('No se encontraron posts con clase .post-card');
            return;
        }
        
        this.currentIndex = this.posts.indexOf(triggerPostElement);
        if (this.currentIndex === -1) this.currentIndex = 0;
        
        this.isActive = true;
        this.viewerContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.hideControls();
        this.renderPosts();
        this.updateBottomBar();
        
        setTimeout(() => {
            this.playCurrentVideo();
            this.updateSoundButtonVisibility();
        }, 100);
    }

    renderPosts() {
        const container = this.viewerContainer.querySelector('.fsv-posts-container');
        container.innerHTML = '';
        
        const indices = [
            this.currentIndex - 1,
            this.currentIndex,
            this.currentIndex + 1
        ];
        
        indices.forEach((index, position) => {
            if (index >= 0 && index < this.posts.length) {
                const postClone = this.createMediaOnlyPost(this.posts[index]);
                postClone.classList.add('fsv-post');
                postClone.dataset.position = position - 1;
                postClone.dataset.originalIndex = index;
                
                postClone.style.opacity = '1';
                postClone.style.visibility = 'visible';
                
                if (position === 0) {
                    postClone.style.transform = 'translateY(-100vh)';
                } else if (position === 1) {
                    postClone.style.transform = 'translateY(0)';
                } else if (position === 2) {
                    postClone.style.transform = 'translateY(100vh)';
                }
                
                container.appendChild(postClone);
            }
        });
        
        this.updateNavigationButtons();
    }

    createMediaOnlyPost(postElement) {
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'fsv-media-only';
        
        mediaContainer.style.opacity = '1';
        mediaContainer.style.visibility = 'visible';
        
        const originalMedia = postElement.querySelector('.post-media video, .post-media img');
        
        if (originalMedia) {
            if (originalMedia.tagName === 'VIDEO') {
                const video = originalMedia.cloneNode(true);
                video.removeAttribute('controls');
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                video.className = 'fsv-video';
                
                const isForcedSilent = originalMedia.hasAttribute('data-silenciado') && 
                                     originalMedia.getAttribute('data-silenciado') === 'true';
                
                if (isForcedSilent) {
                    video.muted = true;
                    video.setAttribute('data-forced-silent', 'true');
                } else {
                    video.muted = this.globalMuted;
                    video.setAttribute('data-forced-silent', 'false');
                }
                
                video.style.opacity = '1';
                video.style.visibility = 'visible';
                video.style.animation = 'none';
                
                video.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (video.paused) {
                        video.play();
                        this.hideControls();
                    } else {
                        video.pause();
                        this.showControls();
                    }
                });
                
                video.addEventListener('play', () => this.hideControls());
                video.addEventListener('pause', () => this.showControls());
                
                mediaContainer.appendChild(video);
                
            } else if (originalMedia.tagName === 'IMG') {
                const img = originalMedia.cloneNode(true);
                img.className = 'fsv-image';
                img.style.opacity = '1';
                img.style.visibility = 'visible';
                img.style.animation = 'none';
                mediaContainer.appendChild(img);
            }
        } else {
            const content = postElement.querySelector('.post-content');
            if (content) {
                const contentClone = content.cloneNode(true);
                contentClone.className = 'fsv-text-content';
                contentClone.style.opacity = '1';
                contentClone.style.visibility = 'visible';
                contentClone.style.animation = 'none';
                mediaContainer.appendChild(contentClone);
            }
        }
        
        return mediaContainer;
    }

updateBottomBar() {
    const currentPost = this.posts[this.currentIndex];
    if (!currentPost) return;
    
    // ============================================
    // AVATAR - CORREGIDO
    // ============================================
    const avatarContainer = this.viewerContainer.querySelector('.fsv-avatar');
    const avatarImg = currentPost.querySelector('.post-avatar img');
    const avatarDiv = currentPost.querySelector('.post-avatar');
    
    if (avatarContainer) {
        const avatarUsername = avatarDiv?.dataset?.username || 'U';
        const initials = avatarUsername.substring(0, 2).toUpperCase();
        
        if (avatarImg && avatarImg.src) {
            avatarContainer.innerHTML = `
                <img src="${avatarImg.src}" alt="${avatarUsername}" 
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <span style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%;">${initials}</span>
            `;
        } else {
            avatarContainer.innerHTML = `
                <span style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%;">${initials}</span>
            `;
        }
    }
    
    // ============================================
    // USERNAME
    // ============================================
    const usernameElement = currentPost.querySelector('.post-author');
    const usernameContainer = this.viewerContainer.querySelector('.fsv-username');
    if (usernameElement && usernameContainer) {
        usernameContainer.textContent = usernameElement.textContent.trim();
    }
    
    // ============================================
    // META
    // ============================================
    const meta = currentPost.querySelector('.post-meta');
    const metaContainer = this.viewerContainer.querySelector('.fsv-user-meta');
    if (meta && metaContainer) {
        metaContainer.textContent = meta.textContent.trim();
    }
    
    // ============================================
    // CONTENIDO
    // ============================================
    const content = currentPost.querySelector('.post-content');
    const contentContainer = this.viewerContainer.querySelector('.fsv-post-content');
    if (content && contentContainer) {
        contentContainer.innerHTML = content.innerHTML;
    }
    
    // ============================================
    // STATS
    // ============================================
    this.updatePostStats(currentPost);
}

updatePostStats(postElement) {
    console.log('📊 Actualizando stats del fullscreen desde post:', postElement.dataset.postId);
    
    // ============================================
    // LIKE - LECTURA MEJORADA CON REINTENTOS
    // ============================================
    const likeBtn = postElement.querySelector('.post-stat[onclick*="toggleRealPostLike"]');
    if (likeBtn) {
        const isLiked = likeBtn.classList.contains('liked');
        
        // ✅ MÉTODO 1: Buscar span específico
        let likeCount = 0;
        let likeCountSpan = likeBtn.querySelector('.like-count');
        
        if (likeCountSpan) {
            likeCount = parseInt(likeCountSpan.textContent.trim()) || 0;
            console.log(`   ❤️ Método 1 - Likes: ${likeCount}`);
        } else {
            // ✅ MÉTODO 2: Buscar cualquier span con números
            const allSpans = Array.from(likeBtn.querySelectorAll('span'));
            const countSpan = allSpans.find(span => /^\d+$/.test(span.textContent.trim()));
            
            if (countSpan) {
                likeCount = parseInt(countSpan.textContent.trim()) || 0;
                console.log(`   ❤️ Método 2 - Likes: ${likeCount}`);
            } else {
                // ✅ MÉTODO 3: Regex sobre texto completo
                const buttonText = likeBtn.textContent || '';
                const match = buttonText.match(/\d+/);
                likeCount = match ? parseInt(match[0]) : 0;
                console.log(`   ❤️ Método 3 - Likes: ${likeCount}`);
            }
        }
        
        // Actualizar UI del viewer
        const viewerLikeBtn = this.viewerContainer.querySelector('.fsv-like-btn');
        const likeIcon = viewerLikeBtn.querySelector('.fsv-like-icon');
        const likeCountElement = viewerLikeBtn.querySelector('.fsv-like-count');
        
        likeIcon.textContent = isLiked ? '❤️' : '🤍';
        likeCountElement.textContent = likeCount;
        viewerLikeBtn.classList.toggle('liked', isLiked);
        
        const postId = postElement.dataset.postId?.replace('post-', '');
        if (postId) {
            viewerLikeBtn.dataset.postId = postId;
            viewerLikeBtn.dataset.likeCount = likeCount;
        }
    }
    
    // ============================================
    // COMENTARIOS
    // ============================================
    const commentBtn = postElement.querySelector('[data-comments-count]');
    if (commentBtn) {
        let commentCount = parseInt(commentBtn.getAttribute('data-comments-count')) || 0;
        
        if (commentCount === 0) {
            const commentCountSpan = commentBtn.querySelector('.comment-count');
            if (commentCountSpan) {
                commentCount = parseInt(commentCountSpan.textContent) || 0;
            } else {
                const match = commentBtn.textContent.match(/\d+/);
                commentCount = match ? parseInt(match[0]) : 0;
            }
        }
        
        console.log(`   💬 Comentarios: ${commentCount}`);
        
        const viewerCommentCount = this.viewerContainer.querySelector('.fsv-comment-count');
        if (viewerCommentCount) {
            viewerCommentCount.textContent = commentCount;
        }
        
        const viewerCommentBtn = this.viewerContainer.querySelector('.fsv-comment-btn');
        if (viewerCommentBtn) {
            viewerCommentBtn.dataset.commentsCount = commentCount;
        }
    }
    
    // ============================================
    // REPOST
    // ============================================
    const repostBtn = postElement.querySelector('[onclick*="toggleRealRepost"]');
    if (repostBtn) {
        const repostCount = parseInt(repostBtn.dataset.repostCount || repostBtn.textContent.match(/\d+/)?.[0] || '0');
        const isReposted = repostBtn.classList.contains('reposted');
        
        console.log(`   🔄 Reposts: ${repostCount}, Reposted: ${isReposted}`);
        
        const viewerRepostBtn = this.viewerContainer.querySelector('.fsv-repost-btn');
        viewerRepostBtn.querySelector('.fsv-repost-count').textContent = repostCount;
        viewerRepostBtn.classList.toggle('reposted', isReposted);
        
        const postId = postElement.dataset.postId?.replace('post-', '');
        if (postId) {
            viewerRepostBtn.dataset.postId = postId;
            viewerRepostBtn.dataset.repostCount = repostCount;
        }
    }
    
    // Botón de compra
    this.updateBuyButton(postElement);
    
    // ============================================
    // SHARES
    // ============================================
    const shareBtn = postElement.querySelector('[onclick*="openShareModal"]');
    
    if (shareBtn) {
        // Método 1: data-share-count
        let shareCount = parseInt(shareBtn.getAttribute('data-share-count'));
        
        // Método 2: buscar span con clase share-count
        if (isNaN(shareCount) || shareCount === 0) {
            const shareCountSpan = shareBtn.querySelector('.share-count, .fsv-share-count');
            if (shareCountSpan) {
                shareCount = parseInt(shareCountSpan.textContent.trim()) || 0;
            }
        }
        
        // Método 3: extraer número del textContent
        if (isNaN(shareCount) || shareCount === 0) {
            const buttonText = shareBtn.textContent || shareBtn.innerText || '';
            const match = buttonText.match(/\d+/);
            shareCount = match ? parseInt(match[0]) : 0;
        }
        
        console.log(`   📤 Shares: ${shareCount}`);
        
        // Actualizar UI del viewer
        const viewerShareBtn = this.viewerContainer.querySelector('.fsv-share-btn');
        if (viewerShareBtn) {
            const shareCountElement = viewerShareBtn.querySelector('.fsv-share-count');
            if (shareCountElement) {
                shareCountElement.textContent = shareCount;
            }
            viewerShareBtn.dataset.shareCount = shareCount;
        }
    }
    
    console.log('✅ Stats actualizados con métodos de respaldo');
}

  updateBuyButton(postElement) {
        const buyBtn = this.viewerContainer.querySelector('.fsv-buy-btn');
        const buyPrice = buyBtn.querySelector('.fsv-buy-price');
        
        // Detectar si el post está en venta
        const saleIndicator = postElement.querySelector('.sale-indicator');
        const salePriceBtn = postElement.querySelector('.sale-price-btn');
        
        let isForSale = false;
        let salePrice = 0;
        
        if (saleIndicator || salePriceBtn) {
            isForSale = true;
            const priceElement = salePriceBtn || saleIndicator;
            const priceText = priceElement?.textContent || '';
            const priceMatch = priceText.match(/[\d.]+/);
            salePrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
        }
        
        // ✅ CORREGIDO: Obtener username desde .post-avatar
        const avatarElement = postElement.querySelector('.post-avatar[data-username]');
        const postUsername = avatarElement?.dataset?.username?.toLowerCase();
        const currentUsername = window.CHAINFEED_CONFIG?.currentUser?.username?.toLowerCase();
        const isOwner = currentUsername && postUsername && (postUsername === currentUsername);
        
        // Si NO está en venta, ocultar
        if (!isForSale || salePrice <= 0) {
            buyBtn.style.display = 'none';
            return;
        }
        
        // Está en venta - mostrar botón
        buyBtn.style.display = 'flex';
        const postId = postElement.dataset.postId?.replace('post-', '');
        if (postId) buyBtn.dataset.postId = postId;
        
        if (isOwner) {
            // ES EL DUEÑO: Bloqueado (gris)
            buyBtn.style.cssText = 'display: flex; background: linear-gradient(135deg, #6b7280, #4b5563); border-color: #6b7280; font-weight: 600; opacity: 0.6; cursor: not-allowed; pointer-events: none;';
            buyBtn.disabled = true;
            buyPrice.textContent = `Tu post • ${salePrice.toFixed(2)} CFT`;
        } else {
            // NO ES DUEÑO: Activo (naranja)
            buyBtn.style.cssText = 'display: flex; background: linear-gradient(135deg, #f59e0b, #d97706); border-color: #f59e0b; font-weight: 600; opacity: 1; cursor: pointer; pointer-events: auto;';
            buyBtn.disabled = false;
            buyPrice.textContent = `Comprar ${salePrice.toFixed(2)} CFT`;
        }
    }

    updateSoundButtonVisibility() {
        const currentPost = this.viewerContainer.querySelector('.fsv-post[data-position="0"]');
        const video = currentPost?.querySelector('video');
        const soundBtn = this.viewerContainer.querySelector('.fsv-sound-btn');
        
        if (video && video.getAttribute('data-forced-silent') === 'false') {
            soundBtn.style.display = 'block';
            this.updateSoundButton();
        } else {
            soundBtn.style.display = 'none';
        }
    }

    updateSoundButton() {
        const soundBtn = this.viewerContainer.querySelector('.fsv-sound-btn');
        const soundOnIcon = soundBtn.querySelector('.fsv-sound-on');
        const soundOffIcon = soundBtn.querySelector('.fsv-sound-off');
        
        if (this.globalMuted) {
            soundOnIcon.style.display = 'none';
            soundOffIcon.style.display = 'block';
            soundBtn.classList.add('muted');
        } else {
            soundOnIcon.style.display = 'block';
            soundOffIcon.style.display = 'none';
            soundBtn.classList.remove('muted');
        }
    }

    toggleGlobalSound() {
        this.globalMuted = !this.globalMuted;
        this.updateSoundButton();
        this.applySoundStateToCurrentVideo();
        
        console.log('Estado global de sonido:', this.globalMuted ? 'Silenciado' : 'Con sonido');
    }

    applySoundStateToCurrentVideo() {
        const currentPost = this.viewerContainer.querySelector('.fsv-post[data-position="0"]');
        const video = currentPost?.querySelector('video');
        
        if (video && video.getAttribute('data-forced-silent') === 'false') {
            video.muted = this.globalMuted;
        }
    }

    restartHideTimer() {
        if (this.hideButtonTimeout) {
            clearTimeout(this.hideButtonTimeout);
        }
        this.hideButtonTimeout = setTimeout(() => {
            this.hideControls();
        }, 4000);
    }

    showControls() {
        if (this.isNavigating) return;
        
        this.viewerContainer.querySelector('.fsv-close-btn').classList.add('visible');
        this.viewerContainer.querySelector('.fsv-bottom-bar').classList.add('visible');
        
        const soundBtn = this.viewerContainer.querySelector('.fsv-sound-btn');
        if (soundBtn.style.display === 'block') {
            soundBtn.classList.add('visible');
        }
        
        this.restartHideTimer();
    }
    
    hideControls() {
        this.viewerContainer.querySelector('.fsv-close-btn').classList.remove('visible');
        this.viewerContainer.querySelector('.fsv-bottom-bar').classList.remove('visible');
        this.viewerContainer.querySelector('.fsv-sound-btn').classList.remove('visible');
        
        if (this.hideButtonTimeout) {
            clearTimeout(this.hideButtonTimeout);
        }
    }

    updateNavigationButtons() {
        const prevBtn = this.viewerContainer.querySelector('.fsv-prev');
        const nextBtn = this.viewerContainer.querySelector('.fsv-next');
        
        prevBtn.disabled = this.currentIndex === 0;
        nextBtn.disabled = this.currentIndex === this.posts.length - 1;
    }

    navigateToPost(index) {
        if (index < 0 || index >= this.posts.length) return;
        
        this.pauseCurrentVideo();
        
        const oldIndex = this.currentIndex;
        this.currentIndex = index;
        
        const container = this.viewerContainer.querySelector('.fsv-posts-container');
        
        this.isNavigating = true;
        
        this.hideControls();
        
        container.style.transition = 'transform 0.3s ease-out';
        
        if (index > oldIndex) {
            container.style.transform = `translateY(-100vh)`;
        } else {
            container.style.transform = `translateY(100vh)`;
        }
        
        setTimeout(() => {
            container.style.transition = 'none';
            container.style.transform = 'translateY(0)';
            this.renderPosts();
            this.updateBottomBar();
            
            setTimeout(() => {
                this.playCurrentVideo();
                this.updateSoundButtonVisibility();
                this.isNavigating = false;
            }, 50);
        }, 350);
    }

    playCurrentVideo() {
        const currentPost = this.viewerContainer.querySelector('.fsv-post[data-position="0"]');
        if (!currentPost) return;
        
        const video = currentPost.querySelector('video');
        if (video) {
            video.style.opacity = '1';
            video.style.visibility = 'visible';
            
            this.applySoundStateToCurrentVideo();
            
            video.play().catch((error) => {
                console.log('No se pudo reproducir automáticamente:', error);
            });
        }
    }

    pauseCurrentVideo() {
        const currentPost = this.viewerContainer.querySelector('.fsv-post[data-position="0"]');
        if (!currentPost) return;
        
        const video = currentPost.querySelector('video');
        if (video && !video.paused) {
            video.pause();
            video.muted = true;
            setTimeout(() => {
                this.applySoundStateToCurrentVideo();
            }, 400);
        }
    }

    closeViewer() {
        this.isActive = false;
        this.viewerContainer.classList.remove('active');
        document.body.style.overflow = '';
        
        this.pauseCurrentVideo();
        
        setTimeout(() => {
            const container = this.viewerContainer.querySelector('.fsv-posts-container');
            container.innerHTML = '';
        }, 300);
    }

    attachEventListeners() {
        // Click en área vacía
        this.viewerContainer.addEventListener('click', (e) => {
            if (e.target.closest('.fsv-bottom-bar') || 
                e.target.closest('button') || 
                e.target.closest('video')) {
                return;
            }
            
            const bottomBar = this.viewerContainer.querySelector('.fsv-bottom-bar');
            if (bottomBar.classList.contains('visible')) {
                this.hideControls();
            } else {
                this.showControls();
            }
        });

        const bottomBar = this.viewerContainer.querySelector('.fsv-bottom-bar');
        bottomBar.addEventListener('click', (e) => {
            if (bottomBar.classList.contains('visible')) {
                this.restartHideTimer();
            }
        });
        
        // Navegación
        this.viewerContainer.querySelector('.fsv-prev').addEventListener('click', () => {
            this.navigateToPost(this.currentIndex - 1);
        });
        
        this.viewerContainer.querySelector('.fsv-next').addEventListener('click', () => {
            this.navigateToPost(this.currentIndex + 1);
        });
        
        // Cerrar
        this.viewerContainer.querySelector('.fsv-close-btn').addEventListener('click', () => {
            this.closeViewer();
        });
        
        // Control de sonido
        this.viewerContainer.querySelector('.fsv-sound-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleGlobalSound();
        });
        
        // Acciones de posts
        this.attachPostActions();
        
        // Barra deslizable
        this.makeBottomBarDraggable();
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateToPost(this.currentIndex - 1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateToPost(this.currentIndex + 1);
                    break;
                case 'Escape':
                    this.closeViewer();
                    break;
                case ' ':
                    e.preventDefault();
                    this.showControls();
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    if (this.viewerContainer.querySelector('.fsv-sound-btn').style.display === 'block') {
                        this.toggleGlobalSound();
                    }
                    break;
            }
        });
        
        // Scroll
        this.viewerContainer.addEventListener('wheel', (e) => {
            if (!this.isActive) return;
            e.preventDefault();
            
            if (this.scrollTimeout) return;
            
            this.scrollTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.navigateToPost(this.currentIndex + 1);
                } else if (e.deltaY < 0) {
                    this.navigateToPost(this.currentIndex - 1);
                }
                this.scrollTimeout = null;
            }, 50);
        });
        
        // Touch/Swipe
        let touchStartY = 0;
        let touchEndY = 0;
        
        this.viewerContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});
        
        this.viewerContainer.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartY, touchEndY);
        }, {passive: true});
    }

attachPostActions() {
 
const likeBtn = this.viewerContainer.querySelector('.fsv-like-btn');
likeBtn.addEventListener('click', async () => {
    const postId = likeBtn.dataset.postId;
    if (!postId) {
        console.error('❌ No hay postId en el botón de like del viewer');
        return;
    }
    
    // 🔥 ACTUALIZACIÓN OPTIMISTA - Cambiar UI inmediatamente
    const likeIcon = likeBtn.querySelector('.fsv-like-icon');
    const likeCountElement = likeBtn.querySelector('.fsv-like-count');
    const wasLiked = likeBtn.classList.contains('liked');
    const currentCount = parseInt(likeCountElement.textContent) || 0;
    
    // Actualizar UI inmediatamente
    if (wasLiked) {
        likeBtn.classList.remove('liked');
        likeIcon.textContent = '🤍';
        likeCountElement.textContent = currentCount - 1;
    } else {
        likeBtn.classList.add('liked');
        likeIcon.textContent = '❤️';
        likeCountElement.textContent = currentCount + 1;
    }
    
    // Buscar post original
    const originalPost = document.querySelector(`[data-post-id="post-${postId}"]`);
    if (!originalPost) {
        console.error('❌ No se encontró el post original con ID:', postId);
        // Revertir cambio
        if (wasLiked) {
            likeBtn.classList.add('liked');
            likeIcon.textContent = '❤️';
        } else {
            likeBtn.classList.remove('liked');
            likeIcon.textContent = '🤍';
        }
        likeCountElement.textContent = currentCount;
        return;
    }
    
    // Buscar botón de like original
    const originalLikeBtn = originalPost.querySelector('.post-stat[onclick*="toggleRealPostLike"]');
    if (!originalLikeBtn) {
        console.error('❌ No se encontró el botón de like original');
        // Revertir cambio
        if (wasLiked) {
            likeBtn.classList.add('liked');
            likeIcon.textContent = '❤️';
        } else {
            likeBtn.classList.remove('liked');
            likeIcon.textContent = '🤍';
        }
        likeCountElement.textContent = currentCount;
        return;
    }
    
    if (window.toggleRealPostLike) {
        console.log('💓 Ejecutando like desde fullscreen para post:', postId);
        
        try {
            // Ejecutar like
            await window.toggleRealPostLike(originalLikeBtn, parseInt(postId));
            
            // ✅ SINCRONIZAR desde el DOM actualizado (más confiable que FeedState)
            setTimeout(() => {
                // Leer el estado REAL del botón que ya fue actualizado
                const isLiked = originalLikeBtn.classList.contains('liked');
                
                // Buscar el span con el contador
                let newCount = 0;
                const likeCountSpan = originalLikeBtn.querySelector('.like-count');
                if (likeCountSpan) {
                    newCount = parseInt(likeCountSpan.textContent.trim()) || 0;
                } else {
                    const allSpans = Array.from(originalLikeBtn.querySelectorAll('span'));
                    const countSpan = allSpans.find(span => /^\d+$/.test(span.textContent.trim()));
                    if (countSpan) {
                        newCount = parseInt(countSpan.textContent.trim()) || 0;
                    } else {
                        const match = originalLikeBtn.textContent.match(/\d+/);
                        newCount = match ? parseInt(match[0]) : 0;
                    }
                }
                
                // Aplicar estado REAL del servidor al viewer
                if (isLiked) {
                    likeBtn.classList.add('liked');
                    likeIcon.textContent = '❤️';
                } else {
                    likeBtn.classList.remove('liked');
                    likeIcon.textContent = '🤍';
                }
                likeCountElement.textContent = newCount;
                
                console.log(`✅ Viewer sincronizado desde DOM: ${newCount} likes, liked: ${isLiked}`);
            }, 200); // Aumentado a 200ms para dar tiempo al DOM
        } catch (error) {
            // Revertir en caso de error
            console.error('Error en like:', error);
            if (wasLiked) {
                likeBtn.classList.add('liked');
                likeIcon.textContent = '❤️';
            } else {
                likeBtn.classList.remove('liked');
                likeIcon.textContent = '🤍';
            }
            likeCountElement.textContent = currentCount;
        }
    }
    this.restartHideTimer();
});
    
   // ============================================
// REPOST - CON ACTUALIZACIÓN OPTIMISTA
// ============================================
const repostBtn = this.viewerContainer.querySelector('.fsv-repost-btn');
repostBtn.addEventListener('click', async () => {
    const postId = repostBtn.dataset.postId;
    if (!postId) return;
    
    // 🔥 ACTUALIZACIÓN OPTIMISTA - Cambiar UI inmediatamente
    const repostCountElement = repostBtn.querySelector('.fsv-repost-count');
    const wasReposted = repostBtn.classList.contains('reposted');
    const currentCount = parseInt(repostCountElement.textContent) || 0;
    
    // Actualizar UI inmediatamente
    repostBtn.classList.toggle('reposted', !wasReposted);
    repostCountElement.textContent = wasReposted ? currentCount - 1 : currentCount + 1;
    
    if (window.toggleRealRepost) {
        const originalPost = document.querySelector(`[data-post-id="post-${postId}"]`);
        const originalRepostBtn = originalPost?.querySelector('[onclick*="toggleRealRepost"]');
        
        if (originalRepostBtn) {
            console.log('🔄 Ejecutando repost desde fullscreen...');
            
            try {
                await window.toggleRealRepost(originalRepostBtn, parseInt(postId));
                
                // Sincronizar con datos reales
                setTimeout(() => {
                    this.updatePostStats(originalPost);
                }, 300);
            } catch (error) {
                // Revertir en caso de error
                console.error('Error en repost:', error);
                repostBtn.classList.toggle('reposted', wasReposted);
                repostCountElement.textContent = currentCount;
            }
        }
    }
    this.restartHideTimer();
});
    
    // ============================================
    // COMENTARIOS - CON SINCRONIZACIÓN AL CERRAR
    // ============================================
    const commentBtn = this.viewerContainer.querySelector('.fsv-comment-btn');
    commentBtn.addEventListener('click', () => {
        const originalPost = this.posts[this.currentIndex];
        const originalCommentBtn = originalPost?.querySelector('[onclick*="openComments"]');
        
        if (originalCommentBtn && window.openComments) {
            console.log('💬 Abriendo comentarios desde fullscreen...');
            window.openComments(originalCommentBtn);
            
            // ✅ OBSERVAR CAMBIOS EN EL MODAL
            const commentsModal = document.getElementById('commentsModal');
            if (commentsModal) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'class') {
                            const isActive = commentsModal.classList.contains('active');
                            
                            if (!isActive) {
                                console.log('✅ Modal de comentarios cerrado, sincronizando...');
                                
                                // Sincronizar varias veces
                                [100, 500, 1000].forEach(delay => {
                                    setTimeout(() => {
                                        this.updatePostStats(originalPost);
                                    }, delay);
                                });
                                
                                observer.disconnect();
                            }
                        }
                    });
                });
                
                observer.observe(commentsModal, { attributes: true });
            }
        }
        this.restartHideTimer();
    });

        // Share
        const shareBtn = this.viewerContainer.querySelector('.fsv-share-btn');
        shareBtn.addEventListener('click', () => {
            this.restartHideTimer();
        });

        // NUEVO: Compra
        const buyBtn = this.viewerContainer.querySelector('.fsv-buy-btn');
        buyBtn.addEventListener('click', () => {
            const postId = buyBtn.dataset.postId;
            if (!postId) return;
            
            if (typeof window.buyPost === 'function') {
                this.purchaseInProgress = true;
                
                // Llamar a la función de compra
                window.buyPost(postId);
                
                // Ocultar controles mientras el modal está abierto
                this.hideControls();
                
                // Configurar detección de cierre del modal para recargar la página
                this.setupPurchaseCompleteListener();
            } else {
                console.error('buyPost function not found');
            }
        });

// Hover effect para el botón de compra (solo si NO está deshabilitado)
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

    setupPurchaseCompleteListener() {
        // Detectar cuando el modal de compra se cierra para recargar la página
        const checkModalClosed = setInterval(() => {
            const buyModal = document.querySelector('#buyModal, .buy-modal, [class*="buy-modal"]');
            
            if (buyModal) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && 
                            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                            
                            const modalHidden = buyModal.style.display === 'none' || 
                                              !buyModal.classList.contains('active') ||
                                              !buyModal.classList.contains('show');
                            
                            if (modalHidden) {
                                observer.disconnect();
                                clearInterval(checkModalClosed);
                                
                                setTimeout(() => {
                                    console.log('✅ Compra completada - Recargando página...');
                                    location.reload();
                                }, 500);
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
            if (this.purchaseInProgress) {
                console.log('⏱️ Timeout de detección de compra alcanzado');
                this.purchaseInProgress = false;
            }
        }, 30000);
    }

    makeBottomBarDraggable() {
        const bottomBar = this.viewerContainer.querySelector('.fsv-bottom-bar');
        const handle = bottomBar.querySelector('.fsv-bar-handle');
        
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        
        const startDrag = (e) => {
            isDragging = true;
            startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            bottomBar.style.transition = 'none';
            this.restartHideTimer();
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            
            currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            const maxDrag = bottomBar.offsetHeight - 60;
            const limitedDelta = Math.max(0, Math.min(maxDrag, deltaY));
            
            bottomBar.style.transform = `translateY(${limitedDelta}px)`;
        };
        
        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            
            bottomBar.style.transition = 'transform 0.3s ease';
            
            const dragPercent = (currentY - startY) / bottomBar.offsetHeight;
            if (dragPercent > 0.3) {
                bottomBar.classList.remove('visible');
            }
            
            bottomBar.style.transform = '';
        };
        
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        handle.addEventListener('touchstart', startDrag, {passive: true});
        document.addEventListener('touchmove', drag, {passive: true});
        document.addEventListener('touchend', endDrag);
    }

    handleSwipe(startY, endY) {
        const diff = startY - endY;
        const absDiff = Math.abs(diff);
        
        if (absDiff > this.threshold) {
            if (diff > 0) {
                this.navigateToPost(this.currentIndex + 1);
            } else {
                this.navigateToPost(this.currentIndex - 1);
            }
        }
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.fullscreenViewer = new FullscreenPostViewer();
    });
} else {
    window.fullscreenViewer = new FullscreenPostViewer();
}


console.log('✅ Fullscreen Viewer TikTok Style - Con sistema de compra integrado');