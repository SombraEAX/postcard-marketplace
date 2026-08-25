import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { sleep, networkIcon } from '../utils'
import { getLang } from '../i18n'
import type { Postcard } from '../types'
import './Carousel.css'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animateScroll(el: HTMLElement, from: number, to: number, duration: number): Promise<void> {
  return new Promise(resolve => {
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      el.scrollLeft = Math.round(from + (to - from) * easeOutCubic(t))
      if (t < 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
}

export interface CarouselHandle {
  prev: () => void
  next: () => void
}

interface CarouselProps {
  postcards: Postcard[]
  selected: number
  onSelect: (index: number) => void
}

const Carousel = forwardRef<CarouselHandle, CarouselProps>(function Carousel({ postcards, selected, onSelect }, ref) {
  const innerRef = useRef<HTMLDivElement | null>(null)
  const outerRef = useRef<HTMLDivElement | null>(null)
  const imagesRef = useRef<HTMLDivElement | null>(null)
  const imageBoxRef = useRef<HTMLElement | null>(null)
  const bgRef = useRef<HTMLElement | null>(null)
  const stateRef = useRef({ pressed: 0, scrollX: 0, x: 0, flag: 0 })
  const selectedRef = useRef(selected)
  const animRef = useRef<(() => void) | null>(null)

  const len = postcards.length

  const getBoxWidth = useCallback((): number => {
    return innerRef.current ? innerRef.current.getBoundingClientRect().width : 0
  }, [])

  const applyItemSize = useCallback((wrapper: HTMLElement, itemWidth: number): void => {
    wrapper.style.flex = `0 0 ${itemWidth}px`
    const side = Math.min(Math.round(itemWidth * 0.8), 100)
    const image = wrapper.firstElementChild as HTMLElement | null
    if (image) {
      image.style.width = `${side}px`
      image.style.height = `${side}px`
    }
  }, [])

  const applyLayout = useCallback((): { boxWidth: number; itemWidth: number } | null => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return null
    const outerWidth = outer.getBoundingClientRect().width
    const itemWidth = Math.floor(outerWidth / 5)
    const boxWidth = itemWidth * 5
    inner.style.width = `${boxWidth}px`
    inner.style.left = `${(outerWidth - boxWidth) / 2}px`
    return { boxWidth, itemWidth }
  }, [])

  const getItemWidth = useCallback((): number => {
    const wrapper = imagesRef.current?.querySelector('.c-image-wrapper')
    return wrapper ? wrapper.getBoundingClientRect().width : 0
  }, [])

  const getImagePos = useCallback((index: number, boxWidth: number): number => {
    const itemWidth = getItemWidth()
    if (!itemWidth) return 0
    return (index + 1) * itemWidth - boxWidth
  }, [getItemWidth])

  const scrollAnim = useCallback(async (scrollTarget: number): Promise<void> => {
    const el = innerRef.current
    if (!el) return
    if (animRef.current) animRef.current()
    let cancelled = false
    animRef.current = () => { cancelled = true }
    const from = el.scrollLeft
    const dist = Math.abs(scrollTarget - from)
    const duration = Math.min(Math.max(dist * 2, 200), 500)
    await animateScroll(el, from, scrollTarget, duration)
    if (!cancelled) el.scrollLeft = scrollTarget
  }, [])

  const postcardHTML = useCallback(({ name, author, network, url, orientation }: Postcard): string => {
    const lang = getLang()
    return `<div class="h-image-frame" data-orientation="${orientation}">
      <div class="h-image-infobar">
        <div class="h-image-label">${name[lang]}</div>
        <div class="h-image-copyright-info">
          <div class="h-image-copyright-info-text">
            <div class="h-image-author-label">Author</div>
            <div class="h-image-author-name">@${author}</div>
          </div>
          <div class="h-image-copyright-info-icon" data-network="${network}" style="background-image:url('${networkIcon[network]}')"></div>
        </div>
      </div>
      <div class="h-image" style="background-image:url('${url}')"></div>
    </div>`
  }, [])

  const setImage = useCallback((params: Postcard) => {
    if (!bgRef.current || !imageBoxRef.current) return
    bgRef.current.style.backgroundImage = `url("${params.url}")`
    const box = imageBoxRef.current
    box.innerHTML = `<div style="width:100%;height:100%">${postcardHTML(params)}</div>`
  }, [postcardHTML])

  const changeImageAnimation = useCallback(async (params: Postcard) => {
    const box = imageBoxRef.current
    const bg = bgRef.current
    if (!box || !bg) return
    box.style.transition = 'opacity 0.3s'
    bg.style.transition = 'opacity 0.3s'
    box.style.opacity = '0'
    bg.style.opacity = '0'
    await sleep(300)
    setImage(params)
    box.style.opacity = '1'
    bg.style.opacity = '0.5'
    await sleep(300)
    box.style.transition = ''
    bg.style.transition = ''
  }, [setImage])

  const navigateInternal = useCallback(async (index: number, direction: 'left' | 'right') => {
    const cards = postcards
    while (index < 0) index += cards.length
    while (index >= cards.length) index -= cards.length
    const card = cards[index]
    const inner = innerRef.current
    if (!inner) return
    const boxWidth = getBoxWidth()

    if (direction === 'left' && index > selectedRef.current) {
      inner.scrollLeft = getImagePos(cards.length * 2 + selectedRef.current, boxWidth)
    } else if (direction === 'right' && index < selectedRef.current) {
      inner.scrollLeft = getImagePos(selectedRef.current, boxWidth)
    }
    onSelect(index)
    const scrollTarget = getImagePos(cards.length + index, boxWidth)
    scrollAnim(scrollTarget)
    changeImageAnimation(card)
  }, [postcards, onSelect, getBoxWidth, getImagePos, scrollAnim, changeImageAnimation])

  useImperativeHandle(ref, () => ({
    prev: () => {
      let idx = selectedRef.current - 1
      if (idx === -1) idx = postcards.length - 1
      navigateInternal(idx, 'left')
    },
    next: () => {
      let idx = selectedRef.current + 1
      if (idx === postcards.length) idx = 0
      navigateInternal(idx, 'right')
    }
  }), [postcards.length, navigateInternal])

  const navigateInternalRef = useRef(navigateInternal)
  const postcardsRef = useRef(postcards)

  useEffect(() => {
    selectedRef.current = selected
  })

  useEffect(() => {
    navigateInternalRef.current = navigateInternal
  })

  useEffect(() => {
    postcardsRef.current = postcards
  })

  useEffect(() => {
    const inner = innerRef.current
    const container = imagesRef.current
    const layout = applyLayout()
    if (!inner || !container || !layout) return

    for (let i = 0; i < 3; i++) {
      for (const [index, card] of Object.entries(postcardsRef.current)) {
        const wrapper = document.createElement('div')
        wrapper.className = 'c-image-wrapper'
        const image = document.createElement('div')
        image.className = 'c-image'
        image.style.backgroundImage = `url("${card.url}")`
        const idx = Number(index)
        image.onclick = () => {
          if (stateRef.current.flag) {
            navigateInternalRef.current(idx, 'left')
          }
        }
        wrapper.append(image)
        applyItemSize(wrapper, layout.itemWidth)
        container.append(wrapper)
      }
    }

    inner.scrollLeft = getImagePos(postcardsRef.current.length, layout.boxWidth)
    setImage(postcardsRef.current[0])
  }, [applyLayout, applyItemSize, getImagePos, setImage])

  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return
    inner.onmousedown = (event: MouseEvent) => {
      if (animRef.current) animRef.current()
      stateRef.current.x = event.clientX
      stateRef.current.scrollX = inner.scrollLeft
      stateRef.current.pressed = 1
    }
  }, [])

  useEffect(() => {
    const onResize = () => {
      const inner = innerRef.current
      if (!inner) return
      const layout = applyLayout()
      if (!layout) return
      const wrappers = inner.querySelectorAll<HTMLElement>('.c-image-wrapper')
      for (const w of wrappers) applyItemSize(w, layout.itemWidth)
      inner.scrollLeft = getImagePos(selectedRef.current + postcards.length, layout.boxWidth)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [applyLayout, applyItemSize, getImagePos, postcards.length])

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const s = stateRef.current
      if (!s.pressed) return
      const inner = innerRef.current
      if (!inner) return
      const itemWidth = getItemWidth()
      const boxWidth = inner.getBoundingClientRect().width
      const midStart = (len + 1) * itemWidth - boxWidth
      const midLen = len * itemWidth
      let scroll = s.scrollX + s.x - event.clientX
      while (scroll < midStart) scroll += midLen
      while (scroll > midStart + midLen) scroll -= midLen
      inner.scrollLeft = scroll
    }

    const onMouseUp = async (event: MouseEvent) => {
      const s = stateRef.current
      if (!s.pressed) return
      const inner = innerRef.current
      if (!inner) return

      if (event.clientX - s.x) {
        const boxWidth = getBoxWidth()
        const itemWidth = getItemWidth()
        const scrollRight = inner.scrollLeft + boxWidth
        const targetDomIndex = Math.round(scrollRight / itemWidth) - 1
        const index = ((targetDomIndex % postcards.length) + postcards.length) % postcards.length
        onSelect(index)
        changeImageAnimation(postcards[index])
        const scrollTarget = getImagePos(index + postcards.length, boxWidth)
        await scrollAnim(scrollTarget)
        inner.scrollLeft = scrollTarget
        s.flag = 0
      } else {
        s.flag = 1
      }
      s.pressed = 0
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [postcards, onSelect, changeImageAnimation, getImagePos, getBoxWidth, getItemWidth, scrollAnim, len])

  return (
    <div className="carousel">
      <button className="c-left c-btn" onClick={() => {
        let idx = selectedRef.current - 1
        if (idx === -1) idx = postcards.length - 1
        navigateInternal(idx, 'left')
      }} />
      <div className="c-outer" ref={outerRef}>
        <div className="c-inner" ref={innerRef}>
          <div className="c-images" ref={imagesRef} />
        </div>
      </div>
      <button className="c-right c-btn" onClick={() => {
        let idx = selectedRef.current + 1
        if (idx === postcards.length) idx = 0
        navigateInternal(idx, 'right')
      }} />
    </div>
  )
})

export default Carousel
