import { THREE } from 'three';
import { GUI } from 'dat-gui';

import RenderPass from '../lib/RenderPass';
import ClearMaskPass from '../lib/ClearMaskPass';
import MaskPass from '../lib/MaskPass';
import ShaderPass from '../lib/ShaderPass';
import EffectComposer from '../lib/EffectComposer';

// -- shaders
import BleachBypassShader from '../shaders/BleachBypass';
import ColorCorrectionShader from '../shaders/ColorCorrection';
import FXAAShader from '../shaders/FXAA';

// Internal
import Moon from './Moon';

import { colors } from './config';

const { cos, sin } = Math;
const { now } = Date;

const container = document.createElement('div');

let width = 0;
let height = 0;
let currentWidth = 0;
let currentHeight = 0;

var day = {
  // lightDirColor: 0x53e3e3e,
  // lightAmbientColor: 0x020202,
  lightAmbientColor: 0x333333,
  background: colors.day.sky,
};

var night = {
  // lightDirColor: 0xff1200,
  lightAmbientColor: 0x010101,
  background: 0x161616
};

var options = Object.assign(day, {
  // lightDirX: -1,
  // lightDirY: 0,
  // lightDirZ: 10,
  cameraPositionX: 0,
  cameraPositionY: 10,
  cameraPositionZ: 0
})

var isNight = false;
var isNightDirty = true;
var isDebugging = true;
var isGUIDirty = true;

var gui = new GUI();

// -- scene
let scene = new THREE.Scene();

// -- camera
let camera = new THREE.PerspectiveCamera();

// -- renderer
let renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.autoClear = false;

renderer.setClearColor(options.background);
renderer.setPixelRatio(window.devicePixelRatio);

// -- lights
// let lightDir = new THREE.DirectionalLight( options.lightDirColor );
// lightDir.position.set(options.lightDirX, options.lightDirY, options.lightDirZ);

let lightAmbient = new THREE.AmbientLight( options.lightAmbientColor );

// -- composer
let composer = null;
let renderModel = null;

// -- moon
let moon = new Moon();

export function bootstrap() {
  moon.load(() => {
    init();
    animate();
  });
}

function init() {
  document.body.appendChild(container);

  container.appendChild(renderer.domElement);

  width = window.innerWidth;
  height = window.innerHeight;

  // gui.addColor(options, 'lightDirColor');
  gui.addColor(options, 'lightAmbientColor');
  gui.addColor(options, 'background');
  // gui.add(options, 'lightDirX', -10, 10);
  // gui.add(options, 'lightDirY', -10, 10);
  // gui.add(options, 'lightDirZ', -10, 10);
  gui.add(options, 'cameraPositionX', -50, 50);
  gui.add(options, 'cameraPositionY', -50, 50);
  gui.add(options, 'cameraPositionZ', -50, 50);

  if (!isDebugging) {
    gui.domElement.style.display = 'none';
  }

  camera.aspect = (width / height);
  camera.position.z = options.cameraPositionZ;
  camera.position.y = options.cameraPositionY;
  camera.lookAt(moon.position);
  camera.updateProjectionMatrix();

  scene.add(moon);
  // scene.add(lightDir);
  scene.add(lightAmbient);

  // -- events
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
}

function onResize() {
  const { innerWidth, innerHeight } = window;

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
}

function onKeyDown(event) {
  if (event.keyCode === 78) {
    isNightDirty = true;
    isNight = !isNight;
  }

  if (event.keyCode === 68) {
    isGUIDirty = true;
    isDebugging = !isDebugging;
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function renderNight () {
  if (isNightDirty) {
    // lightDir.color.set(night.lightDirColor);
    lightAmbient.color.set(night.lightAmbientColor);
    renderer.setClearColor(night.background);

    isNightDirty = false;
  }
}

function renderDay () {
  if (isNightDirty) {
    // lightDir.color.set(day.lightDirColor);
    lightAmbient.color.set(day.lightAmbientColor);
    renderer.setClearColor(day.background);

    isNightDirty = false;
  }
}

function showGUI () {
  // lightDir.color.set(options.lightDirColor);
  lightAmbient.color.set(options.lightAmbientColor);
  // lightDir.position.set(options.lightDirX, options.lightDirY, options.lightDirZ);
  renderer.setClearColor(options.background);

  if (isGUIDirty) {
    gui.domElement.style.display = 'block';
    isGUIDirty = false;
  }
}

function hideGUI () {
  if (isGUIDirty) {
    gui.domElement.style.display = 'none';
    isGUIDirty = false;
  }
}

function render() {
  if (currentWidth !== width || currentHeight !== height) {
    renderer.setSize(width, height, false);
    currentWidth = width;
    currentHeight = height;
  }

  isNight ? renderNight() : renderDay();
  isDebugging ? showGUI() : hideGUI();

  camera.position.y = options.cameraPositionY;
  camera.position.z = options.cameraPositionZ;
  camera.position.x = options.cameraPositionX;

  // camera.position.set(new THREE.Vector3(
  //   options.cameraPositionX,
  //   options.cameraPositionY,
  //   options.cameraPositionZ
  // ));

  camera.lookAt(moon.position);

  const t = now() * 0.0005;
  // lightDir.position.x = cos( t ) * 10;
  // lightDir.position.z = sin( t ) * 10;

  moon.render();
  moon.rotate();

  renderer.clear();
  renderer.render(scene, camera);
}
