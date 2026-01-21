import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell/PageShell";
import styles from "./RegisterPage.module.css";

// PUBLIC_INTERFACE
export function RegisterPage(): React.JSX.Element {
  /** Public registration page (temporary placeholder; API integration will replace this). */
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // Placeholder: redirect to login after "registration"
    navigate("/login");
  };

  return (
    <PageShell title="Register" subtitle="Create an account to get started.">
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
            autoComplete="new-password"
            required
          />
        </label>

        <button className={styles.button} type="submit">
          Create account
        </button>

        <p className={styles.hint}>
          Already have an account? <a className={styles.link} href="/login">Login</a>
        </p>
      </form>
    </PageShell>
  );
}
