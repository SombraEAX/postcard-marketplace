import { useRef, useEffect } from 'react'
import { networkIcon } from '../utils'
import { STRINGS, useLang } from '../i18n'
import type { Postcard } from '../types'
import './Preview.css'

interface PreviewProps {
  postcards: Postcard[]
  selected: number
  isShow: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Preview({ postcards, selected, isShow, onClose, onPrev, onNext }: PreviewProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const lang = useLang()
  const s = STRINGS[lang]

  useEffect(() => {
    if (!wrapperRef.current) return
    if (isShow) {
      wrapperRef.current.classList.add('show')
    } else {
      wrapperRef.current.classList.remove('show')
    }
  }, [isShow])

  const card = postcards[selected]
  if (!card) return null

  return (
    <div className="preview-wrapper" ref={wrapperRef}>
      <div className="preview-bg" onClick={onClose} />
      <div className="preview-frame">
        <div className="preview">
          <div
            className="preview-image"
            style={{ backgroundImage: `url("${card.url}")` }}
          />
          <div className="preview-infobar">
            <div className="preview-close-wrapper">
              <button className="preview-close" onClick={onClose} />
            </div>
            <h2>{card.name[lang]}</h2>
            <div className="preview-copyright-bar">
              <div
                className="preview-copyright-icon"
                data-network={card.network}
                style={{ backgroundImage: `url(${networkIcon[card.network]})` }}
              />
              <div className="preview-copyright-info">
                <div className="preview-copyright-author-label">{s.authorLabel}</div>
                <div className="preview-copyright-author-name">@{card.author}</div>
              </div>
            </div>
            <div className="preview-text">{card.info[lang]}</div>
            <div className="preview-turn-block">
              <div className="preview-turn-icon" />
              <div className="preview-turn-text">{s.turnText}</div>
            </div>
            <div className="placeholder" />
            <div className="preview-buttons">
              <button className="preview-left" onClick={onPrev} />
              <button className="preview-right" onClick={onNext} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
