# Asset Documentation (Khla Si Ko — Khmer Art Direction v0.4)

This document catalogs all 3D GLB assets, vendor files, vector badges, audio manifests, and cultural motifs utilized in **Khla Si Ko (ខ្លាស៊ីគោ — Khmer Tiger & Cow Game)** in full accordance with commercial and open-source licensing guidelines.

---

### 1. Vendor 3D Assets

#### Quaternius (`public/assets/vendor/quaternius/`)
- **Source Pack**: Quaternius LowPoly Animals Pack
- **License**: CC0 1.0 Universal (Public Domain)
- **Local File**: `public/assets/vendor/quaternius/cow.glb`
- **Description**: Original 3D Cow model adapted directly at runtime via `CowAssetAdapter.ts` for scale, orientation, material finish, and animations.
- **Runtime Integration**: Loaded directly via `src/3d/AssetManager.ts` & `src/3d/CowAssetAdapter.ts`.

#### Kenney (`public/assets/vendor/kenney/`)
- **Source Pack**: Kenney Mini-Forest Kit & Nature Kit
- **License**: CC0 1.0 Universal (Public Domain)
- **Source URL**: https://kenney.nl/assets
- **Local Files**:
  1. `public/assets/vendor/kenney/mini-forest/tree_oak.glb` — Oak tree with wooden trunk and layered canopy.
  2. `public/assets/vendor/kenney/mini-forest/tree_default.glb` — Conifer/village tree.
  3. `public/assets/vendor/kenney/mini-forest/fence_simple.glb` — Rustic bamboo/wood fencing.
  4. `public/assets/vendor/kenney/mini-forest/rock_largeA.glb` — Smooth river boulder.
  5. `public/assets/vendor/kenney/mini-forest/rock_smallA.glb` — Garden stone pebble.
  6. `public/assets/vendor/kenney/mini-forest/plant_bush.glb` — Rounded courtyard shrub.
  7. `public/assets/vendor/kenney/mini-forest/flower_redA.glb` — Stylized blossom.
  8. `public/assets/vendor/kenney/mini-forest/flower_yellowA.glb` — Stylized blossom.
  9. `public/assets/vendor/kenney/mini-forest/grass.glb` — Clustered diorama grass blades.
- **Runtime Integration**: Loaded directly via `src/3d/AssetManager.ts` & `src/3d/DioramaEnvironment.ts`.

---

### 2. Characters & Visual Identity

- **Cute Khmer Toy Tiger Mascot**:
  - **File**: `public/assets/game/characters/tiger/tiger.glb`
  - **Vector Badge**: `public/assets/characters/tiger/tiger_badge.svg`
  - **Description**: Chibi toy tiger with warm golden-orange painted lacquer finish, cream cheeks, smiling muzzle, large glossy expressive eyes, soft rounded ears, segmented curved tail, and painted wooden tiger stripes (clean forehead without arbitrary emblems).
  - **Runtime Integration**: Loaded via `src/3d/AssetManager.ts` & `src/3d/Tiger3D.ts`.

- **Cute Khmer Toy Cow**:
  - **Vector Badge**: `public/assets/characters/cow/cow_badge.svg`
  - **Description**: Matched in scale, proportions, painted wood lacquer finish, and expressive glossy eyes with the Tiger toy.

---

### 3. Handcrafted Khmer Cultural Architecture & Board (`src/3d/KhmerDecor3D.ts`)

- **Traditional Khmer Stilt House (`KhmerStiltHouse3D`)**:
  - Designed directly from authentic Cambodian rural stilt architecture (*Phteah Khmer*):
    - Solid timber pillars/stilts with foundation
    - Raised wooden platform & veranda with railings and entrance ladder
    - High-sloped gable terracotta tile roof with curved crest ridge finials
    - Terracotta water storage jar (*K'am*) on wooden stand at base
- **Handcrafted Khmer Wooden Board (`Board3D` & `KhmerDecor3D`)**:
  - Dark teak and rosewood beveled frame
  - Rhythmic carved wooden **Kbach** leaf/petal frieze relief (*Kbach Phni Tes*) along all four borders
  - Carved wooden corner brackets with subtle lotus/Naga curves and restrained gold accent beads
  - Inset warm cream/sand wooden playing tiles

---

### 4. Audio & Typography

- **Audio Engine**: `src/audio/SoundEffects.ts` with harmonic toy sound synthesis (wooden clicks, bell placements, whoosh leaps, pentatonic victory fanfare).
- **Icons**: Lucide React Icons (`lucide-react`) under ISC License.
- **Typography**: Kantumruy Pro (Khmer script) & Plus Jakarta Sans via Google Fonts (SIL Open Font License 1.1).
