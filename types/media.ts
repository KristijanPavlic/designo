export type MediaCategory =
  | 'weddings'
  | 'christening'
  | 'newborn'
  | 'cake_smash_birthdays'

export type MediaStatus = 'pending' | 'accepted' | 'rejected'

export interface MediaFile {
  id: string
  file: File
  preview: string
  status?: MediaStatus
  type: 'image' | 'video'
  width?: number
  height?: number
}
