import requests
import json

# Define dataset ID and URL
dataset_id = "d_3c55210de27fcccda2ed0c63fdd2b352"
url = f"https://data.gov.sg/api/action/datastore_search?resource_id={dataset_id}"

# Send GET request to the API
response = requests.get(url)

# Check if the response is successful
if response.status_code == 200:
    data = response.json()  # Get the JSON response
    # Save the data to a JSON file
    with open('api_data.json', 'w') as f:
        json.dump(data, f, indent=4)
    print("Data saved to api_data.json")
else:
    print(f"Failed to retrieve data. Status code: {response.status_code}")

# Optionally, fetch collection metadata
collection_id = 1503
url = f"https://api-production.data.gov.sg/v2/public/api/collections/{collection_id}/metadata"

response = requests.get(url)
