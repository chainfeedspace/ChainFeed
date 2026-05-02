/**
 * ============================================
 * SISTEMA DE MODAL DE RONDA PRIVADA DE INVERSORES
 * Para billetera.html
 * ============================================
 */

/**
 * Abre el modal de ronda privada
 */
function openInvestorRoundModal() {
    const modal = document.getElementById('investor-round-modal');
    if (!modal) {
        console.error('❌ Modal de inversores no encontrado');
        return;
    }
    
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal de ronda privada
 */
function closeInvestorRoundModal() {
    const modal = document.getElementById('investor-round-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

/**
 * Abre LinkedIn en nueva pestaña
 */
function openLinkedInInvestor() {
    window.open('https://www.linkedin.com/in/carlosjuana', '_blank', 'noopener,noreferrer');
}

/**
 * Copia email al portapapeles
 */
function copyInvestorEmail() {
    const email = 'chainfeed@chainfeed.space';
    
    navigator.clipboard.writeText(email).then(() => {
        // Crear toast de éxito
        showInvestorToast('success', 'Correo copiado', 'El correo ha sido copiado al portapapeles');
        
        // Cerrar modal después de 1 segundo
        setTimeout(() => {
            closeInvestorRoundModal();
        }, 1000);
    }).catch(err => {
        console.error('❌ Error copiando email:', err);
        showInvestorToast('error', 'Error', 'No se pudo copiar el correo');
    });
}

/**
 * Muestra un toast de notificación
 */
function showInvestorToast(type, title, message, duration = 5000) {
    const container = document.getElementById('investor-toast-container');
    if (!container) {
        console.warn('⚠️ Toast container no encontrado');
        return;
    }
    
    const icons = { 
        success: '✓', 
        error: '✕', 
        info: 'i' 
    };
    
    const toast = document.createElement('div');
    toast.className = `investor-toast ${type}`;
    toast.innerHTML = `
        <div class="investor-toast-icon">${icons[type] || '•'}</div>
        <div class="investor-toast-content">
            <div class="investor-toast-title">${title}</div>
            <div class="investor-toast-message">${message}</div>
        </div>
        <button class="investor-toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remover después de duración especificada
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Cierra el modal al hacer clic en el overlay
 */
document.addEventListener('DOMContentLoaded', function() {
    const investorModal = document.getElementById('investor-round-modal');
    
    if (investorModal) {
        investorModal.addEventListener('click', function(e) {
            if (e.target === investorModal) {
                closeInvestorRoundModal();
            }
        });
    }
    
    // También cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeInvestorRoundModal();
        }
    });
});

console.log('✅ Investor Modal Wallet JS cargado');