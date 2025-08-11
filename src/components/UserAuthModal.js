import React, { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';
import { HiX, HiUser, HiLockClosed, HiArrowLeft, HiEye, HiEyeOff } from 'react-icons/hi';
import { IoBrush } from 'react-icons/io5';
import { getAllUsers, createUser, authenticateUser } from '../utils/auth';
// import { isSecureHashingAvailable } from '../utils/auth';
import { loadAppState, saveAppState } from '../utils/storage';
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
  const [openPaletteFor, setOpenPaletteFor] = useState(null);

  // Predefined user names as per requirements
  const PREDEFINED_USERS = ['Alexei', 'Harry', 'Milan', 'Pantelis'];

  // Handle back navigation
  const handleBack = useCallback(() => {
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
  }, [currentStep]);

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      const existingUsers = getAllUsers();
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

  // Escape key handling to go back from password/create steps
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (currentStep === 'password' || currentStep === 'create') {
          e.preventDefault();
          handleBack();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, currentStep, handleBack]);

  // Return the fixed list of selectable users for the start screen
  const getAvailableUsers = () => PREDEFINED_USERS;

  // Avatar color map (keys saved in localStorage); values are gradient strings
  const AVATAR_COLORS = {
    purple: 'linear-gradient(135deg,rgb(214, 57, 239),rgb(126, 19, 226))',
    indigo: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    blue: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    teal: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
    green: 'linear-gradient(135deg, #22c55e, #16a34a)',
    amber: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    rose: 'linear-gradient(135deg, #f43f5e, #fb7185)',
    red: 'linear-gradient(135deg, #f56548,rgb(207, 15, 15))'
  };

  // Default avatar color per predefined user
  const DEFAULT_AVATAR_BY_USER = {
    Alexei: 'red',
    Harry: 'teal',
    Pantelis: 'purple',
    Milan: 'green'
  };

  const getUserAvatarGradient = (username) => {
    try {
      const app = loadAppState();
      const prefKey = app?.users?.[username]?.preferences?.avatarColor;
      const effectiveKey = prefKey || DEFAULT_AVATAR_BY_USER[username] || 'purple';
      return AVATAR_COLORS[effectiveKey] || AVATAR_COLORS.purple;
    } catch (_) {
      const fallbackKey = DEFAULT_AVATAR_BY_USER[username] || 'purple';
      return AVATAR_COLORS[fallbackKey] || AVATAR_COLORS.purple;
    }
  };

  const setUserAvatarColor = (username, colorKey) => {
    try {
      const app = loadAppState();
      if (!app.users) app.users = {};
      if (!app.users[username]) app.users[username] = {};
      if (!app.users[username].preferences) app.users[username].preferences = {};
      app.users[username].preferences.avatarColor = colorKey;
      saveAppState(app);
      setOpenPaletteFor(null);
      // no need to force re-render of gradient; component reads from storage each render
    } catch (e) {
      console.error('Failed to set avatar color', e);
    }
  };

  const handleUserSelect = (username) => {
    const userInfo = users.find(user => user.username === username);
    
    if (userInfo && userInfo.passwordHash) {
      // User exists and has password - go to password entry
      setSelectedUser(username);
      setCurrentStep('password');
    } else {
      // User exists but no password, or new user - go to password creation
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
    if (!confirmPassword.trim()) {
      setError('Please confirm your password');
      return;
    }

    // Single rule: password must contain the word "cock" (case-insensitive)
    if (!/cock/i.test(newPassword)) {
      setError('Password must contain the word "cock"');
      return;
    }

    // Keep standard confirm check for user experience
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
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

  // const handleCreateNewUser = () => {
  //   setCurrentStep('create');
  //   setError('');
  // };

  if (!isOpen) return null;

  return (
    <div className="user-auth-overlay" onClick={onClose}>
      <div className="user-auth-modal" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="auth-modal-header">
          {currentStep !== 'select' && (
            <>
              <button className="auth-back-btn" onClick={handleBack} title="Go back">
                <Icon size="medium"><HiArrowLeft /></Icon>
              </button>
              <h2>
                {currentStep === 'password' && `Welcome back, ${selectedUser}!`}
                {currentStep === 'create' && `Create a password for ${newUsername}:`}
              </h2>
            </>
          )}
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
              
              <div className="users-grid">
                {getAvailableUsers().map((username) => {
                  const gradient = getUserAvatarGradient(username);
                  return (
                      <div key={username} className="user-card" onClick={() => handleUserSelect(username)}>
                      <div className="avatar-wrapper">
                        <div className="user-avatar" style={{ background: gradient }}>
                          <Icon size="xl" variant="nav"><HiUser /></Icon>
                        </div>
                        <button
                          className="avatar-edit-btn"
                          title="Edit avatar color"
                          onClick={(e)=>{ e.stopPropagation(); setOpenPaletteFor(openPaletteFor === username ? null : username); }}
                        >
                          <Icon size="small" variant="nav"><IoBrush /></Icon>
                        </button>
                        {openPaletteFor === username && (
                          <div className="color-popover" onClick={(e)=>e.stopPropagation()}>
                            {Object.keys(AVATAR_COLORS).map((key)=> (
                              <button
                                key={key}
                                className="color-swatch"
                                style={{ background: AVATAR_COLORS[key] }}
                                title={key}
                                onClick={()=> setUserAvatarColor(username, key)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="username" style={{ fontWeight: '600', fontSize: '1.2rem' }}>{username}</div>
                    </div>
                  );
                })}
              </div>

              {/* Minimal start screen – no extra notices */}
            </div>
          )}

          {/* Password Entry Step */}
          {currentStep === 'password' && (
            <div className="auth-step auth-password-step">
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

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Set password'}
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
