/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CowAssetAdapter, CowExpression } from './CowAssetAdapter';
import { VisualStyle } from '../game/types';

export type { CowExpression };

export class Cow3D {
  public group: THREE.Group;
  public adapter: CowAssetAdapter;

  constructor(variationIndex: number = 0) {
    this.adapter = new CowAssetAdapter(variationIndex);
    this.group = this.adapter.group;
  }

  public setVisualStyle(style: VisualStyle) {
    this.adapter.setVisualStyle(style);
  }

  public setExpression(expr: CowExpression) {
    this.adapter.setExpression(expr);
  }

  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.adapter.update(delta, isSelected, isVictory);
  }
}
