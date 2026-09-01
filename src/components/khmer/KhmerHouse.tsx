/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KhmerHouseProps {
  className?: string;
}

export const KhmerHouse: React.FC<KhmerHouseProps> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Traditional Khmer Sloped Gable Roof */}
      <path d="M6 30 L32 8 L58 30 L48 30 L32 16 L16 30 Z" fill="#B8502D" />
      <path d="M32 6 L32 12" stroke="#8C361A" strokeWidth="3" strokeLinecap="round" />
      {/* Wooden House Body */}
      <rect x="14" y="28" width="36" height="18" fill="#663C22" rx="2" />
      {/* Window and Door */}
      <rect x="20" y="32" width="8" height="8" fill="#B58252" rx="1" />
      <rect x="36" y="32" width="10" height="14" fill="#422415" rx="1" />
      {/* Raised Wooden Stilts */}
      <line x1="16" y1="46" x2="16" y2="60" stroke="#422415" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="28" y1="46" x2="28" y2="60" stroke="#422415" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="40" y1="46" x2="40" y2="60" stroke="#422415" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="46" x2="50" y2="60" stroke="#422415" strokeWidth="3.5" strokeLinecap="round" />
      {/* Wooden Porch Ladder Steps */}
      <line x1="44" y1="46" x2="54" y2="60" stroke="#B58252" strokeWidth="2.5" />
    </svg>
  );
};
