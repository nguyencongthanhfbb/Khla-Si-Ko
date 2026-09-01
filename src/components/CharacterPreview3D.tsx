/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Tiger3D } from '../3d/Tiger3D';
import { Cow3D } from '../3d/Cow3D';
import { Board3D } from '../3d/Board3D';

interface CharacterPreview3DProps {
  type: 'TIGER' | 'COW' | 'HERO_DUO';
  className?: string;
  autoRotate?: boolean;
}

export const CharacterPreview3D: React.FC<CharacterPreview3DProps> = ({
  type,
  className = 'w-full h-44',
  autoRotate = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 300;
    const height = mount.clientHeight || 200;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // 2. Warm Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xffc078, 0.8);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // 3. Characters & Diorama Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    let tigerModel: Tiger3D | null = null;
    let cowModel: Cow3D | null = null;

    if (type === 'TIGER') {
      camera.position.set(0, 1.3, 3.2);
      camera.lookAt(0, 0.35, 0);

      tigerModel = new Tiger3D();
      tigerModel.group.position.set(0, 0, 0);
      tigerModel.group.scale.set(1.15, 1.15, 1.15);
      rootGroup.add(tigerModel.group);

      // Mini Pedestal
      const pedMat = new THREE.MeshStandardMaterial({ color: 0x5a3520, roughness: 0.6 });
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.18, 24), pedMat);
      ped.position.y = -0.09;
      ped.receiveShadow = true;
      rootGroup.add(ped);
    } else if (type === 'COW') {
      camera.position.set(0, 1.3, 3.2);
      camera.lookAt(0, 0.35, 0);

      cowModel = new Cow3D(0);
      cowModel.group.position.set(0, 0, 0);
      cowModel.group.scale.set(1.15, 1.15, 1.15);
      rootGroup.add(cowModel.group);

      // Mini Pedestal
      const pedMat = new THREE.MeshStandardMaterial({ color: 0x5a3520, roughness: 0.6 });
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.18, 24), pedMat);
      ped.position.y = -0.09;
      ped.receiveShadow = true;
      rootGroup.add(ped);
    } else {
      // HERO_DUO (Home Screen 3D Miniature Showcase with 3D Tiger, miniature board, 3D Cow)
      camera.position.set(0, 3.2, 4.4);
      camera.lookAt(0, 0.2, 0);

      // Miniature wooden board
      const miniBoardMat = new THREE.MeshStandardMaterial({ color: 0x5a3520, roughness: 0.5 });
      const miniBoard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 2.4), miniBoardMat);
      miniBoard.position.y = 0;
      miniBoard.receiveShadow = true;
      rootGroup.add(miniBoard);

      // Inner tile grid lines
      const tileMat = new THREE.MeshStandardMaterial({ color: 0xf5ebd9, roughness: 0.6 });
      const tile = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.02, 2.1), tileMat);
      tile.position.y = 0.1;
      rootGroup.add(tile);

      // 3D Tiger (positioned at top/north side of board)
      tigerModel = new Tiger3D();
      tigerModel.group.position.set(0, 0.1, -0.65);
      tigerModel.group.rotation.y = 0;
      tigerModel.group.scale.set(0.95, 0.95, 0.95);
      rootGroup.add(tigerModel.group);

      // 3D Cow (positioned at bottom/south side of board)
      cowModel = new Cow3D(1);
      cowModel.group.position.set(0, 0.1, 0.65);
      cowModel.group.rotation.y = Math.PI;
      cowModel.group.scale.set(0.95, 0.95, 0.95);
      rootGroup.add(cowModel.group);
    }

    // 4. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      tigerModel?.update(delta, false, false);
      cowModel?.update(delta, false, false);

      if (autoRotate && type === 'HERO_DUO') {
        rootGroup.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.22;
      } else if (autoRotate) {
        rootGroup.rotation.y += delta * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 5. Resize Handling
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type, autoRotate]);

  return <div ref={mountRef} className={`relative overflow-hidden rounded-2xl ${className}`} />;
};
