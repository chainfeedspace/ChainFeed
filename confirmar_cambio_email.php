<?php
// php/confirmar_cambio_email.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include 'conexion.php';

// ========== FUNCIONES AUXILIARES ==========

function mostrarPaginaExito($email) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Cambiado - ChainFeed</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0f0f14 0%, #1a1a24 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .container {
                max-width: 600px;
                width: 100%;
                background: rgba(26, 26, 36, 0.95);
                border-radius: 24px;
                padding: 48px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3);
                border: 1px solid rgba(99, 102, 241, 0.2);
                animation: fadeInUp 0.6s ease-out;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .icon {
                font-size: 80px;
                margin-bottom: 24px;
                animation: bounce 1s ease-in-out;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }

            h1 {
                color: #ffffff;
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 16px;
                background: linear-gradient(135deg, #6366f1, #a855f7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .email-display {
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 12px;
                padding: 16px;
                margin: 24px 0;
                word-break: break-all;
            }

            .email-display p {
                color: #a0a0b8;
                font-size: 14px;
                margin-bottom: 8px;
            }

            .email-display strong {
                color: #ffffff;
                font-size: 18px;
            }

            .message {
                color: #a0a0b8;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 32px;
            }

            .button {
                display: inline-block;
                background: linear-gradient(135deg, #6366f1, #a855f7);
                color: white;
                padding: 16px 48px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
                box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
            }

            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(99, 102, 241, 0.6);
            }

            .info-box {
                background: rgba(245, 158, 11, 0.1);
                border-left: 4px solid #f59e0b;
                border-radius: 8px;
                padding: 16px;
                margin-top: 32px;
                text-align: left;
            }

            .info-box p {
                color: #fbbf24;
                font-size: 14px;
                line-height: 1.6;
                margin: 0;
            }

            @media (max-width: 640px) {
                .container {
                    padding: 32px 24px;
                }

                h1 {
                    font-size: 24px;
                }

                .icon {
                    font-size: 60px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">✅</div>
            <h1>¡Email Cambiado Exitosamente!</h1>
            
            <div class="email-display">
                <p>Tu nuevo email es:</p>
                <strong><?php echo htmlspecialchars($email); ?></strong>
            </div>
            
            <p class="message">
                Tu dirección de email ha sido actualizada y verificada correctamente. 
                Ahora puedes usar este email para iniciar sesión en ChainFeed.
            </p>
            
            <a href="https://chainfeed.space" class="button">
                🔗 Ir a ChainFeed
            </a>
            
            <div class="info-box">
                <p>
                    <strong>💡 Importante:</strong> Si tienes sesiones activas en otros dispositivos, 
                    es recomendable que vuelvas a iniciar sesión para actualizar tu información.
                </p>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

function mostrarPaginaError($mensaje) {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - ChainFeed</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0f0f14 0%, #1a1a24 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .container {
                max-width: 600px;
                width: 100%;
                background: rgba(26, 26, 36, 0.95);
                border-radius: 24px;
                padding: 48px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(239, 68, 68, 0.3);
                border: 1px solid rgba(239, 68, 68, 0.2);
            }

            .icon {
                font-size: 80px;
                margin-bottom: 24px;
            }

            h1 {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 16px;
            }

            .message {
                color: #ef4444;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 32px;
            }

            .button {
                display: inline-block;
                background: linear-gradient(135deg, #6366f1, #a855f7);
                color: white;
                padding: 16px 48px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
            }

            .button:hover {
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">❌</div>
            <h1>Error al Cambiar Email</h1>
            <p class="message"><?php echo htmlspecialchars($mensaje); ?></p>
            <a href="https://chainfeed.space" class="button">
                🏠 Volver a ChainFeed
            </a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// ========== LÓGICA PRINCIPAL ==========

try {
    // Validar método GET
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        mostrarPaginaError('Método no permitido');
    }

    // Validar token
    if (!isset($_GET['token']) || empty($_GET['token'])) {
        mostrarPaginaError('Token no proporcionado');
    }

    $token = sanitizarInput($_GET['token']);

    // Conectar a BD
    $database = new Database();
    $db = $database->getConnection();

    // Buscar solicitud de cambio
    $query = "SELECT 
                ecr.id,
                ecr.usuario_id,
                ecr.email_actual,
                ecr.email_nuevo,
                ecr.expires_at,
                u.username,
                u.email as current_email
              FROM email_change_requests ecr
              INNER JOIN usuarios u ON ecr.usuario_id = u.id
              WHERE ecr.token = :token
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $token);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        mostrarPaginaError('Token inválido o solicitud no encontrada');
    }

    $request = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar expiración
    $now = new DateTime();
    $expiresAt = new DateTime($request['expires_at']);

    if ($now > $expiresAt) {
        // Eliminar solicitud expirada
        $deleteQuery = "DELETE FROM email_change_requests WHERE id = :id";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->bindParam(':id', $request['id'], PDO::PARAM_INT);
        $deleteStmt->execute();

        mostrarPaginaError('El enlace ha expirado. Por favor solicita un nuevo cambio de email.');
    }

    // Verificar que el nuevo email no esté en uso por otra cuenta
    $checkQuery = "SELECT id FROM usuarios 
                   WHERE email = :email_nuevo 
                   AND id != :usuario_id 
                   LIMIT 1";
    
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email_nuevo', $request['email_nuevo']);
    $checkStmt->bindParam(':usuario_id', $request['usuario_id'], PDO::PARAM_INT);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        mostrarPaginaError('El nuevo email ya está en uso por otra cuenta');
    }

    // Iniciar transacción
    $db->beginTransaction();

    try {
        // Actualizar email y restablecer verificación
        $updateQuery = "UPDATE usuarios 
                       SET email = :email_nuevo,
                           email_verified = 1,
                           updated_at = NOW()
                       WHERE id = :usuario_id";
        
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':email_nuevo', $request['email_nuevo']);
        $updateStmt->bindParam(':usuario_id', $request['usuario_id'], PDO::PARAM_INT);
        
        if (!$updateStmt->execute()) {
            throw new Exception('Error al actualizar email');
        }

        // Eliminar solicitud de cambio
        $deleteQuery = "DELETE FROM email_change_requests WHERE id = :id";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->bindParam(':id', $request['id'], PDO::PARAM_INT);
        $deleteStmt->execute();

        // Eliminar otras solicitudes pendientes del mismo usuario
        $cleanupQuery = "DELETE FROM email_change_requests WHERE usuario_id = :usuario_id";
        $cleanupStmt = $db->prepare($cleanupQuery);
        $cleanupStmt->bindParam(':usuario_id', $request['usuario_id'], PDO::PARAM_INT);
        $cleanupStmt->execute();

        // Commit de transacción
        $db->commit();

        // Log de éxito
        error_log("✅ Email cambiado exitosamente - User ID: {$request['usuario_id']}, Nuevo email: {$request['email_nuevo']}");

        // Actualizar sesión si el usuario está logueado
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $request['usuario_id']) {
            $_SESSION['email'] = $request['email_nuevo'];
        }

        // Mostrar página de éxito
        mostrarPaginaExito($request['email_nuevo']);

    } catch (Exception $e) {
        $db->rollBack();
        error_log("❌ Error en transacción de cambio de email: " . $e->getMessage());
        mostrarPaginaError('Error al procesar el cambio de email');
    }

} catch (PDOException $e) {
    error_log("Error en confirmación de cambio de email: " . $e->getMessage());
    mostrarPaginaError('Error interno del servidor');
} catch (Exception $e) {
    error_log("Error general en confirmación de cambio de email: " . $e->getMessage());
    mostrarPaginaError('Error al procesar solicitud');
}
?>