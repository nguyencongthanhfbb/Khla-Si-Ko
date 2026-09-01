/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KbachPatternProps {
  className?: string;
  variant?: 'border' | 'strip' | 'flourish' | 'leaf';
  color?: string;
}

/**
 * Traditional Khmer Kbach decorative motif component.
 * Features rhythmic, stylized carved leaf curves and organic symmetry
 * inspired by authentic Cambodian woodcraft.
 */
export const KbachPattern: React.FC<KbachPatternProps> = ({
  className = 'w-full h-4',
  variant = 'strip',
  color = '#8A532F',
}) => {
  if (variant === 'flourish') {
    return (
      <svg
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M60 5 C52 18, 38 22, 10 24 C28 26, 38 32, 42 38 C44 28, 52 24, 60 22 C68 24, 76 28, 78 38 C82 32, 92 26, 110 24 C82 22, 68 18, 60 5 Z"
          fill={color}
          opacity="0.9"
        />
        <circle cx="60" cy="22" r="3" fill="#D4AF37" />
      </svg>
    );
  }

  if (variant === 'leaf') {
    return (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M20 4 C14 14, 8 20, 4 28 C12 28, 16 32, 20 38 C24 32, 28 28, 36 28 C32 20, 26 14, 20 4 Z"
          fill={color}
        />
        <path d="M20 12 L20 34" stroke="#FFF4E0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }

  // Repeating horizontal Kbach carved relief strip
  return (
    <svg
      viewBox="0 0 240 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 12 Q15 0, 30 12 Q45 24, 60 12 Q75 0, 90 12 Q105 24, 120 12 Q135 0, 150 12 Q165 24, 180 12 Q195 0, 210 12 Q225 24, 240 12"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
      />
      {/* Repeated Kbach petal buds */}
      {[15, 45, 75, 105, 135, 165, 195, 225].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="12" r="2.8" fill="#D4AF37" />
          <path
            d={`M${cx - 4} 12 C${cx - 2} 7, ${cx + 2} 7, ${cx + 4} 12 C${cx + 2} 17, ${cx - 2} 17, ${cx - 4} 12 Z`}
            fill={color}
            opacity="0.8"
          />
        </g>
      ))}
    </svg>
  );
};
