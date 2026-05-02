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
<title>CHAIN DEFENSE</title>
<link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Rubik+Mono+One&display=swap" rel="stylesheet">
<style>
:root{--p:#00ff88;--s:#00ccff;--a:#ff6644;--g:#ffdd00;--db:#050710;--dp:#0a0f1a;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;overflow:hidden;background:var(--db);font-family:'Audiowide',sans-serif;}
canvas{display:block;}
.screen{position:fixed;inset:0;opacity:0;pointer-events:none;transition:opacity 0.4s;z-index:10;}
.screen.active{opacity:1;pointer-events:auto;}
#lobbyScreen{display:flex;align-items:flex-start;justify-content:center;background:radial-gradient(ellipse at 20% 50%,rgba(0,255,136,.05),transparent 50%),linear-gradient(135deg,#050710,#0a1820);overflow-y:auto;padding:24px 16px;}
.lobby-inner{display:grid;grid-template-columns:1fr 1.2fr;gap:28px;max-width:1100px;width:100%;padding-top:10px;}
.hero-title{font-family:'Rubik Mono One',monospace;font-size:50px;line-height:1;color:transparent;background:linear-gradient(135deg,#00ff88,#00ccff 50%,#ff6644);-webkit-background-clip:text;background-clip:text;letter-spacing:-2px;text-transform:uppercase;margin-bottom:4px;}
.hero-sub{font-size:10px;color:#aaa;letter-spacing:3px;text-transform:uppercase;margin-bottom:18px;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
.stat-box{background:rgba(0,255,136,.07);border-left:3px solid var(--p);padding:10px;border-radius:8px;}
.stat-label{font-size:9px;text-transform:uppercase;color:#666;letter-spacing:1px;}
.stat-value{font-size:22px;color:var(--p);font-weight:900;margin-top:3px;}
.panel{display:grid;gap:14px;}
.section{background:rgba(10,15,26,.88);border:1px solid rgba(0,204,255,.18);border-radius:12px;padding:16px;backdrop-filter:blur(20px);}
.section-title{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--s);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(0,204,255,.1);font-weight:700;}
.btn{padding:10px 14px;border:none;border-radius:6px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .3s;font-family:'Audiowide',sans-serif;font-size:10px;}
.btn-play{background:linear-gradient(135deg,var(--p),#00ffaa);color:#000;box-shadow:0 0 18px rgba(0,255,136,.3);width:100%;margin-top:8px;padding:13px;}
.btn-play:hover{transform:scale(1.03);box-shadow:0 0 32px rgba(0,255,136,.5);}
.btn-play:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.btn-sec{background:rgba(0,204,255,.1);border:2px solid var(--s);color:var(--s);width:100%;margin-top:7px;}
.btn-sec:hover{background:rgba(0,204,255,.22);}
.btn-green{background:rgba(0,255,136,.08);border:2px solid var(--p);color:var(--p);width:100%;margin-top:7px;}
.btn-shop{background:rgba(255,221,0,.08);border:2px solid var(--g);color:var(--g);width:100%;margin-top:7px;}
.mode-toggle{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}
.mode-btn{padding:9px;border-radius:8px;font-family:'Audiowide',sans-serif;font-size:9px;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:1px;border:2px solid rgba(0,204,255,.25);background:rgba(0,0,0,.3);color:#555;transition:all .25s;}
.mode-btn.active-free{border-color:var(--s);color:var(--s);background:rgba(0,204,255,.1);}
.mode-btn.active-bet{border-color:var(--g);color:var(--g);background:rgba(255,221,0,.08);}
.bet-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:10px;}
.bet-opt{padding:8px 4px;background:rgba(0,255,136,.06);border:2px solid rgba(0,255,136,.18);border-radius:8px;color:#888;font-size:9px;font-weight:700;text-align:center;cursor:pointer;transition:all .22s;font-family:'Audiowide',sans-serif;}
.bet-opt:hover,.bet-opt.selected{border-color:var(--p);color:var(--p);background:rgba(0,255,136,.16);}
.bet-input{background:rgba(5,10,20,.9);border:2px solid var(--p);border-radius:6px;padding:7px 10px;color:var(--p);font-family:'Audiowide',sans-serif;font-size:11px;width:100%;text-align:right;margin-bottom:8px;}
.bet-input:focus{outline:none;border-color:var(--s);}
.bet-preview{background:rgba(255,221,0,.06);border:1px solid rgba(255,221,0,.2);border-radius:8px;padding:9px 11px;font-size:9px;color:#888;line-height:1.8;margin-top:8px;}
#gameScreen{position:fixed;inset:0;overflow:hidden;}
#gameCanvas{width:100%;height:100%;}
.hud-top{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:6px 10px;background:rgba(5,7,16,.93);border-bottom:1px solid rgba(0,204,255,.12);z-index:50;pointer-events:none;gap:6px;flex-wrap:wrap;}
.hi{display:flex;flex-direction:column;align-items:center;min-width:52px;}
.hi-label{font-size:7px;text-transform:uppercase;letter-spacing:1px;color:#444;}
.hi-val{font-size:13px;font-weight:700;color:var(--p);}
.hi-val.acc{color:var(--a);}
.hi-val.gld{color:var(--g);}
.hi-val.blu{color:var(--s);}
.hud-hp{flex:1;max-width:180px;}
.hud-hp-label{font-size:7px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;display:flex;justify-content:space-between;}
.hp-bar{height:6px;background:rgba(255,0,0,.18);border-radius:4px;overflow:hidden;border:1px solid rgba(255,34,68,.25);}
.hp-fill{height:100%;border-radius:4px;transition:width .3s;}
.hp-fill.h{background:linear-gradient(90deg,#00ff88,#00cc66);}
.hp-fill.m{background:linear-gradient(90deg,#ffdd00,#ff8800);}
.hp-fill.l{background:linear-gradient(90deg,#ff2244,#ff6644);}
.hud-lives{display:flex;gap:2px;font-size:14px;pointer-events:auto;}
.wave-badge{background:rgba(0,204,255,.12);border:1px solid var(--s);border-radius:6px;padding:3px 8px;font-size:8px;color:var(--s);font-weight:700;text-transform:uppercase;pointer-events:auto;white-space:nowrap;}
.wave-badge.boss{border-color:var(--a);color:var(--a);background:rgba(255,102,68,.12);animation:pboss .8s ease infinite;}
@keyframes pboss{0%,100%{box-shadow:none}50%{box-shadow:0 0 10px rgba(255,102,68,.5)}}
.hud-bottom{position:fixed;bottom:0;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:5px;padding:6px 10px;background:rgba(5,7,16,.95);border-top:1px solid rgba(0,204,255,.1);z-index:50;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;}
.hud-bottom::-webkit-scrollbar{display:none;}
.tc{background:rgba(10,15,26,.9);border:2px solid rgba(0,204,255,.18);border-radius:9px;padding:5px 8px;cursor:pointer;transition:all .22s;min-width:68px;text-align:center;flex-shrink:0;position:relative;}
.tc:hover{border-color:var(--s);transform:translateY(-2px);}
.tc.sel{border-color:var(--p);background:rgba(0,255,136,.1);}
.tc.locked{opacity:.45;cursor:not-allowed;}
.tc.locked:hover{transform:none;border-color:rgba(0,204,255,.18);}
.tc-emoji{font-size:18px;margin-bottom:1px;}
.tc-name{font-size:7px;color:#888;text-transform:uppercase;letter-spacing:.5px;}
.tc-cost{font-size:8px;color:var(--g);font-weight:700;}
.tc-lock{position:absolute;top:2px;right:3px;font-size:9px;}
.hud-gold{background:rgba(255,221,0,.08);border:1px solid rgba(255,221,0,.25);border-radius:7px;padding:4px 9px;font-size:11px;color:var(--g);font-weight:700;white-space:nowrap;}
.menu-btn{background:rgba(5,7,16,.9);border:2px solid rgba(0,204,255,.35);border-radius:7px;width:34px;height:34px;color:var(--s);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;position:fixed;top:48px;right:10px;z-index:60;transition:all .2s;}
.speed-controls{display:flex;gap:3px;position:fixed;top:48px;left:10px;z-index:60;}
.spd-btn{background:rgba(5,7,16,.9);border:1px solid rgba(0,204,255,.25);border-radius:5px;padding:2px 8px;color:#666;font-family:'Audiowide',sans-serif;font-size:9px;cursor:pointer;transition:all .18s;}
.spd-btn.active{border-color:var(--p);color:var(--p);}
.wave-ann{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:70;text-align:center;pointer-events:none;opacity:0;transition:opacity .35s;}
.wave-ann.show{opacity:1;}
.wave-ann-title{font-family:'Rubik Mono One',monospace;font-size:42px;color:var(--p);text-shadow:0 0 24px rgba(0,255,136,.5);}
.wave-ann-title.boss{color:var(--a);text-shadow:0 0 24px rgba(255,102,68,.6);}
.wave-ann-sub{font-size:10px;color:#888;letter-spacing:3px;text-transform:uppercase;margin-top:5px;}
.tp{position:fixed;z-index:65;background:rgba(8,12,24,.97);border:2px solid var(--s);border-radius:11px;padding:13px;min-width:180px;display:none;}
.tp.show{display:block;}
.tp-title{font-size:10px;color:var(--s);font-weight:700;text-transform:uppercase;margin-bottom:6px;}
.tp-stat{font-size:9px;color:#888;display:flex;justify-content:space-between;padding:2px 0;}
.tp-stat span{color:var(--p);}
.tp-btn{width:100%;margin-top:7px;padding:7px;border-radius:5px;font-family:'Audiowide',sans-serif;font-size:9px;font-weight:700;cursor:pointer;text-transform:uppercase;transition:all .22s;}
.tp-upg{background:rgba(0,255,136,.1);border:2px solid var(--p);color:var(--p);}
.tp-upg:hover:not(:disabled){background:rgba(0,255,136,.25);}
.tp-upg:disabled{opacity:.35;cursor:not-allowed;}
.tp-sell{background:rgba(255,102,68,.08);border:1px solid rgba(255,102,68,.35);color:var(--a);}
.tp-sell:hover{background:rgba(255,102,68,.22);}
.tp-close{position:absolute;top:6px;right:8px;background:none;border:none;color:#444;font-size:14px;cursor:pointer;}
.tp-close:hover{color:var(--a);}
.dd{position:fixed;top:50px;right:50px;background:rgba(8,12,24,.97);border:2px solid rgba(0,204,255,.3);border-radius:11px;padding:13px;z-index:65;min-width:220px;flex-direction:column;gap:6px;backdrop-filter:blur(20px);display:none;}
.dd.open{display:flex;}
.dd-title{font-size:8px;color:#444;text-transform:uppercase;letter-spacing:2px;padding-bottom:4px;border-bottom:1px solid rgba(0,204,255,.1);}
.dd-info{background:rgba(0,255,136,.05);border:1px solid rgba(0,255,136,.12);border-radius:7px;padding:8px;font-size:9px;color:#888;line-height:1.9;}
.dd-info span{color:var(--p);font-weight:700;}
.btn-dd-exit{background:rgba(255,102,68,.1);border:2px solid var(--a);color:var(--a);padding:8px;}
.btn-dd-cont{background:rgba(0,255,136,.1);border:2px solid var(--p);color:var(--p);padding:8px;}
.revive-ov{position:fixed;inset:0;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);z-index:80;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;}
.revive-ov.show{opacity:1;pointer-events:auto;}
.revive-card{background:var(--dp);border:2px solid var(--a);border-radius:14px;padding:26px;max-width:360px;width:92%;text-align:center;animation:popin .35s ease;}
.revive-title{font-family:'Rubik Mono One',monospace;font-size:26px;color:var(--a);margin-bottom:6px;}
.revive-sub{font-size:9px;color:#666;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;}
.revive-lives{font-size:20px;margin-bottom:12px;letter-spacing:4px;}
.revive-cost{background:rgba(255,221,0,.07);border:1px solid rgba(255,221,0,.22);border-radius:8px;padding:10px;margin-bottom:14px;font-size:10px;color:#888;line-height:1.9;}
.revive-cost strong{color:var(--g);font-size:14px;}
.revive-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.btn-revive{background:rgba(255,221,0,.12);border:2px solid var(--g);color:var(--g);padding:11px;border-radius:7px;font-family:'Audiowide',sans-serif;font-size:9px;font-weight:700;cursor:pointer;text-transform:uppercase;transition:all .22s;}
.btn-revive:hover:not(:disabled){background:rgba(255,221,0,.28);}
.btn-revive:disabled{opacity:.3;cursor:not-allowed;}
.btn-giveup{background:rgba(255,102,68,.08);border:2px solid var(--a);color:var(--a);padding:11px;border-radius:7px;font-family:'Audiowide',sans-serif;font-size:9px;font-weight:700;cursor:pointer;text-transform:uppercase;transition:all .22s;}
.btn-giveup:hover{background:rgba(255,102,68,.22);}
#resultScreen{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#060210,#0a1015);}
.result-card{background:rgba(10,15,26,.96);border-radius:14px;padding:28px;max-width:440px;width:92%;animation:popin .45s cubic-bezier(.34,1.56,.64,1);}
@keyframes popin{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
.result-card.win{border:3px solid var(--p);box-shadow:0 0 50px rgba(0,255,136,.2);}
.result-card.lose{border:3px solid var(--a);box-shadow:0 0 50px rgba(255,34,68,.2);}
.result-title{font-family:'Rubik Mono One',monospace;font-size:34px;margin-bottom:16px;}
.result-title.win{color:var(--p);}
.result-title.lose{color:var(--a);}
.rs{background:rgba(0,0,0,.28);border-left:3px solid var(--p);padding:8px 11px;border-radius:5px;display:flex;justify-content:space-between;font-size:9px;font-weight:700;text-transform:uppercase;margin-bottom:6px;}
.rs.lose-r{border-left-color:var(--a);}
.rs.gold-r{border-left-color:var(--g);background:rgba(255,221,0,.04);}
.rs.tot-r{border-left-color:var(--p);background:rgba(0,255,136,.06);}
.rs-label{color:#888;}
.rs-val{color:var(--p);font-size:13px;}
.rs.lose-r .rs-val{color:var(--a);}
.rs.gold-r .rs-val{color:var(--g);}
.rs.tot-r .rs-val{font-size:16px;}
.result-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px;}
#loadingScreen{display:flex;align-items:center;justify-content:center;background:#050710;}
.spinner{width:60px;height:60px;border:3px solid rgba(0,255,136,.12);border-top-color:var(--p);border-radius:50%;animation:spin 1.1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.load-txt{position:absolute;bottom:28px;font-size:10px;color:var(--s);text-transform:uppercase;letter-spacing:2px;}


.modal-ov {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.82);
  backdrop-filter: blur(7px);
  z-index: 200;
  
  /* DEFAULT: oculto */
  display: none;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  
  transition: opacity 0.3s ease;
}

/* CUANDO TIENE .open: MOSTRAR */
.modal-ov.open {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

/* Específicamente para walletModal */
#walletModal {
  /* Empty — heredará de .modal-ov */
}

#walletModal.open {
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box{background:var(--dp);border-radius:14px;padding:22px;max-width:420px;width:92%;position:relative;animation:popin .28s ease;max-height:90vh;overflow-y:auto;}
.modal-close{position:absolute;top:10px;right:10px;background:none;border:none;color:#444;font-size:17px;cursor:pointer;}
.modal-close:hover{color:var(--a);}
.modal-title{font-family:'Rubik Mono One',monospace;font-size:17px;margin-bottom:3px;}
.modal-sub{font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:14px;}
#shopModal .modal-box{border:2px solid var(--g);max-width:560px;}
.shop-title{color:var(--g);}
.shop-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.shop-item{background:rgba(0,0,0,.3);border:2px solid rgba(0,204,255,.18);border-radius:10px;padding:13px;text-align:center;cursor:pointer;transition:all .25s;position:relative;}
.shop-item:hover{border-color:var(--s);transform:translateY(-2px);}
.shop-item.owned{border-color:var(--p);background:rgba(0,255,136,.06);cursor:default;}
.shop-item.owned:hover{transform:none;}
.shop-emoji{font-size:28px;margin-bottom:6px;}
.shop-name{font-size:10px;font-weight:700;color:#ddd;text-transform:uppercase;margin-bottom:3px;}
.shop-desc{font-size:8px;color:#666;line-height:1.6;margin-bottom:8px;}
.shop-price{font-size:11px;color:var(--g);font-weight:700;}
.shop-owned-badge{position:absolute;top:5px;right:7px;font-size:8px;color:var(--p);font-weight:700;letter-spacing:1px;}
.shop-balance{display:flex;justify-content:space-between;align-items:center;background:rgba(0,204,255,.05);border:1px solid rgba(0,204,255,.15);border-radius:7px;padding:8px 11px;margin-bottom:14px;font-size:9px;}
.shop-balance span:first-child{color:#555;text-transform:uppercase;letter-spacing:1px;}
#rankingModal .modal-box{border:2px solid var(--g);max-width:500px;}
.ranking-title{color:var(--g);}
.podium{display:flex;justify-content:center;align-items:flex-end;gap:8px;margin-bottom:16px;}
.podium-slot{display:flex;flex-direction:column;align-items:center;gap:3px;}
.podium-name{font-size:9px;font-weight:700;color:#fff;text-transform:uppercase;max-width:68px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.podium-score{font-size:8px;color:#666;}
.podium-prize{font-size:8px;color:var(--g);font-weight:700;}
.podium-bar{border-radius:5px 5px 0 0;width:64px;display:flex;align-items:center;justify-content:center;font-size:17px;}
.podium-bar.first{height:68px;background:rgba(255,221,0,.18);border:2px solid var(--g);color:#ffdd00;}
.podium-bar.second{height:48px;background:rgba(192,192,192,.12);border:2px solid #aaa;color:#cccccc;}
.podium-bar.third{height:32px;background:rgba(205,127,50,.12);border:2px solid #cd7f32;color:#cd7f32;}
.ranking-table{display:flex;flex-direction:column;gap:3px;max-height:180px;overflow-y:auto;margin-bottom:10px;}
.rank-row{display:flex;align-items:center;gap:6px;background:rgba(255,221,0,.03);border:1px solid rgba(255,221,0,.1);border-radius:6px;padding:6px 9px;}
.podium-slot{display:flex;flex-direction:column;align-items:center;gap:3px;}
.rank-num{font-size:10px;font-weight:900;color:#aaa;min-width:18px;}
.rank-name{flex:1;font-size:9px;font-weight:700;color:#fff;text-transform:uppercase;}
.rank-pts{font-size:9px;color:#aaa;}
.rank-prize{font-size:8px;color:var(--g);font-weight:700;min-width:52px;text-align:right;}
.ranking-reset{font-size:8px;color:#222;text-align:center;letter-spacing:1px;}
#walletModal .modal-box{border:2px solid var(--s);}
.wallet-title{color:var(--s);}
.wallet-tabs{display:flex;margin-bottom:14px;border-bottom:2px solid rgba(0,204,255,.1);}
.wallet-tab{flex:1;padding:7px;background:none;border:none;color:#333;font-family:'Audiowide',sans-serif;font-size:8px;text-transform:uppercase;letter-spacing:1px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;font-weight:700;transition:all .22s;}
.wallet-tab.active{color:var(--s);border-bottom-color:var(--s);}
.wallet-panel{display:none;flex-direction:column;gap:10px;}
.wallet-panel.active{display:flex;}
.rate-box{background:rgba(0,255,136,.04);border:1px solid rgba(0,255,136,.15);border-radius:6px;padding:7px 11px;display:flex;justify-content:space-between;font-size:9px;}
.rate-label{color:#555;text-transform:uppercase;letter-spacing:1px;}
.rate-value{color:var(--p);font-weight:700;}
.wi-label{font-size:8px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700;margin-bottom:3px;}
.wi-row{display:flex;gap:6px;align-items:center;}
.wallet-input{background:rgba(5,10,20,.9);border:2px solid var(--s);border-radius:5px;padding:7px 9px;color:var(--s);font-family:'Audiowide',sans-serif;font-size:11px;width:100%;text-align:right;}
.wallet-input:focus{outline:none;box-shadow:0 0 12px rgba(0,204,255,.2);}
.wunit{font-size:9px;color:#555;white-space:nowrap;}
.wbal-row{display:flex;justify-content:space-between;font-size:9px;color:#444;padding:4px 0;border-top:1px solid rgba(0,204,255,.07);}
.wbal-row span{color:var(--s);font-weight:700;}
.wmsg{font-size:9px;text-align:center;padding:5px;border-radius:5px;min-height:26px;display:flex;align-items:center;justify-content:center;}
.wmsg.ok{background:rgba(0,255,136,.08);border:1px solid rgba(0,255,136,.22);color:var(--p);}
.wmsg.err{background:rgba(255,102,68,.08);border:1px solid rgba(255,102,68,.22);color:var(--a);}
.wmsg.warn{background:rgba(255,221,0,.06);border:1px solid rgba(255,221,0,.18);color:var(--g);}
.btn-wa{width:100%;padding:10px;border-radius:7px;font-family:'Audiowide',sans-serif;font-size:9px;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:1px;transition:all .22s;border:none;}
.btn-dep{background:rgba(0,255,136,.12);border:2px solid var(--p);color:var(--p);}
.btn-dep:hover:not(:disabled){background:rgba(0,255,136,.28);}
.btn-wd{background:rgba(255,221,0,.08);border:2px solid var(--g);color:var(--g);}
.btn-wd:hover:not(:disabled){background:rgba(255,221,0,.22);}
.btn-wa:disabled{opacity:.28;cursor:not-allowed;}
.wd-cd{background:rgba(255,221,0,.04);border:1px solid rgba(255,221,0,.15);border-radius:7px;padding:8px;text-align:center;}
.wd-cd-label{font-size:8px;color:#444;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;}
.wd-cd-timer{font-size:17px;font-family:'Rubik Mono One',monospace;color:var(--g);}
.saldo-hdr{display:flex;justify-content:space-between;align-items:center;background:rgba(0,204,255,.05);border:1px solid rgba(0,204,255,.18);border-radius:7px;padding:7px 11px;margin-bottom:10px;font-size:9px;}
.saldo-hdr span:first-child{color:#555;text-transform:uppercase;letter-spacing:1px;}
@media(max-width:860px){.lobby-inner{grid-template-columns:1fr}.bet-opts{grid-template-columns:repeat(2,1fr)}.shop-grid{grid-template-columns:1fr}}
@media(max-width:560px){.hero-title{font-size:34px}.hud-top{padding:4px 6px}.hi{min-width:44px}.hi-val{font-size:11px}.tc{min-width:58px}}
/* ═══════════════════════════════════
   CUSTOM SCROLLBARS — GAME STYLE
═══════════════════════════════════ */

/* Webkit (Chrome, Edge, Safari) */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 204, 255, 0.04);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #00ff88, #00ccff);
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.4);
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #00ffaa, #00eeff);
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.7);
}
::-webkit-scrollbar-corner {
  background: transparent;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #00ff88 rgba(0, 204, 255, 0.04);
}
</style>
</head>
<body>

<!-- LOBBY -->
<div id="lobbyScreen" class="screen active">
  <div class="lobby-inner">
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
  <div style="display:flex;align-items:center;gap:12px;">
    <img id="userAvatar" style="width:50px;height:50px;border-radius:50%;border:2px solid var(--p);object-fit:cover;display:none;">
    <div>
      <div style="font-size:10px;color:#666;text-transform:uppercase;letter-spacing:1px;">Jugador</div>
      <div id="userName" style="font-size:14px;font-weight:700;color:var(--s);">PLAYER</div>
    </div>
  </div>
  <a href="https://chainfeed.space/juegos" style="display:flex;align-items:center;gap:6px;background:rgba(255,102,68,.08);border:2px solid rgba(255,102,68,.35);border-radius:8px;padding:8px 12px;color:var(--a);font-family:'Audiowide',sans-serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-decoration:none;transition:all .22s;" onmouseover="this.style.background='rgba(255,102,68,.2)'" onmouseout="this.style.background='rgba(255,102,68,.08)'">
    🚪 SALIR
  </a>
</div>
    <div class="hero">
      <h1 class="hero-title">CHAIN<br>DEFENSE</h1>
      <p class="hero-sub">⬡ Protege tu nodo · Multiplicá tus CFT</p>
      <div class="stat-grid">
        <div class="stat-box"><div class="stat-label">BALANCE 💎</div><div class="stat-value" id="lbPoints">0</div></div>
        <div class="stat-box"><div class="stat-label">PARTIDAS</div><div class="stat-value" id="lbGames">0</div></div>
        <div class="stat-box"><div class="stat-label">OLEADA MÁX</div><div class="stat-value" id="lbMaxWave">0</div></div>
<div class="stat-box"><div class="stat-label">MEJOR GANANCIA</div><div class="stat-value" id="lbBestProfit" style="color:var(--g)">0</div></div>
    </div>
      <div class="section">
        <div class="section-title">📖 MECÁNICA</div>
        <div style="font-size:9px;color:#888;line-height:2">
          <p>⬡ Colocá torres para defender tu nodo CFT</p>
          <p>🆓 <b style="color:var(--s)">GRATIS:</b> Gana 1 CFT por cada BOSS derrotado</p>
          <p>💰 <b style="color:var(--g)">APOSTANDO (mín 100 CFT):</b> Presupuesto = inversión para torres</p>
          <p>❤️ <b style="color:var(--a)">3 VIDAS:</b> Gastarás presupuesto en revivir</p>
          <p>☠️ Pierde antes de boss → pierdes todo</p>
          <p>👾 Mata boss → ganas checkpoint (lo guardado)</p>
          <p>🏆 Oleada más alta → ranking mensual</p>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="section">
        <div class="section-title">🎮 MODO DE JUEGO</div>
        <div class="mode-toggle">
          <button class="mode-btn active-free" id="modeFreeBtn" onclick="setMode('free')">🆓 GRATIS<br><span style="font-size:8px;color:#666">+1 CFT/boss</span></button>
          <button class="mode-btn" id="modeBetBtn" onclick="setMode('bet')">💰 APOSTAR<br><span style="font-size:8px;color:#666">Presupuesto en juego</span></button>
        </div>
        <div id="betSection" style="display:none">
          <div class="section-title" style="margin-top:2px">💎 PRESUPUESTO (mín. 100 PTS)</div>
<div class="bet-opts">
  <div class="bet-opt selected" data-bet="100">100 PTS</div>
  <div class="bet-opt" data-bet="250">250 PTS</div>
  <div class="bet-opt" data-bet="500">500 PTS</div>
  <div class="bet-opt" data-bet="1000">1000 PTS</div>
</div>
          <input type="number" class="bet-input" id="betCustom" placeholder="Personalizado (mín 50 PTS)" min="50" step="10">
        </div>
        <div id="freeSection">
<div style="background:rgba(0,255,136,.07);border:1px solid rgba(0,255,136,.15);border-radius:8px;padding:10px;margin-bottom:10px;font-size:9px;color:#666;line-height:1.9">
  <p>Ganas: <b style="color:var(--s)">+1 PTS por boss derrotado</b></p>
            <p>Solo checkpoints en bosses · Sin riesgo</p>
          </div>
        </div>
        <button class="btn btn-play" id="playBtn">⬡ DEFENDER EL NODO</button>
        <button class="btn btn-shop" id="shopBtnLobby">🛒 TIENDA DE TORRES</button>
        <button class="btn btn-sec" id="rankingBtn">🏆 RANKING MENSUAL</button>
        <button class="btn btn-green" id="walletBtn">💎 WALLET CFT</button>
      </div>
      <div class="section" id="towerGuide">
        <div class="section-title">🗼 TORRES DISPONIBLES</div>
        <div id="towerGuideList" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:8px;color:#888;line-height:1.7"></div>
      </div>
    </div>
  </div>
</div>

<!-- GAME -->
<div id="gameScreen" class="screen">
  <canvas id="gameCanvas"></canvas>
  <div class="hud-top">
      <div style="display:flex;align-items:center;gap:6px;min-width:100px;">
    <img id="gameUserAvatar" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--p);object-fit:cover;display:none;">
    <div style="font-size:8px;color:#888;text-transform:uppercase;">
      <div id="gameUserName" style="color:var(--s);font-weight:700;">PLAYER</div>
    </div>
  </div>
    <div class="hi"><div class="hi-label">OLEADA</div><div class="hi-val blu" id="hudWave">—</div></div>
    <div class="hi"><div class="hi-label">ENEMIGOS</div><div class="hi-val acc" id="hudEnemies">—</div></div>
    <div class="hud-hp">
      <div class="hud-hp-label"><span>NODO CFT</span><span id="hudHpNum">—</span></div>
      <div class="hp-bar"><div class="hp-fill h" id="hpFill" style="width:100%"></div></div>
    </div>
    <div class="hud-lives" id="hudLives">❤️❤️❤️</div>
    <div class="hi"><div class="hi-label">GANANCIA</div><div class="hi-val gld" id="hudProfit">+0</div></div>
    <div class="wave-badge" id="waveBadge">—</div>
  </div>
  <div class="speed-controls">
    <button class="spd-btn active" id="spd1x" onclick="setSpeed(1)">1×</button>
    <button class="spd-btn" id="spd2x" onclick="setSpeed(2)">2×</button>
  </div>
  <button class="menu-btn" id="ingameMenuBtn">☰</button>
  <div class="dd" id="ingameDD">
    <div class="dd-title">MENÚ</div>
    <div class="dd-info" id="ddInfo">...</div>
    <button class="btn btn-dd-cont" onclick="closeDD()">▶ CONTINUAR</button>
    <button class="btn btn-dd-exit" id="ddExitBtn">🚪 ABANDONAR</button>
  </div>
  <div class="hud-bottom" id="hudBottom">
    <div class="hud-gold">🪙 <span id="hudGold">0</span></div>
  </div>
  <div class="wave-ann" id="waveAnn">
    <div class="wave-ann-title" id="waveAnnTitle">—</div>
    <div class="wave-ann-sub" id="waveAnnSub">—</div>
  </div>
  <div class="tp" id="towerPopup">
    <button class="tp-close" onclick="closePopup()">✕</button>
    <div class="tp-title" id="tpTitle">—</div>
    <div class="tp-stat">Nivel <span id="tpLevel">1</span></div>
    <div class="tp-stat">Daño <span id="tpDmg">—</span></div>
    <div class="tp-stat">Rango <span id="tpRange">—</span></div>
    <div class="tp-stat">Cadencia <span id="tpRate">—</span></div>
    <button class="tp-btn tp-upg" id="tpUpgBtn" onclick="upgradeTower()">UPGRADE — <span id="tpUpgCost">—</span>🪙</button>
    <button class="tp-btn tp-sell" onclick="sellTower()">VENDER +<span id="tpSellVal">—</span>🪙</button>
  </div>
</div>

<!-- REVIVE -->
<div class="revive-ov" id="reviveOv">
  <div class="revive-card">
    <div class="revive-title">☠ NODO CAÍDO</div>
    <div class="revive-sub">¿RECOMPRAR VIDA?</div>
    <div class="revive-lives" id="reviveLives">❤️❤️❤️</div>
    <div class="revive-cost">
      Vidas restantes: <strong id="reviveLivesLeft">—</strong><br>
      Costo en presupuesto: <strong id="reviveCost">—</strong><br>
      Tu presupuesto: <strong id="reviveBalance">—</strong>
    </div>
    <div class="revive-btns">
      <button class="btn-revive" id="reviveBuyBtn" onclick="doRevive()">❤️ REVIVIR</button>
      <button class="btn-giveup" onclick="giveUp()">☠ RENDIRSE</button>
    </div>
  </div>
</div>

<!-- LOADING -->
<div id="loadingScreen" class="screen">
  <div class="spinner"></div>
  <div class="load-txt">INICIANDO DEFENSA...</div>
</div>

<!-- RESULT -->
<div id="resultScreen" class="screen">
  <div class="result-card win" id="resultCard">
    <div style="text-align:center;margin-bottom:14px;">
      <img id="resultUserAvatar" style="width:40px;height:40px;border-radius:50%;border:2px solid var(--p);object-fit:cover;display:none;margin:0 auto 8px;">
      <div id="resultUserName" style="font-size:11px;color:var(--s);font-weight:700;text-transform:uppercase;"></div>
    </div>
    <h2 class="result-title win" id="resultTitle">—</h2>
    <div id="resultStats"></div>
    <div class="result-btns">
      <button class="btn btn-play" id="retryBtn">REINTENTAR</button>
      <button class="btn btn-sec" id="menuBtn">MENÚ</button>
    </div>
  </div>
</div>

<!-- SHOP -->
<div class="modal-ov" id="shopModal">
  <div class="modal-box">
    <button class="modal-close" onclick="closeShop()">✕</button>
    <h3 class="modal-title shop-title">🛒 TIENDA DE TORRES</h3>
    <p class="modal-sub">COMPRA PERMANENTE CON CFT</p>
    <div class="shop-balance">
      <span>Tu balance</span>
      <span id="shopBalDisplay" style="color:var(--g);font-weight:900;font-size:12px">0 CFT</span>
    </div>
    <div class="shop-grid" id="shopGrid"></div>
  </div>
</div>

<!-- RANKING -->
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

<!-- WALLET -->
<div class="modal-ov" id="walletModal">
  <div class="modal-box">
    <button class="modal-close" onclick="closeWallet()">✕</button>
    <h3 class="modal-title wallet-title">💎 WALLET CFT</h3>
    <div class="saldo-hdr">
      <span>Saldo</span>
      <span id="wCftBal" style="color:var(--s);font-weight:900;font-size:13px">0 PTS</span>
    </div>
    <div class="wallet-tabs">
      <button class="wallet-tab active" data-wtab="deposit" onclick="switchWT('deposit')">⬇ DEPOSITAR</button>
      <button class="wallet-tab" data-wtab="withdraw" onclick="switchWT('withdraw')">⬆ RETIRAR</button>
    </div>
    <div class="wallet-panel active" id="wpDep">
      <div class="rate-box"><span class="rate-label">Tasa</span><span class="rate-value">1 CFT = 1 CFT presupuesto</span></div>
      <div><div class="wi-label">CFT a depositar</div><div class="wi-row"><input type="number" class="wallet-input" id="depAmt" min="1" step="1" placeholder="0" oninput="updateDep()"><span class="wunit">CFT</span></div></div>
      <div class="wbal-row"><span>Balance actual</span><span id="depCur">0 CFT</span></div>
      <div class="wbal-row"><span>Tras depósito</span><span id="depAfter">0 CFT</span></div>
      <div class="wmsg" id="depMsg"></div>
      <button class="btn-wa btn-dep" id="depBtn" disabled onclick="doDeposit()">⬇ DEPOSITAR</button>
    </div>
    <div class="wallet-panel" id="wpWd">
      <div class="wd-cd" id="wdCdBlock" style="display:none"><div class="wd-cd-label">⏳ Próximo retiro en</div><div class="wd-cd-timer" id="wdTimer">--:--:--</div></div>
      <div id="wdFormBlock">
        <div><div class="wi-label">CFT a retirar (mín 5)</div><div class="wi-row"><input type="number" class="wallet-input" id="wdAmt" min="5" step="1" placeholder="5" oninput="updateWd()"><span class="wunit">CFT</span></div></div>
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
const $=id=>document.getElementById(id);
const setText=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
const setHTML=(id,v)=>{const e=$(id);if(e)e.innerHTML=v;};

/* ═══════════════════════════════════
   ECONOMY CONFIG - NUEVO SISTEMA
═══════════════════════════════════ */
const ECO={
  MIN_BET:100, REVIVE_BUDGET_PCT:0.5,
  MAX_LIVES:3, WITHDRAW_MIN:5, WITHDRAW_CD:86400000,
};

/* ═══════════════════════════════════
   TOWER DEFINITIONS
═══════════════════════════════════ */
const TDEFS={
  basic:{
    name:'BÁSICA',emoji:'⚡',color:'#00ff88',cost:80,
    dmg:20,range:130,rate:1.0,aoe:0,slow:0,
    upgCost:[90,180,300],upgDmg:[8,10,12],upgRange:[15,15,20],
    locked:false,shopCost:0,
    desc:'Cadencia alta, daño moderado'
  },
  cryo:{
    name:'CRYO',emoji:'❄️',color:'#00ccff',cost:140,
    dmg:12,range:145,rate:0.75,aoe:0,slow:0.45,
    upgCost:[150,260,400],upgDmg:[5,6,8],upgRange:[15,15,20],
    locked:false,shopCost:0,
    desc:'Ralentiza enemigos un 45%'
  },
  cannon:{
    name:'CAÑÓN',emoji:'💥',color:'#ff6644',cost:200,
    dmg:60,range:155,rate:0.45,aoe:50,slow:0,
    upgCost:[220,360,500],upgDmg:[22,28,36],upgRange:[15,15,25],
    locked:false,shopCost:0,
    desc:'Alto daño en área'
  },
  nexus:{
    name:'NEXO',emoji:'⬡',color:'#ffdd00',cost:320,
    dmg:10,range:120,rate:0.65,aoe:0,slow:0,boost:0.28,
    upgCost:[300,460,650],upgDmg:[4,6,8],upgRange:[10,10,15],
    locked:false,shopCost:0,
    desc:'Potencia torres cercanas +28%'
  },
  sniper:{
    name:'FRANCO',emoji:'🎯',color:'#ff00ff',cost:280,
    dmg:180,range:380,rate:0.28,aoe:0,slow:0,
    upgCost:[300,500,700],upgDmg:[60,80,100],upgRange:[30,30,40],
    locked:true,shopCost:150,
    desc:'Alcance enorme'
  },
  laser:{
    name:'LÁSER',emoji:'🔴',color:'#ff2244',cost:260,
    dmg:0,range:170,rate:99,aoe:0,slow:0,isLaser:true,dps:35,
    upgCost:[280,450,600],upgDmg:[12,16,22],upgRange:[15,20,25],
    locked:true,shopCost:200,
    desc:'Rayo continuo'
  },
  missile:{
    name:'MISILES',emoji:'🚀',color:'#ff8800',cost:300,
    dmg:90,range:200,rate:0.35,aoe:60,slow:0,isMissile:true,
    upgCost:[320,520,720],upgDmg:[30,40,55],upgRange:[20,20,30],
    locked:true,shopCost:250,
    desc:'Busca enemigos con más HP'
  },
  electric:{
    name:'ELÉCT.',emoji:'⚡⚡',color:'#aaff00',cost:240,
    dmg:28,range:150,rate:0.6,aoe:0,slow:0.2,isChain:true,chainCount:3,
    upgCost:[260,420,580],upgDmg:[10,14,18],upgRange:[12,15,20],
    locked:true,shopCost:180,
    desc:'Daño en cadena'
  },
  mortar:{
    name:'MORTERO',emoji:'🪨',color:'#aa8844',cost:350,
    dmg:110,range:240,rate:0.25,aoe:80,slow:0,isMortar:true,
    upgCost:[380,600,800],upgDmg:[40,55,70],upgRange:[20,25,35],
    locked:true,shopCost:220,
    desc:'Largo alcance · gran explosión'
  },
  tesla:{
    name:'TESLA',emoji:'🌩️',color:'#8866ff',cost:290,
    dmg:45,range:135,rate:0.5,aoe:0,slow:0.3,isPulse:true,pulseRadius:90,
    upgCost:[310,490,680],upgDmg:[16,22,28],upgRange:[10,12,18],
    locked:true,shopCost:200,
    desc:'Pulso eléctrico en área'
  },
};

/* ═══════════════════════════════════
   SAVE STATE
═══════════════════════════════════ */
const SAVE_KEY='chainDefense_v5';

const GS={
  cft:0,          // CFT depositados en el juego (balance_juego)
  cftSocial:0,    // CFT en la red social (token_balance) ← AGREGAR ESTA LÍNEA
  games:0, maxWave:0, bestProfit:0,
  lastWithdraw:0, playerName:'PLAYER',
  owned:[],
  lostLivesAt:0,
load(){
  try{
    const d=localStorage.getItem(SAVE_KEY);
    if(d) {
      const parsed = JSON.parse(d);
      Object.assign(this,parsed);
    }
  }catch(_){}
  if(typeof this.cft !== 'number') this.cft = 0;
  if(typeof this.cftSocial !== 'number') this.cftSocial = 0;
  if(!Array.isArray(this.owned))this.owned=[];
},

save(){
  const{cft,cftSocial,games,maxWave,bestProfit,lastWithdraw,playerName,owned,lostLivesAt}=this;
  localStorage.setItem(SAVE_KEY,JSON.stringify({cft,cftSocial,games,maxWave,bestProfit,lastWithdraw,playerName,owned,lostLivesAt}));
},
  isOwned(k){return !TDEFS[k].locked||this.owned.includes(k);},
  get canWithdraw(){return this.lastWithdraw===0||Date.now()-this.lastWithdraw>=ECO.WITHDRAW_CD;},
  get timeUntilWithdraw(){return this.lastWithdraw===0?0:Math.max(0,(this.lastWithdraw+ECO.WITHDRAW_CD)-Date.now());},
  get canClaimFreeLives(){return this.lostLivesAt===0||Date.now()-this.lostLivesAt>=86400000;}, // 24h
  get timeUntilFreeLives(){return this.lostLivesAt===0?0:Math.max(0,(this.lostLivesAt+86400000)-Date.now());},
};
GS.load();
window.gameState=GS;

/* ═══════════════════════════════════
   SESSION - NUEVO SISTEMA
═══════════════════════════════════ */
let SES={
  mode:'free',
  initialBudget:0,  // presupuesto inicial
  currentBudget:0,  // presupuesto actual EN JUEGO
  lives:3,
  wavesCompleted:0,
  bossesFilled:0,   // bosses completados (checkpoints)
  savedGains:0,     // lo guardado desde últimoboss
  reviveCosts:0,    // lo gastado en revives
  enemiesKilled:0,  // enemigos destruidos
  enemiesPassed:0,  // enemigos que pasaron
};

function calcReviveCost(){
  // Cuesta 50% del presupuesto inicial (no del actual)
  return Math.ceil(SES.initialBudget*ECO.REVIVE_BUDGET_PCT);
}

/* ═══════════════════════════════════
   ENEMY DEFS
═══════════════════════════════════ */
const EDEFS={
  // ===== NIVEL 1-3: BÁSICOS =====
  node:  {hp:20, spd:1.4,reward:8,dmgPenalty:10,baseDmg:2,size:10,color:'#ff4488',emoji:'◆'},
  packet:{hp:50,spd:1.0,reward:14,dmgPenalty:18,baseDmg:3,size:13,color:'#ff8800',emoji:'⬛'},
  drone: {hp:18, spd:2.2,reward:10,dmgPenalty:14,baseDmg:3,size:9, color:'#bb00ff',emoji:'▶'},
  tank:  {hp:140,spd:0.7,reward:40,dmgPenalty:35,baseDmg:8,size:17,color:'#ff2244',emoji:'⬟'},
  boss:  {hp:0,  spd:0.5,reward:200,dmgPenalty:50,baseDmg:12,size:26,color:'#ffdd00',emoji:'⬡',isBoss:true},
  
  // ===== NIVEL 4-6: INTERMEDIOS =====
  scout: {hp:15, spd:2.8,reward:7,dmgPenalty:8,baseDmg:1,size:8, color:'#00ffff',emoji:'🔷',minWave:4,desc:'Muy rápido, débil'},
  heavy: {hp:90,spd:0.5,reward:35,dmgPenalty:40,baseDmg:15,size:18,color:'#ff0066',emoji:'🔶',minWave:4,desc:'Lento, muy resistente'},
  
  // ===== NIVEL 7-9: SHOOTER =====
  shooter:{hp:30, spd:1.5,reward:20,dmgPenalty:25,baseDmg:5,size:12,color:'#ffff00',emoji:'🎯',minWave:7,
           shootDmg:12,shootRate:1.2,shootRange:200,isShooter:true,desc:'¡Ataca torres!'},
  swarm: {hp:15, spd:2.5,reward:6,dmgPenalty:5,baseDmg:1,size:7, color:'#00ff00',emoji:'◆◆',minWave:7,
           isSwarm:true,swarmCount:3,desc:'Grupo pequeño'},
  
  // ===== NIVEL 10-12: AVANZADOS =====
  armored:{hp:110,spd:1.0,reward:45,dmgPenalty:50,baseDmg:18,size:20,color:'#888888',emoji:'🛡️',minWave:10,
           armor:0.5,isArmored:true,desc:'Mitad de daño'},
  charger:{hp:70,spd:3.2,reward:30,dmgPenalty:30,baseDmg:20,size:15,color:'#ff6600',emoji:'💨',minWave:10,
           isCharger:true,desc:'Carga fuerte'},
  
  // ===== NIVEL 13-15: ESPECIALES =====
  splitter:{hp:45, spd:1.8,reward:25,dmgPenalty:20,baseDmg:6,size:14,color:'#ff00ff',emoji:'✦',minWave:13,
            isSplitter:true,splitInto:2,desc:'Se divide'},
  healer: {hp:55,spd:1.3,reward:35,dmgPenalty:28,baseDmg:5,size:13,color:'#ffaa00',emoji:'❤️',minWave:13,
           isHealer:true,healRadius:150,healAmount:20,healRate:1.5,desc:'Cura cercanos'},
};

function genWave(wn){
  const isBoss=wn%3===0,scale=1+(wn-1)*0.18,enemies=[];
  if(isBoss){
    const bd={...EDEFS.boss};bd.hp=Math.round(1200*scale);
    enemies.push({type:'boss',def:bd,delay:0});
    const esc=Math.min(3+Math.floor(wn/3),8);
    for(let i=0;i<esc;i++){
      const ed={...EDEFS.drone};ed.hp=Math.round(ed.hp*scale);
      enemies.push({type:'drone',def:ed,delay:0.4*(i+1)});
    }
  } else {
    let types=['node','packet','drone','tank'];
    if(wn>=4) types.push('scout','heavy');
    if(wn>=7) types.push('shooter','swarm');
    if(wn>=10) types.push('armored','charger');
    if(wn>=13) types.push('splitter','healer');
    types=types.filter(t=>!EDEFS[t].minWave||EDEFS[t].minWave<=wn);
    const maxT=Math.min(Math.floor((wn-1)/2)+1,types.length);
    const cnt=5+wn*2;
    for(let i=0;i<cnt;i++){
      const t=types[Math.floor(Math.random()*maxT)];
      const ed={...EDEFS[t]};ed.hp=Math.round(ed.hp*scale);
      enemies.push({type:t,def:ed,delay:i*0.65+Math.random()*0.3});
    }
  }
  return{isBoss,enemies};
}

const CELL=36;
function buildPath(cols,rows){
  const path=[],rowH=Math.floor(rows*0.25),rowL=Math.floor(rows*0.65);
  let y=rowH,dir=1,x=dir>0?0:cols-1;
  path.push({x,y});
  while(true){
    x+=dir;
    if(x<0||x>=cols){
      x=Math.max(0,Math.min(x,cols-1));
      const ny=y+(rowL-rowH);
      if(ny>=rows) break;
      for(let yy=y+1;yy<=ny;yy++) path.push({x,y:yy});
      y=ny;dir*=-1;
    } else {
      path.push({x,y});
    }
    if(path.length>cols*rows) break;
  }
  return path;
}

const CELL_OFFSET=46;
let _flashA=0,_flashC='#ff0000';
function flash(c='#ff0000'){_flashC=c;_flashA=0.28;}
function spawnFloat(x,y,txt,color){
  if(window.GE) window.GE.floaties.push({x,y,text:txt,color,life:1.4});
}

/* ═══════════════════════════════════
   GAME ENGINE
═══════════════════════════════════ */
class GameEngine{
  constructor(canvas){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');
    this.cols=Math.floor(canvas.width/CELL);
    this.rows=Math.floor((canvas.height-CELL_OFFSET-52)/CELL);
    this.path=buildPath(this.cols,this.rows);
    this.pathSet=new Set(this.path.map(p=>`${p.x},${p.y}`));
    this.towers=[];this.enemies=[];this.bullets=[];
    this.particles=[];this.floaties=[];this.laserBeams=[];
    this.gold=SES.currentBudget;this.nodeHp=100;this.nodeMaxHp=100;
    this.waveNum=0;
    this.state='build';
    this.selectedTower='basic';
    this.spawnQueue=[];this.spawnTimer=0;
    this.gameSpeed=1;this.running=true;
    this._raf=null;this._last=0;this._finished=false;
    this.hoverCell=null;
    canvas.addEventListener('click',e=>this._onClick(e));
    canvas.addEventListener('mousemove',e=>this._onHover(e));
    window.GE=this;
    setTimeout(()=>this._startNextWave(),80);
  }

  resize(){
    this.cols=Math.floor(this.canvas.width/CELL);
    this.rows=Math.floor((this.canvas.height-CELL_OFFSET-52)/CELL);
    this.path=buildPath(this.cols,this.rows);
    this.pathSet=new Set(this.path.map(p=>`${p.x},${p.y}`));
  }

  _cell(e){
    const r=this.canvas.getBoundingClientRect();
    return{cx:Math.floor((e.clientX-r.left)/CELL),cy:Math.floor((e.clientY-r.top-CELL_OFFSET)/CELL)};
  }

  _onClick(e){
    if(this.state!=='build'&&this.state!=='wave') return;
    const{cx,cy}=this._cell(e);
    const existing=this.towers.find(t=>t.cx===cx&&t.cy===cy);
    if(existing){openTowerPopup(existing);return;}
    closePopup();
    if(this.pathSet.has(`${cx},${cy}`)) return;
    if(cx<0||cy<0||cx>=this.cols||cy>=this.rows) return;
    if(!GS.isOwned(this.selectedTower)) return;
    const def=TDEFS[this.selectedTower];
    if(this.gold<def.cost){spawnFloat(cx*CELL+CELL/2,cy*CELL+CELL/2+CELL_OFFSET,'¡Sin oro!','#ff4444');return;}
    this.gold-=def.cost;
    this.towers.push({cx,cy,type:this.selectedTower,def:{...def},level:1,cooldown:0,angle:0,pulseT:0,laserTarget:null,laserDmgAcc:0});
    updateHUD();
  }

  _onHover(e){this.hoverCell=this._cell(e);}

  _startNextWave(){
    this.waveNum++;
    const wd=genWave(this.waveNum);
    this.spawnQueue=[...wd.enemies];
    this.spawnTimer=0;
    this.state='wave';
    this._recalcNexus();
    showWaveAnn(this.waveNum,wd.isBoss);
    updateHUD();
  }

  _recalcNexus(){
    const nxs=this.towers.filter(t=>t.type==='nexus');
    for(const t of this.towers){
      if(t.type==='nexus'){t._boost=1;continue;}
      let b=1;
      for(const n of nxs){
        const dx=(t.cx-n.cx)*CELL,dy=(t.cy-n.cy)*CELL;
        if(Math.hypot(dx,dy)<150) b+=(n.def.boost||0.28)+(n.level-1)*0.05;
      }
      t._boost=b;
    }
  }

  start(){this._last=performance.now();this._raf=requestAnimationFrame(this._loop);}
  stop(){this.running=false;if(this._raf)cancelAnimationFrame(this._raf);}

  _loop=(ts)=>{
    if(!this.running) return;
    const dt=Math.min((ts-this._last)/1000,0.05)*this.gameSpeed;
    this._last=ts;
    this.update(dt);
    this.render();
    this._raf=requestAnimationFrame(this._loop);
  }

  update(dt){
    if(this.state==='gameover'||this.state==='victory') return;

    if(this.state==='wave'&&this.spawnQueue.length>0){
      this.spawnTimer+=dt;
      while(this.spawnQueue.length>0&&this.spawnTimer>=this.spawnQueue[0].delay){
        const e=this.spawnQueue.shift();
        this.enemies.push({
          def:e.def,type:e.type,isBoss:!!e.def.isBoss,
          hp:e.def.hp,maxHp:e.def.hp,pos:0,
          x:this.path[0].x*CELL+CELL/2,
          y:this.path[0].y*CELL+CELL/2+CELL_OFFSET,
          slow:0,slowTimer:0,stunTimer:0,reached:false,dead:false,
          color:e.def.color,size:e.def.size,reward:e.def.reward,
          shootCooldown:0,healed:0,splitSpawned:false,
        });
      }
    }

    for(const en of this.enemies){
      if(en.dead||en.reached) continue;
      if(en.stunTimer>0){en.stunTimer-=dt;continue;}
      const spd=en.def.spd*(en.slowTimer>0?1-en.slow:1)*CELL;
      if(en.slowTimer>0) en.slowTimer-=dt;
      en.pos+=spd*dt/CELL;
      const idx=Math.floor(en.pos);
      if(idx>=this.path.length-1){
        en.reached=true;
        SES.enemiesPassed++; // Track enemigo que pasó
        const dmg=en.isBoss?25:(en.type==='tank'?10:en.type==='packet'?6:4);
        const costGold=en.def.dmgPenalty||Math.round(en.def.baseDmg*2);
        this.nodeHp=Math.max(0,this.nodeHp-dmg);
        this.gold=Math.max(0,this.gold-costGold);
        this._addParticles(this.path[this.path.length-1].x*CELL+CELL/2,this.path[this.path.length-1].y*CELL+CELL/2+CELL_OFFSET,'#ff2244',10);
        spawnFloat(this.path[this.path.length-1].x*CELL+CELL/2,this.path[this.path.length-1].y*CELL+CELL/2+CELL_OFFSET-20,`-${costGold}🪙`,'#ff4444');
        flash('#ff0000');
        if(this.nodeHp<=0&&!this._finished){
          this._finished=true;this.stop();
          setTimeout(()=>triggerNodeFall(),400);
        }
        continue;
      }
      const a=this.path[idx],b=this.path[idx+1],t=en.pos-idx;
      en.x=(a.x+t*(b.x-a.x))*CELL+CELL/2;
      en.y=(a.y+t*(b.y-a.y))*CELL+CELL/2+CELL_OFFSET;
    }
    this.enemies=this.enemies.filter(e=>!e.reached);

    // ENEMIGOS ESPECIALES: SHOOTER ATACA TORRES
    for(const en of this.enemies){
      if(en.dead||!en.def.isShooter) continue;
      if(!en.shootCooldown) en.shootCooldown=0;
      en.shootCooldown-=dt;
      if(en.shootCooldown<=0){
        let targetTower=null,minD=Infinity;
        for(const t of this.towers){
          const dx=t.cx*CELL+CELL/2-en.x,dy=t.cy*CELL+CELL/2+CELL_OFFSET-en.y;
          const d=Math.hypot(dx,dy);
          if(d<=en.def.shootRange&&d<minD){minD=d;targetTower=t;}
        }
        if(targetTower){
          en.shootCooldown=1/en.def.shootRate;
          targetTower.hp=(targetTower.hp||100)-en.def.shootDmg;
          this._addParticles(targetTower.cx*CELL+CELL/2,targetTower.cy*CELL+CELL/2+CELL_OFFSET,'#ff4444',6);
          spawnFloat(targetTower.cx*CELL+CELL/2,targetTower.cy*CELL+CELL/2+CELL_OFFSET,`-${en.def.shootDmg}⚡`,'#ff4444');
          if(targetTower.hp<=0){
            this.towers=this.towers.filter(t=>t!==targetTower);
            spawnFloat(targetTower.cx*CELL+CELL/2,targetTower.cy*CELL+CELL/2+CELL_OFFSET,'💥 TORRE DESTRUIDA','#ff0000');
          }
        }
      }
    }

    // ENEMIGOS ESPECIALES: HEALER CURA A CERCANOS
    for(const en of this.enemies){
      if(en.dead||!en.def.isHealer) continue;
      if(!en.healCooldown) en.healCooldown=0;
      en.healCooldown-=dt;
      if(en.healCooldown<=0){
        en.healCooldown=1/en.def.healRate;
        for(const e2 of this.enemies){
          if(e2===en||e2.dead) continue;
          const d=Math.hypot(e2.x-en.x,e2.y-en.y);
          if(d<=en.def.healRadius){
            e2.hp=Math.min(e2.maxHp,e2.hp+en.def.healAmount);
            spawnFloat(e2.x,e2.y-10,`+${en.def.healAmount}❤️`,'#ffaa00');
          }
        }
      }
    }

    this._nexusTimer=(this._nexusTimer||0)+dt;
    if(this._nexusTimer>1){this._nexusTimer=0;this._recalcNexus();}
    this.laserBeams=[];
    for(const t of this.towers){
      t.pulseT+=dt;
      const boost=t._boost||1;
      const tx=t.cx*CELL+CELL/2,ty=t.cy*CELL+CELL/2+CELL_OFFSET;
      const def=t.def;

      if(def.isLaser){
        let target=this._closestInRange(t,tx,ty);
        if(target){
          t.angle=Math.atan2(target.y-ty,target.x-tx);
          const dps=(def.dps+(def.upgDmg||[0,0,0]).slice(0,t.level-1).reduce((a,b)=>a+b,0))*boost;
          target.hp-=dps*dt;
          this.laserBeams.push({x1:tx,y1:ty,x2:target.x,y2:target.y,color:def.color});
          if(target.hp<=0&&!target.dead){
            target.dead=true;this.gold+=target.reward;
            this._addParticles(target.x,target.y,target.color,8);
            spawnFloat(target.x,target.y-12,`+${target.reward}🪙`,'#ffdd00');
          }
        }
        continue;
      }

      if(t.cooldown>0){t.cooldown-=dt;continue;}

      let target=def.isMissile?this._highestHpInRange(t,tx,ty):this._furthestInRange(t,tx,ty);
      if(!target) continue;
      t.angle=Math.atan2(target.y-ty,target.x-tx);
      t.cooldown=1/(def.rate*boost);
      const dmg=Math.round(def.dmg*boost);

      if(def.isChain){
        this._chainHit(target,dmg,t,def.chainCount||3);
      } else if(def.isPulse){
        for(const en of this.enemies){
          if(!en.dead&&!en.reached){
            const dx=en.x-tx,dy=en.y-ty;
            if(Math.hypot(dx,dy)<=def.pulseRadius*(1+(t.level-1)*0.1)){
              this._hit(en,dmg,t);
              en.stunTimer=0.4;
            }
          }
        }
        this._addParticles(tx,ty,def.color,20);
        this.bullets.push({x:tx,y:ty,tx:tx,ty:ty,color:def.color,life:0.5,r:def.pulseRadius*(1+(t.level-1)*0.1),isPulse:true});
      } else if(def.aoe>0){
        for(const en of this.enemies){
          if(!en.dead&&!en.reached&&Math.hypot(en.x-target.x,en.y-target.y)<=def.aoe*(1+(t.level-1)*0.08))
            this._hit(en,dmg,t);
        }
        this._addParticles(target.x,target.y,def.color,16);
        this.bullets.push({x:tx,y:ty,tx:target.x,ty:target.y,color:def.color,life:1,r:2});
      } else {
        this._hit(target,dmg,t);
        this.bullets.push({x:tx,y:ty,tx:target.x,ty:target.y,color:def.color,life:1,r:2});
      }
    }

    for(const b of this.bullets) b.life-=dt*(b.isPulse?1.8:6);
    this.bullets=this.bullets.filter(b=>b.life>0);
    for(const p of this.particles){p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vy+=0.12;p.life-=0.028;}
    this.particles=this.particles.filter(p=>p.life>0);
    for(const f of this.floaties){f.y-=36*dt;f.life-=dt;}
    this.floaties=this.floaties.filter(f=>f.life>0);
    _flashA=Math.max(0,_flashA-0.03);

// CHECKPOINT: Boss completado
if(this.state==='wave'&&this.spawnQueue.length===0&&this.enemies.filter(e=>!e.dead).length===0){
  SES.wavesCompleted++;
  GS.maxWave=Math.max(GS.maxWave,SES.wavesCompleted);
  GS.save();
  this.state='build';

  // Bonus por oleada
  const bonusPct = SES.enemiesPassed === 0 ? 0.15 : 0.10;
  const bonusGold = Math.round(SES.initialBudget * bonusPct);
  this.gold += bonusGold;
  SES.currentBudget = Math.round(this.gold);
  SES.enemiesPassed = 0;
  spawnFloat(this.canvas.width/2, this.canvas.height/2+30, `+${bonusGold}🪙`, '#ffdd00');

  if(this.waveNum%3===0){
    SES.bossesFilled++;
    if(SES.mode==='free'){
      SES.savedGains+=1;
      spawnFloat(this.canvas.width/2,this.canvas.height/2-44,`✓ BOSS COMPLETADO`,'#ffdd00');
      spawnFloat(this.canvas.width/2,this.canvas.height/2,`+1 CFT GUARDADO`,'#00ff88');
    } else {
      SES.savedGains=this.gold;
      spawnFloat(this.canvas.width/2,this.canvas.height/2-44,`✓ CHECKPOINT GUARDADO`,'#ffdd00');
      spawnFloat(this.canvas.width/2,this.canvas.height/2,`${this.gold.toFixed(0)}🪙 ASEGURADO`,'#00ff88');
    }
  } else {
    spawnFloat(this.canvas.width/2,this.canvas.height/2-44,`✓ OLEADA ${this.waveNum} COMPLETADA`,'#ffdd00');
  }

  SES.currentBudget=Math.round(this.gold);
  setTimeout(()=>{if(!this._finished) this._startNextWave();},3200);
}

updateHUD();

  }

  _closestInRange(t,tx,ty){
    let best=null,minD=Infinity;
    for(const en of this.enemies){
      if(en.dead||en.reached) continue;
      const d=Math.hypot(en.x-tx,en.y-ty);
      if(d<=t.def.range&&d<minD){minD=d;best=en;}
    }
    return best;
  }
  _furthestInRange(t,tx,ty){
    let best=null,maxPos=-1;
    for(const en of this.enemies){
      if(en.dead||en.reached) continue;
      if(Math.hypot(en.x-tx,en.y-ty)<=t.def.range&&en.pos>maxPos){maxPos=en.pos;best=en;}
    }
    return best;
  }
  _highestHpInRange(t,tx,ty){
    let best=null,maxHp=-1;
    for(const en of this.enemies){
      if(en.dead||en.reached) continue;
      if(Math.hypot(en.x-tx,en.y-ty)<=t.def.range&&en.hp>maxHp){maxHp=en.hp;best=en;}
    }
    return best;
  }

  _hit(en,dmg,tower){
    if(en.dead) return;
    // Aplicar reducción de armadura
    let actualDmg=dmg;
    if(en.def.armor){
      actualDmg=Math.round(dmg*(1-en.def.armor));
    }
    en.hp-=actualDmg;
    if(tower.def.slow>0){en.slow=tower.def.slow;en.slowTimer=1.3;}
    this._addParticles(en.x,en.y,tower.def.color,3);
    
    if(en.hp<=0){
      en.dead=true;
      this.gold+=en.reward;
      SES.enemiesKilled++; // Track enemigo muerto
      this._addParticles(en.x,en.y,en.color,8);
      spawnFloat(en.x,en.y-12,`+${en.reward}🪙`,'#ffdd00');
      
      // Si es splitter, se divide en 2 enemigos
      if(en.def.isSplitter){
        for(let i=0;i<(en.def.splitInto||2);i++){
          const ed={...EDEFS.drone};ed.hp=Math.round(ed.hp*0.6);
          this.enemies.push({
            def:ed,type:'drone',isBoss:false,
            hp:ed.hp,maxHp:ed.hp,pos:en.pos+0.1,
            x:en.x+Math.cos(i*Math.PI)*15,y:en.y+Math.sin(i*Math.PI)*15,
            slow:0,slowTimer:0,stunTimer:0,reached:false,dead:false,
            color:ed.color,size:ed.size,reward:ed.reward,
          });
        }
        spawnFloat(en.x,en.y,`⚡ SE DIVIDE`,'#ff00ff');
      }
    }
  }

  _chainHit(en,dmg,tower,bounces){
    if(en.dead||bounces<=0) return;
    this._hit(en,dmg,tower);
    const tx=tower.cx*CELL+CELL/2;const ty=tower.cy*CELL+CELL/2+CELL_OFFSET;
    let next=null,minD=Infinity;
    for(const e2 of this.enemies){
      if(e2===en||e2.dead||e2.reached) continue;
      const d=Math.hypot(e2.x-en.x,e2.y-en.y);
      if(d<110&&d<minD){minD=d;next=e2;}
    }
    if(next) this._chainHit(next,Math.round(dmg*0.75),tower,bounces-1);
    this.bullets.push({x:en.x,y:en.y,tx:next?next.x:en.x+10,ty:next?next.y:en.y+10,color:tower.def.color,life:0.6,r:2});
  }

  _addParticles(x,y,color,n=6){
    for(let i=0;i<n;i++) this.particles.push({x,y,color,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4-1,life:1,r:2+Math.random()*3});
  }

  render(){
    const ctx=this.ctx,W=this.canvas.width,H=this.canvas.height;
    ctx.fillStyle='#050710';ctx.fillRect(0,0,W,H);

    ctx.strokeStyle='rgba(0,204,255,.07)';ctx.lineWidth=1;
    for(let cx=0;cx<this.cols;cx++)
      for(let cy=0;cy<this.rows;cy++)
        ctx.strokeRect(cx*CELL,cy*CELL+CELL_OFFSET,CELL,CELL);

    ctx.fillStyle='rgba(0,204,255,.07)';
    for(const p of this.path) ctx.fillRect(p.x*CELL,p.y*CELL+CELL_OFFSET,CELL,CELL);
    ctx.strokeStyle='rgba(0,204,255,.22)';ctx.lineWidth=2;ctx.setLineDash([5,4]);
    ctx.beginPath();
    this.path.forEach((p,i)=>{
      const x=p.x*CELL+CELL/2,y=p.y*CELL+CELL/2+CELL_OFFSET;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.stroke();ctx.setLineDash([]);

    const sp=this.path[0],ep=this.path[this.path.length-1];
    ctx.fillStyle='rgba(0,255,136,.28)';ctx.fillRect(sp.x*CELL,sp.y*CELL+CELL_OFFSET,CELL,CELL);
    ctx.fillStyle='rgba(255,34,68,.28)'; ctx.fillRect(ep.x*CELL,ep.y*CELL+CELL_OFFSET,CELL,CELL);
    ctx.font='bold 9px Audiowide';ctx.textAlign='center';
    ctx.fillStyle='#00ff88';ctx.fillText('IN',sp.x*CELL+CELL/2,sp.y*CELL+CELL/2+CELL_OFFSET+4);
    ctx.fillStyle='#ff2244'; ctx.fillText('⬡', ep.x*CELL+CELL/2,ep.y*CELL+CELL/2+CELL_OFFSET+4);

    if(this.hoverCell&&GS.isOwned(this.selectedTower)){
      const{cx,cy}=this.hoverCell;
      if(!this.pathSet.has(`${cx},${cy}`)&&cx>=0&&cy>=0&&cx<this.cols&&cy<this.rows&&!this.towers.find(t=>t.cx===cx&&t.cy===cy)){
        const tdef=TDEFS[this.selectedTower];
        const ok=this.gold>=tdef.cost;
        ctx.fillStyle=ok?'rgba(0,255,136,.1)':'rgba(255,34,68,.1)';ctx.fillRect(cx*CELL,cy*CELL+CELL_OFFSET,CELL,CELL);
        ctx.strokeStyle=ok?'rgba(0,255,136,.45)':'rgba(255,34,68,.35)';ctx.lineWidth=2;ctx.strokeRect(cx*CELL,cy*CELL+CELL_OFFSET,CELL,CELL);
        ctx.strokeStyle=ok?'rgba(0,255,136,.12)':'rgba(255,34,68,.1)';ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(cx*CELL+CELL/2,cy*CELL+CELL/2+CELL_OFFSET,tdef.range,0,Math.PI*2);ctx.stroke();
      }
    }

    for(const t of this.towers){
      const tx=t.cx*CELL+CELL/2,ty=t.cy*CELL+CELL/2+CELL_OFFSET;
      const def=t.def,pulse=0.85+Math.sin(t.pulseT*2)*0.1;
      ctx.fillStyle='rgba(10,15,26,.92)';ctx.beginPath();ctx.arc(tx,ty,CELL*.42,0,Math.PI*2);ctx.fill();
      ctx.shadowColor=def.color;ctx.shadowBlur=t.type==='nexus'?18:10;
      ctx.fillStyle=def.color;ctx.globalAlpha=.16*pulse;
      ctx.beginPath();ctx.arc(tx,ty,CELL*.44,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;ctx.shadowBlur=0;
      if(t.type!=='nexus'&&t.type!=='tesla'){
        ctx.save();ctx.translate(tx,ty);ctx.rotate(t.angle);
        ctx.fillStyle=def.color;ctx.fillRect(0,-3,CELL*.32,6);
        ctx.restore();
      }
      ctx.font=`${CELL*.42}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(def.emoji,tx,ty);ctx.textBaseline='alphabetic';
      for(let i=0;i<t.level;i++){ctx.fillStyle=def.color;ctx.beginPath();ctx.arc(tx-4+(i*5),ty+CELL*.38,2,0,Math.PI*2);ctx.fill();}
      if(t.type==='nexus'){ctx.strokeStyle='rgba(255,221,0,.1)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(tx,ty,150,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
      if(t.type==='tesla'){
        ctx.strokeStyle='rgba(136,102,255,.2)';ctx.lineWidth=1;ctx.setLineDash([2,4]);
        ctx.beginPath();ctx.arc(tx,ty,def.pulseRadius,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      }
    }

    for(const lb of this.laserBeams){
      ctx.strokeStyle=lb.color;ctx.lineWidth=3;ctx.shadowColor=lb.color;ctx.shadowBlur=14;ctx.globalAlpha=.85;
      ctx.beginPath();ctx.moveTo(lb.x1,lb.y1);ctx.lineTo(lb.x2,lb.y2);ctx.stroke();
      ctx.shadowBlur=0;ctx.globalAlpha=1;
      ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.globalAlpha=.5;
      ctx.beginPath();ctx.moveTo(lb.x1,lb.y1);ctx.lineTo(lb.x2,lb.y2);ctx.stroke();
      ctx.globalAlpha=1;
    }

    for(const b of this.bullets){
      if(b.isPulse){
        ctx.strokeStyle=b.color;ctx.lineWidth=2;ctx.globalAlpha=b.life*.7;ctx.shadowColor=b.color;ctx.shadowBlur=12;
        ctx.beginPath();ctx.arc(b.tx,b.ty,b.r*(1-b.life*.5),0,Math.PI*2);ctx.stroke();
        ctx.shadowBlur=0;ctx.globalAlpha=1;
      } else {
        const t=1-b.life,bx=b.x+(b.tx-b.x)*t,by=b.y+(b.ty-b.y)*t;
        ctx.globalAlpha=b.life;ctx.fillStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=7;
        ctx.beginPath();ctx.arc(bx,by,b.r+1,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;ctx.globalAlpha=1;
      }
    }

    for(const en of this.enemies){
      if(en.dead||en.reached) continue;
      ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(en.x,en.y+en.size*.5,en.size*.7,en.size*.22,0,0,Math.PI*2);ctx.fill();
      if(en.slowTimer>0){ctx.fillStyle='rgba(0,200,255,.22)';ctx.beginPath();ctx.arc(en.x,en.y,en.size*1.6,0,Math.PI*2);ctx.fill();}
      if(en.stunTimer>0){ctx.fillStyle='rgba(255,255,0,.22)';ctx.beginPath();ctx.arc(en.x,en.y,en.size*1.6,0,Math.PI*2);ctx.fill();}
      ctx.shadowColor=en.color;ctx.shadowBlur=en.isBoss?18:7;ctx.fillStyle=en.color;
      if(en.isBoss){
        ctx.save();ctx.translate(en.x,en.y);ctx.rotate(Date.now()*.001);
        ctx.beginPath();for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2;i===0?ctx.moveTo(Math.cos(a)*en.size,Math.sin(a)*en.size):ctx.lineTo(Math.cos(a)*en.size,Math.sin(a)*en.size);}
        ctx.closePath();ctx.fill();ctx.restore();
      } else {
        ctx.beginPath();ctx.arc(en.x,en.y,en.size,0,Math.PI*2);ctx.fill();
      }
      ctx.shadowBlur=0;
      ctx.font=`${en.size*1.2}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(en.def.emoji,en.x,en.y);ctx.textBaseline='alphabetic';
      const bw=en.isBoss?en.size*3:en.size*2.2,bh=4,bx=en.x-bw/2,by=en.y-en.size-7;
      ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(bx,by,bw,bh);
      const pct=en.hp/en.maxHp;ctx.fillStyle=pct>.5?'#00ff88':pct>.25?'#ffdd00':'#ff2244';ctx.fillRect(bx,by,bw*pct,bh);
    }

    for(const p of this.particles){ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;

    ctx.font='bold 10px Audiowide';ctx.textAlign='center';
    for(const f of this.floaties){ctx.globalAlpha=Math.min(f.life,1);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y);}
    ctx.globalAlpha=1;

    if(_flashA>0){ctx.fillStyle=_flashC;ctx.globalAlpha=_flashA;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}

    if(this.state==='build'){
      ctx.fillStyle='rgba(0,255,136,.04)';ctx.fillRect(0,0,W,H);
      ctx.font='bold 9px Audiowide';ctx.textAlign='center';ctx.fillStyle='rgba(0,255,136,.4)';
      ctx.fillText('— FASE DE CONSTRUCCIÓN · Click para colocar torres —',W/2,60);
    }
  }
}

/* ══════════════════════════════════
   LIVES / REVIVE
══════════════════════════════════ */
function triggerNodeFall(){
  SES.lives--;
  updateHudLives();
  if(SES.lives<=0){endGame(false,SES.wavesCompleted);return;}
  showReviveOverlay();
}
function updateHudLives(){
  const el=$('hudLives');if(!el) return;
  let h='';for(let i=0;i<ECO.MAX_LIVES;i++) h+=(i<SES.lives?'❤️':'🖤');
  el.innerHTML=h;
}
function showReviveOverlay(){
  const cost=calcReviveCost();
  const ok=SES.currentBudget>=cost;
  let lh='';for(let i=0;i<ECO.MAX_LIVES;i++) lh+=(i<SES.lives?'❤️':'🖤');
  setText('reviveLives',lh);
  setText('reviveLivesLeft',SES.lives+' restante'+(SES.lives!==1?'s':''));
  setText('reviveCost',cost+' 🪙');
  setText('reviveBalance',Math.round(SES.currentBudget)+' 🪙');
  const rb=$('reviveBuyBtn');if(rb) rb.disabled=!ok;
  $('reviveOv').classList.add('show');
}
function doRevive(){
  const cost=calcReviveCost();if(SES.currentBudget<cost) return;
  SES.currentBudget-=cost;
  SES.reviveCosts+=cost;
  window.GE.gold=SES.currentBudget;
  $('reviveOv').classList.remove('show');
  const ge=window.GE;if(!ge) return;
  ge.nodeHp=ge.nodeMaxHp;ge._finished=false;ge.running=true;
  ge._last=performance.now();ge._raf=requestAnimationFrame(ge._loop);
  if(ge.state==='wave'&&ge.enemies.filter(e=>!e.dead).length===0&&ge.spawnQueue.length===0)
    ge._startNextWave();
  updateHUD();
}
function giveUp(){
  $('reviveOv').classList.remove('show');
  endGame(false,SES.wavesCompleted);
}

/* ══════════════════════════════════
   HUD
══════════════════════════════════ */
function updateHUD(){
  const ge=window.GE;if(!ge) return;
  setText('hudWave',ge.waveNum||'—');
  setText('hudEnemies',ge.enemies.filter(e=>!e.dead&&!e.reached).length);
  const geGold = window.GE ? Math.round(window.GE.gold) : 0;
// Bonus por oleada: 1% por cada oleada completada
const waveBonus = (SES.wavesCompleted * 0.01);

// Bonus por multiplicador: 1% por cada 100% de ganancia sobre el inicial
const goldAccum = window.GE ? Math.round(window.GE.gold) : 0;
const multGain  = SES.initialBudget > 0 ? (goldAccum - SES.initialBudget) / SES.initialBudget : 0;
const multBonus = Math.max(0, Math.floor(multGain)) * 0.01; // 1% por cada x1 completo

const totalBonusPct = waveBonus + multBonus;
const bonusAmount   = Math.round(SES.initialBudget * totalBonusPct);
setText('hudProfit', SES.mode==='free' ? SES.savedGains+' CFT' : Math.round(window.GE?.gold||0)+' 🪙');
  setText('hudGold',Math.round(ge.gold));
  const pct=ge.nodeHp/ge.nodeMaxHp;
  const fill=$('hpFill');
  if(fill){fill.style.width=(pct*100)+'%';fill.className='hp-fill '+(pct>.6?'h':pct>.3?'m':'l');}
  setText('hudHpNum',ge.nodeHp+'/'+ge.nodeMaxHp);
  const wb=$('waveBadge');
  if(wb){const ib=ge.waveNum%3===0;wb.textContent=(ib?'☠ BOSS ':'')+'OLEADA '+ge.waveNum;wb.className='wave-badge'+(ib?' boss':'');}
  const ddi=$('ddInfo');
  if(ddi) ddi.innerHTML=`${SES.mode==='bet'?`Presupuesto: <span>${Math.round(SES.currentBudget)} 🪙</span>`:`Guardado: <span>${SES.savedGains} CFT</span>`}<br>Oleadas: <span>${SES.wavesCompleted}</span><br>Bosses: <span>${SES.bossesFilled}</span><br>Vidas: <span>${SES.lives}/${ECO.MAX_LIVES}</span>`;
  updateHudLives();
}
function showWaveAnn(w,isBoss){
  const el=$('waveAnn');if(!el) return;
  const t=$('waveAnnTitle'),s=$('waveAnnSub');
  if(t){t.textContent=isBoss?`☠ BOSS — OLEADA ${w}`:`OLEADA ${w}`;t.className='wave-ann-title'+(isBoss?' boss':'');}
  if(s) s.textContent=isBoss?'¡JEFE APROXIMÁNDOSE!':'Completa para avanzar';
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2200);
}

/* ══════════════════════════════════
   TOWER SELECT / POPUP
══════════════════════════════════ */
function buildHudBottom(){
  const hb=$('hudBottom');if(!hb) return;
  const goldDiv=hb.querySelector('.hud-gold');
  hb.innerHTML='';
  hb.appendChild(goldDiv);
  
  const towersDiv=document.createElement('div');
  towersDiv.style.display='flex';
  towersDiv.style.gap='5px';
  towersDiv.style.overflowX='auto';
  
  for(const[key,def] of Object.entries(TDEFS)){
    const owned=GS.isOwned(key);
    const div=document.createElement('div');
    div.className='tc'+(key===window.GE?.selectedTower?' sel':'')+(owned?'':' locked');
    div.dataset.tower=key;
    div.innerHTML=`<div class="tc-emoji">${def.emoji}</div><div class="tc-name">${def.name}</div><div class="tc-cost">${def.cost}🪙</div>${owned?'':'<div class="tc-lock">🔒</div>'}`;
    
    // ✅ FIX: Event listener con try-catch
    div.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('[CLICK TORRE]', key, 'Owned:', owned);
      try {
        selectTower(key);
      } catch(err) {
        console.error('[ERROR selectTower]', err);
      }
    });
    
    towersDiv.appendChild(div);
  }
  
  hb.insertBefore(towersDiv, goldDiv);
}

function selectTower(type){
  if(!GS.isOwned(type)) return;
  if(window.GE) window.GE.selectedTower=type;
  document.querySelectorAll('.tc').forEach(c=>c.classList.toggle('sel',c.dataset.tower===type));
  closePopup();
}

let _pt=null;
function openTowerPopup(t){
  _pt=t;const def=t.def;
  setText('tpTitle',`${def.emoji} ${def.name} NVL${t.level}`);
  setText('tpLevel',t.level);
  setText('tpDmg',def.isLaser?def.dps+'dps':t.def.dmg);
  setText('tpRange',t.def.range+'px');
  setText('tpRate',def.isLaser?'CONTINUO':t.def.rate.toFixed(2)+'/s');
  const maxLvl=def.upgCost.length+1,canUpg=t.level<maxLvl;
  const upgCost=canUpg?def.upgCost[t.level-1]:null;
  const ub=$('tpUpgBtn');
  if(ub){
    ub.disabled=!canUpg||(window.GE?.gold||0)<(upgCost||0);
    setText('tpUpgCost',canUpg?upgCost:'MAX');
    ub.childNodes[0].textContent=canUpg?`UPGRADE NVL${t.level+1} — `:'NIVEL MÁXIMO ';
  }
  setText('tpSellVal',Math.floor(def.cost*.6+(t.level-1)*30));
  const pop=$('towerPopup');if(!pop) return;
  pop.className='tp show';
  const cx=t.cx*CELL+CELL/2,cy=t.cy*CELL+CELL/2+CELL_OFFSET;
  pop.style.left=Math.min(cx+20,window.innerWidth-200)+'px';
  pop.style.top=Math.max(cy-72,54)+'px';
}
function closePopup(){const p=$('towerPopup');if(p) p.className='tp';_pt=null;}
function upgradeTower(){
  const ge=window.GE;if(!ge||!_pt) return;
  const t=_pt,def=t.def,lvl=t.level,max=def.upgCost.length+1;
  if(lvl>=max) return;
  const cost=def.upgCost[lvl-1];if(ge.gold<cost) return;
  ge.gold-=cost;t.level++;
  t.def.dmg+=(def.upgDmg[lvl-1]||0);t.def.range+=(def.upgRange[lvl-1]||0);
  if(def.isLaser) t.def.dps+=(def.upgDmg[lvl-1]||0);
  ge._recalcNexus();openTowerPopup(t);updateHUD();
}
function sellTower(){
  const ge=window.GE;if(!ge||!_pt) return;
  const t=_pt,sell=Math.floor(t.def.cost*.6+(t.level-1)*30);
  ge.gold+=sell;ge.towers=ge.towers.filter(x=>x!==t);
  ge._recalcNexus();closePopup();updateHUD();
}

function setSpeed(s){
  if(window.GE) window.GE.gameSpeed=s;
  $('spd1x').className='spd-btn'+(s===1?' active':'');
  $('spd2x').className='spd-btn'+(s===2?' active':'');
}

function closeDD(){const d=$('ingameDD');if(d) d.classList.remove('open');}
$('ingameMenuBtn').addEventListener('click',()=>{const d=$('ingameDD');if(d) d.classList.toggle('open');});
$('ddExitBtn').addEventListener('click',()=>{
  closeDD();const ge=window.GE;if(!ge||ge._finished) return;
  ge._finished=true;ge.stop();endGame(false,SES.wavesCompleted);
});

/* ══════════════════════════════════
   END GAME
══════════════════════════════════ */
function endGame(won,wavesCompleted){
  const waves=wavesCompleted||0;
  GS.games++;GS.maxWave=Math.max(GS.maxWave,waves);

  // ✅ Cálculo bonus — debe estar AQUÍ, antes de cualquier if
  const goldAccum    = window.GE ? Math.round(window.GE.gold) : 0;
  const waveBonusPct = SES.wavesCompleted * 0.01;
  const multGain     = SES.initialBudget > 0 ? (goldAccum - SES.initialBudget) / SES.initialBudget : 0;
  const multBonusPct = Math.max(0, Math.floor(multGain)) * 0.01;
  const bonusAmount  = Math.round(SES.initialBudget * (waveBonusPct + multBonusPct));

  let netChange=0;
  if(SES.mode==='bet'){
  if(SES.bossesFilled===0&&window.GE) SES.savedGains=window.GE.gold;
netChange=bonusAmount-SES.reviveCosts;
} else {
  netChange=SES.savedGains;
}
 GS.cft = SES.initialBudget + netChange;
GS.cft=Math.max(0,Math.round(GS.cft*100)/100);
  if(netChange>0) GS.bestProfit=Math.max(GS.bestProfit,netChange);
  GS.save();
  submitRankingScore(GS.playerName||'PLAYER',waves,GS.cft);

  const profPos=netChange>0;
  const card=$('resultCard'),title=$('resultTitle');
  if(card) card.className='result-card '+(profPos?'win':'lose');
  if(title){title.className='result-title '+(profPos?'win':'lose');title.textContent=profPos?'⬡ EXTRACCIÓN EXITOSA':'☠ NODO CAÍDO';}

  const rows=[
    {l:'MODO',v:SES.mode==='bet'?'APOSTANDO':'GRATIS',cls:''},
    {l:'OLEADAS',v:waves,cls:''},
    {l:'BOSSES',v:SES.bossesFilled,cls:''},
  ];
if(SES.mode==='bet'){
  rows.push({l:'PRESUPUESTO INICIAL', v:SES.initialBudget+' PTS', cls:''});
  rows.push({l:'ORO ACUMULADO',       v:goldAccum+' PTS',         cls:'gold-r'});
  const bonusDesc = `Ol.${SES.wavesCompleted}×1% + ${Math.max(0,Math.floor(multGain))}×100% = +${bonusAmount} PTS`;
  rows.push({l:'BONUS', v:bonusDesc, cls:'gold-r'});
}
  if(SES.reviveCosts>0) rows.push({l:'GASTO REVIVES',v:'-'+SES.reviveCosts+' 🪙',cls:'lose-r'});
  rows.push({l:'BALANCE FINAL', v:GS.cft.toFixed(0)+' PTS', cls:'tot-r'});

  setHTML('resultStats',rows.map(r=>`<div class="rs ${r.cls}"><span class="rs-label">${r.l}</span><span class="rs-val">${r.v}</span></div>`).join(''));
  showScreen('result');
}

/* ══════════════════════════════════
   SCREENS
══════════════════════════════════ */
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const sc=$(name+'Screen');if(sc) sc.classList.add('active');
}

/* ══════════════════════════════════
   LOBBY
══════════════════════════════════ */
let _mode='free',_bet=100;

function setMode(m){
  _mode=m;
  $('modeFreeBtn').className='mode-btn'+(m==='free'?' active-free':'');
  $('modeBetBtn').className='mode-btn'+(m==='bet'?' active-bet':'');
  $('betSection').style.display=m==='bet'?'block':'none';
  $('freeSection').style.display=m==='free'?'block':'none';
  updateLobby();
}

function updateLobby(){
  setText('lbPoints',GS.cft.toFixed(0)+' PTS');
  setText('lbGames',GS.games);
  setText('lbMaxWave',GS.maxWave);
  setText('lbBestProfit', GS.bestProfit.toFixed(0) + ' PTS');;
  const pb=$('playBtn');
  if(_mode==='free'){
    if(pb){pb.disabled=false;pb.textContent='⬡ DEFENDER EL NODO';}
  } else {
    setText('betAmt',_bet);
    if(pb){pb.disabled=_bet<ECO.MIN_BET||_bet>GS.cft;pb.textContent=_bet>GS.cft?'⚠ SALDO INSUFICIENTE':'⬡ DEFENDER EL NODO';}
  }
  buildTowerGuide();
}

function buildTowerGuide(){
  const el=$('towerGuideList');if(!el) return;
  el.innerHTML=Object.entries(TDEFS).map(([k,d])=>{
    const owned=GS.isOwned(k);
    return `<div style="opacity:${owned?1:.45}"><b style="color:${d.color}">${d.emoji} ${d.name}</b>${owned?'':` <span style="color:var(--g);font-size:8px">🔒${d.shopCost}CFT</span>`}<br>${d.desc}</div>`;
  }).join('');
}

document.querySelectorAll('.bet-opt').forEach(o=>o.addEventListener('click',()=>setBet(parseInt(o.dataset.bet))));
$('betCustom').addEventListener('input',e=>{
  const v=parseInt(e.target.value);
  if(!isNaN(v)&&v>=ECO.MIN_BET){_bet=Math.min(v,GS.cft);document.querySelectorAll('.bet-opt').forEach(o=>o.classList.remove('selected'));updateLobby();}
});
function setBet(v){
  _bet=Math.max(ECO.MIN_BET,Math.min(v,GS.cft));
  document.querySelectorAll('.bet-opt').forEach(o=>o.classList.toggle('selected',parseInt(o.dataset.bet)===_bet));
  updateLobby();
}

$('playBtn').addEventListener('click',async()=>{
  if(_mode==='bet'){
    if(GS.cft<_bet){alert('Balance insuficiente');return;}
    if(_bet<ECO.MIN_BET){alert('Presupuesto mínimo: '+ECO.MIN_BET+' PTS');return;}
    GS.cft-=_bet;GS.save();
  }
  SES={
    mode:_mode,
    initialBudget:_mode==='bet'?_bet:0,
    currentBudget:_mode==='bet'?_bet:600,
    lives:ECO.MAX_LIVES,
    wavesCompleted:0,
    bossesFilled:0,
    savedGains:0,
    reviveCosts:0,
    enemiesKilled:0,
    enemiesPassed:0,
  };
  showScreen('loading');
  await new Promise(r=>setTimeout(r,500));
  const canvas=$('gameCanvas');
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  if(window.GE) window.GE.stop();
  showScreen('game');
  const ge=new GameEngine(canvas);
  buildHudBottom();
  selectTower('basic');
  ge.start();updateHUD();
});

$('retryBtn').addEventListener('click',()=>{
  // Restar una vida
  SES.lives--;
  
  if(SES.lives<=0){
    // Game Over - mostrar modal de compra de vidas
    showBuyLivesModal();
    return;
  }
  
  // Si tiene vidas, reintentar oleada
  if(window.GE){window.GE.stop();window.GE=null;}
  
  // Reiniciar juego con la vida que perdió
  retryGame();
});
$('menuBtn').addEventListener('click',()=>{if(window.GE){window.GE.stop();window.GE=null;}showScreen('lobby');updateLobby();});

/* ══════════════════════════════════
   SHOP
══════════════════════════════════ */
function openShop(){
  setText('shopBalDisplay',GS.cft.toFixed(2)+' CFT');
  const grid=$('shopGrid');if(!grid) return;
  grid.innerHTML='';
  
  console.log('[openShop] Renderizando tienda. GS.owned:', GS.owned.slice());
  
  for(const[key,def] of Object.entries(TDEFS)){
    if(!def.locked) continue;
    
    // ✅ VERIFICAR PROPIEDAD AQUÍ (una sola vez)
    const owned = GS.isOwned(key);
    console.log('[openShop] Torre', key, '→ owned:', owned, 'GS.owned:', GS.owned.slice());
    
    const card=document.createElement('div');
    card.className='shop-item'+(owned?' owned':'');
    card.innerHTML=`
      ${owned?'<div class="shop-owned-badge">✓ DESBLOQUEADO</div>':''}
      <div class="shop-emoji">${def.emoji}</div>
      <div class="shop-name">${def.name}</div>
      <div class="shop-desc">${def.desc}</div>
      <div style="font-size:8px;color:#555;margin-bottom:6px">Costo en juego: ${def.cost}🪙</div>
      <div class="shop-price">${owned?'✓ TUYO':'💎 '+def.shopCost+' PTS'}</div>
    `;
    
    if(!owned) {
      // ✅ TORRE NO COMPRADA: clickeable
      card.style.cursor = 'pointer';
      card.style.opacity = '1';
      
      // Usar closure para capturar el valor correcto de 'owned' y 'key'
      card.addEventListener('click', (function(towerKey, isOwned) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('[openShop] Click en torre:', towerKey);
          console.log('[openShop] isOwned en closure:', isOwned);
          console.log('[openShop] GS.isOwned ahora:', GS.isOwned(towerKey));
          
          // ✅ Si cambió de estado, bloquear
          if (GS.isOwned(towerKey)) {
            console.warn('[BLOQUEADO] Torre ya comprada:', towerKey);
            alert(`Ya tenés ${TDEFS[towerKey].emoji} ${TDEFS[towerKey].name} desbloqueada`);
            return;
          }
          
          showBuyConfirm(towerKey);
        };
      })(key, owned));
      
      card.addEventListener('mouseenter', function() {
        card.style.opacity = '0.8';
        card.style.borderColor = 'var(--g)';
      });
      
      card.addEventListener('mouseleave', function() {
        card.style.opacity = '1';
        card.style.borderColor = 'rgba(0,204,255,.18)';
      });
    } else {
      // ✅ TORRE COMPRADA: no clickeable, atenuada
      card.style.cursor = 'default';
      card.style.opacity = '0.6';
      card.style.pointerEvents = 'none';
      console.log('[openShop] Torre bloqueada:', key);
    }
    
    grid.appendChild(card);
  }
  $('shopModal').classList.add('open');
}

function showBuyConfirm(key) {
  const def = TDEFS[key];
  if (!def) return;
  
    // ✅ VERIFICACIÓN DOBLE: Bloquear si YA la compró
  if (GS.isOwned(key)) {
    console.warn('[SKIP] Torre ya desbloqueada:', key);
    alert(`❌ Ya tenés ${def.emoji} ${def.name} desbloqueada`);
    return;
  }

  console.log('[showBuyConfirm] Verificando:', {
    key, 
    owned: GS.isOwned(key),
    GS_owned: GS.owned.slice(),
    GS_cft: GS.cft
  });
  
  if (GS.isOwned(key)) {
    console.warn('[SKIP] Ya desbloqueada:', key);
    alert(`Ya tenés ${def.emoji} ${def.name} desbloqueada`);
    return;
  }
  
  const cost = def.shopCost;
  const balance = GS.cft;
  
  if (balance < cost) {
    alert(`❌ Balance insuficiente\n\nNecesitás: ${cost} PTS\nTenés: ${balance} PTS`);
    return;
  }
  
  // ✅ MODAL PERSONALIZADO (en lugar de confirm() genérico)
  const modal = document.createElement('div');
  modal.className = 'modal-ov open';
  modal.id = 'buyTowerModal';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:360px;border:2px solid var(--g)">
      <button class="modal-close" onclick="document.getElementById('buyTowerModal').remove()">✕</button>
      <h3 class="modal-title" style="color:var(--g)">💎 COMPRAR TORRE</h3>
      
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:48px;margin-bottom:8px">${def.emoji}</div>
        <div style="font-size:14px;font-weight:700;color:var(--s);margin-bottom:4px">${def.name}</div>
        <div style="font-size:9px;color:#666">${def.desc}</div>
      </div>
      
      <div style="background:rgba(255,221,0,.06);border:1px solid rgba(255,221,0,.2);border-radius:8px;padding:12px;margin-bottom:14px;font-size:9px;color:#888;line-height:2">
        <div style="display:flex;justify-content:space-between">
          <span>Costo:</span>
          <span style="color:var(--g);font-weight:700">${cost} CFT</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span>Balance actual:</span>
          <span style="color:var(--s);font-weight:700">${balance} PTS</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,221,0,.1);padding-top:6px;margin-top:6px">
          <span>Nuevo balance:</span>
          <span style="color:var(--p);font-weight:700">${(balance - cost).toFixed(0)} PTS</span>
        </div>
      </div>
      
      <div style="background:rgba(0,204,255,.05);border:1px solid rgba(0,204,255,.15);border-radius:8px;padding:10px;margin-bottom:14px;font-size:8px;color:#666;line-height:1.8">
        ⬡ Desbloqueada permanentemente<br>
        ⬡ Solo se compra UNA VEZ<br>
        ⬡ Disponible en todas las partidas
      </div>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button class="btn btn-sec" onclick="document.getElementById('buyTowerModal').remove()">❌ CANCELAR</button>
        <button class="btn btn-shop" onclick="executeBuyTower('${key}');document.getElementById('buyTowerModal').remove()" style="background:rgba(255,221,0,.15);border:2px solid var(--g);color:var(--g)">✓ COMPRAR</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// ✅ NUEVA función para ejecutar la compra
function executeBuyTower(key) {
  console.log('[executeBuyTower] Intentando comprar:', key);
  
  // ✅ VERIFICACIÓN TRIPLE: Evitar compra duplicada
  if (GS.isOwned(key)) {
    console.warn('[BLOQUEADO] Ya comprada:', key);
    alert(`Ya tenés esta torre`);
    return;
  }
  
  if (typeof window.cdComprarTorre === 'function') {
    window.cdComprarTorre(key);
  } else {
    alert('Error: Sistema de compra no disponible');
  }
}
function closeShop(){$('shopModal').classList.remove('open');}
$('shopBtnLobby').addEventListener('click',openShop);
$('shopModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeShop();});

/* ══════════════════════════════════
   RANKING
══════════════════════════════════ */
const RANK_PRIZES=[500,300,200,100,100,50,50,50,50,50];
function rankKey(){const d=new Date();return `cdRank_${d.getFullYear()}-${d.getMonth()+1}`;}
function getRanking(){try{const r=localStorage.getItem(rankKey());return r?JSON.parse(r):[]; }catch(_){return[];}}
function saveRanking(l){localStorage.setItem(rankKey(),JSON.stringify(l));}
function submitRankingScore(name,wave,cft){
  const list=getRanking(),idx=list.findIndex(x=>x.name===name);
  if(idx>=0){if(wave>list[idx].wave){list[idx].wave=wave;list[idx].cft=cft;}}
  else list.push({name,wave,cft});
  list.sort((a,b)=>b.wave-a.wave||b.cft-a.cft);
  saveRanking(list.slice(0,50));
}
function closeRanking(){$('rankingModal').classList.remove('open');}
$('rankingBtn').addEventListener('click', () => {
    $('rankingModal').classList.add('open');
    const pod = $('rankingPodium');
    if (pod) pod.innerHTML = '<div style="color:#444;font-size:9px;text-align:center;width:100%;padding:20px">⏳</div>';
    const tbl = $('rankingTable');
    if (tbl) tbl.innerHTML = '';
    cdCargarRanking();
});
$('rankingModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeRanking();});

/* ════════════════════════════════════════════════════════════
   SOLUCIÓN DEFINITIVA: !important EN TODO
════════════════════════════════════════════════════════════ */

let _wdInt = null;

function openWallet(tab = 'deposit') {
  console.log('[openWallet] 🔓 ABRIENDO WALLET', tab);
  
  const modal = document.getElementById('walletModal');
  if (!modal) {
    console.error('[openWallet] ❌ Modal #walletModal no encontrado!');
    return;
  }
  
  // ✅ PASO 1: Agregar clase .open
  modal.classList.add('open');
  console.log('[openWallet] ✅ Clase .open agregada');
  
  // ✅ PASO 2: Actualizar datos
  switchWT(tab);
  updateWalletDisplay();
  
  // ✅ DEBUG: Verificar estilos aplicados
  setTimeout(() => {
    const computed = window.getComputedStyle(modal);
    console.log('[openWallet] Debug styles:', {
      display: computed.display,
      opacity: computed.opacity,
      visibility: computed.visibility,
      pointerEvents: computed.pointerEvents,
    });
  }, 50);
}


function closeWallet() {
  console.log('[closeWallet] Cerrando wallet');
  const modal = document.getElementById('walletModal');
  if (modal) {
    modal.classList.remove('open');
    console.log('[closeWallet] ✅ Clase .open removida');
  }
  
  if (window._wdInt) {
    clearInterval(window._wdInt);
    window._wdInt = null;
  }
}

function switchWT(tab){
  document.querySelectorAll('.wallet-tab').forEach(t=>t.classList.toggle('active',t.dataset.wtab===tab));
  $('wpDep').classList.toggle('active',tab==='deposit');
  $('wpWd').classList.toggle('active',tab==='withdraw');
  if(tab==='withdraw') updateWd(); else updateDep();
}

function updateWalletDisplay(){
  const cft = (typeof GS.cft === 'number' ? GS.cft : 0);
  const social = (typeof GS.cftSocial === 'number' ? GS.cftSocial : 0);
  setText('wCftBal', social.toFixed(2) + ' CFT');
  setText('depCur',  social.toFixed(2) + ' CFT');
  setText('wdCur',   cft.toFixed(0) + ' PTS');
  setText('lbPoints', cft.toFixed(0) + ' PTS');
}

function updateDep(){
  const v   = parseFloat(($('depAmt')||{}).value) || 0;
  const pts = Math.floor(v);
  const social = (typeof GS.cftSocial === 'number' ? GS.cftSocial : 0);
  setText('depCur',   social.toFixed(2) + ' CFT');
  setText('depAfter', (GS.cft + pts).toFixed(0) + ' PTS');
  const b = $('depBtn');
  if (b) b.disabled = v < 1 || v > social;
}

function doDeposit(){
  const v=parseFloat(($('depAmt')||{}).value)||0;
  if(v<1) return;
  const msg=$('depMsg');
  if(msg){msg.className='wmsg ok';msg.textContent=`✓ +${v.toFixed(2)} CFT acreditados`;}
  $('depAmt').value='';
  updateWalletDisplay();
  updateDep();
  updateLobby();
}

function updateWd(){
  const amt = parseFloat(($('wdAmt')||{}).value) || 0;
  const balance = (typeof GS.cft === 'number' ? GS.cft : 0);
  const btn = $('wdBtn'), msg = $('wdMsg'), cd = $('wdCdBlock'), fb = $('wdFormBlock');
  
  if (msg){ msg.className='wmsg'; msg.textContent=''; }
  if (btn) btn.disabled = true;

  setText('wdCur',   balance.toFixed(0) + ' PTS');
  setText('wdAfter', Math.max(0, balance - amt).toFixed(0) + ' PTS');

  if (!GS.canWithdraw){
    if (fb){ fb.style.opacity='.4'; fb.style.pointerEvents='none'; }
    if (cd) cd.style.display = 'block';
    if (_wdInt) clearInterval(_wdInt);
    
    const tick = () => {
      const ms = GS.timeUntilWithdraw;
      if (ms <= 0){ 
        if (_wdInt) clearInterval(_wdInt);
        _wdInt = null;
        updateWd(); 
        return; 
      }
      const h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000), s=Math.floor((ms%60000)/1000);
      setText('wdTimer',`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    
    tick(); 
    _wdInt = setInterval(tick, 1000);
    return;
  }

  if (cd) cd.style.display = 'none';
  if (fb){ fb.style.opacity='1'; fb.style.pointerEvents='auto'; }

  if (amt < ECO.WITHDRAW_MIN){
    if (amt > 0 && msg){ msg.className='wmsg err'; msg.textContent=`Mínimo: ${ECO.WITHDRAW_MIN} PTS`; }
  } else if (amt > GS.cft){
    if (msg){ msg.className='wmsg err'; msg.textContent='Puntos insuficientes'; }
  } else {
    if (btn) btn.disabled = false;
    if (msg){ msg.className='wmsg warn'; msg.textContent='⚠ Solo 1 retiro por 24hs'; }
  }
}

function doWithdraw(){
  const amt=parseFloat(($('wdAmt')||{}).value)||0;
  const balance = (typeof GS.cft === 'number' ? GS.cft : 0);
  if(amt<ECO.WITHDRAW_MIN||amt>balance||!GS.canWithdraw) return;
  GS.cft-=amt;
  GS.lastWithdraw=Date.now();
  GS.save();
  const msg=$('wdMsg');
  if(msg){msg.className='wmsg ok';msg.textContent=`✓ ${amt.toFixed(2)} CFT retirados`;}
  $('wdAmt').value='';
  updateWalletDisplay();
  updateWd();
  updateLobby();
}

/* ✅ EVENT LISTENERS */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[WALLET] Agregando event listeners...');
  
  const walletBtn = $('walletBtn');
  const walletModal = $('walletModal');
  
  if (walletBtn) {
    walletBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[WALLET-BTN] ✅ Click detectado');
      openWallet('deposit');
    });
  }
  
  if (walletModal) {
    walletModal.addEventListener('click', function(e) {
      if (e.target === walletModal) {
        console.log('[WALLET-MODAL] Click fuera, cerrando');
        closeWallet();
      }
    });
  }
});

/* ══════════════════════════════════
   COMPRA DE VIDAS
══════════════════════════════════ */
function showBuyLivesModal(){
  const cost=10;
  const hasCFT=GS.cft>=cost;
  const hasGold=window.GE&&window.GE.gold>=cost;
  const canClaimFreeLives=GS.canClaimFreeLives;
  const timeLeft=GS.timeUntilFreeLives;
  
  // En modo apuesta y sin monedas en juego, mostrar aviso
  if(SES.mode==='bet'&&!hasGold&&!hasCFT&&!canClaimFreeLives){
    alert('❌ No tienes monedas en juego, CFT suficientes ni vidas gratuitas disponibles.\n\nNecesitas comprar monedas (CFT) desde el menú para continuar.');
    showScreen('lobby');
    updateLobby();
    return;
  }
  
  // Marcar que perdió vidas si es la primera vez
  if(GS.lostLivesAt===0){
    GS.lostLivesAt=Date.now();
    GS.save();
  }
  
  const modal=document.createElement('div');
  modal.className='modal-ov open';
  modal.id='buyLivesModal';
  
  let freeButtonHTML='';
  if(canClaimFreeLives){
    freeButtonHTML=`<button class="btn btn-success" onclick="claimFreeLives()" style="width:100%;margin-bottom:8px;background:rgba(0,255,136,.15);border:2px solid var(--p);color:var(--p)">🎁 VIDAS GRATIS (24h)</button>`;
  } else {
    const hoursLeft=Math.ceil(timeLeft/3600000);
    freeButtonHTML=`<button class="btn btn-success" style="width:100%;margin-bottom:8px;opacity:.4;cursor:not-allowed">⏰ VIDAS EN ${hoursLeft}h</button>`;
  }
  
  modal.innerHTML=`
    <div class="modal-box" style="max-width:360px">
      <button class="modal-close" onclick="closeBuyLives()">✕</button>
      <h3 class="modal-title" style="color:var(--g)">❤️ COMPRAR VIDAS</h3>
      <p class="modal-sub">Te quedaste sin vidas</p>
      
      <div style="background:rgba(0,204,255,.05);border:1px solid rgba(0,204,255,.15);border-radius:8px;padding:10px;margin-bottom:14px;font-size:9px;color:#666;line-height:1.8">
        <p>Opciones disponibles:</p>
        <p><b style="color:var(--g)">10 CFT o 10 🪙</b> = 3 vidas inmediatas</p>
        <p><b style="color:var(--p)">Gratuito cada 24h</b> = 3 vidas gratis</p>
      </div>
      
      <div style="margin-bottom:12px">
        ${freeButtonHTML}
        ${hasCFT?`<button class="btn btn-green" onclick="buyLivesWithCFT()" style="width:100%;margin-bottom:8px">💎 COMPRAR CON 10 CFT</button>`:`<button class="btn btn-green" style="width:100%;margin-bottom:8px;opacity:.4;cursor:not-allowed">💎 SIN CFT SUFICIENTE</button>`}
        ${hasGold?`<button class="btn btn-shop" onclick="buyLivesWithGold()" style="width:100%;margin-bottom:8px">🪙 COMPRAR CON 10 ORO</button>`:`<button class="btn btn-shop" style="width:100%;margin-bottom:8px;opacity:.4;cursor:not-allowed">🪙 SIN ORO SUFICIENTE</button>`}
      </div>
      
      <button class="btn btn-sec" onclick="giveUpGame()" style="width:100%">🚪 ABANDONAR PARTIDA</button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function closeBuyLives(){
  const m=$('buyLivesModal');
  if(m) m.remove();
}

function buyLivesWithCFT(){
  if(GS.cft<10){alert('No tienes 10 CFT');return;}
  GS.cft-=10;
  GS.save();
  SES.lives=3;
  closeBuyLives();
  retryGame();
}

function buyLivesWithGold(){
  if(!window.GE||window.GE.gold<10){alert('No tienes 10 🪙');return;}
  window.GE.gold-=10;
  SES.lives=3;
  closeBuyLives();
  retryGame();
}

function claimFreeLives(){
  if(!GS.canClaimFreeLives){alert('Las vidas gratis aún no están disponibles');return;}
  GS.lostLivesAt=0; // Reset el timer
  GS.save();
  SES.lives=3;
  closeBuyLives();
  retryGame();
}

function retryGame(){
  showScreen('loading');
  setTimeout(async()=>{
    const canvas=$('gameCanvas');
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    if(window.GE) window.GE.stop();
    showScreen('game');
    const ge=new GameEngine(canvas);
    buildHudBottom();
    selectTower('basic');
    ge.start();updateHUD();
  },500);
}

function giveUpGame(){
  closeBuyLives();
  if(window.GE) window.GE.stop();
  endGame(false,SES.wavesCompleted);
}

$('walletModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeWallet();});

window.addEventListener('resize',()=>{
  const c=$('gameCanvas');
  if(c&&window.GE){c.width=window.innerWidth;c.height=window.innerHeight;window.GE.resize();}
});

window.addEventListener('DOMContentLoaded',()=>{setMode('free');});
</script>

<script src="/play/defence/api.js?v5"></script>

</body>
</html>