/**
 * SIMPLE POST VIEWER - Visualización fullscreen para posts individuales
 * Usa los estilos exactos del FullscreenPostViewer pero simplificado para un solo post
 * Al hacer click en post compartido se abre fullscreen limpio
 * Al tocar pantalla aparecen controles e información
 */

class SimplePostViewer {
constructor() {
    this.isActive = false;
    this.currentPost = null;
    this.viewerContainer = null;
    this.hideButtonTimeout = null;
    this.globalMuted = false;
    this.controlsVisible = false;
    this.currentStats = null;
    this.commentsObserver = null;  // AGREGAR ESTA LÍNEA

    this.init();
}

    init() {
    this.createViewerHTML();
    this.attachEventListeners();
    this.overrideGlobalFunction();
    this.setupCommentsObserver();  // AGREGAR ESTA LÍNEA
}

    overrideGlobalFunction() {
        // Reemplazar la función global existente
        window.openSharedPostFullscreen = (postData) => {
            this.openViewer(postData);
        };
    }

    createViewerHTML() {
        const viewer = document.createElement('div');
        viewer.id = 'simple-post-viewer';
        viewer.className = 'fsv-container'; // Usar mismas clases
        viewer.innerHTML = `
            <style>
                ${this.getViewerStyles()}
            </style>

            <div class="fsv-wrapper">
                <div class="fsv-posts-container">
                    <!-- El post se cargará dinámicamente aquí -->
                </div>
                
                <!-- Navegación lateral (oculta para posts individuales) -->
                <div class="fsv-navigation" style="display: none;">
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
                <button class="fsv-sound-btn" aria-label="Controlar sonido">
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
                        <div class="fsv-loading-stats">

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
                                <button class="fsv-action-btn fsv-buy-btn" data-action="buy" style="display: none;">
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

    getViewerStyles() {
        return `

.fsv-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    z-index: 999999;
    opacity: 0;
    visibility: hidden;
    display: none; /* 👈 AGREGAR ESTA LÍNEA */
    transition: opacity 0.3s ease, visibility 0.3s ease;
    overscroll-behavior: none;
    touch-action: pan-y;
    pointer-events: none;
}

.fsv-container.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}

            /* Wrapper interno */
            .fsv-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            /* Contenedor de posts */
            .fsv-posts-container {
                position: relative;
                width: 100%;
                height: 100%;
                transition: transform 0.3s ease-out;
            }

            /* Post individual - Solo contenido multimedia */
            .fsv-post {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #000;
                z-index: 1;
                /* FORZAR VISIBILIDAD */
                opacity: 1 !important;
                visibility: visible !important;
            }

            .fsv-post[data-position="0"] {
                z-index: 2;
            }

            /* Contenedor de media únicamente */
            .fsv-media-only {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                /* FORZAR VISIBILIDAD */
                opacity: 1 !important;
                visibility: visible !important;
            }

            /* Videos a pantalla completa */
            .fsv-video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                cursor: pointer;
                opacity: 1 !important;
                visibility: visible !important;
                animation: none !important;
                display: block !important;
            }

            /* Imágenes a pantalla completa */
            .fsv-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 1 !important;
                visibility: visible !important;
                animation: none !important;
                display: block !important;
            }

            /* Contenido de texto para posts sin media */
            .fsv-text-content {
                padding: 20px;
                color: white;
                font-size: 1.2em;
                line-height: 1.6;
                text-align: center;
                max-width: 600px;
                /* FORZAR VISIBILIDAD SIEMPRE */
                opacity: 1 !important;
                visibility: visible !important;
                animation: none !important;
                display: block !important;
            }

            /* Contenido especial para posts de venta */
            .fsv-sale-content {
                padding: 40px;
                color: white;
                text-align: center;
                max-width: 500px;
                background: rgba(26, 26, 36, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
                /* FORZAR VISIBILIDAD SIEMPRE */
                opacity: 1 !important;
                visibility: visible !important;
                animation: none !important;
            }

            .fsv-sale-price {
                font-size: 2.5rem;
                font-weight: 800;
                color: #10b981;
                text-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
            }

            .fsv-sale-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #ffffff;
            }

            .fsv-sale-description {
                font-size: 1.1rem;
                line-height: 1.6;
                color: #e5e5e5;
                word-wrap: break-word;
            }

            .fsv-sale-image {
                max-width: 100%;
                max-height: 300px;
                border-radius: 12px;
                object-fit: cover;
            }

            /* Asegurar que todos los elementos dentro del post sean visibles */
            .fsv-post * {
                opacity: 1 !important;
                visibility: visible !important;
            }

            /* Navegación lateral (desktop) */
            .fsv-navigation {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                gap: 20px;
                z-index: 10;
            }

            .fsv-nav-btn {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .fsv-nav-btn:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            .fsv-nav-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            /* Botón de salir (flecha hacia atrás) */
            .fsv-close-btn {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.2);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 11;
                
                /* Oculto por defecto */
                opacity: 0;
                visibility: hidden;
                transform: translateX(-10px);
                transition: all 0.3s ease;
                /* Asegurar clickeabilidad */
pointer-events: auto !important;
cursor: pointer !important;
            }

            .fsv-close-btn.visible {
                opacity: 1;
                visibility: visible;
                transform: translateX(0);
                pointer-events: auto !important;
            }

            .fsv-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            /* Botón de control de sonido */
            .fsv-sound-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1003;
                width: 48px;
                height: 48px;
                background: rgba(0, 0, 0, 0.6);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-20px);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
            }

            .fsv-sound-btn.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .fsv-sound-btn:hover {
                background: rgba(0, 0, 0, 0.8);
                transform: scale(1.1);
            }

            .fsv-sound-btn:active {
                transform: scale(0.95);
            }

            .fsv-sound-btn svg {
                width: 24px;
                height: 24px;
                transition: all 0.2s ease;
            }

            .fsv-sound-btn .fsv-sound-off {
                display: none;
            }

            .fsv-sound-btn.muted .fsv-sound-on {
                display: none;
            }

            .fsv-sound-btn.muted .fsv-sound-off {
                display: block;
            }

            .fsv-sound-btn.muted {
                background: rgba(220, 38, 38, 0.6);
            }

            .fsv-sound-btn.muted:hover {
                background: rgba(220, 38, 38, 0.8);
            }

            /* BARRA INFERIOR DESLIZANTE */
            .fsv-bottom-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7));
                backdrop-filter: blur(20px);
                color: white;
                z-index: 10;
                transform: translateY(100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-height: 50vh;
                overflow-y: auto;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
            }

            .fsv-bottom-bar.visible {
                transform: translateY(0);
            }

            /* Manija para arrastrar */
            .fsv-bar-handle {
                width: 40px;
                height: 4px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 2px;
                margin: 10px auto;
                cursor: grab;
            }

            .fsv-bar-handle:active {
                cursor: grabbing;
            }

            /* Contenido de la barra */
            .fsv-bar-content {
                padding: 0 20px 20px;
            }

            /* Información del usuario */
            .fsv-user-info {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .fsv-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                overflow: hidden;
                flex-shrink: 0;
            }

            .fsv-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .fsv-user-details {
                flex: 1;
            }

            .fsv-username {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 4px;
            }

            .fsv-user-meta {
                font-size: 12px;
                opacity: 0.7;
            }

            /* Contenido del post */
            .fsv-post-content {
                margin-bottom: 15px;
                font-size: 14px;
                line-height: 1.5;
                max-height: 100px;
                overflow-y: auto;
                color: rgba(255, 255, 255, 0.9);
            }

            .fsv-post-content:empty {
                display: none;
            }

            /* Hashtags y menciones en la barra */
            .fsv-post-content .hashtag,
            .fsv-post-content .mention {
                color: #6bb6ff !important;
                background: rgba(107, 182, 255, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                text-decoration: none;
            }

            /* Botones de acción */
            .fsv-post-actions {
                display: flex;
                justify-content: space-around;
                gap: 10px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .fsv-action-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: white;
                padding: 10px 15px;
                border-radius: 25px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                transition: all 0.2s ease;
                flex: 1;
                justify-content: center;
                max-width: 120px;
            }

            .fsv-action-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: scale(1.05);
            }

            .fsv-action-btn:active {
                transform: scale(0.95);
            }

            .fsv-action-btn.liked .fsv-like-icon {
                animation: likeHeart 0.4s ease;
            }

            .fsv-action-btn.reposted {
                color: #4ade80;
                border-color: #4ade80;
            }

            @keyframes likeHeart {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.2); }
                50% { transform: scale(0.95); }
            }

            /* SVG icons en botones */
            .fsv-action-btn svg {
                width: 16px;
                height: 16px;
                fill: currentColor;
            }

            /* Scrollbar personalizado para la barra */
            .fsv-bottom-bar::-webkit-scrollbar {
                width: 4px;
            }

            .fsv-bottom-bar::-webkit-scrollbar-track {
                background: transparent;
            }

            .fsv-bottom-bar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 2px;
            }

            /* Responsivo para móviles */
            @media (max-width: 768px) {
                /* Ocultar navegación lateral en móvil */
                .fsv-navigation {
                    display: none;
                }
                
                .fsv-close-btn {
                    top: 10px;
                    width: 35px;
                    height: 35px;
                }
                
                .fsv-sound-btn {
                    top: 15px;
                    right: 15px;
                    width: 44px;
                    height: 44px;
                }
                
                .fsv-sound-btn svg {
                    width: 20px;
                    height: 20px;
                }
                
                .fsv-bottom-bar {
                    border-radius: 20px 20px 0 0;
                }
                
                .fsv-bar-content {
                    padding: 0 15px 15px;
                }
                
                .fsv-post-actions {
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    gap: 5px;
                    padding: 10px 0;
                }
                
                .fsv-action-btn {
                    padding: 8px 12px;
                    font-size: 12px;
                    min-width: fit-content;
                    flex: 0 0 auto;
                }
                
            }

            /* Animaciones de entrada */
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            /* Estados de carga para videos */
            .fsv-video:not([src=""]) {
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="none" stroke="white" stroke-width="2" opacity="0.3"/><circle cx="20" cy="20" r="18" fill="none" stroke="white" stroke-width="2" stroke-dasharray="90" stroke-dashoffset="20" opacity="0.8"><animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite"/></circle></svg>') center no-repeat;
                background-size: 40px;
            }

            /* Prevenir scroll del body cuando el viewer está activo */
            body.fsv-active {
                overflow: hidden !important;
                position: fixed !important;
                width: 100% !important;
            }

            /* Mejoras de accesibilidad */
            .fsv-nav-btn:focus,
            .fsv-close-btn:focus,
            .fsv-action-btn:focus {
                outline: 2px solid #6bb6ff;
                outline-offset: 2px;
            }

            /* Smooth scrolling */
            .fsv-container * {
                scroll-behavior: smooth;
            }

            /* Para posts sin media o con media pequeña */
            @media (min-width: 768px) {
                .fsv-text-content,
                .fsv-image {
                    background: rgba(0, 0, 0, 0.8);
                    padding: 40px;
                    border-radius: 20px;
                }
            }
               #simple-post-viewer.fsv-container {
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
        }

        /* Videos e imágenes del viewer */
        #simple-post-viewer .fsv-video,
        #simple-post-viewer .fsv-image {
            -webkit-tap-highlight-color: transparent;
            outline: none;
            -webkit-user-select: none;
            user-select: none;
        }

        /* Área clickeable del post */
        #simple-post-viewer .fsv-post,
        #simple-post-viewer .fsv-media-only,
        #simple-post-viewer .fsv-wrapper {
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
        }

        /* Botones específicos del viewer */
        #simple-post-viewer .fsv-close-btn,
        #simple-post-viewer .fsv-sound-btn,
        #simple-post-viewer .fsv-nav-btn {
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }

        /* Botones de acción de la barra inferior */
        #simple-post-viewer .fsv-action-btn {
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }

        /* Solo eliminar focus outline en elementos del viewer */
        #simple-post-viewer .fsv-action-btn:focus {
            outline: 2px solid rgba(255, 255, 255, 0.3);
            outline-offset: 2px;
        }

        /* Optimizaciones solo para el viewer */
        #simple-post-viewer .fsv-wrapper,
        #simple-post-viewer .fsv-posts-container {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
/* ============================================
   ESTILOS PARA BOTÓN DE COMPRA
   ============================================ */

/* Botón de compra en viewer */
.fsv-buy-btn {
    background: linear-gradient(135deg, #f59e0b, #d97706) !important;
    color: white !important;
    font-weight: 700 !important;
    border: 2px solid rgba(245, 158, 11, 0.3) !important;
    animation: pulse-buy 2s infinite;
    transition: all 0.3s ease !important;
}

.fsv-buy-btn:hover {
    background: linear-gradient(135deg, #d97706, #b45309) !important;
    transform: scale(1.1) !important;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.6) !important;
}

.fsv-buy-btn:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
    animation: none !important;
    background: linear-gradient(135deg, #9ca3af, #6b7280) !important;
}

.fsv-buy-price {
    font-weight: 700 !important;
    font-size: 0.95rem !important;
}

@keyframes pulse-buy {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
    }
    50% {
        box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
    }
}

/* Asegurar que el botón de compra no se agrande demasiado */
.fsv-buy-btn {
    min-width: 100px;
    max-width: 140px;
}

/* Móviles: ajustar tamaño del botón de compra */
@media (max-width: 768px) {
    .fsv-buy-btn {
        min-width: 90px;
        max-width: 120px;
        padding: 8px 10px !important;
    }
    
    .fsv-buy-price {
        font-size: 0.85rem !important;
    }
}
        `;
    }

async openViewer(postData) {
    this.currentPost = postData;
    this.isActive = true;
    this.controlsVisible = false;
    this.currentStats = null;
    
    this.viewerContainer.style.display = 'block';
    this.viewerContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('fsv-active');
    
    this.renderPost();
    this.showLoadingState(); // AGREGAR ESTA LÍNEA
    
    // AGREGAR ESTA LÍNEA:
    await this.loadPostStats();
    
    this.updateBuyButton();

    setTimeout(() => {
        this.playVideoIfPresent();
        this.updateSoundButtonVisibility();
    }, 100);
 } 

    renderPost() {
        const container = this.viewerContainer.querySelector('.fsv-posts-container');
        container.innerHTML = '';
        
        const postElement = this.createPostElement(this.currentPost);
        postElement.classList.add('fsv-post');
        postElement.dataset.position = "0";
        postElement.style.transform = 'translateY(0)';
        
        container.appendChild(postElement);
    }

    createPostElement(postData) {
        const postDiv = document.createElement('div');
        postDiv.className = 'fsv-media-only';
        
        switch (postData.tipo) {
            case 'video':
                const video = document.createElement('video');
                video.src = postData.media_url;
                video.className = 'fsv-video';
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('loop', '');
                
                // VERIFICACIÓN CORRECTA: Buscar en el post original data-silenciado
                const isForcedSilent = this.checkIfVideoIsSilenced(postData);
                
                console.log('Post data para video:', postData);
                console.log('¿Video forzadamente silenciado?', isForcedSilent);
                
                if (isForcedSilent) {
                    // Videos con data-silenciado="true" SIEMPRE silenciados
                    video.muted = true;
                    video.setAttribute('data-forced-silent', 'true');
                    video.setAttribute('data-silenciado', 'true'); // Mantener atributo original
                    
                    // NO permitir desmutear NUNCA
                    video.addEventListener('volumechange', (e) => {
                        if (!video.muted) {
                            video.muted = true;
                        }
                    });
                    
                    console.log('Video configurado como forzadamente silenciado');
                } else {
                    // Videos normales siguen el estado global
                    video.muted = this.globalMuted;
                    video.setAttribute('data-forced-silent', 'false');
                    video.setAttribute('data-silenciado', 'false');
                    
                    console.log('Video configurado como normal (control de sonido disponible)');
                }
                
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
                
                postDiv.appendChild(video);
                break;
                
            case 'imagen':
                const img = document.createElement('img');
                img.src = postData.media_url;
                img.className = 'fsv-image';
                img.alt = 'Imagen del post';
                postDiv.appendChild(img);
                break;
                
            case 'venta':
                const saleContainer = document.createElement('div');
                saleContainer.className = 'fsv-sale-content';
                
                let saleHTML = '';
                
                // Imagen del producto (si existe)
                if (postData.media_url) {
                    saleHTML += `<img src="${postData.media_url}" alt="Producto en venta" class="fsv-sale-image">`;
                }
                
                // Precio
                saleHTML += `<div class="fsv-sale-price">💰 $${postData.precio || 'N/A'}</div>`;
                
                // Título y descripción
                if (postData.contenido) {
                    saleHTML += `<div class="fsv-sale-title">En Venta</div>`;
                    saleHTML += `<div class="fsv-sale-description">${this.escapeHtml(postData.contenido)}</div>`;
                }
                
                saleContainer.innerHTML = saleHTML;
                postDiv.appendChild(saleContainer);
                break;
                
            default:
                // Post de texto
                const textContainer = document.createElement('div');
                textContainer.className = 'fsv-text-content';
                textContainer.innerHTML = `
                    <p style="font-size: 1.6rem; line-height: 1.6; color: white;">${this.escapeHtml(postData.contenido || 'Publicación compartida')}</p>
                `;
                postDiv.appendChild(textContainer);
                break;
        }
        
        return postDiv;
    }

 updatePostInfo() {
    if (!this.currentStats) {
        this.updatePostInfoFallback();
        return;
    }

    const stats = this.currentStats; // CAMBIO: usar currentStats en lugar de currentPost
    
    // Avatar del autor
    const avatarContainer = this.viewerContainer.querySelector('.fsv-avatar');
    if (stats.autor.avatar_url) { // CAMBIO: stats en lugar de post
        avatarContainer.innerHTML = `<img src="${stats.autor.avatar_url}" alt="Avatar del autor">`;
    } else {
        avatarContainer.style.background = 'linear-gradient(135deg, #6366f1, #ec4899)';
        avatarContainer.style.display = 'flex';
        avatarContainer.style.alignItems = 'center';
        avatarContainer.style.justifyContent = 'center';
        avatarContainer.style.color = 'white';
        avatarContainer.style.fontWeight = '600';
        avatarContainer.textContent = this.generateInitials(
            stats.autor.display_name || stats.autor.username // CAMBIO: stats
        );
    }
    
    // Nombre de usuario
    const usernameContainer = this.viewerContainer.querySelector('.fsv-username');
    usernameContainer.innerHTML = `
        ${stats.autor.display_name || stats.autor.username} 
        ${stats.autor.verified ? '<span style="color: #6366f1;">✓</span>' : ''}
    `;
    
    // Meta información
    const metaContainer = this.viewerContainer.querySelector('.fsv-user-meta');
    metaContainer.textContent = `@${stats.autor.username} • ${new Date(stats.fecha).toLocaleDateString()}`; // CAMBIO: stats
    
    // Contenido del post
    const contentContainer = this.viewerContainer.querySelector('.fsv-post-content');
    let contentHTML = '';
    
    if (stats.contenido && stats.tipo !== 'venta') { // CAMBIO: stats
        contentHTML += `${this.escapeHtml(stats.contenido)}`; // CAMBIO: stats
    }
    
    if (stats.tipo === 'venta' && stats.precio) { // CAMBIO: stats
        contentHTML += `<div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 0.8rem 1.2rem; border-radius: 12px; font-size: 1.1rem; font-weight: 700; text-align: center; margin: 0.5rem 0;">💰 En venta por $${stats.precio}</div>`; // CAMBIO: stats
    }
    
    contentContainer.innerHTML = contentHTML;
    
    this.updatePostStatsUI(stats);

    this.updateBuyButton();
 }

 updatePostStatsUI(stats) {
    // Actualizar contadores
    this.viewerContainer.querySelector('.fsv-like-count').textContent = stats.stats.likes_count;
    this.viewerContainer.querySelector('.fsv-comment-count').textContent = stats.stats.comentarios_count;
    this.viewerContainer.querySelector('.fsv-repost-count').textContent = stats.stats.reposts_count;
        this.viewerContainer.querySelector('.fsv-share-count').textContent = stats.stats.shares_count || 0;

    
    // Actualizar estados de interacción
    const likeBtn = this.viewerContainer.querySelector('.fsv-like-btn');
    const repostBtn = this.viewerContainer.querySelector('.fsv-repost-btn');
    
    if (stats.user_interactions.liked) {
        likeBtn.classList.add('liked');
        likeBtn.querySelector('.fsv-like-icon').textContent = '❤️';
    } else {
        likeBtn.classList.remove('liked');
        likeBtn.querySelector('.fsv-like-icon').textContent = '🤍';
    }
    
    if (stats.user_interactions.reposted) {
        repostBtn.classList.add('reposted');
    } else {
        repostBtn.classList.remove('reposted');
    }
 }

 showLoadingState() {
    const loadingElement = this.viewerContainer.querySelector('.fsv-loading-stats');
    const userInfoElement = this.viewerContainer.querySelector('.fsv-user-info');
    const actionsElement = this.viewerContainer.querySelector('.fsv-post-actions');
    
    loadingElement.classList.remove('hidden');
    userInfoElement.style.opacity = '0.5';
    actionsElement.style.opacity = '0.5';
 }

 hideLoadingState() {
    const loadingElement = this.viewerContainer.querySelector('.fsv-loading-stats');
    const userInfoElement = this.viewerContainer.querySelector('.fsv-user-info');
    const actionsElement = this.viewerContainer.querySelector('.fsv-post-actions');
    
    loadingElement.classList.add('hidden');
    userInfoElement.style.opacity = '1';
    actionsElement.style.opacity = '1';
 }

 async loadPostStats() {
    try {
        const response = await fetch(`/php/api_chat.php?accion=obtener_estadisticas_publicacion&publicacion_id=${this.currentPost.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const data = await response.json();
        
        console.log('📊 Respuesta de estadísticas:', data);
        
        if (data.success) {
            this.currentStats = data.publicacion;
            
            // AGREGAR ESTO - preservar propiedades de venta del post original
            if (!this.currentStats.en_venta && this.currentPost.en_venta) {
                this.currentStats.en_venta = this.currentPost.en_venta;
                this.currentStats.precio_venta = this.currentPost.precio_venta;
                console.log('✅ Propiedades de venta restauradas desde currentPost');
            }
            
            this.updatePostInfo();
            this.hideLoadingState();
        } else {
            this.updatePostInfoFallback();
            this.hideLoadingState();
        }
    } catch (error) {
        this.updatePostInfoFallback();
        this.hideLoadingState();
    }
}


 async handlePostAction(action) {
    if (!this.currentStats) return;

    const btn = this.viewerContainer.querySelector(`.fsv-${action}-btn`);
    btn.classList.add('loading');

    try {
        let endpoint, payload;

        switch (action) {
            case 'like':
                const yaLikeado = this.currentStats.user_interactions.liked;
                endpoint = '/php/manejar_likes.php';
                payload = {
                    tipo: 'publicacion',
                    id: this.currentStats.id,
                    action: yaLikeado ? 'unlike' : 'like'
                };
                break;
                
            case 'repost':
                const yaReposteado = this.currentStats.user_interactions.reposted;
                endpoint = '/php/manejar_reposts.php';
                payload = {
                    publicacion_id: this.currentStats.id,
                    action: yaReposteado ? 'unrepost' : 'repost'
                };
                break;
                
            case 'comment':
                this.openCommentsModal();
                btn.classList.remove('loading');
                return;
                
            case 'share':
                this.openShareModal();
                btn.classList.remove('loading');
                return;
                
            // ⭐ NUEVO: Caso de compra
            case 'buy':
                await this.handleBuyPost();
                btn.classList.remove('loading');
                return;
        }

        console.log(`🟡 Enviando ${action} a ${endpoint} con payload:`, payload);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log(`🟡 Respuesta de ${action}:`, data);

        if (data.success) {
            if (action === 'like') {
                this.currentStats.stats.likes_count = data.new_like_count;
                this.currentStats.user_interactions.liked = data.liked;
                console.log(`✅ Like actualizado: ${data.liked}, Conteo: ${data.new_like_count}`);
            } else if (action === 'repost') {
                this.currentStats.stats.reposts_count = data.new_repost_count;
                this.currentStats.user_interactions.reposted = data.reposted;
                console.log(`✅ Repost actualizado: ${data.reposted}, Conteo: ${data.new_repost_count}`);
            }
            
            this.updatePostStatsUI(this.currentStats);
        } else {
            console.log('❌ Error del servidor:', data.message || 'Sin mensaje de error');
        }
    } catch (error) {
        console.error(`❌ Error en ${action}:`, error);
    } finally {
        btn.classList.remove('loading');
        this.restartHideTimer();
    }
}

async handleBuyPost() {
    try {
        const postData = this.currentStats || this.currentPost;
        const postId = postData.id;
        const precio = postData.precio_venta || postData.precio || 0;
        
        if (!postId || !precio) {
            console.error('No se pudo obtener el ID o precio del post');
            if (typeof showNotification === 'function') {
                showNotification('❌ Error al identificar el post', 'error');
            }
            return;
        }
        
        // Obtener username del vendedor
        const vendedor = postData.autor?.username || 
                        postData.username || 
                        'este usuario';
        
        // Confirmar compra
        const confirmacion = confirm(
            `¿Comprar este post por ${precio} CFT?\n\n` +
            `Vendedor: @${vendedor}`
        );
        
        if (!confirmacion) return;
        
        // Mostrar estado de carga
        const buyBtn = this.viewerContainer.querySelector('.fsv-buy-btn');
        if (buyBtn) {
            buyBtn.disabled = true;
            const priceSpan = buyBtn.querySelector('.fsv-buy-price');
            if (priceSpan) {
                priceSpan.textContent = 'Comprando...';
            }
        }
        
        // Intentar usar la función global buyPost si existe
        if (window.buyPost && typeof window.buyPost === 'function') {
            await window.buyPost(postId);
            
            // Cerrar viewer después de compra exitosa
            setTimeout(() => {
                this.closeViewer();
            }, 1500);
            
        } else {
            // Fallback: hacer la compra directamente via API
            const response = await fetch('/php/comprar_publicacion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    publicacion_id: postId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (typeof showNotification === 'function') {
                    showNotification(`🎉 Post comprado por ${precio} CFT`, 'success');
                }
                
                // Cerrar viewer y recargar si es necesario
                setTimeout(() => {
                    this.closeViewer();
                }, 1500);
            } else {
                throw new Error(data.message || 'Error al comprar post');
            }
        }
        
    } catch (error) {
        console.error('Error en compra:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error: ' + error.message, 'error');
        }
        
        // Restaurar botón
        const buyBtn = this.viewerContainer.querySelector('.fsv-buy-btn');
        if (buyBtn) {
            buyBtn.disabled = false;
            const precio = buyBtn.dataset.precio;
            const priceSpan = buyBtn.querySelector('.fsv-buy-price');
            if (priceSpan && precio) {
                priceSpan.textContent = `${precio} CFT`;
            }
        }
    }
}

openCommentsModal() {
        console.log('Abriendo comentarios para post:', this.currentStats?.id || this.currentPost?.id);
        
        const postId = this.currentStats?.id || this.currentPost?.id;
        
        if (!postId) {
            console.error('No se pudo obtener el ID del post');
            return;
        }
        
        // Configurar el sistema de comentarios
        if (typeof CommentsSystem !== 'undefined') {
            CommentsSystem.currentPost = {
                id: parseInt(postId),
                element: null,
                htmlId: `post-${postId}`
            };
        }
        
        const modal = document.getElementById('commentsModal');
        if (!modal) {
            console.error('Modal de comentarios no encontrado');
            return;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Configurar observer para detectar cambios en el modal
        if (this.commentsObserver) {
            this.commentsObserver.observe(modal, {
                childList: true,
                subtree: true
            });
        }
        
        // Cargar comentarios usando la función global
        if (typeof loadRealComments === 'function') {
            loadRealComments(parseInt(postId));
        }
        
        // Configurar listeners para detectar nuevos comentarios
        this.setupCommentsListeners();
        
        setTimeout(() => {
            const commentInput = document.getElementById('commentInput');
            if (commentInput) {
                commentInput.focus();
            }
        }, 300);
        
 setTimeout(() => {
        if (typeof loadRealComments === 'function') {
            loadRealComments(parseInt(postId));
        } else {
            console.error('Sistema de comentarios no cargado aún');
        }
    }, 100);
            
        this.restartHideTimer();
    }

 openShareModal() {
    console.log('Abriendo modal de compartir para post:', this.currentStats?.id || this.currentPost?.id);
    
    // Obtener el ID del post actual
    const postId = this.currentStats?.id || this.currentPost?.id;
    
    if (!postId) {
        console.error('No se pudo obtener el ID del post');
        return;
    }
    
    // Abrir el modal de compartir (si existe)
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Aquí puedes agregar lógica para cargar usuarios que sigues mutuamente
        // loadMutualFollowers(postId);
    }
    
    // Reiniciar el timer de ocultar controles del viewer
    this.restartHideTimer();
 }

 updatePostInfoFallback() {
        // ESTE MÉTODO VA AQUÍ 👇
        const post = this.currentPost;
        
        const avatarContainer = this.viewerContainer.querySelector('.fsv-avatar');
        if (post.autor.avatar_url) {
            avatarContainer.innerHTML = `<img src="${post.autor.avatar_url}" alt="Avatar del autor">`;
        } else {
            avatarContainer.style.background = 'linear-gradient(135deg, #6366f1, #ec4899)';
            avatarContainer.style.display = 'flex';
            avatarContainer.style.alignItems = 'center';
            avatarContainer.style.justifyContent = 'center';
            avatarContainer.style.color = 'white';
            avatarContainer.style.fontWeight = '600';
            avatarContainer.textContent = this.generateInitials(
                post.autor.display_name || post.autor.username
            );
        }
        
        const usernameContainer = this.viewerContainer.querySelector('.fsv-username');
        usernameContainer.innerHTML = `
            ${post.autor.display_name || post.autor.username}
            ${post.autor.verified ? '<span style="color: #6366f1;">✓</span>' : ''}
        `;
        
        const metaContainer = this.viewerContainer.querySelector('.fsv-user-meta');
        metaContainer.textContent = `@${post.autor.username} • ${new Date(post.fecha).toLocaleDateString()}`;
        
        const contentContainer = this.viewerContainer.querySelector('.fsv-post-content');
        let contentHTML = '';
        
        if (post.contenido && post.tipo !== 'venta') {
            contentHTML += `${this.escapeHtml(post.contenido)}`;
        }
        
        if (post.tipo === 'venta' && post.precio) {
            contentHTML += `<div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 0.8rem 1.2rem; border-radius: 12px; font-size: 1.1rem; font-weight: 700; text-align: center; margin: 0.5rem 0;">💰 En venta por $${post.precio}</div>`;
        }
        
        contentContainer.innerHTML = contentHTML;
        
        // Estadísticas básicas (fallback)
        this.viewerContainer.querySelector('.fsv-like-count').textContent = '0';
        this.viewerContainer.querySelector('.fsv-comment-count').textContent = '0';
        this.viewerContainer.querySelector('.fsv-repost-count').textContent = '0';
        this.viewerContainer.querySelector('.fsv-share-count').textContent = '0';
    
            this.updateBuyButton();

    }

    playVideoIfPresent() {
        const video = this.viewerContainer.querySelector('video');
        if (video) {
            video.play().catch(() => {
                // Auto-play falló, no hacer nada
            });
        }
    }

    checkIfVideoIsSilenced(postData) {
        // Verificar todas las posibles formas en que puede venir el atributo
        const silenciadoVariants = [
            postData.data_silenciado,
            postData['data-silenciado'], 
            postData.data_silenced,
            postData['data-silenced'],
            postData.silenciado,
            postData.silenced,
            postData.muted
        ];
        
        // Si cualquier variante es "true" (string) o true (boolean)
        const isSilenced = silenciadoVariants.some(variant => 
            variant === 'true' || variant === true
        );
        
        // También verificar en el video original si existe en el DOM
        if (postData.media_url) {
            const existingVideo = document.querySelector(`video[src*="${postData.media_url.split('/').pop()}"]`);
            if (existingVideo) {
                const domSilenced = existingVideo.getAttribute('data-silenciado') === 'true' ||
                                  existingVideo.hasAttribute('data-silenciado') ||
                                  existingVideo.hasAttribute('muted');
                                  
                console.log('Video encontrado en DOM:', existingVideo);
                console.log('Atributos del video:', {
                    'data-silenciado': existingVideo.getAttribute('data-silenciado'),
                    'muted': existingVideo.hasAttribute('muted'),
                    'data-post-id': existingVideo.getAttribute('data-post-id')
                });
                
                if (domSilenced) {
                    return true;
                }
            }
        }
        
        return isSilenced;
    }

    updateSoundButtonVisibility() {
        const video = this.viewerContainer.querySelector('video');
        const soundBtn = this.viewerContainer.querySelector('.fsv-sound-btn');
        
        if (!video) {
            soundBtn.style.display = 'none';
            return;
        }
        
        // Verificar si el video actual está forzadamente silenciado
        const isForcedSilent = video.getAttribute('data-silenciado') === 'true' || 
                              video.getAttribute('data-forced-silent') === 'true';
        
        console.log('Verificando visibilidad del botón de sonido:', {
            'data-silenciado': video.getAttribute('data-silenciado'),
            'data-forced-silent': video.getAttribute('data-forced-silent'),
            'isForcedSilent': isForcedSilent
        });
        
        // Solo mostrar botón de sonido para videos que NO están forzadamente silenciados
        if (!isForcedSilent) {
            soundBtn.style.display = 'flex';
            this.updateSoundButton();
            console.log('Mostrando botón de sonido');
        } else {
            soundBtn.style.display = 'none';
            console.log('Ocultando botón de sonido (video silenciado forzadamente)');
        }
    }

updateBuyButton() {
    const buyBtn = this.viewerContainer.querySelector('.fsv-buy-btn');
    if (!buyBtn) {
        console.log('❌ Botón de compra no encontrado en el DOM');
        return;
    }

    // Obtener datos del post (pueden venir de currentStats o currentPost)
    const postData = this.currentStats || this.currentPost;
    
    // Verificar si el post está en venta
    const enVenta = postData.en_venta === true || postData.en_venta === 1;
    const precioVenta = parseFloat(postData.precio_venta || postData.precio || 0);
    
    console.log('🔍 DEBUG Botón de Compra:', {
        postId: postData.id,
        en_venta: postData.en_venta,
        precio_venta: postData.precio_venta,
        enVenta: enVenta,
        precioVenta: precioVenta,
        mostrarBoton: enVenta && precioVenta > 0
    });
    
    if (enVenta && precioVenta > 0) {
        // Mostrar botón de compra
        const priceSpan = buyBtn.querySelector('.fsv-buy-price');
        if (priceSpan) {
            priceSpan.textContent = `${precioVenta.toFixed(2)} CFT`;
        }
        
        buyBtn.dataset.precio = precioVenta;
        buyBtn.dataset.postId = postData.id;
        buyBtn.style.display = 'flex';
        
        console.log('✅ Botón de compra mostrado:', precioVenta);
    } else {
        // Ocultar botón
        buyBtn.style.display = 'none';
        console.log('❌ Botón oculto - en_venta:', enVenta, 'precio:', precioVenta);
    }
}

    updateSoundButton() {
        const soundBtn = this.viewerContainer.querySelector('.fsv-sound-btn');
        
        if (this.globalMuted) {
            soundBtn.classList.add('muted');
        } else {
            soundBtn.classList.remove('muted');
        }
    }

    toggleGlobalSound() {
        this.globalMuted = !this.globalMuted;
        this.updateSoundButton();
        
        // Solo aplicar a videos que NO están forzadamente silenciados
        const video = this.viewerContainer.querySelector('video');
        if (video && video.getAttribute('data-forced-silent') === 'false') {
            video.muted = this.globalMuted;
        }
        // Los videos con data-forced-silent="true" permanecen silenciados siempre
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
        this.viewerContainer.querySelector('.fsv-close-btn').classList.add('visible');
        this.viewerContainer.querySelector('.fsv-bottom-bar').classList.add('visible');
        
        const soundBtn = this.viewerContainer.querySelector('.fsv-sound-btn');
        if (soundBtn.style.display === 'flex') {
            soundBtn.classList.add('visible');
        }
        
        this.controlsVisible = true;
        this.restartHideTimer();
    }

    hideControls() {
        this.viewerContainer.querySelector('.fsv-close-btn').classList.remove('visible');
        this.viewerContainer.querySelector('.fsv-bottom-bar').classList.remove('visible');
        this.viewerContainer.querySelector('.fsv-sound-btn').classList.remove('visible');
        
        this.controlsVisible = false;
        
        if (this.hideButtonTimeout) {
            clearTimeout(this.hideButtonTimeout);
        }
    }

    toggleControls() {
        if (this.controlsVisible) {
            this.hideControls();
        } else {
            this.showControls();
        }
    }

closeViewer() {
    this.isActive = false;
    this.controlsVisible = false;
    this.viewerContainer.classList.remove('active');
    this.viewerContainer.style.display = 'none'; 
    document.body.style.overflow = '';
    document.body.classList.remove('fsv-active');
        
        // Pausar video si existe
        const video = this.viewerContainer.querySelector('video');
        if (video) {
            video.pause();
        }
        
        if (this.hideButtonTimeout) {
            clearTimeout(this.hideButtonTimeout);
        }
        
        // Desconectar observer
        if (this.commentsObserver) {
            this.commentsObserver.disconnect();
        }
        
        // Cerrar modales
        const commentsModal = document.getElementById('commentsModal');
        const shareModal = document.getElementById('shareModal');
        
        if (commentsModal && commentsModal.classList.contains('active')) {
            commentsModal.classList.remove('active');
        }
        
        if (shareModal && shareModal.classList.contains('active')) {
            shareModal.classList.remove('active');
        }
        
        // Limpiar contenido
        setTimeout(() => {
            this.viewerContainer.querySelector('.fsv-posts-container').innerHTML = '';
        }, 300);
    }

    attachEventListeners() {
        // Click en el contenido para mostrar/ocultar controles
        this.viewerContainer.addEventListener('click', (e) => {
            // Si se hace click en un botón, no hacer nada
            if (e.target.closest('button') || 
                e.target.closest('.fsv-action-btn') ||
                e.target.closest('.fsv-bottom-bar')) {
                return;
            }
            
            // Para cualquier otra área, toggle de controles
            this.toggleControls();
        });

        // NUEVO: Event listener para clicks en la barra inferior
        const bottomBar = this.viewerContainer.querySelector('.fsv-bottom-bar');
        bottomBar.addEventListener('click', (e) => {
            // Solo reiniciar si la barra está visible
            if (bottomBar.classList.contains('visible')) {
                this.restartHideTimer();
            }
        });
        
// Botón de cerrar - con propagación detenida y prevención de default
const closeBtn = this.viewerContainer.querySelector('.fsv-close-btn');
closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('🔙 Botón cerrar clickeado');
    this.closeViewer();
}, true);

// También agregar para touch en móviles
closeBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('🔙 Botón cerrar tocado (touch)');
    this.closeViewer();
}, true);
        
        // Botón de sonido
        this.viewerContainer.querySelector('.fsv-sound-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleGlobalSound();
            this.restartHideTimer();
        });
        
        // Acciones de posts
const actionBtns = this.viewerContainer.querySelectorAll('.fsv-action-btn');
actionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        this.handlePostAction(action); // CAMBIAR ESTA LÍNEA
    });
});
        
        // Hacer la barra inferior deslizable
        this.makeBottomBarDraggable();
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeViewer();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleControls();
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    if (this.viewerContainer.querySelector('.fsv-sound-btn').style.display === 'flex') {
                        this.toggleGlobalSound();
                    }
                    break;
            }
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
                this.controlsVisible = false;
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

    // Funciones auxiliares
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateInitials(name) {
        if (!name) return 'U';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return (words[0][0] + (words[0][1] || '')).toUpperCase();
    }

        setupCommentsObserver() {
        // Crear observer para detectar cuando se actualiza el modal de comentarios
        this.commentsObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this.updateCommentCountFromModal();
                }
            });
        });
    }

    updateCommentCountFromModal() {
        if (!this.isActive) return;
        
        // Intentar obtener el contador desde el modal
        const commentsModal = document.getElementById('commentsModal');
        if (commentsModal && commentsModal.classList.contains('active')) {
            // Buscar el contador en el modal
            const commentsCountElement = commentsModal.querySelector('#commentsCount, .comments-count');
            if (commentsCountElement) {
                const countText = commentsCountElement.textContent;
                const count = countText.match(/\d+/);
                if (count) {
                    this.updateViewerCommentCount(parseInt(count[0]));
                }
            } else {
                // Si no hay contador en el modal, contar los comentarios directamente
                const commentItems = commentsModal.querySelectorAll('.comment-item:not(.reply)');
                this.updateViewerCommentCount(commentItems.length);
            }
        }
    }

    updateViewerCommentCount(newCount) {
        const commentCountElement = this.viewerContainer.querySelector('.fsv-comment-count');
        if (commentCountElement) {
            commentCountElement.textContent = newCount;
        }
    }

    setupCommentsListeners() {
        const modal = document.getElementById('commentsModal');
        if (!modal) return;
        
        // Listener para el botón de enviar comentario
        const submitBtn = modal.querySelector('#submitCommentBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                // Esperar un poco y luego actualizar el contador
                setTimeout(() => {
                    this.updateCommentCountFromModal();
                }, 1000);
            });
        }
        
        // Listener para envío con Enter
        const commentInput = modal.querySelector('#commentInput');
        if (commentInput) {
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    setTimeout(() => {
                        this.updateCommentCountFromModal();
                    }, 1000);
                }
            });
        }
        
        // Observer adicional para detectar cambios en la lista de comentarios
        const commentsList = modal.querySelector('#commentsList');
        if (commentsList && this.commentsObserver) {
            this.commentsObserver.observe(commentsList, {
                childList: true,
                subtree: true
            });
        }
    }

}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.simplePostViewer = new SimplePostViewer();
    });
} else {
    window.simplePostViewer = new SimplePostViewer();
}

console.log('✅ Simple Post Viewer - Con estilos exactos del FullscreenPostViewer cargado');