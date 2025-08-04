import React, { useState } from 'react';
import EnlargedTile from './EnlargedTile';
import EditCollectionModal from './EditCollectionModal';
import ResizableSplitter from './ResizableSplitter';
import './CollectionsView.css';

function CollectionsView({ 
  collection, 
  graphs, 
  onEditCollection, 
  onBack, 
  isDarkMode 
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!collection) {
    return (
      <div className="collections-view">
        <div className="collection-not-found">
          <h2>Collection not found</h2>
          <button onClick={onBack} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const collectionGraphs = collection.charts
    .map(chartId => graphs.find(graph => graph.id === chartId))
    .filter(Boolean);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleConfirmEdit = () => {
    setEditModalOpen(false);
    onEditCollection(collection.id);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
  };

  const handleSidebarResize = (newWidth) => {
    setSidebarWidth(newWidth);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleChartNavigation = (chartId) => {
    const element = document.getElementById(`collection-enlarged-${chartId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <div className="collections-view has-sidebar">
      {/* Control buttons positioned outside all containers */}
      <div className="dashboard-controls">
        <button 
          className={`sidebar-toggle ${sidebarCollapsed ? 'sidebar-expand' : 'sidebar-collapse'}`}
          onClick={toggleSidebarCollapse}
          title={sidebarCollapsed ? "Show navigation" : "Hide navigation"}
        >
          {sidebarCollapsed ? '\u00bb' : '\u00ab'}
        </button>
      </div>

      {!sidebarCollapsed && (
        <>
          <div className="sidebar collection-sidebar" style={{ width: `${sidebarWidth}px` }}>
            {/* Collection Info Section */}
            <div className="collection-info-section">
              <div className="collection-details">
                <h2 className="collection-title">{collection.name}</h2>
                <span className="collection-meta">
                  {collection.charts.length} chart{collection.charts.length !== 1 ? 's' : ''} • 
                  Created {new Date(collection.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button 
                onClick={handleEditClick} 
                className="edit-collection-button"
                title="Edit Collection in Workbench"
              >
                <span> <b style={{ fontSize: '1.2rem' }}>⚒</b> Edit</span>
              </button>
            </div>

            {/* Charts Navigation */}
            <div className="collection-navigation">
              <h3 className="navigation-title">Charts</h3>
              <div className="navigation-grid">
                {collectionGraphs.map((graph) => (
                  <div
                    key={`nav-${graph.id}`}
                    className={`navigation-item collection-nav-item category-${graph.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleChartNavigation(graph.id)}
                    title={`Go to ${graph.title}`}
                  >
                    <div className="nav-item-content">
                      <div className="nav-item-title">{graph.title}</div>
                      <div className="nav-item-category">{graph.category}</div>
                    </div>
                  </div>
                ))}
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
      
      <div className="enlarged-area collection-enlarged-area" style={{ 
        width: sidebarCollapsed ? '100%' : `calc(100% - ${sidebarWidth + 26}px)` 
      }}>
        {collectionGraphs.length === 0 ? (
          <div className="empty-collection">
            <p>This collection is empty or contains charts that are no longer available.</p>
          </div>
        ) : (
          collectionGraphs.map((graph) => (
            <div id={`collection-enlarged-${graph.id}`} key={`collection-enlarged-${graph.id}`}>
              <EnlargedTile
                graph={graph}
                onClose={null} // Read-only, no close functionality
                isDarkMode={isDarkMode}
                isReadOnly={true}
              />
            </div>
          ))
        )}
      </div>

      <EditCollectionModal
        isOpen={editModalOpen}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
        collectionName={collection.name}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default CollectionsView;