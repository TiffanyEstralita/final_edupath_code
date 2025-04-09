<?php
session_start();
require_once __DIR__ . '/../models/UserProfile.php';

if (!isset($_SESSION['user_id'])) {
	echo "You need to log in first.";
	exit();
}

$userProfile = new UserProfile();
$userId = $_SESSION['user_id'];

// Fetch user profile data
$profile = $userProfile->getProfile($userId);
$fields = $userProfile->getFieldsOfInterest();
$educationLevels = $userProfile->getEducationLevels();

$error = '';
$success = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$name = trim($_POST['name'] ?? '');
	$fieldOfInterestId = $_POST['field_of_interest'] ?? null;
	$educationLevelId = $_POST['education_level'] ?? null;

	if ($name && $fieldOfInterestId && $educationLevelId) {
		// Update profile with new name, field of interest, and education level
		$success = $userProfile->updateProfile($userId, $name, $fieldOfInterestId, $educationLevelId);

		if ($success) {
			// Refresh profile data after update
			$profile = $userProfile->getProfile($userId);
			header("Location: profile.php");
			exit();
		} else {
			$error = "Failed to update profile.";
		}
	} else {
		$error = "Please fill in all fields.";
	}
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Complete Profile</title>
	<link rel="stylesheet" href="styles.css">
</head>
<body>

	<h1>Complete Your Profile</h1>

	<?php if ($error): ?>
		<p style="color:red;"><?= htmlspecialchars($error) ?></p>
	<?php endif; ?>

	<form method="POST" action="complete_profile.php">
		<!-- Editable name field -->
		<label for="name">Name:</label>
		<input type="text" name="name" value="<?= htmlspecialchars($profile['name'] ?? '') ?>" required>

		<!-- Field of Interest dropdown -->
		<label for="field_of_interest">Field of Interest:</label>
		<select name="field_of_interest" required>
			<option value="" disabled <?= empty($profile['field_name']) ? 'selected' : '' ?>>Select a field</option>
			<?php foreach ($fields as $field): ?>
				<option value="<?= $field['id'] ?>" 
					<?= ($profile['field_name'] === $field['field_name']) ? 'selected' : '' ?>>
					<?= htmlspecialchars($field['field_name']) ?>
				</option>
			<?php endforeach; ?>
		</select>

		<!-- Education Level dropdown -->
		<label for="education_level">Education Level:</label>
		<select name="education_level" required>
			<option value="" disabled <?= empty($profile['education_level']) ? 'selected' : '' ?>>Select your education level</option>
			<?php foreach ($educationLevels as $level): ?>
				<option value="<?= $level['id'] ?>"
					<?= ($profile['education_level'] === $level['education_level']) ? 'selected' : '' ?>>
					<?= htmlspecialchars($level['education_level']) ?>
				</option>
			<?php endforeach; ?>
		</select>

		<button type="submit">Update Profile</button>
	</form>

</body>
</html>
