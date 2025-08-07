import React from 'react';
import './Icon.css';

/**
 * Consistent Icon component for all app icons
 * Ensures uniform sizing, positioning, and styling
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - The icon component (e.g., <HiHome />)
 * @param {string} props.size - Icon size: 'tiny', 'small', 'medium', 'large', 'xl'
 * @param {string} props.variant - Icon variant: 'close', 'nav', 'action', 'status', 'modal-close', 'empty-state', 'bold', 'extra-bold'
 * @param {string} props.className - Additional CSS classes
 */
function Icon({ 
  children, 
  size = 'small', 
  variant = '', 
  className = '', 
  ...props 
}) {
  const sizeClass = `icon-${size}`;
  const variantClass = variant ? `icon-${variant}` : '';
  const classes = `app-icon ${sizeClass} ${variantClass} ${className}`.trim();
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export default Icon;