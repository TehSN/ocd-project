import React, { useState } from 'react';
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
  
  // State to track current view: 'home', 'workbench', 'collection', or 'collections-page'
  const [currentView, setCurrentView] = useState('home');
  
  // State for collections
  const [collections, setCollections] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  
  // State for enlarge choice modal
  const [enlargeChoiceModal, setEnlargeChoiceModal] = useState({
    isOpen: false,
    chartId: null,
    chartTitle: ''
  });




  
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
    setEditingCollectionId(null); // Clear editing state when clearing workbench
    setCurrentView('home');
  };

  // Navigation functions
  const goToHome = () => {
    setCurrentView('home');
  };

  const goToWorkbench = () => {
    setCurrentView('workbench');
  };

  const goToCollectionsPage = () => {
    setCurrentView('collections-page');
  };

  // Modal choice handlers
  const handleAddToWorkbench = () => {
    const { chartId } = enlargeChoiceModal;
    setEnlargedTiles([...enlargedTiles, chartId]);
    setCurrentView('workbench');
    setEnlargeChoiceModal({ isOpen: false, chartId: null, chartTitle: '' });
  };

  const handleReplaceWorkbench = () => {
    const { chartId } = enlargeChoiceModal;
    setEnlargedTiles([chartId]);
    setCurrentView('workbench');
    setEnlargeChoiceModal({ isOpen: false, chartId: null, chartTitle: '' });
  };

  const closeEnlargeChoiceModal = () => {
    setEnlargeChoiceModal({ isOpen: false, chartId: null, chartTitle: '' });
  };

  // Collection management functions
  const saveCollection = (name) => {
    if (editingCollectionId) {
      // Update existing collection
      const updatedCollections = collections.map(collection => 
        collection.id === editingCollectionId
          ? {
              ...collection,
              name: name,
              charts: [...enlargedTiles],
              updatedAt: new Date().toISOString()
            }
          : collection
      );
      setCollections(updatedCollections);
      setEditingCollectionId(null); // Clear editing state
      return editingCollectionId;
    } else {
      // Create new collection
      const newCollection = {
        id: Date.now().toString(),
        name: name,
        charts: [...enlargedTiles],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCollections([...collections, newCollection]);
      return newCollection.id;
    }
  };

  const openCollection = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      setActiveCollectionId(collectionId);
      setCurrentView('collection');
    }
  };

  const editCollection = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      setEnlargedTiles([...collection.charts]);
      setActiveCollectionId(null);
      setEditingCollectionId(collectionId); // Track which collection we're editing
      setCurrentView('workbench');
    }
  };

  const renameCollection = (collectionId, newName) => {
    const updatedCollections = collections.map(collection => 
      collection.id === collectionId
        ? {
            ...collection,
            name: newName,
            updatedAt: new Date().toISOString()
          }
        : collection
    );
    setCollections(updatedCollections);
  };

  const cancelEditing = () => {
    setEditingCollectionId(null);
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
              <span style={{ fontSize: '1.5em'}}>⌂</span>
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
            
            <button
              className={`nav-button ${currentView === 'collections-page' ? 'active' : ''}`}
              onClick={goToCollectionsPage}
              aria-label="Go to collections page"
            >
              <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>⛉</span>
              Collections
              {collections.length > 0 && (
                <span className="collections-count">{collections.length}</span>
              )}
            </button>
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
          editingCollectionId={editingCollectionId}
          onSaveCollection={saveCollection}
          onEditCollection={editCollection}
          onRenameCollection={renameCollection}
          onCancelEditing={cancelEditing}
          onOpenCollection={openCollection}
          onDeleteCollection={deleteCollection}
          goToHome={goToHome}
          goToCollectionsPage={goToCollectionsPage}
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