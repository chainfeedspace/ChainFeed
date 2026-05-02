/**
 * VideoCompressor - Módulo de compresión de video en el navegador
 * Comprime videos usando MediaRecorder API con codecs VP9/VP8
 * Optimiza resolución y bitrate automáticamente
 * ✅ CON CORRECCIÓN AUTOMÁTICA DE ORIENTACIÓN
 */

class VideoCompressor {
    constructor(options = {}) {
        this.options = {
            maxDimension: options.maxDimension || 1280,
            videoBitrate: options.videoBitrate || 1500000, // 1.5 Mbps
            audioBitrate: options.audioBitrate || 128000,  // 128 Kbps
            fps: options.fps || 30,
            progressCallback: options.progressCallback || null,
            ...options
        };
    }

    /**
     * Detecta la orientación del video y decide si rotarlo a vertical
     * 🔄 MODO: Forzar todo a VERTICAL (como TikTok/Reels)
     * @param {HTMLVideoElement} video - Elemento de video
     * @returns {Object} - {rotation: número (0, 90, 270), needsRotation: boolean}
     */
    detectVideoOrientation(video) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        const aspectRatio = width / height;
        
        console.log(`📐 Analizando orientación del video:`);
        console.log(`   Dimensiones originales: ${width}x${height}`);
        console.log(`   Aspect Ratio: ${aspectRatio.toFixed(2)}`);
        
        let orientation = 'landscape'; // horizontal
        let rotation = 0;
        let needsRotation = false;
        
        // 🎯 LÓGICA: Forzar todo a VERTICAL
        if (aspectRatio < 0.85) {
            // Video YA es vertical
            orientation = 'portrait';
            rotation = 0;
            needsRotation = false;
            console.log('   📱 Orientación: YA ES VERTICAL → No se rota');
        } else if (aspectRatio > 1.15) {
            // Video HORIZONTAL → Rotar 90° para hacerlo vertical
            orientation = 'landscape';
            rotation = 90;
            needsRotation = true;
            console.log('   🔄 Orientación: HORIZONTAL → Se rotará 90° a VERTICAL');
        } else {
            // Video CUADRADO → Mantener como está
            orientation = 'square';
            rotation = 0;
            needsRotation = false;
            console.log('   ⬜ Orientación: CUADRADO → Se mantiene');
        }
        
        return {
            rotation: rotation,
            needsRotation: needsRotation,
            orientation: orientation,
            aspectRatio: aspectRatio,
            originalWidth: width,
            originalHeight: height
        };
    }

    /**
     * Comprime un archivo de video
     * @param {File} file - Archivo de video a comprimir
     * @returns {Promise<{file: File, stats: Object}>}
     */
    async compress(file) {
        try {
            this.updateProgress(10, 'Analizando video...');

            // Cargar video
            const video = await this.loadVideo(file);
            const duration = video.duration;
            const width = video.videoWidth;
            const height = video.videoHeight;

            console.log(`📊 Video original: ${width}x${height}, ${duration.toFixed(1)}s, ${this.formatBytes(file.size)}`);

            // ✅ DETECTAR ORIENTACIÓN
            const orientationInfo = this.detectVideoOrientation(video);
            
            this.updateProgress(20, 'Configurando compresión...');

            // Calcular dimensiones finales (respetando orientación)
            const dimensions = this.calculateDimensions(width, height, orientationInfo);
            console.log(`🎯 Dimensiones finales: ${dimensions.width}x${dimensions.height}`);
            console.log(`   Orientación preservada: ${orientationInfo.orientation}`);

            // Detectar mejor codec disponible
            const mimeType = this.detectBestCodec();
            console.log(`🎬 Codec seleccionado: ${mimeType}`);

            this.updateProgress(25, 'Comprimiendo video...');

            // Comprimir (con información de orientación)
            const compressedBlob = await this.compressVideo(video, dimensions, mimeType, duration, orientationInfo);
            
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
                codec: mimeType,
                orientation: orientationInfo.orientation // ✅ Info de orientación
            };

            console.log(`✅ Compresión completada:`);
            console.log(`   Original: ${this.formatBytes(stats.originalSize)}`);
            console.log(`   Comprimido: ${this.formatBytes(stats.compressedSize)}`);
            console.log(`   Ahorro: ${stats.savingsPercent}% (${this.formatBytes(stats.savings)})`);
            console.log(`   Orientación: ${stats.orientation}`);

            // Crear archivo comprimido
            const compressedFile = new File(
                [compressedBlob],
                file.name.replace(/\.[^.]+$/, '_compressed.webm'),
                { type: mimeType }
            );

            this.updateProgress(100, 'Compresión completada');

            return {
                file: compressedFile,
                stats: stats
            };

        } catch (error) {
            console.error('❌ Error en compresión:', error);
            throw new Error(`Error comprimiendo video: ${error.message}`);
        }
    }

    /**
     * Carga y valida un archivo de video
     */
    async loadVideo(file) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.muted = true;  // ✅ SILENCIAR
            video.volume = 0;    // ✅ VOLUMEN A 0
            video.preload = 'auto';
            video.src = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
                if (video.duration === Infinity || isNaN(video.duration)) {
                    // Fix para videos con metadata corrupta
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
     * Calcula dimensiones optimales para forzar orientación VERTICAL
     * 🔄 MODIFICADO: Canvas del tamaño EXACTO del video rotado (sin espacios negros)
     */
    calculateDimensions(width, height, orientationInfo) {
        let finalWidth = width;
        let finalHeight = height;

        // 🔄 Si vamos a rotar 90°, intercambiamos dimensiones PRIMERO
        if (orientationInfo.needsRotation && orientationInfo.rotation === 90) {
            // Intercambiar para que quede vertical después de rotar
            finalWidth = height;
            finalHeight = width;
            console.log(`   🔄 Dimensiones intercambiadas para rotación: ${finalWidth}x${finalHeight}`);
        }

        // Escalar SOLO si excede el límite (manteniendo proporción EXACTA)
        const maxDim = this.options.maxDimension;
        
        if (finalWidth > maxDim || finalHeight > maxDim) {
            // Calcular escala para que el lado más largo sea maxDimension
            const scale = Math.min(maxDim / finalWidth, maxDim / finalHeight);
            
            finalWidth = Math.round(finalWidth * scale);
            finalHeight = Math.round(finalHeight * scale);
            
            console.log(`   📐 Escalado proporcional aplicado: factor ${scale.toFixed(3)}`);
        }

        // Asegurar dimensiones pares (requerido por algunos codecs)
        finalWidth = finalWidth % 2 === 0 ? finalWidth : finalWidth - 1;
        finalHeight = finalHeight % 2 === 0 ? finalHeight : finalHeight - 1;

        // Calcular aspect ratios para verificar
        const originalAspect = orientationInfo.needsRotation ? height / width : width / height;
        const finalAspect = finalWidth / finalHeight;
        
        console.log(`   📏 Dimensiones finales:`);
        console.log(`      Video original: ${width}x${height}`);
        console.log(`      Canvas final: ${finalWidth}x${finalHeight}`);
        console.log(`      Aspect original: ${originalAspect.toFixed(3)}`);
        console.log(`      Aspect final: ${finalAspect.toFixed(3)}`);
        console.log(`      Diferencia: ${Math.abs(originalAspect - finalAspect).toFixed(3)} (debe ser ~0)`);
        console.log(`      Orientación: ${finalHeight > finalWidth ? 'VERTICAL ✅' : 'HORIZONTAL'}`);

        return { width: finalWidth, height: finalHeight };
    }

    /**
     * Detecta el mejor codec disponible en el navegador
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
     * Comprime el video usando MediaRecorder
     * 🔄 MODIFICADO: Aplica rotación 90° a videos horizontales para forzarlos a vertical
     */
    async compressVideo(video, dimensions, mimeType, duration, orientationInfo) {
        // Crear canvas con las dimensiones correctas (YA intercambiadas si hay rotación)
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        
        const ctx = canvas.getContext('2d', { 
            alpha: false, 
            desynchronized: true 
        });

        console.log(`🎨 Canvas creado: ${canvas.width}x${canvas.height}`);

        // 🔄 NO aplicamos rotación aquí, se hará en cada frame del renderLoop

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

        // Configurar MediaRecorder
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

                // Actualizar progreso cada 500ms
                const now = Date.now();
                if (now - lastProgressUpdate > 500) {
                    const progress = 25 + Math.min(20, (video.currentTime / duration) * 20);
                    const percent = Math.round((video.currentTime / duration) * 100);
                    this.updateProgress(progress, `Comprimiendo: ${percent}%`);
                    lastProgressUpdate = now;
                }
            }
        };

        // Promise para esperar la compresión
        const recordingComplete = new Promise((resolve) => {
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                resolve(blob);
            };
        });

        // Renderizar video frame por frame
        const fps = this.options.fps;
        const frameDuration = 1000 / fps;
        let isRendering = true;

        const renderLoop = () => {
            if (!isRendering) return;

            if (!video.paused && !video.ended) {
                // Limpiar canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // 🔄 APLICAR ROTACIÓN EN CADA FRAME
                if (orientationInfo.needsRotation && orientationInfo.rotation === 90) {
                    ctx.save();
                    
                    // Mover al centro del canvas
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    
                    // Rotar 90° en sentido horario
                    ctx.rotate(90 * Math.PI / 180);
                    
                    // 🎯 DIBUJAR EL VIDEO COMPLETO LLENANDO EL CANVAS SIN ESPACIOS
                    // El canvas ya tiene las dimensiones correctas (height x width del original)
                    // Así que dibujamos el video con SUS dimensiones originales
                    ctx.drawImage(
                        video,
                        -canvas.height / 2,  // x: mitad de la altura del canvas (que era el ancho original)
                        -canvas.width / 2,   // y: mitad del ancho del canvas (que era la altura original)
                        canvas.height,       // ancho a dibujar (altura del canvas)
                        canvas.width         // alto a dibujar (ancho del canvas)
                    );
                    
                    ctx.restore();
                } else {
                    // Sin rotación: dibujar normal llenando el canvas completamente
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

        // Iniciar grabación y reproducción
        recorder.start(100); // Guardar chunks cada 100ms
        video.muted = true;
        video.volume = 0;
        video.currentTime = 0;
        await video.play().catch(e => {
            console.warn('Error iniciando reproducción silenciosa:', e);
        });
        renderLoop();

        // Esperar a que termine
        const compressedBlob = await recordingComplete;

        return compressedBlob;
    }

    /**
     * Actualiza el progreso (si hay callback)
     */
    updateProgress(percent, status) {
        if (this.options.progressCallback) {
            this.options.progressCallback(percent, status);
        }
    }

    /**
     * Formatea bytes a formato legible
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

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.VideoCompressor = VideoCompressor;
}

console.log('✅ VideoCompressor cargado - MODO: Forzar VERTICAL (como TikTok/Reels)');