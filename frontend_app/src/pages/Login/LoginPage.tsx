import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell/PageShell";
import { setAuthToken } from "../../auth/tokenStorage";
import styles from "./LoginPage.module.css";

type LocationState = {
  from?: { pathname?: string };
};

function safeNextPath(state: unknown): string {
  const s = state as LocationState | null;
  const next = s?.from?.pathname;
  return typeof next === "string" && next.startsWith("/") ? next : "/dashboard";
}

// PUBLIC_INTERFACE
export function LoginPage(): React.JSX.Element {
  /** Public login page (temporary placeholder auth flow). */
  const navigate = useNavigate();
  const location = useLocation();

  const nextPath = useMemo(() => safeNextPath(location.state), [location.state]);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Temporary placeholder: treat any submit as "logged in".
    // Redux + API integration will replace this later.
    setAuthToken("temporary-token");
    navigate(nextPath, { replace: true });
  };

  return (
    <PageShell
      title="Login"
      subtitle="Sign in to access your dashboard and events."
    >
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        <button className={styles.button} type="submit">
          Sign in
        </button>

        <p className={styles.hint}>
          No account? <a className={styles.link} href="/register">Register</a>
        </p>
      </form>
    </PageShell>
  );
}
