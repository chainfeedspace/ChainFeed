// =================================================
// MÓDULO PARA COLAPSAR/EXPANDIR RESPUESTAS
// /js/respuestas-desplegadas.js
// =================================================

class RepliesCollapseSystem {
    constructor() {
        this.collapsedReplies = new Set(); // IDs de comentarios con respuestas colapsadas
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.injectStyles();
        console.log('📂 Sistema de colapso de respuestas inicializado');
    }

    setupEventListeners() {
        // Listener para botones de colapsar/expandir respuestas
        document.addEventListener('click', (e) => {
            if (e.target.closest('.toggle-replies-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleReplies(e.target.closest('.toggle-replies-btn'));
            }
        });

        // Observer para detectar cuando se cargan nuevos comentarios
        this.observeCommentsChanges();
    }

    observeCommentsChanges() {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Se agregaron nuevos nodos, procesar comentarios
                    this.processComments();
                }
            });
        });

        observer.observe(commentsList, {
            childList: true,
            subtree: true
        });
    }

    processComments() {
        // Buscar todos los comentarios principales (no respuestas)
        const mainComments = document.querySelectorAll('.comment-item:not(.reply)');
        
        mainComments.forEach(comment => {
            this.processComment(comment);
        });
    }

    processComment(commentElement) {
        const commentId = commentElement.dataset.commentId;
        if (!commentId) return;

        // Buscar respuestas directas de este comentario
        const replies = commentElement.querySelectorAll('.comment-item.reply');
        
        if (replies.length === 0) return;

        // Verificar si ya tiene el botón de colapsar
        if (commentElement.querySelector('.toggle-replies-btn')) return;

        // Por defecto, TODAS las respuestas están colapsadas
        this.collapsedReplies.add(commentId);

        // Crear el botón de colapsar/expandir
        const toggleButton = this.createToggleButton(commentId, replies.length);
        
        // Insertar el botón después de las acciones del comentario
        const actionsBar = commentElement.querySelector('.comment-actions-bar');
        if (actionsBar) {
            actionsBar.appendChild(toggleButton);
        }

        // Crear contenedor para las respuestas
        this.wrapReplies(commentElement, commentId);

        // Aplicar el estado inicial (colapsado)
        this.updateRepliesVisibility(commentId);
        this.updateToggleButton(toggleButton, commentId);
    }

    createToggleButton(commentId, repliesCount) {
        const button = document.createElement('button');
        button.className = 'comment-action toggle-replies-btn collapsed';
        button.dataset.commentId = commentId;
        button.dataset.repliesCount = repliesCount;
        
        // Estado inicial: respuestas ocultas, mostrar "Ver X respuesta/s"
        const text = repliesCount === 1 ? 'respuesta' : 'respuestas';
        button.innerHTML = `
            <span class="replies-text">Ver ${repliesCount} ${text}</span>
        `;
        
        return button;
    }

wrapReplies(commentElement, commentId) {
    const replies = commentElement.querySelectorAll('.comment-item.reply');
    
    if (replies.length === 0) return;

    const repliesContainer = document.createElement('div');
    repliesContainer.className = 'replies-container collapsed';
    repliesContainer.dataset.commentId = commentId;

    replies.forEach(reply => {
        repliesContainer.appendChild(reply);
    });

    const mainComment = commentElement.querySelector('.comment-main');
    const replyForm = commentElement.querySelector('.reply-form');
    
    commentElement.appendChild(repliesContainer);
}

    toggleReplies(button) {
        const commentId = button.dataset.commentId;
        
        if (this.collapsedReplies.has(commentId)) {
            // Expandir respuestas
            this.collapsedReplies.delete(commentId);
            console.log(`📂 Expandiendo respuestas del comentario ${commentId}`);
        } else {
            // Colapsar respuestas
            this.collapsedReplies.add(commentId);
            console.log(`📁 Colapsando respuestas del comentario ${commentId}`);
        }

        this.updateRepliesVisibility(commentId);
        this.updateToggleButton(button, commentId);
    }

    updateRepliesVisibility(commentId) {
        const repliesContainer = document.querySelector(`.replies-container[data-comment-id="${commentId}"]`);
        if (!repliesContainer) return;

        const isCollapsed = this.collapsedReplies.has(commentId);
        
        if (isCollapsed) {
            repliesContainer.classList.add('collapsed');
        } else {
            repliesContainer.classList.remove('collapsed');
        }
    }

    updateToggleButton(button, commentId) {
        const isCollapsed = this.collapsedReplies.has(commentId);
        const repliesText = button.querySelector('.replies-text');
        const repliesCount = parseInt(button.dataset.repliesCount);
        const text = repliesCount === 1 ? 'respuesta' : 'respuestas';
        
        if (isCollapsed) {
            // Estado colapsado: mostrar "Ver X respuesta/s"
            button.classList.add('collapsed');
            repliesText.textContent = `Ver ${repliesCount} ${text}`;
        } else {
            // Estado expandido: mostrar "Ocultar X respuesta/s"
            button.classList.remove('collapsed');
            repliesText.textContent = `Ocultar ${repliesCount} ${text}`;
        }
    }

    // Método público para procesar comentarios recién cargados
    refreshComments() {
        this.processComments();
    }

    // Método para colapsar todas las respuestas
    collapseAllReplies() {
        const mainComments = document.querySelectorAll('.comment-item:not(.reply)');
        
        mainComments.forEach(comment => {
            const commentId = comment.dataset.commentId;
            const replies = comment.querySelectorAll('.comment-item.reply');
            
            if (replies.length > 0) {
                this.collapsedReplies.add(commentId);
                this.updateRepliesVisibility(commentId);
                
                const toggleButton = comment.querySelector('.toggle-replies-btn');
                if (toggleButton) {
                    this.updateToggleButton(toggleButton, commentId);
                }
            }
        });
    }

    // Método para expandir todas las respuestas
    expandAllReplies() {
        this.collapsedReplies.clear();
        
        const repliesContainers = document.querySelectorAll('.replies-container');
        repliesContainers.forEach(container => {
            container.classList.remove('collapsed');
        });

        const toggleButtons = document.querySelectorAll('.toggle-replies-btn');
        toggleButtons.forEach(button => {
            const commentId = button.dataset.commentId;
            this.updateToggleButton(button, commentId);
        });
    }

    injectStyles() {
        // Solo inyectar estilos si no existen ya
        if (document.getElementById('replies-collapse-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'replies-collapse-styles';
        styles.textContent = `
/* ESTILOS PARA COLAPSAR/EXPANDIR RESPUESTAS */
.toggle-replies-btn {
    background: transparent;
    border: none;
    color: #a0a0b8;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    margin-left: 0.5rem;
}

.toggle-replies-btn:hover {
    background: rgba(168, 85, 247, 0.1);
    color: #a855f7;
}

.toggle-replies-btn .replies-icon {
    font-size: 0.9rem;
}

.toggle-replies-btn .replies-text {
    font-weight: 500;
    white-space: nowrap;
}

.toggle-replies-btn .toggle-icon {
    font-size: 0.7rem;
    transition: transform 0.3s ease;
    margin-left: 0.2rem;
}

/* INDICADOR VISUAL CUANDO ESTÁN COLAPSADAS (estado por defecto) */
.toggle-replies-btn.collapsed {
    background: rgba(168, 85, 247, 0.1);
    color: #a855f7;
}

/* CONTENEDOR DE RESPUESTAS */
.replies-container {
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: none;
    opacity: 1;
}

.replies-container.collapsed {
    max-height: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
}

/* ANIMACIÓN SUAVE PARA EL COLAPSO */
.replies-container:not(.collapsed) {
    animation: expandReplies 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes expandReplies {
    from {
        max-height: 0;
        opacity: 0;
    }
    to {
        max-height: 1000px;
        opacity: 1;
    }
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .toggle-replies-btn {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        gap: 0.3rem;
    }
    
    .toggle-replies-btn .replies-text {
        font-size: 0.8rem;
    }
    
    .toggle-replies-btn .toggle-icon {
        font-size: 0.6rem;
    }
}

/* ACCESIBILIDAD */
.toggle-replies-btn:focus {
    outline: 2px solid #a855f7;
    outline-offset: 2px;
}

/* MEJORA VISUAL */
.replies-container .comment-item.reply {
    border-left: 2px solid rgba(168, 85, 247, 0.2);
    margin-left: 0.5rem;
    padding-left: 1rem;
}

.replies-container .comment-item.reply:first-child {
    margin-top: 0.5rem;
}

.replies-container .comment-item.reply:last-child {
    margin-bottom: 0.5rem;
}
        `;
        
        document.head.appendChild(styles);
    }
}

// =================================================
// INICIALIZACIÓN Y INTEGRACIÓN
// =================================================

function initRepliesCollapseSystem() {
    // Crear instancia global
    window.repliesCollapseSystem = new RepliesCollapseSystem();
    
    // Función para refrescar cuando se cargan nuevos comentarios
    window.refreshRepliesCollapse = function() {
        if (window.repliesCollapseSystem) {
            window.repliesCollapseSystem.refreshComments();
        }
    };
    
    // Funciones globales para controlar todas las respuestas
    window.collapseAllReplies = function() {
        if (window.repliesCollapseSystem) {
            window.repliesCollapseSystem.collapseAllReplies();
        }
    };
    
    window.expandAllReplies = function() {
        if (window.repliesCollapseSystem) {
            window.repliesCollapseSystem.expandAllReplies();
        }
    };
    
    console.log('✅ Sistema de colapso de respuestas completamente cargado');
}

// Auto-inicializar cuando se carga el módulo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRepliesCollapseSystem);
} else {
    initRepliesCollapseSystem();
}

// =================================================
// INTEGRACIÓN CON EL SISTEMA DE COMENTARIOS
// =================================================

// Hook para integrar con el sistema de comentarios existente
document.addEventListener('DOMContentLoaded', function() {
    // Observar cuando se cargan comentarios nuevos
    const originalLoadComments = window.loadRealComments;
    if (originalLoadComments) {
        window.loadRealComments = function(postId) {
            originalLoadComments(postId);
            
            // Refrescar el sistema de colapso después de cargar comentarios
            setTimeout(() => {
                if (window.repliesCollapseSystem) {
                    window.repliesCollapseSystem.refreshComments();
                }
            }, 200);
        };
    }
});

// Exportar para uso como módulo ES6 si es necesario
export { RepliesCollapseSystem };