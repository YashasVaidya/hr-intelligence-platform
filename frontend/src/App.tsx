import React from 'react';
import './App.css';
import MatchingVisualizer from './components/MatchingVisualizer';
import SentimentGraph from './components/SentimentGraph';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PredictiveChart from './components/PredictiveChart';
import SkillNetwork from './components/SkillNetwork';

function App() {
  // Sample skills data for SkillNetwork
  const sampleSkills = ['JavaScript', 'TypeScript', 'React', 'Python', 'Machine Learning'];

  return (
    <div className="App">
      <header className="App-header">
        <h1>HR AI Platform</h1>
        <MatchingVisualizer />
        <SentimentGraph />
        <AnalyticsDashboard />
        <PredictiveChart />
        <SkillNetwork skills={sampleSkills} />
      </header>
    </div>
  );
}

export default App;