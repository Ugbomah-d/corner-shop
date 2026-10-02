import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClearCart } from "@/components/clear-cart";
import { getUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/types";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { id } = await params;
  const { placed } = await searchParams;

  const user = await getUser();
  if (!user) redirect(`/login?next=/orders/${id}`);
  const supabase = await createClient();

  // RLS only returns orders that belong to the signed-in user.
  const { data: order } = await supabase
    .from("orders")
    .select("id, full_name, email, address, city, total, status, email_sent, created_at, order_items(id, product_name, quantity, unit_price)")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      {placed && <ClearCart />}
      <div className="rounded-xl border border-stone-200 bg-white p-8">
        {placed && <p className="text-sm font-semibold uppercase tracking-widest text-green-600">Order placed</p>}
        <h1 className="mt-1 text-2xl font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
        <p className="mt-1 text-sm text-stone-500">
          {new Date(order.created_at).toLocaleString()} · {order.status}
        </p>
        {placed && (
          <p className="mt-4 rounded-lg bg-stone-100 p-3 text-sm">
            {order.email_sent
              ? `A confirmation email has been sent to ${order.email}.`
              : "Your order is saved, but we couldn't send the confirmation email."}
          </p>
        )}

        <ul className="mt-6 divide-y divide-stone-200">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>{formatPrice(Number(item.unit_price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(Number(order.total))}</span>
        </div>

        <p className="mt-6 text-sm text-stone-600">
          Shipping to {order.full_name}, {order.address}, {order.city}
        </p>
      </div>
      <Link href="/" className="mt-6 inline-block text-orange-600 hover:underline">
        ← Continue shopping
      </Link>
    </div>
  );
}
