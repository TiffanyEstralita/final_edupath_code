<?php
session_start();

// Database connection
require_once __DIR__ . '/../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// Sanitize inputs
	$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
	$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

	if (!empty($email) && !empty($password)) {
		// Hash the password securely
		$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

		$db = new Database();
		$conn = $db->getConnection();

		// Check if email already exists
		$query = "SELECT * FROM user_profiles WHERE email = :email";
		$stmt = $conn->prepare($query);
		$stmt->bindParam(':email', $email);
		$stmt->execute();

		if ($stmt->rowCount() > 0) {
			echo "Email already exists.";
		} else {
			// Insert user (only email & password for now)
			$query = "INSERT INTO user_profiles (email, password, created_at) 
			          VALUES (:email, :password, NOW())";
			$stmt = $conn->prepare($query);
			$stmt->bindParam(':email', $email);
			$stmt->bindParam(':password', $hashedPassword);

			if ($stmt->execute()) {
				// Store session
				$_SESSION['user_id'] = $conn->lastInsertId();
				$_SESSION['email'] = $email;

				// Redirect to profile completion (if needed)
				header("Location: complete_profile.php");
				exit();
			} else {
				echo "Failed to register user.";
			}
		}
	} else {
		echo "Please enter both email and password.";
	}
}
?>

<!-- HTML Registration Form
<form method="POST" action="register.php">
	<label for="email">Email:</label>
	<input type="email" name="email" required>

	<label for="password">Password:</label>
	<input type="password" name="password" required>

	<button type="submit">Register</button>
</form> -->
