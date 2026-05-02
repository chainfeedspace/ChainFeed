// ============================================
// ACTUALIZACIÓN SIMPLE DE ESTADÍSTICAS VIRALES
// ============================================

/**
 * Actualizar contadores de interacciones virales leyendo del DOM
 */
function updateAllViralStats() {
    // Solo ejecutar si estamos en el feed de virales
    if (currentFeedType !== 'virales') return;
    
    const viralPosts = document.querySelectorAll('.viral-post');
    
    viralPosts.forEach((postElement) => {
        const postId = parseInt(postElement.dataset.postId.replace('post-', ''));
        
        // Leer contadores del DOM
        const likesElement = postElement.querySelector('.post-stat:nth-child(1)');
        const commentsElement = postElement.querySelector('.post-stat:nth-child(2)');
        const repostsElement = postElement.querySelector('.post-stat:nth-child(3)');
        
        if (likesElement && commentsElement && repostsElement) {
            // Extraer números de cada contador
            const likesCount = parseInt(likesElement.textContent.match(/\d+/)?.[0] || '0');
            const commentsCount = parseInt(commentsElement.textContent.match(/\d+/)?.[0] || '0');
            const repostsCount = parseInt(repostsElement.textContent.match(/\d+/)?.[0] || '0');
            
            // Calcular total
            const totalInteracciones = likesCount + commentsCount + repostsCount;
            
            // Actualizar el indicador viral
            const viralStatsElement = postElement.querySelector('.viral-stats');
            if (viralStatsElement) {
                const currentTotal = parseInt(viralStatsElement.textContent.match(/\d+/)?.[0] || '0');
                
                // Solo actualizar si cambió
                if (currentTotal !== totalInteracciones) {
                    viralStatsElement.textContent = `${totalInteracciones} interacciones`;
                    
                    // Efecto visual breve
                    viralStatsElement.style.background = '#00ff88';
                    viralStatsElement.style.color = '#000';
                    viralStatsElement.style.padding = '2px 6px';
                    viralStatsElement.style.borderRadius = '4px';
                    viralStatsElement.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        viralStatsElement.style.background = '';
                        viralStatsElement.style.color = '';
                        viralStatsElement.style.padding = '';
                        viralStatsElement.style.borderRadius = '';
                    }, 800);
                    
                    // Actualizar icono de fuego
                    const viralFireElement = postElement.querySelector('.viral-fire');
                    if (viralFireElement) {
                        viralFireElement.textContent = getViralityIcon(totalInteracciones);
                    }
                    
                    console.log(`Updated viral stats for post ${postId}: ${totalInteracciones} interactions`);
                }
            }
        }
    });
}

/**
 * Ejecutar actualización cada vez que hay un click en el feed
 */
document.addEventListener('click', function(e) {
    // Si se hizo click en un botón de estadísticas de un post viral
    if (e.target.closest('.post-stat') && e.target.closest('.viral-post')) {
        // Actualizar después de un breve delay para que se procese el click
        setTimeout(updateAllViralStats, 300);
        setTimeout(updateAllViralStats, 800);
    }
});

/**
 * Ejecutar actualización periódica cada 5 segundos (opcional)
 */
setInterval(() => {
    if (currentFeedType === 'virales') {
        updateAllViralStats();
    }
}, 5000);

/**
 * Ejecutar cuando se abren/cierran comentarios
 */
document.addEventListener('click', function(e) {
    // Si se hace click en el botón de comentarios
    if (e.target.closest('.post-stat') && e.target.textContent.includes('💬')) {
        setTimeout(updateAllViralStats, 1000);
    }
});

/**
 * Ejecutar cuando se cargan posts virales
 */
function initViralStatsUpdater() {
    // Ejecutar una vez al cargar
    setTimeout(updateAllViralStats, 500);
    
    // Y después cada 3 segundos por si algo cambió
    if (currentFeedType === 'virales') {
        const updateInterval = setInterval(() => {
            if (currentFeedType === 'virales') {
                updateAllViralStats();
            } else {
                clearInterval(updateInterval);
            }
        }, 3000);
    }
}

// Ejecutar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    if (currentFeedType === 'virales') {
        initViralStatsUpdater();
    }
});

// Hook para cuando se cargan posts virales
const originalLoadViralPosts = window.loadViralPosts;
if (typeof loadViralPosts === 'function') {
    window.loadViralPosts = async function(append = false) {
        if (originalLoadViralPosts) {
            await originalLoadViralPosts(append);
        }
        
        // Inicializar actualizador después de cargar posts
        setTimeout(initViralStatsUpdater, 1000);
    };
}

// Función manual para testing
window.updateAllViralStats = updateAllViralStats;

console.log('✅ Sistema simple de actualización de estadísticas virales cargado');