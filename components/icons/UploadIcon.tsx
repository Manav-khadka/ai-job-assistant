import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3.75 18A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18v-2.25a2.25 2.25 0 00-2.25-2.25H15M3.75 18H15m-11.25-6a2.25 2.25 0 012.25-2.25h2.25c1.121-1.642 2.97-2.75 5.026-2.75 2.056 0 3.905 1.108 5.026 2.75H20.25a2.25 2.25 0 012.25 2.25v2.25" />
  </svg>
);