import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui/sheet";
import type { House } from "@/features/houses/api/types";
import { useFavorites } from "@/features/houses/context/favoritesContext";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { HouseDetailContent } from "./HouseDetailContent";

type Props = {
  house: House | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HouseDetail({ house, open, onOpenChange }: Props) {
  const isMobile = useIsMobile();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!house) return null;

  const favorite = isFavorite(house.id);

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-2xl px-0 pb-0">
          <SheetHeader className="border-b px-4 pb-4 text-left sm:px-6">
            <SheetTitle className="line-clamp-2 pr-10 text-xl tracking-tight">{house.address}</SheetTitle>
            <SheetDescription className="sr-only">
              Listing details including price, homeowner, and photo.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 pt-4 pb-6 sm:px-6">
            <HouseDetailContent house={house} isFavorite={favorite} onToggleFavorite={toggleFavorite} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="line-clamp-2 pr-10 text-2xl tracking-tight">{house.address}</DialogTitle>
          <DialogDescription className="sr-only">
            Listing details including price, homeowner, and photo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
          <HouseDetailContent house={house} isFavorite={favorite} onToggleFavorite={toggleFavorite} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
