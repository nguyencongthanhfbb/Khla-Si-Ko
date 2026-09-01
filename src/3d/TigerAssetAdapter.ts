/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { assetManager } from './AssetManager';
import { CharacterAnimator, CharacterAction } from './CharacterAnimator';
import { VisualStyle } from '../game/types';

export type TigerExpression = 'idle' | 'selected' | 'moving' | 'capturing' | 'victory';

export class TigerAssetAdapter {
  public group: THREE.Group;
  public modelContainer: THREE.Group;
  public animator: CharacterAnimator | null = null;
  public isLoaded: boolean = false;
  private currentExpression: TigerExpression = 'idle';
  private visualStyle: VisualStyle = 'CUBE_PETS';
  private originalMaterials: Map<THREE.Mesh, THREE.Material | THREE.Material[]> = new Map();

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
    const fallbackPath = '/assets/characters/tiger/tiger.glb';

    try {
      let model = await assetManager.getModel(primaryPath);
      if (!model) {
        model = await assetManager.getModel(fallbackPath);
      }

      if (model) {
        // Center model bounds on entire model root & sit flat on ground
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y; // Sit flat on ground

        // Cache materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            this.originalMaterials.set(mesh, mesh.material);
          }
        });

        this.modelContainer.add(model);
        this.animator = new CharacterAnimator(model);
        this.isLoaded = true;
        this.applyStyleMaterials();
      }
    } catch (err) {
      console.warn('[TigerAssetAdapter] Loading error:', err);
    }
  }

  public setVisualStyle(style: VisualStyle) {
    this.visualStyle = style;
    this.applyStyleMaterials();
  }

  private applyStyleMaterials() {
    if (!this.isLoaded) return;

    this.modelContainer.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (this.visualStyle === 'CUBE_PETS') {
            // Chunky, vibrant matte toy look
            mat.roughness = 0.45;
            mat.metalness = 0.04;
          } else if (this.visualStyle === 'SOFT_CHIBI') {
            // Soft velvety pastel finish
            mat.roughness = 0.78;
            mat.metalness = 0.01;
          } else if (this.visualStyle === 'KHMER_WOODEN') {
            // Handcrafted polished lacquer wood finish
            mat.roughness = 0.38;
            mat.metalness = 0.08;
          }
          mat.needsUpdate = true;
        }
      }
    });
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
