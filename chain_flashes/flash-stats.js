/**
 * CHAIN FLASH STATS
 * Sistema de estadísticas en tiempo real para Flashes
 * Actualización automática de vistas, tokens ganados, reacciones, etc.
 */

class ChainFlashStats {
    constructor() {
        this.updateInterval = null;
        this.isUpdating = false;
        this.UPDATE_FREQUENCY = 5000; // 5 segundos
    }

    async getFlashStats(flashId) {
        try {
            const response = await fetch(`/php/chain_flashes/obtener_estadisticas_flash.php?flash_id=${flashId}`);
            const data = await response.json();

            if (data.success) {
                return data.estadisticas;
            }

            return null;
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return null;
        }
    }

    async getUserFlashsStats(userId) {
        try {
            const response = await fetch(`/php/chain_flashes/obtener_flashes_usuario.php?user_id=${userId}`);
            const data = await response.json();

            if (data.success) {
                // Calcular totales
                let totalVistas = 0;
                let totalTokens = 0;
                let totalReacciones = 0;

                data.flashes.forEach(flash => {
                    totalVistas += parseInt(flash.vistas || 0);
                    totalTokens += parseFloat(flash.tokens_totales || 0);
                    totalReacciones += parseInt(flash.total_reacciones || 0);
                });

                return {
                    total_flashes: data.total,
                    total_vistas: totalVistas,
                    total_tokens: totalTokens,
                    total_reacciones: totalReacciones,
                    flashes: data.flashes
                };
            }

            return null;
        } catch (error) {
            console.error('Error obteniendo estadísticas de usuario:', error);
            return null;
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatTokens(amount) {
        return amount >= 1 ? amount.toFixed(1) : amount.toFixed(2);
    }

    calculateViralityScore(flash) {
        // Score basado en vistas, reacciones y tokens
        const vistas = parseInt(flash.vistas || 0);
        const reacciones = parseInt(flash.total_reacciones || 0);
        const tokens = parseFloat(flash.tokens_totales || 0);

        // Fórmula de viralidad
        const score = (vistas * 1) + (reacciones * 10) + (tokens * 5);

        return Math.round(score);
    }

    getViralityLevel(score) {
        if (score >= 1000) return { nivel: '🔥 VIRAL', color: '#ef4444' };
        if (score >= 500) return { nivel: '⚡ Popular', color: '#f59e0b' };
        if (score >= 100) return { nivel: '📈 Creciendo', color: '#10b981' };
        return { nivel: '🌱 Nuevo', color: '#6366f1' };
    }

    async getTrendingFlashes() {
        try {
            const response = await fetch('/php/chain_flashes/obtener_flashes.php');
            const data = await response.json();

            if (data.success) {
                // Ordenar por score de viralidad
                const flashesConScore = data.flashes.map(flash => ({
                    ...flash,
                    viralityScore: this.calculateViralityScore(flash)
                }));

                flashesConScore.sort((a, b) => b.viralityScore - a.viralityScore);

                return flashesConScore.slice(0, 10); // Top 10
            }

            return [];
        } catch (error) {
            console.error('Error obteniendo trending:', error);
            return [];
        }
    }

    startAutoUpdate(flashId, callback) {
        if (this.updateInterval) {
            this.stopAutoUpdate();
        }

        this.updateInterval = setInterval(async () => {
            if (this.isUpdating) return;

            this.isUpdating = true;

            try {
                const stats = await this.getFlashStats(flashId);
                if (stats && typeof callback === 'function') {
                    callback(stats);
                }
            } catch (error) {
                console.error('Error en auto-update:', error);
            } finally {
                this.isUpdating = false;
            }
        }, this.UPDATE_FREQUENCY);
    }

    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.isUpdating = false;
    }

    // Método para renderizar badge de estadísticas
    renderStatsBadge(flash) {
        const tokensTotal = parseFloat(flash.tokens_ganados_vistas || 0) + 
                           parseFloat(flash.tokens_ganados_reacciones || 0);

        return `
            <div class="flash-stats-mini-badge">
                <div class="stat-mini">
                    <span>👁️</span>
                    <span>${this.formatNumber(flash.vistas || 0)}</span>
                </div>
                <div class="stat-mini">
                    <span>💰</span>
                    <span>${this.formatTokens(tokensTotal)} CFT</span>
                </div>
            </div>
        `;
    }

    // Método para renderizar gráfico de progreso de tokens
    renderTokenProgress(flash, limite = 100) {
        const tokensTotal = parseFloat(flash.tokens_ganados_vistas || 0) + 
                           parseFloat(flash.tokens_ganados_reacciones || 0);
        
        const percentage = Math.min((tokensTotal / limite) * 100, 100);

        return `
            <div class="flash-token-progress">
                <div class="progress-info">
                    <span>${this.formatTokens(tokensTotal)} CFT</span>
                    <span>${this.formatTokens(limite)} CFT</span>
                </div>
                <div class="progress-bar-flash">
                    <div class="progress-fill-flash" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }

    // Calcular tiempo restante para expiración
    getTimeRemaining(expiraAt, esAnclado) {
        if (esAnclado) {
            return { texto: 'Permanente', segundos: null };
        }

        try {
            const now = new Date();
            const expira = new Date(expiraAt);
            const diffMs = expira - now;

            if (diffMs <= 0) {
                return { texto: 'Expirado', segundos: 0 };
            }

            const diffSeconds = Math.floor(diffMs / 1000);
            const horas = Math.floor(diffSeconds / 3600);
            const minutos = Math.floor((diffSeconds % 3600) / 60);

            return {
                texto: `${horas}h ${minutos}m`,
                segundos: diffSeconds
            };
        } catch (error) {
            return { texto: 'Error', segundos: null };
        }
    }

    // Renderizar countdown
    renderCountdown(expiraAt, esAnclado) {
        const remaining = this.getTimeRemaining(expiraAt, esAnclado);

        if (esAnclado) {
            return `<div class="flash-countdown permanent">⛓️ Permanente</div>`;
        }

        if (remaining.segundos === 0) {
            return `<div class="flash-countdown expired">⏰ Expirado</div>`;
        }

        return `<div class="flash-countdown active">⏰ ${remaining.texto}</div>`;
    }
    
async getFlashReactions(flashId) {
        try {
            const response = await fetch(`/php/chain_flashes/obtener_reacciones_flash.php?flash_id=${flashId}`);
            const data = await response.json();

            if (data.success) {
                return data.reacciones || [];
            }

            return [];
        } catch (error) {
            console.error('Error obteniendo reacciones:', error);
            return [];
        }
    }

    // Método para renderizar lista de reacciones (para el creador)
    renderReactionsList(reacciones) {
        if (!reacciones || reacciones.length === 0) {
            return '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Aún no hay reacciones</p>';
        }

        let html = '<h4 style="margin-bottom: 1rem; color: var(--primary);">💎 Reacciones recibidas</h4>';
        
        reacciones.forEach(reaccion => {
            const initials = this.generateInitials(reaccion.username);
            const timeAgo = this.formatTimeAgo(reaccion.created_at);
            
            html += `
                <div class="reaction-user-item">
                    <div class="reaction-user-avatar">${initials}</div>
                    <div class="reaction-user-info">
                        <div class="reaction-user-name">${reaccion.display_name || reaccion.username}</div>
                        <div class="reaction-user-time">${timeAgo}</div>
                    </div>
                    <div class="reaction-emoji">${reaccion.emoji}</div>
                </div>
            `;
        });

        return html;
    }

    generateInitials(username) {
        if (!username) return 'U';
        return username.substring(0, 2).toUpperCase();
    }

    formatTimeAgo(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMinutes = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMinutes < 1) return 'Ahora';
            if (diffMinutes < 60) return `${diffMinutes}m`;
            if (diffHours < 24) return `${diffHours}h`;
            return `${diffDays}d`;
        } catch (error) {
            return '';
        }
    }
}  // ← MANTENER ESTE CIERRE DE CLASE

// Instancia global
window.flashStats = new ChainFlashStats();

console.log('✅ flash-stats.js cargado');