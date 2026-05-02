<?php
/**
 * ============================================
 * SISTEMA DE TRADUCCIÓN PARA NOTIFICACIONES PUSH
 * ============================================
 * 
 * Archivo: i18n_push.php
 * Propósito: Traducir notificaciones push al idioma del usuario
 * Uso: require_once 'i18n_push.php';
 */

// ============================================
// DICCIONARIO DE TRADUCCIONES
// ============================================

const PUSH_TRANSLATIONS = [
    'en' => [
        // Títulos de notificaciones
        '❤️ Nuevos likes' => '❤️ New likes',
        '❤️ Likes en tus comentarios' => '❤️ Likes on your comments',
        '💬 Nuevos comentarios' => '💬 New comments',
        '💬 Respuestas a tus comentarios' => '💬 Replies to your comments',
        '🔄 Reposts' => '🔄 Reposts',
        '📢 Te mencionaron' => '📢 You were mentioned',
        '👥 Nuevos seguidores' => '👥 New followers',
        '🎯 Nuevas participaciones' => '🎯 New participations',
        '❤️ Likes en tu participación' => '❤️ Likes on your participation',
        '🔔 Actividad reciente' => '🔔 Recent activity',
        
        // Palabras comunes
        'dio like a tu publicación' => 'liked your post',
        'dio like a' => 'liked',
        'de tus publicaciones' => 'of your posts',
        'tu comentario' => 'your comment',
        'de tus comentarios' => 'of your comments',
        'comentó' => 'commented',
        'en tu publicación' => 'on your post',
        'veces en tus publicaciones' => 'times on your posts',
        'respondió' => 'replied',
        'veces' => 'times',
        'a tu comentario' => 'to your comment',
        'reposteó' => 'reposted',
        'te mencionó' => 'mentioned you',
        'comenzó a seguirte' => 'started following you',
        'participó en tu Chain Event' => 'participated in your Chain Event',
        'participaciones' => 'participations',
        'dio like a tu participación' => 'liked your participation',
        'likes' => 'likes',
        'y' => 'and',
        'más' => 'more',
        'dieron like a tu publicación' => 'liked your post',
        'dieron like a tus publicaciones' => 'liked your posts',
        'dieron like a tus comentarios' => 'liked your comments',
        'comentaron en tus publicaciones' => 'commented on your posts',
        'respondieron a tus comentarios' => 'replied to your comments',
        'repostearon tus publicaciones' => 'reposted your posts',
        'te mencionaron' => 'mentioned you',
        'comenzaron a seguirte' => 'started following you',
        'participaron en tu Chain Event' => 'participated in your Chain Event',
        'dieron like a tu participación' => 'liked your participation',
        'Tienes' => 'You have',
        'nuevas notificaciones' => 'new notifications',
        
        // Frases completas comunes
        'dio like a tu comentario' => 'liked your comment',
        'comentó en tu publicación' => 'commented on your post',
        'respondió a tu comentario' => 'replied to your comment',
        'reposteó tu publicación' => 'reposted your post'
    ]
];

// ============================================
// PATRONES DINÁMICOS PARA TRADUCCIONES
// ============================================

const PUSH_DYNAMIC_PATTERNS = [
    // "@usuario dio like a X de tus publicaciones"
    [
        'pattern' => '/^@([\w.]+)\s+dio like a\s+(\d+)\s+de tus publicaciones$/i',
        'replace' => '@$1 liked $2 of your posts'
    ],
    
    // "@usuario y X más dieron like a tu publicación"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más dieron like a tu publicación$/i',
        'replace' => '@$1 and $2 more liked your post'
    ],
    
    // "@usuario y X más dieron like a tus publicaciones"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más dieron like a tus publicaciones$/i',
        'replace' => '@$1 and $2 more liked your posts'
    ],
    
    // "@usuario dio like a X de tus comentarios"
    [
        'pattern' => '/^@([\w.]+)\s+dio like a\s+(\d+)\s+de tus comentarios$/i',
        'replace' => '@$1 liked $2 of your comments'
    ],
    
    // "@usuario y X más dieron like a tus comentarios"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más dieron like a tus comentarios$/i',
        'replace' => '@$1 and $2 more liked your comments'
    ],
    
    // "@usuario comentó X veces en tus publicaciones"
    [
        'pattern' => '/^@([\w.]+)\s+comentó\s+(\d+)\s+veces en tus publicaciones$/i',
        'replace' => '@$1 commented $2 times on your posts'
    ],
    
    // "@usuario y X más comentaron en tus publicaciones"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más comentaron en tus publicaciones$/i',
        'replace' => '@$1 and $2 more commented on your posts'
    ],
    
    // "@usuario respondió X veces a tu comentario"
    [
        'pattern' => '/^@([\w.]+)\s+respondió\s+(\d+)\s+veces a tu comentario$/i',
        'replace' => '@$1 replied $2 times to your comment'
    ],
    
    // "@usuario respondió a tu comentario" (sin veces)
    [
        'pattern' => '/^@([\w.]+)\s+respondió\s+a tu comentario$/i',
        'replace' => '@$1 replied to your comment'
    ],
    
    // "@usuario y X más respondieron a tus comentarios"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más respondieron a tus comentarios$/i',
        'replace' => '@$1 and $2 more replied to your comments'
    ],
    
    // "@usuario reposteó X de tus publicaciones"
    [
        'pattern' => '/^@([\w.]+)\s+reposteó\s+(\d+)\s+de tus publicaciones$/i',
        'replace' => '@$1 reposted $2 of your posts'
    ],
    
    // "@usuario reposteó tu publicación" (singular)
    [
        'pattern' => '/^@([\w.]+)\s+reposteó tu publicación$/i',
        'replace' => '@$1 reposted your post'
    ],
    
    // "@usuario y X más repostearon tus publicaciones"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más repostearon tus publicaciones$/i',
        'replace' => '@$1 and $2 more reposted your posts'
    ],
    
    // "@usuario te mencionó X veces"
    [
        'pattern' => '/^@([\w.]+)\s+te mencionó\s+(\d+)\s+veces$/i',
        'replace' => '@$1 mentioned you $2 times'
    ],
    
    // "@usuario te mencionó" (sin veces)
    [
        'pattern' => '/^@([\w.]+)\s+te mencionó$/i',
        'replace' => '@$1 mentioned you'
    ],
    
    // "@usuario y X más te mencionaron"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más te mencionaron$/i',
        'replace' => '@$1 and $2 more mentioned you'
    ],
    
    // "@usuario comenzó a seguirte"
    [
        'pattern' => '/^@([\w.]+)\s+comenzó a seguirte$/i',
        'replace' => '@$1 started following you'
    ],
    
    // "@usuario y X más comenzaron a seguirte"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más comenzaron a seguirte$/i',
        'replace' => '@$1 and $2 more started following you'
    ],
    
    // "@usuario participó en tu Chain Event (X participaciones)"
    [
        'pattern' => '/^@([\w.]+)\s+participó en tu Chain Event\s+\((\d+)\s+participaciones\)$/i',
        'replace' => '@$1 participated in your Chain Event ($2 participations)'
    ],
    
    // "@usuario participó en tu Chain Event" (sin contador)
    [
        'pattern' => '/^@([\w.]+)\s+participó en tu Chain Event$/i',
        'replace' => '@$1 participated in your Chain Event'
    ],
    
    // "@usuario y X más participaron en tu Chain Event"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más participaron en tu Chain Event$/i',
        'replace' => '@$1 and $2 more participated in your Chain Event'
    ],
    
    // "@usuario dio like (X likes) a tu participación"
    [
        'pattern' => '/^@([\w.]+)\s+dio like\s+\((\d+)\s+likes\)\s+a tu participación$/i',
        'replace' => '@$1 liked ($2 likes) your participation'
    ],
    
    // "@usuario dio like a tu participación" (sin contador)
    [
        'pattern' => '/^@([\w.]+)\s+dio like a tu participación$/i',
        'replace' => '@$1 liked your participation'
    ],
    
    // "@usuario y X más dieron like a tu participación"
    [
        'pattern' => '/^@([\w.]+)\s+y\s+(\d+)\s+más dieron like a tu participación$/i',
        'replace' => '@$1 and $2 more liked your participation'
    ],
    
    // "Tienes X nuevas notificaciones"
    [
        'pattern' => '/^Tienes\s+(\d+)\s+nuevas notificaciones$/i',
        'replace' => 'You have $1 new notifications'
    ],
    
    // "@usuario dio like a tu publicación"
    [
        'pattern' => '/^@([\w.]+)\s+dio like a tu publicación$/i',
        'replace' => '@$1 liked your post'
    ],
    
    // "@usuario comentó en tu publicación"
    [
        'pattern' => '/^@([\w.]+)\s+comentó en tu publicación$/i',
        'replace' => '@$1 commented on your post'
    ]
];

// ============================================
// FUNCIÓN PRINCIPAL DE TRADUCCIÓN
// ============================================

/**
 * Traduce un texto de notificación push al idioma del usuario
 * 
 * @param string $texto Texto en español a traducir
 * @param string $idioma_usuario Código de idioma ('es', 'en')
 * @return string Texto traducido o texto original si no hay traducción
 */
function traducirPush($texto, $idioma_usuario = 'es') {
    // Si es español o no hay texto, retornar original
    if ($idioma_usuario === 'es' || empty($texto)) {
        return $texto;
    }
    
    // Si el idioma no está soportado, retornar original
    if (!isset(PUSH_TRANSLATIONS[$idioma_usuario])) {
        return $texto;
    }
    
    $traducciones = PUSH_TRANSLATIONS[$idioma_usuario];
    
    // 1. INTENTAR TRADUCCIÓN EXACTA
    if (isset($traducciones[$texto])) {
        return $traducciones[$texto];
    }
    
    // 2. INTENTAR PATRONES DINÁMICOS
    foreach (PUSH_DYNAMIC_PATTERNS as $patron) {
        if (preg_match($patron['pattern'], $texto)) {
            return preg_replace($patron['pattern'], $patron['replace'], $texto);
        }
    }
    
    // 3. TRADUCCIÓN PARCIAL (palabra por palabra como fallback)
    $texto_traducido = $texto;
    foreach ($traducciones as $es => $en) {
        // Solo reemplazar palabras/frases completas para evitar reemplazos parciales incorrectos
        $texto_traducido = preg_replace(
            '/\b' . preg_quote($es, '/') . '\b/i',
            $en,
            $texto_traducido
        );
    }
    
    // Si cambió algo, retornar la traducción parcial
    if ($texto_traducido !== $texto) {
        return $texto_traducido;
    }
    
    // 4. FALLBACK: Retornar original si no se pudo traducir
    return $texto;
}

/**
 * Obtiene el idioma preferido de un usuario desde la base de datos
 * 
 * @param int $usuario_id ID del usuario
 * @param PDO $db Conexión a la base de datos (opcional)
 * @return string Código de idioma ('es' o 'en')
 */
function obtenerIdiomaUsuario($usuario_id, $db = null) {
    try {
        // Si no se proporciona conexión, crear una nueva
        if ($db === null) {
            if (class_exists('Database')) {
                $database = new Database();
                $db = $database->getConnection();
            } else {
                return 'es'; // Fallback si no hay clase Database
            }
        }
        
        // Consultar idioma del usuario
        $stmt = $db->prepare("
            SELECT language 
            FROM users 
            WHERE id = :usuario_id 
            LIMIT 1
        ");
        $stmt->bindParam(':usuario_id', $usuario_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && !empty($result['language'])) {
            return $result['language'];
        }
        
        // Fallback a español
        return 'es';
        
    } catch (Exception $e) {
        // En caso de error, retornar español como fallback
        error_log("⚠️ Error obteniendo idioma del usuario: " . $e->getMessage());
        return 'es';
    }
}

/**
 * Traduce múltiples textos de una notificación
 * 
 * @param array $textos Array con 'titulo' y 'mensaje'
 * @param string $idioma_usuario Código de idioma
 * @return array Array con textos traducidos
 */
function traducirNotificacionCompleta($textos, $idioma_usuario = 'es') {
    return [
        'titulo' => traducirPush($textos['titulo'] ?? '', $idioma_usuario),
        'mensaje' => traducirPush($textos['mensaje'] ?? '', $idioma_usuario)
    ];
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Log de carga exitosa
if (function_exists('error_log')) {
    error_log("✅ i18n_push.php cargado correctamente");
}

// Para debugging: descomentar la siguiente línea
// testTraduccionesPush();

?>