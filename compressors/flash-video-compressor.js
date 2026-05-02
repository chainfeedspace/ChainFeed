/**
 * FlashVideoCompressor - Compresor de videos para Chain Flashes
 * FUERZA formato vertical 9:16 (tipo Instagram Stories/TikTok)
 * - Videos horizontales → CROP centro a 9:16
 * - Videos verticales → mantener vertical y optimizar
 * - Compresión ANTES del preview
 * - Basado en VideoCompressor pero optimizado para Flashes
 */

class FlashVideoCompressor {
    constructor(options = {}) {
        this.options = {
            targetAspectRatio: 9 / 16, // Formato vertical Stories
            maxHeight: options.maxHeight || 1280, // 720p vertical
            videoBitrate: options.videoBitrate || 2000000, // 2 Mbps (mayor calidad para Flashes)
            audioBitrate: options.audioBitrate || 128000,
            fps: options.fps || 30,
            progressCallback: options.progressCallback || null,
            ...options
        };
    }

    /**
     * Comprime y convierte video a formato vertical 9:16
     * @param {File} file - Archivo de video
     * @returns {Promise<{file: File, stats: Object}>}
     */
    async compress(file) {
        try {
            console.log(`🎥 Comprimiendo video para Flash: ${file.name}`);
            this.updateProgress(10, 'Cargando video...');

            // Cargar video
            const video = await this.loadVideo(file);
            const duration = video.duration;
            const width = video.videoWidth;
            const height = video.videoHeight;

            console.log(`📊 Video original: ${width}x${height}, ${duration.toFixed(1)}s, ${this.formatBytes(file.size)}`);

            this.updateProgress(20, 'Analizando orientación...');

            // Detectar orientación
            const orientationInfo = this.detectOrientation(width, height);
            console.log(`📱 Orientación: ${orientationInfo.type}`);

            this.updateProgress(25, 'Calculando dimensiones...');

            // Calcular dimensiones verticales 9:16
            const dimensions = this.calculateVerticalDimensions(width, height, orientationInfo);
            console.log(`🎯 Dimensiones finales: ${dimensions.canvasWidth}x${dimensions.canvasHeight}`);
            console.log(`   Método: ${dimensions.method}`);

            // Detectar mejor codec
            const mimeType = this.detectBestCodec();
            console.log(`🎬 Codec: ${mimeType}`);

            this.updateProgress(30, 'Comprimiendo video...');

            // Comprimir
            const compressedBlob = await this.compressVideo(video, dimensions, mimeType, duration);
            
            // Limpiar
            URL.revokeObjectURL(video.src);

            // Estadísticas
            const stats = {
                originalSize: file.size,
                compressedSize: compressedBlob.size,
                savings: file.size - compressedBlob.size,
                savingsPercent: Math.round((1 - compressedBlob.size / file.size) * 100),
                originalDimensions: { width, height },
                finalDimensions: { width: dimensions.canvasWidth, height: dimensions.canvasHeight },
                duration: duration,
                codec: mimeType,
                orientation: orientationInfo.type,
                method: dimensions.method,
                aspectRatio: '9:16'
            };

            console.log(`✅ Video procesado para Flash:`);
            console.log(`   Original: ${this.formatBytes(stats.originalSize)} (${width}x${height})`);
            console.log(`   Final: ${this.formatBytes(stats.compressedSize)} (${dimensions.canvasWidth}x${dimensions.canvasHeight})`);
            console.log(`   Ahorro: ${stats.savingsPercent}%`);
            console.log(`   Método: ${stats.method}`);

            // Crear archivo comprimido
            const compressedFile = new File(
                [compressedBlob],
                file.name.replace(/\.[^.]+$/, '_flash.webm'),
                { type: mimeType }
            );

            this.updateProgress(100, 'Compresión completada');

            return {
                file: compressedFile,
                stats: stats
            };

        } catch (error) {
            console.error('❌ Error comprimiendo video:', error);
            throw new Error(`Error procesando video: ${error.message}`);
        }
    }

    /**
     * Carga y valida video
     */
    async loadVideo(file) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.muted = true;
            video.volume = 0;
            video.preload = 'auto';
            video.src = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
                if (video.duration === Infinity || isNaN(video.duration)) {
                    video.currentTime = 1e101;
                    video.ontimeupdate = () => {
                        video.ontimeupdate = null;
                        video.currentTime = 0;
                        resolve(video);
                    };
                } else {
                    resolve(video);
                }
            };

            video.onerror = () => {
                URL.revokeObjectURL(video.src);
                reject(new Error('Error cargando video'));
            };
        });
    }

    /**
     * Detecta orientación del video
     */
    detectOrientation(width, height) {
        const aspectRatio = width / height;
        
        let type, needsCrop;
        
        if (aspectRatio < 0.7) {
            // Ya es vertical
            type = 'vertical';
            needsCrop = false;
        } else if (aspectRatio > 1.3) {
            // Horizontal
            type = 'horizontal';
            needsCrop = true;
        } else {
            // Cuadrado o casi
            type = 'square';
            needsCrop = true;
        }
        
        return { type, aspectRatio, needsCrop };
    }

 calculateVerticalDimensions(width, height, orientationInfo) {
    const targetRatio = this.options.targetAspectRatio; // 9/16 = 0.5625
    const currentRatio = width / height;
    
    let canvasWidth, canvasHeight, method, needsRotation;
    
    // ✅ DECIDIR: ROTAR o MANTENER
    if (currentRatio > 1.15) {
        // HORIZONTAL → ROTAR 90°
        method = 'rotate';
        needsRotation = true;
        
        // Después de rotar, dimensiones se invierten
        canvasWidth = height;
        canvasHeight = width;
        
        console.log(`   🔄 VIDEO HORIZONTAL → Se rotará 90° a VERTICAL`);
    } else if (currentRatio < 0.85) {
        // YA ES VERTICAL → MANTENER
        method = 'maintain';
        needsRotation = false;
        
        canvasWidth = width;
        canvasHeight = height;
        
        console.log(`   📱 VIDEO VERTICAL → Se mantiene`);
    } else {
        // CUADRADO → MANTENER
        method = 'maintain';
        needsRotation = false;
        
        canvasWidth = width;
        canvasHeight = height;
        
        console.log(`   ⬜ VIDEO CUADRADO → Se mantiene`);
    }
    
    // Escalar si excede límites
    if (canvasHeight > this.options.maxHeight) {
        const scale = this.options.maxHeight / canvasHeight;
        canvasWidth = Math.round(canvasWidth * scale);
        canvasHeight = this.options.maxHeight;
    }
    
    // Asegurar dimensiones pares
    canvasWidth = canvasWidth % 2 === 0 ? canvasWidth : canvasWidth - 1;
    canvasHeight = canvasHeight % 2 === 0 ? canvasHeight : canvasHeight - 1;
    
    console.log(`   📏 Canvas final: ${canvasWidth}x${canvasHeight}`);
    
    return {
        canvasWidth,
        canvasHeight,
        method,
        needsRotation,
        originalWidth: width,
        originalHeight: height
    };
}

    /**
     * Detecta mejor codec
     */
    detectBestCodec() {
        const codecs = [
            'video/webm; codecs=vp9,opus',
            'video/webm; codecs=vp8,opus',
            'video/webm; codecs=vp9',
            'video/webm; codecs=vp8',
            'video/webm'
        ];

        for (const codec of codecs) {
            if (MediaRecorder.isTypeSupported(codec)) {
                return codec;
            }
        }

        throw new Error('Navegador no soporta compresión WebM');
    }

    /**
     * Comprime video con crop/scale a 9:16
     */
    async compressVideo(video, dimensions, mimeType, duration) {
        // Canvas con dimensiones verticales 9:16
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.canvasWidth;
        canvas.height = dimensions.canvasHeight;
        
        const ctx = canvas.getContext('2d', { 
            alpha: false, 
            desynchronized: true 
        });

        console.log(`🎨 Canvas: ${canvas.width}x${canvas.height} (9:16)`);

        // Stream del canvas
        const canvasStream = canvas.captureStream(this.options.fps);
        const videoTrack = canvasStream.getVideoTracks()[0];

        // Capturar audio
        let audioTrack = null;
        try {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(video);
            const destination = audioContext.createMediaStreamDestination();
            source.connect(destination);
            source.connect(audioContext.destination);

            if (destination.stream.getAudioTracks().length > 0) {
                audioTrack = destination.stream.getAudioTracks()[0];
                console.log('🔊 Audio capturado');
            }
        } catch (e) {
            console.warn('⚠️ Sin audio:', e.message);
        }

        // Stream combinado
        const combinedStream = new MediaStream([videoTrack]);
        if (audioTrack) {
            combinedStream.addTrack(audioTrack);
        }

        // MediaRecorder
        const recorder = new MediaRecorder(combinedStream, {
            mimeType: mimeType,
            videoBitsPerSecond: this.options.videoBitrate,
            audioBitsPerSecond: this.options.audioBitrate
        });

        const chunks = [];
        let lastProgressUpdate = Date.now();

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                chunks.push(e.data);

                const now = Date.now();
                if (now - lastProgressUpdate > 500) {
                    const progress = 30 + Math.min(60, (video.currentTime / duration) * 60);
                    const percent = Math.round((video.currentTime / duration) * 100);
                    this.updateProgress(progress, `Procesando: ${percent}%`);
                    lastProgressUpdate = now;
                }
            }
        };

        const recordingComplete = new Promise((resolve) => {
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                resolve(blob);
            };
        });

        // Renderizar frame por frame
        const fps = this.options.fps;
        const frameDuration = 1000 / fps;
        let isRendering = true;

const renderLoop = () => {
    if (!isRendering) return;

    if (!video.paused && !video.ended) {
        // Limpiar canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // ✅ APLICAR ROTACIÓN SI ES NECESARIO
        if (dimensions.needsRotation) {
            ctx.save();
            
            // Mover al centro
            ctx.translate(canvas.width / 2, canvas.height / 2);
            
            // Rotar 90° horario
            ctx.rotate(90 * Math.PI / 180);
            
            // Dibujar video rotado (dimensiones invertidas)
            ctx.drawImage(
                video,
                -canvas.height / 2,
                -canvas.width / 2,
                canvas.height,
                canvas.width
            );
            
            ctx.restore();
        } else {
            // Sin rotación: dibujar normal
            ctx.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
        
        setTimeout(renderLoop, frameDuration);
    } else if (video.ended) {
        isRendering = false;
        recorder.stop();
    }
};

        // Iniciar
        recorder.start(100);
        video.muted = true;
        video.volume = 0;
        video.currentTime = 0;
        await video.play().catch(e => {
            console.warn('Error iniciando reproducción:', e);
        });
        renderLoop();

const compressedBlob = await recordingComplete;
        
        // ✅ Reparar metadatos de duración
        const fixedBlob = await this.fixWebmDuration(compressedBlob, duration);
        
        return fixedBlob;
    }

    /**
     * Repara metadatos de duración en WebM
     */
    async fixWebmDuration(blob, duration) {
        try {
            console.log(`🔧 Intentando reparar duración: ${duration}s`);
            
            const arrayBuffer = await blob.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            
            // Buscar el segmento Info donde está la duración
            const infoOffset = this.findEBMLElement(bytes, [0x15, 0x49, 0xA9, 0x66]); // Info segment
            if (infoOffset === -1) {
                console.warn('⚠️ No se encontró segmento Info');
                return blob;
            }
            
            console.log(`📍 Segmento Info encontrado en: ${infoOffset}`);
            
            // Buscar Duration dentro del segmento Info
            const durationOffset = this.findEBMLElement(bytes, [0x44, 0x89], infoOffset);
            if (durationOffset === -1) {
                console.warn('⚠️ No se encontró elemento Duration en Info');
                return blob;
            }
            
            console.log(`📍 Duration encontrado en: ${durationOffset}`);
            
            // Leer el tamaño del campo Duration
            let sizeOffset = durationOffset + 2;
            let size = bytes[sizeOffset];
            
            // Procesar tamaño EBML variable
            if (size === 0x88) {
                size = 8;
                sizeOffset++;
            } else if (size >= 0x80) {
                size = size & 0x7F;
                sizeOffset++;
            }
            
            console.log(`📏 Tamaño del campo: ${size} bytes`);
            
            // Escribir duración como float de 64 bits (8 bytes)
            const durationMs = duration * 1000;
            const dataView = new DataView(arrayBuffer);
            
            // Si el campo no es de 8 bytes, necesitamos reconstruir
            if (size !== 8) {
                console.warn(`⚠️ Tamaño inesperado: ${size}, se esperaba 8`);
                return blob;
            }
            
            dataView.setFloat64(sizeOffset, durationMs, false); // big-endian
            
            console.log(`✅ Duración escrita: ${durationMs}ms en offset ${sizeOffset}`);
            
            return new Blob([arrayBuffer], { type: blob.type });
            
        } catch (error) {
            console.error('❌ Error reparando duración WebM:', error);
            return blob;
        }
    }

    /**
     * Busca un elemento EBML en el array de bytes
     */
    findEBMLElement(bytes, pattern, startOffset = 0) {
        for (let i = startOffset; i < bytes.length - pattern.length; i++) {
            let match = true;
            for (let j = 0; j < pattern.length; j++) {
                if (bytes[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return i;
            }
        }
        return -1;
    }
    
    /**
     * Actualiza progreso
     */
    updateProgress(percent, status) {
        if (this.options.progressCallback) {
            this.options.progressCallback(percent, status);
        }
    }

    /**
     * Formatea bytes
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

// Función helper global
window.compressFlashVideo = async function(file, options = {}) {
    const compressor = new FlashVideoCompressor(options);
    const result = await compressor.compress(file);
    return result.file;
};

// Exportar
if (typeof window !== 'undefined') {
    window.FlashVideoCompressor = FlashVideoCompressor;
}

console.log('✅ FlashVideoCompressor cargado - Formato: 9:16 vertical');