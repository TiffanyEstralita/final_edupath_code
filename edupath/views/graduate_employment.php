<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Graduate Employment Survey</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: sans-serif;
      padding: 20px;
    }
    canvas {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <h2>Graduate Employment Outcomes (Latest Year)</h2>
  <canvas id="gesChart"></canvas>
  <div id="error-message"></div>

  <script>
    // Constants
    const DATA_URL = '../data/graduate_employment.json';
    const CHART_ID = 'gesChart';
    const ERROR_MESSAGE_ID = 'error-message';

    // Function to fetch data
    async function fetchData(url) {
      try {
        console.log(`Fetching data from ${url}...`);
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = await response.json();
        return Object.values(data); // Extract the data points as an array
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        throw error;
      }
    }

    // Function to generate chart
    function generateChart(data) {
      const latestYear = Math.max(...data.map(item => parseInt(item.year)));
      const filtered = data.filter(item => parseInt(item.year) === latestYear && item.employment_rate !== null);

      filtered.sort((a, b) => b.employment_rate - a.employment_rate);

      const labels = filtered.map(item => item.degree + " (" + item.university + ")");
      const values = filtered.map(item => parseFloat(item.employment_rate));

      new Chart(document.getElementById(CHART_ID), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: "Employment Rate (%)",
            data: values,
            backgroundColor: '#34A853'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => context.parsed.y + '%'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                maxRotation: 90,
                minRotation: 60,
                autoSkip: false
              }
            },
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Employment Rate (%)'
              }
            }
          }
        }
      });
    }

    // Main function
    async function main() {
      try {
        const data = await fetchData(DATA_URL);
        generateChart(data);
      } catch (error) {
        const errorMessage = document.getElementById(ERROR_MESSAGE_ID);
        errorMessage.textContent = `Error loading GES data: ${error.message}`;
        errorMessage.style.color = 'red';
      }
    }

    // Call main function
    main();
  </script>
</body>
</html>