"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "ok", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function markOrderPaid(orderId: string) {
  await getSupabaseAdmin()
    .from("orders")
    .update({ payment_status: "paid", status: "confirmed" })
    .eq("id", orderId);

  const { data: order } = await getSupabaseAdmin()
    .from("orders")
    .select("customer_name, phone, items, total, delivery_type, delivery_date, delivery_time, address, social")
    .eq("id", orderId)
    .single();

  if (order && process.env.NTFY_TOPIC) {
    const itemSummary = (order.items as { quantity: number; name: string }[])
      .map((i) => `${i.quantity}× ${i.name}`)
      .join(", ");
    const when =
      order.delivery_type === "now"
        ? "ASAP"
        : `${order.delivery_date} ${order.delivery_time}`;
    const social = order.social as string | null;
    let socialLine = "";
    if (social) {
      const [platform, handle] = social.split(":");
      socialLine = `\n${platform === "instagram" ? "IG" : "TT"}: @${handle}`;
    }
    await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
      method: "POST",
      headers: {
        Title: `✅ PAID [${orderId}] – ${order.customer_name}`,
        Priority: "urgent",
        Tags: "green_circle",
      },
      body: `${itemSummary}\n₱${order.total} · ${when}\n${order.address}\n${order.phone}${socialLine}`,
    }).catch((err) => console.error("ntfy send failed:", err));
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await getSupabaseAdmin().from("orders").update({ status }).eq("id", orderId);
}

export async function deleteOrder(orderId: string) {
  await getSupabaseAdmin().from("orders").delete().eq("id", orderId);
}

export async function bulkUpdateStatus(orderIds: string[], status: string) {
  await getSupabaseAdmin().from("orders").update({ status }).in("id", orderIds);
}

export async function bulkDelete(orderIds: string[]) {
  await getSupabaseAdmin().from("orders").delete().in("id", orderIds);
}
