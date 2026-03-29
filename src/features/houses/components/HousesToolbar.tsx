import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SortKey = 'price-asc' | 'price-desc' | 'address-asc'
export type FilterMode = 'all' | 'favorites'

type HousesToolbarProps = {
  search: string
  onSearchChange: (v: string) => void
  sortKey: SortKey
  onSortChange: (v: SortKey) => void
  filterMode: FilterMode
  onFilterChange: (v: FilterMode) => void
}

export function HousesToolbar({
  search,
  onSearchChange,
  sortKey,
  onSortChange,
  filterMode,
  onFilterChange,
}: HousesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="grid w-full gap-2 sm:min-w-[200px] sm:flex-1">
        <Label htmlFor="house-search">Search</Label>
        <Input
          id="house-search"
          placeholder="Address or homeowner…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="grid w-full gap-2 sm:w-44">
        <Label htmlFor="house-sort">Sort</Label>
        <Select
          value={sortKey}
          onValueChange={(v) => onSortChange(v as SortKey)}
        >
          <SelectTrigger id="house-sort" className="w-full min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="address-asc">Address: A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid w-full gap-2 sm:w-40">
        <Label htmlFor="house-filter">Show</Label>
        <Select
          value={filterMode}
          onValueChange={(v) => onFilterChange(v as FilterMode)}
        >
          <SelectTrigger id="house-filter" className="w-full min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All listings</SelectItem>
            <SelectItem value="favorites">Favorites only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
