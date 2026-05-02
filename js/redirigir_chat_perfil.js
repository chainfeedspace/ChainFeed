// ============================================
// SISTEMA DE REDIRECCIÓN A CHAT DESDE PERFIL
// ============================================

/**
 * Enviar mensaje desde perfil de usuario
 * @param {string} username - Nombre de usuario del destinatario
 */
function sendMessageFromProfile(username) {
    console.log('📨 Iniciando envío de mensaje desde perfil:', username);
    
    try {
        // Validar que tenemos el username
        if (!username) {
            showNotification('❌ Error: Usuario no encontrado', 'error');
            return;
        }
        
        // Obtener datos del perfil actual
        const profileData = getProfileData();
        
        if (!profileData || !profileData.userId) {
            showNotification('❌ Error: No se pudo obtener información del usuario', 'error');
            console.error('ProfileData no disponible:', profileData);
            return;
        }
        
        // Validar que no intentes enviarte mensaje a ti mismo
        if (CHAINFEED_CONFIG.currentUser && CHAINFEED_CONFIG.currentUser.username === username) {
            showNotification('❌ No puedes enviarte mensajes a ti mismo', 'error');
            return;
        }
        
        // Mostrar feedback inmediato
        showNotification(`✉️ Abriendo chat con @${username}...`, 'info');
        
        // ✅ CORRECCIÓN: Guardar SOLO el userId como string simple
        // El chat espera: localStorage.getItem('chainfeed_open_chat') y luego hace parseInt()
        localStorage.setItem('chainfeed_open_chat', profileData.userId.toString());
        
        console.log('💾 userId guardado en localStorage:', profileData.userId);
        
        // Redirigir después de un breve delay para que el usuario vea la notificación
        setTimeout(() => {
            window.location.href = '/chat';
        }, 800);
        
    } catch (error) {
        console.error('❌ Error en sendMessageFromProfile:', error);
        showNotification('❌ Error al abrir el chat', 'error');
    }
}

/**
 * Obtener datos del perfil actual desde el DOM
 * @returns {Object} Objeto con datos del perfil
 */
function getProfileData() {
    try {
        // Intentar obtener desde realUserData (ya cargado)
        if (typeof realUserData !== 'undefined' && realUserData) {
            console.log('✅ Datos obtenidos desde realUserData');
            return {
                userId: realUserData.id,
                username: realUserData.username,
                displayName: realUserData.display_name,
                avatarUrl: realUserData.avatar_url,
                verified: realUserData.verified
            };
        }
        
        // Fallback: Extraer desde el DOM
        console.log('⚠️ realUserData no disponible, extrayendo desde DOM');
        
        const profileUsername = document.getElementById('profileUsername');
        const profileName = document.getElementById('profileName');
        const profileAvatar = document.getElementById('profileAvatar');
        
        if (!profileUsername) {
            console.error('❌ No se encontró elemento profileUsername');
            return null;
        }
        
        const username = profileUsername.textContent.replace('@', '').trim();
        const displayName = profileName ? profileName.textContent.trim() : username;
        
        // Intentar obtener avatar URL
        let avatarUrl = null;
        if (profileAvatar) {
            const avatarImg = profileAvatar.querySelector('img');
            if (avatarImg) {
                avatarUrl = avatarImg.src;
            }
        }
        
        // Intentar obtener userId desde currentProfileUser o URL
        let userId = null;
        
        // Método 1: Desde variable global
        if (typeof currentProfileUser !== 'undefined') {
            userId = currentProfileUser;
        }
        
        // Método 2: Desde URL params
        if (!userId) {
            const urlParams = new URLSearchParams(window.location.search);
            userId = urlParams.get('user');
        }
        
        // Método 3: Usar username como fallback
        if (!userId) {
            userId = username;
        }
        
        console.log('📋 Datos extraídos del DOM:', {
            userId,
            username,
            displayName,
            avatarUrl
        });
        
        return {
            userId: userId,
            username: username,
            displayName: displayName,
            avatarUrl: avatarUrl,
            verified: false
        };
        
    } catch (error) {
        console.error('❌ Error en getProfileData:', error);
        return null;
    }
}

/**
 * Actualizar el botón de mensaje para usar la nueva función
 */
function updateMessageButton() {
    const messageBtn = document.getElementById('messageOrWalletBtn');
    
    if (!messageBtn) {
        console.warn('⚠️ Botón de mensaje no encontrado');
        return;
    }
    
    // Solo actualizar si NO es el perfil propio
    if (typeof isOwnProfile !== 'undefined' && !isOwnProfile) {
        const username = typeof currentProfileUser !== 'undefined' ? currentProfileUser : null;
        
        if (username) {
            // Remover onclick anterior si existe
            messageBtn.removeAttribute('onclick');
            
            // Agregar nuevo event listener
            messageBtn.addEventListener('click', function(e) {
                e.preventDefault();
                sendMessageFromProfile(username);
            });
            
            console.log('✅ Botón de mensaje actualizado para:', username);
        }
    }
}

/**
 * Verificar si hay un chat pendiente de abrir (para la página de chat)
 * Esta función debe ejecutarse en la página /chat
 * 
 * ⚠️ NOTA: Esta función ya NO es necesaria porque el chat 
 * tiene su propia lógica de detección en cargarDatosIniciales()
 */
function checkPendingChat() {
    console.log('ℹ️ checkPendingChat() - El chat maneja esto internamente');
    return null;
}

/**
 * Limpiar datos de chat pendiente (útil si se cancela la operación)
 */
function clearPendingChat() {
    try {
        localStorage.removeItem('chainfeed_open_chat');
        console.log('🧹 Datos de chat pendiente limpiados');
    } catch (error) {
        console.error('Error limpiando chat pendiente:', error);
    }
}

/**
 * Debug: Mostrar información del sistema de chat
 */
function debugChatRedirection() {
    console.group('🔍 Debug: Sistema de Chat desde Perfil');
    
    console.log('Variables globales:', {
        currentProfileUser: typeof currentProfileUser !== 'undefined' ? currentProfileUser : 'undefined',
        isOwnProfile: typeof isOwnProfile !== 'undefined' ? isOwnProfile : 'undefined',
        realUserData: typeof realUserData !== 'undefined' ? 'disponible' : 'undefined',
        CHAINFEED_CONFIG: typeof CHAINFEED_CONFIG !== 'undefined' ? CHAINFEED_CONFIG : 'undefined'
    });
    
    const profileData = getProfileData();
    console.log('Datos del perfil:', profileData);
    
    const pendingChatId = localStorage.getItem('chainfeed_open_chat');
    console.log('Chat pendiente en localStorage:', pendingChatId ? `SÍ (userId: ${pendingChatId})` : 'NO');
    
    console.groupEnd();
}

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializar sistema de redirección a chat
 */
function initChatRedirection() {
    console.log('🚀 Inicializando sistema de redirección a chat...');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateMessageButton();
        });
    } else {
        // DOM ya está listo
        updateMessageButton();
    }
    
    // También actualizar cuando el perfil se carga completamente
    // (por si el DOM ya estaba listo pero los datos del perfil no)
    setTimeout(() => {
        updateMessageButton();
    }, 1000);
    
    console.log('✅ Sistema de redirección a chat inicializado');
}

// ============================================
// COMPATIBILIDAD CON FUNCIONES EXISTENTES
// ============================================

/**
 * Wrapper para mantener compatibilidad con la función original
 */
function messageOrWallet() {
    console.log('📞 messageOrWallet() llamada');
    
    if (typeof isOwnProfile !== 'undefined' && isOwnProfile) {
        // Si es perfil propio, ir a billetera
        window.location.href = '/billetera';
    } else {
        // Si es perfil ajeno, abrir chat
        const username = typeof currentProfileUser !== 'undefined' ? currentProfileUser : null;
        if (username) {
            sendMessageFromProfile(username);
        } else {
            showNotification('❌ Error: No se pudo obtener el usuario', 'error');
        }
    }
}

/**
 * Función legacy para compatibilidad
 */
function sendMessage() {
    console.log('📞 sendMessage() llamada (legacy)');
    
    if (typeof isOwnProfile !== 'undefined' && isOwnProfile) {
        return;
    }
    
    const username = typeof currentProfileUser !== 'undefined' ? currentProfileUser : null;
    if (username) {
        sendMessageFromProfile(username);
    } else {
        showNotification('❌ Error: No se pudo obtener el usuario', 'error');
    }
}

// ============================================
// EXPORT PARA TESTING Y DEBUG
// ============================================

// Hacer disponibles las funciones para debug en consola
if (typeof window !== 'undefined') {
    window.ChatRedirection = {
        sendMessageFromProfile,
        getProfileData,
        checkPendingChat,
        clearPendingChat,
        debugChatRedirection,
        updateMessageButton
    };
}

// ============================================
// AUTO-INICIALIZACIÓN
// ============================================

// Inicializar automáticamente cuando se carga el script
initChatRedirection();

console.log('📦 Módulo redirigir_chat_perfil.js cargado correctamente');