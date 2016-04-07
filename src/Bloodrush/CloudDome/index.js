import THREE from 'three'

import textureCloud from './textures/cloud.png'

const { cos, sin } = Math
const { now } = Date

const images = [
  { url: textureCloud, name: 'cloud' }
]

const loader = new THREE.TextureLoader();

export default class CloudDome extends THREE.Object3D {
  load (onLoaded, size = 4) {
    load((textures) => {
      var cloudMap = textures.cloud

      cloudMap.wrapS = cloudMap.wrapT = THREE.RepeatWrapping
      cloudMap.repeat.set(5,5)

      const material = new THREE.MeshLambertMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        // color: new THREE.Color(0x00ff00),
      })

      const geometry = new THREE.SphereGeometry(size, 50, 50)

      this.mesh = new THREE.Mesh(geometry, material)
      this.add(this.mesh)

      onLoaded()
    })
  }

  rotate () {
    this.rotation.y -= 0.0005
    this.rotation.z += 0.00025
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
