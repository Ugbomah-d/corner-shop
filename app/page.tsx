import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProducts } from "@/lib/products";
import { formatPrice, type Product } from "@/lib/types";

export default async function Home() {
  let products: Product[] | null = null;
  let error = false;
  try {
    products = await getProducts();
  } catch {
    error = true;
  }

  return (
    <>
      <section className="mb-10 rounded-2xl bg-stone-900 px-8 py-12 text-white">
        <p className="text-sm uppercase tracking-widest text-orange-400">New season</p>
        <h1 className="mt-2 max-w-xl text-4xl font-bold tracking-tight">
          Everyday goods, delivered to your door.
        </h1>
        <p className="mt-3 max-w-lg text-stone-300">Pay on delivery. Free returns within 30 days.</p>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">
          Couldn&apos;t load products. Check your Supabase settings and run supabase/schema.sql.
        </p>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((p) => (
          <article key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="relative aspect-square bg-stone-100">
              <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{p.name}</h2>
                <span className="font-semibold text-orange-600">{formatPrice(Number(p.price))}</span>
              </div>
              <p className="flex-1 text-sm text-stone-600">{p.description}</p>
              <AddToCartButton product={p} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
