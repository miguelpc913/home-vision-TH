import { Heart, Home } from "lucide-react";
import { Button } from "@ui/button";
import type { House } from "@/features/houses/api/types";
import { ImageWithFallback } from "@/shared/components/ui/ImageWithFallback";

const priceFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Props = {
  house: House;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
};

export function HouseDetailContent({ house, isFavorite, onToggleFavorite }: Props) {
  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted sm:aspect-16/10">
        <ImageWithFallback
          src={house.photoURL}
          alt=""
          imgClassName="size-full object-cover"
          fallbackClassName="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground"
          iconClassName="size-12"
          fallbackText="Photo unavailable"
          fallbackTextClassName="text-sm"
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight">{priceFmt.format(house.price)}</p>
          <Button
            type="button"
            variant={isFavorite ? "secondary" : "outline"}
            size="sm"
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(house.id)}
          >
            <Heart className={`size-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
            {isFavorite ? "Saved" : "Save"}
          </Button>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Home className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{house.homeowner}</span>
        </div>
        <p className="text-sm leading-relaxed">{house.address}</p>
      </div>
    </>
  );
}
