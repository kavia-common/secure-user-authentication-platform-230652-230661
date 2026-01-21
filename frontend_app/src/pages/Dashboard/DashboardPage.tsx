import React from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell/PageShell";
import { clearAuthToken } from "../../auth/tokenStorage";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  logoutRequested,
  selectAuthStatus,
  selectCurrentUser
} from "../../features/auth/authSlice";
import styles from "./DashboardPage.module.css";

// PUBLIC_INTERFACE
export function DashboardPage(): React.JSX.Element {
  /** Protected dashboard page showing a minimal snapshot of current auth/user state. */
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectCurrentUser);
  const authStatus = useAppSelector(selectAuthStatus);

  const onLogout = () => {
    // Keep legacy token cleanup (ProtectedRoute currently checks localStorage token).
    clearAuthToken();
    // Also reset redux auth state so UI updates immediately.
    dispatch(logoutRequested());
    navigate("/login", { replace: true });
  };

  return (
    <PageShell title="Dashboard" subtitle="Protected area (requires authentication).">
      <div className={styles.row}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Welcome</h2>
          <p className={styles.panelText}>
            {user?.email ? (
              <>
                You are signed in as <strong>{user.email}</strong>.
              </>
            ) : (
              <>You are signed in.</>
            )}
          </p>
          <p className={styles.panelText}>
            <strong>Auth status:</strong> {authStatus}
          </p>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Quick actions</h2>
          <p className={styles.panelText}>
            Use logout to clear your session and return to the login screen.
          </p>
          <button className={styles.button} onClick={onLogout} type="button">
            Log out
          </button>
        </div>
      </div>
    </PageShell>
  );
}
