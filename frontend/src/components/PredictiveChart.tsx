import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, ChartData, ChartOptions } from 'chart.js';

interface PredictionData {
  date: string;
  engagement: number;
}

const PredictiveChart: React.FC = () => {
  const [data, setData] = useState<PredictionData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chartId = 'predictiveChart';

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/get_engagement_prediction');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setData(data.predictions);
    } catch (error: any) {
      console.error('Error:', error);
      setError('Failed to fetch engagement predictions.');
    } finally {
      setLoading(false);
    }
  };

  const chartData: ChartData<'line'> = {
    labels: data ? data.map((d) => d.date) : [],
    datasets: [
      {
        label: 'Predicted Engagement',
        data: data ? data.map((d) => d.engagement) : [],
        fill: false,
        borderColor: 'rgba(255,99,132,1)',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Engagement Prediction over Next Month',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Engagement Level',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  useEffect(() => {
    return () => {
      const chart = Chart.getChart(chartId);
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h2>Engagement Prediction</h2>
      <button onClick={fetchPrediction} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Prediction'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Line data={chartData} options={options} id={chartId} />
        </div>
      )}
    </div>
  );
};

export default PredictiveChart; 