/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KbachPattern } from './KbachPattern';

interface KhmerBoardOrnamentProps {
  className?: string;
  title?: string;
}

export const KhmerBoardOrnament: React.FC<KhmerBoardOrnamentProps> = ({
  className = '',
  title,
}) => {
  return (
    <div className={`flex items-center gap-3 justify-center ${className}`}>
      <div className="w-12 h-2.5 opacity-70">
        <KbachPattern variant="strip" color="#8A532F" />
      </div>
      {title && (
        <span className="font-bold text-xs uppercase tracking-widest text-[#663C22]">
          {title}
        </span>
      )}
      <div className="w-12 h-2.5 opacity-70 rotate-180">
        <KbachPattern variant="strip" color="#8A532F" />
      </div>
    </div>
  );
};
