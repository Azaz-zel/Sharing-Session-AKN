import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $$ } from '../lib/dom'

/**
 * Builds one entrance timeline per scene. Everything starts hidden via CSS
 * (`.js` class) and is revealed when the scene crosses the trigger line.
 */
export function initScenes(reduce: boolean): void {
  const scenes = $$<HTMLElement>('[data-scene]')

  scenes.forEach((scene, i) => {
    if (reduce) return

    const lines = $$<HTMLElement>('.line > span', scene)
    const reveals = $$<HTMLElement>('[data-reveal]', scene)
    const groups = $$<HTMLElement>('[data-stagger]', scene)
    const medias = $$<HTMLElement>('[data-media]', scene)
    const stamps = $$<HTMLElement>('[data-stamp]', scene)
    const signatures = $$<SVGPathElement>('[data-signature]', scene)

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

    if (medias.length) {
      tl.fromTo(
        medias,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.out' },
        0,
      )
    }

    if (lines.length) {
      /* `y: 0` clears the pixel offset GSAP reads from the CSS translateY(115%)
         hidden state; without it the line never returns to its baseline. */
      tl.fromTo(
        lines,
        { yPercent: 115, y: 0 },
        { yPercent: 0, y: 0, duration: 1.05, stagger: 0.075, ease: 'expo.out' },
        0.05,
      )
    }

    if (reveals.length) {
      tl.fromTo(
        reveals,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.07 },
        0.2,
      )
    }

    groups.forEach((group) => {
      const children = Array.from(group.children)
      if (!children.length) return
      tl.fromTo(
        children,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.055 },
        0.28,
      )
    })

    if (stamps.length) {
      tl.fromTo(
        stamps,
        { opacity: 0, scale: 1.15, rotate: -16 },
        { opacity: 1, scale: 1, rotate: -6, duration: 0.85, ease: 'back.out(1.7)' },
        0.55,
      )
    }

    if (signatures.length) {
      signatures.forEach((sig, index) => {
        const length = sig.getTotalLength()
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length })
        tl.to(
          sig,
          { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' },
          0.5 + index * 0.18,
        )
      })
    }

    if (i === 0) {
      gsap.delayedCall(0.2, () => tl.play())
      return
    }

    ScrollTrigger.create({
      trigger: scene,
      start: 'top 68%',
      once: true,
      onEnter: () => tl.play(),
    })
  })
}

export function initParallax(reduce: boolean): void {
  if (reduce) return

  $$<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.speed ?? 6)
    const scene = el.closest('[data-scene]')

    gsap.fromTo(
      el,
      { yPercent: -speed },
      {
        yPercent: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: scene ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  })

  ScrollTrigger.refresh()
}
