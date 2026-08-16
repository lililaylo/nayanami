import Link from "next/link";
import { getSupabaseAdmin, type Order } from "@/lib/supabase";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await searchParams;

  const { data: order } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .eq("id", id)
    .single<Order>();

  const cream = "#EDE8D5";
  const brown = "#3D1A08";
  const olive = "#7A7B1C";
  const brownMid = "#6B3A1F";
  const creamDark = "#D4C9A8";
  const creamLight = "#F8F4EA";
  const muted = "#8B7355";

  if (!order) {
    return (
      <div style={{ backgroundColor: cream, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "var(--font-dm-sans, system-ui)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: muted, marginBottom: "1rem" }}>Order not found.</p>
          <Link href="/" style={{ color: brown, fontWeight: 600 }}>← Back to menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: cream,
        minHeight: "100vh",
        color: brown,
        fontFamily: "var(--font-dm-sans, system-ui)",
        padding: "2rem 1.25rem",
      }}
    >
      <div style={{ maxWidth: "480px", margin: "0 auto", width: "100%" }}>
        {/* Success icon + heading */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/logo.png" alt="Nayanami" style={{ height: "48px", width: "auto", margin: "0 auto 1.25rem", display: "block" }} />
          <div
            style={{
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "9999px",
              backgroundColor: olive,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EDE8D5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair, serif)",
              fontSize: "clamp(1.75rem, 6vw, 2.25rem)",
              fontWeight: 700,
              margin: "0 0 0.5rem",
            }}
          >
            Order placed!
          </h1>
          <p style={{ color: muted, fontSize: "0.9375rem", margin: 0 }}>
            We&apos;ll reach out to confirm your order shortly.
          </p>
        </div>

        {/* Order ID */}
        <div
          style={{
            backgroundColor: brown,
            color: cream,
            borderRadius: "0.875rem",
            padding: "1rem 1.25rem",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.6, marginBottom: "0.375rem" }}>
            Order ID
          </div>
          <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "1.375rem", fontWeight: 700, letterSpacing: "0.05em" }}>
            {order.id}
          </div>
        </div>

        {/* Delivery details */}
        <div
          style={{
            backgroundColor: creamLight,
            border: `1px solid ${creamDark}`,
            borderRadius: "0.875rem",
            padding: "1.125rem",
            marginBottom: "1rem",
          }}
        >
          <SectionLabel>Delivery Details</SectionLabel>
          <Row label="Name" value={order.customer_name} />
          <Row label="Phone" value={order.phone} />
          <Row label="Address" value={order.address} />
        </div>

        {/* Order summary */}
        <div
          style={{
            backgroundColor: creamLight,
            border: `1px solid ${creamDark}`,
            borderRadius: "0.875rem",
            padding: "1.125rem",
            marginBottom: "2rem",
          }}
        >
          <SectionLabel>Order Summary</SectionLabel>
          {order.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: brownMid }}>{item.quantity}× {item.name}</span>
              <span style={{ fontWeight: 600, flexShrink: 0 }}>
                ₱{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div
            style={{
              borderTop: `1px solid ${creamDark}`,
              marginTop: "0.875rem",
              paddingTop: "0.875rem",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: "0.9375rem",
            }}
          >
            <span>Total</span>
            <span style={{ color: olive }}>₱{order.total.toLocaleString()}</span>
          </div>
          <div style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: muted, textAlign: "right" }}>
            Cash on Delivery
          </div>
        </div>

        <Link
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            color: brownMid,
            fontSize: "0.9rem",
            fontWeight: 500,
            textDecoration: "none",
            padding: "0.5rem",
          }}
        >
          ← Order again
        </Link>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.6875rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#8B7355",
        marginBottom: "0.875rem",
      }}
    >
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", marginBottom: "0.375rem" }}>
      <span style={{ color: "#8B7355", minWidth: "4.5rem" }}>{label}</span>
      <span style={{ fontWeight: 500, flex: 1 }}>{value}</span>
    </div>
  );
}
