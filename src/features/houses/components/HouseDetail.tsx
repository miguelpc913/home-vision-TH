import { Heart, Home, ImageOff } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { House } from '@/features/houses/api/types'
import { useIsMobile } from '@/shared/hooks/useIsMobile'

const priceFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type HouseDetailProps = {
  house: House | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isFavorite: boolean
  onToggleFavorite: (id: number) => void
}

export function HouseDetail({
  house,
  open,
  onOpenChange,
  isFavorite,
  onToggleFavorite,
}: HouseDetailProps) {
  const isMobile = useIsMobile()
  const [imgFailed, setImgFailed] = useState(false)

  if (!house) return null

  const body = (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted sm:aspect-[16/10]">
        {!imgFailed ? (
          <img
            src={house.photoURL}
            alt=""
            loading="lazy"
            className="size-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-12" />
            <span className="text-sm">Photo unavailable</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight">
            {priceFmt.format(house.price)}
          </p>
          <Button
            type="button"
            variant={isFavorite ? 'secondary' : 'outline'}
            size="sm"
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(house.id)}
          >
            <Heart
              className={`size-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`}
            />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Home className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{house.homeowner}</span>
        </div>
        <p className="text-sm leading-relaxed">{house.address}</p>
      </div>
    </>
  )

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
          <div className="flex flex-col gap-4 px-4 pb-6">{body}</div>
        </SheetContent>
      </Sheet>
    )
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
        <div className="flex flex-col gap-4">{body}</div>
      </DialogContent>
    </Dialog>
  )
}
