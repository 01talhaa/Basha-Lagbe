"use client"

import type { SearchFilters as SearchFiltersType } from "@/data/types"

interface SearchFiltersProps {
  filters: SearchFiltersType
  setFilters: (filters: SearchFiltersType) => void
}

export default function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
  const handlePriceChange = (min: number, max: number) => {
    setFilters({ ...filters, priceMin: min, priceMax: max })
  }

  const handleSortChange = (sortBy: string) => {
    setFilters({ ...filters, sortBy: sortBy as any })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <h2 className="text-xl font-bold mb-6">Filters</h2>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="price" onChange={() => handlePriceChange(0, 10000)} className="w-4 h-4" />
            <span className="text-sm">Under Tk 10,000</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="price" onChange={() => handlePriceChange(10000, 20000)} className="w-4 h-4" />
            <span className="text-sm">Tk 10,000 - 20,000</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="price" onChange={() => handlePriceChange(20000, 50000)} className="w-4 h-4" />
            <span className="text-sm">Tk 20,000 - 50,000</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="price" onChange={() => handlePriceChange(50000, 1000000)} className="w-4 h-4" />
            <span className="text-sm">Over Tk 50,000</span>
          </label>
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Property Type</h3>
        <div className="space-y-2">
          {["apartment", "house", "studio", "room"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(filters.propertyType || []).includes(type)}
                onChange={(e) => {
                  const types = (filters.propertyType as string[]) || []
                  if (e.target.checked) {
                    setFilters({ ...filters, propertyType: [...types, type] })
                  } else {
                    setFilters({
                      ...filters,
                      propertyType: types.filter((t) => t !== type),
                    })
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Sort By</h3>
        <select
          value={filters.sortBy || "price-asc"}
          onChange={(e) => handleSortChange(e.target.value)}
          className="input-field"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  )
}
