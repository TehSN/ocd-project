import React, { useEffect } from 'react';
import Icon from './Icon';
import { HiX } from 'react-icons/hi';
import './EditCollectionModal.css';

function EditCollectionModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  collectionName, 
  isDarkMode 
}) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="edit-collection-overlay" onClick={onCancel}>
      <div className="edit-collection-modal" onClick={e => e.stopPropagation()}>
        <div className="edit-collection-header">
          <h2>Edit Collection</h2>
                  <button className="edit-collection-close" onClick={onCancel}>
          <Icon size="medium" variant="modal-close"><HiX /></Icon>
        </button>
        </div>
        
        <div className="edit-collection-content">
          <p>Do you want to open <strong>"{collectionName}"</strong> in the workbench for editing?</p>
          <p className="edit-collection-warning">
            This will replace any charts currently in your workbench.
          </p>
          
          <div className="edit-collection-buttons">
            <button 
              className="edit-collection-btn edit-collection-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
            
            <button 
              className="edit-collection-btn edit-collection-confirm"
              onClick={onConfirm}
            >
              Open in Workbench
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCollectionModal;