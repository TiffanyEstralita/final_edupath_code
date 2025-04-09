<?php
$resource_id = "d_3c55210de27fcccda2ed0c63fdd2b352";
$base_url = "https://data.gov.sg/api/action/datastore_search";
$limit = 100;
$offset = 0;
$all_records = [];

do {
    $url = "$base_url?resource_id=$resource_id&limit=$limit&offset=$offset";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response === false) {
        die("❌ Failed to fetch data from API.");
    }

    $data = json_decode($response, true);
    $records = $data['result']['records'] ?? [];

    $all_records = array_merge($all_records, $records);
    $offset += $limit;

    $total = $data['result']['total'] ?? 0;
    echo "Fetched " . count($records) . " records at offset $offset\n";
} while ($offset < $total);

// Clean the data
$cleaned = array_filter(array_map(function ($record) {
    $degree = $record["degree"] ?? "";
    $employment = $record["employment_rate_overall"] ?? null;
    $salary = $record["basic_monthly_mean"] ?? null;

    // Skip if degree is empty or employment rate is not numeric
    if (empty($degree) || !is_numeric($employment)) {
        return null;
    }

    return [
        "year" => $record["year"] ?? "",
        "university" => $record["university"] ?? "",
        "degree" => $degree,
        "employment_rate" => (float) $employment,
        "median_salary" => is_numeric($salary) ? (float) $salary : null,
    ];
}, $all_records));

// Save to JSON
try {
    $json = json_encode($cleaned, JSON_PRETTY_PRINT);
    if (file_put_contents("graduate_employment.json", $json)) {
        echo "✅ Saved " . count($cleaned) . " records to graduate_employment.json\n";
    } else {
        echo "❌ Failed to save data to graduate_employment.json\n";
    }
} catch (Exception $e) {
    echo "❌ An error occurred: " . $e->getMessage() . "\n";
}
?>
