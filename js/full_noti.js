// ============================================
// FULLSCREEN VIEWER PARA NOTIFICACIONES
// Agregar este código AL FINAL del <script> en notificaciones.html
// ANTES del cierre </script>
// ============================================

function formatCFT(amount) {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0';
    if (num % 1 === 0) return num.toFixed(0);
    return num.toFixed(2);
}

/**
 * FUNCIONES PRINCIPALES - Abrir post desde notificaciones
 */
async function goToPostAndMarkRead(postId, notificationId) {
    await markAsRead(notificationId);
    await abrirFullscreenPost(postId);
}

async function goToPostGroupAndMarkRead(postId, idsString) {
    const ids = idsString.split(',').map(id => parseInt(id));
    await markAsReadGroup(ids);
    await abrirFullscreenPost(postId);
}

/**
 * Cargar y mostrar post en fullscreen
 */
async function abrirFullscreenPost(postId, contexto = 'post') {
    try {
        showNotification('📄 Cargando publicación...', 'info');
        
        const response = await fetch('https://chainfeed.space/php/obtener_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarFullscreenPost(data, contexto);
        } else {
            showNotification('❌ ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error cargando publicación:', error);
        showNotification('❌ Error al cargar publicación', 'error');
    }
}

/**
 * RENDERIZAR FULLSCREEN VIEWER
 */
function mostrarFullscreenPost(data, contexto = 'post') {
    const { post, usuario, vendedor_original, stats, user_interactions } = data;
    
    // Crear overlay fullscreen
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-post-overlay';
    overlay.id = 'fondo-moal-noti';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
        overflow-y: auto;
        padding: 20px;
    `;
    
    // Formatear fecha
    const fechaPost = new Date(post.created_at);
    const fechaFormateada = fechaPost.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Renderizar media según tipo
    let mediaHTML = '';
    if (post.media_url) {
        if (post.tipo === 'video') {
            const isSilenced = post.silenciado;
            
            mediaHTML = `
                <div class="fullscreen-video-container" style="position: relative; width: 100%; border-radius: 12px; overflow: hidden;">
                    <video 
                        id="fullscreen-video-${post.id}"
                        src="${post.media_url}" 
                        ${isSilenced ? 'muted' : ''}
                        preload="metadata"
                        style="
                            width: 100%; 
                            max-height: 500px; 
                            display: block;
                            cursor: pointer;
                        "
                        onclick="toggleVideoPlayPause(this)">
                        Tu navegador no soporta video.
                    </video>
                    
                    <!-- Botón de play/pause superpuesto -->
                    <div class="video-play-overlay" 
                         onclick="toggleVideoPlayPause(document.getElementById('fullscreen-video-${post.id}'))"
                         style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: rgba(0, 0, 0, 0.6);
                            border-radius: 50%;
                            width: 60px;
                            height: 60px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            transition: opacity 0.3s ease;
                            pointer-events: all;
                            opacity: 1;
                        "
                         onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'"
                         onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    
                    ${!isSilenced ? `
                        <!-- Botón de sonido (solo si NO está silenciado) -->
                        <button class="video-sound-btn" 
                                onclick="event.stopPropagation(); toggleVideoSound(document.getElementById('fullscreen-video-${post.id}'), this)"
                                style="
                                    position: absolute;
                                    bottom: 15px;
                                    right: 15px;
                                    background: rgba(0, 0, 0, 0.7);
                                    border: none;
                                    color: white;
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.3s ease;
                                    z-index: 10;
                                "
                                onmouseover="this.style.background='rgba(0, 0, 0, 0.9)'"
                                onmouseout="this.style.background='rgba(0, 0, 0, 0.7)'">
                            <svg class="sound-icon-on" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            </svg>
                            <svg class="sound-icon-off" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            `;
        } else if (post.tipo === 'imagen' || post.tipo === 'gif') {
            mediaHTML = `
                <img src="${post.media_url}" 
                     style="width: 100%; max-height: 600px; object-fit: contain; display: block; border-radius: 12px;">
            `;
        }
    }
    
    overlay.innerHTML = `
        <div style="
            background: rgba(1, 1, 1, 1);
            border-radius: 24px;
            max-width: 700px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.1);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        ">
            <!-- Header fijo -->
            <div style="
                position: sticky;
                top: 0;
                background: rgba(1, 1, 1, 1);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding: 0.5rem 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 10;
                border-radius: 24px 24px 0 0;
                color: #d5d6e1;
            ">
<h3 class="titulo-modal-post" style="margin: 0; font-size: 1.1rem; color: #c9c9ef;">${contexto === 'mention' ? '💬 Comentario' : '📄 Publicación'}</h3>
            <button class="equisfullnoti" onclick="closeFullscreenPost()" style="
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: rgba(243, 243, 243, 0.31);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                "
                onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'"
                onmouseout="this.style.background='rgba(255,255,255,0.1)'">×</button>
            </div>
            
            <!-- Contenido -->
            <div style="padding: 0.5rem;">
                
                <!-- Usuario -->
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem;">
                    <img src="${usuario.avatar_url || '/img/default-avatar.png'}" 
                         style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <a class="usernamemodal" href="/perfil?user=${usuario.username}" 
                               style="color: #e0e1eb; text-decoration: none; font-weight: 600;"
                               onmouseover="this.style.color='#e0e1eb'"
                               onmouseout="this.style.color='#e0e1eb'">
                                ${usuario.display_name}
                            </a>
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">
                            @${usuario.username} · ${fechaFormateada}
                        </div>
                    </div>
                </div>
                
                <!-- Creador original si existe -->
                ${vendedor_original ? `
                    <div style="
                        background: rgba(99, 102, 241, 0.1);
                        border: 1px solid rgba(99, 102, 241, 0.3);
                        border-radius: 12px;
                        padding: 12px;
                        margin-bottom: 1.5rem;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <span style="font-size: 1.5rem;">🎨</span>
                        <div style="font-size: 0.9rem; color: #bdc2df;">
                            Creado originalmente por 
                            <a href="/perfil?user=${vendedor_original.username}" 
                               style="color: var(--primary); text-decoration: none; font-weight: 600;">
                                @${vendedor_original.username}
                            </a>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Contenido del post -->
                ${post.contenido ? `
                    <div style="padding: 0 1rem; margin-bottom: 1.5rem;">
                        <p class="contenido-texto" style="
                            color: #dad9f1; 
                            line-height: 1.6; 
                            font-size: 1.05rem;
                            white-space: pre-wrap; 
                            word-wrap: break-word;
                            margin: 0;
                        ">${escapeHtml(post.contenido)}</p>
                    </div>
                ` : ''}
                
                <!-- Media -->
                ${mediaHTML ? `
                    <div style="margin-bottom: 1.5rem;">
                        ${mediaHTML}
                    </div>
                ` : ''}
                
                <!-- Precio de venta -->
                ${post.en_venta && post.precio_venta ? `
                    <div style="
    background: #22214d54;
    border: 2px solid rgb(63 93 179 / 25%);
    border-radius: 16px;
    padding: 0.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
    display: flex;
    justify-content: space-around;
    align-items: center;
                    ">
                        <div style="font-size: 0.9rem; color: #dddfe7;">
                            💰 Precio de venta
                        </div>
                        <div style="font-size: 1.5rem;
    font-weight: 700;
    color: #b2b1d3;">
                            ${formatCFT(post.precio_venta)} CFT
                        </div>
                    </div>
                ` : ''}
                
                <!-- Stats interactivas - CLICKEABLE SOLO COMENTARIOS -->
                <div class="fondo-botones" style="
    display: flex;
    gap: 1rem;
    padding: 0rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    margin-bottom: 1rem;
    justify-items: center;
    justify-content: space-around;
                ">
  <!-- Likes (CLICKEABLE) -->
<div onclick="window.openLikesModal('publicacion', ${post.id}, event)"
     style="
text-align: center;
display: flex;
gap: 0.5rem;
align-items: center;
cursor: pointer;
padding: 0.5rem;
border-radius: 12px;
transition: all 0.2s ease;
     "
     onmouseover="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.transform='scale(1.05)'"
     onmouseout="this.style.background='transparent'; this.style.transform='scale(1)'">
    <div style="font-size: 1rem;">${user_interactions.liked ? '❤️' : '🤍'}</div>
    <div style="font-size: 0.85rem; color: var(--text-secondary);"></div>
    <div style="font-weight: 600;" id="fullscreen-like-count-${post.id}">${stats.likes_count}</div>
</div>
                    
                    <!-- Comentarios (CLICKEABLE) -->
                    <div onclick="openCommentsModalFromFullscreen(${post.id}, ${stats.comentarios_count})" 
                         style="
text-align: center;
    display: flex;
    gap: 0.5rem;
    align-items: center;
                         "
                         onmouseover="this.style.background='rgba(99, 102, 241, 0.1)'; this.style.transform='scale(1.05)'"
                         onmouseout="this.style.background='transparent'; this.style.transform='scale(1)'">
                        <div style="font-size: 1rem;">💬</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);"></div>
                        <div style="font-weight: 600;" id="fullscreen-comment-count-${post.id}">${stats.comentarios_count}</div>
                    </div>
                    
<!-- Reposts (solo visual) -->
<div style="text-align: center;
    display: flex;
    gap: 0.5rem;
    align-items: center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="${user_interactions.reposted ? '#10b981' : 'currentColor'}">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"></path>
    </svg>
    <div style="font-size: 0.85rem; color: var(--text-secondary);"></div>
    <div style="font-weight: 600;" id="fullscreen-repost-count-${post.id}">${stats.reposts_count}</div>
</div>

<!-- Shares (solo visual) -->
<div style="text-align: center;
    display: flex;
    gap: 0.5rem;
    align-items: center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path>
    </svg>
    <div style="font-size: 0.85rem; color: var(--text-secondary);"></div>
    <div style="font-weight: 600;">${stats.shares_count}</div>
</div>

                </div>
                
                <!-- Botón para ir al perfil -->
                <button class="ir-a-perfilbuton" onclick="window.location.href='/perfil?user=${usuario.username}'" 
                        style="
                            width: 100%;
                            background: rgba(255,255,255,0.05);
                            border: 1px solid rgba(255,255,255,0.1);
                            color: #c1c1dd;
                            padding: 12px;
                            border-radius: 12px;
                            cursor: pointer;
                            font-weight: 600;
                            margin-top: 10px;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                        onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                    👤 Ver perfil de @${usuario.username}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    ScrollLock.lock();

    // Animación de entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
        const content = overlay.querySelector('div > div');
        if (content) content.style.transform = 'scale(1)';
    }, 10);
    
    // Cerrar con ESC
    const closeOnEsc = (e) => {
        if (e.key === 'Escape') {
            closeFullscreenPost();
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
    
    // Cerrar con click fuera
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeFullscreenPost();
        }
    });
}

/**
 * Cerrar fullscreen viewer
 */
function closeFullscreenPost() {
    const overlay = document.querySelector('.fullscreen-post-overlay');
    if (overlay) {
        const video = overlay.querySelector('video');
        if (video && !video.paused) {
            video.pause();
        }
        
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            // ELIMINAR toda la lógica condicional de overflow
            ScrollLock.unlock();
        }, 300);
    }
}

/**
 * Toggle like desde fullscreen
 */
async function toggleFullscreenPostLike(postId, currentlyLiked) {
    const btn = document.getElementById(`fullscreen-like-btn-${postId}`);
    if (!btn) return;
    
    try {
        btn.disabled = true;
        btn.textContent = '⏳ Procesando...';
        
        const action = currentlyLiked ? 'unlike' : 'like';
        
        const response = await fetch('/php/manejar_likes.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: 'publicacion',
                id: postId,
                action: action
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const isLiked = data.liked;
            
            // Actualizar botón
            btn.textContent = isLiked ? '❤️ Te gusta' : '🤍 Me gusta';
            btn.style.background = isLiked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.1)';
            btn.style.borderColor = isLiked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)';
            btn.style.color = isLiked ? '#ef4444' : 'var(--primary)';
            
            // Actualizar contador
            const countEl = document.getElementById(`fullscreen-like-count-${postId}`);
            if (countEl) countEl.textContent = data.new_like_count;
            
            // Actualizar onclick
            btn.setAttribute('onclick', `toggleFullscreenPostLike(${postId}, ${isLiked})`);
            
            showNotification(isLiked ? '❤️ Like agregado' : '💔 Like removido', 'success');
        } else {
            throw new Error(data.message || 'Error al procesar like');
        }
    } catch (error) {
        console.error('Error en like:', error);
        showNotification('❌ ' + error.message, 'error');
    } finally {
        btn.disabled = false;
    }
}

/**
 * Toggle repost desde fullscreen
 */
async function toggleFullscreenPostRepost(postId, currentlyReposted) {
    const btn = document.getElementById(`fullscreen-repost-btn-${postId}`);
    if (!btn) return;
    
    try {
        btn.disabled = true;
        btn.textContent = '⏳ Procesando...';
        
        const action = currentlyReposted ? 'unrepost' : 'repost';
        
        const response = await fetch('/php/manejar_reposts.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicacion_id: postId,
                action: action
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const isReposted = data.reposted;
            
            // Actualizar botón
            btn.textContent = isReposted ? '✅ Reposteado' : '🔄 Repostear';
            btn.style.background = isReposted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.1)';
            btn.style.borderColor = isReposted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)';
            btn.style.color = isReposted ? 'var(--success)' : 'var(--primary)';
            
            // Actualizar contador
            const countEl = document.getElementById(`fullscreen-repost-count-${postId}`);
            if (countEl) countEl.textContent = data.new_repost_count;
            
            // Actualizar onclick
            btn.setAttribute('onclick', `toggleFullscreenPostRepost(${postId}, ${isReposted})`);
            
            showNotification(isReposted ? '🔄 Post reposteado' : '❌ Repost eliminado', 'success');
        } else {
            throw new Error(data.message || 'Error al procesar repost');
        }
    } catch (error) {
        console.error('Error en repost:', error);
        showNotification('❌ ' + error.message, 'error');
    } finally {
        btn.disabled = false;
    }
}

/**
 * Ir a comentarios desde fullscreen
 */
function goToPostCommentsFromFullscreen(postId) {
    closeFullscreenPost();
    localStorage.setItem('openPostOnLoad', postId);
    window.location.href = 'https://chainfeed.space/inicio#comments-post-' + postId;
}

/**
 * ✅ NUEVA: Abrir modal de comentarios directamente desde fullscreen
 */
async function openCommentsModalFromFullscreen(postId, currentCommentCount) {
    try {
        console.log('📝 Abriendo comentarios para post:', postId);
        
        // Pausar video del fullscreen antes de abrir comentarios
        const fullscreenOverlay = document.querySelector('.fullscreen-post-overlay');
        if (fullscreenOverlay) {
            const video = fullscreenOverlay.querySelector('video');
            if (video && !video.paused) {
                video.pause();
            }
        }
        
        // Verificar que existe el modal de comentarios en la página
        const commentsModal = document.getElementById('commentsModal');
        
        if (!commentsModal) {
            console.warn('⚠️ Modal de comentarios no encontrado, redirigiendo a inicio...');
            goToPostCommentsFromFullscreen(postId);
            return;
        }
        
        // Configurar CommentsSystem si existe
        if (typeof CommentsSystem !== 'undefined') {
            CommentsSystem.currentPost = {
                id: parseInt(postId),
                element: null,
                htmlId: `post-${postId}`
            };
        }
        
        // Abrir modal
commentsModal.classList.add('active');
ScrollLock.lock();
        
        // Cargar comentarios usando la función de inicio.js
        if (typeof loadRealComments === 'function') {
            await loadRealComments(parseInt(postId));
        } else {
            console.error('❌ loadRealComments no disponible');
            showNotification('Error al cargar comentarios', 'error');
        }
        
        console.log('✅ Modal de comentarios abierto');
        
    } catch (error) {
        console.error('Error abriendo comentarios:', error);
        showNotification('Error al abrir comentarios', 'error');
    }
}

/**
 * Función auxiliar para escapar HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * ✅ CORREGIDO: Toggle play/pause del video
 */
function toggleVideoPlayPause(videoElement) {
    if (!videoElement) return;
    
    const overlay = videoElement.nextElementSibling;
    
    if (videoElement.paused) {
        videoElement.play();
        // Ocultar overlay INMEDIATAMENTE al reproducir
        if (overlay && overlay.classList.contains('video-play-overlay')) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }
    } else {
        videoElement.pause();
        // Mostrar overlay INMEDIATAMENTE al pausar
        if (overlay && overlay.classList.contains('video-play-overlay')) {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';
            
            // Ocultar después de 2 segundos
            setTimeout(() => {
                if (videoElement.paused) { // Verificar que siga pausado
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                }
            }, 2000);
        }
    }
}

/**
 * ✅ NUEVO: Toggle sonido del video
 */
function toggleVideoSound(videoElement, buttonElement) {
    if (!videoElement || !buttonElement) return;
    
    const soundOnIcon = buttonElement.querySelector('.sound-icon-on');
    const soundOffIcon = buttonElement.querySelector('.sound-icon-off');
    
    videoElement.muted = !videoElement.muted;
    
    if (videoElement.muted) {
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';
        buttonElement.title = 'Activar sonido';
    } else {
        soundOnIcon.style.display = 'block';
        soundOffIcon.style.display = 'none';
        buttonElement.title = 'Silenciar';
    }
    
    // Efecto visual
    buttonElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        buttonElement.style.transform = 'scale(1)';
    }, 150);
}

/**
 * ✅ CORREGIDO: Control automático del overlay
 */
document.addEventListener('DOMContentLoaded', function() {
    // Event listener global para cuando se reproduce
    document.addEventListener('play', function(e) {
        if (e.target.tagName === 'VIDEO') {
            const overlay = e.target.nextElementSibling;
            if (overlay && overlay.classList.contains('video-play-overlay')) {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        }
    }, true);
    
    // Event listener global para cuando se pausa
    document.addEventListener('pause', function(e) {
        if (e.target.tagName === 'VIDEO') {
            const overlay = e.target.nextElementSibling;
            if (overlay && overlay.classList.contains('video-play-overlay')) {
                // Mostrar INMEDIATAMENTE
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'all';
                
                // Ocultar después de 2 segundos
                setTimeout(() => {
                    if (e.target.paused) { // Verificar que siga pausado
                        overlay.style.opacity = '0';
                        overlay.style.pointerEvents = 'none';
                    }
                }, 2000);
            }
        }
    }, true);
    
    // Inicializar estado de overlays al cargar
    setTimeout(() => {
        document.querySelectorAll('video').forEach(video => {
            const overlay = video.nextElementSibling;
            if (overlay && overlay.classList.contains('video-play-overlay')) {
                if (video.paused) {
                    // Visible inicialmente si está pausado
                    overlay.style.opacity = '1';
                    overlay.style.pointerEvents = 'all';
                } else {
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                }
            }
        });
    }, 100);
});

console.log('✅ Fullscreen Viewer para Notificaciones cargado correctamente');