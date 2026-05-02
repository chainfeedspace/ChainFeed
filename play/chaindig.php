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
<title>CHAIN DIG — Excavá tus CFT</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
/* ═══════════════════════
   ROOT & RESET
═══════════════════════ */
:root {
  --soil-dark:  #1a1008;
  --soil-mid:   #2d1f0e;
  --soil-light: #3d2a14;
  --stone:      #4a3f33;
  --stone-lt:   #e7c9ac;
  --gold:       #c8922a;
  --gold-lt:    #e8b84b;
  --gold-glow:  #ffcc44;
  --safe:       #4a7c3f;
  --safe-lt:    #6aab5f;
  --danger:     #8b2020;
  --danger-lt:  #c43030;
  --ore:        #5a8fa8;
  --ore-lt:     #7bb8d4;
  --cream:      #e8d8b8;
  --parchment:  #d4c4a0;
  --shadow:     rgba(0,0,0,0.6);
  --num1: #4a7c3f; --num2: #5a8fa8; --num3: #c43030;
  --num4: #6b3fa0; --num5: #8b2020; --num6: #2a8a8a; --num7: #1a1008; --num8: #6b5a4a;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

html, body {
  width:100%; height:100%; overflow:hidden;
  background: var(--soil-dark);
  font-family: 'Space Mono', monospace;
  color: var(--cream);
}

/* Noise texture overlay */
body::before {
  content:'';
  position:fixed; inset:0; z-index:0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events:none;
}

/* ═══════════════════════
   SCREENS
═══════════════════════ */
.screen { position:fixed; inset:0; z-index:10; opacity:0; pointer-events:none; transition:opacity 0.4s; overflow-y:auto; }
.screen.active { opacity:1; pointer-events:auto; }

/* ═══════════════════════
   LOBBY
═══════════════════════ */
#lobbyScreen {
  background:
    radial-gradient(ellipse at 30% 20%, rgba(200,146,42,0.08), transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(74,124,63,0.06), transparent 50%),
    linear-gradient(180deg, #1a1008 0%, #2d1f0e 50%, #1a1008 100%);
  display:flex; align-items:flex-start; justify-content:center; padding:24px 16px;
}

.lobby-wrap {
  max-width: 1080px; width:100%;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 28px;
  padding-top: 8px;
}

/* Header bar */
.top-bar {
  grid-column: 1/-1;
  display: flex; align-items:center; justify-content:space-between;
  border-bottom: 1px solid rgba(200,146,42,0.2);
  padding-bottom: 14px; margin-bottom: 4px;
}

.player-info { display:flex; align-items:center; gap:10px; }
.player-avatar {
  width:44px; height:44px; border-radius:50%;
  border: 2px solid var(--gold);
  object-fit:cover; display:none;
}
.player-name-label { font-size:9px; color:var(--stone-lt); text-transform:uppercase; letter-spacing:2px; }
.player-name { font-size:13px; font-weight:700; color:var(--gold-lt); }

.exit-link {
  display:flex; align-items:center; gap:6px;
  background: rgba(139,32,32,0.1); border: 1px solid rgba(196,48,48,0.3);
  border-radius:6px; padding:7px 12px;
  color: var(--danger-lt); font-family:'Space Mono',monospace;
  font-size:9px; font-weight:700; text-transform:uppercase;
  text-decoration:none; letter-spacing:1px; transition:all .2s;
}
.exit-link:hover { background:rgba(139,32,32,0.25); }

/* Hero title */
.hero-section {}
.game-title {
  font-family: 'Playfair Display', serif;
  font-size: 56px; font-weight:900; line-height:0.95;
  color: var(--gold-lt);
  text-shadow: 0 0 40px rgba(200,146,42,0.4), 2px 3px 0 rgba(0,0,0,0.5);
  margin-bottom: 4px;
}
.game-subtitle {
  font-size:9px; letter-spacing:4px; text-transform:uppercase;
  color: var(--stone-lt); margin-bottom:20px;
}

/* Stats grid */
.stats-row {
  display:grid; grid-template-columns: repeat(4,1fr); gap:8px; margin-bottom:16px;
}
.stat-tile {
  background: rgba(45,31,14,0.8);
  border: 1px solid rgba(200,146,42,0.15);
  border-radius:8px; padding:10px;
  position:relative; overflow:hidden;
}
.stat-tile::after {
  content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  opacity:0.3;
}
.stat-lbl { font-size:8px; color:var(--stone-lt); text-transform:uppercase; letter-spacing:1px; }
.stat-val { font-size:20px; font-weight:700; color:var(--gold-lt); margin-top:2px; }

/* Lives indicator */
.lives-badge {
  background: rgba(200,146,42,0.1); border:1px solid rgba(200,146,42,0.25);
  border-radius:8px; padding:10px; margin-bottom:14px;
  display:flex; align-items:center; justify-content:space-between;
  gap:8px;
}
.lives-info { flex:1; }
.lives-label { font-size:8px; color:var(--stone-lt); text-transform:uppercase; letter-spacing:1px; }
.lives-count { font-size:18px; font-weight:700; color:var(--gold-lt); }
.btn-buy-lives {
  padding:7px 12px; background:rgba(74,124,63,0.12); border:2px solid rgba(74,124,63,0.4);
  border-radius:6px; color:var(--safe-lt); cursor:pointer; font-family:'Space Mono',monospace;
  font-size:8px; font-weight:700; text-transform:uppercase; transition:all .22s;
}
.btn-buy-lives:hover { background:rgba(74,124,63,0.28); }

/* Mechanic card */
.mechanic-card {
  background: rgba(26,16,8,0.7);
  border: 1px solid rgba(200,146,42,0.15);
  border-radius:10px; padding:14px;
  margin-bottom:14px;
}
.card-title {
  font-size:9px; text-transform:uppercase; letter-spacing:2px;
  color:var(--gold); margin-bottom:10px;
  padding-bottom:7px; border-bottom:1px solid rgba(200,146,42,0.12);
  font-weight:700;
}
.mechanic-row {
  font-size:9px; color:var(--stone-lt); line-height:2.1;
}
.mechanic-row b { color: var(--cream); }

/* Right panel */
.config-panel { display:grid; gap:14px; }

.panel-card {
  background: rgba(26,16,8,0.85);
  border: 1px solid rgba(200,146,42,0.2);
  border-radius:10px; padding:16px;
  backdrop-filter: blur(10px);
}

/* Mode toggle */
.mode-toggle { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
.mode-btn {
  padding:10px; border-radius:7px; cursor:pointer;
  font-family:'Space Mono',monospace; font-size:9px; font-weight:700;
  text-transform:uppercase; letter-spacing:1px;
  border: 2px solid rgba(107,90,74,0.3);
  background: rgba(0,0,0,0.3); color:var(--stone-lt);
  transition:all .22s;
}
.mode-btn.active-free { border-color:var(--safe-lt); color:var(--safe-lt); background:rgba(74,124,63,0.1); }
.mode-btn.active-bet  { border-color:var(--gold); color:var(--gold); background:rgba(200,146,42,0.08); }

/* Difficulty selector */
.diff-selector { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
.diff-btn {
  padding:10px 6px; border-radius:8px; cursor:pointer; text-align:center;
  font-family:'Space Mono',monospace; font-size:8px; font-weight:700;
  text-transform:uppercase; letter-spacing:0.5px;
  border: 2px solid rgba(107,90,74,0.25);
  background: rgba(0,0,0,0.3); color:var(--stone-lt);
  transition:all .22s;
}
.diff-btn .diff-icon { font-size:22px; display:block; margin-bottom:4px; }
.diff-btn .diff-name { display:block; color:var(--cream); margin-bottom:2px; }
.diff-btn .diff-grid { display:block; font-size:7px; color:var(--stone-lt); }
.diff-btn .diff-mult { display:block; font-size:10px; font-weight:700; margin-top:3px; }
.diff-btn:hover, .diff-btn.selected {
  border-color:var(--gold); background:rgba(200,146,42,0.1); color:var(--gold-lt);
}
.diff-btn .diff-mult.easy  { color:var(--safe-lt); }
.diff-btn .diff-mult.med   { color:var(--gold-lt); }
.diff-btn .diff-mult.hard  { color:var(--danger-lt); }

/* Bet section */
.bet-section { display:none; }
.bet-presets { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:8px; }
.bet-opt {
  padding:7px 4px; text-align:center; cursor:pointer;
  background:rgba(200,146,42,0.06); border:2px solid rgba(200,146,42,0.18);
  border-radius:7px; color:var(--stone-lt); font-size:9px; font-weight:700;
  font-family:'Space Mono',monospace; transition:all .2s;
}
.bet-opt:hover, .bet-opt.selected { border-color:var(--gold); color:var(--gold); background:rgba(200,146,42,0.15); }
.bet-input {
  width:100%; background:rgba(10,6,2,0.9); border:2px solid var(--gold);
  border-radius:6px; padding:7px 10px; color:var(--gold);
  font-family:'Space Mono',monospace; font-size:11px; text-align:right;
  margin-bottom:8px;
}
.bet-input:focus { outline:none; border-color:var(--gold-glow); }
.bet-preview {
  background:rgba(200,146,42,0.05); border:1px solid rgba(200,146,42,0.15);
  border-radius:7px; padding:9px 11px; font-size:9px; color:var(--stone-lt); line-height:1.9;
}
.bet-preview b { color:var(--gold-lt); }

/* Buttons */
.btn-dig {
  width:100%; padding:14px; margin-top:10px;
  background: linear-gradient(135deg, #c8922a, #e8b84b);
  color:#1a1008; font-family:'Space Mono',monospace;
  font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px;
  border:none; border-radius:8px; cursor:pointer;
  box-shadow: 0 4px 20px rgba(200,146,42,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
  transition:all .25s; position:relative; overflow:hidden;
}
.btn-dig::before {
  content:''; position:absolute; inset:0;
  background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1));
}
.btn-dig:hover { transform:translateY(-2px); box-shadow:0 6px 28px rgba(200,146,42,0.45); }
.btn-dig:disabled { opacity:.35; cursor:not-allowed; transform:none; }
.btn-secondary {
  width:100%; padding:10px; margin-top:7px;
  background:rgba(90,143,168,0.08); border:2px solid rgba(90,143,168,0.35);
  color:var(--ore-lt); font-family:'Space Mono',monospace;
  font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px;
  border-radius:7px; cursor:pointer; transition:all .22s;
}
.btn-secondary:hover { background:rgba(90,143,168,0.18); }
.btn-gold {
  width:100%; padding:10px; margin-top:7px;
  background:rgba(200,146,42,0.08); border:2px solid rgba(200,146,42,0.35);
  color:var(--gold-lt); font-family:'Space Mono',monospace;
  font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px;
  border-radius:7px; cursor:pointer; transition:all .22s;
}
.btn-gold:hover { background:rgba(200,146,42,0.2); }
.btn-safe {
  width:100%; padding:10px; margin-top:7px;
  background:rgba(74,124,63,0.08); border:2px solid rgba(74,124,63,0.35);
  color:var(--safe-lt); font-family:'Space Mono',monospace;
  font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px;
  border-radius:7px; cursor:pointer; transition:all .22s;
}
.btn-safe:hover { background:rgba(74,124,63,0.2); }

/* Tower guide */
.diff-guide { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.diff-guide-item {
  background:rgba(45,31,14,0.6); border:1px solid rgba(200,146,42,0.12);
  border-radius:8px; padding:10px; text-align:center; font-size:8px;
}
.diff-guide-item .dgi-icon { font-size:20px; margin-bottom:4px; }
.diff-guide-item .dgi-name { color:var(--cream); font-weight:700; display:block; margin-bottom:3px; }
.diff-guide-item .dgi-info { color:var(--stone-lt); line-height:1.8; }
.diff-guide-item .dgi-mult { font-size:11px; font-weight:700; margin-top:4px; }

/* ═══════════════════════
   GAME SCREEN
═══════════════════════ */
#gameScreen {
  background:
    radial-gradient(ellipse at 50% 0%, rgba(200,146,42,0.06), transparent 60%),
    linear-gradient(180deg, #1a1008, #2d1f0e 50%, #1a1008);
  display:flex; flex-direction:column;
}

/* HUD top */
.hud-top {
  flex-shrink:0;
  display:flex; align-items:center; justify-content:space-between;
  padding:8px 14px;
  background:rgba(10,6,2,0.92);
  border-bottom: 1px solid rgba(200,146,42,0.15);
  gap:8px; flex-wrap:wrap; z-index:50;
}
.hud-item { display:flex; flex-direction:column; align-items:center; min-width:54px; }
.hud-lbl  { font-size:7px; color:var(--stone-lt); text-transform:uppercase; letter-spacing:1px; }
.hud-val  { font-size:14px; font-weight:700; color:var(--gold-lt); }
.hud-val.danger { color:var(--danger-lt); }
.hud-val.safe   { color:var(--safe-lt); }
.hud-val.ore    { color:var(--ore-lt); }

.hud-progress {
  flex:1; max-width:220px;
  background:rgba(26,16,8,0.8); border:1px solid rgba(200,146,42,0.2);
  border-radius:6px; padding:5px 10px;
}
.hud-progress-label {
  display:flex; justify-content:space-between;
  font-size:7px; color:var(--stone-lt); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;
}
.progress-bar-bg {
  height:5px; background:rgba(200,146,42,0.1); border-radius:3px; overflow:hidden;
}
.progress-bar-fill {
  height:100%; border-radius:3px;
  background: linear-gradient(90deg, var(--safe), var(--gold));
  transition: width 0.4s ease;
}

.diff-badge {
  background:rgba(200,146,42,0.1); border:1px solid rgba(200,146,42,0.3);
  border-radius:5px; padding:3px 9px; font-size:8px; color:var(--gold);
  font-weight:700; text-transform:uppercase; white-space:nowrap;
}

/* Game area */
.game-area {
  flex:1; display:flex; align-items:center; justify-content:center;
  padding:12px; overflow:hidden; position:relative;
}

/* Board */
.board-wrap {
  position:relative;
  background: rgba(20,12,4,0.9);
  border: 2px solid rgba(200,146,42,0.25);
  border-radius:12px;
  padding:12px;
  box-shadow:
    0 0 60px rgba(0,0,0,0.8),
    inset 0 0 40px rgba(200,146,42,0.03),
    0 0 0 1px rgba(200,146,42,0.08);
}
.board-title {
  text-align:center; font-size:8px; color:var(--stone-lt);
  text-transform:uppercase; letter-spacing:3px; margin-bottom:10px;
}
#gameBoard {
  display:grid; gap:3px;
  /* grid-template-columns set by JS */
}

/* Cells */
.cell {
  width:36px; height:36px;
  border-radius:5px; cursor:pointer;
  position:relative; overflow:hidden;
  display:flex; align-items:center; justify-content:center;
  font-weight:700; font-size:12px;
  transition: transform 0.08s, box-shadow 0.15s;
  user-select:none;
}

/* Hidden cell — tierra sin excavar */
.cell.hidden {
  background:
    linear-gradient(135deg, #3d2a14 0%, #2d1f0e 50%, #3d2a14 100%);
  border: 1px solid rgba(200,146,42,0.12);
  box-shadow:
    inset 0 1px 0 rgba(200,146,42,0.12),
    inset 0 -1px 0 rgba(0,0,0,0.4),
    0 2px 4px rgba(0,0,0,0.3);
}
.cell.hidden::before {
  content:'';
  position:absolute; inset:0;
  background: radial-gradient(circle at 30% 30%, rgba(200,146,42,0.08), transparent 60%);
}
.cell.hidden:hover {
  background: linear-gradient(135deg, #4d3a24, #3d2a14 50%, #4d3a24);
  transform:scale(1.05);
  box-shadow:
    inset 0 1px 0 rgba(200,146,42,0.2),
    0 3px 8px rgba(0,0,0,0.4),
    0 0 12px rgba(200,146,42,0.1);
  z-index:2;
}
.cell.hidden:active { transform:scale(0.97); }

/* Flagged cell */
.cell.flagged {
  background: linear-gradient(135deg, #3d2020, #2d1010);
  border: 1px solid rgba(196,48,48,0.35);
  box-shadow: inset 0 0 10px rgba(196,48,48,0.1), 0 0 8px rgba(196,48,48,0.15);
}
.cell.flagged::after { content:'🚩'; font-size:14px; }

/* Revealed — vacío */
.cell.revealed-empty {
  background: rgba(10,6,2,0.85);
  border: 1px solid rgba(200,146,42,0.06);
  cursor:default;
}
.cell.revealed-empty::after {
  content:''; position:absolute; inset:0;
  background: radial-gradient(circle at 50% 50%, rgba(200,146,42,0.03), transparent);
}

/* Revealed — número */
.cell.revealed-num {
  background: rgba(15,9,3,0.9);
  border: 1px solid rgba(200,146,42,0.08);
  cursor:default;
}

/* Mine explosion */
.cell.mine-dead {
  background: radial-gradient(circle, #8b2020, #3d0a0a);
  border: 1px solid var(--danger-lt);
  animation: explode 0.4s ease;
  cursor:default;
}
.cell.mine-dead::after { content:'💣'; font-size:16px; }

@keyframes explode {
  0% { transform:scale(1); }
  30% { transform:scale(1.4); background:radial-gradient(circle,#ff4400,#8b2020); }
  60% { transform:scale(0.9); }
  100% { transform:scale(1); }
}

/* Mine revealed (end of game) */
.cell.mine-show {
  background: rgba(50,10,10,0.9);
  border: 1px solid rgba(196,48,48,0.2);
  cursor:default;
}
.cell.mine-show::after { content:'💣'; font-size:14px; opacity:0.6; }

/* Number colors */
.n1 { color:var(--num1); } .n2 { color:var(--num2); }
.n3 { color:var(--num3); } .n4 { color:var(--num4); }
.n5 { color:var(--num5); } .n6 { color:var(--num6); }
.n7 { color:var(--num7); } .n8 { color:var(--num8); }

/* Radar pulse animation */
.cell.radar-scan {
  animation: radarPulse 0.6s ease forwards;
}
@keyframes radarPulse {
  0%   { box-shadow:0 0 0 0 rgba(123,184,212,0.8); }
  50%  { box-shadow:0 0 0 12px rgba(123,184,212,0.3); background:rgba(90,143,168,0.4); }
  100% { box-shadow:0 0 0 0 rgba(123,184,212,0); }
}

/* Checkpoint flash */
.cell.checkpoint-flash {
  animation: checkFlash 0.5s ease;
}
@keyframes checkFlash {
  0%,100% { box-shadow:none; }
  50% { box-shadow:0 0 16px rgba(200,146,42,0.8); background:rgba(200,146,42,0.25); }
}

/* HUD bottom */
.hud-bottom {
  flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  gap:8px; padding:8px 14px;
  background:rgba(10,6,2,0.92);
  border-top: 1px solid rgba(200,146,42,0.12);
  flex-wrap:wrap;
}

.radar-btn {
  display:flex; align-items:center; gap:7px;
  background:rgba(90,143,168,0.08); border:2px solid rgba(90,143,168,0.3);
  border-radius:8px; padding:7px 14px; cursor:pointer;
  font-family:'Space Mono',monospace; font-size:9px; font-weight:700;
  color:var(--ore-lt); text-transform:uppercase; letter-spacing:1px;
  transition:all .22s;
}
.radar-btn:hover { background:rgba(90,143,168,0.2); border-color:var(--ore-lt); }
.radar-btn:disabled { opacity:.3; cursor:not-allowed; }
.radar-cost { font-size:8px; color:var(--stone-lt); }

.flag-btn {
  display:flex; align-items:center; gap:7px;
  background:rgba(139,32,32,0.08); border:2px solid rgba(196,48,48,0.25);
  border-radius:8px; padding:7px 14px; cursor:pointer;
  font-family:'Space Mono',monospace; font-size:9px; font-weight:700;
  color:var(--danger-lt); text-transform:uppercase; letter-spacing:1px;
  transition:all .22s;
}
.flag-btn:hover { background:rgba(139,32,32,0.2); }
.flag-btn.active { background:rgba(139,32,32,0.25); border-color:var(--danger-lt); }

.extract-btn {
  display:flex; align-items:center; gap:7px;
  background: linear-gradient(135deg, rgba(74,124,63,0.2), rgba(74,124,63,0.1));
  border:2px solid rgba(74,124,63,0.4); border-radius:8px; padding:7px 16px; cursor:pointer;
  font-family:'Space Mono',monospace; font-size:9px; font-weight:700;
  color:var(--safe-lt); text-transform:uppercase; letter-spacing:1px;
  transition:all .22s;
}
.extract-btn:hover { background:rgba(74,124,63,0.3); }
.extract-btn:disabled { opacity:.3; cursor:not-allowed; }

.menu-toggle {
  background:rgba(26,16,8,0.9); border:2px solid rgba(200,146,42,0.25);
  border-radius:7px; width:34px; height:34px; color:var(--gold);
  font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:all .2s;
}
.menu-toggle:hover { border-color:var(--gold); }

/* In-game menu dropdown */
.ingame-menu {
  position:fixed; top:54px; right:10px; z-index:65;
  background:rgba(15,9,3,0.97); border:1px solid rgba(200,146,42,0.25);
  border-radius:10px; padding:13px; min-width:220px;
  flex-direction:column; gap:7px; backdrop-filter:blur(20px);
  display:none;
}
.ingame-menu.open { display:flex; }
.menu-section-lbl { font-size:7px; color:var(--stone-lt); text-transform:uppercase; letter-spacing:2px; padding-bottom:4px; border-bottom:1px solid rgba(200,146,42,0.1); }
.menu-info {
  background:rgba(200,146,42,0.05); border:1px solid rgba(200,146,42,0.1);
  border-radius:7px; padding:8px; font-size:9px; color:var(--stone-lt); line-height:1.9;
}
.menu-info span { color:var(--gold-lt); font-weight:700; }
.btn-menu-cont { background:rgba(74,124,63,0.1); border:2px solid rgba(74,124,63,0.4); color:var(--safe-lt); padding:8px; }
.btn-menu-exit { background:rgba(139,32,32,0.1); border:2px solid rgba(196,48,48,0.35); color:var(--danger-lt); padding:8px; }

/* Wave announcement */
.wave-ann {
  position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
  z-index:70; text-align:center; pointer-events:none;
  opacity:0; transition:opacity .3s;
}
.wave-ann.show { opacity:1; }
.wave-ann-title {
  font-family:'Playfair Display',serif; font-size:40px; font-weight:900;
  color:var(--gold-lt); text-shadow:0 0 30px rgba(200,146,42,0.6);
}
.wave-ann-sub {
  font-size:10px; color:var(--stone-lt); letter-spacing:3px;
  text-transform:uppercase; margin-top:6px;
}

/* Speed controls */
.speed-ctrl {
  position:fixed; top:54px; left:10px; z-index:60;
  display:flex; gap:3px;
}
.spd-btn {
  background:rgba(10,6,2,0.9); border:1px solid rgba(200,146,42,0.2);
  border-radius:5px; padding:3px 9px; color:var(--stone-lt);
  font-family:'Space Mono',monospace; font-size:9px; cursor:pointer; transition:all .18s;
}
.spd-btn.active { border-color:var(--gold); color:var(--gold); }

/* ═══════════════════════
   RESULT SCREEN
═══════════════════════ */
#resultScreen {
  display:flex; align-items:center; justify-content:center;
  background:linear-gradient(135deg, #0d0804, #1a1008);
}

.result-card {
  background:rgba(20,12,4,0.97); border-radius:14px; padding:28px;
  max-width:440px; width:92%;
  animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1);
}
.result-card.win  { border:2px solid var(--gold); box-shadow:0 0 50px rgba(200,146,42,0.25); }
.result-card.lose { border:2px solid var(--danger); box-shadow:0 0 50px rgba(139,32,32,0.25); }

@keyframes popIn { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }

.result-title { font-family:'Playfair Display',serif; font-size:32px; font-weight:900; margin-bottom:16px; }
.result-title.win  { color:var(--gold-lt); }
.result-title.lose { color:var(--danger-lt); }

.result-avatar {
  width:44px; height:44px; border-radius:50%; object-fit:cover; display:none;
  border:2px solid var(--gold); margin:0 auto 8px;
}
.result-player-name { font-size:10px; color:var(--ore-lt); font-weight:700; text-transform:uppercase; margin-bottom:14px; text-align:center; }

.rs {
  background:rgba(0,0,0,0.25); border-left:3px solid var(--gold);
  padding:8px 11px; border-radius:5px;
  display:flex; justify-content:space-between;
  font-size:9px; font-weight:700; text-transform:uppercase; margin-bottom:6px;
}
.rs.rs-lose { border-left-color:var(--danger); }
.rs.rs-gold { border-left-color:var(--gold-lt); background:rgba(200,146,42,0.04); }
.rs.rs-total { border-left-color:var(--gold); background:rgba(200,146,42,0.06); }
.rs-lbl { color:var(--stone-lt); }
.rs-val { color:var(--gold-lt); font-size:13px; }
.rs.rs-lose .rs-val { color:var(--danger-lt); }
.rs.rs-total .rs-val { font-size:16px; }

.result-btns { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:16px; }

/* ═══════════════════════
   LOADING SCREEN
═══════════════════════ */
#loadingScreen {
  display:flex; align-items:center; justify-content:center;
  background:#0d0804; flex-direction:column; gap:16px;
}
.pickaxe-spin {
  font-size:40px; animation:pickaxeAnim 1s ease infinite;
}
@keyframes pickaxeAnim {
  0%,100% { transform:rotate(-20deg); }
  50% { transform:rotate(20deg); }
}
.load-txt { font-size:10px; color:var(--gold); text-transform:uppercase; letter-spacing:3px; }

/* ═══════════════════════
   MODALS
═══════════════════════ */
.modal-ov {
  position:fixed; inset:0; background:rgba(0,0,0,.85);
  backdrop-filter:blur(7px); z-index:200;
  display:flex; align-items:center; justify-content:center;
  opacity:0; pointer-events:none; transition:opacity .25s;
}
.modal-ov.open { opacity:1; pointer-events:auto; }
.modal-box {
  background:var(--soil-mid); border-radius:14px; padding:22px;
  max-width:420px; width:92%; position:relative;
  animation:popIn .28s ease; max-height:90vh; overflow-y:auto;
}
.modal-close {
  position:absolute; top:10px; right:10px; background:none; border:none;
  color:var(--stone-lt); font-size:17px; cursor:pointer;
}
.modal-close:hover { color:var(--danger-lt); }
.modal-title {
  font-family:'Playfair Display',serif; font-size:18px; font-weight:700;
  margin-bottom:3px;
}
.modal-sub { font-size:8px; text-transform:uppercase; letter-spacing:2px; color:var(--stone-lt); margin-bottom:14px; }

/* ═══════════════════════
   SHOP MODAL
═══════════════════════ */
#shopModal .modal-box { border:2px solid var(--gold); max-width:460px; }
.shop-title { color:var(--gold-lt); }
.shop-balance {
  display:flex; justify-content:space-between; align-items:center;
  background:rgba(200,146,42,0.05); border:1px solid rgba(200,146,42,0.15);
  border-radius:7px; padding:8px 11px; margin-bottom:14px; font-size:9px;
}
.shop-balance span:first-child { color:var(--stone-lt); text-transform:uppercase; letter-spacing:1px; }
.shop-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.shop-item {
  background:rgba(10,6,2,0.4); border:2px solid rgba(107,90,74,0.25);
  border-radius:10px; padding:13px; text-align:center;
  cursor:pointer; transition:all .25s; position:relative;
}
.shop-item:hover { border-color:var(--gold); transform:translateY(-2px); }
.shop-item.owned { border-color:var(--safe); background:rgba(74,124,63,0.06); cursor:default; }
.shop-item.owned:hover { transform:none; }
.shop-emoji { font-size:26px; margin-bottom:6px; }
.shop-name { font-size:10px; font-weight:700; color:var(--cream); text-transform:uppercase; margin-bottom:3px; }
.shop-desc { font-size:8px; color:var(--stone-lt); line-height:1.6; margin-bottom:8px; }
.shop-price { font-size:11px; color:var(--gold); font-weight:700; }
.shop-owned-badge { position:absolute; top:5px; right:7px; font-size:8px; color:var(--safe-lt); font-weight:700; }

/* ═══════════════════════
   RANKING MODAL
═══════════════════════ */
#rankingModal .modal-box { border:2px solid var(--gold); max-width:500px; }
.ranking-title { color:var(--gold-lt); }
.podium { display:flex; justify-content:center; align-items:flex-end; gap:8px; margin-bottom:16px; }
.podium-slot { display:flex; flex-direction:column; align-items:center; gap:3px; }
.podium-name { font-size:9px; font-weight:700; color:var(--cream); text-transform:uppercase; max-width:68px; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.podium-score { font-size:8px; color:var(--stone-lt); }
.podium-prize { font-size:8px; color:var(--gold-lt); font-weight:700; }
.podium-bar { border-radius:5px 5px 0 0; width:64px; display:flex; align-items:center; justify-content:center; font-size:16px; }
.podium-bar.first  { height:68px; background:rgba(200,146,42,0.15); border:2px solid var(--gold); }
.podium-bar.second { height:48px; background:rgba(192,192,192,0.1); border:2px solid #aaa; }
.podium-bar.third  { height:32px; background:rgba(205,127,50,0.1);  border:2px solid #cd7f32; }
.ranking-table { display:flex; flex-direction:column; gap:3px; max-height:180px; overflow-y:auto; margin-bottom:10px; }
.rank-row { display:flex; align-items:center; gap:6px; background:rgba(200,146,42,0.03); border:1px solid rgba(200,146,42,0.1); border-radius:6px; padding:6px 9px; }
.rank-num { font-size:10px; font-weight:900; color:var(--stone-lt); min-width:18px; }
.rank-name { flex:1; font-size:9px; font-weight:700; color:var(--cream); text-transform:uppercase; }
.rank-pts { font-size:9px; color:var(--stone-lt); }
.rank-prize { font-size:8px; color:var(--gold-lt); font-weight:700; min-width:52px; text-align:right; }
.ranking-reset { font-size:8px; color:#d5cccc; text-align:center; letter-spacing:1px; }

/* ═══════════════════════
   WALLET MODAL
═══════════════════════ */
#walletModal .modal-box { border:2px solid var(--ore-lt); }
.wallet-title { color:var(--ore-lt); }
.wallet-tabs { display:flex; margin-bottom:14px; border-bottom:2px solid rgba(90,143,168,0.1); }
.wallet-tab {
  flex:1; padding:7px; background:none; border:none; color:var(--stone-lt);
  font-family:'Space Mono',monospace; font-size:8px; text-transform:uppercase;
  letter-spacing:1px; cursor:pointer; border-bottom:2px solid transparent;
  margin-bottom:-2px; font-weight:700; transition:all .22s;
}
.wallet-tab.active { color:var(--ore-lt); border-bottom-color:var(--ore-lt); }
.wallet-panel { display:none; flex-direction:column; gap:10px; }
.wallet-panel.active { display:flex; }
.rate-box {
  background:rgba(90,143,168,0.05); border:1px solid rgba(90,143,168,0.15);
  border-radius:6px; padding:7px 11px; display:flex; justify-content:space-between; font-size:9px;
}
.rate-lbl { color:var(--stone-lt); text-transform:uppercase; letter-spacing:1px; }
.rate-val { color:var(--safe-lt); font-weight:700; }
.wi-label { font-size:8px; text-transform:uppercase; letter-spacing:1px; color:var(--stone-lt); font-weight:700; margin-bottom:3px; }
.wi-row { display:flex; gap:6px; align-items:center; }
.wallet-input {
  background:rgba(5,3,1,0.9); border:2px solid var(--ore-lt); border-radius:5px;
  padding:7px 9px; color:var(--ore-lt); font-family:'Space Mono',monospace;
  font-size:11px; width:100%; text-align:right;
}
.wallet-input:focus { outline:none; box-shadow:0 0 12px rgba(90,143,168,0.2); }
.wunit { font-size:9px; color:var(--stone-lt); white-space:nowrap; }
.wbal-row { display:flex; justify-content:space-between; font-size:9px; color:var(--stone-lt); padding:4px 0; border-top:1px solid rgba(90,143,168,0.07); }
.wbal-row span { color:var(--ore-lt); font-weight:700; }
.wmsg { font-size:9px; text-align:center; padding:5px; border-radius:5px; min-height:26px; display:flex; align-items:center; justify-content:center; }
.wmsg.ok   { background:rgba(74,124,63,0.08); border:1px solid rgba(74,124,63,0.22); color:var(--safe-lt); }
.wmsg.err  { background:rgba(139,32,32,0.08); border:1px solid rgba(139,32,32,0.22); color:var(--danger-lt); }
.wmsg.warn { background:rgba(200,146,42,0.06); border:1px solid rgba(200,146,42,0.18); color:var(--gold-lt); }
.btn-wa { width:100%; padding:10px; border-radius:7px; font-family:'Space Mono',monospace; font-size:9px; font-weight:700; cursor:pointer; text-transform:uppercase; letter-spacing:1px; transition:all .22s; border:none; }
.btn-dep { background:rgba(74,124,63,0.12); border:2px solid rgba(74,124,63,0.4); color:var(--safe-lt); }
.btn-dep:hover:not(:disabled) { background:rgba(74,124,63,0.28); }
.btn-wd  { background:rgba(200,146,42,0.08); border:2px solid rgba(200,146,42,0.35); color:var(--gold-lt); }
.btn-wd:hover:not(:disabled)  { background:rgba(200,146,42,0.22); }
.btn-wa:disabled { opacity:.28; cursor:not-allowed; }
.wd-cd { background:rgba(200,146,42,0.04); border:1px solid rgba(200,146,42,0.15); border-radius:7px; padding:8px; text-align:center; }
.wd-cd-label { font-size:8px; color:var(--stone-lt); text-transform:uppercase; letter-spacing:1px; margin-bottom:2px; }
.wd-cd-timer { font-size:18px; font-family:'Playfair Display',serif; color:var(--gold); }
.saldo-hdr { display:flex; justify-content:space-between; align-items:center; background:rgba(90,143,168,0.05); border:1px solid rgba(90,143,168,0.18); border-radius:7px; padding:7px 11px; margin-bottom:10px; font-size:9px; }
.saldo-hdr span:first-child { color:var(--stone-lt); text-transform:uppercase; letter-spacing:1px; }

/* Explosion overlay */
.explosion-ov {
  position:fixed; inset:0; z-index:75;
  background: radial-gradient(circle at var(--ex,50%) var(--ey,50%), rgba(255,68,0,0.6) 0%, rgba(139,32,32,0.4) 30%, transparent 70%);
  pointer-events:none; opacity:0; transition:opacity 0.1s;
}
.explosion-ov.bang { opacity:1; animation:bangFade 0.6s ease forwards; }
@keyframes bangFade { 0%{opacity:1} 100%{opacity:0} }

/* Scrollbars */
::-webkit-scrollbar { width:4px; height:4px; }
::-webkit-scrollbar-track { background:rgba(200,146,42,0.04); border-radius:4px; }
::-webkit-scrollbar-thumb { background:linear-gradient(180deg,var(--gold),var(--ore)); border-radius:4px; }
* { scrollbar-width:thin; scrollbar-color:var(--gold) rgba(200,146,42,0.04); }

/* Responsive */
@media(max-width:860px) {
  .lobby-wrap { grid-template-columns:1fr; }
  .stats-row  { grid-template-columns:repeat(2,1fr); }
  .diff-guide { grid-template-columns:1fr 1fr 1fr; }
}
@media(max-width:480px) {
  .game-title { font-size:38px; }
  .cell { width:30px; height:30px; font-size:10px; }
  .hud-item { min-width:44px; }
}
</style>
</head>
<body>

<!-- EXPLOSION OVERLAY -->
<div class="explosion-ov" id="explosionOv"></div>

<!-- ═══════ LOBBY ═══════ -->
<div id="lobbyScreen" class="screen active">
  <div class="lobby-wrap">

    <!-- Top bar -->
    <div class="top-bar">
      <div class="player-info">
        <img id="userAvatar" class="player-avatar" src="" alt="">
        <div>
          <div class="player-name-label">Excavador</div>
          <div class="player-name" id="userName">PLAYER</div>
        </div>
      </div>
      <a href="https://chainfeed.space/juegos" class="exit-link">🚪 Salir</a>
    </div>

    <!-- Left: hero + stats -->
    <div>
      <h1 class="game-title">CHAIN<br>DIG</h1>
      <p class="game-subtitle">⛏ Excavá las minas · Protegé tus CFT</p>

      <div class="stats-row">
        <div class="stat-tile">
          <div class="stat-lbl">Balance 💎</div>
          <div class="stat-val" id="lbPoints">0</div>
        </div>
        <div class="stat-tile">
          <div class="stat-lbl">Partidas</div>
          <div class="stat-val" id="lbGames">0</div>
        </div>
        <div class="stat-tile">
          <div class="stat-lbl">Oro de Temporada 🪙</div>
          <div class="stat-val" id="lbMaxWave">0 ORO</div>
        </div>
        <div class="stat-tile">
          <div class="stat-lbl">Mejor ganancia</div>
          <div class="stat-val" id="lbBestProfit" style="color:var(--gold-lt)">0</div>
        </div>
      </div>
      
    </div>

    <!-- Right: config panel -->
    <div class="config-panel">

      <!-- Lives indicator -->
      <div class="lives-badge">
        <div class="lives-info" style="flex:1;">
          <div style="display:flex; gap:20px; align-items:center;">
            <div>
              <div class="lives-label">Partidas GRATIS</div>
              <div class="lives-count" id="livesFreeCont">3</div>
            </div>
            <div>
              <div class="lives-label">Partidas APUESTA</div>
              <div class="lives-count" id="livesApostCont">3</div>
            </div>
          </div>
        </div>
        <button class="btn-buy-lives" id="buyLivesBtn" onclick="openBuyLives()" disabled>+ COMPRAR</button>
      </div>

      <div class="panel-card">
        <div class="card-title">🎮 Modo de juego</div>
        <div class="mode-toggle">
          <button class="mode-btn active-free" id="modeFreeBtn" onclick="setMode('free')">
            🆓 GRATIS<br><span style="font-size:8px;color:var(--stone-lt)">Recompensas fijas</span>
          </button>
          <button class="mode-btn" id="modeBetBtn" onclick="setMode('bet')">
            💰 APOSTAR<br><span style="font-size:8px;color:var(--stone-lt)">Presupuesto en juego</span>
          </button>
        </div>

        <div class="card-title" style="margin-top:4px">⛏ Dificultad</div>
        <div class="diff-selector">
          <div class="diff-btn selected" data-diff="easy" onclick="setDiff('easy')">
            <span class="diff-icon">🌱</span>
            <span class="diff-name">SUAVE</span>
            <span class="diff-grid">8×8 · 10💣</span>
            <span class="diff-mult easy" id="diffEasyReward">Gana: 1 TRR</span>
          </div>
          <div class="diff-btn" data-diff="medium" onclick="setDiff('medium')">
            <span class="diff-icon">⛰️</span>
            <span class="diff-name">ROCOSO</span>
            <span class="diff-grid">12×12 · 22💣</span>
            <span class="diff-mult med" id="diffMedReward">Gana: 2 TRR</span>
          </div>
          <div class="diff-btn" data-diff="hard" onclick="setDiff('hard')">
            <span class="diff-icon">🌋</span>
            <span class="diff-name">VOLCÁNICO</span>
            <span class="diff-grid">16×16 · 40💣</span>
            <span class="diff-mult hard" id="diffHardReward">Gana: 3 TRR</span>
          </div>
        </div>

        <div class="bet-section" id="betSection">
          <div class="card-title" style="margin-top:8px">💎 Presupuesto (mín. 50 · máx. 200 TRR)</div>
          <div class="bet-presets">
            <div class="bet-opt" data-bet="50">50</div>
            <div class="bet-opt" data-bet="100">100</div>
            <div class="bet-opt" data-bet="150">150</div>
            <div class="bet-opt" data-bet="200">200</div>
          </div>
          <input type="number" class="bet-input" id="betCustom" placeholder="Personalizado (mín 50, máx 200)" min="50" max="200" step="10">
          <div class="bet-preview" id="betPreview">
            Ganancia máx: <b id="previewMax">—</b><br>
            Si explosión: <b style="color:var(--danger-lt)">−presupuesto completo</b><br>
            Checkpoints guardan progreso parcial
          </div>
        </div>

        <div id="freeInfo" style="background:rgba(74,124,63,0.06);border:1px solid rgba(74,124,63,0.15);border-radius:8px;padding:10px;margin-top:8px;font-size:9px;color:var(--stone-lt);line-height:1.9">
          <p>Completar tablero: <b style="color:var(--safe-lt)" id="freeReward">+1 TRR</b></p>
          <p>Sin riesgo · Solo checkpoints en tablero completo</p>
        </div>

        <button class="btn-dig" id="playBtn">⛏ EXCAVAR</button>
        <button class="btn-secondary" id="shopBtnLobby">📡 TIENDA DE RADARES</button>
        <button class="btn-gold" id="rankingBtn">🏆 RANKING</button>
        <button class="btn-safe" id="walletBtn">💎 WALLET CFT</button>
      </div>
    </div>

  </div>
</div>

<!-- ═══════ GAME ═══════ -->
<div id="gameScreen" class="screen">
  <div class="hud-top">
    <div style="display:flex;align-items:center;gap:8px;min-width:90px;">
      <img id="gameUserAvatar" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--gold);object-fit:cover;display:none;">
      <div id="gameUserName" style="font-size:9px;color:var(--gold-lt);font-weight:700;text-transform:uppercase;">PLAYER</div>
    </div>
    <div class="hud-item">
      <div class="hud-lbl">Minas</div>
      <div class="hud-val danger" id="hudMines">—</div>
    </div>
    <div class="hud-item">
      <div class="hud-lbl">Descubiertas</div>
      <div class="hud-val safe" id="hudRevealed">—</div>
    </div>
    <div class="hud-progress">
      <div class="hud-progress-label"><span>Progreso</span><span id="hudPct">0%</span></div>
      <div class="progress-bar-bg"><div class="progress-bar-fill" id="progressFill" style="width:0%"></div></div>
    </div>
    <div class="hud-item">
      <div class="hud-lbl">Oro</div>
      <div class="hud-val" id="hudGold">0</div>
    </div>
    <div class="hud-item">
      <div class="hud-lbl">Guardado</div>
      <div class="hud-val safe" id="hudSaved">0</div>
    </div>
    <div class="diff-badge" id="diffBadge">SUAVE</div>
    <button class="menu-toggle" id="menuToggle">☰</button>
  </div>

  <div class="game-area">
    <div class="board-wrap">
      <div class="board-title" id="boardTitle">⛏ EXCAVACIÓN ACTIVA</div>
      <div id="gameBoard"></div>
    </div>
  </div>

  <div class="hud-bottom">
    <button class="flag-btn" id="flagToggle" onclick="toggleFlagMode()">
      🚩 MARCAR MINA
    </button>
    <button class="radar-btn" id="radarBtn" onclick="useRadar()">
      📡 RADAR <span class="radar-cost" id="radarCostDisplay">(5🪙)</span>
    </button>
    <div class="hud-item">
      <div class="hud-lbl">Radares</div>
      <div class="hud-val ore" id="hudRadars">0</div>
    </div>
  </div>

  <!-- In-game menu -->
  <div class="ingame-menu" id="ingameMenu">
    <div class="menu-section-lbl">Menú</div>
    <div class="menu-info" id="menuInfo">...</div>
    <button class="btn-wa btn-dep btn-menu-cont" onclick="closeMenu()" style="margin-top:4px">▶ Continuar</button>
    <button class="btn-wa btn-wd btn-menu-exit" id="menuExitBtn">🚪 Abandonar</button>
  </div>
</div>

<!-- ═══════ LOADING ═══════ -->
<div id="loadingScreen" class="screen">
  <div class="pickaxe-spin">⛏</div>
  <div class="load-txt">Preparando excavación...</div>
</div>

<!-- ═══════ RESULT ═══════ -->
<div id="resultScreen" class="screen">
  <div class="result-card win" id="resultCard">
    <img id="resultUserAvatar" class="result-avatar" src="" alt="">
    <div class="result-player-name" id="resultUserName"></div>
    <h2 class="result-title win" id="resultTitle">—</h2>
    <div id="resultStats"></div>
    <div class="result-btns">
      <button class="btn-dig" id="retryBtn" style="margin-top:0">⛏ REINTENTAR</button>
      <button class="btn-secondary" id="menuBtn" style="margin-top:0">🏠 MENÚ</button>
    </div>
  </div>
</div>

<!-- ═══════ SHOP MODAL ═══════ -->
<div class="modal-ov" id="shopModal">
  <div class="modal-box">
    <button class="modal-close" onclick="closeShop()">✕</button>
    <h3 class="modal-title shop-title">📡 TIENDA DE RADARES</h3>
    <p class="modal-sub">Herramientas de excavación · Compra permanente</p>
    <div class="shop-balance">
      <span>Tu balance</span>
      <span id="shopBalDisplay" style="color:var(--gold-lt);font-weight:900;font-size:12px">0 TRR</span>
    </div>
    <div class="shop-grid" id="shopGrid"></div>
  </div>
</div>

<!-- ═══════ BUY LIVES MODAL ═══════ -->
<div class="modal-ov" id="buyLivesModal">
  <div class="modal-box" style="border:2px solid var(--safe);max-width:460px;">
    <button class="modal-close" onclick="closeBuyLives()">✕</button>
    <h3 class="modal-title" style="color:var(--safe-lt)">⏳ COMPRAR PARTIDAS</h3>
    <p class="modal-sub">Obtén 3 partidas más para hoy</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px;">
      <div style="background:rgba(74,124,63,0.08);border:2px solid rgba(74,124,63,0.4);border-radius:10px;padding:14px;text-align:center;">
        <div style="font-size:24px;margin-bottom:8px;">🆓</div>
        <div style="font-size:10px;font-weight:700;color:var(--cream);text-transform:uppercase;margin-bottom:3px;">MODO GRATIS</div>
        <div style="font-size:11px;color:var(--gold-lt);font-weight:700;margin-bottom:10px;">6 TRR</div>
        <button class="btn-dig" id="btnBuyFree" style="margin-top:0;font-size:10px;" onclick="buyLivesConfirm('free')">COMPRAR</button>
      </div>
      <div style="background:rgba(200,146,42,0.08);border:2px solid rgba(200,146,42,0.4);border-radius:10px;padding:14px;text-align:center;">
        <div style="font-size:24px;margin-bottom:8px;">💰</div>
        <div style="font-size:10px;font-weight:700;color:var(--cream);text-transform:uppercase;margin-bottom:3px;">MODO APUESTA</div>
        <div style="font-size:11px;color:var(--gold-lt);font-weight:700;margin-bottom:10px;">100 TRR</div>
        <button class="btn-dig" id="btnBuyApost" style="margin-top:0;font-size:10px;" onclick="buyLivesConfirm('bet')">COMPRAR</button>
      </div>
    </div>
  </div>
</div>

<!-- ═══════ RANKING MODAL ═══════ -->
<div class="modal-ov" id="rankingModal">
  <div class="modal-box">
    <button class="modal-close" onclick="closeRanking()">✕</button>
    <h3 class="modal-title ranking-title">🏆 RANKING</h3>
    <p class="modal-sub" id="rankingMonthLabel">MES ACTUAL</p>
    <div class="podium" id="rankingPodium"></div>
    <div class="ranking-table" id="rankingTable"></div>
    <div class="ranking-reset" id="rankingResetInfo"></div>
  </div>
</div>

<!-- ═══════ WALLET MODAL ═══════ -->
<div class="modal-ov" id="walletModal">
  <div class="modal-box">
    <button class="modal-close" onclick="closeWallet()">✕</button>
    <h3 class="modal-title wallet-title">💎 WALLET CFT</h3>
    <div class="saldo-hdr">
      <span>Saldo</span>
      <span id="wCftBal" style="color:var(--ore-lt);font-weight:900;font-size:13px">0 TRR</span>
    </div>
    <div class="wallet-tabs">
      <button class="wallet-tab active" data-wtab="deposit" onclick="switchWT('deposit')">⬇ DEPOSITAR</button>
      <button class="wallet-tab" data-wtab="withdraw" onclick="switchWT('withdraw')">⬆ RETIRAR</button>
    </div>
    <div class="wallet-panel active" id="wpDep">
      <div class="rate-box"><span class="rate-lbl">Tasa</span><span class="rate-val">1 CFT = 1 TRR</span></div>
      <div>
        <div class="wi-label">CFT a depositar</div>
        <div class="wi-row">
          <input type="number" class="wallet-input" id="depAmt" min="1" step="1" placeholder="0" oninput="updateDep()">
          <span class="wunit">CFT</span>
        </div>
      </div>
      <div class="wbal-row"><span>Balance actual</span><span id="depCur">0 CFT</span></div>
      <div class="wbal-row"><span>Tras depósito</span><span id="depAfter">0 CFT</span></div>
      <div class="wmsg" id="depMsg"></div>
      <button class="btn-wa btn-dep" id="depBtn" disabled onclick="doDeposit()">⬇ DEPOSITAR</button>
    </div>
    <div class="wallet-panel" id="wpWd">
      <div class="wd-cd" id="wdCdBlock" style="display:none">
        <div class="wd-cd-label">⏳ Próximo retiro en</div>
        <div class="wd-cd-timer" id="wdTimer">--:--:--</div>
      </div>
      <div id="wdFormBlock">
        <div>
          <div class="wi-label">CFT a retirar (mín 5)</div>
          <div class="wi-row">
            <input type="number" class="wallet-input" id="wdAmt" min="5" step="1" placeholder="5" oninput="updateWd()">
            <span class="wunit">CFT</span>
          </div>
        </div>
        <div class="wbal-row"><span>Balance actual</span><span id="wdCur">0 CFT</span></div>
        <div class="wbal-row"><span>Tras retiro</span><span id="wdAfter">0 CFT</span></div>
      </div>
      <div class="wmsg" id="wdMsg"></div>
      <button class="btn-wa btn-wd" id="wdBtn" disabled onclick="doWithdraw()">⬆ RETIRAR</button>
    </div>
  </div>
</div>

<script>
'use strict';

/* ═══════════════════════
   UTILS
═══════════════════════ */
const $ = id => document.getElementById(id);
const setText = (id, v) => { const e=$(id); if(e) e.textContent=v; };
const setHTML = (id, v) => { const e=$(id); if(e) e.innerHTML=v; };

/* ═══════════════════════
   CONFIG
═══════════════════════ */
const DIFFICULTIES = {
  easy:   { rows:8,  cols:8,  mines:10, reward:1,  mult:0.25, radarCost:5,  radarRadius:2, label:'SUAVE',     icon:'🌱' },
  medium: { rows:12, cols:12, mines:22, reward:2,  mult:0.50, radarCost:8,  radarRadius:2, label:'ROCOSO',    icon:'⛰️' },
  hard:   { rows:16, cols:16, mines:40, reward:3,  mult:0.75, radarCost:12, radarRadius:3, label:'VOLCÁNICO', icon:'🌋' },
};
const CHECKPOINTS = [0.25, 0.50, 0.75]; // % de celdas seguras descubiertas
const RADAR_SHOP_ITEMS = [
  { key:'radar_pack_3',  name:'Radar Gratis',   emoji:'📡', desc:'1 escaneo · solo modo GRATIS',   cost:80,  gives:1, mode:'free' },
  { key:'radar_pack_10', name:'Radar Apuesta',  emoji:'🛰️', desc:'1 escaneo · solo modo APUESTA', cost:220, gives:1, mode:'bet'  },
];
const ECO = { MIN_BET:50, MAX_BET:200, WITHDRAW_MIN:5, WITHDRAW_CD:86400000, LIVES_FREE_COST:6, LIVES_BET_COST:100 };

/* ═══════════════════════
   GAME STATE (GS)
═══════════════════════ */
const SAVE_KEY = 'chainDig_v1';
const GS = {
  cft:0, cftSocial:0,
  games:0, maxWins:0, bestProfit:0,
  lastWithdraw:0, playerName:'PLAYER', avatarUrl:'',
  owned:[], radars:0,
  livesFree:3, livesApost:3, livesLastReset:0,
  oroMesActual:0, oroTotal:0,
  load() {
    try { const d=localStorage.getItem(SAVE_KEY); if(d) Object.assign(this,JSON.parse(d)); } catch(_){}
    if(typeof this.cft!=='number') this.cft=0;
    if(typeof this.cftSocial!=='number') this.cftSocial=0;
    if(!Array.isArray(this.owned)) this.owned=[];
    if(typeof this.radarsGratis!=='number')  this.radarsGratis=0;
if(typeof this.radarsApuesta!=='number') this.radarsApuesta=0;
    if(typeof this.livesFree!=='number') this.livesFree=3;
    if(typeof this.livesApost!=='number') this.livesApost=3;
    if(typeof this.livesLastReset!=='number') this.livesLastReset=0;
    if(typeof this.oroMesActual!=='number') this.oroMesActual=0;
    if(typeof this.oroTotal!=='number') this.oroTotal=0;
    // Reset vidas si pasó más de 24 horas
    if(this.livesLastReset && Date.now()-this.livesLastReset>=86400000) {
      this.livesFree=3;
      this.livesApost=3;
      this.livesLastReset=Date.now();
    }
  },
  save() {
// En GS.save(), reemplazá radars por:
const {cft,cftSocial,games,maxWins,bestProfit,lastWithdraw,playerName,avatarUrl,owned,
       radarsGratis,radarsApuesta,
       livesFree,livesApost,livesLastReset,oroMesActual,oroTotal}=this;
localStorage.setItem(SAVE_KEY,JSON.stringify({
    cft,cftSocial,games,maxWins,bestProfit,lastWithdraw,playerName,avatarUrl,owned,
    radarsGratis,radarsApuesta,
    livesFree,livesApost,livesLastReset,oroMesActual,oroTotal
}));
 },
  get canWithdraw(){ return this.lastWithdraw===0||Date.now()-this.lastWithdraw>=ECO.WITHDRAW_CD; },
  get timeUntilWithdraw(){ return this.lastWithdraw===0?0:Math.max(0,(this.lastWithdraw+ECO.WITHDRAW_CD)-Date.now()); },
  get hasLives(){ return _mode==='free' ? this.livesFree>0 : this.livesApost>0; },
  get currentLives(){ return _mode==='free' ? this.livesFree : this.livesApost; },
};
GS.load();
window.gameState = GS;

/* ═══════════════════════
   SESSION (SES)
═══════════════════════ */
let SES = {
  mode:'free', diff:'easy',
  initialBudget:0, currentGold:0,
  savedGains:0, checkpointsDone:[],
  radarsUsed:0, cellsRevealed:0, totalSafe:0,
  won:false,
};

/* ═══════════════════════
   BOARD STATE
═══════════════════════ */
let BOARD = {
  grid:[],       // 2D array of cell objects
  rows:0, cols:0, mines:0,
  firstClick:true,
  flagMode:false,
  gameOver:false,
  revealedCount:0,
};

/* ═══════════════════════
   LOBBY UI
═══════════════════════ */
let _mode = 'free', _diff = 'easy', _bet = 50;

function setMode(m) {
  console.log('[MODE] Cambiando modo a:', m);
  _mode = m;
  $('modeFreeBtn').className = 'mode-btn' + (m==='free'?' active-free':'');
  $('modeBetBtn').className  = 'mode-btn' + (m==='bet'?' active-bet':'');
  $('betSection').style.display = m==='bet'?'block':'none';
  $('freeInfo').style.display   = m==='free'?'block':'none';
  
  // Actualizar display de recompensas en dificultades
  const dcfgEasy = DIFFICULTIES.easy;
  const dcfgMed = DIFFICULTIES.medium;
  const dcfgHard = DIFFICULTIES.hard;
  
  if(m==='free'){
    $('diffEasyReward').textContent = 'Gana: '+dcfgEasy.reward+' TRR';
    $('diffMedReward').textContent = 'Gana: '+dcfgMed.reward+' TRR';
    $('diffHardReward').textContent = 'Gana: '+dcfgHard.reward+' TRR';
  } else {
    $('diffEasyReward').textContent = '±'+Math.round(dcfgEasy.mult*100)+'%';
    $('diffMedReward').textContent = '±'+Math.round(dcfgMed.mult*100)+'%';
    $('diffHardReward').textContent = '±'+Math.round(dcfgHard.mult*100)+'%';
  }
  
  updateLobby();
}

function setDiff(d) {
  _diff = d;
  document.querySelectorAll('.diff-btn').forEach(b=>b.classList.toggle('selected',b.dataset.diff===d));
  updateLobby();
}

function updateLobby() {
  setText('lbPoints', GS.cft.toFixed(0)+' TRR');
  setText('lbGames', GS.games);
  
  // Oro de Temporada: se obtiene de GS (sincronizado desde BD)
  const oroMesActual = GS.oroMesActual || 0;
  console.log('[LOBBY] Mostrando oro - GS.oroMesActual:', oroMesActual);
  
  setText('lbMaxWave', oroMesActual.toFixed(0) + ' ORO');
  setText('lbBestProfit', GS.bestProfit.toFixed(0)+' TRR');
  setText('livesFreeCont', GS.livesFree);
  setText('livesApostCont', GS.livesApost);
  
  // Botón de comprar vidas HABILITADO solo si NO hay vidas en el modo actual
  const buyBtn = $('buyLivesBtn');
  if(buyBtn) {
    const shouldEnable = GS.livesFree <= 0 || GS.livesApost <= 0;
    buyBtn.disabled = !shouldEnable;
    console.log('[LOBBY] Buy Lives btn - Modo:', _mode, 'HasLives:', GS.hasLives, 'Disabled:', !shouldEnable);
  }
  
  const dcfg = DIFFICULTIES[_diff];
  setText('freeReward', '+'+dcfg.reward+' TRR');
  
  const pb = $('playBtn');
  if (_mode==='free') {
    if(pb){pb.disabled=!GS.hasLives; pb.textContent=GS.hasLives?'⛏ EXCAVAR':'⚠ SIN PARTIDAS';}
  } else {
    if(pb){
      pb.disabled = !GS.hasLives||_bet<ECO.MIN_BET||_bet>ECO.MAX_BET||_bet>GS.cft;
      pb.textContent = !GS.hasLives ? '⚠ SIN PARTIDAS' : _bet>GS.cft ? '⚠ SALDO INSUFICIENTE' : '⛏ EXCAVAR ('+_bet+' TRR)';
    }
    // bet preview
    const maxGain = Math.round(_bet * dcfg.mult);
    const maxLoss = Math.round(_bet * dcfg.mult);
    setText('previewMax', '+'+maxGain+' TRR ('+Math.round(dcfg.mult*100)+'%) o −'+maxLoss+' TRR');
  }
}

// Bet presets - Se inicializa en DOMContentLoaded
function setBet(v) {
  const oldBet = _bet;
  _bet = Math.max(ECO.MIN_BET, Math.min(v, ECO.MAX_BET));
  console.log('[BET] setBet() - Anterior:', oldBet, '-> Nuevo:', _bet, 'v=', v, 'GS.cft=', GS.cft);
  
  // Mostrar qué presets están visibles
  const opts = document.querySelectorAll('.bet-opt');
  console.log('[BET] Total presets:', opts.length);
  opts.forEach(o=>{
    const dataVal = parseInt(o.dataset.bet);
    const shouldBeSelected = dataVal === _bet;
    o.classList.toggle('selected', shouldBeSelected);
    console.log('[BET]  Preset', dataVal, '- Selected:', shouldBeSelected);
  });
  
  $('betCustom').value='';
  updateLobby();
}

/* ═══════════════════════
   LIVES MANAGEMENT
═══════════════════════ */
function openBuyLives(){
  $('buyLivesModal').classList.add('open');
  updateBuyLivesButtons();
}

function updateBuyLivesButtons(){
  const btnFree = $('btnBuyFree');
  const btnApost = $('btnBuyApost');
  
const canBuyFree  = GS.livesFree  <= 0 && GS.cft >= ECO.LIVES_FREE_COST;
const canBuyApost = GS.livesApost <= 0 && GS.cft >= ECO.LIVES_BET_COST;
  
  console.log('[BUYLIVES] Balance:', GS.cft, 'Free cost:', ECO.LIVES_FREE_COST, 'Can buy free:', canBuyFree, 'Apost cost:', ECO.LIVES_BET_COST, 'Can buy apost:', canBuyApost);
  
  if(btnFree) {
    btnFree.disabled = !canBuyFree;
    btnFree.textContent = canBuyFree ? 'COMPRAR' : '⚠ SALDO INSUFICIENTE';
  }
  if(btnApost) {
    btnApost.disabled = !canBuyApost;
    btnApost.textContent = canBuyApost ? 'COMPRAR' : '⚠ SALDO INSUFICIENTE';
  }
}
function closeBuyLives(){
  $('buyLivesModal').classList.remove('open');
}
async function buyLivesConfirm(modo){
  const cost = modo==='bet'?ECO.LIVES_BET_COST:ECO.LIVES_FREE_COST;
  if(GS.cft<cost){ cdToastFallback('Balance TRR insuficiente','err'); return; }
  if(typeof buyLives==='function'){
    await buyLives(modo);
  } else {
    GS.cft-=cost;
    if(modo==='free') GS.livesFree=3;
    else GS.livesApost=3;
    GS.livesLastReset=Date.now();
    GS.save();
    cdToastFallback(`✓ +3 partidas ${modo==='bet'?'APUESTA':'GRATIS'} −${cost} TRR`,'ok');
  }
  updateLobby();
  closeBuyLives();
}
$('buyLivesModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeBuyLives(); });

/* ═══════════════════════
   START GAME
═══════════════════════ */
$('playBtn').addEventListener('click', async () => {
  console.log('[PLAY] Click en botón EXCAVAR - Modo:', _mode, 'Dif:', _diff, 'Bet:', _bet);
  
  if(!GS.hasLives){ cdToastFallback('Sin partidas · Comprá más vidas','err'); return; }
  if(_mode==='bet') {
    if(GS.cft<_bet){ cdToastFallback('Balance TRR insuficiente','err'); return; }
    if(_bet<ECO.MIN_BET||_bet>ECO.MAX_BET){ cdToastFallback('Presupuesto fuera de rango','warn'); return; }
  }
  
  showScreen('loading');
  console.log('[PLAY] Iniciando partida con:', {modo:_mode, dificultad:_diff, presupuesto:_mode==='bet'?_bet:0});
  
  const partida_id = typeof bombIniciarPartida === 'function'
    ? await bombIniciarPartida(_mode, _diff, _mode==='bet'?_bet:0)
    : null;

  const dcfg = DIFFICULTIES[_diff];
  SES = {
    mode:_mode, diff:_diff,
    initialBudget: _mode==='bet'?_bet:0,
    currentGold:   _mode==='bet'?_bet:dcfg.reward,
    savedGains:0, checkpointsDone:[],
    radarsUsed:0, cellsRevealed:0,
    totalSafe:0, won:false,
    partida_id: partida_id,
  };
  
  await delay(400);
  initGame(); showScreen('game'); updateHUD();
});

/* ═══════════════════════
   BOARD INIT
═══════════════════════ */
function initGame() {
  const dcfg = DIFFICULTIES[SES.diff];
  BOARD = {
    grid:[], rows:dcfg.rows, cols:dcfg.cols, mines:dcfg.mines,
    firstClick:true, flagMode:false, gameOver:false, revealedCount:0,
  };
  SES.totalSafe = dcfg.rows*dcfg.cols - dcfg.mines;
  SES.cellsRevealed = 0;
  SES.checkpointsDone = [];

  // Init grid
  for(let r=0;r<dcfg.rows;r++){
    BOARD.grid[r]=[];
    for(let c=0;c<dcfg.cols;c++){
      BOARD.grid[r][c]={ mine:false, revealed:false, flagged:false, neighbors:0 };
    }
  }

  renderBoard();
  setText('diffBadge', dcfg.icon+' '+dcfg.label);
  setText('boardTitle', '⛏ EXCAVACIÓN ACTIVA');
  // extractBtn ya no existe
  updateHUD();
}

function placeMines(safeR, safeC) {
  const dcfg = DIFFICULTIES[SES.diff];
  const forbidden = new Set();
  for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) {
    const nr=safeR+dr, nc=safeC+dc;
    if(nr>=0&&nr<dcfg.rows&&nc>=0&&nc<dcfg.cols) forbidden.add(nr*dcfg.cols+nc);
  }
  let placed=0;
  while(placed<dcfg.mines){
    const r=Math.floor(Math.random()*dcfg.rows);
    const c=Math.floor(Math.random()*dcfg.cols);
    const idx=r*dcfg.cols+c;
    if(!BOARD.grid[r][c].mine&&!forbidden.has(idx)){
      BOARD.grid[r][c].mine=true; placed++;
    }
  }
  // Calc neighbors
  for(let r=0;r<dcfg.rows;r++) for(let c=0;c<dcfg.cols;c++){
    if(BOARD.grid[r][c].mine) continue;
    let n=0;
    forNeighbors(r,c,(_r,_c)=>{ if(BOARD.grid[_r][_c].mine) n++; });
    BOARD.grid[r][c].neighbors=n;
  }
}

function forNeighbors(r,c,fn){
  for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
    if(dr===0&&dc===0) continue;
    const nr=r+dr,nc=c+dc;
    if(nr>=0&&nr<BOARD.rows&&nc>=0&&nc<BOARD.cols) fn(nr,nc);
  }
}

/* ═══════════════════════
   RENDER BOARD
═══════════════════════ */
function renderBoard() {
  const board = $('gameBoard');
  board.innerHTML='';
  board.style.gridTemplateColumns = `repeat(${BOARD.cols}, 1fr)`;

  // Scale cells to fit screen
  const gameArea = document.querySelector('.game-area');
  const availW = (gameArea?.clientWidth||800) - 60;
  const availH = (gameArea?.clientHeight||600) - 60;
  const cellW = Math.floor(Math.min(availW/BOARD.cols, availH/BOARD.rows, 40));
  const cellSize = Math.max(cellW, 22);

  for(let r=0;r<BOARD.rows;r++) for(let c=0;c<BOARD.cols;c++){
    const cell = document.createElement('div');
    cell.id = `cell-${r}-${c}`;
    cell.style.width = cell.style.height = cellSize+'px';
    cell.style.fontSize = Math.round(cellSize*0.38)+'px';
    cell.className = 'cell hidden';
    cell.addEventListener('click', ()=>clickCell(r,c));
    cell.addEventListener('contextmenu', e=>{ e.preventDefault(); flagCell(r,c); });
    board.appendChild(cell);
  }
  board.style.gap = '2px';
}

function updateCellUI(r,c) {
  const cell = $(`cell-${r}-${c}`);
  const data = BOARD.grid[r][c];
  if(!cell) return;

  if(data.revealed){
    if(data.mine){
      cell.className='cell mine-dead';
    } else if(data.neighbors===0){
      cell.className='cell revealed-empty';
      cell.textContent='';
    } else {
      cell.className=`cell revealed-num`;
      cell.textContent=data.neighbors;
      cell.style.color = `var(--num${data.neighbors})`;
    }
  } else if(data.flagged){
    cell.className='cell flagged';
    cell.textContent='';
  } else {
    cell.className='cell hidden';
    cell.textContent='';
  }
}

/* ═══════════════════════
   CELL INTERACTION
═══════════════════════ */
function clickCell(r,c) {
  if(BOARD.gameOver) return;
  const data = BOARD.grid[r][c];
  if(data.revealed||data.flagged) return;

  if(BOARD.flagMode){ flagCell(r,c); return; }

  // First click: place mines safely
  if(BOARD.firstClick){
    BOARD.firstClick=false;
    placeMines(r,c);
  }

  if(data.mine){
    triggerExplosion(r,c);
    return;
  }

  revealCell(r,c);
  checkCheckpoints();
  updateHUD();
}

function revealCell(r,c) {
  const data=BOARD.grid[r][c];
  if(data.revealed||data.flagged||data.mine) return;
  data.revealed=true;
  BOARD.revealedCount++;
  SES.cellsRevealed++;
  updateCellUI(r,c);

  // Auto-reveal empty flood fill
  if(data.neighbors===0){
    forNeighbors(r,c,(nr,nc)=>revealCell(nr,nc));
  }

  // Check win
  if(BOARD.revealedCount===SES.totalSafe){
    setTimeout(()=>triggerWin(),300);
  }
}

function flagCell(r,c){
  const data=BOARD.grid[r][c];
  if(data.revealed) return;
  data.flagged=!data.flagged;
  updateCellUI(r,c);
  updateHUD();
}

function toggleFlagMode(){
  BOARD.flagMode=!BOARD.flagMode;
  $('flagToggle').className='flag-btn'+(BOARD.flagMode?' active':'');
  $('flagToggle').textContent = BOARD.flagMode ? '🚩 MODO ACTIVO' : '🚩 MARCAR MINA';
}

/* ═══════════════════════
   RADAR
═══════════════════════ */
function useRadar(){
  if(BOARD.gameOver) return;
const radarsActuales = SES.mode==='bet' ? GS.radarsApuesta : GS.radarsGratis;
if(radarsActuales<=0){ cdToastFallback('Sin radares para este modo · Comprá en la tienda','warn'); return; }
  const dcfg=DIFFICULTIES[SES.diff];
  if(SES.currentGold<dcfg.radarCost){ cdToastFallback('Sin oro para activar radar','err'); return; }

  // Find hidden non-mine cells
  const candidates=[];
  for(let r=0;r<BOARD.rows;r++) for(let c=0;c<BOARD.cols;c++){
    if(!BOARD.grid[r][c].revealed&&!BOARD.grid[r][c].flagged&&!BOARD.grid[r][c].mine)
      candidates.push({r,c});
  }
  if(candidates.length===0){ cdToastFallback('No hay más zonas que revelar','warn'); return; }

  // Pick center of scan
  const target=candidates[Math.floor(Math.random()*candidates.length)];
  const {r:cr,c:cc}=target;
  const rad=dcfg.radarRadius;

  SES.currentGold-=dcfg.radarCost;
 if(SES.mode==='bet') GS.radarsApuesta--;
else                 GS.radarsGratis--;
GS.save();
  SES.radarsUsed++;

  // Animate scan
  const toReveal=[];
  for(let r=Math.max(0,cr-rad);r<=Math.min(BOARD.rows-1,cr+rad);r++){
    for(let c=Math.max(0,cc-rad);c<=Math.min(BOARD.cols-1,cc+rad);c++){
      if(!BOARD.grid[r][c].revealed&&!BOARD.grid[r][c].flagged&&!BOARD.grid[r][c].mine)
        toReveal.push({r,c,delay:(Math.abs(r-cr)+Math.abs(c-cc))*80});
    }
  }

  // Show scan animation then reveal
  toReveal.forEach(({r,c,delay:d})=>{
    const el=$(`cell-${r}-${c}`);
    if(el){ setTimeout(()=>{el.classList.add('radar-scan');},d); }
    setTimeout(()=>{ revealCell(r,c); checkCheckpoints(); updateHUD(); }, d+500);
  });

  updateHUD();
  cdToastFallback(`📡 Radar activado · −${dcfg.radarCost}🪙`,'ok');
}

/* ═══════════════════════
   CHECKPOINTS
═══════════════════════ */
function checkCheckpoints(){
  const pct = BOARD.revealedCount / SES.totalSafe;
  CHECKPOINTS.forEach(threshold=>{
    if(pct>=threshold && !SES.checkpointsDone.includes(threshold)){
      SES.checkpointsDone.push(threshold);
      triggerCheckpoint(threshold);
    }
  });
  // Enable extract after first checkpoint
  if(SES.checkpointsDone.length>0 && SES.mode==='bet'){
    $('extractBtn').disabled=false;
  }
}

function triggerCheckpoint(threshold){
  const pctLabel=Math.round(threshold*100)+'%';
  const dcfg=DIFFICULTIES[SES.diff];

  if(SES.mode==='bet'){
    const fraction=threshold;
    const checkpointValue=Math.round(SES.currentGold*fraction);
    SES.savedGains=checkpointValue;
    cdToastFallback(`✓ CHECKPOINT ${pctLabel} · ${checkpointValue} TRR asegurados`,'ok');
    // Guardar checkpoint en servidor
    const chkNum = SES.checkpointsDone.length;
    if(typeof bombGuardarCheckpoint==='function'){
      bombGuardarCheckpoint(SES.partida_id, chkNum, checkpointValue, BOARD.revealedCount);
    }
  } else {
    cdToastFallback(`✓ ${pctLabel} descubierto`,'ok');
  }

  // Flash visible cells briefly
  for(let r=0;r<BOARD.rows;r++) for(let c=0;c<BOARD.cols;c++){
    if(BOARD.grid[r][c].revealed){
      const el=$(`cell-${r}-${c}`);
      if(el){ el.classList.add('checkpoint-flash'); setTimeout(()=>el.classList.remove('checkpoint-flash'),600); }
    }
  }
}

/* ═══════════════════════
   EXPLOSION
═══════════════════════ */
function triggerExplosion(r,c){
  BOARD.gameOver=true;
  BOARD.grid[r][c].revealed=true;
  updateCellUI(r,c);

  // Show explosion overlay
  const cellEl=$(`cell-${r}-${c}`);
  if(cellEl){
    const rect=cellEl.getBoundingClientRect();
    const ov=$('explosionOv');
    ov.style.setProperty('--ex',((rect.left+rect.width/2)/window.innerWidth*100)+'%');
    ov.style.setProperty('--ey',((rect.top+rect.height/2)/window.innerHeight*100)+'%');
    ov.classList.add('bang');
    setTimeout(()=>ov.classList.remove('bang'),700);
  }

  // Reveal all mines after short delay
  setTimeout(()=>{
    for(let _r=0;_r<BOARD.rows;_r++) for(let _c=0;_c<BOARD.cols;_c++){
      if(BOARD.grid[_r][_c].mine&&!(_r===r&&_c===c)){
        const el=$(`cell-${_r}-${_c}`);
        if(el){ el.className='cell mine-show'; }
      }
    }
  },400);

  setTimeout(()=>endGame(false), 1200);
}

/* ═══════════════════════
   WIN
═══════════════════════ */
function triggerWin(){
  BOARD.gameOver=true;
  SES.won=true;
  const dcfg=DIFFICULTIES[SES.diff];

  if(SES.mode==='bet'){
    SES.savedGains=Math.round(SES.currentGold*dcfg.mult);
  } else {
    SES.savedGains=dcfg.reward;
  }
  endGame(true);
}

/* ═══════════════════════
   EXTRACT EARLY
═══════════════════════ */
function extractEarly(){
  if(SES.savedGains<=0){ cdToastFallback('No hay nada guardado aún','warn'); return; }
  BOARD.gameOver=true;
  SES.won=false; // partial win
  endGame('extract');
}

/* ═══════════════════════
   END GAME
═══════════════════════ */
async function endGame(result){
  // Determinar estado para la API
  let estado = 'abandonada';
  if(result===true)          estado = 'completada';
  else if(result==='extract') estado = 'extraccion';
  else if(result===false)     estado = 'explosion';

  // Calcular TRR ganado localmente (optimista — el servidor valida)
  const dcfg = DIFFICULTIES[SES.diff];
  let trrGanado = 0;
  if(SES.mode==='bet'){
    if(estado==='completada')  trrGanado = Math.round(SES.initialBudget * dcfg.mult);
    else                       trrGanado = SES.savedGains || 0;
  } else {
    if(estado==='completada')  trrGanado = dcfg.reward;
  }
  
  // Actualizar oro total de la temporada/mes
  // ORO = celdas descubiertas en la partida (SIEMPRE se suma, gane o pierda)
  const oroGanado = BOARD.revealedCount || 0;
  if(oroGanado > 0) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartStr = monthStart.toDateString();
    
    const lastMonthReset = localStorage.getItem('lastMonthResetDate') || '';
    let totalGoldMonth = parseFloat(localStorage.getItem('totalGoldMonth') || '0');
    
    console.log('[ENDGAME] Modo:', SES.mode, 'Estado:', estado, 'ORO ganado:', oroGanado);
    console.log('[ENDGAME] lastMonthReset:', lastMonthReset, 'monthStartStr:', monthStartStr);
    console.log('[ENDGAME] totalGoldMonth antes:', totalGoldMonth);
    
    // Si es un nuevo mes, resetear
    if(lastMonthReset !== monthStartStr) {
      totalGoldMonth = 0;
      localStorage.setItem('lastMonthResetDate', monthStartStr);
      console.log('[ENDGAME] Nuevo mes, reseteando oro');
    }
    
    totalGoldMonth += oroGanado;
    localStorage.setItem('totalGoldMonth', totalGoldMonth.toString());
    console.log('[ENDGAME] totalGoldMonth después:', totalGoldMonth, '(+'+oroGanado+')');
  } else {
    console.log('[ENDGAME] Sin ORO ganado - BOARD.revealedCount:', BOARD.revealedCount);
  }

  // Enviar al servidor y esperar respuesta
  let netChange = 0;
  if(typeof bombFinalizarPartida === 'function'){
    const data = await bombFinalizarPartida({
      estado,
      celdasRev:    SES.cellsRevealed  || 0,
      radaresUsados:SES.radarsUsed     || 0,
      trrGanado,
      checkpoints:  SES.checkpointsDone.length,
    });
    if(data && data.success){
      GS.cft        = data.dig_balance   ?? GS.cft;
      GS.bestProfit = data.mejor_ganancia ?? GS.bestProfit;
      GS.maxWins    = data.total_wins     ?? GS.maxWins;
if(data.vidas_gratis  !== undefined) GS.livesFree  = data.vidas_gratis;
if(data.vidas_apuesta !== undefined) GS.livesApost = data.vidas_apuesta;
      netChange     = data.ganancia_neta  ?? 0;
      GS.games++;
      GS.save();
    }
  } else {
    // Fallback local si el bridge no cargó
    GS.games++;
    if(estado==='completada'){
      if(SES.mode==='bet'){ 
        const ganancia=Math.round(SES.initialBudget*dcfg.mult); 
        const total=SES.initialBudget+ganancia;
        netChange=ganancia; 
        GS.cft+=total; 
      }
      else { netChange=dcfg.reward; GS.cft+=netChange; }
      GS.maxWins++;
    } else {
      GS.cft+=SES.savedGains||0;
      netChange=(SES.savedGains||0)-SES.initialBudget;
    }
    if(netChange>0) GS.bestProfit=Math.max(GS.bestProfit,netChange);
    GS.save();
  }

  const isProfit = netChange>=0;
  const card=$('resultCard'), title=$('resultTitle');
  if(card) card.className='result-card '+(isProfit?'win':'lose');
  if(title){
    title.className='result-title '+(isProfit?'win':'lose');
    if(estado==='completada')  title.textContent='💎 EXCAVACIÓN COMPLETADA';
    else if(estado==='extraccion') title.textContent=netChange>=0?'💰 RETIRO PARCIAL':'📉 RETIRO MÍNIMO';
    else title.textContent='💣 EXPLOSIÓN DETECTADA';
  }

  const rows=[];
  rows.push({l:'MODO', v:SES.mode==='bet'?'APOSTANDO':'GRATIS', cls:''});
  rows.push({l:'DIFICULTAD', v:dcfg.icon+' '+dcfg.label, cls:''});
  rows.push({l:'CELDAS DESCUBIERTAS', v:SES.cellsRevealed+'/'+SES.totalSafe, cls:''});
  rows.push({l:'RADARES USADOS', v:SES.radarsUsed, cls:''});
  
  // ORO recaudado: se suma siempre (gane o pierda)
  const oroRecaudado = BOARD.revealedCount || 0;
  if(oroRecaudado > 0) {
    rows.push({l:'ORO RECAUDADO', v:oroRecaudado+' ORO', cls:'rs-gold'});
  }
  
  // En modo gratis: mostrar TRR recompensa (solo si ganó)
  if(SES.mode==='free') {
    if(estado==='completada') {
      rows.push({l:'RECOMPENSA TRR', v:'+'+trrGanado+' TRR', cls:'rs-gold'});
    }
  }
  
  // En modo apuesta: mostrar presupuesto y ganancia TRR
  if(SES.mode==='bet'){
    rows.push({l:'PRESUPUESTO INICIAL', v:SES.initialBudget+' TRR', cls:''});
    if(estado==='completada') rows.push({l:'GANANCIA ('+Math.round(dcfg.mult*100)+'%)', v:'+'+Math.round(SES.initialBudget*dcfg.mult)+' TRR', cls:'rs-gold'});
    if(SES.savedGains>0&&estado!=='completada') rows.push({l:'CHECKPOINT GUARDADO', v:SES.savedGains+' TRR', cls:'rs-gold'});
  }
  rows.push({l:'BALANCE TRR FINAL', v:GS.cft.toFixed(0)+' TRR', cls:'rs-total'});

  setHTML('resultStats', rows.map(r=>`<div class="rs ${r.cls}"><span class="rs-lbl">${r.l}</span><span class="rs-val">${r.v}</span></div>`).join(''));
  showScreen('result');
}

/* ═══════════════════════
   HUD
═══════════════════════ */
function updateHUD(){
  const dcfg=DIFFICULTIES[SES.diff||'easy'];
  const flaggedCount=BOARD.grid.flat?.()?.filter(c=>c.flagged).length||0;
  const minesLeft=BOARD.mines-flaggedCount;
  setText('hudMines', minesLeft);
  setText('hudRevealed', BOARD.revealedCount+'/'+(SES.totalSafe||0));
  const pct=SES.totalSafe>0?Math.round(BOARD.revealedCount/SES.totalSafe*100):0;
  setText('hudPct', pct+'%');
  const fill=$('progressFill');
  if(fill) fill.style.width=pct+'%';
  
  // Calcular oro dinámico
  let displayGold = SES.currentGold;
  if(SES.mode==='free') {
    // En gratis: oro = celdas descubiertas (el oro es progresivo)
    displayGold = BOARD.revealedCount;
  } else {
    // En apuesta: oro = presupuesto - (minas encontradas * costo)
    // O simplemente mostrar el currentGold
    displayGold = SES.currentGold;
  }
  setText('hudGold', Math.round(displayGold));
  setText('hudSaved', SES.savedGains>0?SES.savedGains:'—');
const radarsActuales = SES.mode==='bet' ? GS.radarsApuesta : GS.radarsGratis;
setText('hudRadars', radarsActuales);
setText('radarCostDisplay', '('+radarsActuales+')');
  // Menu info
  const mi=$('menuInfo');
  if(mi) mi.innerHTML=`Modo: <span>${SES.mode==='bet'?'APUESTA':'GRATIS'}</span><br>Guardado: <span>${SES.savedGains} TRR</span><br>Checkpoints: <span>${SES.checkpointsDone.length}/3</span><br>Radares: <span>${GS.radars===999?'∞':GS.radars}</span>`;
}

/* ═══════════════════════
   SCREENS
═══════════════════════ */
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const sc=$(name+'Screen'); if(sc) sc.classList.add('active');
}

/* ═══════════════════════
   MENU
═══════════════════════ */
$('menuToggle').addEventListener('click',()=>$('ingameMenu').classList.toggle('open'));
function closeMenu(){ $('ingameMenu').classList.remove('open'); }
$('menuExitBtn').addEventListener('click',()=>{
  closeMenu();
  BOARD.gameOver=true;
  endGame(false);
});

/* ═══════════════════════
   RESULT BUTTONS
═══════════════════════ */
$('retryBtn').addEventListener('click',async()=>{
  if(!GS.hasLives){ cdToastFallback('Sin partidas · Comprá más vidas','err'); return; }
  if(_mode==='bet'){
    if(GS.cft<_bet){ cdToastFallback('Balance TRR insuficiente','err'); return; }
    if(_bet<ECO.MIN_BET||_bet>ECO.MAX_BET){ cdToastFallback('Presupuesto fuera de rango','err'); return; }
  }
  showScreen('loading');
  const partida_id = typeof bombIniciarPartida==='function'
    ? await bombIniciarPartida(_mode, _diff, _mode==='bet'?_bet:0)
    : null;
  const dcfg = DIFFICULTIES[_diff];
  SES={
    mode:_mode, diff:_diff,
    initialBudget:_mode==='bet'?_bet:0,
    currentGold:_mode==='bet'?_bet:dcfg.reward,
    savedGains:0, checkpointsDone:[],
    radarsUsed:0, cellsRevealed:0, totalSafe:0, won:false,
    partida_id,
  };
  await delay(400);
  initGame(); showScreen('game'); updateHUD();
});
$('menuBtn').addEventListener('click',()=>{ showScreen('lobby'); updateLobby(); });

/* ═══════════════════════
   SHOP
═══════════════════════ */
function openShop(){
    setText('shopBalDisplay', GS.cft.toFixed(0)+' TRR');
    const grid=$('shopGrid'); if(!grid) return;
    grid.innerHTML='';
    RADAR_SHOP_ITEMS.forEach(item=>{
        const canAfford = GS.cft >= item.cost;
        const card=document.createElement('div');
        card.className='shop-item';
        card.innerHTML=`
            <div class="shop-emoji">${item.emoji}</div>
            <div class="shop-name">${item.name}</div>
            <div class="shop-desc">${item.desc}</div>
            <div class="shop-price">💎 ${item.cost} TRR</div>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(200,146,42,0.15);">
                <div style="font-size:8px;color:var(--stone-lt);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Tus radares</div>
                <div style="font-size:18px;font-weight:700;color:var(--ore-lt);">
    ${item.mode === 'bet' ? GS.radarsApuesta : GS.radarsGratis}
</div>
            </div>
            <button 
                style="margin-top:10px;width:100%;padding:8px;border-radius:6px;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;cursor:${canAfford?'pointer':'not-allowed'};
                background:${canAfford?'rgba(200,146,42,0.12)':'rgba(107,90,74,0.1)'};
                border:2px solid ${canAfford?'rgba(200,146,42,0.4)':'rgba(107,90,74,0.2)'};
                color:${canAfford?'var(--gold-lt)':'var(--stone-lt)'};"
                onclick="${canAfford?`bombComprarPack('${item.key}')`:'void(0)'}"
                ${canAfford?'':'disabled'}
            >${canAfford?'COMPRAR':'SIN SALDO'}</button>
        `;
        grid.appendChild(card);
    });
    $('shopModal').classList.add('open');
}
function closeShop(){ $('shopModal').classList.remove('open'); }
function buyRadarPack(item){
  if(GS.cft<item.cost){ cdToastFallback('Saldo insuficiente','err'); return; }
  GS.cft-=item.cost;
  GS.radars = item.gives===999 ? 999 : GS.radars+item.gives;
  GS.save();
  cdToastFallback(`✓ ${item.emoji} ${item.name} adquirido`,'ok');
  setText('shopBalDisplay', GS.cft.toFixed(0)+' TRR');
  updateLobby(); updateHUD();
}
$('shopBtnLobby').addEventListener('click', openShop);
$('shopModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeShop(); });

/* ═══════════════════════
   RANKING (local fallback)
═══════════════════════ */
function rankKey(){ const d=new Date(); return `cdDigRank_${d.getFullYear()}-${d.getMonth()+1}`; }
function getRanking(){ try{const r=localStorage.getItem(rankKey());return r?JSON.parse(r):[]}catch(_){return[];} }
function saveRanking(l){ localStorage.setItem(rankKey(),JSON.stringify(l)); }
function submitRankingScore(name,wins,cft){
  const list=getRanking(),idx=list.findIndex(x=>x.name===name);
  if(idx>=0){if(wins>list[idx].wins){list[idx].wins=wins;list[idx].cft=cft;}}
  else list.push({name,wins,cft});
  list.sort((a,b)=>b.wins-a.wins||b.cft-a.cft);
  saveRanking(list.slice(0,50));
}
function openRanking(){
  $('rankingModal').classList.add('open');
  const pod=$('rankingPodium');
  if(pod) pod.innerHTML='<div style="color:var(--stone-lt);font-size:9px;text-align:center;width:100%;padding:20px">⏳ Cargando...</div>';
  if(typeof bombCargarRanking==='function') bombCargarRanking();
  else renderLocalRanking();
}
function renderLocalRanking(){
  const list=getRanking();
  const pod=$('rankingPodium'); if(!pod) return;
  pod.innerHTML='';
  const order=[1,0,2], meta=[
    {cls:'second',e:'🥈',l:'2°'},{cls:'first',e:'🥇',l:'1°'},{cls:'third',e:'🥉',l:'3°'}
  ];
  order.forEach((idx,vi)=>{
    const en=list[idx],pd=meta[vi];
    const sl=document.createElement('div'); sl.className='podium-slot';
    sl.innerHTML=`<div style="font-size:17px">${pd.e}</div>
      <div class="podium-name">${en?en.name:'---'}</div>
      <div class="podium-score">${en?en.wins+' wins':'---'}</div>
      <div class="podium-bar ${pd.cls}">${pd.l}</div>`;
    pod.appendChild(sl);
  });
  const tbl=$('rankingTable'); if(!tbl) return;
  tbl.innerHTML='';
  list.slice(3,10).forEach((en,i)=>{
    const row=document.createElement('div'); row.className='rank-row';
    row.innerHTML=`<span class="rank-num">${i+4}°</span><span class="rank-name">${en.name}</span><span class="rank-pts">${en.wins} wins</span><span class="rank-prize">${en.cft} TRR</span>`;
    tbl.appendChild(row);
  });
}
function closeRanking(){ $('rankingModal').classList.remove('open'); }
$('rankingBtn').addEventListener('click', openRanking);
$('rankingModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeRanking(); });

/* ═══════════════════════
   WALLET
═══════════════════════ */
let _wdInt=null;
function openWallet(tab='deposit'){ switchWT(tab); updateWalletDisplay(); $('walletModal').classList.add('open'); }
function closeWallet(){ $('walletModal').classList.remove('open'); if(_wdInt) clearInterval(_wdInt); }
function switchWT(tab){
  document.querySelectorAll('.wallet-tab').forEach(t=>t.classList.toggle('active',t.dataset.wtab===tab));
  $('wpDep').classList.toggle('active',tab==='deposit');
  $('wpWd').classList.toggle('active',tab==='withdraw');
  if(tab==='withdraw') updateWd(); else updateDep();
}
function updateWalletDisplay(){
  const s=typeof GS.cftSocial==='number'?GS.cftSocial:0;
  const j=typeof GS.cft==='number'?GS.cft:0;
  setText('wCftBal',s.toFixed(2)+' CFT');
  setText('depCur',s.toFixed(2)+' CFT');
  setText('wdCur',j.toFixed(0)+' TRR');
  setText('lbPoints',j.toFixed(0)+' TRR');
}
function updateDep(){
  const v=parseFloat(($('depAmt')||{}).value)||0;
  const s=typeof GS.cftSocial==='number'?GS.cftSocial:0;
  setText('depCur',s.toFixed(2)+' CFT');
  setText('depAfter',(GS.cft+Math.floor(v)).toFixed(0)+' TRR');
  const b=$('depBtn'); if(b) b.disabled=v<1||v>s;
}
function doDeposit(){
  const v=parseFloat(($('depAmt')||{}).value)||0; if(v<1) return;
  const msg=$('depMsg');
  if(msg){msg.className='wmsg ok';msg.textContent=`✓ +${v.toFixed(2)} CFT acreditados`;}
  $('depAmt').value=''; updateWalletDisplay(); updateDep(); updateLobby();
}
function updateWd(){
  const amt=parseFloat(($('wdAmt')||{}).value)||0;
  const balance=typeof GS.cft==='number'?GS.cft:0;
  const btn=$('wdBtn'),msg=$('wdMsg'),cd=$('wdCdBlock'),fb=$('wdFormBlock');
  if(msg){msg.className='wmsg';msg.textContent='';}
  if(btn) btn.disabled=true;
  setText('wdCur',balance.toFixed(0)+' TRR');
  setText('wdAfter',Math.max(0,balance-amt).toFixed(0)+' TRR');
  if(!GS.canWithdraw){
    if(fb){fb.style.opacity='.4';fb.style.pointerEvents='none';}
    if(cd) cd.style.display='block';
    if(_wdInt) clearInterval(_wdInt);
    const tick=()=>{
      const ms=GS.timeUntilWithdraw;
      if(ms<=0){clearInterval(_wdInt);updateWd();return;}
      const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
      setText('wdTimer',`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick(); _wdInt=setInterval(tick,1000); return;
  }
  if(cd) cd.style.display='none';
  if(fb){fb.style.opacity='1';fb.style.pointerEvents='auto';}
  if(amt<ECO.WITHDRAW_MIN){ if(amt>0&&msg){msg.className='wmsg err';msg.textContent=`Mínimo: ${ECO.WITHDRAW_MIN} TRR`;} }
  else if(amt>GS.cft){ if(msg){msg.className='wmsg err';msg.textContent='Puntos insuficientes';} }
  else { if(btn) btn.disabled=false; if(msg){msg.className='wmsg warn';msg.textContent='⚠ Solo 1 retiro por 24hs';} }
}
function doWithdraw(){
  const amt=parseFloat(($('wdAmt')||{}).value)||0;
  if(amt<ECO.WITHDRAW_MIN||amt>GS.cft||!GS.canWithdraw) return;
  GS.cft-=amt; GS.lastWithdraw=Date.now(); GS.save();
  const msg=$('wdMsg');
  if(msg){msg.className='wmsg ok';msg.textContent=`✓ ${amt.toFixed(2)} CFT retirados`;}
  $('wdAmt').value=''; updateWalletDisplay(); updateWd(); updateLobby();
}
$('walletBtn').addEventListener('click',()=>openWallet('deposit'));
$('walletModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeWallet(); });

/* ═══════════════════════
   TOAST FALLBACK
═══════════════════════ */
function cdToastFallback(msg,tipo='ok'){
  if(typeof cdToast==='function'){ cdToast(msg,tipo); return; }
  if(!document.getElementById('cdToastStyle')){
    const s=document.createElement('style');
    s.id='cdToastStyle';
    s.textContent=`
      @keyframes cdFadeInOut{0%{opacity:0;top:36px}12%{opacity:1;top:24px}75%{opacity:1;top:24px}100%{opacity:0;top:12px}}
      .cd-toast{position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:99999;padding:11px 22px;border-radius:8px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;pointer-events:none;white-space:nowrap;animation:cdFadeInOut 3s ease forwards}
      .cd-toast-ok{background:rgba(74,124,63,.15);border:2px solid #6aab5f;color:#6aab5f}
      .cd-toast-err{background:rgba(139,32,32,.15);border:2px solid #c43030;color:#c43030}
      .cd-toast-warn{background:rgba(200,146,42,.12);border:2px solid #c8922a;color:#e8b84b}
    `;
    document.head.appendChild(s);
  }
  const t=document.createElement('div');
  t.className=`cd-toast cd-toast-${tipo}`;
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3100);
}

/* ═══════════════════════
   HELPERS
═══════════════════════ */
function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

/* ═══════════════════════
   INIT
═══════════════════════ */
window.addEventListener('DOMContentLoaded',()=>{
  console.log('[INIT] DOMContentLoaded - Inicializando listeners');
  
  // Debug: verificar si existen los elementos
  const betOpts = document.querySelectorAll('.bet-opt');
  console.log('[DEBUG] Elementos .bet-opt encontrados:', betOpts.length);
  betOpts.forEach((o, i) => {
    console.log('[DEBUG] Preset', i, '- data-bet:', o.dataset.bet, 'Texto:', o.textContent);
  });
  
  setMode('free');
  setDiff('easy');
  // Desseleccionar todos los presets al iniciar
  document.querySelectorAll('.bet-opt').forEach(o=>o.classList.remove('selected'));
  
  // Listeners de presets de apuesta
  console.log('[BET] Asignando listeners a presets');
  document.querySelectorAll('.bet-opt').forEach(o=>{
    console.log('[BET] Asignando listener a preset:', o.dataset.bet);
    o.addEventListener('click',function(){
      const val = parseInt(this.dataset.bet);
      console.log('[BET] Clickeado preset:', val, 'Este:', this.dataset.bet);
      setBet(val);
    });
  });
  
  const customInput = $('betCustom');
  console.log('[BET] betCustom encontrado:', !!customInput);
  if(customInput) {
    customInput.addEventListener('input', e=>{
      const v=parseInt(e.target.value);
      console.log('[BET] Input personalizado:', v);
      if(!isNaN(v)&&v>=ECO.MIN_BET&&v<=ECO.MAX_BET){ 
        _bet=v; 
        console.log('[BET] Bet actualizado a:', _bet);
        document.querySelectorAll('.bet-opt').forEach(o=>o.classList.remove('selected')); 
        updateLobby(); 
      }
    });
  }
  
  updateLobby();
  console.log('[INIT] Listeners iniciados. _bet inicial:', _bet);
});

window.addEventListener('resize',()=>{
  if($('gameScreen').classList.contains('active')) renderBoard();
});

// Expose for api.js bridge compatibility
window.GS = GS;
window.SES = SES;
window.updateLobby = updateLobby;
window.updateWalletDisplay = updateWalletDisplay;
window.updateWd = updateWd;
window.openShop = openShop;
window.closeShop = closeShop;
window.openRanking = openRanking;
</script>

<script src="/play/apibomb/apibomb.js"></script>
<script src="/play/apibomb/fix_oro_sync.js"></script> 

</body>
</html>