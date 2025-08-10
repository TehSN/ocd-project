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
  },
  '1.1.0': {
    description: 'Added user system and migrate existing data',
    migrate: (data) => {
      console.log('🔄 Migrating to v1.1.0 (user system)');
      
      const migrated = {
        ...data,
        appVersion: '1.1.0'
      };

      // Check if we have old-style data to migrate
      const hasOldCollections = data.tempCollections && Array.isArray(data.tempCollections) && data.tempCollections.length > 0;
      const hasOldWorkbench = data.tempWorkbench && (
        (Array.isArray(data.tempWorkbench.items) && data.tempWorkbench.items.length > 0) ||
        data.tempWorkbench.currentView !== 'home'
      );

      if (hasOldCollections || hasOldWorkbench) {
        console.log('📚 Found existing data to migrate to user system');
        
        // Migrate to Pantelis (first user alphabetically)
        const migrateToUser = 'Pantelis';
        const now = new Date().toISOString();
        
        if (!migrated.users) {
          migrated.users = {};
        }

        migrated.users[migrateToUser] = {
          // No password hash - will prompt for password creation on first login
          collections: data.tempCollections || [],
          workbenchItems: data.tempWorkbench?.items || [],
          isDarkMode: data.globalSettings?.isDarkMode ?? true,
          preferences: {},
          createdAt: now,
          lastLogin: now,
          lastUpdated: now,
          isMigrated: true // Flag to identify migrated user
        };

        // Preserve current view and state in migrated user
        if (data.tempWorkbench) {
          migrated.users[migrateToUser].savedView = data.tempWorkbench.currentView || 'home';
          migrated.users[migrateToUser].activeCollectionId = data.tempWorkbench.activeCollectionId;
          migrated.users[migrateToUser].editingCollectionId = data.tempWorkbench.editingCollectionId;
        }

        // Clear current user to force user selection on startup
        migrated.currentUser = null;
        
        console.log(`✅ Migrated existing data to user: ${migrateToUser}`);
        console.log(`   - Collections: ${migrated.users[migrateToUser].collections.length}`);
        console.log(`   - Workbench items: ${migrated.users[migrateToUser].workbenchItems.length}`);
      }

      // Clean up old data structure (but keep as backup)
      if (data.tempCollections || data.tempWorkbench) {
        migrated.legacyDataBackup = {
          tempCollections: data.tempCollections,
          tempWorkbench: data.tempWorkbench,
          migratedAt: new Date().toISOString()
        };
        
        // Remove from main structure
        delete migrated.tempCollections;
        delete migrated.tempWorkbench;
      }

      return migrated;
    }
  },
  '1.2.0': {
    description: 'Fixed user system - remove DefaultUser, use predefined users only',
    migrate: (data) => {
      console.log('🔄 Migrating to v1.2.0 (fix user system)');
      
      const migrated = {
        ...data,
        appVersion: '1.2.0'
      };

      // Remove DefaultUser if it exists and move its data to Pantelis
      if (migrated.users && migrated.users['DefaultUser']) {
        console.log('🔄 Moving DefaultUser data to Pantelis');
        
        const defaultUserData = migrated.users['DefaultUser'];
        
        // If Pantelis doesn't exist, create him with DefaultUser's data
        if (!migrated.users['Pantelis']) {
          migrated.users['Pantelis'] = {
            ...defaultUserData,
            isMigrated: true
          };
        } else {
          // If Pantelis exists, merge the data (keep existing password if any)
          migrated.users['Pantelis'] = {
            ...defaultUserData,
            ...migrated.users['Pantelis'],
            collections: defaultUserData.collections || migrated.users['Pantelis'].collections || [],
            workbenchItems: defaultUserData.workbenchItems || migrated.users['Pantelis'].workbenchItems || [],
            isMigrated: true
          };
        }
        
        // Remove DefaultUser
        delete migrated.users['DefaultUser'];
        
        // Clear current user to force selection
        migrated.currentUser = null;
        
        console.log('✅ Moved DefaultUser data to Pantelis and removed DefaultUser');
      }

      return migrated;
    }
  }
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
