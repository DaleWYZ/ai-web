import Image from 'next/image'
import type { AIProduct } from '@/types'

interface CardProps {
  product: AIProduct
}

export function Card({ product }: CardProps) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative w-8 h-8 mr-3">
            <Image
              src={product.icon}
              alt={`${product.name} icon`}
              fill
              className="rounded-md"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        </div>
        <p className="text-gray-600 mb-4">{product.description}</p>
        {product.source && (
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
            来源: {product.source}
          </span>
        )}
      </div>
    </a>
  )
} 