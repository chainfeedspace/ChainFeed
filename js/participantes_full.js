(function() {
    'use strict';
    
    class ParticipantesFullscreenViewer {
        constructor() {
            this.isActive = false;
            this.currentSubmission = null;
            this.viewerContainer = null;
            this.controlsVisible = true;
            this.hideControlsTimeout = null;
            
            this.init();
        }
        
        init() {
            this.createViewerHTML();
            this.attachEventListeners();
            console.log('✅ Participantes Fullscreen Viewer v2.0 inicializado');
        }
        
        createViewerHTML() {
            const viewer = document.createElement('div');
            viewer.className = 'pfsv-container';
            viewer.innerHTML = `
                <div class="pfsv-media-container">
                    <!-- Media se inyecta aquí -->
                </div>

                <button class="pfsv-close-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </button>

                <div class="pfsv-info-bar">
                    <div class="pfsv-user-header">
                        <div class="pfsv-avatar"></div>
                        <div class="pfsv-user-info">
                            <div class="pfsv-username"></div>
                            <div class="pfsv-user-meta"></div>
                        </div>
                    </div>
                    <div class="pfsv-content"></div>
                    <div class="pfsv-actions">
                        <button class="pfsv-like-btn" data-submission-id="">
                            <span class="pfsv-like-icon">🤍</span>
                            <span class="pfsv-like-count">0</span>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(viewer);
            this.viewerContainer = viewer;
            
            this.addStyles();
        }
        
        addStyles() {
            if (document.getElementById('pfsv-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'pfsv-styles';
            style.textContent = `
                .pfsv-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #000;
                    z-index: 99999;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease;
                }
                
                .pfsv-container.active {
                    opacity: 1;
                    visibility: visible;
                }
                
                .pfsv-media-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .pfsv-media-container video,
                .pfsv-media-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .pfsv-media-container video {
                    width: 100%;
                    height: 100%;
                }
                
                .pfsv-close-btn {
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
                    z-index: 100000;
                    transition: all 0.3s ease;
                }
                
                .pfsv-close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }
                
                .pfsv-info-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7));
                    backdrop-filter: blur(20px);
                    color: white;
                    padding: 1.5rem;
                    z-index: 100000;
                    max-height: 40vh;
                    overflow-y: auto;
                }
                
                .pfsv-user-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .pfsv-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #ec4899);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                
                .pfsv-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .pfsv-user-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .pfsv-username {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                .pfsv-user-meta {
                    font-size: 0.85rem;
                    opacity: 0.7;
                    margin-top: 0.25rem;
                }
                
                .pfsv-content {
                    margin-bottom: 1rem;
                    line-height: 1.5;
                    font-size: 0.95rem;
                    max-height: 120px;
                    overflow-y: auto;
                }
                
                .pfsv-actions {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: center;
                }
                
                .pfsv-like-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 0.6rem 1.5rem;
                    border-radius: 50px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }
                
                .pfsv-like-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }
                
                .pfsv-like-btn.liked {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: rgba(239, 68, 68, 0.5);
                }
                
                .pfsv-like-btn.liked:hover {
                    background: rgba(239, 68, 68, 0.3);
                }
                
                .pfsv-like-btn:active {
                    transform: scale(0.95);
                }
                
                .pfsv-like-icon {
                    font-size: 1.3rem;
                    transition: transform 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .pfsv-like-btn.liked .pfsv-like-icon {
                    animation: pfsv-heartbeat 0.6s ease;
                }
                
                .pfsv-like-count {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                @keyframes pfsv-heartbeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.3); }
                    50% { transform: scale(1.1); }
                    75% { transform: scale(1.2); }
                }
                
                /* Controles ocultos */
                .pfsv-container .pfsv-close-btn,
                .pfsv-container .pfsv-info-bar {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .pfsv-container.controls-hidden .pfsv-close-btn {
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(-20px);
                }
                
                .pfsv-container.controls-hidden .pfsv-info-bar {
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(100%);
                }
                
                /* Mobile responsive */
                @media (max-width: 768px) {
                    .pfsv-close-btn {
                        top: 10px;
                        left: 10px;
                        width: 40px;
                        height: 40px;
                    }
                    
                    .pfsv-info-bar {
                        padding: 1rem;
                    }
                    
                    .pfsv-like-btn {
                        padding: 0.5rem 1.2rem;
                        font-size: 0.85rem;
                    }
                    
                    .pfsv-like-icon {
                        font-size: 1.2rem;
                    }
                }
                
                /* Evitar selección */
                .pfsv-container,
                .pfsv-container * {
                    -webkit-tap-highlight-color: transparent;
                    -webkit-user-select: none;
                    user-select: none;
                }
            `;
            
            document.head.appendChild(style);
        }
        
        attachEventListeners() {
            const closeBtn = this.viewerContainer.querySelector('.pfsv-close-btn');
            closeBtn.addEventListener('click', () => this.closeViewer());
            
            this.viewerContainer.addEventListener('click', (e) => {
                if (e.target === this.viewerContainer || e.target === this.viewerContainer.querySelector('.pfsv-media-container')) {
                    this.closeViewer();
                }
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isActive) {
                    this.closeViewer();
                }
            });
            
            const likeBtn = this.viewerContainer.querySelector('.pfsv-like-btn');
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLike();
            });
        }
        
        showControls() {
            this.controlsVisible = true;
            this.viewerContainer.classList.remove('controls-hidden');
            this.restartHideTimer();
        }
        
        hideControls() {
            this.controlsVisible = false;
            this.viewerContainer.classList.add('controls-hidden');
            if (this.hideControlsTimeout) {
                clearTimeout(this.hideControlsTimeout);
                this.hideControlsTimeout = null;
            }
        }
        
        restartHideTimer() {
            if (this.hideControlsTimeout) {
                clearTimeout(this.hideControlsTimeout);
            }
            this.hideControlsTimeout = setTimeout(() => {
                this.hideControls();
            }, 3000);
        }
        
        openViewer(submissionElement) {
            const submissionId = submissionElement.dataset.submissionId;
            if (!submissionId) {
                console.error('❌ No se encontró ID de participación');
                return;
            }
            
            this.currentSubmission = submissionElement;
            
            const mediaContainer = submissionElement.querySelector('.submission-media');
            const likeBtn = submissionElement.querySelector('.submission-like-btn');
            
            if (!mediaContainer) {
                console.error('❌ No se encontró media en la participación');
                return;
            }
            
            this.renderMedia(mediaContainer);
            this.loadUserInfo(submissionElement);
            this.updateLikeButton(likeBtn, submissionId);
            
            this.viewerContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isActive = true;
            
            setTimeout(() => {
                const video = this.viewerContainer.querySelector('video');
                if (video) {
                    video.play().catch(err => console.log('Auto-play bloqueado:', err));
                }
                this.restartHideTimer();
            }, 100);
            
            console.log('✅ Viewer abierto para participación:', submissionId);
        }
        
        renderMedia(mediaContainer) {
            const container = this.viewerContainer.querySelector('.pfsv-media-container');
            container.innerHTML = '';
            
            const videoElement = mediaContainer.querySelector('video');
            const imgElement = mediaContainer.querySelector('img');
            
            if (videoElement) {
                const video = document.createElement('video');
                video.src = videoElement.src;
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                video.controls = false;
                video.muted = true;
                
                video.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                    if (this.controlsVisible) {
                        this.hideControls();
                    } else {
                        this.showControls();
                    }
                });
                
                container.appendChild(video);
                
            } else if (imgElement) {
                const img = document.createElement('img');
                img.src = imgElement.src;
                img.alt = imgElement.alt || 'Participación';
                
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.controlsVisible) {
                        this.hideControls();
                    } else {
                        this.showControls();
                    }
                });
                
                container.appendChild(img);
            }
        }
        
        loadUserInfo(submissionElement) {
            const usernameElement = submissionElement.querySelector('.submission-username');
            const avatarElement = submissionElement.querySelector('.submission-avatar img');
            const dateElement = submissionElement.querySelector('.submission-date');
            const descElement = submissionElement.querySelector('.submission-description');
            
            const avatarContainer = this.viewerContainer.querySelector('.pfsv-avatar');
            if (avatarElement) {
                avatarContainer.innerHTML = `<img src="${avatarElement.src}" alt="Avatar">`;
            } else {
                const username = usernameElement?.textContent || 'Usuario';
                avatarContainer.textContent = this.generateInitials(username);
            }
            
            const username = usernameElement?.textContent || 'Usuario';
            this.viewerContainer.querySelector('.pfsv-username').textContent = username;
            
            const date = dateElement?.textContent || '';
            let metaText = `@${username.toLowerCase().replace(/\s+/g, '')}`;
            if (date) {
                metaText += ` • ${date}`;
            }
            this.viewerContainer.querySelector('.pfsv-user-meta').textContent = metaText;
            
            const description = descElement?.textContent || '';
            this.viewerContainer.querySelector('.pfsv-content').textContent = description;
        }
        
        updateLikeButton(originalLikeBtn, submissionId) {
            const likeBtn = this.viewerContainer.querySelector('.pfsv-like-btn');
            const likeIcon = likeBtn.querySelector('.pfsv-like-icon');
            const likeCount = likeBtn.querySelector('.pfsv-like-count');
            
            const isLiked = originalLikeBtn?.classList.contains('liked') || false;
            const count = originalLikeBtn?.querySelector('.like-count')?.textContent || '0';
            
            likeBtn.dataset.submissionId = submissionId;
            likeBtn.classList.toggle('liked', isLiked);
            likeIcon.textContent = isLiked ? '❤️' : '🤍';
            likeCount.textContent = count;
        }
        
        async handleLike() {
    const likeBtn = this.viewerContainer.querySelector('.pfsv-like-btn');
    const submissionId = likeBtn.dataset.submissionId;
    
    if (!submissionId) return;
    
    const likeIcon = likeBtn.querySelector('.pfsv-like-icon');
    const likeCount = likeBtn.querySelector('.pfsv-like-count');
    
    // 🔥 ACTUALIZACIÓN OPTIMISTA - Cambiar UI inmediatamente
    const wasLiked = likeBtn.classList.contains('liked');
    const currentCount = parseInt(likeCount.textContent) || 0;
    
    // Actualizar UI inmediatamente
    likeBtn.classList.toggle('liked', !wasLiked);
    likeIcon.textContent = wasLiked ? '🤍' : '❤️';
    likeCount.textContent = wasLiked ? currentCount - 1 : currentCount + 1;
    
    likeBtn.style.pointerEvents = 'none';
    
    try {
        const cleanId = submissionId.toString().replace('chain-', '');
        const numericId = parseInt(cleanId);
        
        const response = await fetch('/php/manejar_likes_participaciones.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                participacion_id: numericId
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Actualizar con datos reales del servidor
            likeBtn.classList.toggle('liked', data.liked);
            likeIcon.textContent = data.liked ? '❤️' : '🤍';
            likeCount.textContent = data.new_like_count;
            
            // Actualizar botón original
            const originalBtn = this.currentSubmission?.querySelector('.submission-like-btn');
            if (originalBtn) {
                originalBtn.classList.toggle('liked', data.liked);
                originalBtn.style.color = data.liked ? 'var(--error)' : 'var(--text)';
                originalBtn.innerHTML = `${data.liked ? '❤️' : '🤍'} <span class="like-count">${data.new_like_count}</span>`;
            }
            
            if (data.liked && window.showNotification) {
                window.showNotification('❤️ ¡Like dado! +1 CFT al participante', 'success');
            }
            
        } else {
            // Revertir en caso de error del servidor
            likeBtn.classList.toggle('liked', wasLiked);
            likeIcon.textContent = wasLiked ? '❤️' : '🤍';
            likeCount.textContent = currentCount;
            
            throw new Error(data.message || 'Error al procesar like');
        }
        
    } catch (error) {
        console.error('❌ Error en like:', error);
        
        // Revertir cambios en caso de error
        likeBtn.classList.toggle('liked', wasLiked);
        likeIcon.textContent = wasLiked ? '❤️' : '🤍';
        likeCount.textContent = currentCount;
        
        if (window.showNotification) {
            window.showNotification('❌ Error al dar like', 'error');
        }
    } finally {
        likeBtn.style.pointerEvents = 'auto';
    }
}
        
        closeViewer() {
            const video = this.viewerContainer.querySelector('video');
            if (video) {
                video.pause();
            }
            
            if (this.hideControlsTimeout) {
                clearTimeout(this.hideControlsTimeout);
                this.hideControlsTimeout = null;
            }
            
            this.viewerContainer.classList.remove('active', 'controls-hidden');
            document.body.style.overflow = '';
            this.isActive = false;
            this.currentSubmission = null;
            this.controlsVisible = true;
            
            console.log('✅ Viewer cerrado');
        }
        
        generateInitials(username) {
            if (!username) return 'U';
            const words = username.trim().split(' ');
            if (words.length > 1) {
                return (words[0][0] + words[1][0]).toUpperCase();
            }
            return username.substring(0, 2).toUpperCase();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticipantesViewer);
    } else {
        initParticipantesViewer();
    }
    
    function initParticipantesViewer() {
        window.participantesFullscreenViewer = new ParticipantesFullscreenViewer();
        
        document.addEventListener('click', function(e) {
            const submissionsModal = document.getElementById('submissionsModal');
            if (!submissionsModal || !submissionsModal.classList.contains('active')) {
                return;
            }
            
            const videoMedia = e.target.closest('.card-media');
            const imgMedia = e.target.tagName === 'IMG' && e.target.closest('.submission-media');
            
            if (videoMedia || imgMedia) {
                if (e.target.closest('.submission-audio-player')) {
                    return;
                }
                
                const submissionItem = e.target.closest('.submission-item');
                if (submissionItem && window.participantesFullscreenViewer) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.participantesFullscreenViewer.openViewer(submissionItem);
                }
            }
        });
        
        console.log('✅ Participantes Fullscreen Viewer v2.0 - Diseño unificado');
    }
    
})();