/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { assetManager } from './AssetManager';
import { KhmerRoofMiniature3D, KhmerGardenProps3D } from './KhmerDecor3D';

export class DioramaEnvironment {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.buildBase();
    this.loadRealAssets();
  }

  private buildBase() {
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
  }

  private async loadRealAssets() {
    // 1. Khmer Pavilions & Clay Jars
    try {
      const pavL = await assetManager.getModel('/assets/khmer/architecture/khmer_pavilion.glb');
      pavL.position.set(-4.5, -0.15, -2.6);
      pavL.scale.set(0.72, 0.72, 0.72);
      pavL.rotation.y = 0.45;
      this.group.add(pavL);

      const pavR = await assetManager.getModel('/assets/khmer/architecture/khmer_pavilion.glb');
      pavR.position.set(4.5, -0.15, -2.5);
      pavR.scale.set(0.72, 0.72, 0.72);
      pavR.rotation.y = -0.45;
      this.group.add(pavR);
    } catch {
      // Fallback
      const pavL = new KhmerRoofMiniature3D();
      pavL.position.set(-4.5, -0.15, -2.6);
      pavL.scale.set(0.72, 0.72, 0.72);
      this.group.add(pavL);
    }

    try {
      const jar1 = await assetManager.getModel('/assets/khmer/architecture/clay_jar_kam.glb');
      jar1.position.set(-4.2, -0.15, 2.8);
      jar1.scale.set(0.75, 0.75, 0.75);
      this.group.add(jar1);

      const jar2 = await assetManager.getModel('/assets/khmer/architecture/clay_jar_kam.glb');
      jar2.position.set(4.2, -0.15, 2.7);
      jar2.scale.set(0.75, 0.75, 0.75);
      this.group.add(jar2);
    } catch {
      const jar1 = new KhmerGardenProps3D();
      jar1.position.set(-4.2, -0.15, 2.8);
      this.group.add(jar1);
    }

    // 2. Kenney Nature Kit Trees (Tree Oak & Tree Default)
    const treeConfigs = [
      { path: '/assets/environment/nature/tree_oak.glb', x: -4.3, z: -4.2, s: 0.95, rot: 0.2 },
      { path: '/assets/environment/nature/tree_default.glb', x: 4.3, z: -4.3, s: 1.05, rot: -0.4 },
      { path: '/assets/environment/nature/tree_default.glb', x: -4.6, z: 1.2, s: 0.85, rot: 1.1 },
      { path: '/assets/environment/nature/tree_oak.glb', x: 4.6, z: 1.1, s: 0.88, rot: -0.8 },
    ];

    for (const conf of treeConfigs) {
      try {
        const tree = await assetManager.getModel(conf.path);
        tree.position.set(conf.x, -0.15, conf.z);
        tree.scale.set(conf.s, conf.s, conf.s);
        tree.rotation.y = conf.rot;
        this.group.add(tree);
      } catch (e) {
        console.warn('Fallback tree for', conf.path);
      }
    }

    // 3. Kenney Nature Kit Rocks (Rock Large & Rock Small)
    const rockConfigs = [
      { path: '/assets/environment/nature/rock_largeA.glb', x: -3.8, z: -1.2, s: 0.7, rot: 0.5 },
      { path: '/assets/environment/nature/rock_smallA.glb', x: 3.8, z: -1.1, s: 0.85, rot: -0.3 },
      { path: '/assets/environment/nature/rock_smallA.glb', x: -3.6, z: 2.1, s: 0.75, rot: 1.2 },
      { path: '/assets/environment/nature/rock_largeA.glb', x: 3.7, z: 2.2, s: 0.65, rot: -1.0 },
    ];

    for (const conf of rockConfigs) {
      try {
        const rock = await assetManager.getModel(conf.path);
        rock.position.set(conf.x, -0.15, conf.z);
        rock.scale.set(conf.s, conf.s, conf.s);
        rock.rotation.y = conf.rot;
        this.group.add(rock);
      } catch (e) {
        console.warn('Fallback rock for', conf.path);
      }
    }

    // 4. Kenney Nature Kit Bushes & Flowers
    const floraConfigs = [
      { path: '/assets/environment/nature/plant_bush.glb', x: -3.2, z: -3.8, s: 0.8 },
      { path: '/assets/environment/nature/plant_bush.glb', x: 3.2, z: -3.8, s: 0.8 },
      { path: '/assets/environment/nature/flower_redA.glb', x: -2.8, z: 3.6, s: 1.0 },
      { path: '/assets/environment/nature/flower_yellowA.glb', x: 2.8, z: 3.6, s: 1.0 },
      { path: '/assets/environment/nature/grass.glb', x: -3.5, z: 0.2, s: 1.2 },
      { path: '/assets/environment/nature/grass.glb', x: 3.5, z: 0.2, s: 1.2 },
    ];

    for (const conf of floraConfigs) {
      try {
        const flora = await assetManager.getModel(conf.path);
        flora.position.set(conf.x, -0.15, conf.z);
        flora.scale.set(conf.s, conf.s, conf.s);
        this.group.add(flora);
      } catch (e) {
        console.warn('Fallback flora for', conf.path);
      }
    }

    // 5. Kenney Nature Kit Fences
    const fenceConfigs = [
      { path: '/assets/environment/nature/fence_simple.glb', x: -1.8, z: -4.5, s: 0.8, rot: 0 },
      { path: '/assets/environment/nature/fence_simple.glb', x: 1.8, z: -4.5, s: 0.8, rot: 0 },
      { path: '/assets/environment/nature/fence_simple.glb', x: -1.8, z: 4.5, s: 0.8, rot: Math.PI },
      { path: '/assets/environment/nature/fence_simple.glb', x: 1.8, z: 4.5, s: 0.8, rot: Math.PI },
    ];

    for (const conf of fenceConfigs) {
      try {
        const fence = await assetManager.getModel(conf.path);
        fence.position.set(conf.x, -0.15, conf.z);
        fence.scale.set(conf.s, conf.s, conf.s);
        fence.rotation.y = conf.rot;
        this.group.add(fence);
      } catch (e) {
        console.warn('Fallback fence for', conf.path);
      }
    }
  }
}
