// ============================================
// SISTEMA DE MENCIONES (@username)
// ============================================

/**
 * Procesar menciones @username en comentarios
 */
function processContentMentions(content) {
    if (!content) return content;
    
    // Escapar HTML primero
    const escaped = escapeHtml(content);
    
    // Convertir @username en enlaces clicables
    // Regex: @ seguido de letras, números, guiones bajos (3-20 caracteres)
    const mentionRegex = /@([a-zA-Z0-9_]{3,20})\b/g;
    
    return escaped.replace(mentionRegex, (match, username) => {
        return `<a href="/perfil?user=${username}" 
                   class="mention-link" 
                   data-username="${username}"
                   onclick="event.stopPropagation(); navigateToProfile('${username}'); return false;">
                   @${username}
                </a>`;
    });
}

/**
 * Navegar al perfil de un usuario mencionado
 */
function navigateToProfile(username) {
    // Cerrar modal de comentarios si está abierto
    const modal = document.getElementById('commentsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Redirigir al perfil con formato correcto
    window.location.href = `/perfil?user=${username}`;
}

/**
 * Autocompletado de menciones mientras escribes
 */
function initializeMentionAutocomplete(inputElement) {
    let mentionDropdown = null;
    let currentMentionSearch = '';
    let availableUsers = [];
    
    inputElement.addEventListener('input', async function(e) {
        const cursorPosition = this.selectionStart;
        const textBeforeCursor = this.value.substring(0, cursorPosition);
        
        // Detectar si está escribiendo una mención
        const mentionMatch = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);
        
        if (mentionMatch) {
            currentMentionSearch = mentionMatch[1].toLowerCase();
            
            // Buscar usuarios que coincidan (mínimo 1 carácter después del @)
            if (currentMentionSearch.length >= 1) {
                await searchUsersForMention(currentMentionSearch);
            } else if (currentMentionSearch.length === 0) {
                // Mostrar usuarios recientes o sugeridos cuando solo hay @
                await searchUsersForMention('');
            }
        } else {
            closeMentionDropdown();
        }
    });
    
    // Navegar con teclado en el dropdown
    inputElement.addEventListener('keydown', function(e) {
        if (!mentionDropdown) return;
        
        const items = mentionDropdown.querySelectorAll('.mention-suggestion-item');
        if (items.length === 0) return;
        
        const currentActive = mentionDropdown.querySelector('.mention-suggestion-item.active');
        let currentIndex = currentActive ? Array.from(items).indexOf(currentActive) : -1;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
            updateActiveMentionItem(items, currentIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
            updateActiveMentionItem(items, currentIndex);
        } else if (e.key === 'Enter' && currentActive) {
            e.preventDefault();
            selectMentionUser(currentActive.dataset.username);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeMentionDropdown();
        }
    });
    
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', function(e) {
        if (mentionDropdown && !mentionDropdown.contains(e.target) && e.target !== inputElement) {
            closeMentionDropdown();
        }
    });
    
    async function searchUsersForMention(search) {
        try {
            const response = await fetch('/php/buscar_usuarios_mencion.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    query: search, 
                    limit: 5 
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.usuarios.length > 0) {
                showMentionDropdown(data.usuarios, inputElement);
            } else {
                closeMentionDropdown();
            }
        } catch (error) {
            console.error('Error buscando usuarios:', error);
            closeMentionDropdown();
        }
    }
    
    function showMentionDropdown(users, inputEl) {
        closeMentionDropdown();
        
        mentionDropdown = document.createElement('div');
        mentionDropdown.className = 'mention-dropdown';
        
        users.forEach((user, index) => {
            const item = document.createElement('div');
            item.className = 'mention-suggestion-item';
            if (index === 0) item.classList.add('active');
            item.dataset.username = user.username;
            
            item.innerHTML = `
                <div class="mention-suggestion-avatar">
                    ${user.avatar_url 
                        ? `<img src="${user.avatar_url}" alt="${user.username}" onerror="this.style.display='none'; this.parentElement.textContent='${generateAvatarInitials(user.username)}';">` 
                        : generateAvatarInitials(user.username)
                    }
                </div>
                <div class="mention-suggestion-info">
                    <div class="mention-suggestion-name">
                        ${escapeHtml(user.display_name)}
                        ${user.verified ? '<span class="verified-badge">✓</span>' : ''}
                    </div>
                    <div class="mention-suggestion-username">@${user.username}</div>
                </div>
            `;
            
            item.addEventListener('click', () => selectMentionUser(user.username));
            mentionDropdown.appendChild(item);
        });
        
        // Posicionar dropdown arriba del input
        const inputRect = inputEl.getBoundingClientRect();
        const dropdownHeight = mentionDropdown.offsetHeight || 200; // Estimado
        
        mentionDropdown.style.position = 'fixed';
        mentionDropdown.style.bottom = `${window.innerHeight - inputRect.top + 10}px`;
        mentionDropdown.style.left = `${inputRect.left}px`;
        mentionDropdown.style.width = `${Math.min(inputRect.width, 350)}px`;
        mentionDropdown.style.maxWidth = 'calc(100vw - 2rem)';
        
        document.body.appendChild(mentionDropdown);
    }
    
    function updateActiveMentionItem(items, newIndex) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === newIndex);
        });
        
        // Scroll automático al item activo
        const activeItem = items[newIndex];
        if (activeItem && mentionDropdown) {
            activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
    
    function selectMentionUser(username) {
        const cursorPosition = inputElement.selectionStart;
        const textBeforeCursor = inputElement.value.substring(0, cursorPosition);
        const textAfterCursor = inputElement.value.substring(cursorPosition);
        
        // Reemplazar el @search con @username
        const newTextBefore = textBeforeCursor.replace(/@[a-zA-Z0-9_]*$/, `@${username} `);
        
        inputElement.value = newTextBefore + textAfterCursor;
        
        // Colocar cursor después de la mención
        const newCursorPos = newTextBefore.length;
        inputElement.setSelectionRange(newCursorPos, newCursorPos);
        
        closeMentionDropdown();
        inputElement.focus();
        
        // Trigger input event para actualizar altura si es textarea
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    function closeMentionDropdown() {
        if (mentionDropdown) {
            mentionDropdown.remove();
            mentionDropdown = null;
        }
    }
}

/**
 * Inicializar autocompletado en input principal de comentarios
 */
function initCommentMentions() {
    const commentInput = document.getElementById('commentInput');
    if (commentInput && !commentInput.dataset.mentionsInitialized) {
        initializeMentionAutocomplete(commentInput);
        commentInput.dataset.mentionsInitialized = 'true';
        console.log('✅ Menciones inicializadas en input principal');
    }
}

/**
 * Inicializar menciones en inputs de respuesta (dinámicos)
 */
const originalToggleReplyForm = window.toggleReplyForm;
window.toggleReplyForm = function(commentId) {
    // Llamar función original
    if (originalToggleReplyForm) {
        originalToggleReplyForm(commentId);
    }
    
    // Inicializar menciones en el input de respuesta
    setTimeout(() => {
        const replyInput = document.getElementById(`replyInput-${commentId}`);
        if (replyInput && !replyInput.dataset.mentionsInitialized) {
            initializeMentionAutocomplete(replyInput);
            replyInput.dataset.mentionsInitialized = 'true';
            console.log(`✅ Menciones inicializadas en respuesta ${commentId}`);
        }
    }, 100);
};

/**
 * Re-inicializar menciones cuando se abre el modal de comentarios
 */
const originalOpenComments = window.openComments;
window.openComments = function(element) {
    // Llamar función original
    if (originalOpenComments) {
        originalOpenComments(element);
    }
    
    // Inicializar menciones después de abrir
    setTimeout(() => {
        initCommentMentions();
    }, 300);
};

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    initCommentMentions();
});

// Si el modal ya está abierto al cargar el script
if (document.getElementById('commentsModal')?.classList.contains('active')) {
    initCommentMentions();
}

// Hacer funciones globales
window.processContentMentions = processContentMentions;
window.navigateToProfile = navigateToProfile;
window.initializeMentionAutocomplete = initializeMentionAutocomplete;
window.initCommentMentions = initCommentMentions;

console.log('✅ Sistema de menciones @username cargado (formato: /perfil?user=username)');