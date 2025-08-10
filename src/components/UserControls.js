import React, { useState } from 'react';
import Icon from './Icon';
import { HiUser } from 'react-icons/hi';
import ChangePasswordModal from './ChangePasswordModal';
import './UserAuthModal.css';

function UserControls({ currentUserName, onSwitchUser, onChangePassword, isDarkMode }) {
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="user-action-btn"
        title="User options"
        onClick={() => setOpen(prev => !prev)}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Icon size="small"><HiUser /></Icon>
        {currentUserName}
      </button>

      {open && (
        <div className="color-popover" style={{ right: 0, bottom: 'auto', top: '44px' }} onClick={(e)=>e.stopPropagation()}>
          <div className="menu-list">
            <button className="menu-item" onClick={() => { setOpen(false); onSwitchUser(); }}>Switch User</button>
            <button className="menu-item" onClick={() => { setOpen(false); setShowChangePassword(true); }}>Change Password</button>
          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={(oldPass, newPass) => { setShowChangePassword(false); onChangePassword(oldPass, newPass); }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default UserControls;


