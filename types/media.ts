export type MediaCategory =
  | 'weddings'
  | 'family_kids'
  | 'christening'
  | 'birthdays'

export type MediaStatus = 'pending' | 'accepted' | 'rejected'

export interface MediaFile {
  id: string
  file: File
  preview: string
  status: MediaStatus
  type: 'image' | 'video'
}
