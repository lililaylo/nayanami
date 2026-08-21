import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin, type Order } from "@/lib/supabase";
import { OrdersTable } from "./OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "ok") {
    redirect("/admin/login");
  }

  const { data: orders } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  const cream = "#EDE8D5";
  const brown = "#3D1A08";
  const creamDark = "#D4C9A8";
  const olive = "#7A7B1C";

  const pending = orders?.filter((o) => o.status === "pending").length ?? 0;
  const unpaid = orders?.filter((o) => o.payment_status === "unpaid" && o.status !== "cancelled").length ?? 0;

  return (
    <div
      style={{
        backgroundColor: cream,
        minHeight: "100dvh",
        color: brown,
        fontFamily: "var(--font-dm-sans, system-ui)",
      }}
    >
      {/* Sticky header — respects Dynamic Island / notch */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: cream,
          borderBottom: `1px solid ${creamDark}`,
          paddingTop: "calc(0.75rem + env(safe-area-inset-top))",
          paddingBottom: "0.75rem",
          paddingLeft: "calc(1rem + env(safe-area-inset-left))",
          paddingRight: "calc(1rem + env(safe-area-inset-right))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src="/logo.png" alt="Nayanami" style={{ height: "30px", width: "auto" }} />
          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {unpaid > 0 && (
              <span style={{ backgroundColor: "#FEF3C7", color: "#92400E", fontSize: "0.6875rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "9999px", border: "1.5px solid #FDE68A" }}>
                {unpaid} unpaid
              </span>
            )}
            {pending > 0 && (
              <span style={{ backgroundColor: olive, color: "#fff", fontSize: "0.6875rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "9999px" }}>
                {pending} new
              </span>
            )}
          </div>
        </div>
        <a
          href="/admin"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "9999px", border: `1.5px solid ${creamDark}`, color: brown, textDecoration: "none", flexShrink: 0 }}
          aria-label="Refresh"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={brown} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </a>
      </header>

      {/* Main content — respects home indicator */}
      <main
        style={{
          padding: "0.875rem",
          paddingLeft: "calc(0.875rem + env(safe-area-inset-left))",
          paddingRight: "calc(0.875rem + env(safe-area-inset-right))",
          paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        }}
      >
        {orders && orders.length > 0 ? (
          <OrdersTable orders={orders} />
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#8B7355" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.875rem", display: "block" }}>
              <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
            <p>No orders yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
