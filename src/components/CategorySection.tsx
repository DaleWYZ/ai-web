import type { AIProduct } from '@/types'
import { Card } from './Card'

interface CategorySectionProps {
  title: string
  products: AIProduct[]
}

export function CategorySection({ title, products }: CategorySectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.url} product={product} />
        ))}
      </div>
    </section>
  )
} 