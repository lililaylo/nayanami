import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("paymongo-signature");

  if (process.env.PAYMONGO_WEBHOOK_SECRET && signature) {
    const parts = Object.fromEntries(
      signature.split(",").map((p) => {
        const idx = p.indexOf("=");
        return [p.slice(0, idx), p.slice(idx + 1)];
      })
    );
    const timestamp = parts.t;
    const receivedHmac = parts.te || parts.li;

    const expectedHmac = crypto
      .createHmac("sha256", process.env.PAYMONGO_WEBHOOK_SECRET)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    if (expectedHmac !== receivedHmac) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: { data?: { attributes?: { type?: string; data?: { attributes?: { metadata?: { order_id?: string }; reference_number?: string } } } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.data?.attributes?.type;

  if (eventType === "checkout_session.payment.paid") {
    const sessionData = event.data?.attributes?.data?.attributes;
    const orderId =
      sessionData?.metadata?.order_id || sessionData?.reference_number;

    if (orderId) {
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
  }

  return NextResponse.json({ received: true });
}
