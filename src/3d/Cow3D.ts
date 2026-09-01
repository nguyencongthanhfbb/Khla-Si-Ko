/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CowAssetAdapter, CowExpression } from './CowAssetAdapter';

export type { CowExpression };

export class Cow3D {
  public group: THREE.Group;
  public adapter: CowAssetAdapter;

  constructor(variationIndex: number = 0) {
    this.adapter = new CowAssetAdapter(variationIndex);
    this.group = this.adapter.group;
  }

  public setExpression(expr: CowExpression) {
    this.adapter.setExpression(expr);
  }

  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.adapter.update(delta, isSelected, isVictory);
  }
}
