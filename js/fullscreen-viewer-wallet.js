/**
 * FULLSCREEN VIEWER PARA BILLETERA
 * Navegación vertical tipo TikTok/Instagram
 * Muestra posts de "Más Rentables" y "Más Interacciones"
 * Con control de sonido para videos silenciados
 */

class WalletFullscreenViewer {
    constructor() {
        this.isActive = false;
        this.currentIndex = 0;
        this.posts = [];
        this.viewerContainer = null;
        this.hideControlsTimeout = null;
        this.isNavigating = false;
        this.globalMuted = false;

        this.init();
    }

    init() {
        this.createViewerHTML();
        this.attachEventListeners();
    }

    createViewerHTML() {
        const viewer = document.createElement('div');
        viewer.id = 'wallet-fullscreen-viewer';
        viewer.className = 'wfv-container';
        viewer.innerHTML = `
            <div class="wfv-wrapper">
                <div class="wfv-posts-container">
                    <!-- Los posts se cargarán dinámicamente aquí -->
                </div>
                
                <!-- Controles de navegación lateral (desktop) -->
                <div class="wfv-navigation">
                    <button class="wfv-nav-btn wfv-prev" aria-label="Post anterior">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                        </svg>
                    </button>
                    <button class="wfv-nav-btn wfv-next" aria-label="Siguiente post">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Botón de salir -->
                <button class="wfv-close-btn" aria-label="Salir">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>
                
                <!-- Botón de control de sonido -->
                <button class="wfv-sound-btn" aria-label="Controlar sonido" style="display: none;">
                    <svg class="wfv-sound-on" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    <svg class="wfv-sound-off" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                </button>
                
                <!-- Barra inferior deslizante -->
                <div class="wfv-bottom-bar">
                    <div class="wfv-bar-handle"></div>
                    <div class="wfv-bar-content">
                        <div class="wfv-post-content"></div>
                        <div class="wfv-post-stats">
                            <!-- Stats dinámicos según sección -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(viewer);
        this.viewerContainer = viewer;
    }

    openViewer(triggerPostElement) {
        // Obtener todas las tarjetas de la misma sección
        const currentSection = triggerPostElement.closest('.transactions-section');
        this.posts = Array.from(currentSection.querySelectorAll('.post-card[data-post-json]'));
        
        if (this.posts.length === 0) {
            console.error('No se encontraron posts con data-post-json');
            return;
        }
        
        this.currentIndex = this.posts.indexOf(triggerPostElement);
        if (this.currentIndex === -1) this.currentIndex = 0;
        
        this.isActive = true;
        this.viewerContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.renderPosts();
        this.updateBottomBar();
        
        setTimeout(() => {
            this.playCurrentVideo();
            this.updateSoundButtonVisibility();
            this.hideControls();
        }, 100);
    }

    renderPosts() {
        const container = this.viewerContainer.querySelector('.wfv-posts-container');
        container.innerHTML = '';
        
        const indices = [
            this.currentIndex - 1,
            this.currentIndex,
            this.currentIndex + 1
        ];
        
        indices.forEach((index, position) => {
            if (index >= 0 && index < this.posts.length) {
                const postElement = this.posts[index];
                const postData = JSON.parse(postElement.dataset.postJson);
                
                const postClone = this.createMediaOnlyPost(postData);
                postClone.classList.add('wfv-post');
                postClone.dataset.position = position - 1;
                postClone.dataset.originalIndex = index;
                
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

    createMediaOnlyPost(postData) {
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'wfv-media-only';
        
        const { media_url, tipo, silenciado, contenido } = postData;
        
        if (media_url && media_url.trim() !== '') {
            const mediaUrl = media_url.trim();
            const isVideo = tipo === 'video' || /\.(mp4|webm|ogg|mov|avi)$/i.test(mediaUrl);
            const isImage = tipo === 'imagen' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl);
            
            if (isVideo) {
                const video = document.createElement('video');
                video.src = mediaUrl;
                video.className = 'wfv-video';
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                video.preload = 'metadata';
                
                // Manejo de videos silenciados
                const isForcedSilent = silenciado == 1;
                
                if (isForcedSilent) {
                    video.muted = true;
                    video.setAttribute('data-forced-silent', 'true');
                } else {
                    video.muted = this.globalMuted;
                    video.setAttribute('data-forced-silent', 'false');
                }
                
                // Click para pausar/reproducir
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
                
            } else if (isImage) {
                const img = document.createElement('img');
                img.src = mediaUrl;
                img.className = 'wfv-image';
                img.alt = 'Post image';
                mediaContainer.appendChild(img);
            }
        } else if (contenido && contenido.trim() !== '') {
            // Post de solo texto
            const textDiv = document.createElement('div');
            textDiv.className = 'wfv-text-content';
            textDiv.textContent = contenido;
            mediaContainer.appendChild(textDiv);
        }
        
        return mediaContainer;
    }

    updateBottomBar() {
        const currentPostElement = this.posts[this.currentIndex];
        if (!currentPostElement) return;
        
        const postData = JSON.parse(currentPostElement.dataset.postJson);
        
        const contentContainer = this.viewerContainer.querySelector('.wfv-post-content');
        contentContainer.innerHTML = postData.contenido || 'Sin contenido';
        
        const statsContainer = this.viewerContainer.querySelector('.wfv-post-stats');
        
        if (postData.seccion === 'rentables') {
            // Mostrar earnings y ventas
            statsContainer.innerHTML = `
                <div class="wfv-stat-item" id="botones-bille-full">
                    <span class="wfv-stat-icon">💰</span>
                    <span class="wfv-stat-value">+${parseInt(postData.ingresos_totales || 0).toLocaleString('es-ES')} CFT</span>
                    <span class="wfv-stat-label">Ganados</span>
                </div>
                <div class="wfv-stat-item" id="botones-bille-full">
                    <span class="wfv-stat-icon">📊</span>
                    <span class="wfv-stat-value">${postData.total_ventas || 0}</span>
                    <span class="wfv-stat-label">Ventas</span>
                </div>
            `;
        } else if (postData.seccion === 'interacciones') {
            // Mostrar interacciones
            statsContainer.innerHTML = `
   <div class="wfv-stat-item" id="botones-bille-full">
        <span class="wfv-stat-icon">🤍</span>
        <span class="wfv-stat-value">${postData.like_count || 0}</span>
    </div>
    <div class="wfv-stat-item" id="botones-bille-full">
        <span class="wfv-stat-icon">💬</span>
        <span class="wfv-stat-value">${postData.comment_count || 0}</span>
    </div>
    <div class="wfv-stat-item" id="botones-bille-full">
        <span class="wfv-stat-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path></svg></span>
        <span class="wfv-stat-value">${postData.response_count || 0}</span>
    </div>
    <div class="wfv-stat-item" id="botones-bille-full">
        <span class="wfv-stat-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path></svg></span>
        <span class="wfv-stat-value">${postData.share_count || 0}</span>
    </div>
            `;
        }
    }

    updateSoundButtonVisibility() {
        const currentPost = this.viewerContainer.querySelector('.wfv-post[data-position="0"]');
        const video = currentPost?.querySelector('video');
        const soundBtn = this.viewerContainer.querySelector('.wfv-sound-btn');
        
        if (video && video.getAttribute('data-forced-silent') === 'false') {
            soundBtn.style.display = 'block';
            this.updateSoundButton();
        } else {
            soundBtn.style.display = 'none';
        }
    }

    updateSoundButton() {
        const soundBtn = this.viewerContainer.querySelector('.wfv-sound-btn');
        const soundOnIcon = soundBtn.querySelector('.wfv-sound-on');
        const soundOffIcon = soundBtn.querySelector('.wfv-sound-off');
        
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
    }

    applySoundStateToCurrentVideo() {
        const currentPost = this.viewerContainer.querySelector('.wfv-post[data-position="0"]');
        const video = currentPost?.querySelector('video');
        
        if (video && video.getAttribute('data-forced-silent') === 'false') {
            video.muted = this.globalMuted;
        }
    }

    showControls() {
        if (this.isNavigating) return;
        
        this.viewerContainer.querySelector('.wfv-close-btn').classList.add('visible');
        this.viewerContainer.querySelector('.wfv-bottom-bar').classList.add('visible');
        
        const soundBtn = this.viewerContainer.querySelector('.wfv-sound-btn');
        if (soundBtn.style.display === 'block') {
            soundBtn.classList.add('visible');
        }
        
        this.restartHideTimer();
    }
    
    hideControls() {
        this.viewerContainer.querySelector('.wfv-close-btn').classList.remove('visible');
        this.viewerContainer.querySelector('.wfv-bottom-bar').classList.remove('visible');
        this.viewerContainer.querySelector('.wfv-sound-btn').classList.remove('visible');
        
        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }
    }

    restartHideTimer() {
        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }
        this.hideControlsTimeout = setTimeout(() => {
            this.hideControls();
        }, 4000);
    }

    updateNavigationButtons() {
        const prevBtn = this.viewerContainer.querySelector('.wfv-prev');
        const nextBtn = this.viewerContainer.querySelector('.wfv-next');
        
        prevBtn.disabled = this.currentIndex === 0;
        nextBtn.disabled = this.currentIndex === this.posts.length - 1;
    }

    navigateToPost(index) {
        if (index < 0 || index >= this.posts.length) return;
        
        this.pauseCurrentVideo();
        
        const oldIndex = this.currentIndex;
        this.currentIndex = index;
        
        const container = this.viewerContainer.querySelector('.wfv-posts-container');
        
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
        const currentPost = this.viewerContainer.querySelector('.wfv-post[data-position="0"]');
        if (!currentPost) return;
        
        const video = currentPost.querySelector('video');
        if (video) {
            this.applySoundStateToCurrentVideo();
            
            video.play().catch((error) => {
                console.log('No se pudo reproducir automáticamente:', error);
            });
        }
    }

    pauseCurrentVideo() {
        const currentPost = this.viewerContainer.querySelector('.wfv-post[data-position="0"]');
        if (!currentPost) return;
        
        const video = currentPost.querySelector('video');
        if (video && !video.paused) {
            video.pause();
        }
    }

    closeViewer() {
        this.isActive = false;
        this.viewerContainer.classList.remove('active');
        document.body.style.overflow = '';
        
        this.pauseCurrentVideo();
        
        setTimeout(() => {
            const container = this.viewerContainer.querySelector('.wfv-posts-container');
            container.innerHTML = '';
        }, 300);
    }

    attachEventListeners() {
        // Click en área vacía para mostrar/ocultar controles
        this.viewerContainer.addEventListener('click', (e) => {
            if (e.target.closest('.wfv-bottom-bar') || 
                e.target.closest('button') || 
                e.target.closest('video')) {
                return;
            }
            
            const bottomBar = this.viewerContainer.querySelector('.wfv-bottom-bar');
            if (bottomBar.classList.contains('visible')) {
                this.hideControls();
            } else {
                this.showControls();
            }
        });

        // Navegación
        this.viewerContainer.querySelector('.wfv-prev').addEventListener('click', () => {
            this.navigateToPost(this.currentIndex - 1);
        });
        
        this.viewerContainer.querySelector('.wfv-next').addEventListener('click', () => {
            this.navigateToPost(this.currentIndex + 1);
        });
        
        // Cerrar
        this.viewerContainer.querySelector('.wfv-close-btn').addEventListener('click', () => {
            this.closeViewer();
        });
        
        // Control de sonido
        this.viewerContainer.querySelector('.wfv-sound-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleGlobalSound();
        });
        
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
                    if (this.viewerContainer.querySelector('.wfv-sound-btn').style.display === 'block') {
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

    makeBottomBarDraggable() {
        const bottomBar = this.viewerContainer.querySelector('.wfv-bottom-bar');
        const handle = bottomBar.querySelector('.wfv-bar-handle');
        
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
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
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
        window.walletViewer = new WalletFullscreenViewer();
    });
} else {
    window.walletViewer = new WalletFullscreenViewer();
}

console.log('✅ Wallet Fullscreen Viewer inicializado');