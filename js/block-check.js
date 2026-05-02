/**
 * SISTEMA DE VERIFICACIÓN DE BLOQUEOS v2.0 FINAL
 * Verifica si el usuario está bloqueado en la base de datos
 */

(function() {
    'use strict';
    
    console.log('🛡️ BLOCK-CHECK v2.0 INICIANDO...');

    const BLOCK_PAGE = '/acceso-bloqueado.html';
    const API_ENDPOINT = '/php/check_user_block.php';

    function isBlockPage() {
        const path = window.location.pathname.toLowerCase();
        return path.includes('acceso-bloqueado') || path.includes('login') || path.includes('register');
    }

    function getUserData() {
        try {
            const userData = localStorage.getItem('chainfeed_user');
            if (!userData) {
                console.log('📭 No hay usuario en sesión');
                return null;
            }
            const user = JSON.parse(userData);
            console.log('👤 Usuario detectado:', user.username, '| ID:', user.id);
            return user;
        } catch (error) {
            console.error('❌ Error al obtener datos del usuario:', error);
            return null;
        }
    }

    async function checkUserBlockStatus(userId) {
        try {
            console.log('🔍 Consultando estado de bloqueo para ID:', userId);
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('📡 Respuesta de API:', data);
            return data;
        } catch (error) {
            console.error('❌ Error al consultar API:', error);
            return { success: false, is_blocked: false, error: error.message };
        }
    }

    function blockUserAccess(blockInfo) {
        console.log('🚫 BLOQUEANDO ACCESO - Usuario bloqueado');
        localStorage.setItem('chainfeed_block_info', JSON.stringify(blockInfo));

        // Crear overlay con animaciones modernas
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            z-index: 999999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 1rem !important;
            animation: fadeIn 0.3s ease-out !important;
        `;

        const tipoBloqueo = blockInfo.type === 'temporal' ? 'Temporal' : 'Permanente';
        const tiempoRestante = blockInfo.time_remaining ? 
            `<div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 12px;">
                <div style="font-size: 0.9rem; color: #ffc107; margin-bottom: 0.3rem;">⏰ Tiempo restante</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #ffc107;">${blockInfo.time_remaining}</div>
            </div>` : '';

        overlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a24 0%, #0f0f14 100%);
                border: 2px solid rgba(255, 107, 107, 0.3);
                border-radius: 24px;
                padding: 2rem;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(255, 107, 107, 0.3);
                animation: slideUp 0.4s ease-out;
                position: relative;
                overflow: hidden;
            ">
                <!-- Barra superior animada -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #ff6b6b, #ee5a6f, #c44569);
                    animation: shimmer 2s ease-in-out infinite;
                "></div>

                <!-- Icono animado -->
                <div style="
                    text-align: center;
                    font-size: 5rem;
                    margin-bottom: 1.5rem;
                    animation: pulse 2s ease-in-out infinite;
                ">⛔</div>

                <!-- Título -->
                <h1 style="
                    color: #ff6b6b;
                    font-size: 2rem;
                    font-weight: 800;
                    text-align: center;
                    margin-bottom: 0.5rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">Cuenta Bloqueada</h1>

                <!-- Tipo de bloqueo -->
                <div style="
                    text-align: center;
                    margin-bottom: 1.5rem;
                ">
                    <span style="
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        background: rgba(255, 107, 107, 0.2);
                        border: 1px solid rgba(255, 107, 107, 0.4);
                        border-radius: 50px;
                        color: #ff6b6b;
                        font-size: 0.9rem;
                        font-weight: 600;
                    ">${tipoBloqueo === 'Temporal' ? '⏱️' : '🔒'} Bloqueo ${tipoBloqueo}</span>
                </div>

                <!-- Mensaje -->
                <p style="
                    color: #a0a0b8;
                    font-size: 1rem;
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">Tu cuenta ha sido bloqueada debido a infracciones de las normas de la comunidad.</p>

                <!-- Info de infracciones -->
                <div style="
                    background: rgba(255, 107, 107, 0.1);
                    border: 1px solid rgba(255, 107, 107, 0.3);
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                ">
                    <div style="
                        font-size: 0.85rem;
                        color: #ff6b6b;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 0.5rem;
                        font-weight: 600;
                    ">Infracciones Acumuladas</div>
                    <div style="
                        font-size: 3rem;
                        font-weight: 800;
                        color: #ff6b6b;
                        line-height: 1;
                    ">${blockInfo.infracciones_count || 0}</div>
                </div>

                ${tiempoRestante}

                <!-- Countdown -->
                <div style="
                    text-align: center;
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                ">
                    <div style="
                        color: #666;
                        font-size: 0.9rem;
                        margin-bottom: 0.5rem;
                    ">Redirigiendo en</div>
                    <div id="countdown" style="
                        font-size: 2rem;
                        font-weight: 800;
                        color: #ff6b6b;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    ">3</div>
                </div>
            </div>
        `;

        // Agregar estilos de animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { 
                    transform: translateY(30px);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes pulse {
                0%, 100% { 
                    transform: scale(1);
                    opacity: 0.8;
                }
                50% { 
                    transform: scale(1.1);
                    opacity: 1;
                }
            }
            @keyframes shimmer {
                0%, 100% { 
                    background-position: 0% 50%;
                }
                50% { 
                    background-position: 100% 50%;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';

        // Countdown animado
        let seconds = 3;
        const countdownEl = document.getElementById('countdown');
        const countdownInterval = setInterval(() => {
            seconds--;
            if (countdownEl) {
                countdownEl.textContent = seconds;
            }
            if (seconds <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);

        setTimeout(() => {
            console.log('🔄 Redirigiendo a:', BLOCK_PAGE);
            window.location.replace(BLOCK_PAGE);
        }, 3000);
    }

    async function executeBlockCheck() {
        console.log('\n🔍 === INICIANDO VERIFICACIÓN DE BLOQUEOS ===');

        if (isBlockPage()) {
            console.log('✅ Página de bloqueo/auth - Saltando verificación');
            return;
        }

        const user = getUserData();
        if (!user || !user.id) {
            console.log('ℹ️ No hay usuario logueado');
            return;
        }

        const result = await checkUserBlockStatus(user.id);

        if (!result.success) {
            console.log('⚠️ Error en la consulta - Permitiendo acceso');
            return;
        }

        if (result.is_blocked === true && result.block_info) {
            console.log('🚨 USUARIO BLOQUEADO DETECTADO');
            blockUserAccess(result.block_info);
            return;
        }

        console.log('✅ Usuario NO está bloqueado');
    }

    console.log('🛡️ BLOCK-CHECK v2.0 CARGADO');
    
    executeBlockCheck();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeBlockCheck);
    }
    
    setInterval(executeBlockCheck, 30000);
    window.addEventListener('focus', executeBlockCheck);
    
    window.testBlockCheck = function() {
        console.log('\n🧪 TEST MANUAL');
        return executeBlockCheck();
    };
    
    window.clearBlockInfo = function() {
        localStorage.removeItem('chainfeed_block_info');
        console.log('🧹 Info limpiada');
    };
    
    window.blockCheckInfo = function() {
        return { version: '2.0', loaded: true, api_endpoint: API_ENDPOINT };
    };
    
    console.log('✅ BLOCK-CHECK v2.0 INICIALIZADO');

})();