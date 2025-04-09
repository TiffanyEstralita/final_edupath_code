<?php
$resource_id = "d_8f024ddf2553d81ee00ede55b1d9b0ff"; // Dataset you mentioned
$base_url = "https://data.gov.sg/api/action/datastore_search";
$limit = 100;
$offset = 0;
$all_records = [];

do {
    $url = "$base_url?resource_id=$resource_id&limit=$limit&offset=$offset";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Disable SSL verification (for testing only; not recommended for production)
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    // Optionally set a user agent if needed
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; PHP script)');

    $response = curl_exec($ch);

    // Capture any cURL error before closing the handle
    if ($response === false) {
        $error = curl_error($ch);
        $error_code = curl_errno($ch); // Capture the error code as well
        curl_close($ch);
        die("❌ Failed to fetch data from API. Error ($error_code): $error\n");
    }

    curl_close($ch);

    $data = json_decode($response, true);
    if ($data['success']) {
        // Process the records (for debug purposes)
        //foreach ($data['result']['records'] as $record) {
          //  echo "Data Series: " . $record['DataSeries'] . "\n";
            //echo "2023: " . $record['2023'] . "\n";
        //}
    } else {
        echo "Error: " . $data['help'] . "\n";
    }

    $records = $data['result']['records'] ?? [];

    $all_records = array_merge($all_records, $records);
    $offset += $limit;

    $total = $data['result']['total'] ?? 0;
    //echo "Fetched " . count($records) . " records at offset $offset\n";
} while ($offset < $total);

// The API records don't have keys "year", "sex", "occupation", or "median_gross_monthly_income"
// Instead, we use "DataSeries" to extract occupation and sex,
// and we use the "2023" key as the median income for the year 2023.
$cleaned = array_map(function ($record) {
    // Extract the combined data series string
    $dataSeries = $record["DataSeries"] ?? "";
    $occupation = $dataSeries;
    $sex = "";
    // Split on " - " if present to get occupation and sex separately
    if (strpos($dataSeries, " - ") !== false) {
        list($occupation, $sex) = explode(" - ", $dataSeries, 2);
    }
    
    return [
        "year" => "2023", // Hardcoded to 2023; change as needed
        "sex" => $sex,
        "occupation" => $occupation,
        // Use the "2023" key from the record for median income
        "median_income" => isset($record["2023"]) && is_numeric($record["2023"])
            ? (float) $record["2023"]
            : null,
    ];
}, $all_records);

// Save to JSON
try {
    $json = json_encode($cleaned, JSON_PRETTY_PRINT);
    if (file_put_contents("median_income_by_occupation.json", $json)) {
        echo "✅ Saved " . count($cleaned) . " records to median_income_by_occupation.json\n";
    } else {
        echo "❌ Failed to save data to median_income_by_occupation.json\n";
    }
} catch (Exception $e) {
    echo "❌ An error occurred: " . $e->getMessage() . "\n";
}
?>
