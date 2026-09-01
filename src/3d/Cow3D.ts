/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

let cowMaterials: {
  body: THREE.MeshStandardMaterial;
  patch: THREE.MeshStandardMaterial;
  patchAlt: THREE.MeshStandardMaterial;
  snout: THREE.MeshStandardMaterial;
  horn: THREE.MeshStandardMaterial;
  bell: THREE.MeshStandardMaterial;
  collar: THREE.MeshStandardMaterial;
  eye: THREE.MeshStandardMaterial;
  eyeSparkle: THREE.MeshBasicMaterial;
  eyelid: THREE.MeshStandardMaterial;
  hoof: THREE.MeshStandardMaterial;
} | null = null;

function getCowMaterials() {
  if (!cowMaterials) {
    cowMaterials = {
      body: new THREE.MeshStandardMaterial({
        color: 0xfefcf9, // Warm milky porcelain white
        roughness: 0.42,
        metalness: 0.05,
      }),
      patch: new THREE.MeshStandardMaterial({
        color: 0x3e3027, // Soft warm dark espresso patch
        roughness: 0.55,
      }),
      patchAlt: new THREE.MeshStandardMaterial({
        color: 0x5a4436, // Slightly lighter warm cocoa patch
        roughness: 0.55,
      }),
      snout: new THREE.MeshStandardMaterial({
        color: 0xffccd7, // Gentle baby pink snout
        roughness: 0.38,
      }),
      horn: new THREE.MeshStandardMaterial({
        color: 0xdeb887, // Golden wood horns
        roughness: 0.35,
        metalness: 0.15,
      }),
      bell: new THREE.MeshStandardMaterial({
        color: 0xffc048, // Golden brass bell
        roughness: 0.25,
        metalness: 0.65,
      }),
      collar: new THREE.MeshStandardMaterial({
        color: 0xeb4d4b, // Warm red collar
        roughness: 0.5,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: 0x141414, // Dark expressive eyes
        roughness: 0.1,
      }),
      eyeSparkle: new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
      eyelid: new THREE.MeshStandardMaterial({
        color: 0xfefcf9,
        roughness: 0.42,
      }),
      hoof: new THREE.MeshStandardMaterial({
        color: 0x544237, // Wooden hoof
        roughness: 0.5,
      }),
    };
  }
  return cowMaterials;
}

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

  constructor(variationIndex: number = 0) {
    this.group = new THREE.Group();
    const mats = getCowMaterials();

    this.bodyGroup = new THREE.Group();
    this.group.add(this.bodyGroup);

    // 1. Chibi Chubby Body (Cute rounded capsule)
    const bodyGeo = new THREE.CylinderGeometry(0.28, 0.35, 0.46, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mats.body);
    bodyMesh.position.y = 0.32;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.bodyGroup.add(bodyMesh);

    // Body Patches (Varied based on variation index for visual richness)
    const patchMat = variationIndex % 2 === 0 ? mats.patch : mats.patchAlt;

    const patch1Geo = new THREE.SphereGeometry(0.16, 10, 10);
    patch1Geo.scale(1.1, 0.9, 0.45);
    const patch1Mesh = new THREE.Mesh(patch1Geo, patchMat);
    const p1X = variationIndex % 3 === 0 ? 0.18 : -0.16;
    patch1Mesh.position.set(p1X, 0.35, 0.15);
    patch1Mesh.rotation.y = p1X > 0 ? 0.6 : -0.6;
    this.bodyGroup.add(patch1Mesh);

    const patch2Geo = new THREE.SphereGeometry(0.14, 10, 10);
    patch2Geo.scale(0.85, 1.15, 0.45);
    const patch2Mesh = new THREE.Mesh(patch2Geo, patchMat);
    patch2Mesh.position.set(-p1X, 0.28, -0.14);
    patch2Mesh.rotation.y = p1X > 0 ? -0.5 : 0.5;
    this.bodyGroup.add(patch2Mesh);

    // 2. Chibi Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.68, 0.1);

    const headGeo = new THREE.SphereGeometry(0.35, 18, 18);
    headGeo.scale(1.12, 0.98, 1.06);
    const headMesh = new THREE.Mesh(headGeo, mats.body);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Patch over one eye (alternates side based on variation)
    const eyePatchSide = variationIndex % 2 === 0 ? 0.14 : -0.14;
    const eyePatchGeo = new THREE.SphereGeometry(0.15, 12, 12);
    eyePatchGeo.scale(1.25, 1.15, 0.5);
    const eyePatchMesh = new THREE.Mesh(eyePatchGeo, patchMat);
    eyePatchMesh.position.set(eyePatchSide, 0.08, 0.24);
    eyePatchMesh.rotation.y = eyePatchSide > 0 ? 0.3 : -0.3;
    this.headGroup.add(eyePatchMesh);

    // Snout / Muzzle
    const snoutGeo = new THREE.BoxGeometry(0.36, 0.22, 0.24);
    const snoutMesh = new THREE.Mesh(snoutGeo, mats.snout);
    snoutMesh.position.set(0, -0.08, 0.28);
    this.headGroup.add(snoutMesh);

    // Nostrils
    [-0.08, 0.08].forEach((x) => {
      const nostrilGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const nostrilMesh = new THREE.Mesh(nostrilGeo, mats.patch);
      nostrilMesh.position.set(x, -0.06, 0.41);
      this.headGroup.add(nostrilMesh);
    });

    // Big Sparkling Eyes
    const eyeGeo = new THREE.SphereGeometry(0.062, 12, 12);

    this.leftEye = new THREE.Mesh(eyeGeo, mats.eye);
    this.leftEye.position.set(-0.17, 0.07, 0.33);
    this.headGroup.add(this.leftEye);

    this.rightEye = new THREE.Mesh(eyeGeo, mats.eye);
    this.rightEye.position.set(0.17, 0.07, 0.33);
    this.headGroup.add(this.rightEye);

    // Sparkles
    [this.leftEye, this.rightEye].forEach((eye) => {
      const sparkle1 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), mats.eyeSparkle);
      sparkle1.position.set(0.016, 0.016, 0.048);
      eye.add(sparkle1);

      const sparkle2 = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), mats.eyeSparkle);
      sparkle2.position.set(-0.016, -0.016, 0.048);
      eye.add(sparkle2);
    });

    // Eyelids for Blinking
    const eyelidGeo = new THREE.SphereGeometry(0.066, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    this.leftEyelid = new THREE.Mesh(eyelidGeo, mats.eyelid);
    this.leftEyelid.position.set(-0.17, 0.07, 0.33);
    this.leftEyelid.rotation.x = -Math.PI / 2;
    this.leftEyelid.scale.set(1, 0, 1);
    this.headGroup.add(this.leftEyelid);

    this.rightEyelid = new THREE.Mesh(eyelidGeo, mats.eyelid);
    this.rightEyelid.position.set(0.17, 0.07, 0.33);
    this.rightEyelid.rotation.x = -Math.PI / 2;
    this.rightEyelid.scale.set(1, 0, 1);
    this.headGroup.add(this.rightEyelid);

    // Cute Little Rounded Horns (Smooth golden wood, child-friendly)
    [-0.18, 0.18].forEach((x) => {
      const hornGeo = new THREE.ConeGeometry(0.052, 0.14, 8);
      const hornMesh = new THREE.Mesh(hornGeo, mats.horn);
      hornMesh.position.set(x, 0.32, 0.02);
      hornMesh.rotation.z = x > 0 ? -0.38 : 0.38;
      hornMesh.rotation.x = -0.15;
      this.headGroup.add(hornMesh);
    });

    // Floppy Cute Ears
    this.leftEar = this.createEar(mats, -1, patchMat);
    this.rightEar = this.createEar(mats, 1, patchMat);
    this.headGroup.add(this.leftEar);
    this.headGroup.add(this.rightEar);

    // Red Collar & Brass Bell
    const collarGeo = new THREE.TorusGeometry(0.24, 0.03, 8, 16);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, mats.collar);
    collarMesh.position.set(0, -0.22, 0);
    this.headGroup.add(collarMesh);

    const bellGeo = new THREE.SphereGeometry(0.065, 10, 10);
    this.bellMesh = new THREE.Mesh(bellGeo, mats.bell);
    this.bellMesh.position.set(0, -0.26, 0.24);
    this.headGroup.add(this.bellMesh);

    this.bodyGroup.add(this.headGroup);

    // 3. Four Wooden Peg Hooves
    const hoofPositions = [
      [-0.18, 0.08, 0.16],
      [0.18, 0.08, 0.16],
      [-0.18, 0.08, -0.14],
      [0.18, 0.08, -0.14],
    ];
    hoofPositions.forEach(([x, y, z]) => {
      const hoofGeo = new THREE.CylinderGeometry(0.07, 0.085, 0.16, 10);
      const hoofMesh = new THREE.Mesh(hoofGeo, mats.hoof);
      hoofMesh.position.set(x, y, z);
      hoofMesh.castShadow = true;
      this.bodyGroup.add(hoofMesh);
    });

    // 4. Little Cow Tail with Tuft
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.25, -0.24);

    const tailGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6);
    tailGeo.rotateX(-0.4);
    const tailMesh = new THREE.Mesh(tailGeo, mats.body);
    this.tailGroup.add(tailMesh);

    const tuftGeo = new THREE.SphereGeometry(0.052, 6, 6);
    const tuftMesh = new THREE.Mesh(tuftGeo, mats.patch);
    tuftMesh.position.set(0, -0.12, -0.06);
    this.tailGroup.add(tuftMesh);

    this.bodyGroup.add(this.tailGroup);

    this.group.scale.set(0.88, 0.88, 0.88);
  }

  private createEar(mats: any, side: number, patchMat: any): THREE.Group {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.3, 0.16, 0);
    earGroup.rotation.z = side * -0.55;

    const earGeo = new THREE.SphereGeometry(0.125, 10, 10);
    earGeo.scale(1.2, 0.5, 0.4);
    const earMesh = new THREE.Mesh(earGeo, side > 0 ? patchMat : mats.body);
    earGroup.add(earMesh);

    const innerGeo = new THREE.SphereGeometry(0.085, 8, 8);
    innerGeo.scale(1.0, 0.4, 0.3);
    const innerMesh = new THREE.Mesh(innerGeo, mats.snout);
    innerMesh.position.set(0, -0.01, 0.02);
    earGroup.add(innerMesh);

    return earGroup;
  }

  public setExpression(expr: CowExpression) {
    this.currentExpression = expr;
  }

  /**
   * Updates state-based expressions & animations
   */
  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.animTime += delta * 2.5;

    // Blinking logic
    this.blinkTimer -= delta;
    if (this.blinkTimer <= 0) {
      this.isBlinking = true;
      if (this.blinkTimer <= -0.16) {
        this.isBlinking = false;
        this.blinkTimer = Math.random() * 3.5 + 2.0;
        this.leftEyelid.scale.set(1, 0, 1);
        this.rightEyelid.scale.set(1, 0, 1);
      } else {
        const progress = Math.sin(((-this.blinkTimer) / 0.16) * Math.PI);
        this.leftEyelid.scale.set(1, progress, 1);
        this.rightEyelid.scale.set(1, progress, 1);
      }
    }

    // Bell swing
    this.bellMesh.rotation.z = Math.sin(this.animTime * 2) * 0.18;

    if (isVictory || this.currentExpression === 'victory') {
      // Cheerful cow victory dance & ear wiggle
      const bounce = Math.abs(Math.sin(this.animTime * 3.8)) * 0.25;
      this.bodyGroup.position.y = bounce;
      this.headGroup.rotation.z = Math.sin(this.animTime * 3.5) * 0.2;
      this.leftEar.rotation.z = -0.55 + Math.sin(this.animTime * 6) * 0.35;
      this.rightEar.rotation.z = 0.55 + Math.cos(this.animTime * 6) * 0.35;
      this.tailGroup.rotation.z = Math.sin(this.animTime * 5.5) * 0.5;
      return;
    }

    if (isSelected || this.currentExpression === 'selected') {
      // Selected bounce
      this.bodyGroup.position.y = Math.sin(this.animTime * 3) * 0.07 + 0.04;
      this.headGroup.rotation.x = Math.sin(this.animTime * 2) * 0.1;
      this.leftEar.rotation.z = -0.55 + Math.sin(this.animTime * 4) * 0.18;
      this.rightEar.rotation.z = 0.55 + Math.cos(this.animTime * 4) * 0.18;
    } else {
      // Gentle idle breathing
      const breath = Math.sin(this.animTime * 0.9);
      this.bodyGroup.scale.set(1 + breath * 0.012, 1 - breath * 0.015, 1 + breath * 0.012);
      this.headGroup.position.y = 0.68 + breath * 0.008;
      this.tailGroup.rotation.y = Math.sin(this.animTime * 1.2) * 0.15;
      // Occasional ear flick
      this.rightEar.rotation.z = 0.55 + (Math.sin(this.animTime * 0.35) > 0.8 ? Math.sin(this.animTime * 8) * 0.22 : 0);
    }
  }
}
