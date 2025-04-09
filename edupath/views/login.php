<?php
session_start();

// Database connection
require_once __DIR__ . '/../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// Sanitize inputs
	$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
	$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

	// Ensure inputs are not empty
	if (!empty($email) && !empty($password)) {
		$db = new Database();
		$conn = $db->getConnection();

		// Check if the user exists
		$query = "SELECT * FROM user_profiles WHERE email = :email";
		$stmt = $conn->prepare($query);
		$stmt->bindParam(':email', $email);
		$stmt->execute();

		if ($stmt->rowCount() > 0) {
			$user = $stmt->fetch(PDO::FETCH_ASSOC);

			// Debugging the fetched password and the user
			//var_dump($user);  // Check the full user data to ensure 'user_id' exists

			// Verify the password
			if (password_verify($password, $user['password'])) {
				// Store user data in session variables
				$_SESSION['user_id'] = $user['id'];
				$_SESSION['name'] = $user['name'];

				// Regenerate session ID for security
				session_regenerate_id(true);

				// Debugging session variables
				var_dump($_SESSION); // Check if session variables are set correctly

				// Redirect to profile page after login
				header("Location: profile.php");
				exit;
			} else {
				error_log("Login failed for email: $email - Incorrect password.");
				echo "Invalid login credentials.";
			}
		} else {
			error_log("Login failed for email: $email - Incorrect password.");
			echo "Invalid login credentials.";
		}
	} else {
		echo "Please fill in both fields.";
	}
}
?>

<form method="POST" action="login.php">
	<label for="email">Email:</label>
	<input type="email" name="email" required>

	<label for="password">Password:</label>
	<input type="password" name="password" required>

	<button type="submit">Login</button>
</form>