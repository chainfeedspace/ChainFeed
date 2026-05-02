/**
 * Video Compression para Campañas
 * Sistema de compresión especializado para participaciones en eventos
 * NO interferir con video-compressor.js (usado en perfil)
 */

// ============================================
// CONFIGURACIONES DE COMPRESIÓN POR CONTEXTO
// ============================================

const COMPRESSION_CONFIGS = {
    // Publicaciones en feed (balance calidad/tamaño)
    FEED_POST: {
        maxDimension: 1280,
        videoBitrate: 1500000,  // 1.5 Mbps
        audioBitrate: 96000,    // 96 kbps
        targetSizeMB: 8,
        description: 'Publicación en feed'
    },
    
    // Participaciones en campañas (máxima compresión)
    CAMPAIGN_PARTICIPATION: {
        maxDimension: 854,
        videoBitrate: 800000,   // 800 kbps
        audioBitrate: 64000,    // 64 kbps
        targetSizeMB: 3,
        description: 'Participación en campaña'
    },
    
    // Creación de eventos (calidad media-alta)
    EVENT_CREATION: {
        maxDimension: 1920,
        videoBitrate: 2500000,  // 2.5 Mbps
        audioBitrate: 128000,   // 128 kbps
        targetSizeMB: 15,
        description: 'Creación de evento'
    }
};

// ============================================
// FUNCIÓN WRAPPER PARA COMPRESIÓN CONTEXTUAL
// ============================================

async function compressVideoWithConfig(file, configType = 'FEED_POST', onProgress = null) {
    const config = COMPRESSION_CONFIGS[configType];
    
    if (!config) {
        console.error('❌ Configuración de compresión no encontrada:', configType);
        throw new Error('Configuración de compresión inválida');
    }
    
    console.log(`🔧 Usando configuración: ${config.description}`, {
        maxDimension: config.maxDimension,
        videoBitrate: `${(config.videoBitrate / 1000000).toFixed(1)} Mbps`,
        audioBitrate: `${(config.audioBitrate / 1000)} kbps`,
        targetSize: `${config.targetSizeMB}MB`
    });
    
    // Verificar si VideoCompressor está disponible
    if (typeof VideoCompressor === 'undefined') {
        console.error('❌ VideoCompressor no está disponible');
        throw new Error('Sistema de compresión no disponible');
    }
    
    const compressor = new VideoCompressor({
        maxDimension: config.maxDimension,
        videoBitrate: config.videoBitrate,
        audioBitrate: config.audioBitrate,
        progressCallback: onProgress
    });
    
    return await compressor.compress(file);
}

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================

if (typeof window !== 'undefined') {
    window.compressVideoWithConfig = compressVideoWithConfig;
    window.COMPRESSION_CONFIGS = COMPRESSION_CONFIGS;
}

console.log('✅ Sistema de compresión para campañas cargado');
console.log('📦 Configuraciones disponibles:', Object.keys(COMPRESSION_CONFIGS));