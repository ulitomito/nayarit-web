<?php
declare(strict_types=1);

/**
 * Secrets must live outside public_html. Environment variables take precedence;
 * Hostinger can use ../nre-private.php relative to DOCUMENT_ROOT.
 */
$privateConfig = [];
$configuredPath = getenv('NRE_CONFIG_FILE') ?: '';
$candidatePaths = array_values(array_unique(array_filter([
    $configuredPath,
    isset($_SERVER['DOCUMENT_ROOT']) ? dirname((string)$_SERVER['DOCUMENT_ROOT']) . '/nre-private.php' : '',
    dirname(__DIR__, 2) . '/nre-private.php',
])));

foreach ($candidatePaths as $candidatePath) {
    if (is_readable($candidatePath)) {
        $loaded = require $candidatePath;
        if (is_array($loaded)) {
            $privateConfig = $loaded;
        }
        break;
    }
}

$readSecret = static function (string $environmentName, string $configKey) use ($privateConfig): string {
    $environmentValue = getenv($environmentName);
    if (is_string($environmentValue) && $environmentValue !== '') {
        return $environmentValue;
    }
    $value = $privateConfig[$configKey] ?? '';
    return is_string($value) ? $value : '';
};

$db_host = $readSecret('DB_HOST', 'db_host');
$db_name = $readSecret('DB_NAME', 'db_name');
$db_user = $readSecret('DB_USER', 'db_user');
$db_pass = $readSecret('DB_PASSWORD', 'db_password');
$admin_username = $readSecret('ADMIN_USERNAME', 'admin_username') ?: 'admin';
