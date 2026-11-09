import { gsap } from 'gsap'
import type Lenis from 'lenis'
import { $, $$, clamp, pad } from '../lib/dom'

interface NavOptions {
  lenis: Lenis | null
  reduce: boolean
}

export function initNav({ lenis, reduce }: NavOptions): void {
  const scenes = $$<HTMLElement>('[data-scene]')
  if (!scenes.length) return

  const labels = scenes.map((scene) => scene.dataset.label ?? '')
  const total = scenes.length

  const counter = $<HTMLElement>('[data-counter]')
  const counterAll = $<HTMLElement>('.counter__all')
  const chapter = $<HTMLElement>('[data-chapter]')
  const progress = $<HTMLElement>('[data-progress]')
  const railList = $<HTMLOListElement>('[data-rail]')
  const overview = $<HTMLElement>('[data-overview]')
  const overviewList = $<HTMLOListElement>('[data-overview-list]')
  const overviewClose = $<HTMLButtonElement>('[data-overview-close]')

  let current = -1
  let ticking = false

  if (counterAll) counterAll.textContent = pad(total)

  function span(className: string, text: string): HTMLSpanElement {
    const el = document.createElement('span')
    el.className = className
    el.textContent = text
    return el
  }

  function goTo(index: number): void {
    const target = clamp(index, 0, total - 1)
    const scene = scenes[target]
    if (!scene) return

    if (lenis) {
      lenis.scrollTo(scene, { duration: reduce ? 0 : 1.15, offset: 0 })
    } else {
      scene.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
  }

  function setActive(index: number): void {
    if (index === current) return
    current = index

    if (counter) {
      counter.textContent = pad(index + 1)
      gsap.fromTo(
        counter,
        { yPercent: -55, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
      )
    }

    if (chapter) chapter.textContent = labels[index] ?? ''

    railList?.querySelectorAll<HTMLButtonElement>('.rail__btn').forEach((btn, i) => {
      const isActive = i === index
      btn.classList.toggle('is-active', isActive)
      if (isActive) btn.setAttribute('aria-current', 'true')
      else btn.removeAttribute('aria-current')
    })
  }

  function update(): void {
    ticking = false

    const max = document.documentElement.scrollHeight - window.innerHeight
    const y = window.scrollY

    if (progress) {
      const value = max > 0 ? clamp(y / max, 0, 1) : 0
      progress.style.transform = `scaleX(${value})`
    }

    const line = window.innerHeight * 0.42
    let active = 0

    scenes.forEach((scene, i) => {
      if (scene.getBoundingClientRect().top <= line) active = i
    })

    setActive(active)
  }

  function onScroll(): void {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  /* ---------- rail ---------- */

  if (railList) {
    labels.forEach((label, i) => {
      const li = document.createElement('li')
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'rail__btn'
      btn.setAttribute('aria-label', `Ke bab ${i + 1}: ${label}`)
      btn.append(span('rail__label', label), span('rail__tick', ''))
      btn.addEventListener('click', () => goTo(i))
      li.append(btn)
      railList.append(li)
    })
  }

  /* ---------- overview ---------- */

  if (overviewList) {
    labels.forEach((label, i) => {
      const li = document.createElement('li')
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'overview__item'
      btn.append(
        span('overview__num', pad(i + 1)),
        span('overview__name', label),
        span('overview__meta', i === 0 ? 'Cover' : 'Bab'),
      )
      btn.addEventListener('click', () => {
        closeOverview()
        goTo(i)
      })
      li.append(btn)
      overviewList.append(li)
    })
  }

  function openOverview(): void {
    if (!overview) return
    overview.hidden = false
    gsap.fromTo(overview, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    overviewClose?.focus()
  }

  function closeOverview(): void {
    if (!overview || overview.hidden) return
    overview.hidden = true
  }

  function toggleOverview(): void {
    if (!overview) return
    if (overview.hidden) openOverview()
    else closeOverview()
  }

  function toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => undefined)
    } else {
      void document.exitFullscreen().catch(() => undefined)
    }
  }

  overviewClose?.addEventListener('click', closeOverview)

  /* ---------- clicks ---------- */

  document.addEventListener('click', (event) => {
    const origin = event.target
    if (!(origin instanceof Element)) return

    const link = origin.closest<HTMLElement>('[data-goto]')
    if (!link) return

    const id = link.dataset.goto
    const index = scenes.findIndex((scene) => scene.id === id)
    if (index < 0) return

    event.preventDefault()
    closeOverview()
    goTo(index)
  })

  /* ---------- keyboard ---------- */

  window.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return

    const target = event.target
    if (
      target instanceof HTMLElement &&
      target.closest('input, textarea, select, [contenteditable="true"]')
    ) {
      return
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault()
        goTo(current + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault()
        goTo(current - 1)
        break
      case ' ':
        if (target instanceof HTMLElement && target.closest('a, button')) return
        event.preventDefault()
        goTo(current + 1)
        break
      case 'Home':
        event.preventDefault()
        goTo(0)
        break
      case 'End':
        event.preventDefault()
        goTo(total - 1)
        break
      case 'o':
      case 'O':
        toggleOverview()
        break
      case 'Escape':
        closeOverview()
        break
      case 'f':
      case 'F':
        toggleFullscreen()
        break
      default:
        break
    }
  })

  /* ---------- wiring ---------- */

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  document.fonts.ready.then(() => update()).catch(() => undefined)

  requestAnimationFrame(update)
}
