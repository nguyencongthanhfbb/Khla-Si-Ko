/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { assetManager } from './AssetManager';
import { CharacterAnimator, CharacterAction } from './CharacterAnimator';

export type TigerExpression = 'idle' | 'selected' | 'moving' | 'capturing' | 'victory';

export class TigerAssetAdapter {
  public group: THREE.Group;
  public modelContainer: THREE.Group;
  public animator: CharacterAnimator | null = null;
  public isLoaded: boolean = false;
  private currentExpression: TigerExpression = 'idle';

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Tiger_Adapter';

    this.modelContainer = new THREE.Group();
    this.modelContainer.name = 'Tiger_Model_Container';
    this.group.add(this.modelContainer);

    // Initial scale tuning for Tiger hero piece
    this.group.scale.set(0.9, 0.9, 0.9);

    this.loadRealAsset();
  }

  private async loadRealAsset() {
    const primaryPath = '/assets/game/characters/tiger/tiger.glb';

    try {
      const model = await assetManager.getModel(primaryPath);

      if (model) {
        // Center model bounds & normalize
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y; // Sit flat on ground

        this.modelContainer.add(model);
        this.animator = new CharacterAnimator(model);
        this.isLoaded = true;
      }
    } catch (err) {
      console.warn('[TigerAssetAdapter] Loading error:', err);
    }
  }

  public setExpression(expr: TigerExpression) {
    this.currentExpression = expr;
    if (this.animator) {
      let action: CharacterAction = 'idle';
      if (expr === 'selected') action = 'jump';
      else if (expr === 'moving') action = 'walk';
      else if (expr === 'capturing') action = 'capture';
      else if (expr === 'victory') action = 'victory';
      this.animator.setAction(action);
    }
  }

  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    if (this.animator) {
      this.animator.update(
        delta,
        isSelected || this.currentExpression === 'selected',
        isVictory || this.currentExpression === 'victory'
      );
    }
  }
}
