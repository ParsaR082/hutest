import Image, { type ImageProps } from "next/image";
import { assetSrc } from "@/lib/asset";

type LocalImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/** Local /public images — skips optimizer cache so file swaps show up after version bump */
export function LocalImage({ src, ...props }: LocalImageProps) {
  return <Image src={assetSrc(src)} unoptimized {...props} />;
}
