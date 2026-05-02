/**
 * LISTING CONFIGURATION - Archivo centralizado
 * /js/listing-config.js
 * 
 * Punto único de verdad para todas las fechas de listing
 * CAMBIAR AQUÍ CUANDO NECESITES AJUSTAR FECHAS
 */
const LISTING_CONFIG = {
    // 🔴 ÚNICA FUENTE DE VERDAD - CAMBIAR AQUÍ
    // ✅ Alcor: 2 de mayo 2026
    // ✅ CoinGecko: 15 de mayo 2026
ALCOR_DATE: new Date('2026-06-01T00:00:00').getTime(),
COINGECKO_DATE: new Date('2026-06-15T00:00:00').getTime(),
    
    // Para testing - descomentar para bajar fechas
    // ALCOR_DATE: new Date(Date.now() + 5 * 60 * 1000).getTime(), // 5 min desde ahora
    // COINGECKO_DATE: new Date(Date.now() + 10 * 60 * 1000).getTime(), // 10 min desde ahora
    
    UPDATE_INTERVAL: 1000, // actualizar cada segundo
    
    /**
     * Verifica si Alcor ya está vivo
     */
    isAlcorLive() {
        return Date.now() >= this.ALCOR_DATE;
    },
    
    /**
     * Verifica si CoinGecko ya está vivo
     */
    isCoingeckoLive() {
        return Date.now() >= this.COINGECKO_DATE;
    },
    
    /**
     * Obtiene milisegundos hasta Alcor
     */
    getMillisecondsUntilAlcor() {
        return Math.max(0, this.ALCOR_DATE - Date.now());
    },
    
    /**
     * Obtiene milisegundos hasta CoinGecko
     */
    getMillisecondsUntilCoingecko() {
        return Math.max(0, this.COINGECKO_DATE - Date.now());
    },
    
    /**
     * Obtiene tiempo formateado (DD:HH:MM:SS)
     */
    getTimeUntilAlcor() {
        const ms = this.getMillisecondsUntilAlcor();
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds, ms };
    },
    
    /**
     * Obtiene días restantes hasta Alcor
     */
    getDaysUntilAlcor() {
        return Math.ceil(this.getMillisecondsUntilAlcor() / (1000 * 60 * 60 * 24));
    },
    
    /**
     * Dispara evento global cuando pasa la fecha
     */
    dispatchListingEvent(type) {
        console.log(`📢 Disparando evento: listing:${type}`);
        window.dispatchEvent(new CustomEvent(`listing:${type}`, {
            detail: {
                timestamp: Date.now(),
                date: new Date()
            }
        }));
    }
};

// 🔥 CRÍTICO: Monitorear cambios en estado de listing
let lastAlcorState = LISTING_CONFIG.isAlcorLive();
let lastCoingeckoState = LISTING_CONFIG.isCoingeckoLive();

setInterval(() => {
    const currentAlcorState = LISTING_CONFIG.isAlcorLive();
    const currentCoingeckoState = LISTING_CONFIG.isCoingeckoLive();
    
    // Cambio Alcor
    if (currentAlcorState !== lastAlcorState) {
        console.log('🎉 CAMBIO DE ESTADO: Alcor ahora está', currentAlcorState ? 'VIVO' : 'offline');
        LISTING_CONFIG.dispatchListingEvent(currentAlcorState ? 'alcor:live' : 'alcor:offline');
        lastAlcorState = currentAlcorState;
    }
    
    // Cambio CoinGecko
    if (currentCoingeckoState !== lastCoingeckoState) {
        console.log('🎉 CAMBIO DE ESTADO: CoinGecko ahora está', currentCoingeckoState ? 'VIVO' : 'offline');
        LISTING_CONFIG.dispatchListingEvent(currentCoingeckoState ? 'coingecko:live' : 'coingecko:offline');
        lastCoingeckoState = currentCoingeckoState;
    }
}, LISTING_CONFIG.UPDATE_INTERVAL);

console.log('✨ LISTING_CONFIG cargado - Fuente única de verdad para fechas');