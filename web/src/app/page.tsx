"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React,{ useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getApiBaseUrl } from "@/lib/api";
import styles from "./styles.module.css";

export default function HomePage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) {
      router.replace("/dashboard");
    }
  }, [ready, user, router]);

  if (!ready || user) {
    return <div className={styles.loading}>Loading…</div>;
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          Sig<span>nal</span>
        </div>
        <div className={styles.topbarMeta}>
          <span className={styles.pill}>API {getApiBaseUrl()}</span>
          <Link className={`${styles.btn} ${styles.btnSmall}`} href="/login">
            Sign in
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroBrand}>
            Sig<em>nal</em>
          </p>
          <h1>Exercise the dummy auth API without leaving the browser.</h1>
          <p>
            Log in as a seeded user, call public and protected routes, and
            confirm role gates against the Express backend.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.btn} href="/login">
              Open login
            </Link>
            <a
              className={`${styles.btn} ${styles.btnGhost}`}
              href={`${getApiBaseUrl()}/api/public/health`}
              target="_blank"
              rel="noreferrer"
            >
              Hit /health
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
