import Image from "next/image";

export function FooterLogo({ className = "" }) {
  return (
    <div className={className}>
      <Image
        src="/assets/brand/FooterLogo.png"
        alt="AKIJ Resource"
        width={170}
        height={36}
        className="h-9 w-auto"
      />
    </div>
  );
}

