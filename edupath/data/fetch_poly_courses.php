<?php
$dataset_id = "d_ed954811feca5b413c191b3a0ee557b6";
$url = "https://data.gov.sg/api/action/datastore_search?resource_id=" . $dataset_id;

$response = file_get_contents($url);
header('Content-Type: application/json');
echo $response;
?>
