import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { HiX, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import './UserAuthModal.css';

function ChangePasswordModal({ isOpen, onClose, onSubmit, isDarkMode }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowOld(false); setShowNew(false); setShowConfirm(false);
      setError('');
    }
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oldPassword.trim()) { setError('Please enter your current password'); return; }
    if (!newPassword.trim()) { setError('Please enter a new password'); return; }
    if (!/cock/i.test(newPassword)) { setError('New password must contain the word "cock"'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    onSubmit(oldPassword, newPassword);
  };

  return (
    <div className="user-auth-overlay" onClick={onClose}>
      <div className="user-auth-modal" onClick={(e)=>e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Change Password</h2>
          <button className="auth-close-btn" onClick={onClose} title="Close">
            <Icon size="medium"><HiX /></Icon>
          </button>
        </div>
        <div className="auth-modal-content">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="old-password">Current Password</label>
              <div className="input-with-icon">
                <Icon size="medium"><HiLockClosed /></Icon>
                <input id="old-password" type={showOld? 'text':'password'} value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} placeholder="Enter current password" autoFocus />
                <button type="button" className="password-toggle" onClick={()=>setShowOld(!showOld)} title={showOld? 'Hide':'Show'}>
                  <Icon size="small">{showOld? <HiEyeOff/>:<HiEye/>}</Icon>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <div className="input-with-icon">
                <Icon size="medium"><HiLockClosed /></Icon>
                <input id="new-password" type={showNew? 'text':'password'} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder={'New password (must contain "cock")'} />
                <button type="button" className="password-toggle" onClick={()=>setShowNew(!showNew)} title={showNew? 'Hide':'Show'}>
                  <Icon size="small">{showNew? <HiEyeOff/>:<HiEye/>}</Icon>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-new">Confirm New Password</label>
              <div className="input-with-icon">
                <Icon size="medium"><HiLockClosed /></Icon>
                <input id="confirm-new" type={showConfirm? 'text':'password'} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                <button type="button" className="password-toggle" onClick={()=>setShowConfirm(!showConfirm)} title={showConfirm? 'Hide':'Show'}>
                  <Icon size="small">{showConfirm? <HiEyeOff/>:<HiEye/>}</Icon>
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;


