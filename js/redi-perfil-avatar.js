// Sistema de redirección a perfil - Versión corregida
(function() {
    const profileTriggerClasses = [
        'fsv-avatar',
        'post-avatar-wrapper',
        // Agrega más clases aquí
    ];
    const selector = profileTriggerClasses.map(c => '.' + c).join(', ');
    
    document.addEventListener('click', function(e) {
        const target = e.target.closest(selector);
        
        if (target) {
            // ✅ EXCLUIR CHAIN EVENTS - VERIFICAR PRIMERO
            if (target.closest('.chain-event-card')) {
                const username = target.querySelector('.post-avatar')?.dataset?.username || 
                                target.dataset?.chainUser;
                
                if (username) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    console.log('⛓️ Redirigiendo a Flash de:', username);
                    window.location.href = '/flash?user=' + username;
                    return false;
                }
                return; // Si no hay username, no hacer nada
            }
            
            // Código original para otros avatares
            const userContainer = target.closest('.fsv-user-info');
            
            if (userContainer) {
                const userMetaElement = userContainer.querySelector('.fsv-user-meta');
                
                if (userMetaElement) {
                    const metaText = userMetaElement.textContent.trim();
                    const usernameMatch = metaText.match(/@(\w+)/);
                    
                    if (usernameMatch && usernameMatch[1]) {
                        const username = usernameMatch[1];
                        
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        window.location.href = `/perfil?user=${username}`;
                    }
                }
            }
        }
    }, true);
    
    console.log('✅ Sistema de redirección a perfil activado (con soporte Chain)');
})();