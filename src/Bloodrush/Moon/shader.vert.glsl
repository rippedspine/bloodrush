varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;

varying vec3 vLightFront;
 
void main() {
  vUv = uv;
  vecPos = (modelMatrix * vec4(position, 1.0 )).xyz;
  vecNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

  gl_Position = projectionMatrix * viewMatrix * vec4(vecPos, 1.0);
}