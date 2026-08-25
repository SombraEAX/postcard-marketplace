import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import postcards, { reviews } from './data'
import Preview from './components/Preview'
import { DesktopHeader, MobileHeader } from './components/Header'
import Footer from './components/Footer'
import { STRINGS, useLang } from './i18n'
import { networkIcon } from './utils'
import type { CarouselHandle } from './components/Carousel'
import './index.css'

export default function App() {
  const [selected, setSelected] = useState(0)
  const [isPreviewShow, setIsPreviewShow] = useState(false)
  const carouselRef = useRef<CarouselHandle | null>(null)
  const lang = useLang()
  const s = STRINGS[lang]

  const reviewPosRef = useRef(0)
  const reviewTouchX = useRef<number | null>(null)
  const reviewsWindowRef = useRef<HTMLDivElement | null>(null)
  const reviewsTrackRef = useRef<HTMLDivElement | null>(null)

  const placeReviews = useCallback((pos: number, animate: boolean) => {
    const track = reviewsTrackRef.current
    if (!track) return
    const w = reviewsWindowRef.current?.clientWidth ?? 0
    if (!animate) track.style.transition = 'none'
    else track.style.transition = ''
    track.style.transform = `translateX(${-pos * w}px)`
    if (!animate) {
      void track.offsetHeight
      track.style.transition = ''
    }
    reviewPosRef.current = pos
  }, [])

  const moveReviews = useCallback((direction: number) => {
    const track = reviewsTrackRef.current
    if (!track) return
    const n = reviews.length
    const target = reviewPosRef.current + direction
    if (target >= 0 && target <= n) {
      placeReviews(target, true)
      return
    }
    if (direction > 0) {
      const toStart = (e: TransitionEvent) => {
        if (e.target !== track || e.propertyName !== 'transform') return
        settle()
      }
      let timer = 0
      const settle = () => {
        track.removeEventListener('transitionend', toStart)
        clearTimeout(timer)
        if (reviewPosRef.current === n) placeReviews(0, false)
      }
      track.addEventListener('transitionend', toStart)
      timer = window.setTimeout(settle, 520)
      placeReviews(n, true)
    } else {
      placeReviews(n, false)
      requestAnimationFrame(() => placeReviews(n - 1, true))
    }
  }, [placeReviews])

  useLayoutEffect(() => {
    const el = reviewsWindowRef.current
    if (!el) return
    const update = () => placeReviews(reviewPosRef.current, false)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [placeReviews])

  const prevImage = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.prev()
    } else {
      setSelected(prev => {
        const idx = prev - 1
        return idx === -1 ? postcards.length - 1 : idx
      })
    }
  }, [])

  const nextImage = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.next()
    } else {
      setSelected(prev => {
        const idx = prev + 1
        return idx === postcards.length ? 0 : idx
      })
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage()
      else if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prevImage, nextImage])

  return (
    <>
      <Preview
        postcards={postcards}
        selected={selected}
        isShow={isPreviewShow}
        onClose={() => setIsPreviewShow(false)}
        onPrev={prevImage}
        onNext={nextImage}
      />
      <div className="global">
        <header>
          <DesktopHeader
            postcards={postcards}
            selected={selected}
            onSelect={setSelected}
            onImageClick={() => setIsPreviewShow(true)}
            carouselRef={carouselRef}
          />
          <MobileHeader
            postcards={postcards}
            selected={selected}
            onSelect={setSelected}
          />
        </header>
        <main>
          <section id="where-to-buy">
            <h2>{s.buyTitle}</h2>
            <p className="section-text">{s.buyText}</p>
          </section>
          <section id="become-a-partner" className="bottom-line">
            <h2>{s.partnerTitle}</h2>
            <div className="partners-links">
              <button className="partner-link">
                <div className="partner-link-icon icon-printer" />
                <div className="partner-link-label">
                  <div className="partner-link-label-top">{s.partnerBlocks[0].top}</div>
                  <div className="partner-link-label-bottom">{s.partnerBlocks[0].bottom}</div>
                </div>
                <div className="partner-link-arrow" />
              </button>
              <button className="partner-link">
                <div className="partner-link-icon icon-pallette" />
                <div className="partner-link-label">
                  <div className="partner-link-label-top">{s.partnerBlocks[1].top}</div>
                  <div className="partner-link-label-bottom">{s.partnerBlocks[1].bottom}</div>
                </div>
                <div className="partner-link-arrow" />
              </button>
              <button className="partner-link">
                <div className="partner-link-icon icon-market" />
                <div className="partner-link-label">
                  <div className="partner-link-label-top">{s.partnerBlocks[2].top}</div>
                  <div className="partner-link-label-bottom">{s.partnerBlocks[2].bottom}</div>
                </div>
                <div className="partner-link-arrow" />
              </button>
            </div>
          </section>
          <section>
            <h2>{s.reviewsTitle}</h2>
            <div className="reviews-carousel">
              <button
                type="button"
                className="review-btn review-btn-left"
                aria-label="Previous reviews"
                onClick={() => moveReviews(-1)}
              />
              <div className="reviews-window" ref={reviewsWindowRef}>
                <div
                  className="reviews"
                  ref={reviewsTrackRef}
                  onTouchStart={e => {
                    reviewTouchX.current = e.touches[0].clientX
                  }}
                  onTouchEnd={e => {
                    if (reviewTouchX.current === null) return
                    const dx = e.changedTouches[0].clientX - reviewTouchX.current
                    if (Math.abs(dx) > 40) moveReviews(dx < 0 ? 1 : -1)
                    reviewTouchX.current = null
                  }}
                >
                  {[...reviews, reviews[0]].map((review, i) => (
                    <figure className="review-card" key={`${review.author}-${i}`}>
                      <img className="review-photo" src={review.avatar} alt={review.author} />
                      <div className="review-content">
                        <blockquote className="review-text">{review.text[lang]}</blockquote>
                        <div className="review-author">
                          <span
                            className="review-icon"
                            style={{ backgroundImage: `url(${networkIcon[review.network]})` }}
                          />
                          <span className="review-name">@{review.author}</span>
                        </div>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="review-btn review-btn-right"
                aria-label="Next reviews"
                onClick={() => moveReviews(1)}
              />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
