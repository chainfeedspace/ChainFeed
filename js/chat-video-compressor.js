/**
 * ChatVideoCompressor - Compresión optimizada para videos de chat
 * Límite: 15 segundos, compresión más agresiva
 */

class ChatVideoCompressor {
    constructor(options = {}) {
        this.options = {
            maxDuration: 15, // Segundos
            maxDimension: 720, // Más compacto que participaciones
            videoBitrate: 800000, // 800 Kbps (más agresivo)
            audioBitrate: 96000,  // 96 Kbps
            fps: 24, // Menos FPS para chat
            compressionThreshold: 1.5 * 1024 * 1024, // Comprimir si >5MB
            progressCallback: options.progressCallback || null,
            ...options
        };
    }

    /**
     * Valida y comprime video para chat
     * @param {File} file - Archivo de video
     * @returns {Promise<{file: File, stats: Object, wasCompressed: boolean}>}
     */
    async processForChat(file) {
        try {
            console.log('🎬 Procesando video para chat...');
            
            // 1. Validar duración PRIMERO
            const video = await this.loadVideo(file);
            const duration = video.duration;
            
            console.log(`⏱️ Duración detectada: ${duration.toFixed(1)}s`);
            
            if (duration > this.options.maxDuration) {
                URL.revokeObjectURL(video.src);
                throw new Error(
                    `Video muy largo para chat. Máximo ${this.options.maxDuration} segundos (actual: ${Math.round(duration)}s)`
                );
            }
            
            // 2. Verificar si necesita compresión
            const needsCompression = file.size > this.options.compressionThreshold;
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            
            if (!needsCompression) {
                URL.revokeObjectURL(video.src);
                console.log(`ℹ️ Video pequeño (${fileSizeMB}MB), sin compresión necesaria`);
                
                return {
                    file: file,
                    stats: {
                        originalSize: file.size,
                        compressedSize: file.size,
                        savings: 0,
                        savingsPercent: 0,
                        duration: duration
                    },
                    wasCompressed: false
                };
            }
            
            // 3. Comprimir
            console.log(`🔧 Comprimiendo video de chat (${fileSizeMB}MB > ${(this.options.compressionThreshold / (1024 * 1024)).toFixed(0)}MB)`);
            
            this.updateProgress(10, 'Analizando video...');
            
            const width = video.videoWidth;
            const height = video.videoHeight;
            
            console.log(`📊 Original: ${width}x${height}, ${duration.toFixed(1)}s, ${fileSizeMB}MB`);
            
            this.updateProgress(20, 'Configurando compresión...');
            
            // Dimensiones optimizadas para chat
            const dimensions = this.calculateDimensions(width, height);
            console.log(`🎯 Dimensiones finales: ${dimensions.width}x${dimensions.height}`);
            
            // Codec
            const mimeType = this.detectBestCodec();
            console.log(`🎬 Codec: ${mimeType}`);
            
            this.updateProgress(25, 'Comprimiendo video...');
            
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
                finalDimensions: dimensions,
                duration: duration,
                codec: mimeType
            };
            
            console.log(`✅ Compresión de chat completada:`);
            console.log(`   Original: ${this.formatBytes(stats.originalSize)}`);
            console.log(`   Comprimido: ${this.formatBytes(stats.compressedSize)}`);
            console.log(`   Ahorro: ${stats.savingsPercent}% (${this.formatBytes(stats.savings)})`);
            
            // Crear archivo
            const compressedFile = new File(
                [compressedBlob],
                file.name.replace(/\.[^.]+$/, '_chat.webm'),
                { type: mimeType }
            );
            
            this.updateProgress(100, 'Compresión completada');
            
            return {
                file: compressedFile,
                stats: stats,
                wasCompressed: true
            };
            
        } catch (error) {
            console.error('❌ Error procesando video para chat:', error);
            throw error;
        }
    }

    /**
     * Carga video y valida metadata
     */
    async loadVideo(file) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.muted = true;
            video.volume = 0;
            video.preload = 'metadata';
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
     * Calcula dimensiones (720p máximo para chat)
     */
    calculateDimensions(width, height) {
        let finalWidth = width;
        let finalHeight = height;

        if (width > this.options.maxDimension || height > this.options.maxDimension) {
            const scale = Math.min(
                this.options.maxDimension / width,
                this.options.maxDimension / height
            );
            finalWidth = Math.round(width * scale);
            finalHeight = Math.round(height * scale);
        }

        // Dimensiones pares
        finalWidth = finalWidth % 2 === 0 ? finalWidth : finalWidth - 1;
        finalHeight = finalHeight % 2 === 0 ? finalHeight : finalHeight - 1;

        return { width: finalWidth, height: finalHeight };
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
     * Comprime usando MediaRecorder
     */
    async compressVideo(video, dimensions, mimeType, duration) {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const ctx = canvas.getContext('2d', { 
            alpha: false, 
            desynchronized: true 
        });

        const canvasStream = canvas.captureStream(this.options.fps);
        const videoTrack = canvasStream.getVideoTracks()[0];

        // Audio
        let audioTrack = null;
        try {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(video);
            const destination = audioContext.createMediaStreamDestination();
            source.connect(destination);
            source.connect(audioContext.destination);

            if (destination.stream.getAudioTracks().length > 0) {
                audioTrack = destination.stream.getAudioTracks()[0];
            }
        } catch (e) {
            console.warn('⚠️ Sin audio:', e.message);
        }

        const combinedStream = new MediaStream([videoTrack]);
        if (audioTrack) {
            combinedStream.addTrack(audioTrack);
        }

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
                    const progress = 25 + Math.min(65, (video.currentTime / duration) * 65);
                    const percent = Math.round((video.currentTime / duration) * 100);
                    this.updateProgress(progress, `Comprimiendo: ${percent}%`);
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

        const fps = this.options.fps;
        const frameDuration = 1000 / fps;
        let isRendering = true;

        const renderLoop = () => {
            if (!isRendering) return;

            if (!video.paused && !video.ended) {
                ctx.drawImage(video, 0, 0, dimensions.width, dimensions.height);
                setTimeout(renderLoop, frameDuration);
            } else if (video.ended) {
                isRendering = false;
                recorder.stop();
            }
        };

        recorder.start(100);
        video.muted = true;
        video.volume = 0;
        video.currentTime = 0;
        await video.play().catch(e => {
            console.warn('Error en reproducción:', e);
        });
        renderLoop();

        const compressedBlob = await recordingComplete;
        return compressedBlob;
    }

    updateProgress(percent, status) {
        if (this.options.progressCallback) {
            this.options.progressCallback(percent, status);
        }
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.ChatVideoCompressor = ChatVideoCompressor;
}