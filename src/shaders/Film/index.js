/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Film grain & scanlines shader
 *
 * - ported from HLSL to WebGL / GLSL
 * http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
 *
 * Screen Space Static Postprocessor
 *
 * Produces an analogue noise overlay similar to a film grain / TV static
 *
 * Original implementation and noise algorithm
 * Pat 'Hawthorne' Shearon
 *
 * Optimized scanlines + noise version with intensity scaling
 * Georg 'Leviathan' Steinrohder
 *
 * This version is provided under a Creative Commons Attribution 3.0 License
 * http://creativecommons.org/licenses/by/3.0/
 */

import vertexShader from './shader.vert.glsl'
import fragmentShader from './shader.frag.glsl'

export default {
  uniforms: {
    'tDiffuse': { type: 't', value: null },
    'time': { type: 'f', value: 0.0 },
    'nIntensity': { type: 'f', value: 0.5 },
    'sIntensity': { type: 'f', value: 0.05 },
    'sCount': { type: 'f', value: 4096 },
    'grayscale': { type: 'i', value: 1 }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}
