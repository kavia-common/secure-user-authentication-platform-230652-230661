import React from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell/PageShell";
import { clearAuthToken } from "../../auth/tokenStorage";
import styles from "./DashboardPage.module.css";

// PUBLIC_INTERFACE
export function DashboardPage(): React.JSX.Element {
  /** Protected dashboard placeholder page. */
  const navigate = useNavigate();

  const onLogout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  return (
    <PageShell title="Dashboard" subtitle="Protected area (requires authentication).">
      <div className={styles.row}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Welcome</h2>
          <p className={styles.panelText}>
            This is a protected route. Later, this will show real user data and application status.
          </p>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Quick actions</h2>
          <button className={styles.button} onClick={onLogout} type="button">
            Log out
          </button>
        </div>
      </div>
    </PageShell>
  );
}
