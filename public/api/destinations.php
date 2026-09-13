<?php
declare(strict_types=1);

require_once __DIR__ . '/security.php';

sendApiHeaders('GET, POST, OPTIONS');
handleOptions('GET, POST, OPTIONS');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'POST') {
    requireAdmin(true);
}

require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$jsonFile = __DIR__ . '/destinations.json';

function formatDestinationRow(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'name' => [
            'es' => (string)($row['name_es'] ?? ''),
            'en' => (string)($row['name_en'] ?? ''),
        ],
        'desc' => [
            'es' => (string)($row['desc_es'] ?? ''),
            'en' => (string)($row['desc_en'] ?? ''),
        ],
        'tag' => [
            'es' => (string)($row['tag_es'] ?? ''),
            'en' => (string)($row['tag_en'] ?? ''),
        ],
        'image' => (string)($row['image'] ?? ''),
    ];
}

if ($method === 'GET') {
    $destinations = readJsonArray($jsonFile);
    $destinationsById = [];
    foreach ($destinations as $destination) {
        if (is_array($destination) && isset($destination['id'])) {
            $destinationsById[(string)$destination['id']] = $destination;
        }
    }
    if ($pdo) {
        try {
            $rows = $pdo->query('SELECT * FROM destinations ORDER BY id')->fetchAll();
            foreach (array_map('formatDestinationRow', $rows) as $databaseDestination) {
                $destinationsById[$databaseDestination['id']] = $databaseDestination;
            }
        } catch (PDOException $e) {
            error_log('Unable to read destinations from database');
        }
    }
    jsonResponse(array_values($destinationsById));
}

if ($method === 'POST') {
    $data = readJsonBody();
    $id = validateId($data['id'] ?? '');
    $savedDestination = null;

    updateJsonArrayAtomic($jsonFile, static function (array $destinations) use ($data, $id, &$savedDestination): array {
        foreach ($destinations as $index => $destination) {
            if (($destination['id'] ?? null) !== $id) {
                continue;
            }

            $name = is_array($destination['name'] ?? null) ? $destination['name'] : [];
            $desc = is_array($destination['desc'] ?? null) ? $destination['desc'] : [];
            $tag = is_array($destination['tag'] ?? null) ? $destination['tag'] : [];
            $incomingName = is_array($data['name'] ?? null) ? $data['name'] : [];
            $incomingDesc = is_array($data['desc'] ?? null) ? $data['desc'] : [];
            $incomingTag = is_array($data['tag'] ?? null) ? $data['tag'] : [];

            $savedDestination = [
                'id' => $id,
                'name' => [
                    'es' => cleanPlainText($incomingName['es'] ?? $data['nameEs'] ?? $name['es'] ?? '', 150, true),
                    'en' => cleanPlainText($incomingName['en'] ?? $data['nameEn'] ?? $name['en'] ?? '', 150, true),
                ],
                'desc' => [
                    'es' => cleanPlainText($incomingDesc['es'] ?? $data['descEs'] ?? $desc['es'] ?? '', 2000),
                    'en' => cleanPlainText($incomingDesc['en'] ?? $data['descEn'] ?? $desc['en'] ?? '', 2000),
                ],
                'tag' => [
                    'es' => cleanPlainText($incomingTag['es'] ?? $data['tagEs'] ?? $tag['es'] ?? '', 150),
                    'en' => cleanPlainText($incomingTag['en'] ?? $data['tagEn'] ?? $tag['en'] ?? '', 150),
                ],
                'image' => array_key_exists('image', $data)
                    ? validateImage($data['image'])
                    : validateImage($destination['image'] ?? ''),
            ];
            $destinations[$index] = $savedDestination;
            return array_values($destinations);
        }

        jsonResponse(['error' => 'Destination not found'], 404);
    });

    $dbSaved = false;
    if ($pdo && $savedDestination) {
        try {
            $statement = $pdo->prepare(
                'INSERT INTO destinations (id, name_es, name_en, desc_es, desc_en, tag_es, tag_en, image)
                 VALUES (:id, :name_es, :name_en, :desc_es, :desc_en, :tag_es, :tag_en, :image)
                 ON DUPLICATE KEY UPDATE name_es = VALUES(name_es), name_en = VALUES(name_en),
                 desc_es = VALUES(desc_es), desc_en = VALUES(desc_en), tag_es = VALUES(tag_es),
                 tag_en = VALUES(tag_en), image = VALUES(image), updated_at = CURRENT_TIMESTAMP'
            );
            $statement->execute([
                ':id' => $id,
                ':name_es' => $savedDestination['name']['es'],
                ':name_en' => $savedDestination['name']['en'],
                ':desc_es' => $savedDestination['desc']['es'],
                ':desc_en' => $savedDestination['desc']['en'],
                ':tag_es' => $savedDestination['tag']['es'],
                ':tag_en' => $savedDestination['tag']['en'],
                ':image' => $savedDestination['image'],
            ]);
            $dbSaved = true;
        } catch (PDOException $e) {
            error_log('Unable to save destination to database');
        }
    }

    jsonResponse(['success' => true, 'db_saved' => $dbSaved, 'destination' => $savedDestination]);
}

jsonResponse(['error' => 'Method not allowed'], 405);
