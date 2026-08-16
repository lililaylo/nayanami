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

export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
