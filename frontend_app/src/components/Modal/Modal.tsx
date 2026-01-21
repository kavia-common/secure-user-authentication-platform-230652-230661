import React, { useEffect, useId, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export type ModalProps = {
  /** Controls whether the modal is open. */
  isOpen: boolean;
  /** Title displayed in the header and used for aria-labelledby. */
  title: string;
  /** Modal content. */
  children: React.ReactNode;
  /** Optional footer area (buttons, actions). */
  footer?: React.ReactNode;
  /** Called when the modal should close (ESC, overlay click, close button). */
  onClose: () => void;
  /** If true, clicking on overlay closes the dialog (default: true). */
  closeOnOverlayClick?: boolean;
  /** If true, ESC key closes the dialog (default: true). */
  closeOnEsc?: boolean;
  /** Optional initial focus selector. If not provided, focuses the first focusable element or the dialog itself. */
  initialFocusSelector?: string;
};

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    // Skip elements not actually visible.
    const rect = el.getBoundingClientRect();
    return !(rect.width === 0 && rect.height === 0);
  });
}

// PUBLIC_INTERFACE
export function Modal({
  isOpen,
  title,
  children,
  footer,
  onClose,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  initialFocusSelector
}: ModalProps): React.JSX.Element | null {
  /** Accessible modal dialog with focus trap and portal rendering. */
  const titleId = useId();
  const descriptionId = useId();

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const portalRoot = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.body;
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousActive = document.activeElement as HTMLElement | null;

    // Prevent background scroll while modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus management on open.
    const dialogEl = dialogRef.current;
    if (dialogEl) {
      const preferred = initialFocusSelector ? dialogEl.querySelector<HTMLElement>(initialFocusSelector) : null;
      const focusables = getFocusableElements(dialogEl);
      const toFocus = preferred ?? focusables[0] ?? dialogEl;
      // Ensure dialog can receive focus.
      if (!toFocus.hasAttribute("tabindex") && toFocus === dialogEl) {
        dialogEl.tabIndex = -1;
      }
      toFocus.focus();
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      previousActive?.focus?.();
    };
  }, [isOpen, initialFocusSelector]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape" && closeOnEsc) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const dialogEl = dialogRef.current;
        if (!dialogEl) return;

        const focusables = getFocusableElements(dialogEl);
        if (focusables.length === 0) {
          // Keep focus on dialog.
          e.preventDefault();
          dialogEl.focus();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!active || active === first || active === dialogEl) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (!active || active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen || !portalRoot) return null;

  const onOverlayMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // Only close if user clicks the overlay itself (not inside the dialog).
    if (!closeOnOverlayClick) return;
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      onMouseDown={onOverlayMouseDown}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <header className={styles.header}>
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </header>

        <div className={styles.body} id={descriptionId}>
          {children}
        </div>

        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>,
    portalRoot
  );
}
