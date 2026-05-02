/**
 * CHAIN FLASH REACTIONS
 * Sistema auxiliar para manejar reacciones tokenizadas
 * (Ya está integrado en flash-viewer.js, este archivo es para funciones auxiliares)
 */

class ChainFlashReactions {
    constructor() {
        this.COSTOS_REACCIONES = {
            '❤️': 0.5,
            '🔥': 1.0,
            '💎': 5.0,
            '👏': 0.5,
            '⚡': 2.0,
            '🚀': 3.0
        };
    }

    getCosto(emoji) {
        return this.COSTOS_REACCIONES[emoji] || 0;
    }

    getTotalEmojis() {
        return Object.keys(this.COSTOS_REACCIONES).length;
    }

    getEmojisDisponibles() {
        return Object.entries(this.COSTOS_REACCIONES).map(([emoji, costo]) => ({
            emoji,
            costo
        }));
    }

    formatCosto(costo) {
        return `${costo.toFixed(1)} CFT`;
    }

    async verificarBalance(costo) {
        try {
            // Aquí podrías hacer una verificación real del balance
            // Por ahora asumimos que el backend lo valida
            return true;
        } catch (error) {
            console.error('Error verificando balance:', error);
            return false;
        }
    }

    getReaccionInfo(emoji) {
        if (!this.COSTOS_REACCIONES[emoji]) {
            return null;
        }

        return {
            emoji,
            costo: this.COSTOS_REACCIONES[emoji],
            descripcion: this.getDescripcion(emoji)
        };
    }

    getDescripcion(emoji) {
        const descripciones = {
            '❤️': 'Me encanta',
            '🔥': 'Está en llamas',
            '💎': 'Contenido premium',
            '👏': 'Aplaudo',
            '⚡': 'Energía pura',
            '🚀': 'A la luna'
        };

        return descripciones[emoji] || '';
    }
}

// Instancia global
window.flashReactions = new ChainFlashReactions();

console.log('✅ flash-reactions.js cargado');