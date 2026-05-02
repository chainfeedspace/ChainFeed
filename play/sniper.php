<?php
session_start([
    'cookie_lifetime' => 86400,
    'cookie_secure'   => true,
    'cookie_httponly' => true,
    'use_strict_mode' => true,
    'cookie_samesite' => 'Lax',
]);
$login_method = $_SESSION['login_method'] ?? 'wallet';
$has_uid      = isset($_SESSION['user_id']);
$has_cred     = $login_method === 'email'
    ? isset($_SESSION['email'])
    : isset($_SESSION['wallet_address']);
if (!$has_uid || !$has_cred) {
    header('Location: https://chainfeed.space/');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CHAIN SNIPER</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
:root{
  --dirt:#1a1208;--mud:#2d2010;--moss:#1e2e14;--leaf:#2a4a1a;
  --olive:#4a5e2a;--khaki:#8a9a5a;--fog:#a0a870;
  --warn:#c8a020;--danger:#b03010;--safe:#40a840;
  --hud:#0a0e06;--hudBorder:rgba(140,160,80,.25);
}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;overflow:hidden;background:var(--dirt);
  font-family:'Share Tech Mono',monospace;cursor:none;user-select:none;}
canvas{display:block;position:fixed;inset:0;}

/* ─── SCREENS ─── */
.screen{position:fixed;inset:0;opacity:0;pointer-events:none;transition:opacity .35s;z-index:10;}
.screen.active{opacity:1;pointer-events:auto;}

/* ─── LOBBY ─── */
#lobbyScreen{
  display:flex;align-items:center;justify-content:center;
  background:
    repeating-linear-gradient(45deg,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 2px,transparent 0,transparent 50%),
    repeating-linear-gradient(-45deg,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 2px,transparent 0,transparent 50%),
    linear-gradient(160deg,#0d1a08,#1a2a0e,#0a1206);
  background-size:24px 24px,24px 24px,100% 100%;
  overflow-y:auto;cursor:default;
}
.lobby-wrap{max-width:500px;width:94%;padding:28px 0;}

.game-logo{margin-bottom:22px;}
.logo-tag{font-family:'Oswald',sans-serif;font-size:9px;letter-spacing:5px;color:var(--khaki);text-transform:uppercase;margin-bottom:4px;opacity:.7;}
.logo-title{font-family:'Oswald',sans-serif;font-size:58px;font-weight:700;line-height:.9;color:var(--khaki);text-transform:uppercase;text-shadow:3px 3px 0 rgba(0,0,0,.6),0 0 40px rgba(100,130,50,.2);letter-spacing:2px;}
.logo-title span{color:var(--warn);text-shadow:2px 2px 0 rgba(0,0,0,.6);}
.logo-sub{font-size:10px;color:var(--olive);letter-spacing:3px;text-transform:uppercase;margin-top:6px;border-left:3px solid var(--warn);padding-left:10px;}

.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:16px;}
.sbox{background:rgba(0,0,0,.4);border:1px solid var(--hudBorder);padding:10px 6px;text-align:center;position:relative;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%);}
.sbox::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--olive);opacity:.4;}
.slabel{font-size:8px;color:var(--khaki);letter-spacing:1px;text-transform:uppercase;opacity:.6;}
.sval{font-size:18px;font-weight:700;color:var(--warn);font-family:'Oswald',sans-serif;margin-top:2px;}

.panel{background:rgba(5,10,3,.7);border:1px solid var(--hudBorder);padding:16px;margin-bottom:12px;position:relative;}
.panel::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--olive),transparent);opacity:.3;}
.panel-title{font-size:9px;letter-spacing:3px;color:var(--fog);text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.panel-title::before{content:'▶';color:var(--warn);font-size:8px;}

.mode-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}
.mode-btn{padding:10px;border:1px solid rgba(140,160,80,.3);background:rgba(0,0,0,.4);color:rgba(140,160,80,.4);font-family:'Oswald',sans-serif;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .2s;clip-path:polygon(0 0,calc(100%-6px) 0,100% 6px,100% 100%,0 100%);}
.mode-btn.af{border-color:var(--safe);color:var(--safe);background:rgba(40,80,40,.3);}
.mode-btn.ab{border-color:var(--warn);color:var(--warn);background:rgba(80,60,10,.3);}

.bet-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px;}
.bopt{padding:8px 4px;background:rgba(0,0,0,.4);border:1px solid rgba(140,160,80,.2);color:rgba(140,160,80,.5);font-family:'Share Tech Mono',monospace;font-size:9px;text-align:center;cursor:pointer;transition:all .2s;}
.bopt:hover,.bopt.sel{border-color:var(--warn);color:var(--warn);background:rgba(80,60,10,.35);}
.bet-input{background:rgba(0,0,0,.6);border:1px solid rgba(140,160,80,.3);border-bottom-color:var(--olive);padding:8px 10px;color:var(--warn);font-family:'Share Tech Mono',monospace;font-size:11px;width:100%;margin-bottom:8px;}
.bet-input:focus{outline:none;border-color:var(--warn);}

.btn{padding:11px 14px;border:none;font-family:'Oswald',sans-serif;font-weight:600;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:all .25s;width:100%;margin-top:8px;position:relative;}
.btn-primary{background:var(--warn);color:#0a0e06;clip-path:polygon(0 0,calc(100%-10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100%-10px));}
.btn-primary:hover{background:#e0b828;transform:translateY(-1px);}
.btn-primary:disabled{background:rgba(100,80,20,.3);color:rgba(140,160,80,.3);cursor:not-allowed;transform:none;}
.btn-sec{background:transparent;border:1px solid var(--hudBorder);color:var(--khaki);}
.btn-sec:hover{border-color:var(--olive);background:rgba(40,60,20,.3);}
.btn-safe{background:transparent;border:1px solid rgba(40,120,40,.5);color:var(--safe);}
.btn-safe:hover{background:rgba(20,60,20,.3);}

/* ─── GAME HUD ─── */
.hud-top{position:fixed;top:0;left:0;right:0;height:44px;background:rgba(5,8,3,.92);border-bottom:1px solid var(--hudBorder);z-index:50;pointer-events:none;display:flex;align-items:center;padding:0 14px;gap:12px;}
.hud-sep{width:1px;height:24px;background:var(--hudBorder);}
.hi{display:flex;flex-direction:column;align-items:center;min-width:46px;}
.hi-l{font-size:7px;color:var(--khaki);letter-spacing:1px;text-transform:uppercase;opacity:.5;}
.hi-v{font-size:14px;font-weight:700;color:var(--warn);font-family:'Oswald',sans-serif;}
.hi-v.g{color:var(--safe);}
.hi-v.r{color:var(--danger);}
.hi-v.w{color:#fff;}
.hud-lives{display:flex;gap:3px;align-items:center;}
.life-pip{width:10px;height:10px;background:var(--danger);clip-path:polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%);}
.life-pip.dead{background:rgba(80,30,10,.4);}

.hud-errores{display:flex;gap:4px;align-items:center;}
.error-pip{width:7px;height:7px;border-radius:50%;background:rgba(140,160,80,.15);border:1px solid rgba(140,160,80,.2);transition:all .2s;}
.error-pip.active{background:var(--danger);border-color:var(--danger);box-shadow:0 0 4px var(--danger);}

.wave-tag{background:rgba(0,0,0,.5);border:1px solid var(--hudBorder);padding:3px 10px;font-size:8px;color:var(--khaki);letter-spacing:2px;text-transform:uppercase;margin-left:auto;}
.wave-tag.boss{border-color:var(--danger);color:var(--danger);animation:blink .7s ease infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.5}}

/* ─── TIMER ─── */
.timer-wrap{position:fixed;top:44px;left:0;right:0;height:4px;background:rgba(0,0,0,.5);z-index:50;}
.timer-fill{height:100%;background:var(--safe);transition:width .15s linear;}
.timer-fill.warn{background:var(--warn);}
.timer-fill.danger{background:var(--danger);}

/* ─── WAVE ANNOUNCEMENT ─── */
.wave-ann{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:80;text-align:center;pointer-events:none;opacity:0;transition:opacity .3s;}
.wave-ann.show{opacity:1;}
.wave-num{font-family:'Oswald',sans-serif;font-size:80px;font-weight:700;color:var(--khaki);line-height:1;text-transform:uppercase;letter-spacing:-2px;text-shadow:4px 4px 0 rgba(0,0,0,.8);}
.wave-num.boss{color:var(--danger);}
.wave-label{font-size:11px;letter-spacing:6px;color:var(--fog);text-transform:uppercase;margin-top:4px;}
.wave-sub{font-size:9px;color:var(--olive);letter-spacing:3px;margin-top:6px;border-top:1px solid rgba(140,160,80,.2);padding-top:6px;}

/* ─── KILL FEED ─── */
.kill-feed{position:fixed;top:56px;right:10px;z-index:50;display:flex;flex-direction:column;gap:3px;pointer-events:none;}
.kf-item{background:rgba(5,8,3,.85);border-left:3px solid var(--warn);padding:3px 8px;font-size:9px;color:var(--fog);opacity:1;transition:opacity .3s;white-space:nowrap;}
.kf-item.bad{border-left-color:var(--danger);color:var(--danger);}

/* ─── RESULT ─── */
#resultScreen{display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#060e04,#0d1a08);cursor:default;}
.result-wrap{max-width:440px;width:92%;background:rgba(5,10,3,.95);border:1px solid var(--hudBorder);padding:28px;position:relative;}
.result-wrap::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--warn),transparent);}
.result-wrap.win::before{background:linear-gradient(90deg,transparent,var(--safe),transparent);}
.result-status{font-family:'Oswald',sans-serif;font-size:11px;letter-spacing:5px;color:var(--khaki);opacity:.6;text-transform:uppercase;margin-bottom:4px;}
.result-title{font-family:'Oswald',sans-serif;font-size:36px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:20px;}
.result-title.win{color:var(--safe);}
.result-title.lose{color:var(--danger);}
.rs{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(140,160,80,.1);font-size:10px;}
.rs-l{color:var(--khaki);opacity:.6;text-transform:uppercase;letter-spacing:1px;}
.rs-v{color:var(--fog);font-weight:700;}
.rs-v.hi{color:var(--warn);}
.rs-v.win{color:var(--safe);}
.rs-v.lose{color:var(--danger);}
.result-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:20px;}

/* ─── LOADING ─── */
#loadingScreen{display:flex;flex-direction:column;align-items:center;justify-content:center;background:#060e04;}
.load-bar-wrap{width:220px;height:3px;background:rgba(140,160,80,.1);margin-top:20px;}
.load-bar{height:100%;background:var(--warn);animation:loadAnim 1.2s ease-in-out infinite;}
@keyframes loadAnim{0%{width:0%}100%{width:100%}}
.load-label{font-size:10px;color:var(--olive);letter-spacing:3px;text-transform:uppercase;margin-top:12px;}

/* ─── MODAL ─── */
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s;cursor:default;}
.modal-ov.open{opacity:1;pointer-events:auto;}
.modal-box{background:#080e05;border:1px solid var(--hudBorder);padding:22px;max-width:420px;width:92%;position:relative;max-height:90vh;overflow-y:auto;}
.modal-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--olive),transparent);}
.modal-close{position:absolute;top:10px;right:10px;background:none;border:none;color:var(--khaki);font-size:16px;cursor:pointer;opacity:.5;}
.modal-close:hover{opacity:1;color:var(--danger);}
.modal-title{font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;color:var(--warn);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;}
.modal-sub{font-size:9px;color:var(--khaki);opacity:.5;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;}

/* ─── WALLET ─── */
.w-tabs{display:flex;border-bottom:1px solid var(--hudBorder);margin-bottom:14px;}
.w-tab{flex:1;padding:8px;background:none;border:none;color:rgba(140,160,80,.35);font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .2s;}
.w-tab.active{color:var(--warn);border-bottom-color:var(--warn);}
.w-panel{display:none;flex-direction:column;gap:10px;}
.w-panel.active{display:flex;}
.w-row{display:flex;justify-content:space-between;font-size:9px;padding:4px 0;border-bottom:1px solid rgba(140,160,80,.08);}
.w-row span{color:var(--warn);}
.w-lbl{font-size:8px;color:var(--khaki);opacity:.5;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
.w-input{background:rgba(0,0,0,.6);border:none;border-bottom:1px solid var(--olive);padding:7px 8px;color:var(--warn);font-family:'Share Tech Mono',monospace;font-size:12px;width:100%;text-align:right;}
.w-input:focus{outline:none;border-bottom-color:var(--warn);}
.wmsg{font-size:9px;padding:6px;min-height:26px;text-align:center;letter-spacing:1px;}
.wmsg.ok{color:var(--safe);border-left:2px solid var(--safe);background:rgba(40,80,40,.15);}
.wmsg.err{color:var(--danger);border-left:2px solid var(--danger);background:rgba(100,20,10,.15);}
.wmsg.warn{color:var(--warn);border-left:2px solid var(--warn);background:rgba(80,60,10,.15);}
.w-btn{width:100%;padding:10px;font-family:'Oswald',sans-serif;font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;cursor:pointer;border:1px solid;transition:all .2s;}
.w-dep{border-color:var(--safe);color:var(--safe);background:rgba(20,60,20,.2);}
.w-dep:hover:not(:disabled){background:rgba(40,100,40,.3);}
.w-wd{border-color:var(--warn);color:var(--warn);background:rgba(60,40,5,.2);}
.w-wd:hover:not(:disabled){background:rgba(80,60,10,.3);}
.w-btn:disabled{opacity:.25;cursor:not-allowed;}
.cd-block{background:rgba(0,0,0,.4);border:1px solid rgba(140,160,80,.15);padding:10px;text-align:center;}
.cd-label{font-size:8px;color:var(--khaki);opacity:.5;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;}
.cd-timer{font-family:'Oswald',sans-serif;font-size:24px;color:var(--warn);}

/* ─── RANKING ─── */
.podium{display:flex;justify-content:center;align-items:flex-end;gap:6px;margin-bottom:16px;}
.p-slot{display:flex;flex-direction:column;align-items:center;gap:2px;}
.p-name{font-size:8px;color:var(--fog);text-transform:uppercase;max-width:70px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;text-align:center;}
.p-score{font-size:7px;color:var(--khaki);opacity:.6;}
.p-bar{border-top:2px solid;display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-size:14px;font-weight:700;width:66px;}
.p-bar.first{height:64px;border-color:var(--warn);color:var(--warn);background:rgba(100,80,10,.2);}
.p-bar.second{height:44px;border-color:var(--khaki);color:var(--khaki);background:rgba(80,80,50,.15);}
.p-bar.third{height:28px;border-color:var(--olive);color:var(--olive);background:rgba(50,70,20,.15);}
.rank-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid rgba(140,160,80,.08);font-size:9px;}
.rank-row img{flex-shrink:0;}
.rank-n{color:var(--khaki);opacity:.5;min-width:20px;}
.rank-name{flex:1;color:var(--fog);text-transform:uppercase;}
.rank-w{color:var(--khaki);min-width:40px;}
.rank-pts{color:var(--warn);min-width:60px;text-align:right;}
.my-row{background:rgba(100,80,10,.1);border-left:2px solid var(--warn);}

::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:rgba(0,0,0,.2);}
::-webkit-scrollbar-thumb{background:var(--olive);}

/* ─── MERCADO MODAL ─── */
.market-modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:100;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;}
.market-modal-ov.open{opacity:1;pointer-events:auto;}
.market-modal-box{background:linear-gradient(160deg,#0d1a08,#0a1206);border:1px solid var(--hudBorder);padding:24px;max-width:420px;width:92%;max-height:90vh;overflow-y:auto;position:relative;}
.market-modal-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--warn),transparent);}

/* ─── MERCADO ─── */
.market-grid{display:flex;flex-direction:column;gap:8px;margin-top:4px;}
.upg-card{background:rgba(5,10,3,.6);border:1px solid var(--hudBorder);padding:12px 14px;display:flex;align-items:center;gap:12px;position:relative;transition:border-color .2s;}
.upg-card.owned{border-color:var(--safe);opacity:.7;}
.upg-card.available{border-color:var(--warn);cursor:pointer;}
.upg-card.available:hover{background:rgba(20,40,10,.5);}
.upg-card.locked{opacity:.35;cursor:not-allowed;}
.upg-icon{font-size:22px;min-width:28px;text-align:center;}
.upg-info{flex:1;}
.upg-name{font-family:'Oswald',sans-serif;font-size:13px;color:var(--fog);text-transform:uppercase;letter-spacing:1px;}
.upg-desc{font-size:8px;color:var(--khaki);opacity:.6;margin-top:2px;letter-spacing:1px;}
.upg-price{font-family:'Oswald',sans-serif;font-size:13px;color:var(--warn);min-width:70px;text-align:right;}
.upg-price.owned{color:var(--safe);}
.upg-badge{position:absolute;top:4px;right:4px;font-size:7px;letter-spacing:2px;padding:2px 5px;background:rgba(40,80,20,.4);color:var(--safe);border:1px solid var(--safe);}

/* ─── PANTALLA VICTORIA FINAL ─── */
#victoryScreen{display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:radial-gradient(ellipse at center,#1a2e08 0%,#0a1206 60%,#060e04 100%);
  text-align:center;padding:30px 20px;overflow-y:auto;}
.vict-tag{font-size:8px;letter-spacing:6px;color:var(--olive);text-transform:uppercase;margin-bottom:10px;opacity:.7;}
.vict-title{font-family:'Oswald',sans-serif;font-size:52px;font-weight:700;color:var(--warn);
  text-transform:uppercase;line-height:1;text-shadow:0 0 40px rgba(200,160,32,.4);margin-bottom:6px;}
.vict-sub{font-size:11px;letter-spacing:3px;color:var(--fog);text-transform:uppercase;margin-bottom:28px;opacity:.7;}
.vict-stars{font-size:36px;margin-bottom:20px;animation:starPulse 2s ease-in-out infinite;}
@keyframes starPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.1)}}
.vict-stats{background:rgba(0,0,0,.4);border:1px solid var(--hudBorder);padding:16px 20px;
  max-width:340px;width:100%;margin-bottom:20px;position:relative;}
.vict-stats::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--warn),transparent);}
.vict-oro{font-family:'Oswald',sans-serif;font-size:36px;color:#f0c040;margin:10px 0 4px;}
.vict-oro-lbl{font-size:8px;letter-spacing:3px;color:var(--khaki);opacity:.5;text-transform:uppercase;}

/* ─── MODAL TOAST (reemplaza alert) ─── */
.toast-ov{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:300;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s;}
.toast-ov.open{opacity:1;pointer-events:auto;}
.toast-box{background:#080e05;border:1px solid var(--hudBorder);padding:24px 22px;max-width:360px;width:92%;position:relative;text-align:center;}
.toast-box.warn{border-color:var(--warn);}
.toast-box.warn::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--warn),transparent);}
.toast-box.danger{border-color:var(--danger);}
.toast-box.danger::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--danger),transparent);}
.toast-icon{font-size:28px;margin-bottom:8px;}
.toast-title{font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;}
.toast-box.warn .toast-title{color:var(--warn);}
.toast-box.danger .toast-title{color:var(--danger);}
.toast-msg{font-size:9px;color:var(--khaki);line-height:1.9;letter-spacing:1px;margin-bottom:16px;opacity:.8;}
.toast-btns{display:flex;flex-direction:column;gap:6px;}
.toast-btn{padding:10px;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;cursor:pointer;text-transform:uppercase;border:1px solid;background:transparent;}
.toast-btn.primary{border-color:var(--warn);color:var(--warn);}
.toast-btn.primary:hover{background:rgba(100,80,10,.3);}
.toast-btn.sec{border-color:rgba(140,160,80,.2);color:var(--khaki);opacity:.6;}
.toast-btn.sec:hover{opacity:1;}

/* ─── MENÚ PAUSA ─── */
.pause-btn{position:fixed;top:6px;right:10px;z-index:60;background:rgba(5,8,3,.85);border:1px solid var(--hudBorder);color:var(--khaki);font-family:'Share Tech Mono',monospace;font-size:11px;padding:5px 10px;cursor:pointer;letter-spacing:2px;pointer-events:auto;}
.pause-btn:hover{border-color:var(--olive);color:var(--fog);}
.pause-menu{position:fixed;top:44px;right:10px;z-index:60;background:rgba(5,10,3,.97);border:1px solid var(--hudBorder);min-width:160px;display:none;flex-direction:column;pointer-events:auto;}
.pause-menu.open{display:flex;}
.pause-menu::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--olive),transparent);}
.pm-item{padding:10px 16px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--khaki);cursor:pointer;border-bottom:1px solid rgba(140,160,80,.08);transition:all .15s;}
.pm-item:hover{background:rgba(40,60,20,.4);color:var(--fog);}
.pm-item.danger{color:var(--danger);}
.pm-item.danger:hover{background:rgba(80,20,10,.3);}

/* ─── MODAL GAME OVERS ─── */
.go-modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;}
.go-modal-ov.open{opacity:1;pointer-events:auto;}
.go-modal-box{background:linear-gradient(160deg,#0d1a08,#1a0a0a);border:1px solid var(--danger);padding:28px 24px;max-width:380px;width:92%;text-align:center;position:relative;}
.go-modal-box::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--danger),transparent);}
.go-modal-title{font-family:'Oswald',sans-serif;font-size:22px;font-weight:700;color:var(--danger);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;}
.go-modal-sub{font-size:9px;color:var(--khaki);letter-spacing:2px;opacity:.7;margin-bottom:16px;}
.go-modal-body{font-size:10px;color:var(--fog);line-height:2;margin-bottom:20px;}
.go-modal-timer{font-family:'Oswald',sans-serif;font-size:32px;color:var(--warn);margin:12px 0;}
.go-modal-btns{display:flex;flex-direction:column;gap:8px;}
.go-btn-pay{background:rgba(80,60,10,.4);border:1px solid var(--warn);color:var(--warn);padding:12px;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:2px;cursor:pointer;text-transform:uppercase;}
.go-btn-pay:hover{background:rgba(100,80,20,.5);}
.go-btn-wait{background:transparent;border:1px solid rgba(140,160,80,.2);color:var(--khaki);padding:10px;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;cursor:pointer;opacity:.6;}
</style>
</head>
<body>

<!-- ══ LOBBY ══ -->
<div id="lobbyScreen" class="screen active">
<div class="lobby-wrap">

  <div class="game-logo">
    <div class="logo-tag">// Operación táctica //</div>
    <div class="logo-title">CHAIN<br><span>SNIPER</span></div>
    <div class="logo-sub">Eliminar. Sobrevivir. Cobrar.</div>
  </div>

  <div class="stat-row">
    <div class="sbox"><div class="slabel">BALANCE</div><div class="sval" id="lbPts">0 PTS</div></div>
    <div class="sbox"><div class="slabel">MISIONES</div><div class="sval" id="lbGames">0</div></div>
    <div class="sbox"><div class="slabel">OL. MÁX</div><div class="sval" id="lbWave">0</div></div>
    <div class="sbox"><div class="slabel">ORO TOTAL</div><div class="sval" id="lbProfit">🪙 0</div></div>
  </div>

  <div class="panel">
    <div class="panel-title">BRIEFING</div>
    <div style="font-size:9px;color:var(--khaki);line-height:2.2;opacity:.8;">
      <div>🎯 Mové el mouse → apuntá · Click → disparar</div>
      <div>🪙 Eliminar objetivos → gana ORO (siempre se acumula)</div>
      <div>❌ 3 errores (fallo / señuelo / escapado) → −1 VIDA</div>
      <div>☠️ <b style="color:var(--danger)">SEÑUELO:</b> dispararle cuenta como error</div>
      <div>⭐ Boss cada 5 oleadas → completar da <b style="color:var(--warn)">+3 PTS</b></div>
      <div>🆓 <b style="color:var(--safe)">LIBRE:</b> sin riesgo — acumulá ORO y PTS</div>
      <div>💰 <b style="color:var(--warn)">OPERATIVO:</b> presupuesto PTS en juego</div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-title">MODO DE OPERACIÓN</div>
    <div class="mode-toggle">
      <button class="mode-btn af" id="modeFreeBtn" onclick="setMode('free')">LIBRE<br><span style="font-size:8px;opacity:.6">🪙 ORO sin riesgo</span></button>
      <button class="mode-btn"   id="modeBetBtn"  onclick="setMode('bet')">OPERATIVO<br><span style="font-size:8px;opacity:.6">PTS en juego</span></button>
    </div>
    <div id="betSection" style="display:none">
      <div style="font-size:8px;color:var(--khaki);opacity:.5;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">▶ PRESUPUESTO (mín. 100 PTS)</div>
      <div class="bet-opts">
        <div class="bopt sel" data-bet="100">100</div>
        <div class="bopt" data-bet="250">250</div>
        <div class="bopt" data-bet="500">500</div>
        <div class="bopt" data-bet="1000">1000</div>
      </div>
      <input type="number" class="bet-input" id="betCustom" placeholder="Personalizado..." min="100" step="10">
    </div>
    <div id="freeSection">
      <div style="background:rgba(20,50,20,.25);border-left:2px solid var(--safe);padding:10px;margin-bottom:8px;font-size:9px;color:var(--khaki);line-height:1.9;opacity:.8;">
        Sin riesgo — acumulá ORO en cada partida<br>Completar oleada boss da <b style="color:var(--warn)">+3 PTS</b> económicos
      </div>
    </div>
    <button class="btn btn-primary" id="playBtn">▶ INICIAR OPERACIÓN</button>
    <button class="btn btn-sec" id="rankingBtn" style="margin-top:6px;">TABLA DE ÉLITE</button>
    <button class="btn btn-safe" id="walletBtn" style="margin-top:6px;">WALLET · PTS / CFT</button>
    <button class="btn" id="marketBtn" style="margin-top:6px;background:rgba(30,50,10,.4);border-color:var(--warn);color:var(--warn);">🏪 MERCADO · MEJORAS</button>
    <button class="btn" id="exitBtn" style="margin-top:6px;background:rgba(80,20,10,.4);border-color:var(--danger);color:var(--danger);" onclick="salirDelJuego()">✕ SALIR A JUEGOS</button>
  </div>


<!-- ══ MERCADO MODAL ══ -->
<div class="market-modal-ov" id="marketPanel">
<div class="market-modal-box">
  <button class="modal-close" onclick="closeMarket()">✕</button>
  <div class="modal-title">🏪 MERCADO</div>
  <div class="modal-sub">MEJORAS DE EQUIPO</div>
  <div style="font-size:8px;color:var(--khaki);opacity:.6;margin-bottom:14px;line-height:1.9;">
    Cada mejora aumenta +10% de fuerza de disparo.<br>Deben comprarse en orden. Balance: <b id="marketPtsDisplay" style="color:var(--warn);">0 PTS</b>
  </div>
  <div class="market-grid" id="marketGrid"></div>
  <div style="margin-top:10px;font-size:8px;color:var(--olive);text-align:center;" id="marketMsg"></div>
</div>
</div>
</div>
</div>

<!-- ══ GAME ══ -->
<div id="gameScreen" class="screen">
  <canvas id="gameCanvas"></canvas>
  <div class="hud-top">
    <div class="hi"><div class="hi-l">OLEADA</div><div class="hi-v w" id="hudWave">—</div></div>
    <div class="hud-sep"></div>
    <div class="hi"><div class="hi-l">OBJETIVOS</div><div class="hi-v r" id="hudTargets">—</div></div>
    <div class="hud-sep"></div>
    <div class="hi"><div class="hi-l">ORO</div><div class="hi-v" id="hudPts">🪙 0</div></div>
    <div class="hud-sep"></div>
    <div class="hi"><div class="hi-l">PTS</div><div class="hi-v g" id="hudSaved">0</div></div>
    <div class="hud-sep"></div>
    <div class="hud-lives" id="hudLives"></div>
    <div class="hud-sep"></div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <div style="font-size:7px;color:var(--khaki);opacity:.5;letter-spacing:1px;text-transform:uppercase;">ERR</div>
      <div class="hud-errores" id="hudErrores"></div>
    </div>
    <div class="wave-tag" id="waveBadge">PREPARANDO</div>
  </div>
  <div class="timer-wrap"><div class="timer-fill" id="timerFill" style="width:100%"></div></div>
  <div class="kill-feed" id="killFeed"></div>
  <button class="pause-btn" id="pauseBtn" onclick="togglePauseMenu()">☰ MENÚ</button>
  <div class="pause-menu" id="pauseMenu">
    <div class="pm-item" onclick="togglePauseMenu()">▶ CONTINUAR</div>
    <div class="pm-item danger" onclick="confirmAbandon()">✕ ABANDONAR PARTIDA</div>
  </div>
  <div class="wave-ann" id="waveAnn">
    <div class="wave-num" id="waveAnnNum">—</div>
    <div class="wave-label" id="waveAnnLabel"></div>
    <div class="wave-sub" id="waveAnnSub">—</div>
  </div>
</div>

<!-- ══ VICTORIA FINAL ══ -->
<div id="victoryScreen" class="screen">
  <div class="vict-tag">// Operación completada //</div>
  <div class="vict-stars">⭐⭐⭐</div>
  <div class="vict-title">MISIÓN<br>CUMPLIDA</div>
  <div class="vict-sub">Completaste todas las oleadas</div>
  <div class="vict-stats">
    <div class="vict-oro-lbl">ORO TOTAL ACUMULADO</div>
    <div class="vict-oro" id="victOro">🪙 0</div>
    <div id="victStats" style="margin-top:12px;"></div>
  </div>
  <button class="btn btn-primary" style="max-width:280px;width:100%;" onclick="showScreen('lobby');updateLobby();">▶ VOLVER A BASE</button>
  <button class="btn btn-sec" style="max-width:280px;width:100%;margin-top:8px;" onclick="openRanking()">🏆 VER RANKING</button>
</div>

<!-- ══ MODAL TOAST ══ -->
<div class="toast-ov" id="toastModal">
<div class="toast-box" id="toastBox">
  <div class="toast-icon" id="toastIcon">⚠</div>
  <div class="toast-title" id="toastTitle">AVISO</div>
  <div class="toast-msg" id="toastMsg"></div>
  <div class="toast-btns" id="toastBtns"></div>
</div>
</div>

<!-- ══ LOADING ══ -->
<div id="loadingScreen" class="screen">
  <div style="font-family:'Oswald',sans-serif;font-size:28px;font-weight:600;color:var(--khaki);letter-spacing:4px;">DESPLEGANDO</div>
  <div class="load-bar-wrap"><div class="load-bar"></div></div>
  <div class="load-label">Cargando zona de operaciones...</div>
</div>

<!-- ══ RESULT ══ -->
<div id="resultScreen" class="screen">
<div class="result-wrap" id="resultCard">
  <div class="result-status" id="resultStatus">INFORME DE MISIÓN</div>
  <div class="result-title" id="resultTitle">—</div>
  <div id="resultStats"></div>
  <div class="result-btns">
    <button class="btn btn-primary" id="retryBtn">REINTENTAR</button>
    <button class="btn btn-sec"     id="menuBtn">BASE</button>
  </div>
</div>
</div>

<!-- ══ MODAL GAME OVERS AGOTADOS ══ -->
<div class="go-modal-ov" id="goModal">
<div class="go-modal-box">
  <div class="go-modal-title">☠ OPERATIVO BLOQUEADO</div>
  <div class="go-modal-sub">// SIN INTENTOS DISPONIBLES //</div>
  <div class="go-modal-body" id="goModalBody">
    Agotaste tus 3 intentos diarios.<br>
    Podés esperar la renovación gratuita en:<br>
  </div>
  <div class="go-modal-timer" id="goModalTimer">24:00:00</div>
  <div class="go-modal-btns">
    <button class="go-btn-pay" id="goBtnPay" onclick="pagarRenovacion()">⚡ RENOVAR AHORA · <span id="goPrecioPagar">20</span> PTS</button>
    <button class="go-btn-wait" onclick="cerrarGoModal()">⏳ ESPERAR RENOVACIÓN GRATUITA</button>
  </div>
</div>
</div>

<!-- ══ RANKING MODAL ══ -->
<div class="modal-ov" id="rankingModal">
<div class="modal-box" style="max-width:480px;">
  <button class="modal-close" onclick="closeRanking()">✕</button>
  <div class="modal-title">TABLA DE ÉLITE</div>
  <div class="modal-sub" id="rankMonthLabel">MES ACTUAL</div>
  <div class="podium" id="rankPodium"></div>
  <div id="rankTable" style="max-height:180px;overflow-y:auto;margin-bottom:10px;"></div>
  <div style="font-size:8px;color:rgba(140,160,80,.2);text-align:center;" id="rankReset"></div>
</div>
</div>

<!-- ══ WALLET MODAL ══ -->
<div class="modal-ov" id="walletModal">
<div class="modal-box">
  <button class="modal-close" onclick="closeWallet()">✕</button>
  <div class="modal-title">WALLET</div>
  <div class="modal-sub">GESTIÓN DE FONDOS</div>
  <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,.4);border:1px solid var(--hudBorder);padding:8px 12px;margin-bottom:6px;font-size:9px;">
    <span style="color:var(--khaki);opacity:.6;letter-spacing:2px;text-transform:uppercase;">Saldo CFT</span>
    <span id="wCftBal" style="color:var(--warn);font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;">0 CFT</span>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,.4);border:1px solid var(--hudBorder);padding:8px 12px;margin-bottom:14px;font-size:9px;">
    <span style="color:var(--khaki);opacity:.6;letter-spacing:2px;text-transform:uppercase;">Balance PTS</span>
    <span id="wOroBal" style="color:var(--warn);font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;">0 PTS</span>
  </div>
  <div class="w-tabs">
    <button class="w-tab active" data-wtab="dep" onclick="switchWT('dep')">⬇ DEPOSITAR</button>
    <button class="w-tab" data-wtab="wd"  onclick="switchWT('wd')">⬆ RETIRAR</button>
  </div>
  <div class="w-panel active" id="wpDep">
    <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--khaki);opacity:.6;margin-bottom:4px;"><span>Tasa de conversión</span><span style="color:var(--safe);">1 CFT = 1 PTS</span></div>
    <div><div class="w-lbl">CFT a depositar</div><input type="number" class="w-input" id="depAmt" min="1" step="1" placeholder="0" oninput="updateDep()"></div>
    <div class="w-row"><span style="color:var(--khaki);opacity:.6;">Balance CFT</span><span id="depCur">0 CFT</span></div>
    <div class="w-row"><span style="color:var(--khaki);opacity:.6;">Tras depósito</span><span id="depAfter">0 PTS</span></div>
    <div class="wmsg" id="depMsg"></div>
    <button class="w-btn w-dep" id="depBtn" disabled onclick="doDeposit()">⬇ DEPOSITAR CFT → PTS</button>
  </div>
  <div class="w-panel" id="wpWd">
    <div class="cd-block" id="wdCdBlock" style="display:none">
      <div class="cd-label">⏳ Próximo retiro en</div>
      <div class="cd-timer" id="wdTimer">--:--:--</div>
    </div>
    <div id="wdFormBlock">
      <div><div class="w-lbl">PTS a retirar (mín 5)</div><input type="number" class="w-input" id="wdAmt" min="5" step="1" placeholder="5" oninput="updateWd2()"></div>
      <div class="w-row"><span style="color:var(--khaki);opacity:.6;">Balance PTS</span><span id="wdCur">0 PTS</span></div>
      <div class="w-row"><span style="color:var(--khaki);opacity:.6;">Tras retiro</span><span id="wdAfter">0 PTS</span></div>
    </div>
    <div class="wmsg" id="wdMsg"></div>
    <button class="w-btn w-wd" id="wdBtn" disabled onclick="doWithdraw()">⬆ RETIRAR PTS → CFT</button>
  </div>
</div>
</div>

<script>
'use strict';

/* ══════════ CONFIG ══════════ */
const ECO = { MIN_BET:100, WD_MIN:5, LIVES:3, ERRORES_POR_VIDA:1, PTS_POR_BOSS:3, MAX_WAVE:30 };

/* ══════════ API ══════════ */
const API = {
  perfil:  '/play/sniper/perfilsniper.php',
  partida: '/play/sniper/partidasniper.php',
  wallet:  '/play/sniper/walletsniper.php',
  ranking: '/play/sniper/rankingsniper.php',
};

async function apiPost(url, data) {
  const r = await fetch(url, {
    method:'POST', credentials:'include',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(data),
  });
  return r.json();
}

async function apiGet(url) {
  const r = await fetch(url, {credentials:'include'});
  return r.json();
}

/* ══════════ ESTADO GLOBAL (backend) ══════════ */
const GS = {
  pts:0, cft:0, oro:0,
  games:0, maxWave:0,
  name:'GHOST',
  puedeRetirar:true, retiroRestante:0,
  upgrade:0, // nivel de mejora 0-5
  gameOversDisp:3,   // intentos disponibles hoy
  goRenovaciones:0,  // cuántas veces pagó renovación (para calcular precio)
  goProximaRenovAt:0,// timestamp unix de próxima renovación gratuita
};

// Mejoras: 5 niveles, cada uno +10% daño (reduce hits necesarios por nivel)
const UPGRADES = [
  { id:1, nombre:'MIRA TÁCTICA I',    precio:150,  desc:'+10% fuerza de disparo' },
  { id:2, nombre:'MIRA TÁCTICA II',   precio:280,  desc:'+10% fuerza (acum. +20%)' },
  { id:3, nombre:'CALIBRE REFORZADO', precio:450,  desc:'+10% fuerza (acum. +30%)' },
  { id:4, nombre:'SISTEMA AVANZADO',  precio:700,  desc:'+10% fuerza (acum. +40%)' },
  { id:5, nombre:'PROTOCOLO ÉLITE',   precio:1000, desc:'+10% fuerza (acum. +50%)' },
];

// Hits necesarios para matar cada tipo según nivel de mejora
// upgradeLvl 0→base, cada nivel reduce 10% → menos hits
function hitsNecesarios(type, wave) {
  const base = {grunt:1, runner:1, heavy:1, elite:1, decoy:1, ghost:1, boss:3};
  // A partir de wave 4 aumentan
  let h = base[type] || 1;
  if(wave >= 4)  h = Math.ceil(h * (1 + Math.floor(wave/4)*0.5));
  if(type==='heavy')  h = Math.max(h, Math.ceil(1 + wave*0.15));
  if(type==='elite')  h = Math.max(h, Math.ceil(2 + wave*0.2));
  if(type==='boss') {
    // Boss escala agresivamente: oleada 3=12, 6=18, 9=24, 12=30...
    const bossNum = Math.ceil(wave/3); // qué número de boss es
    h = 24 + (bossNum - 1) * 12;
  }
  // Reducción por mejoras: cada nivel = -10%
  const factor = Math.max(0.5, 1 - GS.upgrade*0.10);
  return Math.max(1, Math.ceil(h * factor));
}

async function cargarPerfil() {
  try {
    const res = await apiGet(API.perfil);
    if (!res.success) { console.error('[SNIPER] perfil:', res.message); return; }
    const p = res.perfil;
    GS.pts            = p.pts_balance;
    GS.cft            = p.cft_balance;
    GS.oro            = p.oro_total ?? 0;
    GS.games          = p.partidas;
    GS.maxWave        = p.oleada_maxima;
    GS.name           = p.apodo;
    GS.puedeRetirar   = p.puede_retirar;
    GS.retiroRestante = p.retiro_restante;
    GS.upgrade           = p.upgrade_nivel     ?? 0;
    GS.gameOversDisp     = p.game_overs_disp   ?? 3;
    GS.goRenovaciones    = p.go_renovaciones   ?? 0;
    GS.goProximaRenovAt  = p.go_proxima_renov  ?? 0;
    // Si no hay intentos pero ya pasaron las 24h, auto-renovar desde el backend
    if(GS.gameOversDisp <= 0 && GS.goProximaRenovAt > 0) {
      const ahora = Math.floor(Date.now()/1000);
      if(ahora >= GS.goProximaRenovAt) {
        // Pedir estado actualizado al backend (que auto-renueva si pasó el tiempo)
        try {
          const goRes = await apiGet('/play/sniper/gameoverssniper.php?action=estado');
          if(goRes.success) {
            GS.gameOversDisp    = goRes.game_overs_disp;
            GS.goRenovaciones   = goRes.go_renovaciones;
            GS.goProximaRenovAt = goRes.go_proxima_renov;
          }
        } catch(e) {}
      }
    }
    updateLobby();
  } catch(err) { console.error('[SNIPER] red perfil:', err); }
}

/* ══════════ SESIÓN ══════════ */
let SES = {};
let _partida_id = null;

/* ══════════ TARGET DEFS ══════════ */
const TDEFS = {
  grunt:  { oro:10,  size:30, spd:55,  life:10, hits:1, color:'#556b2f', glow:'#6b8b3f', label:'TROPA' },
  runner: { oro:18,  size:22, spd:110, life:8,  hits:1, color:'#3a5a6a', glow:'#4a7a8a', label:'CORREDOR' },
  heavy:  { oro:8,   size:48, spd:35,  life:12, hits:1, color:'#5a3a1a', glow:'#7a5a2a', label:'PESADO' },
  elite:  { oro:28,  size:28, spd:70,  life:9,  hits:2, color:'#8b4513', glow:'#b05a20', label:'ÉLITE' },
  decoy:  { oro:0,   size:26, spd:80,  life:9,  hits:1, color:'#8b0000', glow:'#cc1010', label:'SEÑUELO', isDecoy:true },
  ghost:  { oro:35,  size:24, spd:90,  life:7,  hits:1, color:'#556b55', glow:'#708b70', label:'FANTASMA', isGhost:true },
  boss:   { oro:100, size:62, spd:0,  life:9999, hits:12, color:'#4a3000', glow:'#c8a020', label:'COMANDANTE', isBoss:true },
};

function lifeScale(wave) { return Math.max(0.55, 1 - (wave-1)*0.03); }

/* ══════════ CANVAS ══════════ */
const $ = id => document.getElementById(id);
const setText = (id,v) => { const e=$(id); if(e) e.textContent=v; };

let canvas, ctx, W, H, worldW, worldH;
let camX=0, camY=0, mouseX=0, mouseY=0;
let targets=[], particles=[], floaties=[], killFeedItems=[];
let waveTimer=0, waveTime=30, waveActive=false, gameRunning=false, raf=null, lastTs=0;
let recoil=0, flashA=0, flashC='#ff0000';
let fogOffset=0, trees=[];

/* ══════════ SCREENS ══════════ */
function showScreen(n) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const s=$(n+'Screen'); if(s) s.classList.add('active');
}

/* ══════════ INIT ══════════ */
function initGame() {
  canvas = $('gameCanvas');
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  worldW = W*2.4; worldH = H*2.0;
  camX = worldW/2-W/2; camY = worldH/2-H/2;
  ctx = canvas.getContext('2d');
  targets=[]; particles=[]; floaties=[]; killFeedItems=[];
  gameRunning=true; lastTs=performance.now();
  genTrees();
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('click', onFire);
  raf = requestAnimationFrame(loop);
  setTimeout(() => beginWave(), 900);
}

function genTrees() {
  trees=[];
  for(let i=0;i<120;i++) trees.push({
    wx:Math.random()*worldW, wy:Math.random()*worldH,
    r:18+Math.random()*28, type:Math.floor(Math.random()*3),
    alpha:0.4+Math.random()*0.5
  });
}

function stopGame() {
  gameRunning=false;
  if(raf) cancelAnimationFrame(raf);
  if(canvas) {
    canvas.removeEventListener('mousemove',onMove);
    canvas.removeEventListener('click',onFire);
  }
}

/* ══════════ OLEADAS ══════════ */
function beginWave() {
  SES.wave++;
  // ¿Se completaron todas las oleadas?
  if(SES.wave > ECO.MAX_WAVE) {
    showVictory(); return;
  }
  const boss = SES.wave%3===0;
  waveTime = boss ? 15 : 30;
  waveTimer=waveTime; waveActive=true;
  targets=[]; SES.targetsLeft=0;
  spawnWave(boss); showAnn(SES.wave,boss); updateHUD();
}

// Escapes permitidos por oleada (baja gradualmente hasta mínimo 4)
function escapesPermitidos(wave) {
  if(wave <= 2)  return 999; // oleadas 1-2: sin límite
  if(wave <= 5)  return 8;
  if(wave <= 8)  return 6;
  if(wave <= 12) return 5;
  return 4; // máximo 4 escapes permitidos a partir de wave 13
}

function spawnWave(boss) {
  SES.escapesPermitidos = escapesPermitidos(SES.wave);
  SES.escapesAcum = 0;
  if(boss) {
    // Boss solo, estático (spd=0)
    spawnT('boss', true);
    SES.targetsLeft = 1; return;
  }
  let pool = ['grunt'];
  if(SES.wave>=2) pool.push('runner');
  if(SES.wave>=3) pool.push('heavy');
  if(SES.wave>=4) pool.push('elite','decoy');
  if(SES.wave>=6) pool.push('ghost');
  const n = 4+Math.floor(SES.wave*1.6);
  SES.targetsLeft = n;
  for(let i=0;i<n;i++) {
    const delay = i*(700-Math.min(SES.wave*18,400));
    setTimeout(()=>{if(gameRunning)spawnT(pool[Math.floor(Math.random()*pool.length)]);}, delay);
  }
}

function spawnT(type, staticTarget=false) {
  const def = {...TDEFS[type]};
  const m = def.size+30;
  const wx = staticTarget ? worldW/2 : m+Math.random()*(worldW-m*2);
  const wy = staticTarget ? worldH/2 : m+Math.random()*(worldH-m*2);
  const ang = Math.random()*Math.PI*2;
  const spd = staticTarget ? 0 : def.spd*(0.85+Math.random()*0.3)*(1+SES.wave*0.04);
  const baseLife = staticTarget ? 9999 : def.life*lifeScale(SES.wave);
  const hits = hitsNecesarios(type, SES.wave);
  targets.push({
    type, def, wx, wy,
    vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd,
    life:baseLife, maxLife:baseLife,
    hitsLeft:hits, maxHits:hits,
    dead:false, escaped:false, isStatic:staticTarget,
    ghostAlpha:def.isGhost?0.3:1.0,
    pulse:Math.random()*Math.PI*2, scale:1,
  });
}

/* ══════════ SISTEMA DE ERRORES ══════════ */
function addError(msg, x, y) {
  SES.errCount++;
  SES.misses++;
  addFloat(x, y, msg, '#b03010');
  flashA=0.18; flashC='#500000';
  addKillFeed(msg, 'bad');
  updateHudErrores();

  if(SES.errCount >= ECO.ERRORES_POR_VIDA) {
    SES.errCount = 0;
    SES.lives--;
    flashA=0.4; flashC='#600000';
    addFloat(W/2, H/2+30, '💀 VIDA PERDIDA', '#b03010');
    addKillFeed('— VIDA PERDIDA —','bad');
    updateHudLives();
    if(SES.lives<=0) setTimeout(()=>endGame(false),700);
  }
}

/* ══════════ INPUT ══════════ */
function onMove(e) {
  const r = canvas.getBoundingClientRect();
  const nx=e.clientX-r.left, ny=e.clientY-r.top;
  camX = Math.max(0,Math.min(worldW-W, camX+(nx-W/2)*0.05));
  camY = Math.max(0,Math.min(worldH-H, camY+(ny-H/2)*0.05));
  mouseX=nx; mouseY=ny;
}

function onFire() {
  if(!waveActive||!gameRunning) return;
  recoil=14;
  const wx=mouseX+camX, wy=mouseY+camY;
  let hit=false;

  for(let i=targets.length-1;i>=0;i--) {
    const t=targets[i]; if(t.dead||t.escaped) continue;
    const eff = t.def.isGhost ? t.def.size*0.6 : t.def.size;
    if(Math.hypot(wx-t.wx, wy-t.wy) <= eff*t.scale) {
      if(t.def.isDecoy) {
        addError('☠ SEÑUELO', t.wx-camX, t.wy-camY);
        t.dead=true; SES.targetsLeft--;
        checkWaveDone();
      } else {
        t.hitsLeft--; t.scale=1.25;
        addParticles(t.wx-camX, t.wy-camY, t.def.glow, 10);
        if(t.hitsLeft<=0) {
          const gain = Math.round(t.def.oro*(1+SES.wave*0.06));
          SES.oro += gain; SES.hits++;
          addFloat(t.wx-camX, t.wy-camY-24, '🪙+'+gain, '#f0c040');
          addParticles(t.wx-camX, t.wy-camY, t.def.glow, 20);
          addKillFeed(t.def.label+' ELIMINADO 🪙+'+gain, 'ok');
          if(t.def.isBoss) {
            SES.bosses++; flashA=0.15; flashC='#c8a020';
            addFloat(W/2, H/2-50, '⭐ BOSS DOWN', '#c8a020');
          }
          t.dead=true; SES.targetsLeft--;
          checkWaveDone();
        } else {
          addKillFeed('IMPACTO EN '+t.def.label,'warn');
        }
      }
      hit=true; break;
    }
  }
  if(!hit) addError('⊘ FALLO', mouseX, mouseY);
  updateHUD();
}

function checkWaveDone() {
  if(targets.filter(t=>!t.dead&&!t.escaped).length===0 && SES.targetsLeft<=0) {
    waveActive=false;
    const esBoss = SES.wave%3===0;
    let ptsGanados = 0;
    if(esBoss && SES.bosses>0) {
      // Modo libre: 1 PTS. Modo apuesta: 2 PTS por cada 50 apostados
      ptsGanados = SES.mode==='bet'
        ? Math.max(1, Math.floor(SES.budget/50)*2)
        : 1;
      GS.pts += ptsGanados;
      addFloat(W/2, H/2-80, '+'+ptsGanados+' PTS ⭐ BOSS', '#c8a020');
      addKillFeed('+'+ptsGanados+' PTS — BOSS ELIMINADO','ok');
    } else if(esBoss && SES.bosses===0) {
      // Perdió contra boss: penalidad = mismo monto que hubiera ganado
      const penalidad = SES.mode==='bet'
        ? Math.max(1, Math.floor(SES.budget/50)*2)
        : 1;
      GS.pts = Math.max(0, GS.pts - penalidad);
      addFloat(W/2, H/2-80, '-'+penalidad+' PTS ☠ BOSS', '#b03010');
      addKillFeed('-'+penalidad+' PTS — BOSS ESCAPÓ','bad');
    }
    _guardarOleada(esBoss, ptsGanados);
    addFloat(W/2, H/2, '▶ OLEADA COMPLETADA', '#556b2f');
    setTimeout(()=>{ if(gameRunning) beginWave(); }, 2600);
  }
}

async function _guardarOleada(esBoss, ptsGanados) {
  if(!_partida_id) return;
  const caidos    = targets.filter(t=>t.dead&&!t.escaped).length;
  const escapados = targets.filter(t=>t.escaped).length;
  try {
    await apiPost(API.partida, {
      action:            'oleada',
      partida_id:        _partida_id,
      numero_oleada:     SES.wave,
      es_boss:           esBoss,
      targets_total:     targets.length,
      targets_caidos:    caidos,
      targets_escapados: escapados,
      disparos:          SES.hits+SES.misses,
      pts_oleada:        SES.oro,
      pts_ganados:       ptsGanados,
      tiempo_seg:        waveTime-waveTimer,
    });
  } catch(e) { console.warn('[SNIPER] oleada no guardada:', e); }
}

/* ══════════ LOOP ══════════ */
function loop(ts) {
  if(!gameRunning) return;
  const dt = Math.min((ts-lastTs)/1000, 0.05); lastTs=ts;
  update(dt); render();
  raf = requestAnimationFrame(loop);
}

function update(dt) {
  fogOffset += dt*8;
  if(waveActive) {
    waveTimer -= dt;
    if(waveTimer<=0) {
      const esBossOleada = SES.wave%3===0;
      if(esBossOleada) {
        // Boss no eliminado en tiempo → game over inmediato
        for(const t of targets) { if(!t.dead&&!t.escaped) { t.escaped=true; SES.targetsLeft--; } }
        flashA=0.6; flashC='#600000';
        addFloat(W/2, H/2, '☠ COMANDANTE ESCAPÓ', '#b03010');
        addKillFeed('☠ BOSS SIN TIEMPO — GAME OVER','bad');
        waveActive=false;
        setTimeout(()=>endGame(false), 1200); return;
      }
      let escapados=0;
      for(const t of targets) {
        if(!t.dead&&!t.escaped) { t.escaped=true; SES.targetsLeft--; escapados++; }
      }
      if(escapados>0) {
        addError('⊘ OLEADA FALLIDA', W/2, H/2+60);
        if(SES.lives<=0) { setTimeout(()=>endGame(false),700); return; }
      }
      waveActive=false;
      if(SES.lives>0) setTimeout(()=>{ if(gameRunning) beginWave(); }, 1800);
    }
    const pct = waveTimer/waveTime;
    const bar = $('timerFill');
    if(bar) { bar.style.width=(pct*100)+'%'; bar.className='timer-fill'+(pct<0.2?' danger':pct<0.45?' warn':''); }
  }

  for(const t of targets) {
    if(t.dead||t.escaped) continue;
    t.wx+=t.vx*dt; t.wy+=t.vy*dt;
    if(t.wx<t.def.size)          { t.wx=t.def.size;          t.vx*=-1; }
    if(t.wx>worldW-t.def.size)   { t.wx=worldW-t.def.size;   t.vx*=-1; }
    if(t.wy<t.def.size)          { t.wy=t.def.size;          t.vy*=-1; }
    if(t.wy>worldH-t.def.size)   { t.wy=worldH-t.def.size;   t.vy*=-1; }
    t.life-=dt; t.pulse+=dt*2.5;
    if(t.scale>1) t.scale=Math.max(1,t.scale-dt*5);
    if(t.life<=0&&!t.dead&&!t.isStatic) {
      t.escaped=true; SES.targetsLeft--;
      SES.escapesAcum = (SES.escapesAcum||0)+1;
      addFloat(t.wx-camX, t.wy-camY, '⊘ ESCAPÓ', '#b03010');
      addKillFeed('⊘ ESCAPÓ', 'bad');
      flashA=0.12; flashC='#400000';
      // Si supera escapes permitidos → pierde vida
      if(SES.escapesAcum >= SES.escapesPermitidos) {
        SES.escapesAcum = 0;
        addError('⚠ DEMASIADOS ESCAPES', W/2, H/2+60);
        if(SES.lives<=0) { setTimeout(()=>endGame(false),700); return; }
      }
      checkWaveDone();
    }
  }

  for(const p of particles) { p.x+=p.vx*dt*60; p.y+=p.vy*dt*60; p.vy+=0.08; p.life-=dt*1.6; }
  particles = particles.filter(p=>p.life>0);
  for(const f of floaties)  { f.y-=35*dt; f.life-=dt; }
  floaties = floaties.filter(f=>f.life>0);
  flashA = Math.max(0,flashA-dt*1.8);
  recoil = Math.max(0,recoil-dt*90);
}

/* ══════════ RENDER ══════════ */
function render() {
  ctx.fillStyle='#0d1a08'; ctx.fillRect(0,0,W,H);

  const goff=camX*0.3%80;
  for(let x=-goff;x<W+80;x+=80)
    for(let y=-(camY*0.3%60);y<H+60;y+=60) {
      ctx.fillStyle='rgba(20,12,5,0.5)'; ctx.fillRect(x,y,78,58);
    }

  for(const tr of trees) {
    const sx=tr.wx-camX*0.85, sy=tr.wy-camY*0.85;
    if(sx<-60||sx>W+60||sy<-60||sy>H+60) continue;
    ctx.globalAlpha=tr.alpha;
    if(tr.type===0) {
      ctx.fillStyle='#1a2f0e'; ctx.beginPath(); ctx.arc(sx,sy,tr.r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#22400f'; ctx.beginPath(); ctx.arc(sx-tr.r*.3,sy-tr.r*.3,tr.r*.7,0,Math.PI*2); ctx.fill();
    } else if(tr.type===1) {
      ctx.strokeStyle='#1a1208'; ctx.lineWidth=tr.r*.3;
      ctx.beginPath(); ctx.moveTo(sx,sy+tr.r); ctx.lineTo(sx,sy-tr.r*.5); ctx.stroke();
      ctx.fillStyle='#1e3010';
      for(let a=0;a<5;a++) {
        const ang=-Math.PI/2+a*(Math.PI*2/5);
        ctx.beginPath(); ctx.ellipse(sx+Math.cos(ang)*tr.r*.8,sy-tr.r*.5+Math.sin(ang)*tr.r*.4,tr.r*.6,tr.r*.25,ang,0,Math.PI*2); ctx.fill();
      }
    } else {
      ctx.fillStyle='#162610'; ctx.beginPath(); ctx.ellipse(sx,sy,tr.r*1.2,tr.r*.6,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1e3a14'; ctx.beginPath(); ctx.ellipse(sx-tr.r*.2,sy-tr.r*.2,tr.r*.9,tr.r*.5,0.3,0,Math.PI*2); ctx.fill();
    }
  }
  ctx.globalAlpha=1;

  const fogGrad=ctx.createLinearGradient(0,0,W,H);
  fogGrad.addColorStop(0,'rgba(160,168,112,0.04)');
  fogGrad.addColorStop(0.5,'rgba(160,168,112,0.08)');
  fogGrad.addColorStop(1,'rgba(160,168,112,0.03)');
  ctx.fillStyle=fogGrad; ctx.fillRect(0,0,W,H);

  ctx.strokeStyle='rgba(60,80,30,.08)'; ctx.lineWidth=1;
  const gx2=camX%100, gy2=camY%100;
  for(let x=-gx2;x<W;x+=100){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=-gy2;y<H;y+=100){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

  for(const t of targets) {
    if(t.dead||t.escaped) continue;
    const sx=t.wx-camX, sy=t.wy-camY;
    if(sx<-80||sx>W+80||sy<-80||sy>H+80) continue;
    const r=t.def.size*t.scale, lifeR=t.life/t.maxLife;
    const pulse=0.9+Math.sin(t.pulse)*0.08;
    const alpha=t.def.isGhost?(0.25+Math.sin(t.pulse*1.5)*0.15):1.0;
    ctx.globalAlpha=alpha;

    ctx.fillStyle='rgba(0,0,0,.35)';
    ctx.beginPath(); ctx.ellipse(sx+3,sy+r*.5,r*.8,r*.22,0,0,Math.PI*2); ctx.fill();

    if(t.def.isBoss) {
      ctx.save(); ctx.translate(sx,sy); ctx.rotate(t.pulse*.3);
      ctx.shadowColor=t.def.glow; ctx.shadowBlur=22; ctx.fillStyle=t.def.color;
      ctx.beginPath();
      for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2-Math.PI/6;i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle=t.def.glow; ctx.lineWidth=3; ctx.stroke();
      ctx.shadowBlur=0; ctx.restore();
      ctx.font=`${r*.9}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('☠',sx,sy); ctx.textBaseline='alphabetic';
      const bw=r*3,bh=7,bx=sx-bw/2,by=sy-r-16;
      ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(bx,by,bw,bh);
      ctx.fillStyle=lifeR>.5?'#c8a020':'#b03010'; ctx.fillRect(bx,by,bw*lifeR,bh);
      ctx.font='bold 8px Oswald'; ctx.textAlign='center'; ctx.fillStyle='#c8a020';
      ctx.fillText('CMD',sx,by-4);
    } else if(t.def.isDecoy) {
      ctx.save(); ctx.translate(sx,sy);
      ctx.shadowColor='#cc1010'; ctx.shadowBlur=16;
      ctx.strokeStyle='#8b0000'; ctx.lineWidth=r*.35; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-r*.55,-r*.55); ctx.lineTo(r*.55,r*.55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r*.55,-r*.55); ctx.lineTo(-r*.55,r*.55); ctx.stroke();
      ctx.fillStyle='rgba(100,0,0,.2)'; ctx.beginPath(); ctx.arc(0,0,r*pulse,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.restore();
    } else {
      ctx.save(); ctx.translate(sx,sy);
      ctx.shadowColor=t.def.glow; ctx.shadowBlur=10;
      ctx.fillStyle=t.def.color; ctx.beginPath(); ctx.arc(0,0,r*pulse,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.2)';
      for(let i=0;i<4;i++){const pa=i*(Math.PI*2/4)+t.pulse*.1;ctx.beginPath();ctx.ellipse(Math.cos(pa)*r*.4,Math.sin(pa)*r*.4,r*.22,r*.14,pa,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle=t.def.glow; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,r*pulse,0,Math.PI*2); ctx.stroke();
      if(t.hitsLeft>1) for(let i=0;i<t.hitsLeft;i++){ctx.fillStyle='#c8a020';ctx.beginPath();ctx.arc(-((t.hitsLeft-1)*5)+i*10,r+8,3,0,Math.PI*2);ctx.fill();}
      ctx.shadowBlur=0; ctx.restore();
    }
    ctx.globalAlpha=1;

    if(!t.def.isBoss) {
      ctx.strokeStyle=lifeR>.5?'rgba(100,130,50,.5)':'rgba(160,40,20,.6)';
      ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(sx,sy,r+4,-Math.PI/2,-Math.PI/2+lifeR*Math.PI*2); ctx.stroke();
    }
  }

  for(const p of particles){ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  ctx.font='bold 11px Oswald'; ctx.textAlign='center';
  for(const f of floaties){ctx.globalAlpha=Math.min(f.life,1);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y);}
  ctx.globalAlpha=1;
  if(flashA>0){ctx.fillStyle=flashC;ctx.globalAlpha=flashA;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}

  drawScope(mouseX,mouseY);
  drawMinimap();
  drawErrorBar();
}

function drawScope(x,y) {
  ctx.save();
  const gap=12+recoil, len=20;
  ctx.strokeStyle='rgba(140,160,80,.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(x,y,50,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='rgba(200,160,32,.85)'; ctx.lineWidth=1;
  [[x,y-gap-len,x,y-gap],[x,y+gap,x,y+gap+len],[x-gap-len,y,x-gap,y],[x+gap,y,x+gap+len,y]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  });
  ctx.fillStyle='rgba(200,160,32,.9)'; ctx.beginPath(); ctx.arc(x,y,2.5,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(200,160,32,.35)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(x,y,gap+4,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(200,160,32,.5)';
  [[-30,0],[30,0],[0,-30],[0,30]].forEach(([dx,dy])=>{ctx.beginPath();ctx.arc(x+dx,y+dy,1.5,0,Math.PI*2);ctx.fill();});
  ctx.restore();
}

function drawMinimap() {
  const mw=130,mh=75,mx=W-mw-10,my=H-mh-10;
  ctx.fillStyle='rgba(5,10,3,.88)'; ctx.fillRect(mx,my,mw,mh);
  ctx.strokeStyle='rgba(140,160,80,.3)'; ctx.lineWidth=1; ctx.strokeRect(mx,my,mw,mh);
  for(const tr of trees){const tx=mx+(tr.wx/worldW)*mw,ty=my+(tr.wy/worldH)*mh;ctx.fillStyle='rgba(30,50,15,.5)';ctx.fillRect(tx-1,ty-1,2,2);}
  for(const t of targets){
    if(t.dead||t.escaped) continue;
    const tx=mx+(t.wx/worldW)*mw,ty=my+(t.wy/worldH)*mh;
    ctx.fillStyle=t.def.isDecoy?'#8b0000':t.def.isBoss?'#c8a020':t.def.glow;
    ctx.beginPath();ctx.arc(tx,ty,t.def.isBoss?3.5:2,0,Math.PI*2);ctx.fill();
  }
  const vx=mx+(camX/worldW)*mw,vy=my+(camY/worldH)*mh,vw=(W/worldW)*mw,vh=(H/worldH)*mh;
  ctx.strokeStyle='rgba(200,160,32,.5)'; ctx.lineWidth=1; ctx.strokeRect(vx,vy,vw,vh);
  ctx.font='7px Share Tech Mono'; ctx.textAlign='left'; ctx.fillStyle='rgba(140,160,80,.4)';
  ctx.fillText('ZONA OPS',mx+3,my+8);
}

function drawErrorBar() {
  if(!gameRunning) return;
  const bw=120,bh=8,bx=W/2-bw/2,by=56;
  ctx.fillStyle='rgba(0,0,0,.55)'; ctx.fillRect(bx-1,by-1,bw+2,bh+2);
  const pct=SES.errCount/ECO.ERRORES_POR_VIDA;
  ctx.fillStyle=pct>=0.67?'#b03010':pct>=0.34?'#c8a020':'#556b2f';
  ctx.fillRect(bx,by,bw*pct,bh);
  ctx.strokeStyle='rgba(140,160,80,.25)'; ctx.lineWidth=1; ctx.strokeRect(bx,by,bw,bh);
  ctx.font='7px Share Tech Mono'; ctx.textAlign='center'; ctx.fillStyle='rgba(200,180,100,.55)';
  ctx.fillText('ERR '+SES.errCount+'/'+ECO.ERRORES_POR_VIDA, W/2, by+bh+10);
}

/* ══════════ HELPERS ══════════ */
function addParticles(x,y,color,n=6){for(let i=0;i<n;i++)particles.push({x,y,color,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6-1,life:1,r:2+Math.random()*4});}
function addFloat(x,y,txt,color){floaties.push({x,y,text:txt,color,life:1.8});}
function addKillFeed(msg,cls='ok'){
  const el=document.createElement('div');
  el.className='kf-item'+(cls==='bad'?' bad':'');
  el.textContent=msg;
  $('killFeed').prepend(el);
  killFeedItems.push(el);
  setTimeout(()=>{el.style.opacity='0';setTimeout(()=>el.remove(),400);},3000);
  if(killFeedItems.length>5) killFeedItems.shift().remove();
}

/* ══════════ HUD ══════════ */
function updateHUD() {
  setText('hudWave',    SES.wave||'—');
  setText('hudTargets', targets.filter(t=>!t.dead&&!t.escaped).length);
  setText('hudPts',     '🪙 '+SES.oro);
  setText('hudSaved',   GS.pts+' PTS');
  const wb=$('waveBadge');
  if(wb){const b=SES.wave%5===0;wb.textContent=(b?'☠ COMANDANTE ':'▶ ')+'OL.'+SES.wave;wb.className='wave-tag'+(b?' boss':'');}
  updateHudLives();
  updateHudErrores();
}

function updateHudLives() {
  const el=$('hudLives'); if(!el) return;
  el.innerHTML='';
  for(let i=0;i<ECO.LIVES;i++){const d=document.createElement('div');d.className='life-pip'+(i>=SES.lives?' dead':'');el.appendChild(d);}
}

function updateHudErrores() {
  const el=$('hudErrores'); if(!el) return;
  el.innerHTML='';
  for(let i=0;i<ECO.ERRORES_POR_VIDA;i++){const d=document.createElement('div');d.className='error-pip'+(i<SES.errCount?' active':'');el.appendChild(d);}
}

function showAnn(w,boss) {
  const el=$('waveAnn'); if(!el) return;
  $('waveAnnNum').textContent   = boss?'ALERTA':('OLEADA '+w);
  $('waveAnnNum').className     = 'wave-num'+(boss?' boss':'');
  $('waveAnnLabel').textContent = boss?'COMANDANTE APROXIMÁNDOSE':'';
  if(boss) {
    const hb = hitsNecesarios('boss', w);
    $('waveAnnSub').textContent = hb+' IMPACTOS · 15 SEG · GAME OVER SI ESCAPA';
  } else {
    $('waveAnnSub').textContent = 'Neutralizá todos los objetivos en 30 segundos';
  }
  el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2400);
}

/* ══════════ FIN DE PARTIDA ══════════ */
async function endGame(won) {
  stopGame();

  if(_partida_id) {
    try {
      const resClose = await apiPost(API.partida, {
        action:        'cerrar',
        partida_id:    _partida_id,
        oleadas:       SES.wave,
        bosses_caidos: SES.bosses,
        bajas:         SES.hits,
        fallos:        SES.misses,
        oro_partida:   SES.oro,
        modo:          SES.mode==='free'?'libre':'operativo',
        presupuesto:   SES.budget,
      });
      if(resClose?.success) {
        GS.pts     = resClose.pts_balance;
        GS.cft     = resClose.cft_balance;
        GS.maxWave = resClose.oleada_maxima;
        GS.oro     = resClose.oro_total;
      }
    } catch(e) { console.error('[SNIPER] error cerrando:', e); }
  }
  _partida_id = null;

  // Si perdió, registrar game over en backend y verificar bloqueo
  if(!won) {
    try {
      const goRes = await apiPost('/play/sniper/gameoverssniper.php', {action:'registrar'});
      if(goRes.success) {
        GS.gameOversDisp    = goRes.game_overs_disp;
        GS.goRenovaciones   = goRes.go_renovaciones;
        GS.goProximaRenovAt = goRes.go_proxima_renov;
      }
    } catch(e) { console.warn('[SNIPER] game over no registrado:', e); }
  }

  const acc = SES.hits+SES.misses>0 ? Math.round(SES.hits/(SES.hits+SES.misses)*100) : 0;
  const win  = SES.bosses>0 || SES.oro>0;
  const card=$('resultCard'); if(card) card.className='result-wrap'+(win?' win':'');
  const t=$('resultTitle'); if(t){t.className='result-title '+(win?'win':'lose');t.textContent=win?'MISIÓN COMPLETADA':'OPERATIVO CAÍDO';}
  setText('resultStatus','// INFORME DE MISIÓN //');

  const rows=[
    {l:'MODO',         v:SES.mode==='bet'?'OPERATIVO':'LIBRE', c:''},
    {l:'OLEADAS',      v:SES.wave,      c:''},
    {l:'COMANDANTES',  v:SES.bosses,    c:''},
    {l:'PRECISIÓN',    v:acc+'%',       c:'hi'},
    {l:'BAJAS',        v:SES.hits,      c:'win'},
    {l:'FALLOS',       v:SES.misses,    c:'lose'},
    {l:'ORO PARTIDA',  v:'🪙 '+SES.oro, c:'hi'},
    {l:'ORO TOTAL',    v:'🪙 '+GS.oro,  c:'hi'},
  ];
  if(SES.mode==='bet') rows.push({l:'PTS BALANCE',v:GS.pts+' PTS',c:'hi'});

  const rsEl=$('resultStats');
  if(rsEl) rsEl.innerHTML=rows.map(r=>`<div class="rs"><span class="rs-l">${r.l}</span><span class="rs-v ${r.c}">${r.v}</span></div>`).join('');

  showScreen('result');
  updateLobby();
}

/* ══════════ LOBBY ══════════ */
let _mode='free', _bet=100;

function setMode(m) {
  _mode=m;
  $('modeFreeBtn').className='mode-btn'+(m==='free'?' af':'');
  $('modeBetBtn').className ='mode-btn'+(m==='bet'?' ab':'');
  $('betSection').style.display  = m==='bet'  ? 'block':'none';
  $('freeSection').style.display = m==='free' ? 'block':'none';
  updateLobby();
}

function updateLobby() {
  setText('lbPts',    GS.pts+' PTS');
  setText('lbGames',  GS.games);
  setText('lbWave',   GS.maxWave);
  setText('lbProfit', '🪙 '+GS.oro);
  const pb=$('playBtn'); if(!pb) return;
  if(_mode==='free') { pb.disabled=false; pb.textContent='▶ INICIAR OPERACIÓN'; }
  else { pb.disabled=_bet<ECO.MIN_BET||_bet>GS.pts; pb.textContent=_bet>GS.pts?'⚠ FONDOS INSUFICIENTES':'▶ INICIAR OPERACIÓN'; }
}

document.querySelectorAll('.bopt').forEach(o=>o.addEventListener('click',()=>setBet(parseInt(o.dataset.bet))));
$('betCustom').addEventListener('input',e=>{
  const v=parseInt(e.target.value);
  if(!isNaN(v)&&v>=ECO.MIN_BET){_bet=v;document.querySelectorAll('.bopt').forEach(o=>o.classList.remove('sel'));updateLobby();}
});
function setBet(v){_bet=Math.max(ECO.MIN_BET,v);document.querySelectorAll('.bopt').forEach(o=>o.classList.toggle('sel',parseInt(o.dataset.bet)===v));updateLobby();}

async function startMission() {
  // Verificar game overs disponibles (primero JS, luego confirmar con backend)
  if(GS.gameOversDisp <= 0) {
    // Re-chequear con backend por si pasaron las 24h
    try {
      const goCheck = await apiGet('/play/sniper/gameoverssniper.php?action=estado');
      if(goCheck.success) {
        GS.gameOversDisp    = goCheck.game_overs_disp;
        GS.goRenovaciones   = goCheck.go_renovaciones;
        GS.goProximaRenovAt = goCheck.go_proxima_renov;
      }
    } catch(e) {}
    if(GS.gameOversDisp <= 0) {
      mostrarGoModal();
      return;
    }
  }
  const modo   = _mode==='free'?'libre':'operativo';
  const presup = _mode==='bet'?_bet:0;
  showScreen('loading');
  try {
    const res = await apiPost(API.partida, {action:'iniciar', modo, presupuesto:presup});
    if(!res.success) {
      showScreen('lobby'); updateLobby();
      const esPts = res.error_code === 'INSUFFICIENT_PTS';
      const esGO  = res.error_code === 'NO_GAME_OVERS';
      if(esGO) {
        // Sincronizar estado GO desde la respuesta del backend
        if(res.go_proxima_renov) {
          GS.gameOversDisp    = 0;
          GS.goProximaRenovAt = res.go_proxima_renov;
          GS.goRenovaciones   = res.go_renovaciones ?? GS.goRenovaciones;
        }
        mostrarGoModal();
      } else {
        showToast({
          icon: esPts?'💰':'⚠',
          title: esPts?'FONDOS INSUFICIENTES':'ERROR AL INICIAR',
          type: esPts?'warn':'danger',
          msg: esPts
            ? 'No tenés suficientes PTS para esta apuesta.<br>Depositá CFT en el wallet para continuar.'
            : res.message,
          btns: esPts
            ? [{label:'⬇ IR AL WALLET',cls:'primary',action:()=>openWallet()},{label:'CANCELAR',cls:'sec'}]
            : [{label:'CERRAR',cls:'sec'}]
        });
      }
      return;
    }
    _partida_id = res.partida_id;
    if(_mode==='bet') GS.pts = res.pts_balance;
    SES = {mode:_mode,budget:presup,oro:0,lives:ECO.LIVES,errCount:0,wave:0,bosses:0,hits:0,misses:0,targetsLeft:0};
  } catch(e) { console.error('[SNIPER] iniciar:',e); showScreen('lobby'); updateLobby(); return; }
  await new Promise(r=>setTimeout(r,400));
  showScreen('game'); initGame();
}

$('playBtn').addEventListener('click', startMission);
$('retryBtn').addEventListener('click', async()=>{
  if(_mode==='bet'&&GS.pts<_bet){showScreen('lobby');updateLobby();return;}
  await startMission();
});
$('menuBtn').addEventListener('click',()=>{stopGame();showScreen('lobby');updateLobby();});

/* ══════════ RANKING (backend) ══════════ */
async function openRanking() {
  $('rankingModal').classList.add('open');
  $('rankPodium').innerHTML='<div style="color:var(--khaki);font-size:9px;opacity:.5;padding:12px 0;">Cargando…</div>';
  $('rankTable').innerHTML='';
  try {
    const res = await apiGet(API.ranking); if(!res.success) return;
    setText('rankMonthLabel', res.mes);
    const pod=$('rankPodium'); pod.innerHTML='';
    [1,0,2].forEach((idx,vi)=>{
      const en=res.ranking[idx],pd=[{cls:'second',e:'2°'},{cls:'first',e:'1°'},{cls:'third',e:'3°'}][vi];
      const sl=document.createElement('div'); sl.className='p-slot';
      const av = en?.avatar_url ? `<img src="${en.avatar_url}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--warn);margin-bottom:4px;" onerror="this.style.display='none'">` : `<div style="width:32px;height:32px;border-radius:50%;background:rgba(100,80,20,.3);border:2px solid var(--warn);display:flex;align-items:center;justify-content:center;font-size:13px;margin-bottom:4px;">👤</div>`;
      sl.innerHTML=`${av}<div class="p-name">${en?en.apodo:'---'}</div><div class="p-score">${en?'🪙'+en.oro_total:'---'}</div><div class="p-bar ${pd.cls}">${pd.e}</div>`;
      pod.appendChild(sl);
    });
    const tbl=$('rankTable'); tbl.innerHTML='';
    res.ranking.slice(3).forEach((en,i)=>{
      const row=document.createElement('div'); row.className='rank-row'+(en.es_yo?' my-row':'');
      const avUrl = en.avatar_url ? `<img src="${en.avatar_url}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:1px solid var(--hudBorder);" onerror="this.outerHTML='<span style=\'font-size:14px;\'>👤</span>'">` : `<span style="font-size:14px;">👤</span>`;
      row.innerHTML=`<span class="rank-n">${i+4}.</span>${avUrl}<span class="rank-name">${en.apodo}</span><span class="rank-w">OL.${en.oleada_maxima}</span><span class="rank-pts">🪙${en.oro_total}</span>`;
      tbl.appendChild(row);
    });
    if(res.mi_posicion) setText('rankReset','Tu posición este mes: #'+res.mi_posicion);
  } catch(e) { $('rankPodium').innerHTML='<div style="color:var(--danger);font-size:9px;">Error cargando ranking</div>'; }
}
function closeRanking(){$('rankingModal').classList.remove('open');}
$('rankingBtn').addEventListener('click',openRanking);
$('rankingModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeRanking();});

/* ══════════ WALLET (backend) ══════════ */
let _wdInt=null;

async function openWallet() {
  switchWT('dep');
  $('walletModal').classList.add('open');
  try {
    const res = await apiGet(API.perfil);
    if(res.success) {
      GS.pts            = res.perfil.pts_balance;
      GS.cft            = res.perfil.cft_balance;
      GS.oro            = res.perfil.oro_total ?? 0;
      GS.puedeRetirar   = res.perfil.puede_retirar;
      GS.retiroRestante = res.perfil.retiro_restante;
    }
  } catch(e) { console.error('[SNIPER] wallet perfil:', e); }
  updateWD();
}

function closeWallet() {
  $('walletModal').classList.remove('open');
  if(_wdInt){clearInterval(_wdInt);_wdInt=null;}
}

function updateWD() {
  setText('wCftBal',(GS.cft||0).toFixed(2)+' CFT');
  setText('wOroBal', GS.pts+' PTS');
  setText('depCur',(GS.cft||0).toFixed(2)+' CFT');
  setText('wdCur',GS.pts+' PTS');
  updateLobby();
}

function switchWT(tab) {
  document.querySelectorAll('.w-tab').forEach(t=>t.classList.toggle('active',t.dataset.wtab===tab));
  $('wpDep').classList.toggle('active',tab==='dep');
  $('wpWd').classList.toggle('active',tab==='wd');
  if(tab==='wd') updateWd2(); else updateDep();
}

function updateDep() {
  const v=parseFloat($('depAmt').value)||0;
  setText('depAfter',(GS.pts+Math.floor(v))+' PTS');
  $('depBtn').disabled=!(v>=1&&v<=(GS.cft||0));
}

async function doDeposit() {
  const v=parseFloat($('depAmt').value)||0; if(v<1) return;
  $('depBtn').disabled=true;
  try {
    const res = await apiPost(API.wallet,{action:'depositar',monto:v});
    const msg=$('depMsg');
    if(res.success) {
      msg.className='wmsg ok'; msg.textContent='✓ '+res.message;
      GS.pts=res.pts_balance; GS.cft=res.cft_display;
      $('depAmt').value=''; updateWD(); updateDep();
    } else {
      msg.className='wmsg err'; msg.textContent=res.message;
    }
  } catch(e) { console.error('[SNIPER] depositar:', e); }
  $('depBtn').disabled=false;
}

function updateWd2() {
  const amt=parseInt($('wdAmt').value)||0;
  const btn=$('wdBtn'),msg=$('wdMsg'),cd=$('wdCdBlock'),fb=$('wdFormBlock');
  if(msg){msg.className='wmsg';msg.textContent='';} if(btn) btn.disabled=true;
  setText('wdAfter',Math.max(0,GS.pts-amt)+' PTS');

  if(!GS.puedeRetirar) {
    if(fb){fb.style.opacity='.4';fb.style.pointerEvents='none';}
    if(cd) cd.style.display='block';
    if(_wdInt) clearInterval(_wdInt);
    const tick=()=>{
      if(GS.retiroRestante<=0){clearInterval(_wdInt);GS.puedeRetirar=true;updateWd2();return;}
      GS.retiroRestante--;
      const h=Math.floor(GS.retiroRestante/3600),m2=Math.floor((GS.retiroRestante%3600)/60),s=GS.retiroRestante%60;
      setText('wdTimer',`${String(h).padStart(2,'0')}:${String(m2).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    tick(); _wdInt=setInterval(tick,1000); return;
  }

  if(cd) cd.style.display='none';
  if(fb){fb.style.opacity='1';fb.style.pointerEvents='auto';}
  if(amt<ECO.WD_MIN){if(amt>0&&msg){msg.className='wmsg err';msg.textContent='Mínimo: '+ECO.WD_MIN+' PTS';}}
  else if(amt>GS.pts){if(msg){msg.className='wmsg err';msg.textContent='PTS insuficientes';}}
  else{if(btn)btn.disabled=false;if(msg){msg.className='wmsg warn';msg.textContent='⚠ 1 retiro cada 24hs';}}
}

async function doWithdraw() {
  const amt=parseInt($('wdAmt').value)||0;
  if(amt<ECO.WD_MIN||amt>GS.pts||!GS.puedeRetirar) return;
  $('wdBtn').disabled=true;
  try {
    const res = await apiPost(API.wallet,{action:'retirar',monto:amt});
    const msg=$('wdMsg');
    if(res.success) {
      msg.className='wmsg ok'; msg.textContent='✓ '+res.message;
      GS.pts = res.pts_balance; GS.cft = res.cft_display;
      GS.puedeRetirar=false; GS.retiroRestante=res.proximo_retiro_en;
      $('wdAmt').value=''; updateWD(); updateWd2();
    } else {
      msg.className='wmsg err'; msg.textContent=res.message;
    }
  } catch(e) { console.error('[SNIPER] retirar:', e); }
  $('wdBtn').disabled=false;
}

$('walletBtn').addEventListener('click',openWallet);
$('marketBtn')?.addEventListener('click',()=>openMarket());
$('walletModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeWallet();});

window.addEventListener('resize',()=>{
  if(canvas&&gameRunning){
    canvas.width=W=window.innerWidth;
    canvas.height=H=window.innerHeight;
    worldW=W*2.4;worldH=H*2.0;
  }
});


/* ══════════ MERCADO ══════════ */
function openMarket() {
  $('marketPanel')?.classList.add('open');
  setText('marketPtsDisplay', GS.pts+' PTS');
  renderMarket();
}
function closeMarket() {
  $('marketPanel')?.classList.remove('open');
}

// Cerrar al click fuera
$('marketPanel')?.addEventListener('click', e => {
  if(e.target === $('marketPanel')) closeMarket();
});

function renderMarket() {
  const grid = $('marketGrid');
  if(!grid) return;
  grid.innerHTML = '';
  const icons = ['🔭','🎯','💥','⚡','🏆'];
  UPGRADES.forEach((u, i) => {
    const nivel = i+1;
    const owned = GS.upgrade >= nivel;
    const available = GS.upgrade === nivel-1;
    const locked = GS.upgrade < nivel-1;
    const card = document.createElement('div');
    card.className = 'upg-card ' + (owned ? 'owned' : available ? 'available' : 'locked');
    card.innerHTML = `
      <div class="upg-icon">${icons[i]}</div>
      <div class="upg-info">
        <div class="upg-name">${u.nombre}</div>
        <div class="upg-desc">${u.desc}</div>
      </div>
      <div class="upg-price ${owned?'owned':''}">${owned ? '✓ COMPRADA' : u.precio+' PTS'}</div>
      ${owned ? '<div class="upg-badge">ACTIVA</div>' : ''}
    `;
    if(available) card.onclick = () => buyUpgrade(nivel, u);
    grid.appendChild(card);
  });
}

async function buyUpgrade(nivel, upg) {
  const msg = $('marketMsg');
  if(GS.pts < upg.precio) {
    showToast({
      icon:'💰', title:'FONDOS INSUFICIENTES', type:'warn',
      msg:'Necesitás <b style="color:var(--warn)">'+upg.precio+' PTS</b> para esta mejora.<br>Depositá CFT en el wallet para obtener PTS.',
      btns:[
        {label:'⬇ IR AL WALLET', cls:'primary', action:()=>{ closeMarket(); openWallet(); }},
        {label:'CANCELAR', cls:'sec'},
      ]
    });
    return;
  }
  if(msg) msg.textContent = 'Procesando...';
  try {
    const res = await apiPost('/play/sniper/upgradessniper.php', {
      action: 'comprar',
      nivel: nivel,
    });
    if(res.success) {
      GS.upgrade = nivel;
      GS.pts = res.pts_balance;
      updateLobby();
      renderMarket();
      setText('marketPtsDisplay', GS.pts+' PTS');
      if(msg) { msg.textContent = '✓ '+upg.nombre+' activada'; msg.style.color='var(--safe)'; }
    } else {
      showToast({icon:'⚠',title:'ERROR',type:'danger',msg:res.message,btns:[{label:'CERRAR',cls:'sec'}]});
    }
  } catch(e) {
    showToast({icon:'📡',title:'SIN CONEXIÓN',type:'danger',msg:'No se pudo procesar la compra.',btns:[{label:'CERRAR',cls:'sec'}]});
  }
}

/* ══════════ TOAST (reemplaza alert) ══════════ */
function showToast({icon='⚠', title='AVISO', msg='', type='warn', btns=[]}) {
  const box = $('toastBox');
  box.className = 'toast-box ' + type;
  $('toastIcon').textContent  = icon;
  $('toastTitle').textContent = title;
  $('toastMsg').innerHTML     = msg;
  const btnsEl = $('toastBtns');
  btnsEl.innerHTML = '';
  btns.forEach(b => {
    const el = document.createElement('button');
    el.className = 'toast-btn ' + (b.cls || 'primary');
    el.textContent = b.label;
    el.onclick = () => { closeToast(); b.action?.(); };
    btnsEl.appendChild(el);
  });
  $('toastModal').classList.add('open');
}
function closeToast() { $('toastModal').classList.remove('open'); }

/* ══════════ VICTORIA FINAL ══════════ */
async function showVictory() {
  stopGame();
  if(_partida_id) {
    try {
      const res = await apiPost(API.partida, {
        action:'cerrar', partida_id:_partida_id,
        oleadas:SES.wave-1, bosses_caidos:SES.bosses,
        bajas:SES.hits, fallos:SES.misses,
        oro_partida:SES.oro,
        modo:SES.mode==='free'?'libre':'operativo',
        presupuesto:SES.budget,
      });
      if(res.success) { GS.pts=res.pts_balance; GS.cft=res.cft_display; GS.oro=res.oro_total; }
    } catch(e) {}
  }
  _partida_id = null;
  setText('victOro', '🪙 '+GS.oro);
  const acc = SES.hits+SES.misses>0 ? Math.round(SES.hits/(SES.hits+SES.misses)*100) : 0;
  const rows = [
    {l:'OLEADAS',      v:ECO.MAX_WAVE},
    {l:'COMANDANTES',  v:SES.bosses},
    {l:'PRECISIÓN',    v:acc+'%'},
    {l:'ORO PARTIDA',  v:'🪙 '+SES.oro},
  ];
  $('victStats').innerHTML = rows.map(r=>`<div class="rs"><span class="rs-l">${r.l}</span><span class="rs-v hi">${r.v}</span></div>`).join('');
  showScreen('victory');
  updateLobby();
}

/* ══════════ GAME OVERS SYSTEM ══════════ */
let _goTimerInterval = null;

function mostrarGoModal() {
  // Calcular precio: 20 pts × (renovaciones + 1), vuelve a 20 tras renovación por tiempo
  const precio = 20 * (GS.goRenovaciones + 1);
  $('goPrecioPagar').textContent = precio;
  const ahora = Math.floor(Date.now()/1000);
  const restante = Math.max(0, GS.goProximaRenovAt - ahora);
  const body = $('goModalBody');
  if(restante <= 0) {
    if(body) body.innerHTML = 'Tus intentos se renovaron.<br>Recargá la página para continuar.';
    $('goModalTimer').textContent = '00:00:00';
  } else {
    if(body) body.innerHTML = 'Agotaste tus 3 intentos diarios.<br>Podés esperar la renovación gratuita en:';
    actualizarGoTimer(restante);
    if(_goTimerInterval) clearInterval(_goTimerInterval);
    _goTimerInterval = setInterval(()=>{
      const r = Math.max(0, GS.goProximaRenovAt - Math.floor(Date.now()/1000));
      actualizarGoTimer(r);
      if(r<=0) { clearInterval(_goTimerInterval); cargarPerfil(); }
    }, 1000);
  }
  $('goModal').classList.add('open');
}

function actualizarGoTimer(seg) {
  const h = Math.floor(seg/3600);
  const m = Math.floor((seg%3600)/60);
  const s = seg%60;
  $('goModalTimer').textContent =
    String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}

function cerrarGoModal() {
  $('goModal').classList.remove('open');
  if(_goTimerInterval) clearInterval(_goTimerInterval);
}

async function pagarRenovacion() {
  const precio = 20 * (GS.goRenovaciones + 1);
  if(GS.pts < precio) {
    showToast({
      icon:'💰', title:'FONDOS INSUFICIENTES', type:'warn',
      msg:'Necesitás <b style="color:var(--warn)">'+precio+' PTS</b> para renovar tus intentos.<br>Depositá CFT en el wallet.',
      btns:[
        {label:'⬇ IR AL WALLET', cls:'primary', action:()=>{ cerrarGoModal(); openWallet(); }},
        {label:'CANCELAR', cls:'sec'},
      ]
    });
    return;
  }
  const btn = $('goBtnPay');
  if(btn) btn.disabled = true;
  try {
    const res = await apiPost('/play/sniper/gameoverssniper.php', {action:'renovar_pago'});
    if(res.success) {
      GS.pts              = res.pts_balance;
      GS.gameOversDisp    = res.game_overs_disp;
      GS.goRenovaciones   = res.go_renovaciones;
      GS.goProximaRenovAt = res.go_proxima_renov;
      cerrarGoModal();
      updateLobby();
    } else {
      showToast({icon:'⚠',title:'ERROR',type:'danger',msg:res.message,btns:[{label:'CERRAR',cls:'sec'}]});
      if(btn) btn.disabled = false;
    }
  } catch(e) {
    showToast({icon:'📡',title:'SIN CONEXIÓN',type:'danger',msg:'No se pudo procesar el pago.',btns:[{label:'CERRAR',cls:'sec'}]});
    if(btn) btn.disabled = false;
  }
}

/* ══════════ MENÚ PAUSA ══════════ */
function togglePauseMenu() {
  const m = $("pauseMenu");
  if(!m) return;
  m.classList.toggle("open");
}

function confirmAbandon() {
  $("pauseMenu").classList.remove("open");
  if(!confirm("¿Abandonar la partida? El oro ganado se guardará.")) return;
  endGame(false);
}

document.addEventListener("click", e => {
  const menu = $("pauseMenu");
  const btn  = $("pauseBtn");
  if(menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove("open");
  }
});

/* ══════════ SALIR DEL JUEGO ══════════ */
function salirDelJuego() {
  showToast({
    icon: '✕',
    title: 'SALIR DEL JUEGO',
    type: 'warn',
    msg: '¿Estás seguro que querés salir de Chain Sniper?<br>Volverás a la página de juegos.',
    btns: [
      {label: '✕ CANCELAR', cls: 'sec'},
      {label: '▶ CONFIRMAR SALIDA', cls: 'primary', action: () => {
        window.location.href = 'https://chainfeed.space/juegos';
      }},
    ]
  });
}

/* ══════════ ARRANQUE ══════════ */
setMode('free');
cargarPerfil();

</script>
</body>
</html>