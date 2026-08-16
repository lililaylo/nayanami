"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export async function submitOrder(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const address = (formData.get("address") as string).trim();
  const items = JSON.parse(formData.get("items") as string);
  const total = parseInt(formData.get("total") as string);

  if (!name || !phone || !address || !items?.length) {
    throw new Error("Missing required fields");
  }

  const orderId = `NYM-${Date.now().toString(36).toUpperCase()}`;

  const { error } = await getSupabase().from("orders").insert({
    id: orderId,
    customer_name: name,
    phone,
    address,
    items,
    total,
  });

  if (error) throw new Error(error.message);

  redirect(`/success?id=${orderId}`);
}
