/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class AssetManager {
  private static instance: AssetManager | null = null;
  private loader: GLTFLoader;
  private cache: Map<string, GLTF> = new Map();
  private loadingPromises: Map<string, Promise<GLTF>> = new Map();

  private constructor() {
    this.loader = new GLTFLoader();
  }

  public static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  /**
   * Load and cache a GLB / glTF model
   */
  public async loadModel(url: string): Promise<GLTF> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = new Promise<GLTF>((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          this.cache.set(url, gltf);
          this.loadingPromises.delete(url);
          resolve(gltf);
        },
        undefined,
        (err) => {
          console.warn(`[AssetManager] Failed to load model at ${url}:`, err);
          this.loadingPromises.delete(url);
          reject(err);
        }
      );
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  /**
   * Clone a cached model with clean mesh clones and shadow enabling
   */
  public async getModel(url: string): Promise<THREE.Group> {
    const gltf = await this.loadModel(url);
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }
      }
    });
    return clone;
  }

  /**
   * Synchronously clone from cache if already loaded
   */
  public getModelSync(url: string): THREE.Group | null {
    const gltf = this.cache.get(url);
    if (!gltf) return null;
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }
      }
    });
    return clone;
  }

  /**
   * Preload critical game assets
   */
  public async preloadAll(): Promise<void> {
    const urls = [
      '/assets/characters/cow/cow.glb',
      '/assets/characters/tiger/tiger.glb',
      '/assets/environment/nature/tree_oak.glb',
      '/assets/environment/nature/tree_default.glb',
      '/assets/environment/nature/rock_largeA.glb',
      '/assets/environment/nature/rock_smallA.glb',
      '/assets/environment/nature/plant_bush.glb',
      '/assets/environment/nature/flower_redA.glb',
      '/assets/environment/nature/flower_yellowA.glb',
      '/assets/environment/nature/grass.glb',
      '/assets/environment/nature/fence_simple.glb',
      '/assets/khmer/architecture/khmer_pavilion.glb',
      '/assets/khmer/architecture/clay_jar_kam.glb',
      '/assets/khmer/ornaments/lotus_finial.glb',
      '/assets/khmer/ornaments/naga_ornament.glb',
    ];

    await Promise.allSettled(urls.map((u) => this.loadModel(u)));
    console.log('[AssetManager] Preload finished for all 15 models.');
  }

  /**
   * Clear cache
   */
  public clear(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

export const assetManager = AssetManager.getInstance();
