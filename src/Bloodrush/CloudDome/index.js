import * as THREE from 'three'

import { load } from '../../plugins/textureLoader'

import textureCloud from './textures/cloud.png'

const images = [
  { url: textureCloud, name: 'cloud' }
]

export default class CloudDome extends THREE.Object3D {
  load (size = 4) {
    return load(images).then((textures) => {
      var cloudMap = textures.cloud

      cloudMap.wrapS = cloudMap.wrapT = THREE.RepeatWrapping
      cloudMap.repeat.set(5, 5)

      const material = new THREE.MeshLambertMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
      })

      const geometry = new THREE.SphereGeometry(size, 50, 50)

      this.add(new THREE.Mesh(geometry, material))

      return this
    })
  }

  rotate () {
    this.rotation.y -= 0.0005
    this.rotation.z += 0.00025
  }
}
