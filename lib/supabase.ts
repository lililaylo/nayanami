import { createClient } from "@supabase/supabase-js";

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  address: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  status: "pending" | "confirmed" | "fulfilled" | "cancelled";
};

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, anon);
}

function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, service);
}

export const supabase = { from: (...args: Parameters<ReturnType<typeof createClient>["from"]>) => createSupabase().from(...args) };
export const supabaseAdmin = { from: (...args: Parameters<ReturnType<typeof createClient>["from"]>) => createSupabaseAdmin().from(...args) };
