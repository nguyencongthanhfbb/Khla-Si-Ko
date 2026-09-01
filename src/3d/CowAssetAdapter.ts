/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { assetManager } from './AssetManager';
import { CharacterAnimator, CharacterAction } from './CharacterAnimator';

export type CowExpression = 'idle' | 'selected' | 'placed' | 'surprised' | 'victory';

export class CowAssetAdapter {
  public group: THREE.Group;
  public modelContainer: THREE.Group;
  public animator: CharacterAnimator | null = null;
  public isLoaded: boolean = false;
  private currentExpression: CowExpression = 'idle';

  constructor(variationIndex: number = 0) {
    this.group = new THREE.Group();
    this.group.name = `Cow_Adapter_${variationIndex}`;

    this.modelContainer = new THREE.Group();
    this.modelContainer.name = 'Cow_Model_Container';
    this.group.add(this.modelContainer);

    // Initial scale tuning to match standard 4x4 game grid tile size
    this.group.scale.set(0.85, 0.85, 0.85);

    // Variation-based subtle orientation offset for natural herd feel
    if (variationIndex > 0) {
      this.group.rotation.y = (variationIndex % 4) * 0.08 - 0.12;
    }

    this.loadRealAsset(variationIndex);
  }

  private async loadRealAsset(variationIndex: number) {
    const primaryPath = '/assets/game/characters/cow/cow.glb';
    const fallbackPath = '/assets/vendor/quaternius/cow.glb';

    try {
      let model = await assetManager.getModel(primaryPath);
      if (!model) {
        model = await assetManager.getModel(fallbackPath);
      }

      if (model) {
        // Center model bounds & normalize
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y; // Sit flat on ground

        // Apply variation color patch if multiple cows
        if (variationIndex % 2 === 1) {
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && child.name.includes('Spot')) {
              const mesh = child as THREE.Mesh;
              if (mesh.material && !Array.isArray(mesh.material)) {
                (mesh.material as THREE.MeshStandardMaterial).color.setHex(0x5c3d2e);
              }
            }
          });
        }

        this.modelContainer.add(model);
        this.animator = new CharacterAnimator(model);
        this.isLoaded = true;
      }
    } catch (err) {
      console.warn('[CowAssetAdapter] Loading error:', err);
    }
  }

  public setExpression(expr: CowExpression) {
    this.currentExpression = expr;
    if (this.animator) {
      let action: CharacterAction = 'idle';
      if (expr === 'selected' || expr === 'placed') action = 'jump';
      else if (expr === 'surprised') action = 'surprised';
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
