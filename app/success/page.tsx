import Link from "next/link";
import { getSupabaseAdmin, type Order } from "@/lib/supabase";

const IG_HANDLE = "nayanami.ph";

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
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
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
            Complete your payment below to confirm your order.
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

        {/* QR Payment card */}
        <div
          style={{
            backgroundColor: creamLight,
            border: `2px solid ${creamDark}`,
            borderRadius: "1rem",
            padding: "1.5rem 1.25rem",
            marginBottom: "1.25rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: muted,
              marginBottom: "1rem",
            }}
          >
            Scan to Pay
          </div>

          <img
            src="/qr.jpg"
            alt="Payment QR code"
            style={{
              width: "100%",
              maxWidth: "220px",
              height: "auto",
              borderRadius: "0.75rem",
              display: "block",
              margin: "0 auto 1.25rem",
              border: `1px solid ${creamDark}`,
            }}
          />

          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: brown,
              marginBottom: "0.25rem",
            }}
          >
            ₱{order.total.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.75rem", color: muted }}>
            GCash · Maya · InstaPay
          </div>
        </div>

        {/* IG reminder */}
        <div
          style={{
            backgroundColor: "#FDF2F8",
            border: "2px solid #F0ABDC",
            borderRadius: "1rem",
            padding: "1.25rem",
            marginBottom: "1.25rem",
            display: "flex",
            gap: "0.875rem",
            alignItems: "flex-start",
          }}
        >
          {/* IG icon */}
          <div style={{ flexShrink: 0, marginTop: "0.125rem" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C026D3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="#C026D3" stroke="none"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#86198F", marginBottom: "0.375rem" }}>
              Message us on Instagram to confirm
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#9D174D", lineHeight: 1.6 }}>
              DM{" "}
              <a
                href={`https://instagram.com/${IG_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 700, color: "#86198F" }}
              >
                @{IG_HANDLE}
              </a>{" "}
              with your <strong>screenshot of payment</strong> and your order ID{" "}
              <strong style={{ fontFamily: "monospace" }}>{order.id}</strong>.
            </div>
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
          {order.social && <Row label="Social" value={`@${order.social.split(":")[1] ?? order.social}`} />}
          <Row
            label="Delivery"
            value={
              order.delivery_type === "now"
                ? "As soon as possible"
                : `${order.delivery_date ?? ""} at ${order.delivery_time ?? ""}`
            }
          />
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
