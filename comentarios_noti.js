// ============================================
// SISTEMA COMPLETO DE COMENTARIOS PARA NOTIFICACIONES
// Agregar este código AL FINAL del <script> en notificaciones.html
// DESPUÉS del código del fullscreen viewer
// ============================================

// Estado del sistema de comentarios
const CommentsSystem = {
    currentPost: null,
    comments: [],
    isLoading: false,
    visibleReplies: new Set(),
    activeReplyForm: null,
    currentUser: {
        username: window.CHAINFEED_CONFIG?.currentUser?.username || 'Usuario',
        display_name: window.CHAINFEED_CONFIG?.currentUser?.display_name || 'Usuario',
        avatar_url: window.CHAINFEED_CONFIG?.currentUser?.avatar_url || null
    }
};

/**
 * Abrir modal de comentarios
 */
window.openComments = function(element) {
    try {
        const postCard = element?.closest?.('.post-card');
        const postId = postCard?.dataset?.postId?.replace('post-', '');

        if (!postId || isNaN(postId)) {
            console.error('ID de publicación inválido');
            return;
        }

        CommentsSystem.currentPost = {
            id: parseInt(postId),
            element: postCard,
            htmlId: `post-${postId}`
        };

        const modal = document.getElementById('commentsModal');
        if (!modal) {
            console.error('Modal de comentarios no encontrado');
            return;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Cargar comentarios
        loadRealComments(parseInt(postId));

        // Focus en input
        setTimeout(() => {
            const commentInput = document.getElementById('commentInput');
            if (commentInput) commentInput.focus();
        }, 300);

    } catch (error) {
        console.error('Error al abrir comentarios:', error);
        showNotification('Error al cargar comentarios', 'error');
    }
};

window.closeComments = function() {
    const modal = document.getElementById('commentsModal');
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        ScrollLock.unlock();  // ✅ USAR SISTEMA CENTRALIZADO
        
        // Limpiar estado
        CommentsSystem.comments = [];
        CommentsSystem.visibleReplies.clear();
        CommentsSystem.activeReplyForm = null;
    }
};

/**
 * Cargar comentarios desde la API
 */
async function loadRealComments(publicacionId) {
    try {
        CommentsSystem.isLoading = true;
        showLoadingState();

        const response = await fetch('/php/obtener_comentarios.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                publicacion_id: publicacionId,
                limit: 50,
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

        console.log(`✅ Comentarios cargados: ${CommentsSystem.comments.length}`);

    } catch (error) {
        console.error('Error cargando comentarios:', error);
        showNotification('Error al cargar comentarios', 'error');
        showEmptyCommentsState();
    } finally {
        CommentsSystem.isLoading = false;
    }
}

/**
 * Renderizar comentarios en el DOM
 */
function renderComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    if (CommentsSystem.comments.length === 0) {
        showEmptyCommentsState();
        return;
    }

    commentsList.innerHTML = CommentsSystem.comments.map(comment => 
        renderCommentHTML(comment, false)
    ).join('');
}

/**
 * Renderizar HTML de un comentario
 */
function renderCommentHTML(comment, isReply = false) {
    const processedContent = escapeHtml(comment.content);
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
    
    return `
        <div id="comentarionotifica" class="comment-item ${isReply ? 'reply' : ''}" data-comment-id="${comment.id}" style="
    border: 1px solid;
    margin-top: 1rem;
    border-color: rgba(255, 255, 255, 0.05)">
            <div class="comment-main">
                <div class="comment-avatar">${avatarHTML}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${escapeHtml(comment.author)}</span>
                        ${comment.verified ? '<span class="comment-verified">✓</span>' : ''}
                        ${comment.is_top_comment ? '<span class="top-comment-indicator">🔥 TOP</span>' : ''}
                        ${comment.is_top_reply ? '<span class="top-reply-indicator">🔥 TOP</span>' : ''}
                        <span class="comment-time">${formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <div class="comment-text">${processedContent}</div>
                    <div class="comment-actions-bar">
                        <button class="comment-action ${comment.liked ? 'liked' : ''}" onclick="toggleCommentLike(${comment.id}, ${isReply})">
                            ${comment.liked ? '❤️' : '🤍'} <span class="like-count">${comment.likes}</span>
                        </button>
                        ${!isReply ? `<button class="comment-action" onclick="toggleReplyForm(${comment.id})">💬</button>` : ''}
                        ${hasReplies ? `
                            <button class="comment-action" onclick="toggleRepliesVisibility(${comment.id})">
                                ${repliesVisible ? 'Ocultar respuestas' : `Ver respuestas (${comment.replies.length})`}
                            </button>
                        ` : ''}
                    </div>
                    
                    ${hasReplies && repliesVisible ? `
                        <div class="replies-container">
                            ${comment.replies.map(reply => renderCommentHTML(reply, true)).join('')}
                        </div>
                    ` : ''}
                    
${CommentsSystem.activeReplyForm === comment.id ? `
    <div class="reply-form" style="
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    ">
        <div style="display: flex; gap: 1rem; align-items: flex-end; flex-direction: column;">
<textarea 
    class="imputcomentnotirepli"
    id="replyInput-${comment.id}" 
    placeholder="Escribe una respuesta..." 
    rows="1"
    oninput="autoResizeTextarea(this)"
    style="
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 0.8rem;
        color: var(--text);
        font-family: inherit;
        font-size: 0.95rem;
        resize: none;
        max-height: 120px;
        min-height: 42px;
        width: -webkit-fill-available;
        outline: none;
    "
    onfocus="this.style.borderColor='rgba(99, 102, 241, 0.5)'"
    onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'"
></textarea>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="submitReply(${comment.id})" style="
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(99, 102, 241, 0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    Responder
                </button>
                <button onclick="cancelReply()" style="
                    background: rgba(255,255,255,0.1);
                    color: var(--text);
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                "
                onmouseover="this.style.background='rgba(255,255,255,0.15)'"
                onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Toggle visibilidad de respuestas
 */
window.toggleRepliesVisibility = function(commentId) {
    if (CommentsSystem.visibleReplies.has(commentId)) {
        CommentsSystem.visibleReplies.delete(commentId);
    } else {
        CommentsSystem.visibleReplies.add(commentId);
    }
    renderComments();
};

/**
 * Toggle formulario de respuesta
 */
window.toggleReplyForm = function(commentId) {
    if (CommentsSystem.activeReplyForm === commentId) {
        CommentsSystem.activeReplyForm = null;
    } else {
        CommentsSystem.activeReplyForm = commentId;
    }
    renderComments();
    
    setTimeout(() => {
        const replyInput = document.getElementById(`replyInput-${commentId}`);
        if (replyInput) replyInput.focus();
    }, 100);
};

/**
 * Cancelar respuesta
 */
window.cancelReply = function() {
    CommentsSystem.activeReplyForm = null;
    renderComments();
};

/**
 * Enviar comentario principal
 */
window.submitComment = async function() {
    try {
        const input = document.getElementById('commentInput');
        const submitBtn = document.getElementById('submitCommentBtn');
        
        if (!input || !submitBtn) return;
        
        const content = input.value.trim();
        
        if (!content) {
            input.style.borderColor = 'var(--error)';
            setTimeout(() => input.style.borderColor = '', 2000);
            return;
        }

        if (!CommentsSystem.currentPost?.id) {
            showNotification('Error: No se pudo identificar la publicación', 'error');
            return;
        }

        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;

        const response = await fetch('/php/crear_comentario.php', {
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

        // Agregar el nuevo comentario
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

        input.value = '';
        input.style.height = 'auto';

        showNotification(data.tokens_ganados > 0 
            ? `¡Comentario publicado! Has ganado ${data.tokens_ganados} CFT` 
            : data.message
        );

    } catch (error) {
        console.error('Error al enviar comentario:', error);
        showNotification('Error al publicar comentario', 'error');
    } finally {
        const submitBtn = document.getElementById('submitCommentBtn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Comentar';
            submitBtn.disabled = false;
        }
    }
};

/**
 * Enviar respuesta
 */
window.submitReply = async function(commentId) {
    try {
        const replyInput = document.getElementById(`replyInput-${commentId}`);
        if (!replyInput) return;
        
        const content = replyInput.value.trim();
        
        if (!content) {
            replyInput.style.borderColor = 'var(--error)';
            setTimeout(() => replyInput.style.borderColor = '', 2000);
            return;
        }

        const response = await fetch('/php/crear_comentario.php', {
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

        const parentComment = CommentsSystem.comments.find(c => c.id === commentId);
        if (parentComment) {
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.push(newReply);
            CommentsSystem.visibleReplies.add(commentId);
        }

        CommentsSystem.activeReplyForm = null;
        renderComments();

        showNotification(data.tokens_ganados > 0 
            ? `¡Respuesta publicada! Has ganado ${data.tokens_ganados} CFT` 
            : data.message
        );

    } catch (error) {
        console.error('Error al enviar respuesta:', error);
        showNotification('Error al publicar respuesta', 'error');
    }
};

/**
 * Toggle like en comentario
 */
window.toggleCommentLike = async function(commentId, isReply = false) {
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

        const action = comment.liked ? 'unlike' : 'like';

        const response = await fetch('/php/manejar_likes.php', {
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
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al procesar like');
        }

        // Actualizar estado
        comment.liked = data.liked;
        comment.likes = data.new_like_count;

        renderComments();

        if (data.liked && data.tokens_affected > 0) {
            showNotification(`❤️ Like agregado! El autor ganó ${data.tokens_affected} CFT`);
        }

    } catch (error) {
        console.error('Error al dar like:', error);
        showNotification('Error al procesar like', 'error');
    }
};

/**
 * Mostrar estado de carga
 */
function showLoadingState() {
    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        commentsList.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="width: 40px; height: 40px; border: 4px solid rgba(99, 102, 241, 0.3); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p>Cargando comentarios...</p>
            </div>
        `;
    }
}

/**
 * Mostrar estado vacío
 */
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

/**
 * Auto-resize del textarea
 */
window.autoResizeTextarea = function(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
};

/**
 * Generar iniciales para avatar
 */
function generateAvatarInitials(username) {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
}

/**
 * Escapar HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Formatear tiempo relativo
 */
function formatTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'ahora';
    if (minutes < 60) return `hace ${minutes}m`;
    if (hours < 24) return `hace ${hours}h`;
    if (days < 7) return `hace ${days}d`;
    return timestamp.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

console.log('✅ Sistema completo de comentarios cargado en notificaciones');