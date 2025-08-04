import React, { useEffect, useState } from 'react';
import { categoryConfig } from '../graphData';
import './PreviewModal.css';

// Utility function to convert URLs based on theme and add zoom
const convertUrlForTheme = (url, isDarkMode, zoomLevel = 1) => {
  let processedUrl = url;
  
  if (isDarkMode) {
    // Keep dark URLs as they are, or convert light to dark
    processedUrl = processedUrl
      .replace('_light.html', '_dark.html')
      .replace('/light/', '/dark/')
      .replace('dark=false', 'dark=true')
      .replace('theme=light', 'theme=dark');
  } else {
    // Convert to light URLs
    processedUrl = processedUrl
      .replace('_dark.html', '_light.html')
      .replace('/dark/', '/light/')
      .replace('dark=true', 'dark=false')
      .replace('theme=dark', 'theme=light');
  }
  
  // Try adding zoom parameter to URL (may not be supported by all sites)
  // CSS transform will handle zoom if URL parameter doesn't work
  const zoomPercent = Math.round(zoomLevel * 100);
  const separator = processedUrl.includes('?') ? '&' : '?';
  return `${processedUrl}${separator}zoom=${zoomPercent}`;
};

function PreviewModal({ 
  isOpen, 
  graph, 
  onClose, 
  onAddToWorkbench, 
  isDarkMode 
}) {
  const [zoomLevel, setZoomLevel] = useState(0.75); // Start at 75% for better fit
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  if (!isOpen || !graph) return null;

  const themedUrl = convertUrlForTheme(graph.url, isDarkMode, zoomLevel);
  
  // Get category configuration for styling
  const categoryClass = `category-${graph.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/\//g, '-')}`;
  const config = categoryConfig[graph.category] || { cssVar: "tradfi" };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Max zoom 300%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 50%
  };

  const handleResetZoom = () => {
    setZoomLevel(1); // Reset to 100%
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className={`preview-modal ${categoryClass}`} onClick={e => e.stopPropagation()}>
        <div className="preview-modal-header">
          <div className="preview-header-left">
            <h2 className="preview-modal-title">{graph.title}</h2>
            <span className={`category-badge category-${config.cssVar}`}>{graph.category}</span>
            <button 
              className="preview-add-to-workbench-btn"
              onClick={() => onAddToWorkbench(graph.id)}
              title="Add to Workbench"
            >
              <span className="workbench-icon" style={{ fontSize: '1.6rem' }}>⚒</span>
              <span className="plus-badge">+</span>
            </button>
          </div>
          <button className="preview-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="preview-modal-content">
          <div className="preview-chart-container">
            <div className="preview-zoom-controls">
              <button 
                className="zoom-button zoom-out"
                onClick={handleZoomOut}
                title="Zoom Out"
                disabled={zoomLevel <= 0.5}
              >
                −
              </button>
              <span className="zoom-level" onClick={handleResetZoom} title="Reset Zoom">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button 
                className="zoom-button zoom-in"
                onClick={handleZoomIn}
                title="Zoom In"
                disabled={zoomLevel >= 3}
              >
                +
              </button>
            </div>
            
            {isLoading && (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
                <span>Loading chart...</span>
              </div>
            )}
            
            <div className="iframe-container">
              <iframe
                src={themedUrl}
                className={`preview-chart-iframe ${isLoading ? 'loading' : ''}`}
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                  width: `${100 / zoomLevel}%`,
                  height: `${100 / zoomLevel}%`
                }}
                onLoad={handleLoad}
                onError={handleError}
                frameBorder="0"
                scrolling="yes"
                sandbox="allow-scripts allow-same-origin"
                title={graph.title}
              />
            </div>
            
            {hasError && (
              <div className="error-overlay">
                Chart unavailable
              </div>
            )}
          </div>
        </div>
        
        <div className="preview-chart-info">
          <h3 className="preview-description-title">Description</h3>
          <div className="preview-chart-description">
            {graph.details || 'No description available for this chart.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;