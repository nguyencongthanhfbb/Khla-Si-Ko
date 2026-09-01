# Asset Documentation (Khla Si Ko v0.4 — Khmer Art Direction Reset)

This document catalogs all physically generated and imported binary 3D GLB assets, vector badges, audio manifests, and cultural motifs utilized in **Khla Si Ko (ខ្លាស៊ីគោ — Khmer Tiger & Cow Game)** in full accordance with commercial and open-source licensing guidelines.

---

### 1. Characters (`public/assets/game/characters/`)
- **Cute Khmer Toy Cow Model**:
  - **File**: `public/assets/game/characters/cow/cow.glb`
  - **Vector Badge**: `public/assets/characters/cow/cow_badge.svg`
  - **Source**: Handcrafted Khmer Wooden Toy Pipeline (Harmonized with Quaternius LowPoly Animal Scale)
  - **License**: CC0 1.0 Universal (Public Domain)
  - **Description**: Chibi toy cow with warm painted porcelain-wood finish, smooth cocoa patches, rounded golden wood horns, soft baby-pink snout, and red collar with brass bell.
  - **Runtime integration**: Loaded via `src/3d/AssetManager.ts` & `src/3d/Cow3D.ts`.

- **Cute Khmer Toy Tiger Model**:
  - **File**: `public/assets/game/characters/tiger/tiger.glb`
  - **Vector Badge**: `public/assets/characters/tiger/tiger_badge.svg`
  - **Source**: Handcrafted Khmer Wooden Toy Pipeline
  - **License**: CC0 1.0 Universal (Public Domain)
  - **Description**: Chibi toy tiger with vibrant warm golden orange coat, cream cheeks, smiling muzzle, large glossy expressive eyes with sparkles, soft rounded ears, segmented curved tail, and painted wooden tiger stripes (clean forehead without arbitrary emblems).
  - **Runtime integration**: Loaded via `src/3d/AssetManager.ts` & `src/3d/Tiger3D.ts`.

---

### 2. Environment & Nature Props (`public/assets/game/environment/`)
- **Source**: Kenney Nature Kit (CC0 1.0 Universal)
- **License**: CC0 1.0 Universal (Public Domain)
- **Files**:
  1. `public/assets/game/environment/tree_oak.glb` — Stylized Oak tree with warm wooden trunk and layered foliage.
  2. `public/assets/game/environment/tree_default.glb` — Village pine/conifer tree.
  3. `public/assets/game/environment/rock_largeA.glb` — Smooth river boulder.
  4. `public/assets/game/environment/rock_smallA.glb` — Garden pebble rock.
  5. `public/assets/game/environment/plant_bush.glb` — Rounded diorama garden shrub.
  6. `public/assets/game/environment/flower_redA.glb` — Stylized lotus rose diorama flower blossom.
  7. `public/assets/game/environment/flower_yellowA.glb` — Stylized golden diorama flower blossom.
  8. `public/assets/game/environment/grass.glb` — Clustered diorama grass blades.
  9. `public/assets/game/environment/fence_simple.glb` — Rustic bamboo and wooden courtyard fence.
- **Runtime integration**: Loaded via `src/3d/AssetManager.ts` & `src/3d/DioramaEnvironment.ts`.

---

### 3. Khmer Cultural Props (`public/assets/game/khmer/`)
- **Source**: Traditional Cambodian Rural Courtyard & Ornamental Art
- **License**: CC0 1.0 Universal (Public Domain)
- **Files**:
  1. `public/assets/game/khmer/khmer_stilt_house.glb` — Traditional Cambodian rural stilt house on visible wooden stilts with sloped gabled roof, wooden walls, and front porch with steps.
  2. `public/assets/game/khmer/clay_jar_kam.glb` — Traditional Cambodian terracotta water storage pot (*K'am*) on a handcrafted wooden pedestal.
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
