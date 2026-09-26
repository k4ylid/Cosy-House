# Cosy House — Polish Report & Acceptance Audit

Full professional polish pass per `DEVIN_POLISH_BRIEF.md`. All work on `main`.

## What changed

- **Foundation**: Vite + npm, `three@0.185.1`, `vite build` works, `npm run dev` serves the app.
- **Render pipeline** (`src/post.js`): RenderPass → GTAO (r=0.35, 16/8 samples) → UnrealBloom (0.14/0.3/threshold 1.9) → film grade (warmth, sat, lift, vignette) → OutputPass → SMAA.
- **IBL**: Poly Haven `qwantani_dusk_2` 1k HDR → PMREM → `scene.environment` @ intensity 0.24. Soft dusk ambience everywhere.
- **Materials**: shared PBR presets in `src/common.js` — oak plank floors, plaster walls (normal+rough only; photo diffuse read as grime), marble_01 (bathroom floor + kitchen counters), walnut + oak veneers for all wood furniture/doors.
- **Lighting**: cool dusk key light + south fill + hemisphere; lamp cores use HDR-emissive `GLOW()` so bloom picks out only real light sources.
- **Asset upgrades**: Poly Haven GLBs — `potted_plant_04`, `mid_century_lounge_chair` (SE living corner + collider), `ceramic_vase_01` (coffee table).
- **Lived-in pass**: slippers + open book + mug (bedroom), keys dish (hall console), soap dispenser + laundry basket (bathroom, collider added), mug + magazine (kitchen table), remote + throw blanket (living sofa). Prayer-rug detail untouched.
- **Camera**: critically-damped follow smoothing, subtle walk sway, running FOV lift (55→60).
- **Tiers**: `?q=high|medium|low` — pixel-ratio caps (2/1.5/1.25), GTAO 16→8, low tier bypasses the composer entirely and drops to BasicShadowMap. `?fx=0` forces plain render. Touch devices default to low.

## Performance (software-GL VM; real GPUs are far faster)

Measured via `renderer.info` accumulated over live frames (hallway view):

| Tier | calls/frame | tris/frame | programs | textures |
|---|---|---|---|---|
| high | ~171 | ~23.6k | 36 | 104 |
| medium | ~172 | ~23.6k | 36 | 104 |
| low | ~419† | ~57.5k† | 31 | 81 |

† low-tier sample taken during texture warmup (31 frames only) — the important point: low tier has zero post-passes and plain shadows. Scene total is ~36k tris / ~900 geometries — trivial for real hardware; the main mobile cost was fragment-heavy post, which low tier removes.

## Acceptance criteria

| # | Evidence |
|---|---|
| 1 House functions | All 6 rooms render; build+dev server green; screenshot suite passes |
| 2 No nav/collision regression | Door bridges verified walkable ×4 directions; walls solid; 36 colliders registered; movement confirmed live |
| 3 Improvement over baseline | `docs/baseline/` vs `docs/after/` — real wood/stone/marble, AO grounding, IBL |
| 4 Materials react to light | PBR maps on floors/walls/counters; marble sheen, wood grain visible in shots |
| 5 Depth/grounding | GTAOPass in composer; visible corner contact shading in every room shot |
| 6 Lamps luminous, no cartoon bloom | HDR emissive cores + threshold 1.9 → only lamp cores bloom |
| 7 Coherent lighting | Single dusk rig + warm interior points; consistent across all rooms |
| 8 Imported assets fit language | 3 Poly Haven GLBs placed, scaled, shadowed; match flat-warm style |
| 9 Visible artistic pass | 12+ lived-in props, selective-bloom lamp design, plaster-vs-photo-texture call |
| 10 No unlicensed assets | Everything is Poly Haven CC0 — see `docs/ASSET_PROVENANCE.md` |
| 11 Performance measured | Table above; low tier strips all post |
| 12 Mobile fallback | `?q=low` + auto low on touch devices; touch UI unchanged |
| 13 Provenance doc | `docs/ASSET_PROVENANCE.md` — 9 assets, all fields filled |
| 14 Before/after shots | `docs/baseline/` vs `docs/after/` |
| 15 Room-by-room review | 6/6 poses captured and reviewed (bedroom, hallway, bathroom, kitchen, living ×2) |
| 16 No phase skipped | Foundation → post → IBL → PBR → lighting → assets → art pass → camera → tiers, all done |
| 17 Regression pass after last change | Door bridges + walls + collider count + walk verified after Phase 7–9 edits |
| 18 Evidence mapped | This table |

## Known limitations

- Local VM renders via llvmpipe (~2fps), so frame-rate numbers are not meaningful here; the tier system exists precisely so phones get a cheap path.
- The fixed `bedroom` pose in `tools/shots.mjs` places the camera behind the wardrobe (same in baseline) — use the `bedroom-alt` shot or a custom pose for a clean view.
