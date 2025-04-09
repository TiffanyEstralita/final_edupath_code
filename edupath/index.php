<?php
session_start();

// If user is already logged in, redirect to profile page
// if (isset($_SESSION['user_id']) && basename($_SERVER['PHP_SELF']) === 'index.php') {
//     header("Location: profile.php");
//     exit();
// }

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduPath - Welcome</title>
    <link rel="stylesheet" href="styles.css"> <!-- Add your CSS file -->
</head>
<body>
    <div class="container">
        <h2>Welcome to EduPath</h2>
        <p>Your guide to education and career planning</p>
        <div class="buttons">
            <a href="views/login.php" class="btn">Login</a>
            <a href="views/register.php" class="btn">Sign Up</a>
        </div>
    </div>
</body>
</html>
