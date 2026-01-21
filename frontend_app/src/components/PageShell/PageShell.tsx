import React from "react";
import styles from "./PageShell.module.css";

export type PageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

// PUBLIC_INTERFACE
export function PageShell({ title, subtitle, children }: PageShellProps): React.JSX.Element {
  /** A lightweight page container with a header area and card-like body. */
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>
      <div className={styles.card}>{children}</div>
    </section>
  );
}
