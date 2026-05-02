/**
 * CHAIN FLASH VIEWER
 * Visualizador fullscreen vertical tipo Instagram Stories
 * Navegación vertical, reacciones tokenizadas, estadísticas en tiempo real
 */

/**
 * DELETE FLASH MODAL - Integrado
 */
(function() {
    if (window.deleteFlashModal) return;
    
    window.deleteFlashModal = {
        flashId: null,
        onSuccess: null,
        
        open(flashId, onSuccess) {
            this.flashId = flashId;
            this.onSuccess = onSuccess;

            const existing = document.getElementById('deleteFlashModal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'deleteFlashModal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px);
                z-index: 999999; display: flex; align-items: center;
                justify-content: center; opacity: 0; transition: opacity 0.3s ease;
            `;

            modal.innerHTML = `
                <div id="deleteFlashModalContent" style="
                    background: var(--dark-secondary, #1a1a2e); border-radius: 20px;
                    padding: 2rem; max-width: 400px; width: 90%;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transform: scale(0.9); transition: transform 0.3s ease;
                ">
                    <h3 style="margin: 0 0 1rem 0; font-size: 1.3rem; font-weight: 700; color: #cfcedd;">
                        🗑️ Eliminar Flash
                    </h3>
                    <p style="margin: 0 0 2rem 0; color: var(--text-secondary, rgba(255,255,255,0.7)); line-height: 1.5;">
                        ¿Estás seguro de que deseas eliminar este Flash? Esta acción no se puede deshacer.
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button id="deleteFlashCancelBtn" style="
                            background: rgba(255, 255, 255, 0.1);
                            color: var(--text-secondary, rgba(255,255,255,0.7));
                            border: none; padding: 0.8rem 1.5rem; border-radius: 10px;
                            cursor: pointer; transition: all 0.3s ease; font-weight: 600;
                        ">Cancelar</button>
                        <button id="deleteFlashConfirmBtn" style="
                            background: linear-gradient(135deg, #ef4444, #dc2626);
                            color: white; border: none; padding: 0.8rem 1.5rem;
                            border-radius: 10px; cursor: pointer;
                            transition: all 0.3s ease; font-weight: 600;
                        ">Eliminar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(() => {
                modal.style.opacity = '1';
                document.getElementById('deleteFlashModalContent').style.transform = 'scale(1)';
            });

            document.getElementById('deleteFlashCancelBtn').onclick = () => this.close();
            document.getElementById('deleteFlashConfirmBtn').onclick = () => this.confirm();
            modal.onclick = (e) => { if (e.target === modal) this.close(); };
            
            this._escHandler = (e) => { if (e.key === 'Escape') this.close(); };
            document.addEventListener('keydown', this._escHandler);
        },

        close() {
            const modal = document.getElementById('deleteFlashModal');
            if (!modal) return;
            modal.style.opacity = '0';
            const content = document.getElementById('deleteFlashModalContent');
            if (content) content.style.transform = 'scale(0.9)';
            setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 300);
            document.removeEventListener('keydown', this._escHandler);
        },

        async confirm() {
            const btn = document.getElementById('deleteFlashConfirmBtn');
            btn.disabled = true;
            btn.textContent = 'Eliminando...';

            try {
                const response = await fetch('/php/chain_flashes/eliminar_flash.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ flash_id: this.flashId })
                });
                const data = await response.json();

                if (data.success) {
                    if (typeof showNotification === 'function') showNotification('Flash eliminado correctamente', 'success');
                    this.close();
                    if (this.onSuccess) this.onSuccess();
                } else {
                    if (typeof showNotification === 'function') showNotification(data.message || 'Error al eliminar', 'error');
                    btn.disabled = false;
                    btn.textContent = 'Eliminar';
                }
            } catch (error) {
                console.error('Error eliminando Flash:', error);
                if (typeof showNotification === 'function') showNotification('Error al eliminar', 'error');
                btn.disabled = false;
                btn.textContent = 'Eliminar';
            }
        }
    };
})();

class ChainFlashViewer {
constructor() {
    this.isActive = false;
    this.currentFlashId = null;
    this.currentFlashData = null;
    this.allFlashes = [];
    this.flashesByUser = {}; // ✅ NUEVO: Flashes agrupados por usuario
    this.userList = []; // ✅ NUEVO: Lista ordenada de usuarios
    this.currentUserIndex = 0; // ✅ NUEVO: Índice del usuario actual
    this.currentFlashIndexInUser = 0; // ✅ NUEVO: Índice del flash dentro del usuario
    this.currentIndex = 0; // Mantener para compatibilidad
    this.viewerElement = null;
    this.progressInterval = null;
    this.statsUpdateInterval = null;
    this.isNavigating = false;
    
    this.FLASH_DURATION = 5000;
    this.currentFlashDuration = 5000;
    this.progressValue = 0;
    this.HOLD_THRESHOLD = 200; // ✅ Agregar esto si no existe
    
    this.init();
}

    init() {
        console.log('👁️ Inicializando Flash Viewer...');
        this.createViewer();
        this.attachEvents();
        console.log('✅ Flash Viewer inicializado');
    }

    createViewer() {
        const viewer = document.createElement('div');
        viewer.id = 'chainFlashViewer';
        viewer.className = 'cfv-container';
        viewer.innerHTML = `
            <style>
.cfv-container {
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
                    overscroll-behavior: none;
                }
            </style>

            <!-- Progress Bars -->
            <div class="cfv-progress-container" id="cfvProgressContainer"></div>

            <!-- Header -->
            <div class="cfv-header">
                <div class="cfv-user-info">
                    <div class="cfv-avatar" id="cfvAvatar"></div>
                    <div class="cfv-user-details">
                        <div class="cfv-username" id="cfvUsername"></div>
                        <div class="cfv-time-ago" id="cfvTimeAgo"></div>
                    </div>
                </div>
                <button class="cfv-close-btn" onclick="window.flashViewer.close()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>

            <!-- Anclado Badge -->
            <div class="cfv-anclado-badge" id="cfvAncladoBadge" style="display: none;">
                ⛓️ Anclado permanente
            </div>

            <!-- Stats Badge -->
            <div class="cfv-stats-badge" id="cfvStatsBadge">
                <div class="cfv-stat-item">
                    <span class="cfv-stat-icon">👁️</span>
                    <span id="cfvViews">0</span>
                </div>
                <div class="cfv-stat-item">
                    <span class="cfv-stat-icon">💰</span>
                    <span id="cfvTokens">0 CFT</span>
                </div>
            </div>

            <!-- Media Container -->
            <div class="cfv-media-container" id="cfvMediaContainer"></div>

            <!-- Reactions -->
            <div class="cfv-reactions-container" id="cfvReactions"></div>

            <!-- Owner Actions -->
            <div class="cfv-owner-actions" id="cfvOwnerActions" style="display: none;"></div>         
        
        <!-- Panel inferior deslizante -->
            <div class="cfv-bottom-panel" id="cfvBottomPanel">
                <div class="panel-handle"></div>
                
       <!-- Estadísticas públicas -->
<div class="panel-stats" id="panelStats">
    <div class="stat-item" id="panelViewsItem">
        <span class="stat-icon">👁️</span>
        <span id="panelViews">0</span>
    </div>
    <div class="stat-item" id="panelTokensItem">
        <span class="stat-icon">💰</span>
        <span id="panelTokens">0 CFT</span>
    </div>
</div>

                <!-- Lista de usuarios que vieron -->
<div class="panel-viewers-list" id="panelViewersList" style="display: none;">
    <div class="viewers-header">
        <button class="viewers-back-btn" onclick="window.flashViewer.hideViewersList()">
            ← Atrás
        </button>
        <h3>Vistas del Flash</h3>
    </div>
    <div class="viewers-content" id="viewersContent">
        <!-- Se llena dinámicamente -->
    </div>
</div>

                <!-- Lista de reacciones (solo creador) -->
                <div class="panel-reactions-list" id="panelReactionsList">
                    <!-- Se llena dinámicamente -->
                </div>

                <!-- Botones de reacción (visitantes) -->
                <div class="panel-user-reactions" id="panelUserReactions">
                    <!-- Se llena dinámicamente -->
                </div>

                <!-- Acciones de dueño -->
                <div class="panel-owner-actions" id="panelOwnerActions">
                    <!-- Se llena dinámicamente -->
                </div>
            </div>
                `;

        document.body.appendChild(viewer);
        this.viewerElement = viewer;
    }

attachEvents() {
    // ESC para cerrar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isActive) {
            this.close();
        }
    });

    // Flechas para navegar
    document.addEventListener('keydown', (e) => {
        if (!this.isActive) return;
        
        if (e.key === 'ArrowLeft') {
            this.navigatePrev();
        } else if (e.key === 'ArrowRight') {
            this.navigateNext();
        }
    });

// ✅ SISTEMA UNIFICADO: TAP + HOLD + SWIPE + SCROLL
let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;
let isHolding = false;
let isSwiping = false;
let isVerticalScroll = false;
let gestureDecided = false;
let hasMoved = false; // ✅ NUEVO: Detectar si hubo movimiento

// TOUCH START
const handleStart = (e) => {
    if (!this.isActive) return;
    
    touchStartTime = Date.now();
    touchStartX = e.touches ? e.touches[0].clientX : e.clientX;
    touchStartY = e.touches ? e.touches[0].clientY : e.clientY;
    isHolding = false;
    isSwiping = false;
    isVerticalScroll = false;
    gestureDecided = false;
    hasMoved = false;

    this.holdTimer = setTimeout(() => {
        if (!hasMoved) {
            isHolding = true;
            this.pauseProgress();
            this.viewerElement.classList.add('paused');
            
            const video = this.viewerElement.querySelector('video');
            if (video && !video.paused) {
                video.pause();
                video.dataset.wasPausedByHold = 'true';
            }
        }
    }, this.HOLD_THRESHOLD);
};

// TOUCH MOVE
const handleMove = (e) => {
    if (!this.isActive || isHolding) return;
    
    e.preventDefault(); // ← AGREGAR ESTA LÍNEA
    
    const touchCurrentX = e.touches ? e.touches[0].clientX : e.clientX;
    const touchCurrentY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const diffX = Math.abs(touchCurrentX - touchStartX);
    const diffY = Math.abs(touchCurrentY - touchStartY);
    
    if (diffX > 10 || diffY > 10) {
        hasMoved = true;
        clearTimeout(this.holdTimer);
    }
    
    if (!gestureDecided && (diffX > 30 || diffY > 30)) {
        if (diffY > diffX * 1.8) {
            isVerticalScroll = true;
            isSwiping = false;
            gestureDecided = true;
        } else if (diffX > diffY * 1.8) {
            isSwiping = true;
            isVerticalScroll = false;
            gestureDecided = true;
        }
    }
};

// TOUCH END
const handleEnd = (e) => {
    if (!this.isActive) return;

    clearTimeout(this.holdTimer);

    const touchDuration = Date.now() - touchStartTime;
    const touchEndX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const touchEndY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    if (isHolding) {
        this.resumeProgress();
        this.viewerElement.classList.remove('paused');
        
        const video = this.viewerElement.querySelector('video');
        if (video && video.dataset.wasPausedByHold === 'true') {
            video.play();
            delete video.dataset.wasPausedByHold;
        }
        return;
    }

    const panel = document.getElementById('cfvBottomPanel');
    const panelVisible = panel && panel.classList.contains('visible');

    // ✅ PRIORIDAD 1: SCROLL VERTICAL
    if (isVerticalScroll) {
        const diffY = touchStartY - touchEndY;
        
        if (diffY > 80 && !panelVisible) {
            this.showBottomPanel();
        } else if (diffY < -80 && panelVisible) {
            this.hideBottomPanel();
        }
        return;
    }

    // ✅ PRIORIDAD 2: SWIPE HORIZONTAL
    if (isSwiping) {
        const diffX = touchEndX - touchStartX;
        
        if (diffX > 100) {
            this.navigateToNextUser();
        } else if (diffX < -100) {
            this.navigateToPrevUser();
        }
        return;
    }

// ✅ PRIORIDAD 3: Si el click fue DENTRO del panel, NO hacer nada
if (e.target.closest('.cfv-bottom-panel')) {
    return; // ✅ SALIR - No procesar ningún gesto
}

// ✅ PRIORIDAD 4: Si panel visible, TAP lo oculta
if (panelVisible) {
    this.hideBottomPanel();
    return;
}

// ✅ PRIORIDAD 5: TAP para navegar
if (touchDuration < this.HOLD_THRESHOLD && !hasMoved) {
    const screenWidth = window.innerWidth;
    
    if (touchEndX < screenWidth / 3) {
        this.navigatePrev();
    } else if (touchEndX > screenWidth / 3) {
        this.navigateNext();
    }
}

    isSwiping = false;
    isVerticalScroll = false;
    gestureDecided = false;
    hasMoved = false;
};

// Eventos DESKTOP
this.viewerElement.addEventListener('mousedown', handleStart);
this.viewerElement.addEventListener('mousemove', handleMove);
this.viewerElement.addEventListener('mouseup', handleEnd);
this.viewerElement.addEventListener('mouseleave', (e) => {
    if (isHolding) {
        clearTimeout(this.holdTimer);
        this.resumeProgress();
        this.viewerElement.classList.remove('paused');
        
        const video = this.viewerElement.querySelector('video');
        if (video && video.dataset.wasPausedByHold === 'true') {
            video.play();
            delete video.dataset.wasPausedByHold;
        }
        
        isHolding = false;
    }
});

// Eventos MÓVIL
this.viewerElement.addEventListener('touchstart', handleStart, { passive: true });
this.viewerElement.addEventListener('touchmove', handleMove, { passive: false });
this.viewerElement.addEventListener('touchend', handleEnd, { passive: true });
this.viewerElement.addEventListener('touchcancel', (e) => {
    if (isHolding) {
        clearTimeout(this.holdTimer);
        this.resumeProgress();
        this.viewerElement.classList.remove('paused');
        
        const video = this.viewerElement.querySelector('video');
        if (video && video.dataset.wasPausedByHold === 'true') {
            video.play();
            delete video.dataset.wasPausedByHold;
        }
        
        isHolding = false;
    }
});

// ✅ PREVENIR MENÚ CONTEXTUAL
this.viewerElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
});

// ✅ PREVENIR SELECCIÓN
this.viewerElement.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
});

// ✅ PREVENIR DRAG
this.viewerElement.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});

// ✅ INTERCEPTAR BOTÓN ATRÁS (solo una vez)
if (!this._popstateHandlerAttached) {
    this._popstateHandler = (e) => {
        if (this.isActive) {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.close();
        }
    };
    window.addEventListener('popstate', this._popstateHandler, true);
    this._popstateHandlerAttached = true;
}

}

// Agregar este método ANTES del método open()
resetState() {
    console.log('🔄 Reseteando estado del viewer...');
    
    // Detener todo
    this.stopProgress();
    this.stopStatsUpdate();
    
    // Limpiar videos
    const video = this.viewerElement?.querySelector('video');
    if (video) {
        video.pause();
        video.src = '';
    }
    
    // Resetear índices
    this.currentUserIndex = 0;
    this.currentFlashIndexInUser = 0;
    this.currentIndex = 0;
    
    // Limpiar datos
    this.currentFlashId = null;
    this.currentFlashData = null;
    this.allFlashes = [];
    this.flashesByUser = {};
    this.userList = [];
    
    // Limpiar UI
    this.progressValue = 0;
    this.currentFlashDuration = 5000;
    this.isNavigating = false;
    
    // Limpiar contenedores
    const mediaContainer = document.getElementById('cfvMediaContainer');
    if (mediaContainer) mediaContainer.innerHTML = '';
    
    const progressContainer = document.getElementById('cfvProgressContainer');
    if (progressContainer) progressContainer.innerHTML = '';
    
    // Ocultar panel
    const panel = document.getElementById('cfvBottomPanel');
    if (panel) panel.classList.remove('visible');
    
    console.log('✅ Estado reseteado');
}

async open(flashId) {
    console.log('🟢 ========== OPEN LLAMADO ==========');
    console.log('📌 Flash ID solicitado:', flashId);
    console.log('📌 Estado actual ANTES de resetear:', {
        isActive: this.isActive,
        isNavigating: this.isNavigating,
        currentUserIndex: this.currentUserIndex,
        currentFlashIndexInUser: this.currentFlashIndexInUser,
        currentFlashId: this.currentFlashId,
        totalUsers: this.userList.length,
        totalFlashes: this.allFlashes.length
    });

    if (this.isActive || this.isNavigating) {
        console.log('❌ ABORTADO: Viewer ya está activo o navegando');
        return;
    }

    try {
        // RESETEAR TODO ANTES DE EMPEZAR
        console.log('🔄 Llamando a resetState...');
        this.resetState();
        
        console.log('📌 Estado DESPUÉS de resetear:', {
            currentUserIndex: this.currentUserIndex,
            currentFlashIndexInUser: this.currentFlashIndexInUser,
            currentFlashId: this.currentFlashId,
            totalUsers: this.userList.length,
            totalFlashes: this.allFlashes.length
        });
        
        console.log('📡 Cargando todos los flashes...');
        await this.loadAllFlashes();
        
        console.log('📌 Flashes cargados:', {
            totalFlashes: this.allFlashes.length,
            totalUsers: this.userList.length,
            usuarios: this.userList
        });

        // ENCONTRAR USUARIO Y POSICIÓN DEL FLASH
        console.log('🔍 Buscando flash ID:', flashId);
        let foundUser = null;
        let foundFlashIndex = -1;
        
        for (const username of this.userList) {
            const userFlashes = this.flashesByUser[username];
            const flashIndex = userFlashes.findIndex(f => f.id == flashId);
            
            if (flashIndex !== -1) {
                foundUser = username;
                foundFlashIndex = flashIndex;
                this.currentUserIndex = this.userList.indexOf(username);
                this.currentFlashIndexInUser = flashIndex;
                console.log('✅ FLASH ENCONTRADO:', {
                    usuario: username,
                    flashIndex: flashIndex,
                    userIndex: this.currentUserIndex,
                    totalFlashesDelUsuario: userFlashes.length
                });
                break;
            }
        }

        if (!foundUser) {
            console.error('❌ Flash no encontrado en ningún usuario');
            return;
        }

        // ESTABLECER DATOS DEL FLASH ACTUAL
        this.currentFlashData = this.flashesByUser[foundUser][foundFlashIndex];
        this.currentFlashId = flashId;
        
        console.log('📌 Datos del flash actual:', {
            id: this.currentFlashData.id,
            username: this.currentFlashData.username,
            tipo: this.currentFlashData.tipo,
            currentUserIndex: this.currentUserIndex,
            currentFlashIndexInUser: this.currentFlashIndexInUser
        });

        this.isActive = true;
        this.viewerElement.classList.add('active');
        document.body.style.overflow = 'hidden';

        window.history.pushState({ flashViewer: true }, '');

        document.documentElement.style.overflow = 'hidden';
document.body.style.position = 'fixed';
document.body.style.width = '100%';

        console.log('🎨 Renderizando barras de progreso...');
        this.renderProgressBars();
        
        console.log('📱 Cargando contenido del flash...');
        this.loadFlashContent();
        
        console.log('▶️ Iniciando progreso...');
        this.startProgress();
        
        console.log('📊 Iniciando actualización de stats...');
        this.startStatsUpdate();

        console.log('👁️ Registrando vista...');
        await this.registerView(flashId);
        
        console.log('✅ ========== OPEN COMPLETADO ==========');

    } catch (error) {
        console.error('❌ ========== ERROR EN OPEN ==========');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        this.close();
    }
}

async loadAllFlashes() {
    try {
        const response = await fetch('/php/chain_flashes/obtener_flashes.php');
        const data = await response.json();

        if (data.success) {
            this.allFlashes = data.flashes || [];
            
            // ✅ AGRUPAR FLASHES POR USUARIO
            this.flashesByUser = {};
            this.allFlashes.forEach(flash => {
                const username = flash.username;
                if (!this.flashesByUser[username]) {
                    this.flashesByUser[username] = [];
                }
                this.flashesByUser[username].push(flash);
            });
            
            // ✅ CREAR LISTA ORDENADA DE USUARIOS
            this.userList = Object.keys(this.flashesByUser);
            
            console.log('📊 Flashes agrupados:', this.flashesByUser);
            console.log('👥 Usuarios con flashes:', this.userList);
        }
    } catch (error) {
        console.error('Error cargando Flashes:', error);
        this.allFlashes = [];
        this.flashesByUser = {};
        this.userList = [];
    }
}

renderProgressBars() {
    const container = document.getElementById('cfvProgressContainer');
    if (!container) return;

    // ✅ OBTENER SOLO LOS FLASHES DEL USUARIO ACTUAL
    const currentUsername = this.userList[this.currentUserIndex];
    const userFlashes = this.flashesByUser[currentUsername] || [];

    let html = '';
    userFlashes.forEach((flash, index) => {
        const fillWidth = index < this.currentFlashIndexInUser ? '100%' : 
                        index === this.currentFlashIndexInUser ? '0%' : '0%';
        
        html += `
            <div class="cfv-progress-bar">
                <div class="cfv-progress-fill" id="cfvProgress${index}" style="width: ${fillWidth}"></div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    console.log(`📊 Mostrando ${userFlashes.length} barras para @${currentUsername}`);
}

loadFlashContent() {
    const flash = this.currentFlashData;
    if (!flash) return;
    
    this.currentFlashDuration = 5000;
    
    // Header
    this.updateHeader(flash);

    // Media
    this.loadMedia(flash);

    // Stats
    this.updateStats(flash);

    // Reactions
    this.loadReactions(flash);

    // Owner Actions
    this.loadOwnerActions(flash);
    
    // ✅ AGREGAR ESTAS LÍNEAS AL FINAL:
    
    // Ocultar stats badge
    const statsBadge = document.getElementById('cfvStatsBadge');
    if (statsBadge) {
        statsBadge.style.display = 'none';
    }
}

updateHeader(flash) {
    const avatar = document.getElementById('cfvAvatar');
    const username = document.getElementById('cfvUsername');
    const timeAgo = document.getElementById('cfvTimeAgo');

    const goToUserFlashes = (e) => {
        e.stopPropagation();
        this.close();
        window.location.href = `/flash?user=${flash.username}`;
    };

    if (avatar) {
        avatar.style.cursor = 'pointer';
        avatar.onclick = goToUserFlashes;
        avatar.innerHTML = flash.avatar_url 
            ? `<img src="${flash.avatar_url}" alt="${flash.username}">`
            : this.generateInitials(flash.username);
    }

    if (username) {
        username.style.cursor = 'pointer';
        username.onclick = goToUserFlashes;
        username.innerHTML = `
            ${flash.display_name || flash.username}
            ${flash.verified ? '<span style="color: #6366f1;">✓</span>' : ''}
        `;
    }

    if (timeAgo) {
        const timeText = this.formatTimeAgo(flash.created_at);
        
        if (flash.es_anclado && flash.dias_anclado) {
            timeAgo.innerHTML = `
                ${timeText}
                <span class="cfv-anclado-inline">⛓️ ${flash.dias_anclado}d</span>
            `;
        } else {
            timeAgo.textContent = timeText;
        }
    }
}

    loadMedia(flash) {
        const container = document.getElementById('cfvMediaContainer');
        if (!container) return;

        container.innerHTML = '';

if (flash.tipo === 'video') {
    const video = document.createElement('video');
    video.src = flash.media_url;
    video.loop = false;
    video.playsInline = true;
    video.muted = flash.has_audio == 0;

    // Prevenir reproducción automática cuando el panel está abierto
    video.addEventListener('play', (e) => {
        const panel = document.getElementById('cfvBottomPanel');
        if (panel && panel.classList.contains('visible')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            video.pause();
        }
    }, true);
    
    // ✅ NUEVO: Detectar duración real del video
    video.addEventListener('loadedmetadata', () => {
        const videoDuration = Math.ceil(video.duration * 1000); // Convertir a ms
        this.currentFlashDuration = videoDuration;
        console.log(`📹 Video cargado: ${video.duration}s (${videoDuration}ms)`);
        
        // Reiniciar progreso con nueva duración
        this.stopProgress();
        this.startProgress();
    });
    
    // ✅ Cuando el video termina, avanzar
    video.addEventListener('ended', () => {
        console.log('🎬 Video terminado, avanzando...');
        this.navigateNext();
    });
    
    video.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
            video.play();
            this.resumeProgress();
        } else {
            video.pause();
            this.pauseProgress();
        }
    });

    container.appendChild(video);
    
    setTimeout(() => {
        video.play().catch(() => {});
    }, 100);
} else if (flash.tipo === 'imagen') {
            const img = document.createElement('img');
            img.src = flash.media_url;
            img.alt = 'Flash';
            container.appendChild(img);

        } else if (flash.tipo === 'texto') {
            const textDiv = document.createElement('div');
            textDiv.className = 'cfv-text-content';
            textDiv.textContent = flash.contenido || '';
            container.appendChild(textDiv);
        }
    }

updateStats(flash) {
    // ✅ Stats ahora solo se muestran en el panel inferior
    // No hacer nada aquí
}

loadReactions(flash) {
    // ✅ Reacciones ahora solo en el panel inferior
    // Ocultar contenedor lateral
    const container = document.getElementById('cfvReactions');
    if (container) {
        container.style.display = 'none';
    }
}

loadOwnerActions(flash) {
    // ✅ Acciones de dueño ahora solo en el panel inferior
    // Ocultar contenedor del fondo
    const container = document.getElementById('cfvOwnerActions');
    if (container) {
        container.style.display = 'none';
    }
}

startProgress() {
    this.progressValue = 0;
    
    if (this.progressInterval) {
        clearInterval(this.progressInterval);
    }
    
    this.progressInterval = setInterval(() => {
        this.progressValue += (100 / (this.currentFlashDuration / 100)); // ✅ Usar duración dinámica

        const fill = document.getElementById(`cfvProgress${this.currentFlashIndexInUser}`);
        if (fill) {
            fill.style.width = `${this.progressValue}%`;
        }

        if (this.progressValue >= 100) {
            this.navigateNext();
        }
    }, 100);
}

pauseProgress() {
    if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null; // ✅ Limpiar referencia
    }
}

resumeProgress() {
    if (!this.progressInterval) { // ✅ Solo reiniciar si está pausado
        this.startProgress();
    }
}

    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    startStatsUpdate() {
        this.statsUpdateInterval = setInterval(async () => {
            if (this.isActive && this.currentFlashId) {
                await this.refreshStats();
            }
        }, 3000);
    }

    stopStatsUpdate() {
        if (this.statsUpdateInterval) {
            clearInterval(this.statsUpdateInterval);
            this.statsUpdateInterval = null;
        }
    }

    async refreshStats() {
        try {
            const response = await fetch(`/php/chain_flashes/obtener_estadisticas_flash.php?flash_id=${this.currentFlashId}`);
            const data = await response.json();

            if (data.success && data.estadisticas) {
                this.currentFlashData.vistas = data.estadisticas.vistas;
                this.currentFlashData.tokens_ganados_vistas = data.estadisticas.tokens_ganados_vistas;
                this.currentFlashData.tokens_ganados_reacciones = data.estadisticas.tokens_ganados_reacciones;
                
                this.updateStats(this.currentFlashData);
            }
        } catch (error) {
            console.error('Error actualizando stats:', error);
        }
    }

async navigatePrev() {
    if (this.isNavigating) return;

    this.isNavigating = true;
    this.stopProgress();
    
    // ✅ OCULTAR PANEL AL NAVEGAR
    this.hideBottomPanel();

    const currentUsername = this.userList[this.currentUserIndex];
    const userFlashes = this.flashesByUser[currentUsername];

    // SI HAY FLASH ANTERIOR EN EL MISMO USUARIO
    if (this.currentFlashIndexInUser > 0) {
        this.currentFlashIndexInUser--;
        this.currentFlashData = userFlashes[this.currentFlashIndexInUser];
        this.currentFlashId = this.currentFlashData.id;

        this.renderProgressBars();
        this.loadFlashContent();
        this.startProgress();

        await this.registerView(this.currentFlashId);
    } 
    // SI NO HAY MÁS EN ESTE USUARIO, IR AL USUARIO ANTERIOR
    else if (this.currentUserIndex > 0) {
        this.currentUserIndex--;
        const prevUsername = this.userList[this.currentUserIndex];
        const prevUserFlashes = this.flashesByUser[prevUsername];
        
        this.currentFlashIndexInUser = prevUserFlashes.length - 1;
        this.currentFlashData = prevUserFlashes[this.currentFlashIndexInUser];
        this.currentFlashId = this.currentFlashData.id;

        this.renderProgressBars();
        this.loadFlashContent();
        this.startProgress();

        await this.registerView(this.currentFlashId);
        
        console.log(`👈 Cambió a usuario anterior: @${prevUsername}`);
    }

    setTimeout(() => {
        this.isNavigating = false;
    }, 300);
}

async navigateNext() {
    if (this.isNavigating) return;

    this.isNavigating = true;
    this.stopProgress();
    
    // ✅ OCULTAR PANEL AL NAVEGAR
    this.hideBottomPanel();

    const currentUsername = this.userList[this.currentUserIndex];
    const userFlashes = this.flashesByUser[currentUsername];

    // SI HAY FLASH SIGUIENTE EN EL MISMO USUARIO
    if (this.currentFlashIndexInUser < userFlashes.length - 1) {
        this.currentFlashIndexInUser++;
        this.currentFlashData = userFlashes[this.currentFlashIndexInUser];
        this.currentFlashId = this.currentFlashData.id;

        this.renderProgressBars();
        this.loadFlashContent();
        this.startProgress();

        await this.registerView(this.currentFlashId);
    } 
    // SI NO HAY MÁS EN ESTE USUARIO, IR AL SIGUIENTE USUARIO
    else if (this.currentUserIndex < this.userList.length - 1) {
        this.currentUserIndex++;
        const nextUsername = this.userList[this.currentUserIndex];
        const nextUserFlashes = this.flashesByUser[nextUsername];
        
        this.currentFlashIndexInUser = 0;
        this.currentFlashData = nextUserFlashes[0];
        this.currentFlashId = this.currentFlashData.id;

        this.renderProgressBars();
        this.loadFlashContent();
        this.startProgress();

        await this.registerView(this.currentFlashId);
        
        console.log(`👉 Cambió a siguiente usuario: @${nextUsername}`);
    } 
    // SI ES EL ÚLTIMO USUARIO Y ÚLTIMO FLASH, CERRAR
    else {
        this.close();
        return;
    }

    setTimeout(() => {
        this.isNavigating = false;
    }, 300);
}

async navigateToPrevUser() {
    if (this.isNavigating || this.currentUserIndex <= 0) return;

    this.isNavigating = true;
    this.stopProgress();
    this.hideBottomPanel();

    // Cambiar al usuario anterior
    this.currentUserIndex--;
    const prevUsername = this.userList[this.currentUserIndex];
    const prevUserFlashes = this.flashesByUser[prevUsername];

    // Ir al primer flash del usuario anterior
    this.currentFlashIndexInUser = 0;
    this.currentFlashData = prevUserFlashes[0];
    this.currentFlashId = this.currentFlashData.id;

    this.renderProgressBars();
    this.loadFlashContent();
    this.startProgress();

    await this.registerView(this.currentFlashId);

    console.log(`👈 SWIPE: Cambió a usuario anterior: @${prevUsername}`);

    setTimeout(() => {
        this.isNavigating = false;
    }, 300);
}

async navigateToNextUser() {
    if (this.isNavigating || this.currentUserIndex >= this.userList.length - 1) return;

    this.isNavigating = true;
    this.stopProgress();
 this.hideBottomPanel();

    // Cambiar al siguiente usuario
    this.currentUserIndex++;
    const nextUsername = this.userList[this.currentUserIndex];
    const nextUserFlashes = this.flashesByUser[nextUsername];

    // Ir al primer flash del siguiente usuario
    this.currentFlashIndexInUser = 0;
    this.currentFlashData = nextUserFlashes[0];
    this.currentFlashId = this.currentFlashData.id;

    this.renderProgressBars();
    this.loadFlashContent();
    this.startProgress();

    await this.registerView(this.currentFlashId);

    console.log(`👉 SWIPE: Cambió a siguiente usuario: @${nextUsername}`);

    setTimeout(() => {
        this.isNavigating = false;
    }, 300);
}

    async registerView(flashId) {
        try {
            await fetch('/php/chain_flashes/ver_flash.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ flash_id: flashId })
            });
        } catch (error) {
            console.error('Error registrando vista:', error);
        }
    }

    async react(emoji) {
        try {
            const response = await fetch('/php/chain_flashes/reaccionar_flash.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    flash_id: this.currentFlashId,
                    emoji: emoji
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification(data.message, 'success');
                
                // Actualizar reacción en el estado actual
                this.currentFlashData.mi_reaccion = emoji;
                
                // Recargar reacciones visuales
                this.loadReactions(this.currentFlashData);
                
                // Actualizar stats
                await this.refreshStats();
                
            } else {
                this.showNotification(data.message, 'error');
            }

        } catch (error) {
            console.error('Error reaccionando:', error);
            this.showNotification('Error al procesar reacción', 'error');
        }
    }

async reactFromPanel(emoji, event) {
    // ✅ Prevenir que el click cierre el panel o cambie de flash
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    // ✅ NUEVO: Obtener el botón clickeado y mostrar spinner
    const btn = event?.target?.closest('.panel-reaction-btn');
    if (!btn) return;
    
    // Guardar contenido original
    const originalContent = btn.innerHTML;
    
    // Deshabilitar y mostrar spinner
    btn.disabled = true;
    btn.innerHTML = `
        <div class="reaction-spinner"></div>
    `;
    
    try {
        // Llamar a la función react original
        await this.react(emoji);
        
        // Recargar el panel para mostrar la nueva reacción
        setTimeout(() => {
            this.loadPanelReactions();
        }, 500);
        
    } catch (error) {
        console.error('Error en reacción:', error);
        // Restaurar botón en caso de error
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

async anclarFlash() {
    // ✅ ESPERAR A QUE EL MODAL ESTÉ DISPONIBLE
    const waitForModal = () => {
        return new Promise((resolve, reject) => {
            if (window.anclarModal) {
                resolve();
                return;
            }
            
            let attempts = 0;
            const maxAttempts = 50; // 5 segundos máximo
            
            const interval = setInterval(() => {
                attempts++;
                
                if (window.anclarModal) {
                    clearInterval(interval);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error('Modal no disponible después de 5 segundos'));
                }
            }, 100);
        });
    };
    
    try {
        await waitForModal();
        
        window.anclarModal.open(this.currentFlashId, () => {
            // Callback cuando el anclaje es exitoso
            console.log('✅ Flash anclado exitosamente');
            
            // Actualizar estado local
            this.currentFlashData.es_anclado = 1;
            
            // Recargar contenido del viewer
            this.loadFlashContent();
            
            // Recargar barra de flashes si existe
            if (window.chainFlashesBar) {
                setTimeout(() => {
                    window.chainFlashesBar.reload();
                }, 500);
            }
        });
        
    } catch (error) {
        console.error('❌ Error abriendo modal:', error);
        this.showNotification('Error: Modal no disponible. Recarga la página.', 'error');
    }
}


async reAnclarFlash() {
    const waitForModal = () => {
        return new Promise((resolve, reject) => {
            if (window.anclarModal) {
                resolve();
                return;
            }
            
            let attempts = 0;
            const maxAttempts = 50;
            
            const interval = setInterval(() => {
                attempts++;
                
                if (window.anclarModal) {
                    clearInterval(interval);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error('Modal no disponible'));
                }
            }, 100);
        });
    };
    
    try {
        await waitForModal();
        
        // ✅ Pasar días restantes al modal para calcular el máximo
        const diasRestantes = parseInt(this.currentFlashData.dias_anclado) || 0;
        
        window.anclarModal.open(this.currentFlashId, () => {
            console.log('✅ Flash re-anclado exitosamente');
            
            // Cerrar viewer
            this.close();
            
            // Recargar barra de flashes
            if (window.chainFlashesBar) {
                setTimeout(() => {
                    window.chainFlashesBar.reload();
                }, 500);
            }
        }, true, diasRestantes); // ✅ Pasar flag de re-anclaje y días restantes
        
    } catch (error) {
        console.error('❌ Error abriendo modal:', error);
        this.showNotification('Error: Modal no disponible. Recarga la página.', 'error');
    }
}

async eliminarFlash() {
    window.deleteFlashModal.open(this.currentFlashId, () => {
        this.close();
        if (window.chainFlashesBar) {
            setTimeout(() => window.chainFlashesBar.reload(), 500);
        }
    });
}

async close() {
    console.log('🔴 CLOSE llamado');
    
    const video = this.viewerElement.querySelector('video');
    if (video) {
        video.pause();
    }

    // Marcar flashes como vistos
    if (this.currentFlashData && this.currentFlashData.username) {
        const currentUsername = this.currentFlashData.username;
        const myUsername = this.getCurrentUser();
        
        if (currentUsername !== myUsername) {
            await this.markUserFlashesAsViewed(currentUsername);
        }
    }

    this.isActive = false;
    this.viewerElement.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';

    // ✅ USAR EL MÉTODO DE RESETEO
    this.resetState();
    
    console.log('🔄 Actualizando anillos silenciosamente...');
    if (window.chainFlashesBar && typeof window.chainFlashesBar.updateRingsOnly === 'function') {
        setTimeout(() => {
            window.chainFlashesBar.updateRingsOnly();
        }, 800);
    }
    
    console.log('✅ Close completado');
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

    generateInitials(username) {
        if (!username) return 'U';
        return username.substring(0, 2).toUpperCase();
    }

    formatTimeAgo(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);

            if (diffMinutes < 1) return 'Ahora';
            if (diffMinutes < 60) return `${diffMinutes}m`;
            if (diffHours < 24) return `${diffHours}h`;
            return `${Math.floor(diffHours / 24)}d`;
        } catch (error) {
            return '';
        }
    }

    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(message);
        }
    }

showBottomPanel() {
    const panel = document.getElementById('cfvBottomPanel');
    if (!panel) return;

    panel.classList.add('visible');
    
    // ✅ NUEVO: Si es visitante, expandir automáticamente
    const currentUser = this.getCurrentUser();
    const isOwner = this.currentFlashData.username === currentUser;
    
    if (!isOwner) {
        panel.classList.add('expanded-visitor');
    }
    
    this.pauseProgress();
    
    // Pausar video en el contenedor de media
    const video = document.querySelector('#cfvMediaContainer video');
    if (video && !video.paused) {
        video.pause();
        video.dataset.wasPausedByPanel = 'true';
    }

    this.loadPanelContent();
}

hideBottomPanel() {
    const panel = document.getElementById('cfvBottomPanel');
    if (!panel) return;

    panel.classList.remove('visible');
    panel.classList.remove('expanded');
    panel.classList.remove('expanded-visitor'); // ✅ NUEVO
    this.resumeProgress();
    
    // RESETEAR CONTENIDO DEL PANEL
    const viewersList = document.getElementById('panelViewersList');
    if (viewersList) {
        viewersList.style.display = 'none';
    }
    
    const panelStats = document.getElementById('panelStats');
    if (panelStats) {
        panelStats.style.display = 'flex';
    }
    
    // Reanudar video si fue pausado por el panel
    const video = this.viewerElement.querySelector('video');
    if (video && video.dataset.wasPausedByPanel === 'true') {
        video.play();
        delete video.dataset.wasPausedByPanel;
    }
}

togglePanelExpand() {
    const panel = document.getElementById('cfvBottomPanel');
    if (!panel) return;
    
    panel.classList.toggle('expanded');
    console.log('📐 Panel expandido:', panel.classList.contains('expanded'));
}

async loadPanelContent() {
    const currentUser = this.getCurrentUser();
    const isOwner = this.currentFlashData.username === currentUser;

    // Actualizar estadísticas
    document.getElementById('panelViews').textContent = this.currentFlashData.vistas || 0;
    const totalTokens = parseFloat(this.currentFlashData.tokens_ganados_vistas || 0) + 
                       parseFloat(this.currentFlashData.tokens_ganados_reacciones || 0);
    document.getElementById('panelTokens').textContent = `${totalTokens.toFixed(2)} CFT`;

    const viewsItem = document.getElementById('panelViewsItem');
    const tokensItem = document.getElementById('panelTokensItem');
    
    if (isOwner) {
        viewsItem.classList.add('stat-clickable');
        tokensItem.classList.add('stat-clickable');
        
        // ✅ Click expande Y muestra viewers
        viewsItem.onclick = (e) => {
            e.stopPropagation();
            console.log('🔵 Click en viewsItem (owner)');
            const panel = document.getElementById('cfvBottomPanel');
            if (!panel.classList.contains('expanded')) {
                panel.classList.add('expanded');
            }
            this.showViewersList();
        };
        tokensItem.onclick = (e) => {
            e.stopPropagation();
            console.log('🔵 Click en tokensItem (owner)');
            const panel = document.getElementById('cfvBottomPanel');
            if (!panel.classList.contains('expanded')) {
                panel.classList.add('expanded');
            }
            this.showViewersList();
        };
        
        document.getElementById('panelReactionsList').classList.remove('visible');
        document.getElementById('panelUserReactions').classList.remove('visible');
        this.loadPanelOwnerActions();
        
} else {
    // ✅ Visitante: panel ya está expandido, no necesita click
    viewsItem.classList.remove('stat-clickable');
    tokensItem.classList.remove('stat-clickable');
    viewsItem.onclick = null;
    tokensItem.onclick = null;
    
    this.loadPanelReactions();
    document.getElementById('panelUserReactions').classList.add('visible');
    document.getElementById('panelReactionsList').classList.remove('visible');
    document.getElementById('panelOwnerActions').classList.remove('visible');
}
}

async loadReactionsList() {
    try {
        const reacciones = await window.flashStats.getFlashReactions(this.currentFlashId);
        
        const container = document.getElementById('panelReactionsList');
        if (!container) return;

        container.innerHTML = window.flashStats.renderReactionsList(reacciones);
        
    } catch (error) {
        console.error('Error cargando reacciones:', error);
        const container = document.getElementById('panelReactionsList');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Error cargando reacciones</p>';
        }
    }
}

loadPanelReactions() {
    const container = document.getElementById('panelUserReactions');
    if (!container) return;

    const REACCIONES = {
        '❤️': 0.5,
        '🔥': 1.0,
        '💎': 5.0,
        '👏': 0.5,
        '⚡': 2.0,
        '🚀': 3.0
    };

    const miReaccion = this.currentFlashData.mi_reaccion;

    let html = '';
    Object.entries(REACCIONES).forEach(([emoji, costo]) => {
        const reacted = miReaccion === emoji;
        html += `
            <button class="panel-reaction-btn ${reacted ? 'reacted' : ''}" 
                    onclick="event.stopPropagation(); window.flashViewer.reactFromPanel('${emoji}', event)"
                    ${reacted ? 'disabled' : ''}>
                <span class="panel-reaction-emoji">${emoji}</span>
                <span class="panel-reaction-cost">${costo} CFT</span>
            </button>
        `;
    });

    container.innerHTML = html;
}

loadPanelOwnerActions() {
    const container = document.getElementById('panelOwnerActions');
    if (!container) return;

    container.classList.add('visible');

    let html = '';
    if (!this.currentFlashData.es_anclado) {
        html += `
            <button class="panel-action-btn primary" onclick="window.flashViewer.anclarFlash()">
                ⛓️ Anclar Flash
            </button>
            <button class="panel-action-btn danger" onclick="window.flashViewer.eliminarFlash()">
                🗑️ Eliminar Flash
            </button>
        `;
    } else {
        // ✅ NUEVO: Opciones para flashes ya anclados
        html += `
            <button class="panel-action-btn primary" onclick="window.flashViewer.reAnclarFlash()">
                ⛓️ Volver a anclar
            </button>
            <button class="panel-action-btn danger" onclick="window.flashViewer.eliminarFlash()">
                🗑️ Eliminar Flash
            </button>
        `;
    }

    container.innerHTML = html;
}

async showViewersList() {
    // ✅ Verificar si es el dueño
    const currentUser = this.getCurrentUser();
    const isOwner = this.currentFlashData.username === currentUser;
    
    if (!isOwner) {
        this.showNotification('Solo el creador puede ver esta información', 'error');
        return;
    }
    
    try {
        // Ocultar contenido principal del panel
        document.getElementById('panelStats').style.display = 'none';
        document.getElementById('panelReactionsList').classList.remove('visible');
        document.getElementById('panelUserReactions').classList.remove('visible');
        document.getElementById('panelOwnerActions').classList.remove('visible');
        
        // Mostrar lista de viewers
        const viewersList = document.getElementById('panelViewersList');
        viewersList.style.display = 'block';
        
        // Mostrar loading
        const content = document.getElementById('viewersContent');
        content.innerHTML = '<div class="viewers-empty">Cargando vistas...</div>';
        
        // Cargar datos
        const response = await fetch(`/php/chain_flashes/obtener_vistas_flash.php?flash_id=${this.currentFlashId}`);
        const data = await response.json();
        
        if (!data.success) {
            content.innerHTML = '<div class="viewers-empty">Error cargando vistas</div>';
            return;
        }
        
        if (!data.viewers || data.viewers.length === 0) {
            content.innerHTML = '<div class="viewers-empty">Aún no hay vistas</div>';
            return;
        }
        
        // Renderizar viewers
        this.renderViewersList(data.viewers);
        
    } catch (error) {
        console.error('Error mostrando lista de viewers:', error);
        const content = document.getElementById('viewersContent');
        if (content) {
            content.innerHTML = '<div class="viewers-empty">Error cargando vistas</div>';
        }
    }
}

renderViewersList(viewers) {
    const content = document.getElementById('viewersContent');
    if (!content) return;
    
    let html = '';
    
    viewers.forEach(viewer => {
        const initials = this.generateInitials(viewer.username);
        const avatarHtml = viewer.avatar_url 
            ? `<img src="${viewer.avatar_url}" alt="${viewer.username}">`
            : initials;
        
        const displayName = viewer.display_name || viewer.username;
        const verifiedBadge = viewer.verified ? '<span class="verified">✓</span>' : '';
        
        const reactionHtml = viewer.reaccion 
            ? `
                <div class="viewer-reaction">
                    <span class="viewer-reaction-emoji">${viewer.reaccion}</span>
                    <span class="viewer-reaction-amount">${viewer.monto_reaccion.toFixed(1)} CFT</span>
                </div>
              `
            : '<span class="viewer-no-reaction">Sin reacción</span>';
        
        html += `
            <div class="viewer-item">
                <div class="viewer-avatar">${avatarHtml}</div>
                <div class="viewer-info">
                    <div class="viewer-name">
                        ${displayName}
                        ${verifiedBadge}
                    </div>
                    <div class="viewer-time">${viewer.tiempo_visto}</div>
                </div>
                ${reactionHtml}
            </div>
        `;
    });
    
    content.innerHTML = html;
}

// ✅ NUEVO MÉTODO: Marcar flashes de un usuario como vistos
async markUserFlashesAsViewed(username) {
    try {
        const response = await fetch('/php/chain_flashes/marcar_vistos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Flashes de @${username} procesados (${data.views_registered} vistas)`);
        } else {
            console.warn(`⚠️ No se pudieron marcar flashes: ${data.message}`);
        }

    } catch (error) {
        console.error('Error marcando flashes como vistos:', error);
    }
}

hideViewersList() {
    // Ocultar lista de viewers
    document.getElementById('panelViewersList').style.display = 'none';
    
    // Mostrar contenido original
    document.getElementById('panelStats').style.display = 'flex';
    
    // ✅ NUEVO: Comprimir el panel
    const panel = document.getElementById('cfvBottomPanel');
    if (panel) {
        panel.classList.remove('expanded');
    }
    
    // Recargar contenido del panel según permisos
    this.loadPanelContent();
}

}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.flashViewer = new ChainFlashViewer();
    });
} else {
    window.flashViewer = new ChainFlashViewer();
}

console.log('✅ flash-viewer.js cargado');