import { useEffect, useRef, useState } from 'react'
import { LANGS, setLang, useLang, type Lang } from '../i18n'

const SHORT: Record<Lang, string> = { es: 'Es', en: 'En', fr: 'Fr' }
const NAMES: Record<Lang, string> = { es: 'Español', en: 'English', fr: 'Français' }

export default function LangMenu() {
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div className="lang-menu" ref={rootRef}>
      <button
        type="button"
        className={`lang lang-${lang}`}
        aria-label="Select language"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        {SHORT[lang]}
      </button>
      {open && (
        <ul className="lang-options" role="listbox">
          {LANGS.map(code => (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={code === lang}
                className={`lang-option${code === lang ? ' active' : ''}`}
                onClick={() => {
                  setLang(code)
                  setOpen(false)
                }}
              >
                <span className={`lang-flag lang-${code}`} />
                {NAMES[code]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
