import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { HiX, HiUser, HiLockClosed, HiPlus, HiArrowLeft, HiEye, HiEyeOff } from 'react-icons/hi';
import { getAllUsers, createUser, authenticateUser, isSecureHashingAvailable } from '../utils/auth';
import './UserAuthModal.css';

function UserAuthModal({ isOpen, onClose, onLogin, isDarkMode, allowClose = true }) {
  const [currentStep, setCurrentStep] = useState('select'); // 'select', 'password', 'create'
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Predefined user names as per requirements
  const PREDEFINED_USERS = ['Alexei', 'Harry', 'Pantelis'];

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      const existingUsers = getAllUsers();
      console.log('📋 Loading users for modal:', existingUsers);
      setUsers(existingUsers);
      setCurrentStep('select');
      setSelectedUser(null);
      setPassword('');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setLoading(false);
      setShowPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  // Get user information for the three predefined users
  const getAvailableUsers = () => {
    const existingUsernames = users.map(user => user.username);
    
    return PREDEFINED_USERS.map(username => {
      const userInfo = users.find(u => u.username === username);
      const hasPassword = !!(userInfo?.passwordHash);
      
      console.log(`User ${username}:`, {
        exists: existingUsernames.includes(username),
        hasPassword,
        passwordHash: userInfo?.passwordHash ? 'EXISTS' : 'MISSING',
        userInfo: userInfo
      });
      
      return {
        username,
        exists: existingUsernames.includes(username),
        hasPassword,
        isMigrated: userInfo?.isMigrated || false
      };
    });
  };

  const handleUserSelect = (username) => {
    const userInfo = users.find(user => user.username === username);
    
    console.log(`🎯 User selected: ${username}`);
    console.log('🎯 User info found:', userInfo);
    console.log('🎯 Has password hash:', userInfo?.passwordHash ? 'YES' : 'NO');
    console.log('🎯 Has password (boolean):', userInfo?.hasPassword);
    
    if (userInfo && userInfo.passwordHash) {
      // User exists and has password - go to password entry
      console.log('➡️ Going to password entry step');
      setSelectedUser(username);
      setCurrentStep('password');
    } else {
      // User exists but no password, or new user - go to password creation
      console.log('➡️ Going to password creation step');
      setNewUsername(username);
      setCurrentStep('create');
    }
    setError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authenticateUser(selectedUser, password);
      
      if (result.success) {
        onLogin(selectedUser);
        onClose();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setError('Authentication failed');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!newUsername.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!newPassword.trim()) {
      setError('Please enter a password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if user already exists (without password)
      const existingUser = users.find(u => u.username === newUsername);
      
      let result;
      if (existingUser && !existingUser.passwordHash) {
        // User exists but no password - update with password
        result = await createUser(newUsername, newPassword);
      } else {
        // Completely new user
        result = await createUser(newUsername, newPassword);
      }
      
      if (result.success) {
        // Refresh the users list to reflect the new password
        const updatedUsers = getAllUsers();
        setUsers(updatedUsers);
        console.log('✅ Password created, users updated:', updatedUsers);
        
        // Automatically log in the user
        onLogin(newUsername);
        onClose();
      } else {
        setError(result.error || 'Failed to set password');
      }
    } catch (error) {
      setError('Failed to set password');
      console.error('Password creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'password') {
      setCurrentStep('select');
      setSelectedUser(null);
      setPassword('');
    } else if (currentStep === 'create') {
      setCurrentStep('select');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setError('');
  };

  const handleCreateNewUser = () => {
    setCurrentStep('create');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="user-auth-overlay" onClick={onClose}>
      <div className="user-auth-modal" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="auth-modal-header">
          {currentStep !== 'select' && (
            <button className="auth-back-btn" onClick={handleBack} title="Go back">
              <Icon size="medium"><HiArrowLeft /></Icon>
            </button>
          )}
          <h2>
            {currentStep === 'select' && 'Select User'}
            {currentStep === 'password' && `Welcome back, ${selectedUser}!`}
            {currentStep === 'create' && 'Create New User'}
          </h2>
          {allowClose && (
            <button className="auth-close-btn" onClick={onClose} title="Close">
              <Icon size="medium"><HiX /></Icon>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="auth-modal-content">
          
          {/* User Selection Step */}
          {currentStep === 'select' && (
            <div className="auth-step auth-select-step">
              <p>Choose your user profile to continue:</p>
              
              <div className="users-grid">
                {getAvailableUsers().map(userInfo => {
                  const { username, exists, hasPassword, isMigrated } = userInfo;
                  
                  return (
                    <button
                      key={username}
                      className={`user-card ${hasPassword ? 'existing-user' : 'new-user'} ${isMigrated ? 'migrated-user' : ''}`}
                      onClick={() => handleUserSelect(username)}
                    >
                      <div className="user-avatar">
                        <Icon size="large"><HiUser /></Icon>
                      </div>
                      <div className="user-info">
                        <div className="username">{username}</div>
                        <div className="user-status">
                          {hasPassword ? (isMigrated ? 'Has Migrated Data' : 'Ready to Sign In') : 'Set Password'}
                        </div>
                      </div>
                      {!hasPassword && (
                        <div className="new-user-badge">
                          <Icon size="small"><HiPlus /></Icon>
                        </div>
                      )}
                      {isMigrated && (
                        <div className="migrated-badge">📚</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Security notice */}
              {!isSecureHashingAvailable() && (
                <div className="security-notice">
                  <p>⚠️ Secure password hashing is not available in this environment. Passwords will use basic encoding.</p>
                </div>
              )}
            </div>
          )}

          {/* Password Entry Step */}
          {currentStep === 'password' && (
            <div className="auth-step auth-password-step">
              <p>Enter your password to continue:</p>
              
              <form onSubmit={handlePasswordSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-icon">
                    <Icon size="medium"><HiLockClosed /></Icon>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoFocus
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <Icon size="small">{showPassword ? <HiEyeOff /> : <HiEye />}</Icon>
                    </button>
                  </div>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button 
                  type="submit" 
                  className="auth-submit-btn" 
                  disabled={loading || !password.trim()}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          )}

          {/* User Creation Step */}
          {currentStep === 'create' && (
            <div className="auth-step auth-create-step">
              <p>Create a password for <strong>{newUsername}</strong>:</p>
              
              <form onSubmit={handleCreateUser} className="auth-form">
                <div className="form-group">
                  <label htmlFor="new-password">Password</label>
                  <div className="input-with-icon">
                    <Icon size="medium"><HiLockClosed /></Icon>
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a password"
                      autoFocus
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      title={showNewPassword ? "Hide password" : "Show password"}
                    >
                      <Icon size="small">{showNewPassword ? <HiEyeOff /> : <HiEye />}</Icon>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="input-with-icon">
                    <Icon size="medium"><HiLockClosed /></Icon>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <Icon size="small">{showConfirmPassword ? <HiEyeOff /> : <HiEye />}</Icon>
                    </button>
                  </div>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button 
                  type="submit" 
                  className="auth-submit-btn" 
                  disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAuthModal;
