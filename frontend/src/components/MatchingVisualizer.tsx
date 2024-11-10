import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { sampleResumes, sampleJobDescriptions } from '../data/sampleData';
import SkillNetwork from './SkillNetwork';

interface MatchData {
  match_score: number;
  skills: string[];
  job_skills: string[];
}

const MatchingVisualizer: React.FC = () => {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState(sampleResumes[0]);
  const [selectedJob, setSelectedJob] = useState(sampleJobDescriptions[0]);

  const chartId = 'matchingChart';

  const analyzeCandidate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/analyze_candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_text: selectedResume.text,
          job_desc: selectedJob.description,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      const data: MatchData = await response.json();
      setMatchData(data);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData: ChartData<'bar'> = {
    labels: ['Match Score'],
    datasets: [
      {
        label: 'Candidate-Job Fit (%)',
        data: matchData ? [matchData.match_score * 100] : [0],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
      <h2>Matching Visualizer</h2>
      <div>
        <label>Select Resume: </label>
        <select
          value={selectedResume.id}
          onChange={(e) =>
            setSelectedResume(
              sampleResumes.find((r) => r.id === parseInt(e.target.value)) || sampleResumes[0]
            )
          }
        >
          {sampleResumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Job Description: </label>
        <select
          value={selectedJob.id}
          onChange={(e) =>
            setSelectedJob(
              sampleJobDescriptions.find((j) => j.id === parseInt(e.target.value)) ||
                sampleJobDescriptions[0]
            )
          }
        >
          {sampleJobDescriptions.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>
      <button onClick={analyzeCandidate} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Candidate'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {matchData && (
        <>
          <div style={{ width: '50%', margin: '0 auto' }}>
            <Bar data={chartData} options={options} id={chartId} />
            <p>Match Score: {(matchData.match_score * 100).toFixed(2)}%</p>
          </div>
          <SkillNetwork
            skills={matchData.skills || []}
            jobSkills={matchData.job_skills}
            matchScore={matchData.match_score}
          />
        </>
      )}
    </div>
  );
};

export default MatchingVisualizer; 