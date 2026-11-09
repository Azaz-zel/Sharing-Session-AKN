import { gsap } from 'gsap'
import { $ } from '../lib/dom'

export function initMarquee(reduce: boolean): void {
  if (reduce) return

  const track = $<HTMLElement>('[data-marquee-track]')
  if (!track) return

  /* Two identical groups make a -50% shift land exactly on the seam. */
  gsap.to(track, {
    xPercent: -50,
    duration: 34,
    ease: 'none',
    repeat: -1,
  })
}
