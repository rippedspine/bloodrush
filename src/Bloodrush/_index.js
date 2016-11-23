// import { THREE } from 'three'
// import { GUI } from 'dat-gui'
// import TWEEN, { Tween } from 'tween.js'
// // import yo from 'yo-yo'
// import { EventEmitter } from 'events'
//
// import Illumination from './illumination'
// // var SunCalc = require('suncalc')
//
// import RenderPass from '../postprocessing/RenderPass'
// import ClearMaskPass from '../postprocessing/ClearMaskPass'
// import MaskPass from '../postprocessing/MaskPass'
// import ShaderPass from '../postprocessing/ShaderPass'
// import EffectComposer from '../postprocessing/EffectComposer'
//
// // -- Shaders
// import BleachBypassShader from '../shaders/BleachBypass'
// import ColorCorrectionShader from '../shaders/ColorCorrection'
// import FXAAShader from '../shaders/FXAA'
//
// // -- Internal
// import Moon from './Moon'
// import CloudDome from './CloudDome'
// import Glow from './Glow'
//
// // -- Constans
// const DURATION = 1000
//
// import { getHSV, tweenColors } from '../plugins/color'
//
// import { colors } from './config'
//
// const { cos, sin } = Math
// const { now } = Date
//
// const container = document.createElement('div')
//
// // const bgGrain = document.createElement('div')
// // bgGrain.className = 'gg'
//
// // const cal = new EventEmitter()
//
// // const moonIllumination = SunCalc.getMoonIllumination(new Date())
//
// // const getMoonPhase = (phase) => {
// //   if (phase >= 0.1 && phase < 0.2) return 'Waning Gibbous'
// //   if (phase >= 0.2 && phase < 0.3) return 'Last Quarter'
// //   if (phase >= 0.3 && phase < 0.45) return 'Waning Crescent'
// //   if (phase >= 0.45 && phase < 0.55) return 'New Moon'
// //   if (phase >= 0.55 && phase < 0.7) return 'Waxing Crescent'
// //   if (phase >= 0.7 && phase < 0.8) return 'First Quarter'
// //   if (phase >= 0.8 && phase < 0.9) return 'Waxing Gibbous'
// //   return 'Full Moon'
// // }
//
// // const getStartOfDay = (date) => {
// //   const tmpDate = date
// //   tmpDate.setHours(0)
// //   tmpDate.setMinutes(0)
// //   tmpDate.setSeconds(0)
// //   return tmpDate
// // }
//
// // const START_OF_DAY = getStartOfDay(new Date())
// // const DAY_IN_MS = 24 * 60 * 60 * 1000
//
// // const days = new Array(30).fill(undefined).map((_, index) => {
// //   return new Date(+START_OF_DAY + (index * DAY_IN_MS))
// // })
//
// // const calEl = yo`
// //   <div style='z-index: 2; position: fixed; bottom: 0; width: 100%; height: 40px; background: rgba(0,0,0,0.2)'>
// //     ${days.map(day => (
// //       yo`<div class='day'>${day}</div>`
// //     ))}
// //   </div>
// // `
//
// // const calInfo = (moonPhase) => (yo`
// //   <div style='position: fixed; top: 10px; right: 10px; mix-blend-mode: overlay;'>
// //     ${moonPhase}
// //   </div>
// // `)
//
// // const calInfoEl = calInfo(moonIllumination.phase)
//
// const getRadians = (phase) => ((phase * 360) + 90) * (Math.PI / 180)
//
// const setLightPositionFromPhase = (phase) => {
//   lightDir.position.x = 10 * cos(getRadians(phase))
//   lightDir.position.z = 10 * sin(getRadians(phase))
//
//   // yo.update(calInfoEl, calInfo(getMoonPhase(phase)))
// }
//
// const getNewCameraPosition = (x, y) => {
//   return {
//     y: cos(getRadians((y / (height * 2)) * 0.01)) * 5,
//     z: sin(getRadians((x / (width * 2)) * 0.01)) * 5,
//     x: cos(getRadians((x / (width * 2)) * 0.01)) * 5
//   }
// }
//
// document.addEventListener('mousemove', (event) => {
//   camera.position.y = cos(getRadians((event.clientY / (height * 2)) * 0.01)) * 5
//   camera.position.z = sin(getRadians((event.clientX / (width * 2)) * 0.01)) * 5
//   camera.position.x = cos(getRadians((event.clientX / (width * 2)) * 0.01)) * 5
// })
//
// const onMouseMove = (event) => {
//   const x = event.clientX / width
//   setLightPositionFromPhase(x)
//   // moon.rotation.y = sin(getRadians(x * 0.1)) * -1.5
// }
//
// // container.appendChild(illumination.el)
//
// console.log(Illumination)
// // console.log(illuminati)
// Illumination.emitter.on('init', (msg) => console.log('yay', msg))
// // illuminati.emitter.on('update', (msg) => console.log('yay', msg))
// // illumination.on('update', (state) => console.log(state))
//
// // cal.on('down', handleMouseDown)
// // cal.on('up', handleMouseUp)
// // cal.on('move', onMouseMove)
//
// // container.appendChild(calEl)
// // container.appendChild(calInfoEl)
// // container.appendChild(bgGrain)
//
// let width = 0
// let height = 0
// let currentWidth = 0
// let currentHeight = 0
//
// var day = {
//   lightDirColor: 0x53e3e3e,
//   lightAmbientColor: 0x020202,
//   background: colors.day.sky
// }
//
// var night = {
//   lightDirColor: 0xff1200,
//   lightAmbientColor: 0x010101,
//   background: 0x161616
// }
//
// var options = Object.assign({}, day, {
//   cameraPositionX: 0,
//   cameraPositionY: 0,
//   cameraPositionZ: 5
// })
//
// var isNight = true
// var isNightDirty = true
// var isDebugging = false
// var isGUIDirty = true
//
// var gui = new GUI()
//
// // -- scene
// let scene = new THREE.Scene()
//
// // -- camera
// let camera = new THREE.PerspectiveCamera()
//
// // -- renderer
// let renderer = new THREE.WebGLRenderer({
//   antialias: true
// })
//
// renderer.gammaInput = true
// renderer.gammaOutput = true
// renderer.autoClear = false
//
// renderer.setClearColor(options.background)
// renderer.setPixelRatio(window.devicePixelRatio)
//
// // -- lights
// let lightDir = new THREE.DirectionalLight(options.lightDirColor)
// // setLightPositionFromPhase(moonIllumination.phase)
//
// let lightAmbient = new THREE.AmbientLight(options.lightAmbientColor)
//
// // -- composer
// let composer = null
// let renderModel = null
//
// // -- moon
// let moon = new Moon()
// let cloudDome = new CloudDome()
// let cloudDome2 = new CloudDome(4.5)
// let moonGlow = new Glow()
//
// export function bootstrap () {
//   moon.load(() => {
//     cloudDome.load(() => {
//       cloudDome2.load(() => {
//         init()
//         animate()
//       }, 4.2)
//     })
//   })
// }
//
// function initGUI () {
//   gui.addColor(options, 'lightDirColor').listen()
//   gui.addColor(options, 'lightAmbientColor').listen()
//   gui.addColor(options, 'background').listen()
//   gui.add(options, 'cameraPositionX', -50, 50)
//   gui.add(options, 'cameraPositionY', -50, 50)
//   gui.add(options, 'cameraPositionZ', -50, 50)
//
//   if (!isDebugging) {
//     gui.domElement.style.display = 'none'
//   }
// }
//
// function init () {
//   document.body.appendChild(container)
//
//   container.appendChild(renderer.domElement)
//
//   width = window.innerWidth
//   height = window.innerHeight
//
//   initGUI()
//
//   camera.aspect = (width / height)
//   camera.position.z = options.cameraPositionZ
//   camera.position.y = options.cameraPositionY
//   camera.lookAt(moon.position)
//   camera.updateProjectionMatrix()
//
//   moonGlow.init({
//     camera,
//     target: moon,
//     size: 1.3
//   })
//
//   scene.add(moon)
//   scene.add(moonGlow)
//   scene.add(cloudDome)
//   scene.add(cloudDome2)
//   scene.add(lightDir)
//   scene.add(lightAmbient)
//
//   var renderTargetParams = {
//     minFilter: THREE.LinearFilter,
//     magFilter: THREE.LinearFilter,
//     format: THREE.RGBFormat,
//     stencilBuffer: true
//   }
//
//   // -- events
//   window.addEventListener('resize', onResize)
//   window.addEventListener('keydown', onKeyDown)
// }
//
// function onResize () {
//   const { innerWidth, innerHeight } = window
//
//   camera.aspect = innerWidth / innerHeight
//   camera.updateProjectionMatrix()
//
//   renderer.setSize(innerWidth, innerHeight)
// }
//
// function onKeyDown (event) {
//   if (event.keyCode === 78) {
//     isNightDirty = true
//     isNight = !isNight
//   }
//
//   if (event.keyCode === 68) {
//     isGUIDirty = true
//     isDebugging = !isDebugging
//   }
// }
//
// function animate () {
//   requestAnimationFrame(animate)
//   render()
// }
//
// function renderNight () {
//   if (isNightDirty) {
//     Object.assign(options, night)
//
//     // lightDir.color.set(night.lightDirColor)
//     // lightAmbient.color.set(night.lightAmbientColor)
//     // renderer.setClearColor(night.background)
//
//     var bgTween = tweenColors(
//       day.background,
//       night.background,
//       DURATION,
//       renderer.setClearColor
//     )
//     var lightDirTween = tweenColors(
//       day.lightDirColor,
//       night.lightDirColor,
//       DURATION,
//       (color) => lightDir.color.set(color)
//     )
//     var lightAmbientTween = tweenColors(
//       day.lightAmbientColor,
//       night.lightAmbientColor,
//       DURATION,
//       (color) => lightAmbient.color.set(color)
//     )
//
//     bgTween.start()
//     lightDirTween.start()
//     lightAmbientTween.start()
//
//     isNightDirty = false
//   }
// }
//
// function renderDay () {
//   if (isNightDirty) {
//     Object.assign(options, day)
//
//     var bgTween = tweenColors(
//       night.background,
//       day.background,
//       DURATION,
//       renderer.setClearColor
//     )
//     var lightDirTween = tweenColors(
//       night.lightDirColor,
//       day.lightDirColor,
//       DURATION,
//       (color) => lightDir.color.set(color)
//     )
//     var lightAmbientTween = tweenColors(
//       night.lightAmbientColor,
//       day.lightAmbientColor,
//       DURATION,
//       (color) => lightAmbient.color.set(color)
//     )
//
//     bgTween.start()
//     lightDirTween.start()
//     lightAmbientTween.start()
//
//     isNightDirty = false
//   }
// }
//
// function showGUI () {
//   lightDir.color.set(options.lightDirColor)
//   lightAmbient.color.set(options.lightAmbientColor)
//   // lightDir.position.set(options.lightDirX, options.lightDirY, options.lightDirZ)
//   renderer.setClearColor(options.background)
//
//   if (isGUIDirty) {
//     gui.domElement.style.display = 'block'
//     isGUIDirty = false
//   }
// }
//
// function hideGUI () {
//   if (isGUIDirty) {
//     gui.domElement.style.display = 'none'
//     isGUIDirty = false
//   }
// }
//
// function render () {
//   if (currentWidth !== width || currentHeight !== height) {
//     renderer.setSize(width, height, false)
//     currentWidth = width
//     currentHeight = height
//   }
//
//   TWEEN.update()
//
//   isNight ? renderNight() : renderDay()
//   isDebugging ? showGUI() : hideGUI()
//
//   // camera.position.y = options.cameraPositionY
//   // camera.position.z = options.cameraPositionZ
//   // camera.position.x = options.cameraPositionX
//
//   // camera.position.set(new THREE.Vector3(
//   //   options.cameraPositionX,
//   //   options.cameraPositionY,
//   //   options.cameraPositionZ
//   // ))
//
//   camera.lookAt(moon.position)
//
//   // const t = now() * 0.0005
//   // lightDir.position.x = cos(t) * 10
//   // lightDir.position.z = sin(t) * 10
//
//   // console.log(lightDir.position)
//
//   moon.render()
//   moon.rotate()
//   // moonGlow.pulse()
//
//   cloudDome.rotate()
//   cloudDome2.rotate()
//
//   renderer.clear()
//   renderer.render(scene, camera)
// }
