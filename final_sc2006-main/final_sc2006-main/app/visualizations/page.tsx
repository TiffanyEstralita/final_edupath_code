'use client';

import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

type JobVacancy = {
  quarter: string;
  sector: string;
  sub_sector: string;
  occupation: string;
  job_vacancy_rate: number;
};

type GraduateEmployment = {
  year: string;
  university: string;
  degree: string;
  employment_rate: number;
  median_salary: number;
};

type IncomeData = {
  year: string;
  sex: string;
  occupation: string;
  median_income: number;
};

type ChartType = 'bar' | 'line';

export default function CombinedVisualizationsPage() {
  const router = useRouter();

  const [vacancyData, setVacancyData] = useState<JobVacancy[]>([]);
  const [employmentData, setEmploymentData] = useState<GraduateEmployment[]>([]);
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [loading, setLoading] = useState(true);

  const [chartTypes, setChartTypes] = useState<Record<string, ChartType>>({
    vacancy: 'bar',
    employment: 'bar',
    income: 'bar',
  });

  const [zoomedChartKey, setZoomedChartKey] = useState<string | null>(null);
  const handleChartTypeChange = (key: string, type: ChartType) => {
    setChartTypes(prev => ({ ...prev, [key]: type }));
  };

  const handleZoom = (key: string | null) => {
    setZoomedChartKey(key);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const vacancyRes = await fetch('/job_vacancy.json');
        const vacancyJson = await vacancyRes.json();
        setVacancyData(vacancyJson);

        const employmentRes = await fetch('/graduate_employment.json');
        const employmentJson = await employmentRes.json();
        setEmploymentData(Object.values(employmentJson).slice(0, 10) as GraduateEmployment[]);

        const incomeRes = await fetch('/median_income_by_occupation.json');
        const incomeJson = await incomeRes.json();
        setIncomeData(incomeJson);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const vacancyChart = {
    labels: vacancyData.map(item => item.occupation),
    datasets: [{
      label: 'Job Vacancy Rate (%)',
      data: vacancyData.map(item => item.job_vacancy_rate),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      fill: false,
    }],
  };

  const employmentChart = {
    labels: employmentData.map(item => item.degree),
    datasets: [{
      label: 'Employment Rate (%)',
      data: employmentData.map(item => item.employment_rate),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
      fill: false,
    }],
  };

  const occupations = [...new Set(incomeData.map((item) => item.occupation))];
  const maleData = occupations.map((occupation) => incomeData.find((d) => d.occupation === occupation && d.sex === 'Male')?.median_income || 0);
  const femaleData = occupations.map((occupation) => incomeData.find((d) => d.occupation === occupation && d.sex === 'Female')?.median_income || 0);

  const incomeChart = {
    labels: occupations,
    datasets: [
      {
        label: 'Male Median Income',
        data: maleData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        fill: false,
      },
      {
        label: 'Female Median Income',
        data: femaleData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const chartOptions: import('chart.js').ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          maxTicksLimit: 10,
        },
      },
    },
  };

  const chartComponents = {
    bar: Bar,
    line: Line,
  };

  const charts = [
    {
      key: 'vacancy',
      title: 'Job Vacancy Rate by Occupation',
      data: vacancyChart,
    },
    {
      key: 'employment',
      title: 'Graduate Employment Rate by Degree',
      data: employmentChart,
    },
    {
      key: 'income',
      title: 'Median Monthly Income by Occupation and Gender (2023)',
      data: incomeChart,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Labour Market Visualisations
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading charts...</div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-6 justify-between">
            {charts.map(({ key, title, data }) => {
              const Chart = chartComponents[chartTypes[key]];
              return (
                <div
                  key={key}
                  onClick={() => handleZoom(key)}
                  className="cursor-pointer bg-white shadow-md rounded-2xl p-4 w-full lg:w-1/3 flex flex-col hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 text-center w-full">
                      {title}
                    </h2>
                    <select
                      value={chartTypes[key]}
                      onClick={e => e.stopPropagation()}
                      onChange={(e) => handleChartTypeChange(key, e.target.value as ChartType)}
                      className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm text-gray-800"
                    >
                      <option value="bar">Bar</option>
                      <option value="line">Line</option>
                    </select>
                  </div>
                  <div className="relative h-[300px]">
                    <Chart data={data} options={chartOptions} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {zoomedChartKey && (() => {
          const zoomChart = charts.find(chart => chart.key === zoomedChartKey);
          const ZoomChartComponent = chartComponents[chartTypes[zoomedChartKey]];

          return (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-4xl relative">
                <button
                  onClick={() => handleZoom(null)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl font-bold"
                >
                  &times;
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">{zoomChart?.title}</h2>
                <div className="relative h-[500px]">
                  {ZoomChartComponent && zoomChart && (
                    <ZoomChartComponent data={zoomChart.data} options={chartOptions} />
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="flex justify-center mt-12">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
