import * as THREE from 'three'

import { load } from '../../plugins/textureLoader'

// -- textures
import textureMoon from './textures/moon.jpg'
import textureNormal from './textures/normal.jpg'

const images = [
  { url: textureMoon, name: 'moon' },
  { url: textureNormal, name: 'normal' }
]

const blendings = [
  THREE.NoBlending,
  THREE.NormalBlending,
  THREE.AdditiveBlending,
  THREE.SubtractiveBlending,
  THREE.MultiplyBlending,
  THREE.AdditiveAlphaBlending
]

const config = {
  color: 0x282828,
  specular: 0x000000,
  shininess: 0,
  blending: blendings[2],
  normalScale: new THREE.Vector2(0.4, 0.4)
}

export default class Moon extends THREE.Object3D {
  load (onLoaded, addGui) {
    return load(images).then((textures) => {
      const material = new THREE.MeshPhongMaterial({
        color: config.color,
        specular: config.specular,
        shininess: config.shininess,
        map: textures.moon,
        normalMap: textures.normal,
        normalScale: config.normalScale,
        blending: config.blending,
        transparent: true
      })

      const geometry = new THREE.SphereGeometry(1.5, 50, 50)

      this.mesh = new THREE.Mesh(geometry, material)
      this.add(this.mesh)

      return this
    })
  }

  rotate () {
    this.rotation.y -= 0.0003
  }
}
