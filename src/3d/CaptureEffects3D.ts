/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class CaptureEffects3D {
  public group: THREE.Group;
  private particles: Particle[] = [];
  private starGeometry: THREE.BufferGeometry;
  private particleMaterials: THREE.MeshBasicMaterial[];

  constructor() {
    this.group = new THREE.Group();

    // Octahedron/Star shapes
    this.starGeometry = new THREE.OctahedronGeometry(0.08);

    this.particleMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xffd32a }), // Gold
      new THREE.MeshBasicMaterial({ color: 0xff4757 }), // Red/Coral
      new THREE.MeshBasicMaterial({ color: 0x70a1ff }), // Soft Blue
      new THREE.MeshBasicMaterial({ color: 0x2ed573 }), // Green
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // Sparkle White
    ];
  }

  public spawnBurst(pos: THREE.Vector3) {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const mat = this.particleMaterials[Math.floor(Math.random() * this.particleMaterials.length)];
      const mesh = new THREE.Mesh(this.starGeometry, mat);

      mesh.position.copy(pos);
      mesh.position.y += 0.4 + (Math.random() - 0.5) * 0.2;

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 1.2 + Math.random() * 1.8;
      const upSpeed = 1.8 + Math.random() * 1.5;

      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        upSpeed,
        Math.sin(angle) * speed
      );

      const rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      const particle: Particle = {
        mesh,
        velocity,
        rotSpeed,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
      };

      this.particles.push(particle);
      this.group.add(mesh);
    }
  }

  public update(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        this.group.remove(p.mesh);
        this.particles.splice(i, 1);
        continue;
      }

      // Physics update
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= 7.5 * delta; // Gravity

      p.mesh.rotation.x += p.rotSpeed.x * delta;
      p.mesh.rotation.y += p.rotSpeed.y * delta;
      p.mesh.rotation.z += p.rotSpeed.z * delta;

      // Scale fade
      const progress = p.life / p.maxLife;
      const scale = Math.max(0.001, (1 - progress) * 1.2);
      p.mesh.scale.set(scale, scale, scale);
    }
  }
}
