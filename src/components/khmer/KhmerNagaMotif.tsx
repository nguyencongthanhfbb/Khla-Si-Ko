/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KhmerNagaMotifProps {
  className?: string;
  color?: string;
}

/**
 * Stylized carved wooden Naga crest curve for board frames and UI accents.
 * Minimalist, restrained, and authentic to Cambodian woodcarving traditions.
 */
export const KhmerNagaMotif: React.FC<KhmerNagaMotifProps> = ({
  className = 'w-8 h-8',
  color = '#8A532F',
}) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 32 C8 20, 16 12, 28 8 C34 6, 36 10, 32 14 C26 20, 22 24, 22 32 Z"
        fill={color}
      />
      <circle cx="28" cy="11" r="2" fill="#D4AF37" />
    </svg>
  );
};
