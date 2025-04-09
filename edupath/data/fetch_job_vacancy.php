<?php
$resource_id = "d_60ba5027f80aef9a07d747067a948bfc";
$base_url = "https://data.gov.sg/api/action/datastore_search";
$limit = 100;
$offset = 0;
$all_records = [];

echo "🔄 Fetching records from API...\n";

// Fetch all pages
do {
    $url = "$base_url?resource_id=$resource_id&limit=$limit&offset=$offset";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response === false) {
        die("❌ Failed to fetch data from API.\n");
    }

    $data = json_decode($response, true);
    $records = $data['result']['records'] ?? [];

    echo "Fetched " . count($records) . " records at offset $offset\n";
    $all_records = array_merge($all_records, $records);
    $offset += $limit;

    $total = $data['result']['total'] ?? 0;
} while ($offset < $total);

// 🔍 Optional debug: show one sample
if (!empty($all_records)) {
    echo "🔍 Example record:\n";
    print_r($all_records[0]);
}

// Clean and filter 2024 records
$cleaned = array_filter(array_map(function ($record) {
    $rate = $record["job_vacancy_rate"] ?? null;
    $quarter = $record["quarter"] ?? "";

    if (strpos($quarter, "2024") === false) return null;
    if ($rate === '-' || !is_numeric($rate)) return null;

    $industry1 = $record["industry1"] ?? "";
    $industry2 = $record["industry2"] ?? "";
    $occupation1 = $record["occupation1"] ?? "";

    if (empty($industry1) || empty($industry2) || empty($occupation1)) return null;

    return [
        "quarter" => $quarter,
        "sector" => $industry1,
        "sub_sector" => $industry2,
        "occupation" => $occupation1,
        "job_vacancy_rate" => (float) $rate,
    ];
}, $all_records));

// Save
$save_path = 'job_vacancy.json';
file_put_contents($save_path, json_encode(array_values($cleaned), JSON_PRETTY_PRINT));
echo "✅ Saved " . count($cleaned) . " records to: $save_path\n";
?>
