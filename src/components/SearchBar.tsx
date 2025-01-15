import React, { ChangeEvent } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="mb-8">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="搜索 AI 产品..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
} 