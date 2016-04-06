import styles from './styles.css'

import textureCloud from './textures/cloud.png'

// const container = document.createElement('div')

// container.className = styles.Container
// container.style = `background-image: url(${textureCloud});`

function getCloud(){
  var container = document.createElement('div')

  container.className = styles.Container
  container.style = `background-image: url(${textureCloud});`

  return container
}

export default {
  getCloudContainer(count) {
    return new Array(count).fill(undefined).map(getCloud)
  },
  setClassName(container, isNight) {
    container.className = isNight
      ? styles.Night
      : styles.Day
  }
}
