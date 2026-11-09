import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/scenes.css'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { initScenes, initParallax } from './anim/reveal'
import { initNav } from './anim/nav'
import { initCursor, initMagnetic } from './anim/cursor'
import { initMarquee } from './anim/misc'
import { reducedMotion } from './lib/dom'

gsap.registerPlugin(ScrollTrigger)

const reduce = reducedMotion()
document.documentElement.classList.toggle('reduce-motion', reduce)

let lenis: Lenis | null = null

if (!reduce) {
  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 0.9,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
}

initScenes(reduce)
initParallax(reduce)
initNav({ lenis, reduce })
initCursor()
initMagnetic(reduce)
initMarquee(reduce)

window.addEventListener('load', () => ScrollTrigger.refresh())
document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined)
