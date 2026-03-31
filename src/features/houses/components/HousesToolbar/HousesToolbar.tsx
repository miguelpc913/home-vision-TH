import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import type { FilterMode } from "@/features/houses/api/types";

const FILTER_OPTIONS: ReadonlyArray<{ value: FilterMode; label: string }> = [
  { value: "all", label: "All listings" },
  { value: "favorites", label: "Favorites only" },
];

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  filterMode: FilterMode;
  onFilterChange: (v: FilterMode) => void;
};

export function HousesToolbar({
  search,
  onSearchChange,
  filterMode,
  onFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="grid w-full gap-2 sm:min-w-[200px] sm:flex-1">
        <Label htmlFor="house-search">Search</Label>
        <Input
          id="house-search"
          placeholder="Address or homeowner…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="grid w-full gap-2 sm:w-40">
        <Label htmlFor="house-filter">Show</Label>
        <Select
          value={filterMode}
          onValueChange={v => onFilterChange(v as FilterMode)}
          items={FILTER_OPTIONS}
        >
          <SelectTrigger id="house-filter" className="w-full min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
