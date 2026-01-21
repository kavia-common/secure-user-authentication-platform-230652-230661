import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell/PageShell";
import { Loader } from "../../components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  loginRequested,
  selectAuthError,
  selectAuthStatus
} from "../../features/auth/authSlice";
import styles from "./LoginPage.module.css";

type LocationState = {
  from?: { pathname?: string };
};

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>> & {
  form?: string;
};

function safeNextPath(state: unknown): string {
  const s = state as LocationState | null;
  const next = s?.from?.pathname;
  return typeof next === "string" && next.startsWith("/") ? next : "/dashboard";
}

function validate(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const email = values.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

// PUBLIC_INTERFACE
export function LoginPage(): React.JSX.Element {
  /** Public login page using Redux-Saga backed auth flow. */
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const nextPath = useMemo(() => safeNextPath(location.state), [location.state]);

  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);

  const isLoading = authStatus === "loading";

  const [values, setValues] = useState<LoginFormValues>({ email: "", password: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormValues, boolean>>>({});
  const [errors, setErrors] = useState<LoginFormErrors>({});

  useEffect(() => {
    // Redirect when saga completes successfully.
    if (authStatus === "authenticated") {
      navigate(nextPath, { replace: true });
    }
  }, [authStatus, navigate, nextPath]);

  useEffect(() => {
    // Surface server error message into form-level error block.
    if (authError) {
      setErrors((prev) => ({ ...prev, form: authError }));
    } else {
      setErrors((prev) => {
        const { form, ...rest } = prev;
        return rest;
      });
    }
  }, [authError]);

  const onChange =
    (field: keyof LoginFormValues): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      // If user edits, clear field error optimistically; we re-validate on blur/submit.
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const onBlur = (field: keyof LoginFormValues): React.FocusEventHandler<HTMLInputElement> => {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const nextErrors = validate(values);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    };
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const nextErrors = validate(values);
    setTouched({ email: true, password: true });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    dispatch(
      loginRequested({
        email: values.email.trim(),
        password: values.password
      })
    );
  };

  const showEmailError = Boolean(touched.email && errors.email);
  const showPasswordError = Boolean(touched.password && errors.password);

  return (
    <PageShell title="Login" subtitle="Sign in to access your dashboard and events.">
      <form className={styles.form} onSubmit={onSubmit} noValidate aria-busy={isLoading}>
        {errors.form ? (
          <div className={styles.formError} role="alert" aria-live="polite">
            {errors.form}
          </div>
        ) : null}

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            className={styles.input}
            value={values.email}
            onChange={onChange("email")}
            onBlur={onBlur("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={showEmailError}
            aria-describedby={showEmailError ? "login-email-error" : undefined}
            disabled={isLoading}
            required
          />
          {showEmailError ? (
            <span id="login-email-error" className={styles.fieldError} role="alert">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input
            className={styles.input}
            value={values.password}
            onChange={onChange("password")}
            onBlur={onBlur("password")}
            type="password"
            autoComplete="current-password"
            aria-invalid={showPasswordError}
            aria-describedby={showPasswordError ? "login-password-error" : undefined}
            disabled={isLoading}
            required
          />
          {showPasswordError ? (
            <span id="login-password-error" className={styles.fieldError} role="alert">
              {errors.password}
            </span>
          ) : null}
        </label>

        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader variant="inline" label="Signing in" ariaLabel="Signing in" />
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className={styles.hint}>
          No account?{" "}
          <Link className={styles.link} to="/register">
            Register
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
