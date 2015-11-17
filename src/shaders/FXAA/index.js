/**
 * @author alteredq / http://alteredqualia.com/
 * @author davidedc / http://www.sketchpatch.net/
 *
 * NVIDIA FXAA by Timothy Lottes
 * http://timothylottes.blogspot.com/2011/06/fxaa3-source-released.html
 * - WebGL port by @supereggbert
 * http://www.glge.org/demos/fxaa/
 */
import THREE from 'three';

import vertexShader from './shader.vert.glsl';
import fragmentShader from './shader.frag.glsl';

export default {
  uniforms: {
    "tDiffuse":   { type: "t", value: null },
    "resolution": { type: "v2", value: new THREE.Vector2( 1 / 1024, 1 / 512 ) }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}