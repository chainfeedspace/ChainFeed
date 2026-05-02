<?php
session_start([
    'cookie_lifetime' => 86400,
    'cookie_secure'   => true,
    'cookie_httponly' => true,
    'use_strict_mode' => true,
    'cookie_samesite' => 'Lax',
]);

if (empty($_SESSION['user_id'])) {
    header('Location: https://chainfeed.space');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ChainRush Pro - ChainFeed</title>
    <link rel="stylesheet" href="puntos/puntos.css">
</head>
<body>
    <div id="game-container">
        <!-- Alerta de peligro -->
        <div id="danger-alert" class="danger-alert hidden">
            ⚠️ ¡CUIDADO! <span id="misses-count">0</span>/3 fallos
        </div>

        <!-- Header Info -->
        <div class="game-header">
            <div class="token-display" style="cursor: pointer; transition: all 0.2s ease;" title="Click para retirar">
                <span class="token-icon">💎</span>
                <div class="token-info">
                    <span class="token-label">CFT Hoy</span>
                    <span class="token-value" id="daily-tokens">0</span>
                </div>
            </div>
            <div class="lives-display">
                <span class="lives-label">VIDAS</span>
                <div class="lives-hearts" id="lives">❤️❤️❤️</div>
            </div>
            <div class="record-display">
                <span class="record-label">Récord</span>
                <span class="record-value" id="high-score">0</span>
            </div>
        </div>


<div id="no-lives-overlay" class="no-lives-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
    
    <!-- ✕ BOTÓN CERRAR - ESQUINA SUPERIOR DERECHA -->
    <button id="modal-close-btn" style="
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: #94a3b8;
        font-size: 24px;
        font-weight: 700;
        cursor: pointer;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 10001;
    " title="Cerrar (el modal reaparecerá si intentas jugar)">
        ✕
    </button>

    <!-- CONTENIDO DEL MODAL -->
    <div style="
        background: linear-gradient(145deg, #0f0f23, #1a1a2e);
        border: 2px solid #6366f1;
        border-radius: 24px;
        padding: 32px 24px;
        width: 100%;
        max-width: 340px;
        text-align: center;
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.2);
        animation: popIn 0.25s ease;
    ">
        <!-- Mensaje SIN VIDAS -->
        <div class="no-lives-message" style="margin-bottom: 24px;">
            <div style="font-size: 56px; margin-bottom: 12px;">💀</div>
            <h2 style="
                color: #f8fafc;
                font-size: 22px;
                font-weight: 900;
                margin: 0 0 8px;
                text-transform: uppercase;
                letter-spacing: 1px;
            ">SIN VIDAS</h2>
            <p style="
                color: #94a3b8;
                font-size: 13px;
                margin: 0;
            ">Espera 24 horas o compra ahora</p>
        </div>
        
        <!-- SECCIÓN: RECLAMAR CFT (si hay pendientes) -->
        <div id="claim-section" style="
            background: rgba(34, 197, 94, 0.12);
            border: 2px solid rgba(34, 197, 94, 0.35);
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 20px;
            display: none;
        ">
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            ">
                <div style="font-size: 20px;">💎</div>
                <div style="
                    color: #22c55e;
                    font-weight: 900;
                    font-size: 18px;
                " id="claim-amount">0 CFT</div>
            </div>
            
            <p style="
                color: #10b981;
                font-size: 12px;
                margin: 0 0 12px;
                line-height: 1.5;
                font-weight: 600;
            ">
                ✅ Tienes recompensas pendientes de reclamar
            </p>

            <button id="claim-btn-modal" style="
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #22c55e, #16a34a);
                color: #fff;
                font-size: 13px;
                font-weight: 900;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.2s ease;
            ">
                ⬇ RECLAMAR AHORA
            </button>
        </div>

        <!-- BOTÓN COMPRAR VIDAS -->
        <button id="floating-buy-lives" class="buy-lives-floating" style="
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #000;
            font-size: 14px;
            font-weight: 900;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            margin-bottom: 12px;
        ">
            <span>❤️ +3 VIDAS</span>
            <span class="price" style="font-size: 12px; opacity: 0.8;">3 CFT</span>
        </button>

        <!-- INFO: TIMER VIDAS GRATIS -->
        <div id="timer-section" style="
            background: rgba(148, 163, 184, 0.1);
            border: 1px solid rgba(148, 163, 184, 0.25);
            border-radius: 10px;
            padding: 10px;
            text-align: center;
            display: none;
            margin-bottom: 12px;
        ">
            <div style="
                color: #64748b;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 4px;
            ">⏱️ Próximas vidas gratis en</div>
            <div id="timer-display" style="
                color: #94a3b8;
                font-size: 16px;
                font-weight: 900;
            ">00h 00m 00s</div>
        </div>

        <!-- BOTÓN VOLVER AL MENÚ -->
        <button id="back-to-menu-btn" style="
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: #fff;
            font-size: 13px;
            font-weight: 900;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            margin-bottom: 8px;
        ">
            🏠 VOLVER AL MENÚ
        </button>

        <!-- BOTÓN SALIR -->
        <button id="exit-game-btn" style="
            width: 100%;
            background: transparent;
            border: 2px solid rgba(255,255,255,0.2);
            color: #94a3b8;
            padding: 10px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        ">
            SALIR A OTRA PÁGINA
        </button>
    </div>
</div>

<!-- Pantalla de Inicio -->
<div id="start-screen" class="screen active">
    <div class="logo">⚡ ChainRush <span class="pro-badge">PRO</span></div>
    <p class="tagline">Precisión extrema. Recompensas épicas.</p>
    
    <div class="rules-box">
        <h3>📋 REGLAS DE SUPERVIVENCIA</h3>
        <ul>
            <li>🟢 Clic en <strong>VERDES</strong> (+11 pts)</li>
            <li>⭐ Un <strong>BONUS DORADO</strong> por partida (+500 pts)</li>
            <li>💣 <strong>BOMBAS</strong> = Game Over instantáneo</li>
            <li>💀 3 clicks <strong>FUERA</strong> = Descalificación</li>
            <li>⚡ Multiplicador cada 5 aciertos (máx ×5)</li>
            <li>⏱️ 45 segundos | 💎 1000 pts = 0.10 CFT | Máx 3.00 CFT/partida</li>
        </ul>
    </div>

    <div class="stats-preview">
        <div class="preview-item">
            <span class="preview-label">Dificultad</span>
            <div class="difficulty-bar">
                <div class="difficulty-fill" style="width: 85%"></div>
            </div>
            <span class="preview-value">EXTREMA</span>
        </div>
    </div>

    <button id="start-btn" class="btn-primary">INICIAR DESAFÍO</button>
    <p class="cooldown-msg" id="cooldown-msg"></p>

    <!-- ✅ BOTÓN RANKING SEMANAL -->
<button id="ranking-btn" style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px 20px;background:linear-gradient(135deg,#1e1b4b,#312e81);border:2px solid rgba(99,102,241,0.45);border-radius:16px;cursor:pointer;color:#a5b4fc;font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:1px;transition:all .2s ease;margin-top:12px;">
    <span style="font-size:20px;">🏆</span>
    <span>RANKING SEMANAL</span>
    <span style="background:rgba(99,102,241,0.3);border-radius:8px;padding:2px 8px;font-size:11px;color:#c7d2fe;">PODIO</span>
</button>

    <!-- ✅ BOTÓN SALIR NUEVO -->
    <button id="exit-btn-start" style="
        width: 100%;
        margin-top: 16px;
        padding: 12px 24px;
        background: transparent;
        border: 2px solid rgba(255, 255, 255, 0.2);
        color: #94a3b8;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        border-radius: 12px;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    ">
        🚪 SALIR A CHAINFEED
    </button>
</div>

        <!-- Pantalla de Juego -->
        <div id="game-screen" class="screen">
            <div class="hud">
                <div class="hud-item score-box">
                    <span class="hud-label">Puntos</span>
                    <span class="hud-value" id="score">0</span>
                    <span class="hud-sub" id="score-target">meta: 100</span>
                </div>
                <div class="hud-item combo-box">
                    <span class="hud-label">Combo</span>
                    <span class="hud-value combo" id="combo">x1</span>
                </div>
                <div class="hud-item time-box">
                    <span class="hud-label">Tiempo</span>
                    <span class="hud-value" id="timer">45</span>
                </div>
            </div>

            <div id="game-area"></div>

            <div class="progress-bar">
                <div class="progress-fill" id="daily-progress"></div>
            </div>
            <span class="progress-label">Progreso CFT (1000 pts = 0.10 token)</span>
        </div>

        <!-- Pantalla de Resultados -->
        <div id="result-screen" class="screen">
            <div class="result-icon" id="result-icon">🎯</div>
            <h2 class="result-title" id="result-title">¡Partida Finalizada!</h2>
            
            <div class="result-reason" id="result-reason"></div>

            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-label">Puntuación</span>
                    <span class="stat-value" id="final-score">0</span>
                </div>
                <div class="stat-box highlight">
                    <span class="stat-label">CFT Ganados</span>
                    <span class="stat-value cft" id="earned-tokens">0</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Precisión</span>
                    <span class="stat-value" id="accuracy">0%</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Máx Combo</span>
                    <span class="stat-value" id="max-combo">x1</span>
                </div>
            </div>

            <div class="bonus-detail" id="bonus-detail" style="display: none;">
                <span class="bonus-icon">⭐</span>
                <span>Bonus dorado capturado: +500 pts</span>
            </div>

            <div class="reward-animation" id="reward-animation">
                <span>+</span><span id="reward-amount">0</span><span> CFT</span>
            </div>

            <button id="play-again-btn" class="btn-primary">NUEVO INTENTO</button>
            <button id="claim-btn" class="btn-secondary">RECLAMAR Y VOLVER</button>
            
            <p class="anti-cheat-msg">Chainfeed - Tokenizando tus actividades</p>
        </div>
    </div>

    <!-- ════════════════════════════════════════════════════════ -->
    <!-- SCRIPT DEL MODAL SIN VIDAS -->
    <!-- ════════════════════════════════════════════════════════ -->
    <script>
    (function() {
        'use strict';

        const overlay = document.getElementById('no-lives-overlay');
        const claimSection = document.getElementById('claim-section');
        const claimBtn = document.getElementById('claim-btn-modal');
        const claimAmount = document.getElementById('claim-amount');
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        const buyLivesBtn = document.getElementById('floating-buy-lives');
        const exitBtn = document.getElementById('exit-game-btn');
        const timerSection = document.getElementById('timer-section');
        const timerDisplay = document.getElementById('timer-display');

        // Mostrar modal SIN VIDAS
        window.showNoLivesModal = function() {
            console.log('[NoLives] Mostrando modal');
            
            if (overlay) overlay.style.display = 'flex';

            const pendingTokens = state?.pendingTokens || 0;
            console.log('[NoLives] Tokens pendientes:', pendingTokens);

            if (pendingTokens > 0) {
                if (claimSection) {
                    claimSection.style.display = 'block';
                    claimAmount.textContent = pendingTokens.toFixed(2) + ' CFT';
                }
            } else {
                if (claimSection) claimSection.style.display = 'none';
            }

            updateFreeLifesTimer();
        };

        // Ocultar modal SIN VIDAS
        window.hideNoLivesModal = function() {
            console.log('[NoLives] Ocultando modal');
            if (overlay) overlay.style.display = 'none';
        };

        // RECLAMAR CFT desde el modal
        claimBtn?.addEventListener('click', async function() {
            const tokens = state?.pendingTokens || 0;
            
            if (tokens <= 0) {
                console.warn('[NoLives] Sin tokens para reclamar');
                return;
            }

            console.log('[NoLives] Reclamando', tokens, 'CFT');
            
            claimBtn.disabled = true;
            claimBtn.textContent = '⏳ Procesando...';

            const result = await rewardUser(tokens);

            if (result?.success) {
                console.log('[NoLives] ✅ Reclamo exitoso');
                
                claimBtn.textContent = '✅ RECLAMADO';
                claimBtn.style.background = 'rgba(34, 197, 94, 0.3)';
                
                setTimeout(() => {
                    if (claimSection) claimSection.style.display = 'none';
                    claimBtn.disabled = false;
                    claimBtn.textContent = '⬇ RECLAMAR AHORA';
                    claimBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                }, 2000);

                if (typeof updateUI === 'function') updateUI();
                if (typeof Game !== 'undefined' && Game.updateStartScreen) {
                    setTimeout(() => Game.updateStartScreen(), 2000);
                }
            } else {
                console.error('[NoLives] ❌ Error reclamando:', result?.error);
                claimBtn.disabled = false;
                claimBtn.textContent = '❌ ERROR - INTENTA DE NUEVO';
                
                setTimeout(() => {
                    claimBtn.textContent = '⬇ RECLAMAR AHORA';
                }, 3000);
            }
        });

        // VOLVER AL MENÚ
        backToMenuBtn?.addEventListener('click', function() {
            console.log('[NoLives] Volviendo al menú');
            
            window.hideNoLivesModal();
            
            if (typeof showScreen === 'function') {
                showScreen('start-screen');
            }
            if (typeof Game !== 'undefined' && Game.updateStartScreen) {
                Game.updateStartScreen();
            }
        });

        // COMPRAR VIDAS
        buyLivesBtn?.addEventListener('click', function() {
            console.log('[NoLives] Abriendo compra de vidas');
            
            if (typeof LivesSystem !== 'undefined' && LivesSystem.buyLives) {
                LivesSystem.buyLives();
            }
        });

        // SALIR
        exitBtn?.addEventListener('click', function() {
            console.log('[NoLives] Saliendo');
            window.location.href = '/juegos';
        });

        // Actualizar timer
        function updateFreeLifesTimer() {
            if (!state?.livesLostAt) {
                if (timerSection) timerSection.style.display = 'none';
                return;
            }

            const now = Date.now();
            const timeLost = new Date(state.livesLostAt).getTime();
            const regenerTime = 24 * 60 * 60 * 1000;
            const timeRemaining = Math.max(0, (timeLost + regenerTime) - now);

            if (timeRemaining <= 0) {
                if (timerSection) timerSection.style.display = 'none';
                return;
            }

            if (timerSection) timerSection.style.display = 'block';

            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            timerDisplay.textContent = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

            setTimeout(updateFreeLifesTimer, 1000);
        }

        console.log('[NoLives] Inicializado ✓');
    })();
    </script>

    <script src="puntos/puntos.js?v6"></script>
    <script src="/play/puntos/no-lives-modal.js?v6"></script>
    <script src="/play/puntos/chainrush_integration.js?v4"></script>
</body>
</html>