import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Sentiment } from '../types';

const SentimentGraph: React.FC = () => {
  const [sentiments, setSentiments] = useState<Sentiment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chartId = 'sentimentChart';

  const analyzeEngagement = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/analyze_engagement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          communication_data: [
            { timestamp: '2023-01-01', message: 'Great start to the new project!' },
            { timestamp: '2023-01-15', message: 'Facing some challenges with the workflow.' },
            // Add more communication data points
          ],
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      const data = await response.json();
      setSentiments(data.sentiments);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData: ChartData<'line'> = {
    labels: sentiments ? sentiments.map((s) => s.timestamp) : [],
    datasets: [
      {
        label: 'Polarity',
        data: sentiments ? sentiments.map((s) => s.polarity) : [],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Subjectivity',
        data: sentiments ? sentiments.map((s) => s.subjectivity) : [],
        fill: false,
        borderColor: 'rgba(153,102,255,1)',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
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
      <h2>Employee Engagement Analyzer</h2>
      <button onClick={analyzeEngagement} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Engagement'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {sentiments && (
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Line data={chartData} options={options} id={chartId} />
        </div>
      )}
    </div>
  );
};

export default SentimentGraph; 