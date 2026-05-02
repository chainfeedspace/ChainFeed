/**
 * FULLSCREEN VIEWER - Navegación tipo Instagram/TikTok
 * Con barra inferior deslizante para información del post
 * Y control de sonido global para videos sin data-silenciado="true"
 * MEJORADO: Timer de controles se reinicia con interacciones
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
        this.globalMuted = false; // Estado global de sonido

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
                            <button class="fsv-action-btn fsv-tip-btn" data-action="tip">
                                <span>💎</span>
                                <span class="fsv-tip-count">0</span>
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
    }

    openViewer(triggerPostElement) {
        this.posts = Array.from(document.querySelectorAll('.post-card'));
        
        console.log('Posts encontrados:', this.posts.length);
        
        if (this.posts.length === 0) {
            console.error('No se encontraron posts con clase .post-card');
            return;
        }
        
        this.currentIndex = this.posts.indexOf(triggerPostElement);
        if (this.currentIndex === -1) this.currentIndex = 0;
        
        console.log('Abriendo viewer en índice:', this.currentIndex);
        
        this.isActive = true;
        this.viewerContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Ocultar controles inicialmente (SIN mostrarlos automáticamente)
        this.hideControls();
        
        this.renderPosts();
        this.updateBottomBar();
        
        // Pequeño delay para asegurar que el DOM esté listo
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
                
                // FORZAR VISIBILIDAD DE POSTS
                postClone.style.opacity = '1';
                postClone.style.visibility = 'visible';
                
                if (position === 0) {
                    // Post anterior - arriba
                    postClone.style.transform = 'translateY(-100vh)';
                } else if (position === 1) {
                    // Post actual - VISIBLE
                    postClone.style.transform = 'translateY(0)';
                } else if (position === 2) {
                    // Post siguiente - abajo
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
        
        // FORZAR VISIBILIDAD
        mediaContainer.style.opacity = '1';
        mediaContainer.style.visibility = 'visible';
        
        // Extraer solo el contenido multimedia
        const originalMedia = postElement.querySelector('.post-media video, .post-media img');
        
        if (originalMedia) {
            if (originalMedia.tagName === 'VIDEO') {
                const video = originalMedia.cloneNode(true);
                video.removeAttribute('controls');
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                video.className = 'fsv-video';
                
                // Verificar si el video original tiene data-silenciado="true"
                const isForcedSilent = originalMedia.hasAttribute('data-silenciado') && 
                                     originalMedia.getAttribute('data-silenciado') === 'true';
                
                if (isForcedSilent) {
                    // Videos con data-silenciado="true" siempre silenciados
                    video.muted = true;
                    video.setAttribute('data-forced-silent', 'true');
                } else {
                    // Videos normales siguen el estado global
                    video.muted = this.globalMuted;
                    video.setAttribute('data-forced-silent', 'false');
                }
                
                // FORZAR VISIBILIDAD DEL VIDEO
                video.style.opacity = '1';
                video.style.visibility = 'visible';
                video.style.animation = 'none';
                
                // Control de reproducción
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
                
                // Detectar cambios de estado
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
                
                // Para imágenes, NO mostrar controles automáticamente
                // Solo se mostrarán al hacer click
            }
        } else {
            // Si no hay media, mostrar el contenido del post
            const content = postElement.querySelector('.post-content');
            if (content) {
                const contentClone = content.cloneNode(true);
                contentClone.className = 'fsv-text-content';
                contentClone.style.opacity = '1';
                contentClone.style.visibility = 'visible';
                contentClone.style.animation = 'none';
                mediaContainer.appendChild(contentClone);
                
                // Para posts de texto, NO mostrar controles automáticamente
            }
        }
        
        return mediaContainer;
    }

    updateBottomBar() {
        const currentPost = this.posts[this.currentIndex];
        if (!currentPost) return;
        
        // Extraer información del post original
        const avatar = currentPost.querySelector('.post-avatar');
        const username = currentPost.querySelector('.post-author');
        const meta = currentPost.querySelector('.post-meta');
        const content = currentPost.querySelector('.post-content');
        
// Actualizar avatar CON ESTRUCTURA COMPLETA Y ANILLO DE FLASH
    const avatarContainer = this.viewerContainer.querySelector('.fsv-avatar');
    if (avatarWrapper && avatar) {
        // Obtener datos del avatar original
        const flashClasses = avatar.className || 'post-avatar no-flash';
        const flashInfo = avatar.dataset.flashInfo || '{}';
        const usernameData = avatar.dataset.username || '';
        const avatarContent = avatar.innerHTML;
        
        // Crear estructura completa con wrapper y anillo
        avatarContainer.innerHTML = `
            <div class="post-avatar-wrapper">
                <div class="${flashClasses}" 
                     data-flash-info='${flashInfo}' 
                     data-username="${usernameData}"
                     style="cursor: pointer; transition: all 0.3s ease;"
                     onclick="goToUserProfile('${usernameData}')" 
                     onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 0 15px rgba(99, 102, 241, 0.3)'" 
                     onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
                    ${avatarContent}
                </div>
            </div>
        `;
        
        // Aplicar anillo usando la función global
        setTimeout(() => {
            if (typeof window.aplicarAnilloFlash === 'function') {
                const newAvatar = avatarContainer.querySelector('.post-avatar');
                if (newAvatar && flashInfo) {
                    try {
                        const flashData = JSON.parse(flashInfo);
                        window.aplicarAnilloFlash(newAvatar, flashData);
                    } catch (e) {
                        console.warn('Error aplicando anillo en viewer:', e);
                    }
                }
            }
        }, 50);
    }
        
        // Actualizar username
        const usernameContainer = this.viewerContainer.querySelector('.fsv-username');
        if (username) {
            usernameContainer.textContent = username.textContent.trim();
        }
        
        // Actualizar meta
        const metaContainer = this.viewerContainer.querySelector('.fsv-user-meta');
        if (meta) {
            metaContainer.textContent = meta.textContent.trim();
        }
        
        // Actualizar contenido
        const contentContainer = this.viewerContainer.querySelector('.fsv-post-content');
        if (content) {
            contentContainer.innerHTML = content.innerHTML;
        }
        
        // Actualizar estadísticas
        this.updatePostStats(currentPost);
    }

    updatePostStats(postElement) {
        // Like
        const likeBtn = postElement.querySelector('.post-stat:first-child');
        if (likeBtn) {
            const isLiked = likeBtn.classList.contains('liked');
            const count = likeBtn.textContent.match(/\d+/)?.[0] || '0';
            
            const viewerLikeBtn = this.viewerContainer.querySelector('.fsv-like-btn');
            const likeIcon = viewerLikeBtn.querySelector('.fsv-like-icon');
            const likeCount = viewerLikeBtn.querySelector('.fsv-like-count');
            
            likeIcon.textContent = isLiked ? '❤️' : '🤍';
            likeCount.textContent = count;
            viewerLikeBtn.classList.toggle('liked', isLiked);
            
            // Guardar el ID del post
            const postId = postElement.dataset.postId?.replace('post-', '');
            if (postId) viewerLikeBtn.dataset.postId = postId;
        }
        
        // Comentarios
        const commentBtn = postElement.querySelector('[data-comments-count]');
        if (commentBtn) {
            const count = commentBtn.dataset.commentsCount || '0';
            this.viewerContainer.querySelector('.fsv-comment-count').textContent = count;
        }
        
        // Repost
        const repostBtn = postElement.querySelector('[data-repost-count]');
        if (repostBtn) {
            const count = repostBtn.dataset.repostCount || '0';
            const isReposted = repostBtn.classList.contains('reposted');
            
            const viewerRepostBtn = this.viewerContainer.querySelector('.fsv-repost-btn');
            viewerRepostBtn.querySelector('.fsv-repost-count').textContent = count;
            viewerRepostBtn.classList.toggle('reposted', isReposted);
            
            const postId = postElement.dataset.postId?.replace('post-', '');
            if (postId) viewerRepostBtn.dataset.postId = postId;
        }
        
        // Tips
        const tipBtn = postElement.querySelector('[data-tip-count]');
        if (tipBtn) {
            const count = tipBtn.dataset.tipCount || '0';
            this.viewerContainer.querySelector('.fsv-tip-count').textContent = count;
        }
    }

    // NUEVOS MÉTODOS PARA CONTROL DE SONIDO
    updateSoundButtonVisibility() {
        const currentPost = this.viewerContainer.querySelector('.fsv-post[data-position="0"]');
        const video = currentPost?.querySelector('video');
        const soundBtn = this.viewerContainer.querySelector('.fsv-sound-btn');
        
        if (video && video.getAttribute('data-forced-silent') === 'false') {
            // Mostrar botón solo para videos sin data-silenciado="true"
            soundBtn.style.display = 'block';
            this.updateSoundButton();
        } else {
            // Ocultar botón para imágenes, texto, o videos con data-silenciado="true"
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

    // NUEVO MÉTODO: Reiniciar timer de auto-ocultar controles
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
        
        // Mostrar botón de sonido si corresponde
        const soundBtn = this.viewerContainer.querySelector('.fsv-sound-btn');
        if (soundBtn.style.display === 'block') {
            soundBtn.classList.add('visible');
        }
        
        // Usar el nuevo método para manejar el timer
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
        
        // IMPORTANTE: Pausar video ANTES de iniciar la transición
        this.pauseCurrentVideo();
        
        const oldIndex = this.currentIndex;
        this.currentIndex = index;
        
        const container = this.viewerContainer.querySelector('.fsv-posts-container');
        
        // AGREGAR ESTA LÍNEA:
        this.isNavigating = true;
        
        // Ocultar controles al navegar
        this.hideControls();
        
        // Animación de transición
        container.style.transition = 'transform 0.3s ease-out';
        
        if (index > oldIndex) {
            container.style.transform = `translateY(-100vh)`;
        } else {
            container.style.transform = `translateY(100vh)`;
        }
        
        // Esperar a que termine la animación antes de actualizar
        setTimeout(() => {
            container.style.transition = 'none';
            container.style.transform = 'translateY(0)';
            this.renderPosts();
            this.updateBottomBar();
            
            // Pequeño delay adicional para asegurar que el DOM esté listo
            setTimeout(() => {
                this.playCurrentVideo();
                this.updateSoundButtonVisibility();
                this.isNavigating = false; // AGREGAR ESTA LÍNEA
            }, 50);
        }, 350);
    }

    playCurrentVideo() {
        const currentPost = this.viewerContainer.querySelector('.fsv-post[data-position="0"]');
        if (!currentPost) return;
        
        const video = currentPost.querySelector('video');
        if (video) {
            // Asegurar que el video esté visible antes de reproducir
            video.style.opacity = '1';
            video.style.visibility = 'visible';
            
            // Aplicar el estado de sonido adecuado
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
            // Silenciar temporalmente para evitar audio durante transición
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
        // Click en área vacía para mostrar/ocultar controles
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

        // NUEVO: Event listener para clicks en la barra inferior
        const bottomBar = this.viewerContainer.querySelector('.fsv-bottom-bar');
        bottomBar.addEventListener('click', (e) => {
            // Solo reiniciar si la barra está visible
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
        
        // NUEVO: Control de sonido
        this.viewerContainer.querySelector('.fsv-sound-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleGlobalSound();
        });
        
        // Acciones de posts
        this.attachPostActions();
        
        // Hacer la barra inferior deslizable
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
                    // Atajo de teclado para silenciar/des-silenciar
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
        // Like
attachPostActions() {
    // Like
    const likeBtn = this.viewerContainer.querySelector('.fsv-like-btn');
    likeBtn.addEventListener('click', async () => {
        const postId = likeBtn.dataset.postId;
        if (!postId) return;
        
        // 🔥 ACTUALIZACIÓN OPTIMISTA - Cambiar UI inmediatamente
        const likeIcon = likeBtn.querySelector('.fsv-like-icon');
        const likeCount = likeBtn.querySelector('.fsv-like-count');
        const wasLiked = likeBtn.classList.contains('liked');
        const currentCount = parseInt(likeCount.textContent) || 0;
        
        // Actualizar UI inmediatamente usando add/remove explícito
        if (wasLiked) {
            likeBtn.classList.remove('liked');
            likeIcon.textContent = '🤍';
            likeCount.textContent = currentCount - 1;
        } else {
            likeBtn.classList.add('liked');
            likeIcon.textContent = '❤️';
            likeCount.textContent = currentCount + 1;
        }
        
        // Llamar a tu función original
        if (window.toggleRealPostLike) {
            const originalPost = document.querySelector(`[data-post-id="post-${postId}"]`);
            const originalLikeBtn = originalPost?.querySelector('.post-stat:first-child');
            if (originalLikeBtn) {
                try {
                    await window.toggleRealPostLike(originalLikeBtn, parseInt(postId));
                    // Actualizar UI del viewer con datos reales después de delay
                    setTimeout(() => this.updateBottomBar(), 300);
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
                    likeCount.textContent = currentCount;
                }
            }
        }
        // Reiniciar timer después de la acción
        this.restartHideTimer();
    });
        
        // Repost
// Repost
const repostBtn = this.viewerContainer.querySelector('.fsv-repost-btn');
repostBtn.addEventListener('click', async () => {
    const postId = repostBtn.dataset.postId;
    if (!postId) return;
    
    // 🔥 ACTUALIZACIÓN OPTIMISTA - Cambiar UI inmediatamente
    const repostCount = repostBtn.querySelector('.fsv-repost-count');
    const wasReposted = repostBtn.classList.contains('reposted');
    const currentCount = parseInt(repostCount.textContent) || 0;
    
    // Actualizar UI inmediatamente
    repostBtn.classList.toggle('reposted', !wasReposted);
    repostCount.textContent = wasReposted ? currentCount - 1 : currentCount + 1;
    
    if (window.toggleRealRepost) {
        const originalPost = document.querySelector(`[data-post-id="post-${postId}"]`);
        const originalRepostBtn = originalPost?.querySelector('[data-repost-count]');
        if (originalRepostBtn) {
            await window.toggleRealRepost(originalRepostBtn, parseInt(postId));
            // Actualizar UI del viewer con datos reales
            setTimeout(() => this.updateBottomBar(), 300);
        }
    }
    // Reiniciar timer después de la acción
    this.restartHideTimer();
});
        
        // Comentarios
        const commentBtn = this.viewerContainer.querySelector('.fsv-comment-btn');
        commentBtn.addEventListener('click', () => {
            if (window.openComments) {
                const originalPost = this.posts[this.currentIndex];
                const originalCommentBtn = originalPost?.querySelector('[data-comments-count]');
                if (originalCommentBtn) {
                    window.openComments(originalCommentBtn);
                }
            }
            // NUEVO: Reiniciar timer después de la acción
            this.restartHideTimer();
        });

        // NUEVO: Reiniciar timer para botones share y tip también
        const shareBtn = this.viewerContainer.querySelector('.fsv-share-btn');
        shareBtn.addEventListener('click', () => {
            this.restartHideTimer();
        });

        const tipBtn = this.viewerContainer.querySelector('.fsv-tip-btn');
        tipBtn.addEventListener('click', () => {
            this.restartHideTimer();
        });
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
            // NUEVO: Reiniciar timer al empezar a arrastrar
            this.restartHideTimer();
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            
            currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            // Limitar el arrastre
            const maxDrag = bottomBar.offsetHeight - 60;
            const limitedDelta = Math.max(0, Math.min(maxDrag, deltaY));
            
            bottomBar.style.transform = `translateY(${limitedDelta}px)`;
        };
        
        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            
            bottomBar.style.transition = 'transform 0.3s ease';
            
            // Si se arrastró más del 30%, ocultar
            const dragPercent = (currentY - startY) / bottomBar.offsetHeight;
            if (dragPercent > 0.3) {
                bottomBar.classList.remove('visible');
            }
            
            bottomBar.style.transform = '';
        };
        
        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Touch events
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

console.log('✅ Fullscreen Viewer TikTok Style - Con timer reiniciable en interacciones');