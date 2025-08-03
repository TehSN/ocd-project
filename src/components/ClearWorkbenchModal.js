import React, { useEffect } from 'react';
import './ClearWorkbenchModal.css';

function ClearWorkbenchModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  chartCount, 
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
    <div className="clear-workbench-overlay" onClick={onCancel}>
      <div className="clear-workbench-modal" onClick={e => e.stopPropagation()}>
        <div className="clear-workbench-header">
          <h2>Clear Workbench</h2>
          <button className="clear-workbench-close" onClick={onCancel}>
            ×
          </button>
        </div>
        
        <div className="clear-workbench-content">
          <p>Are you sure you want to clear all charts from your workbench?</p>
          <p className="clear-workbench-warning">
            This will remove all <strong>{chartCount} chart{chartCount !== 1 ? 's' : ''}</strong> from your current workbench. This action cannot be undone.
          </p>
          
          <div className="clear-workbench-buttons">
            <button 
              className="clear-workbench-btn clear-workbench-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
            
            <button 
              className="clear-workbench-btn clear-workbench-confirm"
              onClick={onConfirm}
            >
              Clear All Charts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClearWorkbenchModal;