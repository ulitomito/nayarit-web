<?php
declare(strict_types=1);

require_once __DIR__ . '/security.php';
require_once __DIR__ . '/db.php';

sendApiHeaders('GET, POST, DELETE, OPTIONS');
handleOptions('GET, POST, DELETE, OPTIONS');
startAdminSession();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    jsonResponse([
        'authenticated' => isAdminSession(),
        'csrfToken' => $_SESSION['csrf_token'],
    ]);
}

if ($method === 'POST') {
    requireSameOrigin();
    $now = time();
    $blockedUntil = (int)($_SESSION['login_blocked_until'] ?? 0);
    $networkLimit = loginRateLimitState();
    $blockedUntil = max($blockedUntil, (int)$networkLimit['blocked_until']);
    if ($blockedUntil > $now) {
        header('Retry-After: ' . ($blockedUntil - $now));
        jsonResponse(['error' => 'Too many attempts. Try again later.'], 429);
    }
    $data = readJsonBody(2048);
    $password = is_string($data['password'] ?? null) ? $data['password'] : '';
    $pdo = getDbConnection();
    if (!$pdo) {
        jsonResponse(['error' => 'Administrator login is temporarily unavailable'], 503);
    }

    try {
        $statement = $pdo->prepare('SELECT id, password_hash FROM admin_users WHERE username = :username LIMIT 1');
        $statement->execute([':username' => $admin_username]);
        $admin = $statement->fetch();
    } catch (PDOException $e) {
        error_log('Unable to read administrator account');
        jsonResponse(['error' => 'Administrator login is temporarily unavailable'], 503);
    }
    $validPassword = is_array($admin) &&
        is_string($admin['password_hash'] ?? null) &&
        $password !== '' &&
        strlen($password) <= 256 &&
        password_verify($password, $admin['password_hash']);

    if (!$validPassword) {
        recordFailedLogin();
        $attempts = (int)($_SESSION['login_attempts'] ?? 0) + 1;
        $_SESSION['login_attempts'] = $attempts;
        if ($attempts >= 5) {
            $_SESSION['login_attempts'] = 0;
            $_SESSION['login_blocked_until'] = $now + 900;
        }
        usleep(350000);
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }

    session_regenerate_id(true);
    $_SESSION['is_admin'] = true;
    $_SESSION['login_attempts'] = 0;
    $_SESSION['login_blocked_until'] = 0;
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    clearLoginRateLimit();
    try {
        $updateLogin = $pdo->prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = :id');
        $updateLogin->execute([':id' => $admin['id']]);
    } catch (PDOException $e) {
        error_log('Unable to update administrator last_login');
    }
    jsonResponse(['authenticated' => true, 'csrfToken' => $_SESSION['csrf_token']]);
}

if ($method === 'DELETE') {
    requireAdmin(true);
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 42000,
            'path' => $params['path'],
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
    }
    session_destroy();
    jsonResponse(['success' => true]);
}

jsonResponse(['error' => 'Method not allowed'], 405);
