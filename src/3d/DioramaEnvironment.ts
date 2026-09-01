/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { KhmerRoofMiniature3D, KhmerGardenProps3D } from './KhmerDecor3D';

export class DioramaEnvironment {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.buildEnvironment();
  }

  private buildEnvironment() {
    // 1. Warm Handcrafted Wooden Tabletop
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x381f14, // Rich dark rosewood tabletop
      roughness: 0.65,
      metalness: 0.05,
    });
    const tableGeo = new THREE.CylinderGeometry(8.8, 9.2, 0.45, 36);
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.38;
    tableMesh.receiveShadow = true;
    this.group.add(tableMesh);

    // Decorative Natural Woven Bamboo Mat Base
    const matGeo = new THREE.CylinderGeometry(5.0, 5.2, 0.04, 36);
    const matMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4ba96, // Warm bamboo straw
      roughness: 0.9,
    });
    const matMesh = new THREE.Mesh(matGeo, matMaterial);
    matMesh.position.y = -0.15;
    matMesh.receiveShadow = true;
    this.group.add(matMesh);

    // 2. Miniature Khmer Wooden Village Pavilion (Sala) Silhouette in Background
    const pavilionLeft = new KhmerRoofMiniature3D();
    pavilionLeft.position.set(-4.5, -0.15, -2.6);
    pavilionLeft.scale.set(0.72, 0.72, 0.72);
    pavilionLeft.rotation.y = 0.45;
    this.group.add(pavilionLeft);

    const pavilionRight = new KhmerRoofMiniature3D();
    pavilionRight.position.set(4.5, -0.15, -2.5);
    pavilionRight.scale.set(0.72, 0.72, 0.72);
    pavilionRight.rotation.y = -0.45;
    this.group.add(pavilionRight);

    // 3. Khmer Village Clay Water Jars (K'am) on Wooden Stands
    const jar1 = new KhmerGardenProps3D();
    jar1.position.set(-4.2, -0.15, 2.8);
    jar1.scale.set(0.75, 0.75, 0.75);
    this.group.add(jar1);

    const jar2 = new KhmerGardenProps3D();
    jar2.position.set(4.2, -0.15, 2.7);
    jar2.scale.set(0.75, 0.75, 0.75);
    this.group.add(jar2);

    // 4. Stylized Low-Poly Miniature Trees
    const woodTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.8 });
    const leavesMat1 = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.6 }); // Emerald
    const leavesMat2 = new THREE.MeshStandardMaterial({ color: 0x26af61, roughness: 0.6 }); // Forest

    const treePositions = [
      { x: -4.3, z: -4.2, mat: leavesMat1, s: 0.95 },
      { x: 4.3, z: -4.3, mat: leavesMat2, s: 1.05 },
      { x: -4.6, z: 1.2, mat: leavesMat2, s: 0.85 },
      { x: 4.6, z: 1.1, mat: leavesMat1, s: 0.88 },
    ];

    treePositions.forEach(({ x, z, mat, s }) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, -0.15, z);
      treeGroup.scale.set(s, s, s);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.65, 8), woodTrunkMat);
      trunk.position.y = 0.32;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Canopy cloud spheres
      const top1 = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 10), mat);
      top1.position.y = 0.85;
      top1.castShadow = true;
      treeGroup.add(top1);

      const top2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), mat);
      top2.position.set(0.14, 0.7, 0.1);
      treeGroup.add(top2);

      this.group.add(treeGroup);
    });

    // 5. Floating Lotus Pads & Pink Blossoms
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xff7675, roughness: 0.38 });
    const lotusCenterMat = new THREE.MeshStandardMaterial({ color: 0xfeca57 });

    const lotusPositions = [
      { x: -2.6, z: -4.2 },
      { x: 2.6, z: -4.2 },
      { x: -3.8, z: 3.8 },
      { x: 3.8, z: 3.8 },
    ];

    lotusPositions.forEach(({ x, z }) => {
      const lotusGroup = new THREE.Group();
      lotusGroup.position.set(x, -0.12, z);

      // Lily pad
      const padGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.02, 14);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x10ac84, roughness: 0.5 });
      const pad = new THREE.Mesh(padGeo, padMat);
      lotusGroup.add(pad);

      // Center
      const flowerCenter = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), lotusCenterMat);
      flowerCenter.position.y = 0.04;
      lotusGroup.add(flowerCenter);

      // 5 Petals
      for (let i = 0; i < 5; i++) {
        const pGeo = new THREE.ConeGeometry(0.055, 0.13, 4);
        pGeo.rotateX(Math.PI / 2.5);
        const pMesh = new THREE.Mesh(pGeo, petalMat);
        const ang = (i / 5) * Math.PI * 2;
        pMesh.position.set(Math.cos(ang) * 0.08, 0.035, Math.sin(ang) * 0.08);
        pMesh.rotation.y = -ang;
        lotusGroup.add(pMesh);
      }

      this.group.add(lotusGroup);
    });

    // 6. Miniature Wooden Village Bamboo Fence Posts
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x6e4932, roughness: 0.7 });
    const fencePositions = [
      { x: -1.8, z: -4.5 },
      { x: 1.8, z: -4.5 },
      { x: -1.8, z: 4.5 },
      { x: 1.8, z: 4.5 },
    ];

    fencePositions.forEach(({ x, z }) => {
      const postGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.45, 6);
      const postMesh = new THREE.Mesh(postGeo, fenceMat);
      postMesh.position.set(x, 0.08, z);
      postMesh.castShadow = true;
      this.group.add(postMesh);
    });

    // 7. Smooth River Pebble Stones
    const stoneMatPebble = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.8 });
    const pebblePositions = [
      { x: -3.6, z: -1.2, s: 0.12 },
      { x: 3.6, z: -1.1, s: 0.14 },
      { x: -3.5, z: 2.1, s: 0.11 },
      { x: 3.5, z: 2.2, s: 0.13 },
    ];

    pebblePositions.forEach(({ x, z, s }) => {
      const pebbleGeo = new THREE.SphereGeometry(s, 8, 8);
      pebbleGeo.scale(1.2, 0.6, 1.0);
      const pebble = new THREE.Mesh(pebbleGeo, stoneMatPebble);
      pebble.position.set(x, -0.12, z);
      this.group.add(pebble);
    });
  }
}
