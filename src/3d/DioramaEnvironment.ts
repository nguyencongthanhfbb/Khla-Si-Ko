/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class DioramaEnvironment {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.buildEnvironment();
  }

  private buildEnvironment() {
    // 1. Warm Handcrafted Wooden Tabletop
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x3d2116, // Rich dark rosewood tabletop
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
      color: 0xd9be9b, // Warm bamboo straw
      roughness: 0.9,
    });
    const matMesh = new THREE.Mesh(matGeo, matMaterial);
    matMesh.position.y = -0.15;
    matMesh.receiveShadow = true;
    this.group.add(matMesh);

    // 2. Miniature Khmer Stone Temple Prasat Spire Ornaments (Angkor Wat silhouette)
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x9e8c79, // Warm Bayon sandstone
      roughness: 0.82,
    });

    const spirePositions = [
      { x: -4.5, z: 0, scale: 0.85 },
      { x: 4.5, z: 0, scale: 0.85 },
      { x: 0, z: -4.5, scale: 0.85 },
      { x: 0, z: 4.5, scale: 0.72 },
    ];

    spirePositions.forEach(({ x, z, scale }) => {
      const spireGroup = new THREE.Group();
      spireGroup.position.set(x, -0.15, z);
      spireGroup.scale.set(scale, scale, scale);

      // Base tier
      const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.32, 0.85), stoneMat);
      t1.position.y = 0.16;
      t1.castShadow = true;
      spireGroup.add(t1);

      // Middle tier
      const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 0.65), stoneMat);
      t2.position.y = 0.48;
      t2.castShadow = true;
      spireGroup.add(t2);

      // Top tower cone / finial
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.75, 8), stoneMat);
      cone.position.y = 0.95;
      cone.castShadow = true;
      spireGroup.add(cone);

      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), stoneMat);
      tip.position.y = 1.38;
      spireGroup.add(tip);

      this.group.add(spireGroup);
    });

    // 3. Stylized Low-Poly Miniature Trees
    const woodTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.8 });
    const leavesMat1 = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.6 }); // Emerald
    const leavesMat2 = new THREE.MeshStandardMaterial({ color: 0x26af61, roughness: 0.6 }); // Forest

    const treePositions = [
      { x: -4.3, z: -3.8, mat: leavesMat1, s: 0.95 },
      { x: 4.2, z: -3.9, mat: leavesMat2, s: 1.05 },
      { x: -4.4, z: 3.6, mat: leavesMat2, s: 0.9 },
      { x: 4.3, z: 3.7, mat: leavesMat1, s: 0.92 },
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

    // 4. Floating Lotus Pads & Pink Blossoms
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xff7675, roughness: 0.38 });
    const lotusCenterMat = new THREE.MeshStandardMaterial({ color: 0xfeca57 });

    const lotusPositions = [
      { x: -3.3, z: -4.2 },
      { x: 3.3, z: -4.1 },
      { x: -3.6, z: 2.2 },
      { x: 3.6, z: 2.3 },
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

    // 5. Miniature Wooden Village Fence Posts
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x6e4932, roughness: 0.7 });
    const fencePositions = [
      { x: -2.0, z: -4.6 },
      { x: 2.0, z: -4.6 },
      { x: -2.0, z: 4.6 },
      { x: 2.0, z: 4.6 },
    ];

    fencePositions.forEach(({ x, z }) => {
      const postGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.45, 6);
      const postMesh = new THREE.Mesh(postGeo, fenceMat);
      postMesh.position.set(x, 0.08, z);
      postMesh.castShadow = true;
      this.group.add(postMesh);
    });

    // 6. Smooth River Pebble Stones
    const stoneMatPebble = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.8 });
    const pebblePositions = [
      { x: -3.8, z: -1.5, s: 0.12 },
      { x: 3.9, z: -1.2, s: 0.14 },
      { x: -3.7, z: 1.2, s: 0.11 },
      { x: 3.8, z: 1.4, s: 0.13 },
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
