import React, { useState } from 'react';
import Icon from './Icon';
import { IoRemoveCircleOutline } from 'react-icons/io5';
import './WorkbenchItem.css';

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

function WorkbenchItem({ graph, onClose, isDarkMode, isReadOnly = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.75); // 1 = 100%, 0.5 = 50%, 1.5 = 150%
  
  // Generate category class for styling
  const categoryClass = `category-${graph.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;

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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Max zoom 300%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Min zoom 50%
  };

  const handleResetZoom = () => {
    setZoomLevel(1); // Reset to 100%
  };

  return (
    <div className={`workbench-item ${categoryClass}`}>
      <div className="workbench-content">
        {!isReadOnly && (
          <button 
            className="close-button"
            onClick={handleClose}
            title="Close"
          >
            <Icon size="small" variant="close"><IoRemoveCircleOutline /></Icon>
          </button>
        )}

        <div className="zoom-controls">
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
            src={convertUrlForTheme(graph.url, isDarkMode, zoomLevel)}
            title={graph.title}
            className={`workbench-iframe ${isLoading ? 'loading' : ''}`}
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
          />
        </div>
        {hasError && (
          <div className="error-overlay">
            Chart unavailable
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkbenchItem;