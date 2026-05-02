/**
 * ImageCompressor - Compresor de imágenes para publicaciones
 * ✅ CON ROTACIÓN AUTOMÁTICA A VERTICAL (como TikTok/Reels)
 * Comprime ANTES de subir al servidor para ahorrar ancho de banda
 */

class ImageCompressor {
    constructor(options = {}) {
        this.options = {
            maxHeight: options.maxHeight || 1920,
            quality: options.quality || 0.85,
            format: options.format || 'image/jpeg',
            forceVertical: options.forceVertical !== false, // ✅ Por defecto: rotar a vertical
            progressCallback: options.progressCallback || null,
            ...options
        };
    }

    /**
     * Detecta orientación y decide si rotar a vertical
     */
    detectOrientation(width, height) {
        const aspectRatio = width / height;
        
        console.log(`📐 Analizando imagen:`);
        console.log(`   Dimensiones: ${width}x${height}`);
        console.log(`   Aspect Ratio: ${aspectRatio.toFixed(2)}`);
        
        let orientation, needsRotation;
        
        if (aspectRatio < 0.85) {
            // Ya es vertical
            orientation = 'portrait';
            needsRotation = false;
            console.log('   📱 YA ES VERTICAL → No se rota');
        } else if (aspectRatio > 1.15) {
            // Horizontal → Rotar a vertical
            orientation = 'landscape';
            needsRotation = this.options.forceVertical;
            console.log(`   🔄 HORIZONTAL → ${needsRotation ? 'Se rotará' : 'Se mantiene'}`);
        } else {
            // Cuadrada
            orientation = 'square';
            needsRotation = false;
            console.log('   ⬜ CUADRADA → Se mantiene');
        }
        
        return {
            orientation,
            needsRotation,
            aspectRatio,
            originalWidth: width,
            originalHeight: height
        };
    }

    /**
     * Comprime una imagen
     */
    async compress(file) {
        try {
            console.log(`🖼️ Comprimiendo: ${file.name}`);
            this.updateProgress(10, 'Cargando imagen...');

            const img = await this.loadImage(file);
            const originalWidth = img.width;
            const originalHeight = img.height;

            console.log(`📐 Original: ${originalWidth}x${originalHeight}`);

            this.updateProgress(30, 'Analizando orientación...');

            const orientationInfo = this.detectOrientation(originalWidth, originalHeight);
            const dimensions = this.calculateDimensions(orientationInfo);

            console.log(`🎯 Final: ${dimensions.width}x${dimensions.height}`);

            this.updateProgress(50, 'Procesando...');

            // Crear canvas
            const canvas = document.createElement('canvas');
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
            
            const ctx = canvas.getContext('2d', {
                alpha: false,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });

            // Fondo negro
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Aplicar rotación si es necesario
            if (orientationInfo.needsRotation) {
                console.log('   🔄 Aplicando rotación 90°...');
                
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(90 * Math.PI / 180);
                ctx.drawImage(
                    img,
                    -canvas.height / 2,
                    -canvas.width / 2,
                    canvas.height,
                    canvas.width
                );
                ctx.restore();
            } else {
                // Sin rotación
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            this.updateProgress(70, 'Comprimiendo...');

            const compressedBlob = await new Promise((resolve) => {
                canvas.toBlob(resolve, this.options.format, this.options.quality);
            });

            URL.revokeObjectURL(img.src);

            const stats = {
                originalSize: file.size,
                compressedSize: compressedBlob.size,
                savings: file.size - compressedBlob.size,
                savingsPercent: Math.round((1 - compressedBlob.size / file.size) * 100),
                originalDimensions: { width: originalWidth, height: originalHeight },
                finalDimensions: { width: dimensions.width, height: dimensions.height },
                rotated: orientationInfo.needsRotation
            };

            console.log(`✅ Imagen comprimida:`);
            console.log(`   Original: ${this.formatBytes(stats.originalSize)}`);
            console.log(`   Final: ${this.formatBytes(stats.compressedSize)}`);
            console.log(`   Ahorro: ${stats.savingsPercent}%`);
            console.log(`   Rotada: ${stats.rotated ? 'Sí' : 'No'}`);

            const extension = this.options.format === 'image/jpeg' ? 'jpg' : 'png';
            const compressedFile = new File(
                [compressedBlob],
                file.name.replace(/\.[^.]+$/, `_compressed.${extension}`),
                { type: this.options.format }
            );

            this.updateProgress(100, 'Completado');

            return {
                file: compressedFile,
                stats: stats
            };

        } catch (error) {
            console.error('❌ Error:', error);
            throw new Error(`Error procesando imagen: ${error.message}`);
        }
    }

    async loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Error cargando imagen'));
            img.src = URL.createObjectURL(file);
        });
    }

    calculateDimensions(orientationInfo) {
        let finalWidth = orientationInfo.originalWidth;
        let finalHeight = orientationInfo.originalHeight;

        // Si rotamos, intercambiar dimensiones
        if (orientationInfo.needsRotation) {
            finalWidth = orientationInfo.originalHeight;
            finalHeight = orientationInfo.originalWidth;
        }

        // Escalar si excede límite
        if (finalHeight > this.options.maxHeight) {
            const scale = this.options.maxHeight / finalHeight;
            finalWidth = Math.round(finalWidth * scale);
            finalHeight = this.options.maxHeight;
        }

        // Dimensiones pares
        finalWidth = finalWidth % 2 === 0 ? finalWidth : finalWidth - 1;
        finalHeight = finalHeight % 2 === 0 ? finalHeight : finalHeight - 1;

        return { width: finalWidth, height: finalHeight };
    }

    updateProgress(percent, status) {
        if (this.options.progressCallback) {
            this.options.progressCallback(percent, status);
        }
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }
}

// Exportar
if (typeof window !== 'undefined') {
    window.ImageCompressor = ImageCompressor;
}

console.log('✅ ImageCompressor cargado - Modo: Rotar a VERTICAL');