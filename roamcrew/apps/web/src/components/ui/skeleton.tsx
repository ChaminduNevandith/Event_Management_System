import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#0EA5E9]/10 border border-[#0EA5E9]/5",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
