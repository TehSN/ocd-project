import React, { useState, useEffect } from 'react';
import './AddToCollectionModal.css';

function AddToCollectionModal({ isOpen, onClose, onAddToCollection, onCreateCollection, collections, chartTitle, chartId }) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsCreatingNew(false);
      setNewCollectionName('');
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleAddToExisting = (collectionId) => {
    onAddToCollection(chartId, collectionId);
    onClose();
  };

  const handleCreateNew = () => {
    if (newCollectionName.trim()) {
      onCreateCollection(chartId, newCollectionName.trim());
      onClose();
    }
  };

  const handleSubmitNewCollection = (e) => {
    e.preventDefault();
    handleCreateNew();
  };

  const startCreatingNew = () => {
    setIsCreatingNew(true);
  };

  const cancelCreatingNew = () => {
    setIsCreatingNew(false);
    setNewCollectionName('');
  };

  if (!isOpen) return null;

  return (
    <div className="add-to-collection-overlay">
      <div className="add-to-collection-modal">
        <div className="add-to-collection-header">
          <h2>Add to Collection</h2>
          <button className="add-to-collection-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="add-to-collection-content">
          <div className="chart-info">
            <p>Add "<strong>{chartTitle}</strong>" to a collection:</p>
          </div>

          {!isCreatingNew ? (
            <>
              {collections.length > 0 && (
                <div className="existing-collections">
                  <h3>Existing Collections</h3>
                  <div className="collections-list">
                    {collections.map(collection => (
                      <div key={collection.id} className="collection-option">
                        <div className="collection-info">
                          <span className="collection-name">{collection.name}</span>
                          <span className="collection-count">
                            {collection.charts.length} chart{collection.charts.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <button 
                          className="add-to-collection-btn"
                          onClick={() => handleAddToExisting(collection.id)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="new-collection-section">
                <button 
                  className="create-new-collection-btn"
                  onClick={startCreatingNew}
                >
                  <span className="create-icon">⛉</span>
                  Create New Collection
                </button>
              </div>
            </>
          ) : (
            <div className="create-new-form">
              <h3>Create New Collection</h3>
              <form onSubmit={handleSubmitNewCollection}>
                <div className="form-group">
                  <label htmlFor="collection-name">Collection Name:</label>
                  <input
                    id="collection-name"
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Enter collection name..."
                    autoFocus
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={cancelCreatingNew}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="create-btn"
                    disabled={!newCollectionName.trim()}
                  >
                    Create & Add
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddToCollectionModal;