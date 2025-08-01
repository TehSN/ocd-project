import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import { graphData } from './graphData';

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
    } else {
      // If already enlarged, scroll to it
      setTimeout(() => {
        const element = document.getElementById(`enlarged-${graphId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  };

  // Function to close/shrink a tile
  const closeTile = (graphId) => {
    setEnlargedTiles(enlargedTiles.filter(id => id !== graphId));
  };

  const closeAllTiles = () => {
    setEnlargedTiles([]);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <header className="App-header">
        <div className="header-left">
          <h1>On-Chain Dashboard</h1>
          {enlargedTiles.length > 0 && (
            <button
              className="home-button"
              onClick={closeAllTiles}
              aria-label="Return to main grid"
            >
              ⌂
            </button>
          )}
        </div>
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