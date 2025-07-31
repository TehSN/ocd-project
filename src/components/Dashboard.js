import React, { useState } from 'react';
import GraphThumbnail from './GraphThumbnail';
import EnlargedTile from './EnlargedTile';
import DetailsModal from './DetailsModal';
import './Dashboard.css';

function Dashboard({ graphs, enlargedTiles, onEnlarge, onClose, isDarkMode }) {
  const [detailsGraph, setDetailsGraph] = useState(null);
  const enlargedGraphs = graphs.filter(graph => enlargedTiles.includes(graph.id));
  const hasEnlargedTiles = enlargedTiles.length > 0;

  const handleShowDetails = (graph) => {
    setDetailsGraph(graph);
  };

  const handleCloseDetails = () => {
    setDetailsGraph(null);
  };

  return (
    <div className={`dashboard ${hasEnlargedTiles ? 'has-enlarged' : ''}`}>
      {hasEnlargedTiles && (
        <div className="sidebar">
          <div className="graph-grid">
            {graphs.map(graph => (
                               <GraphThumbnail
                   key={graph.id}
                   graph={graph}
                   isEnlarged={enlargedTiles.includes(graph.id)}
                   onEnlarge={onEnlarge}
                   onClose={onClose}
                   onShowDetails={handleShowDetails}
                   isDarkMode={isDarkMode}
                 />
            ))}
          </div>
        </div>
      )}
      
      {hasEnlargedTiles && (
        <div className="enlarged-area">
          {enlargedGraphs.map(graph => (
            <EnlargedTile
              key={`enlarged-${graph.id}`}
              graph={graph}
              onClose={onClose}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}

      {!hasEnlargedTiles && (
        <div className="graph-grid">
          {graphs.map(graph => (
                           <GraphThumbnail
                 key={graph.id}
                 graph={graph}
                 isEnlarged={false}
                 onEnlarge={onEnlarge}
                 onClose={onClose}
                 onShowDetails={handleShowDetails}
                 isDarkMode={isDarkMode}
               />
          ))}
        </div>
      )}
      
      <DetailsModal 
        graph={detailsGraph}
        isOpen={!!detailsGraph}
        onClose={handleCloseDetails}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default Dashboard;