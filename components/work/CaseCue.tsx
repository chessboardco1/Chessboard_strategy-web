export function CaseCue() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 right-3 flex translate-y-2 items-center gap-2 rounded-full bg-box py-1 pl-3 pr-1 text-[13px] font-medium text-ebony opacity-0 shadow-[0_4px_16px_#0005] transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 sm:bottom-4 sm:right-4"
    >
      View case
      <span className="grid size-7 place-items-center rounded-full bg-move text-[16px] leading-none">↗</span>
    </span>
  );
}
