import Image from "next/image";
import Link from "next/link";

export function HeaderLogo({ href = "/", className = "" }) {
  return (
    <Link href={href} className={className} aria-label="Home">
      <Image
        src="/assets/brand/HeaderLogo.png"
        alt="AKIJ Resource"
        width={116}
        height={32}
        priority
        className="h-8 max-w-[116px] w-auto"
      />
    </Link>
  );
}
