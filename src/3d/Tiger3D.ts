/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { TigerAssetAdapter, TigerExpression } from './TigerAssetAdapter';
import { VisualStyle } from '../game/types';

export type { TigerExpression };

export class Tiger3D {
  public group: THREE.Group;
  public adapter: TigerAssetAdapter;

  constructor() {
    this.adapter = new TigerAssetAdapter();
    this.group = this.adapter.group;
  }

  public setVisualStyle(style: VisualStyle) {
    this.adapter.setVisualStyle(style);
  }

  public setExpression(expr: TigerExpression) {
    this.adapter.setExpression(expr);
  }

  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.adapter.update(delta, isSelected, isVictory);
  }
}
