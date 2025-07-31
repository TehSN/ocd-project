import React from 'react';
import GraphThumbnail from './GraphThumbnail';
import EnlargedTile from './EnlargedTile';
import './Dashboard.css';

function Dashboard({ graphs, enlargedTiles, onEnlarge, onClose, isDarkMode }) {
  const enlargedGraphs = graphs.filter(graph => enlargedTiles.includes(graph.id));
  const hasEnlargedTiles = enlargedTiles.length > 0;

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
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;