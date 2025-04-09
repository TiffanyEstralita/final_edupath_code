<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Job Vacancy Rates</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h2>Job Vacancy Rates by Sector & Occupation (2024 Q4)</h2>
  <canvas id="vacancyChart"></canvas>

  <script>
    fetch('../data/job_vacancy.json')
      .then(response => response.json())
      .then(data => {
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
                  minRotation: 60
                }
              },
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
  </script>
</body>
</html>
