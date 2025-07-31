import React, { useState } from 'react';
import './GraphThumbnail.css';

function GraphThumbnail({ graph }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`graph-thumbnail ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="graph-image">
        {/* Placeholder for now - we'll add the actual image later */}
        <div className="placeholder-image">
          📊
        </div>
      </div>
      <div className="graph-info">
        <h3>{graph.title}</h3>
        <span className="category">{graph.category}</span>
      </div>
      
      {isHovered && (
        <div className="hover-options">
          <button>Enlarge</button>
          <button>Details</button>
        </div>
      )}
    </div>
  );
}

export default GraphThumbnail;