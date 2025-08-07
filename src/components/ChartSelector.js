import React, { useEffect } from 'react';
// import GraphThumbnail from './GraphThumbnail';
import CategoryDropdown from './CategoryDropdown';
import { categories } from '../graphData';
import Icon from './Icon';
import { HiX } from 'react-icons/hi';
import './ChartSelector.css';

function ChartSelector({ graphs, workbenchItems, onEnlarge, onClose, isOpen, isDarkMode }) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

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
            <Icon size="medium" variant="modal-close"><HiX /></Icon>
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
                workbenchItems={workbenchItems}
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