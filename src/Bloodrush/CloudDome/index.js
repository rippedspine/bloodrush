import THREE from 'three'

import loader from '../../plugins/loader'

import textureCloud from './textures/cloud.png'

const { cos, sin } = Math
const { now } = Date

const images = [
  { url: textureCloud, name: 'cloud' }
]

export default class CloudDome extends THREE.Object3D {
  load (cb, size = 4) {
    loader(images, textures => {
      var cloudMap = textures.cloud

      cloudMap.wrapS = cloudMap.wrapT = THREE.RepeatWrapping
      cloudMap.repeat.set(5,5)

      const material = new THREE.MeshLambertMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      })

      const geometry = new THREE.SphereGeometry(size, 50, 50)

      this.mesh = new THREE.Mesh(geometry, material)
      this.add(this.mesh)

      cb()
    })
  }

  rotate () {
    this.rotation.y -= 0.0005
    this.rotation.z += 0.00025
  }
}
