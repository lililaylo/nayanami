"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { getDeliveryFee, getDeliveryFeeFromCoords } from "@/lib/lalamove";

export async function fetchDeliveryQuote(address: string): Promise<number | null> {
  return getDeliveryFee(address);
}

export async function fetchDeliveryQuoteFromCoords(lat: number, lng: number): Promise<number> {
  return getDeliveryFeeFromCoords(lat, lng);
}

export async function getAddressSuggestions(
  query: string
): Promise<Array<{ id: string; label: string; lat: number; lng: number }>> {
  if (query.trim().length < 3) return [];

  const googleKey = process.env.GOOGLE_MAPS_API_KEY;

  if (googleKey) {
    try {
      const acRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query + ", Pasig City")}&key=${googleKey}&components=country:ph&language=en&location=14.5761,121.0607&radius=20000`,
        { headers: { "User-Agent": "Nayanami/1.0" } }
      );
      const acData = await acRes.json();
      const predictions: Array<{ place_id: string; description: string }> =
        acData.predictions?.slice(0, 5) ?? [];

      const results = await Promise.all(
        predictions.map(async (p) => {
          const detailRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&key=${googleKey}&fields=geometry`,
            { headers: { "User-Agent": "Nayanami/1.0" } }
          );
          const detail = await detailRes.json();
          const loc = detail.result?.geometry?.location;
          return {
            id: p.place_id,
            label: p.description,
            lat: loc?.lat ?? 0,
            lng: loc?.lng ?? 0,
          };
        })
      );
      return results.filter((r) => r.lat !== 0);
    } catch {
      // fall through to Nominatim
    }
  }

  // Free fallback: Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", Pasig City, Philippines")}&format=json&limit=5&countrycodes=ph&addressdetails=0`,
      { headers: { "User-Agent": "Nayanami/1.0" } }
    );
    const data: Array<{ place_id: number; display_name: string; lat: string; lon: string }> =
      await res.json();
    return data.map((r, i) => ({
      id: String(r.place_id ?? i),
      label: r.display_name.split(", ").slice(0, 4).join(", "),
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    }));
  } catch {
    return [];
  }
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
  const paymentRef = (formData.get("paymentRef") as string | null)?.trim() || null;
  const deliveryFee = parseInt(formData.get("deliveryFee") as string) || 0;
  const items = JSON.parse(formData.get("items") as string);
  const itemsTotal = parseInt(formData.get("total") as string);
  const total = itemsTotal + deliveryFee;

  if (!name || !phone || !address || !items?.length) {
    throw new Error("Missing required fields");
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
    payment_ref: paymentRef,
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
        Title: `New order from ${name}`,
        Priority: "high",
        Tags: "green_circle",
      },
      body: `${itemSummary}\n₱${total} · ${when}\n${address}${social ? `\n@${social}` : ""}${paymentRef ? `\nRef: ${paymentRef}` : ""}`,
    }).catch(() => {});
  }

  redirect(`/success?id=${orderId}`);
}
