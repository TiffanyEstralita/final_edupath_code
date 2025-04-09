const fs = require('fs');

// Load the original dataset
const rawData = JSON.parse(fs.readFileSync('job_vacancy.json', 'utf-8'));

// Step 1: Find the latest quarter
const allQuarters = [...new Set(rawData.map(item => item.quarter))];
const latestQuarter = allQuarters.sort().reverse()[0]; // e.g., "2024-Q4"

// Step 2: Filter based on criteria
const filtered = rawData.filter(item =>
	item.quarter === latestQuarter &&
	item.sector === 'total' &&
	item.sub_sector === 'total' &&
	item.occupation !== 'total'
);

// Step 3: Save the result
fs.writeFileSync('job_vacancy_filtered.json', JSON.stringify(filtered, null, 2));

console.log(`Filtered ${filtered.length} records for quarter ${latestQuarter}`);
