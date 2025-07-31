import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

// Sample data for your graphs
const graphData = [
  {
    id: 1,
    title: "Invested Wealth",
    url: "https://charts.checkonchain.com/btconchain/urpd/urpd_realised/urpd_realised_dark.html",
    category: "Wealth"
  },
  {
    id: 2,
    title: "Comparison of Aggregate Volume Metrics",
    url: "https://charts.checkonchain.com/btconchain/etfs/etf_volume_vsspot/etf_volume_vsspot_dark.html",
    category: "Volume"
  },
  {
    id: 3,
    title: "The HODL Waves",
    url: "https://charts.checkonchain.com/btconchain/supply/hodl_waves_0/hodl_waves_0_dark.html",
    category: "HODL"
  },
  {
    id: 4,
    title: "Revived Supply Breakdown by Age",
    url: "https://charts.checkonchain.com/btconchain/supply/revived_supply_1_supply/revived_supply_1_supply_dark.html",
    category: "Supply"
  },
  {
    id: 5,
    title: "Bitcoin ETF Flows [USD]",
    url: "https://charts.checkonchain.com/btconchain/etfs/etf_flows_1_1w/etf_flows_1_1w_dark.html",
    category: "ETF"
  }
];

function App() {
  // State to track if we're in dark mode or light mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // State to track which tiles are enlarged
  const [enlargedTiles, setEnlargedTiles] = useState([]);
  
  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to enlarge a tile
  const enlargeTile = (graphId) => {
    if (!enlargedTiles.includes(graphId)) {
      setEnlargedTiles([...enlargedTiles, graphId]);
    }
  };

  // Function to close/shrink a tile
  const closeTile = (graphId) => {
    setEnlargedTiles(enlargedTiles.filter(id => id !== graphId));
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="App-header">
        <h1>On Chain Dashboard</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? '◐' : '◑'}
        </button>
      </header>
      <main>
        <Dashboard 
          graphs={graphData} 
          enlargedTiles={enlargedTiles}
          onEnlarge={enlargeTile}
          onClose={closeTile}
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
}

export default App;