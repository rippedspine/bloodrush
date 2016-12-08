import * as THREE from 'three'
import { EventEmitter } from 'events'
import TWEEN from 'tween.js'
import raf from 'raf'

import getStage from './stage'
import getControls from './controls'

// Plugins
import { tweenColors } from '../plugins/color'

// Internal
import Moon from './Moon'
import CloudDome from './CloudDome'
// import Glow from './Glow'

import config from './config'

// Constants
const DURATION = 1000
const { sin, cos, PI, sqrt, pow, acos, min, max } = Math

const getIsNight = (date) => {
  const hours = date.getHours()
  return !(hours >= 8 && hours <= 20)
}

const clamp = (val, x, y) => min(max(val, x), y)
const getRadians = (phase) => ((phase * 360) + 90) * (PI / 180)

const getDistance = ([ x1, x2, z1, z2 ]) => {
  const r = sqrt(pow(x1, 2), pow(z1, 2))
  const d = sqrt(pow((x1 - x2), 2) + pow((z1 - z2), 2))

  return r * acos(clamp(1 - (pow(d, 2) / (2 * (r * r))), -1, 1))
}

const getLightPositionFromPhase = (phase) => {
  return {
    x: 10 * cos(getRadians(phase)),
    z: 10 * sin(getRadians(phase))
  }
}

const getCameraFromMousePosition = (mouseX, mouseY, width, height) => {
  return {
    x: cos(getRadians((mouseX / (width * 2)) * 0.01)) * 5,
    y: cos(getRadians((mouseY / (height * 2)) * 0.01)) * 5,
    z: sin(getRadians((mouseX / (width * 2)) * 0.01)) * 5
  }
}

export const init = () => {
  // State
  let isColorsDirty = true
  let isNight = getIsNight(new Date())

  // Init Stage
  const stage = getStage({
    cameraConfig: config.camera
  })

  // Init Controls
  const emitter = new EventEmitter()
  const controls = getControls(emitter)

  // Build DOM
  const rootEl = document.createElement('div')
  rootEl.appendChild(stage.renderer.domElement)
  rootEl.appendChild(controls.rootEl)
  document.body.appendChild(rootEl)

  // Init DOM Events

  // -- Lights
  let lightDir = new THREE.DirectionalLight(config.colors.night.lightDirColor)
  let lightAmbient = new THREE.AmbientLight(config.colors.night.lightAmbientColor, 0.8)

  // -- Moon
  const moon = new Moon()
  const cloudDome = new CloudDome()
  // const moonGlow = new Glow({
  //   camera,
  //   target: moon,
  //   size: 1.3
  // })

  Promise.all([
    moon.load(),
    cloudDome.load()
  ])
  .then(() => {
    stage.camera.lookAt(moon.position)

    const { x, z } = getLightPositionFromPhase(controls.state.moon.phase)

    lightDir.position.x = x
    lightDir.position.z = z

    stage.add(moon)
    stage.add(cloudDome)
    stage.add(lightDir)
    stage.add(lightAmbient)

    // Custom events
    emitter.on('update', ({ state, prevState }) => {
      const { x, z } = getLightPositionFromPhase(state.moon.phase)

      const x1 = lightDir.position.x
      const z1 = lightDir.position.z

      const duration = (Math.abs(state.timestamp - prevState.timestamp)) * 0.000001

      new TWEEN.Tween({ x: x1, z: z1 }).to({ x, z }, duration)
        .easing(TWEEN.Easing.Back.Out)
        .onUpdate(function () {
          lightDir.position.x = this.x
          lightDir.position.z = this.z
        })
        .start()
    })

    // DOM Events
    window.addEventListener('resize', (event) => {
      const { innerWidth, innerHeight } = window
      stage.onResize(innerWidth, innerHeight)
    })

    window.addEventListener('keydown', ({ keyCode }) => {
      if (keyCode === 78) {
        isColorsDirty = true
        isNight = !isNight
      }
    })

    window.addEventListener('mousemove', ({ clientX, clientY }) => {
      // TODO: Should set camera in render instead of reacting to mouseinput...
      // Use a delta or something and tween position

      // const { x, y, z } =
      // stage.setCameraPosition(getCameraFromMousePosition(clientX, clientY, window.innerWidth, window.innerHeight))
      // camera.position.x = x
      // camera.position.y = y
      // camera.position.z = z
    })
  })

  function setColors () {
    if (isColorsDirty) {
      isColorsDirty = false
      const from = isNight ? config.colors.night : config.colors.day
      const to = isNight ? config.colors.day : config.colors.night

      tweenColors(from.background, to.background, DURATION, stage.setBackgroundColor).start()
      tweenColors(from.lightDirColor, to.lightDirColor, DURATION, c => lightDir.color.set(c)).start()
      tweenColors(from.lightAmbientColor, to.lightAmbientColor, DURATION, c => lightAmbient.color.set(c)).start()
    }
  }

  function render () {
    moon.rotate()
    cloudDome.rotate()

    TWEEN.update()

    setColors()

    stage.update()

    raf(render)
  }

  render()
}
