// ============================================
// SISTEMA DE OPCIONES DE COMENTARIOS
// opciones_comentario.js
// ============================================

/**
 * Sistema modular para manejar opciones de comentarios (eliminar/reportar)
 * Este sistema puede ser integrado en cualquier modal de comentarios
 */

const CommentOptionsSystem = {
    activeMenu: null,
    menuJustOpened: false
};

/**
 * Crear botón de opciones para un comentario
 * @param {string} commentId - ID del comentario
 * @param {string} commentUsername - Username del autor del comentario
 * @returns {string} HTML del botón de opciones
 */

function createCommentOptionsButton(commentId, commentUsername) {
    
    console.log('🔍 DEBUG OPCIONES COMENTARIO:', {
        commentId,
        commentUsername,
        localStorage_username: localStorage.getItem('username'),
        sessionStorage_username: sessionStorage.getItem('username'),
        CHAINFEED_CONFIG: window.CHAINFEED_CONFIG,
        currentUser_from_config: window.CHAINFEED_CONFIG?.currentUser?.username,
        currentUser_object: window.CHAINFEED_CONFIG?.currentUser
    });

    let currentUser = window.CHAINFEED_CONFIG?.currentUser?.username ||
                  localStorage.getItem('username') ||
                  sessionStorage.getItem('username');

    // Normalizar para comparación (trim y lowercase)
    const normalizedCurrent = currentUser ? currentUser.trim().toLowerCase() : '';
    const normalizedComment = commentUsername ? commentUsername.trim().toLowerCase() : '';
    
    // Verificar si es el propio comentario
    const isOwnComment = normalizedCurrent && normalizedComment && normalizedCurrent === normalizedComment;
    
    console.log('🔍 Verificando permisos de comentario:', {
        commentId,
        currentUser: currentUser,
        commentUsername: commentUsername,
        normalizedCurrent,
        normalizedComment,
        isOwnComment,
        source: localStorage.getItem('username') ? 'localStorage' : 'sessionStorage'
    });
    
    return `
        <button class="comment-options-btn" 
                onclick="toggleCommentOptions('${commentId}')" 
                data-comment-id="${commentId}"
                style="
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                "
                onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.color='var(--text)'"
                onmouseout="this.style.background='transparent'; this.style.color='var(--text-secondary)'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="19" r="2"/>
            </svg>
        </button>
        
        <div class="comment-options-dropdown hidden" 
             id="commentDropdown-${commentId}"
             data-owner="${commentUsername}"
             data-current="${currentUser}"
             style="
                position: absolute;
                top: 100%;
                right: 0;
                background: rgba(26, 26, 36, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 0.5rem 0;
                min-width: 180px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px) scale(0.95);
                transition: all 0.3s ease;
             ">
            ${isOwnComment ? `
                <button class="comment-dropdown-item delete-comment" 
                        onclick="deleteCommentAction('${commentId}')"
                        style="
                            display: flex;
                            align-items: center;
                            gap: 0.75rem;
                            padding: 0.75rem 1.25rem;
                            color: var(--error);
                            border: none;
                            background: transparent;
                            width: 100%;
                            text-align: left;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            font-size: 0.9rem;
                        "
                        onmouseover="this.style.background='rgba(239, 68, 68, 0.1)'"
                        onmouseout="this.style.background='transparent'">
                    <span style="font-size: 1.1rem; width: 20px; text-align: center;">🗑️</span>
                    <span>Eliminar comentario</span>
                </button>
            ` : `
                <button class="comment-dropdown-item report-comment" 
                        onclick="reportCommentAction('${commentId}')"
                        style="
                            display: flex;
                            align-items: center;
                            gap: 0.75rem;
                            padding: 0.75rem 1.25rem;
                            color: var(--warning);
                            border: none;
                            background: transparent;
                            width: 100%;
                            text-align: left;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            font-size: 0.9rem;
                        "
                        onmouseover="this.style.background='rgba(245, 158, 11, 0.1)'"
                        onmouseout="this.style.background='transparent'">
                    <span style="font-size: 1.1rem; width: 20px; text-align: center;">⚠️</span>
                    <span>Reportar comentario</span>
                </button>
            `}
        </div>
    `;
}

/**
 * Alternar menú de opciones de comentario
 * @param {string} commentId - ID del comentario
 */
function toggleCommentOptions(commentId) {
    const dropdown = document.getElementById(`commentDropdown-${commentId}`);
    
    if (CommentOptionsSystem.activeMenu === commentId) {
        closeCommentOptions(commentId);
        return;
    }
    
    closeAllCommentOptions();
    
    if (dropdown) {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('active');
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0) scale(1)';
        
        CommentOptionsSystem.activeMenu = commentId;
        CommentOptionsSystem.menuJustOpened = true;
        
        setTimeout(() => {
            CommentOptionsSystem.menuJustOpened = false;
            document.addEventListener('click', closeCommentOptionsOnOutsideClick, true);
            document.addEventListener('touchstart', closeCommentOptionsOnOutsideClick, true);
        }, 300);
    }
}

/**
 * Cerrar menú de opciones de comentario
 * @param {string} commentId - ID del comentario
 */
function closeCommentOptions(commentId) {
    const dropdown = document.getElementById(`commentDropdown-${commentId}`);
    
    if (dropdown) {
        dropdown.classList.remove('active');
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 300);
    }
    
    if (CommentOptionsSystem.activeMenu === commentId) {
        CommentOptionsSystem.activeMenu = null;
    }
    
    document.removeEventListener('click', closeCommentOptionsOnOutsideClick, true);
    document.removeEventListener('touchstart', closeCommentOptionsOnOutsideClick, true);
    CommentOptionsSystem.menuJustOpened = false;
}

/**
 * Cerrar todos los menús de opciones de comentarios
 */
function closeAllCommentOptions() {
    if (CommentOptionsSystem.activeMenu) {
        closeCommentOptions(CommentOptionsSystem.activeMenu);
    }
    
    const allActiveDropdowns = document.querySelectorAll('.comment-options-dropdown.active');
    allActiveDropdowns.forEach(dropdown => {
        const commentId = dropdown.id.replace('commentDropdown-', '');
        closeCommentOptions(commentId);
    });
}

/**
 * Cerrar menú al hacer clic fuera
 * @param {Event} event - Evento de click
 */
function closeCommentOptionsOnOutsideClick(event) {
    if (CommentOptionsSystem.menuJustOpened) {
        return;
    }
    
    const clickedElement = event.target;
    
    const isInsideMenu = clickedElement.closest('.comment-options-dropdown') || 
                        clickedElement.closest('.comment-options-btn');
    
    if (!isInsideMenu) {
        event.stopPropagation();
        closeAllCommentOptions();
    }
}

/**
 * Acción de eliminar comentario (placeholder)
 * @param {string} commentId - ID del comentario
 */
async function deleteCommentAction(commentId) {
    try {
        closeCommentOptions(commentId);
        
        // Crear modal de confirmación elegante
        const confirmModal = await createDeleteConfirmModal();
        
        if (!confirmModal) {
            return; // Usuario canceló
        }
        
        if (typeof showNotification === 'function') {
            showNotification('🗑️ Eliminando comentario...', 'info');
        }
        
        const response = await fetch('/php/eliminar_comentario.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comentario_id: commentId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Comentario eliminado:', data);
            
            // Remover del DOM con animación
            removeCommentFromDOM(commentId);
            
            // Si era una respuesta, actualizar contador del padre
            if (data.es_respuesta && data.parent_id && data.nuevo_contador_respuestas_padre !== null) {
                updateParentRepliesCounter(data.parent_id, data.nuevo_contador_respuestas_padre);
            }
            
            // Actualizar contador global de comentarios de la publicación
            if (typeof updateOriginalPostCommentCountReal === 'function' && data.total_comments_publicacion !== undefined) {
                updateOriginalPostCommentCountReal(data.total_comments_publicacion);
            }
            
            // Mostrar notificación de éxito
            if (typeof showNotification === 'function') {
                showNotification(data.message, 'success');
            }
        } else {
            throw new Error(data.message || 'Error al eliminar comentario');
        }
        
    } catch (error) {
        console.error('❌ Error eliminando comentario:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error: ' + error.message, 'error');
        }
    }
}

/**
 * Crear modal de confirmación elegante para eliminar
 * @returns {Promise<boolean>} true si confirma, false si cancela
 */
function createDeleteConfirmModal() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'delete-confirm-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 1rem;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a24 0%, #252532 100%);
            border-radius: 20px;
            padding: 2rem;
            max-width: 420px;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 1rem;
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                ">🗑️</div>
                <h3 style="
                    margin: 0 0 0.5rem 0;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">Eliminar comentario</h3>
                <p style="
                    margin: 0;
                    color: var(--text-secondary, #9ca3af);
                    font-size: 0.95rem;
                    line-height: 1.5;
                ">¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.</p>
            </div>
            
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                <button class="modal-cancel-btn" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary, #d1d5db);
                    border: none;
                    padding: 0.9rem 1.75rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.95rem;
                    font-family: inherit;
                ">Cancelar</button>
                <button class="modal-delete-btn" style="
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    border: none;
                    padding: 0.9rem 1.75rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.95rem;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                    font-family: inherit;
                ">🗑️ Eliminar</button>
            </div>
        `;

        modal.appendChild(modalContent);

        // Agregar estilos hover
        const style = document.createElement('style');
        style.textContent = `
            .modal-cancel-btn:hover {
                background: rgba(255, 255, 255, 0.15) !important;
                transform: translateY(-2px);
            }
            .modal-delete-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
            }
        `;
        document.head.appendChild(style);

        const cancelBtn = modalContent.querySelector('.modal-cancel-btn');
        const deleteBtn = modalContent.querySelector('.modal-delete-btn');

        // Función para cerrar modal
        function closeModal(confirmed) {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (modal.parentNode) modal.parentNode.removeChild(modal);
                if (style.parentNode) style.parentNode.removeChild(style);
                resolve(confirmed);
            }, 300);
        }

        cancelBtn.addEventListener('click', () => closeModal(false));
        deleteBtn.addEventListener('click', () => closeModal(true));

        // Cerrar con click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(false);
        });

        // Cerrar con ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal(false);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // Agregar al DOM y mostrar con animación
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    });
}

function removeCommentFromDOM(commentId) {
    const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
    
    if (commentElement) {
        // Animación de salida
        commentElement.style.transition = 'all 0.3s ease';
        commentElement.style.opacity = '0';
        commentElement.style.transform = 'translateX(-20px)';
        
        // Remover después de la animación
        setTimeout(() => {
            commentElement.remove();
            console.log('🗑️ Comentario removido del DOM:', commentId);
        }, 300);
    } else {
        console.warn('⚠️ Elemento de comentario no encontrado en DOM:', commentId);
    }
}

/**
 * Actualizar contador de respuestas del comentario padre
 */
function updateParentRepliesCounter(parentId, newCount) {
    const toggleBtn = document.querySelector(`[data-comment-id="${parentId}"].replies-toggle-btn`);
    
    if (toggleBtn) {
        if (newCount === 0) {
            // Si ya no hay respuestas, ocultar el botón y el contenedor
            const repliesContainer = document.getElementById(`replies-container-${parentId}`);
            if (repliesContainer) {
                repliesContainer.remove();
            }
            toggleBtn.parentElement.remove();
        } else {
            // Actualizar texto del botón
            toggleBtn.textContent = `Ver ${newCount} respuesta${newCount > 1 ? 's' : ''}`;
        }
        
        console.log('🔄 Contador de respuestas actualizado para comentario padre:', parentId, '→', newCount);
    }
}

/**
 * Acción de reportar comentario (placeholder)
 * @param {string} commentId - ID del comentario
 */

async function reportCommentAction(commentId) {
    try {
        closeCommentOptions(commentId);
        
        // Verificar que existe la función global de reportes
        if (typeof reportarContenido === 'function') {
            // Usar el sistema existente de reportes
            await reportarContenido('comentario', commentId);
        } else {
            // Fallback si no existe la función global
            console.warn('⚠️ Función reportarContenido no encontrada, usando sistema alternativo');
            await reportCommentFallback(commentId);
        }
        
    } catch (error) {
        console.error('❌ Error reportando comentario:', error);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error al reportar comentario', 'error');
        }
    }
}

/**
 * Inicializar sistema de opciones de comentarios
 * Debe llamarse cuando se carguen los comentarios
 */
function initializeCommentOptions() {
    // Cerrar menús con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && CommentOptionsSystem.activeMenu) {
            closeAllCommentOptions();
        }
    });
    
    console.log('✅ Sistema de opciones de comentarios inicializado');
}

// Auto-inicializar si el DOM está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommentOptions);
} else {
    initializeCommentOptions();
}

// Exportar funciones para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createCommentOptionsButton,
        toggleCommentOptions,
        closeCommentOptions,
        closeAllCommentOptions,
        deleteCommentAction,
        reportCommentAction,
        initializeCommentOptions
    };
}

/**
 * Sistema alternativo de reporte (por si acaso)
 */
async function reportCommentFallback(commentId) {
    // Crear modal de selección de motivo
    const motivo = await createReportReasonModal();
    
    if (!motivo) {
        return; // Usuario canceló
    }
    
    if (typeof showNotification === 'function') {
        showNotification('📤 Enviando reporte...', 'info');
    }
    
    const response = await fetch('/php/reportar_contenido.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tipo: 'comentario',
            id: commentId,
            motivo: motivo
        })
    });

    const data = await response.json();
    
    if (data.success) {
        if (typeof showNotification === 'function') {
            showNotification('✅ Reporte enviado. Gracias por ayudar a mantener ChainFeed seguro.', 'success');
        }
    } else {
        throw new Error(data.message || 'Error al enviar reporte');
    }
}

/**
 * Modal simple de selección de motivo (fallback)
 */
function createReportReasonModal() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'report-reason-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 1rem;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a24 0%, #252532 100%);
            border-radius: 20px;
            padding: 2rem;
            max-width: 450px;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            transform: scale(0.9);
            transition: transform 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        `;

        modalContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚨</div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; color: white;">
                    Reportar comentario
                </h3>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                    ⚠️ Tu reporte será revisado por nuestro equipo
                </p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <p style="margin: 0 0 1rem 0; color: var(--text-secondary); font-weight: 600; font-size: 0.95rem;">
                    Selecciona el motivo del reporte:
                </p>
                
                <div class="report-options">
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="contenido_inapropiado" checked style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">⚠️ Contenido inapropiado</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Contenido sexual, violento o perturbador</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="spam" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">📧 Spam</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Contenido repetitivo o irrelevante</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="acoso" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">😡 Acoso o bullying</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Intimidación o hostigamiento</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="contenido_violento" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">🔪 Contenido violento</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Violencia gráfica o amenazas</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReason" value="desinformacion" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">❌ Información falsa</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Desinformación o noticias falsas</div>
                        </div>
                    </label>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                <button class="modal-cancel-btn" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    border: none;
                    padding: 0.9rem 1.75rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.95rem;
                    font-family: inherit;
                ">Cancelar</button>
                <button class="modal-report-btn" style="
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    border: none;
                    padding: 0.9rem 1.75rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.95rem;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                    font-family: inherit;
                ">🚨 Enviar reporte</button>
            </div>
        `;

        modal.appendChild(modalContent);

        const style = document.createElement('style');
        style.textContent = `
            .report-option:hover {
                background: rgba(99, 102, 241, 0.1) !important;
                border-color: rgba(99, 102, 241, 0.3) !important;
                transform: translateX(5px);
            }
            .modal-cancel-btn:hover {
                background: rgba(255, 255, 255, 0.15) !important;
                transform: translateY(-2px);
            }
            .modal-report-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
            }
        `;
        document.head.appendChild(style);

        const cancelBtn = modalContent.querySelector('.modal-cancel-btn');
        const reportBtn = modalContent.querySelector('.modal-report-btn');

        function closeModal(motivo = null) {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (modal.parentNode) modal.parentNode.removeChild(modal);
                if (style.parentNode) style.parentNode.removeChild(style);
                resolve(motivo);
            }, 300);
        }

        cancelBtn.addEventListener('click', () => closeModal(null));
        
        reportBtn.addEventListener('click', () => {
            const selectedReason = modalContent.querySelector('input[name="reportReason"]:checked');
            if (selectedReason) {
                closeModal(selectedReason.value);
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(null);
        });

        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal(null);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    });
}

console.log('✅ opciones_comentario.js cargado correctamente');