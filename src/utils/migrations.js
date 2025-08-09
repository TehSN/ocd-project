// Data migration system for OCD Dashboard
// Handles version upgrades and data structure changes

import { saveAppState } from './storage';

// Migration functions for different versions
const MIGRATIONS = {
  '1.0.0': {
    description: 'Initial version with basic persistence',
    migrate: (data) => {
      console.log('📦 Migrating to v1.0.0 (initial version)');
      
      // Ensure basic structure exists
      const migrated = {
        appVersion: '1.0.0',
        users: {},
        currentUser: null,
        globalSettings: {
          isDarkMode: true
        },
        ...data
      };

      return migrated;
    }
  }
  // Future migrations will be added here:
  // '1.1.0': {
  //   description: 'Added user preferences',
  //   migrate: (data) => { ... }
  // }
};

/**
 * Get the latest version number
 * @returns {string} Latest version
 */
export const getLatestVersion = () => {
  const versions = Object.keys(MIGRATIONS);
  return versions[versions.length - 1];
};

/**
 * Compare version strings (semantic versioning)
 * @param {string} version1 
 * @param {string} version2 
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export const compareVersions = (version1, version2) => {
  if (!version1 || !version2) return 0;
  
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }
  
  return 0;
};

/**
 * Get list of migrations needed to upgrade from one version to another
 * @param {string} fromVersion - Current version
 * @param {string} toVersion - Target version
 * @returns {Array} Array of migration objects
 */
export const getMigrationsNeeded = (fromVersion, toVersion) => {
  if (!fromVersion || !toVersion) return [];
  
  const allVersions = Object.keys(MIGRATIONS).sort(compareVersions);
  const fromIndex = allVersions.indexOf(fromVersion);
  const toIndex = allVersions.indexOf(toVersion);
  
  if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
    return [];
  }
  
  return allVersions
    .slice(fromIndex + 1, toIndex + 1)
    .map(version => ({
      version,
      ...MIGRATIONS[version]
    }));
};

/**
 * Run migrations on data to upgrade it to the latest version
 * @param {Object} data - Data to migrate
 * @returns {Object} Migrated data
 */
export const runMigrations = (data) => {
  const currentVersion = data?.appVersion || '0.0.0';
  const latestVersion = getLatestVersion();
  
  // Check if migration is needed
  if (compareVersions(currentVersion, latestVersion) >= 0) {
    console.log(`Data is already at latest version (${currentVersion})`);
    return data;
  }
  
  console.log(`Migrating data from v${currentVersion} to v${latestVersion}`);
  
  const migrationsNeeded = getMigrationsNeeded(currentVersion, latestVersion);
  
  if (migrationsNeeded.length === 0) {
    console.log('No migrations needed');
    return data;
  }
  
  let migratedData = { ...data };
  
  // Run each migration in sequence
  for (const migration of migrationsNeeded) {
    console.log(`Running migration: ${migration.description}`);
    
    try {
      migratedData = migration.migrate(migratedData);
      migratedData.appVersion = migration.version;
      console.log(`Successfully migrated to v${migration.version}`);
    } catch (error) {
      console.error(`Migration to v${migration.version} failed:`, error);
      // In case of migration failure, we could implement rollback or continue with partial migration
      break;
    }
  }
  
  return migratedData;
};

/**
 * Check if data needs migration and auto-migrate if necessary
 * @param {Object} data - Data to check and potentially migrate
 * @returns {Object} Potentially migrated data
 */
export const autoMigrate = (data) => {
  const currentVersion = data?.appVersion || '0.0.0';
  const latestVersion = getLatestVersion();
  
  if (compareVersions(currentVersion, latestVersion) < 0) {
    console.log('🚀 Auto-migration triggered');
    const migratedData = runMigrations(data);
    
    // Save the migrated data
    if (saveAppState(migratedData)) {
      console.log('Migrated data saved successfully');
    } else {
      console.error('Failed to save migrated data');
    }
    
    return migratedData;
  }
  
  return data;
};

/**
 * Validate data structure for a specific version
 * @param {Object} data - Data to validate
 * @param {string} version - Version to validate against
 * @returns {boolean} Whether data is valid for the version
 */
export const validateDataStructure = (data, version = getLatestVersion()) => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Basic validation for current version
  if (version === '1.0.0') {
    return (
      typeof data.appVersion === 'string' &&
      typeof data.users === 'object' &&
      data.users !== null &&
      typeof data.globalSettings === 'object' &&
      data.globalSettings !== null
    );
  }
  
  return true; // Unknown version, assume valid
};

/**
 * Create a backup of current data before migration
 * @param {Object} data - Data to backup
 * @returns {boolean} Backup success status
 */
export const createBackup = (data) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupKey = `ocd-app-data-backup-${timestamp}`;
    
    localStorage.setItem(backupKey, JSON.stringify(data));
    console.log(`Created backup: ${backupKey}`);
    return true;
  } catch (error) {
    console.error('Failed to create backup:', error);
    return false;
  }
};

/**
 * Get list of available backups
 * @returns {Array} Array of backup keys
 */
export const getAvailableBackups = () => {
  const backups = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ocd-app-data-backup-')) {
        backups.push(key);
      }
    }
  } catch (error) {
    console.error('Error getting backups:', error);
  }
  
  return backups.sort();
};

export { MIGRATIONS };
