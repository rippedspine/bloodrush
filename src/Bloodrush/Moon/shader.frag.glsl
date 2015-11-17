precision highp float;
 
varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;
 
uniform float color;
uniform sampler2D textureMap;
 
uniform vec3 directionalLightColor[MAX_DIR_LIGHTS];
uniform vec3 directionalLightDirection[MAX_DIR_LIGHTS];

vec3 transformDirection( in vec3 normal, in mat4 matrix ) {
  return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );
}
 
void main(void) {
  vLightFront = vec3(0.0);

  transformedNormal = normalize( transformedNormal );

  for(int i = 0; i < MAX_DIR_LIGHTS; i++) {
    vec3 dirVector = transformDirection(directionalLightDirection[i], viewMatrix);
    float dotProduct = dot( transformedNormal, dirVector );
    vec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );

    vLightFront += directionalLightColor[ i ] * directionalLightWeighting;
  }

  vLightFront += ambientLightColor;

  gl_FragColor = texture2D(textureMap, vUv) * addedLights;
}