import React from "react";
import styles from "./Loader.module.css";

export type LoaderVariant = "inline" | "fullscreen";

export type LoaderProps = {
  /** Visual variant: inline spinner or full-screen overlay. */
  variant?: LoaderVariant;
  /** Optional label displayed next to the spinner (and announced by screen readers). */
  label?: string;
  /** Control whether the loader is shown. If false, renders null. */
  show?: boolean;
  /**
   * Additional aria-label for screen readers. If provided, it overrides the default derived label.
   * Prefer short text like "Loading" or "Signing in".
   */
  ariaLabel?: string;
  /** Optional className applied to the top-level element for custom layout tweaks. */
  className?: string;
};

// PUBLIC_INTERFACE
export function Loader({
  variant = "inline",
  label,
  show = true,
  ariaLabel,
  className
}: LoaderProps): React.JSX.Element | null {
  /** Accessible loader with inline and full-screen variants. */
  if (!show) return null;

  const announced = ariaLabel ?? label ?? "Loading";

  if (variant === "fullscreen") {
    return (
      <div
        className={`${styles.fullScreenOverlay}${className ? ` ${className}` : ""}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={announced}
      >
        <div className={styles.fullScreenPanel}>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.label}>{label ?? "Loading…"}</span>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`${styles.wrapper}${className ? ` ${className}` : ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={announced}
    >
      <span className={styles.spinner} aria-hidden="true" />
      {label ? <span className={styles.label}>{label}</span> : <span className={styles.srOnly}>{announced}</span>}
    </span>
  );
}
