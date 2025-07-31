import React, { useState } from 'react';
import './EnlargedTile.css';

// Utility function to convert URLs based on theme
const convertUrlForTheme = (url, isDarkMode) => {
  if (isDarkMode) {
    // Keep dark URLs as they are, or convert light to dark
    return url
      .replace('_light.html', '_dark.html')
      .replace('/light/', '/dark/')
      .replace('dark=false', 'dark=true')
      .replace('theme=light', 'theme=dark');
  } else {
    // Convert to light URLs
    return url
      .replace('_dark.html', '_light.html')
      .replace('/dark/', '/light/')
      .replace('dark=true', 'dark=false')
      .replace('theme=dark', 'theme=light');
  }
};

function EnlargedTile({ graph, onClose, isDarkMode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Generate category class for styling
  const categoryClass = `category-${graph.category.toLowerCase()}`;

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleClose = () => {
    onClose(graph.id);
  };

  return (
    <div className={`enlarged-tile ${categoryClass}`}>
      <div className="enlarged-content">
        <button 
          className="close-button"
          onClick={handleClose}
          title="Close"
        >
          ✕
        </button>
        
        {isLoading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Loading chart...</span>
          </div>
        )}
        <iframe
          src={convertUrlForTheme(graph.url, isDarkMode)}
          title={graph.title}
          className={`enlarged-iframe ${isLoading ? 'loading' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          frameBorder="0"
          scrolling="yes"
        />
        {hasError && (
          <div className="error-overlay">
            Chart unavailable
          </div>
        )}
      </div>
    </div>
  );
}

export default EnlargedTile;