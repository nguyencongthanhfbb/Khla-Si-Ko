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
    // 1. Warm Floor / Wooden Table Surface
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x3e2316, // Rich dark rosewood tabletop
      roughness: 0.7,
      metalness: 0.05,
    });
    const tableGeo = new THREE.CylinderGeometry(8.5, 9.0, 0.4, 32);
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.35;
    tableMesh.receiveShadow = true;
    this.group.add(tableMesh);

    // Decorative woven straw mat under the board
    const matGeo = new THREE.CylinderGeometry(4.8, 5.0, 0.04, 32);
    const matMaterial = new THREE.MeshStandardMaterial({
      color: 0xd2b48c, // Natural beige bamboo/straw
      roughness: 0.9,
    });
    const matMesh = new THREE.Mesh(matGeo, matMaterial);
    matMesh.position.y = -0.15;
    matMesh.receiveShadow = true;
    this.group.add(matMesh);

    // 2. Miniature Khmer Stone Temple Spire Ornaments (Angkor Wat silhouette at the 4 outer sides)
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x8a7968, // Warm sandstone
      roughness: 0.8,
    });

    const spirePositions = [
      { x: -4.5, z: 0, scale: 0.8 },
      { x: 4.5, z: 0, scale: 0.8 },
      { x: 0, z: -4.5, scale: 0.8 },
      { x: 0, z: 4.5, scale: 0.7 },
    ];

    spirePositions.forEach(({ x, z, scale }) => {
      const spireGroup = new THREE.Group();
      spireGroup.position.set(x, -0.15, z);
      spireGroup.scale.set(scale, scale, scale);

      // Base tiers
      const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), stoneMat);
      t1.position.y = 0.15;
      spireGroup.add(t1);

      const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.6), stoneMat);
      t2.position.y = 0.45;
      spireGroup.add(t2);

      // Tower cone / finial
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.7, 8), stoneMat);
      cone.position.y = 0.9;
      spireGroup.add(cone);

      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), stoneMat);
      tip.position.y = 1.3;
      spireGroup.add(tip);

      this.group.add(spireGroup);
    });

    // 3. Stylized Low-Poly Miniature Trees
    const woodTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.8 });
    const leavesMat1 = new THREE.MeshStandardMaterial({ color: 0x2ed573, roughness: 0.6 }); // Emerald
    const leavesMat2 = new THREE.MeshStandardMaterial({ color: 0x26af61, roughness: 0.6 }); // Deep forest

    const treePositions = [
      { x: -4.2, z: -3.8, mat: leavesMat1, s: 0.9 },
      { x: 4.0, z: -3.9, mat: leavesMat2, s: 1.0 },
      { x: -4.3, z: 3.6, mat: leavesMat2, s: 0.85 },
      { x: 4.2, z: 3.7, mat: leavesMat1, s: 0.9 },
    ];

    treePositions.forEach(({ x, z, mat, s }) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, -0.15, z);
      treeGroup.scale.set(s, s, s);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.6, 8), woodTrunkMat);
      trunk.position.y = 0.3;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // Foliage blobs (Chubby clouds)
      const top1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), mat);
      top1.position.y = 0.8;
      top1.castShadow = true;
      treeGroup.add(top1);

      const top2 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), mat);
      top2.position.set(0.12, 0.65, 0.1);
      treeGroup.add(top2);

      this.group.add(treeGroup);
    });

    // 4. Floating Lotus Petals & Decorative Lilies
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xff7675, roughness: 0.4 });
    const lotusCenterMat = new THREE.MeshStandardMaterial({ color: 0xfeca57 });

    const lotusPositions = [
      { x: -3.2, z: -4.2 },
      { x: 3.2, z: -4.1 },
      { x: -3.5, z: 2.2 },
      { x: 3.5, z: 2.3 },
    ];

    lotusPositions.forEach(({ x, z }) => {
      const lotusGroup = new THREE.Group();
      lotusGroup.position.set(x, -0.12, z);

      // Lotus pad (Leaf)
      const padGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.02, 12);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x10ac84, roughness: 0.5 });
      const pad = new THREE.Mesh(padGeo, padMat);
      lotusGroup.add(pad);

      // Center
      const flowerCenter = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), lotusCenterMat);
      flowerCenter.position.y = 0.04;
      lotusGroup.add(flowerCenter);

      // Petals
      for (let i = 0; i < 5; i++) {
        const pGeo = new THREE.ConeGeometry(0.05, 0.12, 4);
        pGeo.rotateX(Math.PI / 2.5);
        const pMesh = new THREE.Mesh(pGeo, petalMat);
        const ang = (i / 5) * Math.PI * 2;
        pMesh.position.set(Math.cos(ang) * 0.07, 0.03, Math.sin(ang) * 0.07);
        pMesh.rotation.y = -ang;
        lotusGroup.add(pMesh);
      }

      this.group.add(lotusGroup);
    });
  }
}
