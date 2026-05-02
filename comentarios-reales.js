// ============================================
// SISTEMA DE COMENTARIOS REALES
// ============================================

// Sobrescribir la función openComments para usar datos reales
window.openComments = function(element) {
    try {
        const postCard = element.closest('.post-card');
        if (!postCard) return;

        // Extraer el ID real del post (formato: post-123)
        const postDataId = postCard.dataset.postId;
        const postId = postDataId ? postDataId.replace('post-', '') : null;

        if (!postId || isNaN(postId)) {
            showNotification('Error: ID de publicación inválido', 'error');
            return;
        }

        CommentsSystem.currentPost = {
            id: parseInt(postId),
            element: postCard,
            htmlId: postDataId
        };

        const modal = document.getElementById('commentsModal');
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

// Cargar comentarios reales
loadRealComments(parseInt(postId));

// Cargar avatar real del usuario actual
populateCurrentUserAvatar();

        setTimeout(() => {
            const commentInput = document.getElementById('commentInput');
            if (commentInput) {
                commentInput.focus();
            }
        }, 300);

    } catch (error) {
        console.error('Error al abrir comentarios:', error);
        showNotification('Error al cargar comentarios', 'error');
    }
};

// Cargar comentarios reales desde la API
async function loadRealComments(publicacionId) {
    try {
        CommentsSystem.isLoading = true;
        showLoadingState();

        const response = await fetch('../php/obtener_comentarios.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                publicacion_id: publicacionId,
                limit: 20,
                offset: 0
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al cargar comentarios');
        }

        // Convertir formato de API a formato interno
        CommentsSystem.comments = data.comentarios.map(comment => ({
            id: comment.id,
            author: comment.autor.display_name,
            username: comment.autor.username,
            avatar: comment.autor.avatar_url ? 'IMG' : generateAvatarInitials(comment.autor.username),
            avatarUrl: comment.autor.avatar_url,
            verified: comment.autor.verified,
            content: comment.contenido,
            timestamp: new Date(comment.created_at),
            likes: comment.likes_count,
            liked: comment.user_liked,
            tipped: false,
            is_top_comment: comment.is_top_comment,
            replies: comment.respuestas.map(reply => ({
                id: reply.id,
                author: reply.autor.display_name,
                username: reply.autor.username,
                avatar: reply.autor.avatar_url ? 'IMG' : generateAvatarInitials(reply.autor.username),
                avatarUrl: reply.autor.avatar_url,
                verified: reply.autor.verified,
                content: reply.contenido,
                timestamp: new Date(reply.created_at),
                likes: reply.likes_count,
                liked: reply.user_liked,
                tipped: false,
                parentId: reply.parent_id,
                is_top_reply: reply.is_top_reply
            }))
        }));

        renderComments();
        updateCommentsCount();

        console.log(`Comentarios cargados: ${CommentsSystem.comments.length} comentarios principales`);

    } catch (error) {
        console.error('Error cargando comentarios:', error);
        showNotification(`Error al cargar comentarios: ${error.message}`, 'error');
        showEmptyCommentsState();
    } finally {
        CommentsSystem.isLoading = false;
    }
}

// Sobrescribir renderCommentHTML para usar avatares reales
window.renderCommentHTML = function(comment, isReply = false) {
    const processedContent = processContentMentions(comment.content);
    const hasReplies = !isReply && comment.replies && comment.replies.length > 0;
    const repliesVisible = CommentsSystem.visibleReplies.has(comment.id);
    const isOwnComment = comment.username === CommentsSystem.currentUser.username;
    
    // Generar avatar
    let avatarHTML;
    if (comment.avatarUrl) {
        avatarHTML = `<img src="${comment.avatarUrl}" alt="${comment.username}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.textContent='${comment.avatar}';">`;
    } else {
        avatarHTML = comment.avatar;
    }
    
    // ✅ ACTUALIZAR AVATAR DEL USUARIO ACTUAL EN EL MODAL
    if (typeof populateCurrentUserAvatar === 'function') {
        setTimeout(() => {
            populateCurrentUserAvatar();
        }, 100);
    }

    // ✅ Construir barra de acciones con estructura correcta
    let actionsHTML = '';
    
    // 1. Botón "ver" (solo si hay likes > 0)
    if (comment.likes > 0) {
        actionsHTML += `
            <button class="comment-action" onclick="event.stopPropagation(); openLikesModal('comment', ${comment.id}, event);" title="Ver quién dio like">
                ver
            </button>
        `;
    }
    
    // 2. Botón de like
    actionsHTML += `
        <button class="comment-action ${comment.liked ? 'liked' : ''}" onclick="toggleRealCommentLike(${comment.id}, ${isReply}); event.stopPropagation();">
            ${comment.liked ? '❤️' : '🤍'} ${comment.likes}
        </button>
    `;
    
    // 3. Botón de responder (solo si NO es reply)
    if (!isReply) {
        actionsHTML += `
            <button class="comment-action" onclick="toggleReplyForm(${comment.id})">
                💬
            </button>
        `;
    }
    
    // 4. Botón ver respuestas (solo si tiene replies)
    if (hasReplies) {
        const repliesCount = comment.replies.length;
        const repliesText = repliesVisible 
            ? 'Ocultar respuestas' 
            : `Ver ${repliesCount} ${repliesCount === 1 ? 'respuesta' : 'respuestas'}`;
        actionsHTML += `
            <button class="comment-action replies-toggle-btn" onclick="toggleRepliesVisibility(${comment.id})" data-comment-id="${comment.id}">
                ${repliesText}
            </button>
        `;
    }

    return `
        <div class="comment-item ${isReply ? 'reply' : ''}" data-comment-id="${comment.id}">
            <div class="comment-main">
                <div class="comment-avatar">${avatarHTML}</div>
                <div class="comment-content">
<div class="comment-header" style="display: flex; align-items: center; gap: 0.5rem; position: relative;">
                        <span class="comment-author">${escapeHtml(comment.author)}</span>
                        ${comment.verified ? '<span class="comment-verified">✓</span>' : ''}
                        ${comment.is_top_comment ? '<span class="top-comment-indicator">🔥 TOP</span>' : ''}
                        ${comment.is_top_reply ? '<span class="top-reply-indicator">🔥 TOP</span>' : ''}
                        <span class="comment-time">${formatTimeAgo(comment.timestamp)}</span>
                        
                        <!-- Botón de opciones -->
                        <div style="position: relative; margin-left: auto;">
                            ${typeof createCommentOptionsButton === 'function' ? createCommentOptionsButton(comment.id, comment.username) : ''}
                        </div>
                    </div>
                    <div class="comment-text">${processedContent}</div>
                    <div class="comment-actions-bar">
                        ${actionsHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Sobrescribir submitComment para usar API real
window.submitComment = async function() {
    try {
        const input = document.getElementById('commentInput');
        const submitBtn = document.getElementById('submitCommentBtn');
        
        if (!input || !submitBtn) return;
        
        const content = input.value.trim();
        
        if (!content) {
            input.style.borderColor = 'var(--error)';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
            return;
        }

        if (!CommentsSystem.currentPost?.id) {
            showNotification('Error: No se pudo identificar la publicación', 'error');
            return;
        }

        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;

        const response = await fetch('../php/crear_comentario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                publicacion_id: CommentsSystem.currentPost.id,
                contenido: content,
                parent_id: null
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al crear comentario');
        }

        // Agregar el nuevo comentario al principio
        const newComment = {
            id: data.comentario.id,
            author: data.comentario.autor.display_name,
            username: data.comentario.autor.username,
            avatar: data.comentario.autor.avatar_url ? 'IMG' : generateAvatarInitials(data.comentario.autor.username),
            avatarUrl: data.comentario.autor.avatar_url,
            verified: data.comentario.autor.verified,
            content: data.comentario.contenido,
            timestamp: new Date(data.comentario.created_at),
            likes: 0,
            liked: false,
            tipped: false,
            replies: []
        };

        CommentsSystem.comments.unshift(newComment);
        
        renderComments();
        updateCommentsCount();
        updateOriginalPostCommentCount();

        input.value = '';
        input.style.height = 'auto';

        // Mostrar mensaje según tokens ganados
        if (data.tokens_ganados > 0) {
            showNotification(`¡Comentario publicado! Has ganado ${data.tokens_ganados} CFT`);
        } else {
            showNotification(data.message);
        }

    } catch (error) {
        console.error('Error al enviar comentario:', error);
        showNotification(`Error al publicar comentario: ${error.message}`, 'error');
    } finally {
        const submitBtn = document.getElementById('submitCommentBtn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Comentar';
            submitBtn.disabled = false;
        }
    }
};

// Sobrescribir submitReply para usar API real
window.submitReply = async function(commentId) {
    // ✅ Prevenir múltiples envíos
    if (CommentsSystem.isSubmittingReply) {
        return;
    }
    
    try {
        const replyInput = document.getElementById(`replyInput-${commentId}`);
        const submitBtn = document.querySelector(`#replyForm-${commentId} .reply-btn`);
        
        if (!replyInput || !submitBtn) return;
        
        const content = replyInput.value.trim();
        
        if (!content) {
            replyInput.style.borderColor = 'var(--error)';
            setTimeout(() => {
                replyInput.style.borderColor = '';
            }, 2000);
            return;
        }

        if (!CommentsSystem.currentPost?.id) {
            showNotification('Error: No se pudo identificar la publicación', 'error');
            return;
        }

        // ✅ Bloquear botón
        CommentsSystem.isSubmittingReply = true;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Respondiendo...';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';

        const response = await fetch('../php/crear_comentario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                publicacion_id: CommentsSystem.currentPost.id,
                contenido: content,
                parent_id: commentId
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al crear respuesta');
        }

        // Agregar la nueva respuesta
        const newReply = {
            id: data.comentario.id,
            author: data.comentario.autor.display_name,
            username: data.comentario.autor.username,
            avatar: data.comentario.autor.avatar_url ? 'IMG' : generateAvatarInitials(data.comentario.autor.username),
            avatarUrl: data.comentario.autor.avatar_url,
            verified: data.comentario.autor.verified,
            content: data.comentario.contenido,
            timestamp: new Date(data.comentario.created_at),
            likes: 0,
            liked: false,
            tipped: false,
            parentId: commentId
        };

        // Encontrar el comentario padre y agregar la respuesta
        const parentComment = CommentsSystem.comments.find(c => c.id === commentId);
        if (parentComment) {
            if (!parentComment.replies) {
                parentComment.replies = [];
            }
            parentComment.replies.push(newReply);
            
            // Mostrar respuestas automáticamente
            CommentsSystem.visibleReplies.add(commentId);
        }

        CommentsSystem.activeReplyForm = null;
        renderComments();
        updateCommentsCount();

        // Mostrar mensaje según tokens ganados
        if (data.tokens_ganados > 0) {
            showNotification(`¡Respuesta publicada! Has ganado ${data.tokens_ganados} CFT`);
        } else {
            showNotification(data.message);
        }

    } catch (error) {
        console.error('Error al enviar respuesta:', error);
        showNotification(`Error al publicar respuesta: ${error.message}`, 'error');
        
        // ✅ Restaurar botón en caso de error
        const submitBtn = document.querySelector(`#replyForm-${commentId} .reply-btn`);
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Responder';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    } finally {
        // ✅ Desbloquear sistema
        CommentsSystem.isSubmittingReply = false;
    }
};

async function toggleRealCommentLike(commentId, isReply = false) {
    try {
        let comment;
        
        if (isReply) {
            for (let mainComment of CommentsSystem.comments) {
                if (mainComment.replies) {
                    comment = mainComment.replies.find(r => r.id === commentId);
                    if (comment) break;
                }
            }
        } else {
            comment = CommentsSystem.comments.find(c => c.id === commentId);
        }
        
        if (!comment) return;

const button = document.querySelector(`[onclick*="toggleRealCommentLike(${commentId}"]`) || 
              event?.target?.closest?.('.comment-action');

if (!button) {
    console.error('Botón de like no encontrado');
    return;
}

        button.classList.add('action-feedback');
        const action = comment.liked ? 'unlike' : 'like';

        const response = await fetch('php/manejar_likes.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                tipo: 'comentario',
                id: commentId,
                action: action
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            
// ✅ CÓDIGO CORREGIDO
if (response.status === 400) {
    try {
        const errorData = JSON.parse(errorText);
        
        // ✅ Usar showNotification que tiene z-index: 99999999
        if (errorData.message === "No puedes dar like a tu propio comentario") {
            if (typeof showNotification === 'function') {
                showNotification('No puedes dar like a tu propio comentario', 'error');
            } else {
                alert('No puedes dar like a tu propio comentario');
            }
            return;
        } else if (errorData.message === "Ya has dado like a este comentario") {
            if (typeof showNotification === 'function') {
                showNotification('Ya le diste like a este comentario', 'error');
            } else {
                alert('Ya le diste like a este comentario');
            }
            return;
        } else {
            if (typeof showNotification === 'function') {
                showNotification(errorData.message || 'Error al procesar like', 'error');
            } else {
                alert(errorData.message || 'Error al procesar like');
            }
            return;
        }
    } catch (parseError) {
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
} else {
                throw new Error(`Error HTTP ${response.status}: ${errorText}`);
            }
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al procesar like');
        }

        // Actualizar estado local
        comment.liked = data.liked;
        comment.likes = data.new_like_count;

        // ✅ ACTUALIZAR UI CON BOTÓN "VER" SI HAY LIKES
        // Actualizar el botón directamente
button.className = `comment-action ${data.liked ? 'liked' : ''}`;
button.innerHTML = `${data.liked ? '❤️' : '🤍'} ${data.new_like_count}`;

// Re-renderizar comentarios para mostrar/ocultar botón "ver"
renderComments();

        // Efecto visual si es nuevo like
        if (data.liked) {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
            
            if (data.tokens_affected > 0) {
                showNotification(`❤️ Like agregado! El autor ganó ${data.tokens_affected} CFT`);
            }
        } else {
            showNotification(`💔 Like removido`);
        }
        
        setTimeout(() => {
            button.classList.remove('action-feedback');
        }, 600);

    } catch (error) {
        console.error('Error al dar like al comentario:', error);
        showNotification(`Error al procesar like: ${error.message}`, 'error');
        
        try {
            const button = document.querySelector(`[onclick*="toggleRealCommentLike(${commentId}"]`) || 
                          event?.target?.closest?.('.comment-action');
            if (button) {
                button.classList.remove('action-feedback');
            }
        } catch (e) {}
    }
}

/**
 * ✅ NUEVA FUNCIÓN: Actualizar botón de like con contador y botón "Ver"
 */
function updateCommentLikeButton(button, liked, likeCount, commentId, isReply) {
    const heartIcon = liked ? '❤️' : '🤍';
    const likeCountHTML = `<span class="like-count">${likeCount}</span>`;
    
    // Si hay likes > 0, agregar botón "Ver"
    if (likeCount > 0) {
        button.innerHTML = `
            ${heartIcon} ${likeCountHTML}
            <button class="view-likes-btn" 
                    onclick="event.stopPropagation(); openLikesModal('comment', ${commentId}, event)"
                    title="Ver quién dio like">
                Ver
            </button>
        `;
    } else {
        button.innerHTML = `${heartIcon} ${likeCountHTML}`;
    }
    
    button.classList.toggle('liked', liked);
}

/**
 * ✅ NUEVA FUNCIÓN: Inicializar botones "Ver" en comentarios existentes
 */
function initializeCommentLikeButtons() {
    document.querySelectorAll('.comment-action[onclick*="toggleRealCommentLike"]').forEach(button => {
        const likeCountElement = button.querySelector('.like-count');
        if (!likeCountElement) return;
        
        const likeCount = parseInt(likeCountElement.textContent) || 0;
        
        // Extraer commentId del onclick
        const onclickAttr = button.getAttribute('onclick');
        const match = onclickAttr.match(/toggleRealCommentLike\((\d+)/);
        if (!match) return;
        
        const commentId = parseInt(match[1]);
        const isReply = button.closest('.comment-item')?.classList.contains('reply');
        const liked = button.classList.contains('liked');
        
        // Actualizar botón con "Ver" si hay likes
        if (likeCount > 0) {
            updateCommentLikeButton(button, liked, likeCount, commentId, isReply);
        }
    });
    
    console.log('✅ Botones de likes en comentarios inicializados');
}

// ============================================
// ✅ AQUÍ VA: MODIFICAR renderComments para inicializar botones
// ============================================
const originalRenderComments = window.renderComments;
window.renderComments = function() {
    // Llamar a la función original
    if (originalRenderComments) {
        originalRenderComments();
    }
    
    // Inicializar botones "Ver" después de renderizar
    setTimeout(() => {
        initializeCommentLikeButtons();
    }, 100);
};

// ============================================
// ESTILOS CSS PARA BOTÓN "VER"
// ============================================
const commentLikesStyles = document.createElement('style');
commentLikesStyles.textContent = `
    /* Botón "Ver" dentro del botón de like de comentarios */
    .comment-action {
position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    flex-direction: row-reverse;
    }
    
    .view-likes-btn {
background: rgb(99 102 241 / 0%);
    color: var(--primary, #6366f1);
    border: 1px solid rgb(99 102 241 / 0%);
    padding: 0.25rem 0.25rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s 
ease;
    margin-left: 0.3rem;
    }
    
    .view-likes-btn:hover {
    color: var(--primary, #6366f1);
    border: 1px solid rgb(99 102 241 / 0%);
        transform: scale(1.05);
    }
    
    .view-likes-btn:active {
        transform: scale(0.95);
    }
    
    .comment-action .like-count {
        margin-right: 0;
    }
    
    @media (max-width: 480px) {
        .view-likes-btn {
            font-size: 0.7rem;
        }
    }
`;
document.head.appendChild(commentLikesStyles);

// Función auxiliar
function showEmptyCommentsState() {
    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        commentsList.innerHTML = `
            <div class="empty-comments">
                <div class="empty-icon">💬</div>
                <h3>Sin comentarios aún</h3>
                <p>¡Sé el primero en comentar!</p>
            </div>
        `;
    }
}

// Hacer las funciones globales
window.toggleRealCommentLike = toggleRealCommentLike;
window.updateCommentLikeButton = updateCommentLikeButton;
window.initializeCommentLikeButtons = initializeCommentLikeButtons;

console.log('✅ Sistema de comentarios reales con modal de likes cargado');

// Función auxiliar
function showEmptyCommentsState() {
    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        commentsList.innerHTML = `
            <div class="empty-comments">
                <div class="empty-icon">💬</div>
                <h3>Sin comentarios aún</h3>
                <p>¡Sé el primero en comentar!</p>
            </div>
        `;
    }
}

// Hacer la función global
window.toggleRealCommentLike = toggleRealCommentLike;

console.log('✅ Sistema de comentarios reales cargado');

async function populateCurrentUserAvatar() {
    const currentUserAvatar = document.getElementById('currentUserAvatar');
    if (!currentUserAvatar) {
        return;
    }
    
    const username = window.realUserData?.username || CommentsSystem.currentUser?.username;
    if (!username) return;
    
    // Intentar obtener avatar real desde el servidor
    try {
        const response = await fetch(`/php/obtener_perfil.php?user=${encodeURIComponent(username)}`);
        const data = await response.json();
        
        if (data.success && data.profile && data.profile.avatar_url) {
            const avatarUrl = data.profile.avatar_url;
            
// Usar cualquier avatar disponible (real o DiceBear)
if (avatarUrl) {
                currentUserAvatar.innerHTML = `<img src="${avatarUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.textContent='${generateAvatarInitials(username)}';">`;
                
                // Actualizar también en CommentsSystem para futuros usos
                if (CommentsSystem.currentUser) {
                    CommentsSystem.currentUser.avatarUrl = avatarUrl;
                }
                if (window.realUserData) {
                    window.realUserData.avatar_url = avatarUrl;
                }
                
                console.log('✅ Avatar real cargado:', avatarUrl);
                return;
            }
        }
    } catch (e) {
        console.warn('Error obteniendo avatar del servidor:', e);
    }
    
    // Fallback a iniciales si no hay avatar real
    currentUserAvatar.textContent = generateAvatarInitials(username);
}

// ============================================
// AL FINAL DE comentarios-reales.js
// ============================================

// Sobrescribir openComments para inicializar menciones
(function() {
    const originalOpenComments = window.openComments;
    
    window.openComments = function(element) {
        // Llamar a la función original
        if (originalOpenComments) {
            originalOpenComments.call(this, element);
        }
        
        // Inicializar menciones después de abrir el modal
        setTimeout(() => {
            const commentInput = document.getElementById('commentInput');
            if (commentInput && !commentInput.dataset.mentionsInitialized) {
                if (typeof window.initializeMentionAutocomplete === 'function') {
                    window.initializeMentionAutocomplete(commentInput);
                    commentInput.dataset.mentionsInitialized = 'true';
                    console.log('✅ Menciones inicializadas automáticamente');
                } else {
                    console.warn('⚠️ initializeMentionAutocomplete no disponible');
                }
            }
        }, 600);
    };
    
    console.log('✅ openComments interceptado para menciones');
})();

// Hacer la función global
window.populateCurrentUserAvatar = populateCurrentUserAvatar;