"use client";

import { useTransition } from "react";
import { type Order } from "@/lib/supabase";
import { updateOrderStatus } from "./actions";
import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: "#FEF3C7", color: "#92400E" },
  confirmed: { bg: "#DBEAFE", color: "#1E40AF" },
  fulfilled: { bg: "#D1FAE5", color: "#065F46" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B" },
};

const brown = "#3D1A08";
const creamDark = "#D4C9A8";
const creamLight = "#F8F4EA";
const brownMid = "#6B3A1F";
const muted = "#8B7355";

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatus = (status: string) => {
    startTransition(async () => {
      await updateOrderStatus(order.id, status);
      router.refresh();
    });
  };

  const badge = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
  const date = new Date(order.created_at).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      style={{
        backgroundColor: creamLight,
        border: `1.5px solid ${creamDark}`,
        borderRadius: "1rem",
        padding: "1.125rem",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: "0.875rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{order.id}</div>
          <div style={{ fontSize: "0.75rem", color: muted, marginTop: "0.125rem" }}>{date}</div>
        </div>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "capitalize",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            backgroundColor: badge.bg,
            color: badge.color,
            flexShrink: 0,
          }}
        >
          {order.status}
        </span>
      </div>

      {/* Customer info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.375rem",
          marginBottom: "0.875rem",
          fontSize: "0.875rem",
        }}
      >
        <Info label="Name" value={order.customer_name} />
        <Info label="Phone" value={order.phone} />
        <Info label="Address" value={order.address} />
      </div>

      {/* Items */}
      <div
        style={{
          borderTop: `1px solid ${creamDark}`,
          paddingTop: "0.875rem",
          marginBottom: "0.875rem",
        }}
      >
        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.875rem",
              marginBottom: "0.25rem",
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
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "0.9375rem",
            marginTop: "0.5rem",
            paddingTop: "0.5rem",
            borderTop: `1px solid ${creamDark}`,
          }}
        >
          <span>Total</span>
          <span style={{ color: "#7A7B1C" }}>₱{order.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Status actions */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(["pending", "confirmed", "fulfilled", "cancelled"] as const)
          .filter((s) => s !== order.status)
          .map((s) => (
            <button
              key={s}
              onClick={() => handleStatus(s)}
              disabled={isPending}
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                border: `1.5px solid ${creamDark}`,
                backgroundColor: "transparent",
                color: brown,
                cursor: isPending ? "not-allowed" : "pointer",
                textTransform: "capitalize",
                opacity: isPending ? 0.5 : 1,
              }}
            >
              Mark {s}
            </button>
          ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: muted, fontSize: "0.75rem" }}>{label}: </span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}
