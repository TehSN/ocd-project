import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

// Sample data for your graphs
const graphData = [
  {
    id: 1,
    title: "Invested Wealth",
    url: "https://placeholder-image-url.com/graph1", // Replace with your actual URLs later
    category: "Wealth"
  },
  {
    id: 2,
    title: "Comparison of Aggregate Volume Metrics",
    url: "https://placeholder-image-url.com/graph2",
    category: "Volume"
  },
  {
    id: 3,
    title: "The HODL Waves",
    url: "https://placeholder-image-url.com/graph3",
    category: "HODL"
  },
  {
    id: 4,
    title: "Revived Supply Breakdown by Age",
    url: "https://placeholder-image-url.com/graph4",
    category: "Supply"
  },
  {
    id: 5,
    title: "Bitcoin ETF Flows [USD]",
    url: "https://placeholder-image-url.com/graph5",
    category: "ETF"
  }
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>On Chain Dashboard</h1>
      </header>
      <main>
        <p>Dashboard will go here</p>
      </main>
    </div>
  );
}
<main>
  <Dashboard graphs={graphData} />
</main>
export default App;