/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Color correction
 */
import THREE from 'three';

import vertexShader from './shader.vert.glsl';
import fragmentShader from './shader.frag.glsl';

export default {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "powRGB":   { type: "v3", value: new THREE.Vector3( 2, 2, 2 ) },
    "mulRGB":   { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
    "addRGB":   { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}
