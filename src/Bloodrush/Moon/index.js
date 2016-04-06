import THREE from 'three';
import { GUI } from 'dat-gui';

import { default as vertexShader } from './shader.vert.glsl';
import { default as fragmentShader } from './shader.frag.glsl';

const { cos, sin } = Math;
const { now } = Date;

// -- textures
import textureMoon from './textures/moon.jpg';
import textureNormal from './textures/normal.jpg';

const loader = new THREE.TextureLoader();

const images = [
  { url: textureMoon, name: 'moon' },
  { url: textureNormal, name: 'normal' }
];

var gui = new GUI();

var blendings = [
  THREE.NoBlending,
  THREE.NormalBlending,
  THREE.AdditiveBlending,
  THREE.SubtractiveBlending,
  THREE.MultiplyBlending,
  THREE.AdditiveAlphaBlending
];

var options = {
  // color: 0xa2a2a2,
  color: 0x282828,
  specular: 0x000000,
  shininess: 0,
  blending: blendings[2],
  normalScale: new THREE.Vector2( 0.4, 0.4 )
};

export default class Moon extends THREE.Object3D {
  load (onLoaded) {
    load((textures) => {
      const material = new THREE.MeshPhongMaterial({
        color: options.color,
        specular: options.specular,
        shininess: options.shininess,
        map: textures.moon,
        normalMap: textures.normal,
        normalScale: options.normalScale,
        blending: options.blending,
        transparent: true
      });

      const geometry = new THREE.SphereGeometry(1.5, 50, 50);

      gui.addColor(options, 'color');
      gui.addColor(options, 'specular');
      gui.add(options, 'shininess', 0, 100);
      gui.add(options, 'blending', 0, blendings.length);

      gui.remember(options);
      gui.domElement.style.display = 'none';

      this.mesh = new THREE.Mesh(geometry, material);
      this.add(this.mesh);

      onLoaded();
    })
  }

  rotate () {
    this.rotation.y += 0.005;
  }

  render () {
    const { material } = this.mesh;

    material.color.set(options.color);
    material.specular.set(options.color);
  }
}

function load (onLoaded) {
  const total = images.length;
  var completed = 0;
  var textures = {};

  const onLoad = (name, texture) => {
    textures[name] = texture;
    if (completed++ === total - 1) {
      onLoaded(textures);
    }
  }

  images.forEach(image => {
    loader.load(image.url, onLoad.bind(this, image.name), (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, (xhr) => {
      console.log('Loading errored');
    })
  })
}
