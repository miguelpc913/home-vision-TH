import { Heart, Home, ImageOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { House } from "@/features/houses/api/types";

const priceFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type HouseCardProps = {
  house: House;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onOpenDetail: (house: House) => void;
};

export function HouseCard({ house, isFavorite, onToggleFavorite, onOpenDetail }: HouseCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const openDetail = () => onOpenDetail(house);

  return (
    <Card
      className="h-full transition-shadow outline-none hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${house.address}`}
      onClick={openDetail}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetail();
        }
      }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {!imgFailed ? (
          <img
            src={house.photoURL}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover motion-reduce:transition-none"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground"
            aria-hidden
          >
            <ImageOff className="size-10" />
            <span className="text-xs">Photo unavailable</span>
          </div>
        )}
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="absolute top-2 right-2 rounded-full shadow-sm"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite(house.id);
          }}
        >
          <Heart className={isFavorite ? "fill-destructive text-destructive" : ""} />
        </Button>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-base">{house.address}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <Home className="size-3.5 shrink-0" aria-hidden />
          {house.homeowner}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <p className="text-lg font-semibold tracking-tight text-foreground">
          {priceFmt.format(house.price)}
        </p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">Click for full details</CardFooter>
    </Card>
  );
}
