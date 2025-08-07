import React, { useState } from 'react';
import Icon from './Icon';
import { HiOutlineExternalLink, HiX, HiInformationCircle, HiCollection } from 'react-icons/hi';
import { IoMdAdd } from 'react-icons/io';
import { GiAnvilImpact } from 'react-icons/gi';
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

function GraphThumbnail({ graph, isInWorkbench, onEnlarge, onClose, onShowDetails, onPreview, onAddToCollection, isDarkMode, isNavigation = false, isSelector = false }) {
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

  const handleAddToCollection = () => {
    if (onAddToCollection) {
      onAddToCollection(graph);
    }
  };



  return (
    <div 
      className={`graph-thumbnail ${categoryClass} ${isHovered ? 'hovered' : ''} ${isInWorkbench ? 'is-in-workbench' : ''} ${isNavigation ? 'is-navigation' : ''} ${isSelector ? 'is-selector' : ''}`}
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
                <Icon size="medium"><HiOutlineExternalLink /></Icon>
              </button>
              <button title="Remove from view" onClick={handleClose}>
                <Icon size="medium"><HiX /></Icon>
              </button>
            </>
          ) : isSelector ? (
            // Selector mode: Show enlarge button or already added indicator
            <>
              {!isInWorkbench && (
                <button title="Add to Workbench" onClick={handleEnlarge}>
                  <div className="composite-icon">
                    <Icon size="large"><GiAnvilImpact /></Icon>
                    <Icon size="tiny" className="icon-overlay-badge"><IoMdAdd /></Icon>
                  </div>
                </button>
              )}
              <button title="Details" onClick={handleShowDetails}>
                <Icon size="large"><HiInformationCircle /></Icon>
              </button>
            </>
          ) : (
            // Regular mode: Original behavior
            <>
              <button className="preview-btn-wide" title="Preview Chart" onClick={handlePreview}>
                Preview Chart
              </button>
              <div className="action-buttons-row">
                {!isInWorkbench ? (
                  <button title="Add to Workbench" onClick={handleEnlarge}>
                    <div className="composite-icon">
                      <Icon size="large"><GiAnvilImpact /></Icon>
                      <Icon size="tiny" className="icon-overlay-badge"><IoMdAdd /></Icon>
                    </div>
                  </button>
                ) : (
                  <button title="Remove from Workbench" onClick={handleClose}>
                    <Icon size="medium" variant="action"><HiX /></Icon>
                  </button>
                )}
                  <button title="Add to Collection" onClick={handleAddToCollection}>
                    <div className="composite-icon">
                      <Icon size="large"><HiCollection /></Icon>
                      <Icon size="tiny" variant = "nav bold" className="icon-overlay-badge"><IoMdAdd /></Icon>
                    </div>
                  </button>
                <button title="Details" onClick={handleShowDetails}>
                  <Icon size="large"><HiInformationCircle /></Icon>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GraphThumbnail;