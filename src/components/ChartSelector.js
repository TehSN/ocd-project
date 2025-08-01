import React from 'react';
import GraphThumbnail from './GraphThumbnail';
import CategoryDropdown from './CategoryDropdown';
import { categories } from '../graphData';
import './ChartSelector.css';

function ChartSelector({ graphs, enlargedTiles, onEnlarge, onClose, isOpen, isDarkMode }) {
  if (!isOpen) return null;

  const handleShowDetails = () => {
    // Placeholder for details functionality if needed
  };

  const handleEnlarge = (graphId) => {
    onEnlarge(graphId);
    // Close modal after adding a chart
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className="chart-selector-overlay">
      <div className="chart-selector-modal">
        <div className="chart-selector-header">
          <h2>Add Charts to View</h2>
          <button 
            className="chart-selector-close"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
        
        <div className="chart-selector-content">
          <div className="chart-selector-categories">
            {categories.map(category => (
              <CategoryDropdown
                key={category}
                category={category}
                graphs={graphs}
                isOpen={false} // Closed by default in chart selector
                enlargedTiles={enlargedTiles}
                onEnlarge={handleEnlarge}
                onClose={() => {}} // No close functionality in selector
                onShowDetails={handleShowDetails}
                isDarkMode={isDarkMode}
                isSelector={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartSelector;