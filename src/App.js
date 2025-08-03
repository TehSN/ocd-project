import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './colors.css';
import Dashboard from './components/Dashboard';
import EnlargeChoiceModal from './components/EnlargeChoiceModal';
import { graphData } from './graphData';

function App() {
  // State to track if we're in dark mode or light mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // State to track which tiles are enlarged
  const [enlargedTiles, setEnlargedTiles] = useState([]);
  
  // State to track current view: 'home', 'workbench', or 'collection'
  const [currentView, setCurrentView] = useState('home');
  
  // State for collections
  const [collections, setCollections] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [collectionsMenuOpen, setCollectionsMenuOpen] = useState(false);
  
  // State for enlarge choice modal
  const [enlargeChoiceModal, setEnlargeChoiceModal] = useState({
    isOpen: false,
    chartId: null,
    chartTitle: ''
  });

  // Ref for collections menu to handle click outside
  const collectionsMenuRef = useRef(null);

  // Close collections dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (collectionsMenuRef.current && !collectionsMenuRef.current.contains(event.target)) {
        setCollectionsMenuOpen(false);
      }
    };

    if (collectionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collectionsMenuOpen]);
  
  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to enlarge a tile
  const enlargeTile = (graphId) => {
    // If chart is already enlarged
    if (enlargedTiles.includes(graphId)) {
      // Switch to workbench view and scroll to it
      setCurrentView('workbench');
      setTimeout(() => {
        const element = document.getElementById(`enlarged-${graphId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
      return;
    }

    // If enlarging from home page and there are existing charts, show modal
    if (currentView === 'home' && enlargedTiles.length > 0) {
      const chart = graphData.find(g => g.id === graphId);
      setEnlargeChoiceModal({
        isOpen: true,
        chartId: graphId,
        chartTitle: chart?.title || 'Chart'
      });
      return;
    }

    // Otherwise, just add the chart and switch to workbench
    setEnlargedTiles([...enlargedTiles, graphId]);
    setCurrentView('workbench');
  };

  // Function to close/shrink a tile
  const closeTile = (graphId) => {
    setEnlargedTiles(enlargedTiles.filter(id => id !== graphId));
  };

  const closeAllTiles = () => {
    setEnlargedTiles([]);
    setCurrentView('home');
    setCollectionsMenuOpen(false); // Close collections dropdown
  };

  // Navigation functions
  const goToHome = () => {
    setCurrentView('home');
    setCollectionsMenuOpen(false); // Close collections dropdown
  };

  const goToWorkbench = () => {
    setCurrentView('workbench');
    setCollectionsMenuOpen(false); // Close collections dropdown
  };

  // Modal choice handlers
  const handleAddToWorkbench = () => {
    const { chartId } = enlargeChoiceModal;
    setEnlargedTiles([...enlargedTiles, chartId]);
    setCurrentView('workbench');
    setEnlargeChoiceModal({ isOpen: false, chartId: null, chartTitle: '' });
    setCollectionsMenuOpen(false); // Close collections dropdown
  };

  const handleReplaceWorkbench = () => {
    const { chartId } = enlargeChoiceModal;
    setEnlargedTiles([chartId]);
    setCurrentView('workbench');
    setEnlargeChoiceModal({ isOpen: false, chartId: null, chartTitle: '' });
    setCollectionsMenuOpen(false); // Close collections dropdown
  };

  const closeEnlargeChoiceModal = () => {
    setEnlargeChoiceModal({ isOpen: false, chartId: null, chartTitle: '' });
  };

  // Collection management functions
  const saveCollection = (name) => {
    const newCollection = {
      id: Date.now().toString(),
      name: name,
      charts: [...enlargedTiles],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCollections([...collections, newCollection]);
    return newCollection.id;
  };

  const openCollection = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      setActiveCollectionId(collectionId);
      setCurrentView('collection');
      setCollectionsMenuOpen(false); // Close collections dropdown
    }
  };

  const editCollection = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      setEnlargedTiles([...collection.charts]);
      setActiveCollectionId(null);
      setCurrentView('workbench');
      setCollectionsMenuOpen(false); // Close collections dropdown
    }
  };

  const deleteCollection = (collectionId) => {
    setCollections(collections.filter(c => c.id !== collectionId));
    if (activeCollectionId === collectionId) {
      setActiveCollectionId(null);
      setCurrentView('home');
    }
  };

  // Function to reorder enlarged tiles
  const reorderTiles = (newOrder) => {
    setEnlargedTiles(newOrder);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <header className="App-header">
        <div className="header-left">
          <h1>On-Chain Dashboard</h1>
          <div className="navigation-buttons">
            <button
              className={`nav-button ${currentView === 'home' ? 'active' : ''}`}
              onClick={goToHome}
              aria-label="Go to home page"
            >
              <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>⌂</span>
            Home
            </button>
            <button
              className={`nav-button ${currentView === 'workbench' ? 'active' : ''} ${enlargedTiles.length === 0 ? 'disabled' : ''}`}
              onClick={goToWorkbench}
              disabled={enlargedTiles.length === 0}
              aria-label="Go to workbench"
            >
              <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>⚒</span>
              Workbench
              {enlargedTiles.length > 0 && (
                <span className="workbench-count">{enlargedTiles.length}</span>
              )}
            </button>
            
            <div className="collections-menu" ref={collectionsMenuRef}>
              <button 
                className="collections-toggle nav-button"
                onClick={() => setCollectionsMenuOpen(!collectionsMenuOpen)}
              >
                <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>⛉</span>
                Collections {collections.length > 0 && <span className="collections-count">{collections.length}</span>}
              </button>
              {collections.length > 0 && collectionsMenuOpen && (
                <div className="collections-dropdown">
                  {collections.map(collection => (
                    <div key={collection.id} className="collection-item">
                      <span onClick={() => openCollection(collection.id)}>
                        {collection.name}
                      </span>
                      <button 
                        className="delete-collection"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCollection(collection.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '◐' : '◑'}
          </button>
        </div>
      </header>
      <main>
        <Dashboard 
          graphs={graphData} 
          enlargedTiles={enlargedTiles}
          onEnlarge={enlargeTile}
          onClose={closeTile}
          onCloseAll={closeAllTiles}
          onReorder={reorderTiles}
          isDarkMode={isDarkMode}
          currentView={currentView}
          collections={collections}
          activeCollectionId={activeCollectionId}
          onSaveCollection={saveCollection}
          onEditCollection={editCollection}
          goToHome={goToHome}
        />
      </main>
      
      <EnlargeChoiceModal
        isOpen={enlargeChoiceModal.isOpen}
        onClose={closeEnlargeChoiceModal}
        onAddToWorkbench={handleAddToWorkbench}
        onReplaceWorkbench={handleReplaceWorkbench}
        chartTitle={enlargeChoiceModal.chartTitle}
        workbenchCount={enlargedTiles.length}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;