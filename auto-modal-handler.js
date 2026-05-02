/**
 * Auto Modal Handler v2.3
 * Sistema robusto para cerrar modales/fullscreens con gesto hacia atrás
 * FIX: Limpieza correcta de estilos al cerrar para permitir reapertura
 */

(function() {
    'use strict';

    // Evitar múltiples instancias
    if (window._autoModalHandlerV2Loaded) {
        console.log('⚠️ AutoModalHandler ya cargado');
        return;
    }
    window._autoModalHandlerV2Loaded = true;

    console.log('🚀 Inicializando Auto Modal Handler v2.3...');

    // ============================================
    // ESTADO GLOBAL
    // ============================================
    
    const state = {
        modalStack: [],
        historyDepth: 0,
        isProcessingBack: false,
        keyboardOpen: false,
        lastFocusedInput: null,
        closedByHandler: new WeakSet() // Track de modales cerrados por este handler
    };

    // ============================================
    // SELECTORES DE MODALES - ChainFeed
    // ============================================
    
    const MODAL_SELECTORS = [
        '#commentsModal.active',
        '#shareModal.active',
        '#participateModal.active',
        '#submissionsModal.active',
        '#sellModal.active',
        '#transactionsModal.active',
        '#flashCreatorModal.active',
        '#anclarFlashModal.active',
        '#rejectModal[style*="opacity: 1"]',
        '#approveModal[style*="opacity: 1"]',
        '#fullscreen-post-viewer.active',
        '#chainFlashViewer.active',
        '.fsv-container.active',
        '.cfv-container.active',
        '#panelViewersList.active',
        '#panelViewersList[style*="display: block"]',
        '#panelViewersList[style*="display: flex"]',
        '.comments-modal.active',
        '.share-modal.active',
        '.participate-modal.active',
        '.submissions-modal.active',
        '.sell-modal.active',
        '.transactions-modal.active',
        '.flash-creator-modal.active',
        '.anclar-modal.active',
        '.custom-modal.active',
        '[class*="modal"].active',
        '[class*="fullscreen"].active',
        '[class*="viewer"].active:not([class*="viewer-"])',
        '.overlay.active',
        '.popup.active',
        '#wallet-fullscreen-viewer.active',
'.wfv-container.active',
'#compra-directa-modal.show',
'.compra-directa-modal-overlay.show',
'#fondo-moal-noti',
'.fullscreen-post-overlay',
'.fullscreen-post-overlay[style*="display: flex"]',
'.chain-modal-overlay',
'.chain-modal-overlay[style*="display: flex"]',
    ];

    // Estilos que debemos limpiar después de cerrar
    const STYLES_TO_CLEAN = ['visibility', 'opacity', 'pointerEvents', 'display', 'transform'];

    // ============================================
    // FUNCIONES DE DETECCIÓN
    // ============================================

    function findVisibleModals() {
        const visibleModals = [];
        const seen = new Set();
        
        for (const selector of MODAL_SELECTORS) {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (!seen.has(el) && isElementVisible(el)) {
                        seen.add(el);
                        visibleModals.push(el);
                    }
                });
            } catch (e) {}
        }
        
        document.querySelectorAll('.active').forEach(el => {
            if (seen.has(el)) return;
            
            const style = window.getComputedStyle(el);
            const zIndex = parseInt(style.zIndex) || 0;
            const position = style.position;
            
            if (
                zIndex >= 1000 &&
                position === 'fixed' &&
                el.offsetWidth > window.innerWidth * 0.3 &&
                el.offsetHeight > window.innerHeight * 0.3 &&
                isElementVisible(el)
            ) {
                seen.add(el);
                visibleModals.push(el);
            }
        });
        
        visibleModals.sort((a, b) => {
            const zA = parseInt(window.getComputedStyle(a).zIndex) || 0;
            const zB = parseInt(window.getComputedStyle(b).zIndex) || 0;
            return zA - zB;
        });
        
        return visibleModals;
    }

    function isElementVisible(el) {
        if (!el) return false;
        if (!document.body.contains(el)) return false;
        
        const style = window.getComputedStyle(el);
        
        if (style.display === 'none') return false;
        if (style.visibility === 'hidden') return false;
        if (parseFloat(style.opacity) < 0.1) return false;
        if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;
        
        return true;
    }

    function getTopModal() {
        state.modalStack = state.modalStack.filter(m => isElementVisible(m.element));
        
        if (state.modalStack.length > 0) {
            return state.modalStack[state.modalStack.length - 1].element;
        }
        
        const modals = findVisibleModals();
        return modals.length > 0 ? modals[modals.length - 1] : null;
    }
    
    function generateModalId(element) {
        if (element.id) return element.id;
        
        const classes = Array.from(element.classList);
        const significantClass = classes.find(c => 
            c.includes('modal') || c.includes('fullscreen') || 
            c.includes('viewer') || c.includes('overlay') || 
            c.includes('cfv') || c.includes('fsv') || c.includes('pfsv')
        );
        
        if (significantClass) {
            return `${significantClass}_${Date.now()}`;
        }
        
        return `modal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    }

    // ============================================
    // FUNCIONES DE CIERRE - CORREGIDAS
    // ============================================

    function closeModal(modal) {
        if (!modal) return false;
        
        const modalId = modal.id || modal.className?.split(' ')[0] || 'unknown';
        console.log('🔒 Cerrando modal:', modalId);
        
        // Marcar que este handler está cerrando el modal
        state.closedByHandler.add(modal);
        
        // 1. Intentar usar función de cierre existente
        const closeFunction = findCloseFunction(modal);
        if (closeFunction) {
            console.log('   → Usando función de cierre nativa');
            try {
                closeFunction();
                
                // Programar limpieza de estilos inline
                scheduleStyleCleanup(modal);
                return true;
            } catch (e) {
                console.error('   ❌ Error en función nativa:', e);
            }
        }
        
        // 2. Buscar y clickear botón de cerrar
        const closeButton = findCloseButton(modal);
        if (closeButton) {
            console.log('   → Clickeando botón de cerrar');
            closeButton.click();
            scheduleStyleCleanup(modal);
            return true;
        }
        
        // 3. Fallback: solo quitar clase active
        console.log('   → Usando fallback (quitar .active)');
        forceCloseModal(modal);
        
        return true;
    }
    
    /**
     * Fuerza el cierre - CORREGIDO: No aplica estilos inline persistentes
     */
    function forceCloseModal(modal) {
        // Solo quitar la clase active
        modal.classList.remove('active');
        
        // Para modales que usan display, ocultarlos temporalmente
        // pero programar limpieza
        const computedStyle = window.getComputedStyle(modal);
        
        // Si después de quitar .active sigue visible, necesitamos ocultarlo
        // pero de forma que se pueda reabrir
        setTimeout(() => {
            if (isElementVisible(modal) && !modal.classList.contains('active')) {
                // El CSS debería manejarlo, pero si no...
                modal.style.display = 'none';
                
                // Limpiar después para permitir reapertura
                scheduleStyleCleanup(modal);
            }
        }, 50);
        
        cleanupModal(modal);
    }

    /**
     * Programa la limpieza de estilos inline para permitir reapertura
     */
    function scheduleStyleCleanup(modal) {
        // Limpiar después de que la transición termine
        setTimeout(() => {
            cleanInlineStyles(modal);
        }, 350); // Suficiente para transiciones CSS típicas
    }

    /**
     * Limpia estilos inline que podrían bloquear la reapertura
     */
    function cleanInlineStyles(modal) {
        if (!modal) return;
        
        // Solo limpiar si el modal NO está activo
        if (modal.classList.contains('active')) return;
        
        console.log('🧹 Limpiando estilos inline de:', modal.id || modal.className?.split(' ')[0]);
        
        // Limpiar estilos que podrían interferir con la reapertura
        STYLES_TO_CLEAN.forEach(prop => {
            modal.style[prop] = '';
        });
        
        // Remover del tracking
        state.closedByHandler.delete(modal);
    }

    /**
     * Busca método de cierre en un objeto global
     * Busca: close, closeViewer, closeModal, hide, exit, destroy
     */
    function findCloseMethod(obj) {
        if (!obj || typeof obj !== 'object') return null;
        
        const closeMethodNames = [
            'close', 'closeViewer', 'closeModal', 'hide', 'exit', 
            'destroy', 'dismiss', 'remove', 'deactivate'
        ];
        
        for (const name of closeMethodNames) {
            if (typeof obj[name] === 'function') {
                return () => obj[name]();
            }
        }
        return null;
    }

    /**
     * Auto-detecta objetos globales relacionados con un modal
     */
    function findGlobalObject(modal) {
        const id = modal.id || '';
        const classes = Array.from(modal.classList);
        
        // Patrones para buscar en window
        const searchTerms = [id, ...classes]
            .filter(Boolean)
            .map(s => s.toLowerCase().replace(/[-_]/g, ''));
        
        // Buscar objetos globales que coincidan
        for (const key of Object.keys(window)) {
            const keyLower = key.toLowerCase();
            
            for (const term of searchTerms) {
                if (term.length > 3 && (
                    keyLower.includes(term) || 
                    term.includes(keyLower)
                )) {
                    const obj = window[key];
                    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                        const closeMethod = findCloseMethod(obj);
                        if (closeMethod) {
                            console.log(`   🔍 Auto-detectado: window.${key}`);
                            return closeMethod;
                        }
                    }
                }
            }
        }
        
        return null;
    }

    function findCloseFunction(modal) {
        const id = modal.id;
        const classList = modal.classList;
        
        // 1. Funciones conocidas explícitas (prioridad alta)
        const closeFunctions = {
            'commentsModal': () => window.closeComments?.(),
            'shareModal': () => window.closeShareModal?.(),
            'participateModal': () => window.closeParticipateModal?.(),
            'submissionsModal': () => window.closeSubmissionsModal?.(),
            'sellModal': () => window.closeSellModal?.(),
            'transactionsModal': () => window.closeTransactionsModal?.(),
            'flashCreatorModal': () => window.flashCreator?.close?.(),
            'anclarFlashModal': () => window.closeAnclarModal?.(),
            'rejectModal': () => window.closeRejectModal?.(),
            'approveModal': () => window.closeApproveModal?.(),
            'panelViewersList': () => window.closeViewersList?.(),
            'likesModal': () => window.closeLikesModal?.(),
            'wallet-fullscreen-viewer': () => window.walletFullscreenViewer?.close?.() || window.closeWalletViewer?.(),
'compra-directa-modal': () => window.closeCompraDirectaModal?.(),
            'fondo-moal-noti': () => window.closeFullscreenPost?.(),
        };
        
        if (id && closeFunctions[id]) {
            const fn = closeFunctions[id];
            // Verificar que la función existe antes de retornarla
            if (fn()) return fn; // Ejecutar y ver si no falla
        }
        
        // 2. Objetos conocidos con sus métodos correctos
        if (classList.contains('fsv-container') || id === 'fullscreen-post-viewer') {
            if (window.fullscreenViewer?.closeViewer) {
                return () => window.fullscreenViewer.closeViewer();
            }
        }
        
if (classList.contains('cfv-container') || id === 'chainFlashViewer') {
    // ✅ NUEVO: Priorizar .close() que es el método correcto del flash-viewer.js
    if (window.flashViewer?.close) {
        return () => window.flashViewer.close();
    }
    if (window.chainFlashViewer?.close) {
        return () => window.chainFlashViewer.close();
    }
    // Fallback para otros viewers que usen closeViewer()
    if (window.chainFlashViewer?.closeViewer) {
        return () => window.chainFlashViewer.closeViewer();
    }
    if (window.flashViewer?.closeViewer) {
        return () => window.flashViewer.closeViewer();
    }
}
        
        if (classList.contains('wfv-container') || id === 'wallet-fullscreen-viewer') {
    if (window.walletFullscreenViewer?.close) {
        return () => window.walletFullscreenViewer.close();
    }
    if (typeof window.closeWalletViewer === 'function') {
        return () => window.closeWalletViewer();
    }
}

// Fullscreen post overlay
if (classList.contains('fullscreen-post-overlay') || id === 'fondo-moal-noti') {
    if (typeof window.closeFullscreenPost === 'function') {
        return () => window.closeFullscreenPost();
    }
}

// Chain modal overlay
if (classList.contains('chain-modal-overlay')) {
    if (typeof window.cerrarModalChain === 'function') {
        return () => window.cerrarModalChain();
    }
}

        // 3. Auto-detectar buscando objetos globales relacionados
        const autoDetected = findGlobalObject(modal);
        if (autoDetected) {
            return autoDetected;
        }
        
        // 4. Buscar funciones globales tipo closeXxx
        if (id) {
            // Convertir "myModal" a "closeMyModal"
            const baseName = id.replace(/Modal$/i, '').replace(/[-_]/g, '');
            const possibleNames = [
                `close${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`,
                `close${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Modal`,
                `hide${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`,
                `close${id}`,
                `hide${id}`
            ];
            
            for (const name of possibleNames) {
                if (typeof window[name] === 'function') {
                    console.log(`   🔍 Auto-detectado función: window.${name}`);
                    return () => window[name]();
                }
            }
        }
        
        return null;
    }

    function findCloseButton(modal) {
        const selectors = [
            '.close-comments',
            '.close-share',
            '.close-participate',
            '.close-submissions',
            '.close-sell',
            '.close-transactions',
            '.flash-creator-close',
            '.cfv-close-btn',
            '.fsv-close-btn',
            '.pfsv-close-btn',
            '.viewers-back-btn',
            '[class*="close-btn"]',
            '[class*="close"]',
            '[class*="cerrar"]',
            'button[aria-label*="close"]',
            'button[aria-label*="cerrar"]',
            '[data-dismiss="modal"]',
            '.modal-close',
            '.btn-close',
            '.wfv-close-btn',
'.compra-directa-modal-close',
'.equisfullnoti',
'button[onclick*="closeFullscreenPost"]',
'button[onclick*="cerrarModalChain"]',
        ];
        
        for (const selector of selectors) {
            const btn = modal.querySelector(selector);
            if (btn && isElementVisible(btn)) {
                return btn;
            }
        }
        
        return null;
    }

    function cleanupModal(modal) {
        modal.querySelectorAll('video').forEach(v => {
            v.pause();
            v.currentTime = 0;
        });
        
        modal.querySelectorAll('audio').forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
        
        setTimeout(() => {
            if (findVisibleModals().length === 0) {
                document.body.style.overflow = '';
                document.body.classList.remove('modal-open');
            }
        }, 50);
    }

    // ============================================
    // OBSERVADOR DE REAPERTURA - NUEVO
    // ============================================

    /**
     * Observa cuando un modal se reabre y limpia estilos residuales
     */
    function setupReopenObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const el = mutation.target;
                    
                    // Si el elemento acaba de recibir .active
                    if (el.classList.contains('active')) {
                        // Limpiar cualquier estilo inline residual que pueda bloquear
                        const hasBlockingStyles = (
                            el.style.visibility === 'hidden' ||
                            el.style.opacity === '0' ||
                            el.style.pointerEvents === 'none' ||
                            el.style.display === 'none'
                        );
                        
                        if (hasBlockingStyles) {
                            console.log('🔧 Limpiando estilos bloqueantes en:', el.id || el.className?.split(' ')[0]);
                            STYLES_TO_CLEAN.forEach(prop => {
                                el.style[prop] = '';
                            });
                        }
                    }
                }
            }
        });
        
        // Observar solo los modales conocidos
        const modalIds = [
            'commentsModal', 'shareModal', 'participateModal', 
            'submissionsModal', 'sellModal', 'transactionsModal',
            'flashCreatorModal', 'anclarFlashModal', 'rejectModal',
            'approveModal', 'fullscreen-post-viewer', 'chainFlashViewer',
            'panelViewersList', 'wallet-fullscreen-viewer', 'compra-directa-modal', 'fondo-moal-noti',
        ];
        
        modalIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                observer.observe(el, { attributes: true, attributeFilter: ['class'] });
            }
        });
        
        // También observar contenedores de viewers
       document.querySelectorAll('.fsv-container, .cfv-container, .wfv-container').forEach(el => {
            observer.observe(el, { attributes: true, attributeFilter: ['class'] });
        });
    }

    // ============================================
    // MANEJO DEL HISTORIAL
    // ============================================

    function syncHistoryState() {
        const visibleModals = findVisibleModals();
        
        console.log(`📊 Sync: depth=${state.historyDepth}, visible=${visibleModals.length}, stack=${state.modalStack.length}`);
        
        const beforeCleanup = state.modalStack.length;
        state.modalStack = state.modalStack.filter(m => {
            const stillVisible = isElementVisible(m.element);
            if (!stillVisible) {
                console.log(`   ➖ Removiendo del stack (no visible): ${m.id}`);
            }
            return stillVisible;
        });
        
        if (beforeCleanup !== state.modalStack.length) {
            console.log(`   🧹 Limpieza: ${beforeCleanup} → ${state.modalStack.length}`);
        }
        
        visibleModals.forEach(modal => {
            const existsInStack = state.modalStack.some(m => m.element === modal);
            
            if (!existsInStack) {
                const modalId = generateModalId(modal);
                console.log(`   ➕ Agregando al stack: ${modalId}`);
                state.modalStack.push({
                    element: modal,
                    id: modalId,
                    addedAt: Date.now()
                });
            }
        });
        
        const targetDepth = state.modalStack.length;
        
        while (state.historyDepth < targetDepth) {
            state.historyDepth++;
            window.history.pushState(
                { modalHandler: true, depth: state.historyDepth, timestamp: Date.now() },
                ''
            );
            console.log(`   ✚ Historial: depth=${state.historyDepth}`);
        }
        
        if (state.historyDepth > targetDepth) {
            state.historyDepth = targetDepth;
            console.log(`   📉 Ajustando depth a ${state.historyDepth}`);
        }
        
        console.log(`   📚 Stack final: [${state.modalStack.map(m => m.id).join(', ')}]`);
    }

    function handlePopState(event) {
        console.log('🔙 PopState detectado');
        console.log(`   📊 depth=${state.historyDepth}, stack=${state.modalStack.length}`);
        
        if (state.isProcessingBack) {
            console.log('   ⏳ Ya procesando, ignorando');
            return;
        }
        
        state.isProcessingBack = true;
        
        if (state.keyboardOpen && state.lastFocusedInput) {
            console.log('   ⌨️ Cerrando teclado primero');
            state.lastFocusedInput.blur();
            state.keyboardOpen = false;
            state.lastFocusedInput = null;
            
            setTimeout(() => {
                if (state.modalStack.length > 0) {
                    window.history.pushState(
                        { modalHandler: true, depth: state.historyDepth, timestamp: Date.now() },
                        ''
                    );
                }
                state.isProcessingBack = false;
            }, 100);
            return;
        }
        
        state.modalStack = state.modalStack.filter(m => isElementVisible(m.element));
        
        if (state.modalStack.length > 0) {
            const topModalInfo = state.modalStack[state.modalStack.length - 1];
            console.log(`   🎯 Cerrando: ${topModalInfo.id}`);
            
            const closed = closeModal(topModalInfo.element);
            
            if (closed) {
                state.modalStack.pop();
                state.historyDepth = Math.max(0, state.historyDepth - 1);
                console.log(`   ✅ Cerrado. stack=${state.modalStack.length}, depth=${state.historyDepth}`);
            }
        } else {
            state.historyDepth = Math.max(0, state.historyDepth - 1);
            console.log(`   ℹ️ Sin modales en stack, depth=${state.historyDepth}`);
        }
        
        setTimeout(() => {
            state.isProcessingBack = false;
        }, 150);
    }

    // ============================================
    // DETECCIÓN DE TECLADO
    // ============================================

    function setupKeyboardDetection() {
        let initialHeight = window.innerHeight;
        
        const checkKeyboard = () => {
            const currentHeight = window.visualViewport?.height || window.innerHeight;
            const diff = initialHeight - currentHeight;
            
            if (diff > 150 && !state.keyboardOpen) {
                state.keyboardOpen = true;
                console.log('⌨️ Teclado abierto');
            } else if (diff < 50 && state.keyboardOpen) {
                state.keyboardOpen = false;
                console.log('⌨️ Teclado cerrado');
            }
        };
        
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', checkKeyboard);
        }
        window.addEventListener('resize', checkKeyboard);
        
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, [contenteditable]')) {
                state.lastFocusedInput = e.target;
                state.keyboardOpen = true;
            }
        }, true);
        
        document.addEventListener('focusout', (e) => {
            if (e.target.matches('input, textarea, [contenteditable]')) {
                setTimeout(() => {
                    if (document.activeElement === document.body || 
                        !document.activeElement.matches('input, textarea, [contenteditable]')) {
                        state.keyboardOpen = false;
                    }
                }, 150);
            }
        }, true);
    }

    // ============================================
    // OBSERVADOR DE MODALES
    // ============================================

    function setupModalObserver() {
        let syncDebounceTimer = null;
        
        const observer = new MutationObserver((mutations) => {
            let shouldSync = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    const el = mutation.target;
                    const attrName = mutation.attributeName;
                    
                    if (attrName === 'class' || attrName === 'style') {
                        const isModalLike = (
                            el.id?.toLowerCase().includes('modal') ||
                            el.id?.toLowerCase().includes('fullscreen') ||
                            el.id?.toLowerCase().includes('viewer') ||
                            el.classList?.contains('active') ||
                            el.className?.includes?.('modal') ||
                            el.className?.includes?.('fullscreen') ||
                            el.className?.includes?.('viewer') ||
                            el.className?.includes?.('cfv') ||
                            el.className?.includes?.('fsv') ||
                            el.className?.includes?.('pfsv')
                        );
                        
                        if (isModalLike) {
                            shouldSync = true;
                        }
                    }
                }
                
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const isModal = (
                                node.classList?.contains('modal') ||
                                node.classList?.contains('fullscreen') ||
                                node.id?.toLowerCase().includes('modal')
                            );
                            if (isModal) shouldSync = true;
                        }
                    });
                }
            }
            
            if (shouldSync) {
                clearTimeout(syncDebounceTimer);
                syncDebounceTimer = setTimeout(() => {
                    syncHistoryState();
                }, 150);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // ============================================
    // TECLA ESC
    // ============================================

    function setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                state.modalStack = state.modalStack.filter(m => isElementVisible(m.element));
                
                if (state.modalStack.length > 0) {
                    e.preventDefault();
                    const topModal = state.modalStack[state.modalStack.length - 1];
                    closeModal(topModal.element);
                    state.modalStack.pop();
                    state.historyDepth = Math.max(0, state.historyDepth - 1);
                }
            }
        });
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    function init() {
        window.history.replaceState({ initial: true, modalHandler: true }, '');
        
        window.addEventListener('popstate', handlePopState);
        
        setupKeyboardDetection();
        setupModalObserver();
        setupEscapeKey();
        setupReopenObserver(); // NUEVO
        
        setTimeout(syncHistoryState, 500);
        
        console.log('✅ Auto Modal Handler v2.3 activado');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // API global para debugging
    window.autoModalHandler = {
        getState: () => ({ 
            modalStack: state.modalStack.map(m => m.id),
            historyDepth: state.historyDepth,
            isProcessingBack: state.isProcessingBack,
            keyboardOpen: state.keyboardOpen
        }),
        findVisibleModals,
        getTopModal,
        closeModal,
        syncHistoryState,
        forceSync: () => {
            state.modalStack = [];
            state.historyDepth = 0;
            syncHistoryState();
        },
        cleanAllStyles: () => {
            // Utilidad para limpiar todos los estilos residuales
            const modalIds = [
                'commentsModal', 'shareModal', 'participateModal', 
                'submissionsModal', 'sellModal', 'transactionsModal',
                'flashCreatorModal', 'anclarFlashModal', 'fullscreen-post-viewer',
                'chainFlashViewer', 'panelViewersList', 'wallet-fullscreen-viewer', 'compra-directa-modal', 'fondo-moal-noti', 
            ];
            modalIds.forEach(id => {
                const el = document.getElementById(id);
                if (el && !el.classList.contains('active')) {
                    cleanInlineStyles(el);
                }
            });
            console.log('🧹 Estilos limpiados');
        },
        getRawStack: () => state.modalStack,
        testDetection: () => {
            const visible = findVisibleModals();
            console.log('Modales detectados:', visible.length);
            visible.forEach((m, i) => console.log(`  ${i}: ${m.id || m.className}`));
            return visible;
        }
    };

})();