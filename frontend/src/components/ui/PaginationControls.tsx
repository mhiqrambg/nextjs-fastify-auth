import {
  Pagination,
  PaginationItemType,
  type PaginationItemRenderProps,
} from "@heroui/react";
import { cn } from "@/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
};

export default function PaginationControls({
  page,
  totalPages,
  onChange,
  onNext,
  onPrev,
  className,
}: Props) {
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    className: itemClass,
    onNext: _n,
    onPrevious: _p,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT)
      return (
        <button
          key={key}
          disabled={page >= totalPages}
          className={cn(
            itemClass,
            "bg-default-200/50 h-8 w-8 min-w-8",
            page >= totalPages && "cursor-not-allowed opacity-50",
          )}
          onClick={() => {
            if (page < totalPages) {
              onChange(page + 1);
            }
          }}
        >
          <ChevronRight />
        </button>
      );

    if (value === PaginationItemType.PREV)
      return (
        <button
          key={key}
          disabled={page <= 1}
          className={cn(
            itemClass,
            "bg-default-200/50 h-8 w-8 min-w-8",
            page <= 1 && "cursor-not-allowed opacity-50",
          )}
          onClick={() => {
            if (page > 1) {
              onChange(page - 1);
            }
          }}
        >
          <ChevronLeft />
        </button>
      );

    if (value === PaginationItemType.DOTS)
      return (
        <button key={key} className={itemClass}>
          …
        </button>
      );

    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          itemClass,
          isActive &&
            "bg-linear-to-br from-yellow-400 to-orange-500 font-bold text-white",
        )}
        onClick={() => onChange(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className={cn("flex justify-center py-6", className)}>
      <Pagination
        page={page}
        total={totalPages}
        onChange={onChange}
        showControls
        disableCursorAnimation
        radius="full"
        renderItem={renderItem}
        className="gap-2"
        variant="light"
      />
    </div>
  );
}
