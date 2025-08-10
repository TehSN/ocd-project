#!/usr/bin/env node

// Debug script for OCD Dashboard - Clear user data
// Run with: node debug_users.js

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Simulate localStorage behavior using a JSON file
const STORAGE_FILE = path.join(__dirname, 'localStorage_debug.json');
const STORAGE_KEY = 'ocd-app-data';

// Load data from simulated localStorage
function loadData() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const fileContent = fs.readFileSync(STORAGE_FILE, 'utf8');
      const allData = JSON.parse(fileContent);
      return allData[STORAGE_KEY] || { users: {}, currentUser: null };
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Could not load existing data: ${error.message}${colors.reset}`);
  }
  return { users: {}, currentUser: null };
}

// Save data to simulated localStorage
function saveData(data) {
  try {
    const allData = {};
    allData[STORAGE_KEY] = data;
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(allData, null, 2));
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ Failed to save data: ${error.message}${colors.reset}`);
    return false;
  }
}

// Display current user data
function displayUserData(data) {
  console.log(`\n${colors.bold}${colors.cyan}📊 Current User Data:${colors.reset}`);
  console.log(`${colors.blue}Current User: ${colors.white}${data.currentUser || 'None'}${colors.reset}`);
  
  const users = data.users || {};
  const usernames = Object.keys(users);
  
  if (usernames.length === 0) {
    console.log(`${colors.yellow}📝 No users found${colors.reset}`);
    return;
  }
  
  usernames.forEach((username, index) => {
    const user = users[username];
    console.log(`\n${colors.bold}${colors.green}👤 ${username}:${colors.reset}`);
    console.log(`   Password: ${user.passwordHash ? colors.green + '✅ Set' : colors.red + '❌ Not Set'}${colors.reset}`);
    console.log(`   Collections: ${colors.white}${user.collections?.length || 0}${colors.reset}`);
    console.log(`   Workbench Items: ${colors.white}${user.workbenchItems?.length || 0}${colors.reset}`);
    console.log(`   Dark Mode: ${colors.white}${user.isDarkMode ? 'Yes' : 'No'}${colors.reset}`);
    console.log(`   Created: ${colors.white}${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}${colors.reset}`);
    console.log(`   Last Login: ${colors.white}${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}${colors.reset}`);
    if (user.isMigrated) {
      console.log(`   ${colors.magenta}📚 Has Migrated Data${colors.reset}`);
    }
  });
}

// Clear specific user data
function clearUserData(data, username) {
  if (!data.users || !data.users[username]) {
    console.log(`${colors.red}❌ User '${username}' not found${colors.reset}`);
    return false;
  }
  
  delete data.users[username];
  
  // Clear current user if it was the deleted user
  if (data.currentUser === username) {
    data.currentUser = null;
  }
  
  console.log(`${colors.green}✅ Cleared all data for user '${username}'${colors.reset}`);
  return true;
}

// Clear all user data
function clearAllData(data) {
  data.users = {};
  data.currentUser = null;
  console.log(`${colors.green}✅ Cleared all user data${colors.reset}`);
  return true;
}

// Main menu
function showMenu() {
  console.log(`\n${colors.bold}${colors.cyan}🛠️  OCD Dashboard - User Data Debug Tool${colors.reset}`);
  console.log(`${colors.yellow}Choose an option:${colors.reset}`);
  console.log(`${colors.white}1. Clear Alexei's data${colors.reset}`);
  console.log(`${colors.white}2. Clear Harry's data${colors.reset}`);
  console.log(`${colors.white}3. Clear Pantelis's data${colors.reset}`);
  console.log(`${colors.red}4. Clear ALL user data${colors.reset}`);
  console.log(`${colors.blue}5. View current data${colors.reset}`);
  console.log(`${colors.yellow}6. Import data from browser (manual)${colors.reset}`);
  console.log(`${colors.green}0. Exit${colors.reset}`);
  console.log(`${colors.cyan}────────────────────────────────${colors.reset}`);
}

// Get user choice
function getUserChoice() {
  return new Promise((resolve) => {
    rl.question(`${colors.bold}Enter your choice (0-6): ${colors.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Confirm destructive action
function confirmAction(message) {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}⚠️  ${message} (y/N): ${colors.reset}`, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Show browser data import instructions
function showImportInstructions() {
  console.log(`\n${colors.bold}${colors.cyan}📋 Manual Data Import Instructions:${colors.reset}`);
  console.log(`${colors.white}1. Open your browser developer tools (F12)${colors.reset}`);
  console.log(`${colors.white}2. Go to Console tab${colors.reset}`);
  console.log(`${colors.white}3. Type: ${colors.green}localStorage.getItem('ocd-app-data')${colors.reset}`);
  console.log(`${colors.white}4. Copy the result (JSON string)${colors.reset}`);
  console.log(`${colors.white}5. Create a file: ${colors.yellow}localStorage_debug.json${colors.reset}`);
  console.log(`${colors.white}6. Paste this content:${colors.reset}`);
  console.log(`${colors.green}   {"ocd-app-data": PASTE_THE_JSON_HERE}${colors.reset}`);
  console.log(`${colors.white}7. Run this script again${colors.reset}`);
}

// Main application loop
async function main() {
  console.log(`${colors.bold}${colors.magenta}🔗 OCD Dashboard Debug Tool${colors.reset}`);
  console.log(`${colors.cyan}For clearing user data during development${colors.reset}\n`);
  
  while (true) {
    const data = loadData();
    displayUserData(data);
    showMenu();
    
    const choice = await getUserChoice();
    
    switch (choice) {
      case '1':
        if (await confirmAction("Clear all data for user 'Alexei'?")) {
          if (clearUserData(data, 'Alexei')) {
            saveData(data);
          }
        }
        break;
        
      case '2':
        if (await confirmAction("Clear all data for user 'Harry'?")) {
          if (clearUserData(data, 'Harry')) {
            saveData(data);
          }
        }
        break;
        
      case '3':
        if (await confirmAction("Clear all data for user 'Pantelis'?")) {
          if (clearUserData(data, 'Pantelis')) {
            saveData(data);
          }
        }
        break;
        
      case '4':
        if (await confirmAction("Clear ALL user data? This cannot be undone!")) {
          if (clearAllData(data)) {
            saveData(data);
          }
        }
        break;
        
      case '5':
        // Data is already displayed above
        console.log(`${colors.green}✅ Data displayed above${colors.reset}`);
        break;
        
      case '6':
        showImportInstructions();
        break;
        
      case '0':
        console.log(`${colors.green}👋 Goodbye!${colors.reset}`);
        process.exit(0);
        break;
        
      default:
        console.log(`${colors.red}❌ Invalid choice. Please enter 0-6.${colors.reset}`);
        break;
    }
    
    // Pause before showing menu again
    if (choice !== '5' && choice !== '6') {
      await new Promise(resolve => {
        rl.question(`${colors.blue}Press Enter to continue...${colors.reset}`, resolve);
      });
    }
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}👋 Script interrupted. Goodbye!${colors.reset}`);
  rl.close();
  process.exit(0);
});

// Start the application
main().catch(error => {
  console.error(`${colors.red}❌ Unexpected error: ${error.message}${colors.reset}`);
  process.exit(1);
});
