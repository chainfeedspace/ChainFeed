/**
 * ============================================
 * SISTEMA DE NOTIFICACIONES - HELPER
 * Archivo: /js/notificaciones-helper.js
 * ============================================
 * 
 * Funciones simplificadas para disparar notificaciones
 * desde cualquier parte de la aplicación
 * 
 * NOTA: Las notificaciones de retiros, depósitos, compras y ventas
 * se gestionan automáticamente desde el backend PHP.
 */

const NotificacionesHelper = {
    
    /**
     * Función base para crear notificaciones
     * @private
     */
    async _crearNotificacion(data) {
        try {
            const response = await fetch('/php/crear_notificacion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (!result.success) {
                console.error('Error creando notificación:', result.message);
            }
            
            return result;
            
        } catch (error) {
            console.error('Error en solicitud de notificación:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Notificar LIKE en publicación o comentario
     * @param {number} publicacionId - ID de la publicación
     * @param {number} usuarioId - ID del dueño de la publicación/comentario
     * @param {number|null} comentarioId - ID del comentario (null si es publicación)
     */
    async notificarLike(publicacionId, usuarioId, comentarioId = null) {
        const data = {
            usuario_id: usuarioId,
            tipo: 'like',
            publicacion_id: publicacionId
        };
        
        if (comentarioId) {
            data.comentario_id = comentarioId;
        }
        
        return await this._crearNotificacion(data);
    },

    /**
     * Notificar COMENTARIO en publicación
     * @param {number} publicacionId - ID de la publicación
     * @param {number} usuarioId - ID del dueño de la publicación
     * @param {number} comentarioId - ID del comentario creado
     * @param {string} contenidoComentario - Texto del comentario (opcional)
     */
    async notificarComentario(publicacionId, usuarioId, comentarioId, contenidoComentario = null) {
        const data = {
            usuario_id: usuarioId,
            tipo: 'comment',
            publicacion_id: publicacionId,
            comentario_id: comentarioId
        };
        
        if (contenidoComentario) {
            const preview = contenidoComentario.length > 50 
                ? contenidoComentario.substring(0, 50) + '...' 
                : contenidoComentario;
            data.contenido = `comentó: "${preview}"`;
        }
        
        return await this._crearNotificacion(data);
    },

    /**
     * Notificar SEGUIMIENTO
     * @param {number} usuarioId - ID del usuario al que se está siguiendo
     */
    async notificarFollow(usuarioId) {
        return await this._crearNotificacion({
            usuario_id: usuarioId,
            tipo: 'follow'
        });
    },

    /**
     * Notificar REPOST
     * @param {number} publicacionId - ID de la publicación
     * @param {number} usuarioId - ID del dueño de la publicación
     */
    async notificarRepost(publicacionId, usuarioId) {
        return await this._crearNotificacion({
            usuario_id: usuarioId,
            tipo: 'repost',
            publicacion_id: publicacionId
        });
    },

    /**
     * Notificar TIP (propina en tokens)
     * @param {number} usuarioId - ID del usuario que recibe los tokens
     * @param {number} cantidad - Cantidad de tokens enviados
     */
    async notificarTip(usuarioId, cantidad) {
        return await this._crearNotificacion({
            usuario_id: usuarioId,
            tipo: 'tip',
            contenido: `te envió ${cantidad} CFT`
        });
    },

    /**
     * Notificar MENCIÓN en comentario
     * @param {number} usuarioId - ID del usuario mencionado
     * @param {number} publicacionId - ID de la publicación
     * @param {number} comentarioId - ID del comentario con la mención
     */
    async notificarMencion(usuarioId, publicacionId, comentarioId) {
        return await this._crearNotificacion({
            usuario_id: usuarioId,
            tipo: 'mention',
            publicacion_id: publicacionId,
            comentario_id: comentarioId
        });
    },

    /**
     * Notificación del SISTEMA
     * @param {number} usuarioId - ID del usuario destinatario
     * @param {string} contenido - Mensaje de la notificación
     */
    async notificarSistema(usuarioId, contenido) {
        return await this._crearNotificacion({
            usuario_id: usuarioId,
            tipo: 'system',
            contenido: contenido
        });
    },

    /**
     * Procesar menciones en un texto y crear notificaciones
     * @param {string} texto - Texto que puede contener menciones (@username)
     * @param {number} publicacionId - ID de la publicación
     * @param {number} comentarioId - ID del comentario (si aplica)
     */
    async procesarMenciones(texto, publicacionId, comentarioId = null) {
        const mencionesRegex = /@(\w+)/g;
        const menciones = texto.match(mencionesRegex);
        
        if (!menciones || menciones.length === 0) {
            return { success: true, menciones_procesadas: 0 };
        }
        
        const usernames = [...new Set(menciones.map(m => m.substring(1)))];
        
        try {
            const response = await fetch('/php/obtener_usuarios_por_username.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usernames })
            });
            
            const data = await response.json();
            
            if (data.success && data.usuarios) {
                const notificaciones = data.usuarios.map(usuario => 
                    this.notificarMencion(usuario.id, publicacionId, comentarioId)
                );
                
                await Promise.all(notificaciones);
                
                return { 
                    success: true, 
                    menciones_procesadas: notificaciones.length 
                };
            }
            
        } catch (error) {
            console.error('Error procesando menciones:', error);
        }
        
        return { success: false, menciones_procesadas: 0 };
    }
};

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.NotificacionesHelper = NotificacionesHelper;
}

// Export para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificacionesHelper;
}

console.log('✅ Sistema de notificaciones cargado');