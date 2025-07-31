
import React from 'react';

export const XMarkIcon: React.FC<{ className?: string, strokeWidth?: number }> = ({ className, strokeWidth = 2 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);