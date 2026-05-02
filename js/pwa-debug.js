// DEBUG PWA - Mostrar estado en pantalla
(function() {
    const debug = document.createElement('div');
    debug.id = 'pwa-debug';
    debug.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 10px;
        right: 10px;
        background: rgba(0,0,0,0.9);
        color: #0f0;
        padding: 15px;
        border-radius: 10px;
        font-family: monospace;
        font-size: 12px;
        z-index: 999999;
        max-height: 200px;
        overflow-y: auto;
    `;
    document.body.appendChild(debug);
    
    function log(msg) {
        debug.innerHTML += msg + '<br>';
        debug.scrollTop = debug.scrollHeight;
        console.log(msg);
    }
    
    log('🔍 PWA Debug iniciado');
    log('📱 UA: ' + navigator.userAgent.substring(0, 50));
    log('🔒 HTTPS: ' + (location.protocol === 'https:'));
    log('📦 Standalone: ' + (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone));
    
    // Verificar manifest
    fetch('/manifest.json')
        .then(r => {
            log('📋 Manifest: ' + r.status);
            return r.json();
        })
        .then(m => log('   Name: ' + m.name))
        .catch(e => log('❌ Manifest error: ' + e.message));
    
    // Verificar SW
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration()
            .then(reg => {
                if (reg) {
                    log('✅ SW: ' + reg.scope);
                    log('   Active: ' + (reg.active ? 'SI' : 'NO'));
                } else {
                    log('⚠️ SW: No registrado');
                }
            })
            .catch(e => log('❌ SW error: ' + e.message));
    } else {
        log('❌ SW no soportado');
    }
    
    // Verificar iconos
    const iconUrl = '/icons/logo192.png';
    fetch(iconUrl)
        .then(r => log('🖼️ Icono 192: ' + r.status))
        .catch(e => log('❌ Icono error: ' + e.message));
    
    // Capturar beforeinstallprompt
    log('⏳ Esperando beforeinstallprompt...');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        log('🎉 beforeinstallprompt RECIBIDO!');
        e.preventDefault();
        window.__pwaPrompt = e;
        
        // Agregar botón de prueba
        const btn = document.createElement('button');
        btn.textContent = '📲 INSTALAR AHORA';
        btn.style.cssText = 'width:100%; padding:10px; margin-top:10px; background:#6366f1; color:white; border:none; border-radius:8px; font-weight:bold;';
        btn.onclick = async () => {
            log('👆 Click en instalar...');
            try {
                window.__pwaPrompt.prompt();
                const result = await window.__pwaPrompt.userChoice;
                log('📊 Resultado: ' + result.outcome);
            } catch(err) {
                log('❌ Error: ' + err.message);
            }
        };
        debug.appendChild(btn);
    });
    
    // Timeout para verificar si nunca llega
    setTimeout(() => {
        if (!window.__pwaPrompt) {
            log('⚠️ 5s sin beforeinstallprompt');
            log('💡 Posibles causas:');
            log('   - App ya instalada');
            log('   - Criterios no cumplidos');
            log('   - Usuario rechazó antes');
        }
    }, 5000);
    
})();