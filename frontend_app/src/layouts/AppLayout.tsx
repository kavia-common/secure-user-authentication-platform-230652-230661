import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./AppLayout.module.css";

export type AppLayoutProps = {
  /** Optional app title shown in the header. */
  title?: string;
};

// PUBLIC_INTERFACE
export function AppLayout({ title = "KAVIA App" }: AppLayoutProps): React.JSX.Element {
  /** Basic shell layout used by all routes (public and protected). */
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true" />
          <span className={styles.title}>{title}</span>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
          >
            Events
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
          >
            Register
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerText}>© {new Date().getFullYear()} KAVIA</span>
      </footer>
    </div>
  );
}
