import React, { useState, useEffect, useRef } from 'react';
import GraphThumbnail from './GraphThumbnail';
import WorkbenchItem from './WorkbenchItem';
import DetailsModal from './DetailsModal';
import ResizableSplitter from './ResizableSplitter';
import ChartSelector from './ChartSelector';
import CategoryDropdown from './CategoryDropdown';
import CategoryNavigation from './CategoryNavigation';
import SaveCollectionModal from './SaveCollectionModal';
import ClearWorkbenchModal from './ClearWorkbenchModal';
import PreviewModal from './PreviewModal';
import CollectionsView from './CollectionsView';
import CollectionsPageView from './CollectionsPageView';
import Icon from './Icon';
import { categories } from '../graphData';
import { HiChevronLeft, HiChevronRight, HiDotsVertical } from 'react-icons/hi';
import { IoMdAdd } from 'react-icons/io';
import './Dashboard.css';

function Dashboard({ 
  graphs, 
  workbenchItems, 
  onEnlarge, 
  onClose,
  onCloseAll, 
  onReorder, 
  isDarkMode, 
  currentView,
  collections,
  activeCollectionId,
  editingCollectionId,
  onSaveCollection,
  onEditCollection,
  onRenameCollection,
  onCancelEditing,
  onOpenCollection,
  onDeleteCollection,
  onAddToCollection,
  goToHome,
  goToCollectionsPage
}) {
  const [detailsGraph, setDetailsGraph] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300); // Default sidebar width
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Track collapse state
  const [chartSelectorOpen, setChartSelectorOpen] = useState(false); // Track chart selector modal
  const [saveCollectionOpen, setSaveCollectionOpen] = useState(false); // Track save collection modal
  const [clearWorkbenchOpen, setClearWorkbenchOpen] = useState(false); // Track clear workbench modal
  const [previewGraph, setPreviewGraph] = useState(null); // Track preview modal
  const [draggedItem, setDraggedItem] = useState(null); // Track dragged item
  const [dragOverIndex, setDragOverIndex] = useState(null); // Track drag over position
  const previousWorkbenchItems = useRef([]); // Track previous state to detect new additions
  
  // Create workbenchGraphs in the order they were enlarged
  const workbenchGraphs = workbenchItems.map(id => graphs.find(graph => graph.id === id)).filter(Boolean);
  const isWorkbenchView = currentView === 'workbench';
  const isCollectionView = currentView === 'collection';
  const isCollectionsPageView = currentView === 'collections-page';
  const activeCollection = activeCollectionId ? collections.find(c => c.id === activeCollectionId) : null;

  // Scroll to newly added workbench chart
  useEffect(() => {
    if (workbenchItems.length > previousWorkbenchItems.current.length) {
      // Find the newly added tile ID
      const newTileId = workbenchItems.find(id => !previousWorkbenchItems.current.includes(id));
      if (newTileId) {
        // Small delay to ensure the element is rendered
        setTimeout(() => {
          const element = document.getElementById(`workbench-${newTileId}`);
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
    previousWorkbenchItems.current = [...workbenchItems];
  }, [workbenchItems]);

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

  const handlePreview = (graph) => {
    setPreviewGraph(graph);
  };

  const closePreview = () => {
    setPreviewGraph(null);
  };

  const handlePreviewAddToWorkbench = (graphId) => {
    onEnlarge(graphId);
    setPreviewGraph(null);
  };

  const handleNavigationClick = (graphId, e) => {
    // Don't navigate if we're in the middle of a drag operation
    if (draggedItem !== null) {
      e.preventDefault();
      return;
    }
    
    // Scroll to the workbench chart instead of toggling
    setTimeout(() => {
      const element = document.getElementById(`workbench-${graphId}`);
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

    const newOrder = [...workbenchItems];
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
    <div className={`dashboard ${isWorkbenchView ? 'has-workbench' : ''}`}>
      {isCollectionsPageView && (
        <CollectionsPageView
          collections={collections}
          onOpenCollection={onOpenCollection}
          onDeleteCollection={onDeleteCollection}
          onRenameCollection={onRenameCollection}
          onEditCollection={onEditCollection}
          isDarkMode={isDarkMode}
          graphs={graphs}
        />
      )}
      
      {isCollectionView && (
        <CollectionsView
          collection={activeCollection}
          graphs={graphs}
          onEditCollection={onEditCollection}
          onBack={goToCollectionsPage}
          isDarkMode={isDarkMode}
        />
      )}
      
      {isWorkbenchView && (
        <>
          {/* Sidebar toggle - moves with sidebar */}
          <div className="sidebar-toggle-container" style={{
            position: 'absolute',
            left: sidebarCollapsed ? '20px' : `${sidebarWidth + 5}px`,
            top: '0px',
            zIndex: 30
          }}>
            <button 
              className={`sidebar-toggle ${sidebarCollapsed ? 'sidebar-expand' : 'sidebar-collapse'}`}
              onClick={toggleSidebarCollapse}
              title={sidebarCollapsed ? "Show navigation" : "Hide navigation"}
            >
              <Icon size="medium">
                {sidebarCollapsed ? <HiChevronRight /> : <HiChevronLeft />}
              </Icon>
            </button>
          </div>

          {!sidebarCollapsed && (
            <>
              <div className="sidebar navigation-sidebar" style={{ width: `${sidebarWidth}px` }}>
                {/* Sidebar workbench controls */}
                <div className="sidebar-controls">
                  <button 
                    className="chart-selector-toggle"
                    onClick={openChartSelector}
                    title="Add charts"
                  >
                    <Icon size="small" variant="action"><IoMdAdd /></Icon>
                  </button>
                  
                  {workbenchItems.length > 0 && (
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
                    {dragOverIndex === 0 && workbenchGraphs.length > 0 && (
                      <div className="drop-indicator">
                        <div className="drop-line"></div>
                      </div>
                    )}
                  </div>
                  
                  {workbenchGraphs.map((graph, index) => (
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
                          isInWorkbench={true}
                          onEnlarge={(e) => handleNavigationClick(graph.id, e)}
                          onClose={onClose}
                          onShowDetails={handleShowDetails}
                          isDarkMode={isDarkMode}
                          isNavigation={true}
                        />
                        <div className="drag-handle">
                          <Icon size="small"><HiDotsVertical /></Icon>
                        </div>
                      </div>
                      
                      {/* Insertion indicator after the last item */}
                      {index === workbenchGraphs.length - 1 && dragOverIndex === workbenchGraphs.length && (
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
                        <Icon size="small" variant="action"><IoMdAdd /></Icon>
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
          
          <div className="workbench-area" style={{ 
            width: sidebarCollapsed ? '100%' : `calc(100% - ${sidebarWidth + 26}px)` 
          }}>
            {workbenchGraphs.map(graph => (
              <div id={`workbench-${graph.id}`} key={`workbench-${graph.id}`}>
                                 <WorkbenchItem
                  graph={graph}
                  onClose={onClose}
                  isDarkMode={isDarkMode}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {!isWorkbenchView && !isCollectionView && !isCollectionsPageView && (
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
                  workbenchItems={workbenchItems}
                  onEnlarge={onEnlarge}
                  onClose={onClose}
                  onShowDetails={handleShowDetails}
                  onPreview={handlePreview}
                  onAddToCollection={onAddToCollection}
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
        workbenchItems={workbenchItems}
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
        isEditing={!!editingCollectionId}
        editingCollectionName={editingCollectionId ? collections.find(c => c.id === editingCollectionId)?.name : ''}
      />
      
      <ClearWorkbenchModal
        isOpen={clearWorkbenchOpen}
        onConfirm={handleClearWorkbench}
        onCancel={closeClearWorkbench}
        chartCount={workbenchItems.length}
        isDarkMode={isDarkMode}
      />
      
      <PreviewModal
        isOpen={!!previewGraph}
        graph={previewGraph}
        onClose={closePreview}
        onAddToWorkbench={handlePreviewAddToWorkbench}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default Dashboard;