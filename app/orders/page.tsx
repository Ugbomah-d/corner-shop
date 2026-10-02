import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/types";

export default async function OrdersPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/orders");
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">My orders</h1>
      {!orders?.length ? (
        <p className="text-stone-600">
          No orders yet.{" "}
          <Link href="/" className="text-orange-600 hover:underline">
            Start shopping
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`} className="flex justify-between p-4 hover:bg-stone-50">
                <span>
                  <span className="font-medium">#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span className="ml-3 text-sm text-stone-500">{new Date(o.created_at).toLocaleDateString()}</span>
                </span>
                <span className="font-medium">{formatPrice(Number(o.total))}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
