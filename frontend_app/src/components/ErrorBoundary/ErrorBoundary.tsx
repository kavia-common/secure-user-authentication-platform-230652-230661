import React from "react";
import styles from "./ErrorBoundary.module.css";

export type ErrorBoundaryFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export type ErrorBoundaryProps = {
  children: React.ReactNode;
  /**
   * Optional custom fallback renderer. If omitted, a default fallback UI is shown.
   */
  fallbackRender?: (props: ErrorBoundaryFallbackProps) => React.ReactNode;
  /**
   * Optional callback invoked when an error is caught.
   */
  onError?: (error: Error, info: React.ErrorInfo) => void;
};

type ErrorBoundaryState = {
  error: Error | null;
};

// PUBLIC_INTERFACE
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /** React error boundary with default fallback and reset support. */
  public state: ErrorBoundaryState = { error: null };

  // PUBLIC_INTERFACE
  public resetErrorBoundary = (): void => {
    /** Reset captured error and re-render children. */
    this.setState({ error: null });
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  public render(): React.ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    const fallbackProps: ErrorBoundaryFallbackProps = {
      error,
      resetErrorBoundary: this.resetErrorBoundary
    };

    if (this.props.fallbackRender) {
      return this.props.fallbackRender(fallbackProps);
    }

    return (
      <section className={styles.wrapper} role="alert" aria-live="polite">
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.text}>
          An unexpected error occurred while rendering this page. You can try again, or return to a safe screen.
        </p>
        <div className={styles.actions}>
          <button className={styles.buttonPrimary} type="button" onClick={this.resetErrorBoundary}>
            Try again
          </button>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={() => {
              // Provide a safe escape hatch without router coupling.
              window.location.assign("/dashboard");
            }}
          >
            Go to Dashboard
          </button>
        </div>
        <details className={styles.details}>
          <summary>Error details</summary>
          {error.name}: {error.message}
        </details>
      </section>
    );
  }
}
