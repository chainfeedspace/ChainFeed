// =================================================
// SISTEMA DE COMENTARIOS Y LIKES - MÓDULO
// /js/comentarios_chat.js
// =================================================

class CommentsSystem {
    constructor() {
        this.currentPost = null;
        this.comments = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.injectStyles();
        console.log('💬 Sistema de comentarios inicializado');
    }

    setupEventListeners() {
        // Listener para botones de like en comentarios
        document.addEventListener('click', (e) => {
            if (e.target.closest('.comment-like-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleLikeComment(e.target.closest('.comment-like-btn'));
            }
        });

        // Listener para enviar comentarios
        document.addEventListener('click', (e) => {
            if (e.target.matches('#submitCommentBtn')) {
                e.preventDefault();
                this.submitComment();
            }
        });

        // Listener para responder comentarios
        document.addEventListener('click', (e) => {
            if (e.target.closest('.reply-comment-btn')) {
                e.preventDefault();
                this.toggleReplyForm(e.target.closest('.reply-comment-btn'));
            }
        });

        // Listener para Enter en input de comentarios
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'commentInput' && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitComment();
            }
        });

            document.addEventListener('click', (e) => {
        // Verificar si el click fue fuera del contenedor de comentarios
        const commentsModal = document.getElementById('commentsModal');
        const commentsList = document.getElementById('commentsList');
        
        // Si no hay modal de comentarios activo, no hacer nada
        if (!commentsModal || !commentsModal.classList.contains('active')) {
            return;
        }
        
        // Si el click fue dentro del área de comentarios, no cerrar nada
        if (e.target.closest('.comments-list') || 
            e.target.closest('.comment-item') ||
            e.target.closest('.reply-form') ||
            e.target.closest('.comment-input-section')) {
            return;
        }
        
        // Si llegamos aquí, el click fue fuera - cerrar elementos abiertos
        this.closeOpenElements();
     });

    }

    closeOpenElements() {
    // Cerrar todos los formularios de respuesta activos
    const activeReplyForms = document.querySelectorAll('.reply-form.active');
    activeReplyForms.forEach(form => {
        form.classList.remove('active');
    });
    
    // Colapsar todas las respuestas expandidas
    if (window.repliesCollapseSystem) {
        const expandedReplies = document.querySelectorAll('.replies-container:not(.collapsed)');
        expandedReplies.forEach(container => {
            const commentId = container.dataset.commentId;
            if (commentId) {
                // Agregar a la lista de colapsados
                window.repliesCollapseSystem.collapsedReplies.add(commentId);
                
                // Actualizar visibilidad
                window.repliesCollapseSystem.updateRepliesVisibility(commentId);
                
                // Actualizar botón
                const toggleButton = document.querySelector(`.toggle-replies-btn[data-comment-id="${commentId}"]`);
                if (toggleButton) {
                    window.repliesCollapseSystem.updateToggleButton(toggleButton, commentId);
                }
            }
        });
    }
    
    console.log('🔄 Elementos cerrados por click fuera del contenedor');
}

    async loadComments(postId) {
        console.log('🔄 Cargando comentarios para post:', postId);
        this.currentPost = { id: postId };
        this.isLoading = true;
        this.showLoadingState();

        try {
            const response = await fetch('/php/obtener_comentarios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    publicacion_id: parseInt(postId),
                    limit: 20,
                    offset: 0
                })
            });

            const data = await response.json();
            console.log('📥 Respuesta comentarios:', data);

            if (data.success) {
                this.comments = data.comentarios || [];
                this.renderComments();
                this.updateCommentsCount();
            } else {
                console.error('Error del servidor:', data.message);
                this.showError(data.message || 'Error al cargar comentarios');
            }
        } catch (error) {
            console.error('❌ Error cargando comentarios:', error);
            this.showError('Error de conexión');
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    renderComments() {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) {
            console.error('❌ No se encontró #commentsList');
            return;
        }

        if (this.comments.length === 0) {
            commentsList.innerHTML = `
                <div class="empty-comments">
                    <div class="empty-icon">💬</div>
                    <p>¡Sé el primero en comentar!</p>
                </div>
            `;
            return;
        }

        commentsList.innerHTML = this.comments.map(comment => this.renderComment(comment)).join('');
        console.log(`✅ Renderizados ${this.comments.length} comentarios`);
    
setTimeout(() => {
    if (window.repliesCollapseSystem) {
        console.log('🔧 Ejecutando refreshComments...');
        window.repliesCollapseSystem.refreshComments();
        
        // Debug: verificar si se encontraron respuestas
        const commentsWithReplies = document.querySelectorAll('.comment-item:not(.reply)');
        commentsWithReplies.forEach(comment => {
            const replies = comment.querySelectorAll('.comment-item.reply');
            console.log(`Comentario ${comment.dataset.commentId}: ${replies.length} respuestas`);
        });
    } else {
        console.error('❌ repliesCollapseSystem no disponible');
    }
}, 200)
        
    }

    renderComment(comment, isReply = false) {
        const likeIcon = comment.user_liked ? '❤️' : '🤍';
        const likeClass = comment.user_liked ? 'liked' : '';

        const isOwnComment = comment.autor.id === window.currentUser?.id;

          const topIndicator = comment.is_top_comment || comment.is_top_reply 
        ? '<span class="top-indicator">🔥 Top</span>' 
        : '';
        
        return `
        <div class="comment-item ${isReply ? 'reply' : ''}" data-comment-id="${comment.id}">
            <div class="comment-main">
                    <div class="comment-avatar">
                        ${comment.autor.avatar_url ? 
                            `<img src="${comment.autor.avatar_url}" alt="Avatar" class="avatar-img">` :
                            this.generateInitials(comment.autor.display_name || comment.autor.username)
                        }
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                        <span class="comment-author">${comment.autor.display_name || comment.autor.username}</span>
                        ${comment.autor.verified ? '<span class="comment-verified">✓</span>' : ''}
                        ${topIndicator}
                        <span class="comment-time">${this.formatTime(comment.created_at)}</span>
                    </div>
                        <div class="comment-text">${this.escapeHtml(comment.contenido)}</div>
                <div class="comment-actions-bar">
                    ${!isOwnComment ? `
                        <button class="comment-action comment-like-btn ${likeClass}" 
                                data-comment-id="${comment.id}"
                                data-liked="${comment.user_liked}">
                            <span class="like-icon">${likeIcon}</span>
                            <span class="like-count">${comment.likes_count || 0}</span>
                        </button>
                    ` : `
                        <span class="comment-action comment-like-disabled">
                            <span class="like-icon">🤍</span>
                            <span class="like-count">${comment.likes_count || 0}</span>
                        </span>
                    `}
                    ${!isReply ? `
                        <button class="comment-action reply-comment-btn" 
                                data-comment-id="${comment.id}">
                            💬
                        </button>
                    ` : ''}
                        </div>
                    </div>
                </div>
                
                ${!isReply ? `
                    <div class="reply-form" id="reply-form-${comment.id}">
                        <textarea class="reply-input" 
                                  placeholder="Responder a ${comment.autor.display_name || comment.autor.username}..."
                                  maxlength="500"></textarea>
                        <div class="reply-actions">
                            <button class="cancel-btn" onclick="this.closest('.reply-form').classList.remove('active')">
                                Cancelar
                            </button>
                            <button class="reply-btn" onclick="window.commentsSystem.submitReply(${comment.id})">
                                Responder
                            </button>
                        </div>
                    </div>
                ` : ''}
                
                ${comment.respuestas && comment.respuestas.length > 0 ? 
                    comment.respuestas.map(reply => this.renderComment(reply, true)).join('') : 
                    ''
                }
            </div>
        `;
    }

   async handleLikeComment(button) {
    if (this.isLoading) return;

    const commentId = button.dataset.commentId;
    const currentlyLiked = button.dataset.liked === 'true';
    
    // AGREGAR: Verificar si es comentario propio
    const comment = this.findCommentById(commentId);
    if (comment && comment.autor.id === window.currentUser?.id) {
        this.showError('No puedes dar like a tu propio comentario');
        return;
    }
    
    console.log(`👍 ${currentlyLiked ? 'Unlike' : 'Like'} comentario ${commentId}`);
    
    // Optimistic UI update
    this.updateLikeButtonOptimistic(button, !currentlyLiked);

    try {
        const response = await fetch('/php/toggle_like_comentario.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                comentario_id: parseInt(commentId),
                action: 'toggle'
            })
        });

        const data = await response.json();
        console.log('👍 Respuesta like:', data);

        if (data.success) {
            // Actualizar con datos reales del servidor
            this.updateLikeButton(button, data.user_liked, data.likes_count);
            this.updateCommentInMemory(commentId, data.user_liked, data.likes_count);
        } else {
            // Revertir cambio optimista si falló
            this.updateLikeButtonOptimistic(button, currentlyLiked);
            this.showError(data.message || 'Error al procesar like');
        }
    } catch (error) {
        console.error('❌ Error al dar like:', error);
        this.updateLikeButtonOptimistic(button, currentlyLiked);
        this.showError('Error de conexión');
    }
}

// AGREGAR este método auxiliar después de handleLikeComment:
findCommentById(commentId) {
    for (const comment of this.comments) {
        if (comment.id == commentId) {
            return comment;
        }
        if (comment.respuestas) {
            for (const reply of comment.respuestas) {
                if (reply.id == commentId) {
                    return reply;
                }
            }
        }
    }
    return null;
}

    updateLikeButtonOptimistic(button, liked) {
        const icon = button.querySelector('.like-icon');
        const countSpan = button.querySelector('.like-count');
        const currentCount = parseInt(countSpan.textContent) || 0;
        
        if (liked) {
            button.classList.add('liked');
            button.dataset.liked = 'true';
            icon.textContent = '❤️';
            countSpan.textContent = currentCount + 1;
        } else {
            button.classList.remove('liked');
            button.dataset.liked = 'false';
            icon.textContent = '🤍';
            countSpan.textContent = Math.max(0, currentCount - 1);
        }
    }

    updateLikeButton(button, liked, count) {
        const icon = button.querySelector('.like-icon');
        const countSpan = button.querySelector('.like-count');
        
        if (liked) {
            button.classList.add('liked');
            button.dataset.liked = 'true';
            icon.textContent = '❤️';
        } else {
            button.classList.remove('liked');
            button.dataset.liked = 'false';
            icon.textContent = '🤍';
        }
        
        countSpan.textContent = count;
    }

    updateCommentInMemory(commentId, liked, count) {
        const updateComment = (comments) => {
            comments.forEach(comment => {
                if (comment.id == commentId) {
                    comment.user_liked = liked;
                    comment.likes_count = count;
                } else if (comment.respuestas) {
                    updateComment(comment.respuestas);
                }
            });
        };
        
        updateComment(this.comments);
    }

async submitComment() {
    const input = document.getElementById('commentInput');
    const submitBtn = document.getElementById('submitCommentBtn');
    
    if (!input || !this.currentPost) {
        console.error('❌ No hay input o post actual');
        return;
    }
    
    const contenido = input.value.trim();
    if (!contenido) return;

    console.log('📝 Enviando comentario:', contenido);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const response = await fetch('/php/manejar_comentarios.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                publicacion_id: this.currentPost.id,
                contenido: contenido
            })
        });

        const data = await response.json();
        console.log('📝 Respuesta comentario:', data);

        if (data.success) {
            input.value = '';
            
            // ✅ AGREGAR COMENTARIO LOCALMENTE SIN RECARGAR TODO
            const nuevoComentario = {
                id: data.comentario_id,
                contenido: contenido,
                created_at: new Date().toISOString(),
                autor: {
                    id: window.currentUser?.id,
                    username: window.currentUser?.username || 'usuario',
                    display_name: window.currentUser?.display_name || window.currentUser?.username,
                    avatar_url: window.currentUser?.avatar_url,
                    verified: window.currentUser?.verified || false
                },
                likes_count: 0,
                user_liked: false,
                respuestas: []
            };
            
            // Agregar al array de comentarios
            this.comments.unshift(nuevoComentario);
            
            // Renderizar solo el nuevo comentario al inicio
            const commentsList = document.getElementById('commentsList');
            if (commentsList) {
                const nuevoHTML = this.renderComment(nuevoComentario);
                
                // Si hay comentarios, insertar al inicio
                if (this.comments.length > 1) {
                    commentsList.insertAdjacentHTML('afterbegin', nuevoHTML);
                } else {
                    // Si es el primer comentario, reemplazar el "empty state"
                    commentsList.innerHTML = nuevoHTML;
                }
                
                // Actualizar contador
                this.updateCommentsCount();
                
                // Inicializar sistema de colapso si existe
                if (window.repliesCollapseSystem) {
                    setTimeout(() => {
                        window.repliesCollapseSystem.refreshComments();
                    }, 100);
                }
            }
        } else {
            this.showError(data.message || 'Error al enviar comentario');
        }
    } catch (error) {
        console.error('❌ Error enviando comentario:', error);
        this.showError('Error de conexión');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Comentar';
    }
}

async submitReply(parentCommentId) {
    const replyForm = document.getElementById(`reply-form-${parentCommentId}`);
    const input = replyForm.querySelector('.reply-input');
    const contenido = input.value.trim();
    
    if (!contenido) return;

    console.log(`💬 Enviando respuesta al comentario ${parentCommentId}:`, contenido);
    const replyBtn = replyForm.querySelector('.reply-btn');
    replyBtn.disabled = true;
    replyBtn.textContent = 'Enviando...';

    try {
        const response = await fetch('/php/manejar_comentarios.php', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                publicacion_id: this.currentPost.id,
                contenido: contenido,
                parent_id: parentCommentId
            })
        });

        const data = await response.json();
        console.log('💬 Respuesta reply:', data);

        if (data.success) {
            input.value = '';
            replyForm.classList.remove('active');
            
            // ✅ AGREGAR RESPUESTA LOCALMENTE SIN RECARGAR TODO
            const nuevaRespuesta = {
                id: data.comentario_id,
                contenido: contenido,
                created_at: new Date().toISOString(),
                autor: {
                    id: window.currentUser?.id,
                    username: window.currentUser?.username || 'usuario',
                    display_name: window.currentUser?.display_name || window.currentUser?.username,
                    avatar_url: window.currentUser?.avatar_url,
                    verified: window.currentUser?.verified || false
                },
                likes_count: 0,
                user_liked: false
            };
            
            // Buscar el comentario padre y agregar la respuesta
            const comentarioPadre = this.comments.find(c => c.id == parentCommentId);
            if (comentarioPadre) {
                if (!comentarioPadre.respuestas) {
                    comentarioPadre.respuestas = [];
                }
                comentarioPadre.respuestas.push(nuevaRespuesta);
                
                // Renderizar solo la nueva respuesta
                const comentarioPadreElement = document.querySelector(`[data-comment-id="${parentCommentId}"]`);
                if (comentarioPadreElement) {
                    const respuestaHTML = this.renderComment(nuevaRespuesta, true);
                    
                    // Buscar o crear contenedor de respuestas
                    let repliesContainer = comentarioPadreElement.querySelector('.replies-container');
                    if (!repliesContainer) {
                        repliesContainer = document.createElement('div');
                        repliesContainer.className = 'replies-container';
                        repliesContainer.dataset.commentId = parentCommentId;
                        comentarioPadreElement.appendChild(repliesContainer);
                    }
                    
                    // Agregar la nueva respuesta
                    repliesContainer.insertAdjacentHTML('beforeend', respuestaHTML);
                    
                    // Actualizar sistema de colapso
                    if (window.repliesCollapseSystem) {
                        setTimeout(() => {
                            window.repliesCollapseSystem.refreshComments();
                        }, 100);
                    }
                }
            }
            
            this.updateCommentsCount();
        } else {
            this.showError(data.message || 'Error al enviar respuesta');
        }
    } catch (error) {
        console.error('❌ Error enviando respuesta:', error);
        this.showError('Error de conexión');
    } finally {
        replyBtn.disabled = false;
        replyBtn.textContent = 'Responder';
    }
}

    toggleReplyForm(button) {
        const commentId = button.dataset.commentId;
        const replyForm = document.getElementById(`reply-form-${commentId}`);
        
        if (replyForm) {
            replyForm.classList.toggle('active');
            if (replyForm.classList.contains('active')) {
                const input = replyForm.querySelector('.reply-input');
                setTimeout(() => input.focus(), 100);
            }
        }
    }

    updateCommentsCount() {
        const countElement = document.getElementById('commentsCount');
        if (countElement) {
            const totalComments = this.getTotalCommentsCount();
            countElement.textContent = `(${totalComments})`;
        }
    }

    getTotalCommentsCount() {
        let count = 0;
        const countComments = (comments) => {
            comments.forEach(comment => {
                count++;
                if (comment.respuestas) {
                    countComments(comment.respuestas);
                }
            });
        };
        countComments(this.comments);
        return count;
    }

    showLoadingState() {
        const commentsList = document.getElementById('commentsList');
        if (commentsList) {
            commentsList.innerHTML = `
                <div class="loading-comments" style="text-align: center; padding: 2rem; color: #a0a0b8;">
                    <div style="margin-bottom: 1rem;">⏳</div>
                    <p>Cargando comentarios...</p>
                </div>
            `;
        }
    }

    hideLoadingState() {
        // La función renderComments() reemplazará el estado de carga
    }

    showError(message) {
        console.error('❌ Error en comentarios:', message);
        // Opcional: mostrar notificación visual
        const commentsList = document.getElementById('commentsList');
        if (commentsList && commentsList.querySelector('.loading-comments')) {
            commentsList.innerHTML = `
                <div class="error-comments" style="text-align: center; padding: 2rem; color: #ef4444;">
                    <div style="margin-bottom: 1rem;">⚠️</div>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    injectStyles() {
        // Solo inyectar estilos si no existen ya
        if (document.getElementById('comments-styles')) return;
        
        const commentStyles = document.createElement('style');
        commentStyles.id = 'comments-styles';
        commentStyles.textContent = `
/* ESTILOS PARA LIKES EN COMENTARIOS */
.comment-like-btn {
    background: transparent;
    border: none;
    color: #a0a0b8;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

.comment-like-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
}

.comment-like-btn.liked {
    color: #ef4444;
}

.comment-like-btn.liked .like-icon {
    transform: scale(1.1);
    animation: likeHeart 0.4s ease;
}

.comment-like-btn .like-count {
    font-weight: 600;
    min-width: 20px;
    text-align: left;
}

@keyframes likeHeart {
    0%, 100% { transform: scale(1.1); }
    25% { transform: scale(1.3); }
    50% { transform: scale(1.0); }
}

/* BOTÓN DE RESPONDER */
.reply-comment-btn {
    background: transparent;
    border: none;
    color: #a0a0b8;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

.reply-comment-btn:hover {
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
}

/* FORMULARIO DE RESPUESTA */
.reply-form {
    display: none;
    margin-top: 1rem;
    padding-left: 3rem;
}

.reply-form.active {
    display: block;
}

.reply-input {
    width: 90%;
    background: rgba(37, 37, 50, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.8rem;
    color: #ffffff;
    font-size: 0.9rem;
    resize: none;
    min-height: 60px;
    font-family: inherit;
    transition: all 0.3s ease;
    margin-bottom: 0.5rem;
    outline: none;
}
/* SCROLLBAR PERSONALIZADO PARA COMENTARIOS */
.comments-content::-webkit-scrollbar {
    width: 8px;
}

.comments-content::-webkit-scrollbar-track {
    background: rgba(37, 37, 50, 0.3);
}

.comments-content::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #6366f1, #ec4899);
    border-radius: 4px;
}

.comments-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #8b5cf6, #f472b6);
}

.comments-list::-webkit-scrollbar {
    width: 8px;
}

.comments-list::-webkit-scrollbar-track {
    background: rgba(37, 37, 50, 0.3);
}

.comments-list::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #6366f1, #ec4899);
    border-radius: 4px;
}

.reply-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
}

.reply-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.reply-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    border: none;
    outline: none;
}

.reply-btn {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
}

.reply-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(99, 102, 241, 0.3);
}

.cancel-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #a0a0b8;
}

.cancel-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .reply-form {
        padding-left: 1.5rem;
    }
    
    .comment-like-btn, .reply-comment-btn {
        padding: 0.3rem 0.5rem;
        font-size: 0.8rem;
    }
}
        `;
        
        document.head.appendChild(commentStyles);
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'ahora';
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateInitials(name) {
        if (!name) return 'U';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return (words[0][0] + (words[0][1] || '')).toUpperCase();
    }
}

// =================================================
// INICIALIZACIÓN Y FUNCIONES GLOBALES
// =================================================

// Inicializar sistema cuando el DOM esté listo
function initCommentsSystem() {
    // Crear instancia global
    window.commentsSystem = new CommentsSystem();
    
    // Función global para cargar comentarios
    window.loadRealComments = function(postId) {
        console.log('🚀 loadRealComments llamada con postId:', postId);
        window.commentsSystem.loadComments(postId);
    };
    
    // Función global para cerrar comentarios
    window.closeComments = function() {
        const modal = document.getElementById('commentsModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    if (window.repliesCollapseSystem) {
        window.repliesCollapseSystem.refreshComments();
    }
    
    console.log('✅ Sistema de comentarios con likes completamente cargado');
}

// Auto-inicializar cuando se carga el módulo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommentsSystem);
} else {
    initCommentsSystem();
}