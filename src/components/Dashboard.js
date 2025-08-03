import React, { useState, useEffect, useRef } from 'react';
import GraphThumbnail from './GraphThumbnail';
import EnlargedTile from './EnlargedTile';
import DetailsModal from './DetailsModal';
import ResizableSplitter from './ResizableSplitter';
import ChartSelector from './ChartSelector';
import CategoryDropdown from './CategoryDropdown';
import CategoryNavigation from './CategoryNavigation';
import SaveCollectionModal from './SaveCollectionModal';
import ClearWorkbenchModal from './ClearWorkbenchModal';
import CollectionsView from './CollectionsView';
import { categories } from '../graphData';
import './Dashboard.css';

function Dashboard({ 
  graphs, 
  enlargedTiles, 
  onEnlarge, 
  onClose,
  onCloseAll, 
  onReorder, 
  isDarkMode, 
  currentView,
  collections,
  activeCollectionId,
  onSaveCollection,
  onEditCollection,
  goToHome
}) {
  const [detailsGraph, setDetailsGraph] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Default sidebar width
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Track collapse state
  const [chartSelectorOpen, setChartSelectorOpen] = useState(false); // Track chart selector modal
  const [saveCollectionOpen, setSaveCollectionOpen] = useState(false); // Track save collection modal
  const [clearWorkbenchOpen, setClearWorkbenchOpen] = useState(false); // Track clear workbench modal
  const [draggedItem, setDraggedItem] = useState(null); // Track dragged item
  const [dragOverIndex, setDragOverIndex] = useState(null); // Track drag over position
  const previousEnlargedTiles = useRef([]); // Track previous state to detect new additions
  
  // Create enlargedGraphs in the order they were enlarged
  const enlargedGraphs = enlargedTiles.map(id => graphs.find(graph => graph.id === id)).filter(Boolean);
  const hasEnlargedTiles = enlargedTiles.length > 0;
  const isWorkbenchView = currentView === 'workbench';
  const isCollectionView = currentView === 'collection';
  const activeCollection = activeCollectionId ? collections.find(c => c.id === activeCollectionId) : null;

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

  // Cleanup scroll interval on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

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

  const openChartSelector = () => {
    setChartSelectorOpen(true);
  };

  const closeChartSelector = () => {
    setChartSelectorOpen(false);
  };

  const openSaveCollection = () => {
    setSaveCollectionOpen(true);
  };

  const closeSaveCollection = () => {
    setSaveCollectionOpen(false);
  };

  const handleSaveCollection = (name) => {
    onSaveCollection(name);
    setSaveCollectionOpen(false);
  };

  const openClearWorkbench = () => {
    setClearWorkbenchOpen(true);
  };

  const closeClearWorkbench = () => {
    setClearWorkbenchOpen(false);
  };

  const handleClearWorkbench = () => {
    // Clear all charts at once and return to home
    onCloseAll();
    setClearWorkbenchOpen(false);
  };

  const handleNavigationClick = (graphId, e) => {
    // Don't navigate if we're in the middle of a drag operation
    if (draggedItem !== null) {
      e.preventDefault();
      return;
    }
    
    // Scroll to the enlarged chart instead of toggling
    setTimeout(() => {
      const element = document.getElementById(`enlarged-${graphId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  // Drag and drop handlers with auto-scroll
  const scrollIntervalRef = useRef(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    // Prevent click event from firing after drag
    e.stopPropagation();
  };

  const autoScroll = (container, direction) => {
    if (!container) return;
    
    const scrollAmount = 50;
    if (direction === 'up') {
      container.scrollTop -= scrollAmount;
    } else if (direction === 'down') {
      container.scrollTop += scrollAmount;
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Get the sidebar container for auto-scroll
    const sidebarContainer = e.target.closest('.navigation-sidebar');
    if (sidebarContainer) {
      const rect = sidebarContainer.getBoundingClientRect();
      const scrollThreshold = 200; // pixels from edge to trigger scroll
      
      // Clear any existing scroll interval
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      
      // Check if we're near the top or bottom edges
      if (e.clientY - rect.top < scrollThreshold) {
        // Near top - scroll up
        scrollIntervalRef.current = setInterval(() => autoScroll(sidebarContainer, 'up'), 50);
      } else if (rect.bottom - e.clientY < scrollThreshold) {
        // Near bottom - scroll down
        scrollIntervalRef.current = setInterval(() => autoScroll(sidebarContainer, 'down'), 50);
      }
    }
    
    // Determine insertion point based on mouse position
    const targetElement = e.target.closest('.navigation-item');
    if (targetElement && index !== draggedItem && !targetElement.classList.contains('add-chart-tile')) {
      const rect = targetElement.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      
      // For the first item (index 0), only allow insertion after it
      // Top insertion is handled by the dedicated top-drop-zone
      if (index === 0) {
        setDragOverIndex(e.clientY > midpoint ? 1 : null);
      } else {
        // For other items, allow insertion before or after
        const insertIndex = e.clientY < midpoint ? index : index + 1;
        setDragOverIndex(insertIndex);
      }
    }
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the entire sidebar area
    const sidebarContainer = e.target.closest('.navigation-sidebar');
    if (!sidebarContainer || !sidebarContainer.contains(e.relatedTarget)) {
      setDragOverIndex(null);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    // Clear auto-scroll
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    
    if (draggedItem === null || dragOverIndex === null) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...enlargedTiles];
    const draggedItemId = newOrder[draggedItem];
    
    // Remove the dragged item first
    newOrder.splice(draggedItem, 1);
    
    // Adjust drop index if we removed an item before it
    let adjustedDropIndex = dragOverIndex;
    if (draggedItem < dragOverIndex) {
      adjustedDropIndex = dragOverIndex - 1;
    }
    
    // Insert at the new position
    newOrder.splice(adjustedDropIndex, 0, draggedItemId);
    
    onReorder(newOrder);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    // Clear auto-scroll
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

    return (
    <div className={`dashboard ${isWorkbenchView ? 'has-enlarged' : ''}`}>
      {isCollectionView && (
        <CollectionsView
          collection={activeCollection}
          graphs={graphs}
          onEditCollection={onEditCollection}
          onBack={goToHome}
          isDarkMode={isDarkMode}
        />
      )}
      
      {isWorkbenchView && (
        <>
          {/* Control buttons positioned outside all containers */}
          <div className="dashboard-controls">
            <button 
              className={`sidebar-toggle ${sidebarCollapsed ? 'sidebar-expand' : 'sidebar-collapse'}`}
              onClick={toggleSidebarCollapse}
              title={sidebarCollapsed ? "Show navigation" : "Hide navigation"}
            >
              {sidebarCollapsed ? '\u00bb' : '\u00ab'}
            </button>
            
            <button 
              className="chart-selector-toggle"
              onClick={openChartSelector}
              title="Add charts"
            >
              +
            </button>
            
            {enlargedTiles.length > 0 && (
              <>
                <button 
                  className="save-collection-toggle"
                  onClick={openSaveCollection}
                  title="Save Collection"
                >
                  Save
                </button>
                
                <button 
                  className="clear-workbench-toggle"
                  onClick={openClearWorkbench}
                  title="Clear Workbench"
                >
                  Clear
                </button>
              </>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <>
              <div className="sidebar navigation-sidebar" style={{ width: `${sidebarWidth}px` }}>
                <div 
                  className="navigation-grid"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {/* Top drop zone for inserting at position 0 */}
                  <div 
                    className="top-drop-zone"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(0);
                    }}
                    onDragLeave={(e) => {
                      // Only clear if we're not entering a navigation item
                      if (!e.relatedTarget?.closest('.navigation-item')) {
                        setDragOverIndex(null);
                      }
                    }}
                  >
                    {dragOverIndex === 0 && enlargedGraphs.length > 0 && (
                      <div className="drop-indicator">
                        <div className="drop-line"></div>
                      </div>
                    )}
                  </div>
                  
                  {enlargedGraphs.map((graph, index) => (
                    <div key={`nav-${graph.id}`}>
                      {/* Insertion indicator before this item (except for index 0 which is handled by top-drop-zone) */}
                      {dragOverIndex === index && index > 0 && (
                        <div className="drop-indicator">
                          <div className="drop-line"></div>
                        </div>
                      )}
                      
                      <div
                        className={`navigation-item ${draggedItem === index ? 'dragging' : ''}`}
                        onClick={(e) => handleNavigationClick(graph.id, e)}
                        title={`Go to ${graph.title} • Drag to reorder`}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                      >
                        <GraphThumbnail
                          graph={graph}
                          isEnlarged={true}
                          onEnlarge={(e) => handleNavigationClick(graph.id, e)}
                          onClose={onClose}
                          onShowDetails={handleShowDetails}
                          isDarkMode={isDarkMode}
                          isNavigation={true}
                        />
                        <div className="drag-handle">⋮⋮</div>
                      </div>
                      
                      {/* Insertion indicator after the last item */}
                      {index === enlargedGraphs.length - 1 && dragOverIndex === enlargedGraphs.length && (
                        <div className="drop-indicator">
                          <div className="drop-line"></div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Chart Tile - Always last, not draggable */}
                  <div
                    className="navigation-item add-chart-tile"
                    onClick={openChartSelector}
                    title="Add more charts"
                    draggable={false}
                  >
                    <div className="add-chart-content">
                      <div className="add-chart-circle">
                        <span className="add-chart-plus">+</span>
                      </div>
                      <div className="add-chart-text">Add Chart</div>
                    </div>
                  </div>
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

      {!isWorkbenchView && !isCollectionView && (
        <>
          <CategoryNavigation 
            graphs={graphs}
            isDarkMode={isDarkMode}
          />
          <div className="categories-container">
            {categories.map(category => (
              <div key={category} data-category-section={category}>
                <CategoryDropdown
                  category={category}
                  graphs={graphs}
                  isOpen={true} // Open by default on homepage
                  enlargedTiles={enlargedTiles}
                  onEnlarge={onEnlarge}
                  onClose={onClose}
                  onShowDetails={handleShowDetails}
                  isDarkMode={isDarkMode}
                  isSelector={false}
                />
              </div>
            ))}
          </div>
        </>
      )}
      
      <DetailsModal 
        graph={detailsGraph}
        isOpen={!!detailsGraph}
        onClose={handleCloseDetails}
        isDarkMode={isDarkMode}
      />
      
      <ChartSelector
        graphs={graphs}
        enlargedTiles={enlargedTiles}
        onEnlarge={onEnlarge}
        onClose={closeChartSelector}
        isOpen={chartSelectorOpen}
        isDarkMode={isDarkMode}
      />
      
      <SaveCollectionModal
        isOpen={saveCollectionOpen}
        onClose={closeSaveCollection}
        onSave={handleSaveCollection}
        isDarkMode={isDarkMode}
      />
      
      <ClearWorkbenchModal
        isOpen={clearWorkbenchOpen}
        onConfirm={handleClearWorkbench}
        onCancel={closeClearWorkbench}
        chartCount={enlargedTiles.length}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default Dashboard;