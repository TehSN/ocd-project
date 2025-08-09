// Debug utilities for OCD Dashboard
// Helper functions to inspect and manage localStorage data

import { loadAppState, clearAllData, getStorageInfo } from './storage';

/**
 * Print current localStorage data to console
 */
export const debugStorage = () => {
  console.group('🔍 localStorage Debug Info');
  
  try {
    const appState = loadAppState();
    const storageInfo = getStorageInfo();
    
    console.log('📊 Storage Info:', storageInfo);
    console.log('🗂️ App State:', appState);
    
    if (appState.tempCollections) {
      console.log('📚 Collections:', appState.tempCollections.length);
    }
    
    if (appState.tempWorkbench) {
      console.log('🔧 Workbench Items:', appState.tempWorkbench.items?.length || 0);
      console.log('📄 Current View:', appState.tempWorkbench.currentView);
    }
    
    if (appState.globalSettings) {
      console.log('⚙️ Global Settings:', appState.globalSettings);
    }
    
  } catch (error) {
    console.error('❌ Error reading storage:', error);
  }
  
  console.groupEnd();
};

/**
 * Clear all app data and reload
 */
export const debugClearData = () => {
  if (window.confirm('⚠️ This will clear all saved data. Are you sure?')) {
    clearAllData();
    window.location.reload();
  }
};

/**
 * Export current data as JSON
 */
export const debugExportData = () => {
  try {
    const appState = loadAppState();
    const dataStr = JSON.stringify(appState, null, 2);
    
    // Create downloadable file
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocd-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    console.log('📁 Data exported successfully');
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  }
};

/**
 * Add debug functions to window for easy access in browser console
 */
export const enableDebugMode = () => {
  if (typeof window !== 'undefined') {
    window.ocdDebug = {
      storage: debugStorage,
      clear: debugClearData,
      export: debugExportData,
      help: () => {
        console.log(`
🔧 OCD Dashboard Debug Commands:

window.ocdDebug.storage()  - Show current localStorage data
window.ocdDebug.clear()    - Clear all data (with confirmation)
window.ocdDebug.export()   - Export data as JSON file
window.ocdDebug.help()     - Show this help

Example usage:
> ocdDebug.storage()       // Check what's stored
> ocdDebug.clear()         // Reset everything
        `);
      }
    };
    
    console.log('🐛 Debug mode enabled! Type "ocdDebug.help()" for commands');
  }
};

// Auto-enable debug mode in development
if (process.env.NODE_ENV === 'development') {
  enableDebugMode();
}
