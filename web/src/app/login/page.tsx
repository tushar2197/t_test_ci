"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { ApiError } from "@/lib/types";
import styles from "../styles.module.css";

const DEMO_ACCOUNTS = [
  { email: "admin@example.com", label: "Admin" },
  { email: "user@example.com", label: "User" },
];

export default function LoginPage() {
  const { login, user, ready } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Passw0rd!");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) {
      router.replace("/dashboard");
    }
  }, [ready, user, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setPending(false);
    }
  }

  if (!ready || user) {
    return <div className={styles.loading}>Loading…</div>;
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginPanel}>
        <div className={styles.brand}>
          Sig<span>nal</span>
        </div>
        <h1>Sign in to the lab</h1>
        <p className={styles.lede}>
          Uses the Express JWT API. Tokens stay in local storage for this demo.
        </p>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}

          <button className={styles.btn} type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className={styles.hint}>
          Try{" "}
          {DEMO_ACCOUNTS.map((account, index) => (
            <span key={account.email}>
              {index > 0 ? " or " : null}
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                onClick={() => {
                  setEmail(account.email);
                  setPassword("Passw0rd!");
                }}
              >
                {account.label}
              </button>
            </span>
          ))}
          . Password for both: <code>Passw0rd!</code>
          <br />
          <Link href="/">Back home</Link>
        </div>
      </div>
    </main>
  );
}
