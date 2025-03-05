export interface CloudinaryResource {
  public_id: string
  secure_url: string
  format: string
  width: number
  height: number
  resource_type: "image" | "video"
  created_at: string
}

export interface CloudinaryFolder {
  name: string
  path: string
}

export interface CloudinarySearchResult {
  resources: CloudinaryResource[]
  total_count: number
}

