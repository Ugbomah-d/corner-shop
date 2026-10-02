import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import type { Product } from "./types";

// Products are public, so they're fetched without the user's cookies and cached.
// Checkout still reads prices fresh from the database.
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, image_url")
      .order("id");
    if (error) throw error;
    return data;
  },
  ["products"],
  { revalidate: 60 },
);
