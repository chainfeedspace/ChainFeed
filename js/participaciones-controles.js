/**
 * ============================================
 * SISTEMA DE FILTRADO Y CONTROLES DE PARTICIPACIONES
 * ============================================
 * 
 * Versión mejorada: Sin flash y con empty states
 */

const ParticipationVisibilitySystem = {
    currentEventData: null,
    processingActions: new Set()
};

/**
 * Aplicar filtros de visibilidad INMEDIATAMENTE (sin delay)
 */
function applyParticipationVisibilityFilters(eventData) {
    if (!eventData || !eventData.participaciones) {
        console.warn('⚠️ No hay datos de evento para filtrar');
        return;
    }
    
    ParticipationVisibilitySystem.currentEventData = eventData;
    
    // ✅ OBTENER USUARIO DE MÚLTIPLES FUENTES
    let currentUserId = CHAINFEED_CONFIG.currentUser?.id;

    // Si no existe en CHAINFEED_CONFIG, intentar de localStorage
    if (!currentUserId) {
        try {
            const savedUser = localStorage.getItem('chainfeed_user');
            if (savedUser) {
                const userData = JSON.parse(savedUser);
                currentUserId = userData.id;
                
                // Actualizar CHAINFEED_CONFIG para futuras llamadas
                if (!CHAINFEED_CONFIG.currentUser) {
                    CHAINFEED_CONFIG.currentUser = userData;
                }
                
                console.log('✅ Usuario cargado de localStorage:', userData);
            }
        } catch (e) {
            console.error('Error cargando usuario de localStorage:', e);
        }
    }
    
    // ✅ CORRECCIÓN: Buscar creador en múltiples ubicaciones Y usar es_creador del PHP
    const creadorId = eventData.evento?.creado_por || eventData.creado_por || eventData.creador?.id;
    const esCreadorPHP = eventData.es_creador; // ✅ USAR EL FLAG DEL PHP
    
    // ✅ PRIORIZAR el flag del PHP
    const isCreator = esCreadorPHP === true || (creadorId && parseInt(creadorId) === parseInt(currentUserId));
    
    const isParticipant = eventData.participaciones.some(p => 
        parseInt(p.author?.id || p.usuario_id) === parseInt(currentUserId)
    );
    
    const userRole = isCreator ? 'creator' : isParticipant ? 'participant' : 'visitor';
    
    console.log('👤 Detección de rol:', {
        currentUserId: currentUserId,
        creadorId: creadorId,
        esCreadorPHP: esCreadorPHP,
        isCreator: isCreator,
        rolFinal: userRole
    });
    
    // Obtener todas las participaciones del DOM
    const submissionItems = document.querySelectorAll('.submission-item[data-submission-id]');
    
    if (submissionItems.length === 0) {
        console.warn('⚠️ No se encontraron elementos .submission-item en el DOM');
        showEmptyState(userRole);
        return;
    }
    
    let visibleCount = 0;
    
    // Aplicar filtros según rol
    submissionItems.forEach(item => {
        const submissionId = item.dataset.submissionId;
        const submission = eventData.participaciones.find(p => p.id == submissionId);
        
        if (!submission) {
            console.warn(`⚠️ No se encontró data para participación ${submissionId}`);
            item.style.display = 'none';
            return;
        }
        
        const shouldShow = shouldShowSubmission(submission, userRole, currentUserId);
        
        // Mostrar/ocultar elemento INMEDIATAMENTE
        if (shouldShow) {
            item.style.display = '';
            visibleCount++;
            
            // Agregar controles si es creador
            if (isCreator) {
                addCreatorControls(item, submission, eventData);
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    // Si no hay elementos visibles, mostrar mensaje
    if (visibleCount === 0) {
        showEmptyState(userRole);
    } else {
        // Remover empty state si existe
        removeEmptyState();
        
        // Agregar resumen para creadores
        if (isCreator) {
            addCreatorSummary(eventData);
        }
    }
    
    console.log(`✅ Filtros aplicados: ${visibleCount} participaciones visibles (rol: ${userRole})`);
}

/**
 * Determinar si una participación debe mostrarse según el rol
 */
function shouldShowSubmission(submission, userRole, currentUserId) {
    const submissionUserId = parseInt(submission.usuario_id || submission.author?.id);
    const isOwnSubmission = submissionUserId === parseInt(currentUserId);
    
    console.log('🔍 shouldShowSubmission:', {
        submissionId: submission.id,
        submissionUserId: submissionUserId,
        currentUserId: currentUserId,
        isOwnSubmission: isOwnSubmission,
        status: submission.status,
        userRole: userRole
    });
    
    // ✅ REGLA CRÍTICA: El usuario SIEMPRE ve su propia participación
    if (isOwnSubmission) {
        console.log('✅ Es participación propia - SIEMPRE MOSTRAR');
        return true;
    }
    
    // Para participaciones de otros usuarios
    switch (userRole) {
        case 'creator':
            // Creador ve todas las participaciones
            return true;
        
        case 'participant':
        case 'visitor':
        default:
            // Otros usuarios solo ven aprobadas
            return submission.status === 'approved';
    }
}

/**
 * Mostrar mensaje cuando no hay participaciones visibles
 */
function showEmptyState(userRole) {
    const contentContainer = document.getElementById('submissionsContent');
    if (!contentContainer) return;
    
    // Verificar si ya existe
    if (contentContainer.querySelector('[data-empty-state]')) {
        return;
    }
    
    const messages = {
        'creator': {
            icon: '📋',
            title: 'Sin participaciones aún',
            description: 'Cuando los usuarios participen en tu evento, aparecerán aquí para que las revises'
        },
        'participant': {
            icon: '⏳',
            title: 'Sin participaciones aprobadas aún',
            description: 'Las participaciones aprobadas aparecerán aquí. También verás tu participación pendiente si la enviaste.'
        },
        'visitor': {
            icon: '👀',
            title: 'Sin participaciones aprobadas',
            description: 'Aún no hay participaciones aprobadas en este evento. Vuelve más tarde.'
        }
    };
    
    const message = messages[userRole] || messages['visitor'];
    
    const emptyDiv = document.createElement('div');
    emptyDiv.setAttribute('data-empty-state', 'true');
    emptyDiv.style.cssText = `
        text-align: center;
        padding: 4rem 2rem;
        color: rgba(255, 255, 255, 0.6);
    `;
    
    emptyDiv.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.5;">${message.icon}</div>
        <h3 style="margin: 0 0 1rem 0; font-size: 1.3rem; font-weight: 700; color: var(--text-secondary);">${message.title}</h3>
        <p style="margin: 0; font-size: 1rem; line-height: 1.6; max-width: 400px; margin: 0 auto; color: var(--text-secondary);">${message.description}</p>
    `;
    
    // Ocultar todos los elementos existentes y mostrar el empty state
    contentContainer.innerHTML = '';
    contentContainer.appendChild(emptyDiv);
}

/**
 * Remover empty state si existe
 */
function removeEmptyState() {
    const emptyState = document.querySelector('[data-empty-state]');
    if (emptyState) {
        emptyState.remove();
    }
}

function addCreatorControls(itemElement, submission, eventData) {
    // ✅ VERIFICAR SI YA TIENE BOTONES (evitar duplicados)
    const hasApproveButton = itemElement.querySelector('button[onclick*="aprobarParticipacion"]');
    const hasCreatorControls = itemElement.querySelector('[data-creator-controls]');
    
    if (hasApproveButton || hasCreatorControls) {
        console.log('⏭️ Botones ya existen, saltando duplicados');
        return;
    }
    
    // Solo agregar controles si está pendiente
    if (submission.status !== 'pending') {
        // Si está aprobada, mostrar info de tokens
        if (submission.status === 'approved' && submission.tokens_ganados_participacion) {
            addRewardInfo(itemElement, submission.tokens_ganados_participacion);
        }
        return;
    }
    
    // Calcular cupos restantes
    const maxWinners = eventData.evento?.winners_count || eventData.winners_count || 0;
    const currentApproved = eventData.participaciones.filter(p => p.status === 'approved').length;
    const remainingSlots = Math.max(0, maxWinners - currentApproved);
    const canApprove = remainingSlots > 0;
    
    // ✅ BUSCAR EL CONTENEDOR .submission-actions EXISTENTE
    const actionsContainer = itemElement.querySelector('.submission-actions');
    
    if (!actionsContainer) {
        console.warn('⚠️ No se encontró .submission-actions en el item');
        return;
    }
    
    // ✅ CREAR CONTENEDOR DE BOTONES CON MARGIN-LEFT AUTO
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.setAttribute('data-creator-controls', 'true');
    buttonsWrapper.style.cssText = `
        margin-left: auto;
        display: flex;
        gap: 0.75rem;
    `;
    
    // Botón Aprobar
    const approveBtn = document.createElement('button');
    approveBtn.innerHTML = '✅ Aprobar';
    approveBtn.disabled = !canApprove;
    approveBtn.style.cssText = `
        background: ${canApprove ? 'linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))' : 'rgba(255,255,255,0.1)'};
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 10px;
        cursor: ${canApprove ? 'pointer' : 'not-allowed'};
        font-weight: 600;
        font-size: 0.9rem;
        transition: 0.3s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateY(0px);
        opacity: ${canApprove ? '1' : '0.5'};
    `;
    
    if (canApprove) {
        approveBtn.onmouseenter = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
        };
        approveBtn.onmouseleave = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        };
        approveBtn.onclick = () => approveParticipation(submission.id);
    }
    
    // Botón Rechazar
    const rejectBtn = document.createElement('button');
    rejectBtn.innerHTML = '❌ Rechazar';
    rejectBtn.style.cssText = `
        background: linear-gradient(135deg, rgb(239, 68, 68), rgb(220, 38, 38));
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
        transition: 0.3s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateY(0px);
    `;
    
    rejectBtn.onmouseenter = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
    };
    rejectBtn.onmouseleave = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
    };
    
    rejectBtn.onclick = () => rejectParticipation(submission.id);
    
    // ✅ AGREGAR BOTONES AL WRAPPER
    buttonsWrapper.appendChild(approveBtn);
    buttonsWrapper.appendChild(rejectBtn);
    
    // ✅ INSERTAR WRAPPER DENTRO DE .submission-actions (NO DESPUÉS)
    actionsContainer.appendChild(buttonsWrapper);
}

/**
 * Agregar información de recompensa a participación aprobada
 */
function addRewardInfo(itemElement, tokens) {
    // Verificar si ya existe (evitar duplicados)
    const existingReward = itemElement.querySelector('[data-reward-info]');
    if (existingReward) {
        return;
    }
    
    const rewardInfo = document.createElement('div');
    rewardInfo.setAttribute('data-reward-info', 'true');
    rewardInfo.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(34, 197, 94, 0.15);
        border-left: 4px solid #22c55e;
        border-radius: 8px;
    `;
    rewardInfo.innerHTML = `
        <span style="color: #22c55e; font-weight: 600;">
            💰 Recompensa otorgada: ${tokens} CFT
        </span>
    `;
    
    itemElement.appendChild(rewardInfo);
}

/**
 * Agregar resumen de estadísticas para creadores
 */
function addCreatorSummary(eventData) {
    const contentContainer = document.getElementById('submissionsContent');
    if (!contentContainer) return;
    
    // Verificar si ya existe (evitar duplicados)
    const existingSummary = contentContainer.querySelector('[data-creator-summary]');
    if (existingSummary) {
        return;
    }
    
    const participaciones = eventData.participaciones || [];
    const pending = participaciones.filter(p => p.status === 'pending').length;
    const approved = participaciones.filter(p => p.status === 'approved').length;
    const rejected = participaciones.filter(p => p.status === 'rejected').length;
    
    const maxWinners = eventData.evento?.winners_count || eventData.winners_count || 0;
    const remaining = Math.max(0, maxWinners - approved);
    
    const summaryDiv = document.createElement('div');
    summaryDiv.setAttribute('data-creator-summary', 'true');
    summaryDiv.style.cssText = `
        background: rgba(26, 26, 36, 0.6);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    summaryDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                <span style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">⏳ Pendientes:</span>
                <span style="font-size: 1.1rem; font-weight: 700; color: #f59e0b;">${pending}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                <span style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">✅ Aprobadas:</span>
                <span style="font-size: 1.1rem; font-weight: 700; color: #22c55e;">${approved} / ${maxWinners}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                <span style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">❌ Rechazadas:</span>
                <span style="font-size: 1.1rem; font-weight: 700; color: #ef4444;">${rejected}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(99, 102, 241, 0.15); border: 1px solid #6366f1; border-radius: 8px;">
                <span style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">🏆 Cupos restantes:</span>
                <span style="font-size: 1.1rem; font-weight: 700; color: ${remaining === 0 ? '#ef4444' : '#22c55e'};">${remaining}</span>
            </div>
        </div>
    `;
    
    // Insertar al inicio del contenedor
    contentContainer.insertBefore(summaryDiv, contentContainer.firstChild);
}

/**
 * Aprobar participación
 */
async function approveParticipation(participationId) {
    if (ParticipationVisibilitySystem.processingActions.has(participationId)) {
        return;
    }
    
    try {
        ParticipationVisibilitySystem.processingActions.add(participationId);
        
await showApproveModal();
        
        showNotification('⏳ Aprobando participación...', 'info');
        
        const response = await fetch('/php/aprobar_participacion.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                participacion_id: parseInt(participationId)
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(
                `✅ Participación aprobada. ${data.participacion.username} ganó ${data.participacion.tokens_ganados} CFT`,
                'success'
            );
            
            // Recargar modal
            const modal = document.getElementById('submissionsModal');
            const eventId = modal ? modal.dataset.currentEventId : null;
            
            if (eventId) {
                await viewEventSubmissions(eventId);
            }
        } else {
            throw new Error(data.message || 'Error al aprobar participación');
        }
        
    } catch (error) {
        console.error('Error aprobando participación:', error);
        showNotification('❌ Error: ' + error.message, 'error');
    } finally {
        ParticipationVisibilitySystem.processingActions.delete(participationId);
    }
}

function showRejectModal(participationId) {
    return new Promise((resolve, reject) => {
        const modal = document.getElementById('rejectModal');
        const content = modal.querySelector('.reject-modal-content');
        const textarea = document.getElementById('rejectMotivo');
        const counter = document.getElementById('rejectMotivoCounter');
        const cancelBtn = document.getElementById('rejectCancelBtn');
        const confirmBtn = document.getElementById('rejectConfirmBtn');
        
        if (!modal) {
            reject(new Error('Modal no encontrado'));
            return;
        }
        
        // Limpiar textarea
        textarea.value = '';
        counter.textContent = '0';
        
        // Mostrar modal con animación
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            content.style.transform = 'scale(1)';
        }, 10);
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        
        // Contador de caracteres
        const updateCounter = () => {
            counter.textContent = textarea.value.length;
        };
        textarea.addEventListener('input', updateCounter);
        
        // Función para cerrar modal
        const closeModal = () => {
            modal.style.opacity = '0';
            content.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.pointerEvents = 'none';
                document.body.style.overflow = '';
            }, 300);
            
            // Limpiar listeners
            textarea.removeEventListener('input', updateCounter);
            cancelBtn.removeEventListener('click', handleCancel);
            confirmBtn.removeEventListener('click', handleConfirm);
            modal.removeEventListener('click', handleBackdropClick);
        };
        
        // Handlers
        const handleCancel = () => {
            closeModal();
            reject(new Error('CANCEL'));
        };
        
        const handleConfirm = () => {
            const motivo = textarea.value.trim();
            closeModal();
            resolve(motivo || null);
        };
        
        const handleBackdropClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };
        
        // Agregar listeners
        cancelBtn.addEventListener('click', handleCancel);
        confirmBtn.addEventListener('click', handleConfirm);
        modal.addEventListener('click', handleBackdropClick);
        
        // Focus en textarea
        setTimeout(() => textarea.focus(), 350);
    });
}

function showApproveModal() {
    return new Promise((resolve, reject) => {
        const modal = document.getElementById('approveModal');
        const content = modal.querySelector('.approve-modal-content');
        const cancelBtn = document.getElementById('approveCancelBtn');
        const confirmBtn = document.getElementById('approveConfirmBtn');
        
        if (!modal) {
            reject(new Error('Modal no encontrado'));
            return;
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            content.style.transform = 'scale(1)';
        }, 10);
        
        const closeModal = () => {
            modal.style.opacity = '0';
            content.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.pointerEvents = 'none';
                document.body.style.overflow = '';
            }, 300);
            
            cancelBtn.removeEventListener('click', handleCancel);
            confirmBtn.removeEventListener('click', handleConfirm);
            modal.removeEventListener('click', handleBackdropClick);
        };
        
        const handleCancel = () => {
            closeModal();
            reject(new Error('CANCEL'));
        };
        
        const handleConfirm = () => {
            closeModal();
            resolve(true);
        };
        
        const handleBackdropClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };
        
        cancelBtn.addEventListener('click', handleCancel);
        confirmBtn.addEventListener('click', handleConfirm);
        modal.addEventListener('click', handleBackdropClick);
    });
}

/**
 * Rechazar participación - VERSION ACTUALIZADA
 */
async function rejectParticipation(participationId) {
    if (ParticipationVisibilitySystem.processingActions.has(participationId)) {
        return;
    }
    
    try {
        ParticipationVisibilitySystem.processingActions.add(participationId);
        
        // ✅ USAR MODAL PERSONALIZADO en lugar de prompt()
        const motivo = await showRejectModal(participationId);
        
        showNotification('⏳ Rechazando participación...', 'info');
        
        const response = await fetch('/php/rechazar_participacion.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                participacion_id: parseInt(participationId),
                motivo: motivo
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('❌ Participación rechazada', 'success');
            
            // Recargar modal
            const modal = document.getElementById('submissionsModal');
            const eventId = modal ? modal.dataset.currentEventId : null;
            
            if (eventId) {
                await viewEventSubmissions(eventId);
            }
        } else {
            throw new Error(data.message || 'Error al rechazar participación');
        }
        
    } catch (error) {
        console.error('Error rechazando participación:', error);
        
        // No mostrar error si el usuario canceló
        if (error.message !== 'CANCEL') {
            showNotification('❌ Error: ' + error.message, 'error');
        }
    } finally {
        ParticipationVisibilitySystem.processingActions.delete(participationId);
    }
}

/**
 * Interceptar renderCampaignParticipations para aplicar filtros INMEDIATAMENTE
 */
(function() {
    const originalRenderCampaignParticipations = window.renderCampaignParticipations;
    
    if (!originalRenderCampaignParticipations) {
        console.warn('⚠️ renderCampaignParticipations no encontrada');
        return;
    }
    
    window.renderCampaignParticipations = function(data, content) {
        // Guardar datos del evento
        ParticipationVisibilitySystem.currentEventData = data;
        
        // Llamar función original
        originalRenderCampaignParticipations.apply(this, arguments);
        
        // Aplicar filtros INMEDIATAMENTE (sin setTimeout)
        applyParticipationVisibilityFilters(data);
    };
})();


// ============================================
// MODAL DE APROBACIÓN
// ============================================
(function() {
    const approveModalHTML = `
    <div id="approveModal" class="custom-modal" style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    ">
        <div class="approve-modal-content" style="
            background: var(--dark-secondary);
            border-radius: 20px;
            padding: 2rem;
            max-width: 420px;
            width: 90%;
            border: 1px solid rgba(16, 185, 129, 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        ">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.3rem; font-weight: 700; color: white;">
                ✅ Aprobar participación
            </h3>
            <p style="margin: 0 0 1.5rem 0; color: var(--text-secondary); line-height: 1.6;">
                ¿Aprobar esta participación? Se otorgarán los tokens correspondientes al participante.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button id="approveCancelBtn" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                ">Cancelar</button>
                <button id="approveConfirmBtn" style="
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                ">Aprobar</button>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', approveModalHTML);
})();

console.log('✅ Sistema de filtrado de participaciones cargado (sin flash, con empty states)');
