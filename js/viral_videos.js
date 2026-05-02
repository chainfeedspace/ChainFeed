/**
 * VIRAL VIDEOS BUTTON - Sistema de acceso rápido a contenido multimedia
 * Botón independiente dentro de .feed-navigation
 * Versión: 2.4.0 - Clase independiente del sistema expandible
 */

(function() {
    'use strict';
    
    // Variables globales
    let viralButton = null;
    let currentSection = null;
    let isProcessing = false;
    let navigationObserver = null;
    let removedPosts = [];
    
    // Configuración
    const CONFIG = {
        buttonId: 'viralVideosBtn',
        buttonClass: 'viral-action-btn', // ✅ CLASE ÚNICA
        transitionDuration: 400
    };
    
    /**
     * Inicializar sistema
     */
    function init() {
        waitForNavigation();
        console.log('✅ Sistema de Viral Videos Button inicializado');
    }
    
function waitForNavigation() {
    const checkNav = setInterval(() => {
        const feedNav = document.querySelector('.feed-navigation');
        if (feedNav) {
            clearInterval(checkNav);
            createViralButton();
            setupPreExpandListener();
            setupNavigationObserver();
            setupExpandCollapseObserver();
            
            // ✅ MOSTRAR DESDE EL INICIO
            checkInitialState();
        }
    }, 100);
}
    
function checkInitialState() {
    // ... todo el contenido
}
    
/**
 * Crear botón dual: en navegación Y flotante
 */
function createViralButton() {
    // Botón en la navegación (posición inicial)
    const feedNav = document.querySelector('.feed-navigation');
    if (feedNav) {
        const navButton = document.createElement('button');
        navButton.id = CONFIG.buttonId + '-nav';
        navButton.className = CONFIG.buttonClass;
        navButton.setAttribute('aria-label', 'Ver contenido multimedia');
        
        navButton.style.cssText = `
            background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
            color: white !important;
            padding: 3px !important;
            border-radius: 50px !important;
            cursor: pointer !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            outline: none !important;
            user-select: none !important;
            position: sticky !important;
            overflow: hidden !important;
            border: 1px solid #8018e733 !important;
            opacity: 1 !important;
            transform: translateX(0) scale(1) !important;
            pointer-events: auto !important;
            margin-left: auto !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            box-shadow: 0 4px 12px rgba(128, 24, 231, 0.3) !important;
            z-index: 100 !important;
        `;
        
        navButton.innerHTML = '<img src="/icons/logo72.png" alt="Viral" style="width: 45px; height: 45px; object-fit: contain;">';
        navButton.addEventListener('click', handleButtonClick);
        navButton.addEventListener('mouseenter', handleMouseEnter);
        navButton.addEventListener('mouseleave', handleMouseLeave);
        
        feedNav.appendChild(navButton);
        
        // ✅ Guardar posición del botón original para el flotante
        setTimeout(() => {
            const rect = navButton.getBoundingClientRect();
            window.viralButtonPosition = {
                top: rect.top + window.scrollY,
                right: window.innerWidth - rect.right
            };
        }, 100);
    }
    
    // Botón flotante (aparece con scroll en la MISMA posición)
    const floatingButton = document.createElement('button');
    floatingButton.id = CONFIG.buttonId;
    floatingButton.className = CONFIG.buttonClass + '-floating';
    floatingButton.setAttribute('aria-label', 'Ver contenido multimedia');
    
    floatingButton.style.cssText = `
        width: 35px;
    height: 35px;
        background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
        color: white !important;
        padding: 0px !important;
        border-radius: 50px !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        font-size: 0.9rem !important;
        font-weight: 600 !important;
        outline: none !important;
        user-select: none !important;
        position: fixed !important;
        top: 150px !important;
        right: 20px !important;
        overflow: hidden !important;
        border: 1px solid #8018e733 !important;
        opacity: 0 !important;
        transform: scale(0.8) !important;
        pointer-events: none !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        box-shadow: 0 4px 12px rgba(128, 24, 231, 0.3) !important;
        z-index: 9999 !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
    `;
    
    floatingButton.innerHTML = '<img src="/icons/logo72.png" alt="Viral" style="width: 45px !important; height: 45px !important; object-fit: contain;">';
    floatingButton.addEventListener('click', handleButtonClick);
    floatingButton.addEventListener('mouseenter', handleMouseEnter);
    floatingButton.addEventListener('mouseleave', handleMouseLeave);
    
    document.body.appendChild(floatingButton);
    viralButton = floatingButton;
    
    setupScrollObserver();
    
    console.log('✅ Botones virales creados (navegación + flotante arriba-derecha)');
}

function setupScrollObserver() {
    console.log('🎯 Configurando observer con predicción agresiva + CSS fix...');
    
    // 🎯 INYECTAR FIX CSS PRIMERO
    function injectViralButtonCSS() {
        const style = document.createElement('style');
style.textContent = `
    /* 🎯 BOTÓN VIRAL - OCULTAR AL INICIAR EXPANSIÓN */
    .feed-navigation.expanding #viralVideosBtn-nav,
    .feed-navigation.expanded #viralVideosBtn-nav,
    .feed-navigation.expanding #viralVideosBtn,
    .feed-navigation.expanded #viralVideosBtn {
        opacity: 0 !important;
        pointer-events: none !important;
        transform: scale(0.8) !important;
        transition: opacity 0.15s ease, transform 0.15s ease !important;
        visibility: hidden !important;
    }
        
    .feed-navigation:not(.expanded):not(.expanding) #viralVideosBtn-nav {
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: scale(1) !important;
        transition: opacity 0.3s ease, transform 0.3s ease !important;
        visibility: visible !important;
    }
    
    /* 🎯 MOSTRAR AL INICIAR COLAPSO */
    .feed-navigation.collapsing #viralVideosBtn-nav {
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: scale(1) !important;
        transition: opacity 0.3s ease, transform 0.3s ease !important;
        visibility: visible !important;
    }
`;

        document.head.appendChild(style);
        console.log('✅ CSS para botón viral en navegación expandida inyectado');
    }
    
    // Inyectar CSS
    injectViralButtonCSS();
    
    let scrollTimeout;
    const navButton = document.getElementById(CONFIG.buttonId + '-nav');
    const viralButton = document.getElementById(CONFIG.buttonId);
    
    if (!viralButton) {
        console.log('❌ Botón flotante no encontrado');
        return;
    }
    
    // Variables para predicción agresiva
    let lastScroll = 0;
    let lastTime = Date.now();
    let velocities = [];
    let isProcessing = false;
    
    function updateFloatingPosition() {
        if (window.viralButtonPosition && viralButton) {
            viralButton.style.right = window.viralButtonPosition.right + 'px';
        }
    }
    
    updateFloatingPosition();
    window.addEventListener('resize', updateFloatingPosition);
    
    function getRealScrollPosition() {
        return document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;
    }
    
function checkScrollState() {
    if (isProcessing) return;
    isProcessing = true;
    
    requestAnimationFrame(() => {
        // ✅ OBTENER REFERENCIAS FRESCAS EN CADA LLAMADA
        const navButton = document.getElementById(CONFIG.buttonId + '-nav');
        const floatingBtn = document.getElementById(CONFIG.buttonId);
        
        if (!floatingBtn) {
            isProcessing = false;
            return;
        }
        
        // ✅ DETECTAR SECCIÓN ACTUAL EN TIEMPO REAL
        const activeTab = document.querySelector('.nav-tab.active');
        const tabText = activeTab ? activeTab.textContent.trim().toLowerCase() : '';
        const isChainActive = tabText.includes('chain');
        
        const currentScroll = getRealScrollPosition();
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTime;
        const feedNav = document.querySelector('.feed-navigation');
        
        // 🎯 DETECTAR SI LA NAVEGACIÓN ESTÁ EXPANDIDA O EXPANDIÉNDOSE
        const isExpanded = feedNav && (
            feedNav.classList.contains('expanded') || 
            feedNav.classList.contains('expanding')
        );
        
        const isCollapsing = feedNav && feedNav.classList.contains('collapsing');
        
        // 🚫 SI CHAIN ESTÁ ACTIVO: BLOQUEAR NAV BUTTON Y OCULTAR FLOTANTE
        if (isChainActive) {
            if (navButton) {
                navButton.style.opacity = '0.4';
                navButton.style.pointerEvents = 'none';
                navButton.style.cursor = 'not-allowed';
                navButton.style.filter = 'grayscale(1)';
            }
            if (floatingBtn) {
                floatingBtn.style.opacity = '0';
                floatingBtn.style.pointerEvents = 'none';
                floatingBtn.style.visibility = 'hidden';
            }
            isProcessing = false;
            return;
        }
        
        // ✅ SI NO ES CHAIN, RESTAURAR ESTILOS DEL NAV BUTTON
        if (navButton && !isExpanded && currentScroll <= 100) {
            navButton.style.filter = 'grayscale(0)';
            navButton.style.cursor = 'pointer';
        }
        
        // 🚫 SI LA NAVEGACIÓN ESTÁ EXPANDIDA/EXPANDIÉNDOSE, OCULTAR FLOTANTE Y SALIR
        if (isExpanded && !isCollapsing) {
            floatingBtn.style.opacity = '0';
            floatingBtn.style.transform = 'scale(0.8)';
            floatingBtn.style.pointerEvents = 'none';
            floatingBtn.style.visibility = 'hidden';
            isProcessing = false;
            return;
        }
        
        // ✅ SI ESTÁ COLAPSANDO, MOSTRAR NAV BUTTON INMEDIATAMENTE
        if (isCollapsing && currentScroll <= 150) {
            if (navButton) {
                navButton.style.opacity = '1';
                navButton.style.transform = 'scale(1)';
                navButton.style.pointerEvents = 'auto';
                navButton.style.visibility = 'visible';
            }
        }
        
        let shouldHide = false;
        
        if (timeDiff > 0) {
            const scrollDiff = currentScroll - lastScroll;
            const currentVelocity = scrollDiff / (timeDiff / 1000);
            
            velocities.push(currentVelocity);
            if (velocities.length > 3) velocities.shift();
            const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length;
            
            if (navButton) {
                const rect = navButton.getBoundingClientRect();
                
                if (Math.abs(avgVelocity) > 300) {
                    const predictionTime = 150;
                    const predictedScroll = currentScroll + (avgVelocity * (predictionTime / 1000));
                    const predictedBotonTop = rect.top - (predictedScroll - currentScroll);
                    
                    const willBeInViewport = predictedBotonTop >= -80 && predictedBotonTop < window.innerHeight;
                    const currentlyInViewport = rect.top >= -50 && rect.top < window.innerHeight;
                    shouldHide = willBeInViewport || currentlyInViewport;
                } else {
                    shouldHide = rect.top >= -50 && rect.top < window.innerHeight;
                }
            }
            
            lastScroll = currentScroll;
            lastTime = currentTime;
        }
        
        // CONTROL BOTÓN NAVEGACIÓN (solo cuando no está expandido)
        if (navButton && !isExpanded) {
            if (currentScroll > 100) {
                navButton.style.opacity = '0';
                navButton.style.pointerEvents = 'none';
                navButton.style.transform = 'scale(0.8)';
            } else {
                navButton.style.opacity = '1';
                navButton.style.pointerEvents = 'auto';
                navButton.style.transform = 'scale(1)';
            }
        }
        
        // 🎯 CONDICIÓN FINAL PARA BOTÓN FLOTANTE
        const shouldShowFloating = currentScroll > 150 && !shouldHide;
        
        if (shouldShowFloating) {
            floatingBtn.style.opacity = '1';
            floatingBtn.style.transform = 'scale(1)';
            floatingBtn.style.pointerEvents = 'auto';
            floatingBtn.style.visibility = 'visible';
        } else {
            floatingBtn.style.opacity = '0';
            floatingBtn.style.transform = 'scale(0.8)';
            floatingBtn.style.pointerEvents = 'none';
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (shouldShowFloating && floatingBtn) {
                floatingBtn.style.boxShadow = '0 6px 20px rgba(128, 24, 231, 0.5)';
            }
        }, 150);
        
        isProcessing = false;
    });
}
    
    // Listener optimizado con requestAnimationFrame
    window.addEventListener('scroll', checkScrollState, { passive: true });
    
    // Verificación periódica
    const scrollCheckInterval = setInterval(checkScrollState, 100);
    
    window.addEventListener('beforeunload', () => {
        clearInterval(scrollCheckInterval);
    });
    
    console.log('✅ Scroll observer configurado (predicción agresiva + CSS fix)');
}

function setupNavigationObserver() {
    const navTabs = document.querySelectorAll('.nav-tab:not(#viralVideosBtn)');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            setTimeout(() => {
                detectCurrentSection(); // ✅ Esto llamará a updateButtonState()
                const feedNav = document.querySelector('.feed-navigation');
                if (feedNav && !feedNav.classList.contains('expanded')) {
                    // updateButtonState() ya maneja si mostrar u ocultar
                    console.log('✅ Estado del botón actualizado después de cambiar tab');
                }
            }, 100);
        });
    });
}
    
    /**
     * Observar cuando .feed-navigation se expande/colapsa
     */
    function setupExpandCollapseObserver() {
        const feedNav = document.querySelector('.feed-navigation');
        if (!feedNav) return;
        
        navigationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isExpanded = feedNav.classList.contains('expanded') || 
                                      feedNav.classList.contains('expanding');
                    
                    if (isExpanded) {
                        hideButton();
                        console.log('🔒 Botón oculto - navegación expandida');
                    } else {
                        const activeTab = document.querySelector('.nav-tab.active');
                        if (activeTab) {
                            console.log('👁️ Botón visible - navegación colapsada');
                        }
                    }
                }
            });
        });
        
        navigationObserver.observe(feedNav, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('✅ Observer de expansión configurado');
    }
    
function detectCurrentSection() {
    const activeTab = document.querySelector('.nav-tab.active');
    if (!activeTab) return null;
    
    const text = activeTab.textContent.trim().toLowerCase();
    
    if (text.includes('virales')) {
        currentSection = 'virales';
    } else if (text.includes('posts')) {
        currentSection = 'posts';
    } else if (text.includes('chain')) {
        currentSection = 'chain';
    } else if (text.includes('market')) {
        currentSection = 'market';
    }
    
    console.log('📍 Sección actual:', currentSection);
    
    // ✅ DESHABILITAR/HABILITAR BOTONES SEGÚN SECCIÓN
    updateButtonState();
    
    return currentSection;
}

function updateButtonState() {
    const navButton = document.getElementById(CONFIG.buttonId + '-nav');
    const floatingButton = document.getElementById(CONFIG.buttonId);
    
    const isChainActive = currentSection === 'chain';
    
    // Aplicar estilos de deshabilitado
    const disabledStyle = `
        opacity: 0.4 !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
        filter: grayscale(1) !important;
    `;
    
    const enabledStyle = `
        opacity: 1 !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        filter: grayscale(0) !important;
    `;
    
    if (isChainActive) {
        // DESHABILITAR ambos botones
        if (navButton) {
            navButton.style.cssText = navButton.style.cssText + disabledStyle;
            navButton.setAttribute('disabled', 'true');
            navButton.title = 'No disponible en Chain';
            console.log('🔒 Botón viral DESHABILITADO (Chain activo)');
        }
        
        if (floatingButton) {
            floatingButton.style.cssText = floatingButton.style.cssText + disabledStyle;
            floatingButton.setAttribute('disabled', 'true');
            floatingButton.title = 'No disponible en Chain';
        }
    } else {
        // HABILITAR ambos botones
        if (navButton) {
            navButton.style.cssText = navButton.style.cssText.replace(disabledStyle, '') + enabledStyle;
            navButton.removeAttribute('disabled');
            navButton.title = 'Ver contenido multimedia';
            console.log('✅ Botón viral HABILITADO');
        }
        
        if (floatingButton) {
            floatingButton.style.cssText = floatingButton.style.cssText.replace(disabledStyle, '') + enabledStyle;
            floatingButton.removeAttribute('disabled');
            floatingButton.title = 'Ver contenido multimedia';
        }
    }
}
    
/**
 * Mostrar botón (ya no se usa, controlado por scroll)
 */
function showButton() {
    // Controlado por setupScrollObserver
}

/**
 * Ocultar botón
 */
function hideButton() {
    if (!viralButton) return;
    
    viralButton.style.opacity = '0';
    viralButton.style.transform = 'scale(0.8)';
    viralButton.style.pointerEvents = 'none';
}
    
 /**
 * Manejar clic en el botón
 */
async function handleButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // ✅ BLOQUEAR SI CHAIN ESTÁ ACTIVO
    if (currentSection === 'chain') {
        console.log('🚫 Botón bloqueado - Chain activo');
        if (typeof showNotification === 'function') {
            showNotification('📍 Contenido multimedia no disponible en Chain', 'info');
        }
        return;
    }
    
    if (isProcessing) return;
    isProcessing = true;
    
    // Animación de feedback
    const button = e.currentTarget;
    const originalTransform = button.style.transform;
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = originalTransform;
    }, 150);
    
    const section = detectCurrentSection();
    
    try {
        if (section === 'chain') {
            // No debería llegar aquí, pero por seguridad
            return;
        } else {
            await openViralVideosFromDOM();
        }
    } catch (error) {
        console.error('Error abriendo videos virales:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al cargar contenido multimedia', 'error');
        }
    } finally {
        isProcessing = false;
    }
}
    
    /**
     * Abrir videos desde el DOM
     */
    async function openViralVideosFromDOM() {
        const allPosts = Array.from(document.querySelectorAll('.post-card, .market-post, .content-card'));
        
        console.log(`🔍 Total de posts encontrados: ${allPosts.length}`);
        
        const postsWithMedia = [];
        const postsWithoutMedia = [];
        
        allPosts.forEach(post => {
            const hasMedia = checkPostHasMedia(post);
            
            if (hasMedia) {
                postsWithMedia.push(post);
            } else {
                postsWithoutMedia.push(post);
            }
        });
        
        console.log(`⚡ Posts con media: ${postsWithMedia.length}`);
        console.log(`📝 Posts sin media: ${postsWithoutMedia.length}`);
        
        if (postsWithMedia.length === 0) {
            if (typeof showNotification === 'function') {
                showNotification('📭 No hay posts con videos o imágenes en esta sección', 'info');
            }
            return;
        }
        
        removePostsFromDOM(postsWithoutMedia);
        
        if (!window.fullscreenViewer) {
            console.error('Fullscreen viewer no disponible');
            restoreRemovedPosts();
            if (typeof showNotification === 'function') {
                showNotification('❌ Visor de pantalla completa no disponible', 'error');
            }
            return;
        }
        
        window.fullscreenViewer.openViewer(postsWithMedia[0]);
        setupViewerCloseListener();
        
        if (typeof showNotification === 'function') {
            showNotification(`⚡ ${postsWithMedia.length} posts multimedia encontrados`, 'success');
        }
    }
    
    /**
     * Verificar si un post tiene media válida
     */
    function checkPostHasMedia(post) {
        const mediaContainer = post.querySelector('.post-media, .card-media, .video-container-custom');
        
        if (!mediaContainer) {
            return false;
        }
        
        const video = mediaContainer.querySelector('video');
        if (video) {
            const hasSrc = video.src && video.src.trim() !== '';
            if (hasSrc) {
                return true;
            }
        }
        
        const images = mediaContainer.querySelectorAll('img');
        for (let img of images) {
            const isAvatar = img.closest('.post-avatar') || 
                            img.closest('.card-avatar') ||
                            img.closest('[class*="avatar"]') ||
                            (img.hasAttribute('onerror') && img.getAttribute('onerror').includes('textContent')) ||
                            (img.alt && img.alt.toLowerCase().includes('avatar'));
            
            const hasSrc = img.src && img.src.trim() !== '' && 
                          !img.src.includes('data:image') && 
                          !img.src.includes('placeholder');
            
            if (!isAvatar && hasSrc) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Remover posts del DOM
     */
    function removePostsFromDOM(posts) {
        removedPosts = [];
        
        posts.forEach(post => {
            const parent = post.parentNode;
            const nextSibling = post.nextSibling;
            
            removedPosts.push({
                element: post,
                parent: parent,
                nextSibling: nextSibling
            });
            
            post.remove();
        });
        
        console.log(`🗑️ ${removedPosts.length} posts sin media REMOVIDOS del DOM`);
    }
    

/**
 * Restaurar posts removidos
 */
function restoreRemovedPosts() {
    if (removedPosts.length === 0) {
        return;
    }
    
    removedPosts.forEach(({ element, parent, nextSibling }) => {
        try {
            if (parent && document.contains(parent)) {
                // Verificar que nextSibling todavía exista en el DOM
                if (nextSibling && parent.contains(nextSibling)) {
                    parent.insertBefore(element, nextSibling);
                } else {
                    parent.appendChild(element);
                }
            }
        } catch (error) {
            console.warn('⚠️ No se pudo restaurar un post (probablemente ya no existe):', error.message);
        }
    });
    
    console.log(`✅ ${removedPosts.length} posts procesados para restauración`);
    removedPosts = [];
}
    
    /**
     * Configurar listener para cuando se cierre el viewer
     */
    function setupViewerCloseListener() {
        setTimeout(() => {
            const viewer = document.getElementById('fullscreen-post-viewer');
            if (!viewer) {
                restoreRemovedPosts();
                return;
            }
            
            const viewerObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (!viewer.classList.contains('active')) {
                            restoreRemovedPosts();
                            viewerObserver.disconnect();
                        }
                    }
                });
            });
            
            viewerObserver.observe(viewer, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            const escListener = (e) => {
                if (e.key === 'Escape') {
                    setTimeout(() => {
                        if (!viewer.classList.contains('active')) {
                            restoreRemovedPosts();
                            document.removeEventListener('keydown', escListener);
                        }
                    }, 100);
                }
            };
            
            document.addEventListener('keydown', escListener);
            
        }, 100);
    }
    
    /**
     * Abrir videos virales desde API
     */
    async function openViralVideosFromAPI() {
        try {
            if (typeof showNotification === 'function') {
                showNotification('🔄 Cargando posts virales multimedia...', 'info');
            }
            
            const response = await fetch('../php/obtener_feed_virales.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    limit: 50,
                    offset: 0,
                    tipo: null
                })
            });
            
            const data = await response.json();
            
            if (!data.success || !data.publicaciones) {
                throw new Error('No se pudieron cargar posts virales');
            }
            
            const postsWithMedia = data.publicaciones.filter(post => {
                return post.media_url && post.media_url.trim() !== '' &&
                       (post.tipo === 'video' || post.tipo === 'imagen');
            });
            
            if (postsWithMedia.length === 0) {
                if (typeof showNotification === 'function') {
                    showNotification('📭 No hay posts virales con videos o imágenes', 'info');
                }
                return;
            }
            
            const feedContainer = document.getElementById('feedPosts');
            if (!feedContainer) {
                throw new Error('Contenedor de feed no encontrado');
            }
            
            const existingPosts = Array.from(feedContainer.querySelectorAll('.post-card, .market-post, .content-card'));
            removePostsFromDOM(existingPosts);
            
            const tempPosts = postsWithMedia.map(post => createTempPostElement(post));
            tempPosts.forEach(post => feedContainer.appendChild(post));
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (window.fullscreenViewer && tempPosts.length > 0) {
                window.fullscreenViewer.openViewer(tempPosts[0]);
                setupViewerCloseListener();
                
                if (typeof showNotification === 'function') {
                    showNotification(`⚡ ${postsWithMedia.length} posts virales multimedia cargados`, 'success');
                }
            }
            
        } catch (error) {
            console.error('Error cargando posts virales:', error);
            restoreRemovedPosts();
            if (typeof showNotification === 'function') {
                showNotification('❌ Error al cargar posts virales: ' + error.message, 'error');
            }
        }
    }
    
    /**
     * Crear elemento de post temporal
     */
    function createTempPostElement(post) {
        const div = document.createElement('div');
        div.className = 'post-card viral-post';
        div.dataset.postId = `post-${post.id}`;
        div.dataset.viralTemp = 'true';
        div.style.display = 'none';
        
        const avatarInitials = post.username ? post.username.substring(0, 2).toUpperCase() : 'U';
        const timeAgo = formatTimeAgo(new Date(post.created_at));
        
        div.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">${avatarInitials}</div>
                <div class="post-author-info">
                    <div class="post-author">
                        ${escapeHtml(post.display_name || post.username)}
                        ${post.verified ? '<span class="verified-badge">✓</span>' : ''}
                    </div>
                    <div class="post-meta">@${escapeHtml(post.username)} • ${timeAgo}</div>
                </div>
            </div>
            <div class="post-content">${escapeHtml(post.contenido || '')}</div>
            <div class="post-media">
                ${post.tipo === 'video' ? `
                    <video src="${post.media_url}" ${post.silenciado ? 'data-silenciado="true"' : ''}></video>
                ` : `
                    <img src="${post.media_url}" alt="Media">
                `}
            </div>
            <div class="post-stats">
                <button class="post-stat ${post.user_interactions?.liked ? 'liked' : ''}" onclick="toggleRealPostLike(this, ${post.id})">
                    ${post.user_interactions?.liked ? '❤️' : '🤍'} ${post.stats?.likes_count || 0}
                </button>
                <button class="post-stat" onclick="openComments(this)" data-comments-count="${post.stats?.comentarios_count || 0}">
                    💬 ${post.stats?.comentarios_count || 0}
                </button>
                <button class="post-stat ${post.user_interactions?.reposted ? 'reposted' : ''}" onclick="toggleRealRepost(this, ${post.id})" data-repost-count="${post.stats?.reposts_count || 0}">
                    🔄 ${post.stats?.reposts_count || 0}
                </button>
            </div>
        `;
        
        return div;
    }
    
    /**
     * Efectos hover
     */
    function handleMouseEnter() {
        viralButton.style.transform = 'scale(1.05) translateY(-2px)';
        viralButton.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.5)';
    }
    
    function handleMouseLeave() {
        viralButton.style.transform = 'scale(1)';
        viralButton.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.3)';
    }
    
    /**
     * Utilidades
     */
    function formatTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'ahora';
        if (minutes < 60) return `hace ${minutes}m`;
        if (hours < 24) return `hace ${hours}h`;
        if (days < 7) return `hace ${days}d`;
        return date.toLocaleDateString();
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Estilos CSS adicionales
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Botón viral independiente */
            .${CONFIG.buttonClass} {
                position: relative;
                overflow: hidden;
            }
            
            .${CONFIG.buttonClass}::before {
                content: "";
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.6s ease;
            }
            
            .${CONFIG.buttonClass}:hover::before {
                left: 100%;
            }
            
            .${CONFIG.buttonClass}:active {
                transform: scale(0.95) !important;
            }
            
/* Responsive */
@media (max-width: 768px) {
    .${CONFIG.buttonClass},
    .${CONFIG.buttonClass}-floating {
        padding: 8px !important;
        right: 15px !important;
        top: 15px !important;
    }
    
}
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Inicialización
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            init();
        });
    } else {
        injectStyles();
        init();
    }
    
    window.ViralVideosSystem = {
        show: showButton,
        hide: hideButton,
        restore: restoreRemovedPosts,
        isActive: () => currentSection !== null
    };
    
    console.log('⚡ Sistema de Viral Videos Button (Independiente) cargado');
    
})();