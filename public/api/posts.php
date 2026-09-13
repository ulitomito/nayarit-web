<?php
// CORS headers & JSON content type
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$jsonFile = __DIR__ . '/posts.json';

// Helper to read posts from JSON backup
function getJsonPosts($jsonFile) {
    if (file_exists($jsonFile)) {
        $content = file_get_contents($jsonFile);
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return [];
}

// Helper to save posts to JSON backup
function saveJsonPosts($jsonFile, $posts) {
    file_put_contents($jsonFile, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM blog_posts ORDER BY date DESC, created_at DESC");
            $rows = $stmt->fetchAll();

            if (empty($rows)) {
                // Table is empty, seed from JSON
                $jsonPosts = getJsonPosts($jsonFile);
                if (!empty($jsonPosts)) {
                    $insertSql = "INSERT INTO blog_posts (id, status, category, date, read_time, author, image, title_es, title_en, excerpt_es, excerpt_en, content_es, content_en) 
                                  VALUES (:id, :status, :category, :date, :read_time, :author, :image, :title_es, :title_en, :excerpt_es, :excerpt_en, :content_es, :content_en)";
                    $insertStmt = $pdo->prepare($insertSql);
                    foreach ($jsonPosts as $p) {
                        $insertStmt->execute([
                            ':id' => $p['id'],
                            ':status' => $p['status'] ?? 'published',
                            ':category' => $p['category'] ?? 'legal',
                            ':date' => $p['date'] ?? date('Y-m-d'),
                            ':read_time' => $p['readTime'] ?? 4,
                            ':author' => $p['author'] ?? 'Equipo Legal Nayarit Real Estate',
                            ':image' => $p['image'] ?? '',
                            ':title_es' => is_array($p['title']) ? ($p['title']['es'] ?? '') : ($p['title'] ?? ''),
                            ':title_en' => is_array($p['title']) ? ($p['title']['en'] ?? '') : '',
                            ':excerpt_es' => is_array($p['excerpt']) ? ($p['excerpt']['es'] ?? '') : ($p['excerpt'] ?? ''),
                            ':excerpt_en' => is_array($p['excerpt']) ? ($p['excerpt']['en'] ?? '') : '',
                            ':content_es' => is_array($p['content']) ? ($p['content']['es'] ?? '') : ($p['content'] ?? ''),
                            ':content_en' => is_array($p['content']) ? ($p['content']['en'] ?? '') : '',
                        ]);
                    }
                    echo json_encode($jsonPosts, JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }

            // Format rows to match the React frontend structure
            $posts = [];
            foreach ($rows as $row) {
                $posts[] = [
                    'id' => $row['id'],
                    'status' => $row['status'] ?? 'published',
                    'category' => $row['category'] ?? 'legal',
                    'date' => $row['date'],
                    'readTime' => (int)($row['read_time'] ?? 4),
                    'author' => $row['author'] ?? 'Equipo Legal Nayarit Real Estate',
                    'image' => $row['image'] ?? '',
                    'title' => [
                        'es' => $row['title_es'] ?? '',
                        'en' => $row['title_en'] ?? '',
                    ],
                    'excerpt' => [
                        'es' => $row['excerpt_es'] ?? '',
                        'en' => $row['excerpt_en'] ?? '',
                    ],
                    'content' => [
                        'es' => $row['content_es'] ?? '',
                        'en' => $row['content_en'] ?? '',
                    ],
                ];
            }

            // Sync to JSON file for offline backup
            if (!empty($posts)) {
                saveJsonPosts($jsonFile, $posts);
            }

            header('X-DB-Status: mysql_connected');
            echo json_encode($posts, JSON_UNESCAPED_UNICODE);
            exit;
        } catch (Exception $e) {
            header('X-DB-Error: ' . $e->getMessage());
            header('X-DB-Status: fallback_json');
            echo json_encode(getJsonPosts($jsonFile), JSON_UNESCAPED_UNICODE);
            exit;
        }
    } else {
        header('X-DB-Status: fallback_json');
        if (!empty($GLOBALS['lastDbError'])) {
            header('X-DB-Error: ' . preg_replace('/[\r\n]+/', ' ', $GLOBALS['lastDbError']));
        }
        echo json_encode(getJsonPosts($jsonFile), JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data || !is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }

    $id = $data['id'] ?? ('post-' . round(microtime(true) * 1000));
    $status = $data['status'] ?? 'draft';
    $category = $data['category'] ?? 'legal';
    $date = $data['date'] ?? date('Y-m-d');
    $readTime = (int)($data['readTime'] ?? $data['read_time'] ?? 4);
    $author = $data['author'] ?? 'Equipo Legal Nayarit Real Estate';
    $image = $data['image'] ?? '';

    $titleEs = is_array($data['title'] ?? null) ? ($data['title']['es'] ?? '') : ($data['titleEs'] ?? $data['title'] ?? '');
    $titleEn = is_array($data['title'] ?? null) ? ($data['title']['en'] ?? '') : ($data['titleEn'] ?? '');

    $excerptEs = is_array($data['excerpt'] ?? null) ? ($data['excerpt']['es'] ?? '') : ($data['excerptEs'] ?? $data['excerpt'] ?? '');
    $excerptEn = is_array($data['excerpt'] ?? null) ? ($data['excerpt']['en'] ?? '') : ($data['excerptEn'] ?? '');

    $contentEs = is_array($data['content'] ?? null) ? ($data['content']['es'] ?? '') : ($data['contentEs'] ?? $data['content'] ?? '');
    $contentEn = is_array($data['content'] ?? null) ? ($data['content']['en'] ?? '') : ($data['contentEn'] ?? '');

    $normalizedPost = [
        'id' => $id,
        'status' => $status,
        'category' => $category,
        'date' => $date,
        'readTime' => $readTime,
        'author' => $author,
        'image' => $image,
        'title' => ['es' => $titleEs, 'en' => $titleEn],
        'excerpt' => ['es' => $excerptEs, 'en' => $excerptEn],
        'content' => ['es' => $contentEs, 'en' => $contentEn],
    ];

    // Always update JSON backup file so all visitors immediately see it
    $jsonPosts = getJsonPosts($jsonFile);
    $found = false;
    foreach ($jsonPosts as $idx => $p) {
        if ($p['id'] === $id) {
            $jsonPosts[$idx] = $normalizedPost;
            $found = true;
            break;
        }
    }
    if (!$found) {
        array_unshift($jsonPosts, $normalizedPost);
    }
    saveJsonPosts($jsonFile, $jsonPosts);

    // If MySQL is connected, save directly to MySQL
    $dbSaved = false;
    if ($pdo) {
        try {
            $sql = "INSERT INTO blog_posts (id, status, category, date, read_time, author, image, title_es, title_en, excerpt_es, excerpt_en, content_es, content_en)
                    VALUES (:id, :status, :category, :date, :read_time, :author, :image, :title_es, :title_en, :excerpt_es, :excerpt_en, :content_es, :content_en)
                    ON DUPLICATE KEY UPDATE
                      status = VALUES(status),
                      category = VALUES(category),
                      date = VALUES(date),
                      read_time = VALUES(read_time),
                      author = VALUES(author),
                      image = VALUES(image),
                      title_es = VALUES(title_es),
                      title_en = VALUES(title_en),
                      excerpt_es = VALUES(excerpt_es),
                      excerpt_en = VALUES(excerpt_en),
                      content_es = VALUES(content_es),
                      content_en = VALUES(content_en),
                      updated_at = CURRENT_TIMESTAMP";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':status' => $status,
                ':category' => $category,
                ':date' => $date,
                ':read_time' => $readTime,
                ':author' => $author,
                ':image' => $image,
                ':title_es' => $titleEs,
                ':title_en' => $titleEn,
                ':excerpt_es' => $excerptEs,
                ':excerpt_en' => $excerptEn,
                ':content_es' => $contentEs,
                ':content_en' => $contentEn,
            ]);
            $dbSaved = true;
        } catch (Exception $e) {
            header('X-DB-Error: ' . $e->getMessage());
        }
    }

    echo json_encode([
        'success' => true,
        'db_saved' => $dbSaved,
        'post' => $normalizedPost,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing id parameter']);
        exit;
    }

    // Remove from JSON file
    $jsonPosts = getJsonPosts($jsonFile);
    $jsonPosts = array_values(array_filter($jsonPosts, function($p) use ($id) {
        return $p['id'] !== $id;
    }));
    saveJsonPosts($jsonFile, $jsonPosts);

    // Remove from MySQL if connected
    $dbDeleted = false;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $dbDeleted = true;
        } catch (Exception $e) {
            header('X-DB-Error: ' . $e->getMessage());
        }
    }

    echo json_encode([
        'success' => true,
        'db_deleted' => $dbDeleted,
        'id' => $id,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
