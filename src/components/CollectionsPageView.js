import React, { useState } from 'react';
import './CollectionsPageView.css';

function CollectionsPageView({ 
  collections, 
  onOpenCollection, 
  onDeleteCollection, 
  isDarkMode, 
  graphs 
}) {
  const [collectionInfoModal, setCollectionInfoModal] = useState(null);

  const handleOpenCollection = (collectionId) => {
    onOpenCollection(collectionId);
  };

  const handleShowInfo = (e, collection) => {
    e.stopPropagation(); // Prevent opening the collection
    setCollectionInfoModal(collection);
  };

  const handleCloseInfo = () => {
    setCollectionInfoModal(null);
  };

  const handleDeleteCollection = (e, collectionId) => {
    e.stopPropagation(); // Prevent opening the collection
    if (window.confirm('Are you sure you want to delete this collection?')) {
      onDeleteCollection(collectionId);
    }
  };

  // Get collection charts for info modal
  const getCollectionCharts = (collection) => {
    return collection.charts
      .map(chartId => graphs.find(graph => graph.id === chartId))
      .filter(Boolean);
  };

  return (
    <div className="collections-page-view">
      <div className="collections-page-header">
        <h1>Collections</h1>
        <p className="collections-subtitle">
          {collections.length === 0 
            ? 'No collections saved yet' 
            : `${collections.length} collection${collections.length !== 1 ? 's' : ''} saved`
          }
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="empty-collections">
          <div className="empty-collections-content">
            <span className="empty-icon">⛉</span>
            <h2>No Collections Yet</h2>
            <p>Create collections by saving charts from your workbench.</p>
            <p>Go to <strong>⌂ Home</strong> → add charts → <strong>⚒ Workbench</strong> → <strong>Save</strong></p>
          </div>
        </div>
      ) : (
        <div className="collections-grid">
          {collections.map(collection => {
            const collectionCharts = getCollectionCharts(collection);
            const chartCount = collection.charts.length;
            
            return (
              <div
                key={collection.id}
                className="collection-tile"
                onClick={() => handleOpenCollection(collection.id)}
              >
                <div className="collection-tile-header">
                  <h3 className="collection-title">{collection.name}</h3>
                  <div className="collection-actions">
                    <button
                      className="collection-info-btn"
                      onClick={(e) => handleShowInfo(e, collection)}
                      title="View collection details"
                    >
                      ℹ
                    </button>
                    <button
                      className="collection-delete-btn"
                      onClick={(e) => handleDeleteCollection(e, collection.id)}
                      title="Delete collection"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="collection-tile-body">
                  <div className="collection-preview">
                    {/* Show mini chart previews if we have charts */}
                    {collectionCharts.slice(0, 4).map((chart, index) => (
                      <div 
                        key={chart.id} 
                        className={`mini-chart category-${chart.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        title={chart.title}
                      >
                        <div className="mini-chart-indicator"></div>
                      </div>
                    ))}
                    {chartCount > 4 && (
                      <div className="mini-chart more-charts">
                        +{chartCount - 4}
                      </div>
                    )}
                  </div>
                  
                  <div className="collection-meta">
                    <span className="chart-count">
                      {chartCount} chart{chartCount !== 1 ? 's' : ''}
                    </span>
                    <span className="collection-date">
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Collection Info Modal */}
      {collectionInfoModal && (
        <div className="collection-info-modal-overlay" onClick={handleCloseInfo}>
          <div className="collection-info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{collectionInfoModal.name}</h2>
              <button className="modal-close" onClick={handleCloseInfo}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="collection-stats">
                <div className="stat">
                  <span className="stat-value">{collectionInfoModal.charts.length}</span>
                  <span className="stat-label">Charts</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{new Date(collectionInfoModal.createdAt).toLocaleDateString()}</span>
                  <span className="stat-label">Created</span>
                </div>
              </div>
              
              <h3>Charts in this collection:</h3>
              <div className="collection-charts-list">
                {getCollectionCharts(collectionInfoModal).map(chart => (
                  <div key={chart.id} className={`chart-item category-${chart.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    <div className="chart-info">
                      <span className="chart-title">{chart.title}</span>
                      <span className="chart-category">{chart.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="open-collection-btn"
                onClick={() => {
                  handleCloseInfo();
                  handleOpenCollection(collectionInfoModal.id);
                }}
              >
                Open Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionsPageView;