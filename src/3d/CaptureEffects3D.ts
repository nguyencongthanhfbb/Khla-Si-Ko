/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotVelocity: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
}

export class CaptureEffects3D {
  public group: THREE.Group;
  private particles: Particle[] = [];
  private pool: THREE.Mesh[] = [];

  private starGeo: THREE.BufferGeometry;
  private sparkGeo: THREE.BufferGeometry;
  private petalGeo: THREE.BufferGeometry;

  private mats: THREE.MeshBasicMaterial[] = [];

  constructor() {
    this.group = new THREE.Group();

    this.starGeo = new THREE.OctahedronGeometry(0.08);
    this.sparkGeo = new THREE.SphereGeometry(0.045, 6, 6);
    this.petalGeo = new THREE.ConeGeometry(0.05, 0.12, 4);

    this.mats = [
      new THREE.MeshBasicMaterial({ color: 0xffd32a }), // Warm golden yellow
      new THREE.MeshBasicMaterial({ color: 0xff4757 }), // Bright coral red
      new THREE.MeshBasicMaterial({ color: 0x2ed573 }), // Emerald green
      new THREE.MeshBasicMaterial({ color: 0xffa502 }), // Amber orange
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // Sparkle white
    ];
  }

  public spawnBurst(pos: THREE.Vector3) {
    // 18 cheerful toy starburst particles
    for (let i = 0; i < 18; i++) {
      const geo = i % 2 === 0 ? this.starGeo : this.sparkGeo;
      const mat = this.mats[i % this.mats.length];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.copy(pos);
      mesh.position.y += 0.2;

      const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 1.6 + Math.random() * 2.2;
      const vy = 2.0 + Math.random() * 2.5;

      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        vy,
        Math.sin(angle) * speed
      );

      const rotVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      );

      this.group.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        rotVelocity,
        life: 0,
        maxLife: 0.55 + Math.random() * 0.25,
        scale: 0.8 + Math.random() * 0.5,
      });
    }
  }

  public spawnPlacementSparkle(pos: THREE.Vector3) {
    // 8 gentle golden dust sparkles on placement
    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(this.sparkGeo, this.mats[0]);
      mesh.position.copy(pos);
      mesh.position.y += 0.1;

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 0.8;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        1.2 + Math.random() * 1.0,
        Math.sin(angle) * speed
      );

      const rotVelocity = new THREE.Vector3(0, 0, 0);

      this.group.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        rotVelocity,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.15,
        scale: 0.6 + Math.random() * 0.4,
      });
    }
  }

  public spawnVictoryCelebration() {
    // Confetti shower across the board
    for (let i = 0; i < 35; i++) {
      const geo = i % 3 === 0 ? this.starGeo : this.petalGeo;
      const mat = this.mats[i % this.mats.length];
      const mesh = new THREE.Mesh(geo, mat);

      const x = (Math.random() - 0.5) * 4.5;
      const z = (Math.random() - 0.5) * 4.5;
      mesh.position.set(x, 2.5 + Math.random() * 1.5, z);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        0.5 + Math.random() * 1.5,
        (Math.random() - 0.5) * 1.2
      );

      const rotVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );

      this.group.add(mesh);
      this.particles.push({
        mesh,
        velocity,
        rotVelocity,
        life: 0,
        maxLife: 1.2 + Math.random() * 0.8,
        scale: 0.9 + Math.random() * 0.4,
      });
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

      // Physics
      p.velocity.y -= 7.5 * delta; // Gravity
      p.mesh.position.addScaledVector(p.velocity, delta);

      p.mesh.rotation.x += p.rotVelocity.x * delta;
      p.mesh.rotation.y += p.rotVelocity.y * delta;
      p.mesh.rotation.z += p.rotVelocity.z * delta;

      // Scale fade
      const progress = p.life / p.maxLife;
      const s = p.scale * (1 - progress);
      p.mesh.scale.set(s, s, s);
    }
  }
}
