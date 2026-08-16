"use client";

import { useState, useTransition } from "react";
import { menuItems, type MenuItem } from "@/lib/menu";
import { submitOrder } from "@/app/actions";

type CartItem = { id: string; name: string; price: number; quantity: number };
type Category = "All" | "Matcha" | "Hojicha";
type OverlayStep = "cart" | "form";

const CATEGORIES: Category[] = ["All", "Matcha", "Hojicha"];

const cream = "#EDE8D5";
const brown = "#3D1A08";
const olive = "#7A7B1C";
const brownMid = "#6B3A1F";
const creamDark = "#D4C9A8";
const creamLight = "#F8F4EA";
const muted = "#8B7355";

export function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState<Category>("All");
  const [showOverlay, setShowOverlay] = useState(false);
  const [step, setStep] = useState<OverlayStep>("cart");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    social: "",
    deliveryType: "now" as "now" | "scheduled",
    deliveryDate: "",
    deliveryTime: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit number (e.g. 9171234567)";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (form.deliveryType === "scheduled") {
      if (!form.deliveryDate) e.deliveryDate = "Please select a date";
      if (!form.deliveryTime) e.deliveryTime = "Please select a time";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const filtered =
    category === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === category);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  const getQty = (id: string) =>
    cart.find((i) => i.id === id)?.quantity ?? 0;

  const add = (item: MenuItem) =>
    setCart((c) => {
      const exists = c.find((i) => i.id === item.id);
      if (exists)
        return c.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [
        ...c,
        { id: item.id, name: item.name, price: item.price, quantity: 1 },
      ];
    });

  const remove = (id: string) =>
    setCart((c) => {
      const exists = c.find((i) => i.id === id);
      if (exists?.quantity === 1) return c.filter((i) => i.id !== id);
      return c.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });

  const openCart = () => {
    setStep("cart");
    setShowOverlay(true);
  };

  const canSubmit = !isPending;

  const handlePlaceOrder = () => {
    if (!validate()) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("phone", form.phone.trim());
      fd.append("address", form.address.trim());
      fd.append("social", form.social.trim());
      fd.append("deliveryType", form.deliveryType);
      fd.append("deliveryDate", form.deliveryDate);
      fd.append("deliveryTime", form.deliveryTime);
      fd.append("items", JSON.stringify(cart));
      fd.append("total", String(total));
      await submitOrder(fd);
    });
  };

  return (
    <div
      style={{
        backgroundColor: cream,
        minHeight: "100vh",
        color: brown,
        fontFamily: "var(--font-dm-sans, system-ui)",
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          padding: "1.25rem 1.5rem",
          borderBottom: `1px solid ${creamDark}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/logo.png"
          alt="Nayanami"
          style={{ height: "56px", width: "auto" }}
        />
      </header>

      {/* ── CATEGORY TABS ── */}
      <div
        style={{
          padding: "1rem 1.5rem",
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          borderBottom: `1px solid ${creamDark}`,
          scrollbarWidth: "none",
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 600,
                border: `1.5px solid ${active ? brown : creamDark}`,
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: active ? brown : "transparent",
                color: active ? cream : brown,
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── DRINKS NOTE ── */}
      <div style={{ padding: "0.875rem 1rem 0", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", color: muted, margin: 0, letterSpacing: "0.01em" }}>
          All drinks are <strong>12 oz</strong> · Made with <strong>oat milk</strong> by default
        </p>
      </div>

      {/* ── LAUNCH PROMO ── */}
      <div
        style={{
          margin: "1rem 1rem 0",
          padding: "0.875rem 1.125rem",
          backgroundColor: brown,
          borderRadius: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EDE8D5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div>
          <div style={{ color: cream, fontWeight: 700, fontSize: "0.875rem" }}>
            Launch Special — All drinks ₱180
          </div>
          <div style={{ color: "rgba(237,232,213,0.65)", fontSize: "0.75rem", marginTop: "0.125rem" }}>
            Today & tomorrow only · Aug 16–17
          </div>
        </div>
      </div>

      {/* ── MENU GRID ── */}
      <div
        style={{
          padding: "1.25rem 1rem",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.75rem",
          paddingBottom: count > 0 ? "6rem" : "2rem",
        }}
      >
        {filtered.map((item) => {
          const qty = getQty(item.id);
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: creamLight,
                border: `1.5px solid ${creamDark}`,
                borderRadius: "1rem",
                padding: "1.125rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: muted,
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                {item.description}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "0.625rem",
                }}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: olive,
                  }}
                >
                  ₱{item.price}
                </span>

                {qty === 0 ? (
                  <button
                    onClick={() => add(item)}
                    aria-label={`Add ${item.name}`}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "9999px",
                      backgroundColor: brown,
                      color: cream,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    +
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => remove(item.id)}
                      style={{
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "9999px",
                        border: `1.5px solid ${brown}`,
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        color: brown,
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontWeight: 700, minWidth: "1rem", textAlign: "center" }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => add(item)}
                      style={{
                        width: "1.75rem",
                        height: "1.75rem",
                        borderRadius: "9999px",
                        backgroundColor: brown,
                        color: cream,
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── STICKY CART BAR ── */}
      {count > 0 && !showOverlay && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: brown,
            padding: "1rem 1.25rem",
            paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ color: cream, fontSize: "0.875rem", opacity: 0.7 }}>
            {count} item{count !== 1 ? "s" : ""}
          </span>
          <button
            onClick={openCart}
            style={{
              color: cream,
              fontSize: "1rem",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View order · ₱{total.toLocaleString()} →
          </button>
        </div>
      )}

      {/* ── OVERLAY ── */}
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: cream,
            zIndex: 50,
            overflowY: "auto",
            overscrollBehavior: "contain",
          }}
        >
          <div
            style={{
              maxWidth: "520px",
              margin: "0 auto",
              padding: "1.5rem",
              paddingBottom: "3rem",
            }}
          >
            {step === "cart" ? (
              <>
                {/* Cart header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair, serif)",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    Your Order
                  </h2>
                  <button
                    onClick={() => setShowOverlay(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.375rem",
                      color: brown,
                      padding: "0.25rem",
                      lineHeight: 1,
                    }}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Cart items */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.875rem",
                        padding: "1rem",
                        backgroundColor: creamLight,
                        borderRadius: "0.875rem",
                        border: `1px solid ${creamDark}`,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            marginBottom: "0.125rem",
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{ fontSize: "0.8125rem", color: muted }}
                        >
                          ₱{item.price} each
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.625rem",
                        }}
                      >
                        <button
                          onClick={() => remove(item.id)}
                          style={{
                            width: "1.75rem",
                            height: "1.75rem",
                            borderRadius: "9999px",
                            border: `1.5px solid ${brown}`,
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            color: brown,
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontWeight: 700,
                            minWidth: "1.25rem",
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            const m = menuItems.find((i) => i.id === item.id);
                            if (m) add(m);
                          }}
                          style={{
                            width: "1.75rem",
                            height: "1.75rem",
                            borderRadius: "9999px",
                            backgroundColor: brown,
                            color: cream,
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          minWidth: "4.5rem",
                          textAlign: "right",
                          color: olive,
                          fontSize: "0.9375rem",
                        }}
                      >
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div
                  style={{
                    borderTop: `1.5px solid ${creamDark}`,
                    paddingTop: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-playfair, serif)",
                      fontSize: "1.375rem",
                      fontWeight: 700,
                      color: olive,
                    }}
                  >
                    ₱{total.toLocaleString()}
                  </span>
                </div>

                {/* Add more link */}
                <button
                  onClick={() => setShowOverlay(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: brownMid,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "1rem",
                    padding: 0,
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  + Add more items
                </button>

                <button
                  onClick={() => setStep("form")}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: brown,
                    color: cream,
                    border: "none",
                    borderRadius: "0.875rem",
                    fontSize: "1rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: "0.5rem",
                  }}
                >
                  Continue to checkout →
                </button>
              </>
            ) : (
              <>
                {/* Checkout form header */}
                <button
                  onClick={() => setStep("cart")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: olive,
                    fontWeight: 600,
                    marginBottom: "1.5rem",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    fontSize: "0.875rem",
                  }}
                >
                  ← Back to order
                </button>

                <h2
                  style={{
                    fontFamily: "var(--font-playfair, serif)",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    marginBottom: "1.5rem",
                    marginTop: 0,
                  }}
                >
                  Your Details
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem", color: brownMid }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, name: e.target.value }));
                        if (errors.name) setErrors((er) => ({ ...er, name: "" }));
                      }}
                      placeholder="e.g. Maria Santos"
                      autoComplete="name"
                      style={{ width: "100%", padding: "0.875rem 1rem", border: `1.5px solid ${errors.name ? "#c0392b" : creamDark}`, borderRadius: "0.75rem", fontSize: "0.9375rem", backgroundColor: creamLight, color: brown, boxSizing: "border-box" }}
                    />
                    {errors.name && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.name}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem", color: brownMid }}>
                      Phone Number *
                    </label>
                    <div style={{ display: "flex", border: `1.5px solid ${errors.phone ? "#c0392b" : creamDark}`, borderRadius: "0.75rem", overflow: "hidden", backgroundColor: creamLight }}>
                      <span style={{ padding: "0.875rem 0.75rem 0.875rem 1rem", fontSize: "0.9375rem", color: brown, fontWeight: 600, flexShrink: 0, borderRight: `1px solid ${creamDark}` }}>+63</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setForm((f) => ({ ...f, phone: val }));
                          if (errors.phone) setErrors((er) => ({ ...er, phone: "" }));
                        }}
                        placeholder="9171234567"
                        autoComplete="tel"
                        style={{ flex: 1, padding: "0.875rem 1rem", border: "none", fontSize: "0.9375rem", backgroundColor: "transparent", color: brown, outline: "none" }}
                      />
                    </div>
                    {errors.phone && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.phone}</p>}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        marginBottom: "0.375rem",
                        color: brownMid,
                      }}
                    >
                      Delivery Address *
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, address: e.target.value }));
                        if (errors.address) setErrors((er) => ({ ...er, address: "" }));
                      }}
                      placeholder="House/Unit No., Street, Barangay, City"
                      rows={3}
                      autoComplete="street-address"
                      style={{ width: "100%", padding: "0.875rem 1rem", border: `1.5px solid ${errors.address ? "#c0392b" : creamDark}`, borderRadius: "0.75rem", fontSize: "0.9375rem", backgroundColor: creamLight, color: brown, resize: "none", boxSizing: "border-box" }}
                    />
                    {errors.address && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.address}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem", color: brownMid }}>
                      Instagram or TikTok <span style={{ fontWeight: 400, color: muted }}>(for order updates)</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: muted, fontSize: "0.9375rem", pointerEvents: "none" }}>@</span>
                      <input
                        type="text"
                        value={form.social}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, social: e.target.value.replace(/^@/, "") }))
                        }
                        placeholder="yourhandle"
                        style={{
                          width: "100%",
                          padding: "0.875rem 1rem 0.875rem 2rem",
                          border: `1.5px solid ${creamDark}`,
                          borderRadius: "0.75rem",
                          fontSize: "0.9375rem",
                          backgroundColor: creamLight,
                          color: brown,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        marginBottom: "0.625rem",
                        color: brownMid,
                      }}
                    >
                      Delivery Time *
                    </label>
                    <div
                      style={{
                        display: "flex",
                        backgroundColor: creamDark,
                        borderRadius: "0.75rem",
                        padding: "0.25rem",
                        gap: "0.25rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {(["now", "scheduled"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, deliveryType: opt }))}
                          style={{
                            flex: 1,
                            padding: "0.625rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            backgroundColor: form.deliveryType === opt ? brown : "transparent",
                            color: form.deliveryType === opt ? cream : brownMid,
                            transition: "all 0.15s ease",
                            textTransform: "capitalize",
                          }}
                        >
                          {opt === "now" ? "Now" : "Schedule"}
                        </button>
                      ))}
                    </div>

                    {form.deliveryType === "scheduled" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: muted, marginBottom: "0.25rem" }}>Date</label>
                          <input
                            type="date"
                            value={form.deliveryDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setForm((f) => ({ ...f, deliveryDate: e.target.value }))}
                            style={{
                              width: "100%",
                              padding: "0.75rem 0.875rem",
                              border: `1.5px solid ${creamDark}`,
                              borderRadius: "0.75rem",
                              fontSize: "0.875rem",
                              backgroundColor: creamLight,
                              color: brown,
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: muted, marginBottom: "0.25rem" }}>Time</label>
                          <input
                            type="time"
                            value={form.deliveryTime}
                            onChange={(e) => setForm((f) => ({ ...f, deliveryTime: e.target.value }))}
                            style={{
                              width: "100%",
                              padding: "0.75rem 0.875rem",
                              border: `1.5px solid ${creamDark}`,
                              borderRadius: "0.75rem",
                              fontSize: "0.875rem",
                              backgroundColor: creamLight,
                              color: brown,
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order summary */}
                <div
                  style={{
                    backgroundColor: creamLight,
                    borderRadius: "0.875rem",
                    padding: "1rem",
                    border: `1px solid ${creamDark}`,
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: muted,
                      marginBottom: "0.75rem",
                    }}
                  >
                    Order Summary
                  </div>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.875rem",
                        marginBottom: "0.375rem",
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
                      marginTop: "0.75rem",
                      paddingTop: "0.75rem",
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: olive }}>
                      ₱{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: muted,
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  Payment: Cash on Delivery
                </p>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!canSubmit}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    border: "none",
                    borderRadius: "0.875rem",
                    fontSize: "1rem",
                    fontWeight: 700,
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    backgroundColor: canSubmit ? brown : "#C4A882",
                    color: cream,
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {isPending ? "Placing order…" : "Place Order"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
