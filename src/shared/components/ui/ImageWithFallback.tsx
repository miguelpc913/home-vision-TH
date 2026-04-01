import { ImageOff } from "lucide-react";
import { useImageWithFallback } from "./useImageWithFallback";

type Props = {
  src: string;
  alt?: string;
  imgClassName?: string;
  fallbackClassName?: string;
  iconClassName?: string;
  fallbackText?: string;
  fallbackTextClassName?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  /** Hide fallback region from assistive tech (e.g. when label exists elsewhere). */
  fallbackAriaHidden?: boolean;
};

function ImageWithFallbackInner({
  src,
  alt = "",
  imgClassName,
  fallbackClassName,
  iconClassName,
  fallbackText = "Image unavailable",
  fallbackTextClassName,
  loading = "lazy",
  decoding,
  fallbackAriaHidden,
}: Props) {
  const { loadFailed, onImgError } = useImageWithFallback();

  if (loadFailed) {
    return (
      <div className={fallbackClassName} aria-hidden={fallbackAriaHidden}>
        <ImageOff className={iconClassName} />
        <span className={fallbackTextClassName}>{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={imgClassName}
      onError={onImgError}
    />
  );
}

/** Remounts when `src` changes so a prior error does not block a new URL. */
export function ImageWithFallback(props: Props) {
  return <ImageWithFallbackInner key={props.src} {...props} />;
}
