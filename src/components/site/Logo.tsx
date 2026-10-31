import Image from "next/image";

// Logo Phú Quốc Media (bản chữ sáng cho nền tối). Tỉ lệ gốc 1208×805.
export default function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/images/logo-light.png"
      alt="Phú Quốc Media"
      width={1208}
      height={805}
      priority={priority}
      sizes="160px"
      className={`h-auto w-auto ${className ?? ""}`}
    />
  );
}
