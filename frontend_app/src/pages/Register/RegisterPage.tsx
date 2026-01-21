import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell/PageShell";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  registerRequested,
  selectAuthError,
  selectAuthStatus
} from "../../features/auth/authSlice";
import styles from "./RegisterPage.module.css";

type RegisterFormValues = {
  email: string;
  password: string;
};

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>> & {
  form?: string;
};

function validate(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

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
export function RegisterPage(): React.JSX.Element {
  /** Public registration page using Redux-Saga backed auth flow. */
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);

  const isLoading = authStatus === "loading";

  const [values, setValues] = useState<RegisterFormValues>({ email: "", password: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormValues, boolean>>>({});
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  useEffect(() => {
    // After successful registration, go to dashboard as requested.
    if (authStatus === "authenticated") {
      navigate("/dashboard", { replace: true });
    }
  }, [authStatus, navigate]);

  useEffect(() => {
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
    (field: keyof RegisterFormValues): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const onBlur = (field: keyof RegisterFormValues): React.FocusEventHandler<HTMLInputElement> => {
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
      registerRequested({
        email: values.email.trim(),
        password: values.password
      })
    );
  };

  const showEmailError = Boolean(touched.email && errors.email);
  const showPasswordError = Boolean(touched.password && errors.password);

  return (
    <PageShell title="Register" subtitle="Create an account to get started.">
      <form className={styles.form} onSubmit={onSubmit} noValidate>
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
            aria-describedby={showEmailError ? "register-email-error" : undefined}
            disabled={isLoading}
            required
          />
          {showEmailError ? (
            <span id="register-email-error" className={styles.fieldError} role="alert">
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
            autoComplete="new-password"
            aria-invalid={showPasswordError}
            aria-describedby={showPasswordError ? "register-password-error" : undefined}
            disabled={isLoading}
            required
          />
          {showPasswordError ? (
            <span id="register-password-error" className={styles.fieldError} role="alert">
              {errors.password}
            </span>
          ) : null}
        </label>

        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className={styles.hint}>
          Already have an account?{" "}
          <Link className={styles.link} to="/login">
            Login
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
