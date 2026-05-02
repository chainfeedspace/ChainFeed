<?php
/**
 * Filtro de Contenido
 * Sistema de validación de contenido inapropiado para publicaciones, comentarios y respuestas
 * 
 * @author Tu Nombre
 * @version 1.0
 * @date 2025
 */

class FiltroContenido {
    
    private $palabras_prohibidas = [];
    private $palabras_prohibidas_ingles = [];
    private $palabras_prohibidas_espanol = [];
    private $ruta_archivo;
    
    /**
     * Constructor - Carga las palabras prohibidas desde el JSON
     */
    public function __construct() {
        $this->ruta_archivo = __DIR__ . '/palabras_prohibidas.json';
        $this->cargarPalabrasProhibidas();
    }
    
    /**
     * Carga las palabras prohibidas desde el archivo JSON
     */
    private function cargarPalabrasProhibidas() {
        try {
            if (!file_exists($this->ruta_archivo)) {
                error_log("Advertencia: Archivo palabras_prohibidas.json no encontrado");
                return;
            }
            
            $json = file_get_contents($this->ruta_archivo);
            $datos = json_decode($json, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log("Error al decodificar palabras_prohibidas.json: " . json_last_error_msg());
                return;
            }
            
            $this->palabras_prohibidas_espanol = isset($datos['espanol']) ? $datos['espanol'] : [];
            $this->palabras_prohibidas_ingles = isset($datos['ingles']) ? $datos['ingles'] : [];
            
            // Combinar ambos arrays
            $this->palabras_prohibidas = array_merge(
                $this->palabras_prohibidas_espanol,
                $this->palabras_prohibidas_ingles
            );
            
            // Convertir todas a minúsculas para comparación
            $this->palabras_prohibidas = array_map('strtolower', $this->palabras_prohibidas);
            
        } catch (Exception $e) {
            error_log("Error al cargar palabras prohibidas: " . $e->getMessage());
        }
    }
    
    /**
     * Normaliza el texto para detectar variaciones
     * Ejemplos: p3rr0 -> perro, p.e.r.r.o -> perro, p_e_r_r_o -> perro
     * 
     * @param string $texto
     * @return string
     */
    private function normalizarTexto($texto) {
        // Convertir a minúsculas
        $texto = strtolower($texto);
        
        // Reemplazar números por letras comunes
        $reemplazos = [
            '0' => 'o',
            '1' => 'i',
            '3' => 'e',
            '4' => 'a',
            '5' => 's',
            '7' => 't',
            '8' => 'b',
            '@' => 'a',
            '$' => 's',
            '€' => 'e'
        ];
        
        $texto = str_replace(array_keys($reemplazos), array_values($reemplazos), $texto);
        
        // Eliminar caracteres especiales, espacios, puntos, guiones, etc.
        $texto = preg_replace('/[^a-z0-9\s]/', '', $texto);
        
        // Eliminar espacios múltiples
        $texto = preg_replace('/\s+/', ' ', $texto);
        
        return trim($texto);
    }
    
    /**
     * Genera variaciones de una palabra para detectar evasiones
     * 
     * @param string $palabra
     * @return array
     */
    private function generarVariaciones($palabra) {
        $variaciones = [$palabra];
        
        // Variación 1: Con espacios entre letras (p e r r o)
        $con_espacios = implode(' ', str_split($palabra));
        $variaciones[] = $con_espacios;
        
        // Variación 2: Sin espacios pero normalizada
        $variaciones[] = str_replace(' ', '', $palabra);
        
        return $variaciones;
    }
    
    /**
     * Valida si el contenido contiene palabras prohibidas
     * 
     * @param string $contenido - El texto a validar
     * @return array - ['valido' => bool, 'mensaje' => string, 'palabras_detectadas' => array]
     */
    public function validarContenido($contenido) {
        // Si no hay palabras prohibidas cargadas, permitir el contenido
        if (empty($this->palabras_prohibidas)) {
            return [
                'valido' => true,
                'mensaje' => '',
                'palabras_detectadas' => []
            ];
        }
        
        // Normalizar el contenido
        $contenido_normalizado = $this->normalizarTexto($contenido);
        
        // Array para almacenar palabras detectadas
        $palabras_detectadas = [];
        
        // Buscar cada palabra prohibida
        foreach ($this->palabras_prohibidas as $palabra_prohibida) {
            $palabra_normalizada = $this->normalizarTexto($palabra_prohibida);
            
            // Generar variaciones de la palabra
            $variaciones = $this->generarVariaciones($palabra_normalizada);
            
            foreach ($variaciones as $variacion) {
                // Buscar la palabra como palabra completa (con límites de palabra)
                if (preg_match('/\b' . preg_quote($variacion, '/') . '\b/i', $contenido_normalizado)) {
                    $palabras_detectadas[] = $palabra_prohibida;
                    break; // No seguir buscando variaciones de esta palabra
                }
                
                // También buscar sin límites de palabra (para detectar dentro de otras palabras)
                if (strpos($contenido_normalizado, $variacion) !== false) {
                    // Verificar que no sea un falso positivo común
                    if (!$this->esFalsoPositivo($contenido_normalizado, $variacion)) {
                        $palabras_detectadas[] = $palabra_prohibida;
                        break;
                    }
                }
            }
        }
        
        // Eliminar duplicados
        $palabras_detectadas = array_unique($palabras_detectadas);
        
        // Determinar si el contenido es válido
        $es_valido = empty($palabras_detectadas);
        
        $mensaje = '';
        if (!$es_valido) {
            $cantidad = count($palabras_detectadas);
            $mensaje = "Tu publicación contiene contenido inapropiado que no está permitido. Por favor, revisa tu texto y vuelve a intentarlo.";
        }
        
        return [
            'valido' => $es_valido,
            'mensaje' => $mensaje,
            'palabras_detectadas' => $palabras_detectadas // Útil para logging, NO mostrar al usuario
        ];
    }
    
    /**
     * Verifica si es un falso positivo común
     * Por ejemplo: "casualmente" contiene "mente" pero no es ofensivo
     * 
     * @param string $texto
     * @param string $palabra
     * @return bool
     */
    private function esFalsoPositivo($texto, $palabra) {
        // Lista de palabras comunes que pueden contener palabras prohibidas
        $palabras_comunes = [
            'casualmente',
            'mentalmente',
            'finalmente',
            'realmente',
            'igualmente',
            'totalmente',
            'exactamente',
            'perfectamente',
            'completamente',
            'absolutamente'
        ];
        
        foreach ($palabras_comunes as $palabra_comun) {
            if (strpos(strtolower($texto), $palabra_comun) !== false && 
                strpos($palabra_comun, $palabra) !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Obtiene el total de palabras prohibidas cargadas
     * 
     * @return int
     */
    public function getTotalPalabrasProhibidas() {
        return count($this->palabras_prohibidas);
    }
    
    /**
     * Valida múltiples contenidos a la vez
     * Útil para validar título + descripción, o publicación + comentario
     * 
     * @param array $contenidos - Array de strings a validar
     * @return array
     */
    public function validarMultiple($contenidos) {
        $todas_palabras_detectadas = [];
        
        foreach ($contenidos as $contenido) {
            $resultado = $this->validarContenido($contenido);
            if (!$resultado['valido']) {
                $todas_palabras_detectadas = array_merge(
                    $todas_palabras_detectadas, 
                    $resultado['palabras_detectadas']
                );
            }
        }
        
        $todas_palabras_detectadas = array_unique($todas_palabras_detectadas);
        $es_valido = empty($todas_palabras_detectadas);
        
        $mensaje = '';
        if (!$es_valido) {
            $mensaje = "Tu contenido contiene lenguaje inapropiado que no está permitido. Por favor, revisa tu texto y vuelve a intentarlo.";
        }
        
        return [
            'valido' => $es_valido,
            'mensaje' => $mensaje,
            'palabras_detectadas' => $todas_palabras_detectadas
        ];
    }
    
    /**
     * Método de debug para probar el filtro
     * NO usar en producción
     * 
     * @param string $contenido
     * @return void
     */
    public function debug($contenido) {
        echo "=== DEBUG FILTRO DE CONTENIDO ===\n";
        echo "Contenido original: {$contenido}\n";
        echo "Contenido normalizado: " . $this->normalizarTexto($contenido) . "\n";
        echo "Total palabras prohibidas: " . $this->getTotalPalabrasProhibidas() . "\n";
        
        $resultado = $this->validarContenido($contenido);
        echo "¿Es válido?: " . ($resultado['valido'] ? 'SÍ' : 'NO') . "\n";
        
        if (!$resultado['valido']) {
            echo "Palabras detectadas: " . implode(', ', $resultado['palabras_detectadas']) . "\n";
            echo "Mensaje: {$resultado['mensaje']}\n";
        }
        
        echo "=================================\n";
    }
}
?>