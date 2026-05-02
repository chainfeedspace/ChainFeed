// ============================================
// SISTEMA DE PARTICIPACIÓN EN CAMPAÑAS
// ============================================

const ParticipationSystem = {
    currentEvent: null,
    selectedFile: null,
    filePreviewUrl: null,
    submissions: [],
    participationLikes: {}
};

function getCurrentUser() {
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

function participateInCampaign(eventId) {
    console.log('🎯 participateInCampaign para:', eventId);
    
    const eventIdStr = String(eventId);
    
    // Buscar evento en todas las fuentes posibles
    let event = null;
    
    if (window.ChainSystem?.events) {
        event = window.ChainSystem.events.find(e => String(e.id) === eventIdStr);
    }
    
    if (!event && window.chainEventsData) {
        event = window.chainEventsData.find(e => String(e.id) === eventIdStr);
    }
    
    if (!event) {
        console.error('❌ Evento no encontrado:', eventId);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error: Evento no encontrado', 'error');
        }
        return;
    }
    
    console.log('✅ Evento encontrado:', event.titulo);
    
    // Verificar tipo
    if (event.tipo !== 'campaign' && event.tipo !== 'audio') {
        console.error('❌ Tipo de evento no válido:', event.tipo);
        if (typeof showNotification === 'function') {
            showNotification('❌ Este evento no permite participaciones', 'error');
        }
        return;
    }
    
    // Verificar si ya participó
    const currentUsername = window.CHAINFEED_CONFIG?.currentUser?.username || getCurrentUser();
    
    if (currentUsername) {
        const participationKey = `participated_${eventIdStr}_${currentUsername}`;
        if (localStorage.getItem(participationKey)) {
            if (typeof showNotification === 'function') {
                showNotification('❌ Ya has participado en este evento', 'error');
            }
            return;
        }
    }
    
    // Verificar si aún hay lugares
    if (event.participantes >= event.winners_count) {
        if (typeof showNotification === 'function') {
            showNotification('❌ Este evento ya alcanzó el máximo de participantes', 'error');
        }
        return;
    }
    
    // ASIGNAR EVENTO - CRÍTICO: Debe hacerse ANTES de llamar a openParticipateModal
    ParticipationSystem.currentEvent = event;
    console.log('✅ ParticipationSystem.currentEvent asignado');
    
    // Abrir modal
    openParticipateModal();
}

function openParticipateModal() {
    console.log('🎯 openParticipateModal ejecutándose...');
    
    const modal = document.getElementById('participateModal');
    const event = ParticipationSystem.currentEvent;
    
    if (!modal) {
        console.error('❌ Modal no encontrado');
        return;
    }
    
    if (!event) {
        console.error('❌ Evento no disponible en ParticipationSystem.currentEvent');
        return;
    }
    
    // Configurar título según tipo de evento
    const titleEl = document.getElementById('participateTitle');
    if (titleEl) {
        titleEl.textContent = event.tipo === 'audio' ? `🎵 ${event.titulo}` : `🎯 ${event.titulo}`;
    }
    
    // Configurar info del evento
    const rewardPerWinner = Math.floor((event.reward_total || 0) / (event.winners_count || 1));
    const eventInfoEl = document.getElementById('participateEventInfo');
    if (eventInfoEl) {
        eventInfoEl.innerHTML = `
            <div class="event-summary">
                <strong>💎 Recompensa:</strong> ${rewardPerWinner} CFT por ganador<br>
                <strong>🏆 Ganadores:</strong> ${event.winners_count || 0} usuarios<br>
                <strong>👥 Participantes actuales:</strong> ${event.participantes || 0}/${event.winners_count || 0}<br>
                <strong>📄 Tipo de respuesta:</strong> ${getResponseTypeName(event.response_type)}
            </div>
        `;
    }
    
    // Configurar instrucciones
    const instructionsEl = document.getElementById('participateInstructions');
    if (instructionsEl) {
        instructionsEl.innerHTML = getParticipationInstructions(event.response_type);
    }
    
    // Configurar secciones de input
    setupParticipationInput(event.response_type);
    
    // Mostrar modal
    modal.classList.add('active');
    
    // Bloquear scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Focus apropiado
    setTimeout(() => {
        if (event.response_type === 'text') {
            const textInput = document.getElementById('participateTextInput');
            if (textInput) textInput.focus();
        }
    }, 300);
    
    console.log('✅ Modal abierto correctamente');
}


function closeParticipateModal() {
    const modal = document.getElementById('participateModal');
    if (!modal) return;
    
    // ✅ CRÍTICO: Limpiar grabación ANTES de cerrar
    cleanupParticipationAudio();
    
    modal.classList.remove('active');
    
    // ✅ RESTAURAR SCROLL COMPLETAMENTE
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    setTimeout(() => {
        ParticipationSystem.currentEvent = null;
        cleanupParticipationInput();
        
        // ✅ RESTAURAR BOTONES AL CERRAR MODAL
        showMediaButtons();
    }, 300);
}

function setupParticipationInput(responseType) {
    // Ocultar todas las secciones
    document.getElementById('textInputSection').classList.add('hidden');
    document.getElementById('mediaInputSection').classList.add('hidden');
    
    if (responseType === 'text') {
        document.getElementById('textInputSection').classList.remove('hidden');
    } else if (responseType === 'audio') {
        // Para audio, crear sección especial con dos botones
        document.getElementById('mediaInputSection').classList.remove('hidden');
        
        // Reemplazar el botón único por dos botones para audio
        const mediaButtons = document.querySelector('.participate-media-buttons');
        if (mediaButtons) {
            mediaButtons.innerHTML = `
                <div class="audio-participation-controls">
                    <button type="button" class="participate-audio-btn record-btn" onclick="startParticipationRecording()">
                        🎤 Grabar Audio (15s)
                    </button>
                    <button type="button" class="participate-audio-btn upload-btn" onclick="uploadParticipationAudio()">
                        📁 Subir Audio
                    </button>
                </div>
                
                <!-- Recording status para participación -->
                <div class="participation-recording-status hidden" id="participationRecordingStatus">
                    <div class="recording-indicator">
                        <div class="recording-dot"></div>
                        <span id="participationRecordingTime">00:00</span>
                    </div>
                    <button type="button" class="stop-recording-btn" onclick="stopParticipationRecording()">
                        ⏹️ Detener
                    </button>
                </div>
            `;
        }
    } else {
        // Para imagen/video, usar el botón original
        document.getElementById('mediaInputSection').classList.remove('hidden');
        
        const mediaButtons = document.querySelector('.participate-media-buttons');
        if (mediaButtons) {
            const mediaIcon = responseType === 'image' ? '📷' : '🎥';
            const mediaText = responseType === 'image' ? 'Seleccionar Imagen' : 'Seleccionar Video';
            
            mediaButtons.innerHTML = `
                <button class="participate-media-btn" onclick="selectParticipationMedia()">
                    ${mediaIcon} ${mediaText}
                </button>
            `;
        }
    }
}

function selectParticipationMedia() {
    const event = ParticipationSystem.currentEvent;
    if (!event) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    
    if (event.response_type === 'image') {
        input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
    } else if (event.response_type === 'video') {
        input.accept = 'video/mp4,video/webm,video/ogg,video/avi,video/mov';
    } else if (event.response_type === 'audio') {
        input.accept = 'audio/mp3,audio/wav,audio/webm,audio/m4a,audio/ogg';
    }
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            if (event.response_type === 'audio') {
                handleParticipationAudioSelection(file);
            } else {
                handleParticipationFileSelection(file, event.response_type);
            }
        }
    };
    
    document.body.appendChild(input);
    input.click();
    setTimeout(() => document.body.removeChild(input), 100);
}

async function handleParticipationFileSelection(file, type) {
    try {
        console.log('📁 Archivo de participación seleccionado:', file.name, 'Tipo:', type);
        
        // ✅ OCULTAR BOTONES DE SELECCIÓN AL INICIAR
        hideMediaButtons();
        
        // Validar tamaño ANTES de comprimir
        const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        
        if (file.size > maxSize) {
            throw new Error(`Archivo muy grande. Máximo ${maxSize / (1024 * 1024)}MB`);
        }
        
        // Validar tipo
        if (!isValidFileType(file, type)) {
            throw new Error('Tipo de archivo no válido');
        }

        // ============================================
        // VALIDACIÓN DE DURACIÓN PARA VIDEOS
        // ============================================
        if (type === 'video') {
            console.log('🎬 Validando duración del video de participación...');
            
            const duration = await getSimpleVideoDuration(file);
            console.log(`⏱️ Duración detectada: ${duration.toFixed(1)}s`);
            
            const maxDuration = 7;
            
            if (duration > maxDuration) {
                throw new Error(
                    `Video muy largo para participación. Máximo ${maxDuration} segundos (actual: ${Math.round(duration)}s)`
                );
            }
            
            console.log(`✅ Duración válida: ${duration.toFixed(1)}s (máx: ${maxDuration}s)`);
        }

        // Limpiar URL anterior si existe
        if (ParticipationSystem.filePreviewUrl) {
            URL.revokeObjectURL(ParticipationSystem.filePreviewUrl);
            ParticipationSystem.filePreviewUrl = null;
        }

        let finalFile = file;
        let wasCompressed = false;
        let compressionStats = null;

        // ============================================
        // COMPRESIÓN DE IMÁGENES PARA PARTICIPACIONES
        // ============================================
        if (type === 'image') {
            const fileSizeMB = file.size / (1024 * 1024);
            console.log(`📊 Tamaño de imagen de participación: ${fileSizeMB.toFixed(2)}MB`);
            
            // Comprimir si es mayor a 500KB
            const shouldCompress = file.size > 512000;
            
            if (shouldCompress) {
                console.log('🔧 COMPRESIÓN DE IMAGEN ACTIVADA: Imagen > 500KB');
                
                try {
                    showCompressionProgress(true);
                    
                    // Verificar que ImageCompressor esté disponible
                    if (typeof ImageCompressor === 'undefined') {
                        console.warn('⚠️ ImageCompressor no disponible, subiendo imagen original');
                        throw new Error('Compresor de imágenes no disponible');
                    }
                    
                    const imageCompressor = new ImageCompressor({
                        maxHeight: 1920,
                        quality: 0.85,
                        format: 'image/jpeg',
                        forceVertical: true, // Rotar horizontales a vertical
                        progressCallback: (percent, status) => {
                            updateCompressionProgress(percent, status);
                            console.log(`📊 Progreso imagen: ${percent.toFixed(1)}% - ${status}`);
                        }
                    });
                    
                    const compressionResult = await imageCompressor.compress(file);
                    
                    finalFile = compressionResult.file;
                    wasCompressed = true;
                    compressionStats = compressionResult.stats;
                    
                    const savingsMB = (compressionStats.savings / (1024 * 1024)).toFixed(2);
                    const finalSizeMB = (compressionStats.compressedSize / (1024 * 1024)).toFixed(2);
                    
                    console.log('✅ COMPRESIÓN DE IMAGEN EXITOSA:', {
                        original: `${fileSizeMB.toFixed(2)}MB`,
                        final: `${finalSizeMB}MB`,
                        ahorro: `${savingsMB}MB (${compressionStats.savingsPercent}%)`,
                        rotada: compressionStats.rotated ? 'Sí' : 'No'
                    });
                    
                    showNotification(
                        `✅ Imagen optimizada: ${compressionStats.savingsPercent}% más ligera (${savingsMB}MB ahorrados)`,
                        'success'
                    );
                    
                } catch (compressionError) {
                    console.warn('⚠️ Error comprimiendo imagen, usando original:', compressionError);
                    showNotification('⚠️ No se pudo optimizar la imagen, usando original', 'warning');
                    finalFile = file;
                    wasCompressed = false;
                } finally {
                    showCompressionProgress(false);
                }
                
            } else {
                console.log(`ℹ️ Sin compresión: Imagen pequeña (${fileSizeMB.toFixed(2)}MB < 0.5MB)`);
            }
        }

        // ============================================
        // COMPRESIÓN DE VIDEO PARA PARTICIPACIONES
        // ============================================
        if (type === 'video') {
            const fileSizeMB = file.size / (1024 * 1024);
            console.log(`📊 Tamaño del video de participación: ${fileSizeMB.toFixed(2)}MB`);
            
            const shouldCompress = file.size > 3 * 1024 * 1024;
            
            if (shouldCompress) {
                console.log('🔧 COMPRESIÓN DE VIDEO ACTIVADA: Video participación > 3MB');
                
                try {
                    showCompressionProgress(true);
                    
                    const compressionResult = await compressVideoWithConfig(
                        file,
                        'CAMPAIGN_PARTICIPATION',
                        (percent, status) => {
                            updateCompressionProgress(percent, status);
                            console.log(`📊 Progreso video: ${percent.toFixed(1)}% - ${status}`);
                        }
                    );
                    
                    finalFile = compressionResult.file;
                    wasCompressed = true;
                    compressionStats = compressionResult.stats;
                    
                    const savingsMB = (compressionStats.savings / (1024 * 1024)).toFixed(2);
                    const finalSizeMB = (compressionStats.compressedSize / (1024 * 1024)).toFixed(2);
                    
                    console.log('✅ COMPRESIÓN DE VIDEO EXITOSA:', {
                        original: `${fileSizeMB.toFixed(2)}MB`,
                        final: `${finalSizeMB}MB`,
                        ahorro: `${savingsMB}MB (${compressionStats.savingsPercent}%)`
                    });
                    
                    showNotification(
                        `✅ Video optimizado: ${compressionStats.savingsPercent}% más ligero (${savingsMB}MB ahorrados)`,
                        'success'
                    );
                    
                } catch (compressionError) {
                    console.warn('⚠️ Error comprimiendo video, usando original:', compressionError);
                    showNotification('⚠️ No se pudo optimizar el video, usando original', 'warning');
                    finalFile = file;
                    wasCompressed = false;
                } finally {
                    showCompressionProgress(false);
                }
                
            } else {
                console.log(`ℹ️ Sin compresión: Video pequeño (${fileSizeMB.toFixed(2)}MB < 3MB)`);
            }
        }

        // Guardar en ParticipationSystem
        ParticipationSystem.selectedFile = finalFile;
        ParticipationSystem.filePreviewUrl = URL.createObjectURL(finalFile);
        
        console.log('💾 Archivo de participación guardado:', {
            nombre: finalFile.name,
            tamaño: formatFileSize(finalFile.size),
            tipo: type,
            comprimido: wasCompressed,
            ahorro: wasCompressed ? `${compressionStats.savingsPercent}%` : 'N/A'
        });

        // Mostrar preview
        showParticipationFilePreview(finalFile, type);
        
        const sizeMsg = wasCompressed 
            ? ` (optimizado: ${(finalFile.size / (1024 * 1024)).toFixed(2)}MB)`
            : ` (${(finalFile.size / (1024 * 1024)).toFixed(2)}MB)`;
        
        showNotification(
            `${finalFile.name} seleccionado${sizeMsg}`,
            'success'
        );
        
    } catch (error) {
        console.error('❌ Error procesando archivo de participación:', error);
        showNotification('❌ ' + error.message, 'error');
        
        // ✅ RESTAURAR BOTONES EN CASO DE ERROR
        showMediaButtons();
        
        // Limpiar en caso de error
        if (ParticipationSystem.filePreviewUrl) {
            URL.revokeObjectURL(ParticipationSystem.filePreviewUrl);
            ParticipationSystem.filePreviewUrl = null;
        }
        ParticipationSystem.selectedFile = null;
    }
}

function checkCompressorsAvailability() {
    const status = {
        imageCompressor: typeof ImageCompressor !== 'undefined',
        videoCompressor: typeof VideoCompressor !== 'undefined',
        compressVideoWithConfig: typeof compressVideoWithConfig !== 'undefined'
    };
    
    console.log('🔍 Estado de compresores:', status);
    
    if (!status.imageCompressor) {
        console.warn('⚠️ ImageCompressor no disponible - Las imágenes no se comprimirán en el frontend');
    }
    
    if (!status.videoCompressor || !status.compressVideoWithConfig) {
        console.warn('⚠️ VideoCompressor no disponible - Los videos no se comprimirán en el frontend');
    }
    
    return status;
}

// Verificar al cargar
document.addEventListener('DOMContentLoaded', () => {
    checkCompressorsAvailability();
});

async function handleParticipationAudioSelection(file) {
    try {
        if (!file.type.startsWith('audio/')) {
            throw new Error('El archivo seleccionado no es un audio válido');
        }
        
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('El archivo de audio es muy grande. Máximo 5MB');
        }
        
        const duration = await getAudioDuration(file);
        if (duration > ChainSystem.audioSystem.maxResponseDuration) {
            throw new Error(`El audio es muy largo. Máximo ${ChainSystem.audioSystem.maxResponseDuration} segundos (duración: ${Math.round(duration)}s)`);
        }
        
        if (ParticipationSystem.filePreviewUrl) {
            URL.revokeObjectURL(ParticipationSystem.filePreviewUrl);
        }
        
        ParticipationSystem.selectedFile = file;
        ParticipationSystem.filePreviewUrl = await fileToBase64(file);
        
        showParticipationAudioPreview(file, duration);
        showNotification(`${file.name} seleccionado (${formatDuration(duration)})`);
        
    } catch (error) {
        console.error('Error procesando audio:', error);
        showNotification('❌ ' + error.message, 'error');
    }
}

function showParticipationAudioPreview(file, duration) {
    const container = document.getElementById('participatePreviewContainer');
    if (!container) return;
    
    const previewHTML = `
        <div class="participate-file-preview">
            <div class="preview-header">
                <span>🎵 Audio seleccionado</span>
                <button onclick="removeParticipationFile()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--error); border-radius: 50%; width: 28px; height: 28px; cursor: pointer;">×</button>
            </div>
            <div class="preview-content" style="text-align: center; padding: 1rem;">
                <audio controls style="width: 100%;" preload="metadata">
                    <source src="${ParticipationSystem.filePreviewUrl}" type="${file.type}">
                    Tu navegador no soporta la reproducción de audio.
                </audio>
            </div>
            <div class="preview-info" style="padding: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${file.name}">
                    📄 ${file.name}
                </div>
                <div>⏱️ Duración: ${formatDuration(duration)}</div>
                <div>💾 Tamaño: ${formatFileSize(file.size)}</div>
            </div>
        </div>
    `;
    
    container.innerHTML = previewHTML;
}

function showParticipationFilePreview(file, type) {
    const container = document.getElementById('participatePreviewContainer');
    if (!container) return;
    
    // ✅ DEFINIR TEXTO GENÉRICO SEGÚN TIPO
    let headerText = '';
    let headerIcon = '';
    
    if (type === 'image') {
        headerIcon = '📷';
        headerText = 'Imagen seleccionada';
    } else if (type === 'video') {
        headerIcon = '🎥';
        headerText = 'Video seleccionado';
    } else if (type === 'audio') {
        headerIcon = '🎵';
        headerText = 'Audio seleccionado';
    } else {
        headerIcon = '📄';
        headerText = 'Archivo seleccionado';
    }
    
    let previewHTML = '';
    
    if (type === 'image') {
        previewHTML = `
            <div class="participate-file-preview">
                <div class="preview-header">
                    <span>${headerIcon} ${headerText}</span>
                    <button onclick="removeParticipationFile()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--error); border-radius: 50%; width: 28px; height: 28px; cursor: pointer;">×</button>
                </div>
                <div class="preview-content" style="text-align: center; padding: 1rem;">
                    <img src="${ParticipationSystem.filePreviewUrl}" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 8px;" alt="Preview">
                </div>
                <div class="preview-info" style="padding: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${file.name}">
                        📄 ${file.name}
                    </div>
                    <div>💾 Tamaño: ${formatFileSize(file.size)}</div>
                </div>
            </div>
        `;
    } else if (type === 'video') {
        previewHTML = `
            <div class="participate-file-preview">
                <div class="preview-header">
                    <span>${headerIcon} ${headerText}</span>
                    <button onclick="removeParticipationFile()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--error); border-radius: 50%; width: 28px; height: 28px; cursor: pointer;">×</button>
                </div>
                <div class="preview-content" style="text-align: center; padding: 1rem;">
                    <video src="${ParticipationSystem.filePreviewUrl}" controls style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 8px;"></video>
                </div>
                <div class="preview-info" style="padding: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${file.name}">
                        📄 ${file.name}
                    </div>
                    <div>💾 Tamaño: ${formatFileSize(file.size)}</div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = previewHTML;
}

function removeParticipationFile() {
    if (ParticipationSystem.filePreviewUrl) {
        URL.revokeObjectURL(ParticipationSystem.filePreviewUrl);
    }
    
    ParticipationSystem.selectedFile = null;
    ParticipationSystem.filePreviewUrl = null;
    
    cleanupParticipationAudio();
    
    document.getElementById('participatePreviewContainer').innerHTML = '';
    
    // ✅ RESTAURAR BOTONES AL QUITAR PREVIEW
    showMediaButtons();
}

function cleanupParticipationInput() {
    document.getElementById('participateTextInput').value = '';
    removeParticipationFile();
    cleanupParticipationAudio();
    
    // ✅ ASEGURAR QUE BOTONES ESTÉN VISIBLES AL LIMPIAR
    showMediaButtons();
}

// ============================================
// SISTEMA DE GRABACIÓN PARA PARTICIPACIONES DE AUDIO
// ============================================

const ParticipationAudio = {
    isRecording: false,
    mediaRecorder: null,
    audioChunks: [],
    recordingStartTime: null,
    recordingTimer: null,
    autoStopTimeout: null,
    maxDuration: 15 
};

function cleanupParticipationAudio() {
    console.log('🧹 Limpiando sistema de grabación de participación...');
    
    // Detener grabación si está activa
    if (ParticipationAudio.isRecording && ParticipationAudio.mediaRecorder) {
        if (ParticipationAudio.mediaRecorder.state === 'recording') {
            ParticipationAudio.mediaRecorder.stop();
        }
    }
    
    // ✅ CRÍTICO: Limpiar el timeout automático
    if (ParticipationAudio.autoStopTimeout) {
        clearTimeout(ParticipationAudio.autoStopTimeout);
        ParticipationAudio.autoStopTimeout = null;
        console.log('✅ Timeout automático eliminado');
    }
    
    // Limpiar timer de visualización
    if (ParticipationAudio.recordingTimer) {
        clearInterval(ParticipationAudio.recordingTimer);
        ParticipationAudio.recordingTimer = null;
    }
    
    // Detener streams activos
    if (ParticipationAudio.mediaRecorder?.stream) {
        ParticipationAudio.mediaRecorder.stream.getTracks().forEach(track => {
            track.stop();
            console.log('🎤 Track de audio detenido');
        });
    }
    
    // Resetear todas las variables
    ParticipationAudio.isRecording = false;
    ParticipationAudio.mediaRecorder = null;
    ParticipationAudio.audioChunks = [];
    ParticipationAudio.recordingStartTime = null;
    
    // Resetear UI
    updateParticipationRecordingUI(false);
    
    console.log('✅ Sistema de grabación limpio');
}

async function startParticipationRecording() {
    try {
        console.log('🎤 Iniciando grabación de participación...');
        
        // ✅ CRÍTICO: Limpiar completamente antes de empezar
        cleanupParticipationAudio();
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Tu navegador no soporta grabación de audio');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
        ParticipationAudio.mediaRecorder = new MediaRecorder(stream, { mimeType });
        
        // ✅ Guardar referencia al stream
        ParticipationAudio.mediaRecorder.stream = stream;
        
        ParticipationAudio.audioChunks = [];
        ParticipationAudio.recordingStartTime = Date.now(); // ✅ Timestamp NUEVO
        
        ParticipationAudio.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                ParticipationAudio.audioChunks.push(event.data);
            }
        };
        
        ParticipationAudio.mediaRecorder.onstop = () => {
            console.log('🛑 Grabación detenida');
            processParticipationRecording();
            stream.getTracks().forEach(track => track.stop());
        };
        
        ParticipationAudio.mediaRecorder.start(100);
        ParticipationAudio.isRecording = true;
        
        updateParticipationRecordingUI(true);
        startParticipationTimer();
        
        // ✅ CRÍTICO: Guardar referencia al timeout y usar el timestamp ACTUAL
        ParticipationAudio.autoStopTimeout = setTimeout(() => {
            console.log('⏰ Auto-stop por límite de 15 segundos');
            if (ParticipationAudio.isRecording) {
                stopParticipationRecording();
                showNotification('⏱️ Grabación detenida (máximo 15 segundos)');
            }
        }, ParticipationAudio.maxDuration * 1000);
        
        console.log('✅ Timeout programado para:', ParticipationAudio.maxDuration, 'segundos');
        showNotification('🎤 Grabando respuesta...');
        
    } catch (error) {
        console.error('Error iniciando grabación:', error);
        cleanupParticipationAudio();
        
        if (error.name === 'NotAllowedError') {
            showNotification('❌ Necesitas permitir el acceso al micrófono', 'error');
        } else {
            showNotification('❌ Error: ' + error.message, 'error');
        }
    }
}

function stopParticipationRecording() {
    if (!ParticipationAudio.isRecording || !ParticipationAudio.mediaRecorder) {
        console.log('⚠️ No hay grabación activa para detener');
        return;
    }
    
    console.log('🛑 Deteniendo grabación manualmente...');
    
    // ✅ CRÍTICO: Cancelar el timeout automático inmediatamente
    if (ParticipationAudio.autoStopTimeout) {
        clearTimeout(ParticipationAudio.autoStopTimeout);
        ParticipationAudio.autoStopTimeout = null;
        console.log('✅ Timeout cancelado al detener manualmente');
    }
    
    if (ParticipationAudio.mediaRecorder.state === 'recording') {
        ParticipationAudio.mediaRecorder.stop();
    }
    
    ParticipationAudio.isRecording = false;
    
    if (ParticipationAudio.recordingTimer) {
        clearInterval(ParticipationAudio.recordingTimer);
        ParticipationAudio.recordingTimer = null;
    }
    
    updateParticipationRecordingUI(false);
    showNotification('⏹️ Procesando grabación...');
}

async function processParticipationRecording() {
    try {
        if (ParticipationAudio.audioChunks.length === 0) {
            showNotification('❌ No se pudo procesar la grabación', 'error');
            return;
        }
        
        const mimeType = ParticipationAudio.mediaRecorder.mimeType;
        const audioBlob = new Blob(ParticipationAudio.audioChunks, { type: mimeType });
        const duration = (Date.now() - ParticipationAudio.recordingStartTime) / 1000;
        
        if (duration < 1) {
            showNotification('❌ La grabación es muy corta', 'error');
            return;
        }
        
        ParticipationSystem.filePreviewUrl = await blobToBase64(audioBlob);
        ParticipationSystem.selectedFile = {
            name: `audio_respuesta_${Date.now()}.${mimeType.split('/')[1]}`,
            type: mimeType,
            size: audioBlob.size,
            duration: duration
        };
        
        showParticipationAudioPreview(ParticipationSystem.selectedFile, duration);
        showNotification(`✅ Audio grabado (${formatDuration(duration)})`);
        
        // ✅ Limpiar chunks después de procesar
        ParticipationAudio.audioChunks = [];
        
    } catch (error) {
        console.error('Error procesando grabación:', error);
        showNotification('❌ Error procesando la grabación', 'error');
    }
}

function updateParticipationRecordingUI(isRecording) {
    const recordBtn = document.querySelector('.participate-audio-btn.record-btn');
    const uploadBtn = document.querySelector('.participate-audio-btn.upload-btn');
    const recordingStatus = document.getElementById('participationRecordingStatus');
    
    if (isRecording) {
        if (recordBtn) {
            recordBtn.classList.add('recording');
            recordBtn.textContent = '⏸️ Grabando...';
        }
        if (uploadBtn) uploadBtn.disabled = true;
        if (recordingStatus) recordingStatus.classList.remove('hidden');
    } else {
        if (recordBtn) {
            recordBtn.classList.remove('recording');
            recordBtn.textContent = '🎤 Grabar Audio (15s)';
        }
        if (uploadBtn) uploadBtn.disabled = false;
        if (recordingStatus) recordingStatus.classList.add('hidden');
    }
}

function startParticipationTimer() {
    const timeElement = document.getElementById('participationRecordingTime');
    
    ParticipationAudio.recordingTimer = setInterval(() => {
        if (!ParticipationAudio.isRecording) {
            clearInterval(ParticipationAudio.recordingTimer);
            return;
        }
        
        const elapsed = Math.floor((Date.now() - ParticipationAudio.recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        if (timeElement) {
            timeElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function uploadParticipationAudio() {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.accept = 'audio/mp3,audio/wav,audio/webm,audio/m4a,audio/ogg';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            handleParticipationAudioSelection(file);
        }
    };
    
    document.body.appendChild(input);
    input.click();
    setTimeout(() => document.body.removeChild(input), 100);
}

async function submitParticipation() {
    try {
        const event = ParticipationSystem.currentEvent;
        if (!event) return;

        const submitBtn = document.getElementById('participateSubmitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = 'Enviando... ⏳';
        submitBtn.disabled = true;
        
        let participationData = {
            evento_id: event.id,
        };
        
        // Datos según tipo de respuesta
        if (event.response_type === 'text') {
            const textContent = document.getElementById('participateTextInput').value.trim();
            if (!textContent) {
                throw new Error('Por favor ingresa tu participación');
            }
            participationData.contenido = textContent;
            
        } else if (['image', 'video', 'audio'].includes(event.response_type)) {
            if (!ParticipationSystem.selectedFile) {
                throw new Error(`Por favor selecciona ${event.response_type === 'image' ? 'una imagen' : event.response_type === 'video' ? 'un video' : 'un audio'}`);
            }
            
            submitBtn.innerHTML = 'Subiendo archivo... 📤';
            
            let mediaUrl;
            let mediaFilename = ParticipationSystem.selectedFile.name || 'archivo_participacion';
            
            // Determinar si usar FormData o base64
            if (ParticipationSystem.selectedFile instanceof File) {
                const formData = new FormData();
                formData.append('participation_file', ParticipationSystem.selectedFile);
                
                const uploadResponse = await fetch('/php/subir_archivo_participacion.php', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                const uploadData = await uploadResponse.json();
                
                if (!uploadData.success) {
                    throw new Error('Error subiendo archivo: ' + uploadData.message);
                }
                
                mediaUrl = uploadData.files.participation_file.url;
                mediaFilename = uploadData.files.participation_file.filename;
                
            } else {
                const base64Data = {
                    participation_data: ParticipationSystem.filePreviewUrl
                };
                
                const uploadResponse = await fetch('/php/subir_archivo_participacion.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(base64Data)
                });
                
                const uploadData = await uploadResponse.json();
                
                if (!uploadData.success) {
                    throw new Error('Error subiendo archivo: ' + uploadData.message);
                }
                
                mediaUrl = uploadData.files.participation_data.url;
                mediaFilename = uploadData.files.participation_data.filename;
            }
            
            participationData.media_url = mediaUrl;
            participationData.media_filename = mediaFilename;
            participationData.media_type = event.response_type;
            
            if (event.response_type === 'audio' && ParticipationSystem.selectedFile.duration) {
                participationData.audio_duration = ParticipationSystem.selectedFile.duration;
            }
            
            if (event.response_type === 'video') {
                participationData.silenciado = true;
            }
        }

        submitBtn.innerHTML = 'Registrando participación... ✨';

        const response = await fetch('/php/participar_campana.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(participationData)
        });

        // Manejar respuesta del servidor
        if (!response.ok) {
            let errorMessage = `Error del servidor (${response.status})`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                // Si no se puede parsear JSON, usar mensaje genérico
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (data.success) {
            const currentUsername = CHAINFEED_CONFIG.currentUser?.username || getCurrentUser();
if (currentUsername) {
    localStorage.setItem(`participated_${event.id}_${currentUsername}`, 'true');
}
            
            const eventIndex = ChainSystem.events.findIndex(e => e.id === event.id);
            if (eventIndex !== -1) {
                ChainSystem.events[eventIndex].participantes = data.estadisticas_actualizadas.participantes_actuales;
            }
            
            closeParticipateModal();
            
if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'chain') {
    loadChainEvents();
}
            
            showNotification(`🎯 ¡Participación enviada! Has ganado ${data.participacion.tokens_ganados_participacion} CFT. El creador revisará tu participación pronto.`, 'success');
        } else {
            throw new Error(data.message || 'Error procesando la participación');
        }
        
    } catch (error) {
        console.error('Error enviando participación:', error);
        
        // Extraer mensaje limpio para el usuario
        let userMessage = error.message;
        
        // Limpiar mensajes técnicos o con formato JSON
        if (userMessage.includes('Error del servidor:') && userMessage.includes('{')) {
            try {
                const jsonMatch = userMessage.match(/\{.*\}/);
                if (jsonMatch) {
                    const errorData = JSON.parse(jsonMatch[0]);
                    userMessage = errorData.message || 'Error del servidor';
                }
            } catch (e) {
                userMessage = 'Error del servidor';
            }
        }
        
        // Remover prefijos técnicos innecesarios
        userMessage = userMessage.replace('Error del servidor: 400 - ', '');
        userMessage = userMessage.replace('HTTP 400: ', '');
        
        showNotification('❌ ' + userMessage, 'error');
    } finally {
        const submitBtn = document.getElementById('participateSubmitBtn');
        if (submitBtn) {
            submitBtn.innerHTML = '🎯 Enviar Participación';
            submitBtn.disabled = false;
        }
    }
}

function getParticipationInstructions(responseType) {
    switch (responseType) {
        case 'text':
            return '📝 <strong>Instrucciones:</strong> Escribe tu participación en el campo de texto. Sé creativo y original.';
        case 'image':
            return '📷 <strong>Instrucciones:</strong> Sube una imagen relacionada con el evento. Formatos admitidos: JPG, PNG, GIF, WebP.';
        case 'video':
            return '🎥 <strong>Instrucciones:</strong> Sube un video relacionado con el evento. <span style="color: var(--error); font-weight: bold;">Máximo 7 segundos.</span> Formatos: MP4, WebM, MOV.';
        case 'audio':
            return '🎵 <strong>Instrucciones:</strong> Graba o sube un audio de respuesta. <span style="color: var(--error); font-weight: bold;">Máximo 15 segundos.</span> Formatos: MP3, WAV, WebM, M4A.';
        default:
            return '📄 <strong>Instrucciones:</strong> Completa tu participación según las indicaciones del evento.';
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function getResponseTypeName(type) {
    switch(type) {
        case 'image': return 'Imagen';
        case 'video': return 'Video';  
        case 'text': return 'Texto';
        case 'audio': return 'Audio (15s)';
        default: return 'Archivo';
    }
}

async function getSimpleVideoDuration(file) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = function() {
            URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        
        video.onerror = function() {
            URL.revokeObjectURL(video.src);
            reject(new Error('No se pudo leer la duración del video'));
        };
        
        video.src = URL.createObjectURL(file);
    });
}

// También te falta esta para los audios
async function getAudioDuration(file) {
    return new Promise((resolve, reject) => {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        
        audio.onloadedmetadata = function() {
            URL.revokeObjectURL(audio.src);
            resolve(audio.duration);
        };
        
        audio.onerror = function() {
            URL.revokeObjectURL(audio.src);
            reject(new Error('No se pudo leer la duración del audio'));
        };
        
        audio.src = URL.createObjectURL(file);
    });
}

function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        
        reader.onerror = function(error) {
            reject(error);
        };
        
        reader.readAsDataURL(file);
    });
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(blob);
    });
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// ============================================
// FUNCIONES AUXILIARES DE COMPRESIÓN
// ============================================

/**
 * Detectar contexto de compresión
 */
function detectCompressionContext() {
    return 'participation';
}

/**
 * Obtener elementos de progreso
 */
function getCompressionElements(context) {
    return {
        container: 'participationCompressionProgress',
        fill: 'participationCompressionFill',
        text: 'participationCompressionText',
        status: 'participationCompressionStatus'
    };
}

/**
 * Mostrar/ocultar progreso de compresión
 */
function showCompressionProgress(show) {
    const context = detectCompressionContext();
    const elements = getCompressionElements(context);
    const container = document.getElementById(elements.container);
    
    if (!container) {
        console.warn(`⚠️ Contenedor de progreso no encontrado: ${elements.container}`);
        return;
    }
    
    if (show) {
        container.style.display = 'block';
        updateCompressionProgress(0, '📂 Iniciando compresión...');
        
        container.style.opacity = '0';
        container.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.3s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 10);
        
        console.log(`👁️ Panel de compresión visible`);
        
    } else {
        container.style.transition = 'all 0.3s ease';
        container.style.opacity = '0';
        container.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            container.style.display = 'none';
            container.style.opacity = '';
            container.style.transform = '';
            container.style.transition = '';
        }, 300);
        
        console.log(`🙈 Panel de compresión oculto`);
    }
}

/**
 * Actualizar progreso de compresión
 */
function updateCompressionProgress(percent, status) {
    const context = detectCompressionContext();
    const elements = getCompressionElements(context);
    
    const progressFill = document.getElementById(elements.fill);
    const progressText = document.getElementById(elements.text);
    const progressStatus = document.getElementById(elements.status);
    
    if (progressFill) {
        progressFill.style.width = Math.round(percent) + '%';
        
        if (percent < 30) {
            progressFill.style.background = 'linear-gradient(90deg, #3b82f6, #2563eb)';
        } else if (percent < 70) {
            progressFill.style.background = 'linear-gradient(90deg, #8b5cf6, #7c3aed)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
        }
    }
    
    if (progressText) {
        progressText.textContent = Math.round(percent) + '%';
    }
    
    if (progressStatus) {
        let friendlyStatus = status;
        
        if (status && typeof status === 'string') {
            const statusMap = {
                'loading': '📂 Cargando video...',
                'processing': '🔧 Procesando video...',
                'compressing': '🗜️ Comprimiendo...',
                'encoding': '📹 Codificando...',
                'finalizing': '✨ Finalizando...',
                'completed': '✅ Completado'
            };
            
            const statusLower = status.toLowerCase();
            for (const [key, value] of Object.entries(statusMap)) {
                if (statusLower.includes(key)) {
                    friendlyStatus = value;
                    break;
                }
            }
        }
        
        progressStatus.textContent = friendlyStatus || status || 'Procesando...';
    }
    
    if (percent % 10 < 1 || percent > 95) {
        console.log(`📊 Progreso: ${Math.round(percent)}% - ${status || 'Procesando'}`);
    }
}

/**
 * Validar tipo de archivo
 */
function isValidFileType(file, type) {
    const validTypes = {
        image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime']
    };
    
    if (!validTypes[type]) return false;
    
    return validTypes[type].includes(file.type);
}

/**
 * Obtener duración de video
 */
function getSimpleVideoDuration(file) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = function() {
            URL.revokeObjectURL(video.src);
            
            if (video.duration === Infinity || isNaN(video.duration)) {
                video.currentTime = 1e101;
                video.ontimeupdate = function() {
                    video.ontimeupdate = null;
                    video.currentTime = 0;
                    resolve(video.duration);
                };
            } else {
                resolve(video.duration);
            }
        };
        
        video.onerror = function() {
            URL.revokeObjectURL(video.src);
            reject(new Error('No se pudo cargar el video'));
        };
        
        video.src = URL.createObjectURL(file);
    });
}

/**
 * Formatear tamaño de archivo
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Ocultar botones de selección
 */
function hideMediaButtons() {
    const mediaButtons = document.querySelector('.participate-media-buttons');
    if (mediaButtons) {
        mediaButtons.style.display = 'none';
        console.log('🙈 Botones de selección ocultos');
    }
}

/**
 * Mostrar botones de selección
 */
function showMediaButtons() {
    const mediaButtons = document.querySelector('.participate-media-buttons');
    if (mediaButtons) {
        mediaButtons.style.display = 'block';
        console.log('👁️ Botones de selección visibles');
    }
}
// ============================================
// SISTEMA DE VISUALIZACIÓN DE PARTICIPANTES
// ============================================

function viewEventSubmissions(eventId) {
    console.log('👥 Abriendo participantes para evento:', eventId);
    
    // Buscar el evento
    const event = ChainSystem.events.find(e => String(e.id) === String(eventId));
    
    if (!event) {
        console.error('❌ Evento no encontrado:', eventId);
        if (typeof showNotification === 'function') {
            showNotification('❌ Error: Evento no encontrado', 'error');
        }
        return;
    }
    
    console.log('✅ Evento encontrado:', event.titulo);
    openSubmissionsModal(event);
}

function openSubmissionsModal(event) {
    console.log('🔓 Abriendo modal de participantes');
    
    const modal = document.getElementById('submissionsModal');
    if (!modal) {
        console.error('❌ Modal submissionsModal no encontrado en el DOM');
        return;
    }
    
    // Configurar título
    const titleElement = modal.querySelector('.submissions-title');
    if (titleElement) {
        titleElement.textContent = `👥 Participantes: ${event.titulo}`;
    }
    
    // Mostrar modal
    modal.classList.add('active');
    
    // Bloquear scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    console.log('✅ Modal mostrado, cargando participaciones...');
    
    // Cargar participaciones
    loadEventSubmissions(event.id);
}

async function loadEventSubmissions(eventId) {
    try {
        console.log('📡 Cargando participaciones para evento:', eventId);
        
        const contentContainer = document.getElementById('submissionsContent');
        if (!contentContainer) {
            console.error('❌ Contenedor submissionsContent no encontrado');
            return;
        }
        
        // Mostrar loading
        contentContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                <h3>Cargando participaciones...</h3>
            </div>
        `;
        
        // Llamar al backend
        const response = await fetch('/php/obtener_participaciones.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ evento_id: eventId })
        });
        
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 Respuesta del servidor:', data);
        
        if (data.success) {
            renderSubmissions(data.participaciones || []);
        } else {
            throw new Error(data.message || 'Error cargando participaciones');
        }
        
    } catch (error) {
        console.error('❌ Error cargando participaciones:', error);
        
        const contentContainer = document.getElementById('submissionsContent');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--error);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Error al cargar participaciones</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

function renderSubmissions(participaciones) {
    console.log('🎨 Renderizando', participaciones.length, 'participaciones');
    console.log('📦 Estructura de datos recibida:', participaciones[0]); // Debug
    
    const contentContainer = document.getElementById('submissionsContent');
    if (!contentContainer) return;
    
    if (!participaciones || participaciones.length === 0) {
        contentContainer.innerHTML = `
            <div class="empty-submissions" style="text-align: center; padding: 4rem 2rem; color: rgba(255, 255, 255, 0.6);">
                <div style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.5;">👀</div>
                <h3 style="margin: 0 0 1rem 0; font-size: 1.3rem; font-weight: 700; color: white;">
                    Sin participaciones aprobadas
                </h3>
                <p style="margin: 0; font-size: 1rem; line-height: 1.6; max-width: 400px; margin: 0 auto;">
                    Aún no hay participaciones aprobadas en este evento. Vuelve más tarde.
                </p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    participaciones.forEach((submission) => {
        // ✅ ADAPTADO A LA ESTRUCTURA DEL PHP
        // El PHP devuelve 'author' como objeto anidado
        const author = submission.author || {};
        const username = author.username || submission.userId || 'Usuario';
        const displayName = author.display_name || username;
        const avatarUrl = author.avatar_url || '';
        const verified = author.verified || false;
        
        console.log('👤 Procesando participación:', {
            id: submission.id,
            username: username,
            hasAuthor: !!submission.author
        });
        
        // ✅ GENERAR AVATAR SEGURO
        let avatarHTML;
        if (avatarUrl) {
            avatarHTML = `<img src="${avatarUrl}" 
                              alt="${username}" 
                              style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" 
                              onerror="this.style.display='none'; this.parentElement.textContent='${username.substring(0, 2).toUpperCase()}';">`;
        } else {
            avatarHTML = username.substring(0, 2).toUpperCase();
        }
        
        // Formatear timestamp
        const createdAt = submission.createdAt || submission.created_at || Date.now();
        const timeAgo = formatTimeAgo(createdAt);
        
        html += `
            <div class="submission-item" data-submission-id="${submission.id}" style="
                background: rgba(37, 37, 50, 0.6);
                border: 1px solid rgba(99, 102, 241, 0.15);
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                transition: all 0.3s ease;
            ">
                <div class="submission-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div class="submission-avatar" onclick="goToUserProfile('${username}')" style="
                        cursor: pointer;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, var(--primary), var(--accent));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: 700;
                        font-size: 1.2rem;
                        flex-shrink: 0;
                    ">
                        ${avatarHTML}
                    </div>
                    <div class="submission-user-info" style="flex: 1; min-width: 0;">
                        <div class="submission-username" onclick="goToUserProfile('${username}')" style="
                            cursor: pointer;
                            font-weight: 600;
                            color: white;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        ">
                            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${displayName}
                            </span>
                            ${verified ? '<span class="verified-badge" style="color: var(--primary); flex-shrink: 0;">✓</span>' : ''}
                        </div>
                        <div class="submission-time" style="
                            color: var(--text-secondary);
                            font-size: 0.9rem;
                            margin-top: 0.25rem;
                        ">
                            ${timeAgo}
                        </div>
                    </div>
                </div>
                
                <div class="submission-content" style="margin-top: 1rem;">
                    ${renderSubmissionContent(submission)}
                </div>
                
                <!-- Estadísticas de likes -->
                <div class="submission-stats" style="
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                ">
                    <button class="submission-like-btn ${submission.user_liked ? 'liked' : ''}" 
                            onclick="toggleParticipationLike('${submission.id}')"
                            style="
                                background: ${submission.user_liked ? 'rgba(236, 72, 153, 0.2)' : 'transparent'};
                                border: 1px solid ${submission.user_liked ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
                                color: ${submission.user_liked ? 'var(--accent)' : 'var(--text-secondary)'};
                                padding: 0.5rem 1rem;
                                border-radius: 20px;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                                font-size: 0.9rem;
                            ">
                        ${submission.user_liked ? '❤️' : '🤍'} 
                        <span>${submission.likes_count || 0}</span>
                    </button>
                </div>
            </div>
        `;
    });
    
    contentContainer.innerHTML = html;
    console.log('✅ Participaciones renderizadas');
}

function renderSubmissionContent(submission) {
    // ✅ Usar las propiedades correctas del PHP
    const content = submission.content || submission.contenido;
    const mediaType = submission.mediaType || submission.media_type;
    const mediaUrl = submission.mediaUrl || submission.media_url;
    const silenciado = submission.silenciado;
    const duration = submission.duration;
    const fileName = submission.fileName || submission.media_filename;
    
    if (content && (!mediaType || mediaType === 'text')) {
        return `<div class="submission-text" style="
            color: var(--text);
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
        ">${escapeHtml(content)}</div>`;
    }
    
    if (mediaType === 'image' && mediaUrl) {
        return `
            <div class="submission-media" style="border-radius: 12px; overflow: hidden;">
                <img src="${mediaUrl}" alt="Participación" 
                     onclick="openImageFullscreen(this)"
                     style="cursor: pointer; width: 100%; max-height: 400px; object-fit: contain; background: rgba(0,0,0,0.3);">
            </div>
        `;
    }
    
    if (mediaType === 'video' && mediaUrl) {
        return `
            <div class="submission-media" style="border-radius: 12px; overflow: hidden; position: relative;">
                <video controls ${silenciado ? 'muted' : ''} preload="metadata" 
                       style="width: 100%; max-height: 400px; background: black;">
                    <source src="${mediaUrl}" type="video/mp4">
                    Tu navegador no soporta video.
                </video>
                ${silenciado ? '<span style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.7); color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">🔇</span>' : ''}
            </div>
        `;
    }
    
    if (mediaType === 'audio' && mediaUrl) {
        return `
            <div class="submission-audio-player" style="
                background: rgba(255,255,255,0.05); 
                padding: 1rem; 
                border-radius: 12px;
            ">
                <div class="audio-submission-info" style="
                    display: flex; 
                    align-items: center; 
                    gap: 1rem; 
                    margin-bottom: 0.5rem;
                ">
                    <span class="audio-icon" style="font-size: 1.5rem;">🎵</span>
                    <span class="audio-name" style="flex: 1; color: var(--text);">${fileName || 'Audio'}</span>
                    ${duration ? `<span style="color: var(--text-secondary); font-size: 0.9rem;">${formatDuration(duration)}</span>` : ''}
                </div>
                <audio controls preload="metadata" style="width: 100%;">
                    <source src="${mediaUrl}" type="audio/mpeg">
                    <source src="${mediaUrl}" type="audio/wav">
                    <source src="${mediaUrl}" type="audio/webm">
                    Tu navegador no soporta audio.
                </audio>
            </div>
        `;
    }
    
    return '<p style="color: var(--text-secondary);">Contenido no disponible</p>';
}

function closeSubmissionsModal() {
    console.log('🔒 Cerrando modal de participantes');
    
    const modal = document.getElementById('submissionsModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // ✅ RESTAURAR SCROLL COMPLETAMENTE
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.classList.remove('modal-open');
    
    // ✅ REMOVER ESTILOS INLINE QUE PUEDAN BLOQUEAR SCROLL
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    setTimeout(() => {
        const contentContainer = document.getElementById('submissionsContent');
        if (contentContainer) {
            contentContainer.innerHTML = '';
        }
    }, 300);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// REGISTRAR FUNCIONES GLOBALMENTE
// ============================================

window.viewEventSubmissions = viewEventSubmissions;
window.openSubmissionsModal = openSubmissionsModal;
window.closeSubmissionsModal = closeSubmissionsModal;

console.log('✅ Sistema de visualización de participantes cargado y registrado');