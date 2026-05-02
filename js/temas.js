
/**
 * SISTEMA DE TEMAS v2 - ChainFeed
 * DEFAULT: Dark (tu sitio actual)
 * ALTERNATIVO: Light (colores invertidos)
 */

(function() {
    'use strict';

    // ==========================================
    // MAPA DE COLORES - PEGAR AQUÍ
    // Formato: "colorDark": "colorLight"
    // ==========================================
    var colorMap = {

 // Agregar ESTAS líneas al inicio:
    "rgb(9, 1, 24)": "rgb(213, 201, 235)",
    "#090118": "rgb(213, 201, 235)",
    "rgb(27, 28, 57)": "rgb(229, 229, 219)",
    "#1b1c39": "rgb(229, 229, 219)",

    "rgba(1, 1, 1, 1)": "rgb(240, 240, 235)",
"rgb(1, 1, 1)": "rgb(240, 240, 235)",
"#010101": "rgb(240, 240, 235)",
    "rgba(0, 0, 0, 0.74)": "rgb(240, 240, 235)",
    "rgba(15, 15, 20, 0.16)": "rgba(99, 102, 241, 0.05)",
    "rgba(0, 0, 0, 0.65)": "rgb(240, 240, 235)",

    "rgba(99, 102, 241, 0.2)": "rgb(99 102 241 / 18%)",
    "#a0a0b8": "#4d475fff",
    "#d5cfc4": "#2a303b",
    "#c3c3f7": "#09083cff",
    "#babbe3": "#1c2645ff",
    "#c2c3d7": "#4f516eff",
    "#1a1a24": "#e5e5db",
    "#252532": "#dadacd",
    "#4facfe": "#044f91ff",
    "#fff": "#fff",
    "rgba(255, 255, 255, 0.1)": "rgb(151 154 197)",
    "rgba(0,0,0,0.3)": "#ffffff",
    "rgba(255,255,255,0.2)": "rgba(255,255,255,0.2)",
    "rgba(37, 37, 50, 0.5)": "#dadacd",
    "rgba(245, 158, 11, 0.2)": "rgba(245, 158, 11, 0.2)",
    "rgba(245, 158, 11, 0.3)": "rgba(245, 158, 11, 0.3)",
    "rgba(255, 255, 255, 0.05)": "rgb(130 133 181)",
    "rgba(255,255,255,0.3)": "#000000",
    "rgba(26, 26, 36, 0.95)": "#e5e5db",
    "rgba(0, 0, 0, 0.4)": "#ffffff",
    "rgba(245, 158, 11, 0.4)": "rgba(245, 158, 11, 0.4)",
    "rgba(251, 191, 36, 0.2)": "rgba(251, 191, 36, 0.2)",
    "rgba(0, 0, 0, 0.9)": "#ffffff",
    "rgba(0, 0, 0, 0.7)": "#ffffff",
    "rgba(255, 255, 255, 0.9)": "#000000",
    "rgba(255, 255, 255, 0.03)": "#000000",
    "rgba(0,0,0,0.7)": "#ffffff",
    "rgba(255, 255, 255, 0.2)": "#000000",
    "rgba(239, 68, 68, 0.2)": "#bb101088",
    "rgba(245, 158, 11, 0.05)": "rgba(245, 158, 11, 0.05)",
    "rgba(239, 68, 68, 0.4)": "#bb161085",
    "rgba(0, 0, 0, 0.8)": "#ffffff",
    "rgba(0, 0, 0, 0.85)": "#ffffff",
    "rgba(0, 0, 0, 0.5)": "#ffffff",
    "rgba(255, 255, 255, 0.15)": "#000000",
    "rgba(0, 0, 0, 0.3)": "rgb(209 191 243 / 97%)",
    "#0f0f14": "#f0f0eb",
    "#1a1a24": "#e5e5db",
    "#252532": "#dadacd",
    "#ffffff": "#000000",
    "#a0a0b8": "#5f5f47",
    "#bfc2db": "#403d24",
    "#929297": "#6d6d68",
    "#f0f3fc": "#0f0c03",
    "#cccdd7": "#333228",
    "#afb2bb": "#504d44",
    "rgba(196, 204, 245, 1)": "rgba(59, 51, 10, 1)",
    "#ebeaf4": "#14150b",
    "#bfc5e1": "#403a1e",
    "#aeb1cc": "#514e33",
    "#c6c3d5": "#393c2a",
    "#6b7280": "#948d7f",
    "#9ca3af": "#635c50",
    "#2c30d1": "#912ed3ff",
    "#8628df": "#8520d7ff",
    "#8d81eb": "#60147eff",
    "#c0c7d7": "#5c478b",
    "#232339": "#dcdcc6",
    "#2a2a2a": "#d5d5d5",
    "#9e9fb3": "#61604c",
    "#bcbfd3": "#43402c",
    "#8b5cf6": "#0913a3ff",
    "#9a77df": "#202288ff",
    "#c3c6cf": "#3c3930",
    "#c2ccd5": "#3d332a",
    "#b9b5ef": "#101e4aff",
    "#998ee5": "#1a1b71ff",
    "#d4edda": "#2b1225",
    "#c3e6cb": "#3c1934",
    "#4a4a5e": "#b5b5a1",
    "#c6c9ef": "#5c478b",
    "rgb(198, 201, 239)": "rgb(92, 71, 139)",
    "#888": "#777777",
    "#fff": "#000000",
    "#666": "#999999",
    "#333": "#cccccc",
    "rgba(15, 15, 20, 0.95)": "#f0f0eb",
    "rgba(255, 255, 255, 0.1)": "rgb(151 154 197)",
    "rgba(15, 15, 20, 0.98)": "#f0f0eb",
    "rgba(0, 0, 0, 0.3)": "#ffffff",
    "rgba(239, 68, 68, 0)": "#bb161081",
    "rgba(255, 255, 255, 0.05)": "#000000",
    "rgba(255, 255, 255, 0.02)": "#000000",
    "rgba(0, 0, 0, 0.8)": "#ffffff",
    "rgba(168, 85, 247, 0.1)": "rgb(158 82 241 / 8%)",
    "rgba(37, 37, 50, 0.5)": "#dadacd",
    "rgba(168, 85, 247, 0.2)": "rgb(158 82 241 / 8%)",
    "rgba(239, 68, 68, 0.2)": "#10bbbb",
    "rgba(0, 0, 0, 0.2)": "#dadacd",
    "rgba(255, 255, 255, 0.2)": "#000000",
    "rgba(255,255,255,0.3)": "#000000",
    "rgba(168, 85, 247, 0.3)": "rgb(158 82 241 / 8%)",
    "rgba(236, 72, 153, 0.1)": "rgb(187 179 207)",
    "rgba(245, 158, 11, 0.2)": "#0a61f4",
    "rgba(168, 85, 247, 0.05)": "rgb(158 82 241 / 8%)",
    "rgba(220, 38, 38, 0.2)": "rgba(220, 38, 38, 0.2)",
    "rgba(239, 68, 68, 0.6)": "rgba(239, 68, 68, 0.6)",
    "rgba(236, 72, 153, 0.2)": "#9c13b7ff",
    "rgba(168, 85, 247, 0.4)": "rgb(158 82 241 / 8%)",
    "rgba(236, 72, 153, 0.3)": "#7b13b7ff",
    "rgba(37, 37, 50, 0.8)": "#dadacd",
    "rgba(236, 72, 153, 0.4)": "#9613b7ff",
    "rgba(0, 0, 0, 0.1)": "#ffffff",
    "rgba(245, 158, 11, 0.3)": "#f4a20aff",
    "rgba(245, 158, 11, 0.4)": "#f4c90aff",
    "rgba(26, 26, 36, 0.9)": "#e5e5db",
    "rgba(26, 26, 36, 0.5)": "#e5e5db",
    "rgba(15, 15, 20, 0.8)": "#f0f0eb",
    "rgba(37, 37, 50, 0.3)": "#dadacd",
    "rgba(37, 37, 50, 0.2)": "#dadacd",
    "rgba(26, 26, 36, 0.95)": "#e5e5db",
    "rgba(0, 0, 0, 0.4)": "#ffffff",
    "rgba(0, 0, 0, 0)": "#ffffff",
    "rgba(255, 255, 255, 0.3)": "#000000",
    "rgba(236, 72, 153, 0.05)": "#b713afbb",
    "rgba(0, 0, 0, 0.6)": "#ffffff",
    "rgba(245, 158, 11, 0.1)": "#f4960a79",
    "rgba(0, 0, 0, 0.85)": "#ffffff",
    "rgba(26, 26, 36, 0.98)": "#e5e5db",
    "rgba(37, 37, 50, 0.98)": "#dadacd",
    "rgba(0, 0, 0, 0.5)": "#ffffff",
    "rgba(255, 59, 48, 0.2)": "#cf000077",
    "rgba(17, 24, 39, 0.98)": "#eee7d8",
    "rgba(31, 41, 55, 0.95)": "#e0d6c8",
    "rgba(156, 163, 175, 0.2)": "#635c50",
    "rgba(0, 0, 0, 0.92)": "#ffffff",
    "rgba(255, 255, 255, 0.08)": "#000000",
    "rgba(255, 255, 255, 0.7)": "#000000",
    "rgba(239, 68, 68, 0.15)": "#10bbbb",
    "rgba(255, 255, 255, 0.8)": "#000000",
    "rgba(255, 255, 255, 0.95)": "#000000",
    "rgba(31, 41, 55, 1)": "#e0d6c8",
    "rgba(255, 255, 255, 0.4)": "#000000",
    "rgba(239, 68, 68, 0.4)": "rgba(239, 68, 68, 0.4)",
    "rgba(220, 38, 38, 0.1)": "#d9232396",
    "rgba(255, 255, 255, 0.12)": "#000000",
    "rgba(255, 255, 255, 0.9)": "#000000",
    "rgba(37, 37, 50, 0.7)": "#dadacd",
    "rgba(255,255,255,0.05)": "#000000",
    "rgba(255,255,255,0.1)": "#000000",
    "#0f0f14": "#f0f0eb",
    "#1a1a24": "#e5e5db",
    "#252532": "#dadacd",
    "#ffffff": "#000000",
    "#a0a0b8": "#5f5f47",
    "rgba(15, 15, 20, 0.95)": "#f0f0eb",
    "rgba(255, 255, 255, 0.1)": "rgb(151 154 197)",
    "rgba(26, 26, 36, 0.5)": "#e5e5db",
    "rgba(0, 0, 0, 0.5)": "#ffffff",
    "rgba(37, 37, 50, 0.5)": "#dadacd",
    "rgba(37, 37, 50, 0.7)": "#dadacd",
    "rgba(255,255,255,0.3)": "#000000",
    "rgba(255, 255, 255, 0.3)": "#000000",
    "rgba(16, 185, 129, 0.3)": "#a4e2beff",
    "rgba(15, 15, 20, 0.8)": "#f0f0eb",
    "rgba(0, 0, 0, 0.3)": "#ffffff",
    "rgba(0, 0, 0, 0.8)": "#ffffff",
    "rgba(26, 26, 36, 0.95)": "#e5e5db",
    "rgba(255, 255, 255, 0.2)": "#000000",
    "rgba(245, 158, 11, 0.05)": "#f4730a85",
    "rgba(245, 158, 11, 0.1)": "#f4730a7a",
    "rgba(255, 255, 255, 0.15)": "#000000",
    "rgba(37, 37, 50, 0.3)": "#dadacd",
    "var(--dark)": "rgb(229, 229, 219)",
    "rgb(0, 0, 0)": "rgb(108, 111, 151)",
"var(--text)": "rgb(58 20 155)",
    "rgba(26, 26, 36, 0.98)": "#e5e5db",
    
  "rgb(151, 154, 197)": "rgb(15 15 20 / 8%)",
"var(--primary)": "#505297",
"var(--text-secondary)": "#63637a",
"rgb(191 193 218 / 50%)": "rgb(111 111 182 / 12%)",
"#a4a6f9": "rgb(95 69 161)",
"rgb(20, 20, 30)": "rgb(140 133 203 / 48%)",
"rgba(15, 15, 20, 0.43)": "rgb(72 72 166 / 9%)",
"rgba(99, 102, 241, 0.1)": "rgb(99 102 241 / 20%)",
"#acacc1": "#484865",
"#ebeaf4": "#161e5a",

"#bebecb": "rgb(221, 221, 231);",

// Versiones RGB normalizadas
"rgb(235, 234, 244)": "#161e5a",      // #ebeaf4
"rgb(172, 172, 193)": "#484865",      // #acacc1
"rgb(164, 166, 249)": "rgb(95, 69, 161)", // #a4a6f9
"rgb(191, 194, 219)": "rgb(64, 61, 36)",  // #bfc2db
"rgb(160, 160, 184)": "#5f5f47",      // #a0a0b8     // #10b981      // #ef4444       // #dc2626
"rgb(26, 26, 36)": "#e5e5db",         // #1a1a24
"rgb(37, 37, 50)": "#dadacd",         // #252532
"rgb(15, 15, 20)": "#f0f0eb",         // #0f0f14
"rgb(255, 255, 255)": "#090118ff",      // #ffffff      // #8b5cf6
"rgb(144, 160, 207)": "rgb(68,84,133)",
"rgba(0, 0, 0, 0.12)": "rgba(68, 76, 165, 0.12)",
"rgb(188, 191, 211)": "#445485",
"rgb(210, 214, 240)": "#0c205d",
"white": "white",
"rgba(0, 0, 0, 0.3)": "rgb(148 128 169 / 30%)",
"rgb(246, 244, 255);": "rgb(246, 244, 255)",
"rgb(1 5 33 / 0%)": "rgba(54, 36, 102, 1)",
"rgb(229 230 247 / 5%)": "rgb(240 240 247 / 53%)",
"rgb(5, 3, 18)": "rgba(255, 255, 255, 0.53)",
"rgba(5, 3, 18, 1)": "rgba(255, 255, 255, 0.53)",
"rgba(11, 13, 18, 0.3)": "rgba(190, 191, 211, 0.94)",
"rgba(15, 15, 20, 0.2)": "rgba(15, 15, 20, 0.01)",
"rgb(15, 15, 20, 0.2)": "rgba(15, 15, 20, 0.01)",
"rgba(20, 12, 45, 0.19)": "rgb(224, 224, 227, 0.3)",
"rgb(216, 210, 237)": "rgba(15, 14, 49, 0.69)",
"rgba(254, 254, 254, 0.05)": "rgb(15 14 49 / 69%)",
"rgba(231, 229, 245, 1)": "rgba(231, 229, 245, 1)",
"rgb(247, 247, 247)": "rgb(22, 30, 90)",
"#232339": "#e9e9e9",
"#9e9fb3": "rgb(65, 67, 119)",
"rgb(158, 159, 179)": "rgb(65, 67, 119)",
"rgba(168, 85, 247, 0.05)": "rgb(125, 89, 165)",
"rgba(236, 72, 153, 0.05)": "rgba(119, 104, 201, 0.74)",
"rgb(190, 190, 203)": "rgb(235, 235, 239)",
"black": "rgb(229, 229, 219)",
"rgba(255, 215, 0, 0.4)": "rgb(115 107 255 / 19%)",
"rgba(255, 107, 107, 0.3)": "rgb(115 107 255 / 19%)",
"rgba(198, 201, 229, 0.75)": "rgb(80, 82, 151)",
"rgba(209, 213, 229, 1)": "rgb(76, 78, 175)",
"rgba(194, 194, 227, 1)": "rgb(235, 235, 239)",
"rgba(255, 253, 255, 0.1)": "rgb(94, 98, 151)",
"rgba(186, 182, 233)": "rgb(54, 59, 117)",
"rgb(186, 182, 233)": "rgb(54, 59, 117)",
"rgba(186, 182, 233, 1)": "rgb(54, 59, 117)",
// NO convertir estos colores específicos del brillo
"rgba(255,255,255,0.2)": "rgba(255,255,255,0.2)",
"rgba(255, 255, 255, 0.2)": "rgba(255, 255, 255, 0.2)",
"rgba(226, 228, 253, 0.95)": "rgba(57, 63, 137, 0.95)",

"rgba(255, 255, 255, 0.06)": "rgba(87, 86, 127, 0.38)",

"rgba(255, 255, 255, 0.2)": "rgba(87, 86, 127, 0.38)",
// Agregar al colorMap
"rgba(15, 15, 20, 0.08)": "rgba(80, 80, 120, 0.2)",
"rgba(15, 15, 20, 0.1)": "rgba(80, 80, 120, 0.25)",
"rgba(15, 15, 20, 0.2)": "rgba(80, 80, 120, 0.3)",
"linear-gradient(135deg, var(--primary), var(--secondary))": "linear-gradient(135deg, #7c6acd, #a855f7)",

"rgba(99, 101, 241, 1)": "rgba(99, 101, 241, 0.27)",
"rgbargba(138, 92, 246, 1)": "rgba(138, 92, 246, 0.22)",

    };

// ==========================================
// CONVERTIR HEX8 A RGBA
// ==========================================
function hex8ToRgba(hex) {
    if (hex.charAt(0) !== '#') return null;
    
    var values;
    if (hex.length === 9) { // #RRGGBBAA
        values = {
            r: parseInt(hex.substr(1, 2), 16),
            g: parseInt(hex.substr(3, 2), 16),
            b: parseInt(hex.substr(5, 2), 16),
            a: parseInt(hex.substr(7, 2), 16) / 255
        };
    } else if (hex.length === 5) { // #RGBA
        values = {
            r: parseInt(hex.charAt(1) + hex.charAt(1), 16),
            g: parseInt(hex.charAt(2) + hex.charAt(2), 16),
            b: parseInt(hex.charAt(3) + hex.charAt(3), 16),
            a: parseInt(hex.charAt(4) + hex.charAt(4), 16) / 255
        };
    } else {
        return null;
    }
    
    return 'rgba(' + values.r + ', ' + values.g + ', ' + values.b + ', ' + values.a.toFixed(2) + ')';
}

// ==========================================
// EXPANDIR COLORMAP CON VARIANTES RGBA
// ==========================================
function expandColorMap() {
    var expanded = {};
    var conversions = [];
    
    for (var key in colorMap) {
        var value = colorMap[key];
        expanded[key] = value;
        
        // Si la clave es hex8, agregar versión rgba
        if (key.charAt(0) === '#' && (key.length === 9 || key.length === 5)) {
            var rgbaKey = hex8ToRgba(key);
            if (rgbaKey) {
                expanded[rgbaKey] = value;
                conversions.push('KEY: ' + key + ' → ' + rgbaKey);
            }
        }
        
        // Si el valor es hex8, convertir
        if (value.charAt(0) === '#' && (value.length === 9 || value.length === 5)) {
            var rgbaValue = hex8ToRgba(value);
            if (rgbaValue) {
                expanded[key] = rgbaValue;
                conversions.push('VALUE: ' + value + ' → ' + rgbaValue);
            }
        }
    }
    
    if (conversions.length > 0) {
        console.log('🔄 Conversiones hex8 → rgba:');
        conversions.forEach(function(msg) {
            console.log('  ' + msg);
        });
    }
    
    return expanded;
}

// ==========================================
// DETECTAR DUPLICADOS
// ==========================================
function detectDuplicates() {
    var seen = {};
    var duplicates = [];
    
    for (var key in colorMap) {
        var keyLower = key.toLowerCase();
        if (seen[keyLower]) {
            duplicates.push({
                key: key,
                value1: seen[keyLower],
                value2: colorMap[key]
            });
        } else {
            seen[keyLower] = colorMap[key];
        }
    }
    
    if (duplicates.length > 0) {
        console.warn('⚠️ CLAVES DUPLICADAS:');
        duplicates.forEach(function(dup) {
            console.warn('  "' + dup.key + '": "' + dup.value1 + '" vs "' + dup.value2 + '"');
        });
    }
    
    return duplicates;
}

// ==========================================
// ESTADO DEL TEMA
// ==========================================
// ==========================================
// DETECCIÓN DE TEMA CON SINCRONIZACIÓN BD
// ==========================================
var currentTheme = localStorage.getItem('chainfeed_theme') || 'dark';
var themeInitialized = false;

// Detectar tema del usuario (similar a idiomas.js)
async function detectUserTheme() {
    console.log('🎨 Detectando tema del usuario...');
    
    // 1. localStorage (preferencia explícita)
    var storedTheme = localStorage.getItem('chainfeed_theme');
    if (storedTheme && ['dark', 'light'].includes(storedTheme)) {
        console.log('✅ Usando tema de localStorage:', storedTheme);
        return storedTheme;
    }
    
    // 2. Verificar sesión en servidor
    try {
        var response = await fetch('/php/verificar_sesion.php');
        var data = await response.json();
        
        if (data.success && data.user && data.user.theme) {
            console.log('✅ Usando tema del servidor:', data.user.theme);
            localStorage.setItem('chainfeed_theme', data.user.theme);
            return data.user.theme;
        }
    } catch (error) {
        console.log('ℹ️ No se pudo verificar sesión para tema');
    }
    
    // 3. Preferencia del sistema operativo
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        console.log('✅ Usando tema del sistema: light');
        return 'light';
    }
    
    // 4. Default
    console.log('✅ Usando tema por defecto: dark');
    return 'dark';
}

// Sincronizar tema con servidor
async function syncThemeWithServer(theme) {
    try {
        var response = await fetch('/php/save-theme.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: theme, sync: true })
        });
        
        var data = await response.json();
        if (data.success) {
            console.log('✅ Tema sincronizado con servidor:', theme);
        }
    } catch (error) {
        console.log('ℹ️ Tema no sincronizado (sin sesión)');
    }
}

detectDuplicates();
colorMap = expandColorMap();

    // 🔥 ALMACENAMIENTO DE ESTILOS ORIGINALES
    var originalInlineStyles = new Map(); // elemento -> estilo original
    var originalCSSValues = {};           // ruleKey -> {prop: valorOriginal}
    var initialized = false;
var isApplyingTheme = false;

    // ==========================================
    // GUARDAR TODOS LOS ESTILOS ORIGINALES
    // ==========================================
    function saveOriginalStyles() {
        if (initialized) return;
        
        console.log('💾 Guardando estilos originales...');
        
        // Guardar estilos inline
        var elements = document.querySelectorAll('[style]');
        elements.forEach(function(el) {
            if (!originalInlineStyles.has(el)) {
                originalInlineStyles.set(el, el.getAttribute('style'));
            }
        });
        
        // Guardar estilos CSS
        var sheets = document.styleSheets;
        for (var i = 0; i < sheets.length; i++) {
            try {
                var rules = sheets[i].cssRules || sheets[i].rules;
                if (!rules) continue;
                
                for (var j = 0; j < rules.length; j++) {
                    var rule = rules[j];
                    if (!rule.style) continue;
                    
                    var ruleKey = i + '-' + j;
                    if (!originalCSSValues[ruleKey]) {
                        originalCSSValues[ruleKey] = {};
                    }
                    
                    var colorProps = [
                        'color', 'background', 'backgroundColor', 'background-color',
                        'borderColor', 'border-color', 'borderTopColor', 'border-top-color',
                        'borderBottomColor', 'border-bottom-color', 'borderLeftColor', 
                        'border-left-color', 'borderRightColor', 'border-right-color',
                        'boxShadow', 'box-shadow', 'textShadow', 'text-shadow',
                        'outlineColor', 'outline-color', 'fill', 'stroke'
                    ];
                    
                    colorProps.forEach(function(prop) {
                        var value = rule.style.getPropertyValue(prop) || rule.style[prop];
                        if (value && value !== '') {
                            originalCSSValues[ruleKey][prop] = value;
                        }
                    });
                }
            } catch (e) {
                // CORS - ignorar
            }
        }
        
        initialized = true;
        console.log('✅ Estilos guardados: ' + originalInlineStyles.size + ' elementos inline');
    }

    // ==========================================
    // REEMPLAZAR COLORES SIN TOCAR URLs NI PROPIEDADES NO-COLOR
    // ==========================================
  function applyColorsToElement(el, theme) {
    if (!el || !el.style) return;
    if (shouldExclude(el)) return;
    
var colorProps = [
    'color', 
    'backgroundColor', 
    'background',
    'border',              // ← AGREGAR
    'borderColor',
    'borderTop',           // ← AGREGAR
    'borderBottom',        // ← AGREGAR
    'borderLeft',          // ← AGREGAR
    'borderRight',         // ← AGREGAR
    'borderTopColor', 
    'borderBottomColor', 
    'borderLeftColor', 
    'borderRightColor',
    'outlineColor',
    'outline',             // ← AGREGAR
    'boxShadow', 
    'textShadow', 
    'fill', 
    'stroke'
];
    
    isApplyingTheme = true;
    
    colorProps.forEach(function(prop) {
        var value = el.style[prop];
        if (!value || value === '') return;
        
        var valueLower = value.toLowerCase().trim();
        
        if (theme === 'light') {
            // Buscar en colorMap
            for (var dark in colorMap) {
                var darkLower = dark.toLowerCase().trim();
                if (valueLower === darkLower || valueLower.indexOf(darkLower) > -1) {
                    el.style[prop] = value.toLowerCase().replace(new RegExp(escapeRegex(dark), 'gi'), colorMap[dark]);
                    break;
                }
            }
        } else {
            // Restaurar: buscar valores light y volver a dark
            for (var dark in colorMap) {
                var light = colorMap[dark].toLowerCase().trim();
                if (valueLower === light || valueLower.indexOf(light) > -1) {
                    el.style[prop] = value.toLowerCase().replace(new RegExp(escapeRegex(colorMap[dark]), 'gi'), dark);
                    break;
                }
            }
        }
    });
    
    isApplyingTheme = false;
}

    // ==========================================
    // APLICAR TEMA A ELEMENTOS INLINE
    // ==========================================
function applyThemeToInlineStyles(theme) {
    var elements = document.querySelectorAll('[style]');
    
    elements.forEach(function(el) {
        if (el.tagName.toLowerCase() === 'img') return;
        if (shouldExclude(el)) return;
        applyColorsToElement(el, theme);
    });
}

function applyThemeToStyleSheets(theme) {
    var sheets = document.styleSheets;
    
    for (var i = 0; i < sheets.length; i++) {
        try {
            // Saltar hojas protegidas
            if (sheets[i].ownerNode && sheets[i].ownerNode.getAttribute('data-no-theme') === 'true') {
                continue;
            }
            
            var rules = sheets[i].cssRules || sheets[i].rules;
            if (!rules) continue;
            
            for (var j = 0; j < rules.length; j++) {
                var rule = rules[j];
                if (!rule.style) continue;
                
                // Saltar reglas de FSV para preservar sus estilos
                if (rule.selectorText && rule.selectorText.indexOf('fsv-action-btn') > -1) {
                    continue;
                }
                
                var ruleKey = i + '-' + j;
                
                // Guardar originales si no existen
                if (!originalCSSValues[ruleKey]) {
                    originalCSSValues[ruleKey] = {};
                    var props = ['color', 'background', 'background-color', 'border-color', 'box-shadow'];
                    props.forEach(function(prop) {
                        var val = rule.style.getPropertyValue(prop);
                        if (val) originalCSSValues[ruleKey][prop] = val;
                    });
                }
                
                var colorProps = [
                    'color', 
                    'background', 
                    'background-color', 
                    'border',              
                    'border-color', 
                    'border-top', 
                    'border-bottom', 
                    'border-left', 
                    'border-right',
                    'border-top-color', 
                    'border-bottom-color', 
                    'border-left-color', 
                    'border-right-color', 
                    'box-shadow', 
                    'text-shadow', 
                    'outline-color',
                    'outline'              
                ];
                
                colorProps.forEach(function(prop) {
                    var originalValue = originalCSSValues[ruleKey][prop];
                    var currentValue = rule.style.getPropertyValue(prop);
                    
                    if (theme === 'light') {
                        if (currentValue) {
                            var newValue = currentValue;
                            for (var dark in colorMap) {
                                var light = colorMap[dark];
                                var regex = new RegExp(escapeRegex(dark), 'gi');
                                newValue = newValue.replace(regex, light);
                            }
                            if (newValue !== currentValue) {
                                if (!originalCSSValues[ruleKey][prop]) {
                                    originalCSSValues[ruleKey][prop] = currentValue;
                                }
                                rule.style.setProperty(prop, newValue);
                            }
                        }
                    } else {
                        if (originalValue) {
                            rule.style.setProperty(prop, originalValue);
                        }
                    }
                });
            }
        } catch (e) {
            // CORS - ignorar hojas externas
        }
    }
}

  function applyThemeToCSSVariables(theme) {
    var root = document.documentElement;

    if (!getComputedStyle(root).getPropertyValue('--text').trim()) {
        root.style.setProperty('--text', '#ffffff');
    }
    
    var variableMap = {
        '--primary': { dark: '#6366f1', light: '#4f46e5' },
        '--error': { dark: '#ef4444', light: '#ef4444', },
        '--accent': { dark: '#ec4899', light: '#ec4899' },
        '--warning': { dark: '#f59e0b', light: '#f59e0b' },
        '--success': { dark: '#10b981', light: '#10b981' },
        '--dark-secondary': { dark: '#1a1a24', light: '#e5e5db' },
        '--dark': { dark: '#0f0f14', light: '#f0f0eb' },
        '--dark-tertiary': { dark: '#252532', light: '#dadacd' },
        '--secondary': { dark: '#a855f7', light: '#a855f7' },
        '--text-secondary': { dark: '#a0a0b8', light: '#5f5f47' },
        '--card-bg': { dark: '#1a1a24', light: '#e5e5db' },
        '--border': { dark: '#252532', light: '#dadacd' },
        '--border-light': { dark: '#252532', light: '#c0c0c0' },
        '--text-primary': { dark: '#ffffff', light: '#875ba9' },
        '--primary-dark': { dark: '#4f46e5', light: '#6366f1' },
        '--surface-hover': { dark: '#252532', light: '#d5d5d5' },
        '--bg-primary': { dark: '#1a1a2e', light: '#e5e5d1' },
        '--participate-border': { dark: '#252532', light: '#dadacd' },
        '--participate-danger': { dark: '#ef4444', light: '#ef4444' },
        '--participate-primary': { dark: '#6366f1', light: '#4f46e5' },
        '--participate-secondary': { dark: '#a855f7', light: '#a855f7' },
        '--participate-surface': { dark: '#1a1a24', light: '#e5e5db' },
        '--text': { dark: '#ffffff', light: '#875ba9' },
    };
    
    for (var varName in variableMap) {
        var colors = variableMap[varName];
        root.style.setProperty(varName, theme === 'light' ? colors.light : colors.dark);
    }

    if (theme === 'light') {
        var style = document.getElementById('force-theme-colors');
        if (!style) {
            style = document.createElement('style');
            style.id = 'force-theme-colors';
            document.head.appendChild(style);
        }
style.innerHTML = `
/* ============================================
   MODO LIGHT COMPLETO - ChainFeed
   ============================================ */

/* === NAV TABS === */
body.light-theme .nav-tab.active {
    display: flex !important;
    align-items: center !important;
    background: linear-gradient(135deg, #7c6acd, #a855f7) !important;
    padding: 12px 18px !important;
    color: rgba(255, 255, 255, 0.95) !important;
    border: 1px solid rgba(122, 72, 238, 0.4) !important;
    opacity: 1 !important;
    transform: translateX(0px) scale(1) !important;
}

body.light-theme .nav-tab.active::before {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
}

body.light-theme .nav-tab:not(.active) {
    color: #5f5f47 !important;
}

body.light-theme .nav-tab:not(.active):hover {
    background: rgba(99, 102, 241, 0.15) !important;
    color: #505297 !important;
}

/* === FILTER BUTTONS === */
body.light-theme .filter-btn.active {
    background: linear-gradient(135deg, #7c6acd, #a855f7) !important;
    color: rgba(255, 255, 255, 0.95) !important;
}
/* === FILTER BUTTONS === */
body.light-theme .filter-btn.active {
    background: linear-gradient(135deg, #7c6acd, #a855f7) !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
}

body.light-theme .filter-btn.active * {
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
}
body.light-theme .filter-btn.active::before {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
}

/* === BORDERS INVISIBLES === */
body.light-theme .navbar,
body.light-theme .bottom-nav {
    border-color: rgba(80, 80, 120, 0.2) !important;
}

body.light-theme .chain-flashes-wrapper,
body.light-theme .post-card,
body.light-theme .comments-container,
body.light-theme .share-container,
body.light-theme .sell-container,
body.light-theme .flash-creator-container,
body.light-theme .transactions-container,
body.light-theme .anclar-modal-content,
body.light-theme .anclar-option,
body.light-theme .reject-modal-content {
    border-color: rgba(80, 80, 120, 0.2) !important;
}

body.light-theme .post-stats,
body.light-theme .comments-header,
body.light-theme .share-header,
body.light-theme .participate-header,
body.light-theme .flash-creator-header,
body.light-theme .viewers-header,
body.light-theme .fsv-user-info,
body.light-theme .pfsv-user-header {
    border-bottom-color: rgba(80, 80, 120, 0.2) !important;
}

body.light-theme .participate-footer,
body.light-theme .sell-footer,
body.light-theme .flash-creator-footer,
body.light-theme .fsv-post-actions {
    border-top-color: rgba(80, 80, 120, 0.2) !important;
}

body.light-theme .flash-type-tabs,
body.light-theme .quick-share-options {
    border-bottom-color: rgba(80, 80, 120, 0.2) !important;
}

/* === INPUTS Y TEXTAREAS === */
body.light-theme .comment-input,
body.light-theme .share-search,
body.light-theme .participate-textarea,
body.light-theme .sell-input,
body.light-theme .flash-text-input,
body.light-theme textarea,
body.light-theme input[type="text"],
body.light-theme input[type="number"],
body.light-theme input[type="search"] {
    border-color: rgba(80, 80, 120, 0.25) !important;
}

/* === DROPDOWNS === */
body.light-theme .comment-options-dropdown {
    border-color: rgba(80, 80, 120, 0.2) !important;
    background: rgb(240, 240, 235) !important;
}

/* === TÍTULOS === */
body.light-theme .comments-title {
    color: #5c478b !important;
}

/* === TUS ESTILOS EXISTENTES (mantener los que ya tenías) === */

.page-title {
    background: text rgb(131 51 163) !important;
}

.user-details h1 {
    color: rgb(58, 20, 155) !important;
}

.balance-label {
    color: rgb(122 122 167) !important;
}

.stat-title {
    color: rgb(58, 20, 155) !important;
}

.deposit-action-btn {
    background: #0ca774 !important;
}

.transaction-item:hover {
    background: rgb(210 209 219);
}

.stat-card:hover {
    box-shadow: rgb(187, 174, 197) 0px 30px 60px !important;
}

.chart-title {
    color: rgb(58, 20, 155) !important;
}

.section-title {
    color: rgb(58, 20, 155) !important;
}

.total-amount {
    background: linear-gradient(135deg, #7c3aed, #db2777) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: #2b1897b8 !important;
    background-clip: text !important;
}

.titudirecta {
    color: #293583 !important;
}

.ceropunto {
    color: #147d5a !important;
}

#balance-billetera {
    color: rgb(122, 122, 167) !important;
}

.main-header {
    background: rgb(240, 240, 235) !important;
    border-bottom: 1px solid rgb(12 12 12 / 10%) !important;
}

.main-content {
    background: rgb(240, 240, 235) !important;
}

.currency-tab {
    background: rgba(196, 166, 221, 0.38) !important;
    border: 2px solid rgb(223, 177, 243) !important;
}

.conversation-header {
    background: rgb(240, 240, 235) !important;
    border-bottom: 1px solid rgb(12 12 12 / 10%) !important;
}

.conversation-name {
    color: #51379d !important;
}

.chat-input-container {
    background: rgb(240, 240, 235) !important;
}

.message-input {
    background: rgb(140 140 227 / 50%) !important;
}

.amount-input {
    background: rgb(181 184 229) !important;
    color: rgb(45, 6, 117) !important;
}

.message.me .message-bubble {
    background: linear-gradient(135deg, #bcbde5, #8b5cf6) !important;
}

.message-bubble {
    background: rgb(115 114 114 / 80%) !important;
}

.purchase-btn {
    color: white !important;
}

.message-media-expired {
    color: #fbfbfb !important;
}

.quick-amount-btn {
    background: rgb(174, 177, 221);
    color: rgb(40, 11, 95);
}

.input-currency {
    color: rgb(20, 25, 245) !important;
}

.compra-directa-modal-close {
    background: rgb(207, 208, 221) !important;
}

.purchase-info {
    background: rgb(195, 198, 239) !important;
}

.currency-tab.active {
    background: rgba(99, 102, 241, 0.15) !important;
    border-color: rgb(99, 102, 241) !important;
    box-shadow: rgba(99, 102, 241, 0.18) 0px 8px 24px !important;
}

.custom-modal,
.fsv-sound-btn,
.posts-filters,
div[style*="rgb(9, 1, 24)"],
div[style*="#090118"] {
    background-color: rgb(213, 201, 235) !important;
    background: rgb(213, 201, 235) !important;
}

/* SVGs usan color, no background */
body.light-theme svg[style*="rgb(9, 1, 24)"],
body.light-theme svg[style*="9, 1, 24"],
body.light-theme svg[style*="#090118"],
body.light-theme .flash-avatar svg,
body.light-theme .your-flash svg {
    color: rgb(213, 201, 235) !important;
    stroke: currentColor !important;
}

*[style*="#1b1c39"],
*[style*="rgb(27, 28, 57)"] {
    background-color: rgb(229, 229, 219) !important;
    color: rgb(229, 229, 219) !important;
    border-color: rgb(229, 229, 219) !important;
}

.create-button::before,
.create-button:before {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
}

.user-card::before,
.user-card:before,
.user-card:hover::before,
.user-card:hover:before {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent) !important;
}

.collection-filters,
[class*="collection"][class*="filter"],
.filters,
.filter-container,
.filter-group {
    border-color: #e9e9e9 !important;
}

*[style*="rgba(209, 213, 229"] {
    color: rgb(76, 78, 175) !important;
}

*[style*="rgb(209, 213, 229"] {
    color: rgb(76, 78, 175) !important;
}

*[style*="#232339"] {
    border-color: #e9e9e9 !important;
}

*[style*="rgb(35, 35, 57)"] {
    border-color: #e9e9e9 !important;
}

*[style*="#9e9fb3"] {
    color: rgb(65, 67, 119) !important;
}

.participate-submit-btn::before,
.participate-submit-btn:before,
.chain-participate-btn::before,
.chain-participate-btn:before {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
}

*[style*="rgb(158, 159, 179)"] {
    color: rgb(65, 67, 119) !important;
}

.fsv-action-btn,
button.fsv-action-btn,
.fsv-post-actions .fsv-action-btn {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.promo-modal-content-inicio {
    background: linear-gradient(135deg, rgb(143, 143, 201) 0%, rgb(180, 160, 195) 100%) !important;
}

.balance-label-inicio {
    color: #dedef1 !important;
}

.post-card,
.content-card {
    background: rgba(99, 102, 241, 0.05) !important;
}

.promo-subtitle-inicio {
    color: #dedef1 !important;
}

.chain-flashes-wrapper {
    background: rgba(99, 102, 241, 0.05);
}

.content-card {
    background: rgba(99, 102, 241, 0.05) !important;
}

.sell-title {
    color: #5c478b !important;
}

.promo-modal-content {
    background: linear-gradient(135deg, rgb(143, 143, 201) 0%, rgb(180, 160, 195) 100%) !important;
}

.promo-plan-card {
    background: rgb(108, 111, 151) !important;
}

.promo-cancel-btn {
    background: rgba(15, 15, 20, 0.08) !important;
}

.promo-modal-inicio {
    background: rgba(0, 0, 0, 0.85) !important;
}

.search-title {
    color: rgb(112 98 151) !important;
}

.sort-dropdown-btn.active {
    background: rgb(207 164 253 / 52%) !important;
}

.sort-dropdown-btn:hover {
    background: rgb(207 164 253 / 52%) !important;
}

.cft-indicator {
    color: rgba(159, 1, 146, 1) !important;
}

.follow-btn.pending {
    background: rgb(237 178 0 / 47%) !important;
    color: #614800 !important;
    border: 2px solid rgb(255 193 7 / 97%) !important;
}

.stake-title {
    color: rgb(58, 20, 155) !important;
}

.stake-tab {
    color: rgba(45, 42, 85, 0.6) !important;
}

.stake-tab:hover {
    color: #4a4659 !important;
}

.stake-plan-name {
    color: #725591 !important;
}

.cerrar-boton {
    color: #86709d !important;
}

.post-earnings {
    background: rgba(60, 9, 125, 0.6);
}

#p2p-notify-float {
    color: #010104 !important;
}

.fsv-action-btn:hover,
button.fsv-action-btn:hover,
.fsv-post-actions .fsv-action-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
}

.post-card-content {
    background: linear-gradient(to bottom, transparent, rgba(97, 97, 155, 0.6)) !important;
}

.post-preview {
    background: linear-gradient(135deg, rgb(128, 122, 195), rgba(195, 77, 255, 0.8)) !important;
}

#botones-bille-full {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
.security-blocked-features li, .connect-wallet-benefits li {
    background: rgba(99, 102, 241, 0.18) !important;
}
.wfv-stat-value {
    color: white !important;
}

.wfv-post-content {
    color: white !important;
}

.stake-tab.active {
    color: #8b5cf6 !important;
}

.promo-tab.active {
    color: #f59e0b !important;
}

.promo-tab {
    color: rgba(45, 42, 85, 0.6) !important;
}

.promo-historial-item {
    background: rgb(235, 204, 235) !important;
}

.promo-historial-item:hover {
    background: rgba(209, 209, 243, 0.9) !important;
}

.texto-promo-card {
    color: rgba(50, 46, 75, 0.6) !important;
}

.modal-title {
    color: rgb(58, 20, 155) !important;
}

.form-label {
    color: rgb(58, 20, 155) !important;
}

.conversion-info small {
    color: rgb(58, 20, 155) !important;
}

.amount-preset {
    color: rgb(58, 20, 155) !important;
}

.level-current {
    color: rgb(80, 82, 151) !important;
}

.token-selector-trigger {
    background: rgb(187, 191, 241) !important;
}

.token-trigger-saldo {
    color: rgba(16, 0, 79, 0.6) !important;
}

.chat-title {
    background: text rgb(131, 51, 163) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
}

.search-input {
    background: rgb(211, 214, 239) !important;
}

.item {
    background: rgb(202, 205, 231) !important;
}

.item-name {
    color: #453f75 !important;
}

.item-subtitle {
    color: #585874 !important;
}

.status-pending-received {
    background: rgb(99 102 241 / 61%) !important;
    color: #f4f4f5 !important;
}

.chat-timestamp {
    color: #666676 !important;
}

.token-selector-trigger:hover {
    background: rgb(141, 145, 201) !important;
}

.current-balance-amount {
    background: #544ac7 !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent;
}

.form-input.account-readonly {
    color: #393191 !important;
}

.proton-account-display:hover {
    background: rgba(147, 147, 237, 0.9) !important;
}

.chart-title h2 {
    color: rgb(131 51 163) !important;
}

.offer-detail-value {
    color: #605a8f !important;
}

.form-group input,
.form-group select,
.form-group textarea {
    color: #413195 !important;
}

.filtro-ofertas {
    color: rgb(131 51 163) !important;
}
chain-event-header2 {
    background: rgb(80 80 120 / 0%) !important;
}
.audio-player-section {
    background: rgb(197 200 245) !important;
}
.audio-player {
    background: rgb(197 200 245) !important;
}
.chain-event-header {
    background: rgb(80 80 120 / 0%) !important;
}
    
.filter-item select,
.filter-item input {
    color: #7555a7 !important;
}
.notifications-title {
    color: #5c478b !important;
}
.notification-item:not(.unread) .group-counter {
    color: rgb(226, 224, 231) !important;
}
.titulo-modal-post {
    color: #5c478b !important;
}
.fondo-botones {
    background: rgb(184, 187, 233) !important;
}
.ir-a-perfilbuton {
    background: rgb(68, 72, 128) !important;
}
.ir-a-perfilbuton:hover {
    background: rgb(20 20 126 / 76%) !important;
}
.contenido-texto {
    color: #5c478b !important;
}
#fondo-moal-noti {
    background: rgb(152 110 197 / 95%) !important;
}
.usernamemodal {
   color: #5c478b !important;
}
#commentInput {
    background: rgb(218, 218, 205) !important;
    color: #37373b !important;
}
#comentarionotifica {
    background: rgb(218, 218, 205) !important;
}
.imputcomentnotirepli {
    background: rgb(218, 218, 205) !important;
    color: #37373b !important;
}
#commentInput:focus {
    color: rgb(48, 48, 68) !important;
}
#securityWarningCard {
 background: linear-gradient(135deg, rgb(229, 229, 219) 0%, rgba(60, 69, 175, 0.2) 100%) !important;
}
.email-label {
    color: rgb(13 12 55 / 60%) !important;
}
.close-comments-btn {
    color: rgb(43 43 153 / 45%) !important;
}
.equisfullnoti {
    color: rgb(43 43 153 / 45%) !important;
}
.notification-action-btn.accept {
    background: rgb(159 60 215 / 50%) !important;
    border-color: rgb(164, 125, 217) !important;
    color: rgb(226, 223, 231) !important;
}
.chain-input, .chain-textarea, .chain-select {
    color: rgb(64, 64, 105) !important;
}
.chain-select {
        color: #25216d !important;
}
.chain-select option:checked {
    background: rgb(90 76 187 / 72%) !important;
    color: rgb(231, 232, 240) !important;
}
.poll-reward-total {
    color: rgb(35, 59, 131) !important;
}
.chain-select option {
    color: #5757a0 !important;
}
.poll-input {
    color: rgb(68, 73, 123) !important;
}
.cosodeeventosnoti {
    background: rgb(197, 200, 236) !important;
    color: rgb(65, 74, 133) !important;
}
#botoncomprafull {
        background: linear-gradient(135deg, rgb(245, 158, 11), rgb(217, 119, 6)) !important;
    border-color: rgb(245, 158, 11) !important;
}

.titulocancel {
    color: #523d83 !important;
}

.pago-seguro-proton-desc {
    color: #539126 !important;
}
/* === FILTROS DEL MARKETPLACE P2P === */
body.light-theme .filter-group select,
body.light-theme .filter-item select,
body.light-theme .filter-item input {
    color: #3a149b !important;
    background: rgb(229, 229, 219) !important;
}

body.light-theme .filter-group select option,
body.light-theme .filter-item select option {
    color: #3a149b !important;
    background: rgb(240, 240, 235) !important;
}

body.light-theme .filter-group label,
body.light-theme .filter-item label {
    color: #5c478b !important;
}

/* Botones de período */
body.light-theme .period-btn {
    color: #5c478b !important;
}

body.light-theme .period-btn:hover {
    color: #3a149b !important;
}

body.light-theme .period-btn.active {
    color: white !important;
}

/* Estadísticas del gráfico */
body.light-theme .stat-item {
    background: rgba(99, 102, 241, 0.08) !important;
}

body.light-theme .stat-label {
    color: #5c478b !important;
}

body.light-theme .stat-value {
    color: #3a149b !important;
}

body.light-theme .stat-value.positive {
    color: #059669 !important;
}

body.light-theme .stat-value.negative {
    color: #dc2626 !important;
}

/* Título del gráfico */
body.light-theme .chart-title h2 {
    color: #5c478b !important;
}

body.light-theme .chart-subtitle {
    color: #7c6acd !important;
}

/* Botón de colapso */
body.light-theme .collapse-toggle {
    background: linear-gradient(135deg, #7c6acd, #a855f7) !important;
}

/* Títulos de filtros */
body.light-theme .filtro-ofertas {
    color: #5c478b !important;
}
    
/* === BOTÓN SEGUIR - ESTADOS PENDIENTE Y SIGUIENDO === */
body.light-theme #followBtn[data-pending="true"] {
    background: rgb(245, 158, 11) !important;
    color: white !important;
}

body.light-theme #followBtn[data-following="true"] {
    background: rgb(102, 106, 229) !important;
    color: white !important;
}
`;
        
        // Crear estilo protegido para brillos (no será modificado por el sistema)
        var protectedStyle = document.getElementById('force-theme-colors-protected');
        if (!protectedStyle) {
            protectedStyle = document.createElement('style');
            protectedStyle.id = 'force-theme-colors-protected';
            protectedStyle.setAttribute('data-no-theme', 'true');
            document.head.appendChild(protectedStyle);
        }
        protectedStyle.textContent = `
.user-card::before,
.user-card:before,
.user-card:hover::before,
.user-card:hover:before {
    background: linear-gradient(90deg, transparent, rgba(100, 100, 150, 0.3), transparent) !important;
    background-image: linear-gradient(90deg, transparent, rgba(100, 100, 150, 0.3), transparent) !important;
}
        `;
        
    } else {
        // En modo dark, remover los estilos forzados
        var existingStyle = document.getElementById('force-theme-colors');
        if (existingStyle) existingStyle.remove();
        
        // También remover el protegido en modo dark
        var protectedStyle = document.getElementById('force-theme-colors-protected');
        if (protectedStyle) protectedStyle.remove();
    }
}

// ==========================================
// APLICAR ESTILOS FORZADOS A ELEMENTOS RESISTENTES
// ==========================================
function forceResistantElements(theme) {
    if (theme !== 'light') return;
    
    // Definir elementos y sus estilos forzados
    var forceStyles = {
        '.chat-title': function(el) {
            el.style.setProperty('background', 'linear-gradient(135deg, rgb(131, 51, 163), rgb(131, 51, 163))', 'important');
            el.style.setProperty('-webkit-background-clip', 'text', 'important');
            el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
            el.style.setProperty('background-clip', 'text', 'important');
        },
        '.search-input': function(el) {
            el.style.setProperty('background', 'rgb(211, 214, 239)', 'important');
            el.style.setProperty('background-color', 'rgb(211, 214, 239)', 'important');
        },
        '.item': function(el) {
            el.style.setProperty('background', 'rgb(202, 205, 231)', 'important');
            el.style.setProperty('background-color', 'rgb(202, 205, 231)', 'important');
        },
        '.item-name': function(el) {
            el.style.setProperty('color', '#453f75', 'important');
        },
        '.item-subtitle': function(el) {
            el.style.setProperty('color', '#585874', 'important');
        },
        '.status-pending-received': function(el) {
            el.style.setProperty('background', 'rgb(99 102 241 / 61%)', 'important');
            el.style.setProperty('color', '#f4f4f5', 'important');
        },
        '.chat-timestamp': function(el) {
            el.style.setProperty('color', '#666676', 'important');
        },
        '.token-selector-trigger': function(el) {
            el.setAttribute('data-theme-applied', 'true');
            el.addEventListener('mouseenter', function() {
                el.style.setProperty('background', 'rgb(141, 145, 201)', 'important');
            });
            el.addEventListener('mouseleave', function() {
                el.style.setProperty('background', '', '');
            });
        },
        '.message-media-expired': function(el) {
            el.setAttribute('data-theme-applied', 'true');
            el.style.setProperty('color', '#fbfbfb', 'important');
        },

'#followBtn': function(el) {
    if (!el) return;
    
    // 🔧 FIX: Sincronizar data-attributes con el texto visible
    var syncState = function() {
        var text = el.textContent.trim().toLowerCase();
        
        // Detectar estado pendiente (incluye emoji y variantes)
        var isPendingText = text.includes('pending') || 
                           text.includes('pendiente') || 
                           text.includes('solicitado') ||
                           text.includes('⏳');
        
        // Detectar estado siguiendo
        var isFollowingText = (text === 'following' || text === 'siguiendo') && !isPendingText;
        
        console.log('🔍 syncState:', text, '| pending:', isPendingText, '| following:', isFollowingText);
        
        if (isPendingText && el.getAttribute('data-pending') !== 'true') {
            el.setAttribute('data-pending', 'true');
            el.setAttribute('data-following', 'false');
        } else if (isFollowingText && el.getAttribute('data-following') !== 'true') {
            el.setAttribute('data-following', 'true');
            el.setAttribute('data-pending', 'false');
        }
    };
    
    syncState();
    
    var applyButtonColor = function() {
        var isPending = el.getAttribute('data-pending') === 'true';
        var isFollowing = el.getAttribute('data-following') === 'true';
        
        if (isPending) {
            // Naranja para pendiente
            el.style.setProperty('background', 'rgb(244, 162, 10)', 'important');
            el.style.setProperty('color', 'white', 'important');
        } else if (isFollowing) {
            // Azul para siguiendo
            el.style.setProperty('background', 'rgb(102, 106, 229)', 'important');
            el.style.setProperty('color', 'white', 'important');
        } else {
            el.style.removeProperty('background');
            el.style.removeProperty('color');
        }
    };
    
    applyButtonColor();
    
    // Observar cambios de atributos Y contenido
    var observer = new MutationObserver(function(mutations) {
        syncState();
        applyButtonColor();
    });
    
    observer.observe(el, { 
        attributes: true, 
        attributeFilter: ['data-pending', 'data-following'],
        childList: true,
        characterData: true,
        subtree: true
    });
}

    };
    
    // Aplicar a elementos existentes
    var count = 0;
    for (var selector in forceStyles) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(el) {
            forceStyles[selector](el);
            count++;
        });
    }
    
    if (count > 0) {
        console.log('🔥 Forzados ' + count + ' elementos resistentes');
    }
}

// 🔧 AGREGAR ESTA FUNCIÓN (antes de applyThemeToPage, ~línea 1540)

function fixReadonlyInputs(theme) {
    var inputs = document.querySelectorAll('input[readonly].form-input, input[readonly][style*="background"]');
    
    inputs.forEach(function(input) {
        if (theme === 'light') {
            input.style.background = 'rgba(218, 218, 205, 0.5)';
            input.style.color = '#875ba9';
        } else {
            input.style.background = 'rgba(37, 37, 50, 0.3)';
            input.style.color = '#ffffff';
        }
    });
}

    // ==========================================
    // APLICAR TEMA COMPLETO
    // ==========================================

function applyThemeToPage(theme) {
    console.log('🎨 Aplicando tema: ' + theme);
    
    saveOriginalStyles();
    applyThemeToCSSVariables(theme);
    applyThemeToInlineStyles(theme);
    applyThemeToStyleSheets(theme);
    
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    }
    
    // Guardar en localStorage
    localStorage.setItem('chainfeed_theme', theme);
    currentTheme = theme;
    
    // 🔥 NUEVO: Sincronizar con servidor
    syncThemeWithServer(theme);
    
    // 🔥 NUEVO: Actualizar usuario en localStorage
    try {
        var savedUser = localStorage.getItem('chainfeed_user');
        if (savedUser) {
            var userData = JSON.parse(savedUser);
            userData.theme = theme;
            localStorage.setItem('chainfeed_user', JSON.stringify(userData));
            console.log('✅ Usuario actualizado con tema:', theme);
        }
    } catch (e) {
        console.error('❌ Error actualizando usuario:', e);
    }
    
    // 🔧 FIX: Corregir inputs readonly
    fixReadonlyInputs(theme);
    
    console.log('✅ Tema "' + theme + '" aplicado');
    
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));
    
    setTimeout(function() {
        forceResistantElements(theme);
    }, 100);
}

    // ==========================================
    // OBSERVADOR DE NUEVOS ELEMENTOS
    // ==========================================
 function startObserver() {
    var observer = new MutationObserver(function(mutations) {
        if (isApplyingTheme) return;
        if (currentTheme !== 'light') return;
        
        mutations.forEach(function(mutation) {
            // Elementos nuevos
            if (mutation.type === 'childList') {
mutation.addedNodes.forEach(function(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName && node.tagName.toLowerCase() === 'img') return;
    if (shouldExclude(node)) return;

    if (node.hasAttribute && node.hasAttribute('style')) {
        applyColorsToElement(node, 'light');
    }
    
    if (node.querySelectorAll) {
        node.querySelectorAll('[style]').forEach(function(child) {
            if (child.tagName.toLowerCase() !== 'img') {
                applyColorsToElement(child, 'light');
            }
        });
    }
    
    // ⭐ AGREGAR ESTAS LÍNEAS
    // Aplicar estilos forzados a elementos resistentes
    setTimeout(function() {
        forceResistantElements('light');
    }, 50);
});
            }
            
            // Cambios de style en elementos existentes
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                var el = mutation.target;
                if (el.tagName && el.tagName.toLowerCase() !== 'img') {
                    if (shouldExclude(el)) return;
                    applyColorsToElement(el, 'light');
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    console.log('👁️ Observador de temas activo');
}

    // ==========================================
    // UTILIDADES
    // ==========================================
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

function shouldExclude(el) {
    if (!el || !el.closest) return false;
    
    // Excluir botones de FSV
    if (el.closest('.fsv-post-actions')) return true;
    
    // Excluir botones con brillo (para preservar ::before)
    if (el.classList && (
        (el.classList.contains('nav-tab') && el.classList.contains('active')) ||
        (el.classList.contains('filter-btn') && el.classList.contains('active')) ||
        (el.classList.contains('create-button')) ||
        (el.classList.contains('participate-submit-btn')) ||
        (el.classList.contains('chain-participate-btn'))
    )) {
        return true;
    }
    
    return false;
}

    function toggleTheme() {
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyThemeToPage(newTheme);
        return newTheme;
    }

    function getCurrentTheme() {
        return currentTheme;
    }

    function setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            applyThemeToPage(theme);
        }
    }

    // ==========================================
    // CREAR BOTÓN FLOTANTE
    // ==========================================
    function createToggleButton(options) {
        options = options || {};
        var position = options.position || 'bottom-right';
        
        var btn = document.createElement('button');
        btn.id = 'theme-toggle-btn';
        btn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        btn.title = currentTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        btn.style.cssText = 'position:fixed;z-index:99999;width:50px;height:50px;border:none;border-radius:50%;font-size:24px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:all 0.3s;' +
            (position.indexOf('bottom') > -1 ? 'bottom:20px;' : 'top:20px;') +
            (position.indexOf('right') > -1 ? 'right:20px;' : 'left:20px;') +
            'background:' + (currentTheme === 'dark' ? '#fff' : '#333') + ';';
        
        btn.onclick = function() {
            var newTheme = toggleTheme();
            btn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            btn.title = newTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
            btn.style.background = newTheme === 'dark' ? '#fff' : '#333';
        };
        
        document.body.appendChild(btn);
        return btn;
    }

    // ==========================================
    // CONECTAR CON BOTONES DE CONFIGURACIÓN
    // ==========================================
    function initThemeButtons() {
        var lightBtn = document.getElementById('lightModeBtn');
        var darkBtn = document.getElementById('darkModeBtn');
        
        if (!lightBtn || !darkBtn) {
            console.log('ℹ️ Botones de tema no encontrados en esta página');
            return;
        }
        
        function updateButtonsUI(theme) {
            if (theme === 'light') {
                lightBtn.classList.add('active');
                darkBtn.classList.remove('active');
            } else {
                darkBtn.classList.add('active');
                lightBtn.classList.remove('active');
            }
        }
        
        updateButtonsUI(currentTheme);
        
        lightBtn.addEventListener('click', function() {
            if (currentTheme !== 'light') {
                applyThemeToPage('light');
                updateButtonsUI('light');
            }
        });
        
        darkBtn.addEventListener('click', function() {
            if (currentTheme !== 'dark') {
                applyThemeToPage('dark');
                updateButtonsUI('dark');
            }
        });
        
        window.addEventListener('themeChanged', function(e) {
            updateButtonsUI(e.detail.theme);
        });
        
        console.log('🔘 Botones de tema conectados');
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

async function init() {
    var colorCount = Object.keys(colorMap).length;
    
    if (colorCount === 0) {
        console.warn('⚠️ colorMap vacío');
        return;
    }

    console.log('🎨 Sistema de temas iniciado con ' + colorCount + ' colores');
    
    // 🔥 NUEVO: Detectar tema del usuario (BD o localStorage)
    if (!themeInitialized) {
        currentTheme = await detectUserTheme();
        themeInitialized = true;
    }
    
    // Remover CSS de precarga si existe
    var preloadStyle = document.getElementById('preload-theme');
    if (preloadStyle) preloadStyle.remove();
    
    // Asegurar que body tenga la clase correcta
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    }
    
    saveOriginalStyles();
    
    // Aplicar tema detectado
    if (currentTheme === 'light') {
        applyThemeToPage('light');
    }
    
    startObserver();
    initThemeButtons();
    
setTimeout(function() {
    if (currentTheme === 'light') {
        forceResistantElements('light');
    }
}, 50);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
} else {
    init();
}

    // ==========================================
    // API PÚBLICA
    // ==========================================
window.themeSystem = {
    toggle: toggleTheme,
    set: setTheme,
    get: getCurrentTheme,
    createButton: createToggleButton,
    apply: function() { applyThemeToPage(currentTheme); },
    colorMap: colorMap,
    getOriginalStyles: function() { return originalInlineStyles; },
    getOriginalCSS: function() { return originalCSSValues; },
    // ⭐ AGREGAR ESTA LÍNEA
    forceElements: forceResistantElements
};

    console.log('✅ temas.js cargado (Dark por defecto)');

})();