/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KhmerClayJarProps {
  className?: string;
}

export const KhmerClayJar: React.FC<KhmerClayJarProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Wooden Base */}
      <rect x="10" y="32" width="20" height="4" fill="#422415" rx="1.5" />
      {/* Terracotta Earthenware Belly */}
      <ellipse cx="20" cy="22" rx="14" ry="11" fill="#B8502D" />
      {/* Terracotta Rim and Lid */}
      <rect x="14" y="9" width="12" height="4" fill="#8C361A" rx="1" />
      <ellipse cx="20" cy="8" rx="7" ry="2" fill="#D46F48" />
    </svg>
  );
};
