import * as THREE from 'three'

import shaderVert from './shader.vert.glsl'
import shaderFrag from './shader.frag.glsl'

const { sin } = Math

export default class Glow extends THREE.Object3D {
  constructor ({
    camera,
    target,
    size = 1.5,
    pushBack = true
  }) {
    super()

    this.size = size

    const uniforms = {
      'c': { type: 'f', value: 0.7 },
      'p': { type: 'f', value: 1.5 },
      glowColor: { type: 'c', value: new THREE.Color(0x443322) },
      viewVector: { type: 'v3', value: camera.position }
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: shaderVert,
      fragmentShader: shaderFrag,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.3
    })

    console.log(target)

    const geometry = target.mesh.geometry.clone()

    geometry.dynamic = true

    this.mesh = new THREE.Mesh(geometry, material)

    this.position.x = target.mesh.position.x
    this.position.y = target.mesh.position.y
    this.position.z = target.mesh.position.z

    this.origin = {
      x: 0,
      y: 0,
      z: -6
    }

    if (pushBack) {
      this.position.z = -6
    }

    this.scale.multiplyScalar(2.8)

    this.add(this.mesh)
    this.tick = 0
  }

  pulse () {
    this.tick += 0.02
    this.position.z = this.origin.z + (sin(this.tick) * 0.125)
  }
}
