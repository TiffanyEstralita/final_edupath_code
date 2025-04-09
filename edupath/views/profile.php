<?php
session_start();
require_once __DIR__ . '/../models/UserProfile.php';

if (!isset($_SESSION['user_id'])) {
    echo "You need to log in first.";
    exit();
}

$userProfile = new UserProfile();
$userId = $_SESSION['user_id'];
$profile = $userProfile->getProfile($userId);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Your Profile</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Your Profile</h1>

    <p><strong>Name:</strong> <?= htmlspecialchars($profile['name'] ?? 'Not available') ?></p>
    <p><strong>Email:</strong> <?= htmlspecialchars($profile['email'] ?? 'Not available') ?></p>
    <p><strong>Field of Interest:</strong> <?= htmlspecialchars($profile['field_name'] ?? 'Not set') ?></p>
    <p><strong>Education Level:</strong> <?= htmlspecialchars($profile['education_level'] ?? 'Not set') ?></p>

    <hr>
    <a href="settings.php"><button>Edit Profile</button></a>
    <br><br>
    <a href="dashboard.php"><button>Back to Dashboard</button></a>
</body>
</html>
