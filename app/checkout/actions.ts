"use server";

import { redirect } from "next/navigation";
import { sendOrderConfirmation } from "@/lib/mailgun";
import { getUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export type CheckoutState = { error?: string };

type CartLine = { productId: number; quantity: number };

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const supabase = await createClient();
  const user = await getUser();
  if (!user?.email) return { error: "Please sign in to place your order." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  if (!fullName || !phone || !address || !city) return { error: "Please fill in every field." };

  let lines: CartLine[];
  try {
    lines = JSON.parse(String(formData.get("cart") ?? "[]"));
  } catch {
    return { error: "Your cart could not be read. Please refresh and try again." };
  }
  lines = lines.filter((l) => Number.isInteger(l.productId) && Number.isInteger(l.quantity) && l.quantity > 0);
  if (lines.length === 0) return { error: "Your cart is empty." };

  // Prices always come from the database, never from the browser.
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price")
    .in("id", lines.map((l) => l.productId));
  if (productsError || !products) return { error: "Could not load products. Please try again." };

  const items = lines.flatMap((l) => {
    const p = products.find((p) => p.id === l.productId);
    return p ? [{ productId: p.id, name: p.name, unitPrice: Number(p.price), quantity: l.quantity }] : [];
  });
  if (items.length !== lines.length) return { error: "Some items are no longer available. Please review your cart." };

  const total = Math.round(items.reduce((n, i) => n + i.unitPrice * i.quantity, 0) * 100) / 100;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: user.id, email: user.email, full_name: fullName, phone, address, city, total })
    .select("id")
    .single();
  if (orderError || !order) return { error: "Could not save your order. Please try again." };

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      quantity: i.quantity,
      unit_price: i.unitPrice,
    })),
  );
  if (itemsError) return { error: "Could not save your order items. Please try again." };

  // The order is saved either way; a mail failure shouldn't lose it.
  try {
    await sendOrderConfirmation({
      to: user.email,
      name: fullName,
      orderId: order.id,
      total,
      items,
      address: `${address}, ${city}`,
    });
    await supabase.from("orders").update({ email_sent: true }).eq("id", order.id);
  } catch (err) {
    console.error("Order confirmation email failed:", err);
  }

  redirect(`/orders/${order.id}?placed=1`);
}
