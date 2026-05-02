/**
 * ============================================
 * ADAPTADOR PARA INICIO.HTML
 * ============================================
 * 
 * Adapta los datos de obtener_participaciones.php
 * para que funcionen con apro-recha-visua-perfil.js
 * cuando se abre el modal desde inicio.html
 */

(function() {
    console.log('🔧 Adaptador de participaciones para inicio.html cargado');
    
    // Esperar a que renderCampaignParticipations esté disponible
    let attempts = 0;
    const maxAttempts = 50;
    
    const interceptor = setInterval(() => {
        attempts++;
        
        if (typeof window.renderCampaignParticipations === 'function') {
            clearInterval(interceptor);
            
            console.log('✅ renderCampaignParticipations encontrada en intento', attempts);
            
            const originalRender = window.renderCampaignParticipations;
            
            window.renderCampaignParticipations = function(data, content) {
                console.log('📦 Datos recibidos en modal:', data);
                
                // ✅ VERIFICAR SI NECESITA ADAPTACIÓN
                const needsAdaptation = !data.creador && data.evento?.creado_por;
                
                if (needsAdaptation) {
                    console.log('🔄 Adaptando datos para sistema de filtrado...');
                    
                    // Adaptar estructura de datos
                    const adaptedData = {
                        ...data,
                        
                        // ✅ Crear objeto creador desde evento
                        creador: {
                            id: data.evento.creado_por,
                            username: data.evento.creador_username || 'usuario',
                            display_name: data.evento.creador_display_name || 'Usuario'
                        },
                        
                        // ✅ Asegurar que evento tenga todos los campos
                        evento: {
                            ...data.evento,
                            winners_count: data.evento.winners_count || 0,
                            creado_por: data.evento.creado_por
                        },
                        
                        // ✅ Normalizar participaciones
                        participaciones: (data.participaciones || []).map(p => ({
                            ...p,
                            id: parseInt(p.id),
                            usuario_id: p.usuario_id || p.author?.id,
                            status: p.status || 'pending',
                            author: p.author || {
                                id: p.userId,
                                username: p.userId
                            }
                        }))
                    };
                    
                    console.log('✨ Datos adaptados:', {
                        tieneCreador: !!adaptedData.creador,
                        creadorId: adaptedData.creador?.id,
                        winnersCount: adaptedData.evento?.winners_count,
                        participaciones: adaptedData.participaciones?.length
                    });
                    
                    // Llamar función original con datos adaptados
                    originalRender.call(this, adaptedData, content);
                } else {
                    console.log('✅ Datos ya tienen el formato correcto');
                    // Llamar función original sin modificaciones
                    originalRender.call(this, data, content);
                }
            };
            
            console.log('✅ Adaptador instalado correctamente');
        }
        
        if (attempts >= maxAttempts) {
            clearInterval(interceptor);
            console.error('❌ No se pudo interceptar renderCampaignParticipations');
        }
    }, 100);
})();