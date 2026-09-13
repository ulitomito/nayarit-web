<?php
declare(strict_types=1);

const NRE_MAX_JSON_BYTES = 2500000;
const NRE_MAX_IMAGE_BYTES = 2000000;

function sendApiHeaders(string $allowedMethods = 'GET, OPTIONS'): void
{
    header_remove('X-Powered-By');
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('Pragma: no-cache');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    header('Allow: ' . $allowedMethods);

    if ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

function jsonResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function handleOptions(string $allowedMethods): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        header('Allow: ' . $allowedMethods);
        exit;
    }
}

function startAdminSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name('nre_admin_session');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_start();

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
}

function isAdminSession(): bool
{
    startAdminSession();
    return ($_SESSION['is_admin'] ?? false) === true;
}

function requireSameOrigin(): void
{
    $origin = rtrim((string)($_SERVER['HTTP_ORIGIN'] ?? ''), '/');
    if ($origin === '') {
        return;
    }

    $scheme = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')) ? 'https' : 'http';
    $expected = $scheme . '://' . (string)($_SERVER['HTTP_HOST'] ?? '');

    if (!hash_equals($expected, $origin)) {
        jsonResponse(['error' => 'Origin not allowed'], 403);
    }
}

function requireAdmin(bool $requireCsrf = true): void
{
    startAdminSession();
    requireSameOrigin();

    if (($_SESSION['is_admin'] ?? false) !== true) {
        jsonResponse(['error' => 'Authentication required'], 401);
    }

    if ($requireCsrf) {
        $provided = (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
        $expected = (string)($_SESSION['csrf_token'] ?? '');
        if ($provided === '' || $expected === '' || !hash_equals($expected, $provided)) {
            jsonResponse(['error' => 'Invalid security token'], 403);
        }
    }
}

function loginRateLimitPath(): string
{
    $address = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    return rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR .
        'nre-login-' . hash('sha256', $address) . '.json';
}

function loginRateLimitState(): array
{
    $path = loginRateLimitPath();
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return ['attempts' => 0, 'blocked_until' => 0];
    }

    try {
        rewind($handle);
        $decoded = json_decode((string)stream_get_contents($handle), true);
        $state = is_array($decoded) ? $decoded : [];
        $blockedUntil = (int)($state['blocked_until'] ?? 0);
        if ($blockedUntil !== 0 && $blockedUntil <= time()) {
            $state = ['attempts' => 0, 'blocked_until' => 0];
            ftruncate($handle, 0);
            rewind($handle);
            fwrite($handle, json_encode($state));
        }
        return [
            'attempts' => max(0, (int)($state['attempts'] ?? 0)),
            'blocked_until' => max(0, (int)($state['blocked_until'] ?? 0)),
        ];
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function recordFailedLogin(): void
{
    $path = loginRateLimitPath();
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        return;
    }

    try {
        rewind($handle);
        $decoded = json_decode((string)stream_get_contents($handle), true);
        $state = is_array($decoded) ? $decoded : [];
        $attempts = (int)($state['attempts'] ?? 0) + 1;
        $blockedUntil = (int)($state['blocked_until'] ?? 0);
        if ($attempts >= 5) {
            $attempts = 0;
            $blockedUntil = time() + 900;
        }
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode([
            'attempts' => $attempts,
            'blocked_until' => $blockedUntil,
        ]));
        @chmod($path, 0600);
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function clearLoginRateLimit(): void
{
    $path = loginRateLimitPath();
    if (is_file($path)) {
        @unlink($path);
    }
}

function readJsonBody(int $maxBytes = NRE_MAX_JSON_BYTES): array
{
    $declaredLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($declaredLength > $maxBytes) {
        jsonResponse(['error' => 'Request body too large'], 413);
    }

    $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if ($raw === false || strlen($raw) > $maxBytes) {
        jsonResponse(['error' => 'Request body too large'], 413);
    }

    try {
        $data = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        jsonResponse(['error' => 'Invalid JSON input'], 400);
    }

    if (!is_array($data) || array_is_list($data)) {
        jsonResponse(['error' => 'JSON object required'], 400);
    }

    return $data;
}

function cleanPlainText(mixed $value, int $maxLength, bool $required = false): string
{
    if (!is_string($value) && !is_numeric($value)) {
        if ($required) {
            jsonResponse(['error' => 'Invalid text field'], 422);
        }
        return '';
    }

    $text = trim(strip_tags((string)$value));
    if ($required && $text === '') {
        jsonResponse(['error' => 'A required field is empty'], 422);
    }
    if (mb_strlen($text, 'UTF-8') > $maxLength) {
        jsonResponse(['error' => 'A text field exceeds the allowed length'], 422);
    }
    return $text;
}

function validateId(mixed $value): string
{
    $id = cleanPlainText($value, 64, true);
    if (!preg_match('/^[A-Za-z0-9_-]{1,64}$/', $id)) {
        jsonResponse(['error' => 'Invalid id'], 422);
    }
    return $id;
}

function validateImage(mixed $value): string
{
    if ($value === null || $value === '') {
        return '';
    }
    if (!is_string($value) || strlen($value) > NRE_MAX_IMAGE_BYTES) {
        jsonResponse(['error' => 'Invalid or oversized image'], 422);
    }

    if (str_starts_with($value, '/assets/')) {
        return $value;
    }
    if (preg_match('#^data:image/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=\r\n]+$#', $value)) {
        return $value;
    }
    if (filter_var($value, FILTER_VALIDATE_URL)) {
        $parts = parse_url($value);
        if (($parts['scheme'] ?? '') === 'https') {
            return $value;
        }
    }

    jsonResponse(['error' => 'Image must use HTTPS or a supported image upload'], 422);
}

function sanitizeRichContent(mixed $value, int $maxLength = 150000): string
{
    if (!is_string($value)) {
        return '';
    }
    if (strlen($value) > $maxLength) {
        jsonResponse(['error' => 'Article content is too large'], 422);
    }

    if (!class_exists('DOMDocument')) {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    $document = new DOMDocument('1.0', 'UTF-8');
    $previous = libxml_use_internal_errors(true);
    $document->loadHTML(
        '<?xml encoding="utf-8"?><div id="nre-sanitizer-root">' . $value . '</div>',
        LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
    );
    libxml_clear_errors();
    libxml_use_internal_errors($previous);

    $xpath = new DOMXPath($document);
    $root = $xpath->query('//*[@id="nre-sanitizer-root"]')->item(0);
    if (!$root) {
        return '';
    }

    $allowed = ['p', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'blockquote', 'br', 'a'];
    $removeEntirely = ['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta'];
    $nodes = [];
    foreach ($xpath->query('.//*', $root) as $node) {
        $nodes[] = $node;
    }

    foreach (array_reverse($nodes) as $node) {
        $tag = strtolower($node->nodeName);
        if (in_array($tag, $removeEntirely, true)) {
            $node->parentNode?->removeChild($node);
            continue;
        }
        if (!in_array($tag, $allowed, true)) {
            $parent = $node->parentNode;
            if ($parent) {
                while ($node->firstChild) {
                    $parent->insertBefore($node->firstChild, $node);
                }
                $parent->removeChild($node);
            }
            continue;
        }

        if ($node->hasAttributes()) {
            $attributes = [];
            foreach ($node->attributes as $attribute) {
                $attributes[] = $attribute->name;
            }
            foreach ($attributes as $attributeName) {
                if ($tag !== 'a' || !in_array(strtolower($attributeName), ['href', 'title'], true)) {
                    $node->removeAttribute($attributeName);
                }
            }
        }

        if ($tag === 'a') {
            $href = trim($node->getAttribute('href'));
            if ($href !== '' && !preg_match('#^(https://|mailto:|/)#i', $href)) {
                $node->removeAttribute('href');
            }
            $node->setAttribute('rel', 'noopener noreferrer nofollow');
        }
    }

    $result = '';
    foreach ($root->childNodes as $child) {
        $result .= $document->saveHTML($child);
    }
    return $result;
}

function readJsonArray(string $path): array
{
    if (!is_file($path)) {
        return [];
    }
    $content = file_get_contents($path);
    if ($content === false) {
        return [];
    }
    try {
        $decoded = json_decode($content, true, 64, JSON_THROW_ON_ERROR);
        return is_array($decoded) && array_is_list($decoded) ? $decoded : [];
    } catch (JsonException $e) {
        error_log('Unable to parse JSON content store: ' . basename($path));
        return [];
    }
}

function writeJsonArrayAtomic(string $path, array $data): void
{
    $lock = fopen($path . '.lock', 'c');
    if ($lock === false || !flock($lock, LOCK_EX)) {
        jsonResponse(['error' => 'Content store temporarily unavailable'], 503);
    }
    try {
        writeJsonArrayUnlocked($path, $data);
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function updateJsonArrayAtomic(string $path, callable $updater): array
{
    $lock = fopen($path . '.lock', 'c');
    if ($lock === false || !flock($lock, LOCK_EX)) {
        jsonResponse(['error' => 'Content store temporarily unavailable'], 503);
    }
    try {
        $updated = $updater(readJsonArray($path));
        if (!is_array($updated) || !array_is_list($updated)) {
            throw new RuntimeException('Invalid content store update');
        }
        writeJsonArrayUnlocked($path, $updated);
        return $updated;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function writeJsonArrayUnlocked(string $path, array $data): void
{
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $temporary = tempnam(dirname($path), '.nre-json-');
    if ($temporary === false || file_put_contents($temporary, $json, LOCK_EX) === false) {
        if (is_string($temporary) && is_file($temporary)) {
            unlink($temporary);
        }
        jsonResponse(['error' => 'Unable to save content'], 503);
    }
    chmod($temporary, 0640);
    if (!rename($temporary, $path)) {
        unlink($temporary);
        jsonResponse(['error' => 'Unable to save content'], 503);
    }
}
