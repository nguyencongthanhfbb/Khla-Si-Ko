/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KhmerFenceProps {
  className?: string;
}

export const KhmerFence: React.FC<KhmerFenceProps> = ({ className = 'w-16 h-8' }) => {
  return (
    <svg
      viewBox="0 0 64 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Wooden / Bamboo Vertical Posts */}
      <line x1="8" y1="4" x2="8" y2="30" stroke="#422415" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="4" x2="32" y2="30" stroke="#422415" strokeWidth="4" strokeLinecap="round" />
      <line x1="56" y1="4" x2="56" y2="30" stroke="#422415" strokeWidth="4" strokeLinecap="round" />
      {/* Horizontal Rails */}
      <line x1="2" y1="12" x2="62" y2="12" stroke="#B58252" strokeWidth="3" strokeLinecap="round" />
      <line x1="2" y1="22" x2="62" y2="22" stroke="#B58252" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};
