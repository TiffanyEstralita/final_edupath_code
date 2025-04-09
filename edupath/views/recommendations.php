<?php

// Include the recommendation model
require_once __DIR__ . '/../models/RecommendationModel.php';

// Example: Assuming the user's field is 'Business'
$userField = 'Business';

// Fetch the recommended programs
$recommendedPrograms = RecommendationModel::recommendPrograms($userField);

// Check if the form has been submitted
$institutionFilter = isset($_POST['institution']) ? $_POST['institution'] : '';

// Filter the recommended programs by institution if a filter is set
if ($institutionFilter) {
    $recommendedPrograms = RecommendationModel::filterByInstitution($recommendedPrograms, $institutionFilter);
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recommended Educational Programs</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <h1>Recommended Educational Programs</h1>

    <div id="recommendations-container">
        <?php if (count($recommendedPrograms) > 0): ?>
            <?php foreach ($recommendedPrograms as $program): ?>
                <div class="program">
                    <h3>
                        <?php echo htmlspecialchars($program['course_name']); ?>
                    </h3>
                    <p><strong>Provider:</strong>
                        <?php echo htmlspecialchars($program['institution']); ?>
                    </p>
                    <p><strong>Mode of Study:</strong>
                        <?php echo htmlspecialchars($program['mode_of_study']); ?>
                    </p>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>No recommended programs found.</p>
        <?php endif; ?>
    </div>

    <!-- Filter Button -->
    <button id="filter-button" onclick="toggleFilterForm()">Filter by Institution</button>

    <!-- Filter Form (initially hidden) -->
    <div id="filter-form" style="display: none;">
        <form method="POST" action="">
            <label for="institution">Enter Institution Name:</label>
            <input type="text" id="institution" name="institution" value="<?php echo htmlspecialchars($institutionFilter); ?>">
            <button type="submit">Filter</button>
        </form>
    </div>

    <script>
        function toggleFilterForm() {
            var filterForm = document.getElementById('filter-form');
            if (filterForm.style.display === 'none') {
                filterForm.style.display = 'block';
            } else {
                filterForm.style.display = 'none';
            }
        }
    </script>
</body>

</html>