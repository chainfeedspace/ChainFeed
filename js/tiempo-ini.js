// ============================================
// SISTEMA DE FORMATO DE TIEMPO PARA POSTS
// ============================================
(function() {
    'use strict';
    
    const formatTimeAgoCorto = function(date) {
        try {
            const now = new Date();
            const postDate = new Date(date);
            
            if (isNaN(postDate.getTime())) {
                console.error('Fecha inválida:', date);
                return 'Fecha inválida';
            }
            
            const diffMs = now - postDate;
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            const diffWeeks = Math.floor(diffDays / 7);
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);
            
            if (diffSeconds < 60) return `${diffSeconds}seg`;
            if (diffMinutes < 60) return `${diffMinutes}min`;
            if (diffHours < 24) return `${diffHours}h`;
            if (diffDays < 7) return `${diffDays}d`;
            if (diffWeeks < 4) return `${diffWeeks}sem`;
            if (diffMonths < 12) return `${diffMonths}mes`;
            return `${diffYears}a`;
            
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'Error';
        }
    };
    
    // Asignar a window
    window.formatTimeAgo = formatTimeAgoCorto;
    
    // Proteger contra sobrescritura
    Object.defineProperty(window, 'formatTimeAgo', {
        value: formatTimeAgoCorto,
        writable: false,
        configurable: false,
        enumerable: true
    });
    
    console.log('✅ formatTimeAgo cargado correctamente');
    console.log('🧪 Test:', formatTimeAgoCorto(new Date(Date.now() - 2 * 60 * 60 * 1000)));
    
})();