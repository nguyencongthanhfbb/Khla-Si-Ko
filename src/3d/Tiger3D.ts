/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Shared reusable materials for high performance and low draw calls
let tigerMaterials: {
  body: THREE.MeshStandardMaterial;
  belly: THREE.MeshStandardMaterial;
  stripe: THREE.MeshStandardMaterial;
  nose: THREE.MeshStandardMaterial;
  eye: THREE.MeshStandardMaterial;
  eyeSparkle: THREE.MeshBasicMaterial;
  eyelid: THREE.MeshStandardMaterial;
  innerEar: THREE.MeshStandardMaterial;
  pawPad: THREE.MeshStandardMaterial;
  goldAccent: THREE.MeshStandardMaterial;
} | null = null;

function getTigerMaterials() {
  if (!tigerMaterials) {
    tigerMaterials = {
      body: new THREE.MeshStandardMaterial({
        color: 0xf38224, // Warm vibrant golden tiger orange
        roughness: 0.45,
        metalness: 0.08,
      }),
      belly: new THREE.MeshStandardMaterial({
        color: 0xfffaed, // Warm cream white
        roughness: 0.5,
        metalness: 0.05,
      }),
      stripe: new THREE.MeshStandardMaterial({
        color: 0x332014, // Deep rich tiger stripe brown
        roughness: 0.55,
      }),
      nose: new THREE.MeshStandardMaterial({
        color: 0xff6b81, // Soft baby pink nose
        roughness: 0.35,
      }),
      eye: new THREE.MeshStandardMaterial({
        color: 0x141414, // Glossy black eyes
        roughness: 0.1,
      }),
      eyeSparkle: new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
      eyelid: new THREE.MeshStandardMaterial({
        color: 0xf38224,
        roughness: 0.45,
      }),
      innerEar: new THREE.MeshStandardMaterial({
        color: 0xffa8b6, // Soft pastel inner pink
        roughness: 0.5,
      }),
      pawPad: new THREE.MeshStandardMaterial({
        color: 0xffa8b6,
        roughness: 0.5,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.3,
        metalness: 0.6,
      }),
    };
  }
  return tigerMaterials;
}

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

  constructor() {
    this.group = new THREE.Group();
    const mats = getTigerMaterials();

    this.bodyGroup = new THREE.Group();
    this.group.add(this.bodyGroup);

    // 1. Chibi Chubby Body (Rounded capsule)
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.38, 0.48, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, mats.body);
    bodyMesh.position.y = 0.32;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.bodyGroup.add(bodyMesh);

    // Cream Belly Patch
    const bellyGeo = new THREE.SphereGeometry(0.24, 12, 12);
    bellyGeo.scale(1.1, 1.35, 0.5);
    const bellyMesh = new THREE.Mesh(bellyGeo, mats.belly);
    bellyMesh.position.set(0, 0.32, 0.22);
    this.bodyGroup.add(bellyMesh);

    // Soft Curved Body Side Stripes (Warm wooden toy aesthetic)
    [-0.22, 0.22].forEach((x) => {
      const stripeGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.22, 8);
      const stripeMesh = new THREE.Mesh(stripeGeo, mats.stripe);
      stripeMesh.position.set(x, 0.36, 0.06);
      stripeMesh.rotation.z = x > 0 ? -0.4 : 0.4;
      this.bodyGroup.add(stripeMesh);
    });

    // 2. Chibi Large Expressive Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.72, 0.08);

    const headGeo = new THREE.SphereGeometry(0.4, 18, 18);
    headGeo.scale(1.18, 1.02, 1.08);
    const headMesh = new THREE.Mesh(headGeo, mats.body);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Cute Rounded Muzzle / Cheeks
    const muzzleGeo = new THREE.SphereGeometry(0.2, 14, 14);
    muzzleGeo.scale(1.35, 0.85, 1.0);
    const muzzleMesh = new THREE.Mesh(muzzleGeo, mats.belly);
    muzzleMesh.position.set(0, -0.07, 0.3);
    this.headGroup.add(muzzleMesh);

    // Soft Baby Pink Nose
    const noseGeo = new THREE.ConeGeometry(0.06, 0.05, 8);
    noseGeo.rotateX(Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, mats.nose);
    noseMesh.position.set(0, -0.02, 0.46);
    this.headGroup.add(noseMesh);

    // Whiskers spots (Cute dots on cheeks)
    [-0.14, 0.14].forEach((x) => {
      const dot1 = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 6), mats.stripe);
      dot1.position.set(x, -0.06, 0.43);
      this.headGroup.add(dot1);

      const dot2 = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 6), mats.stripe);
      dot2.position.set(x * 1.25, -0.09, 0.41);
      this.headGroup.add(dot2);
    });

    // Big Sparkling Expressive Eyes
    const eyeGeo = new THREE.SphereGeometry(0.072, 14, 14);

    this.leftEye = new THREE.Mesh(eyeGeo, mats.eye);
    this.leftEye.position.set(-0.18, 0.09, 0.36);
    this.headGroup.add(this.leftEye);

    this.rightEye = new THREE.Mesh(eyeGeo, mats.eye);
    this.rightEye.position.set(0.18, 0.09, 0.36);
    this.headGroup.add(this.rightEye);

    // Eye sparkles (Double highlight for cute chibi look)
    [this.leftEye, this.rightEye].forEach((eye) => {
      const sparkle1 = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), mats.eyeSparkle);
      sparkle1.position.set(0.02, 0.022, 0.055);
      eye.add(sparkle1);

      const sparkle2 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), mats.eyeSparkle);
      sparkle2.position.set(-0.02, -0.02, 0.055);
      eye.add(sparkle2);
    });

    // Dynamic Eyelids for Blinking
    const eyelidGeo = new THREE.SphereGeometry(0.076, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    this.leftEyelid = new THREE.Mesh(eyelidGeo, mats.eyelid);
    this.leftEyelid.position.set(-0.18, 0.09, 0.36);
    this.leftEyelid.rotation.x = -Math.PI / 2;
    this.leftEyelid.scale.set(1, 0, 1); // Hidden initially
    this.headGroup.add(this.leftEyelid);

    this.rightEyelid = new THREE.Mesh(eyelidGeo, mats.eyelid);
    this.rightEyelid.position.set(0.18, 0.09, 0.36);
    this.rightEyelid.rotation.x = -Math.PI / 2;
    this.rightEyelid.scale.set(1, 0, 1); // Hidden initially
    this.headGroup.add(this.rightEyelid);

    // Cheerful Soft Blushing Cheeks
    [-0.27, 0.27].forEach((x) => {
      const blushGeo = new THREE.CircleGeometry(0.065, 12);
      const blushMesh = new THREE.Mesh(
        blushGeo,
        new THREE.MeshBasicMaterial({ color: 0xff8ca3, transparent: true, opacity: 0.6 })
      );
      blushMesh.position.set(x, -0.05, 0.36);
      blushMesh.rotation.y = x > 0 ? 0.45 : -0.45;
      this.headGroup.add(blushMesh);
    });

    // Khmer Stylized Forehead Lotus Ornament (Replaces any Chinese '王' motif)
    const lotusCrest = new THREE.Group();
    lotusCrest.position.set(0, 0.25, 0.38);

    // Center petal
    const centerPetal = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.08, 6), mats.stripe);
    centerPetal.position.set(0, 0.02, 0);
    lotusCrest.add(centerPetal);

    // Flanking curved petals
    [-0.045, 0.045].forEach((x) => {
      const sidePetal = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.065, 6), mats.stripe);
      sidePetal.position.set(x, 0, 0);
      sidePetal.rotation.z = x > 0 ? -0.4 : 0.4;
      lotusCrest.add(sidePetal);
    });

    this.headGroup.add(lotusCrest);

    // Ears
    this.leftEar = this.createEar(mats, -1);
    this.rightEar = this.createEar(mats, 1);
    this.headGroup.add(this.leftEar);
    this.headGroup.add(this.rightEar);

    this.bodyGroup.add(this.headGroup);

    // 3. Four Cute Chubby Wooden Paws with Paw Pads
    const pawPositions = [
      [-0.22, 0.09, 0.18],
      [0.22, 0.09, 0.18],
      [-0.22, 0.09, -0.16],
      [0.22, 0.09, -0.16],
    ];
    pawPositions.forEach(([x, y, z]) => {
      const pawGroup = new THREE.Group();
      pawGroup.position.set(x, y, z);

      const pawGeo = new THREE.SphereGeometry(0.115, 12, 12);
      pawGeo.scale(1.0, 0.75, 1.25);
      const pawMesh = new THREE.Mesh(pawGeo, mats.belly);
      pawMesh.castShadow = true;
      pawGroup.add(pawMesh);

      // Toe pads
      const padGeo = new THREE.SphereGeometry(0.03, 6, 6);
      const padMesh = new THREE.Mesh(padGeo, mats.pawPad);
      padMesh.position.set(0, 0.04, 0.08);
      pawGroup.add(padMesh);

      this.bodyGroup.add(pawGroup);
    });

    // 4. Curled Animated Striped Tail
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.25, -0.26);

    const tailCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.18, -0.28),
      new THREE.Vector3(0, 0.38, -0.16)
    );
    const tailGeo = new THREE.TubeGeometry(tailCurve, 14, 0.048, 8, false);
    const tailMesh = new THREE.Mesh(tailGeo, mats.body);
    this.tailGroup.add(tailMesh);

    // Tail Tip (Dark tip)
    const tailTipGeo = new THREE.SphereGeometry(0.068, 8, 8);
    const tailTipMesh = new THREE.Mesh(tailTipGeo, mats.stripe);
    tailTipMesh.position.set(0, 0.38, -0.16);
    this.tailGroup.add(tailTipMesh);

    this.bodyGroup.add(this.tailGroup);

    // Initial scale
    this.group.scale.set(0.92, 0.92, 0.92);
  }

  private createEar(mats: any, side: number): THREE.Group {
    const earGroup = new THREE.Group();
    earGroup.position.set(side * 0.34, 0.36, 0.04);
    earGroup.rotation.z = side * -0.28;

    const outerGeo = new THREE.SphereGeometry(0.145, 12, 12);
    outerGeo.scale(1.0, 1.15, 0.4);
    const outerMesh = new THREE.Mesh(outerGeo, mats.body);
    earGroup.add(outerMesh);

    const innerGeo = new THREE.SphereGeometry(0.095, 10, 10);
    innerGeo.scale(1.0, 1.1, 0.3);
    const innerMesh = new THREE.Mesh(innerGeo, mats.innerEar);
    innerMesh.position.set(0, -0.01, 0.035);
    earGroup.add(innerMesh);

    return earGroup;
  }

  public setExpression(expr: TigerExpression) {
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
        // Eyelid close
        const progress = Math.sin(((-this.blinkTimer) / 0.16) * Math.PI);
        this.leftEyelid.scale.set(1, progress, 1);
        this.rightEyelid.scale.set(1, progress, 1);
      }
    }

    if (isVictory || this.currentExpression === 'victory') {
      // Cheerful Tiger victory jump & happy dance
      const bounce = Math.abs(Math.sin(this.animTime * 3.5)) * 0.28;
      this.bodyGroup.position.y = bounce;
      this.headGroup.rotation.z = Math.sin(this.animTime * 3.5) * 0.18;
      this.headGroup.rotation.x = Math.sin(this.animTime * 4.5) * 0.12;
      this.tailGroup.rotation.x = Math.sin(this.animTime * 6) * 0.5;
      this.tailGroup.rotation.y = Math.cos(this.animTime * 4) * 0.4;
      return;
    }

    if (isSelected || this.currentExpression === 'selected') {
      // Energetic alert bounce
      this.bodyGroup.position.y = Math.sin(this.animTime * 3.2) * 0.08 + 0.05;
      this.headGroup.rotation.y = Math.sin(this.animTime * 2.2) * 0.16;
      this.headGroup.rotation.z = Math.sin(this.animTime * 1.5) * 0.08;
      this.tailGroup.rotation.y = Math.sin(this.animTime * 4.5) * 0.35;
    } else {
      // Gentle soft idle breathing
      const breath = Math.sin(this.animTime * 0.85);
      this.bodyGroup.scale.set(1 + breath * 0.015, 1 - breath * 0.02, 1 + breath * 0.015);
      this.headGroup.position.y = 0.72 + breath * 0.01;
      this.headGroup.rotation.z = Math.sin(this.animTime * 0.4) * 0.04;
      this.headGroup.rotation.y = Math.sin(this.animTime * 0.25) * 0.03;
      this.tailGroup.rotation.y = Math.sin(this.animTime * 1.4) * 0.2;
      this.tailGroup.rotation.x = Math.cos(this.animTime * 0.7) * 0.12;
    }
  }
}
