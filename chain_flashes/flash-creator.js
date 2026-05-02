/**
 * CHAIN FLASH CREATOR - ACTUALIZADO
 * Modal para crear Flashes (imagen, video, texto)
 * ✅ USA COMPRESORES ESPECÍFICOS PARA FORMATO 9:16
 */

class ChainFlashCreator {
    constructor() {
        this.modal = null;
        this.currentType = 'imagen';
        this.selectedFile = null;
        this.compressedFile = null; // ✅ Para imagen o video comprimido
        this.isCreating = false;
        
        this.init();
    }

    init() {
        console.log('📝 Inicializando Flash Creator...');
        
        this.modal = document.getElementById('flashCreatorModal');
        if (!this.modal) {
            console.error('❌ Modal de creator no encontrado');
            return;
        }

        this.setupEventListeners();
        
        console.log('✅ Flash Creator inicializado');
    }

    setupEventListeners() {
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open() {
        if (!this.modal) return;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.currentType = 'imagen';
        this.selectedFile = null;
        this.compressedFile = null;
        this.switchType('imagen');
    }

    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.reset();
        }, 300);
    }

    switchType(type) {
        this.currentType = type;
        this.selectedFile = null;
        this.compressedFile = null;

        document.querySelectorAll('.flash-type-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.type === type) {
                tab.classList.add('active');
            }
        });

        document.querySelectorAll('.flash-content-section').forEach(section => {
            section.classList.remove('active');
        });

        const sectionMap = {
            'imagen': 'flashImageSection',
            'video': 'flashVideoSection',
            'texto': 'flashTextoSection'
        };

        const targetSection = document.getElementById(sectionMap[type]);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    handleFileSelect(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        this.selectedFile = file;

        if (type === 'imagen') {
            this.compressAndPreviewImage(file);
        } else if (type === 'video') {
            this.compressAndPreviewVideo(file);
        }
    }

    /**
     * ✅ NUEVO: Comprimir IMAGEN antes de preview
     */
    async compressAndPreviewImage(file) {
        const preview = document.getElementById('flashImagePreview');
        const img = document.getElementById('flashImagePreviewImg');
        const compressionDiv = document.getElementById('flashImageCompression');
        const uploadArea = document.querySelector('#flashImageSection .flash-upload-area');

        // Ocultar upload area
        if (uploadArea) uploadArea.style.display = 'none';
        
        // Mostrar progreso
        if (compressionDiv) compressionDiv.classList.remove('hidden');

        try {
            // ✅ VERIFICAR QUE EXISTA FlashImageCompressor
            if (typeof window.compressFlashImage !== 'function') {
                throw new Error('FlashImageCompressor no está cargado. Verifica que flash-image-compressor.js esté incluido en el HTML.');
            }

            // Comprimir con formato 9:16
            const compressed = await window.compressFlashImage(file, {
                onProgress: (progress, status) => {
                    this.updateCompressionProgress(progress, status, 'image');
                }
            });

            this.compressedFile = compressed;

            // Mostrar preview
            if (img && preview) {
                img.src = URL.createObjectURL(compressed);
                preview.classList.remove('hidden');
            }

            // Ocultar progreso
            if (compressionDiv) compressionDiv.classList.add('hidden');

            console.log('✅ Imagen comprimida y lista para Flash');

        } catch (error) {
            console.error('Error comprimiendo imagen:', error);
            this.showNotification(error.message || 'Error al procesar la imagen', 'error');
            
            // Limpiar
            if (compressionDiv) compressionDiv.classList.add('hidden');
            if (uploadArea) uploadArea.style.display = 'block';
            
            document.getElementById('flashImageInput').value = '';
            this.selectedFile = null;
            this.compressedFile = null;
        }
    }

    /**
     * ✅ NUEVO: Comprimir VIDEO antes de preview
     */
    async compressAndPreviewVideo(file) {
        const preview = document.getElementById('flashVideoPreview');
        const video = document.getElementById('flashVideoPreviewVid');
        const compressionDiv = document.getElementById('flashVideoCompression');
        const audioControl = document.getElementById('flashAudioControl');
        const uploadArea = document.querySelector('#flashVideoSection .flash-upload-area');

        // Ocultar upload area
        if (uploadArea) uploadArea.style.display = 'none';

        // Mostrar progreso
        if (compressionDiv) compressionDiv.classList.remove('hidden');

        try {
            // ✅ VERIFICAR QUE EXISTA FlashVideoCompressor
            if (typeof window.compressFlashVideo !== 'function') {
                throw new Error('FlashVideoCompressor no está cargado. Verifica que flash-video-compressor.js esté incluido en el HTML.');
            }

            // Comprimir con formato 9:16
            const compressed = await window.compressFlashVideo(file, {
                onProgress: (progress, status) => {
                    this.updateCompressionProgress(progress, status, 'video');
                }
            });

            this.compressedFile = compressed;

            // Mostrar preview
            if (video && preview) {
                video.src = URL.createObjectURL(compressed);
                preview.classList.remove('hidden');
                
                // Detectar audio
                video.addEventListener('loadedmetadata', () => {
                    const hasAudio = video.mozHasAudio || 
                                   Boolean(video.webkitAudioDecodedByteCount) || 
                                   Boolean(video.audioTracks && video.audioTracks.length);
                    
                    if (audioControl) {
                        audioControl.classList.remove('hidden');
                        const checkbox = document.getElementById('flashHasAudio');
                        if (checkbox) checkbox.checked = hasAudio;
                    }
                });
            }

            // Ocultar progreso
            if (compressionDiv) compressionDiv.classList.add('hidden');

            console.log('✅ Video comprimido y listo para Flash');

        } catch (error) {
            console.error('Error comprimiendo video:', error);
            this.showNotification(error.message || 'Error al procesar el video', 'error');
            
            // Limpiar
            if (compressionDiv) compressionDiv.classList.add('hidden');
            if (uploadArea) uploadArea.style.display = 'block';
            
            document.getElementById('flashVideoInput').value = '';
            this.selectedFile = null;
            this.compressedFile = null;
        }
    }

    /**
     * ✅ MEJORADO: Actualiza progreso para imagen o video
     */
    updateCompressionProgress(progress, status, type) {
        const statusText = document.getElementById(type === 'video' ? 'flashCompressionStatus' : 'flashImageCompressionStatus');
        const fillBar = document.getElementById(type === 'video' ? 'flashCompressionFill' : 'flashImageCompressionFill');

        if (statusText) {
            statusText.textContent = status || `${Math.round(progress)}%`;
        }

        if (fillBar) {
            fillBar.style.width = `${progress}%`;
        }
    }

    removeFile(type) {
        this.selectedFile = null;
        this.compressedFile = null;

        if (type === 'imagen') {
            const preview = document.getElementById('flashImagePreview');
            const uploadArea = document.querySelector('#flashImageSection .flash-upload-area');
            
            if (preview) preview.classList.add('hidden');
            if (uploadArea) uploadArea.style.display = 'block';
            
            document.getElementById('flashImageInput').value = '';
            
        } else if (type === 'video') {
            const preview = document.getElementById('flashVideoPreview');
            const uploadArea = document.querySelector('#flashVideoSection .flash-upload-area');
            const audioControl = document.getElementById('flashAudioControl');
            
            if (preview) preview.classList.add('hidden');
            if (uploadArea) uploadArea.style.display = 'block';
            if (audioControl) audioControl.classList.add('hidden');
            
            document.getElementById('flashVideoInput').value = '';
        }
    }

    updateCharCount() {
        const input = document.getElementById('flashTextInput');
        const counter = document.getElementById('flashCharCount');
        
        if (input && counter) {
            counter.textContent = input.value.length;
        }
    }

    async create() {
        if (this.isCreating) return;

        try {
            this.isCreating = true;
            const createBtn = document.getElementById('flashCreateBtn');
            if (createBtn) {
                createBtn.disabled = true;
                createBtn.textContent = 'Creando...';
            }

            // Validar
            if (this.currentType === 'imagen' && !this.compressedFile) {
                throw new Error('Selecciona una imagen');
            }
            if (this.currentType === 'video' && !this.compressedFile) {
                throw new Error('Selecciona un video');
            }
            if (this.currentType === 'texto') {
                const textInput = document.getElementById('flashTextInput');
                if (!textInput || !textInput.value.trim()) {
                    throw new Error('Escribe un mensaje');
                }
            }

            // Preparar FormData
            const formData = new FormData();
            formData.append('tipo', this.currentType);

            if (this.currentType === 'imagen') {
                formData.append('media', this.compressedFile); // ✅ Usar archivo comprimido
            } else if (this.currentType === 'video') {
                formData.append('media', this.compressedFile); // ✅ Usar archivo comprimido
                
                const hasAudioCheckbox = document.getElementById('flashHasAudio');
                const hasAudio = hasAudioCheckbox ? hasAudioCheckbox.checked : 0;
                formData.append('has_audio', hasAudio ? 1 : 0);
            } else if (this.currentType === 'texto') {
                const textInput = document.getElementById('flashTextInput');
                formData.append('contenido', textInput.value.trim());
            }

            // Enviar a PHP
            const response = await fetch('/php/chain_flashes/crear_flash.php', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification(data.message || '✨ Flash creado!', 'success');
                this.close();
                
                // Recargar barra y página
                if (window.chainFlashesBar) {
                    setTimeout(() => {
                        window.chainFlashesBar.reload();
                    }, 500);
                }

                if (typeof loadUserFlashes === 'function') {
                    setTimeout(() => {
                        loadUserFlashes();
                    }, 500);
                }

            } else {
                throw new Error(data.message || 'Error al crear Flash');
            }

        } catch (error) {
            console.error('Error creando Flash:', error);
            this.showNotification(error.message, 'error');
        } finally {
            this.isCreating = false;
            const createBtn = document.getElementById('flashCreateBtn');
            if (createBtn) {
                createBtn.disabled = false;
                createBtn.textContent = '⚡ Crear Flash (-1 CFT)';
            }
        }
    }

    reset() {
        this.selectedFile = null;
        this.compressedFile = null;
        
        const imageInput = document.getElementById('flashImageInput');
        const videoInput = document.getElementById('flashVideoInput');
        const textInput = document.getElementById('flashTextInput');
        
        if (imageInput) imageInput.value = '';
        if (videoInput) videoInput.value = '';
        if (textInput) {
            textInput.value = '';
            this.updateCharCount();
        }

        document.querySelectorAll('.flash-preview-container').forEach(preview => {
            preview.classList.add('hidden');
        });

        document.querySelectorAll('.flash-upload-area').forEach(area => {
            area.style.display = 'block';
        });

        const compressionDiv = document.getElementById('flashVideoCompression');
        const imageCompressionDiv = document.getElementById('flashImageCompression');
        const audioControl = document.getElementById('flashAudioControl');
        
        if (compressionDiv) compressionDiv.classList.add('hidden');
        if (imageCompressionDiv) imageCompressionDiv.classList.add('hidden');
        if (audioControl) audioControl.classList.add('hidden');
    }

    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
            alert(message);
        }
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.flashCreator = new ChainFlashCreator();
    });
} else {
    window.flashCreator = new ChainFlashCreator();
}

console.log('✅ flash-creator.js cargado (con compresores 9:16)');