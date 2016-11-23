import * as THREE from 'three'
import TWEEN from 'tween.js'

export function getHSV (color) {
  color = new THREE.Color(color)

  var rr = null
  var gg = null
  var bb = null
  var h = null
  var s = null

  var r = color.r
  var g = color.g
  var b = color.b
  var v = Math.max(r, g, b)
  var diff = v - Math.min(r, g, b)

  var diffc = function (c) {
    return (v - c) / 6 / diff + 1 / 2
  }

  if (diff === 0) {
    h = s = 0
  } else {
    s = diff / v
    rr = diffc(r)
    gg = diffc(g)
    bb = diffc(b)

    if (r === v) {
      h = bb - gg
    } else if (g === v) {
      h = (1 / 3) + rr - bb
    } else if (b === v) {
      h = (2 / 3) + gg - rr
    }
    if (h < 0) {
      h += 1
    } else if (h > 1) {
      h -= 1
    }
  }
  return {
    h: h,
    s: s,
    v: v
  }
};

export function tweenColors (from, to, duration, cb) {
  from = new THREE.Color(from)
  to = new THREE.Color(to)

  return new TWEEN.Tween(from)
    .to(new THREE.Color(to), duration)
    .easing(TWEEN.Easing.Quartic.In)
    .onUpdate(function () {
      cb(this)
    })
}
