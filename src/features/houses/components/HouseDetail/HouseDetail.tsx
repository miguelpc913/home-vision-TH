import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui/sheet";
import type { House } from "@/features/houses/api/types";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { HouseDetailContent } from "./HouseDetailContent";

type Props = {
  house: House | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
};

export function HouseDetail({ house, open, onOpenChange, isFavorite, onToggleFavorite }: Props) {
  const isMobile = useIsMobile();

  if (!house) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle className="line-clamp-2 pr-8">{house.address}</SheetTitle>
            <SheetDescription className="sr-only">
              Listing details including price, homeowner, and photo.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 px-4 pb-6">
            <HouseDetailContent
              house={house}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="line-clamp-2 pr-6">{house.address}</DialogTitle>
          <DialogDescription className="sr-only">
            Listing details including price, homeowner, and photo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <HouseDetailContent
            house={house}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
