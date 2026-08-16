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

  return (
    <div
      style={{
        backgroundColor: cream,
        minHeight: "100vh",
        color: brown,
        fontFamily: "var(--font-dm-sans, system-ui)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: `1px solid ${creamDark}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <div>
            <img src="/logo.png" alt="Nayanami" style={{ height: "36px", width: "auto", display: "block", marginBottom: "0.25rem" }} />
            <p style={{ color: "#8B7355", fontSize: "0.75rem", margin: 0 }}>
              Orders dashboard
            </p>
          </div>
        </div>
        {pending > 0 && (
          <div
            style={{
              backgroundColor: olive,
              color: "#fff",
              fontSize: "0.8125rem",
              fontWeight: 700,
              padding: "0.375rem 0.875rem",
              borderRadius: "9999px",
            }}
          >
            {pending} new order{pending !== 1 ? "s" : ""}
          </div>
        )}
      </header>

      {/* Orders */}
      <main style={{ padding: "1.5rem" }}>
        {orders && orders.length > 0 ? (
          <OrdersTable orders={orders} />
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#8B7355" }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🍵</p>
            <p>No orders yet. Share your link to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}
