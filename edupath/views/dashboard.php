<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: sans-serif;
      padding: 20px;
    }
    canvas {
      max-width: 100%;
      height: auto;
      margin-bottom: 40px;
    }
    h2 {
      margin-top: 40px;
    }
  </style>
</head>
<body>

  <h1>Welcome to Your Dashboard</h1>

  <!-- GES Chart -->
  <h2>Graduate Employment Outcomes (Latest Year)</h2>
  <canvas id="gesChart"></canvas>
  <div id="ges-error"></div>

  <!-- Job Vacancy Chart -->
  <h2>Job Vacancy Rates by Sector & Occupation (2024 Q4)</h2>
  <canvas id="vacancyChart"></canvas>
  <div id="vacancy-error"></div>

  <hr>
  <a href="settings.php"><button>Go to Settings</button></a>

  <script>
    const GES_URL = '../data/graduate_employment.json';
    const VACANCY_URL = '../data/job_vacancy.json';

    async function fetchData(url) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Expected JSON, got ${contentType}`);
        }

        const data = await res.json();
        console.log(`✅ Data from ${url}:`, data);
        
        if (!Array.isArray(data)) {
          throw new Error("Expected an array but got something else.");
        }

        return data;
      } catch (err) {
        console.error(`❌ Error fetching from ${url}:`, err);
        throw err;
      }
    }

    async function renderGESChart() {
      try {
        const data = await fetchData(GES_URL);
        const latestYear = Math.max(...data.map(item => parseInt(item.year)));
        const filtered = data.filter(item => parseInt(item.year) === latestYear && item.employment_rate !== null);

        filtered.sort((a, b) => b.employment_rate - a.employment_rate);

        const labels = filtered.map(item => item.degree + " (" + item.university + ")");
        const values = filtered.map(item => parseFloat(item.employment_rate));

        if (labels.length === 0 || values.length === 0) {
          throw new Error("No valid data available for the latest year.");
        }

        new Chart(document.getElementById('gesChart'), {
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
                  label: context => context.parsed.y + '%'
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
      } catch (error) {
        document.getElementById('ges-error').textContent = error.message;
      }
    }

    async function renderVacancyChart() {
      try {
        const rawData = await fetchData(VACANCY_URL);
        const data = rawData.data; // Ensure this matches your JSON structure

        const labels = data.map(item => item.sub_sector + ' - ' + item.occupation);
        const values = data.map(item => parseFloat(item.job_vacancy_rate));

        new Chart(document.getElementById('vacancyChart'), {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: "Job Vacancy Rate (%)",
              data: values,
              backgroundColor: '#4285F4'
            }]
          },
          options: {
            responsive: true,
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
                  text: 'Job Vacancy Rate (%)'
                }
              }
            }
          }
        });
      } catch (error) {
        document.getElementById('vacancy-error').textContent = error.message;
      }
    }

    renderGESChart();
    renderVacancyChart();
  </script>
</body>
</html>