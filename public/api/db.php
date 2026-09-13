<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function getDbConnection(): ?PDO
{
    global $db_host, $db_name, $db_user, $db_pass;

    static $pdo = null;
    static $attempted = false;
    if ($attempted) {
        return $pdo;
    }
    $attempted = true;

    if ($db_host === '' || $db_name === '' || $db_user === '' || $db_pass === '') {
        error_log('Database configuration is incomplete');
        return null;
    }

    try {
        $dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
        $pdo = new PDO($dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log('Database connection failed');
        return null;
    }
}
