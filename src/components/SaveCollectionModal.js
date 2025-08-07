import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { HiX } from 'react-icons/hi';
import './SaveCollectionModal.css';

function SaveCollectionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  isDarkMode,
  isEditing = false,
  editingCollectionName = ''
}) {
  const [collectionName, setCollectionName] = useState('');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCollectionName(isEditing ? editingCollectionName : '');
    }
  }, [isOpen, isEditing, editingCollectionName]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (collectionName.trim()) {
      onSave(collectionName.trim());
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <div className="save-collection-overlay" onClick={onClose}>
      <div className="save-collection-modal" onClick={e => e.stopPropagation()}>
        <div className="save-collection-header">
          <h2>{isEditing ? 'Update Collection' : 'Save Collection'}</h2>
                  <button className="save-collection-close" onClick={onClose}>
          <Icon size="medium" variant="modal-close"><HiX /></Icon>
        </button>
        </div>
        
        <form onSubmit={handleSubmit} className="save-collection-form">
          <div className="save-collection-content">
            <p>{isEditing ? 'Update the collection name:' : 'Enter a name for your collection:'}</p>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Collection name..."
              className="collection-name-input"
              autoFocus
            />
          </div>
          
          <div className="save-collection-buttons">
            <button 
              type="button"
              className="save-collection-btn save-collection-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="save-collection-btn save-collection-save"
              disabled={!collectionName.trim()}
            >
              {isEditing ? 'Update Collection' : 'Save Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaveCollectionModal;