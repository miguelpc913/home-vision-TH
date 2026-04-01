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
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/40 shadow-sm sm:aspect-16/10">
        <ImageWithFallback
          src={house.photoURL}
          alt=""
          imgClassName="size-full object-cover"
          fallbackClassName="flex size-full flex-col items-center justify-center gap-2 bg-muted/60 text-muted-foreground"
          iconClassName="size-12"
          fallbackText="Photo unavailable"
          fallbackTextClassName="text-sm"
        />
      </div>
      <div className="rounded-xl border bg-card/70 p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Listing price</p>
              <p className="text-3xl font-semibold tracking-tight">{priceFmt.format(house.price)}</p>
            </div>
          <Button
            type="button"
            variant={isFavorite ? "secondary" : "outline"}
            size="sm"
            className="min-w-24 gap-2"
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(house.id)}
          >
            <Heart className={`size-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
            {isFavorite ? "Saved" : "Save"}
          </Button>
        </div>
          <div className="h-px w-full bg-border" />
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Home className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="font-medium">{house.homeowner}</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{house.address}</p>
          </div>
        </div>
      </div>
    </>
  );
}
