import React, { useEffect } from 'react';
import './EnlargeChoiceModal.css';

function EnlargeChoiceModal({ 
  isOpen, 
  onClose, 
  onAddToWorkbench, 
  onReplaceWorkbench, 
  chartTitle, 
  workbenchCount,
  isDarkMode 
}) {
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

  if (!isOpen) return null;

  return (
    <div className="enlarge-choice-overlay" onClick={onClose}>
      <div className="enlarge-choice-modal" onClick={e => e.stopPropagation()}>
        <div className="enlarge-choice-header">
          <h2>Add Chart to Workbench</h2>
          <button className="enlarge-choice-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="enlarge-choice-content">
          <p>You have <strong>{workbenchCount} chart{workbenchCount !== 1 ? 's' : ''}</strong> already open in your workbench.</p>
          <p>How would you like to add <strong>"{chartTitle}"</strong>?</p>
          
          <div className="enlarge-choice-buttons">
            <button 
              className="enlarge-choice-btn enlarge-choice-add"
              onClick={onAddToWorkbench}
            >
              <div className="enlarge-choice-btn-icon">+</div>
              <div className="enlarge-choice-btn-content">
                <div className="enlarge-choice-btn-title">Add to Workbench</div>
                <div className="enlarge-choice-btn-subtitle">Keep existing charts and add this one</div>
              </div>
            </button>
            
            <button 
              className="enlarge-choice-btn enlarge-choice-replace"
              onClick={onReplaceWorkbench}
            >
              <div className="enlarge-choice-btn-icon">⟲</div>
              <div className="enlarge-choice-btn-content">
                <div className="enlarge-choice-btn-title">Replace Workbench</div>
                <div className="enlarge-choice-btn-subtitle">Close all charts and start with this one</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnlargeChoiceModal;