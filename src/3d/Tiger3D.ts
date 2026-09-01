/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Shared reusable materials & geometries for high performance and low draw calls
let tigerMaterials: {
  body: THREE.MeshStandardMaterial;
  belly: THREE.MeshStandardMaterial;
  stripe: THREE.MeshStandardMaterial;
  nose: THREE.MeshStandardMaterial;
  eye: THREE.MeshStandardMaterial;
  eyeSparkle: THREE.MeshBasicMaterial;
  innerEar: THREE.MeshStandardMaterial;
} | null = null;

function getTigerMaterials() {
  if (!tigerMaterials) {
    tigerMaterials = {
      body: new THREE.MeshStandardMaterial({
        color: 0xf38224, // Warm vibrant tiger orange
        roughness: 0.45,
        metalness: 0.08,
      }),
      belly: new THREE.MeshStandardMaterial({
        color: 0xfffaed, // Warm cream white
        roughness: 0.5,
        metalness: 0.05,
      }),
      stripe: new THREE.MeshStandardMaterial({
        color: 0x2b1d0c, // Deep rich tiger stripe brown
        roughness: 0.6,
      }),
      nose: new THREE.MeshStandardMaterial({
        color: 0xff6b81, // Soft pink nose
        roughness: 0.3,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: 0x111111, // Glossy black eyes
        roughness: 0.1,
      }),
      eyeSparkle: new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
      innerEar: new THREE.MeshStandardMaterial({
        color: 0xffa8b6,
        roughness: 0.5,
      }),
    };
  }
  return tigerMaterials;
}

export class Tiger3D {
  public group: THREE.Group;
  public bodyGroup: THREE.Group;
  public headGroup: THREE.Group;
  public tailGroup: THREE.Group;
  public leftEar: THREE.Group;
  public rightEar: THREE.Group;
  private animTime: number = Math.random() * 10;

  constructor() {
    this.group = new THREE.Group();
    const mats = getTigerMaterials();

    this.bodyGroup = new THREE.Group();
    this.group.add(this.bodyGroup);

    // 1. Body (Cute rounded capsule/cylinder)
    const bodyGeo = new THREE.CylinderGeometry(0.32, 0.38, 0.5, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mats.body);
    bodyMesh.position.y = 0.35;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.bodyGroup.add(bodyMesh);

    // Belly patch
    const bellyGeo = new THREE.SphereGeometry(0.24, 12, 12);
    bellyGeo.scale(1.1, 1.4, 0.5);
    const bellyMesh = new THREE.Mesh(bellyGeo, mats.belly);
    bellyMesh.position.set(0, 0.35, 0.22);
    this.bodyGroup.add(bellyMesh);

    // Body side stripes
    [-0.22, 0.22].forEach((x) => {
      const stripeGeo = new THREE.BoxGeometry(0.04, 0.08, 0.28);
      const stripeMesh = new THREE.Mesh(stripeGeo, mats.stripe);
      stripeMesh.position.set(x, 0.4, 0.05);
      stripeMesh.rotation.y = x > 0 ? -0.4 : 0.4;
      this.bodyGroup.add(stripeMesh);
    });

    // 2. Chibi Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.72, 0.08);

    const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
    headGeo.scale(1.15, 1.0, 1.05);
    const headMesh = new THREE.Mesh(headGeo, mats.body);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Snout / Muzzle
    const muzzleGeo = new THREE.SphereGeometry(0.18, 12, 12);
    muzzleGeo.scale(1.3, 0.85, 1.0);
    const muzzleMesh = new THREE.Mesh(muzzleGeo, mats.belly);
    muzzleMesh.position.set(0, -0.06, 0.3);
    this.headGroup.add(muzzleMesh);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.06, 0.05, 8);
    noseGeo.rotateX(Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, mats.nose);
    noseMesh.position.set(0, -0.01, 0.45);
    this.headGroup.add(noseMesh);

    // Eyes with cute highlights
    [-0.18, 0.18].forEach((x) => {
      const eyeGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const eyeMesh = new THREE.Mesh(eyeGeo, mats.eye);
      eyeMesh.position.set(x, 0.08, 0.35);

      const sparkleGeo = new THREE.SphereGeometry(0.022, 8, 8);
      const sparkleMesh = new THREE.Mesh(sparkleGeo, mats.eyeSparkle);
      sparkleMesh.position.set(0.02, 0.02, 0.05);
      eyeMesh.add(sparkleMesh);

      this.headGroup.add(eyeMesh);
    });

    // Cheeks blushing blush spots
    [-0.26, 0.26].forEach((x) => {
      const blushGeo = new THREE.CircleGeometry(0.06, 10);
      const blushMesh = new THREE.Mesh(
        blushGeo,
        new THREE.MeshBasicMaterial({ color: 0xff88a3, transparent: true, opacity: 0.55 })
      );
      blushMesh.position.set(x, -0.05, 0.34);
      blushMesh.rotation.y = x > 0 ? 0.4 : -0.4;
      this.headGroup.add(blushMesh);
    });

    // Forehead King/Tiger motif stripes ("王" motif)
    const foreheadStripe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.035, 0.02), mats.stripe);
    foreheadStripe.position.set(0, 0.22, 0.37);
    this.headGroup.add(foreheadStripe);

    const verticalStripe = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.12, 0.02), mats.stripe);
    verticalStripe.position.set(0, 0.22, 0.37);
    this.headGroup.add(verticalStripe);

    // Ears
    this.leftEar = this.createEar(mats, -1);
    this.rightEar = this.createEar(mats, 1);
    this.headGroup.add(this.leftEar);
    this.headGroup.add(this.rightEar);

    this.bodyGroup.add(this.headGroup);

    // 3. Four Cute Wooden Peg Paws
    const pawPositions = [
      [-0.22, 0.1, 0.2],
      [0.22, 0.1, 0.2],
      [-0.22, 0.1, -0.16],
      [0.22, 0.1, -0.16],
    ];
    pawPositions.forEach(([x, y, z]) => {
      const pawGeo = new THREE.SphereGeometry(0.11, 10, 10);
      pawGeo.scale(1.0, 0.8, 1.2);
      const pawMesh = new THREE.Mesh(pawGeo, mats.belly);
      pawMesh.position.set(x, y, z);
      pawMesh.castShadow = true;
      this.bodyGroup.add(pawMesh);
    });

    // 4. Curled Animated Tail
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.25, -0.28);

    const tailCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.15, -0.25),
      new THREE.Vector3(0, 0.35, -0.15)
    );
    const tailGeo = new THREE.TubeGeometry(tailCurve, 12, 0.045, 8, false);
    const tailMesh = new THREE.Mesh(tailGeo, mats.body);
    this.tailGroup.add(tailMesh);

    // Tail Tip
    const tailTipGeo = new THREE.SphereGeometry(0.065, 8, 8);
    const tailTipMesh = new THREE.Mesh(tailTipGeo, mats.stripe);
    tailTipMesh.position.set(0, 0.35, -0.15);
    this.tailGroup.add(tailTipMesh);

    this.bodyGroup.add(this.tailGroup);

    // Initial scale & setup
    this.group.scale.set(0.92, 0.92, 0.92);
  }

  private createEar(mats: any, side: number): THREE.Group {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.32, 0.34, 0.05);
    earGroup.rotation.z = side * -0.25;

    const outerGeo = new THREE.SphereGeometry(0.14, 10, 10);
    outerGeo.scale(1.0, 1.1, 0.4);
    const outerMesh = new THREE.Mesh(outerGeo, mats.body);
    earGroup.add(outerMesh);

    const innerGeo = new THREE.SphereGeometry(0.09, 8, 8);
    innerGeo.scale(1.0, 1.1, 0.3);
    const innerMesh = new THREE.Mesh(innerGeo, mats.innerEar);
    innerMesh.position.set(0, -0.01, 0.03);
    earGroup.add(innerMesh);

    return earGroup;
  }

  /**
   * Updates subtle idle animations (breathing, tail wag, gentle head tilt)
   */
  public update(delta: number, isSelected: boolean = false, isVictory: boolean = false) {
    this.animTime += delta * 2.5;

    if (isVictory) {
      // Happy victory bounce
      this.bodyGroup.position.y = Math.abs(Math.sin(this.animTime * 3)) * 0.25;
      this.headGroup.rotation.z = Math.sin(this.animTime * 3) * 0.18;
      this.headGroup.rotation.x = Math.sin(this.animTime * 4) * 0.15;
      this.tailGroup.rotation.x = Math.sin(this.animTime * 5) * 0.4;
      return;
    }

    if (isSelected) {
      // Energetic alert bounce
      this.bodyGroup.position.y = Math.sin(this.animTime * 3) * 0.08 + 0.05;
      this.headGroup.rotation.y = Math.sin(this.animTime * 2) * 0.15;
      this.tailGroup.rotation.y = Math.sin(this.animTime * 4) * 0.3;
    } else {
      // Gentle soft idle breathing
      const breath = Math.sin(this.animTime);
      this.bodyGroup.scale.set(1 + breath * 0.015, 1 - breath * 0.02, 1 + breath * 0.015);
      this.headGroup.position.y = 0.72 + breath * 0.01;
      this.headGroup.rotation.z = Math.sin(this.animTime * 0.5) * 0.04;
      this.tailGroup.rotation.y = Math.sin(this.animTime * 1.5) * 0.2;
      this.tailGroup.rotation.x = Math.cos(this.animTime * 0.8) * 0.1;
    }
  }
}
