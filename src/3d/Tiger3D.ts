/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { assetManager } from './AssetManager';

export type TigerExpression = 'idle' | 'selected' | 'moving' | 'capturing' | 'victory';

export class Tiger3D {
  public group: THREE.Group;
  public bodyGroup: THREE.Group;
  public headGroup: THREE.Group;
  public tailGroup: THREE.Group;
  public leftEar: THREE.Group;
  public rightEar: THREE.Group;
  public leftEye: THREE.Mesh;
  public rightEye: THREE.Mesh;
  public leftEyelid: THREE.Mesh;
  public rightEyelid: THREE.Mesh;

  private animTime: number = Math.random() * 10;
  private blinkTimer: number = Math.random() * 3 + 2;
  private isBlinking: boolean = false;
  private currentExpression: TigerExpression = 'idle';
  private customModelLoaded: boolean = false;

  constructor() {
    this.group = new THREE.Group();

    this.bodyGroup = new THREE.Group();
    this.group.add(this.bodyGroup);

    // Warm vibrant golden tiger orange & warm cream
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf38224,
      roughness: 0.45,
      metalness: 0.08,
    });
    const bellyMat = new THREE.MeshStandardMaterial({
      color: 0xfffaed,
      roughness: 0.5,
      metalness: 0.05,
    });
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0x332014,
      roughness: 0.55,
    });
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xff6b81,
      roughness: 0.35,
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.1,
    });
    const eyeSparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xffa8b6, roughness: 0.5 });
    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.6,
    });

    // 1. Chibi Chubby Body
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.38, 0.48, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.34;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.bodyGroup.add(bodyMesh);

    // Soft Cream Belly
    const bellyGeo = new THREE.SphereGeometry(0.24, 12, 12);
    bellyGeo.scale(0.85, 1.1, 0.45);
    const bellyMesh = new THREE.Mesh(bellyGeo, bellyMat);
    bellyMesh.position.set(0, 0.32, 0.18);
    this.bodyGroup.add(bellyMesh);

    // 2. Chibi Oversized Rounded Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.72, 0.08);

    const headGeo = new THREE.SphereGeometry(0.38, 18, 18);
    headGeo.scale(1.15, 0.96, 1.08);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Cheeks
    [-0.14, 0.14].forEach((x) => {
      const cheekGeo = new THREE.SphereGeometry(0.16, 12, 12);
      cheekGeo.scale(1.0, 0.9, 0.65);
      const cheekMesh = new THREE.Mesh(cheekGeo, bellyMat);
      cheekMesh.position.set(x, -0.06, 0.24);
      this.headGroup.add(cheekMesh);
    });

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.045, 0.055, 3);
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.rotation.z = Math.PI;
    noseMesh.position.set(0, -0.02, 0.37);
    this.headGroup.add(noseMesh);

    // Authentic Khmer Lotus Crest Forehead Ornament
    const crestBase = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 4), goldAccentMat);
    crestBase.position.set(0, 0.22, 0.32);
    crestBase.rotation.x = 0.35;
    const crestL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.08, 0.025), goldAccentMat);
    crestL.position.set(-0.05, 0.19, 0.31);
    crestL.rotation.z = 0.4;
    const crestR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.08, 0.025), goldAccentMat);
    crestR.position.set(0.05, 0.19, 0.31);
    crestR.rotation.z = -0.4;
    this.headGroup.add(crestBase, crestL, crestR);

    // Expressive Eyes
    const eyeGeo = new THREE.SphereGeometry(0.062, 12, 12);
    this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.leftEye.position.set(-0.16, 0.08, 0.32);
    this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.rightEye.position.set(0.16, 0.08, 0.32);
    this.headGroup.add(this.leftEye, this.rightEye);

    // Sparkles
    [this.leftEye, this.rightEye].forEach((eye) => {
      const sp1 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), eyeSparkleMat);
      sp1.position.set(0.016, 0.016, 0.048);
      const sp2 = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), eyeSparkleMat);
      sp2.position.set(-0.016, -0.016, 0.048);
      eye.add(sp1, sp2);
    });

    // Eyelids
    const eyelidGeo = new THREE.SphereGeometry(0.066, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    this.leftEyelid = new THREE.Mesh(eyelidGeo, bodyMat);
    this.leftEyelid.position.set(-0.16, 0.08, 0.32);
    this.leftEyelid.rotation.x = -Math.PI / 2;
    this.leftEyelid.scale.set(1, 0, 1);
    this.rightEyelid = new THREE.Mesh(eyelidGeo, bodyMat);
    this.rightEyelid.position.set(0.16, 0.08, 0.32);
    this.rightEyelid.rotation.x = -Math.PI / 2;
    this.rightEyelid.scale.set(1, 0, 1);
    this.headGroup.add(this.leftEyelid, this.rightEyelid);

    // Soft Rounded Ears
    this.leftEar = this.createEar(-1, bodyMat, innerEarMat);
    this.rightEar = this.createEar(1, bodyMat, innerEarMat);
    this.headGroup.add(this.leftEar, this.rightEar);

    this.bodyGroup.add(this.headGroup);

    // Paws
    [[-0.18, 0.09, 0.18], [0.18, 0.09, 0.18], [-0.18, 0.09, -0.14], [0.18, 0.09, -0.14]].forEach(([x, y, z]) => {
      const paw = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 10), bellyMat);
      paw.scale.set(1.0, 0.7, 1.15);
      paw.position.set(x, y, z);
      paw.castShadow = true;
      this.bodyGroup.add(paw);
    });

    // Tail
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.28, -0.24);
    for (let i = 0; i < 4; i++) {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.12, 8), i % 2 === 0 ? bodyMat : stripeMat);
      seg.position.set(0, i * 0.08, -i * 0.06);
      seg.rotation.x = -0.5 - i * 0.18;
      this.tailGroup.add(seg);
    }
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), bellyMat);
    tip.position.set(0, 0.32, -0.26);
    this.tailGroup.add(tip);
    this.bodyGroup.add(this.tailGroup);

    this.group.scale.set(0.92, 0.92, 0.92);

    this.loadGLB();
  }

  private async loadGLB() {
    try {
      const model = await assetManager.getModel('/assets/characters/tiger/tiger.glb');
      if (model && !this.customModelLoaded) {
        while (this.bodyGroup.children.length > 0) {
          this.bodyGroup.remove(this.bodyGroup.children[0]);
        }
        this.bodyGroup.add(model);
        this.customModelLoaded = true;
      }
    } catch {
      // Keep procedural fallback
    }
  }

  private createEar(side: number, bodyMat: any, innerMat: any): THREE.Group {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.28, 0.32, 0.02);
    earGroup.rotation.z = side * -0.3;

    const earOuter = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), bodyMat);
    earOuter.scale.set(1.0, 1.2, 0.5);
    const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), innerMat);
    earInner.scale.set(0.9, 1.1, 0.4);
    earInner.position.set(0, 0, 0.03);
    earGroup.add(earOuter, earInner);
    return earGroup;
  }

  public setExpression(expr: TigerExpression) {
    this.currentExpression = expr;
  }

  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.animTime += delta * 2.5;

    // Blinking
    this.blinkTimer -= delta;
    if (this.blinkTimer <= 0) {
      this.isBlinking = true;
      if (this.blinkTimer <= -0.16) {
        this.isBlinking = false;
        this.blinkTimer = Math.random() * 3.5 + 2.0;
        if (this.leftEyelid) this.leftEyelid.scale.set(1, 0, 1);
        if (this.rightEyelid) this.rightEyelid.scale.set(1, 0, 1);
      } else {
        const progress = Math.sin(((-this.blinkTimer) / 0.16) * Math.PI);
        if (this.leftEyelid) this.leftEyelid.scale.set(1, progress, 1);
        if (this.rightEyelid) this.rightEyelid.scale.set(1, progress, 1);
      }
    }

    if (isVictory || this.currentExpression === 'victory') {
      const hop = Math.abs(Math.sin(this.animTime * 4.5)) * 0.38;
      this.bodyGroup.position.y = hop;
      if (this.headGroup) this.headGroup.rotation.z = Math.sin(this.animTime * 4) * 0.25;
      if (this.tailGroup) this.tailGroup.rotation.z = Math.sin(this.animTime * 6) * 0.6;
      return;
    }

    if (isSelected || this.currentExpression === 'selected') {
      this.bodyGroup.position.y = Math.sin(this.animTime * 3.5) * 0.08 + 0.05;
      if (this.headGroup) this.headGroup.rotation.x = Math.sin(this.animTime * 2.5) * 0.12;
      if (this.tailGroup) this.tailGroup.rotation.z = Math.sin(this.animTime * 4.5) * 0.3;
    } else {
      const breath = Math.sin(this.animTime * 1.1);
      this.bodyGroup.scale.set(1 + breath * 0.015, 1 - breath * 0.018, 1 + breath * 0.015);
      if (this.headGroup) this.headGroup.position.y = 0.72 + breath * 0.01;
      if (this.tailGroup) this.tailGroup.rotation.z = Math.sin(this.animTime * 1.5) * 0.15;
    }
  }
}
