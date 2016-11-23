import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer
} from 'three'

export default function getStage ({ cameraConfig }) {
  const { innerWidth, innerHeight } = window

  // Init Scene
  let scene = new Scene()

  // Init Camera
  let camera = new PerspectiveCamera()

  camera.position.x = cameraConfig.position.x
  camera.position.y = cameraConfig.position.y
  camera.position.z = cameraConfig.position.z

  camera.aspect = (innerWidth / innerHeight)
  camera.updateProjectionMatrix()

  // Init Renderer
  let renderer = new WebGLRenderer({
    antialias: true
  })

  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.autoClear = false

  renderer.setPixelRatio(window.devicePixelRatio)

  renderer.setSize(innerWidth, innerHeight)

  return {
    add (object) {
      scene.add(object)
    },
    get canvas () { return renderer.domElement },
    onResize (width, height) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    },
    update () {
      renderer.clear()
      renderer.render(scene, camera)
    },
    setBackgroundColor (color) {
      renderer.setClearColor(color)
    },
    renderer,
    scene,
    camera
  }
}
