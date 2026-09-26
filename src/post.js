import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

/* ---------- subtle grade: warm lift, gentle contrast, faint vignette ---------- */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    warmth: { value: 0.02 },
    saturation: { value: 1.05 },
    lift: { value: 0.008 },
    vignette: { value: 0.12 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float warmth, saturation, lift, vignette;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      /* lift shadows a touch so dark corners stay readable, not crushed */
      c.rgb = c.rgb * (1.0 - lift) + vec3(lift) * vec3(1.0, 0.96, 0.9);
      /* warm push */
      c.rgb += warmth * vec3(1.0, 0.55, 0.15) * c.rgb;
      /* saturation */
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb = mix(vec3(l), c.rgb, saturation);
      /* gentle vignette */
      float d = distance(vUv, vec2(0.5));
      c.rgb *= 1.0 - vignette * smoothstep(0.45, 0.95, d);
      gl_FragColor = c;
    }
  `,
};

/*
 * Quality tiers:
 *   high   — GTAO + bloom + grade + SMAA
 *   medium — GTAO(low) + bloom + grade + SMAA
 *   low    — plain renderer (no composer), MSAA only
 */
export function createPipeline(renderer, scene, camera) {
  const state = {
    quality: 'high',
    postEnabled: true,
    composer: null,
    passes: {},
    width: 1, height: 1, pixelRatio: 1,
  };

  function build() {
    if (state.composer) {
      state.composer.dispose?.();
      state.composer = null;
      state.passes = {};
    }
    const { width: w, height: h, pixelRatio: pr, quality: q } = state;
    if (q === 'low' || !state.postEnabled) {
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      renderer.setClearColor(0x1a1520);
      return;
    }
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(pr);
    composer.setSize(w, h);

    composer.addPass(new RenderPass(scene, camera));

    const gtao = new GTAOPass(scene, camera, w * pr, h * pr);
    gtao.output = GTAOPass.OUTPUT.Default;
    gtao.updateGtaoMaterial({
      radius: 0.35, distanceExponent: 1.6, thickness: 1.2,
      scale: 1.1, samples: q === 'high' ? 16 : 8,
      distanceFallOff: 1.0, screenSpaceRadius: false,
    });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 4, radius: 3, rings: 3, samples: q === 'high' ? 12 : 6 });
    composer.addPass(gtao);

    /* threshold >1 so only genuinely emissive things (lamps, windows) bloom */
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.14, 0.3, 1.9);
    composer.addPass(bloom);

    const grade = new ShaderPass(GradeShader);
    composer.addPass(grade);

    composer.addPass(new OutputPass());
    composer.addPass(new SMAAPass());

    state.composer = composer;
    state.passes = { gtao, bloom, grade };
    return composer;
  }

  function setSize(w, h, pr) {
    state.width = w; state.height = h; state.pixelRatio = pr;
    build();
  }
  function setQuality(q) { state.quality = q; build(); }
  function setPostEnabled(on) { state.postEnabled = on; build(); }

  return {
    state,
    setSize, setQuality, setPostEnabled,
    render() {
      if (state.composer) state.composer.render();
      else renderer.render(scene, camera);
    },
    get passes() { return state.passes; },
  };
}
