/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export type CharacterAction =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'victory'
  | 'capture'
  | 'surprised';

export class CharacterAnimator {
  public root: THREE.Group;
  public mixer: THREE.AnimationMixer | null = null;
  public actions: Map<string, THREE.AnimationAction> = new Map();
  public currentAction: CharacterAction = 'idle';

  private animTime: number = Math.random() * 10;

  constructor(root: THREE.Group, gltfAnimations?: THREE.AnimationClip[]) {
    this.root = root;

    // If GLTF has AnimationClips, initialize AnimationMixer
    if (gltfAnimations && gltfAnimations.length > 0) {
      this.mixer = new THREE.AnimationMixer(root);
      gltfAnimations.forEach((clip) => {
        const action = this.mixer!.clipAction(clip);
        this.actions.set(clip.name.toLowerCase(), action);
      });
    }
  }

  public setAction(action: CharacterAction) {
    if (this.currentAction === action) return;
    this.currentAction = action;

    // If mixer has clip matching action, crossfade
    if (this.mixer && this.actions.has(action)) {
      this.actions.forEach((act) => act.fadeOut(0.2));
      const targetAct = this.actions.get(action)!;
      targetAct.reset().fadeIn(0.2).play();
    }
  }

  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.animTime += delta * 3.0;

    // Update AnimationMixer if clips exist
    if (this.mixer) {
      this.mixer.update(delta);
    }

    const state = isVictory ? 'victory' : isSelected ? 'jump' : this.currentAction;

    switch (state) {
      case 'victory': {
        // High energetic bouncing hop on root
        const bounce = Math.abs(Math.sin(this.animTime * 3.5)) * 0.28;
        this.root.position.y = bounce;
        this.root.rotation.y = Math.sin(this.animTime * 3.0) * 0.2;
        this.root.rotation.z = Math.sin(this.animTime * 3.5) * 0.08;
        this.root.rotation.x = 0;
        this.root.scale.set(1, 1, 1);
        break;
      }

      case 'jump': {
        // Active selected pulse / hover on root
        const floatY = Math.sin(this.animTime * 2.8) * 0.08 + 0.06;
        this.root.position.y = floatY;
        this.root.rotation.x = Math.sin(this.animTime * 2.0) * 0.08;
        this.root.rotation.y = 0;
        this.root.rotation.z = 0;
        this.root.scale.set(1, 1, 1);
        break;
      }

      case 'capture': {
        // Pounce lunge on root
        const lunge = Math.sin(this.animTime * 4.0);
        this.root.position.y = Math.max(0, lunge * 0.22);
        this.root.rotation.x = lunge * 0.18;
        this.root.rotation.y = 0;
        this.root.rotation.z = 0;
        this.root.scale.set(1, 1, 1);
        break;
      }

      case 'surprised': {
        // Startled rear-up on root
        this.root.position.y = Math.abs(Math.sin(this.animTime * 4.0)) * 0.15;
        this.root.rotation.x = -0.2;
        this.root.rotation.y = 0;
        this.root.rotation.z = 0;
        this.root.scale.set(1, 1, 1);
        break;
      }

      case 'walk':
      case 'run': {
        // Running hop cycle on root
        const speed = state === 'run' ? 5.0 : 3.0;
        this.root.position.y = Math.abs(Math.sin(this.animTime * speed)) * 0.08;
        this.root.rotation.z = Math.sin(this.animTime * speed) * 0.06;
        this.root.rotation.x = 0;
        this.root.rotation.y = 0;
        this.root.scale.set(1, 1, 1);
        break;
      }

      case 'idle':
      default: {
        // Calming rhythmic whole-body breath on root
        const breath = Math.sin(this.animTime * 1.2);
        this.root.scale.set(1 + breath * 0.015, 1 - breath * 0.015, 1 + breath * 0.015);
        this.root.position.y = 0;
        this.root.rotation.set(0, 0, 0);
        break;
      }
    }
  }
}
