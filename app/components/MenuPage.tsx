"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { menuItems, type MenuItem } from "@/lib/menu";
import { submitOrder, fetchDeliveryQuoteFromBarangay } from "@/app/actions";

type CartItem = { id: string; name: string; price: number; quantity: number };
type Category = "All" | "Matcha" | "Hojicha";
type OverlayStep = "cart" | "form";

const CATEGORIES: Category[] = ["All", "Matcha", "Hojicha"];

const PASIG_BARANGAYS = [
  "Bagong Ilog", "Bagong Katipunan", "Bambang", "Buting", "Caniogan",
  "Dela Paz", "Kalawaan", "Kapasigan", "Kapitolyo", "Malinao", "Manggahan",
  "Maybunga", "Oranbo", "Palatiw", "Pinagbuhatan", "Pineda", "Rosario",
  "Sagad", "San Antonio", "San Joaquin", "San Jose", "San Miguel",
  "San Nicolas", "Santa Cruz", "Santa Lucia", "Santa Rosa", "Santo Tomas",
  "Santolan", "Sumilang", "Ugong",
];

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
    street: "",
    barangay: "",
    socialPlatform: "instagram" as "instagram" | "tiktok",
    social: "",
    deliveryType: "now" as "now" | "scheduled",
    deliveryDate: "",
    deliveryTime: "",
    paymentRef: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deliveryFee, setDeliveryFee] = useState<number | null | "loading" | "failed">(null);
  const [isPending, startTransition] = useTransition();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit number (e.g. 9171234567)";
    if (!form.street.trim()) e.street = "Street address is required";
    if (!form.barangay) e.barangay = "Please select your barangay";
    if (!form.social.trim()) e.social = "Social handle is required";
    if (!form.paymentRef.trim()) e.paymentRef = "Payment reference is required";
    if (form.deliveryType === "scheduled") {
      if (!form.deliveryDate) e.deliveryDate = "Please select a date";
      if (!form.deliveryTime) e.deliveryTime = "Please select a time";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    if (!form.barangay) { setDeliveryFee(null); return; }
    setDeliveryFee("loading");
    fetchDeliveryQuoteFromBarangay(form.barangay).then((fee) => {
      setDeliveryFee(fee !== null ? fee : "failed");
    });
  }, [form.barangay]);

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
      fd.append("address", `${form.street.trim()}, ${form.barangay}, Pasig City`);
      fd.append("social", form.social.trim());
      fd.append("socialPlatform", form.socialPlatform);
      fd.append("deliveryType", form.deliveryType);
      fd.append("deliveryDate", form.deliveryDate);
      fd.append("deliveryTime", form.deliveryTime);
      fd.append("paymentRef", form.paymentRef);
      fd.append("deliveryFee", String(typeof deliveryFee === "number" ? deliveryFee : 0));
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
            Aug 17–18 only
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

                  {/* House/Street */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem", color: brownMid }}>
                      House/Unit No. & Street *
                    </label>
                    <input
                      type="text"
                      value={form.street}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, street: e.target.value }));
                        if (errors.street) setErrors((er) => ({ ...er, street: "" }));
                      }}
                      placeholder="e.g. 23 Kalayaan St."
                      autoComplete="address-line1"
                      style={{ width: "100%", padding: "0.875rem 1rem", border: `1.5px solid ${errors.street ? "#c0392b" : creamDark}`, borderRadius: "0.75rem", fontSize: "0.9375rem", backgroundColor: creamLight, color: brown, boxSizing: "border-box" }}
                    />
                    {errors.street && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.street}</p>}
                  </div>

                  {/* Barangay */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem", color: brownMid }}>
                      Barangay *
                    </label>
                    <SearchableSelect
                      value={form.barangay}
                      onChange={(v) => {
                        setForm((f) => ({ ...f, barangay: v }));
                        if (errors.barangay) setErrors((er) => ({ ...er, barangay: "" }));
                      }}
                      options={PASIG_BARANGAYS}
                      placeholder="Select barangay"
                      hasError={!!errors.barangay}
                    />
                    {errors.barangay && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.barangay}</p>}
                  </div>

                  {/* City — fixed */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem", color: brownMid }}>City</label>
                    <div style={{ padding: "0.875rem 1rem", backgroundColor: creamDark, borderRadius: "0.75rem", fontSize: "0.9375rem", color: brownMid, fontWeight: 500 }}>
                      Pasig City
                    </div>
                  </div>

                  {/* Delivery fee estimate */}
                  {(deliveryFee === "loading" || typeof deliveryFee === "number" || deliveryFee === "failed") && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem" }}>
                      {deliveryFee === "loading" && (
                        <span style={{ color: muted }}>Calculating delivery fee…</span>
                      )}
                      {typeof deliveryFee === "number" && (
                        <span style={{ color: olive, fontWeight: 700 }}>~₱{deliveryFee} estimated delivery fee</span>
                      )}
                      {deliveryFee === "failed" && (
                        <span style={{ color: muted }}>Could not estimate delivery fee</span>
                      )}
                    </div>
                  )}

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.5rem", color: brownMid }}>
                      Social *
                    </label>
                    <div style={{ display: "flex", backgroundColor: creamDark, borderRadius: "0.75rem", padding: "0.25rem", gap: "0.25rem", marginBottom: "0.625rem" }}>
                      {(["instagram", "tiktok"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, socialPlatform: p }))}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            backgroundColor: form.socialPlatform === p ? brown : "transparent",
                            color: form.socialPlatform === p ? cream : brownMid,
                            transition: "all 0.15s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.375rem",
                          }}
                        >
                          {p === "instagram" ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                              <circle cx="12" cy="12" r="4"/>
                              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
                            </svg>
                          )}
                          {p === "instagram" ? "Instagram" : "TikTok"}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", border: `1.5px solid ${errors.social ? "#c0392b" : creamDark}`, borderRadius: "0.75rem", overflow: "hidden", backgroundColor: creamLight }}>
                      <span style={{ padding: "0.875rem 0.75rem 0.875rem 1rem", fontSize: "0.9375rem", color: muted, flexShrink: 0, borderRight: `1px solid ${creamDark}` }}>@</span>
                      <input
                        type="text"
                        value={form.social}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, social: e.target.value.replace(/^@/, "") }));
                          if (errors.social) setErrors((er) => ({ ...er, social: "" }));
                        }}
                        placeholder="yourhandle"
                        style={{ flex: 1, padding: "0.875rem 1rem", border: "none", fontSize: "0.9375rem", backgroundColor: "transparent", color: brown, outline: "none" }}
                      />
                    </div>
                    {errors.social && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.social}</p>}
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
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: muted, marginBottom: "0.25rem" }}>Date</label>
                          <CustomDatePicker
                            value={form.deliveryDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(v) => {
                              setForm((f) => ({ ...f, deliveryDate: v }));
                              if (errors.deliveryDate) setErrors((er) => ({ ...er, deliveryDate: "" }));
                            }}
                            hasError={!!errors.deliveryDate}
                          />
                          {errors.deliveryDate && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.deliveryDate}</p>}
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: muted, marginBottom: "0.25rem" }}>Time</label>
                          <CustomSelect
                            value={form.deliveryTime}
                            onChange={(v) => {
                              setForm((f) => ({ ...f, deliveryTime: v }));
                              if (errors.deliveryTime) setErrors((er) => ({ ...er, deliveryTime: "" }));
                            }}
                            options={["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]}
                            placeholder="Select a time"
                            hasError={!!errors.deliveryTime}
                          />
                          {errors.deliveryTime && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.deliveryTime}</p>}
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
                  <div style={{ borderTop: `1px solid ${creamDark}`, marginTop: "0.75rem", paddingTop: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.375rem" }}>
                      <span style={{ color: muted }}>Subtotal</span>
                      <span>₱{total.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                      <span style={{ color: muted }}>Delivery</span>
                      <span style={{ color: typeof deliveryFee === "number" ? olive : muted }}>
                        {typeof deliveryFee === "number" ? `~₱${deliveryFee}` : "—"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.9375rem" }}>
                      <span>Total</span>
                      <span style={{ color: olive }}>
                        ₱{(total + (typeof deliveryFee === "number" ? deliveryFee : 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment QR */}
                <div
                  style={{
                    backgroundColor: creamLight,
                    border: `1.5px solid ${creamDark}`,
                    borderRadius: "0.875rem",
                    padding: "1.125rem",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: "0.875rem" }}>
                    Payment
                  </div>
                  <img
                    src="/qr.jpg"
                    alt="InstaPay QR"
                    style={{ width: "100%", maxWidth: "280px", height: "auto", borderRadius: "0.75rem", margin: "0 auto 0.75rem", display: "block" }}
                  />
                  <p style={{ fontSize: "0.75rem", color: muted, margin: 0 }}>
                    Scan to pay before your order is confirmed
                  </p>
                  <div style={{ marginTop: "0.875rem" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: muted, marginBottom: "0.375rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Payment Reference *
                    </label>
                    <input
                      type="text"
                      value={form.paymentRef}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, paymentRef: e.target.value }));
                        if (errors.paymentRef) setErrors((er) => ({ ...er, paymentRef: "" }));
                      }}
                      placeholder="Last 4 digits or transaction ref"
                      style={{ width: "100%", padding: "0.75rem 1rem", border: `1.5px solid ${errors.paymentRef ? "#c0392b" : creamDark}`, borderRadius: "0.75rem", fontSize: "0.875rem", backgroundColor: cream, color: brown, boxSizing: "border-box" }}
                    />
                    {errors.paymentRef && <p style={{ color: "#c0392b", fontSize: "0.75rem", marginTop: "0.3rem" }}>{errors.paymentRef}</p>}
                  </div>
                </div>

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

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["S","M","T","W","T","F","S"];

function CustomDatePicker({
  value,
  onChange,
  min,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const isDisabled = (day: number) => {
    if (!min) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(min + "T00:00:00");
  };
  const isSelected = (day: number) =>
    !!selected && selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;
  const isTodayDay = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  const handleSelect = (day: number) => {
    if (isDisabled(day)) return;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const displayValue = selected
    ? selected.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          border: `1.5px solid ${hasError ? "#c0392b" : creamDark}`,
          borderRadius: "0.75rem",
          fontSize: "0.9375rem",
          backgroundColor: creamLight,
          color: displayValue ? brown : muted,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>{displayValue || "Select a date"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          backgroundColor: creamLight,
          border: `1.5px solid ${creamDark}`,
          borderRadius: "0.875rem",
          zIndex: 100,
          boxShadow: "0 4px 20px rgba(61,26,8,0.14)",
          padding: "1rem",
        }}>
          {/* Month navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
            <button type="button" onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: brown, fontSize: "1.25rem", lineHeight: 1, padding: "0.25rem 0.5rem", borderRadius: "0.5rem" }}>‹</button>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: brown }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: brown, fontSize: "1.25rem", lineHeight: 1, padding: "0.25rem 0.5rem", borderRadius: "0.5rem" }}>›</button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "0.25rem" }}>
            {DOW.map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: "0.6875rem", fontWeight: 700, color: muted, padding: "0.25rem 0" }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const sel = isSelected(day);
              const dis = isDisabled(day);
              const tod = isTodayDay(day);
              const hov = hovered === day && !dis;
              return (
                <button
                  key={day}
                  type="button"
                  onMouseEnter={() => !dis && setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSelect(day)}
                  disabled={dis}
                  style={{
                    padding: "0.375rem 0",
                    borderRadius: "0.5rem",
                    border: tod && !sel ? `1.5px solid ${brown}` : "1.5px solid transparent",
                    backgroundColor: sel ? brown : hov ? creamDark : "transparent",
                    color: sel ? cream : dis ? "#C4B99A" : brown,
                    fontSize: "0.875rem",
                    fontWeight: sel || tod ? 700 : 400,
                    cursor: dis ? "default" : "pointer",
                    textAlign: "center",
                    transition: "background-color 0.1s ease",
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (opt: string) => {
    onChange(opt);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={handleOpen}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          border: `1.5px solid ${hasError ? "#c0392b" : creamDark}`,
          borderRadius: "0.75rem",
          fontSize: "0.9375rem",
          backgroundColor: creamLight,
          color: value ? brown : muted,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>{value || placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          backgroundColor: creamLight,
          border: `1.5px solid ${creamDark}`,
          borderRadius: "0.75rem",
          zIndex: 100,
          boxShadow: "0 4px 16px rgba(61,26,8,0.12)",
          overflow: "hidden",
        }}>
          {/* Search input */}
          <div style={{ padding: "0.625rem", borderBottom: `1px solid ${creamDark}` }}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search barangay…"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: `1.5px solid ${creamDark}`,
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                backgroundColor: cream,
                color: brown,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Options list */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: muted }}>No results</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onMouseEnter={() => setHovered(opt)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSelect(opt)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    fontSize: "0.9375rem",
                    textAlign: "left",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: hovered === opt ? brown : opt === value ? creamDark : "transparent",
                    color: hovered === opt ? cream : brown,
                    fontWeight: opt === value ? 600 : 400,
                    transition: "background-color 0.1s ease",
                  }}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          border: `1.5px solid ${hasError ? "#c0392b" : creamDark}`,
          borderRadius: "0.75rem",
          fontSize: "0.9375rem",
          backgroundColor: creamLight,
          color: value ? brown : muted,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>{value || placeholder}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={muted}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease", flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: creamLight,
            border: `1.5px solid ${creamDark}`,
            borderRadius: "0.75rem",
            overflow: "hidden",
            zIndex: 100,
            boxShadow: "0 4px 16px rgba(61,26,8,0.12)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseEnter={() => setHovered(opt)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                padding: "0.75rem 1rem",
                fontSize: "0.9375rem",
                textAlign: "left",
                border: "none",
                cursor: "pointer",
                backgroundColor: hovered === opt ? brown : opt === value ? creamDark : "transparent",
                color: hovered === opt ? cream : brown,
                fontWeight: opt === value ? 600 : 400,
                transition: "background-color 0.1s ease",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
