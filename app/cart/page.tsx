"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/types";

export default function CartPage() {
  const { items, ready, subtotal, setQuantity, remove } = useCart();

  if (!ready) return null;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/" className="mt-4 inline-block text-orange-600 hover:underline">
          Continue shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="mb-6 text-2xl font-bold">Your cart</h1>
        <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 p-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                <Image src={item.imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-stone-500">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center rounded-lg border border-stone-300">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  className="px-3 py-1"
                >
                  −
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-1"
                >
                  +
                </button>
              </div>
              <p className="w-20 text-right font-medium">{formatPrice(item.price * item.quantity)}</p>
              <button onClick={() => remove(item.productId)} className="text-sm text-stone-400 hover:text-red-600">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="h-fit rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-sm text-stone-500">Shipping is free. Pay on delivery.</p>
        <Link
          href="/checkout"
          className="mt-6 block rounded-lg bg-orange-600 px-4 py-3 text-center font-medium text-white hover:bg-orange-700"
        >
          Go to checkout
        </Link>
      </aside>
    </div>
  );
}
