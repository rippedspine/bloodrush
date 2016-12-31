import * as THREE from 'three'

import shaderVert from './shader.vert.glsl'
import shaderFrag from './shader.frag.glsl'

const { sin } = Math

export default class Glow extends THREE.Object3D {
  init ({
    camera,
    target,
    size = 2.0,
    pushBack = true
  }) {
    const uniforms = {
      'c': { type: 'f', value: 0.5 },
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
      transparent: true
    })

    this._material = material

    const geometry = target.mesh.geometry.clone()

    geometry.dynamic = true

    this.mesh = new THREE.Mesh(geometry, material)

    this.position.x = target.mesh.position.x
    this.position.y = target.mesh.position.y
    this.position.z = target.mesh.position.z

    this.origin = {
      x: 0,
      y: 0,
      z: 0
    }

    // if (pushBack) {
    //   this.position.z = -0.2
    // }

    this.position.z = 0.0

    this.scale.multiplyScalar(size)

    this.add(this.mesh)
    this.tick = 0
  }

  fade () {
    // this.tick += 0.02

    if (this._material) {
      // this._material.uniforms.p.value = sin(this.tick)
      // this._material.uniforms.p.needsUpdate = true
    }

    // console.log(this._material)
  }

  pulse () {
    this.tick += 0.02
    this.position.z = this.origin.z + (sin(this.tick) * 0.125)
  }
}
