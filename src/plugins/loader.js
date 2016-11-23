// import { EventEmitter } from 'events'
// import { extend } from 'lodash'
import THREE from 'three'

const textureLoader = new THREE.TextureLoader()

function loader (images, cb) {
  const total = images.length
  var completed = 0
  var textures = {}

  const onLoad = (texture, name) => {
    textures[name] = texture

    if (completed++ === total - 1) {
      cb(textures)
    }
  }

  images.forEach(image => {
    textureLoader.load(image.url, texture => onLoad(texture, image.name), (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }, (xhr) => {
      console.log('Loading errored')
    })
  })
}

export default loader
