import Image, { type ImageProps } from "next/image";

// Ảnh nội bộ (/images, /media) đi qua bộ tối ưu của Next; link ngoài hiển thị trực tiếp.
export default function Img({ src, alt, className, sizes = "100vw", priority, fill = true, ...rest }: Omit<ImageProps, "src"> & { src?: string | null }) {
  if (!src) return <div className={`bg-raise ${className ?? ""}`} aria-hidden />;
  const local = (src.startsWith("/") || src.startsWith("https://i.ytimg.com/")) && !/\.(svg|gif)$/i.test(src);
  if (!local) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`${fill ? "absolute inset-0 h-full w-full" : ""} object-cover ${className ?? ""}`} loading={priority ? "eager" : "lazy"} />;
  }
  return <Image src={src} alt={alt} fill={fill} sizes={sizes} priority={priority} className={`object-cover ${className ?? ""}`} {...rest} />;
}
