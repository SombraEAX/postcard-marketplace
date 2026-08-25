import { useSyncExternalStore } from 'react'

export type Lang = 'es' | 'en' | 'fr'

export const LANGS: Lang[] = ['es', 'en', 'fr']

const STORAGE_KEY = 'preferred-lang'

interface Strings {
  navBuy: string
  navPartnerLong: string
  navPartnerShort: string
  heroTitle: string
  buyTitle: string
  buyText: string
  partnerTitle: string
  partnerBlocks: { top: string; bottom: string }[]
  reviewsTitle: string
  authorLabel: string
  turnText: string
  footerBuy: string
  footerPartner: string
  footerSupport: string
  footerLegal: string
}

export const STRINGS: Record<Lang, Strings> = {
  es: {
    navBuy: '¿Dónde comprar?',
    navPartnerLong: 'Quiero ser socio',
    navPartnerShort: 'Colaboración',
    heroTitle: 'Tu experiencia postal',
    buyTitle: '¿Dónde comprar?',
    buyText: 'Nuestras postales están disponibles en librerías, tiendas de diseño y concept stores de la ciudad. También puedes encargar cualquier postal online con entrega a todo el mundo: elige un diseño, escribe tu mensaje y la imprimiremos y enviaremos el mismo día.',
    partnerTitle: 'Quiero ser socio',
    partnerBlocks: [
      { top: 'Puedo imprimir', bottom: 'equipos y experiencia' },
      { top: 'Soy artista', bottom: 'puedo crear postales para ti' },
      { top: 'Tengo una tienda', bottom: 'para vuestros productos' }
    ],
    reviewsTitle: 'Opiniones',
    authorLabel: 'Autor',
    turnText: 'Dale la vuelta a la postal',
    footerBuy: '¿Dónde comprar?',
    footerPartner: 'Quiero ser socio',
    footerSupport: 'Atención al cliente',
    footerLegal: 'Aviso legal'
  },
  en: {
    navBuy: 'Where to buy?',
    navPartnerLong: 'I want to be a partner',
    navPartnerShort: 'Partnership',
    heroTitle: 'Your postcard experience',
    buyTitle: 'Where to buy?',
    buyText: 'Our postcards are available in bookstores, design shops and concept stores across the city. You can also order any card online with worldwide delivery — choose a design, write your message and we will print and send it the same day.',
    partnerTitle: 'I want to be a partner',
    partnerBlocks: [
      { top: 'I can print', bottom: 'equipment and experience' },
      { top: 'I am an artist', bottom: 'I can create cards for you' },
      { top: 'I have a store', bottom: 'for your products' }
    ],
    reviewsTitle: 'Reviews',
    authorLabel: 'Author',
    turnText: 'Turn the card over',
    footerBuy: 'Where to buy?',
    footerPartner: 'I want to be a partner',
    footerSupport: 'Customer Support',
    footerLegal: 'Legal'
  },
  fr: {
    navBuy: 'Où acheter ?',
    navPartnerLong: 'Je veux être partenaire',
    navPartnerShort: 'Partenariat',
    heroTitle: 'Expérience de cartes postales',
    buyTitle: 'Où acheter ?',
    buyText: "Nos cartes postales sont disponibles en librairies, boutiques de design et concept stores de la ville. Vous pouvez aussi commander en ligne avec une livraison mondiale : choisissez un motif, écrivez votre message et nous l'imprimerons et l'enverrons le jour même.",
    partnerTitle: 'Je veux devenir partenaire',
    partnerBlocks: [
      { top: 'Je peux imprimer', bottom: 'équipement et expérience' },
      { top: 'Je suis artiste', bottom: 'je peux créer des cartes pour vous' },
      { top: "J'ai un magasin", bottom: 'pour vos produits' }
    ],
    reviewsTitle: 'Avis',
    authorLabel: 'Auteur',
    turnText: 'Retournez la carte',
    footerBuy: 'Où acheter ?',
    footerPartner: 'Devenir partenaire',
    footerSupport: 'Service client',
    footerLegal: 'Mentions légales'
  }
}

function readStoredLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return LANGS.includes(saved as Lang) ? saved as Lang : 'es'
  } catch {
    return 'es'
  }
}

let current: Lang = readStoredLang()

document.documentElement.lang = current
document.title = STRINGS[current].heroTitle

const listeners = new Set<() => void>()

export function getLang(): Lang {
  return current
}

export function setLang(lang: Lang): void {
  if (!LANGS.includes(lang) || lang === current) return
  current = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {}
  document.documentElement.lang = lang
  document.title = STRINGS[lang].heroTitle
  listeners.forEach(l => l())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang)
}
