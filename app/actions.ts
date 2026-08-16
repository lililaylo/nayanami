"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export async function submitOrder(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const address = (formData.get("address") as string).trim();
  const social = (formData.get("social") as string).trim();
  const deliveryType = formData.get("deliveryType") as string;
  const deliveryDate = formData.get("deliveryDate") as string;
  const deliveryTime = formData.get("deliveryTime") as string;
  const items = JSON.parse(formData.get("items") as string);
  const total = parseInt(formData.get("total") as string);

  if (!name || !phone || !address || !items?.length) {
    throw new Error("Missing required fields");
  }

  const orderId = `NYM-${Date.now().toString(36).toUpperCase()}`;

  const { error } = await getSupabase().from("orders").insert({
    id: orderId,
    customer_name: name,
    phone: `+63${phone}`,
    address,
    social,
    delivery_type: deliveryType,
    delivery_date: deliveryDate || null,
    delivery_time: deliveryTime || null,
    items,
    total,
  });

  if (error) throw new Error(error.message);

  redirect(`/success?id=${orderId}`);
}
