import { STRINGS, useLang } from '../i18n'
import './Footer.css'

export default function Footer() {
  const lang = useLang()
  const s = STRINGS[lang]
  return (
    <footer>
      <ul className="footer-links">
        <li><a href="#where-to-buy">{s.footerBuy}</a></li>
        <li><a href="#become-a-partner">{s.footerPartner}</a></li>
        <li><a href="#">{s.footerSupport}</a></li>
        <li><a href="#">{s.footerLegal}</a></li>
      </ul>
      <div className="copyright">&copy; Company</div>
    </footer>
  )
}
