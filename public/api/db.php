<?php
require_once __DIR__ . '/config.php';

/**
 * Retorna la instancia de conexión PDO a MySQL o null si falla.
 */
function getDbConnection() {
    global $db_host, $db_name, $db_user, $db_pass;
    
    static $pdo = null;
    static $attempted = false;

    if ($attempted) {
        return $pdo;
    }
    $attempted = true;

    try {
        $dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, $db_user, $db_pass, $options);

        // Crear la tabla si no existe todavía con estructura bilingüe y soporte para imágenes optimizadas
        $tableSql = "CREATE TABLE IF NOT EXISTS `blog_posts` (
            `id` VARCHAR(64) NOT NULL PRIMARY KEY,
            `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
            `category` VARCHAR(50) NOT NULL DEFAULT 'legal',
            `date` VARCHAR(20) NOT NULL,
            `read_time` INT(11) NOT NULL DEFAULT 4,
            `author` VARCHAR(150) NOT NULL DEFAULT 'Equipo Legal Nayarit Real Estate',
            `image` LONGTEXT,
            `title_es` VARCHAR(255) NOT NULL,
            `title_en` VARCHAR(255) NOT NULL,
            `excerpt_es` TEXT NOT NULL,
            `excerpt_en` TEXT NOT NULL,
            `content_es` LONGTEXT NOT NULL,
            `content_en` LONGTEXT NOT NULL,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
        
        $pdo->exec($tableSql);

        return $pdo;
    } catch (PDOException $e) {
        error_log("DB Connection failed: " . $e->getMessage());
        return null;
    }
}
