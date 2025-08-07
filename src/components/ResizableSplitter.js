import React, { useState, useRef, useEffect } from 'react';
import './ResizableSplitter.css';

function ResizableSplitter({ onResize, isDarkMode, currentSidebarWidth = 200 }) {
  const [isDragging, setIsDragging] = useState(false);
  const splitterRef = useRef(null);
  const dragStartRef = useRef({ startX: 0, startWidth: 0 });

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStartRef.current.startX;
      const newWidth = dragStartRef.current.startWidth + deltaX;
      
      // Get container width for percentage calculation
      const dashboardContainer = document.querySelector('.dashboard.has-workbench');
      if (!dashboardContainer) return;
      
      const containerWidth = dashboardContainer.clientWidth;
      const minWidth = 150;
      const maxWidth = containerWidth * 0.5;
      
      const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      onResize(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Set cursor and selection styles
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    // Simple event listeners - no capture, no interference
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Add a fallback mouseup to window to catch edge cases
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onResize]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    
    // Store the starting position and current sidebar width
    dragStartRef.current = {
      startX: e.clientX,
      startWidth: currentSidebarWidth
    };
    
    setIsDragging(true);
  };

  return (
    <div
      ref={splitterRef}
      className={`resizable-splitter ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      title="Drag to resize sidebar"
    >
      <div className="splitter-handle">
        <div className="splitter-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}

export default ResizableSplitter;