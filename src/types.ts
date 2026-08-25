export type Orientation = 'ver' | 'hor'

export type Network = 'inst' | 'dribble' | 'behance'

export type LocalizedText = Record<'es' | 'en' | 'fr', string>

export interface Postcard {
  name: LocalizedText
  author: string
  network: Network
  url: string
  orientation: Orientation
  info: LocalizedText
}

export interface Review {
  author: string
  avatar: string
  network: Network
  text: LocalizedText
}
