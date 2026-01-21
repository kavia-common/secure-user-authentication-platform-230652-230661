import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutRequested, selectAuthStatus } from "../features/auth/authSlice";
import styles from "./AppLayout.module.css";

export type AppLayoutProps = {
  /** Optional app title shown in the header. */
  title?: string;
};

// PUBLIC_INTERFACE
export function AppLayout({ title = "KAVIA App" }: AppLayoutProps): React.JSX.Element {
  /** Basic shell layout used by all routes (public and protected). */
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(selectAuthStatus);
  const authed = authStatus === "authenticated";

  const onLogout = () => {
    // Single source of truth: saga clears token storage; reducer resets auth state.
    dispatch(logoutRequested());
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true" />
          <span className={styles.title}>{title}</span>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          {authed ? (
            <>
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
              <button className={styles.navLink} type="button" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerText}>© {new Date().getFullYear()} KAVIA</span>
        </div>
      </footer>
    </div>
  );
}
