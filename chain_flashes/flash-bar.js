/**
 * CHAIN FLASHES - Barra Horizontal
 * Sistema de historias tokenizadas tipo Instagram Stories
 */

class ChainFlashesBar {
    constructor() {
        this.flashes = [];
        this.currentUser = null;
        this.container = null;
        this.isLoading = false;
        
            this.handleFlashClick = this.handleFlashClick.bind(this);

        this.init();
    }

    async init() {
        console.log('🔥 Inicializando Chain Flashes Bar...');
        
        this.container = document.getElementById('flashesScrollContainer');
        if (!this.container) {
            console.error('❌ Contenedor de flashes no encontrado');
            return;
        }

        // Obtener usuario actual
        this.currentUser = this.getCurrentUser();
        if (!this.currentUser) {
            console.warn('⚠️ Usuario no logueado');
            return;
        }

        await this.loadFlashes();
        this.setupScrollBehavior();
        
        console.log('✅ Chain Flashes Bar inicializado');
    }

    getCurrentUser() {
        try {
            const savedUser = localStorage.getItem('chainfeed_user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                return userData.username;
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            return null;
        }
    }

    async loadFlashes() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
           const response = await fetch('/php/chain_flashes/obtener_flashes_inicio.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                this.flashes = data.flashes || [];
                this.render();
            } else {
                console.error('Error cargando flashes:', data.message);
                this.showEmpty();
            }

        } catch (error) {
            console.error('Error en loadFlashes:', error);
            this.showEmpty();
        } finally {
            this.isLoading = false;
        }
    }

render() {
    if (!this.container) return;

    if (this.flashes.length === 0) {
        this.renderEmpty();
        return;
    }

    let html = '';

    // ✅ 1. BOTÓN DE CREAR (SIEMPRE PRIMERO)
    html += this.renderCreateButton();

    // ✅ 2. AGRUPAR FLASHES POR USUARIO
    const flashesByUser = {};
    this.flashes.forEach(flash => {
        if (!flashesByUser[flash.username]) {
            flashesByUser[flash.username] = [];
        }
        flashesByUser[flash.username].push(flash);
    });

    // ✅ 3. RENDERIZAR TUS FLASHES (SI EXISTEN)
    if (flashesByUser[this.currentUser]) {
        html += this.renderUserFlashes(flashesByUser[this.currentUser], true);
    }

    // ✅ 4. RENDERIZAR FLASHES DE OTROS USUARIOS
    Object.keys(flashesByUser).forEach(username => {
        if (username !== this.currentUser) {
            html += this.renderUserFlashes(flashesByUser[username], false);
        }
    });

    this.container.innerHTML = html;

        this.setupEventDelegation();
    console.log('✅ Flashes renderizados con event delegation');
}

renderCreateButton() {
    return `
        <div class="flash-avatar-wrapper your-flash" onclick="window.flashCreator.open()">
            <div class="flash-avatar-container">
                <div class="flash-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 60%; height: 60%; color: #fff;">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <div class="flash-add-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </div>
                </div>
            </div>
            <span class="flash-username your-flash">Crear Flash</span>
        </div>
    `;
}

renderUserFlashes(userFlashes, isCurrentUser = false) {
    if (!userFlashes || userFlashes.length === 0) return '';

    // Tomar el primer flash del usuario (para mostrar avatar y datos)
    const firstFlash = userFlashes[0];
    const flashCount = userFlashes.length;
    
    // Calcular tokens totales del usuario
    let totalTokens = 0;
    userFlashes.forEach(flash => {
        totalTokens += parseFloat(flash.tokens_ganados_vistas || 0) + parseFloat(flash.tokens_ganados_reacciones || 0);
    });

    // Verificar si todos están vistos
    const allViewed = userFlashes.every(flash => flash.ya_visto == 1);
    
    // Verificar si alguno está anclado
    const hasAnclado = userFlashes.some(flash => flash.es_anclado == 1);

    return `
        <div class="flash-avatar-wrapper ${isCurrentUser ? 'your-flash' : ''}" 
             data-flash-id="${firstFlash.id}">
            <div class="flash-avatar-container">
                <div class="flash-ring ${allViewed ? 'viewed' : ''} ${hasAnclado ? 'anclado' : ''}"></div>
                <div class="flash-avatar">
                    ${firstFlash.avatar_url 
                        ? `<img src="${firstFlash.avatar_url}" alt="${firstFlash.username}">` 
                        : this.generateInitials(firstFlash.username)
                    }
                </div>
                ${totalTokens > 0 && isCurrentUser 
                    ? `<div class="flash-tokens-badge">+${this.formatTokens(totalTokens)} CFT</div>` 
                    : ''
                }
                ${flashCount > 1 
                    ? `<div class="flash-count-badge">${flashCount}</div>` 
                    : ''
                }
            </div>
            <span class="flash-username ${isCurrentUser ? 'your-flash' : ''}">
                ${isCurrentUser ? 'Tu Flash' : (firstFlash.display_name || firstFlash.username)}
            </span>
        </div>
    `;
}

renderEmpty() {
    this.container.innerHTML = `
        ${this.renderCreateButton()}
        <div class="flashes-empty">
            <span>✨ Sé el primero en crear un Chain Flash</span>
        </div>
    `;
}

    showLoading() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="flashes-loading">
                    <span>⏳ Cargando Flashes...</span>
                </div>
            `;
        }
    }

    showEmpty() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="flashes-empty">
                    <span>😔 No hay Flashes disponibles</span>
                </div>
            `;
        }
    }

    setupScrollBehavior() {
        if (!this.container) return;

        // Scroll horizontal suave con rueda del mouse
        this.container.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.container.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }

    generateInitials(username) {
        if (!username) return 'U';
        return username.substring(0, 2).toUpperCase();
    }

    formatTokens(amount) {
        return amount >= 1 ? amount.toFixed(1) : amount.toFixed(2);
    }

    // Recargar flashes (llamar después de crear/eliminar)
    async reload() {
        await this.loadFlashes();
    }

    async updateRingsOnly() {
    try {
        const response = await fetch('/php/chain_flashes/obtener_flashes_inicio.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            const newFlashes = data.flashes || [];
            
            // Actualizar estado ya_visto de los flashes existentes
            newFlashes.forEach(newFlash => {
                const existingFlash = this.flashes.find(f => f.id === newFlash.id);
                if (existingFlash) {
                    existingFlash.ya_visto = newFlash.ya_visto;
                }
            });
            
            // Re-renderizar con fade suave
            const container = this.container;
            if (container) {
                container.style.transition = 'opacity 0.3s ease';
                container.style.opacity = '0.7';
                
                this.render();
                
                setTimeout(() => {
                    container.style.opacity = '1';
                }, 100);
            }
            
            console.log('✅ Anillos actualizados silenciosamente');
        }
    } catch (error) {
        console.error('Error actualizando anillos:', error);
    }
}

    // ✅ NUEVO MÉTODO: Event Delegation para clicks
setupEventDelegation() {
    if (!this.container) return;
    
    // Remover event listeners anteriores
    this.container.removeEventListener('click', this.handleFlashClick);
    
    // Agregar nuevo event listener
    this.container.addEventListener('click', this.handleFlashClick);
}

// ✅ NUEVO MÉTODO: Manejar clicks en flashes
handleFlashClick(event) {
    const flashWrapper = event.target.closest('.flash-avatar-wrapper');
    if (!flashWrapper) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🎯 Click en flash detectado via delegation');
    
    // Encontrar el flash ID
    const flashId = this.extractFlashIdFromElement(flashWrapper);
    
    if (flashId && window.flashViewer && typeof window.flashViewer.open === 'function') {
        console.log('🔓 Abriendo flash ID:', flashId);
        window.flashViewer.open(parseInt(flashId));
    } else if (flashWrapper.classList.contains('your-flash') && 
               flashWrapper.querySelector('.flash-add-badge') && 
               window.flashCreator) {
        // Es el botón de crear
        console.log('🎯 Abriendo creador de flashes');
        window.flashCreator.open();
    }
}

// ✅ NUEVO MÉTODO: Extraer Flash ID
extractFlashIdFromElement(element) {
    // Buscar en data attributes
    if (element.dataset.flashId) {
        return element.dataset.flashId;
    }
    
    // Buscar en elementos hijos
    const childWithData = element.querySelector('[data-flash-id]');
    if (childWithData) {
        return childWithData.dataset.flashId;
    }
    
    // Extraer del onclick original
    const onclickAttr = element.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('open(')) {
        const match = onclickAttr.match(/open\((\d+)\)/);
        return match ? match[1] : null;
    }
    
    return null;
}

}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chainFlashesBar = new ChainFlashesBar();
    });
} else {
    window.chainFlashesBar = new ChainFlashesBar();
}

console.log('✅ flash-bar.js cargado');