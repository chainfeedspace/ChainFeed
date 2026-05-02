/**
 * FULLSCREEN VIEWER - CHAIN EVENTS PATCH
 * Adaptado a estructura real de Chain Events
 * 
 * @version 1.3
 * @author ChainFeed
 */
(function() {
    'use strict';
    
    const waitForViewer = setInterval(() => {
        if (window.fullscreenViewer) {
            clearInterval(waitForViewer);
            initChainPatch();
        }
    }, 100);
    
    function initChainPatch() {
        const viewer = window.fullscreenViewer;
        
        if (!viewer) {
            console.error('❌ fullscreenViewer no encontrado.');
            return;
        }
        
        console.log('🔧 Aplicando Chain Events Patch v1.3...');
        
        // ============================================
        // PATCH 1: Detectar y abrir Chain Event
        // ============================================
        const originalOpenViewer = viewer.openViewer.bind(viewer);
        viewer.openViewer = function(triggerPostElement) {
            const postCard = triggerPostElement.closest('.content-card, .chain-event-card');
            const isChainEvent = postCard?.classList.contains('chain-event-card') || 
                               !!postCard?.dataset.eventId;
            
            if (isChainEvent) {
                console.log('🔗 Abriendo Chain Event');
                
                this.posts = [postCard];
                this.currentIndex = 0;
                this.isChainEvent = true;
                this.isActive = true;
                
                this.viewerContainer.classList.add('active');
                document.body.style.overflow = 'hidden';
                document.body.classList.add('chain-event-active');
                
                this.hideControls();
                this.renderChainEvent(postCard);
                this.updateChainBottomBar(postCard);
                
                setTimeout(() => {
                    this.playCurrentVideo();
                    this.updateSoundButtonVisibility();
                }, 100);
                
                return;
            }
            
            this.isChainEvent = false;
            originalOpenViewer.call(this, triggerPostElement);
        };
        
        // ============================================
        // NUEVO: Renderizar Chain Event
        // ============================================
        viewer.renderChainEvent = function(chainCard) {
            const container = this.viewerContainer.querySelector('.fsv-posts-container');
            container.innerHTML = '';
            
            const mediaContainer = document.createElement('div');
            mediaContainer.className = 'fsv-media-only fsv-post';
            mediaContainer.dataset.position = '0';
            mediaContainer.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000;';
            
            // Buscar media en Chain Event
            const videoElement = chainCard.querySelector('.card-media video');
            const imageElement = chainCard.querySelector('.card-media img');
            
            if (videoElement) {
                const video = document.createElement('video');
                video.src = videoElement.src;
                video.className = 'fsv-video';
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                video.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: cover;';
                
                const isSilenced = chainCard.querySelector('[data-silenciado="true"]');
                video.muted = isSilenced ? true : this.globalMuted;
                
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
                
                mediaContainer.appendChild(video);
                
} else if (imageElement) {
    const img = document.createElement('img');
    img.src = imageElement.src;
    img.alt = imageElement.alt || 'Chain Event';
    img.className = 'fsv-image';
    img.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: cover;';
    
    const self = this;
    
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Verificar si el close-btn tiene la clase 'visible'
        const isVisible = self.viewerContainer.querySelector('.fsv-close-btn').classList.contains('visible');
        
        if (isVisible) {
            self.hideControls();
        } else {
            self.showControls();
        }
    });
    
    mediaContainer.appendChild(img);
}
            
            container.appendChild(mediaContainer);
        };
        
        // ============================================
        // NUEVO: Actualizar barra inferior para Chain
        // ============================================
        viewer.updateChainBottomBar = function(chainCard) {
            console.log('📋 Actualizando barra inferior para Chain Event');
            
            // Buscar elementos en la estructura real
            const cardContent = chainCard.querySelector('.card-content');
            
// ✅ Avatar: buscar dentro del post-avatar-wrapper > post-avatar
const avatarContainer = this.viewerContainer.querySelector('.fsv-avatar');
const avatarDiv = cardContent?.querySelector('.post-avatar-wrapper .post-avatar');
if (avatarDiv && avatarContainer) {
    // Copiar todo el contenido del avatar (img o iniciales)
    avatarContainer.innerHTML = avatarDiv.innerHTML;
    avatarContainer.style.cssText = 'width: 40px; height: 40px; border-radius: 50%; overflow: hidden;';
    console.log('✅ Avatar copiado:', avatarDiv.innerHTML.substring(0, 50));
} else {
    console.log('⚠️ Avatar no encontrado. Estructura:', cardContent?.innerHTML.substring(0, 200));
}
            
            // Display Name: buscar dentro del primer div con font-weight: 600
            const usernameContainer = this.viewerContainer.querySelector('.fsv-username');
            const displayNameSpan = cardContent?.querySelector('[style*="font-weight: 600"] span[onclick*="goToUserProfile"]');
            if (displayNameSpan && usernameContainer) {
                usernameContainer.textContent = displayNameSpan.textContent.trim();
                console.log('✅ Display name:', displayNameSpan.textContent.trim());
            }
            
            // Username: buscar en el div con color: var(--text-secondary)
            const metaContainer = this.viewerContainer.querySelector('.fsv-user-meta');
            const usernameSpan = cardContent?.querySelector('[style*="color: var(--text-secondary)"] span[onclick*="goToUserProfile"]');
            if (usernameSpan && metaContainer) {
                metaContainer.textContent = usernameSpan.textContent.trim();
                console.log('✅ Username:', usernameSpan.textContent.trim());
            }
            
            // Descripción
            const contentContainer = this.viewerContainer.querySelector('.fsv-post-content');
            const descriptionP = chainCard.querySelector('.chain-event-description');
            if (descriptionP && contentContainer) {
                contentContainer.textContent = descriptionP.textContent.trim();
                console.log('✅ Descripción:', descriptionP.textContent.trim());
            }
            
            // IMPORTANTE: Ocultar acciones completamente
            const actionsContainer = this.viewerContainer.querySelector('.fsv-post-actions');
            if (actionsContainer) {
                actionsContainer.innerHTML = '';
                actionsContainer.style.display = 'none';
                console.log('✅ Acciones ocultadas');
            }
        };
        
        // ============================================
        // PATCH 2: No actualizar stats en Chain Events
        // ============================================
        const originalUpdatePostStats = viewer.updatePostStats.bind(viewer);
        viewer.updatePostStats = function(postElement) {
            if (this.isChainEvent) {
                return; // No hacer nada
            }
            originalUpdatePostStats.call(this, postElement);
        };
        
        // ============================================
        // PATCH 3: Deshabilitar navegación
        // ============================================
        const originalNavigateToPost = viewer.navigateToPost.bind(viewer);
        viewer.navigateToPost = function(index) {
            if (this.isChainEvent) {
                console.log('⚠️ Navegación deshabilitada en Chain Events');
                return;
            }
            originalNavigateToPost.call(this, index);
        };
        
        // ============================================
        // PATCH 4: Limpiar al cerrar
        // ============================================
        const originalCloseViewer = viewer.closeViewer.bind(viewer);
        viewer.closeViewer = function() {
            this.isChainEvent = false;
            document.body.classList.remove('chain-event-active');
            originalCloseViewer.call(this);
        };
        
        // ============================================
        // CSS para ocultar elementos
        // ============================================
        const style = document.createElement('style');
        style.textContent = `
            body.chain-event-active .fsv-post-actions {
                display: none !important;
            }
            
            body.chain-event-active .fsv-navigation {
                display: none !important;
            }
            
            .fsv-post-actions:empty {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ Chain Events Patch v1.3 aplicado (Inicio)');
        console.log('📱 Estructura adaptada a HTML real de Chain Events');
    }
    
})();