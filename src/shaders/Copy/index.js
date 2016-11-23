/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

import vertexShader from './shader.vert.glsl'
import fragmentShader from './shader.frag.glsl'

export default {
  uniforms: {
    'tDiffuse': { type: 't', value: null },
    'opacity': { type: 'f', value: 1.0 }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}
