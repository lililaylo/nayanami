"use server";

import { redirect } from "next/navigation";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import { getDeliveryFeeForBarangay } from "@/lib/lalamove";

const ORDER_LIMIT = 10;

function getPHTHour(): number {
  return (new Date().getUTCHours() + 8) % 24;
}

function isWithinOrderingHours(): boolean {
  const h = getPHTHour();
  return (h >= 10 && h < 14) || (h >= 19 && h < 21);
}

export async function fetchDeliveryQuoteFromBarangay(barangay: string): Promise<number | null> {
  return getDeliveryFeeForBarangay(barangay);
}

export async function checkOrderLimit(): Promise<{ available: boolean; remaining: number }> {
  // Start of today in PHT (UTC+8)
  const now = new Date();
  const phtNow = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const startOfDay = new Date(
    Date.UTC(phtNow.getUTCFullYear(), phtNow.getUTCMonth(), phtNow.getUTCDate()) -
      8 * 60 * 60 * 1000
  );

  const { count } = await getSupabaseAdmin()
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfDay.toISOString())
    .neq("status", "cancelled");

  const taken = count ?? 0;
  return { available: taken < ORDER_LIMIT, remaining: ORDER_LIMIT - taken };
}

export async function submitOrder(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const address = (formData.get("address") as string).trim();
  const social = (formData.get("social") as string).trim();
  const socialPlatform = formData.get("socialPlatform") as string;
  const deliveryType = formData.get("deliveryType") as string;
  const deliveryDate = formData.get("deliveryDate") as string;
  const deliveryTime = formData.get("deliveryTime") as string;
  const deliveryFee = parseInt(formData.get("deliveryFee") as string) || 0;
  const items = JSON.parse(formData.get("items") as string);
  const itemsTotal = parseInt(formData.get("total") as string);
  const total = itemsTotal + deliveryFee;

  if (!name || !phone || !address || !items?.length) {
    throw new Error("Missing required fields");
  }

  const limit = await checkOrderLimit();
  if (!limit.available) throw new Error("ORDERS_FULL");

  if (deliveryType === "now" && !isWithinOrderingHours()) {
    throw new Error("OUTSIDE_ORDERING_HOURS");
  }

  const orderId = `NYM-${Date.now().toString(36).toUpperCase()}`;

  const { error } = await getSupabase().from("orders").insert({
    id: orderId,
    customer_name: name,
    phone: `+63${phone}`,
    address,
    social: social ? `${socialPlatform}:${social}` : null,
    delivery_type: deliveryType,
    delivery_date: deliveryDate || null,
    delivery_time: deliveryTime || null,
    items,
    total,
    delivery_fee: deliveryFee || null,
    payment_status: "unpaid",
  });

  if (error) throw new Error(error.message);

  if (process.env.NTFY_TOPIC) {
    const itemSummary = (items as { quantity: number; name: string }[])
      .map((i) => `${i.quantity}× ${i.name}`)
      .join(", ");
    const when =
      deliveryType === "now" ? "ASAP" : `${deliveryDate} ${deliveryTime}`;
    await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
      method: "POST",
      headers: {
        Title: `New order [${orderId}] from ${name}`,
        Priority: "high",
        Tags: "orange_circle",
      },
      body: `${itemSummary}\n₱${total} · ${when}\n${address}\n+63${phone}${social ? `\n${socialPlatform === "instagram" ? "IG" : "TT"}: @${social}` : ""}`,
    }).catch(() => {});
  }

  redirect(`/success?id=${orderId}`);
}
