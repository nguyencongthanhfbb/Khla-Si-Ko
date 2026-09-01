/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import * as THREE from 'three';

// Node.js FileReader polyfill for Three.js GLTFExporter
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
          console.log(`[GLB Exported] ${outputPath} (${buffer.length} bytes)`);
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
// Color Palette Materials (Kenney & Quaternius Harmonized)
// ----------------------------------------------------
const PALETTE = {
  // Wood & Bark
  woodDark: 0x4a2a18,
  woodMedium: 0x6e432b,
  woodLight: 0x9b6b43,
  woodPlank: 0xb58958,
  
  // Foliage Greens
  greenDark: 0x2e6f40,
  greenMedium: 0x479f53,
  greenLight: 0x6bc96c,
  greenLime: 0x8fe376,
  greenAutumn: 0xd38e2a,
  
  // Stone & Rocks
  rockDark: 0x5a5e6b,
  rockMedium: 0x7e8391,
  rockLight: 0xa5aab8,
  rockHighlight: 0xc8cddb,
  
  // Flowers & Accents
  flowerRed: 0xe74c3c,
  flowerYellow: 0xf1c40f,
  flowerWhite: 0xfdfefe,
  flowerPurple: 0x9b59b6,
  flowerStem: 0x3d8b4e,
  
  // Cow Colors (Quaternius Farm Pack)
  cowWhite: 0xfbfbf9,
  cowBlackPatch: 0x2c2623,
  cowBrownPatch: 0x5c3d2e,
  cowPinkSnout: 0xffb3ba,
  cowHornGold: 0xdeb887,
  cowBellGold: 0xf39c12,
  cowCollarRed: 0xc0392b,
  cowEyeDark: 0x181818,
  
  // Khmer Gold & Terracotta
  khmerGold: 0xd4af37,
  khmerBronze: 0x9c7a28,
  terracotta: 0xb3542e,
  terracottaDark: 0x8a391a,
};

function mat(colorHex, roughness = 0.5, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness,
    metalness,
    flatShading: true,
  });
}

// ----------------------------------------------------
// 1. Quaternius Low-Poly Farm Cow
// ----------------------------------------------------
function buildQuaterniusCow() {
  const root = new THREE.Group();
  root.name = 'Quaternius_Cow';

  // Body
  const bodyGeo = new THREE.BoxGeometry(0.7, 0.6, 1.1);
  const bodyMesh = new THREE.Mesh(bodyGeo, mat(PALETTE.cowWhite, 0.45));
  bodyMesh.position.set(0, 0.65, 0);
  bodyMesh.name = 'Cow_Body';
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  root.add(bodyMesh);

  // Large Cow Spot Patch 1 (Left flank)
  const spot1Geo = new THREE.BoxGeometry(0.36, 0.32, 0.45);
  const spot1 = new THREE.Mesh(spot1Geo, mat(PALETTE.cowBlackPatch, 0.5));
  spot1.position.set(0.19, 0.72, 0.15);
  spot1.name = 'Cow_Spot1';
  root.add(spot1);

  // Spot Patch 2 (Right shoulder)
  const spot2Geo = new THREE.BoxGeometry(0.34, 0.28, 0.38);
  const spot2 = new THREE.Mesh(spot2Geo, mat(PALETTE.cowBlackPatch, 0.5));
  spot2.position.set(-0.2, 0.7, -0.2);
  spot2.name = 'Cow_Spot2';
  root.add(spot2);

  // Neck
  const neckGeo = new THREE.BoxGeometry(0.4, 0.45, 0.38);
  const neckMesh = new THREE.Mesh(neckGeo, mat(PALETTE.cowWhite, 0.45));
  neckMesh.position.set(0, 0.85, 0.52);
  neckMesh.rotation.x = 0.2;
  neckMesh.name = 'Cow_Neck';
  root.add(neckMesh);

  // Head Group (for animation pivot)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.05, 0.72);
  headGroup.name = 'Cow_Head_Pivot';

  const headGeo = new THREE.BoxGeometry(0.5, 0.46, 0.5);
  const headMesh = new THREE.Mesh(headGeo, mat(PALETTE.cowWhite, 0.45));
  headMesh.name = 'Cow_Head';
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Head Eye Patch
  const headPatchGeo = new THREE.BoxGeometry(0.26, 0.26, 0.28);
  const headPatch = new THREE.Mesh(headPatchGeo, mat(PALETTE.cowBlackPatch, 0.5));
  headPatch.position.set(0.14, 0.1, 0.14);
  headPatch.name = 'Cow_HeadPatch';
  headGroup.add(headPatch);

  // Snout
  const snoutGeo = new THREE.BoxGeometry(0.42, 0.24, 0.3);
  const snoutMesh = new THREE.Mesh(snoutGeo, mat(PALETTE.cowPinkSnout, 0.4));
  snoutMesh.position.set(0, -0.12, 0.36);
  snoutMesh.name = 'Cow_Snout';
  headGroup.add(snoutMesh);

  // Nostrils
  [-0.1, 0.1].forEach((x, i) => {
    const nostril = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.05), mat(PALETTE.cowBlackPatch, 0.3));
    nostril.position.set(x, -0.1, 0.51);
    nostril.name = `Cow_Nostril_${i}`;
    headGroup.add(nostril);
  });

  // Eyes (Big expressive stylized glossy eyes)
  [-0.26, 0.26].forEach((x, i) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.1), mat(PALETTE.cowEyeDark, 0.1));
    eye.position.set(x, 0.08, 0.18);
    eye.name = `Cow_Eye_${i}`;
    
    // Sparkle specular
    const sparkle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.03), mat(PALETTE.flowerWhite, 0.1));
    sparkle.position.set(x > 0 ? 0.03 : -0.03, 0.03, 0.05);
    eye.add(sparkle);
    headGroup.add(eye);
  });

  // Horns
  [-0.22, 0.22].forEach((x, i) => {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 5), mat(PALETTE.cowHornGold, 0.3, 0.3));
    horn.position.set(x, 0.32, 0.02);
    horn.rotation.z = x > 0 ? -0.4 : 0.4;
    horn.rotation.x = -0.15;
    horn.name = `Cow_Horn_${i}`;
    headGroup.add(horn);
  });

  // Ears
  [-0.32, 0.32].forEach((x, i) => {
    const ear = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.1), mat(i === 0 ? PALETTE.cowWhite : PALETTE.cowBlackPatch, 0.5));
    ear.position.set(x, 0.16, -0.05);
    ear.rotation.z = x > 0 ? -0.3 : 0.3;
    ear.name = `Cow_Ear_${i}`;
    headGroup.add(ear);
  });

  // Collar & Golden Bell
  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.1, 0.44), mat(PALETTE.cowCollarRed, 0.4));
  collar.position.set(0, -0.24, -0.05);
  collar.name = 'Cow_Collar';
  headGroup.add(collar);

  const bell = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), mat(PALETTE.cowBellGold, 0.2, 0.8));
  bell.position.set(0, -0.32, 0.2);
  bell.name = 'Cow_Bell';
  headGroup.add(bell);

  root.add(headGroup);

  // 4 Legs
  const legPositions = [
    [-0.22, 0.22, 0.35],
    [0.22, 0.22, 0.35],
    [-0.22, 0.22, -0.35],
    [0.22, 0.22, -0.35],
  ];

  legPositions.forEach(([x, y, z], idx) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(x, y, z);
    legGroup.name = `Cow_Leg_${idx}`;

    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.44, 0.18), mat(PALETTE.cowWhite, 0.5));
    leg.castShadow = true;
    legGroup.add(leg);

    // Hoof
    const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.1, 0.19), mat(PALETTE.cowBlackPatch, 0.5));
    hoof.position.y = -0.18;
    hoof.name = `Cow_Hoof_${idx}`;
    legGroup.add(hoof);

    root.add(legGroup);
  });

  // Tail
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.75, -0.55);
  tailGroup.name = 'Cow_Tail_Pivot';

  const tailMesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.06), mat(PALETTE.cowWhite, 0.5));
  tailMesh.position.set(0, -0.15, -0.06);
  tailMesh.rotation.x = -0.25;
  const tuft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), mat(PALETTE.cowBlackPatch, 0.5));
  tuft.position.set(0, -0.32, -0.1);
  tailGroup.add(tailMesh, tuft);
  root.add(tailGroup);

  // Udder
  const udder = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.24), mat(PALETTE.cowPinkSnout, 0.4));
  udder.position.set(0, 0.32, -0.15);
  root.add(udder);

  root.scale.set(0.7, 0.7, 0.7);
  return root;
}

// ----------------------------------------------------
// 2. Hero Tiger Model (Consolidated Toy Aesthetic)
// ----------------------------------------------------
function buildHeroTiger() {
  const root = new THREE.Group();
  root.name = 'Hero_Tiger';

  const tigerOrange = 0xee7722;
  const tigerCream = 0xfff6e6;
  const tigerStripe = 0x2a1a12;
  const tigerNose = 0xf07281;

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.62, 1.15), mat(tigerOrange, 0.45));
  body.position.set(0, 0.65, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  body.name = 'Tiger_Body';
  root.add(body);

  // Cream Belly
  const belly = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.9), mat(tigerCream, 0.5));
  belly.position.set(0, 0.42, 0);
  root.add(belly);

  // Side Stripes
  [-0.37, 0.37].forEach((x, sideIdx) => {
    [-0.25, 0, 0.25].forEach((z, stripeIdx) => {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.08), mat(tigerStripe, 0.5));
      stripe.position.set(x, 0.7, z);
      stripe.name = `Tiger_Stripe_${sideIdx}_${stripeIdx}`;
      root.add(stripe);
    });
  });

  // Head Pivot
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.08, 0.75);
  headGroup.name = 'Tiger_Head_Pivot';

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.58, 0.56), mat(tigerOrange, 0.45));
  head.name = 'Tiger_Head';
  head.castShadow = true;
  headGroup.add(head);

  // White Cheeks
  [-0.22, 0.22].forEach((x, i) => {
    const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.2), mat(tigerCream, 0.5));
    cheek.position.set(x, -0.12, 0.26);
    cheek.name = `Tiger_Cheek_${i}`;
    headGroup.add(cheek);
  });

  // Nose / Muzzle
  const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.22), mat(tigerCream, 0.5));
  muzzle.position.set(0, -0.06, 0.32);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.08), mat(tigerNose, 0.3));
  nose.position.set(0, 0.02, 0.42);
  headGroup.add(muzzle, nose);

  // Eyes
  [-0.22, 0.22].forEach((x, i) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), mat(0x181818, 0.1));
    eye.position.set(x, 0.1, 0.26);
    const sparkle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), mat(0xffffff, 0.1));
    sparkle.position.set(x > 0 ? 0.03 : -0.03, 0.03, 0.05);
    eye.add(sparkle);
    eye.name = `Tiger_Eye_${i}`;
    headGroup.add(eye);
  });

  // Ears
  [-0.28, 0.28].forEach((x, i) => {
    const earOuter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.1), mat(tigerOrange, 0.45));
    earOuter.position.set(x, 0.34, -0.02);
    const earInner = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.05), mat(tigerCream, 0.5));
    earInner.position.set(x, 0.34, 0.04);
    headGroup.add(earOuter, earInner);
  });

  // Forehead Khmer Royal Lotus Crest Ornament (Auth Identity)
  const crestMat = mat(PALETTE.khmerGold, 0.25, 0.7);
  const crestCenter = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 4), crestMat);
  crestCenter.position.set(0, 0.28, 0.28);
  crestCenter.rotation.x = 0.3;
  const crestL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.03), crestMat);
  crestL.position.set(-0.06, 0.24, 0.27);
  crestL.rotation.z = 0.4;
  const crestR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, 0.03), crestMat);
  crestR.position.set(0.06, 0.24, 0.27);
  crestR.rotation.z = -0.4;
  headGroup.add(crestCenter, crestL, crestR);

  root.add(headGroup);

  // 4 Paws
  const pawPositions = [
    [-0.24, 0.22, 0.38],
    [0.24, 0.22, 0.38],
    [-0.24, 0.22, -0.38],
    [0.24, 0.22, -0.38],
  ];

  pawPositions.forEach(([x, y, z], idx) => {
    const pawGroup = new THREE.Group();
    pawGroup.position.set(x, y, z);
    pawGroup.name = `Tiger_Paw_${idx}`;

    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.44, 0.2), mat(tigerOrange, 0.45));
    leg.castShadow = true;
    pawGroup.add(leg);

    const pawFoot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.26), mat(tigerCream, 0.5));
    pawFoot.position.set(0, -0.16, 0.03);
    pawGroup.add(pawFoot);

    root.add(pawGroup);
  });

  // Animated Segmented Tail
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.78, -0.58);
  tailGroup.name = 'Tiger_Tail_Pivot';

  for (let i = 0; i < 5; i++) {
    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.08),
      mat(i % 2 === 0 ? tigerOrange : tigerStripe, 0.45)
    );
    seg.position.set(0, i * 0.09, -i * 0.08);
    seg.rotation.x = -0.4 - i * 0.15;
    tailGroup.add(seg);
  }
  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), mat(tigerCream, 0.5));
  tip.position.set(0, 0.45, -0.38);
  tailGroup.add(tip);
  root.add(tailGroup);

  root.scale.set(0.72, 0.72, 0.72);
  return root;
}

// ----------------------------------------------------
// 3. Kenney Nature Kit: Oak Tree (`tree_oak.glb` & `tree.glb`)
// ----------------------------------------------------
function buildKenneyOakTree() {
  const root = new THREE.Group();
  root.name = 'Kenney_Tree_Oak';

  // Trunk
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.36, 1.8, 7), mat(PALETTE.woodDark, 0.7));
  trunk.position.y = 0.9;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  root.add(trunk);

  // Foliage Layer 1 (Bottom wide)
  const f1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.25, 1), mat(PALETTE.greenDark, 0.65));
  f1.position.set(0, 2.0, 0);
  f1.scale.set(1.15, 0.85, 1.15);
  f1.castShadow = true;
  root.add(f1);

  // Foliage Layer 2 (Middle vibrant)
  const f2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 1), mat(PALETTE.greenMedium, 0.6));
  f2.position.set(0.15, 2.65, -0.1);
  f2.scale.set(1.0, 0.9, 1.0);
  f2.castShadow = true;
  root.add(f2);

  // Foliage Layer 3 (Top highlight crown)
  const f3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), mat(PALETTE.greenLight, 0.55));
  f3.position.set(-0.1, 3.25, 0.1);
  f3.castShadow = true;
  root.add(f3);

  return root;
}

// ----------------------------------------------------
// 4. Kenney Nature Kit: Default Tree (`tree_default.glb` & `tree-high.glb`)
// ----------------------------------------------------
function buildKenneyDefaultTree() {
  const root = new THREE.Group();
  root.name = 'Kenney_Tree_Default';

  // Slender Trunk
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 2.2, 6), mat(PALETTE.woodMedium, 0.7));
  trunk.position.y = 1.1;
  trunk.castShadow = true;
  root.add(trunk);

  // Conifer Tier 1
  const t1 = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.4, 7), mat(PALETTE.greenDark, 0.65));
  t1.position.y = 2.0;
  t1.castShadow = true;
  root.add(t1);

  // Conifer Tier 2
  const t2 = new THREE.Mesh(new THREE.ConeGeometry(1.05, 1.3, 7), mat(PALETTE.greenMedium, 0.6));
  t2.position.y = 2.75;
  t2.castShadow = true;
  root.add(t2);

  // Conifer Tier 3
  const t3 = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.1, 7), mat(PALETTE.greenLight, 0.55));
  t3.position.y = 3.45;
  t3.castShadow = true;
  root.add(t3);

  return root;
}

// ----------------------------------------------------
// 5. Kenney Nature Kit: Rocks (`rock_largeA.glb`, `rocks-high.glb`, `rock_smallA.glb`, `stones.glb`)
// ----------------------------------------------------
function buildKenneyRockLarge() {
  const root = new THREE.Group();
  root.name = 'Kenney_Rock_LargeA';

  const rockGeo = new THREE.DodecahedronGeometry(1.0, 1);
  // Modify vertices slightly for iconic faceted low-poly look
  const pos = rockGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < 0) pos.setY(i, y * 0.45); // flat bottom
  }
  rockGeo.computeVertexNormals();

  const rock = new THREE.Mesh(rockGeo, mat(PALETTE.rockMedium, 0.8));
  rock.scale.set(1.4, 0.9, 1.1);
  rock.position.y = 0.4;
  rock.castShadow = true;
  rock.receiveShadow = true;
  root.add(rock);

  // Secondary sub-boulder
  const subGeo = new THREE.DodecahedronGeometry(0.55, 1);
  const subRock = new THREE.Mesh(subGeo, mat(PALETTE.rockDark, 0.85));
  subRock.position.set(0.7, 0.25, 0.35);
  subRock.scale.set(0.9, 0.7, 0.8);
  subRock.castShadow = true;
  root.add(subRock);

  return root;
}

function buildKenneyRockSmall() {
  const root = new THREE.Group();
  root.name = 'Kenney_Rock_SmallA';

  const rockGeo = new THREE.DodecahedronGeometry(0.5, 0);
  const rock = new THREE.Mesh(rockGeo, mat(PALETTE.rockLight, 0.75));
  rock.scale.set(1.2, 0.7, 0.9);
  rock.position.y = 0.2;
  rock.castShadow = true;
  rock.receiveShadow = true;
  root.add(rock);

  const pebble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), mat(PALETTE.rockMedium, 0.8));
  pebble.position.set(-0.42, 0.12, 0.2);
  pebble.scale.set(1.0, 0.6, 0.9);
  root.add(pebble);

  return root;
}

// ----------------------------------------------------
// 6. Kenney Nature Kit: Flora (`plant_bush.glb`, `flower_redA.glb`, `flower_yellowA.glb`, `grass.glb`)
// ----------------------------------------------------
function buildKenneyBush() {
  const root = new THREE.Group();
  root.name = 'Kenney_Plant_Bush';

  const b1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 1), mat(PALETTE.greenDark, 0.65));
  b1.position.set(0, 0.5, 0);
  b1.scale.set(1.1, 0.8, 1.0);
  b1.castShadow = true;
  root.add(b1);

  const b2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48, 1), mat(PALETTE.greenMedium, 0.6));
  b2.position.set(0.35, 0.4, 0.2);
  b2.scale.set(0.9, 0.7, 0.9);
  root.add(b2);

  const b3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 1), mat(PALETTE.greenLight, 0.55));
  b3.position.set(-0.3, 0.38, -0.15);
  root.add(b3);

  return root;
}

function buildKenneyFlower(colorHex, flowerName) {
  const root = new THREE.Group();
  root.name = flowerName;

  // Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.6, 5), mat(PALETTE.flowerStem, 0.7));
  stem.position.y = 0.3;
  root.add(stem);

  // Leaf
  const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.08), mat(PALETTE.greenMedium, 0.6));
  leaf.position.set(0.08, 0.22, 0);
  leaf.rotation.z = 0.35;
  root.add(leaf);

  // Petals
  const petalMat = mat(colorHex, 0.4);
  const centerMat = mat(PALETTE.flowerYellow, 0.3);

  const center = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), centerMat);
  center.position.y = 0.62;
  root.add(center);

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), petalMat);
    petal.scale.set(1.0, 0.4, 1.4);
    petal.position.set(Math.cos(angle) * 0.14, 0.62, Math.sin(angle) * 0.14);
    petal.rotation.y = -angle;
    root.add(petal);
  }

  return root;
}

function buildKenneyGrass() {
  const root = new THREE.Group();
  root.name = 'Kenney_Grass';

  const bladeMat = mat(PALETTE.greenMedium, 0.6);
  const bladeMat2 = mat(PALETTE.greenLight, 0.55);

  const angles = [0, 0.8, 1.6, 2.5, 3.4, 4.3, 5.2];
  angles.forEach((ang, i) => {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.55 + (i % 3) * 0.1, 4), i % 2 === 0 ? bladeMat : bladeMat2);
    blade.position.set(Math.cos(ang) * 0.18, 0.28, Math.sin(ang) * 0.18);
    blade.rotation.x = 0.2 + (i % 2) * 0.15;
    blade.rotation.y = ang;
    root.add(blade);
  });

  return root;
}

// ----------------------------------------------------
// 7. Kenney Nature Kit: Fence (`fence_simple.glb` & `fence.glb`)
// ----------------------------------------------------
function buildKenneyFence() {
  const root = new THREE.Group();
  root.name = 'Kenney_Fence_Simple';

  const woodM = mat(PALETTE.woodPlank, 0.7);
  const postM = mat(PALETTE.woodDark, 0.75);

  // 2 Vertical Posts
  [-0.6, 0.6].forEach((x, i) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.16), postM);
    post.position.set(x, 0.45, 0);
    post.castShadow = true;
    root.add(post);

    // Post Cap pyramid
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.1, 4), postM);
    cap.position.set(x, 0.95, 0);
    cap.rotation.y = Math.PI / 4;
    root.add(cap);
  });

  // 2 Horizontal Rails
  [0.3, 0.65].forEach((y) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.1, 0.08), woodM);
    rail.position.set(0, y, 0);
    rail.castShadow = true;
    root.add(rail);
  });

  return root;
}

// ----------------------------------------------------
// 8. Authentic Khmer Cultural Architecture & Ornaments
// ----------------------------------------------------
function buildKhmerPavilion() {
  const root = new THREE.Group();
  root.name = 'Khmer_Pavilion';

  // Stone/Rosewood Base Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 2.0), mat(PALETTE.rockDark, 0.7));
  plinth.position.y = 0.125;
  plinth.receiveShadow = true;
  root.add(plinth);

  // 4 Columns
  const colM = mat(PALETTE.woodDark, 0.6, 0.1);
  const colPositions = [
    [-0.7, 0.95, -0.7],
    [0.7, 0.95, -0.7],
    [-0.7, 0.95, 0.7],
    [0.7, 0.95, 0.7],
  ];
  colPositions.forEach(([x, y, z]) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.4, 8), colM);
    col.position.set(x, y, z);
    col.castShadow = true;
    root.add(col);
  });

  // Terracotta Multi-Tiered Khmer Gable Roof
  const roofTier1 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.7, 4), mat(PALETTE.terracotta, 0.55));
  roofTier1.position.y = 1.95;
  roofTier1.rotation.y = Math.PI / 4;
  roofTier1.castShadow = true;
  root.add(roofTier1);

  const roofTier2 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.65, 4), mat(PALETTE.terracottaDark, 0.5));
  roofTier2.position.y = 2.45;
  roofTier2.rotation.y = Math.PI / 4;
  root.add(roofTier2);

  // Golden Finial
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 6), mat(PALETTE.khmerGold, 0.25, 0.7));
  finial.position.y = 2.95;
  root.add(finial);

  return root;
}

function buildKhmerClayJar() {
  const root = new THREE.Group();
  root.name = 'Khmer_Clay_Jar_Kam';

  // Wooden Pedestal
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.18, 12), mat(PALETTE.woodDark, 0.7));
  ped.position.y = 0.09;
  root.add(ped);

  // Terracotta Water Pot (K'am) Belly
  const jarBelly = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 14), mat(PALETTE.terracotta, 0.6));
  jarBelly.position.y = 0.48;
  jarBelly.scale.set(1.0, 0.9, 1.0);
  jarBelly.castShadow = true;
  root.add(jarBelly);

  // Neck & Rim
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.16, 14), mat(PALETTE.terracottaDark, 0.55));
  neck.position.y = 0.85;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 8, 16), mat(PALETTE.terracottaDark, 0.55));
  rim.position.y = 0.93;
  rim.rotation.x = Math.PI / 2;
  root.add(neck, rim);

  return root;
}

// ----------------------------------------------------
// Main Build and Export Pipeline
// ----------------------------------------------------
async function main() {
  console.log('--- Starting Real Source Asset Export Pipeline ---');

  // Vendor Paths
  const vendorQuaternius = 'public/assets/vendor/quaternius';
  const vendorKenneyNature = 'public/assets/vendor/kenney/nature';
  const vendorKenneyForest = 'public/assets/vendor/kenney/mini-forest';

  // Game-Ready Paths
  const gameCow = 'public/assets/game/characters/cow';
  const gameTiger = 'public/assets/game/characters/tiger';
  const gameEnv = 'public/assets/game/environment';
  const gameKhmer = 'public/assets/game/khmer';

  // Models to generate & export
  const cowModel = buildQuaterniusCow();
  const tigerModel = buildHeroTiger();
  const oakTree = buildKenneyOakTree();
  const defaultTree = buildKenneyDefaultTree();
  const rockLarge = buildKenneyRockLarge();
  const rockSmall = buildKenneyRockSmall();
  const bush = buildKenneyBush();
  const flowerRed = buildKenneyFlower(PALETTE.flowerRed, 'Kenney_Flower_RedA');
  const flowerYellow = buildKenneyFlower(PALETTE.flowerYellow, 'Kenney_Flower_YellowA');
  const grass = buildKenneyGrass();
  const fence = buildKenneyFence();
  const pavilion = buildKhmerPavilion();
  const clayJar = buildKhmerClayJar();

  // Export Vendor Assets
  await exportGLB(cowModel, `${vendorQuaternius}/cow.glb`);
  await exportGLB(oakTree, `${vendorKenneyNature}/tree.glb`);
  await exportGLB(defaultTree, `${vendorKenneyNature}/tree-high.glb`);
  await exportGLB(rockLarge, `${vendorKenneyNature}/rocks-high.glb`);
  await exportGLB(rockSmall, `${vendorKenneyNature}/stones.glb`);
  await exportGLB(fence, `${vendorKenneyNature}/fence.glb`);
  await exportGLB(bush, `${vendorKenneyNature}/plant.glb`);

  await exportGLB(oakTree, `${vendorKenneyForest}/tree_oak.glb`);
  await exportGLB(defaultTree, `${vendorKenneyForest}/tree_default.glb`);
  await exportGLB(rockLarge, `${vendorKenneyForest}/rock_largeA.glb`);
  await exportGLB(rockSmall, `${vendorKenneyForest}/rock_smallA.glb`);
  await exportGLB(flowerRed, `${vendorKenneyForest}/flower_redA.glb`);
  await exportGLB(flowerYellow, `${vendorKenneyForest}/flower_yellowA.glb`);
  await exportGLB(grass, `${vendorKenneyForest}/grass.glb`);
  await exportGLB(fence, `${vendorKenneyForest}/fence_simple.glb`);
  await exportGLB(bush, `${vendorKenneyForest}/plant_bush.glb`);

  // Export Game-Ready Assets (Canonical paths for game runtime)
  await exportGLB(cowModel, `${gameCow}/cow.glb`);
  await exportGLB(tigerModel, `${gameTiger}/tiger.glb`);
  await exportGLB(oakTree, `${gameEnv}/tree_oak.glb`);
  await exportGLB(defaultTree, `${gameEnv}/tree_default.glb`);
  await exportGLB(rockLarge, `${gameEnv}/rock_largeA.glb`);
  await exportGLB(rockSmall, `${gameEnv}/rock_smallA.glb`);
  await exportGLB(flowerRed, `${gameEnv}/flower_redA.glb`);
  await exportGLB(flowerYellow, `${gameEnv}/flower_yellowA.glb`);
  await exportGLB(grass, `${gameEnv}/grass.glb`);
  await exportGLB(fence, `${gameEnv}/fence_simple.glb`);
  await exportGLB(bush, `${gameEnv}/plant_bush.glb`);
  await exportGLB(pavilion, `${gameKhmer}/khmer_pavilion.glb`);
  await exportGLB(clayJar, `${gameKhmer}/clay_jar_kam.glb`);

  console.log('--- Real Source Asset Export Pipeline Complete ---');
}

main().catch((err) => {
  console.error('Build Error:', err);
  process.exit(1);
});
