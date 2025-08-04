import React, { useState } from 'react';
import './GraphThumbnail.css';

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

function GraphThumbnail({ graph, isEnlarged, onEnlarge, onClose, onShowDetails, onPreview, isDarkMode, isNavigation = false, isSelector = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Generate category class for styling
  const categoryClass = `category-${graph.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleEnlarge = () => {
    onEnlarge(graph.id);
  };

  const handleClose = () => {
    onClose(graph.id);
  };

  const handleShowDetails = () => {
    onShowDetails(graph);
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(graph);
    }
  };

  return (
    <div 
      className={`graph-thumbnail ${categoryClass} ${isHovered ? 'hovered' : ''} ${isEnlarged ? 'is-enlarged' : ''} ${isNavigation ? 'is-navigation' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="graph-image">
        {isLoading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Loading chart...</span>
          </div>
        )}
        {/* Live embedded website */}
        <iframe
          src={convertUrlForTheme(graph.url, isDarkMode)}
          title={graph.title}
          className={`graph-iframe ${isLoading ? 'loading' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          frameBorder="0"
          scrolling="no"
          sandbox="allow-scripts allow-same-origin"
        />
        {hasError && (
          <div className="error-overlay">
            Chart unavailable
          </div>
        )}
      </div>
      <div className="graph-info">
        <h3>{graph.title}</h3>
        <span className="category">{graph.category}</span>
      </div>
      
      {isHovered && (
        <div className="hover-options">
          {isNavigation ? (
            // Navigation mode: Show navigate and close buttons
            <>
              <button title="Go to chart" onClick={handleEnlarge}>
                ↗
              </button>
              <button title="Remove from view" onClick={handleClose}>
                ✕
              </button>
            </>
          ) : isSelector ? (
            // Selector mode: Show enlarge button or already added indicator
            <>
              {!isEnlarged && (
                <button title="Add to Workbench" onClick={handleEnlarge}>
                  <span className="enlarge-icon">
                    ⚒
                    <span className="plus-overlay">+</span>
                  </span>
                </button>
              )}
              <button title="Details" onClick={handleShowDetails}>ⓘ</button>
            </>
          ) : (
            // Regular mode: Original behavior
            <>
              {!isEnlarged ? (
                <button title="Add to Workbench" onClick={handleEnlarge}>
                  <span className="enlarge-icon">
                    <span style={{ fontSize: '2rem' }}>⚒</span>
                    <span className="plus-overlay" style={{ fontSize: '0.8rem' }}>+</span>
                  </span>
                </button>
              ) : (
                <button title="Remove from Workbench" onClick={handleClose}>
                  ✕
                </button>
              )}
              <button title="Preview Chart" onClick={handlePreview}><span style={{ fontSize: '1.6rem' }}>𖠂</span></button>
              <button title="Details" onClick={handleShowDetails}> <span style={{ fontWeight: 'bold' }}>ⓘ</span></button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GraphThumbnail;