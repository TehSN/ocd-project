// Authentication utilities for OCD Dashboard
// Handles user management, password hashing, and session management

import { loadAppState, saveAppState, loadUserState, saveUserState } from './storage';

/**
 * Hash a password using browser's built-in crypto API
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  try {
    // Convert password to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Error hashing password:', error);
    // Fallback to simple hashing if crypto.subtle is not available
    return btoa(password + 'ocd-salt-2024');
  }
};

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password
 * @param {string} hash - Stored password hash
 * @returns {Promise<boolean>} Whether password matches
 */
export const verifyPassword = async (password, hash) => {
  try {
    const hashedInput = await hashPassword(password);
    return hashedInput === hash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Check if a user exists
 * @param {string} username - Username to check
 * @returns {boolean} Whether user exists
 */
export const userExists = (username) => {
  const appState = loadAppState();
  return !!(appState.users && appState.users[username]);
};

/**
 * Get list of all existing users
 * @returns {Array} Array of user objects with basic info
 */
export const getAllUsers = () => {
  const appState = loadAppState();
  const users = appState.users || {};
  
  console.log('🔍 getAllUsers - Raw appState.users:', users);
  
  const userList = Object.keys(users).map(username => {
    const user = users[username];
    const hasPassword = !!(user.passwordHash);
    
    console.log(`🔍 User ${username}:`, {
      hasPasswordHash: hasPassword,
      passwordHashLength: user.passwordHash ? user.passwordHash.length : 0,
      passwordHashPreview: user.passwordHash ? user.passwordHash.substring(0, 10) + '...' : 'NONE',
      userData: user
    });
    
    return {
      username,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      hasPassword,
      passwordHash: user.passwordHash // Include this for debugging
    };
  });
  
  console.log('🔍 getAllUsers - Final result:', userList);
  return userList;
};

/**
 * Create a new user with password
 * @param {string} username - Username for new user
 * @param {string} password - Password for new user
 * @returns {Promise<{success: boolean, error?: string}>} Creation result
 */
export const createUser = async (username, password) => {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  try {
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    
    const appState = loadAppState();
    if (!appState.users) {
      appState.users = {};
    }

    // Check if user already exists
    if (appState.users[username]) {
      // User exists - update with password hash
      console.log(`🔧 Updating existing user ${username} with password hash:`, passwordHash.substring(0, 10) + '...');
      appState.users[username] = {
        ...appState.users[username],
        passwordHash,
        lastLogin: now,
        lastUpdated: now
      };
      console.log(`✅ Updated user ${username}:`, appState.users[username]);
    } else {
      // Create new user with default data
      console.log(`🆕 Creating new user ${username} with password hash:`, passwordHash.substring(0, 10) + '...');
      appState.users[username] = {
        passwordHash,
        collections: [],
        workbenchItems: [],
        isDarkMode: true,
        preferences: {},
        createdAt: now,
        lastLogin: now,
        lastUpdated: now
      };
      console.log(`✅ Created user ${username}:`, appState.users[username]);
    }

    console.log('💾 About to save appState:', appState);
    const saved = saveAppState(appState);
    console.log('💾 Save result:', saved);
    
    if (!saved) {
      return { success: false, error: 'Failed to save user data' };
    }

    // Verify the save worked
    const verifyState = loadAppState();
    console.log('🔍 Verification - reloaded state:', verifyState.users[username]);

    return { success: true };
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
};

/**
 * Authenticate a user with password
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<{success: boolean, error?: string}>} Authentication result
 */
export const authenticateUser = async (username, password) => {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  if (!userExists(username)) {
    return { success: false, error: 'User does not exist' };
  }

  try {
    const appState = loadAppState();
    const user = appState.users[username];
    
    if (!user.passwordHash) {
      return { success: false, error: 'User has no password set' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid password' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    saveAppState(appState);

    console.log(`User authenticated successfully: ${username}`);
    return { success: true };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, error: 'Authentication failed' };
  }
};

/**
 * Set current logged-in user
 * @param {string} username - Username to set as current
 * @returns {boolean} Success status
 */
export const setCurrentUser = (username) => {
  try {
    const appState = loadAppState();
    appState.currentUser = username;
    const saved = saveAppState(appState);
    
    if (saved) {
      console.log(`Current user set to: ${username}`);
    }
    
    return saved;
  } catch (error) {
    console.error('Error setting current user:', error);
    return false;
  }
};

/**
 * Get current logged-in user
 * @returns {string|null} Current username or null if none
 */
export const getCurrentUser = () => {
  try {
    const appState = loadAppState();
    return appState.currentUser || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Log out current user
 * @returns {boolean} Success status
 */
export const logoutUser = () => {
  try {
    const appState = loadAppState();
    appState.currentUser = null;
    const saved = saveAppState(appState);
    
    if (saved) {
      console.log('User logged out successfully');
    }
    
    return saved;
  } catch (error) {
    console.error('Error logging out user:', error);
    return false;
  }
};

/**
 * Get user's data (collections, workbench, preferences)
 * @param {string} username - Username to get data for
 * @returns {Object} User data object
 */
export const getUserData = (username) => {
  if (!username) return null;
  
  try {
    return loadUserState(username);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Save user's data (collections, workbench, preferences)
 * @param {string} username - Username to save data for
 * @param {Object} userData - User data to save
 * @returns {boolean} Success status
 */
export const saveUserData = (username, userData) => {
  if (!username || !userData) return false;
  
  try {
    return saveUserState(username, userData);
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Change user's password
 * @param {string} username - Username
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, error?: string}>} Change result
 */
export const changeUserPassword = async (username, oldPassword, newPassword) => {
  if (!username || !oldPassword || !newPassword) {
    return { success: false, error: 'All fields are required' };
  }

  // Verify current password
  const authResult = await authenticateUser(username, oldPassword);
  if (!authResult.success) {
    return { success: false, error: 'Current password is incorrect' };
  }

  try {
    const newPasswordHash = await hashPassword(newPassword);
    const appState = loadAppState();
    
    if (appState.users && appState.users[username]) {
      appState.users[username].passwordHash = newPasswordHash;
      appState.users[username].lastUpdated = new Date().toISOString();
      
      const saved = saveAppState(appState);
      if (!saved) {
        return { success: false, error: 'Failed to save new password' };
      }

      console.log(`Password changed successfully for user: ${username}`);
      return { success: true };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, error: 'Failed to change password' };
  }
};

/**
 * Delete a user and all their data
 * @param {string} username - Username to delete
 * @param {string} password - Password confirmation
 * @returns {Promise<{success: boolean, error?: string}>} Deletion result
 */
export const deleteUser = async (username, password) => {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  // Verify password before deletion
  const authResult = await authenticateUser(username, password);
  if (!authResult.success) {
    return { success: false, error: 'Password verification failed' };
  }

  try {
    const appState = loadAppState();
    
    if (appState.users && appState.users[username]) {
      delete appState.users[username];
      
      // If this was the current user, log them out
      if (appState.currentUser === username) {
        appState.currentUser = null;
      }
      
      const saved = saveAppState(appState);
      if (!saved) {
        return { success: false, error: 'Failed to delete user data' };
      }

      console.log(`User deleted successfully: ${username}`);
      return { success: true };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
};

/**
 * Check if crypto.subtle is available for secure password hashing
 * @returns {boolean} Whether secure hashing is available
 */
export const isSecureHashingAvailable = () => {
  return !!(window.crypto && window.crypto.subtle && window.crypto.subtle.digest);
};
