import type { House } from "@/features/houses/api/types";
import { HouseCard } from "@/features/houses/components/HouseCard";

type Props = {
  houses: House[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
  onOpenDetail: (house: House) => void;
};

export function HousesGrid({ houses, isFavorite, onToggleFavorite, onOpenDetail }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {houses.map(house => (
        <li key={house.id}>
          <HouseCard
            house={house}
            isFavorite={isFavorite(house.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenDetail={onOpenDetail}
          />
        </li>
      ))}
    </ul>
  );
}
