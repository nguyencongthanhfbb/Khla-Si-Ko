# Asset Documentation (Khla Si Ko v0.2)

This document catalogs all assets, visual designs, procedural geometry, sound architectures, and cultural motifs utilized in **Khla Si Ko (ខ្លាស៊ីគោ — Khmer Tiger & Cow Game)** in full accordance with commercial and open source licensing guidelines.

---

### 1. 3D Procedural Hero Characters (Tiger & Cow)
- **Asset**: Chibi Wooden Toy Tiger (`Tiger3D`) & Chibi Wooden Toy Cow (`Cow3D`)
- **Source**: Procedural parametric 3D geometry engine using Three.js
- **URL**: Built-in procedural synthesis (`src/3d/Tiger3D.ts`, `src/3d/Cow3D.ts`)
- **Creator**: Project Development Team
- **License**: Apache-2.0 / CC0
- **How used**: Primary interactive 3D board game pieces rendered on a 4x4 handcrafted wooden grid.
- **Modification**: Custom rounded chibi proportions, double-highlight specular blinking eyes, articulated tail curves, ear wiggle state animations, and Khmer lotus crest forehead engraving (eliminating any non-Khmer cultural symbols).

---

### 2. Khmer Cultural Decorative Layer
- **Asset**: `KhmerBoardBorder3D`, `KhmerCornerOrnament3D`, `KhmerRoofMiniature3D`, `KhmerGardenProps3D`
- **Source**: Custom procedural architectural & ornamental models inspired by traditional Cambodian crafts
- **URL**: Built-in procedural synthesis (`src/3d/KhmerDecor3D.ts`)
- **Creator**: Project Development Team
- **License**: Apache-2.0 / CC0
- **How used**:
  - **Border & Corners**: Beveled teak wood frame with rhythmic geometric Kbach relief and antique gold lotus finials.
  - **Miniature Roofs**: Traditional Cambodian wooden pavilion / Sala Chan silhouette with curved terracotta gables on wooden stilts.
  - **Garden Props**: Traditional Cambodian clay water jars (*K'am* / earthenware pots on carved wooden stands), bamboo fences, and stone lotus pads.
- **Modification**: Designed strictly following Khmer visual identity, avoiding generic or mixed cultural forms.

---

### 3. Environment & Nature Diorama Props
- **Asset**: Stylized Low-Poly Miniature Village Trees, Bamboo Mat, Lotus Water Pads, River Pebbles
- **Source**: Low-poly nature kit geometry reference (inspired by Kenney.nl CC0 Nature Kit and Poly Haven natural palettes)
- **URL**: https://kenney.nl/ (CC0 Public Domain)
- **Creator**: Kenney / Procedural implementation
- **License**: CC0 1.0 Universal (Public Domain)
- **How used**: Surrounding 3D village garden diorama setting framed on a dark rosewood tabletop.
- **Modification**: Adapted to a soft toy finish with warm matte materials.

---

### 4. Audio Architecture & Sound Effects
- **Asset**: Web Audio API Procedural Synthesizer (`SoundEffects.ts`)
- **Source**: Real-time sine/triangle harmonic synthesizer with gentle toy frequencies
- **URL**: `src/audio/SoundEffects.ts`
- **Creator**: Project Development Team
- **License**: Apache-2.0 / CC0
- **How used**: Piece placement pops, wooden hop thuds, friendly capture chimes, victory flourishes, and button feedback.
- **Modification**: Tuned with low harmonic distortion for a warm, soothing wooden toy feel.

---

### 5. UI Icons & Typography
- **Asset**: Lucide React Icons
- **Source**: Lucide Project
- **URL**: https://lucide.dev/
- **Creator**: Lucide Contributors
- **License**: ISC License (Permissive commercial use)
- **How used**: Navigation controls, pause menu, tutorial arrows, audio/haptic toggles.
- **Asset**: Khmer Unicode Font Family (`Kantumruy Pro` / System Khmer)
- **Source**: Google Fonts
- **URL**: https://fonts.google.com/specimen/Kantumruy+Pro
- **Creator**: Tegusu Inc / Google Fonts
- **License**: SIL Open Font License 1.1
- **How used**: High-legibility Khmer script rendering (`ខ្លាស៊ីគោ`) throughout home, HUD, and tutorial interfaces.
