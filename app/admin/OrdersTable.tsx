"use client";

import { useState, useTransition } from "react";
import { type Order } from "@/lib/supabase";
import { markOrderPaid, updateOrderStatus, deleteOrder, bulkUpdateStatus, bulkDelete } from "./actions";
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

type Filter = "all" | "awaiting" | "paid" | "fulfilled";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "awaiting", label: "Awaiting payment" },
  { key: "paid",     label: "Paid" },
  { key: "fulfilled",label: "Fulfilled" },
];

function applyFilter(orders: Order[], filter: Filter): Order[] {
  if (filter === "awaiting") return orders.filter((o) => o.payment_status === "unpaid" && o.status !== "cancelled");
  if (filter === "paid")     return orders.filter((o) => o.payment_status === "paid" && o.status !== "fulfilled");
  if (filter === "fulfilled") return orders.filter((o) => o.status === "fulfilled");
  return orders;
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const visible = applyFilter(orders, filter);
  const allSelected = visible.length > 0 && selected.size === visible.length;
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(visible.map((o) => o.id)));
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

  const counts: Record<Filter, number> = {
    all:       orders.length,
    awaiting:  applyFilter(orders, "awaiting").length,
    paid:      applyFilter(orders, "paid").length,
    fulfilled: applyFilter(orders, "fulfilled").length,
  };

  return (
    <div>
      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.375rem",
          marginBottom: "1rem",
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingBottom: "2px",
        }}
      >
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => { setFilter(key); setSelected(new Set()); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.5rem 0.875rem",
                borderRadius: "9999px",
                border: `1.5px solid ${active ? brown : creamDark}`,
                backgroundColor: active ? brown : "transparent",
                color: active ? "#EDE8D5" : brownMid,
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {label}
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  padding: "0.1rem 0.4rem",
                  borderRadius: "9999px",
                  backgroundColor: active ? "rgba(255,255,255,0.2)" : creamDark,
                  color: active ? "#EDE8D5" : muted,
                }}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bulk action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
          minHeight: "2.75rem",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", userSelect: "none", minHeight: "44px" }}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            style={{ width: "1.125rem", height: "1.125rem", accentColor: brown, cursor: "pointer" }}
          />
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: brownMid }}>
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
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  padding: "0.5rem 1rem",
                  minHeight: "44px",
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
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "0.5rem 1rem",
                minHeight: "44px",
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
      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: muted, fontSize: "0.9rem" }}>
          No orders in this category.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              selected={selected.has(order.id)}
              onToggle={() => toggleOne(order.id)}
            />
          ))}
        </div>
      )}
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

  const handleMarkPaid = () => {
    startTransition(async () => {
      await markOrderPaid(order.id);
      router.refresh();
    });
  };

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
  const isPaid = order.payment_status === "paid";

  const social = order.social;
  let socialDisplay = "";
  if (social) {
    const idx = social.indexOf(":");
    if (idx !== -1) {
      const platform = social.slice(0, idx);
      const handle = social.slice(idx + 1);
      socialDisplay = `${platform === "instagram" ? "IG" : "TT"}: @${handle}`;
    } else {
      socialDisplay = `@${social}`;
    }
  }

  const date = new Date(order.created_at).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const deliveryLabel =
    order.delivery_type === "now"
      ? "ASAP"
      : `${order.delivery_date ?? ""} · ${order.delivery_time ?? ""}`;

  return (
    <div
      style={{
        backgroundColor: creamLight,
        border: `2px solid ${selected ? brown : isPaid ? "#86EFAC" : creamDark}`,
        borderRadius: "1rem",
        overflow: "hidden",
        transition: "border-color 0.15s ease",
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "0.875rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: `1px solid ${creamDark}`,
          backgroundColor: selected ? "#FDF8F0" : creamLight,
        }}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          style={{ width: "1.125rem", height: "1.125rem", accentColor: brown, cursor: "pointer", flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "0.9375rem", fontFamily: "monospace", letterSpacing: "0.02em" }}>
            {order.id}
          </div>
          <div style={{ fontSize: "0.75rem", color: muted, marginTop: "0.125rem" }}>{date}</div>
        </div>
        {/* Status badges */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", flexShrink: 0 }}>
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              textTransform: "capitalize",
              padding: "0.2rem 0.625rem",
              borderRadius: "9999px",
              backgroundColor: badge.bg,
              color: badge.color,
            }}
          >
            {order.status}
          </span>
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              padding: "0.2rem 0.625rem",
              borderRadius: "9999px",
              backgroundColor: isPaid ? "#D1FAE5" : "#FEF3C7",
              color: isPaid ? "#065F46" : "#92400E",
            }}
          >
            {isPaid ? "paid" : "unpaid"}
          </span>
        </div>
      </div>

      {/* Customer info */}
      <div style={{ padding: "0.875rem 1rem", borderBottom: `1px solid ${creamDark}` }}>
        <InfoRow icon="👤" value={order.customer_name} bold />
        <InfoRow icon="📱" value={order.phone} />
        <InfoRow icon="📍" value={order.address} />
        {socialDisplay && <InfoRow icon="💬" value={socialDisplay} />}
        <InfoRow icon="🕐" value={deliveryLabel} />
      </div>

      {/* Items */}
      <div style={{ padding: "0.875rem 1rem", borderBottom: `1px solid ${creamDark}` }}>
        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.875rem",
              marginBottom: "0.3rem",
              gap: "0.5rem",
            }}
          >
            <span style={{ color: brownMid }}>{item.quantity}× {item.name}</span>
            <span style={{ fontWeight: 600, flexShrink: 0 }}>₱{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        {order.delivery_fee != null && order.delivery_fee > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.3rem", color: muted }}>
            <span>Delivery fee</span>
            <span>₱{order.delivery_fee.toLocaleString()}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: "1rem",
            marginTop: "0.5rem",
            paddingTop: "0.5rem",
            borderTop: `1px solid ${creamDark}`,
          }}
        >
          <span>Total</span>
          <span style={{ color: olive }}>₱{order.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {/* Mark Paid — only shown when unpaid */}
        {!isPaid && (
          <button
            onClick={handleMarkPaid}
            disabled={isPending}
            style={{
              width: "100%",
              padding: "0.875rem",
              minHeight: "48px",
              borderRadius: "0.75rem",
              border: "none",
              backgroundColor: "#16A34A",
              color: "#fff",
              fontSize: "0.9375rem",
              fontWeight: 700,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {isPending ? "Saving…" : "Mark as Paid"}
          </button>
        )}

        {/* Status buttons */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {(["pending", "confirmed", "fulfilled", "cancelled"] as const)
            .filter((s) => s !== order.status)
            .map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={isPending}
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  padding: "0.5rem 0.875rem",
                  minHeight: "40px",
                  borderRadius: "9999px",
                  border: `1.5px solid ${creamDark}`,
                  backgroundColor: "transparent",
                  color: brownMid,
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
              fontSize: "0.8125rem",
              fontWeight: 600,
              padding: "0.5rem 0.875rem",
              minHeight: "40px",
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
    </div>
  );
}

function InfoRow({ icon, value, bold }: { icon: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", marginBottom: "0.375rem", alignItems: "flex-start" }}>
      <span style={{ flexShrink: 0, lineHeight: 1.5 }}>{icon}</span>
      <span style={{ fontWeight: bold ? 700 : 400, color: bold ? brown : brownMid, lineHeight: 1.5, wordBreak: "break-word" }}>
        {value}
      </span>
    </div>
  );
}
