// ============================================
// BARRA DE NAVEGACIÓN INFERIOR - MOBILE
// Estilo minimalista
// ============================================

(function() {
    'use strict';

    const BottomNav = {
        currentPage: 'inicio',
        user: null,
lastScrollY: 0,
ticking: false,

handleScroll() {
    // Obtener scroll de múltiples fuentes
    const currentScrollY = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop,
        window.scrollY || 0
    );
    
    const nav = document.getElementById('bottomNavBar');
    
    if (!nav) return;

    // Umbral de detección más sensible
    const threshold = 30;
    const scrollDifference = Math.abs(currentScrollY - this.lastScrollY);
    
    // Si el scroll es muy pequeño, ignorar
    if (scrollDifference < 3) {
        return;
    }

    // Si el scroll es menor al umbral, siempre mostrar
    if (currentScrollY < threshold) {
        nav.classList.remove('hidden');
        nav.style.transform = 'translateY(0)';
        this.lastScrollY = currentScrollY;
        return;
    }

    // Detectar dirección del scroll con más precisión
    if (currentScrollY > this.lastScrollY + 5) {
        // Scrolling hacia abajo - ocultar
        nav.classList.add('hidden');
        nav.style.transform = 'translateY(100%)';
    } else if (currentScrollY < this.lastScrollY - 5) {
        // Scrolling hacia arriba - mostrar
        nav.classList.remove('hidden');
        nav.style.transform = 'translateY(0)';
    }

    this.lastScrollY = currentScrollY;
}, 

requestTick() {
    if (!this.ticking) {
        window.requestAnimationFrame(() => {
            this.handleScroll();
            this.ticking = false;
        });
        this.ticking = true;
    }
},

        init() {
            this.user = this.getCurrentUser();
            this.createBottomNav();
            this.setActivePage();
            this.setupEventListeners();
        },

        getCurrentUser() {
            try {
                const savedUser = localStorage.getItem('chainfeed_user');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    return userData.username || 'user';
                }
            } catch (error) {
                console.error('Error obteniendo usuario:', error);
            }
            return 'user';
        },

        createBottomNav() {
            if (document.getElementById('bottomNavBar')) return;

            const nav = document.createElement('nav');
            nav.id = 'bottomNavBar';
            nav.className = 'bottom-nav';
            nav.innerHTML = `
                <button class="nav-item" data-page="inicio" onclick="BottomNav.navigate('inicio')">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                </button>

                <button class="nav-item" data-page="busqueda" onclick="BottomNav.navigate('busqueda')">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                </button>

                <button class="nav-item nav-item-create" onclick="BottomNav.openCreatePost()">
                    <div class="create-button">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </div>
                </button>

                <button class="nav-item" data-page="billetera" onclick="BottomNav.navigate('billetera')">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                </button>

                <button class="nav-item" data-page="perfil" onclick="BottomNav.navigate('perfil')">
                    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </button>
            `;

            document.body.appendChild(nav);
            this.addStyles();
        },

        addStyles() {
            if (document.getElementById('bottomNavStyles')) return;

            const style = document.createElement('style');
            style.id = 'bottomNavStyles';
            style.textContent = `
                /* ============================================ */
                /* BARRA DE NAVEGACIÓN INFERIOR - MINIMALISTA */
                /* ============================================ */
                
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: rgba(1, 1, 1, 1);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
    padding: 0 8px;
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    
    /* AGREGAR ESTAS LÍNEAS */
    transform: translateY(0);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

                .nav-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 12px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    min-width: 50px;
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                    user-select: none;
                }

                .nav-item:active {
                    transform: scale(0.9);
                }

                .nav-icon {
                    width: 26px;
                    height: 26px;
                    transition: all 0.3s ease;
                }

                /* Estado activo - solo color */
                .nav-item.active {
                    color: var(--primary);
                }

                .nav-item.active .nav-icon {
                    transform: scale(1.05);
                }

                /* Botón de crear (especial) */
                .nav-item-create {
                    padding: 0;
                }

                .create-button {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .nav-item-create:active .create-button {
                    transform: scale(0.9);
                }

                .create-button::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s ease;
                }

                .nav-item-create:hover .create-button::before {
                    left: 100%;
                }

                .create-button .nav-icon {
                    width: 24px;
                    height: 24px;
                    stroke: white;
                    stroke-width: 2.5;
                }

                /* Hover effects (solo desktop) */
                @media (hover: hover) {
                    .nav-item:hover {
                        color: var(--primary);
                        background: rgba(99, 102, 241, 0.1);
                    }

                    .nav-item-create:hover .create-button {
                        transform: scale(1.08);
                        box-shadow: 0 6px 18px rgba(99, 102, 241, 0.5);
                    }
                }

                /* Ajustes para pantallas grandes */
                @media (min-width: 768px) {
                    .bottom-nav {
                        display: none;
                    }
                }

                /* Ajustes para pantallas muy pequeñas */
                @media (max-width: 380px) {

                    .nav-item {
                        min-width: 45px;
                        padding: 8px;
                    }

                    .nav-icon {
                        width: 24px;
                        height: 24px;
                    }

                    .create-button {
                        width: 42px;
                        height: 42px;
                    }

                    .create-button .nav-icon {
                        width: 22px;
                        height: 22px;
                    }
                }

                /* Ajuste del contenido principal */
                body {
                    padding-bottom: 60px;
                }

                @media (min-width: 768px) {
                    body {
                        padding-bottom: 0;
                    }
                }

                /* Animación de entrada */
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .bottom-nav {
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Vibración al pulsar */
                @keyframes vibrate {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }

                .nav-item.vibrate {
                    animation: vibrate 0.3s ease;
                }
            `;

            document.head.appendChild(style);
        },

        setActivePage() {
            const path = window.location.pathname;
            const search = window.location.search;
            const href = window.location.href;
            
            console.log('🔍 Detectando página:', { path, search, href });
            
            // Detectar página de perfil con TODOS los patrones posibles
            const isPerfilPage = 
                path === '/perfil' ||
                path === '/perfil/' ||
                path.startsWith('/perfil/') ||
                path.includes('/profile') ||
                search.includes('user=') ||
                href.includes('/perfil/') ||
                href.includes('?user=');
            
            if (isPerfilPage) {
                this.currentPage = 'perfil';
                console.log('✅ Página de perfil detectada');
            } else if (path.includes('/inicio') || path === '/' || path === '') {
                this.currentPage = 'inicio';
                console.log('✅ Página de inicio detectada');
            } else if (path.includes('/busqueda') || path.includes('/search')) {
                this.currentPage = 'busqueda';
                console.log('✅ Página de búsqueda detectada');
            } else if (path.includes('/billetera') || path.includes('/wallet')) {
                this.currentPage = 'billetera';
                console.log('✅ Página de billetera detectada');
            }

            console.log('📍 Página actual:', this.currentPage);
            this.updateActiveState();
        },

        updateActiveState() {
            const items = document.querySelectorAll('.nav-item[data-page]');
            items.forEach(item => {
                const page = item.dataset.page;
                if (page === this.currentPage) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        },

        navigate(page) {
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }

            const button = event.target.closest('.nav-item');
            if (button) {
                button.classList.add('vibrate');
                setTimeout(() => button.classList.remove('vibrate'), 300);
            }

            const routes = {
                'inicio': '/inicio',
                'busqueda': '/busqueda',
                'billetera': '/billetera',
                'perfil': `/perfil?user=${this.user}`
            };

            if (routes[page]) {
                window.location.href = routes[page];
            }
        },

   openCreatePost() {
    if (navigator.vibrate) {
        navigator.vibrate([10, 20, 10]);
    }

    const button = event.target.closest('.nav-item-create');
    if (button) {
        const createBtn = button.querySelector('.create-button');
        createBtn.style.transform = 'scale(0.9) rotate(90deg)';
        setTimeout(() => {
            createBtn.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }

    // Detectar si estamos en página de perfil
    const path = window.location.pathname;
    const search = window.location.search;
    const isPerfilPage = 
        path === '/perfil' || 
        path === '/perfil/' || 
        path.startsWith('/perfil/') ||
        path.includes('/profile') ||
        search.includes('user=');

    if (isPerfilPage) {
        // Obtener el usuario de la URL actual
        const urlParams = new URLSearchParams(search);
        const profileUser = urlParams.get('user');
        
        // Verificar si estamos viendo NUESTRO propio perfil
        const isOwnProfile = profileUser === this.user || !profileUser;
        
        if (isOwnProfile) {
            // Si es nuestro perfil, hacer toggle del formulario
            if (typeof window.toggleCreatePostSection === 'function') {
                window.toggleCreatePostSection();
            }
        } else {
            // Si estamos viendo el perfil de OTRO usuario, redirigir a nuestro perfil
            window.location.href = `/perfil?user=${this.user}&show=create`;
        }
    } else {
        // Si no estamos en perfil, redirigir con parámetro
        window.location.href = `/perfil?user=${this.user}&show=create`;
    }
},

        showToast(message) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 70px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(26, 26, 36, 0.95);
                backdrop-filter: blur(10px);
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                font-size: 14px;
                z-index: 10001;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                animation: toastSlide 0.3s ease;
                border: 1px solid rgba(99, 102, 241, 0.3);
            `;
            toast.textContent = message;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes toastSlide {
                    from { 
                        opacity: 0; 
                        transform: translateX(-50%) translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(-50%) translateY(0); 
                    }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 2500);
        },

        setupEventListeners() {
            // Ejecutar inmediatamente
            this.setActivePage();
            
            window.addEventListener('popstate', () => {
                console.log('🔄 Evento popstate');
                this.setActivePage();
            });

            window.addEventListener('load', () => {
                console.log('🔄 Evento load');
                this.setActivePage();
            });
            
            // Forzar detección adicional después de varios delays
            setTimeout(() => {
                console.log('🔄 Detección 100ms');
                this.setActivePage();
            }, 100);
            
            setTimeout(() => {
                console.log('🔄 Detección 500ms');
                this.setActivePage();
            }, 500);
            
            setTimeout(() => {
                console.log('🔄 Detección 1000ms');
                this.setActivePage();
            }, 1000);

            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    console.log('🔄 URL cambió:', url);
                    this.setActivePage();
                }
            }).observe(document, { subtree: true, childList: true });
            
            window.addEventListener('scroll', () => this.requestTick(), { passive: true });

        }

    }; 

    window.BottomNav = BottomNav;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => BottomNav.init());
    } else {
        BottomNav.init();
    }

})();

console.log('✅ Barra de navegación inferior cargada');