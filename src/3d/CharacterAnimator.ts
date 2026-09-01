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

  // Subpart references for procedural fallback/enhancement on the real model
  public headNode: THREE.Object3D | null = null;
  public tailNode: THREE.Object3D | null = null;
  public leftEarNode: THREE.Object3D | null = null;
  public rightEarNode: THREE.Object3D | null = null;
  public leftEyeNode: THREE.Object3D | null = null;
  public rightEyeNode: THREE.Object3D | null = null;
  public legNodes: THREE.Object3D[] = [];

  private animTime: number = Math.random() * 10;
  private blinkTimer: number = Math.random() * 3 + 2;
  private isBlinking: boolean = false;

  constructor(root: THREE.Group, gltfAnimations?: THREE.AnimationClip[]) {
    this.root = root;

    // Scan the imported model hierarchy for named parts
    this.findSubparts(root);

    // If GLTF has AnimationClips, initialize AnimationMixer
    if (gltfAnimations && gltfAnimations.length > 0) {
      this.mixer = new THREE.AnimationMixer(root);
      gltfAnimations.forEach((clip) => {
        const action = this.mixer!.clipAction(clip);
        this.actions.set(clip.name.toLowerCase(), action);
      });
    }
  }

  private findSubparts(obj: THREE.Object3D) {
    obj.traverse((child) => {
      const name = child.name.toLowerCase();
      if (name.includes('head')) this.headNode = child;
      else if (name.includes('tail')) this.tailNode = child;
      else if (name.includes('ear') && (name.includes('l') || name.includes('0') || name.includes('left'))) {
        this.leftEarNode = child;
      } else if (name.includes('ear') && (name.includes('r') || name.includes('1') || name.includes('right'))) {
        this.rightEarNode = child;
      } else if (name.includes('eye') && (name.includes('l') || name.includes('0') || name.includes('left'))) {
        this.leftEyeNode = child;
      } else if (name.includes('eye') && (name.includes('r') || name.includes('1') || name.includes('right'))) {
        this.rightEyeNode = child;
      } else if (name.includes('leg') || name.includes('paw') || name.includes('hoof')) {
        this.legNodes.push(child);
      }
    });
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

    // Blinking logic for specular/scale on eyes
    this.blinkTimer -= delta;
    if (this.blinkTimer <= 0) {
      this.isBlinking = true;
      if (this.blinkTimer <= -0.15) {
        this.isBlinking = false;
        this.blinkTimer = Math.random() * 3.5 + 2.0;
        if (this.leftEyeNode) this.leftEyeNode.scale.set(1, 1, 1);
        if (this.rightEyeNode) this.rightEyeNode.scale.set(1, 1, 1);
      } else {
        const eyeScale = 0.15 + 0.85 * Math.abs(Math.sin(((-this.blinkTimer) / 0.15) * Math.PI));
        if (this.leftEyeNode) this.leftEyeNode.scale.set(1, eyeScale, 1);
        if (this.rightEyeNode) this.rightEyeNode.scale.set(1, eyeScale, 1);
      }
    }

    const state = isVictory ? 'victory' : isSelected ? 'jump' : this.currentAction;

    switch (state) {
      case 'victory': {
        // High energetic bouncing hop with ear and tail waggle
        const bounce = Math.abs(Math.sin(this.animTime * 3.5)) * 0.28;
        this.root.position.y = bounce;
        if (this.headNode) this.headNode.rotation.z = Math.sin(this.animTime * 3.2) * 0.22;
        if (this.leftEarNode) this.leftEarNode.rotation.z = Math.sin(this.animTime * 5.0) * 0.35;
        if (this.rightEarNode) this.rightEarNode.rotation.z = -Math.sin(this.animTime * 5.0) * 0.35;
        if (this.tailNode) this.tailNode.rotation.z = Math.sin(this.animTime * 6.0) * 0.5;
        break;
      }

      case 'jump': {
        // Active selected pulse / hover
        const floatY = Math.sin(this.animTime * 2.8) * 0.08 + 0.06;
        this.root.position.y = floatY;
        if (this.headNode) this.headNode.rotation.x = Math.sin(this.animTime * 2.0) * 0.12;
        if (this.tailNode) this.tailNode.rotation.z = Math.sin(this.animTime * 3.5) * 0.25;
        break;
      }

      case 'capture': {
        // Pounce lunge
        const lunge = Math.sin(this.animTime * 4.0);
        this.root.position.y = Math.max(0, lunge * 0.22);
        this.root.rotation.x = lunge * 0.18;
        if (this.headNode) this.headNode.rotation.x = 0.25;
        break;
      }

      case 'surprised': {
        // Startled rear-up
        this.root.position.y = Math.abs(Math.sin(this.animTime * 4.0)) * 0.15;
        this.root.rotation.x = -0.2;
        if (this.leftEarNode) this.leftEarNode.rotation.z = 0.4;
        if (this.rightEarNode) this.rightEarNode.rotation.z = -0.4;
        break;
      }

      case 'walk':
      case 'run': {
        // Running leg cycle
        const speed = state === 'run' ? 5.0 : 3.0;
        this.root.position.y = Math.abs(Math.sin(this.animTime * speed)) * 0.08;
        this.legNodes.forEach((leg, idx) => {
          const sign = idx % 2 === 0 ? 1 : -1;
          leg.rotation.x = Math.sin(this.animTime * speed) * 0.35 * sign;
        });
        break;
      }

      case 'idle':
      default: {
        // Calming rhythmic breath
        const breath = Math.sin(this.animTime * 0.9);
        this.root.scale.set(1 + breath * 0.012, 1 - breath * 0.015, 1 + breath * 0.012);
        this.root.position.y = 0;
        if (this.headNode) this.headNode.position.y = 1.05 + breath * 0.01;
        if (this.tailNode) this.tailNode.rotation.z = Math.sin(this.animTime * 1.2) * 0.12;
        break;
      }
    }
  }
}
