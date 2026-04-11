import Image from "next/image";
import Link from "next/link";

export function HeaderLogo({ href = "/", className = "" }) {
  return (
    <Link href={href} className={className} aria-label="Home">
      <Image
        src="/assets/brand/HeaderLogo.png"
        alt="AKIJ Resource"
        width={170}
        height={36}
        priority
        className="h-9 w-auto"
      />
    </Link>
  );
}

