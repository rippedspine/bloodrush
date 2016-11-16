import { EventEmitter } from 'events'
import yo from 'yo-yo'
import SunCalc from 'suncalc'

import css from './illumination.css'

const START_OF_TODAY = getStartOfDay(new Date())
const DAY_IN_MS = 24 * 60 * 60 * 1000
const MOON_PHASE_TODAY = getPhase(START_OF_TODAY)

const DATES = new Array(30).fill(undefined).map((_, index) => {
  const date = new Date(+START_OF_TODAY + (index * DAY_IN_MS))
  return { 
    date,
    dayNumber: date,
    monthNumber: date,
    phase: getPhase(date)
  }
})

function getPhase (date) {
  return SunCalc.getMoonIllumination(date)
}

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

// daysContainer.addEventListener('mousemove', (e) => cal.emit('move', e))

// export const moonPhase = (phase) => yo`
//   <div style='position: fixed; top: 10px; right: 10px; mix-blend-mode: overlay;'>
//     ${phase}
//   </div>
// `

function daysEl ({ setPhase }, state) {
  return yo`
    <div style='z-index: 2; position: fixed; bottom: 0; width: 100%; height: 40px; background: rgba(0,0,0,0.2)'>
      ${DATES.map(date => (
        yo`<div onclick=${setPhase.bind(null, date.phase)} class='date'>${date.dayNumber} ${date.monthNumber}</div>`
      ))}
    </div>
  `
}

function infoEl (actions, state) {
  const info = getHumanReadableMoonPhase(state.phase)

  return yo`
    <div style='position: fixed; top: 10px; right: 10px; mix-blend-mode: overlay;'>
      ${info}
    </div>
  `
}

function _update (el, newEl) {
  yo.update(el, newEl)
}

function Illumination () {
  let state = {
    phase: MOON_PHASE_TODAY
  }

  // Actions
  const actions = {
    setPhase (phase) {
      state = { ...state, phase }
      _update(el, _render(state))
    }
  }

  const el = _render(state)

  function _render (state) {
    return yo`
      <div>
        ${infoEl(actions, state)}
        ${daysEl(actions, state)}
      </div>
    `
  }

  const emitter = new EventEmitter()

  emitter.emit('init', 'hell')

  return {
    el, state, emitter,
    update (newState) {
      if (newState) state = newState
      emitter.emit('update', state)
      _update(el, _render(newState))
    }
  }
}

// Illumination.prototype = Object.create(EventEmitter.prototype)
// Illumination.prototype.constructor = EventEmitter

export default Illumination()
