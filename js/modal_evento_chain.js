// ============================================
// MODAL DE EVENTOS CHAIN - SISTEMA DE SELECCIÓN
// ============================================

/**
 * Abrir modal de Chain sin tipo preseleccionado
 */
function openChainModal() {
    const modal = document.getElementById('chainModal');
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset completo del modal
    resetChainModal();
    
    setTimeout(() => {
        const titleInput = document.getElementById('eventTitle');
        if (titleInput) {
            titleInput.focus();
        }
    }, 300);
}

/**
 * Cerrar modal de Chain
 */
function closeChainModal() {
    const modal = document.getElementById('chainModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        resetChainModal();
    }, 300);
}

/**
 * Reset completo del modal (sin tipo seleccionado)
 */
function resetChainModal() {
    console.log('🔄 Reseteando modal Chain...');
    
    // Resetear tipo de evento
    ChainSystem.currentEventType = null; // Ninguno seleccionado
    ChainSystem.currentResponseType = 'image';
    ChainSystem.pollOptionsCount = 2;
    
    // Limpiar campos del formulario
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const campaignReward = document.getElementById('campaignReward');
    const campaignWinners = document.getElementById('campaignWinners');
    const pollReward = document.getElementById('pollReward');
    const pollMaxParticipants = document.getElementById('pollMaxParticipants');
    const eventDuration = document.getElementById('eventDuration');
    
    if (eventTitle) eventTitle.value = '';
    if (eventDescription) eventDescription.value = '';
    if (campaignReward) campaignReward.value = '';
    if (campaignWinners) campaignWinners.value = '';
    if (pollReward) pollReward.value = '10';
    if (pollMaxParticipants) pollMaxParticipants.value = '100';
    if (eventDuration) eventDuration.value = '7';
    
    // MOSTRAR todos los botones de tipo de evento
    const allTypeButtons = document.querySelectorAll('.event-type-btn');
    allTypeButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.display = 'block'; // Mostrar todos
    });
    
    // MOSTRAR el contenedor de botones de tipo de evento
    const eventTypeSelector = document.querySelector('.event-type-selector');
    if (eventTypeSelector) {
        eventTypeSelector.style.display = 'flex'; // o 'flex' según tu CSS
        eventTypeSelector.classList.remove('hidden');
    }
    
    // OCULTAR todas las secciones del formulario (pero NO los botones de tipo)
    hideAllFormSections();
    
    // Reset de archivos
    resetAudioSystem();
    removeEventMedia();
    
    console.log('✅ Modal Chain reseteado - sin tipo seleccionado');
}

/**
 * Ocultar todas las secciones del formulario (excepto botones de tipo)
 */
function hideAllFormSections() {
    // Ocultar secciones específicas de cada tipo
    const pollSection = document.getElementById('pollSection');
    const campaignSection = document.getElementById('campaignSection');
    const audioSection = document.getElementById('audioSection');
    const mediaOptionalSection = document.getElementById('mediaOptionalSection');
    
    if (pollSection) pollSection.classList.add('hidden');
    if (campaignSection) campaignSection.classList.add('hidden');
    if (audioSection) audioSection.classList.add('hidden');
    if (mediaOptionalSection) mediaOptionalSection.style.display = 'none';
    
    // Ocultar secciones comunes del formulario (título, descripción, duración)
    // PERO NO el contenedor de botones de tipo de evento
    const chainSections = document.querySelectorAll('.chain-section');
    chainSections.forEach(section => {
        // Solo ocultar si NO es el contenedor de tipos de evento
        if (!section.querySelector('.event-type-selector')) {
            section.classList.add('hidden');
        }
    });
    
    const chainFooter = document.querySelector('.chain-footer');
    if (chainFooter) {
        chainFooter.classList.add('hidden');
    }
}

/**
 * Mostrar todas las secciones comunes del formulario
 */
function showCommonFormSections() {
    const chainSections = document.querySelectorAll('.chain-section');
    chainSections.forEach(section => {
        // No mostrar el selector de tipo de evento (ya está visible)
        if (!section.querySelector('.event-type-selector')) {
            section.classList.remove('hidden');
        }
    });
    
    const chainFooter = document.querySelector('.chain-footer');
    if (chainFooter) {
        chainFooter.classList.remove('hidden');
    }
}

/**
 * Seleccionar tipo de evento (oculta los demás botones)
 */
function selectEventType(type) {
    console.log('📋 Tipo de evento seleccionado:', type);
    
    ChainSystem.currentEventType = type;
    
    // Actualizar botones - OCULTAR los no seleccionados
    const allTypeButtons = document.querySelectorAll('.event-type-btn');
    allTypeButtons.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
            btn.style.display = 'block'; // Mantener visible
        } else {
            btn.classList.remove('active');
            btn.style.display = 'none'; // OCULTAR los demás
        }
    });
    
    // Mostrar las secciones comunes del formulario
    showCommonFormSections();
    
    // LIMPIEZA: Remover media al cambiar tipo de evento
    removeEventMedia();
    resetAudioSystem();
    
    // Ocultar todas las secciones específicas primero
    const pollSection = document.getElementById('pollSection');
    const campaignSection = document.getElementById('campaignSection');
    const audioSection = document.getElementById('audioSection');
    const mediaOptionalSection = document.getElementById('mediaOptionalSection');
    
    if (pollSection) pollSection.classList.add('hidden');
    if (campaignSection) campaignSection.classList.add('hidden');
    if (audioSection) audioSection.classList.add('hidden');
    
    // Mostrar la sección correspondiente
    if (type === 'poll') {
        if (pollSection) pollSection.classList.remove('hidden');
        if (mediaOptionalSection) mediaOptionalSection.style.display = 'block';
        
    } else if (type === 'campaign') {
        if (campaignSection) campaignSection.classList.remove('hidden');
        if (mediaOptionalSection) mediaOptionalSection.style.display = 'block';
        
    } else if (type === 'audio') {
        if (audioSection) audioSection.classList.remove('hidden');
        if (mediaOptionalSection) mediaOptionalSection.style.display = 'none';
        
        // Set default response type to audio
        ChainSystem.currentResponseType = 'audio';
        document.querySelectorAll('.response-type-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === 'audio') {
                btn.classList.add('active');
            }
        });
    }
    
    showNotification(`✨ Evento ${type === 'poll' ? 'Encuesta' : type === 'audio' ? 'Audio' : 'Campaña'} seleccionado`);
}

/**
 * Inicializar el modal de Chain
 */
function initializeChainModal() {
    console.log('🎬 Inicializando modal de Chain...');
    
    // Setup modal close events
    const chainModal = document.getElementById('chainModal');
    if (chainModal) {
        chainModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeChainModal();
            }
        });
    }
    
    // Close with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const chainModal = document.getElementById('chainModal');
            if (chainModal && chainModal.classList.contains('active')) {
                closeChainModal();
            }
        }
    });
    
    console.log('✅ Modal de Chain inicializado correctamente');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChainModal);
} else {
    initializeChainModal();
}

console.log('✅ modal_evento_chain.js cargado');