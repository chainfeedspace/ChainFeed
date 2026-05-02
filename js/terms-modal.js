// Sistema de Términos y Condiciones - Global
(function() {
    if (window.termsModalInitialized) return;
    window.termsModalInitialized = true;
    
    console.log('🚀 Inicializando sistema de términos...');
    
    // CSS para scrollbar personalizado + bloqueo de scroll
    const customStyles = `
        <style id="terms-modal-styles">
            #terms-modal-overlay {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.95);
                z-index: 999;
                align-items: center;
                justify-content: center;
                padding: 20px;
                overflow-y: auto;
            }
            
            /* Bloquear scroll del body */
            body.terms-modal-open {
                overflow: hidden !important;
                position: fixed !important;
                width: 100% !important;
                height: 100% !important;
            }
            
            .terms-modal-content {
                background: #1a1a24;
                border: 1px solid rgba(99,102,241,0.3);
                border-radius: 24px;
                padding: 32px;
                max-width: 550px;
                width: 100%;
                top: 2rem;
                max-height: 85vh;
                overflow-y: auto;
                position: relative;
                margin: auto;
            }
            
            .terms-text-container {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 24px;
                max-height: 300px;
                overflow-y: auto;
                font-size: 13px;
                line-height: 1.6;
                color: #a0a0b8;
            }
            
            /* Scrollbar personalizado para WebKit (Chrome, Safari, Edge) */
            .terms-modal-content::-webkit-scrollbar,
            .terms-text-container::-webkit-scrollbar {
                width: 6px;
            }
            
            .terms-modal-content::-webkit-scrollbar-track,
            .terms-text-container::-webkit-scrollbar-track {
                background: rgba(255,255,255,0.05);
                border-radius: 3px;
            }
            
            .terms-modal-content::-webkit-scrollbar-thumb,
            .terms-text-container::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #6366f1, #a855f7);
                border-radius: 3px;
            }
            
            .terms-modal-content::-webkit-scrollbar-thumb:hover,
            .terms-text-container::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #818cf8, #c084fc);
            }
            
            /* Firefox */
            .terms-modal-content,
            .terms-text-container {
                scrollbar-width: thin;
                scrollbar-color: #6366f1 rgba(255,255,255,0.05);
            }
        </style>
    `;
    
    const modalHTML = `
    ${customStyles}
    <div id="terms-modal-overlay">
        <div class="terms-modal-content">
            <h2 style="font-size:24px;font-weight:700;margin-bottom:20px;text-align:center;color:#fff;">📜 Términos y Condiciones</h2>
            <div class="terms-text-container">
                <h3 style="color:#fff;font-size:16px;margin-bottom:8px;">Términos y Condiciones de ChainFeed</h3>
                <p><strong>Última actualización:</strong> Diciembre 2025</p>
                <h4 style="color:#fff;font-size:14px;margin:16px 0 8px;">1. Aceptación de Términos</h4>
                <p>Al registrarte y utilizar ChainFeed, aceptás cumplir con estos términos y condiciones.</p>
                <h4 style="color:#fff;font-size:14px;margin:16px 0 8px;">2. Requisitos de Uso</h4>
                <ul style="margin:8px 0 12px 20px;"><li>Ser mayor de 18 años</li><li>Proporcionar información veraz</li><li>Mantener la seguridad de tu cuenta</li></ul>
                <h4 style="color:#fff;font-size:14px;margin:16px 0 8px;">3. Tokens CFT</h4>
                <p>Los tokens CFT son de utilidad dentro de la plataforma. No constituyen inversiones ni garantizan retornos.</p>
                <h4 style="color:#fff;font-size:14px;margin:16px 0 8px;">4. Conducta Prohibida</h4>
                <ul style="margin:8px 0 12px 20px;"><li>Contenido ilegal u ofensivo</li><li>Spam o phishing</li><li>Manipular el sistema de recompensas</li><li>Múltiples cuentas</li></ul>
                <h4 style="color:#fff;font-size:14px;margin:16px 0 8px;">5. Suspensión</h4>
                <p>ChainFeed puede suspender cuentas que violen estos términos.</p>
            </div>
            <label style="display:flex;align-items:center;gap:12px;cursor:pointer;margin-bottom:24px;font-size:14px;color:#fff;">
                <input type="checkbox" id="accept-terms-check" style="width:20px;height:20px;accent-color:#6366f1;">
                <span>He leído y acepto los Términos y Condiciones</span>
            </label>
            <button id="btn-accept-terms" disabled style="width:100%;padding:16px;background:linear-gradient(135deg,#6366f1,#a855f7);border:none;border-radius:12px;color:white;font-size:16px;font-weight:700;cursor:pointer;opacity:0.5;transition:opacity 0.2s;">Continuar a ChainFeed</button>
        </div>
    </div>`;
    
    let scrollPosition = 0;
    
    function insertModal() {
        if (document.getElementById('terms-modal-overlay')) return;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        initModal();
    }
    
    function initModal() {
        const modal = document.getElementById('terms-modal-overlay');
        const modalContent = modal.querySelector('.terms-modal-content');
        const checkbox = document.getElementById('accept-terms-check');
        const btnAccept = document.getElementById('btn-accept-terms');
        
        function showTermsModal() {
            console.log('📜 Mostrando modal de términos');
            // Guardar posición actual y bloquear scroll
            scrollPosition = window.pageYOffset;
            document.body.classList.add('terms-modal-open');
            document.body.style.top = `-${scrollPosition}px`;
            modal.style.display = 'flex';
        }
        
        function hideTermsModal() {
            modal.style.display = 'none';
            // Restaurar scroll
            document.body.classList.remove('terms-modal-open');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
        }
        
        modalContent.addEventListener('click', e => e.stopPropagation());
        
        checkbox.addEventListener('change', function() {
            btnAccept.disabled = !this.checked;
            btnAccept.style.opacity = this.checked ? '1' : '0.5';
        });
        
        btnAccept.addEventListener('click', async function() {
            if (!checkbox.checked) return;
            
            this.disabled = true;
            this.textContent = 'Procesando...';
            
            try {
                const response = await fetch('/php/accept_terms.php', { 
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    hideTermsModal();
                    window.location.reload();
                } else {
                    alert('Error: ' + (data.error || 'Intenta de nuevo'));
                    this.disabled = false;
                    this.textContent = 'Continuar a ChainFeed';
                    checkbox.checked = false;
                    btnAccept.style.opacity = '0.5';
                }
            } catch (error) {
                alert('Error de conexión');
                this.disabled = false;
                this.textContent = 'Continuar a ChainFeed';
                checkbox.checked = false;
                btnAccept.style.opacity = '0.5';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'flex' && e.key === 'Escape') {
                e.preventDefault();
            }
        });
        
        // Prevenir scroll con rueda del mouse en el overlay (fuera del modal)
        modal.addEventListener('wheel', function(e) {
            if (e.target === modal) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevenir scroll táctil en el overlay
        modal.addEventListener('touchmove', function(e) {
            if (e.target === modal) {
                e.preventDefault();
            }
        }, { passive: false });
        
        window.showTermsModal = showTermsModal;
    }
    
    async function verificarTerminos() {
        try {
            const response = await fetch('/php/verificar_sesion.php', { credentials: 'include' });
            const data = await response.json();
            
            if (data.success && data.user && data.user.terms_accepted === false) {
                insertModal();
                window.showTermsModal();
            }
        } catch (error) {
            // No hay sesión
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(verificarTerminos, 300));
    } else {
        setTimeout(verificarTerminos, 300);
    }
})();