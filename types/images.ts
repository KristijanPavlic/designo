import type { StaticImageData } from 'next/image'

export interface BackgroundImage {
  src: StaticImageData
  alt: string
  platform?: 'desktop' | 'mobile' | 'both'
}
