<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "Script started...\n";

// Import database connection (if needed)
require '../config/database.php';

// Load dataset URLs from datasets.php
$datasets = require '../config/datasets.php';

// Read and decode the JSON data from api_data.json
$jsonData = file_get_contents('api_data.json');
if ($jsonData === false) {
    die("Error: Unable to read api_data.json");
}

$apiData = json_decode($jsonData, true);
if ($apiData === null) {
    die("Error: JSON decoding failed - " . json_last_error_msg());
}

$apiDataRecords = [];
if (isset($apiData['result']['records'])) {
    foreach ($apiData['result']['records'] as $record) {
        $apiDataRecords[$record['degree']] = $record;
    }
}
echo "API data loaded successfully. Total records: " . count($apiDataRecords) . "\n";

// Define the $allPrograms variable
$allPrograms = []; 

// 1. Fetch from datasets.php URLs
foreach ($datasets as $institution => $url) {
    echo "Fetching data for: $institution\n";

    $response = file_get_contents($url);
    if ($response === false) {
        echo "Error: Could not fetch data from $url\n";
        continue;
    }

    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "JSON Error: " . json_last_error_msg() . " for $institution\n";
        continue;
    }

    if (isset($data['result']['records'])) {
        foreach ($data['result']['records'] as $record) {
            $courseName = $record['course_name'] ?? 'Unknown';
            $mode = strtolower($record['mode_of_study'] ?? 'full-time');

            $mode = match ($mode) {
                'ft', 'full-time' => 'Full-time',
                'pt', 'part-time' => 'Part-time',
                default => 'Full-time',
            };

            $allPrograms[] = [
                'course_name' => $courseName,
                'institution' => $institution,
                'mode_of_study' => $mode,
            ];
        }
        echo "Data for $institution imported successfully!\n";
    } else {
        echo "No records found for $institution.\n";
    }
}

// 2. Merge in api_data.json
foreach ($apiDataRecords as $degree => $record) {
    $courseName = $record['degree'] ?? 'Unknown';
    $institution = $record['university'] ?? 'Unknown';
    $mode = 'Full-time';

    $allPrograms[] = [
        'course_name' => $courseName,
        'institution' => $institution,
        'mode_of_study' => $mode,
    ];
}

// 3. Merge in courses.csv
$csvPath = 'courses.csv';
if (file_exists($csvPath)) {
    echo "Reading courses.csv...\n";
    if (($handle = fopen($csvPath, 'r')) !== false) {
        $header = fgetcsv($handle, 1000, ",");
        while (($row = fgetcsv($handle, 1000, ",")) !== false) {
            $data = array_combine($header, $row);

            $mode = strtolower($data['mode_of_study'] ?? 'full-time');
            $mode = match ($mode) {
                'ft', 'full-time' => 'Full-time',
                'pt', 'part-time' => 'Part-time',
                default => 'Full-time',
            };

            $allPrograms[] = [
                'course_name' => $data['course_name'] ?? 'Unknown',
                'institution' => $data['institution'] ?? 'Ngee Ann Polytechnic',
                'mode_of_study' => $mode,
            ];
        }
        fclose($handle);
        echo "courses.csv loaded.\n";
    }
}

// 4. Merge from graduate_employment.json
$gesPath = __DIR__ . '/../data/graduate_employment.json';
if (file_exists($gesPath)) {
    $gesData = json_decode(file_get_contents($gesPath), true);
    if (is_array($gesData)) {
        foreach ($gesData as $entry) {
            $allPrograms[] = [
                'course_name' => $entry['degree'] ?? 'Unknown',
                'institution' => $entry['university'] ?? 'Unknown',
                'mode_of_study' => 'Full-time',
            ];
        }
        echo "✅ Added courses from graduate_employment.json (" . count($gesData) . " entries)\n";
    } else {
        echo "⚠️ Failed to parse graduate_employment.json\n";
    }
} else {
    echo "⚠️ graduate_employment.json not found\n";
}

// 5. Fetch part-time diplomas from data.gov.sg dataset
echo "Fetching part-time diplomas from SkillsFuture...\n";
$partTimeDatasetId = "d_ed954811feca5b413c191b3a0ee557b6";
$ptdUrl = "https://data.gov.sg/api/action/datastore_search?resource_id=" . $partTimeDatasetId;

$ptdResponse = file_get_contents($ptdUrl);
if ($ptdResponse !== false) {
    $ptdData = json_decode($ptdResponse, true);
    if (isset($ptdData['result']['records'])) {
        foreach ($ptdData['result']['records'] as $record) {
            $allPrograms[] = [
                'course_name' => $record['course_name'] ?? 'Unknown',
                'institution' => $record['institution'] ?? 'Unknown',
                'mode_of_study' => $record['mode_of_study'] ?? 'Full-time',
            ];
        }
        echo "✅ Added part-time diploma programs (" . count($ptdData['result']['records']) . " entries)\n";
    } else {
        echo "⚠️ No records found in part-time diplomas dataset\n";
    }
} else {
    echo "❌ Failed to fetch part-time diploma data\n";
}

// 6. Deduplicate
$uniquePrograms = [];
foreach ($allPrograms as $program) {
    $key = strtolower($program['institution'] . '|' . $program['course_name']);
    $uniquePrograms[$key] = $program;
}
echo "Total unique programs: " . count($uniquePrograms) . "\n";

// 7. Save to JSON
$jsonFilePath = __DIR__ . '/../data/programs.json';
if (file_put_contents($jsonFilePath, json_encode(array_values($uniquePrograms), JSON_PRETTY_PRINT))) {
    echo "✅ Data saved to programs.json successfully!\n";
} else {
    echo "❌ Error writing to programs.json\n";
}

?>
