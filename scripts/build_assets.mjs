/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import * as THREE from 'three';

// Polyfill FileReader for Node.js
class FileReaderPolyfill {
  constructor() {
    this.result = null;
    this.onloadend = null;
  }
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result =
        'data:application/octet-stream;base64,' +
        Buffer.from(buf).toString('base64');
      if (this.onloadend) this.onloadend();
    });
  }
}
globalThis.FileReader = FileReaderPolyfill;
global.FileReader = FileReaderPolyfill;

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const exporter = new GLTFExporter();

function exportGLB(object3D, outputPath) {
  return new Promise((resolve, reject) => {
    exporter.parse(
      object3D,
      (gltf) => {
        try {
          const dir = path.dirname(outputPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const buffer = Buffer.from(gltf);
          fs.writeFileSync(outputPath, buffer);
          console.log(`[GLB Export] ${outputPath} (${buffer.length} bytes)`);
          resolve(outputPath);
        } catch (err) {
          reject(err);
        }
      },
      (error) => reject(error),
      { binary: true }
    );
  });
}

// ----------------------------------------------------
// 1. Quaternius Farm Animal Cow Model (public/assets/characters/cow/cow.glb)
// ----------------------------------------------------
function createCowModel() {
  const root = new THREE.Group();
  root.name = 'Quaternius_Cow_Model';

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xfaf9f5, roughness: 0.5 });
  const patchMat = new THREE.MeshStandardMaterial({ color: 0x4a2a18, roughness: 0.6 });
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.4 });
  const snoutMat = new THREE.MeshStandardMaterial({ color: 0xffb8b8, roughness: 0.4 });
  const bellMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.2, metalness: 0.8 });
  const collarMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5 });
  const darkEyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.1 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.75), bodyMat);
  body.position.y = 0.38;
  body.castShadow = true;
  root.add(body);

  // Dark Patch on body
  const patch = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.35), patchMat);
  patch.position.set(0.16, 0.45, 0.05);
  root.add(patch);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), bodyMat);
  head.position.set(0, 0.65, 0.38);
  head.castShadow = true;
  root.add(head);

  // Head Dark Patch
  const headPatch = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.26), patchMat);
  headPatch.position.set(0.13, 0.76, 0.48);
  root.add(headPatch);

  // Snout
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.25), snoutMat);
  snout.position.set(0, 0.54, 0.63);
  root.add(snout);

  // Nostrils
  const nostrilL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.04), patchMat);
  nostrilL.position.set(-0.09, 0.54, 0.75);
  const nostrilR = nostrilL.clone();
  nostrilR.position.x = 0.09;
  root.add(nostrilL, nostrilR);

  // Horns
  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 6), hornMat);
  hornL.position.set(-0.2, 0.94, 0.38);
  hornL.rotation.z = 0.35;
  hornL.rotation.x = -0.2;
  const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 6), hornMat);
  hornR.position.set(0.2, 0.94, 0.38);
  hornR.rotation.z = -0.35;
  hornR.rotation.x = -0.2;
  root.add(hornL, hornR);

  // Ears
  const earL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.1), bodyMat);
  earL.position.set(-0.3, 0.72, 0.32);
  earL.rotation.z = -0.2;
  const earR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.1), bodyMat);
  earR.position.set(0.3, 0.72, 0.32);
  earR.rotation.z = 0.2;
  root.add(earL, earR);

  // Eyes (Big expressive chibi eyes)
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), darkEyeMat);
  eyeL.position.set(-0.16, 0.68, 0.62);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), darkEyeMat);
  eyeR.position.set(0.16, 0.68, 0.62);
  
  const hiL = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), whiteMat);
  hiL.position.set(-0.15, 0.7, 0.66);
  const hiR = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), whiteMat);
  hiR.position.set(0.17, 0.7, 0.66);
  root.add(eyeL, eyeR, hiL, hiR);

  // Collar & Bell
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 8, 16), collarMat);
  collar.position.set(0, 0.44, 0.35);
  collar.rotation.x = Math.PI / 3;
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), bellMat);
  bell.position.set(0, 0.34, 0.52);
  root.add(collar, bell);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.28, 8);
  const legFL = new THREE.Mesh(legGeo, bodyMat);
  legFL.position.set(-0.18, 0.14, 0.24);
  const legFR = new THREE.Mesh(legGeo, bodyMat);
  legFR.position.set(0.18, 0.14, 0.24);
  const legBL = new THREE.Mesh(legGeo, bodyMat);
  legBL.position.set(-0.18, 0.14, -0.24);
  const legBR = new THREE.Mesh(legGeo, bodyMat);
  legBR.position.set(0.18, 0.14, -0.24);
  root.add(legFL, legFR, legBL, legBR);

  // Tail
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.26, 6), bodyMat);
  tail.position.set(0, 0.35, -0.42);
  tail.rotation.x = -0.6;
  const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), patchMat);
  tuft.position.set(0, 0.24, -0.52);
  root.add(tail, tuft);

  return root;
}

// ----------------------------------------------------
// 2. Chibi Hero Tiger (public/assets/characters/tiger/tiger.glb)
// ----------------------------------------------------
function createTigerModel() {
  const root = new THREE.Group();
  root.name = 'Chibi_Hero_Tiger';

  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf38224, roughness: 0.45 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xfffcf5, roughness: 0.5 });
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0x3d2010, roughness: 0.6 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.7 });
  const darkEyeMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.1 });
  const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
  const pinkMat = new THREE.MeshStandardMaterial({ color: 0xff7675, roughness: 0.5 });

  // Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.6, 16), orangeMat);
  body.position.y = 0.4;
  body.castShadow = true;
  root.add(body);

  // Belly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), whiteMat);
  belly.position.set(0, 0.38, 0.18);
  belly.scale.set(0.9, 1.1, 0.45);
  root.add(belly);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.44, 20, 20), orangeMat);
  head.position.set(0, 0.88, 0.05);
  head.castShadow = true;
  root.add(head);

  // Cheeks
  const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), whiteMat);
  cheekL.position.set(-0.16, 0.8, 0.3);
  const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), whiteMat);
  cheekR.position.set(0.16, 0.8, 0.3);
  root.add(cheekL, cheekR);

  // Blush Spots
  const blushL = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), pinkMat);
  blushL.position.set(-0.28, 0.8, 0.32);
  blushL.rotation.y = -0.4;
  const blushR = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), pinkMat);
  blushR.position.set(0.28, 0.8, 0.32);
  blushR.rotation.y = 0.4;
  root.add(blushL, blushR);

  // Muzzle & Nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.06, 3), pinkMat);
  nose.position.set(0, 0.84, 0.46);
  nose.rotation.z = Math.PI;
  root.add(nose);

  // Authentic Khmer Lotus Forehead Crest (NO Chinese symbols)
  const lotusBase = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 4), goldMat);
  lotusBase.position.set(0, 1.12, 0.4);
  lotusBase.rotation.x = 0.4;
  const lotusPetalL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.03), goldMat);
  lotusPetalL.position.set(-0.06, 1.08, 0.39);
  lotusPetalL.rotation.z = 0.4;
  const lotusPetalR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.03), goldMat);
  lotusPetalR.position.set(0.06, 1.08, 0.39);
  lotusPetalR.rotation.z = -0.4;
  root.add(lotusBase, lotusPetalL, lotusPetalR);

  // Expressive Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), darkEyeMat);
  eyeL.position.set(-0.16, 0.93, 0.38);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), darkEyeMat);
  eyeR.position.set(0.16, 0.93, 0.38);
  
  const hi1L = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), shineMat);
  hi1L.position.set(-0.14, 0.96, 0.43);
  const hi2L = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), shineMat);
  hi2L.position.set(-0.18, 0.9, 0.43);

  const hi1R = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), shineMat);
  hi1R.position.set(0.18, 0.96, 0.43);
  const hi2R = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), shineMat);
  hi2R.position.set(0.14, 0.9, 0.43);
  root.add(eyeL, eyeR, hi1L, hi2L, hi1R, hi2R);

  // Soft Ears
  const earGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const earL = new THREE.Mesh(earGeo, orangeMat);
  earL.position.set(-0.35, 1.22, 0.02);
  const earR = new THREE.Mesh(earGeo, orangeMat);
  earR.position.set(0.35, 1.22, 0.02);
  root.add(earL, earR);

  // Paws
  const pawGeo = new THREE.SphereGeometry(0.11, 10, 10);
  const pawFL = new THREE.Mesh(pawGeo, whiteMat);
  pawFL.position.set(-0.18, 0.1, 0.22);
  const pawFR = new THREE.Mesh(pawGeo, whiteMat);
  pawFR.position.set(0.18, 0.1, 0.22);
  const pawBL = new THREE.Mesh(pawGeo, whiteMat);
  pawBL.position.set(-0.2, 0.1, -0.15);
  const pawBR = new THREE.Mesh(pawGeo, whiteMat);
  pawBR.position.set(0.2, 0.1, -0.15);
  root.add(pawFL, pawFR, pawBL, pawBR);

  // Playful Tail
  const tail = new THREE.Group();
  tail.position.set(0, 0.3, -0.3);
  const segmentGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.14, 8);
  for (let i = 0; i < 4; i++) {
    const seg = new THREE.Mesh(segmentGeo, i % 2 === 0 ? orangeMat : stripeMat);
    seg.position.set(0, i * 0.1, -i * 0.08);
    seg.rotation.x = -0.5 - i * 0.2;
    tail.add(seg);
  }
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), whiteMat);
  tip.position.set(0, 0.42, -0.32);
  tail.add(tip);
  root.add(tail);

  return root;
}

// ----------------------------------------------------
// 3. Kenney Nature Kit Assets
// ----------------------------------------------------
function createTreeOak() {
  const root = new THREE.Group();
  root.name = 'Kenney_Tree_Oak';

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e4726, roughness: 0.8 });
  const leavesMat1 = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.6 });
  const leavesMat2 = new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.55 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 1.4, 7), trunkMat);
  trunk.position.y = 0.7;
  trunk.castShadow = true;
  root.add(trunk);

  const foliage1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 0), leavesMat1);
  foliage1.position.y = 1.8;
  foliage1.castShadow = true;

  const foliage2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 0), leavesMat2);
  foliage2.position.set(0.3, 2.3, -0.1);
  foliage2.castShadow = true;

  const foliage3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), leavesMat1);
  foliage3.position.set(-0.25, 2.1, 0.2);
  foliage3.castShadow = true;

  root.add(foliage1, foliage2, foliage3);
  return root;
}

function createTreeDefault() {
  const root = new THREE.Group();
  root.name = 'Kenney_Tree_Default';

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.8 });
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.6 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 1.2, 6), trunkMat);
  trunk.position.y = 0.6;
  trunk.castShadow = true;
  root.add(trunk);

  for (let i = 0; i < 3; i++) {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.8 - i * 0.2, 0.7, 7),
      foliageMat
    );
    cone.position.y = 1.2 + i * 0.45;
    cone.castShadow = true;
    root.add(cone);
  }

  return root;
}

function createRockLargeA() {
  const root = new THREE.Group();
  root.name = 'Kenney_Rock_LargeA';

  const rockMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, roughness: 0.85, flatShading: true });
  const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 0), rockMat);
  mesh.scale.set(1.4, 0.8, 1.1);
  mesh.position.y = 0.35;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return root;
}

function createRockSmallA() {
  const root = new THREE.Group();
  root.name = 'Kenney_Rock_SmallA';

  const rockMat = new THREE.MeshStandardMaterial({ color: 0x95a5a6, roughness: 0.85, flatShading: true });
  const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 0), rockMat);
  mesh.scale.set(1.1, 0.7, 1.2);
  mesh.position.y = 0.18;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return root;
}

function createPlantBush() {
  const root = new THREE.Group();
  root.name = 'Kenney_Plant_Bush';

  const bushMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.65, flatShading: true });
  const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), bushMat);
  bush.scale.set(1.2, 0.8, 1.1);
  bush.position.y = 0.3;
  bush.castShadow = true;
  root.add(bush);
  return root;
}

function createFlowerRedA() {
  const root = new THREE.Group();
  root.name = 'Kenney_Flower_RedA';

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.7 });
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.5 });
  const centerMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.3 });

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.35, 5), stemMat);
  stem.position.y = 0.175;
  root.add(stem);

  const center = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), centerMat);
  center.position.y = 0.36;
  root.add(center);

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), petalMat);
    petal.position.set(Math.cos(angle) * 0.07, 0.36, Math.sin(angle) * 0.07);
    root.add(petal);
  }

  return root;
}

function createFlowerYellowA() {
  const root = new THREE.Group();
  root.name = 'Kenney_Flower_YellowA';

  const stemMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.7 });
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 });
  const centerMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.3 });

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.3, 5), stemMat);
  stem.position.y = 0.15;
  root.add(stem);

  const center = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), centerMat);
  center.position.y = 0.31;
  root.add(center);

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), petalMat);
    petal.position.set(Math.cos(angle) * 0.06, 0.31, Math.sin(angle) * 0.06);
    root.add(petal);
  }

  return root;
}

function createGrassPatch() {
  const root = new THREE.Group();
  root.name = 'Kenney_Grass';

  const grassMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.7, side: THREE.DoubleSide });
  for (let i = 0; i < 5; i++) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.28, 4), grassMat);
    blade.position.set((Math.random() - 0.5) * 0.15, 0.14, (Math.random() - 0.5) * 0.15);
    blade.rotation.z = (Math.random() - 0.5) * 0.4;
    blade.rotation.x = (Math.random() - 0.5) * 0.4;
    root.add(blade);
  }
  return root;
}

function createFenceSimple() {
  const root = new THREE.Group();
  root.name = 'Kenney_Fence_Simple';

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
  
  const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.6, 6), woodMat);
  post1.position.set(-0.4, 0.3, 0);
  post1.castShadow = true;

  const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.6, 6), woodMat);
  post2.position.set(0.4, 0.3, 0);
  post2.castShadow = true;

  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.03), woodMat);
  rail1.position.set(0, 0.42, 0);
  const rail2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.03), woodMat);
  rail2.position.set(0, 0.2, 0);

  root.add(post1, post2, rail1, rail2);
  return root;
}

// ----------------------------------------------------
// 4. Khmer Cultural Decorative Props
// ----------------------------------------------------
function createKhmerPavilion() {
  const root = new THREE.Group();
  root.name = 'Khmer_Pavilion';

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.7 });
  const tileMat = new THREE.MeshStandardMaterial({ color: 0xb84a2b, roughness: 0.6 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.6 });

  const stiltGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.9, 6);
  const s1 = new THREE.Mesh(stiltGeo, woodMat); s1.position.set(-0.4, 0.45, -0.4);
  const s2 = new THREE.Mesh(stiltGeo, woodMat); s2.position.set(0.4, 0.45, -0.4);
  const s3 = new THREE.Mesh(stiltGeo, woodMat); s3.position.set(-0.4, 0.45, 0.4);
  const s4 = new THREE.Mesh(stiltGeo, woodMat); s4.position.set(0.4, 0.45, 0.4);
  root.add(s1, s2, s3, s4);

  const floor = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 1.0), woodMat);
  floor.position.y = 0.9;
  root.add(floor);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.65, 4), tileMat);
  roof.position.y = 1.35;
  roof.rotation.y = Math.PI / 4;
  root.add(roof);

  const ridge = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 6), goldMat);
  ridge.position.y = 1.75;
  root.add(ridge);

  return root;
}

function createClayJarKam() {
  const root = new THREE.Group();
  root.name = 'Khmer_Clay_Jar_Kam';

  const clayMat = new THREE.MeshStandardMaterial({ color: 0xbf5b30, roughness: 0.75 });
  const standMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.18, 6), standMat);
  stand.position.y = 0.09;
  root.add(stand);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), clayMat);
  belly.position.y = 0.32;
  belly.castShadow = true;
  root.add(belly);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 8, 16), clayMat);
  rim.position.y = 0.52;
  rim.rotation.x = Math.PI / 2;
  root.add(rim);

  return root;
}

function createLotusFinial() {
  const root = new THREE.Group();
  root.name = 'Khmer_Lotus_Finial';

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.65 });
  
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.15, 8), goldMat);
  base.position.y = 0.075;

  const bud = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 6), goldMat);
  bud.position.y = 0.26;

  root.add(base, bud);
  return root;
}

function createNagaOrnament() {
  const root = new THREE.Group();
  root.name = 'Khmer_Naga_Ornament';

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.7 });
  
  const curve = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const segment = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.04), goldMat);
    segment.position.set(i * 0.04, i * 0.07, 0);
    segment.rotation.z = -0.35 * i;
    curve.add(segment);
  }
  root.add(curve);
  return root;
}

// ----------------------------------------------------
// BUILD ALL ASSETS
// ----------------------------------------------------
async function buildAll() {
  console.log('Generating & exporting GLB binary assets...');

  // Characters
  await exportGLB(createCowModel(), 'public/assets/characters/cow/cow.glb');
  await exportGLB(createTigerModel(), 'public/assets/characters/tiger/tiger.glb');

  // Nature Environment (Kenney Nature Kit)
  await exportGLB(createTreeOak(), 'public/assets/environment/nature/tree_oak.glb');
  await exportGLB(createTreeDefault(), 'public/assets/environment/nature/tree_default.glb');
  await exportGLB(createRockLargeA(), 'public/assets/environment/nature/rock_largeA.glb');
  await exportGLB(createRockSmallA(), 'public/assets/environment/nature/rock_smallA.glb');
  await exportGLB(createPlantBush(), 'public/assets/environment/nature/plant_bush.glb');
  await exportGLB(createFlowerRedA(), 'public/assets/environment/nature/flower_redA.glb');
  await exportGLB(createFlowerYellowA(), 'public/assets/environment/nature/flower_yellowA.glb');
  await exportGLB(createGrassPatch(), 'public/assets/environment/nature/grass.glb');
  await exportGLB(createFenceSimple(), 'public/assets/environment/nature/fence_simple.glb');

  // Khmer Cultural Props
  await exportGLB(createKhmerPavilion(), 'public/assets/khmer/architecture/khmer_pavilion.glb');
  await exportGLB(createClayJarKam(), 'public/assets/khmer/architecture/clay_jar_kam.glb');
  await exportGLB(createLotusFinial(), 'public/assets/khmer/ornaments/lotus_finial.glb');
  await exportGLB(createNagaOrnament(), 'public/assets/khmer/ornaments/naga_ornament.glb');

  console.log('All 15 GLB binary assets generated successfully!');
  process.exit(0);
}

buildAll().catch((err) => {
  console.error('Asset build error:', err);
  process.exit(1);
});
