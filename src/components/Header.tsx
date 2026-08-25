import { useRef, useEffect } from 'react'
import Carousel from './Carousel'
import LangMenu from './LangMenu'
import type { CarouselHandle } from './Carousel'
import MobileCarousel from './MobileCarousel'
import { networkIcon } from '../utils'
import { STRINGS, useLang } from '../i18n'
import type { Postcard } from '../types'
import './Header.css'

interface DesktopHeaderProps {
  postcards: Postcard[]
  selected: number
  onSelect: (index: number) => void
  onImageClick: () => void
  carouselRef: React.Ref<CarouselHandle>
}

export function DesktopHeader({ postcards, selected, onSelect, onImageClick, carouselRef }: DesktopHeaderProps) {
  const imageBoxRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const lang = useLang()
  const s = STRINGS[lang]

  useEffect(() => {
    if (!imageBoxRef.current || !bgRef.current || !postcards[selected]) return
    const { name, author, network, url, orientation } = postcards[selected]
    const box = imageBoxRef.current
    box.innerHTML = `<div style="width:100%;height:100%"><div class="h-image-frame" data-orientation="${orientation}">
      <div class="h-image-infobar">
        <div class="h-image-label">${name[lang]}</div>
        <div class="h-image-copyright-info">
          <div class="h-image-copyright-info-text">
            <div class="h-image-author-label">${s.authorLabel}</div>
            <div class="h-image-author-name">@${author}</div>
          </div>
          <div class="h-image-copyright-info-icon" data-network="${network}" style="background-image:url('${networkIcon[network]}')"></div>
        </div>
      </div>
      <div class="h-image" style="background-image:url('${url}')"></div>
    </div></div>`
    bgRef.current.style.backgroundImage = `url("${url}")`
  }, [selected, postcards, lang, s.authorLabel])

  return (
    <div className="desktop">
      <div className="ellipse1" />
      <div className="ellipse2" />
      <div className="h-bg-postcard-wrapper">
        <div className="h-bg-postcard" ref={bgRef} />
      </div>
      <div className="h-right">
        <div className="h-right-top">
          <a href="#where-to-buy" className="h-top-link">{s.navBuy}</a>
          <a href="#become-a-partner" className="h-top-link partnership-long">{s.navPartnerLong}</a>
          <a href="#become-a-partner" className="h-top-link partnership-compact">{s.navPartnerShort}</a>
          <div className="placeholder" />
          <LangMenu />
        </div>
        <div className="h-image-outer-box" ref={imageBoxRef} onClick={onImageClick} />
      </div>
      <div className="h-left">
        <div className="sitelogo">Company</div>
        <h1>{s.heroTitle}</h1>
        <div className="geo-label-wrapper">
          <div className="geo-label">Buenos Aires</div>
        </div>
        <Carousel ref={carouselRef} postcards={postcards} selected={selected} onSelect={onSelect} />
      </div>
    </div>
  )
}

interface MobileHeaderProps {
  postcards: Postcard[]
  selected: number
  onSelect: (index: number) => void
}

export function MobileHeader({ postcards, selected, onSelect }: MobileHeaderProps) {
  const lang = useLang()
  const s = STRINGS[lang]
  return (
    <div className="mobile">
      <div className="mobile-header-bg-wrapper">
        <div
          className="mobile-header-bg"
          style={{
            backgroundImage: postcards[selected]
              ? `url('${postcards[selected].url}')`
              : "url('/postcards/02.jpg')"
          }}
        />
      </div>
      <div className="h-mob-top">
        <div className="sitelogo">Company</div>
        <div className="placeholder" />
        <LangMenu />
      </div>
      <h1>{s.heroTitle}</h1>
      <MobileCarousel postcards={postcards} onSelect={onSelect} />
    </div>
  )
}
