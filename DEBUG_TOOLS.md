# 🛠️ OCD Dashboard Debug Tools

Tools for debugging and managing user data during development.

## 🌐 Browser-Based Debug Tool (Recommended)

**Direct access to your app's localStorage data**

### How to Use:
1. Open your dashboard app: `http://localhost:3000`
2. Open the debug tool: `http://localhost:3000/debug.html`
3. Use the interactive interface to:
   - View current user data
   - Clear individual users (Alexei, Harry, Pantelis)
   - Clear all user data
   - Export data for backup
   - View raw JSON data

### Features:
- ✅ **Real-time data display** - See passwords, collections, workbench items
- ✅ **Individual user clearing** - Remove data for specific users
- ✅ **Bulk operations** - Clear all users at once
- ✅ **Data export** - Download current data as JSON
- ✅ **Safe confirmations** - Multiple warnings for destructive actions
- ✅ **Action logging** - Track what you've done

## 🖥️ Terminal Debug Script

**Node.js script for offline debugging**

### How to Use:
```bash
cd ocd-project
node debug_users.js
```

### Menu Options:
```
1. Clear Alexei's data
2. Clear Harry's data  
3. Clear Pantelis's data
4. Clear ALL user data
5. View current data
6. Import data from browser (manual)
0. Exit
```

### Features:
- ✅ **Colorized output** - Easy to read terminal interface
- ✅ **Safe confirmations** - Prevents accidental data loss
- ✅ **Data import** - Instructions to import browser data
- ✅ **Full user info** - Shows passwords, collections, timestamps

## 🎯 Common Debug Scenarios

### Testing Password Persistence:
1. Open debug tool: `http://localhost:3000/debug.html`
2. Clear a specific user (e.g., Pantelis)
3. Go back to app: `http://localhost:3000`
4. Set password for that user
5. Refresh debug tool to verify password is saved
6. Log out and back in to test persistence

### Testing Data Migration:
1. Clear all users
2. Add some test collections in the old format
3. Restart app to trigger migration
4. Check debug tool to see migrated data

### Debugging User State Issues:
1. Use "Show Raw JSON" to see exact localStorage structure
2. Export data before making changes
3. Compare before/after states

## 🚨 Safety Features

### Browser Tool:
- **Double confirmations** for destructive actions
- **Clear warnings** about what will be deleted
- **Action logging** to track changes
- **Export functionality** for backups

### Terminal Tool:
- **Colored warnings** for dangerous operations
- **Confirmation prompts** for all deletions
- **Graceful error handling**

## 🔧 Technical Details

### Data Structure:
```json
{
  "appVersion": "1.2.0",
  "users": {
    "Alexei": {
      "passwordHash": "...",
      "collections": [...],
      "workbenchItems": [...],
      "isDarkMode": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-15T10:30:00Z"
    }
  },
  "currentUser": "Alexei"
}
```

### Storage Location:
- **Browser**: `localStorage['ocd-app-data']`
- **Terminal**: `localStorage_debug.json` file

## 🎯 Best Practices

1. **Always use browser tool** for live debugging
2. **Export data** before major changes
3. **Test password persistence** after auth changes
4. **Clear specific users** rather than all data when possible
5. **Check action log** to understand what happened

## ⚠️ Important Notes

- **Browser tool directly modifies your app's data** - changes are immediate
- **Terminal tool uses a separate file** - manual import/export needed
- **Clearing data is permanent** - no undo functionality
- **Always confirm** you're on the right user before clearing

---

**Happy debugging! 🎉**
