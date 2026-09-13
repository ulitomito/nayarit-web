<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$jsonFile = __DIR__ . '/destinations.json';

function getJsonDestinations($jsonFile) {
    if (file_exists($jsonFile)) {
        $content = file_get_contents($jsonFile);
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return [];
}

function saveJsonDestinations($jsonFile, $destinations) {
    file_put_contents($jsonFile, json_encode($destinations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM destinations");
            $rows = $stmt->fetchAll();

            if (empty($rows)) {
                // Table is empty, seed from JSON
                $jsonDests = getJsonDestinations($jsonFile);
                if (!empty($jsonDests)) {
                    $insertSql = "INSERT INTO destinations (id, name_es, name_en, desc_es, desc_en, tag_es, tag_en, image)
                                  VALUES (:id, :name_es, :name_en, :desc_es, :desc_en, :tag_es, :tag_en, :image)";
                    $insertStmt = $pdo->prepare($insertSql);
                    foreach ($jsonDests as $d) {
                        $insertStmt->execute([
                            ':id' => $d['id'],
                            ':name_es' => is_array($d['name']) ? ($d['name']['es'] ?? '') : ($d['name'] ?? ''),
                            ':name_en' => is_array($d['name']) ? ($d['name']['en'] ?? '') : '',
                            ':desc_es' => is_array($d['desc']) ? ($d['desc']['es'] ?? '') : ($d['desc'] ?? ''),
                            ':desc_en' => is_array($d['desc']) ? ($d['desc']['en'] ?? '') : '',
                            ':tag_es' => is_array($d['tag']) ? ($d['tag']['es'] ?? '') : ($d['tag'] ?? ''),
                            ':tag_en' => is_array($d['tag']) ? ($d['tag']['en'] ?? '') : '',
                            ':image' => $d['image'] ?? '',
                        ]);
                    }
                    echo json_encode($jsonDests, JSON_UNESCAPED_UNICODE);
                    exit;
                }
            }

            $destinations = [];
            foreach ($rows as $row) {
                $destinations[] = [
                    'id' => $row['id'],
                    'name' => [
                        'es' => $row['name_es'] ?? '',
                        'en' => $row['name_en'] ?? '',
                    ],
                    'desc' => [
                        'es' => $row['desc_es'] ?? '',
                        'en' => $row['desc_en'] ?? '',
                    ],
                    'tag' => [
                        'es' => $row['tag_es'] ?? '',
                        'en' => $row['tag_en'] ?? '',
                    ],
                    'image' => $row['image'] ?? '',
                ];
            }

            if (!empty($destinations)) {
                saveJsonDestinations($jsonFile, $destinations);
            }

            echo json_encode($destinations, JSON_UNESCAPED_UNICODE);
            exit;
        } catch (Exception $e) {
            header('X-DB-Error: ' . $e->getMessage());
            echo json_encode(getJsonDestinations($jsonFile), JSON_UNESCAPED_UNICODE);
            exit;
        }
    } else {
        echo json_encode(getJsonDestinations($jsonFile), JSON_UNESCAPED_UNICODE);
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

    $id = $data['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing id']);
        exit;
    }

    $jsonDests = getJsonDestinations($jsonFile);
    $targetDest = null;
    $targetIdx = -1;

    foreach ($jsonDests as $idx => $d) {
        if ($d['id'] === $id) {
            $targetDest = $d;
            $targetIdx = $idx;
            break;
        }
    }

    if (!$targetDest) {
        $targetDest = [
            'id' => $id,
            'name' => ['es' => $data['nameEs'] ?? $data['name'] ?? $id, 'en' => $data['nameEn'] ?? $data['name'] ?? $id],
            'desc' => ['es' => $data['descEs'] ?? $data['desc'] ?? '', 'en' => $data['descEn'] ?? $data['desc'] ?? ''],
            'tag' => ['es' => $data['tagEs'] ?? '', 'en' => $data['tagEn'] ?? ''],
            'image' => $data['image'] ?? '',
        ];
    }

    // Update image if provided
    if (isset($data['image'])) {
        $targetDest['image'] = $data['image'];
    }

    // Update tags if provided
    if (isset($data['tag'])) {
        if (is_array($data['tag'])) {
            $targetDest['tag']['es'] = $data['tag']['es'] ?? $targetDest['tag']['es'];
            $targetDest['tag']['en'] = $data['tag']['en'] ?? $targetDest['tag']['en'];
        } else {
            $targetDest['tag']['es'] = $data['tag'];
            $targetDest['tag']['en'] = $data['tag'];
        }
    }
    if (isset($data['tagEs'])) $targetDest['tag']['es'] = $data['tagEs'];
    if (isset($data['tagEn'])) $targetDest['tag']['en'] = $data['tagEn'];

    // Update names if provided
    if (isset($data['name']) && is_array($data['name'])) {
        $targetDest['name']['es'] = $data['name']['es'] ?? $targetDest['name']['es'];
        $targetDest['name']['en'] = $data['name']['en'] ?? $targetDest['name']['en'];
    }

    // Update descs if provided
    if (isset($data['desc']) && is_array($data['desc'])) {
        $targetDest['desc']['es'] = $data['desc']['es'] ?? $targetDest['desc']['es'];
        $targetDest['desc']['en'] = $data['desc']['en'] ?? $targetDest['desc']['en'];
    }

    // Save to JSON backup
    if ($targetIdx >= 0) {
        $jsonDests[$targetIdx] = $targetDest;
    } else {
        $jsonDests[] = $targetDest;
    }
    saveJsonDestinations($jsonFile, $jsonDests);

    // Save to MySQL if connected
    $dbSaved = false;
    if ($pdo) {
        try {
            $sql = "INSERT INTO destinations (id, name_es, name_en, desc_es, desc_en, tag_es, tag_en, image)
                    VALUES (:id, :name_es, :name_en, :desc_es, :desc_en, :tag_es, :tag_en, :image)
                    ON DUPLICATE KEY UPDATE
                      name_es = VALUES(name_es),
                      name_en = VALUES(name_en),
                      desc_es = VALUES(desc_es),
                      desc_en = VALUES(desc_en),
                      tag_es = VALUES(tag_es),
                      tag_en = VALUES(tag_en),
                      image = VALUES(image),
                      updated_at = CURRENT_TIMESTAMP";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':name_es' => $targetDest['name']['es'] ?? '',
                ':name_en' => $targetDest['name']['en'] ?? '',
                ':desc_es' => $targetDest['desc']['es'] ?? '',
                ':desc_en' => $targetDest['desc']['en'] ?? '',
                ':tag_es' => $targetDest['tag']['es'] ?? '',
                ':tag_en' => $targetDest['tag']['en'] ?? '',
                ':image' => $targetDest['image'] ?? '',
            ]);
            $dbSaved = true;
        } catch (Exception $e) {
            header('X-DB-Error: ' . $e->getMessage());
        }
    }

    echo json_encode([
        'success' => true,
        'db_saved' => $dbSaved,
        'destination' => $targetDest,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
