"use server";

import { redirect } from "next/navigation";

export async function submitOrder(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const address = (formData.get("address") as string).trim();
  const items = formData.get("items") as string;
  const total = formData.get("total") as string;

  if (!name || !phone || !address || !items) {
    throw new Error("Missing required fields");
  }

  const orderId = `NYM-${Date.now().toString(36).toUpperCase()}`;

  const params = new URLSearchParams({
    id: orderId,
    name,
    phone,
    address,
    items,
    total,
  });

  redirect(`/success?${params.toString()}`);
}
