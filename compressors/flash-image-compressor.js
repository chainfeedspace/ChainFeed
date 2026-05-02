/**
 * FlashImageCompressor - Compresor de imágenes para Chain Flashes
 * FUERZA formato vertical 9:16 (tipo Instagram Stories/Reels)
 * - Imágenes horizontales → CROP center a 9:16
 * - Imágenes verticales → mantener vertical y optimizar
 * - Compresión ANTES del preview
 */

class FlashImageCompressor {
    constructor(options = {}) {
        this.options = {
            targetAspectRatio: 9 / 16, // Formato vertical Stories
            maxHeight: options.maxHeight || 1920, // Full HD vertical
            quality: options.quality || 0.85, // 85% calidad
            format: options.format || 'image/jpeg',
            progressCallback: options.progressCallback || null,
            ...options
        };
    }

    /**
     * Comprime y convierte imagen a formato vertical 9:16
     * @param {File} file - Archivo de imagen
     * @returns {Promise<{file: File, stats: Object}>}
     */
 async compress(file) {
    try {
        console.log(`🖼️ Comprimiendo imagen para Flash: ${file.name}`);
        this.updateProgress(10, 'Cargando imagen...');

        const img = await this.loadImage(file);
        const originalWidth = img.width;
        const originalHeight = img.height;

        console.log(`📐 Dimensiones originales: ${originalWidth}x${originalHeight}`);

        this.updateProgress(30, 'Ajustando orientación...');

        const dimensions = this.calculateVerticalDimensions(originalWidth, originalHeight);
        
        console.log(`🎯 Dimensiones finales: ${dimensions.width}x${dimensions.height}`);

        this.updateProgress(50, 'Procesando imagen...');

        // ✅ CREAR CANVAS CON DIMENSIONES FINALES
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

        // ✅ APLICAR ROTACIÓN SI ES NECESARIO
        if (dimensions.needsRotation) {
            console.log('   🔄 Aplicando rotación 90° horario...');
            
            ctx.save();
            
            // Mover al centro del canvas
            ctx.translate(canvas.width / 2, canvas.height / 2);
            
            // Rotar 90° horario
            ctx.rotate(90 * Math.PI / 180);
            
            // Dibujar imagen (las dimensiones originales se invierten por la rotación)
            ctx.drawImage(
                img,
                -canvas.height / 2,  // x (usa height porque está rotado)
                -canvas.width / 2,   // y (usa width porque está rotado)
                canvas.height,       // ancho a dibujar (usa height)
                canvas.width         // alto a dibujar (usa width)
            );
            
            ctx.restore();
        } else {
            // Sin rotación: dibujar normal
            ctx.drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
            );
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
            method: dimensions.method,
            rotated: dimensions.needsRotation,
            format: this.options.format
        };

        console.log(`✅ Imagen procesada para Flash:`);
        console.log(`   Original: ${this.formatBytes(stats.originalSize)} (${originalWidth}x${originalHeight})`);
        console.log(`   Final: ${this.formatBytes(stats.compressedSize)} (${dimensions.width}x${dimensions.height})`);
        console.log(`   Ahorro: ${stats.savingsPercent}%`);
        console.log(`   Rotada: ${stats.rotated ? 'Sí (90°)' : 'No'}`);

        const extension = this.options.format === 'image/jpeg' ? 'jpg' : 'png';
        const compressedFile = new File(
            [compressedBlob],
            file.name.replace(/\.[^.]+$/, `_flash.${extension}`),
            { type: this.options.format }
        );

        this.updateProgress(100, 'Compresión completada');

        return {
            file: compressedFile,
            stats: stats
        };

    } catch (error) {
        console.error('❌ Error comprimiendo imagen:', error);
        throw new Error(`Error procesando imagen: ${error.message}`);
    }
}

    /**
     * Carga una imagen desde un archivo
     */
    async loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Error cargando imagen'));
            img.src = URL.createObjectURL(file);
        });
    }

 calculateVerticalDimensions(width, height) {
    const targetRatio = this.options.targetAspectRatio; // 9/16 = 0.5625
    const currentRatio = width / height;
    
    let finalWidth, finalHeight, method, needsRotation;
    
    // ✅ DECIDIR: ROTAR o MANTENER
    if (currentRatio > 1.15) {
        // HORIZONTAL → ROTAR 90°
        method = 'rotate';
        needsRotation = true;
        
        // Después de rotar, las dimensiones se invierten
        finalWidth = height;
        finalHeight = width;
        
        console.log(`   🔄 HORIZONTAL detectada → Se rotará 90° a VERTICAL`);
    } else if (currentRatio < 0.85) {
        // YA ES VERTICAL → MANTENER
        method = 'maintain';
        needsRotation = false;
        
        finalWidth = width;
        finalHeight = height;
        
        console.log(`   📱 VERTICAL detectada → Se mantiene`);
    } else {
        // CUADRADA → MANTENER
        method = 'maintain';
        needsRotation = false;
        
        finalWidth = width;
        finalHeight = height;
        
        console.log(`   ⬜ CUADRADA detectada → Se mantiene`);
    }
    
    // Escalar si excede límites (manteniendo proporción)
    if (finalHeight > this.options.maxHeight) {
        const scale = this.options.maxHeight / finalHeight;
        finalWidth = Math.round(finalWidth * scale);
        finalHeight = this.options.maxHeight;
    }
    
    // Asegurar dimensiones pares
    finalWidth = finalWidth % 2 === 0 ? finalWidth : finalWidth - 1;
    finalHeight = finalHeight % 2 === 0 ? finalHeight : finalHeight - 1;

    console.log(`   📏 Dimensiones finales: ${finalWidth}x${finalHeight}`);
    console.log(`   Método: ${method} (rotación: ${needsRotation})`);

    return {
        width: finalWidth,
        height: finalHeight,
        method: method,
        needsRotation: needsRotation,
        originalWidth: width,
        originalHeight: height
    };
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

// Función helper global para comprimir imágenes de Flash
window.compressFlashImage = async function(file, options = {}) {
    const compressor = new FlashImageCompressor(options);
    const result = await compressor.compress(file);
    return result.file;
};

// Exportar
if (typeof window !== 'undefined') {
    window.FlashImageCompressor = FlashImageCompressor;
}

console.log('✅ FlashImageCompressor cargado - Formato: 9:16 vertical');