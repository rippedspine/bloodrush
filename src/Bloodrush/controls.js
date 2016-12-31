import yo from 'yo-yo'
import SunCalc from 'suncalc'
import kebabCase from 'kebab-case'

const assign = Object.assign

const WANING_GIBBOUS = 'Waning Gibbous'
const LAST_QUARTER = 'Last Quarter'
const WANING_CRESCENT = 'Waning Crescent'
const NEW_MOON = 'New Moon'
const WAXING_CRESCENT = 'Waxing Crescent'
const FIRST_QUARTER = 'First Quarter'
const WAXING_GIBBOUS = 'Waxing Gibbous'
const FULL_MOON = 'Full Moon'

function getMoonIllumination (date) {
  return SunCalc.getMoonIllumination(date)
}

const START_OF_TODAY = getStartOfDay(new Date())
const DAY_IN_MS = 24 * 60 * 60 * 1000
const MOON_PHASE_TODAY = getMoonIllumination(START_OF_TODAY)

const DATES = new Array(31).fill().map((_, index) => {
  const timestamp = new Date((+START_OF_TODAY - (15 * DAY_IN_MS)) + (index * DAY_IN_MS))
  const dayNumber = timestamp.getDate()

  return {
    timestamp: +timestamp,
    dayNumber: dayNumber < 10 ? `0${dayNumber}` : dayNumber,
    moon: getMoonIllumination(timestamp)
  }
})

function getHumanReadableMoonPhase (phase) {
  if (phase >= 0.1 && phase < 0.2) return WAXING_CRESCENT
  if (phase >= 0.2 && phase < 0.3) return FIRST_QUARTER
  if (phase >= 0.3 && phase < 0.45) return WAXING_GIBBOUS
  if (phase >= 0.45 && phase < 0.55) return FULL_MOON
  if (phase >= 0.55 && phase < 0.7) return WANING_GIBBOUS
  if (phase >= 0.7 && phase < 0.8) return LAST_QUARTER
  if (phase >= 0.8 && phase < 0.9) return WANING_CRESCENT
  return NEW_MOON
}

function getStartOfDay (date) {
  const tmpDate = date
  tmpDate.setHours(0)
  tmpDate.setMinutes(0)
  tmpDate.setSeconds(0)
  return tmpDate
}

const getStyle = (styles) => {
  var relativeProps = ['opacity', 'lineHeight']

  return Object.keys(styles).map((property) => {
    let value = styles[property]
    value = (~relativeProps.indexOf(property))
      ? value
      : (isNaN(value) ? value : value + 'px')
    return `${kebabCase(property)}: ${value}`
  }).join(';')
}

function daysEl (state, actions) {
  return yo`
    <div style=${getStyle({
      zIndex: 2,
      position: 'fixed',
      bottom: 0,
      width: '100%',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      textAlign: 'center'
    })}>
      ${DATES.map((date, index) => (
        yo`<div
          onclick=${() => actions.setMoonIllumination(date.moon, date.timestamp)}
          style=${getStyle({
            cursor: 'pointer',
            padding: '1rem 0.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            background: state.timestamp === date.timestamp ? 'rgba(255,255,255,0.2)' : 'initial'
          })}
        > 
          ${index % 5 === 0 ? (yo`<div style="padding:2px">${svgPhase(date.moon.phase)}</div>`) : ''}
          <div>${date.dayNumber}</div>
        </div>`
      ))}
    </div>
  `
}

const getCircleFill = (humanPhase) => {
  return [FULL_MOON, LAST_QUARTER, FIRST_QUARTER, WANING_GIBBOUS, WAXING_GIBBOUS].indexOf(humanPhase) >= 0 ? 'white' : 'black'
}

const getCrescentFill = (humanPhase) => {
  return [WAXING_CRESCENT, WANING_CRESCENT].indexOf(humanPhase) >= 0 ? 'white' : 'black'
}

const getRotation = (humanPhase) => {
  return [LAST_QUARTER, WANING_CRESCENT, WAXING_GIBBOUS].indexOf(humanPhase) >= 0 ? '180deg' : '0'
}

function svgPhase (phase) {
  const humanPhase = getHumanReadableMoonPhase(phase)

  const circle = yo`<circle fill="${getCircleFill(humanPhase)}" cx="29" cy="29" r="29"></circle>`

  const quarter = yo`
    <path fill="black" d="M29,7.10542736e-15 C12.9837423,7.10542736e-15 0,12.9837423 0,29 C0,45.0162577 12.9837423,58 29,58 L29,2.57571742e-14 Z"></path>
  `
  const crescent = yo`
    <path d="M21.9726229,0.857273392 C24.2226751,0.297248176 26.5766245,1.53810965e-15 29,1.53810965e-15 C45.0162577,1.53810965e-15 58,12.9837423 58,29 C58,45.0162577 45.0162577,58 29,58 C27.2300118,58 25.4970594,57.8414309 23.8145737,57.5377236 C34.677942,53.704946 42.5333333,42.5934095 42.5333333,29.4833333 C42.5333333,15.6432123 33.7787159,4.03040873 21.9726229,0.857273392 Z" fill="${getCrescentFill(humanPhase)}"></path>
  `

  return yo`
    <svg viewBox="0 0 58 58" style="transform: rotate(${getRotation(humanPhase)})">
      ${circle}
      ${[FIRST_QUARTER, LAST_QUARTER].indexOf(humanPhase) >= 0 && quarter}
      ${[WANING_GIBBOUS, WANING_CRESCENT, WAXING_CRESCENT, WAXING_GIBBOUS].indexOf(humanPhase) >= 0 && crescent}
    </svg>
  `
}

function infoEl (state, actions) {
  const { moon } = state
  const info = getHumanReadableMoonPhase(moon.phase)

  return yo`
    <div style=${getStyle({
      position: 'fixed',
      top: 0,
      right: 0,
      padding: '1rem',
      lineHeight: 1.3,
      background: 'rgba(255,255,255,0.3)'
    })}>
      <div style="${getStyle({ width: 18 })}">
        ${svgPhase(moon.phase)}
      </div>
      <div>
        ${info}
      </div>
      <div>
        ${(moon.fraction * 100).toFixed(2)}% illuminated
      </div>
    </div>
  `
}

function _update (el, newEl) {
  yo.update(el, newEl)
}

function _render (state, actions) {
  return yo`
    <div>
      <div style=${getStyle({
        pointerEvents: 'none',
        opacity: '0.05'
      })}>
        ${daysEl(state, actions)}
      </div>
      <div style=${getStyle({
        pointerEvents: 'none',
        opacity: '0.06'
      })}>
        ${infoEl(state, actions)}
      </div>
      <div style=${getStyle({
        mixBlendMode: 'overlay'
      })}>
        ${infoEl(state, actions)}
        ${daysEl(state, actions)}
      </div>
    </div>
  `
}

export default function getControls (emitter) {
  let _state = {
    timestamp: +START_OF_TODAY,
    moon: MOON_PHASE_TODAY
  }

  emitter.emit('init')

  const update = (prevState, state) => {
    _update(rootEl, _render(state, actions))
    emitter.emit('update', { prevState, state })
  }

  const actions = {
    setMoonIllumination (moon, timestamp) {
      var prevState = assign({}, _state)
      _state = assign({}, _state, { moon, timestamp })
      update(prevState, _state)
    }
  }

  const rootEl = _render(_state, actions)

  return {
    rootEl,
    get state () { return _state }
  }
}
