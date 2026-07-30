"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getApiBaseUrl } from "@/lib/api";
import {
  createOrder,
  fetchAdminUsers,
  fetchHealth,
  fetchOrders,
  fetchProducts,
  fetchProfile,
} from "@/lib/endpoints";
import { ApiError, type Order, type Product, type User } from "@/lib/types";
import styles from "../styles.module.css";

type ProfileData = {
  user: User;
  preferences: { theme: string; region: string };
};

export default function DashboardPage() {
  const { user, token, ready, logout } = useAuth();
  const router = useRouter();

  const [health, setHealth] = useState<string | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[] | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  const loadPublic = useCallback(async () => {
    try {
      const result = await fetchHealth();
      setHealth(`${result.status} · uptime ${result.uptimeSeconds}s`);
      setHealthError(null);
    } catch (err) {
      setHealth(null);
      setHealthError(err instanceof ApiError ? err.message : "Health check failed");
    }

    try {
      const result = await fetchProducts();
      setProducts(result.items);
    } catch {
      setProducts([]);
    }
  }, []);

  const loadProtected = useCallback(async () => {
    if (!token) return;
    setBusy(true);
    setActionMessage(null);
    try {
      const [profileResult, ordersResult] = await Promise.all([
        fetchProfile(token),
        fetchOrders(token),
      ]);
      setProfile(profileResult);
      setOrders(ordersResult.orders);

      if (user?.role === "admin") {
        try {
          const admins = await fetchAdminUsers(token);
          setAdminUsers(admins.users);
          setAdminError(null);
        } catch (err) {
          setAdminUsers(null);
          setAdminError(err instanceof ApiError ? err.message : "Admin call failed");
        }
      } else {
        setAdminUsers(null);
        setAdminError(null);
        try {
          await fetchAdminUsers(token);
        } catch (err) {
          if (err instanceof ApiError && err.status === 403) {
            setAdminError("403 forbidden — expected for the user role.");
          } else if (err instanceof ApiError) {
            setAdminError(err.message);
          }
        }
      }
    } catch (err) {
      setActionMessage(err instanceof ApiError ? err.message : "Protected calls failed");
    } finally {
      setBusy(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    if (!ready || !user || !token) return;
    void loadPublic();
    void loadProtected();
  }, [ready, user, token, loadPublic, loadProtected]);

  async function onCreateOrder() {
    if (!token || products.length === 0) return;
    setBusy(true);
    setActionMessage(null);
    try {
      const result = await createOrder(token, products[0].id, 1);
      setActionMessage(`Created order ${result.order.id} (${result.order.status}).`);
      const refreshed = await fetchOrders(token);
      setOrders(refreshed.orders);
    } catch (err) {
      setActionMessage(err instanceof ApiError ? err.message : "Could not create order");
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    await logout();
    router.replace("/login");
  }

  if (!ready || !user || !token) {
    return <div className={styles.loading}>Loading session…</div>;
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          Sig<span>nal</span>
        </div>
        <div className={styles.topbarMeta}>
          <span className={styles.pill}>{user.email}</span>
          <span className={styles.pill}>{user.role}</span>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <h1>Hello, {user.name}</h1>
          <p>
            Talking to <span className={styles.mono}>{getApiBaseUrl()}</span>
          </p>
        </div>

        <div className={styles.grid}>
          <section className={`${styles.panel} ${styles.half}`}>
            <h2>Public health</h2>
            <p className={styles.sub}>GET /api/public/health — no token</p>
            <div className={styles.row}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSmall}`}
                onClick={() => void loadPublic()}
              >
                Refresh
              </button>
            </div>
            {health ? (
              <p className={styles.statusOk}>{health}</p>
            ) : (
              <p className={styles.statusBad}>{healthError ?? "No response yet"}</p>
            )}
          </section>

          <section className={`${styles.panel} ${styles.half}`}>
            <h2>Profile</h2>
            <p className={styles.sub}>GET /api/protected/profile</p>
            {profile ? (
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <strong>{profile.user.name}</strong>
                  <span className={styles.muted}>{profile.user.role}</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.muted}>Theme</span>
                  <span className={styles.mono}>{profile.preferences.theme}</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.muted}>Region</span>
                  <span className={styles.mono}>{profile.preferences.region}</span>
                </div>
              </div>
            ) : (
              <p className={styles.empty}>{busy ? "Loading…" : "No profile loaded"}</p>
            )}
          </section>

          <section className={`${styles.panel} ${styles.half}`}>
            <h2>Products</h2>
            <p className={styles.sub}>GET /api/public/products</p>
            <div className={styles.list}>
              {products.length === 0 ? (
                <p className={styles.empty}>No products</p>
              ) : (
                products.map((product) => (
                  <div className={styles.listItem} key={product.id}>
                    <strong>{product.name}</strong>
                    <span className={styles.mono}>${product.price}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={`${styles.panel} ${styles.half}`}>
            <h2>Orders</h2>
            <p className={styles.sub}>GET/POST /api/protected/orders</p>
            <div className={styles.row}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSmall}`}
                disabled={busy || products.length === 0}
                onClick={() => void onCreateOrder()}
              >
                Create order
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`}
                disabled={busy}
                onClick={() => void loadProtected()}
              >
                Reload protected
              </button>
            </div>
            {actionMessage ? <p className={styles.muted}>{actionMessage}</p> : null}
            <div className={styles.list}>
              {orders.length === 0 ? (
                <p className={styles.empty}>No orders</p>
              ) : (
                orders.map((order) => (
                  <div className={styles.listItem} key={order.id}>
                    <strong className={styles.mono}>{order.id}</strong>
                    <span className={styles.muted}>
                      {order.status}
                      {typeof order.total === "number" ? ` · $${order.total}` : ""}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={styles.panel}>
            <h2>Admin users</h2>
            <p className={styles.sub}>GET /api/protected/admin/users — admin only</p>
            {adminUsers ? (
              <div className={styles.list}>
                {adminUsers.map((entry) => (
                  <div className={styles.listItem} key={entry.id}>
                    <div>
                      <strong>{entry.name}</strong>
                      <div className={styles.muted}>{entry.email}</div>
                    </div>
                    <span className={styles.pill}>{entry.role}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={adminError ? styles.statusBad : styles.empty}>
                {adminError ?? "No admin payload"}
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
