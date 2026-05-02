// p2p-chart.js - Gráfico de precios del mercado P2P con soporte i18n y temas

let marketChart = null;
let currentPeriod = '7d';
let currentMonedaFilter = '';

// ==========================================
// FUNCIÓN HELPER PARA TRADUCCIÓN
// ==========================================
function t(text) {
    // Usar el sistema de traducción si está disponible
    if (window.translationSystem && typeof window.translationSystem.translate === 'function') {
        const lang = window.getLanguage ? window.getLanguage() : 'es';
        if (lang !== 'es') {
            return window.translationSystem.translate(text, lang);
        }
    }
    return text;
}

/**
 * Traducir el filtro de moneda
 */
function translateMoneda(moneda) {
    if (!moneda) return '';
    
    const lang = window.getLanguage ? window.getLanguage() : 'es';
    if (lang === 'es') return moneda;
    
    // Mapa de traducciones para monedas/filtros
    const monedaMap = {
        'TODAS': 'ALL',
        'Todas': 'All',
        'todas': 'all'
    };
    
    return monedaMap[moneda] || moneda;
}

// ==========================================
// 🎨 INTEGRACIÓN CON SISTEMA DE TEMAS
// ==========================================

/**
 * Obtener colores según el tema actual
 */
function getChartColors() {
    const theme = document.body.getAttribute('data-theme') || 'dark';
    
    if (theme === 'light') {
        return {
            // Textos
            textPrimary: '#3a149b',      // Morado oscuro para texto principal
            textSecondary: '#5c478b',    // Morado medio para texto secundario
            
            // Grid y bordes
            gridColor: 'rgba(80, 80, 120, 0.2)',
            borderColor: 'rgba(80, 80, 120, 0.25)',
            
            // Colores de líneas (mantener igual para consistencia)
            lineUSDT: '#26a69a',
            lineUSDC: '#2196F3',
            lineDefault: '#6366f1',
            linePromedio: '#fbbf24',
            
            // Background del tooltip
            tooltipBg: 'rgba(240, 240, 235, 0.98)',
            tooltipText: '#3a149b',
            tooltipBorder: '#6366f1'
        };
    } else {
        return {
            // Textos
            textPrimary: '#ffffff',
            textSecondary: '#a0a0b8',
            
            // Grid y bordes
            gridColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            
            // Colores de líneas
            lineUSDT: '#26a69a',
            lineUSDC: '#2196F3',
            lineDefault: '#6366f1',
            linePromedio: '#fbbf24',
            
            // Background del tooltip
            tooltipBg: 'rgba(15, 15, 20, 0.95)',
            tooltipText: '#ffffff',
            tooltipBorder: '#6366f1'
        };
    }
}

/**
 * Actualizar colores del gráfico según el tema
 */
function actualizarColoresGrafico() {
    if (!marketChart) return;
    
    const colors = getChartColors();
    
    // Actualizar colores de escala Y
    if (marketChart.options.scales.y) {
        marketChart.options.scales.y.title.color = colors.textPrimary;
        marketChart.options.scales.y.ticks.color = colors.textSecondary;
        marketChart.options.scales.y.grid.color = colors.gridColor;
    }
    
    // Actualizar colores de escala X
    if (marketChart.options.scales.x) {
        marketChart.options.scales.x.ticks.color = colors.textSecondary;
        marketChart.options.scales.x.grid.color = colors.gridColor;
    }
    
    // Actualizar tooltip
    if (marketChart.options.plugins.tooltip) {
        marketChart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
        marketChart.options.plugins.tooltip.titleColor = colors.tooltipText;
        marketChart.options.plugins.tooltip.bodyColor = colors.tooltipText;
    }
    
    // Actualizar leyenda
    if (marketChart.options.plugins.legend) {
        marketChart.options.plugins.legend.labels.color = colors.textPrimary;
    }
    
    marketChart.update('none'); // Sin animación
    
    console.log('📊 Colores del gráfico P2P actualizados para tema:', 
                document.body.getAttribute('data-theme'));
}

/**
 * Calcular promedio móvil simple
 */
function calcularPromedioMovil(data, window = 3) {
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
        if (i < window - 1) {
            const slice = data.slice(0, i + 1);
            result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
        } else {
            const slice = data.slice(i - window + 1, i + 1);
            result.push(slice.reduce((a, b) => a + b, 0) / window);
        }
    }
    
    return result;
}

/**
 * Inicializar gráfico de mercado
 */
async function initMarketChart() {
    try {
        await updateMarketChart();
    } catch (error) {
        console.error('Error inicializando gráfico:', error);
    }
}

/**
 * Actualizar gráfico con datos del servidor
 */
async function updateMarketChart() {
    try {
        const moneda = document.getElementById('chartMoneda')?.value || '';
        currentMonedaFilter = moneda;
        
        const response = await fetch(
            `/php/market/obtener_precios_p2p.php?periodo=${currentPeriod}&moneda=${moneda}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Error obteniendo datos');
        }
        
        updateChartStats(result.estadisticas, result.moneda_filtro);
        renderMarketChart(result.data, result.moneda_filtro);
        
    } catch (error) {
        console.error('Error actualizando gráfico:', error);
        showEmptyChart();
    }
}

/**
 * Actualizar estadísticas del gráfico
 */
function updateChartStats(stats, monedaFiltro) {
    // Traducir "TODAS" a "ALL" si estamos en inglés
    const monedaTraducida = translateMoneda(monedaFiltro);
    const monedaSuffix = (monedaFiltro === 'TODAS' || monedaFiltro === 'ALL') ? '' : ` ${monedaTraducida}`;
    
    document.getElementById('chartPrecioActual').textContent = 
        stats.precio_actual > 0 ? `${stats.precio_actual.toFixed(6)}${monedaSuffix}` : '-';
    
    const variacionElement = document.getElementById('chartVariacion');
    if (stats.variacion_porcentaje !== 0) {
        const signo = stats.variacion_porcentaje > 0 ? '+' : '';
        variacionElement.textContent = `${signo}${stats.variacion_porcentaje.toFixed(2)}%`;
        variacionElement.classList.remove('positive', 'negative');
        variacionElement.classList.add(stats.variacion_porcentaje > 0 ? 'positive' : 'negative');
    } else {
        variacionElement.textContent = '-';
        variacionElement.classList.remove('positive', 'negative');
    }
    
    document.getElementById('chartMinimo').textContent = 
        stats.precio_minimo > 0 ? `${stats.precio_minimo.toFixed(6)}${monedaSuffix}` : '-';
    
    document.getElementById('chartMaximo').textContent = 
        stats.precio_maximo > 0 ? `${stats.precio_maximo.toFixed(6)}${monedaSuffix}` : '-';
    
    document.getElementById('chartPromedio').textContent = 
        stats.precio_promedio > 0 ? `${stats.precio_promedio.toFixed(6)}${monedaSuffix}` : '-';
}

/**
 * Formatear fecha según idioma
 */
function formatDate(fecha, format = 'full') {
    const lang = window.getLanguage ? window.getLanguage() : 'es';
    const locale = lang === 'en' ? 'en-US' : 'es-ES';
    
    if (format === 'time') {
        return fecha.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    } else if (format === 'short') {
        return fecha.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
    } else {
        return fecha.toLocaleString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

/**
 * Renderizar gráfico con Chart.js
 */
function renderMarketChart(data, monedaFiltro) {
    const ctx = document.getElementById('marketPriceChart');
    
    if (!ctx) {
        console.error('Canvas del gráfico no encontrado');
        return;
    }
    
    if (marketChart) {
        marketChart.destroy();
    }
    
    if (!data || data.length === 0) {
        showEmptyChart();
        return;
    }
    
    // 🎨 Obtener colores del tema actual
    const colors = getChartColors();
    
    // Preparar labels con formato según idioma
    const labels = data.map(point => {
        const fecha = new Date(point.timestamp * 1000);
        if (currentPeriod === '24h') {
            return formatDate(fecha, 'time');
        } else {
            return formatDate(fecha, 'short');
        }
    });
    
    const precios = data.map(point => point.precio);
    const promedioMovil = calcularPromedioMovil(precios, 3);
    
    // Determinar color de línea según moneda
    const lineColor = monedaFiltro === 'USDT' ? colors.lineUSDT : 
                      monedaFiltro === 'USDC' ? colors.lineUSDC : 
                      colors.lineDefault;
    
    // Traducir moneda para mostrar en labels
    const monedaTraducida = translateMoneda(monedaFiltro);
    
    // Labels traducidos
    const labelPrecio = t('Precio CFT') + ` (${monedaTraducida})`;
    const labelPromedio = t('Promedio Móvil') + ' (3 tx)';
    
    marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: labelPrecio,
                    data: precios,
                    borderColor: lineColor,
                    backgroundColor: `${lineColor}20`,
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBackgroundColor: lineColor,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHitRadius: 15,
                    order: 2
                },
                {
                    label: labelPromedio,
                    data: promedioMovil,
                    borderColor: colors.linePromedio,
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointBackgroundColor: colors.linePromedio,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: colors.textPrimary, // 🎨 Color dinámico
                        font: { size: 12 },
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: colors.tooltipBg, // 🎨 Color dinámico
                    titleColor: colors.tooltipText,    // 🎨 Color dinámico
                    bodyColor: colors.tooltipText,     // 🎨 Color dinámico
                    borderColor: lineColor,
                    borderWidth: 2,
                    cornerRadius: 12,
                    padding: 15,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            const punto = data[index];
                            const fecha = new Date(punto.timestamp * 1000);
                            return formatDate(fecha, 'full');
                        },
                        label: function(context) {
                            const monedaLabel = translateMoneda(monedaFiltro);
                            if (context.datasetIndex === 0) {
                                return `${t('Precio')}: ${context.parsed.y.toFixed(6)} ${monedaLabel}`;
                            } else {
                                return `${t('Promedio móvil')}: ${context.parsed.y.toFixed(6)} ${monedaLabel}`;
                            }
                        },
                        afterLabel: function(context) {
                            if (context.datasetIndex === 0) {
                                const index = context.dataIndex;
                                const punto = data[index];
                                
                                const volumenFormateado = punto.volumen.toFixed(2);
                                
                                let cantidadFormateada;
                                if (punto.cantidad_aprox >= 100) {
                                    cantidadFormateada = `~${punto.cantidad_aprox.toLocaleString()} CFT`;
                                } else {
                                    cantidadFormateada = `${punto.cantidad_aprox.toFixed(2)} CFT`;
                                }
                                
                                return [
                                    `${t('Moneda')}: ${punto.moneda}`,
                                    `${t('Volumen')}: ${volumenFormateado} USD`,
                                    `${t('Cantidad')}: ${cantidadFormateada}`
                                ];
                            }
                            return null;
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: true, speed: 0.1 },
                        pinch: { enabled: true },
                        mode: 'x'
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
                        modifierKey: null
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: colors.gridColor, // 🎨 Color dinámico
                        lineWidth: 1
                    },
                    ticks: {
                        color: colors.textSecondary, // 🎨 Color dinámico
                        font: { size: 11 },
                        maxTicksLimit: 12
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: `${t('Precio')} (${translateMoneda(monedaFiltro)})`,
                        color: colors.textPrimary, // 🎨 Color dinámico
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: {
                        color: colors.gridColor, // 🎨 Color dinámico
                        lineWidth: 1
                    },
                    ticks: {
                        color: colors.textSecondary, // 🎨 Color dinámico
                        font: { size: 12 },
                        callback: function(value) {
                            return value.toFixed(6);
                        }
                    }
                }
            }
        },
        plugins: [ChartZoom]
    });
    
    // 🎨 Aplicar colores del tema actual después de crear el gráfico
    setTimeout(() => {
        actualizarColoresGrafico();
    }, 50);
}

/**
 * Mostrar gráfico vacío
 */
function showEmptyChart() {
    const ctx = document.getElementById('marketPriceChart');
    
    if (!ctx) return;
    
    if (marketChart) {
        marketChart.destroy();
    }
    
    // 🎨 Obtener colores del tema actual
    const colors = getChartColors();
    
    marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [t('Sin datos')],
            datasets: [{
                label: t('Precio CFT'),
                data: [0],
                borderColor: '#6b7280',
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: false 
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: colors.textSecondary // 🎨 Color dinámico
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: t('No hay transacciones en este período'),
                        color: colors.textSecondary // 🎨 Color dinámico
                    },
                    ticks: {
                        color: colors.textSecondary // 🎨 Color dinámico
                    }
                }
            }
        }
    });
    
    document.getElementById('chartPrecioActual').textContent = '-';
    document.getElementById('chartVariacion').textContent = '-';
    document.getElementById('chartMinimo').textContent = '-';
    document.getElementById('chartMaximo').textContent = '-';
    document.getElementById('chartPromedio').textContent = '-';
}

/**
 * Cambiar período de tiempo
 */
function changePeriod(period) {
    currentPeriod = period;
    
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) {
            btn.classList.add('active');
        }
    });
    
    updateMarketChart();
}

// ==========================================
// 🎨 LISTENERS PARA CAMBIOS DE TEMA E IDIOMA
// ==========================================

// Escuchar cambios de tema
window.addEventListener('themeChanged', function(e) {
    console.log('🎨 Tema cambiado a:', e.detail.theme);
    setTimeout(() => {
        actualizarColoresGrafico();
    }, 100);
});

// Escuchar cambios de idioma para re-renderizar el gráfico
window.addEventListener('languageChanged', () => {
    console.log('🌐 Idioma cambiado, actualizando gráfico P2P...');
    updateMarketChart();
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initMarketChart();
});

// Exponer funciones globalmente
window.updateMarketChart = updateMarketChart;
window.changePeriod = changePeriod;
window.initMarketChart = initMarketChart;

console.log('✅ Sistema de gráficos P2P cargado con soporte i18n y temas');