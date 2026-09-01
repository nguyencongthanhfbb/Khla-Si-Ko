/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KhmerLotusMotif } from './KhmerLotusMotif';
import { KhmerClayJar } from './KhmerClayJar';

interface KhmerGardenPropsProps {
  className?: string;
}

export const KhmerGardenProps: React.FC<KhmerGardenPropsProps> = ({ className = 'flex items-center gap-2' }) => {
  return (
    <div className={className}>
      <KhmerClayJar className="w-8 h-8 opacity-80" />
      <KhmerLotusMotif className="w-6 h-6" color="#D9577E" />
    </div>
  );
};
