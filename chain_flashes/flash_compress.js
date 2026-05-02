/**
 * FlashCompressor - Compresor de video optimizado para Chain Flashes
 * 
 * Características:
 * - Fuerza orientación VERTICAL (como TikTok/Reels/Instagram Stories)
 * - Compresión agresiva para reducir tamaño
 * - Optimizado para videos cortos (Flashes)
 * - Corrección automática de orientación
 * - Límite de 60 segundos de duración
 * - Máximo 50MB tamaño final
 * 
 * @version 1.0.0
 */

class FlashCompressor {
    constructor(options = {}) {
        this.options = {
            // 📐 Dimensiones para Flashes (optimizadas para móvil)
            maxDimension: options.maxDimension || 720, // 720p vertical
            
            // 🎬 Bitrates (más agresivos para Flashes cortos)
            videoBitrate: options.videoBitrate || 1000000, // 1 Mbps
            audioBitrate: options.audioBitrate || 96000,   // 96 Kbps
            
            // ⏱️ Límites temporales
            maxDuration: options.maxDuration || 60, // 60 segundos máximo
            
            // 📦 Límite de tamaño
            maxOutputSize: options.maxOutputSize || 50 * 1024 * 1024, // 50MB
            
            // 🎞️ FPS
            fps: options.fps || 30,
            
            // 📊 Callbacks
            onProgress: options.onProgress || null,
            
            ...options
        };
    }

    /**
     * 🎯 Detecta y decide la orientación del video
     * SIEMPRE fuerza a VERTICAL para Flashes (como Stories/Reels/TikTok)
     */
    detectVideoOrientation(video) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        const aspectRatio = width / height;
        
        console.log('📐 Analizando video para Flash:');
        console.log(`   Dimensiones: ${width}x${height}`);
        console.log(`   Aspect Ratio: ${aspectRatio.toFixed(2)}`);
        
        let orientation, rotation, needsRotation;
        
        if (aspectRatio < 0.85) {
            // YA es vertical
            orientation = 'portrait';
            rotation = 0;
            needsRotation = false;
            console.log('   ✅ Ya es VERTICAL');
        } else if (aspectRatio > 1.15) {
            // Horizontal → Rotar a vertical
            orientation = 'landscape';
            rotation = 90;
            needsRotation = true;
            console.log('   🔄 HORIZONTAL detectado → Se rotará a VERTICAL');
        } else {
            // Cuadrado → Mantener
            orientation = 'square';
            rotation = 0;
            needsRotation = false;
            console.log('   ⬜ CUADRADO → Se mantiene');
        }
        
        return {
            rotation,
            needsRotation,
            orientation,
            aspectRatio,
            originalWidth: width,
            originalHeight: height
        };
    }

    /**
     * 🎬 Comprime un video para Flash
     * @param {File} file - Archivo de video
     * @returns {Promise<File>} - Video comprimido
     */
    async compress(file) {
        try {
            this.updateProgress(5);

            // ✅ Validar tipo de archivo
            if (!file.type.startsWith('video/')) {
                throw new Error('El archivo debe ser un video');
            }

            this.updateProgress(10);

            // Cargar video
            const video = await this.loadVideo(file);
            const duration = video.duration;
            const width = video.videoWidth;
            const height = video.videoHeight;

            console.log(`📹 Video original: ${width}x${height}, ${duration.toFixed(1)}s, ${this.formatBytes(file.size)}`);

            // ✅ Validar duración
            if (duration > this.options.maxDuration) {
                URL.revokeObjectURL(video.src);
                throw new Error(`Los Flashes no pueden durar más de ${this.options.maxDuration} segundos. Tu video dura ${Math.round(duration)}s.`);
            }

            // Detectar orientación
            const orientationInfo = this.detectVideoOrientation(video);
            
            this.updateProgress(20);

            // Calcular dimensiones finales
            const dimensions = this.calculateDimensions(width, height, orientationInfo);
            console.log(`🎯 Dimensiones finales: ${dimensions.width}x${dimensions.height}`);

            // Detectar codec
            const mimeType = this.detectBestCodec();
            console.log(`🎬 Codec: ${mimeType}`);

            this.updateProgress(25);

            // Comprimir
            const compressedBlob = await this.compressVideo(
                video, 
                dimensions, 
                mimeType, 
                duration, 
                orientationInfo
            );

            URL.revokeObjectURL(video.src);

            // ✅ Verificar tamaño final
            if (compressedBlob.size > this.options.maxOutputSize) {
                throw new Error(`El video comprimido (${this.formatBytes(compressedBlob.size)}) excede el límite de 50MB`);
            }

            console.log('✅ Flash comprimido exitosamente:');
            console.log(`   Original: ${this.formatBytes(file.size)}`);
            console.log(`   Comprimido: ${this.formatBytes(compressedBlob.size)}`);
            console.log(`   Ahorro: ${Math.round((1 - compressedBlob.size / file.size) * 100)}%`);

            // Crear archivo
            const compressedFile = new File(
                [compressedBlob],
                file.name.replace(/\.[^.]+$/, '_flash.webm'),
                { type: mimeType }
            );

            this.updateProgress(100);

            return compressedFile;

        } catch (error) {
            console.error('❌ Error comprimiendo Flash:', error);
            throw error;
        }
    }

    /**
     * 📹 Carga el video en memoria
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
                reject(new Error('No se pudo cargar el video'));
            };
        });
    }

    /**
     * 📐 Calcula dimensiones óptimas (forzando VERTICAL)
     */
    calculateDimensions(width, height, orientationInfo) {
        let finalWidth = width;
        let finalHeight = height;

        // 🔄 Si vamos a rotar, intercambiar dimensiones
        if (orientationInfo.needsRotation && orientationInfo.rotation === 90) {
            finalWidth = height;
            finalHeight = width;
            console.log(`   🔄 Dimensiones intercambiadas: ${finalWidth}x${finalHeight}`);
        }

        // Escalar si excede el límite
        const maxDim = this.options.maxDimension;
        
        if (finalWidth > maxDim || finalHeight > maxDim) {
            const scale = Math.min(maxDim / finalWidth, maxDim / finalHeight);
            finalWidth = Math.round(finalWidth * scale);
            finalHeight = Math.round(finalHeight * scale);
            console.log(`   📐 Escalado aplicado: ${finalWidth}x${finalHeight}`);
        }

        // Asegurar dimensiones pares
        finalWidth = finalWidth % 2 === 0 ? finalWidth : finalWidth - 1;
        finalHeight = finalHeight % 2 === 0 ? finalHeight : finalHeight - 1;

        return { width: finalWidth, height: finalHeight };
    }

    /**
     * 🎬 Detecta el mejor codec disponible
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

        throw new Error('Tu navegador no soporta compresión de video WebM');
    }

    /**
     * 🎥 Comprime el video usando MediaRecorder
     */
    async compressVideo(video, dimensions, mimeType, duration, orientationInfo) {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        const ctx = canvas.getContext('2d', { 
            alpha: false, 
            desynchronized: true 
        });

        console.log(`🎨 Canvas: ${canvas.width}x${canvas.height}`);

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
                if (now - lastProgressUpdate > 300) {
                    const progress = 25 + Math.min(70, (video.currentTime / duration) * 70);
                    this.updateProgress(progress);
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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // 🔄 Aplicar rotación si es necesario
                if (orientationInfo.needsRotation && orientationInfo.rotation === 90) {
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.drawImage(
                        video,
                        -canvas.height / 2,
                        -canvas.width / 2,
                        canvas.height,
                        canvas.width
                    );
                    ctx.restore();
                } else {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
            console.warn('Error reproduciendo:', e);
        });
        renderLoop();

        const compressedBlob = await recordingComplete;
        return compressedBlob;
    }

    /**
     * 📊 Actualizar progreso
     */
    updateProgress(percent) {
        if (this.options.onProgress) {
            this.options.onProgress(percent);
        }
    }

    /**
     * 📦 Formatear bytes
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

// ✅ FUNCIÓN GLOBAL COMPATIBLE CON EL SISTEMA EXISTENTE
async function compressFlashVideo(file, options = {}) {
    const compressor = new FlashCompressor(options);
    return await compressor.compress(file);
}

// Exportar
if (typeof window !== 'undefined') {
    window.FlashCompressor = FlashCompressor;
    window.compressFlashVideo = compressFlashVideo;
}

console.log('✅ FlashCompressor cargado - MODO: Forzar VERTICAL');