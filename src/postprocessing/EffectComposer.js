/**
 * @author alteredq / http://alteredqualia.com/
 */
import THREE from 'three'

import CopyShader from '../shaders/Copy'
import ShaderPass from './ShaderPass'
import MaskPass from './MaskPass'
import ClearMaskPass from './ClearMaskPass'

var EffectComposer = function (renderer, renderTarget) {
  this.renderer = renderer

  if (renderTarget === undefined) {
    var pixelRatio = renderer.getPixelRatio()

    var width = Math.floor(renderer.context.canvas.width / pixelRatio) || 1
    var height = Math.floor(renderer.context.canvas.height / pixelRatio) || 1
    var parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: false
    }

    renderTarget = new THREE.WebGLRenderTarget(width, height, parameters)
  }

  this.renderTarget1 = renderTarget
  this.renderTarget2 = renderTarget.clone()

  this.writeBuffer = this.renderTarget1
  this.readBuffer = this.renderTarget2

  this.passes = []

  if (CopyShader === undefined) {
    console.error('THREE.EffectComposer relies on CopyShader')
  }

  this.copyPass = new ShaderPass(CopyShader)
}

EffectComposer.prototype.swapBuffers = function () {
  var tmp = this.readBuffer
  this.readBuffer = this.writeBuffer
  this.writeBuffer = tmp
}

EffectComposer.prototype.addPass = function (pass) {
  this.passes.push(pass)
}

EffectComposer.prototype.insertPass = function (pass, index) {
  this.passes.splice(index, 0, pass)
}

EffectComposer.prototype.render = function (delta) {
  this.writeBuffer = this.renderTarget1
  this.readBuffer = this.renderTarget2

  var maskActive = false

  var pass = null
  var i = null
  var il = this.passes.length

  for (i = 0; i < il; i++) {
    pass = this.passes[ i ]

    if (!pass.enabled) continue

    pass.render(this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive)

    if (pass.needsSwap) {
      if (maskActive) {
        var context = this.renderer.context
        context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff)
        this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, delta)
        context.stencilFunc(context.EQUAL, 1, 0xffffffff)
      }
      this.swapBuffers()
    }

    if (pass instanceof MaskPass) {
      maskActive = true
    } else if (pass instanceof ClearMaskPass) {
      maskActive = false
    }
  }
}

EffectComposer.prototype.reset = function (renderTarget) {
  if (renderTarget === undefined) {
    renderTarget = this.renderTarget1.clone()

    var pixelRatio = this.renderer.getPixelRatio()

    renderTarget.width = Math.floor(this.renderer.context.canvas.width / pixelRatio)
    renderTarget.height = Math.floor(this.renderer.context.canvas.height / pixelRatio)
  }

  this.renderTarget1.dispose()
  this.renderTarget1 = renderTarget
  this.renderTarget2.dispose()
  this.renderTarget2 = renderTarget.clone()

  this.writeBuffer = this.renderTarget1
  this.readBuffer = this.renderTarget2
}

EffectComposer.prototype.setSize = function (width, height) {
  this.renderTarget1.setSize(width, height)
  this.renderTarget2.setSize(width, height)
}

export default EffectComposer
