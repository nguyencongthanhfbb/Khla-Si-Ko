/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { assetManager } from './AssetManager';

export class DioramaEnvironment {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Khmer_Rural_Courtyard_Diorama';
    this.buildBase();
    this.loadRuralCourtyardAssets();
  }

  private buildBase() {
    // 1. Handcrafted Dark Rosewood Tabletop Base
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x381f14,
      roughness: 0.68,
      metalness: 0.04,
      flatShading: true,
    });
    const tableGeo = new THREE.CylinderGeometry(9.0, 9.4, 0.45, 36);
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.38;
    tableMesh.receiveShadow = true;
    this.group.add(tableMesh);

    // 2. Rural Courtyard Earth / Bamboo Mat Base (Warm sandstone & woven straw)
    const matGeo = new THREE.CylinderGeometry(5.4, 5.6, 0.05, 36);
    const matMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6bfa0,
      roughness: 0.88,
      metalness: 0.02,
      flatShading: true,
    });
    const matMesh = new THREE.Mesh(matGeo, matMaterial);
    matMesh.position.y = -0.15;
    matMesh.receiveShadow = true;
    this.group.add(matMesh);
  }

  private async loadRuralCourtyardAssets() {
    // 1. Small Traditional Khmer Stilt House in Background
    try {
      const house = await assetManager.getModel('/assets/game/khmer/khmer_stilt_house.glb');
      house.position.set(-0.5, -0.15, -4.8);
      house.scale.set(0.72, 0.72, 0.72);
      house.rotation.y = 0.12;
      this.group.add(house);
    } catch (err) {
      console.warn('[Diorama] Error loading stilt house:', err);
    }

    // 2. Traditional Clay Water Pots (K'am) on Wooden Stands
    const jarConfigs = [
      { x: -3.8, z: 2.6, s: 0.75, rot: 0.3 },
      { x: 3.8, z: 2.5, s: 0.72, rot: -0.4 },
      { x: -3.2, z: -2.8, s: 0.68, rot: 0.8 },
    ];

    for (const conf of jarConfigs) {
      try {
        const jar = await assetManager.getModel('/assets/game/khmer/clay_jar_kam.glb');
        jar.position.set(conf.x, -0.15, conf.z);
        jar.scale.set(conf.s, conf.s, conf.s);
        jar.rotation.y = conf.rot;
        this.group.add(jar);
      } catch (err) {
        console.warn('[Diorama] Error loading clay jar:', err);
      }
    }

    // 3. Simple Rural Wooden / Bamboo Fencing Framing the Courtyard
    const fenceConfigs = [
      { x: -2.2, z: -4.4, s: 0.82, rot: 0.05 },
      { x: 2.2, z: -4.4, s: 0.82, rot: -0.05 },
      { x: -4.4, z: -0.5, s: 0.82, rot: Math.PI / 2 },
      { x: 4.4, z: -0.5, s: 0.82, rot: -Math.PI / 2 },
    ];

    for (const conf of fenceConfigs) {
      try {
        const fence = await assetManager.getModel('/assets/game/environment/fence_simple.glb');
        fence.position.set(conf.x, -0.15, conf.z);
        fence.scale.set(conf.s, conf.s, conf.s);
        fence.rotation.y = conf.rot;
        this.group.add(fence);
      } catch (err) {
        console.warn('[Diorama] Error loading fence:', err);
      }
    }

    // 4. Kenney Nature Trees (Oak & Default) scaled to frame the courtyard
    const treeConfigs = [
      { path: '/assets/game/environment/tree_oak.glb', x: -4.5, z: -4.2, s: 0.85, rot: 0.2 },
      { path: '/assets/game/environment/tree_default.glb', x: 4.5, z: -4.3, s: 0.9, rot: -0.4 },
      { path: '/assets/game/environment/tree_default.glb', x: -4.7, z: 1.8, s: 0.75, rot: 1.1 },
      { path: '/assets/game/environment/tree_oak.glb', x: 4.6, z: 1.6, s: 0.78, rot: -0.8 },
    ];

    for (const conf of treeConfigs) {
      try {
        const tree = await assetManager.getModel(conf.path);
        tree.position.set(conf.x, -0.15, conf.z);
        tree.scale.set(conf.s, conf.s, conf.s);
        tree.rotation.y = conf.rot;
        this.group.add(tree);
      } catch (err) {
        console.warn('[Diorama] Error loading tree:', err);
      }
    }

    // 5. Rocks & Stones
    const rockConfigs = [
      { path: '/assets/game/environment/rock_largeA.glb', x: -3.8, z: -1.2, s: 0.65, rot: 0.5 },
      { path: '/assets/game/environment/rock_smallA.glb', x: 3.7, z: -1.1, s: 0.75, rot: -0.3 },
      { path: '/assets/game/environment/rock_smallA.glb', x: -3.4, z: 3.4, s: 0.7, rot: 1.2 },
      { path: '/assets/game/environment/rock_largeA.glb', x: 3.6, z: 3.2, s: 0.6, rot: -1.0 },
    ];

    for (const conf of rockConfigs) {
      try {
        const rock = await assetManager.getModel(conf.path);
        rock.position.set(conf.x, -0.15, conf.z);
        rock.scale.set(conf.s, conf.s, conf.s);
        rock.rotation.y = conf.rot;
        this.group.add(rock);
      } catch (err) {
        console.warn('[Diorama] Error loading rock:', err);
      }
    }

    // 6. Flora, Bushes & Subtle Lotus-Pink Flowers
    const floraConfigs = [
      { path: '/assets/game/environment/plant_bush.glb', x: -3.2, z: -3.6, s: 0.7 },
      { path: '/assets/game/environment/plant_bush.glb', x: 3.2, z: -3.6, s: 0.7 },
      { path: '/assets/game/environment/flower_redA.glb', x: -2.8, z: 3.6, s: 0.9 },
      { path: '/assets/game/environment/flower_yellowA.glb', x: 2.8, z: 3.6, s: 0.9 },
      { path: '/assets/game/environment/grass.glb', x: -3.5, z: 0.4, s: 1.0 },
      { path: '/assets/game/environment/grass.glb', x: 3.5, z: 0.4, s: 1.0 },
      { path: '/assets/game/environment/flower_redA.glb', x: -1.5, z: -3.8, s: 0.8 },
      { path: '/assets/game/environment/flower_yellowA.glb', x: 1.5, z: -3.8, s: 0.8 },
    ];

    for (const conf of floraConfigs) {
      try {
        const flora = await assetManager.getModel(conf.path);
        flora.position.set(conf.x, -0.15, conf.z);
        flora.scale.set(conf.s, conf.s, conf.s);
        this.group.add(flora);
      } catch (err) {
        console.warn('[Diorama] Error loading flora:', err);
      }
    }
  }
}
