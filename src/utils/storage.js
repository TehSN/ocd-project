// Storage utilities for OCD Dashboard
// Handles localStorage operations with error handling and data validation

const STORAGE_KEY = 'ocd-app-data';
const CURRENT_APP_VERSION = '1.0.0';

// Default application state structure
const DEFAULT_APP_STATE = {
  appVersion: CURRENT_APP_VERSION,
  users: {},
  currentUser: null,
  globalSettings: {
    isDarkMode: true
  }
};

// Default user state structure
const DEFAULT_USER_STATE = {
  collections: [],
  workbenchItems: [],
  isDarkMode: true,
  preferences: {},
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

/**
 * Safely get data from localStorage with error handling
 * @returns {Object} Application state object
 */
export const loadAppState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log('No stored data found, initializing with defaults');
      return DEFAULT_APP_STATE;
    }

    const parsed = JSON.parse(stored);
    
    // Validate basic structure
    if (!parsed || typeof parsed !== 'object') {
      console.warn('Invalid stored data structure, resetting to defaults');
      return DEFAULT_APP_STATE;
    }

    // Merge with defaults to ensure all required fields exist
    const state = {
      ...DEFAULT_APP_STATE,
      ...parsed,
      globalSettings: {
        ...DEFAULT_APP_STATE.globalSettings,
        ...parsed.globalSettings
      }
    };

    console.log('Loaded app state from localStorage');
    return state;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return DEFAULT_APP_STATE;
  }
};

/**
 * Safely save data to localStorage with error handling
 * @param {Object} state - Application state to save
 * @returns {boolean} Success status
 */
export const saveAppState = (state) => {
  try {
    // Add timestamp for debugging
    const stateWithTimestamp = {
      ...state,
      lastSaved: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithTimestamp));
    console.log('Saved app state to localStorage');
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    
    // Check if it's a quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      // Could implement cleanup logic here in the future
    }
    
    return false;
  }
};

/**
 * Get user-specific data
 * @param {string} username - Username to get data for
 * @returns {Object} User state object
 */
export const loadUserState = (username) => {
  const appState = loadAppState();
  
  if (!username || !appState.users[username]) {
    console.log(`📝 No data found for user: ${username}`);
    return DEFAULT_USER_STATE;
  }

  // Merge with defaults to ensure all required fields exist
  const userState = {
    ...DEFAULT_USER_STATE,
    ...appState.users[username]
  };

  console.log(`Loaded state for user: ${username}`);
  return userState;
};

/**
 * Save user-specific data
 * @param {string} username - Username to save data for
 * @param {Object} userData - User data to save
 * @returns {boolean} Success status
 */
export const saveUserState = (username, userData) => {
  if (!username) {
    console.error('Cannot save user state: no username provided');
    return false;
  }

  const appState = loadAppState();
  
  // Ensure users object exists
  if (!appState.users) {
    appState.users = {};
  }

  // Update user data with timestamp
  appState.users[username] = {
    ...userData,
    lastUpdated: new Date().toISOString()
  };

  console.log(`Saving state for user: ${username}`);
  return saveAppState(appState);
};

/**
 * Get list of all users
 * @returns {Array} Array of usernames
 */
export const getAllUsers = () => {
  const appState = loadAppState();
  return Object.keys(appState.users || {});
};

/**
 * Check if localStorage is available and working
 * @returns {boolean} localStorage availability
 */
export const isStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.error('localStorage not available:', error);
    return false;
  }
};

/**
 * Clear all app data (for testing/reset purposes)
 * @returns {boolean} Success status
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared all app data');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

/**
 * Get storage usage information
 * @returns {Object} Storage stats
 */
export const getStorageInfo = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const sizeInBytes = data ? new Blob([data]).size : 0;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    
    return {
      sizeInBytes,
      sizeInKB,
      hasData: !!data,
      userCount: getAllUsers().length
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      sizeInBytes: 0,
      sizeInKB: '0.00',
      hasData: false,
      userCount: 0
    };
  }
};

// Export default state structures for use in other modules
export { DEFAULT_APP_STATE, DEFAULT_USER_STATE };
