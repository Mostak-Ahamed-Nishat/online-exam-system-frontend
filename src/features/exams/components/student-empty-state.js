import Image from "next/image";

export function StudentEmptyState() {
  return (
    <section className="w-full rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
        <Image
          src="/assets/EmptyState.png"
          alt="No online tests available"
          width={126}
          height={111}
          className="h-auto w-[126px]"
        />
        <h3 className="mt-5 text-[40px] font-normal leading-[48px] text-[var(--text-primary)]">
          No Online Test Available
        </h3>
        <p className="mt-3 text-[14px] font-normal leading-6 text-[var(--test-subtext)]">
          Currently, there are no online tests available. Please check back later for updates.
        </p>
      </div>
    </section>
  );
}

