import * as THREE from 'three'

const assign = Object.assign

const loadTexture = (image) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader()

    loader.load(
      image.url,
      (texture) => resolve(assign({}, image, { texture })),
      (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
      (xhr) => reject('Loading failed')
    )
  })
}

export const load = (images) => {
  return Promise
    .all(images.map(loadTexture))
    .then((result) => {
      return result.reduce((memo, item) => {
        memo[item.name] = item.texture
        return memo
      }, {})
    })
}
