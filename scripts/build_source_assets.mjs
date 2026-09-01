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
// Harmonized Khmer Wooden Toy Color Palette
// ----------------------------------------------------
const PALETTE = {
  // Handcrafted Teak & Rosewood
  woodDark: 0x422415,
  woodMedium: 0x663c22,
  woodTeak: 0x8a532f,
  woodLight: 0xb58252,
  woodCream: 0xf5ebd9,
  woodBamboo: 0xd8c29d,

  // Foliage Greens & Earth
  greenDark: 0x275936,
  greenMedium: 0x3d824c,
  greenLight: 0x62b570,
  greenSoft: 0x8cd998,
  
  // Stone & Clay
  rockDark: 0x545963,
  rockMedium: 0x767d8a,
  rockLight: 0xa0a7b4,
  terracotta: 0xb8502d,
  terracottaDark: 0x8c361a,
  terracottaLight: 0xd46f48,

  // Floral & Accents
  lotusPink: 0xf288a8,
  lotusRose: 0xd9577e,
  flowerYellow: 0xf5c338,
  flowerWhite: 0xfefefe,
  flowerStem: 0x387845,

  // Cute Toy Tiger Colors
  tigerOrange: 0xf37f22,
  tigerOrangeDark: 0xd96814,
  tigerCream: 0xfff4e0,
  tigerStripe: 0x2e1d13,
  tigerNose: 0xf07a8b,
  tigerMouth: 0x6b2d2d,
  tigerEyeDark: 0x1a1614,

  // Cute Toy Cow Colors
  cowWhite: 0xfdfdfc,
  cowBlackPatch: 0x2e2723,
  cowBrownPatch: 0x5e3f2e,
  cowPinkSnout: 0xffb8c2,
  cowHornWood: 0xd2a679,
  cowBellGold: 0xf1b82d,
  cowCollarRed: 0xb8382c,

  // Restrained Khmer Gold Accent
  khmerGold: 0xd4af37,
  khmerGoldSoft: 0xe6c55c,
};

function mat(colorHex, roughness = 0.5, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness,
    metalness,
    flatShading: true,
  });
}

// ----------------------------------------------------
// 1. Cute Khmer Toy Cow
// ----------------------------------------------------
function buildCuteToyCow() {
  const root = new THREE.Group();
  root.name = 'Cute_Khmer_Toy_Cow';

  // Body (Plump, rounded collectible wooden toy torso)
  const bodyGeo = new THREE.BoxGeometry(0.72, 0.62, 1.05);
  const bodyMesh = new THREE.Mesh(bodyGeo, mat(PALETTE.cowWhite, 0.42));
  bodyMesh.position.set(0, 0.65, 0);
  bodyMesh.name = 'Cow_Body';
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  root.add(bodyMesh);

  // Large Cute Brown Spot (Left flank)
  const spot1Geo = new THREE.BoxGeometry(0.38, 0.34, 0.45);
  const spot1 = new THREE.Mesh(spot1Geo, mat(PALETTE.cowBrownPatch, 0.45));
  spot1.position.set(0.19, 0.72, 0.12);
  spot1.name = 'Cow_Spot1';
  root.add(spot1);

  // Spot 2 (Right shoulder)
  const spot2Geo = new THREE.BoxGeometry(0.34, 0.28, 0.38);
  const spot2 = new THREE.Mesh(spot2Geo, mat(PALETTE.cowBrownPatch, 0.45));
  spot2.position.set(-0.2, 0.7, -0.2);
  spot2.name = 'Cow_Spot2';
  root.add(spot2);

  // Neck
  const neckGeo = new THREE.BoxGeometry(0.42, 0.46, 0.38);
  const neckMesh = new THREE.Mesh(neckGeo, mat(PALETTE.cowWhite, 0.42));
  neckMesh.position.set(0, 0.86, 0.5);
  neckMesh.rotation.x = 0.18;
  neckMesh.name = 'Cow_Neck';
  root.add(neckMesh);

  // Head Group (Oversized cute chibi head matching Tiger)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.06, 0.72);
  headGroup.name = 'Cow_Head_Pivot';

  const headGeo = new THREE.BoxGeometry(0.64, 0.54, 0.54);
  const headMesh = new THREE.Mesh(headGeo, mat(PALETTE.cowWhite, 0.42));
  headMesh.name = 'Cow_Head';
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Head Patch over right eye
  const headPatchGeo = new THREE.BoxGeometry(0.32, 0.32, 0.3);
  const headPatch = new THREE.Mesh(headPatchGeo, mat(PALETTE.cowBrownPatch, 0.45));
  headPatch.position.set(0.18, 0.1, 0.14);
  headPatch.name = 'Cow_HeadPatch';
  headGroup.add(headPatch);

  // Sweet Soft Pink Snout (Curved, rounded wooden block)
  const snoutGeo = new THREE.BoxGeometry(0.48, 0.26, 0.32);
  const snoutMesh = new THREE.Mesh(snoutGeo, mat(PALETTE.cowPinkSnout, 0.38));
  snoutMesh.position.set(0, -0.14, 0.38);
  snoutMesh.name = 'Cow_Snout';
  headGroup.add(snoutMesh);

  // Cute Nostrils
  [-0.11, 0.11].forEach((x, i) => {
    const nostril = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.05), mat(PALETTE.cowBrownPatch, 0.3));
    nostril.position.set(x, -0.12, 0.55);
    nostril.name = `Cow_Nostril_${i}`;
    headGroup.add(nostril);
  });

  // Large Glossy Expressive Eyes (Matching Tiger proportion & glossy finish)
  [-0.24, 0.24].forEach((x, i) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), mat(PALETTE.cowEyeDark, 0.12, 0.1));
    eye.position.set(x, 0.08, 0.25);
    eye.name = `Cow_Eye_${i}`;
    
    // Catchlight Sparkle
    const sparkle1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), mat(PALETTE.flowerWhite, 0.1));
    sparkle1.position.set(x > 0 ? 0.03 : -0.03, 0.03, 0.06);
    const sparkle2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.02), mat(PALETTE.flowerWhite, 0.1));
    sparkle2.position.set(x > 0 ? -0.02 : 0.02, -0.03, 0.06);
    eye.add(sparkle1, sparkle2);
    headGroup.add(eye);
  });

  // Soft Wooden Horns
  [-0.26, 0.26].forEach((x, i) => {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.24, 6), mat(PALETTE.cowHornWood, 0.45));
    horn.position.set(x, 0.36, 0.02);
    horn.rotation.z = x > 0 ? -0.42 : 0.42;
    horn.rotation.x = -0.15;
    horn.name = `Cow_Horn_${i}`;
    headGroup.add(horn);
  });

  // Rounded Droopy Ears
  [-0.35, 0.35].forEach((x, i) => {
    const ear = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.12),
      mat(i === 0 ? PALETTE.cowWhite : PALETTE.cowBrownPatch, 0.45)
    );
    ear.position.set(x, 0.18, -0.04);
    ear.rotation.z = x > 0 ? -0.35 : 0.35;
    ear.name = `Cow_Ear_${i}`;
    headGroup.add(ear);
  });

  // Handcrafted Red Collar & Brass Bell
  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.1, 0.48), mat(PALETTE.cowCollarRed, 0.4));
  collar.position.set(0, -0.26, -0.04);
  collar.name = 'Cow_Collar';
  headGroup.add(collar);

  const bell = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), mat(PALETTE.cowBellGold, 0.22, 0.75));
  bell.position.set(0, -0.34, 0.22);
  bell.name = 'Cow_Bell';
  headGroup.add(bell);

  root.add(headGroup);

  // 4 Short Chubby Legs with Wooden Hoofs
  const legPositions = [
    [-0.23, 0.22, 0.33],
    [0.23, 0.22, 0.33],
    [-0.23, 0.22, -0.33],
    [0.23, 0.22, -0.33],
  ];

  legPositions.forEach(([x, y, z], idx) => {
    const legGroup = new THREE.Group();
    legGroup.position.set(x, y, z);
    legGroup.name = `Cow_Leg_${idx}`;

    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.44, 0.2), mat(PALETTE.cowWhite, 0.45));
    leg.castShadow = true;
    legGroup.add(leg);

    const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.11, 0.21), mat(PALETTE.cowBrownPatch, 0.45));
    hoof.position.y = -0.18;
    hoof.name = `Cow_Hoof_${idx}`;
    legGroup.add(hoof);

    root.add(legGroup);
  });

  // Swishing Tail with Tuft
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.76, -0.54);
  tailGroup.name = 'Cow_Tail_Pivot';

  const tailMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.36, 0.07), mat(PALETTE.cowWhite, 0.45));
  tailMesh.position.set(0, -0.16, -0.06);
  tailMesh.rotation.x = -0.25;
  const tuft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), mat(PALETTE.cowBrownPatch, 0.45));
  tuft.position.set(0, -0.34, -0.1);
  tailGroup.add(tailMesh, tuft);
  root.add(tailGroup);

  root.scale.set(0.72, 0.72, 0.72);
  return root;
}

// ----------------------------------------------------
// 2. Cute Khmer Toy Tiger (Redesigned: NO Forehead Symbol)
// ----------------------------------------------------
function buildCuteToyTiger() {
  const root = new THREE.Group();
  root.name = 'Cute_Khmer_Toy_Tiger';

  // Body (Stout, cuddly toy body with lacquered wooden orange & cream finish)
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.64, 1.1), mat(PALETTE.tigerOrange, 0.42));
  body.position.set(0, 0.65, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  body.name = 'Tiger_Body';
  root.add(body);

  // Soft Cream Belly
  const belly = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.26, 0.88), mat(PALETTE.tigerCream, 0.45));
  belly.position.set(0, 0.42, 0);
  root.add(belly);

  // Clean Painted Wood Stripes along sides
  [-0.38, 0.38].forEach((x, sideIdx) => {
    [-0.26, 0, 0.26].forEach((z, stripeIdx) => {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.36, 0.09), mat(PALETTE.tigerStripe, 0.45));
      stripe.position.set(x, 0.7, z);
      stripe.name = `Tiger_Stripe_${sideIdx}_${stripeIdx}`;
      root.add(stripe);
    });
  });

  // Head Group (Oversized chibi head, rounded cheeks, sweet friendly expression)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.08, 0.72);
  headGroup.name = 'Tiger_Head_Pivot';

  // Main Head Block
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.62, 0.58), mat(PALETTE.tigerOrange, 0.42));
  head.name = 'Tiger_Head';
  head.castShadow = true;
  headGroup.add(head);

  // Natural Painted Top Head Tiger Stripes (Simple natural stripes, NO forehead emblem!)
  [-0.14, 0, 0.14].forEach((x, idx) => {
    const topStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.04, idx === 1 ? 0.24 : 0.18),
      mat(PALETTE.tigerStripe, 0.45)
    );
    topStripe.position.set(x, 0.32, 0.05);
    headGroup.add(topStripe);
  });

  // Chubby White/Cream Cheeks
  [-0.24, 0.24].forEach((x, i) => {
    const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.22), mat(PALETTE.tigerCream, 0.45));
    cheek.position.set(x, -0.12, 0.26);
    cheek.name = `Tiger_Cheek_${i}`;
    headGroup.add(cheek);
  });

  // Rounded Muzzle with Cute Nose & Friendly Smile
  const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.24), mat(PALETTE.tigerCream, 0.45));
  muzzle.position.set(0, -0.06, 0.32);
  
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.09, 0.08), mat(PALETTE.tigerNose, 0.35));
  nose.position.set(0, 0.02, 0.43);

  const smile = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.04), mat(PALETTE.tigerMouth, 0.35));
  smile.position.set(0, -0.1, 0.43);

  headGroup.add(muzzle, nose, smile);

  // Large Glossy Expressive Eyes (Matching Cow)
  [-0.24, 0.24].forEach((x, i) => {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), mat(PALETTE.tigerEyeDark, 0.12, 0.1));
    eye.position.set(x, 0.1, 0.26);
    
    // Sparkle specular
    const sparkle1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), mat(PALETTE.flowerWhite, 0.1));
    sparkle1.position.set(x > 0 ? 0.03 : -0.03, 0.03, 0.06);
    const sparkle2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.02), mat(PALETTE.flowerWhite, 0.1));
    sparkle2.position.set(x > 0 ? -0.02 : 0.02, -0.03, 0.06);
    eye.add(sparkle1, sparkle2);
    eye.name = `Tiger_Eye_${i}`;
    headGroup.add(eye);
  });

  // Soft Rounded Ears (Orange outer, Cream inner)
  [-0.3, 0.3].forEach((x, i) => {
    const earOuter = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.1), mat(PALETTE.tigerOrange, 0.42));
    earOuter.position.set(x, 0.36, -0.02);
    const earInner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.05), mat(PALETTE.tigerCream, 0.45));
    earInner.position.set(x, 0.36, 0.04);
    headGroup.add(earOuter, earInner);
  });

  root.add(headGroup);

  // 4 Rounded Paws / Legs
  const pawPositions = [
    [-0.24, 0.22, 0.36],
    [0.24, 0.22, 0.36],
    [-0.24, 0.22, -0.36],
    [0.24, 0.22, -0.36],
  ];

  pawPositions.forEach(([x, y, z], idx) => {
    const pawGroup = new THREE.Group();
    pawGroup.position.set(x, y, z);
    pawGroup.name = `Tiger_Paw_${idx}`;

    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.44, 0.21), mat(PALETTE.tigerOrange, 0.42));
    leg.castShadow = true;
    pawGroup.add(leg);

    const pawFoot = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.12, 0.27), mat(PALETTE.tigerCream, 0.45));
    pawFoot.position.set(0, -0.16, 0.03);
    pawGroup.add(pawFoot);

    root.add(pawGroup);
  });

  // Cute Segmented Curved Tail
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.78, -0.56);
  tailGroup.name = 'Tiger_Tail_Pivot';

  for (let i = 0; i < 5; i++) {
    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.12, 0.08),
      mat(i % 2 === 0 ? PALETTE.tigerOrange : PALETTE.tigerStripe, 0.42)
    );
    seg.position.set(0, i * 0.09, -i * 0.08);
    seg.rotation.x = -0.4 - i * 0.15;
    tailGroup.add(seg);
  }
  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), mat(PALETTE.tigerCream, 0.45));
  tip.position.set(0, 0.45, -0.38);
  tailGroup.add(tip);
  root.add(tailGroup);

  root.scale.set(0.72, 0.72, 0.72);
  return root;
}

// ----------------------------------------------------
// 3. Traditional Khmer Rural Stilt House (Background Miniature)
// ----------------------------------------------------
function buildKhmerStiltHouse() {
  const root = new THREE.Group();
  root.name = 'Khmer_Stilt_House';

  const woodPillarMat = mat(PALETTE.woodDark, 0.75);
  const woodWallMat = mat(PALETTE.woodMedium, 0.65);
  const woodPlankMat = mat(PALETTE.woodLight, 0.6);
  const roofMat = mat(PALETTE.terracotta, 0.6);
  const roofRidgeMat = mat(PALETTE.terracottaDark, 0.55);

  // 1. Visible Wooden Stilts (6 pillars raising house off ground)
  const pillarCoords = [
    [-1.2, -0.8],
    [0, -0.8],
    [1.2, -0.8],
    [-1.2, 0.8],
    [0, 0.8],
    [1.2, 0.8],
  ];

  pillarCoords.forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 1.2, 8), woodPillarMat);
    pillar.position.set(px, 0.6, pz);
    pillar.castShadow = true;
    root.add(pillar);
  });

  // 2. Raised Wooden Platform Floor
  const platform = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 2.0), woodPlankMat);
  platform.position.set(0, 1.25, 0);
  platform.castShadow = true;
  platform.receiveShadow = true;
  root.add(platform);

  // 3. Main Wooden Living Room Box
  const houseBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 1.8), woodWallMat);
  houseBox.position.set(-0.3, 1.9, 0);
  houseBox.castShadow = true;
  root.add(houseBox);

  // Windows & Door with shutter detail
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.85, 0.45), woodPillarMat);
  door.position.set(0.72, 1.75, 0.4);
  root.add(door);

  const window1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.35), woodPillarMat);
  window1.position.set(0.72, 1.95, -0.4);
  root.add(window1);

  // 4. Front Porch / Veranda with Simple Bamboo/Wood Railing
  const railFront = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 1.9), woodPlankMat);
  railFront.position.set(1.35, 1.55, 0);
  root.add(railFront);

  // Wooden Steps to Porch
  for (let s = 0; s < 4; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.55), woodPlankMat);
    step.position.set(1.45 + s * 0.18, 1.05 - s * 0.28, 0.4);
    root.add(step);
  }

  // 5. Traditional High-Pitched Khmer Gable Roof
  const roofMain = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.1, 4), roofMat);
  roofMain.position.set(-0.25, 2.9, 0);
  roofMain.rotation.y = Math.PI / 4;
  roofMain.scale.set(1.15, 0.9, 0.95);
  roofMain.castShadow = true;
  root.add(roofMain);

  // Curved Gable Eaves Ridge
  const roofRidge = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 0.14), roofRidgeMat);
  roofRidge.position.set(-0.25, 3.45, 0);
  root.add(roofRidge);

  // Porch roof canopy
  const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 1.9), roofMat);
  porchRoof.position.set(0.95, 2.3, 0);
  porchRoof.rotation.z = -0.3;
  porchRoof.castShadow = true;
  root.add(porchRoof);

  return root;
}

// ----------------------------------------------------
// 4. Traditional Khmer Water Storage Pot (K'am)
// ----------------------------------------------------
function buildKhmerClayJar() {
  const root = new THREE.Group();
  root.name = 'Khmer_Clay_Jar_Kam';

  // Handcrafted Wooden Pedestal Stand
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.18, 12), mat(PALETTE.woodDark, 0.7));
  ped.position.y = 0.09;
  ped.castShadow = true;
  root.add(ped);

  // Round Earthenware Belly (Terracotta with natural clay texture feel)
  const jarBelly = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), mat(PALETTE.terracotta, 0.65));
  jarBelly.position.y = 0.48;
  jarBelly.scale.set(1.05, 0.92, 1.05);
  jarBelly.castShadow = true;
  root.add(jarBelly);

  // Neck & Rim
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.16, 14), mat(PALETTE.terracottaDark, 0.6));
  neck.position.y = 0.85;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.04, 8, 16), mat(PALETTE.terracottaDark, 0.6));
  rim.position.y = 0.93;
  rim.rotation.x = Math.PI / 2;
  root.add(neck, rim);

  return root;
}

// ----------------------------------------------------
// 5. Kenney Nature Kit Assets (Trees, Rocks, Bushes, Flora, Fences)
// ----------------------------------------------------
function buildKenneyOakTree() {
  const root = new THREE.Group();
  root.name = 'Kenney_Tree_Oak';

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.36, 1.8, 7), mat(PALETTE.woodDark, 0.7));
  trunk.position.y = 0.9;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  root.add(trunk);

  const f1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.25, 1), mat(PALETTE.greenDark, 0.65));
  f1.position.set(0, 2.0, 0);
  f1.scale.set(1.15, 0.85, 1.15);
  f1.castShadow = true;
  root.add(f1);

  const f2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 1), mat(PALETTE.greenMedium, 0.6));
  f2.position.set(0.15, 2.65, -0.1);
  f2.scale.set(1.0, 0.9, 1.0);
  f2.castShadow = true;
  root.add(f2);

  const f3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), mat(PALETTE.greenLight, 0.55));
  f3.position.set(-0.1, 3.25, 0.1);
  f3.castShadow = true;
  root.add(f3);

  return root;
}

function buildKenneyDefaultTree() {
  const root = new THREE.Group();
  root.name = 'Kenney_Tree_Default';

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 2.2, 6), mat(PALETTE.woodMedium, 0.7));
  trunk.position.y = 1.1;
  trunk.castShadow = true;
  root.add(trunk);

  const t1 = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.4, 7), mat(PALETTE.greenDark, 0.65));
  t1.position.y = 2.0;
  t1.castShadow = true;
  root.add(t1);

  const t2 = new THREE.Mesh(new THREE.ConeGeometry(1.05, 1.3, 7), mat(PALETTE.greenMedium, 0.6));
  t2.position.y = 2.75;
  t2.castShadow = true;
  root.add(t2);

  const t3 = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.1, 7), mat(PALETTE.greenLight, 0.55));
  t3.position.y = 3.45;
  t3.castShadow = true;
  root.add(t3);

  return root;
}

function buildKenneyRockLarge() {
  const root = new THREE.Group();
  root.name = 'Kenney_Rock_LargeA';

  const rockGeo = new THREE.DodecahedronGeometry(1.0, 1);
  const pos = rockGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < 0) pos.setY(i, y * 0.45);
  }
  rockGeo.computeVertexNormals();

  const rock = new THREE.Mesh(rockGeo, mat(PALETTE.rockMedium, 0.8));
  rock.scale.set(1.4, 0.9, 1.1);
  rock.position.y = 0.4;
  rock.castShadow = true;
  rock.receiveShadow = true;
  root.add(rock);

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
  b2.castShadow = true;
  root.add(b2);

  return root;
}

function buildKenneyFlower(colorHex, flowerName) {
  const root = new THREE.Group();
  root.name = flowerName;

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.6, 5), mat(PALETTE.flowerStem, 0.7));
  stem.position.y = 0.3;
  root.add(stem);

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

function buildRuralFence() {
  const root = new THREE.Group();
  root.name = 'Khmer_Rural_Fence';

  const woodM = mat(PALETTE.woodLight, 0.7);
  const postM = mat(PALETTE.woodDark, 0.75);

  // 2 Vertical Wooden Posts
  [-0.6, 0.6].forEach((x) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.85, 8), postM);
    post.position.set(x, 0.425, 0);
    post.castShadow = true;
    root.add(post);
  });

  // 2 Horizontal Bamboo / Wood Rails
  [0.28, 0.62].forEach((y) => {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.35, 8), woodM);
    rail.position.set(0, y, 0);
    rail.rotation.z = Math.PI / 2;
    rail.castShadow = true;
    root.add(rail);
  });

  return root;
}

// ----------------------------------------------------
// Main Build Pipeline
// ----------------------------------------------------
async function main() {
  console.log('--- Starting Khmer Art Direction Reset Asset Pipeline ---');

  const vendorQuaternius = 'public/assets/vendor/quaternius';
  const vendorKenneyForest = 'public/assets/vendor/kenney/mini-forest';

  const gameCow = 'public/assets/game/characters/cow';
  const gameTiger = 'public/assets/game/characters/tiger';
  const gameEnv = 'public/assets/game/environment';
  const gameKhmer = 'public/assets/game/khmer';

  const cowModel = buildCuteToyCow();
  const tigerModel = buildCuteToyTiger();
  const stiltHouse = buildKhmerStiltHouse();
  const clayJar = buildKhmerClayJar();
  const oakTree = buildKenneyOakTree();
  const defaultTree = buildKenneyDefaultTree();
  const rockLarge = buildKenneyRockLarge();
  const rockSmall = buildKenneyRockSmall();
  const bush = buildKenneyBush();
  const flowerRed = buildKenneyFlower(PALETTE.lotusRose, 'Flower_LotusPink');
  const flowerYellow = buildKenneyFlower(PALETTE.flowerYellow, 'Flower_Yellow');
  const grass = buildKenneyGrass();
  const fence = buildRuralFence();

  // Export vendor fallback
  await exportGLB(cowModel, `${vendorQuaternius}/cow.glb`);
  await exportGLB(oakTree, `${vendorKenneyForest}/tree_oak.glb`);
  await exportGLB(defaultTree, `${vendorKenneyForest}/tree_default.glb`);
  await exportGLB(rockLarge, `${vendorKenneyForest}/rock_largeA.glb`);
  await exportGLB(rockSmall, `${vendorKenneyForest}/rock_smallA.glb`);
  await exportGLB(flowerRed, `${vendorKenneyForest}/flower_redA.glb`);
  await exportGLB(flowerYellow, `${vendorKenneyForest}/flower_yellowA.glb`);
  await exportGLB(grass, `${vendorKenneyForest}/grass.glb`);
  await exportGLB(fence, `${vendorKenneyForest}/fence_simple.glb`);
  await exportGLB(bush, `${vendorKenneyForest}/plant_bush.glb`);

  // Export game models
  await exportGLB(cowModel, `${gameCow}/cow.glb`);
  await exportGLB(tigerModel, `${gameTiger}/tiger.glb`);
  await exportGLB(stiltHouse, `${gameKhmer}/khmer_stilt_house.glb`);
  await exportGLB(clayJar, `${gameKhmer}/clay_jar_kam.glb`);
  await exportGLB(oakTree, `${gameEnv}/tree_oak.glb`);
  await exportGLB(defaultTree, `${gameEnv}/tree_default.glb`);
  await exportGLB(rockLarge, `${gameEnv}/rock_largeA.glb`);
  await exportGLB(rockSmall, `${gameEnv}/rock_smallA.glb`);
  await exportGLB(flowerRed, `${gameEnv}/flower_redA.glb`);
  await exportGLB(flowerYellow, `${gameEnv}/flower_yellowA.glb`);
  await exportGLB(grass, `${gameEnv}/grass.glb`);
  await exportGLB(fence, `${gameEnv}/fence_simple.glb`);
  await exportGLB(bush, `${gameEnv}/plant_bush.glb`);

  console.log('--- Asset Pipeline Execution Complete ---');
}

main().catch((err) => {
  console.error('Asset Build Error:', err);
  process.exit(1);
});
