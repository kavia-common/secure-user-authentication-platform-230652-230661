import React, { useMemo } from "react";
import styles from "./Pagination.module.css";

export type PaginationProps = {
  /** Current page number (1-based). */
  page: number;
  /** Page size (items per page). */
  pageSize: number;
  /** Total items available. */
  totalItems: number;
  /** Called when page changes. */
  onPageChange: (nextPage: number) => void;
  /** Max number of page buttons to show (excluding prev/next). Default: 7. */
  maxPageButtons?: number;
  /** Optional aria label for the nav element. */
  ariaLabel?: string;
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function buildPageModel(current: number, total: number, maxButtons: number): Array<number | "…"> {
  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Reserve slots for first/last and ellipses.
  const innerSlots = Math.max(1, maxButtons - 2);
  const half = Math.floor(innerSlots / 2);

  let start = current - half;
  let end = current + half;

  // Adjust range to fit.
  if (start < 2) {
    start = 2;
    end = start + innerSlots - 1;
  }
  if (end > total - 1) {
    end = total - 1;
    start = end - innerSlots + 1;
  }

  const pages: Array<number | "…"> = [1];

  if (start > 2) pages.push("…");

  for (let p = start; p <= end; p += 1) pages.push(p);

  if (end < total - 1) pages.push("…");

  pages.push(total);
  return pages;
}

// PUBLIC_INTERFACE
export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  maxPageButtons = 7,
  ariaLabel = "Pagination"
}: PaginationProps): React.JSX.Element {
  /** Reusable pagination with prev/next and numbered pages. */
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const current = clamp(page, 1, totalPages);

  const model = useMemo(
    () => buildPageModel(current, totalPages, Math.max(5, maxPageButtons)),
    [current, totalPages, maxPageButtons]
  );

  const canPrev = current > 1;
  const canNext = current < totalPages;

  const goTo = (next: number) => {
    const target = clamp(next, 1, totalPages);
    if (target === current) return;
    onPageChange(target);
  };

  return (
    <nav className={styles.wrapper} aria-label={ariaLabel}>
      <div className={styles.meta}>
        Page <strong>{current}</strong> of <strong>{totalPages}</strong> • {totalItems} items
      </div>

      <div className={styles.actions}>
        <button
          className={styles.button}
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={!canPrev}
          aria-disabled={!canPrev}
          aria-label="Previous page"
        >
          Prev
        </button>

        {model.map((item, idx) => {
          if (item === "…") {
            return (
              <span key={`ellipsis-${idx}`} className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            );
          }

          const isActive = item === current;
          return (
            <button
              key={item}
              type="button"
              className={`${styles.button} ${styles.pageButton}${isActive ? ` ${styles.active}` : ""}`}
              onClick={() => goTo(item)}
              aria-current={isActive ? "page" : undefined}
              aria-label={isActive ? `Page ${item}, current page` : `Go to page ${item}`}
            >
              {item}
            </button>
          );
        })}

        <button
          className={styles.button}
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={!canNext}
          aria-disabled={!canNext}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
