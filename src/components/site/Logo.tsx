import Image from "next/image";

// Logo Phú Quốc Media. variant="dark": chữ đậm cho nền sáng; "light": chữ sáng cho nền tối/ảnh.
// Tỉ lệ gốc 1208×805.
export default function Logo({ className, priority, variant = "dark" }: { className?: string; priority?: boolean; variant?: "dark" | "light" }) {
  return (
    <Image
      src={variant === "light" ? "/images/logo-light.png" : "/images/logo-dark.png"}
      alt="Phú Quốc Media"
      width={1208}
      height={805}
      priority={priority}
      sizes="160px"
      className={`w-auto ${className ?? ""}`}
    />
  );
}
