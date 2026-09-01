/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KhmerCornerMotifProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
}

export const KhmerCornerMotif: React.FC<KhmerCornerMotifProps> = ({
  className = 'w-8 h-8',
  position = 'top-left',
  color = '#8A532F',
}) => {
  const rotationClass =
    position === 'top-right'
      ? 'rotate-90'
      : position === 'bottom-right'
      ? 'rotate-180'
      : position === 'bottom-left'
      ? '-rotate-90'
      : '';

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${rotationClass}`}
      aria-hidden="true"
    >
      {/* Hand-carved L-bracket border ornament */}
      <path
        d="M6 42 L6 14 C6 9.578, 9.578 6, 14 6 L42 6"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Stylized Kbach corner scroll */}
      <path
        d="M10 32 C10 18, 18 10, 32 10 C24 16, 16 24, 10 32 Z"
        fill={color}
        opacity="0.85"
      />
      {/* Subtle Gold Accenting Node */}
      <circle cx="16" cy="16" r="3.5" fill="#D4AF37" />
    </svg>
  );
};
