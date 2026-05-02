/**
 * Generar avatar para usuarios en participaciones
 */
function generateUserAvatar(username, avatarUrl) {
    if (avatarUrl && avatarUrl.trim() !== '') {
        return `<img src="${avatarUrl}" alt="${username}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" 
                     onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(username)}';">`;
    } else {
        // Usar iniciales como fallback
        return generateAvatarInitials(username);
    }
}

/**
 * Generar iniciales para avatar
 */
function generateAvatarInitials(username) {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
}

/**
 * Crear enlace de perfil
 */
function createProfileLink(username, displayText) {
    return `<span onclick="goToUserProfile('${username}')" style="cursor: pointer; text-decoration: none;" 
                  onmouseover="this.style.textDecoration='underline'" 
                  onmouseout="this.style.textDecoration='none'">${displayText}</span>`;
}

/**
 * Formatear duración de audio
 */
function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function viewEventSubmissions(eventId) {
    console.log('👀 viewEventSubmissions llamada con:', eventId, typeof eventId);
    
    if (!eventId) {
        showNotification('❌ Error al cargar participaciones', 'error');
        return;
    }
    
    try {
        // ✅ MANEJAR TANTO STRING COMO NÚMERO
        let numericEventId;
        if (typeof eventId === 'string') {
            // Si viene como "chain-24", limpiar
            numericEventId = parseInt(eventId.replace('chain-', ''));
        } else if (typeof eventId === 'number') {
            // Si ya es número, usar directamente
            numericEventId = eventId;
        } else {
            throw new Error('ID de evento inválido: ' + eventId);
        }
        
        console.log('📤 Enviando evento_id:', numericEventId);
        
        const response = await fetch('/php/obtener_participaciones.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                evento_id: numericEventId
            })
        });

        const data = await response.json();
        console.log('📥 Respuesta del servidor:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Error desconocido');
        }

        // ✅ GUARDAR DATOS GLOBALMENTE
        window.currentEventData = data;

        const modal = document.getElementById('submissionsModal');
        const content = document.getElementById('submissionsContent');
        
        if (!modal || !content) {
            throw new Error('Modal o contenido no encontrado en el DOM');
        }
        
        // Guardar eventId para recargas
        modal.dataset.currentEventId = numericEventId;
        
        const titleText = data.tipo === 'poll' ? 'Resultados de Votación' : 'Participaciones';
        const titleElement = document.querySelector('.submissions-title');
        if (titleElement) {
            titleElement.textContent = `👀 ${titleText}: ${data.evento.titulo}`;
        }
        
        if (data.tipo === 'poll') {
            renderPollResults(data, content);
        } else {
            renderCampaignParticipations(data, content);
        }
        
modal.classList.add('active');
const scrollY = window.scrollY;
document.body.style.position = 'fixed'; // ⚠️ CRÍTICO: agregar position fixed
document.body.style.top = `-${scrollY}px`;
document.body.style.width = '100%'; // ⚠️ IMPORTANTE: evitar salto de layout
document.body.classList.add('modal-open');
console.log('📌 Modal abierto - Scroll guardado:', scrollY);
        
        console.log('✅ Modal de participaciones abierto correctamente');

    } catch (error) {
        console.error('❌ Error cargando participaciones:', error);
        showNotification('❌ Error al cargar participaciones: ' + error.message, 'error');
    }
}

function renderPollResults(data, content) {
    const stats = data.estadisticas;
    
    if (stats.total_votos === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                <h3>Sin votos aún</h3>
                <p>¡Sé el primero en votar en esta encuesta!</p>
            </div>
        `;
        return;
    }

    let votesHTML = `
        <div style="margin-bottom: 2rem; text-align: center; padding: 1rem; background: rgba(99, 102, 241, 0.1); border-radius: 12px;">
            <h4 style="margin: 0; color: var(--primary);">📊 Resultados de la Encuesta</h4>
            <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Total de votos: ${stats.total_votos}</p>
        </div>
        <div class="poll-results">
    `;
    
    data.poll_options.forEach((option, index) => {
        const percentage = stats.porcentajes[index] || 0;
        const voteCount = stats.votos_por_opcion[index] || 0;
        const isUserVote = data.user_vote === index;
        
        votesHTML += `
            <div class="poll-result-item" style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600; ${isUserVote ? 'color: var(--primary);' : ''}">${option} ${isUserVote ? '✓ Tu voto' : ''}</span>
                    <span style="font-weight: 600; color: var(--primary);">${percentage.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(37, 37, 50, 0.5); border-radius: 8px; height: 30px; position: relative; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, var(--primary), var(--accent)); height: 100%; width: ${percentage}%; transition: width 0.8s ease-in-out; border-radius: 8px;"></div>
                    <div style="position: absolute; top: 50%; left: 1rem; transform: translateY(-50%); color: white; font-size: 0.9rem; font-weight: 600; z-index: 2; background: blueviolet; padding: 0rem 0.5rem;border-radius: 20px;">
                        ${voteCount} voto${voteCount !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    votesHTML += '</div>';
    content.innerHTML = votesHTML;
}

function renderCampaignParticipations(data, content) {
    console.log('🎨 Renderizando participaciones de campaña');
    
    if (data.participaciones.length === 0) {
        content.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">👀</div>
                <h3>Sin participaciones aún</h3>
                <p>¡Sé el primero en participar en esta campaña!</p>
            </div>
        `;
        return;
    }

    let submissionsHTML = '';
    
    data.participaciones.forEach((submission, index) => {
        // ✅ Determinar color del borde según estado
        let borderColor = 'rgba(245, 158, 11, 0.3)'; // Pendiente (naranja)
        let bgColor = 'rgba(245, 158, 11, 0.05)';
        
        if (submission.status === 'approved') {
            borderColor = 'rgba(255, 255, 255, 0.03)'; // Verde
            bgColor = 'rgba(255, 255, 255, 0.1)';
        } else if (submission.status === 'rejected') {
            borderColor = 'rgba(239, 68, 68, 0.3)'; // Rojo
            bgColor = 'rgba(239, 68, 68, 0.05)';
        }
        
        submissionsHTML += `
            <div class="submission-item" data-submission-id="${submission.id}" style="
                background: ${bgColor};
                border: 1px solid ${borderColor};
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
            ">
                <div class="submission-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                    <div class="submission-avatar" onclick="goToUserProfile('${submission.author.username}')" style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer; transition: 0.3s; transform: scale(1);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        ${generateUserAvatar(submission.author.username, submission.author.avatar_url)}
                    </div>
                    <div style="flex: 1;">
                        <div class="submission-username" style="font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem;">
                            <span class="profile-link" onclick="goToUserProfile('${submission.author.username}')" style="cursor: pointer; transition: all 0.3s ease;" data-no-translate="true">@${submission.author.username}</span>
                            ${submission.author.verified ? '<span style="color: var(--primary); font-size: 0.9rem; margin-left: 0.25rem;">✓</span>' : ''}
                        </div>
                        <div class="submission-time" style="font-size: 0.85rem; color: var(--text-secondary);">
                            ${formatTimeAgo(submission.createdAt)}
                        </div>
                    </div>
                    ${getStatusBadgeHTML(submission.status)}
                </div>
                
                ${submission.content ? `
                    <div class="submission-text" style="margin-bottom: 1rem; line-height: 1.6; font-size: 0.95rem; color: var(--text);">
                        ${submission.content}
                    </div>
                ` : ''}
                
                ${submission.mediaUrl ? `
                    <div class="submission-media" style="margin-bottom: 0.5rem; border-radius: 12px; overflow: hidden;">
                        ${isAudioFile(submission) ? 
                            `<div class="submission-audio-player" style="background: rgba(99, 102, 241, 0.1); border-radius: 12px; padding: 1rem;">
                                <audio controls style="width: 100%; margin-bottom: 0.5rem;" preload="metadata" id="submission-audio-${submission.id}" onloadedmetadata="updateSubmissionAudioDuration('${submission.id}')" onerror="handleSubmissionAudioError('${submission.id}')">
                                    <source src="${submission.mediaUrl}" type="audio/webm">
                                    <source src="${submission.mediaUrl}" type="audio/mp4">
                                    <source src="${submission.mediaUrl}" type="audio/wav">
                                    <source src="${submission.mediaUrl}" type="audio/mp3">
                                    Tu navegador no soporta la reproducción de audio.
                                </audio>
                                <div class="audio-submission-info" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
                                    <span class="audio-icon" style="font-size: 1.2rem;">🎵</span>
                                    <span class="audio-name" style="flex: 1; margin: 0 1rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${submission.fileName || 'Audio de respuesta'}</span>
                                    <span class="audio-duration" id="duration-${submission.id}" style="font-weight: 600; color: var(--primary);">${submission.duration ? formatDuration(submission.duration) : 'Cargando...'}</span>
                                </div>
                            </div>` :
isVideoFile(submission) ? 
    `<video src="${submission.mediaUrl}" class="card-video" muted loop playsinline preload="metadata" style="max-width: 100%; height: 350px; max-height: 350px; border-radius: 12px; cursor: pointer;" onclick="openVideoFullscreen(this.parentElement, event)"></video>` :
                                `<img src="${submission.mediaUrl}" alt="Participación" style="max-width: 100%; height: 350px; max-height: 350px; border-radius: 12px; object-fit: cover; cursor: pointer;" onclick="openImageFullscreen(this)" 
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                 <div style="display: none; text-align: center; padding: 2rem; color: var(--text-secondary); border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px;">
                                     📷 Imagen no disponible
                                 </div>`
                        }
                    </div>
                ` : ''}
                
<div class="submission-actions" style="display: flex; align-items: center; gap: 0.5rem; justify-content: flex-start;">

    ${submission.likes_count > 0 ? `
        <button class="post-stat-view-likes" onclick="openLikesModal('participacion', ${submission.id}, event)" title="Ver quién dio like" style="border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.8rem 0 0;
    transition: all 0.2s 
ease;
background: rgba(99, 102, 241, 0.1);
    color: var(--primary);
        border: 1px solid rgb(99 102 241 / 0%) !important;">
            Ver
        </button>
    ` : ''}
    
    <button class="submission-like-btn ${submission.user_liked ? 'liked' : ''}" onclick="toggleParticipationLikeReal('${submission.id}')" style="background: transparent; border: none; color: ${submission.user_liked ? 'var(--error)' : 'var(--text)'}; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; padding: 0.8rem 0 0; border-radius: 8px; transition: all 0.3s ease;">
        ${submission.user_liked ? '❤️' : '🤍'} <span class="like-count" style="margin-top: 0.2rem;">${submission.likes_count}</span>
    </button>
    
    <!-- Botones de aprobar/rechazar se inyectarán aquí por participaciones-controles.js -->
</div>
            </div>
        `;
    });
    
    content.innerHTML = submissionsHTML;

    // ✅ APLICAR FILTROS DE VISIBILIDAD INMEDIATAMENTE
    console.log('🎯 Aplicando filtros de visibilidad...');
    if (typeof applyParticipationVisibilityFilters === 'function') {
        setTimeout(() => {
            applyParticipationVisibilityFilters(data);
        }, 100);
    } else {
        console.error('❌ applyParticipationVisibilityFilters no está definida');
    }

    // Cargar audios
    setTimeout(() => {
        const submissionAudios = content.querySelectorAll('audio[id^="submission-audio-"]');
        submissionAudios.forEach(audio => {
            audio.load();
            if (audio.readyState >= 1) {
                audio.dispatchEvent(new Event('loadedmetadata'));
            }
        });
    }, 100);
}/**
 * Obtener badge de estado con estilos inline
 */
function getStatusBadgeHTML(status) {
    let badgeColor, badgeBg, badgeText;
    
    switch (status) {
        case 'pending':
            badgeColor = '#f59e0b';
            badgeBg = 'rgba(245, 158, 11, 0.2)';
            badgeText = '⏳ Pendiente';
            break;
        case 'approved':
            badgeColor = '#10b981';
            badgeBg = 'rgba(16, 185, 129, 0.2)';
            badgeText = '✅ Aprobada';
            break;
        case 'rejected':
            badgeColor = '#ef4444';
            badgeBg = 'rgba(239, 68, 68, 0.2)';
            badgeText = '❌ Rechazada';
            break;
        default:
            badgeColor = '#6b7280';
            badgeBg = 'rgba(107, 114, 128, 0.2)';
            badgeText = '❓ Desconocido';
    }
    
    return `<span style="background: ${badgeBg}; color: ${badgeColor}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${badgeText}</span>`;
}

function closeSubmissionsModal() {
    const modal = document.getElementById('submissionsModal');
    if (!modal) return;
    
    // ✅ Remover clase active del modal
    modal.classList.remove('active');
    
    // ✅ RESTAURAR SCROLL CORRECTAMENTE
    const scrollY = document.body.style.top;
    document.body.classList.remove('modal-open');
    document.body.style.position = ''; // ⚠️ IMPORTANTE: limpiar position
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = ''; // ⚠️ IMPORTANTE: limpiar overflow
    
    // ✅ Restaurar posición del scroll
    if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    
    console.log('✅ Modal cerrado correctamente');
}

// ============================================
// CERRAR MODAL CON CLIC EXTERNO - USAR LA MISMA FUNCIÓN QUE LA ×
// ============================================
(function() {
    'use strict';
    
    function setupModalClose() {
        const modal = document.getElementById('submissionsModal');
        if (!modal) return;
        
        // SOLO detectar clic externo y llamar a closeSubmissionsModal()
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                console.log('🖱️ Clic externo → llamando a closeSubmissionsModal()');
                closeSubmissionsModal(); // ✅ La misma función que usa la ×
            }
        });
        
        console.log('✅ Clic externo configurado');
    }
    
    // Ejecutar cuando esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupModalClose);
    } else {
        setupModalClose();
    }
})();

/**
 * Obtener texto del estado
 */
function getStatusText(status) {
    switch (status) {
        case 'pending': return '⏳ Pendiente';
        case 'approved': return '✅ Aprobada';
        case 'rejected': return '❌ Rechazada';
        default: return '❓ Desconocido';
    }
}

/**
 * Detectar si es archivo de video
 */
function isVideoFile(submission) {
    if (!submission.mediaUrl) return false;
    
    if (submission.mediaType === 'video') {
        return true;
    }
    
    if (submission.mediaUrl.startsWith('data:video/')) {
        return true;
    }
    
    if (submission.fileName) {
        const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv'];
        return videoExtensions.some(ext => 
            submission.fileName.toLowerCase().endsWith(ext)
        );
    }
    
    return false;
}

/**
 * Detectar si es archivo de audio
 */
function isAudioFile(submission) {
    if (!submission.mediaUrl) return false;
    
    if (submission.mediaType === 'audio') {
        return true;
    }
    
    if (submission.mediaUrl.startsWith('data:audio/')) {
        return true;
    }
    
    if (submission.fileName) {
        const audioExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
        return audioExtensions.some(ext => 
            submission.fileName.toLowerCase().endsWith(ext)
        );
    }
    
    return false;
}

/**
 * Actualizar duración de audio en participaciones
 */
function updateSubmissionAudioDuration(submissionId) {
    const audio = document.getElementById(`submission-audio-${submissionId}`);
    const durationElement = document.getElementById(`duration-${submissionId}`);
    
    if (audio && durationElement) {
        if (audio.duration && !isNaN(audio.duration)) {
            durationElement.textContent = formatDuration(audio.duration);
        } else {
            audio.load();
            
            let attempts = 0;
            const checkDuration = setInterval(() => {
                attempts++;
                if (audio.duration && !isNaN(audio.duration)) {
                    durationElement.textContent = formatDuration(audio.duration);
                    clearInterval(checkDuration);
                } else if (attempts >= 30) {
                    durationElement.textContent = '00:00';
                    clearInterval(checkDuration);
                }
            }, 100);
        }
    }
}

function handleSubmissionAudioError(submissionId) {
    const durationElement = document.getElementById(`duration-${submissionId}`);
    if (durationElement) {
        durationElement.textContent = '00:00';
        durationElement.style.color = 'var(--text-secondary)';
    }
}

/**
 * Dar/quitar like a una participación
 */
async function toggleParticipationLikeReal(participationId) {
    try {
        const clickEvent = window.event || arguments.callee.caller.arguments[0];
        const button = clickEvent ? clickEvent.target.closest('.submission-like-btn') : 
                      document.querySelector(`[onclick*="toggleParticipationLikeReal('${participationId}')"]`);
        
        if (!button) {
            return;
        }
        
        button.classList.add('action-feedback');
        button.disabled = true;
        
        const cleanId = participationId.toString().replace('chain-', '');
        const numericId = parseInt(cleanId);
        
        if (isNaN(numericId) || numericId <= 0) {
            throw new Error('ID de participación inválido');
        }
        
const response = await fetch('/php/manejar_likes_participaciones.php', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        participacion_id: numericId
    })
});

// ✅ PRIMERO leer el JSON
const data = await response.json();

// ✅ LUEGO verificar si hubo error
if (!data.success) {
    throw new Error(data.message || 'Error desconocido');
}

// Si llegamos aquí, todo está bien
if (data.liked) {
            if (data.liked) {
                button.classList.add('liked');
                button.style.color = 'var(--error)';
                button.innerHTML = `❤️ <span class="like-count">${data.new_like_count}</span>`;
                showNotification('❤️ ¡Like dado! +1 CFT al participante', 'success');
                
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            } else {
                button.classList.remove('liked');
                button.style.color = 'var(--text)';
                button.innerHTML = `🤍 <span class="like-count">${data.new_like_count}</span>`;
                showNotification('💔 Like removido');
            }
            
        } else {
            throw new Error(data.message || 'Error al procesar like');
        }

    } catch (error) {
        console.error('❌ Error en like:', error);
        showNotification('❌ Error: ' + error.message, 'error');
    } finally {
        setTimeout(() => {
            document.querySelectorAll('.submission-like-btn').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('action-feedback');
            });
        }, 600);
    }
}

window.toggleParticipationLikeReal = toggleParticipationLikeReal;

console.log('✅ modal_participantes.js cargado con sistema de filtrado integrado');