<?php
require_once __DIR__ . '/../models/RecommendationModel.php';
require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);
$firebaseUid = $data['firebase_uid'] ?? '';

if (empty($firebaseUid)) {
    echo json_encode(['error' => 'Firebase UID is required']);
    exit();
}

try {
    $db = new Database();
    $pdo = $db->getConnection();

    $stmt = $pdo->prepare("SELECT interests FROM user_profiles WHERE firebase_uid = ?");
    $stmt->execute([$firebaseUid]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['error' => 'User profile not found']);
        exit();
    }

    $recommended = RecommendationModel::recommendPrograms($user['interests']);

    header('Content-Type: application/json');
    echo json_encode($recommended);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
