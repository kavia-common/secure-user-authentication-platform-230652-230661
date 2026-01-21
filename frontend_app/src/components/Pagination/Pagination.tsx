import React from "react";
import styles from "./Pagination.module.css";

export type PaginationProps = {
  /** Current page number (1-based). */
  page: number;
  /** Page size (items per page). */
  pageSize: number;
  /** Total items available. */
  totalItems: number;
  /**
   * Called when page changes. Placeholder: not invoked yet because controls are disabled.
   * This prop exists to make later wiring trivial.
   */
  onPageChange?: (nextPage: number) => void;
};

// PUBLIC_INTERFACE
export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange
}: PaginationProps): React.JSX.Element {
  /** Placeholder pagination component. Renders UI but does not provide interactive behavior yet. */
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));

  // Intentionally unused for now; kept to preserve public interface.
  void onPageChange;

  return (
    <div className={styles.wrapper} aria-label="Pagination (placeholder)">
      <div className={styles.meta}>
        Page <strong>{page}</strong> of <strong>{totalPages}</strong> • {totalItems} items
      </div>

      <div className={styles.actions}>
        <button className={styles.button} type="button" disabled aria-disabled="true">
          Previous
        </button>
        <button className={styles.button} type="button" disabled aria-disabled="true">
          Next
        </button>
      </div>

      <div className={styles.note}>Pagination controls will be enabled in a later step.</div>
    </div>
  );
}
