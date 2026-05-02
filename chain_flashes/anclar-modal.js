/**
 * ANCLAR FLASH MODAL
 * Modal para seleccionar días de anclaje en inicio
* 2 días = 25 CFT, 3 días = 35 CFT, 5 días = 55 CFT
 * Cada re-anclaje incrementa +2 CFT
 */

(function() {
    // Inyectar estilos CSS
    const styles = `
        <style id="anclarModalStyles">
            /* Modal Container */
            .anclar-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                z-index: 999999;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .anclar-modal.active {
                display: flex;
                opacity: 1;
            }

            /* Modal Content */
            .anclar-modal-content {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .anclar-modal.active .anclar-modal-content {
                transform: scale(1);
            }

            /* Header */
            .anclar-modal-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .anclar-modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f59e0bed;
    -webkit-background-clip: text;
    /* -webkit-text-fill-color: transparent; */
    margin-bottom: 0.5rem;
            }

            .anclar-modal-subtitle {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
            }

            /* Options */
            .anclar-options {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .anclar-option {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .anclar-option:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(251, 191, 36, 0.5);
                transform: translateY(-2px);
            }

            .anclar-option.selected {
                background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
                border-color: #fbbf24;
                box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
            }

            .anclar-option-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .anclar-option-days {
                font-size: 1.2rem;
                font-weight: 700;
                color: white;
            }

            .anclar-option-cost {
                background: linear-gradient(135deg, #fbbf24, #f59e0b);
                color: #000;
                padding: 0.4rem 1rem;
                border-radius: 20px;
                font-weight: 700;
                font-size: 0.9rem;
            }

            .anclar-option-features {
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.85rem;
                line-height: 1.6;
            }

            .anclar-option-feature {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }

            .anclar-option-icon {
                color: #fbbf24;
            }

            /* Popular Badge */
            .popular-badge {
    position: static;
    background: linear-gradient(135deg, #ec4899, #ef4444);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
            }

            /* Buttons */
            .anclar-modal-buttons {
                display: flex;
                gap: 1rem;
            }

            .anclar-btn {
                flex: 1;
                padding: 1rem;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .anclar-btn-cancel {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .anclar-btn-cancel:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .anclar-btn-confirm {
                background: linear-gradient(135deg, #fbbf24, #f59e0b);
                color: #000;
                font-weight: 700;
            }

            .anclar-btn-confirm:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(251, 191, 36, 0.4);
            }

            .anclar-btn-confirm:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .anclar-modal-content {
                    padding: 1.5rem;
                    max-width: 95%;
                }

                .anclar-option {
                    padding: 1.2rem;
                }

                .anclar-modal-buttons {
                    flex-direction: column;
                }
            }
        </style>
    `;

    // Inyectar HTML del modal
    const modalHTML = `
        <div class="anclar-modal" id="anclarFlashModal">
            <div class="anclar-modal-content">
                <div class="anclar-modal-header">
                    <h2 class="anclar-modal-title">⛓️ Anclar Flash</h2>
                    <p class="anclar-modal-subtitle">Elige cuánto tiempo quieres destacarlo en inicio</p>
                </div>

                <div class="anclar-options">
                    <!-- Opción 2 días -->
                    <div class="anclar-option" data-dias="2" data-costo="25">
                        <div class="anclar-option-header">
                            <span class="anclar-option-days">2 días</span>
                            <span class="anclar-option-cost">25 CFT</span>
                        </div>
                        <div class="anclar-option-features">
                            <div class="anclar-option-feature">
                                <span class="anclar-option-icon">✨</span>
                                Permanente en tu perfil
                            </div>
                            <div class="anclar-option-feature">
                                <span class="anclar-option-icon">🔥</span>
                                Destacado en inicio por 2 días
                            </div>
                        </div>
                    </div>

                    <!-- Opción 3 días -->
                    <div class="anclar-option" data-dias="3" data-costo="35">
                        <span class="popular-badge">Más Popular</span>
                        <div class="anclar-option-header">
                            <span class="anclar-option-days">3 días</span>
                            <span class="anclar-option-cost">35 CFT</span>
                        </div>
                        <div class="anclar-option-features">
                            <div class="anclar-option-feature">
                                <span class="anclar-option-icon">✨</span>
                                Permanente en tu perfil
                            </div>
                            <div class="anclar-option-feature">
                                <span class="anclar-option-icon">🔥</span>
                                Destacado en inicio por 3 días
                            </div>
                            <div class="anclar-option-feature">
                                <span class="anclar-option-icon">📈</span>
                                Mayor alcance y visibilidad
                            </div>
                        </div>
                    </div>

                    <!-- Opción 5 días -->
                    <div class="anclar-option" data-dias="5" data-costo="55">
                        <div class="anclar-option-header">
                            <span class="anclar-option-days">5 días</span>
                            <span class="anclar-option-cost">55 CFT</span>
                        </div>
                        <div class="anclar-option-features">
                            <div class="anclar-option-feature">
                                <span class="anclar-option-icon">✨</span>
                                Permanente en tu perfil
                            </div>
                            <div class="anclar-option-feature">
                                <span class="anclar-option-icon">🔥</span>
                                Destacado en inicio por 5 días
                            </div>
                            <div class="anclar-option-feature">
                                <span class="anclar-option-icon">💎</span>
                                Máxima exposición y engagement
                            </div>
                        </div>
                    </div>
                </div>

                <div class="anclar-modal-buttons">
                    <button class="anclar-btn anclar-btn-cancel" id="anclarCancelBtn">
                        Cancelar
                    </button>
                    <button class="anclar-btn anclar-btn-confirm" id="anclarConfirmBtn" disabled>
                        Confirmar Anclaje
                    </button>
                </div>
            </div>
        </div>
    `;

    // Clase del Modal
    class AnclarFlashModal {
        constructor() {
            this.modal = null;
            this.selectedDias = null;
            this.selectedCosto = null;
            this.flashId = null;
            this.onSuccess = null;
            
            this.injectHTML();
            this.init();
        }

        // Calcular costo considerando incremento por re-anclajes
calcularCostoIncremental(diasBase, vecesReanclado = 0) {
    const costosBase = {
        2: 25,
        3: 35,
        5: 55
    };
    
    return costosBase[diasBase] + (vecesReanclado * 2);
}

        injectHTML() {
            // Inyectar estilos
            document.head.insertAdjacentHTML('beforeend', styles);
            
            // Inyectar modal
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            this.modal = document.getElementById('anclarFlashModal');
        }

        init() {
            if (!this.modal) {
                console.error('❌ Modal de anclaje no encontrado');
                return;
            }

            // Selección de opciones
            document.querySelectorAll('.anclar-option').forEach(option => {
                option.addEventListener('click', () => {
                    this.selectOption(option);
                });
            });

            // Botón cancelar
            const cancelBtn = document.getElementById('anclarCancelBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.close();
                });
            }

            // Botón confirmar
            const confirmBtn = document.getElementById('anclarConfirmBtn');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    this.confirm();
                });
            }

            // Cerrar con ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                    this.close();
                }
            });

            // Cerrar al hacer click fuera
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });

            console.log('✅ Modal de anclaje inicializado');
        }

        selectOption(option) {
            // Remover selección anterior
            document.querySelectorAll('.anclar-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Seleccionar nueva opción
            option.classList.add('selected');
            this.selectedDias = parseInt(option.dataset.dias);
            this.selectedCosto = parseFloat(option.dataset.costo);

            // Habilitar botón confirmar
            const confirmBtn = document.getElementById('anclarConfirmBtn');
            if (confirmBtn) {
                confirmBtn.disabled = false;
            }

            console.log(`📊 Seleccionado: ${this.selectedDias} días por ${this.selectedCosto} CFT`);
        }

open(flashId, onSuccess, isReanclar = false, diasRestantes = 0, vecesReanclado = 0) {
    this.flashId = flashId;
    this.onSuccess = onSuccess;
    this.isReanclar = isReanclar;
    this.diasRestantes = diasRestantes;
    this.vecesReanclado = vecesReanclado;
    
    if (isReanclar) {
        this.updateModalForReanclar(diasRestantes);
    } else {
        this.resetModalToNormal();
    }
    
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    console.log(`🎯 Abriendo modal para Flash ID: ${flashId} ${isReanclar ? '(RE-ANCLAJE)' : '(NUEVO)'}`);
}

updateModalForReanclar(diasRestantes) {
    // Función helper para traducir
    const t = (text) => {
        if (typeof translateText === 'function') {
            return translateText(text, window.getLanguage ? window.getLanguage() : 'es');
        }
        if (window.translationSystem && typeof window.translationSystem.translate === 'function') {
            return window.translationSystem.translate(text, window.getLanguage ? window.getLanguage() : 'es');
        }
        return text;
    };
    
    // Cambiar título
    const title = document.querySelector('.anclar-modal-title');
    if (title) {
        title.textContent = t('🔄 Re-anclar Flash');
    }
    
    const subtitle = document.querySelector('.anclar-modal-subtitle');
    if (subtitle) {
        subtitle.textContent = `${t('Tienes')} ${diasRestantes} ${t('días restantes. Máximo total: 10 días')}`;
    }
    
    // Calcular costos con incremento
    const opciones = [
        { dias: 2, costo: this.calcularCostoIncremental(2, this.vecesReanclado) },
        { dias: 3, costo: this.calcularCostoIncremental(3, this.vecesReanclado) },
        { dias: 5, costo: this.calcularCostoIncremental(5, this.vecesReanclado) }
    ];
    
    document.querySelectorAll('.anclar-option').forEach((option, index) => {
        const dias = opciones[index].dias;
        const costo = opciones[index].costo;
        const totalDias = diasRestantes + dias;
        
        if (totalDias > 10) {
            // Deshabilitar opción
            option.style.opacity = '0.5';
            option.style.cursor = 'not-allowed';
            option.style.pointerEvents = 'none';
            
            const costSpan = option.querySelector('.anclar-option-cost');
            if (costSpan) {
                costSpan.textContent = t('No disponible');
                costSpan.style.background = '#6b7280';
            }
        } else {
            option.style.opacity = '1';
            option.style.cursor = 'pointer';
            option.style.pointerEvents = 'auto';
            option.dataset.dias = dias;
            option.dataset.costo = costo;
            
            const daysSpan = option.querySelector('.anclar-option-days');
            if (daysSpan) {
                daysSpan.textContent = `${dias} ${t('días (Total:')} ${totalDias})`;
            }
            
            const costSpan = option.querySelector('.anclar-option-cost');
            if (costSpan) {
                costSpan.textContent = `${costo} CFT`;
                costSpan.style.background = ''; // Reset background
            }
        }
    });
}

resetModalToNormal() {
    const title = document.querySelector('.anclar-modal-title');
    if (title) {
        title.textContent = '⛓️ Anclar Flash';
    }
    
    const subtitle = document.querySelector('.anclar-modal-subtitle');
    if (subtitle) {
        subtitle.textContent = 'Elige cuánto tiempo quieres destacarlo en inicio';
    }
    
const opcionesOriginales = [
    { dias: 2, costo: 25 },
    { dias: 3, costo: 35 },
    { dias: 5, costo: 55 }
];
    
    document.querySelectorAll('.anclar-option').forEach((option, index) => {
        option.style.opacity = '1';
        option.style.cursor = 'pointer';
        option.style.pointerEvents = 'auto';
        option.dataset.dias = opcionesOriginales[index].dias;
        option.dataset.costo = opcionesOriginales[index].costo;
        
        const daysSpan = option.querySelector('.anclar-option-days');
        if (daysSpan) {
            daysSpan.textContent = `${opcionesOriginales[index].dias} días`;
        }
        
        const costSpan = option.querySelector('.anclar-option-cost');
        if (costSpan) {
            costSpan.textContent = `${opcionesOriginales[index].costo} CFT`;
        }
    });
}

        close() {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset después de la animación
            setTimeout(() => {
                document.querySelectorAll('.anclar-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                const confirmBtn = document.getElementById('anclarConfirmBtn');
                if (confirmBtn) {
                    confirmBtn.disabled = true;
                }
                
                this.selectedDias = null;
                this.selectedCosto = null;
                this.flashId = null;
            }, 300);

            console.log('❌ Modal cerrado');
        }

async confirm() {
    if (!this.selectedDias || !this.flashId) {
        this.showNotification('Selecciona una opción primero', 'error');
        return;
    }

    // Función helper para traducir (definirla al inicio para usarla en todo el método)
    const t = (text) => {
        if (window.translationSystem && typeof window.translationSystem.translate === 'function') {
            return window.translationSystem.translate(text, window.getLanguage ? window.getLanguage() : 'es');
        }
        return text;
    };

    const btn = document.getElementById('anclarConfirmBtn');
    btn.disabled = true;
    btn.textContent = t('Procesando...');

    try {
        // ✅ Determinar endpoint según si es re-anclaje o no
        const endpoint = this.isReanclar 
            ? '/php/chain_flashes/reanclar_flash.php'
            : '/php/chain_flashes/anclar_flash.php';
        
        const body = this.isReanclar
            ? { flash_id: this.flashId, dias: this.selectedDias }
            : { flash_id: this.flashId, dias_inicio: this.selectedDias };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        const data = await response.json();

if (data.success) {
    // Construir mensaje traducido en el frontend
    let mensaje;
    
    if (this.isReanclar) {
        // Mensaje para re-anclaje
        mensaje = `🔄 ${t('Flash re-anclado exitosamente!')} ✨ +${this.selectedDias} ${t('días agregados')} 🔥 ${t('Total:')} ${data.total_dias || (this.diasRestantes + this.selectedDias)} ${t('días de visibilidad')} 💰 ${t('Costo:')} ${this.selectedCosto} CFT`;
    } else {
        // Mensaje para anclaje nuevo
        mensaje = `⛓️ ${t('Flash anclado exitosamente!')} ✨ ${t('Permanente en tu perfil')} 🔥 ${t('Destacado en inicio por')} ${this.selectedDias} ${t('días')}`;
    }
    
    this.showNotification(mensaje, 'success');
    this.close();
    
    // Ejecutar callback de éxito
    if (this.onSuccess) {
        this.onSuccess();
    }
} else {
    this.showNotification(t(data.message), 'error');
}

    } catch (error) {
        console.error('Error anclando Flash:', error);
        this.showNotification(t('Error al procesar el anclaje'), 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = t('Confirmar Anclaje');
    }
}

        showNotification(message, type) {
            if (typeof showNotification === 'function') {
                showNotification(message, type);
            } else {
                console.log(`[${type.toUpperCase()}] ${message}`);
                alert(message);
            }
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.anclarModal = new AnclarFlashModal();
            console.log('✅ anclar-modal.js inicializado (DOMContentLoaded)');
        });
    } else {
        // Si el DOM ya está listo, inicializar inmediatamente
        window.anclarModal = new AnclarFlashModal();
        console.log('✅ anclar-modal.js inicializado (inmediato)');
    }

    console.log('✅ anclar-modal.js cargado');
})();