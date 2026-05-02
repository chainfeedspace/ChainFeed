/**
 * ============================================
 * REDIRECCIÓN INTELIGENTE A PERFILES
 * ============================================
 * Intercepta datos existentes sin modificar HTML
 */

console.log('🚀 Sistema de redirección inteligente cargado');

// ========================================
// CONFIGURACIÓN
// ========================================
const CONFIG = {
  profileUrl: '/perfil?user=',
  debug: true
};

function log(msg, data) {
  if (CONFIG.debug) console.log(`[ProfileRedirect] ${msg}`, data || '');
}

// ========================================
// ALMACENAR MAPEO: NOMBRE → USERNAME
// ========================================
const userMap = new Map(); // displayName/name → username

// ========================================
// INTERCEPTAR DATOS DE CHATS
// ========================================
function interceptChatData() {
  // Interceptar cuando se cargan los chats
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    
    // Clonar la respuesta para poder leerla
    const clonedResponse = response.clone();
    
    try {
      const data = await clonedResponse.json();
      
      // Si es la respuesta de chats, extraer usernames
      if (data.chats && Array.isArray(data.chats)) {
        log('📦 Chats detectados:', data.chats.length);
        data.chats.forEach(chat => {
          if (chat.username && chat.name) {
            const cleanUsername = chat.username.replace('@', '');
            userMap.set(chat.name, cleanUsername);
            userMap.set(chat.id, cleanUsername);
            log(`✅ Mapeado: "${chat.name}" → @${cleanUsername}`);
          }
        });
      }
      
      // Si es la respuesta de mensajes, extraer autor
      if (data.chat_info) {
        const cleanUsername = data.chat_info.username?.replace('@', '');
        if (cleanUsername) {
          userMap.set(data.chat_info.name, cleanUsername);
          userMap.set(data.chat_info.id, cleanUsername);
          log(`✅ Mapeado (chat_info): "${data.chat_info.name}" → @${cleanUsername}`);
        }
      }
      
    } catch (e) {
      // No es JSON o error parseando, ignorar
    }
    
    return response;
  };
  
  log('✅ Interceptor de fetch activado');
}

// ========================================
// BUSCAR USERNAME POR CONTEXTO
// ========================================
function findUsernameByContext(element) {
  // 1. Buscar en el texto visible
  const text = element.textContent?.trim();
  
  // 2. Buscar en el mapa por nombre
  if (text && userMap.has(text)) {
    const username = userMap.get(text);
    log(`✅ Username encontrado en mapa por nombre: "${text}" → @${username}`);
    return username;
  }
  
  // 3. Buscar en el header del chat activo
  const headerName = document.querySelector('.conversation-name')?.textContent?.trim();
  if (headerName && userMap.has(headerName)) {
    const username = userMap.get(headerName);
    log(`✅ Username encontrado por header: "${headerName}" → @${username}`);
    return username;
  }
  
  // 4. Buscar el chat-item padre más cercano
  const chatItem = element.closest('.chat-item, [data-chat-id]');
  if (chatItem) {
    const chatId = chatItem.dataset?.chatId;
    if (chatId && userMap.has(parseInt(chatId))) {
      const username = userMap.get(parseInt(chatId));
      log(`✅ Username encontrado por chat-id: ${chatId} → @${username}`);
      return username;
    }
    
    const chatName = chatItem.querySelector('.chat-name, .chat-item-name')?.textContent?.trim();
    if (chatName && userMap.has(chatName)) {
      const username = userMap.get(chatName);
      log(`✅ Username encontrado por chat-name: "${chatName}" → @${username}`);
      return username;
    }
  }
  
  // 5. Buscar en publicaciones compartidas (ya tienen data-username)
  const sharedPost = element.closest('[data-username]');
  if (sharedPost?.dataset?.username) {
    const username = sharedPost.dataset.username;
    log(`✅ Username encontrado en data-username: @${username}`);
    return username;
  }
  
  // 6. Búsqueda exhaustiva en el mapa
  for (const [key, value] of userMap.entries()) {
    if (text && text.includes(key)) {
      log(`✅ Username encontrado por coincidencia parcial: "${key}" → @${value}`);
      return value;
    }
  }
  
  log('❌ No se pudo encontrar username');
  return null;
}

// ========================================
// DETECTAR ELEMENTOS CLICKEABLES (CORREGIDO)
// ========================================
function isProfileElement(element) {
  if (!element || !element.classList) return false;
  
  // ❌ EXCLUIR ESTOS ELEMENTOS SIEMPRE
  const excludedTags = ['BUTTON', 'INPUT', 'TEXTAREA', 'A', 'SELECT'];
  if (excludedTags.includes(element.tagName)) {
    return false;
  }
  
  // ❌ EXCLUIR CLASES ESPECÍFICAS DEL UI
  const excludedClasses = [
    'send-btn', 'media-btn', 'input-', 'message-input',
    'fsv-', 'close-btn', 'back-btn', 'modal-', 'toast-',
    'btn', 'button', 'control', 'nav-', 'menu-'
  ];
  
  const className = element.className?.toString()?.toLowerCase() || '';
  if (excludedClasses.some(cls => className.includes(cls))) {
    return false;
  }
  
  // ✅ SOLO ESTOS SON CLICKEABLES PARA PERFIL
  const profileClasses = [
    'avatar', 'username', 'author-name', 'conversation-name',
    'chat-name', 'item-name', 'user-info', 'blocked-author',
    'shared-post-author', 'follower-', 'comment-author'
  ];
  
  return profileClasses.some(cls => className.includes(cls));
}

// ========================================
// LISTENER GLOBAL (MEJORADO)
// ========================================
document.addEventListener('click', function(e) {
  let target = e.target;
  
  // ❌ IGNORAR CLICKS EN BOTONES, INPUTS, ETC
  if (['BUTTON', 'INPUT', 'TEXTAREA', 'A', 'SELECT'].includes(target.tagName)) {
    return; // Dejar que el evento siga su curso normal
  }
  
  // ❌ IGNORAR CLICKS EN ÁREAS DE CONTROL
  if (target.closest('.input-wrapper, .chat-input-container, .modal, .toast, .fsv-controls')) {
    return;
  }
  
  // Buscar elemento clickeable (hasta 5 niveles)
  for (let i = 0; i < 5 && target && target !== document.body; i++) {
    if (isProfileElement(target)) {
      log('🎯 Click en elemento de perfil:', target.className);
      
      const username = findUsernameByContext(target);
      
      if (username) {
        e.preventDefault();
        e.stopPropagation();
        
        const url = CONFIG.profileUrl + username.replace('@', '');
        log('🔗 Redirigiendo a:', url);
        window.location.href = url;
        return false;
      }
      
      break;
    }
    
    target = target.parentElement;
  }
}, true);

// ========================================
// ESTILOS VISUALES
// ========================================
const style = document.createElement('style');
style.textContent = `
  [class*="avatar"]:not(button):not(input),
  [class*="username"]:not(button):not(input),
  [class*="author"]:not(button):not(input),
  .conversation-name,
  .chat-name,
  .chat-item-name {
    cursor: pointer !important;
    transition: opacity 0.2s ease;
  }
  
  [class*="avatar"]:hover,
  [class*="username"]:hover,
  .conversation-name:hover,
  .chat-name:hover {
    opacity: 0.7;
  }
`;
document.head.appendChild(style);

// ========================================
// INICIALIZACIÓN
// ========================================
interceptChatData();

// Intentar extraer datos ya existentes en el DOM
setTimeout(() => {
  // Buscar chats ya cargados
  document.querySelectorAll('.chat-item').forEach(item => {
    const name = item.querySelector('.chat-name, .chat-item-name')?.textContent?.trim();
    const username = item.querySelector('[class*="username"]')?.textContent?.trim()?.replace('@', '');
    
    if (name && username) {
      userMap.set(name, username);
      log(`✅ Mapeado desde DOM: "${name}" → @${username}`);
    }
  });
  
  log('📊 Mapa de usuarios:', userMap.size, 'entradas');
}, 1000);

// ========================================
// API PÚBLICA
// ========================================
window.ChatProfileRedirect = {
  setDebug: (enabled) => CONFIG.debug = enabled,
  showMap: () => {
    console.table(Array.from(userMap.entries()).map(([k, v]) => ({
      nombre: k,
      username: v
    })));
  },
  addMapping: (name, username) => {
    userMap.set(name, username.replace('@', ''));
    log(`✅ Mapeo manual agregado: "${name}" → @${username}`);
  }
};

log('🎉 Sistema listo - Mapeando usuarios automáticamente');