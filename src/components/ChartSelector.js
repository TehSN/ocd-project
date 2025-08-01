import React from 'react';
import GraphThumbnail from './GraphThumbnail';
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
          <div className="chart-selector-grid">
            {graphs.map(graph => (
              <div 
                key={`selector-${graph.id}`}
                className={`chart-selector-item ${enlargedTiles.includes(graph.id) ? 'already-enlarged' : ''}`}
              >
                <GraphThumbnail
                  graph={graph}
                  isEnlarged={enlargedTiles.includes(graph.id)}
                  onEnlarge={() => handleEnlarge(graph.id)}
                  onClose={() => {}} // No close functionality in selector
                  onShowDetails={handleShowDetails}
                  isDarkMode={isDarkMode}
                  isSelector={true}
                />
                {enlargedTiles.includes(graph.id) && (
                  <div className="enlarged-indicator">
                    <span>✓ Added</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartSelector;