/**
 * PROFILE MEDIA VIEWER
 * Visualizador fullscreen simple para posts del perfil
 * Funciona con videos, imágenes y muestra información del post
 * Incluye sistema de compra/venta integrado con recarga automática
 * Controles inteligentes: 5s al interactuar, esconder al tocar contenido
 * Navegación vertical tipo Reels/TikTok
 */

class ProfileMediaViewer {
    constructor() {
        this.isActive = false;
        this.currentPostData = null;
        this.viewerElement = null;
        this.controlsVisible = false;
        this.hideControlsTimeout = null;
        this.updateInterval = null;
        this.purchaseInProgress = false;
        this.availablePosts = [];
        this.currentPostIndex = 0;
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.createViewer();
        this.attachEvents();
        console.log('✅ Profile Media Viewer inicializado');
    }

    createViewer() {
        const viewer = document.createElement('div');
        viewer.id = 'profileMediaViewer';
        viewer.className = 'pmv-container';
        viewer.innerHTML = `
            <style>
                .pmv-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #000;
                    z-index: 1111;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease;
                    overscroll-behavior: none;
                }

                .pmv-container.active {
                    opacity: 1;
                    visibility: visible;
                }

                .pmv-media-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .pmv-media-container video,
                .pmv-media-container img {
width: 100%;
    height: 100%;
    object-fit: cover;
                }

                .pmv-media-container video {
                    width: 100%;
                    height: 100%;
                }

                .pmv-close-btn {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .pmv-close-btn.visible {
                    opacity: 1;
                }

                .pmv-close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .pmv-sound-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .pmv-sound-btn.visible {
                    opacity: 1;
                }

                .pmv-sound-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .pmv-sound-btn.muted {
                    background: rgba(220, 38, 38, 0.7);
                }

                .pmv-silenced-badge {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(220, 38, 38, 0.9);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    z-index: 10;
                    display: none;
                    align-items: center;
                    gap: 0.5rem;
                    backdrop-filter: blur(10px);
                }

                .pmv-silenced-badge.visible {
                    display: flex;
                }

                .pmv-info-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7));
                    backdrop-filter: blur(20px);
                    color: white;
                    padding: 1.5rem;
                    transform: translateY(100%);
                    transition: transform 0.3s ease;
                    max-height: 50vh;
                    overflow-y: auto;
                    z-index: 10;
                }

                .pmv-info-bar.visible {
                    transform: translateY(0);
                }

                .pmv-user-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .pmv-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #ec4899);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    overflow: hidden;
                }

                .pmv-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .pmv-user-info {
                    flex: 1;
                }

                .pmv-username {
                    font-weight: 600;
                    font-size: 1rem;
                }

                .pmv-user-meta {
                    font-size: 0.85rem;
                    opacity: 0.7;
                    margin-top: 0.25rem;
                }

                .pmv-content {
                    margin-bottom: 1rem;
                    line-height: 1.5;
                    font-size: 0.95rem;
                }

                .pmv-actions {
                    display: flex;
                    gap: 5px;
                    justify-content: space-around;
                }

                .pmv-action-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 0.6rem 1rem;
                    border-radius: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }

                .pmv-action-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }

                .pmv-action-btn.liked {
                    color: #ef4444;
                }

                .pmv-action-btn.reposted {
                    color: #4ade80;
                }

                .pmv-action-btn.buy-btn {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    border-color: #f59e0b;
                    font-weight: 600;
                }

                .pmv-action-btn.buy-btn:hover {
                    background: linear-gradient(135deg, #d97706, #b45309);
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
                }

                @media (max-width: 768px) {
                    .pmv-close-btn,
                    .pmv-sound-btn {
                        top: 10px;
                        width: 40px;
                        height: 40px;
                    }

                    .pmv-close-btn {
                        left: 10px;
                    }

                    .pmv-sound-btn {
                        right: 10px;
                    }

                    .pmv-info-bar {
                        padding: 1rem;
                    }

                    .pmv-action-btn {
                        padding: 8px 12px;
                        font-size: 0.85rem;
                    }
                }

                .pmv-container,
                .pmv-container * {
                    -webkit-tap-highlight-color: transparent;
                    -webkit-user-select: none;
                    user-select: none;
                }

                .pmv-action-btn {
                    -webkit-tap-highlight-color: transparent;
                }
                    .pmv-action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
}

.pmv-icon {
    font-size: 1rem;
    line-height: 1;
}

.pmv-icon-svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.pmv-count {
    font-size: 0.9rem;
    line-height: 1;
}

.pmv-action-btn.buy-btn .pmv-count {
    font-size: 0.85rem;
}
            </style>

            <div class="pmv-media-container" onclick="window.profileMediaViewer.hideControls()">
                <!-- Media se insertará aquí -->
            </div>

            <button class="pmv-close-btn" onclick="event.stopPropagation(); window.profileMediaViewer.close()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
            </button>

            <button class="pmv-sound-btn" onclick="event.stopPropagation(); window.profileMediaViewer.toggleSound()">
                <svg class="sound-on" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <svg class="sound-off" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
            </button>

            <div class="pmv-silenced-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
                Sin audio
            </div>

            <div class="pmv-info-bar">
                <div class="pmv-user-header">
                    <div class="pmv-avatar"></div>
                    <div class="pmv-user-info">
                        <div class="pmv-username"></div>
                        <div class="pmv-user-meta"></div>
                    </div>
                </div>
                <div class="pmv-content"></div>
                <div class="pmv-actions">
                    <!-- Acciones se insertarán aquí -->
                </div>
            </div>
        `;

        document.body.appendChild(viewer);
        this.viewerElement = viewer;
    }

attachEvents() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isActive) {
            this.close();
        }
    });

    // Evento para scroll vertical - navegar entre posts (MOUSE)
    let scrollTimeout;
    this.viewerElement.addEventListener('wheel', (e) => {
        // Si el scroll es dentro de la barra de info, permitir scroll normal
        if (e.target.closest('.pmv-info-bar')) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isScrolling) return;
        
        // Debounce para evitar múltiples triggers
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const delta = e.deltaY;
            
            if (Math.abs(delta) > 5) { // Threshold mínimo
                if (delta > 0) {
                    this.navigateToPost('next');
                } else {
                    this.navigateToPost('prev');
                }
            }
        }, 50);
    }, { passive: false, capture: true });

// Variables para touch/swipe (MÓVIL)
let touchStartY = 0;
let touchEndY = 0;
let touchStartX = 0;
let isTouching = false;
let hasMoved = false;

this.viewerElement.addEventListener('touchstart', (e) => {
    // Si el touch es dentro de la barra de info, permitir scroll normal
    if (e.target.closest('.pmv-info-bar')) {
        return;
    }
    
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    touchEndY = touchStartY; // Inicializar igual
    isTouching = true;
    hasMoved = false; // Reset del flag
}, { passive: true });

this.viewerElement.addEventListener('touchmove', (e) => {
    if (!isTouching || e.target.closest('.pmv-info-bar')) {
        return;
    }
    
    touchEndY = e.touches[0].clientY;
    
    // Detectar si hubo movimiento significativo
    const moveDistance = Math.abs(touchEndY - touchStartY);
    if (moveDistance > 10) { // Más de 10px = movimiento real
        hasMoved = true;
    }
}, { passive: true });

this.viewerElement.addEventListener('touchend', (e) => {
    if (!isTouching || e.target.closest('.pmv-info-bar')) {
        isTouching = false;
        hasMoved = false;
        return;
    }
    
    isTouching = false;
    
    // Solo navegar si hubo movimiento (swipe), NO si fue solo un tap
    if (!hasMoved) {
        return; // Fue un tap, no hacer nada
    }
    
    if (this.isScrolling) return;
    
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 50; // Mínimo 50px para considerar swipe
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
            // Swipe hacia arriba - siguiente post
            this.navigateToPost('next');
        } else {
            // Swipe hacia abajo - post anterior
            this.navigateToPost('prev');
        }
    }
    
    hasMoved = false; // Reset
}, { passive: true });

    // Evento para la barra inferior - mantener controles visibles por 5 segundos
    const infoBar = this.viewerElement.querySelector('.pmv-info-bar');
    infoBar.addEventListener('click', (e) => {
        // No propagar el click para evitar que esconda los controles
        e.stopPropagation();
        this.restartHideControlsTimer(5000);
    });
}

    open(postElement, showControls = true) {
        try {
            this.currentPostData = this.extractPostData(postElement);
            
            if (!this.currentPostData) {
                console.error('No se pudieron extraer datos del post');
                return;
            }

            // Construir lista de posts disponibles
            this.buildAvailablePostsList(postElement);

            this.isActive = true;
            this.viewerElement.classList.add('active');
            document.body.style.overflow = 'hidden';

            this.loadMedia();
            this.loadPostInfo();
            
            if (showControls) {
                this.showControls();
                this.startHideControlsTimer();
            } else {
                this.hideControls();
            }
            
            this.startAutoUpdate();

        } catch (error) {
            console.error('Error abriendo viewer:', error);
            this.close();
        }
    }
buildAvailablePostsList(currentPostElement) {
    const postCards = document.querySelectorAll('.content-card, .chain-event-card');
    this.availablePosts = [];
    
    postCards.forEach((card) => {
        // FILTRO ROBUSTO: No depende de variables CSS
        const hasUserLink = card.querySelector('[onclick*="goToUserProfile"]');
        const hasPostId = card.dataset.postId && !card.dataset.postId.startsWith('post-');
        
        // Solo posts reales (con link a perfil O con postId numérico)
        if (!hasUserLink && !hasPostId) {
            return;
        }
        
        // Verificar contenido multimedia o texto
        const hasVideo = card.querySelector('video');
        const hasImage = card.querySelector('.card-media img');
        const contentElement = card.querySelector('div[style*="line-height"]');
        const hasContent = contentElement && contentElement.textContent.trim();
        
        // Solo incluir posts con contenido válido
        if (hasVideo || hasImage || hasContent) {
            this.availablePosts.push(card);
        }
    });
        
    // Encontrar el índice del post actual
    const currentCard = currentPostElement.closest('.content-card, .chain-event-card');
    this.currentPostIndex = this.availablePosts.indexOf(currentCard);
    
    if (this.currentPostIndex === -1) {
        this.currentPostIndex = 0;
    }
}
    navigateToPost(direction) {
    if (this.isScrolling || this.availablePosts.length === 0) return;
    
    this.isScrolling = true;
    
    let newIndex = this.currentPostIndex;
    
    if (direction === 'next') {
        newIndex = this.currentPostIndex + 1;
        if (newIndex >= this.availablePosts.length) {
            newIndex = this.availablePosts.length - 1;
            this.isScrolling = false;
            return;
        }
    } else if (direction === 'prev') {
        newIndex = this.currentPostIndex - 1;
        if (newIndex < 0) {
            newIndex = 0;
            this.isScrolling = false;
            return;
        }
    }
    
    this.currentPostIndex = newIndex;
    const nextPost = this.availablePosts[newIndex];
    
    if (nextPost) {
        // Pausar video actual si existe
        const currentVideo = this.viewerElement.querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
        }
        
        // Limpiar intervalos
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }
        
        // PRIMERO ocultar controles
        this.hideControls();
        
        // Cargar nuevo post
        this.currentPostData = this.extractPostData(nextPost);
        
        if (this.currentPostData) {
            this.loadMedia();
            this.loadPostInfo();
            // Asegurar que los controles permanezcan ocultos
            this.controlsVisible = false;
            this.startAutoUpdate();
        }
    }
    
    // Permitir siguiente scroll después de un delay
    setTimeout(() => {
        this.isScrolling = false;
    }, 500);
}

startAutoUpdate() {
    if (this.updateInterval) {
        clearInterval(this.updateInterval);
    }
    
    this.updateInterval = setInterval(() => {
        if (this.isActive && this.currentPostData) {
            this.updateActionStates();
        }
    }, 1000); // Actualizar cada segundo
}

    extractPostData(postElement) {
        const postCard = postElement.closest('.content-card, .chain-event-card');
        if (!postCard) return null;

        const postId = postCard.dataset.postId || postCard.dataset.eventId;
        
let mediaType = null;
let mediaUrl = null;
let isSilenced = false;

const videoElement = postCard.querySelector('video');
const imageElement = postCard.querySelector('.card-media img');

if (videoElement) {
    mediaType = 'video';
    mediaUrl = videoElement.src;
    const container = videoElement.closest('[data-silenciado]');
    isSilenced = container?.dataset.silenciado === 'true';
} else if (imageElement) {
    mediaType = 'image';
    mediaUrl = imageElement.src;
}

let username = 'Usuario';
let displayName = 'Usuario';
let avatarUrl = null;
let timeAgo = '';
let tokens = 0;

// ✅ CORREGIDO: Obtener username desde data-username del avatar
const avatarWithUsername = postCard.querySelector('[data-username]');
if (avatarWithUsername?.dataset?.username) {
    username = avatarWithUsername.dataset.username;
}

// Obtener displayName desde el primer enlace a perfil
const displayNameLink = postCard.querySelector('[onclick*="goToUserProfile"]');
if (displayNameLink) {
    const text = displayNameLink.textContent.trim();
    // Si no empieza con @, es el displayName
    if (!text.startsWith('@')) {
        displayName = text;
    }
}

// Buscar tiempo en formato "hace X" o simplemente el tiempo
const postMeta = postCard.querySelector('.post-meta, [class*="meta"]');
if (postMeta) {
    const metaText = postMeta.textContent || '';
    const timeMatch = metaText.match(/hace\s*\d+\s*(?:seg|min|h|d|sem|m|a)/i) ||
                     metaText.match(/\d+\s*(?:seg|min|h|d|sem|m|a)/);
    if (timeMatch) {
        timeAgo = timeMatch[0];
    }
}

// Si no encontró, buscar en el texto general del post
if (!timeAgo) {
    const cardText = postCard.textContent || '';
    const timeMatch = cardText.match(/hace\s*\d+\s*(?:seg|min|h|d|sem|m|a)/i) ||
                     cardText.match(/•\s*(\d+\s*(?:seg|min|h|d|sem|m|a))/);
    if (timeMatch) {
        timeAgo = timeMatch[1] || timeMatch[0];
    }
}

// Buscar tokens
const cardText = postCard.textContent || '';
const tokensMatch = cardText.match(/(\d+)\s*CFT/);
if (tokensMatch) {
    tokens = parseInt(tokensMatch[1]);
}

        const avatarElement = postCard.querySelector('.pmv-avatar img, [style*="border-radius: 50%"] img');
        if (avatarElement) {
            avatarUrl = avatarElement.src;
        }

        const contentElement = postCard.querySelector('div[style*="line-height: 1.6"]');
        const content = contentElement ? contentElement.textContent.trim() : '';

        if (!mediaType && contentElement && content) {
    mediaType = 'text';
}

        const stats = {
            likes: this.extractStat(postCard, 'togglePostLike'),
            comments: this.extractStat(postCard, 'openComments'),
            reposts: this.extractStat(postCard, 'toggleRepost'),
            shares: this.extractStat(postCard, 'openShareModal')
        };

        const likeBtn = postCard.querySelector('[onclick*="togglePostLike"]');
        const repostBtn = postCard.querySelector('[onclick*="toggleRepost"]');
        
        const isLiked = likeBtn?.classList.contains('liked') || false;
        const isReposted = repostBtn?.classList.contains('reposted') || false;

        const saleIndicator = postCard.querySelector('.sale-indicator');
        const salePriceBtn = postCard.querySelector('.sale-price-btn');
        let isForSale = false;
        let salePrice = 0;

        if (saleIndicator || salePriceBtn) {
            isForSale = true;
            
            const priceElement = salePriceBtn || saleIndicator;
            const priceText = priceElement?.textContent || priceElement?.innerText || '';
            const priceMatch = priceText.match(/[\d.]+/);
            salePrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
        }

const currentUsername = window.CHAINFEED_CONFIG?.currentUser?.username?.toLowerCase();
const isOwner = currentUsername && username && (username.toLowerCase() === currentUsername);

        return {
            postId,
            mediaType,
            mediaUrl,
            isSilenced,
            username,
            displayName,
            avatarUrl,
            timeAgo,
            tokens,
            content,
            stats,
            isLiked,
            isReposted,
            element: postCard,
            isForSale: isForSale,
            salePrice: salePrice,
            isOwner: isOwner
        };
    }

    extractStat(postCard, functionName) {
        const button = postCard.querySelector(`[onclick*="${functionName}"]`);
        if (!button) return 0;
        
        const match = button.textContent.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }

    loadMedia() {
        const mediaContainer = this.viewerElement.querySelector('.pmv-media-container');
        const soundBtn = this.viewerElement.querySelector('.pmv-sound-btn');
        const silencedBadge = this.viewerElement.querySelector('.pmv-silenced-badge');
        
        mediaContainer.innerHTML = '';

        if (this.currentPostData.mediaType === 'video') {
            const video = document.createElement('video');
            video.src = this.currentPostData.mediaUrl;
            video.loop = true;
            video.playsInline = true;
            video.muted = true;
            
            if (this.currentPostData.isSilenced) {
                video.dataset.forcedSilent = 'true';
                soundBtn.style.display = 'none';
                silencedBadge.classList.add('visible');
            } else {
                soundBtn.style.display = 'flex';
                silencedBadge.classList.remove('visible');
            }

            video.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.paused) {
                    video.play();
                    // Al darle play, esconder controles inmediatamente
                    this.hideControls();
                } else {
                    video.pause();
                    // Al pausar, mostrar controles
                    this.showControls();
                }
            });

video.addEventListener('pause', () => {
    // Solo mostrar controles si NO estamos navegando entre posts
    if (!this.isScrolling) {
        this.showControls();
        this.startHideControlsTimer(3000);
    }
});

video.addEventListener('play', () => {
    // Solo ocultar si NO estamos navegando
    if (!this.isScrolling) {
        this.hideControls();
    }
});
            mediaContainer.appendChild(video);
            
            setTimeout(() => {
                video.play().catch(() => {});
            }, 100);

} else if (this.currentPostData.mediaType === 'image') {
    const img = document.createElement('img');
    img.src = this.currentPostData.mediaUrl;
    img.alt = 'Imagen del post';
    
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.controlsVisible) {
            this.hideControls();
        } else {
            this.showControls();
            this.startHideControlsTimer(5000);
        }
    });
    
    mediaContainer.appendChild(img);
    
    soundBtn.style.display = 'none';
    silencedBadge.classList.remove('visible');
}
// ✅ AGREGAR ESTO:
else if (this.currentPostData.mediaType === 'text') {
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
    width: 90%;
    height: 90%;
    display: flex;
    padding: 2rem;
    background: #000;
    border-radius: 20px;
    color: white;
    font-size: 1.5rem;
    line-height: 1.6;
    text-align: center;
    backdrop-filter: blur(10px);
    cursor: pointer;
    position: relative;
    z-index: 5;
    justify-content: center;
    flex-direction: column;
    `;
    
  textContainer.textContent = this.currentPostData.content || 'Sin contenido';
    
    // Solo el click para toggle de controles
    textContainer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.controlsVisible) {
            this.hideControls();
        } else {
            this.showControls();
            this.startHideControlsTimer(5000);
        }
    });
        
    mediaContainer.appendChild(textContainer);
    
    soundBtn.style.display = 'none';
    silencedBadge.classList.remove('visible');
}
    }

loadPostInfo() {
    const avatarContainer = this.viewerElement.querySelector('.pmv-avatar');
    if (this.currentPostData.avatarUrl) {
        avatarContainer.innerHTML = `<img src="${this.currentPostData.avatarUrl}" alt="Avatar">`;
    } else {
        avatarContainer.textContent = this.generateInitials(this.currentPostData.username);
    }

    this.viewerElement.querySelector('.pmv-username').textContent = this.currentPostData.displayName;

const timeDisplay = this.currentPostData.timeAgo ? ` • ${this.currentPostData.timeAgo}` : '';
this.viewerElement.querySelector('.pmv-user-meta').textContent = 
    `@${this.currentPostData.username}${timeDisplay}`;

    this.viewerElement.querySelector('.pmv-content').textContent = this.currentPostData.content || '';

    this.loadActions();
}

loadActions() {
    const actionsContainer = this.viewerElement.querySelector('.pmv-actions');
    
    actionsContainer.innerHTML = `
        <button class="pmv-action-btn ${this.currentPostData.isLiked ? 'liked' : ''}" 
                onclick="event.stopPropagation(); window.profileMediaViewer.handleAction('like')">
            <span class="pmv-icon">${this.currentPostData.isLiked ? '❤️' : '🤍'}</span>
            <span class="pmv-count">${this.currentPostData.stats.likes}</span>
        </button>
        <button class="pmv-action-btn" onclick="event.stopPropagation(); window.profileMediaViewer.handleAction('comment')">
            <span class="pmv-icon">💬</span>
            <span class="pmv-count">${this.currentPostData.stats.comments}</span>
        </button>
        <button class="pmv-action-btn ${this.currentPostData.isReposted ? 'reposted' : ''}" 
                onclick="event.stopPropagation(); window.profileMediaViewer.handleAction('repost')">
            <svg class="pmv-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            <span class="pmv-count">${this.currentPostData.stats.reposts}</span>
        </button>
        <button class="pmv-action-btn" onclick="event.stopPropagation(); window.profileMediaViewer.handleAction('share')">
            <svg class="pmv-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            <span class="pmv-count">${this.currentPostData.stats.shares}</span>
        </button>
${this.currentPostData.isForSale ? `
    <button class="pmv-action-btn ${this.currentPostData.isOwner ? 'sale-info-btn' : 'buy-btn'}" 
            onclick="event.stopPropagation(); window.profileMediaViewer.handleAction('${this.currentPostData.isOwner ? 'info' : 'buy'}')"
            style="background: linear-gradient(135deg, rgb(245, 158, 11), rgb(217, 119, 6)) !important; border: 1px solid rgb(245, 158, 11) !important; ${this.currentPostData.isOwner ? 'opacity: 0.6; cursor: not-allowed; pointer-events: none;' : ''}"
            ${this.currentPostData.isOwner ? 'disabled' : ''}>
        <span class="pmv-icon">💰</span>
        <span class="pmv-count">${this.currentPostData.salePrice.toFixed(2)} CFT</span>
    </button>
` : ''}
    `;
}

updateActionStates() {
    const postElement = this.currentPostData.element;
    
    // Extraer nuevos valores
    const newLikes = this.extractStat(postElement, 'togglePostLike');
    const newComments = this.extractStat(postElement, 'openComments');
    const newReposts = this.extractStat(postElement, 'toggleRepost');
    const newShares = this.extractStat(postElement, 'openShareModal');
    
    const likeBtn = postElement.querySelector('[onclick*="togglePostLike"]');
    const repostBtn = postElement.querySelector('[onclick*="toggleRepost"]');
    
    const newIsLiked = likeBtn?.classList.contains('liked') || false;
    const newIsReposted = repostBtn?.classList.contains('reposted') || false;
    
    // Solo actualizar si hay cambios reales
    const hasChanges = 
        this.currentPostData.stats.likes !== newLikes ||
        this.currentPostData.stats.comments !== newComments ||
        this.currentPostData.stats.reposts !== newReposts ||
        this.currentPostData.stats.shares !== newShares ||
        this.currentPostData.isLiked !== newIsLiked ||
        this.currentPostData.isReposted !== newIsReposted;
    
    if (!hasChanges) return; // No regenerar si no hay cambios
    
    // Actualizar datos internos
    this.currentPostData.stats.likes = newLikes;
    this.currentPostData.stats.comments = newComments;
    this.currentPostData.stats.reposts = newReposts;
    this.currentPostData.stats.shares = newShares;
    this.currentPostData.isLiked = newIsLiked;
    this.currentPostData.isReposted = newIsReposted;
    
    // Actualizar solo los elementos específicos, NO regenerar todo
    const actionsContainer = this.viewerElement.querySelector('.pmv-actions');
    if (!actionsContainer) return;
    
    const buttons = actionsContainer.querySelectorAll('.pmv-action-btn');
    
    buttons.forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        
        if (onclick.includes("'like'")) {
            btn.classList.toggle('liked', newIsLiked);
            const icon = btn.querySelector('.pmv-icon');
            const count = btn.querySelector('.pmv-count');
            if (icon) icon.textContent = newIsLiked ? '❤️' : '🤍';
            if (count) count.textContent = newLikes;
        }
        else if (onclick.includes("'comment'")) {
            const count = btn.querySelector('.pmv-count');
            if (count) count.textContent = newComments;
        }
        else if (onclick.includes("'repost'")) {
            btn.classList.toggle('reposted', newIsReposted);
            const count = btn.querySelector('.pmv-count');
            if (count) count.textContent = newReposts;
        }
        else if (onclick.includes("'share'")) {
            const count = btn.querySelector('.pmv-count');
            if (count) count.textContent = newShares;
        }
    });
}

handleAction(action) {
    try {
        const postElement = this.currentPostData.element;
        
        switch(action) {
case 'like':
    const likeBtn = postElement.querySelector('[onclick*="togglePostLike"]');
    if (likeBtn) {
        likeBtn.click();
        // Actualizar inmediatamente con optimistic update
        this.currentPostData.isLiked = !this.currentPostData.isLiked;
        this.currentPostData.stats.likes += this.currentPostData.isLiked ? 1 : -1;
        this.loadActions();
        
        // Verificar el estado real después de un momento
        setTimeout(() => this.updateActionStates(), 800);
    }
    this.restartHideControlsTimer(5000);
    break;
                
            case 'comment':
                const commentBtn = postElement.querySelector('[onclick*="openComments"]');
                if (commentBtn) commentBtn.click();
                this.restartHideControlsTimer(5000);
                break;
                
case 'repost':
    const repostBtn = postElement.querySelector('[onclick*="toggleRepost"]');
    if (repostBtn) {
        repostBtn.click();
        // Actualizar inmediatamente con optimistic update
        this.currentPostData.isReposted = !this.currentPostData.isReposted;
        this.currentPostData.stats.reposts += this.currentPostData.isReposted ? 1 : -1;
        this.loadActions();
        
        // Verificar el estado real después de un momento
        setTimeout(() => this.updateActionStates(), 800);
    }
    this.restartHideControlsTimer(5000);
    break;
                
            case 'share':
                const shareBtn = postElement.querySelector('[onclick*="openShareModal"]');
                if (shareBtn) shareBtn.click();
                this.restartHideControlsTimer(5000);
                break;
            
            // 🔥 NUEVO: Acción para posts propios en venta
            case 'info':
                this.showNotification(`💰 Tu post está en venta por ${this.currentPostData.salePrice.toFixed(2)} CFT`);
                this.restartHideControlsTimer(5000);
                break;
            
            case 'buy':
                if (typeof window.buyPost === 'function') {
                    this.purchaseInProgress = true;
                    window.buyPost(this.currentPostData.postId);
                    this.hideControls();
                    this.setupPurchaseCompleteListener();
                } else {
                    console.error('buyPost function not found');
                }
                break;
        }
    } catch (error) {
        console.error('Error en acción:', error);
    }
}

    setupPurchaseCompleteListener() {
        // Detectar cuando el modal de compra se cierra para recargar la página
        const checkModalClosed = setInterval(() => {
            // Buscar el modal de compra en el DOM
            const buyModal = document.querySelector('#buyModal, .buy-modal, [class*="buy-modal"]');
            
            if (buyModal) {
                // Si encontramos el modal, esperamos a que desaparezca
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
                                
                                // Pequeño delay para asegurar que la compra se procesó
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
        
        // Timeout de seguridad: si después de 30 segundos no se detectó nada, limpiar
        setTimeout(() => {
            clearInterval(checkModalClosed);
            if (this.purchaseInProgress) {
                console.log('⏱️ Timeout de detección de compra alcanzado');
                this.purchaseInProgress = false;
            }
        }, 30000);
    }

    toggleSound() {
        const video = this.viewerElement.querySelector('video');
        if (!video || video.dataset.forcedSilent === 'true') return;

        const soundBtn = this.viewerElement.querySelector('.pmv-sound-btn');
        const soundOn = soundBtn.querySelector('.sound-on');
        const soundOff = soundBtn.querySelector('.sound-off');

        video.muted = !video.muted;

        if (video.muted) {
            soundBtn.classList.add('muted');
            soundOn.style.display = 'none';
            soundOff.style.display = 'block';
        } else {
            soundBtn.classList.remove('muted');
            soundOn.style.display = 'block';
            soundOff.style.display = 'none';
        }

        this.restartHideControlsTimer(5000);
    }

    showControls() {
        this.controlsVisible = true;
        this.viewerElement.querySelector('.pmv-close-btn').classList.add('visible');
        this.viewerElement.querySelector('.pmv-sound-btn').classList.add('visible');
        this.viewerElement.querySelector('.pmv-info-bar').classList.add('visible');
    }

    hideControls() {
        this.controlsVisible = false;
        this.viewerElement.querySelector('.pmv-close-btn').classList.remove('visible');
        this.viewerElement.querySelector('.pmv-sound-btn').classList.remove('visible');
        this.viewerElement.querySelector('.pmv-info-bar').classList.remove('visible');
        
        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }
    }

    startHideControlsTimer(duration = 3000) {
        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }
        
        this.hideControlsTimeout = setTimeout(() => {
            this.hideControls();
        }, duration);
    }

    restartHideControlsTimer(duration = 5000) {
        this.showControls();
        this.startHideControlsTimer(duration);
    }

    close() {
        const video = this.viewerElement.querySelector('video');
        if (video) {
            video.pause();
        }

        this.isActive = false;
        this.viewerElement.classList.remove('active');
        document.body.style.overflow = '';

        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        this.currentPostData = null;
        this.controlsVisible = false;
        this.purchaseInProgress = false;
        this.availablePosts = [];
        this.currentPostIndex = 0;
        this.isScrolling = false;
    }

    generateInitials(username) {
        if (!username) return 'U';
        return username.substring(0, 2).toUpperCase();
    }
showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(99, 102, 241, 0.95);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: slideDown 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

}


// Inicializar viewer global
if (!window.profileMediaViewer) {
    window.profileMediaViewer = new ProfileMediaViewer();
}

// Reemplazar funciones globales existentes
window.openVideoFullscreen = function(element, event) {
    if (event) event.stopPropagation();
    window.profileMediaViewer.open(element);
};

window.openImageFullscreen = function(element) {
    window.profileMediaViewer.open(element);
};

// Reemplazar funciones globales existentes
window.openVideoFullscreen = function(element, event) {
    if (event) event.stopPropagation();
    window.profileMediaViewer.open(element);
};

window.openImageFullscreen = function(element) {
    window.profileMediaViewer.open(element);
};

// ✅ AGREGAR ESTO:
// Función para abrir posts de texto (estados)
window.openTextFullscreen = function(element) {
    window.profileMediaViewer.open(element);
};

// Event delegation para detectar clicks en contenido de posts de texto
document.addEventListener('click', function(e) {
    // Buscar si el click fue en un div de contenido de post
    const contentDiv = e.target.closest('div[style*="line-height: 1.6"]');
    
    if (contentDiv) {
        // Verificar que sea parte de un post card
        const postCard = contentDiv.closest('.content-card, .chain-event-card');
        
        if (postCard) {
            // Verificar que NO tenga video ni imagen (solo texto)
            const hasVideo = postCard.querySelector('video');
            const hasImage = postCard.querySelector('.card-media img');
            
            if (!hasVideo && !hasImage && contentDiv.textContent.trim()) {
                // Es un post de solo texto, abrir fullscreen
                e.stopPropagation();
                window.profileMediaViewer.open(contentDiv);
            }
        }
    }
});


console.log('✅ Profile Media Viewer - Navegación tipo Reels + Controles inteligentes');