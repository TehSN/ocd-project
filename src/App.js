import React, { useState, useEffect } from 'react';
import './App.css';
import './colors.css';
import Dashboard from './components/Dashboard';
import EnlargeChoiceModal from './components/EnlargeChoiceModal';
import AddToCollectionModal from './components/AddToCollectionModal';
import UserAuthModal from './components/UserAuthModal';
import UserControls from './components/UserControls';
import Icon from './components/Icon';
import { graphData } from './graphData';
import { loadAppState, saveAppState, isStorageAvailable } from './utils/storage';
import { autoMigrate } from './utils/migrations';
import { setCurrentUser, authenticateUser } from './utils/auth';
// import { logoutUser } from './utils/auth';
import './utils/debug'; // Enable debug utilities in development
import { HiHome, HiCollection, HiSun, HiMoon } from 'react-icons/hi';
import { GiAnvilImpact } from "react-icons/gi";


function App() {
  // State to track if we're in dark mode or light mode
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // State to track workbench items
  const [workbenchItems, setWorkbenchItems] = useState([]);
  
  // State to track current view: 'home', 'workbench', 'collection', or 'collections-page'
  const [currentView, setCurrentView] = useState('home');
  
  // State for collections
  const [collections, setCollections] = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  
  // State for storage availability
  const [storageAvailable, setStorageAvailable] = useState(true);
  
  // State for user authentication
  const [currentUser, setCurrentUserState] = useState(null);
  // legacy switch-user modal removed; we navigate to startup instead
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State for enlarge choice modal
  const [enlargeChoiceModal, setEnlargeChoiceModal] = useState({
    isOpen: false,
    chartId: null,
    chartTitle: ''
  });

  // State for add to collection modal
  const [addToCollectionModal, setAddToCollectionModal] = useState({
    isOpen: false,
    chart: null
  });

  // Load persisted data on app initialization
  useEffect(() => {
    console.log('🚀 Initializing OCD Dashboard...');
    
    // Check if localStorage is available
    if (!isStorageAvailable()) {
      console.warn('⚠️ localStorage not available, app will work without persistence');
      setStorageAvailable(false);
      setIsInitialized(true);
      return;
    }

    try {
      // Load and auto-migrate data
      const appState = autoMigrate(loadAppState());
      
      // Set global state from persisted data
      if (appState.globalSettings) {
        setIsDarkMode(appState.globalSettings.isDarkMode ?? true);
      }
      
      // Check for existing users and auto-login logic
      const hasUsers = appState.users && Object.keys(appState.users).length > 0;
      const lastUser = appState.currentUser;
      
      if (hasUsers && lastUser && appState.users[lastUser]) {
        // Auto-login the last user
        setCurrentUserState(lastUser);
        const userData = appState.users[lastUser];
        
        // Load user's data into app state
        setCollections(userData.collections || []);
        setWorkbenchItems(userData.workbenchItems || []);
        setIsDarkMode(userData.isDarkMode ?? true);
        
        // Restore saved view state if available
        if (userData.savedView) {
          setCurrentView(userData.savedView);
        }
        if (userData.activeCollectionId) {
          setActiveCollectionId(userData.activeCollectionId);
        }
        if (userData.editingCollectionId) {
          setEditingCollectionId(userData.editingCollectionId);
        }
        
        console.log(`✅ Auto-logged in user: ${lastUser}`);
      } else {
        // No users or no valid last user, go to startup selection
        console.log('👤 No valid user session, showing startup user select');
      }
      
      console.log('✅ App initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      setStorageAvailable(false);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save user data whenever it changes (debounced to prevent excessive saves)
  useEffect(() => {
    if (!storageAvailable || !currentUser || !isInitialized) return;
    
    const timeoutId = setTimeout(() => {
      try {
        const appState = loadAppState();
        
        // Update user's data (preserve critical fields like passwordHash)
        if (appState.users && appState.users[currentUser]) {
          const existingUser = appState.users[currentUser];
          appState.users[currentUser] = {
            ...existingUser, // Preserve all existing fields including passwordHash
            collections,
            workbenchItems,
            isDarkMode,
            savedView: currentView,
            activeCollectionId,
            editingCollectionId,
            lastUpdated: new Date().toISOString()
            // passwordHash and other critical fields are preserved by the spread
          };
          
          saveAppState(appState);
          console.log(`💾 Saved data for user: ${currentUser}`);
          console.log(`🔒 Password hash preserved:`, existingUser.passwordHash ? 'YES' : 'NO');
        }
      } catch (error) {
        console.error('❌ Error saving user data:', error);
      }
    }, 500); // Debounce saves by 500ms
    
    return () => clearTimeout(timeoutId);
  }, [collections, workbenchItems, isDarkMode, currentView, activeCollectionId, editingCollectionId, currentUser, isInitialized, storageAvailable]);


  
  // User authentication functions
  const handleLogin = (username) => {
    try {
      // Set user session
      setCurrentUser(username);
      setCurrentUserState(username);
      
      // Load user data
      const appState = loadAppState();
      if (appState.users && appState.users[username]) {
        const userData = appState.users[username];
        
        // Load user's data into app state
        setCollections(userData.collections || []);
        setWorkbenchItems(userData.workbenchItems || []);
        setIsDarkMode(userData.isDarkMode ?? true);
        
        // Restore saved view state if available
        if (userData.savedView) {
          setCurrentView(userData.savedView);
        }
        if (userData.activeCollectionId) {
          setActiveCollectionId(userData.activeCollectionId);
        }
        if (userData.editingCollectionId) {
          setEditingCollectionId(userData.editingCollectionId);
        }
        
        console.log(`👤 User logged in: ${username}`);
      }
      
      // no modal to close anymore
    } catch (error) {
      console.error('❌ Error during login:', error);
      // stay in current state
    }
  };

  // const handleLogout = () => {
  //   if (currentUser) {
  //     logoutUser();
  //     setCurrentUserState(null);
  //     
  //     // Reset app state
  //     setCollections([]);
  //     setWorkbenchItems([]);
  //     setActiveCollectionId(null);
  //     setEditingCollectionId(null);
  //     setCurrentView('home');
  //     
  //     console.log('👋 User logged out');
  //   }
  // };

  const handleSwitchUser = () => {
    // Navigate to startup screen (user selection)
    setCurrentUserState(null);
    setCurrentView('home');
  };
  
  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to enlarge a tile
  const enlargeTile = (graphId) => {
            // If chart is already in workbench
    if (workbenchItems.includes(graphId)) {
      // Switch to workbench view and scroll to it
      setCurrentView('workbench');
      setTimeout(() => {
        const element = document.getElementById(`workbench-${graphId}`);
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
    if (currentView === 'home' && workbenchItems.length > 0) {
      const chart = graphData.find(g => g.id === graphId);
      setEnlargeChoiceModal({
        isOpen: true,
        chartId: graphId,
        chartTitle: chart?.title || 'Chart'
      });
      return;
    }

    // Otherwise, just add the chart and switch to workbench
    setWorkbenchItems([...workbenchItems, graphId]);
    setCurrentView('workbench');
  };

  // Function to close/shrink a tile
  const closeTile = (graphId) => {
    setWorkbenchItems(workbenchItems.filter(id => id !== graphId));
  };

  const closeAllTiles = () => {
    setWorkbenchItems([]);
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
    setWorkbenchItems([...workbenchItems, chartId]);
    setCurrentView('workbench');
    setEnlargeChoiceModal({ isOpen: false, chartId: null, chartTitle: '' });
  };

  const handleReplaceWorkbench = () => {
    const { chartId } = enlargeChoiceModal;
    setWorkbenchItems([chartId]);
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
              charts: [...workbenchItems],
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
        charts: [...workbenchItems],
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
      setWorkbenchItems([...collection.charts]);
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

  // Add to collection functions
  const openAddToCollectionModal = (chart) => {
    setAddToCollectionModal({
      isOpen: true,
      chart: chart
    });
  };

  const closeAddToCollectionModal = () => {
    setAddToCollectionModal({
      isOpen: false,
      chart: null
    });
  };

  const addChartToCollection = (chartId, collectionId) => {
    const updatedCollections = collections.map(collection => 
      collection.id === collectionId
        ? {
            ...collection,
            charts: collection.charts.includes(chartId) 
              ? collection.charts 
              : [...collection.charts, chartId],
            updatedAt: new Date().toISOString()
          }
        : collection
    );
    setCollections(updatedCollections);
  };

  const createCollectionWithChart = (chartId, collectionName) => {
    const newCollection = {
      id: Date.now().toString(),
      name: collectionName,
      charts: [chartId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCollections([...collections, newCollection]);
    return newCollection.id;
  };



  const deleteCollection = (collectionId) => {
    setCollections(collections.filter(c => c.id !== collectionId));
    if (activeCollectionId === collectionId) {
      setActiveCollectionId(null);
      setCurrentView('home');
    }
  };

  // Function to reorder workbench items
  const reorderTiles = (newOrder) => {
    setWorkbenchItems(newOrder);
  };

    // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="loading-screen">
          <div className="loading-content">
            <h1>🔗 OCD Dashboard</h1>
            <p>Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show startup page if no user is logged in
  if (!currentUser) {
    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="startup-screen">
          <div className="startup-content">
            <div className="startup-header">
              <h1> <span style={{ fontWeight: '1000'}}>On-Chain Dashboard</span></h1>
              <p>Who's using the dashboard?</p>
            </div>
            <UserAuthModal
              isOpen={true}
              onClose={() => {}} // Cannot close on startup screen
              onLogin={handleLogin}
              isDarkMode={isDarkMode}
              allowClose={false} // Never allow closing on startup
            />
          </div>
        </div>
      </div>
    );
  }

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
              <Icon size="small" variant="nav"><HiHome /></Icon>
              Home
            </button>
            <button
              className={`nav-button ${currentView === 'workbench' ? 'active' : ''} ${workbenchItems.length === 0 ? 'disabled' : ''}`}
              onClick={goToWorkbench}
              disabled={workbenchItems.length === 0}
              aria-label="Go to workbench"
            >
              <Icon size="small" variant="nav bold"><GiAnvilImpact /></Icon>
              Workbench
              {workbenchItems.length > 0 && (
                <span className="workbench-count">{workbenchItems.length}</span>
              )}
            </button>
            
            <button
              className={`nav-button ${currentView === 'collections-page' ? 'active' : ''}`}
              onClick={goToCollectionsPage}
              aria-label="Go to collections page"
            >
              <Icon size="small" variant="nav"><HiCollection /></Icon>
              Collections
              {collections.length > 0 && (
                <span className="collections-count">{collections.length}</span>
              )}
            </button>
          </div>
        </div>
        <div className="header-right">
          {/* User Information */}
          {currentUser && (
            <div className="user-info">
              <div className="user-actions">
                <UserControls
                  currentUserName={currentUser}
                  onSwitchUser={handleSwitchUser}
                  onChangePassword={async (oldPass, newPass) => {
                    try {
                      // verify current password
                      const res = await authenticateUser(currentUser, oldPass);
                      if (!res.success) {
                        alert('Current password is incorrect');
                        return;
                      }
                      // save new password via auth utils
                      // simple update via createUser path (updates if user exists)
                      const { createUser } = await import('./utils/auth');
                      const r = await createUser(currentUser, newPass);
                      if (r.success) {
                        alert('Password updated');
                      } else {
                        alert(r.error || 'Failed to update password');
                      }
                    } catch (e) {
                      console.error(e);
                      alert('Failed to update password');
                    }
                  }}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}
          
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            <Icon size="medium">
              {isDarkMode ? <HiSun /> : <HiMoon />}
            </Icon>
          </button>
        </div>
      </header>
      <main>
        <Dashboard 
          graphs={graphData} 
          workbenchItems={workbenchItems}
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
          onAddToCollection={openAddToCollectionModal}
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
        workbenchCount={workbenchItems.length}
        isDarkMode={isDarkMode}
      />
      
      <AddToCollectionModal
        isOpen={addToCollectionModal.isOpen}
        onClose={closeAddToCollectionModal}
        onAddToCollection={addChartToCollection}
        onCreateCollection={createCollectionWithChart}
        collections={collections}
        chartTitle={addToCollectionModal.chart?.title || ''}
        chartId={addToCollectionModal.chart?.id || ''}
      />
      
      {/* legacy switch-user modal removed */}
    </div>
  );
}

export default App;