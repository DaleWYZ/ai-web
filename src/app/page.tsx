'use client'

import React, { useEffect, useState } from 'react'
import { Card, CategorySection, Header, SearchBar } from '@/components'
import type { AIProduct, ProductsByCategory } from '@/types'

export default function Home() {
  const [products, setProducts] = useState<ProductsByCategory>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/ai_products.json')
      .then(res => res.json())
      .then((data: ProductsByCategory) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading products:', err)
        setLoading(false)
      })
  }, [])

  const filteredProducts = Object.entries(products).reduce<ProductsByCategory>((acc, [category, items]) => {
    const filtered = items.filter((product: AIProduct) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          Object.entries(filteredProducts).map(([category, items]) => (
            <CategorySection key={category} title={category} products={items} />
          ))
        )}
      </div>
    </main>
  )
} 