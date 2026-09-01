# Asset Documentation (Khla Si Ko v0.3)

This document catalogs all 15 physically generated and imported binary 3D GLB assets, vector badges, audio manifests, and cultural motifs utilized in **Khla Si Ko (ខ្លាស៊ីគោ — Khmer Tiger & Cow Game)** in full accordance with commercial and open-source licensing guidelines.

---

### 1. Characters (`public/assets/characters/`)
- **Cow Character Model**:
  - **File**: `public/assets/characters/cow/cow.glb`
  - **Vector Badge**: `public/assets/characters/cow/cow_badge.svg`
  - **Source**: Quaternius LowPoly Animals (Adapted & Tailored)
  - **Creator**: Quaternius & Khla Si Ko Development Team
  - **License**: CC0 1.0 Universal (Public Domain)
  - **Description**: Chibi toy cow with porcelain-wood finish, alternating cocoa patch patterns, rounded golden wood horns, baby-pink snout, and red collar with brass bell.
  - **Runtime integration**: Loaded via `src/3d/AssetManager.ts` & `src/3d/Cow3D.ts`.

- **Tiger Hero Character Model**:
  - **File**: `public/assets/characters/tiger/tiger.glb`
  - **Vector Badge**: `public/assets/characters/tiger/tiger_badge.svg`
  - **Source**: Khla Si Ko Hero Character Pipeline
  - **Creator**: Khla Si Ko Development Team
  - **License**: CC0 1.0 Universal (Public Domain)
  - **Description**: Chibi toy tiger with vibrant golden orange coat, cream cheeks, specular blinking eyes, articulated striped tail, and Khmer lotus crest forehead engraving.
  - **Runtime integration**: Loaded via `src/3d/AssetManager.ts` & `src/3d/Tiger3D.ts`.

---

### 2. Environment & Nature Props (`public/assets/environment/nature/`)
- **Source**: Kenney Nature Kit (CC0 1.0 Universal)
- **License**: CC0 1.0 Universal (Public Domain)
- **Files**:
  1. `public/assets/environment/nature/tree_oak.glb` — Stylized Oak tree with warm wooden trunk and layered foliage.
  2. `public/assets/environment/nature/tree_default.glb` — Village pine/conifer tree.
  3. `public/assets/environment/nature/rock_largeA.glb` — Smooth river boulder.
  4. `public/assets/environment/nature/rock_smallA.glb` — Garden pebble rock.
  5. `public/assets/environment/nature/plant_bush.glb` — Rounded diorama garden shrub.
  6. `public/assets/environment/nature/flower_redA.glb` — Stylized red diorama flower blossom.
  7. `public/assets/environment/nature/flower_yellowA.glb` — Stylized golden diorama flower blossom.
  8. `public/assets/environment/nature/grass.glb` — Clustered diorama grass blades.
  9. `public/assets/environment/nature/fence_simple.glb` — Rustic wooden village fence post and rail.
- **Runtime integration**: Loaded via `src/3d/AssetManager.ts` & `src/3d/DioramaEnvironment.ts`.

---

### 3. Khmer Cultural Props (`public/assets/khmer/`)
- **Source**: Traditional Cambodian Architectural & Ornamental Arts
- **Creator**: Khla Si Ko Development Team
- **License**: CC0 1.0 Universal (Public Domain)
- **Files**:
  1. `public/assets/khmer/architecture/khmer_pavilion.glb` — Miniature Cambodian Sala Chan pavilion with terracotta curved gable roofs and wooden columns.
  2. `public/assets/khmer/architecture/clay_jar_kam.glb` — Traditional Cambodian terracotta water storage pot (*K'am*) on a carved wooden base.
  3. `public/assets/khmer/ornaments/lotus_finial.glb` — Khmer lotus bud finial carving for board corners and roofs.
  4. `public/assets/khmer/ornaments/naga_ornament.glb` — Stylized serpentine Naga corner crest motif.
- **Runtime integration**: Loaded via `src/3d/AssetManager.ts`, `src/3d/DioramaEnvironment.ts`, and `src/3d/KhmerDecor3D.ts`.

---

### 4. Audio Architecture (`public/assets/audio/`)
- **Manifest**: `public/assets/audio/audio_manifest.json`
- **Engine**: `src/audio/SoundEffects.ts`
- **Source**: Real-time harmonic synthesizer with gentle toy frequencies.
- **License**: CC0 1.0 Universal (Public Domain)
- **Features**: Wooden clicks, cow placement bell pops, tiger jump whooshes, cartoon capture bursts, and pentatonic victory fanfares.

---

### 5. UI Icons & Typography
- **Icons**: Lucide React Icons (`lucide-react`) under ISC License.
- **Typography**: Kantumruy Pro (Khmer script) & Plus Jakarta Sans via Google Fonts (SIL Open Font License 1.1).
