/**
 * FIX: Mostrar contador dinámico en párrafo de CoinGecko
 * Cuando Alcor está vivo y CoinGecko aún no
 * 
 * Busca el elemento con ID "coingecko-next-event-timer" y lo actualiza cada segundo
 */

// 🔥 NUEVO: Función global para actualizar el contador
function updateCoingeckoNextEventTimer() {
    const timerElement = document.getElementById('coingecko-next-event-timer');
    
    // Si no existe el elemento, no hacer nada
    if (!timerElement) {
        console.log('⚠️ Elemento #coingecko-next-event-timer no encontrado');
        return;
    }
    
    // Si CoinGecko ya está vivo, no mostrar
    if (ALCOR_ALERT.isCoingeckoLive()) {
        console.log('✅ CoinGecko ya está vivo');
        return;
    }
    
    // Calcular tiempo restante
    const distance = ALCOR_ALERT.COINGECKO_LISTING_DATE - Date.now();
    
    if (distance <= 0) {
        timerElement.textContent = '0 días, 0 horas, 0 minutos';
        return;
    }
    
    // Calcular días, horas, minutos
    const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    
    // Formatear con plurales en español/inglés
    const pluralDay = days !== 1 ? 's' : '';
    const pluralHour = hours !== 1 ? 's' : '';
    const pluralMinute = minutes !== 1 ? 's' : '';
    
    // Detectar idioma actual (fallback a español)
    const lang = document.documentElement.lang || 'es';
    
    if (lang === 'en') {
        timerElement.textContent = `${days} day${pluralDay}, ${hours} hour${pluralHour}, ${minutes} minute${pluralMinute}`;
    } else {
        timerElement.textContent = `${days} día${pluralDay}, ${hours} hora${pluralHour}, ${minutes} minuto${pluralMinute}`;
    }
}

// 🟢 INICIALIZACIÓN: Actualizar cuando alcor-alert.js esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que ALCOR_ALERT esté disponible
    const waitForAlcorAlert = setInterval(() => {
        if (typeof ALCOR_ALERT !== 'undefined' && ALCOR_ALERT.COINGECKO_LISTING_DATE) {
            console.log('✅ ALCOR_ALERT disponible, iniciando contador CoinGecko...');
            clearInterval(waitForAlcorAlert);
            
            // Actualizar inmediatamente
            updateCoingeckoNextEventTimer();
            
            // Actualizar cada segundo mientras el modal esté abierto
            setInterval(() => {
                updateCoingeckoNextEventTimer();
            }, 1000);
            
            // También actualizar cuando se muestre el modal
            const observer = new MutationObserver(() => {
                updateCoingeckoNextEventTimer();
            });
            
            // Observar cambios en el DOM (cuando se agregue el modal)
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }, 100);
});

// 🟢 Alternativa: Si se llama manualmente desde alcor-alert.js
window.updateCoingeckoCountdown = function() {
    updateCoingeckoNextEventTimer();
};

console.log('✨ Contador CoinGecko Next Event inicializado');