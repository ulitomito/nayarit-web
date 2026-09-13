<?php
/**
 * Configuración de Conexión a Base de Datos MySQL (Hostinger)
 * Base de Datos: u543141245_UliNRE
 * Usuario: u543141245_UliNREAdmin
 */

$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'u543141245_UliNRE';
$db_user = getenv('DB_USER') ?: 'u543141245_UliNREAdmin';

// Contraseña de la base de datos en Hostinger.
// Si tienes una contraseña asignada en Hostinger MySQL, cámbiala aquí o como variable de entorno.
$db_pass = getenv('DB_PASSWORD') ?: 'Nre2026!';
