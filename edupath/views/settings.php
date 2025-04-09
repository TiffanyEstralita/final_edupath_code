<?php
session_start();
require_once __DIR__ . '/../models/UserProfile.php';

if (!isset($_SESSION['user_id'])) {
    echo "You need to log in first.";
    exit();
}

$userProfile = new UserProfile();
$userId = $_SESSION['user_id'];

$fields = $userProfile->getFieldsOfInterest();
$educationLevels = $userProfile->getEducationLevels();
$profile = $userProfile->getProfile($userId);

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fieldOfInterestId = filter_input(INPUT_POST, 'field_of_interest', FILTER_VALIDATE_INT);
    $educationLevelId = filter_input(INPUT_POST, 'education_level', FILTER_VALIDATE_INT);

    if ($fieldOfInterestId && $educationLevelId) {
        if ($userProfile->updateProfile($userId, $name, $fieldOfInterestId, $educationLevelId)
		) {
            header("Location: profile.php");
            exit();
        } else {
            $error = "Failed to update profile.";
        }
    } else {
        $error = "Please fill in all fields.";
    }

    $profile = $userProfile->getProfile($userId); // refresh in case of error
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Profile</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<h1>Edit Your Profile</h1>

<?php if ($error): ?>
    <p style="color:red;"><?= htmlspecialchars($error) ?></p>
<?php endif; ?>

<form method="POST" action="settings.php">
    <label for="field_of_interest">Field of Interest:</label>
    <select name="field_of_interest" required>
        <option value="" disabled>Select a field</option>
        <?php foreach ($fields as $field): ?>
            <option value="<?= $field['id'] ?>" <?= ($profile['field_name'] === $field['field_name']) ? 'selected' : '' ?>>
                <?= htmlspecialchars($field['field_name']) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <label for="education_level">Education Level:</label>
    <select name="education_level" required>
        <option value="" disabled>Select your education level</option>
        <?php foreach ($educationLevels as $level): ?>
            <option value="<?= $level['id'] ?>" <?= ($profile['education_level'] === $level['education_level']) ? 'selected' : '' ?>>
                <?= htmlspecialchars($level['education_level']) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <button type="submit">Save Changes</button>
</form>

<hr>
<a href="dashboard.php"><button>Back to Dashboard</button></a>

</body>
</html>
