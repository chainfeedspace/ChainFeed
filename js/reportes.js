// ========================================
// SISTEMA DE REPORTES - FRONTEND
// ========================================

/**
 * Función para reportar contenido
 * @param {string} tipo - 'publicacion' o 'comentario'
 * @param {number} id - ID del contenido a reportar
 * @param {string} motivo - Motivo del reporte
 * @returns {Promise<Object>} Respuesta del servidor
 */
async function reportarContenido(tipo, id, motivo) {
    try {
        const response = await fetch('https://chainfeed.space/php/reportar_contenido.php', {
            method: 'POST',
            credentials: 'include', // IMPORTANTE para enviar sesión
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo: tipo,      // 'publicacion' o 'comentario'
                id: id,          // ID del contenido
                motivo: motivo   // Motivo del reporte
            })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Reporte enviado:', data);
            return {
                success: true,
                message: 'Reporte enviado correctamente',
                reporte_id: data.reporte_id
            };
        } else {
            console.error('❌ Error en reporte:', data.message);
            return {
                success: false,
                message: data.message
            };
        }
        
    } catch (error) {
        console.error('❌ Error de red:', error);
        return {
            success: false,
            message: 'Error al enviar el reporte'
        };
    }
}

// ========================================
// MODAL DE REPORTES
// ========================================

/**
 * Mostrar modal de reportes
 * @param {string} tipo - 'publicacion' o 'comentario'
 * @param {number} id - ID del contenido
 */
function mostrarModalReporte(tipo, id) {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal-reporte';
    modal.innerHTML = `
        <div class="modal-reporte-overlay" onclick="cerrarModalReporte()"></div>
        <div class="modal-reporte-contenido">
            <div class="modal-reporte-header">
                <h3>🚨 Reportar ${tipo === 'publicacion' ? 'Publicación' : 'Comentario'}</h3>
                <button onclick="cerrarModalReporte()" class="modal-close">&times;</button>
            </div>
            
            <div class="modal-reporte-body">
                <p>Selecciona el motivo del reporte:</p>
                
                <div class="motivos-lista">
                    <label class="motivo-item">
                        <input type="radio" name="motivo" value="contenido_inapropiado" checked>
                        <span>⚠️ Contenido Inapropiado</span>
                    </label>
                    
                    <label class="motivo-item">
                        <input type="radio" name="motivo" value="spam">
                        <span>📧 Spam o Contenido Irrelevante</span>
                    </label>
                    
                    <label class="motivo-item">
                        <input type="radio" name="motivo" value="acoso">
                        <span>😡 Acoso o Bullying</span>
                    </label>
                    
                    <label class="motivo-item">
                        <input type="radio" name="motivo" value="contenido_violento">
                        <span>🔪 Contenido Violento</span>
                    </label>
                    
                    <label class="motivo-item">
                        <input type="radio" name="motivo" value="desinformacion">
                        <span>❌ Información Falsa</span>
                    </label>
                </div>
            </div>
            
            <div class="modal-reporte-footer">
                <button onclick="cerrarModalReporte()" class="btn-cancelar">Cancelar</button>
                <button onclick="enviarReporte('${tipo}', ${id})" class="btn-reportar">
                    Enviar Reporte
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Agregar estilos si no existen
    if (!document.getElementById('estilos-modal-reporte')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-modal-reporte';
        estilos.textContent = `
            .modal-reporte {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            
            .modal-reporte-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .modal-reporte-contenido {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -45%);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
            }
            
            .modal-reporte-header {
                padding: 20px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-reporte-header h3 {
                margin: 0;
                font-size: 20px;
                color: #333;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s;
            }
            
            .modal-close:hover {
                background: #f5f5f5;
                color: #333;
            }
            
            .modal-reporte-body {
                padding: 20px;
            }
            
            .modal-reporte-body p {
                margin: 0 0 15px 0;
                color: #666;
            }
            
            .motivos-lista {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .motivo-item {
                display: flex;
                align-items: center;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .motivo-item:hover {
                border-color: #667eea;
                background: #f5f7ff;
            }
            
            .motivo-item input[type="radio"] {
                margin-right: 10px;
                cursor: pointer;
            }
            
            .motivo-item input[type="radio"]:checked + span {
                color: #667eea;
                font-weight: 600;
            }
            
            .modal-reporte-footer {
                padding: 20px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .btn-cancelar, .btn-reportar {
                padding: 10px 20px;
                border-radius: 8px;
                border: none;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-cancelar {
                background: #f5f5f5;
                color: #666;
            }
            
            .btn-cancelar:hover {
                background: #e0e0e0;
            }
            
            .btn-reportar {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .btn-reportar:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            
            .btn-reportar:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(estilos);
    }
}

/**
 * Cerrar modal de reportes
 */
function cerrarModalReporte() {
    const modal = document.querySelector('.modal-reporte');
    if (modal) {
        modal.remove();
    }
}

/**
 * Enviar reporte desde el modal
 */
async function enviarReporte(tipo, id) {
    // Obtener motivo seleccionado
    const motivoSeleccionado = document.querySelector('input[name="motivo"]:checked');
    
    if (!motivoSeleccionado) {
        alert('Por favor selecciona un motivo');
        return;
    }
    
    const motivo = motivoSeleccionado.value;
    
    // Deshabilitar botón
    const btnReportar = document.querySelector('.btn-reportar');
    btnReportar.disabled = true;
    btnReportar.textContent = 'Enviando...';
    
    // Enviar reporte
    const resultado = await reportarContenido(tipo, id, motivo);
    
    if (resultado.success) {
        // Cerrar modal
        cerrarModalReporte();
        
        // Mostrar mensaje de éxito
        alert('✅ Reporte enviado correctamente. Gracias por ayudarnos a mantener ChainFeed seguro.');
    } else {
        // Mostrar error
        alert('❌ ' + resultado.message);
        
        // Rehabilitar botón
        btnReportar.disabled = false;
        btnReportar.textContent = 'Enviar Reporte';
    }
}