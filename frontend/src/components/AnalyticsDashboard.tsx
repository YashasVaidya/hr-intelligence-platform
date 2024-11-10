import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ChartData, ChartOptions } from 'chart.js';

interface HRMetrics {
  employee_turnover: number;
  average_tenure: number;
  employee_satisfaction: number;
}

interface Anomalies {
  [key: string]: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<HRMetrics | null>(null);
  const [anomalies, setAnomalies] = useState<Anomalies | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chartId = 'analyticsChart';

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/get_hr_metrics');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMetrics(data.metrics);
      setAnomalies(data.anomalies);
    } catch (error: any) {
      console.error('Error:', error);
      setError('Failed to fetch HR metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const chartData: ChartData<'pie'> = {
    labels: metrics ? Object.keys(metrics) : [],
    datasets: [
      {
        data: metrics ? Object.values(metrics) : [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'HR Metrics Distribution',
      },
    },
  };

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
      <h2>HR Analytics Dashboard</h2>
      <button onClick={fetchMetrics} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Metrics'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {metrics && (
        <div style={{ width: '60%', margin: '0 auto' }}>
          <Pie data={chartData} options={options} id={chartId} />
          <ul>
            {anomalies &&
              Object.entries(anomalies).map(([key, message]) => (
                <li key={key} style={{ color: 'orange' }}>
                  <strong>{key.replace('_', ' ').toUpperCase()}:</strong> {message}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 