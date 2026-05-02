/**
 * SISTEMA DE MENÚ DE TRES PUNTOS PARA EVENTOS CHAIN
 * Este archivo extiende la funcionalidad de chain-events.js
 * Cargar DESPUÉS de chain-events.js
 */

console.log('🔧 Cargando sistema de menú para eventos chain...');

// ============================================
// SOBRESCRIBIR renderChainEventCard CON MENÚ COMPLETO
// ============================================

window.renderChainEventCard = function(evento) {
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
    const isPromoted = evento.is_promoted === true || evento.is_promoted === 1 || evento.is_promoted === "1";
    
    // ✅ VERIFICAR SI ES PÚBLICO
// ✅ VERIFICAR SI ES PÚBLICO - VERSIÓN CORREGIDA
const isPublic = (
    evento.es_publica === true || 
    evento.es_publica === 1 || 
    evento.es_publica === "1"
);

// Si es_publica es null o undefined, por defecto es público
const isPublicFinal = evento.es_publica === null || evento.es_publica === undefined ? true : isPublic;

console.log('🔍 Estado de privacidad:', {
    eventoId: evento.id,
    es_publica_raw: evento.es_publica,
    es_publica_type: typeof evento.es_publica,
    isPublic: isPublic,
    isPublicFinal: isPublicFinal
});    
    // ============================================
    // GENERAR MENÚ COMPLETO CON POSICIONAMIENTO ABSOLUTO
    // ============================================
    let menuHTML = `
        <div class="chain-menu-container" style="position: absolute; top: 1rem; right: 1rem; z-index: 100;">
            <button class="chain-menu-btn" onclick="event.stopPropagation(); toggleChainMenu('${eventId}')" 
                    title="Más opciones"
                    style="
                        background: rgba(0, 0, 0, 0.6);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        color: white;
                        cursor: pointer;
                        padding: 0.5rem;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                        outline: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 36px;
                        height: 36px;
                    "
                    onmouseover="this.style.background='rgba(0, 0, 0, 0.8)'; this.style.transform='scale(1.1)'"
                    onmouseout="this.style.background='rgba(0, 0, 0, 0.6)'; this.style.transform='scale(1)'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                </svg>
            </button>
            
           <div class="chain-dropdown hidden" id="chainDropdown-${eventId}"
     style="
         position: absolute;
         top: 40px; 
         right: 10px;  
         left: auto;
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
                    <span>Promocionar evento</span>
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
        <div class="content-card chain-event-card" data-event-id="${evento.id}" style="
            background: rgba(26, 26, 36, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            overflow: visible;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
        ">
            ${menuHTML}
            
            ${evento.media_url ? `
<div class="card-media" ${evento.media_silenciado ? 'data-silenciado="true"' : ''} style="width: 100%; height: 200px; position: relative; overflow: hidden;">
    ${evento.media_type === 'video' ? `
        <video 
            class="card-video" 
            src="${evento.media_url}" 
            ${evento.media_silenciado ? 'muted' : ''} 
            style="width: 100%; height: 100%; object-fit: cover; pointer-events: auto; opacity: 1;"
            onloadeddata="this.style.opacity = '1'"
            data-chain-video-managed="true"
        ></video>
        ${evento.media_silenciado ? '<span style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.7); color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem;">🔇</span>' : ''}
    ` : ''}
</div>
            ` : ''}
            
            <div class="card-content" style="padding: 1.5rem;">
                <div class="chain-event-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span class="event-type-badge" style="
                        background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #ec4899));
                        color: white;
                        padding: 0.4rem 0.8rem;
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
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, var(--text, #fff), var(--primary, #6366f1));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">${escapeHtml(evento.titulo)}</h3>
                <p class="chain-event-description" style="
                    color: var(--text-secondary, #a0a0b8);
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
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
          style="color: var(--primary); font-size: 0.9rem; cursor: pointer; text-decoration: underline;" 
          onclick="viewEventSubmissions('chain-${evento.id}')"
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
      onclick="event.stopPropagation(); shareChainEvent(event, ${evento.id})"
      onmouseover="this.style.background='rgba(99, 102, 241, 0.1)'; this.style.color='var(--primary)'"
      onmouseout="this.style.background='transparent'; this.style.color='var(--text-secondary)'">
    📤 Compartir
</span>
</div>
            </div>
        </div>
    `;
};

console.log('✅ renderChainEventCard actualizada con menú completo');

// ============================================
// FUNCIÓN MEJORADA PARA TOGGLE DEL MENÚ
// ============================================

window.toggleChainMenu = function(eventId) {
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
};
// ============================================
// CERRAR MENÚS AL HACER CLIC FUERA
// ============================================

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

// ============================================
// CERRAR MENÚS AL HACER SCROLL
// ============================================

let chainScrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(chainScrollTimeout);
    chainScrollTimeout = setTimeout(() => {
        document.querySelectorAll('.chain-dropdown').forEach(dropdown => {
            dropdown.classList.add('hidden');
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        });
    }, 150);
}, { passive: true });

// ============================================
// ESTILOS CSS MEJORADOS
// ============================================

const chainMenuStyles = document.createElement('style');
chainMenuStyles.id = 'chain-menu-styles';
chainMenuStyles.textContent = `
    /* Asegurar que el menú se posicione correctamente en eventos chain */
    .chain-event-card {
        position: relative !important;
        overflow: visible !important;
    }
    
    .chain-event-card .chain-menu-container {
        position: absolute !important;
        top: 1rem !important;
        right: 1rem !important;
        z-index: 100 !important;
    }
    
    /* FORZAR posición del dropdown */
    .chain-dropdown:not(.hidden) {
        position: absolute !important;
        top: 40px !important;
        right: 10px !important;
        left: auto !important;
    }
    
    /* Estilos del dropdown */
    .chain-dropdown {
        background: rgba(26, 26, 36, 0.98) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 12px !important;
        padding: 0.5rem 0 !important;
        min-width: 220px !important;
        box-shadow: rgba(0, 0, 0, 0.6) 0px 10px 40px !important;
        z-index: 999999 !important;
        transition: opacity 0.3s ease, visibility 0.3s ease !important;
    }
    
    /* Estado oculto */
    .chain-dropdown.hidden {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
    
    /* Estado visible */
    .chain-dropdown:not(.hidden) {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
    }
    
    /* Hover effects */
    .chain-event-card:hover {
        border-color: rgba(99, 102, 241, 0.3);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    /* Asegurar visibilidad del botón */
    .chain-menu-btn {
        position: relative;
        z-index: 101 !important;
    }
`;

// Solo agregar estilos si no existen
if (!document.getElementById('chain-menu-styles')) {
    document.head.appendChild(chainMenuStyles);
    console.log('✅ Estilos CSS inyectados');
}

console.log('✅ Sistema de menú para eventos chain cargado correctamente');