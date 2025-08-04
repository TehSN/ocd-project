import React, { useState } from 'react';
import GraphThumbnail from './GraphThumbnail';
import { categoryConfig } from '../graphData';
import './CategoryDropdown.css';

function CategoryDropdown({ 
  category, 
  graphs, 
  isOpen: initialOpen = false,
  enlargedTiles = [],
  onEnlarge,
  onClose,
  onShowDetails,
  onPreview,
  isDarkMode,
  isSelector = false
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  
  const categoryGraphs = graphs.filter(graph => graph.category === category);
  
  // Don't render if no graphs in this category
  if (categoryGraphs.length === 0) return null;
  
  const config = categoryConfig[category] || { cssVar: "tradfi" };
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className="category-dropdown"
      data-category={config.cssVar}
    >
      <div 
        className="category-header"
        onClick={toggleDropdown}
      >
        <div className="category-title-wrapper">
          <h3 className="category-title">
            {category}
          </h3>
          <span className="category-count">({categoryGraphs.length})</span>
        </div>
        <div className={`category-chevron ${isOpen ? 'open' : ''}`}>
          ▼
        </div>
      </div>
      
      {isOpen && (
        <div className="category-content">
          <div className="category-grid">
            {categoryGraphs.map(graph => (
              <div 
                key={isSelector ? `selector-${graph.id}` : graph.id}
                className={`category-item ${enlargedTiles.includes(graph.id) ? 'already-enlarged' : ''}`}
              >
                <GraphThumbnail
                  graph={graph}
                  isEnlarged={enlargedTiles.includes(graph.id)}
                  onEnlarge={onEnlarge}
                  onClose={onClose}
                  onShowDetails={onShowDetails}
                  onPreview={onPreview}
                  isDarkMode={isDarkMode}
                  isSelector={isSelector}
                />
                {isSelector && enlargedTiles.includes(graph.id) && (
                  <div className="enlarged-indicator">
                    <span>✓ Added</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;