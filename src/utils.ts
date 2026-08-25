import type { Network } from './types'

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const networkIcon: Record<Network, string> = {
  inst: '/images/insta.png',
  dribble: '/images/dribble.png',
  behance: '/images/behance.png'
}
