import { gsap } from 'gsap'
import { $, $$, finePointer } from '../lib/dom'

export function initCursor(): void {
  if (!finePointer()) return

  const cursor = $<HTMLElement>('.cursor')
  const dot = $<HTMLElement>('.cursor__dot')
  const ring = $<HTMLElement>('.cursor__ring')
  const label = $<HTMLElement>('[data-cursor-label]')

  if (!cursor || !dot || !ring) return

  gsap.set([dot, ring], {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' })
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' })

  window.addEventListener(
    'pointermove',
    (event) => {
      gsap.set(dot, { x: event.clientX, y: event.clientY })
      ringX(event.clientX)
      ringY(event.clientY)
    },
    { passive: true },
  )

  document.addEventListener('pointerover', (event) => {
    const origin = event.target
    if (!(origin instanceof Element)) return

    const interactive = origin.closest<HTMLElement>('[data-cursor], a, button')
    const labelled = origin.closest<HTMLElement>('[data-cursor]')

    cursor.classList.toggle('is-hover', Boolean(interactive))
    cursor.classList.toggle('is-active', Boolean(labelled))

    if (label) label.textContent = labelled?.dataset.cursor ?? ''
  })

  document.addEventListener('pointerleave', () => {
    cursor.classList.remove('is-hover', 'is-active')
  })
}

export function initMagnetic(reduce: boolean): void {
  if (reduce || !finePointer()) return

  $$<HTMLElement>('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    const strength = 12

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect()
      const relX = (event.clientX - rect.left) / rect.width - 0.5
      const relY = (event.clientY - rect.top) / rect.height - 0.5
      xTo(relX * strength)
      yTo(relY * strength)
    })

    el.addEventListener('pointerleave', () => {
      xTo(0)
      yTo(0)
    })
  })
}
