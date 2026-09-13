<?php
declare(strict_types=1);

require_once __DIR__ . '/security.php';

sendApiHeaders('GET, POST, DELETE, OPTIONS');
handleOptions('GET, POST, DELETE, OPTIONS');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'POST' || $method === 'DELETE') {
    requireAdmin(true);
}

require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$jsonFile = __DIR__ . '/posts.json';

function formatPostRow(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'status' => (string)($row['status'] ?? 'published'),
        'category' => (string)($row['category'] ?? 'legal'),
        'date' => (string)($row['date'] ?? ''),
        'readTime' => (int)($row['read_time'] ?? 4),
        'author' => (string)($row['author'] ?? 'Equipo Legal Nayarit Real Estate'),
        'image' => (string)($row['image'] ?? ''),
        'title' => [
            'es' => (string)($row['title_es'] ?? ''),
            'en' => (string)($row['title_en'] ?? ''),
        ],
        'excerpt' => [
            'es' => (string)($row['excerpt_es'] ?? ''),
            'en' => (string)($row['excerpt_en'] ?? ''),
        ],
        'content' => [
            'es' => sanitizeRichContent((string)($row['content_es'] ?? '')),
            'en' => sanitizeRichContent((string)($row['content_en'] ?? '')),
        ],
    ];
}

function publicPostsOnly(array $posts): array
{
    if (isAdminSession()) {
        return array_values($posts);
    }
    return array_values(array_filter($posts, static fn(array $post): bool => ($post['status'] ?? 'published') !== 'draft'));
}

if ($method === 'GET') {
    $posts = readJsonArray($jsonFile);
    $postsById = [];
    foreach ($posts as $post) {
        if (is_array($post) && isset($post['id'])) {
            $postsById[(string)$post['id']] = $post;
        }
    }
    if ($pdo) {
        try {
            $rows = $pdo->query('SELECT * FROM blog_posts ORDER BY date DESC, created_at DESC')->fetchAll();
            foreach (array_map('formatPostRow', $rows) as $databasePost) {
                $postsById[$databasePost['id']] = $databasePost;
            }
        } catch (PDOException $e) {
            error_log('Unable to read blog posts from database');
        }
    }

    $posts = array_values($postsById);
    usort($posts, static fn(array $left, array $right): int => strcmp((string)($right['date'] ?? ''), (string)($left['date'] ?? '')));
    foreach ($posts as &$post) {
        if (isset($post['content']) && is_array($post['content'])) {
            $post['content']['es'] = sanitizeRichContent($post['content']['es'] ?? '');
            $post['content']['en'] = sanitizeRichContent($post['content']['en'] ?? '');
        }
    }
    unset($post);

    jsonResponse(publicPostsOnly($posts));
}

if ($method === 'POST') {
    $data = readJsonBody();
    $id = isset($data['id']) && $data['id'] !== ''
        ? validateId($data['id'])
        : 'post-' . (string)round(microtime(true) * 1000);

    $status = cleanPlainText($data['status'] ?? 'draft', 20, true);
    if (!in_array($status, ['draft', 'published'], true)) {
        jsonResponse(['error' => 'Invalid post status'], 422);
    }
    $category = cleanPlainText($data['category'] ?? 'legal', 50, true);
    if (!in_array($category, ['legal', 'foreigners', 'investment'], true)) {
        jsonResponse(['error' => 'Invalid category'], 422);
    }

    $date = cleanPlainText($data['date'] ?? date('Y-m-d'), 10, true);
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        jsonResponse(['error' => 'Invalid date'], 422);
    }
    $readTime = filter_var($data['readTime'] ?? $data['read_time'] ?? 4, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 60],
    ]);
    if ($readTime === false) {
        jsonResponse(['error' => 'Invalid read time'], 422);
    }

    $title = is_array($data['title'] ?? null) ? $data['title'] : [];
    $excerpt = is_array($data['excerpt'] ?? null) ? $data['excerpt'] : [];
    $content = is_array($data['content'] ?? null) ? $data['content'] : [];

    $normalizedPost = [
        'id' => $id,
        'status' => $status,
        'category' => $category,
        'date' => $date,
        'readTime' => (int)$readTime,
        'author' => cleanPlainText($data['author'] ?? 'Equipo Legal Nayarit Real Estate', 150, true),
        'image' => validateImage($data['image'] ?? ''),
        'title' => [
            'es' => cleanPlainText($title['es'] ?? $data['titleEs'] ?? '', 255, true),
            'en' => cleanPlainText($title['en'] ?? $data['titleEn'] ?? '', 255),
        ],
        'excerpt' => [
            'es' => cleanPlainText($excerpt['es'] ?? $data['excerptEs'] ?? '', 2000, true),
            'en' => cleanPlainText($excerpt['en'] ?? $data['excerptEn'] ?? '', 2000),
        ],
        'content' => [
            'es' => sanitizeRichContent($content['es'] ?? $data['contentEs'] ?? ''),
            'en' => sanitizeRichContent($content['en'] ?? $data['contentEn'] ?? ''),
        ],
    ];

    updateJsonArrayAtomic($jsonFile, static function (array $posts) use ($normalizedPost, $id): array {
        $found = false;
        foreach ($posts as $index => $post) {
            if (($post['id'] ?? null) === $id) {
                $posts[$index] = $normalizedPost;
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($posts, $normalizedPost);
        }
        return array_values($posts);
    });

    $dbSaved = false;
    if ($pdo) {
        try {
            $statement = $pdo->prepare(
                'INSERT INTO blog_posts (id, status, category, date, read_time, author, image, title_es, title_en, excerpt_es, excerpt_en, content_es, content_en)
                 VALUES (:id, :status, :category, :date, :read_time, :author, :image, :title_es, :title_en, :excerpt_es, :excerpt_en, :content_es, :content_en)
                 ON DUPLICATE KEY UPDATE status = VALUES(status), category = VALUES(category), date = VALUES(date),
                 read_time = VALUES(read_time), author = VALUES(author), image = VALUES(image), title_es = VALUES(title_es),
                 title_en = VALUES(title_en), excerpt_es = VALUES(excerpt_es), excerpt_en = VALUES(excerpt_en),
                 content_es = VALUES(content_es), content_en = VALUES(content_en), updated_at = CURRENT_TIMESTAMP'
            );
            $statement->execute([
                ':id' => $id,
                ':status' => $status,
                ':category' => $category,
                ':date' => $date,
                ':read_time' => $readTime,
                ':author' => $normalizedPost['author'],
                ':image' => $normalizedPost['image'],
                ':title_es' => $normalizedPost['title']['es'],
                ':title_en' => $normalizedPost['title']['en'],
                ':excerpt_es' => $normalizedPost['excerpt']['es'],
                ':excerpt_en' => $normalizedPost['excerpt']['en'],
                ':content_es' => $normalizedPost['content']['es'],
                ':content_en' => $normalizedPost['content']['en'],
            ]);
            $dbSaved = true;
        } catch (PDOException $e) {
            error_log('Unable to save blog post to database');
        }
    }

    jsonResponse(['success' => true, 'db_saved' => $dbSaved, 'post' => $normalizedPost]);
}

if ($method === 'DELETE') {
    $id = validateId($_GET['id'] ?? '');
    updateJsonArrayAtomic(
        $jsonFile,
        static fn(array $posts): array => array_values(array_filter(
            $posts,
            static fn(array $post): bool => ($post['id'] ?? null) !== $id
        ))
    );

    $dbDeleted = false;
    if ($pdo) {
        try {
            $statement = $pdo->prepare('DELETE FROM blog_posts WHERE id = :id');
            $statement->execute([':id' => $id]);
            $dbDeleted = true;
        } catch (PDOException $e) {
            error_log('Unable to delete blog post from database');
        }
    }

    jsonResponse(['success' => true, 'db_deleted' => $dbDeleted, 'id' => $id]);
}

jsonResponse(['error' => 'Method not allowed'], 405);
