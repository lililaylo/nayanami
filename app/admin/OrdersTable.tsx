"use client";

import { useState, useTransition } from "react";
import { type Order } from "@/lib/supabase";
import { updateOrderStatus, deleteOrder, bulkUpdateStatus, bulkDelete } from "./actions";
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
const olive = "#7A7B1C";

const BULK_STATUSES = ["confirmed", "fulfilled", "cancelled"] as const;

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const allSelected = orders.length > 0 && selected.size === orders.length;
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(orders.map((o) => o.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkStatus = (status: string) => {
    const ids = Array.from(selected);
    startTransition(async () => {
      await bulkUpdateStatus(ids, status);
      setSelected(new Set());
      router.refresh();
    });
  };

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selected.size} order(s)? This cannot be undone.`)) return;
    const ids = Array.from(selected);
    startTransition(async () => {
      await bulkDelete(ids);
      setSelected(new Set());
      router.refresh();
    });
  };

  return (
    <div>
      {/* Bulk action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          minHeight: "2.25rem",
        }}
      >
        {/* Select all checkbox */}
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", userSelect: "none" }}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            style={{ width: "1rem", height: "1rem", accentColor: brown, cursor: "pointer" }}
          />
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: brownMid }}>
            {someSelected ? `${selected.size} selected` : "Select all"}
          </span>
        </label>

        {someSelected && (
          <>
            <div style={{ width: "1px", height: "1.25rem", backgroundColor: creamDark }} />
            {BULK_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleBulkStatus(s)}
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
                {s}
              </button>
            ))}
            <button
              onClick={handleBulkDelete}
              disabled={isPending}
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                border: "1.5px solid #FCA5A5",
                backgroundColor: "transparent",
                color: "#991B1B",
                cursor: isPending ? "not-allowed" : "pointer",
                opacity: isPending ? 0.5 : 1,
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Order cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            selected={selected.has(order.id)}
            onToggle={() => toggleOne(order.id)}
          />
        ))}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  selected,
  onToggle,
}: {
  order: Order;
  selected: boolean;
  onToggle: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatus = (status: string) => {
    startTransition(async () => {
      await updateOrderStatus(order.id, status);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm(`Delete order ${order.id}? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteOrder(order.id);
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
        border: `1.5px solid ${selected ? brown : creamDark}`,
        borderRadius: "1rem",
        padding: "1.125rem",
        transition: "border-color 0.15s ease",
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            style={{ width: "1rem", height: "1rem", accentColor: brown, cursor: "pointer", flexShrink: 0, marginTop: "2px" }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{order.id}</div>
            <div style={{ fontSize: "0.75rem", color: muted, marginTop: "0.125rem" }}>{date}</div>
          </div>
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
        {order.paymongo_session_id && <Info label="PayMongo" value={order.paymongo_session_id} />}
        {order.social && <Info label="Social" value={`@${order.social}`} />}
        <Info
          label="Delivery"
          value={
            order.delivery_type === "now"
              ? "ASAP"
              : `${order.delivery_date ?? ""} ${order.delivery_time ?? ""}`
          }
        />
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
          <span style={{ color: olive }}>₱{order.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Per-card actions */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
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
              {s}
            </button>
          ))}
        <button
          onClick={handleDelete}
          disabled={isPending}
          style={{
            marginLeft: "auto",
            fontSize: "0.75rem",
            fontWeight: 600,
            padding: "0.375rem 0.875rem",
            borderRadius: "9999px",
            border: "1.5px solid #FCA5A5",
            backgroundColor: "transparent",
            color: "#991B1B",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.5 : 1,
          }}
        >
          Delete
        </button>
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
