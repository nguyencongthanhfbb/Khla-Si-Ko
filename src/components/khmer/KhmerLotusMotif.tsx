/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KhmerLotusMotifProps {
  className?: string;
  color?: string;
  size?: number;
}

export const KhmerLotusMotif: React.FC<KhmerLotusMotifProps> = ({
  className = 'w-6 h-6',
  color = '#D9577E',
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer Lotus Petals */}
      <path
        d="M16 4 C13 12, 6 18, 4 24 C10 24, 13 22, 16 26 C19 22, 22 24, 28 24 C26 18, 19 12, 16 4 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Center Bud */}
      <path
        d="M16 10 C14 15, 12 19, 11 23 C14 23, 15 22, 16 25 C17 22, 18 23, 21 23 C20 19, 18 15, 16 10 Z"
        fill="#FFF4E0"
      />
      <circle cx="16" cy="20" r="1.5" fill="#D4AF37" />
    </svg>
  );
};
