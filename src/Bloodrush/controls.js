import yo from 'yo-yo'
import SunCalc from 'suncalc'
import kebabCase from 'kebab-case'

const assign = Object.assign

function getPhase (date) {
  return SunCalc.getMoonIllumination(date)
}

const START_OF_TODAY = getStartOfDay(new Date())
const DAY_IN_MS = 24 * 60 * 60 * 1000
const MOON_PHASE_TODAY = getPhase(START_OF_TODAY)

const DATES = new Array(30).fill(undefined).map((_, index) => {
  const date = new Date(+START_OF_TODAY + (index * DAY_IN_MS))
  return {
    date,
    dayNumber: date.getDate(),
    monthNumber: date.getMonth(),
    phase: getPhase(date)
  }
})

function getHumanReadableMoonPhase (phase) {
  if (phase >= 0.1 && phase < 0.2) return 'Waning Gibbous'
  if (phase >= 0.2 && phase < 0.3) return 'Last Quarter'
  if (phase >= 0.3 && phase < 0.45) return 'Waning Crescent'
  if (phase >= 0.45 && phase < 0.55) return 'New Moon'
  if (phase >= 0.55 && phase < 0.7) return 'Waxing Crescent'
  if (phase >= 0.7 && phase < 0.8) return 'First Quarter'
  if (phase >= 0.8 && phase < 0.9) return 'Waxing Gibbous'
  return 'Full Moon'
}

function getStartOfDay (date) {
  const tmpDate = date
  tmpDate.setHours(0)
  tmpDate.setMinutes(0)
  tmpDate.setSeconds(0)
  return tmpDate
}

const getStyle = (styles) => {
  return Object.keys(styles).map((property) => {
    return `${kebabCase(property)}:${styles[property]}`
  }).join(';')
}

function daysEl (state, actions) {
  return yo`
    <div style=${getStyle({
      zIndex: 2,
      position: 'fixed',
      bottom: 0,
      width: '100%',
      height: '40px',
      display: 'flex',
      justifyContent: 'space-between',
      mixBlendMode: 'overlay'
    })}>
      ${DATES.map(date => (
        yo`<div onclick=${() => actions.setPhase(date.phase)} style=${getStyle({ cursor: 'pointer' })}>
          <div>${date.dayNumber}</div>
          <div>${date.monthNumber}</div>
        </div>`
      ))}
    </div>
  `
}

function infoEl (state, actions) {
  const info = getHumanReadableMoonPhase(state.phase.phase)

  return yo`
    <div style='position: fixed; top: 10px; right: 10px; mix-blend-mode: overlay;'>
      ${info}
    </div>
  `
}

function _update (el, newEl) {
  yo.update(el, newEl)
}

function _render (state, actions) {
  return yo`
    <div>
      ${infoEl(state, actions)}
      ${daysEl(state, actions)}
    </div>
  `
}

export default function getControls (emitter) {
  let _state = {
    phase: MOON_PHASE_TODAY
  }

  emitter.emit('init')

  const update = (state) => {
    _update(rootEl, _render(state, actions))
    emitter.emit('update', state)
  }

  const actions = {
    setPhase (phase) {
      _state = assign({}, _state, { phase })
      update(_state)
    }
  }

  const rootEl = _render(_state, actions)

  return {
    rootEl,
    get state () { return _state }
  }
}
