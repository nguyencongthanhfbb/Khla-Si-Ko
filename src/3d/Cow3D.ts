/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

let cowMaterials: {
  body: THREE.MeshStandardMaterial;
  patch: THREE.MeshStandardMaterial;
  snout: THREE.MeshStandardMaterial;
  horn: THREE.MeshStandardMaterial;
  bell: THREE.MeshStandardMaterial;
  collar: THREE.MeshStandardMaterial;
  eye: THREE.MeshStandardMaterial;
  eyeSparkle: THREE.MeshBasicMaterial;
  hoof: THREE.MeshStandardMaterial;
} | null = null;

function getCowMaterials() {
  if (!cowMaterials) {
    cowMaterials = {
      body: new THREE.MeshStandardMaterial({
        color: 0xfdfaf6, // Warm milky porcelain white
        roughness: 0.45,
        metalness: 0.05,
      }),
      patch: new THREE.MeshStandardMaterial({
        color: 0x3d312a, // Soft warm dark espresso patch
        roughness: 0.55,
      }),
      snout: new THREE.MeshStandardMaterial({
        color: 0xffd1dc, // Gentle baby pink snout
        roughness: 0.4,
      }),
      horn: new THREE.MeshStandardMaterial({
        color: 0xdeb887, // Golden wood horns
        roughness: 0.35,
        metalness: 0.15,
      }),
      bell: new THREE.MeshStandardMaterial({
        color: 0xffc048, // Golden brass bell
        roughness: 0.25,
        metalness: 0.6,
      }),
      collar: new THREE.MeshStandardMaterial({
        color: 0xeb4d4b, // Red collar
        roughness: 0.5,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: 0x1a1a1a, // Dark expressive eyes
        roughness: 0.1,
      }),
      eyeSparkle: new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
      hoof: new THREE.MeshStandardMaterial({
        color: 0x534338, // Wooden hoof
        roughness: 0.5,
      }),
    };
  }
  return cowMaterials;
}

export class Cow3D {
  public group: THREE.Group;
  public bodyGroup: THREE.Group;
  public headGroup: THREE.Group;
  public leftEar: THREE.Group;
  public rightEar: THREE.Group;
  public tailGroup: THREE.Group;
  private animTime: number = Math.random() * 10;

  constructor() {
    this.group = new THREE.Group();
    const mats = getCowMaterials();

    this.bodyGroup = new THREE.Group();
    this.group.add(this.bodyGroup);

    // 1. Body (Cute chubby rounded capsule)
    const bodyGeo = new THREE.CylinderGeometry(0.28, 0.34, 0.45, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mats.body);
    bodyMesh.position.y = 0.32;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.bodyGroup.add(bodyMesh);

    // Body dark patches
    const patch1Geo = new THREE.SphereGeometry(0.16, 10, 10);
    patch1Geo.scale(1.1, 0.9, 0.4);
    const patch1Mesh = new THREE.Mesh(patch1Geo, mats.patch);
    patch1Mesh.position.set(0.18, 0.35, 0.15);
    patch1Mesh.rotation.y = 0.6;
    this.bodyGroup.add(patch1Mesh);

    const patch2Geo = new THREE.SphereGeometry(0.14, 10, 10);
    patch2Geo.scale(0.8, 1.2, 0.4);
    const patch2Mesh = new THREE.Mesh(patch2Geo, mats.patch);
    patch2Mesh.position.set(-0.16, 0.3, -0.15);
    patch2Mesh.rotation.y = -0.5;
    this.bodyGroup.add(patch2Mesh);

    // 2. Chibi Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.68, 0.1);

    const headGeo = new THREE.SphereGeometry(0.34, 16, 16);
    headGeo.scale(1.1, 0.95, 1.05);
    const headMesh = new THREE.Mesh(headGeo, mats.body);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Patch over right eye
    const eyePatchGeo = new THREE.SphereGeometry(0.15, 10, 10);
    eyePatchGeo.scale(1.2, 1.1, 0.5);
    const eyePatchMesh = new THREE.Mesh(eyePatchGeo, mats.patch);
    eyePatchMesh.position.set(0.14, 0.08, 0.24);
    eyePatchMesh.rotation.y = 0.3;
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

    // Eyes with sparkle
    [-0.17, 0.17].forEach((x) => {
      const eyeGeo = new THREE.SphereGeometry(0.055, 10, 10);
      const eyeMesh = new THREE.Mesh(eyeGeo, mats.eye);
      eyeMesh.position.set(x, 0.06, 0.32);

      const sparkleGeo = new THREE.SphereGeometry(0.018, 8, 8);
      const sparkleMesh = new THREE.Mesh(sparkleGeo, mats.eyeSparkle);
      sparkleMesh.position.set(0.015, 0.015, 0.045);
      eyeMesh.add(sparkleMesh);

      this.headGroup.add(eyeMesh);
    });

    // Cute Little Horns (Smooth, rounded golden wood)
    [-0.18, 0.18].forEach((x) => {
      const hornGeo = new THREE.ConeGeometry(0.055, 0.14, 8);
      const hornMesh = new THREE.Mesh(hornGeo, mats.horn);
      hornMesh.position.set(x, 0.32, 0.02);
      hornMesh.rotation.z = x > 0 ? -0.35 : 0.35;
      hornMesh.rotation.x = -0.15;
      this.headGroup.add(hornMesh);
    });

    // Floppy Cute Ears
    this.leftEar = this.createEar(mats, -1);
    this.rightEar = this.createEar(mats, 1);
    this.headGroup.add(this.leftEar);
    this.headGroup.add(this.rightEar);

    // Red Collar & Brass Bell
    const collarGeo = new THREE.TorusGeometry(0.24, 0.03, 8, 16);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, mats.collar);
    collarMesh.position.set(0, -0.22, 0);
    this.headGroup.add(collarMesh);

    const bellGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const bellMesh = new THREE.Mesh(bellGeo, mats.bell);
    bellMesh.position.set(0, -0.26, 0.24);
    this.headGroup.add(bellMesh);

    this.bodyGroup.add(this.headGroup);

    // 3. Four Wooden Peg Hooves
    const hoofPositions = [
      [-0.18, 0.08, 0.16],
      [0.18, 0.08, 0.16],
      [-0.18, 0.08, -0.14],
      [0.18, 0.08, -0.14],
    ];
    hoofPositions.forEach(([x, y, z]) => {
      const hoofGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.16, 10);
      const hoofMesh = new THREE.Mesh(hoofGeo, mats.hoof);
      hoofMesh.position.set(x, y, z);
      hoofMesh.castShadow = true;
      this.bodyGroup.add(hoofMesh);
    });

    // 4. Little Cow Tail
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.25, -0.24);

    const tailGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6);
    tailGeo.rotateX(-0.4);
    const tailMesh = new THREE.Mesh(tailGeo, mats.body);
    this.tailGroup.add(tailMesh);

    const tuftGeo = new THREE.SphereGeometry(0.05, 6, 6);
    const tuftMesh = new THREE.Mesh(tuftGeo, mats.patch);
    tuftMesh.position.set(0, -0.12, -0.06);
    this.tailGroup.add(tuftMesh);

    this.bodyGroup.add(this.tailGroup);

    this.group.scale.set(0.88, 0.88, 0.88);
  }

  private createEar(mats: any, side: number): THREE.Group {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.3, 0.16, 0);
    earGroup.rotation.z = side * -0.55;

    const earGeo = new THREE.SphereGeometry(0.12, 8, 8);
    earGeo.scale(1.2, 0.5, 0.4);
    const earMesh = new THREE.Mesh(earGeo, side > 0 ? mats.patch : mats.body);
    earGroup.add(earMesh);

    const innerGeo = new THREE.SphereGeometry(0.08, 6, 6);
    innerGeo.scale(1.0, 0.4, 0.3);
    const innerMesh = new THREE.Mesh(innerGeo, mats.snout);
    innerMesh.position.set(0, -0.01, 0.02);
    earGroup.add(innerMesh);

    return earGroup;
  }

  /**
   * Updates idle animations (gentle breathing, ear flick, victory dance)
   */
  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.animTime += delta * 2.5;

    if (isVictory) {
      // Cheerful cow victory jump & ear wiggle
      this.bodyGroup.position.y = Math.abs(Math.sin(this.animTime * 3.5)) * 0.22;
      this.headGroup.rotation.z = Math.sin(this.animTime * 3) * 0.2;
      this.leftEar.rotation.z = -0.55 + Math.sin(this.animTime * 6) * 0.3;
      this.rightEar.rotation.z = 0.55 + Math.cos(this.animTime * 6) * 0.3;
      this.tailGroup.rotation.z = Math.sin(this.animTime * 5) * 0.5;
      return;
    }

    if (isSelected) {
      // Selected bounce
      this.bodyGroup.position.y = Math.sin(this.animTime * 3) * 0.07 + 0.04;
      this.headGroup.rotation.x = Math.sin(this.animTime * 2) * 0.1;
      this.leftEar.rotation.z = -0.55 + Math.sin(this.animTime * 4) * 0.15;
    } else {
      // Gentle idle breathing
      const breath = Math.sin(this.animTime * 0.9);
      this.bodyGroup.scale.set(1 + breath * 0.012, 1 - breath * 0.015, 1 + breath * 0.012);
      this.headGroup.position.y = 0.68 + breath * 0.008;
      this.tailGroup.rotation.y = Math.sin(this.animTime * 1.2) * 0.15;
      // Occasional ear flick
      this.rightEar.rotation.z = 0.55 + (Math.sin(this.animTime * 0.3) > 0.8 ? Math.sin(this.animTime * 8) * 0.2 : 0);
    }
  }
}
