// ============================================
// EVENTOS CHAIN - ARCHIVO COMPLETO ACTUALIZADO
// ============================================

// Variables globales para Chain Events
let chainEventsData = [];
let chainPagination = {
    offset: 0,
    limit: 20,
    hasMore: true
};

window.chainEventsData = chainEventsData;

// Crear ChainSystem con getter que siempre apunta al array global
window.ChainSystem = {
    pagination: chainPagination,
    get events() {
        return window.chainEventsData;
    },
    set events(value) {
        window.chainEventsData = value;
        chainEventsData = value;
    }
};
    
    function loadChainContent() {
    console.log('Loading Chain content - UNIFIED VERSION...');
    
    // El contenedor ya fue creado por el sistema unificado
    const chainContainer = document.getElementById('chain-events-container');
    if (!chainContainer) {
        console.error('Chain container not found - sistema unificado no funcionó');
        return;
    }
    
    // ✅ NUEVO: Verificar que NO haya filtros visibles
    console.log('🔍 Verificando filtros en Chain...');
    const postsFilters = document.getElementById('postsFilters');
    const viralesFilters = document.getElementById('viralesFilters');
    
    if (postsFilters && !postsFilters.classList.contains('hidden')) {
        console.warn('⚠️ Filtros de Posts visibles en Chain - ocultando...');
        postsFilters.classList.add('hidden');
        postsFilters.style.display = 'none';
    }
    
    if (viralesFilters && !viralesFilters.classList.contains('hidden')) {
        console.warn('⚠️ Filtros de Virales visibles en Chain - ocultando...');
        viralesFilters.classList.add('hidden');
        viralesFilters.style.display = 'none';
    }
    
    // Mostrar loading
    chainContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div class="loading-spinner" style="
                margin: 0 auto 1rem auto;
                width: 60px;
                height: 60px;
                border: 4px solid rgba(99, 102, 241, 0.3);
                border-left: 4px solid var(--primary, #6366f1);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <p style="color: var(--text-secondary, #666);">Cargando eventos Chain...</p>
        </div>
        <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
    `;
    
    // Reset pagination
    chainPagination.offset = 0;
    chainEventsData = [];
    
    // Cargar eventos
    loadChainEvents(chainContainer);
}

async function loadChainEvents(containerElement = null, append = false) {
    try {
        console.log('Fetching chain events...');
        
        const contentArea = containerElement || 
                          document.getElementById('chain-events-container');
        
        if (!contentArea) {
            throw new Error('No se encontró contenedor para mostrar eventos');
        }
        
        // Determinar si estamos en un perfil o en inicio
        let profileUsername = '';
        
        const urlPath = window.location.pathname;
        
        // Solo buscar username si estamos en /perfil/
        if (urlPath.includes('/perfil/')) {
            const urlMatch = urlPath.match(/\/perfil\/([^\/]+)/);
            if (urlMatch) {
                profileUsername = urlMatch[1];
            } else {
                const profileUsernameEl = document.getElementById('profileUsername');
                if (profileUsernameEl) {
                    profileUsername = profileUsernameEl.textContent.replace('@', '');
                }
            }
        }
        // Si NO incluye /perfil/, dejar profileUsername vacío para feed de inicio
        
        console.log('Context:', urlPath.includes('/perfil/') ? 'Profile' : 'Feed Inicio');
        console.log('Username:', profileUsername || 'FEED INICIO (todos los visibles)');
        
        const requestData = {
            username: profileUsername, // Vacío para inicio, con valor para perfil
            limit: chainPagination.limit,
            offset: chainPagination.offset
        };

        console.log('Request data:', requestData);

        const response = await fetch('/php/obtener_eventos_chain.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            // Si es 404, mostrar mensaje específico
            if (response.status === 404) {
                throw new Error('El archivo PHP obtener_eventos_chain.php no fue encontrado. Verifique que existe en /php/');
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Chain events response:', data);

        if (!data.success) {
            throw new Error(data.message || 'Error cargando eventos Chain');
        }

        if (append) {
            chainEventsData = [...chainEventsData, ...data.eventos];
            window.chainEventsData = chainEventsData;
            window.ChainSystem.events = chainEventsData;
        } else {
            chainEventsData = data.eventos || [];
            window.chainEventsData = chainEventsData;
            window.ChainSystem.events = chainEventsData;
        }
        
        // Actualizar paginación
        chainPagination.hasMore = data.pagination && data.pagination.has_more;
        
        // Actualizar contador en el tab
        updateChainTabCount((data.pagination && data.pagination.total) || 0);
        
        // Renderizar eventos en el contenedor correcto
        renderChainEvents(contentArea, append);
        
    } catch (error) {
        console.error('Error loading chain events:', error);
        const errorContainer = containerElement || 
                              document.getElementById('chain-events-container');
        showChainError(error.message, errorContainer);
    }
}

function updateChainTabCount(count) {
    const tabCount = document.getElementById('chainTabCount');
    if (tabCount) {
        tabCount.textContent = count;
    }
    
    // También actualizar otros posibles elementos de contador
    const chainCounters = document.querySelectorAll('[data-chain-count]');
    chainCounters.forEach(counter => {
        counter.textContent = count;
    });
}

function renderChainEvents(containerElement, append = false) {
    if (!containerElement) {
        console.error('No container element provided for rendering');
        return;
    }
    
    console.log(`Rendering ${chainEventsData.length} chain events in:`, containerElement);

    const visibleEvents = chainEventsData;
    
if (visibleEvents.length === 0) {
    containerElement.innerHTML = `
        <div class="empty-state" style="text-align: center; padding: 3rem;">
            <div class="empty-icon" style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
            <h3 style="margin-bottom: 0.5rem; color: var(--text, #fff);">No hay eventos Chain visibles</h3>
            <p style="color: var(--text-secondary, #666);">Los eventos Chain aparecerán aquí cuando se publiquen</p>
        </div>
    `;
    return;
}

    const eventsHTML = visibleEvents.map(evento => renderChainEventCard(evento)).join('');
    
    const gridHTML = `
        <div class="content-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            ${eventsHTML}
        </div>
        ${chainPagination.hasMore ? `
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn-secondary" onclick="loadMoreChainEvents()" style="
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    color: var(--primary, #6366f1);
                    padding: 0.8rem 1.5rem;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                ">
                    Cargar más eventos
                </button>
            </div>
        ` : ''}
    `;

    if (append) {
        const existingGrid = containerElement.querySelector('.content-grid');
        if (existingGrid) {
            existingGrid.innerHTML += eventsHTML;
            // Remover botón anterior y agregar nuevo si es necesario
            const oldLoadMore = containerElement.querySelector('[onclick="loadMoreChainEvents()"]')?.parentElement;
            if (oldLoadMore) oldLoadMore.remove();
            
            if (chainPagination.hasMore) {
                existingGrid.insertAdjacentHTML('afterend', `
                    <div style="text-align: center; margin-top: 2rem;">
                        <button class="btn-secondary" onclick="loadMoreChainEvents()" style="
                            background: rgba(99, 102, 241, 0.1);
                            border: 1px solid rgba(99, 102, 241, 0.3);
                            color: var(--primary, #6366f1);
                            padding: 0.8rem 1.5rem;
                            border-radius: 50px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            font-weight: 600;
                        ">
                            Cargar más eventos
                        </button>
                    </div>
                `);
            }
        } else {
            containerElement.innerHTML = gridHTML;
        }
    } else {
        containerElement.innerHTML = gridHTML;
    }
    
    console.log(`Successfully rendered ${chainEventsData.length} chain events`);
}

function renderChainEventCard(evento) {
    const isActive = evento.estado === 'active';
    const statusIcon = isActive ? '🟢' : '🔴';
    const statusText = isActive ? 'Activo' : 'Finalizado';
    
    // ✅ OBTENER USUARIO ACTUAL (simplificado)
    let currentUsername = window.CHAINFEED_CONFIG?.currentUser?.username;
    
    // ✅ COMPARACIÓN CORRECTA: La info está en evento.creador.username
    const isOwner = (
        currentUsername && evento.creador?.username && 
        String(evento.creador.username).toLowerCase().trim() === String(currentUsername).toLowerCase().trim()
    );
    
    console.log('🔍 Verificando propiedad:', {
        eventoId: evento.id,
        creadorUsername: evento.creador?.username,
        currentUsername: currentUsername,
        isOwner: isOwner
    });
    
    let eventContent = '';
    let eventIcon = '';
    
    // Contenido específico por tipo de evento
    switch (evento.tipo) {
        case 'poll':
            eventIcon = '📊';
            eventContent = renderPollContent(evento);
            break;
        case 'campaign':
            eventIcon = '🎯';
            eventContent = renderCampaignContent(evento);
            break;
        case 'audio':
            eventIcon = '🎵';
            eventContent = renderAudioContent(evento);
            break;
        default:
            eventIcon = '⚡';
            eventContent = '<p style="color: var(--text-secondary, #666);">Tipo de evento no reconocido</p>';
    }

    // ✅ GENERAR ID DEL EVENTO
    const eventId = `chain-${evento.id}`;
    
    // ✅ VERIFICAR SI ESTÁ PROMOCIONADO
// ✅ VERIFICAR SI ESTÁ PROMOCIONADO
const isPromoted = evento.is_promoted === true || evento.is_promoted === 1 || evento.is_promoted === "1";

// ✅ NUEVO: Generar badge de promoción
let promotionBadge = '';
if (isPromoted) {
    // Verificar si es copia intercalada (destacado)
    const isHighlighted = evento.is_highlighted_promotion === true;
    
    if (isHighlighted) {
        // Badge para versión DESTACADA (intercalada cada 4)
        promotionBadge = `
            <div class="promoted-badge-highlighted" style="
                top: 1rem;
                left: 1rem;
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: #000;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 700;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
                z-index: 10;
                animation: promotedPulse 2s ease-in-out infinite;
            ">
                ⭐ DESTACADO
            </div>
        `;
    } else {
        // Badge para versión NORMAL (posición cronológica)
        promotionBadge = `
            <div class="promoted-badge-normal" style="
background: linear-gradient(135deg, #1000ff00, #ffa50000);
    color: #7e7a89;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid rgb(255 255 255 / 8%);
    box-shadow: 0 1px 5px rgba(99, 102, 241, 0.3) !important;
    white-space: nowrap;
            ">
                📢 Promocionado
            </div>
        `;
    }
}    
// IMPORTANTE: La columna en la BD es "es_publico" (sin 'a')
const isExplicitlyPublic = (
    evento.es_publico === true || 
    evento.es_publico === 1 || 
    evento.es_publico === "1"
);

const isExplicitlyPrivate = (
    evento.es_publico === false || 
    evento.es_publico === 0 || 
    evento.es_publico === "0"
);

// Si no es ni público ni privado explícitamente (null/undefined), es público por defecto
const isPublic = isExplicitlyPrivate ? false : true;

console.log('🔍 Estado de privacidad:', {
    eventoId: evento.id,
    es_publico_raw: evento.es_publico,
    isExplicitlyPublic: isExplicitlyPublic,
    isExplicitlyPrivate: isExplicitlyPrivate,
    isPublic: isPublic
});
    // ============================================
    // GENERAR MENÚ COMPLETO CON POSICIONAMIENTO ABSOLUTO
    // ============================================
    let menuHTML = `
        <div class="chain-menu-container" style="position: absolute; top: 0.3rem; right: 1rem; z-index: 100;">
            <button class="chain-menu-btn" onclick="event.stopPropagation(); toggleChainMenu('${eventId}', this)" 
                    title="Más opciones"
                    style="
                        background: rgb(251 244 244 / 4%);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgb(117 116 217 / 30%);
                        color: rgb(171, 167, 235);
                        cursor: pointer;
                        padding: 0.5rem;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                        outline: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 30px;
                        height: 30px;
                    "
                    onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.transform='scale(1.1)'"
                    onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.transform='scale(1)'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="
    color: var(--text);
">
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                </svg>
            </button>
            
            <div class="chain-dropdown hidden" id="chainDropdown-${eventId}"
                 style="
                     position: absolute;
                     top: 45px;
                     right: 0;
                     background: rgba(26, 26, 36, 0.98);
                     backdrop-filter: blur(20px);
                     border: 1px solid rgba(255, 255, 255, 0.15);
                     border-radius: 12px;
                     padding: 0.5rem 0;
                     min-width: 220px;
                     box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                     z-index: 999999;
                     opacity: 0;
                     visibility: hidden;
                     transform: translateY(-10px) scale(0.95);
                     transition: all 0.3s ease;
                 ">
    `;
    
    if (isOwner) {
        // ============================================
        // MENÚ PARA CREADOR
        // ============================================
        console.log('📋 Generando menú PROPIETARIO para evento', evento.id);
        
        // OPCIÓN 1: PUBLICITAR / YA PUBLICITADO
        if (!isPromoted) {
            menuHTML += `
                <button class="chain-dropdown-item" onclick="event.stopPropagation(); promoteChainEvent('${eventId}')"
                        style="
                            display: flex;
                            align-items: center;
                            gap: 0.75rem;
                            padding: 0.75rem 1.25rem;
                            color: var(--text);
                            cursor: pointer;
                            border: none;
                            background: transparent;
                            width: 100%;
                            text-align: left;
                            font-size: 0.95rem;
                            font-family: inherit;
                            white-space: nowrap;
                            transition: all 0.3s ease;
                        "
                        onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'"
                        onmouseout="this.style.background='transparent'">
                    <span style="font-size: 1.1rem; width: 20px; text-align: center;">📢</span>
                    <span>Primocionar evento</span>
                </button>
            `;
        } else {
            menuHTML += `
                <div class="chain-dropdown-item disabled"
                     style="
                         display: flex;
                         align-items: center;
                         gap: 0.75rem;
                         padding: 0.75rem 1.25rem;
                         color: rgba(255, 255, 255, 0.5);
                         font-size: 0.95rem;
                         white-space: nowrap;
                         cursor: default;
                     ">
                    <span style="font-size: 1.1rem; width: 20px; text-align: center;">✅</span>
                    <span>Ya publicitado</span>
                </div>
            `;
        }
        
        // SEPARADOR
        menuHTML += `<div style="height: 1px; background: rgba(255, 255, 255, 0.1); margin: 0.5rem 0;"></div>`;
        
        // OPCIÓN 2: HACER PÚBLICO/PRIVADO
        menuHTML += `
            <button class="chain-dropdown-item" onclick="event.stopPropagation(); toggleChainPrivacy('${eventId}', ${isPublic})"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem 1.25rem;
                        color: var(--text);
                        cursor: pointer;
                        border: none;
                        background: transparent;
                        width: 100%;
                        text-align: left;
                        font-size: 0.95rem;
                        font-family: inherit;
                        white-space: nowrap;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'"
                    onmouseout="this.style.background='transparent'">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">${isPublic ? '🔒' : '🌍'}</span>
                <span>${isPublic ? 'Hacer privado' : 'Hacer público'}</span>
            </button>
        `;
        
        // SEPARADOR
        menuHTML += `<div style="height: 1px; background: rgba(255, 255, 255, 0.1); margin: 0.5rem 0;"></div>`;
        
        // OPCIÓN 3: ELIMINAR
        menuHTML += `
            <button class="chain-dropdown-item danger" onclick="event.stopPropagation(); deleteChainEvent('${eventId}')"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem 1.25rem;
                        color: var(--error, #ef4444);
                        cursor: pointer;
                        border: none;
                        background: transparent;
                        width: 100%;
                        text-align: left;
                        font-size: 0.95rem;
                        font-family: inherit;
                        white-space: nowrap;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.background='rgba(239, 68, 68, 0.1)'"
                    onmouseout="this.style.background='transparent'">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">🗑️</span>
                <span>Eliminar evento</span>
            </button>
        `;
        
    } else {
        // ============================================
        // MENÚ PARA NO CREADOR
        // ============================================
        console.log('📋 Generando menú NO PROPIETARIO para evento', evento.id);
        
        // OPCIÓN 1: OCULTAR
        menuHTML += `
            <button class="chain-dropdown-item" onclick="event.stopPropagation(); hideChainEvent('${eventId}')"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem 1.25rem;
                        color: var(--text);
                        cursor: pointer;
                        border: none;
                        background: transparent;
                        width: 100%;
                        text-align: left;
                        font-size: 0.95rem;
                        font-family: inherit;
                        white-space: nowrap;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'"
                    onmouseout="this.style.background='transparent'">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">👁️‍🗨️</span>
                <span>Ocultar evento</span>
            </button>
        `;
        
        // SEPARADOR
        menuHTML += `<div style="height: 1px; background: rgba(255, 255, 255, 0.1); margin: 0.5rem 0;"></div>`;
        
        // OPCIÓN 2: REPORTAR
        menuHTML += `
            <button class="chain-dropdown-item danger" onclick="event.stopPropagation(); reportChainEvent('${eventId}')"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem 1.25rem;
                        color: var(--error, #ef4444);
                        cursor: pointer;
                        border: none;
                        background: transparent;
                        width: 100%;
                        text-align: left;
                        font-size: 0.95rem;
                        font-family: inherit;
                        white-space: nowrap;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.background='rgba(239, 68, 68, 0.1)'"
                    onmouseout="this.style.background='transparent'">
                <span style="font-size: 1.1rem; width: 20px; text-align: center;">⚠️</span>
                <span>Reportar evento</span>
            </button>
        `;
    }
    
    // CERRAR DROPDOWN Y CONTENEDOR
    menuHTML += `
            </div>
        </div>
    `;

return `
    <div class="content-card chain-event-card" 
         data-event-id="${evento.id}" 
         data-tipo-evento="${evento.tipo}"
         data-response-type="${evento.response_type || ''}"
         style="
        background: linear-gradient(90deg, rgb(5, 3, 18), rgba(11, 13, 18, 0.3));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        overflow: visible;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        border: 1px solid #212a49;
    ">
        ${menuHTML}
        ${promotionBadge}  <!-- ✅ AGREGAR AQUÍ -->
        
        ${evento.media_url ? `
        <div class="card-media" 
     ${evento.media_silenciado ? 'data-silenciado="true"' : ''} 
     style="width: 100%; height: 200px; position: relative; overflow: hidden; cursor: pointer;     border-top-left-radius: 20px; border-top-right-radius: 20px;"
     onclick="event.stopPropagation(); 
              const viewer = window.profileMediaViewer || window.fullscreenViewer;
              if (viewer) {
                  if (window.profileMediaViewer) {
                      window.profileMediaViewer.currentPostData = {
                          postId: ${evento.id},
                          isChainEvent: true,
                          mediaType: '${evento.media_type}',
                          mediaUrl: '${evento.media_url}',
                          isSilenced: ${evento.media_silenciado || false},
                          username: '${evento.creador.username}',
                          displayName: '${escapeHtml(evento.creador.display_name || evento.creador.username)}',
                          avatarUrl: '${evento.creador.avatar_url || ''}',
                          content: '${escapeHtml(evento.descripcion)}',
                          timeAgo: '',
                          tokens: 0,
                          stats: { likes: 0, comments: 0, reposts: 0, shares: 0 },
                          isLiked: false,
                          isReposted: false,
                          element: this.closest('.chain-event-card'),
                          isForSale: false,
                          salePrice: 0,
                          isOwner: false
                      };
                      window.profileMediaViewer.open(this.querySelector('video, img'));
                  } else if (window.fullscreenViewer) {
                      window.fullscreenViewer.openViewer(this.closest('.chain-event-card'));
                  }
              }">
${evento.media_url && (evento.media_url.endsWith('.mp4') || evento.media_url.endsWith('.webm') || evento.media_url.endsWith('.mov') || evento.media_url.endsWith('.avi')) ? `
<video 
    class="card-video" 
    src="${evento.media_url}" 
    ${evento.media_silenciado ? 'muted' : ''} 
    style="width: 100%; height: 100%; object-fit: cover; pointer-events: none; opacity: 1; border-top-left-radius: 20px; border-top-right-radius: 20px;"
    onloadeddata="this.style.opacity = '1'"
    data-chain-video-managed="true"
    muted
    loop
    playsinline
></video>
        ${evento.media_silenciado ? '<span style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.7); color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">🔇</span>' : ''}
    ` : evento.media_type === 'image' || (evento.media_url && (evento.media_url.endsWith('.jpg') || evento.media_url.endsWith('.jpeg') || evento.media_url.endsWith('.png') || evento.media_url.endsWith('.gif') || evento.media_url.endsWith('.webp'))) ? `
        <img 
            src="${evento.media_url}" 
            alt="${escapeHtml(evento.titulo)}"
            style="width: 100%; height: 100%; object-fit: cover;"
            onload="this.style.opacity = '1'"
        />
    ` : ''}
</div>
` : ''}
            
<div class="card-content" style="padding: 1.5rem;">
<div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">

<div class="post-avatar-wrapper chain-avatar-wrapper" 
     data-chain-user="${evento.creador.username}"
     style="cursor: pointer;"
     title="Ver eventos Chain de @${evento.creador.username}">
    <div class="post-avatar ${evento.creador.flash_info?.flash_status || 'no-flash'}" 
         data-flash-info='${JSON.stringify(evento.creador.flash_info || {})}' 
         data-username="${evento.creador.username}"
         style="transition: all 0.3s ease;"
         onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 0 15px rgba(99, 102, 241, 0.3)'" 
         onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
        ${evento.creador.avatar_url ? 
            `<img src="${evento.creador.avatar_url}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" loading="lazy" onerror="this.style.display='none'; this.parentElement.textContent='${generateAvatarInitials(evento.creador.username)}';"/>` 
            : generateAvatarInitials(evento.creador.username)
        }
    </div>
</div>
        <div style="flex: 1;">
            <div style="font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                <span style="cursor: pointer;" onclick="goToUserProfile('${evento.creador.username}')">
                    ${escapeHtml(evento.creador.display_name || evento.creador.username)}
                </span>
                ${evento.creador.verified ? '<span style="color: var(--primary, #6366f1);">✓</span>' : ''}
            </div>
            <div style="color: var(--text-secondary, #a0a0b8); font-size: 0.9rem;">
                <span style="cursor: pointer;" onclick="goToUserProfile('${evento.creador.username}')">
                    @${evento.creador.username}
                </span>
            </div>
        </div>
    </div>
    
    <div class="chain-event-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span class="event-type-badge" style="
            background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #ec4899));
            color: white;
            padding: 0.3rem 0.4rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        ">${eventIcon} ${capitalize(evento.tipo)}</span>
        <span class="event-status ${evento.estado}" style="
            font-size: 0.85rem;
            font-weight: 600;
            color: ${isActive ? 'var(--success, #10b981)' : 'var(--error, #ef4444)'};
        ">${statusIcon} ${statusText}</span>
    </div>
    
    <h3 class="chain-event-title" style="
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, var(--text), var(--primary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">${escapeHtml(evento.titulo)}</h3>
                <p class="chain-event-description" style="
                    color: var(--text-secondary, #a0a0b8);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                    font-size: 0.95rem;
                ">${escapeHtml(evento.descripcion)}</p>
                
                ${eventContent}
                
<div class="chain-event-stats" style="
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 1.5rem;
">
<span class="stat participants-link" 
      style="color: var(--text-secondary, #a0a0b8); font-size: 0.9rem; cursor: pointer;" 
      onclick="viewEventSubmissions(${evento.id})"  // ✅ BIEN - Sin prefijo, sin comillas
      data-event-id="${evento.id}">
    👥 ${evento.participantes} participantes
</span>
    <span class="stat" style="color: var(--text-secondary, #a0a0b8); font-size: 0.9rem;">
        ⏰ ${isActive ? `${evento.dias_restantes} días restantes` : 'Finalizado'}
    </span>
   <span class="stat share-event-btn" 
      style="
          color: var(--text-secondary, #a0a0b8);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
      "
      onclick="event.stopPropagation(); window.shareChainEvent(this, ${evento.id})"
      onmouseover="this.style.background='rgba(99, 102, 241, 0.1)'; this.style.color='var(--primary)'"
      onmouseout="this.style.background='transparent'; this.style.color='var(--text-secondary)'">
    📤 Compartir
</span>
</div>
            </div>
        </div>
    `;
}

// ============================================
// FUNCIONES DE CONTENIDO ESPECÍFICO
// ============================================

function renderPollContent(evento) {
    if (!evento.poll_options || evento.poll_options.length === 0) {
        return '<p style="color: var(--text-secondary, #666);">Encuesta sin opciones</p>';
    }

    const hasVoted = evento.user_participated;
    const canVote = evento.estado === 'active' && !hasVoted;
    const maxParticipants = evento.poll_max_participants || 0;
    const isMaxReached = maxParticipants > 0 && evento.participantes >= maxParticipants;

    let optionsHTML = '';
    
    evento.poll_options.forEach((opcion, index) => {
        const isUserChoice = evento.user_vote_option === index;
        const percentage = opcion.porcentaje || 0;
        
        optionsHTML += `
            <div class="poll-option ${hasVoted ? 'voted' : ''} ${isUserChoice ? 'user-choice' : ''}" 
                 onclick="${canVote && !isMaxReached ? `voteInPoll(${evento.id}, ${index})` : ''}"
                 style="
                    position: relative;
                    background: ${hasVoted ? 'rgba(37, 37, 50, 0.5)' : 'rgba(99, 102, 241, 0.1)'};
                    border: 1px solid ${isUserChoice ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 0.8rem;
                    cursor: ${canVote && !isMaxReached ? 'pointer' : 'default'};
                    transition: all 0.3s ease;
                    overflow: hidden;
                 ">
                 
                ${hasVoted ? `
                    <div class="poll-progress" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        width: ${percentage}%;
                        background: linear-gradient(90deg, 
                            ${isUserChoice ? 'var(--primary), var(--accent)' : 'rgba(99, 102, 241, 0.3)'});
                        transition: width 0.5s ease;
                        z-index: 1;
                        opacity: 0.3;
                    "></div>
                ` : ''}
                
                <div style="position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--text); font-weight: ${isUserChoice ? '600' : '400'};">
                        ${isUserChoice ? '✓ ' : ''}${escapeHtml(opcion.texto)}
                    </span>
                    ${hasVoted ? `
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">
                                ${opcion.votos} votos
                            </span>
                            <span style="color: var(--text-secondary); font-weight: 600; font-size: 0.9rem;">
                                ${percentage}%
                            </span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });

    const rewardInfo = evento.poll_reward_per_vote > 0 ? `
        <div class="poll-reward" style="
            background: linear-gradient(135deg, rgb(51 32 153 / 10%), rgba(99, 102, 241, 0.1));
            border: 1px solid rgb(72 86 236 / 30%);
            border-radius: 20px;
            padding: 0.2rem;
            margin-bottom: 1rem;
            text-align: center;
        ">
            <span style="color: rgb(216, 210, 237); font-weight: 600;">
                💎 ${evento.poll_reward_per_vote} tokens por voto
            </span>
        </div>
    ` : '';

    const statusInfo = `
        <div class="poll-status" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 0.8rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 20px;
            margin-top: 1rem;
            font-size: 0.85rem;
            color: #c3c3f7;
        ">
            <span>📊 ${evento.total_votos || 0} votos totales</span>
            ${maxParticipants > 0 ? `<span>👥 ${evento.participantes}/${maxParticipants}</span>` : ''}
            <span>${hasVoted ? '✅ Ya votaste' : canVote ? '🗳️ Puedes votar' : '🔒 Votación cerrada'}</span>
        </div>
    `;

    return `
        <div class="poll-content">
            ${rewardInfo}
            ${optionsHTML}
            ${statusInfo}
            ${isMaxReached && !hasVoted ? `
                <div style="text-align: center; color: var(--warning, #f59e0b); font-size: 0.9rem; margin-top: 0.5rem;">
                    ⚠️ Máximo de participantes alcanzado
                </div>
            ` : ''}
        </div>
    `;
}

function renderCampaignContent(evento) {
    const rewardPerWinner = evento.reward_per_winner || 0;
    const hasParticipated = evento.user_participated;
    const canParticipate = evento.estado === 'active' && !hasParticipated;

    return `
        <div class="campaign-content">
            <div class="campaign-info" style="
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 20px;
                padding: 1.5rem;
                margin-bottom: 1rem;
            ">
                <div style="display: flex; gap: 1rem;margin-bottom: 1rem;justify-content: space-around;">
                    <div style="text-align: center;">
                        <div style="color: var(--primary, #6366f1); font-size: 1.5rem; font-weight: 700;">
                            💎 ${evento.reward_total || 0}
                        </div>
                        <div style="color: var(--text-secondary, #a0a0b8); font-size: 0.85rem;">
                            Tokens totales
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: var(--primary, #6366f1); font-size:1.5rem; font-weight: 700;">
                            🏆 ${evento.winners_count || 0}
                        </div>
                        <div style="color: var(--text-secondary, #a0a0b8); font-size: 0.85rem;">
                            Ganadores
                        </div>
                    </div>
                    ${rewardPerWinner > 0 ? `
                        <div style="text-align: center;">
                            <div style="color: var(--primary, #6366f1); font-size: 1.5rem; font-weight: 700;">
                                💰 ${rewardPerWinner}
                            </div>
                            <div style="color: var(--text-secondary, #a0a0b8); font-size: 0.85rem;">
                                Por ganador
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                ${evento.response_type ? `
                    <div style="text-align: center; padding: 0.8rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                        <span style="color: rgba(231, 229, 245, 1); font-weight: 600;">
                            📝 Tipo de respuesta: ${capitalize(evento.response_type)}
                        </span>
                    </div>
                ` : ''}
            </div>

            <div class="campaign-actions" style="text-align: center;">
                ${canParticipate ? `
                    <button onclick="participateInCampaign(${evento.id})" style="
                        background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #ec4899));
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 50px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                    ">
                        🚀 Participar en campaña
                    </button>
                ` : hasParticipated ? `
                    <div style="
                        background: rgba(156, 163, 175, 0.1);
                        border: 1px solid rgb(70 102 211 / 30%);
                        color: 	rgb(186, 182, 233);
                        padding: 1rem 2rem;
                        border-radius: 50px;
                        font-weight: 600;
                        display: inline-block;
                    ">
                        ✅ Ya participas en esta campaña
                    </div>
                ` : `
                    <div style="
                        background: rgba(156, 163, 175, 0.1);
                        border: 1px solid rgb(70 102 211 / 30%);
                        color: rgb(186, 182, 233);
                        padding: 1rem 2rem;
                        border-radius: 50px;
                        font-weight: 600;
                        display: inline-block;
                    ">
                        🔒 Campaña finalizada
                    </div>
                `}
            </div>
        </div>
    `;
}

function renderAudioContent(evento) {
    const hasParticipated = evento.user_participated;
    const canParticipate = evento.estado === 'active' && !hasParticipated;
    const rewardPerWinner = evento.reward_per_winner || 0;

    return `
        <div class="audio-content">
            ${evento.audio_url ? `
                <div class="audio-player" style="
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                ">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="
                            width: 60px;
                            height: 60px;
                            background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #ec4899));
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 1.5rem;
                        ">🎵</div>
                        <div style="flex: 1;">
                            <div style="color: var(--text, #fff); font-weight: 600; margin-bottom: 0.25rem;">
                                Audio Chain Event
                            </div>
                            <div style="color: var(--text-secondary, #a0a0b8); font-size: 0.9rem;">
                                ${evento.audio_duration ? `Duración: ${formatAudioDuration(evento.audio_duration)}` : 'Audio disponible'}
                            </div>
                        </div>
                    </div>
                    
                    <audio controls style="width: 100%; height: 40px;" preload="metadata">
                        <source src="${evento.audio_url}" type="audio/mpeg">
                        <source src="${evento.audio_url}" type="audio/wav">
                        <source src="${evento.audio_url}" type="audio/ogg">
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            ` : ''}
            
            ${evento.image_url ? `
                <div class="audio-image" style="
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                ">
                    <img src="${evento.image_url}" alt="Audio Event Image" style="
                        width: 100%;
                        height: 200px;
                        object-fit: cover;
                    ">
                </div>
            ` : ''}

            <div class="audio-challenge-info" style="
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 1rem;
            ">
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem; justify-content: space-around;">
                    <div style="text-align: center;">
                        <div style="color: var(--primary, #6366f1); font-size: 1.5rem; font-weight: 700;">
                            💎 ${evento.reward_total || 0}
                        </div>
                        <div style="color: var(--text-secondary, #a0a0b8); font-size: 0.85rem;">
                            Tokens totales
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: var(--accent, #ec4899); font-size: 1.5rem; font-weight: 700;">
                            🏆 ${evento.winners_count || 0}
                        </div>
                        <div style="color: var(--text-secondary, #a0a0b8); font-size: 0.85rem;">
                            Ganadores
                        </div>
                    </div>
                    ${rewardPerWinner > 0 ? `
                        <div style="text-align: center;">
                            <div style="color: var(--success, #10b981); font-size: 1.5rem; font-weight: 700;">
                                💰 ${rewardPerWinner}
                            </div>
                            <div style="color: var(--text-secondary, #a0a0b8); font-size: 0.85rem;">
                                Por ganador
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                ${evento.response_type ? `
                    <div style="text-align: center; padding: 0.8rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                        <span style="color: rgba(231, 229, 245, 1); font-weight: 600;">
                            📝 Respuesta requerida: ${capitalize(evento.response_type)}
                        </span>
                    </div>
                ` : ''}
            </div>

            <div class="audio-actions" style="text-align: center;">
                ${canParticipate ? `
                    <button onclick="participateInAudioEvent(${evento.id})" style="
                        background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #ec4899));
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 50px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                    ">
                        🎤 Participar en evento de audio
                    </button>
                ` : hasParticipated ? `
                    <div style="
                        background: rgb(74 93 187 / 10%);
                        border: 1px solid rgb(70 102 211 / 30%);
                        color: rgb(186, 182, 233);
                        padding: 1rem 2rem;
                        border-radius: 50px;
                        font-weight: 600;
                        display: inline-block;
                    ">
                        ✅ Ya participas en este evento
                    </div>
                ` : `
                    <div style="
                        background: rgba(156, 163, 175, 0.1);
                        border: 1px solid rgba(156, 163, 175, 0.3);
                        color: var(--text-secondary, #a0a0b8);
                        padding: 1rem 2rem;
                        border-radius: 50px;
                        font-weight: 600;
                        display: inline-block;
                    ">
                        🔒 Evento finalizado
                    </div>
                `}
            </div>
        </div>
    `;
}

// ============================================
// FUNCIONES DE INTERACCIÓN
// ============================================

async function voteInPoll(eventoId, opcionIndex) {
    try {
        console.log(`Voting in poll ${eventoId}, option ${opcionIndex}`);
        
        // USAR TU ARCHIVO EXISTENTE QUE YA FUNCIONA
        const response = await fetch('/php/votar_encuesta.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                evento_id: eventoId,
                opcion_index: opcionIndex
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // Mostrar tokens ganados si aplica
            const mensaje = data.voto && data.voto.tokens_ganados > 0 
                ? `¡Voto registrado! Ganaste ${data.voto.tokens_ganados} tokens.`
                : '¡Voto registrado correctamente!';
            
            showNotification(mensaje, 'success');
            await refreshSingleChainEvent(eventoId);
        } else {
            throw new Error(data.message || 'Error al votar');
        }
    } catch (error) {
        console.error('Error voting in poll:', error);
        showNotification('Error al registrar el voto: ' + error.message, 'error');
    }
}

async function participateInCampaign(eventoId) {
    console.log(`Opening participation modal for campaign ${eventoId}`);
    
    // Buscar el evento en los datos cargados
    const evento = chainEventsData.find(e => e.id === eventoId);
    
    if (!evento) {
        showNotification('Error: Evento no encontrado', 'error');
        return;
    }
    
    // Verificar si ya participó
    if (evento.user_participated) {
        showNotification('Ya has participado en esta campaña', 'error');
        return;
    }
    
    // Abrir el modal de participación usando el sistema existente
    if (typeof participateInCampaign !== 'undefined' && window.ParticipationSystem) {
        // Usar el sistema de participación existente
        participateInCampaign(eventoId);
    } else {
        // Fallback: abrir modal manualmente
        openParticipationModal(evento);
    }
}

async function participateInAudioEvent(eventoId) {
    console.log(`Opening participation modal for audio event ${eventoId}`);
    
    // Buscar el evento en los datos cargados
    const evento = chainEventsData.find(e => e.id === eventoId);
    
    if (!evento) {
        showNotification('Error: Evento no encontrado', 'error');
        return;
    }
    
    // Verificar si ya participó
    if (evento.user_participated) {
        showNotification('Ya has participado en este evento de audio', 'error');
        return;
    }
    
    // Abrir el modal de participación usando el sistema existente
    if (typeof participateInCampaign !== 'undefined' && window.ParticipationSystem) {
        // Usar el sistema de participación existente
        participateInCampaign(eventoId);
    } else {
        // Fallback: abrir modal manualmente
        openParticipationModal(evento);
    }
}

// Función fallback para abrir el modal si el sistema principal no está disponible
function openParticipationModal(evento) {
    const modal = document.getElementById('participateModal');
    if (!modal) {
        showNotification('Error: Modal de participación no encontrado', 'error');
        return;
    }
    
    // Configurar título según tipo de evento
    const titleElement = document.getElementById('participateTitle');
    if (evento.tipo === 'audio') {
        titleElement.textContent = `🎵 ${evento.titulo}`;
    } else {
        titleElement.textContent = `🎯 ${evento.titulo}`;
    }
    
    // Configurar información del evento
    const rewardPerWinner = evento.reward_per_winner || 0;
    const eventInfoElement = document.getElementById('participateEventInfo');
    eventInfoElement.innerHTML = `
        <div class="event-summary">
            <strong>💎 Recompensa:</strong> ${rewardPerWinner} CFT por ganador<br>
            <strong>🏆 Ganadores:</strong> ${evento.winners_count} usuarios<br>
            <strong>👥 Participantes actuales:</strong> ${evento.participantes}/${evento.winners_count * 2}<br>
            <strong>📄 Tipo de respuesta:</strong> ${getResponseTypeName(evento.response_type)}
        </div>
    `;
    
    // Configurar instrucciones
    const instructionsElement = document.getElementById('participateInstructions');
    instructionsElement.innerHTML = getParticipationInstructions(evento.response_type);
    
    // Configurar secciones de input
    setupParticipationInputBasic(evento.response_type);
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Guardar evento actual para uso posterior
    window.currentParticipationEvent = evento;
}

function setupParticipationInputBasic(responseType) {
    // Ocultar todas las secciones
    const textSection = document.getElementById('textInputSection');
    const mediaSection = document.getElementById('mediaInputSection');
    
    if (textSection) textSection.classList.add('hidden');
    if (mediaSection) mediaSection.classList.add('hidden');
    
    if (responseType === 'text') {
        if (textSection) textSection.classList.remove('hidden');
    } else {
        if (mediaSection) mediaSection.classList.remove('hidden');
        
        // Configurar botón según tipo
        const mediaBtn = document.getElementById('participateMediaBtn');
        const mediaIcon = document.getElementById('participateMediaIcon');
        const mediaText = document.getElementById('participateMediaText');
        
        if (mediaBtn && mediaIcon && mediaText) {
            if (responseType === 'audio') {
                mediaIcon.textContent = '🎵';
                mediaText.textContent = 'Seleccionar/Grabar Audio';
            } else if (responseType === 'image') {
                mediaIcon.textContent = '📷';
                mediaText.textContent = 'Seleccionar Imagen';
            } else if (responseType === 'video') {
                mediaIcon.textContent = '🎥';
                mediaText.textContent = 'Seleccionar Video';
            }
        }
    }
}

function getParticipationInstructions(responseType) {
    switch (responseType) {
        case 'text':
            return '📝 <strong>Instrucciones:</strong> Escribe tu participación en el campo de texto. Sé creativo y original.';
        case 'image':
            return '📷 <strong>Instrucciones:</strong> Sube una imagen relacionada con el evento. Formatos admitidos: JPG, PNG, GIF, WebP.';
        case 'video':
            return '🎥 <strong>Instrucciones:</strong> Sube un video relacionado con el evento. <span style="color: var(--error); font-weight: bold;">Máximo 7 segundos.</span> Formatos: MP4, WebM, MOV.';
        case 'audio':
            return '🎵 <strong>Instrucciones:</strong> Graba o sube un audio de respuesta. <span style="color: var(--error); font-weight: bold;">Máximo 15 segundos.</span> Formatos: MP3, WAV, WebM, M4A.';
        default:
            return '📄 <strong>Instrucciones:</strong> Completa tu participación según las indicaciones del evento.';
    }
}

function getResponseTypeName(type) {
    switch(type) {
        case 'image': return 'Imagen';
        case 'video': return 'Video';  
        case 'text': return 'Texto';
        case 'audio': return 'Audio (15s)';
        default: return 'Archivo';
    }
}

// ============================================
// FUNCIONES DE MANEJO DE ARCHIVOS PARA PARTICIPACIÓN
// ============================================

function selectParticipationMedia() {
    const evento = window.currentParticipationEvent;
    if (!evento) {
        console.error('No hay evento actual para participación');
        return;
    }
    
    console.log('Seleccionando media para participación, tipo:', evento.response_type);
    
    if (evento.response_type === 'audio') {
        // Para audio, mostrar opciones de grabar o subir
        showAudioParticipationOptions();
    } else {
        // Para imagen/video, abrir selector de archivos directamente
        openFileSelector(evento.response_type);
    }
}

function openFileSelector(fileType) {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    
    // Configurar tipos de archivo según el tipo
    if (fileType === 'image') {
        input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
    } else if (fileType === 'video') {
        input.accept = 'video/mp4,video/webm,video/ogg,video/avi,video/mov';
    } else if (fileType === 'audio') {
        input.accept = 'audio/mp3,audio/wav,audio/webm,audio/m4a,audio/ogg';
    }
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            handleParticipationFile(file, fileType);
        }
        // Limpiar el input
        document.body.removeChild(input);
    };
    
    document.body.appendChild(input);
    input.click();
}

function uploadAudioFile() {
    openFileSelector('audio');
}

function handleParticipationFile(file, fileType) {
    console.log('Archivo seleccionado:', file.name, 'Tipo:', fileType);
    
    // Validaciones básicas
    const maxSize = fileType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB video, 10MB otros
    
    if (file.size > maxSize) {
        showNotification(`Archivo muy grande. Máximo ${maxSize / (1024 * 1024)}MB`, 'error');
        return;
    }
    
    // Crear preview del archivo
    const reader = new FileReader();
    reader.onload = function(e) {
        showFilePreview(file, fileType, e.target.result);
        window.selectedParticipationFile = file;
        window.selectedParticipationData = e.target.result;
    };
    reader.readAsDataURL(file);
}

function showFilePreview(file, fileType, dataUrl) {
    const container = document.getElementById('participatePreviewContainer');
    if (!container) return;
    
    let previewHTML = '';
    
    if (fileType === 'image') {
        previewHTML = `
            <div class="participation-file-preview">
                <div class="preview-header">
                    <span>📷 ${file.name}</span>
                    <button onclick="removeParticipationFile()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--error); border-radius: 50%; width: 28px; height: 28px; cursor: pointer;">×</button>
                </div>
                <div class="preview-content" style="text-align: center; padding: 1rem;">
                    <img src="${dataUrl}" style="max-width: 100%; max-height: 200px; border-radius: 8px;" alt="Preview">
                </div>
                <div class="preview-info" style="padding: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                    Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
            </div>
        `;
    } else if (fileType === 'video') {
        previewHTML = `
            <div class="participation-file-preview">
                <div class="preview-header">
                    <span>🎥 ${file.name}</span>
                    <button onclick="removeParticipationFile()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--error); border-radius: 50%; width: 28px; height: 28px; cursor: pointer;">×</button>
                </div>
                <div class="preview-content" style="text-align: center; padding: 1rem;">
                    <video src="${dataUrl}" controls style="max-width: 100%; max-height: 200px; border-radius: 8px;"></video>
                </div>
                <div class="preview-info" style="padding: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                    Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
            </div>
        `;
    } else if (fileType === 'audio') {
        previewHTML = `
            <div class="participation-file-preview">
                <div class="preview-header">
                    <span>🎵 ${file.name}</span>
                    <button onclick="removeParticipationFile()" style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--error); border-radius: 50%; width: 28px; height: 28px; cursor: pointer;">×</button>
                </div>
                <div class="preview-content" style="text-align: center; padding: 1rem;">
                    <audio controls style="width: 100%;" preload="metadata">
                        <source src="${dataUrl}" type="${file.type}">
                        Tu navegador no soporta la reproducción de audio.
                    </audio>
                </div>
                <div class="preview-info" style="padding: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                    Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
            </div>
        `;
    }
    
    container.innerHTML = previewHTML;
    showNotification(`${file.name} seleccionado correctamente`, 'success');
}

async function refreshSingleChainEvent(eventoId) {
    try {
        // Buscar la tarjeta del evento
        const eventCard = document.querySelector(`[data-event-id="${eventoId}"]`);
        if (!eventCard) return;

        // Mostrar loading en la tarjeta
        const originalContent = eventCard.innerHTML;
        eventCard.style.opacity = '0.7';
        eventCard.style.pointerEvents = 'none';

        // Recargar eventos (esto actualizará toda la lista)
        const container = document.getElementById('chain-events-container');
        await loadChainEvents(container, false);
        
    } catch (error) {
        console.error('Error refreshing event:', error);
    }
}

// ============================================
// FUNCIONES DE GRABACIÓN DE AUDIO (CORREGIDAS)
// ============================================

let isRecordingAudio = false;
let audioRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let recordingTimer = null;
let recordedDuration = 0; // Nueva variable para guardar la duración real

// NUEVA FUNCIÓN: Limpiar completamente el estado de grabación
function resetAudioRecordingState() {
    console.log('Resetting audio recording state...');
    
    // Detener grabación si está activa
    if (isRecordingAudio && audioRecorder && audioRecorder.state === 'recording') {
        audioRecorder.stop();
    }
    
    // Limpiar timer
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
    
    // Detener streams activos
    if (audioRecorder && audioRecorder.stream) {
        audioRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    // Resetear todas las variables
    isRecordingAudio = false;
    audioRecorder = null;
    audioChunks = [];
    recordingStartTime = null;
    recordedDuration = 0;
    
    // Resetear UI
    updateRecordingUI(false);
    
    console.log('Audio recording state reset complete');
}

// NUEVA FUNCIÓN: Llamar antes de mostrar opciones de audio
function showAudioParticipationOptions() {
    const mediaButtons = document.querySelector('.participate-media-buttons');
    if (!mediaButtons) return;
    
    // IMPORTANTE: Limpiar estado antes de mostrar opciones
    resetAudioRecordingState();
    
    // Reemplazar el botón único con opciones de audio
    mediaButtons.innerHTML = `
        <div class="audio-participation-controls">
            <button type="button" class="participate-audio-btn record-btn" onclick="startAudioRecording()">
                🎤 Grabar Audio (15s)
            </button>
            <button type="button" class="participate-audio-btn upload-btn" onclick="uploadAudioFile()">
                📁 Subir Audio
            </button>
        </div>
        
        <!-- Recording status -->
        <div class="participation-recording-status hidden" id="participationRecordingStatus">
            <div class="recording-indicator">
                <div class="recording-dot"></div>
                <span id="participationRecordingTime">00:00</span>
            </div>
            <button type="button" class="stop-recording-btn" onclick="stopAudioRecording()">
                ⏹️ Detener
            </button>
        </div>
    `;
}

async function startAudioRecording() {
    try {
        console.log('Starting audio recording...');
        
        // IMPORTANTE: Limpiar estado antes de empezar
        resetAudioRecordingState();
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Tu navegador no soporta grabación de audio');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
        audioRecorder = new MediaRecorder(stream, { mimeType });
        
        // Guardar referencia al stream para poder cerrarlo
        audioRecorder.stream = stream;
        
        // Reinicializar arrays y tiempo
        audioChunks = [];
        recordingStartTime = Date.now();
        recordedDuration = 0;
        
        audioRecorder.ondataavailable = (event) => {
            console.log('Audio data available, size:', event.data.size);
            if (event.data && event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        audioRecorder.onstop = () => {
            console.log('Audio recorder stopped');
            processRecording();
            // Cerrar stream después de procesar
            stream.getTracks().forEach(track => track.stop());
        };
        
        audioRecorder.onerror = (event) => {
            console.error('Audio recorder error:', event.error);
            resetAudioRecordingState();
            showNotification('Error en la grabación: ' + event.error, 'error');
        };
        
        audioRecorder.start(100); // Recopilar datos cada 100ms
        isRecordingAudio = true;
        
        updateRecordingUI(true);
        startRecordingTimer();
        
        // Auto-detener después de 15 segundos
        setTimeout(() => {
            if (isRecordingAudio && audioRecorder && audioRecorder.state === 'recording') {
                console.log('Auto-stopping recording at 15 seconds');
                stopAudioRecording();
                showNotification('Grabación detenida (máximo 15 segundos)', 'info');
            }
        }, 15000);
        
        showNotification('Grabando audio...', 'info');
        
    } catch (error) {
        console.error('Error iniciando grabación:', error);
        resetAudioRecordingState();
        
        if (error.name === 'NotAllowedError') {
            showNotification('Necesitas permitir el acceso al micrófono', 'error');
        } else {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

function stopAudioRecording() {
    console.log('Stopping audio recording, current state:', {
        isRecording: isRecordingAudio,
        recorderState: audioRecorder ? audioRecorder.state : 'null',
        chunksLength: audioChunks.length
    });
    
    if (!isRecordingAudio || !audioRecorder) {
        console.log('Not recording or no recorder available');
        return;
    }
    
    // Calcular duración antes de detener
    if (recordingStartTime) {
        recordedDuration = (Date.now() - recordingStartTime) / 1000;
        console.log('Calculated duration:', recordedDuration, 'seconds');
    }
    
    if (audioRecorder.state === 'recording') {
        audioRecorder.stop();
    }
    
    isRecordingAudio = false;
    
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
    
    updateRecordingUI(false);
    showNotification('Procesando grabación...', 'info');
}

function processRecording() {
    try {
        console.log('Processing recording, chunks:', audioChunks.length, 'duration:', recordedDuration);
        
        if (audioChunks.length === 0) {
            showNotification('No se pudo procesar la grabación', 'error');
            resetAudioRecordingState();
            return;
        }
        
        // Usar la duración calculada previamente en lugar de recalcular
        const duration = recordedDuration;
        
        if (duration < 1) {
            showNotification('La grabación es muy corta (mínimo 1 segundo)', 'error');
            resetAudioRecordingState();
            return;
        }
        
        if (duration > 15) {
            showNotification('La grabación es muy larga (máximo 15 segundos)', 'error');
            resetAudioRecordingState();
            return;
        }
        
        const mimeType = audioRecorder.mimeType;
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        
        console.log('Created audio blob, size:', audioBlob.size, 'type:', mimeType);
        
        // Crear archivo temporal con timestamp único
        const timestamp = Date.now();
        const extension = mimeType.split('/')[1].split(';')[0]; // Obtener solo la extensión
        const fileName = `audio_grabado_${timestamp}.${extension}`;
        const file = new File([audioBlob], fileName, { type: mimeType });
        
        console.log('Created file:', fileName, 'size:', file.size);
        
        // Crear data URL para preview
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('File read successfully for preview');
            showFilePreview(file, 'audio', e.target.result);
            
            // IMPORTANTE: Guardar el archivo en las variables globales
            window.selectedParticipationFile = file;
            window.selectedParticipationData = e.target.result;
            
            console.log('Audio file saved to global variables:', {
                fileName: file.name,
                size: file.size,
                type: file.type
            });
        };
        
        reader.onerror = function(e) {
            console.error('Error reading file for preview:', e);
            showNotification('Error procesando el audio para preview', 'error');
            resetAudioRecordingState();
        };
        
        reader.readAsDataURL(audioBlob);
        
        showNotification(`Audio grabado (${Math.round(duration)}s)`, 'success');
        
        // NO limpiar audioChunks aquí, dejar que se limpie en reset
        
    } catch (error) {
        console.error('Error procesando grabación:', error);
        showNotification('Error procesando la grabación: ' + error.message, 'error');
        resetAudioRecordingState();
    }
}

function updateRecordingUI(isRecording) {
    const recordBtn = document.querySelector('.participate-audio-btn.record-btn');
    const uploadBtn = document.querySelector('.participate-audio-btn.upload-btn');
    const recordingStatus = document.getElementById('participationRecordingStatus');
    
    if (isRecording) {
        if (recordBtn) {
            recordBtn.classList.add('recording');
            recordBtn.textContent = '⏸️ Grabando...';
            recordBtn.disabled = true; // Deshabilitar mientras graba
        }
        if (uploadBtn) uploadBtn.disabled = true;
        if (recordingStatus) recordingStatus.classList.remove('hidden');
    } else {
        if (recordBtn) {
            recordBtn.classList.remove('recording');
            recordBtn.textContent = '🎤 Grabar Audio (15s)';
            recordBtn.disabled = false;
        }
        if (uploadBtn) uploadBtn.disabled = false;
        if (recordingStatus) recordingStatus.classList.add('hidden');
    }
}

function startRecordingTimer() {
    const timeElement = document.getElementById('participationRecordingTime');
    
    recordingTimer = setInterval(() => {
        if (!isRecordingAudio || !recordingStartTime) {
            clearInterval(recordingTimer);
            recordingTimer = null;
            return;
        }
        
        const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        if (timeElement) {
            timeElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// ============================================
// FUNCIÓN MEJORADA PARA CERRAR EL MODAL
// ============================================

function closeParticipateModal() {
    const modal = document.getElementById('participateModal');
    if (!modal) return;
    
    console.log('Closing participate modal...');
    
    // IMPORTANTE: Limpiar estado de grabación al cerrar
    resetAudioRecordingState();
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpiar datos
    setTimeout(() => {
        window.currentParticipationEvent = null;
        removeParticipationFile();
        
        // Limpiar inputs
        const textInput = document.getElementById('participateTextInput');
        if (textInput) textInput.value = '';
        
        // Resetear botones de media completamente
        const mediaButtons = document.querySelector('.participate-media-buttons');
        if (mediaButtons && window.currentParticipationEvent) {
            const evento = window.currentParticipationEvent;
            if (evento.response_type !== 'audio') {
                const mediaIcon = evento.response_type === 'image' ? '📷' : '🎥';
                const mediaText = evento.response_type === 'image' ? 'Seleccionar Imagen' : 'Seleccionar Video';
                
                mediaButtons.innerHTML = `
                    <button class="participate-media-btn" id="participateMediaBtn" onclick="selectParticipationMedia()">
                        <span id="participateMediaIcon">${mediaIcon}</span>
                        <span id="participateMediaText">${mediaText}</span>
                    </button>
                `;
            }
        }
    }, 300);
}

// ============================================
// FUNCIÓN MEJORADA PARA MANEJAR ARCHIVOS
// ============================================

function removeParticipationFile() {
    console.log('Removing participation file...');
    
    const container = document.getElementById('participatePreviewContainer');
    if (container) {
        container.innerHTML = '';
    }
    
    // Limpiar variables globales
    window.selectedParticipationFile = null;
    window.selectedParticipationData = null;
    
    // Si era un archivo de audio grabado, limpiar también el estado de grabación
    resetAudioRecordingState();
    
    showNotification('Archivo removido', 'info');
}

// ============================================
// FUNCIÓN MEJORADA PARA ENVIAR PARTICIPACIÓN
// ============================================
async function submitParticipation() {
    try {
        // CORREGIDO: Usar window.currentParticipationEvent (que SÍ funciona)
        const evento = window.currentParticipationEvent;
        if (!evento) {
            showNotification('Error: No hay evento seleccionado', 'error');
            return;
        }

        console.log('Submitting participation for event:', evento.id, 'type:', evento.response_type);

        const submitBtn = document.getElementById('participateSubmitBtn');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = 'Enviando... ⏳';
        submitBtn.disabled = true;
        
        let participationData = {
            evento_id: evento.id,
        };
        
        // Datos según tipo de respuesta
        if (evento.response_type === 'text') {
            const textContent = document.getElementById('participateTextInput').value.trim();
            if (!textContent) {
                throw new Error('Por favor ingresa tu participación');
            }
            participationData.contenido = textContent;
            
        } else if (['image', 'video', 'audio'].includes(evento.response_type)) {
            // CORREGIDO: Usar window.selectedParticipationFile (que SÍ funciona)
            console.log('Checking for selected file:', {
                hasFile: !!window.selectedParticipationFile,
                fileName: window.selectedParticipationFile?.name,
                fileSize: window.selectedParticipationFile?.size,
                fileType: window.selectedParticipationFile?.type,
                hasPreviewUrl: !!window.participationFilePreviewUrl
            });
            
            if (!window.selectedParticipationFile) {
                const fileTypeName = evento.response_type === 'image' ? 'una imagen' : 
                                   evento.response_type === 'video' ? 'un video' : 'un audio';
                throw new Error(`Por favor selecciona ${fileTypeName}`);
            }
            
            // Validación adicional para audio
            if (evento.response_type === 'audio') {
                if (window.selectedParticipationFile.size === 0) {
                    throw new Error('El archivo de audio está vacío');
                }
                
                if (!window.selectedParticipationFile.type.startsWith('audio/')) {
                    throw new Error('El archivo debe ser de tipo audio');
                }
                
                console.log('Audio file validation passed:', {
                    size: window.selectedParticipationFile.size,
                    type: window.selectedParticipationFile.type,
                    name: window.selectedParticipationFile.name,
                    duration: window.selectedParticipationFile.duration
                });
            }
            
            submitBtn.innerHTML = 'Subiendo archivo... 📤';
            
            let uploadResponse;
            
            // CORREGIDO: Detectar si es audio grabado vs archivo subido
            const isRecordedAudio = evento.response_type === 'audio' && 
                                  window.participationFilePreviewUrl && 
                                  window.participationFilePreviewUrl.startsWith('data:audio');
            
            if (isRecordedAudio) {
                // Audio grabado - enviar como base64
                console.log('Uploading recorded audio as base64...');
                
                const audioData = {
                    audio_data: window.participationFilePreviewUrl
                };
                
                uploadResponse = await fetch('/php/subir_archivo_participacion.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(audioData)
                });
                
            } else {
                // Archivo subido normalmente - usar FormData
                console.log('Uploading file via FormData...');
                
                const formData = new FormData();
                
                // Usar nombres de campo específicos según el tipo
                if (evento.response_type === 'audio') {
                    formData.append('audio_file', window.selectedParticipationFile);
                } else if (evento.response_type === 'image') {
                    formData.append('image_file', window.selectedParticipationFile);
                } else if (evento.response_type === 'video') {
                    formData.append('media_file', window.selectedParticipationFile);
                } else {
                    formData.append('participation_file', window.selectedParticipationFile);
                }
                
                uploadResponse = await fetch('/php/subir_archivo_participacion.php', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
            }
            
            console.log('Upload response status:', uploadResponse.status);
            
            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('Upload error response:', errorText);
                throw new Error(`Error en el servidor al subir archivo: ${uploadResponse.status} - ${errorText}`);
            }
            
            const uploadData = await uploadResponse.json();
            console.log('Upload response data:', uploadData);
            
            if (!uploadData.success) {
                throw new Error('Error subiendo archivo: ' + (uploadData.message || 'Error desconocido'));
            }
            
           let fileData;
            if (isRecordedAudio) {
                fileData = uploadData.files.audio_data;
            } else if (evento.response_type === 'audio') {
                fileData = uploadData.files.audio_file;
            } else if (evento.response_type === 'image') {
                fileData = uploadData.files.image_file;
            } else if (evento.response_type === 'video') {
                fileData = uploadData.files.media_file;
            } else {
                fileData = uploadData.files.participation_file;
            }
            
            if (!fileData) {
                console.error('No file data found in upload response:', uploadData);
                console.error('Available keys:', Object.keys(uploadData.files || {}));
                throw new Error('Error: archivo no procesado correctamente en el servidor');
            }
            
            participationData.media_url = fileData.url;
            participationData.media_filename = fileData.original_name || fileData.filename || window.selectedParticipationFile.name;
            participationData.media_type = evento.response_type;
            
            // CORRECCIÓN CRÍTICA: Para audio, SIEMPRE incluir duración
            if (evento.response_type === 'audio') {
                // Intentar obtener duración de múltiples fuentes
                let audioDuration = null;
                
                if (window.selectedParticipationFile.duration) {
                    audioDuration = window.selectedParticipationFile.duration;
                    console.log('Duración obtenida del archivo:', audioDuration);
                } else if (window.selectedParticipationFile.recordedDuration) {
                    audioDuration = window.selectedParticipationFile.recordedDuration;
                    console.log('Duración obtenida de recordedDuration:', audioDuration);
                } else if (window.audioRecordingDuration) {
                    audioDuration = window.audioRecordingDuration;
                    console.log('Duración obtenida de variable global:', audioDuration);
                } else {
                    // Calcular duración basada en el tamaño del archivo (estimación aproximada)
                    const estimatedDuration = Math.max(1, Math.floor(window.selectedParticipationFile.size / 16000));
                    audioDuration = estimatedDuration;
                    console.log('Duración estimada por tamaño:', audioDuration);
                }
                
                participationData.audio_duration = audioDuration;
                console.log('Enviando duración de audio al servidor:', audioDuration);
            }
            
            // Para video, marcar como silenciado
            if (evento.response_type === 'video') {
                participationData.silenciado = true;
            }
        }

        submitBtn.innerHTML = 'Registrando participación... ✨';

        console.log('Sending participation data to server:', participationData);

        const response = await fetch('/php/participar_campana.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(participationData)
        });

        console.log('Participation response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Participation error response:', errorText);
            throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Participation response data:', data);
        
        if (data.success) {
            // Marcar como participado en localStorage
            const currentUser = CHAINFEED_CONFIG.currentUser?.username || getCurrentUser();
            if (currentUser) {
                localStorage.setItem(`participated_${evento.id}_${currentUser}`, 'true');
            }
            
            closeParticipateModal();
            
            // Actualizar el evento en la lista actual si existe
            if (typeof chainEventsData !== 'undefined' && Array.isArray(chainEventsData)) {
                const eventIndex = chainEventsData.findIndex(e => e.id === evento.id);
                if (eventIndex !== -1 && data.estadisticas_actualizadas) {
                    chainEventsData[eventIndex].participantes = data.estadisticas_actualizadas.participantes_actuales;
                    chainEventsData[eventIndex].user_participated = true;
                }
            }
            
            // Recargar eventos chain si estamos en esa tab
            if (typeof currentActiveTab !== 'undefined' && currentActiveTab === 'chain') {
                const container = document.getElementById('chain-events-container');
                if (container && typeof loadChainEvents === 'function') {
                    setTimeout(() => loadChainEvents(container, false), 500);
                }
            }
            
            // Mostrar mensaje de éxito con tokens ganados
            const tokensGanados = data.participacion?.tokens_ganados_participacion || 0;
            const mensaje = tokensGanados > 0 ? 
                `🎯 ¡Participación enviada! Has ganado ${tokensGanados} CFT. El creador revisará tu participación pronto.` :
                '🎯 ¡Participación enviada exitosamente! El creador la revisará pronto.';
            
            showNotification(mensaje, 'success');
            
        } else {
            throw new Error(data.message || 'Error desconocido del servidor');
        }
        
    } catch (error) {
        console.error('Error enviando participación:', error);
        
        // Extraer mensaje limpio para el usuario
        let userMessage = error.message;
        
        // Limpiar mensajes técnicos o con formato JSON
        if (userMessage.includes('Error del servidor:') && userMessage.includes('{')) {
            try {
                const jsonMatch = userMessage.match(/\{.*\}/);
                if (jsonMatch) {
                    const errorData = JSON.parse(jsonMatch[0]);
                    userMessage = errorData.message || 'Error del servidor';
                }
            } catch (e) {
                userMessage = 'Error del servidor';
            }
        }
        
        // Remover prefijos técnicos innecesarios
        userMessage = userMessage.replace('Error del servidor: 400 - ', '');
        userMessage = userMessage.replace('HTTP 400: ', '');
        
        showNotification('❌ ' + userMessage, 'error');
    } finally {
        const submitBtn = document.getElementById('participateSubmitBtn');
        if (submitBtn) {
            submitBtn.innerHTML = '🎯 Enviar Participación';
            submitBtn.disabled = false;
        }
        
        // Limpiar variables globales después del envío
        if (window.participationFilePreviewUrl && window.participationFilePreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(window.participationFilePreviewUrl);
        }
        window.selectedParticipationFile = null;
        window.participationFilePreviewUrl = null;
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function showChainError(message, containerElement = null) {
    console.log('showChainError called with:', message, containerElement);
    
    let container = containerElement;
    
    // Buscar contenedor de manera más segura
    if (!container) {
        container = document.getElementById('chain-events-container');
    }
    
    if (!container) {
        container = document.querySelector('.main-container');
    }
    
    if (!container) {
        // Crear un contenedor temporal si no existe ninguno
        container = document.createElement('div');
        container.id = 'temp-error-container';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            background: var(--dark-secondary, #1a1a24);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
    
    const errorHTML = `
        <div class="empty-state" style="text-align: center; padding: 3rem;">
            <div class="empty-icon" style="color: var(--error, #ef4444); font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <h3 style="color: var(--error, #ef4444); margin-bottom: 0.5rem;">Error cargando eventos</h3>
            <p style="color: var(--text-secondary, #666); margin-bottom: 1.5rem; line-height: 1.5;">${escapeHtml(message || 'Error desconocido')}</p>
            <button onclick="loadChainContent(); this.parentElement.parentElement.remove();" style="
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.3);
                color: var(--primary, #6366f1);
                padding: 0.8rem 1.5rem;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            ">
                🔄 Reintentar
            </button>
        </div>
    `;
    
    try {
        container.innerHTML = errorHTML;
        console.log('Error message displayed successfully');
    } catch (error) {
        console.error('Failed to display error message:', error);
        // Fallback: usar alert como último recurso
        alert('Error cargando eventos Chain: ' + message);
    }
}

function loadMoreChainEvents() {
    chainPagination.offset += chainPagination.limit;
    const container = document.getElementById('chain-events-container');
    loadChainEvents(container, true);
}

function formatAudioDuration(seconds) {
    if (!seconds || seconds <= 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 
                    type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                    'rgba(99, 102, 241, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Agregar estilos de animación si no existen
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// Función de escape HTML (si no existe ya)
if (typeof escapeHtml === 'undefined') {
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
}

// ============================================
// FUNCIÓN PARA COMPARTIR EVENTOS CHAIN
// ============================================

// ============================================
// SISTEMA DE COMPARTIR EVENTOS CHAIN
// ============================================

(function() {
    'use strict';
    
    // Asegurar que ShareSystem existe globalmente
    window.ShareSystem = window.ShareSystem || {
        currentPost: null,
        selectedUsers: new Set(),
        followedUsers: [],
        filteredFollowers: [],
        isLoading: false
    };

    /**
     * Compartir evento Chain
     */
    window.shareChainEvent = function(buttonElement, eventId) {
        try {
            console.log('📤 Compartiendo evento Chain:', eventId);
            
            // Verificar que ShareSystem existe
            if (!window.ShareSystem) {
                console.error('ShareSystem no está definido');
                showNotification('Error del sistema. Recarga la página.', 'error');
                return;
            }
            
            // Buscar el contenedor del evento
            const eventCard = buttonElement.closest('.chain-event-card');
            
            if (!eventCard) {
                console.error('No se encontró el contenedor del evento');
                showNotification('Error: No se encontró el evento', 'error');
                return;
            }
            
            // Configurar ShareSystem para evento Chain
            window.ShareSystem.currentPost = {
                type: 'chain-event',
                id: parseInt(eventId),
                element: eventCard
            };
            
            console.log('✅ ShareSystem configurado para Chain:', window.ShareSystem.currentPost);
            
            // Abrir modal usando la función wrapper
            openChainShareModal(buttonElement);
            
        } catch (error) {
            console.error('Error compartiendo evento Chain:', error);
            showNotification('Error al compartir evento', 'error');
        }
    };

    /**
     * Wrapper para abrir modal de compartir específico para Chain
     */
    async function openChainShareModal(element) {
        try {
            // Verificar que el modal existe
            const modal = document.getElementById('shareModal');
            if (!modal) {
                showNotification('Error: Modal de compartir no encontrado', 'error');
                return;
            }

            // Abrir modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Actualizar título del modal
            const modalTitle = modal.querySelector('.share-title');
            if (modalTitle) {
                modalTitle.textContent = '📤 Compartir Evento Chain';
            }

            // Cargar usuarios seguidos
            await loadFollowedUsersForChain();

            // Focus en buscador
            setTimeout(() => {
                const searchInput = document.getElementById('shareSearch');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
            }, 300);

        } catch (error) {
            console.error('Error al abrir modal de compartir Chain:', error);
            showNotification('Error al abrir modal de compartir', 'error');
        }
    }

    async function loadFollowedUsersForChain() {
        try {
            window.ShareSystem.isLoading = true;
            showLoadingStateShare();

            // Obtener usuario actual de múltiples fuentes posibles
            let currentUsername = null;
            
            // Opción 1: CHAINFEED_CONFIG (usado en perfil.js)
            if (window.CHAINFEED_CONFIG?.currentUser?.username) {
                currentUsername = window.CHAINFEED_CONFIG.currentUser.username;
                console.log('Usuario obtenido de CHAINFEED_CONFIG:', currentUsername);
            }
            // Opción 2: CommentsSystem (backup en perfil.js)
            else if (window.CommentsSystem?.currentUser?.username) {
                currentUsername = window.CommentsSystem.currentUser.username;
                console.log('Usuario obtenido de CommentsSystem:', currentUsername);
            }
            // Opción 3: Verificar sesión directamente (usado en inicio.js)
            else {
                console.log('Obteniendo usuario desde verificar_sesion.php...');
                const sessionResponse = await fetch('/php/verificar_sesion.php', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (sessionResponse.ok) {
                    const sessionData = await sessionResponse.json();
                    if (sessionData.success && sessionData.user?.username) {
                        currentUsername = sessionData.user.username;
                        console.log('Usuario obtenido de sesión:', currentUsername);
                    }
                }
            }

            if (!currentUsername) {
                throw new Error('No se pudo obtener el usuario actual. Por favor, recarga la página.');
            }

            console.log('Usando username:', currentUsername);

            const response = await fetch('/php/obtener_listas_seguimiento.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: currentUsername,
                    tipo: 'mutuos',
                    limite: 50,
                    offset: 0
                })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Error al cargar usuarios seguidos');
            }

            // Guardar usuarios seguidos
            window.ShareSystem.followedUsers = data.data.usuarios;
            window.ShareSystem.filteredFollowers = [...window.ShareSystem.followedUsers];

            renderFollowedUsersForChain();

            console.log(`Usuarios seguidos cargados para Chain: ${window.ShareSystem.followedUsers.length}`);

        } catch (error) {
            console.error('Error cargando usuarios seguidos:', error);
            showNotification(`Error al cargar usuarios: ${error.message}`, 'error');
            showErrorWithRetryForChain(error.message);
        } finally {
            window.ShareSystem.isLoading = false;
        }
    }

   function renderFollowedUsersForChain() {
    const followersList = document.getElementById('mutualFollowersList');
    if (!followersList) return;
    
    // ✅ VERIFICAR QUE SEA EVENTO CHAIN
    if (!window.ShareSystem.currentPost || window.ShareSystem.currentPost.type !== 'chain-event') {
        console.log('⚠️ No es evento Chain, saltando renderFollowedUsersForChain');
        return;
    }
    
    if (window.ShareSystem.filteredFollowers.length === 0) {
        followersList.innerHTML = `
            <div class="empty-followers">
                <div class="empty-followers-icon">👥</div>
                <h3>No se encontraron usuarios</h3>
                <p>No hay seguidores mutuos o que coincidan con tu búsqueda</p>
            </div>
        `;
        return;
    }

    let followersHTML = '';

    window.ShareSystem.filteredFollowers.forEach(follower => {
        const isSelected = window.ShareSystem.selectedUsers.has(follower.id);
        const avatarHTML = follower.avatar_url 
            ? `<img src="${follower.avatar_url}" alt="${follower.username}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.style.display='none'; this.parentNode.textContent='${generateAvatarInitials(follower.username)}';">`
            : generateAvatarInitials(follower.username);
        
        followersHTML += `
            <div class="mutual-follower ${isSelected ? 'selected' : ''}" 
                 onclick="toggleUserSelection(${follower.id})" data-user-id="${follower.id}">
                <div class="follower-avatar">${avatarHTML}</div>
                <div class="follower-info">
                    <div class="follower-name">
                        ${escapeHtml(follower.display_name)}
                        ${follower.verified ? '<span class="follower-verified">✓</span>' : ''}
                    </div>
                    <div class="follower-username">@${follower.username}</div>
                </div>
                <div class="share-selection ${isSelected ? 'selected' : ''}">
                    ${isSelected ? '✓' : ''}
                </div>
            </div>
        `;
    });

    followersList.innerHTML = followersHTML;
    updateChainShareButton();
}

  /**
 * Actualizar botón de compartir para Chain
 */
function updateChainShareButton() {
    // ✅ SOLO ACTUAR SI ES EVENTO CHAIN
    if (!window.ShareSystem.currentPost || window.ShareSystem.currentPost.type !== 'chain-event') {
        console.log('⚠️ No es evento Chain, saltando updateChainShareButton');
        return;
    }
    
    const shareContent = document.querySelector('.share-content');
    if (!shareContent) return;
    
    const selectedCount = window.ShareSystem.selectedUsers.size;
    
    const existingTextArea = document.querySelector('#shareModal .share-message-container');
    const existingButton = document.querySelector('#shareModal .share-submit-btn');
    
    if (selectedCount === 0) {
        // Sin usuarios seleccionados: remover textarea y botón
        if (existingTextArea) {
            existingTextArea.remove();
        }
        
        if (existingButton) {
            existingButton.parentElement.remove();
        }
        
    } else {
        // Con usuarios seleccionados: mostrar textarea y botón
        
        // Agregar textarea si no existe
        if (!existingTextArea) {
            const textAreaHTML = `
                <div class="share-message-container" style="padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                        Mensaje opcional:
                    </label>
                    <textarea 
                        id="shareMessageText"
                        placeholder="Escribe tu mensaje aquí..." 
                        style="
                            width: 100%;
                            background: rgba(37, 37, 50, 0.5);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            border-radius: 8px;
                            padding: 0.8rem;
                            color: white;
                            font-family: inherit;
                            font-size: 0.9rem;
                            resize: vertical;
                            min-height: 80px;
                            max-height: 120px;
                        "
                        maxlength="200"
                    ></textarea>
                    <div style="text-align: right; font-size: 0.8rem; color: #a0a0b8; margin-top: 0.3rem;">
                        <span id="shareMessageCounter">0</span>/200
                    </div>
                </div>
            `;
            
            shareContent.insertAdjacentHTML('beforeend', textAreaHTML);
            
            const textArea = document.getElementById('shareMessageText');
            const counter = document.getElementById('shareMessageCounter');
            if (textArea && counter) {
                textArea.addEventListener('input', function() {
                    counter.textContent = this.value.length;
                });
                
                setTimeout(() => textArea.focus(), 100);
            }
        }
        
        // Agregar botón si no existe
        if (!existingButton) {
            const buttonHTML = `
                <div style="padding: 1rem;">
                    <button class="share-submit-btn" onclick="window.submitChainShare()" style="
                        width: 100%;
                        background: linear-gradient(135deg, var(--primary), var(--secondary));
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        position: relative;
                    ">
                        📤 Compartir con ${selectedCount} usuario${selectedCount > 1 ? 's' : ''}
                    </button>
                </div>
            `;
            
            shareContent.insertAdjacentHTML('beforeend', buttonHTML);
        } else {
            // Actualizar texto del botón existente
            existingButton.textContent = `📤 Compartir con ${selectedCount} usuario${selectedCount > 1 ? 's' : ''}`;
        }
    }
}

    /**
     * Enviar compartir evento Chain
     */
    window.submitChainShare = async function() {
        const button = document.getElementById('shareBtn');
        let originalText = 'Compartir';
        
        try {
            if (window.ShareSystem.selectedUsers.size === 0) {
                showNotification('Selecciona al menos un usuario', 'error');
                return;
            }

            if (!window.ShareSystem.currentPost || !window.ShareSystem.currentPost.id) {
                showNotification('Error: No se encontró el evento a compartir', 'error');
                return;
            }

            if (button) {
                originalText = button.textContent;
                button.innerHTML = 'Compartiendo... ⏳';
                button.disabled = true;
            }

            const messageTextArea = document.getElementById('shareMessageText');
            const mensajeOpcional = messageTextArea ? messageTextArea.value.trim() : '';
            const usuariosDestino = Array.from(window.ShareSystem.selectedUsers);

            console.log('Compartiendo evento Chain:', {
                evento_id: window.ShareSystem.currentPost.id,
                usuarios_destino: usuariosDestino,
                mensaje: mensajeOpcional
            });

            // Llamar a la API del chat para compartir el evento Chain
            const response = await fetch('../php/api_chat.php?accion=compartir_evento_chain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    evento_id: window.ShareSystem.currentPost.id,
                    usuarios_destino: usuariosDestino,
                    mensaje: mensajeOpcional
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error del servidor:', errorText);
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Error al compartir el evento');
            }

            const nombreUsuarios = window.ShareSystem.followedUsers
                .filter(user => window.ShareSystem.selectedUsers.has(user.id))
                .map(user => `@${user.username}`)
                .join(', ');

            const totalEnviados = data.estadisticas?.total_enviados || data.total_enviados || 0;
            const totalFallidos = data.estadisticas?.total_fallidos || data.total_fallidos || 0;

            let mensajeExito = `📤 Evento Chain compartido con ${totalEnviados} usuario${totalEnviados > 1 ? 's' : ''}`;
            
            if (totalEnviados > 0) {
                mensajeExito += `\n👥 Enviado a: ${nombreUsuarios}`;
            }

            if (totalFallidos > 0) {
                mensajeExito += `\n⚠️ ${totalFallidos} usuario${totalFallidos > 1 ? 's' : ''} no pudo${totalFallidos === 1 ? '' : 'ieron'} recibir el mensaje`;
            }

            showNotification(mensajeExito, 'success');

            setTimeout(() => {
                closeShareModal();
            }, 1500);

        } catch (error) {
            console.error('Error al compartir evento Chain:', error);
            
            let errorMessage = 'Error al compartir el evento';
            
            if (error.message.includes('Sesión')) {
                errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            showNotification(errorMessage, 'error');
            
        } finally {
            // CRÍTICO: Siempre restaurar el botón
            if (button) {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
    };

    /**
     * Estados de carga y error
     */
    function showLoadingStateShare() {
        const containerList = document.getElementById('mutualFollowersList');
        if (containerList) {
            containerList.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="width: 40px; height: 40px; border: 4px solid rgba(99, 102, 241, 0.3); border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <p>Cargando usuarios que sigues...</p>
                </div>
            `;
        }
    }

    function showErrorWithRetryForChain(errorMessage) {
        const containerList = document.getElementById('mutualFollowersList');
        if (containerList) {
            containerList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <h3>Error al cargar usuarios seguidos</h3>
                    <p style="color: var(--error); margin-bottom: 1rem;">${errorMessage}</p>
                    <button onclick="window.shareChainEvent.retryLoad()" style="
                        padding: 0.8rem 1.5rem;
                        background: var(--primary);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                    ">Reintentar</button>
                </div>
            `;
        }
    }

    // Función para reintentar
    window.shareChainEvent.retryLoad = function() {
        loadFollowedUsersForChain();
    };

    console.log('✅ Sistema de compartir eventos Chain inicializado');

/**
 * Toggle selección de usuario - VERSIÓN UNIFICADA
 */
window.toggleUserSelection = function(userId) {
    console.log('👤 Toggle user:', userId);
    console.log('🔍 Tipo actual:', window.ShareSystem.currentPost?.type);
    
    if (window.ShareSystem.selectedUsers.has(userId)) {
        window.ShareSystem.selectedUsers.delete(userId);
    } else {
        window.ShareSystem.selectedUsers.add(userId);
    }
    
    console.log('📊 Total seleccionados:', window.ShareSystem.selectedUsers.size);
    
    // Actualizar UI visualmente en el elemento
    const userElement = document.querySelector(`[data-user-id="${userId}"]`);
    if (userElement) {
        const isSelected = window.ShareSystem.selectedUsers.has(userId);
        userElement.classList.toggle('selected', isSelected);
        
        const checkmark = userElement.querySelector('.share-selection, .selection-indicator');
        if (checkmark) {
            if (isSelected) {
                checkmark.classList.add('selected');
                checkmark.textContent = '✓';
            } else {
                checkmark.classList.remove('selected');
                checkmark.textContent = '';
            }
        }
    }
    
    // ✅ Llamar a la función correcta según el tipo
    if (window.ShareSystem.currentPost?.type === 'chain-event') {
        console.log('📢 Actualizando botón para Chain Event');
        if (typeof updateChainShareButton === 'function') {
            updateChainShareButton();
        }
    } else {
        console.log('📝 Actualizando botón para Post Normal');
        if (typeof updateShareButton === 'function') {
            updateShareButton();
        } else {
            console.error('❌ updateShareButton no está definida');
        }
    }
};

    /**
     * Cerrar modal de compartir
     */
    window.closeShareModal = function() {
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Limpiar selección
            window.ShareSystem.selectedUsers.clear();
            window.ShareSystem.currentPost = null;
            
            // Remover textarea y botón si existen
            const textArea = document.querySelector('#shareModal .share-message-container');
            const button = document.querySelector('#shareModal .share-submit-btn');
            
            if (textArea) textArea.remove();
            if (button) button.parentElement.remove();
        }
    };

    /**
     * Filtrar usuarios por búsqueda
     */
    window.filterShareUsers = function(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            window.ShareSystem.filteredFollowers = [...window.ShareSystem.followedUsers];
        } else {
            const term = searchTerm.toLowerCase().trim();
            window.ShareSystem.filteredFollowers = window.ShareSystem.followedUsers.filter(user => {
                return user.username.toLowerCase().includes(term) ||
                       (user.display_name && user.display_name.toLowerCase().includes(term));
            });
        }
        
        renderFollowedUsersForChain();
    };

    console.log('✅ Sistema de compartir eventos Chain inicializado');

})();

// ============================================
// SISTEMA DE MENÚ PARA EVENTOS CHAIN
// ============================================
/**
 * Toggle del menú de opciones de evento Chain - VERSIÓN DEFINITIVA
 */
function toggleChainMenu(eventId) {
    const dropdown = document.getElementById(`chainDropdown-${eventId}`);
    if (!dropdown) {
        console.log('❌ Dropdown no encontrado para:', eventId);
        return;
    }
    
    console.log('🔧 Toggle menu para:', eventId);
    
    // Cerrar otros dropdowns abiertos
    document.querySelectorAll('.chain-dropdown').forEach(d => {
        if (d.id !== `chainDropdown-${eventId}`) {
            d.classList.add('hidden');
            d.style.cssText = 'opacity: 0 !important; visibility: hidden !important;';
            
            // Detener observer si existe
            if (d.styleObserver) {
                d.styleObserver.disconnect();
                d.styleObserver = null;
            }
        }
    });
    
    // Toggle del dropdown actual
    const isHidden = dropdown.classList.contains('hidden');
    
    if (isHidden) {
        dropdown.classList.remove('hidden');
        
        // Función para forzar estilos
        const forceStyles = () => {
            dropdown.style.setProperty('position', 'absolute', 'important');
            dropdown.style.setProperty('top', '40px', 'important');
            dropdown.style.setProperty('right', '10px', 'important');
            dropdown.style.setProperty('left', 'auto', 'important');
            dropdown.style.setProperty('background', 'rgba(26, 26, 36, 0.98)', 'important');
            dropdown.style.setProperty('backdrop-filter', 'blur(20px)', 'important');
            dropdown.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.15)', 'important');
            dropdown.style.setProperty('border-radius', '12px', 'important');
            dropdown.style.setProperty('padding', '0.5rem 0', 'important');
            dropdown.style.setProperty('min-width', '220px', 'important');
            dropdown.style.setProperty('box-shadow', 'rgba(0, 0, 0, 0.6) 0px 10px 40px', 'important');
            dropdown.style.setProperty('z-index', '999999', 'important');
            dropdown.style.setProperty('opacity', '1', 'important');
            dropdown.style.setProperty('visibility', 'visible', 'important');
            dropdown.style.setProperty('transform', 'translateY(0) scale(1)', 'important');
            dropdown.style.setProperty('transition', '0.3s', 'important');
        };
        
        // Aplicar estilos inmediatamente
        forceStyles();
        
        // Crear observer para detectar cambios y re-forzar
        if (!dropdown.styleObserver) {
            dropdown.styleObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const currentTop = dropdown.style.top;
                        const currentRight = dropdown.style.right;
                        
                        // Solo re-forzar si los valores son incorrectos
                        if (currentTop !== '40px' || currentRight !== '10px') {
                            forceStyles();
                        }
                    }
                });
            });
            
            dropdown.styleObserver.observe(dropdown, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
        
        console.log('✅ Menú abierto para:', eventId);
    } else {
        // Detener observer al cerrar
        if (dropdown.styleObserver) {
            dropdown.styleObserver.disconnect();
            dropdown.styleObserver = null;
        }
        
        dropdown.classList.add('hidden');
        dropdown.style.setProperty('opacity', '0', 'important');
        dropdown.style.setProperty('visibility', 'hidden', 'important');
        dropdown.style.setProperty('transform', 'translateY(-10px) scale(0.95)', 'important');
        
        console.log('✅ Menú cerrado para:', eventId);
    }
}
/**
 * Cerrar dropdowns de Chain al hacer clic fuera
 */
document.addEventListener('click', function(e) {
    if (!e.target.closest('.chain-menu-container')) {
        document.querySelectorAll('.chain-dropdown').forEach(dropdown => {
            dropdown.classList.add('hidden');
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        });
    }
});

/**
 * Cerrar dropdowns al hacer scroll
 */
let chainScrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(chainScrollTimeout);
    chainScrollTimeout = setTimeout(() => {
        document.querySelectorAll('.chain-dropdown').forEach(dropdown => {
            dropdown.classList.add('hidden');
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        });
    }, 150);
});

/**
 * ============================================
 * CAMBIAR PRIVACIDAD DE EVENTO CHAIN - VERSIÓN FINAL
 * ============================================
 */
/**
 * ============================================
 * CAMBIAR PRIVACIDAD DE EVENTO CHAIN - CON CONFIRMACIÓN
 * ============================================
 */
async function toggleChainPrivacy(eventId, isCurrentlyPublic) {
    try {
        const numericId = parseInt(eventId.replace('chain-', ''));
        
        console.log('🔒 Cambiando privacidad de evento Chain:', numericId);
        
        // Cerrar menú modal si está abierto
        if (window.MenuModalesChain && typeof window.MenuModalesChain.cerrar === 'function') {
            window.MenuModalesChain.cerrar();
        }
        
        const newStatus = !isCurrentlyPublic;
        const statusText = newStatus ? 'público' : 'privado';
        const icon = newStatus ? '🌍' : '🔒';
        
        // Mensajes según el estado
        const message = newStatus 
            ? '¿Hacer este evento público? Todos podrán verlo, incluso quienes no te siguen.'
            : '¿Hacer este evento privado? Solo tus seguidores podrán verlo.';
        
        // ✅ MODAL DE CONFIRMACIÓN
        const modal = createConfirmModal(
            `${icon} Cambiar privacidad`,
            message,
            'Cancelar',
            `Hacer ${statusText}`,
            null, // onCancel
            async () => { // onConfirm
                try {
                    showNotification(`⏳ Cambiando a ${statusText}...`, 'info');
                    
                    // Llamar al endpoint
                    const response = await fetch('/php/actualizar_privacidad_evento_chain.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            evento_id: numericId,
                            es_publico: newStatus ? 1 : 0
                        })
                    });
                    
                    console.log('Response status:', response.status);
                    
                    if (response.status === 404) {
                        throw new Error('Archivo PHP no encontrado. Verifica que "actualizar_privacidad_evento_chain.php" existe en /php/');
                    }
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Error response:', errorText);
                        throw new Error(`Error del servidor (${response.status})`);
                    }
                    
                    const data = await response.json();
                    console.log('Response data:', data);
                    
                    if (data.success) {
                        const successMessage = data.message || `✅ Evento ahora es ${statusText}`;
                        showNotification(successMessage, 'success');
                        
                        // ✅ ACTUALIZAR EL ESTADO EN chainEventsData
                        if (window.chainEventsData && Array.isArray(window.chainEventsData)) {
                            const eventIndex = window.chainEventsData.findIndex(e => e.id === numericId);
                            if (eventIndex !== -1) {
                                window.chainEventsData[eventIndex].es_publico = newStatus;
                                console.log('✅ Estado actualizado en chainEventsData');
                            }
                        }
                        
                    } else {
                        throw new Error(data.message || 'Error al cambiar privacidad');
                    }
                    
                } catch (error) {
                    console.error('Error cambiando privacidad:', error);
                    showNotification('❌ Error: ' + error.message, 'error');
                }
            },
            { type: 'info' }
        );
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error: ' + error.message, 'error');
    }
}
/**
 * ============================================
 * ELIMINAR EVENTO CHAIN
 * ============================================
 */
async function deleteChainEvent(eventId) {
    try {
        const numericId = parseInt(eventId.replace('chain-', ''));
        
        console.log('🗑️ Eliminando evento Chain:', numericId);
        
        // ✅ MODAL DE CONFIRMACIÓN
        const modal = createConfirmModal(
            '🗑️ Eliminar evento',
            '¿Estás seguro de que deseas eliminar este evento Chain? Esta acción no se puede deshacer y perderás todas las participaciones.',
            'Cancelar',
            'Eliminar',
            null, // onCancel
            async () => { // onConfirm
                try {
                    showNotification('⏳ Eliminando evento...', 'info');
                    
                    // Llamar al endpoint
                    const response = await fetch('/php/eliminar_evento_chain.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            evento_id: numericId
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        showNotification('✅ Evento eliminado correctamente', 'success');
                        
                        // Ocultar el evento con animación
                        const eventCard = document.querySelector(`[data-event-id="${numericId}"]`);
                        if (eventCard) {
                            eventCard.style.opacity = '0';
                            eventCard.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                eventCard.remove();
                            }, 300);
                        }
                        
                        // Actualizar contador
                        if (typeof updateChainTabCount === 'function') {
                            const currentCount = parseInt(document.getElementById('chainTabCount')?.textContent || '0');
                            updateChainTabCount(Math.max(0, currentCount - 1));
                        }
                        
                    } else {
                        throw new Error(data.message || 'Error al eliminar evento');
                    }
                    
                } catch (error) {
                    console.error('Error eliminando evento:', error);
                    showNotification('❌ Error: ' + error.message, 'error');
                }
            },
            { type: 'danger' }
        );
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

/**
 * ============================================
 * OCULTAR EVENTO CHAIN (USANDO BACKEND)
 * ============================================
 */
async function hideChainEvent(eventId) {
    try {
        const numericId = parseInt(eventId.replace('chain-', ''));
        
        console.log('👁️‍🗨️ Ocultando evento Chain:', numericId);
        
        // ✅ CERRAR MODAL DE OPCIONES (modal-chain-overlay)
        if (window.MenuModalesChain && typeof window.MenuModalesChain.cerrar === 'function') {
            window.MenuModalesChain.cerrar();
        }
        
        // ✅ MODAL DE CONFIRMACIÓN
        const modal = createConfirmModal(
            '👁️‍🗨️ Ocultar evento',
            '¿Ocultar este evento de tu feed? Solo desaparecerá para ti, otros usuarios seguirán viéndolo.',
            'Cancelar',
            'Ocultar',
            null, // onCancel
            async () => { // onConfirm
                try {
                    showNotification('⏳ Ocultando evento...', 'info');
                    
                    const response = await fetch('/php/ocultar_evento.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            evento_id: numericId
                        })
                    });
                    
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error del servidor (${response.status})`);
                    }
                    
                    const data = await response.json();
                    
                    if (!data.success) {
                        throw new Error(data.message || 'Error al ocultar evento');
                    }
                    
                    // Ocultar con animación
                    const eventCard = document.querySelector(`[data-event-id="${numericId}"]`);
                    if (eventCard) {
                        eventCard.style.transition = 'all 0.3s ease';
                        eventCard.style.opacity = '0';
                        eventCard.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            eventCard.style.display = 'none';
                        }, 300);
                    }
                    
                    showNotification('👁️‍🗨️ Evento ocultado de tu feed', 'success');
                    
                    // Actualizar contador
                    if (typeof updateChainTabCount === 'function') {
                        const currentCount = parseInt(document.getElementById('chainTabCount')?.textContent || '0');
                        updateChainTabCount(Math.max(0, currentCount - 1));
                    }
                    
                } catch (error) {
                    console.error('Error ocultando evento:', error);
                    showNotification('❌ Error: ' + error.message, 'error');
                }
            },
            { type: 'warning' }
        );
        
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

/**
 * ============================================
 * REPORTAR EVENTO CHAIN - VERSIÓN CON MODAL ELEGANTE
 * ============================================
 */
async function reportChainEvent(eventId) {
    try {
        console.log('⚠️ Reportando evento Chain:', eventId);
        
        // ✅ CERRAR MODAL DE OPCIONES (modal-chain-overlay)
        if (window.MenuModalesChain && typeof window.MenuModalesChain.cerrar === 'function') {
            window.MenuModalesChain.cerrar();
        }
        
        // ✅ ABRIR MODAL CON OPCIONES
        const modal = createReportModalChain(eventId);
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('[style*="transform"]');
            if (content) {
                content.style.transform = 'scale(1)';
            }
        }, 10);
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

/**
 * ============================================
 * PROMOCIONAR EVENTO CHAIN
 * ============================================
 */
async function promoteChainEvent(eventId) {
    try {
        const numericId = parseInt(eventId.replace('chain-', ''));
        
        console.log('📢 Promocionando evento Chain:', numericId);
        
        // ✅ CERRAR MODAL CORRECTAMENTE (no usar toggleChainMenu)
        if (window.MenuModalesChain && typeof window.MenuModalesChain.cerrar === 'function') {
            window.MenuModalesChain.cerrar();
        }
        
        // Confirmar promoción
        if (!confirm('📢 ¿Promocionar este evento?\n\nTu evento aparecerá destacado en el feed de Chain por 24 horas.')) {
            return;
        }
        
        showNotification('⏳ Procesando promoción...', 'info');
        
        // Llamar al endpoint
        const response = await fetch('/php/promocionar_evento_chain.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                evento_id: numericId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('✅ Evento promocionado exitosamente', 'success');
            
            // Recargar eventos Chain
            const container = document.getElementById('chain-events-container');
            if (container && typeof loadChainEvents === 'function') {
                await loadChainEvents(container, false);
            }
        } else {
            throw new Error(data.message || 'Error al promocionar evento');
        }
        
    } catch (error) {
        console.error('Error promocionando evento:', error);
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

/**
 * ============================================
 * CREAR MODAL DE REPORTE PARA CHAIN EVENTS
 * ============================================
 */
function createReportModalChain(eventId) {
    const modal = document.createElement('div');
    modal.className = 'report-modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 1rem;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, rgb(26, 26, 36) 0%, rgb(37, 37, 50) 100%);
            border-radius: 20px;
            padding: 2rem;
            max-width: 450px;
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: rgba(0, 0, 0, 0.5) 0px 20px 60px;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚨</div>
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; color: var(--text-secondary);">
                    Reportar evento Chain
                </h3>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">
                    📝 Tu reporte será revisado por nuestro equipo
                </p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <p style="margin: 0 0 1rem 0; color: var(--text-secondary); font-weight: 600; font-size: 0.95rem;">
                    Selecciona el motivo del reporte:
                </p>
                
                <div class="report-options">
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReasonChain" value="contenido_inapropiado" checked style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">⚠️ Contenido inapropiado</div>
                            <div style="font-size: 0.8rem; color: #c5c7e5;">Contenido sexual, violento o perturbador</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReasonChain" value="spam" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">📧 Spam</div>
                            <div style="font-size: 0.8rem; color: #c5c7e5;">Contenido repetitivo o irrelevante</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReasonChain" value="acoso" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">😡 Acoso o bullying</div>
                            <div style="font-size: 0.8rem; color: #c5c7e5;">Intimidación o hostigamiento</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReasonChain" value="contenido_violento" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">🔪 Contenido violento</div>
                            <div style="font-size: 0.8rem; color: #c5c7e5;">Violencia gráfica o amenazas</div>
                        </div>
                    </label>
                    
                    <label class="report-option" style="display: flex; align-items: center; padding: 1rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s ease;">
                        <input type="radio" name="reportReasonChain" value="desinformacion" style="margin-right: 1rem; width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: white; margin-bottom: 0.25rem;">❌ Información falsa</div>
                            <div style="font-size: 0.8rem; color: #c5c7e5;">Desinformación o noticias falsas</div>
                        </div>
                    </label>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                <button class="modal-cancel-btn-chain" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    border: none;
                    padding: 0.9rem 1.75rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.95rem;
                ">Cancelar</button>
                <button class="modal-report-btn-chain" style="
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    border: none;
                    padding: 0.9rem 1.75rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.95rem;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                ">🚨 Enviar reporte</button>
            </div>
        </div>
    `;

    // Agregar estilos de hover a las opciones
    const reportOptions = modal.querySelectorAll('.report-option');
    reportOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.style.background = 'rgba(99, 102, 241, 0.1)';
            option.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        });
        option.addEventListener('mouseleave', () => {
            option.style.background = 'rgba(255, 255, 255, 0.03)';
            option.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    });

    // Event listeners
    const cancelBtn = modal.querySelector('.modal-cancel-btn-chain');
    const reportBtn = modal.querySelector('.modal-report-btn-chain');
    const overlay = modal;

    function closeModal() {
        modal.style.opacity = '0';
        const content = modal.querySelector('[style*="transform"]');
        if (content) {
            content.style.transform = 'scale(0.9)';
        }
        setTimeout(() => modal.remove(), 300);
    }

    cancelBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

 reportBtn.addEventListener('click', async () => {
    const selectedReason = modal.querySelector('input[name="reportReasonChain"]:checked');
    if (!selectedReason) {
        if (typeof showNotification === 'function') {
            showNotification('⚠️ Por favor selecciona un motivo', 'error');
        }
        return;
    }

    const motivo = selectedReason.value;
    
    // Deshabilitar botón mientras se envía
    reportBtn.disabled = true;
    const originalText = reportBtn.innerHTML; // ✅ NUEVO: Guardar texto original
    reportBtn.innerHTML = '⏳ Enviando...';
    reportBtn.style.opacity = '0.6';

    try {
        const numericId = parseInt(eventId.replace('chain-', ''));
        
        console.log('⚠️ Reportando evento Chain:', { eventId: numericId, motivo });
        
        const response = await fetch('/php/reportar_contenido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // ✅ NUEVO: Importante para mantener sesión
            body: JSON.stringify({
                tipo: 'event', // ✅ CORREGIDO: Cambiar de 'chain_evento' a 'event'
                id: numericId,
                motivo: motivo
            })
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('📥 Error response:', errorText);
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log('📥 Response data:', data);

        if (data.success) {
            closeModal();
            
            // ✅ NUEVO: Mensaje detallado según resultado
            let mensaje = '✅ Reporte enviado exitosamente';
            
            if (data.email_enviado) {
                mensaje += '. El equipo de moderación ha sido notificado por email.';
                console.log('📧 Email enviado correctamente');
            } else {
                mensaje += ', pero no se pudo enviar el email de notificación.';
                console.warn('⚠️ Reporte guardado pero email falló');
            }
            
            showNotification(mensaje, 'success');
            
            // Ocultar evento después de reportar
            setTimeout(() => {
                const eventCard = document.querySelector(`[data-event-id="${numericId}"]`);
                if (eventCard) {
                    eventCard.style.transition = 'all 0.3s ease';
                    eventCard.style.opacity = '0';
                    eventCard.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        eventCard.style.display = 'none';
                    }, 300);
                }
            }, 1000);
        } else {
            throw new Error(data.message || 'Error al procesar reporte');
        }

    } catch (error) {
        console.error('❌ Error reportando evento Chain:', error);
        
        // ✅ CORREGIDO: Mostrar error REAL, no éxito falso
        let errorMessage = 'Error al enviar el reporte';
        
        if (error.message.includes('401') || error.message.includes('No autorizado')) {
            errorMessage = 'Tu sesión expiró. Recarga la página e intenta de nuevo.';
        } else if (error.message.includes('404')) {
            errorMessage = 'El sistema de reportes no está disponible temporalmente.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Error del servidor. Intenta de nuevo en unos momentos.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        closeModal();
        showNotification('❌ ' + errorMessage, 'error');
        
        // ✅ NUEVO: NO ocultar el evento si falló
        // El usuario debe poder intentar reportar de nuevo
        
        // ✅ NUEVO: Restaurar botón si falla
        reportBtn.disabled = false;
        reportBtn.innerHTML = originalText;
        reportBtn.style.opacity = '1';
    }
});

return modal;
}

// Agregar estilos para el modal de reporte Chain (si no existen ya)
if (!document.getElementById('report-modal-chain-styles')) {
    const styles = document.createElement('style');
    styles.id = 'report-modal-chain-styles';
    styles.textContent = `      
        .modal-cancel-btn-chain:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            transform: translateY(-2px);
        }
        
        .modal-report-btn-chain:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
        }
    `;
    document.head.appendChild(styles);
}

/**
 * ============================================
 * EXPONER FUNCIONES GLOBALMENTE (ACTUALIZADO)
 * ============================================
 */
window.toggleChainMenu = toggleChainMenu;
window.promoteChainEvent = promoteChainEvent;
window.toggleChainPrivacy = toggleChainPrivacy;
window.deleteChainEvent = deleteChainEvent;
window.hideChainEvent = hideChainEvent;        // ✅ NUEVO
window.reportChainEvent = reportChainEvent;    // ✅ NUEVO

console.log('✅ Sistema de menú para eventos Chain cargado');
console.log('✅ Sistema de eventos Chain completamente cargado');

/**
 * ============================================
 * PROMOCIONAR EVENTO CHAIN
 * ============================================
 */
async function promoteChainEvent(eventId) {
    try {
        const numericId = parseInt(eventId.replace('chain-', ''));
        
        console.log('📢 Promocionando evento Chain:', numericId);
        
        // ✅ CERRAR MODAL CORRECTAMENTE (no usar toggleChainMenu)
        if (window.MenuModalesChain && typeof window.MenuModalesChain.cerrar === 'function') {
            window.MenuModalesChain.cerrar();
        }
        
        // Buscar el elemento del evento
        const eventElement = document.querySelector(`[data-event-id="${numericId}"]`);
        
        if (!eventElement) {
            throw new Error('No se encontró el elemento del evento');
        }
        
        // Usar el sistema de promoción global si existe
        if (typeof window.openPromotionModal === 'function') {
            console.log('✅ Usando sistema de promoción global');
            window.openPromotionModal('event', numericId, eventElement);
        } else {
            // Fallback: mostrar mensaje para implementar sistema de promoción
            const confirmar = confirm('📢 ¿Deseas promocionar este evento?\n\nTu evento aparecerá destacado en el feed de Chain.');
            
            if (!confirmar) return;
            
            showNotification('⏳ Procesando promoción...', 'info');
            
            // Llamar directamente al endpoint
            const response = await fetch('/php/promover_contenido.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    content_type: 'event',
                    content_id: numericId,
                    promotion_type: 'daily' // Plan por defecto
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('✅ Evento promocionado exitosamente', 'success');
                
                // Recargar eventos Chain
                const container = document.getElementById('chain-events-container');
                if (container && typeof loadChainEvents === 'function') {
                    await loadChainEvents(container, false);
                }
            } else {
                throw new Error(data.message || 'Error al promocionar evento');
            }
        }
        
    } catch (error) {
        console.error('Error promocionando evento:', error);
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

// Exponer globalmente
window.promoteChainEvent = promoteChainEvent;

/**
 * Generar iniciales para avatar
 */
function generateAvatarInitials(username) {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
}

/**
 * Ir al perfil del usuario
 */
function goToUserProfile(username) {
    if (username && username !== 'usuario') {
        // Cambiar de /perfil/username a /perfil?user=username
        window.location.href = `/perfil?user=${username}`;
    }
}

// ============================================
// ESTILOS PERSONALIZADOS PARA AUDIO PLAYERS
// ============================================
setTimeout(function() {
    const audioStyles = document.createElement('style');
    audioStyles.textContent = `
        audio::-webkit-media-controls-panel {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(236, 72, 153, 0.4)) !important;
        }
    `;
    document.head.appendChild(audioStyles);
    console.log('✅ Estilo de audio aplicado');
}, 500);

// ============================================
// INTERCEPTOR DE AVATARES CHAIN - PRIORIDAD MÁXIMA
// ============================================
(function() {
    'use strict';
    
    document.addEventListener('click', function(e) {
        // Buscar avatar de Chain específicamente
        const chainAvatar = e.target.closest('.chain-avatar-wrapper');
        
        if (chainAvatar) {
            const username = chainAvatar.dataset.chainUser;
            
            if (username) {
                // Bloquear TODOS los otros handlers
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                
                console.log('⛓️ Redirigiendo a Chain de:', username);
                
                // Forzar redirección
                window.location.assign('/flash?user=' + username);
                
                return false;
            }
        }
    }, true); // Fase de captura
    
    console.log('✅ Interceptor de avatares Chain con prioridad máxima activado');
})();

// Exponer globalmente
window.generateAvatarInitials = generateAvatarInitials;
window.goToUserProfile = goToUserProfile;