<?php
session_start();
require_once __DIR__ . '/../models/UserProfile.php';
require_once __DIR__ . '/../models/RecommendationModel.php';

if (!isset($_SESSION['user_id'])) {
	echo json_encode(['error' => 'User not logged in']);
	exit();
}

$userProfile = new UserProfile();
$userId = $_SESSION['user_id'];
$profile = $userProfile->getProfile($userId);

if (!$profile) {
	echo json_encode(['error' => 'Profile not found']);
	exit();
}

$userField = $profile['field_name'] ?? '';
$recommended = RecommendationModel::recommendPrograms($userField);

header('Content-Type: application/json');
echo json_encode($recommended);
