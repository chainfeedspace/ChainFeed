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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChainFeed - Juegos</title>
    <script>
    (function() {
        var theme = localStorage.getItem('chainfeed_theme') || 'dark';
        document.documentElement.className = theme + '-theme';
        document.documentElement.setAttribute('data-theme', theme);

        if (theme === 'light') {
            var s = document.createElement('style');
            s.id = 'preload-theme';
            s.textContent = ':root{--dark:#f0f0eb;--dark-secondary:#e5e5db;--dark-tertiary:#dadacd;--text-primary:#875ba9;--primary:#4f46e5}body,html{background:#f0f0eb!important}';
            document.head.appendChild(s);
        }
    })();
    </script>
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/logo192.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#0F0F14">
    <script src="/js/i18n-auto-translate.js?v=3"></script>
    <style>
    :root {
        --primary: #6366f1; --secondary: #a855f7; --accent: #ec4899;
        --dark: #0f0f14; --dark-secondary: #1a1a24; --dark-tertiary: #252532;
        --text: #ffffff; --text-secondary: #a0a0b8;
        --success: #10b981; --warning: #f59e0b; --error: #ef4444;
        --navbar-height: 70px;
    }
    * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:rgb(1,1,1); color:var(--text); overflow-x:hidden; line-height:1.6; min-height:100vh; }
    ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:var(--dark-secondary)} ::-webkit-scrollbar-thumb{background:linear-gradient(135deg,var(--primary),var(--accent));border-radius:3px}
    .bg-animation { position:fixed; width:100%; height:100vh; top:0; left:0; z-index:-1; background:rgb(1,1,1); background-size:400% 400%; animation:gradientShift 20s ease infinite; opacity:0.05; }
    @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

    /* ── NAVBAR ── */
    .navbar {
        position: fixed;
        top: 0;
        width: 100%;
        background: #000000bd;
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 1000;
        padding: 1rem 2rem;
        transition: all 0.3s ease;
    }
    .navbar.scrolled {
        background: #000000a6;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    .nav-container {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.5rem;
    }
    .logo {
        font-size: 0.95rem;
        font-weight: 800;
        background: var(--text-secondary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    .logo:hover { transform: scale(1.05); }
    .logo img {
        height: 34px;
        vertical-align: middle;
        margin-right: 2px;
    }
    .nav-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-shrink: 0;
    }
    .nav-btn {
        background: rgb(99 102 241 / 3%);
        color: var(--primary);
        padding: 0 0.4rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        position: relative;
        outline: none;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        white-space: nowrap;
        flex-shrink: 0;
        min-width: 0;
    }
    .nav-btn:hover {
        background: rgba(99, 102, 241, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
    }
    .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--error);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: 600;
        border: 2px solid var(--dark);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease;
    }
    .notification-badge:not(.empty) {
        opacity: 1;
        visibility: visible;
    }
    @media (max-width: 768px) {
        .navbar { padding: 2px 1rem 2px 2px; }
    }

    /* ── LAYOUT ── */
    .main-container { width:100%; max-width:1400px; margin:0 auto; padding:calc(var(--navbar-height) + 2rem) 1.5rem 2rem; min-height:100vh; }
    .games-hero { text-align:center; padding:3rem 1.5rem; margin-bottom:2.5rem; background:rgba(26,26,36,.5); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,.1); border-radius:20px; animation:slideDown .6s ease; }
    @keyframes slideDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
    .games-hero-title { font-size:2.8rem; font-weight:800; background:linear-gradient(135deg,var(--primary),var(--secondary),var(--accent)); color: var(--primary); background-clip:text; margin-bottom:1rem; }
    .games-hero-subtitle { font-size:1.15rem; color:var(--text-secondary); max-width:650px; margin:0 auto; }
    .games-categories { display:flex; gap:1rem; margin-bottom:2.5rem; overflow-x:auto; padding:.5rem 0; scrollbar-width:none; }
    .games-categories::-webkit-scrollbar{display:none}
    .category-btn { background:rgba(37,37,50,.5); border:1px solid rgba(255,255,255,.1); color:var(--text); padding:.8rem 1.5rem; border-radius:12px; cursor:pointer; transition:all .3s; font-size:.95rem; font-weight:600; white-space:nowrap; display:flex; align-items:center; gap:.5rem; flex-shrink:0; }
    .category-btn:hover { background:rgba(99,102,241,.2); border-color:rgba(99,102,241,.4); transform:translateY(-2px); }
    .category-btn.active { background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; border-color:transparent; box-shadow:0 4px 15px rgba(99,102,241,.3); }
    .games-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.5rem; margin-bottom:2rem; }
    @media(max-width:768px){.games-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem}}
    .game-card { background:rgb(15 15 20 / 16%); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,.1); border-radius:16px; overflow:hidden; transition:all .3s; cursor:pointer; animation:cardAppear .5s ease; position:relative; }
    @keyframes cardAppear{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .game-card:hover { border-color:rgba(99,102,241,.4); box-shadow:0 10px 30px rgba(99,102,241,.2); transform:translateY(-8px); }
    .game-thumbnail { width:100%; aspect-ratio:16/9; background:linear-gradient(135deg,var(--dark-secondary),var(--dark-tertiary)); position:relative; overflow:hidden; }
    .game-thumbnail img { width:100%; height:100%; object-fit:cover; transition:transform .4s; }
    .game-card:hover .game-thumbnail img { transform:scale(1.1); }
    .game-badge-new { position:absolute; top:12px; right:12px; background:linear-gradient(135deg,var(--accent),#f43f5e); color:#fff; padding:.35rem .8rem; border-radius:20px; font-size:.75rem; font-weight:700; text-transform:uppercase; z-index:2; box-shadow:0 4px 12px rgba(236,72,153,.4); }
    .game-badge-popular { position:absolute; top:12px; right:12px; background:linear-gradient(135deg,var(--warning),#f97316); color:#fff; padding:.35rem .8rem; border-radius:20px; font-size:.75rem; font-weight:700; text-transform:uppercase; z-index:2; box-shadow:0 4px 12px rgba(249,115,22,.4); }
    .game-info { padding:1.2rem; }
    .game-title { font-size:1.15rem; font-weight:700; margin-bottom:.6rem; color:var(--text); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .game-description { font-size:.88rem; color:var(--text-secondary); margin-bottom:1rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .game-stats { display:flex; gap:1.2rem; font-size:.82rem; color:var(--text-secondary); padding-top:1rem; border-top:1px solid rgba(255,255,255,.1); margin-bottom:.8rem; align-items:center; justify-content:space-between; }
    .game-stat { display:flex; align-items:center; gap:.4rem; }
    .star-rating { display:flex; gap:3px; cursor:pointer; }
    .star-rating .star { font-size:1.1rem; color:#444; transition:color .15s; }
    .star-rating .star.filled { color:#f59e0b; }
    .star-rating .star:hover,
    .star-rating .star.hover { color:#f59e0b; }
    .rating-avg { font-size:.82rem; color:var(--text-secondary); }
    .game-play-btn { width:100%; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:white; border:none; padding:.9rem; border-radius:12px; font-weight:700; font-size:.95rem; cursor:pointer; transition:all .3s; position:relative; overflow:hidden; }
    .game-play-btn::before { content:""; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent); transition:left .6s; }
    .game-play-btn:hover::before { left:100%; }
    .game-play-btn:hover { transform:translateY(-2px); box-shadow:0 10px 25px rgba(99,102,241,.5); }
    .games-loading { text-align:center; padding:4rem 2rem; color:var(--text-secondary); }
    .games-loading.hidden,.games-empty.hidden { display:none; }
    .loading-spinner { width:50px; height:50px; border:4px solid rgba(99,102,241,.2); border-top-color:var(--primary); border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 1.5rem; }
    @keyframes spin{to{transform:rotate(360deg)}}
    .games-empty { text-align:center; padding:4rem 2rem; color:var(--text-secondary); }
    .empty-icon { font-size:5rem; margin-bottom:1.5rem; opacity:.5; }
    .game-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,.92); backdrop-filter:blur(10px); z-index:10000; display:flex; align-items:center; justify-content:center; opacity:0; visibility:hidden; transition:all .3s; }
    .game-modal.active { opacity:1; visibility:visible; }
    .game-modal-content { background:var(--dark-secondary); border-radius:20px; width:95%; max-width:1200px; max-height:90vh; display:flex; flex-direction:column; border:1px solid rgba(255,255,255,.1); transform:scale(.9); transition:transform .3s; overflow:hidden; }
    .game-modal.active .game-modal-content { transform:scale(1); }
    .game-modal-header { padding:1.2rem 1.8rem; border-bottom:1px solid rgba(255,255,255,.1); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,.3); }
    .game-modal-title { font-size:1.4rem; font-weight:700; }
    .close-game-modal { background:transparent; border:none; color:var(--text-secondary); font-size:2rem; cursor:pointer; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all .3s; }
    .close-game-modal:hover { background:rgba(255,255,255,.1); color:var(--text); transform:rotate(90deg); }
    .game-modal-body { flex:1; overflow:hidden; background:#000; min-height:500px; }
    .game-iframe { width:100%; height:100%; border:none; min-height:500px; }
    @media(max-width:768px){
        .games-hero-title{font-size:2rem} .games-hero-subtitle{font-size:1rem}
        .main-container{padding:calc(var(--navbar-height) + 1rem) 1rem 6rem}
        .game-info{padding:1rem} .game-title{font-size:1rem} .game-description{font-size:.85rem}
    }
    </style>
</head>
<body>
    <div class="bg-animation"></div>

    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="logo" onclick="goToHome()" data-translated="true">
                <img src="/icons/logo72.png" alt="ChainFeed logo" data-translated="true">
                <span data-translated="true">ChainFeed</span>
            </div>
            <div class="nav-actions">
                <a href="https://chainfeed.space/market" class="nav-btn" style="height: 25px;" title="Market">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                </a>
                    <a href="https://chainfeed.space/juegos" class="nav-btn" style="height: 25px;" title="Juegos">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 5h3.5a5 5 0 0 1 0 10h-5.5l-4.015 4.227a2.3 2.3 0 0 1 -3.923 -2.035l1.634 -8.173a5 5 0 0 1 4.904 -4.019h3.4" />
        <path d="M14 15l4.07 4.284a2.3 2.3 0 0 0 3.925 -2.023l-1.6 -8.232" />
        <path d="M8 9v2" />
        <path d="M7 10h2" />
        <path d="M14 10h2" />
    </svg>
</a>
                <a href="https://chainfeed.space/chat" class="nav-btn" style="height: 25px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span class="notification-badge empty" id="messagesBadge">0</span>
                </a>
                <a href="https://chainfeed.space/notificaciones" class="nav-btn" style="height: 25px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span class="notification-badge empty" id="notificationsBadge">0</span>
                </a>
            </div>
        </div>
    </nav>

    <div class="main-container">
        <div class="games-hero">
            <h1 class="games-hero-title">🎮 Arcade ChainFeed</h1>
            <p class="games-hero-subtitle">Juega, compite y gana CFT tokens. Diviértete mientras generas recompensas en la blockchain.</p>
        </div>

        <div class="games-categories" id="gameCategories">
            <button class="category-btn active" data-category="todos"      onclick="filterGames('todos',this)">🌟 Todos</button>
            <button class="category-btn"        data-category="populares"  onclick="filterGames('populares',this)">🔥 Populares</button>
            <button class="category-btn"        data-category="nuevos"     onclick="filterGames('nuevos',this)">✨ Nuevos</button>
            <button class="category-btn"        data-category="estrategia" onclick="filterGames('estrategia',this)">🎯 Estrategia</button>
            <button class="category-btn"        data-category="casual"     onclick="filterGames('casual',this)">😊 Casual</button>
            <button class="category-btn"        data-category="accion"     onclick="filterGames('accion',this)">⚔️ Acción</button>
        </div>

        <div class="games-grid"    id="gamesGrid"></div>
        <div class="games-loading hidden" id="gamesLoading">
            <div class="loading-spinner"></div>
            <p>Cargando juegos...</p>
        </div>
        <div class="games-empty hidden" id="gamesEmpty">
            <div class="empty-icon">🎮</div>
            <h3>No hay juegos en esta categoría</h3>
            <p>Prueba con otra categoría o vuelve pronto</p>
        </div>
    </div>

    <div class="game-modal" id="gameModal">
        <div class="game-modal-content">
            <div class="game-modal-header">
                <h3 class="game-modal-title" id="gameModalTitle">Juego</h3>
                <button class="close-game-modal" onclick="closeGameModal()">×</button>
            </div>
            <div class="game-modal-body">
                <iframe class="game-iframe" id="gameIframe" src="" allowfullscreen></iframe>
            </div>
        </div>
    </div>

    <script>
    let currentCategory = 'todos';
    let gamesCache = {};

document.addEventListener('DOMContentLoaded', () => {
    setupScrollEffects();
    loadGames('todos');

    // Activar observer dinámico para traducción de cards
    const lang = window.getLanguage ? window.getLanguage() : 'es';
    if (lang !== 'es' && typeof startDynamicTranslationObserver === 'function') {
        startDynamicTranslationObserver(lang);
    }
});

    function setupScrollEffects() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.pageYOffset > 50);
        });
    }

    async function loadGames(category) {
        const grid    = document.getElementById('gamesGrid');
        const loading = document.getElementById('gamesLoading');
        const empty   = document.getElementById('gamesEmpty');

        grid.innerHTML = '';
        loading.classList.remove('hidden');
        empty.classList.add('hidden');

        try {
            if (!gamesCache[category]) {
                const res  = await fetch(`/php/games.php?action=list&category=${category}`);
                const raw  = await res.text();
                let data;
                try { data = JSON.parse(raw); } catch(e) { throw new Error('Error cargando juegos'); }
                if (!data.ok) throw new Error(data.error || 'Error API');
                gamesCache[category] = data.games;
            }

            const games = gamesCache[category];
            loading.classList.add('hidden');

            if (!games.length) { empty.classList.remove('hidden'); return; }

            games.forEach(g => grid.appendChild(createGameCard(g)));

const lang = window.getLanguage ? window.getLanguage() : 'es';
if (lang !== 'es' && typeof window.translateDynamicContent === 'function') {
    window.translateDynamicContent('#gamesGrid');
}

        } catch (err) {
            loading.classList.add('hidden');
            grid.innerHTML = `<p style="color:var(--error);padding:2rem">Error cargando juegos: ${err.message}</p>`;
        }
    }

    function createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.gameId = game.id;

        const badge = game.is_new
            ? '<div class="game-badge-new">Nuevo</div>'
            : game.is_popular
                ? '<div class="game-badge-popular">Popular</div>'
                : '';

        const thumb = game.thumbnail_url || `https://via.placeholder.com/400x225/252532/ffffff?text=${encodeURIComponent(game.title)}`;

        card.innerHTML = `
            <div class="game-thumbnail">
                ${badge}
                <img src="${thumb}" alt="${game.title}" loading="lazy">
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-stats">
                    <div class="game-stat">
                        <span>👥</span>
                        <span>${formatNum(game.total_plays)}</span>
                    </div>
                    <div class="game-stat" style="gap:0.5rem">
                        <div class="star-rating" data-game-id="${game.id}" data-my-rating="${game.my_rating || 0}">
                            ${buildStars(game.my_rating || 0)}
                        </div>
                        <span class="rating-avg" id="avg-${game.id}">
                            ${game.avg_rating > 0 ? game.avg_rating : '0'}
                        </span>
                    </div>
                </div>
                <button class="game-play-btn" onclick="openGame(${game.id}, '${game.url}', '${escHtml(game.title)}', event)">
                    🎮 Jugar Ahora
                </button>
            </div>
        `;

        const starRow = card.querySelector('.star-rating');
        initStars(starRow);

        return card;
    }

    function buildStars(selected) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="star ${i <= selected ? 'filled' : ''}" data-value="${i}">★</span>`;
        }
        return html;
    }

    function initStars(container) {
        const stars  = container.querySelectorAll('.star');
        const gameId = container.dataset.gameId;
        let myRating = parseInt(container.dataset.myRating) || 0;

        stars.forEach(star => {
            const val = parseInt(star.dataset.value);

            star.addEventListener('mouseenter', () => {
                stars.forEach(s => s.classList.toggle('hover', parseInt(s.dataset.value) <= val));
            });
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hover'));
            });
            star.addEventListener('click', async () => {
                myRating = val;
                container.dataset.myRating = val;
                stars.forEach(s => s.classList.toggle('filled', parseInt(s.dataset.value) <= val));
                try {
                    const fd = new FormData();
                    fd.append('game_id', gameId);
                    fd.append('rating', val);
                    const res  = await fetch('/php/games.php?action=rate', { method:'POST', body:fd });
                    const data = await res.json();
                    if (data.ok) {
                        const avgEl = document.getElementById('avg-' + gameId);
                        if (avgEl) avgEl.textContent = data.new_avg + ' votos';
                        gamesCache = {};
                    }
                } catch(e) {}
            });
        });
    }

    async function openGame(gameId, url, title, event) {
        if (event) event.stopPropagation();
        try {
            const fd = new FormData();
            fd.append('game_id', gameId);
            await fetch('/php/games.php?action=play', { method:'POST', body:fd });
        } catch(e) {}
        window.location.href = url;
    }

    function closeGameModal() {
        document.getElementById('gameModal').classList.remove('active');
        document.getElementById('gameIframe').src = '';
        document.body.style.overflow = '';
    }

    function filterGames(category, btn) {
        currentCategory = category;
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        loadGames(category);
    }

    function formatNum(n) {
        n = parseInt(n) || 0;
        if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
        if (n >= 1000)    return (n/1000).toFixed(1)+'K';
        return n;
    }

    function escHtml(s) { return s.replace(/'/g,"&#39;").replace(/"/g,"&quot;"); }
    function goToHome() { window.location.href = '/'; }

    document.addEventListener('keydown', e => { if (e.key==='Escape') closeGameModal(); });
    document.getElementById('gameModal').addEventListener('click', function(e) { if(e.target===this) closeGameModal(); });
    </script>

<!-- ============================================ -->
<!-- CONTADORES DE MENSAJES Y NOTIFICACIONES -->
<!-- ============================================ -->
<script src="/js/contador_mensaje.js"></script>

<!-- Script inline para cargar contador de notificaciones -->
<script>
(function() {
    'use strict';
    
    console.log('🔔 Cargando contador de notificaciones en juegos.html...');
    
    async function loadNotificationsCounter() {
        try {
            const response = await fetch('/php/obtener_notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    limit: 1,
                    offset: 0,
                    solo_no_leidas: false
                })
            });

            const data = await response.json();

            if (data.success && data.contadores) {
                const badge = document.getElementById('notificationsBadge');
                const unreadCount = data.contadores.no_leidas || 0;
                
                if (badge) {
                    badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                    
                    if (unreadCount > 0) {
                        badge.classList.remove('empty');
                        badge.style.display = 'flex';
                        badge.style.opacity = '1';
                        badge.style.visibility = 'visible';
                    } else {
                        badge.classList.add('empty');
                        badge.style.display = 'none';
                    }
                    
                    console.log('✅ Badge de notificaciones actualizado:', unreadCount);
                }
            }
        } catch (error) {
            console.error('❌ Error cargando contador de notificaciones:', error);
        }
    }

    // Cargar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNotificationsCounter);
    } else {
        loadNotificationsCounter();
    }

    // Actualizar cada 15 segundos
    setInterval(loadNotificationsCounter, 15000);

    // Actualizar al volver a la pestaña
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            loadNotificationsCounter();
        }
    });

    console.log('✅ Sistema de notificaciones inicializado en juegos.html');
})();
</script>

<!-- Otros scripts -->
<script src="/js/barra-inferior.js"></script>
<script src="/js/temas.js"></script>

</body>
</html>