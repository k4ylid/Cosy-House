# Cosy House — Professional Visual Polish & Art Direction Brief

## Mission

Take the existing Cosy House Three.js build and evolve it from a strong AI-built/procedural prototype into a polished, cohesive, game-quality 3D interior.

**Do not rebuild the project from zero unless there is a technical reason that materially improves maintainability or rendering quality.** Preserve the existing room layout, navigation, collision, camera/controller logic, and general composition where they already work.

The goal is to add the missing professional layer: better materials, lighting, image-based lighting, contact shading/AO, post-processing, selective higher-quality assets, atmospheric detail, color grading, camera polish, and performance-conscious rendering.

This is not a request to make the house photorealistic at any cost. It should remain warm, cozy, stylized, readable, performant, and coherent.

---

## Artistic freedom — important

You are explicitly encouraged to contribute your **own artistic judgment**.

The reference images and current Three.js build define the identity of the house, but they are not a cage. If you see a better way to stage a lamp, change a material, add a small prop, improve a corner, rebalance lighting, adjust a color, introduce subtle life/imperfection, or replace a weak procedural object with a stronger game-ready asset, do it when it improves the whole scene.

We want your touch in the result.

Use the mindset of a small professional environment-art team:
- preserve the design language;
- improve weak areas instead of mechanically copying them;
- prefer coherent art direction over random detail;
- avoid visual clutter;
- avoid making every surface glossy or every lamp bloom;
- keep a warm contemporary lived-in-home atmosphere;
- retain the subtle prayer-rug element as part of the home rather than turning the entire house into a themed set.

When choosing assets, materials, effects, or lighting, make the decision yourself based on what best fits the actual scene and codebase.

---

# Phase 0 — Preserve a baseline

Before the visual overhaul:

1. Get the existing build running unchanged.
2. Capture representative screenshots from the same fixed camera positions:
   - bedroom
   - hallway
   - bathroom
   - kitchen
   - living room
3. Record basic performance numbers on desktop and, if practical, a representative mobile device/emulation.
4. Keep these baseline shots for A/B comparison.

Do not judge success only from code. The final gate is visual.

---

# Phase 1 — Modernize the project foundation carefully

The current prototype used a locally vendored Three.js build. Move to a normal package-based development setup if that can be done without destabilizing the scene.

Preferred direction:
- Vite
- npm/pnpm
- current compatible stable `three`
- one coherent post-processing solution
- GLTFLoader for imported assets
- KTX2 / Meshopt / Draco only when they provide a measurable benefit

Do not upgrade blindly. Validate the project after each foundational change.

Useful official references:
- Three.js: https://threejs.org/
- Three.js post-processing guide: https://threejs.org/manual/en/post-processing.html
- EffectComposer docs: https://threejs.org/docs/#examples/en/postprocessing/EffectComposer
- GTAO pass: https://threejs.org/docs/#examples/en/postprocessing/GTAOPass
- GLTFLoader: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- KTX2Loader: https://threejs.org/docs/#examples/en/loaders/KTX2Loader
- PMREMGenerator: https://threejs.org/docs/#api/en/extras/PMREMGenerator

Alternative / preferred external post-processing library if it fits the project better:
- pmndrs/postprocessing: https://github.com/pmndrs/postprocessing

Choose **one** principal post-processing architecture. Do not combine systems just because they exist.

---

# Phase 2 — Build the professional rendering layer

Replace a direct-only final render path with a deliberate render pipeline/composer.

Candidate effects, to be selected by visual value and measured cost:

### High priority
- AO / GTAO / SSAO for contact depth
- high-quality anti-aliasing appropriate to the target hardware
- restrained color grading
- exposure/tone control
- subtle selective bloom for practical lights

### Optional, only if they genuinely help
- vignette
- very subtle film grain
- depth of field for cinematic/static moments, not normal gameplay
- light shafts / god rays where physically believable
- small chromatic effects only if artistically justified

### Avoid
- strong global bloom
- fake “cinematic” effects that reduce clarity
- constant depth-of-field during walking
- excessive vignette
- unnecessary expensive passes

Add an easy way to toggle major visual effects during development for A/B testing and performance profiling.

---

# Phase 3 — Environment lighting / IBL

Introduce proper image-based lighting where it improves PBR response.

Use an HDRI/environment map through PMREM or an equivalent physically based workflow.

The HDRI does **not** have to replace the visible outside/night background. It may be used only as an invisible lighting/reflection source.

Goals:
- believable indirect illumination;
- better reflections on metal, ceramic, glass, polished wood, and fixtures;
- more natural material response;
- preserve the warm interior / cool exterior contrast.

Primary free source:
- Poly Haven: https://polyhaven.com/

Poly Haven assets are CC0 and suitable for commercial use.

---

# Phase 4 — Rebuild the material language

The current procedural material work is a good base, but move important surfaces toward complete PBR material definitions where worthwhile.

Prioritize:
- wood floor
- rugs / fabrics
- plaster walls
- ceramic / bathroom tile
- kitchen surfaces
- metal fixtures
- glass
- leather / upholstery if present

Use combinations of:
- base color
- normal
- roughness
- AO
- metalness where appropriate
- displacement/height only when it adds value and does not hurt performance

Do not use maximum-resolution textures everywhere.

Create reusable material presets/components so the house does not become a collection of one-off material hacks.

Primary free material/HDRI/model source:
- Poly Haven: https://polyhaven.com/

---

# Phase 5 — Lighting art pass

Audit the current collection of point lights and redesign it as an intentional lighting hierarchy.

Think in terms of:
- cool exterior/window/moon contribution;
- warm practical lamps;
- restrained fill;
- indirect/environment contribution;
- selected shadow-casting hero lights.

Not every visible bulb needs an expensive shadow-casting point light.

Use emissive materials and non-shadow lights where they can create the appearance at lower cost.

Focus on:
- attractive light falloff;
- believable warm/cool contrast;
- readable room silhouettes;
- soft but grounded contact;
- no overexposed lamps;
- no uniformly bright corners.

---

# Phase 6 — Selective asset upgrade, not asset replacement everywhere

Keep procedural geometry where it looks good and serves the style.

Replace only the objects whose primitive construction visibly weakens the scene.

Good candidates may include:
- plants
- lamps
- cushions
- blankets
- chairs
- faucets
- bathroom fixtures
- bottles
- books
- decorative props
- selected furniture hero pieces

Imported assets should preferably be:
- glTF / GLB first;
- FBX only when conversion is sensible;
- game-ready;
- reasonably low/medium poly;
- coherent with the existing stylized visual language;
- legally usable in a commercial project.

You have authority to choose the assets yourself.

Do **not** fill the house with unrelated high-detail marketplace models. A coherent $0 asset can be better than an expensive model that breaks the art direction.

---

# Approved free/commercial-friendly source pool

## Poly Haven
https://polyhaven.com/

Best for:
- HDRIs
- PBR materials/textures
- selected realistic props/models

License:
- CC0

## Quaternius
https://quaternius.com/

Best for:
- stylized low-poly/game-ready 3D models
- props
- furniture/environment kits
- animations/characters when relevant

Current Quaternius Asset License permits use in commercial projects without attribution, while prohibiting redistribution of the raw assets as an asset pack.

## Kenney
https://kenney.nl/assets

Best for:
- clean game-ready asset packs
- UI / prototype support
- modular/stylized 3D
- supplementary props

Kenney game assets are CC0.

---

# Paid sources — research freely, purchase only after owner approval

You may browse these and propose a specific asset when it would materially improve the house.

## Fab
https://www.fab.com/

Useful for:
- premium props
- furniture
- materials
- environment kits
- VFX

Important:
- prefer downloadable source formats usable outside Unreal;
- verify GLB/glTF/FBX/textures before recommending;
- verify the individual asset license;
- do not purchase or assume a paid asset is approved without owner approval.

Fab's Standard License permits commercial project use and use with compatible tools, but raw assets may not be redistributed standalone.

## GameDev Market
https://www.gamedevmarket.net/

Useful for:
- affordable game-asset packs
- bundle hunting
- props/materials/VFX

Same rule: research and shortlist autonomously; purchase requires owner approval.

---

# Asset licensing discipline

For every external asset actually committed to the project, add it to:

`docs/ASSET_PROVENANCE.md`

Record:
- asset name
- source URL
- creator/publisher
- license
- date acquired
- files used
- whether modified
- attribution requirement, if any

Never copy a random model or texture from Google Images, Pinterest, a portfolio page, or an unknown mirror.

Never assume “free download” means commercial use is allowed.

If license terms are unclear, do not use the asset.

---

# Phase 7 — Art pass: Devin's signature

After the technical rendering work, perform a dedicated environment-art pass.

You may add or adjust:
- tasteful small props
- subtle asymmetry
- tiny color variations
- object rotations/placement
- fabric variation
- shelf composition
- plant placement
- table/counter details
- lighting accents
- wall decoration
- small signs of life

The goal is to remove the “AI placed everything perfectly” feeling.

However:
- do not clutter walking paths;
- do not damage collision/navigation;
- do not change the core floor plan without a reason;
- do not over-theme the house;
- do not add religious decoration everywhere;
- preserve the single subtle prayer-rug/home-life detail.

When in doubt, make the room feel **lived in, calm, warm, tasteful, and intentional**.

---

# Phase 8 — Camera and movement polish

Audit:
- first-person camera damping
- third-person follow behavior
- field of view
- head bob
- acceleration/deceleration
- turn smoothing
- camera collision/clipping
- doorway transitions

Any camera motion should support comfort and quality.

Avoid aggressive head bob, shake, or effects that create motion sickness.

---

# Phase 9 — Performance and mobile quality tiers

The house should look better without becoming a desktop-only showcase.

Create quality tiers where sensible:

### High
- full AO
- higher shadow resolution
- best post-processing
- full environment/reflection quality

### Medium
- reduced AO/shadow quality
- restrained post effects
- normal material fidelity

### Low/mobile
- reduced shadow casters
- lighter AO or disabled AO if required
- fewer expensive effects
- compressed textures
- conservative pixel ratio

Possible optimization tools:
- KTX2/Basis textures
- Meshopt or Draco for imported geometry when beneficial
- instancing for repeated props
- texture-size discipline
- shadow caster reduction
- distance-based detail where needed

Performance work should be evidence-based. Measure before and after.

---

# Acceptance criteria

The task is not complete because a library was installed.

It is complete when:

1. The house still functions correctly.
2. Existing navigation/collision/controller behavior has not regressed.
3. Side-by-side screenshots clearly show an improvement over the baseline.
4. Important materials react convincingly to light.
5. Corners and object contacts have stronger depth/grounding.
6. Lamps feel luminous without cartoonish bloom.
7. Lighting is intentional and coherent room-to-room.
8. Imported assets fit the same visual language.
9. There is a visible artistic pass beyond mechanical library installation.
10. No unlicensed/unclear asset has been added.
11. Performance is measured and remains reasonable.
12. Mobile/low-quality fallback exists if the high-end stack is too expensive.
13. `docs/ASSET_PROVENANCE.md` documents every external asset used.
14. Before/after screenshots are included in the PR or project documentation.

---

# Working method

Do not perform this as one giant blind visual rewrite.

Work in checkpoints:

1. baseline
2. renderer/dependency foundation
3. IBL + lighting
4. AO/post-processing
5. PBR material pass
6. selective asset replacement
7. artistic pass
8. optimization
9. final A/B review

At each step, keep what visibly improves the result and remove what does not.

The objective is not “use more libraries.”

The objective is:

> **Make this specific house look like a coherent game environment finished by a small professional 3D team, while still preserving the personality of the original build and adding Devin's own artistic signature.**
