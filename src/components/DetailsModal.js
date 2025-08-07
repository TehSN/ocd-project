import React from 'react';
import Icon from './Icon';
import { HiX } from 'react-icons/hi';
import './DetailsModal.css';

function DetailsModal({ graph, isOpen, onClose, isDarkMode }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !graph) return null;

  return (
    <div 
      className={`details-modal-backdrop ${isDarkMode ? 'dark-mode' : ''}`} 
      onClick={handleBackdropClick}
    >
      <div className="details-modal">
        <div className="details-modal-header">
          <div className="details-title-section">
            <h2 className="details-modal-title">{graph.title}</h2>
            <span className={`details-category-tag category-${graph.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}>
              {graph.category}
            </span>
          </div>
          <button 
            className="details-modal-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <Icon size="medium" variant="modal-close"><HiX /></Icon>
          </button>
        </div>
        
        <div className="details-modal-content">
          
          <div className="details-description">
            <h3>Description</h3>
            <p>{graph.details}</p>
          </div>
          
          <div className="details-url">
            <h3>Source</h3>
            <a 
              href={graph.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="details-url-link"
            >
              Open Original Chart
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;