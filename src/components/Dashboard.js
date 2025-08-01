import React, { useState, useEffect, useRef } from 'react';
import GraphThumbnail from './GraphThumbnail';
import EnlargedTile from './EnlargedTile';
import DetailsModal from './DetailsModal';
import ResizableSplitter from './ResizableSplitter';
import './Dashboard.css';

function Dashboard({ graphs, enlargedTiles, onEnlarge, onClose, isDarkMode }) {
  const [detailsGraph, setDetailsGraph] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Default sidebar width
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Track collapse state
  const previousEnlargedTiles = useRef([]); // Track previous state to detect new additions
  
  // Create enlargedGraphs in the order they were enlarged
  const enlargedGraphs = enlargedTiles.map(id => graphs.find(graph => graph.id === id)).filter(Boolean);
  const hasEnlargedTiles = enlargedTiles.length > 0;

  // Scroll to newly enlarged chart
  useEffect(() => {
    if (enlargedTiles.length > previousEnlargedTiles.current.length) {
      // Find the newly added tile ID
      const newTileId = enlargedTiles.find(id => !previousEnlargedTiles.current.includes(id));
      if (newTileId) {
        // Small delay to ensure the element is rendered
        setTimeout(() => {
          const element = document.getElementById(`enlarged-${newTileId}`);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      }
    }
    previousEnlargedTiles.current = [...enlargedTiles];
  }, [enlargedTiles]);

  const handleShowDetails = (graph) => {
    setDetailsGraph(graph);
  };

  const handleCloseDetails = () => {
    setDetailsGraph(null);
  };

  const handleSidebarResize = (newWidth) => {
    setSidebarWidth(newWidth);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

    return (
    <div className={`dashboard ${hasEnlargedTiles ? 'has-enlarged' : ''}`}>
      {hasEnlargedTiles && (
        <>
          {/* Toggle button positioned outside all containers */}
          <button 
            className={`sidebar-toggle ${sidebarCollapsed ? 'sidebar-expand' : 'sidebar-collapse'}`}
            onClick={toggleSidebarCollapse}
            title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            {sidebarCollapsed ? '\u00bb' : '\u00ab'}
          </button>
          
          {!sidebarCollapsed && (
            <>
              <div className="sidebar" style={{ width: `${sidebarWidth}px` }}>
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
              
              <ResizableSplitter 
                onResize={handleSidebarResize}
                isDarkMode={isDarkMode}
                currentSidebarWidth={sidebarWidth}
              />
            </>
          )}
          
          <div className="enlarged-area" style={{ 
            width: sidebarCollapsed ? '100%' : `calc(100% - ${sidebarWidth + 26}px)` 
          }}>
            {enlargedGraphs.map(graph => (
              <div id={`enlarged-${graph.id}`} key={`enlarged-${graph.id}`}>
                <EnlargedTile
                  graph={graph}
                  onClose={onClose}
                  isDarkMode={isDarkMode}
                />
              </div>
            ))}
          </div>
        </>
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