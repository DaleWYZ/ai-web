export interface AIProduct {
  name: string
  description: string
  url: string
  icon: string
  source?: string
}

export interface ProductsByCategory {
  [category: string]: AIProduct[]
} 