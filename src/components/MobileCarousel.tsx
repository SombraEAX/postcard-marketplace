import { useRef, useEffect } from 'react'
import { networkIcon } from '../utils'
import { getLang, STRINGS, subscribe } from '../i18n'
import type { Postcard } from '../types'
import './MobileCarousel.css'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

interface AnimateOpts {
  from: number
  to: number
  duration: number
}

interface LayoutData {
  outerSizes: DOMRect
  percent: number
  activeSizePx: number
  inactiveSizePx: number
  padding: number
  inactiveTopPx: number
}

type Redraw = (data: LayoutData, animation: number) => void

function animate(opts: AnimateOpts, dataRef: React.RefObject<LayoutData | null>, redraw: Redraw, onComplete?: () => void): () => void {
  const { from, to, duration } = opts
  const start = performance.now()
  let frame = 0

  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1)
    const value = from + (to - from) * easeOutCubic(t)
    if (dataRef.current && redraw) redraw(dataRef.current, value)
    if (t < 1) {
      frame = requestAnimationFrame(tick)
    } else {
      if (onComplete) onComplete()
    }
  }

  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}

interface MobileCarouselProps {
  postcards: Postcard[]
  onSelect: (index: number) => void
}

export default function MobileCarousel({ postcards, onSelect }: MobileCarouselProps) {
  const outerRef = useRef<HTMLDivElement | null>(null)
  const imagesRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef(0)
  const animationRef = useRef(0)
  const dataRef = useRef<LayoutData | null>(null)
  const startRef = useRef(0)
  const cancelRef = useRef<(() => void) | null>(null)

  function calc(): LayoutData | null {
    const outer = outerRef.current
    if (!outer) return null
    const outerSizes = outer.getBoundingClientRect()
    const percent = outerSizes.height / 100
    const activeSizePx = 80 * percent
    const inactiveSizePx = 60 * percent
    const padding = (outerSizes.width - activeSizePx) / 4
    const inactiveTopPx = (outerSizes.height - inactiveSizePx) / 2
    return { outerSizes, percent, activeSizePx, inactiveSizePx, padding, inactiveTopPx }
  }

  function setImages(active: number) {
    const container = imagesRef.current
    if (!container) return
    const images = [...container.querySelectorAll<HTMLElement>('.mob-carousel-image')]
    for (const index in images) {
      const image = images[index]
      let i = active - 2 + Number(index)
      if (i > postcards.length - 1) i = i % postcards.length
      while (i < 0) i += postcards.length
      const props = postcards[i]
      if (!props) continue
      const { name, author, network, url, orientation } = props
      const lang = getLang()
      image.innerHTML = `<div style="width:100%;height:100%"><div class="h-image-frame" data-orientation="${orientation}">
        <div class="h-image-infobar">
          <div class="h-image-label">${name[lang]}</div>
          <div class="h-image-copyright-info">
            <div class="h-image-copyright-info-text">
              <div class="h-image-author-label">${STRINGS[lang].authorLabel}</div>
              <div class="h-image-author-name">@${author}</div>
            </div>
            <div class="h-image-copyright-info-icon" data-network="${network}" style="background-image:url('${networkIcon[network]}')"></div>
          </div>
        </div>
        <div class="h-image" style="background-image:url('${url}')"></div>
      </div></div>`
    }
  }

  function redraw(data: LayoutData, animation: number) {
    const container = imagesRef.current
    if (!container) return
    const images = [...container.querySelectorAll<HTMLElement>('.mob-carousel-image')]
    const { outerSizes, percent, activeSizePx, inactiveSizePx, padding, inactiveTopPx } = data

    const centerImageSize = 80 - (80 - 60) * Math.abs(animation) / 100
    const asideImageSize = 60 + (80 - 60) * Math.abs(animation) / 100
    const centerImageSizePx = percent * centerImageSize
    const asideImageSizePx = percent * asideImageSize
    const centerImageTopPx = (outerSizes.height - centerImageSizePx) / 2
    const asideImageTopPx = (outerSizes.height - asideImageSizePx) / 2
    const centerPosition = outerSizes.width * 2.5
    const shift = activeSizePx / 2 + padding + inactiveSizePx / 2
    const centerImagePosition = centerPosition + animation / 100 * shift
    const centerImageLeft = centerImagePosition - centerImageSizePx / 2

    images[2].style.top = Math.round(centerImageTopPx) + 'px'
    images[2].style.left = Math.round(centerImageLeft) + 'px'
    images[2].style.width = Math.round(centerImageSizePx) + 'px'
    images[2].style.height = Math.round(centerImageSizePx) + 'px'

    const i = animation > 0 ? 1 : 3
    for (const k of [0, 1, 3, 4]) {
      if (k === i) continue
      images[k].style.top = Math.round(inactiveTopPx) + 'px'
      images[k].style.width = Math.round(inactiveSizePx) + 'px'
      images[k].style.height = Math.round(inactiveSizePx) + 'px'
    }

    images[i].style.top = Math.round(asideImageTopPx) + 'px'
    images[i].style.width = Math.round(asideImageSizePx) + 'px'
    images[i].style.height = Math.round(asideImageSizePx) + 'px'

    const a = centerImageLeft - padding - asideImageSizePx
    images[1].style.left = Math.round(a) + 'px'
    images[0].style.left = Math.round(a - padding - inactiveSizePx) + 'px'

    const b = centerImagePosition + centerImageSizePx / 2 + padding
    images[3].style.left = Math.round(b) + 'px'
    images[4].style.left = Math.round(b + asideImageSizePx + padding) + 'px'
  }

  function next() {
    if (cancelRef.current) cancelRef.current()
    const from = animationRef.current
    cancelRef.current = animate(
      { from, to: -100, duration: 300 },
      dataRef, redraw,
      () => {
        let newActive = activeRef.current + 1
        if (newActive > postcards.length - 1) newActive = 0
        activeRef.current = newActive
        onSelect(newActive)
        setImages(newActive)
        animationRef.current = 0
        if (dataRef.current) redraw(dataRef.current, 0)
      }
    )
  }

  function prev() {
    if (cancelRef.current) cancelRef.current()
    const from = animationRef.current
    cancelRef.current = animate(
      { from, to: 100, duration: 300 },
      dataRef, redraw,
      () => {
        let newActive = activeRef.current - 1
        if (newActive < 0) newActive = postcards.length - 1
        activeRef.current = newActive
        onSelect(newActive)
        setImages(newActive)
        animationRef.current = 0
        if (dataRef.current) redraw(dataRef.current, 0)
      }
    )
  }

  useEffect(() => {
    dataRef.current = calc()
    setImages(0)
    if (dataRef.current) redraw(dataRef.current, 0)

    const onResize = () => {
      dataRef.current = calc()
      if (dataRef.current) redraw(dataRef.current, animationRef.current)
    }
    window.addEventListener('resize', onResize)

    const outer = outerRef.current
    const handleTouchStart = (event: TouchEvent) => {
      startRef.current = event.changedTouches[0].pageX
    }
    const handleTouchEnd = (event: TouchEvent) => {
      if (event.changedTouches[0].pageX > startRef.current) prev()
      else next()
    }
    outer?.addEventListener('touchstart', handleTouchStart)
    outer?.addEventListener('touchend', handleTouchEnd)

    const unsubscribe = subscribe(() => {
      setImages(activeRef.current)
      if (dataRef.current) redraw(dataRef.current, animationRef.current)
    })

    return () => {
      unsubscribe()
      window.removeEventListener('resize', onResize)
      if (outer) {
        outer.removeEventListener('touchstart', handleTouchStart)
        outer.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [])

  return (
    <div className="mob-carousel-outer" ref={outerRef}>
      <div className="mob-carousel-inner" ref={imagesRef}>
        <div className="mob-carousel-image" />
        <div className="mob-carousel-image" />
        <div className="mob-carousel-image" />
        <div className="mob-carousel-image" />
        <div className="mob-carousel-image" />
      </div>
    </div>
  )
}
