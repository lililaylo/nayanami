import Link from "next/link";

type CartItem = { id: string; name: string; price: number; quantity: number };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const orderId = params.id as string;
  const name = params.name as string;
  const phone = params.phone as string;
  const address = params.address as string;
  const total = params.total as string;

  let items: CartItem[] = [];
  try {
    items = JSON.parse((params.items as string) ?? "[]");
  } catch {
    items = [];
  }

  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "63XXXXXXXXXX";

  const waMessage = encodeURIComponent(
    `Hi Nayanami! New order 🍵\n\nOrder ID: ${orderId}\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nItems:\n${items.map((i) => `- ${i.quantity}× ${i.name} — ₱${(i.price * i.quantity).toLocaleString()}`).join("\n")}\n\nTotal: ₱${Number(total).toLocaleString()}\n\nPayment: Cash on Delivery`
  );

  const cream = "#EDE8D5";
  const brown = "#3D1A08";
  const olive = "#7A7B1C";
  const brownMid = "#6B3A1F";
  const creamDark = "#D4C9A8";
  const creamLight = "#F8F4EA";
  const muted = "#8B7355";

  return (
    <div
      style={{
        backgroundColor: cream,
        minHeight: "100vh",
        color: brown,
        fontFamily: "var(--font-dm-sans, system-ui)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "9999px",
              backgroundColor: olive,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "1.75rem",
            }}
          >
            🍵
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair, serif)",
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              margin: "0 0 0.5rem",
            }}
          >
            Order placed!
          </h1>
          <p style={{ color: muted, fontSize: "0.9375rem", margin: 0 }}>
            We&apos;ll confirm your order shortly.
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
          <div
            style={{
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              opacity: 0.6,
              marginBottom: "0.375rem",
            }}
          >
            Order ID
          </div>
          <div
            style={{
              fontFamily: "var(--font-playfair, serif)",
              fontSize: "1.375rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            {orderId}
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
          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: muted,
              marginBottom: "0.875rem",
            }}
          >
            Delivery Details
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Row label="Name" value={name} />
            <Row label="Phone" value={phone} />
            <Row label="Address" value={address} />
          </div>
        </div>

        {/* Order items */}
        <div
          style={{
            backgroundColor: creamLight,
            border: `1px solid ${creamDark}`,
            borderRadius: "0.875rem",
            padding: "1.125rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: muted,
              marginBottom: "0.875rem",
            }}
          >
            Order Summary
          </div>
          {items.map((item) => (
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
              <span style={{ color: brownMid }}>
                {item.quantity}× {item.name}
              </span>
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
            <span style={{ color: olive }}>
              ₱{Number(total).toLocaleString()}
            </span>
          </div>
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: muted,
              textAlign: "right",
            }}
          >
            Cash on Delivery
          </div>
        </div>

        {/* WhatsApp button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "1rem",
            backgroundColor: "#25D366",
            color: "#fff",
            border: "none",
            borderRadius: "0.875rem",
            fontSize: "1rem",
            fontWeight: 700,
            textDecoration: "none",
            marginBottom: "0.875rem",
            boxSizing: "border-box",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Message us on WhatsApp
        </a>

        <Link
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            color: brownMid,
            fontSize: "0.875rem",
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem" }}>
      <span style={{ color: "#8B7355", minWidth: "4.5rem" }}>{label}</span>
      <span style={{ fontWeight: 500, flex: 1 }}>{value}</span>
    </div>
  );
}
