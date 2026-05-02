/**
 * PROFILE MEDIA VIEWER - CHAIN EVENTS PATCH
 * Complemento para ocultar botones de acción en Chain Events
 * 
 * IMPORTANTE: Este archivo debe cargarse DESPUÉS del archivo original
 * Uso: <script src="full_chain_perfil_patch.js"></script>
 * 
 * @version 1.1
 * @author ChainFeed
 */

(function() {
    'use strict';
    
    // Verificar que la instancia existe
    if (!window.profileMediaViewer) {
        console.error('❌ profileMediaViewer no encontrado. Asegúrate de cargar el archivo original primero.');
        return;
    }

    const viewer = window.profileMediaViewer;

    // ============================================
    // PATCH 1: Detectar Chain Events en extractPostData
    // ============================================
    const originalExtractPostData = viewer.extractPostData.bind(viewer);
    viewer.extractPostData = function(postElement) {
        const postData = originalExtractPostData(postElement);
        
        if (!postData) return null;
        
        // Detectar si es un Chain Event
        const postCard = postElement.closest('.content-card, .chain-event-card');
        const isChainEvent = postCard?.classList.contains('chain-event-card') || !!postCard?.dataset.eventId;
        
        // Agregar flag al objeto de datos
        postData.isChainEvent = isChainEvent;
        
        return postData;
    };

    // ============================================
    // PATCH 2: No mostrar botones en Chain Events
    // ============================================
    const originalLoadActions = viewer.loadActions.bind(viewer);
    viewer.loadActions = function() {
        const actionsContainer = this.viewerElement.querySelector('.pmv-actions');
        
        // Si es un chain event, limpiar acciones y salir
        if (this.currentPostData && this.currentPostData.isChainEvent) {
            actionsContainer.innerHTML = '';
            return;
        }
        
        // Si no es chain event, ejecutar el método original
        originalLoadActions();
    };

    // ============================================
    // PATCH 3: No auto-actualizar Chain Events
    // ============================================
    const originalStartAutoUpdate = viewer.startAutoUpdate.bind(viewer);
    viewer.startAutoUpdate = function() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // No auto-actualizar si es Chain Event
        if (this.currentPostData && this.currentPostData.isChainEvent) {
            return;
        }
        
        // Si no es Chain Event, ejecutar el método original
        originalStartAutoUpdate();
    };

    // ============================================
    // PATCH 4: No actualizar estados en Chain Events
    // ============================================
    const originalUpdateActionStates = viewer.updateActionStates.bind(viewer);
    viewer.updateActionStates = function() {
        // No actualizar estados si es Chain Event
        if (this.currentPostData && this.currentPostData.isChainEvent) {
            return;
        }
        
        // Si no es Chain Event, ejecutar el método original
        originalUpdateActionStates();
    };

    // ============================================
    // PATCH 5: CSS para ocultar acciones vacías
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        .pmv-actions:empty {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Chain Events Patch aplicado correctamente');
    console.log('📱 Chain Events detectados: Sin botones de acción');
    console.log('📱 Posts normales: Con botones de acción');
    console.log('🔍 Debug: Abre un Chain Event para verificar');
})();