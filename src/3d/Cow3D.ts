/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { assetManager } from './AssetManager';

export type CowExpression = 'idle' | 'selected' | 'placed' | 'surprised' | 'victory';

export class Cow3D {
  public group: THREE.Group;
  public bodyGroup: THREE.Group;
  public headGroup: THREE.Group;
  public leftEar: THREE.Group;
  public rightEar: THREE.Group;
  public tailGroup: THREE.Group;
  public leftEye: THREE.Mesh;
  public rightEye: THREE.Mesh;
  public leftEyelid: THREE.Mesh;
  public rightEyelid: THREE.Mesh;
  public bellMesh: THREE.Mesh;

  private animTime: number = Math.random() * 10;
  private blinkTimer: number = Math.random() * 3 + 2;
  private isBlinking: boolean = false;
  private currentExpression: CowExpression = 'idle';
  private customModelLoaded: boolean = false;

  constructor(variationIndex: number = 0) {
    this.group = new THREE.Group();

    // Procedural hierarchy as immediate container & fallback
    this.bodyGroup = new THREE.Group();
    this.group.add(this.bodyGroup);

    // Warm porcelain white & cocoa materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xfefcf9,
      roughness: 0.42,
      metalness: 0.05,
    });
    const patchMat = new THREE.MeshStandardMaterial({
      color: variationIndex % 2 === 0 ? 0x3e3027 : 0x5a4436,
      roughness: 0.55,
    });
    const snoutMat = new THREE.MeshStandardMaterial({
      color: 0xffccd7,
      roughness: 0.38,
    });
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      roughness: 0.35,
      metalness: 0.15,
    });
    const bellMat = new THREE.MeshStandardMaterial({
      color: 0xffc048,
      roughness: 0.25,
      metalness: 0.65,
    });
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xeb4d4b,
      roughness: 0.5,
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.1,
    });
    const eyeSparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hoofMat = new THREE.MeshStandardMaterial({ color: 0x544237, roughness: 0.5 });

    // 1. Chibi Chubby Body
    const bodyGeo = new THREE.CylinderGeometry(0.28, 0.35, 0.46, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.32;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.bodyGroup.add(bodyMesh);

    // Body Patches
    const patch1Geo = new THREE.SphereGeometry(0.16, 10, 10);
    patch1Geo.scale(1.1, 0.9, 0.45);
    const patch1Mesh = new THREE.Mesh(patch1Geo, patchMat);
    const p1X = variationIndex % 3 === 0 ? 0.18 : -0.16;
    patch1Mesh.position.set(p1X, 0.35, 0.15);
    patch1Mesh.rotation.y = p1X > 0 ? 0.6 : -0.6;
    this.bodyGroup.add(patch1Mesh);

    // 2. Chibi Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.68, 0.1);

    const headGeo = new THREE.SphereGeometry(0.35, 18, 18);
    headGeo.scale(1.12, 0.98, 1.06);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Eye Patch
    const eyePatchSide = variationIndex % 2 === 0 ? 0.14 : -0.14;
    const eyePatchGeo = new THREE.SphereGeometry(0.15, 12, 12);
    eyePatchGeo.scale(1.25, 1.15, 0.5);
    const eyePatchMesh = new THREE.Mesh(eyePatchGeo, patchMat);
    eyePatchMesh.position.set(eyePatchSide, 0.08, 0.24);
    this.headGroup.add(eyePatchMesh);

    // Snout
    const snoutGeo = new THREE.BoxGeometry(0.36, 0.22, 0.24);
    const snoutMesh = new THREE.Mesh(snoutGeo, snoutMat);
    snoutMesh.position.set(0, -0.08, 0.28);
    this.headGroup.add(snoutMesh);

    // Big Eyes
    const eyeGeo = new THREE.SphereGeometry(0.062, 12, 12);
    this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.leftEye.position.set(-0.17, 0.07, 0.33);
    this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.rightEye.position.set(0.17, 0.07, 0.33);
    this.headGroup.add(this.leftEye, this.rightEye);

    // Sparkles
    [this.leftEye, this.rightEye].forEach((eye) => {
      const sp = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), eyeSparkleMat);
      sp.position.set(0.016, 0.016, 0.048);
      eye.add(sp);
    });

    // Eyelids
    const eyelidGeo = new THREE.SphereGeometry(0.066, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    this.leftEyelid = new THREE.Mesh(eyelidGeo, bodyMat);
    this.leftEyelid.position.set(-0.17, 0.07, 0.33);
    this.leftEyelid.rotation.x = -Math.PI / 2;
    this.leftEyelid.scale.set(1, 0, 1);
    this.rightEyelid = new THREE.Mesh(eyelidGeo, bodyMat);
    this.rightEyelid.position.set(0.17, 0.07, 0.33);
    this.rightEyelid.rotation.x = -Math.PI / 2;
    this.rightEyelid.scale.set(1, 0, 1);
    this.headGroup.add(this.leftEyelid, this.rightEyelid);

    // Horns
    [-0.18, 0.18].forEach((x) => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.052, 0.14, 8), hornMat);
      horn.position.set(x, 0.32, 0.02);
      horn.rotation.z = x > 0 ? -0.38 : 0.38;
      horn.rotation.x = -0.15;
      this.headGroup.add(horn);
    });

    // Ears
    this.leftEar = this.createEar(-1, patchMat, bodyMat, snoutMat);
    this.rightEar = this.createEar(1, patchMat, bodyMat, snoutMat);
    this.headGroup.add(this.leftEar, this.rightEar);

    // Collar & Bell
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 8, 16), collarMat);
    collar.position.set(0, -0.22, 0);
    collar.rotation.x = Math.PI / 2;
    this.bellMesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), bellMat);
    this.bellMesh.position.set(0, -0.26, 0.24);
    this.headGroup.add(collar, this.bellMesh);

    this.bodyGroup.add(this.headGroup);

    // Hooves
    [[-0.18, 0.08, 0.16], [0.18, 0.08, 0.16], [-0.18, 0.08, -0.14], [0.18, 0.08, -0.14]].forEach(([x, y, z]) => {
      const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.16, 10), hoofMat);
      hoof.position.set(x, y, z);
      hoof.castShadow = true;
      this.bodyGroup.add(hoof);
    });

    // Tail
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.25, -0.24);
    const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6), bodyMat);
    tailMesh.rotation.x = -0.4;
    const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.052, 6, 6), patchMat);
    tuft.position.set(0, -0.12, -0.06);
    this.tailGroup.add(tailMesh, tuft);
    this.bodyGroup.add(this.tailGroup);

    this.group.scale.set(0.88, 0.88, 0.88);

    // Attempt to load GLB model asynchronously if present
    this.loadGLB();
  }

  private async loadGLB() {
    try {
      const model = await assetManager.getModel('/assets/characters/cow/cow.glb');
      if (model && !this.customModelLoaded) {
        // Clear procedural geometry and mount GLB
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

  private createEar(side: number, patchMat: any, bodyMat: any, snoutMat: any): THREE.Group {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.3, 0.16, 0);
    earGroup.rotation.z = side * -0.55;

    const earMesh = new THREE.Mesh(new THREE.SphereGeometry(0.125, 10, 10), side > 0 ? patchMat : bodyMat);
    earMesh.scale.set(1.2, 0.5, 0.4);
    const innerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), snoutMat);
    innerMesh.scale.set(1.0, 0.4, 0.3);
    innerMesh.position.set(0, -0.01, 0.02);
    earGroup.add(earMesh, innerMesh);
    return earGroup;
  }

  public setExpression(expr: CowExpression) {
    this.currentExpression = expr;
  }

  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.animTime += delta * 2.5;

    // Blinking logic
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

    if (this.bellMesh) {
      this.bellMesh.rotation.z = Math.sin(this.animTime * 2) * 0.18;
    }

    if (isVictory || this.currentExpression === 'victory') {
      const bounce = Math.abs(Math.sin(this.animTime * 3.8)) * 0.25;
      this.bodyGroup.position.y = bounce;
      if (this.headGroup) this.headGroup.rotation.z = Math.sin(this.animTime * 3.5) * 0.2;
      if (this.leftEar) this.leftEar.rotation.z = -0.55 + Math.sin(this.animTime * 6) * 0.35;
      if (this.rightEar) this.rightEar.rotation.z = 0.55 + Math.cos(this.animTime * 6) * 0.35;
      if (this.tailGroup) this.tailGroup.rotation.z = Math.sin(this.animTime * 5.5) * 0.5;
      return;
    }

    if (isSelected || this.currentExpression === 'selected') {
      this.bodyGroup.position.y = Math.sin(this.animTime * 3) * 0.07 + 0.04;
      if (this.headGroup) this.headGroup.rotation.x = Math.sin(this.animTime * 2) * 0.1;
      if (this.leftEar) this.leftEar.rotation.z = -0.55 + Math.sin(this.animTime * 4) * 0.18;
      if (this.rightEar) this.rightEar.rotation.z = 0.55 + Math.cos(this.animTime * 4) * 0.18;
    } else {
      const breath = Math.sin(this.animTime * 0.9);
      this.bodyGroup.scale.set(1 + breath * 0.012, 1 - breath * 0.015, 1 + breath * 0.012);
      if (this.headGroup) this.headGroup.position.y = 0.68 + breath * 0.008;
      if (this.tailGroup) this.tailGroup.rotation.y = Math.sin(this.animTime * 1.2) * 0.15;
    }
  }
}
