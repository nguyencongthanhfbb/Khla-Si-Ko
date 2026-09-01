/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { assetManager } from './AssetManager';
import { KhmerStiltHouse3D } from './KhmerDecor3D';
import { VisualStyle } from '../game/types';

export class DioramaEnvironment {
  public group: THREE.Group;
  public house: KhmerStiltHouse3D;
  private tableMat!: THREE.MeshStandardMaterial;
  private matMaterial!: THREE.MeshStandardMaterial;
  private loadedAssets: THREE.Object3D[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Khmer_Rural_Courtyard_Diorama';
    this.buildBase();
    this.house = new KhmerStiltHouse3D();
    this.setupKhmerHouse();
    this.loadRuralCourtyardAssets();
  }

  private buildBase() {
    // 1. Handcrafted Dark Rosewood Tabletop Base
    this.tableMat = new THREE.MeshStandardMaterial({
      color: 0x351d13,
      roughness: 0.68,
      metalness: 0.04,
      flatShading: true,
    });
    const tableGeo = new THREE.CylinderGeometry(9.6, 10.0, 0.45, 36);
    const tableMesh = new THREE.Mesh(tableGeo, this.tableMat);
    tableMesh.position.y = -0.38;
    tableMesh.receiveShadow = true;
    this.group.add(tableMesh);

    // 2. Rural Courtyard Earth / Woven Straw Base (Warm sandstone & natural clay tone)
    const matGeo = new THREE.CylinderGeometry(5.8, 6.0, 0.05, 36);
    this.matMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6bfa0,
      roughness: 0.88,
      metalness: 0.02,
      flatShading: true,
    });
    const matMesh = new THREE.Mesh(matGeo, this.matMaterial);
    matMesh.position.y = -0.15;
    matMesh.receiveShadow = true;
    this.group.add(matMesh);
  }

  public setVisualStyle(style: VisualStyle) {
    if (style === 'CUBE_PETS') {
      this.tableMat.color.setHex(0x351d13);
      this.tableMat.roughness = 0.68;
      this.matMaterial.color.setHex(0xd6bfa0);
    } else if (style === 'SOFT_CHIBI') {
      this.tableMat.color.setHex(0x42291d);
      this.tableMat.roughness = 0.82;
      this.matMaterial.color.setHex(0xe5d4be);
    } else if (style === 'KHMER_WOODEN') {
      this.tableMat.color.setHex(0x28140c);
      this.tableMat.roughness = 0.45;
      this.matMaterial.color.setHex(0xc9ab85);
    }
    this.tableMat.needsUpdate = true;
    this.matMaterial.needsUpdate = true;
  }

  private setupKhmerHouse() {
    // Traditional Khmer Stilt House in Background
    // Elevated and scaled so its roof silhouette and stilts are clearly visible in gameplay view
    this.house.position.set(0, -0.15, -4.3);
    this.house.scale.set(0.95, 0.95, 0.95);
    this.house.rotation.y = 0.08;
    this.group.add(this.house);
  }

  private async loadRuralCourtyardAssets() {
    // 1. Traditional Clay Water Pots (K'am) on Wooden Stands
    const jarConfigs = [
      { x: -3.6, z: 2.4, s: 0.8, rot: 0.3 },
      { x: 3.6, z: 2.3, s: 0.75, rot: -0.4 },
      { x: -3.2, z: -2.6, s: 0.72, rot: 0.8 },
      { x: 2.8, z: -3.8, s: 0.7, rot: -0.2 },
    ];

    for (const conf of jarConfigs) {
      try {
        let jar = await assetManager.getModel('/assets/game/khmer/clay_jar_kam.glb');
        if (!jar) {
          jar = await assetManager.getModel('/assets/khmer/architecture/clay_jar_kam.glb');
        }
        if (jar) {
          jar.position.set(conf.x, -0.15, conf.z);
          jar.scale.set(conf.s, conf.s, conf.s);
          jar.rotation.y = conf.rot;
          this.group.add(jar);
        }
      } catch (err) {
        console.warn('[Diorama] Error loading clay jar:', err);
      }
    }

    // 2. Real Kenney Mini-Forest Wooden / Bamboo Fencing Framing the Courtyard
    const fenceConfigs = [
      { x: -2.2, z: -4.3, s: 0.85, rot: 0.05 },
      { x: 2.2, z: -4.3, s: 0.85, rot: -0.05 },
      { x: -4.5, z: -0.5, s: 0.85, rot: Math.PI / 2 },
      { x: 4.5, z: -0.5, s: 0.85, rot: -Math.PI / 2 },
      { x: -3.8, z: 2.8, s: 0.85, rot: Math.PI / 4 },
      { x: 3.8, z: 2.8, s: 0.85, rot: -Math.PI / 4 },
    ];

    for (const conf of fenceConfigs) {
      try {
        let fence = await assetManager.getModel('/assets/vendor/kenney/mini-forest/fence_simple.glb');
        if (!fence) {
          fence = await assetManager.getModel('/assets/vendor/kenney/nature/fence.glb');
        }
        if (fence) {
          fence.position.set(conf.x, -0.15, conf.z);
          fence.scale.set(conf.s, conf.s, conf.s);
          fence.rotation.y = conf.rot;
          this.group.add(fence);
        }
      } catch (err) {
        console.warn('[Diorama] Error loading fence:', err);
      }
    }

    // 3. Real Kenney Nature Trees (Oak & Default) framing the background & courtyard
    const treeConfigs = [
      { path: '/assets/vendor/kenney/mini-forest/tree_oak.glb', x: -4.6, z: -4.0, s: 0.9, rot: 0.2 },
      { path: '/assets/vendor/kenney/mini-forest/tree_default.glb', x: 4.6, z: -4.1, s: 0.95, rot: -0.4 },
      { path: '/assets/vendor/kenney/mini-forest/tree_default.glb', x: -4.8, z: 1.6, s: 0.8, rot: 1.1 },
      { path: '/assets/vendor/kenney/mini-forest/tree_oak.glb', x: 4.8, z: 1.4, s: 0.82, rot: -0.8 },
    ];

    for (const conf of treeConfigs) {
      try {
        const tree = await assetManager.getModel(conf.path);
        if (tree) {
          tree.position.set(conf.x, -0.15, conf.z);
          tree.scale.set(conf.s, conf.s, conf.s);
          tree.rotation.y = conf.rot;
          this.group.add(tree);
        }
      } catch (err) {
        console.warn('[Diorama] Error loading tree:', err);
      }
    }

    // 4. Real Kenney Mini-Forest Rocks & Stones
    const rockConfigs = [
      { path: '/assets/vendor/kenney/mini-forest/rock_largeA.glb', x: -3.8, z: -1.2, s: 0.7, rot: 0.5 },
      { path: '/assets/vendor/kenney/mini-forest/rock_smallA.glb', x: 3.8, z: -1.1, s: 0.8, rot: -0.3 },
      { path: '/assets/vendor/kenney/mini-forest/rock_smallA.glb', x: -3.4, z: 3.4, s: 0.75, rot: 1.2 },
      { path: '/assets/vendor/kenney/mini-forest/rock_largeA.glb', x: 3.6, z: 3.2, s: 0.65, rot: -1.0 },
    ];

    for (const conf of rockConfigs) {
      try {
        const rock = await assetManager.getModel(conf.path);
        if (rock) {
          rock.position.set(conf.x, -0.15, conf.z);
          rock.scale.set(conf.s, conf.s, conf.s);
          rock.rotation.y = conf.rot;
          this.group.add(rock);
        }
      } catch (err) {
        console.warn('[Diorama] Error loading rock:', err);
      }
    }

    // 5. Real Kenney Nature Flora, Bushes, Grass & Flowers
    const floraConfigs = [
      { path: '/assets/vendor/kenney/mini-forest/plant_bush.glb', x: -3.2, z: -3.5, s: 0.75 },
      { path: '/assets/vendor/kenney/mini-forest/plant_bush.glb', x: 3.2, z: -3.5, s: 0.75 },
      { path: '/assets/vendor/kenney/mini-forest/flower_redA.glb', x: -2.8, z: 3.5, s: 0.95 },
      { path: '/assets/vendor/kenney/mini-forest/flower_yellowA.glb', x: 2.8, z: 3.5, s: 0.95 },
      { path: '/assets/vendor/kenney/mini-forest/grass.glb', x: -3.5, z: 0.4, s: 1.1 },
      { path: '/assets/vendor/kenney/mini-forest/grass.glb', x: 3.5, z: 0.4, s: 1.1 },
      { path: '/assets/vendor/kenney/mini-forest/flower_redA.glb', x: -1.8, z: -3.6, s: 0.85 },
      { path: '/assets/vendor/kenney/mini-forest/flower_yellowA.glb', x: 1.8, z: -3.6, s: 0.85 },
    ];

    for (const conf of floraConfigs) {
      try {
        const flora = await assetManager.getModel(conf.path);
        if (flora) {
          flora.position.set(conf.x, -0.15, conf.z);
          flora.scale.set(conf.s, conf.s, conf.s);
          this.group.add(flora);
        }
      } catch (err) {
        console.warn('[Diorama] Error loading flora:', err);
      }
    }
  }
}
